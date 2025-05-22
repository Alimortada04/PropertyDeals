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
  
  // Check seller status
  const { data: sellerStatus } = useQuery({
    queryKey: ['seller-status', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('seller_profiles')
        .select('status, user_type')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching seller status:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id
  });
  
  // Handle List a Property click with smart routing
  const handleListPropertyClick = async () => {
    // Check if user is logged in
    if (!user?.id) {
      window.location.href = '/auth/signin';
      return;
    }
    
    // Check if user is an approved seller
    if (sellerStatus?.status === 'approved' || sellerStatus?.user_type === 'seller') {
      window.location.href = `/sellerdash/${user.id}`;
    } else {
      // Open seller application modal
      setIsSellerModalOpen(true);
    }
  };

  // Handle seller application form submission
  const { toast } = useToast();
  const [sellerFormData, setSellerFormData] = useState({
    business_name: '',
    experience_years: '',
    specialization: '',
    bio: '',
    website: '',
    phone: ''
  });
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);

  const handleSellerApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSubmittingApplication(true);
    
    try {
      // Submit seller application to seller_profiles table
      const { error } = await supabase
        .from('seller_profiles')
        .insert({
          user_id: user.id,
          business_name: sellerFormData.business_name,
          experience_years: parseInt(sellerFormData.experience_years) || 0,
          specialization: sellerFormData.specialization,
          bio: sellerFormData.bio,
          website: sellerFormData.website,
          phone: sellerFormData.phone,
          status: 'pending',
          user_type: 'seller_pending'
        });

      if (error) throw error;

      toast({
        title: "Application submitted!",
        description: "Your seller application has been submitted for review. We'll notify you once it's approved.",
      });

      // Close modal and reset form
      setIsSellerModalOpen(false);
      setSellerFormData({
        business_name: '',
        experience_years: '',
        specialization: '',
        bio: '',
        website: '',
        phone: ''
      });

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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apply to Become a Seller</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSellerApplicationSubmit} className="space-y-4">
            <div>
              <Label htmlFor="business_name">Business Name *</Label>
              <Input
                id="business_name"
                value={sellerFormData.business_name}
                onChange={(e) => setSellerFormData(prev => ({ ...prev, business_name: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="experience_years">Years of Experience *</Label>
              <Input
                id="experience_years"
                type="number"
                value={sellerFormData.experience_years}
                onChange={(e) => setSellerFormData(prev => ({ ...prev, experience_years: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="specialization">Specialization *</Label>
              <Input
                id="specialization"
                placeholder="e.g., Residential, Commercial, Land Development"
                value={sellerFormData.specialization}
                onChange={(e) => setSellerFormData(prev => ({ ...prev, specialization: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={sellerFormData.phone}
                onChange={(e) => setSellerFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourwebsite.com"
                value={sellerFormData.website}
                onChange={(e) => setSellerFormData(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your experience and what makes you a great seller..."
                value={sellerFormData.bio}
                onChange={(e) => setSellerFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsSellerModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmittingApplication}
                className="flex-1"
              >
                {isSubmittingApplication ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}