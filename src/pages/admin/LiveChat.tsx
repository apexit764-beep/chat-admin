import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Send, MessageCircle, Globe, Phone, CheckCircle2, Circle, User, ArrowLeft } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { useAuthStore } from '@/store/useAuthStore';
import { timeAgo } from '@/utils/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { LiveChatConversation, LiveChatStatus } from '@/types';

const statusConfig: Record<LiveChatStatus, { label: string; color: string; dot: string }> = {
  open: { label: 'مفتوحة', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', dot: 'bg-green-500' },
  assigned: { label: 'قيد المعالجة', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' },
  resolved: { label: 'تم الحل', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', dot: 'bg-gray-400' },
  closed: { label: 'مغلقة', color: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500', dot: 'bg-gray-300' },
};

const channelIcon = (channel: 'widget' | 'whatsapp' | 'email') => {
  switch (channel) {
    case 'whatsapp':
      return <Phone className="h-3.5 w-3.5 text-green-600" />;
    case 'email':
      return <Globe className="h-3.5 w-3.5 text-blue-500" />;
    default:
      return <MessageCircle className="h-3.5 w-3.5 text-primary" />;
  }
};

type FilterStatus = 'all' | 'open' | 'assigned' | 'resolved';

export default function LiveChat() {
  const { liveChatConversations, clients, assignLiveChat, resolveLiveChat, sendLiveChatMessage } = useAdminStore();
  const user = useAuthStore((s) => s.user);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [draft, setDraft] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const clientMap = useMemo(() => {
    const map: Record<string, string> = {};
    clients.forEach((c) => {
      map[c.id] = c.companyName;
    });
    return map;
  }, [clients]);

  const filtered = useMemo(() => {
    let list = [...liveChatConversations];

    if (filter !== 'all') {
      list = list.filter((c) => c.status === filter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.visitorName.toLowerCase().includes(q) ||
          (c.visitorEmail && c.visitorEmail.toLowerCase().includes(q)) ||
          (clientMap[c.clientId] || '').toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    return list;
  }, [liveChatConversations, filter, search, clientMap]);

  const selected = useMemo(
    () => liveChatConversations.find((c) => c.id === selectedId) ?? null,
    [liveChatConversations, selectedId]
  );

  // Stats
  const stats = useMemo(() => {
    const open = liveChatConversations.filter((c) => c.status === 'open').length;
    const assigned = liveChatConversations.filter((c) => c.status === 'assigned').length;
    const resolved = liveChatConversations.filter((c) => c.status === 'resolved').length;
    return { open, assigned, resolved, total: liveChatConversations.length };
  }, [liveChatConversations]);

  // Scroll to bottom on new message or conversation change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected?.messages.length, selectedId]);

  const handleSend = () => {
    if (!draft.trim() || !selectedId) return;
    sendLiveChatMessage(selectedId, draft.trim(), user?.name ?? 'مشرف');
    setDraft('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filters: { key: FilterStatus; label: string }[] = [
    { key: 'all', label: 'الكل' },
    { key: 'open', label: 'مفتوحة' },
    { key: 'assigned', label: 'قيد المعالجة' },
    { key: 'resolved', label: 'تم الحل' },
  ];

  const formatMsgTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-[calc(100vh-73px)]">
      {/* Stats row */}
      <div className="flex items-center gap-4 px-4 py-2.5 border-b bg-card">
        <StatMini label="محادثات مفتوحة" value={stats.open} color="text-green-600" />
        <StatMini label="قيد المعالجة" value={stats.assigned} color="text-blue-600" />
        <StatMini label="تم الحل" value={stats.resolved} color="text-gray-500" />
        <StatMini label="إجمالي اليوم" value={stats.total} color="text-foreground" />
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Right panel — Conversation list */}
        <div className="w-80 lg:w-96 border-l flex flex-col bg-card">
          {/* Search */}
          <div className="p-3 border-b space-y-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث بالاسم أو البريد..."
                className="pr-9"
              />
            </div>
            {/* Filter chips */}
            <div className="flex gap-1.5">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    'px-2.5 py-1 text-xs rounded-full transition-colors',
                    filter === f.key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {f.label}
                </button>
              ))}
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
              <div className="divide-y">
                {filtered.map((conv) => (
                  <ConversationCard
                    key={conv.id}
                    conv={conv}
                    clientName={clientMap[conv.clientId] || '—'}
                    isSelected={conv.id === selectedId}
                    onClick={() => setSelectedId(conv.id)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Left panel — Chat view */}
        <div className="flex-1 flex flex-col min-w-0">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <MessageCircle className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg">اختر محادثة للبدء</p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-card">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="h-4.5 w-4.5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate">{selected.visitorName}</span>
                      <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0', statusConfig[selected.status].color)}>
                        {statusConfig[selected.status].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {selected.visitorEmail && <span>{selected.visitorEmail}</span>}
                      {selected.visitorEmail && <span>·</span>}
                      <span>{clientMap[selected.clientId] || '—'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(selected.status === 'open' || !selected.assignedTo) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => assignLiveChat(selected.id, user?.name ?? 'مشرف')}
                    >
                      تعيين لي
                    </Button>
                  )}
                  {selected.status !== 'resolved' && selected.status !== 'closed' && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => resolveLiveChat(selected.id)}
                    >
                      <CheckCircle2 className="h-4 w-4 ml-1" />
                      تم الحل
                    </Button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 px-4 py-4">
                <div className="space-y-3 max-w-3xl mx-auto">
                  {selected.messages.map((msg) => {
                    const isVisitor = msg.sender === 'visitor';
                    return (
                      <div
                        key={msg.id}
                        className={cn('flex', isVisitor ? 'justify-end' : 'justify-start')}
                      >
                        <div
                          className={cn(
                            'max-w-[70%] rounded-2xl px-4 py-2.5',
                            isVisitor
                              ? 'bg-muted text-foreground rounded-br-md'
                              : 'bg-primary text-primary-foreground rounded-bl-md'
                          )}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          <p
                            className={cn(
                              'text-[10px] mt-1',
                              isVisitor ? 'text-muted-foreground' : 'text-primary-foreground/70'
                            )}
                          >
                            {formatMsgTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Compose bar */}
              <div className="border-t bg-card px-4 py-3">
                <div className="flex items-center gap-2 max-w-3xl mx-auto">
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="اكتب رداً..."
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!draft.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function StatMini({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn('text-lg font-bold', color)}>{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function ConversationCard({
  conv,
  clientName,
  isSelected,
  onClick,
}: {
  conv: LiveChatConversation;
  clientName: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const lastMsg = conv.messages[conv.messages.length - 1];
  const cfg = statusConfig[conv.status];

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-right px-3 py-3 transition-colors hover:bg-muted/50',
        isSelected && 'bg-primary/10 border-r-2 border-primary'
      )}
    >
      <div className="flex items-start gap-2.5">
        {/* Avatar placeholder */}
        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-sm truncate">{conv.visitorName}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              {channelIcon(conv.channel)}
              <div className={cn('h-2 w-2 rounded-full', cfg.dot)} />
            </div>
          </div>

          <p className="text-xs text-muted-foreground truncate mt-0.5">{clientName}</p>

          {lastMsg && (
            <p className="text-xs text-muted-foreground/80 truncate mt-1">{lastMsg.content}</p>
          )}

          <p className="text-[10px] text-muted-foreground/60 mt-1">{timeAgo(conv.lastMessageAt)}</p>
        </div>
      </div>
    </button>
  );
}
