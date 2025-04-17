import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Phone, User, X, ChevronRight } from 'lucide-react';
import { Property } from '@shared/schema';

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
    // In a real app, this would trigger a phone call
    alert("Calling seller at (555) 123-4567");
  };

  const handleProfileClick = () => {
    setIsExpanded(false);
    // Navigate to profile page
    alert("Viewing REP profile: " + sellerName);
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
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 shadow-md bg-white">
        <div className="flex items-center justify-between h-14 px-6">
          {/* Call Button (Left) */}
          <button 
            className="flex items-center justify-center text-[#09261E] h-14 w-20"
            onClick={handlePhoneClick}
          >
            <Phone size={24} className="text-[#09261E]" />
          </button>
          
          {/* Empty center space for avatar */}
          <div className="flex-1"></div>
          
          {/* Message Button (Right) */}
          <button 
            className="flex items-center justify-center text-[#09261E] h-14 w-20"
            onClick={handleMessageClick}
          >
            <MessageCircle size={24} className="text-[#09261E]" />
          </button>
        </div>
        
        {/* Center Avatar Button with expansion */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-10">
          {/* Gradient background avatar button */}
          <div className="relative">
            {/* Circular button with gradient background */}
            <button 
              onClick={toggleExpand}
              className={`flex items-center justify-center rounded-full shadow-lg
                ${isExpanded ? 'w-20 h-20' : 'w-20 h-20'}
                ${pulseAnimation ? 'animate-pulse-gentle' : ''}
                transition-all duration-500 z-40 overflow-hidden
              `}
              style={{ 
                background: 'linear-gradient(to bottom, white, #09261E)'
              }}
            >
              {isExpanded ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[#09261E]">
                  <X size={24} className="text-white animate-fade-in" />
                </div>
              ) : (
                <div className="relative w-full h-full p-1.5">
                  <Avatar className="h-full w-full ring-0 ring-offset-0">
                    <AvatarImage src={sellerImage} alt={sellerName} className="object-cover" />
                    <AvatarFallback className="bg-[#09261E]/10 text-white text-lg">{initials}</AvatarFallback>
                  </Avatar>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Profile Info */}
      {isExpanded && (
        <div 
          className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 z-50 w-[80%] max-w-xs animate-rise-up border border-gray-200"
          style={{
            animation: 'fadeInUpward 0.3s ease-out forwards'
          } as React.CSSProperties}
        >
          <div className="flex items-center mb-3">
            <Avatar className="h-12 w-12 border-2 border-[#09261E]">
              <AvatarImage src={sellerImage} alt={sellerName} />
              <AvatarFallback className="bg-[#09261E]/10 text-[#09261E] text-sm">{initials}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <div className="font-semibold text-[#09261E]">{sellerName}</div>
              <div className="text-xs text-gray-500">{sellerPosition}</div>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
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
          
          <Button 
            onClick={handleProfileClick}
            className="w-full mt-3 bg-[#09261E] hover:bg-[#135341] text-white"
          >
            View Full Profile <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Animation classes are defined in index.css */}
    </>
  );
};

export default MobileFloatingCTA;