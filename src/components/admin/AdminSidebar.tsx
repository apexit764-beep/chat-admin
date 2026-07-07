import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Repeat,
  Package,
  Banknote,
  BarChart3,
  Settings,
  Activity,
  MessageSquareWarning,
  UsersRound,
  PanelRightClose,
  PanelRightOpen,
  BookOpen,
  MessageCircle,
  LogOut,
  X,
  Plug,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { useConfirm } from '@components/ui';
import { cn } from '@/lib/utils';
import { initials } from '@/utils/format';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: '',
    items: [
      { to: '/dashboard', label: 'نظرة عامة', icon: LayoutDashboard },
    ],
  },
  {
    title: 'العملاء',
    items: [
      { to: '/clients', label: 'العملاء', icon: Users },
      { to: '/conversations', label: 'الدردشة المباشرة', icon: MessageCircle },
      { to: '/widget', label: 'إعدادات المساعد الذكي', icon: Sparkles },
      { to: '/plans', label: 'الباقات', icon: Package },
      { to: '/feedback', label: 'الشكاوى والاقتراحات', icon: MessageSquareWarning },
    ],
  },
  {
    title: 'المالية',
    items: [
      { to: '/finance', label: 'المالية', icon: Banknote },
      { to: '/subscriptions', label: 'الاشتراكات', icon: Repeat },
    ],
  },
  {
    title: 'النظام',
    items: [
      { to: '/team', label: 'الموظفين والصلاحيات', icon: UsersRound },
      { to: '/reports', label: 'التقارير', icon: BarChart3 },
      { to: '/activity', label: 'سجل النشاط', icon: Activity },
      { to: '/knowledge', label: 'قاعدة المعرفة', icon: BookOpen },
      { to: '/integrations', label: 'منصات التكامل', icon: Plug },
      { to: '/settings', label: 'الإعدادات', icon: Settings },
    ],
  },
];

interface SidebarInnerProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate?: () => void;
  mobile?: boolean;
  onCloseMobile?: () => void;
}

