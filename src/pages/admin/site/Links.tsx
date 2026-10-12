import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DualField } from '@components/site/DualField';
import { SitePage } from '@components/site/SitePage';
import { useSiteContentStore } from '@/store/useSiteContentStore';
import type { Dual, Tree } from '@/types/siteContent';
import { isDual } from '@/utils/siteContent';

const plain = (v: unknown): string => (isDual(v) ? String(v.ar) : String(v ?? ''));
const isUrl = (v: string): boolean => /^https:\/\/[^\s/]+\.[^\s]+/.test(v);
const GENERIC = ['https://x.com', 'https://linkedin.com', 'https://instagram.com'];

/**
 * الروابط والتواصل (CMS-PROMPT §7.16): روابط لوحة العميل، البريد، واتساب،
 * السوشيال، نبذة الفوتر والحقوق — مع تحقّق صيغة الروابط.
 */
export default function SiteLinks(): JSX.Element {
  const site = useSiteContentStore((s) => s.draft.site);
  const set = useSiteContentStore((s) => s.set);
  const links = (site.links as Tree) ?? {};
  const footer = (site.footer as Tree) ?? {};
  const socials = (footer.links as { key: string; href: string }[]) ?? [];
  const socialLabels = (footer.socials as Record<string, Dual>) ?? {};

  const setLink = (k: string, v: string): void => set('site', { ...site, links: { ...links, [k]: v } });
  const setFooter = (patch: Tree): void => set('site', { ...site, footer: { ...footer, ...patch } });

  const url = (k: string, label: string, hint?: string): JSX.Element => {
    const v = plain(links[k]);
    return (
      <label key={k} className="block space-y-1.5">
        <span className="text-sm font-medium">{label}</span>
        <Input dir="ltr" value={v} onChange={(e) => setLink(k, e.target.value)} aria-invalid={!isUrl(v) || undefined} />
        {!isUrl(v) ? <span className="block text-xs text-destructive">رابط كامل يبدأ بـ https://</span> : hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
      </label>
    );
  };

  return (
    <SitePage title="الروابط والتواصل" lede="روابط لوحة العميل، والتواصل، والسوشيال، ونصوص الفوتر." scope="site">
      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">لوحة العميل</h3>
          {url('appUrl', 'رابط التطبيق')}
          {url('loginUrl', 'رابط الدخول', 'زرّ «تسجيل الدخول» في النافبار.')}
          {url('signupUrl', 'رابط التسجيل', 'كل أزرار «ابدأ مجاناً».')}
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">التواصل</h3>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">البريد</span>
            <Input dir="ltr" type="email" value={plain(links.email)} onChange={(e) => setLink('email', e.target.value)} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">واتساب</span>
            <Input dir="ltr" value={plain(links.whatsapp)} onChange={(e) => setLink('whatsapp', e.target.value)} placeholder="+968 …" />
            {/0000/.test(plain(links.whatsapp)) && <span className="flex items-center gap-1 text-xs text-warning"><AlertTriangle className="h-3.5 w-3.5" /> الرقم ما زال مؤقتاً.</span>}
          </label>
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">السوشيال</h3>
          {socials.map((s, i) => (
            <div key={s.key} className="space-y-2">
              <DualField compact label={`تسمية ${s.key}`} value={socialLabels[s.key] ?? { ar: '', en: '' }} onChange={(v) => setFooter({ socials: { ...socialLabels, [s.key]: v } })} />
              <Input dir="ltr" value={s.href} onChange={(e) => setFooter({ links: socials.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)) })} />
              {GENERIC.includes(s.href.replace(/\/$/, '')) && <span className="flex items-center gap-1 text-xs text-warning"><AlertTriangle className="h-3.5 w-3.5" /> رابط عامّ مؤقت — ضع رابط حساب Qhub.</span>}
            </div>
          ))}
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="font-semibold">الفوتر</h3>
          <DualField label="نبذة الفوتر" type="textarea" value={(footer.blurb as Dual) ?? { ar: '', en: '' }} onChange={(blurb) => setFooter({ blurb })} limit={160} />
          <DualField label="نصّ الحقوق" value={(footer.rights as Dual) ?? { ar: '', en: '' }} onChange={(rights) => setFooter({ rights })} />
          <DualField label="عنوان وسائل الدفع" value={(site.payments as Dual) ?? { ar: '', en: '' }} onChange={(payments) => set('site', { ...site, payments })} />
        </Card>
      </div>
    </SitePage>
  );
}
