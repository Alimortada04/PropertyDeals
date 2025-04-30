import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import {
  UserCircle,
  Link as LinkIcon,
  Shield,
  CreditCard,
  BarChart,
  ClipboardList,
  AlertTriangle,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

// Form data interface
interface ProfileFormData {
  name: string;
  username: string;
  bio: string;
  email: string;
  phoneNumber: string;
  showProfile: boolean;
}

// Menu item interface
interface ProfileMenuItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  danger?: boolean;
}

// Profile menu item component
const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon,
  label,
  href,
  active,
  onClick,
  className,
  danger = false
}) => {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center px-3 py-2 text-sm transition-colors cursor-pointer my-0.5 rounded-md",
          active
            ? "bg-gray-100 text-[#09261E] font-medium"
            : "text-gray-700 hover:bg-gray-50",
          danger && "text-red-500 hover:text-red-700",
          className
        )}
        onClick={onClick}
      >
        <div className="mr-2.5 text-gray-500">{icon}</div>
        <span>{label}</span>
      </div>
    </Link>
  );
};

// Main profile page component
export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = React.useState<ProfileFormData>({
    name: user?.fullName || "",
    username: user?.username || "",
    bio: "",  // Default to empty string as bio might not exist on the user type
    email: user?.email || "",
    phoneNumber: "",  // Default to empty string as phoneNumber might not exist on the user type
    showProfile: true
  });
  
  const [isEditing, setIsEditing] = React.useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsEditing(true);
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      showProfile: checked
    }));
    setIsEditing(true);
  };
  
  const handleSave = () => {
    // In a real implementation, we would update the user profile
    // For now, just show a success toast
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
    setIsEditing(false);
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex bg-white">
      {/* Left sidebar */}
      <div className="w-[230px] border-r h-[calc(100vh-64px)] pt-6 flex flex-col bg-white shadow-sm">
        {/* Profile info */}
        <div className="px-6 pb-6 mb-4 border-b flex flex-col items-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src="" alt={user?.fullName || "User"} />
            <AvatarFallback className="bg-gray-200 text-gray-700 text-xl font-medium">
              {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <h2 className="font-bold text-lg">{user?.fullName || user?.username}</h2>
          <p className="text-gray-500 text-sm">@{user?.username}</p>
        </div>
        
        {/* Menu */}
        <div className="px-3 flex-1">
          <ProfileMenuItem
            icon={<UserCircle size={18} />}
            label="General"
            href="/profile"
            active={location === "/profile"}
            className="bg-gray-100 text-[#09261E] font-medium"
          />
          <ProfileMenuItem
            icon={<LinkIcon size={18} />}
            label="Connected accounts"
            href="/profile/connected-accounts"
            active={location === "/profile/connected-accounts"}
          />
          <ProfileMenuItem
            icon={<Shield size={18} />}
            label="Security & Privacy"
            href="/profile/security"
            active={location === "/profile/security"}
          />
          <ProfileMenuItem
            icon={<CreditCard size={18} />}
            label="Payment methods"
            href="/profile/payment"
            active={location === "/profile/payment"}
          />
          <ProfileMenuItem
            icon={<BarChart size={18} />}
            label="Balance"
            href="/profile/balance"
            active={location === "/profile/balance"}
          />
          <ProfileMenuItem
            icon={<ClipboardList size={18} />}
            label="Billing history"
            href="/profile/billing"
            active={location === "/profile/billing"}
          />
          <ProfileMenuItem
            icon={<Settings size={18} />}
            label="Memberships"
            href="/profile/memberships"
            active={location === "/profile/memberships"}
          />
          <ProfileMenuItem
            icon={<Settings size={18} />}
            label="Resolution center"
            href="/profile/resolution"
            active={location === "/profile/resolution"}
          />
          <ProfileMenuItem
            icon={<AlertTriangle size={18} />}
            label="Danger zone"
            href="/profile/danger"
            active={location === "/profile/danger"}
          />
        </div>
        
        {/* Logout */}
        <div className="mt-auto px-3 pb-5">
          <button
            className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-red-500 hover:bg-gray-50 hover:text-red-700 w-full"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-2.5 text-red-500/70" />
            <span>Log out</span>
          </button>
        </div>
      </div>
      
      {/* Right content */}
      <div className="flex-1 bg-gray-50/60 p-10">
        <div className="max-w-3xl bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h1 className="text-xl font-bold mb-6 text-gray-900">Account settings</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Name</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="max-w-md border border-gray-300 focus-visible:ring-[#09261E]/30"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Bio</label>
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="max-w-md h-24 border border-gray-300 focus-visible:ring-[#09261E]/30"
                placeholder="No bio"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Username</label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="max-w-md border border-gray-300 focus-visible:ring-[#09261E]/30"
                placeholder="Username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
              <div className="flex max-w-md items-center">
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 focus-visible:ring-[#09261E]/30"
                  placeholder="Your email address"
                  readOnly
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 text-blue-500"
                  type="button"
                  onClick={() => {
                    toast({
                      title: "Change email",
                      description: "This feature is not available yet.",
                    });
                  }}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Phone number</label>
              <div className="flex max-w-md items-center">
                <div className="flex flex-1 items-center border border-gray-300 rounded-md overflow-hidden">
                  <div className="flex items-center px-3 py-2 bg-gray-50 border-r border-gray-300">
                    <span className="text-sm mr-1">🇺🇸</span>
                    <span className="text-xs text-gray-500">+1</span>
                  </div>
                  <Input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="No phone number set"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 text-blue-500"
                  type="button"
                  onClick={() => {
                    toast({
                      title: "Change phone number",
                      description: "This feature is not available yet.",
                    });
                  }}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1.5">We'll use this for important account updates and notifications.</p>
            </div>
            
            <div className="pt-6 mt-2 border-t">
              <h3 className="font-medium mb-2 text-gray-800">What can people see in your profile?</h3>
              <p className="text-sm text-gray-500 mb-4">Anything you hide here won't be visible to others—and you won't see it on their profiles either.</p>
              
              <div className="flex items-center justify-between py-2">
                <div className="text-sm text-gray-700">Joined PropertyDeals</div>
                <Switch
                  checked={formData.showProfile}
                  onCheckedChange={handleSwitchChange}
                  className="data-[state=checked]:bg-[#09261E]"
                />
              </div>
            </div>
            
            <div className="pt-6 mt-2">
              <Button
                disabled={!isEditing}
                onClick={handleSave}
                className="bg-[#09261E] hover:bg-[#09261E]/90 text-white"
              >
                Save changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}