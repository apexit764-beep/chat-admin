import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SitePage } from '@components/site/SitePage';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import type { Dual, StatItem } from '@/types/siteContent';
import { isDual } from '@/utils/siteContent';

const LABEL: Record<string, string> = {
  messages: 'الرسائل الشهرية',
  channels: 'القنوات والمنصات',
  accuracy: 'دقّة الفهم',
  response: 'متوسط أول رد',
};

const plain = (v: Dual | string | undefined): string => (v === undefined ? '' : isDual(v) ? v.ar : v);

/**
 * الأرقام (CMS-PROMPT §7.9): أربع بلاطات مقفلة — القيمة، اللاحقة، ومعاينة
 * البلاطة كما تظهر. أوصاف الأرقام نصوص في سكشن «بالأرقام» بالرئيسية.
 */
export default function SiteStats(): JSX.Element {
  const items = useSiteContentStore((s) => s.draft.stats.items);
  const caption = useSiteContentStore((s) => s.draft.home.sections.find((x) => x.key === 'stats')?.data);
  const set = useSiteContentStore((s) => s.set);

  const update = (key: string, patch: Partial<StatItem>): void => set('stats', { items: { ...items, [key]: { ...items[key], ...patch } } });

  return (
    <SitePage title="الأرقام" lede="أربع بلاطات — العدد مقفل." scope="stats">
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(items).map(([key, s]) => {
          const suffix = plain(s.suffix) || plain(s.unit);
          const shown = s.decimals ? s.to.toFixed(s.decimals) : String(s.to);
          return (
            <Card key={key} className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{LABEL[key] ?? key}</h3>
                <code dir="ltr" className="text-xs text-muted-foreground">{key}</code>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <label className="space-y-1.5">
                  <span className="text-xs text-muted-foreground">القيمة</span>
                  <Input type="number" dir="ltr" step="any" value={s.to} onChange={(e) => update(key, { to: Number(e.target.value) })} className="tabular-nums" />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs text-muted-foreground">اللاحقة</span>
                  <Input dir="ltr" value={plain(s.suffix)} placeholder="M+ · %" onChange={(e) => update(key, { suffix: e.target.value || undefined })} />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs text-muted-foreground">منازل عشرية</span>
                  <Input type="number" dir="ltr" min={0} max={2} value={s.decimals ?? 0} onChange={(e) => update(key, { decimals: Number(e.target.value) || undefined })} />
                </label>
              </div>
              {/* معاينة البلاطة */}
              <div className="rounded-xl bg-muted p-4">
                <p dir="ltr" className="text-end text-3xl font-extrabold tabular-nums text-primary">{shown}{suffix}</p>
                <p className="mt-1 text-sm text-muted-foreground">{(caption?.[key] as Dual | undefined)?.ar ?? ''}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </SitePage>
  );
}
