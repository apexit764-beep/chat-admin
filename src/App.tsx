import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@components/layout/ProtectedRoute';
import { AdminShell } from '@components/admin/AdminShell';

const Login = lazy(() => import('@pages/Login'));
const AdminDashboard = lazy(() => import('@pages/admin/Dashboard'));
const AdminClients = lazy(() => import('@pages/admin/Clients'));
const AdminPlans = lazy(() => import('@pages/admin/Plans'));
const AdminPlanForm = lazy(() => import('@pages/admin/PlanForm'));
const AdminFinance = lazy(() => import('@pages/admin/Finance'));
const AdminSubscriptions = lazy(() => import('@pages/admin/Subscriptions'));
const AdminReports = lazy(() => import('@pages/admin/Reports'));
const AdminSettings = lazy(() => import('@pages/admin/Settings'));
const AdminActivityLog = lazy(() => import('@pages/admin/ActivityLog'));
const AdminFeedback = lazy(() => import('@pages/admin/Feedback'));
const AdminTeam = lazy(() => import('@pages/admin/Team'));
const AdminClientDetail = lazy(() => import('@pages/admin/ClientDetail'));
const AdminKnowledgeBase = lazy(() => import('@pages/admin/KnowledgeBase'));
const AdminKnowledgeCategories = lazy(() => import('@pages/admin/KnowledgeCategories'));
const AdminProfile = lazy(() => import('@pages/admin/Profile'));
const AdminLiveChat = lazy(() => import('@pages/admin/LiveChat'));
const AdminNotifications = lazy(() => import('@pages/admin/Notifications'));
const AdminIntegrations = lazy(() => import('@pages/admin/Integrations'));
const AdminIndustries = lazy(() => import('@pages/admin/Industries'));
const AdminWidgetSettings = lazy(() => import('@pages/admin/WidgetSettings'));
const AdminPlanRequests = lazy(() => import('@pages/admin/PlanRequests'));
const SiteHome = lazy(() => import('@pages/admin/site/Home'));
const SiteHomeSection = lazy(() => import('@pages/admin/site/HomeSection'));
const SiteSolutions = lazy(() => import('@pages/admin/site/Solutions'));
const SiteFaq = lazy(() => import('@pages/admin/site/Faq'));
const SiteInbox = lazy(() => import('@pages/admin/site/Inbox'));
const SiteFeatures = lazy(() => import('@pages/admin/site/Features'));
const SiteFeatureEditor = lazy(() => import('@pages/admin/site/FeatureEditor'));

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
          <Route path="/plans/new" element={<AdminPlanForm />} />
          <Route path="/plans/:id/edit" element={<AdminPlanForm />} />
          <Route path="/finance" element={<AdminFinance />} />
          <Route path="/subscriptions" element={<AdminSubscriptions />} />
          <Route path="/plan-requests" element={<AdminPlanRequests />} />
          <Route path="/reports" element={<AdminReports />} />
          <Route path="/settings" element={<AdminSettings />} />
          <Route path="/activity" element={<AdminActivityLog />} />
          <Route path="/feedback" element={<AdminFeedback />} />
          <Route path="/team" element={<AdminTeam />} />
          <Route path="/knowledge" element={<AdminKnowledgeBase />} />
          <Route path="/knowledge/categories" element={<AdminKnowledgeCategories />} />
          <Route path="/conversations" element={<AdminLiveChat />} />
          <Route path="/notifications" element={<AdminNotifications />} />
          <Route path="/integrations" element={<AdminIntegrations />} />
          <Route path="/industries" element={<AdminIndustries />} />
          <Route path="/widget" element={<AdminWidgetSettings />} />
          <Route path="/profile" element={<AdminProfile />} />
          <Route path="/site" element={<Navigate to="/site/home" replace />} />
          <Route path="/site/home" element={<SiteHome />} />
          <Route path="/site/home/:key" element={<SiteHomeSection />} />
          <Route path="/site/solutions" element={<SiteSolutions />} />
          <Route path="/site/faq" element={<SiteFaq />} />
          <Route path="/site/testimonials" element={<Navigate to="/site/home/testimonials" replace />} />
          <Route path="/site/channels" element={<Navigate to="/site/home/integrations" replace />} />
          <Route path="/site/partners" element={<Navigate to="/site/home/partners_marquee" replace />} />
          <Route path="/site/stats" element={<Navigate to="/site/home/stats" replace />} />
          <Route path="/site/legal" element={<Navigate to="/settings#pages" replace />} />
          <Route path="/site/pricing" element={<Navigate to="/plans#site" replace />} />
          <Route path="/site/inbox/:kind" element={<SiteInbox />} />
          <Route path="/site/features" element={<SiteFeatures />} />
          <Route path="/site/features/:slug" element={<SiteFeatureEditor />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
