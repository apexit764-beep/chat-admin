import { ReactNode, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import type { Dual, IconRef, MediaKind, MediaRef, Tree } from '@/types/siteContent';
import { isDual, SEGMENTS } from '@/utils/siteContent';
import { ChannelsPicker } from './ChannelsPicker';
import { DualField, LIMITS } from './DualField';
import { IconPicker } from './IconPicker';
import { ListEditor } from './ListEditor';
import { MediaPicker } from './MediaPicker';
import { TitleField } from './TitleField';
import { TranslationBadges } from './TranslationBadges';

/**
 * مخطّط حقول كتلة محتوى (CMS-PROMPT §7.2: «لكل سكشن مخطّط حقول، واللوحة
 * ترسم النموذج منه»). الحقول غير المذكورة في المخطّط لا تُمسّ — تبقى كما
 * هي في المحتوى، فالبنية التي يحتاجها الموقع لا تضيع.
 */
export type Field =
  | { type: 'text' | 'textarea' | 'list'; key: string; label: string; limit?: number; hint?: string }
  | { type: 'title'; key: string; highlight: string; label: string }
  /** عنوان مخزَّن كلمات منفصلة، تُلوَّن آخر `colored` منها على الموقع */
  | { type: 'words'; key: string; label: string; colored: number }
  | { type: 'icon'; key: string; label?: string; backdrop?: 'light' | 'dark' | 'brand' }
  | { type: 'media'; key: string; label: string; kinds: MediaKind[]; hint?: string }
  | { type: 'channels'; key: string; label: string; locked?: boolean; min?: number; max?: number; hint?: string }
  | { type: 'number'; key: string; label: string; step?: number; hint?: string }
  | { type: 'plain'; key: string; label: string; dir?: 'ltr' | 'rtl'; hint?: string }
  | { type: 'group'; key: string; label: string; fields: Field[] }
  | {
      type: 'items';
      key: string;
      label: string;
      fields: Field[];
      itemTitle: (item: Tree) => ReactNode;
      locked?: boolean;
      fixedOrder?: boolean;
      min?: number;
      max?: number;
      create?: () => Tree;
      addLabel?: string;
    }
  | { type: 'auto'; key: string; label: string }
  | { type: 'custom'; render: (data: Tree, set: (data: Tree) => void) => ReactNode }
  | { type: 'note'; text: ReactNode };

const empty = (): Dual => ({ ar: '', en: '' });

export function SchemaForm({ fields, value, onChange }: { fields: Field[]; value: Tree; onChange: (value: Tree) => void }): JSX.Element {
  const set = (key: string, v: unknown): void => onChange({ ...value, [key]: v });

  return (
    <div className="space-y-5">
      {fields.map((f, i) => {
        switch (f.type) {
          case 'text':
          case 'textarea':
          case 'list':
            return (
              <DualField
                key={f.key}
                label={f.label}
                type={f.type}
                value={(value[f.key] as Dual<never>) ?? (f.type === 'list' ? { ar: [], en: [] } : empty())}
                onChange={(v) => set(f.key, v)}
                limit={f.limit}
                hint={f.hint}
              />
            );
          case 'title':
            return (
              <TitleField
                key={f.key}
                label={f.label}
                title={(value[f.key] as Dual) ?? empty()}
                highlight={(value[f.highlight] as Dual<string[]>) ?? { ar: [], en: [] }}
                onChange={({ title, highlight }) => onChange({ ...value, [f.key]: title, [f.highlight]: highlight })}
              />
            );
          case 'words':
            return <WordsField key={f.key} label={f.label} colored={f.colored} value={(value[f.key] as Dual<string[]>) ?? { ar: [], en: [] }} onChange={(v) => set(f.key, v)} />;
          case 'icon':
            return <IconPicker key={f.key} label={f.label} value={value[f.key] as IconRef} onChange={(v) => set(f.key, v)} backdrop={f.backdrop} />;
          case 'media':
            return <MediaPicker key={f.key} label={f.label} kinds={f.kinds} value={value[f.key] as MediaRef | null} onChange={(v) => set(f.key, v)} hint={f.hint} />;
          case 'channels':
            return (
              <ChannelsPicker
                key={f.key}
                label={f.label}
                value={(value[f.key] as string[]) ?? []}
                onChange={(v) => set(f.key, v)}
                locked={f.locked}
                min={f.min}
                max={f.max}
                hint={f.hint}
              />
            );
          case 'number':
            return (
              <label key={f.key} className="block space-y-1.5">
                <span className="text-sm font-medium">{f.label}</span>
                <Input type="number" dir="ltr" step={f.step ?? 1} className="w-40 tabular-nums" value={String(value[f.key] ?? '')} onChange={(e) => set(f.key, e.target.value === '' ? undefined : Number(e.target.value))} />
                {f.hint && <span className="block text-xs text-muted-foreground">{f.hint}</span>}
              </label>
            );
          case 'plain':
            return (
              <label key={f.key} className="block space-y-1.5">
                <span className="text-sm font-medium">{f.label}</span>
                <Input dir={f.dir ?? 'ltr'} value={String(value[f.key] ?? '')} onChange={(e) => set(f.key, e.target.value)} />
                {f.hint && <span className="block text-xs text-muted-foreground">{f.hint}</span>}
              </label>
            );
          case 'group':
            return (
              <fieldset key={f.key} className="space-y-4 rounded-xl border border-border p-4">
                <legend className="px-1 text-sm font-semibold">{f.label}</legend>
                <SchemaForm fields={f.fields} value={(value[f.key] as Tree) ?? {}} onChange={(v) => set(f.key, v)} />
              </fieldset>
            );
          case 'items':
            return (
              <div key={f.key} className="space-y-2">
                <span className="text-sm font-semibold">{f.label}</span>
                <ListEditor<Tree>
                  items={(value[f.key] as Tree[]) ?? []}
                  onChange={(v) => set(f.key, v)}
                  locked={f.locked}
                  fixedOrder={f.fixedOrder}
                  min={f.min}
                  max={f.max}
                  createItem={f.create}
                  addLabel={f.addLabel}
                  getTitle={f.itemTitle}
                  getMeta={(item) => <TranslationBadges entity={item} />}
                  renderItem={(item, update) => <SchemaForm fields={f.fields} value={item} onChange={update} />}
                />
              </div>
            );
          case 'auto':
            return (
              <fieldset key={f.key} className="space-y-4 rounded-xl border border-border p-4">
                <legend className="px-1 text-sm font-semibold">{f.label}</legend>
                <AutoFields value={value[f.key]} onChange={(v) => set(f.key, v)} />
              </fieldset>
            );
          case 'custom':
            return <div key={`custom-${i}`}>{f.render(value, onChange)}</div>;
          case 'note':
            return (
              <p key={`note-${i}`} className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                {f.text}
              </p>
            );
        }
      })}
    </div>
  );
}

const toWords = (s: string): string[] => s.split(/\s+/).filter(Boolean);

/**
 * عنوان يكتبه المحرّر جملةً واحدة ويُخزَّن كلمات — الموقع يلوّن آخر
 * `colored` كلمات بلون الهوية، والمعاينة تُظهر ذلك وهو يكتب.
 */
function WordsField({ label, value, onChange, colored }: { label: string; value: Dual<string[]>; onChange: (v: Dual<string[]>) => void; colored: number }): JSX.Element {
  const join = (v: Dual<string[]>): Dual => ({ ar: v.ar.join(' '), en: v.en.join(' ') });
  const [text, setText] = useState<Dual>(() => join(value));
  // تغيير من الخارج (تجاهل التعديلات، استعادة) يُعيد بناء النص
  useEffect(() => {
    if (JSON.stringify(toWords(text.ar)) !== JSON.stringify(value.ar) || JSON.stringify(toWords(text.en)) !== JSON.stringify(value.en)) setText(join(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <DualField
      label={label}
      value={text}
      onChange={(next) => {
        setText(next);
        onChange({ ar: toWords(next.ar), en: toWords(next.en) });
      }}
      limit={LIMITS.title}
      hint={`آخر ${colored === 3 ? 'ثلاث' : colored} كلمات تُلوَّن بلون الهوية على الموقع.`}
      below={(l) => {
        const words = toWords(text[l]);
        return words.length ? (
          <p dir={l === 'ar' ? 'rtl' : 'ltr'} className="font-site-display rounded-lg bg-muted/50 px-3 py-2 text-lg leading-snug">
            {words.map((w, i) => (
              <span key={i} className={i >= words.length - colored ? 'text-primary' : undefined}>{w}{i < words.length - 1 ? ' ' : ''}</span>
            ))}
          </p>
        ) : null;
      }}
    />
  );
}

/** تسميات عربية لمفاتيح شائعة — للحقول التي تُرسم تلقائياً */
const LABELS: Record<string, string> = {
  eyebrow: 'الشارة', title: 'العنوان', heading: 'العنوان', lede: 'الوصف', body: 'النص', label: 'التسمية', sub: 'السطر الثاني',
  badge: 'الشارة', name: 'الاسم', namePh: 'تلميح الاسم', email: 'البريد', emailPh: 'تلميح البريد', phone: 'الجوال', phonePh: 'تلميح الجوال',
  company: 'الشركة', companyPh: 'تلميح الشركة', subject: 'الموضوع', message: 'الرسالة', send: 'زرّ الإرسال', sending: 'أثناء الإرسال',
  sentTitle: 'عنوان «تم الإرسال»', sentBody: 'نص «تم الإرسال»', close: 'إغلاق', open: 'فتح', cta: 'الزرّ', q: 'السؤال', a: 'الجواب',
  value: 'القيمة', unit: 'الوحدة', when: 'عندما', then: 'تذهب إلى', text: 'النص', k: 'الحقل', v: 'القيمة', from: 'من', to: 'إلى',
  nav: 'روابط القائمة', bubble: 'فقاعة الترحيب', merge: 'نصّ الدمج', placeholder: 'النص الإرشادي', hint: 'تلميح', note: 'ملاحظة',
  items: 'العناصر', rows: 'الصفوف', steps: 'الخطوات', turns: 'الرسائل', pairs: 'القواعد', subjects: 'المواضيع', ph: 'السؤال الموجّه',
  answers: 'أجوبة المساعد', suggestions: 'الاقتراحات', fallback: 'الردّ حين لا يفهم', copy: 'النصوص', page: 'رأس الصفحة',
  form: 'النموذج', channels: 'القنوات', widget: 'الويدجت', contact: 'صفحة التواصل', status: 'الحالة', hello: 'الترحيب',
};

const label = (key: string): string => LABELS[key] ?? (SEGMENTS[key] || key);

/**
 * حقول تلقائية لكل نصّ قابل للترجمة في كتلة — ما ليس نصّاً (مفاتيح،
 * أرقام، أيقونات، مسارات) بنيةٌ لا تظهر.
 */
export function AutoFields({ value, onChange, path = [] }: { value: unknown; onChange: (v: unknown) => void; path?: string[] }): JSX.Element | null {
  if (isDual(value)) {
    const isList = Array.isArray(value.ar);
    const long = !isList && Math.max(String(value.ar ?? '').length, String(value.en ?? '').length) > 70;
    return (
      <DualField
        compact
        label={path.length ? path.map(label).join(' › ') : 'النص'}
        type={isList ? 'list' : long ? 'textarea' : 'text'}
        value={value as Dual<never>}
        onChange={onChange}
        limit={long ? LIMITS.description * 2 : undefined}
      />
    );
  }
  if (Array.isArray(value)) {
    return (
      <div className="space-y-4">
        {value.map((item, i) => (
          <AutoFields key={i} value={item} path={[...path.slice(0, -1), `${label(path[path.length - 1] ?? '')} ${i + 1}`]} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
        ))}
      </div>
    );
  }
  if (value && typeof value === 'object') {
    const obj = value as Tree;
    if (['library', 'upload', 'media'].includes(String(obj.type))) return null;
    const entries = Object.entries(obj).filter(([, v]) => hasText(v));
    if (!entries.length) return null;
    return (
      <div className="space-y-4">
        {entries.map(([k, v]) => (
          <AutoFields key={k} value={v} path={[...path, k]} onChange={(next) => onChange({ ...obj, [k]: next })} />
        ))}
      </div>
    );
  }
  return null;
}

function hasText(v: unknown): boolean {
  if (isDual(v)) return true;
  if (Array.isArray(v)) return v.some(hasText);
  if (v && typeof v === 'object') return Object.values(v).some(hasText);
  return false;
}
