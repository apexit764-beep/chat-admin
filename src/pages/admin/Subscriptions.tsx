import { useMemo, useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Repeat,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  XCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  DollarSign,
  CalendarClock,
  CreditCard,
  RefreshCcw,
  ArrowRightLeft,
  ShieldAlert,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';
import { StatCard, useConfirm } from '@components/ui';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { formatMoney, approxUSD } from '@/utils/money';
import { formatDate, initials, avatarColor } from '@/utils/format';
import { cn } from '@/lib/utils';
import type { SubscriptionStatus } from '@/types';

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

const AdminPlanRequests = lazy(() => import('./PlanRequests'));

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
  const createSubscription = useAdminStore((s) => s.createSubscription);
  const showToast = useUIStore((s) => s.showToast);
  const { confirm } = useConfirm();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | 'all'>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  const clientOf = (id: string) => clients.find((c) => c.id === id);
  const planOf = (id: string) => plans.find((p) => p.id === id);

  const rows = useMemo(() => {
    return subscriptions.map((sub) => ({
      sub,
      client: clientOf(sub.clientId),
      plan: planOf(sub.planId),
    }));
  }, [subscriptions, clients, plans]);

  const filtered = useMemo(() => {
    let list = rows;
    if (statusFilter !== 'all') list = list.filter((r) => r.sub.status === statusFilter);
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
    return list;
  }, [rows, statusFilter, planFilter, search]);

  const stats = useMemo(() => {
    const active = subscriptions.filter((s) => s.status === 'active');
    const mrrUsd = active.reduce((sum, s) => {
      const monthly = s.billingCycle === 'yearly' ? s.amount / 12 : s.amount;
      return sum + approxUSD(monthly, s.currency);
    }, 0);
    const renewingSoon = active.filter((s) => {
      const d = daysUntil(s.currentPeriodEnd);
      return d >= 0 && d <= 30;
    }).length;
    const pastDue = subscriptions.filter((s) => s.status === 'past_due').length;
    return {
      active: active.length,
      mrrUsd: Math.round(mrrUsd),
      renewingSoon,
      pastDue,
    };
  }, [subscriptions]);

  const handleCancel = async (subId: string, companyName: string): Promise<void> => {
    const ok = await confirm({
      title: `إلغاء اشتراك ${companyName}؟`,
      message: 'سيتم إيقاف التجديد التلقائي. يظل الاشتراك فعّالاً حتى نهاية الفترة الحالية.',
      variant: 'danger',
      confirmText: 'إلغاء الاشتراك',
    });
    if (ok) {
      cancelSubscription(subId);
      showToast('تم إلغاء الاشتراك', 'success');
    }
  };

  const handleRenew = async (subId: string, companyName: string): Promise<void> => {
    const ok = await confirm({
      title: `تجديد اشتراك ${companyName}؟`,
      message: 'سيتم تجديد الاشتراك لفترة جديدة بنفس الشروط الحالية.',
      confirmText: 'تجديد',
    });
    if (ok) {
      showToast('تم تجديد الاشتراك بنجاح', 'success');
    }
  };

  const [switchModal, setSwitchModal] = useState<{ subId: string; clientId: string; currentPlanId: string; companyName: string } | null>(null);

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
        <Button variant="outline" onClick={() => setView('requests')} className="gap-2">
          <ClipboardList className="h-4 w-4" />
          طلبات الاشتراك
          {pendingRequestsCount > 0 && (
            <Badge className="h-5 min-w-[20px] px-1.5 text-[10px] bg-primary text-primary-foreground rounded-full">
              {pendingRequestsCount}
            </Badge>
          )}
        </Button>
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
          label="الإيراد الشهري (MRR) ≈"
          value={`$${stats.mrrUsd.toLocaleString('en-US')}`}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          label="تجديدات خلال 30 يوم"
          value={stats.renewingSoon}
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
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as SubscriptionStatus | 'all')}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="h-4 w-4 me-2 text-muted-foreground" />
                <SelectValue placeholder="كل الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="trial">تجريبي</SelectItem>
                <SelectItem value="past_due">متأخر الدفع</SelectItem>
                <SelectItem value="cancelled">ملغى</SelectItem>
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
                <TableHead>المبلغ</TableHead>
                <TableHead className="hidden lg:table-cell">التجديد القادم</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
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
                        <Badge variant={statusVariant[sub.status]} className="gap-1">
                          {sub.status === 'active' && <CheckCircle2 className="h-3 w-3" />}
                          {sub.status === 'past_due' && <AlertTriangle className="h-3 w-3" />}
                          {sub.status === 'trial' && <Clock className="h-3 w-3" />}
                          {sub.status === 'cancelled' && <XCircle className="h-3 w-3" />}
                          {statusLabel[sub.status]}
                        </Badge>
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
                        <span className="text-sm font-semibold">{formatMoney(sub.amount, sub.currency)}</span>
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
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => client && navigate(`/clients/${client.id}`)} disabled={!client}>
                              <ExternalLink className="h-4 w-4 ml-2" />
                              عرض العميل
                            </DropdownMenuItem>
                            {sub.status !== 'cancelled' && (
                              <DropdownMenuItem onClick={() => void handleRenew(sub.id, client?.companyName ?? 'العميل')}>
                                <RefreshCcw className="h-4 w-4 ml-2" />
                                تجديد يدوي
                              </DropdownMenuItem>
                            )}
                            {sub.status !== 'cancelled' && (
                              <DropdownMenuItem onClick={() => setSwitchModal({ subId: sub.id, clientId: sub.clientId, currentPlanId: sub.planId, companyName: client?.companyName ?? 'العميل' })}>
                                <ArrowRightLeft className="h-4 w-4 ml-2" />
                                تبديل الباقة
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
          <div className="flex items-center justify-between p-4 border-t text-xs text-muted-foreground">
            <span>{filtered.length} من {subscriptions.length} اشتراك</span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" />
              التجديد التلقائي عبر Paymob
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Plan Switch Dialog */}
      <Dialog open={!!switchModal} onOpenChange={(o) => { if (!o) setSwitchModal(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تبديل باقة {switchModal?.companyName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">اختر الباقة الجديدة:</p>
            {plans.filter((p) => p.active && p.id !== switchModal?.currentPlanId).map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSwitchModal(null);
                  showToast(`تم تبديل الباقة إلى ${p.nameAr}`, 'success');
                }}
                className="w-full text-start p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setSwitchModal(null)}>إلغاء</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
