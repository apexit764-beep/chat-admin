import { useState } from 'react';
import { Plus, Edit2, Trash2, Briefcase, ArrowRight } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { useConfirm } from '@components/ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

export default function Industries({ onBack }: { onBack?: () => void }): JSX.Element {
  const industries = useAdminStore((s) => s.industries);
  const clients = useAdminStore((s) => s.clients);
  const addIndustry = useAdminStore((s) => s.addIndustry);
  const updateIndustry = useAdminStore((s) => s.updateIndustry);
  const deleteIndustry = useAdminStore((s) => s.deleteIndustry);
  const { confirm } = useConfirm();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const openAdd = () => {
    setEditId(null);
    setName('');
    setError('');
    setOpen(true);
  };

  const openEdit = (id: string, currentName: string) => {
    setEditId(id);
    setName(currentName);
    setError('');
    setOpen(true);
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) { setError('الاسم مطلوب'); return; }
    const duplicate = industries.some((i) => i.name === trimmed && i.id !== editId);
    if (duplicate) { setError('مجال العمل موجود مسبقاً'); return; }

    if (editId) {
      updateIndustry(editId, trimmed);
    } else {
      addIndustry(trimmed);
    }
    setOpen(false);
  };

  const handleDelete = async (id: string, indName: string) => {
    const usedBy = clients.filter((c) => c.industry === indName).length;
    const msg = usedBy > 0
      ? `هذا المجال مستخدم في ${usedBy} عميل. هل تريد حذفه؟`
      : `هل تريد حذف "${indName}"؟`;
    const ok = await confirm({ title: 'حذف مجال العمل', message: msg });
    if (ok) deleteIndustry(id);
  };

  const getClientCount = (indName: string) => clients.filter((c) => c.industry === indName).length;

  return (
    <div className="p-4 lg:p-6 space-y-4 page-fade">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9">
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold">مجالات العمل</h2>
            <p className="text-sm text-muted-foreground">إدارة مجالات عمل العملاء</p>
          </div>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة مجال
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              قائمة مجالات العمل
            </CardTitle>
            <Badge variant="secondary">{industries.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-start">#</TableHead>
                <TableHead className="text-start">مجال العمل</TableHead>
                <TableHead className="text-start">عدد العملاء</TableHead>
                <TableHead className="text-start w-[120px]">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {industries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                    لا توجد مجالات عمل. أضف مجالاً جديداً للبدء.
                  </TableCell>
                </TableRow>
              )}
              {industries.map((ind, i) => {
                const count = getClientCount(ind.name);
                return (
                  <TableRow key={ind.id}>
                    <TableCell className="text-muted-foreground text-sm">{i + 1}</TableCell>
                    <TableCell className="font-medium">{ind.name}</TableCell>
                    <TableCell>
                      {count > 0 ? (
                        <Badge variant="secondary" className="text-xs">{count} عميل</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(ind.id, ind.name)}>
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(ind.id, ind.name)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? 'تعديل مجال العمل' : 'إضافة مجال عمل'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label htmlFor="ind-name">اسم المجال</Label>
              <Input
                id="ind-name"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="مثال: عقارات، تقنية، صحة..."
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
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
