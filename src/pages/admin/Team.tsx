import { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Mail,
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Clock,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Filter,
  ArrowRight,
  Plus,
  Activity,
} from 'lucide-react';
import { useConfirm } from '@components/ui';
import { useAdminStore } from '@/store/useAdminStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { timeAgo, initials, avatarColor } from '@/utils/format';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type View = 'members' | 'roles' | 'role-editor';

interface RoleConfig {
  id: string;
  key: AdminRole | string;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  icon: React.ElementType;
  isSystem: boolean;
  permissions: Set<string>;
}

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

const roleIcon: Record<AdminRole, React.ElementType> = {
  super_admin: ShieldAlert,
  admin: ShieldCheck,
  support: Shield,
  finance: Shield,
};

interface PermissionGroup {
  id: string;
  label: string;
  permissions: { id: string; label: string }[];
}

const permissionGroups: PermissionGroup[] = [
  {
    id: 'dashboard',
    label: 'لوحة التحكم',
    permissions: [
      { id: 'dashboard.view', label: 'عرض لوحة التحكم' },
      { id: 'dashboard.export', label: 'تصدير البيانات' },
    ],
  },
  {
    id: 'clients',
    label: 'العملاء',
    permissions: [
      { id: 'clients.view', label: 'عرض العملاء' },
      { id: 'clients.create', label: 'إضافة عميل' },
      { id: 'clients.edit', label: 'تعديل عميل' },
      { id: 'clients.delete', label: 'حذف عميل' },
      { id: 'clients.suspend', label: 'تعليق / تفعيل عميل' },
    ],
  },
  {
    id: 'plans',
    label: 'الباقات',
    permissions: [
      { id: 'plans.view', label: 'عرض الباقات' },
      { id: 'plans.create', label: 'إضافة باقة' },
      { id: 'plans.edit', label: 'تعديل باقة' },
      { id: 'plans.delete', label: 'حذف باقة' },
    ],
  },
  {
    id: 'finance',
    label: 'المالية',
    permissions: [
      { id: 'finance.view', label: 'عرض المالية' },
      { id: 'finance.invoices', label: 'إدارة الفواتير' },
      { id: 'finance.refund', label: 'استرداد المدفوعات' },
      { id: 'finance.payments', label: 'إعدادات بوابة الدفع' },
    ],
  },
  {
    id: 'support',
    label: 'الدعم',
    permissions: [
      { id: 'support.view', label: 'عرض الشكاوى' },
      { id: 'support.reply', label: 'الرد على الشكاوى' },
      { id: 'support.status', label: 'تغيير حالة الشكوى' },
    ],
  },
  {
    id: 'reports',
    label: 'التقارير',
    permissions: [
      { id: 'reports.view', label: 'عرض التقارير' },
      { id: 'reports.export', label: 'تصدير التقارير' },
    ],
  },
  {
    id: 'live_chat',
    label: 'الدردشات المباشرة',
    permissions: [
      { id: 'live_chat.view', label: 'عرض المحادثات' },
      { id: 'live_chat.reply', label: 'الرد على المحادثات' },
      { id: 'live_chat.assign', label: 'تعيين محادثة لموظف' },
      { id: 'live_chat.close', label: 'إغلاق المحادثات' },
    ],
  },
  {
    id: 'ai',
    label: 'إعدادات الذكاء الاصطناعي',
    permissions: [
      { id: 'ai.view', label: 'عرض إعدادات الذكاء الاصطناعي' },
      { id: 'ai.edit', label: 'تعديل إعدادات الذكاء الاصطناعي' },
      { id: 'ai.templates', label: 'إدارة قوالب الردود' },
    ],
  },
  {
    id: 'knowledge',
    label: 'قاعدة المعرفة',
    permissions: [
      { id: 'knowledge.view', label: 'عرض قاعدة المعرفة' },
      { id: 'knowledge.create', label: 'إضافة مقالة' },
      { id: 'knowledge.edit', label: 'تعديل مقالة' },
      { id: 'knowledge.delete', label: 'حذف مقالة' },
    ],
  },
  {
    id: 'subscriptions',
    label: 'الاشتراكات',
    permissions: [
      { id: 'subscriptions.view', label: 'عرض الاشتراكات' },
      { id: 'subscriptions.edit', label: 'تعديل اشتراك' },
      { id: 'subscriptions.cancel', label: 'إلغاء اشتراك' },
    ],
  },
  {
    id: 'plan_requests',
    label: 'طلبات الباقات',
    permissions: [
      { id: 'plan_requests.view', label: 'عرض الطلبات' },
      { id: 'plan_requests.approve', label: 'موافقة / رفض الطلبات' },
    ],
  },
  {
    id: 'industries',
    label: 'القطاعات',
    permissions: [
      { id: 'industries.view', label: 'عرض القطاعات' },
      { id: 'industries.create', label: 'إضافة قطاع' },
      { id: 'industries.edit', label: 'تعديل قطاع' },
      { id: 'industries.delete', label: 'حذف قطاع' },
    ],
  },
  {
    id: 'integrations',
    label: 'التكاملات',
    permissions: [
      { id: 'integrations.view', label: 'عرض التكاملات' },
      { id: 'integrations.manage', label: 'إدارة التكاملات' },
    ],
  },
  {
    id: 'widget',
    label: 'الويدجت',
    permissions: [
      { id: 'widget.view', label: 'عرض إعدادات الويدجت' },
      { id: 'widget.edit', label: 'تعديل إعدادات الويدجت' },
    ],
  },
  {
    id: 'notifications',
    label: 'الإشعارات',
    permissions: [
      { id: 'notifications.view', label: 'عرض الإشعارات' },
      { id: 'notifications.manage', label: 'إدارة الإشعارات' },
    ],
  },
  {
    id: 'activity',
    label: 'سجل النشاط',
    permissions: [
      { id: 'activity.view', label: 'عرض سجل النشاط' },
      { id: 'activity.export', label: 'تصدير سجل النشاط' },
    ],
  },
  {
    id: 'team',
    label: 'الموظفين',
    permissions: [
      { id: 'team.view', label: 'عرض الموظفين' },
      { id: 'team.create', label: 'إضافة موظف' },
      { id: 'team.edit', label: 'تعديل موظف' },
      { id: 'team.delete', label: 'حذف موظف' },
      { id: 'team.roles', label: 'إدارة الأدوار والصلاحيات' },
    ],
  },
  {
    id: 'settings',
    label: 'الإعدادات',
    permissions: [
      { id: 'settings.general', label: 'إعدادات عامة' },
      { id: 'settings.security', label: 'إعدادات الأمان' },
      { id: 'settings.api', label: 'مفاتيح API' },
    ],
  },
];

