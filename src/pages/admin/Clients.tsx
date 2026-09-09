import { useEffect, useMemo, useState, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  PauseCircle,
  PlayCircle,
  Phone,
  Globe,
  X,
  Clock,
  AlertCircle,
  Briefcase,
} from 'lucide-react';

const AdminIndustries = lazy(() => import('./Industries'));
import {
  DataTable,
  StatCard,
  useConfirm,
  type Column,
} from '@components/ui';
import { ClientFormDialog } from '@/components/admin/ClientFormDialog';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { formatMoney } from '@/utils/money';
import { formatDate, timeAgo, initials, avatarColor } from '@/utils/format';
import { downloadCsv } from '@/utils/csv';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Input } from '@/components/ui/input';
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
import type { Client, ClientStatus } from '@/types';


const statusLabel: Record<ClientStatus, string> = {
  trial: 'فترة تجريبية',
  active: 'نشط',
  past_due: 'متأخر',
  suspended: 'موقوف',
  cancelled: 'ملغي',
};

const statusBadgeClass: Record<ClientStatus, string> = {
  trial: 'bg-info/15 text-info border-transparent',
  active: 'bg-success/15 text-success border-transparent',
  past_due: 'bg-warning/15 text-warning border-transparent',
  suspended: 'bg-danger/15 text-danger border-transparent',
  cancelled: 'bg-muted text-muted-foreground border-transparent',
};


type View = 'clients' | 'industries';

