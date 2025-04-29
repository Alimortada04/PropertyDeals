import React, { useState, FC } from "react";
import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  Home,
  Building,
  Users,
  MessageSquare,
  Book,
  PlusCircle,
  User,
  Settings,
  Search,
  Bell,
  LogOut,
  ChevronRight,
  Menu,
  Briefcase,
  Inbox,
  MessagesSquare
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
                    ? "text-[#803344] scale-110" 
                    : "text-[#09261E] hover:text-[#803344] hover:scale-110",
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
  
  // Command K search handler
  const [showSearch, setShowSearch] = useState(false);
  
  const handleKeyDown = (e: KeyboardEvent) => {
    // Check for Command+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setShowSearch(!showSearch);
    }
  };
  
  // Add event listener for Command+K
  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="fixed inset-y-0 left-0 z-40 flex flex-col bg-white/70 backdrop-blur-md shadow-sm border-r">
      {/* Logo at top */}
      <div className="flex items-center justify-center h-16 pt-4">
        <Link href="/">
          <div className="flex items-center justify-center w-12 h-12 rounded-full text-[#09261E] hover:text-[#803344] hover:scale-110 transition-all">
            <img src="/assets/pdLogoTransparent.png" alt="PropertyDeals" className="w-8 h-8" />
          </div>
        </Link>
      </div>
      
      {/* Main Navigation (Scrollable) */}
      <ScrollArea className="flex-1 py-4">
        <div className="space-y-2 px-2 flex flex-col items-center">
          <NavItem 
            href="/" 
            icon={<Home size={20} />} 
            label="Home"
            active={location === '/'} 
          />
          
          <NavItem 
            href="/properties" 
            icon={<Building size={20} />} 
            label="Properties"
            active={location.startsWith('/properties')} 
          />
          
          <NavItem 
            href="/reps" 
            icon={<Users size={20} />} 
            label="Professionals"
            active={location.startsWith('/reps')} 
          />
          
          <NavItem 
            href="/inbox" 
            icon={<Inbox size={20} />} 
            label="Inbox"
            active={location.startsWith('/inbox')} 
          />
          
          <NavItem 
            href="/playbook" 
            icon={<Book size={20} />} 
            label="Playbook"
            active={location.startsWith('/playbook')} 
          />
          
          <NavItem 
            href="/list-property" 
            icon={<PlusCircle size={20} />} 
            label="List a Property"
            active={location.startsWith('/list-property')} 
          />
          
          {activeRole === 'seller' && (
            <NavItem 
              href="/seller/dashboard" 
              icon={<Briefcase size={20} />} 
              label="Seller Dashboard"
              active={location.startsWith('/seller/dashboard')} 
            />
          )}
          
          {activeRole === 'agent' && (
            <NavItem 
              href="/agent/dashboard" 
              icon={<Briefcase size={20} />} 
              label="Agent Dashboard"
              active={location.startsWith('/agent/dashboard')} 
            />
          )}
          
          {activeRole === 'contractor' && (
            <NavItem 
              href="/contractor/dashboard" 
              icon={<Briefcase size={20} />} 
              label="Contractor Dashboard"
              active={location.startsWith('/contractor/dashboard')} 
            />
          )}
          
          {user?.isAdmin && (
            <NavItem 
              href="/admin/dashboard" 
              icon={<Briefcase size={20} />} 
              label="Admin Dashboard"
              active={location.startsWith('/admin')} 
              className="mt-2"
            />
          )}
        </div>
      </ScrollArea>
      
      {/* Bottom Navigation (Fixed) */}
      <div className="p-2 flex flex-col items-center space-y-2 border-t">
        {/* Search Trigger */}
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-12 h-12 rounded-full text-[#09261E] hover:text-[#803344] hover:scale-110 transition-all"
                onClick={() => setShowSearch(true)}
              >
                <Search size={20} />
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
        
        {/* Settings */}
        <NavItem 
          href="/settings" 
          icon={<Settings size={20} />} 
          label="Settings"
          active={location.startsWith('/settings')} 
        />
        
        {/* User Profile */}
        <NavItem 
          href="/profile" 
          icon={
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profileImage || ""} alt={user?.fullName || "User"} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          } 
          label="Your Profile"
          active={location.startsWith('/profile')} 
        />
      </div>
      
      {/* Bottom Dock Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-white border-t flex items-center justify-between px-4 z-30 shadow-sm">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full" 
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-4 w-4 text-[#09261E]" />
          </Button>
          <span className="text-xs text-gray-500 hidden sm:inline-block ml-1">⌘K</span>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Notification Button */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full"
            >
              <Bell className="h-4 w-4 text-[#09261E]" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
            </Button>
          </div>
          
          {/* Chat Button */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full"
            >
              <MessagesSquare className="h-4 w-4 text-[#09261E]" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500"></span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Command K Search Dialog */}
      {showSearch && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSearch(false)}
        >
          <div 
            className="bg-white rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center border-b p-4">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input 
                type="text" 
                className="flex-1 outline-none text-lg"
                placeholder="Where would you like to go?" 
                autoFocus
              />
              <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 px-1.5 font-mono text-[10px] font-medium">
                ESC
              </kbd>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Quick Links</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Link href="/properties">
                    <div className="flex items-center p-2 rounded hover:bg-gray-100">
                      <Building className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium">Properties</p>
                        <p className="text-xs text-gray-500">Browse available properties</p>
                      </div>
                      <span className="ml-auto text-xs text-gray-400">⌘1</span>
                    </div>
                  </Link>
                  <Link href="/reps">
                    <div className="flex items-center p-2 rounded hover:bg-gray-100">
                      <Users className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium">REPs</p>
                        <p className="text-xs text-gray-500">Find real estate professionals</p>
                      </div>
                      <span className="ml-auto text-xs text-gray-400">⌘2</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}