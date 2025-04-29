import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Clock, 
  Calendar, 
  Search, 
  Download, 
  Filter,
  AlertCircle,
  Shield,
  User,
  MousePointerClick, 
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { getQueryFn } from "@/lib/queryClient";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function AdminLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const limit = 15;
  
  // Fetch system logs
  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/logs", { 
      action: actionFilter,
      fromDate: fromDate ? format(fromDate, "yyyy-MM-dd") : undefined,
      toDate: toDate ? format(toDate, "yyyy-MM-dd") : undefined,
      limit,
      offset: (page - 1) * limit,
      sortBy,
      sortDirection
    }],
    queryFn: getQueryFn(),
  });
  
  const logs = data?.logs || [];
  const totalLogs = data?.total || 0;
  const totalPages = Math.ceil(totalLogs / limit);
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };
  
  const getActionIcon = (action: string) => {
    if (action.includes("login") || action.includes("auth")) {
      return <User className="h-4 w-4" />;
    } else if (action.includes("admin") || action.includes("approve") || action.includes("deny")) {
      return <Shield className="h-4 w-4" />;
    } else if (action.includes("error") || action.includes("fail")) {
      return <AlertCircle className="h-4 w-4" />;
    } else {
      return <MousePointerClick className="h-4 w-4" />;
    }
  };
  
  const clearFilters = () => {
    setSearchQuery("");
    setActionFilter("");
    setFromDate(undefined);
    setToDate(undefined);
    setPage(1);
  };
  
  const hasActiveFilters = searchQuery || actionFilter || fromDate || toDate;
  
  // Sample filter actions - to be replaced with actual data from the API
  const filterActions = [
    "user_login",
    "user_logout",
    "view_user_details",
    "update_user",
    "approve_role",
    "deny_role",
    "create_property",
    "update_property",
    "delete_property",
    "view_system_logs"
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground">
            Monitor and analyze system activity and events
          </p>
        </div>
        
        <Button variant="outline" size="sm" className="hidden md:flex">
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Activity Logs</CardTitle>
          <CardDescription>
            System logs showing user and admin actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search logs..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All actions</SelectItem>
                {filterActions.map(action => (
                  <SelectItem key={action} value={action}>{action.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <Calendar className="mr-2 h-4 w-4" />
                  {fromDate && toDate ? `${format(fromDate, "MMM d")} - ${format(toDate, "MMM d")}` : 
                   fromDate ? `From ${format(fromDate, "MMM d")}` :
                   toDate ? `Until ${format(toDate, "MMM d")}` : "Date range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-3 flex flex-col gap-2">
                  <div className="grid gap-2">
                    <div className="text-sm font-medium">From</div>
                    <CalendarComponent
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="text-sm font-medium">To</div>
                    <CalendarComponent
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      initialFocus
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setFromDate(undefined);
                        setToDate(undefined);
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="w-full md:w-auto"
              >
                Clear Filters
              </Button>
            )}
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("action")}
                      className="flex items-center p-0 font-medium"
                    >
                      Action
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("timestamp")}
                      className="flex items-center p-0 font-medium"
                    >
                      Timestamp
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-[100px]">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading system logs...
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Clock className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="mb-1">No logs found</p>
                        <p className="text-sm text-gray-400">
                          {hasActiveFilters ? "Try adjusting your filters" : "System logs will appear here"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log: any) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            {getActionIcon(log.action)}
                          </Badge>
                          <span className="capitalize">{log.action.replace(/_/g, ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.user ? (
                          <div>
                            <div className="font-medium">{log.user.username || `User #${log.userId}`}</div>
                            <div className="text-xs text-muted-foreground">ID: {log.userId}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">System</span>
                        )}
                      </TableCell>
                      <TableCell>{log.ipAddress || "N/A"}</TableCell>
                      <TableCell>{formatDate(log.timestamp)}</TableCell>
                      <TableCell>
                        {log.details ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Details
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[300px]">
                              <div className="p-2 max-h-[300px] overflow-auto">
                                <pre className="text-xs whitespace-pre-wrap">
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                              </div>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <span className="text-muted-foreground text-sm">None</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        
        {totalPages > 1 && (
          <CardFooter className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1}-
              {Math.min(page * limit, totalLogs)} of {totalLogs} logs
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}