import { Link } from 'react-router-dom';
import { Edit2, ExternalLink, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { SECTION_HINT, SECTION_LABEL } from '@components/site/homeSchemas';
import { ListEditor } from '@components/site/ListEditor';
import { SitePage } from '@components/site/SitePage';
import { TranslationBadges } from '@components/site/TranslationBadges';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import type { HomeSection } from '@/types/siteContent';
import { SITE_URL } from './Features';

/**
 * الصفحة الرئيسية (CMS-PROMPT §7.2): السكاشن بترتيبها (سحب لإعادة الترتيب)
 * ومفتاح إظهار لكل واحد. السكشن المخفي يبقى محتواه محفوظاً — الإظهار يعيده
 * كما كان.
 */
export default function SiteHome(): JSX.Element {
  const sections = useSiteContentStore((s) => s.draft.home.sections);
  const set = useSiteContentStore((s) => s.set);
  const update = (next: HomeSection[]): void => set('home', { sections: next });

  return (
    <SitePage
      title="الصفحة الرئيسية"
      lede="ترتيب السكاشن وإظهارها، وتحرير محتوى كل سكشن. الترتيب هنا هو ترتيبها على الموقع."
      scope="home"
      badges={sections}
      actions={
        <Button variant="outline" asChild>
          <a href={`${SITE_URL}/`} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4 me-1" /> الرئيسية على الموقع
          </a>
        </Button>
      }
    >
      <Card className="p-4">
        <ListEditor<HomeSection>
          items={sections}
          onChange={update}
          locked
          lockedNote="السكاشن ثابتة في تصميم الموقع — تُرتَّب وتُخفى وتُحرَّر، ولا تُضاف."
          getTitle={(s) => (
            <span className="flex items-center gap-2">
              {SECTION_LABEL[s.key] ?? s.key}
              {!s.enabled && (
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  <EyeOff className="h-3 w-3" /> مخفي
                </span>
              )}
            </span>
          )}
          getMeta={(s, i) => (
            <>
              <TranslationBadges entity={s.data} className="hidden sm:inline-flex" />
              <Switch
                checked={s.enabled}
                onCheckedChange={(enabled) => update(sections.map((x, j) => (j === i ? { ...x, enabled } : x)))}
                aria-label={s.enabled ? 'إخفاء السكشن' : 'إظهار السكشن'}
                title={s.enabled ? 'ظاهر — اضغط للإخفاء' : 'مخفي — اضغط للإظهار'}
              />
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/site/home/${s.key}`}>
                  <Edit2 className="h-3.5 w-3.5 me-1" /> تحرير
                </Link>
              </Button>
            </>
          )}
          renderItem={(s) => (
            <div className="flex items-center justify-between gap-3 text-sm">
              <p className="text-muted-foreground">{SECTION_HINT[s.key] ?? 'افتح المحرّر لتعديل نصوص السكشن وأيقوناته ووسائطه.'}</p>
              <Button size="sm" asChild>
                <Link to={`/site/home/${s.key}`}>فتح المحرّر</Link>
              </Button>
            </div>
          )}
        />
      </Card>
    </SitePage>
  );
}
