import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  FileText,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Pencil,
  Trash2,
  FolderOpen,
  BookOpen,
} from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { timeAgo } from '@/utils/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ArticleStatus, KnowledgeArticle } from '@/types';

export default function KnowledgeBase(): JSX.Element {
  const categories = useAdminStore((s) => s.knowledgeCategories);
  const articles = useAdminStore((s) => s.knowledgeArticles);
  const addCategory = useAdminStore((s) => s.addKnowledgeCategory);
  const deleteCategory = useAdminStore((s) => s.deleteKnowledgeCategory);
  const addArticle = useAdminStore((s) => s.addKnowledgeArticle);
  const updateArticle = useAdminStore((s) => s.updateKnowledgeArticle);
  const deleteArticle = useAdminStore((s) => s.deleteKnowledgeArticle);

  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Article modal
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleCategoryId, setArticleCategoryId] = useState('');
  const [articleStatus, setArticleStatus] = useState<ArticleStatus>('draft');

  // Category modal
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'article' | 'category'; id: string; name: string } | null>(null);

  // Stats
  const stats = useMemo(() => ({
    total: articles.length,
    published: articles.filter((a) => a.status === 'published').length,
    totalViews: articles.reduce((sum, a) => sum + a.views, 0),
  }), [articles]);

  // Filtered articles
  const filtered = useMemo(() => {
    let list = [...articles];
    if (selectedCategoryId) {
      list = list.filter((a) => a.categoryId === selectedCategoryId);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(q));
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [articles, selectedCategoryId, search]);

  const getCategoryName = (catId: string): string =>
    categories.find((c) => c.id === catId)?.name ?? '—';

  // Open article modal
  const openNewArticle = (): void => {
    setEditingArticle(null);
    setArticleTitle('');
    setArticleContent('');
    setArticleCategoryId(categories[0]?.id ?? '');
    setArticleStatus('draft');
    setArticleModalOpen(true);
  };

  const openEditArticle = (article: KnowledgeArticle): void => {
    setEditingArticle(article);
    setArticleTitle(article.title);
    setArticleContent(article.content);
    setArticleCategoryId(article.categoryId);
    setArticleStatus(article.status);
    setArticleModalOpen(true);
  };

  const handleSaveArticle = (): void => {
    if (!articleTitle.trim() || !articleCategoryId) return;
    if (editingArticle) {
      updateArticle(editingArticle.id, {
        title: articleTitle.trim(),
        content: articleContent.trim(),
        categoryId: articleCategoryId,
        status: articleStatus,
      });
    } else {
      addArticle({
        title: articleTitle.trim(),
        content: articleContent.trim(),
        categoryId: articleCategoryId,
        status: articleStatus,
      });
    }
    setArticleModalOpen(false);
  };

  const handleSaveCategory = (): void => {
    if (!categoryName.trim()) return;
    addCategory(categoryName.trim());
    setCategoryName('');
    setCategoryModalOpen(false);
  };

  const handleConfirmDelete = (): void => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'article') {
      deleteArticle(deleteTarget.id);
    } else {
      deleteCategory(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  const toggleArticleStatus = (article: KnowledgeArticle): void => {
    updateArticle(article.id, {
      status: article.status === 'published' ? 'draft' : 'published',
    });
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 page-fade">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold">قاعدة المعرفة</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setCategoryModalOpen(true)}>
            <Plus className="h-4 w-4 me-1" />
            تصنيف جديد
          </Button>
          <Button onClick={openNewArticle}>
            <Plus className="h-4 w-4 me-1" />
            مقال جديد
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">إجمالي المقالات</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.published}</p>
              <p className="text-xs text-muted-foreground">مقالات منشورة</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Eye className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">إجمالي المشاهدات</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main layout: sidebar + table */}
      <div className="flex gap-4 flex-col lg:flex-row">
        {/* Right sidebar — categories */}
        <Card className="w-full lg:w-64 flex-shrink-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-primary" />
              التصنيفات
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-1">
            <button
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                selectedCategoryId === null
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted/60'
              )}
              onClick={() => setSelectedCategoryId(null)}
            >
              <span>الكل</span>
              <Badge variant="secondary" className="text-[10px] h-5 min-w-[1.5rem] justify-center">
                {articles.length}
              </Badge>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                  selectedCategoryId === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted/60'
                )}
                onClick={() => setSelectedCategoryId(cat.id)}
              >
                <span>{cat.name}</span>
                <Badge
                  variant="secondary"
                  className={cn(
                    'text-[10px] h-5 min-w-[1.5rem] justify-center',
                    selectedCategoryId === cat.id && 'bg-primary-foreground/20 text-primary-foreground'
                  )}
                >
                  {cat.articleCount}
                </Badge>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Left main — articles table */}
        <Card className="flex-1 min-w-0">
          <CardHeader className="pb-3">
            <div className="relative max-w-xs">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث في المقالات..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-9"
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <FileText className="h-12 w-12 mb-3 opacity-20" />
                <p className="text-sm">لا توجد مقالات</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>العنوان</TableHead>
                      <TableHead>التصنيف</TableHead>
                      <TableHead className="text-center">المشاهدات</TableHead>
                      <TableHead className="text-center">مفيد / غير مفيد</TableHead>
                      <TableHead>آخر تحديث</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium max-w-[250px] truncate">
                          {article.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {getCategoryName(article.categoryId)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {article.views.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-0.5 text-emerald-600">
                              <ThumbsUp className="h-3 w-3" />
                              {article.helpful}
                            </span>
                            <span className="inline-flex items-center gap-0.5 text-red-500">
                              <ThumbsDown className="h-3 w-3" />
                              {article.notHelpful}
                            </span>
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {timeAgo(article.updatedAt)}
                        </TableCell>
                        <TableCell>
                          {article.status === 'published' ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[11px]" variant="outline">
                              منشور
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-400/10 text-slate-500 border-slate-400/20 text-[11px]" variant="outline">
                              مسودة
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditArticle(article)}>
                                <Pencil className="h-4 w-4 me-2" />
                                تعديل
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleArticleStatus(article)}>
                                <Eye className="h-4 w-4 me-2" />
                                {article.status === 'published' ? 'تحويل لمسودة' : 'نشر'}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => setDeleteTarget({ type: 'article', id: article.id, name: article.title })}
                              >
                                <Trash2 className="h-4 w-4 me-2" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Article modal */}
      <Dialog open={articleModalOpen} onOpenChange={setArticleModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingArticle ? 'تعديل المقال' : 'مقال جديد'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">العنوان</label>
              <Input
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                placeholder="عنوان المقال"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">التصنيف</label>
              <Select value={articleCategoryId} onValueChange={setArticleCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">المحتوى</label>
              <Textarea
                value={articleContent}
                onChange={(e) => setArticleContent(e.target.value)}
                placeholder="محتوى المقال..."
                rows={6}
                dir="rtl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">الحالة</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={articleStatus === 'published'}
                    onChange={() => setArticleStatus('published')}
                    className="accent-primary"
                  />
                  <span className="text-sm">منشور</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={articleStatus === 'draft'}
                    onChange={() => setArticleStatus('draft')}
                    className="accent-primary"
                  />
                  <span className="text-sm">مسودة</span>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setArticleModalOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveArticle} disabled={!articleTitle.trim() || !articleCategoryId}>
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category modal */}
      <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>تصنيف جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">اسم التصنيف</label>
              <Input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="اسم التصنيف"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCategoryModalOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveCategory} disabled={!categoryName.trim()}>
              إنشاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            هل أنت متأكد من حذف {deleteTarget?.type === 'article' ? 'المقال' : 'التصنيف'}{' '}
            <span className="font-semibold text-foreground">&ldquo;{deleteTarget?.name}&rdquo;</span>؟
            {deleteTarget?.type === 'category' && (
              <span className="block mt-1 text-red-500">سيتم حذف جميع المقالات المرتبطة بهذا التصنيف.</span>
            )}
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
