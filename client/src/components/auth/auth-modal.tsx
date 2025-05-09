import React from 'react';
import { XIcon } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {!hideCloseButton && (
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
        
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <Button 
            className="w-full bg-[#09261E] hover:bg-[#135341]"
            onClick={() => setLocation('/auth')}
          >
            Sign In
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-[#135341] text-[#135341] hover:bg-[#f0f7f4]"
            onClick={() => setLocation('/auth?register=true')}
          >
            Create Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}