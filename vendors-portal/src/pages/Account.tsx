import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useVendorStore, type AccountType, type TransferAccount } from '@v/store/useVendorStore';
import { useUIStore } from '@/store/useUIStore';
import { FieldHint, Note, PageHeader, StatusPill } from '@v/components/ui-bits';
import { isAccountNumber, isEmail, isHolderName, isWalletNumber, lengthBetween } from '@v/lib/validation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

/** validation rule shown under each field, per account type and key */
const HINTS: Record<AccountType, Record<string, string>> = {
  'حساب بنكي': {
    b: 'مطلوب. من حرفين إلى 60 حرفًا.',
    n: 'مطلوب. حروف إنجليزية وأرقام فقط، من 8 إلى 34 خانة، وتُتجاهل المسافات.',
    h: 'مطلوب. حروف ومسافات فقط، من 3 إلى 80 حرفًا، ويجب أن يطابق اسمك المسجّل وإلا يُرفض طلب السحب.',
  },
  'محفظة إلكترونية': {
    b: 'مطلوب. من حرفين إلى 40 حرفًا.',
    n: 'مطلوب. أرقام فقط، من 8 إلى 15 رقمًا.',
  },
  PayPal: { n: 'مطلوب. بريد إلكتروني بصيغة صحيحة.' },
};

/** fields per account type: [key, label] */
const FIELDS: Record<AccountType, [string, string][]> = {
  'حساب بنكي': [['b', 'اسم البنك'], ['n', 'رقم الحساب أو IBAN'], ['h', 'اسم صاحب الحساب']],
  'محفظة إلكترونية': [['b', 'اسم المحفظة (مثل: فودافون كاش، STC Pay)'], ['n', 'رقم المحفظة']],
  PayPal: [['n', 'البريد الإلكتروني لحساب PayPal']],
};
const OTP = '123456'; // demo code; the real one is sent by SMS from the backend

const OTP_RESEND_SECONDS = 30;
const OTP_MAX_ATTEMPTS = 3;

