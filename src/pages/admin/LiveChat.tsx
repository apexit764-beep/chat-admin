import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Send,
  MessageCircle,
  Phone,
  CheckCircle2,
  User,
  Hash,
  Clock,
  Tag,
  Globe,
  Image,
  Paperclip,
  FileText,
  Download,
  StickyNote,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useAdminStore } from '@/store/useAdminStore';
import { useAuthStore } from '@/store/useAuthStore';
import { timeAgo, initials, avatarColor } from '@/utils/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { LiveChatConversation, LiveChatStatus } from '@/types';

const statusConfig: Record<LiveChatStatus, { label: string; color: string; dotColor: string }> = {
  open: { label: 'جديدة', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', dotColor: 'bg-green-500' },
  assigned: { label: 'قيد المعالجة', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', dotColor: 'bg-yellow-500' },
  resolved: { label: 'تم الحل', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', dotColor: 'bg-gray-400' },
  closed: { label: 'مغلقة', color: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500', dotColor: 'bg-gray-300' },
};

const channelConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  whatsapp: { icon: Phone, label: 'WhatsApp', color: 'text-green-600' },
  widget: { icon: MessageCircle, label: 'الويدجت', color: 'text-primary' },
  email: { icon: Globe, label: 'البريد', color: 'text-blue-500' },
};

type FilterStatus = 'all' | 'open' | 'assigned' | 'resolved' | 'closed';

export default function LiveChat() {
  const { liveChatConversations, clients, plans, subscriptions, adminUsers, assignLiveChat, resolveLiveChat, closeLiveChat, markConversationRead, sendLiveChatMessage, sendLiveChatNote, sendLiveChatAttachment } = useAdminStore();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'unread'>('newest');
  const [draft, setDraft] = useState('');
  const [activeTab, setActiveTab] = useState<'message' | 'note'>('message');
  const [showDetails, setShowDetails] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const autoResize = useCallback((el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  const getDateLabel = useCallback((iso: string): string => {
    const d = new Date(iso);
    if (isToday(d)) return 'اليوم';
    if (isYesterday(d)) return 'أمس';
    return format(d, 'd MMMM yyyy', { locale: ar });
  }, []);

  const clientMap = useMemo(() => {
    const map: Record<string, string> = {};
    clients.forEach((c) => { map[c.id] = c.companyName; });
    return map;
  }, [clients]);

  const filtered = useMemo(() => {
    let list = [...liveChatConversations];
    if (filter !== 'all') list = list.filter((c) => c.status === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.visitorName.toLowerCase().includes(q) ||
          (c.visitorEmail && c.visitorEmail.toLowerCase().includes(q)) ||
          (clientMap[c.clientId] || '').toLowerCase().includes(q) ||
          c.messages.some((m) => m.content.toLowerCase().includes(q))
      );
    }
    if (sort === 'newest') {
      list.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    } else if (sort === 'oldest') {
      list.sort((a, b) => new Date(a.lastMessageAt).getTime() - new Date(b.lastMessageAt).getTime());
    } else {
      list.sort((a, b) => {
        if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount;
        return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
      });
    }
    return list;
  }, [liveChatConversations, filter, search, sort, clientMap]);

  const selected = useMemo(
    () => liveChatConversations.find((c) => c.id === selectedId) ?? null,
    [liveChatConversations, selectedId]
  );

  const stats = useMemo(() => {
    const open = liveChatConversations.filter((c) => c.status === 'open').length;
    const assigned = liveChatConversations.filter((c) => c.status === 'assigned').length;
    return { open, assigned, total: liveChatConversations.length };
  }, [liveChatConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected?.messages.length, selectedId]);

  const handleSend = () => {
    if (!draft.trim() || !selectedId) return;
    if (activeTab === 'note') {
      sendLiveChatNote(selectedId, draft.trim(), user?.name ?? 'مشرف');
    } else {
      sendLiveChatMessage(selectedId, draft.trim(), user?.name ?? 'مشرف');
    }
    setDraft('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (!file || !selectedId) return;
    const url = URL.createObjectURL(file);
    sendLiveChatAttachment(selectedId, user?.name ?? 'مشرف', {
      url,
      name: file.name,
      size: file.size,
      type,
    });
    e.target.value = '';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const handleStatusChange = (newStatus: LiveChatStatus) => {
    if (!selectedId || !selected) return;
    if (newStatus === selected.status) return;
    if (newStatus === 'resolved') {
      resolveLiveChat(selectedId);
    } else if (newStatus === 'closed') {
      closeLiveChat(selectedId);
    } else if (newStatus === 'assigned') {
      assignLiveChat(selectedId, selected.assignedTo ?? user?.name ?? 'مشرف');
    } else if (newStatus === 'open') {
      useAdminStore.setState((s) => ({
        liveChatConversations: s.liveChatConversations.map((c) =>
          c.id === selectedId ? { ...c, status: 'open' } : c
        ),
      }));
    }
  };

  const formatMsgTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('ar-u-nu-latn', { hour: '2-digit', minute: '2-digit' });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ar-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex gap-3 h-[calc(100vh-73px)] p-3">
      {/* ====== Right Panel: Conversation List ====== */}
      <div className="w-[340px] lg:w-[380px] flex flex-col bg-background shrink-0 rounded-xl border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-bold">المحادثات</h2>
        </div>

        {/* Search + Filter */}
        <div className="px-3 py-2 border-b space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن محادثة..."
                className="pr-9 h-9 text-sm bg-muted/50 border"
              />
            </div>
          </div>

          {/* Sort + Filter */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
                <SelectTrigger className="h-8 w-auto border bg-background text-xs gap-1.5 rounded-lg px-2.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="open">جديدة</SelectItem>
                  <SelectItem value="assigned">قيد المعالجة</SelectItem>
                  <SelectItem value="resolved">تم الحل</SelectItem>
                  <SelectItem value="closed">مغلقة</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground">{filtered.length}</span> محادثة
              </span>
            </div>
            <Select value={sort} onValueChange={(v) => setSort(v as 'newest' | 'oldest' | 'unread')}>
              <SelectTrigger className="h-8 w-auto border bg-background text-xs gap-1.5 rounded-lg px-2.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="newest">الأحدث أولاً</SelectItem>
                <SelectItem value="oldest">الأقدم أولاً</SelectItem>
                <SelectItem value="unread">غير المقروءة أولاً</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Conversation list */}
        <ScrollArea className="flex-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <MessageCircle className="h-10 w-10 mb-2 opacity-40" />
              <p className="text-sm">لا توجد محادثات</p>
            </div>
          ) : (
            <div>
              {filtered.map((conv) => {
                const visibleMsgs = conv.messages.filter(m => m.sender !== 'note');
                const lastMsg = visibleMsgs[visibleMsgs.length - 1];
                const cfg = statusConfig[conv.status];
                const isActive = conv.id === selectedId;
                const unread = conv.unreadCount;

                return (
                  <button
                    key={conv.id}
                    onClick={() => { setSelectedId(conv.id); setShowDetails(false); if (conv.unreadCount > 0) markConversationRead(conv.id); }}
                    className={cn(
                      'w-full text-right px-3 py-3 transition-colors border-b border-border/40 hover:bg-muted/50',
                      isActive && 'bg-primary/5 border-r-[3px] border-r-primary'
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Avatar */}
                      <div className={cn(
                        'h-10 w-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm',
                        avatarColor(conv.visitorName)
                      )}>
                        {initials(conv.visitorName)}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Name row */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-semibold text-sm truncate">{conv.visitorName}</span>
                            {conv.status === 'assigned' && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800 shrink-0">
                                محولة
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[11px] text-muted-foreground">{timeAgo(conv.lastMessageAt)}</span>
                            <div className={cn('h-2 w-2 rounded-full', cfg.dotColor)} />
                          </div>
                        </div>

                        {/* Last message - max 2 lines */}
                        {lastMsg && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{lastMsg.content}</p>
                        )}

                        {/* Unread badge */}
                        <div className="flex items-center justify-between mt-1.5">
                          <div />
                          {unread > 0 && (
                            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold">
                              {unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* ====== Middle Panel: Chat Area ====== */}
      <div className="flex-1 flex flex-col min-w-0 bg-background rounded-xl border shadow-sm overflow-hidden">
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
            <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <MessageCircle className="h-10 w-10 opacity-40" />
            </div>
            <p className="text-lg font-medium">اختر محادثة للبدء</p>
            <p className="text-sm mt-1">اختر محادثة من القائمة لعرض الرسائل</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b bg-background">
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0',
                  avatarColor(selected.visitorName)
                )}>
                  {initials(selected.visitorName)}
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-sm">{selected.visitorName}</span>
                  <span className="text-xs text-muted-foreground block">
                    {channelConfig[selected.channel]?.label}
                    {selected.assignedTo && ` · ${selected.assignedTo}`}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Status dropdown */}
                <Select value={selected.status} onValueChange={(v) => handleStatusChange(v as LiveChatStatus)}>
                  <SelectTrigger className={cn('h-7 w-auto border-0 text-xs gap-1 px-2.5 py-0.5 rounded-full shadow-none font-medium', statusConfig[selected.status].color)}>
                    <div className={cn('h-1.5 w-1.5 rounded-full', statusConfig[selected.status].dotColor)} />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">جديدة</SelectItem>
                    <SelectItem value="assigned">قيد المعالجة</SelectItem>
                    <SelectItem value="resolved">تم الحل</SelectItem>
                    <SelectItem value="closed">مغلقة</SelectItem>
                  </SelectContent>
                </Select>

                {/* Action icons */}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowAssignDialog(true)} title="تعيين لموظف">
                  <User className="h-4 w-4" />
                </Button>
                {selected.status !== 'resolved' && selected.status !== 'closed' && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={() => resolveLiveChat(selected.id)} title="تم الحل">
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                )}

                {/* Toggle details — hidden while details panel is already open */}
                {!showDetails && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowDetails(true)} title="عرض التفاصيل">
                    <PanelRightOpen className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Messages area */}
            <ScrollArea className="flex-1 bg-[#f8f9fa] dark:bg-muted/10">
              <div className="px-4 py-4 space-y-4 max-w-3xl mx-auto">
                {selected.messages.map((msg, msgIdx) => {
                  const prevMsg = msgIdx > 0 ? selected.messages[msgIdx - 1] : null;
                  const msgDate = new Date(msg.timestamp).toDateString();
                  const prevDate = prevMsg ? new Date(prevMsg.timestamp).toDateString() : null;
                  const showDateSep = msgIdx === 0 || msgDate !== prevDate;

                  const isVisitor = msg.sender === 'visitor';
                  const isNote = msg.sender === 'note';

                  const dateSeparator = showDateSep ? (
                    <div className="flex items-center justify-center">
                      <span className="text-[11px] text-muted-foreground bg-muted/80 dark:bg-muted px-3 py-1 rounded-full">
                        {getDateLabel(msg.timestamp)}
                      </span>
                    </div>
                  ) : null;

                  if (isNote) {
                    return (
                      <React.Fragment key={msg.id}>
                        {dateSeparator}
                        <div className={cn('flex gap-2 items-end', 'justify-start')}>
                          <div className={cn(
                            'h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mb-1',
                            avatarColor(msg.senderName)
                          )}>
                            {initials(msg.senderName)}
                          </div>
                          <div className="max-w-[65%]">
                            <div className="rounded-2xl rounded-tl-md px-4 py-2.5 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/80 dark:from-amber-900/30 dark:to-amber-800/20 border border-amber-200/40 dark:border-amber-700/30">
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                              <div className="flex items-center gap-1.5 mt-1.5 justify-start">
                                <span className="text-[10px] text-muted-foreground">{msg.senderName}</span>
                                <span className="text-[10px] text-muted-foreground">·</span>
                                <span className="text-[10px] text-muted-foreground">{formatMsgTime(msg.timestamp)}</span>
                                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">· ملاحظة داخلية</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  }

                  return (
                    <React.Fragment key={msg.id}>
                      {dateSeparator}
                      <div className={cn('flex gap-2 items-end', isVisitor ? 'justify-end' : 'justify-start')}>
                        {!isVisitor && (
                          <div className={cn(
                            'h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mb-1',
                            avatarColor(msg.senderName)
                          )}>
                            {initials(msg.senderName)}
                          </div>
                        )}

                        <div className={cn('max-w-[65%]')}>
                          <div
                            className={cn(
                              'rounded-2xl px-4 py-2.5 shadow-sm',
                              isVisitor
                                ? 'bg-white dark:bg-card border border-border/60 rounded-tr-md'
                                : 'bg-gradient-to-br from-purple-50 to-purple-100/80 dark:from-purple-900/30 dark:to-purple-800/20 border border-purple-200/40 dark:border-purple-700/30 rounded-tl-md'
                          )}
                          >
                            {msg.messageType === 'image' ? (
                              <img src={msg.content} alt={msg.fileName ?? 'صورة'} className="rounded-lg max-w-full max-h-60 object-cover cursor-pointer" onClick={() => window.open(msg.content, '_blank')} />
                            ) : msg.messageType === 'file' ? (
                              <a href={msg.content} download={msg.fileName} className="flex items-center gap-3 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                  <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium truncate">{msg.fileName}</p>
                                  <p className="text-[11px] text-muted-foreground">{formatFileSize(msg.fileSize ?? 0)}</p>
                                </div>
                                <Download className="h-4 w-4 text-muted-foreground shrink-0" />
                              </a>
                            ) : (
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            )}
                            <div className={cn(
                              'flex items-center gap-1.5 mt-1.5',
                              isVisitor ? 'justify-start' : 'justify-start'
                            )}>
                              <span className="text-[10px] text-muted-foreground">{msg.senderName}</span>
                              <span className="text-[10px] text-muted-foreground">·</span>
                              <span className="text-[10px] text-muted-foreground">{formatMsgTime(msg.timestamp)}</span>
                            </div>
                          </div>
                        </div>

                        {isVisitor && (
                          <div className={cn(
                            'h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mb-1',
                            avatarColor(selected.visitorName)
                          )}>
                            {initials(selected.visitorName)}
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Compose area */}
            <div className="border-t bg-background">
              {/* Tabs */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('message')}
                  className={cn(
                    'px-4 py-2 text-sm font-medium transition-colors relative',
                    activeTab === 'message'
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  رسالة
                  {activeTab === 'message' && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 bg-primary rounded-t" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('note')}
                  className={cn(
                    'px-4 py-2 text-sm font-medium transition-colors relative',
                    activeTab === 'note'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  ملاحظة
                  {activeTab === 'note' && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-500 rounded-t" />
                  )}
                </button>
              </div>

              {/* Input area */}
              <div className={cn('px-4 py-3', activeTab === 'note' && 'bg-amber-50/50 dark:bg-amber-900/10')}>
                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    autoResize(e.target);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={activeTab === 'message' ? 'اكتب ردك هنا...' : 'اكتب ملاحظة داخلية (مرئية فقط للموظفين)...'}
                  rows={1}
                  className="w-full border-0 shadow-none bg-transparent px-0 text-sm leading-6 resize-none focus:outline-none focus-visible:ring-0 overflow-hidden"
                  style={{ minHeight: '2rem', maxHeight: '10rem' }}
                />
              </div>

              {/* Toolbar */}
              <div className={cn('flex items-center justify-between px-3 py-2 border-t border-border/40', activeTab === 'note' && 'bg-amber-50/30 dark:bg-amber-900/5')}>
                {activeTab === 'message' ? (
                  <div className="flex items-center gap-1">
                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleAttachment(e, 'image')} />
                    <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar" className="hidden" onChange={(e) => handleAttachment(e, 'file')} />
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="إرفاق صورة" onClick={() => imageInputRef.current?.click()}>
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="إرفاق ملف" onClick={() => fileInputRef.current?.click()}>
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div />
                )}
                <Button
                  size="sm"
                  onClick={handleSend}
                  disabled={!draft.trim()}
                  className={cn('gap-1.5 rounded-lg h-9 px-5', activeTab === 'note' && 'bg-amber-500 hover:bg-amber-600')}
                >
                  {activeTab === 'note' ? 'حفظ ملاحظة' : 'إرسال'}
                  {activeTab === 'note' ? <StickyNote className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ====== Left Panel: Details Sidebar ====== */}
      {selected && showDetails && (
        <div className="w-[300px] lg:w-[320px] flex flex-col bg-background shrink-0 rounded-xl border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-bold text-sm">التفاصيل</h3>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowDetails(false)}>
              <PanelRightClose className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-5">
              {/* Contact card */}
              <div className="flex flex-col items-center text-center pb-4 border-b">
                <div className={cn(
                  'h-16 w-16 rounded-full flex items-center justify-center font-bold text-xl mb-3',
                  avatarColor(selected.visitorName)
                )}>
                  {initials(selected.visitorName)}
                </div>
                <h4 className="font-bold text-base">{selected.visitorName}</h4>
                {selected.visitorEmail && (
                  <p className="text-xs text-muted-foreground mt-1">{selected.visitorEmail}</p>
                )}
                <button
                  type="button"
                  className="text-xs text-primary hover:underline mt-0.5 cursor-pointer"
                  onClick={() => navigate(`/clients/${selected.clientId}`)}
                >
                  {clientMap[selected.clientId] || '—'}
                </button>
              </div>

              {/* Client Plan / Subscription */}
              {(() => {
                const client = clients.find((c) => c.id === selected.clientId);
                const plan = client?.planId ? plans.find((p) => p.id === client.planId) : null;
                const sub = subscriptions.find((s) => s.clientId === selected.clientId && s.status !== 'cancelled');
                const statusLabel: Record<string, { label: string; class: string }> = {
                  trial: { label: 'فترة تجريبية', class: 'bg-info/15 text-info' },
                  active: { label: 'نشط', class: 'bg-success/15 text-success' },
                  past_due: { label: 'متأخر', class: 'bg-warning/15 text-warning' },
                  suspended: { label: 'موقوف', class: 'bg-danger/15 text-danger' },
                  cancelled: { label: 'ملغي', class: 'bg-muted text-muted-foreground' },
                };
                const clientStatus = client ? statusLabel[client.status] : null;
                return client ? (
                  <div className="border-b pb-4 space-y-2.5">
                    <h5 className="text-xs font-semibold text-muted-foreground">معلومات الاشتراك</h5>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">الباقة</span>
                      <span className="text-sm font-medium">{plan?.nameAr ?? 'بدون باقة'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">حالة العميل</span>
                      {clientStatus && (
                        <Badge className={cn('text-[10px] px-2 py-0.5 border-transparent', clientStatus.class)}>
                          {clientStatus.label}
                        </Badge>
                      )}
                    </div>
                    {sub && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">الدورة</span>
                        <span className="text-xs">{sub.billingCycle === 'monthly' ? 'شهري' : 'سنوي'}</span>
                      </div>
                    )}
                  </div>
                ) : null;
              })()}

              {/* Assignment */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">الموظف المسؤول</span>
                  <div className="flex items-center gap-1.5">
                    {selected.assignedTo ? (
                      <>
                        <div className={cn(
                          'h-5 w-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold',
                          avatarColor(selected.assignedTo)
                        )}>
                          {initials(selected.assignedTo)}
                        </div>
                        <span className="text-sm font-medium">{selected.assignedTo}</span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">غير معين</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">القسم</span>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm">خدمة العملاء</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">الحالة</span>
                  <Badge className={cn('text-[11px] px-2 py-0.5', statusConfig[selected.status].color)}>
                    <div className={cn('h-1.5 w-1.5 rounded-full me-1', statusConfig[selected.status].dotColor)} />
                    {statusConfig[selected.status].label}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">القناة</span>
                  <div className="flex items-center gap-1">
                    {(() => {
                      const ChIcon = channelConfig[selected.channel]?.icon ?? MessageCircle;
                      return <ChIcon className={cn('h-3.5 w-3.5', channelConfig[selected.channel]?.color)} />;
                    })()}
                    <span className="text-sm">{channelConfig[selected.channel]?.label}</span>
                  </div>
                </div>
              </div>

              {/* Tags (read-only) */}
              <div className="border-t pt-4">
                <span className="text-xs text-muted-foreground">الوسوم</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge variant="secondary" className="text-[11px] rounded-md">
                    {channelConfig[selected.channel]?.label}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-4 space-y-2">
                {(selected.status === 'open' || !selected.assignedTo) && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full h-9 text-xs"
                    onClick={() => setShowAssignDialog(true)}
                  >
                    <User className="h-3.5 w-3.5 me-1.5" />
                    تعيين لموظف
                  </Button>
                )}
                {selected.status !== 'resolved' && selected.status !== 'closed' && (
                  <Button
                    size="sm"
                    className="w-full h-9 text-xs"
                    onClick={() => resolveLiveChat(selected.id)}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 me-1.5" />
                    تم الحل
                  </Button>
                )}
              </div>


              {/* Conversation info */}
              <div className="border-t pt-4 space-y-3">
                <h5 className="text-xs font-semibold text-muted-foreground">خصائص المحادثة</h5>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      المعرّف
                    </span>
                    <span className="text-xs font-mono">#{selected.id.replace('lc_', '').padStart(4, '0')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      بدأت
                    </span>
                    <span className="text-xs">{formatDate(selected.startedAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      الرسائل
                    </span>
                    <span className="text-xs">{selected.messages.filter(m => m.sender !== 'note').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>تعيين لموظف</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 pt-2">
            {adminUsers
              .filter((a) => a.active && a.name !== selected?.assignedTo)
              .map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => {
                    if (selectedId) assignLiveChat(selectedId, agent.name);
                    setShowAssignDialog(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/70 transition-colors text-start"
                >
                  <div className={cn(
                    'h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0',
                    avatarColor(agent.name)
                  )}>
                    {initials(agent.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.email}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {agent.role === 'super_admin' ? 'مدير عام' : agent.role === 'admin' ? 'مدير' : agent.role === 'support' ? 'دعم' : 'مالية'}
                  </Badge>
                </button>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