function SidebarInner({ collapsed, onToggleCollapse, onNavigate, mobile, onCloseMobile }: SidebarInnerProps): JSX.Element {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { confirm } = useConfirm();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const ok = await confirm({ title: 'تسجيل الخروج', message: 'هل أنت متأكد من تسجيل الخروج؟', variant: 'danger', confirmText: 'خروج' });
    if (ok) logout();
  };

  const toggleBtn = (
    <button
      onClick={onToggleCollapse}
      className="h-8 w-8 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/60 hover:text-white transition-all flex-shrink-0"
    >
      {collapsed ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
    </button>
  );

  const goToProfile = (): void => {
    navigate('/profile');
    onNavigate?.();
  };

  return (
    <>
      {/* Logo area */}
      <div className={cn('flex items-center gap-3 pt-6 pb-4', collapsed ? 'justify-center px-3' : 'px-5')}>
        {collapsed ? (
          <div className="group relative h-10 w-10 flex-shrink-0">
            <NavLink to="/dashboard" className="block h-10 w-10">
              <img src="/qhub-icon.png" alt="Qhub" className="h-10 w-10" />
            </NavLink>
            <button
              onClick={onToggleCollapse}
              className="absolute inset-0 h-10 w-10 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <PanelRightClose className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <NavLink to="/dashboard" className="h-10 w-10 flex-shrink-0" onClick={onNavigate}>
              <img src="/qhub-icon.png" alt="Qhub" className="h-10 w-10" />
            </NavLink>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-bold text-white tracking-wide">Qhub</span>
              <span className="text-[10px] text-white/50">لوحة التحكم</span>
            </div>
            {mobile ? (
              <button
                onClick={onCloseMobile}
                className="h-8 w-8 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/60 hover:text-white transition-all flex-shrink-0"
                aria-label="إغلاق"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              toggleBtn
            )}
          </>
        )}
      </div>

      {/* Main nav items */}
      <ScrollArea className="flex-1 px-3">
        <nav className="flex flex-col gap-0.5">
          {navGroups.map((group, gi) => (
            <div key={gi}>
              {group.title && !collapsed && (
                <div className="px-3 pt-4 pb-1.5 first:pt-0">
                  <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                    {group.title}
                  </span>
                </div>
              )}
              {group.title && collapsed && gi > 0 && (
                <div className="mx-auto my-2 w-6 border-t border-white/10" />
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                const linkEl = (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className={cn(
                      'flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200',
                      collapsed ? 'h-10 w-10 justify-center mx-auto' : 'h-10 px-3',
                      isActive
                        ? 'bg-white/15 text-white shadow-lg shadow-black/10 backdrop-blur-sm'
                        : 'text-white/60 hover:text-white hover:bg-white/8'
                    )}
                  >
                    <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                );
                if (collapsed) {
                  return (
                    <Tooltip key={item.to}>
                      <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                      <TooltipContent side="left" className="font-medium">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  );
                }
                return linkEl;
              })}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User section + Logout */}
      <div
        className={cn(
          'p-3 mt-2 border-t border-white/10 flex items-center gap-2',
          collapsed ? 'flex-col' : ''
        )}
      >
        {user && !collapsed && (
          <>
            <button
              onClick={goToProfile}
              className="flex items-center gap-3 flex-1 min-w-0 rounded-xl px-2 py-1.5 hover:bg-white/8 transition-colors text-start"
              title="الملف الشخصي"
            >
              <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 ring-1 ring-white/20">
                <span className="text-xs font-bold text-white">{initials(user.name)}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-white truncate">{user.name}</span>
                <span className="text-[10px] text-white/50">مدير النظام</span>
              </div>
            </button>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="h-9 w-9 rounded-xl bg-white/8 hover:bg-red-500/25 flex items-center justify-center text-white/70 hover:text-white transition-colors flex-shrink-0"
                  aria-label="تسجيل الخروج"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="font-medium">تسجيل الخروج</TooltipContent>
            </Tooltip>
          </>
        )}
        {user && collapsed && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={goToProfile}
                  className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center flex-shrink-0 ring-1 ring-white/20 transition-colors"
                >
                  <span className="text-xs font-bold text-white">{initials(user.name)}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="font-medium">
                الملف الشخصي — {user.name}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="h-9 w-9 rounded-xl bg-white/8 hover:bg-red-500/25 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  aria-label="تسجيل الخروج"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="font-medium">تسجيل الخروج</TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </>
  );
}

export function AdminSidebar(): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);
  const mobileOpen = useUIStore((s) => s.mobileSidebarOpen);
  const setMobileOpen = useUIStore((s) => s.setMobileSidebarOpen);

  const sidebarWidth = collapsed ? 'w-[68px]' : 'w-[240px]';

  // Close mobile sidebar on route change (handled inside SidebarInner via onNavigate)
  // Close on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen, setMobileOpen]);

  return (
    <TooltipProvider delayDuration={0}>
      {/* Desktop sidebar */}
      <aside
        dir="rtl"
        className={cn(
          'hidden lg:flex h-[calc(100vh-24px)] sticky top-3 rounded-2xl flex-col z-30 transition-[width] duration-300 ease-in-out overflow-hidden',
          sidebarWidth
        )}
        style={{
          background: 'linear-gradient(180deg, #0A1E3D 0%, #0D2B52 40%, #113B6E 70%, #1565A0 100%)',
        }}
      >
        <SidebarInner collapsed={collapsed} onToggleCollapse={() => setCollapsed((v) => !v)} />
      </aside>

      {/* Mobile drawer overlay */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileOpen(false)}
      />
      <aside
        dir="rtl"
        className={cn(
          'lg:hidden fixed top-0 right-0 h-full w-[280px] z-50 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{
          background: 'linear-gradient(180deg, #0A1E3D 0%, #0D2B52 40%, #113B6E 70%, #1565A0 100%)',
        }}
      >
        <SidebarInner
          collapsed={false}
          onToggleCollapse={() => setMobileOpen(false)}
          onNavigate={() => setMobileOpen(false)}
          mobile
          onCloseMobile={() => setMobileOpen(false)}
        />
      </aside>
    </TooltipProvider>
  );
}
