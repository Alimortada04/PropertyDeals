import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { user, logoutMutation } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

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
          >
            <i className="fas fa-bars text-xl"></i>
          </button>

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-[#09261E] rounded-md flex items-center justify-center mr-2">
                <span className="text-white font-heading font-bold text-lg">PD</span>
              </div>
              <span className="text-[#09261E] font-heading font-bold text-xl hidden sm:inline-block">PropertyDeals</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-[#135341] hover:text-[#09261E] font-medium">Home</Link>
            <Link href="/properties" className="text-[#135341] hover:text-[#09261E] font-medium">Properties</Link>
            <Link href="/reps" className="text-[#135341] hover:text-[#09261E] font-medium">Professionals</Link>
            <Link href="/about" className="text-[#135341] hover:text-[#09261E] font-medium">About</Link>
            <Link href="/contact" className="text-[#135341] hover:text-[#09261E] font-medium">Contact</Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <span className="hidden sm:inline-block text-[#135341]">
                  Welcome, {user.fullName || user.username}
                </span>
                {user.userType === "seller" && (
                  <Link href="/seller-dashboard">
                    <Button variant="outline" className="hidden sm:inline-flex">Dashboard</Button>
                  </Link>
                )}
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
