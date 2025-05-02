import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AlertCircle, 
  Home, 
  BarChart4, 
  ClipboardList, 
  Search, 
  UserPlus, 
  MessageSquare, 
  Activity, 
  Calculator, 
  Bell,
  Heart,
  Eye,
  ArrowRight,
  Star,
  ChevronRight,
  Phone,
  FileText,
  Calendar,
  CheckSquare,
  Clock,
  Users,
  Wrench
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import PropertyCard from "@/components/properties/property-card";

// Mock data for demonstration purposes
import { properties } from "@/data/properties";

// Components
import DashboardDiscoverTab from "@/components/dashboard/tabs/discover-tab";
import DashboardManageTab from "@/components/dashboard/tabs/manage-tab";
import DashboardAnalyticsTab from "@/components/dashboard/tabs/analytics-tab";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("discover");
  const [, setLocation] = useLocation();
  
  // Sample user data - This would come from auth context in a real app
  const user = {
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    profileCompletion: 85,
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-[#09261E]">My Dashboard</h1>
          <p className="text-gray-600">Track your deals, manage your properties, and analyze your investments</p>
        </div>
      </div>
      
      {/* Tabs Navigation - Sticky at top */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <Tabs 
            defaultValue="discover" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full h-16 bg-transparent border-b border-gray-100 justify-start gap-8">
              <TabsTrigger 
                value="discover" 
                className="text-base font-medium data-[state=active]:border-b-2 data-[state=active]:border-[#09261E] data-[state=active]:text-[#09261E] data-[state=active]:shadow-none rounded-none py-4 px-1"
              >
                <Home className="w-5 h-5 mr-2" />
                Discover
              </TabsTrigger>
              <TabsTrigger 
                value="manage" 
                className="text-base font-medium data-[state=active]:border-b-2 data-[state=active]:border-[#09261E] data-[state=active]:text-[#09261E] data-[state=active]:shadow-none rounded-none py-4 px-1"
              >
                <ClipboardList className="w-5 h-5 mr-2" />
                Manage
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="text-base font-medium data-[state=active]:border-b-2 data-[state=active]:border-[#09261E] data-[state=active]:text-[#09261E] data-[state=active]:shadow-none rounded-none py-4 px-1"
              >
                <BarChart4 className="w-5 h-5 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6 pb-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="discover" className="mt-0">
                    <DashboardDiscoverTab user={user} />
                  </TabsContent>
                  
                  <TabsContent value="manage" className="mt-0">
                    <DashboardManageTab />
                  </TabsContent>
                  
                  <TabsContent value="analytics" className="mt-0">
                    <DashboardAnalyticsTab />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}