import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, KeyRound, Mail, MailCheck, Pencil, Phone, Trash2, User } from 'lucide-react';
import { useVendorStore, type Vendor } from '@v/store/useVendorStore';
import { useUIStore } from '@/store/useUIStore';
import { OtpStep } from '@/components/admin/vendors/OtpStep';
import { FieldHint, Note } from '@v/components/ui-bits';
import { isEmail, isPhoneDigits, lengthBetween, passwordRules, PASSWORD_CHARSET } from '@v/lib/validation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const initialsOf = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join(' ');

const MAX_PHOTO_MB = 2;
const PHOTO_SIZE = 256;

const CODES: [string, string][] = [
  ['+20', '🇪🇬 +20'],
  ['+968', '🇴🇲 +968'],
  ['+966', '🇸🇦 +966'],
  ['+970', '🇵🇸 +970'],
  ['+971', '🇦🇪 +971'],
];

/** square-crops and downsizes the picked photo so it stays light */
function readPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode'));
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = PHOTO_SIZE;
        canvas.height = PHOTO_SIZE;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('canvas'));
        // JPEG has no transparency: paint white first so transparent PNGs don't turn black
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, PHOTO_SIZE, PHOTO_SIZE);
        ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, PHOTO_SIZE, PHOTO_SIZE);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function Row({ icon: Icon, label, value, ltr, action }: { icon: typeof Mail; label: string; value: React.ReactNode; ltr?: boolean; action: React.ReactNode }): JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-3 py-3.5 first:pt-0 last:pb-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-medium" dir={ltr ? 'ltr' : undefined} style={ltr ? { textAlign: 'right' } : undefined}>
          {value}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ───────────── name ───────────── */
function NameDialog({ v, open, onClose }: { v: Vendor; open: boolean; onClose: () => void }): JSX.Element {
  const updateName = useVendorStore((s) => s.updateName);
  const showToast = useUIStore((s) => s.showToast);
  const [name, setName] = useState(v.name);
  const valid = lengthBetween(name, 3, 80) && name.trim() !== v.name;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>تعديل الاسم</DialogTitle>
          <DialogDescription>يظهر هذا الاسم لفريق Qhub وفي إيصالات التحويل.</DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5 py-1">
          <Label>الاسم *</Label>
          <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} />
          <FieldHint>مطلوب. من 3 إلى 80 حرفًا. يجب أن يطابق اسم صاحب حساب التحويل وإلا يُرفض طلب السحب.</FieldHint>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button
            disabled={!valid}
            onClick={() => {
              updateName(name);
              showToast('تم تحديث الاسم');
              onClose();
            }}
          >
            حفظ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ───────────── email: confirmation link, then sign out ───────────── */
