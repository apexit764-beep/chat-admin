import { ReactNode, useState } from 'react';
import { AlertTriangle, ArrowDown, ArrowUp, Plus, X } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/input';
import type { Dual, Locale } from '@/types/siteContent';
import { isBlank } from '@/utils/siteContent';
import { cn } from '@/lib/utils';

type FieldType = 'text' | 'textarea' | 'list';
type ValueOf<T extends FieldType> = T extends 'list' ? string[] : string;

/** حدود الطول المقترحة — تحذير لا منع */
export const LIMITS = { title: 60, description: 180 } as const;

/**
 * حقل ثنائي اللغة بنمط اللوحة نفسه (BilingualInput): حقل واحد ومبدّل
 * «العربية | En». يضيف ما يحتاجه محتوى الموقع: نوع «قائمة نقاط»، ونقطة
 * على «En» حين تنقص الترجمة، وعدّاد يحذّر عند تجاوز الطول المقترح ولا يمنع.
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
  /** يظهر تحت حقل اللغة المختارة — رقائق الكلمات مثلاً */
  below?: (locale: Locale) => ReactNode;
  compact?: boolean;
}): JSX.Element {
  const [lang, setLang] = useState<Locale>('ar');
  const missingEn = !isBlank(value.ar) && isBlank(value.en);
  const missingAr = isBlank(value.ar) && !isBlank(value.en);
  const text = value[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const length = Array.isArray(text) ? Math.max(0, ...text.map((s) => s.length)) : text.length;
  const over = limit !== undefined && length > limit;
  const set = (next: ValueOf<T>): void => onChange({ ...value, [lang]: next });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className={cn('font-medium', compact ? 'text-xs text-muted-foreground' : 'text-sm')}>{label}</label>
        <div className="flex gap-1 bg-muted p-1 rounded-md">
          {(['ar', 'en'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={cn(
                'relative px-3 py-1 rounded text-sm font-medium transition-colors',
                lang === l ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {l === 'ar' ? 'العربية' : 'En'}
              {((l === 'en' && missingEn) || (l === 'ar' && missingAr)) && (
                <span className="absolute -top-0.5 -end-0.5 h-2 w-2 rounded-full bg-warning ring-2 ring-muted" title="الترجمة ناقصة" />
              )}
            </button>
          ))}
        </div>
      </div>

      {type === 'text' && <Input key={lang} value={text as string} dir={dir} onChange={(e) => set(e.target.value as ValueOf<T>)} />}
      {type === 'textarea' && <Textarea key={lang} value={text as string} dir={dir} rows={3} onChange={(e) => set(e.target.value as ValueOf<T>)} />}
      {type === 'list' && <StringList key={lang} dir={dir} items={text as string[]} onChange={(items) => set(items as ValueOf<T>)} />}

      <div className="flex items-center gap-3 text-[11px]">
        {((lang === 'en' && missingEn) || (lang === 'ar' && missingAr)) && (
          <span className="flex items-center gap-1 text-warning">
            <AlertTriangle className="h-3 w-3" /> الترجمة ناقصة
          </span>
        )}
        {over && (
          <span className="text-warning">
            تجاوز الطول المقترح — {isTitle ? 'قد يلتفّ العنوان لسطر ثالث.' : 'قد يلتفّ لسطر إضافي.'}
          </span>
        )}
        {limit !== undefined && type !== 'list' && (
          <span dir="ltr" className={cn('ms-auto tabular-nums', over ? 'font-semibold text-warning' : 'text-muted-foreground')}>
            {length}/{limit}
          </span>
        )}
      </div>

      {below?.(lang)}
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
