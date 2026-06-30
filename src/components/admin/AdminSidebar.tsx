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
  LogOut,
  HelpCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { HelpDrawer } from '@components/layout/HelpDrawer';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

const navItems = [
  { to: '/dashboard', label: 'نظرة عامة', icon: LayoutDashboard },
  { to: '/clients', label: 'العملاء', icon: Users },
  { to: '/plans', label: 'الباقات', icon: Package },
  { to: '/finance', label: 'المالية', icon: Banknote },
  { to: '/payments', label: 'بوابة الدفع', icon: CreditCard },
  { to: '/reports', label: 'التقارير', icon: BarChart3 },
  { to: '/preview', label: 'معاينة', icon: Eye },
];

const bottomItems = [
  { type: 'link' as const, to: '/settings', label: 'الإعدادات', icon: Settings },
  { type: 'action' as const, action: 'help', label: 'المساعدة', icon: HelpCircle },
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
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const [helpOpen, setHelpOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 'w-[68px]' : 'w-[240px]';

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'h-[calc(100vh-24px)] sticky top-3 rounded-2xl flex flex-col z-30 transition-[width] duration-300 ease-in-out overflow-hidden',
          sidebarWidth
        )}
        style={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        }}
      >
        {/* Logo area */}
        <div className={cn(
          'flex items-center gap-3 pt-6 pb-4',
          collapsed ? 'justify-center px-3' : 'px-5'
        )}>
          <NavLink to="/dashboard" className="h-10 w-10 flex-shrink-0">
            <img src="/qhub-icon.svg" alt="Qhub" className="h-10 w-10" />
          </NavLink>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white tracking-wide">Qhub</span>
              <span className="text-[10px] text-white/50">لوحة التحكم</span>
            </div>
          )}
        </div>

        {/* Section label */}
        {!collapsed && (
          <div className="px-5 mb-2">
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">القائمة</span>
          </div>
        )}

        {/* Main nav items */}
        <ScrollArea className="flex-1 px-3">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
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
          </nav>
        </ScrollArea>

        {/* Divider */}
        <div className="mx-4 my-2 h-px bg-white/10" />

        {/* Bottom items */}
        {!collapsed && (
          <div className="px-5 mb-2">
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">أدوات</span>
          </div>
        )}
        <div className="flex flex-col gap-1 px-3 pb-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;

            if (item.type === 'link' && item.to) {
              const isActive = location.pathname === item.to;
              const link = (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={cn(
                    'flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200',
                    collapsed ? 'h-10 w-10 justify-center mx-auto' : 'h-10 px-3',
                    isActive
                      ? 'bg-white/15 text-white shadow-lg shadow-black/10'
                      : 'text-white/60 hover:text-white hover:bg-white/8'
                  )}
                >
                  <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
              if (collapsed) {
                return (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="left" className="font-medium">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }
              return link;
            }

            if (item.type === 'action' && item.action === 'help') {
              const btn = (
                <button
                  key={item.label}
                  onClick={() => setHelpOpen(true)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all duration-200',
                    collapsed ? 'h-10 w-10 justify-center mx-auto' : 'h-10 px-3 w-full'
                  )}
                >
                  <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
              if (collapsed) {
                return (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>{btn}</TooltipTrigger>
                    <TooltipContent side="left" className="font-medium">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }
              return btn;
            }

            return null;
          })}

          {/* Logout */}
          {(() => {
            const logoutBtn = (
              <button
                onClick={logout}
                className={cn(
                  'flex items-center gap-3 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200',
                  collapsed ? 'h-10 w-10 justify-center mx-auto' : 'h-10 px-3 w-full'
                )}
              >
                <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
                {!collapsed && <span className="truncate">تسجيل الخروج</span>}
              </button>
            );
            if (collapsed) {
              return (
                <Tooltip>
                  <TooltipTrigger asChild>{logoutBtn}</TooltipTrigger>
                  <TooltipContent side="left" className="font-medium">تسجيل الخروج</TooltipContent>
                </Tooltip>
              );
            }
            return logoutBtn;
          })()}
        </div>

        {/* Divider */}
        <div className="mx-4 my-1 h-px bg-white/10" />

        {/* User section + collapse toggle */}
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
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="h-8 w-8 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/60 hover:text-white transition-all flex-shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <div className="p-3 pt-0 flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setCollapsed(false)}
                  className="h-8 w-8 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">توسيع القائمة</TooltipContent>
            </Tooltip>
          </div>
        )}
      </aside>

      <HelpDrawer open={helpOpen} onClose={() => setHelpOpen(false)} />
    </TooltipProvider>
  );
}
