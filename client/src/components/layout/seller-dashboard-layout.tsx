import React, { ReactNode, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Briefcase, 
  Users, 
  BarChart3 
} from 'lucide-react';

interface SellerDashboardLayoutProps {
  children: ReactNode;
  userId: string;
}

export default function SellerDashboardLayout({ children, userId }: SellerDashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  
  // Determine which tab is active based on the current location
  const getActiveTab = () => {
    if (location.includes('/engagement')) return 'engagement';
    if (location.includes('/manage')) return 'manage';
    if (location.includes('/analytics')) return 'analytics';
    return 'home';
  };

  // Function to handle tab navigation
  const handleTabChange = (value: string) => {
    switch (value) {
      case 'home':
        setLocation(`/sellerdash/${userId}`);
        break;
      case 'manage':
        setLocation(`/sellerdash/${userId}/manage`);
        break;
      case 'engagement':
        setLocation(`/sellerdash/${userId}/engagement`);
        break;
      case 'analytics':
        setLocation(`/sellerdash/${userId}/analytics`);
        break;
    }
  };

  return (
    <div className="pt-16 sm:pt-20 w-full">
      {/* Sticky navigation bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm pt-2 pb-3 border-b border-gray-100 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs value={getActiveTab()} onValueChange={handleTabChange} className="w-full">
            <TabsList className="bg-white rounded-xl p-1.5 flex w-full border border-gray-200 shadow-sm min-w-max overflow-x-auto">
              <TabsTrigger 
                value="home" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-1 whitespace-nowrap font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#135341] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg"
              >
                <Home className="h-4 w-4 mr-2 hidden sm:inline-block" />
                Home
              </TabsTrigger>
              <TabsTrigger 
                value="manage" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-1 whitespace-nowrap font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#135341] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg"
              >
                <Briefcase className="h-4 w-4 mr-2 hidden sm:inline-block" />
                Manage
              </TabsTrigger>
              <TabsTrigger 
                value="engagement" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-1 whitespace-nowrap font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#135341] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg"
              >
                <Users className="h-4 w-4 mr-2 hidden sm:inline-block" />
                Engagement
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-1 whitespace-nowrap font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#135341] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg"
              >
                <BarChart3 className="h-4 w-4 mr-2 hidden sm:inline-block" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Page content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {children}
      </div>
    </div>
  );
}