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
      {/* Logo at top - Just "pd" text */}
      <div className="flex items-center justify-center h-16">
        <Link href="/">
          <div className="flex items-center justify-center w-12 h-12 rounded-full text-[#09261E] hover:text-[#803344] hover:scale-110 transition-all">
            <span className="font-bold text-xl">pd</span>
          </div>
        </Link>
      </div>
      
      {/* Main Navigation (Scrollable) */}
      <ScrollArea className="flex-1 pb-12">
        <div className="space-y-2 flex flex-col items-center">
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
      <div className="p-2 pb-16 flex flex-col items-center space-y-2 border-t">
        {/* Search Trigger - with consistent light grey hover circle */}
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-12 h-12 rounded-full text-[#09261E] hover:text-[#803344] hover:bg-gray-100 transition-all"
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

        {/* Profile icon - moved to sidebar from bottom dock with consistent hover style */}
        <NavItem 
          href="/profile" 
          icon={
            <Avatar className="h-6 w-6">
              <AvatarImage src={user?.profileImage || ""} alt={user?.fullName || "User"} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          } 
          label="Profile"
          active={location.startsWith('/profile')} 
        />
        

      </div>
      
      {/* Bottom Dock Bar - White Background with Menu Selector on Left */}
      <div className="fixed bottom-0 left-0 w-full h-12 bg-white border-t flex items-center z-50 shadow-sm">
        <div className="w-full px-4 flex items-center justify-between">
          <div>
            {/* Menu selector on far left (as shown in screenshot) */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-700 flex items-center h-8 px-3 rounded-md"
            >
              <Menu className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Menu</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
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
      </div>
      
      {/* Command K Search Dialog - Full Viewport */}
      {showSearch && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-0 overflow-hidden"
          onClick={() => setShowSearch(false)}
        >
          <div className="w-full h-full flex flex-col items-center">
            <div className="w-full max-w-3xl px-6 pt-[15vh] pb-8" onClick={(e) => e.stopPropagation()}>
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex items-center">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input 
                      type="text" 
                      className="flex-1 outline-none text-xl bg-transparent"
                      placeholder="Where would you like to go?" 
                      autoFocus
                    />
                    <kbd className="ml-2 pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-slate-100 px-2 font-mono text-[12px] font-medium">
                      ESC
                    </kbd>
                  </div>
                </div>
                
                <div className="p-1 max-h-[60vh] overflow-y-auto">
                  <div className="p-2">
                    <h3 className="text-sm font-semibold text-gray-500 px-3 py-2 uppercase tracking-wide">Navigation</h3>
                    <div className="space-y-1">
                      <Link href="/" onClick={() => setShowSearch(false)}>
                        <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
                          <Home className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="font-medium">Home</p>
                            <p className="text-xs text-gray-500">Back to the main page</p>
                          </div>
                        </div>
                      </Link>
                      <Link href="/properties" onClick={() => setShowSearch(false)}>
                        <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
                          <Building className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="font-medium">Properties</p>
                            <p className="text-xs text-gray-500">Browse available properties</p>
                          </div>
                          <span className="ml-auto text-xs text-gray-400">⌘1</span>
                        </div>
                      </Link>
                      <Link href="/reps" onClick={() => setShowSearch(false)}>
                        <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
                          <Users className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="font-medium">REPs</p>
                            <p className="text-xs text-gray-500">Find real estate professionals</p>
                          </div>
                          <span className="ml-auto text-xs text-gray-400">⌘2</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <h3 className="text-sm font-semibold text-gray-500 px-3 py-2 uppercase tracking-wide">Resources</h3>
                    <div className="space-y-1">
                      <Link href="/playbook" onClick={() => setShowSearch(false)}>
                        <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
                          <Book className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="font-medium">Playbook</p>
                            <p className="text-xs text-gray-500">Educational resources and guides</p>
                          </div>
                          <span className="ml-auto text-xs text-gray-400">⌘3</span>
                        </div>
                      </Link>
                      <Link href="/inbox" onClick={() => setShowSearch(false)}>
                        <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
                          <Inbox className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="font-medium">Inbox</p>
                            <p className="text-xs text-gray-500">Messages and notifications</p>
                          </div>
                          <span className="ml-auto text-xs text-gray-400">⌘4</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}