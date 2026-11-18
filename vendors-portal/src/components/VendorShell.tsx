import { Navigate, Outlet } from 'react-router-dom';
import { Toast } from '@/components/ui/Toast';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useVendorStore } from '@v/store/useVendorStore';
import { AppSidebar } from './app-sidebar';
import { SiteHeader } from './site-header';
import { Note } from './ui-bits';

export function VendorShell(): JSX.Element {
  const me = useVendorStore((s) => s.vendors.find((v) => v.id === s.meId));
  const logout = useVendorStore((s) => s.logout);
  if (!me) return <Navigate to="/login" replace />;
  if (me.status === 'مجمّد') {
    logout();
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider style={{ '--sidebar-width': '17rem', '--sidebar-width-icon': '3.5rem' } as React.CSSProperties}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
      <Toast />
    </SidebarProvider>
  );
}

export function FrozenNote(): JSX.Element | null {
  return <Note tone="error">حسابك مجمّد حاليًا. تواصل مع فريق Qhub.</Note>;
}
