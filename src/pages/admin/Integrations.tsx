import { useState, useMemo } from 'react';
import { Search, Plug } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { cn } from '@/lib/utils';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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

import {
  type PlatformCategory,
  categoryIcons,
  platformTypeBadgeClass,
} from '@/data/platforms';

export default function Integrations() {
  const platforms = useAdminStore((s) => s.platforms);
  const setPlatforms = useAdminStore((s) => s.setPlatforms);
  const platformTypes = useAdminStore((s) => s.platformTypes);
  const countries = useAdminStore((s) => s.countries);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<PlatformCategory | 'all'>('all');

  const filtered = useMemo(() => {
    let list = platforms;
    if (filterCategory !== 'all') list = list.filter((p) => p.category === filterCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
    }
    return list;
  }, [platforms, search, filterCategory]);

  function toggleEnabled(id: string) {
    setPlatforms((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Plug className="h-7 w-7 text-primary" />
          منصات التكامل
        </h1>
        <p className="text-muted-foreground mt-1">
          تفعيل وإيقاف منصات التكامل المتاحة — قائمة المنصات تأتي من النظام
        </p>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      لا توجد منصات مطابقة
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p, i) => {
                    const CatIcon = categoryIcons[p.category];
                    const type = platformTypes.find((t) => t.key === p.category);
                    return (
                      <TableRow key={p.id}>
                        <TableCell className="text-center text-muted-foreground font-mono text-sm">{i + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', platformTypeBadgeClass(type?.color))}>
                              <CatIcon className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{p.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{p.slug}</code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn('text-xs', platformTypeBadgeClass(type?.color))}>
                            {type?.nameAr ?? p.category}
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
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
