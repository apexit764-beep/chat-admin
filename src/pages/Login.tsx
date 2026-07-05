import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Modal, useConfirm } from '@components/ui';
import { cn } from '@/utils/cn';

export default function Login(): JSX.Element {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const [email, setEmail] = useState('admin@apexes.click');
  const [password, setPassword] = useState('admin123');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const { alert } = useConfirm();

  if (isAuthenticated) return <Navigate to={from} replace />;

  const emailRe = /^[\w.+-]+@[\w-]+\.[\w.-]+$/;

  const validate = (): boolean => {
    let ok = true;
    setEmailError(null);
    setPwdError(null);
    setError(null);
    if (!email.trim()) { setEmailError('البريد مطلوب'); ok = false; }
    else if (!emailRe.test(email.trim())) { setEmailError('صيغة البريد غير صحيحة'); ok = false; }
    if (!password) { setPwdError('كلمة المرور مطلوبة'); ok = false; }
    else if (password.length < 6) { setPwdError('كلمة المرور 6 أحرف على الأقل'); ok = false; }
    return ok;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (!result.ok) {
        setError(result.error ?? 'فشل تسجيل الدخول');
        setLoading(false);
        return;
      }
      navigate(from, { replace: true });
    }, 400);
  };

  const submitReset = (): void => {
    if (!emailRe.test(resetEmail.trim())) {
      alert({ title: 'بريد غير صالح', message: 'أدخل بريداً إلكترونياً صحيحاً', variant: 'warning' });
      return;
    }
    setTimeout(() => setResetSent(true), 500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50/50 dark:from-bg-dark dark:via-bg-dark dark:to-bg-dark">
      {/* Decorative network background */}
      <LoginBackdrop />

      <div className="w-full max-w-md relative">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <img src="/qhub-logo.png" alt="Qhub" className="h-16 w-auto mb-3 drop-shadow-sm" />
          <p className="text-xs text-muted-light dark:text-muted-dark">لوحة تحكم واتساب CRM</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm p-6 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute end-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
                  className={cn(
                    'w-full h-11 ps-4 pe-10 rounded-xl bg-bg-light dark:bg-bg-dark border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition',
                    emailError ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-border-light dark:border-border-dark focus:border-primary'
                  )}
                  placeholder="you@company.com"
                />
              </div>
              {emailError && (
                <p className="text-xs text-danger flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {emailError}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">كلمة المرور</label>
                <button
                  type="button"
                  onClick={() => { setResetEmail(email); setResetSent(false); setForgotOpen(true); }}
                  className="text-xs text-primary hover:underline"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
              <div className="relative">
                <Lock className="h-4 w-4 absolute end-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPwdError(null); }}
                  className={cn(
                    'w-full h-11 ps-11 pe-10 rounded-xl bg-bg-light dark:bg-bg-dark border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition',
                    pwdError ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-border-light dark:border-border-dark focus:border-primary'
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark hover:text-current p-1"
                  aria-label={showPwd ? 'إخفاء' : 'إظهار'}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {pwdError && (
                <p className="text-xs text-danger flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {pwdError}
                </p>
              )}
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 accent-primary rounded"
              />
              <span className="text-sm text-muted-light dark:text-muted-dark">تذكّرني</span>
            </label>

            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger text-sm px-3 py-2.5 rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  تسجيل الدخول
                  <ArrowLeft className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-light dark:text-muted-dark mt-6">
          © 2026 Qhub
        </p>
      </div>

      {/* Forgot password modal */}
      <Modal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        title={resetSent ? 'تم الإرسال' : 'استعادة كلمة المرور'}
        size="sm"
        footer={
          resetSent ? (
            <button onClick={() => setForgotOpen(false)} className="h-10 px-5 rounded-full bg-primary hover:bg-primary-dark text-white text-sm font-medium">حسناً</button>
          ) : (
            <>
              <button onClick={() => setForgotOpen(false)} className="h-10 px-5 rounded-full border border-border-light dark:border-border-dark text-sm font-medium hover:bg-bg-light dark:hover:bg-bg-dark">إلغاء</button>
              <button onClick={submitReset} className="h-10 px-5 rounded-full bg-primary hover:bg-primary-dark text-white text-sm font-medium">إرسال</button>
            </>
          )
        }
      >
        {resetSent ? (
          <div className="text-center">
            <div className="h-14 w-14 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <p className="text-sm text-muted-light dark:text-muted-dark">
              إذا كان البريد <strong className="text-current">{resetEmail}</strong> مسجّل لدينا، ستصلك رسالة فيها رابط لإعادة التعيين
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-light dark:text-muted-dark">
              أدخل بريدك وسنرسل لك رابط إعادة تعيين كلمة المرور
            </p>
            <div className="relative">
              <Mail className="h-4 w-4 absolute end-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark" />
              <input
                type="email"
                autoFocus
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full h-11 ps-3 pe-10 rounded-xl bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="you@company.com"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function LoginBackdrop(): JSX.Element {
  // Channel nodes scattered around a central hub — the network illustrates
  // multi-channel aggregation flowing into Qhub.
  const hub = { x: 50, y: 50 };
  const nodes = [
    { x: 12, y: 18, r: 3.2, color: '#25D366' },
    { x: 88, y: 22, r: 2.8, color: '#0084FF' },
    { x: 20, y: 78, r: 3.0, color: '#E4405F' },
    { x: 82, y: 76, r: 2.6, color: '#229ED9' },
    { x: 50, y: 8,  r: 2.4, color: '#25D366' },
    { x: 8,  y: 48, r: 2.8, color: '#4285F4' },
    { x: 92, y: 50, r: 2.6, color: '#7A5AF8' },
    { x: 50, y: 92, r: 2.4, color: '#FF7A00' },
    { x: 30, y: 32, r: 1.8, color: '#94A3B8' },
    { x: 70, y: 30, r: 1.8, color: '#94A3B8' },
    { x: 32, y: 68, r: 1.8, color: '#94A3B8' },
    { x: 68, y: 70, r: 1.8, color: '#94A3B8' },
  ];
  const secondaryLinks: [number, number][] = [
    [0, 4], [4, 1], [1, 6], [6, 3], [3, 7], [7, 2], [2, 5], [5, 0],
    [8, 9], [9, 10], [10, 11], [11, 8],
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2196F3" stopOpacity="0.20" />
            <stop offset="60%" stopColor="#2196F3" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#2196F3" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={hub.x} cy={hub.y} r="32" fill="url(#hub-glow)" />
        {nodes.map((n, i) => (
          <line
            key={`l-${i}`}
            x1={n.x}
            y1={n.y}
            x2={hub.x}
            y2={hub.y}
            stroke={n.color}
            strokeOpacity="0.32"
            strokeWidth="0.18"
            strokeDasharray="0.6 0.6"
          />
        ))}
        {secondaryLinks.map(([a, b], i) => (
          <line
            key={`s-${i}`}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="#64748B"
            strokeOpacity="0.14"
            strokeWidth="0.12"
          />
        ))}
        {nodes.map((n, i) => (
          <g key={`n-${i}`}>
            <circle cx={n.x} cy={n.y} r={n.r + 1.4} fill={n.color} fillOpacity="0.10" />
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} fillOpacity="0.55" />
            <circle cx={n.x} cy={n.y} r={n.r * 0.45} fill="#ffffff" fillOpacity="0.85" />
          </g>
        ))}
        <circle cx={hub.x} cy={hub.y} r="5" fill="#2196F3" fillOpacity="0.16" />
        <circle cx={hub.x} cy={hub.y} r="3" fill="#2196F3" fillOpacity="0.45" />
        <circle cx={hub.x} cy={hub.y} r="1.6" fill="#ffffff" />
      </svg>
    </div>
  );
}
