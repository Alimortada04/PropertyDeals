import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  X, 
  Home, 
  DollarSign, 
  Megaphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePropertyModal } from "@/hooks/use-property-modal";
import { useOffersInboxModal } from "@/hooks/use-offers-inbox-modal";
import { useCampaignModal } from "@/hooks/use-campaign-modal";

export function QuickActionSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);
  
  const propertyModal = usePropertyModal();
  const offersInboxModal = useOffersInboxModal();
  const campaignModal = useCampaignModal();

  // Colors based on the brand palette
  const WINE_COLOR = "#803344";
  const LIGHT_GREEN = "#135341";
  const DARK_GREEN = "#09261E";
  const BRAND_PINK = "#E59F9F";

  // Handle hover events
  const handleMouseEnter = () => {
    setIsHovering(true);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    
    // Use a timeout to prevent immediate closing when moving between elements
    setTimeout(() => {
      if (!isHovering) {
        setIsOpen(false);
      }
    }, 300);
  };

  // Close when ESC key is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    // Close when clicked outside
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && event.target instanceof HTMLElement) {
        if (fabRef.current && !fabRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (callback: () => void) => {
    callback();
    setIsOpen(false);
  };

  // Orbital animation variants
  const orbitVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0,
      y: 0,
      x: 0
    },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: Math.sin((i * Math.PI) / 3) * -90,
      x: Math.cos((i * Math.PI) / 3) * -70,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: i * 0.1
      }
    }),
    exit: (i: number) => ({
      opacity: 0,
      scale: 0,
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: (3 - i) * 0.05
      }
    })
  };

  return (
    <div 
      id="quick-action-fab" 
      ref={fabRef}
      className="fixed bottom-24 sm:bottom-20 right-6 z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-16 right-0">
            {/* Property Creation - Wine colored */}
            <motion.div
              className="absolute"
              custom={1}
              variants={orbitVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Button
                onClick={() => handleAction(propertyModal.onOpen)}
                className="group relative h-12 w-12 rounded-full bg-[#803344] hover:bg-[#803344]/90 shadow-lg transition-transform transform hover:scale-110"
                aria-label="New Listing"
              >
                <Plus className="h-5 w-5" />
                <span className="absolute right-14 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  New Listing
                </span>
              </Button>
            </motion.div>
            
            {/* Offers Inbox - Light Green */}
            <motion.div
              className="absolute"
              custom={2}
              variants={orbitVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Button
                onClick={() => handleAction(offersInboxModal.onOpen)}
                className="group relative h-12 w-12 rounded-full bg-[#135341] hover:bg-[#135341]/90 shadow-lg transition-transform transform hover:scale-110"
                aria-label="Offers Inbox"
              >
                <DollarSign className="h-5 w-5" />
                <span className="absolute right-14 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Offers Inbox
                </span>
              </Button>
            </motion.div>
            
            {/* Campaign Creation - Dark Green */}
            <motion.div
              className="absolute"
              custom={3}
              variants={orbitVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Button
                onClick={() => handleAction(campaignModal.onOpen)}
                className="group relative h-12 w-12 rounded-full bg-[#09261E] hover:bg-[#09261E]/90 shadow-lg transition-transform transform hover:scale-110"
                aria-label="Market a Deal"
              >
                <Megaphone className="h-5 w-5" />
                <span className="absolute right-14 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Market a Deal
                </span>
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Main Trigger Button - Wine colored normally, Brand Pink when active */}
      <div className="relative">
        {/* Continuous pulse animation */}
        <span className={`absolute inset-0 rounded-full ${isOpen ? 'opacity-0' : 'animate-pulse opacity-70'} bg-[#803344]/30`}></span>
        
        <motion.div
          animate={{
            scale: isOpen ? 1.1 : 1,
            rotate: isOpen ? 45 : 0
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          <Button
            onClick={toggleMenu}
            className={`relative h-14 w-14 rounded-full shadow-lg transition-all duration-300 ${
              isOpen ? 'bg-[#E59F9F] hover:bg-[#E59F9F]/90' : 'bg-[#803344] hover:bg-[#803344]/90'
            }`}
            aria-label={isOpen ? 'Close menu' : 'Open actions menu'}
          >
            <Plus className="h-6 w-6 transition-transform duration-300" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}