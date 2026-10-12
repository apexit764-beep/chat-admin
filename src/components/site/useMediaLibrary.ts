import { useMemo } from 'react';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import type { MediaRef } from '@/types/siteContent';

/** مكان استعمال ملف — ما تعرضه المكتبة تحت «أين يُستخدم» (§7.19) */
export interface MediaUsage {
  path: string;
  label: string;
}

const SCOPE_LABEL: Record<string, string> = {
  home: 'الصفحة الرئيسية',
  features: 'المزايا',
  channels: 'القنوات والشعارات',
  partners: 'الشركاء',
  testimonials: 'آراء العملاء',
  solutions: 'الحلول',
};

/**
 * مكتبة الوسائط = كل ملف يشير إليه المحتوى + ما رفعه الفريق. كل ملف معه
 * أماكن استعماله، فلا يُحذف ملف مستعمل.
 */
export function useMediaLibrary(): { items: MediaRef[]; usage: Map<string, MediaUsage[]> } {
  const draft = useSiteContentStore((s) => s.draft);
  const uploads = useSiteContentStore((s) => s.uploads);

  return useMemo(() => {
    const byUrl = new Map<string, MediaRef>();
    const usage = new Map<string, MediaUsage[]>();

    const walk = (node: unknown, path: string[]): void => {
      if (Array.isArray(node)) return node.forEach((n, i) => walk(n, [...path, String(i)]));
      if (!node || typeof node !== 'object') return;
      const ref = node as MediaRef;
      if (ref.type === 'media' && ref.url) {
        if (!byUrl.has(ref.url)) byUrl.set(ref.url, { ...ref, folder: ref.folder ?? SCOPE_LABEL[path[0]] ?? path[0] });
        const list = usage.get(ref.url) ?? [];
        list.push({ path: path.join('.'), label: describe(path) });
        usage.set(ref.url, list);
        if (ref.poster) walk(ref.poster, [...path, 'poster']);
        return;
      }
      for (const [k, v] of Object.entries(node)) walk(v, [...path, k]);
    };
    walk(draft, []);

    for (const u of uploads) if (!byUrl.has(u.url)) byUrl.set(u.url, u);
    return { items: [...uploads.filter((u) => byUrl.get(u.url) === u), ...[...byUrl.values()].filter((m) => !uploads.includes(m))], usage };
  }, [draft, uploads]);
}

function describe(path: string[]): string {
  const [scope, ...rest] = path;
  const head = SCOPE_LABEL[scope] ?? scope;
  if (scope === 'home' && rest[0] === 'sections') return `${head} · سكشن ${Number(rest[1]) + 1}`;
  if (scope === 'channels' || scope === 'partners') return `${head} · #${Number(rest[1]) + 1}`;
  return head;
}
