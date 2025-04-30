import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Settings, User, Bell, CreditCard, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

interface UserFormData {
  fullName: string;
  username: string;
  bio: string;
  phone: string;
}

interface NotificationSettings {
  emailUpdates: boolean;
  dmAlerts: boolean;
  propertyAlerts: boolean;
}

export default function ProfileSettingsPage() {
  const { user, supabaseUser } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  
  // Form state
  const [formData, setFormData] = useState<UserFormData>({
    fullName: user?.fullName || "",
    username: user?.username || "",
    bio: "",
    phone: "",
  });
  
  // Track if form has been modified
  const [isFormModified, setIsFormModified] = useState(false);
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailUpdates: true,
    dmAlerts: true,
    propertyAlerts: false,
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setIsFormModified(true);
  };

  // Handle notification settings changes
  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key],
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would save the user data to the backend
    console.log("Saving user data:", formData);
    setIsFormModified(false);
    // Show success message
    alert("Profile updated successfully!");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-lg shadow p-6 mb-6 sticky top-24">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-16 w-16 mb-2">
                <AvatarImage src="" alt={user?.fullName || "User"} />
                <AvatarFallback className="bg-[#09261E] text-white text-lg">
                  {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-medium">{user?.username || "username"}</h3>
              <Link href="/profile" target="_blank">
                <Button variant="link" size="sm" className="text-[#09261E] flex items-center mt-1">
                  <span>Preview Profile</span>
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("general")}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                  activeTab === "general"
                    ? "bg-[#09261E] text-white font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Settings className="h-5 w-5 mr-3" />
                <span>General</span>
              </button>
              
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                  activeTab === "notifications"
                    ? "bg-[#09261E] text-white font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Bell className="h-5 w-5 mr-3" />
                <span>Notifications</span>
              </button>
              
              <button
                onClick={() => setActiveTab("membership")}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                  activeTab === "membership"
                    ? "bg-[#09261E] text-white font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <CreditCard className="h-5 w-5 mr-3" />
                <span>Membership</span>
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow">
          {activeTab === "general" && (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-[#09261E] mb-6">Account Settings</h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Name</Label>
                    <Input 
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself"
                      className="mt-1 resize-none h-24"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Your username"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      value={user?.email || supabaseUser?.email || ""}
                      disabled
                      className="mt-1 bg-gray-50"
                    />
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed at this time</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your phone number"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="bg-[#09261E] hover:bg-[#09261E]/90"
                    disabled={!isFormModified}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === "notifications" && (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-[#09261E] mb-6">Notification Settings</h1>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Email Updates</h3>
                    <p className="text-gray-500 text-sm">Receive updates about PropertyDeals via email</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.emailUpdates}
                    onCheckedChange={() => handleNotificationChange('emailUpdates')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">DM Alerts</h3>
                    <p className="text-gray-500 text-sm">Get notified when you receive direct messages</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.dmAlerts}
                    onCheckedChange={() => handleNotificationChange('dmAlerts')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">New Property Alerts</h3>
                    <p className="text-gray-500 text-sm">Receive notifications when new properties match your criteria</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.propertyAlerts}
                    onCheckedChange={() => handleNotificationChange('propertyAlerts')}
                  />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "membership" && (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-[#09261E] mb-6">Membership</h1>
              
              <Card className="mb-8">
                <CardHeader className="pb-2">
                  <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-semibold">Free</p>
                      <p className="text-sm text-gray-500">Basic access to PropertyDeals</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-[#09261E]/10 text-[#09261E] text-sm font-medium">
                      Active
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <h2 className="text-xl font-semibold mb-4">Available Upgrades</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="opacity-75 cursor-not-allowed">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span>Premium Buyer</span>
                      <span className="text-[#09261E] text-sm">$19.99/mo</span>
                    </CardTitle>
                    <CardDescription>Unlock exclusive off-market properties</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button disabled className="w-full bg-[#09261E] hover:bg-[#09261E]/90">Upgrade</Button>
                  </CardContent>
                </Card>
                
                <Card className="opacity-75 cursor-not-allowed">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span>Premium REP</span>
                      <span className="text-[#803344] text-sm">$49.99/mo</span>
                    </CardTitle>
                    <CardDescription>Showcase your properties and get more leads</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button disabled className="w-full bg-[#803344] hover:bg-[#803344]/90">Upgrade</Button>
                  </CardContent>
                </Card>
                
                <Card className="opacity-75 cursor-not-allowed md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span>Premium Seller</span>
                      <span className="text-[#135341] text-sm">$29.99/mo</span>
                    </CardTitle>
                    <CardDescription>List unlimited properties and access premium tools</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button disabled className="w-full bg-[#135341] hover:bg-[#135341]/90">Upgrade</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}