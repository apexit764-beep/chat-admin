import type { Dual, Tree } from '@/types/siteContent';
import { ChannelsPicker } from './ChannelsPicker';
import { DualField, LIMITS } from './DualField';
import { IconPicker } from './IconPicker';
import { ListEditor } from './ListEditor';
import { MediaPicker } from './MediaPicker';
import type { Field } from './SchemaForm';
import { TranslationBadges } from './TranslationBadges';

/**
 * سكاشن الصفحة الرئيسية (CMS-PROMPT §7.2) — مفاتيحها ثابتة، ولكل سكشن
 * مخطّط حقوله. الكشيدة يكتبها الكاتب بنفسه داخل النص (ـ)، فحقول stretch
 * القديمة لا تظهر.
 */
export const SECTION_LABEL: Record<string, string> = {
  hero: 'الهيرو',
  how_it_works: 'كيف يعمل',
  features_overview: 'المزايا',
  ai_features: 'مزايا الذكاء الاصطناعي',
  chat_story: 'العرض التفاعلي',
  sectors: 'القطاعات',
  integrations: 'القنوات والربط',
  stats: 'بالأرقام',
  testimonials: 'آراء العملاء',
  final_cta: 'دعوة الختام',
  partners_marquee: 'شريط الشركاء',
  guided_tour: 'الجولة التفاعلية',
  system_preview: 'داخل المنصة',
  pricing_teaser: 'الباقات في الرئيسية',
};

export const SECTION_HINT: Record<string, string> = {
  testimonials: 'عنوان السكشن، والشهادات نفسها تحته.',
  features_overview: 'البطاقات تُسحب من «المزايا» بأسمائها وأيقوناتها ورسوماتها.',
  partners_marquee: 'عنوان الشريط، والشعارات تحته.',
  integrations: 'نصوص السكشن وأقواسه، ومكتبة شعارات القنوات تحته.',
  stats: 'نصوص السكشن، والأرقام نفسها تحته.',
};

const t = (key: string, label: string, limit?: number, hint?: string): Field => ({ type: 'text', key, label, limit, hint });
const ta = (key: string, label: string, limit = LIMITS.description): Field => ({ type: 'textarea', key, label, limit });
const title = (key = 'title', highlight = 'highlight', label = 'العنوان'): Field => ({ type: 'title', key, highlight, label });
const eyebrow: Field[] = [t('eyebrow', 'الشارة (eyebrow)', 40), { type: 'icon', key: 'eyebrowIcon', label: 'أيقونة الشارة' }];
const dualTitle = (item: Tree, key = 'title'): string => (item[key] as Dual | undefined)?.ar ?? '';

