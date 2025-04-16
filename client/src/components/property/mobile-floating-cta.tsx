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
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-30 border-t-2 border-[#803344]">
        {/* Message Button (Left) */}
        <button 
          className="absolute left-0 bottom-0 flex items-center justify-center bg-[#09261E] text-white h-14 w-14 rounded-none"
          onClick={handleMessageClick}
        >
          <MessageCircle size={22} className="text-white" />
        </button>
        
        {/* Call Button (Right) */}
        <button 
          className="absolute right-0 bottom-0 flex items-center justify-center bg-[#803344] text-white h-14 w-14 rounded-none"
          onClick={handlePhoneClick}
        >
          <Phone size={22} />
        </button>
        
        {/* Center Avatar Button with expansion */}
        <div className="relative h-14 flex justify-center">
          <button 
            onClick={toggleExpand}
            className={`absolute -top-8 flex items-center justify-center rounded-full shadow-lg
              ${isExpanded ? 'bg-[#09261E]' : 'bg-[#09261E]'} 
              ${isExpanded ? 'w-16 h-16' : 'w-16 h-16'}
              ${pulseAnimation ? 'animate-pulse-gentle' : ''}
              transition-all duration-500 z-40
            `}
          >
            {isExpanded ? (
              <X size={24} className="text-white animate-fade-in" />
            ) : (
              <div className="relative">
                <Avatar className="h-full w-full border-2 border-white shadow-2xl">
                  <AvatarImage src={sellerImage} alt={sellerName} className="object-cover" />
                  <AvatarFallback className="bg-[#09261E]/10 text-white text-lg">{initials}</AvatarFallback>
                </Avatar>
              </div>
            )}
          </button>
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