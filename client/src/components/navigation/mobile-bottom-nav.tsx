import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Heart, Search, Plus, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simple search modal component
const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Search Properties</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search by location, price, or property type..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135341]"
            autoFocus
          />
          <div className="flex gap-2">
            <Button className="flex-1 bg-[#135341] hover:bg-[#09261E]">
              Search
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MobileBottomNav() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Get user initials for avatar fallback
  const getUserInitials = (user: any) => {
    if (!user) return 'U';
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const navItems = [
    {
      icon: <User className="w-6 h-6" />,
      label: 'Profile',
      href: '/profile',
      isActive: location === '/profile',
    },
    {
      icon: <Search className="w-6 h-6" />,
      label: 'Search',
      onClick: () => setIsSearchOpen(true),
      isActive: false,
    },
    {
      icon: <Home className="w-6 h-6" />,
      label: 'Properties',
      href: '/properties',
      isActive: location === '/properties' || location === '/',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      label: 'Favorites',
      href: '/favorites',
      isActive: location === '/favorites',
    },
    {
      icon: <Plus className="w-6 h-6" />,
      label: 'List',
      href: user?.id ? `/sellerdash/${user.id}` : '/sellerdash/1',
      isActive: location.startsWith('/sellerdash'),
    },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation - Only visible on screens < 768px */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-40 bg-white border-t border-gray-200 shadow-lg rounded-t-2xl" 
           style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item, index) => {
            const isActive = item.isActive;
            
            if (item.onClick) {
              // Search button with modal trigger
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`flex flex-col items-center justify-center px-2 py-1 rounded-lg transition-all duration-200 active:scale-95 ${
                    isActive 
                      ? 'text-[#135341]' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className={`transition-all duration-200 ${isActive ? 'scale-110' : ''}`}>
                    {item.icon}
                  </div>
                  <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                    isActive ? 'text-[#135341]' : 'text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            }

            // Regular navigation link
            return (
              <Link key={index} href={item.href!}>
                <button
                  className={`flex flex-col items-center justify-center px-2 py-1 rounded-lg transition-all duration-200 active:scale-95 ${
                    isActive 
                      ? 'text-[#135341]' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className={`transition-all duration-200 ${isActive ? 'scale-110' : ''}`}>
                    {item.icon}
                  </div>
                  <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                    isActive ? 'text-[#135341]' : 'text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      {/* Bottom padding spacer for mobile to prevent content from being hidden behind the nav */}
      <div className="h-16 md:hidden" />
    </>
  );
}