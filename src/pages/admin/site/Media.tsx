import { useMemo, useState } from 'react';
import { Search, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useConfirm } from '@components/ui';
import { DualField } from '@components/site/DualField';
import { KIND_LABEL } from '@components/site/files';
import { MediaLibraryDialog, MediaThumb } from '@components/site/MediaPicker';
import { SitePage } from '@components/site/SitePage';
import { useMediaLibrary } from '@components/site/useMediaLibrary';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import type { MediaKind, MediaRef } from '@/types/siteContent';
import { cn } from '@/lib/utils';

/**
 * مكتبة الوسائط (CMS-PROMPT §7.19): كل ملف يستعمله الموقع وما رفعه الفريق —
 * بحث، مجلّدات، فلترة بالنوع، وأين يُستخدم كل ملف. **لا يُحذف ملف مستعمل.**
 */
export default function SiteMedia(): JSX.Element {
  const { items, usage } = useMediaLibrary();
  const uploads = useSiteContentStore((s) => s.uploads);
  const removeUpload = useSiteContentStore((s) => s.removeUpload);
  const updateUpload = useSiteContentStore((s) => s.updateUpload);
  const { confirm } = useConfirm();
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<MediaKind | ''>('');
  const [folder, setFolder] = useState('');
  const [sel, setSel] = useState<MediaRef | null>(null);
  const [uploading, setUploading] = useState(false);

  const folders = [...new Set(items.map((m) => m.folder).filter(Boolean))] as string[];
  const shown = useMemo(() => items.filter((m) => (!q || m.name.toLowerCase().includes(q.toLowerCase())) && (!kind || m.kind === kind) && (!folder || m.folder === folder)), [items, q, kind, folder]);
  const current = sel ? items.find((m) => m.url === sel.url) ?? null : null;
  const used = current ? usage.get(current.url) ?? [] : [];
  const isUpload = current ? uploads.some((u) => u.url === current.url) : false;

  return (
    <SitePage title="مكتبة الوسائط" lede="الصور والفيديوهات والأيقونات والشعارات التي يستعملها الموقع." actions={<Button onClick={() => setUploading(true)}><Upload className="h-4 w-4 me-1" /> رفع ملف</Button>}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-48 flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث باسم الملف…" className="ps-9" />
        </div>
        <select value={kind} onChange={(e) => setKind(e.target.value as MediaKind | '')} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">كل الأنواع</option>
          {(Object.keys(KIND_LABEL) as MediaKind[]).map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
        </select>
        <select value={folder} onChange={(e) => setFolder(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">كل المجلّدات</option>
          {folders.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-6 content-start">
          {shown.map((m) => (
            <button key={m.url} type="button" onClick={() => setSel(m)} className={cn('overflow-hidden rounded-xl border bg-card text-start', current?.url === m.url ? 'ring-2 ring-primary' : 'border-border hover:border-primary/50')}>
              <MediaThumb media={m} className="aspect-square w-full" />
              <span dir="ltr" className="block truncate px-2 pt-1 text-[11px]">{m.name}</span>
              <span className="block px-2 pb-1.5 text-[10px] text-muted-foreground">{KIND_LABEL[m.kind]} · {(usage.get(m.url) ?? []).length} استعمال</span>
            </button>
          ))}
          {shown.length === 0 && <p className="col-span-full py-10 text-center text-sm text-muted-foreground">لا ملفات تطابق.</p>}
        </div>

        {current && (
          <Card className="h-fit p-4 space-y-4">
            <MediaThumb media={current} className="aspect-video w-full rounded-lg border border-border" large />
            <div className="text-sm">
              <p dir="ltr" className="truncate font-semibold text-end">{current.name}</p>
              <p className="text-xs text-muted-foreground">
                {KIND_LABEL[current.kind]}
                {current.width && current.height ? ` · ${current.width}×${current.height}` : ''}
                {current.size ? ` · ${Math.round(current.size / 1024)}KB` : ''}
                {current.folder ? ` · ${current.folder}` : ''}
              </p>
            </div>
            {isUpload && current.kind !== 'video' && (
              <DualField compact label="النص البديل" value={current.alt ?? { ar: '', en: '' }} onChange={(alt) => updateUpload(current.url, { alt })} />
            )}
            <div className="space-y-1.5">
              <p className="text-sm font-medium">أين يُستخدم</p>
              {used.length ? (
                <ul className="space-y-1 text-xs">{used.map((u) => <li key={u.path} className="rounded-md bg-muted px-2 py-1">{u.label}</li>)}</ul>
              ) : (
                <p className="text-xs text-muted-foreground">غير مستعمل.</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              disabled={used.length > 0 || !isUpload}
              title={used.length ? 'لا يُحذف ملف مستعمل — أزله من أماكن استعماله أولاً' : !isUpload ? 'ملفات الموقع الأصلية تُستبدل ولا تُحذف' : undefined}
              onClick={async () => {
                if (await confirm({ title: `حذف ${current.name}؟`, variant: 'danger', confirmText: 'حذف' })) {
                  removeUpload(current.url);
                  setSel(null);
                }
              }}
            >
              <Trash2 className="h-3.5 w-3.5 me-1" /> حذف
            </Button>
          </Card>
        )}
      </div>

      {uploading && <MediaLibraryDialog kinds={['image', 'animated', 'icon', 'video']} selected={null} onClose={() => setUploading(false)} onSelect={(m) => { setSel(m); setUploading(false); }} />}
    </SitePage>
  );
}
