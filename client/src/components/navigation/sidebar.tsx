import React, { useState, FC } from "react";
import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
// Import removed - will use inline image
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
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
  Compass
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


interface ProfileData {
  profile_photo_url?: string | null;
  full_name?: string | null;
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const NavItem: FC<NavItemProps> = ({ href, icon, label, active, onClick, className }) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex justify-center">
            <Link href={href}>
              <div
                className={cn(
                  "relative group flex items-center justify-center w-12 h-12 rounded-full transition-all",
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
            </Link>
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
  
  // Fetch profile data including profile photo
  const { data: profileData = {} as ProfileData } = useQuery<ProfileData>({
    queryKey: ['/api/profile'],
    enabled: !!user
  });
  
  // Menu popup state
  const [showMenu, setShowMenu] = useState(false);
  // We don't need any search state here as we're using the app-wide search
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="fixed inset-y-0 left-0 z-40 flex flex-col bg-white/70 backdrop-blur-md shadow-inner border-r">
      {/* Logo at top - Using pdLogo.png image */}
      <div className="flex items-center justify-center h-16 mb-0">
        <Link href="/dashboard">
          <div className="flex items-center justify-center hover:scale-110 transition-all">
            <img src="/images/pdLogo.png" alt="PropertyDeals" className="h-10 w-auto" />
          </div>
        </Link>
      </div>
      
      {/* Main Navigation (Scrollable) */}
      <ScrollArea className="flex-1 pb-12">
        <div className="space-y-2 flex flex-col items-center pt-2 mt-0">
          <NavItem 
            href="/" 
            icon={<Home size={24} />} 
            label="Home"
            active={location === '/'} 
          />
          
          <NavItem 
            href="/properties" 
            icon={
              <div className="w-6 h-6 flex items-center justify-center">
                <img 
                  src="/images/real-estate-new.png"
                  alt="Properties" 
                  className="w-5 h-5 object-contain" 
                />
              </div>
            } 
            label="Properties"
            active={location.startsWith('/properties')} 
          />
          
          <NavItem 
            href="/reps" 
            icon={<Users size={24} />} 
            label="Professionals"
            active={location.startsWith('/reps')} 
          />
          
          <NavItem 
            href="/inbox" 
            icon={<MessageCircle size={24} />} 
            label="Messages"
            active={location.startsWith('/inbox')} 
          />
          
          <NavItem 
            href="/community" 
            icon={<Calendar size={24} />} 
            label="Community"
            active={location.startsWith('/community')} 
          />
          
          <NavItem 
            href="/playbook" 
            icon={<Book size={24} />} 
            label="Playbook"
            active={location.startsWith('/playbook')} 
          />
          
          <NavItem 
            href="/list-property" 
            icon={<PlusCircle size={24} />} 
            label="List a Property"
            active={location.startsWith('/list-property')} 
          />
          
          {activeRole === 'seller' && (
            <NavItem 
              href="/seller/dashboard" 
              icon={<Briefcase size={24} />} 
              label="Seller Dashboard"
              active={location.startsWith('/seller/dashboard')} 
            />
          )}
          
          {activeRole === 'agent' && (
            <NavItem 
              href="/agent/dashboard" 
              icon={<Briefcase size={24} />} 
              label="Agent Dashboard"
              active={location.startsWith('/agent/dashboard')} 
            />
          )}
          
          {activeRole === 'contractor' && (
            <NavItem 
              href="/contractor/dashboard" 
              icon={<Briefcase size={24} />} 
              label="Contractor Dashboard"
              active={location.startsWith('/contractor/dashboard')} 
            />
          )}
          
          {user?.isAdmin && (
            <NavItem 
              href="/admin/dashboard" 
              icon={<Briefcase size={24} />} 
              label="Admin Dashboard"
              active={location.startsWith('/admin')} 
              className="mt-2"
            />
          )}
        </div>
      </ScrollArea>
      
      {/* Bottom Navigation (Fixed) - No border, centered icons */}
      <div className="p-2 pb-16 flex flex-col items-center justify-center space-y-2">
        {/* Search button - Uses app-wide keyboard shortcut */}
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
        
        {/* Profile icon - with profile photo and hover animation */}
        <NavItem 
          href="/profile" 
          icon={
            <Avatar className="h-8 w-8 transition-all transform group-hover:scale-110 duration-200">
              <AvatarImage 
                src={profileData?.profile_photo_url || ""} 
                alt={(profileData?.full_name || user?.fullName || "User") as string} 
              />
              <AvatarFallback className="bg-white p-0">
                <img src="/images/pdLogo.png" alt="PropertyDeals Logo" className="w-full h-full object-contain" />
              </AvatarFallback>
            </Avatar>
          } 
          label="Profile"
          active={location.startsWith('/profile')} 
        />
      </div>
      
      {/* Bottom bar removed from here - now in app-layout.tsx */}
    </div>
  );
}