import React, { useState, useRef, useEffect } from 'react';
import BuyerDashboard from '@/components/dashboard/BuyerDashboard';
import SellerDashboard from '@/components/dashboard/SellerDashboard';
import RepDashboard from '@/components/dashboard/RepDashboard';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Define user types and mock data as requested
interface UserRole {
  status: "approved" | "pending" | "not_applied" | "denied";
}

interface UserRoles {
  buyer: UserRole;
  seller: UserRole;
  rep: UserRole;
}

interface User {
  name: string;
  activeRole: "buyer" | "seller" | "rep";
  roles: UserRoles;
}

// Mock user object with all approved roles as specified
const user: User = {
  name: "Ali",
  activeRole: "buyer",
  roles: {
    buyer: { status: "approved" },
    seller: { status: "approved" },
    rep: { status: "approved" }
  }
};

// Role colors for styling
const roleColors = {
  buyer: {
    bg: "bg-[#09261E]",
    hover: "hover:bg-[#09261E]/90",
    text: "text-[#09261E]",
    light: "bg-[#09261E]/10"
  },
  seller: {
    bg: "bg-[#135341]",
    hover: "hover:bg-[#135341]/90",
    text: "text-[#135341]",
    light: "bg-[#135341]/10"
  },
  rep: {
    bg: "bg-[#803344]",
    hover: "hover:bg-[#803344]/90",
    text: "text-[#803344]",
    light: "bg-[#803344]/10"
  }
};

export default function DashboardPage() {
  const [activeRole, setActiveRole] = useState<"buyer" | "seller" | "rep">(user.activeRole);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get proper title for the role
  const getRoleTitle = (role: "buyer" | "seller" | "rep") => {
    return role === "rep" ? "REP" : role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Handle clicks outside the menu to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Render the dashboard for the active role
  const renderDashboard = () => {
    switch (activeRole) {
      case "buyer":
        return <BuyerDashboard />;
      case "seller":
        return <SellerDashboard />;
      case "rep":
        return <RepDashboard />;
      default:
        return <BuyerDashboard />;
    }
  };

  return (
    <div className="relative min-h-screen pb-20">
      {renderDashboard()}

      {/* Fixed Position Role Toggle in bottom-right corner */}
      <div className="fixed bottom-6 right-6 z-50" ref={menuRef}>
        {/* Role Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`${roleColors[activeRole].bg} text-white px-4 py-2 rounded-full flex items-center shadow-lg transition-all duration-200 hover:shadow-xl`}
        >
          <span className="mr-2 font-medium">Mode: {getRoleTitle(activeRole)}</span>
          {isMenuOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {/* Role Selection Menu */}
        {isMenuOpen && (
          <div className="absolute bottom-14 right-0 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden w-40 animate-fadeIn">
            {Object.keys(user.roles).map((role) => (
              <button
                key={role}
                className={`w-full text-left px-4 py-3 ${
                  role === activeRole
                    ? `${roleColors[role as "buyer" | "seller" | "rep"].light} ${roleColors[role as "buyer" | "seller" | "rep"].text} font-medium`
                    : "hover:bg-gray-50"
                } transition-colors flex items-center justify-between`}
                onClick={() => {
                  setActiveRole(role as "buyer" | "seller" | "rep");
                  setIsMenuOpen(false);
                }}
              >
                <span>{getRoleTitle(role as "buyer" | "seller" | "rep")}</span>
                {role === activeRole && (
                  <div className={`h-2 w-2 rounded-full ${roleColors[role as "buyer" | "seller" | "rep"].bg}`}></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}