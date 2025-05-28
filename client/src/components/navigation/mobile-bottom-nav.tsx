import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Heart, Search, Plus, User, MapPin, Settings, FileText, BarChart3, Users, MessageSquare, Building2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Comprehensive search modal component
const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // Fetch properties for search
  const { data: properties = [] } = useQuery({
    queryKey: ['/api/properties'],
    enabled: isOpen && searchQuery.length > 0
  });

  // Define navigation items for search
  const navigationItems = [
    { name: 'Properties', href: '/properties', icon: Building2, description: 'Browse available properties' },
    { name: 'Favorites', href: '/favorites', icon: Heart, description: 'Your saved properties' },
    { name: 'Profile Settings', href: '/profile', icon: Settings, description: 'Account settings' },
    { name: 'Seller Dashboard', href: user?.id ? `/sellerdash/${user.id}` : '/sellerdash/1', icon: BarChart3, description: 'Manage your listings' },
    { name: 'Campaign Manager', href: user?.id ? `/sellerdash/${user.id}` : '/sellerdash/1', icon: FileText, description: 'Marketing campaigns' },
    { name: 'Analytics', href: user?.id ? `/sellerdash/${user.id}` : '/sellerdash/1', icon: BarChart3, description: 'Performance insights' },
    { name: 'Messages', href: user?.id ? `/sellerdash/${user.id}/engagement` : '/sellerdash/1/engagement', icon: MessageSquare, description: 'Buyer communications' },
    { name: 'REPs Directory', href: '/reps', icon: Users, description: 'Real estate professionals' },
  ];

  // Filter properties and navigation based on search
  const filteredProperties = properties.filter((property: any) =>
    property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.city?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3);

  const filteredNavigation = navigationItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4);

  const handleNavigation = (href: string) => {
    setLocation(href);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 pt-16">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Search PropertyDeals</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search properties, pages, or features..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135341] text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {searchQuery.length === 0 ? (
            // Quick Navigation when no search
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">QUICK NAVIGATION</h3>
              <div className="grid grid-cols-2 gap-2">
                {navigationItems.slice(0, 6).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavigation(item.href)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left transition-colors"
                  >
                    <item.icon className="h-5 w-5 text-[#135341]" />
                    <div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{item.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Search Results
            <div className="space-y-1">
              {/* Properties Section */}
              {filteredProperties.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">PROPERTIES</h3>
                  {filteredProperties.map((property: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleNavigation(`/properties/${property.id}`)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left transition-colors"
                    >
                      <Building2 className="h-5 w-5 text-[#135341]" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{property.title}</div>
                        <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {property.address}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-[#135341]">
                        ${property.price?.toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Navigation Section */}
              {filteredNavigation.length > 0 && (
                <div className="p-4 border-t">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">PAGES & FEATURES</h3>
                  {filteredNavigation.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigation(item.href)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left transition-colors"
                    >
                      <item.icon className="h-5 w-5 text-[#135341]" />
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {searchQuery.length > 0 && filteredProperties.length === 0 && filteredNavigation.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <div className="text-sm">No results found for "{searchQuery}"</div>
                  <div className="text-xs mt-1">Try a different search term</div>
                </div>
              )}
            </div>
          )}
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
                      ? (item.label === 'Favorites' ? 'text-[#803344]' : 'text-[#135341]')
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className={`transition-all duration-200 ${isActive ? 'scale-110' : ''}`}>
                    {item.icon}
                  </div>
                  <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                    isActive ? (item.label === 'Favorites' ? 'text-[#803344]' : 'text-[#135341]') : 'text-gray-500'
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