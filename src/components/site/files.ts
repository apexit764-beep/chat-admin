/**
 * قراءة صورة مرفوعة في الديمو: تُحفظ في المتصفّح كـdata URL لأن الديمو بلا
 * خادم. في النسخة الحقيقية تذهب لمكتبة الوسائط (ويُعقَّم الـSVG هناك).
 */
export async function readImage(
  file: File,
  { maxKb, types }: { maxKb: number; types: string[] }
): Promise<{ url: string; name: string; width?: number; height?: number } | { error: string }> {
  if (!types.includes(file.type)) {
    return { error: `صيغة الملف غير مقبولة هنا. المقبول: ${types.map((t) => t.split('/')[1].replace('+xml', '')).join(' · ')}` };
  }
  if (file.size > maxKb * 1024) {
    return { error: `حجم الملف ${(file.size / 1024 / 1024).toFixed(1)}MB — الحدّ في الديمو ${maxKb >= 1024 ? `${maxKb / 1024}MB` : `${maxKb}KB`}.` };
  }

  const url = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const size = await new Promise<{ width?: number; height?: number }>((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({});
    img.src = url;
  });

  return { url, name: file.name, ...size };
}
