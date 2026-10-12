import type { Dual, StepArt } from '@/types/siteContent';
import { isDual } from '@/utils/siteContent';
import { DualField } from './DualField';

/** أسماء حقول المشاهد بالعربية — المشهد بنيته مقفلة، نصوصه فقط تُحرَّر */
const FIELD: Record<string, string> = {
  label: 'التسمية',
  sub: 'السطر الثاني',
  badge: 'الشارة',
  initial: 'الحرف',
  value: 'القيمة',
  unit: 'الوحدة',
  when: 'عندما',
  then: 'تذهب إلى',
  text: 'الرسالة',
  title: 'العنوان',
  k: 'الحقل',
  v: 'القيمة',
  from: 'من',
  to: 'إلى',
  nav: 'روابط القائمة',
  bubble: 'فقاعة الترحيب',
  merge: 'نصّ الدمج',
};

const KIND: Record<string, string> = {
  rows: 'قائمة صفوف',
  chat: 'محادثة',
  rules: 'قواعد توزيع',
  fields: 'حقول',
  stats: 'أرقام',
  flow: 'مسار',
  card: 'بطاقة',
  browser: 'متصفّح',
};

const GROUP: Record<string, string> = { items: 'العنصر', turns: 'الرسالة', pairs: 'القاعدة', rows: 'الصفّ' };

/**
 * يرسم حقلاً ثنائياً لكل نصّ داخل رسمة الخطوة — مهما كان نوعها. ما ليس
 * نصّاً (أرقام، مفاتيح قنوات، المرسِل) لا يظهر: هو بنية المشهد.
 */
export function SceneTexts({ art, onChange }: { art: StepArt; onChange: (art: StepArt) => void }): JSX.Element {
  const fields: { path: (string | number)[]; label: string; value: Dual<string | string[]> }[] = [];

  const walk = (node: unknown, path: (string | number)[], label: string[]): void => {
    if (isDual(node)) {
      if (typeof node.ar === 'string' || Array.isArray(node.ar)) fields.push({ path, label: label.join(' › '), value: node as Dual<string | string[]> });
      return;
    }
    if (Array.isArray(node)) {
      const parent = String(path[path.length - 1] ?? '');
      node.forEach((child, i) => walk(child, [...path, i], [...label.slice(0, -1), `${GROUP[parent] ?? FIELD[parent] ?? parent} ${i + 1}`]));
      return;
    }
    if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) if (k !== 'kind') walk(v, [...path, k], [...label, FIELD[k] ?? k]);
    }
  };
  walk(art, [], []);

  const setAt = (path: (string | number)[], value: unknown): StepArt => {
    const clone = structuredClone(art) as Record<string | number, unknown>;
    let node = clone;
    for (const key of path.slice(0, -1)) node = node[key] as Record<string | number, unknown>;
    node[path[path.length - 1]] = value;
    return clone as StepArt;
  };

  return (
    <div className="space-y-3 rounded-xl border border-border p-4">
      <p className="text-xs font-semibold">
        نصوص الرسمة <span className="font-normal text-muted-foreground">· {KIND[art.kind] ?? art.kind} — البنية مقفلة، النصوص فقط تُحرَّر</span>
      </p>
      {fields.map((f) => (
        <DualField
          key={f.path.join('.')}
          compact
          label={f.label}
          type={Array.isArray(f.value.ar) ? 'list' : 'text'}
          value={f.value as Dual<string>}
          onChange={(next) => onChange(setAt(f.path, next))}
        />
      ))}
    </div>
  );
}
