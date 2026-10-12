import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { DualField } from '@components/site/DualField';
import { ListEditor } from '@components/site/ListEditor';
import { MediaPicker } from '@components/site/MediaPicker';
import { SitePage } from '@components/site/SitePage';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import type { Partner } from '@/types/siteContent';

/** ارتفاع الشريط على الموقع — النسبة تضبط عرض كل شعار ليتوازن بصرياً */
const ROW_H = 32;

/**
 * الشركاء (CMS-PROMPT §7.8): شعارات بـ«نسبة الحبر» تُضبط بمنزلق مع معاينة
 * الشريط الحيّة — لتتوازن الشعارات العريضة والمربّعة. إظهار الشريط نفسه
 * مفتاح في الرئيسية.
 */
export default function SitePartners(): JSX.Element {
  const items = useSiteContentStore((s) => s.draft.partners.items);
  const set = useSiteContentStore((s) => s.set);
  const update = (next: Partner[]): void => set('partners', { items: next });
  const shown = items.filter((p) => p.published !== false);

  return (
    <SitePage title="الشركاء" lede="الشعارات التي تمرّ في الشريط." scope="partners" badges={items}>
      {/* معاينة الشريط */}
      <Card className="overflow-hidden p-4">
        <p className="mb-3 text-xs font-semibold text-muted-foreground">معاينة الشريط</p>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4" dir="ltr">
          {shown.map((p) => p.logo && (
            <img key={p.key} src={p.logo.url} alt={p.name.ar} title={p.name.ar} className="object-contain opacity-70 grayscale" style={{ height: ROW_H / Math.sqrt(Math.max(p.inkRatio, 0.5)) * 1.4, maxWidth: ROW_H * 4 }} />
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <ListEditor<Partner>
          items={items}
          onChange={update}
          addLabel="إضافة شريك"
          createItem={() => ({ key: `partner-${items.length + 1}`, name: { ar: '', en: '' }, logo: null, inkRatio: 1, inkFill: 0.5, published: true })}
          getTitle={(p) => (
            <span className="flex items-center gap-3">
              {p.logo && <img src={p.logo.url} alt="" className="h-6 w-16 object-contain" />}
              {p.name.ar}
            </span>
          )}
          getMeta={(p, i) => <Switch checked={p.published !== false} onCheckedChange={(published) => update(items.map((x, j) => (j === i ? { ...x, published } : x)))} aria-label="منشور" />}
          renderItem={(p, upd) => (
            <>
              <DualField label="الاسم" value={p.name} onChange={(name) => upd({ ...p, name })} />
              <MediaPicker label="الشعار" kinds={['image', 'icon']} value={p.logo} withAlt={false} onChange={(logo) => upd({ ...p, logo })} />
              <label className="block space-y-1.5">
                <span className="flex items-center justify-between text-sm font-medium">
                  نسبة الحبر <span dir="ltr" className="tabular-nums text-muted-foreground">{p.inkRatio.toFixed(2)}</span>
                </span>
                <input type="range" min={0.5} max={6} step={0.01} value={p.inkRatio} onChange={(e) => upd({ ...p, inkRatio: Number(e.target.value) })} className="w-full accent-primary" />
                <span className="block text-xs text-muted-foreground">أعلى للشعارات العريضة فتصغر، وأقل للمربّعة فتكبر — حتى تبدو بالحجم البصري نفسه في الشريط أعلاه.</span>
              </label>
            </>
          )}
        />
      </Card>
    </SitePage>
  );
}
