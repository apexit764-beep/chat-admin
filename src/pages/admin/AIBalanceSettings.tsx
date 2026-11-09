import { useEffect, useMemo, useState } from 'react';
import { Plus, X, Save } from 'lucide-react';
import { useAIBalanceStore, formatUsd } from '@/store/useAIBalanceStore';
import { useUIStore } from '@/store/useUIStore';
import { PrivateAssistantNav } from '@/components/admin/PrivateAssistantNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Draft {
  modelName: string;
  price: string;
  min: string;
  max: string;
  negative: string;
}

export default function AIBalanceSettings(): JSX.Element {
  const settings = useAIBalanceStore((s) => s.settings);
  const updateSettings = useAIBalanceStore((s) => s.updateSettings);
  const showToast = useUIStore((s) => s.showToast);

  const initial = useMemo<Draft>(
    () => ({
      modelName: settings.modelName,
      price: String(settings.pricePerMillion),
      min: String(settings.minTopup),
      max: String(settings.maxTopup),
      negative: String(settings.negativeLimit),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings.modelName, settings.pricePerMillion, settings.minTopup, settings.maxTopup, settings.negativeLimit]
  );
  const [draft, setDraft] = useState<Draft>(initial);
  // after a save the saved values become the new baseline
  useEffect(() => setDraft(initial), [initial]);
  const [packInput, setPackInput] = useState('');

  const dirty = (Object.keys(initial) as (keyof Draft)[]).some((k) => draft[k] !== initial[k]);
  const set = (k: keyof Draft, v: string): void => setDraft((d) => ({ ...d, [k]: v }));
  const positive = (v: string): boolean => v.trim() !== '' && Number(v) > 0;

  const addPack = (): void => {
    const u = Number(packInput);
    if (!(u > 0)) return showToast('أدخل مبلغاً أكبر من صفر', 'error');
    if (settings.packs.includes(u)) return showToast('هذه الباقة موجودة بالفعل', 'error');
    if (u > Number(draft.max)) {
      return showToast(`مبلغ الباقة لا يمكن أن يتجاوز الحد الأقصى للمبلغ الحر (${formatUsd(Number(draft.max))})`, 'error');
    }
    updateSettings({ packs: [...settings.packs, u].sort((a, b) => a - b) });
    setPackInput('');
    showToast('تمت إضافة الباقة');
  };

  const removePack = (u: number): void => {
    if (settings.packs.length === 1) return showToast('يجب أن تبقى باقة واحدة على الأقل', 'error');
    updateSettings({ packs: settings.packs.filter((p) => p !== u) });
  };

  const save = (): void => {
    if (!draft.modelName.trim()) return showToast('أدخل اسم النموذج', 'error');
    if (!positive(draft.price)) return showToast('يجب أن يكون السعر أكبر من صفر', 'error');
    if (!positive(draft.min) || !positive(draft.max)) return showToast('يجب أن تكون القيم أرقاماً أكبر من صفر', 'error');
    if (Number(draft.min) >= Number(draft.max)) return showToast('يجب أن يكون الحد الأدنى أقل من الحد الأقصى', 'error');
    const biggest = Math.max(...settings.packs);
    if (biggest > Number(draft.max)) {
      return showToast(`الحد الأقصى أقل من أكبر باقة شحن (${formatUsd(biggest)}). عدّل الباقة أو ارفع الحد الأقصى`, 'error');
    }
    if (draft.negative.trim() === '' || Number.isNaN(Number(draft.negative)) || Number(draft.negative) < 0) {
      return showToast('أقل رصيد مسموح يجب أن يكون رقماً موجباً', 'error');
    }
    const priceChanged = Number(draft.price) !== settings.pricePerMillion;
    updateSettings({
      modelName: draft.modelName.trim(),
      pricePerMillion: Number(draft.price),
      minTopup: Number(draft.min),
      maxTopup: Number(draft.max),
      negativeLimit: Number(draft.negative),
    });
    showToast(priceChanged ? 'تم الحفظ، وأُرسل إشعار للعملاء بالسعر الجديد' : 'تم الحفظ');
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 page-fade">
      <PrivateAssistantNav />
      <p className="text-sm text-muted-foreground">الأسعار بالدولار، وتظهر لكل عميل بعملة دولته</p>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">النموذج</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label>النموذج المربوط</Label>
            <Input value={settings.provider} disabled dir="ltr" />
            <p className="text-xs text-muted-foreground">من إعدادات الربط · لا يظهر للعميل</p>
          </div>
          <div className="space-y-1.5">
            <Label>الاسم الظاهر للعميل</Label>
            <Input value={draft.modelName} onChange={(e) => set('modelName', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>سعر البيع لكل مليون توكن ($)</Label>
            <Input dir="ltr" type="number" step="0.01" value={draft.price} onChange={(e) => set('price', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">باقات الشحن</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {settings.packs.map((u) => (
              <span key={u} className="inline-flex items-center gap-2 rounded-full border bg-card ps-3 pe-1.5 py-1 text-sm">
                <b dir="ltr">{formatUsd(u)}</b>
                <button
                  onClick={() => removePack(u)}
                  className="h-5 w-5 rounded-full bg-destructive/10 text-destructive flex items-center justify-center"
                  aria-label="حذف الباقة"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Input
              dir="ltr"
              type="number"
              placeholder="مثلاً 15"
              className="w-40"
              value={packInput}
              onChange={(e) => setPackInput(e.target.value)}
            />
            <Button size="sm" variant="outline" onClick={addPack} className="gap-1">
              <Plus className="h-4 w-4" />
              إضافة باقة
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">المبلغ الحر</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>الحد الأدنى ($)</Label>
            <Input dir="ltr" type="number" value={draft.min} onChange={(e) => set('min', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>الحد الأقصى ($)</Label>
            <Input dir="ltr" type="number" value={draft.max} onChange={(e) => set('max', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">إعدادات عامة</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>أقل رصيد مسموح ($)</Label>
            <Input dir="ltr" type="number" step="0.01" min="0" value={draft.negative} onChange={(e) => set('negative', e.target.value)} />
            <p className="text-xs text-muted-foreground">
              أقل رصيد ممكن يصل له العميل، وعنده يتوقف سحب التوكن (يتوقف المساعد).
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 -mx-4 lg:-mx-6 px-4 lg:px-6 py-3 flex justify-end bg-background/95 backdrop-blur border-t z-10">
        <Button onClick={save} disabled={!dirty} className="gap-2">
          <Save className="h-4 w-4" />
          حفظ
        </Button>
      </div>
    </div>
  );
}
