import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@components/layout/ProtectedRoute';
import { AdminShell } from '@components/admin/AdminShell';

const Login = lazy(() => import('@pages/Login'));
const AdminDashboard = lazy(() => import('@pages/admin/Dashboard'));
const AdminClients = lazy(() => import('@pages/admin/Clients'));
const AdminPlans = lazy(() => import('@pages/admin/Plans'));
const AdminFinance = lazy(() => import('@pages/admin/Finance'));
const AdminSubscriptions = lazy(() => import('@pages/admin/Subscriptions'));
const AdminReports = lazy(() => import('@pages/admin/Reports'));
const AdminSettings = lazy(() => import('@pages/admin/Settings'));
const AdminActivityLog = lazy(() => import('@pages/admin/ActivityLog'));
const AdminFeedback = lazy(() => import('@pages/admin/Feedback'));
const AdminTeam = lazy(() => import('@pages/admin/Team'));
const AdminClientDetail = lazy(() => import('@pages/admin/ClientDetail'));
const AdminKnowledgeBase = lazy(() => import('@pages/admin/KnowledgeBase'));
const AdminLiveChat = lazy(() => import('@pages/admin/LiveChat'));
const AdminNotifications = lazy(() => import('@pages/admin/Notifications'));

function PageLoader(): JSX.Element {
  return (
    <div className="flex items-center justify-center h-screen p-12">
      <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

export default function App(): JSX.Element {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <AdminShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/clients" element={<AdminClients />} />
          <Route path="/clients/:id" element={<AdminClientDetail />} />
          <Route path="/plans" element={<AdminPlans />} />
          <Route path="/finance" element={<AdminFinance />} />
          <Route path="/subscriptions" element={<AdminSubscriptions />} />
          <Route path="/reports" element={<AdminReports />} />
          <Route path="/settings" element={<AdminSettings />} />
          <Route path="/activity" element={<AdminActivityLog />} />
          <Route path="/feedback" element={<AdminFeedback />} />
          <Route path="/team" element={<AdminTeam />} />
          <Route path="/knowledge" element={<AdminKnowledgeBase />} />
          <Route path="/conversations" element={<AdminLiveChat />} />
          <Route path="/notifications" element={<AdminNotifications />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
