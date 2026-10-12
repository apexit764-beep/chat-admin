/**
 * يولّد بيانات «صفحات المزايا» للوحة من محتوى الموقع الحقيقي.
 *
 *   node scripts/import-site-content.mjs ../qhub-site/content-seed/content-seed.json
 *
 * المصدر: ناتج qhub-site/scripts/export-content.mjs — كل نطاق شجرتان كاملتان
 * `{ar: …, en: …}`. اللوحة تحرّر حقلاً حقلاً، فتُضمّ الشجرتان هنا: كل نصّ
 * يصير `{ar, en}` في مكانه. الناتج src/store/siteContentSeed.ts.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const seedPath = process.argv[2];
if (!seedPath) {
  console.error('المسار مطلوب: node scripts/import-site-content.mjs <content-seed.json>');
  process.exit(1);
}

const { scopes, generated_at } = JSON.parse(readFileSync(seedPath, 'utf8'));

/** قيم ثابتة عبر اللغتين بطبيعتها — تبقى بلا {ar, en} حين تتطابق */
const INVARIANT = new Set(['slug', 'kind', 'ch', 'url', 'shot', 'scene', 'route', 'heroShot', 'heroScene', 'heroRoute', 'from']);

const isList = Array.isArray;
const isMap = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isRef = (v) => isMap(v) && ['library', 'upload', 'media'].includes(v.type);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function zip(ar, en, key) {
  if (isList(ar) && isList(en)) {
    if (ar.every((v) => !isMap(v) && !isList(v)) && en.every((v) => !isMap(v) && !isList(v))) {
      return { ar, en };
    }
    if (ar.length !== en.length) throw new Error(`قائمة بطولين مختلفين عند ${key}`);
    return ar.map((a, i) => zip(a, en[i], key));
  }
  if (same(ar, en) && isRef(ar)) return ar;
  if (isMap(ar) && isMap(en)) {
    const out = {};
    for (const k of new Set([...Object.keys(ar), ...Object.keys(en)])) {
      out[k] = k in ar && k in en ? zip(ar[k], en[k], k) : { ar: ar[k] ?? null, en: en[k] ?? null };
    }
    return out;
  }
  if (same(ar, en) && (typeof ar !== 'string' || INVARIANT.has(key))) return ar;
  return { ar, en };
}

const cards = zip(scopes.features.ar.items, scopes.features.en.items, 'features');
const pages = Object.fromEntries(
  Object.keys(scopes)
    .filter((k) => k.startsWith('feature/'))
    .map((k) => [k.slice(8), zip(scopes[k].ar, scopes[k].en, k)]),
);

const out = `/**
 * محتوى صفحات المزايا كما هو على الموقع — مولَّد، لا تعدّله يدوياً.
 * المصدر: qhub-site (${generated_at})
 * إعادة التوليد: node scripts/import-site-content.mjs <content-seed.json>
 */
import type { FeatureCard, FeaturePage } from '@/types/siteContent';

export const featureCardsSeed: FeatureCard[] = ${JSON.stringify(cards, null, 2)};

export const featurePagesSeed: Record<string, FeaturePage> = ${JSON.stringify(pages, null, 2)};
`;

const target = path.resolve(import.meta.dirname, '../src/store/siteContentSeed.ts');
writeFileSync(target, out);
console.log(`${cards.length} بطاقات · ${Object.keys(pages).length} صفحات → ${path.relative(process.cwd(), target)}`);
