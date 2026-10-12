import { create } from 'zustand';
import type { FeatureCard, FeaturePage, FeaturesContent, Publication } from '@/types/siteContent';
import { featureCardsSeed, featurePagesSeed } from './siteContentSeed';
import { diff } from '@/utils/siteContent';

/**
 * محتوى الموقع — صفحات المزايا.
 *
 * نسختان: **المسودّة** (ما يحرّره الفريق، تُحفظ تلقائياً) و**المنشور**
 * (ما يراه زوّار الموقع). التحرير لا يمسّ الموقع؛ «نشر» وحده ينقل المسودّة.
 *
 * في الديمو تُحفظ النسختان في المتصفّح (localStorage). في النسخة الحقيقية
 * تُحفظ في قاعدة البيانات، والموقع يقرأ المنشور من الـAPI.
 */

const KEY = 'qhub_site_content_v1';

const seed = (): FeaturesContent => ({
  cards: structuredClone(featureCardsSeed),
  pages: structuredClone(featurePagesSeed),
});

interface Persisted {
  draft: FeaturesContent;
  published: FeaturesContent;
  history: Publication[];
}

function read(): Persisted {
  const fresh = (): Persisted => ({ draft: seed(), published: seed(), history: [] });
  if (typeof window === 'undefined') return fresh();
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...fresh(), ...JSON.parse(raw) } : fresh();
  } catch {
    return fresh();
  }
}

function persist(state: Persisted): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify({ draft: state.draft, published: state.published, history: state.history }));
    return true;
  } catch {
    // امتلأت مساحة المتصفّح — غالباً صور كبيرة مرفوعة
    return false;
  }
}

interface SiteContentState extends Persisted {
  /** آخر حفظ فشل لامتلاء المساحة */
  storageFull: boolean;

  updateCard: (slug: string, patch: Partial<FeatureCard>) => void;
  moveCard: (from: number, to: number) => void;
  updatePage: (slug: string, page: FeaturePage) => void;

  /** تجاهل تغييرات صفحة واحدة، أو كل التغييرات */
  discard: (slug?: string) => void;
  publish: (note: string, by: string) => Publication;
  /** إرجاع كل شيء لمحتوى الموقع الأصلي */
  resetToSite: () => void;
}

const initial = read();

export const useSiteContentStore = create<SiteContentState>((set, get) => {
  const save = (patch: Partial<Persisted>): void => {
    set(patch);
    set({ storageFull: !persist(get()) });
  };

  return {
    ...initial,
    storageFull: false,

    updateCard: (slug, patch) =>
      save({ draft: { ...get().draft, cards: get().draft.cards.map((c) => (c.slug === slug ? { ...c, ...patch } : c)) } }),

    moveCard: (from, to) => {
      const cards = [...get().draft.cards];
      const [moved] = cards.splice(from, 1);
      cards.splice(to, 0, moved);
      save({ draft: { ...get().draft, cards } });
    },

    updatePage: (slug, page) => save({ draft: { ...get().draft, pages: { ...get().draft.pages, [slug]: page } } }),

    discard: (slug) => {
      const { draft, published } = get();
      if (!slug) return save({ draft: structuredClone(published) });
      save({
        draft: {
          cards: draft.cards.map((c) => (c.slug === slug ? structuredClone(published.cards.find((p) => p.slug === slug) ?? c) : c)),
          pages: { ...draft.pages, [slug]: structuredClone(published.pages[slug]) },
        },
      });
    },

    publish: (note, by) => {
      const { draft, published, history } = get();
      const publication: Publication = {
        version: (history[0]?.version ?? 0) + 1,
        at: new Date().toISOString(),
        by,
        note,
        changes: diff(published, draft).length,
      };
      save({ published: structuredClone(draft), history: [publication, ...history] });
      return publication;
    },

    resetToSite: () => save({ draft: seed(), published: seed(), history: [] }),
  };
});

/** هل في الصفحة (أو في الكل) تغييرات لم تُنشر؟ */
export function useUnpublished(slug?: string): number {
  return useSiteContentStore((s) => {
    if (!slug) return diff(s.published, s.draft).length;
    const before = { card: s.published.cards.find((c) => c.slug === slug), page: s.published.pages[slug] };
    const after = { card: s.draft.cards.find((c) => c.slug === slug), page: s.draft.pages[slug] };
    return diff(before, after).length;
  });
}
