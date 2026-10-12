import { CSSProperties, useMemo, useState } from 'react';
import { icons as lucideIcons, Search, Upload } from 'lucide-react';
import { SiteDialog } from './SiteDialog';
import { useUIStore } from '@/store/useUIStore';
import type { IconRef } from '@/types/siteContent';
import { cn } from '@/lib/utils';
import { Icons } from './QhubIcons';
import { readImage } from './files';

/** أيقونات Qhub بكلمات البحث. أيقونات الواجهة (القائمة، الأسهم، الثيم) ليست محتوى فلا تظهر هنا. */
const QHUB: Record<string, string[]> = {
  inbox: ['صندوق', 'وارد', 'بريد', 'رسائل', 'inbox', 'mail'],
  sparkles: ['ذكاء', 'سحر', 'جديد', 'ai'],
  bot: ['مساعد', 'روبوت', 'ذكاء', 'bot', 'ai'],
  megaphone: ['حملة', 'تسويق', 'إعلان', 'campaign'],
  users: ['فريق', 'مستخدمين', 'عملاء', 'team'],
  chart: ['تقارير', 'إحصاء', 'تحليلات', 'reports'],
  widget: ['ويدجت', 'نافذة', 'دردشة', 'موقع', 'chat'],
  plug: ['ربط', 'تكامل', 'integration'],
  check: ['صح', 'تم', 'done'],
  bolt: ['سرعة', 'برق', 'أتمتة', 'fast'],
  shield: ['أمان', 'حماية', 'خصوصية', 'security'],
  clock: ['وقت', 'ساعة', 'time'],
  globe: ['عالم', 'لغات', 'world'],
  store: ['متجر', 'تجارة', 'shop'],
  building: ['شركة', 'مؤسسة', 'company'],
  heart: ['قلب', 'ولاء', 'love'],
  stethoscope: ['صحة', 'طبي', 'عيادة', 'health'],
  briefcase: ['أعمال', 'خدمات', 'business'],
  camera: ['تصوير', 'كاميرا', 'photo'],
  play: ['تشغيل', 'فيديو', 'play'],
  send: ['إرسال', 'رسالة', 'send'],
};

/** مرادفات عربية لأشيع أيقونات Lucide — «بريد» تجد mail وinbox */
const SYNONYMS: Record<string, string[]> = {
  بريد: ['mail', 'inbox'], رسالة: ['message', 'mail', 'send'], دردشة: ['message', 'chat'], هاتف: ['phone', 'smartphone'],
  مستخدم: ['user'], فريق: ['users'], عميل: ['user', 'contact'], إعدادات: ['settings', 'cog'], بحث: ['search'],
  نجمة: ['star'], قلب: ['heart'], وقت: ['clock', 'timer'], تقويم: ['calendar'], تقرير: ['chart', 'presentation'],
  نمو: ['trending'], مال: ['wallet', 'banknote', 'coins'], دفع: ['credit-card', 'wallet', 'receipt'], سعر: ['tag', 'receipt'],
  متجر: ['store', 'shopping'], سلة: ['shopping-cart', 'shopping-basket'], شحن: ['truck', 'package'], أمان: ['shield', 'lock'],
  قفل: ['lock'], ملف: ['file', 'folder'], صورة: ['image', 'camera'], فيديو: ['video', 'film'], صوت: ['mic', 'volume'],
  عالم: ['globe', 'earth'], لغة: ['languages', 'globe'], خريطة: ['map'], شركة: ['building'], عمل: ['briefcase'],
  تعليم: ['graduation-cap', 'book'], صحة: ['heart-pulse', 'stethoscope'], ذكاء: ['sparkles', 'brain', 'bot'], روبوت: ['bot'],
  سرعة: ['zap', 'rocket', 'gauge'], هدف: ['target'], فكرة: ['lightbulb'], ربط: ['link', 'plug'], تكامل: ['plug', 'puzzle'],
  تنبيه: ['bell', 'alert'], صح: ['check'], مساعدة: ['help', 'life-buoy'], سؤال: ['help', 'circle-help'], دعم: ['headphones', 'headset'],
  قائمة: ['list'], سحابة: ['cloud'], بيانات: ['database'], كود: ['code'], هدية: ['gift'], جائزة: ['award', 'trophy'],
  حملة: ['megaphone'], تسويق: ['megaphone', 'target'], توزيع: ['split', 'shuffle', 'git-branch'], قاعدة: ['list-checks', 'workflow'],
};

