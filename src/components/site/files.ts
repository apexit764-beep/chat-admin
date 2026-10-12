import type { MediaKind } from '@/types/siteContent';

/**
 * حدود الرفع لكل نوع (CMS-PROMPT §6.4). في الديمو تُحفظ الملفات في المتصفّح
 * كـdata URL لأنه بلا خادم، فالحدود أصغر من النسخة الحقيقية، والفيديو
 * يُضاف برابطه بدل رفعه.
 */
export const MEDIA_RULES: Record<MediaKind, { types: string[]; ext: string; maxKb: number; warnKb?: number }> = {
  image: { types: ['image/webp', 'image/png', 'image/jpeg', 'image/svg+xml'], ext: 'webp png jpg svg', maxKb: 1024 },
  animated: { types: ['image/gif', 'image/webp'], ext: 'gif webp', maxKb: 2048, warnKb: 1024 },
  icon: { types: ['image/svg+xml', 'image/png'], ext: 'svg png', maxKb: 300 },
  video: { types: ['video/mp4'], ext: 'mp4 (رابط)', maxKb: 0 },
};

export const KIND_LABEL: Record<MediaKind, string> = {
  image: 'صورة',
  animated: 'متحرّكة',
  icon: 'أيقونة / شعار',
  video: 'فيديو',
};

export const formatKb = (kb: number): string => (kb >= 1024 ? `${Math.round(kb / 1024)}MB` : `${kb}KB`);

/**
 * يعقّم SVG مرفوعاً: الـSVG يُعرض على الموقع العام، فملف فيه <script> أو
 * سمات on* أو روابط خارجية ثغرة XSS هناك. يُرجع null لملف ليس SVG أصلاً.
 */
export function sanitizeSvg(source: string): string | null {
  const doc = new DOMParser().parseFromString(source, 'image/svg+xml');
  const svg = doc.documentElement;
  if (svg.nodeName.toLowerCase() !== 'svg' || doc.querySelector('parsererror')) return null;

  doc.querySelectorAll('script, foreignObject').forEach((n) => n.remove());
  doc.querySelectorAll('*').forEach((el) => {
    for (const attr of [...el.attributes]) {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();
      if (name.startsWith('on')) el.removeAttribute(attr.name);
      else if ((name === 'href' || name === 'xlink:href') && !value.startsWith('#') && !value.startsWith('data:image/')) el.removeAttribute(attr.name);
      else if (value.startsWith('javascript:')) el.removeAttribute(attr.name);
    }
  });
  return new XMLSerializer().serializeToString(svg);
}

export type ReadResult = { url: string; name: string; size: number; width?: number; height?: number; warning?: string } | { error: string };

/** قراءة ملف مرفوع لنوع معيّن — مع التحقّق والتعقيم */
export async function readMedia(file: File, kind: MediaKind): Promise<ReadResult> {
  const rules = MEDIA_RULES[kind];
  if (!rules.types.includes(file.type)) {
    return { error: `صيغة الملف غير مقبولة هنا. المقبول: ${rules.ext}` };
  }
  if (file.size > rules.maxKb * 1024) {
    return { error: `حجم الملف ${(file.size / 1024 / 1024).toFixed(1)}MB — الحدّ ${formatKb(rules.maxKb)}.` };
  }

  let url: string;
  if (file.type === 'image/svg+xml') {
    const clean = sanitizeSvg(await file.text());
    if (!clean) return { error: 'الملف ليس SVG صالحاً — صدّره من برنامج التصميم مرة ثانية.' };
    url = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(clean)))}`;
  } else {
    url = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  const size = await imageSize(url);
  const warning = rules.warnKb && file.size > rules.warnKb * 1024 ? `الملف ثقيل (${(file.size / 1024 / 1024).toFixed(1)}MB) — سيبطّئ تحميل الصفحة.` : undefined;
  return { url, name: file.name, size: file.size, ...size, warning };
}

export function imageSize(url: string): Promise<{ width?: number; height?: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({});
    img.src = url;
  });
}

/** توافق مع الاستعمال القديم في ArtSlot/IconPicker */
export async function readImage(
  file: File,
  { maxKb, types }: { maxKb: number; types: string[] }
): Promise<{ url: string; name: string; width?: number; height?: number } | { error: string }> {
  const kind: MediaKind = types.includes('image/gif') ? 'animated' : maxKb <= 300 ? 'icon' : 'image';
  const res = await readMedia(file, kind);
  return res;
}
