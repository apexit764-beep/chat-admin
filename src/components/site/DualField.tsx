import { ReactNode, useState } from 'react';
import { AlertTriangle, ArrowDown, ArrowUp, Plus, X } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/input';
import type { Dual, Locale } from '@/types/siteContent';
import { isBlank } from '@/utils/siteContent';
import { cn } from '@/lib/utils';

type FieldType = 'text' | 'textarea' | 'list';
type ValueOf<T extends FieldType> = T extends 'list' ? string[] : string;

/** حدود الطول المقترحة (§6.1) — تحذير لا منع */
export const LIMITS = { title: 60, description: 180, testimonial: 220 } as const;

const TAG: Record<Locale, string> = { ar: 'العربية', en: 'En' };

/**
 * الحقل ثنائي اللغة (CMS-PROMPT §6.1):
 * - العربية والإنجليزية **جنباً إلى جنب** على الشاشات ≥ 1280px، وتبويبان
 *   «العربية | En» تحتها — بشكل LanguageTabs نفسه في اللوحة.
 * - كل لغة باتجاهها، وشارة «الترجمة ناقصة» عند الحقل الفارغ.
 * - عدّاد أحرف بحدّ مقترح؛ تجاوزه تحذير لا منع.
 */
export function DualField<T extends FieldType = 'text'>({
  label,
  value,
  onChange,
  type = 'text' as T,
  limit,
  isTitle,
  hint,
  below,
  compact,
}: {
  label: ReactNode;
  value: Dual<ValueOf<T>>;
  onChange: (value: Dual<ValueOf<T>>) => void;
  type?: T;
  limit?: number;
  isTitle?: boolean;
  hint?: ReactNode;
  /** يظهر تحت حقل كل لغة — رقائق الكلمات مثلاً */
  below?: (locale: Locale) => ReactNode;
  compact?: boolean;
}): JSX.Element {
  const [active, setActive] = useState<Locale>('ar');
  const missing: Record<Locale, boolean> = {
    ar: isBlank(value.ar) && !isBlank(value.en),
    en: !isBlank(value.ar) && isBlank(value.en),
  };
  const set = (l: Locale, next: ValueOf<T>): void => onChange({ ...value, [l]: next });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className={cn('font-medium', compact ? 'text-xs text-muted-foreground' : 'text-sm')}>{label}</label>
        {/* التبويبان تحت 1280px فقط */}
        <div className="flex gap-1 bg-muted p-1 rounded-md xl:hidden">
          {(['ar', 'en'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setActive(l)}
              className={cn(
                'relative px-3 py-1 rounded text-sm font-medium transition-colors',
                active === l ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {TAG[l]}
              {missing[l] && <span className="absolute -top-0.5 -end-0.5 h-2 w-2 rounded-full bg-warning ring-2 ring-muted" />}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        {(['ar', 'en'] as const).map((l) => {
          const text = value[l] ?? (type === 'list' ? [] : '');
          const dir = l === 'ar' ? 'rtl' : 'ltr';
          const length = Array.isArray(text) ? Math.max(0, ...text.map((s) => s.length)) : String(text).length;
          const over = limit !== undefined && length > limit;

          return (
            <div key={l} lang={l} className={cn('space-y-1.5', active !== l && 'hidden', 'xl:block')}>
              <div className="hidden xl:flex items-center gap-2 text-[11px]">
                <span className="rounded bg-muted px-1.5 py-0.5 font-semibold text-muted-foreground">{TAG[l]}</span>
              </div>

              {type === 'text' && <Input dir={dir} value={text as string} onChange={(e) => set(l, e.target.value as ValueOf<T>)} />}
              {type === 'textarea' && <Textarea dir={dir} rows={3} value={text as string} onChange={(e) => set(l, e.target.value as ValueOf<T>)} />}
              {type === 'list' && <StringList dir={dir} items={text as string[]} onChange={(items) => set(l, items as ValueOf<T>)} />}

              <div className="flex items-center gap-3 text-[11px]">
                {missing[l] && (
                  <span className="flex items-center gap-1 text-warning">
                    <AlertTriangle className="h-3 w-3" /> الترجمة ناقصة
                  </span>
                )}
                {over && <span className="text-warning">{isTitle ? 'قد يلتفّ العنوان لسطر ثالث' : 'قد يلتفّ لسطر إضافي'}</span>}
                {limit !== undefined && type !== 'list' && (
                  <span dir="ltr" className={cn('ms-auto tabular-nums', over ? 'font-semibold text-warning' : 'text-muted-foreground')}>
                    {length}/{limit}
                  </span>
                )}
              </div>
              {below?.(l)}
            </div>
          );
        })}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function StringList({ dir, items, onChange }: { dir: 'rtl' | 'ltr'; items: string[]; onChange: (items: string[]) => void }): JSX.Element {
  const move = (from: number, to: number): void => {
    const next = [...items];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    onChange(next);
  };

  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1">
          <Input dir={dir} className="h-9" value={item} placeholder="سطر جديد" onChange={(e) => onChange(items.map((v, j) => (j === i ? e.target.value : v)))} />
          <IconBtn label="لأعلى" disabled={i === 0} onClick={() => move(i, i - 1)}>
            <ArrowUp className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn label="لأسفل" disabled={i === items.length - 1} onClick={() => move(i, i + 1)}>
            <ArrowDown className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn label="حذف" danger onClick={() => onChange(items.filter((_, j) => j !== i))}>
            <X className="h-3.5 w-3.5" />
          </IconBtn>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ''])} className="flex items-center gap-1 text-xs text-primary hover:underline">
        <Plus className="h-3.5 w-3.5" /> إضافة سطر
      </button>
    </div>
  );
}

export function IconBtn({ label, onClick, disabled, children, danger }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode; danger?: boolean }): JSX.Element {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'h-8 w-8 shrink-0 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none',
        danger ? 'hover:text-destructive' : 'hover:text-foreground'
      )}
    >
      {children}
    </button>
  );
}
