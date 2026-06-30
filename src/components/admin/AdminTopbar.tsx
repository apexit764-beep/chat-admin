import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Moon, Search, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { CommandPalette } from '@components/ui';
import { cn } from '@/lib/utils';
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

const titleMap: Record<string, string> = {
  '/dashboard': 'لوحة التحكم',
  '/clients': 'العملاء',
  '/plans': 'الباقات',
  '/finance': 'المالية',
  '/payments': 'بوابة الدفع',
  '/reports': 'التقارير',
  '/settings': 'الإعدادات',
  '/preview': 'معاينة',
};

const subtitleMap: Record<string, string> = {
  '/dashboard': 'نظرة عامة على أداء النظام',
  '/clients': 'إدارة حسابات العملاء',
  '/plans': 'إدارة الباقات والاشتراكات',
  '/finance': 'المعاملات المالية والفواتير',
  '/payments': 'إعدادات بوابة الدفع',
  '/reports': 'تقارير وإحصائيات مفصلة',
  '/settings': 'إعدادات النظام',
  '/preview': 'معاينة واجهة العميل',
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
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const title = titleMap[location.pathname] ?? 'لوحة التحكم';
  const subtitle = subtitleMap[location.pathname] ?? '';
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <TooltipProvider delayDuration={300}>
      <header className="sticky top-0 z-10 px-6 py-4 flex items-center gap-4">
        {/* Title area */}
        <div className="flex flex-col min-w-0">
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <Button
          variant="outline"
          onClick={() => setCmdOpen(true)}
          className={cn(
            'h-9 gap-2 text-muted-foreground font-normal rounded-xl border-border/60 bg-background/60 backdrop-blur-sm',
            'hidden md:inline-flex w-64 justify-start'
          )}
        >
          <Search className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1 text-start truncate text-xs">بحث...</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-muted border border-border/50 font-mono">
            ⌘K
          </kbd>
        </Button>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 rounded-xl"
                onClick={() => setCmdOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>بحث</TooltipContent>
          </Tooltip>

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

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 end-1.5 h-2 w-2 bg-destructive rounded-full ring-2 ring-background" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>الإشعارات</TooltipContent>
          </Tooltip>

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
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">مدير النظام</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={logout}
                >
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </TooltipProvider>
  );
}
