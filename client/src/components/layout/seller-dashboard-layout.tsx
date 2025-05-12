import React, { useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, LayoutGrid, Users, BarChart3 } from "lucide-react";
import Navbar from "./navbar";

interface SellerDashboardLayoutProps {
  children: React.ReactNode;
  userId: string;
}

export default function SellerDashboardLayout({
  children,
  userId,
}: SellerDashboardLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Toggle sidebar function to pass to Navbar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Define navigation items
  const navItems = [
    {
      label: "Home",
      icon: Home,
      href: `/sellerdash/${userId}`,
      exact: true, // Only match exact path
    },
    {
      label: "Manage",
      icon: LayoutGrid,
      href: `/sellerdash/${userId}/manage`,
    },
    {
      label: "Engagement",
      icon: Users,
      href: `/sellerdash/${userId}/engagement`,
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: `/sellerdash/${userId}/analytics`,
    },
  ];

  // Check if a nav item is active
  const isActive = (href: string, exact = false) => {
    if (exact) {
      return location === href;
    }
    return location.startsWith(href);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar toggleSidebar={toggleSidebar} />
      
      {/* Pill-style navigation */}
      <div className="sticky top-16 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center py-2 overflow-x-auto hide-scrollbar">
            <nav className="flex space-x-2 py-2">
              {navItems.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                      active
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 mr-2", active ? "text-white" : "text-gray-500")} />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}