function EmailDialog({ v, open, onClose }: { v: Vendor; open: boolean; onClose: () => void }): JSX.Element {
  const { checkNewEmail, confirmEmailChange } = useVendorStore();
  const showToast = useUIStore((s) => s.showToast);
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'sent'>('form');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const close = (): void => {
    setStep('form');
    setEmail('');
    setPw('');
    setError('');
    onClose();
  };

  const send = (): void => {
    if (!isEmail(email)) return setError('أدخل بريدًا إلكترونيًا صحيحًا');
    const r = checkNewEmail(email, pw);
    if (!r.ok) return setError(r.error);
    setError('');
    setStep('sent');
  };

  const confirm = (): void => {
    const next = email.trim();
    navigate('/login', { state: { email: next } });
    confirmEmailChange(next);
    showToast('تم تغيير البريد الإلكتروني، سجّل الدخول بالبريد الجديد');
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{step === 'form' ? 'تغيير البريد الإلكتروني' : 'أكّد بريدك الجديد'}</DialogTitle>
          {step === 'form' && <DialogDescription>سنرسل رابط تأكيد إلى البريد الجديد، ولن يتغير بريدك قبل فتحه.</DialogDescription>}
        </DialogHeader>

        {step === 'form' ? (
          <>
            <div className="space-y-3 py-1">
              <div className="space-y-1.5">
                <Label>البريد الحالي</Label>
                <Input value={v.email} disabled dir="ltr" />
              </div>
              <div className="space-y-1.5">
                <Label>البريد الجديد *</Label>
                <Input autoFocus dir="ltr" type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <FieldHint>مطلوب. بريد بصيغة صحيحة وغير مستخدم في حساب آخر.</FieldHint>
              </div>
              <div className="space-y-1.5">
                <Label>كلمة المرور الحالية *</Label>
                <Input dir="ltr" type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
                <FieldHint>للتحقق من أنك صاحب الحساب.</FieldHint>
              </div>
              {error && <Note tone="error">{error}</Note>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={close}>
                إلغاء
              </Button>
              <Button disabled={!email || !pw} onClick={send}>
                إرسال رابط التأكيد
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4 py-1 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MailCheck className="h-6 w-6" />
              </span>
              <p className="text-sm leading-relaxed">
                أرسلنا رابط تأكيد إلى <b dir="ltr">{email.trim()}</b>. افتح الرابط خلال 24 ساعة لتأكيد التغيير.
              </p>
              <Note tone="warn" className="text-start">
                بعد التأكيد سيتم تسجيل خروجك، وتسجّل الدخول من جديد بالبريد الجديد.
              </Note>
            </div>
            <DialogFooter className="gap-2 sm:justify-between">
              <Button variant="ghost" onClick={() => setStep('form')}>
                تعديل البريد
              </Button>
              {/* demo only: stands in for opening the link from the inbox */}
              <Button onClick={confirm}>فتح رابط التأكيد (تجربة)</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ───────────── phone: OTP to the new number ───────────── */
function PhoneDialog({ open, onClose }: { open: boolean; onClose: () => void }): JSX.Element {
  const changePhone = useVendorStore((s) => s.changePhone);
  const showToast = useUIStore((s) => s.showToast);
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [code, setCode] = useState('+20');
  const [num, setNum] = useState('');
  const [error, setError] = useState('');
  const full = `${code} ${num.trim()}`;

  const close = (): void => {
    setStep('form');
    setNum('');
    setError('');
    onClose();
  };

  const next = (): void => {
    if (!isPhoneDigits(num)) return setError('رقم الجوال: أرقام فقط، من 6 إلى 15 رقمًا');
    setError('');
    showToast('تم إرسال رمز التأكيد إلى الرقم الجديد');
    setStep('otp');
  };

  const verified = (): void => {
    const r = changePhone(full);
    if (!r.ok) {
      setError(r.error);
      return setStep('form');
    }
    showToast('تم تغيير رقم الجوال');
    close();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{step === 'form' ? 'تغيير رقم الجوال' : 'تأكيد الرقم الجديد'}</DialogTitle>
          {step === 'form' && <DialogDescription>سنرسل رمز تحقق (OTP) إلى الرقم الجديد.</DialogDescription>}
        </DialogHeader>
        {step === 'form' ? (
          <>
            <div className="space-y-3 py-1">
              <div className="space-y-1.5">
                <Label>الرقم الجديد *</Label>
                <div className="flex gap-2" dir="ltr">
                  <Select value={code} onValueChange={setCode}>
                    <SelectTrigger className="w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CODES.map(([k, t]) => (
                        <SelectItem key={k} value={k}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    autoFocus
                    inputMode="numeric"
                    placeholder="1001234567"
                    value={num}
                    onChange={(e) => setNum(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && next()}
                  />
                </div>
                <FieldHint>مطلوب. أرقام فقط، من 6 إلى 15 رقمًا، بدون رمز الدولة.</FieldHint>
              </div>
              {error && <Note tone="error">{error}</Note>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={close}>
                إلغاء
              </Button>
              <Button disabled={!num} onClick={next}>
                إرسال الرمز
              </Button>
            </DialogFooter>
          </>
        ) : (
          <OtpStep phone={full} onVerified={verified} onBack={() => setStep('form')} />
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ───────────── password ───────────── */
function PasswordDialog({ open, onClose }: { open: boolean; onClose: () => void }): JSX.Element {
  const changePassword = useVendorStore((s) => s.changePassword);
  const showToast = useUIStore((s) => s.showToast);
  const [cur, setCur] = useState('');
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [error, setError] = useState('');
  const rules = passwordRules(p1);
  const valid = !!cur && rules.every((r) => r.ok) && PASSWORD_CHARSET.test(p1) && p1 === p2;

  const close = (): void => {
    setCur('');
    setP1('');
    setP2('');
    setError('');
    onClose();
  };

  const save = (): void => {
    const r = changePassword(cur, p1);
    if (!r.ok) return setError(r.error);
    showToast('تم تغيير كلمة المرور');
    close();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>تغيير كلمة المرور</DialogTitle>
          <DialogDescription>استخدم كلمة مرور قوية لم تستخدمها من قبل.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label>كلمة المرور الحالية *</Label>
            <Input autoFocus dir="ltr" type="password" value={cur} onChange={(e) => setCur(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>كلمة المرور الجديدة *</Label>
            <Input dir="ltr" type="password" value={p1} onChange={(e) => setP1(e.target.value)} />
            <div className="space-y-0.5 pt-1 text-xs">
              {rules.map((r) => (
                <div key={r.label} className={r.ok ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}>
                  {r.ok ? '✓' : '○'} {r.label}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>تأكيد كلمة المرور الجديدة *</Label>
            <Input dir="ltr" type="password" value={p2} onChange={(e) => setP2(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && valid && save()} />
            {p2 && p2 !== p1 && <div className="text-xs text-red-600">كلمتا المرور غير متطابقتين</div>}
          </div>
          {error && <Note tone="error">{error}</Note>}
          <button
            type="button"
            className="text-xs text-primary hover:underline"
            onClick={() => {
              showToast('أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك');
              close();
            }}
          >
            نسيت كلمة المرور الحالية؟ أرسل رابط إعادة التعيين إلى بريدي
          </button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={close}>
            إلغاء
          </Button>
          <Button disabled={!valid} onClick={save}>
            حفظ كلمة المرور
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ───────────── cards ───────────── */
export function ProfileCard({ v }: { v: Vendor }): JSX.Element {
  const updateAvatar = useVendorStore((s) => s.updateAvatar);
  const showToast = useUIStore((s) => s.showToast);
  const file = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState<'name' | 'email' | 'phone' | null>(null);

  const pick = async (f: File | undefined): Promise<void> => {
    if (!f) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) return showToast('الصورة يجب أن تكون JPG أو PNG أو WEBP', 'error');
    if (f.size > MAX_PHOTO_MB * 1024 * 1024) return showToast(`حجم الصورة أكبر من ${MAX_PHOTO_MB} ميجابايت`, 'error');
    try {
      updateAvatar(await readPhoto(f));
      showToast('تم تحديث الصورة الشخصية');
    } catch {
      showToast('تعذّرت قراءة الصورة، جرّب صورة أخرى', 'error');
    }
  };

  const edit = (k: 'name' | 'email' | 'phone'): JSX.Element => (
    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setOpen(k)}>
      <Pencil className="h-3.5 w-3.5" />
      تغيير
    </Button>
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="p-5">
        <CardTitle className="text-base">البيانات الشخصية</CardTitle>
        <CardDescription>أي تغيير هنا يصل لفريق Qhub تلقائيًا</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 p-5 pt-0 md:grid-cols-[200px_1fr]">
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-muted/30 p-5">
          <div className="relative">
            <Avatar className="h-24 w-24 rounded-2xl">
              {v.avatar && <AvatarImage src={v.avatar} alt={v.name} className="object-cover" />}
              <AvatarFallback className="rounded-2xl bg-primary/10 text-2xl font-bold text-primary">{initialsOf(v.name)}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              aria-label="تغيير الصورة"
              onClick={() => file.current?.click()}
              className="absolute -bottom-2 -start-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow hover:bg-primary/90"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <input
            ref={file}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              void pick(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
          <div className="flex gap-1.5">
            <Button size="sm" variant="outline" onClick={() => file.current?.click()}>
              {v.avatar ? 'تغيير الصورة' : 'رفع صورة'}
            </Button>
            {v.avatar && (
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 text-destructive hover:text-destructive"
                aria-label="حذف الصورة"
                onClick={() => {
                  updateAvatar(undefined);
                  showToast('تم حذف الصورة');
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-center text-[11px] text-muted-foreground">JPG أو PNG أو WEBP، حتى {MAX_PHOTO_MB} ميجابايت</p>
        </div>

        <div className="divide-y">
          <Row icon={User} label="الاسم" value={v.name} action={edit('name')} />
          <Row icon={Mail} label="البريد الإلكتروني" value={v.email} ltr action={edit('email')} />
          <Row icon={Phone} label="رقم الجوال" value={v.phone} ltr action={edit('phone')} />
        </div>
      </CardContent>

      {open === 'name' && <NameDialog v={v} open onClose={() => setOpen(null)} />}
      {open === 'email' && <EmailDialog v={v} open onClose={() => setOpen(null)} />}
      {open === 'phone' && <PhoneDialog open onClose={() => setOpen(null)} />}
    </Card>
  );
}

export function SecurityCard(): JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <Card className="shadow-sm">
      <CardHeader className="p-5">
        <CardTitle className="text-base">الأمان</CardTitle>
        <CardDescription>إدارة كلمة المرور الخاصة بحسابك</CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <Row
          icon={KeyRound}
          label="كلمة المرور"
          value="••••••••"
          action={
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
              تغيير كلمة المرور
            </Button>
          }
        />
      </CardContent>
      {open && <PasswordDialog open onClose={() => setOpen(false)} />}
    </Card>
  );
}
