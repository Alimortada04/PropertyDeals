import React, { useState, FC } from "react";
import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
// Import removed - will use inline image
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Home,
  Building,
  Users,
  MessageSquare,
  Book,
  PlusCircle,
  User,
  Search,
  Bell,
  LogOut,
  ChevronRight,
  Settings,
  Briefcase,
  MessageCircle,
  Calendar,
  Compass,
  Heart
} from "lucide-react";

// Custom TwoHouses icon component based on the provided image
const TwoHouses: FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Row of houses */}
    <path d="M1 9.5l4-3 4 3V18H1V9.5z" />
    <path d="M9 9.5l4-3 4 3V18H9V9.5z" />
    <path d="M17 9.5l4-3 1.5 1V18h-5.5V9.5z" />
    {/* Windows and doors */}
    <path d="M3 18v-5h2v5" />
    <path d="M11 18v-5h2v5" />
    <path d="M19 18v-5h2v5" />
  </svg>
);

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";


interface ProfileData {
  profile_photo_url?: string | null;
  full_name?: string | null;
}

interface NavItemProps {
  href?: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const NavItem: FC<NavItemProps> = ({ href, icon, label, active, onClick, className }) => {
  const content = (
    <div
      className={cn(
        "relative group flex items-center justify-center w-12 h-12 rounded-full transition-all cursor-pointer",
        active
          ? "text-[#803344] bg-gray-100 scale-105" 
          : "text-[#09261E] hover:text-[#803344] hover:bg-gray-100 hover:scale-105",
        className
      )}
      onClick={onClick}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </div>
  );

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex justify-center">
            {href && !onClick ? (
              <Link href={href}>
                {content}
              </Link>
            ) : (
              content
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          sideOffset={4} 
          align="center" 
          className="font-medium text-sm py-1 px-2"
        >
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const activeRole = user?.activeRole || "visitor";
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  
  // Fetch profile data including profile photo
  const { data: profileData = {} as ProfileData } = useQuery<ProfileData>({
    queryKey: ['/api/profile'],
    enabled: !!user
  });
  
  // Check seller status - cached for session
  const { data: sellerStatus, refetch: refetchSellerStatus } = useQuery({
    queryKey: ['seller-status', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('sellers')
        .select('status, businessName')
        .eq('userId', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching seller status:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to reduce DB queries
  });
  
  // Handle List a Property click with correct authentication flow
  const handleListPropertyClick = async () => {
    // First, check if user is authenticated using supabase.auth.getUser()
    const { data: { user: currentUser }, error } = await supabase.auth.getUser();
    
    if (error || !currentUser) {
      // Not logged in, route to signin
      window.location.href = '/auth/signin';
      return;
    }
    
    // User is logged in, check seller status
    const { data: sellerProfile, error: profileError } = await supabase
      .from('sellers')
      .select('status, businessName')
      .eq('userId', currentUser.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error checking seller status:', profileError);
    }
    
    // Check if seller profile exists and status is 'active'
    if (sellerProfile?.status === 'active') {
      window.location.href = `/sellerdash/${currentUser.id}`;
    } else {
      // Profile missing or status != 'active', open seller application modal
      setIsSellerModalOpen(true);
    }
  };

  // Handle seller application form submission
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [sellerFormData, setSellerFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    username: user?.username || '',
    yearsInRealEstate: '',
    businessName: '',
    businessType: ''
  });
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);

  const handleSellerApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSubmittingApplication(true);
    
    try {
      // Submit seller application to sellers table
      const { error } = await supabase
        .from('sellers')
        .insert({
          userId: user.id,
          fullName: sellerFormData.fullName,
          email: sellerFormData.email,
          phone: sellerFormData.phone,
          businessName: sellerFormData.businessName || null,
          yearsInRealEstate: sellerFormData.yearsInRealEstate,
          businessType: sellerFormData.businessType,
          targetMarkets: [],
          dealTypes: [],
          maxDealVolume: '',
          isDraft: false,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Application submitted!",
        description: "Your seller application has been submitted for review. We'll notify you once it's approved.",
      });

      // Close modal and reset form
      setIsSellerModalOpen(false);
      setCurrentStep(1);
      setSellerFormData({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: '',
        username: user?.username || '',
        yearsInRealEstate: '',
        businessName: '',
        businessType: ''
      });

      // Refresh seller status cache
      refetchSellerStatus();

    } catch (error) {
      console.error('Error submitting seller application:', error);
      toast({
        title: "Error submitting application",
        description: "There was an error submitting your seller application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingApplication(false);
    }
  };
  
  return (
    <div className="fixed inset-y-0 left-0 z-40 flex flex-col bg-white/70 backdrop-blur-md shadow-inner border-r">
      {/* Logo at top - Using pdLogo.png image */}
      <div className="flex items-center justify-center h-16 mb-0">
        <Link href="/properties">
          <div className="flex items-center justify-center hover:scale-110 transition-all">
            <img src="/images/pdLogo.png" alt="PropertyDeals" className="h-10 w-auto" />
          </div>
        </Link>
      </div>
      
      {/* Main Navigation (Centered in the middle of sidebar) */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="space-y-6 flex flex-col items-center">
          {/* Home/Properties icon */}
          <NavItem 
            href="/properties" 
            icon={<Home size={24} />} 
            label="Properties"
            active={location.startsWith('/properties')} 
          />
          
          {/* Favorites icon */}
          <NavItem 
            href="/favorites" 
            icon={<Heart size={24} />} 
            label="Favorites"
            active={location.startsWith('/favorites')} 
          />
          
          {/* List a Property icon - Smart routing with seller status check */}
          <NavItem 
            icon={<PlusCircle size={24} />} 
            label="List a Property"
            active={location.startsWith('/sellerdash')}
            onClick={handleListPropertyClick}
          />
          
          {/* Profile icon - with profile photo and hover animation */}
          <NavItem 
            href={user?.username ? `/profile/${user.username}` : "/profile"} 
            icon={
              <Avatar className="h-8 w-8 transition-all transform group-hover:scale-110 duration-200">
                <AvatarImage 
                  src={profileData?.profile_photo_url || ""} 
                  alt={(profileData?.full_name || user?.fullName || "User") as string} 
                />
                <AvatarFallback className="bg-white p-0">
                  <User size={20} />
                </AvatarFallback>
              </Avatar>
            } 
            label="Profile"
            active={location.startsWith('/profile')} 
          />
        </div>
      </div>
      
      {/* Search button fixed to bottom with proper spacing */}
      <div className="p-4 pb-20 flex flex-col items-center justify-center">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-12 h-12 rounded-full text-[#09261E] hover:text-[#803344] hover:bg-gray-100 transition-all"
                onClick={() => {
                  // Dispatch the keyboard shortcut event to trigger global search
                  const event = new KeyboardEvent('keydown', {
                    key: 'k',
                    metaKey: true,
                    bubbles: true
                  });
                  document.dispatchEvent(event);
                }}
              >
                <Search size={24} />
                <span className="sr-only">Search (⌘K)</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={4} align="center" className="font-medium text-sm py-1 px-2 flex items-center">
              <span>Search</span>
              <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 px-1.5 font-mono text-[10px] font-medium">
                ⌘K
              </kbd>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Seller Application Modal */}
      <Dialog open={isSellerModalOpen} onOpenChange={setIsSellerModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-900">Seller Application</DialogTitle>
            <p className="text-sm text-gray-600 mt-1">Complete this application to become a verified PropertyDeals seller.</p>
          </DialogHeader>
          
          {/* Progress Bar */}
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step 1 of 4</span>
              <span className="text-sm text-gray-500">25% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#09261E] h-2 rounded-full transition-all duration-300" style={{ width: '25%' }}></div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b">
            <button 
              type="button"
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                currentStep === 1 ? 'border-[#09261E] text-[#09261E]' : 'border-transparent text-gray-500'
              }`}
            >
              Basic Info
            </button>
            <button 
              type="button"
              className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-400 cursor-not-allowed"
            >
              Activity
            </button>
            <button 
              type="button"
              className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-400 cursor-not-allowed"
            >
              Trust
            </button>
            <button 
              type="button"
              className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-400 cursor-not-allowed"
            >
              Review
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSellerApplicationSubmit} className="space-y-6 py-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Basic Information</h3>
              <p className="text-sm text-gray-600 mb-4">Tell us about yourself and your business</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    value={sellerFormData.fullName}
                    onChange={(e) => setSellerFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                    Username *
                  </Label>
                  <Input
                    id="username"
                    value={sellerFormData.username}
                    onChange={(e) => setSellerFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={sellerFormData.email}
                    onChange={(e) => setSellerFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(123) 456-7890"
                    value={sellerFormData.phone}
                    onChange={(e) => setSellerFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="yearsInRealEstate" className="text-sm font-medium text-gray-700">
                    In Real Estate Since *
                  </Label>
                  <Input
                    id="yearsInRealEstate"
                    placeholder="2020"
                    value={sellerFormData.yearsInRealEstate}
                    onChange={(e) => setSellerFormData(prev => ({ ...prev, yearsInRealEstate: e.target.value }))}
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                    Business Name <span className="text-gray-400">(Optional)</span>
                  </Label>
                  <Input
                    id="businessName"
                    placeholder="Your business or company name"
                    value={sellerFormData.businessName}
                    onChange={(e) => setSellerFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsSellerModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="button"
                variant="outline"
                className="px-6"
                disabled
              >
                Save & Finish Later
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmittingApplication}
                className="bg-[#09261E] hover:bg-[#09261E]/90 px-8"
              >
                {isSubmittingApplication ? "Submitting..." : "Continue"}
              </Button>
            </div>
          </form>

          <div className="border-t pt-4 text-center">
            <p className="text-sm text-gray-500">
              Already a seller? <button className="text-[#09261E] font-medium hover:underline">Log in to your dashboard here</button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}