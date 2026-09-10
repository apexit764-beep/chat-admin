import { useEffect, useState } from 'react';
import { Mail, Lock, RefreshCw, Copy, EyeOff, Eye as EyeIcon, MessageSquare, ArrowRight } from 'lucide-react';
import { useAdminStore, TRIAL_DAYS } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Client } from '@/types';

export function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const specials = '!@#$%&*';
  let pwd = '';
  for (let i = 0; i < 10; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
  pwd += specials[Math.floor(Math.random() * specials.length)];
  return pwd.split('').sort(() => Math.random() - 0.5).join('');
}

interface ClientFormState {
  companyName: string;
  contactName: string;
  email: string;
  phoneCode: string;
  phone: string;
  country: string;
  industry: string;
  password: string;
  startWithTrial: boolean;
  sendViaWhatsapp: boolean;
  sendViaEmail: boolean;
}

const emptyForm = (): ClientFormState => ({
  companyName: '',
  contactName: '',
  email: '',
  phoneCode: '+968',
  phone: '',
  country: '',
  industry: '',
  password: generatePassword(),
  startWithTrial: true,
  sendViaWhatsapp: true,
  sendViaEmail: false,
});

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** the client being edited; omit to create a new one */
  client?: Client | null;
  /** receives the created or updated client after a successful save */
  onSaved?: (client: Client) => void;
  /** when the form is opened from another flow, shows a back button that returns to it */
  onBack?: () => void;
}

/**
 * Add / edit client form. Shared by the clients page and the create-subscription
 * flow so both use the same fields, validation and side effects.
 */
