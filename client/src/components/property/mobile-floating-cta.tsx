import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Phone } from 'lucide-react';
import { Property } from '@shared/schema';

interface MobileFloatingCTAProps {
  property?: Property;
  onClick?: () => void;
  onContactClick?: () => void;
  onOfferClick?: () => void;
  sellerName?: string;
  sellerImage?: string;
}

const MobileFloatingCTA: React.FC<MobileFloatingCTAProps> = ({
  property,
  onClick,
  onContactClick,
  onOfferClick,
  sellerName = "Michael Johnson",
  sellerImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&h=120&auto=format&fit=crop"
}) => {
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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] p-0 z-30 flex items-center justify-between">
      <button 
        className="flex items-center justify-center bg-[#803344] text-white h-14 w-14 rounded-none"
        onClick={handlePhoneClick}
      >
        <Phone size={22} />
      </button>
      
      <a href="#" className="flex items-center px-2 h-14" onClick={(e) => e.preventDefault()}>
        <Avatar className="h-10 w-10 border border-gray-300">
          <AvatarImage src={sellerImage} alt={sellerName} />
          <AvatarFallback className="bg-[#09261E]/10 text-[#09261E] text-sm">{initials}</AvatarFallback>
        </Avatar>
        <div className="ml-3 mr-3">
          <div className="text-sm font-medium text-[#09261E]">{sellerName}</div>
          <div className="text-xs text-gray-500">Seller</div>
        </div>
      </a>
      
      <button 
        className="flex items-center justify-center bg-[#09261E] text-white h-14 w-14 rounded-none"
        onClick={handleMessageClick}
      >
        <MessageCircle size={22} />
      </button>
    </div>
  );
};

export default MobileFloatingCTA;