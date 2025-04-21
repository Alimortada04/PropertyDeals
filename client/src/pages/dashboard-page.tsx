import React, { useState } from 'react';
import { Home, Building, Users } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import BuyerDashboard from '@/components/dashboard/BuyerDashboard';
import SellerDashboard from '@/components/dashboard/SellerDashboard';
import RepDashboard from '@/components/dashboard/RepDashboard';

// Mock user data
const mockUser = {
  name: "Ali",
  activeRole: "buyer", // can be 'buyer', 'seller', or 'rep'
  roles: {
    buyer: { status: "approved" },
    seller: { status: "pending" },
    rep: { status: "not_applied" }
  }
};

// Status badge colors
const statusColors = {
  approved: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  not_applied: "bg-gray-100 text-gray-800 border-gray-200"
};

// Role specific colors
const roleColors = {
  buyer: "bg-[#09261E] hover:bg-[#09261E]/90 text-white",
  seller: "bg-[#135341] hover:bg-[#135341]/90 text-white", 
  rep: "bg-[#803344] hover:bg-[#803344]/90 text-white"
};

// Role icons
const roleIcons = {
  buyer: <Home className="h-4 w-4 mr-2" />,
  seller: <Building className="h-4 w-4 mr-2" />,
  rep: <Users className="h-4 w-4 mr-2" />
};

export default function DashboardPage() {
  const [user, setUser] = useState(mockUser);
  const [activeTab, setActiveTab] = useState<string>(user.activeRole);

  // Function to switch roles
  const handleRoleSwitch = (role: string) => {
    // Only allow switching to approved roles
    if (user.roles[role]?.status === "approved") {
      setUser({
        ...user,
        activeRole: role
      });
      setActiveTab(role);
    }
  };

  // Function to apply for a role
  const handleApplyForRole = (role: string) => {
    // In a real app, this would make an API call
    alert(`Applied for ${role} role. Status is now pending.`);
    
    // Update the local state to show pending status
    const updatedRoles = {
      ...user.roles,
      [role]: { status: "pending" }
    };
    
    setUser({
      ...user,
      roles: updatedRoles
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name}
            </p>
          </div>
          <Badge 
            className={`${
              user.activeRole === "buyer" ? "bg-[#09261E] hover:bg-[#09261E]/90" : 
              user.activeRole === "seller" ? "bg-[#135341] hover:bg-[#135341]/90" : 
              "bg-[#803344] hover:bg-[#803344]/90"
            } text-white capitalize px-3 py-1 text-sm`}
          >
            {user.activeRole} Mode
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Role Switcher */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Role Selector</CardTitle>
              <CardDescription>Switch between your available roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(user.roles).map(([role, { status }]) => (
                <div key={role} className="flex items-center justify-between pb-4 last:pb-0 last:mb-0 last:border-0">
                  <div className="flex items-center">
                    {roleIcons[role]}
                    <div className="ml-2">
                      <p className="text-sm font-medium capitalize">{role}</p>
                      <Badge variant="outline" className={statusColors[status]}>
                        {status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    {status === "approved" ? (
                      <Button 
                        size="sm" 
                        variant={user.activeRole === role ? "default" : "outline"}
                        className={user.activeRole === role ? roleColors[role] : ""}
                        onClick={() => handleRoleSwitch(role)}
                        disabled={user.activeRole === role}
                      >
                        {user.activeRole === role ? "Active" : "Switch"}
                      </Button>
                    ) : status === "not_applied" ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleApplyForRole(role)}
                      >
                        Apply
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled
                      >
                        {status}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Dashboard Content */}
          <div className="md:col-span-9">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger 
                  value="buyer" 
                  disabled={user.roles.buyer.status !== "approved"}
                  onClick={() => handleRoleSwitch("buyer")}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Buyer
                </TabsTrigger>
                <TabsTrigger 
                  value="seller" 
                  disabled={user.roles.seller.status !== "approved"}
                  onClick={() => handleRoleSwitch("seller")}
                >
                  <Building className="h-4 w-4 mr-2" />
                  Seller
                </TabsTrigger>
                <TabsTrigger 
                  value="rep" 
                  disabled={user.roles.rep.status !== "approved"}
                  onClick={() => handleRoleSwitch("rep")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  REP
                </TabsTrigger>
              </TabsList>

              <TabsContent value="buyer">
                {user.roles.buyer.status === "approved" ? (
                  <BuyerDashboard />
                ) : (
                  <Alert>
                    <AlertTitle>Role not active</AlertTitle>
                    <AlertDescription>
                      This role is {user.roles.buyer.status}. {user.roles.buyer.status === "pending" ? "Your application is being reviewed." : "Apply to activate this role."}
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="seller">
                {user.roles.seller.status === "approved" ? (
                  <SellerDashboard />
                ) : (
                  <Alert>
                    <AlertTitle>Role not active</AlertTitle>
                    <AlertDescription>
                      This role is {user.roles.seller.status}. {user.roles.seller.status === "pending" ? "Your application is being reviewed." : "Apply to activate this role."}
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="rep">
                {user.roles.rep.status === "approved" ? (
                  <RepDashboard />
                ) : (
                  <Alert>
                    <AlertTitle>Role not active</AlertTitle>
                    <AlertDescription>
                      This role is {user.roles.rep.status}. {user.roles.rep.status === "pending" ? "Your application is being reviewed." : "Apply to activate this role."}
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}