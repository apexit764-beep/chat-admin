import { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Mail,
  Phone,
  Globe,
  Calendar,
  Clock,
  CreditCard,
  Users,
  MessageSquare,
  Radio,
  Edit2,
  ExternalLink,
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
  Trash2,
  FileText,
  Shield,
  Paperclip,
  Headphones,
  ChevronLeft,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Hash,
} from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { formatMoney } from '@/utils/money';
import { formatDate, timeAgo, initials, avatarColor } from '@/utils/format';
import { cn } from '@/lib/utils';
import { useConfirm } from '@components/ui';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import type { ClientStatus } from '@/types';

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


export default function ClientDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const showToast = useUIStore((s) => s.showToast);
  const { confirm } = useConfirm();

  const clients = useAdminStore((s) => s.clients);
  const plans = useAdminStore((s) => s.plans);
  const countries = useAdminStore((s) => s.countries);
  const subscriptions = useAdminStore((s) => s.subscriptions);
  const invoices = useAdminStore((s) => s.invoices);
  const transactions = useAdminStore((s) => s.transactions);
  const feedback = useAdminStore((s) => s.feedback);
  const activityLog = useAdminStore((s) => s.activityLog);
  const suspendClient = useAdminStore((s) => s.suspendClient);
  const reactivateClient = useAdminStore((s) => s.reactivateClient);
  const deleteClient = useAdminStore((s) => s.deleteClient);
  const cancelSubscription = useAdminStore((s) => s.cancelSubscription);

  const client = clients.find((c) => c.id === id);
  const country = countries.find((c) => c.code === client?.country);
  const plan = plans.find((p) => p.id === client?.planId);
  const sub = subscriptions.find((s) => s.clientId === id);
  const clientInvoices = useMemo(() => invoices.filter((i) => i.clientId === id).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)), [invoices, id]);
  const clientTransactions = useMemo(() => transactions.filter((t) => t.clientId === id).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)), [transactions, id]);
  const clientFeedback = useMemo(() => feedback.filter((f) => f.clientId === id), [feedback, id]);
  const clientActivity = useMemo(() => activityLog.filter((a) => a.target === client?.companyName || a.target === id), [activityLog, client?.companyName, id]);

  const [internalNote, setInternalNote] = useState('');
  const [notes, setNotes] = useState<string[]>([]);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-xl text-muted-foreground">العميل غير موجود</p>
        <Button variant="outline" onClick={() => navigate('/clients')}>
          <ArrowRight className="h-4 w-4 me-2" /> العودة للعملاء
        </Button>
      </div>
    );
  }

  const handleSuspend = async () => {
    const ok = await confirm({
      title: `إيقاف ${client.companyName}؟`,
      message: 'سيتم تعطيل حسابهم ومنع الدخول. يمكن إعادة التفعيل لاحقاً.',
      variant: 'warning',
      confirmText: 'إيقاف',
    });
    if (ok) {
      suspendClient(client.id);
      showToast('تم إيقاف العميل', 'success');
    }
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: `حذف ${client.companyName}؟`,
      message: 'سيتم حذف الاشتراك والفواتير والمعاملات المرتبطة. لا يمكن التراجع.',
      variant: 'danger',
      confirmText: 'حذف نهائي',
    });
    if (ok) {
      deleteClient(client.id);
      showToast('تم حذف العميل', 'success');
      navigate('/clients');
    }
  };

  const handleCancelSub = async () => {
    if (!sub) return;
    const ok = await confirm({
      title: 'إلغاء الاشتراك؟',
      message: `سيتم إلغاء اشتراك ${client.companyName} في باقة ${plan?.nameAr ?? ''}. العميل سيفقد الوصول عند انتهاء الفترة الحالية.`,
      variant: 'warning',
      confirmText: 'إلغاء الاشتراك',
    });
    if (ok) {
      cancelSubscription(sub.id);
      showToast('تم إلغاء الاشتراك', 'success');
    }
  };

  const addNote = () => {
    if (!internalNote.trim()) return;
    setNotes((prev) => [internalNote.trim(), ...prev]);
    setInternalNote('');
    showToast('تمت إضافة الملاحظة', 'success');
  };

  const limits = plan?.limits;
  const usageBars = limits
    ? [
        { label: 'الموظفون', used: client.agentCount, max: limits.agents, icon: Users },
        { label: 'القنوات', used: client.channelCount, max: limits.channels, icon: Radio },
        { label: 'المحادثات', used: client.conversationCount, max: limits.conversations, icon: MessageSquare },
      ]
    : [];

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/clients" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          العملاء
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{client.companyName}</span>
      </div>

      {/* Top bar */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary/20">
              <AvatarFallback className={`text-lg font-bold ${avatarColor(client.companyName)}`}>{initials(client.companyName)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold">{client.companyName}</h1>
                <Badge className={cn('text-[10px] font-semibold', statusBadgeClass[client.status])}>
                  {statusLabel[client.status]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {country?.flag} {country?.nameAr} • {client.industry} • {client.contactName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {client.dashboardUrl && (
              <Button variant="outline" size="sm" className="rounded-lg" asChild>
                <a href={client.dashboardUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 me-2" /> لوحة العميل
                </a>
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-lg h-9 w-9">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate(`/clients`, { state: { editClientId: client.id } })}>
                  <Edit2 className="h-4 w-4 me-2" /> تعديل البيانات
                </DropdownMenuItem>
                {client.status === 'suspended' ? (
                  <DropdownMenuItem onClick={() => { reactivateClient(client.id); showToast('تم التفعيل', 'success'); }}>
                    <PlayCircle className="h-4 w-4 me-2" /> إعادة تفعيل
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={handleSuspend}>
                    <PauseCircle className="h-4 w-4 me-2" /> إيقاف
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-danger focus:text-danger" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 me-2" /> حذف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content with sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Tabs area */}
        <Tabs defaultValue="overview" dir="rtl">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-card border rounded-xl h-auto p-1 gap-1">
            {[
              { value: 'overview', label: 'نظرة عامة', icon: Activity },
              { value: 'invoices', label: 'الفواتير', icon: FileText },
              { value: 'subscription', label: 'الاشتراك', icon: CreditCard },
              { value: 'team', label: 'الفريق', icon: Users },
              { value: 'channels', label: 'القنوات', icon: Radio },
              { value: 'support', label: 'الدعم', icon: Headphones },
              { value: 'audit', label: 'السجل', icon: Shield },
              { value: 'attachments', label: 'المرفقات', icon: Paperclip },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-muted/60 px-3 py-2 text-sm gap-1.5 flex-shrink-0 transition-colors"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-5 space-y-5">
            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <QuickStat icon={MessageSquare} label="المحادثات" value={client.conversationCount.toLocaleString('en-US')} color="primary" />
              <QuickStat icon={Users} label="الموظفون" value={String(client.agentCount)} color="info" />
              <QuickStat icon={Radio} label="القنوات" value={String(client.channelCount)} color="success" />
              <QuickStat icon={TrendingUp} label="MRR" value={client.mrr > 0 ? formatMoney(client.mrr, client.currency) : '—'} color="warning" />
            </div>

            {/* Timeline */}
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">الجدول الزمني</h3>
              </div>
              <div className="relative">
                {(() => {
                  const items = [
                    { icon: Calendar, label: 'تاريخ الانضمام', value: formatDate(client.joinedAt), tone: 'success' as const },
                    { icon: Clock, label: 'آخر نشاط', value: timeAgo(client.lastActiveAt), tone: 'info' as const },
                    ...(client.trialEndsAt ? [{
                      icon: AlertTriangle,
                      label: 'انتهاء التجربة',
                      value: formatDate(client.trialEndsAt),
                      tone: (Date.parse(client.trialEndsAt) < Date.now() + 3 * 86400000 ? 'warning' : 'muted') as 'warning' | 'muted',
                    }] : []),
                    ...(sub ? [{ icon: CreditCard, label: 'بداية الاشتراك', value: formatDate(sub.startedAt), tone: 'success' as const }] : []),
                    ...(sub ? [{ icon: Calendar, label: 'التجديد القادم', value: formatDate(sub.currentPeriodEnd), tone: 'primary' as const }] : []),
                  ];
                  return (
                    <div className="space-y-4">
                      {items.map((item, i) => (
                        <TimelineItem
                          key={i}
                          icon={item.icon}
                          label={item.label}
                          value={item.value}
                          tone={item.tone}
                          isLast={i === items.length - 1}
                        />
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Recent invoices mini */}
            {clientInvoices.length > 0 && (
              <div className="rounded-xl border bg-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-success" />
                    </div>
                    <h3 className="font-semibold text-sm">آخر الفواتير</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">{clientInvoices.length} فاتورة</span>
                </div>
                <div className="space-y-2">
                  {clientInvoices.slice(0, 3).map((inv) => (
                    <div key={inv.id} className="flex items-center gap-3 p-3 rounded-lg border bg-background hover:bg-muted/30 transition-colors">
                      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono font-semibold text-sm">{inv.number}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(inv.dueDate)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-bold text-sm">{formatMoney(inv.total, inv.currency)}</span>
                        <InvoiceStatusBadge status={inv.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="mt-5">
            <div className="rounded-xl border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right w-12">#</TableHead>
                    <TableHead className="text-right">رقم الفاتورة</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                    <TableHead className="text-right">الضريبة</TableHead>
                    <TableHead className="text-right">الإجمالي</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">لا توجد فواتير</TableCell>
                    </TableRow>
                  ) : (
                    clientInvoices.map((inv, idx) => (
                      <TableRow key={inv.id}>
                        <TableCell className="text-xs text-muted-foreground font-mono">{idx + 1}</TableCell>
                        <TableCell className="font-mono font-medium">{inv.number}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(inv.dueDate)}</TableCell>
                        <TableCell>{formatMoney(inv.amount, inv.currency)}</TableCell>
                        <TableCell className="text-muted-foreground">{formatMoney(inv.tax, inv.currency)}</TableCell>
                        <TableCell className="font-semibold">{formatMoney(inv.total, inv.currency)}</TableCell>
                        <TableCell><InvoiceStatusBadge status={inv.status} /></TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Transactions */}
            {clientTransactions.length > 0 && (
              <div className="rounded-xl border bg-card mt-5">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-sm">المعاملات المالية</h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right w-12">#</TableHead>
                      <TableHead className="text-right">المعرّف</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                      <TableHead className="text-right">الطريقة</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientTransactions.map((txn, idx) => (
                      <TableRow key={txn.id}>
                        <TableCell className="text-xs text-muted-foreground font-mono">{idx + 1}</TableCell>
                        <TableCell className="font-mono text-xs">{txn.id.slice(0, 12)}...</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(txn.createdAt)}</TableCell>
                        <TableCell className="font-semibold">{formatMoney(txn.amount, txn.currency)}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 text-xs">
                            <CreditCard className="h-3.5 w-3.5" />
                            {txn.method.toUpperCase()} •••• {txn.last4}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('text-[10px] font-semibold border-transparent',
                            txn.status === 'succeeded' && 'bg-success/15 text-success',
                            txn.status === 'failed' && 'bg-danger/15 text-danger',
                            txn.status === 'pending' && 'bg-warning/15 text-warning',
                            txn.status === 'refunded' && 'bg-muted text-muted-foreground',
                          )}>
                            {txn.status === 'succeeded' ? 'ناجحة' : txn.status === 'failed' ? 'فاشلة' : txn.status === 'pending' ? 'معلّقة' : 'مرتجعة'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="mt-5 space-y-5">
            {sub && plan ? (
              <>
                <div className="rounded-xl border bg-card p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">تفاصيل الاشتراك</h3>
                    <Badge className={cn('text-[10px] font-semibold border-transparent',
                      sub.status === 'active' && 'bg-success/15 text-success',
                      sub.status === 'past_due' && 'bg-warning/15 text-warning',
                      sub.status === 'cancelled' && 'bg-muted text-muted-foreground',
                    )}>
                      {sub.status === 'active' ? 'نشط' : sub.status === 'past_due' ? 'متأخر' : 'ملغي'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <InfoRow label="الباقة" value={plan.nameAr} />
                    <InfoRow label="المستوى" value={plan.name} />
                    <InfoRow label="الدورة" value={sub.billingCycle === 'monthly' ? 'شهري' : 'سنوي'} />
                    <InfoRow label="المبلغ" value={formatMoney(sub.amount, sub.currency)} />
                    <InfoRow label="بداية الفترة" value={formatDate(sub.currentPeriodStart)} />
                    <InfoRow label="نهاية الفترة" value={formatDate(sub.currentPeriodEnd)} />
                  </div>

                  {sub.paymentMethod && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted text-sm">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <span>
                        {sub.paymentMethod.brand.toUpperCase()} •••• {sub.paymentMethod.last4}
                        <span className="text-muted-foreground ms-2">({sub.paymentMethod.expMonth}/{sub.paymentMethod.expYear})</span>
                      </span>
                    </div>
                  )}

                  {sub.status === 'active' && (
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="rounded-full text-danger hover:text-danger" onClick={handleCancelSub}>
                        <XCircle className="h-4 w-4 me-1.5" /> إلغاء الاشتراك
                      </Button>
                    </div>
                  )}
                </div>

                {/* Plan features */}
                <div className="rounded-xl border bg-card p-5">
                  <h3 className="font-semibold mb-3 text-sm">مزايا الباقة</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-xl border bg-card p-8 text-center">
                <CreditCard className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">لا يوجد اشتراك نشط</p>
                {client.status === 'trial' && client.trialEndsAt && (
                  <p className="text-sm text-warning mt-2">
                    الفترة التجريبية تنتهي في {formatDate(client.trialEndsAt)}
                  </p>
                )}
              </div>
            )}
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="mt-5">
            <div className="rounded-xl border bg-card p-8 text-center">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">لا يوجد موظفين مسجلين لهذا العميل</p>
              <p className="text-xs text-muted-foreground mt-1">بيانات الفريق ستظهر هنا عند تسجيل الموظفين من لوحة العميل</p>
            </div>
          </TabsContent>

          {/* Channels Tab */}
          <TabsContent value="channels" className="mt-5">
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">القنوات المتصلة</h3>
                <span className="text-sm text-muted-foreground">{client.channelCount} قناة</span>
              </div>
              <div className="space-y-3">
                {Array.from({ length: Math.min(client.channelCount, 10) }, (_, i) => {
                  const channelTypes = ['واتساب', 'ماسنجر', 'إنستغرام', 'تلقرام', 'ودجت', 'بريد'];
                  const channelIcons = ['📱', '💬', '📷', '✈️', '🌐', '📧'];
                  const idx = i % channelTypes.length;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <span className="text-xl">{channelIcons[idx]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{channelTypes[idx]} {i > 5 ? `(${i + 1})` : ''}</p>
                        <p className="text-xs text-muted-foreground">
                          {i === 0 ? client.phone : `قناة-${i + 1}`}
                        </p>
                      </div>
                      <Badge className="text-[10px] bg-success/15 text-success border-transparent">متصلة</Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="mt-5">
            <div className="rounded-xl border bg-card">
              {clientFeedback.length === 0 ? (
                <div className="p-8 text-center">
                  <Headphones className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">لا توجد تذاكر دعم لهذا العميل</p>
                </div>
              ) : (
                <div className="divide-y">
                  {clientFeedback.map((fb) => (
                    <div key={fb.id} className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className={cn('text-[10px] border-transparent',
                              fb.type === 'complaint' && 'bg-danger/15 text-danger',
                              fb.type === 'suggestion' && 'bg-info/15 text-info',
                            )}>
                              {fb.type === 'complaint' ? 'شكوى' : 'اقتراح'}
                            </Badge>
                            <Badge className={cn('text-[10px] border-transparent',
                              fb.priority === 'high' && 'bg-warning/15 text-warning',
                              fb.priority === 'medium' && 'bg-info/15 text-info',
                              fb.priority === 'low' && 'bg-muted text-muted-foreground',
                            )}>
                              {fb.priority === 'high' ? 'عالية' : fb.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                            </Badge>
                          </div>
                          <p className="font-semibold text-sm mt-1">{fb.subject}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{timeAgo(fb.timestamp)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{fb.message}</p>
                      {fb.reply && (
                        <div className="p-3 rounded-lg bg-muted text-sm">
                          <p className="text-xs text-muted-foreground mb-1">رد بواسطة {fb.repliedBy}</p>
                          <p>{fb.reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit" className="mt-5">
            <div className="rounded-xl border bg-card">
              {clientActivity.length === 0 ? (
                <div className="p-8 text-center">
                  <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">لا توجد أحداث مسجلة لهذا العميل</p>
                </div>
              ) : (
                <div className="divide-y">
                  {clientActivity.map((entry) => (
                    <div key={entry.id} className="p-4 flex items-start gap-3">
                      <div className="mt-0.5">
                        <ActivityIcon action={entry.action} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{entry.details || actionLabel(entry.action)}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.actor} • {timeAgo(entry.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Attachments Tab */}
          <TabsContent value="attachments" className="mt-5">
            <div className="rounded-xl border bg-card p-8 text-center">
              <Paperclip className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">لا توجد مرفقات</p>
              <p className="text-xs text-muted-foreground mt-1">يمكنك رفع ملفات العقود والمستندات المتعلقة بهذا العميل</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Right sidebar */}
        <div className="space-y-4 order-first lg:order-last">
          {/* Contact info card */}
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-3.5 w-3.5 text-primary" />
              </div>
              معلومات الاتصال
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/50">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/50">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span dir="ltr">{client.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/50">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{country?.flag} {country?.nameAr}</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/50">
                <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground font-mono text-xs">{client.id}</span>
              </div>
            </div>
          </div>

          {/* Plan & subscription card */}
          {plan && (
            <div className="rounded-xl border bg-card p-4 space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-success/10 flex items-center justify-center">
                  <CreditCard className="h-3.5 w-3.5 text-success" />
                </div>
                الباقة الحالية
              </h3>
              <div className="relative p-4 rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 overflow-hidden">
                <div className="absolute -top-8 -left-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" aria-hidden="true" />
                <div className="relative">
                  <p className="font-bold text-primary text-base">{plan.nameAr}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{plan.tagline}</p>
                  {sub && (
                    <div className="mt-3 pt-3 border-t border-primary/15">
                      <p className="text-xl font-bold">
                        {formatMoney(sub.amount, sub.currency)}
                        <span className="text-xs text-muted-foreground font-normal ms-1">/ {sub.billingCycle === 'monthly' ? 'شهر' : 'سنة'}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Usage bars */}
          {usageBars.length > 0 && (
            <div className="rounded-xl border bg-card p-4 space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Activity className="h-3.5 w-3.5 text-warning" />
                </div>
                الاستخدام
              </h3>
              {usageBars.map((bar) => {
                const isUnlimited = bar.max === -1;
                const pct = isUnlimited ? Math.min((bar.used / 100) * 100, 100) : Math.min((bar.used / bar.max) * 100, 100);
                const isHigh = !isUnlimited && pct > 80;
                return (
                  <div key={bar.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <bar.icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{bar.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {bar.used.toLocaleString('en-US')} / {isUnlimited ? '∞' : bar.max.toLocaleString('en-US')}
                      </span>
                    </div>
                    <Progress
                      value={isUnlimited ? 15 : pct}
                      className={cn('h-2', isHigh && '[&>div]:bg-warning')}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Internal notes */}
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-info/10 flex items-center justify-center">
                <FileText className="h-3.5 w-3.5 text-info" />
              </div>
              ملاحظات داخلية
            </h3>
            <div className="space-y-2">
              <Textarea
                value={internalNote}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInternalNote(e.target.value)}
                placeholder="أضف ملاحظة..."
                className="text-sm resize-none"
                rows={2}
              />
              <Button size="sm" className="w-full rounded-full" onClick={addNote} disabled={!internalNote.trim()}>
                إضافة ملاحظة
              </Button>
            </div>
            {notes.length > 0 && (
              <div className="space-y-2 pt-2">
                {notes.map((note, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-muted text-sm">
                    <p>{note}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">الآن</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium mt-0.5">{value}</p>
    </div>
  );
}

function QuickStat({ icon: Icon, label, value, color = 'primary' }: { icon: React.ElementType; label: string; value: string; color?: string }) {
  const colorMap: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    info: 'bg-info/10 text-info',
    warning: 'bg-warning/10 text-warning',
  };
  return (
    <div className="rounded-xl border bg-card p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
      <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center shrink-0', colorMap[color] ?? colorMap.primary)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className="text-lg font-bold leading-tight mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
}

const toneMap: Record<string, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  info: 'bg-info/10 text-info',
  warning: 'bg-warning/10 text-warning',
  muted: 'bg-muted text-muted-foreground',
};

function TimelineItem({ icon: Icon, label, value, tone = 'muted', isLast }: { icon: React.ElementType; label: string; value: string; tone?: 'primary' | 'success' | 'info' | 'warning' | 'muted'; isLast?: boolean }) {
  return (
    <div className="relative flex items-center gap-3">
      {!isLast && (
        <span className="absolute top-8 right-4 -translate-x-1/2 rtl:translate-x-1/2 w-px h-full bg-border" aria-hidden="true" />
      )}
      <div className={cn('h-8 w-8 rounded-full flex items-center justify-center shrink-0 relative z-10 ring-4 ring-card', toneMap[tone])}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn('font-medium', tone === 'warning' && 'text-warning')}>{value}</span>
      </div>
    </div>
  );
}

function InvoiceStatusBadge({ status }: { status: string }) {
  return (
    <Badge className={cn('text-[10px] font-semibold border-transparent',
      status === 'paid' && 'bg-success/15 text-success',
      status === 'failed' && 'bg-danger/15 text-danger',
      status === 'pending' && 'bg-warning/15 text-warning',
      status === 'refunded' && 'bg-muted text-muted-foreground',
      status === 'draft' && 'bg-muted text-muted-foreground',
    )}>
      {status === 'paid' ? 'مدفوعة' : status === 'failed' ? 'فاشلة' : status === 'pending' ? 'معلّقة' : status === 'refunded' ? 'مرتجعة' : 'مسودة'}
    </Badge>
  );
}

function ActivityIcon({ action }: { action: string }) {
  const cls = 'h-4 w-4';
  switch (action) {
    case 'client_created': return <CheckCircle2 className={cn(cls, 'text-success')} />;
    case 'client_suspended': return <PauseCircle className={cn(cls, 'text-danger')} />;
    case 'client_reactivated': return <PlayCircle className={cn(cls, 'text-success')} />;
    case 'client_deleted': return <Trash2 className={cn(cls, 'text-danger')} />;
    case 'payment_received': return <CreditCard className={cn(cls, 'text-success')} />;
    case 'subscription_created': return <CreditCard className={cn(cls, 'text-info')} />;
    case 'subscription_cancelled': return <XCircle className={cn(cls, 'text-warning')} />;
    case 'invoice_refunded': return <FileText className={cn(cls, 'text-warning')} />;
    default: return <Activity className={cn(cls, 'text-muted-foreground')} />;
  }
}

function actionLabel(action: string): string {
  const map: Record<string, string> = {
    client_created: 'تم إنشاء الحساب',
    client_suspended: 'تم إيقاف الحساب',
    client_reactivated: 'تم إعادة تفعيل الحساب',
    client_deleted: 'تم حذف الحساب',
    payment_received: 'تم استلام دفعة',
    subscription_created: 'تم إنشاء اشتراك',
    subscription_cancelled: 'تم إلغاء الاشتراك',
    invoice_refunded: 'تم استرجاع فاتورة',
  };
  return map[action] ?? action;
}
