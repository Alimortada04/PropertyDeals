import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TopNavbarProps {
  specialBehavior?: boolean;
}

export default function TopNavbar({ specialBehavior = false }: TopNavbarProps) {
  const { user, logoutMutation } = useAuth();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [location] = useLocation();

  // Detect mobile devices
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll to hide/show navbar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isScrolledDown = prevScrollPos < currentScrollPos;
      const isScrolledBeyondThreshold = currentScrollPos > 20;
      
      // For REPs and Properties pages, hide on scroll (both up and down)
      // to prevent it from covering the search filters
      if (specialBehavior && isScrolledBeyondThreshold) {
        setVisible(false);
      } 
      // Standard behavior - hide when scrolling down, show when scrolling up
      else if (isScrolledDown && isScrolledBeyondThreshold) {
        setVisible(false);
      } else if (!isScrolledDown) {
        setVisible(true);
      }
      
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, specialBehavior]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Don't render on mobile or dashboard pages
  if (isMobile || location.includes("/dashboard")) {
    return null;
  }
  
  return (
    <div 
      className={`fixed top-0 right-0 z-50 transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Right-aligned banner */}
      <div className="bg-white shadow-md py-2 px-3 rounded-bl-lg flex items-center justify-end gap-1 self-start">
        {/* Auth Buttons - moved to the right */}
        <div className="flex items-center gap-1 ml-auto">
          {user ? (
            <>
              <span className="text-gray-700">
                {user.fullName || user.username}
              </span>
              <Button 
                onClick={handleLogout} 
                variant="outline"
                className="hover:bg-[#EAF2EF] hover:text-[#09261E] border-gray-300 px-3 py-1"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button 
                  variant="outline"
                  className="hover:bg-[#135341] hover:text-white border-gray-300 transition-colors duration-200 px-3 py-1"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  className="bg-[#09261E] hover:bg-[#803344] text-white transition-colors duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] px-3 py-1"
                >
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