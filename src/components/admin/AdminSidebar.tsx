import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  Banknote,
  BarChart3,
  Settings,
  Eye,
  Activity,
  MessageSquareWarning,
  UsersRound,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
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
      { to: '/plans', label: 'الباقات', icon: Package },
      { to: '/feedback', label: 'الشكاوى والاقتراحات', icon: MessageSquareWarning },
    ],
  },
  {
    title: 'المالية',
    items: [
      { to: '/finance', label: 'المالية', icon: Banknote },
      { to: '/payments', label: 'بوابة الدفع', icon: CreditCard },
    ],
  },
  {
    title: 'النظام',
    items: [
      { to: '/team', label: 'الفريق', icon: UsersRound },
      { to: '/reports', label: 'التقارير', icon: BarChart3 },
      { to: '/activity', label: 'سجل النشاط', icon: Activity },
      { to: '/preview', label: 'معاينة', icon: Eye },
      { to: '/settings', label: 'الإعدادات', icon: Settings },
    ],
  },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function AdminSidebar(): JSX.Element {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 'w-[68px]' : 'w-[240px]';

  const toggleBtn = (
    <button
      onClick={() => setCollapsed((v) => !v)}
      className={cn(
        'h-8 w-8 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/60 hover:text-white transition-all flex-shrink-0'
      )}
    >
      {collapsed ? (
        <PanelRightClose className="h-4 w-4" />
      ) : (
        <PanelRightOpen className="h-4 w-4" />
      )}
    </button>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        dir="rtl"
        className={cn(
          'h-[calc(100vh-24px)] sticky top-3 rounded-2xl flex flex-col z-30 transition-[width] duration-300 ease-in-out overflow-hidden',
          sidebarWidth
        )}
        style={{
          background: 'linear-gradient(180deg, #0A1E3D 0%, #0D2B52 40%, #113B6E 70%, #1565A0 100%)',
        }}
      >
        {/* Logo area + collapse toggle */}
        <div className={cn(
          'flex items-center gap-3 pt-6 pb-4',
          collapsed ? 'justify-center px-3' : 'px-5'
        )}>
          {collapsed ? (
            <div className="group relative h-10 w-10 flex-shrink-0">
              <NavLink to="/dashboard" className="block h-10 w-10">
                <img src="/qhub-icon.png" alt="Qhub" className="h-10 w-10" />
              </NavLink>
              <button
                onClick={() => setCollapsed(false)}
                className="absolute inset-0 h-10 w-10 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <PanelRightClose className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/dashboard" className="h-10 w-10 flex-shrink-0">
                <img src="/qhub-icon.png" alt="Qhub" className="h-10 w-10" />
              </NavLink>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-bold text-white tracking-wide">Qhub</span>
                <span className="text-[10px] text-white/50">لوحة التحكم</span>
              </div>
              {toggleBtn}
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
                    <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">{group.title}</span>
                  </div>
                )}
                {group.title && collapsed && gi > 0 && (
                  <div className="mx-auto my-2 w-6 border-t border-white/10" />
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');

                  const linkEl = (
                    <NavLink
                      key={item.to}
                      to={item.to}
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
                        <TooltipContent side="left" className="font-medium">{item.label}</TooltipContent>
                      </Tooltip>
                    );
                  }

                  return linkEl;
                })}
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* User section */}
        <div className={cn('p-3 flex items-center', collapsed ? 'justify-center' : 'gap-3')}>
          {user && !collapsed && (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 ring-1 ring-white/20">
                <span className="text-xs font-bold text-white">{getInitials(user.name)}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-white truncate">{user.name}</span>
                <span className="text-[10px] text-white/50">مدير النظام</span>
              </div>
            </div>
          )}
          {user && collapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 ring-1 ring-white/20 cursor-default">
                  <span className="text-xs font-bold text-white">{getInitials(user.name)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="font-medium">{user.name}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>

    </TooltipProvider>
  );
}
