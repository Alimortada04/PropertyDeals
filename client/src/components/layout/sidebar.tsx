import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  Home, Building, Users, LayoutDashboard, Book, 
  Calculator, MessageCircle, UserCircle, Settings, ChevronRight, HelpCircle,
  Menu, X, ListPlus
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, closeSidebar, isExpanded, setIsExpanded, toggleSidebar }: SidebarProps) {
  const { user, supabaseUser } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const [showExpandIndicator, setShowExpandIndicator] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sellerStatus, setSellerStatus] = useState<string>('none');
  
  // Helper function to clean up overflow and re-enable scrolling
  const cleanupScrollLock = () => {
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('inset');
    document.body.style.removeProperty('touch-action');
  };
  
  // Check if we're on mobile
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Close sidebar on route change on mobile
  useEffect(() => {
    if (typeof window !== 'undefined' && isMobile && isOpen) {
      closeSidebar();
    }
  }, [location, isOpen, closeSidebar, isMobile]);

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

  // Show expand indicator when mouse is near the edge
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isExpanded && e.clientX < 20 && e.clientY > 60) {
        setShowExpandIndicator(true);
      } else if (!isExpanded && e.clientX > 40) {
        setShowExpandIndicator(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isExpanded]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleOutsideClick = (event: MouseEvent) => {
      if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        closeSidebar();
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [closeSidebar, isOpen, isMobile]);
  
  // Fetch seller status when user changes
  useEffect(() => {
    async function fetchSellerStatus() {
      if (!user || !supabaseUser) {
        setSellerStatus('none');
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('sellers')
          .select('status')
          .eq('id', supabaseUser.id)
          .single();
        
        if (error) {
          console.error('Error fetching seller status:', error);
          setSellerStatus('none');
          return;
        }
        
        if (data) {
          setSellerStatus(data.status);
        } else {
          setSellerStatus('none');
        }
      } catch (error) {
        console.error('Error fetching seller status:', error);
        setSellerStatus('none');
      }
    }
    
    fetchSellerStatus();
  }, [user, supabaseUser]);

  // Nav item classes with immediate color change on hover - full width with no rounded corners
  const getNavItemClasses = (path: string) => {
    const isActive = location === path;
    return `
      group flex items-center ${isExpanded ? 'px-4' : 'px-5'} py-2 mx-0 mt-0 whitespace-nowrap transition-colors duration-0
      ${!isExpanded ? 'justify-center' : ''} 
      ${isActive 
        ? 'bg-[#09261E] text-white' 
        : 'text-gray-700 hover:bg-[#D8D8D8]'}
    `;
  };
  
  // Helper for mobile menu items
  const getMobileNavItemClasses = (path: string) => {
    const isActive = location === path;
    return `flex items-center py-2 rounded-md px-3 ${isActive ? 'bg-[#09261E] text-white hover:bg-[#09261E]' : 'hover:bg-gray-100'}`;
  };
  
  // Helper for icons in mobile menu
  const getMobileIconClasses = (path: string) => {
    const isActive = location === path;
    return `w-5 h-5 mr-2 ${isActive ? 'text-white' : 'text-gray-700'}`;
  };

  return (
    <>
      {/* Mobile top navbar with hamburger menu */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm h-16 lg:hidden flex items-center justify-between px-4">
        <div className="flex items-center">
          <button 
            ref={hamburgerRef}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Hamburger clicked");
              
              // Show mobile menu and overlay
              const mobileMenu = document.getElementById('mobile-menu');
              const overlay = document.getElementById('mobile-menu-overlay');
              
              if (mobileMenu) {
                mobileMenu.classList.remove('-translate-x-full');
                mobileMenu.classList.remove('hidden');
              }
              
              if (overlay) {
                overlay.classList.remove('hidden');
              }
              
              // Don't disable scrolling entirely - let the overlay handle touch events
              // This approach allows scrolling the menu content while preventing background scrolling
            }}
            className="mr-4 p-2 hover:bg-gray-100 rounded-md touch-manipulation cursor-pointer"
            aria-label="Toggle menu"
            type="button"
            style={{ touchAction: 'manipulation' }}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <Link href="/" className="flex items-center">
            <img 
              src="/images/pdLogo.png" 
              alt="PropertyDeals Logo" 
              className="h-11 w-auto"
            />
          </Link>
        </div>
        
        {/* Auth buttons */}
        <div className="flex items-center gap-1">
          <Link href="/auth">
            <button className="px-3 py-1 text-base rounded border border-gray-300 hover:bg-[#135341] hover:text-white transition-colors duration-200">
              Sign In
            </button>
          </Link>
          <Link href="/auth">
            <button className="px-3 py-1 text-base rounded bg-[#09261E] text-white hover:bg-[#803344] transition-colors duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]">
              Register
            </button>
          </Link>
        </div>
      </div>
      
      {/* Mobile Menu that slides in from left */}
      <div 
        id="mobile-menu" 
        className="fixed top-0 left-0 bottom-0 w-[250px] bg-white z-[200] lg:hidden hidden shadow-lg transition-transform duration-300 ease-in-out -translate-x-full overscroll-contain"
      >
        <div className="h-full overflow-y-auto">
          <div className="flex items-center px-4 py-3 border-b">
            <button 
              onClick={() => {
                const mobileMenu = document.getElementById('mobile-menu');
                const overlay = document.getElementById('mobile-menu-overlay');
                if (mobileMenu) mobileMenu.classList.add('-translate-x-full');
                if (overlay) overlay.classList.add('hidden');
                
                // Ensure body scrolling is re-enabled
                cleanupScrollLock();
              }}
              className="hover:bg-gray-100 rounded-full mr-3 flex items-center justify-center"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold text-[#09261E] flex items-center leading-none">Menu</h2>
          </div>
          
          <nav className="px-4 py-4">
            <h3 className="text-sm uppercase text-gray-500 font-medium tracking-wider mb-3">Navigation</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/" 
                  className={getMobileNavItemClasses("/")}
                  onClick={() => {
                    const mobileMenu = document.getElementById('mobile-menu');
                    const overlay = document.getElementById('mobile-menu-overlay');
                    if (mobileMenu) mobileMenu.classList.add('-translate-x-full');
                    if (overlay) overlay.classList.add('hidden');
                    cleanupScrollLock();
                  }}
                >
                  <Home className={getMobileIconClasses("/")} />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/properties" 
                  className={getMobileNavItemClasses("/properties")}
                  onClick={() => {
                    const mobileMenu = document.getElementById('mobile-menu');
                    const overlay = document.getElementById('mobile-menu-overlay');
                    if (mobileMenu) mobileMenu.classList.add('-translate-x-full');
                    if (overlay) overlay.classList.add('hidden');
                  }}
                >
                  <Building className={getMobileIconClasses("/properties")} />
                  <span>Properties</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/reps" 
                  className={getMobileNavItemClasses("/reps")}
                  onClick={() => {
                    const mobileMenu = document.getElementById('mobile-menu');
                    const overlay = document.getElementById('mobile-menu-overlay');
                    if (mobileMenu) mobileMenu.classList.add('-translate-x-full');
                    if (overlay) overlay.classList.add('hidden');
                  }}
                >
                  <Users className={getMobileIconClasses("/reps")} />
                  <span>The REP Room</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/discussions" 
                  className={getMobileNavItemClasses("/discussions")}
                  onClick={() => {
                    const mobileMenu = document.getElementById('mobile-menu');
                    const overlay = document.getElementById('mobile-menu-overlay');
                    if (mobileMenu) mobileMenu.classList.add('-translate-x-full');
                    if (overlay) overlay.classList.add('hidden');
                  }}
                >
                  <MessageCircle className={getMobileIconClasses("/discussions")} />
                  <span>Discussions</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard" 
                  className={getMobileNavItemClasses("/dashboard")}
                  onClick={() => {
                    const mobileMenu = document.getElementById('mobile-menu');
                    const overlay = document.getElementById('mobile-menu-overlay');
                    if (mobileMenu) mobileMenu.classList.add('-translate-x-full');
                    if (overlay) overlay.classList.add('hidden');
                  }}
                >
                  <LayoutDashboard className={getMobileIconClasses("/dashboard")} />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                {/* Dynamic link for List a Property - mobile */}
                <Link 
                  href={user && user.activeRole === 'seller' && sellerStatus === 'active' 
                    ? `/sellerdash/${user.id}` 
                    : '/sellerdash'
                  }
                  className={getMobileNavItemClasses("/sellerdash")}
                  onClick={() => {
                    const mobileMenu = document.getElementById('mobile-menu');
                    const overlay = document.getElementById('mobile-menu-overlay');
                    if (mobileMenu) mobileMenu.classList.add('-translate-x-full');
                    if (overlay) overlay.classList.add('hidden');
                  }}
                >
                  <ListPlus className={getMobileIconClasses("/sellerdash")} />
                  <span>List a Property</span>
                </Link>
              </li>
            </ul>
            
            <h3 className="text-sm uppercase text-gray-500 font-medium tracking-wider mb-3 mt-8">Resources</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/playbook" 
                  className={getMobileNavItemClasses("/playbook")}
                  onClick={() => {
                    const mobileMenu = document.getElementById('mobile-menu');
                    const overlay = document.getElementById('mobile-menu-overlay');
                    if (mobileMenu) mobileMenu.classList.add('-translate-x-full');
                    if (overlay) overlay.classList.add('hidden');
                  }}
                >
                  <Book className={getMobileIconClasses("/playbook")} />
                  <span>PropertyPlaybook</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/tools" 
                  className={getMobileNavItemClasses("/tools")}
                  onClick={() => {
                    const mobileMenu = document.getElementById('mobile-menu');
                    const overlay = document.getElementById('mobile-menu-overlay');
                    if (mobileMenu) mobileMenu.classList.add('-translate-x-full');
                    if (overlay) overlay.classList.add('hidden');
                  }}
                >
                  <Calculator className={getMobileIconClasses("/tools")} />
                  <span>Tools</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/help" 
                  className={getMobileNavItemClasses("/help")}
                  onClick={() => {
                    const mobileMenu = document.getElementById('mobile-menu');
                    const overlay = document.getElementById('mobile-menu-overlay');
                    if (mobileMenu) mobileMenu.classList.add('-translate-x-full');
                    if (overlay) overlay.classList.add('hidden');
                  }}
                >
                  <HelpCircle className={getMobileIconClasses("/help")} />
                  <span>Help</span>
                </Link>
              </li>
            </ul>
            
            <h3 className="text-sm uppercase text-gray-500 font-medium tracking-wider mb-3 mt-8">Account</h3>
            <ul className="space-y-4 mb-20">
              <li>
                <Link 
                  href="/profile" 
                  className={getMobileNavItemClasses("/profile")}
                  onClick={() => {
                    const mobileMenu = document.getElementById('mobile-menu');
                    const overlay = document.getElementById('mobile-menu-overlay');
                    if (mobileMenu) mobileMenu.classList.add('-translate-x-full');
                    if (overlay) overlay.classList.add('hidden');
                  }}
                >
                  <UserCircle className={getMobileIconClasses("/profile")} />
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/settings" 
                  className={getMobileNavItemClasses("/settings")}
                  onClick={() => {
                    const mobileMenu = document.getElementById('mobile-menu');
                    const overlay = document.getElementById('mobile-menu-overlay');
                    if (mobileMenu) mobileMenu.classList.add('-translate-x-full');
                    if (overlay) overlay.classList.add('hidden');
                  }}
                >
                  <Settings className={getMobileIconClasses("/settings")} />
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      
      {/* Overlay for mobile menu */}
      <div 
        id="mobile-menu-overlay" 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden hidden touch-none"
        onClick={() => {
          const mobileMenu = document.getElementById('mobile-menu');
          const overlay = document.getElementById('mobile-menu-overlay');
          if (mobileMenu) mobileMenu.classList.add('-translate-x-full');
          if (overlay) overlay.classList.add('hidden');
          
          // Ensure body scrolling is re-enabled
          cleanupScrollLock();
        }}
      ></div>
      
      {/* Expansion indicator that peeks from the edge (only on desktop) */}
      {!isMobile && !isExpanded && showExpandIndicator && (
        <div 
          className="fixed top-1/3 left-0 z-30 cursor-pointer h-10"
          onClick={() => setIsExpanded(true)}
        >
          <div className="flex items-center bg-white shadow-md h-full">
            <div className="w-2 h-full border-r border-gray-200"></div>
            <div className="w-4 h-full flex items-center justify-center">
              <ChevronRight size={14} className="text-gray-400" />
            </div>
          </div>
        </div>
      )}
      
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          id="sidebar-overlay"
          className="fixed inset-0 bg-black/50 z-40"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Update DOM directly as a fallback approach
            const sidebarElement = document.getElementById('sidebar');
            if (sidebarElement) {
              sidebarElement.classList.remove('translate-x-0');
              sidebarElement.classList.add('-translate-x-full');
            }
            
            // Also update React state
            closeSidebar();
            
            // Hide overlay
            const overlay = document.getElementById('sidebar-overlay');
            if (overlay) {
              overlay.style.display = 'none';
            }
            
            // Ensure body scrolling is re-enabled
            cleanupScrollLock();
          }}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        id="sidebar" 
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-screen overflow-y-auto shadow-lg
          transition-all duration-200 ease-in-out bg-white
          ${isOpen ? 'translate-x-0 z-[200]' : '-translate-x-full lg:translate-x-0 z-[200]'}
          ${isExpanded ? 'w-64' : 'w-16'}
          ${isMobile ? 'w-[250px]' : ''}
        `}
        onMouseEnter={() => !isMobile && setIsExpanded(true)}
        onMouseLeave={() => !isMobile && setIsExpanded(false)}
      >
        <nav className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-14 flex items-center justify-start border-b">
            <Link href="/" className="flex items-center ml-4 justify-start w-full">
              <img 
                src="/images/pdLogo.png" 
                alt="PropertyDeals Logo" 
                className="h-8 w-auto"
              />
              {isExpanded && (
                <span className="ml-2 font-heading font-bold text-[#09261E] text-lg">
                  PropertyDeals
                </span>
              )}
            </Link>
          </div>

          {/* Main Navigation */}
          <div className="pt-1">
            <div className="mb-1">
              <ul className="space-y-0.5">
                <li>
                  <Link href="/" className={getNavItemClasses("/")}>
                    <Home className="w-6 h-6 flex-shrink-0" />
                    <span className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>Home</span>
                  </Link>
                </li>
                <li>
                  <Link href="/properties" className={getNavItemClasses("/properties")}>
                    <Building className="w-6 h-6 flex-shrink-0" />
                    <span className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>Properties</span>
                  </Link>
                </li>
                <li>
                  <Link href="/reps" className={getNavItemClasses("/reps")}>
                    <Users className="w-6 h-6 flex-shrink-0" />
                    <span className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>The REP Room</span>
                  </Link>
                </li>
                <li>
                  <Link href="/discussions" className={getNavItemClasses("/discussions")}>
                    <MessageCircle className="w-6 h-6 flex-shrink-0" />
                    <span className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>Discussions</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className={getNavItemClasses("/dashboard")}>
                    <LayoutDashboard className="w-6 h-6 flex-shrink-0" />
                    <span className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>Dashboard</span>
                  </Link>
                </li>
                <li>
                  {/* Dynamic link for List a Property - desktop */}
                  <Link 
                    href={user && user.activeRole === 'seller' && sellerStatus === 'active' 
                      ? `/sellerdash/${user.id}` 
                      : '/sellerdash'
                    } 
                    className={getNavItemClasses("/sellerdash")}
                  >
                    <ListPlus className="w-6 h-6 flex-shrink-0" />
                    <span className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>List a Property</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Section */}
            <div className="mb-4">
              <div className="h-5">
                <h3 className={`text-xs uppercase text-[#803344] font-medium tracking-wider px-4 whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                  Resources
                </h3>
              </div>
              <ul className="space-y-0.5">
                <li>
                  <Link href="/playbook" className={getNavItemClasses("/playbook")}>
                    <Book className="w-6 h-6 flex-shrink-0" />
                    <span className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>PropertyPlaybook</span>
                  </Link>
                </li>
                <li>
                  <Link href="/tools" className={getNavItemClasses("/tools")}>
                    <Calculator className="w-6 h-6 flex-shrink-0" />
                    <span className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>Tools</span>
                  </Link>
                </li>
                <li>
                  <Link href="/help" className={getNavItemClasses("/help")}>
                    <HelpCircle className="w-6 h-6 flex-shrink-0" />
                    <span className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>Help</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Spacer to push profile section to bottom */}
            <div className="flex-grow"></div>
          </div>
          
          {/* Profile & Settings */}
          <div className="mt-auto border-t border-gray-200 py-2">
            <div className="h-5">
              <h3 className={`text-xs uppercase text-[#803344] font-medium tracking-wider px-4 whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                Account
              </h3>
            </div>
            <ul className="space-y-0.5">
              <li>
                <Link href="/profile" className={getNavItemClasses("/profile")}>
                  <UserCircle className="w-6 h-6 flex-shrink-0" />
                  <span className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>Profile</span>
                </Link>
              </li>
              <li>
                <Link href="/settings" className={getNavItemClasses("/settings")}>
                  <Settings className="w-6 h-6 flex-shrink-0" />
                  <span className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>Settings</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
}
