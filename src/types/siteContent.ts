// =====================================================================
// محتوى الموقع التعريفي — صفحات المزايا
// =====================================================================
// كل نصّ بالشكل { ar, en } في مكانه، والموقع يقرأ كل لغة على حدة.

export type Locale = 'ar' | 'en';
export type Dual<T = string> = { ar: T; en: T };

/** أيقونة من مكتبة Qhub أو Lucide، أو ملف مرفوع */
export type IconRef =
  | { type: 'library'; set: 'qhub' | 'lucide'; name: string }
  | { type: 'upload'; url: string; recolor: boolean };

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

/**
 * رسمة خطوة في «الرحلة» — مشهد مبني بالكود. البنية (`kind` وعدد العناصر)
 * مقفلة، والنصوص داخلها قابلة للتحرير.
 */
export type StepArt = { kind: string } & Record<string, unknown>;

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

/** حالة الموقع كاملةً في لحظة — المسودّة أو المنشور */
export interface FeaturesContent {
  cards: FeatureCard[];
  pages: Record<string, FeaturePage>;
}

export interface Publication {
  version: number;
  at: string;
  by: string;
  note: string;
  /** عدد الحقول التي تغيّرت في هذه النشرة */
  changes: number;
}
