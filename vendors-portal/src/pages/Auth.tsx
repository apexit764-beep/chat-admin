import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUIStore } from '@/store/useUIStore';
import { useVendorStore } from '@v/store/useVendorStore';
import { FieldHint, Note } from '@v/components/ui-bits';
import { AuthBox } from '@v/components/auth-layouts';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { isEmail, passwordRules, PASSWORD_CHARSET } from '@v/lib/validation';

export function Login(): JSX.Element {
  const navigate = useNavigate();
  const login = useVendorStore((s) => s.login);
  // the demo vendor; reads the store so a changed email or password still works
  const demo = useVendorStore((s) => s.vendors.find((v) => v.id === 1));
  const DEMO = { email: demo?.email ?? '', password: demo?.password ?? '' };
  // after an email change the portal signs out and lands here with the new email
  const prefill = (useLocation().state as { email?: string } | null)?.email ?? '';
  const [email, setEmail] = useState(prefill);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  const submit = (): void => {
    if (!isEmail(email)) return setError('أدخل بريدًا إلكترونيًا صحيحًا');
    if (!password) return setError('كلمة المرور مطلوبة');
    const r = login(email, password);
    if (r.ok) navigate('/home');
    else setError(r.error);
  };

  /** fills the demo account and signs in */
  const loginDemo = (): void => {
    setEmail(DEMO.email);
    setPassword(DEMO.password);
    const r = login(DEMO.email, DEMO.password);
    if (r.ok) navigate('/home');
    else setError(r.error);
  };

  return (
    <AuthBox>
      <h2 className="text-2xl font-semibold tracking-tight">تسجيل الدخول</h2>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">سجّل الدخول بالبريد الإلكتروني وكلمة المرور التي أنشأتها من بريد الدعوة.</p>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" dir="ltr" type="email" className="h-11 pr-10" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">كلمة المرور</Label>
            <button type="button" className="text-xs font-medium text-primary hover:underline" onClick={() => navigate('/forgot')}>
              نسيت كلمة المرور؟
            </button>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              dir="ltr"
              type={showPw ? 'text' : 'password'}
              className="h-11 pl-10 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            <button
              type="button"
              aria-label={showPw ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setShowPw((x) => !x)}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {error && <Note tone="error">{error}</Note>}
        <Button className="h-11 w-full text-sm" onClick={submit}>
          تسجيل الدخول
        </Button>
      </div>
      <div className="mt-6 rounded-xl border border-dashed bg-muted/40 p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold">حساب تجريبي</span>
          <a className="text-[11px] text-primary hover:underline" href="#/invite/4">
            تجربة رابط دعوة
          </a>
        </div>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1 space-y-1 text-xs" dir="ltr">
            <div className="truncate text-end">
              <span className="text-muted-foreground">Email: </span>
              <span className="font-medium">{DEMO.email}</span>
            </div>
            <div className="truncate text-end">
              <span className="text-muted-foreground">Password: </span>
              <span className="font-medium">{DEMO.password}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="shrink-0" onClick={loginDemo}>
            دخول تجريبي
          </Button>
        </div>
      </div>
    </AuthBox>
  );
}

export function Forgot(): JSX.Element {
  const navigate = useNavigate();
  const showToast = useUIStore((s) => s.showToast);
  const [email, setEmail] = useState('');
  return (
    <AuthBox>
      <h2 className="text-2xl font-semibold tracking-tight">نسيت كلمة المرور</h2>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإنشاء كلمة مرور جديدة.</p>
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
        <h2 className="text-2xl font-semibold tracking-tight">انتهت صلاحية الرابط</h2>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">
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
      <h2 className="text-2xl font-semibold tracking-tight">{mode === 'invite' ? `أهلًا ${vendor.name}` : 'كلمة مرور جديدة'}</h2>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">
        {mode === 'invite' ? 'أنشئ كلمة مرور لحسابك للدخول إلى لوحة المسوقين بالعمولة.' : 'أنشئ كلمة مرور جديدة لحسابك.'}
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
            أوافق على شروط وأحكام برنامج المسوقين بالعمولة (إلزامي للمتابعة)
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
