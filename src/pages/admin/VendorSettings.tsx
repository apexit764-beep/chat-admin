import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useVendorsAdminStore } from '@/store/useVendorsAdminStore';
import { Note } from '@/components/admin/vendors/VendorBits';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function VendorSettings(): JSX.Element {
  const { settings, saveSettings } = useVendorsAdminStore();
  const showToast = useUIStore((s) => s.showToast);
  const [d, setD] = useState({ rate: String(settings.rate), hold: String(settings.hold), min: String(settings.min) });
  useEffect(() => setD({ rate: String(settings.rate), hold: String(settings.hold), min: String(settings.min) }), [settings]);

  const dirty = d.rate !== String(settings.rate) || d.hold !== String(settings.hold) || d.min !== String(settings.min);
  const set = (k: keyof typeof d, v: string): void => setD((s) => ({ ...s, [k]: v }));

  const save = (): void => {
    const [rate, hold, min] = [Number(d.rate), Number(d.hold), Number(d.min)];
    if (![rate, hold, min].every((x) => x > 0)) return showToast('يجب أن تكون القيم أرقامًا أكبر من صفر', 'error');
    if (rate > 100) return showToast('نسبة العمولة لا تتجاوز 100%', 'error');
    saveSettings({ rate, hold, min });
    showToast('تم الحفظ');
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 page-fade">
      <div>
        <h2 className="text-2xl font-bold">إعدادات الموردين</h2>
        <p className="text-sm text-muted-foreground">القيم الافتراضية لأي مورد جديد</p>
      </div>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label>نسبة العمولة الافتراضية</Label>
              <Input dir="ltr" inputMode="decimal" value={d.rate} onChange={(e) => set('rate', e.target.value)} />
              <p className="text-xs text-muted-foreground">%، من أول اشتراك</p>
            </div>
            <div className="space-y-1.5">
              <Label>مدة تعليق الرصيد</Label>
              <Input dir="ltr" inputMode="numeric" value={d.hold} onChange={(e) => set('hold', e.target.value)} />
              <p className="text-xs text-muted-foreground">يوم بعد دفع العميل قبل أن تصبح العمولة متاحة</p>
            </div>
            <div className="space-y-1.5">
              <Label>الحد الأدنى للسحب</Label>
              <Input dir="ltr" inputMode="decimal" value={d.min} onChange={(e) => set('min', e.target.value)} />
              <p className="text-xs text-muted-foreground">بالدولار، ويظهر للمورد بعملة دولته</p>
            </div>
          </div>
          <Note>يُطبق التغيير على العمولات الجديدة فقط.</Note>
          <Button className="gap-2" disabled={!dirty} onClick={save}>
            <Save className="h-4 w-4" />
            حفظ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
