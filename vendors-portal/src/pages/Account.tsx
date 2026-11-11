import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useVendorStore, type AccountType, type TransferAccount } from '@v/store/useVendorStore';
import { useUIStore } from '@/store/useUIStore';
import { Note, PageHeader, StatusPill } from '@v/components/ui-bits';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

/** fields per account type: [key, label] */
const FIELDS: Record<AccountType, [string, string][]> = {
  'حساب بنكي': [['b', 'اسم البنك'], ['n', 'رقم الحساب أو IBAN'], ['h', 'اسم صاحب الحساب']],
  'محفظة إلكترونية': [['b', 'اسم المحفظة (مثل: فودافون كاش، STC Pay)'], ['n', 'رقم المحفظة']],
  PayPal: [['n', 'البريد الإلكتروني لحساب PayPal']],
};
const OTP = '123456'; // demo code; the real one is sent by SMS from the backend

function OtpField({ value, onChange }: { value: string; onChange: (v: string) => void }): JSX.Element {
  return (
    <div className="space-y-1.5">
      <Label>رمز التأكيد المرسل إلى جوالك *</Label>
      <Input dir="ltr" inputMode="numeric" placeholder="للتجربة: 123456" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function AddAccountDialog({ open, onClose }: { open: boolean; onClose: () => void }): JSX.Element {
  const addAccount = useVendorStore((s) => s.addAccount);
  const showToast = useUIStore((s) => s.showToast);
  const [type, setType] = useState<AccountType>('حساب بنكي');
  const [vals, setVals] = useState<Record<string, string>>({});
  const [otp, setOtp] = useState('');
  const fields = FIELDS[type];

  const reset = (): void => {
    setVals({});
    setOtp('');
    setType('حساب بنكي');
    onClose();
  };

  const submit = (): void => {
    if (fields.some(([k]) => !vals[k]?.trim())) return showToast('أكمل كل الحقول المطلوبة', 'error');
    if (type === 'PayPal' && !/^\S+@\S+\.\S+$/.test(vals.n.trim())) return showToast('أدخل بريدًا إلكترونيًا صحيحًا', 'error');
    if (otp.trim() !== OTP) return showToast('الرمز غير صحيح', 'error');
    const r = addAccount(type, fields.map(([k]) => vals[k].trim()).join(' · '));
    if (!r.ok) return showToast(r.error, 'error');
    showToast('تمت إضافة الحساب، والسحب متوقف لمدة 48 ساعة');
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && reset()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة حساب تحويل</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label>نوع الحساب *</Label>
            <Select
              value={type}
              onValueChange={(t) => {
                setType(t as AccountType);
                setVals({});
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(FIELDS) as AccountType[]).map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {fields.map(([k, label]) => (
            <div key={k} className="space-y-1.5">
              <Label>{label} *</Label>
              <Input dir={k === 'n' ? 'ltr' : undefined} value={vals[k] ?? ''} onChange={(e) => setVals({ ...vals, [k]: e.target.value })} />
            </div>
          ))}
          <OtpField value={otp} onChange={setOtp} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={reset}>
            إلغاء
          </Button>
          <Button onClick={submit}>تأكيد</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Account(): JSX.Element {
  const { vendors, meId, setDefaultAccount, deleteAccount } = useVendorStore();
  const showToast = useUIStore((s) => s.showToast);
  const v = vendors.find((x) => x.id === meId)!;
  const [adding, setAdding] = useState(false);
  const [defOf, setDefOf] = useState<TransferAccount | null>(null);
  const [delOf, setDelOf] = useState<TransferAccount | null>(null);
  const [otp, setOtp] = useState('');

  const ro = (label: string, value: string, ltr = false): JSX.Element => (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} disabled dir={ltr ? 'ltr' : undefined} />
    </div>
  );

  return (
    <div className="space-y-4">
      <PageHeader title="حسابي" desc="بياناتك وطريقة استلام المبالغ" />

      <Card>
        <CardContent className="grid gap-3 pt-6 md:grid-cols-2">
          {ro('الاسم', v.name)}
          {ro('البريد الإلكتروني', v.email, true)}
          {ro('رقم الجوال', v.phone, true)}
          {ro('الدولة', v.country)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">حسابات التحويل</CardTitle>
          <Button size="sm" className="gap-1" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" />
            إضافة حساب
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 p-0 pb-4">
          {v.accounts.length === 0 ? (
            <p className="px-6 text-sm text-muted-foreground">لم يُضف أي حساب بعد.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {['النوع', 'البيانات', '', ''].map((h, i) => (
                    <TableHead key={i} className="text-start">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {v.accounts.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <StatusPill text={a.type} />
                    </TableCell>
                    <TableCell>{a.details}</TableCell>
                    <TableCell>{a.isDefault && <StatusPill text="الافتراضي" />}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {!a.isDefault && (
                        <span className="inline-flex gap-1.5">
                          <Button size="sm" variant="outline" onClick={() => setDefOf(a)}>
                            تعيين كافتراضي
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => setDelOf(a)}>
                            حذف
                          </Button>
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="space-y-2 px-6">
            <Note>تتطلب إضافة حساب أو تغيير الحساب الافتراضي رمز تأكيد يُرسل إلى جوالك، وبعدها يتوقف السحب لمدة 48 ساعة للحماية.</Note>
            {v.bankLock && <Note tone="warn">السحب متوقف حاليًا لمدة 48 ساعة بسبب تغيير البيانات.</Note>}
          </div>
        </CardContent>
      </Card>

      <AddAccountDialog open={adding} onClose={() => setAdding(false)} />

      <Dialog open={!!defOf} onOpenChange={(o) => { if (!o) { setDefOf(null); setOtp(''); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تعيين الحساب الافتراضي</DialogTitle>
          </DialogHeader>
          <p className="text-sm">
            سيصبح <b>{defOf?.type} · {defOf?.details}</b> الحساب الافتراضي للتحويل.
          </p>
          <OtpField value={otp} onChange={setOtp} />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDefOf(null); setOtp(''); }}>
              إلغاء
            </Button>
            <Button
              onClick={() => {
                if (otp.trim() !== OTP) return showToast('الرمز غير صحيح', 'error');
                setDefaultAccount(defOf!.id);
                setDefOf(null);
                setOtp('');
                showToast('تم تغيير الحساب الافتراضي، والسحب متوقف لمدة 48 ساعة');
              }}
            >
              تأكيد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!delOf} onOpenChange={(o) => !o && setDelOf(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>حذف الحساب</DialogTitle>
          </DialogHeader>
          <p className="text-sm">
            هل تريد حذف <b>{delOf?.type} · {delOf?.details}</b>؟
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDelOf(null)}>
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteAccount(delOf!.id);
                setDelOf(null);
                showToast('تم حذف الحساب');
              }}
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
