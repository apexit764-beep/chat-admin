import type { Dual, Locale } from '@/types/siteContent';
import { bareWord, matchesWord } from './siteTypography';

export const LOCALES: Locale[] = ['ar', 'en'];

export function isDual(v: unknown): v is Dual<unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v) && Object.keys(v).length === 2 && 'ar' in v && 'en' in v;
}

export function isBlank(v: unknown): boolean {
  if (v == null) return true;
  if (typeof v === 'string') return v.trim() === '';
  if (Array.isArray(v)) return v.length === 0 || v.every(isBlank);
  return false;
}

/**
 * الترجمات الناقصة لكل لغة في أي كيان — يمشي في الكائن كله ويعدّ كل
 * `{ar, en}` فيه. حقل فارغ باللغتين اختياري، لا «ناقص».
 */
/** قيم تقنية تختلف بين اللغتين عمداً (أعلام التعبير النمطي: i للإنجليزي فقط) — ليست ترجمة */
const TECHNICAL = new Set(['flags', 'pattern']);

export function missingTranslations(entity: unknown): Record<Locale, number> {
  const missing = { ar: 0, en: 0 };
  const walk = (node: unknown): void => {
    if (isDual(node)) {
      if (isBlank(node.ar) && isBlank(node.en)) return;
      if (isBlank(node.ar)) missing.ar++;
      if (isBlank(node.en)) missing.en++;
      return;
    }
    if (Array.isArray(node)) node.forEach(walk);
    else if (typeof node === 'object' && node !== null) for (const [k, v] of Object.entries(node)) if (!TECHNICAL.has(k)) walk(v);
  };
  walk(entity);
  return missing;
}

// ─── العنوان المميَّز ─────────────────────────────────────────────────────
// الكلمة تتلوّن إن طابقت كلمة في highlight مطابقةً كاملة بلا ترقيم — نفس
// مطابقة WordsReveal في الموقع. الكشيدة لا تُضاف تلقائياً: الكاتب يكتبها
// بنفسه داخل النص (ـ) حيث يريدها، فتظهر كما كتبها.

export interface TitleWord {
  raw: string;
  highlighted: boolean;
}

export function titleWords(title: string, highlight: string[] = []): TitleWord[] {
  return title
    .split(' ')
    .filter(Boolean)
    .map((raw) => ({ raw, highlighted: highlight.some((h) => matchesWord(raw, h)) }));
}

export function toggleWord(list: string[], word: string): string[] {
  return list.some((w) => matchesWord(word, w)) ? list.filter((w) => !matchesWord(word, w)) : [...list, bareWord(word)];
}

/** يُبقي من القائمة ما ما زال في العنوان — لا كلمة يتيمة */
export function pruneWords(list: string[], title: string): { kept: string[]; removed: string[] } {
  const words = title.split(' ').filter(Boolean);
  const kept: string[] = [];
  const removed: string[] = [];
  for (const w of list) {
    if (words.some((word) => matchesWord(word, w))) {
      kept.push(w);
      continue;
    }
    // الكاتب أضاف كشيدة لكلمة ملوّنة أو حذفها: نفس الكلمة، فيبقى لونها
    // وتُحفظ بكتابتها الجديدة لكي تطابقها الموقع حرفياً
    const same = words.find((word) => matchesWord(word.replace(/ـ/g, ''), w.replace(/ـ/g, '')));
    if (same) kept.push(bareWord(same));
    else removed.push(w);
  }
  return { kept, removed };
}

// ─── الفرق بين المنشور والمسودّة ─────────────────────────────────────────

export interface DiffRow {
  path: string;
  changes: Partial<Record<Locale | 'value', { before: string; after: string }>>;
}

export function display(v: unknown): string {
  if (v == null) return '';
  if (Array.isArray(v)) return v.map(display).filter(Boolean).join(' · ');
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>;
    if (o.type === 'library') return `أيقونة: ${o.name}`;
    if (o.kind === 'image' || o.kind === 'gif') return `${o.kind === 'gif' ? 'GIF' : 'صورة'}: ${o.name}`;
    return JSON.stringify(v);
  }
  return String(v);
}

function leaves(v: unknown, path: string, out: Map<string, unknown>): void {
  const isAtomic =
    isDual(v) ||
    typeof v !== 'object' ||
    v === null ||
    (Array.isArray(v) && v.every((x) => typeof x !== 'object' || x === null)) ||
    ['library', 'upload'].includes((v as { type?: string }).type ?? '') ||
    ['image', 'gif'].includes((v as { kind?: string }).kind ?? '');
  if (isAtomic) {
    out.set(path, v);
    return;
  }
  for (const [k, child] of Object.entries(v as object)) leaves(child, path ? `${path}.${k}` : k, out);
}

