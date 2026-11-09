import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Save } from 'lucide-react';
import { useAIBalanceStore, formatUsd, packSubscribers } from '@/store/useAIBalanceStore';
import { useUIStore } from '@/store/useUIStore';
import { PrivateAssistantNav } from '@/components/admin/PrivateAssistantNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/** most top-up packs a client can be offered — keeps the payment screen readable */
const MAX_PACKS = 6;

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
  const accounts = useAIBalanceStore((s) => s.accounts);
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
  const [editFrom, setEditFrom] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const dirty = (Object.keys(initial) as (keyof Draft)[]).some((k) => draft[k] !== initial[k]);
  const set = (k: keyof Draft, v: string): void => setDraft((d) => ({ ...d, [k]: v }));
  const positive = (v: string): boolean => v.trim() !== '' && Number(v) > 0;

  const addPack = (): void => {
    const u = Number(packInput);
    if (!(u > 0)) return showToast('أدخل مبلغاً أكبر من صفر', 'error');
    if (settings.packs.some((p) => p.usd === u)) return showToast('هذه الباقة موجودة بالفعل', 'error');
    if (settings.packs.length >= MAX_PACKS) return showToast(`الحد الأقصى ${MAX_PACKS} باقات شحن. احذف باقة لإضافة أخرى`, 'error');
    if (u > Number(draft.max)) {
      return showToast(`مبلغ الباقة لا يمكن أن يتجاوز الحد الأقصى للمبلغ الحر (${formatUsd(Number(draft.max))})`, 'error');
    }
    updateSettings({ packs: [...settings.packs, { usd: u, active: true }].sort((a, b) => a.usd - b.usd) });
    setPackInput('');
    showToast('تمت إضافة الباقة');
  };

  const activeCount = settings.packs.filter((p) => p.active).length;

  /** hide from new subscribers / show again — current subscribers keep their pack either way */
  const togglePack = (usd: number): void => {
    const pack = settings.packs.find((p) => p.usd === usd);
    if (!pack) return;
    if (pack.active && activeCount === 1) return showToast('يجب أن تبقى باقة واحدة مفعّلة على الأقل', 'error');
    updateSettings({ packs: settings.packs.map((p) => (p.usd === usd ? { ...p, active: !p.active } : p)) });
    showToast(pack.active ? 'تم تعطيل الباقة: تختفي عن المشتركين الجدد وتستمر مع الحاليين' : 'تم تفعيل الباقة');
  };

  /** a pack's amount can only change while nobody is subscribed to it */
  const openEdit = (usd: number): void => {
    const subs = packSubscribers(accounts, usd);
    if (subs > 0) return showToast(`لا يمكن تعديل الباقة: ${subs} عميل مشترك فيها. عطّلها وأضف باقة جديدة`, 'error');
    setEditFrom(usd);
    setEditValue(String(usd));
  };

  const saveEdit = (): void => {
    if (editFrom === null) return;
    const u = Number(editValue);
    if (!(u > 0)) return showToast('أدخل مبلغاً أكبر من صفر', 'error');
    if (u !== editFrom && settings.packs.some((p) => p.usd === u)) return showToast('هذه الباقة موجودة بالفعل', 'error');
    if (u > Number(draft.max)) {
      return showToast(`مبلغ الباقة لا يمكن أن يتجاوز الحد الأقصى للمبلغ الحر (${formatUsd(Number(draft.max))})`, 'error');
    }
    updateSettings({
      packs: settings.packs.map((p) => (p.usd === editFrom ? { ...p, usd: u } : p)).sort((x, y) => x.usd - y.usd),
    });
    setEditFrom(null);
    showToast('تم تعديل الباقة');
  };

  const save = (): void => {
    if (!draft.modelName.trim()) return showToast('أدخل اسم النموذج', 'error');
    if (!positive(draft.price)) return showToast('يجب أن يكون السعر أكبر من صفر', 'error');
    if (!positive(draft.min) || !positive(draft.max)) return showToast('يجب أن تكون القيم أرقاماً أكبر من صفر', 'error');
    if (Number(draft.min) >= Number(draft.max)) return showToast('يجب أن يكون الحد الأدنى أقل من الحد الأقصى', 'error');
    const biggest = Math.max(...settings.packs.map((p) => p.usd));
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
          <p className="text-xs text-muted-foreground">
            الباقة المعطّلة تختفي عن المشتركين الجدد وتستمر مع المشتركين الحاليين. لا يمكن حذف الباقات. الحد الأقصى {MAX_PACKS} باقات.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {settings.packs.map((p) => {
              const subs = packSubscribers(accounts, p.usd);
              return (
                <span
                  key={p.usd}
                  className={`inline-flex items-center gap-2 rounded-full border bg-card ps-3 pe-1.5 py-1 text-sm ${p.active ? '' : 'opacity-60'}`}
                >
                  <b dir="ltr">{formatUsd(p.usd)}</b>
                  <span className="text-xs text-muted-foreground">{subs > 0 ? `${subs} مشترك` : 'بدون مشتركين'}</span>
                  <Switch checked={p.active} onCheckedChange={() => togglePack(p.usd)} aria-label="تفعيل الباقة" />
                  <button
                    onClick={() => openEdit(p.usd)}
                    disabled={subs > 0}
                    title={subs > 0 ? 'لا يمكن التعديل: يوجد مشتركون. عطّل الباقة وأضف باقة جديدة' : 'تعديل مبلغ الباقة'}
                    className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="تعديل الباقة"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
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

      <Dialog open={editFrom !== null} onOpenChange={(o) => !o && setEditFrom(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>تعديل مبلغ الباقة</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5 py-2">
            <Label>المبلغ ($)</Label>
            <Input dir="ltr" type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditFrom(null)}>
              إلغاء
            </Button>
            <Button onClick={saveEdit}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="sticky bottom-0 -mx-4 lg:-mx-6 px-4 lg:px-6 py-3 flex justify-end bg-background/95 backdrop-blur border-t z-10">
        <Button onClick={save} disabled={!dirty} className="gap-2">
          <Save className="h-4 w-4" />
          حفظ
        </Button>
      </div>
    </div>
  );
}
