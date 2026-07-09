import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import IntelligenceFeed from '@/pages/IntelligenceFeed';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import Dashboard from '@/pages/Dashboard';
import CommandCenter from '@/pages/CommandCenter';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import OpportunityDetail from '@/pages/OpportunityDetail';
import SavedOpportunities from '@/pages/SavedOpportunities';
import Alerts from '@/pages/Alerts';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import AccountOverview from '@/pages/AccountOverview';
import DataExport from '@/pages/DataExport';
import ComingSoon from '@/pages/ComingSoon';
import Missions from '@/pages/Missions';
import MissionDetail from '@/pages/MissionDetail';
import Leads from '@/pages/Leads';
import LeadDetail from '@/pages/LeadDetail';
import CRM from '@/pages/CRM';
import CRMRecordDetail from '@/pages/CRMRecordDetail';
import DemoLayout from '@/components/dashboard/DemoLayout';
import DemoDashboard from '@/pages/demo/DemoDashboard';
import DemoIntelligenceFeed from '@/pages/demo/DemoIntelligenceFeed';
import DemoOpportunityDetail from '@/pages/demo/DemoOpportunityDetail';
import DemoSaved from '@/pages/demo/DemoSaved';
import DemoAlerts from '@/pages/demo/DemoAlerts';
import DemoProfile from '@/pages/demo/DemoProfile';
import DemoSettings from '@/pages/demo/DemoSettings';
import DemoAccountOverview from '@/pages/demo/DemoAccountOverview';
import { Navigate } from 'react-router-dom';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* Add your page Route elements here */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/intelligence-feed" element={<IntelligenceFeed />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Route>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/opportunities/:id" element={<OpportunityDetail />} />
        <Route path="/saved" element={<SavedOpportunities />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/account-overview" element={<AccountOverview />} />
        <Route path="/data-export" element={<DataExport />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/missions/:id" element={<MissionDetail />} />
        <Route path="/off-plan" element={<ComingSoon title="Off-Plan Intel" description="Off-plan development intelligence — track upcoming launches, developer activity, and planning approvals across markets." />} />
        <Route path="/property-records" element={<ComingSoon title="Property Records" description="Raw property and permit records sourced from public registries and planning portals." />} />
        <Route path="/developers" element={<ComingSoon title="Developers" description="Developer profiles and track records — active projects, historical launches, and market presence." />} />
        <Route path="/geo-intelligence" element={<ComingSoon title="Country & City Intelligence" description="Geographic intelligence breakdown — activity patterns, market trends, and opportunity density by region." />} />
        <Route path="/watchlist" element={<ComingSoon title="Watchlist" description="Real-estate-specific watch targets — monitor properties, developments, and areas of interest." />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/leads/:leadId" element={<LeadDetail />} />
        <Route path="/crm" element={<CRM />} />
        <Route path="/crm/:recordId" element={<CRMRecordDetail />} />
        <Route path="/admin" element={<ComingSoon title="Admin Panel" description="Pipeline administration panel — manage data sources, monitor ingestion, and configure system settings." />} />
      </Route>
      {/* Public demo routes — no auth required, isolated state */}
      <Route element={<DemoLayout />}>
        <Route path="/demo-dashboard" element={<DemoDashboard />} />
        <Route path="/demo-intelligence-feed" element={<DemoIntelligenceFeed />} />
        <Route path="/demo-opportunities/:id" element={<DemoOpportunityDetail />} />
        <Route path="/demo-saved" element={<DemoSaved />} />
        <Route path="/demo-alerts" element={<DemoAlerts />} />
        <Route path="/demo-profile" element={<DemoProfile />} />
        <Route path="/demo-settings" element={<DemoSettings />} />
        <Route path="/demo-account" element={<DemoAccountOverview />} />
        <Route path="/demo-missions" element={<Missions />} />
        <Route path="/demo-missions/:id" element={<MissionDetail />} />
        <Route path="/demo-off-plan" element={<ComingSoon title="Off-Plan Intel" description="Off-plan development intelligence — track upcoming launches, developer activity, and planning approvals." />} />
        <Route path="/demo-property-records" element={<ComingSoon title="Property Records" description="Raw property and permit records sourced from public registries." />} />
        <Route path="/demo-developers" element={<ComingSoon title="Developers" description="Developer profiles and track records." />} />
        <Route path="/demo-geo-intelligence" element={<ComingSoon title="Country & City Intelligence" description="Geographic intelligence breakdown by region." />} />
        <Route path="/demo-watchlist" element={<ComingSoon title="Watchlist" description="Real-estate-specific watch targets." />} />
        <Route path="/demo-leads" element={<Leads />} />
        <Route path="/demo-leads/:leadId" element={<LeadDetail />} />
        <Route path="/demo-crm" element={<CRM />} />
        <Route path="/demo-crm/:recordId" element={<CRMRecordDetail />} />
      </Route>
      <Route path="/command-center" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App