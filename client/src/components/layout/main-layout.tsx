import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import Footer from "./footer";
import Breadcrumbs from "../common/breadcrumbs";

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
      {/* Top navbar */}
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          closeSidebar={closeSidebar} 
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
        
        {/* Main content - NO left padding for sidebar to ensure overlay */}
        <main className="flex-1 w-full transition-all duration-200">
          <div className="min-h-screen pt-4 pb-16">
            {/* Skip breadcrumbs on homepage */}
            {location !== "/" && (
              <div className="container mx-auto px-[10%] mb-2">
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
