import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Building2,
  UserCog,
  Receipt,
  CreditCard,
} from 'lucide-react';
import { StatCard } from '@components/ui';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { LineChart } from '@components/charts/LineChart';
import { useAdminStore } from '@/store/useAdminStore';
import { formatMoney, approxUSD } from '@/utils/money';
import { timeAgo, initials, avatarColor } from '@/utils/format';
import type { Client } from '@/types';

const MONTH_NAMES_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

export default function AdminDashboard(): JSX.Element {
  const clients = useAdminStore((s) => s.clients);
  const subscriptions = useAdminStore((s) => s.subscriptions);
  const transactions = useAdminStore((s) => s.transactions);
  const invoices = useAdminStore((s) => s.invoices);
  const plans = useAdminStore((s) => s.plans);
  const countries = useAdminStore((s) => s.countries);
  const adminUsers = useAdminStore((s) => s.adminUsers);

  /* ══════════════════════ Financial metrics ══════════════════════ */

  // MRR = sum of active monthly subscriptions in USD
  const mrrTotal = useMemo(() =>
    subscriptions
      .filter((s) => s.status === 'active' && s.billingCycle === 'monthly')
      .reduce((acc, s) => acc + approxUSD(s.amount, s.currency), 0),
    [subscriptions]
  );

  // ARR = MRR × 12
  const arrTotal = Math.round(mrrTotal * 12);

  // ARPU (average revenue per user) = MRR / active clients
  const activeClients = useMemo(() => clients.filter((c) => c.status === 'active'), [clients]);
  const arpu = activeClients.length ? Math.round(mrrTotal / activeClients.length) : 0;

  // MRR history: active-at-that-time subscriptions
  const mrrHistory = useMemo(() => {
    const now = new Date();
    const labels: string[] = [];
    const values: number[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const total = subscriptions
        .filter((s) => s.billingCycle === 'monthly')
        .filter((s) => {
          const start = new Date(s.startedAt);
          if (start > monthEnd) return false;
          // Was still active at monthEnd
          if (s.status === 'cancelled' && s.cancelAt && new Date(s.cancelAt) <= monthEnd) return false;
          return true;
        })
        .reduce((acc, s) => acc + approxUSD(s.amount, s.currency), 0);
      labels.push(MONTH_NAMES_AR[monthEnd.getMonth()]);
      values.push(Math.round(total));
    }
    return { labels, values };
  }, [subscriptions]);

  const currentMrr = Math.round(mrrTotal);
  const prevMrr = mrrHistory.values[mrrHistory.values.length - 2] ?? 0;
  const mrrGrowth = prevMrr > 0
    ? Math.round(((currentMrr - prevMrr) / prevMrr) * 100)
    : null;

  /* ══════════════════════ Client metrics ══════════════════════ */

  const trialCount = clients.filter((c) => c.status === 'trial').length;
  const pastDueCount = clients.filter((c) => c.status === 'past_due').length;
  const cancelledCount = clients.filter((c) => c.status === 'cancelled').length;

  // Proper churn: cancelled / (active + past_due + cancelled)   — excludes trials
  const paidBase = activeClients.length + pastDueCount + cancelledCount;
  const churnRate = paidBase > 0 ? Math.round((cancelledCount / paidBase) * 100) : 0;

  // Retention rate = 100 - churn (out of paid customers)
  const retentionRate = 100 - churnRate;

  // New clients within last 30 days
  const newClients30d = useMemo(() => {
    const cutoff = Date.now() - 30 * 86400000;
    return clients.filter((c) => Date.parse(c.joinedAt) >= cutoff).length;
  }, [clients]);

  // Total revenue from all successful transactions
  const totalRevenue = useMemo(() =>
    Math.round(transactions
      .filter((t) => t.status === 'succeeded')
      .reduce((acc, t) => acc + approxUSD(t.amount, t.currency), 0)),
    [transactions]
  );

  // Total active subscriptions
  const activeSubscriptions = useMemo(() =>
    subscriptions.filter((s) => s.status === 'active').length,
    [subscriptions]
  );

  // Total invoices count
  const totalInvoices = invoices.length;

  // Trial → paid conversion (last 90 days)
  const conversionRate = useMemo(() => {
    const cutoff = Date.now() - 90 * 86400000;
    const recentClients = clients.filter((c) => Date.parse(c.joinedAt) >= cutoff);
    if (recentClients.length === 0) return 0;
    const converted = recentClients.filter((c) => c.status === 'active').length;
    return Math.round((converted / recentClients.length) * 100);
  }, [clients]);

  /* ══════════════════════ Alerts ══════════════════════ */

  const expiringTrials = useMemo(() => {
    const now = Date.now();
    return clients
      .filter((c) => c.status === 'trial' && c.trialEndsAt)
      .map((c) => ({
        client: c,
        daysLeft: Math.ceil((new Date(c.trialEndsAt!).getTime() - now) / 86400000),
      }))
      .filter((x) => x.daysLeft >= 0 && x.daysLeft <= 7)
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 5);
  }, [clients]);

  const pastDueClients = useMemo(() => {
    return clients
      .filter((c) => c.status === 'past_due')
      .map((c) => {
        const sub = subscriptions.find((s) => s.id === c.subscriptionId);
        return { client: c, amount: sub?.amount ?? c.mrr, currency: sub?.currency ?? c.currency };
      })
      .slice(0, 5);
  }, [clients, subscriptions]);

  const overdueInvoiceAmount = useMemo(() =>
    invoices
      .filter((inv) => inv.status === 'pending' && new Date(inv.dueDate) < new Date())
      .reduce((acc, inv) => acc + approxUSD(inv.total, inv.currency), 0),
    [invoices]
  );

  /* ══════════════════════ Distribution ══════════════════════ */

  const topPlans = useMemo(() => {
    return plans
      .map((p) => {
        const subscribers = clients.filter((c) => c.planId === p.id && c.status === 'active').length;
        const revenue = subscriptions
          .filter((s) => s.planId === p.id && s.status === 'active' && s.billingCycle === 'monthly')
          .reduce((acc, s) => acc + approxUSD(s.amount, s.currency), 0);
        return { plan: p, subscribers, revenue: Math.round(revenue) };
      })
      .filter((x) => x.subscribers > 0)
      .sort((a, b) => b.subscribers - a.subscribers)
      .slice(0, 5);
  }, [plans, clients, subscriptions]);

  const byCountry = useMemo(() => {
    return countries
      .map((co) => {
        const coClients = clients.filter((c) => c.country === co.code);
        const activeCoClients = coClients.filter((c) => c.status === 'active');
        const mrr = subscriptions
          .filter((s) => s.status === 'active' && s.billingCycle === 'monthly')
          .filter((s) => coClients.some((c) => c.id === s.clientId))
          .reduce((acc, s) => acc + approxUSD(s.amount, s.currency), 0);
        return {
          code: co.code,
          name: co.nameAr,
          flag: co.flag,
          total: coClients.length,
          active: activeCoClients.length,
          mrr: Math.round(mrr),
        };
      })
      .filter((x) => x.total > 0)
      .sort((a, b) => b.mrr - a.mrr)
      .slice(0, 5);
  }, [countries, clients, subscriptions]);

  /* ══════════════════════ Recent activity ══════════════════════ */

  const recentClients = useMemo(
    () => [...clients].sort((a, b) => Date.parse(b.joinedAt) - Date.parse(a.joinedAt)).slice(0, 5),
    [clients]
  );


  return (
    <div className="p-4 lg:p-6 space-y-5 page-fade">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">نظرة عامة</h2>
        <p className="text-sm text-muted-foreground">ملخّص الأداء المالي والتشغيلي للمنصة</p>
      </div>

      {/* ══════════ Section 1: All KPIs in 2 rows ══════════ */}
      <section className="space-y-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="إجمالي العملاء"
            value={clients.length}
            icon={<Building2 className="h-4 w-4" />}
            iconBg="bg-primary/15"
            iconColor="text-primary"
          />
          <StatCard
            label="عملاء نشطون"
            value={activeClients.length}
            icon={<CheckCircle2 className="h-4 w-4" />}
            iconBg="bg-success/15"
            iconColor="text-success"
          />
          <StatCard
            label="إجمالي الموظفين"
            value={adminUsers.length}
            icon={<UserCog className="h-4 w-4" />}
            iconBg="bg-info/15"
            iconColor="text-info"
          />
          <StatCard
            label="إجمالي الإيرادات"
            value={`$${totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-4 w-4" />}
            iconBg="bg-success/15"
            iconColor="text-success"
          />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="الإيراد الشهري (MRR)"
            value={`$${currentMrr.toLocaleString()}`}
            icon={<TrendingUp className="h-4 w-4" />}
            iconBg="bg-primary/15"
            iconColor="text-primary"
            trend={mrrGrowth !== null ? { value: Math.abs(mrrGrowth), positive: mrrGrowth >= 0 } : undefined}
          />
          <StatCard
            label="الاشتراكات النشطة"
            value={activeSubscriptions}
            icon={<CreditCard className="h-4 w-4" />}
            iconBg="bg-warning/15"
            iconColor="text-warning"
          />
          <StatCard
            label="إجمالي الفواتير"
            value={totalInvoices}
            icon={<Receipt className="h-4 w-4" />}
            iconBg="bg-info/15"
            iconColor="text-info"
          />
          <StatCard
            label="عملاء جدد (30 يوم)"
            value={newClients30d}
            icon={<UserPlus className="h-4 w-4" />}
            iconBg="bg-primary/15"
            iconColor="text-primary"
          />
        </div>
      </section>

      {/* ══════════ Section 2: MRR Chart + Top Plans side by side ══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card style={{minHeight: 420}}>
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">تطور الإيراد الشهري</CardTitle>
                <CardDescription className="text-xs">آخر 6 أشهر · بالدولار الأمريكي</CardDescription>
              </div>
              <Badge variant={mrrGrowth !== null && mrrGrowth >= 0 ? 'success' : 'destructive'} className="text-[10px]">
                {mrrGrowth !== null ? (mrrGrowth >= 0 ? '+' : '') + mrrGrowth + '%' : '—'}
                <span className="text-[9px] font-normal ms-1 opacity-70">MoM</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <LineChart
              labels={mrrHistory.labels}
              series={[{ name: 'MRR', color: '#2563EB', data: mrrHistory.values }]}
              height={140}
              formatValue={(v) => `$${v.toLocaleString()}`}
            />
          </CardContent>
        </Card>

        <Card style={{minHeight: 420}}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">أكثر الباقات اشتراكاً</CardTitle>
                <CardDescription className="text-xs">حسب عدد المشتركين النشطين</CardDescription>
              </div>
              <Button variant="link" size="sm" asChild>
                <Link to="/plans" className="flex items-center gap-1 text-xs">إدارة الباقات <ArrowUpRight className="h-3 w-3" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {topPlans.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">لا توجد اشتراكات نشطة</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-start w-8">#</TableHead>
                    <TableHead className="text-start">الباقة</TableHead>
                    <TableHead className="text-start">المشتركين</TableHead>
                    <TableHead className="text-start">الإيراد</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPlans.map(({ plan, subscribers, revenue }, i) => (
                    <TableRow key={plan.id}>
                      <TableCell className="py-2.5 text-xs text-muted-foreground font-mono">{i + 1}</TableCell>
                      <TableCell className="py-2.5 text-sm font-medium">{plan.nameAr}</TableCell>
                      <TableCell className="py-2.5 text-sm font-bold">{subscribers}</TableCell>
                      <TableCell className="py-2.5 text-sm font-bold text-success">${revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ══════════ Section 3: Alerts side by side ══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Expiring trials */}
        <Card style={{minHeight: 420}}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm">تجارب تنتهي قريباً</CardTitle>
                <Badge variant="default" className="text-[10px]">{expiringTrials.length}</Badge>
              </div>
              {expiringTrials.length > 0 && (
                <Button variant="link" size="sm" asChild>
                  <Link to="/clients?filter=trial" className="text-xs flex items-center gap-1">عرض الكل <ArrowUpRight className="h-3 w-3" /></Link>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {expiringTrials.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">لا توجد تجارب قاربت على الانتهاء</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-start">العميل</TableHead>
                    <TableHead className="text-start">المتبقي</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiringTrials.map(({ client, daysLeft }) => (
                    <TableRow key={client.id}>
                      <TableCell className="py-2.5">
                        <Link to={`/clients/${client.id}`} className="flex items-center gap-2 min-w-0 hover:underline">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className={`text-[10px] font-semibold ${avatarColor(client.companyName)}`}>{initials(client.companyName)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm truncate">{client.companyName}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Badge variant={daysLeft <= 2 ? 'destructive' : daysLeft <= 5 ? 'warning' : 'secondary'} className="text-[10px]">
                          {daysLeft === 0 ? 'اليوم' : daysLeft === 1 ? 'غداً' : `${daysLeft} أيام`}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Past due */}
        <Card style={{minHeight: 420}}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm">متأخرون عن الدفع</CardTitle>
                <Badge variant="warning" className="text-[10px]">{pastDueClients.length}</Badge>
              </div>
              {pastDueClients.length > 0 && (
                <Button variant="link" size="sm" asChild>
                  <Link to="/clients?filter=past_due" className="text-xs flex items-center gap-1">عرض الكل <ArrowUpRight className="h-3 w-3" /></Link>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {pastDueClients.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">لا يوجد متأخرين — كل الاشتراكات مسدّدة</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-start">العميل</TableHead>
                    <TableHead className="text-start">المبلغ المستحق</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastDueClients.map(({ client, amount, currency }) => (
                    <TableRow key={client.id}>
                      <TableCell className="py-2.5">
                        <Link to={`/clients/${client.id}`} className="flex items-center gap-2 min-w-0 hover:underline">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className={`text-[10px] font-semibold ${avatarColor(client.companyName)}`}>{initials(client.companyName)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium truncate">{client.companyName}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="py-2.5 text-sm font-bold text-danger">{formatMoney(amount, currency)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ══════════ Section 4: Recent clients + By country side by side ══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent clients */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">أحدث العملاء المسجّلين</CardTitle>
                <CardDescription className="text-xs">آخر 5 اشتراكات</CardDescription>
              </div>
              <Button variant="link" size="sm" asChild>
                <Link to="/clients" className="flex items-center gap-1 text-xs">عرض الكل <ArrowUpRight className="h-3 w-3" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">العميل</TableHead>
                  <TableHead className="text-start">الباقة</TableHead>
                  <TableHead className="text-start">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentClients.map((r) => {
                  const country = countries.find((co) => co.code === r.country);
                  const plan = plans.find((p) => p.id === r.planId);
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="py-2.5">
                        <Link to={`/clients/${r.id}`} className="flex items-center gap-2.5 min-w-0 hover:underline">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className={`text-[10px] font-semibold ${avatarColor(r.companyName)}`}>{initials(r.companyName)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{r.companyName} <span className="text-xs">{country?.flag}</span></p>
                            <p className="text-[10px] text-muted-foreground truncate">{r.industry}</p>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="py-2.5 text-sm">{plan?.nameAr ?? '—'}</TableCell>
                      <TableCell className="py-2.5"><StatusPill status={r.status} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* By country */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">العملاء حسب الدولة</CardTitle>
                <CardDescription className="text-xs">مرتّبة حسب الإيراد</CardDescription>
              </div>
              <Button variant="link" size="sm" asChild>
                <Link to="/reports" className="flex items-center gap-1 text-xs">التفاصيل <ArrowUpRight className="h-3 w-3" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {byCountry.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">لا توجد بيانات</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-start w-8">#</TableHead>
                    <TableHead className="text-start">الدولة</TableHead>
                    <TableHead className="text-start">العملاء</TableHead>
                    <TableHead className="text-start">الإيراد</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byCountry.map((c, i) => (
                    <TableRow key={c.code}>
                      <TableCell className="py-2.5 text-xs text-muted-foreground font-mono">{i + 1}</TableCell>
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{c.flag}</span>
                          <span className="text-sm font-medium">{c.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 text-sm">
                        <span className="font-bold">{c.active}</span>
                        <span className="text-xs text-muted-foreground"> / {c.total}</span>
                      </TableCell>
                      <TableCell className="py-2.5 text-sm font-bold text-success">${c.mrr.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

/* ══════════════════════ Helper Components ══════════════════════ */

function StatusPill({ status }: { status: Client['status'] }): JSX.Element {
  const map: Record<Client['status'], { label: string; variant: 'success' | 'default' | 'warning' | 'destructive' | 'secondary' | 'outline' }> = {
    active: { label: 'نشط', variant: 'success' },
    trial: { label: 'تجريبي', variant: 'default' },
    past_due: { label: 'متأخر', variant: 'warning' },
    suspended: { label: 'موقوف', variant: 'destructive' },
    cancelled: { label: 'ملغي', variant: 'outline' },
  };
  const m = map[status];
  return <Badge variant={m.variant} className="text-[10px] px-2 py-0.5">{m.label}</Badge>;
}
