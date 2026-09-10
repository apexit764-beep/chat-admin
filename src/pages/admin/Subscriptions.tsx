import { useMemo, useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Info,
  ChevronDown,
  MoreHorizontal,
  ExternalLink,
  XCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  DollarSign,
  CalendarClock,
  ArrowRightLeft,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';
import { StatCard, useConfirm } from '@components/ui';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { ClientFormDialog } from '@/components/admin/ClientFormDialog';
import { formatMoney, formatUSD, approxUSD } from '@/utils/money';
import { formatDate, initials, avatarColor } from '@/utils/format';
import { tierRank } from '@/utils/plans';
import { startOfMonth, endOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Client, Plan, SubscriptionStatus } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { DateRangePicker } from '@/components/ui/date-range-picker';

const AdminPlanRequests = lazy(() => import('./PlanRequests'));

type SwitchMode = 'now' | 'end_of_period';

/**
 * Timing choice for replacing a live plan. Shared by the row-level تبديل الباقة
 * action and the create-subscription flow so both behave identically.
 */
function PlanSwitchOptions({ value, onChange }: { value: SwitchMode; onChange: (mode: SwitchMode) => void }): JSX.Element {
  const options: Array<{ mode: SwitchMode; title: string; detail: string }> = [
    { mode: 'now', title: 'تبديل الباقة حالاً', detail: 'يتم حساب الفرق (Proration) تلقائياً وتوليد فاتورة أو رصيد فوراً' },
    { mode: 'end_of_period', title: 'تبديل الباقة عند انتهاء الباقة الحالية', detail: 'تبقى الباقة الحالية سارية حتى موعد التجديد، ثم تُفعَّل الباقة الجديدة تلقائياً' },
  ];
  return (
    <div className="space-y-2">
      {options.map((o) => (
        <button
          key={o.mode}
          type="button"
          onClick={() => onChange(o.mode)}
          className={cn(
            'w-full text-start p-3 rounded-xl border-2 transition-colors',
            value === o.mode ? 'border-foreground bg-muted/40' : 'border-border hover:border-muted-foreground/40'
          )}
        >
          <div className="flex items-start gap-3">
            <span
              className={cn(
                'mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0',
                value === o.mode ? 'border-foreground' : 'border-muted-foreground/40'
              )}
            >
              {value === o.mode && <span className="h-2 w-2 rounded-full bg-foreground" />}
            </span>
            <div>
              <p className="text-sm font-semibold">{o.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{o.detail}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

type View = 'subscriptions' | 'requests';

const statusLabel: Record<SubscriptionStatus, string> = {
  trial: 'تجريبي',
  active: 'نشط',
  past_due: 'متأخر الدفع',
  cancelled: 'ملغى',
};

const statusVariant: Record<SubscriptionStatus, 'success' | 'warning' | 'destructive' | 'outline'> = {
  trial: 'warning',
  active: 'success',
  past_due: 'destructive',
  cancelled: 'outline',
};

const cycleLabel: Record<'monthly' | 'yearly', string> = {
  monthly: 'شهري',
  yearly: 'سنوي',
};

function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
}

export default function AdminSubscriptions(): JSX.Element {
  const navigate = useNavigate();
  const subscriptions = useAdminStore((s) => s.subscriptions);
  const clients = useAdminStore((s) => s.clients);
  const plans = useAdminStore((s) => s.plans);
  const cancelSubscription = useAdminStore((s) => s.cancelSubscription);
  const extendSubscription = useAdminStore((s) => s.extendSubscription);
  const updateSubscription = useAdminStore((s) => s.updateSubscription);
  const createSubscription = useAdminStore((s) => s.createSubscription);
  const markSubscriptionPaid = useAdminStore((s) => s.markSubscriptionPaid);
  const switchSubscriptionPlan = useAdminStore((s) => s.switchSubscriptionPlan);
  const cancelScheduledPlanSwitch = useAdminStore((s) => s.cancelScheduledPlanSwitch);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const showToast = useUIStore((s) => s.showToast);
  const { confirm } = useConfirm();

  /* ── Create subscription flow (US-136) ── */
  const [createStep, setCreateStep] = useState<'form' | 'confirm' | null>(null);
  const [createClientId, setCreateClientId] = useState('');
  const [clientQuery, setClientQuery] = useState('');
  const [createPlanId, setCreatePlanId] = useState('');
  const [createCycle, setCreateCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [switchMode, setSwitchMode] = useState<SwitchMode>('now');
  const [quickAddClient, setQuickAddClient] = useState(false);
  const [clientPickerOpen, setClientPickerOpen] = useState(false);

  const [search, setSearch] = useState('');
  /** «scheduled» is not a stored status — it selects subscriptions holding a pending plan switch */
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | 'all' | 'scheduled'>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const clientOf = (id: string) => clients.find((c) => c.id === id);
  const planOf = (id: string) => plans.find((p) => p.id === id);

  const activeSubOf = (clientId: string) =>
    subscriptions.find((s) => s.clientId === clientId && (s.status === 'active' || s.status === 'trial'));

  const createClient: Client | undefined = createClientId ? clientOf(createClientId) : undefined;
  const createPlan: Plan | undefined = createPlanId ? planOf(createPlanId) : undefined;
  const createPrice = createClient && createPlan
    ? createPlan.pricesPerCountry[createClient.country]?.[createCycle === 'yearly' ? 'yearly' : 'monthly']
    : undefined;

  /** the plan a client sits on right now, for the picker rows and the switch notice */
  const currentPlanOf = (clientId: string): Plan | undefined => {
    const sub = activeSubOf(clientId);
    return sub ? planOf(sub.planId) : undefined;
  };

  const createCurrentSub = createClientId ? activeSubOf(createClientId) : undefined;
  const createCurrentPlan = createCurrentSub ? planOf(createCurrentSub.planId) : undefined;

  /** none = free to subscribe · same/upgrade/downgrade = replacing a live plan */
  const switchScenario: 'none' | 'same' | 'upgrade' | 'downgrade' = !createCurrentPlan
    ? 'none'
    : !createPlan || createPlan.id === createCurrentPlan.id
      ? (createPlan ? 'same' : 'none')
      : tierRank(createPlan.tier) > tierRank(createCurrentPlan.tier)
        ? 'upgrade'
        : 'downgrade';

  const clientResults = useMemo(() => {
    const q = clientQuery.trim().toLowerCase();
    const list = q
      ? clients.filter((c) => c.companyName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
      : clients;
    return list.slice(0, 8);
  }, [clients, clientQuery]);

  const openCreate = (): void => {
    setCreateClientId('');
    setClientQuery('');
    setCreatePlanId('');
    setCreateCycle('monthly');
    setCreateStep('form');
  };

  const proceedFromForm = (): void => {
    if (!createClientId) { showToast('اختر العميل أولاً', 'error'); return; }
    if (!createPlanId) { showToast('اختر الباقة أولاً', 'error'); return; }
    if (switchScenario === 'same') { showToast('العميل مشترك في هذه الباقة بالفعل — اختر باقة مختلفة', 'error'); return; }
    setCreateStep('confirm');
  };

  const confirmCreate = (): void => {
    if (!createClient || !createPlan) return;
    createSubscription(createClient.id, createPlan.id, createCycle);
    addNotification({
      type: 'subscription',
      title: 'تم إرسال إشعار الدفع للعميل',
      body: `تم إنشاء اشتراك ${createPlan.nameAr} لعميل «${createClient.companyName}»، ووصله إشعار بالباقة الجديدة مع زر الانتقال للدفع.`,
    });
    showToast(`تم إنشاء الاشتراك بنجاح لعميل «${createClient.companyName}»`, 'success');
    setCreateStep(null);
  };

  /** a downgrade waits for the current period to end; anything else applies at once */
  const createSwitchMode: SwitchMode = switchScenario === 'downgrade' ? 'end_of_period' : 'now';

  const confirmSwitch = (): void => {
    const current = createClientId ? activeSubOf(createClientId) : undefined;
    if (!current || !createPlan) return;
    switchSubscriptionPlan(current.id, createPlan.id, createSwitchMode);
    showToast(
      createSwitchMode === 'now'
        ? `تم تبديل الباقة إلى ${createPlan.nameAr}`
        : `سيتم التخفيض إلى ${createPlan.nameAr} عند انتهاء الاشتراك الحالي`,
      'success'
    );
    setCreateStep(null);
  };

  const rows = useMemo(() => {
    return subscriptions.map((sub) => ({
      sub,
      client: clientOf(sub.clientId),
      plan: planOf(sub.planId),
    }));
  }, [subscriptions, clients, plans]);

  const filtered = useMemo(() => {
    let list = rows;
    if (statusFilter === 'scheduled') list = list.filter((r) => Boolean(r.sub.scheduledPlanId));
    else if (statusFilter !== 'all') list = list.filter((r) => r.sub.status === statusFilter);
    if (planFilter !== 'all') list = list.filter((r) => r.sub.planId === planFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.client?.companyName.toLowerCase().includes(q) ||
          r.client?.contactName.toLowerCase().includes(q) ||
          r.client?.email.toLowerCase().includes(q)
      );
    }
    if (dateRange) {
      const from = dateRange.from.getTime();
      const to = dateRange.to.getTime() + 86400000 - 1;
      list = list.filter((r) => {
        const t = Date.parse(r.sub.startedAt);
        return t >= from && t <= to;
      });
    }
    return list;
  }, [rows, statusFilter, planFilter, search, dateRange]);

  const stats = useMemo(() => {
    const subs = filtered.map((r) => r.sub);
    const active = subs.filter((s) => s.status === 'active');
    const totalRevenue = subs
      .filter((s) => s.status === 'active' || s.status === 'past_due')
      .reduce((sum, s) => sum + approxUSD(s.amount, s.currency), 0);
    const renewals = subs.filter((s) => s.status === 'active' && s.billingCycle === 'monthly').length
      + subs.filter((s) => s.status === 'active' && s.billingCycle === 'yearly').length;
    const pastDue = subs.filter((s) => s.status === 'past_due').length;
    return {
      active: active.length,
      totalRevenue: Math.round(totalRevenue),
      renewals,
      pastDue,
    };
  }, [filtered]);

  const handleCancel = async (subId: string, companyName: string): Promise<void> => {
    const ok = await confirm({
      title: `إلغاء اشتراك ${companyName}؟`,
      message: 'سيتم إيقاف التجديد التلقائي. يظل الاشتراك فعّالاً حتى نهاية الفترة الحالية.',
      variant: 'danger',
      confirmText: 'إلغاء الاشتراك',
    });
    if (ok) {
      cancelSubscription(subId, 'end_of_period');
      showToast('تم إلغاء الاشتراك', 'success');
    }
  };

  const [switchModal, setSwitchModal] = useState<{ subId: string; clientId: string; currentPlanId: string; companyName: string; newPlanId?: string } | null>(null);
  const [extendModal, setExtendModal] = useState<{ subId: string; companyName: string } | null>(null);
  const [extendDays, setExtendDays] = useState('');

  const [view, setView] = useState<View>('subscriptions');
  const planRequests = useAdminStore((s) => s.planRequests);
  const pendingRequestsCount = planRequests.filter((r) => r.status === 'new' || r.status === 'contacted').length;

  if (view === 'requests') {
    return (
      <div className="p-4 lg:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setView('subscriptions')} className="h-9 w-9">
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">طلبات الاشتراك</h2>
            <p className="text-sm text-muted-foreground">طلبات الترقية والاشتراك الجديدة من العملاء</p>
          </div>
        </div>
        <Suspense fallback={<div className="flex items-center justify-center py-20 text-muted-foreground">جارٍ التحميل...</div>}>
          <AdminPlanRequests embedded />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">الاشتراكات</h2>
          <p className="text-sm text-muted-foreground">إدارة اشتراكات العملاء والتجديدات</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setView('requests')} className="gap-2">
            <ClipboardList className="h-4 w-4" />
            طلبات الاشتراك
            {pendingRequestsCount > 0 && (
              <Badge className="h-5 min-w-[20px] px-1.5 text-[10px] bg-primary text-primary-foreground rounded-full">
                {pendingRequestsCount}
              </Badge>
            )}
          </Button>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            إنشاء اشتراك
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="اشتراكات نشطة"
          value={stats.active}
          icon={<CheckCircle2 className="h-5 w-5" />}
          iconBg="bg-success/15"
          iconColor="text-success"
        />
        <StatCard
          label="إجمالي الإيرادات"
          value={`$${stats.totalRevenue.toLocaleString('en-US')}`}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          label="إجمالي التجديدات"
          value={stats.renewals}
          icon={<CalendarClock className="h-5 w-5" />}
          iconBg="bg-warning/15"
          iconColor="text-warning"
        />
        <StatCard
          label="متأخرة الدفع"
          value={stats.pastDue}
          icon={<AlertTriangle className="h-5 w-5" />}
          iconBg="bg-danger/15"
          iconColor="text-danger"
        />
      </div>

      {/* Table card */}
      <Card>
        <CardContent className="p-0">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 border-b">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث باسم العميل أو البريد..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as SubscriptionStatus | 'all' | 'scheduled')}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="كل الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="trial">تجريبي</SelectItem>
                <SelectItem value="past_due">متأخر الدفع</SelectItem>
                <SelectItem value="cancelled">ملغى</SelectItem>
                <SelectItem value="scheduled">مجدولة</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="كل الباقات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الباقات</SelectItem>
                {plans.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.nameAr}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead className="w-[260px]">العميل</TableHead>
                <TableHead>الباقة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="hidden md:table-cell">الدورة</TableHead>
                <TableHead>المبلغ (USD)</TableHead>
                <TableHead className="hidden md:table-cell">تاريخ البداية</TableHead>
                <TableHead className="hidden lg:table-cell">تاريخ انتهاء الاشتراك</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    لا توجد اشتراكات مطابقة
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(({ sub, client, plan }, idx) => {
                  const renewDays = daysUntil(sub.currentPeriodEnd);
                  const soon = sub.status === 'active' && renewDays >= 0 && renewDays <= 7;
                  return (
                    <TableRow key={sub.id} className="group">
                      <TableCell className="text-xs text-muted-foreground font-mono">{idx + 1}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => client && navigate(`/clients/${client.id}`)}
                          className="flex items-center gap-3 text-start"
                        >
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className={`text-xs font-bold ${avatarColor(client?.companyName ?? '؟')}`}>
                              {initials(client?.companyName ?? '؟')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate hover:text-primary transition-colors">
                              {client?.companyName ?? 'عميل محذوف'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{client?.email ?? '—'}</p>
                          </div>
                        </button>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{plan?.nameAr ?? '—'}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-1">
                          <Badge variant={statusVariant[sub.status]} className="gap-1">
                            {sub.status === 'active' && <CheckCircle2 className="h-3 w-3" />}
                            {sub.status === 'past_due' && <AlertTriangle className="h-3 w-3" />}
                            {sub.status === 'trial' && <Clock className="h-3 w-3" />}
                            {sub.status === 'cancelled' && <XCircle className="h-3 w-3" />}
                            {statusLabel[sub.status]}
                          </Badge>
                          {sub.scheduledPlanId && (
                            <Badge
                              variant="warning"
                              className="gap-1"
                              title={`تبديل إلى ${planOf(sub.scheduledPlanId)?.nameAr ?? 'باقة أخرى'} عند التجديد`}
                            >
                              <CalendarClock className="h-3 w-3" />
                              مجدولة
                            </Badge>
                          )}
                        </div>
                        {sub.status === 'past_due' && (() => {
                          const daysPastDue = Math.ceil((Date.now() - new Date(sub.currentPeriodEnd).getTime()) / (24 * 60 * 60 * 1000));
                          const graceDays = 7;
                          const remaining = Math.max(0, graceDays - daysPastDue);
                          return remaining > 0 ? (
                            <span className="text-[10px] text-warning block mt-0.5">
                              فترة سماح: {remaining} يوم
                            </span>
                          ) : (
                            <span className="text-[10px] text-destructive block mt-0.5">
                              انتهت فترة السماح
                            </span>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary" className="text-[11px]">{cycleLabel[sub.billingCycle]}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold">{formatUSD(sub.amount, sub.currency)}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {sub.pendingStart ? (
                          <span className="text-xs">يتحدد عند نجاح الدفع</span>
                        ) : (
                          formatDate(sub.startedAt)
                        )}
                        {sub.scheduledPlanId && (
                          <span className="block text-[11px] text-warning mt-0.5">
                            تبديل إلى {planOf(sub.scheduledPlanId)?.nameAr} عند التجديد
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {sub.status === 'cancelled' ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <CalendarClock className={cn('h-3.5 w-3.5', soon ? 'text-warning' : 'text-muted-foreground')} />
                            <span className={cn('text-xs', soon ? 'text-warning font-medium' : 'text-muted-foreground')}>
                              {formatDate(sub.currentPeriodEnd)}
                              {renewDays >= 0 && renewDays <= 30 && (
                                <span className="mr-1">({renewDays} يوم)</span>
                              )}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => client && navigate(`/clients/${client.id}`)} disabled={!client}>
                              <ExternalLink className="h-4 w-4 ml-2" />
                              عرض العميل
                            </DropdownMenuItem>
                            {sub.status === 'past_due' && (
                              <DropdownMenuItem
                                onClick={() => {
                                  markSubscriptionPaid(sub.id);
                                  showToast(`تم تفعيل اشتراك ${client?.companyName ?? 'العميل'} بعد نجاح الدفع`, 'success');
                                }}
                              >
                                <CheckCircle2 className="h-4 w-4 ml-2" />
                                تأكيد استلام الدفع
                              </DropdownMenuItem>
                            )}
                            {sub.status !== 'cancelled' && (
                              <DropdownMenuItem onClick={() => { setExtendModal({ subId: sub.id, companyName: client?.companyName ?? 'العميل' }); setExtendDays(''); }}>
                                <CalendarClock className="h-4 w-4 ml-2" />
                                تمديد
                              </DropdownMenuItem>
                            )}
                            {sub.status !== 'cancelled' && (
                              <DropdownMenuItem onClick={() => { setSwitchMode('now'); setSwitchModal({ subId: sub.id, clientId: sub.clientId, currentPlanId: sub.planId, companyName: client?.companyName ?? 'العميل' }); }}>
                                <ArrowRightLeft className="h-4 w-4 ml-2" />
                                تبديل الباقة
                              </DropdownMenuItem>
                            )}
                            {sub.scheduledPlanId && (
                              <DropdownMenuItem
                                onClick={() => {
                                  cancelScheduledPlanSwitch(sub.id);
                                  showToast(`تم إلغاء التبديل المجدول لاشتراك ${client?.companyName ?? 'العميل'}`, 'success');
                                }}
                              >
                                <XCircle className="h-4 w-4 ml-2" />
                                إلغاء الجدولة
                              </DropdownMenuItem>
                            )}
                            {sub.status !== 'cancelled' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => void handleCancel(sub.id, client?.companyName ?? 'العميل')}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <XCircle className="h-4 w-4 ml-2" />
                                  إلغاء الاشتراك
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Footer summary */}
          <div className="p-4 border-t text-xs text-muted-foreground">
            <span>{filtered.length} من {subscriptions.length} اشتراك</span>
          </div>
        </CardContent>
      </Card>

      {/* ── Create subscription — step 1: the form ── */}
      <Dialog open={createStep === 'form'} onOpenChange={(o) => { if (!o) setCreateStep(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>إنشاء اشتراك</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2 px-0.5 max-h-[65vh] overflow-y-auto">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">اختيار العميل<span className="text-destructive ms-0.5">*</span></label>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => setQuickAddClient(true)}>
                  <Plus className="h-3.5 w-3.5" />
                  عميل جديد
                </Button>
              </div>
              <Popover open={clientPickerOpen} onOpenChange={(o) => { setClientPickerOpen(o); if (o) setClientQuery(''); }}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between gap-2 h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    {createClient ? (
                      <span className="flex items-center gap-2 min-w-0">
                        <Avatar className="h-6 w-6 shrink-0">
                          <AvatarFallback className={cn('text-[10px]', avatarColor(createClient.companyName))}>
                            {initials(createClient.companyName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate">{createClient.companyName}</span>
                        {createCurrentPlan && (
                          <Badge variant="secondary" className="text-[10px] shrink-0">{createCurrentPlan.nameAr}</Badge>
                        )}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">اختر العميل</span>
                    )}
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
                  <div className="p-2 border-b">
                    <div className="relative">
                      <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        autoFocus
                        value={clientQuery}
                        onChange={(e) => setClientQuery(e.target.value)}
                        placeholder="بحث بالاسم أو البريد..."
                        className="h-8 ps-8 text-sm"
                      />
                    </div>
                  </div>
                  <div className="max-h-56 overflow-y-auto py-1">
                    {clientResults.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-6">لا يوجد عملاء مطابقون</p>
                    ) : (
                      clientResults.map((c) => {
                        const rowPlan = currentPlanOf(c.id);
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => { setCreateClientId(c.id); setClientPickerOpen(false); }}
                            className="w-full text-start px-2.5 py-2 hover:bg-muted/60 transition-colors flex items-center gap-2"
                          >
                            <Avatar className="h-7 w-7 shrink-0">
                              <AvatarFallback className={cn('text-[10px]', avatarColor(c.companyName))}>
                                {initials(c.companyName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium truncate">{c.companyName}</span>
                              <span className="block text-[11px] text-muted-foreground truncate">{c.email}</span>
                            </span>
                            {rowPlan ? (
                              <Badge variant="secondary" className="text-[10px] shrink-0">{rowPlan.nameAr}</Badge>
                            ) : (
                              <span className="text-[10px] text-muted-foreground shrink-0">بدون اشتراك</span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              <p className="text-[11px] text-muted-foreground">اختيار من عملاء موجودين مسبقاً فقط — هذا النموذج لا يُنشئ عميلاً جديداً.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">اختيار الباقة<span className="text-destructive ms-0.5">*</span></label>
              <Select value={createPlanId} onValueChange={setCreatePlanId}>
                <SelectTrigger><SelectValue placeholder="اختر الباقة" /></SelectTrigger>
                <SelectContent>
                  {/* the trial plan is not pickable here — trials are the toggle below */}
                  {plans.filter((p) => !p.isTrial).map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.nameAr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">المدة</label>
              <div className="inline-flex p-1 rounded-lg bg-muted">
                {([['monthly', 'شهري'], ['yearly', 'سنوي']] as const).map(([v, label]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setCreateCycle(v)}
                    className={cn(
                      'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
                      createCycle === v ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

            {createCurrentPlan && (
              <div
                className={cn(
                  'rounded-xl border p-3.5',
                  switchScenario === 'same'
                    ? 'border-warning/40 bg-warning/5'
                    : 'border-destructive/30 bg-destructive/5'
                )}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle className={cn('h-4 w-4', switchScenario === 'same' ? 'text-warning' : 'text-destructive')} />
                  <p className={cn('text-sm font-semibold', switchScenario === 'same' ? 'text-warning' : 'text-destructive')}>
                    {switchScenario === 'same' ? 'نفس الباقة الحالية' :
                     switchScenario === 'upgrade' ? 'ترقية باقة' :
                     switchScenario === 'downgrade' ? 'تخفيض باقة' : 'العميل مشترك حالياً'}
                  </p>
                </div>
                <p className="text-sm leading-relaxed">
                  العميل «{createClient?.companyName}» مشترك حالياً في باقة{' '}
                  <span className="font-semibold">{createCurrentPlan.nameAr}</span>
                  {switchScenario === 'none' && ' — اختر الباقة الجديدة للمتابعة.'}
                  {switchScenario === 'same' && ' — اختر باقة مختلفة للترقية أو التخفيض.'}
                  {switchScenario === 'upgrade' && (
                    <>
                      . سيتم استبدالها بباقة{' '}
                      <span className="font-semibold">{createPlan?.nameAr}</span>{' '}
                      فوراً مع احتساب فرق السعر (Proration).
                    </>
                  )}
                  {switchScenario === 'downgrade' && (
                    <>
                      . سيتم التخفيض إلى باقة{' '}
                      <span className="font-semibold">{createPlan?.nameAr}</span>{' '}
                      <span className="font-semibold">عند انتهاء الاشتراك الحالي</span> — تبقى الباقة
                      الحالية سارية حتى ذلك الحين.
                    </>
                  )}
                </p>
              </div>
            )}
            </div>

          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCreateStep(null)}>إلغاء</Button>
            <Button onClick={proceedFromForm}>متابعة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* new client created from inside the flow lands selected in the picker */}
      <ClientFormDialog
        open={quickAddClient}
        onOpenChange={setQuickAddClient}
        onBack={() => setQuickAddClient(false)}
        onSaved={(c) => { setCreateClientId(c.id); setClientQuery(''); }}
      />

      {/* ── Create subscription — step 2: final confirmation ── */}
      <Dialog open={createStep === 'confirm'} onOpenChange={(o) => { if (!o) setCreateStep(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{createCurrentPlan ? 'تأكيد تبديل الباقة' : 'تأكيد إنشاء الاشتراك'}</DialogTitle>
          </DialogHeader>

          <div className="rounded-xl border p-4 space-y-2.5">
            <p className="text-xs text-muted-foreground">ملخص الاشتراك</p>
            {[
              ['العميل', createClient?.companyName ?? '—'],
              ...(createCurrentPlan ? [['الباقة الحالية', createCurrentPlan.nameAr]] : []),
              [createCurrentPlan ? 'الباقة الجديدة' : 'الباقة', createPlan?.nameAr ?? '—'],
              ['المدة', createCycle === 'monthly' ? 'شهري' : 'سنوي'],
              createCurrentPlan
                ? ['موعد التنفيذ', createSwitchMode === 'now' ? 'فوراً' : 'عند انتهاء الاشتراك الحالي']
                : ['تاريخ البدء', 'يتحدد عند نجاح الدفع'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
            <div className="border-t border-dashed pt-2.5 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">السعر</span>
              <span className="font-bold">
                {createPrice !== undefined && createClient
                  ? `${formatMoney(createPrice, createClient.currency)} / ${createCycle === 'monthly' ? 'شهرياً' : 'سنوياً'}`
                  : '—'}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-dashed p-3.5">
            <div className="flex items-center gap-2 mb-1">
              <Info className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold">
                {createCurrentPlan ? 'ما الذي سيحدث؟' : 'حالة الاشتراك بعد الإنشاء'}
              </p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {!createCurrentPlan
                ? 'يُسجَّل الاشتراك بحالة متأخر الدفع، ولا يتحوّل إلى نشط إلا بعد أن يُتمّ العميل الدفع بنجاح.'
                : createSwitchMode === 'now'
                  ? 'تُبدَّل الباقة فوراً، ويُحتسب فرق السعر (Proration) فتُولَّد فاتورة أو رصيد.'
                  : 'تبقى الباقة الحالية سارية حتى انتهائها، ثم تُفعَّل الباقة الأقل تلقائياً. وتُولَّد فاتورة بحالة «مجدولة» للفترة القادمة، يمكن إلغاؤها من إجراء «إلغاء الجدولة».'}
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCreateStep('form')}>رجوع</Button>
            <Button onClick={createCurrentPlan ? confirmSwitch : confirmCreate}>
              {createCurrentPlan ? 'تأكيد التبديل' : 'تأكيد إنشاء الاشتراك'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Plan Switch Dialog */}
      <Dialog open={!!switchModal} onOpenChange={(o) => { if (!o) setSwitchModal(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تبديل باقة {switchModal?.companyName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">اختر الباقة الجديدة:</p>
              {plans.filter((p) => p.active && p.id !== switchModal?.currentPlanId).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSwitchModal((m) => (m ? { ...m, newPlanId: p.id } : m))}
                  className={cn(
                    'w-full text-start p-3 rounded-lg border-2 transition-colors',
                    switchModal?.newPlanId === p.id ? 'border-foreground bg-muted/40' : 'border-border hover:border-muted-foreground/40'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{p.nameAr}</p>
                      <p className="text-xs text-muted-foreground">{p.tagline}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">{p.tier}</Badge>
                  </div>
                </button>
              ))}
            </div>

            {switchModal?.newPlanId && (
              <div className="space-y-2 border-t pt-3">
                <p className="text-sm text-muted-foreground">متى يتم التبديل؟</p>
                <PlanSwitchOptions value={switchMode} onChange={setSwitchMode} />
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSwitchModal(null)}>إلغاء</Button>
            <Button
              disabled={!switchModal?.newPlanId}
              onClick={() => {
                if (!switchModal?.newPlanId) return;
                const target = planOf(switchModal.newPlanId);
                switchSubscriptionPlan(switchModal.subId, switchModal.newPlanId, switchMode);
                setSwitchModal(null);
                showToast(
                  switchMode === 'now'
                    ? `تم تبديل الباقة إلى ${target?.nameAr ?? ''}`
                    : `سيتم التبديل إلى ${target?.nameAr ?? ''} عند انتهاء الباقة الحالية`,
                  'success'
                );
              }}
            >
              تأكيد التبديل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!extendModal} onOpenChange={(o) => { if (!o) setExtendModal(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>تمديد اشتراك {extendModal?.companyName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <label className="block text-sm font-medium">عدد الأيام</label>
            <Input
              type="number"
              min={1}
              value={extendDays}
              onChange={(e) => setExtendDays(e.target.value)}
              placeholder="مثال: 30"
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setExtendModal(null)}>إلغاء</Button>
            <Button
              disabled={!extendDays || Number(extendDays) < 1}
              onClick={() => {
                if (extendModal && Number(extendDays) >= 1) {
                  extendSubscription(extendModal.subId, Number(extendDays));
                  showToast(`تم تمديد الاشتراك ${Number(extendDays)} يوم`, 'success');
                  setExtendModal(null);
                }
              }}
            >
              تمديد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
