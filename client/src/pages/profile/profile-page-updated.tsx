import React, { useState } from 'react';
import { useLocation } from "wouter";
import ConnectionsTab from "./connections-tab";
import ProfilePage from "./profile-page";

export default function ProfilePageWrapper() {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("account");
  
  // Extract active tab from URL
  React.useEffect(() => {
    const validTabs = ["account", "property_preferences", "connections", "notifications", "integrations", "memberships", "security", "help"];
    
    // Check hash-based routing
    if (location.includes('#')) {
      const hash = location.split('#')[1];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
        return;
      }
    }
    
    // Check path-based routing
    const pathSegments = location.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (validTabs.includes(lastSegment)) {
      setActiveTab(lastSegment);
      return;
    }
    
    // Default to account
    setActiveTab("account");
  }, [location]);
  
  // If connections tab is active, render our custom ConnectionsTab component
  if (activeTab === "connections") {
    return (
      <div className="ml-[236px] flex-1 bg-gray-50/60 p-4 md:p-8 overflow-y-auto pb-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <ConnectionsTab />
        </div>
      </div>
    );
  }
  
  // Otherwise, render the original ProfilePage component
  return <ProfilePage />;
}