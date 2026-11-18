import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useThemeStore } from '@/store/useThemeStore';
import { NAV } from './app-sidebar';

export function SiteHeader(): JSX.Element {
  const { pathname } = useLocation();
  const { theme, toggle } = useThemeStore();
  const title = NAV.find((n) => pathname.startsWith(n.to))?.label ?? '';

  return (
    <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 rounded-t-xl border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {/* on mobile the sidebar is a drawer, so its opener stays in the header */}
        <SidebarTrigger className="-ms-1 md:hidden" />
        <Separator orientation="vertical" className="mx-2 h-4 md:hidden" />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ms-auto flex items-center gap-2">
          <Button asChild size="sm" className="h-8 gap-1.5">
            <Link to="/clients?add=1">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">إضافة عميل</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggle} aria-label="تبديل الوضع">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
