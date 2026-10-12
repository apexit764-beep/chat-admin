import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useConfirm } from '@components/ui';
import { DualField } from '@components/site/DualField';
import { IconPicker, IconView } from '@components/site/IconPicker';
import { type Field, SchemaForm } from '@components/site/SchemaForm';
import { SitePage } from '@components/site/SitePage';
import { TranslationBadges } from '@components/site/TranslationBadges';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import type { Dual, IconRef, Tree } from '@/types/siteContent';
import { cn } from '@/lib/utils';

interface Item { q: Dual; a: Dual }
interface Group { id: string; title: Dual; icon: IconRef; items: Item[] }

const PAGE_FIELDS: Field[] = [
  {
    type: 'group',
    key: 'page',
    label: 'رأس الصفحة',
    fields: [
      { type: 'text', key: 'eyebrow', label: 'الشارة', limit: 40 },
      { type: 'icon', key: 'eyebrowIcon', label: 'أيقونة الشارة' },
      { type: 'title', key: 'title', highlight: 'highlight', label: 'العنوان' },
      { type: 'textarea', key: 'lede', label: 'الوصف' },
    ],
  },
  { type: 'auto', key: 'directory', label: 'نصوص الدليل (فهرس المجموعات وصندوق المساعدة)' },
];

/**
 * الأسئلة الشائعة (CMS-PROMPT §7.5): المجموعات في عمود (ترتيب، أيقونة، عدد
 * الأسئلة)، وأسئلة المجموعة المختارة بجانبها. السؤال يُنقل بين المجموعات
 * من «نقل إلى…». أسئلة المزايا تُحرَّر في صفحاتها وتُضمّ هنا تلقائياً.
 */
