import { useMemo, useState } from 'react';
import { History, RotateCcw, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useConfirm } from '@components/ui';
import { describePath, PublishDialog, SCOPE_LABEL } from '@components/site/PublishBar';
import { SitePage } from '@components/site/SitePage';
import { useAuthStore } from '@/store/useAuthStore';
import { useSiteContentStore, useUnpublished } from '@/store/useSiteContentStore';
import { useUIStore } from '@/store/useUIStore';
import { diff } from '@/utils/siteContent';

/**
 * النشر والإصدارات (CMS-PROMPT §7.22): كل نشرة بنطاقها وناشرها وملاحظتها،
 * مع مقارنة أيّ إصدار بالمنشور و«استعادة هذه النسخة» — الاستعادة تُنشئ نشرة
 * جديدة بمحتوى قديم، لا تحذف التاريخ.
 */
export default function SitePublications(): JSX.Element {
  const history = useSiteContentStore((s) => s.history);
  const published = useSiteContentStore((s) => s.published);
  const contentAt = useSiteContentStore((s) => s.contentAt);
  const restore = useSiteContentStore((s) => s.restore);
  const resetToSite = useSiteContentStore((s) => s.resetToSite);
  const user = useAuthStore((s) => s.user);
  const showToast = useUIStore((s) => s.showToast);
  const { confirm } = useConfirm();
  const unpublished = useUnpublished();
  const [compare, setCompare] = useState<number | null>(null);
  const [publishing, setPublishing] = useState(false);

  const rows = useMemo(() => (compare === null ? [] : diff(contentAt(compare), published)), [compare, contentAt, published]);

  return (
    <SitePage
      title="النشر والإصدارات"
      lede="سجلّ كل ما نُشر على الموقع، والمقارنة، والاستعادة."
      actions={
        <Button disabled={unpublished === 0} onClick={() => setPublishing(true)}>
          <Rocket className="h-4 w-4 me-1" /> نشر كل التغييرات ({unpublished})
        </Button>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card className="p-0 overflow-hidden">
          {history.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">لا نشرات بعد. المنشور الآن هو محتوى الموقع الأصلي (الإصدار 0).</p>
          ) : (
            <ul>
              {history.map((p, i) => (
                <li key={p.version} className="flex flex-wrap items-start gap-3 border-b border-border p-4 last:border-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{p.version}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{p.note || 'بلا ملاحظة'} {i === 0 && <span className="ms-1 rounded bg-success/10 px-1.5 py-0.5 text-[10px] text-success">على الموقع</span>}</p>
                    <p className="text-xs text-muted-foreground">{p.by} · {new Date(p.at).toLocaleString('ar', { dateStyle: 'medium', timeStyle: 'short' })} · {p.changes} تغيير</p>
                    <p className="mt-1 flex flex-wrap gap-1">{p.scopes.map((s) => <span key={s} className="rounded bg-muted px-1.5 py-0.5 text-[10px]">{SCOPE_LABEL[s]}</span>)}</p>
                  </div>
                  <div className="flex gap-1">
                    {i > 0 && <Button variant="outline" size="sm" onClick={() => setCompare(p.version)}>مقارنة</Button>}
                    {i > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          if (await confirm({ title: `استعادة الإصدار ${p.version}؟`, message: 'تُنشأ نشرة جديدة بمحتواه، ويبقى التاريخ كما هو.', variant: 'warning', confirmText: 'استعادة' })) {
                            const r = restore(p.version, user?.name ?? 'مدير');
                            showToast(`نُشر الإصدار ${r.version} بمحتوى الإصدار ${p.version}`, 'success');
                          }
                        }}
                      >
                        <RotateCcw className="h-3.5 w-3.5 me-1" /> استعادة
                      </Button>
                    )}
                  </div>
                </li>
              ))}
              <li className="flex items-center gap-3 p-4 text-sm text-muted-foreground">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-bold">0</span>
                محتوى الموقع الأصلي
                <Button variant="outline" size="sm" className="ms-auto" onClick={() => setCompare(0)}>مقارنة</Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (await confirm({ title: 'استعادة محتوى الموقع الأصلي؟', message: 'تُنشأ نشرة جديدة بالمحتوى الأصلي، ويبقى التاريخ كما هو.', variant: 'warning', confirmText: 'استعادة' })) {
                      const r = restore(0, user?.name ?? 'مدير');
                      showToast(`نُشر الإصدار ${r.version} بالمحتوى الأصلي`, 'success');
                    }
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5 me-1" /> استعادة
                </Button>
              </li>
            </ul>
          )}
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="flex items-center gap-2 font-semibold"><History className="h-4 w-4" /> {compare === null ? 'المقارنة' : `الإصدار ${compare} ← المنشور الآن`}</h3>
          {compare === null ? (
            <p className="text-sm text-muted-foreground">اختر «مقارنة» على أي إصدار لترى ما تغيّر بينه وبين المنشور الآن.</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا فرق.</p>
          ) : (
            <div className="max-h-[60vh] space-y-2 overflow-y-auto">
              {rows.map((row) => (
                <div key={row.path} className="overflow-hidden rounded-lg border border-border text-xs">
                  <p className="border-b border-border bg-muted px-3 py-1.5 font-semibold">{describePath(row.path, published)}</p>
                  {Object.entries(row.changes).map(([lang, c]) => (
                    <div key={lang} className="grid sm:grid-cols-2">
                      <p dir={lang === 'en' ? 'ltr' : 'rtl'} className="bg-destructive/5 px-3 py-1.5 text-destructive line-through decoration-destructive/30">{c!.before || '—'}</p>
                      <p dir={lang === 'en' ? 'ltr' : 'rtl'} className="bg-success/5 px-3 py-1.5 text-success">{c!.after || '—'}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-4 flex flex-wrap items-center gap-3">
        <p className="flex-1 text-sm text-muted-foreground">
          «تحديث نسخة محركات البحث» يعيد بناء الموقع لتطابق نصوصه المخبوزة آخر نشرة — يعمل بعد ربط الموقع بالـAPI.
        </p>
        <Button variant="outline" disabled>تحديث نسخة محركات البحث</Button>
        <Button
          variant="ghost"
          className="text-destructive"
          onClick={async () => {
            if (await confirm({ title: 'إرجاع المحتوى الأصلي للموقع؟', message: 'تُحذف كل التعديلات والنشرات والملفات المرفوعة في هذا الديمو.', variant: 'danger', confirmText: 'إرجاع' })) {
              resetToSite();
              showToast('عاد المحتوى الأصلي', 'success');
            }
          }}
        >
          إرجاع الديمو للأصل
        </Button>
      </Card>

      {publishing && <PublishDialog onClose={() => setPublishing(false)} />}
    </SitePage>
  );
}
