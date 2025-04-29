import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Redirect } from "wouter";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Flag, 
  Settings, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // If not authenticated, redirect to login
  if (!user) {
    return <Redirect to="/auth" />;
  }

  // If authenticated but not admin, redirect to dashboard
  if (!user.isAdmin) {
    return <Redirect to="/dashboard" />;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin/dashboard"
    },
    {
      label: "Users",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/users"
    },
    {
      label: "Approvals",
      icon: <CheckCircle className="h-5 w-5" />,
      href: "/admin/approvals"
    },
    {
      label: "System Logs",
      icon: <Clock className="h-5 w-5" />,
      href: "/admin/logs"
    },
    {
      label: "Reports",
      icon: <Flag className="h-5 w-5" />,
      href: "/admin/reports"
    },
    {
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings"
    }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-md shadow-md"
      >
        {sidebarOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:inset-auto md:h-screen flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#09261E]">PropertyDeals Admin</h1>
        </div>

        <nav className="flex-1 pt-5 px-2 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={`flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                  location === item.href
                    ? "bg-[#09261E] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
                {location === item.href && (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </a>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#09261E] flex items-center justify-center text-white">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user.fullName || user.username}</p>
              <p className="text-xs font-medium text-gray-500">Administrator</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-gray-700"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}