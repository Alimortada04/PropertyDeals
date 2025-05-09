import React, { useEffect } from 'react';
import { XIcon } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

  if (!isOpen) return null;

  // Custom modal implementation to have more control over positioning and z-index
  return (
    <div className="fixed inset-0 z-[40] overflow-y-auto">
      {/* Backdrop with lower z-index to go behind sidebar/nav */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={!hideCloseButton ? onClose : undefined}
      />
      
      {/* Modal container positioned to be centered in the content area */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div 
          className={cn(
            "relative w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-xl transition-all duration-300",
            "animate-in fade-in-0 zoom-in-95"
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
            <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-500">{description}</p>
          </div>
          
          <div className="mt-6 space-y-3">
            <Button 
              className="w-full bg-[#09261E] hover:bg-[#135341] font-bold py-2.5"
              onClick={() => setLocation('/signin')}
            >
              Sign In
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-[#135341] text-[#135341] hover:bg-[#f0f7f4] font-bold py-2.5"
              onClick={() => setLocation('/register')}
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}