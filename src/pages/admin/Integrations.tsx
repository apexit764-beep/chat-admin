import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MessageCircle,
  Mail,
  ShoppingBag,
  Plug,
  X,
  Tag,
} from 'lucide-react';
import { useConfirm } from '@components/ui';
import { useAdminStore } from '@/store/useAdminStore';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  enabled: boolean;
  logo: string;
  countries: string[];
}

const categoryLabels: Record<PlatformCategory, string> = {
  communication: 'قنوات التواصل',
  email: 'البريد الإلكتروني',
  ecommerce: 'منصات التجارة الإلكترونية وشركات الشحن',
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
  { id: 'p1', name: 'WhatsApp Business', slug: 'whatsapp', category: 'communication', enabled: true, logo: '', countries: ['SA', 'EG', 'AE'] },
  { id: 'p2', name: 'Facebook Messenger', slug: 'facebook-messenger', category: 'communication', enabled: true, logo: '', countries: ['SA', 'EG'] },
  { id: 'p3', name: 'Instagram Direct', slug: 'instagram', category: 'communication', enabled: false, logo: '', countries: [] },
  { id: 'p4', name: 'Telegram', slug: 'telegram', category: 'communication', enabled: false, logo: '', countries: [] },
  { id: 'p5', name: 'Live Chat Widget', slug: 'livechat', category: 'communication', enabled: true, logo: '', countries: ['SA', 'EG', 'AE', 'OM'] },
  { id: 'p6', name: 'X (Twitter)', slug: 'twitter', category: 'communication', enabled: false, logo: '', countries: [] },
  { id: 'p7', name: 'Gmail', slug: 'gmail', category: 'email', enabled: true, logo: '', countries: ['SA', 'EG'] },
  { id: 'p8', name: 'Outlook', slug: 'outlook', category: 'email', enabled: false, logo: '', countries: [] },
  { id: 'p9', name: 'Yahoo Mail', slug: 'yahoo', category: 'email', enabled: false, logo: '', countries: [] },
  { id: 'p10', name: 'SMTP', slug: 'smtp', category: 'email', enabled: false, logo: '', countries: [] },
  { id: 'p11', name: 'سلة', slug: 'salla', category: 'ecommerce', enabled: true, logo: '', countries: ['SA'] },
  { id: 'p12', name: 'Zid', slug: 'zid', category: 'ecommerce', enabled: false, logo: '', countries: ['SA'] },
  { id: 'p13', name: 'Shopify', slug: 'shopify', category: 'ecommerce', enabled: false, logo: '', countries: [] },
  { id: 'p14', name: 'WooCommerce', slug: 'woocommerce', category: 'ecommerce', enabled: true, logo: '', countries: ['SA', 'EG'] },
];

const emptyForm: Omit<Platform, 'id'> = {
  name: '',
  slug: '',
  category: 'communication',
  enabled: true,
  logo: '',
  countries: [],
};

import type { Country } from '@/types';

interface CountryTagsInputProps {
  countries: Country[];
  selected: string[];
  onToggle: (code: string) => void;
}

