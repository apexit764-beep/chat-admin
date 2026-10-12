/**
 * يولّد محتوى الموقع التعريفي كاملاً للوحة من محتوى الموقع الحقيقي.
 *
 *   node scripts/import-site-content.mjs ../qhub-site/content-seed/content-seed.json
 *
 * المصدر: ناتج qhub-site/scripts/export-content.mjs — كل نطاق شجرتان كاملتان
 * `{ar: …, en: …}`. اللوحة تحرّر حقلاً حقلاً، فتُضمّ الشجرتان هنا: كل نصّ
 * يصير `{ar, en}` في مكانه. الناتج src/store/siteContentSeed.ts.
 *
 * الوسائط: ملفات الموقع تُشار إليها بروابطها على الموقع الحي، وشعارات
 * القنوات (المرسومة بالكود في الموقع) تُنسخ إلى public/site-media/channels.
 */
import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const seedPath = process.argv[2];
if (!seedPath) {
  console.error('المسار مطلوب: node scripts/import-site-content.mjs <content-seed.json>');
  process.exit(1);
}

const SITE = 'https://qhub-lp.apexes.click';
const ROOT = path.resolve(import.meta.dirname, '..');
const { scopes, generated_at } = JSON.parse(readFileSync(seedPath, 'utf8'));

// شعارات القنوات
const channelsDir = path.join(path.dirname(seedPath), 'channels');
const targetDir = path.join(ROOT, 'public/site-media/channels');
mkdirSync(targetDir, { recursive: true });
for (const f of readdirSync(channelsDir)) copyFileSync(path.join(channelsDir, f), path.join(targetDir, f));

/** قيم ثابتة عبر اللغتين بطبيعتها — تبقى بلا {ar, en} حين تتطابق */
const INVARIANT = new Set([
  'slug', 'key', 'id', 'kind', 'ch', 'url', 'href', 'shot', 'scene', 'route', 'heroShot', 'heroScene', 'heroRoute',
  'from', 'file', 'tint', 'ring', 'n', 'initials', 'pattern', 'flags',
]);

/** قوائم مفاتيح أو أرقام (قنوات، ترتيب، قيم المشاهد) — واحدة للغتين */
const KEY_LISTS = new Set(['channels', 'chips', 'arcs', 'order', 'on', 'loads', 'balanced']);

const isList = Array.isArray;
const isMap = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isRef = (v) => isMap(v) && ['library', 'upload', 'media'].includes(v.type);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const scalarList = (l) => l.every((v) => !isMap(v) && !isList(v));

/** نسخة فارغة من عنصر — لعنصر موجود في لغة واحدة: يظهر للمحرّر «ترجمة ناقصة» */
function blank(v) {
  if (typeof v === 'string') return '';
  if (isList(v)) return scalarList(v) ? [] : v.map(blank);
  if (isRef(v)) return v;
  if (isMap(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, INVARIANT.has(k) ? x : blank(x)]));
  return v;
}

function zip(ar, en, key) {
  if (isList(ar) && isList(en)) {
    if (scalarList(ar) && scalarList(en)) return same(ar, en) && KEY_LISTS.has(key) ? ar : { ar, en };
    const n = Math.max(ar.length, en.length);
    return Array.from({ length: n }, (_, i) => zip(ar[i] ?? blank(en[i]), en[i] ?? blank(ar[i]), key));
  }
  if (same(ar, en) && isRef(ar)) return ar;
  if (isMap(ar) && isMap(en)) {
    const out = {};
    for (const k of new Set([...Object.keys(ar), ...Object.keys(en)])) {
      // الكشيدة يكتبها الكاتب بنفسه داخل النص — لا حقل «كلمة تُمدّ» في اللوحة
      if (k === 'stretch') continue;
      // قيمة ثابتة موجودة في لغة واحدة (مثل أعلام التعبير النمطي) تسري على اللغتين
      if (INVARIANT.has(k) && !(k in ar && k in en)) { out[k] = ar[k] ?? en[k]; continue; }
      out[k] = k in ar && k in en ? zip(ar[k], en[k], k) : zip(ar[k] ?? blank(en[k]), en[k] ?? blank(ar[k]), k);
    }
    return out;
  }
  if (same(ar, en) && (typeof ar !== 'string' || INVARIANT.has(key))) return ar;
  return { ar, en };
}

/** مراجع الوسائط ← روابط تعمل في اللوحة */
function media(tree) {
  if (isList(tree)) return tree.map(media);
  if (!isMap(tree)) return tree;
  if (tree.type === 'media' && tree.src) {
    const src = tree.src;
    const name = src.split('/').pop();
    const ext = name.split('.').pop();
    return {
      type: 'media',
      url: src.startsWith('/') ? SITE + src : `/site-media/${src}`,
      name,
      kind: ext === 'mp4' ? 'video' : src.startsWith('channels/') ? 'icon' : 'image',
    };
  }
  return Object.fromEntries(Object.entries(tree).map(([k, v]) => [k, media(v)]));
}

const z = (key) => media(zip(scopes[key].ar, scopes[key].en, key));

const pricing = z('pricing');
// الأسعار والدول والخصم السنوي مصدرها «الباقات» في اللوحة — لا تُكرَّر هنا
delete pricing.prices;
delete pricing.defaultCountry;
delete pricing.yearlyDiscount;

const content = {
  home: z('home'),
  features: {
    cards: z('features').items,
    pages: Object.fromEntries(Object.keys(scopes).filter((k) => k.startsWith('feature/')).map((k) => [k.slice(8), z(k)])),
  },
  solutions: z('solutions'),
  faq: z('faq'),
  testimonials: z('testimonials'),
  channels: z('channels'),
  partners: z('partners'),
  stats: z('stats'),
  legal: Object.fromEntries(Object.keys(scopes).filter((k) => k.startsWith('legal/')).map((k) => [k.slice(6), z(k)])),
  pricing,
  site: z('site'),
  seo: z('seo'),
  ui: z('ui'),
  scenes: z('scenes'),
  demos: z('demos'),
};

const out = `/**
 * محتوى الموقع التعريفي كما هو على الموقع — مولَّد، لا تعدّله يدوياً.
 * المصدر: qhub-site (${generated_at})
 * إعادة التوليد: node scripts/import-site-content.mjs <content-seed.json>
 */
import type { SiteContent } from '@/types/siteContent';

export const siteSeed: SiteContent = ${JSON.stringify(content, null, 2)};
`;

writeFileSync(path.join(ROOT, 'src/store/siteContentSeed.ts'), out);
const kb = Math.round(Buffer.byteLength(out) / 1024);
console.log(`${Object.keys(content).length} أقسام · ${Object.keys(content.features.pages).length} صفحات مزايا · ${Object.keys(content.legal).length} مستندات · ${kb}KB`);
