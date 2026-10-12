import { ReactNode, useState } from 'react';
import type { Dual, Locale } from '@/types/siteContent';
import { LOCALES, pruneWords, titleWords, toggleWord } from '@/utils/siteContent';
import { cn } from '@/lib/utils';
import { DualField, LIMITS } from './DualField';

/**
 * العنوان مع اختيار الكلمات الملوّنة.
 *
 * اللون لا يُخزَّن داخل النص — معه قائمة كلمات يلوّنها الموقع وقت العرض،
 * تُختار هنا بالنقر. الكشيدة يكتبها الكاتب بنفسه في النص (ـ). والمعاينة
 * بخطّ الموقع ومنطقه نفسه.
 */
export function TitleField({
  label,
  title,
  highlight,
  onChange,
}: {
  label: ReactNode;
  title: Dual;
  highlight: Dual<string[]>;
  onChange: (next: { title: Dual; highlight: Dual<string[]> }) => void;
}): JSX.Element {
  const [notice, setNotice] = useState<Partial<Record<Locale, string>>>({});

  // تعديل النص يُسقط كل كلمة ملوّنة لم تعد فيه، مع تنبيه هادئ
  const onTitle = (next: Dual): void => {
    const nextHighlight = { ...highlight };
    const notes: Partial<Record<Locale, string>> = {};
    for (const l of LOCALES) {
      if (next[l] === title[l]) continue;
      const { kept, removed } = pruneWords(highlight[l], next[l]);
      nextHighlight[l] = kept;
      if (removed.length) notes[l] = `أزلنا «${removed.join('، ')}» من التلوين لأنها لم تعد في العنوان.`;
    }
    setNotice((p) => ({ ...p, ...notes }));
    onChange({ title: next, highlight: nextHighlight });
  };

  return (
    <div className="space-y-3">
      <DualField
        label={label}
        value={title}
        onChange={onTitle}
        limit={LIMITS.title}
        isTitle
        hint="انقر كلمة تحت الحقل لتلوينها بلون الهوية. للكشيدة اكتبها بنفسك داخل الكلمة (ـ)، مثل «عميـــل»."
        below={(l) => (
          <div className="space-y-1">
            <div className="flex flex-wrap gap-1.5 pt-1" dir={l === 'ar' ? 'rtl' : 'ltr'}>
              {titleWords(title[l], highlight[l]).map((w, i) => (
                <button
                  key={`${w.raw}-${i}`}
                  type="button"
                  aria-pressed={w.highlighted}
                  onClick={() => onChange({ title, highlight: { ...highlight, [l]: toggleWord(highlight[l], w.raw) } })}
                  className={cn(
                    'rounded-md border px-2 py-0.5 text-xs transition-colors',
                    w.highlighted
                      ? 'border-transparent bg-primary text-white'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  {w.raw}
                </button>
              ))}
            </div>
            {notice[l] && (
              <p className="text-xs text-muted-foreground" aria-live="polite">
                {notice[l]}
              </p>
            )}
          </div>
        )}
      />
      <TitlePreview title={title} highlight={highlight} />
    </div>
  );
}

export function TitlePreview({ title, highlight }: { title: Dual; highlight: Dual<string[]> }): JSX.Element {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-2 text-[11px] font-semibold text-muted-foreground">كما سيظهر على الموقع</p>
      <div className="grid gap-3 xl:grid-cols-2">
        {LOCALES.map((l) => (
          <p key={l} lang={l} dir={l === 'ar' ? 'rtl' : 'ltr'} className="font-site-display text-[26px] font-bold leading-snug">
            {titleWords(title[l], highlight[l]).map((w, i) => (
              <span key={i} className={cn('inline-block whitespace-pre', w.highlighted && 'text-primary')}>
                {w.raw}{' '}
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}
