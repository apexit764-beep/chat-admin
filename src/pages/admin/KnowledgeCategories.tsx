import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, Pencil, Trash2, ChevronUp, ChevronDown, FolderOpen } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import type { KnowledgeCategory } from '@/types';

export default function KnowledgeCategories(): JSX.Element {
  const navigate = useNavigate();
  const categories = useAdminStore((s) => s.knowledgeCategories);
  const articles = useAdminStore((s) => s.knowledgeArticles);
  const addCategory = useAdminStore((s) => s.addKnowledgeCategory);
  const updateCategory = useAdminStore((s) => s.updateKnowledgeCategory);
  const deleteCategory = useAdminStore((s) => s.deleteKnowledgeCategory);
  const reorderCategory = useAdminStore((s) => s.reorderKnowledgeCategory);
  const showToast = useUIStore((s) => s.showToast);

  const [editModal, setEditModal] = useState<{ mode: 'new' | 'edit'; id?: string; name: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<KnowledgeCategory | null>(null);

  const sorted = [...categories].sort((a, b) => a.order - b.order);

  const openNew = (): void => setEditModal({ mode: 'new', name: '' });
  const openEdit = (c: KnowledgeCategory): void => setEditModal({ mode: 'edit', id: c.id, name: c.name });

  const handleSave = (): void => {
    if (!editModal || !editModal.name.trim()) return;
    if (editModal.mode === 'new') {
      addCategory(editModal.name.trim());
      showToast('تمت إضافة التصنيف', 'success');
    } else if (editModal.id) {
      updateCategory(editModal.id, editModal.name.trim());
      showToast('تم تحديث التصنيف', 'success');
    }
    setEditModal(null);
  };

  const handleDelete = (): void => {
    if (!deleteTarget) return;
    deleteCategory(deleteTarget.id);
    const affected = articles.filter((a) => a.categoryId === deleteTarget.id).length;
    showToast(
      affected > 0 ? `تم حذف التصنيف و ${affected} مقال` : 'تم حذف التصنيف',
      'success'
    );
    setDeleteTarget(null);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/knowledge')} className="rounded-full">
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">التصنيفات</h2>
            <p className="text-sm text-muted-foreground">إدارة تصنيفات مقالات قاعدة المعرفة</p>
          </div>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 me-1" />
          تصنيف جديد
        </Button>
      </div>

      {/* Categories table */}
      <Card>
        <CardContent className="p-0">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <FolderOpen className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm">لا توجد تصنيفات</p>
              <Button variant="link" onClick={openNew}>
                <Plus className="h-4 w-4 me-1" /> إنشاء أول تصنيف
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto" dir="rtl">
              <table dir="rtl" className="w-full text-sm">
                <thead className="bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    <th className="text-start px-4 py-3 w-16">الترتيب</th>
                    <th className="text-start px-4 py-3 w-12">#</th>
                    <th className="text-start px-4 py-3">اسم التصنيف</th>
                    <th className="text-start px-4 py-3">Slug</th>
                    <th className="text-center px-4 py-3">عدد المقالات</th>
                    <th className="text-end px-4 py-3 w-32">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sorted.map((cat, idx) => (
                    <tr key={cat.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            disabled={idx === 0}
                            onClick={() => reorderCategory(cat.id, 'up')}
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            disabled={idx === sorted.length - 1}
                            onClick={() => reorderCategory(cat.id, 'down')}
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium">{cat.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{cat.slug}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="secondary">{cat.articleCount}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-0.5 justify-end">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => openEdit(cat)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={() => setDeleteTarget(cat)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit modal */}
      <Dialog open={!!editModal} onOpenChange={(v) => { if (!v) setEditModal(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editModal?.mode === 'new' ? 'تصنيف جديد' : 'تعديل التصنيف'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5 py-2">
            <label className="text-sm font-medium">اسم التصنيف</label>
            <Input
              autoFocus
              value={editModal?.name ?? ''}
              onChange={(e) => setEditModal((m) => (m ? { ...m, name: e.target.value } : m))}
              placeholder="مثل: الأسئلة الشائعة"
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditModal(null)}>إلغاء</Button>
            <Button onClick={handleSave} disabled={!editModal?.name.trim()}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>حذف التصنيف</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            هل تريد حذف التصنيف{' '}
            <span className="font-semibold text-foreground">&ldquo;{deleteTarget?.name}&rdquo;</span>؟
            {deleteTarget && deleteTarget.articleCount > 0 && (
              <span className="block mt-2 text-red-500">
                سيتم حذف {deleteTarget.articleCount} مقال مرتبط بهذا التصنيف.
              </span>
            )}
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>إلغاء</Button>
            <Button variant="destructive" onClick={handleDelete}>حذف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
