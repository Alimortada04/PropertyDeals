import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Redirect } from "wouter";
import { 
  UserCircle, 
  Shield, 
  Clock, 
  Home, 
  MailCheck, 
  BanIcon, 
  CheckCircle,
  XCircle,
  ChevronLeft,
  Save,
  AlertCircle
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AdminUserDetailsProps {
  id: string;
}

export default function AdminUserDetails({ id }: AdminUserDetailsProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  
  // Fetch user details
  const { data: user, isLoading, error } = useQuery({
    queryKey: [`/api/admin/users/${id}`],
    queryFn: getQueryFn(),
  });
  
  // Fetch user's activity logs
  const { data: activityLogs } = useQuery({
    queryKey: ["/api/admin/logs", { userId: id }],
    queryFn: getQueryFn(),
    enabled: activeTab === "activity",
  });
  
  // Fetch user's properties
  const { data: userProperties } = useQuery({
    queryKey: ["/api/admin/users/${id}/properties"],
    queryFn: getQueryFn(),
    enabled: activeTab === "properties",
  });
  
  const updateUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const res = await apiRequest("PUT", `/api/admin/users/${id}`, userData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/users/${id}`] });
      toast({
        title: "User updated",
        description: "User information has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating user",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const approveRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      const res = await apiRequest("POST", `/api/admin/approvals/${id}/approve/${role}`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/users/${id}`] });
      toast({
        title: "Role approved",
        description: "User role has been approved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error approving role",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const denyRoleMutation = useMutation({
    mutationFn: async ({ role, notes }: { role: string; notes: string }) => {
      const res = await apiRequest("POST", `/api/admin/approvals/${id}/deny/${role}`, { notes });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/users/${id}`] });
      toast({
        title: "Role denied",
        description: "User role has been denied.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error denying role",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const toggleAdminStatus = () => {
    if (!user) return;
    
    updateUserMutation.mutate({
      isAdmin: !user.isAdmin,
    });
  };
  
  const updateUserStatus = (isActive: boolean) => {
    if (!user) return;
    
    updateUserMutation.mutate({
      isActive,
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg text-gray-500">Loading user details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">User not found</h3>
          <p className="text-gray-500 mb-6">The user you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };
  
  const hasPendingRoles = user.roles && Object.values(user.roles).some(
    (role: any) => role.status === "pending"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2" 
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
            <p className="text-muted-foreground">
              View and manage user information
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {hasPendingRoles && (
            <Badge className="bg-yellow-500">Pending Approval</Badge>
          )}
          {user.isAdmin && (
            <Badge className="bg-[#09261E]">Administrator</Badge>
          )}
          <Badge variant={user.isActive ? "default" : "outline"}>
            {user.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* User info sidebar */}
        <div className="col-span-12 md:col-span-4 space-y-4">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-slate-100 p-2 rounded-full w-20 h-20 flex items-center justify-center mb-2">
                <UserCircle className="h-12 w-12 text-slate-600" />
              </div>
              <CardTitle className="text-xl">{user.fullName || user.username}</CardTitle>
              <CardDescription className="flex justify-center items-center gap-1">
                <span>User ID: {user.id}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Email</Label>
                <div className="font-medium">{user.email}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Username</Label>
                <div className="font-medium">{user.username}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Joined</Label>
                <div className="font-medium">{formatDate(user.createdAt)}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Last Login</Label>
                <div className="font-medium">{user.lastLogin ? formatDate(user.lastLogin) : "Never"}</div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex items-center justify-between w-full">
                <Label htmlFor="admin-status" className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-slate-600" />
                  Admin Status
                </Label>
                <Switch
                  id="admin-status"
                  checked={user.isAdmin || false}
                  onCheckedChange={toggleAdminStatus}
                  disabled={updateUserMutation.isPending}
                />
              </div>
              
              <div className="flex items-center justify-between w-full">
                <Label htmlFor="user-status" className="flex items-center gap-1">
                  <BanIcon className="h-4 w-4 text-slate-600" />
                  Account Status
                </Label>
                <Switch
                  id="user-status"
                  checked={user.isActive || false}
                  onCheckedChange={updateUserStatus}
                  disabled={updateUserMutation.isPending}
                />
              </div>
            </CardFooter>
          </Card>
          
          {/* Role approvals card */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                <div className="flex justify-between items-center">
                  <span>Role Applications</span>
                  {hasPendingRoles && (
                    <Badge className="bg-yellow-500">Action Required</Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {user.roles && Object.entries(user.roles).map(([roleName, roleData]: [string, any]) => (
                  <div key={roleName} className="px-6 py-4">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-medium capitalize">{roleName} Role</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          roleData.status === "approved" ? "border-green-200 bg-green-50 text-green-700" : 
                          roleData.status === "pending" ? "border-yellow-200 bg-yellow-50 text-yellow-700" :
                          roleData.status === "denied" ? "border-red-200 bg-red-50 text-red-700" :
                          "border-gray-200 bg-gray-50 text-gray-700"
                        }`}
                      >
                        {roleData.status}
                      </Badge>
                    </div>
                    
                    {roleData.status === "pending" && (
                      <div className="mt-3 flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => approveRoleMutation.mutate(roleName)}
                          disabled={approveRoleMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={denyRoleMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Deny
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Deny {roleName} Role</DialogTitle>
                              <DialogDescription>
                                Provide a reason for denying this role application. The user will be able to see this message.
                              </DialogDescription>
                            </DialogHeader>
                            <Textarea 
                              placeholder="Reason for denial..." 
                              className="min-h-[100px]"
                              id="denial-notes"
                            />
                            <DialogFooter>
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  const notes = (document.getElementById("denial-notes") as HTMLTextAreaElement).value;
                                  denyRoleMutation.mutate({ role: roleName, notes });
                                }}
                                disabled={denyRoleMutation.isPending}
                              >
                                Confirm Denial
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                    
                    {roleData.status === "approved" && (
                      <div className="text-xs text-gray-500 mt-1">
                        Approved on {formatDate(roleData.approvedAt)}
                      </div>
                    )}
                    
                    {roleData.status === "denied" && (
                      <div className="mt-1">
                        <div className="text-xs text-gray-500">
                          Denied on {formatDate(roleData.deniedAt)}
                        </div>
                        {roleData.notes && (
                          <div className="mt-1 text-xs bg-gray-50 p-2 rounded border border-gray-100">
                            <span className="font-medium">Reason:</span> {roleData.notes}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content area */}
        <div className="col-span-12 md:col-span-8">
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    View and update user profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        defaultValue={user.fullName || ""} 
                        placeholder="Full Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        defaultValue={user.email || ""} 
                        placeholder="Email Address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        defaultValue={user.username || ""} 
                        placeholder="Username"
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">Username cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input 
                        id="phoneNumber" 
                        defaultValue={user.phoneNumber || ""} 
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Admin Notes</Label>
                    <Textarea 
                      id="notes" 
                      defaultValue={user.adminNotes || ""} 
                      placeholder="Private notes about this user (only visible to admins)"
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button disabled={updateUserMutation.isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>
                    Recent actions and system events related to this user
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {!activityLogs?.logs?.length ? (
                      <div className="text-center py-6">
                        <Clock className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">No activity logs found for this user</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {activityLogs.logs.map((log: any) => (
                          <div key={log.id} className="bg-slate-50 p-3 rounded-md border border-slate-100">
                            <div className="flex items-start">
                              <div className="mr-3 mt-0.5">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                                  <Clock className="h-4 w-4 text-slate-600" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">{log.action}</div>
                                <div className="text-xs text-gray-500">{formatDate(log.timestamp)}</div>
                                {log.details && (
                                  <div className="mt-1 text-xs text-gray-600 bg-slate-100 p-2 rounded">
                                    <pre className="whitespace-pre-wrap">{JSON.stringify(log.details, null, 2)}</pre>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="properties" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Properties</CardTitle>
                  <CardDescription>
                    Properties listed by this user
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!userProperties?.length ? (
                    <div className="text-center py-6">
                      <Home className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No properties found for this user</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userProperties.map((property: any) => (
                        <Card key={property.id} className="overflow-hidden">
                          {property.imageUrl && (
                            <div className="h-40 overflow-hidden">
                              <img 
                                src={property.imageUrl} 
                                alt={property.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <CardContent className="p-4">
                            <h3 className="text-lg font-medium">{property.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{property.address}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="font-medium">${property.price.toLocaleString()}</span>
                              <Badge>{property.status}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}