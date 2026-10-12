import { useState } from 'react';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AutoFields } from '@components/site/SchemaForm';
import { SitePage } from '@components/site/SitePage';
import { TranslationBadges } from '@components/site/TranslationBadges';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import type { SiteScope, Tree } from '@/types/siteContent';
import { cn } from '@/lib/utils';

/** كل مجموعة: أين تظهر النصوص على الموقع، ووصف لمن لا يعرف المكوّن باسمه */
const GROUPS: { scope: SiteScope; key: string; label: string; where: string }[] = [
  { scope: 'ui', key: 'contact', label: 'صفحة ونموذج التواصل', where: 'صفحة «تواصل معنا»: رأسها، وبطاقات التواصل، والنموذج ومواضيعه وأسئلتها الموجّهة ورسائل الحالة.' },
  { scope: 'ui', key: 'widget', label: 'ويدجت المساعد', where: 'زرّ المساعد في كل صفحة: الترحيب، الاقتراحات، نموذج ترك البيانات، وأجوبة بنك النوايا (المفاتيح مقفلة).' },
  { scope: 'ui', key: 'legal', label: 'إطار الصفحات القانونية', where: 'الفهرس وروابط المستندات الأخرى وصندوق «سؤال؟» أسفل كل مستند.' },
  { scope: 'ui', key: 'featuresTabs', label: 'إطار صفحات المزايا', where: 'التبويبات، وعناوين سكشن الأسئلة والعرض الحيّ في كل صفحة ميزة.' },
  { scope: 'ui', key: 'videoDialog', label: 'نافذة الفيديو', where: 'نافذة تشغيل فيديو الديمو.' },
  { scope: 'ui', key: 'themeToggle', label: 'زرّ الثيم', where: 'التلميح على زرّ الوضع الفاتح/الداكن.' },
  { scope: 'ui', key: 'phoneField', label: 'حقل الجوال', where: 'اختيار الدولة ورسالة الرقم غير الصحيح في كل النماذج.' },
  { scope: 'ui', key: 'countries', label: 'أسماء الدول', where: 'قائمة مفاتيح الدول في حقل الجوال.' },
  { scope: 'demos', key: '', label: 'العروض الحيّة في المزايا', where: 'نصوص التجربة التفاعلية داخل كل صفحة ميزة (صندوق الوارد، المساعد، الحملات، التوزيع، التقارير، الويدجت، التكاملات).' },
  { scope: 'scenes', key: '', label: 'نصوص الرسومات المبنية', where: 'الأسماء والرسائل والتسميات داخل الرسومات المتحرّكة — البنية مقفلة.' },
];

/**
 * نصوص الواجهة (CMS-PROMPT §7.18): النصوص القصيرة المبعثرة في المكوّنات،
 * مجمّعة حسب المكوّن، ولكل مجموعة وصف لمكان ظهورها.
 */
export default function SiteUiStrings(): JSX.Element {
  const draft = useSiteContentStore((s) => s.draft);
  const set = useSiteContentStore((s) => s.set);
  const [sel, setSel] = useState(0);
  const [q, setQ] = useState('');
  const g = GROUPS[sel];
  const scopeValue = draft[g.scope] as Tree;
  const value = g.key ? scopeValue[g.key] : scopeValue;
  const update = (v: unknown): void => set(g.scope, (g.key ? { ...scopeValue, [g.key]: v } : v) as never);

  const visible = GROUPS.map((x, i) => ({ x, i })).filter(({ x }) => !q || `${x.label} ${x.where} ${JSON.stringify(x.key ? (draft[x.scope] as Tree)[x.key] : draft[x.scope])}`.includes(q));

  return (
    <SitePage title="نصوص الواجهة" lede="الأزرار والتسميات ورسائل الحالة في مكوّنات الموقع، مجمّعة حسب مكان ظهورها." scope={g.scope}>
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit p-3 space-y-2">
          <div className="relative">
            <Search className="pointer-events-none absolute start-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث في النصوص…" className="h-9 ps-8" />
          </div>
          {visible.map(({ x, i }) => (
            <button key={x.label} type="button" onClick={() => setSel(i)} className={cn('flex w-full items-center gap-2 rounded-lg px-2 py-2 text-start text-sm', i === sel ? 'bg-primary/10 font-semibold' : 'hover:bg-muted')}>
              <span className="flex-1">{x.label}</span>
              <TranslationBadges entity={x.key ? (draft[x.scope] as Tree)[x.key] : draft[x.scope]} />
            </button>
          ))}
        </Card>
        <Card className="p-5 space-y-4">
          <div>
            <h3 className="font-semibold">{g.label}</h3>
            <p className="text-xs text-muted-foreground">{g.where}</p>
          </div>
          <AutoFields value={value} onChange={update} />
        </Card>
      </div>
    </SitePage>
  );
}