export const HOME_SCHEMAS: Record<string, Field[]> = {
  hero: [
    t('badge', 'الشارة فوق العنوان', 40),
    t('sectionLabel', 'اسم السكشن لقارئ الشاشة'),
    { type: 'words', key: 'headline', label: 'العنوان', colored: 3 },
    ta('lede', 'الوصف'),
    t('start', 'الزرّ الأساسي', 24),
    t('watchDemo', 'الزرّ الثانوي (العرض)', 30),
    t('inboxTitle', 'عنوان صندوق الوارد في الصورة'),
    { type: 'media', key: 'video', label: 'فيديو الديمو', kinds: ['video'], hint: 'يُرفق بصورة غلاف إلزامياً.' },
    { type: 'media', key: 'poster', label: 'صورة الغلاف', kinds: ['image'] },
    { type: 'channels', key: 'channels', label: 'قنوات البطاقات العائمة', locked: true, hint: 'مسارات البطاقات محسوبة لستّ بطاقات.' },
    { type: 'list', key: 'previews', label: 'نصّ كل بطاقة عائمة', hint: 'بترتيب القنوات أعلاه.' },
  ],
  how_it_works: [
    ...eyebrow,
    title(),
    ta('lede', 'الوصف'),
    {
      type: 'items',
      key: 'steps',
      label: 'الخطوات',
      locked: true,
      itemTitle: (s) => `${(s.n as string) ?? ''} · ${dualTitle(s)}`,
      fields: [{ type: 'icon', key: 'icon' }, t('title', 'العنوان', 40), ta('body', 'النص')],
    },
  ],
  features_overview: [
    ...eyebrow,
    title(),
    ta('lede', 'الوصف'),
    t('more', 'نصّ رابط «كل المزايا»', 30),
    { type: 'note', text: 'البطاقات ورسوماتها من شاشة «المزايا» (تبويب «البطاقة» في كل ميزة).' },
    { type: 'auto', key: 'art', label: 'نصوص الرسومات المبنية في البطاقات' },
  ],
  ai_features: [
    ...eyebrow,
    title(),
    ta('lede', 'الوصف'),
    {
      type: 'items',
      key: 'cards',
      label: 'البطاقات',
      min: 4,
      max: 6,
      addLabel: 'إضافة بطاقة',
      create: () => ({ icon: { type: 'library', set: 'qhub', name: 'sparkles' }, title: { ar: '', en: '' }, body: { ar: '', en: '' } }),
      itemTitle: (c) => dualTitle(c),
      fields: [{ type: 'icon', key: 'icon' }, t('title', 'العنوان', 40), ta('body', 'النص')],
    },
  ],
  chat_story: [
    t('eyebrow', 'الشارة', 40),
    { type: 'icon', key: 'eyebrowIcon', label: 'أيقونة الشارة' },
    t('headA', 'العنوان — قبل الكلمة الممدودة'),
    t('headStretch', 'الكلمة الممدودة', 20, 'اكتب الكشيدة بنفسك داخلها (ـ).'),
    t('headB', 'العنوان — بعد الكلمة'),
    ta('lede', 'الوصف'),
    { type: 'items', key: 'beats', label: 'المحطات الخمس', locked: true, itemTitle: (b) => dualTitle(b), fields: [t('title', 'العنوان', 40), ta('body', 'النص')] },
    { type: 'list', key: 'script', label: 'رسائل السيناريو', hint: 'عدد الرسائل والمرسِل مقفلان (عميل · AI · عميل · نظام · موظف · عميل) — النص فقط يُحرَّر.' },
    { type: 'items', key: 'replies', label: 'ردود «جرّبها بنفسك»', locked: true, itemTitle: (r) => dualTitle(r, 'reply'), fields: [ta('reply', 'الرد'), { type: 'note', text: 'كلمات المطابقة منطق مقفل.' }] },
    t('sectionLabel', 'اسم السكشن لقارئ الشاشة'),
    t('contact', 'اسم العميل في العرض', 30),
    t('channelLine', 'سطر القناة', 40),
    t('now', '«الآن»', 12),
    t('aiName', 'اسم المساعد', 24),
    t('agentName', 'اسم الموظف', 24),
    t('agentInitial', 'حرف الموظف', 2),
    t('tryLabel', 'عنوان «جرّبها»', 30),
    t('tryPlaceholder', 'تلميح حقل التجربة', 50),
    t('waitPlaceholder', 'تلميح أثناء الرد', 50),
    t('sendLabel', 'زرّ الإرسال', 16),
    ta('fallback', 'الرد حين لا تطابق رسالة الزائر شيئاً'),
  ],
  sectors: [
    ...eyebrow,
    title(),
    ta('lede', 'الوصف'),
    {
      type: 'custom',
      render: (data, set) => <SectorsEditor data={data} set={set} />,
    },
  ],
  integrations: [
    t('titleLead', 'العنوان — الجزء الأوّل'),
    t('titleRest', 'العنوان — الجزء الثاني'),
    ta('lede', 'الوصف'),
    t('cta', 'الزرّ', 30),
    {
      type: 'custom',
      render: (data, set) => {
        const arcs = (data.arcs as string[][]) ?? [[], []];
        return (
          <div className="grid gap-5 md:grid-cols-2">
            {['القوس الخارجي', 'القوس الداخلي'].map((label, i) => (
              <ChannelsPicker key={label} label={`شعارات ${label}`} value={arcs[i] ?? []} min={i ? 4 : 6} max={12} onChange={(v) => set({ ...data, arcs: arcs.map((a, j) => (j === i ? v : a)) })} />
            ))}
          </div>
        );
      },
    },
  ],
  stats: [
    ...eyebrow,
    title(),
    { type: 'note', text: 'قيم الأرقام (12M+ · 10+ · 95%+ · 2.4) في «الأرقام» أسفل الصفحة. هنا وصف كل رقم.' },
    ta('messages', 'وصف الرسائل الشهرية'),
    ta('channels', 'وصف القنوات'),
    ta('accuracy', 'وصف الدقّة'),
    t('response', 'وصف سرعة الرد'),
    t('seconds', 'وحدة الثواني', 6),
    { type: 'media', key: 'video', label: 'فيديو اللهجات', kinds: ['video'] },
    { type: 'media', key: 'poster', label: 'غلاف الفيديو', kinds: ['image'] },
    { type: 'channels', key: 'chips', label: 'رقائق القنوات', min: 6, max: 16 },
  ],
  testimonials: [...eyebrow, title(), t('dot', 'تسمية نقاط السلايدر', 30, '{0} = رقم الشهادة')],
  final_cta: [
    t('badge', 'الشارة', 40),
    title(),
    ta('lede', 'الوصف'),
    t('primary', 'الزرّ الأساسي', 24),
    t('secondary', 'الزرّ الثانوي', 24),
    { type: 'list', key: 'perks', label: 'النقاط تحت الأزرار', hint: 'ثلاث نقاط.' },
    { type: 'channels', key: 'channels', label: 'القنوات الطائرة', locked: true, hint: 'مواضعها مصمّمة لأربع قنوات.' },
  ],
  partners_marquee: [t('label', 'العنوان فوق الشريط')],
  guided_tour: [
    ...eyebrow,
    title('heading'),
    ta('lede', 'الوصف'),
    t('startTitle', 'عنوان البداية'),
    ta('startBody', 'نص البداية'),
    t('startCta', 'زرّ البداية', 24),
    { type: 'items', key: 'steps', label: 'خطوات الجولة', locked: true, itemTitle: (s) => dualTitle(s), fields: [t('title', 'العنوان'), ta('body', 'النص')] },
    t('stepOf', 'عدّاد الخطوات', 30, '{0} = الخطوة، {1} = المجموع'),
    t('next', 'زرّ التالي', 16),
    t('prev', 'زرّ السابق', 16),
    t('restart', 'زرّ الإعادة', 20),
  ],
  system_preview: [
    { type: 'items', key: 'screens', label: 'الشاشات', locked: true, itemTitle: (s) => String((s.title as Dual)?.ar ?? s.title ?? ''), fields: [t('title', 'عنوان الشاشة')] },
  ],
  pricing_teaser: [
    ...eyebrow,
    title(),
    ta('lede', 'الوصف'),
    { type: 'note', text: 'الباقات وأسعارها من شاشة «الباقات» في اللوحة.' },
    t('featured', 'شارة «الأكثر طلباً»', 20),
    t('perMonth', '«/ شهرياً»', 16),
    t('subscribe', 'زرّ الاشتراك', 20),
    t('compare', 'رابط المقارنة', 30),
    t('monthly', 'تبويب «شهري»', 12),
    t('yearly', 'تبويب «سنوي»', 12),
    t('save', 'شارة التوفير', 20),
  ],
};

