import React from "react";
import Sidebar from "@/components/navigation/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="pl-16 pb-16">  {/* Added bottom padding for the dock */}
        {children}
      </div>
    </div>
  );
}