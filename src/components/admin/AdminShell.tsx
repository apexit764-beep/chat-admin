import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { Toast } from '@components/ui';
import { useAdminStore } from '@/store/useAdminStore';

export function AdminShell(): JSX.Element {
  const location = useLocation();
  const refreshLifecycle = useAdminStore((s) => s.refreshLifecycle);

  // no backend job runs these, so they are settled on load
  useEffect(() => { refreshLifecycle(); }, [refreshLifecycle]);

  return (
    <div className="flex min-h-screen bg-muted/40 text-foreground text-sm">
      {/* Sidebar wrapper with padding for floating effect */}
      <div className="flex-shrink-0 p-3 pe-0">
        <AdminSidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />
        <main className="flex-1 overflow-x-clip">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Toast />
    </div>
  );
}
