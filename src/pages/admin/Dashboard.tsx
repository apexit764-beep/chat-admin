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
  MessageSquare,
  Radio,
  Send,
  Star,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
import { useAdminStore } from '@/store/useAdminStore';
import { formatMoney, approxUSD } from '@/utils/money';
import { timeAgo } from '@/utils/format';
import { cn } from '@/lib/utils';
import type { Client } from '@/types';

export default function AdminDashboard(): JSX.Element {
  const clients = useAdminStore((s) => s.clients);
  const subscriptions = useAdminStore((s) => s.subscriptions);
  const transactions = useAdminStore((s) => s.transactions);
  const plans = useAdminStore((s) => s.plans);
  const countries = useAdminStore((s) => s.countries);
  const platformStatsData = useAdminStore((s) => s.platformStats);
  const campaignStatsData = useAdminStore((s) => s.campaignStats);
  const satisfactionStatsData = useAdminStore((s) => s.satisfactionStats);

  const mrr = useMemo(() => subscriptions
    .filter((s) => s.status === 'active' && s.billingCycle === 'monthly')
    .reduce((acc, s) => acc + approxUSD(s.amount, s.currency), 0),
  [subscriptions]);

  const trialCount = clients.filter((c) => c.status === 'trial').length;
  const activeCount = clients.filter((c) => c.status === 'active').length;
  const pastDueCount = clients.filter((c) => c.status === 'past_due').length;
  const churnRate = clients.length ? Math.round((clients.filter((c) => c.status === 'cancelled').length / clients.length) * 100) : 0;

  // Last 6 months mock revenue
  const revenueLabels = ['ديسمبر', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو'];
  const revenueData = [1840, 2120, 2450, 2810, 3120, Math.round(mrr)];

  const recentClients = [...clients].sort((a, b) => Date.parse(b.joinedAt) - Date.parse(a.joinedAt)).slice(0, 8);
  const recentTransactions = [...transactions].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 8);

  const byCountry = countries
    .map((co) => ({ country: co, count: clients.filter((c) => c.country === co.code).length }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="p-4 lg:p-6 space-y-5 page-fade">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi
          label="MRR"
          value={`$${Math.round(mrr).toLocaleString()}`}
          delta={18}
          deltaLabel="من الشهر الماضي"
          icon={<DollarSign className="h-4 w-4" />}
          color="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <Kpi
          label="عملاء نشطون"
          value={activeCount}
          delta={12}
          deltaLabel={`من إجمالي ${clients.length}`}
          icon={<Users className="h-4 w-4" />}
          color="text-primary"
          iconBg="bg-primary/10"
        />
        <Kpi
          label="فترة تجريبية"
          value={trialCount}
          delta={null}
          deltaLabel="ينتهي خلال 14 يوم"
          icon={<Sparkles className="h-4 w-4" />}
          color="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <Kpi
          label="معدل الإلغاء"
          value={`${churnRate}%`}
          delta={pastDueCount > 0 ? -2 : 0}
          deltaLabel={`${pastDueCount} فاتورة متأخرة`}
          icon={<AlertTriangle className="h-4 w-4" />}
          color="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-500/10"
        />
      </div>

      {/* Revenue chart + Country breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        {/* Revenue Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">الإيرادات (USD)</CardTitle>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-3xl font-extrabold tracking-tight">${Math.round(mrr).toLocaleString()}</span>
                  <Badge variant="success" className="text-[10px] px-1.5 py-0">
                    <TrendingUp className="h-3 w-3 me-0.5" />
                    +18%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">آخر 6 أشهر · MRR شهري</p>
              </div>
              <Button variant="link" size="sm" asChild className="flex-shrink-0">
                <Link to="/finance" className="flex items-center gap-1">
                  التفاصيل <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <LineChart labels={revenueLabels} series={[{ name: 'إيراد', color: '#2563EB', data: revenueData }]} height={200} />
          </CardContent>
        </Card>

        {/* Country Breakdown Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">حسب الدولة</CardTitle>
              <span className="text-xs text-muted-foreground">{byCountry.length} دول</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {byCountry.slice(0, 6).map(({ country, count }) => {
              const max = byCountry[0].count;
              const pct = Math.round((count / max) * 100);
              return (
                <div key={country.code}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm flex items-center gap-1.5">
                      <span>{country.flag}</span>
                      {country.nameAr}
                    </span>
                    <span className="text-sm font-semibold">{count}</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Platform Usage KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi
          label="إجمالي المحادثات"
          value={platformStatsData.totalConversations.toLocaleString()}
          delta={14}
          deltaLabel={`${platformStatsData.activeConversations.toLocaleString()} محادثة نشطة`}
          icon={<MessageSquare className="h-4 w-4" />}
          color="text-violet-600 dark:text-violet-400"
          iconBg="bg-violet-500/10"
        />
        <Kpi
          label="القنوات المتصلة"
          value={platformStatsData.totalChannels}
          delta={null}
          deltaLabel={`${platformStatsData.onlineAgents} وكيل متصل`}
          icon={<Radio className="h-4 w-4" />}
          color="text-cyan-600 dark:text-cyan-400"
          iconBg="bg-cyan-500/10"
        />
        <Kpi
          label="الحملات النشطة"
          value={campaignStatsData.activeCampaigns}
          delta={8}
          deltaLabel={`${campaignStatsData.totalCampaigns} حملة إجمالية`}
          icon={<Send className="h-4 w-4" />}
          color="text-rose-600 dark:text-rose-400"
          iconBg="bg-rose-500/10"
        />
        <Kpi
          label="رضا العملاء"
          value={`${satisfactionStatsData.avgRating}/5`}
          delta={5}
          deltaLabel={`${satisfactionStatsData.totalRatings.toLocaleString()} تقييم`}
          icon={<Star className="h-4 w-4" />}
          color="text-yellow-600 dark:text-yellow-400"
          iconBg="bg-yellow-500/10"
        />
      </div>

      {/* Channel Distribution + Campaign Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Channel Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">توزيع القنوات</CardTitle>
          </CardHeader>
          <CardContent>
            <DoughnutChart
              data={[
                { label: 'واتساب', value: platformStatsData.channelDistribution.whatsapp, color: '#25D366' },
                { label: 'ماسنجر', value: platformStatsData.channelDistribution.messenger, color: '#0084FF' },
                { label: 'انستقرام', value: platformStatsData.channelDistribution.instagram, color: '#E1306C' },
                { label: 'تلغرام', value: platformStatsData.channelDistribution.telegram, color: '#0088CC' },
                { label: 'ويدجت', value: platformStatsData.channelDistribution.widget, color: '#6366F1' },
                { label: 'إيميل', value: platformStatsData.channelDistribution.email, color: '#F59E0B' },
              ]}
            />
          </CardContent>
        </Card>

        {/* Campaign Performance */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">أداء الحملات</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">آخر 6 أشهر · رسائل مرسلة ومفتوحة</p>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500 inline-block" /> مرسلة</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> مستلمة</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500 inline-block" /> مفتوحة</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <LineChart
              labels={campaignStatsData.monthlyCampaigns.map((m) => m.month)}
              series={[
                { name: 'مرسلة', color: '#3B82F6', data: campaignStatsData.monthlyCampaigns.map((m) => m.sent) },
                { name: 'مستلمة', color: '#10B981', data: campaignStatsData.monthlyCampaigns.map((m) => m.delivered) },
                { name: 'مفتوحة', color: '#F59E0B', data: campaignStatsData.monthlyCampaigns.map((m) => m.opened) },
              ]}
              height={200}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Clients + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Clients */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">آخر التسجيلات</CardTitle>
              <Button variant="link" size="sm" asChild>
                <Link to="/clients" className="flex items-center gap-1">
                  عرض الكل <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
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
                            <AvatarFallback className="text-[10px] font-semibold">
                              {r.companyName.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {r.companyName}{' '}
                              <span className="text-xs">{country?.flag}</span>
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate">{r.industry}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 text-sm">{plan?.nameAr ?? '—'}</TableCell>
                      <TableCell className="py-2.5 text-sm font-semibold">
                        {r.mrr > 0 ? formatMoney(r.mrr, r.currency) : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="py-2.5">
                        <StatusPill status={r.status} />
                      </TableCell>
                      <TableCell className="py-2.5 hidden md:table-cell text-sm text-muted-foreground">
                        {timeAgo(r.joinedAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">آخر المعاملات</CardTitle>
              <Button variant="link" size="sm" asChild>
                <Link to="/finance" className="flex items-center gap-1">
                  التفاصيل <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">العميل</TableHead>
                  <TableHead className="text-start">المبلغ</TableHead>
                  <TableHead className="text-start hidden md:table-cell">البطاقة</TableHead>
                  <TableHead className="text-start">الحالة</TableHead>
                  <TableHead className="text-start">منذ</TableHead>
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
                            <AvatarFallback className="text-[10px] font-semibold">
                              {(client?.companyName ?? '?').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium truncate">{client?.companyName ?? '—'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 text-sm font-semibold">{formatMoney(t.amount, t.currency)}</TableCell>
                      <TableCell className="py-2.5 hidden md:table-cell font-mono text-sm">•••• {t.last4}</TableCell>
                      <TableCell className="py-2.5">
                        <Badge
                          variant={
                            t.status === 'succeeded' ? 'success'
                            : t.status === 'failed' ? 'destructive'
                            : 'secondary'
                          }
                          className="text-[10px] px-2 py-0.5"
                        >
                          {t.status === 'succeeded' ? 'نجحت' : t.status === 'failed' ? 'فشلت' : 'مرتجعة'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2.5 text-sm text-muted-foreground">{timeAgo(t.createdAt)}</TableCell>
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

/* ---------- Helper Components ---------- */

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
