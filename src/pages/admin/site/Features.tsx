import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, Edit2, ExternalLink, History, RotateCcw } from 'lucide-react';
import { Card, useConfirm } from '@components/ui';
import { IconView } from '@components/site/IconPicker';
import { PublishBar } from '@components/site/PublishBar';
import { TranslationBadges } from '@components/site/TranslationBadges';
import { useSiteContentStore, useUnpublished } from '@/store/useSiteContentStore';
import { useUIStore } from '@/store/useUIStore';
import type { FeatureCard } from '@/types/siteContent';

export const SITE_URL = 'https://qhub-lp.apexes.click';

/**
 * صفحات المزايا — القائمة. سبع مزايا مقفلة العدد (روابطها ثابتة على الموقع)،
 * تُرتَّب وتُحرَّر. ترتيبها هنا هو ترتيبها في النافبار والفوتر وسكشن المزايا.
 */
export default function SiteFeatures(): JSX.Element {
  const cards = useSiteContentStore((s) => s.draft.features.cards);
  const pages = useSiteContentStore((s) => s.draft.features.pages);
  const history = useSiteContentStore((s) => s.history);
  const moveCard = useSiteContentStore((s) => s.moveCard);
  const resetToSite = useSiteContentStore((s) => s.resetToSite);
  const showToast = useUIStore((s) => s.showToast);
  const { confirm } = useConfirm();

  return (
    <div className="p-4 lg:p-6 space-y-5 page-fade flex flex-col min-h-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">صفحات المزايا</h2>
          <p className="text-sm text-muted-foreground">
            محتوى صفحات المزايا السبع على الموقع التعريفي باللغتين. الترتيب هنا هو ترتيبها في القائمة والفوتر.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href={`${SITE_URL}/features/`} target="_blank" rel="noreferrer" className="h-10 px-4 rounded-md border border-border text-sm font-medium hover:bg-muted flex items-center gap-2">
            <ExternalLink className="h-4 w-4" /> فتح الموقع
          </a>
          <button
            type="button"
            onClick={async () => {
              const ok = await confirm({
                title: 'إرجاع المحتوى الأصلي للموقع؟',
                message: 'تُحذف كل التعديلات والنشرات في هذا الديمو، ويعود المحتوى كما هو على الموقع اليوم.',
                variant: 'danger',
                confirmText: 'إرجاع',
              });
              if (ok) {
                resetToSite();
                showToast('عاد المحتوى الأصلي', 'success');
              }
            }}
            title="إرجاع المحتوى الأصلي"
            className="h-10 w-10 rounded-md border border-border text-muted-foreground hover:text-destructive flex items-center justify-center"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
        <div className="space-y-3">
          {cards.map((card, i) => (
            <FeatureRow key={card.slug} index={i} total={cards.length} onMove={moveCard} slug={card.slug} entity={{ card, page: pages[card.slug] }} />
          ))}
        </div>

        <Card className="p-4 h-fit">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <History className="h-4 w-4" /> سجلّ النشر
          </h3>
          {history.length === 0 ? (
            <p className="text-xs text-muted-foreground">لا نشرات بعد. المحتوى الحالي هو ما على الموقع اليوم.</p>
          ) : (
            <ul className="space-y-3">
              {history.slice(0, 8).map((p) => (
                <li key={p.version} className="text-xs">
                  <p className="font-semibold">
                    الإصدار {p.version} <span className="font-normal text-muted-foreground">· {p.changes} تغيير</span>
                  </p>
                  <p className="text-muted-foreground">
                    {p.by} · {new Date(p.at).toLocaleString('ar', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                  {p.note && <p className="mt-0.5">{p.note}</p>}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <PublishBar scope="features" />
    </div>
  );
}

function FeatureRow({ slug, index, total, onMove, entity }: { slug: string; index: number; total: number; onMove: (from: number, to: number) => void; entity: { card: FeatureCard; page: unknown } }): JSX.Element {
  const unpublished = useUnpublished('features', slug);
  const { card } = entity;

  return (
    <Card className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col">
        <button type="button" disabled={index === 0} onClick={() => onMove(index, index - 1)} title="لأعلى" className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-30">
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
        <button type="button" disabled={index === total - 1} onClick={() => onMove(index, index + 1)} title="لأسفل" className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-30">
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="h-11 w-11 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        <IconView value={card.icon} className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold">{card.title.ar}</h3>
          <span dir="ltr" className="text-xs text-muted-foreground">{card.title.en}</span>
          {unpublished > 0 && <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-bold text-warning">{unpublished} غير منشور</span>}
        </div>
        <p className="truncate text-xs text-muted-foreground">{card.blurb.ar}</p>
      </div>
      <TranslationBadges entity={entity} className="hidden sm:inline-flex" />
      <code dir="ltr" className="hidden lg:block text-[11px] text-muted-foreground">/features/{slug}</code>
      <Link to={`/site/features/${slug}`} className="h-9 px-4 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium flex items-center gap-1.5">
        <Edit2 className="h-3.5 w-3.5" /> تحرير
      </Link>
    </Card>
  );
}
