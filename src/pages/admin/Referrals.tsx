import { useEffect, useState } from 'react';
import { Coins, Gift, Power, Save, UserCheck, UserPlus, Users } from 'lucide-react';
import { DataTable, StatCard, type Column } from '@components/ui';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminStore } from '@/store/useAdminStore';
import { avatarColor, formatDate } from '@/utils/format';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUIStore } from '@/store/useUIStore';
import { TIERS, statsFor, useReferralsStore, type PlanTier, type Referral } from '@/store/useReferralsStore';
import { Note } from '@/components/admin/vendors/VendorBits';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const MAX_POINTS = 1_000_000;
type Cycle = 'monthly' | 'yearly';
type Form = { on: boolean; points: Record<PlanTier, Record<Cycle, string>>; redeem: Record<string, Record<Cycle, string>> };
const toForm = (s: { on: boolean; points: Record<PlanTier, Record<Cycle, number>>; redeem: Record<string, Partial<Record<Cycle, number>>> }): Form => ({
  on: s.on,
  points: Object.fromEntries(TIERS.map(([k]) => [k, { monthly: String(s.points[k].monthly), yearly: String(s.points[k].yearly) }])) as Record<PlanTier, Record<Cycle, string>>,
  redeem: Object.fromEntries(Object.entries(s.redeem).map(([k, v]) => [k, { monthly: v.monthly === undefined ? '' : String(v.monthly), yearly: v.yearly === undefined ? '' : String(v.yearly) }])),
});
const fmt = (n: number): string => n.toLocaleString('en-US');

const PointsInput = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }): JSX.Element => (
  <div className="relative w-28">
    <Input dir="ltr" inputMode="numeric" className="h-8 pl-10 text-right text-sm font-semibold" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-[11px] text-muted-foreground">نقطة</span>
  </div>
);

interface GridRow { key: string; label: string; dot: string; monthly: string; yearly: string }
/** plans as rows, billing cycles as columns: one table style for both point boxes */
function PointsGrid({ rows, onChange, empty }: { rows: GridRow[]; onChange: (key: string, c: Cycle, v: string) => void; empty?: string }): JSX.Element {
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow className="h-9">
          <TableHead className="h-9 w-[40%] text-start">الباقة</TableHead>
          <TableHead className="h-9 w-[30%] text-start">شهري</TableHead>
          <TableHead className="h-9 w-[30%] text-start">سنوي</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.key}>
            <TableCell className="py-1.5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className={cn('h-2.5 w-2.5 rounded-full', r.dot)} />
                {r.label}
              </div>
            </TableCell>
            <TableCell className="py-1.5"><PointsInput value={r.monthly} placeholder={empty} onChange={(v) => onChange(r.key, 'monthly', v)} /></TableCell>
            <TableCell className="py-1.5"><PointsInput value={r.yearly} placeholder={empty} onChange={(v) => onChange(r.key, 'yearly', v)} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface RefRow { id: string; name: string; email: string; registered: number; subscribed: number; points: number; remaining: number }

