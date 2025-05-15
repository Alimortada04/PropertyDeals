import { useState } from "react";
import { PlusIcon, MessageSquareIcon, MegaphoneIcon, HomeIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePropertyModal } from "@/hooks/use-property-modal";
import { useOffersInboxModal } from "@/hooks/use-offers-inbox-modal";
import { useCampaignModal } from "@/hooks/use-campaign-modal";

interface QuickActionSelectorProps {
  className?: string;
}

export function QuickActionSelector({ className }: QuickActionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const propertyModal = usePropertyModal();
  const offersInboxModal = useOffersInboxModal();
  const campaignModal = useCampaignModal();

  // Animation variants
  const buttonVariants = {
    closed: { scale: 1 },
    open: { scale: 1.1, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    closed: (i: number) => ({
      opacity: 0,
      y: 0,
      x: 0,
      transition: {
        duration: 0.2,
      },
    }),
    open: (i: number) => ({
      opacity: 1,
      // Position items in an arc
      y: i === 0 ? -70 : i === 1 ? -50 : -20,
      x: i === 0 ? -30 : i === 1 ? -60 : -70,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: i * 0.05,
      },
    }),
  };

  // Action handlers
  const handleAddProperty = () => {
    setIsOpen(false);
    propertyModal.onOpen();
  };

  const handleOffersInbox = () => {
    setIsOpen(false);
    offersInboxModal.onOpen();
  };
  
  const handleStartCampaign = () => {
    setIsOpen(false);
    campaignModal.onOpen();
  };

  // Toggle menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn("fixed bottom-8 right-8 z-50", className)}>
      {/* Main FAB Button with pulse animation */}
      <motion.button
        className="w-14 h-14 rounded-full bg-[#803344] text-white shadow-lg flex items-center justify-center relative"
        onClick={toggleMenu}
        variants={buttonVariants}
        animate={isOpen ? "open" : "closed"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <PlusIcon size={24} />
        {/* Pulse animation */}
        <motion.div
          className="absolute w-full h-full rounded-full bg-[#803344] z-[-1]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      </motion.button>

      {/* Sub-action buttons */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background overlay to capture clicks outside */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* List a Property button */}
            <motion.div
              className="absolute bottom-0 right-0 z-50"
              custom={0}
              variants={itemVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="relative group">
                <button
                  className="w-12 h-12 rounded-full bg-[#803344] text-white shadow-md flex items-center justify-center hover:bg-[#9a3e52] transition-colors"
                  onClick={handleAddProperty}
                >
                  <HomeIcon size={20} />
                </button>
                <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  List a Property
                </div>
              </div>
            </motion.div>

            {/* Offers Inbox button */}
            <motion.div
              className="absolute bottom-0 right-0 z-50"
              custom={1}
              variants={itemVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="relative group">
                <button
                  className="w-12 h-12 rounded-full bg-[#135341] text-white shadow-md flex items-center justify-center hover:bg-[#0d3f30] transition-colors"
                  onClick={handleOffersInbox}
                >
                  <MessageSquareIcon size={20} />
                </button>
                <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Offers Inbox
                </div>
              </div>
            </motion.div>

            {/* Start Campaign button */}
            <motion.div
              className="absolute bottom-0 right-0 z-50"
              custom={2}
              variants={itemVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="relative group">
                <button
                  className="w-12 h-12 rounded-full bg-[#1a73e8] text-white shadow-md flex items-center justify-center hover:bg-[#1665d0] transition-colors"
                  onClick={handleStartCampaign}
                >
                  <MegaphoneIcon size={20} />
                </button>
                <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Start Campaign
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}