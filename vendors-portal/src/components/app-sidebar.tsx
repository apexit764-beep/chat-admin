import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { EllipsisVertical, Home, LogOut, Moon, PanelRightClose, PanelRightOpen, Sun, UserCog, UserPlus, Users, Wallet, type LucideIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();
  const close = (): void => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="إضافة عميل"
              onClick={() => {
                close();
                navigate('/clients?add=1');
              }}
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
            >
              <UserPlus />
              <span>إضافة عميل</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
      <SidebarGroupLabel className="mt-2">القائمة</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
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

function NavUser({ me }: { me: Vendor }): JSX.Element {
  const navigate = useNavigate();
  const logout = useVendorStore((s) => s.logout);
  const { theme, toggle } = useThemeStore();
  const { isMobile } = useSidebar();

  const who = (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-bold text-primary">{initials(me.name)}</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-start text-sm leading-tight">
        <span className="truncate font-medium">{me.name}</span>
        <span className="truncate text-xs text-muted-foreground" dir="ltr">
          {me.email}
        </span>
      </div>
    </>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              {who}
              <EllipsisVertical className="ms-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side={isMobile ? 'bottom' : 'left'} align="end" sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-sm">{who}</div>
              <div className="px-1 pb-1.5 text-xs text-muted-foreground">
                {me.country} · العملة {FX[me.cur].sym}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2" onClick={() => navigate('/account')}>
                <UserCog className="h-4 w-4" />
                حسابي
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" onClick={toggle}>
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
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

export function AppSidebar({ me, ...props }: React.ComponentProps<typeof Sidebar> & { me: Vendor }): JSX.Element {
  return (
    <Sidebar side="right" collapsible="icon" {...props}>
      <SidebarHeader className="flex-row items-center gap-1 group-data-[collapsible=icon]:justify-center">
        <Brand />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser me={me} />
      </SidebarFooter>
    </Sidebar>
  );
}
