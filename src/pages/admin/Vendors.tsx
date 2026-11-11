import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Plus } from 'lucide-react';
import { useConfirm } from '@components/ui';
import { useUIStore } from '@/store/useUIStore';
import { FX, sumsFor, useVendorsAdminStore, type VCurrency, type Vendor } from '@/store/useVendorsAdminStore';
import { FieldHint, Note, StatusPill } from '@/components/admin/vendors/VendorBits';
import { isEmail, isIntlPhone, lengthBetween } from '@/utils/vendorValidation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface FormState {
  name: string;
  email: string;
  phone: string;
  cur: VCurrency;
  rate: string;
}

function VendorFormDialog({ vendor, onClose }: { vendor: Vendor | 'new'; onClose: () => void }): JSX.Element {
  const { settings, addVendor, editVendor } = useVendorsAdminStore();
  const showToast = useUIStore((s) => s.showToast);
  const isNew = vendor === 'new';
  const [f, setF] = useState<FormState>(
    isNew
      ? { name: '', email: '', phone: '', cur: 'EGP', rate: String(settings.rate) }
      : { name: vendor.name, email: vendor.email, phone: vendor.phone, cur: vendor.cur, rate: String(vendor.rate) }
  );
  const set = (k: keyof FormState, v: string): void => setF((s) => ({ ...s, [k]: v }));

  const submit = (): void => {
    if (!lengthBetween(f.name, 2, 100)) return showToast('الاسم مطلوب، من حرفين إلى 100 حرف', 'error');
    if (!isEmail(f.email)) return showToast('أدخل بريدًا إلكترونيًا صحيحًا', 'error');
    if (!isIntlPhone(f.phone)) return showToast('رقم الجوال: يبدأ برمز الدولة مثل +20، أرقام ومسافات من 8 إلى 20 خانة', 'error');
    const rate = Number(f.rate);
    if (!(rate > 0 && rate <= 100)) return showToast('نسبة العمولة يجب أن تكون أكبر من 0 وحتى 100', 'error');
    const input = { name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim(), cur: f.cur, rate };
    const r = isNew ? addVendor(input) : editVendor(vendor.id, input);
    if (!r.ok) return showToast(r.error, 'error');
    showToast(isNew ? 'تمت إضافة المورد وإرسال بريد الدعوة' : 'تم الحفظ');
    onClose();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isNew ? 'إضافة مورد' : 'تعديل بيانات المورد'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label>الاسم *</Label>
            <Input maxLength={100} value={f.name} onChange={(e) => set('name', e.target.value)} />
            <FieldHint>مطلوب. من حرفين إلى 100 حرف.</FieldHint>
          </div>
          <div className="space-y-1.5">
            <Label>البريد الإلكتروني *</Label>
            <Input dir="ltr" value={f.email} onChange={(e) => set('email', e.target.value)} />
            <FieldHint>مطلوب. بريد إلكتروني بصيغة صحيحة وغير مسجّل لمورد آخر.</FieldHint>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>رقم الجوال *</Label>
              <Input dir="ltr" value={f.phone} onChange={(e) => set('phone', e.target.value.replace(/[^\d+\s]/g, ''))} />
              <FieldHint>مطلوب. يبدأ برمز الدولة مثل ‎+20، أرقام ومسافات من 8 إلى 20 خانة.</FieldHint>
            </div>
            <div className="space-y-1.5">
              <Label>الدولة *</Label>
              <Select value={f.cur} onValueChange={(v) => set('cur', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(FX) as VCurrency[]).map((c) => (
                    <SelectItem key={c} value={c}>
                      {FX[c].country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldHint>مطلوب. تحدد عملة العمولات الجديدة.</FieldHint>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>نسبة العمولة %</Label>
            <Input dir="ltr" inputMode="decimal" value={f.rate} onChange={(e) => set('rate', e.target.value.replace(/[^\d.]/g, ''))} />
            <FieldHint>مطلوب. رقم أكبر من 0 وحتى 100.</FieldHint>
          </div>
          <Note>
            {isNew
              ? 'سيصل إلى المورد بريد لإنشاء كلمة المرور والموافقة على شروط البرنامج.'
              : 'تُطبق النسبة الجديدة على العملاء الذين يشتركون بعد التعديل فقط. تغيير الدولة يغيّر عملة العمولات الجديدة فقط.'}
          </Note>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={submit}>{isNew ? 'إضافة' : 'حفظ'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Vendors(): JSX.Element {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const showToast = useUIStore((s) => s.showToast);
  const { vendors, clients, comms, payouts, toggleFreeze, resendInvite } = useVendorsAdminStore();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [country, setCountry] = useState('all');
  const [balance, setBalance] = useState('all');
  const [form, setForm] = useState<Vendor | 'new' | null>(null);

  const list = useMemo(
    () =>
      vendors.filter((v) => {
        if (status !== 'all' && v.status !== status) return false;
        if (country !== 'all' && v.country !== country) return false;
        if (q && !(v.name + v.email).toLowerCase().includes(q.toLowerCase())) return false;
        if (balance === 'avail' && !(sumsFor(v.id, comms, payouts).avail > 0)) return false;
        if (balance === 'open' && !payouts.some((p) => p.vid === v.id && p.st === 'بانتظار المراجعة')) return false;
        return true;
      }),
    [vendors, comms, payouts, q, status, country, balance]
  );

  const onToggle = async (v: Vendor): Promise<void> => {
    const freezing = v.status === 'نشط';
    const ok = await confirm({
      title: freezing ? `تجميد ${v.name}؟` : `إلغاء تجميد ${v.name}؟`,
      message: freezing
        ? 'لن يتمكن المورد من طلب سحب أو إضافة عملاء ولا تُسجل له عمولات جديدة، وسيصله بريد بذلك.'
        : 'سيعود حسابه نشطًا ويصله بريد بذلك.',
      variant: freezing ? 'warning' : undefined,
      confirmText: freezing ? 'تجميد' : 'إلغاء التجميد',
    });
    if (!ok) return;
    toggleFreeze(v.id);
    showToast(freezing ? 'تم تجميد المورد' : 'تم إلغاء تجميد المورد');
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 page-fade">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">الموردون</h2>
          <p className="text-sm text-muted-foreground">مسوّقون من خارج النظام يجلبون عملاء ويحصلون على عمولة عن أول اشتراك</p>
        </div>
        <Button className="gap-2" onClick={() => setForm('new')}>
          <Plus className="h-4 w-4" />
          إضافة مورد
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap gap-2">
            <Input className="min-w-[220px] flex-1" placeholder="ابحث باسم المورد أو البريد الإلكتروني..." value={q} onChange={(e) => setQ(e.target.value)} />
            <FilterSelect value={status} onChange={setStatus} options={[['all', 'الحالة: الكل'], ['نشط', 'نشط'], ['مجمّد', 'مجمّد'], ['دعوة مرسلة', 'دعوة مرسلة']]} />
            <FilterSelect value={country} onChange={setCountry} options={[['all', 'الدولة: الكل'], ...[...new Set(vendors.map((v) => v.country))].map((c): [string, string] => [c, c])]} />
            <FilterSelect value={balance} onChange={setBalance} options={[['all', 'الرصيد: الكل'], ['avail', 'لديه رصيد متاح'], ['open', 'لديه طلب سحب مفتوح']]} />
          </div>
        </CardContent>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {['اسم المورد', 'رقم الجوال', 'البريد الإلكتروني', 'الدولة', 'العمولة', 'العملاء', 'الاشتراكات', 'الحالة', ''].map((h, i) => (
                  <TableHead key={i} className="text-start">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">
                    لا يوجد موردون بهذا الفلتر.
                  </TableCell>
                </TableRow>
              )}
              {list.map((v) => {
                const mine = clients.filter((c) => c.vid === v.id);
                return (
                  <TableRow key={v.id} className="cursor-pointer" onClick={() => navigate(`/vendors/${v.id}`)}>
                    <TableCell className="font-bold">{v.name}</TableCell>
                    <TableCell>
                      <bdi dir="ltr">{v.phone}</bdi>
                    </TableCell>
                    <TableCell className="text-xs">{v.email}</TableCell>
                    <TableCell>{v.country}</TableCell>
                    <TableCell>{v.rate}%</TableCell>
                    <TableCell>{mine.length}</TableCell>
                    <TableCell>{mine.filter((c) => c.state === 'اشترك').length}</TableCell>
                    <TableCell>
                      <StatusPill text={v.status} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <span className="inline-flex items-center gap-2">
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => setForm(v)}>
                          <Pencil className="h-3.5 w-3.5" />
                          تعديل
                        </Button>
                        {v.status === 'دعوة مرسلة' ? (
                          <Button
                            size="sm"
                            onClick={() => {
                              resendInvite(v.id);
                              showToast('تم إرسال دعوة جديدة، وتوقف الرابط القديم');
                            }}
                          >
                            إعادة إرسال الدعوة
                          </Button>
                        ) : (
                          <Switch checked={v.status === 'نشط'} onCheckedChange={() => void onToggle(v)} aria-label="تجميد المورد" />
                        )}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {form && <VendorFormDialog vendor={form} onClose={() => setForm(null)} />}
    </div>
  );
}

function FilterSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: [string, string][] }): JSX.Element {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-auto min-w-[150px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map(([v, t]) => (
          <SelectItem key={v} value={v}>
            {t}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
