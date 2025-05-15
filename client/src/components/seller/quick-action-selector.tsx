import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  X, 
  HomeIcon, 
  MessageSquare, 
  Megaphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePropertyModal } from "@/hooks/use-property-modal";
import { useOffersInboxModal } from "@/hooks/use-offers-inbox-modal";
import { useCampaignModal } from "@/hooks/use-campaign-modal";

export function QuickActionSelector() {
  const [isOpen, setIsOpen] = useState(false);
  
  const propertyModal = usePropertyModal();
  const offersInboxModal = useOffersInboxModal();
  const campaignModal = useCampaignModal();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (callback: () => void) => {
    callback();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col-reverse gap-3 mb-3">
            {/* Campaign Creation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <Button
                onClick={() => handleAction(campaignModal.onOpen)}
                className="group relative h-12 w-12 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg transition-transform transform hover:scale-105"
                aria-label="Start Campaign"
              >
                <Megaphone className="h-5 w-5" />
                <span className="absolute right-14 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Start Campaign
                </span>
              </Button>
            </motion.div>
            
            {/* Offers Inbox */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Button
                onClick={() => handleAction(offersInboxModal.onOpen)}
                className="group relative h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition-transform transform hover:scale-105"
                aria-label="Offers Inbox"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="absolute right-14 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Offers Inbox
                </span>
              </Button>
            </motion.div>
            
            {/* Property Creation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={() => handleAction(propertyModal.onOpen)}
                className="group relative h-12 w-12 rounded-full bg-[#803344] hover:bg-[#803344]/90 shadow-lg transition-transform transform hover:scale-105"
                aria-label="List a Property"
              >
                <HomeIcon className="h-5 w-5" />
                <span className="absolute right-14 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  List a Property
                </span>
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Main Trigger Button - Wine colored for REPs */}
      <div className="relative">
        {/* Pulse animation for the button */}
        <span className={`absolute inset-0 rounded-full ${isOpen ? '' : 'animate-ping'} bg-[#803344]/30`}></span>
        
        <Button
          onClick={toggleMenu}
          className={`relative h-14 w-14 rounded-full shadow-lg transition-all duration-300 ${
            isOpen ? 'bg-red-500 hover:bg-red-600 rotate-45' : 'bg-[#803344] hover:bg-[#803344]/90'
          }`}
          aria-label={isOpen ? 'Close menu' : 'Open actions menu'}
        >
          {isOpen ? <X className="h-6 w-6" /> : <PlusCircle className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  );
}