import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Moon, Sun, User, Settings, Shield, Bell, LogOut } from 'lucide-react';
import { NotificationDropdown } from '@/components/admin/NotificationDropdown';
import { HeaderSearch } from '@/components/admin/HeaderSearch';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'نظرة عامة',
  '/clients': 'العملاء',
  '/plans': 'الباقات',
  '/finance': 'المالية',
  '/subscriptions': 'الاشتراكات',
  '/reports': 'التقارير',
  '/feedback': 'الشكاوى والاقتراحات',
  '/activity': 'سجل النشاط',
  '/team': 'الفريق',
  '/knowledge': 'قاعدة المعرفة',
  '/conversations': 'الدردشة المباشرة',
  '/notifications': 'الإشعارات',
  '/settings': 'الإعدادات',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function AdminTopbar(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const segments = location.pathname.split('/').filter(Boolean);
  const currentLabel = breadcrumbMap[location.pathname] ?? breadcrumbMap['/' + segments[0]] ?? 'لوحة التحكم';

  return (
    <TooltipProvider delayDuration={300}>
      <header className="sticky top-0 z-10 px-6 py-3 flex items-center gap-4 bg-background/80 backdrop-blur-sm border-b border-border/40">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm min-w-0">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            لوحة التحكم
          </Link>
          {location.pathname !== '/dashboard' && (
            <>
              <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/60" />
              <span className="text-foreground font-medium truncate">{currentLabel}</span>
            </>
          )}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Inline search with live results (desktop) */}
        <HeaderSearch />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>تبديل الوضع</TooltipContent>
          </Tooltip>

          <NotificationDropdown />

          {/* User */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-2 ms-1 h-9 px-2 rounded-xl"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal px-3 py-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer gap-2 px-3"
                  onClick={() => navigate('/settings')}
                >
                  <User className="h-4 w-4" />
                  الملف الشخصي
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer gap-2 px-3"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="h-4 w-4" />
                  الإعدادات
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer gap-2 px-3"
                  onClick={() => navigate('/activity')}
                >
                  <Shield className="h-4 w-4" />
                  سجل النشاط
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer gap-2 px-3"
                  onClick={() => navigate('/notifications')}
                >
                  <Bell className="h-4 w-4" />
                  الإشعارات
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer gap-2 px-3"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>
    </TooltipProvider>
  );
}