export function diff(before: unknown, after: unknown): DiffRow[] {
  const a = new Map<string, unknown>();
  const b = new Map<string, unknown>();
  leaves(before, '', a);
  leaves(after, '', b);

  const rows: DiffRow[] = [];
  for (const path of new Set([...a.keys(), ...b.keys()])) {
    const x = a.get(path);
    const y = b.get(path);
    const changes: DiffRow['changes'] = {};
    if (isDual(x) || isDual(y)) {
      for (const l of LOCALES) {
        const bx = display(isDual(x) ? x[l] : undefined);
        const by = display(isDual(y) ? y[l] : undefined);
        if (bx !== by) changes[l] = { before: bx, after: by };
      }
    } else if (display(x) !== display(y)) {
      changes.value = { before: display(x), after: display(y) };
    }
    if (Object.keys(changes).length) rows.push({ path, changes });
  }
  return rows;
}

/** تسمية بشرية لمسار حقل في نافذة الفرق: pages.team.journey.steps.2.title ← … */
export const SEGMENTS: Record<string, string> = {
  cards: 'البطاقات',
  pages: '',
  items: 'العناصر',
  quote: 'الاقتباس',
  role: 'المنصب',
  company: 'الشركة',
  name: 'الاسم',
  sector: 'القطاع',
  pain: 'الوجع',
  wins: 'المكاسب',
  enabled: 'الظهور',
  key: 'المفتاح',
  intro: 'المقدّمة',
  updated: 'آخر تحديث',
  h: 'عنوان القسم',
  p: 'الفقرات',
  list: 'القائمة',
  logo: 'الشعار',
  tint: 'اللون',
  inkRatio: 'نسبة الحبر',
  plans: 'الباقات',
  comparison: 'جدول المقارنة',
  label: 'التسمية',
  values: 'القيم',
  eyebrow: 'الشارة',
  h1: 'العنوان',
  highlight: 'الكلمات الملوّنة',
  lede: 'الوصف',
  bullets: 'النقاط',
  compare: 'المقارنة',
  withoutLabel: 'تسمية «بدون»',
  withLabel: 'تسمية «مع»',
  rows: 'الصفوف',
  without: 'بدون',
  with: 'مع',
  journey: 'الرحلة',
  steps: 'الخطوات',
  art: 'نصوص الرسمة',
  artOverride: 'الرسمة',
  heroOverride: 'رسمة الهيرو',
  cardArt: 'رسمة البطاقة',
  extras: 'المزايا الإضافية',
  benefits: 'الفوائد',
  details: 'التفاصيل',
  points: 'النقاط',
  liveTitle: 'عنوان العرض الحيّ',
  liveHighlight: 'كلمات العرض الحيّ',
  faq: 'الأسئلة',
  q: 'السؤال',
  a: 'الجواب',
  title: 'العنوان',
  body: 'النص',
  blurb: 'الوصف المختصر',
  icon: 'الأيقونة',
  // حقول الرسومات المبنية
  pairs: 'القواعد',
  turns: 'الرسائل',
  sub: 'السطر الثاني',
  badge: 'الشارة',
  initial: 'الحرف',
  value: 'القيمة',
  unit: 'الوحدة',
  when: 'عندما',
  then: 'تذهب إلى',
  text: 'الرسالة',
  k: 'الحقل',
  v: 'القيمة',
  from: 'من',
  to: 'إلى',
  nav: 'روابط القائمة',
  bubble: 'فقاعة الترحيب',
  merge: 'نصّ الدمج',
  alt: 'النص البديل',
  // مفاتيح السكاشن والواجهة
  headline: 'العنوان',
  sectionLabel: 'اسم السكشن لقارئ الشاشة',
  start: 'الزرّ الأساسي',
  watchDemo: 'زرّ العرض',
  inboxTitle: 'عنوان الوارد',
  previews: 'نصوص البطاقات العائمة',
  primary: 'الزرّ الأساسي',
  secondary: 'الزرّ الثانوي',
  titleLead: 'العنوان (الجزء الأوّل)',
  titleRest: 'العنوان (الجزء الثاني)',
  more: 'رابط «المزيد»',
  desc: 'الوصف',
  description: 'الوصف',
  facts: 'الحقائق',
  reply: 'الردّ',
  ask: 'السؤال',
  msg: 'الرسالة',
  perks: 'المزايا',
  tagline: 'السطر التعريفي',
  reach: 'النطاق',
  video: 'الفيديو',
  poster: 'صورة الغلاف',
  image: 'الصورة',
  links: 'الروابط',
  groups: 'المجموعات',
  sectors: 'القطاعات',
  chips: 'رقائق القنوات',
  arcs: 'أقواس الشعارات',
  dot: 'تسمية نقاط السلايدر',
  heading: 'العنوان',
  eyebrowIcon: 'أيقونة الشارة',
  approvedAt: 'تاريخ الاعتماد',
  approvedBy: 'المعتمِد',
};

export function labelFor(path: string, pageTitle?: (slug: string) => string, scopeLabels?: Record<string, string>): string {
  const parts = path.split('.');
  const out: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (i === 0 && scopeLabels?.[p]) out.push(scopeLabels[p]);
    else if (parts[i - 1] === 'pages' && pageTitle) out.push(pageTitle(p));
    else if (p === 'data' || p === 'sections') continue;
    else if (/^\d+$/.test(p)) out.push(`#${Number(p) + 1}`);
    else if (p in SEGMENTS) {
      if (SEGMENTS[p]) out.push(SEGMENTS[p]);
    } else out.push(p);
  }
  return out.join(' › ');
}
