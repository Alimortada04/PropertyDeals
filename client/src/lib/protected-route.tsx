import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { User } from "@shared/schema";
import React from "react";

type ProtectedRouteProps = {
  path?: string;
  component?: () => React.JSX.Element;
  condition?: (user: User | null) => boolean;
  redirectTo?: string;
  children?: React.ReactNode;
};

export function ProtectedRoute({
  path,
  component: Component,
  condition,
  redirectTo = "/auth",
  children
}: ProtectedRouteProps) {
  const { user, supabaseUser, isLoading } = useAuth();

  // Show loading state while authenticating
  if (isLoading) {
    const content = (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
    
    return path ? <Route path={path}>{content}</Route> : content;
  }

  // Check if user is authenticated
  if (!user && !supabaseUser) {
    const redirect = <Redirect to={redirectTo} />;
    return path ? <Route path={path}>{redirect}</Route> : redirect;
  }

  // If there's a custom condition, check it
  if (condition && !condition(user)) {
    const redirect = <Redirect to={redirectTo} />;
    return path ? <Route path={path}>{redirect}</Route> : redirect;
  }

  // User is authenticated and meets conditions
  if (path && Component) {
    return <Route path={path} component={Component} />;
  }
  
  // For use as a wrapper component
  return <>{children}</>;
}
