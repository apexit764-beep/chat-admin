import { useState } from 'react';
import { Eye } from 'lucide-react';
import { useVendorStore, sumsFor, type Payout } from '@v/store/useVendorStore';
import { FX, toLocal } from '@v/lib/vendorMath';
import { useUIStore } from '@/store/useUIStore';
import { FieldHint, Money, Note, PageHeader, Stat, StatusPill } from '@v/components/ui-bits';
import { decimalsAtMost3 } from '@v/lib/validation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const poNo = (id: number): string => `PO-${String(id).padStart(4, '0')}`;

export default function Payouts(): JSX.Element {
  const { vendors, meId, comms, payouts, settings, requestPayout } = useVendorStore();
  const showToast = useUIStore((s) => s.showToast);
  const v = vendors.find((x) => x.id === meId)!;
  const s = sumsFor(v.id, comms, payouts);
  const mine = payouts.filter((p) => p.vid === v.id);
  const min = toLocal(settings.min, v.cur);
  const open = mine.find((p) => p.st === 'بانتظار المراجعة' || p.st === 'تمت الموافقة');
  const defaultAcc = v.accounts.find((a) => a.isDefault) ?? v.accounts[0];

  const [amount, setAmount] = useState('');
  const [accId, setAccId] = useState<string>(String(defaultAcc?.id ?? ''));
  const [confirming, setConfirming] = useState(false);
  const [reasonOf, setReasonOf] = useState<Payout | null>(null);
  const [receiptOf, setReceiptOf] = useState<Payout | null>(null);

  // the first reason that blocks a new withdrawal request
  const why = v.status === 'مجمّد' ? 'حسابك مجمّد.'
    : v.accounts.length === 0 ? 'أضف بيانات التحويل من صفحة "حسابي" أولًا.'
    : v.bankLock ? 'تغيّرت بيانات التحويل مؤخرًا، والسحب متوقف لمدة 48 ساعة.'
    : open ? 'لديك طلب سحب مفتوح، انتظر حتى يُغلق.'
    : s.avail < min ? `الرصيد المتاح أقل من الحد الأدنى (${min} ${FX[v.cur].sym}).`
    : '';

  const amt = Number(amount);
  const account = v.accounts.find((a) => String(a.id) === accId);

  const start = (): void => {
    if (!(amt > 0)) return showToast('أدخل مبلغًا أكبر من صفر', 'error');
    if (!decimalsAtMost3(amt)) return showToast('المبلغ بحد أقصى 3 خانات عشرية', 'error');
    if (amt < min) return showToast('المبلغ أقل من الحد الأدنى', 'error');
    if (amt > s.avail) return showToast('المبلغ أكبر من الرصيد المتاح', 'error');
    if (!account) return showToast('اختر حساب التحويل', 'error');
    setConfirming(true);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="السحب" desc="اطلب سحب الرصيد المتاح، وسيراجعه فريق Qhub ويحوّله إلى حسابك" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="إجمالي الرصيد" value={<Money v={Math.round((s.avail + s.inReview + s.pending + s.paid) * 1000) / 1000} cur={v.cur} />} />
        <Stat tone="green" label="متاح للسحب" value={<Money v={s.avail} cur={v.cur} />} />
        <Stat tone="blue" label="طلبات سحب قيد المراجعة" value={<Money v={s.inReview} cur={v.cur} />} />
        <Stat tone="amber" label="معلّقة" value={<Money v={s.pending} cur={v.cur} />} />
        <Stat label="الأرصدة المستلمة" value={<Money v={s.paid} cur={v.cur} />} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">طلب سحب جديد</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid items-end gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>المبلغ ({FX[v.cur].sym})</Label>
              <Input dir="ltr" inputMode="decimal" disabled={!!why} placeholder={`من ${min} إلى ${s.avail}`} value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))} />
              <FieldHint>مطلوب. رقم أكبر من صفر، من الحد الأدنى ({min} {FX[v.cur].sym}) إلى المتاح ({s.avail} {FX[v.cur].sym})، بحد أقصى 3 خانات عشرية.</FieldHint>
            </div>
            <div className="text-xs leading-relaxed text-muted-foreground">
              المتاح: <b className="text-foreground"><Money v={s.avail} cur={v.cur} /></b> · الحد الأدنى: <Money v={min} cur={v.cur} />
            </div>
          </div>
          {v.accounts.length > 0 && (
            <div className="max-w-md space-y-1.5">
              <Label>التحويل إلى</Label>
              <Select value={accId} onValueChange={setAccId} disabled={!!why}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {v.accounts.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.type} · {a.details}
                      {a.isDefault ? ' (الافتراضي)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldHint>مطلوب. اختر أحد حسابات التحويل المضافة في صفحة "حسابي"، والافتراضي محدد مسبقًا.</FieldHint>
            </div>
          )}
          {why && <Note tone="warn">{why}</Note>}
          <Button disabled={!!why} onClick={start}>
            طلب سحب
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">طلباتي</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {mine.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">لا توجد طلبات.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {['#', 'المبلغ', 'التاريخ', 'الحالة', ''].map((h, i) => (
                    <TableHead key={i} className="text-start">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mine.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{poNo(p.id)}</TableCell>
                    <TableCell>
                      <Money v={p.amt} cur={v.cur} />
                    </TableCell>
                    <TableCell>{p.date}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5">
                        <StatusPill text={p.st} />
                        {p.reason && (
                          <Button size="icon" variant="outline" className="h-7 w-7" aria-label="عرض السبب" title="عرض السبب" onClick={() => setReasonOf(p)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      {p.st === 'تم التحويل' && (
                        <Button size="sm" variant="outline" onClick={() => setReceiptOf(p)}>
                          صورة التحويل
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تأكيد طلب السحب</DialogTitle>
          </DialogHeader>
          <div className="text-sm">
            ستطلب سحب <b><Money v={amt} cur={v.cur} /></b>
            <div className="mt-1.5 text-muted-foreground">إلى: {account?.type} · {account?.details}</div>
          </div>
          <Note>يراجع فريق Qhub الطلب، وبعد الموافقة يتم التحويل وتصلك صورة التحويل.</Note>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirming(false)}>
              إلغاء
            </Button>
            <Button
              onClick={() => {
                requestPayout(amt, account!.id);
                setConfirming(false);
                setAmount('');
                showToast('تم إرسال الطلب');
              }}
            >
              تأكيد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!reasonOf} onOpenChange={(o) => !o && setReasonOf(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>سبب الرفض · {reasonOf && poNo(reasonOf.id)}</DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-relaxed">{reasonOf?.reason}</p>
          <p className="text-xs text-muted-foreground">{reasonOf?.date}</p>
        </DialogContent>
      </Dialog>

      <Dialog open={!!receiptOf} onOpenChange={(o) => !o && setReceiptOf(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>صورة التحويل · {receiptOf && poNo(receiptOf.id)}</DialogTitle>
          </DialogHeader>
          {receiptOf && (
            <div className="space-y-2 text-sm">
              <div>المبلغ: <b><Money v={receiptOf.amt} cur={v.cur} /></b></div>
              <div>رقم العملية: <b dir="ltr" className="inline-block">{receiptOf.ref}</b></div>
              <Note>ملف مرفق: {receiptOf.fname}</Note>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
