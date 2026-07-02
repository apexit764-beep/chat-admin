import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  PauseCircle,
  PlayCircle,
  Mail,
  Phone,
  Globe,
} from 'lucide-react';
import {
  DataTable,
  StatCard,
  useConfirm,
  type Column,
} from '@components/ui';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { formatMoney } from '@/utils/money';
import { formatDate, timeAgo } from '@/utils/format';
import { downloadCsv } from '@/utils/csv';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
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

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function AdminClients(): JSX.Element {
  const navigate = useNavigate();
  const clients = useAdminStore((s) => s.clients);
  const plans = useAdminStore((s) => s.plans);
  const countries = useAdminStore((s) => s.countries);
  const addClient = useAdminStore((s) => s.addClient);
  const updateClient = useAdminStore((s) => s.updateClient);
  const deleteClient = useAdminStore((s) => s.deleteClient);
  const suspendClient = useAdminStore((s) => s.suspendClient);
  const reactivateClient = useAdminStore((s) => s.reactivateClient);
  const createSubscription = useAdminStore((s) => s.createSubscription);
  const showToast = useUIStore((s) => s.showToast);
  const { confirm } = useConfirm();

  const [statusFilter, setStatusFilter] = useState<'all' | ClientStatus>('all');
  const [countryFilter, setCountryFilter] = useState<'all' | string>('all');
  const [planFilter, setPlanFilter] = useState<'all' | string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [drawer, setDrawer] = useState<Client | null>(null);
  const [form, setForm] = useState<{
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    country: string;
    industry: string;
    status: ClientStatus;
    planId: string;
  }>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    country: 'OM',
    industry: '',
    status: 'trial',
    planId: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (countryFilter !== 'all' && c.country !== countryFilter) return false;
      if (planFilter !== 'all' && c.planId !== planFilter) return false;
      return true;
    });
  }, [clients, statusFilter, countryFilter, planFilter]);

  const stats = {
    total: clients.length,
    active: clients.filter((c) => c.status === 'active').length,
    trial: clients.filter((c) => c.status === 'trial').length,
    pastDue: clients.filter((c) => c.status === 'past_due').length,
  };

  const openCreate = (): void => {
    setEditing(null);
    setForm({ companyName: '', contactName: '', email: '', phone: '', country: 'OM', industry: '', status: 'trial', planId: '' });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (c: Client): void => {
    setEditing(c);
    setForm({
      companyName: c.companyName, contactName: c.contactName, email: c.email, phone: c.phone,
      country: c.country, industry: c.industry, status: c.status, planId: c.planId ?? '',
    });
    setErrors({});
    setModalOpen(true);
  };

  const submit = (): void => {
    const e: Partial<Record<keyof typeof form, string>> = {};
    if (!form.companyName.trim()) e.companyName = 'اسم الشركة مطلوب';
    if (!form.email.trim()) e.email = 'البريد مطلوب';
    else if (!/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(form.email.trim())) e.email = 'صيغة البريد غير صحيحة';
    if (!form.phone.trim()) e.phone = 'الهاتف مطلوب';
    if (!form.contactName.trim()) e.contactName = 'الاسم مطلوب';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const country = countries.find((c) => c.code === form.country)!;
    if (editing) {
      updateClient(editing.id, {
        companyName: form.companyName, contactName: form.contactName, email: form.email,
        phone: form.phone, country: form.country, industry: form.industry, status: form.status, currency: country.currency,
      });
      if (form.planId && form.planId !== editing.planId) {
        createSubscription(editing.id, form.planId, 'monthly');
        showToast('تم التحديث وإنشاء اشتراك جديد', 'success');
      } else {
        showToast('تم تحديث بيانات العميل', 'success');
      }
    } else {
      const newClient = addClient({
        companyName: form.companyName, contactName: form.contactName, email: form.email,
        phone: form.phone, country: form.country, industry: form.industry, status: form.status,
        planId: form.planId || null, currency: country.currency,
        trialEndsAt: form.status === 'trial' ? new Date(Date.now() + 14 * 86400000).toISOString() : undefined,
        dashboardUrl: `https://${form.companyName.toLowerCase().replace(/\s+/g, '-')}.dashboard.example.com`,
      });
      if (form.planId) createSubscription(newClient.id, form.planId, 'monthly');
      showToast(`تمت إضافة: ${newClient.companyName}`, 'success');
    }
    setModalOpen(false);
  };

  const remove = async (c: Client): Promise<void> => {
    const ok = await confirm({
      title: `حذف ${c.companyName}؟`,
      message: 'سيتم حذف الاشتراك والفواتير والمعاملات المرتبطة معه. هذه العملية لا يمكن التراجع عنها.',
      variant: 'danger',
      confirmText: 'حذف نهائي',
    });
    if (ok) {
      deleteClient(c.id);
      showToast('تم حذف العميل', 'success');
      setDrawer(null);
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
          'القطاع': c.industry,
          'الحالة': statusLabel[c.status],
          'الباقة': plan?.nameAr ?? '—',
          'MRR': c.mrr,
          'العملة': c.currency,
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
            <AvatarFallback className="text-xs">{getInitials(r.companyName)}</AvatarFallback>
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
    { key: 'industry', header: 'القطاع', accessor: (r) => r.industry, hideOn: 'lg', cell: (r) => <span className="text-muted-foreground text-xs">{r.industry}</span> },
    {
      key: 'plan', header: 'الباقة', accessor: (r) => r.planId ?? '',
      cell: (r) => {
        const plan = plans.find((p) => p.id === r.planId);
        return plan ? <span className="text-xs font-medium">{plan.nameAr}</span> : <span className="text-xs text-muted-foreground italic">بدون باقة</span>;
      },
    },
    {
      key: 'mrr', header: 'MRR', accessor: (r) => r.mrr,
      cell: (r) => r.mrr > 0 ? <span className="font-semibold">{formatMoney(r.mrr, r.currency)}</span> : <span className="text-muted-foreground">—</span>,
    },
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
              onClick={() => { reactivateClient(r.id); showToast('تم التفعيل', 'success'); }}
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

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h2 className="text-2xl font-bold">العملاء</h2>
        <p className="text-sm text-muted-foreground">إدارة حسابات العملاء</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="إجمالي العملاء" value={stats.total} icon={<Globe className="h-5 w-5" />} iconBg="bg-primary/15" iconColor="text-primary" />
        <StatCard label="نشطون" value={stats.active} icon={<PlayCircle className="h-5 w-5" />} iconBg="bg-success/15" iconColor="text-success" />
        <StatCard label="فترة تجريبية" value={stats.trial} icon={<Globe className="h-5 w-5" />} iconBg="bg-info/15" iconColor="text-info" />
        <StatCard label="متأخر دفع" value={stats.pastDue} icon={<PauseCircle className="h-5 w-5" />} iconBg="bg-warning/15" iconColor="text-warning" />
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
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => { handleExport(selected); clear(); }}>
              <Download className="h-3.5 w-3.5 me-1.5" /> تصدير المحدّد
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? `تعديل ${editing.companyName}` : 'إضافة عميل جديد'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">اسم الشركة</Label>
              <Input
                id="companyName"
                value={form.companyName}
                onChange={(e) => { setForm({ ...form, companyName: e.target.value }); setErrors({ ...errors, companyName: undefined }); }}
                placeholder="مثال: Qhub"
              />
              {errors.companyName && <p className="text-sm text-destructive">{errors.companyName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">جهة الاتصال</Label>
              <Input
                id="contactName"
                value={form.contactName}
                onChange={(e) => { setForm({ ...form, contactName: e.target.value }); setErrors({ ...errors, contactName: undefined }); }}
                placeholder="الاسم الكامل"
              />
              {errors.contactName && <p className="text-sm text-destructive">{errors.contactName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="ps-9"
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: undefined }); }}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الجوال</Label>
              <div className="relative">
                <Phone className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  className="ps-9"
                  value={form.phone}
                  onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: undefined }); }}
                />
              </div>
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>
            <div className="space-y-2">
              <Label>الدولة</Label>
              <Select value={form.country} onValueChange={(v) => setForm({ ...form, country: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>{c.flag} {c.nameAr} ({c.currency})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">القطاع</Label>
              <Input
                id="industry"
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                placeholder="مثلاً: عقارات، تجزئة..."
              />
            </div>
            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as ClientStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial">فترة تجريبية</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="past_due">متأخر</SelectItem>
                  <SelectItem value="suspended">موقوف</SelectItem>
                  <SelectItem value="cancelled">ملغي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>الباقة</Label>
              <Select value={form.planId || '__none__'} onValueChange={(v) => setForm({ ...form, planId: v === '__none__' ? '' : v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">بدون باقة</SelectItem>
                  {plans.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nameAr} — {formatMoney(p.pricesPerCountry[form.country]?.monthly ?? 0, countries.find((c) => c.code === form.country)?.currency ?? 'USD')}/شهر
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>إلغاء</Button>
            <Button onClick={submit}>{editing ? 'حفظ' : 'إضافة'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={!!drawer} onOpenChange={(open) => !open && setDrawer(null)}>
        <SheetContent side="left" className="w-[460px] sm:max-w-[460px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>تفاصيل العميل</SheetTitle>
          </SheetHeader>
          {drawer && <ClientDrawerBody client={drawer} onEdit={() => { openEdit(drawer); setDrawer(null); }} onDelete={() => remove(drawer)} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ClientDrawerBody({ client, onEdit, onDelete }: { client: Client; onEdit: () => void; onDelete: () => void }): JSX.Element {
  const plans = useAdminStore((s) => s.plans);
  const subscriptions = useAdminStore((s) => s.subscriptions);
  const invoices = useAdminStore((s) => s.invoices);
  const countries = useAdminStore((s) => s.countries);
  const plan = plans.find((p) => p.id === client.planId);
  const sub = subscriptions.find((s) => s.clientId === client.id);
  const clientInvoices = invoices.filter((i) => i.clientId === client.id);
  const country = countries.find((c) => c.code === client.country);

  return (
    <div className="space-y-5 pt-4">
      <div className="text-center">
        <Avatar className="h-16 w-16 mx-auto">
          <AvatarFallback className="text-lg">{getInitials(client.companyName)}</AvatarFallback>
        </Avatar>
        <p className="text-xl font-bold mt-3">{client.companyName} <span className="text-xl">{country?.flag}</span></p>
        <p className="text-xs text-muted-foreground">{client.contactName}</p>
        <Badge className={cn('mt-2 text-[10px] font-semibold', statusBadgeClass[client.status])}>
          {statusLabel[client.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-lg bg-muted">
          <p className="text-lg font-bold">{client.agentCount}</p>
          <p className="text-xs text-muted-foreground">موظفون</p>
        </div>
        <div className="p-3 rounded-lg bg-muted">
          <p className="text-lg font-bold">{client.channelCount}</p>
          <p className="text-xs text-muted-foreground">قنوات</p>
        </div>
        <div className="p-3 rounded-lg bg-muted">
          <p className="text-lg font-bold">{client.conversationCount}</p>
          <p className="text-xs text-muted-foreground">محادثات</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold mb-2">معلومات الاتصال</p>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> {client.email}</div>
          <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> {client.phone}</div>
          <div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-muted-foreground" /> <span className="text-muted-foreground">{client.dashboardUrl || '—'}</span></div>
        </div>
      </div>

      {plan && sub && (
        <div>
          <p className="text-xs font-semibold mb-2">الاشتراك</p>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">الباقة</span><span className="font-semibold">{plan.nameAr}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">قيمة الاشتراك</span><span className="font-semibold">{formatMoney(sub.amount, sub.currency)} / شهر</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">يتجدد في</span><span>{formatDate(sub.currentPeriodEnd)}</span></div>
            {sub.paymentMethod && (
              <div className="flex justify-between"><span className="text-muted-foreground">طريقة الدفع</span><span className="font-mono">VISA {sub.paymentMethod.last4}</span></div>
            )}
          </div>
        </div>
      )}

      {clientInvoices.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-2">آخر الفواتير</p>
          <div className="space-y-1.5">
            {clientInvoices.slice(0, 4).map((inv) => (
              <div key={inv.id} className="p-2.5 rounded-lg bg-muted flex items-center justify-between text-xs">
                <div className="min-w-0">
                  <p className="font-medium font-mono">{inv.number}</p>
                  <p className="text-[10px] text-muted-foreground">{formatDate(inv.dueDate)}</p>
                </div>
                <div className="text-end">
                  <p className="font-semibold">{formatMoney(inv.total, inv.currency)}</p>
                  <span className={cn('text-[10px] font-semibold',
                    inv.status === 'paid' && 'text-success',
                    inv.status === 'failed' && 'text-danger',
                    inv.status === 'pending' && 'text-warning',
                    inv.status === 'refunded' && 'text-muted-foreground'
                  )}>{inv.status === 'paid' ? 'مدفوعة' : inv.status === 'failed' ? 'فشلت' : inv.status === 'pending' ? 'معلّقة' : 'مرتجعة'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator />

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={onEdit}>
          <Edit2 className="h-4 w-4 me-2" /> تعديل
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4 me-2" /> حذف
        </Button>
      </div>
    </div>
  );
}
