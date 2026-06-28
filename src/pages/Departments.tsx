import { useState } from 'react';
import { Plus, Edit2, Trash2, Users, MessageSquare, Building2 } from 'lucide-react';
import {
  Avatar,
  Card,
  ChannelIcon,
  Input,
  Modal,
  StatCard,
  Textarea,
  useConfirm,
} from '@components/ui';
import { useDataStore } from '@/store/useDataStore';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/utils/cn';
import type { Department } from '@/types';

const palette = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#84CC16'];

export default function Departments(): JSX.Element {
  const departments = useDataStore((s) => s.departments);
  const channels = useDataStore((s) => s.channels);
  const agents = useDataStore((s) => s.agents);
  const conversations = useDataStore((s) => s.conversations);
  const addDepartment = useDataStore((s) => s.addDepartment);
  const updateDepartment = useDataStore((s) => s.updateDepartment);
  const deleteDepartment = useDataStore((s) => s.deleteDepartment);
  const updateAgent = useDataStore((s) => s.updateAgent);
  const updateChannel = useDataStore((s) => s.updateChannel);
  const showToast = useUIStore((s) => s.showToast);
  const { confirm } = useConfirm();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    color: palette[0],
    agents: [] as string[],
    channels: [] as string[],
  });

  const openCreate = (): void => {
    setEditing(null);
    setForm({ name: '', description: '', color: palette[0], agents: [], channels: [] });
    setModalOpen(true);
  };

  const openEdit = (d: Department): void => {
    setEditing(d);
    setForm({
      name: d.name,
      description: d.description ?? '',
      color: d.color,
      agents: d.agents,
      channels: d.channels,
    });
    setModalOpen(true);
  };

  const submit = (): void => {
    if (!form.name.trim()) {
      showToast('اسم القسم مطلوب', 'error');
      return;
    }
    if (editing) {
      updateDepartment(editing.id, {
        name: form.name,
        description: form.description,
        color: form.color,
        agents: form.agents,
        channels: form.channels,
      });
      // sync agents
      agents.forEach((a) => {
        const inNow = form.agents.includes(a.id);
        const inBefore = a.departments.includes(editing.id);
        if (inNow && !inBefore) updateAgent(a.id, { departments: [...a.departments, editing.id] });
        if (!inNow && inBefore) updateAgent(a.id, { departments: a.departments.filter((d) => d !== editing.id) });
      });
      // sync channels
      channels.forEach((c) => {
        const inNow = form.channels.includes(c.id);
        if (inNow && c.departmentId !== editing.id) updateChannel(c.id, { departmentId: editing.id });
        if (!inNow && c.departmentId === editing.id) updateChannel(c.id, { departmentId: null });
      });
      showToast('تم تحديث القسم', 'success');
    } else {
      addDepartment({
        name: form.name,
        description: form.description,
        color: form.color,
        agents: form.agents,
        channels: form.channels,
      });
      showToast('تمت إضافة القسم', 'success');
    }
    setModalOpen(false);
  };

  const remove = async (d: Department): Promise<void> => {
    const ok = await confirm({ title: `حذف قسم ${d.name}؟`, message: 'سيتم إزالة الموظفين والقنوات منه', variant: 'danger', confirmText: 'حذف' });
    if (ok) {
      deleteDepartment(d.id);
      showToast('تم الحذف', 'success');
    }
  };

  const totalAgents = agents.length;
  const assignedAgents = agents.filter((a) => a.departments.length > 0).length;

  return (
    <div className="p-4 lg:p-6 space-y-5 page-fade">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="إجمالي الأقسام" value={departments.length} icon={<Building2 className="h-5 w-5" />} iconBg="bg-primary/10" iconColor="text-primary" />
        <StatCard label="الموظفون" value={`${assignedAgents}/${totalAgents}`} icon={<Users className="h-5 w-5" />} iconBg="bg-info/10" iconColor="text-info" />
        <StatCard label="القنوات" value={channels.length} icon={<MessageSquare className="h-5 w-5" />} iconBg="bg-success/10" iconColor="text-success" />
        <StatCard label="المحادثات" value={conversations.length} icon={<MessageSquare className="h-5 w-5" />} iconBg="bg-warning/10" iconColor="text-warning" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-h2 font-bold">الأقسام</h2>
          <p className="text-body text-muted-light dark:text-muted-dark">
            نظّم فريقك في أقسام، عيّن لكل قسم قنواته وموظفيه
          </p>
        </div>
        <button
          onClick={openCreate}
          className="h-10 px-4 rounded-full bg-primary hover:bg-primary-dark text-white text-small font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> قسم جديد
        </button>
      </div>

      {/* Departments grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {departments.map((d) => {
          const dAgents = agents.filter((a) => d.agents.includes(a.id));
          const dChannels = channels.filter((c) => d.channels.includes(c.id));
          const dConvs = conversations.filter((c) => c.departmentId === d.id);
          const openConvs = dConvs.filter((c) => c.status !== 'closed').length;
          return (
            <Card key={d.id} className="p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-11 w-11 rounded-card flex items-center justify-center font-bold text-white"
                    style={{ background: d.color }}
                  >
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-h3 font-bold">{d.name}</h3>
                    <p className="text-small text-muted-light dark:text-muted-dark line-clamp-1">
                      {d.description ?? '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(d)} className="h-8 w-8 rounded-full hover:bg-bg-light dark:hover:bg-bg-dark text-muted-light dark:text-muted-dark hover:text-primary flex items-center justify-center" aria-label="تعديل">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(d)} className="h-8 w-8 rounded-full hover:bg-danger/10 text-muted-light dark:text-muted-dark hover:text-danger flex items-center justify-center" aria-label="حذف">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="p-2.5 rounded-lg bg-bg-light dark:bg-bg-dark text-center">
                  <p className="text-h3 font-bold">{dConvs.length}</p>
                  <p className="text-[10px] text-muted-light dark:text-muted-dark">محادثات</p>
                </div>
                <div className="p-2.5 rounded-lg bg-bg-light dark:bg-bg-dark text-center">
                  <p className="text-h3 font-bold text-warning">{openConvs}</p>
                  <p className="text-[10px] text-muted-light dark:text-muted-dark">مفتوحة</p>
                </div>
                <div className="p-2.5 rounded-lg bg-bg-light dark:bg-bg-dark text-center">
                  <p className="text-h3 font-bold">{dAgents.length}</p>
                  <p className="text-[10px] text-muted-light dark:text-muted-dark">موظفون</p>
                </div>
              </div>

              {/* Agents */}
              <div className="space-y-2.5">
                <div>
                  <p className="text-small font-semibold text-muted-light dark:text-muted-dark mb-1.5">الموظفون</p>
                  {dAgents.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {dAgents.map((a) => (
                        <div key={a.id} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-bg-light dark:bg-bg-dark text-small">
                          <Avatar name={a.name} size="xs" status={a.status} />
                          <span>{a.name.split(' ')[0]}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-small text-muted-light dark:text-muted-dark italic">لا أحد معين</p>
                  )}
                </div>

                <div>
                  <p className="text-small font-semibold text-muted-light dark:text-muted-dark mb-1.5">القنوات</p>
                  {dChannels.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {dChannels.map((c) => (
                        <div key={c.id} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-bg-light dark:bg-bg-dark text-small">
                          <ChannelIcon type={c.type} size={12} className="!p-0" />
                          <span className="truncate max-w-[120px]">{c.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-small text-muted-light dark:text-muted-dark italic">لا قنوات</p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}

        <button
          onClick={openCreate}
          className="rounded-card border-2 border-dashed border-border-light dark:border-border-dark hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center p-8 min-h-[300px]"
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
            <Plus className="h-6 w-6" />
          </div>
          <p className="text-body font-semibold">قسم جديد</p>
          <p className="text-small text-muted-light dark:text-muted-dark mt-1">نظّم فريقك حسب الوظيفة</p>
        </button>
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'تعديل القسم' : 'قسم جديد'}
        size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="h-10 px-5 rounded-full border border-border-light dark:border-border-dark text-small font-medium hover:bg-bg-light dark:hover:bg-bg-dark">إلغاء</button>
            <button onClick={submit} className="h-10 px-5 rounded-full bg-primary hover:bg-primary-dark text-white text-small font-medium">{editing ? 'حفظ' : 'إضافة'}</button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="اسم القسم" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثال: المبيعات" />
          <Textarea label="الوصف" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="ما الذي يفعله هذا القسم؟" rows={2} />

          <div className="space-y-1.5">
            <label className="text-small font-medium text-muted-light dark:text-muted-dark block">لون القسم</label>
            <div className="flex gap-2">
              {palette.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className={cn(
                    'h-9 w-9 rounded-full transition-all',
                    form.color === c && 'ring-2 ring-offset-2 ring-current'
                  )}
                  style={{ background: c }}
                  aria-label={`لون ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-small font-medium text-muted-light dark:text-muted-dark block">الموظفون</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {agents.map((a) => {
                const checked = form.agents.includes(a.id);
                return (
                  <label key={a.id} className={cn('flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors',
                    checked ? 'bg-primary/5 border-primary/40' : 'bg-bg-light dark:bg-bg-dark border-transparent hover:border-border-light dark:hover:border-border-dark'
                  )}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          agents: e.target.checked ? [...form.agents, a.id] : form.agents.filter((id) => id !== a.id),
                        });
                      }}
                      className="h-4 w-4 accent-primary"
                    />
                    <Avatar name={a.name} size="xs" />
                    <span className="text-small font-medium truncate flex-1">{a.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-small font-medium text-muted-light dark:text-muted-dark block">القنوات</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {channels.map((c) => {
                const checked = form.channels.includes(c.id);
                return (
                  <label key={c.id} className={cn('flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors',
                    checked ? 'bg-primary/5 border-primary/40' : 'bg-bg-light dark:bg-bg-dark border-transparent hover:border-border-light dark:hover:border-border-dark'
                  )}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          channels: e.target.checked ? [...form.channels, c.id] : form.channels.filter((id) => id !== c.id),
                        });
                      }}
                      className="h-4 w-4 accent-primary"
                    />
                    <ChannelIcon type={c.type} size={14} />
                    <div className="min-w-0 flex-1">
                      <p className="text-small font-medium truncate">{c.name}</p>
                      <p className="text-[10px] text-muted-light dark:text-muted-dark truncate font-mono">{c.identifier}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
