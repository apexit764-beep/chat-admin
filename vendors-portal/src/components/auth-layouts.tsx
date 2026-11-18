import { ArrowUpLeft, Bell, Clock, UserPlus, Wallet } from 'lucide-react';
import { Toast } from '@/components/ui/Toast';

const STEPS = [
  { icon: UserPlus, title: 'أضف عملاءك', text: 'أرسل دعوة أو شارك رابط التسجيل الخاص بك' },
  { icon: Clock, title: 'اكسب عمولتك', text: 'تُسجل عمولتك مع أول اشتراك يدفعه العميل' },
  { icon: Wallet, title: 'اسحب أرباحك', text: 'اطلب السحب لحسابك البنكي أو محفظتك' },
];

/** frame of the auth pages: light background, form card + the partner journey */
export function AuthBox({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="relative min-h-svh overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-zinc-950 dark:via-background dark:to-zinc-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.18),transparent_40%),radial-gradient(circle_at_85%_90%,rgba(56,189,248,0.18),transparent_45%)]" />

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
