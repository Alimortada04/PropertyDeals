import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Phone } from 'lucide-react';

interface MobileFloatingCTAProps {
  onClick: () => void;
  sellerName: string;
  sellerImage?: string;
}

const MobileFloatingCTA: React.FC<MobileFloatingCTAProps> = ({
  onClick,
  sellerName,
  sellerImage
}) => {
  const initials = sellerName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] p-3 z-30 flex items-center justify-between">
      <button 
        className="flex items-center justify-center bg-[#09261E]/10 text-[#09261E] h-12 w-12 rounded-full"
        onClick={() => {}}
      >
        <MessageCircle size={22} />
      </button>
      
      <div className="flex items-center">
        <Avatar className="h-10 w-10 border border-gray-300">
          <AvatarImage src={sellerImage} alt={sellerName} />
          <AvatarFallback className="bg-[#09261E]/10 text-[#09261E] text-sm">{initials}</AvatarFallback>
        </Avatar>
        <div className="ml-3 mr-3">
          <div className="text-sm font-medium text-[#09261E]">{sellerName}</div>
          <div className="text-xs text-gray-500">Seller</div>
        </div>
      </div>
      
      <button 
        className="flex items-center justify-center bg-[#09261E]/10 text-[#09261E] h-12 w-12 rounded-full"
        onClick={() => {}}
      >
        <Phone size={22} />
      </button>
    </div>
  );
};

export default MobileFloatingCTA;