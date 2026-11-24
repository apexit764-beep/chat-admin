import { useMemo, useState } from 'react';
import { Banknote, Clock, Eye, Hourglass, PiggyBank, Wallet } from 'lucide-react';
import { useVendorStore, sumsFor, type Payout } from '@v/store/useVendorStore';
import { FX, toLocal } from '@v/lib/vendorMath';
import { useUIStore } from '@/store/useUIStore';
import { FieldHint, FilterTabs, Money, Note, PageHeader, Pager, Stat, StatusPill } from '@v/components/ui-bits';
import { decimalsAtMost3 } from '@v/lib/validation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const TABS: [string, string][] = [
  ['all', 'الكل'],
  ['بانتظار المراجعة', 'بانتظار المراجعة'],
  ['تم التحويل', 'تم التحويل'],
  ['مرفوض', 'مرفوض'],
  ['ملغي', 'ملغي'],
];
const PAGE_SIZE = 6;

const poNo = (id: number): string => `PO-${String(id).padStart(4, '0')}`;

export default function Payouts(): JSX.Element {
  const { vendors, meId, comms, payouts, settings, requestPayout, cancelPayout } = useVendorStore();
  const showToast = useUIStore((s) => s.showToast);
  const v = vendors.find((x) => x.id === meId)!;
  const s = sumsFor(v.id, comms, payouts);
  const mine = payouts.filter((p) => p.vid === v.id);
  const min = toLocal(settings.min, v.cur);
  const open = mine.find((p) => p.st === 'بانتظار المراجعة');
  const defaultAcc = v.accounts.find((a) => a.isDefault) ?? v.accounts[0];

  const [amount, setAmount] = useState('');
  const [accId, setAccId] = useState<string>(String(defaultAcc?.id ?? ''));
  const [confirming, setConfirming] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => mine.filter((p) => tab === 'all' || p.st === tab), [mine, tab]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE);
  const [reasonOf, setReasonOf] = useState<Payout | null>(null);
  const [receiptOf, setReceiptOf] = useState<Payout | null>(null);
  const [cancelOf, setCancelOf] = useState<Payout | null>(null);

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
    setFormOpen(false);
    setConfirming(true);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="السحب"
        desc="اطلب سحب الرصيد المتاح، وسيراجعه فريق Qhub ويحوّله إلى حسابك"
        actions={
          <Button className="gap-2" onClick={() => setFormOpen(true)}>
            <Wallet className="h-4 w-4" />
            طلب سحب
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat icon={PiggyBank} label="إجمالي الرصيد" value={<Money v={Math.round((s.avail + s.inReview + s.pending + s.paid) * 1000) / 1000} cur={v.cur} />} />
        <Stat icon={Wallet} tone="green" label="متاح للسحب" value={<Money v={s.avail} cur={v.cur} />} />
        <Stat icon={Hourglass} tone="blue" label="طلبات سحب قيد المراجعة" value={<Money v={s.inReview} cur={v.cur} />} />
        <Stat icon={Clock} tone="amber" label="معلّقة" value={<Money v={s.pending} cur={v.cur} />} />
        <Stat icon={Banknote} label="الأرصدة المستلمة" value={<Money v={s.paid} cur={v.cur} />} />
      </div>

      <Card className="overflow-hidden shadow-sm">
        <CardHeader className="flex flex-col gap-3 space-y-0 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">طلباتي</CardTitle>
            <CardDescription>كل طلبات السحب وحالة كل طلب</CardDescription>
          </div>
          <FilterTabs
            tabs={TABS}
            value={tab}
            onChange={(k) => {
              setTab(k);
              setPage(1);
            }}
            count={(k) => mine.filter((p) => k === 'all' || p.st === k).length}
          />
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <p className="border-t p-8 text-center text-sm text-muted-foreground">لا توجد طلبات.</p>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  {['#', 'المبلغ', 'التاريخ', 'الحالة', ''].map((h, i) => (
                    <TableHead key={i} className="text-start">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {shown.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{poNo(p.id)}</TableCell>
                    <TableCell>
                      <Money v={p.amt} cur={v.cur} />
                    </TableCell>
                    <TableCell>{p.date}</TableCell>
                    <TableCell>
                      <StatusPill text={p.st} />
                    </TableCell>
                    <TableCell>
                      {p.reason && (
                        <Button size="icon" variant="outline" className="h-8 w-8" aria-label="عرض السبب" title="عرض السبب" onClick={() => setReasonOf(p)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {p.st === 'بانتظار المراجعة' && (
                        <Button size="sm" variant="outline" onClick={() => setCancelOf(p)}>
                          إلغاء الطلب
                        </Button>
                      )}
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
          <Pager page={cur} pages={pages} total={filtered.length} size={PAGE_SIZE} onPage={setPage} />
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>طلب سحب جديد</DialogTitle>
            <p className="text-sm text-muted-foreground">يُراجع فريق Qhub الطلب ويحوّل المبلغ إلى الحساب الذي تختاره</p>
          </DialogHeader>
          <div className="space-y-4">
          <div className="grid items-end gap-3">
            <div className="space-y-1.5">
              <Label>المبلغ ({FX[v.cur].sym})</Label>
              <Input dir="ltr" inputMode="decimal" disabled={!!why} placeholder={`من ${min} إلى ${s.avail}`} value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))} />
              <FieldHint>مطلوب. رقم أكبر من صفر، من الحد الأدنى ({min} {FX[v.cur].sym}) إلى المتاح ({s.avail} {FX[v.cur].sym})، بحد أقصى 3 خانات عشرية.</FieldHint>
            </div>
            <div className="text-xs leading-relaxed text-muted-foreground">
              المتاح للسحب = <b className="text-foreground"><Money v={s.avail} cur={v.cur} /></b> ،، الحد الأدنى للسحب = <b className="text-foreground"><Money v={min} cur={v.cur} /></b>
            </div>
          </div>
          {v.accounts.length > 0 && (
            <div className="space-y-1.5">
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              إلغاء
            </Button>
            <Button disabled={!!why} onClick={start}>
              طلب سحب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <Button variant="outline" onClick={() => { setConfirming(false); setFormOpen(true); }}>
              رجوع
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

      <Dialog open={!!cancelOf} onOpenChange={(o) => !o && setCancelOf(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إلغاء طلب السحب · {cancelOf && poNo(cancelOf.id)}</DialogTitle>
          </DialogHeader>
          <div className="text-sm">
            ستلغي طلب سحب <b>{cancelOf && <Money v={cancelOf.amt} cur={v.cur} />}</b>
            <div className="mt-1.5 text-muted-foreground">إلى: {cancelOf?.acct}</div>
          </div>
          <Note>يعود المبلغ إلى رصيدك المتاح، ويمكنك تقديم طلب جديد. لا يمكن إلغاء الطلب بعد مراجعته.</Note>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOf(null)}>
              تراجع
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                cancelPayout(cancelOf!.id);
                setCancelOf(null);
                showToast('تم إلغاء الطلب');
              }}
            >
              إلغاء الطلب
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