const allPermissionIds = permissionGroups.flatMap((g) => g.permissions.map((p) => p.id));

const initialRoles: RoleConfig[] = [
  {
    id: 'role_super_admin',
    key: 'super_admin',
    label: 'مدير النظام',
    description: 'وصول كامل لكل الأقسام والإعدادات',
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-950',
    icon: ShieldAlert,
    isSystem: true,
    permissions: new Set(allPermissionIds),
  },
  {
    id: 'role_admin',
    key: 'admin',
    label: 'مدير',
    description: 'إدارة العملاء والباقات والتقارير',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-950',
    icon: ShieldCheck,
    isSystem: true,
    permissions: new Set([
      'dashboard.view', 'dashboard.export',
      'clients.view', 'clients.create', 'clients.edit', 'clients.delete', 'clients.suspend',
      'plans.view', 'plans.create', 'plans.edit', 'plans.delete',
      'finance.view', 'finance.invoices',
      'support.view', 'support.reply', 'support.status',
      'live_chat.view', 'live_chat.reply', 'live_chat.assign', 'live_chat.close',
      'ai.view', 'ai.edit', 'ai.templates',
      'knowledge.view', 'knowledge.create', 'knowledge.edit', 'knowledge.delete',
      'subscriptions.view', 'subscriptions.edit', 'subscriptions.cancel',
      'plan_requests.view', 'plan_requests.approve',
      'industries.view', 'industries.create', 'industries.edit', 'industries.delete',
      'integrations.view', 'integrations.manage',
      'widget.view', 'widget.edit',
      'notifications.view', 'notifications.manage',
      'activity.view', 'activity.export',
      'reports.view', 'reports.export',
      'team.view', 'team.create', 'team.edit', 'team.delete', 'team.roles',
      'settings.general',
    ]),
  },
  {
    id: 'role_support',
    key: 'support',
    label: 'دعم فني',
    description: 'إدارة الشكاوى والدعم الفني فقط',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    icon: Shield,
    isSystem: true,
    permissions: new Set([
      'dashboard.view',
      'clients.view',
      'support.view', 'support.reply', 'support.status',
      'live_chat.view', 'live_chat.reply', 'live_chat.assign', 'live_chat.close',
      'knowledge.view',
    ]),
  },
  {
    id: 'role_finance',
    key: 'finance',
    label: 'مالية',
    description: 'إدارة المالية والفواتير والمدفوعات',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 dark:bg-amber-950',
    icon: Shield,
    isSystem: true,
    permissions: new Set([
      'dashboard.view',
      'clients.view',
      'finance.view', 'finance.invoices', 'finance.refund', 'finance.payments',
      'subscriptions.view', 'subscriptions.edit', 'subscriptions.cancel',
      'plan_requests.view', 'plan_requests.approve',
      'reports.view', 'reports.export',
    ]),
  },
];

