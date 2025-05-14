import React, { useState, useEffect, useRef, useMemo, Suspense, lazy } from "react";
import { useLocation, Link, useParams } from "wouter";
import { cn } from "@/lib/utils";
import { Compass, FileClock, Users, BarChart3, LayoutGrid, Home, Loader2, MessageSquare, Megaphone } from "lucide-react";
import Navbar from "./navbar";
import { useQueryClient } from '@tanstack/react-query';

interface SellerDashboardLayoutProps {
  children: React.ReactNode;
  userId?: string;
}

// Main Layout Component
export function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = useParams();
  
  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  return <SellerDashboardLayoutWithUserId userId={userId}>{children}</SellerDashboardLayoutWithUserId>;
}

// Original Layout Component with userId prop
export function SellerDashboardLayoutWithUserId({
  children,
  userId,
}: SellerDashboardLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [cachedPages, setCachedPages] = useState<{[key: string]: React.ReactNode}>({});
  const pageTransitionRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  
  // Define navigation items with their associated API queries for prefetching
  interface NavItem {
    label: string;
    icon: React.ForwardRefExoticComponent<any>;
    href: string;
    exact?: boolean;
    queries: string[];
  }
  
  const navItems = useMemo<NavItem[]>(() => [
    {
      label: "Discover",
      icon: Compass,
      href: `/sellerdash/${userId}`,
      exact: true, // Only match exact path
      queries: ['/api/properties'],
    },
    {
      label: "Manage",
      icon: FileClock,
      href: `/sellerdash/${userId}/manage`,
      exact: false,
      queries: ['/api/properties'],
    },
    {
      label: "Engagement",
      icon: MessageSquare,
      href: `/sellerdash/${userId}/engagement`,
      exact: false,
      queries: ['/api/users', '/api/inquiries'],
    },
    {
      label: "Marketing",
      icon: Megaphone,
      href: `/sellerdash/${userId}/marketing`,
      exact: false,
      queries: ['/api/users', '/api/campaigns'],
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: `/sellerdash/${userId}/analytics`,
      exact: false,
      queries: ['/api/properties', '/api/analytics'],
    },
  ], [userId]);

  // Preload associated data for faster page transitions
  useEffect(() => {
    // For initial page load optimization
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 300);
    
    // Prefetch data for all nav sections
    navItems.forEach(item => {
      if (item.queries) {
        item.queries.forEach(query => {
          queryClient.prefetchQuery({
            queryKey: [query],
            staleTime: 1000 * 60 * 5 // 5 minutes
          });
        });
      }
    });
    
    return () => clearTimeout(timer);
  }, [navItems, queryClient]);
  
  // Handle route transition animations
  useEffect(() => {
    const handleRouteChange = () => {
      if (pageTransitionRef.current) {
        // Add transition animation classes
        pageTransitionRef.current.classList.add('opacity-100');
        pageTransitionRef.current.classList.remove('opacity-0');
      }
    };
    
    handleRouteChange();
    
    // Cache the current page content
    setCachedPages(prev => ({
      ...prev,
      [location]: children
    }));
  }, [location, children]);
  
  // Toggle sidebar function to pass to Navbar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check if a nav item is active
  const isActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return location === href;
    }
    return location.startsWith(href);
  };
  
  // Prefetch on hover
  const handleNavHover = (item: typeof navItems[0]) => {
    if (item.queries) {
      item.queries.forEach(query => {
        queryClient.prefetchQuery({
          queryKey: [query]
        });
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
      {/* Pill-style navigation - Sticky to top and transparent */}
      <div className="sticky top-0 z-40 pt-4 pb-2">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="backdrop-blur-lg bg-white/10 shadow-lg border border-white/20 rounded-xl px-4 py-2 inline-flex">
              <div className="p-1 flex-nowrap gap-2 overflow-x-auto flex">
                {navItems.map((item) => {
                  const active = isActive(item.href, item.exact);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onMouseEnter={() => handleNavHover(item)}
                      className={cn(
                        "data-[active=true]:bg-[#09261E] data-[active=true]:text-white data-[active=true]:shadow-sm data-[active=true]:font-semibold data-[active=false]:bg-white/70 data-[active=false]:border data-[active=false]:border-neutral-200 data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100 rounded-full px-4 py-2 transition-all duration-200 ease-in-out scale-100 hover:scale-[1.02] relative flex items-center",
                      )}
                      data-active={active}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      <span className="font-medium">{item.label}</span>
                      <div className={cn("absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full mb-0.5", active ? "bg-[#09261E]" : "hidden")}></div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content with transition effects */}
      <div className="flex-1">
        <div 
          className="container max-w-7xl mx-auto px-4 py-6 transition-opacity duration-200 ease-out"
          ref={pageTransitionRef}
          style={{ opacity: isInitialLoad ? '0' : '1' }}
        >
          {/* Suspense fallback for smoother transitions */}
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          }>
            {/* Show cached page content when available for instant transitions */}
            {cachedPages[location] || children}
          </Suspense>
        </div>
      </div>
      
      {/* Preload other dashboard pages for instant navigation */}
      <div className="hidden">
        {Object.entries(cachedPages)
          .filter(([path]) => path !== location)
          .map(([path, content]) => (
            <div key={path} aria-hidden="true">
              {content}
            </div>
          ))}
      </div>
    </div>
  );
}

// Default export for backward compatibility
export default SellerDashboardLayout;