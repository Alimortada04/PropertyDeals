import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Phone, User, X, ChevronRight, DollarSign } from 'lucide-react';
import { Property } from '@shared/schema';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileFloatingCTAProps {
  property?: Property;
  onClick?: () => void;
  onContactClick?: () => void;
  onOfferClick?: () => void;
  sellerName?: string;
  sellerImage?: string;
  sellerPosition?: string;
}

const MobileFloatingCTA: React.FC<MobileFloatingCTAProps> = ({
  property,
  onClick,
  onContactClick,
  onOfferClick,
  sellerName = "Michael Johnson",
  sellerImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&h=120&auto=format&fit=crop",
  sellerPosition = "Real Estate Professional"
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(true);



  const initials = sellerName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  const handleMessageClick = () => {
    if (onContactClick) {
      onContactClick();
    } else if (onClick) {
      onClick();
    }
  };

  const handlePhoneClick = () => {
    // Also use the onContactClick handler to open the contact modal
    if (onContactClick) {
      onContactClick();
    } else if (onClick) {
      onClick();
    }
  };

  const handleProfileClick = () => {
    setIsExpanded(false);
    // Navigate to seller's public profile page
    window.location.href = '/reps/michael-johnson';
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    setPulseAnimation(false);
  };

  // Periodic pulse animation effect
  useEffect(() => {
    if (!pulseAnimation) return;
    
    const pulseInterval = setInterval(() => {
      setPulseAnimation(prev => !prev);
    }, 4000);
    
    return () => clearInterval(pulseInterval);
  }, [pulseAnimation]);

  return (
    <>
      {/* Overlay when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}
      
      {/* Fixed bottom bar with expandable center */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-white/20 shadow-lg bg-white/20 backdrop-blur-md" style={{boxShadow: '0 -8px 16px -4px rgba(0, 0, 0, 0.1), 0 -4px 6px -1px rgba(0, 0, 0, 0.06)'}}>
        <div className="flex items-center justify-between h-14 px-8">
          {/* Call Button (Left) */}
          <button 
            className="h-12 w-12 rounded-full bg-gray-200/80 backdrop-blur-sm shadow-sm hover:bg-gray-300/80 flex items-center justify-center transition-all duration-200"
            onClick={() => window.location.href = 'tel:+15551234567'}
          >
            <Phone size={22} className="text-gray-700" />
          </button>
          
          {/* Empty center space for avatar - reduced width */}
          <div className="flex-1 max-w-[120px]"></div>
          
          {/* Message Button (Right) */}
          <button 
            className="h-12 w-12 rounded-full bg-gray-200/80 backdrop-blur-sm shadow-sm hover:bg-gray-300/80 flex items-center justify-center transition-all duration-200"
            onClick={() => window.location.href = 'sms:+15551234567'}
          >
            <MessageCircle size={22} className="text-gray-700" />
          </button>
        </div>
        
        {/* Center Avatar Button with genie popup */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-10">
          <div className="relative">
            {/* Main Avatar Button */}
            <button 
              onClick={toggleExpand}
              className={`flex items-center justify-center rounded-full shadow-lg w-20 h-20
                ${pulseAnimation && !isExpanded ? 'animate-pulse-gentle' : ''}
                transition-all duration-500 z-40 overflow-hidden
              `}
              style={{ 
                background: isExpanded ? '#09261E' : 'linear-gradient(to bottom, white, #09261E)'
              }}
            >
              {isExpanded ? (
                <X size={24} className="text-white" />
              ) : (
                <div className="relative w-full h-full p-0.5">
                  <Avatar className="h-full w-full ring-0 ring-offset-0">
                    <AvatarImage src={sellerImage} alt={sellerName} className="object-cover" />
                    <AvatarFallback className="bg-[#09261E]/10 text-white text-lg">{initials}</AvatarFallback>
                  </Avatar>
                </div>
              )}
            </button>

            {/* Genie Popup */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  className="fixed bottom-28 left-4 right-4 z-50 flex justify-center"
                  initial={{ 
                    opacity: 0, 
                    scale: 0.3, 
                    y: 40,
                    transformOrigin: "center bottom"
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                      mass: 0.5
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.3, 
                    y: 40,
                    transition: {
                      duration: 0.3,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <div className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-[350px] border border-gray-100">
                    {/* Agent Info */}
                    <div className="flex items-center mb-4">
                      <Avatar className="h-12 w-12 border-2 border-[#09261E]">
                        <AvatarImage src={sellerImage} alt={sellerName} />
                        <AvatarFallback className="bg-[#09261E]/10 text-[#09261E] text-sm">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="ml-3 flex-1">
                        <div className="font-semibold text-[#09261E] text-lg">{sellerName}</div>
                        <div className="text-sm text-gray-500">{sellerPosition}</div>
                      </div>
                    </div>
                    
                    {/* Agent Stats */}
                    <div className="space-y-2 text-sm mb-5">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Experience</span>
                        <span className="font-medium">8 years</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Deals Closed</span>
                        <span className="font-medium">134</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Response Time</span>
                        <span className="font-medium">1-2 hours</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => {
                          setIsExpanded(false);
                          if (onOfferClick) {
                            onOfferClick();
                          }
                        }}
                        className="flex-1 bg-[#803344] hover:bg-[#803344]/90 text-white rounded-xl py-3 text-sm font-medium"
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Make Offer
                      </Button>
                      <Button 
                        onClick={handleProfileClick}
                        className="flex-1 bg-[#09261E] hover:bg-[#09261E]/90 text-white rounded-xl py-3 text-sm font-medium"
                      >
                        <User className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>



      {/* Animation classes are defined in index.css */}
    </>
  );
};

export default MobileFloatingCTA;