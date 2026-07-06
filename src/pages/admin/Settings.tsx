import { useState } from 'react';
import {
  Building,
  Shield,
  Palette,
  AlertTriangle,
  Key,
  FileText,
  Copy,
  Eye,
  EyeOff,
  CreditCard,
  Globe2,
  Coins,
  Share2,
  Plus,
  Trash2,
  Edit2,
} from 'lucide-react';
import AdminPayments from './Payments';
import { useConfirm } from '@components/ui';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
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
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

type Tab = 'general' | 'company' | 'countries' | 'currencies' | 'social' | 'security' | 'appearance' | 'emails' | 'api' | 'payments' | 'danger';

const validTabs: Tab[] = ['general', 'company', 'countries', 'currencies', 'social', 'security', 'appearance', 'emails', 'api', 'payments', 'danger'];

export default function AdminSettings(): JSX.Element {
  const initialTab = ((): Tab => {
    const h = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    return validTabs.includes(h as Tab) ? (h as Tab) : 'general';
  })();
  const [tab, setTab] = useState<Tab>(initialTab);
  const adminUsers = useAdminStore((s) => s.adminUsers);
  const clients = useAdminStore((s) => s.clients);
  const invoices = useAdminStore((s) => s.invoices);
  const countries = useAdminStore((s) => s.countries);
  const addCountry = useAdminStore((s) => s.addCountry);
  const updateCountry = useAdminStore((s) => s.updateCountry);
  const deleteCountry = useAdminStore((s) => s.deleteCountry);
  const showToast = useUIStore((s) => s.showToast);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const securityPrefs = useSettingsStore((s) => s.security);
  const setSecurityPrefs = useSettingsStore((s) => s.setSecurity);
  const company = useSettingsStore((s) => s.company);
  const setCompany = useSettingsStore((s) => s.setCompany);
  const social = useSettingsStore((s) => s.social);
  const setSocial = useSettingsStore((s) => s.setSocial);
  const currencies = useSettingsStore((s) => s.currencies);
  const addCurrency = useSettingsStore((s) => s.addCurrency);
  const updateCurrency = useSettingsStore((s) => s.updateCurrency);
  const removeCurrency = useSettingsStore((s) => s.removeCurrency);
  const resetSettings = useSettingsStore((s) => s.reset);
  const { confirm } = useConfirm();

  const [countryModal, setCountryModal] = useState<{ code: string; name: string; nameAr: string; flag: string; currency: string; symbol: string; usdRate: number; isNew: boolean } | null>(null);
  const [currencyModal, setCurrencyModal] = useState<{ code: string; name: string; nameAr: string; symbol: string; usdRate: number; isNew: boolean } | null>(null);

  const [productName, setProductName] = useState('Apex Solutions');
  const [productTagline, setProductTagline] = useState('منصة CRM متكاملة للشركات');
  const [supportEmail, setSupportEmail] = useState('support@apexes.click');
  const [supportPhone, setSupportPhone] = useState('+96891234567');
  const [showApiKey, setShowApiKey] = useState(false);
  const [welcomeTemplate, setWelcomeTemplate] = useState('مرحباً {{client_name}}!\n\nشكراً لتسجيلك في {{product_name}}. حسابك جاهز للاستخدام.\n\nفريق الدعم');
  const [invoiceTemplate, setInvoiceTemplate] = useState('مرحباً {{client_name}},\n\nتم إصدار فاتورة جديدة بمبلغ {{amount}} {{currency}}.\nرقم الفاتورة: {{invoice_number}}\n\nشكراً لثقتكم.');
  const [renewalTemplate, setRenewalTemplate] = useState('مرحباً {{client_name}},\n\nاشتراكك في باقة {{plan_name}} سيتجدد خلال 3 أيام.\nالمبلغ: {{amount}} {{currency}}\n\nللتعديل أو الإلغاء تواصل معنا.');

  const handleExportAll = (): void => {
    const dump = {
      exportedAt: new Date().toISOString(),
      clients,
      invoices,
      adminUsers,
    };
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`تم تصدير ${clients.length} عميل و ${invoices.length} فاتورة`, 'success');
  };

  const handleResetSettings = async (): Promise<void> => {
    const ok = await confirm({
      title: 'إعادة ضبط الإعدادات؟',
      message: 'سيتم إرجاع كل التفضيلات للقيم الافتراضية. لن يتم حذف العملاء أو الفواتير.',
      variant: 'warning',
      confirmText: 'إعادة الضبط',
    });
    if (ok) {
      resetSettings();
      showToast('تمت إعادة الضبط', 'success');
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'general', label: 'عام', icon: <Building className="h-4 w-4" /> },
    { key: 'company', label: 'الشركة', icon: <Building className="h-4 w-4" /> },
    { key: 'countries', label: 'الدول', icon: <Globe2 className="h-4 w-4" /> },
    { key: 'currencies', label: 'العملات', icon: <Coins className="h-4 w-4" /> },
    { key: 'social', label: 'التواصل الاجتماعي', icon: <Share2 className="h-4 w-4" /> },
    { key: 'security', label: 'الأمان', icon: <Shield className="h-4 w-4" /> },
    { key: 'emails', label: 'قوالب البريد', icon: <FileText className="h-4 w-4" /> },
    { key: 'api', label: 'مفاتيح API', icon: <Key className="h-4 w-4" /> },
    { key: 'payments', label: 'بوابة الدفع', icon: <CreditCard className="h-4 w-4" /> },
    { key: 'appearance', label: 'المظهر', icon: <Palette className="h-4 w-4" /> },
    { key: 'danger', label: 'منطقة الخطر', icon: <AlertTriangle className="h-4 w-4" /> },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-5">
      <div>
        <h2 className="text-2xl font-bold">الإعدادات</h2>
        <p className="text-sm text-muted-foreground">إعدادات النظام</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
        {/* Sidebar */}
        <Card className="h-fit">
          <CardContent className="p-2">
            {tabs.map((t) => (
              <Button
                key={t.key}
                variant={tab === t.key ? 'default' : 'ghost'}
                onClick={() => setTab(t.key)}
                className={cn(
                  'w-full justify-start gap-3 mb-0.5',
                  t.key === 'danger' && tab !== t.key && 'text-destructive hover:text-destructive'
                )}
              >
                {t.icon}
                {t.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        {tab === 'payments' ? (
          <AdminPayments />
        ) : (
        <Card>
          <CardContent className="p-5 lg:p-6">
            {/* GENERAL */}
            {tab === 'general' && (
              <div>
                <Header icon={<Building className="h-5 w-5" />} title="إعدادات عامة" subtitle="معلومات المنتج الأساسية" />
                <Row label="اسم المنتج" hint="يظهر في الفواتير والإيميلات">
                  <Input value={productName} onChange={(e) => setProductName(e.target.value)} />
                </Row>
                <Row label="الشعار النصي" hint="جملة قصيرة عن المنتج">
                  <Input value={productTagline} onChange={(e) => setProductTagline(e.target.value)} />
                </Row>
                <Row label="بريد الدعم">
                  <Input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
                </Row>
                <Row label="رقم الدعم">
                  <Input value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} />
                </Row>
                <div className="flex justify-end pt-4">
                  <Button onClick={() => showToast('تم الحفظ', 'success')}>حفظ التغييرات</Button>
                </div>
              </div>
            )}

            {/* COMPANY */}
            {tab === 'company' && (
              <div>
                <Header icon={<Building className="h-5 w-5" />} title="بيانات الشركة" subtitle="المعلومات الرسمية للشركة وبيانات التواصل" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>اسم الشركة (عربي)</Label>
                    <Input value={company.name} onChange={(e) => setCompany({ name: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Company Name (EN)</Label>
                    <Input value={company.nameEn} onChange={(e) => setCompany({ nameEn: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5 mt-4">
                  <Label>وصف قصير</Label>
                  <Input value={company.tagline} onChange={(e) => setCompany({ tagline: e.target.value })} />
                </div>
                <Separator className="my-6" />
                <p className="text-sm font-semibold mb-3">بيانات التواصل</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>البريد الإلكتروني</Label>
                    <Input type="email" value={company.email} onChange={(e) => setCompany({ email: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>رقم الهاتف</Label>
                    <Input value={company.phone} onChange={(e) => setCompany({ phone: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>رقم واتساب</Label>
                    <Input value={company.whatsapp} onChange={(e) => setCompany({ whatsapp: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>الموقع الإلكتروني</Label>
                    <Input value={company.website} onChange={(e) => setCompany({ website: e.target.value })} placeholder="https://" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label>العنوان</Label>
                    <Input value={company.address} onChange={(e) => setCompany({ address: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>الدولة</Label>
                    <Select value={company.country} onValueChange={(v) => setCompany({ country: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c.code} value={c.code}>{c.flag} {c.nameAr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator className="my-6" />
                <p className="text-sm font-semibold mb-3">البيانات القانونية</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>الرقم الضريبي</Label>
                    <Input value={company.taxId} onChange={(e) => setCompany({ taxId: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>رقم السجل التجاري</Label>
                    <Input value={company.registrationNumber} onChange={(e) => setCompany({ registrationNumber: e.target.value })} />
                  </div>
                </div>
                <div className="flex justify-end pt-6">
                  <Button onClick={() => showToast('تم حفظ بيانات الشركة', 'success')}>حفظ التغييرات</Button>
                </div>
              </div>
            )}

            {/* COUNTRIES */}
            {tab === 'countries' && (
              <div>
                <Header
                  icon={<Globe2 className="h-5 w-5" />}
                  title="إدارة الدول"
                  subtitle="أضف الدول المدعومة وحدّد عملتها"
                  action={
                    <Button size="sm" onClick={() => setCountryModal({ code: '', name: '', nameAr: '', flag: '', currency: currencies[0]?.code ?? 'USD', symbol: '', usdRate: 1, isNew: true })}>
                      <Plus className="h-4 w-4 me-2" /> إضافة دولة
                    </Button>
                  }
                />
                <div className="rounded-xl border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-xs text-muted-foreground">
                      <tr>
                        <th className="text-start px-3 py-2.5 w-12">#</th>
                        <th className="text-start px-3 py-2.5">الدولة</th>
                        <th className="text-start px-3 py-2.5">الرمز</th>
                        <th className="text-start px-3 py-2.5">العملة</th>
                        <th className="text-start px-3 py-2.5">سعر الصرف (USD)</th>
                        <th className="text-end px-3 py-2.5">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {countries.map((c, idx) => (
                        <tr key={c.code} className="hover:bg-muted/30">
                          <td className="px-3 py-2.5 text-xs text-muted-foreground font-mono">{idx + 1}</td>
                          <td className="px-3 py-2.5">
                            <span className="text-lg me-1.5">{c.flag}</span>
                            <span className="font-medium">{c.nameAr}</span>
                            <span className="text-xs text-muted-foreground ms-2">{c.name}</span>
                          </td>
                          <td className="px-3 py-2.5 font-mono text-xs">{c.code}</td>
                          <td className="px-3 py-2.5">{c.currency} <span className="text-muted-foreground text-xs">({c.symbol})</span></td>
                          <td className="px-3 py-2.5 font-mono text-xs">{c.usdRate}</td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-0.5 justify-end">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setCountryModal({ ...c, isNew: false })}>
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={async () => {
                                const inUse = clients.some((cl) => cl.country === c.code);
                                if (inUse) { showToast('لا يمكن الحذف — الدولة مرتبطة بعملاء', 'error'); return; }
                                const ok = await confirm({ title: `حذف ${c.nameAr}؟`, variant: 'danger', confirmText: 'حذف' });
                                if (ok) { deleteCountry(c.code); showToast('تم الحذف', 'success'); }
                              }}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CURRENCIES */}
            {tab === 'currencies' && (
              <div>
                <Header
                  icon={<Coins className="h-5 w-5" />}
                  title="إدارة العملات"
                  subtitle="العملات المدعومة وأسعار الصرف مقابل الدولار"
                  action={
                    <Button size="sm" onClick={() => setCurrencyModal({ code: '', name: '', nameAr: '', symbol: '', usdRate: 1, isNew: true })}>
                      <Plus className="h-4 w-4 me-2" /> إضافة عملة
                    </Button>
                  }
                />
                <div className="rounded-xl border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-xs text-muted-foreground">
                      <tr>
                        <th className="text-start px-3 py-2.5 w-12">#</th>
                        <th className="text-start px-3 py-2.5">العملة</th>
                        <th className="text-start px-3 py-2.5">الرمز</th>
                        <th className="text-start px-3 py-2.5">علامة</th>
                        <th className="text-start px-3 py-2.5">1 USD =</th>
                        <th className="text-end px-3 py-2.5">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {currencies.map((cur, idx) => (
                        <tr key={cur.code} className="hover:bg-muted/30">
                          <td className="px-3 py-2.5 text-xs text-muted-foreground font-mono">{idx + 1}</td>
                          <td className="px-3 py-2.5">
                            <p className="font-medium">{cur.nameAr}</p>
                            <p className="text-xs text-muted-foreground">{cur.name}</p>
                          </td>
                          <td className="px-3 py-2.5 font-mono text-xs">{cur.code}</td>
                          <td className="px-3 py-2.5">{cur.symbol}</td>
                          <td className="px-3 py-2.5 font-mono text-xs">{cur.usdRate} {cur.code}</td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-0.5 justify-end">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setCurrencyModal({ ...cur, isNew: false })}>
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={async () => {
                                const inUse = countries.some((c) => c.currency === cur.code);
                                if (inUse) { showToast('لا يمكن الحذف — العملة مستخدمة في دول', 'error'); return; }
                                const ok = await confirm({ title: `حذف ${cur.nameAr}؟`, variant: 'danger', confirmText: 'حذف' });
                                if (ok) { removeCurrency(cur.code); showToast('تم الحذف', 'success'); }
                              }}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SOCIAL */}
            {tab === 'social' && (
              <div>
                <Header icon={<Share2 className="h-5 w-5" />} title="روابط التواصل الاجتماعي" subtitle="روابط منصات الشركة على الشبكات الاجتماعية" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {([
                    ['facebook', 'Facebook', 'https://facebook.com/...'],
                    ['twitter', 'X (Twitter)', 'https://x.com/...'],
                    ['instagram', 'Instagram', 'https://instagram.com/...'],
                    ['linkedin', 'LinkedIn', 'https://linkedin.com/company/...'],
                    ['youtube', 'YouTube', 'https://youtube.com/@...'],
                    ['tiktok', 'TikTok', 'https://tiktok.com/@...'],
                    ['telegram', 'Telegram', 'https://t.me/...'],
                    ['snapchat', 'Snapchat', 'https://snapchat.com/add/...'],
                  ] as const).map(([key, label, placeholder]) => (
                    <div key={key} className="space-y-1.5">
                      <Label>{label}</Label>
                      <Input
                        value={social[key]}
                        onChange={(e) => setSocial({ [key]: e.target.value })}
                        placeholder={placeholder}
                        dir="ltr"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-6">
                  <Button onClick={() => showToast('تم حفظ الروابط', 'success')}>حفظ التغييرات</Button>
                </div>
              </div>
            )}

            {/* SECURITY */}
            {tab === 'security' && (
              <div>
                <Header icon={<Shield className="h-5 w-5" />} title="الأمان" subtitle="تأمين الوصول للوحة الإدارة" />
                <Row label="المصادقة الثنائية (2FA)" hint="طبقة أمان إضافية">
                  <Switch
                    checked={securityPrefs.twoFactor}
                    onCheckedChange={(v) => {
                      setSecurityPrefs({ twoFactor: v });
                      showToast(v ? 'تم تفعيل 2FA' : 'تم تعطيل 2FA', 'success');
                    }}
                  />
                </Row>
                <Row label="انتهاء الجلسة" hint="بعد كم دقيقة بدون نشاط">
                  <Select
                    value={String(securityPrefs.sessionTimeoutMin)}
                    onValueChange={(v) => {
                      setSecurityPrefs({ sessionTimeoutMin: Number(v) });
                      showToast('تم الحفظ', 'success');
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 دقيقة</SelectItem>
                      <SelectItem value="30">30 دقيقة</SelectItem>
                      <SelectItem value="60">ساعة</SelectItem>
                      <SelectItem value="480">8 ساعات</SelectItem>
                    </SelectContent>
                  </Select>
                </Row>
                <Row label="تقييد IP" hint="السماح فقط من IPs محددة">
                  <Switch
                    checked={securityPrefs.ipRestriction}
                    onCheckedChange={(v) => {
                      setSecurityPrefs({ ipRestriction: v });
                      showToast(v ? 'تم التفعيل' : 'تم التعطيل', 'success');
                    }}
                  />
                </Row>
              </div>
            )}

            {/* EMAIL TEMPLATES */}
            {tab === 'emails' && (
              <div>
                <Header icon={<FileText className="h-5 w-5" />} title="قوالب البريد الإلكتروني" subtitle="تخصيص رسائل البريد المرسلة للعملاء" />
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">رسالة الترحيب</Label>
                      <Badge variant="secondary" className="text-[10px]">عند التسجيل</Badge>
                    </div>
                    <Textarea
                      value={welcomeTemplate}
                      onChange={(e) => setWelcomeTemplate(e.target.value)}
                      rows={5}
                      className="font-mono text-sm"
                      dir="rtl"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      المتغيرات: {'{{client_name}}'}, {'{{product_name}}'}, {'{{dashboard_url}}'}
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">إشعار فاتورة</Label>
                      <Badge variant="secondary" className="text-[10px]">عند إصدار فاتورة</Badge>
                    </div>
                    <Textarea
                      value={invoiceTemplate}
                      onChange={(e) => setInvoiceTemplate(e.target.value)}
                      rows={5}
                      className="font-mono text-sm"
                      dir="rtl"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      المتغيرات: {'{{client_name}}'}, {'{{amount}}'}, {'{{currency}}'}, {'{{invoice_number}}'}
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">تذكير تجديد</Label>
                      <Badge variant="secondary" className="text-[10px]">قبل التجديد بـ3 أيام</Badge>
                    </div>
                    <Textarea
                      value={renewalTemplate}
                      onChange={(e) => setRenewalTemplate(e.target.value)}
                      rows={5}
                      className="font-mono text-sm"
                      dir="rtl"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      المتغيرات: {'{{client_name}}'}, {'{{plan_name}}'}, {'{{amount}}'}, {'{{currency}}'}
                    </p>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button onClick={() => showToast('تم حفظ القوالب', 'success')}>حفظ القوالب</Button>
                  </div>
                </div>
              </div>
            )}

            {/* API KEYS */}
            {tab === 'api' && (
              <div>
                <Header icon={<Key className="h-5 w-5" />} title="مفاتيح API" subtitle="مفاتيح الوصول للتكامل مع الأنظمة الخارجية" />
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold">المفتاح العام (Public Key)</p>
                        <p className="text-xs text-muted-foreground">للاستخدام في واجهة العميل</p>
                      </div>
                      <Badge variant="default" className="text-[10px]">نشط</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Input
                        readOnly
                        value="pk_live_qhub_8f3a2bd4c5e9a1b7d6f0"
                        className="font-mono text-xs bg-background"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 flex-shrink-0"
                        onClick={() => {
                          void navigator.clipboard.writeText('pk_live_qhub_8f3a2bd4c5e9a1b7d6f0');
                          showToast('تم النسخ', 'success');
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold">المفتاح السري (Secret Key)</p>
                        <p className="text-xs text-muted-foreground">للاستخدام في الخادم فقط — لا تشاركه أبداً</p>
                      </div>
                      <Badge variant="destructive" className="text-[10px]">سري</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Input
                        readOnly
                        value={showApiKey ? 'sk_live_qhub_7e2f9c4d8a1b5e3f6d0a9c' : '••••••••••••••••••••••••••'}
                        className="font-mono text-xs bg-background"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 flex-shrink-0"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 flex-shrink-0"
                        onClick={() => {
                          void navigator.clipboard.writeText('sk_live_qhub_7e2f9c4d8a1b5e3f6d0a9c');
                          showToast('تم النسخ', 'success');
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold">Webhook URL</p>
                        <p className="text-xs text-muted-foreground">عنوان استقبال الأحداث من النظام</p>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">مُعد</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Input
                        readOnly
                        value="https://api.apexes.click/webhooks/qhub"
                        className="font-mono text-xs bg-background"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 flex-shrink-0"
                        onClick={() => {
                          void navigator.clipboard.writeText('https://api.apexes.click/webhooks/qhub');
                          showToast('تم النسخ', 'success');
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator />
                  <div className="flex items-center justify-between p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
                    <div>
                      <p className="text-sm font-semibold">إعادة توليد المفتاح السري</p>
                      <p className="text-xs text-muted-foreground">سيتم إلغاء المفتاح الحالي فوراً</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showToast('تم توليد مفتاح جديد (تجريبي)', 'info')}
                    >
                      إعادة التوليد
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* APPEARANCE */}
            {tab === 'appearance' && (
              <div>
                <Header icon={<Palette className="h-5 w-5" />} title="المظهر" subtitle="خصّص واجهة لوحة الإدارة" />
                <Row label="السمة">
                  <div className="grid grid-cols-2 gap-3 max-w-md">
                    <button
                      onClick={() => setTheme('light')}
                      className={cn(
                        'rounded-lg border-2 p-4 transition-all text-start',
                        theme === 'light' ? 'border-primary ring-2 ring-primary/20' : 'border'
                      )}
                    >
                      <div className="h-16 rounded-lg bg-gradient-to-br from-white to-gray-100 border mb-2" />
                      <p className="text-sm font-medium">فاتح</p>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={cn(
                        'rounded-lg border-2 p-4 transition-all text-start',
                        theme === 'dark' ? 'border-primary ring-2 ring-primary/20' : 'border'
                      )}
                    >
                      <div className="h-16 rounded-lg bg-gradient-to-br from-[#1A1D27] to-[#0F1117] border border-gray-700 mb-2" />
                      <p className="text-sm font-medium">داكن</p>
                    </button>
                  </div>
                </Row>
              </div>
            )}

            {/* DANGER */}
            {tab === 'danger' && (
              <div>
                <Header icon={<AlertTriangle className="h-5 w-5 text-destructive" />} title="منطقة الخطر" subtitle="إجراءات لا يمكن التراجع عنها" />
                <div className="space-y-3">
                  <DangerAction title="إعادة ضبط الإعدادات" hint="إرجاع جميع الإعدادات للقيم الافتراضية" onConfirm={handleResetSettings} cta="إعادة ضبط" />
                  <DangerAction title="تصدير كل البيانات" hint="JSON بكل العملاء والفواتير والمستخدمين" onConfirm={handleExportAll} cta="تصدير الآن" variant="secondary" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        )}
      </div>

      {/* Country Modal */}
      <Dialog open={!!countryModal} onOpenChange={(o) => { if (!o) setCountryModal(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{countryModal?.isNew ? 'إضافة دولة' : 'تعديل دولة'}</DialogTitle>
          </DialogHeader>
          {countryModal && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>الرمز (ISO)</Label>
                <Input
                  value={countryModal.code}
                  onChange={(e) => setCountryModal({ ...countryModal, code: e.target.value.toUpperCase() })}
                  placeholder="OM"
                  maxLength={3}
                  disabled={!countryModal.isNew}
                />
              </div>
              <div className="space-y-1.5">
                <Label>العلم</Label>
                <Input
                  value={countryModal.flag}
                  onChange={(e) => setCountryModal({ ...countryModal, flag: e.target.value })}
                  placeholder="🇴🇲"
                />
              </div>
              <div className="space-y-1.5">
                <Label>الاسم (عربي)</Label>
                <Input
                  value={countryModal.nameAr}
                  onChange={(e) => setCountryModal({ ...countryModal, nameAr: e.target.value })}
                  placeholder="سلطنة عُمان"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Name (EN)</Label>
                <Input
                  value={countryModal.name}
                  onChange={(e) => setCountryModal({ ...countryModal, name: e.target.value })}
                  placeholder="Oman"
                />
              </div>
              <div className="space-y-1.5">
                <Label>العملة</Label>
                <Select
                  value={countryModal.currency}
                  onValueChange={(v) => {
                    const cur = currencies.find((c) => c.code === v);
                    setCountryModal({ ...countryModal, currency: v, symbol: cur?.symbol ?? countryModal.symbol, usdRate: cur?.usdRate ?? countryModal.usdRate });
                  }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c.code} value={c.code}>{c.code} — {c.nameAr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>سعر الصرف (1 USD)</Label>
                <Input
                  type="number"
                  step="0.001"
                  value={countryModal.usdRate}
                  onChange={(e) => setCountryModal({ ...countryModal, usdRate: Number(e.target.value) })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCountryModal(null)}>إلغاء</Button>
            <Button
              onClick={() => {
                if (!countryModal) return;
                if (!countryModal.code || !countryModal.nameAr) { showToast('الرمز والاسم مطلوبان', 'error'); return; }
                if (countryModal.isNew) {
                  if (countries.some((c) => c.code === countryModal.code)) { showToast('الرمز موجود مسبقاً', 'error'); return; }
                  addCountry({ code: countryModal.code, name: countryModal.name, nameAr: countryModal.nameAr, flag: countryModal.flag, currency: countryModal.currency, symbol: countryModal.symbol, usdRate: countryModal.usdRate });
                  showToast('تمت الإضافة', 'success');
                } else {
                  updateCountry(countryModal.code, { name: countryModal.name, nameAr: countryModal.nameAr, flag: countryModal.flag, currency: countryModal.currency, symbol: countryModal.symbol, usdRate: countryModal.usdRate });
                  showToast('تم الحفظ', 'success');
                }
                setCountryModal(null);
              }}
            >حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Currency Modal */}
      <Dialog open={!!currencyModal} onOpenChange={(o) => { if (!o) setCurrencyModal(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{currencyModal?.isNew ? 'إضافة عملة' : 'تعديل عملة'}</DialogTitle>
          </DialogHeader>
          {currencyModal && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>الرمز (ISO)</Label>
                <Input
                  value={currencyModal.code}
                  onChange={(e) => setCurrencyModal({ ...currencyModal, code: e.target.value.toUpperCase() })}
                  placeholder="OMR"
                  maxLength={3}
                  disabled={!currencyModal.isNew}
                />
              </div>
              <div className="space-y-1.5">
                <Label>العلامة</Label>
                <Input
                  value={currencyModal.symbol}
                  onChange={(e) => setCurrencyModal({ ...currencyModal, symbol: e.target.value })}
                  placeholder="ر.ع"
                />
              </div>
              <div className="space-y-1.5">
                <Label>الاسم (عربي)</Label>
                <Input
                  value={currencyModal.nameAr}
                  onChange={(e) => setCurrencyModal({ ...currencyModal, nameAr: e.target.value })}
                  placeholder="ريال عُماني"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Name (EN)</Label>
                <Input
                  value={currencyModal.name}
                  onChange={(e) => setCurrencyModal({ ...currencyModal, name: e.target.value })}
                  placeholder="Omani Rial"
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>سعر مقابل 1 USD</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={currencyModal.usdRate}
                  onChange={(e) => setCurrencyModal({ ...currencyModal, usdRate: Number(e.target.value) })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCurrencyModal(null)}>إلغاء</Button>
            <Button
              onClick={() => {
                if (!currencyModal) return;
                if (!currencyModal.code || !currencyModal.nameAr) { showToast('الرمز والاسم مطلوبان', 'error'); return; }
                if (currencyModal.isNew) {
                  if (currencies.some((c) => c.code === currencyModal.code)) { showToast('الرمز موجود مسبقاً', 'error'); return; }
                  addCurrency({ code: currencyModal.code, name: currencyModal.name, nameAr: currencyModal.nameAr, symbol: currencyModal.symbol, usdRate: currencyModal.usdRate });
                  showToast('تمت الإضافة', 'success');
                } else {
                  updateCurrency(currencyModal.code, { name: currencyModal.name, nameAr: currencyModal.nameAr, symbol: currencyModal.symbol, usdRate: currencyModal.usdRate });
                  showToast('تم الحفظ', 'success');
                }
                setCurrencyModal(null);
              }}
            >حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Header({ icon, title, subtitle, action }: { icon: React.ReactNode; title: string; subtitle: string; action?: React.ReactNode }): JSX.Element {
  return (
    <div className="mb-6 pb-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="text-primary">{icon}</span> {title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
        {action}
      </div>
      <Separator className="mt-5" />
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }): JSX.Element {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-3 lg:gap-6 py-4 border-b last:border-b-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function DangerAction({ title, hint, cta, onConfirm, variant = 'danger' }: { title: string; hint: string; cta: string; onConfirm: () => void | Promise<void>; variant?: 'danger' | 'secondary' }): JSX.Element {
  return (
    <div
      className={cn(
        'p-4 rounded-lg border flex items-center justify-between gap-3 flex-wrap',
        variant === 'danger' ? 'border-destructive/30 bg-destructive/5' : 'bg-muted'
      )}
    >
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <Button
        variant={variant === 'danger' ? 'destructive' : 'outline'}
        size="sm"
        onClick={() => { void onConfirm(); }}
      >
        {cta}
      </Button>
    </div>
  );
}
