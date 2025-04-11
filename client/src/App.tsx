import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import PropertiesPage from "@/pages/properties-page";
import PropertyDetailPage from "@/pages/property-detail-page";
import SellerDashboard from "@/pages/seller-dashboard";
import AuthPage from "@/pages/auth-page";
import AboutPage from "@/pages/about-page";
import ContactPage from "@/pages/contact-page";
import RepsPage from "@/pages/reps-page";
import RepDetailPage from "@/pages/rep-detail-page";
import ToolsPage from "@/pages/tools-page";
import FlipCalculatorPage from "@/pages/tools/flip-calculator-page";
import GuidesPage from "@/pages/guides-page";
import PropertyDictionaryPage from "@/pages/guides/property-dictionary-page";
import MainLayout from "@/components/layout/main-layout";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

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
      <Route path="/rep/:slug">
        {params => (
          <MainLayout>
            <RepDetailPage slug={params.slug} />
          </MainLayout>
        )}
      </Route>
      <Route path="/connect">
        <MainLayout>
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-heading font-bold text-[#09261E] mb-6">Connect</h1>
            <p className="text-lg text-gray-600">
              This page will contain messaging and communication features in the future.
            </p>
          </div>
        </MainLayout>
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
      <Route path="/tools/flip-calculator">
        <MainLayout>
          <FlipCalculatorPage />
        </MainLayout>
      </Route>
      <Route path="/guides">
        <MainLayout>
          <GuidesPage />
        </MainLayout>
      </Route>
      <Route path="/guides/property-dictionary">
        <MainLayout>
          <PropertyDictionaryPage />
        </MainLayout>
      </Route>
      <Route path="/profile">
        <MainLayout>
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-heading font-bold text-[#09261E] mb-6">Profile</h1>
            <p className="text-lg text-gray-600">
              User profile page will be available in future updates.
            </p>
          </div>
        </MainLayout>
      </Route>
      <Route path="/settings">
        <MainLayout>
          <div className="container mx-auto px-4 py-12">
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
        <MainLayout>
          <AuthPage />
        </MainLayout>
      </Route>
      <Route path="/register">
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
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
