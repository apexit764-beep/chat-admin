import { ReactNode, useMemo, useState } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Inbox as InboxIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export interface Column<T> {
  key: string;
  header: string;
  accessor?: (row: T) => string | number | undefined | null;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  hideOn?: 'sm' | 'md' | 'lg' | 'xl';
  width?: string;
  align?: 'start' | 'end' | 'center';
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  searchPlaceholder?: string;
  searchAccessor?: (row: T) => string;
  toolbar?: ReactNode;
  actions?: ReactNode;
  searchable?: boolean;
  pageSize?: number;
  emptyState?: ReactNode;
  selectable?: boolean;
  onSelectionChange?: (rows: T[]) => void;
  bulkActions?: (selected: T[], clear: () => void) => ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
}

const hideClass = (h?: 'sm' | 'md' | 'lg' | 'xl'): string => {
  if (!h) return '';
  return ({
    sm: 'hidden sm:table-cell',
    md: 'hidden md:table-cell',
    lg: 'hidden lg:table-cell',
    xl: 'hidden xl:table-cell',
  } as const)[h];
};

const alignClass = (a?: 'start' | 'end' | 'center'): string => {
  if (!a || a === 'start') return 'text-start';
  if (a === 'end') return 'text-end';
  return 'text-center';
};

export function DataTable<T>({
  data,
  columns,
  rowKey,
  searchPlaceholder = 'بحث...',
  searchAccessor,
  toolbar,
  actions,
  searchable = true,
  pageSize = 10,
  emptyState,
  selectable = false,
  onSelectionChange,
  bulkActions,
  onRowClick,
  className,
}: DataTableProps<T>): JSX.Element {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    if (!search || !searchAccessor) return data;
    const q = search.toLowerCase();
    return data.filter((row) => searchAccessor(row).toLowerCase().includes(q));
  }, [data, search, searchAccessor]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.accessor) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = col.accessor!(a);
      const bv = col.accessor!(b);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv), 'ar')
        : String(bv).localeCompare(String(av), 'ar');
    });
    return arr;
  }, [filtered, sortKey, sortDir, columns]);

  const total = sorted.length;
  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const safePage = Math.min(page, totalPages - 1);
  const start = pageSize > 0 ? safePage * pageSize : 0;
  const end = pageSize > 0 ? start + pageSize : total;
  const pageRows = pageSize > 0 ? sorted.slice(start, end) : sorted;

  const toggleSort = (col: Column<T>): void => {
    if (col.sortable === false || !col.accessor) return;
    if (sortKey === col.key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
    setPage(0);
  };

  const toggleRowSelected = (id: string): void => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (onSelectionChange) onSelectionChange(data.filter((r) => next.has(rowKey(r))));
      return next;
    });
  };

  const toggleAllPage = (): void => {
    setSelected((prev) => {
      const next = new Set(prev);
      const allSelected = pageRows.every((r) => next.has(rowKey(r)));
      if (allSelected) {
        pageRows.forEach((r) => next.delete(rowKey(r)));
      } else {
        pageRows.forEach((r) => next.add(rowKey(r)));
      }
      if (onSelectionChange) onSelectionChange(data.filter((r) => next.has(rowKey(r))));
      return next;
    });
  };

  const clearSelection = (): void => {
    setSelected(new Set());
    if (onSelectionChange) onSelectionChange([]);
  };

  const selectedArr = data.filter((r) => selected.has(rowKey(r)));
  const allOnPageSelected = pageRows.length > 0 && pageRows.every((r) => selected.has(rowKey(r)));

  return (
    <div className={cn('bg-card border border-border rounded-xl overflow-hidden', className)}>
      {/* Toolbar */}
      {(searchable || toolbar || actions) && (
        <div className="p-3 flex flex-wrap items-center gap-3 border-b border-border">
          {searchable && searchAccessor && (
            <div className="relative w-[220px]">
              <Search className="h-4 w-4 absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="w-full h-9 ps-3 pe-9 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-muted-foreground"
              />
            </div>
          )}
          {toolbar && (
            <div className="flex items-center gap-2 flex-wrap">{toolbar}</div>
          )}
          {actions && (
            <div className="flex items-center gap-2 flex-wrap ms-auto">{actions}</div>
          )}
        </div>
      )}

      {/* Bulk action bar */}
      {selectable && selectedArr.length > 0 && (
        <div className="px-4 py-2.5 bg-primary/5 border-b border-primary/20 flex items-center justify-between gap-2 flex-wrap">
          <p className="text-sm font-medium">
            <span className="text-primary font-bold">{selectedArr.length}</span> صف مُحدّد
          </p>
          <div className="flex items-center gap-2">
            {bulkActions && bulkActions(selectedArr, clearSelection)}
            <button onClick={clearSelection} className="text-sm text-muted-foreground hover:text-foreground">
              إلغاء التحديد
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto max-h-[70vh]">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs text-muted-foreground border-b border-border sticky top-0 z-10 backdrop-blur">
            <tr>
              {selectable && (
                <th className="px-3 py-2.5 w-10">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={toggleAllPage}
                    className="h-4 w-4 accent-primary cursor-pointer"
                    aria-label="تحديد الكل"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const isSortable = col.sortable !== false && !!col.accessor;
                return (
                  <th
                    key={col.key}
                    style={col.width ? { width: col.width } : undefined}
                    className={cn(
                      'font-medium px-3 py-2.5 whitespace-nowrap',
                      alignClass(col.align),
                      hideClass(col.hideOn),
                      isSortable && 'cursor-pointer select-none hover:text-foreground',
                      col.className
                    )}
                    onClick={isSortable ? () => toggleSort(col) : undefined}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {isSortable && (
                        isSorted ? (
                          sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-40" />
                        )
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pageRows.map((row) => {
              const id = rowKey(row);
              const isSelected = selected.has(id);
              return (
                <tr
                  key={id}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'transition-colors',
                    onRowClick && 'cursor-pointer',
                    'hover:bg-muted/50',
                    isSelected && 'bg-primary/5'
                  )}
                >
                  {selectable && (
                    <td className="px-3 py-2.5 w-10" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRowSelected(id)}
                        className="h-4 w-4 accent-primary cursor-pointer"
                        aria-label="تحديد الصف"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-3 py-2.5',
                        alignClass(col.align),
                        hideClass(col.hideOn),
                        col.className
                      )}
                    >
                      {col.cell ? col.cell(row) : col.accessor ? String(col.accessor(row) ?? '') : ''}
                    </td>
                  ))}
                </tr>
              );
            })}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-3 py-12 text-center">
                  {emptyState ?? (
                    <div className="flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-2">
                        <InboxIcon className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium">لا توجد نتائج</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {search ? 'جرّب تعديل بحثك أو الفلاتر' : 'لا توجد بيانات لعرضها'}
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageSize > 0 && total > pageSize && (
        <div className="px-4 py-3 border-t border-border flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs text-muted-foreground">
            عرض {start + 1}-{Math.min(end, total)} من {total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="السابق"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            {pageNumbers(safePage, totalPages).map((n, i) =>
              n === '…' ? (
                <span key={`gap-${i}`} className="text-xs text-muted-foreground px-1">…</span>
              ) : (
                <button
                  key={n}
                  onClick={() => setPage(n as number)}
                  className={cn(
                    'h-8 min-w-8 px-2.5 rounded-md text-xs font-medium',
                    safePage === n
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {(n as number) + 1}
                </button>
              )
            )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage === totalPages - 1}
              className="h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="التالي"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function pageNumbers(current: number, total: number): Array<number | '…'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const out: Array<number | '…'> = [0];
  const showLeft = Math.max(1, current - 1);
  const showRight = Math.min(total - 2, current + 1);
  if (showLeft > 1) out.push('…');
  for (let i = showLeft; i <= showRight; i += 1) out.push(i);
  if (showRight < total - 2) out.push('…');
  out.push(total - 1);
  return out;
}
