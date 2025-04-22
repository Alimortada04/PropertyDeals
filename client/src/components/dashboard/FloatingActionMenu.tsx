import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, X, FileText, Share2, MessageSquare, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="fixed bottom-4 left-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute bottom-14 left-1 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="flex items-center gap-2"
            >
              <span className="bg-white text-sm font-medium shadow-lg rounded-full py-1 px-3">Get Help</span>
              <Button 
                size="icon" 
                className="h-12 w-12 rounded-full shadow-lg bg-purple-600 hover:bg-purple-700"
                onClick={() => handleAction(onResources)}
              >
                <BookOpen className="h-5 w-5 text-white" />
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className="bg-white text-sm font-medium shadow-lg rounded-full py-1 px-3">Inbox</span>
              <Button 
                size="icon" 
                className="h-12 w-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
                onClick={() => handleAction(onMessages)}
              >
                <MessageSquare className="h-5 w-5 text-white" />
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.3 }}
              className="flex items-center gap-2"
            >
              <span className="bg-white text-sm font-medium shadow-lg rounded-full py-1 px-3">Share a Deal</span>
              <Button 
                size="icon" 
                className="h-12 w-12 rounded-full shadow-lg bg-orange-600 hover:bg-orange-700"
                onClick={() => handleAction(onShare)}
              >
                <Share2 className="h-5 w-5 text-white" />
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.4 }}
              className="flex items-center gap-2"
            >
              <span className="bg-white text-sm font-medium shadow-lg rounded-full py-1 px-3">List a Deal</span>
              <Button 
                size="icon" 
                className="h-12 w-12 rounded-full shadow-lg bg-[#135341] hover:bg-[#135341]/90"
                onClick={() => handleAction(onAddDeal)}
              >
                <Plus className="h-5 w-5 text-white" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Button 
        size="icon" 
        className={`h-12 w-12 rounded-full shadow-lg ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-[#135341] hover:bg-[#135341]/90'} transition-colors duration-200`}
        onClick={toggleMenu}
      >
        {isOpen ? (
          <X className="h-5 w-5 text-white" />
        ) : (
          <Plus className="h-5 w-5 text-white" />
        )}
      </Button>
    </div>
  );
}