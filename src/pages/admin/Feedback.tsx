import { useState, useMemo } from 'react';
import {
  MessageSquareWarning,
  Lightbulb,
  Bug,
  ThumbsUp,
  Search,
  Send,
  Clock,
  CheckCircle2,
  Loader2,
  XCircle,
  Filter,
  Star,
} from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { timeAgo } from '@/utils/format';
import { cn } from '@/lib/utils';
import type { FeedbackType, FeedbackStatus, FeedbackPriority } from '@/store/adminMockData';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const typeConfig: Record<FeedbackType, { label: string; icon: React.ElementType; color: string; badgeClass: string }> = {
  complaint: { label: 'شكوى', icon: MessageSquareWarning, color: 'text-red-500 bg-red-500/10', badgeClass: 'bg-red-500/10 text-red-600 border-red-500/20' },
  suggestion: { label: 'اقتراح', icon: Lightbulb, color: 'text-amber-500 bg-amber-500/10', badgeClass: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  bug: { label: 'خلل تقني', icon: Bug, color: 'text-violet-500 bg-violet-500/10', badgeClass: 'bg-violet-500/10 text-violet-600 border-violet-500/20' },
  praise: { label: 'إشادة', icon: ThumbsUp, color: 'text-emerald-500 bg-emerald-500/10', badgeClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
};

const statusConfig: Record<FeedbackStatus, { label: string; icon: React.ElementType; color: string }> = {
  open: { label: 'مفتوح', icon: Clock, color: 'text-blue-500' },
  in_progress: { label: 'قيد المعالجة', icon: Loader2, color: 'text-amber-500' },
  resolved: { label: 'تم الحل', icon: CheckCircle2, color: 'text-emerald-500' },
  closed: { label: 'مغلق', icon: XCircle, color: 'text-slate-400' },
};

const priorityConfig: Record<FeedbackPriority, { label: string; color: string }> = {
  urgent: { label: 'عاجل', color: 'bg-red-500 text-white' },
  high: { label: 'مرتفع', color: 'bg-orange-500 text-white' },
  medium: { label: 'متوسط', color: 'bg-blue-500 text-white' },
  low: { label: 'منخفض', color: 'bg-slate-400 text-white' },
};

type TypeFilter = 'all' | FeedbackType;
type StatusFilter = 'all' | FeedbackStatus;

export default function AdminFeedback(): JSX.Element {
  const feedback = useAdminStore((s) => s.feedback);
  const updateFeedbackStatus = useAdminStore((s) => s.updateFeedbackStatus);
  const replyToFeedback = useAdminStore((s) => s.replyToFeedback);
  const currentUser = useAuthStore((s) => s.user);
  const showToast = useUIStore((s) => s.showToast);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const filtered = useMemo(() => {
    let list = [...feedback];
    if (typeFilter !== 'all') list = list.filter((f) => f.type === typeFilter);
    if (statusFilter !== 'all') list = list.filter((f) => f.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.subject.toLowerCase().includes(q) ||
          f.clientName.toLowerCase().includes(q) ||
          f.message.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [feedback, typeFilter, statusFilter, search]);

  const selected = feedback.find((f) => f.id === selectedId) ?? null;

  const stats = useMemo(() => ({
    total: feedback.length,
    open: feedback.filter((f) => f.status === 'open').length,
    inProgress: feedback.filter((f) => f.status === 'in_progress').length,
    complaints: feedback.filter((f) => f.type === 'complaint' && (f.status === 'open' || f.status === 'in_progress')).length,
  }), [feedback]);

  const handleReply = (): void => {
    if (!selectedId || !replyText.trim()) return;
    replyToFeedback(selectedId, replyText.trim(), currentUser?.name ?? 'مدير');
    showToast('تم إرسال الرد', 'success');
    setReplyText('');
  };

  const handleStatusChange = (id: string, status: FeedbackStatus): void => {
    updateFeedbackStatus(id, status);
    showToast(`تم تحديث الحالة: ${statusConfig[status].label}`, 'success');
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <MessageSquareWarning className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">إجمالي البلاغات</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.open}</p>
              <p className="text-xs text-muted-foreground">بانتظار الرد</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Loader2 className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
              <p className="text-xs text-muted-foreground">قيد المعالجة</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <MessageSquareWarning className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.complaints}</p>
              <p className="text-xs text-muted-foreground">شكاوى نشطة</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters + List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquareWarning className="h-5 w-5 text-primary" />
                الشكاوى والاقتراحات
              </CardTitle>
              <CardDescription className="mt-1">متابعة ملاحظات العملاء والرد عليها</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative max-w-xs flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
              <SelectTrigger className="w-36">
                <Filter className="h-4 w-4 me-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأنواع</SelectItem>
                <SelectItem value="complaint">شكاوى</SelectItem>
                <SelectItem value="suggestion">اقتراحات</SelectItem>
                <SelectItem value="bug">أخطاء تقنية</SelectItem>
                <SelectItem value="praise">إشادات</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="open">مفتوح</SelectItem>
                <SelectItem value="in_progress">قيد المعالجة</SelectItem>
                <SelectItem value="resolved">تم الحل</SelectItem>
                <SelectItem value="closed">مغلق</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <MessageSquareWarning className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm">لا توجد نتائج</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((entry) => {
                const tConfig = typeConfig[entry.type];
                const sConfig = statusConfig[entry.status];
                const pConfig = priorityConfig[entry.priority];
                const TypeIcon = tConfig.icon;
                const StatusIcon = sConfig.icon;

                return (
                  <button
                    key={entry.id}
                    className={cn(
                      'w-full flex items-start gap-3 p-4 rounded-xl text-start transition-all border',
                      entry.status === 'open' && entry.priority === 'urgent'
                        ? 'border-red-500/30 bg-red-500/[0.03] hover:bg-red-500/[0.06]'
                        : entry.status === 'open'
                          ? 'border-border/60 bg-primary/[0.02] hover:bg-muted/50'
                          : 'border-border/40 hover:bg-muted/40'
                    )}
                    onClick={() => { setSelectedId(entry.id); setReplyText(''); }}
                  >
                    <div className={cn('flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-xl', tConfig.color)}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-bold text-foreground">{entry.subject}</span>
                        <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 h-5 border', tConfig.badgeClass)}>
                          {tConfig.label}
                        </Badge>
                        <Badge className={cn('text-[10px] px-1.5 py-0 h-5', pConfig.color)}>
                          {pConfig.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-1.5">{entry.message}</p>
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="font-medium text-foreground/70">{entry.clientName}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <span className="text-muted-foreground/60">{timeAgo(entry.timestamp)}</span>
                        {entry.reply && (
                          <>
                            <span className="text-muted-foreground/50">•</span>
                            <span className="text-emerald-500 font-medium">تم الرد</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-1.5">
                      <StatusIcon className={cn('h-4 w-4', sConfig.color)} />
                      <span className={cn('text-xs font-medium', sConfig.color)}>{sConfig.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(v) => { if (!v) setSelectedId(null); }}>
        {selected && (
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <div className="flex items-center gap-3">
                {(() => {
                  const TypeIcon = typeConfig[selected.type].icon;
                  return (
                    <div className={cn('flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center', typeConfig[selected.type].color)}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                  );
                })()}
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-base">{selected.subject}</DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selected.clientName} — {timeAgo(selected.timestamp)}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-2">
                {/* Meta badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={cn('border', typeConfig[selected.type].badgeClass)}>
                    {typeConfig[selected.type].label}
                  </Badge>
                  <Badge className={priorityConfig[selected.priority].color}>
                    {priorityConfig[selected.priority].label}
                  </Badge>
                  <Select
                    value={selected.status}
                    onValueChange={(v) => handleStatusChange(selected.id, v as FeedbackStatus)}
                  >
                    <SelectTrigger className="w-auto h-7 text-xs gap-1 border-dashed">
                      {(() => {
                        const SI = statusConfig[selected.status].icon;
                        return <SI className={cn('h-3.5 w-3.5', statusConfig[selected.status].color)} />;
                      })()}
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">مفتوح</SelectItem>
                      <SelectItem value="in_progress">قيد المعالجة</SelectItem>
                      <SelectItem value="resolved">تم الحل</SelectItem>
                      <SelectItem value="closed">مغلق</SelectItem>
                    </SelectContent>
                  </Select>
                  {selected.rating && (
                    <div className="flex items-center gap-1 ms-auto">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn('h-3.5 w-3.5', i < selected.rating! ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30')}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Client message */}
                <div className="p-4 rounded-xl bg-muted/50 border border-border/40">
                  <p className="text-sm font-medium text-foreground/80 mb-1">{selected.clientName}</p>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                {/* Existing reply */}
                {selected.reply && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-primary">{selected.repliedBy}</p>
                      {selected.repliedAt && (
                        <span className="text-[11px] text-muted-foreground">{timeAgo(selected.repliedAt)}</span>
                      )}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{selected.reply}</p>
                  </div>
                )}

                {/* Reply form */}
                {selected.status !== 'closed' && (
                  <div className="space-y-3">
                    <Separator />
                    <p className="text-sm font-semibold">{selected.reply ? 'تحديث الرد' : 'كتابة رد'}</p>
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="اكتب ردك هنا..."
                      rows={4}
                      dir="rtl"
                    />
                  </div>
                )}
              </div>
            </ScrollArea>

            {selected.status !== 'closed' && (
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setSelectedId(null)}>إغلاق</Button>
                <Button
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  إرسال الرد
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
