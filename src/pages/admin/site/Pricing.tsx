import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Check, ExternalLink, Minus, Plus, Star, Trash2, Type, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DualField } from '@components/site/DualField';
import { type Field, SchemaForm } from '@components/site/SchemaForm';
import { SitePage } from '@components/site/SitePage';
import { useAdminStore } from '@/store/useAdminStore';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import type { Dual, Tree } from '@/types/siteContent';
import { cn } from '@/lib/utils';
import { SITE_URL } from './Features';

type Cell = boolean | Dual;
/** القيم مخزّنة كما يقرؤها الموقع: قائمة لكل لغة `{ar: [..4], en: [..4]}` */
interface Row { label: Dual; values: Dual<(string | boolean)[]> }

const toCells = (v: Row['values']): Cell[] => v.ar.map((a, i) => (typeof a === 'boolean' ? a : { ar: a, en: String(v.en[i] ?? '') }));
const fromCells = (cells: Cell[]): Row['values'] => ({
  ar: cells.map((c) => (typeof c === 'boolean' ? c : c.ar)),
  en: cells.map((c) => (typeof c === 'boolean' ? c : c.en)),
});
interface Group { title: Dual; rows: Row[] }
interface SitePlan { id: string; name: Dual; tagline: Dual; reach: Dual; perks: Dual<string[]>; featured?: boolean; contactOnly?: boolean }

const TABS = [
  { key: 'plans', label: 'الباقات على الموقع' },
  { key: 'compare', label: 'جدول المقارنة' },
  { key: 'texts', label: 'نصوص الصفحة' },
] as const;

const TEXT_FIELDS: Field[] = [
  {
    type: 'group',
    key: 'page',
    label: 'رأس صفحة الأسعار',
    fields: [
      { type: 'text', key: 'eyebrow', label: 'الشارة', limit: 40 },
      { type: 'icon', key: 'eyebrowIcon', label: 'أيقونة الشارة' },
      { type: 'title', key: 'title', highlight: 'highlight', label: 'العنوان' },
      { type: 'textarea', key: 'lede', label: 'الوصف' },
    ],
  },
  { type: 'auto', key: 'table', label: 'نصوص الجدول والبطاقات' },
  { type: 'auto', key: 'slider', label: 'سلايدر «أي باقة تناسبك»' },
  { type: 'auto', key: 'enterprise', label: 'نافذة باقة المؤسسات' },
];

/**
 * التسعير على الموقع (CMS-PROMPT §7.11–7.13). **الأسعار والدول من «الباقات»
 * في اللوحة نفسها** — مصدر واحد، فلا يعرض الموقع سعراً غير ما يدفعه العميل.
 * هنا ما يخصّ الموقع فقط: نصوص البطاقات التسويقية، وجدول المقارنة.
 */
