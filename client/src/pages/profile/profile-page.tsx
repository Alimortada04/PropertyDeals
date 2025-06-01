import React, { useState, useRef, useEffect, useMemo } from "react";
import { useLocation, useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { navigateToHelpSection, navigateToProfileTab, getCurrentHelpSection } from "@/lib/navigation";
import ConnectionsTab from "./connections-tab";
import MobileSettingsMenu from "@/components/profile/mobile-settings-menu";
import MobileSettingsSection from "@/components/profile/mobile-settings-section";
import { 
  getBuyerProfile, 
  upsertBuyerProfile, 
  isUsernameAvailable, 
  uploadProfilePhoto, 
  uploadBannerImage, 
  uploadProofOfFunds,
  type BuyerProfile 
} from "@/lib/buyer-profile";
import { useSellerProfile } from "@/hooks/useSellerProfile";
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Upload, 
  MapPin, 
  Building, 
  DollarSign, 
  Calendar, 
  FileText, 
  Save, 
  Check, 
  X, 
  Edit3, 
  Upload as UploadIcon, 
  Globe, 
  AlertCircle, 
  Users, 
  Bell, 
  Settings, 
  HelpCircle, 
  Link as LinkIcon, 
  Shield, 
  CreditCard, 
  Plus, 
  Search, 
  Star, 
  TrendingUp, 
  CheckCircle2, 
  ChevronRight, 
  LogOut,
  Hammer,
  Wrench 
} from "lucide-react";

