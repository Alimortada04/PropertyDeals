import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  Flag, 
  Home, 
  MessageCircle, 
  ArrowUpRight, 
  ShieldAlert
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { getQueryFn } from "@/lib/queryClient";

export default function AdminDashboard() {
  // Fetch admin dashboard stats
  const { data: userStats, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["/api/admin/stats/users"],
    queryFn: getQueryFn(),
  });

  const { data: propertyStats, isLoading: isLoadingProperties } = useQuery({
    queryKey: ["/api/admin/stats/properties"],
    queryFn: getQueryFn(),
  });

  const { data: approvalStats, isLoading: isLoadingApprovals } = useQuery({
    queryKey: ["/api/admin/stats/approvals"],
    queryFn: getQueryFn(),
  });

  const { data: reportStats, isLoading: isLoadingReports } = useQuery({
    queryKey: ["/api/admin/stats/reports"],
    queryFn: getQueryFn(),
  });

  // While we implement the API endpoints, we'll use dummy data for the UI
  const stats = {
    users: {
      total: userStats?.total || 0,
      newToday: userStats?.newToday || 0,
      activeThisWeek: userStats?.activeThisWeek || 0,
    },
    properties: {
      total: propertyStats?.total || 0,
      listed: propertyStats?.listed || 0,
      pending: propertyStats?.pending || 0,
      sold: propertyStats?.sold || 0,
    },
    approvals: {
      pending: approvalStats?.pending || 0,
      approved: approvalStats?.approved || 0,
      rejected: approvalStats?.rejected || 0,
    },
    reports: {
      total: reportStats?.total || 0,
      pending: reportStats?.pending || 0,
      resolved: reportStats?.resolved || 0,
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of system metrics and recent activity
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Users Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.total}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.users.newToday} today
            </p>
          </CardContent>
        </Card>

        {/* Properties Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listed Properties</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.properties.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.properties.pending} pending approval
            </p>
          </CardContent>
        </Card>

        {/* Pending Approvals Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvals.pending}</div>
            <p className="text-xs text-muted-foreground">
              {stats.approvals.approved} approved this week
            </p>
          </CardContent>
        </Card>

        {/* Reports Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reports</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reports.pending}</div>
            <p className="text-xs text-muted-foreground">
              {stats.reports.resolved} resolved this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Tabs defaultValue="recent-activities" className="col-span-2">
          <TabsList>
            <TabsTrigger value="recent-activities">Recent Activities</TabsTrigger>
            <TabsTrigger value="system-notifications">System Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="recent-activities">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Latest actions performed in the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="rounded-md bg-slate-100 p-3">
                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5">
                      <Users className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New user registered</p>
                      <p className="text-xs text-slate-500">10 minutes ago</p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md bg-slate-100 p-3">
                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5">
                      <ShieldAlert className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Role approval request</p>
                      <p className="text-xs text-slate-500">25 minutes ago</p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md bg-slate-100 p-3">
                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5">
                      <Home className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New property listed</p>
                      <p className="text-xs text-slate-500">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground cursor-pointer flex items-center">
                  View all activities
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="system-notifications">
            <Card>
              <CardHeader>
                <CardTitle>System Notifications</CardTitle>
                <CardDescription>
                  Important alerts and system messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="rounded-md bg-amber-50 p-3 border border-amber-200">
                  <p className="text-sm font-medium text-amber-800">
                    5 pending user approvals require attention
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Users awaiting role approval for more than 24 hours
                  </p>
                </div>
                
                <div className="rounded-md bg-red-50 p-3 border border-red-200">
                  <p className="text-sm font-medium text-red-800">
                    3 content reports flagged as urgent
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    Reports for potentially inappropriate content
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>
              Current system status and metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">Server Status</p>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Operational</span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">Database Status</p>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Operational</span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">API Response Time</p>
                <span className="text-xs">245ms (avg)</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Last Deployment</p>
                <span className="text-xs">April 28, 2025</span>
              </div>
            </div>
            
            <div className="pt-2 border-t border-slate-200">
              <p className="text-sm font-medium mb-2">Uptime: 99.98%</p>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "99.98%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}