/** second step of any change to the transfer details: the code goes to the vendor's registered phone, not to the account being added */
function OtpStep({ phone, onVerified, onBack }: { phone: string; onVerified: () => void; onBack: () => void }): JSX.Element {
  const showToast = useUIStore((s) => s.showToast);
  const [code, setCode] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [wait, setWait] = useState(OTP_RESEND_SECONDS);
  const masked = `••••${phone.replace(/\D/g, '').slice(-4)}`;

  useEffect(() => {
    if (wait <= 0) return undefined;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const verify = (): void => {
    if (code.trim() === OTP) return onVerified();
    const left = OTP_MAX_ATTEMPTS - attempts - 1;
    setAttempts(attempts + 1);
    setCode('');
    if (left <= 0) {
      showToast('تجاوزت عدد المحاولات، ابدأ من جديد', 'error');
      return onBack();
    }
    showToast(`الرمز غير صحيح، بقي ${left} ${left === 1 ? 'محاولة' : 'محاولات'}`, 'error');
  };

  return (
    <div className="space-y-3 py-1">
      <p className="text-sm leading-relaxed">
        أرسلنا رمز تأكيد إلى جوالك المسجّل <bdi dir="ltr" className="font-bold">{masked}</bdi>. أدخله لتأكيد التغيير. الرمز صالح لمدة 5 دقائق.
      </p>
      <div className="space-y-1.5">
        <Label>رمز التأكيد *</Label>
        <Input
          autoFocus
          dir="ltr"
          inputMode="numeric"
          maxLength={6}
          placeholder="للتجربة: 123456"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => e.key === 'Enter' && verify()}
        />
        <FieldHint>مطلوب. 6 أرقام فقط، صالح لمدة 5 دقائق، و3 محاولات بحد أقصى.</FieldHint>
      </div>
      <div className="flex items-center justify-between gap-2">
        <button
          className="text-xs text-primary disabled:text-muted-foreground"
          disabled={wait > 0}
          onClick={() => {
            setWait(OTP_RESEND_SECONDS);
            showToast('تم إرسال رمز جديد');
          }}
        >
          {wait > 0 ? `إعادة إرسال الرمز بعد ${wait} ثانية` : 'إعادة إرسال الرمز'}
        </button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            رجوع
          </Button>
          <Button disabled={code.trim().length < 6} onClick={verify}>
            تأكيد
          </Button>
        </div>
      </div>
    </div>
  );
}

function AddAccountDialog({ open, onClose }: { open: boolean; onClose: () => void }): JSX.Element {
  const addAccount = useVendorStore((s) => s.addAccount);
  const phone = useVendorStore((s) => s.vendors.find((v) => v.id === s.meId)?.phone ?? '');
  const showToast = useUIStore((s) => s.showToast);
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [type, setType] = useState<AccountType>('حساب بنكي');
  const [vals, setVals] = useState<Record<string, string>>({});
  const fields = FIELDS[type];

  const reset = (): void => {
    setVals({});
    setType('حساب بنكي');
    setStep('form');
    onClose();
  };

  const next = (): void => {
    if (fields.some(([k]) => !vals[k]?.trim())) return showToast('أكمل كل الحقول المطلوبة', 'error');
    const v = (k: string): string => (vals[k] ?? '').trim();
    if (type === 'PayPal' && !isEmail(v('n'))) return showToast('أدخل بريدًا إلكترونيًا صحيحًا', 'error');
    if (type === 'حساب بنكي') {
      if (!lengthBetween(v('b'), 2, 60)) return showToast('اسم البنك من حرفين إلى 60 حرفًا', 'error');
      if (!isAccountNumber(v('n'))) return showToast('رقم الحساب أو IBAN: حروف إنجليزية وأرقام فقط، من 8 إلى 34 خانة', 'error');
      if (!isHolderName(v('h'))) return showToast('اسم صاحب الحساب: حروف ومسافات فقط، من 3 إلى 80 حرفًا', 'error');
    }
    if (type === 'محفظة إلكترونية') {
      if (!lengthBetween(v('b'), 2, 40)) return showToast('اسم المحفظة من حرفين إلى 40 حرفًا', 'error');
      if (!isWalletNumber(v('n'))) return showToast('رقم المحفظة: أرقام فقط، من 8 إلى 15 رقمًا', 'error');
    }
    showToast('تم إرسال رمز التأكيد إلى جوالك');
    setStep('otp');
  };

  const confirm = (): void => {
    const r = addAccount(type, fields.map(([k]) => vals[k].trim()).join(' · '));
    if (!r.ok) {
      showToast(r.error, 'error');
      return setStep('form');
    }
    showToast('تمت إضافة الحساب، والسحب متوقف لمدة 48 ساعة');
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && reset()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{step === 'form' ? 'إضافة حساب تحويل' : 'تأكيد إضافة الحساب'}</DialogTitle>
        </DialogHeader>
        {step === 'form' ? (
          <>
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
                <FieldHint>مطلوب. حساب بنكي أو محفظة إلكترونية أو PayPal، وتتغير الحقول التالية حسب النوع.</FieldHint>
              </div>
              {fields.map(([k, label]) => (
                <div key={k} className="space-y-1.5">
                  <Label>{label} *</Label>
                  <Input dir={k === 'n' ? 'ltr' : undefined} value={vals[k] ?? ''} onChange={(e) => setVals({ ...vals, [k]: e.target.value })} />
                  <FieldHint>{HINTS[type][k]}</FieldHint>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={reset}>
                إلغاء
              </Button>
              <Button onClick={next}>متابعة</Button>
            </DialogFooter>
          </>
        ) : (
          <OtpStep phone={phone} onVerified={confirm} onBack={() => setStep('form')} />
        )}
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

  const ro = (label: string, value: string, ltr = false): JSX.Element => (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} disabled dir={ltr ? 'ltr' : undefined} />
      <FieldHint>للقراءة فقط. للتعديل تواصل مع فريق Qhub.</FieldHint>
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
            <Note>تتطلب إضافة حساب جديد رمز تأكيد يُرسل إلى جوالك. وبعد إضافة حساب أو تغيير الحساب الافتراضي يتوقف السحب لمدة 48 ساعة للحماية.</Note>
            {v.bankLock && <Note tone="warn">السحب متوقف حاليًا لمدة 48 ساعة بسبب تغيير البيانات.</Note>}
          </div>
        </CardContent>
      </Card>

      <AddAccountDialog open={adding} onClose={() => setAdding(false)} />

      <Dialog open={!!defOf} onOpenChange={(o) => !o && setDefOf(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تعيين الحساب الافتراضي</DialogTitle>
          </DialogHeader>
          <p className="text-sm">
            سيصبح <b>{defOf?.type} · {defOf?.details}</b> الحساب الافتراضي للتحويل، ويتوقف السحب لمدة 48 ساعة للحماية.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDefOf(null)}>
              إلغاء
            </Button>
            <Button
              onClick={() => {
                setDefaultAccount(defOf!.id);
                setDefOf(null);
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
