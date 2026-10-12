import { Card } from '@/components/ui/card';
import { LIMITS } from '@components/site/DualField';
import { type Field, SchemaForm } from '@components/site/SchemaForm';
import { SitePage } from '@components/site/SitePage';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import type { Dual, Tree } from '@/types/siteContent';

const FIELDS: Field[] = [
  {
    type: 'group',
    key: 'page',
    label: 'رأس الصفحة',
    fields: [
      { type: 'text', key: 'eyebrow', label: 'الشارة', limit: 40 },
      { type: 'icon', key: 'eyebrowIcon', label: 'أيقونة الشارة' },
      { type: 'title', key: 'title', highlight: 'highlight', label: 'العنوان' },
      { type: 'textarea', key: 'lede', label: 'الوصف', limit: LIMITS.description },
      { type: 'text', key: 'ctaPrimary', label: 'الزرّ الأساسي', limit: 24 },
      { type: 'text', key: 'ctaSecondary', label: 'الزرّ الثانوي', limit: 24 },
    ],
  },
  {
    type: 'items',
    key: 'items',
    label: 'القطاعات',
    locked: true,
    itemTitle: (s) => (s.sector as Dual)?.ar,
    fields: [
      { type: 'icon', key: 'icon', label: 'الأيقونة' },
      { type: 'note', text: 'الأيقونة تحدّد أيضاً رسمة القطاع المبنية في الموقع.' },
      { type: 'text', key: 'sector', label: 'اسم القطاع', limit: 30 },
      { type: 'textarea', key: 'pain', label: 'الوجع', limit: LIMITS.description },
      { type: 'list', key: 'wins', label: 'المكاسب الأربعة' },
    ],
  },
  {
    type: 'items',
    key: 'faq',
    label: 'أسئلة صفحة الحلول',
    addLabel: 'إضافة سؤال',
    create: () => ({ q: { ar: '', en: '' }, a: { ar: '', en: '' } }),
    itemTitle: (f) => (f.q as Dual)?.ar,
    fields: [
      { type: 'text', key: 'q', label: 'السؤال', limit: 90 },
      { type: 'textarea', key: 'a', label: 'الجواب', limit: 320 },
    ],
  },
];

/** الحلول (CMS-PROMPT §7.4) — القطاعات مقفلة العدد، ولكل قطاع وجعه ومكاسبه */
export default function SiteSolutions(): JSX.Element {
  const value = useSiteContentStore((s) => s.draft.solutions);
  const set = useSiteContentStore((s) => s.set);
  return (
    <SitePage title="الحلول" lede="صفحة الحلول: القطاعات بأيقوناتها، والوجع الذي يحلّه Qhub لكل قطاع، ومكاسبه، وأسئلة الصفحة." scope="solutions" badges={value}>
      <Card className="p-5">
        <SchemaForm fields={FIELDS} value={value} onChange={(v: Tree) => set('solutions', v)} />
      </Card>
    </SitePage>
  );
}
