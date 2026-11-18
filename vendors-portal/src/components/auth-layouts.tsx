import { useSearchParams } from 'react-router-dom';
import { ArrowUpLeft, BadgeCheck, Banknote, Bell, CheckCircle2, Clock, ShieldCheck, UserPlus, Wallet } from 'lucide-react';
import { Toast } from '@/components/ui/Toast';

export type AuthLayout = 'a' | 'b' | 'c';

function Brand({ light = false }: { light?: boolean }): JSX.Element {
  return (
    <div className="flex items-center gap-2.5">
      <img src="/qhub-icon.svg" alt="" className="h-9 w-9 rounded-lg" />
      <div className="leading-tight">
        <div className={light ? 'font-bold text-white' : 'font-bold'}>Qhub Partners</div>
        <div className={light ? 'text-xs text-white/70' : 'text-xs text-muted-foreground'}>بوابة الموردين</div>
      </div>
    </div>
  );
}

const STEPS = [
  { icon: UserPlus, title: 'أضف عملاءك', text: 'أرسل دعوة أو شارك رابط التسجيل الخاص بك' },
  { icon: Clock, title: 'اكسب عمولتك', text: 'تُسجل عمولتك مع أول اشتراك يدفعه العميل' },
  { icon: Wallet, title: 'اسحب أرباحك', text: 'اطلب السحب لحسابك البنكي أو محفظتك' },
];

/* ───────────── A: centered card on a soft grid ───────────── */
function CenteredCard({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-muted/40 p-6">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative w-full max-w-[420px] space-y-6">
        <div className="flex justify-center">
          <Brand />
        </div>
        <div className="rounded-2xl border bg-card p-7 shadow-xl shadow-primary/5 sm:p-8">{children}</div>
        <p className="text-center text-xs text-muted-foreground">
          <ShieldCheck className="me-1 inline h-3.5 w-3.5 align-[-2px]" />
          اتصال آمن ومشفّر · © Qhub
        </p>
      </div>
      <Toast />
    </div>
  );
}

/* ───────────── B: split screen with a product preview ───────────── */
function SplitPreview({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col gap-4 bg-background p-6 md:p-10">
        <Brand />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm rounded-2xl border bg-card p-7 shadow-sm">{children}</div>
        </div>
        <p className="text-center text-[11px] text-muted-foreground">© Qhub · برنامج الموردين</p>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -end-24 -top-24 h-96 w-96 rounded-full bg-sky-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -start-16 h-96 w-96 rounded-full bg-indigo-400/30 blur-3xl" />

        <div className="relative space-y-3 text-white">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
            <BadgeCheck className="h-3.5 w-3.5" /> برنامج شركاء Qhub
          </span>
          <h2 className="max-w-md text-4xl font-bold leading-[1.3]">كل عميل تضيفه، عمولة في حسابك</h2>
          <p className="max-w-md text-sm leading-relaxed text-white/75">تابع عملاءك وعمولاتك وطلبات السحب لحظة بلحظة من لوحة واحدة.</p>
        </div>

        {/* dashboard preview */}
        <div className="relative mx-auto w-full max-w-md py-10">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/70">متاحة للسحب</span>
              <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-medium text-emerald-200">+12% هذا الشهر</span>
            </div>
            <div className="mt-1 text-3xl font-bold tabular-nums">
              1,531 <span className="text-base font-medium text-white/70">ج.م</span>
            </div>
            <div className="mt-5 flex h-24 items-end gap-2">
              {[35, 55, 40, 70, 60, 90, 75].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-white/20 to-white/70" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          <div className="absolute -start-6 top-0 flex items-center gap-2.5 rounded-xl bg-white p-3 text-slate-900 shadow-xl">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div className="text-xs leading-tight">
              <div className="font-semibold">مطعم السنابل اشترك</div>
              <div className="text-slate-500">عمولة جديدة 233 ج.م</div>
            </div>
          </div>

          <div className="absolute -bottom-2 -end-4 flex items-center gap-2.5 rounded-xl bg-white p-3 text-slate-900 shadow-xl">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Banknote className="h-4 w-4" />
            </span>
            <div className="text-xs leading-tight">
              <div className="font-semibold">تم التحويل</div>
              <div className="text-slate-500">2,000 ج.م إلى بنك مصر</div>
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-3 text-white">
          {[
            ['30%', 'عمولة أول اشتراك'],
            ['3', 'دول مدعومة'],
            ['24/7', 'متابعة لحظية'],
          ].map(([n, l]) => (
            <div key={l} className="rounded-xl border border-white/15 bg-white/5 p-3">
              <div className="text-xl font-bold">{n}</div>
              <div className="text-[11px] text-white/70">{l}</div>
            </div>
          ))}
        </div>
      </div>
      <Toast />
    </div>
  );
}

/* ───────────── C: full gradient with glass card + journey ───────────── */
function GradientJourney({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="relative min-h-svh overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-800 to-blue-600">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.25),transparent_40%),radial-gradient(circle_at_85%_85%,rgba(129,140,248,0.3),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col gap-8 p-6 md:p-10">
        <div className="flex items-center justify-between">
          <Brand light />
          <span className="hidden items-center gap-1.5 text-xs text-white/70 sm:inline-flex">
            <Bell className="h-3.5 w-3.5" /> انضم لأكثر من 120 شريك
          </span>
        </div>

        <div className="grid flex-1 items-center gap-10 lg:grid-cols-2">
          <div className="w-full max-w-md justify-self-center rounded-2xl border border-white/20 bg-background/95 p-7 shadow-2xl backdrop-blur sm:p-8 lg:justify-self-start">
            {children}
          </div>

          <div className="hidden text-white lg:block">
            <h2 className="mb-2 text-4xl font-bold leading-[1.3]">شريكك في النمو</h2>
            <p className="mb-8 text-sm text-white/70">رحلتك مع Qhub في ثلاث خطوات</p>
            <ol className="relative space-y-6 border-s border-white/20 ps-8">
              {STEPS.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="relative">
                  <span className="absolute -start-[49px] flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="text-xs text-sky-200">الخطوة {i + 1}</div>
                  <div className="font-semibold">{title}</div>
                  <div className="text-sm text-white/70">{text}</div>
                </li>
              ))}
            </ol>
            <div className="mt-10 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm backdrop-blur">
              <ArrowUpLeft className="h-4 w-4 text-sky-200" />
              العمولة تصبح متاحة للسحب بعد 30 يوم من الدفع
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-white/50">© Qhub · برنامج الموردين</p>
      </div>
      <Toast />
    </div>
  );
}

/** auth page frame. Preview another design with ?layout=a|b|c */
export function AuthBox({ children }: { children: React.ReactNode }): JSX.Element {
  const [params] = useSearchParams();
  const layout = (params.get('layout') as AuthLayout) || 'b';
  if (layout === 'a') return <CenteredCard>{children}</CenteredCard>;
  if (layout === 'c') return <GradientJourney>{children}</GradientJourney>;
  return <SplitPreview>{children}</SplitPreview>;
}
