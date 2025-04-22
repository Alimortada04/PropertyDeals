import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Building, Home, ChevronUp } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: 'buyer' | 'seller' | 'rep';
  onRoleChange: (role: 'buyer' | 'seller' | 'rep') => void;
}

export default function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getRoleColor = (role: 'buyer' | 'seller' | 'rep') => {
    switch (role) {
      case 'buyer': return 'bg-[#09261E] hover:bg-[#09261E]/90 text-white';
      case 'seller': return 'bg-[#135341] hover:bg-[#135341]/90 text-white';
      case 'rep': return 'bg-[#803344] hover:bg-[#803344]/90 text-white';
      default: return 'bg-[#135341] hover:bg-[#135341]/90 text-white';
    }
  };

  const getRoleIcon = (role: 'buyer' | 'seller' | 'rep') => {
    switch (role) {
      case 'buyer': return <User className="h-4 w-4 mr-2" />;
      case 'seller': return <Building className="h-4 w-4 mr-2" />;
      case 'rep': return <Home className="h-4 w-4 mr-2" />;
      default: return <Building className="h-4 w-4 mr-2" />;
    }
  };

  const getRoleName = (role: 'buyer' | 'seller' | 'rep') => {
    switch (role) {
      case 'buyer': return 'Buyer';
      case 'seller': return 'Seller';
      case 'rep': return 'REP';
      default: return 'Seller';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            className={`${getRoleColor(currentRole)} rounded-full shadow-lg px-4 flex items-center gap-2`}
          >
            {getRoleIcon(currentRole)}
            <span>Mode: {getRoleName(currentRole)}</span>
            <ChevronUp 
              className={`h-4 w-4 transform transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            className={`flex items-center gap-2 ${currentRole === 'buyer' ? 'bg-slate-100' : ''}`}
            onClick={() => onRoleChange('buyer')}
          >
            <div className="h-8 w-8 rounded-full bg-[#09261E]/10 flex items-center justify-center">
              <User className="h-4 w-4 text-[#09261E]" />
            </div>
            <div>
              <p className="font-medium">Buyer Dashboard</p>
              <p className="text-xs text-gray-500">Search and manage properties</p>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem
            className={`flex items-center gap-2 ${currentRole === 'seller' ? 'bg-slate-100' : ''}`}
            onClick={() => onRoleChange('seller')}
          >
            <div className="h-8 w-8 rounded-full bg-[#135341]/10 flex items-center justify-center">
              <Building className="h-4 w-4 text-[#135341]" />
            </div>
            <div>
              <p className="font-medium">Seller Dashboard</p>
              <p className="text-xs text-gray-500">List and manage your deals</p>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem
            className={`flex items-center gap-2 ${currentRole === 'rep' ? 'bg-slate-100' : ''}`}
            onClick={() => onRoleChange('rep')}
          >
            <div className="h-8 w-8 rounded-full bg-[#803344]/10 flex items-center justify-center">
              <Home className="h-4 w-4 text-[#803344]" />
            </div>
            <div>
              <p className="font-medium">REP Dashboard</p>
              <p className="text-xs text-gray-500">Manage clients and listings</p>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <div className="p-2">
            <p className="text-xs text-gray-500 text-center">
              Switching roles will change your dashboard view
            </p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}