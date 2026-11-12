import { Copy, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { monthValueUsd, referralLink, statsFor, useReferralsStore } from '@/store/useReferralsStore';
import { formatDate } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MiniStat, Note, StatusPill } from '@/components/admin/vendors/VendorBits';

const usd = (n: number): string => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** the «الترويج» tab of a client: its referral link, the people who signed up through it, and its reward months */
export function ReferralTab({ clientId }: { clientId: string }): JSX.Element {
  const navigate = useNavigate();
  const clients = useAdminStore((s) => s.clients);
  const showToast = useUIStore((s) => s.showToast);
  const { settings, referrals, lots } = useReferralsStore();
  const mine = referrals.filter((r) => r.referrerId === clientId);
  const myLots = lots.filter((l) => l.referrerId === clientId);
  const stats = statsFor(clientId, referrals, lots);
  const nameOf = (id: string): string => clients.find((c) => c.id === id)?.companyName ?? '—';
  const subs = mine.filter((r) => r.state === 'اشترك');
  const regs = mine.filter((r) => r.state !== 'اشترك');
  const link = referralLink(clientId);
  /** a free month is worth one month of this client's own plan */
  const monthValue = monthValueUsd(clientId);

  return (
    <div className="space-y-4">
      {!settings.on && <Note tone="warn">برنامج المروّجين متوقف، فلا يظهر رابط الإحالة للعميل. وتستمر المكافآت المكتسبة سابقًا بشكل طبيعي.</Note>}

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

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MiniStat label="سجّلوا من رابطه" value={stats.registered} />
        <MiniStat label="اشتركوا فعلًا" value={stats.subscribed} />
        <MiniStat tone="green" label="الشهور المتبقية" value={stats.remaining} />
        <MiniStat tone="blue" label="الشهور المستخدمة" value={<span>{stats.usedMonths} <small className="text-sm font-normal">(<bdi dir="ltr">{usd(stats.usedMonths * monthValue)}</bdi>)</small></span>} />
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
                    {['المشترك', 'تاريخ الاشتراك', 'نوع الاشتراك', 'دفع', 'الشهور المكتسبة', 'قيمة الشهور'].map((h) => (
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
                      <TableCell>{r.cycle}</TableCell>
                      <TableCell><bdi dir="ltr">{usd(r.paid ?? 0)}</bdi></TableCell>
                      <TableCell>{r.months}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <bdi dir="ltr">{r.months > 1 ? `${r.months} × ` : ''}{usd(monthValue)}</bdi>
                      </TableCell>
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
              <CardTitle className="text-base">سجل الشهور</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    {['الشهر', 'المكافأة', 'اكتُسب في', 'الحالة'].map((h) => (
                      <TableHead key={h} className="text-start">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myLots.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>من {nameOf(l.fromClientId)}</TableCell>
                      <TableCell>شهر مجاني (<bdi dir="ltr">{usd(monthValue)}</bdi>)</TableCell>
                      <TableCell>{formatDate(l.earnedAt)}</TableCell>
                      <TableCell>
                        {l.st === 'مستخدم' ? <span className="inline-block whitespace-nowrap rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">استُخدم · {l.inv}</span> : <StatusPill text={l.st} />}
                      </TableCell>
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
