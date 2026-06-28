import { useState } from 'react';
import { Plus, Edit2, Trash2, UserPlus, Mail, Shield, Clock } from 'lucide-react';
import {
  Avatar,
  Card,
  ChannelIcon,
  Drawer,
  Input,
  Modal,
  Select,
  useConfirm,
} from '@components/ui';
import { useDataStore } from '@/store/useDataStore';
import { useUIStore } from '@/store/useUIStore';
import { agentRoleLabel, agentStatusColor, agentStatusLabel } from '@/utils/labels';
import { timeAgo } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { Agent, AgentRole } from '@/types';

export default function Team(): JSX.Element {
  const agents = useDataStore((s) => s.agents);
  const channels = useDataStore((s) => s.channels);
  const departments = useDataStore((s) => s.departments);
  const conversations = useDataStore((s) => s.conversations);
  const addAgent = useDataStore((s) => s.addAgent);
  const updateAgent = useDataStore((s) => s.updateAgent);
  const deleteAgent = useDataStore((s) => s.deleteAgent);
  const updateDepartment = useDataStore((s) => s.updateDepartment);
  const showToast = useUIStore((s) => s.showToast);
  const { confirm } = useConfirm();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Agent | null>(null);
  const [drawer, setDrawer] = useState<Agent | null>(null);
  const [form, setForm] = useState<{
    name: string;
    email: string;
    password: string;
    role: AgentRole;
    active: boolean;
    channels: string[];
    departments: string[];
  }>({ name: '', email: '', password: '', role: 'agent', active: true, channels: [], departments: [] });

  const openCreate = (): void => {
    setEditing(null);
    setForm({ name: '', email: '', password: '', role: 'agent', active: true, channels: [], departments: [] });
    setModalOpen(true);
  };

  const openEdit = (a: Agent): void => {
    setEditing(a);
    setForm({
      name: a.name,
      email: a.email,
      password: '',
      role: a.role,
      active: a.active,
      channels: a.channels,
      departments: a.departments,
    });
    setModalOpen(true);
  };

  const submit = (): void => {
    if (!form.name.trim() || !form.email.trim()) {
      showToast('الاسم والبريد مطلوبان', 'error');
      return;
    }
    if (editing) {
      updateAgent(editing.id, {
        name: form.name,
        email: form.email,
        role: form.role,
        active: form.active,
        channels: form.channels,
        departments: form.departments,
      });
      // Sync departments two-way
      departments.forEach((d) => {
        const inNow = form.departments.includes(d.id);
        const inBefore = d.agents.includes(editing.id);
        if (inNow && !inBefore) updateDepartment(d.id, { agents: [...d.agents, editing.id] });
        if (!inNow && inBefore) updateDepartment(d.id, { agents: d.agents.filter((id) => id !== editing.id) });
      });
      showToast('تم تحديث الموظف', 'success');
    } else {
      if (!form.password.trim()) {
        showToast('كلمة المرور مطلوبة', 'error');
        return;
      }
      addAgent({
        name: form.name,
        email: form.email,
        role: form.role,
        active: form.active,
        channels: form.channels,
        departments: form.departments,
      });
      showToast('تمت إضافة الموظف', 'success');
    }
    setModalOpen(false);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 page-fade">
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark flex-wrap gap-2">
          <div>
            <h2 className="text-h2 font-bold">فريق الدعم</h2>
            <p className="text-small text-muted-light dark:text-muted-dark mt-0.5">
              {agents.length} موظف · {agents.filter((a) => a.status === 'online').length} متاح حالياً
            </p>
          </div>
          <button onClick={openCreate} className="h-10 px-4 rounded-full bg-primary hover:bg-primary-dark text-white text-small font-medium flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> إضافة موظف
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-body">
            <thead className="bg-bg-light dark:bg-bg-dark text-small text-muted-light dark:text-muted-dark">
              <tr>
                <th className="text-start font-medium px-4 py-3">الموظف</th>
                <th className="text-start font-medium px-4 py-3 hidden md:table-cell">الدور</th>
                <th className="text-start font-medium px-4 py-3 hidden lg:table-cell">الأقسام</th>
                <th className="text-start font-medium px-4 py-3 hidden xl:table-cell">القنوات</th>
                <th className="text-start font-medium px-4 py-3">المحادثات</th>
                <th className="text-start font-medium px-4 py-3">الحالة</th>
                <th className="text-start font-medium px-4 py-3 hidden lg:table-cell">آخر نشاط</th>
                <th className="text-start font-medium px-4 py-3 w-1">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {agents.map((a) => {
                const active = conversations.filter((c) => c.assignedTo === a.id && c.status !== 'closed').length;
                const agentChannels = channels.filter((c) => a.channels.includes(c.id));
                const agentDepts = departments.filter((d) => a.departments.includes(d.id));
                return (
                  <tr key={a.id} className="hover:bg-bg-light dark:hover:bg-bg-dark transition-colors">
                    <td className="px-4 py-3">
                      <button onClick={() => setDrawer(a)} className="flex items-center gap-3 hover:text-primary text-start">
                        <Avatar name={a.name} size="sm" status={a.status} />
                        <div>
                          <p className="font-semibold">{a.name}</p>
                          <p className="text-small text-muted-light dark:text-muted-dark">{a.email}</p>
                        </div>
                      </button>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-small font-medium border',
                        a.role === 'manager' ? 'bg-primary/15 text-primary border-primary/30' : 'bg-info/15 text-info border-info/30'
                      )}>
                        <Shield className="h-3 w-3" />
                        {agentRoleLabel[a.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {agentDepts.map((d) => (
                          <span key={d.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-small font-medium" style={{ background: `${d.color}1f`, color: d.color }}>
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: d.color }} />
                            {d.name}
                          </span>
                        ))}
                        {agentDepts.length === 0 && <span className="text-small text-muted-light dark:text-muted-dark italic">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <div className="flex items-center -space-x-1 rtl:space-x-reverse">
                        {agentChannels.slice(0, 4).map((c) => (
                          <span key={c.id} title={c.name} className="ring-2 ring-white dark:ring-surface-dark rounded-lg">
                            <ChannelIcon type={c.type} size={12} />
                          </span>
                        ))}
                        {agentChannels.length > 4 && (
                          <span className="ring-2 ring-white dark:ring-surface-dark h-7 px-1.5 rounded-lg bg-bg-light dark:bg-bg-dark text-[10px] font-bold flex items-center justify-center">
                            +{agentChannels.length - 4}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">{active}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={cn('h-2 w-2 rounded-full', agentStatusColor[a.status])} />
                        <span className="text-small">{agentStatusLabel[a.status]}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-light dark:text-muted-dark hidden lg:table-cell text-small">
                      {timeAgo(a.lastActive)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(a)} className="h-8 w-8 rounded-full hover:bg-bg-light dark:hover:bg-bg-dark text-muted-light dark:text-muted-dark hover:text-primary flex items-center justify-center" aria-label="تعديل">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            void (async () => {
                              const ok = await confirm({ title: `حذف ${a.name}؟`, message: 'سيتم إزالته من جميع الأقسام والقنوات', variant: 'danger', confirmText: 'حذف' });
                              if (ok) {
                                deleteAgent(a.id);
                                showToast('تم الحذف', 'success');
                              }
                            })();
                          }}
                          className="h-8 w-8 rounded-full hover:bg-danger/10 text-muted-light dark:text-muted-dark hover:text-danger flex items-center justify-center"
                          aria-label="حذف"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'تعديل موظف' : 'إضافة موظف'}
        size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="h-10 px-5 rounded-full border border-border-light dark:border-border-dark text-small font-medium hover:bg-bg-light dark:hover:bg-bg-dark">إلغاء</button>
            <button onClick={submit} className="h-10 px-5 rounded-full bg-primary hover:bg-primary-dark text-white text-small font-medium">{editing ? 'حفظ' : 'إضافة'}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="الاسم الكامل" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} icon={<UserPlus className="h-4 w-4" />} />
            <Input label="البريد الإلكتروني" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} icon={<Mail className="h-4 w-4" />} />
          </div>
          {!editing && (
            <Input label="كلمة المرور" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          )}
          <Select label="الدور" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as AgentRole })}>
            <option value="manager">مدير</option>
            <option value="agent">وكيل</option>
          </Select>

          <div className="space-y-1.5">
            <label className="text-small font-medium text-muted-light dark:text-muted-dark block">الأقسام</label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {departments.map((d) => {
                const checked = form.departments.includes(d.id);
                return (
                  <label key={d.id} className={cn('flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors',
                    checked ? 'bg-primary/5 border-primary/40' : 'bg-bg-light dark:bg-bg-dark border-transparent hover:border-border-light dark:hover:border-border-dark'
                  )}>
                    <input type="checkbox" checked={checked} onChange={(e) => {
                      setForm({ ...form, departments: e.target.checked ? [...form.departments, d.id] : form.departments.filter((id) => id !== d.id) });
                    }} className="h-4 w-4 accent-primary" />
                    <span className="h-3 w-3 rounded-full" style={{ background: d.color }} />
                    <span className="text-small font-medium truncate flex-1">{d.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-small font-medium text-muted-light dark:text-muted-dark block">القنوات (يستطيع رؤيتها والرد عليها)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {channels.map((c) => {
                const checked = form.channels.includes(c.id);
                return (
                  <label key={c.id} className={cn('flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors',
                    checked ? 'bg-primary/5 border-primary/40' : 'bg-bg-light dark:bg-bg-dark border-transparent hover:border-border-light dark:hover:border-border-dark'
                  )}>
                    <input type="checkbox" checked={checked} onChange={(e) => {
                      setForm({ ...form, channels: e.target.checked ? [...form.channels, c.id] : form.channels.filter((id) => id !== c.id) });
                    }} className="h-4 w-4 accent-primary" />
                    <ChannelIcon type={c.type} size={12} />
                    <div className="min-w-0 flex-1">
                      <p className="text-small font-medium truncate">{c.name}</p>
                      <p className="text-[10px] text-muted-light dark:text-muted-dark truncate font-mono">{c.identifier}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <label className="flex items-center gap-3 p-3 rounded-card bg-bg-light dark:bg-bg-dark cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="h-4 w-4 accent-primary"
            />
            <div>
              <p className="text-body font-medium">حساب نشط</p>
              <p className="text-small text-muted-light dark:text-muted-dark">يستطيع تسجيل الدخول</p>
            </div>
          </label>
        </div>
      </Modal>

      <Drawer open={!!drawer} onClose={() => setDrawer(null)} title="تفاصيل الموظف" side="end" width="w-[420px]">
        {drawer && <AgentDrawerBody agent={drawer} />}
      </Drawer>
    </div>
  );
}

function AgentDrawerBody({ agent }: { agent: Agent }): JSX.Element {
  const conversations = useDataStore((s) => s.conversations);
  const channels = useDataStore((s) => s.channels);
  const departments = useDataStore((s) => s.departments);
  const handled = conversations.filter((c) => c.assignedTo === agent.id);
  const active = handled.filter((c) => c.status !== 'closed').length;
  const closed = handled.filter((c) => c.status === 'closed').length;
  const agentDepts = departments.filter((d) => agent.departments.includes(d.id));
  const agentChannels = channels.filter((c) => agent.channels.includes(c.id));

  return (
    <div className="space-y-5">
      <div className="text-center">
        <Avatar name={agent.name} size="lg" className="mx-auto" status={agent.status} />
        <p className="text-h2 font-bold mt-3">{agent.name}</p>
        <p className="text-small text-muted-light dark:text-muted-dark">{agent.email}</p>
        <span className={cn(
          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-small font-medium mt-2',
          agent.role === 'manager' ? 'bg-primary/15 text-primary' : 'bg-info/15 text-info'
        )}>
          <Shield className="h-3 w-3" />
          {agentRoleLabel[agent.role]}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-card bg-bg-light dark:bg-bg-dark">
          <p className="text-h2 font-bold">{handled.length}</p>
          <p className="text-small text-muted-light dark:text-muted-dark">الإجمالي</p>
        </div>
        <div className="p-3 rounded-card bg-bg-light dark:bg-bg-dark">
          <p className="text-h2 font-bold text-warning">{active}</p>
          <p className="text-small text-muted-light dark:text-muted-dark">نشطة</p>
        </div>
        <div className="p-3 rounded-card bg-bg-light dark:bg-bg-dark">
          <p className="text-h2 font-bold text-success">{closed}</p>
          <p className="text-small text-muted-light dark:text-muted-dark">مكتملة</p>
        </div>
      </div>

      <div>
        <p className="text-small font-semibold mb-2">الأقسام</p>
        {agentDepts.length === 0 ? (
          <p className="text-small text-muted-light dark:text-muted-dark italic">لا أقسام</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {agentDepts.map((d) => (
              <span key={d.id} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-small font-medium" style={{ background: `${d.color}1f`, color: d.color }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: d.color }} />
                {d.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-small font-semibold mb-2">القنوات ({agentChannels.length})</p>
        <div className="space-y-1.5">
          {agentChannels.map((c) => (
            <div key={c.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-bg-light dark:bg-bg-dark text-small">
              <ChannelIcon type={c.type} size={12} />
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{c.name}</p>
                <p className="text-[10px] text-muted-light dark:text-muted-dark font-mono">{c.identifier}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-small font-semibold mb-2">المعلومات</p>
        <div className="space-y-2 text-small">
          <div className="flex items-center justify-between">
            <span className="text-muted-light dark:text-muted-dark flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> آخر نشاط</span>
            <span>{timeAgo(agent.lastActive)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-light dark:text-muted-dark">الحالة</span>
            <div className="flex items-center gap-1.5">
              <span className={cn('h-2 w-2 rounded-full', agentStatusColor[agent.status])} />
              <span>{agentStatusLabel[agent.status]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
