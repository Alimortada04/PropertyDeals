import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  Flag, 
  Filter, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock,
  ExternalLink, 
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Home,
  User,
  ArrowUpDown,
  Eye
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminReports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const limit = 10;
  const { toast } = useToast();
  
  // Fetch reports
  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/reports", { 
      status: statusFilter,
      contentType: contentTypeFilter,
      limit,
      offset: (page - 1) * limit,
      sortBy,
      sortDirection
    }],
    queryFn: getQueryFn(),
  });
  
  const reports = data?.reports || [];
  const totalReports = data?.total || 0;
  const totalPages = Math.ceil(totalReports / limit);
  
  const updateReportMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes?: string }) => {
      const res = await apiRequest("PUT", `/api/admin/reports/${id}`, { status, notes });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reports"] });
      setSelectedReport(null);
      toast({
        title: "Report updated",
        description: "Report status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating report",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
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
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "reviewed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Reviewed</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolved</Badge>;
      case "dismissed":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Dismissed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case "property":
        return <Home className="h-4 w-4" />;
      case "user":
        return <User className="h-4 w-4" />;
      case "message":
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <Flag className="h-4 w-4" />;
    }
  };
  
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setContentTypeFilter("");
    setPage(1);
  };
  
  const hasActiveFilters = searchQuery || statusFilter || contentTypeFilter;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Manage user-submitted reports and content flags
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Content Reports</CardTitle>
          <CardDescription>
            User-submitted reports about platform content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search reports..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by content" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All content types</SelectItem>
                <SelectItem value="property">Property</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="message">Message</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            
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
                  <TableHead className="w-[60px]">ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("createdAt")}
                      className="flex items-center p-0 font-medium"
                    >
                      Reported On
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading reports...
                    </TableCell>
                  </TableRow>
                ) : reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Flag className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="mb-1">No reports found</p>
                        <p className="text-sm text-gray-400">
                          {hasActiveFilters ? "Try adjusting your filters" : "All caught up!"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report: any) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize flex items-center gap-1">
                            {getContentTypeIcon(report.contentType)}
                            {report.contentType}
                          </Badge>
                          <span className="text-xs text-muted-foreground">#{report.contentId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="truncate max-w-[200px]" title={report.reason}>
                          {report.reason}
                        </div>
                      </TableCell>
                      <TableCell>
                        {report.reporter ? (
                          <div>
                            <div className="font-medium truncate max-w-[150px]">{report.reporter.username || `User #${report.reporterId}`}</div>
                            <div className="text-xs text-muted-foreground">ID: {report.reporterId}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Anonymous</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(report.createdAt)}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedReport(report)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Report</span>
                          </Button>
                          
                          {report.status === "pending" && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => updateReportMutation.mutate({ id: report.id, status: "reviewed" })}
                              disabled={updateReportMutation.isPending}
                            >
                              <Clock className="h-4 w-4 text-blue-500" />
                              <span className="sr-only">Mark as Reviewed</span>
                            </Button>
                          )}
                          
                          {(report.status === "pending" || report.status === "reviewed") && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => updateReportMutation.mutate({ id: report.id, status: "resolved" })}
                                disabled={updateReportMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="sr-only">Mark as Resolved</span>
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => updateReportMutation.mutate({ id: report.id, status: "dismissed" })}
                                disabled={updateReportMutation.isPending}
                              >
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span className="sr-only">Dismiss Report</span>
                              </Button>
                            </>
                          )}
                        </div>
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
              {Math.min(page * limit, totalReports)} of {totalReports} reports
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
      
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Report Details</DialogTitle>
              <DialogDescription>
                Detailed information about report #{selectedReport.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Report ID</h3>
                  <p className="text-sm">{selectedReport.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Status</h3>
                  <div>{getStatusBadge(selectedReport.status)}</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Content Type</h3>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="capitalize flex items-center gap-1">
                      {getContentTypeIcon(selectedReport.contentType)}
                      {selectedReport.contentType}
                    </Badge>
                    <span className="text-sm">#{selectedReport.contentId}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Reported On</h3>
                  <p className="text-sm">{formatDate(selectedReport.createdAt)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Reporter</h3>
                  <p className="text-sm">
                    {selectedReport.reporter ? 
                      `${selectedReport.reporter.username || `User #${selectedReport.reporterId}`} (ID: ${selectedReport.reporterId})` : 
                      "Anonymous"}
                  </p>
                </div>
                {selectedReport.resolvedAt && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Resolved On</h3>
                    <p className="text-sm">{formatDate(selectedReport.resolvedAt)}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Reason for Report</h3>
                <div className="p-3 bg-gray-50 rounded border text-sm">
                  {selectedReport.reason}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Additional Details</h3>
                <div className="p-3 bg-gray-50 rounded border text-sm">
                  {selectedReport.additionalDetails || "No additional details provided"}
                </div>
              </div>
              
              {selectedReport.notes && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Admin Notes</h3>
                  <div className="p-3 bg-gray-50 rounded border text-sm">
                    {selectedReport.notes}
                  </div>
                </div>
              )}
              
              {(selectedReport.status === "pending" || selectedReport.status === "reviewed") && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Add notes and update status</h3>
                  <Textarea 
                    placeholder="Add admin notes..." 
                    className="mb-3"
                    id="report-admin-notes"
                    defaultValue={selectedReport.notes || ""}
                  />
                  <div className="flex justify-between">
                    <div className="space-x-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const notes = (document.getElementById("report-admin-notes") as HTMLTextAreaElement).value;
                          updateReportMutation.mutate({ id: selectedReport.id, status: "dismissed", notes });
                        }}
                        disabled={updateReportMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-2 text-red-500" />
                        Dismiss
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const notes = (document.getElementById("report-admin-notes") as HTMLTextAreaElement).value;
                          updateReportMutation.mutate({ id: selectedReport.id, status: "reviewed", notes });
                        }}
                        disabled={updateReportMutation.isPending || selectedReport.status === "reviewed"}
                      >
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        Mark as Reviewed
                      </Button>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => {
                        const notes = (document.getElementById("report-admin-notes") as HTMLTextAreaElement).value;
                        updateReportMutation.mutate({ id: selectedReport.id, status: "resolved", notes });
                      }}
                      disabled={updateReportMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resolve
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Link to view reported content */}
              <div className="flex justify-end">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Reported Content
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}