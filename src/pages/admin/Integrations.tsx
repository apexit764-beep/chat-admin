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
  ChevronDown,
  ChevronUp,
  GripVertical,
  Star,
} from 'lucide-react';
import { useConfirm } from '@components/ui';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
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

import type { Country } from '@/types';
import {
  type Platform,
  type PlatformCategory,
  categoryIcons,
  emptyForm,
  platformTypeBadgeClass,
} from '@/data/platforms';

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
      <Label>الدول<span className="text-muted-foreground text-[10px] ms-1">(اختياري)</span></Label>
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
  const platforms = useAdminStore((s) => s.platforms);
  const setPlatforms = useAdminStore((s) => s.setPlatforms);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<PlatformCategory | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Platform, 'id'>>(emptyForm);
  const { confirm } = useConfirm();
  const countries = useAdminStore((s) => s.countries);
  const showToast = useUIStore((s) => s.showToast);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    let list = platforms;
    if (filterCategory !== 'all') list = list.filter((p) => p.category === filterCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
    }
    return list;
  }, [platforms, search, filterCategory]);

  const platformTypes = useAdminStore((s) => s.platformTypes);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
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
      connectionMethods: p.connectionMethods.map((m) => ({ ...m, steps: [...m.steps] })),
    });
    setErrors({});
    setModalOpen(true);
  }

  function submit() {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'اسم المنصة مطلوب';
    if (!form.slug.trim()) newErrors.slug = 'كود المنصة مطلوب';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('يرجى تعبئة الحقول المطلوبة', 'error');
      return;
    }
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
                {platformTypes.map((t) => (
                  <SelectItem key={t.id} value={t.key}>{t.nameAr}</SelectItem>
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
                            <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', platformTypeBadgeClass(platformTypes.find((t) => t.key === p.category)?.color))}>
                              <CatIcon className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{p.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{p.slug}</code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn('text-xs', platformTypeBadgeClass(platformTypes.find((t) => t.key === p.category)?.color))}>
                            {platformTypes.find((t) => t.key === p.category)?.nameAr ?? p.category}
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


      {/* Add/Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'تعديل المنصة' : 'إضافة منصة جديدة'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الاسم <span className="text-destructive ms-0.5">*</span></Label>
                <Input value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors((prev) => { const { name, ...rest } = prev; return rest; }); }} placeholder="الاسم" />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label>كود <span className="text-destructive ms-0.5">*</span></Label>
                <Select value={form.slug || undefined} onValueChange={(v) => { setForm({ ...form, slug: v }); setErrors((prev) => { const { slug, ...rest } = prev; return rest; }); }}>
                  <SelectTrigger dir="ltr">
                    <SelectValue placeholder="اختر الكود..." />
                  </SelectTrigger>
                  <SelectContent>
                    {['whatsapp', 'facebook-messenger', 'instagram', 'telegram', 'livechat', 'twitter', 'tiktok', 'snapchat', 'line', 'wechat', 'viber', 'gmail', 'outlook', 'yahoo', 'smtp', 'salla', 'zid', 'shopify', 'woocommerce', 'magento', 'opencart', 'aramex', 'smsa', 'dhl', 'fedex'].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.slug && <p className="text-xs text-destructive mt-1">{errors.slug}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>النوع <span className="text-destructive ms-0.5">*</span></Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as PlatformCategory })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platformTypes.map((t) => (
                    <SelectItem key={t.id} value={t.key}>{t.nameAr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Label>فعال</Label>
              <Switch checked={form.enabled} onCheckedChange={(v) => setForm({ ...form, enabled: v })} />
            </div>

            <div className="space-y-2">
              <Label>الشعار</Label>
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

            {/* Connection Methods */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>طرق الربط</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      connectionMethods: [
                        ...prev.connectionMethods,
                        { id: 'cm_' + Date.now(), name: '', recommended: false, steps: [{ text: '' }] },
                      ],
                    }));
                  }}
                >
                  <Plus className="h-3.5 w-3.5 me-1" />
                  إضافة طريقة
                </Button>
              </div>

              {form.connectionMethods.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-3 border rounded-lg border-dashed">
                  لا توجد طرق ربط — أضف طريقة ربط واحدة على الأقل
                </p>
              )}

              <div className="space-y-3">
                {form.connectionMethods.map((method, mIdx) => (
                  <div key={method.id} className="border rounded-lg">
                    <div className="flex items-center gap-2 p-3 bg-muted/30">
                      <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                      <Input
                        value={method.name}
                        onChange={(e) => {
                          const updated = [...form.connectionMethods];
                          updated[mIdx] = { ...updated[mIdx], name: e.target.value };
                          setForm({ ...form, connectionMethods: updated });
                        }}
                        placeholder="اسم طريقة الربط"
                        className="h-8 flex-1"
                      />
                      <Button
                        type="button"
                        variant={method.recommended ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 gap-1 shrink-0 text-xs"
                        onClick={() => {
                          const updated = [...form.connectionMethods];
                          updated[mIdx] = { ...updated[mIdx], recommended: !updated[mIdx].recommended };
                          setForm({ ...form, connectionMethods: updated });
                        }}
                      >
                        <Star className={cn('h-3 w-3', method.recommended && 'fill-current')} />
                        موصى به
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            connectionMethods: prev.connectionMethods.filter((_, i) => i !== mIdx),
                          }));
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="p-3 space-y-2">
                      {method.steps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2">
                          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500 text-white text-xs font-bold shrink-0">
                            {sIdx + 1}
                          </span>
                          <Input
                            value={step.text}
                            onChange={(e) => {
                              const updated = [...form.connectionMethods];
                              const steps = [...updated[mIdx].steps];
                              steps[sIdx] = { text: e.target.value };
                              updated[mIdx] = { ...updated[mIdx], steps };
                              setForm({ ...form, connectionMethods: updated });
                            }}
                            placeholder="نص الخطوة..."
                            className="h-8 flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                            disabled={method.steps.length <= 1}
                            onClick={() => {
                              const updated = [...form.connectionMethods];
                              const steps = updated[mIdx].steps.filter((_, i) => i !== sIdx);
                              updated[mIdx] = { ...updated[mIdx], steps };
                              setForm({ ...form, connectionMethods: updated });
                            }}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-muted-foreground"
                        onClick={() => {
                          const updated = [...form.connectionMethods];
                          updated[mIdx] = { ...updated[mIdx], steps: [...updated[mIdx].steps, { text: '' }] };
                          setForm({ ...form, connectionMethods: updated });
                        }}
                      >
                        <Plus className="h-3 w-3 me-1" />
                        إضافة خطوة
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>إلغاء</Button>
            <Button onClick={submit}>
              {editingId ? 'حفظ التغييرات' : 'إضافة المنصة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
