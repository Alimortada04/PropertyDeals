import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Mobile menu button */}
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-[#09261E] p-2"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Spacer to center the auth buttons */}
          <div className="lg:flex-1"></div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="hidden sm:inline-block text-[#135341]">
                  Welcome, {user.fullName || user.username}
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
                <Link href="/signin" className="text-[#135341] hover:text-[#09261E] font-medium hidden sm:inline-block">
                  Sign In
                </Link>
                <Link href="/register">
                  <Button className="bg-[#09261E] hover:bg-[#135341] text-white">
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
