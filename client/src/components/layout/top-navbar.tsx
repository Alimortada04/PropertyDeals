import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function TopNavbar() {
  const { user, logoutMutation } = useAuth();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [location] = useLocation();

  // Handle scroll to hide/show navbar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isScrolledDown = prevScrollPos < currentScrollPos;
      const isScrolledBeyondThreshold = currentScrollPos > 20;
      
      // Hide when scrolling down, show when scrolling up
      if (isScrolledDown && isScrolledBeyondThreshold) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <div 
      className={`fixed top-0 right-0 z-50 transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Right-aligned banner */}
      <div className="bg-white shadow-md py-3 px-5 rounded-bl-lg flex items-center gap-4 self-start">
        {/* Search bar */}
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-9 border-gray-300 focus:border-gray-400 rounded-full bg-gray-50 hover:bg-white focus:bg-white"
          />
        </div>
        
        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-gray-700">
                {user.fullName || user.username}
              </span>
              <Button 
                onClick={handleLogout} 
                variant="outline"
                className="hover:bg-[#EAF2EF] hover:text-[#09261E] border-gray-300"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button 
                  variant="outline"
                  className="hover:bg-[#EAF2EF] hover:text-[#09261E] border-gray-300"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#09261E] hover:bg-[#9E3434] text-white">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}