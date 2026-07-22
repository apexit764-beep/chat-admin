import { useState, useMemo } from 'react';
import {
  MessageSquareWarning,
  Lightbulb,
  Search,
  Filter,
  Eye,
  Send,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { useAuthStore } from '@/store/useAuthStore';
import { timeAgo } from '@/utils/format';
import { cn } from '@/lib/utils';
import type { FeedbackType, FeedbackPriority, FeedbackStatus } from '@/store/adminMockData';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
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

const priorityConfig: Record<FeedbackPriority, { label: string; dot: string; text: string; bg: string; border: string }> = {
  high: { label: 'عالية', dot: 'bg-red-500', text: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800' },
  medium: { label: 'متوسطة', dot: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800' },
  low: { label: 'منخفضة', dot: 'bg-slate-400', text: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-900/30', border: 'border-slate-200 dark:border-slate-700' },
};

const statusConfig: Record<FeedbackStatus, { label: string; dot: string; text: string; bg: string; border: string }> = {
  awaiting_reply: { label: 'بانتظار الرد', dot: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800' },
  replied: { label: 'تم الرد', dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800' },
};

type TypeFilter = 'all' | FeedbackType;
type StatusFilter = 'all' | FeedbackStatus;

const PAGE_SIZE = 8;

export default function AdminFeedback(): JSX.Element {
  const feedback = useAdminStore((s) => s.feedback);
  const replyToFeedback = useAdminStore((s) => s.replyToFeedback);
  const user = useAuthStore((s) => s.user);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = [...feedback];
    if (typeFilter !== 'all') list = list.filter((f) => f.type === typeFilter);
    if (statusFilter !== 'all' && typeFilter === 'complaint') {
      list = list.filter((f) => f.type === 'complaint' && f.status === statusFilter);
    }
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const selected = feedback.find((f) => f.id === selectedId) ?? null;
  const hasReply = selected?.type === 'complaint' && selected.replies && selected.replies.length > 0;
  const canReply = selected?.type === 'complaint' && !hasReply;

  const handleReply = () => {
    if (!selected || !replyText.trim() || !canReply) return;
    replyToFeedback(selected.id, replyText.trim(), user?.name ?? 'مشرف');
    setReplyText('');
  };

  const handleTypeChange = (v: string) => {
    setTypeFilter(v as TypeFilter);
    if (v !== 'complaint') setStatusFilter('all');
    setPage(1);
  };

  const handleStatusChange = (v: string) => {
    setStatusFilter(v as StatusFilter);
    setPage(1);
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
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="ps-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={handleTypeChange}>
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
            {typeFilter === 'complaint' && (
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الحالات</SelectItem>
                  <SelectItem value="awaiting_reply">بانتظار الرد</SelectItem>
                  <SelectItem value="replied">تم الرد</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <MessageSquareWarning className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm">لا توجد نتائج</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>الموضوع</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>العميل</TableHead>
                    <TableHead>الأولوية</TableHead>
                    {typeFilter === 'complaint' && <TableHead>الحالة</TableHead>}
                    <TableHead>التاريخ</TableHead>
                    <TableHead className="text-end">عرض</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((entry, idx) => {
                    const tConfig = typeConfig[entry.type];
                    const pConfig = priorityConfig[entry.priority];

                    return (
                      <TableRow key={entry.id}>
                        <TableCell className="text-xs text-muted-foreground font-mono">{(safePage - 1) * PAGE_SIZE + idx + 1}</TableCell>
                        <TableCell>
                          <button
                            type="button"
                            className="text-sm font-medium text-primary hover:underline max-w-[280px] truncate block text-start"
                            onClick={() => { setSelectedId(entry.id); setReplyText(''); }}
                          >
                            {entry.subject}
                          </button>
                        </TableCell>
                        <TableCell>
                          <Badge variant={tConfig.badgeVariant} className="text-[10px]">
                            {tConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-sm">{entry.clientName}</TableCell>
                        <TableCell>
                          <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium', pConfig.bg, pConfig.border, pConfig.text)}>
                            <span className={cn('h-1.5 w-1.5 rounded-full', pConfig.dot)} />
                            {pConfig.label}
                          </span>
                        </TableCell>
                        {typeFilter === 'complaint' && (
                          <TableCell>
                            {entry.type === 'complaint' && (
                              <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium', statusConfig[entry.status].bg, statusConfig[entry.status].border, statusConfig[entry.status].text)}>
                                <span className={cn('h-1.5 w-1.5 rounded-full', statusConfig[entry.status].dot)} />
                                {statusConfig[entry.status].label}
                              </span>
                            )}
                          </TableCell>
                        )}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t mt-4">
                  <p className="text-xs text-muted-foreground">
                    عرض {(safePage - 1) * PAGE_SIZE + 1} - {Math.min(safePage * PAGE_SIZE, filtered.length)} من {filtered.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Button key={p} variant={p === safePage ? 'default' : 'outline'} size="icon" className="h-8 w-8 text-xs" onClick={() => setPage(p)}>
                        {p}
                      </Button>
                    ))}
                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(v) => { if (!v) { setSelectedId(null); setReplyText(''); } }}>
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
                  {selected.type === 'complaint' && (
                    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium', statusConfig[selected.status].bg, statusConfig[selected.status].border, statusConfig[selected.status].text)}>
                      <span className={cn('h-1.5 w-1.5 rounded-full', statusConfig[selected.status].dot)} />
                      {statusConfig[selected.status].label}
                    </span>
                  )}
                </div>

                <Separator />

                {/* Client message */}
                <div className="p-4 rounded-xl bg-muted/50 border border-border/40">
                  <p className="text-sm font-medium text-foreground/80 mb-1">{selected.clientName}</p>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                {/* Admin reply (if exists) */}
                {hasReply && selected.replies && selected.replies[0] && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-primary">{selected.replies[0].author}</p>
                      <span className="text-[10px] text-muted-foreground">{timeAgo(selected.replies[0].timestamp)}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{selected.replies[0].text}</p>
                  </div>
                )}

                {/* Reply textarea (complaints only, single reply) */}
                {canReply && (
                  <div className="space-y-2">
                    <Separator />
                    <p className="text-sm font-medium">الرد على الشكوى</p>
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="اكتب ردك هنا..."
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex justify-end">
                      <Button size="sm" disabled={!replyText.trim()} onClick={handleReply}>
                        <Send className="h-3.5 w-3.5 me-1.5" />
                        إرسال الرد
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button variant="outline" onClick={() => { setSelectedId(null); setReplyText(''); }}>إغلاق</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
