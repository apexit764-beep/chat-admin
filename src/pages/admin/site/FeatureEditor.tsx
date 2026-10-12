import { ReactNode, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, ExternalLink, Lock } from 'lucide-react';
import { Card } from '@components/ui';
import { Button } from '@/components/ui/button';
import { ArtSlot } from '@components/site/ArtSlot';
import { DualField, LIMITS } from '@components/site/DualField';
import { IconPicker, IconView } from '@components/site/IconPicker';
import { ListEditor } from '@components/site/ListEditor';
import { PublishBar } from '@components/site/PublishBar';
import { AutoFields } from '@components/site/SchemaForm';
import { TitleField } from '@components/site/TitleField';
import { TranslationBadges } from '@components/site/TranslationBadges';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import type { Dual, FeaturePage, StepArt } from '@/types/siteContent';
import { cn } from '@/lib/utils';
import { missingTranslations } from '@/utils/siteContent';
import { SITE_URL } from './Features';

const empty = (): Dual => ({ ar: '', en: '' });

const TABS = [
  { key: 'card', label: 'البطاقة' },
  { key: 'hero', label: 'الهيرو' },
  { key: 'compare', label: 'المقارنة' },
  { key: 'journey', label: 'الرحلة' },
  { key: 'benefits', label: 'الفوائد' },
  { key: 'details', label: 'التفاصيل' },
  { key: 'live', label: 'العرض الحيّ' },
  { key: 'faq', label: 'الأسئلة' },
] as const;
type Tab = (typeof TABS)[number]['key'];

/**
 * محرّر صفحة ميزة واحدة — تبويب لكل سكشن بترتيبه على الصفحة.
 * كل تعديل يُحفظ مسودّةً فوراً، والموقع لا يتغيّر إلا بالنشر.
 */
