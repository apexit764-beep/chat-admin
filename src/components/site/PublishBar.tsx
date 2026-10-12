import { useMemo, useState } from 'react';
import { Eye, Rocket } from 'lucide-react';
import { useConfirm } from '@components/ui';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { useAuthStore } from '@/store/useAuthStore';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import { useUIStore } from '@/store/useUIStore';
import type { SiteContent, SiteScope } from '@/types/siteContent';
import { diff, labelFor } from '@/utils/siteContent';
import { HOME_SCHEMAS, SECTION_LABEL } from './homeSchemas';
import type { Field } from './SchemaForm';
import { SiteDialog } from './SiteDialog';

/**
 * اسم مقروء لمسار تغيير: «الصفحة الرئيسية › الهيرو › العنوان» بدل
 * `home.sections.0.data.headline` — يأخذ تسميات الحقول من مخطّط السكشن.
 */
export function describePath(path: string, content: SiteContent): string {
  const m = path.match(/^home\.sections\.(\d+)\.(data\.)?([^.]+)(.*)$/);
  if (m) {
    const section = content.home.sections[Number(m[1])];
    const key = section?.key ?? '';
    const field = (HOME_SCHEMAS[key] ?? []).find((f): f is Extract<Field, { key: string; label?: string }> => 'key' in f && f.key === m[3]);
    const rest = m[4] ? labelFor(m[4].slice(1)) : '';
    return [SCOPE_LABEL.home, SECTION_LABEL[key] ?? key, m[2] ? (field && 'label' in field && field.label) || labelFor(m[3]) : labelFor(m[3]), rest].filter(Boolean).join(' › ');
  }
  const featureTitle = (slug: string): string => content.features.cards.find((c) => c.slug === slug)?.title.ar ?? slug;
  return labelFor(path, featureTitle, SCOPE_LABEL);
}

export const SCOPE_LABEL: Record<SiteScope, string> = {
  home: 'الصفحة الرئيسية',
  features: 'المزايا',
  solutions: 'الحلول',
  faq: 'الأسئلة الشائعة',
  testimonials: 'آراء العملاء',
  channels: 'القنوات والشعارات',
  partners: 'الشركاء',
  stats: 'الأرقام',
  legal: 'الصفحات القانونية',
  pricing: 'الأسعار على الموقع',
  site: 'القائمة والروابط',
  seo: 'SEO',
  ui: 'نصوص الواجهة',
  scenes: 'نصوص الرسومات',
  demos: 'نصوص العروض الحيّة',
};

/**
 * شريط المسودّة والنشر (CMS-PROMPT §6.7) — لاصق أسفل الشاشة حين يوجد
 * تغيير لم يُنشر. التعديل يُحفظ مسودّةً تلقائياً ولا يمسّ الموقع؛ «حفظ
 * ونشر» يعرض الفرق سطراً بسطر باللغتين قبل أن يصل للزوّار.
 */
/** قسم واحد أو عدّة أقسام تحرّرها الشاشة معاً (سكشن الآراء + قائمة الآراء مثلاً) */
export type Scopes = SiteScope | SiteScope[];
const asList = (scope?: Scopes): SiteScope[] | undefined => (scope === undefined ? undefined : Array.isArray(scope) ? scope : [scope]);
const pick = (c: SiteContent, only: SiteScope[]): Record<string, unknown> => Object.fromEntries(only.map((s) => [s, c[s]]));
const scopeNames = (only: SiteScope[]): string => only.map((s) => `«${SCOPE_LABEL[s]}»`).join(' و');

