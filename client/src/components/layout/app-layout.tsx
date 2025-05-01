import React, { useState, useEffect } from "react";
import Sidebar from "@/components/navigation/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Settings,
  Bell, 
  MessageCircle,
  ChevronRight,
  Search
} from "lucide-react";
import { MessagePopup } from "@/components/popups/MessagePopup";
import { NotificationPopup } from "@/components/popups/NotificationPopup";
import { Link } from "wouter";
import { GlobalSearchInput } from "@/components/search/global-search";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  // States for popups
  const [showMenu, setShowMenu] = useState(false);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(!showSearch);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);
  
  // Toggle popup functions
  const toggleMessagePopup = () => {
    // Close other popups first
    if (showNotificationPopup) setShowNotificationPopup(false);
    if (showMenu) setShowMenu(false);
    // Toggle message popup
    setShowMessagePopup(!showMessagePopup);
  };
  
  const toggleNotificationPopup = () => {
    // Close other popups first
    if (showMessagePopup) setShowMessagePopup(false);
    if (showMenu) setShowMenu(false);
    // Toggle notification popup
    setShowNotificationPopup(!showNotificationPopup);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div>
        {/* Sidebar */}
        <Sidebar />
        
        {/* Bottom Dock Bar - Slightly thicker, white background with flush corners */}
        <div className="fixed bottom-0 left-0 w-full h-12 bg-white border-t flex items-center z-50 shadow-md">
          <div className="w-full px-4 flex items-center justify-between">
            <div>
              {/* Menu selector on far left with popup menu (like whop.com) */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-700 flex items-center h-8 px-3 rounded-md hover:bg-gray-100 hover:text-gray-700"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Menu</span>
                </Button>
                
                {/* Menu Popup (whop.com style) */}
                {showMenu && (
                  <>
                    {/* Overlay to close menu when clicking outside */}
                    <div 
                      className="fixed inset-0 z-50" 
                      onClick={() => setShowMenu(false)}
                    />
                    
                    {/* The actual menu */}
                    <div className="absolute bottom-12 left-0 z-50 bg-white rounded-tr-lg rounded-tl-lg rounded-br-lg shadow-lg border w-72 overflow-hidden">
                      {/* Theme toggle section */}
                      <div className="p-4 border-b">
                        <div className="flex justify-between items-center bg-gray-100 rounded-md p-2">
                          <button className="p-2 rounded-md bg-white">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="currentColor"/>
                              <path d="M12 3V5M12 19V21M5.6 5.6L7.0 7.0M17.0 17.0L18.4 18.4M3 12H5M19 12H21M5.6 18.4L7.0 17.0M17.0 7.0L18.4 5.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </button>
                          <div className="bg-gray-100 rounded-md px-2 py-1">
                            <div className="relative w-10 h-6">
                              <div className="w-full h-full bg-blue-500 rounded-full absolute"></div>
                              <div className="h-5 w-5 bg-white rounded-full absolute top-0.5 right-0.5 transform transition-transform"></div>
                            </div>
                          </div>
                          <button className="p-2 rounded-md">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-sm font-medium">Sound effects</span>
                          <div className="bg-gray-100 rounded-md px-2 py-1">
                            <div className="relative w-10 h-6">
                              <div className="w-full h-full bg-blue-500 rounded-full absolute"></div>
                              <div className="h-5 w-5 bg-white rounded-full absolute top-0.5 right-0.5 transform transition-transform"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu items */}
                      <div className="py-1">
                        <Link href="/profile/settings" onClick={() => setShowMenu(false)}>
                          <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-100">
                            <span className="text-base">Language</span>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </Link>
                        <Link href="/help/links" onClick={() => setShowMenu(false)}>
                          <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-100">
                            <span className="text-base">Links</span>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </Link>
                        <Link href="/help" onClick={() => setShowMenu(false)}>
                          <div className="flex items-center px-4 py-3 hover:bg-gray-100">
                            <span className="text-base">Help & support</span>
                          </div>
                        </Link>
                        <Link href="/contact-sales" onClick={() => setShowMenu(false)}>
                          <div className="flex items-center px-4 py-3 hover:bg-gray-100">
                            <span className="text-base">Contact sales</span>
                          </div>
                        </Link>
                        <Link href="/updates" onClick={() => setShowMenu(false)}>
                          <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-100">
                            <span className="text-base">What's New</span>
                            <span className="text-sm text-gray-500">04/25</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Search Button */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-gray-100 hover:text-gray-700"
                  onClick={() => setShowSearch(true)}
                >
                  <Search className="h-4 w-4 text-[#09261E]" />
                </Button>
              </div>
              
              {/* Notification Button */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-gray-100 hover:text-gray-700"
                  onClick={toggleNotificationPopup}
                >
                  <Bell className="h-4 w-4 text-[#09261E]" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
                </Button>
              </div>
              
              {/* Chat Button */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-gray-100 hover:text-gray-700"
                  onClick={toggleMessagePopup}
                >
                  <MessageCircle className="h-4 w-4 text-[#09261E]" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500"></span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="pl-16 pb-12">  {/* Adjusted padding for slightly thicker dock */}
        <div className="min-h-screen">
          {children}
        </div>
      </div>
      
      {/* Message Popup */}
      <MessagePopup 
        isOpen={showMessagePopup} 
        onClose={() => setShowMessagePopup(false)} 
      />
      
      {/* Notification Popup */}
      <NotificationPopup 
        isOpen={showNotificationPopup}
        onClose={() => setShowNotificationPopup(false)}
      />

      {/* Global Search */}
      {showSearch && <GlobalSearchInput onClose={() => setShowSearch(false)} />}
    </div>
  );
}