function CountryTagsInput({ countries, selected, onToggle }: CountryTagsInputProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const available = countries.filter(
    (c) => !selected.includes(c.code) && (
      !query.trim() ||
      c.nameAr.includes(query) ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.code.toLowerCase().includes(query.toLowerCase())
    ),
  );

  return (
    <div className="space-y-2">
      <Label>الدول</Label>
      <div ref={wrapperRef} className="relative">
        <div
          className={cn(
            'flex flex-wrap items-center gap-1.5 min-h-[40px] px-3 py-1.5 border rounded-md bg-background cursor-text transition-colors',
            open && 'ring-2 ring-ring',
          )}
          onClick={() => setOpen(true)}
        >
          {selected.map((code) => {
            const co = countries.find((c) => c.code === code);
            return co ? (
              <span key={code} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm px-2 py-0.5 rounded-md">
                {co.flag} {co.nameAr}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onToggle(code); }}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ) : null;
          })}
          <input
            className="flex-1 min-w-[80px] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            placeholder={selected.length === 0 ? 'اختر الدول...' : ''}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
          />
        </div>
        {open && available.length > 0 && (
          <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-md border bg-popover shadow-lg">
            {available.map((c) => (
              <button
                key={c.code}
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors text-start"
                onClick={() => { onToggle(c.code); setQuery(''); }}
              >
                <span>{c.flag}</span>
                <span>{c.nameAr}</span>
                <span className="text-muted-foreground text-xs ms-auto">{c.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Integrations() {
  const [platforms, setPlatforms] = useState<Platform[]>(defaultPlatforms);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<PlatformCategory | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Platform, 'id'>>(emptyForm);
  const { confirm } = useConfirm();
  const countries = useAdminStore((s) => s.countries);

  const filtered = useMemo(() => {
    let list = platforms;
    if (filterCategory !== 'all') list = list.filter((p) => p.category === filterCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
    }
    return list;
  }, [platforms, search, filterCategory]);

  const [categories, setCategories] = useState<{ key: string; label: string }[]>(
    Object.entries(categoryLabels).map(([key, label]) => ({ key, label }))
  );
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catEditIdx, setCatEditIdx] = useState<number | null>(null);
  const [catForm, setCatForm] = useState({ key: '', label: '' });

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
      enabled: p.enabled,
      logo: p.logo,
      countries: [...p.countries],
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

  function toggleCountry(code: string) {
    setForm((prev) => ({
      ...prev,
      countries: prev.countries.includes(code)
        ? prev.countries.filter((c) => c !== code)
        : [...prev.countries, code],
    }));
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
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => { setCatEditIdx(null); setCatForm({ key: '', label: '' }); setCatModalOpen(true); }}>
            <Tag className="h-4 w-4 me-2" />
            إدارة الأنواع
          </Button>
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4 me-2" />
            إضافة منصة
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو الكود..."
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
                {categories.map((cat) => (
                  <SelectItem key={cat.key} value={cat.key}>{cat.label}</SelectItem>
                ))}
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
                  <TableHead>الكود</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الدول</TableHead>
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
                          <Badge variant="secondary" className={cn('text-xs', categoryBadgeColors[p.category] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400')}>
                            {categories.find((c) => c.key === p.category)?.label ?? categoryLabels[p.category] ?? p.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {p.countries.map((code) => {
                              const co = countries.find((c) => c.code === code);
                              return co ? (
                                <span key={code} className="text-xs bg-muted px-1.5 py-0.5 rounded">{co.flag} {co.nameAr}</span>
                              ) : null;
                            })}
                            {p.countries.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                          </div>
                        </TableCell>
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

      {/* Categories Management Dialog */}
      <Dialog open={catModalOpen} onOpenChange={setCatModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إدارة أنواع المنصات</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {categories.map((cat, idx) => (
              <div key={cat.key} className="flex items-center gap-2">
                {catEditIdx === idx ? (
                  <>
                    <Input
                      value={catForm.label}
                      onChange={(e) => setCatForm({ ...catForm, label: e.target.value })}
                      className="flex-1 h-9"
                      autoFocus
                    />
                    <Button size="sm" variant="default" onClick={() => {
                      if (!catForm.label.trim()) return;
                      setCategories((prev) => prev.map((c, i) => i === idx ? { ...c, label: catForm.label } : c));
                      setCatEditIdx(null);
                    }}>حفظ</Button>
                    <Button size="sm" variant="ghost" onClick={() => setCatEditIdx(null)}>إلغاء</Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-medium">{cat.label}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setCatEditIdx(idx); setCatForm({ key: cat.key, label: cat.label }); }}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={async () => {
                      const inUse = platforms.some((p) => p.category === cat.key);
                      if (inUse) { return; }
                      const ok = await confirm({ title: 'حذف النوع', message: `هل أنت متأكد من حذف "${cat.label}"؟` });
                      if (ok) setCategories((prev) => prev.filter((_, i) => i !== idx));
                    }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t pt-3">
            <Input
              placeholder="اسم النوع الجديد..."
              value={catEditIdx === -1 ? catForm.label : ''}
              onChange={(e) => { setCatEditIdx(-1); setCatForm({ key: '', label: e.target.value }); }}
              className="flex-1 h-9"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && catForm.label.trim() && catEditIdx === -1) {
                  const key = catForm.label.trim().toLowerCase().replace(/\s+/g, '-');
                  setCategories((prev) => [...prev, { key, label: catForm.label.trim() }]);
                  setCatForm({ key: '', label: '' });
                  setCatEditIdx(null);
                }
              }}
            />
            <Button size="sm" variant="default" disabled={catEditIdx !== -1 || !catForm.label.trim()}
              onClick={() => {
                if (!catForm.label.trim()) return;
                const key = catForm.label.trim().toLowerCase().replace(/\s+/g, '-');
                setCategories((prev) => [...prev, { key, label: catForm.label.trim() }]);
                setCatForm({ key: '', label: '' });
                setCatEditIdx(null);
              }}
            >
              <Plus className="h-4 w-4 me-1" />
              إضافة
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'تعديل المنصة' : 'إضافة منصة جديدة'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الاسم <span className="text-destructive">*</span></Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="الاسم" />
              </div>
              <div className="space-y-2">
                <Label>كود</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="salla, zid, shopify..." dir="ltr" />
                <p className="text-xs text-muted-foreground">slug بحروف صغيرة لنماذج إعداد التاجر (اختياري)</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>النوع <span className="text-destructive">*</span></Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as PlatformCategory })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.key} value={cat.key}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Label>فعال</Label>
              <Switch checked={form.enabled} onCheckedChange={(v) => setForm({ ...form, enabled: v })} />
            </div>

            <div className="space-y-2">
              <Label>الشعار <span className="text-destructive">*</span></Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setForm({ ...form, logo: URL.createObjectURL(file) });
                }}
              />
            </div>

            <CountryTagsInput
              countries={countries}
              selected={form.countries}
              onToggle={toggleCountry}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>إلغاء</Button>
            <Button onClick={submit} disabled={!form.name.trim()}>
              {editingId ? 'حفظ التغييرات' : 'إضافة المنصة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
