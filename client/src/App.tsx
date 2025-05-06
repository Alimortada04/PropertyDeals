import React from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { SearchProvider } from "@/contexts/SearchContext";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import PropertiesPage from "@/pages/properties-page";
import PropertyDetailPage from "@/pages/property-detail-page";
import SellerDashboard from "@/pages/seller-dashboard";
import DashboardNewPage from "@/pages/dashboard";
import DashboardPage from "@/pages/dashboard-page";
import ProfilePage from "@/pages/profile/profile-page";
import ProfileSettingsPage from "@/pages/profile/settings-page";
import CommunityPage from "@/pages/community-page";
import EventDetailPage from "@/pages/community/event-detail-page";
import AuthCallbackPage from "@/pages/auth/callback";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import RegisterPage from "@/pages/auth/register";
import SignInPage from "@/pages/auth/signin";
import ResetPasswordPage from "@/pages/auth/reset-password";
import OnboardingPage from "@/pages/onboarding";
import AboutPage from "@/pages/about-page";
import ContactPage from "@/pages/contact-page";
import RepsPage from "@/pages/reps-page";
import RepProfilePage from "@/pages/rep-profile-page";
import BusinessDetailPage from "@/pages/business-detail-page";
import DiscussionsPage from "@/pages/discussions-page";
import ToolsPage from "@/pages/tools-page";
import FlipPage from "@/pages/tools/flip";
import PlaybookPage from "@/pages/playbook-page";
import InboxPage from "@/pages/inbox-page";
import PropertyDictionaryPage from "@/pages/property-dictionary-page";
import HelpPage from "@/pages/help-page";
import FAQPage from "@/pages/help/faq-page";
import SuggestionsPage from "@/pages/help/suggestions-page";
import ReportPage from "@/pages/help/report-page";
import TermsPage from "@/pages/legal/terms-page";
import CookiesPage from "@/pages/legal/cookies-page";
import FHACompliancePage from "@/pages/legal/fha-compliance-page";

// Admin pages
import AdminLayout from "@/components/admin/admin-layout";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminUsers from "@/pages/admin/users"; 
import AdminUserDetails from "@/pages/admin/user-details";
import AdminApprovals from "@/pages/admin/approvals";
import AdminLogs from "@/pages/admin/logs";
import AdminReports from "@/pages/admin/reports";
import AdminSettings from "@/pages/admin/settings";
import MainLayout from "@/components/layout/main-layout";
import AppLayout from "@/components/layout/app-layout";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { ScrollToTop as ScrollToTopHOC } from "@/components/common/scroll-to-top";

// Check if Supabase environment variables are set
const checkEnvironmentVariables = () => {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn(
      "Supabase environment variables are not set. Authentication will not work properly.\n" +
      "Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment."
    );
  }
};

// Check environment variables on load
checkEnvironmentVariables();