const norm = (s: string): string =>
  s.toLowerCase().replace(/[ً-ْٰـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim();

/** اسم Lucide الرسمي من مفتاح خريطة icons: MessageCircle ← message-circle */
const kebab = (p: string): string =>
  p.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').replace(/([a-zA-Z])([0-9])/g, '$1-$2').replace(/(\d)x-(\d)/g, '$1x$2').toLowerCase();

const LUCIDE = Object.entries(lucideIcons).map(([pascal, Icon]) => ({ name: kebab(pascal), Icon }));
const LUCIDE_BY_NAME = new Map(LUCIDE.map((l) => [l.name, l.Icon]));

/** خلفيات السكشن ولون الأيقونة عليها — الأيقونة تأخذ لون السكشن تلقائياً */
const BACKDROPS = {
  light: { bg: '#FFFFFF', color: '#2563EB', label: 'فاتحة' },
  dark: { bg: '#0D1017', color: '#93C5FD', label: 'داكنة' },
  brand: { bg: '#2563EB', color: '#FFFFFF', label: 'زرقاء' },
} as const;
type Backdrop = keyof typeof BACKDROPS;

export function IconView({ value, className, style }: { value: IconRef | null | undefined; className?: string; style?: CSSProperties }): JSX.Element | null {
  if (!value) return null;
  if (value.type === 'upload') {
    return value.recolor ? (
      <span
        aria-hidden
        className={cn('inline-block bg-current', className)}
        style={{ ...style, WebkitMaskImage: `url("${value.url}")`, maskImage: `url("${value.url}")`, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}
      />
    ) : (
      <img src={value.url} alt="" aria-hidden className={cn('object-contain', className)} style={style} />
    );
  }
  if (value.set === 'qhub') {
    const Q = Icons[value.name as keyof typeof Icons];
    return Q ? <span style={style} className="inline-flex"><Q className={className} /></span> : null;
  }
  const L = LUCIDE_BY_NAME.get(value.name);
  return L ? <L className={className} style={style} strokeWidth={1.6} /> : null;
}

const describe = (v: IconRef | null): string =>
  !v ? 'بلا أيقونة' : v.type === 'upload' ? 'ملف مرفوع' : `${v.set === 'qhub' ? 'Qhub' : 'Lucide'} · ${v.name}`;

export function IconPicker({ value, onChange, label = 'الأيقونة', backdrop = 'light' }: { value: IconRef; onChange: (v: IconRef) => void; label?: string; backdrop?: Backdrop }): JSX.Element {
  const [open, setOpen] = useState(false);
  const b = BACKDROPS[backdrop];

  return (
    <div className="space-y-1.5">
      <span className="text-sm font-semibold">{label}</span>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setOpen(true)} title="تغيير الأيقونة" className="h-11 w-11 shrink-0 rounded-lg border border-border flex items-center justify-center" style={{ background: b.bg, color: b.color }}>
          <IconView value={value} className="h-5 w-5" />
        </button>
        <span dir="ltr" className="flex-1 truncate text-xs text-muted-foreground text-end">{describe(value)}</span>
        <button type="button" onClick={() => setOpen(true)} className="h-9 px-3 rounded-md border border-border text-sm font-medium hover:bg-muted">
          تغيير
        </button>
      </div>
      {open && <IconDialog value={value} onClose={() => setOpen(false)} onPick={(v) => { onChange(v); setOpen(false); }} initialBackdrop={backdrop} />}
    </div>
  );
}

function IconDialog({ value, onClose, onPick, initialBackdrop }: { value: IconRef; onClose: () => void; onPick: (v: IconRef) => void; initialBackdrop: Backdrop }): JSX.Element {
  const showToast = useUIStore((s) => s.showToast);
  const [draft, setDraft] = useState<IconRef>(value);
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<'library' | 'upload'>(value.type === 'upload' ? 'upload' : 'library');
  const [backdrop, setBackdrop] = useState<Backdrop>(initialBackdrop);

  const qhub = Object.keys(QHUB).filter((n) => !q || n.includes(norm(q)) || QHUB[n].some((w) => norm(w).includes(norm(q))));
  const lucide = useMemo(() => {
    const nq = norm(q);
    if (!nq) return LUCIDE.slice(0, 120);
    const terms = new Set([nq]);
    for (const [ar, en] of Object.entries(SYNONYMS)) if (norm(ar).includes(nq) || nq.includes(norm(ar))) en.forEach((t) => terms.add(t));
    return LUCIDE.filter(({ name }) => [...terms].some((t) => name.includes(t))).slice(0, 300);
  }, [q]);

  const same = (v: IconRef): boolean => draft.type === 'library' && v.type === 'library' && draft.set === v.set && draft.name === v.name;
  const b = BACKDROPS[backdrop];

  const cell = (key: string, v: IconRef, title: string, icon: JSX.Element): JSX.Element => (
    <button
      key={key}
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={same(v)}
      onClick={() => setDraft(v)}
      onDoubleClick={() => onPick(v)}
      className={cn('aspect-square rounded-lg border flex items-center justify-center hover:bg-muted', same(v) ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary' : 'border-border')}
    >
      {icon}
    </button>
  );

  return (
    <SiteDialog
      open
      onClose={onClose}
      title="اختيار أيقونة"
      size="xl"
      footer={
        <div className="flex w-full flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-border px-4 py-2.5" style={{ background: b.bg, color: b.color }}>
            <IconView value={draft} className="h-5 w-5" />
            <IconView value={draft} className="h-8 w-8" />
          </div>
          <div className="flex gap-1.5">
            {(Object.keys(BACKDROPS) as Backdrop[]).map((k) => (
              <button key={k} type="button" onClick={() => setBackdrop(k)} aria-pressed={backdrop === k} className={cn('flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs', backdrop === k ? 'border-primary ring-1 ring-primary' : 'border-border')}>
                <span className="h-3 w-3 rounded-full border border-border" style={{ background: BACKDROPS[k].bg }} />
                {BACKDROPS[k].label}
              </button>
            ))}
          </div>
          <div className="ms-auto flex gap-2">
            <button type="button" onClick={onClose} className="h-9 px-4 rounded-md text-sm hover:bg-muted">إلغاء</button>
            <button type="button" onClick={() => onPick(draft)} className="h-9 px-4 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium">اختيار</button>
          </div>
        </div>
      }
    >
      <div className="mb-4 inline-flex rounded-lg bg-muted p-1">
        {(['library', 'upload'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={cn('rounded-md px-4 py-1.5 text-xs font-semibold', tab === t ? 'bg-card shadow-sm' : 'text-muted-foreground')}>
            {t === 'library' ? 'المكتبة' : 'رفع ملف'}
          </button>
        ))}
      </div>

      {tab === 'library' ? (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث بالعربي أو الإنجليزي… (بريد، تقرير، فريق)" className="w-full h-10 rounded-md border border-border bg-background ps-9 pe-3 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div className="max-h-[45vh] overflow-y-auto space-y-4 pe-1">
            {qhub.length > 0 && (
              <section>
                <h4 className="mb-2 text-xs font-semibold text-muted-foreground">أيقونات Qhub</h4>
                <div className="grid grid-cols-8 sm:grid-cols-12 gap-2">
                  {qhub.map((n) => {
                    const Q = Icons[n as keyof typeof Icons];
                    return cell(`q-${n}`, { type: 'library', set: 'qhub', name: n }, n, <Q className="h-5 w-5" />);
                  })}
                </div>
              </section>
            )}
            <section>
              <h4 className="mb-2 text-xs font-semibold text-muted-foreground">Lucide {!q && '· اكتب للبحث في 1,400+ أيقونة'}</h4>
              {lucide.length === 0 && qhub.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">لا أيقونة تطابق «{q}».</p>
              ) : (
                <div className="grid grid-cols-8 sm:grid-cols-12 gap-2">
                  {lucide.map(({ name, Icon }) => cell(`l-${name}`, { type: 'library', set: 'lucide', name }, name, <Icon className="h-5 w-5" strokeWidth={1.6} />))}
                </div>
              )}
            </section>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <label className="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary">
            <Upload className="h-5 w-5" />
            اختر ملف SVG أو PNG (حتى 300KB)
            <input
              type="file"
              accept=".svg,.png"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (!file) return;
                const res = await readImage(file, { maxKb: 300, types: ['image/svg+xml', 'image/png'] });
                if ('error' in res) return showToast(res.error, 'error');
                setDraft({ type: 'upload', url: res.url, recolor: file.type === 'image/svg+xml' });
              }}
            />
          </label>
          {draft.type === 'upload' && (
            <div className="space-y-1.5">
              <div className="inline-flex rounded-lg border border-border p-0.5">
                {[true, false].map((recolor) => (
                  <button key={String(recolor)} type="button" onClick={() => setDraft({ ...draft, recolor })} className={cn('rounded-md px-3 py-1 text-xs font-semibold', draft.recolor === recolor ? 'bg-primary/10 text-primary' : 'text-muted-foreground')}>
                    {recolor ? 'لوّنها بلون السكشن' : 'أبقِ ألوانها'}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">التلوين يناسب الأيقونات أحادية اللون فقط. جرّب الخلفيات بالأسفل قبل الاختيار.</p>
            </div>
          )}
        </div>
      )}
    </SiteDialog>
  );
}
