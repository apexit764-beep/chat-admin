import { useState } from 'react';
import { Check, Eye, FileText, MoreHorizontal, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/useUIStore';
import {
  FX, poNo, useVendorsAdminStore, type Payout, type VCurrency, type Vendor,
} from '@/store/useVendorsAdminStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FieldHint } from '@/components/ui/field-hint';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { isTransferRef, lengthBetween, MAX_RECEIPT_MB } from '@/utils/vendorValidation';

const PILL: Record<string, string> = {
  'معلّقة': 'bg-amber-100 text-amber-800',
  'متاحة': 'bg-green-100 text-green-700',
  'ملغاة': 'bg-red-100 text-red-700',
  'بانتظار المراجعة': 'bg-amber-100 text-amber-800',
  'مرفوض': 'bg-red-100 text-red-700',
  'تم التحويل': 'bg-violet-100 text-violet-700',
  'ملغي': 'bg-slate-100 text-slate-600',
  'نشط': 'bg-green-100 text-green-700',
  'مجمّد': 'bg-red-100 text-red-700',
  'اشترك': 'bg-green-100 text-green-700',
  'دعوة مرسلة': 'bg-slate-100 text-slate-600',
  'سجل': 'bg-blue-100 text-blue-700',
  'استرد المبلغ': 'bg-red-100 text-red-700',
  'رابط': 'bg-violet-100 text-violet-700',
  'دعوة': 'bg-slate-100 text-slate-600',
  'الافتراضي': 'bg-green-100 text-green-700',
  'حساب بنكي': 'bg-blue-100 text-blue-700',
  'محفظة إلكترونية': 'bg-green-100 text-green-700',
  PayPal: 'bg-violet-100 text-violet-700',
};

export function StatusPill({ text }: { text: string }): JSX.Element {
  return (
    <span className={cn('inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold', PILL[text] ?? 'bg-slate-100 text-slate-600')}>
      {text}
    </span>
  );
}

export function Money({ v, cur }: { v: number; cur: VCurrency }): JSX.Element {
  return (
    <span className="whitespace-nowrap">
      <bdi dir="ltr">{v.toLocaleString('en-US', { maximumFractionDigits: 3 })}</bdi> {FX[cur].sym}
    </span>
  );
}

export function Note({ tone = 'info', children }: { tone?: 'info' | 'warn' | 'error'; children: React.ReactNode }): JSX.Element {
  const tones = { info: 'border-blue-200 bg-blue-50 text-blue-800', warn: 'border-amber-200 bg-amber-50 text-amber-800', error: 'border-red-200 bg-red-50 text-red-800' };
  return <div className={cn('rounded-lg border px-3 py-2.5 text-xs leading-relaxed', tones[tone])}>{children}</div>;
}

export function MiniStat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: 'amber' | 'green' | 'blue' }): JSX.Element {
  const bg = tone === 'amber' ? 'bg-amber-50' : tone === 'green' ? 'bg-emerald-50' : tone === 'blue' ? 'bg-blue-50' : 'bg-card';
  return (
    <div className={cn('rounded-xl border p-4', bg)}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  );
}

/* ---------- payout decisions ---------- */

type Dialogs = { kind: 'approve' | 'reject' | 'execute' | 'receipt' | 'reason'; payout: Payout } | null;

