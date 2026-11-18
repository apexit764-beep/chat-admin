import { AlertTriangle, ChevronLeft, ChevronRight, CircleAlert, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FX, type Currency } from '@v/lib/vendorMath';

type Tone = 'green' | 'amber' | 'red' | 'blue' | 'violet' | 'slate';

const TONE_OF: Record<string, Tone> = {
  'معلّقة': 'amber',
  'متاحة': 'green',
  'ملغاة': 'red',
  'بانتظار المراجعة': 'amber',
  'مرفوض': 'red',
  'تم التحويل': 'violet',
  'ملغي': 'slate',
  'نشط': 'green',
  'مجمّد': 'red',
  'اشترك': 'green',
  'دعوة مرسلة': 'slate',
  'سجل': 'blue',
  'استرد المبلغ': 'red',
  'رابط': 'violet',
  'دعوة': 'slate',
  'الافتراضي': 'green',
  'حساب بنكي': 'blue',
  'محفظة إلكترونية': 'green',
  PayPal: 'violet',
};

const DOT: Record<Tone, string> = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-400',
};

/** status badge in the shadcn dashboard style: outline + colored dot */
export function StatusPill({ text, className }: { text: string; className?: string }): JSX.Element {
  const tone = TONE_OF[text] ?? 'slate';
  return (
    <Badge variant="outline" className={cn('gap-1.5 whitespace-nowrap px-2 py-0.5 text-[11px] font-medium text-muted-foreground', className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', DOT[tone])} />
      {text}
    </Badge>
  );
}

export function Money({ v, cur, className }: { v: number; cur: Currency; className?: string }): JSX.Element {
  return (
    <span className={cn('whitespace-nowrap tabular-nums', className)}>
      <bdi dir="ltr">{v.toLocaleString('en-US', { maximumFractionDigits: 3 })}</bdi> {FX[cur].sym}
    </span>
  );
}

export function Note({ tone = 'info', children, className }: { tone?: 'info' | 'warn' | 'error'; children: React.ReactNode; className?: string }): JSX.Element {
  const tones = {
    info: 'border-blue-200 bg-blue-50/60 text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200',
    warn: 'border-amber-200 bg-amber-50/60 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200',
    error: 'border-red-200 bg-red-50/60 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200',
  };
  const Icon = tone === 'error' ? CircleAlert : tone === 'warn' ? AlertTriangle : Info;
  return (
    <div role={tone === 'error' ? 'alert' : undefined} className={cn('flex gap-2.5 rounded-lg border px-3 py-2.5 text-xs leading-relaxed', tones[tone], className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

const STAT_ACCENT: Record<'amber' | 'green' | 'blue', string> = {
  amber: 'bg-amber-500',
  green: 'bg-emerald-500',
  blue: 'bg-blue-500',
};

/** KPI card in the shadcn dashboard "section cards" style */
export function Stat({
  label,
  value,
  tone,
  hint,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  tone?: 'amber' | 'green' | 'blue';
  hint?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}): JSX.Element {
  return (
    <Card className="bg-gradient-to-t from-primary/5 to-card shadow-sm dark:bg-card dark:from-card">
      <CardHeader className="space-y-2 p-5 pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardDescription className="flex items-center gap-2">
            {tone && <span className={cn('h-2 w-2 rounded-full', STAT_ACCENT[tone])} />}
            {label}
          </CardDescription>
          {Icon && (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border bg-background text-muted-foreground">
              <Icon className="h-4 w-4" />
            </span>
          )}
        </div>
        <CardTitle className="text-2xl font-semibold tabular-nums lg:text-[1.65rem]">{value}</CardTitle>
      </CardHeader>
      {hint && <CardFooter className="px-5 pb-5 pt-0 text-xs text-muted-foreground">{hint}</CardFooter>}
    </Card>
  );
}

export function PageHeader({ title, desc, actions }: { title: string; desc?: string; actions?: React.ReactNode }): JSX.Element {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/** the validation rule of a field, shown right under it */
export function FieldHint({ children, className }: { children: React.ReactNode; className?: string }): JSX.Element {
  return <p className={cn('text-[11px] leading-relaxed text-muted-foreground', className)}>{children}</p>;
}

/** status filter tabs with counters (shadcn Tabs) */
export function FilterTabs({
  tabs,
  value,
  onChange,
  count,
}: {
  tabs: [string, string][];
  value: string;
  onChange: (v: string) => void;
  count: (key: string) => number;
}): JSX.Element {
  return (
    <Tabs value={value} onValueChange={onChange} dir="rtl">
      <TabsList className="h-auto flex-wrap justify-start">
        {tabs.map(([k, t]) => (
          <TabsTrigger key={k} value={k} className="gap-1.5 text-xs">
            {t}
            <span className="rounded-full bg-muted-foreground/15 px-1.5 text-[10px] tabular-nums">{count(k)}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

/** table footer pager */
export function Pager({ page, pages, total, size, onPage }: { page: number; pages: number; total: number; size: number; onPage: (p: number) => void }): JSX.Element | null {
  if (total <= size) return null;
  return (
    <div className="flex items-center justify-between gap-2 border-t px-4 py-3 text-xs text-muted-foreground">
      <span className="tabular-nums">
        {(page - 1) * size + 1}–{Math.min(page * size, total)} من {total}
      </span>
      <div className="flex items-center gap-1.5">
        <Button size="icon" variant="outline" className="h-8 w-8" aria-label="الصفحة السابقة" disabled={page === 1} onClick={() => onPage(page - 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <span className="px-2 font-medium text-foreground">
          صفحة {page} من {pages}
        </span>
        <Button size="icon" variant="outline" className="h-8 w-8" aria-label="الصفحة التالية" disabled={page === pages} onClick={() => onPage(page + 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
