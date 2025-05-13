import React, { useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Compass, FileClock, Users, BarChart3, LayoutGrid, Home } from "lucide-react";
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
  
  // Define navigation items - Matching main dashboard
  const navItems = [
    {
      label: "Discover",
      icon: Compass,
      href: `/sellerdash/${userId}`,
      exact: true, // Only match exact path
    },
    {
      label: "Manage",
      icon: FileClock,
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
      {/* Pill-style navigation - Sticky to top and transparent */}
      <div className="sticky top-0 z-40 pt-4 pb-2 bg-transparent">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center md:justify-start">
            <div className="backdrop-blur-lg bg-white/10 shadow-lg border border-white/10 rounded-xl px-4 py-2 inline-flex">
              <div className="bg-transparent p-1 flex-nowrap gap-2 overflow-x-auto flex">
                {navItems.map((item) => {
                  const active = isActive(item.href, item.exact);
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "data-[active=true]:bg-[#09261E] data-[active=true]:text-white data-[active=true]:shadow-sm data-[active=true]:font-semibold data-[active=false]:bg-white/70 data-[active=false]:border data-[active=false]:border-neutral-200 data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100 rounded-full px-4 py-2 transition-all duration-200 ease-in-out scale-100 hover:scale-[1.02] relative flex items-center",
                      )}
                      data-active={active}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      <span className="font-medium">{item.label}</span>
                      <div className={cn("absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full mb-0.5", active ? "bg-[#09261E]" : "hidden")}></div>
                    </a>
                  );
                })}
              </div>
            </div>
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