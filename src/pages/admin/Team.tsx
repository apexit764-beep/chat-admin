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
} from 'lucide-react';
import { useConfirm } from '@components/ui';
import { useAdminStore } from '@/store/useAdminStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
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

type Tab = 'members' | 'permissions';

const roleLabel: Record<AdminRole, string> = {
  super_admin: 'مدير النظام',
  admin: 'مدير',
  support: 'دعم فني',
  finance: 'مالية',
};

const roleDescription: Record<AdminRole, string> = {
  super_admin: 'وصول كامل لكل الأقسام والإعدادات',
  admin: 'إدارة العملاء والباقات والتقارير',
  support: 'إدارة الشكاوى والدعم الفني فقط',
  finance: 'إدارة المالية والفواتير والمدفوعات',
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
    id: 'settings',
    label: 'الإعدادات',
    permissions: [
      { id: 'settings.general', label: 'إعدادات عامة' },
      { id: 'settings.security', label: 'إعدادات الأمان' },
      { id: 'settings.api', label: 'مفاتيح API' },
      { id: 'settings.team', label: 'إدارة الفريق' },
    ],
  },
];

const defaultRolePermissions: Record<AdminRole, Set<string>> = {
  super_admin: new Set(permissionGroups.flatMap((g) => g.permissions.map((p) => p.id))),
  admin: new Set([
    'dashboard.view', 'dashboard.export',
    'clients.view', 'clients.create', 'clients.edit', 'clients.delete', 'clients.suspend',
    'plans.view', 'plans.create', 'plans.edit', 'plans.delete',
    'finance.view', 'finance.invoices',
    'support.view', 'support.reply', 'support.status',
    'reports.view', 'reports.export',
    'settings.general',
  ]),
  support: new Set([
    'dashboard.view',
    'clients.view',
    'support.view', 'support.reply', 'support.status',
  ]),
  finance: new Set([
    'dashboard.view',
    'clients.view',
    'finance.view', 'finance.invoices', 'finance.refund', 'finance.payments',
    'reports.view', 'reports.export',
  ]),
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function AdminTeam(): JSX.Element {
  const [tab, setTab] = useState<Tab>('members');
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

  const [rolePermissions, setRolePermissions] = useState<Record<AdminRole, Set<string>>>(() => ({
    super_admin: new Set(defaultRolePermissions.super_admin),
    admin: new Set(defaultRolePermissions.admin),
    support: new Set(defaultRolePermissions.support),
    finance: new Set(defaultRolePermissions.finance),
  }));

  const filtered = useMemo(() => {
    let list = adminUsers;
    if (roleFilter !== 'all') list = list.filter((u) => u.role === roleFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return list;
  }, [adminUsers, search, roleFilter]);

  const stats = useMemo(() => ({
    total: adminUsers.length,
    active: adminUsers.filter((u) => u.active).length,
    superAdmin: adminUsers.filter((u) => u.role === 'super_admin').length,
    admin: adminUsers.filter((u) => u.role === 'admin').length,
    support: adminUsers.filter((u) => u.role === 'support').length,
    finance: adminUsers.filter((u) => u.role === 'finance').length,
  }), [adminUsers]);

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

  const togglePermission = (role: AdminRole, permId: string): void => {
    if (role === 'super_admin') return;
    setRolePermissions((prev) => {
      const next = { ...prev };
      const s = new Set(next[role]);
      if (s.has(permId)) s.delete(permId);
      else s.add(permId);
      next[role] = s;
      return next;
    });
  };

  const toggleGroupForRole = (role: AdminRole, group: PermissionGroup): void => {
    if (role === 'super_admin') return;
    const allPerms = group.permissions.map((p) => p.id);
    const allGranted = allPerms.every((p) => rolePermissions[role].has(p));
    setRolePermissions((prev) => {
      const next = { ...prev };
      const s = new Set(next[role]);
      if (allGranted) allPerms.forEach((p) => s.delete(p));
      else allPerms.forEach((p) => s.add(p));
      next[role] = s;
      return next;
    });
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            إدارة الفريق
          </h1>
          <p className="text-sm text-muted-foreground mt-1">إدارة أعضاء فريق الإدارة وصلاحياتهم</p>
        </div>
        <Button onClick={openAddUser}>
          <UserPlus className="h-4 w-4" />
          إضافة عضو
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatMini label="إجمالي الأعضاء" value={stats.total} color="bg-primary/10 text-primary" />
        <StatMini label="نشط" value={stats.active} color="bg-emerald-500/10 text-emerald-600" />
        <StatMini label="مدير نظام" value={stats.superAdmin} color="bg-red-500/10 text-red-600" />
        <StatMini label="مدير" value={stats.admin} color="bg-blue-500/10 text-blue-600" />
        <StatMini label="دعم فني" value={stats.support} color="bg-gray-500/10 text-gray-600" />
        <StatMini label="مالية" value={stats.finance} color="bg-amber-500/10 text-amber-600" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        <button
          onClick={() => setTab('members')}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            tab === 'members' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Users className="h-4 w-4 inline-block ml-1.5" />
          الأعضاء
        </button>
        <button
          onClick={() => setTab('permissions')}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            tab === 'permissions' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Shield className="h-4 w-4 inline-block ml-1.5" />
          الصلاحيات
        </button>
      </div>

      {/* Members Tab */}
      {tab === 'members' && (
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
                  <Filter className="h-4 w-4 ml-2 text-muted-foreground" />
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
                  <TableHead className="w-[280px]">العضو</TableHead>
                  <TableHead>الدور</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="hidden md:table-cell">آخر نشاط</TableHead>
                  <TableHead className="hidden lg:table-cell">تاريخ الإضافة</TableHead>
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      لا توجد نتائج
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((u) => {
                    const RoleIcon = roleIcon[u.role];
                    return (
                      <TableRow key={u.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="text-xs font-bold">{getInitials(u.name)}</AvatarFallback>
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
                          <span className="text-xs text-muted-foreground">
                            {new Date(u.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
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
      )}

      {/* Permissions Tab */}
      {tab === 'permissions' && (
        <div className="space-y-6">
          {/* Role cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(roleLabel) as AdminRole[]).map((role) => {
              const RoleIcon = roleIcon[role];
              const memberCount = adminUsers.filter((u) => u.role === role).length;
              const permCount = rolePermissions[role].size;
              const totalPerms = permissionGroups.reduce((sum, g) => sum + g.permissions.length, 0);
              return (
                <Card key={role} className={cn(
                  'relative overflow-hidden',
                  role === 'super_admin' && 'ring-1 ring-red-200 dark:ring-red-900'
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={cn(
                        'h-10 w-10 rounded-xl flex items-center justify-center',
                        role === 'super_admin' && 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
                        role === 'admin' && 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
                        role === 'support' && 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
                        role === 'finance' && 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
                      )}>
                        <RoleIcon className="h-5 w-5" />
                      </div>
                      <Badge variant={roleBadgeVariant[role]} className="text-[10px]">
                        {memberCount} عضو
                      </Badge>
                    </div>
                    <h3 className="font-bold text-sm">{roleLabel[role]}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{roleDescription[role]}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            role === 'super_admin' && 'bg-red-500',
                            role === 'admin' && 'bg-blue-500',
                            role === 'support' && 'bg-gray-500',
                            role === 'finance' && 'bg-amber-500',
                          )}
                          style={{ width: `${(permCount / totalPerms) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{permCount}/{totalPerms}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Permissions matrix */}
          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b">
                <h3 className="font-bold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  مصفوفة الصلاحيات
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  حدد الصلاحيات المتاحة لكل دور. مدير النظام يحصل على كل الصلاحيات تلقائياً.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-start px-4 py-3 font-semibold w-[250px]">الصلاحية</th>
                      {(Object.keys(roleLabel) as AdminRole[]).map((role) => (
                        <th key={role} className="px-4 py-3 text-center font-semibold min-w-[120px]">
                          <Badge variant={roleBadgeVariant[role]} className="text-[10px]">
                            {roleLabel[role]}
                          </Badge>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissionGroups.map((group) => (
                      <>
                        <tr key={`g-${group.id}`} className="bg-muted/30">
                          <td className="px-4 py-2.5 font-bold text-xs">{group.label}</td>
                          {(Object.keys(roleLabel) as AdminRole[]).map((role) => {
                            const allPerms = group.permissions.map((p) => p.id);
                            const allGranted = allPerms.every((p) => rolePermissions[role].has(p));
                            const someGranted = allPerms.some((p) => rolePermissions[role].has(p));
                            return (
                              <td key={role} className="px-4 py-2.5 text-center">
                                <button
                                  onClick={() => toggleGroupForRole(role, group)}
                                  disabled={role === 'super_admin'}
                                  className={cn(
                                    'h-5 w-5 rounded border inline-flex items-center justify-center transition-colors mx-auto',
                                    role === 'super_admin' && 'opacity-50 cursor-not-allowed',
                                    allGranted && 'bg-primary border-primary text-primary-foreground',
                                    !allGranted && someGranted && 'bg-primary/30 border-primary/50',
                                    !allGranted && !someGranted && 'border-muted-foreground/30',
                                  )}
                                >
                                  {allGranted && <CheckCircle2 className="h-3 w-3" />}
                                  {!allGranted && someGranted && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                        {group.permissions.map((perm) => (
                          <tr key={perm.id} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-2.5 ps-8 text-muted-foreground text-xs">{perm.label}</td>
                            {(Object.keys(roleLabel) as AdminRole[]).map((role) => {
                              const granted = rolePermissions[role].has(perm.id);
                              return (
                                <td key={role} className="px-4 py-2.5 text-center">
                                  <button
                                    onClick={() => togglePermission(role, perm.id)}
                                    disabled={role === 'super_admin'}
                                    className={cn(
                                      'h-5 w-5 rounded border inline-flex items-center justify-center transition-colors mx-auto',
                                      role === 'super_admin' && 'opacity-50 cursor-not-allowed',
                                      granted
                                        ? 'bg-primary border-primary text-primary-foreground'
                                        : 'border-muted-foreground/30 hover:border-primary/50',
                                    )}
                                  >
                                    {granted && <CheckCircle2 className="h-3 w-3" />}
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t flex justify-end">
                <Button onClick={() => showToast('تم حفظ الصلاحيات', 'success')}>
                  حفظ الصلاحيات
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
              <p className="text-[11px] text-muted-foreground">
                {roleDescription[userForm.role]}
              </p>
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

function StatMini({ label, value, color }: { label: string; value: number; color: string }): JSX.Element {
  return (
    <Card>
      <CardContent className="p-3 flex items-center gap-3">
        <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center text-sm font-bold', color)}>
          {value}
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </CardContent>
    </Card>
  );
}
