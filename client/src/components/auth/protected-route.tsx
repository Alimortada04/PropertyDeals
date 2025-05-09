import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import AuthModal from './auth-modal';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  publicRoutes?: string[];
}

export default function ProtectedRoute({ 
  children, 
  publicRoutes = ['/p/', '/reps/'] 
}: ProtectedRouteProps) {
  const [location] = useLocation();
  const { user, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Check if current path is in the public routes list
  const isPublicRoute = () => {
    return publicRoutes.some(route => location.startsWith(route));
  };
  
  useEffect(() => {
    // Don't show modal during loading or if route is public
    if (isLoading || isPublicRoute()) {
      return;
    }
    
    // Show auth modal if user is not authenticated
    setShowAuthModal(!user);
  }, [user, isLoading, location]);
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#135341]" />
      </div>
    );
  }
  
  return (
    <>
      {children}
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {}} 
        hideCloseButton={true}
      />
    </>
  );
}