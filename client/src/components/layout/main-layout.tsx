import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Sidebar from "./sidebar";
import Footer from "./footer";
import TopNavbar from "./top-navbar";
import Breadcrumbs from "../common/breadcrumbs";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [location] = useLocation();

  const toggleSidebar = () => {
    console.log('Toggle sidebar called, current state:', sidebarOpen);
    setSidebarOpen(prevState => !prevState);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Check if we're on pages where the top banner should be hidden when scrolling up
  const isSpecialPage = location === '/reps' || location === '/properties' || 
                        location.startsWith('/rep/') || location.startsWith('/p/');

  // This effect is used to detect if window exists (for SSR compatibility)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        // Check if we're on mobile
        const mobile = window.innerWidth < 1024;
        setIsMobile(mobile);
        
        // Reset sidebar state on mobile/desktop transitions
        if (mobile) {
          setIsExpanded(false);
          setSidebarOpen(false); // Close sidebar on mobile
        }
      };

      // Initial check
      handleResize();
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8FA]">
      {/* Top-right sticky navbar */}
      <TopNavbar specialBehavior={isSpecialPage} />
      
      <div className="flex flex-1 pt-16 lg:pt-14">
        {/* Sidebar component - no floating hamburger */}
        <Sidebar 
          isOpen={sidebarOpen} 
          closeSidebar={closeSidebar} 
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          toggleSidebar={toggleSidebar}
        />
        
        {/* Main content - ensure it starts after the collapsed sidebar width on desktop only */}
        <main className={`flex-1 w-full transition-all duration-200 ${!isMobile ? (!isExpanded ? 'ml-16' : 'ml-64') : 'ml-0'} lg:ml-16`}>
          <div className="min-h-screen pt-4 pb-16 px-4">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}