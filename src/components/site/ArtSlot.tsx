import { ReactNode, useState } from 'react';
import { Blocks, ImageIcon, RotateCcw, Upload } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import type { ArtOverride, Dual } from '@/types/siteContent';
import { cn } from '@/lib/utils';
import { DualField } from './DualField';
import { readImage } from './files';

/**
 * خانة الرسمة: المشهد المبني بالكود (افتراضياً) أو صورة أو GIF.
 *
 * البديل يُحفظ في حقل منفصل، فالمشهد ونصوصه لا تُمسّ — والرجوع للمبنية
 * نقرة. الصورة المختارة تبقى محفوظة لو بدّل المحرّر بين الأنواع ثم رجع.
 */
export function ArtSlot({
  label,
  override,
  onChange,
  sceneLabel,
  sceneEditor,
  ratio = 3 / 2,
  suggestedSize = '1200×800',
}: {
  label: string;
  override: ArtOverride | null | undefined;
  onChange: (next: ArtOverride | null) => void;
  /** مفتاح المشهد المبني — يظهر للمحرّر ليعرف أي رسمة هذه */
  sceneLabel?: string;
  /** محرّر نصوص المشهد إن كان له نصوص */
  sceneEditor?: ReactNode;
  ratio?: number;
  suggestedSize?: string;
}): JSX.Element {
  const showToast = useUIStore((s) => s.showToast);
  const [pending, setPending] = useState<'image' | 'gif' | null>(null);
  const [memory, setMemory] = useState<Partial<Record<'image' | 'gif', ArtOverride>>>(override ? { [override.kind]: override } : {});
  const mode = pending ?? override?.kind ?? 'scene';

  const pick = (kind: 'scene' | 'image' | 'gif'): void => {
    if (kind === 'scene') {
      setPending(null);
      return onChange(null);
    }
    if (memory[kind]) {
      setPending(null);
      return onChange(memory[kind]!);
    }
    setPending(kind);
  };

  const upload = async (file: File, kind: 'image' | 'gif'): Promise<void> => {
    const res = await readImage(file, {
      maxKb: kind === 'gif' ? 2048 : 1024,
      types: kind === 'gif' ? ['image/gif', 'image/webp'] : ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
    });
    if ('error' in res) return showToast(res.error, 'error');
    const next: ArtOverride = { kind, url: res.url, name: res.name, alt: override?.alt ?? { ar: '', en: '' } };
    setMemory((m) => ({ ...m, [kind]: next }));
    setPending(null);
    onChange(next);
  };

  const shown = override && override.kind === mode ? override : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold">{label}</span>
        <div role="radiogroup" className="inline-flex rounded-lg border border-border p-0.5">
          {(['scene', 'image', 'gif'] as const).map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={mode === k}
              onClick={() => pick(k)}
              className={cn('rounded-md px-3 py-1 text-xs font-semibold', mode === k ? 'bg-primary/10 text-primary' : 'text-muted-foreground')}
            >
              {k === 'scene' ? 'الرسمة المبنية' : k === 'image' ? 'صورة' : 'GIF'}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-border bg-muted" style={{ aspectRatio: ratio }}>
        <div className="absolute inset-0 flex items-center justify-center">
          {mode === 'scene' ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Blocks className="h-7 w-7" />
              <span className="text-xs">رسمة متحرّكة مبنية بالكود</span>
              {sceneLabel && <code dir="ltr" className="rounded bg-card px-2 py-0.5 text-[11px]">{sceneLabel}</code>}
            </div>
          ) : shown ? (
            <img src={shown.url} alt={shown.alt.ar} className="h-full w-full object-contain" />
          ) : (
            <label className="flex cursor-pointer flex-col items-center gap-2 text-xs text-muted-foreground hover:text-primary">
              <Upload className="h-6 w-6" />
              اختر {mode === 'gif' ? 'ملف GIF' : 'صورة'}
              <input type="file" className="hidden" accept={mode === 'gif' ? '.gif,.webp' : '.png,.jpg,.jpeg,.webp,.svg'} onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) upload(f, mode); }} />
            </label>
          )}
        </div>
        {/* خطوط الأثلاث — ليرى المحرّر كيف ستُقصّ الصورة أو يحيطها فراغ */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {[33.33, 66.66].map((p) => (
            <span key={`v${p}`} className="absolute inset-y-0 border-s border-dashed border-primary/25" style={{ insetInlineStart: `${p}%` }} />
          ))}
          {[33.33, 66.66].map((p) => (
            <span key={`h${p}`} className="absolute inset-x-0 border-t border-dashed border-primary/25" style={{ top: `${p}%` }} />
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        الإطار بنسبة الموقع · المقاس المقترح {suggestedSize}، والخلفية الشفّافة تندمج أفضل.
      </p>

      {mode === 'scene' ? (
        sceneEditor
      ) : (
        <div className="space-y-3">
          {shown && (
            <>
              <div className="flex items-center gap-2 text-xs">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                <span dir="ltr" className="truncate">{shown.name}</span>
                <label className="ms-auto cursor-pointer text-primary hover:underline">
                  تغيير
                  <input type="file" className="hidden" accept={mode === 'gif' ? '.gif,.webp' : '.png,.jpg,.jpeg,.webp,.svg'} onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) upload(f, mode); }} />
                </label>
              </div>
              <DualField
                label="النص البديل"
                value={shown.alt}
                onChange={(alt: Dual) => {
                  const next = { ...shown, alt };
                  setMemory((m) => ({ ...m, [shown.kind]: next }));
                  onChange(next);
                }}
                hint="يصف الصورة لمن لا يراها ولمحركات البحث."
              />
            </>
          )}
          <button type="button" onClick={() => pick('scene')} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
            <RotateCcw className="h-3.5 w-3.5" /> الرجوع للرسمة المبنية
          </button>
        </div>
      )}
    </div>
  );
}
