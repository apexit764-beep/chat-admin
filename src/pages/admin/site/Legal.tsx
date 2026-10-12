import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ExternalLink, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DualField } from '@components/site/DualField';
import { ListEditor } from '@components/site/ListEditor';
import { SitePage } from '@components/site/SitePage';
import { TranslationBadges } from '@components/site/TranslationBadges';
import { useAuthStore } from '@/store/useAuthStore';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import type { LegalDoc } from '@/types/siteContent';
import { cn } from '@/lib/utils';
import { SITE_URL } from './Features';

const DOC_LABEL: Record<string, string> = { privacy: 'سياسة الخصوصية', terms: 'الشروط والأحكام', sla: 'اتفاقية مستوى الخدمة' };

const formatDate = (d: Date, l: 'ar' | 'en'): string => d.toLocaleDateString(l === 'ar' ? 'ar-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/**
 * الصفحات القانونية (CMS-PROMPT §7.10): ثلاثة مستندات مقفلة. لكل واحد شارة
 * «مسوّدة تحريرية — تحتاج مراجعة قانونية» حتى يعتمده مدير، وسجلّ نسخه من
 * سجلّ النشر.
 */
export default function SiteLegal(): JSX.Element {
  const legal = useSiteContentStore((s) => s.draft.legal);
  const history = useSiteContentStore((s) => s.history);
  const set = useSiteContentStore((s) => s.set);
  const approveLegal = useSiteContentStore((s) => s.approveLegal);
  const user = useAuthStore((s) => s.user);
  const docs = Object.keys(legal);
  const [docKey, setDocKey] = useState(docs[0]);
  const doc = legal[docKey];
  const update = (patch: Partial<LegalDoc>): void => set('legal', { ...legal, [docKey]: { ...doc, ...patch } });
  const versions = history.filter((p) => p.scopes.includes('legal'));

  return (
    <SitePage
      title="الصفحات القانونية"
      lede="الخصوصية والشروط واتفاقية الخدمة — نفسها على الموقع وفي لوحة العميل. العدد مقفل، والمحتوى يُحرَّر بالكامل."
      scope="legal"
      badges={doc}
      actions={
        <Button variant="outline" asChild>
          <a href={`${SITE_URL}/legal/${docKey}/`} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4 me-1" /> على الموقع
          </a>
        </Button>
      }
    >
      <div className="flex flex-wrap gap-1 border-b border-border">
        {docs.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDocKey(d)}
            className={cn('-mb-px border-b-2 px-3 py-2.5 text-sm font-semibold', d === docKey ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}
          >
            {DOC_LABEL[d] ?? d}
            {!legal[d].approvedAt && <span className="ms-1.5 inline-block h-1.5 w-1.5 rounded-full bg-destructive align-middle" />}
          </button>
        ))}
      </div>

      {doc.approvedAt ? (
        <p className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
          <CheckCircle2 className="h-4 w-4" /> روجع قانونياً — {doc.approvedBy} · {new Date(doc.approvedAt).toLocaleDateString('ar')}
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="font-semibold">مسوّدة تحريرية — تحتاج مراجعة قانونية</span>
          <span className="text-xs">تُضاف الجهة النظامية والسجلّ التجاري والجهة القضائية قبل الاعتماد.</span>
          <Button size="sm" variant="outline" className="ms-auto" onClick={() => approveLegal(docKey, user?.name ?? 'مدير')}>اعتماد المراجعة</Button>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1fr_260px]">
        <Card className="p-5 space-y-5">
          <DualField label="العنوان" value={doc.title} onChange={(title) => update({ title })} limit={50} />
          <div className="space-y-2">
            <DualField label="آخر تحديث" value={doc.updated} onChange={(updated) => update({ updated })} />
            <Button size="sm" variant="ghost" onClick={() => { const d = new Date(); update({ updated: { ar: formatDate(d, 'ar'), en: formatDate(d, 'en') } }); }}>
              تاريخ اليوم بصيغة كل لغة
            </Button>
          </div>
          <DualField label="المقدّمة" type="textarea" value={doc.intro} onChange={(intro) => update({ intro })} />
          <div className="space-y-2">
            <span className="text-sm font-semibold">الأقسام</span>
            <ListEditor
              items={doc.sections}
              onChange={(sections) => update({ sections })}
              addLabel="إضافة قسم"
              createItem={() => ({ h: { ar: '', en: '' }, p: { ar: [''], en: [''] }, list: { ar: [], en: [] } })}
              getTitle={(s) => s.h.ar}
              getMeta={(s) => <TranslationBadges entity={s} />}
              renderItem={(s, upd) => (
                <>
                  <DualField label="عنوان القسم" value={s.h} onChange={(h) => upd({ ...s, h })} />
                  <DualField label="الفقرات" type="list" value={s.p} onChange={(p) => upd({ ...s, p })} hint="فقرة في كل سطر." />
                  <DualField label="قائمة نقطية (اختيارية)" type="list" value={s.list ?? { ar: [], en: [] }} onChange={(list) => upd({ ...s, list })} />
                </>
              )}
            />
          </div>
        </Card>

        <Card className="p-4 h-fit">
          <h3 className="mb-3 flex items-center gap-2 font-semibold"><History className="h-4 w-4" /> سجلّ الإصدارات</h3>
          {versions.length === 0 ? (
            <p className="text-xs text-muted-foreground">لا نسخ منشورة بعد التعديل. النسخة على الموقع هي الأصل.</p>
          ) : (
            <ul className="space-y-2 text-xs">
              {versions.map((v) => (
                <li key={v.version}>
                  <p className="font-semibold">الإصدار {v.version}</p>
                  <p className="text-muted-foreground">{v.by} · {new Date(v.at).toLocaleString('ar', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  {v.note && <p>{v.note}</p>}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-[11px] text-muted-foreground">للمقارنة بين نسختين أو الاستعادة: «النشر والإصدارات».</p>
        </Card>
      </div>
    </SitePage>
  );
}
