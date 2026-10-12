import { ComponentType } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { HOME_SCHEMAS, SECTION_HINT, SECTION_LABEL } from '@components/site/homeSchemas';
import { AutoFields, SchemaForm } from '@components/site/SchemaForm';
import { SiteEmbed, SitePage } from '@components/site/SitePage';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import type { SiteScope, Tree } from '@/types/siteContent';
import SiteChannels from './Channels';
import SitePartners from './Partners';
import SiteStats from './Stats';
import SiteTestimonials from './Testimonials';

/**
 * المحتوى الذي يعرضه سكشن يُحرَّر داخل السكشن نفسه: الآراء تحت سكشن الآراء،
 * الأرقام تحت «بالأرقام»، الشركاء تحت الشريط، ومكتبة القنوات تحت «القنوات
 * والربط» — والنشر من شريط واحد للقسمين.
 */
const EMBEDDED: Record<string, { scope: SiteScope; title: string; Screen: ComponentType }> = {
  testimonials: { scope: 'testimonials', title: 'الشهادات', Screen: SiteTestimonials },
  stats: { scope: 'stats', title: 'قيم الأرقام', Screen: SiteStats },
  partners_marquee: { scope: 'partners', title: 'شعارات الشركاء', Screen: SitePartners },
  integrations: { scope: 'channels', title: 'مكتبة شعارات القنوات', Screen: SiteChannels },
};

/** محرّر سكشن واحد من الرئيسية — حقوله من مخطّطه في homeSchemas */
export default function SiteHomeSection(): JSX.Element {
  const { key = '' } = useParams();
  const sections = useSiteContentStore((s) => s.draft.home.sections);
  const set = useSiteContentStore((s) => s.set);
  const index = sections.findIndex((s) => s.key === key);
  if (index < 0) return <Navigate to="/site/home" replace />;

  const section = sections[index];
  const schema = HOME_SCHEMAS[key];
  const embedded = EMBEDDED[key];
  const update = (patch: Partial<typeof section>): void => set('home', { sections: sections.map((s, i) => (i === index ? { ...s, ...patch } : s)) });

  return (
    <SitePage
      back="/site/home"
      title={SECTION_LABEL[key] ?? key}
      lede={SECTION_HINT[key] ?? 'سكشن من الصفحة الرئيسية.'}
      scope={embedded ? ['home', embedded.scope] : 'home'}
      badges={section.data}
      actions={
        <label className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
          <Switch checked={section.enabled} onCheckedChange={(enabled) => update({ enabled })} />
          {section.enabled ? 'ظاهر على الموقع' : <span className="flex items-center gap-1 text-muted-foreground"><EyeOff className="h-3.5 w-3.5" /> مخفي</span>}
        </label>
      }
    >
      <Card className="p-5">
        {schema ? (
          <SchemaForm fields={schema} value={section.data} onChange={(data: Tree) => update({ data })} />
        ) : (
          <AutoFields value={section.data} onChange={(data) => update({ data: data as Tree })} />
        )}
      </Card>
      {embedded && (
        <SiteEmbed title={embedded.title}>
          <embedded.Screen />
        </SiteEmbed>
      )}
    </SitePage>
  );
}
