import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toast } from '@/components/ui/Toast';
import { useUIStore } from '@/store/useUIStore';
import { useVendorStore } from '@v/store/useVendorStore';
import { FieldHint, Note } from '@v/components/ui-bits';
import { isEmail, passwordRules, PASSWORD_CHARSET } from '@v/lib/validation';

function AuthBox({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-muted/40 to-muted/40 p-4">
      <div className="w-full max-w-[420px] rounded-2xl border bg-card p-7 shadow-lg shadow-black/5">
        <div className="text-lg font-extrabold text-emerald-900">Qhub Partners</div>
        <div className="mb-5 text-xs text-muted-foreground">بوابة الموردين</div>
        {children}
      </div>
      <Toast />
    </div>
  );
}

export function Login(): JSX.Element {
  const navigate = useNavigate();
  const login = useVendorStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (): void => {
    if (!isEmail(email)) return setError('أدخل بريدًا إلكترونيًا صحيحًا');
    if (!password) return setError('كلمة المرور مطلوبة');
    const r = login(email, password);
    if (r.ok) navigate('/home');
    else setError(r.error);
  };

  return (
    <AuthBox>
      <h2 className="text-xl font-bold">تسجيل الدخول</h2>
      <p className="mb-4 text-sm text-muted-foreground">سجّل الدخول بالبريد الإلكتروني وكلمة المرور التي أنشأتها من بريد الدعوة.</p>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label>البريد الإلكتروني</Label>
          <Input dir="ltr" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
          <FieldHint>مطلوب. بريد إلكتروني بصيغة صحيحة، مثل name@company.com.</FieldHint>
        </div>
        <div className="space-y-1.5">
          <Label>كلمة المرور</Label>
          <Input dir="ltr" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
          <FieldHint>مطلوبة. هي كلمة المرور التي أنشأتها من رابط الدعوة.</FieldHint>
        </div>
        {error && <Note tone="error">{error}</Note>}
        <button className="text-xs text-primary" onClick={() => navigate('/forgot')}>
          نسيت كلمة المرور؟
        </button>
        <Button className="w-full" onClick={submit}>
          تسجيل الدخول
        </Button>
      </div>
      <Note className="mt-4">
        نسخة تجريبية: للدخول استخدم mahmoud@agency.com وكلمة المرور Partner2026. ولتجربة دعوة مورد جديد افتح <a className="underline" href="#/invite/4">رابط الدعوة</a>.
      </Note>
    </AuthBox>
  );
}

export function Forgot(): JSX.Element {
  const navigate = useNavigate();
  const showToast = useUIStore((s) => s.showToast);
  const [email, setEmail] = useState('');
  return (
    <AuthBox>
      <h2 className="text-xl font-bold">نسيت كلمة المرور</h2>
      <p className="mb-4 text-sm text-muted-foreground">أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإنشاء كلمة مرور جديدة.</p>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label>البريد الإلكتروني</Label>
          <Input dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
          <FieldHint>مطلوب. بريد إلكتروني بصيغة صحيحة، وهو البريد المسجّل في حسابك.</FieldHint>
        </div>
        <Button
          className="w-full"
          onClick={() => {
            if (!isEmail(email)) return showToast('أدخل بريدًا إلكترونيًا صحيحًا', 'error');
            showToast('إذا كان البريد الإلكتروني مسجلًا، سيصلك رابط إعادة التعيين');
            navigate('/login');
          }}
        >
          إرسال الرابط
        </Button>
        <button className="block w-full text-center text-sm text-primary" onClick={() => navigate('/login')}>
          العودة إلى تسجيل الدخول
        </button>
      </div>
    </AuthBox>
  );
}

/** Shared by the invite link (first password + terms) and the reset link */
export function CreatePassword({ mode }: { mode: 'invite' | 'reset' }): JSX.Element {
  const { vid } = useParams();
  const navigate = useNavigate();
  const showToast = useUIStore((s) => s.showToast);
  const vendor = useVendorStore((s) => s.vendors.find((v) => v.id === Number(vid)));
  const setPassword = useVendorStore((s) => s.setPassword);
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [terms, setTerms] = useState(false);

  const rules = useMemo(() => passwordRules(p1), [p1]);
  const valid = rules.every((r) => r.ok) && p1.length > 0 && PASSWORD_CHARSET.test(p1) && p1 === p2 && (mode === 'reset' || terms);

  // a link is single use: an active account cannot open its invite again
  if (!vendor || (mode === 'invite' && vendor.status !== 'دعوة مرسلة')) {
    return (
      <AuthBox>
        <h2 className="text-xl font-bold">انتهت صلاحية الرابط</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          {mode === 'reset'
            ? 'تم استخدام هذا الرابط مسبقًا أو مرّت عليه 48 ساعة. اطلب رابطًا جديدًا من "نسيت كلمة المرور".'
            : 'تم استخدام رابط الدعوة مسبقًا أو مرّت عليه 48 ساعة. اطلب من فريق Qhub إرسال دعوة جديدة.'}
        </p>
        <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
          الذهاب إلى تسجيل الدخول
        </Button>
      </AuthBox>
    );
  }

  const submit = (): void => {
    setPassword(vendor.id, p1, mode);
    if (mode === 'invite') {
      showToast('تم تفعيل حسابك، أضف بيانات التحويل لتتمكن من السحب');
      navigate('/account');
    } else {
      showToast('تم تغيير كلمة المرور، سجّل الدخول');
      navigate('/login');
    }
  };

  return (
    <AuthBox>
      <h2 className="text-xl font-bold">{mode === 'invite' ? `أهلًا ${vendor.name}` : 'كلمة مرور جديدة'}</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        {mode === 'invite' ? 'أنشئ كلمة مرور لحسابك للدخول إلى لوحة الموردين.' : 'أنشئ كلمة مرور جديدة لحسابك.'}
      </p>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label>البريد الإلكتروني</Label>
          <Input dir="ltr" value={vendor.email} disabled />
          <FieldHint>للقراءة فقط، وهو البريد الذي وصلته عليه الدعوة.</FieldHint>
        </div>
        <div className="space-y-1.5">
          <Label>كلمة المرور *</Label>
          <Input dir="ltr" type="password" value={p1} onChange={(e) => setP1(e.target.value)} />
        </div>
        <div className="space-y-0.5 text-xs">
          {rules.map((r) => (
            <div key={r.label} className={r.ok ? 'text-green-700' : 'text-muted-foreground'}>
              {r.ok ? '✓' : '○'} {r.label}
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <Label>تأكيد كلمة المرور *</Label>
          <Input dir="ltr" type="password" value={p2} onChange={(e) => setP2(e.target.value)} />
          <FieldHint>مطلوب. يجب أن يطابق كلمة المرور تمامًا.</FieldHint>
          {p2 && p2 !== p1 && <div className="text-xs text-red-600">كلمتا المرور غير متطابقتين</div>}
        </div>
        {mode === 'invite' && (
          <label className="flex items-start gap-2 text-xs leading-relaxed">
            <input type="checkbox" className="mt-1" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
            أوافق على شروط وأحكام برنامج الموردين (إلزامي للمتابعة)
          </label>
        )}
        <Button className="w-full" disabled={!valid} onClick={submit}>
          {mode === 'invite' ? 'إنشاء كلمة المرور والدخول' : 'حفظ كلمة المرور'}
        </Button>
        {mode === 'invite' && <div className="text-center text-[11px] text-muted-foreground">رابط الدعوة صالح لمدة 48 ساعة ولمرة واحدة.</div>}
      </div>
    </AuthBox>
  );
}
