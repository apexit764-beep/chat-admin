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

/* ───────────── C: full background with card + journey ───────────── */
type Tone = 'bright' | 'light' | 'slate';

const TONES: Record<Tone, { root: string; glow: string; dots: string; text: string; muted: string; accent: string; chip: string; line: string; card: string; brandLight: boolean }> = {
  // vivid brand blue, no navy/indigo
  bright: {
    root: 'bg-gradient-to-br from-blue-500 via-blue-600 to-sky-500',
    glow: 'bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.22),transparent_40%),radial-gradient(circle_at_85%_85%,rgba(125,211,252,0.35),transparent_45%)]',
    dots: 'bg-[radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)]',
    text: 'text-white',
    muted: 'text-white/75',
    accent: 'text-sky-100',
    chip: 'border-white/25 bg-white/15',
    line: 'border-white/30',
    card: 'border-white/30 bg-background shadow-2xl shadow-blue-900/20',
    brandLight: true,
  },
  // light page, blue accents only
  light: {
    root: 'bg-gradient-to-br from-blue-50 via-white to-sky-50',
    glow: 'bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.18),transparent_40%),radial-gradient(circle_at_85%_90%,rgba(56,189,248,0.18),transparent_45%)]',
    dots: 'bg-[radial-gradient(rgba(37,99,235,0.14)_1px,transparent_1px)]',
    text: 'text-foreground',
    muted: 'text-muted-foreground',
    accent: 'text-primary',
    chip: 'border-primary/15 bg-primary/5 text-primary',
    line: 'border-primary/20',
    card: 'border bg-card shadow-xl shadow-blue-900/5',
    brandLight: false,
  },
  // neutral charcoal (not navy) with a blue glow
  slate: {
    root: 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800',
    glow: 'bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.30),transparent_40%),radial-gradient(circle_at_85%_85%,rgba(56,189,248,0.18),transparent_45%)]',
    dots: 'bg-[radial-gradient(rgba(255,255,255,0.10)_1px,transparent_1px)]',
    text: 'text-white',
    muted: 'text-white/65',
    accent: 'text-blue-300',
    chip: 'border-white/15 bg-white/5',
    line: 'border-white/15',
    card: 'border-white/10 bg-background shadow-2xl',
    brandLight: true,
  },
};

function GradientJourney({ children, tone }: { children: React.ReactNode; tone: Tone }): JSX.Element {
  const t = TONES[tone];
  return (
    <div className={`relative min-h-svh overflow-hidden ${t.root}`}>
      <div className={`pointer-events-none absolute inset-0 ${t.glow}`} />
      <div className={`pointer-events-none absolute inset-0 ${t.dots} bg-[size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent)]`} />

      <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col gap-8 p-6 md:p-10">
        <div className="flex items-center justify-between">
          <Brand light={t.brandLight} />
          <span className={`hidden items-center gap-1.5 text-xs sm:inline-flex ${t.muted}`}>
            <Bell className="h-3.5 w-3.5" /> انضم لأكثر من 120 شريك
          </span>
        </div>

        <div className="grid flex-1 items-center gap-10 lg:grid-cols-2">
          <div className={`w-full max-w-md justify-self-center rounded-2xl p-7 sm:p-8 lg:justify-self-start ${t.card}`}>{children}</div>

          <div className={`hidden lg:block ${t.text}`}>
            <h2 className="mb-2 text-4xl font-bold leading-[1.3]">شريكك في النمو</h2>
            <p className={`mb-8 text-sm ${t.muted}`}>رحلتك مع Qhub في ثلاث خطوات</p>
            <ol className={`relative space-y-6 border-s ps-8 ${t.line}`}>
              {STEPS.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="relative">
                  <span className={`absolute -start-[49px] flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur ${t.chip}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className={`text-xs ${t.accent}`}>الخطوة {i + 1}</div>
                  <div className="font-semibold">{title}</div>
                  <div className={`text-sm ${t.muted}`}>{text}</div>
                </li>
              ))}
            </ol>
            <div className={`mt-10 inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm backdrop-blur ${t.chip}`}>
              <ArrowUpLeft className={`h-4 w-4 ${t.accent}`} />
              العمولة تصبح متاحة للسحب بعد 30 يوم من الدفع
            </div>
          </div>
        </div>

        <p className={`text-center text-[11px] ${t.muted}`}>© Qhub · برنامج الموردين</p>
      </div>
      <Toast />
    </div>
  );
}

/** auth page frame. Preview another design with ?layout=a|b|c and, for c, ?bg=bright|light|slate */
export function AuthBox({ children }: { children: React.ReactNode }): JSX.Element {
  const [params] = useSearchParams();
  const layout = (params.get('layout') as AuthLayout) || 'c';
  const tone = (params.get('bg') as Tone) || 'bright';
  if (layout === 'a') return <CenteredCard>{children}</CenteredCard>;
  if (layout === 'c') return <GradientJourney tone={TONES[tone] ? tone : 'bright'}>{children}</GradientJourney>;
  return <SplitPreview>{children}</SplitPreview>;
}
