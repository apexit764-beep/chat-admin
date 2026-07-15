import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  FileText,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Pencil,
  Trash2,
  FolderOpen,
  BookOpen,
  ChevronUp,
  ChevronDown,
  Settings2,
} from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { timeAgo } from '@/utils/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { RichEditor } from '@/components/ui/rich-editor';
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
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ArticleStatus, KnowledgeArticle } from '@/types';

const slugify = (s: string): string =>
  s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-ء-ي]/g, '');

const stripHtml = (html: string): string => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export default function KnowledgeBase(): JSX.Element {
  const navigate = useNavigate();
  const categories = useAdminStore((s) => s.knowledgeCategories);
  const articles = useAdminStore((s) => s.knowledgeArticles);
  const addArticle = useAdminStore((s) => s.addKnowledgeArticle);
  const updateArticle = useAdminStore((s) => s.updateKnowledgeArticle);
  const deleteArticle = useAdminStore((s) => s.deleteKnowledgeArticle);
  const moveArticle = useAdminStore((s) => s.moveKnowledgeArticle);

  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Article modal
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleSlug, setArticleSlug] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleCategoryId, setArticleCategoryId] = useState('');
  const [articleStatus, setArticleStatus] = useState<ArticleStatus>('draft');
  const [articleMetaTitle, setArticleMetaTitle] = useState('');
  const [articleMetaDescription, setArticleMetaDescription] = useState('');
  const [showSeo, setShowSeo] = useState(false);

  // View modal
  const [viewArticle, setViewArticle] = useState<KnowledgeArticle | null>(null);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<KnowledgeArticle | null>(null);

  // Stats
  const stats = useMemo(() => ({
    total: articles.length,
    published: articles.filter((a) => a.status === 'published').length,
    totalViews: articles.reduce((sum, a) => sum + a.views, 0),
  }), [articles]);

  // Filtered articles — search covers title + content
  const filtered = useMemo(() => {
    let list = [...articles];
    if (selectedCategoryId) {
      list = list.filter((a) => a.categoryId === selectedCategoryId);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) =>
        a.title.toLowerCase().includes(q) ||
        stripHtml(a.content).toLowerCase().includes(q)
      );
    }
    // Sort: within a category by sortOrder ascending; otherwise by updatedAt desc
    if (selectedCategoryId) {
      return list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [articles, selectedCategoryId, search]);

  const getCategoryName = (catId: string): string =>
    categories.find((c) => c.id === catId)?.name ?? '—';

  const openNewArticle = (): void => {
    setEditingArticle(null);
    setArticleTitle('');
    setArticleSlug('');
    setArticleContent('');
    setArticleCategoryId(selectedCategoryId ?? categories[0]?.id ?? '');
    setArticleStatus('draft');
    setArticleMetaTitle('');
    setArticleMetaDescription('');
    setShowSeo(false);
    setArticleModalOpen(true);
  };

  const openEditArticle = (article: KnowledgeArticle): void => {
    setEditingArticle(article);
    setArticleTitle(article.title);
    setArticleSlug(article.slug);
    setArticleContent(article.content);
    setArticleCategoryId(article.categoryId);
    setArticleStatus(article.status);
    setArticleMetaTitle(article.metaTitle);
    setArticleMetaDescription(article.metaDescription);
    setShowSeo(false);
    setArticleModalOpen(true);
  };

  const handleSaveArticle = (): void => {
    if (!articleTitle.trim() || !articleCategoryId) return;
    const finalSlug = articleSlug.trim() || slugify(articleTitle);
    const finalMetaTitle = articleMetaTitle.trim() || articleTitle;
    const finalMetaDesc = articleMetaDescription.trim() || stripHtml(articleContent).slice(0, 155);
    if (editingArticle) {
      updateArticle(editingArticle.id, {
        title: articleTitle.trim(),
        slug: finalSlug,
        content: articleContent,
        categoryId: articleCategoryId,
        status: articleStatus,
        metaTitle: finalMetaTitle,
        metaDescription: finalMetaDesc,
      });
    } else {
      addArticle({
        title: articleTitle.trim(),
        slug: finalSlug,
        content: articleContent,
        categoryId: articleCategoryId,
        status: articleStatus,
        metaTitle: finalMetaTitle,
        metaDescription: finalMetaDesc,
      });
    }
    setArticleModalOpen(false);
  };

  const handleConfirmDelete = (): void => {
    if (!deleteTarget) return;
    deleteArticle(deleteTarget.id);
    setDeleteTarget(null);
  };

  const toggleArticleStatus = (article: KnowledgeArticle): void => {
    updateArticle(article.id, {
      status: article.status === 'published' ? 'draft' : 'published',
    });
  };

  const canReorder = !!selectedCategoryId;

  return (
    <div className="p-4 lg:p-6 space-y-5 page-fade">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">قاعدة المعرفة</h2>
          <p className="text-sm text-muted-foreground">المقالات التي تظهر للعملاء في نافذة المساعدة</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/knowledge/categories')}>
            <Settings2 className="h-4 w-4 me-1" />
            التصنيفات
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
              <p className="text-2xl font-bold">{stats.totalViews.toLocaleString('ar-SA')}</p>
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
            {[...categories].sort((a, b) => a.order - b.order).map((cat) => (
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
                placeholder="بحث في العنوان أو المحتوى..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-9"
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {filtered.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="لا توجد مقالات"
                message={search ? 'جرّب تعديل بحثك' : 'ابدأ بإضافة مقالك الأول'}
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {canReorder && <TableHead className="w-20">الترتيب</TableHead>}
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>العنوان</TableHead>
                      <TableHead>التصنيف</TableHead>
                      <TableHead className="text-center">المشاهدات</TableHead>
                      <TableHead className="text-center">مفيد / غير مفيد</TableHead>
                      <TableHead>آخر تحديث</TableHead>
                      <TableHead className="text-center">منشور</TableHead>
                      <TableHead className="text-center">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((article, idx) => (
                      <TableRow key={article.id}>
                        {canReorder && (
                          <TableCell>
                            <div className="flex items-center gap-0.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                disabled={idx === 0}
                                onClick={() => moveArticle(article.id, 'up')}
                              >
                                <ChevronUp className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                disabled={idx === filtered.length - 1}
                                onClick={() => moveArticle(article.id, 'down')}
                              >
                                <ChevronDown className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                        <TableCell className="text-xs text-muted-foreground font-mono">{idx + 1}</TableCell>
                        <TableCell className="font-medium max-w-[250px] truncate">
                          {article.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {getCategoryName(article.categoryId)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {article.views.toLocaleString('ar-SA')}
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
                        <TableCell className="text-center">
                          <TooltipProvider delayDuration={300}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex">
                                  <Switch
                                    checked={article.status === 'published'}
                                    onCheckedChange={() => toggleArticleStatus(article)}
                                  />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {article.status === 'published' ? 'تحويل لمسودة' : 'نشر المقال'}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setViewArticle(article)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEditArticle(article)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                              onClick={() => setDeleteTarget(article)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
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
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingArticle ? 'تعديل المقال' : 'مقال جديد'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">العنوان</label>
                <Input
                  value={articleTitle}
                  onChange={(e) => {
                    setArticleTitle(e.target.value);
                    if (!editingArticle) setArticleSlug(slugify(e.target.value));
                  }}
                  placeholder="عنوان المقال"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Slug</label>
                <Input
                  value={articleSlug}
                  onChange={(e) => setArticleSlug(slugify(e.target.value))}
                  placeholder="article-slug"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                <label className="text-sm font-medium">الحالة</label>
                <Select value={articleStatus} onValueChange={(v) => setArticleStatus(v as ArticleStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">مسودة</SelectItem>
                    <SelectItem value="published">منشور</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">المحتوى</label>
              <RichEditor
                value={articleContent}
                onChange={setArticleContent}
                placeholder="اكتب محتوى المقال هنا..."
                minHeight={280}
              />
            </div>

            <div className="border rounded-xl">
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/40 transition-colors"
                onClick={() => setShowSeo((v) => !v)}
              >
                <span className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-muted-foreground" />
                  إعدادات SEO
                </span>
                {showSeo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {showSeo && (
                <div className="p-4 border-t space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">عنوان الميتا</label>
                    <Input
                      value={articleMetaTitle}
                      onChange={(e) => setArticleMetaTitle(e.target.value)}
                      placeholder={articleTitle || 'يستخدم عنوان المقال إذا تُرك فارغاً'}
                      maxLength={70}
                    />
                    <p className="text-[11px] text-muted-foreground">{articleMetaTitle.length}/70 حرف</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">وصف الميتا</label>
                    <textarea
                      value={articleMetaDescription}
                      onChange={(e) => setArticleMetaDescription(e.target.value)}
                      placeholder="وصف مختصر يظهر في نتائج البحث"
                      rows={3}
                      maxLength={160}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      dir="rtl"
                    />
                    <p className="text-[11px] text-muted-foreground">{articleMetaDescription.length}/160 حرف</p>
                  </div>
                </div>
              )}
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

      {/* View article modal */}
      <Dialog open={!!viewArticle} onOpenChange={(v) => { if (!v) setViewArticle(null); }}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewArticle?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline">{viewArticle ? getCategoryName(viewArticle.categoryId) : ''}</Badge>
              <Badge variant={viewArticle?.status === 'published' ? 'default' : 'secondary'}>
                {viewArticle?.status === 'published' ? 'منشور' : 'مسودة'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {viewArticle ? timeAgo(viewArticle.updatedAt) : ''}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {viewArticle?.views.toLocaleString('ar-SA')} مشاهدة
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <ThumbsUp className="h-3.5 w-3.5" />
                {viewArticle?.helpful}
              </span>
              <span className="inline-flex items-center gap-1 text-red-500">
                <ThumbsDown className="h-3.5 w-3.5" />
                {viewArticle?.notHelpful}
              </span>
            </div>
            <div className="border rounded-xl p-4">
              <div
                className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: viewArticle?.content ?? '' }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewArticle(null)}>
              إغلاق
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
            هل أنت متأكد من حذف المقال{' '}
            <span className="font-semibold text-foreground">&ldquo;{deleteTarget?.title}&rdquo;</span>؟
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
