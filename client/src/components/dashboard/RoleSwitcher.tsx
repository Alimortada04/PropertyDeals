import React from 'react';
import { Button } from "@/components/ui/button";
import { Home, Building, User } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: 'buyer' | 'seller' | 'rep';
  onRoleChange: (role: 'buyer' | 'seller' | 'rep') => void;
}

export default function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const getRoleStyle = (role: 'buyer' | 'seller' | 'rep') => {
    if (role === currentRole) {
      switch (role) {
        case 'buyer':
          return 'bg-[#09261E] text-white';
        case 'seller':
          return 'bg-[#135341] text-white';
        case 'rep':
          return 'bg-[#803344] text-white';
      }
    }
    
    return 'bg-white hover:bg-gray-100 text-gray-700';
  };
  
  const getRoleIcon = (role: 'buyer' | 'seller' | 'rep') => {
    switch (role) {
      case 'buyer':
        return <Home className="h-4 w-4 mr-2" />;
      case 'seller':
        return <Building className="h-4 w-4 mr-2" />;
      case 'rep':
        return <User className="h-4 w-4 mr-2" />;
    }
  };
  
  return (
    <div className="bg-white p-2 rounded-lg shadow-md border mb-4">
      <div className="text-sm font-medium text-gray-500 mb-2 px-2">
        Switch Role
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 rounded-md ${getRoleStyle('buyer')}`}
          onClick={() => onRoleChange('buyer')}
        >
          {getRoleIcon('buyer')}
          <span>Buyer</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 rounded-md ${getRoleStyle('seller')}`}
          onClick={() => onRoleChange('seller')}
        >
          {getRoleIcon('seller')}
          <span>Seller</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 rounded-md ${getRoleStyle('rep')}`}
          onClick={() => onRoleChange('rep')}
        >
          {getRoleIcon('rep')}
          <span>REP</span>
        </Button>
      </div>
    </div>
  );
}