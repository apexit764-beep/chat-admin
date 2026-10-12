import { useState } from 'react';
import { ArrowDown, ArrowUp, Lock, Plus, X } from 'lucide-react';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import type { Channel } from '@/types/siteContent';
import { cn } from '@/lib/utils';
import { IconBtn } from './DualField';

/** شعار قناة من المكتبة — مع لون هويتها كهالة خفيفة كما في الموقع */
export function ChannelLogo({ channel, size = 'md' }: { channel: Channel | undefined; size?: 'sm' | 'md' }): JSX.Element {
  const box = size === 'sm' ? 'h-7 w-7 p-1' : 'h-9 w-9 p-1.5';
  if (!channel) return <span className={cn('rounded-lg bg-muted', box)} />;
  return (
    <span className={cn('inline-flex shrink-0 items-center justify-center rounded-lg bg-white border border-border', box)} style={{ boxShadow: `0 0 0 3px ${channel.ring}` }} title={channel.name.ar}>
      {channel.logo ? <img src={channel.logo.url} alt={channel.name.ar} className="h-full w-full object-contain" /> : <span className="text-[10px]">{channel.key}</span>}
    </span>
  );
}

/**
 * اختيار قنوات لسكشن من مكتبة القنوات (CMS-PROMPT §7.7) — لا رفع شعار في
 * مكانه. «مقفل العدد» حين تكون مواضع الشعارات مصمّمة (بطاقات الهيرو،
 * القنوات الطائرة): يُبدَّل الشعار في خانته ولا تُضاف خانة.
 */
export function ChannelsPicker({
  label,
  value,
  onChange,
  locked,
  min = 0,
  max = Infinity,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (keys: string[]) => void;
  locked?: boolean;
  min?: number;
  max?: number;
  hint?: string;
}): JSX.Element {
  const library = useSiteContentStore((s) => s.draft.channels.items);
  const byKey = new Map(library.map((c) => [c.key, c]));
  const [adding, setAdding] = useState(false);
  const available = library.filter((c) => c.enabled !== false && (locked || !value.includes(c.key)));

  const move = (from: number, to: number): void => {
    const next = [...value];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{label}</span>
        {locked && <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><Lock className="h-3 w-3" /> العدد مقفل — مواضعها مصمّمة</span>}
      </div>
      <div className="space-y-1.5">
        {value.map((key, i) => (
          <div key={`${key}-${i}`} className="flex items-center gap-2 rounded-lg border border-border bg-card px-2 py-1.5">
            <span className="w-5 text-center text-xs tabular-nums text-muted-foreground">{i + 1}</span>
            <ChannelLogo channel={byKey.get(key)} size="sm" />
            <select
              value={key}
              onChange={(e) => onChange(value.map((k, j) => (j === i ? e.target.value : k)))}
              className="h-8 flex-1 rounded-md border border-input bg-background px-2 text-sm"
              aria-label={`القناة ${i + 1}`}
            >
              {library.map((c) => (
                <option key={c.key} value={c.key} disabled={c.key !== key && value.includes(c.key) && !locked}>
                  {c.name.ar} · {c.name.en}{c.enabled === false ? ' (معطّلة)' : ''}
                </option>
              ))}
            </select>
            {byKey.get(key)?.enabled === false && <span className="text-[11px] text-warning">معطّلة — لن تظهر</span>}
            <IconBtn label="لأعلى" disabled={i === 0} onClick={() => move(i, i - 1)}><ArrowUp className="h-3.5 w-3.5" /></IconBtn>
            <IconBtn label="لأسفل" disabled={i === value.length - 1} onClick={() => move(i, i + 1)}><ArrowDown className="h-3.5 w-3.5" /></IconBtn>
            {!locked && value.length > min && (
              <IconBtn label="إزالة" danger onClick={() => onChange(value.filter((_, j) => j !== i))}><X className="h-3.5 w-3.5" /></IconBtn>
            )}
          </div>
        ))}
      </div>
      {!locked && value.length < max && (
        adding ? (
          <div className="flex flex-wrap gap-1.5 rounded-lg border border-dashed border-border p-2">
            {available.map((c) => (
              <button key={c.key} type="button" onClick={() => { onChange([...value, c.key]); setAdding(false); }} className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs hover:border-primary">
                <ChannelLogo channel={c} size="sm" /> {c.name.ar}
              </button>
            ))}
            <button type="button" onClick={() => setAdding(false)} className="px-2 text-xs text-muted-foreground">إلغاء</button>
          </div>
        ) : (
          <button type="button" onClick={() => setAdding(true)} className="flex items-center gap-1 text-xs text-primary hover:underline">
            <Plus className="h-3.5 w-3.5" /> إضافة قناة
          </button>
        )
      )}
      {(hint || Number.isFinite(max)) && (
        <p className="text-xs text-muted-foreground">
          {hint}
          {!locked && Number.isFinite(max) && ` ${min}–${max} قنوات.`}
        </p>
      )}
    </div>
  );
}
