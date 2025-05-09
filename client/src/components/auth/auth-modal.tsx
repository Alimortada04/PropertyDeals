import React, { useEffect, useState } from 'react';
import { XIcon, Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/use-auth';
import { Label } from '@/components/ui/label';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  hideCloseButton?: boolean;
}

export default function AuthModal({
  isOpen,
  onClose,
  title = "Authentication Required",
  description = "Please log in or create an account to access this page.",
  hideCloseButton = false
}: AuthModalProps) {
  const [_, setLocation] = useLocation();
  const [showLogin, setShowLogin] = useState(true);
  const { loginMutation, registerMutation } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  // Reset form state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setShowLogin(true);
      setAuthError(null);
    }
  }, [isOpen]);

  // Prevent scrolling of the body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Submit login form
  const onLoginSubmit = handleSubmit(async (data) => {
    try {
      setAuthError(null);
      await loginMutation.mutateAsync(data);
      // Close modal after successful login
      onClose();
    } catch (error) {
      setAuthError((error as Error).message || 'Login failed. Please try again.');
    }
  });

  if (!isOpen) return null;

  // Custom modal implementation to have more control over positioning and z-index
  return (
    <div className="fixed inset-0 z-[40] overflow-y-auto pointer-events-none">
      {/* Backdrop overlay for small screens */}
      <div 
        className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto"
        onClick={!hideCloseButton ? onClose : undefined}
      />

      {/* Content area backdrop that excludes the sidebar */}
      <div 
        className="hidden md:block fixed left-[240px] top-0 right-0 bottom-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto border-l border-l-[#09261E]/10"
        onClick={!hideCloseButton ? onClose : undefined}
      />
      
      {/* Modal container positioned to be centered in the content area, with sidebar offset */}
      <div className="flex min-h-screen items-center justify-center p-4 text-center pointer-events-auto">
        <div 
          className={cn(
            "relative w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-xl transition-all duration-300",
            "animate-in fade-in-0 zoom-in-95 ml-0 md:ml-[120px]"
          )}
        >
          {!hideCloseButton && (
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#09261E] focus:ring-offset-2"
            >
              <XIcon className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          )}
          
          <div className="mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {showLogin ? "Sign In" : "Create Account"}
            </h3>
            <p className="mt-2 text-sm text-gray-500">{description}</p>
          </div>
          
          {showLogin ? (
            // Login Form
            <form onSubmit={onLoginSubmit} className="space-y-4">
              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{authError}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-[#09261E] hover:bg-[#135341] font-bold py-2.5"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : "Sign In"}
              </Button>
              
              <div className="text-center space-y-2">
                <Button 
                  type="button"
                  variant="link"
                  onClick={() => setLocation('/forgot-password')}
                  className="text-sm text-[#135341]"
                >
                  Forgot password?
                </Button>
                
                <div className="text-xs text-gray-500">
                  Don't have an account?{' '}
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setLocation('/register')}
                    className="text-xs text-[#135341] p-0 h-auto font-normal"
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            // Registration button
            <div className="mt-6 space-y-3">
              <Button 
                variant="outline" 
                className="w-full border-[#135341] text-[#135341] hover:bg-[#f0f7f4] font-bold py-2.5"
                onClick={() => setLocation('/register')}
              >
                Create Account
              </Button>
              
              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setShowLogin(true)}
                  className="text-sm text-[#135341]"
                >
                  Already have an account? Sign In
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}