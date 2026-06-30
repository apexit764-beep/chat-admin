import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Moon, Search, Sun, HelpCircle } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { CommandPalette } from '@components/ui';
import { HelpDrawer } from '@components/layout/HelpDrawer';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  '/payments': 'بوابة الدفع (Paymob)',
  '/reports': 'التقارير',
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
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const title = titleMap[location.pathname] ?? 'Apex Solutions';
  const [cmdOpen, setCmdOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

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
      <header className="h-14 bg-card border-b border-border sticky top-0 z-10 flex items-center px-4 lg:px-6 gap-3">
        {/* Title + Admin badge */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
          <Badge variant="secondary" className="hidden md:inline-flex text-[10px] uppercase tracking-wider">
            Admin
          </Badge>
        </div>

        {/* Search / Command Palette trigger */}
        <div className="flex-1 max-w-md hidden md:block mx-4">
          <Button
            variant="outline"
            onClick={() => setCmdOpen(true)}
            className="w-full h-9 justify-start gap-2 text-muted-foreground font-normal rounded-lg"
          >
            <Search className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1 text-start truncate">ابحث في العملاء، الفواتير، الباقات...</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-muted border border-border font-mono pointer-events-none">
              ⌘K
            </kbd>
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ms-auto">
          {/* Mobile search */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9"
                onClick={() => setCmdOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>بحث</TooltipContent>
          </Tooltip>

          {/* Help */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex h-9 w-9"
                onClick={() => setHelpOpen(true)}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>المساعدة</TooltipContent>
          </Tooltip>

          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
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

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 end-1.5 h-2 w-2 bg-destructive rounded-full" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>الإشعارات</TooltipContent>
          </Tooltip>

          {/* User profile dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-2 ms-1 h-9 px-2 rounded-lg"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:block">{user.name}</span>
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
      <HelpDrawer open={helpOpen} onClose={() => setHelpOpen(false)} />
    </TooltipProvider>
  );
}
