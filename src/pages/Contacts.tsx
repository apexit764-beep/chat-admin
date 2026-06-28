import { useMemo, useState } from 'react';
import {
  Plus,
  Upload,
  Download,
  Eye,
  Edit2,
  Trash2,
  Users,
  Home,
  Crown,
  Building2,
  MoreHorizontal,
  Ban,
  CheckCircle2,
} from 'lucide-react';
import {
  Avatar,
  Badge,
  Card,
  DataTable,
  Drawer,
  Input,
  Modal,
  Select,
  StatCard,
  Textarea,
  useConfirm,
  type Column,
} from '@components/ui';
import { useDataStore } from '@/store/useDataStore';
import { useUIStore } from '@/store/useUIStore';
import { contactTypeColor, contactTypeLabel } from '@/utils/labels';
import { formatDate, formatPhone, timeAgo } from '@/utils/format';
import { downloadCsv } from '@/utils/csv';
import { cn } from '@/utils/cn';
import type { Contact, ContactType } from '@/types';

export default function Contacts(): JSX.Element {
  const contacts = useDataStore((s) => s.contacts);
  const conversations = useDataStore((s) => s.conversations);
  const addContact = useDataStore((s) => s.addContact);
  const updateContact = useDataStore((s) => s.updateContact);
  const deleteContact = useDataStore((s) => s.deleteContact);
  const showToast = useUIStore((s) => s.showToast);
  const { confirm } = useConfirm();

  const [typeFilter, setTypeFilter] = useState<'all' | ContactType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [drawer, setDrawer] = useState<Contact | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [form, setForm] = useState<{ name: string; phone: string; type: ContactType; notes: string }>({
    name: '', phone: '', type: 'seeker', notes: '',
  });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const stats = {
    total: contacts.length,
    tenant: contacts.filter((c) => c.type === 'tenant').length,
    owner: contacts.filter((c) => c.type === 'owner').length,
    vip: contacts.filter((c) => c.type === 'vip').length,
  };

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      if (typeFilter !== 'all' && c.type !== typeFilter) return false;
      if (statusFilter === 'active' && c.blocked) return false;
      if (statusFilter === 'blocked' && !c.blocked) return false;
      return true;
    });
  }, [contacts, typeFilter, statusFilter]);

  const openCreate = (): void => {
    setEditing(null);
    setForm({ name: '', phone: '', type: 'seeker', notes: '' });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (c: Contact): void => {
    setEditing(c);
    setForm({ name: c.name, phone: c.phone, type: c.type, notes: c.notes ?? '' });
    setErrors({});
    setModalOpen(true);
    setOpenMenu(null);
  };

  const submit = (): void => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'الاسم مطلوب';
    if (!form.phone.trim()) e.phone = 'الرقم مطلوب';
    else if (!/^\+?\d{8,}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'رقم غير صحيح';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    if (editing) {
      updateContact(editing.id, form);
      showToast('تم التحديث', 'success');
    } else {
      addContact(form);
      showToast('تمت الإضافة', 'success');
    }
    setModalOpen(false);
  };

  const remove = async (c: Contact): Promise<void> => {
    const ok = await confirm({
      title: `حذف ${c.name}؟`,
      message: 'هذه العملية لا يمكن التراجع عنها',
      variant: 'danger',
      confirmText: 'حذف',
    });
    if (ok) {
      deleteContact(c.id);
      showToast('تم الحذف', 'success');
      setDrawer(null);
      setOpenMenu(null);
    }
  };

  const toggleBlock = (c: Contact): void => {
    updateContact(c.id, { blocked: !c.blocked });
    showToast(c.blocked ? 'تم إلغاء الحظر' : 'تم الحظر', 'success');
    setOpenMenu(null);
  };

  const handleExport = (rows: Contact[]): void => {
    downloadCsv(`contacts-${new Date().toISOString().slice(0, 10)}.csv`, rows.map((c) => ({
      'الاسم': c.name,
      'الهاتف': c.phone,
      'النوع': contactTypeLabel[c.type],
      'الوسوم': c.tags.join('|'),
      'المحادثات': c.conversationCount,
      'محظور': c.blocked ? 'نعم' : 'لا',
      'تاريخ الإضافة': new Date(c.createdAt).toLocaleDateString('en-US'),
    })));
    showToast(`تم تصدير ${rows.length} جهة اتصال`, 'success');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = String(ev.target?.result ?? '');
      const lines = text.split(/\r?\n/).filter(Boolean);
      showToast(`تم استيراد ${Math.max(0, lines.length - 1)} جهة اتصال`, 'success');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const columns: Column<Contact>[] = [
    {
      key: 'name', header: 'الاسم', accessor: (r) => r.name,
      cell: (r) => (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={r.name} size="sm" />
          <div className="min-w-0">
            <p className="font-semibold truncate">{r.name}</p>
            <p className="text-small text-muted-light dark:text-muted-dark md:hidden">{formatPhone(r.phone)}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: 'الواتساب', accessor: (r) => r.phone, hideOn: 'md', cell: (r) => <span className="text-muted-light dark:text-muted-dark font-mono text-small">{formatPhone(r.phone)}</span> },
    { key: 'type', header: 'النوع', accessor: (r) => r.type, cell: (r) => <Badge className={contactTypeColor[r.type]}>{contactTypeLabel[r.type]}</Badge> },
    { key: 'last', header: 'آخر تواصل', accessor: (r) => r.lastContact, hideOn: 'lg', cell: (r) => <span className="text-small text-muted-light dark:text-muted-dark">{timeAgo(r.lastContact)}</span> },
    { key: 'conv', header: 'المحادثات', accessor: (r) => r.conversationCount, hideOn: 'lg' },
    {
      key: 'status', header: 'الحالة', accessor: (r) => r.blocked ? 1 : 0,
      cell: (r) => r.blocked ? <Badge className="bg-danger/15 text-danger border-danger/30">محظور</Badge> : <Badge className="bg-success/15 text-success border-success/30">نشط</Badge>,
    },
    {
      key: 'actions', header: '', sortable: false, width: '80px', align: 'end',
      cell: (r) => (
        <div className="flex items-center gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setDrawer(r)} className="h-8 w-8 rounded-full hover:bg-bg-light dark:hover:bg-bg-dark text-muted-light dark:text-muted-dark hover:text-primary flex items-center justify-center" title="عرض">
            <Eye className="h-4 w-4" />
          </button>
          <div className="relative">
            <button onClick={() => setOpenMenu(openMenu === r.id ? null : r.id)} className="h-8 w-8 rounded-full hover:bg-bg-light dark:hover:bg-bg-dark text-muted-light dark:text-muted-dark flex items-center justify-center" aria-label="المزيد">
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {openMenu === r.id && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                <div className="absolute end-0 mt-1 w-44 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card shadow-card-hover py-1 z-20">
                  <MenuItem icon={<Edit2 className="h-4 w-4" />} label="تعديل" onClick={() => openEdit(r)} />
                  <MenuItem icon={r.blocked ? <CheckCircle2 className="h-4 w-4" /> : <Ban className="h-4 w-4" />} label={r.blocked ? 'إلغاء الحظر' : 'حظر'} onClick={() => toggleBlock(r)} />
                  <div className="h-px bg-border-light dark:bg-border-dark my-1" />
                  <MenuItem icon={<Trash2 className="h-4 w-4" />} label="حذف" danger onClick={() => remove(r)} />
                </div>
              </>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-5 page-fade">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="إجمالي جهات الاتصال" value={stats.total} icon={<Users className="h-5 w-5" />} iconBg="bg-primary/15" iconColor="text-primary" />
        <StatCard label="مستأجرين" value={stats.tenant} icon={<Home className="h-5 w-5" />} iconBg="bg-info/15" iconColor="text-info" />
        <StatCard label="ملاك" value={stats.owner} icon={<Building2 className="h-5 w-5" />} iconBg="bg-success/15" iconColor="text-success" />
        <StatCard label="VIP" value={stats.vip} icon={<Crown className="h-5 w-5" />} iconBg="bg-danger/15" iconColor="text-danger" />
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        rowKey={(c) => c.id}
        searchPlaceholder="ابحث بالاسم أو الرقم..."
        searchAccessor={(c) => `${c.name} ${c.phone}`}
        selectable
        onRowClick={(c) => setDrawer(c)}
        bulkActions={(selected, clear) => (
          <button onClick={() => { handleExport(selected); clear(); }} className="h-8 px-3 rounded-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-small font-medium hover:bg-bg-light dark:hover:bg-bg-dark flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5" /> تصدير المحدّد
          </button>
        )}
        toolbar={
          <>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as 'all' | ContactType)} className="h-9 px-3 rounded-full bg-bg-light dark:bg-bg-dark border border-transparent text-small focus:outline-none focus:border-primary">
              <option value="all">كل الأنواع</option>
              <option value="tenant">مستأجر</option>
              <option value="owner">مالك</option>
              <option value="seeker">باحث</option>
              <option value="company">شركة</option>
              <option value="vip">VIP</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="h-9 px-3 rounded-full bg-bg-light dark:bg-bg-dark border border-transparent text-small focus:outline-none focus:border-primary">
              <option value="all">الكل</option>
              <option value="active">نشط</option>
              <option value="blocked">محظور</option>
            </select>
            <label className="h-9 px-4 rounded-full border border-border-light dark:border-border-dark text-small font-medium hover:bg-bg-light dark:hover:bg-bg-dark cursor-pointer flex items-center gap-2">
              <Upload className="h-4 w-4" /> استيراد
              <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
            </label>
            <button onClick={() => handleExport(filtered)} className="h-9 px-4 rounded-full border border-border-light dark:border-border-dark text-small font-medium hover:bg-bg-light dark:hover:bg-bg-dark flex items-center gap-2">
              <Download className="h-4 w-4" /> تصدير
            </button>
            <button onClick={openCreate} className="h-9 px-4 rounded-full bg-primary hover:bg-primary-dark text-white text-small font-medium flex items-center gap-2">
              <Plus className="h-4 w-4" /> جهة اتصال
            </button>
          </>
        }
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'تعديل جهة اتصال' : 'إضافة جهة اتصال'}
        size="md"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="h-10 px-5 rounded-full border border-border-light dark:border-border-dark text-small font-medium hover:bg-bg-light dark:hover:bg-bg-dark">إلغاء</button>
            <button onClick={submit} className="h-10 px-5 rounded-full bg-primary hover:bg-primary-dark text-white text-small font-medium">{editing ? 'حفظ' : 'إضافة'}</button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="الاسم الكامل" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: undefined }); }} placeholder="مثال: أحمد الشعيلي" error={errors.name ?? undefined} />
          <Input label="رقم الواتساب" value={form.phone} onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: undefined }); }} placeholder="+96891234567" error={errors.phone ?? undefined} />
          <Select label="النوع" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ContactType })}>
            <option value="tenant">مستأجر</option>
            <option value="owner">مالك</option>
            <option value="seeker">باحث</option>
            <option value="company">شركة</option>
            <option value="vip">VIP</option>
          </Select>
          <Textarea label="ملاحظات" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="معلومات إضافية..." />
        </div>
      </Modal>

      <Drawer open={!!drawer} onClose={() => setDrawer(null)} title="تفاصيل جهة الاتصال" side="end" width="w-[420px]">
        {drawer && <ContactDrawerBody contact={drawer} onEdit={() => { openEdit(drawer); setDrawer(null); }} onDelete={() => remove(drawer)} />}
      </Drawer>
    </div>
  );
}