export default function SiteFaq(): JSX.Element {
  const faq = useSiteContentStore((s) => s.draft.faq);
  const set = useSiteContentStore((s) => s.set);
  const { confirm } = useConfirm();
  const groups = (faq.groups as Group[]) ?? [];
  const [gi, setGi] = useState(0);
  const [q, setQ] = useState('');
  const [openQ, setOpenQ] = useState<number | null>(null);
  const group = groups[gi];

  const setGroups = (next: Group[]): void => set('faq', { ...faq, groups: next });
  const setGroup = (patch: Partial<Group>): void => setGroups(groups.map((g, i) => (i === gi ? { ...g, ...patch } : g)));
  const moveGroup = (from: number, to: number): void => {
    const next = [...groups];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    setGroups(next);
    setGi(to);
  };

  const shown = useMemo(
    () => (group?.items ?? []).map((item, i) => ({ item, i })).filter(({ item }) => !q || `${item.q.ar} ${item.q.en} ${item.a.ar}`.toLowerCase().includes(q.toLowerCase())),
    [group, q]
  );

  const moveItemTo = (i: number, target: number): void => {
    const item = group.items[i];
    setGroups(groups.map((g, k) => (k === gi ? { ...g, items: g.items.filter((_, j) => j !== i) } : k === target ? { ...g, items: [...g.items, item] } : g)));
    setOpenQ(null);
  };

  return (
    <SitePage title="الأسئلة الشائعة" lede="مجموعات الأسئلة وأسئلتها باللغتين، ونصوص صفحة الأسئلة." scope="faq" badges={groups}>
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        {/* المجموعات */}
        <Card className="p-3 h-fit space-y-1">
          <p className="px-2 pb-1 text-xs font-semibold text-muted-foreground">المجموعات</p>
          {groups.map((g, i) => (
            <div key={g.id} className={cn('flex items-center gap-1 rounded-lg', i === gi && 'bg-primary/10')}>
              <button type="button" onClick={() => { setGi(i); setOpenQ(null); }} className="flex flex-1 items-center gap-2 px-2 py-2 text-start text-sm">
                <IconView value={g.icon} className="h-4 w-4 text-primary" />
                <span className="flex-1 truncate font-medium">{g.title.ar}</span>
                <span className="rounded bg-muted px-1.5 text-[11px] tabular-nums text-muted-foreground">{g.items.length}</span>
              </button>
              <button type="button" aria-label="لأعلى" disabled={i === 0} onClick={() => moveGroup(i, i - 1)} className="h-7 w-6 text-muted-foreground disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
              <button type="button" aria-label="لأسفل" disabled={i === groups.length - 1} onClick={() => moveGroup(i, i + 1)} className="h-7 w-6 text-muted-foreground disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
            </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { setGroups([...groups, { id: `group-${Date.now()}`, title: { ar: 'مجموعة جديدة', en: 'New group' }, icon: { type: 'library', set: 'qhub', name: 'sparkles' }, items: [] }]); setGi(groups.length); }}>
            <Plus className="h-3.5 w-3.5 me-1" /> مجموعة جديدة
          </Button>
        </Card>

        {/* أسئلة المجموعة */}
        {group && (
          <div className="space-y-4">
            <Card className="p-5 space-y-4">
              <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                <DualField label="اسم المجموعة" value={group.title} onChange={(title) => setGroup({ title })} limit={30} />
                <IconPicker value={group.icon} onChange={(icon) => setGroup({ icon })} />
              </div>
              {group.items.length === 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={async () => {
                    if (await confirm({ title: 'حذف المجموعة؟', message: 'المجموعة فارغة.', variant: 'danger', confirmText: 'حذف' })) {
                      setGroups(groups.filter((_, i) => i !== gi));
                      setGi(0);
                    }
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 me-1" /> حذف المجموعة الفارغة
                </Button>
              )}
            </Card>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث في الأسئلة…" className="ps-9" />
              </div>
              <Button onClick={() => { setGroup({ items: [...group.items, { q: { ar: '', en: '' }, a: { ar: '', en: '' } }] }); setOpenQ(group.items.length); }}>
                <Plus className="h-4 w-4 me-1" /> سؤال
              </Button>
            </div>

            <div className="space-y-2">
              {shown.map(({ item, i }) => (
                <Card key={i} className={cn('p-0 overflow-hidden', openQ === i && 'border-primary/40')}>
                  <div className="flex items-center gap-2 px-3">
                    <button type="button" onClick={() => setOpenQ(openQ === i ? null : i)} className="flex-1 py-3 text-start text-sm font-medium">
                      {item.q.ar || <span className="text-muted-foreground">سؤال بلا نص عربي</span>}
                    </button>
                    <TranslationBadges entity={item} />
                    <button type="button" aria-label="لأعلى" disabled={i === 0} onClick={() => { const items = [...group.items]; [items[i - 1], items[i]] = [items[i], items[i - 1]]; setGroup({ items }); }} className="h-8 w-7 text-muted-foreground disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button type="button" aria-label="لأسفل" disabled={i === group.items.length - 1} onClick={() => { const items = [...group.items]; [items[i + 1], items[i]] = [items[i], items[i + 1]]; setGroup({ items }); }} className="h-8 w-7 text-muted-foreground disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                  </div>
                  {openQ === i && (
                    <div className="space-y-4 border-t border-border p-4">
                      <DualField label="السؤال" value={item.q} onChange={(qq) => setGroup({ items: group.items.map((x, j) => (j === i ? { ...x, q: qq } : x)) })} limit={90} />
                      <DualField label="الجواب" type="textarea" value={item.a} onChange={(a) => setGroup({ items: group.items.map((x, j) => (j === i ? { ...x, a } : x)) })} limit={320} />
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-muted-foreground">نقل إلى…</span>
                        <select className="h-9 rounded-md border border-input bg-background px-2" value="" onChange={(e) => e.target.value !== '' && moveItemTo(i, Number(e.target.value))}>
                          <option value="">اختر مجموعة</option>
                          {groups.map((g, k) => k !== gi && <option key={g.id} value={k}>{g.title.ar}</option>)}
                        </select>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ms-auto text-destructive"
                          onClick={async () => {
                            if (await confirm({ title: 'حذف السؤال؟', variant: 'danger', confirmText: 'حذف' })) {
                              setGroup({ items: group.items.filter((_, j) => j !== i) });
                              setOpenQ(null);
                            }
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 me-1" /> حذف
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
              {shown.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">{q ? 'لا أسئلة تطابق البحث.' : 'لا أسئلة في هذه المجموعة بعد.'}</p>}
            </div>
            <p className="text-xs text-muted-foreground">أسئلة كل ميزة تُحرَّر في صفحتها («المزايا» ← تبويب «الأسئلة»)، وتظهر هنا على الموقع ضمن مجموعتها.</p>
          </div>
        )}
      </div>

      <Card className="p-5">
        <SchemaForm fields={PAGE_FIELDS} value={faq} onChange={(v: Tree) => set('faq', v)} />
      </Card>
    </SitePage>
  );
}
