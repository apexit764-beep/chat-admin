import { cn } from '@/lib/utils';
import { FX, type Currency } from '@v/lib/vendorMath';

const PILL: Record<string, string> = {
  'معلّقة': 'bg-amber-100 text-amber-800',
  'متاحة': 'bg-green-100 text-green-700',
  'ملغاة': 'bg-red-100 text-red-700',
  'بانتظار المراجعة': 'bg-amber-100 text-amber-800',
  'تمت الموافقة': 'bg-blue-100 text-blue-700',
  'مرفوض': 'bg-red-100 text-red-700',
  'تم التحويل': 'bg-violet-100 text-violet-700',
  'نشط': 'bg-green-100 text-green-700',
  'مجمّد': 'bg-red-100 text-red-700',
  'اشترك': 'bg-green-100 text-green-700',
  'دعوة مرسلة': 'bg-slate-100 text-slate-600',
  'سجل': 'bg-blue-100 text-blue-700',
  'استرد المبلغ': 'bg-red-100 text-red-700',
  'رابط': 'bg-violet-100 text-violet-700',
  'دعوة': 'bg-slate-100 text-slate-600',
  'الافتراضي': 'bg-green-100 text-green-700',
  'حساب بنكي': 'bg-blue-100 text-blue-700',
  'محفظة إلكترونية': 'bg-green-100 text-green-700',
  PayPal: 'bg-violet-100 text-violet-700',
};

export function StatusPill({ text, className }: { text: string; className?: string }): JSX.Element {
  return (
    <span className={cn('inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold', PILL[text] ?? 'bg-slate-100 text-slate-600', className)}>
      {text}
    </span>
  );
}

export function Money({ v, cur, className }: { v: number; cur: Currency; className?: string }): JSX.Element {
  return (
    <span className={cn('whitespace-nowrap', className)}>
      <bdi dir="ltr">{v.toLocaleString('en-US', { maximumFractionDigits: 3 })}</bdi> {FX[cur].sym}
    </span>
  );
}

export function Note({ tone = 'info', children, className }: { tone?: 'info' | 'warn' | 'error'; children: React.ReactNode; className?: string }): JSX.Element {
  const tones = {
    info: 'border-blue-200 bg-blue-50 text-blue-800',
    warn: 'border-amber-200 bg-amber-50 text-amber-800',
    error: 'border-red-200 bg-red-50 text-red-800',
  };
  return <div className={cn('rounded-lg border px-3 py-2.5 text-xs leading-relaxed', tones[tone], className)}>{children}</div>;
}

export function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: 'amber' | 'green' | 'blue' }): JSX.Element {
  const bg = tone === 'amber' ? 'bg-amber-50' : tone === 'green' ? 'bg-emerald-50' : tone === 'blue' ? 'bg-blue-50' : 'bg-card';
  return (
    <div className={cn('rounded-xl border p-4', bg)}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  );
}

export function PageHeader({ title, desc, actions }: { title: string; desc?: string; actions?: React.ReactNode }): JSX.Element {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
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
