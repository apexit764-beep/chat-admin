import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Users,
  Package,
  CreditCard,
  Repeat,
  Building2,
  Settings,
  BarChart3,
  UserCog,
  ArrowRight,
} from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { cn } from '@/lib/utils';

interface Item {
  id: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  section: string;
  action: () => void;
  keywords?: string;
}

export function HeaderSearch(): JSX.Element {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const clients = useAdminStore((s) => s.clients);
  const plans = useAdminStore((s) => s.plans);
  const adminUsers = useAdminStore((s) => s.adminUsers);

  const close = (): void => {
    setOpen(false);
    setActive(0);
  };

  const run = (fn: () => void): void => {
    fn();
    setQuery('');
    setOpen(false);
    setActive(0);
    inputRef.current?.blur();
  };

  const items: Item[] = useMemo(() => {
    const result: Item[] = [];
    const nav = (path: string, label: string, icon: React.ReactNode, hint?: string): Item => ({
      id: `nav-${path}`,
      label,
      hint,
      icon,
      section: 'انتقال سريع',
      action: () => navigate(path),
      keywords: `${label} ${hint ?? ''}`.toLowerCase(),
    });

    result.push(
      nav('/dashboard', 'لوحة التحكم', <BarChart3 className="h-4 w-4" />, 'نظرة عامة على المنصة'),
      nav('/clients', 'العملاء', <Users className="h-4 w-4" />, 'إدارة العملاء'),
      nav('/plans', 'الباقات', <Package className="h-4 w-4" />, 'الباقات والأسعار'),
      nav('/finance', 'المالية', <CreditCard className="h-4 w-4" />, 'الفواتير والمعاملات'),
      nav('/subscriptions', 'الاشتراكات', <Repeat className="h-4 w-4" />, 'اشتراكات العملاء والتجديدات'),
      nav('/team', 'الفريق', <UserCog className="h-4 w-4" />, 'أعضاء الفريق والصلاحيات'),
      nav('/reports', 'التقارير', <BarChart3 className="h-4 w-4" />, 'تحليلات المنصة'),
      nav('/settings', 'الإعدادات', <Settings className="h-4 w-4" />, 'إعدادات النظام'),
    );

    clients.forEach((c) => {
      result.push({
        id: `client-${c.id}`,
        label: c.companyName,
        hint: `${c.contactName} · ${c.email}`,
        icon: <Building2 className="h-4 w-4" />,
        section: 'العملاء',
        action: () => navigate(`/clients/${c.id}`),
        keywords: `${c.companyName} ${c.contactName} ${c.email} ${c.phone}`.toLowerCase(),
      });
    });

    adminUsers.forEach((u) => {
      result.push({
        id: `user-${u.id}`,
        label: u.name,
        hint: u.email,
        icon: <UserCog className="h-4 w-4" />,
        section: 'الفريق',
        action: () => navigate('/team'),
        keywords: `${u.name} ${u.email} ${u.role}`.toLowerCase(),
      });
    });

    plans.forEach((p) => {
      result.push({
        id: `plan-${p.id}`,
        label: p.nameAr,
        hint: p.tagline,
        icon: <Package className="h-4 w-4" />,
        section: 'الباقات',
        action: () => navigate('/plans'),
        keywords: `${p.nameAr} ${p.name} ${p.tagline}`.toLowerCase(),
      });
    });

    return result;
  }, [navigate, clients, plans, adminUsers]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(q) ||
        (it.hint && it.hint.toLowerCase().includes(q)) ||
        (it.keywords && it.keywords.includes(q))
    );
  }, [items, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, Item[]>();
    filtered.forEach((it) => {
      const arr = map.get(it.section) ?? [];
      arr.push(it);
      map.set(it.section, arr);
    });
    return Array.from(map.entries());
  }, [filtered]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  // ⌘K / Ctrl+K focuses the search
  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Keyboard navigation within the dropdown
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        inputRef.current?.blur();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => Math.min(filtered.length - 1, a + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const it = filtered[active];
        if (it) run(it.action);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filtered, active]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Keep active item in view
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector(`[data-idx="${active}"]`);
    if (node) (node as HTMLElement).scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  let runningIdx = 0;
  return (
    <div ref={containerRef} className="relative hidden md:block w-full max-w-md">
      {/* Input */}
      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="ابحث في العملاء أو الباقات أو الموظفين..."
          className={cn(
            'h-9 w-full rounded-xl border bg-background/60 backdrop-blur-sm ps-10 pe-14 text-sm',
            'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40',
            open ? 'border-primary/40' : 'border-border/60'
          )}
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute end-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="مسح"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <kbd className="absolute end-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-muted border border-border/50 font-mono text-muted-foreground pointer-events-none">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full mt-2 w-full min-w-[360px] rounded-xl border border-border bg-popover shadow-2xl overflow-hidden z-50">
          <div ref={listRef} className="max-h-[70vh] overflow-y-auto py-2">
            {grouped.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                لا توجد نتائج لـ "<span className="font-medium">{query}</span>"
              </div>
            ) : (
              grouped.map(([section, list]) => (
                <div key={section} className="px-1 mb-1">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-3 py-1.5">
                    {section}
                  </p>
                  {list.map((it) => {
                    const idx = runningIdx;
                    runningIdx += 1;
                    const isActive = active === idx;
                    return (
                      <button
                        key={it.id}
                        data-idx={idx}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => run(it.action)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-start',
                          isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                        )}
                      >
                        <span
                          className={cn(
                            'h-7 w-7 rounded-md flex items-center justify-center flex-shrink-0',
                            isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {it.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{it.label}</p>
                          {it.hint && <p className="text-xs text-muted-foreground truncate">{it.hint}</p>}
                        </div>
                        {isActive && <ArrowRight className="h-3.5 w-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
          <div className="px-4 py-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-muted border border-border">↑↓</kbd> تنقّل
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-muted border border-border">↵</kbd> اختر
              </span>
            </div>
            <span>{filtered.length} نتيجة</span>
          </div>
        </div>
      )}
    </div>
  );
}
