import { create } from 'zustand';
import type { FeatureCard, FeaturePage, MediaRef, Publication, SiteContent, SiteScope } from '@/types/siteContent';
import { siteSeed } from './siteContentSeed';
import { diff } from '@/utils/siteContent';

/**
 * محتوى الموقع التعريفي (CMS-PROMPT §6.7، §7.22).
 *
 * نسختان: **المسودّة** (ما يحرّره الفريق، تُحفظ تلقائياً) و**المنشور** (ما
 * يراه زوّار الموقع). التحرير لا يمسّ الموقع؛ «نشر» وحده ينقل المسودّة.
 *
 * كل نشرة تحفظ الأقسام التي غيّرتها فقط، فالاستعادة تبني أي إصدار سابق
 * من البذرة + لقطات الأقسام حتى ذلك الإصدار — دون أن تمتلئ ذاكرة المتصفّح.
 *
 * في الديمو يُحفظ كل هذا في المتصفّح (localStorage). في النسخة الحقيقية في
 * قاعدة البيانات، والموقع يقرأ المنشور من الـAPI.
 */

const KEY = 'qhub_site_content_v2';

export const SCOPES = Object.keys(siteSeed) as SiteScope[];

const seed = (): SiteContent => structuredClone(siteSeed);

interface StoredPublication extends Publication {
  /** الأقسام التي غيّرتها النشرة، بمحتواها بعد النشر */
  contents: Partial<SiteContent>;
}

interface Persisted {
  draft: SiteContent;
  published: SiteContent;
  history: StoredPublication[];
  /** ملفات رفعها الفريق إلى مكتبة الوسائط */
  uploads: MediaRef[];
}

function read(): Persisted {
  const fresh = (): Persisted => ({ draft: seed(), published: seed(), history: [], uploads: [] });
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
    localStorage.setItem(KEY, JSON.stringify({ draft: state.draft, published: state.published, history: state.history, uploads: state.uploads }));
    return true;
  } catch {
    // امتلأت مساحة المتصفّح — غالباً صور كبيرة مرفوعة
    return false;
  }
}

/** الأقسام التي تختلف بين نسختين */
export function changedScopes(a: SiteContent, b: SiteContent): SiteScope[] {
  return SCOPES.filter((s) => JSON.stringify(a[s]) !== JSON.stringify(b[s]));
}

interface SiteContentState extends Persisted {
  storageFull: boolean;

  /** يستبدل قسماً كاملاً في المسودّة */
  set: <K extends SiteScope>(scope: K, value: SiteContent[K]) => void;
  updateCard: (slug: string, patch: Partial<FeatureCard>) => void;
  moveCard: (from: number, to: number) => void;
  updatePage: (slug: string, page: FeaturePage) => void;

  /** تجاهل تغييرات قسم واحد، أو كل التغييرات */
  discard: (scope?: SiteScope) => void;
  publish: (note: string, by: string, only?: SiteScope[]) => Publication;
  /** نشرة جديدة بمحتوى إصدار سابق — التاريخ لا يُحذف */
  restore: (version: number, by: string) => Publication;
  /** المحتوى كما كان عند إصدار معيّن */
  contentAt: (version: number) => SiteContent;

  addUpload: (media: MediaRef) => void;
  updateUpload: (url: string, patch: Partial<MediaRef>) => void;
  removeUpload: (url: string) => void;

  approveLegal: (doc: string, by: string) => void;

  /** إرجاع كل شيء لمحتوى الموقع الأصلي */
  resetToSite: () => void;
}

const initial = read();

