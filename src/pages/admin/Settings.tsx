import { useState } from 'react';
import {
  Building,
  User,
  Shield,
  Palette,
  AlertTriangle,
  UserPlus,
  Edit2,
  Trash2,
  Mail,
} from 'lucide-react';
import { useConfirm } from '@components/ui';
import { useAdminStore } from '@/store/useAdminStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { timeAgo } from '@/utils/format';
import { cn } from '@/lib/utils';
import type { AdminRole, AdminUser } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

type Tab = 'general' | 'team' | 'security' | 'appearance' | 'danger';

const roleLabel: Record<AdminRole, string> = {
  super_admin: 'مدير النظام',
  admin: 'مدير',
  support: 'دعم فني',
  finance: 'مالية',
};

const roleBadgeVariant: Record<AdminRole, 'destructive' | 'default' | 'secondary' | 'warning'> = {
  super_admin: 'destructive',
  admin: 'default',
  support: 'secondary',
  finance: 'warning',
};

export default function AdminSettings(): JSX.Element {
  const [tab, setTab] = useState<Tab>('general');
  const adminUsers = useAdminStore((s) => s.adminUsers);
  const addAdminUser = useAdminStore((s) => s.addAdminUser);
  const updateAdminUser = useAdminStore((s) => s.updateAdminUser);
  const deleteAdminUser = useAdminStore((s) => s.deleteAdminUser);
  const clients = useAdminStore((s) => s.clients);
  const invoices = useAdminStore((s) => s.invoices);
  const showToast = useUIStore((s) => s.showToast);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const currentUser = useAuthStore((s) => s.user);
  const securityPrefs = useSettingsStore((s) => s.security);
  const setSecurityPrefs = useSettingsStore((s) => s.setSecurity);
  const resetSettings = useSettingsStore((s) => s.reset);
  const { confirm } = useConfirm();

  const [productName, setProductName] = useState('Apex Solutions');
  const [productTagline, setProductTagline] = useState('منصة CRM متكاملة للشركات');
  const [supportEmail, setSupportEmail] = useState('support@apexes.click');
  const [supportPhone, setSupportPhone] = useState('+96891234567');

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

  const [userModal, setUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userForm, setUserForm] = useState<{ name: string; email: string; role: AdminRole; active: boolean }>({
    name: '', email: '', role: 'admin', active: true,
  });

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'general', label: 'عام', icon: <Building className="h-4 w-4" /> },
    { key: 'team', label: 'فريق الإدارة', icon: <User className="h-4 w-4" /> },
    { key: 'security', label: 'الأمان', icon: <Shield className="h-4 w-4" /> },
    { key: 'appearance', label: 'المظهر', icon: <Palette className="h-4 w-4" /> },
    { key: 'danger', label: 'منطقة الخطر', icon: <AlertTriangle className="h-4 w-4" /> },
  ];

  const openAddUser = (): void => {
    setEditingUser(null);
    setUserForm({ name: '', email: '', role: 'admin', active: true });
    setUserModal(true);
  };

  const openEditUser = (u: AdminUser): void => {
    setEditingUser(u);
    setUserForm({ name: u.name, email: u.email, role: u.role, active: u.active });
    setUserModal(true);
  };

  const submitUser = (): void => {
    if (!userForm.name.trim() || !userForm.email.trim()) {
      showToast('الاسم والبريد مطلوبان', 'error');
      return;
    }
    if (editingUser) {
      updateAdminUser(editingUser.id, userForm);
      showToast('تم تحديث المستخدم', 'success');
    } else {
      addAdminUser(userForm);
      showToast('تمت إضافة المستخدم', 'success');
    }
    setUserModal(false);
  };

  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
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

            {/* TEAM */}
            {tab === 'team' && (
              <div>
                <div className="flex items-center justify-between mb-6 pb-5">
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" /> فريق الإدارة
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {adminUsers.length} مستخدم لديهم وصول للوحة الإدارة
                    </p>
                  </div>
                  <Button onClick={openAddUser} size="sm">
                    <UserPlus className="h-4 w-4" /> إضافة
                  </Button>
                </div>
                <Separator className="mb-4" />
                <div className="space-y-2">
                  {adminUsers.map((u) => (
                    <div key={u.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{getInitials(u.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">
                          {u.name}{' '}
                          {currentUser?.email === u.email && (
                            <span className="text-[10px] text-primary">(أنت)</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                      <Badge variant={roleBadgeVariant[u.role]}>{roleLabel[u.role]}</Badge>
                      <p className="text-xs text-muted-foreground hidden sm:block">{timeAgo(u.lastActive)}</p>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditUser(u)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (u.id === 'au_1') { showToast('لا يمكن حذف مدير النظام', 'error'); return; }
                            void (async () => {
                              const ok = await confirm({ title: `حذف ${u.name}؟`, message: 'لا يمكن التراجع', variant: 'danger', confirmText: 'حذف' });
                              if (ok) { deleteAdminUser(u.id); showToast('تم الحذف', 'success'); }
                            })();
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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
      </div>

      {/* Add/Edit User Dialog */}
      <Dialog open={userModal} onOpenChange={setUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'تعديل مستخدم' : 'مستخدم جديد'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>الاسم</Label>
              <Input
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>البريد</Label>
              <div className="relative">
                <Input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="pe-10"
                />
                <Mail className="absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>الدور</Label>
              <Select
                value={userForm.role}
                onValueChange={(v) => setUserForm({ ...userForm, role: v as AdminRole })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">مدير النظام</SelectItem>
                  <SelectItem value="admin">مدير</SelectItem>
                  <SelectItem value="support">دعم فني</SelectItem>
                  <SelectItem value="finance">مالية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <Switch
                checked={userForm.active}
                onCheckedChange={(v) => setUserForm({ ...userForm, active: v })}
              />
              <div>
                <p className="text-sm font-medium">حساب نشط</p>
                <p className="text-xs text-muted-foreground">يستطيع تسجيل الدخول</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserModal(false)}>إلغاء</Button>
            <Button onClick={submitUser}>{editingUser ? 'حفظ' : 'إضافة'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
