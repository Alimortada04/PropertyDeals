import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, X, MessageSquare, Share2, FileText } from 'lucide-react';

interface FloatingActionMenuProps {
  onAddDeal: () => void;
  onShare: () => void;
  onMessages: () => void;
  onResources: () => void;
}

export default function FloatingActionMenu({
  onAddDeal,
  onShare,
  onMessages,
  onResources
}: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (callback: () => void) => {
    callback();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Menu */}
      {isOpen && (
        <div className="flex flex-col-reverse gap-3 mb-3 transition-all duration-200 ease-in-out">
          <Button
            onClick={() => handleAction(onResources)}
            className="h-12 w-12 rounded-full bg-amber-500 hover:bg-amber-600 shadow-lg transition-transform transform hover:scale-105"
            aria-label="View resources"
          >
            <FileText className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={() => handleAction(onMessages)}
            className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg transition-transform transform hover:scale-105"
            aria-label="Open messages"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={() => handleAction(onShare)}
            className="h-12 w-12 rounded-full bg-purple-500 hover:bg-purple-600 shadow-lg transition-transform transform hover:scale-105"
            aria-label="Share property"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={() => handleAction(onAddDeal)}
            className="h-12 w-12 rounded-full bg-[#135341] hover:bg-[#135341]/90 shadow-lg transition-transform transform hover:scale-105"
            aria-label="Add property"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      {/* Toggle Button */}
      <Button
        onClick={toggleMenu}
        className={`h-14 w-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'bg-red-500 hover:bg-red-600 rotate-45' : 'bg-[#135341] hover:bg-[#135341]/90'
        }`}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X className="h-6 w-6" /> : <PlusCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
}