export const useSiteContentStore = create<SiteContentState>((set, get) => {
  const save = (patch: Partial<Persisted>): void => {
    set(patch);
    set({ storageFull: !persist(get()) });
  };

  const setScope = <K extends SiteScope>(scope: K, value: SiteContent[K]): void =>
    save({ draft: { ...get().draft, [scope]: value } });

  const publishContent = (next: SiteContent, note: string, by: string, scopes: SiteScope[]): Publication => {
    const { published, history } = get();
    const contents: Partial<SiteContent> = {};
    for (const s of scopes) (contents as Record<string, unknown>)[s] = structuredClone(next[s]);
    const publication: StoredPublication = {
      version: (history[0]?.version ?? 0) + 1,
      at: new Date().toISOString(),
      by,
      note,
      changes: diff(Object.fromEntries(scopes.map((s) => [s, published[s]])), Object.fromEntries(scopes.map((s) => [s, next[s]]))).length,
      scopes,
      contents,
    };
    const merged = { ...published, ...structuredClone(contents) } as SiteContent;
    save({ published: merged, history: [publication, ...history] });
    return publication;
  };

  return {
    ...initial,
    storageFull: false,

    set: setScope,

    updateCard: (slug, patch) =>
      setScope('features', { ...get().draft.features, cards: get().draft.features.cards.map((c) => (c.slug === slug ? { ...c, ...patch } : c)) }),

    moveCard: (from, to) => {
      const cards = [...get().draft.features.cards];
      const [moved] = cards.splice(from, 1);
      cards.splice(to, 0, moved);
      setScope('features', { ...get().draft.features, cards });
    },

    updatePage: (slug, page) => setScope('features', { ...get().draft.features, pages: { ...get().draft.features.pages, [slug]: page } }),

    discard: (scope) => {
      const { draft, published } = get();
      if (!scope) return save({ draft: structuredClone(published) });
      save({ draft: { ...draft, [scope]: structuredClone(published[scope]) } });
    },

    publish: (note, by, only) => {
      const { draft, published } = get();
      const scopes = (only ?? changedScopes(published, draft)).filter((s) => JSON.stringify(published[s]) !== JSON.stringify(draft[s]));
      return publishContent(draft, note, by, scopes);
    },

    contentAt: (version) => {
      const content = seed();
      // الأقدم أولاً: كل نشرة تكتب فوق ما قبلها الأقسام التي غيّرتها
      for (const p of [...get().history].reverse()) {
        if (p.version > version) break;
        Object.assign(content, structuredClone(p.contents));
      }
      return content;
    },

    restore: (version, by) => {
      const target = get().contentAt(version);
      const scopes = changedScopes(get().published, target);
      const p = publishContent(target, `استعادة الإصدار ${version}`, by, scopes);
      // المسودّة تتبع المنشور المستعاد في أقسامه فقط — مسودّات الأقسام الأخرى تبقى
      save({ draft: { ...get().draft, ...structuredClone(Object.fromEntries(scopes.map((s) => [s, target[s]]))) } });
      return p;
    },

    addUpload: (media) => save({ uploads: [media, ...get().uploads] }),
    updateUpload: (url, patch) => save({ uploads: get().uploads.map((m) => (m.url === url ? { ...m, ...patch } : m)) }),
    removeUpload: (url) => save({ uploads: get().uploads.filter((m) => m.url !== url) }),

    approveLegal: (doc, by) => {
      const legal = get().draft.legal;
      setScope('legal', { ...legal, [doc]: { ...legal[doc], approvedAt: new Date().toISOString(), approvedBy: by } });
    },

    resetToSite: () => save({ draft: seed(), published: seed(), history: [], uploads: [] }),
  };
});

/** عدد التغييرات غير المنشورة — في قسم أو في صفحة ميزة أو في الكل */
export function useUnpublished(scope?: SiteScope, slug?: string): number {
  return useSiteContentStore((s) => {
    if (scope === 'features' && slug) {
      const before = { card: s.published.features.cards.find((c) => c.slug === slug), page: s.published.features.pages[slug] };
      const after = { card: s.draft.features.cards.find((c) => c.slug === slug), page: s.draft.features.pages[slug] };
      return diff(before, after).length;
    }
    if (scope) return diff(s.published[scope], s.draft[scope]).length;
    return diff(s.published, s.draft).length;
  });
}