function ContactDrawerBody({ contact, onEdit, onDelete }: { contact: Contact; onEdit: () => void; onDelete: () => void }): JSX.Element {
  const conversations = useDataStore((s) => s.conversations);
  const contactConvs = conversations.filter((c) => c.contactId === contact.id);
  return (
    <div className="space-y-5">
      <div className="text-center">
        <Avatar name={contact.name} size="lg" className="mx-auto" />
        <p className="text-h2 font-bold mt-3">{contact.name}</p>
        <p className="text-small text-muted-light dark:text-muted-dark">{formatPhone(contact.phone)}</p>
        <Badge className={cn('mt-2', contactTypeColor[contact.type])}>{contactTypeLabel[contact.type]}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={onEdit} className="h-10 px-4 rounded-full border border-border-light dark:border-border-dark text-small font-medium hover:bg-bg-light dark:hover:bg-bg-dark flex items-center justify-center gap-2">
          <Edit2 className="h-4 w-4" /> تعديل
        </button>
        <button onClick={onDelete} className="h-10 px-4 rounded-full bg-danger/10 text-danger text-small font-medium hover:bg-danger/15 flex items-center justify-center gap-2">
          <Trash2 className="h-4 w-4" /> حذف
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-small font-semibold">المعلومات</p>
        <div className="space-y-1 text-small">
          <div className="flex justify-between"><span className="text-muted-light dark:text-muted-dark">تاريخ الإضافة</span><span>{formatDate(contact.createdAt)}</span></div>
          <div className="flex justify-between"><span className="text-muted-light dark:text-muted-dark">آخر تواصل</span><span>{timeAgo(contact.lastContact)}</span></div>
          <div className="flex justify-between"><span className="text-muted-light dark:text-muted-dark">عدد المحادثات</span><span>{contact.conversationCount}</span></div>
        </div>
      </div>

      {contact.notes && (
        <div>
          <p className="text-small font-semibold mb-1.5">ملاحظات</p>
          <p className="text-body p-3 bg-bg-light dark:bg-bg-dark rounded-card">{contact.notes}</p>
        </div>
      )}

      {contact.tags.length > 0 && (
        <div>
          <p className="text-small font-semibold mb-1.5">الوسوم</p>
          <div className="flex flex-wrap gap-1.5">
            {contact.tags.map((t) => (
              <Badge key={t} className="bg-primary/10 text-primary border-primary/20">{t}</Badge>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-small font-semibold mb-1.5">المحادثات ({contactConvs.length})</p>
        <div className="space-y-1.5">
          {contactConvs.map((c) => (
            <div key={c.id} className="p-3 rounded-card bg-bg-light dark:bg-bg-dark text-small">
              <p className="font-medium line-clamp-1">{c.lastMessage}</p>
              <p className="text-muted-light dark:text-muted-dark mt-0.5">{timeAgo(c.lastMessageAt)}</p>
            </div>
          ))}
          {contactConvs.length === 0 && <p className="text-small text-muted-light dark:text-muted-dark italic">لا محادثات</p>}
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }): JSX.Element {
  return (
    <button onClick={onClick} className={cn('w-full flex items-center gap-2.5 px-3 py-2 text-body hover:bg-bg-light dark:hover:bg-bg-dark text-start', danger ? 'text-danger' : '')}>
      <span className={danger ? 'text-danger' : 'text-muted-light dark:text-muted-dark'}>{icon}</span>
      {label}
    </button>
  );
}
