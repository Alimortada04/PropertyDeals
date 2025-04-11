import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Sidebar from "./sidebar";
import Footer from "./footer";
import TopNavbar from "./top-navbar";
import Breadcrumbs from "../common/breadcrumbs";
import { Menu } from "lucide-react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [location] = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // This effect is used to detect if window exists (for SSR compatibility)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        // Reset sidebar state on mobile/desktop transitions
        if (window.innerWidth < 1024) {
          setIsExpanded(false);
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8FA]">
      {/* Top-right sticky navbar */}
      <TopNavbar />
      
      <div className="flex flex-1 pt-14">
        {/* Sidebar with hamburger toggle */}
        <div className="absolute left-4 top-4 z-40">
          <button 
            onClick={toggleSidebar}
            className="text-gray-700 p-2 hover:bg-gray-100 rounded-full"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        
        <Sidebar 
          isOpen={sidebarOpen} 
          closeSidebar={closeSidebar} 
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
        
        {/* Main content */}
        <main className="flex-1 w-full transition-all duration-200">
          <div className="min-h-screen pt-4 pb-16">
            {/* Skip breadcrumbs on homepage, otherwise full left-aligned */}
            {location !== "/" && (
              <div className="pl-16 pr-4 mb-4">
                <Breadcrumbs />
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}