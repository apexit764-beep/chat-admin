import { useMemo, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Globe2,
  Download,
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { StatCard } from '@components/ui';
import { LineChart } from '@components/charts/LineChart';
import { DoughnutChart } from '@components/charts/DoughnutChart';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { approxUSD } from '@/utils/money';
import { timeAgo } from '@/utils/format';
import { downloadCsv } from '@/utils/csv';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

type Range = 'week' | 'month' | 'quarter' | 'year';

export default function AdminReports(): JSX.Element {
  const clients = useAdminStore((s) => s.clients);
  const plans = useAdminStore((s) => s.plans);
  const countries = useAdminStore((s) => s.countries);
  const subscriptions = useAdminStore((s) => s.subscriptions);
  const showToast = useUIStore((s) => s.showToast);
  const [range, setRange] = useState<Range>('month');

  const ranges: { key: Range; label: string }[] = [
    { key: 'week', label: 'أسبوع' },
    { key: 'month', label: 'شهر' },
    { key: 'quarter', label: 'ربع' },
    { key: 'year', label: 'سنة' },
  ];

  // Signups by month
  const signupsLabels = ['ديسمبر', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو'];
  const signupsData = [3, 5, 7, 6, 9, 8];
  const churnData = [1, 0, 1, 2, 1, 0];

  // Plan distribution
  const planDist = plans.map((p) => ({
    label: p.nameAr,
    value: clients.filter((c) => c.planId === p.id).length,
    color: p.tier === 'starter' ? '#06B6D4' : p.tier === 'pro' ? '#2563EB' : p.tier === 'business' ? '#8B5CF6' : '#F59E0B',
  })).filter((p) => p.value > 0);

  // Status distribution
  const statusDist = [
    { label: 'نشط', value: clients.filter((c) => c.status === 'active').length, color: '#10B981' },
    { label: 'تجريبي', value: clients.filter((c) => c.status === 'trial').length, color: '#3B82F6' },
    { label: 'متأخر', value: clients.filter((c) => c.status === 'past_due').length, color: '#F59E0B' },
    { label: 'موقوف', value: clients.filter((c) => c.status === 'suspended').length, color: '#EF4444' },
    { label: 'ملغي', value: clients.filter((c) => c.status === 'cancelled').length, color: '#6B7280' },
  ].filter((s) => s.value > 0);

  // By country
  const byCountry = countries
    .map((co) => ({
      country: co,
      count: clients.filter((c) => c.country === co.code).length,
      revenue: clients.filter((c) => c.country === co.code).reduce((acc, c) => acc + approxUSD(c.mrr, c.currency), 0),
    }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count);

  // Conversion (trial -> paid)
  const trialCount = clients.filter((c) => c.status === 'trial' || c.status === 'active').length;
  const paidCount = clients.filter((c) => c.status === 'active').length;
  const conversionRate = trialCount ? Math.round((paidCount / trialCount) * 100) : 0;

  // Churn
  const totalCustomers = clients.length;
  const churnCount = clients.filter((c) => c.status === 'cancelled').length;
  const churnRate = totalCustomers ? Math.round((churnCount / totalCustomers) * 100) : 0;

  // ARPU
  const mrrTotal = useMemo(() =>
    subscriptions.filter((s) => s.status === 'active').reduce((acc, s) => acc + approxUSD(s.amount, s.currency), 0),
    [subscriptions]
  );
  const activeCustomers = clients.filter((c) => c.status === 'active').length;
  const arpu = activeCustomers ? mrrTotal / activeCustomers : 0;

  // LTV (rough: ARPU / churn rate, assuming 5% monthly churn baseline)
  const ltv = arpu * 20;

  const clientHealthScores = useMemo(() => {
    return clients
      .filter((c) => c.status !== 'cancelled')
      .map((c) => {
        const plan = plans.find((p) => p.id === c.planId);
        const limit = plan?.limits.conversations ?? 1000;
        const usagePercent = limit > 0 ? Math.min(100, Math.round((c.conversationCount / limit) * 100)) : 0;
        const daysSinceActive = Math.round((Date.now() - new Date(c.lastActiveAt).getTime()) / 86400000);
        let score = 100;
        if (c.status === 'suspended') score -= 50;
        else if (c.status === 'past_due') score -= 30;
        else if (c.status === 'trial') score -= 10;
        if (daysSinceActive > 7) score -= Math.min(30, daysSinceActive * 2);
        if (usagePercent < 10) score -= 15;
        else if (usagePercent > 80) score += 5;
        score = Math.max(0, Math.min(100, score));
        return { client: c, usagePercent, score };
      })
      .sort((a, b) => a.score - b.score);
  }, [clients, plans]);

  const exportSummary = (): void => {
    downloadCsv(`reports-${new Date().toISOString().slice(0, 10)}.csv`, [
      { Metric: 'Total Clients', Value: clients.length },
      { Metric: 'Active', Value: clients.filter((c) => c.status === 'active').length },
      { Metric: 'Trial', Value: clients.filter((c) => c.status === 'trial').length },
      { Metric: 'Past Due', Value: clients.filter((c) => c.status === 'past_due').length },
      { Metric: 'MRR (USD)', Value: Math.round(mrrTotal) },
      { Metric: 'ARPU (USD)', Value: Math.round(arpu) },
      { Metric: 'LTV (USD)', Value: Math.round(ltv) },
      { Metric: 'Conversion %', Value: conversionRate },
      { Metric: 'Churn %', Value: churnRate },
    ]);
    showToast('تم تصدير الملخص', 'success');
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Range + export */}
      <Card>
        <CardContent className="p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-muted rounded-full p-1">
            {ranges.map((r) => (
              <Button
                key={r.key}
                variant={range === r.key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setRange(r.key)}
              >
                {r.label}
              </Button>
            ))}
          </div>
          <Button variant="outline" onClick={exportSummary}>
            <Download className="h-4 w-4" /> تصدير الملخص
          </Button>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="MRR" value={`$${Math.round(mrrTotal).toLocaleString()}`} icon={<TrendingUp className="h-5 w-5" />} iconBg="bg-success/15" iconColor="text-success" trend={{ value: 18, positive: true }} />
        <StatCard label="ARPU" value={`$${Math.round(arpu)}`} icon={<Users className="h-5 w-5" />} iconBg="bg-primary/15" iconColor="text-primary" trend={{ value: 5, positive: true }} />
        <StatCard label="LTV (تقدير)" value={`$${Math.round(ltv)}`} icon={<TrendingUp className="h-5 w-5" />} iconBg="bg-info/15" iconColor="text-info" />
        <StatCard label="معدل الإلغاء" value={`${churnRate}%`} icon={<TrendingDown className="h-5 w-5" />} iconBg="bg-danger/15" iconColor="text-danger" trend={{ value: 2, positive: false }} />
      </div>

      {/* Signups vs Churn chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>التسجيلات مقابل الإلغاءات</CardTitle>
              <CardDescription>آخر 6 أشهر</CardDescription>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-success" /> تسجيلات</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-danger" /> إلغاءات</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <LineChart
            labels={signupsLabels}
            series={[
              { name: 'تسجيلات', color: '#10B981', data: signupsData },
              { name: 'إلغاءات', color: '#EF4444', data: churnData },
            ]}
            height={260}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>توزيع الباقات</CardTitle>
            <CardDescription>حسب عدد العملاء النشطين</CardDescription>
          </CardHeader>
          <CardContent>
            <DoughnutChart size={200} data={planDist} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>حالة العملاء</CardTitle>
            <CardDescription>توزيع الحالات الحالية</CardDescription>
          </CardHeader>
          <CardContent>
            <DoughnutChart size={200} data={statusDist} />
          </CardContent>
        </Card>
      </div>

      {/* By country */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-primary" />
            الأداء حسب الدولة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="text-start">الدولة</TableHead>
                <TableHead className="text-start">عدد العملاء</TableHead>
                <TableHead className="text-start">الإيراد الشهري</TableHead>
                <TableHead className="text-start">متوسط الإيراد للعميل</TableHead>
                <TableHead className="text-start">حصة السوق</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {byCountry.map((x) => {
                const share = clients.length ? (x.count / clients.length) * 100 : 0;
                return (
                  <TableRow key={x.country.code}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{x.country.flag}</span>
                        <span className="font-semibold">{x.country.nameAr}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{x.count}</TableCell>
                    <TableCell className="font-semibold text-success">${Math.round(x.revenue).toLocaleString()}</TableCell>
                    <TableCell>${x.count ? Math.round(x.revenue / x.count) : 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={share} className="flex-1 h-1.5" />
                        <span className="text-sm font-medium text-muted-foreground">{Math.round(share)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>مسار التحويل</CardTitle>
          <CardDescription>من التسجيل إلى الدفع</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <FunnelStep label="زوار" value={4280} color="bg-info" share={100} />
          <FunnelStep label="تجارب جديدة" value={183} color="bg-primary" share={4.3} />
          <FunnelStep label="نشطوا الحساب" value={142} color="bg-violet-500" share={3.3} />
          <FunnelStep label="اشتراك مدفوع" value={paidCount} color="bg-success" share={(paidCount / 4280) * 100} />
        </CardContent>
      </Card>

      {/* Client Health Scores */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-primary" />
                صحة العملاء
              </CardTitle>
              <CardDescription>تقييم شامل لنشاط وصحة حسابات العملاء</CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> ممتاز</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> متوسط</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> خطر</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="text-start">العميل</TableHead>
                <TableHead className="text-start">الحالة</TableHead>
                <TableHead className="text-start">النشاط</TableHead>
                <TableHead className="text-start">الاستخدام</TableHead>
                <TableHead className="text-start">درجة الصحة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientHealthScores.map((h) => (
                <TableRow key={h.client.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-sm">{h.client.companyName}</p>
                      <p className="text-xs text-muted-foreground">{h.client.contactName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                      h.client.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' :
                      h.client.status === 'trial' ? 'bg-blue-500/10 text-blue-600' :
                      h.client.status === 'past_due' ? 'bg-amber-500/10 text-amber-600' :
                      h.client.status === 'suspended' ? 'bg-red-500/10 text-red-600' :
                      'bg-slate-500/10 text-slate-600'
                    )}>
                      {h.client.status === 'active' ? 'نشط' : h.client.status === 'trial' ? 'تجريبي' : h.client.status === 'past_due' ? 'متأخر' : h.client.status === 'suspended' ? 'موقوف' : 'ملغي'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{timeAgo(h.client.lastActiveAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={h.usagePercent} className="flex-1 h-1.5 max-w-24" />
                      <span className="text-xs text-muted-foreground font-medium">{h.usagePercent}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {h.score >= 70 ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : h.score >= 40 ? (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <span className={cn(
                        'text-sm font-bold',
                        h.score >= 70 ? 'text-emerald-600' : h.score >= 40 ? 'text-amber-600' : 'text-red-600'
                      )}>
                        {h.score}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function FunnelStep({ label, value, color, share }: { label: string; value: number; color: string; share: number }): JSX.Element {
  return (
    <div className="flex items-center gap-3">
      <p className="w-32 text-sm font-medium">{label}</p>
      <div className="flex-1 h-9 rounded-lg bg-muted overflow-hidden relative">
        <div className={cn('h-full transition-all', color)} style={{ width: `${share}%` }} />
        <div className="absolute inset-0 flex items-center px-3">
          <span className="text-sm font-bold text-white drop-shadow-sm" style={{ paddingInlineStart: `${Math.max(0, share - 20)}%` }}>
            {value.toLocaleString()}
          </span>
        </div>
      </div>
      <p className="w-16 text-sm text-muted-foreground text-end">{share.toFixed(1)}%</p>
    </div>
  );
}
