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
  ExternalLink,
  Eye,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { clientDashboardUrl } from '@/utils/mode';
import { HelpDrawer } from '@components/layout/HelpDrawer';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  { type: 'external' as const, href: '', label: 'فتح داشبورد العميل', icon: ExternalLink },
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
  const [collapsed, setCollapsed] = useState(true);

  const sidebarWidth = collapsed ? 'w-14' : 'w-60';

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'flex-shrink-0 h-screen sticky top-0 bg-card border-s border-border flex flex-col z-30 transition-[width] duration-200 ease-in-out',
          sidebarWidth
        )}
      >
        {/* Logo + collapse toggle */}
        <div className={cn('flex items-center h-14 px-2', collapsed ? 'justify-center' : 'justify-between px-3')}>
          <NavLink
            to="/dashboard"
            className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-base shadow-sm flex-shrink-0"
          >
            S
          </NavLink>
          {!collapsed && (
            <span className="text-sm font-bold text-foreground truncate mx-2">Sekaa</span>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn('h-8 w-8 flex-shrink-0', collapsed && 'hidden')}
                onClick={() => setCollapsed((v) => !v)}
              >
                <PanelRightOpen className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="start">طي القائمة</TooltipContent>
          </Tooltip>
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <div className="flex justify-center px-2 mb-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCollapsed(false)}
                >
                  <PanelRightClose className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="start">توسيع القائمة</TooltipContent>
            </Tooltip>
          </div>
        )}

        <Separator />

        {/* Main nav items */}
        <ScrollArea className="flex-1 py-2">
          <nav className={cn('flex flex-col gap-1', collapsed ? 'items-center px-2' : 'px-2')}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');

              const linkContent = (
                <Button
                  variant="ghost"
                  asChild
                  className={cn(
                    'transition-colors',
                    collapsed ? 'h-9 w-9 p-0' : 'w-full justify-start gap-3 h-9 px-3',
                    isActive &&
                      'bg-sidebar-accent text-sidebar-accent-foreground bg-accent text-accent-foreground font-medium'
                  )}
                >
                  <NavLink to={item.to}>
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                </Button>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.to}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="start">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={item.to}>{linkContent}</div>;
            })}
          </nav>
        </ScrollArea>

        <Separator />

        {/* Bottom items */}
        <div className={cn('flex flex-col gap-1 py-2', collapsed ? 'items-center px-2' : 'px-2')}>
          {bottomItems.map((item) => {
            const Icon = item.icon;

            if (item.type === 'external') {
              const link = (
                <Button variant="ghost" asChild className={cn(collapsed ? 'h-9 w-9 p-0' : 'w-full justify-start gap-3 h-9 px-3')}>
                  <a href={clientDashboardUrl()} target="_blank" rel="noreferrer">
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </a>
                </Button>
              );
              if (collapsed) {
                return (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="start">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }
              return <div key={item.label}>{link}</div>;
            }

            if (item.type === 'link' && item.to) {
              const isActive = location.pathname === item.to;
              const link = (
                <Button
                  variant="ghost"
                  asChild
                  className={cn(
                    collapsed ? 'h-9 w-9 p-0' : 'w-full justify-start gap-3 h-9 px-3',
                    isActive && 'bg-accent text-accent-foreground font-medium'
                  )}
                >
                  <NavLink to={item.to}>
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                </Button>
              );
              if (collapsed) {
                return (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="start">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }
              return <div key={item.label}>{link}</div>;
            }

            if (item.type === 'action' && item.action === 'help') {
              const btn = (
                <Button
                  variant="ghost"
                  className={cn(collapsed ? 'h-9 w-9 p-0' : 'w-full justify-start gap-3 h-9 px-3')}
                  onClick={() => setHelpOpen(true)}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Button>
              );
              if (collapsed) {
                return (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>{btn}</TooltipTrigger>
                    <TooltipContent side="start">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }
              return <div key={item.label}>{btn}</div>;
            }

            return null;
          })}
        </div>

        <Separator />

        {/* User section */}
        <div className={cn('p-2', collapsed ? 'flex flex-col items-center' : '')}>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'gap-3',
                    collapsed ? 'h-9 w-9 p-0' : 'w-full justify-start h-10 px-2'
                  )}
                >
                  <Avatar className="h-7 w-7 flex-shrink-0">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="flex flex-col items-start text-start min-w-0">
                      <span className="text-sm font-medium truncate w-full">{user.name}</span>
                      <span className="text-xs text-muted-foreground truncate w-full">مدير</span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end" className="w-48">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">مدير النظام</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <NavLink to="/settings" className="cursor-pointer">
                    <Settings className="h-4 w-4 me-2" />
                    الإعدادات
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 me-2" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="start">تسجيل الخروج</TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>

      <HelpDrawer open={helpOpen} onClose={() => setHelpOpen(false)} />
    </TooltipProvider>
  );
}
