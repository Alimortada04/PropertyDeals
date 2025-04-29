import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Filter,
  Search,
  UserCheck,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminApprovals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch pending approvals
  const { data: pendingUsers, isLoading } = useQuery({
    queryKey: ["/api/admin/approvals"],
    queryFn: getQueryFn(),
  });
  
  const approveRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: string }) => {
      const res = await apiRequest("POST", `/api/admin/approvals/${userId}/approve/${role}`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/approvals"] });
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
    mutationFn: async ({ userId, role, notes }: { userId: number; role: string; notes: string }) => {
      const res = await apiRequest("POST", `/api/admin/approvals/${userId}/deny/${role}`, { notes });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/approvals"] });
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
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };
  
  const getPendingRoles = (user: any) => {
    if (!user.roles) return [];
    
    return Object.entries(user.roles)
      .filter(([_, data]: [string, any]) => data.status === "pending")
      .map(([role, data]: [string, any]) => ({
        role,
        appliedAt: data.appliedAt,
      }));
  };
  
  // Filter users based on search query and role filter
  const filteredUsers = React.useMemo(() => {
    if (!pendingUsers) return [];
    
    return pendingUsers.filter((user: any) => {
      const matchesSearch = !searchQuery || 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const pendingRoles = getPendingRoles(user);
      const matchesRoleFilter = !roleFilter || pendingRoles.some(r => r.role === roleFilter);
      
      return matchesSearch && matchesRoleFilter;
    });
  }, [pendingUsers, searchQuery, roleFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Role Approvals</h1>
          <p className="text-muted-foreground">
            Manage user role approval requests
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>
            Users waiting for role approval and verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4 flex-col md:flex-row gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  {roleFilter ? `Filter: ${roleFilter}` : "Filter by role"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem onClick={() => setRoleFilter(null)}>
                  All Roles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("buyer")}>
                  Buyer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("seller")}>
                  Seller
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("rep")}>
                  REP
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Applied At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading pending approvals...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <UserCheck className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="mb-1">No pending approvals found</p>
                        <p className="text-sm text-gray-400">
                          {searchQuery || roleFilter ? "Try adjusting your filters" : "All caught up!"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.flatMap((user: any) => {
                    const pendingRoles = getPendingRoles(user);
                    
                    return pendingRoles.map((pendingRole) => (
                      <TableRow key={`${user.id}-${pendingRole.role}`}>
                        <TableCell>
                          <div className="font-medium">{user.fullName || user.username}</div>
                          <div className="text-xs text-muted-foreground">ID: {user.id}</div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {pendingRole.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(pendingRole.appliedAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              size="sm"
                              variant="ghost"
                              onClick={() => approveRoleMutation.mutate({ userId: user.id, role: pendingRole.role })}
                              disabled={approveRoleMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="sr-only">Approve</span>
                            </Button>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm"
                                  variant="ghost"
                                  disabled={denyRoleMutation.isPending}
                                >
                                  <XCircle className="h-4 w-4 text-red-500" />
                                  <span className="sr-only">Deny</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Deny {pendingRole.role} Role for {user.fullName || user.username}</DialogTitle>
                                  <DialogDescription>
                                    Provide a reason for denying this role application. The user will be able to see this message.
                                  </DialogDescription>
                                </DialogHeader>
                                <Textarea 
                                  placeholder="Reason for denial..." 
                                  className="min-h-[100px]"
                                  id={`denial-notes-${user.id}-${pendingRole.role}`}
                                />
                                <DialogFooter>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => {
                                      const notesElem = document.getElementById(`denial-notes-${user.id}-${pendingRole.role}`) as HTMLTextAreaElement;
                                      denyRoleMutation.mutate({ 
                                        userId: user.id, 
                                        role: pendingRole.role, 
                                        notes: notesElem.value 
                                      });
                                    }}
                                    disabled={denyRoleMutation.isPending}
                                  >
                                    Confirm Denial
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            <Link href={`/admin/users/${user.id}`}>
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-4 w-4 text-gray-500" />
                                <span className="sr-only">View User</span>
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ));
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}