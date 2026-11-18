import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { EllipsisVertical, Home, LogOut, Moon, PanelRightClose, PanelRightOpen, Sun, UserCog, Users, Wallet, type LucideIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useThemeStore } from '@/store/useThemeStore';
import { useVendorStore, type Vendor } from '@v/store/useVendorStore';
import { FX } from '@v/lib/vendorMath';

export const NAV: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/home', label: 'الرئيسية', icon: Home },
  { to: '/clients', label: 'العملاء', icon: Users },
  { to: '/payouts', label: 'السحب', icon: Wallet },
  { to: '/account', label: 'حسابي', icon: UserCog },
];

const initials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join(' ');

function NavMain(): JSX.Element {
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();
  const close = (): void => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>القائمة</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="group-data-[collapsible=icon]:gap-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <SidebarMenuItem key={to}>
              <SidebarMenuButton asChild tooltip={label} isActive={pathname.startsWith(to)}>
                <NavLink to={to} onClick={close}>
                  <Icon />
                  <span>{label}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

/** collapse / expand button, lives inside the sidebar header */
function CollapseToggle({ className }: { className?: string }): JSX.Element {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === 'collapsed';
  const label = collapsed ? 'توسيع القائمة' : 'طي القائمة';
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={label}
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            className
          )}
        >
          {collapsed ? <PanelRightOpen className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  );
}

function Brand(): JSX.Element {
  const { state, isMobile } = useSidebar();
  const collapsed = state === 'collapsed' && !isMobile;

  // collapsed: only the logo; hovering it swaps the logo for the expand button
  if (collapsed) {
    return (
      <div className="group/brand relative h-8 w-8">
        <img src="/qhub-icon.svg" alt="Qhub" className="h-8 w-8 rounded-lg transition-opacity group-hover/brand:opacity-0" />
        <CollapseToggle className="absolute inset-0 bg-sidebar-accent text-sidebar-accent-foreground opacity-0 group-hover/brand:opacity-100 focus-visible:opacity-100" />
      </div>
    );
  }

  return (
    <>
      <NavLink to="/home" className="flex min-w-0 flex-1 items-center gap-2 rounded-md p-1">
        <img src="/qhub-icon.svg" alt="Qhub" className="h-8 w-8 shrink-0 rounded-lg" />
        <div className="grid min-w-0 leading-tight">
          <span className="truncate text-base font-bold">Qhub Partners</span>
          <span className="truncate text-xs text-muted-foreground">بوابة الموردين</span>
        </div>
      </NavLink>
      {!isMobile && <CollapseToggle />}
    </>
  );
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>): JSX.Element {
  return (
    <Sidebar side="right" collapsible="icon" {...props}>
      <SidebarHeader className="flex-row items-center gap-1 group-data-[collapsible=icon]:justify-center">
        <Brand />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
    </Sidebar>
  );
}