/**
 * القطاعات: سبع بطاقات مقفلة — نصوصها في `sectors` ووسائطها في `cards`
 * بالترتيب نفسه، فتُعرض بطاقةً واحدة لكل قطاع (§7.2).
 */
function SectorsEditor({ data, set }: { data: Tree; set: (d: Tree) => void }): JSX.Element {
  const texts = (data.sectors as Tree[]) ?? [];
  const cards = (data.cards as Tree[]) ?? [];
  const items = texts.map((text, i) => ({ text, card: cards[i] ?? {} }));
  // مواضع الشبكة (bento) — للرسم المصغّر
  const SPANS = ['col-span-2', 'row-span-2', '', '', '', '', 'col-span-2'];

  return (
    <div className="space-y-3">
      <span className="text-sm font-semibold">بطاقات القطاعات</span>
      <div className="grid w-56 grid-cols-4 gap-1 rounded-lg border border-border p-1.5" aria-hidden title="موضع كل بطاقة في الشبكة">
        {items.map((_, i) => (
          <span key={i} className={`flex h-6 items-center justify-center rounded bg-primary/10 text-[10px] font-semibold text-primary ${SPANS[i] ?? ''}`}>{i + 1}</span>
        ))}
      </div>
      <ListEditor
        items={items}
        locked
        onChange={(next) => set({ ...data, sectors: next.map((n) => n.text), cards: next.map((n) => n.card) })}
        getTitle={(it) => (it.text.title as Dual)?.ar}
        getMeta={(it) => <TranslationBadges entity={it.text} />}
        renderItem={(it, update) => (
          <>
            <IconPicker value={it.card.icon as never} onChange={(icon) => update({ ...it, card: { ...it.card, icon } })} />
            <DualField label="اسم القطاع" value={it.text.title as Dual} onChange={(title) => update({ ...it, text: { ...it.text, title } })} limit={30} />
            <DualField label="النص" type="textarea" value={it.text.body as Dual} onChange={(body) => update({ ...it, text: { ...it.text, body } })} limit={LIMITS.description} />
            <div className="grid gap-4 md:grid-cols-2">
              <MediaPicker label="فيديو (اختياري)" kinds={['video']} value={it.card.video as never} onChange={(video) => update({ ...it, card: { ...it.card, video } })} />
              <MediaPicker label="صورة (اختياري)" kinds={['image']} value={it.card.image as never} onChange={(image) => update({ ...it, card: { ...it.card, image } })} />
            </div>
          </>
        )}
      />
    </div>
  );
}