export default function SiteFeatureEditor(): JSX.Element {
  const { slug = '' } = useParams();
  const card = useSiteContentStore((s) => s.draft.features.cards.find((c) => c.slug === slug));
  const page = useSiteContentStore((s) => s.draft.features.pages[slug]);
  const updateCard = useSiteContentStore((s) => s.updateCard);
  const updatePage = useSiteContentStore((s) => s.updatePage);
  const [tab, setTab] = useState<Tab>('hero');

  if (!card || !page) return <Navigate to="/site/features" replace />;

  const set = <K extends keyof FeaturePage>(key: K, value: FeaturePage[K]): void => updatePage(slug, { ...page, [key]: value });

  const sections: Record<Tab, unknown> = {
    card,
    hero: { eyebrow: page.eyebrow, h1: page.h1, lede: page.lede, bullets: page.bullets, heroOverride: page.heroOverride },
    compare: page.compare,
    journey: page.journey,
    benefits: { extras: page.extras, benefits: page.benefits },
    details: page.details,
    live: { liveTitle: page.liveTitle },
    faq: page.faq,
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 page-fade flex flex-col min-h-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/site/features" aria-label="رجوع لصفحات المزايا">
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <span className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <IconView value={card.icon} className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-2xl font-bold">{card.title.ar}</h2>
            <p dir="ltr" className="text-sm text-muted-foreground text-end">{card.title.en}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground" title="الرابط ثابت في اللغتين">
            <Lock className="h-3.5 w-3.5" />
            <code dir="ltr">/features/{slug}</code>
          </span>
          <a href={`${SITE_URL}/features/${slug}/`} target="_blank" rel="noreferrer" className="h-10 px-4 rounded-md border border-border text-sm font-medium hover:bg-muted flex items-center gap-2">
            <ExternalLink className="h-4 w-4" /> الصفحة على الموقع
          </a>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto overflow-y-hidden border-b border-border">
        {TABS.filter((t) => sections[t.key] !== undefined).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              '-mb-px flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors',
              tab === t.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-current'
            )}
          >
            {t.label}
            <MissingDot entity={sections[t.key]} />
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-5 max-w-5xl w-full">
        {tab === 'card' && (
          <Panel title="بطاقة الميزة" lede="تظهر في قائمة «المزايا» المنسدلة في النافبار، وفي الفوتر، وفي سكشن المزايا بالرئيسية.">
            <DualField label="اسم الميزة" value={card.title} onChange={(title) => updateCard(slug, { title })} limit={40} />
            <DualField label="الوصف المختصر" value={card.blurb} onChange={(blurb) => updateCard(slug, { blurb })} limit={70} />
            <IconPicker value={card.icon} onChange={(icon) => updateCard(slug, { icon })} />
            <ArtSlot label="رسمة البطاقة في الرئيسية" override={card.cardArt} onChange={(cardArt) => updateCard(slug, { cardArt })} sceneLabel={`card/${slug}`} />
          </Panel>
        )}

        {tab === 'hero' && (
          <Panel title="الهيرو" lede="أعلى الصفحة: الشارة، العنوان، الوصف، والنقاط الثلاث.">
            <DualField label="الشارة (eyebrow)" value={page.eyebrow} onChange={(v) => set('eyebrow', v)} limit={40} />
            <TitleField label="العنوان" title={page.h1} highlight={page.highlight} onChange={({ title, highlight }) => updatePage(slug, { ...page, h1: title, highlight })} />
            <DualField label="الوصف" type="textarea" value={page.lede} onChange={(v) => set('lede', v)} limit={LIMITS.description} />
            {page.bullets && <DualField label="النقاط تحت الوصف" type="list" value={page.bullets} onChange={(v) => set('bullets', v)} hint="ثلاث نقاط تكفي — أكثر منها يزحم الهيرو." />}
            <ArtSlot label="رسمة الهيرو" override={page.heroOverride} onChange={(v) => set('heroOverride', v)} sceneLabel={page.heroScene ?? page.heroShot} ratio={16 / 10} suggestedSize="1440×900" />
          </Panel>
        )}

        {tab === 'compare' && page.compare && (
          <Panel title="المقارنة: بدون Qhub / مع Qhub" lede="صفوف متقابلة — كل صفّ يقول المشكلة وحلّها في السطر نفسه.">
            <DualField label="الشارة" value={page.compare.eyebrow} onChange={(eyebrow) => set('compare', { ...page.compare!, eyebrow })} />
            <DualField label="العنوان" value={page.compare.title} onChange={(title) => set('compare', { ...page.compare!, title })} limit={LIMITS.title} isTitle />
            <div className="grid gap-4 md:grid-cols-2">
              <DualField label="تسمية عمود «بدون»" value={page.compare.withoutLabel} onChange={(withoutLabel) => set('compare', { ...page.compare!, withoutLabel })} />
              <DualField label="تسمية عمود «مع»" value={page.compare.withLabel} onChange={(withLabel) => set('compare', { ...page.compare!, withLabel })} />
            </div>
            <ListEditor
              items={page.compare.rows}
              onChange={(rows) => set('compare', { ...page.compare!, rows })}
              min={3}
              max={7}
              createItem={() => ({ without: empty(), with: empty() })}
              addLabel="إضافة صفّ"
              getTitle={(r) => (
                <span className="flex items-center gap-2 font-normal">
                  <span className="text-destructive">✗</span> {r.without.ar} <span className="text-muted-foreground">←</span> <span className="text-success">✓</span> {r.with.ar}
                </span>
              )}
              getMeta={(r) => <TranslationBadges entity={r} />}
              renderItem={(r, update) => (
                <div className="grid gap-4 md:grid-cols-2">
                  <DualField label="بدون Qhub" type="textarea" value={r.without} onChange={(without) => update({ ...r, without })} />
                  <DualField label="مع Qhub" type="textarea" value={r.with} onChange={(w) => update({ ...r, with: w })} />
                </div>
              )}
            />
          </Panel>
        )}

        {tab === 'journey' && page.journey && (
          <Panel title="الرحلة" lede="خطوات تشرح الميزة من البداية للنهاية، ولكل خطوة رسمتها.">
            <DualField label="الشارة" value={page.journey.eyebrow} onChange={(eyebrow) => set('journey', { ...page.journey!, eyebrow })} />
            <DualField label="العنوان" value={page.journey.title} onChange={(title) => set('journey', { ...page.journey!, title })} limit={LIMITS.title} isTitle />
            <DualField label="الوصف" type="textarea" value={page.journey.lede} onChange={(lede) => set('journey', { ...page.journey!, lede })} limit={LIMITS.description} />
            <ListEditor
              items={page.journey.steps}
              onChange={(steps) => set('journey', { ...page.journey!, steps })}
              locked
              getTitle={(s) => s.title.ar}
              getMeta={(s) => (
                <>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{s.artOverride ? (s.artOverride.kind === 'gif' ? 'GIF' : 'صورة') : 'مبنية'}</span>
                  <TranslationBadges entity={s} />
                </>
              )}
              renderItem={(s, update) => (
                <>
                  <DualField label="عنوان الخطوة" value={s.title} onChange={(title) => update({ ...s, title })} limit={LIMITS.title} />
                  <DualField label="نصّ الخطوة" type="textarea" value={s.body} onChange={(body) => update({ ...s, body })} limit={LIMITS.description} />
                  <ArtSlot
                    label="رسمة الخطوة"
                    override={s.artOverride}
                    onChange={(artOverride) => update({ ...s, artOverride })}
                    sceneLabel={s.art.kind}
                    sceneEditor={
                      <div className="space-y-3 rounded-xl border border-border p-4">
                        <p className="text-sm font-semibold">
                          نصوص الرسمة <span className="font-normal text-muted-foreground">· البنية مقفلة، النصوص فقط تُحرَّر</span>
                        </p>
                        <AutoFields value={s.art} onChange={(art) => update({ ...s, art: art as StepArt })} />
                      </div>
                    }
                  />
                </>
              )}
            />
          </Panel>
        )}

        {tab === 'benefits' && (
          <Panel title="الفوائد" lede="شبكة البطاقات الصغيرة — أيقونة وعنوان ونص لكل فائدة.">
            {page.extras && (
              <div className="grid gap-4 md:grid-cols-2">
                <DualField label="شارة الشبكة" value={page.extras.eyebrow} onChange={(eyebrow) => set('extras', { ...page.extras!, eyebrow })} />
                <DualField label="عنوان الشبكة" value={page.extras.title} onChange={(title) => set('extras', { ...page.extras!, title })} limit={LIMITS.title} isTitle />
              </div>
            )}
            <ListEditor
              items={page.benefits}
              onChange={(v) => set('benefits', v)}
              min={4}
              max={6}
              createItem={() => ({ icon: { type: 'library' as const, set: 'qhub' as const, name: 'sparkles' }, title: empty(), body: empty() })}
              addLabel="إضافة فائدة"
              getTitle={(b) => (
                <span className="flex items-center gap-2">
                  <IconView value={b.icon} className="h-4 w-4 text-primary" />
                  {b.title.ar}
                </span>
              )}
              getMeta={(b) => <TranslationBadges entity={b} />}
              renderItem={(b, update) => (
                <>
                  <IconPicker value={b.icon} onChange={(icon) => update({ ...b, icon })} />
                  <DualField label="العنوان" value={b.title} onChange={(title) => update({ ...b, title })} limit={40} />
                  <DualField label="النص" type="textarea" value={b.body} onChange={(body) => update({ ...b, body })} limit={LIMITS.description} />
                </>
              )}
            />
          </Panel>
        )}

        {tab === 'details' && (
          <Panel title="التفاصيل" lede="صفّان: عنوان ونص ونقاط، بجانبهما رسمة أو لقطة من النظام.">
            <ListEditor
              items={page.details}
              onChange={(v) => set('details', v)}
              locked
              getTitle={(d) => d.title.ar}
              getMeta={(d) => <TranslationBadges entity={d} />}
              renderItem={(d, update) => (
                <>
                  <DualField label="العنوان" value={d.title} onChange={(title) => update({ ...d, title })} limit={LIMITS.title} />
                  <DualField label="النص" type="textarea" value={d.body} onChange={(body) => update({ ...d, body })} limit={LIMITS.description} />
                  <DualField label="النقاط" type="list" value={d.points} onChange={(points) => update({ ...d, points })} />
                  <ArtSlot label="رسمة الصفّ" override={d.artOverride} onChange={(artOverride) => update({ ...d, artOverride })} sceneLabel={d.scene ?? `لقطة: ${d.shot}`} />
                </>
              )}
            />
          </Panel>
        )}

        {tab === 'live' && (
          <Panel title="العرض الحيّ" lede="عنوان سكشن التجربة التفاعلية. فارغ = العنوان العام «شاشة حقيقية من داخل Qhub».">
            <TitleField
              label="العنوان"
              title={page.liveTitle ?? empty()}
              highlight={page.liveHighlight ?? { ar: [], en: [] }}
              onChange={({ title, highlight }) => updatePage(slug, { ...page, liveTitle: title, liveHighlight: highlight })}
            />
          </Panel>
        )}

        {tab === 'faq' && (
          <Panel title="الأسئلة" lede="أسئلة خاصة بهذه الميزة — تظهر في صفحتها، وتُجمع أيضاً في صفحة الأسئلة الشائعة.">
            <ListEditor
              items={page.faq}
              onChange={(v) => set('faq', v)}
              createItem={() => ({ q: empty(), a: empty() })}
              addLabel="إضافة سؤال"
              getTitle={(f) => f.q.ar}
              getMeta={(f) => <TranslationBadges entity={f} />}
              renderItem={(f, update) => (
                <>
                  <DualField label="السؤال" value={f.q} onChange={(q) => update({ ...f, q })} limit={90} />
                  <DualField label="الجواب" type="textarea" value={f.a} onChange={(a) => update({ ...f, a })} limit={320} />
                </>
              )}
            />
          </Panel>
        )}
      </div>

      <PublishBar scope="features" />
    </div>
  );
}

function Panel({ title, lede, children }: { title: string; lede: string; children: ReactNode }): JSX.Element {
  return (
    <Card className="p-5 space-y-5">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{lede}</p>
      </div>
      {children}
    </Card>
  );
}

/** نقطة صفراء على التبويب الذي فيه ترجمة ناقصة */
function MissingDot({ entity }: { entity: unknown }): JSX.Element | null {
  const m = missingTranslations(entity);
  const n = m.ar + m.en;
  return n > 0 ? <span className="h-1.5 w-1.5 rounded-full bg-warning" title={`${n} حقول ناقصة`} /> : null;
}
