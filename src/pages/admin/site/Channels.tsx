import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useConfirm } from '@components/ui';
import { ChannelLogo } from '@components/site/ChannelsPicker';
import { DualField } from '@components/site/DualField';
import { MediaPicker } from '@components/site/MediaPicker';
import { SECTION_LABEL } from '@components/site/homeSchemas';
import { SitePage } from '@components/site/SitePage';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import type { Channel, SiteContent } from '@/types/siteContent';
import { cn } from '@/lib/utils';

/** أين تظهر كل قناة — السكاشن التي تختارها من المكتبة */
function usageOf(content: SiteContent): Map<string, string[]> {
  const map = new Map<string, string[]>();
  const add = (key: string, where: string): void => {
    const list = map.get(key) ?? [];
    if (!list.includes(where)) list.push(where);
    map.set(key, list);
  };
  for (const s of content.home.sections) {
    const d = s.data as Record<string, unknown>;
    const label = SECTION_LABEL[s.key] ?? s.key;
    for (const k of ['channels', 'chips']) (d[k] as string[] | undefined)?.forEach?.((c) => typeof c === 'string' && add(c, label));
    (d.arcs as string[][] | undefined)?.flat().forEach((c) => add(c, label));
  }
  // القنوات داخل رسومات المزايا المبنية (ch)
  const walk = (n: unknown): void => {
    if (Array.isArray(n)) n.forEach(walk);
    else if (n && typeof n === 'object') {
      const o = n as Record<string, unknown>;
      if (typeof o.ch === 'string') add(o.ch, 'رسومات المزايا');
      Object.values(o).forEach(walk);
    }
  };
  walk(content.features.pages);
  return map;
}

/**
 * القنوات والشعارات (CMS-PROMPT §7.7) — مكتبة واحدة يُشار إليها من خمسة
 * أماكن. تغيير الشعار يصل لكل مكان بنشرة واحدة، والقناة المستعملة لا تُحذف.
 */
export default function SiteChannels(): JSX.Element {
  const draft = useSiteContentStore((s) => s.draft);
  const set = useSiteContentStore((s) => s.set);
  const { confirm } = useConfirm();
  const items = draft.channels.items;
  const usage = useMemo(() => usageOf(draft), [draft]);
  const [sel, setSel] = useState(0);
  const ch = items[sel];
  const update = (patch: Partial<Channel>): void => set('channels', { items: items.map((c, i) => (i === sel ? { ...c, ...patch } : c)) });
  const used = usage.get(ch?.key ?? '') ?? [];

  return (
    <SitePage title="القنوات والشعارات" lede="مكتبة شعارات المنصّات — منها تختار السكاشن قنواتها (الهيرو، القوسان، الرقائق، رسومات المزايا)." scope="channels" badges={items}>
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 content-start">
          {items.map((c, i) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setSel(i)}
              className={cn('flex items-center gap-3 rounded-xl border bg-card p-3 text-start', i === sel ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/50', c.enabled === false && 'opacity-50')}
            >
              <ChannelLogo channel={c} />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{c.name.ar}</span>
                <span className="block text-[11px] text-muted-foreground">{(usage.get(c.key) ?? []).length} أماكن{c.enabled === false ? ' · معطّلة' : ''}</span>
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              set('channels', { items: [...items, { key: `channel-${items.length + 1}`, name: { ar: 'قناة جديدة', en: 'New channel' }, tint: '#2563EB', ring: 'rgba(37,99,235,.18)', logo: null, enabled: true }] });
              setSel(items.length);
            }}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-3 text-sm text-muted-foreground hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" /> إضافة قناة
          </button>
        </div>

        {ch && (
          <Card className="p-5 space-y-4 h-fit">
            <div className="flex items-center gap-3">
              <ChannelLogo channel={ch} />
              <code dir="ltr" className="text-xs text-muted-foreground">{ch.key}</code>
              <label className="ms-auto flex items-center gap-2 text-sm">
                <Switch
                  checked={ch.enabled !== false}
                  onCheckedChange={async (enabled) => {
                    if (!enabled && used.length && !(await confirm({ title: `تعطيل ${ch.name.ar}؟`, message: `تختفي من: ${used.join('، ')}.`, variant: 'warning', confirmText: 'تعطيل' }))) return;
                    update({ enabled });
                  }}
                />
                {ch.enabled !== false ? 'مفعّلة' : 'معطّلة'}
              </label>
            </div>
            <DualField label="الاسم" value={ch.name} onChange={(name) => update({ name })} />
            <MediaPicker label="الشعار" kinds={['icon', 'image']} value={ch.logo} withAlt={false} onChange={(logo) => update({ logo })} hint="SVG أو PNG — يُعقَّم الـSVG عند الرفع." />
            <div className="space-y-1.5">
              <span className="text-sm font-medium">لون الهوية</span>
              <div className="flex items-center gap-2">
                <input type="color" value={ch.tint} onChange={(e) => update({ tint: e.target.value, ring: `${e.target.value}2e` })} className="h-10 w-12 cursor-pointer rounded-md border border-border bg-background" aria-label="لون الهوية" />
                <Input dir="ltr" value={ch.tint} onChange={(e) => update({ tint: e.target.value })} className="w-32 font-mono" />
              </div>
              <p className="text-xs text-muted-foreground">يُستعمل في الهالات والظلال حول الشعار في السكاشن.</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-sm font-medium">أين تظهر</span>
              {used.length ? (
                <ul className="flex flex-wrap gap-1.5">{used.map((u) => <li key={u} className="rounded-md bg-muted px-2 py-0.5 text-xs">{u}</li>)}</ul>
              ) : (
                <p className="text-xs text-muted-foreground">لا يستعملها أي سكشن الآن.</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              disabled={used.length > 0}
              title={used.length ? 'لا تُحذف قناة مستعملة — أزلها من السكاشن أو عطّلها' : undefined}
              onClick={async () => {
                if (await confirm({ title: `حذف ${ch.name.ar}؟`, variant: 'danger', confirmText: 'حذف' })) {
                  set('channels', { items: items.filter((_, i) => i !== sel) });
                  setSel(0);
                }
              }}
            >
              حذف القناة
            </Button>
          </Card>
        )}
      </div>
    </SitePage>
  );
}
