import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { user, logoutMutation } = useAuth();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  // Handle scroll to hide/show navbar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isScrolledDown = prevScrollPos < currentScrollPos;
      const isScrolledUp = prevScrollPos > currentScrollPos;
      const isScrolledBeyondThreshold = currentScrollPos > 64;
      
      setVisible((!isScrolledDown || isScrolledUp) && !(isScrolledDown && isScrolledBeyondThreshold));
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header 
      className={`bg-white shadow-sm fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Menu toggle button */}
          <button 
            onClick={toggleSidebar}
            className="text-gray-700 p-2 hover:bg-gray-100 rounded-full"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Search bar (only on specific pages) */}
          <div className="flex-1 max-w-md ml-4 hidden lg:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-9 border-gray-300 focus:border-gray-400 rounded-full bg-gray-50 hover:bg-white focus:bg-white"
              />
            </div>
          </div>
          
          <div className="flex-1 lg:flex-none"></div>
          
          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:inline-block text-gray-700">
                  {user.fullName || user.username}
                </span>
                <Button 
                  onClick={handleLogout} 
                  className="bg-[#09261E] hover:bg-[#135341] text-white"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <span className="text-gray-700 font-medium hover:text-[#09261E] px-3 py-1">
                    Sign In
                  </span>
                </Link>
                <Link href="/register">
                  <Button className="bg-[#09261E] hover:bg-[#135341] text-white rounded-md">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
