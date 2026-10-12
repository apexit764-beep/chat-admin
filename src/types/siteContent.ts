// =====================================================================
// محتوى الموقع التعريفي — مخطّط CMS-PLAN §3 بشكل اللوحة
// =====================================================================
// كل نصّ بالشكل { ar, en } في مكانه، والموقع يقرأ كل لغة على حدة.

export type Locale = 'ar' | 'en';
export type Dual<T = string> = { ar: T; en: T };

/** كتلة محتوى عامّة — حقولها تُرسم من مخطّط (siteSchemas) أو تلقائياً */
export type Tree = Record<string, unknown>;

/** أيقونة من مكتبة Qhub أو Lucide، أو ملف مرفوع (CMS-PROMPT §6.5) */
export type IconRef =
  | { type: 'library'; set: 'qhub' | 'lucide'; name: string }
  | { type: 'upload'; url: string; recolor: boolean };

export type MediaKind = 'image' | 'animated' | 'video' | 'icon';

/** ملف من مكتبة الوسائط (CMS-PROMPT §6.4) */
export interface MediaRef {
  type: 'media';
  url: string;
  name: string;
  kind: MediaKind;
  width?: number;
  height?: number;
  size?: number;
  /** صورة غلاف الفيديو — إلزامية قبل استخدامه */
  poster?: MediaRef | null;
  alt?: Dual;
  folder?: string;
}

/**
 * بديل الرسمة المبنية بالكود — صورة أو GIF. وجوده يعني أن الموقع يعرضه
 * بدل المشهد، والمشهد ونصوصه تبقى محفوظة للرجوع إليها بنقرة.
 */
export interface ArtOverride {
  kind: 'image' | 'gif';
  url: string;
  name: string;
  alt: Dual;
}

/** رسمة خطوة في «الرحلة» — مشهد مبني بالكود، بنيته مقفلة ونصوصه تُحرَّر */
export type StepArt = { kind: string } & Record<string, unknown>;

// ─── المزايا ───────────────────────────────────────────────────────────

export interface FeatureCard {
  slug: string;
  title: Dual;
  blurb: Dual;
  icon: IconRef;
  /** رسمة البطاقة في سكشن «المزايا» بالرئيسية */
  cardArt?: ArtOverride | null;
}

export interface JourneyStep {
  title: Dual;
  body: Dual;
  art: StepArt;
  artOverride?: ArtOverride | null;
}

export interface FeatureDetail {
  title: Dual;
  body: Dual;
  points: Dual<string[]>;
  shot: string;
  scene?: string;
  route?: string;
  focus?: { x: number; y: number; w: number; h: number };
  artOverride?: ArtOverride | null;
}

export interface FeaturePage {
  eyebrow: Dual;
  h1: Dual;
  highlight: Dual<string[]>;
  lede: Dual;
  heroShot: string;
  heroScene?: string;
  heroRoute?: string;
  heroOverride?: ArtOverride | null;
  bullets?: Dual<string[]>;
  compare?: {
    eyebrow: Dual;
    title: Dual;
    withoutLabel: Dual;
    withLabel: Dual;
    rows: { without: Dual; with: Dual }[];
  };
  journey?: {
    eyebrow: Dual;
    title: Dual;
    lede: Dual;
    steps: JourneyStep[];
  };
  extras?: { eyebrow: Dual; title: Dual };
  benefits: { icon: IconRef; title: Dual; body: Dual }[];
  details: FeatureDetail[];
  liveTitle?: Dual;
  liveHighlight?: Dual<string[]>;
  faq: { q: Dual; a: Dual }[];
}

export interface FeaturesContent {
  cards: FeatureCard[];
  pages: Record<string, FeaturePage>;
}

// ─── محتوى عام ─────────────────────────────────────────────────────────

export interface HomeSection {
  key: string;
  enabled: boolean;
  data: Tree;
}

export interface Testimonial {
  quote: Dual;
  name: Dual;
  role: Dual;
  company: Dual;
  /** الأحرف الأولى — تُشتقّ من الاسم ويمكن تعديلها (حرفان) */
  initials: string | Dual;
  tint: string;
  avatar?: MediaRef | null;
  published?: boolean;
}

export interface Channel {
  key: string;
  name: Dual;
  tint: string;
  ring: string;
  logo: MediaRef | null;
  enabled?: boolean;
}

export interface Partner {
  key: string;
  name: Dual;
  logo: MediaRef | null;
  inkRatio: number;
  inkFill: number;
  published?: boolean;
}

export interface StatItem {
  to: number;
  suffix?: Dual | string;
  unit?: Dual | string;
  decimals?: number;
  duration?: number;
}

export interface LegalDoc {
  title: Dual;
  updated: Dual;
  intro: Dual;
  sections: { h: Dual; p: Dual<string[]>; list?: Dual<string[]> }[];
  /** «مسوّدة تحريرية — تحتاج مراجعة قانونية» حتى يُعتمد (CMS-PROMPT §7.10) */
  approvedAt?: string | null;
  approvedBy?: string | null;
}

/** حالة الموقع كاملةً في لحظة — المسودّة أو المنشور */
export interface SiteContent {
  home: { sections: HomeSection[] };
  features: FeaturesContent;
  solutions: Tree;
  faq: Tree;
  testimonials: { items: Testimonial[] };
  channels: { items: Channel[] };
  partners: { items: Partner[] };
  stats: { items: Record<string, StatItem> };
  legal: Record<string, LegalDoc>;
  pricing: Tree;
  site: Tree;
  seo: Tree;
  ui: Tree;
  scenes: Tree;
  demos: Tree;
}

export type SiteScope = keyof SiteContent;

export interface Publication {
  version: number;
  at: string;
  by: string;
  note: string;
  /** عدد الحقول التي تغيّرت في هذه النشرة */
  changes: number;
  /** الأقسام التي مسّتها النشرة */
  scopes: SiteScope[];
}

// ─── الوارد (CMS-PROMPT §7.14) ─────────────────────────────────────────

export type InboxStatus = 'new' | 'open' | 'closed';

export interface InboxNote {
  by: string;
  at: string;
  text: string;
}

interface InboxBase {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  locale: Locale;
  page: string;
  at: string;
  status: InboxStatus;
  assignee?: string | null;
  notes: InboxNote[];
}

export interface ContactMessage extends InboxBase {
  kind: 'contact';
  company?: string;
  subject: string;
  message: string;
}

export interface Lead extends InboxBase {
  kind: 'lead';
  transcript: { from: 'visitor' | 'assistant'; text: string; at: string }[];
}

export interface EnterpriseRequest extends InboxBase {
  kind: 'enterprise';
  company: string;
  teamSize: string;
  channels?: string;
  convos?: string;
  note: string;
}

export type InboxItem = ContactMessage | Lead | EnterpriseRequest;
