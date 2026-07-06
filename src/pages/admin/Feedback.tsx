import { useState, useMemo } from 'react';
import {
  MessageSquareWarning,
  Lightbulb,
  Search,
  Send,
  Clock,
  CheckCircle2,
  Loader2,
  XCircle,
  Filter,
  Eye,
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
import { Card, CardContent } from '@/components/ui/card';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const typeConfig: Record<FeedbackType, { label: string; icon: React.ElementType; badgeVariant: 'destructive' | 'secondary' }> = {
  complaint: { label: 'شكوى', icon: MessageSquareWarning, badgeVariant: 'destructive' },
  suggestion: { label: 'اقتراح', icon: Lightbulb, badgeVariant: 'secondary' },
};

const statusConfig: Record<FeedbackStatus, { label: string; icon: React.ElementType; color: string }> = {
  open: { label: 'مفتوح', icon: Clock, color: 'text-blue-500' },
  in_progress: { label: 'قيد المعالجة', icon: Loader2, color: 'text-amber-500' },
  resolved: { label: 'تم الحل', icon: CheckCircle2, color: 'text-emerald-500' },
  closed: { label: 'مغلق', icon: XCircle, color: 'text-slate-400' },
};

const priorityConfig: Record<FeedbackPriority, { label: string; dot: string; text: string; bg: string; border: string }> = {
  high: { label: 'عالية', dot: 'bg-red-500', text: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800' },
  medium: { label: 'متوسطة', dot: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800' },
  low: { label: 'منخفضة', dot: 'bg-slate-400', text: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-900/30', border: 'border-slate-200 dark:border-slate-700' },
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
      <div>
        <h2 className="text-2xl font-bold">الشكاوى والاقتراحات</h2>
        <p className="text-sm text-muted-foreground">متابعة ملاحظات وشكاوى العملاء</p>
      </div>

      <Card>
        <CardContent className="p-5 lg:p-6">
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>الموضوع</TableHead>
                  <TableHead>الأولوية</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead className="text-end">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((entry, idx) => {
                  const tConfig = typeConfig[entry.type];
                  const sConfig = statusConfig[entry.status];
                  const pConfig = priorityConfig[entry.priority];
                  const StatusIcon = sConfig.icon;

                  return (
                    <TableRow key={entry.id}>
                      <TableCell className="text-xs text-muted-foreground font-mono">{idx + 1}</TableCell>
                      <TableCell>
                        <Badge variant={tConfig.badgeVariant} className="text-[10px]">
                          {tConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-sm">{entry.clientName}</TableCell>
                      <TableCell>
                        <p className="text-sm font-medium max-w-[200px] truncate">{entry.subject}</p>
                      </TableCell>
                      <TableCell>
                        <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium', pConfig.bg, pConfig.border, pConfig.text)}>
                          <span className={cn('h-1.5 w-1.5 rounded-full', pConfig.dot)} />
                          {pConfig.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <StatusIcon className={cn('h-3.5 w-3.5', sConfig.color)} />
                          <span className={cn('text-xs font-medium', sConfig.color)}>{sConfig.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{timeAgo(entry.timestamp)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-0.5 justify-end">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => { setSelectedId(entry.id); setReplyText(''); }}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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
                    <div className={cn('flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center', selected.type === 'complaint' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500')}>
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
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={typeConfig[selected.type].badgeVariant}>
                    {typeConfig[selected.type].label}
                  </Badge>
                  <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium', priorityConfig[selected.priority].bg, priorityConfig[selected.priority].border, priorityConfig[selected.priority].text)}>
                    <span className={cn('h-1.5 w-1.5 rounded-full', priorityConfig[selected.priority].dot)} />
                    {priorityConfig[selected.priority].label}
                  </span>
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
                </div>

                <Separator />

                <div className="p-4 rounded-xl bg-muted/50 border border-border/40">
                  <p className="text-sm font-medium text-foreground/80 mb-1">{selected.clientName}</p>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

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