/** approve opens the request data, then the transfer details are entered; a single admin user does both */
export function PayoutsTable({ list, showVendor }: { list: Payout[]; showVendor: boolean }): JSX.Element {
  const vendors = useVendorsAdminStore((s) => s.vendors);
  const [dlg, setDlg] = useState<Dialogs>(null);
  const vendorOf = (p: Payout): Vendor => vendors.find((v) => v.id === p.vid) as Vendor;

  if (list.length === 0) return <p className="p-4 text-sm text-muted-foreground">لا توجد طلبات.</p>;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {['#', ...(showVendor ? ['المورد'] : []), 'المبلغ', 'التاريخ', 'الحالة', 'المنفّذ', ''].map((h, i) => (
              <TableHead key={i} className="text-start">
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((p) => {
            const v = vendorOf(p);
            return (
              <TableRow key={p.id}>
                <TableCell>{poNo(p.id)}</TableCell>
                {showVendor && <TableCell>{v.name}</TableCell>}
                <TableCell>
                  <Money v={p.amt} cur={v.cur} />
                </TableCell>
                <TableCell>{p.date}</TableCell>
                <TableCell>
                  <StatusPill text={p.st} />
                </TableCell>
                <TableCell className="text-xs">{p.executedBy || p.reviewedBy || '—'}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {p.st !== 'ملغي' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="الإجراءات">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {p.st === 'بانتظار المراجعة' && (
                          <>
                            <DropdownMenuItem onClick={() => setDlg({ kind: 'approve', payout: p })}>
                              <Check className="me-2 h-4 w-4 text-emerald-600" />
                              موافقة
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDlg({ kind: 'reject', payout: p })}>
                              <XCircle className="me-2 h-4 w-4" />
                              رفض
                            </DropdownMenuItem>
                          </>
                        )}
                        {p.st === 'تم التحويل' && (
                          <DropdownMenuItem onClick={() => setDlg({ kind: 'receipt', payout: p })}>
                            <FileText className="me-2 h-4 w-4" />
                            صورة التحويل
                          </DropdownMenuItem>
                        )}
                        {p.st === 'مرفوض' && (
                          <DropdownMenuItem onClick={() => setDlg({ kind: 'reason', payout: p })}>
                            <Eye className="me-2 h-4 w-4" />
                            عرض سبب الرفض
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {dlg?.kind === 'approve' && <ApproveDialog payout={dlg.payout} vendor={vendorOf(dlg.payout)} onClose={() => setDlg(null)} onApproved={() => setDlg({ kind: 'execute', payout: dlg.payout })} />}
      {dlg?.kind === 'reject' && <RejectDialog payout={dlg.payout} onClose={() => setDlg(null)} />}
      {dlg?.kind === 'execute' && <ExecuteDialog payout={dlg.payout} vendor={vendorOf(dlg.payout)} onClose={() => setDlg(null)} />}
      {dlg?.kind === 'receipt' && <ReceiptDialog payout={dlg.payout} vendor={vendorOf(dlg.payout)} onClose={() => setDlg(null)} />}
      {dlg?.kind === 'reason' && (
        <Dialog open onOpenChange={(o) => !o && setDlg(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>سبب الرفض · {poNo(dlg.payout.id)}</DialogTitle>
            </DialogHeader>
            <p className="text-sm leading-relaxed">{dlg.payout.reason}</p>
            <p className="text-xs text-muted-foreground">رفضه: {dlg.payout.reviewedBy || '—'} · {dlg.payout.date}</p>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function ApproveDialog({ payout, vendor, onClose, onApproved }: { payout: Payout; vendor: Vendor; onClose: () => void; onApproved: () => void }): JSX.Element {
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>موافقة على طلب السحب · {poNo(payout.id)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5 rounded-xl border p-4 text-sm">
          <div>المورد: <b>{vendor.name}</b></div>
          <div>المبلغ: <b><Money v={payout.amt} cur={vendor.cur} /></b></div>
          <div>تاريخ الطلب: <b>{payout.date}</b></div>
          <div>طريقة التحويل: <b>{payout.acct}</b></div>
        </div>
        <Note>اضغط "تنفيذ التحويل" ثم أدخل رقم العملية وصورة التحويل لإغلاق الطلب.</Note>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={onApproved}>تنفيذ التحويل</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RejectDialog({ payout, onClose }: { payout: Payout; onClose: () => void }): JSX.Element {
  const reject = useVendorsAdminStore((s) => s.rejectPayout);
  const showToast = useUIStore((s) => s.showToast);
  const [reason, setReason] = useState('');
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>رفض طلب السحب</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>سبب الرفض *</Label>
          <Textarea rows={3} maxLength={300} value={reason} onChange={(e) => setReason(e.target.value)} />
          <FieldHint>مطلوب. من 3 إلى 300 حرف، ويظهر للمورد كما كُتب.</FieldHint>
        </div>
        <Note>يعود المبلغ "متاح" لدى المورد، ويرى سبب الرفض.</Note>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (!lengthBetween(reason, 3, 300)) return showToast('السبب مطلوب، من 3 إلى 300 حرف', 'error');
              reject(payout.id, reason.trim());
              onClose();
            }}
          >
            رفض
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ExecuteDialog({ payout, vendor, onClose }: { payout: Payout; vendor: Vendor; onClose: () => void }): JSX.Element {
  const execute = useVendorsAdminStore((s) => s.executePayout);
  const showToast = useUIStore((s) => s.showToast);
  const [ref, setRef] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const submit = (): void => {
    if (!ref.trim() || !file) return showToast('رقم العملية وصورة التحويل مطلوبان', 'error');
    if (!isTransferRef(ref)) return showToast('رقم العملية: حروف إنجليزية وأرقام وشرطة فقط، من 4 إلى 40 خانة', 'error');
    if (!(file.type.startsWith('image/') || file.type === 'application/pdf')) return showToast('الملف يجب أن يكون صورة أو PDF', 'error');
    if (file.size > MAX_RECEIPT_MB * 1024 * 1024) return showToast(`حجم الملف يتجاوز ${MAX_RECEIPT_MB} ميجابايت`, 'error');
    const done = (img: string): void => {
      execute(payout.id, ref.trim(), file.name, img);
      showToast('تم، وسيرى المورد صورة التحويل');
      onClose();
    };
    if (file.type.startsWith('image/')) {
      const r = new FileReader();
      r.onload = (e) => done(String(e.target?.result ?? ''));
      r.readAsDataURL(file);
    } else done('');
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>تنفيذ التحويل</DialogTitle>
        </DialogHeader>
        <div className="text-sm">
          المورد: <b>{vendor.name}</b> · <b><Money v={payout.amt} cur={vendor.cur} /></b>
          <div className="text-muted-foreground">إلى: {payout.acct}</div>
        </div>
        <div className="space-y-1.5">
          <Label>رقم العملية *</Label>
          <Input dir="ltr" maxLength={40} value={ref} onChange={(e) => setRef(e.target.value)} />
          <FieldHint>مطلوب. حروف إنجليزية وأرقام وشرطة (-) فقط، من 4 إلى 40 خانة، بدون مسافات.</FieldHint>
        </div>
        <div className="space-y-1.5">
          <Label>صورة التحويل *</Label>
          <Input type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <FieldHint>مطلوب. صورة (PNG أو JPG) أو ملف PDF، بحد أقصى {MAX_RECEIPT_MB} ميجابايت.</FieldHint>
        </div>
        <Note tone="warn">لا يمكن إغلاق الطلب بحالة "تم التحويل" دون رقم العملية وصورة التحويل.</Note>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={submit}>تأكيد التحويل</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReceiptDialog({ payout, vendor, onClose }: { payout: Payout; vendor: Vendor; onClose: () => void }): JSX.Element {
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>صورة التحويل · {poNo(payout.id)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          <div>المبلغ: <b><Money v={payout.amt} cur={vendor.cur} /></b></div>
          <div>رقم العملية: <b dir="ltr" className="inline-block">{payout.ref}</b></div>
          <div className="text-muted-foreground">راجعه ونفّذه: {payout.executedBy || payout.reviewedBy}</div>
          {payout.img ? <img src={payout.img} alt="صورة التحويل" className="max-h-56 rounded-lg border" /> : <Note>ملف مرفق: {payout.fileName}</Note>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { FieldHint };
