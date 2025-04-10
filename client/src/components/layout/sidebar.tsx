import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

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
    if (window.innerWidth < 1024 && isOpen) {
      closeSidebar();
    }
  }, [location, isOpen, closeSidebar]);

  // Handle window resize
  useEffect(() => {
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
  }, [isExpanded]);

  // Dynamic classes for the hover-expandable sidebar (desktop only)
  const sidebarClasses = `
    bg-white shadow-md fixed lg:sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto z-40 transition-all duration-300
    ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0'}
    ${isExpanded ? 'lg:w-64' : 'lg:w-16 hover:lg:w-64'}
  `;

  // Nav item classes (conditionally show text)
  const getNavItemClasses = (path: string) => {
    const isActive = location === path;
    return `
      flex items-center p-2 rounded-md whitespace-nowrap transition-colors duration-200
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
      <nav className="p-4">
        <div className="mb-6">
          <h3 className={`text-xs uppercase text-gray-500 font-medium tracking-wider mb-3 ${!isExpanded && 'lg:opacity-0'}`}>
            Navigation
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className={getNavItemClasses("/")}>
                <i className="fas fa-home w-5 text-center"></i>
                <span className={`ml-3 ${!isExpanded && 'lg:opacity-0 lg:w-0 lg:hidden lg:group-hover:inline-block'}`}>
                  Home
                </span>
              </Link>
            </li>
            <li>
              <Link href="/properties" className={getNavItemClasses("/properties")}>
                <i className="fas fa-building w-5 text-center"></i>
                <span className={`ml-3 ${!isExpanded && 'lg:opacity-0 lg:w-0 lg:hidden lg:group-hover:inline-block'}`}>
                  Properties
                </span>
              </Link>
            </li>
            <li>
              <Link href="/reps" className={getNavItemClasses("/reps")}>
                <i className="fas fa-user-tie w-5 text-center"></i>
                <span className={`ml-3 ${!isExpanded && 'lg:opacity-0 lg:w-0 lg:hidden lg:group-hover:inline-block'}`}>
                  Professionals
                </span>
              </Link>
            </li>
            <li>
              <Link href="/seller-dashboard" className={getNavItemClasses("/seller-dashboard")}>
                <i className="fas fa-chart-line w-5 text-center"></i>
                <span className={`ml-3 ${!isExpanded && 'lg:opacity-0 lg:w-0 lg:hidden lg:group-hover:inline-block'}`}>
                  Seller Dashboard
                </span>
              </Link>
            </li>
            <li>
              <Link href="/about" className={getNavItemClasses("/about")}>
                <i className="fas fa-info-circle w-5 text-center"></i>
                <span className={`ml-3 ${!isExpanded && 'lg:opacity-0 lg:w-0 lg:hidden lg:group-hover:inline-block'}`}>
                  About
                </span>
              </Link>
            </li>
            <li>
              <Link href="/contact" className={getNavItemClasses("/contact")}>
                <i className="fas fa-envelope w-5 text-center"></i>
                <span className={`ml-3 ${!isExpanded && 'lg:opacity-0 lg:w-0 lg:hidden lg:group-hover:inline-block'}`}>
                  Contact
                </span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className={`text-xs uppercase text-gray-500 font-medium tracking-wider mb-3 ${!isExpanded && 'lg:opacity-0'}`}>
            Resources
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className={getNavItemClasses("")}>
                <i className="fas fa-book w-5 text-center"></i>
                <span className={`ml-3 ${!isExpanded && 'lg:opacity-0 lg:w-0 lg:hidden lg:group-hover:inline-block'}`}>
                  Guides
                </span>
              </Link>
            </li>
            <li>
              <Link href="#" className={getNavItemClasses("")}>
                <i className="fas fa-question-circle w-5 text-center"></i>
                <span className={`ml-3 ${!isExpanded && 'lg:opacity-0 lg:w-0 lg:hidden lg:group-hover:inline-block'}`}>
                  Help Center
                </span>
              </Link>
            </li>
          </ul>
        </div>

        <div className={`mt-auto pt-6 ${!isExpanded && 'lg:hidden'}`}>
          <div className="bg-[#135341]/10 p-4 rounded-lg">
            <h4 className="font-heading text-[#09261E] text-sm mb-2">Ready to sell?</h4>
            <p className="text-xs text-gray-600 mb-3">List your property and reach motivated buyers today.</p>
            <Link href={user ? "/seller-dashboard" : "/register"}>
              <Button className="w-full bg-[#09261E] hover:bg-[#135341] text-white text-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
}
