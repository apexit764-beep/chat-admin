import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { useConfirm } from '@components/ui';
import { PLATFORM_TYPE_COLORS, platformTypeBadgeClass } from '@/data/platforms';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BilingualInput } from '@/components/ui/bilingual-input';
import { EmptyState } from '@/components/ui/empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { PlatformType, PlatformTypeColor } from '@/types';

interface ColorPickerProps {
  value: PlatformTypeColor;
  onChange: (color: PlatformTypeColor) => void;
}

function ColorPicker({ value, onChange }: ColorPickerProps): JSX.Element {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">اللون المميّز</label>
      <div className="flex items-center gap-3">
        {PLATFORM_TYPE_COLORS.map((c) => (
          <button
            key={c.value}
            type="button"
            title={c.label}
            aria-label={c.label}
            aria-pressed={value === c.value}
            onClick={() => onChange(c.value)}
            className={cn(
              'h-9 w-9 rounded-lg transition-transform',
              c.swatch,
              value === c.value
                ? 'ring-2 ring-offset-2 ring-foreground scale-105'
                : 'hover:scale-105'
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default function PlatformTypes(): JSX.Element {
  const navigate = useNavigate();
  const types = useAdminStore((s) => s.platformTypes);
  const platforms = useAdminStore((s) => s.platforms);
  const addType = useAdminStore((s) => s.addPlatformType);
  const updateType = useAdminStore((s) => s.updatePlatformType);
  const deleteType = useAdminStore((s) => s.deletePlatformType);
  const showToast = useUIStore((s) => s.showToast);
  const { confirm } = useConfirm();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [color, setColor] = useState<PlatformTypeColor>('blue');
  const [error, setError] = useState('');

  const usageCount = (key: string): number => platforms.filter((p) => p.category === key).length;

  const openAdd = (): void => {
    setEditId(null);
    setName('');
    setNameAr('');
    setColor('blue');
    setError('');
    setOpen(true);
  };

  const openEdit = (type: PlatformType): void => {
    setEditId(type.id);
    setName(type.name);
    setNameAr(type.nameAr);
    setColor(type.color);
    setError('');
    setOpen(true);
  };

  const handleSave = (): void => {
    const trimmed = name.trim();
    const trimmedAr = nameAr.trim();
    if (!trimmed) { setError('اسم النوع (English) مطلوب'); showToast('يرجى تعبئة الحقول المطلوبة', 'error'); return; }
    if (!trimmedAr) { setError('اسم النوع (العربية) مطلوب'); showToast('يرجى تعبئة الحقول المطلوبة', 'error'); return; }

    const duplicate = types.some(
      (t) => t.id !== editId && (t.name.trim() === trimmed || t.nameAr.trim() === trimmedAr)
    );
    if (duplicate) { setError('هذا النوع موجود مسبقاً'); return; }

    if (editId) {
      updateType(editId, { name: trimmed, nameAr: trimmedAr, color });
      showToast('تم تحديث النوع', 'success');
    } else {
      addType({ name: trimmed, nameAr: trimmedAr, color });
      showToast('تمت إضافة النوع', 'success');
    }
    setOpen(false);
  };

  const handleDelete = async (type: PlatformType): Promise<void> => {
    const used = usageCount(type.key);
    if (used > 0) {
      await confirm({
        title: 'لا يمكن الحذف',
        message: `لا يمكن حذف "${type.nameAr}" لأنه مرتبط بـ ${used} منصة. غيّر نوع هذه المنصات أولاً.`,
        confirmText: 'حسناً',
      });
      return;
    }
    const ok = await confirm({
      title: 'حذف النوع',
      message: `هل تريد حذف "${type.nameAr}"؟`,
      variant: 'warning',
    });
    if (ok) {
      deleteType(type.id);
      showToast('تم حذف النوع', 'success');
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 page-fade">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/integrations')} className="rounded-full">
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">أنواع المنصات</h2>
            <p className="text-sm text-muted-foreground">إدارة الأنواع التي تُصنَّف بها منصات التكامل</p>
          </div>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة نوع
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Tag className="h-4 w-4" />
              قائمة الأنواع
            </CardTitle>
            <Badge variant="secondary">{types.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {types.length === 0 ? (
            <EmptyState
              icon={Tag}
              title="لا توجد أنواع"
              message="أضف نوعاً لتصنيف منصات التكامل"
              action={
                <Button onClick={openAdd}>
                  <Plus className="h-4 w-4 me-1" /> إنشاء أول نوع
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead className="text-start">الاسم (العربية)</TableHead>
                    <TableHead className="text-start">Name (English)</TableHead>
                    <TableHead className="text-start">اللون</TableHead>
                    <TableHead className="text-start">عدد المنصات</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {types.map((type, i) => {
                    const used = usageCount(type.key);
                    return (
                      <TableRow key={type.id}>
                        <TableCell className="text-center text-muted-foreground text-sm">{i + 1}</TableCell>
                        <TableCell className="font-medium">{type.nameAr}</TableCell>
                        <TableCell className="text-start">{type.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn('text-xs', platformTypeBadgeClass(type.color))}>
                            {type.nameAr}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {used > 0 ? (
                            <Badge variant="secondary" className="text-xs">{used} منصة</Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(type)}>
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(type)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? 'تعديل النوع' : 'إضافة نوع'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <BilingualInput
              label="اسم النوع"
              valueAr={nameAr}
              valueEn={name}
              onChangeAr={(v) => { setNameAr(v); setError(''); }}
              onChangeEn={(v) => { setName(v); setError(''); }}
              required
              placeholderAr="مثال: قنوات التواصل"
              placeholderEn="e.g. Communication Channels"
              error={error}
            />
            <ColorPicker value={color} onChange={setColor} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave}>{editId ? 'حفظ' : 'إضافة'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