export function ClientFormDialog({ open, onOpenChange, client, onSaved, onBack }: ClientFormDialogProps): JSX.Element {
  const countries = useAdminStore((s) => s.countries);
  const industries = useAdminStore((s) => s.industries);
  const addClient = useAdminStore((s) => s.addClient);
  const updateClient = useAdminStore((s) => s.updateClient);
  const showToast = useUIStore((s) => s.showToast);

  const editing = client ?? null;
  const [form, setForm] = useState<ClientFormState>(emptyForm());
  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormState, string>>>({});
  const [showPwd, setShowPwd] = useState(false);

  // reload the form whenever the dialog opens, so it never shows stale input
  useEffect(() => {
    if (!open) return;
    setErrors({});
    setShowPwd(false);
    setForm(
      editing
        ? {
            companyName: editing.companyName,
            contactName: editing.contactName,
            email: editing.email,
            phoneCode: editing.phone?.split(' ')[0] || '+968',
            phone: editing.phone?.split(' ').slice(1).join(' ') || editing.phone,
            country: editing.country,
            industry: editing.industry,
            password: editing.password,
            startWithTrial: Boolean(editing.trialEndsAt),
            sendViaWhatsapp: true,
            sendViaEmail: false,
          }
        : emptyForm()
    );
  }, [open, editing]);

  const submit = (): void => {
    const e: Partial<Record<keyof ClientFormState, string>> = {};
    if (!form.companyName.trim()) e.companyName = 'اسم الشركة مطلوب';
    if (!form.email.trim()) e.email = 'البريد مطلوب';
    else if (!/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(form.email.trim())) e.email = 'صيغة البريد غير صحيحة';
    if (!form.phone.trim()) e.phone = 'الهاتف مطلوب';
    if (!form.contactName.trim()) e.contactName = 'اسم المدير مطلوب';
    if (!form.country) e.country = 'الدولة مطلوبة';
    if (!form.password.trim()) e.password = 'كلمة المرور مطلوبة';
    else if (form.password.trim().length < 6) e.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    setErrors(e);
    if (Object.keys(e).length > 0) { showToast('يرجى تعبئة الحقول المطلوبة', 'error'); return; }

    const country = countries.find((c) => c.code === form.country);
    if (!country) return;
    const fullPhone = `${form.phoneCode} ${form.phone.trim()}`;

    if (editing) {
      const emailChanged = form.email.trim() !== editing.email;
      const passwordChanged = form.password.trim() !== editing.password;
      updateClient(editing.id, {
        companyName: form.companyName, contactName: form.contactName, email: form.email,
        phone: fullPhone, country: form.country, industry: form.industry, currency: country.currency,
        username: form.email, password: form.password,
      });
      if (emailChanged || passwordChanged) {
        const changed = [emailChanged && 'البريد الإلكتروني', passwordChanged && 'كلمة المرور'].filter(Boolean).join(' و');
        showToast(`تم تحديث ${changed} — تم إرسال بيانات الدخول الجديدة للعميل عبر واتساب والبريد`, 'success');
      } else {
        showToast('تم تحديث بيانات العميل', 'success');
      }
      onSaved?.({ ...editing, ...{
        companyName: form.companyName, contactName: form.contactName, email: form.email,
        phone: fullPhone, country: form.country, industry: form.industry, currency: country.currency,
        username: form.email, password: form.password,
      } });
    } else {
      const created = addClient({
        companyName: form.companyName, contactName: form.contactName, email: form.email,
        phone: fullPhone, country: form.country, industry: form.industry,
        status: form.startWithTrial ? 'trial' : 'inactive',
        planId: null, currency: country.currency,
        username: form.email, password: form.password,
        ...(form.startWithTrial
          ? { trialEndsAt: new Date(Date.now() + TRIAL_DAYS * 86400000).toISOString() }
          : {}),
        dashboardUrl: '',
      });
      showToast(`تمت إضافة: ${form.companyName}`, 'success');
      onSaved?.(created);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {onBack && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 -me-1"
                onClick={onBack}
                title="رجوع"
                aria-label="رجوع"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle>{editing ? `تعديل ${editing.companyName}` : 'إضافة عميل جديد'}</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
          {/* معلومات الشركة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">اسم الشركة<span className="text-destructive ms-0.5">*</span></Label>
              <Input
                id="companyName"
                value={form.companyName}
                onChange={(e) => { setForm({ ...form, companyName: e.target.value }); setErrors({ ...errors, companyName: undefined }); }}
              />
              {errors.companyName && <p className="text-sm text-destructive">{errors.companyName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">اسم المدير<span className="text-destructive ms-0.5">*</span></Label>
              <Input
                id="contactName"
                value={form.contactName}
                onChange={(e) => { setForm({ ...form, contactName: e.target.value }); setErrors({ ...errors, contactName: undefined }); }}
              />
              {errors.contactName && <p className="text-sm text-destructive">{errors.contactName}</p>}
            </div>
            <div className="space-y-2">
              <Label>الدولة<span className="text-destructive ms-0.5">*</span></Label>
              <Select value={form.country} onValueChange={(v) => {
                const dc = countries.find((c) => c.code === v)?.dialCode || form.phoneCode;
                setForm({ ...form, country: v, phoneCode: dc }); setErrors({ ...errors, country: undefined });
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدولة" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>{c.flag} {c.nameAr} ({c.currency})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
            </div>
            <div className="space-y-2">
              <Label>مجال العمل<span className="text-muted-foreground text-[10px] ms-1">(اختياري)</span></Label>
              <Select value={form.industry} onValueChange={(v) => { setForm({ ...form, industry: v }); setErrors({ ...errors, industry: undefined }); }}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر مجال العمل" />
                </SelectTrigger>
                <SelectContent>
                  {industries.filter((ind) => ind.active || ind.name === form.industry).map((ind) => (
                    <SelectItem key={ind.id} value={ind.name}>{ind.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && <p className="text-sm text-destructive">{errors.industry}</p>}
            </div>
          </div>

          {/* بيانات الدخول */}
          <div className="pt-2 border-t">
            <p className="text-sm font-semibold mb-3">بيانات الدخول للوحة العميل</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني<span className="text-destructive ms-0.5">*</span></Label>
                <div className="relative">
                  <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="ps-9"
                    value={form.email}
                    onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: undefined }); }}
                    placeholder="example@company.com"
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف<span className="text-destructive ms-0.5">*</span></Label>
                <div className="flex gap-0 border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring" dir="ltr">
                  <Select value={form.phoneCode} onValueChange={(v) => setForm({ ...form, phoneCode: v })}>
                    <SelectTrigger className="w-[110px] shrink-0 border-0 rounded-none border-e shadow-none focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.code} value={c.dialCode}>
                          {c.flag} {c.dialCode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    dir="ltr"
                    className="flex-1 border-0 rounded-none shadow-none focus-visible:ring-0"
                    value={form.phone}
                    onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: undefined }); }}
                    placeholder="9xxx xxxx"
                  />
                </div>
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="password">كلمة المرور<span className="text-destructive ms-0.5">*</span></Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPwd ? 'text' : 'password'}
                      className="ps-9 pe-9 font-mono"
                      value={form.password}
                      onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: undefined }); }}
                    />
                    <button
                      type="button"
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPwd(!showPwd)}
                    >
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => setForm({ ...form, password: generatePassword() })}
                    title="توليد كلمة مرور جديدة"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => { navigator.clipboard.writeText(form.password); showToast('تم نسخ كلمة المرور', 'success'); }}
                    title="نسخ كلمة المرور"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              {!editing && (
                <div className="sm:col-span-2 pt-2 border-t">
                  <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2.5 mb-3">
                    <div>
                      <p className="text-sm font-medium">تفعيل الباقة التجريبية</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {form.startWithTrial
                          ? `يبدأ العميل بفترة تجريبية ${TRIAL_DAYS} يوماً — وهي متاحة مرة واحدة فقط له`
                          : 'يُسجَّل العميل بحالة غير مفعّل، وتبقى تجربته متاحة لاستخدامها لاحقاً'}
                      </p>
                    </div>
                    <Switch
                      checked={form.startWithTrial}
                      onCheckedChange={(v) => setForm({ ...form, startWithTrial: v })}
                    />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">إرسال بيانات الدخول للعميل</p>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2 rounded-md border px-3 py-2 flex-1">
                      <MessageSquare className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm flex-1">واتساب</span>
                      <Switch checked={form.sendViaWhatsapp} onCheckedChange={(v) => setForm({ ...form, sendViaWhatsapp: v })} />
                    </div>
                    <div className="flex items-center gap-2 rounded-md border px-3 py-2 flex-1">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span className="text-sm flex-1">البريد الإلكتروني</span>
                      <Switch checked={form.sendViaEmail} onCheckedChange={(v) => setForm({ ...form, sendViaEmail: v })} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
          <Button onClick={submit}>{editing ? 'حفظ' : 'إضافة'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
