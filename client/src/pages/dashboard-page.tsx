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
      <div className="sticky top-0 z-20 bg-[#F8F9FA] pt-6 pb-4 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full bg-white rounded-lg h-auto p-1.5 mb-4 shadow-md">
              <TabsTrigger 
                value="discover" 
                className="data-[state=active]:bg-[#09261E] data-[state=active]:text-white data-[state=inactive]:hover:bg-gray-100 flex-1 rounded-md py-3 transition-all"
              >
                <Compass className="w-4 h-4 mr-2" />
                <span className="font-medium">Discover</span>
              </TabsTrigger>
              <TabsTrigger 
                value="manage" 
                className="data-[state=active]:bg-[#09261E] data-[state=active]:text-white data-[state=inactive]:hover:bg-gray-100 flex-1 rounded-md py-3 transition-all"
              >
                <FileClock className="w-4 h-4 mr-2" />
                <span className="font-medium">Manage</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-[#09261E] data-[state=active]:text-white data-[state=inactive]:hover:bg-gray-100 flex-1 rounded-md py-3 transition-all"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                <span className="font-medium">Analytics</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
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