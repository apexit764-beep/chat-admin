import { useSearchParams } from 'react-router-dom';
import { ArrowUpLeft, Bell, Clock, UserPlus, Wallet } from 'lucide-react';
import { Toast } from '@/components/ui/Toast';

const STEPS = [
  { icon: UserPlus, title: 'أضف عملاءك', text: 'أرسل دعوة أو شارك رابط التسجيل الخاص بك' },
  { icon: Clock, title: 'اكسب عمولتك', text: 'تُسجل عمولتك مع أول اشتراك يدفعه العميل' },
  { icon: Wallet, title: 'اسحب أرباحك', text: 'اطلب السحب لحسابك البنكي أو محفظتك' },
];

const svg = (body: string, w: number, h: number): string =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>${body}</svg>`)}")`;

const C = 'rgba(37,99,235,';

/** background patterns (preview with ?pattern=grid|waves|stars) */
const PATTERNS: Record<string, { image: string; size: string; mask: string }> = {
  grid: {
    image: `linear-gradient(to right, ${C}0.10) 1px, transparent 1px), linear-gradient(to bottom, ${C}0.10) 1px, transparent 1px)`,
    size: '40px 40px',
    mask: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 100%)',
  },
  waves: {
    image: svg(`<path d='M0 20 Q 25 5 50 20 T 100 20' fill='none' stroke='${C}0.16)' stroke-width='1.2'/><path d='M0 40 Q 25 25 50 40 T 100 40' fill='none' stroke='${C}0.10)' stroke-width='1'/>`, 100, 40),
    size: '100px 40px',
    mask: 'linear-gradient(to bottom, black 0%, transparent 85%)',
  },
  stars: {
    image: svg(
      `<g fill='none' stroke='${C}0.14)' stroke-width='1'><rect x='17' y='17' width='22' height='22'/><rect x='17' y='17' width='22' height='22' transform='rotate(45 28 28)'/><circle cx='28' cy='28' r='4'/><path d='M0 0 L11 11 M56 0 L45 11 M0 56 L11 45 M56 56 L45 45'/></g>`,
      56,
      56
    ),
    size: '56px 56px',
    mask: 'radial-gradient(ellipse 85% 75% at 50% 45%, black 35%, transparent 100%)',
  },
};

function Pattern({ name }: { name: string }): JSX.Element | null {
  const p = PATTERNS[name];
  if (!p) return null;
  return (
    <div
      className="pointer-events-none absolute inset-0 dark:opacity-60"
      style={{ backgroundImage: p.image, backgroundSize: p.size, maskImage: p.mask, WebkitMaskImage: p.mask }}
    />
  );
}

/** frame of the auth pages: light background, form card + the partner journey */
export function AuthBox({ children }: { children: React.ReactNode }): JSX.Element {
  const [params] = useSearchParams();
  const pattern = params.get('pattern') || 'stars';
  return (
    <div className="relative min-h-svh overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-zinc-950 dark:via-background dark:to-zinc-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.18),transparent_40%),radial-gradient(circle_at_85%_90%,rgba(56,189,248,0.18),transparent_45%)]" />
      <Pattern name={pattern} />

      <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col gap-8 p-6 md:p-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/qhub-icon.svg" alt="" className="h-9 w-9 rounded-lg" />
            <div className="leading-tight">
              <div className="font-bold">Qhub Partners</div>
              <div className="text-xs text-muted-foreground">بوابة الموردين</div>
            </div>
          </div>
          <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
            <Bell className="h-3.5 w-3.5" /> انضم لأكثر من 120 شريك
          </span>
        </div>

        <div className="grid flex-1 items-center gap-10 lg:grid-cols-2">
          <div className="w-full max-w-md justify-self-center rounded-2xl border bg-card p-7 shadow-xl shadow-blue-900/5 sm:p-8 lg:justify-self-start">{children}</div>

          <div className="hidden lg:block">
            <h2 className="mb-2 text-4xl font-bold leading-[1.3]">شريكك في النمو</h2>
            <p className="mb-8 text-sm text-muted-foreground">رحلتك مع Qhub في ثلاث خطوات</p>
            <ol className="relative space-y-6 border-s border-primary/20 ps-8">
              {STEPS.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="relative">
                  <span className="absolute -start-[49px] flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 bg-primary/5 text-primary backdrop-blur">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="text-xs text-primary">الخطوة {i + 1}</div>
                  <div className="font-semibold">{title}</div>
                  <div className="text-sm text-muted-foreground">{text}</div>
                </li>
              ))}
            </ol>
            <div className="mt-10 inline-flex items-center gap-2 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-primary backdrop-blur">
              <ArrowUpLeft className="h-4 w-4" />
              العمولة تصبح متاحة للسحب بعد 30 يوم من الدفع
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">© Qhub · برنامج الموردين</p>
      </div>
      <Toast />
    </div>
  );
}