export default function SitePricing(): JSX.Element {
  const pricing = useSiteContentStore((s) => s.draft.pricing);
  const set = useSiteContentStore((s) => s.set);
  const adminPlans = useAdminStore((s) => s.plans);
  const countries = useAdminStore((s) => s.countries);
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('plans');
  const [country, setCountry] = useState(countries[0]?.code ?? 'OM');

  const plans = (pricing.plans as SitePlan[]) ?? [];
  const groups = (pricing.comparison as Group[]) ?? [];
  const setPlans = (next: SitePlan[]): void => set('pricing', { ...pricing, plans: next });
  const setGroups = (next: Group[]): void => set('pricing', { ...pricing, comparison: next });
  const adminFor = (tier: string) => adminPlans.find((p) => p.tier === tier && !p.adminOnly);
  const co = countries.find((c) => c.code === country);

  return (
    <SitePage
      title="العرض على الموقع"
      lede="الأسعار والحدود هي نفسها في «الباقات»؛ هنا أسماء الباقات وأوصافها كما تظهر للزوّار، وجدول المقارنة، ونصوص صفحة الأسعار."
      scope="pricing"
      badges={pricing}
      actions={
        <>
          <Button variant="outline" asChild><a href={`${SITE_URL}/pricing/`} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4 me-1" /> على الموقع</a></Button>
        </>
      }
    >
      <div className="flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} className={cn('-mb-px border-b-2 px-3 py-2.5 text-sm font-semibold', tab === t.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'plans' && (
        <>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">معاينة الأسعار في:</span>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-sm">
              {countries.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.nameAr}</option>)}
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {plans.map((p, i) => {
              const admin = adminFor(p.id);
              const price = admin?.pricesPerCountry[country];
              const update = (patch: Partial<SitePlan>): void => setPlans(plans.map((x, j) => (j === i ? { ...x, ...patch } : x)));
              return (
                <Card key={p.id} className={cn('p-4 space-y-4', p.featured && 'ring-2 ring-primary')}>
                  <div className="flex items-center justify-between">
                    <code dir="ltr" className="text-xs text-muted-foreground">{p.id}</code>
                    <button type="button" onClick={() => setPlans(plans.map((x, j) => ({ ...x, featured: j === i ? !x.featured : false })))} className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold', p.featured ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                      <Star className="h-3 w-3" /> الأكثر طلباً
                    </button>
                  </div>
                  {/* من «الباقات» — للقراءة */}
                  <div className="rounded-lg bg-muted p-3 text-sm">
                    {admin ? (
                      <>
                        <p className="font-semibold">{admin.nameAr} · {admin.name}</p>
                        <p className="tabular-nums text-muted-foreground">
                          {p.contactOnly || admin.requiresContact ? 'بالتواصل — السعر لا يُعرض' : price ? `${price.monthly} ${co?.symbol} / شهر · ${price.yearly} ${co?.symbol} / سنة` : 'لا سعر لهذه الدولة'}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          موظفون {admin.limits.agents < 0 ? '∞' : admin.limits.agents} · قنوات {admin.limits.channels < 0 ? '∞' : admin.limits.channels} · محادثات {admin.limits.conversations < 0 ? '∞' : admin.limits.conversations.toLocaleString('en')}
                        </p>
                      </>
                    ) : (
                      <p className="flex items-center gap-1 text-warning"><AlertTriangle className="h-4 w-4" /> لا باقة بهذه الفئة في «الباقات»</p>
                    )}
                  </div>
                  <DualField compact label="الاسم على الموقع" value={p.name} onChange={(name) => update({ name })} limit={20} />
                  <DualField compact label="الوصف" value={p.tagline} onChange={(tagline) => update({ tagline })} limit={60} />
                  <DualField compact label="السقف (يظهر في فقاعة السلايدر)" value={p.reach} onChange={(reach) => update({ reach: { ...reach, ar: fixLrm(reach.ar) } })} />
                  <DualField compact label="أبرز 4 مزايا" type="list" value={p.perks} onChange={(perks) => update({ perks })} />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!p.contactOnly} onChange={(e) => update({ contactOnly: e.target.checked || undefined })} className="accent-primary" />
                    بالتواصل فقط — يخفي السعر ويحوّل الزرّ لنافذة المؤسسات
                  </label>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {tab === 'compare' && <CompareGrid groups={groups} plans={plans} onChange={setGroups} />}

      {tab === 'texts' && (
        <Card className="p-5">
          <SchemaForm fields={TEXT_FIELDS} value={pricing} onChange={(v: Tree) => set('pricing', v)} />
        </Card>
      )}
    </SitePage>
  );
}

/**
 * «+10,000» في سياق عربي يعرضها المتصفّح «10,000+» معكوسة — علامة LRM قبل
 * «+» تُضاف تلقائياً (§7.11).
 */
function fixLrm(text: string): string {
  return text.replace(/(^|[^‎])\+(?=\d)/g, '$1‎+');
}

/** جدول المقارنة (§7.13): مجموعات قابلة للطيّ، صفوف، و4 أعمدة — كل خلية ✓ / ✗ / نص */
function CompareGrid({ groups, plans, onChange }: { groups: Group[]; plans: SitePlan[]; onChange: (g: Group[]) => void }): JSX.Element {
  const [closed, setClosed] = useState<Set<number>>(new Set());
  const [editing, setEditing] = useState<string | null>(null);
  const setRow = (gi: number, ri: number, patch: Partial<Row>): void =>
    onChange(groups.map((g, i) => (i === gi ? { ...g, rows: g.rows.map((r, j) => (j === ri ? { ...r, ...patch } : r)) } : g)));

  const cycle = (c: Cell): Cell => (c === true ? false : c === false ? { ar: '', en: '' } : true);

  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="p-3 text-start font-semibold">الميزة</th>
            {plans.map((p) => <th key={p.id} className="w-36 p-3 text-center font-semibold">{p.name.ar}</th>)}
            <th className="w-10" />
          </tr>
        </thead>
        {groups.map((g, gi) => (
          <tbody key={gi}>
            <tr className="border-b border-border bg-primary/5">
              <td colSpan={plans.length + 2} className="p-2">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setClosed((s) => { const n = new Set(s); n.has(gi) ? n.delete(gi) : n.add(gi); return n; })} className="text-muted-foreground">
                    {closed.has(gi) ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                  </button>
                  <Input value={g.title.ar} onChange={(e) => onChange(groups.map((x, i) => (i === gi ? { ...x, title: { ...x.title, ar: e.target.value } } : x)))} className="h-8 max-w-56 font-semibold" />
                  <Input dir="ltr" value={g.title.en} onChange={(e) => onChange(groups.map((x, i) => (i === gi ? { ...x, title: { ...x.title, en: e.target.value } } : x)))} className="h-8 max-w-56" />
                  <span className="text-xs text-muted-foreground">{g.rows.length} صفوف</span>
                </div>
              </td>
            </tr>
            {!closed.has(gi) && g.rows.map((r, ri) => (
              <tr key={ri} className="border-b border-border align-top">
                <td className="p-2">
                  <div className="space-y-1">
                    <Input value={r.label.ar} onChange={(e) => setRow(gi, ri, { label: { ...r.label, ar: e.target.value } })} className="h-8" />
                    <Input dir="ltr" value={r.label.en} onChange={(e) => setRow(gi, ri, { label: { ...r.label, en: e.target.value } })} className="h-8 text-xs" />
                  </div>
                </td>
                {toCells(r.values).map((c, ci, cells) => {
                  const id = `${gi}-${ri}-${ci}`;
                  return (
                    <td key={ci} className="p-2 text-center">
                      {typeof c === 'boolean' ? (
                        <button type="button" onClick={() => setRow(gi, ri, { values: fromCells(cells.map((x, k) => (k === ci ? cycle(x) : x))) })} title="بدّل: ✓ ← ✗ ← نص" className={cn('mx-auto flex h-8 w-8 items-center justify-center rounded-md', c ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground')}>
                          {c ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        </button>
                      ) : editing === id ? (
                        <div className="space-y-1">
                          <Input autoFocus value={c.ar} onChange={(e) => setRow(gi, ri, { values: fromCells(cells.map((x, k) => (k === ci ? { ...(x as Dual), ar: e.target.value } : x))) })} className="h-8 text-center" />
                          <Input dir="ltr" value={c.en} onChange={(e) => setRow(gi, ri, { values: fromCells(cells.map((x, k) => (k === ci ? { ...(x as Dual), en: e.target.value } : x))) })} onBlur={() => setEditing(null)} className="h-8 text-center text-xs" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button type="button" onClick={() => setEditing(id)} className="min-h-8 rounded-md px-2 py-1 hover:bg-muted">
                            {c.ar || <span className="text-muted-foreground">—</span>}
                            {c.ar && !c.en && <span className="ms-1 text-warning">•</span>}
                          </button>
                          <button type="button" aria-label="تحويل لعلامة" title="تحويل لعلامة ✓/✗" onClick={() => setRow(gi, ri, { values: fromCells(cells.map((x, k) => (k === ci ? true : x))) })} className="text-muted-foreground opacity-50 hover:opacity-100">
                            <Type className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </td>
                  );
                })}
                <td className="p-2">
                  <button type="button" aria-label="حذف الصفّ" onClick={() => onChange(groups.map((x, i) => (i === gi ? { ...x, rows: x.rows.filter((_, j) => j !== ri) } : x)))} className="h-8 w-8 rounded-md text-muted-foreground hover:text-destructive">
                    <Trash2 className="mx-auto h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {!closed.has(gi) && (
              <tr className="border-b border-border">
                <td colSpan={plans.length + 2} className="p-2">
                  <button type="button" onClick={() => onChange(groups.map((x, i) => (i === gi ? { ...x, rows: [...x.rows, { label: { ar: '', en: '' }, values: { ar: plans.map(() => false), en: plans.map(() => false) } }] } : x)))} className="flex items-center gap-1 text-xs text-primary hover:underline">
                    <Plus className="h-3.5 w-3.5" /> صفّ في «{g.title.ar}»
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        ))}
      </table>
      <p className="p-3 text-xs text-muted-foreground">المجموعات وأعمدة الباقات الأربع مقفلة العدد. الصفوف تُضاف وتُحذف. انقر علامة لتبديلها: ✓ ← ✗ ← نص.</p>
    </Card>
  );
}
