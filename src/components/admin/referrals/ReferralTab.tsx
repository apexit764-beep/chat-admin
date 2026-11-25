import { Copy, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { TIERS, referralLink, statsFor, useReferralsStore } from '@/store/useReferralsStore';
import { formatDate } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MiniStat, Note } from '@/components/admin/vendors/VendorBits';

const usd = (n: number): string => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** the «الترويج» tab of a client: its referral link, the people who signed up through it, and the points it earned */
export function ReferralTab({ clientId }: { clientId: string }): JSX.Element {
  const navigate = useNavigate();
  const clients = useAdminStore((s) => s.clients);
  const showToast = useUIStore((s) => s.showToast);
  const { settings, referrals, redemptions } = useReferralsStore();
  const mine = referrals.filter((r) => r.referrerId === clientId);
  const stats = statsFor(clientId, referrals, redemptions);
  const plans = useAdminStore((s) => s.plans);
  const myRedemptions = redemptions.filter((d) => d.referrerId === clientId);
  const planNameOf = (id: string): string => plans.find((p) => p.id === id)?.nameAr ?? '—';
  const nameOf = (id: string): string => clients.find((c) => c.id === id)?.companyName ?? '—';
  const subs = mine.filter((r) => r.state === 'اشترك');
  const regs = mine.filter((r) => r.state !== 'اشترك');
  const link = referralLink(clientId);
  const tierName = (t?: string): string => TIERS.find(([k]) => k === t)?.[1] ?? '—';
  const fmt = (n: number): string => n.toLocaleString('en-US');

  return (
    <div className="space-y-4">
      {!settings.on && <Note tone="warn">برنامج المروّجين متوقف، فلا يظهر رابط الإحالة للعميل. وتبقى النقاط المكتسبة سابقًا كما هي.</Note>}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">رابط الإحالة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3">
            <b dir="ltr" className="text-sm text-primary">{link}</b>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => {
                void navigator.clipboard?.writeText(link).catch(() => undefined);
                showToast('تم نسخ الرابط');
              }}
            >
              <Copy className="h-3.5 w-3.5" />
              نسخ
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <MiniStat label="سجّلوا من رابطه" value={stats.registered} />
        <MiniStat label="اشتركوا فعلًا" value={stats.subscribed} />
        <MiniStat tone="green" label="النقاط المكتسبة" value={fmt(stats.points)} />
        <MiniStat tone="blue" label="النقاط المتبقية" value={fmt(stats.remaining)} />
        <MiniStat label="متوسط النقاط لكل مشترك" value={stats.subscribed ? fmt(Math.round(stats.points / stats.subscribed)) : '—'} />
      </div>

      {mine.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <Gift className="h-10 w-10 text-muted-foreground/50" />
            <span>لا توجد إحالات لهذا العميل بعد.</span>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">المشتركون من رابطه ({subs.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    {['المشترك', 'تاريخ الاشتراك', 'الباقة', 'نوع الاشتراك', 'دفع', 'النقاط المكتسبة'].map((h) => (
                      <TableHead key={h} className="text-start">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subs.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">لا يوجد مشتركون بعد.</TableCell></TableRow>
                  )}
                  {subs.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <button className="text-primary hover:underline" onClick={() => navigate(`/clients/${r.clientId}`)}>{nameOf(r.clientId)}</button>
                      </TableCell>
                      <TableCell>{formatDate(r.at)}</TableCell>
                      <TableCell>{tierName(r.tier)}</TableCell>
                      <TableCell>{r.cycle}</TableCell>
                      <TableCell><bdi dir="ltr">{usd(r.paid ?? 0)}</bdi></TableCell>
                      <TableCell className="whitespace-nowrap font-semibold text-emerald-700"><bdi dir="ltr">+{fmt(r.points)}</bdi></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {regs.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">المسجّلون ولم يشتركوا ({regs.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {['الاسم', 'تاريخ التسجيل', 'الحالة'].map((h) => (
                        <TableHead key={h} className="text-start">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regs.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{nameOf(r.clientId)}</TableCell>
                        <TableCell>{formatDate(r.at)}</TableCell>
                        <TableCell><span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">سجّل ولم يشترك بعد</span></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">سجل النقاط</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    {['المصدر', 'النقاط', 'التاريخ', 'الباقة'].map((h) => (
                      <TableHead key={h} className="text-start">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRedemptions.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>اشتراك بالنقاط</TableCell>
                      <TableCell className="font-semibold text-destructive"><bdi dir="ltr">−{fmt(d.points)}</bdi></TableCell>
                      <TableCell>{formatDate(d.at)}</TableCell>
                      <TableCell>{planNameOf(d.planId)} · {d.cycle}</TableCell>
                    </TableRow>
                  ))}
                  {subs.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>من {nameOf(r.clientId)}</TableCell>
                      <TableCell className="font-semibold text-emerald-700"><bdi dir="ltr">+{fmt(r.points)}</bdi></TableCell>
                      <TableCell>{formatDate(r.at)}</TableCell>
                      <TableCell>{tierName(r.tier)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
