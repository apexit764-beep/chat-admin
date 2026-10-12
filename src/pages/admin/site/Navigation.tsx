import { Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { DualField } from '@components/site/DualField';
import { ListEditor } from '@components/site/ListEditor';
import { SitePage } from '@components/site/SitePage';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import type { Dual, Tree } from '@/types/siteContent';

interface NavItem { label: Dual; href: string; children?: unknown[]; hidden?: boolean }
interface FooterGroup { title: Dual; links: { label: Dual; href: string }[] }

/** صفحات الموقع التي يشير إليها رابط — المسار يُختار ولا يُكتب (§7.15) */
const PAGES = ['/', '/features', '/solutions', '/pricing', '/faq', '/contact', '/legal/privacy', '/legal/terms', '/legal/sla'];

/**
 * القائمة والفوتر (CMS-PROMPT §7.15): النافبار (التسمية باللغتين، الترتيب،
 * الظهور — المسار مقفل ويُختار من صفحات الموقع، والمزايا تُسحب تلقائياً)
 * ومجموعات الفوتر الثلاث بروابطها، مع معاينة مصغّرة.
 */
export default function SiteNavigation(): JSX.Element {
  const site = useSiteContentStore((s) => s.draft.site);
  const features = useSiteContentStore((s) => s.draft.features.cards);
  const set = useSiteContentStore((s) => s.set);
  const nav = (site.nav as NavItem[]) ?? [];
  const footer = (site.footer as Tree) ?? {};
  const groups = (footer.groups as FooterGroup[]) ?? [];
  const navbar = (site.navbar as Record<string, Dual>) ?? {};

  const setSite = (patch: Tree): void => set('site', { ...site, ...patch });

  return (
    <SitePage title="القائمة والفوتر" lede="روابط النافبار ومجموعات الفوتر. المسارات تُختار من صفحات الموقع، والمزايا تُضاف تلقائياً من شاشة «المزايا»." scope="site" badges={{ nav, groups }}>
      {/* المعاينة المصغّرة */}
      <Card className="p-4">
        <p className="mb-2 text-xs font-semibold text-muted-foreground">معاينة النافبار</p>
        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border px-4 py-3 text-sm">
          <span className="font-extrabold text-primary">Qhub</span>
          {nav.filter((n) => !n.hidden).map((n) => <span key={n.href}>{n.label.ar}{n.children ? ' ▾' : ''}</span>)}
          <span className="ms-auto text-muted-foreground">{navbar.login?.ar}</span>
          <span className="rounded-md bg-primary px-3 py-1 text-primary-foreground">{navbar.start?.ar}</span>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">النافبار</h3>
          <ListEditor<NavItem>
            items={nav}
            onChange={(next) => setSite({ nav: next })}
            locked
            lockedNote="روابط النافبار مرتبطة بصفحات الموقع — تُرتَّب وتُخفى وتُعاد تسميتها."
            getTitle={(n) => (
              <span className="flex items-center gap-2">
                {n.label.ar}
                <code dir="ltr" className="text-[11px] font-normal text-muted-foreground">{n.href}</code>
              </span>
            )}
            getMeta={(n, i) => <Switch checked={!n.hidden} onCheckedChange={(v) => setSite({ nav: nav.map((x, j) => (j === i ? { ...x, hidden: !v || undefined } : x)) })} aria-label="ظاهر" />}
            renderItem={(n, upd) => (
              <>
                <DualField label="التسمية" value={n.label} onChange={(label) => upd({ ...n, label })} limit={20} />
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="h-3.5 w-3.5" /> المسار <code dir="ltr">{n.href}</code> ثابت.</p>
                {n.children && <p className="text-xs text-muted-foreground">القائمة المنسدلة: المزايا السبع ({features.map((f) => f.title.ar).join('، ')}) — من شاشة «المزايا».</p>}
              </>
            )}
          />
          <div className="space-y-4 border-t border-border pt-4">
            <h4 className="text-sm font-semibold">أزرار النافبار</h4>
            {(['login', 'start', 'menu', 'home'] as const).map((k) => navbar[k] && (
              <DualField key={k} compact label={{ login: 'تسجيل الدخول', start: 'ابدأ مجاناً', menu: 'القائمة (جوّال)', home: 'الرئيسية (قارئ الشاشة)' }[k]} value={navbar[k]} onChange={(v) => setSite({ navbar: { ...navbar, [k]: v } })} />
            ))}
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">مجموعات الفوتر</h3>
          {groups.map((g, gi) => (
            <fieldset key={gi} className="space-y-3 rounded-xl border border-border p-4">
              <DualField label={`عنوان المجموعة ${gi + 1}`} value={g.title} onChange={(title) => setSite({ footer: { ...footer, groups: groups.map((x, j) => (j === gi ? { ...x, title } : x)) } })} />
              <ListEditor
                items={g.links}
                onChange={(links) => setSite({ footer: { ...footer, groups: groups.map((x, j) => (j === gi ? { ...x, links } : x)) } })}
                addLabel="إضافة رابط"
                createItem={() => ({ label: { ar: '', en: '' }, href: '/' })}
                getTitle={(l) => (
                  <span className="flex items-center gap-2 font-normal">
                    {l.label.ar}
                    <code dir="ltr" className="text-[11px] text-muted-foreground">{l.href}</code>
                  </span>
                )}
                renderItem={(l, upd) => (
                  <>
                    <DualField compact label="التسمية" value={l.label} onChange={(label) => upd({ ...l, label })} />
                    <label className="block space-y-1.5">
                      <span className="text-xs text-muted-foreground">الصفحة</span>
                      <select dir="ltr" value={l.href} onChange={(e) => upd({ ...l, href: e.target.value })} className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm">
                        {[...new Set([l.href, ...PAGES, ...features.map((f) => `/features/${f.slug}`)])].map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </label>
                  </>
                )}
              />
            </fieldset>
          ))}
        </Card>
      </div>
    </SitePage>
  );
}
