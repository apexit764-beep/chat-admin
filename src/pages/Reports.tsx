import { useState } from 'react';
import {
  Calendar,
  Download,
  FileText,
  MessageSquare,
  Send,
  Clock,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { Card, StatCard, Avatar } from '@components/ui';
import { LineChart } from '@components/charts/LineChart';
import { BarChart } from '@components/charts/BarChart';
import { Heatmap } from '@components/charts/Heatmap';
import { useDataStore } from '@/store/useDataStore';
import { useUIStore } from '@/store/useUIStore';
import { downloadCsv, printAsPdf } from '@/utils/csv';
import { cn } from '@/utils/cn';

type Range = 'today' | 'week' | 'month' | 'custom';

export default function Reports(): JSX.Element {
  const agents = useDataStore((s) => s.agents);
  const conversations = useDataStore((s) => s.conversations);
  const showToast = useUIStore((s) => s.showToast);
  const [range, setRange] = useState<Range>('week');

  const ranges: { key: Range; label: string }[] = [
    { key: 'today', label: 'اليوم' },
    { key: 'week', label: 'أسبوع' },
    { key: 'month', label: 'شهر' },
    { key: 'custom', label: 'مخصص' },
  ];

  const dayLabels = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  // Line chart — new conversations over week
  const newConvsLine = [12, 18, 22, 17, 28, 19, 9];

  // Bar chart — hours until first reply (blue) + threshold breaches (red)
  const firstReplyHours = [0.8, 1.2, 2.4, 0.9, 1.5, 0.7, 1.1];
  const breaches = [0, 0, 1, 0, 1, 0, 0];

  // Heatmap — peak hours (days x 2h slots from 8am to 10pm)
  const slots = ['8ص', '10ص', '12م', '2م', '4م', '6م', '8م', '10م'];
  const peakValues: number[][] = [
    [4, 8, 12, 18, 22, 28, 15, 6],
    [5, 12, 20, 24, 28, 32, 18, 8],
    [6, 14, 22, 28, 35, 38, 22, 10],
    [4, 10, 18, 22, 28, 30, 20, 8],
    [7, 16, 26, 32, 38, 42, 24, 11],
    [3, 6, 10, 15, 20, 25, 18, 5],
    [2, 4, 8, 11, 14, 18, 12, 4],
  ];

  // Horizontal bars — conversations by tag
  const byTag = [
    { tag: 'مسقط', count: 47, color: 'bg-primary' },
    { tag: 'الخوض', count: 32, color: 'bg-info' },
    { tag: 'VIP', count: 21, color: 'bg-warning' },
    { tag: 'مالك ذهبي', count: 16, color: 'bg-success' },
    { tag: 'B2B', count: 14, color: 'bg-danger' },
    { tag: 'صلالة', count: 11, color: 'bg-primary/60' },
    { tag: 'سيارة', count: 8, color: 'bg-info/60' },
  ];
  const tagMax = Math.max(...byTag.map((t) => t.count));

  // Agent performance
  const agentRows = agents.map((a) => {
    const handled = conversations.filter((c) => c.assignedTo === a.id).length;
    return {
      agent: a,
      handled,
      avgReply: (1 + Math.random() * 4).toFixed(1),
      resolutionRate: Math.round(60 + Math.random() * 35),
      rating: (4 + Math.random()).toFixed(1),
    };
  });

  const onExport = (type: 'pdf' | 'excel'): void => {
    if (type === 'excel') {
      const rows = agentRows.map((r) => ({
        'الموظف': r.agent.name,
        'البريد': r.agent.email,
        'المحادثات': r.handled,
        'متوسط الرد (دقيقة)': r.avgReply,
        'معدل الحل %': r.resolutionRate,
        'التقييم': r.rating,
      }));
      downloadCsv(`agent-performance-${new Date().toISOString().slice(0, 10)}.csv`, rows);
      showToast(`تم تصدير ${rows.length} موظفين`, 'success');
      return;
    }
    // PDF: open print window with summary
    const html = `
      <h1>تقرير الأداء — ${range === 'today' ? 'اليوم' : range === 'week' ? 'الأسبوع' : range === 'month' ? 'الشهر' : 'مخصص'}</h1>
      <p class="muted">${new Date().toLocaleString('ar-OM')}</p>
      <h2>إحصائيات سريعة</h2>
      <table>
        <tr><td>محادثات جديدة</td><td class="right">125</td></tr>
        <tr><td>ردود الوكلاء</td><td class="right">892</td></tr>
        <tr><td>متوسط وقت الرد</td><td class="right">3.2 دقيقة</td></tr>
        <tr><td>مغلق من أول رد</td><td class="right">68%</td></tr>
      </table>
      <h2>أداء الموظفين</h2>
      <table>
        <thead><tr><th>الموظف</th><th class="right">المحادثات</th><th class="right">متوسط الرد</th><th class="right">معدل الحل</th><th class="right">التقييم</th></tr></thead>
        <tbody>
          ${agentRows.map((r) => `<tr><td>${r.agent.name}</td><td class="right">${r.handled}</td><td class="right">${r.avgReply} د</td><td class="right">${r.resolutionRate}%</td><td class="right">⭐ ${r.rating}</td></tr>`).join('')}
        </tbody>
      </table>
      <h2>المحادثات حسب التاق</h2>
      <table>
        <thead><tr><th>التاق</th><th class="right">العدد</th></tr></thead>
        <tbody>
          ${byTag.map((t) => `<tr><td>${t.tag}</td><td class="right">${t.count}</td></tr>`).join('')}
        </tbody>
      </table>
    `;
    printAsPdf(`تقرير الأداء`, html);
    showToast('تم فتح نافذة الطباعة', 'success');
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 page-fade">
      {/* Range filter */}
      <Card className="p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-bg-light dark:bg-bg-dark rounded-full p-1">
          {ranges.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={cn(
                'px-4 py-1.5 rounded-full text-small font-medium transition-colors',
                range === r.key ? 'bg-primary text-white shadow' : 'text-muted-light dark:text-muted-dark hover:text-current'
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {range === 'custom' && (
            <>
              <input type="date" className="h-9 px-3 rounded-full bg-bg-light dark:bg-bg-dark border border-transparent text-small" />
              <span className="text-muted-light dark:text-muted-dark text-small">إلى</span>
              <input type="date" className="h-9 px-3 rounded-full bg-bg-light dark:bg-bg-dark border border-transparent text-small" />
            </>
          )}
          <button
            onClick={() => onExport('pdf')}
            className="h-9 px-4 rounded-full border border-border-light dark:border-border-dark text-small font-medium hover:bg-bg-light dark:hover:bg-bg-dark transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" /> PDF
          </button>
          <button
            onClick={() => onExport('excel')}
            className="h-9 px-4 rounded-full border border-border-light dark:border-border-dark text-small font-medium hover:bg-bg-light dark:hover:bg-bg-dark transition-colors flex items-center gap-2"
          >
            <FileText className="h-4 w-4" /> Excel
          </button>
        </div>
      </Card>

      {/* 4 stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="محادثات جديدة"
          value="125"
          icon={<MessageSquare className="h-5 w-5" />}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          label="ردود الوكلاء"
          value="892"
          icon={<Send className="h-5 w-5" />}
          iconBg="bg-info/10"
          iconColor="text-info"
          trend={{ value: 18, positive: true }}
        />
        <StatCard
          label="متوسط وقت الرد"
          value="3.2 د"
          icon={<Clock className="h-5 w-5" />}
          iconBg="bg-warning/10"
          iconColor="text-warning"
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          label="مغلق من أول رد"
          value="68%"
          icon={<CheckCircle2 className="h-5 w-5" />}
          iconBg="bg-success/10"
          iconColor="text-success"
          trend={{ value: 5, positive: true }}
        />
      </div>

      {/* Row: line + bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-h3 font-bold">محادثات جديدة</h2>
              <p className="text-small text-muted-light dark:text-muted-dark">يومياً خلال الأسبوع</p>
            </div>
            <button className="text-small text-primary font-medium flex items-center gap-1">
              عرض الكل <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <LineChart
            labels={dayLabels}
            series={[{ name: 'محادثات جديدة', color: '#2563EB', data: newConvsLine }]}
            height={220}
          />
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-h3 font-bold">ساعات حتى أول رد</h2>
              <p className="text-small text-muted-light dark:text-muted-dark">المتوسط اليومي</p>
            </div>
            <div className="flex items-center gap-3 text-small">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
                المتوسط
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-danger" />
                تجاوز الحد
              </span>
            </div>
          </div>
          <DualBarChart labels={dayLabels} primary={firstReplyHours} secondary={breaches} />
        </Card>
      </div>

      {/* Heatmap */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-h3 font-bold">أوقات الذروة</h2>
            <p className="text-small text-muted-light dark:text-muted-dark">عدد الرسائل لكل يوم وفترة (2 ساعة)</p>
          </div>
          <Calendar className="h-4 w-4 text-muted-light dark:text-muted-dark" />
        </div>
        <Heatmap rows={dayLabels} cols={slots} values={peakValues} />
      </Card>

      {/* Row: tag bars + agents table */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="p-5 lg:col-span-2">
          <h2 className="text-h3 font-bold mb-1">المحادثات حسب التاق</h2>
          <p className="text-small text-muted-light dark:text-muted-dark mb-4">توزيع الوسوم على المحادثات</p>
          <div className="space-y-3">
            {byTag.map((t) => (
              <div key={t.tag}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-small font-medium">{t.tag}</span>
                  <span className="text-small text-muted-light dark:text-muted-dark">{t.count}</span>
                </div>
                <div className="h-2 bg-bg-light dark:bg-bg-dark rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', t.color)}
                    style={{ width: `${(t.count / tagMax) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden lg:col-span-3">
          <div className="px-5 py-4 border-b border-border-light dark:border-border-dark">
            <h2 className="text-h3 font-bold">أداء الموظفين</h2>
            <p className="text-small text-muted-light dark:text-muted-dark">إنتاجية كل موظف خلال الفترة</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-body">
              <thead className="bg-bg-light dark:bg-bg-dark text-small text-muted-light dark:text-muted-dark">
                <tr>
                  <th className="text-start font-medium px-4 py-2.5">الموظف</th>
                  <th className="text-start font-medium px-4 py-2.5">المحادثات</th>
                  <th className="text-start font-medium px-4 py-2.5">متوسط الرد</th>
                  <th className="text-start font-medium px-4 py-2.5">معدل الحل</th>
                  <th className="text-start font-medium px-4 py-2.5">التقييم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {agentRows.map(({ agent, handled, avgReply, resolutionRate, rating }) => (
                  <tr key={agent.id} className="hover:bg-bg-light dark:hover:bg-bg-dark transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={agent.name} size="sm" status={agent.status} />
                        <span className="font-medium">{agent.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{handled}</td>
                    <td className="px-4 py-3">{avgReply} د</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 w-24">
                        <div className="flex-1 h-1.5 bg-bg-light dark:bg-bg-dark rounded-full overflow-hidden">
                          <div className="h-full bg-success rounded-full" style={{ width: `${resolutionRate}%` }} />
                        </div>
                        <span className="text-small font-medium">{resolutionRate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-small font-medium">
                        ⭐ {rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function DualBarChart({
  labels,
  primary,
  secondary,
}: {
  labels: string[];
  primary: number[];
  secondary: number[];
}): JSX.Element {
  const width = 600;
  const height = 220;
  const padding = { top: 20, right: 16, bottom: 32, left: 32 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const max = Math.max(...primary, 1);
  const slot = innerW / primary.length;
  const barW = slot * 0.4;
  const yGrid = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {yGrid.map((g) => (
          <line
            key={g}
            x1={padding.left}
            x2={width - padding.right}
            y1={padding.top + innerH * (1 - g)}
            y2={padding.top + innerH * (1 - g)}
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeDasharray="3 3"
          />
        ))}
        {yGrid.map((g) => (
          <text
            key={`yl-${g}`}
            x={padding.left - 6}
            y={padding.top + innerH * (1 - g) + 4}
            fontSize="10"
            textAnchor="end"
            fill="currentColor"
            opacity="0.5"
          >
            {(max * g).toFixed(1)}
          </text>
        ))}
        {primary.map((v, i) => {
          const h = (v / max) * innerH;
          const x = padding.left + i * slot + (slot - barW) / 2;
          const y = padding.top + innerH - h;
          const isBreach = secondary[i] > 0;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx="4"
                fill={isBreach ? '#EF4444' : '#2563EB'}
                fillOpacity="0.9"
              />
              <text
                x={x + barW / 2}
                y={y - 4}
                fontSize="10"
                textAnchor="middle"
                fill="currentColor"
                opacity="0.8"
                fontWeight="600"
              >
                {v.toFixed(1)}
              </text>
            </g>
          );
        })}
        {labels.map((lbl, i) => (
          <text
            key={lbl + i}
            x={padding.left + i * slot + slot / 2}
            y={height - 8}
            fontSize="10"
            textAnchor="middle"
            fill="currentColor"
            opacity="0.6"
          >
            {lbl}
          </text>
        ))}
      </svg>
    </div>
  );
}
