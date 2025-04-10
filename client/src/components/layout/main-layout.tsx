import { useState, useEffect } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import Footer from "./footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
      
      <div className="flex flex-1 pt-14"> {/* pt-14 to account for fixed navbar */}
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          closeSidebar={closeSidebar} 
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
        
        {/* Main content - doesn't shift when sidebar expands */}
        <main className="flex-1 w-full transition-all duration-200">
          <div className="min-h-screen pt-4 pb-16">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
