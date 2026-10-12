import { ReactNode, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, Lock, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconBtn } from './DualField';

/**
 * قائمة عناصر قابلة لإعادة الترتيب، مطويّة افتراضياً بعنوانها.
 *
 * «العدد المقفل»: عناصر عددها جزء من تصميم الموقع (خطوات الرحلة، صفّا
 * التفاصيل) — تُحرَّر وتُرتَّب، ولا تُضاف ولا تُحذف.
 */
export function ListEditor<T>({
  items,
  onChange,
  renderItem,
  getTitle,
  getMeta,
  createItem,
  locked,
  min = 0,
  max = Infinity,
  addLabel = 'إضافة عنصر',
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, update: (next: T) => void, index: number) => ReactNode;
  getTitle: (item: T, index: number) => ReactNode;
  getMeta?: (item: T, index: number) => ReactNode;
  createItem?: () => T;
  locked?: boolean;
  min?: number;
  max?: number;
  addLabel?: string;
}): JSX.Element {
  // الفهارس المفتوحة — تتحرّك مع العنصر عند إعادة الترتيب
  const [open, setOpen] = useState<Set<number>>(new Set());

  const move = (from: number, to: number): void => {
    const next = [...items];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    onChange(next);
    setOpen((prev) => new Set([...prev].map((i) => (i === from ? to : i === to ? from : i))));
  };

  const toggle = (i: number): void =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const canAdd = !locked && createItem && items.length < max;
  const canRemove = !locked && items.length > min;

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} className={cn('rounded-xl border bg-card', isOpen ? 'border-primary/40' : 'border-border')}>
            <div className="flex items-center gap-1 ps-2 pe-1">
              <span className="w-5 shrink-0 text-center text-xs tabular-nums text-muted-foreground">{i + 1}</span>
              <button type="button" onClick={() => toggle(i)} aria-expanded={isOpen} className="flex min-w-0 flex-1 items-center gap-2 py-3 text-start text-sm font-semibold">
                <span className="truncate">{getTitle(item, i) || <span className="text-muted-foreground">بلا عنوان</span>}</span>
              </button>
              {getMeta && <div className="flex shrink-0 items-center gap-1">{getMeta(item, i)}</div>}
              <IconBtn label="لأعلى" disabled={i === 0} onClick={() => move(i, i - 1)}>
                <ArrowUp className="h-3.5 w-3.5" />
              </IconBtn>
              <IconBtn label="لأسفل" disabled={i === items.length - 1} onClick={() => move(i, i + 1)}>
                <ArrowDown className="h-3.5 w-3.5" />
              </IconBtn>
              {canRemove && (
                <IconBtn
                  label="حذف"
                  danger
                  onClick={() => {
                    onChange(items.filter((_, j) => j !== i));
                    setOpen(new Set());
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </IconBtn>
              )}
              <IconBtn label={isOpen ? 'طيّ' : 'فتح للتحرير'} onClick={() => toggle(i)}>
                <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
              </IconBtn>
            </div>
            {isOpen && <div className="space-y-4 border-t border-border p-4">{renderItem(item, (next) => onChange(items.map((it, j) => (j === i ? next : it))), i)}</div>}
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-3">
        {canAdd && (
          <button
            type="button"
            onClick={() => {
              onChange([...items, createItem!()]);
              setOpen((p) => new Set(p).add(items.length));
            }}
            className="h-9 px-3 rounded-md border border-border text-sm font-medium hover:bg-muted flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" /> {addLabel}
          </button>
        )}
        {locked && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" /> عدد هذه العناصر ثابت في تصميم الموقع — تُحرَّر وتُرتَّب فقط.
          </p>
        )}
        {!locked && Number.isFinite(max) && (
          <p className="text-xs text-muted-foreground">
            من {min} إلى {max} عناصر.
          </p>
        )}
      </div>
    </div>
  );
}
