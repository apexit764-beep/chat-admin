import { useMemo, useState } from 'react';
import { AlertTriangle, ImageOff, Link2, Play, Search, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/useAuthStore';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import { useUIStore } from '@/store/useUIStore';
import type { Dual, MediaKind, MediaRef } from '@/types/siteContent';
import { cn } from '@/lib/utils';
import { DualField } from './DualField';
import { formatKb, KIND_LABEL, MEDIA_RULES, readMedia } from './files';
import { SiteDialog } from './SiteDialog';
import { useMediaLibrary } from './useMediaLibrary';

/**
 * منتقي الوسائط (CMS-PROMPT §6.4): خانة تعرض الملف المختار، ونافذة على
 * مكتبة الوسائط للاختيار أو الرفع. الفيديو لا يُستعمل بلا صورة غلاف.
 */
export function MediaPicker({
  label,
  value,
  onChange,
  kinds,
  withAlt = true,
  hint,
}: {
  label: string;
  value: MediaRef | null | undefined;
  onChange: (media: MediaRef | null) => void;
  kinds: MediaKind[];
  withAlt?: boolean;
  hint?: string;
}): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">{label}</span>
      {value ? (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-2">
          <MediaThumb media={value} className="h-16 w-16 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1">
            <p dir="ltr" className="truncate text-sm font-medium text-end">{value.name}</p>
            <p className="text-xs text-muted-foreground">
              {KIND_LABEL[value.kind]}
              {value.width && value.height ? ` · ${value.width}×${value.height}` : ''}
              {value.kind === 'video' && !value.poster && <span className="text-warning"> · بلا غلاف</span>}
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>تغيير</Button>
          <button type="button" aria-label="إزالة" title="إزالة" onClick={() => onChange(null)} className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="flex h-20 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary">
          <Upload className="h-4 w-4" /> اختيار من المكتبة أو رفع ملف
        </button>
      )}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {value && withAlt && value.kind !== 'video' && (
        <DualField compact label="النص البديل (alt)" value={value.alt ?? { ar: '', en: '' }} onChange={(alt: Dual) => onChange({ ...value, alt })} hint="يصف الصورة لمن لا يراها ولمحركات البحث." />
      )}
      {open && <MediaLibraryDialog kinds={kinds} selected={value ?? null} onClose={() => setOpen(false)} onSelect={(m) => { onChange(m); setOpen(false); }} />}
    </div>
  );
}

