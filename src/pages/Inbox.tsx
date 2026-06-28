import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  Send,
  Bookmark,
  Smile,
  Paperclip,
  Image as ImageIcon,
  Sparkles,
  Check,
  CheckCheck,
  ArrowRight,
  MoreHorizontal,
  X,
  Download,
  Share2,
  MessageSquarePlus,
  Edit2,
  PauseCircle,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  Plus,
  Phone,
  MapPin,
  Clock as ClockIcon,
  Monitor,
  Globe,
  FileText,
} from 'lucide-react';
import {
  Avatar,
  ChannelIcon,
  EmojiPicker,
  Input,
  Modal,
  Select,
  useConfirm,
} from '@components/ui';
import { useDataStore } from '@/store/useDataStore';
import { useUIStore } from '@/store/useUIStore';
import { useInboxStore } from '@/store/useInboxStore';
import { contactTypeLabel } from '@/utils/labels';
import { formatPhone, formatTime, timeAgo } from '@/utils/format';
import { downloadCsv } from '@/utils/csv';
import { cn } from '@/utils/cn';
import type { Conversation, ConversationStatus } from '@/types';

export default function Inbox(): JSX.Element {
  const conversations = useDataStore((s) => s.conversations);
  const contacts = useDataStore((s) => s.contacts);
  const agents = useDataStore((s) => s.agents);
  const currentUserId = useDataStore((s) => s.currentUserId);
  const sendMessage = useDataStore((s) => s.sendMessage);
  const sendAttachment = useDataStore((s) => s.sendAttachment);
  const setStatus = useDataStore((s) => s.setConversationStatus);
  const assign = useDataStore((s) => s.assignConversation);
  const markRead = useDataStore((s) => s.markConversationRead);
  const templates = useDataStore((s) => s.templates);
  const departments = useDataStore((s) => s.departments);
  const channels = useDataStore((s) => s.channels);
  const bookmarkedConvIds = useDataStore((s) => s.bookmarkedConvIds);
  const toggleBookmark = useDataStore((s) => s.toggleBookmark);
  const showToast = useUIStore((s) => s.showToast);
  const { confirm } = useConfirm();
  const view = useInboxStore((s) => s.view);
  const selectedId = useInboxStore((s) => s.selectedId);
  const setSelectedId = useInboxStore((s) => s.setSelectedId);
  const selectedChannelId = useInboxStore((s) => s.selectedChannelId);
  const selectedDepartmentId = useInboxStore((s) => s.selectedDepartmentId);

  const selectedChannel = selectedChannelId ? channels.find((c) => c.id === selectedChannelId) : null;
  const selectedDepartment = selectedDepartmentId ? departments.find((d) => d.id === selectedDepartmentId) : null;

  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showChatMobile, setShowChatMobile] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [newConvOpen, setNewConvOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return conversations
      .filter((c) => {
        if (selectedChannelId && c.channelId !== selectedChannelId) return false;
        if (selectedDepartmentId && c.departmentId !== selectedDepartmentId) return false;
        return true;
      })
      .filter((c) => {
        if (view === 'mine') return c.assignedTo === currentUserId && c.status !== 'closed';
        if (view === 'unassigned') return c.assignedTo === null;
        if (view === 'closed') return c.status === 'closed';
        if (view === 'vip') {
          const contact = contacts.find((x) => x.id === c.contactId);
          return contact?.type === 'vip';
        }
        if (view === 'today') {
          const d = new Date(c.lastMessageAt);
          const today = new Date();
          return d.toDateString() === today.toDateString();
        }
        return true;
      })
      .filter((c) => {
        if (!search) return true;
        const contact = contacts.find((x) => x.id === c.contactId);
        return contact?.name.includes(search) || contact?.phone.includes(search) || c.lastMessage.includes(search);
      })
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  }, [conversations, contacts, view, search, currentUserId, selectedChannelId, selectedDepartmentId]);

  useEffect(() => {
    if (!selectedId || !filtered.find((c) => c.id === selectedId)) {
      setSelectedId(filtered[0]?.id ?? null);
    }
  }, [filtered, selectedId, setSelectedId]);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;
  const selectedContact = selected ? contacts.find((c) => c.id === selected.contactId) : null;
  const isBookmarked = selected ? bookmarkedConvIds.has(selected.id) : false;

  useEffect(() => {
    if (selectedId && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selected?.messages.length, selectedId]);

  useEffect(() => {
    if (selectedId) markRead(selectedId);
  }, [selectedId, markRead]);

  const handleSend = (): void => {
    if (!draft.trim() || !selected) return;
    sendMessage(selected.id, draft.trim());
    setDraft('');
    showToast('تم إرسال الرسالة', 'success');
  };

  const closeConversation = async (): Promise<void> => {
    if (!selected) return;
    const ok = await confirm({
      title: 'إغلاق المحادثة؟',
      message: 'سيتم وضع علامة "محلولة" على المحادثة. يمكن إعادة فتحها لاحقاً',
      variant: 'info',
      confirmText: 'إغلاق',
    });
    if (ok) {
      setStatus(selected.id, 'closed');
      showToast('تم إغلاق المحادثة', 'success');
    }
  };

  const insertTemplate = (body: string): void => {
    if (!selectedContact) return;
    const filled = body.replace(/{{اسم_العميل}}/g, selectedContact.name)
      .replace(/{{التاريخ}}/g, new Date().toLocaleDateString('ar-OM'))
      .replace(/{{رقم_الطلب}}/g, '12345');
    setDraft(filled);
    setShowTemplates(false);
  };

  const handleDownloadConv = (): void => {
    if (!selected || !selectedContact) return;
    downloadCsv(
      `conv-${selectedContact.name}-${new Date().toISOString().slice(0, 10)}.csv`,
      selected.messages.map((m) => ({
        'الاتجاه': m.direction === 'in' ? 'وارد' : 'صادر',
        'النوع': m.type,
        'النص': m.content,
        'الوقت': new Date(m.timestamp).toLocaleString('ar-OM'),
        'مقروء': m.read ? 'نعم' : 'لا',
      }))
    );
    showToast(`تم تحميل ${selected.messages.length} رسالة`, 'success');
    setMenuOpen(false);
  };

  const handlePauseConv = (): void => {
    if (!selected) return;
    setStatus(selected.id, 'pending');
    showToast('تم تعليق المحادثة', 'info');
    setMenuOpen(false);
  };

  const handlePickFile = (e: React.ChangeEvent<HTMLInputElement>, kind: 'image' | 'document'): void => {
    const file = e.target.files?.[0];
    if (!file || !selected) return;
    sendAttachment(selected.id, kind, file.name);
    showToast(`تم إرفاق: ${file.name}`, 'success');
    e.target.value = '';
  };

  return (
    <div className="h-[calc(100vh-56px)] flex bg-bg-light dark:bg-bg-dark overflow-hidden">
      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt" onChange={(e) => handlePickFile(e, 'document')} />
      <input ref={imageInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handlePickFile(e, 'image')} />

      {/* Conversations list */}
      <aside
        className={cn(
          'w-full lg:w-[320px] flex-shrink-0 bg-white dark:bg-surface-dark border-s border-border-light dark:border-border-dark flex flex-col',
          showChatMobile && 'hidden lg:flex'
        )}
      >
        <div className="p-3 border-b border-border-light dark:border-border-dark space-y-2">
          {(selectedChannel || selectedDepartment) && (
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-primary/5 border border-primary/20">
              {selectedChannel && <ChannelIcon type={selectedChannel.type} size={12} />}
              {selectedDepartment && <span className="h-3 w-3 rounded-full" style={{ background: selectedDepartment.color }} />}
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-muted-light dark:text-muted-dark">{selectedChannel ? 'القناة' : 'القسم'}</p>
                <p className="text-small font-semibold truncate">{selectedChannel?.name ?? selectedDepartment?.name}</p>
              </div>
              <span className="text-small text-muted-light dark:text-muted-dark">{filtered.length}</span>
            </div>
          )}
          <div className="relative">
            <Search className="h-4 w-4 absolute end-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark" />
            <input
              type="text"
              placeholder="ابحث عن محادثة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 ps-3 pe-9 rounded-full bg-bg-light dark:bg-bg-dark border border-transparent text-small focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border-light dark:divide-border-dark">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-light dark:text-muted-dark">
              <p className="text-body">لا توجد محادثات</p>
            </div>
          )}
          {filtered.map((conv) => {
            const contact = contacts.find((c) => c.id === conv.contactId);
            if (!contact) return null;
            const agent = conv.assignedTo ? agents.find((a) => a.id === conv.assignedTo) : null;
            const convChannel = channels.find((c) => c.id === conv.channelId);
            const isSelected = selectedId === conv.id;
            const isConvBookmarked = bookmarkedConvIds.has(conv.id);
            return (
              <button
                key={conv.id}
                onClick={() => {
                  setSelectedId(conv.id);
                  setShowChatMobile(true);
                }}
                className={cn(
                  'w-full text-start flex gap-3 p-3 transition-colors hover:bg-bg-light dark:hover:bg-bg-dark',
                  isSelected && 'bg-primary/5'
                )}
              >
                <div className="relative flex-shrink-0">
                  <Avatar name={contact.name} size="md" />
                  {convChannel && (
                    <span className="absolute -bottom-1 -end-1 ring-2 ring-white dark:ring-surface-dark rounded-lg">
                      <ChannelIcon type={convChannel.type} size={10} className="!h-5 !w-5" />
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <div className="flex items-center gap-1 min-w-0">
                      {isConvBookmarked && <Bookmark className="h-3 w-3 text-warning fill-current flex-shrink-0" />}
                      <p className="text-body font-semibold truncate">{contact.name}</p>
                    </div>
                    <span className="text-[10px] text-muted-light dark:text-muted-dark flex-shrink-0">
                      {timeAgo(conv.lastMessageAt)}
                    </span>
                  </div>
                  <p className="text-small text-muted-light dark:text-muted-dark truncate">{conv.lastMessage}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {conv.status === 'closed' ? (
                      <span className="text-[10px] font-medium text-success">● محلولة</span>
                    ) : conv.status === 'new' ? (
                      <span className="bg-primary text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">جديد</span>
                    ) : (
                      <span className="text-[10px] font-medium text-warning">● قيد المعالجة</span>
                    )}
                    {convChannel && !selectedChannelId && (
                      <span className="text-[10px] text-muted-light dark:text-muted-dark truncate max-w-[80px]">
                        {convChannel.name}
                      </span>
                    )}
                    {agent && (
                      <span className="text-[10px] text-muted-light dark:text-muted-dark ms-1">
                        {agent.name.split(' ')[0]}
                      </span>
                    )}
                    {conv.unreadCount > 0 && (
                      <span className="ms-auto bg-danger text-white text-[10px] font-bold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Chat area */}
      <section
        className={cn(
          'flex-1 flex flex-col min-w-0 bg-white dark:bg-surface-dark border-s border-border-light dark:border-border-dark',
          !showChatMobile && 'hidden lg:flex'
        )}
      >
        {!selected || !selectedContact ? (
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <div>
              <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Search className="h-7 w-7" />
              </div>
              <p className="text-h3 font-semibold">اختر محادثة للبدء</p>
              <p className="text-body text-muted-light dark:text-muted-dark mt-1">
                ابحث في القائمة على اليمين أو ابدأ محادثة جديدة
              </p>
              <button
                onClick={() => setNewConvOpen(true)}
                className="mt-4 h-10 px-5 rounded-full bg-primary hover:bg-primary-dark text-white text-small font-medium inline-flex items-center gap-2"
              >
                <MessageSquarePlus className="h-4 w-4" />
                محادثة جديدة
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Chat topbar */}
            <div className="h-[56px] flex items-center px-4 gap-3 border-b border-border-light dark:border-border-dark flex-shrink-0">
              <button
                onClick={() => setShowChatMobile(false)}
                className="lg:hidden text-muted-light dark:text-muted-dark p-1.5"
                aria-label="رجوع"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
              <Avatar name={selectedContact.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-body font-semibold truncate">{selectedContact.name}</p>
                <div className="flex items-center gap-1.5">
                  {(() => {
                    const ch = channels.find((c) => c.id === selected.channelId);
                    return ch ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-light dark:text-muted-dark">
                        <ChannelIcon type={ch.type} size={10} className="!h-4 !w-4" />
                        <span className="truncate max-w-[140px]">{ch.name}</span>
                        <span className="text-muted-light dark:text-muted-dark">·</span>
                      </span>
                    ) : null;
                  })()}
                  <span className="text-[11px] text-muted-light dark:text-muted-dark truncate">
                    {formatPhone(selectedContact.phone)}
                  </span>
                </div>
              </div>

              <select
                value={selected.status}
                onChange={(e) => { setStatus(selected.id, e.target.value as ConversationStatus); showToast('تم تحديث الحالة', 'success'); }}
                className="h-8 text-small bg-bg-light dark:bg-bg-dark border border-transparent rounded-full px-3 hidden sm:block focus:outline-none focus:border-primary"
              >
                <option value="new">جديد</option>
                <option value="pending">قيد المعالجة</option>
                <option value="closed">مغلق</option>
              </select>
              <select
                value={selected.assignedTo ?? ''}
                onChange={(e) => { assign(selected.id, e.target.value || null); showToast(e.target.value ? 'تم الإسناد' : 'تم إلغاء الإسناد', 'success'); }}
                className="h-8 text-small bg-bg-light dark:bg-bg-dark border border-transparent rounded-full px-3 hidden md:block max-w-[140px] focus:outline-none focus:border-primary"
              >
                <option value="">غير مُسند</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>

              {selected.status !== 'closed' ? (
                <button
                  onClick={closeConversation}
                  className="h-8 px-4 rounded-full bg-primary hover:bg-primary-dark text-white text-small font-medium transition-colors"
                >
                  إغلاق
                </button>
              ) : (
                <button
                  onClick={() => { setStatus(selected.id, 'pending'); showToast('تم إعادة فتح المحادثة', 'success'); }}
                  className="h-8 px-4 rounded-full bg-success/15 text-success text-small font-medium hover:bg-success/25"
                >
                  إعادة فتح
                </button>
              )}

              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="h-8 w-8 rounded-full hover:bg-bg-light dark:hover:bg-bg-dark flex items-center justify-center text-muted-light dark:text-muted-dark"
                  aria-label="المزيد"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute end-0 mt-1 w-56 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card shadow-card-hover py-1.5 z-20">
                      <MenuItem icon={<Download className="h-4 w-4" />} label="تحميل المحادثة (CSV)" onClick={handleDownloadConv} />
                      <MenuItem icon={<Share2 className="h-4 w-4" />} label="تحويل لموظف آخر" onClick={() => { setTransferOpen(true); setMenuOpen(false); }} />
                      <MenuItem icon={<MessageSquarePlus className="h-4 w-4" />} label="محادثة جديدة" onClick={() => { setNewConvOpen(true); setMenuOpen(false); }} />
                      <MenuItem icon={<Bookmark className={cn('h-4 w-4', isBookmarked && 'fill-current text-warning')} />} label={isBookmarked ? 'إلغاء العلامة' : 'تعليم بنجمة'} onClick={() => { toggleBookmark(selected.id); showToast(isBookmarked ? 'تم إلغاء العلامة' : 'تم التعليم', 'success'); setMenuOpen(false); }} />
                      <MenuItem icon={<PauseCircle className="h-4 w-4" />} label="تعليق (قيد المعالجة)" onClick={handlePauseConv} />
                      <div className="h-px bg-border-light dark:bg-border-dark my-1" />
                      <MenuItem icon={<LayoutGrid className="h-4 w-4" />} label="فتح في نافذة منفصلة" onClick={() => { window.open(`/inbox?conv=${selected.id}`, '_blank'); setMenuOpen(false); }} />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-2 chat-scroll bg-bg-light dark:bg-bg-dark">
              {selected.messages.map((m, i) => {
                const showDate =
                  i === 0 ||
                  new Date(selected.messages[i - 1].timestamp).toDateString() !==
                    new Date(m.timestamp).toDateString();
                return (
                  <div key={m.id}>
                    {showDate && (
                      <div className="text-center my-4">
                        <span className="inline-block text-[10px] px-3 py-1 rounded-full bg-white dark:bg-surface-dark text-muted-light dark:text-muted-dark border border-border-light dark:border-border-dark">
                          {new Date(m.timestamp).toLocaleDateString('ar-OM', { day: 'numeric', month: 'long' })}
                        </span>
                      </div>
                    )}
                    <MessageBubble msg={m} />
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input toolbar */}
            <div className="p-3 border-t border-border-light dark:border-border-dark flex-shrink-0">
              {showTemplates && (
                <div className="mb-2 p-2 rounded-card bg-bg-light dark:bg-bg-dark max-h-44 overflow-y-auto">
                  <div className="flex items-center justify-between mb-1 px-1">
                    <p className="text-small font-semibold">قوالب سريعة</p>
                    <button onClick={() => setShowTemplates(false)} className="text-muted-light dark:text-muted-dark p-1">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {templates.slice(0, 6).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => insertTemplate(t.body)}
                        className="w-full text-start p-2 rounded-lg hover:bg-white dark:hover:bg-surface-dark text-small"
                      >
                        <p className="font-medium">{t.name}</p>
                        <p className="text-muted-light dark:text-muted-dark text-[11px] truncate">{t.body}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-end gap-2">
                <div className="flex items-center gap-0.5 flex-shrink-0 relative">
                  <ToolBtn
                    icon={<Bookmark className={cn('h-[18px] w-[18px]', isBookmarked && 'fill-current text-warning')} />}
                    label={isBookmarked ? 'إلغاء العلامة' : 'تعليم'}
                    onClick={() => { toggleBookmark(selected.id); showToast(isBookmarked ? 'تم الإلغاء' : 'تم التعليم', 'success'); }}
                  />
                  <ToolBtn icon={<Smile className="h-[18px] w-[18px]" />} label="رمز تعبيري" onClick={() => setShowEmoji((v) => !v)} />
                  <ToolBtn icon={<Paperclip className="h-[18px] w-[18px]" />} label="مرفق" onClick={() => fileInputRef.current?.click()} />
                  <ToolBtn icon={<ImageIcon className="h-[18px] w-[18px]" />} label="صورة" onClick={() => imageInputRef.current?.click()} />
                  <ToolBtn
                    icon={<Sparkles className="h-[18px] w-[18px]" />}
                    label="قوالب"
                    onClick={() => setShowTemplates((v) => !v)}
                  />
                  {showEmoji && (
                    <EmojiPicker
                      onPick={(emoji) => { setDraft((d) => d + emoji); }}
                      onClose={() => setShowEmoji(false)}
                      align="start"
                    />
                  )}
                </div>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="اكتب ردك هنا..."
                  rows={1}
                  className="flex-1 resize-none bg-bg-light dark:bg-bg-dark border border-transparent rounded-2xl px-3 py-2 text-body focus:outline-none focus:border-primary max-h-32"
                />
                <button
                  onClick={handleSend}
                  disabled={!draft.trim()}
                  className="h-10 px-4 rounded-full bg-primary hover:bg-primary-dark text-white text-small font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  إرسال الرد
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Details panel */}
      {selected && selectedContact && <DetailsPanel conversation={selected} />}

      {/* Transfer modal */}
      {selected && (
        <TransferModal
          open={transferOpen}
          onClose={() => setTransferOpen(false)}
          conversation={selected}
        />
      )}

      {/* New conv modal */}
      <NewConversationModal open={newConvOpen} onClose={() => setNewConvOpen(false)} />
    </div>
  );
}

function TransferModal({ open, onClose, conversation }: { open: boolean; onClose: () => void; conversation: Conversation }): JSX.Element {
  const agents = useDataStore((s) => s.agents);
  const departments = useDataStore((s) => s.departments);
  const channels = useDataStore((s) => s.channels);
  const assign = useDataStore((s) => s.assignConversation);
  const showToast = useUIStore((s) => s.showToast);
  const [target, setTarget] = useState(conversation.assignedTo ?? '');
  const [note, setNote] = useState('');

  // Eligible agents = those who have access to this channel
  const channel = channels.find((c) => c.id === conversation.channelId);
  const eligibleAgents = channel
    ? agents.filter((a) => a.channels.includes(channel.id))
    : agents;

  const submit = (): void => {
    if (!target) {
      showToast('اختر موظفاً', 'error');
      return;
    }
    assign(conversation.id, target);
    const agent = agents.find((a) => a.id === target);
    showToast(`تم تحويل المحادثة إلى ${agent?.name}`, 'success');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="تحويل المحادثة"
      size="md"
      footer={
        <>
          <button onClick={onClose} className="h-10 px-5 rounded-full border border-border-light dark:border-border-dark text-small font-medium hover:bg-bg-light dark:hover:bg-bg-dark">إلغاء</button>
          <button onClick={submit} className="h-10 px-5 rounded-full bg-primary hover:bg-primary-dark text-white text-small font-medium">تحويل</button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-small text-muted-light dark:text-muted-dark">
          الموظفون المُدرجون هم الذين لديهم وصول لـ <strong>{channel?.name}</strong>
        </p>
        <div className="space-y-1.5">
          <label className="text-small font-medium text-muted-light dark:text-muted-dark">حوّل إلى</label>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {eligibleAgents.map((a) => {
              const dept = departments.find((d) => a.departments.includes(d.id));
              return (
                <label
                  key={a.id}
                  className={cn(
                    'flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer border transition-colors',
                    target === a.id ? 'border-primary/40 bg-primary/5' : 'border-transparent bg-bg-light dark:bg-bg-dark hover:border-border-light dark:hover:border-border-dark'
                  )}
                >
                  <input type="radio" name="transferTarget" value={a.id} checked={target === a.id} onChange={() => setTarget(a.id)} className="h-4 w-4 accent-primary" />
                  <Avatar name={a.name} size="xs" status={a.status} />
                  <div className="flex-1 min-w-0">
                    <p className="text-small font-semibold">{a.name}</p>
                    <p className="text-[10px] text-muted-light dark:text-muted-dark">{dept?.name ?? a.email}</p>
                  </div>
                  {a.status === 'online' && <span className="text-[10px] text-success font-medium">متاح</span>}
                </label>
              );
            })}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-small font-medium text-muted-light dark:text-muted-dark">ملاحظة داخلية (اختياري)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="السبب أو تفاصيل للموظف..."
            className="w-full px-3 py-2 rounded-input bg-bg-light dark:bg-bg-dark border border-transparent text-body focus:outline-none focus:border-primary"
          />
        </div>
      </div>
    </Modal>
  );
}

function NewConversationModal({ open, onClose }: { open: boolean; onClose: () => void }): JSX.Element {
  const contacts = useDataStore((s) => s.contacts);
  const showToast = useUIStore((s) => s.showToast);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const submit = (): void => {
    if (!phone.trim() || !name.trim() || !message.trim()) {
      showToast('املأ كل الحقول', 'error');
      return;
    }
    showToast(`تم إرسال رسالة افتتاحية لـ ${name}`, 'success');
    setPhone(''); setName(''); setMessage('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="بدء محادثة جديدة"
      size="md"
      footer={
        <>
          <button onClick={onClose} className="h-10 px-5 rounded-full border border-border-light dark:border-border-dark text-small font-medium hover:bg-bg-light dark:hover:bg-bg-dark">إلغاء</button>
          <button onClick={submit} className="h-10 px-5 rounded-full bg-primary hover:bg-primary-dark text-white text-small font-medium flex items-center gap-2">
            <Send className="h-4 w-4" /> إرسال
          </button>
        </>
      }
    >
      <div className="space-y-3">
        <Input
          label="رقم الواتساب"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            const existing = contacts.find((c) => c.phone.includes(e.target.value.replace(/\s/g, '')));
            if (existing) setName(existing.name);
          }}
          placeholder="+96891234567"
          icon={<Phone className="h-4 w-4" />}
        />
        <Input label="اسم العميل" value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم جهة الاتصال" />
        <div className="space-y-1.5">
          <label className="text-small font-medium text-muted-light dark:text-muted-dark">نص الرسالة الأولى</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="مرحباً، أتواصل معك بخصوص..."
            className="w-full px-3 py-2 rounded-input bg-bg-light dark:bg-bg-dark border border-transparent text-body focus:outline-none focus:border-primary"
          />
        </div>
      </div>
    </Modal>
  );
}

function DetailsPanel({ conversation }: { conversation: Conversation }): JSX.Element {
  const contacts = useDataStore((s) => s.contacts);
  const agents = useDataStore((s) => s.agents);
  const conversations = useDataStore((s) => s.conversations);
  const departments = useDataStore((s) => s.departments);
  const assign = useDataStore((s) => s.assignConversation);
  const addContactTag = useDataStore((s) => s.addContactTag);
  const removeContactTag = useDataStore((s) => s.removeContactTag);
  const showToast = useUIStore((s) => s.showToast);
  const contact = contacts.find((c) => c.id === conversation.contactId);
  const [openAttrs, setOpenAttrs] = useState(true);
  const [openRecent, setOpenRecent] = useState(true);
  const [openTech, setOpenTech] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [addingTag, setAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [groupId, setGroupId] = useState<string>(conversation.departmentId ?? '');

  if (!contact) return <></>;
  const recent = conversations.filter((c) => c.contactId === contact.id && c.id !== conversation.id).slice(0, 3);

  const generateSummary = (): void => {
    setGenerating(true);
    setTimeout(() => {
      const last3 = conversation.messages.slice(-3).map((m) => m.content).join(' ');
      setSummary(
        `محادثة مع ${contact.name} (${contactTypeLabel[contact.type]}). آخر طلب: ${last3.slice(0, 120)}${last3.length > 120 ? '...' : ''}`
      );
      setGenerating(false);
      showToast('تم توليد الملخص', 'success');
    }, 700);
  };

  const handleAddTag = (): void => {
    if (!newTag.trim()) { setAddingTag(false); return; }
    addContactTag(contact.id, newTag.trim());
    showToast(`تم إضافة الوسم: ${newTag.trim()}`, 'success');
    setNewTag('');
    setAddingTag(false);
  };

  return (
    <aside className="w-[300px] flex-shrink-0 bg-white dark:bg-surface-dark border-s border-border-light dark:border-border-dark overflow-y-auto hidden xl:block">
      {/* Header */}
      <div className="p-5 text-center border-b border-border-light dark:border-border-dark">
        <Avatar name={contact.name} size="lg" className="mx-auto" />
        <p className="text-h3 font-bold mt-3">{contact.name}</p>
        <p className="text-small text-muted-light dark:text-muted-dark mt-0.5 flex items-center justify-center gap-1">
          <Phone className="h-3 w-3" />
          {formatPhone(contact.phone)}
        </p>
        <div className="flex items-center justify-center gap-3 mt-2 text-small text-muted-light dark:text-muted-dark">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            مسقط، عُمان
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />
            {new Date().toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Assignee/Group */}
      <div className="p-4 border-b border-border-light dark:border-border-dark space-y-2.5">
        <div className="space-y-1">
          <label className="text-small text-muted-light dark:text-muted-dark">المُسند إليه</label>
          <select
            value={conversation.assignedTo ?? ''}
            onChange={(e) => { assign(conversation.id, e.target.value || null); showToast(e.target.value ? 'تم الإسناد' : 'تم إلغاء الإسناد', 'success'); }}
            className="w-full h-9 px-3 rounded-lg bg-bg-light dark:bg-bg-dark border border-transparent text-small focus:outline-none focus:border-primary"
          >
            <option value="">غير مُسند</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-small text-muted-light dark:text-muted-dark">القسم</label>
          <select
            value={groupId}
            onChange={(e) => { setGroupId(e.target.value); showToast('تم تحديث القسم', 'success'); }}
            className="w-full h-9 px-3 rounded-lg bg-bg-light dark:bg-bg-dark border border-transparent text-small focus:outline-none focus:border-primary"
          >
            <option value="">بدون قسم</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div className="p-4 border-b border-border-light dark:border-border-dark">
        <p className="text-small text-muted-light dark:text-muted-dark mb-2">الوسوم</p>
        <div className="flex flex-wrap gap-1.5">
          {contact.tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-small">
              {t}
              <button
                onClick={() => { removeContactTag(contact.id, t); showToast(`تم إزالة: ${t}`, 'success'); }}
                className="hover:bg-primary/20 rounded-full p-0.5"
                aria-label={`إزالة ${t}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {addingTag ? (
            <input
              autoFocus
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onBlur={handleAddTag}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddTag(); if (e.key === 'Escape') { setAddingTag(false); setNewTag(''); } }}
              placeholder="وسم..."
              className="h-6 px-2 rounded-full bg-bg-light dark:bg-bg-dark border border-primary/30 text-small w-24 focus:outline-none focus:border-primary"
            />
          ) : (
            <button onClick={() => setAddingTag(true)} className="inline-flex items-center gap-1 text-small text-muted-light dark:text-muted-dark hover:text-primary px-2 py-0.5 rounded-full border border-dashed border-border-light dark:border-border-dark">
              <Plus className="h-3 w-3" /> إضافة
            </button>
          )}
        </div>
      </div>

      <Collapsible open={openAttrs} onToggle={() => setOpenAttrs((v) => !v)} title="خصائص المحادثة">
        <Attr label="النوع" value={contactTypeLabel[contact.type]} />
        <Attr label="المعرّف" value={`#${conversation.id}`} />
        <Attr label="بدأت" value={timeAgo(conversation.messages[0]?.timestamp ?? conversation.lastMessageAt)} />
        <Attr label="القناة" value="WhatsApp" />
        <Attr label="التصنيف" value={contactTypeLabel[contact.type]} />
        <Attr
          label="الأولوية"
          value={contact.type === 'vip' ? 'عالية' : 'عادية'}
          valueColor={contact.type === 'vip' ? 'text-danger' : undefined}
        />
      </Collapsible>

      <Collapsible open={openRecent} onToggle={() => setOpenRecent((v) => !v)} title="محادثات حديثة">
        {recent.length === 0 ? (
          <p className="text-small text-muted-light dark:text-muted-dark italic px-1">لا محادثات أخرى</p>
        ) : (
          recent.map((c) => (
            <div key={c.id} className="p-2 rounded-lg bg-bg-light dark:bg-bg-dark mb-1.5 text-small">
              <p className="line-clamp-1 font-medium">{c.lastMessage}</p>
              <p className="text-muted-light dark:text-muted-dark text-[11px] mt-0.5">{timeAgo(c.lastMessageAt)}</p>
            </div>
          ))
        )}
      </Collapsible>

      <Collapsible open={openTech} onToggle={() => setOpenTech((v) => !v)} title="معلومات تقنية">
        <Attr label="IP" value="156.220.45.12" icon={<Globe className="h-3 w-3" />} />
        <Attr label="المنصة" value="Android 14" icon={<Monitor className="h-3 w-3" />} />
        <Attr label="المتصفح" value="WhatsApp 2.24" />
      </Collapsible>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-small font-semibold">ملخص المحادثة</p>
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        {summary ? (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-small leading-relaxed">
            {summary}
          </div>
        ) : (
          <button
            onClick={generateSummary}
            disabled={generating}
            className="w-full h-9 rounded-full bg-primary hover:bg-primary-dark text-white text-small font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {generating ? (
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                توليد ملخص
              </>
            )}
          </button>
        )}
      </div>
    </aside>
  );
}

function Collapsible({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }): JSX.Element {
  return (
    <div className="border-b border-border-light dark:border-border-dark">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4 text-small font-semibold hover:bg-bg-light dark:hover:bg-bg-dark transition-colors">
        <span>{title}</span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && <div className="px-4 pb-4 space-y-1.5">{children}</div>}
    </div>
  );
}

function Attr({ label, value, valueColor, icon }: { label: string; value: string; valueColor?: string; icon?: React.ReactNode }): JSX.Element {
  return (
    <div className="flex items-center justify-between text-small">
      <span className="text-muted-light dark:text-muted-dark flex items-center gap-1.5">{icon}{label}</span>
      <span className={cn('font-medium truncate ms-2', valueColor)}>{value}</span>
    </div>
  );
}

function MenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }): JSX.Element {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-2.5 px-3 py-2 text-body hover:bg-bg-light dark:hover:bg-bg-dark text-start">
      <span className="text-muted-light dark:text-muted-dark">{icon}</span>
      {label}
    </button>
  );
}

function ToolBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="h-9 w-9 rounded-full flex items-center justify-center text-muted-light dark:text-muted-dark hover:bg-bg-light dark:hover:bg-bg-dark hover:text-primary transition-colors"
      title={label}
      aria-label={label}
      type="button"
    >
      {icon}
    </button>
  );
}

function MessageBubble({ msg }: { msg: Conversation['messages'][number] }): JSX.Element {
  const isOut = msg.direction === 'out';
  return (
    <div className={cn('flex', isOut ? 'justify-start' : 'justify-end')}>
      <div
        className={cn(
          'max-w-[70%] sm:max-w-[60%] px-3.5 py-2 rounded-2xl text-body shadow-sm',
          isOut
            ? 'bg-primary text-white rounded-br-sm'
            : 'bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-bl-sm'
        )}
      >
        {msg.type === 'image' ? (
          <div className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /><span>{msg.content}</span></div>
        ) : msg.type === 'document' ? (
          <div className="flex items-center gap-2"><FileText className="h-4 w-4" /><span>{msg.content}</span></div>
        ) : (
          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
        )}
        <div className={cn('flex items-center gap-1 mt-1 text-[10px]', isOut ? 'text-white/80 justify-start' : 'text-muted-light dark:text-muted-dark justify-end')}>
          <span>{formatTime(msg.timestamp)}</span>
          {isOut && (msg.read ? <CheckCheck className="h-3 w-3" /> : msg.delivered ? <CheckCheck className="h-3 w-3 opacity-80" /> : <Check className="h-3 w-3" />)}
        </div>
      </div>
    </div>
  );
}
