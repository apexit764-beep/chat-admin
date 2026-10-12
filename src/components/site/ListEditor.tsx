import { ReactNode, useRef, useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { ArrowDown, ArrowUp, ChevronDown, GripVertical, Lock, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconBtn } from './DualField';

let counter = 0;
const nextKey = (): string => `row-${++counter}`;

/**
 * القائمة المرتّبة (CMS-PROMPT §6.3): عناصر مطويّة بعنوانها تنفتح للتحرير،
 * وتُرتَّب بالسحب من المقبض — أو بالأسهم لمن يستعمل لوحة المفاتيح.
 *
 * «العدد المقفل»: عناصر عددها جزء من تصميم الموقع (خطوات الرحلة، الباقات
 * الأربع، القطاعات السبعة) — تُحرَّر وتُرتَّب، ولا تُضاف ولا تُحذف.
 */
export function ListEditor<T>({
  items,
  onChange,
  renderItem,
  getTitle,
  getMeta,
  createItem,
  locked,
  fixedOrder,
  min = 0,
  max = Infinity,
  addLabel = 'إضافة عنصر',
  lockedNote = 'عدد هذه العناصر ثابت في تصميم الموقع. لإضافة عنصر تواصل مع المطوّر.',
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, update: (next: T) => void, index: number) => ReactNode;
  getTitle: (item: T, index: number) => ReactNode;
  getMeta?: (item: T, index: number) => ReactNode;
  createItem?: () => T;
  locked?: boolean;
  /** الترتيب جزء من التصميم — لا سحب */
  fixedOrder?: boolean;
  min?: number;
  max?: number;
  addLabel?: string;
  lockedNote?: string;
}): JSX.Element {
  // مفاتيح ثابتة تتحرّك مع عناصرها — الفهرس وحده يتبدّل مع كل سحب
  const keys = useRef<string[]>([]);
  while (keys.current.length < items.length) keys.current.push(nextKey());
  if (keys.current.length > items.length) keys.current = keys.current.slice(0, items.length);
  const [open, setOpen] = useState<Set<string>>(new Set());

  const reorder = (nextKeys: string[]): void => {
    const byKey = new Map(keys.current.map((k, i) => [k, items[i]]));
    keys.current = nextKeys;
    onChange(nextKeys.map((k) => byKey.get(k)!));
  };

  const move = (from: number, to: number): void => {
    const next = [...keys.current];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    reorder(next);
  };

  const toggle = (key: string): void =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const canAdd = !locked && createItem && items.length < max;
  const canRemove = !locked && items.length > min;

  return (
    <div className="space-y-2">
      <Reorder.Group axis="y" values={keys.current} onReorder={reorder} className="space-y-2">
        {items.map((item, i) => {
          const key = keys.current[i];
          return (
            <Row
              key={key}
              value={key}
              index={i}
              total={items.length}
              open={open.has(key)}
              draggable={!fixedOrder}
              title={getTitle(item, i)}
              meta={getMeta?.(item, i)}
              onToggle={() => toggle(key)}
              onMove={move}
              onRemove={
                canRemove
                  ? () => {
                      keys.current = keys.current.filter((_, j) => j !== i);
                      onChange(items.filter((_, j) => j !== i));
                    }
                  : undefined
              }
            >
              {renderItem(item, (next) => onChange(items.map((it, j) => (j === i ? next : it))), i)}
            </Row>
          );
        })}
      </Reorder.Group>

      <div className="flex flex-wrap items-center gap-3">
        {canAdd && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const key = nextKey();
              keys.current = [...keys.current, key];
              onChange([...items, createItem!()]);
              setOpen((p) => new Set(p).add(key));
            }}
          >
            <Plus className="h-3.5 w-3.5 me-1" /> {addLabel}
          </Button>
        )}
        {locked && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" /> {lockedNote}
          </p>
        )}
        {!locked && Number.isFinite(max) && (
          <p className="text-xs text-muted-foreground">
            {min === max ? `${max} عناصر بالضبط.` : `من ${min} إلى ${max} عناصر.`}
            {items.length >= max && ' وصلت الحدّ الأقصى.'}
          </p>
        )}
      </div>
    </div>
  );
}

function Row({
  value,
  index,
  total,
  open,
  draggable,
  title,
  meta,
  onToggle,
  onMove,
  onRemove,
  children,
}: {
  value: string;
  index: number;
  total: number;
  open: boolean;
  draggable: boolean;
  title: ReactNode;
  meta?: ReactNode;
  onToggle: () => void;
  onMove: (from: number, to: number) => void;
  onRemove?: () => void;
  children: ReactNode;
}): JSX.Element {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={value}
      dragListener={false}
      dragControls={controls}
      className={cn('rounded-xl border bg-card', open ? 'border-primary/40' : 'border-border')}
    >
      <div className="flex items-center gap-1 ps-1 pe-1">
        {draggable && (
          <button
            type="button"
            aria-label="اسحب لإعادة الترتيب"
            title="اسحب لإعادة الترتيب"
            onPointerDown={(e) => controls.start(e)}
            className="h-8 w-7 shrink-0 cursor-grab touch-none active:cursor-grabbing flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}
        <span className="w-5 shrink-0 text-center text-xs tabular-nums text-muted-foreground">{index + 1}</span>
        <button type="button" onClick={onToggle} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-2 py-3 text-start text-sm font-semibold">
          <span className="truncate">{title || <span className="text-muted-foreground">بلا عنوان</span>}</span>
        </button>
        {meta && <div className="flex shrink-0 items-center gap-1">{meta}</div>}
        {draggable && (
          <>
            <IconBtn label="لأعلى" disabled={index === 0} onClick={() => onMove(index, index - 1)}>
              <ArrowUp className="h-3.5 w-3.5" />
            </IconBtn>
            <IconBtn label="لأسفل" disabled={index === total - 1} onClick={() => onMove(index, index + 1)}>
              <ArrowDown className="h-3.5 w-3.5" />
            </IconBtn>
          </>
        )}
        {onRemove && (
          <IconBtn label="حذف" danger onClick={onRemove}>
            <Trash2 className="h-3.5 w-3.5" />
          </IconBtn>
        )}
        <IconBtn label={open ? 'طيّ' : 'فتح للتحرير'} onClick={onToggle}>
          <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
        </IconBtn>
      </div>
      {open && <div className="space-y-5 border-t border-border p-4">{children}</div>}
    </Reorder.Item>
  );
}