export function MediaLibraryDialog({
  kinds,
  selected,
  onClose,
  onSelect,
}: {
  kinds: MediaKind[];
  selected: MediaRef | null;
  onClose: () => void;
  onSelect: (media: MediaRef) => void;
}): JSX.Element {
  const { items } = useMediaLibrary();
  const addUpload = useSiteContentStore((s) => s.addUpload);
  const user = useAuthStore((s) => s.user);
  const showToast = useUIStore((s) => s.showToast);
  const [q, setQ] = useState('');
  const [folder, setFolder] = useState('');
  const [current, setCurrent] = useState<MediaRef | null>(selected);
  const [videoUrl, setVideoUrl] = useState('');
  const [posterOpen, setPosterOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pool = items.filter((m) => kinds.includes(m.kind));
  const folders = [...new Set(pool.map((m) => m.folder).filter(Boolean))] as string[];
  const shown = useMemo(
    () => pool.filter((m) => (!q || m.name.toLowerCase().includes(q.toLowerCase())) && (!folder || m.folder === folder)),
    [pool, q, folder]
  );

  const upload = async (file: File): Promise<void> => {
    setError(null);
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const kind = kinds.find((k) => MEDIA_RULES[k].types.includes(file.type) && (k !== 'animated' || ext === 'gif' || !kinds.includes('image')));
    if (!kind) return setError(`صيغة الملف غير مقبولة هنا. المقبول: ${kinds.map((k) => MEDIA_RULES[k].ext).join(' · ')}`);
    const res = await readMedia(file, kind);
    if ('error' in res) return setError(res.error);
    const media: MediaRef = { type: 'media', url: res.url, name: res.name, kind, width: res.width, height: res.height, size: res.size, alt: { ar: '', en: '' }, folder: `رفع ${user?.name ?? ''}`.trim() };
    addUpload(media);
    setCurrent(media);
    if (res.warning) showToast(res.warning, 'info');
  };

  const needsPoster = current?.kind === 'video' && !current.poster;
  const accept = kinds.flatMap((k) => MEDIA_RULES[k].types).join(',');

  return (
    <SiteDialog
      open
      onClose={onClose}
      title="مكتبة الوسائط"
      size="xl"
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>إلغاء</Button>
          <Button type="button" disabled={!current || needsPoster} onClick={() => current && onSelect(current)}>استخدام هذا الملف</Button>
        </div>
      }
    >
      <p className="mb-3 text-xs text-muted-foreground">
        {kinds.map((k) => `${KIND_LABEL[k]}: ${MEDIA_RULES[k].ext}${MEDIA_RULES[k].maxKb ? ` ≤ ${formatKb(MEDIA_RULES[k].maxKb)}` : ''}`).join(' · ')}
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative min-w-48 flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث باسم الملف…" className="ps-9" />
        </div>
        {folders.length > 1 && (
          <select value={folder} onChange={(e) => setFolder(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="">كل المجلّدات</option>
            {folders.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        )}
        {kinds.some((k) => k !== 'video') && (
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Upload className="h-4 w-4" /> رفع ملف
            <input type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) upload(f); }} />
          </label>
        )}
      </div>

      {kinds.includes('video') && (
        <div className="mb-3 flex items-center gap-2">
          <Input dir="ltr" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://…/video.mp4" />
          <Button
            type="button"
            variant="outline"
            disabled={!/^https?:\/\/.+\.mp4(\?.*)?$/i.test(videoUrl)}
            onClick={() => {
              const media: MediaRef = { type: 'media', url: videoUrl, name: videoUrl.split('/').pop() ?? 'video.mp4', kind: 'video', poster: null, folder: 'فيديو' };
              addUpload(media);
              setCurrent(media);
              setVideoUrl('');
            }}
          >
            <Link2 className="h-4 w-4 me-1" /> إضافة فيديو برابطه
          </Button>
        </div>
      )}

      {error && (
        <p role="alert" className="mb-3 flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-[1fr_16rem]">
        <div
          className="grid max-h-[45vh] grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4 lg:grid-cols-5 content-start"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) upload(f); }}
        >
          {shown.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
              {q ? 'لا ملفات تطابق البحث.' : 'لا ملفات من هذا النوع بعد. ارفع أوّل ملف بالزرّ أو بالسحب هنا.'}
            </p>
          )}
          {shown.map((m) => (
            <button
              key={m.url}
              type="button"
              onClick={() => setCurrent(m)}
              onDoubleClick={() => !(m.kind === 'video' && !m.poster) && onSelect(m)}
              className={cn('overflow-hidden rounded-lg border text-start', current?.url === m.url ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'border-border hover:border-primary/50')}
            >
              <MediaThumb media={m} className="aspect-square w-full" />
              <span dir="ltr" className="block truncate px-2 py-1 text-[11px] text-muted-foreground">{m.name}</span>
            </button>
          ))}
        </div>

        {current && (
          <aside className="space-y-3 border-t border-border pt-3 md:border-s md:border-t-0 md:ps-4 md:pt-0">
            <MediaThumb media={current} className="aspect-video w-full rounded-lg border border-border" large />
            <div>
              <p dir="ltr" className="truncate text-sm font-medium text-end">{current.name}</p>
              <p className="text-xs text-muted-foreground">
                {KIND_LABEL[current.kind]}
                {current.width && current.height ? ` · ${current.width}×${current.height}` : ''}
                {current.size ? ` · ${Math.round(current.size / 1024)}KB` : ''}
              </p>
            </div>
            {current.kind === 'video' && (
              <div className="space-y-2">
                <p className="text-sm font-medium">صورة الغلاف</p>
                {current.poster ? (
                  <MediaThumb media={current.poster} className="aspect-video w-full rounded-lg border border-border" />
                ) : (
                  <p className="flex gap-2 rounded-md bg-warning/10 p-2 text-xs text-warning">
                    <AlertTriangle className="h-4 w-4 shrink-0" /> الفيديو يحتاج صورة غلاف قبل استخدامه — تظهر قبل تشغيله.
                  </p>
                )}
                <Button type="button" variant="outline" size="sm" onClick={() => setPosterOpen(true)}>{current.poster ? 'تغيير الغلاف' : 'اختيار صورة غلاف'}</Button>
              </div>
            )}
          </aside>
        )}
      </div>

      {posterOpen && current && (
        <MediaLibraryDialog
          kinds={['image']}
          selected={current.poster ?? null}
          onClose={() => setPosterOpen(false)}
          onSelect={(poster) => {
            setCurrent({ ...current, poster });
            setPosterOpen(false);
          }}
        />
      )}
    </SiteDialog>
  );
}

/** مصغّرة على خلفية مربّعات — لترى الشفافية كما هي */
export function MediaThumb({ media, className, large }: { media: MediaRef; className?: string; large?: boolean }): JSX.Element {
  if (media.kind === 'video') {
    return (
      <div className={cn('relative flex items-center justify-center overflow-hidden bg-muted', className)}>
        {media.poster ? (
          <img src={media.poster.url} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : large ? (
          <video src={media.url} className="h-full w-full object-contain" muted controls preload="metadata" />
        ) : (
          <ImageOff className="h-5 w-5 text-muted-foreground" />
        )}
        {!large && (
          <span className="absolute flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white">
            <Play className="h-3.5 w-3.5 fill-current" />
          </span>
        )}
      </div>
    );
  }
  return (
    <div
      className={cn('flex items-center justify-center overflow-hidden bg-muted', className)}
      style={{ backgroundImage: 'linear-gradient(45deg,hsl(var(--border)) 25%,transparent 25%,transparent 75%,hsl(var(--border)) 75%),linear-gradient(45deg,hsl(var(--border)) 25%,transparent 25%,transparent 75%,hsl(var(--border)) 75%)', backgroundSize: '16px 16px', backgroundPosition: '0 0,8px 8px' }}
    >
      <img src={media.url} alt={media.alt?.ar ?? ''} className="max-h-full max-w-full object-contain p-1" loading="lazy" />
    </div>
  );
}
