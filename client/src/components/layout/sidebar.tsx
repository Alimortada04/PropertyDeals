import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  Home, Building, Users, LayoutDashboard, Book, 
  Calculator, MessageCircle, UserCircle, Settings, ChevronRight 
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export default function Sidebar({ isOpen, closeSidebar, isExpanded, setIsExpanded }: SidebarProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Close sidebar on route change on mobile
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && isOpen) {
      closeSidebar();
    }
  }, [location, isOpen, closeSidebar]);

  // Handle window resize
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      if (window.innerWidth >= 1024 && !isOpen) {
        // Ensure sidebar is open on desktop
        document.getElementById('sidebar')?.classList.remove('-translate-x-full');
        document.getElementById('sidebar')?.classList.add('translate-x-0');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Handle clicks outside the sidebar to collapse it (desktop only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (
        window.innerWidth >= 1024 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isExpanded
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, setIsExpanded]);

  // Dynamic classes for the hover-expandable sidebar (desktop only)
  const sidebarClasses = `
    bg-white shadow-md fixed lg:sticky top-0 h-screen overflow-y-auto z-40 transition-all duration-300
    ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0'}
    ${isExpanded ? 'lg:w-64' : 'lg:w-16 hover:lg:w-64'}
  `;

  // Nav item classes (conditionally show text)
  const getNavItemClasses = (path: string) => {
    const isActive = location === path;
    return `
      group flex items-center p-2 rounded-md whitespace-nowrap transition-colors duration-200
      ${isActive 
        ? 'bg-[#09261E] text-white' 
        : 'text-[#135341] hover:bg-[#09261E] hover:text-white'}
    `;
  };

  return (
    <aside 
      id="sidebar" 
      ref={sidebarRef}
      className={sidebarClasses}
      onMouseEnter={() => window.innerWidth >= 1024 && setIsExpanded(true)}
      onMouseLeave={() => window.innerWidth >= 1024 && setIsExpanded(false)}
    >
      <nav className="flex flex-col h-full p-4">
        {/* Logo */}
        <div className="mb-8 mt-2">
          <Link href="/" className="flex items-center">
            <img 
              src="/images/pdLogoalt.png" 
              alt="PropertyDeals Logo" 
              className="h-8 w-auto"
            />
            <span className={`ml-2 font-heading font-bold text-[#09261E] text-lg transition-opacity duration-300 ${!isExpanded ? 'lg:opacity-0 lg:w-0 lg:hidden' : ''}`}>
              PropertyDeals
            </span>
          </Link>
          
          {/* Expansion hint for accessibility */}
          <div className={`absolute right-2 top-4 ${isExpanded ? 'opacity-0' : 'opacity-50 lg:opacity-100'} transition-opacity`}>
            <ChevronRight size={16} className="text-[#135341] animate-pulse" />
          </div>
        </div>

        {/* Main Navigation */}
        <div className="mb-6">
          <h3 className={`text-xs uppercase text-gray-500 font-medium tracking-wider mb-3 transition-opacity duration-300 ${!isExpanded && 'lg:opacity-0'}`}>
            Navigation
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className={getNavItemClasses("/")}>
                <Home className="w-5 h-5 flex-shrink-0" />
                <span className={`ml-3 transition-all duration-300 ${!isExpanded && 'lg:opacity-0 lg:w-0 lg:hidden group-hover:lg:opacity-100 group-hover:lg:inline-block'}`}>
                  Home
                </span>
              </Link>
            </li>
            <li>
              <Link href="/properties" className={getNavItemClasses("/properties")}>
                <Building className="w-5 h-5 flex-shrink-0" />
                <span className={`ml-3 transition-all duration-300 ${!isExpanded && 'lg:opacity-0 lg:w-0 lg:hidden group-hover:lg:opacity-100 group-hover:lg:inline-block'}`}>
                  Properties
                </span>
              </Link>
            </li>
            <li>
              <Link href="/reps" className={getNavItemClasses("/reps")}>
                <Users className="w-5 h-5 flex-shrink-0" />
                <span className={`ml-3 transition-all duration-300 ${!isExpanded && 'lg:opacity-0 lg:w-0 lg:hidden group-hover:lg:opacity-100 group-hover:lg:inline-block'}`}>
                  REPs
                </span>
              </Link>
            </li>
            <li>
              <Link href="/connect" className={getNavItemClasses("/connect")}>
                <MessageCircle className="w-5 h-5 flex-shrink-0" />
                <span className={`ml-3 transition-all duration-300 ${!isExpanded && 'lg:opacity-0 lg:w-0 lg:hidden group-hover:lg:opacity-100 group-hover:lg:inline-block'}`}>
                  Connect
                </span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className={getNavItemClasses("/dashboard")}>
                <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                <span className={`ml-3 transition-all duration-300 ${!isExpanded && 'lg:opacity-0 lg:w-0 lg:hidden group-hover:lg:opacity-100 group-hover:lg:inline-block'}`}>
                  Dashboard
                </span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources Section */}
        <div className="mb-6">
          <h3 className={`text-xs uppercase text-gray-500 font-medium tracking-wider mb-3 transition-opacity duration-300 ${!isExpanded && 'lg:opacity-0'}`}>
            Resources
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/guides" className={getNavItemClasses("/guides")}>
                <Book className="w-5 h-5 flex-shrink-0" />
                <span className={`ml-3 transition-all duration-300 ${!isExpanded && 'lg:opacity-0 lg:w-0 lg:hidden group-hover:lg:opacity-100 group-hover:lg:inline-block'}`}>
                  Guides
                </span>
              </Link>
            </li>
            <li>
              <Link href="/tools" className={getNavItemClasses("/tools")}>
                <Calculator className="w-5 h-5 flex-shrink-0" />
                <span className={`ml-3 transition-all duration-300 ${!isExpanded && 'lg:opacity-0 lg:w-0 lg:hidden group-hover:lg:opacity-100 group-hover:lg:inline-block'}`}>
                  Tools
                </span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Spacer to push profile section to bottom */}
        <div className="flex-grow"></div>
        
        {/* Profile & Settings */}
        <div className="mb-2 pt-6 border-t border-gray-200">
          <h3 className={`text-xs uppercase text-gray-500 font-medium tracking-wider mb-3 transition-opacity duration-300 ${!isExpanded && 'lg:opacity-0'}`}>
            Account
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/profile" className={getNavItemClasses("/profile")}>
                <UserCircle className="w-5 h-5 flex-shrink-0" />
                <span className={`ml-3 transition-all duration-300 ${!isExpanded && 'lg:opacity-0 lg:w-0 lg:hidden group-hover:lg:opacity-100 group-hover:lg:inline-block'}`}>
                  Profile
                </span>
              </Link>
            </li>
            <li>
              <Link href="/settings" className={getNavItemClasses("/settings")}>
                <Settings className="w-5 h-5 flex-shrink-0" />
                <span className={`ml-3 transition-all duration-300 ${!isExpanded && 'lg:opacity-0 lg:w-0 lg:hidden group-hover:lg:opacity-100 group-hover:lg:inline-block'}`}>
                  Settings
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
