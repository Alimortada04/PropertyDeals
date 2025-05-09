import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Route, useLocation } from "wouter";
import { User } from "@shared/schema";
import React, { useState, useEffect } from "react";
import AuthModal from "@/components/auth/auth-modal";

type ProtectedRouteProps = {
  path?: string;
  component?: () => React.JSX.Element;
  condition?: (user: User | null) => boolean;
  redirectTo?: string;
  children?: React.ReactNode;
  publicRoutes?: string[];
};

export function ProtectedRoute({
  path,
  component: Component,
  condition,
  redirectTo = "/signin",
  children,
  publicRoutes = ['/p/', '/reps/']
}: ProtectedRouteProps) {
  const [location, setLocation] = useLocation();
  const { user, supabaseUser, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Check if the current path is in the public routes
  const isPublicRoute = () => {
    if (!path) return false;
    return publicRoutes.some(route => path.startsWith(route));
  };

  // Handle modal closing
  const handleCloseModal = () => {
    // Only close the modal without redirecting
    setShowAuthModal(false);
  };

  useEffect(() => {
    // Don't show modal during loading or if the route is public
    if (isLoading || isPublicRoute()) {
      setShowAuthModal(false);
      return;
    }
    
    // Show auth modal if user is not authenticated
    if (!user && !supabaseUser) {
      setShowAuthModal(true);
    } else if (condition && !condition(user)) {
      // If there's a custom condition and it's not met
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [user, supabaseUser, isLoading, condition, path, location]);

  // Show loading state while authenticating
  if (isLoading) {
    const content = (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#135341]" />
      </div>
    );
    
    return path ? <Route path={path}>{content}</Route> : content;
  }

  // Enhanced modal title and description
  const modalTitle = "Authentication Required";
  const modalDescription = "You need to sign in or create an account to access this area of PropertyDeals.";

  // For path-based routes (using wouter's <Route>)
  if (path && Component) {
    return (
      <Route path={path}>
        <>
          <Component />
          <AuthModal 
            isOpen={showAuthModal} 
            onClose={handleCloseModal}
            hideCloseButton={false}
            title={modalTitle}
            description={modalDescription}
          />
        </>
      </Route>
    );
  }
  
  // For use as a wrapper component
  return (
    <>
      {children}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleCloseModal}
        hideCloseButton={false}
        title={modalTitle}
        description={modalDescription}
      />
    </>
  );
}
