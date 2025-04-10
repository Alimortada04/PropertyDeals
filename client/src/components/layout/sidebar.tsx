import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  
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

  return (
    <aside 
      id="sidebar" 
      className={`bg-white shadow-md fixed lg:sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto z-40 sidebar-transition 
        ${isOpen ? 'w-64 translate-x-0' : 'w-0 lg:w-64 -translate-x-full lg:translate-x-0'}`}
    >
      <nav className="p-4">
        <div className="mb-6">
          <h3 className="text-xs uppercase text-gray-500 font-medium tracking-wider mb-3">Navigation</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="flex items-center p-2 text-[#135341] hover:bg-[#09261E] hover:text-white rounded-md">
                <i className="fas fa-home w-5"></i>
                <span className="ml-3">Home</span>
              </Link>
            </li>
            <li>
              <Link href="/properties" className="flex items-center p-2 text-[#135341] hover:bg-[#09261E] hover:text-white rounded-md">
                <i className="fas fa-building w-5"></i>
                <span className="ml-3">Properties</span>
              </Link>
            </li>
            <li>
              <Link href="/seller-dashboard" className="flex items-center p-2 text-[#135341] hover:bg-[#09261E] hover:text-white rounded-md">
                <i className="fas fa-chart-line w-5"></i>
                <span className="ml-3">Seller Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/about" className="flex items-center p-2 text-[#135341] hover:bg-[#09261E] hover:text-white rounded-md">
                <i className="fas fa-info-circle w-5"></i>
                <span className="ml-3">About</span>
              </Link>
            </li>
            <li>
              <Link href="/contact" className="flex items-center p-2 text-[#135341] hover:bg-[#09261E] hover:text-white rounded-md">
                <i className="fas fa-envelope w-5"></i>
                <span className="ml-3">Contact</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xs uppercase text-gray-500 font-medium tracking-wider mb-3">Resources</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="flex items-center p-2 text-[#135341] hover:bg-[#09261E] hover:text-white rounded-md">
                <i className="fas fa-book w-5"></i>
                <span className="ml-3">Guides</span>
              </Link>
            </li>
            <li>
              <Link href="#" className="flex items-center p-2 text-[#135341] hover:bg-[#09261E] hover:text-white rounded-md">
                <i className="fas fa-question-circle w-5"></i>
                <span className="ml-3">Help Center</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-auto pt-6">
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
