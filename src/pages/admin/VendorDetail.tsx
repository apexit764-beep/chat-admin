import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { FX, sumsFor, useVendorsAdminStore, type Commission } from '@/store/useVendorsAdminStore';
import { MiniStat, Money, Note, PayoutsTable, StatusPill } from '@/components/admin/vendors/VendorBits';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function VendorDetail(): JSX.Element {
  const { id } = useParams();
  const { vendors, clients, comms, payouts, cancelCommission } = useVendorsAdminStore();
  const showToast = useUIStore((s) => s.showToast);
  const [cancelOf, setCancelOf] = useState<Commission | null>(null);
  const [reason, setReason] = useState('');
  const v = vendors.find((x) => x.id === Number(id));

  if (!v) {
    return (
      <div className="p-6 space-y-3">
        <p className="text-muted-foreground">المورد غير موجود.</p>
        <Button asChild variant="outline">
          <Link to="/vendors">العودة إلى الموردين</Link>
        </Button>
      </div>
    );
  }

  const s = sumsFor(v.id, comms, payouts);
  const mine = clients.filter((c) => c.vid === v.id);
  const myComms = comms.filter((c) => c.vid === v.id);
  const myPayouts = payouts.filter((p) => p.vid === v.id);

  const closeCancel = (): void => {
    setCancelOf(null);
    setReason('');
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 page-fade">
      <Link to="/vendors" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowRight className="h-4 w-4" />
        الموردون
      </Link>
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          {v.name} <StatusPill text={v.status} />
        </h2>
        <p className="text-sm text-muted-foreground">
          {v.country} · {v.email} · <bdi dir="ltr">{v.phone}</bdi>
        </p>
      </div>

      {v.status === 'مجمّد' && <Note tone="error">المورد مجمّد: لا يمكنه طلب سحب، ولا تُسجل له عمولات جديدة.</Note>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MiniStat tone="amber" label="معلّقة (مدة التعليق)" value={<Money v={s.pending} cur={v.cur} />} />
        <MiniStat tone="green" label="متاحة للسحب" value={<Money v={s.avail} cur={v.cur} />} />
        <MiniStat tone="blue" label="في طلبات سحب" value={<Money v={s.inReview} cur={v.cur} />} />
        <MiniStat label="مدفوعة" value={<Money v={s.paid} cur={v.cur} />} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">حسابات التحويل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {v.accounts.length === 0 ? (
              <p className="text-sm text-muted-foreground">لم يُضف أي حساب بعد.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {v.accounts.map((a) => (
                  <li key={a.id} className="flex items-center gap-2">
                    <StatusPill text={a.type} />
                    <span>{a.details}</span>
                    {a.isDefault && <StatusPill text="الافتراضي" />}
                  </li>
                ))}
              </ul>
            )}
            {v.bankLock && <Note tone="warn">تغيّرت البيانات مؤخرًا، والسحب متوقف لمدة 48 ساعة.</Note>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">إعدادات العمولة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 text-sm">
            <div>نسبة العمولة: <b>{v.rate}%</b> من أول اشتراك</div>
            <div className="text-muted-foreground">العملة: {FX[v.cur].sym} (عملة دولة المورد)</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">العملاء</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {['العميل', 'طريقة الإضافة', 'الباقة', 'الدورة', 'الحالة', 'أول اشتراك', 'العمولة', 'حالة العمولة'].map((h) => (
                  <TableHead key={h} className="text-start">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {mine.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                    لا يوجد عملاء.
                  </TableCell>
                </TableRow>
              )}
              {mine.map((c) => {
                const k = myComms.find((x) => x.cid === c.id);
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      {c.name}
                      <div className="text-xs text-muted-foreground">{c.email}</div>
                    </TableCell>
                    <TableCell>
                      <StatusPill text={c.via} />
                    </TableCell>
                    <TableCell>{c.plan}</TableCell>
                    <TableCell>{c.cycle}</TableCell>
                    <TableCell>
                      <StatusPill text={c.state} />
                    </TableCell>
                    <TableCell>{k ? <Money v={k.base} cur={v.cur} /> : '—'}</TableCell>
                    <TableCell>{k ? <Money v={k.amt} cur={v.cur} /> : '—'}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {k ? (
                        <span className="inline-flex items-center gap-1.5">
                          <StatusPill text={k.st} />
                          {k.st === 'معلّقة' && <span className="text-xs text-muted-foreground">باقي {k.left} يوم</span>}
                          {(k.st === 'معلّقة' || k.st === 'متاحة') && (
                            <Button size="sm" variant="outline" onClick={() => setCancelOf(k)}>
                              إلغاء
                            </Button>
                          )}
                        </span>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">طلبات السحب</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <PayoutsTable list={myPayouts} showVendor={false} />
        </CardContent>
      </Card>

      <Dialog open={!!cancelOf} onOpenChange={(o) => !o && closeCancel()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إلغاء العمولة</DialogTitle>
          </DialogHeader>
          <div className="text-sm">
            عمولة <b>{clients.find((c) => c.id === cancelOf?.cid)?.name}</b>
          </div>
          <div className="space-y-1.5">
            <Label>السبب *</Label>
            <Textarea rows={3} placeholder="مثلًا: حساب وهمي" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeCancel}>
              رجوع
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!reason.trim()) return showToast('أدخل السبب', 'error');
                const r = cancelCommission(cancelOf!.id, reason.trim());
                if (!r.ok) return showToast(r.error, 'error');
                closeCancel();
                showToast('تم إلغاء العمولة');
              }}
            >
              إلغاء العمولة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
