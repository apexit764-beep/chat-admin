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

type Tab = 'general' | 'security' | 'appearance' | 'emails' | 'api' | 'payments' | 'danger';

const validTabs: Tab[] = ['general', 'security', 'appearance', 'emails', 'api', 'payments', 'danger'];

export default function AdminSettings(): JSX.Element {
  const initialTab = ((): Tab => {
    const h = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    return validTabs.includes(h as Tab) ? (h as Tab) : 'general';
  })();
  const [tab, setTab] = useState<Tab>(initialTab);
  const adminUsers = useAdminStore((s) => s.adminUsers);
  const clients = useAdminStore((s) => s.clients);
  const invoices = useAdminStore((s) => s.invoices);
  const showToast = useUIStore((s) => s.showToast);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const securityPrefs = useSettingsStore((s) => s.security);
  const setSecurityPrefs = useSettingsStore((s) => s.setSecurity);
  const resetSettings = useSettingsStore((s) => s.reset);
  const { confirm } = useConfirm();

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

  const handleWipeDemo = async (): Promise<void> => {
    const ok = await confirm({
      title: 'مسح البيانات التجريبية؟',
      message: 'هذا الإجراء عرض توضيحي فقط — لن يحذف شيئاً فعلياً في هذا الـ Demo.',
      variant: 'danger',
      confirmText: 'تأكيد المسح',
    });
    if (ok) showToast('تم المسح (تجريبي)', 'info');
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'general', label: 'عام', icon: <Building className="h-4 w-4" /> },
    { key: 'security', label: 'الأمان', icon: <Shield className="h-4 w-4" /> },
    { key: 'emails', label: 'قوالب البريد', icon: <FileText className="h-4 w-4" /> },
    { key: 'api', label: 'مفاتيح API', icon: <Key className="h-4 w-4" /> },
    { key: 'payments', label: 'بوابة الدفع', icon: <CreditCard className="h-4 w-4" /> },
    { key: 'appearance', label: 'المظهر', icon: <Palette className="h-4 w-4" /> },
    { key: 'danger', label: 'منطقة الخطر', icon: <AlertTriangle className="h-4 w-4" /> },
  ];

  return (
    <div className="p-4 lg:p-8">
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
                  <DangerAction title="مسح البيانات التجريبية" hint="حذف كل العملاء والفواتير المنشأة للتجربة" onConfirm={handleWipeDemo} cta="مسح" />
                  <DangerAction title="إعادة ضبط الإعدادات" hint="إرجاع جميع الإعدادات للقيم الافتراضية" onConfirm={handleResetSettings} cta="إعادة ضبط" />
                  <DangerAction title="تصدير كل البيانات" hint="JSON بكل العملاء والفواتير والمستخدمين" onConfirm={handleExportAll} cta="تصدير الآن" variant="secondary" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  );
}

function Header({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }): JSX.Element {
  return (
    <div className="mb-6 pb-5">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <span className="text-primary">{icon}</span> {title}
      </h2>
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
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
