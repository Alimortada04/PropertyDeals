import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2, User as UserIcon, Home, Building, Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserRole, UserRoles, RoleStatus } from "@shared/schema";

const roleColors = {
  buyer: {
    bg: "bg-[#09261E]",
    text: "text-white",
    hover: "hover:bg-[#0f3a2d]",
    border: "border-[#09261E]",
  },
  seller: {
    bg: "bg-[#135341]",
    text: "text-white",
    hover: "hover:bg-[#1c6e56]",
    border: "border-[#135341]",
  },
  rep: {
    bg: "bg-[#803344]",
    text: "text-white",
    hover: "hover:bg-[#9a3e52]",
    border: "border-[#803344]",
  },
};

const roleIcons = {
  buyer: <Home className="w-5 h-5 mr-2" />,
  seller: <Building className="w-5 h-5 mr-2" />,
  rep: <Users className="w-5 h-5 mr-2" />,
};

const roleDescriptions = {
  buyer: "Browse exclusive off-market properties and connect with sellers.",
  seller: "List your properties and manage your listings and inquiries.",
  rep: "Access specialized tools and connect with buyers and sellers.",
};

const statusColors = {
  approved: "bg-green-500",
  pending: "bg-yellow-500",
  denied: "bg-red-500",
  not_applied: "bg-gray-300",
};

const statusText = {
  approved: "Approved",
  pending: "Pending",
  denied: "Denied",
  not_applied: "Not Applied",
};

export default function DashboardPage() {
  const { user, isLoading, switchRoleMutation, applyForRoleMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    if (user) {
      setActiveTab(user.activeRole || "buyer");
    }
  }, [user]);

  const handleSwitchRole = (role: UserRole) => {
    if (!user || !user.roles) return;
    
    const userRoles = user.roles as unknown as UserRoles;
    
    if (userRoles[role].status === "approved") {
      switchRoleMutation.mutate({ role });
    }
  };

  const handleApplyForRole = (role: UserRole) => {
    if (!user) return;
    
    applyForRoleMutation.mutate({ 
      role,
      applicationData: {
        appliedAt: new Date().toISOString(),
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/signin" />;
  }

  const userRoles = user.roles as unknown as UserRoles || {
    buyer: { status: "approved" },
    seller: { status: "not_applied" },
    rep: { status: "not_applied" }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Left sidebar with role switching */}
        <div className="w-full md:w-1/3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center">
                <UserIcon className="w-6 h-6 mr-2" />
                {user.fullName || user.username}
              </CardTitle>
              <CardDescription>
                Current Role: <span className="font-medium">{user.activeRole}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm font-medium mb-2">Switch Roles</div>
              <div className="space-y-3">
                {(["buyer", "seller", "rep"] as UserRole[]).map((role) => (
                  <div key={role} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {roleIcons[role]}
                      <span className="font-medium capitalize">{role}</span>
                      <Badge variant="outline" className={`ml-2 ${statusColors[userRoles[role].status]} text-white`}>
                        {statusText[userRoles[role].status]}
                      </Badge>
                    </div>
                    <div>
                      {userRoles[role].status === "approved" ? (
                        <Button
                          size="sm"
                          variant={user.activeRole === role ? "default" : "outline"}
                          onClick={() => handleSwitchRole(role)}
                          className={user.activeRole === role ? roleColors[role].bg : ""}
                          disabled={user.activeRole === role}
                        >
                          {user.activeRole === role ? "Active" : "Switch"}
                        </Button>
                      ) : userRoles[role].status === "not_applied" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApplyForRole(role)}
                        >
                          Apply
                        </Button>
                      ) : userRoles[role].status === "pending" ? (
                        <Button size="sm" variant="outline" disabled>
                          Pending
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          Denied
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Member Since</span>
                  <span className="font-medium">April 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Properties Viewed</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Inquiries Sent</span>
                  <span className="font-medium">3</span>
                </div>
                {user.activeRole === "seller" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Properties Listed</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Inquiries Received</span>
                      <span className="font-medium">0</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right content area with role-specific content */}
        <div className="w-full md:w-2/3">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <h2 className="text-2xl font-bold">Welcome to Your {user.activeRole} Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {user.activeRole === "buyer" && (
                        <>
                          <Button className="w-full" variant="outline">Browse Properties</Button>
                          <Button className="w-full" variant="outline">Save Search Filters</Button>
                          <Button className="w-full" variant="outline">Connect with REPs</Button>
                        </>
                      )}
                      {user.activeRole === "seller" && (
                        <>
                          <Button className="w-full" variant="outline">Add New Property</Button>
                          <Button className="w-full" variant="outline">View Inquiries</Button>
                          <Button className="w-full" variant="outline">Edit Listings</Button>
                        </>
                      )}
                      {user.activeRole === "rep" && (
                        <>
                          <Button className="w-full" variant="outline">Edit Profile</Button>
                          <Button className="w-full" variant="outline">Manage Clients</Button>
                          <Button className="w-full" variant="outline">Property Analysis</Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500 italic">
                      No recent activity to display.
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Your {user.activeRole} Tools</CardTitle>
                  <CardDescription>{roleDescriptions[user.activeRole as UserRole]}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {user.activeRole === "buyer" && (
                      <>
                        <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                          <Activity className="h-8 w-8 mb-2" />
                          <span>Flip Calculator</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                          <Activity className="h-8 w-8 mb-2" />
                          <span>Mortgage Calculator</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                          <Activity className="h-8 w-8 mb-2" />
                          <span>Saved Properties</span>
                        </Button>
                      </>
                    )}
                    {user.activeRole === "seller" && (
                      <>
                        <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                          <Activity className="h-8 w-8 mb-2" />
                          <span>Property Listings</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                          <Activity className="h-8 w-8 mb-2" />
                          <span>Analytics</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                          <Activity className="h-8 w-8 mb-2" />
                          <span>Inquiries</span>
                        </Button>
                      </>
                    )}
                    {user.activeRole === "rep" && (
                      <>
                        <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                          <Activity className="h-8 w-8 mb-2" />
                          <span>Client Management</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                          <Activity className="h-8 w-8 mb-2" />
                          <span>Deal Tracker</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                          <Activity className="h-8 w-8 mb-2" />
                          <span>Market Analysis</span>
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <h2 className="text-2xl font-bold">Your Activity</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <p>No activity to display yet.</p>
                    <p className="text-sm mt-2">Your recent actions will appear here.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <h2 className="text-2xl font-bold">Account Settings</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Username</label>
                        <div className="mt-1 p-2 border rounded-md bg-gray-50">
                          {user.username}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Full Name</label>
                        <div className="mt-1 p-2 border rounded-md bg-gray-50">
                          {user.fullName || "Not set"}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <div className="mt-1 p-2 border rounded-md bg-gray-50">
                          {user.email || "Not set"}
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button disabled>Edit Profile</Button>
                      <span className="ml-2 text-sm text-gray-500">Coming soon</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}