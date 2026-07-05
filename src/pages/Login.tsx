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
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-white dark:bg-bg-dark">
      {/* Decorative background pattern */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src="/qhub-icon.svg"
          alt=""
          aria-hidden="true"
          className="absolute -end-40 -top-40 h-[520px] w-[520px] opacity-[0.06] dark:opacity-[0.08]"
        />
        <img
          src="/qhub-icon.svg"
          alt=""
          aria-hidden="true"
          className="absolute -start-32 -bottom-32 h-[380px] w-[380px] opacity-[0.05] dark:opacity-[0.06] rotate-45"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/85 to-white dark:from-bg-dark/70 dark:via-bg-dark/85 dark:to-bg-dark" />
      </div>

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
