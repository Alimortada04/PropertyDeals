import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Phone, User, X } from 'lucide-react';
import { Property } from '@shared/schema';

interface MobileFloatingCTAProps {
  property?: Property;
  onClick?: () => void;
  onContactClick?: () => void;
  onOfferClick?: () => void;
  sellerName?: string;
  sellerImage?: string;
  isNewContact?: boolean;
}

const MobileFloatingCTA: React.FC<MobileFloatingCTAProps> = ({
  property,
  onClick,
  onContactClick,
  onOfferClick,
  sellerName = "Michael Johnson",
  sellerImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&h=120&auto=format&fit=crop",
  isNewContact = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(true);

  const initials = sellerName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  const handleMessageClick = () => {
    setIsExpanded(false);
    if (onContactClick) {
      onContactClick();
    } else if (onClick) {
      onClick();
    }
  };

  const handlePhoneClick = () => {
    setIsExpanded(false);
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
      
      {/* Main Floating CTA */}
      <div className={`fixed bottom-5 left-0 right-0 z-50 flex items-center justify-center transition-all duration-300`}>
        {/* The main CTA button */}
        <button 
          onClick={toggleExpand}
          className={`relative flex items-center justify-center rounded-full shadow-lg
            ${isExpanded ? 'bg-[#09261E]' : 'bg-[#09261E]'} 
            ${isExpanded ? 'w-16 h-16' : 'w-16 h-16'}
            ${pulseAnimation ? 'animate-pulse-gentle' : ''}
            transition-all duration-500
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
              
              {/* Badge for new contacts */}
              {isNewContact && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              )}
            </div>
          )}
        </button>

        {/* Expandable Actions */}
        {isExpanded && (
          <div className="absolute bottom-0 flex items-center justify-center w-full space-x-4 animate-slide-up">
            {/* Call Button */}
            <button 
              onClick={handlePhoneClick}
              className="flex flex-col items-center justify-center transform transition-all duration-300 bg-[#803344] rounded-full w-12 h-12 shadow-md hover:scale-110"
              style={{
                transitionDelay: '100ms',
                animation: 'fadeInRightToLeft 0.3s ease-out forwards'
              }}
            >
              <Phone size={20} className="text-white" />
            </button>

            {/* Profile Button */}
            <button 
              onClick={handleProfileClick}
              className="flex flex-col items-center justify-center transform transition-all duration-300 bg-white rounded-full w-14 h-14 shadow-md hover:scale-110 border-2 border-[#09261E]"
              style={{
                transitionDelay: '200ms',
                animation: 'fadeInUpward 0.3s ease-out forwards'
              }}
            >
              <Avatar className="h-12 w-12 border border-[#09261E]">
                <AvatarImage src={sellerImage} alt={sellerName} />
                <AvatarFallback className="bg-[#09261E]/10 text-[#09261E] text-sm">{initials}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-6 text-xs font-medium bg-white px-2 py-1 rounded-full shadow-sm border border-gray-200">
                {sellerName}
              </div>
            </button>

            {/* Message Button */}
            <button 
              onClick={handleMessageClick}
              className="flex flex-col items-center justify-center transform transition-all duration-300 bg-[#09261E] rounded-full w-12 h-12 shadow-md hover:scale-110"
              style={{
                transitionDelay: '300ms',
                animation: 'fadeInLeftToRight 0.3s ease-out forwards'
              }}
            >
              <MessageCircle size={20} className="text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes pulse-gentle {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
        }
        
        @keyframes fadeInUpward {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInRightToLeft {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInLeftToRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 2s infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(-60px);
          }
        }
      `}</style>
    </>
  );
};

export default MobileFloatingCTA;