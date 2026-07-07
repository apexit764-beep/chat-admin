import { useState, useRef, useEffect } from 'react';
import {
  Building,
  Palette,
  FileText,
  CreditCard,
  Globe2,
  Coins,
  Plus,
  Trash2,
  Edit2,
  FileStack,
  Eye,
  EyeOff,
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  Camera,
  Bell,
  Save,
  Pencil,
} from 'lucide-react';
import { useConfirm } from '@components/ui';
import { useAdminStore } from '@/store/useAdminStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { initials, avatarColor } from '@/utils/format';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

type Tab = 'profile' | 'company' | 'countries' | 'currencies' | 'appearance' | 'emails' | 'payments' | 'pages';

const validTabs: Tab[] = ['profile', 'company', 'countries', 'currencies', 'appearance', 'emails', 'payments', 'pages'];

const PAYMENT_METHODS = [
  { key: 'card', label: 'كارد (Visa / MasterCard)' },
  { key: 'apple_pay', label: 'آبل باي (Apple Pay)' },
  { key: 'google_pay', label: 'جوجل باي (Google Pay)' },
  { key: 'bank_transfer', label: 'تحويل بنكي' },
] as const;

export default function AdminSettings(): JSX.Element {
  const initialTab = ((): Tab => {
    const h = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    return validTabs.includes(h as Tab) ? (h as Tab) : 'profile';
  })();
  const [tab, setTab] = useState<Tab>(initialTab);
  const user = useAuthStore((s) => s.user);
  const clients = useAdminStore((s) => s.clients);
  const countries = useAdminStore((s) => s.countries);
  const addCountry = useAdminStore((s) => s.addCountry);
  const updateCountry = useAdminStore((s) => s.updateCountry);
  const deleteCountry = useAdminStore((s) => s.deleteCountry);
  const showToast = useUIStore((s) => s.showToast);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const company = useSettingsStore((s) => s.company);
  const setCompany = useSettingsStore((s) => s.setCompany);
  const social = useSettingsStore((s) => s.social);
  const setSocial = useSettingsStore((s) => s.setSocial);
  const currencies = useSettingsStore((s) => s.currencies);
  const addCurrency = useSettingsStore((s) => s.addCurrency);
  const updateCurrency = useSettingsStore((s) => s.updateCurrency);
  const removeCurrency = useSettingsStore((s) => s.removeCurrency);
  const { confirm } = useConfirm();

  const [countryModal, setCountryModal] = useState<{ code: string; name: string; nameAr: string; flag: string; currency: string; symbol: string; usdRate: number; isNew: boolean } | null>(null);
  const [currencyModal, setCurrencyModal] = useState<{ code: string; name: string; nameAr: string; symbol: string; usdRate: number; isNew: boolean } | null>(null);

  const [profileName, setProfileName] = useState(user?.name ?? '');
  const [profileEmail, setProfileEmail] = useState(user?.email ?? '');
  const [profilePhone, setProfilePhone] = useState('');
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdOpen, setPwdOpen] = useState(false);
  const [emailEditOpen, setEmailEditOpen] = useState(false);
  const [phoneEditOpen, setPhoneEditOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [otpSentEmail, setOtpSentEmail] = useState(false);
  const [otpSentPhone, setOtpSentPhone] = useState(false);
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
  const [phoneOtp, setPhoneOtp] = useState(['', '', '', '', '', '']);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(false);
  const [notifyInApp, setNotifyInApp] = useState(true);
  // Email templates CRUD
  type EmailTemplate = { id: string; name: string; subject: string; body: string; trigger: string };
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([
    { id: '1', name: 'رسالة الترحيب', subject: 'مرحباً بك في {{product_name}}', body: 'مرحباً {{client_name}}!\n\nشكراً لتسجيلك في {{product_name}}. حسابك جاهز للاستخدام.\n\nفريق الدعم', trigger: 'عند التسجيل' },
    { id: '2', name: 'إشعار فاتورة', subject: 'فاتورة جديدة #{{invoice_number}}', body: 'مرحباً {{client_name}},\n\nتم إصدار فاتورة جديدة بمبلغ {{amount}} {{currency}}.\nرقم الفاتورة: {{invoice_number}}\n\nشكراً لثقتكم.', trigger: 'عند إصدار فاتورة' },
    { id: '3', name: 'تذكير تجديد', subject: 'تجديد اشتراكك في {{plan_name}}', body: 'مرحباً {{client_name}},\n\nاشتراكك في باقة {{plan_name}} سيتجدد خلال 3 أيام.\nالمبلغ: {{amount}} {{currency}}\n\nللتعديل أو الإلغاء تواصل معنا.', trigger: 'قبل التجديد بـ3 أيام' },
  ]);
  const [emailModal, setEmailModal] = useState<(EmailTemplate & { isNew: boolean }) | null>(null);

  // Pages CRUD
  type PageItem = { id: string; title: string; slug: string; content: string; status: 'published' | 'draft' };
  const [pages, setPages] = useState<PageItem[]>([
    { id: '1', title: 'شروط الاستخدام', slug: 'terms', content: '# شروط الاستخدام\n\nمرحباً بكم في Qhub. باستخدامك لهذه الخدمة فإنك توافق على الشروط التالية...', status: 'published' },
    { id: '2', title: 'سياسة الخصوصية', slug: 'privacy', content: '# سياسة الخصوصية\n\nنحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية...', status: 'published' },
  ]);
  const [pageModal, setPageModal] = useState<(PageItem & { isNew: boolean }) | null>(null);

  // Payment gateways CRUD
  type PaymentGateway = { id: string; name: string; slug: string; environment: 'sandbox' | 'production'; enabled: boolean; publicKey: string; secretKey: string; email: string; jsonConfig: string; countries: string[]; methods: string[] };
  const [gateways, setGateways] = useState<PaymentGateway[]>([
    { id: '1', name: 'بايموب', slug: 'paymob', environment: 'sandbox', enabled: true, publicKey: 'pk_test_12345', secretKey: 'sk_test_67890', email: 'demo@company.com', jsonConfig: '{"e_pay_integration_id":67890,"hmac_secret":"YOUR_HMAC","param_3d":"non3d","use_intention_api":true,"api_base_url":"https://accept.paymob.com/api","integration_id":12345,"app1"}', countries: ['PS', 'EG', 'SA', 'IQ'], methods: ['card', 'apple_pay'] },
  ]);
  const [gatewayModal, setGatewayModal] = useState<(PaymentGateway & { isNew: boolean }) | null>(null);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'profile', label: 'الملف الشخصي', icon: <UserIcon className="h-4 w-4" /> },
    { key: 'company', label: 'الشركة', icon: <Building className="h-4 w-4" /> },
    { key: 'countries', label: 'الدول', icon: <Globe2 className="h-4 w-4" /> },
    { key: 'currencies', label: 'العملات', icon: <Coins className="h-4 w-4" /> },
    { key: 'emails', label: 'قوالب البريد', icon: <FileText className="h-4 w-4" /> },
    { key: 'payments', label: 'بوابات الدفع', icon: <CreditCard className="h-4 w-4" /> },
    { key: 'appearance', label: 'المظهر', icon: <Palette className="h-4 w-4" /> },
    { key: 'pages', label: 'الصفحات', icon: <FileStack className="h-4 w-4" /> },
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
                className="w-full justify-start gap-3 mb-0.5"
              >
                {t.icon}
                {t.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 lg:p-6">
            {/* PROFILE */}
            {tab === 'profile' && user && (
              <div className="space-y-6">
                <Header
                  icon={<UserIcon className="h-5 w-5" />}
                  title="الملف الشخصي"
                  subtitle="إدارة بيانات حسابك وتفضيلاتك"
                  action={
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => setPwdOpen(true)}>
                      <Lock className="h-4 w-4" />
                      تغيير كلمة المرور
                    </Button>
                  }
                />

                {/* Basic info */}
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        <AvatarFallback className={`text-xl font-bold ${avatarColor(user.name)}`}>
                          {initials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        className="absolute -bottom-1 -end-1 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                        title="تغيير الصورة"
                        onClick={() => showToast('تحميل الصورة (تجريبي)', 'info')}
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">مدير النظام</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>الاسم الكامل</Label>
                      <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="flex items-center justify-between">
                        <span>البريد الإلكتروني</span>
                        <span className="text-[11px] text-muted-foreground font-normal">لتغيير البريد يتم إرسال رمز تحقق</span>
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Mail className="h-4 w-4 absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input type="email" value={profileEmail} disabled className="pe-9 bg-muted/50" />
                        </div>
                        <Button variant="outline" size="sm" className="gap-1.5 flex-shrink-0" onClick={() => setEmailEditOpen(true)}>
                          <Pencil className="h-3.5 w-3.5" />
                          تعديل
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label className="flex items-center justify-between">
                        <span>رقم الهاتف</span>
                        <span className="text-[11px] text-muted-foreground font-normal">لتغيير الرقم يتم إرسال رمز تحقق</span>
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Phone className="h-4 w-4 absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input value={profilePhone || '+96891234567'} disabled className="pe-9 bg-muted/50" />
                        </div>
                        <Button variant="outline" size="sm" className="gap-1.5 flex-shrink-0" onClick={() => setPhoneEditOpen(true)}>
                          <Pencil className="h-3.5 w-3.5" />
                          تعديل
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => showToast('تم حفظ البيانات', 'success')}>
                      <Save className="h-4 w-4 me-2" />
                      حفظ التغييرات
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Password change dialog */}
                <Dialog open={pwdOpen} onOpenChange={(o) => {
                  setPwdOpen(o);
                  if (!o) { setCurrentPwd(''); setNewPwd(''); setConfirmPwd(''); }
                }}>
                  <DialogContent className="sm:max-w-md" dir="rtl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-primary" />
                        تغيير كلمة المرور
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-1.5">
                        <Label>كلمة المرور الحالية</Label>
                        <Input type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} autoFocus />
                      </div>
                      <div className="space-y-1.5">
                        <Label>كلمة المرور الجديدة</Label>
                        <Input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>تأكيد كلمة المرور</Label>
                        <Input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setPwdOpen(false)}>إلغاء</Button>
                      <Button onClick={() => {
                        if (!currentPwd || !newPwd || !confirmPwd) { showToast('املأ جميع الحقول', 'error'); return; }
                        if (newPwd !== confirmPwd) { showToast('كلمة المرور الجديدة غير مطابقة', 'error'); return; }
                        if (newPwd.length < 6) { showToast('كلمة المرور 6 أحرف على الأقل', 'error'); return; }
                        setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
                        setPwdOpen(false);
                        showToast('تم تحديث كلمة المرور', 'success');
                      }}>تحديث</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Email edit dialog */}
                <OtpVerifyDialog
                  open={emailEditOpen}
                  onOpenChange={(o) => {
                    setEmailEditOpen(o);
                    if (!o) { setNewEmail(''); setOtpSentEmail(false); setEmailOtp(['', '', '', '', '', '']); }
                  }}
                  icon={<Mail className="h-4 w-4 text-primary" />}
                  title="تغيير البريد الإلكتروني"
                  label="البريد الإلكتروني الجديد"
                  inputType="email"
                  placeholder="example@domain.com"
                  value={newEmail}
                  onValueChange={setNewEmail}
                  otpSent={otpSentEmail}
                  otp={emailOtp}
                  onOtpChange={setEmailOtp}
                  onSendCode={() => {
                    if (!newEmail) { showToast('أدخل البريد الإلكتروني الجديد', 'error'); return; }
                    setOtpSentEmail(true);
                    showToast('تم إرسال رمز التحقق إلى بريدك الجديد', 'success');
                  }}
                  onVerify={() => {
                    const code = emailOtp.join('');
                    if (code.length < 6) { showToast('أدخل رمز التحقق كاملاً', 'error'); return; }
                    setProfileEmail(newEmail);
                    setEmailEditOpen(false);
                    setNewEmail(''); setOtpSentEmail(false); setEmailOtp(['', '', '', '', '', '']);
                    showToast('تم تحديث البريد الإلكتروني بنجاح', 'success');
                  }}
                />

                {/* Phone edit dialog */}
                <OtpVerifyDialog
                  open={phoneEditOpen}
                  onOpenChange={(o) => {
                    setPhoneEditOpen(o);
                    if (!o) { setNewPhone(''); setOtpSentPhone(false); setPhoneOtp(['', '', '', '', '', '']); }
                  }}
                  icon={<Phone className="h-4 w-4 text-primary" />}
                  title="تغيير رقم الهاتف"
                  label="رقم الهاتف الجديد"
                  inputType="tel"
                  placeholder="+96891234567"
                  value={newPhone}
                  onValueChange={setNewPhone}
                  otpSent={otpSentPhone}
                  otp={phoneOtp}
                  onOtpChange={setPhoneOtp}
                  dir="ltr"
                  onSendCode={() => {
                    if (!newPhone) { showToast('أدخل رقم الهاتف الجديد', 'error'); return; }
                    setOtpSentPhone(true);
                    showToast('تم إرسال رمز التحقق إلى رقمك الجديد', 'success');
                  }}
                  onVerify={() => {
                    const code = phoneOtp.join('');
                    if (code.length < 6) { showToast('أدخل رمز التحقق كاملاً', 'error'); return; }
                    setProfilePhone(newPhone);
                    setPhoneEditOpen(false);
                    setNewPhone(''); setOtpSentPhone(false); setPhoneOtp(['', '', '', '', '', '']);
                    showToast('تم تحديث رقم الهاتف بنجاح', 'success');
                  }}
                />

                {/* Notification preferences */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    تفضيلات الإشعارات
                  </h3>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">إشعارات البريد الإلكتروني</p>
                      <p className="text-xs text-muted-foreground">تلقّي إشعارات على بريدك</p>
                    </div>
                    <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">إشعارات المتصفح (Push)</p>
                      <p className="text-xs text-muted-foreground">إشعارات فورية في المتصفح</p>
                    </div>
                    <Switch checked={notifyPush} onCheckedChange={setNotifyPush} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">إشعارات داخل التطبيق</p>
                      <p className="text-xs text-muted-foreground">إشعارات في جرس اللوحة</p>
                    </div>
                    <Switch checked={notifyInApp} onCheckedChange={setNotifyInApp} />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => showToast('تم حفظ تفضيلات الإشعارات', 'success')}>حفظ التفضيلات</Button>
                  </div>
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
                <Separator className="my-6" />
                <p className="text-sm font-semibold mb-3">روابط التواصل الاجتماعي</p>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>الدولة</TableHead>
                      <TableHead>الرمز</TableHead>
                      <TableHead>العملة</TableHead>
                      <TableHead>سعر الصرف (USD)</TableHead>
                      <TableHead className="text-end">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {countries.map((c, idx) => (
                      <TableRow key={c.code}>
                        <TableCell className="text-xs text-muted-foreground font-mono">{idx + 1}</TableCell>
                        <TableCell>
                          <span className="text-lg me-1.5">{c.flag}</span>
                          <span className="font-medium">{c.nameAr}</span>
                          <span className="text-xs text-muted-foreground ms-2">{c.name}</span>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{c.code}</TableCell>
                        <TableCell>{c.currency} <span className="text-muted-foreground text-xs">({c.symbol})</span></TableCell>
                        <TableCell className="font-mono text-xs">{c.usdRate}</TableCell>
                        <TableCell>
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>العملة</TableHead>
                      <TableHead>الرمز</TableHead>
                      <TableHead>علامة</TableHead>
                      <TableHead>1 USD =</TableHead>
                      <TableHead className="text-end">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currencies.map((cur, idx) => (
                      <TableRow key={cur.code}>
                        <TableCell className="text-xs text-muted-foreground font-mono">{idx + 1}</TableCell>
                        <TableCell>
                          <p className="font-medium">{cur.nameAr}</p>
                          <p className="text-xs text-muted-foreground">{cur.name}</p>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{cur.code}</TableCell>
                        <TableCell>{cur.symbol}</TableCell>
                        <TableCell className="font-mono text-xs">{cur.usdRate} {cur.code}</TableCell>
                        <TableCell>
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}


            {/* EMAIL TEMPLATES CRUD */}
            {tab === 'emails' && (
              <div>
                <Header
                  icon={<FileText className="h-5 w-5" />}
                  title="قوالب البريد الإلكتروني"
                  subtitle="إدارة قوالب رسائل البريد المرسلة للعملاء"
                  action={
                    <Button size="sm" onClick={() => setEmailModal({ id: String(Date.now()), name: '', subject: '', body: '', trigger: '', isNew: true })}>
                      <Plus className="h-4 w-4 me-2" /> إضافة قالب
                    </Button>
                  }
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>اسم القالب</TableHead>
                      <TableHead>الموضوع</TableHead>
                      <TableHead>المشغّل</TableHead>
                      <TableHead className="text-end">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailTemplates.map((t, idx) => (
                      <TableRow key={t.id}>
                        <TableCell className="text-xs text-muted-foreground font-mono">{idx + 1}</TableCell>
                        <TableCell className="font-medium">{t.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{t.subject}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-[10px]">{t.trigger}</Badge></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-0.5 justify-end">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setEmailModal({ ...t, isNew: false })}>
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={async () => {
                              const ok = await confirm({ title: `حذف "${t.name}"؟`, variant: 'danger', confirmText: 'حذف' });
                              if (ok) { setEmailTemplates((prev) => prev.filter((x) => x.id !== t.id)); showToast('تم الحذف', 'success'); }
                            }}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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

            {/* PAGES CRUD */}
            {tab === 'pages' && (
              <div>
                <Header
                  icon={<FileStack className="h-5 w-5" />}
                  title="الصفحات"
                  subtitle="إدارة الصفحات الثابتة مثل الشروط وسياسة الخصوصية"
                  action={
                    <Button size="sm" onClick={() => setPageModal({ id: String(Date.now()), title: '', slug: '', content: '', status: 'draft', isNew: true })}>
                      <Plus className="h-4 w-4 me-2" /> إضافة صفحة
                    </Button>
                  }
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>عنوان الصفحة</TableHead>
                      <TableHead>الرابط (Slug)</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="text-end">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pages.map((p, idx) => (
                      <TableRow key={p.id}>
                        <TableCell className="text-xs text-muted-foreground font-mono">{idx + 1}</TableCell>
                        <TableCell className="font-medium">{p.title}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">/{p.slug}</TableCell>
                        <TableCell>
                          <Badge variant={p.status === 'published' ? 'default' : 'secondary'} className="text-[10px]">
                            {p.status === 'published' ? 'منشورة' : 'مسودة'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-0.5 justify-end">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setPageModal({ ...p, isNew: false })}>
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={async () => {
                              const ok = await confirm({ title: `حذف "${p.title}"؟`, variant: 'danger', confirmText: 'حذف' });
                              if (ok) { setPages((prev) => prev.filter((x) => x.id !== p.id)); showToast('تم الحذف', 'success'); }
                            }}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* PAYMENTS CRUD */}
            {tab === 'payments' && (
              <div>
                <Header
                  icon={<CreditCard className="h-5 w-5" />}
                  title="بوابات الدفع"
                  subtitle="إدارة بوابات الدفع المتصلة بالنظام"
                  action={
                    <Button size="sm" onClick={() => setGatewayModal({ id: String(Date.now()), name: '', slug: '', environment: 'sandbox', enabled: true, publicKey: '', secretKey: '', email: '', jsonConfig: '', countries: [], methods: [], isNew: true })}>
                      <Plus className="h-4 w-4 me-2" /> إضافة بوابة
                    </Button>
                  }
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>اسم البوابة</TableHead>
                      <TableHead>رمز البوابة</TableHead>
                      <TableHead>البيئة</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="text-end">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gateways.map((g, idx) => (
                      <TableRow key={g.id}>
                        <TableCell className="text-xs text-muted-foreground font-mono">{idx + 1}</TableCell>
                        <TableCell className="font-medium">{g.name}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{g.slug}</TableCell>
                        <TableCell>
                          <Badge variant={g.environment === 'production' ? 'default' : 'secondary'} className="text-[10px]">
                            {g.environment === 'production' ? 'إنتاج' : 'تجريبي'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={g.enabled ? 'default' : 'destructive'} className="text-[10px]">
                            {g.enabled ? 'مفعّل' : 'معطّل'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-0.5 justify-end">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setGatewayModal({ ...g, isNew: false })}>
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={async () => {
                              const ok = await confirm({ title: `حذف "${g.name}"؟`, variant: 'danger', confirmText: 'حذف' });
                              if (ok) { setGateways((prev) => prev.filter((x) => x.id !== g.id)); showToast('تم الحذف', 'success'); }
                            }}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

          </CardContent>
        </Card>
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

      {/* Email Template Modal */}
      <Dialog open={!!emailModal} onOpenChange={(o) => { if (!o) setEmailModal(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{emailModal?.isNew ? 'إضافة قالب بريد' : 'تعديل قالب بريد'}</DialogTitle>
          </DialogHeader>
          {emailModal && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>اسم القالب</Label>
                <Input value={emailModal.name} onChange={(e) => setEmailModal({ ...emailModal, name: e.target.value })} placeholder="رسالة الترحيب" />
              </div>
              <div className="space-y-1.5">
                <Label>الموضوع (Subject)</Label>
                <Input value={emailModal.subject} onChange={(e) => setEmailModal({ ...emailModal, subject: e.target.value })} placeholder="مرحباً {{client_name}}" />
              </div>
              <div className="space-y-1.5">
                <Label>المشغّل (Trigger)</Label>
                <Input value={emailModal.trigger} onChange={(e) => setEmailModal({ ...emailModal, trigger: e.target.value })} placeholder="عند التسجيل" />
              </div>
              <div className="space-y-1.5">
                <Label>محتوى الرسالة</Label>
                <Textarea value={emailModal.body} onChange={(e) => setEmailModal({ ...emailModal, body: e.target.value })} rows={6} className="font-mono text-sm" dir="rtl" />
                <p className="text-[11px] text-muted-foreground">
                  المتغيرات: {'{{client_name}}'}, {'{{product_name}}'}, {'{{amount}}'}, {'{{currency}}'}, {'{{invoice_number}}'}, {'{{plan_name}}'}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailModal(null)}>إلغاء</Button>
            <Button onClick={() => {
              if (!emailModal) return;
              if (!emailModal.name) { showToast('اسم القالب مطلوب', 'error'); return; }
              if (emailModal.isNew) {
                setEmailTemplates((prev) => [...prev, { id: emailModal.id, name: emailModal.name, subject: emailModal.subject, body: emailModal.body, trigger: emailModal.trigger }]);
                showToast('تمت الإضافة', 'success');
              } else {
                setEmailTemplates((prev) => prev.map((t) => t.id === emailModal.id ? { id: t.id, name: emailModal.name, subject: emailModal.subject, body: emailModal.body, trigger: emailModal.trigger } : t));
                showToast('تم الحفظ', 'success');
              }
              setEmailModal(null);
            }}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Page Modal */}
      <Dialog open={!!pageModal} onOpenChange={(o) => { if (!o) setPageModal(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{pageModal?.isNew ? 'إضافة صفحة' : 'تعديل صفحة'}</DialogTitle>
          </DialogHeader>
          {pageModal && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>عنوان الصفحة</Label>
                  <Input value={pageModal.title} onChange={(e) => setPageModal({ ...pageModal, title: e.target.value })} placeholder="شروط الاستخدام" />
                </div>
                <div className="space-y-1.5">
                  <Label>الرابط (Slug)</Label>
                  <Input value={pageModal.slug} onChange={(e) => setPageModal({ ...pageModal, slug: e.target.value })} placeholder="terms" dir="ltr" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>الحالة</Label>
                <Select value={pageModal.status} onValueChange={(v) => setPageModal({ ...pageModal, status: v as 'published' | 'draft' })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">منشورة</SelectItem>
                    <SelectItem value="draft">مسودة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>المحتوى</Label>
                <Textarea value={pageModal.content} onChange={(e) => setPageModal({ ...pageModal, content: e.target.value })} rows={8} className="font-mono text-sm" dir="rtl" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPageModal(null)}>إلغاء</Button>
            <Button onClick={() => {
              if (!pageModal) return;
              if (!pageModal.title || !pageModal.slug) { showToast('العنوان والرابط مطلوبان', 'error'); return; }
              if (pageModal.isNew) {
                setPages((prev) => [...prev, { id: pageModal.id, title: pageModal.title, slug: pageModal.slug, content: pageModal.content, status: pageModal.status }]);
                showToast('تمت الإضافة', 'success');
              } else {
                setPages((prev) => prev.map((p) => p.id === pageModal.id ? { id: p.id, title: pageModal.title, slug: pageModal.slug, content: pageModal.content, status: pageModal.status } : p));
                showToast('تم الحفظ', 'success');
              }
              setPageModal(null);
            }}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gateway Modal */}
      <Dialog open={!!gatewayModal} onOpenChange={(o) => { if (!o) setGatewayModal(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{gatewayModal?.isNew ? 'إضافة بوابة دفع' : 'تعديل بوابة دفع'}</DialogTitle>
          </DialogHeader>
          {gatewayModal && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>اسم البوابة *</Label>
                  <Input value={gatewayModal.name} onChange={(e) => setGatewayModal({ ...gatewayModal, name: e.target.value })} placeholder="بايموب" />
                </div>
                <div className="space-y-1.5">
                  <Label>رمز البوابة (Slug) *</Label>
                  <Input value={gatewayModal.slug} onChange={(e) => setGatewayModal({ ...gatewayModal, slug: e.target.value })} placeholder="paymob" dir="ltr" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>البيئة *</Label>
                  <Select value={gatewayModal.environment} onValueChange={(v) => setGatewayModal({ ...gatewayModal, environment: v as 'sandbox' | 'production' })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox (تجريبي)</SelectItem>
                      <SelectItem value="production">Production (إنتاج)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>الحالة</Label>
                  <div className="flex items-center gap-2 h-10">
                    <Switch checked={gatewayModal.enabled} onCheckedChange={(v) => setGatewayModal({ ...gatewayModal, enabled: v })} />
                    <span className="text-sm">{gatewayModal.enabled ? 'مفعّل' : 'معطّل'}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Public Key</Label>
                  <Input value={gatewayModal.publicKey} onChange={(e) => setGatewayModal({ ...gatewayModal, publicKey: e.target.value })} dir="ltr" className="font-mono text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label>Secret Key</Label>
                  <div className="flex items-center gap-1">
                    <Input
                      type={showSecretKey ? 'text' : 'password'}
                      value={gatewayModal.secretKey}
                      onChange={(e) => setGatewayModal({ ...gatewayModal, secretKey: e.target.value })}
                      dir="ltr"
                      className="font-mono text-xs flex-1"
                    />
                    <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0" onClick={() => setShowSecretKey((v) => !v)}>
                      {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>البريد الإلكتروني</Label>
                <Input type="email" value={gatewayModal.email} onChange={(e) => setGatewayModal({ ...gatewayModal, email: e.target.value })} dir="ltr" />
              </div>

              <div className="space-y-1.5">
                <Label>إعدادات JSON</Label>
                <Textarea value={gatewayModal.jsonConfig} onChange={(e) => setGatewayModal({ ...gatewayModal, jsonConfig: e.target.value })} rows={4} className="font-mono text-xs" dir="ltr" placeholder='{"integration_id": 12345, ...}' />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>الدول المدعومة</Label>
                <div className="flex flex-wrap gap-2">
                  {countries.map((c) => {
                    const selected = gatewayModal.countries.includes(c.code);
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => setGatewayModal({
                          ...gatewayModal,
                          countries: selected
                            ? gatewayModal.countries.filter((x) => x !== c.code)
                            : [...gatewayModal.countries, c.code],
                        })}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs border transition-colors',
                          selected ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted hover:bg-muted/80'
                        )}
                      >
                        {c.flag} {c.nameAr}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>طرق الدفع</Label>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map((m) => {
                    const checked = gatewayModal.methods.includes(m.key);
                    return (
                      <label key={m.key} className="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer hover:bg-muted/50">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) => setGatewayModal({
                            ...gatewayModal,
                            methods: v
                              ? [...gatewayModal.methods, m.key]
                              : gatewayModal.methods.filter((x) => x !== m.key),
                          })}
                        />
                        <span className="text-sm">{m.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setGatewayModal(null)}>إلغاء</Button>
            <Button onClick={() => {
              if (!gatewayModal) return;
              if (!gatewayModal.name || !gatewayModal.slug) { showToast('الاسم والرمز مطلوبان', 'error'); return; }
              const { isNew, ...data } = gatewayModal;
              if (isNew) {
                setGateways((prev) => [...prev, data]);
                showToast('تمت الإضافة', 'success');
              } else {
                setGateways((prev) => prev.map((g) => g.id === data.id ? data : g));
                showToast('تم الحفظ', 'success');
              }
              setGatewayModal(null);
            }}>حفظ</Button>
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

function OtpVerifyDialog({ open, onOpenChange, icon, title, label, inputType, placeholder, value, onValueChange, otpSent, otp, onOtpChange, onSendCode, onVerify, dir }: {
  open: boolean; onOpenChange: (o: boolean) => void; icon: React.ReactNode; title: string; label: string;
  inputType: string; placeholder: string; value: string; onValueChange: (v: string) => void;
  otpSent: boolean; otp: string[]; onOtpChange: (o: string[]) => void;
  onSendCode: () => void; onVerify: () => void; dir?: string;
}): JSX.Element {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const handleOtpKey = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) inputRefs.current[idx - 1]?.focus();
  };
  const handleOtpInput = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[idx] = val; onOtpChange(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };
  const handlePaste = (e: React.ClipboardEvent) => {
    const txt = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (txt.length === 6) { onOtpChange(txt.split('')); inputRefs.current[5]?.focus(); e.preventDefault(); }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">{icon}{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>{label}</Label>
            <Input type={inputType} value={value} onChange={(e) => onValueChange(e.target.value)} placeholder={placeholder} dir={dir} disabled={otpSent} autoFocus />
          </div>
          {!otpSent ? (
            <Button className="w-full" onClick={onSendCode}>إرسال رمز التحقق</Button>
          ) : (
            <>
              <div className="space-y-2">
                <Label>رمز التحقق (6 أرقام)</Label>
                <p className="text-xs text-muted-foreground">تم إرسال رمز التحقق، أدخله أدناه</p>
                <div className="flex items-center justify-center gap-2" dir="ltr" onPaste={handlePaste}>
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={(e) => handleOtpInput(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKey(i, e)}
                      className="w-11 h-12 text-center text-lg font-semibold border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button type="button" className="text-xs text-primary hover:underline" onClick={onSendCode}>إعادة إرسال الرمز</button>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
          {otpSent && <Button onClick={onVerify}>تحقق وحفظ</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

