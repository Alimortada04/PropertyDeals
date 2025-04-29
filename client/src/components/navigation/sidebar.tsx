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
  Briefcase
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href}>
            <a
              className={cn(
                "relative group flex items-center justify-center w-12 h-12 rounded-full transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-100",
                className
              )}
              onClick={onClick}
            >
              {icon}
              <span className="sr-only">{label}</span>
            </a>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8} className="font-medium">
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
          <a className="flex items-center justify-center w-12 h-12 rounded-full text-primary hover:bg-primary/10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M9 22V12H15V22" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </a>
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
            href="/professionals" 
            icon={<Users size={20} />} 
            label="Professionals"
            active={location.startsWith('/professionals')} 
          />
          
          <NavItem 
            href="/messages" 
            icon={<MessageSquare size={20} />} 
            label="Messages"
            active={location.startsWith('/messages')} 
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
              className="mt-2 bg-slate-100"
            />
          )}
        </div>
      </ScrollArea>
      
      {/* Bottom Navigation (Fixed) */}
      <div className="p-2 flex flex-col items-center space-y-2 border-t">
        {/* Settings */}
        <NavItem 
          href="/settings" 
          icon={<Settings size={20} />} 
          label="Settings"
          active={location.startsWith('/settings')} 
        />
        
        {/* Search Trigger */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-12 h-12 rounded-full text-gray-500 hover:bg-gray-100"
                onClick={() => setShowSearch(true)}
              >
                <Search size={20} />
                <span className="sr-only">Search (⌘K)</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8} className="font-medium flex items-center">
              <span>Search</span>
              <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 px-1.5 font-mono text-[10px] font-medium">
                ⌘K
              </kbd>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Notifications */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-12 h-12 rounded-full text-gray-500 hover:bg-gray-100 relative"
              >
                <Bell size={20} />
                {/* Notification indicator */}
                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="sr-only">Notifications</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8} className="font-medium">
              Notifications
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* User Profile */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/profile">
                <a className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.profileImage || ""} alt={user?.fullName || "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </a>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8} className="font-medium">
              Your Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Logout */}
        {user && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-12 h-12 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut size={20} />
                  <span className="sr-only">Logout</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8} className="font-medium">
                Logout
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {/* Command K Search Dialog (Placeholder) */}
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
                placeholder="Search everything..." 
                autoFocus
              />
              <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 px-1.5 font-mono text-[10px] font-medium">
                ESC
              </kbd>
            </div>
            <div className="p-4 h-64 overflow-auto">
              <p className="text-gray-500 text-center py-8">
                Start typing to search properties, professionals, resources...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}