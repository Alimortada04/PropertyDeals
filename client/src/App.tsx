import React from "react";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import PropertiesPage from "@/pages/properties-page";
import PropertyDetailPage from "@/pages/property-detail-page";
import SellerDashboard from "@/pages/seller-dashboard";
import AuthPage from "@/pages/auth-page";
import SignInPage from "@/pages/auth/signin";
import RegisterPage from "@/pages/auth/register";
import RegisterFlowPage from "@/pages/auth/register-flow";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import OnboardingPage from "@/pages/onboarding";
import AboutPage from "@/pages/about-page";
import ContactPage from "@/pages/contact-page";
import RepsPage from "@/pages/reps-page";
import RepProfilePage from "@/pages/rep-profile-page";
import BusinessDetailPage from "@/pages/business-detail-page";
import ConnectPage from "@/pages/connect-page";
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
import MainLayout from "@/components/layout/main-layout";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { ScrollToTop } from "@/components/common/scroll-to-top";

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
          <SellerDashboard />
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
      <Route path="/signin">
        <SignInPage />
      </Route>
      <Route path="/register">
        <RegisterFlowPage />
      </Route>
      <Route path="/register-old">
        <RegisterPage />
      </Route>
      <Route path="/auth/forgot-password">
        <ForgotPasswordPage />
      </Route>
      <Route path="/onboarding">
        <ProtectedRoute path="/onboarding" component={() => (
          <OnboardingPage />
        )} />
      </Route>
      {/* Legacy auth routes */}
      <Route path="/auth">
        <MainLayout>
          <AuthPage />
        </MainLayout>
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
