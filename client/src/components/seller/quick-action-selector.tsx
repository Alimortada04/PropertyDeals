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

  // Orbital animation variants for left-side positioning
  const orbitVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0,
      x: 0,
      y: 0
    },
    visible: (i: number) => {
      // i=1: List Property (diagonal top-left, wine color, ~315°)
      // i=2: Offers Inbox (directly above, light green, ~0°/360°)
      // i=3: Campaign (direct left, dark green, ~275°)
      
      // Position buttons with specified angles
      let xPos, yPos;
      
      if (i === 1) {
        // List Property - diagonal top-left at ~315°
        xPos = -65;
        yPos = -65;
      } else if (i === 2) {
        // Offers Inbox - slightly to the left and above at ~350°
        xPos = -15;
        yPos = -90;
      } else {
        // Campaign - directly left at ~275°
        xPos = -90;
        yPos = -10;
      }
      
      return {
        opacity: 1,
        scale: 1,
        x: xPos,
        y: yPos,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 22,
          delay: i * 0.05
        }
      };
    },
    exit: (i: number) => ({
      opacity: 0,
      scale: 0,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 22,
        delay: (3 - i) * 0.03
      }
    })
  };

  return (
    <div 
      id="quick-action-fab" 
      ref={fabRef}
      className="fixed bottom-20 sm:bottom-16 right-6 z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-7 right-7">
            {/* List Property - Wine color at diagonal top-left ~315° */}
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
                className="group relative h-12 w-12 rounded-full bg-[#803344] hover:bg-[#803344]/80 shadow-lg transition-all duration-200 hover:shadow-xl"
                aria-label="List Property"
              >
                <Plus className="h-5 w-5" />
                <span className="absolute -top-8 -left-8 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  List Property
                </span>
              </Button>
            </motion.div>
            
            {/* Offers Inbox - Light Green directly above at ~0°/360° */}
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
                className="group relative h-12 w-12 rounded-full bg-[#135341] hover:bg-[#135341]/80 shadow-lg transition-all duration-200 hover:shadow-xl"
                aria-label="Offers Inbox"
              >
                <DollarSign className="h-5 w-5" />
                <span className="absolute -top-8 -left-8 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Offers Inbox
                </span>
              </Button>
            </motion.div>
            
            {/* Campaign Creation - Dark Green directly left at ~275° */}
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
                className="group relative h-12 w-12 rounded-full bg-[#09261E] hover:bg-[#09261E]/80 shadow-lg transition-all duration-200 hover:shadow-xl"
                aria-label="Start Campaign"
              >
                <Megaphone className="h-5 w-5" />
                <span className="absolute -top-8 -left-8 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Start Campaign
                </span>
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Main Trigger Button - Wine colored normally, Brand Pink when active */}
      <div className="relative">
        {/* Continuous pulse animation when idle */}
        <span className={`absolute inset-0 rounded-full ${isOpen ? 'opacity-0' : 'animate-pulse opacity-70'} bg-[#803344]/30`}></span>
        
        {/* Subtle shadow glow effect when active */}
        <span className={`absolute inset-0 rounded-full ${isOpen ? 'opacity-100' : 'opacity-0'} shadow-glow transition-opacity duration-300`} 
          style={{boxShadow: '0 0 15px 2px rgba(229, 159, 159, 0.6)'}}></span>
        
        <motion.div
          animate={{
            scale: isOpen ? 1.1 : 1,
            rotate: isOpen ? 45 : 0
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25
          }}
        >
          <Button
            onClick={toggleMenu}
            className={`relative h-14 w-14 rounded-full shadow-lg transition-all duration-300 ${
              isOpen ? 'bg-[#E59F9F] hover:bg-[#E59F9F]/90 border-2 border-white/40' : 'bg-[#803344] hover:bg-[#803344]/90'
            }`}
            aria-label={isOpen ? 'Close menu' : 'Open actions menu'}
          >
            <Plus className="h-6 w-6 transition-transform duration-300 text-white" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}