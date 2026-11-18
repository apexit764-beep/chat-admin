import { NavLink, useLocation } from 'react-router-dom';
import { Home, PanelRightClose, PanelRightOpen, UserCog, Users, Wallet, type LucideIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
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

type NavItem = { to: string; label: string; icon: LucideIcon };

const MAIN: NavItem[] = [
  { to: '/home', label: 'الرئيسية', icon: Home },
  { to: '/clients', label: 'العملاء', icon: Users },
  { to: '/payouts', label: 'السحب', icon: Wallet },
];
/** pinned to the bottom of the sidebar */
const ACCOUNT: NavItem = { to: '/account', label: 'حسابي', icon: UserCog };

/** every page, for the header title */
export const NAV: NavItem[] = [...MAIN, ACCOUNT];

/* larger targets than the shadcn defaults: 40px rows, 20px icons, centred when collapsed */
const ITEM =
  'h-10 gap-3 rounded-lg px-3 text-[15px] [&>svg]:size-5 group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:[&>span]:hidden';

function NavItems({ items }: { items: NavItem[] }): JSX.Element {
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarMenu className="gap-1.5 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-2">
      {items.map(({ to, label, icon: Icon }) => (
        <SidebarMenuItem key={to}>
          <SidebarMenuButton asChild tooltip={label} isActive={pathname.startsWith(to)} className={ITEM}>
            <NavLink to={to} aria-label={label} onClick={() => isMobile && setOpenMobile(false)}>
              <Icon />
              <span>{label}</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
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
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            className
          )}
        >
          {collapsed ? <PanelRightOpen className="h-5 w-5" /> : <PanelRightClose className="h-5 w-5" />}
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
      <div className="group/brand relative h-10 w-10">
        <img src="/qhub-icon.svg" alt="Qhub" className="h-10 w-10 rounded-xl transition-opacity group-hover/brand:opacity-0" />
        <CollapseToggle className="absolute inset-0 h-10 w-10 bg-sidebar-accent text-sidebar-accent-foreground opacity-0 group-hover/brand:opacity-100 focus-visible:opacity-100" />
      </div>
    );
  }

  return (
    <>
      <NavLink to="/home" className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg p-1">
        <img src="/qhub-icon.svg" alt="Qhub" className="h-10 w-10 shrink-0 rounded-xl" />
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
      <SidebarHeader className="h-16 flex-row items-center gap-1 px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
        <Brand />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-3 group-data-[collapsible=icon]:px-2">
          <SidebarGroupLabel className="mb-1">القائمة</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavItems items={MAIN} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border px-3 py-3 group-data-[collapsible=icon]:px-2">
        <NavItems items={[ACCOUNT]} />
      </SidebarFooter>
    </Sidebar>
  );
}
