import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { DualField } from '@components/site/DualField';
import { SitePage } from '@components/site/SitePage';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import type { Dual, Locale, Tree } from '@/types/siteContent';
import { cn } from '@/lib/utils';

interface Meta { title: Dual; description: Dual; og?: Dual; keywords?: Dual<string[]> }

const PAGE_LABEL: Record<string, string> = { pricing: 'الأسعار', features: 'المزايا', contact: 'التواصل', faq: 'الأسئلة الشائعة', solutions: 'الحلول' };
const LIMIT = { title: 60, description: 155 };

/**
 * SEO (CMS-PROMPT §7.17): عنوان ووصف كل صفحة ولغة، الكلمات المفتاحية، ومعاينة
 * نتيجة البحث كما يعرضها جوجل. صفحات المزايا والقانوني تأخذ عنوانها ووصفها
 * من محتواها (الشارة والوصف) — تُعرض هنا للمراجعة.
 */
export default function SiteSeo(): JSX.Element {
  const seo = useSiteContentStore((s) => s.draft.seo);
  const features = useSiteContentStore((s) => s.draft.features);
  const legal = useSiteContentStore((s) => s.draft.legal);
  const set = useSiteContentStore((s) => s.set);
  const pages = (seo.pages as Record<string, Meta>) ?? {};
  const root = seo.root as Meta;

  const rows: { key: string; label: string; path: string; meta: Meta; editable: boolean }[] = [
    { key: 'root', label: 'الرئيسية (والافتراضي)', path: '/', meta: root, editable: true },
    ...Object.entries(pages).map(([k, m]) => ({ key: k, label: PAGE_LABEL[k] ?? k, path: `/${k}`, meta: m, editable: true })),
    ...features.cards.map((c) => ({ key: `f-${c.slug}`, label: `ميزة: ${c.title.ar}`, path: `/features/${c.slug}`, meta: { title: features.pages[c.slug].eyebrow, description: features.pages[c.slug].lede }, editable: false })),
    ...Object.entries(legal).map(([k, d]) => ({ key: `l-${k}`, label: d.title.ar, path: `/legal/${k}`, meta: { title: d.title, description: d.intro }, editable: false })),
  ];
  const [sel, setSel] = useState('root');
  const row = rows.find((r) => r.key === sel) ?? rows[0];
  const update = (patch: Partial<Meta>): void => {
    if (row.key === 'root') set('seo', { ...seo, root: { ...root, ...patch } } as Tree);
    else set('seo', { ...seo, pages: { ...pages, [row.key]: { ...pages[row.key], ...patch } } } as Tree);
  };

  return (
    <SitePage title="SEO" lede="عنوان ووصف كل صفحة في نتائج البحث، باللغتين." scope="seo">
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card className="overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted text-xs">
                <th className="p-2.5 text-start">الصفحة</th>
                <th className="p-2.5 text-center">العنوان</th>
                <th className="p-2.5 text-center">الوصف</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} onClick={() => setSel(r.key)} className={cn('cursor-pointer border-b border-border hover:bg-muted/50', sel === r.key && 'bg-primary/5')}>
                  <td className="p-2.5">
                    <p className="font-medium">{r.label}</p>
                    <code dir="ltr" className="text-[11px] text-muted-foreground">{r.path}</code>
                  </td>
                  <td className="p-2.5 text-center"><Len n={r.meta.title.ar.length} max={LIMIT.title} /></td>
                  <td className="p-2.5 text-center"><Len n={r.meta.description.ar.length} max={LIMIT.description} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="space-y-5">
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold">{row.label}</h3>
            {row.editable ? (
              <>
                <DualField label="العنوان" value={row.meta.title} onChange={(title) => update({ title })} limit={LIMIT.title} />
                <DualField label="الوصف" type="textarea" value={row.meta.description} onChange={(description) => update({ description })} limit={LIMIT.description} />
                {row.meta.og && <DualField label="نصّ المشاركة (OG)" type="textarea" value={row.meta.og} onChange={(og) => update({ og })} />}
                {row.meta.keywords && <DualField label="الكلمات المفتاحية" type="list" value={row.meta.keywords} onChange={(keywords) => update({ keywords })} />}
              </>
            ) : (
              <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">عنوان هذه الصفحة ووصفها من محتواها نفسه (الشارة والوصف) — يُعدَّلان من شاشتها.</p>
            )}
          </Card>
          {(['ar', 'en'] as Locale[]).map((l) => <GooglePreview key={l} locale={l} path={row.path} meta={row.meta} />)}
        </div>
      </div>
    </SitePage>
  );
}

function Len({ n, max }: { n: number; max: number }): JSX.Element {
  return <span dir="ltr" className={cn('tabular-nums text-xs', n > max ? 'font-semibold text-warning' : n < max / 3 ? 'text-warning' : 'text-success')}>{n}/{max}</span>;
}

/** معاينة نتيجة البحث بالشكل الذي يعرضه جوجل — مع القصّ عند الحدود */
function GooglePreview({ locale, path, meta }: { locale: Locale; path: string; meta: Meta }): JSX.Element {
  const cut = (s: string, n: number): string => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
  const title = locale === 'ar' && path !== '/' ? `${meta.title.ar} | Qhub` : meta.title[locale];
  return (
    <Card className="p-4" dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
      <p className="mb-1 text-[11px] text-muted-foreground">معاينة جوجل · {locale === 'ar' ? 'العربية' : 'English'}</p>
      <p dir="ltr" className="text-xs text-[#4d5156] dark:text-muted-foreground text-start">qhub.sa{locale === 'en' ? '/en' : ''}{path === '/' ? '' : path}</p>
      <p className="text-lg leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">{cut(title, LIMIT.title)}</p>
      <p className="text-sm text-[#4d5156] dark:text-muted-foreground">{cut(meta.description[locale], LIMIT.description)}</p>
    </Card>
  );
}