export default function AdminClients(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const clients = useAdminStore((s) => s.clients);
  const plans = useAdminStore((s) => s.plans);
  const countries = useAdminStore((s) => s.countries);
  const subscriptions = useAdminStore((s) => s.subscriptions);
  const industries = useAdminStore((s) => s.industries);
  const addClient = useAdminStore((s) => s.addClient);
  const updateClient = useAdminStore((s) => s.updateClient);
  const deleteClient = useAdminStore((s) => s.deleteClient);
  const suspendClient = useAdminStore((s) => s.suspendClient);
  const reactivateClient = useAdminStore((s) => s.reactivateClient);
  const createSubscription = useAdminStore((s) => s.createSubscription);
  const showToast = useUIStore((s) => s.showToast);
  const { confirm } = useConfirm();

  const [view, setView] = useState<View>('clients');
  const [statusFilter, setStatusFilter] = useState<'all' | ClientStatus>('all');
  const [countryFilter, setCountryFilter] = useState<'all' | string>('all');
  const [planFilter, setPlanFilter] = useState<'all' | string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  // Handle edit navigation from ClientDetail
  useEffect(() => {
    const state = location.state as { editClientId?: string } | null;
    if (state?.editClientId) {
      const clientToEdit = clients.find((c) => c.id === state.editClientId);
      if (clientToEdit) {
        openEdit(clientToEdit);
      }
      // Clear the state so it doesn't re-trigger
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (countryFilter !== 'all' && c.country !== countryFilter) return false;
      if (planFilter !== 'all' && c.planId !== planFilter) return false;
      return true;
    });
  }, [clients, statusFilter, countryFilter, planFilter]);

  const stats = useMemo(() => ({
    total: clients.length,
    active: clients.filter((c) => c.status === 'active').length,
    trial: clients.filter((c) => c.status === 'trial').length,
    pastDue: clients.filter((c) => c.status === 'past_due').length,
  }), [clients]);

  const activeFilterCount =
    (statusFilter !== 'all' ? 1 : 0) +
    (countryFilter !== 'all' ? 1 : 0) +
    (planFilter !== 'all' ? 1 : 0);

  const clearFilters = (): void => {
    setStatusFilter('all');
    setCountryFilter('all');
    setPlanFilter('all');
  };

  const openCreate = (): void => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (c: Client): void => {
    setEditing(c);
    setModalOpen(true);
  };


  const remove = async (c: Client): Promise<void> => {
    const activeSub = subscriptions.find((s) => s.clientId === c.id && s.status === 'active');
    const warning = activeSub
      ? `⚠️ لدى ${c.companyName} اشتراك نشط بـ ${formatMoney(activeSub.amount, activeSub.currency)}/${activeSub.billingCycle === 'monthly' ? 'شهر' : 'سنة'}. سيتم إلغاؤه وحذف الفواتير والمعاملات المرتبطة. لا يمكن التراجع.`
      : 'سيتم حذف الاشتراك والفواتير والمعاملات المرتبطة معه. هذه العملية لا يمكن التراجع عنها.';
    const ok = await confirm({
      title: `حذف ${c.companyName}؟`,
      message: warning,
      variant: 'danger',
      confirmText: 'حذف نهائي',
    });
    if (ok) {
      deleteClient(c.id);
      showToast('تم حذف العميل', 'success');
    }
  };

  const handleSuspend = async (c: Client): Promise<void> => {
    const ok = await confirm({
      title: `إيقاف ${c.companyName}؟`,
      message: 'سيتم تعطيل حسابهم ومنع الدخول. يمكن إعادة التفعيل لاحقاً.',
      variant: 'warning',
      confirmText: 'إيقاف',
    });
    if (ok) {
      suspendClient(c.id);
      showToast('تم إيقاف العميل', 'success');
    }
  };

  const handleReactivate = async (c: Client): Promise<void> => {
    const ok = await confirm({
      title: `تفعيل ${c.companyName}؟`,
      message: 'سيتم استعادة وصول العميل للنظام وتسجيل الدخول.',
      variant: 'info',
      confirmText: 'تفعيل',
    });
    if (ok) {
      reactivateClient(c.id);
      showToast('تم التفعيل', 'success');
    }
  };

  const handleExport = (rows: Client[]): void => {
    downloadCsv(
      `clients-${new Date().toISOString().slice(0, 10)}.csv`,
      rows.map((c) => {
        const plan = plans.find((p) => p.id === c.planId);
        const country = countries.find((co) => co.code === c.country);
        return {
          'الشركة': c.companyName,
          'جهة الاتصال': c.contactName,
          'البريد': c.email,
          'الهاتف': c.phone,
          'الدولة': country?.nameAr ?? c.country,
          'مجال العمل': c.industry,
          'الحالة': statusLabel[c.status],
          'الباقة': plan?.nameAr ?? '—',
          'الموظفون': c.agentCount,
          'المحادثات': c.conversationCount,
        };
      })
    );
    showToast(`تم تصدير ${rows.length} عميل`, 'success');
  };

  const columns: Column<Client>[] = [
    {
      key: 'company', header: 'العميل', accessor: (r) => r.companyName,
      cell: (r) => (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-8 w-8">
            <AvatarFallback className={`text-xs font-bold ${avatarColor(r.companyName)}`}>{initials(r.companyName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold truncate">{r.companyName}</p>
            <p className="text-xs text-muted-foreground truncate">{r.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'country', header: 'الدولة', accessor: (r) => r.country, hideOn: 'md',
      cell: (r) => {
        const country = countries.find((co) => co.code === r.country);
        return (
          <span className="inline-flex items-center gap-1.5">
            <span className="text-lg">{country?.flag}</span>
            <span className="text-xs">{country?.nameAr}</span>
          </span>
        );
      },
    },
    { key: 'industry', header: 'مجال العمل', accessor: (r) => r.industry, hideOn: 'lg', cell: (r) => <span className="text-muted-foreground text-xs">{r.industry}</span> },
    {
      key: 'plan', header: 'الباقة', accessor: (r) => r.planId ?? '',
      cell: (r) => {
        const plan = plans.find((p) => p.id === r.planId);
        return plan ? <span className="text-xs font-medium">{plan.nameAr}</span> : <span className="text-xs text-muted-foreground italic">بدون باقة</span>;
      },
    },
    { key: 'joined', header: 'تاريخ الانضمام', accessor: (r) => r.joinedAt, hideOn: 'lg', cell: (r) => <span className="text-muted-foreground text-xs">{formatDate(r.joinedAt)}</span> },
    { key: 'last', header: 'آخر نشاط', accessor: (r) => r.lastActiveAt, hideOn: 'lg', cell: (r) => <span className="text-muted-foreground text-xs">{timeAgo(r.lastActiveAt)}</span> },
    {
      key: 'status', header: 'الحالة', accessor: (r) => r.status,
      cell: (r) => (
        <Badge className={cn('text-[10px] font-semibold', statusBadgeClass[r.status])}>
          {statusLabel[r.status]}
        </Badge>
      ),
    },
    {
      key: 'actions', header: '', sortable: false, width: '160px', align: 'end',
      cell: (r) => (
        <div className="flex items-center gap-0.5 justify-end" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={() => navigate(`/clients/${r.id}`)}
            title="عرض التفاصيل"
            aria-label="عرض التفاصيل"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={() => openEdit(r)}
            title="تعديل"
            aria-label="تعديل"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          {r.status === 'suspended' ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => handleReactivate(r)}
              title="إعادة تفعيل"
              aria-label="إعادة تفعيل"
            >
              <PlayCircle className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => handleSuspend(r)}
              title="إيقاف"
              aria-label="إيقاف"
            >
              <PauseCircle className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={() => remove(r)}
            title="حذف"
            aria-label="حذف"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (view === 'industries') {
    return (
      <Suspense fallback={<div className="flex items-center justify-center py-20 text-muted-foreground">جارٍ التحميل...</div>}>
        <AdminIndustries onBack={() => setView('clients')} />
      </Suspense>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">العملاء</h2>
          <p className="text-sm text-muted-foreground">إدارة حسابات العملاء</p>
        </div>
        <Button variant="outline" onClick={() => setView('industries')} className="gap-2">
          <Briefcase className="h-4 w-4" />
          مجالات العمل
          <Badge variant="secondary" className="text-[10px]">{industries.length}</Badge>
        </Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="إجمالي العملاء" value={stats.total} icon={<Globe className="h-5 w-5" />} iconBg="bg-primary/15" iconColor="text-primary" />
        <StatCard label="نشطون" value={stats.active} icon={<PlayCircle className="h-5 w-5" />} iconBg="bg-success/15" iconColor="text-success" />
        <StatCard label="فترة تجريبية" value={stats.trial} icon={<Clock className="h-5 w-5" />} iconBg="bg-info/15" iconColor="text-info" />
        <StatCard label="متأخر دفع" value={stats.pastDue} icon={<AlertCircle className="h-5 w-5" />} iconBg="bg-warning/15" iconColor="text-warning" />
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        rowKey={(c) => c.id}
        searchPlaceholder="ابحث بالشركة أو الاسم أو البريد..."
        searchAccessor={(c) => `${c.companyName} ${c.contactName} ${c.email} ${c.phone}`}
        onRowClick={(c) => navigate(`/clients/${c.id}`)}
        selectable
        bulkActions={(selected, clear) => (
          <>
            <Button variant="outline" size="sm" className="rounded-lg" onClick={() => { handleExport(selected); clear(); }}>
              <Download className="h-3.5 w-3.5 me-1.5" /> تصدير
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={async () => {
                const ok = await confirm({
                  title: `إيقاف ${selected.length} عميل؟`,
                  message: 'سيتم تعطيل حساباتهم ومنع الدخول. يمكن إعادة التفعيل لاحقاً.',
                  variant: 'warning',
                  confirmText: 'إيقاف الكل',
                });
                if (ok) {
                  selected.forEach((c) => suspendClient(c.id));
                  showToast(`تم إيقاف ${selected.length} عميل`, 'success');
                  clear();
                }
              }}
            >
              <PauseCircle className="h-3.5 w-3.5 me-1.5" /> إيقاف
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg text-danger hover:text-danger"
              onClick={async () => {
                const ok = await confirm({
                  title: `حذف ${selected.length} عميل؟`,
                  message: 'سيتم حذف الاشتراكات والفواتير والمعاملات المرتبطة. هذه العملية لا يمكن التراجع عنها.',
                  variant: 'danger',
                  confirmText: 'حذف نهائي',
                });
                if (ok) {
                  selected.forEach((c) => deleteClient(c.id));
                  showToast(`تم حذف ${selected.length} عميل`, 'success');
                  clear();
                }
              }}
            >
              <Trash2 className="h-3.5 w-3.5 me-1.5" /> حذف
            </Button>
          </>
        )}
        toolbar={
          <>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | ClientStatus)}>
              <SelectTrigger className="h-9 w-[130px] rounded-lg text-sm">
                <SelectValue placeholder="كل الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="trial">تجريبي</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="past_due">متأخر</SelectItem>
                <SelectItem value="suspended">موقوف</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
            <Select value={countryFilter} onValueChange={(v) => setCountryFilter(v)}>
              <SelectTrigger className="h-9 w-[130px] rounded-lg text-sm">
                <SelectValue placeholder="كل الدول" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الدول</SelectItem>
                {countries.map((c) => <SelectItem key={c.code} value={c.code}>{c.flag} {c.nameAr}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={(v) => setPlanFilter(v)}>
              <SelectTrigger className="h-9 w-[130px] rounded-lg text-sm">
                <SelectValue placeholder="كل الباقات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الباقات</SelectItem>
                {plans.map((p) => <SelectItem key={p.id} value={p.id}>{p.nameAr}</SelectItem>)}
              </SelectContent>
            </Select>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 rounded-lg text-xs text-muted-foreground hover:text-foreground gap-1.5"
                onClick={clearFilters}
              >
                <X className="h-3.5 w-3.5" />
                مسح الفلاتر
                <Badge className="h-5 px-1.5 rounded-md bg-primary/15 text-primary border-transparent text-[10px]">
                  {activeFilterCount}
                </Badge>
              </Button>
            )}
          </>
        }
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9 rounded-lg" onClick={() => handleExport(filtered)}>
              <Download className="h-4 w-4 me-2" /> CSV
            </Button>
            <Button size="sm" className="h-9 rounded-lg" onClick={openCreate}>
              <Plus className="h-4 w-4 me-2" /> إضافة عميل
            </Button>
          </>
        }
      />

      <ClientFormDialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        client={editing}
      />

    </div>
  );
}