// Keep track of scroll position
function ScrollToTop() {
  const [location] = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  // Check for auth-related hash fragments
  React.useEffect(() => {
    // First check if there's a ?type= parameter in the URL 
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    
    // Handle verification links by type parameter
    if (type === 'signup') {
      console.log("Detected signup verification, redirecting to home page");
      window.location.href = "/";
      return;
    }
    
    // Otherwise check for hash fragments (password reset, errors)
    if (window.location.hash && (
        window.location.hash.includes('error=access_denied') || 
        window.location.hash.includes('error_code=otp_expired') ||
        window.location.hash.includes('type=recovery') ||
        window.location.hash.includes('access_token')
      )) {
      // Extract type from URL hash if present
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const hashType = hashParams.get('type');
      
      if (hashType === 'signup') {
        console.log("Detected signup verification in hash, redirecting to home page");
        window.location.href = "/";
        return;
      }
      
      console.log("Detected password reset hash fragment, redirecting to reset page");
      // Preserve the hash by passing it along
      window.location.href = "/auth/reset-password" + window.location.hash;
    }
  }, []);

  return (
    <Switch>
      <Route path="/">
        <AppLayout>
          <DashboardPage />
        </AppLayout>
      </Route>
      
      <Route path="/home">
        <AppLayout>
          <DashboardPage />
        </AppLayout>
      </Route>
      
      <Route path="/landingpage">
        <Redirect to="/" />
      </Route>
      <Route path="/properties">
        <AppLayout>
          <PropertiesPage />
        </AppLayout>
      </Route>
      <Route path="/p/:id">
        {params => (
          <AppLayout>
            <PropertyDetailPage id={params.id} />
          </AppLayout>
        )}
      </Route>
      <Route path="/reps">
        <AppLayout>
          <RepsPage />
        </AppLayout>
      </Route>
      
      <Route path="/reps/:id">
        {params => (
          <AppLayout>
            <RepProfilePage />
          </AppLayout>
        )}
      </Route>

      <Route path="/business/:slug">
        {params => (
          <AppLayout>
            <BusinessDetailPage slug={params.slug} />
          </AppLayout>
        )}
      </Route>
      <Route path="/inbox">
        <AppLayout>
          <InboxPage />
        </AppLayout>
      </Route>
      
      {/* Redirect discussions to inbox */}
      <Route path="/discussions">
        <Redirect to="/inbox" />
      </Route>
      
      {/* Redirect from old path to new path */}
      <Route path="/connect">
        <Redirect to="/inbox" />
      </Route>
      
      {/* Redirect from /messages to /inbox */}
      <Route path="/messages">
        <Redirect to="/inbox" />
      </Route>
      
      {/* Community routes */}
      <Route path="/community">
        <AppLayout>
          <CommunityPage />
        </AppLayout>
      </Route>
      
      <Route path="/community/:slug">
        {params => (
          <AppLayout>
            <EventDetailPage slug={params.slug} />
          </AppLayout>
        )}
      </Route>
      <Route path="/dashboard">
        <AppLayout>
          <DashboardPage />
        </AppLayout>
      </Route>
      
      {/* Legacy dashboard route */}
      <Route path="/dashboard-old">
        <AppLayout>
          <DashboardNewPage />
        </AppLayout>
      </Route>
      <Route path="/tools">
        <AppLayout>
          <ToolsPage />
        </AppLayout>
      </Route>
      <Route path="/tools/flip">
        <AppLayout>
          <FlipPage />
        </AppLayout>
      </Route>
      <Route path="/playbook">
        <AppLayout>
          <PlaybookPage />
        </AppLayout>
      </Route>
      <Route path="/playbook/property-dictionary">
        <AppLayout>
          <PropertyDictionaryPage />
        </AppLayout>
      </Route>
      {/* Profile routes - temporarily allow access without authentication */}
      <Route path="/profile">
        <AppLayout>
          <ProfilePage />
        </AppLayout>
      </Route>
      
      <Route path="/profile/connected-accounts">
        <AppLayout>
          <ProfilePage />
        </AppLayout>
      </Route>
      
      <Route path="/profile/security">
        <AppLayout>
          <ProfilePage />
        </AppLayout>
      </Route>
      
      <Route path="/profile/payment">
        <AppLayout>
          <ProfilePage />
        </AppLayout>
      </Route>
      
      <Route path="/profile/balance">
        <AppLayout>
          <ProfilePage />
        </AppLayout>
      </Route>
      
      <Route path="/profile/billing">
        <AppLayout>
          <ProfilePage />
        </AppLayout>
      </Route>
      
      <Route path="/profile/memberships">
        <AppLayout>
          <ProfilePage />
        </AppLayout>
      </Route>
      
      <Route path="/profile/resolution">
        <AppLayout>
          <ProfilePage />
        </AppLayout>
      </Route>
      
      <Route path="/profile/danger">
        <AppLayout>
          <ProfilePage />
        </AppLayout>
      </Route>
      <Route path="/settings">
        <AppLayout>
          <div className="container mx-auto px-4 py-12 pt-20">
            <h1 className="text-4xl font-heading font-bold text-[#09261E] mb-6">Settings</h1>
            <p className="text-lg text-gray-600">
              Account settings and preferences will be available in future updates.
            </p>
          </div>
        </AppLayout>
      </Route>
      {/* Temporarily allow access to seller dashboard without authentication */}
      <Route path="/seller-dashboard">
        <AppLayout>
          <SellerDashboard />
        </AppLayout>
      </Route>
      <Route path="/forgot-password">
        <ForgotPasswordPage />
      </Route>
      <Route path="/auth/forgot-password">
        <Redirect to="/forgot-password" />
      </Route>
      {/* Temporarily allow access to onboarding without authentication */}
      <Route path="/onboarding">
        <OnboardingPage />
      </Route>
      
      {/* Auth routes */}
      <Route path="/register">
        <RegisterPage />
      </Route>
      <Route path="/signin">
        <SignInPage />
      </Route>
      <Route path="/auth">
        <Redirect to="/signin" />
      </Route>
      
      {/* Redirect old routes to new ones */}
      <Route path="/auth/signin">
        <Redirect to="/signin" />
      </Route>
      <Route path="/auth/register">
        <Redirect to="/register" />
      </Route>
      
      {/* Auth callback route for social auth */}
      <Route path="/auth/callback">
        <AuthCallbackPage />
      </Route>
      
      {/* Password reset route */}
      {/* Password reset routes with special handling for hash fragments */}
      <Route path="/auth/reset-password">
        <ResetPasswordPage />
      </Route>
      <Route path="/reset-password">
        <Redirect to="/auth/reset-password" />
      </Route>
      
      {/* Special handler for Supabase's password reset redirect with hash fragment */}
      <Route path="/#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired">
        <ResetPasswordPage />
      </Route>
      <Route path="/#error=access_denied">
        <ResetPasswordPage />
      </Route>
      <Route path="/about">
        <AppLayout>
          <AboutPage />
        </AppLayout>
      </Route>
      <Route path="/contact">
        <AppLayout>
          <ContactPage />
        </AppLayout>
      </Route>
      <Route path="/help">
        <AppLayout>
          <HelpPage />
        </AppLayout>
      </Route>
      <Route path="/help/faq">
        <AppLayout>
          <FAQPage />
        </AppLayout>
      </Route>
      <Route path="/help/suggestions">
        <AppLayout>
          <SuggestionsPage />
        </AppLayout>
      </Route>
      <Route path="/help/report">
        <AppLayout>
          <ReportPage />
        </AppLayout>
      </Route>
      <Route path="/legal/terms">
        <AppLayout>
          <TermsPage />
        </AppLayout>
      </Route>
      <Route path="/legal/cookies">
        <AppLayout>
          <CookiesPage />
        </AppLayout>
      </Route>
      <Route path="/legal/fha-compliance">
        <AppLayout>
          <FHACompliancePage />
        </AppLayout>
      </Route>
      
      {/* Admin Routes - Temporarily allowing access without authentication */}
      <Route path="/admin">
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/dashboard">
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/users">
        <AdminLayout>
          <AdminUsers />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/users/:id">
        {params => (
          <AdminLayout>
            <AdminUserDetails id={params.id} />
          </AdminLayout>
        )}
      </Route>
      
      <Route path="/admin/approvals">
        <AdminLayout>
          <AdminApprovals />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/logs">
        <AdminLayout>
          <AdminLogs />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/reports">
        <AdminLayout>
          <AdminReports />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/settings">
        <AdminLayout>
          <AdminSettings />
        </AdminLayout>
      </Route>
      
      {/* Fallback to 404 */}
      <Route>
        <AppLayout>
          <NotFound />
        </AppLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ScrollToTop />
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
