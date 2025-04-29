import React from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import PropertiesPage from "@/pages/properties-page";
import PropertyDetailPage from "@/pages/property-detail-page";
import SellerDashboard from "@/pages/seller-dashboard";
import DashboardNewPage from "@/pages/dashboard";
import AuthPage from "@/pages/auth-page";
import AuthCallbackPage from "@/pages/auth/callback";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
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
import PropertyDictionaryPage from "@/pages/playbook/property-dictionary-page";
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
  return (
    <Switch>
      <Route path="/">
        <MainLayout>
          <HomePage />
        </MainLayout>
      </Route>
      <Route path="/properties">
        <MainLayout>
          <PropertiesPage />
        </MainLayout>
      </Route>
      <Route path="/p/:id">
        {params => (
          <MainLayout>
            <PropertyDetailPage id={params.id} />
          </MainLayout>
        )}
      </Route>
      <Route path="/reps">
        <MainLayout>
          <RepsPage />
        </MainLayout>
      </Route>
      
      <Route path="/reps/:id">
        {params => (
          <MainLayout>
            <RepProfilePage />
          </MainLayout>
        )}
      </Route>

      <Route path="/business/:slug">
        {params => (
          <MainLayout>
            <BusinessDetailPage slug={params.slug} />
          </MainLayout>
        )}
      </Route>
      <Route path="/discussions">
        <MainLayout>
          <DiscussionsPage />
        </MainLayout>
      </Route>
      
      {/* Redirect from old path to new path */}
      <Route path="/connect">
        <Redirect to="/discussions" />
      </Route>
      <Route path="/dashboard">
        <MainLayout>
          <DashboardNewPage />
        </MainLayout>
      </Route>
      <Route path="/tools">
        <MainLayout>
          <ToolsPage />
        </MainLayout>
      </Route>
      <Route path="/tools/flip">
        <MainLayout>
          <FlipPage />
        </MainLayout>
      </Route>
      <Route path="/playbook">
        <MainLayout>
          <PlaybookPage />
        </MainLayout>
      </Route>
      <Route path="/playbook/property-dictionary">
        <MainLayout>
          <PropertyDictionaryPage />
        </MainLayout>
      </Route>
      <Route path="/profile">
        <MainLayout>
          <div className="container mx-auto px-4 py-12 pt-20">
            <h1 className="text-4xl font-heading font-bold text-[#09261E] mb-6">Profile</h1>
            <p className="text-lg text-gray-600">
              User profile page will be available in future updates.
            </p>
          </div>
        </MainLayout>
      </Route>
      <Route path="/settings">
        <MainLayout>
          <div className="container mx-auto px-4 py-12 pt-20">
            <h1 className="text-4xl font-heading font-bold text-[#09261E] mb-6">Settings</h1>
            <p className="text-lg text-gray-600">
              Account settings and preferences will be available in future updates.
            </p>
          </div>
        </MainLayout>
      </Route>
      <ProtectedRoute path="/seller-dashboard" component={() => (
        <MainLayout>
          <SellerDashboard />
        </MainLayout>
      )} />
      <Route path="/forgot-password">
        <ForgotPasswordPage />
      </Route>
      <Route path="/onboarding">
        <ProtectedRoute path="/onboarding" component={() => (
          <OnboardingPage />
        )} />
      </Route>
      
      {/* Main auth route */}
      <Route path="/auth">
        <AuthPage />
      </Route>
      
      {/* Auth routes */}
      <Route path="/signin">
        <AuthPage />
      </Route>
      <Route path="/register">
        <AuthPage />
      </Route>
      <Route path="/register-old">
        <Redirect to="/register" />
      </Route>
      <Route path="/auth/signin">
        <Redirect to="/auth" />
      </Route>
      <Route path="/auth/register">
        <Redirect to="/register" />
      </Route>
      <Route path="/auth/register-flow">
        <Redirect to="/register" />
      </Route>
      
      {/* Auth callback route for social auth */}
      <Route path="/auth/callback">
        <AuthCallbackPage />
      </Route>
      <Route path="/about">
        <MainLayout>
          <AboutPage />
        </MainLayout>
      </Route>
      <Route path="/contact">
        <MainLayout>
          <ContactPage />
        </MainLayout>
      </Route>
      <Route path="/help">
        <MainLayout>
          <HelpPage />
        </MainLayout>
      </Route>
      <Route path="/help/faq">
        <MainLayout>
          <FAQPage />
        </MainLayout>
      </Route>
      <Route path="/help/suggestions">
        <MainLayout>
          <SuggestionsPage />
        </MainLayout>
      </Route>
      <Route path="/help/report">
        <MainLayout>
          <ReportPage />
        </MainLayout>
      </Route>
      <Route path="/legal/terms">
        <MainLayout>
          <TermsPage />
        </MainLayout>
      </Route>
      <Route path="/legal/cookies">
        <MainLayout>
          <CookiesPage />
        </MainLayout>
      </Route>
      <Route path="/legal/fha-compliance">
        <MainLayout>
          <FHACompliancePage />
        </MainLayout>
      </Route>
      
      {/* Admin Routes - All protected and using AdminLayout */}
      <ProtectedRoute path="/admin" component={() => (
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      )} />
      
      <ProtectedRoute path="/admin/dashboard" component={() => (
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      )} />
      
      <ProtectedRoute path="/admin/users" component={() => (
        <AdminLayout>
          <AdminUsers />
        </AdminLayout>
      )} />
      
      <ProtectedRoute path="/admin/users/:id" component={({ params }) => (
        <AdminLayout>
          <AdminUserDetails id={params.id} />
        </AdminLayout>
      )} />
      
      <ProtectedRoute path="/admin/approvals" component={() => (
        <AdminLayout>
          <AdminApprovals />
        </AdminLayout>
      )} />
      
      <ProtectedRoute path="/admin/logs" component={() => (
        <AdminLayout>
          <AdminLogs />
        </AdminLayout>
      )} />
      
      <ProtectedRoute path="/admin/reports" component={() => (
        <AdminLayout>
          <AdminReports />
        </AdminLayout>
      )} />
      
      <ProtectedRoute path="/admin/settings" component={() => (
        <AdminLayout>
          <AdminSettings />
        </AdminLayout>
      )} />
      
      {/* Fallback to 404 */}
      <Route>
        <MainLayout>
          <NotFound />
        </MainLayout>
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
