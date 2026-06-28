import { useState } from 'react';
import {
  Plus,
  MoreHorizontal,
  Trash2,
  Edit2,
  RefreshCw,
  Power,
  Search,
  QrCode,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  Avatar,
  Card,
  ChannelIcon,
  channelLabel,
  Input,
  Modal,
  Select,
  StatCard,
  useConfirm,
} from '@components/ui';
import { useDataStore } from '@/store/useDataStore';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/utils/cn';
import { timeAgo } from '@/utils/format';
import type { Channel, ChannelType } from '@/types';

export default function Channels(): JSX.Element {
  const channels = useDataStore((s) => s.channels);
  const departments = useDataStore((s) => s.departments);
  const agents = useDataStore((s) => s.agents);
  const conversations = useDataStore((s) => s.conversations);
  const addChannel = useDataStore((s) => s.addChannel);
  const updateChannel = useDataStore((s) => s.updateChannel);
  const deleteChannel = useDataStore((s) => s.deleteChannel);
  const showToast = useUIStore((s) => s.showToast);
  const { confirm } = useConfirm();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | ChannelType>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Channel | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [form, setForm] = useState<{
    type: ChannelType;
    name: string;
    identifier: string;
    departmentId: string;
  }>({ type: 'whatsapp', name: '', identifier: '', departmentId: '' });
  const [qrOpen, setQrOpen] = useState(false);

  const filtered = channels.filter((c) => {
    if (filterType !== 'all' && c.type !== filterType) return false;
    if (search && !c.name.includes(search) && !c.identifier.includes(search)) return false;
    return true;
  });

  const stats = {
    total: channels.length,
    connected: channels.filter((c) => c.status === 'connected').length,
    whatsapp: channels.filter((c) => c.type === 'whatsapp').length,
    unread: channels.reduce((acc, c) => acc + c.unreadCount, 0),
  };

  const openCreate = (): void => {
    setEditing(null);
    setForm({ type: 'whatsapp', name: '', identifier: '', departmentId: '' });
    setModalOpen(true);
  };

  const openEdit = (c: Channel): void => {
    setEditing(c);
    setForm({ type: c.type, name: c.name, identifier: c.identifier, departmentId: c.departmentId ?? '' });
    setModalOpen(true);
    setOpenMenu(null);
  };

  const submit = (): void => {
    if (!form.name.trim() || !form.identifier.trim()) {
      showToast('الاسم والمعرّف مطلوبان', 'error');
      return;
    }
    if (editing) {
      updateChannel(editing.id, {
        type: form.type,
        name: form.name,
        identifier: form.identifier,
        departmentId: form.departmentId || null,
      });
      showToast('تم تحديث القناة', 'success');
    } else {
      addChannel({
        type: form.type,
        name: form.name,
        identifier: form.identifier,
        status: 'pending',
        departmentId: form.departmentId || null,
      });
      showToast('تمت إضافة القناة. أكمل الاتصال من شاشة QR', 'success');
      if (form.type === 'whatsapp') setQrOpen(true);
    }
    setModalOpen(false);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 page-fade">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="إجمالي القنوات" value={stats.total} icon={<ChannelDot />} iconBg="bg-primary/10" iconColor="text-primary" />
        <StatCard label="متصلة" value={stats.connected} icon={<Power className="h-5 w-5" />} iconBg="bg-success/10" iconColor="text-success" />
        <StatCard label="أرقام واتساب" value={stats.whatsapp} icon={<QrCode className="h-5 w-5" />} iconBg="bg-whatsapp/10" iconColor="text-whatsapp" />
        <StatCard label="رسائل غير مقروءة" value={stats.unread} icon={<AlertCircle className="h-5 w-5" />} iconBg="bg-warning/10" iconColor="text-warning" />
      </div>

      {/* Toolbar */}
      <Card className="p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="h-4 w-4 absolute end-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark" />
          <input
            type="text"
            placeholder="ابحث عن قناة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 ps-3 pe-9 rounded-full bg-bg-light dark:bg-bg-dark border border-transparent text-body focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as 'all' | ChannelType)}
          className="h-10 px-4 rounded-full bg-bg-light dark:bg-bg-dark border border-transparent text-small focus:outline-none focus:border-primary"
        >
          <option value="all">كل الأنواع</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="messenger">Messenger</option>
          <option value="instagram">Instagram</option>
          <option value="telegram">Telegram</option>
          <option value="x">X</option>
          <option value="widget">Live Chat</option>
        </select>
        <button
          onClick={openCreate}
          className="h-10 px-4 rounded-full bg-primary hover:bg-primary-dark text-white text-small font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> إضافة قناة
        </button>
      </Card>

      {/* Channels grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((channel) => {
          const dept = channel.departmentId ? departments.find((d) => d.id === channel.departmentId) : null;
          const channelAgents = agents.filter((a) => a.channels.includes(channel.id));
          const convCount = conversations.filter((c) => c.channelId === channel.id).length;
          return (
            <Card key={channel.id} className="p-5 hover:shadow-card-hover transition-shadow relative">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <ChannelIcon type={channel.type} size={20} />
                  <div className="min-w-0">
                    <p className="text-body font-semibold truncate">{channel.name}</p>
                    <p className="text-small text-muted-light dark:text-muted-dark truncate font-mono">{channel.identifier}</p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === channel.id ? null : channel.id)}
                    className="h-8 w-8 rounded-full hover:bg-bg-light dark:hover:bg-bg-dark flex items-center justify-center text-muted-light dark:text-muted-dark"
                    aria-label="المزيد"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  {openMenu === channel.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                      <div className="absolute end-0 mt-1 w-48 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card shadow-card-hover py-1 z-20">
                        <MenuItem icon={<Edit2 className="h-4 w-4" />} label="تعديل" onClick={() => openEdit(channel)} />
                        <MenuItem icon={<RefreshCw className="h-4 w-4" />} label="إعادة الاتصال" onClick={() => { showToast('جارٍ إعادة الاتصال...', 'info'); setOpenMenu(null); }} />
                        <MenuItem
                          icon={<Power className="h-4 w-4" />}
                          label={channel.status === 'connected' ? 'فصل' : 'اتصال'}
                          onClick={() => {
                            updateChannel(channel.id, { status: channel.status === 'connected' ? 'disconnected' : 'connected' });
                            setOpenMenu(null);
                          }}
                        />
                        <div className="h-px bg-border-light dark:bg-border-dark my-1" />
                        <MenuItem
                          icon={<Trash2 className="h-4 w-4" />}
                          label="حذف"
                          danger
                          onClick={() => {
                            void (async () => {
                              const ok = await confirm({ title: `حذف قناة ${channel.name}؟`, message: 'لا يمكن التراجع', variant: 'danger', confirmText: 'حذف' });
                              if (ok) {
                                deleteChannel(channel.id);
                                showToast('تم الحذف', 'success');
                              }
                              setOpenMenu(null);
                            })();
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Status badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-small font-medium',
                    channel.status === 'connected' && 'bg-success/15 text-success',
                    channel.status === 'disconnected' && 'bg-danger/15 text-danger',
                    channel.status === 'pending' && 'bg-warning/15 text-warning'
                  )}
                >
                  <span className={cn('h-2 w-2 rounded-full', channel.status === 'connected' ? 'bg-success animate-pulse' : channel.status === 'pending' ? 'bg-warning' : 'bg-danger')} />
                  {channel.status === 'connected' && 'متصل'}
                  {channel.status === 'disconnected' && 'غير متصل'}
                  {channel.status === 'pending' && 'في الانتظار'}
                </span>
                <span className="text-small text-muted-light dark:text-muted-dark">
                  {channelLabel(channel.type)}
                </span>
              </div>

              {/* Department + agents */}
              <div className="space-y-2.5 pt-3 border-t border-border-light dark:border-border-dark">
                <div className="flex items-center justify-between text-small">
                  <span className="text-muted-light dark:text-muted-dark">القسم</span>
                  {dept ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-small font-medium" style={{ background: `${dept.color}1f`, color: dept.color }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: dept.color }} />
                      {dept.name}
                    </span>
                  ) : (
                    <span className="text-muted-light dark:text-muted-dark italic">غير محدد</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-small">
                  <span className="text-muted-light dark:text-muted-dark">الموظفون</span>
                  {channelAgents.length > 0 ? (
                    <div className="flex items-center -space-x-2 rtl:space-x-reverse">
                      {channelAgents.slice(0, 3).map((a) => (
                        <div key={a.id} className="ring-2 ring-white dark:ring-surface-dark rounded-full">
                          <Avatar name={a.name} size="xs" />
                        </div>
                      ))}
                      {channelAgents.length > 3 && (
                        <span className="ring-2 ring-white dark:ring-surface-dark h-6 px-1.5 rounded-full bg-bg-light dark:bg-bg-dark text-[10px] font-bold flex items-center justify-center">
                          +{channelAgents.length - 3}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-light dark:text-muted-dark italic">لا أحد</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-small">
                  <span className="text-muted-light dark:text-muted-dark">المحادثات</span>
                  <span className="font-semibold">{convCount}</span>
                </div>
                {channel.unreadCount > 0 && (
                  <div className="flex items-center justify-between text-small">
                    <span className="text-muted-light dark:text-muted-dark">غير مقروءة</span>
                    <span className="bg-danger text-white text-[10px] font-bold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
                      {channel.unreadCount}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}

        {/* Add channel card */}
        <button
          onClick={openCreate}
          className="rounded-card border-2 border-dashed border-border-light dark:border-border-dark hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center p-8 min-h-[280px]"
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
            <Plus className="h-6 w-6" />
          </div>
          <p className="text-body font-semibold">إضافة قناة جديدة</p>
          <p className="text-small text-muted-light dark:text-muted-dark mt-1">واتساب · ماسنجر · انستجرام · تيليجرام · X</p>
        </button>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'تعديل القناة' : 'إضافة قناة جديدة'}
        size="md"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="h-10 px-5 rounded-full border border-border-light dark:border-border-dark text-small font-medium hover:bg-bg-light dark:hover:bg-bg-dark">إلغاء</button>
            <button onClick={submit} className="h-10 px-5 rounded-full bg-primary hover:bg-primary-dark text-white text-small font-medium">
              {editing ? 'حفظ' : 'إضافة وربط'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Select label="نوع القناة" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ChannelType })}>
            <option value="whatsapp">WhatsApp</option>
            <option value="messenger">Facebook Messenger</option>
            <option value="instagram">Instagram Direct</option>
            <option value="telegram">Telegram</option>
            <option value="x">X (Twitter)</option>
            <option value="widget">Live Chat (Widget)</option>
          </Select>
          <Input
            label="اسم القناة"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="مثال: المبيعات - عقارات"
          />
          <Input
            label={form.type === 'whatsapp' ? 'رقم الواتساب' : form.type === 'widget' ? 'اسم النطاق' : 'المعرّف'}
            value={form.identifier}
            onChange={(e) => setForm({ ...form, identifier: e.target.value })}
            placeholder={form.type === 'whatsapp' ? '+968 9999 1111' : form.type === 'instagram' ? '@username' : 'identifier'}
          />
          <Select label="القسم المعين" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>
            <option value="">بدون قسم</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </Select>
        </div>
      </Modal>

      {/* QR Modal */}
      <Modal open={qrOpen} onClose={() => setQrOpen(false)} title="اربط واتساب" size="md"
        footer={<button onClick={() => { setQrOpen(false); showToast('سيتم الاتصال تلقائياً عند المسح', 'info'); }} className="h-10 px-5 rounded-full border border-border-light dark:border-border-dark text-small font-medium hover:bg-bg-light dark:hover:bg-bg-dark">إغلاق</button>}
      >
        <div className="text-center">
          <p className="text-body text-muted-light dark:text-muted-dark mb-4">
            افتح واتساب على هاتفك ← الأجهزة المرتبطة ← امسح هذا الرمز
          </p>
          <div className="mx-auto h-56 w-56 bg-white rounded-card border-2 border-border-light p-3">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #111 1.5px, transparent 1.5px), radial-gradient(circle, #111 1.5px, transparent 1.5px)',
                backgroundSize: '14px 14px, 14px 14px',
                backgroundPosition: '0 0, 7px 7px',
              }}
            />
          </div>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-small">
            <Check className="h-4 w-4" />
            <span>الرمز فعّال لمدة 60 ثانية</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2 text-body hover:bg-bg-light dark:hover:bg-bg-dark text-start',
        danger ? 'text-danger' : ''
      )}
    >
      <span className={danger ? 'text-danger' : 'text-muted-light dark:text-muted-dark'}>{icon}</span>
      {label}
    </button>
  );
}

function ChannelDot(): JSX.Element {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <circle cx="5" cy="5" r="2.5" />
      <circle cx="15" cy="5" r="2.5" />
      <circle cx="10" cy="15" r="2.5" />
      <line x1="5" y1="5" x2="10" y2="15" stroke="currentColor" strokeWidth="1.5" />
      <line x1="15" y1="5" x2="10" y2="15" stroke="currentColor" strokeWidth="1.5" />
      <line x1="5" y1="5" x2="15" y2="5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
