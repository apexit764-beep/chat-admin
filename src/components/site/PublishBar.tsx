import { useMemo, useState } from 'react';
import { Rocket } from 'lucide-react';
import { useConfirm } from '@components/ui';
import { SiteDialog } from './SiteDialog';
import { useAuthStore } from '@/store/useAuthStore';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import { useUIStore } from '@/store/useUIStore';
import { diff, labelFor } from '@/utils/siteContent';

/**
 * شريط النشر — لاصق أسفل الشاشة حين توجد تغييرات لم تُنشر.
 *
 * التعديلات تُحفظ تلقائياً مسودّةً ولا تمسّ الموقع. «نشر» يعرض الفرق سطراً
 * بسطر باللغتين قبل أن يصل أي شيء للزوّار.
 */
export function PublishBar({ slug }: { slug?: string }): JSX.Element | null {
  const draft = useSiteContentStore((s) => s.draft);
  const published = useSiteContentStore((s) => s.published);
  const discard = useSiteContentStore((s) => s.discard);
  const storageFull = useSiteContentStore((s) => s.storageFull);
  const { confirm } = useConfirm();
  const [open, setOpen] = useState(false);

  const all = useMemo(() => diff(published, draft), [published, draft]);
  if (all.length === 0 && !storageFull) return null;

  const pageTitle = (s: string): string => draft.cards.find((c) => c.slug === s)?.title.ar ?? s;

  return (
    <>
      <div className="sticky bottom-0 z-20 -mx-4 lg:-mx-6 mt-6 border-t border-border bg-background/95 backdrop-blur px-4 lg:px-6 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="me-auto flex items-center gap-2 text-sm font-semibold">
            <span className="h-2 w-2 rounded-full bg-warning" />
            {all.length} {all.length === 1 ? 'تغيير لم يُنشر' : 'تغييرات لم تُنشر'}
            <span className="font-normal text-xs text-muted-foreground">· محفوظة تلقائياً كمسودّة، والموقع لم يتغيّر بعد</span>
          </span>
          {storageFull && <span className="text-xs text-destructive">امتلأت مساحة المتصفّح — احذف صوراً كبيرة مرفوعة</span>}
          <button
            type="button"
            onClick={async () => {
              const ok = await confirm({
                title: slug ? 'تجاهل تغييرات هذه الصفحة؟' : 'تجاهل كل التغييرات؟',
                message: 'يعود المحتوى لآخر نسخة منشورة على الموقع.',
                variant: 'warning',
                confirmText: 'تجاهل',
              });
              if (ok) discard(slug);
            }}
            className="h-9 px-4 rounded-md text-sm hover:bg-muted"
          >
            {slug ? 'تجاهل تغييرات الصفحة' : 'تجاهل'}
          </button>
          <button type="button" onClick={() => setOpen(true)} className="h-9 px-4 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium flex items-center gap-1.5">
            <Rocket className="h-4 w-4" /> مراجعة ونشر
          </button>
        </div>
      </div>
      {open && <PublishDialog onClose={() => setOpen(false)} pageTitle={pageTitle} />}
    </>
  );
}

function PublishDialog({ onClose, pageTitle }: { onClose: () => void; pageTitle: (slug: string) => string }): JSX.Element {
  const draft = useSiteContentStore((s) => s.draft);
  const published = useSiteContentStore((s) => s.published);
  const publish = useSiteContentStore((s) => s.publish);
  const user = useAuthStore((s) => s.user);
  const showToast = useUIStore((s) => s.showToast);
  const [note, setNote] = useState('');
  const rows = useMemo(() => diff(published, draft), [published, draft]);

  return (
    <SiteDialog
      open
      onClose={onClose}
      title="مراجعة قبل النشر"
      size="xl"
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="h-9 px-4 rounded-md text-sm hover:bg-muted">إلغاء</button>
          <button
            type="button"
            disabled={rows.length === 0}
            onClick={() => {
              const p = publish(note.trim(), user?.name ?? 'مدير');
              showToast(`نُشر الإصدار ${p.version} — ${p.changes} تغيير`, 'success');
              onClose();
            }}
            className="h-9 px-4 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium disabled:opacity-50"
          >
            نشر الآن
          </button>
        </div>
      }
    >
      <p className="mb-3 text-sm text-muted-foreground">هذه التغييرات ستظهر على الموقع فور النشر.</p>
      <div className="max-h-[50vh] space-y-2 overflow-y-auto pe-1">
        {rows.map((row) => (
          <div key={row.path} className="overflow-hidden rounded-lg border border-border">
            <p className="border-b border-border bg-muted px-3 py-1.5 text-xs font-semibold">{labelFor(row.path, pageTitle)}</p>
            {Object.entries(row.changes).map(([lang, change]) => (
              <div key={lang} className="grid sm:grid-cols-2 text-xs" lang={lang === 'value' ? undefined : lang}>
                {(['before', 'after'] as const).map((side) => (
                  <div
                    key={side}
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                    className={side === 'before' ? 'bg-destructive/5 px-3 py-2 text-destructive line-through decoration-destructive/30' : 'bg-success/5 px-3 py-2 text-success'}
                  >
                    <span className="me-1.5 text-[10px] font-bold opacity-60 no-underline">
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
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="مثلاً: تحديث أسئلة صفحة الحملات"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
        />
      </label>
    </SiteDialog>
  );
}
