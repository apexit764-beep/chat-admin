import { Eye, EyeOff, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { DualField, LIMITS } from '@components/site/DualField';
import { ListEditor } from '@components/site/ListEditor';
import { MediaPicker } from '@components/site/MediaPicker';
import { SitePage } from '@components/site/SitePage';
import { TranslationBadges } from '@components/site/TranslationBadges';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import type { Dual, Testimonial } from '@/types/siteContent';
import { isDual } from '@/utils/siteContent';
import { cn } from '@/lib/utils';

/** ستة ألوان محدّدة لدائرة الأحرف — لا عجلة ألوان حرّة (§7.6) */
const TINTS = ['#2563EB', '#0EA5E9', '#7C3AED', '#DB2777', '#059669', '#D97706'];

/**
 * الأحرف الأولى: أوّل حرف من أوّل كلمتين، و«ال» تُتجاهل في الثانية.
 * «سعيد الرواحي» ← «س ر» · «Said Al-Rawahi» ← «SR»
 */
export function deriveInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const second = words[1]?.replace(/^ال(?=\p{L}{2})/u, '').replace(/^al-/i, '');
  const letters = [words[0], second].filter(Boolean).map((w) => [...w!][0]);
  return letters.some((l) => /\p{Script=Arabic}/u.test(l)) ? letters.join(' ') : letters.join('').toUpperCase();
}

const initialsOf = (t: Testimonial): Dual => (isDual(t.initials) ? t.initials : { ar: String(t.initials ?? deriveInitials(t.name.ar)), en: deriveInitials(t.name.en) });

function Avatar({ t, size = 40 }: { t: Testimonial; size?: number }): JSX.Element {
  if (t.avatar) return <img src={t.avatar.url} alt="" className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />;
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ width: size, height: size, background: t.tint }}>
      {initialsOf(t).ar}
    </span>
  );
}

/**
 * آراء العملاء (CMS-PROMPT §7.6): عدد مفتوح، ومعاينة البطاقة حيّة — بالصورة
 * إن وُجدت، وإلا بالأحرف الأولى على لون.
 */
export default function SiteTestimonials(): JSX.Element {
  const items = useSiteContentStore((s) => s.draft.testimonials.items);
  const set = useSiteContentStore((s) => s.set);
  const update = (next: Testimonial[]): void => set('testimonials', { items: next });
  const publishedCount = items.filter((t) => t.published !== false).length;

  return (
    <SitePage title="آراء العملاء" lede="عدد مفتوح — السلايدر يعرضها كلها بترتيبها هنا." scope="testimonials" badges={items}>
      {publishedCount < 2 && <p className="rounded-lg bg-warning/10 px-3 py-2 text-sm text-warning">السلايدر يحتاج شهادتين منشورتين على الأقل ليبدو سلايدراً.</p>}
      <Card className="p-4">
        <ListEditor<Testimonial>
          items={items}
          onChange={update}
          addLabel="إضافة شهادة"
          createItem={() => ({ quote: { ar: '', en: '' }, name: { ar: '', en: '' }, role: { ar: '', en: '' }, company: { ar: '', en: '' }, initials: '', tint: TINTS[items.length % TINTS.length], avatar: null, published: true })}
          getTitle={(t) => (
            <span className="flex items-center gap-2">
              <Avatar t={t} size={28} />
              {t.name.ar || 'شهادة جديدة'}
              <span className="text-xs font-normal text-muted-foreground">{t.company.ar}</span>
            </span>
          )}
          getMeta={(t, i) => (
            <>
              <TranslationBadges entity={{ q: t.quote, n: t.name, r: t.role, c: t.company }} className="hidden sm:inline-flex" />
              <span title={t.published !== false ? 'منشورة' : 'مخفية'}>{t.published !== false ? <Eye className="h-4 w-4 text-success" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}</span>
              <Switch checked={t.published !== false} onCheckedChange={(published) => update(items.map((x, j) => (j === i ? { ...x, published } : x)))} aria-label="منشورة" />
            </>
          )}
          renderItem={(t, upd) => (
            <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
              <div className="space-y-4">
                <DualField label="الاقتباس" type="textarea" value={t.quote} onChange={(quote) => upd({ ...t, quote })} limit={LIMITS.testimonial} />
                <DualField label="الاسم" value={t.name} onChange={(name) => upd({ ...t, name })} />
                <div className="grid gap-4 md:grid-cols-2">
                  <DualField label="المنصب" value={t.role} onChange={(role) => upd({ ...t, role })} />
                  <DualField label="الشركة" value={t.company} onChange={(company) => upd({ ...t, company })} />
                </div>
                <MediaPicker label="الصورة الشخصية (اختيارية)" kinds={['image']} value={t.avatar} withAlt={false} onChange={(avatar) => upd({ ...t, avatar })} hint="مربّعة، وتُعرض دائرية. بدونها تظهر الأحرف الأولى." />
                {!t.avatar && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium">الأحرف الأولى ولونها</span>
                    <div className="flex flex-wrap items-center gap-2">
                      {(['ar', 'en'] as const).map((l) => (
                        <Input
                          key={l}
                          dir={l === 'ar' ? 'rtl' : 'ltr'}
                          maxLength={3}
                          className="w-20 text-center"
                          value={initialsOf(t)[l]}
                          onChange={(e) => upd({ ...t, initials: { ...initialsOf(t), [l]: e.target.value } })}
                          aria-label={l === 'ar' ? 'الأحرف بالعربية' : 'الأحرف بالإنجليزية'}
                        />
                      ))}
                      <button type="button" onClick={() => upd({ ...t, initials: { ar: deriveInitials(t.name.ar), en: deriveInitials(t.name.en) } })} className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <RotateCcw className="h-3.5 w-3.5" /> إعادة الاشتقاق من الاسم
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {TINTS.map((c) => (
                        <button key={c} type="button" aria-label={c} onClick={() => upd({ ...t, tint: c })} className={cn('h-7 w-7 rounded-full ring-offset-2 ring-offset-background', t.tint === c && 'ring-2 ring-primary')} style={{ background: c }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* معاينة البطاقة كما على الموقع */}
              <div className="h-fit rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-sm leading-relaxed">«{t.quote.ar}»</p>
                <div className="mt-4 flex items-center gap-3">
                  <Avatar t={t} />
                  <div>
                    <p className="text-sm font-semibold">{t.name.ar}</p>
                    <p className="text-xs text-muted-foreground">{t.role.ar}{t.company.ar && ` · ${t.company.ar}`}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        />
      </Card>
    </SitePage>
  );
}
