import { useMemo, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Globe2,
  Download,
  FileText,
  ArrowLeftRight,
  Target,
  PieChart,
  Activity,
} from 'lucide-react';
import { startOfMonth, endOfMonth } from 'date-fns';
import { StatCard } from '@components/ui';
import { LineChart } from '@components/charts/LineChart';
import { DoughnutChart } from '@components/charts/DoughnutChart';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { approxUSD } from '@/utils/money';
import { downloadCsv, printAsPdf } from '@/utils/csv';
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
import { DateRangePicker } from '@/components/ui/date-range-picker';

export default function AdminReports(): JSX.Element {
  const allClients = useAdminStore((s) => s.clients);
  const plans = useAdminStore((s) => s.plans);
  const countries = useAdminStore((s) => s.countries);
  const allSubscriptions = useAdminStore((s) => s.subscriptions);
  const showToast = useUIStore((s) => s.showToast);

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  // Date-filtered data for KPIs and charts
  const clients = useMemo(() => {
    if (!dateRange) return allClients;
    const from = dateRange.from.getTime();
    const to = dateRange.to.getTime() + 86400000 - 1;
    return allClients.filter((c) => {
      const t = Date.parse(c.joinedAt);
      return t >= from && t <= to;
    });
  }, [allClients, dateRange]);

  const subscriptions = useMemo(() => {
    if (!dateRange) return allSubscriptions;
    const from = dateRange.from.getTime();
    const to = dateRange.to.getTime() + 86400000 - 1;
    return allSubscriptions.filter((s) => {
      const t = Date.parse(s.startedAt);
      return t >= from && t <= to;
    });
  }, [allSubscriptions, dateRange]);

  const activeClients = useMemo(() => clients.filter((c) => c.status === 'active'), [clients]);
  const trialClients = useMemo(() => clients.filter((c) => c.status === 'trial'), [clients]);

  const mrrTotal = useMemo(() =>
    subscriptions.filter((s) => s.status === 'active').reduce((acc, s) => acc + approxUSD(s.amount, s.currency), 0),
    [subscriptions]
  );

  const arpu = activeClients.length ? Math.round(mrrTotal / activeClients.length) : 0;

  const churnCount = clients.filter((c) => c.status === 'cancelled').length;
  const churnRate = clients.length ? Math.round((churnCount / clients.length) * 100) : 0;

  // Plan distribution
  const planDist = useMemo(() =>
    plans.filter((p) => !p.isTrial).map((p) => ({
      label: p.nameAr,
      value: clients.filter((c) => c.planId === p.id).length,
      color: p.tier === 'starter' ? '#06B6D4' : p.tier === 'pro' ? '#2563EB' : p.tier === 'business' ? '#8B5CF6' : '#F59E0B',
    })).filter((p) => p.value > 0),
    [plans, clients]
  );

  // Status distribution
  const statusDist = useMemo(() => [
    { label: 'نشط', value: activeClients.length, color: '#10B981' },
    { label: 'تجريبي', value: trialClients.length, color: '#3B82F6' },
    { label: 'متأخر', value: clients.filter((c) => c.status === 'past_due').length, color: '#F59E0B' },
    { label: 'موقوف', value: clients.filter((c) => c.status === 'suspended').length, color: '#EF4444' },
    { label: 'ملغي', value: churnCount, color: '#6B7280' },
  ].filter((s) => s.value > 0), [clients, activeClients, trialClients, churnCount]);

  // Signups chart - derive from client joinedAt dates grouped by month
  const chartData = useMemo(() => {
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const now = new Date();
    const labels: string[] = [];
    const signups: number[] = [];
    const cancellations: number[] = [];

    for (let i = 5; i >= 0; i--) {
      const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = m.getMonth();
      const year = m.getFullYear();
      labels.push(months[month]);
      signups.push(clients.filter((c) => {
        const d = new Date(c.joinedAt);
        return d.getMonth() === month && d.getFullYear() === year;
      }).length);
      cancellations.push(clients.filter((c) => {
        if (c.status !== 'cancelled') return false;
        const d = new Date(c.lastActiveAt);
        return d.getMonth() === month && d.getFullYear() === year;
      }).length);
    }
    return { labels, signups, cancellations };
  }, [clients]);

  // By country (uses allClients — not affected by date range)
  const byCountry = useMemo(() =>
    countries
      .map((co) => {
        const coClients = allClients.filter((c) => c.country === co.code);
        return {
          country: co,
          count: coClients.length,
          revenue: coClients.reduce((acc, c) => acc + approxUSD(c.mrr, c.currency), 0),
          avgRevenue: coClients.length
            ? Math.round(coClients.reduce((acc, c) => acc + approxUSD(c.mrr, c.currency), 0) / coClients.length)
            : 0,
        };
      })
      .filter((x) => x.count > 0)
      .sort((a, b) => b.count - a.count),
    [allClients, countries]
  );

  // Funnel
  const paidCount = activeClients.length;
  const totalSignups = clients.length;

  const exportSummary = (): void => {
    downloadCsv(`reports-${new Date().toISOString().slice(0, 10)}.csv`, [
      { المقياس: 'إجمالي العملاء', القيمة: clients.length },
      { المقياس: 'نشطون', القيمة: activeClients.length },
      { المقياس: 'تجريبي', القيمة: trialClients.length },
      { المقياس: 'MRR (دولار)', القيمة: Math.round(mrrTotal) },
      { المقياس: 'ARPU (دولار)', القيمة: arpu },
      { المقياس: 'معدل التحويل', القيمة: `${clients.length ? Math.round((paidCount / clients.length) * 100) : 0}%` },
      { المقياس: 'معدل الإلغاء', القيمة: `${churnRate}%` },
    ]);
    showToast('تم تصدير الملخص', 'success');
  };

  const exportPdf = (): void => {
    const html = `
      <h1>تقرير أداء المنصة</h1>
      <p class="muted">${new Date().toLocaleDateString('ar-u-nu-latn')}</p>
      <table>
        <tr><td>MRR</td><td class="right"><strong>$${Math.round(mrrTotal).toLocaleString('en-US')}</strong></td></tr>
        <tr><td>ARPU</td><td class="right">$${arpu}</td></tr>
        <tr><td>معدل الإلغاء</td><td class="right">${churnRate}%</td></tr>
        <tr><td>إجمالي العملاء</td><td class="right">${clients.length}</td></tr>
        <tr><td>عملاء نشطون</td><td class="right">${activeClients.length}</td></tr>
      </table>
      <h2>الأداء حسب الدولة</h2>
      <table>
        <thead><tr><th>الدولة</th><th class="right">العملاء</th><th class="right">الإيراد الشهري</th><th class="right">متوسط الإيراد</th></tr></thead>
        <tbody>
          ${byCountry.map((x) => `<tr><td>${x.country.flag} ${x.country.nameAr}</td><td class="right">${x.count}</td><td class="right">$${Math.round(x.revenue).toLocaleString('en-US')}</td><td class="right">$${x.avgRevenue}</td></tr>`).join('')}
        </tbody>
      </table>
    `;
    printAsPdf('تقرير أداء المنصة', html);
    showToast('جاري تجهيز PDF...', 'info');
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h2 className="text-2xl font-bold">التقارير</h2>
        <p className="text-sm text-muted-foreground">تقارير وإحصائيات مفصّلة</p>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="p-3 flex flex-wrap items-center justify-between gap-3">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportSummary}>
              <Download className="h-4 w-4 me-1.5" /> تصدير CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportPdf}>
              <FileText className="h-4 w-4 me-1.5" /> تصدير PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {allClients.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Users className="h-12 w-12 mb-3 opacity-20" />
            <p className="text-sm">لا يوجد عملاء بعد</p>
          </CardContent>
        </Card>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="إجمالي الإيرادات"
          value={`$${Math.round(mrrTotal).toLocaleString('en-US')}`}
          icon={<TrendingUp className="h-4 w-4" />}
          iconBg="bg-success/15"
          iconColor="text-success"
        />
        <StatCard
          label="متوسط الإيراد للعميل"
          value={`$${arpu}`}
          icon={<Users className="h-4 w-4" />}
          iconBg="bg-primary/15"
          iconColor="text-primary"
        />
        <StatCard
          label="إجمالي العملاء"
          value={clients.length}
          icon={<Users className="h-4 w-4" />}
          iconBg="bg-info/15"
          iconColor="text-info"
        />
        <StatCard
          label="معدل الإلغاء"
          value={`${churnRate}%`}
          icon={<TrendingDown className="h-4 w-4" />}
          iconBg="bg-danger/15"
          iconColor="text-danger"
        />
      </div>

      {/* Signups chart + Conversion funnel side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ArrowLeftRight className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm">الاشتراكات مقابل الإلغاءات</CardTitle>
                  <CardDescription className="text-xs">آخر 6 أشهر</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> اشتراكات</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> إلغاءات</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{chartData.signups.reduce((a, b) => a + b, 0)}</span>
                <span className="text-[11px] text-muted-foreground">اشتراك</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10">
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                <span className="text-sm font-bold text-red-600 dark:text-red-400">{chartData.cancellations.reduce((a, b) => a + b, 0)}</span>
                <span className="text-[11px] text-muted-foreground">إلغاء</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <LineChart
              labels={chartData.labels}
              series={[
                { name: 'اشتراكات', color: '#10B981', data: chartData.signups },
                { name: 'إلغاءات', color: '#EF4444', data: chartData.cancellations },
              ]}
              height={200}
            />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Target className="h-4.5 w-4.5 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-sm">معدل التحويل</CardTitle>
                <CardDescription className="text-xs">من التجريبي إلى المدفوع</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              const trialTotal = trialClients.length + paidCount;
              const conversionRate = trialTotal ? Math.round((paidCount / trialTotal) * 100) : 0;
              const circumference = 2 * Math.PI * 54;
              const strokeDashoffset = circumference - (conversionRate / 100) * circumference;
              return (
                <div className="flex flex-col items-center gap-5">
                  <div className="relative">
                    <svg width="140" height="140" viewBox="0 0 140 140" className="transform -rotate-90">
                      <circle cx="70" cy="70" r="54" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="12" />
                      <circle
                        cx="70" cy="70" r="54" fill="none"
                        stroke={conversionRate >= 50 ? '#10B981' : conversionRate >= 25 ? '#F59E0B' : '#EF4444'}
                        strokeWidth="12" strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{conversionRate}%</span>
                      <span className="text-[10px] text-muted-foreground">تحويل</span>
                    </div>
                  </div>
                  <div className="w-full space-y-2">
                    {planDist.map((p) => (
                      <div key={p.label} className="flex items-center justify-between p-2.5 rounded-lg border border-border/60" style={{ backgroundColor: `${p.color}08` }}>
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                          <span className="text-xs font-medium">{p.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{p.value}</span>
                          <span className="text-[10px] text-muted-foreground">({trialTotal ? Math.round((p.value / trialTotal) * 100) : 0}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Doughnuts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <PieChart className="h-4.5 w-4.5 text-violet-500" />
              </div>
              <div>
                <CardTitle className="text-sm">توزيع الباقات</CardTitle>
                <CardDescription className="text-xs">حسب عدد العملاء المشتركين</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {planDist.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <PieChart className="h-10 w-10 mb-2 opacity-15" />
                <p className="text-xs">لا توجد بيانات</p>
              </div>
            ) : (
              <DoughnutChart size={180} data={planDist} />
            )}
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <Activity className="h-4.5 w-4.5 text-cyan-500" />
              </div>
              <div>
                <CardTitle className="text-sm">حالة العملاء</CardTitle>
                <CardDescription className="text-xs">توزيع الحالات الحالية</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {statusDist.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <Activity className="h-10 w-10 mb-2 opacity-15" />
                <p className="text-xs">لا توجد بيانات</p>
              </div>
            ) : (
              <DoughnutChart size={180} data={statusDist} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* By country */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe2 className="h-5 w-5 text-primary" />
            الأداء حسب الدولة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-start w-12">#</TableHead>
                <TableHead className="text-start">الدولة</TableHead>
                <TableHead className="text-start">عدد العملاء</TableHead>
                <TableHead className="text-start">الإيراد الشهري</TableHead>
                <TableHead className="text-start">متوسط الإيراد للعميل</TableHead>
                <TableHead className="text-start">حصة السوق</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {byCountry.map((x, idx) => {
                const share = allClients.length ? (x.count / allClients.length) * 100 : 0;
                return (
                  <TableRow key={x.country.code}>
                    <TableCell className="text-xs text-muted-foreground font-mono">{idx + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{x.country.flag}</span>
                        <span className="font-medium">{x.country.nameAr}</span>
                        <span className="text-xs text-muted-foreground">{x.country.code}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{x.count}</TableCell>
                    <TableCell className="font-semibold text-success">${Math.round(x.revenue).toLocaleString('en-US')}</TableCell>
                    <TableCell>${x.avgRevenue}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={share} className="flex-1 h-1.5" />
                        <span className="text-xs font-medium text-muted-foreground w-8">{Math.round(share)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}