// Simple ProfilePage component for testing - with fixed logout button placement
function ProfilePage() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[240px] bg-white border-r border-gray-200">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        </div>
        
        <div className="flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
          <div className="flex-1 p-4">
            <div className="space-y-1">
              <button
                onClick={() => handleTabChange("account")}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "account"
                    ? "bg-[#09261E] text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <User className="inline mr-2 h-4 w-4" />
                Account
              </button>

              <button
                onClick={() => handleTabChange("property_preferences")}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "property_preferences"
                    ? "bg-[#09261E] text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Settings className="inline mr-2 h-4 w-4" />
                Property Preferences
              </button>

              <button
                onClick={() => handleTabChange("connections")}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "connections"
                    ? "bg-[#09261E] text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Users className="inline mr-2 h-4 w-4" />
                Connections
              </button>

              <button
                onClick={() => handleTabChange("notifications")}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "notifications"
                    ? "bg-[#09261E] text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Bell className="inline mr-2 h-4 w-4" />
                Notifications
              </button>

              <button
                onClick={() => handleTabChange("integrations")}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "integrations"
                    ? "bg-[#09261E] text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Wrench className="inline mr-2 h-4 w-4" />
                Integrations
              </button>

              <button
                onClick={() => handleTabChange("memberships")}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "memberships"
                    ? "bg-[#09261E] text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <CreditCard className="inline mr-2 h-4 w-4" />
                Memberships
              </button>

              <button
                onClick={() => handleTabChange("help")}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "help"
                    ? "bg-[#09261E] text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <HelpCircle className="inline mr-2 h-4 w-4" />
                Help Center
              </button>

              {/* Logout Button - Now in scrollable area */}
              <div className="border-t pt-4 mt-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors">
                      <LogOut className="inline mr-2 h-4 w-4" />
                      Log Out
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You will need to sign in again to access your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>No, take me back</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
                        Yes, I'm sure
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 bg-gray-50 p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {activeTab === "account" && (
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account information and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input value={user?.fullName || ''} placeholder="Enter your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input value={user?.email || ''} placeholder="Enter your email" />
                  </div>
                  <Button className="bg-[#09261E] hover:bg-[#09261E]/90">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "property_preferences" && (
            <Card>
              <CardHeader>
                <CardTitle>Property Preferences</CardTitle>
                <CardDescription>Set your investment criteria and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Types</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single-family">Single Family</SelectItem>
                        <SelectItem value="multi-family">Multi Family</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="bg-[#09261E] hover:bg-[#09261E]/90">Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Other tab content would go here */}
          {activeTab !== "account" && activeTab !== "property_preferences" && (
            <Card>
              <CardHeader>
                <CardTitle>{activeTab.replace('_', ' ').toUpperCase()}</CardTitle>
                <CardDescription>This section is under development</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Content for {activeTab} will be available soon.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Mobile Settings Menu - Enhanced with Logout Button
function EnhancedMobileSettingsMenu() {
  const { signOut } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const settingsItems = [
    {
      id: 'account',
      title: 'Account',
      description: 'Personal information and security',
      icon: User,
      href: '/profile/account'
    },
    {
      id: 'property_preferences',
      title: 'Property Preferences',
      description: 'Investment criteria and filters',
      icon: Settings,
      href: '/profile/property_preferences'
    },
    {
      id: 'connections',
      title: 'Connections',
      description: 'Contractors and professionals',
      icon: Users,
      href: '/profile/connections'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Email and push preferences',
      icon: Bell,
      href: '/profile/notifications'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Third-party connections',
      icon: Wrench,
      href: '/profile/integrations'
    },
    {
      id: 'memberships',
      title: 'Memberships',
      description: 'Plans and billing',
      icon: CreditCard,
      href: '/profile/memberships'
    },
    {
      id: 'help',
      title: 'Help Center',
      description: 'Support and documentation',
      icon: HelpCircle,
      href: '/profile/help'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 md:hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
      </div>
      
      {/* Settings Menu Items */}
      <div className="mt-6 px-4 space-y-3">
        {settingsItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link key={item.id} href={item.href}>
              <div className="bg-white rounded-lg border border-gray-200 p-4 active:bg-gray-50 transition-colors min-h-[48px] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <IconComponent className="h-5 w-5 text-[#135341]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </Link>
          );
        })}
        
        {/* Logout Button - Added to mobile view */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="bg-white rounded-lg border border-gray-200 p-4 active:bg-gray-50 transition-colors min-h-[48px] flex items-center justify-between cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <LogOut className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-red-600 truncate">
                      Log Out
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      Sign out of your account
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will need to sign in again to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No, take me back</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
                  Yes, I'm sure
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

// Export the profile page with mobile routing integration
export default function ProfilePageWithMobileRouting() {
  const [location] = useLocation();
  
  // Section detection from URL
  const urlParts = location.split('/profile/');
  const currentSection = urlParts[1] || '';
  
  // Mobile settings menu titles
  const getSectionTitle = (section: string) => {
    const titles = {
      'account': 'Account',
      'property_preferences': 'Property Preferences', 
      'connections': 'Connections',
      'notifications': 'Notifications',
      'integrations': 'Integrations',
      'memberships': 'Memberships',
      'help': 'Help Center'
    };
    return titles[section as keyof typeof titles] || 'Settings';
  };

  // If we're on a specific section route, show mobile back navigation on mobile
  if (currentSection && currentSection !== 'profile') {
    return (
      <>
        {/* Mobile: Show section with back navigation */}
        <div className="md:hidden">
          <MobileSettingsSection 
            section={currentSection}
            title={getSectionTitle(currentSection)}
          >
            <div className="space-y-6">
              <ProfilePage />
            </div>
          </MobileSettingsSection>
        </div>
        
        {/* Desktop: Show normal profile page */}
        <div className="hidden md:block">
          <ProfilePage />
        </div>
      </>
    );
  }

  // If we're on /profile, show mobile menu on mobile and desktop layout on desktop
  return (
    <>
      {/* Mobile: Show enhanced settings menu with logout */}
      <div className="md:hidden">
        <EnhancedMobileSettingsMenu />
      </div>
      
      {/* Desktop: Show normal profile page with logout in sidebar */}
      <div className="hidden md:block">
        <ProfilePage />
      </div>
    </>
  );
}