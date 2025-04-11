import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import Footer from "./footer";

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

  // Determine if we're on a page that needs extra padding at the top (fixed navbar pages)
  const isFixedNavbarPage = location === '/properties' || location === '/reps';
  
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8FA]">
      {/* Top navbar */}
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className={`flex flex-1 ${isFixedNavbarPage ? 'pt-14' : ''}`}> {/* Only add padding for fixed navbar pages */}
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          closeSidebar={closeSidebar} 
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
        
        {/* Main content - proper spacing for both collapsed/expanded sidebar */}
        <main className={`flex-1 w-full transition-all duration-200 ${isExpanded ? 'lg:pl-64' : 'lg:pl-16'}`}>
          <div className="min-h-screen pt-4 pb-16">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