export default function AdminTeam(): JSX.Element {
  const [view, setView] = useState<View>('members');
  const adminUsers = useAdminStore((s) => s.adminUsers);
  const addAdminUser = useAdminStore((s) => s.addAdminUser);
  const updateAdminUser = useAdminStore((s) => s.updateAdminUser);
  const deleteAdminUser = useAdminStore((s) => s.deleteAdminUser);
  const showToast = useUIStore((s) => s.showToast);
  const currentUser = useAuthStore((s) => s.user);
  const { confirm } = useConfirm();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<AdminRole | 'all'>('all');
  const [userModal, setUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userForm, setUserForm] = useState<{ name: string; email: string; role: AdminRole; active: boolean }>({
    name: '', email: '', role: 'admin', active: true,
  });

  const [roles, setRoles] = useState<RoleConfig[]>(initialRoles);
  const [editingRole, setEditingRole] = useState<RoleConfig | null>(null);
  const [roleForm, setRoleForm] = useState<{ label: string; description: string; permissions: Set<string> }>({
    label: '',
    description: '',
    permissions: new Set(),
  });

  const filtered = useMemo(() => {
    let list = adminUsers;
    if (roleFilter !== 'all') list = list.filter((u) => u.role === roleFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return list;
  }, [adminUsers, search, roleFilter]);


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

  const handleDelete = async (u: AdminUser): Promise<void> => {
    if (u.id === 'au_1') {
      showToast('لا يمكن حذف مدير النظام الرئيسي', 'error');
      return;
    }
    const ok = await confirm({
      title: `حذف ${u.name}؟`,
      message: 'سيتم إزالة هذا المستخدم من فريق الإدارة نهائياً.',
      variant: 'danger',
      confirmText: 'حذف',
    });
    if (ok) {
      deleteAdminUser(u.id);
      showToast('تم حذف المستخدم', 'success');
    }
  };

  const handleToggleActive = async (u: AdminUser): Promise<void> => {
    if (u.id === 'au_1') {
      showToast('لا يمكن تعطيل مدير النظام الرئيسي', 'error');
      return;
    }
    const action = u.active ? 'تعطيل' : 'تفعيل';
    const ok = await confirm({
      title: `${action} حساب ${u.name}؟`,
      message: u.active
        ? 'لن يستطيع تسجيل الدخول حتى يتم تفعيل حسابه مجدداً.'
        : 'سيستطيع تسجيل الدخول واستخدام اللوحة.',
      variant: u.active ? 'warning' : 'info',
      confirmText: action,
    });
    if (ok) {
      updateAdminUser(u.id, { active: !u.active });
      showToast(`تم ${action} الحساب`, 'success');
    }
  };

  const openAddRole = (): void => {
    setEditingRole(null);
    setRoleForm({ label: '', description: '', permissions: new Set() });
    setView('role-editor');
  };

  const openEditRole = (role: RoleConfig): void => {
    setEditingRole(role);
    setRoleForm({
      label: role.label,
      description: role.description,
      permissions: new Set(role.permissions),
    });
    setView('role-editor');
  };

  const submitRole = (): void => {
    if (!roleForm.label.trim()) {
      showToast('اسم الدور مطلوب', 'error');
      return;
    }
    if (editingRole) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRole.id
            ? { ...r, label: roleForm.label, description: roleForm.description, permissions: new Set(roleForm.permissions) }
            : r
        )
      );
      showToast('تم تحديث الدور', 'success');
    } else {
      const id = `role_${Math.random().toString(36).slice(2, 10)}`;
      setRoles((prev) => [
        ...prev,
        {
          id,
          key: id,
          label: roleForm.label,
          description: roleForm.description,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100 dark:bg-purple-950',
          icon: Shield,
          isSystem: false,
          permissions: new Set(roleForm.permissions),
        },
      ]);
      showToast('تمت إضافة الدور', 'success');
    }
    setView('roles');
  };

  const handleDeleteRole = async (role: RoleConfig): Promise<void> => {
    if (role.isSystem) {
      showToast('لا يمكن حذف الأدوار الأساسية', 'error');
      return;
    }
    const ok = await confirm({
      title: `حذف دور "${role.label}"؟`,
      message: 'سيتم إزالة الدور. الأعضاء المرتبطين به سينقلون إلى دور "مدير".',
      variant: 'danger',
      confirmText: 'حذف',
    });
    if (ok) {
      setRoles((prev) => prev.filter((r) => r.id !== role.id));
      showToast('تم حذف الدور', 'success');
    }
  };

  const togglePermInForm = (permId: string): void => {
    setRoleForm((prev) => {
      const next = new Set(prev.permissions);
      if (next.has(permId)) next.delete(permId);
      else next.add(permId);
      return { ...prev, permissions: next };
    });
  };

  const toggleGroupInForm = (group: PermissionGroup): void => {
    const allPerms = group.permissions.map((p) => p.id);
    const allGranted = allPerms.every((p) => roleForm.permissions.has(p));
    setRoleForm((prev) => {
      const next = new Set(prev.permissions);
      if (allGranted) allPerms.forEach((p) => next.delete(p));
      else allPerms.forEach((p) => next.add(p));
      return { ...prev, permissions: next };
    });
  };

  // ==========================================================================
  // ROLE EDITOR VIEW
  // ==========================================================================
  if (view === 'role-editor') {
    const totalPerms = allPermissionIds.length;
    const granted = roleForm.permissions.size;
    return (
      <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setView('roles')} className="h-9 w-9">
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {editingRole ? `تعديل دور: ${editingRole.label}` : 'دور جديد'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {editingRole?.isSystem
                ? 'يمكنك تعديل الاسم والوصف والصلاحيات لهذا الدور الأساسي.'
                : 'حدد الصلاحيات المتاحة لأعضاء هذا الدور.'}
            </p>
          </div>
        </div>

        {/* Basic info */}
        <Card>
          <CardContent className="p-5 lg:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اسم الدور</Label>
                <Input
                  value={roleForm.label}
                  onChange={(e) => setRoleForm({ ...roleForm, label: e.target.value })}
                  placeholder="مثلاً: مسؤول تسويق"
                />
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Input
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  placeholder="وصف قصير للدور"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions matrix */}
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-bold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  الصلاحيات
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  اختر الصلاحيات المتاحة لهذا الدور
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-32 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(granted / totalPerms) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{granted}/{totalPerms}</span>
                </div>
              </div>
            </div>
            <div className="divide-y">
              {permissionGroups.map((group) => {
                const allPerms = group.permissions.map((p) => p.id);
                const allGranted = allPerms.every((p) => roleForm.permissions.has(p));
                const someGranted = allPerms.some((p) => roleForm.permissions.has(p));
                return (
                  <div key={group.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleGroupInForm(group)}
                          className={cn(
                            'h-5 w-5 rounded border inline-flex items-center justify-center transition-colors',
                            allGranted && 'bg-primary border-primary text-primary-foreground',
                            !allGranted && someGranted && 'bg-primary/30 border-primary/50',
                            !allGranted && !someGranted && 'border-muted-foreground/30 hover:border-primary/50',
                          )}
                        >
                          {allGranted && <CheckCircle2 className="h-3 w-3" />}
                          {!allGranted && someGranted && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                        </button>
                        <h4 className="font-bold text-sm">{group.label}</h4>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {allPerms.filter((p) => roleForm.permissions.has(p)).length}/{allPerms.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 ps-8">
                      {group.permissions.map((perm) => {
                        const granted = roleForm.permissions.has(perm.id);
                        return (
                          <button
                            key={perm.id}
                            onClick={() => togglePermInForm(perm.id)}
                            className={cn(
                              'flex items-center gap-2.5 p-2.5 rounded-lg border text-start transition-all',
                              granted
                                ? 'border-primary/40 bg-primary/5 text-foreground'
                                : 'border-transparent hover:border-muted-foreground/20 hover:bg-muted/50 text-muted-foreground'
                            )}
                          >
                            <div className={cn(
                              'h-4 w-4 rounded border flex items-center justify-center flex-shrink-0',
                              granted
                                ? 'bg-primary border-primary text-primary-foreground'
                                : 'border-muted-foreground/30'
                            )}>
                              {granted && <CheckCircle2 className="h-3 w-3" />}
                            </div>
                            <span className="text-xs">{perm.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => setView('roles')}>إلغاء</Button>
          <Button onClick={submitRole}>{editingRole ? 'حفظ التغييرات' : 'إضافة الدور'}</Button>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // ROLES LIST VIEW
  // ==========================================================================
  if (view === 'roles') {
    return (
      <div className="p-4 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setView('members')} className="h-9 w-9">
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              الأدوار والصلاحيات
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              إدارة الأدوار وتحديد الصلاحيات لكل دور
            </p>
          </div>
          <Button onClick={openAddRole}>
            <Plus className="h-4 w-4" />
            دور جديد
          </Button>
        </div>

        {/* Roles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => {
            const RoleIcon = role.icon;
            const memberCount = adminUsers.filter((u) => u.role === role.key).length;
            const permCount = role.permissions.size;
            const totalPerms = allPermissionIds.length;
            const pct = (permCount / totalPerms) * 100;
            return (
              <Card key={role.id} className="hover:shadow-md transition-shadow group relative">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center', role.bgColor, role.color)}>
                      <RoleIcon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1">
                      {role.isSystem && (
                        <Badge variant="secondary" className="text-[10px]">أساسي</Badge>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditRole(role)}>
                            <Edit2 className="h-4 w-4 ml-2" />
                            تعديل
                          </DropdownMenuItem>
                          {!role.isSystem && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => void handleDeleteRole(role)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 ml-2" />
                                حذف
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <button
                    onClick={() => openEditRole(role)}
                    className="text-start w-full"
                  >
                    <h3 className="font-bold text-base">{role.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">{role.description}</p>
                  </button>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {memberCount} عضو
                    </span>
                    <span>{permCount}/{totalPerms} صلاحية</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        role.color.replace('text-', 'bg-')
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================================================
  // MEMBERS VIEW (default)
  // ==========================================================================
  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">الموظفين والصلاحيات</h2>
          <p className="text-sm text-muted-foreground">إدارة أعضاء فريق الإدارة وأدوارهم</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setView('roles')}>
            <Shield className="h-4 w-4" />
            الأدوار والصلاحيات
          </Button>
          <Button onClick={openAddUser}>
            <UserPlus className="h-4 w-4" />
            إضافة عضو
          </Button>
        </div>
      </div>


      {/* Members table */}
      <Card>
        <CardContent className="p-0">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 border-b">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو البريد..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as AdminRole | 'all')}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 me-2 text-muted-foreground" />
                <SelectValue placeholder="كل الأدوار" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأدوار</SelectItem>
                <SelectItem value="super_admin">مدير النظام</SelectItem>
                <SelectItem value="admin">مدير</SelectItem>
                <SelectItem value="support">دعم فني</SelectItem>
                <SelectItem value="finance">مالية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead className="w-[280px]">العضو</TableHead>
                <TableHead>الدور</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="hidden md:table-cell">آخر نشاط</TableHead>
                <TableHead className="hidden lg:table-cell">النشاط</TableHead>
                <TableHead className="hidden lg:table-cell">تاريخ الإضافة</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    لا توجد نتائج
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((u, idx) => {
                  const RoleIcon = roleIcon[u.role];
                  return (
                    <TableRow key={u.id} className="group">
                      <TableCell className="text-xs text-muted-foreground font-mono">{idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className={`text-xs font-bold ${avatarColor(u.name)}`}>{initials(u.name)}</AvatarFallback>
                            </Avatar>
                            <span
                              className={cn(
                                'absolute -bottom-0.5 -end-0.5 h-3 w-3 rounded-full border-2 border-background',
                                u.active ? 'bg-emerald-500' : 'bg-gray-400'
                              )}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {u.name}
                              {currentUser?.email === u.email && (
                                <span className="text-[10px] text-primary mr-1">(أنت)</span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={roleBadgeVariant[u.role]} className="gap-1">
                          <RoleIcon className="h-3 w-3" />
                          {roleLabel[u.role]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {u.active ? (
                          <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800">
                            <CheckCircle2 className="h-3 w-3" />
                            نشط
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1 text-gray-500 border-gray-200 bg-gray-50 dark:bg-gray-950/30 dark:border-gray-700">
                            <XCircle className="h-3 w-3" />
                            معطل
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {timeAgo(u.lastActive)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs font-medium">
                            {(() => {
                              const daysSince = Math.round((Date.now() - new Date(u.lastActive).getTime()) / 86400000);
                              const actions = Math.max(0, u.active ? 42 - daysSince * 3 : 0);
                              return `${actions} إجراء`;
                            })()}
                          </span>
                          <span className="text-[10px] text-muted-foreground">هذا الشهر</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString('ar-u-nu-latn', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditUser(u)}>
                              <Edit2 className="h-4 w-4 ml-2" />
                              تعديل
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => void handleToggleActive(u)}>
                              {u.active ? (
                                <>
                                  <XCircle className="h-4 w-4 ml-2" />
                                  تعطيل الحساب
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-4 w-4 ml-2" />
                                  تفعيل الحساب
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => void handleDelete(u)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 ml-2" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={userModal} onOpenChange={setUserModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingUser ? <Edit2 className="h-5 w-5 text-primary" /> : <UserPlus className="h-5 w-5 text-primary" />}
              {editingUser ? 'تعديل عضو' : 'إضافة عضو جديد'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>الاسم الكامل</Label>
              <Input
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                placeholder="أدخل اسم العضو"
              />
            </div>
            <div className="space-y-2">
              <Label>البريد الإلكتروني</Label>
              <div className="relative">
                <Input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="pe-10"
                  placeholder="example@company.com"
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
                  {(Object.keys(roleLabel) as AdminRole[]).map((role) => {
                    const RoleIcon = roleIcon[role];
                    return (
                      <SelectItem key={role} value={role}>
                        <div className="flex items-center gap-2">
                          <RoleIcon className="h-4 w-4" />
                          <span>{roleLabel[role]}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <Switch
                checked={userForm.active}
                onCheckedChange={(v) => setUserForm({ ...userForm, active: v })}
              />
              <div>
                <p className="text-sm font-medium">حساب نشط</p>
                <p className="text-xs text-muted-foreground">يستطيع تسجيل الدخول واستخدام لوحة التحكم</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserModal(false)}>إلغاء</Button>
            <Button onClick={submitUser}>{editingUser ? 'حفظ التغييرات' : 'إضافة العضو'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

