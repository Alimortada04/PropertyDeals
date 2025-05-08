import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardDiscoverTab from "@/components/dashboard/tabs/discover-tab";
import DashboardManageTab from "@/components/dashboard/tabs/manage-tab";
import DashboardAnalyticsTab from "@/components/dashboard/tabs/analytics-tab";
import { Compass, FileClock, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";

// Mock user data
const mockUser = {
  name: "John Doe",
  avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  profileCompletion: 85
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("discover");
  const [, setLocation] = useLocation();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without navigation
    window.history.pushState({}, "", `/dashboard?tab=${value}`);
  };
  
  // Parse query string on initial load
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam && ["discover", "manage", "analytics"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);
  
  return (
    <div className="bg-[#F8F9FA]">
      <div className="sticky top-0 z-20 mb-4 mt-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex justify-center">
            <div className="backdrop-blur-lg bg-white/10 shadow-lg border border-white/10 rounded-xl px-4 py-2 inline-flex">
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="bg-transparent p-1 flex-nowrap gap-2 overflow-x-auto">
                  <TabsTrigger 
                    value="discover" 
                    className="data-[state=active]:bg-white data-[state=active]:text-[#09261E] data-[state=active]:shadow-sm data-[state=active]:font-semibold data-[state=inactive]:bg-white/70 data-[state=inactive]:border data-[state=inactive]:border-neutral-200 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-100 rounded-full px-4 py-2 transition-all duration-200 ease-in-out scale-100 hover:scale-[1.02] relative"
                  >
                    <Compass className="w-4 h-4 mr-2" />
                    <span className="font-medium">Discover</span>
                    <div className="data-[state=active]:absolute data-[state=active]:bottom-0 data-[state=active]:left-1/2 data-[state=active]:transform data-[state=active]:-translate-x-1/2 data-[state=active]:w-1 data-[state=active]:h-1 data-[state=active]:bg-[#09261E] data-[state=active]:rounded-full data-[state=active]:mb-0.5"></div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="manage" 
                    className="data-[state=active]:bg-white data-[state=active]:text-[#09261E] data-[state=active]:shadow-sm data-[state=active]:font-semibold data-[state=inactive]:bg-white/70 data-[state=inactive]:border data-[state=inactive]:border-neutral-200 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-100 rounded-full px-4 py-2 transition-all duration-200 ease-in-out scale-100 hover:scale-[1.02] relative"
                  >
                    <FileClock className="w-4 h-4 mr-2" />
                    <span className="font-medium">Manage</span>
                    <div className="data-[state=active]:absolute data-[state=active]:bottom-0 data-[state=active]:left-1/2 data-[state=active]:transform data-[state=active]:-translate-x-1/2 data-[state=active]:w-1 data-[state=active]:h-1 data-[state=active]:bg-[#09261E] data-[state=active]:rounded-full data-[state=active]:mb-0.5"></div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analytics" 
                    className="data-[state=active]:bg-white data-[state=active]:text-[#09261E] data-[state=active]:shadow-sm data-[state=active]:font-semibold data-[state=inactive]:bg-white/70 data-[state=inactive]:border data-[state=inactive]:border-neutral-200 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-100 rounded-full px-4 py-2 transition-all duration-200 ease-in-out scale-100 hover:scale-[1.02] relative"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    <span className="font-medium">Analytics</span>
                    <div className="data-[state=active]:absolute data-[state=active]:bottom-0 data-[state=active]:left-1/2 data-[state=active]:transform data-[state=active]:-translate-x-1/2 data-[state=active]:w-1 data-[state=active]:h-1 data-[state=active]:bg-[#09261E] data-[state=active]:rounded-full data-[state=active]:mb-0.5"></div>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsContent value="discover" className="p-0 border-none">
            <DashboardDiscoverTab user={mockUser} />
          </TabsContent>
          
          <TabsContent value="manage" className="p-0 border-none">
            <DashboardManageTab />
          </TabsContent>
          
          <TabsContent value="analytics" className="p-0 border-none">
            <DashboardAnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}