import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MessageCircle,
  Mail,
  ShoppingBag,
  Plug,
} from 'lucide-react';
import { useConfirm } from '@components/ui';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type PlatformCategory = 'communication' | 'email' | 'ecommerce';

interface Platform {
  id: string;
  name: string;
  slug: string;
  category: PlatformCategory;
  description: string;
  enabled: boolean;
  apiKey: string;
  apiSecret: string;
  webhookUrl: string;
  notes: string;
}

const categoryLabels: Record<PlatformCategory, string> = {
  communication: 'قنوات التواصل',
  email: 'البريد الإلكتروني',
  ecommerce: 'منصات التجارة الإلكترونية',
};

const categoryIcons: Record<PlatformCategory, React.ElementType> = {
  communication: MessageCircle,
  email: Mail,
  ecommerce: ShoppingBag,
};

const categoryBadgeColors: Record<PlatformCategory, string> = {
  communication: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  email: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  ecommerce: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

const defaultPlatforms: Platform[] = [
  { id: 'p1', name: 'WhatsApp Business', slug: 'whatsapp', category: 'communication', description: 'ربط واتساب بزنس API للتواصل مع العملاء', enabled: true, apiKey: '', apiSecret: '', webhookUrl: '', notes: '' },
  { id: 'p2', name: 'Facebook Messenger', slug: 'facebook-messenger', category: 'communication', description: 'استقبال رسائل فيسبوك ماسنجر', enabled: true, apiKey: '', apiSecret: '', webhookUrl: '', notes: '' },
  { id: 'p3', name: 'Instagram Direct', slug: 'instagram', category: 'communication', description: 'إدارة رسائل إنستغرام المباشرة', enabled: false, apiKey: '', apiSecret: '', webhookUrl: '', notes: '' },
  { id: 'p4', name: 'Telegram', slug: 'telegram', category: 'communication', description: 'ربط بوت تيليغرام لاستقبال المحادثات', enabled: false, apiKey: '', apiSecret: '', webhookUrl: '', notes: '' },
  { id: 'p5', name: 'Live Chat Widget', slug: 'livechat', category: 'communication', description: 'أداة الدردشة المباشرة للموقع الإلكتروني', enabled: true, apiKey: '', apiSecret: '', webhookUrl: '', notes: '' },
  { id: 'p6', name: 'X (Twitter)', slug: 'twitter', category: 'communication', description: 'إدارة الرسائل المباشرة على تويتر', enabled: false, apiKey: '', apiSecret: '', webhookUrl: '', notes: '' },
  { id: 'p7', name: 'Gmail', slug: 'gmail', category: 'email', description: 'ربط حسابات Gmail لإرسال واستقبال البريد', enabled: true, apiKey: '', apiSecret: '', webhookUrl: '', notes: '' },
  { id: 'p8', name: 'Outlook', slug: 'outlook', category: 'email', description: 'ربط حسابات Outlook و Microsoft 365', enabled: false, apiKey: '', apiSecret: '', webhookUrl: '', notes: '' },
  { id: 'p9', name: 'Yahoo Mail', slug: 'yahoo', category: 'email', description: 'ربط حسابات Yahoo Mail', enabled: false, apiKey: '', apiSecret: '', webhookUrl: '', notes: '' },
  { id: 'p10', name: 'SMTP', slug: 'smtp', category: 'email', description: 'خادم SMTP مخصص لإرسال البريد', enabled: false, apiKey: '', apiSecret: '', webhookUrl: '', notes: '' },
  { id: 'p11', name: 'سلة', slug: 'salla', category: 'ecommerce', description: 'ربط متجر سلة لإدارة الطلبات والعملاء', enabled: true, apiKey: '', apiSecret: '', webhookUrl: '', notes: '' },
  { id: 'p12', name: 'Zid', slug: 'zid', category: 'ecommerce', description: 'ربط متجر زد لمتابعة الطلبات', enabled: false, apiKey: '', apiSecret: '', webhookUrl: '', notes: '' },
  { id: 'p13', name: 'Shopify', slug: 'shopify', category: 'ecommerce', description: 'ربط متجر Shopify لإدارة التجارة', enabled: false, apiKey: '', apiSecret: '', webhookUrl: '', notes: '' },
  { id: 'p14', name: 'WooCommerce', slug: 'woocommerce', category: 'ecommerce', description: 'ربط متجر WooCommerce على ووردبريس', enabled: true, apiKey: '', apiSecret: '', webhookUrl: '', notes: '' },
];

const emptyForm: Omit<Platform, 'id'> = {
  name: '',
  slug: '',
  category: 'communication',
  description: '',
  enabled: true,
  apiKey: '',
  apiSecret: '',
  webhookUrl: '',
  notes: '',
};

export default function Integrations() {
  const [platforms, setPlatforms] = useState<Platform[]>(defaultPlatforms);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<PlatformCategory | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Platform, 'id'>>(emptyForm);
  const { confirm } = useConfirm();

  const filtered = useMemo(() => {
    let list = platforms;
    if (filterCategory !== 'all') list = list.filter((p) => p.category === filterCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return list;
  }, [platforms, search, filterCategory]);

  const stats = useMemo(() => ({
    total: platforms.length,
    enabled: platforms.filter((p) => p.enabled).length,
    communication: platforms.filter((p) => p.category === 'communication').length,
    email: platforms.filter((p) => p.category === 'email').length,
    ecommerce: platforms.filter((p) => p.category === 'ecommerce').length,
  }), [platforms]);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(p: Platform) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      slug: p.slug,
      category: p.category,
      description: p.description,
      enabled: p.enabled,
      apiKey: p.apiKey,
      apiSecret: p.apiSecret,
      webhookUrl: p.webhookUrl,
      notes: p.notes,
    });
    setModalOpen(true);
  }

  function submit() {
    if (!form.name.trim() || !form.slug.trim()) return;
    if (editingId) {
      setPlatforms((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...form } : p)));
    } else {
      const id = 'p' + Date.now();
      setPlatforms((prev) => [...prev, { id, ...form }]);
    }
    setModalOpen(false);
  }

  async function handleDelete(p: Platform) {
    const yes = await confirm({ title: 'حذف المنصة', message: `هل أنت متأكد من حذف "${p.name}"؟` });
    if (yes) setPlatforms((prev) => prev.filter((x) => x.id !== p.id));
  }

  function toggleEnabled(id: string) {
    setPlatforms((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Plug className="h-7 w-7 text-primary" />
            منصات التكامل
          </h1>
          <p className="text-muted-foreground mt-1">إدارة وتفعيل منصات التكامل المتاحة</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 me-2" />
          إضافة منصة
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'إجمالي المنصات', value: stats.total, color: 'text-foreground' },
          { label: 'مفعّلة', value: stats.enabled, color: 'text-emerald-600' },
          { label: 'قنوات التواصل', value: stats.communication, color: 'text-blue-600' },
          { label: 'البريد الإلكتروني', value: stats.email, color: 'text-amber-600' },
          { label: 'التجارة الإلكترونية', value: stats.ecommerce, color: 'text-purple-600' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو الرمز..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-9"
              />
            </div>
            <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as PlatformCategory | 'all')}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="جميع الفئات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                <SelectItem value="communication">قنوات التواصل</SelectItem>
                <SelectItem value="email">البريد الإلكتروني</SelectItem>
                <SelectItem value="ecommerce">التجارة الإلكترونية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>المنصة</TableHead>
                  <TableHead>الرمز</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead className="text-center">الحالة</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      لا توجد منصات مطابقة
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p, i) => {
                    const CatIcon = categoryIcons[p.category];
                    return (
                      <TableRow key={p.id}>
                        <TableCell className="text-center text-muted-foreground font-mono text-sm">{i + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', categoryBadgeColors[p.category])}>
                              <CatIcon className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{p.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{p.slug}</code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn('text-xs', categoryBadgeColors[p.category])}>
                            {categoryLabels[p.category]}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">{p.description}</TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={p.enabled}
                            onCheckedChange={() => toggleEnabled(p.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(p)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'تعديل المنصة' : 'إضافة منصة جديدة'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اسم المنصة</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثال: WhatsApp Business" />
              </div>
              <div className="space-y-2">
                <Label>الرمز (Slug)</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="مثال: whatsapp" dir="ltr" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الفئة</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as PlatformCategory })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="communication">قنوات التواصل</SelectItem>
                    <SelectItem value="email">البريد الإلكتروني</SelectItem>
                    <SelectItem value="ecommerce">التجارة الإلكترونية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex items-end gap-3 pb-1">
                <Label>مفعّلة</Label>
                <Switch checked={form.enabled} onCheckedChange={(v) => setForm({ ...form, enabled: v })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>الوصف</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="وصف مختصر للمنصة" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input value={form.apiKey} onChange={(e) => setForm({ ...form, apiKey: e.target.value })} placeholder="مفتاح API" dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label>API Secret</Label>
                <Input value={form.apiSecret} onChange={(e) => setForm({ ...form, apiSecret: e.target.value })} placeholder="المفتاح السري" dir="ltr" type="password" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Webhook URL</Label>
              <Input value={form.webhookUrl} onChange={(e) => setForm({ ...form, webhookUrl: e.target.value })} placeholder="https://..." dir="ltr" />
            </div>

            <div className="space-y-2">
              <Label>ملاحظات</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="ملاحظات إضافية..." rows={3} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>إلغاء</Button>
            <Button onClick={submit} disabled={!form.name.trim() || !form.slug.trim()}>
              {editingId ? 'حفظ التعديلات' : 'إضافة المنصة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