export default function Referrals(): JSX.Element {
  const navigate = useNavigate();
  const { settings, referrals, redemptions, saveSettings } = useReferralsStore();
  const plans = useAdminStore((s) => s.plans);
  const clients = useAdminStore((s) => s.clients);
  const showToast = useUIStore((s) => s.showToast);
  const [d, setD] = useState<Form>(toForm(settings));
  const [list, setList] = useState<{ referrerId: string; kind: 'reg' | 'sub' | 'pending' } | null>(null);
  useEffect(() => setD(toForm(settings)), [settings]);

  // the plans a client can see and buy: no trial, no contact-sales, no internal ones
  const shown = plans.filter((p) => !p.isTrial && !p.requiresContact && !p.adminOnly);
  const nameOf = (id: string): string => clients.find((c) => c.id === id)?.companyName ?? '—';
  const tierName = (t?: string): string => TIERS.find(([k]) => k === t)?.[1] ?? '—';
  const referrerIds = [...new Set(referrals.map((r) => r.referrerId))];

  const dirty =
    d.on !== settings.on ||
    TIERS.some(([k]) => d.points[k].monthly !== String(settings.points[k].monthly) || d.points[k].yearly !== String(settings.points[k].yearly)) ||
    shown.some((p) => (['monthly', 'yearly'] as const).some((c) => (d.redeem[p.id]?.[c] ?? '') !== (settings.redeem[p.id]?.[c] === undefined ? '' : String(settings.redeem[p.id]?.[c]))));
  const set = (k: PlanTier, c: Cycle, v: string): void => setD((s) => ({ ...s, points: { ...s.points, [k]: { ...s.points[k], [c]: v.replace(/[^\d]/g, '') } } }));
  const setRedeem = (id: string, c: Cycle, v: string): void => setD((s) => ({ ...s, redeem: { ...s.redeem, [id]: { ...(s.redeem[id] ?? { monthly: '', yearly: '' }), [c]: v.replace(/[^\d]/g, '') } } }));

  const save = (): void => {
    const next = Object.fromEntries(TIERS.map(([k]) => [k, { monthly: Number(d.points[k].monthly), yearly: Number(d.points[k].yearly) }])) as Record<PlanTier, Record<Cycle, number>>;
    const all = Object.values(next).flatMap((v) => [v.monthly, v.yearly]);
    if (!all.every((x) => Number.isInteger(x) && x > 0)) return showToast('يجب أن تكون النقاط أرقامًا صحيحة أكبر من صفر', 'error');
    if (all.some((x) => x > MAX_POINTS)) return showToast('النقاط من 1 إلى 1,000,000 نقطة', 'error');
    const redeem: Record<string, { monthly?: number; yearly?: number }> = {};
    for (const p of shown) {
      for (const c of ['monthly', 'yearly'] as const) {
        const raw = d.redeem[p.id]?.[c] ?? '';
        if (raw === '') continue; // empty = not available with points
        const n = Number(raw);
        if (!Number.isInteger(n) || n < 1 || n > MAX_POINTS) return showToast(`نقاط باقة ${p.nameAr} (${c === 'monthly' ? 'شهري' : 'سنوي'}) يجب أن تكون من 1 إلى 1,000,000، أو اتركها فارغة`, 'error');
        redeem[p.id] = { ...redeem[p.id], [c]: n };
      }
    }
    saveSettings({ on: d.on, points: next, redeem });
    showToast(d.on !== settings.on ? (d.on ? 'تم تشغيل البرنامج' : 'تم إيقاف البرنامج') : 'تم الحفظ');
  };

  const dlg = list ? referrals.filter((r: Referral) => r.referrerId === list.referrerId && (list.kind === 'reg' || (list.kind === 'sub') === (r.state === 'اشترك'))) : [];

  const rows: RefRow[] = referrerIds.map((id) => {
    const st = statsFor(id, referrals, redemptions);
    return { id, name: nameOf(id), email: clients.find((c) => c.id === id)?.email ?? '', registered: st.registered, subscribed: st.subscribed, points: st.points, remaining: st.remaining };
  });
  const chip = 'inline-flex min-w-9 items-center justify-center rounded-full px-2.5 py-1 text-sm font-semibold transition-colors';
  const columns: Column<RefRow>[] = [
    {
      key: 'name', header: 'المروّج', accessor: (r) => r.name,
      cell: (r) => (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-8 w-8">
            <AvatarFallback className={`text-xs font-bold ${avatarColor(r.name)}`}>{r.name.trim().charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold truncate">{r.name}</p>
            <p className="text-xs text-muted-foreground truncate">{r.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'registered', header: 'عدد المسجّلين', accessor: (r) => r.registered,
      cell: (r) => (
        <button type="button" className={cn(chip, 'bg-info/10 text-info hover:bg-info/20')} onClick={(e) => { e.stopPropagation(); setList({ referrerId: r.id, kind: 'reg' }); }}>{r.registered}</button>
      ),
    },
    {
      key: 'subscribed', header: 'عدد المشتركين', accessor: (r) => r.subscribed,
      cell: (r) => (
        <button type="button" className={cn(chip, 'bg-success/10 text-success hover:bg-success/20')} onClick={(e) => { e.stopPropagation(); setList({ referrerId: r.id, kind: 'sub' }); }}>{r.subscribed}</button>
      ),
    },
    {
      key: 'pending', header: 'عدد غير المشتركين', accessor: (r) => r.registered - r.subscribed,
      cell: (r) => (
        <button type="button" className={cn(chip, 'bg-warning/10 text-warning hover:bg-warning/20')} onClick={(e) => { e.stopPropagation(); setList({ referrerId: r.id, kind: 'pending' }); }}>{r.registered - r.subscribed}</button>
      ),
    },
    {
      key: 'conv', header: 'نسبة التحويل', accessor: (r) => (r.registered ? r.subscribed / r.registered : 0),
      cell: (r) => <span className="text-sm text-muted-foreground"><bdi dir="ltr">{r.registered ? Math.round((r.subscribed / r.registered) * 100) : 0}%</bdi></span>,
    },
    { key: 'points', header: 'النقاط المكتسبة', accessor: (r) => r.points, cell: (r) => <span className="font-semibold text-emerald-700"><bdi dir="ltr">{fmt(r.points)}</bdi></span> },
    { key: 'remaining', header: 'النقاط المتبقية', accessor: (r) => r.remaining, cell: (r) => <span className="font-semibold text-primary"><bdi dir="ltr">{fmt(r.remaining)}</bdi></span> },
  ];

  const totals = referrerIds.reduce(
    (t, id) => {
      const st = statsFor(id, referrals, redemptions);
      return { reg: t.reg + st.registered, sub: t.sub + st.subscribed, pts: t.pts + st.points };
    },
    { reg: 0, sub: 0, pts: 0 },
  );

  const tierTone: Record<string, string> = { starter: 'bg-sky-500', pro: 'bg-violet-500', business: 'bg-amber-500' };

  return (
    <div className="p-4 lg:p-6 space-y-4 page-fade">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">برنامج المروّجين</h2>
          <p className="text-sm text-muted-foreground">نقاط للعملاء الذين يجلبون مشتركين جددًا من خلال رابط الإحالة الخاص بهم</p>
        </div>
        <Button className="gap-2" disabled={!dirty} onClick={save}>
          <Save className="h-4 w-4" />
          حفظ التغييرات
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="المروّجون" value={referrerIds.length} icon={<Gift className="h-4 w-4" />} iconBg="bg-primary/10" iconColor="text-primary" />
        <StatCard label="إجمالي المسجّلين" value={totals.reg} icon={<UserPlus className="h-4 w-4" />} iconBg="bg-info/15" iconColor="text-info" />
        <StatCard label="إجمالي المشتركين" value={totals.sub} icon={<UserCheck className="h-4 w-4" />} iconBg="bg-success/15" iconColor="text-success" />
        <StatCard label="النقاط الموزّعة" value={fmt(totals.pts)} icon={<Coins className="h-4 w-4" />} iconBg="bg-warning/15" iconColor="text-warning" />
      </div>

      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', d.on ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground')}>
              <Power className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <b>تشغيل البرنامج</b>
                <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', d.on ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground')}>{d.on ? 'يعمل' : 'متوقف'}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">عند الإيقاف يختفي رابط الإحالة لدى العملاء، وتبقى النقاط المكتسبة سابقًا كما هي.</p>
            </div>
          </div>
          <Switch checked={d.on} onCheckedChange={(v) => setD((s) => ({ ...s, on: v }))} aria-label="تشغيل البرنامج" />
        </CardContent>
      </Card>

      <Note>أي تغيير في النقاط (المكتسبة أو المطلوبة للاشتراك) يُطبَّق على الاشتراكات الجديدة فقط، وتبقى النقاط المكتسبة سابقًا كما هي.</Note>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><Gift className="h-4 w-4 text-primary" />النقاط التي يكسبها المروّج</CardTitle>
            <p className="text-xs text-muted-foreground">تُضاف لرصيده مرة واحدة عند دفع المشترك الجديد، بحسب باقته ونوع اشتراكه.</p>
          </CardHeader>
          <CardContent className="p-0">
            <PointsGrid
              rows={TIERS.map(([k, name]) => ({ key: k, label: name, dot: tierTone[k], monthly: d.points[k].monthly, yearly: d.points[k].yearly }))}
              onChange={(k, c, v) => set(k as PlanTier, c, v)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><Coins className="h-4 w-4 text-warning" />النقاط المطلوبة للاشتراك</CardTitle>
            <p className="text-xs text-muted-foreground">ما يجب أن يجمعه المروّج ليشترك في الباقة. اتركه فارغًا لو الباقة غير متاحة بالنقاط.</p>
          </CardHeader>
          <CardContent className="p-0">
            <PointsGrid
              empty="غير متاحة"
              rows={shown.map((p) => ({ key: p.id, label: p.nameAr, dot: tierTone[p.tier] ?? 'bg-muted-foreground/40', monthly: d.redeem[p.id]?.monthly ?? '', yearly: d.redeem[p.id]?.yearly ?? '' }))}
              onChange={setRedeem}
            />
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={rows}
        columns={columns}
        rowKey={(r) => r.id}
        searchPlaceholder="ابحث باسم المروّج أو بريده..."
        searchAccessor={(r) => `${r.name} ${r.email}`}
        onRowClick={(r) => navigate(`/clients/${r.id}`)}
        pageSize={10}
      />

      <Dialog open={!!list} onOpenChange={(o) => !o && setList(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {list?.kind === 'sub' ? 'المشتركون' : list?.kind === 'pending' ? 'غير المشتركين' : 'المسجّلون'} من رابط {list ? nameOf(list.referrerId) : ''} ({dlg.length})
            </DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                {(list?.kind === 'sub' ? ['العميل', 'تاريخ الاشتراك', 'الباقة', 'النقاط'] : ['العميل', 'التاريخ', 'الحالة', 'النقاط']).map((h) => (
                  <TableHead key={h} className="text-start">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {dlg.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Link to={`/clients/${r.clientId}`} className="text-primary hover:underline">{nameOf(r.clientId)}</Link>
                  </TableCell>
                  <TableCell>{formatDate(r.at)}</TableCell>
                  <TableCell>{r.state === 'اشترك' ? `${tierName(r.tier)} · ${r.cycle ?? ''}` : 'غير مشترك'}</TableCell>
                  <TableCell><bdi dir="ltr">{r.points ? `+${fmt(r.points)}` : '—'}</bdi></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
}