export function PublishBar({ scope }: { scope?: Scopes }): JSX.Element | null {
  const draft = useSiteContentStore((s) => s.draft);
  const published = useSiteContentStore((s) => s.published);
  const discard = useSiteContentStore((s) => s.discard);
  const storageFull = useSiteContentStore((s) => s.storageFull);
  const { confirm } = useConfirm();
  const [open, setOpen] = useState(false);

  const only = asList(scope);
  const rows = useMemo(() => (only ? diff(pick(published, only), pick(draft, only)) : diff(published, draft)), [only?.join(), published, draft]);
  if (rows.length === 0 && !storageFull) return null;

  return (
    <>
      <div className="sticky bottom-0 z-20 -mx-4 lg:-mx-6 mt-6 border-t border-border bg-background/95 backdrop-blur px-4 lg:px-6 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="me-auto flex items-center gap-2 text-sm font-semibold">
            <span className="h-2 w-2 rounded-full bg-warning" />
            {rows.length} {rows.length === 1 ? 'تغيير لم يُنشر' : 'تغييرات لم تُنشر'}
            <span className="text-xs font-normal text-muted-foreground">· محفوظة كمسودّة، والموقع لم يتغيّر بعد</span>
          </span>
          {storageFull && <span className="text-xs text-destructive">امتلأت مساحة المتصفّح — احذف صوراً كبيرة مرفوعة</span>}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={async () => {
              const ok = await confirm({
                title: 'تجاهل التغييرات؟',
                message: `يعود ${only ? scopeNames(only) : 'كل المحتوى'} لآخر نسخة منشورة على الموقع.`,
                variant: 'warning',
                confirmText: 'تجاهل',
              });
              if (ok) (only ?? [undefined]).forEach((s) => discard(s));
            }}
          >
            تجاهل
          </Button>
          <Button type="button" variant="outline" size="sm" disabled title="المعاينة تفتح الموقع الحقيقي بالمسودّة — تعمل بعد ربط الموقع بالـAPI">
            <Eye className="h-4 w-4 me-1" /> معاينة
          </Button>
          <Button type="button" size="sm" onClick={() => setOpen(true)}>
            <Rocket className="h-4 w-4 me-1" /> حفظ ونشر
          </Button>
        </div>
      </div>
      {open && <PublishDialog scope={scope} onClose={() => setOpen(false)} />}
    </>
  );
}

export function PublishDialog({ scope, onClose }: { scope?: Scopes; onClose: () => void }): JSX.Element {
  const draft = useSiteContentStore((s) => s.draft);
  const published = useSiteContentStore((s) => s.published);
  const publish = useSiteContentStore((s) => s.publish);
  const user = useAuthStore((s) => s.user);
  const showToast = useUIStore((s) => s.showToast);
  const [note, setNote] = useState('');
  const only = asList(scope);
  const rows = useMemo(() => (only ? diff(pick(published, only), pick(draft, only)) : diff(published, draft)), [only?.join(), published, draft]);

  return (
    <SiteDialog
      open
      onClose={onClose}
      title={only ? `نشر ${scopeNames(only)}` : 'مراجعة قبل النشر'}
      size="xl"
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>إلغاء</Button>
          <Button
            type="button"
            disabled={rows.length === 0}
            onClick={() => {
              const p = publish(note.trim(), user?.name ?? 'مدير', only);
              showToast(`نُشر الإصدار ${p.version} — ${p.changes} تغيير`, 'success');
              onClose();
            }}
          >
            نشر الآن
          </Button>
        </div>
      }
    >
      <p className="mb-3 text-sm text-muted-foreground">هذه التغييرات ستظهر على الموقع فور النشر.</p>
      <div className="max-h-[50vh] space-y-2 overflow-y-auto pe-1">
        {rows.map((row) => (
          <div key={row.path} className="overflow-hidden rounded-lg border border-border">
            <p className="border-b border-border bg-muted px-3 py-1.5 text-xs font-semibold">{describePath(row.path, draft)}</p>
            {Object.entries(row.changes).map(([lang, change]) => (
              <div key={lang} className="grid sm:grid-cols-2 text-xs" lang={lang === 'value' ? undefined : lang}>
                {(['before', 'after'] as const).map((side) => (
                  <div
                    key={side}
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                    className={side === 'before' ? 'bg-destructive/5 px-3 py-2 text-destructive line-through decoration-destructive/30' : 'bg-success/5 px-3 py-2 text-success'}
                  >
                    <span className="me-1.5 text-[10px] font-bold opacity-60">
                      {lang === 'ar' ? 'ع' : lang === 'en' ? 'EN' : ''} {side === 'before' ? 'قبل' : 'بعد'}
                    </span>
                    <span className="whitespace-pre-wrap">{change![side] || <em className="opacity-60">(فارغ)</em>}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <label className="mt-4 block space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">ملاحظة النشر (اختياري)</span>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="مثلاً: تحديث أسئلة صفحة الحملات" />
      </label>
    </SiteDialog>
  );
}
