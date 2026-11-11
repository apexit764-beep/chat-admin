import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useReferralsStore } from '@/store/useReferralsStore';
import { FieldHint, Note } from '@/components/admin/vendors/VendorBits';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const toForm = (s: { on: boolean; mM: number; mA: number; pct: number }): { on: boolean; mM: string; mA: string; pct: string } => ({
  on: s.on, mM: String(s.mM), mA: String(s.mA), pct: String(s.pct),
});

export default function Referrals(): JSX.Element {
  const { settings, saveSettings } = useReferralsStore();
  const showToast = useUIStore((s) => s.showToast);
  const [d, setD] = useState(toForm(settings));
  useEffect(() => setD(toForm(settings)), [settings]);

  const dirty = d.on !== settings.on || d.mM !== String(settings.mM) || d.mA !== String(settings.mA) || d.pct !== String(settings.pct);
  const set = (k: 'mM' | 'mA' | 'pct', v: string): void => setD((s) => ({ ...s, [k]: v.replace(/[^\d]/g, '') }));

  const save = (): void => {
    const [mM, mA, pct] = [Number(d.mM), Number(d.mA), Number(d.pct)];
    if (![mM, mA, pct].every((x) => Number.isInteger(x) && x > 0)) return showToast('يجب أن تكون القيم أرقامًا صحيحة أكبر من صفر', 'error');
    if (mM > 24 || mA > 24) return showToast('شهور المكافأة من 1 إلى 24 شهرًا', 'error');
    if (pct > 100) return showToast('يجب ألا تزيد نسبة الخصم عن 100%', 'error');
    saveSettings({ on: d.on, mM, mA, pct });
    showToast(d.on !== settings.on ? (d.on ? 'تم تشغيل البرنامج' : 'تم إيقاف البرنامج') : 'تم الحفظ');
  };

  const mM = Number(d.mM) || 0;
  const mA = Number(d.mA) || 0;
  return (
    <div className="p-4 lg:p-6 space-y-4 page-fade">
      <div>
        <h2 className="text-2xl font-bold">برنامج المروّجين</h2>
        <p className="text-sm text-muted-foreground">مكافآت العملاء الذين يجلبون مشتركين جددًا من خلال رابط الإحالة الخاص بهم</p>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between gap-4 pt-6">
          <div>
            <b>تشغيل البرنامج</b>
            <p className="mt-1 text-xs text-muted-foreground">عند الإيقاف يختفي رابط الإحالة لدى العملاء، وتستمر المكافآت المكتسبة سابقًا بشكل طبيعي.</p>
          </div>
          <Switch checked={d.on} onCheckedChange={(v) => setD((s) => ({ ...s, on: v }))} aria-label="تشغيل البرنامج" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <b className="block">المكافأة</b>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label>شهور المكافأة لكل مشترك شهري</Label>
              <Input dir="ltr" inputMode="numeric" value={d.mM} onChange={(e) => set('mM', e.target.value)} />
              <FieldHint>مطلوب. عدد صحيح من 1 إلى 24 شهرًا، يكسبه المروّج عند دفع المشترك الجديد اشتراكًا شهريًا.</FieldHint>
            </div>
            <div className="space-y-1.5">
              <Label>شهور المكافأة لكل مشترك سنوي</Label>
              <Input dir="ltr" inputMode="numeric" value={d.mA} onChange={(e) => set('mA', e.target.value)} />
              <FieldHint>مطلوب. عدد صحيح من 1 إلى 24 شهرًا، يكسبه المروّج عند دفع المشترك الجديد اشتراكًا سنويًا.</FieldHint>
            </div>
            <div className="space-y-1.5">
              <Label>نسبة الخصم في شهر المكافأة (%)</Label>
              <Input dir="ltr" inputMode="numeric" value={d.pct} onChange={(e) => set('pct', e.target.value)} />
              <FieldHint>مطلوب. عدد صحيح أكبر من 0 وحتى 100، يُحسب من سعر شهر اشتراك المروّج، وبحد أقصى ما دفعه المشترك الجديد.</FieldHint>
            </div>
          </div>
          <Note>
            كيف تُحسب المكافأة: المشترك الشهري = {mM || '—'} {mM === 1 ? 'شهر' : 'شهور'}، والمشترك السنوي = {mA || '—'} شهور. وكل شهر مكتسب = خصم {d.pct || '—'}% من سعر شهر اشتراك المروّج، ويُطبَّق تلقائيًا على فاتورة التجديد.
          </Note>
          <Note>أي تغيير يُطبَّق على المكافآت الجديدة فقط، وتبقى المكافآت المكتسبة سابقًا كما هي.</Note>
          <Button className="gap-2" disabled={!dirty} onClick={save}>
            <Save className="h-4 w-4" />
            حفظ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
