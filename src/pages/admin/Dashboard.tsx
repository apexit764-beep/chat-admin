import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Star,
  UserPlus,
  FileWarning,
  MessagesSquare,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { LineChart } from '@components/charts/LineChart';
import { DoughnutChart } from '@components/charts/DoughnutChart';
import { BarChart } from '@components/charts/BarChart';
import { useAdminStore } from '@/store/useAdminStore';
import { formatMoney, approxUSD } from '@/utils/money';
import { timeAgo, initials, avatarColor } from '@/utils/format';
import { cn } from '@/lib/utils';
import type { Client } from '@/types';

const MONTH_NAMES_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

export default function AdminDashboard(): JSX.Element {
  const clients = useAdminStore((s) => s.clients);
  const subscriptions = useAdminStore((s) => s.subscriptions);
  const transactions = useAdminStore((s) => s.transactions);
  const plans = useAdminStore((s) => s.plans);
  const countries = useAdminStore((s) => s.countries);
  const invoices = useAdminStore((s) => s.invoices);
  const liveChatConversations = useAdminStore((s) => s.liveChatConversations);
  const platformStatsData = useAdminStore((s) => s.platformStats);
  const campaignStatsData = useAdminStore((s) => s.campaignStats);
  const satisfactionStatsData = useAdminStore((s) => s.satisfactionStats);

  /* ─────── Real metrics ─────── */
  const trialCount = clients.filter((c) => c.status === 'trial').length;
  const activeCount = clients.filter((c) => c.status === 'active').length;
  const pastDueCount = clients.filter((c) => c.status === 'past_due').length;
  const cancelledCount = clients.filter((c) => c.status === 'cancelled').length;
  const churnRate = clients.length ? Math.round((cancelledCount / clients.length) * 100) : 0;

  /* ─────── Real MRR history from subscriptions ─────── */
  const mrrHistory = useMemo(() => {
    const now = new Date();
    const labels: string[] = [];
    const values: number[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const total = subscriptions
        .filter((s) => s.billingCycle === 'monthly')
        .filter((s) => {
          const start = new Date(s.startedAt);
          if (start > monthEnd) return false;
          if (s.status === 'cancelled' && s.cancelAt && new Date(s.cancelAt) < monthStart) return false;
          return s.status === 'active' || s.status === 'past_due' || s.status === 'cancelled';
        })
        .reduce((acc, s) => acc + approxUSD(s.amount, s.currency), 0);
      labels.push(MONTH_NAMES_AR[monthStart.getMonth()]);
      values.push(Math.round(total));
    }
    return { labels, values };
  }, [subscriptions]);

  const currentMrr = mrrHistory.values[mrrHistory.values.length - 1] ?? 0;
  const prevMrr = mrrHistory.values[mrrHistory.values.length - 2] ?? 0;
  const mrrGrowth = prevMrr > 0
    ? Math.round(((currentMrr - prevMrr) / prevMrr) * 100)
    : null;

  /* ─────── Active client growth (this month vs last month) ─────── */
  const activeGrowth = useMemo(() => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = clients.filter((c) => c.status === 'active' && new Date(c.joinedAt) >= thisMonth).length;
    const prevActive = Math.max(0, activeCount - newThisMonth);
    return prevActive > 0 ? Math.round((newThisMonth / prevActive) * 100) : null;
  }, [clients, activeCount]);

  const newClientsThisMonth = useMemo(() => {
    const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    return clients.filter((c) => new Date(c.joinedAt) >= thisMonth).length;
  }, [clients]);

  const overdueInvoices = useMemo(() => {
    return invoices.filter((inv) => inv.status === 'pending' && new Date(inv.dueDate) < new Date()).length;
  }, [invoices]);

  const openConversations = useMemo(() => {
    return liveChatConversations.filter((c) => c.status === 'open' || c.status === 'assigned').length;
  }, [liveChatConversations]);

  /* ─────── Expiring trials ─────── */
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

  /* ─────── Past due clients with amount ─────── */
  const pastDueClients = useMemo(() => {
    return clients
      .filter((c) => c.status === 'past_due')
      .map((c) => {
        const sub = subscriptions.find((s) => s.id === c.subscriptionId);
        return { client: c, amount: sub?.amount ?? c.mrr, currency: sub?.currency ?? c.currency };
      })
      .slice(0, 5);
  }, [clients, subscriptions]);

  /* ─────── Top plans by subscriber count ─────── */
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
      .slice(0, 4);
  }, [plans, clients, subscriptions]);

  /* ─────── Country breakdown (real % + MRR per country) ─────── */
  const byCountry = useMemo(() => {
    return countries
      .map((co) => {
        const co_clients = clients.filter((c) => c.country === co.code);
        const mrr = subscriptions
          .filter((s) => s.status === 'active' && s.billingCycle === 'monthly')
          .filter((s) => co_clients.some((c) => c.id === s.clientId))
          .reduce((acc, s) => acc + approxUSD(s.amount, s.currency), 0);
        return {
          code: co.code,
          name: co.nameAr,
          flag: co.flag,
          count: co_clients.length,
          mrr: Math.round(mrr),
        };
      })
      .filter((x) => x.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [countries, clients, subscriptions]);

  const recentClients = useMemo(
    () => [...clients].sort((a, b) => Date.parse(b.joinedAt) - Date.parse(a.joinedAt)).slice(0, 6),
    [clients]
  );
  const recentTransactions = useMemo(
    () => [...transactions].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 6),
    [transactions]
  );

  const channelData = [
    { label: 'واتساب', value: platformStatsData.channelDistribution.whatsapp, color: '#25D366' },
    { label: 'ماسنجر', value: platformStatsData.channelDistribution.messenger, color: '#0084FF' },
    { label: 'انستقرام', value: platformStatsData.channelDistribution.instagram, color: '#E1306C' },
    { label: 'تلغرام', value: platformStatsData.channelDistribution.telegram, color: '#0088CC' },
    { label: 'ويدجت', value: platformStatsData.channelDistribution.widget, color: '#6366F1' },
    { label: 'إيميل', value: platformStatsData.channelDistribution.email, color: '#F59E0B' },
  ];
  const channelTotal = channelData.reduce((a, c) => a + c.value, 0);

  return (
    <div className="p-4 lg:p-6 space-y-4 page-fade">
      <div>
        <h2 className="text-2xl font-bold">نظرة عامة</h2>
        <p className="text-sm text-muted-foreground">نظرة عامة على أداء النظام</p>
      </div>

      {/* ═══════ Bento Row 1: MRR Hero + 4 KPIs ═══════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="col-span-2 row-span-2">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-1">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">الإيراد الشهري (MRR)</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight">${currentMrr.toLocaleString()}</span>
                  {mrrGrowth !== null && (
                    <Badge variant={mrrGrowth >= 0 ? 'success' : 'destructive'} className="text-[10px] px-1.5 py-0">
                      {mrrGrowth >= 0 ? <TrendingUp className="h-3 w-3 me-0.5" /> : <TrendingDown className="h-3 w-3 me-0.5" />}
                      {mrrGrowth >= 0 ? '+' : ''}{mrrGrowth}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mb-2">آخر 6 أشهر · بالدولار الأمريكي</p>
            <LineChart
              labels={mrrHistory.labels}
              series={[{ name: 'MRR', color: '#2563EB', data: mrrHistory.values }]}
              height={200}
              formatValue={(v) => `$${v.toLocaleString()}`}
            />
          </CardContent>
        </Card>

        <Kpi label="عملاء نشطون" value={activeCount} delta={activeGrowth}
          deltaLabel={`من إجمالي ${clients.length} عميل`}
          icon={<Users className="h-4 w-4" />} color="text-primary" iconBg="bg-primary/10" />
        <Kpi label="حسابات تجريبية" value={trialCount} delta={null}
          deltaLabel={expiringTrials.length > 0 ? `${expiringTrials.length} ينتهي خلال 7 أيام` : 'لا تنتهي قريباً'}
          icon={<Sparkles className="h-4 w-4" />} color="text-blue-600 dark:text-blue-400" iconBg="bg-blue-500/10" />
        <Kpi label="معدل الإلغاء" value={`${churnRate}%`} delta={null}
          deltaLabel={`${cancelledCount} ملغي · ${pastDueCount} متأخر`}
          icon={<AlertTriangle className="h-4 w-4" />} color="text-amber-600 dark:text-amber-400" iconBg="bg-amber-500/10" />
        <Kpi label="عملاء جدد هذا الشهر" value={newClientsThisMonth} delta={null}
          deltaLabel={`من إجمالي ${clients.length}`}
          icon={<UserPlus className="h-4 w-4" />} color="text-teal-600 dark:text-teal-400" iconBg="bg-teal-500/10" />
      </div>

      {/* ═══════ Bento Row 2: Highlights + Donut + Quick Stats ═══════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Platform highlights - spans 2 */}
        <Card className="md:col-span-2">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold">أداء المنصة</p>
              <span className="text-xs text-muted-foreground">{platformStatsData.totalChannels} قناة</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-extrabold">{platformStatsData.totalConversations.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">محادثة</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{platformStatsData.activeConversations.toLocaleString()} نشطة الآن · {platformStatsData.onlineAgents} وكيل متصل</p>
            {/* Stacked bar */}
            <div className="flex h-2.5 rounded-full overflow-hidden mb-3">
              {channelData.map((ch) => (
                <div key={ch.label} style={{ width: `${(ch.value / channelTotal) * 100}%`, backgroundColor: ch.color }} />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {channelData.map((ch) => (
                <div key={ch.label} className="flex items-center gap-1.5 text-xs">
                  <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: ch.color }} />
                  <span className="text-muted-foreground">{ch.label}</span>
                  <span className="font-semibold">{ch.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Channel donut */}
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-semibold mb-2">توزيع القنوات</p>
            <DoughnutChart data={channelData} />
          </CardContent>
        </Card>

        {/* Quick stats stacked */}
        <Card>
          <CardContent className="p-4 flex flex-col justify-between h-full gap-3">
            <QuickStatItem icon={<Star className="h-4 w-4" />} iconBg="bg-yellow-500/10" color="text-yellow-600 dark:text-yellow-400"
              label="رضا العملاء" value={`${satisfactionStatsData.avgRating}/5`} sub={`${satisfactionStatsData.totalRatings.toLocaleString()} تقييم`} />
            <div className="border-t" />
            <QuickStatItem icon={<FileWarning className="h-4 w-4" />} iconBg="bg-orange-500/10" color="text-orange-600 dark:text-orange-400"
              label="فواتير متأخرة" value={overdueInvoices} sub={overdueInvoices > 0 ? 'تحتاج متابعة' : 'لا متأخرات'} />
            <div className="border-t" />
            <QuickStatItem icon={<MessagesSquare className="h-4 w-4" />} iconBg="bg-indigo-500/10" color="text-indigo-600 dark:text-indigo-400"
              label="محادثات مفتوحة" value={openConversations} sub="دعم مباشر" />
          </CardContent>
        </Card>
      </div>

      {/* ═══════ Bento Row 3: Countries + Campaigns ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">العملاء حسب الدولة</CardTitle>
              <span className="text-xs text-muted-foreground">{byCountry.length} دول</span>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            {byCountry.length === 0 ? (
              <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">لا توجد بيانات</div>
            ) : (
              <BarChart labels={byCountry.map((c) => c.name)} data={byCountry.map((c) => c.count)} color="#2563EB" height={220} />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">أداء الحملات</CardTitle>
            <p className="text-xs text-muted-foreground">آخر 6 أشهر</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-3">
              <div>
                <p className="text-2xl font-extrabold">{campaignStatsData.activeCampaigns}</p>
                <p className="text-[10px] text-muted-foreground">حملة نشطة</p>
              </div>
              <div className="border-e h-8" />
              <div>
                <p className="text-2xl font-extrabold">{campaignStatsData.avgOpenRate}%</p>
                <p className="text-[10px] text-muted-foreground">معدل الفتح</p>
              </div>
              <div className="border-e h-8" />
              <div>
                <p className="text-2xl font-extrabold">{campaignStatsData.totalMessagesSent.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">رسالة مرسلة</p>
              </div>
            </div>
            <LineChart
              labels={campaignStatsData.monthlyCampaigns.map((m) => m.month)}
              series={[
                { name: 'مرسلة', color: '#3B82F6', data: campaignStatsData.monthlyCampaigns.map((m) => m.sent) },
                { name: 'مستلمة', color: '#10B981', data: campaignStatsData.monthlyCampaigns.map((m) => m.delivered) },
                { name: 'مفتوحة', color: '#F59E0B', data: campaignStatsData.monthlyCampaigns.map((m) => m.opened) },
              ]}
              height={160}
            />
          </CardContent>
        </Card>
      </div>

      {/* ═══════ Bento Row 4: Attention cards ═══════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Past due */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">متأخرون عن الدفع</CardTitle>
              <Badge variant="warning" className="text-[10px]">{pastDueClients.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {pastDueClients.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">لا يوجد متأخرين</p>
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
                      <TableCell className="py-2.5 text-sm font-bold text-amber-600 dark:text-amber-400">{formatMoney(amount, currency)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {pastDueClients.length > 0 && (
              <div className="p-2 text-center border-t">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/clients?filter=past_due" className="text-xs">عرض الكل</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expiring trials */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">تجارب تنتهي قريباً</CardTitle>
              <Badge variant="default" className="text-[10px]">{expiringTrials.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {expiringTrials.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">لا توجد تجارب قاربت على الانتهاء</p>
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
            {expiringTrials.length > 0 && (
              <div className="p-2 text-center border-t">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/clients?filter=trial" className="text-xs">عرض الكل</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top plans */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">أكثر الباقات اشتراكاً</CardTitle>
              <Button variant="link" size="sm" asChild>
                <Link to="/plans" className="flex items-center gap-1">إدارة الباقات <ArrowUpRight className="h-3.5 w-3.5" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {topPlans.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">لا توجد اشتراكات نشطة</p>
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
                      <TableCell className="py-2.5 text-sm text-muted-foreground">${revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ═══════ Bento Row 5: Tables ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">أحدث العملاء المسجلين</CardTitle>
              <Button variant="link" size="sm" asChild>
                <Link to="/clients" className="flex items-center gap-1">عرض الكل <ArrowUpRight className="h-3.5 w-3.5" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">العميل</TableHead>
                  <TableHead className="text-start">الباقة</TableHead>
                  <TableHead className="text-start">MRR</TableHead>
                  <TableHead className="text-start">الحالة</TableHead>
                  <TableHead className="text-start hidden md:table-cell">انضم</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentClients.map((r) => {
                  const country = countries.find((co) => co.code === r.country);
                  const plan = plans.find((p) => p.id === r.planId);
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className={`text-[10px] font-semibold ${avatarColor(r.companyName)}`}>{initials(r.companyName)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{r.companyName} <span className="text-xs">{country?.flag}</span></p>
                            <p className="text-[10px] text-muted-foreground truncate">{r.industry}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 text-sm">{plan?.nameAr ?? '—'}</TableCell>
                      <TableCell className="py-2.5 text-sm font-semibold">
                        {r.mrr > 0 ? formatMoney(r.mrr, r.currency) : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="py-2.5"><StatusPill status={r.status} /></TableCell>
                      <TableCell className="py-2.5 hidden md:table-cell text-sm text-muted-foreground">{timeAgo(r.joinedAt)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">أحدث المعاملات</CardTitle>
              <Button variant="link" size="sm" asChild>
                <Link to="/finance" className="flex items-center gap-1">التفاصيل <ArrowUpRight className="h-3.5 w-3.5" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">العميل</TableHead>
                  <TableHead className="text-start">المبلغ</TableHead>
                  <TableHead className="text-start">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((t) => {
                  const client = clients.find((c) => c.id === t.clientId);
                  return (
                    <TableRow key={t.id}>
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className={`text-[10px] font-semibold ${avatarColor(client?.companyName ?? '?')}`}>{initials(client?.companyName ?? '?')}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium truncate">{client?.companyName ?? '—'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 text-sm font-semibold">{formatMoney(t.amount, t.currency)}</TableCell>
                      <TableCell className="py-2.5">
                        <Badge variant={t.status === 'succeeded' ? 'success' : t.status === 'failed' ? 'destructive' : 'secondary'} className="text-[10px] px-2 py-0.5">
                          {t.status === 'succeeded' ? 'نجحت' : t.status === 'failed' ? 'فشلت' : 'مرتجعة'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ============== Helper Components ============== */

function Kpi({ label, value, delta, deltaLabel, icon, color, iconBg }: {
  label: string;
  value: string | number;
  delta: number | null;
  deltaLabel: string;
  icon: React.ReactNode;
  color: string;
  iconBg: string;
}): JSX.Element {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={cn('h-8 w-8 rounded-md flex items-center justify-center', iconBg, color)}>
            {icon}
          </div>
          {delta !== null && (
            <Badge
              variant={delta > 0 ? 'success' : delta < 0 ? 'destructive' : 'outline'}
              className="text-[10px] px-1.5 py-0 gap-0.5"
            >
              {delta > 0 ? <TrendingUp className="h-3 w-3" /> : delta < 0 ? <TrendingDown className="h-3 w-3" /> : null}
              {delta > 0 ? '+' : ''}{delta}%
            </Badge>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-2xl font-extrabold tracking-tight mt-0.5">{value}</p>
        <p className="text-[11px] text-muted-foreground mt-1">{deltaLabel}</p>
      </CardContent>
    </Card>
  );
}

function QuickStatItem({ label, value, sub, icon, color, iconBg }: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  color: string;
  iconBg: string;
}): JSX.Element {
  return (
    <div className="flex items-center gap-3">
      <div className={cn('h-8 w-8 rounded-md flex items-center justify-center flex-shrink-0', iconBg, color)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-base font-bold leading-tight">{value}</p>
        <p className="text-[10px] text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

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
