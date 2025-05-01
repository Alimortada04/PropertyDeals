import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  Home, 
  CheckSquare,
  UserPlus,
  Activity as ActivityIcon,
  FileText,
  Search,
  ChevronRight
} from "lucide-react";

interface Activity {
  id: string;
  type: 'post' | 'comment' | 'deal_posted' | 'deal_closed' | 'joined' | 'connection';
  content?: string;
  timestamp: string;
  dealId?: number;
  dealTitle?: string;
  dealPrice?: number;
  threadId?: string;
  threadTitle?: string;
  connectionId?: number;
  connectionName?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showAllActivitiesDialog, setShowAllActivitiesDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  if (!activities || activities.length === 0) {
    return (
      <div id="activity" className="my-8 scroll-mt-24">
        <h2 className="text-2xl font-bold text-[#09261E] mb-4">
          Activity <span className="text-base font-normal text-gray-500">(0)</span>
        </h2>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
          <ActivityIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No activity yet</h3>
          <p className="text-gray-500 mt-1">This REP hasn't posted any activity updates yet. Check back soon!</p>
        </div>
      </div>
    );
  }
  
  // Filter activities based on active tab and search query
  const filteredActivities = activities.filter(activity => {
    // Filter by tab first
    const passesTabFilter = activeTab === "all" ? true : (
      activeTab === "posts" ? activity.type === "post" :
      activeTab === "deals" ? (activity.type === "deal_posted" || activity.type === "deal_closed") :
      activeTab === "comments" ? activity.type === "comment" : true
    );
    
    // Then filter by search query if one exists
    if (!passesTabFilter) return false;
    if (!searchQuery) return true;
    
    const lowerQuery = searchQuery.toLowerCase();
    
    // Search in various fields based on activity type
    return (
      (activity.content && activity.content.toLowerCase().includes(lowerQuery)) ||
      (activity.dealTitle && activity.dealTitle.toLowerCase().includes(lowerQuery)) ||
      (activity.threadTitle && activity.threadTitle.toLowerCase().includes(lowerQuery)) ||
      (activity.connectionName && activity.connectionName.toLowerCase().includes(lowerQuery))
    );
  });
  
  // Limit to 3 activities for display
  const displayedActivities = filteredActivities.slice(0, 3);
  const hasMoreActivities = filteredActivities.length > 3;
  
  return (
    <>
      <div id="activity" className="my-8 scroll-mt-24">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#09261E]">
            Activity <span className="text-base font-normal text-gray-500">({activities.length})</span>
          </h2>
          
          <Button 
            variant="link" 
            className="text-[#09261E] font-medium"
            onClick={() => setShowAllActivitiesDialog(true)}
          >
            View All
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-4 bg-gray-50">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-[#09261E] data-[state=active]:text-white rounded-md"
            >
              All Activity
            </TabsTrigger>
            <TabsTrigger 
              value="posts" 
              className="data-[state=active]:bg-[#09261E] data-[state=active]:text-white rounded-md"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger 
              value="deals" 
              className="data-[state=active]:bg-[#09261E] data-[state=active]:text-white rounded-md"
            >
              Deals
            </TabsTrigger>
            <TabsTrigger 
              value="comments" 
              className="data-[state=active]:bg-[#09261E] data-[state=active]:text-white rounded-md"
            >
              Comments
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            <div className="space-y-4">
              {filteredActivities.length === 0 ? (
                <Card>
                  <CardContent className="p-5 text-center text-gray-500">
                    No activities to display in this category.
                  </CardContent>
                </Card>
              ) : (
                <>
                  {displayedActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                  
                  {hasMoreActivities && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 border-dashed border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300"
                      onClick={() => setShowAllActivitiesDialog(true)}
                    >
                      <ActivityIcon size={16} className="mr-2" />
                      <span>See all {filteredActivities.length} activities</span>
                    </Button>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* All Activities Dialog */}
      <Dialog open={showAllActivitiesDialog} onOpenChange={setShowAllActivitiesDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-2xl">All Activity</DialogTitle>
            <DialogDescription className="text-base text-gray-500">
              Browse all {activities.length} activities from this REP
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative my-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search activity..." 
              className="pl-9 border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="all" onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="mb-4 bg-gray-50">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-[#09261E] data-[state=active]:text-white rounded-md"
              >
                All Activity
              </TabsTrigger>
              <TabsTrigger 
                value="posts" 
                className="data-[state=active]:bg-[#09261E] data-[state=active]:text-white rounded-md"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger 
                value="deals" 
                className="data-[state=active]:bg-[#09261E] data-[state=active]:text-white rounded-md"
              >
                Deals
              </TabsTrigger>
              <TabsTrigger 
                value="comments" 
                className="data-[state=active]:bg-[#09261E] data-[state=active]:text-white rounded-md"
              >
                Comments
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0 flex-1 overflow-y-auto pr-2 -mr-2">
              <div className="space-y-4 py-2">
                {filteredActivities.length === 0 ? (
                  <div className="py-16 text-center">
                    <ActivityIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No activities found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search criteria or filters</p>
                  </div>
                ) : (
                  filteredActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="pt-2 border-t mt-2">
            <Button variant="outline" onClick={() => setShowAllActivitiesDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ActivityCard({ activity }: { activity: Activity }) {
  // Format the timestamp as relative time (e.g., "2 days ago")
  const formattedTime = formatRelativeTime(activity.timestamp);
  
  let icon;
  let title;
  let content;
  
  switch (activity.type) {
    case "post":
      icon = <FileText className="h-10 w-10 p-2 bg-blue-50 text-blue-500 rounded-full" />;
      title = "Created a new post";
      content = (
        <div>
          <p className="text-gray-700 mt-1">{activity.content}</p>
        </div>
      );
      break;
    
    case "deal_posted":
      icon = <Home className="h-10 w-10 p-2 bg-green-50 text-green-600 rounded-full" />;
      title = "Listed a new property";
      content = (
        <div>
          <div className="flex items-center text-gray-700 font-medium mt-1">
            <span>{activity.dealTitle}</span>
            {activity.dealPrice && (
              <span className="ml-2 text-[#803344]">
                {formatCurrency(activity.dealPrice)}
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" className="mt-2 h-8 text-sm text-[#09261E]">
            View Property
          </Button>
        </div>
      );
      break;
    
    case "deal_closed":
      icon = <CheckSquare className="h-10 w-10 p-2 bg-[#803344]/10 text-[#803344] rounded-full" />;
      title = "Closed a deal";
      content = (
        <div>
          <div className="flex items-center text-gray-700 font-medium mt-1">
            <span>{activity.dealTitle}</span>
            {activity.dealPrice && (
              <span className="ml-2 text-[#803344]">
                {formatCurrency(activity.dealPrice)}
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" className="mt-2 h-8 text-sm text-[#09261E]">
            View Deal Details
          </Button>
        </div>
      );
      break;
    
    case "comment":
      icon = <MessageSquare className="h-10 w-10 p-2 bg-purple-50 text-purple-500 rounded-full" />;
      title = `Commented on ${activity.threadTitle || "a thread"}`;
      content = (
        <div>
          <p className="text-gray-700 mt-1">{activity.content}</p>
          <Button variant="ghost" size="sm" className="mt-2 h-8 text-sm text-[#09261E]">
            View Thread
          </Button>
        </div>
      );
      break;
    
    case "connection":
      icon = <UserPlus className="h-10 w-10 p-2 bg-indigo-50 text-indigo-500 rounded-full" />;
      title = `Connected with ${activity.connectionName}`;
      content = (
        <div>
          <Button variant="ghost" size="sm" className="mt-2 h-8 text-sm text-[#09261E]">
            View Profile
          </Button>
        </div>
      );
      break;
    
    case "joined":
      icon = <Calendar className="h-10 w-10 p-2 bg-amber-50 text-amber-500 rounded-full" />;
      title = "Joined PropertyDeals";
      content = null;
      break;
    
    default:
      icon = <ActivityIcon className="h-10 w-10 p-2 bg-gray-100 text-gray-500 rounded-full" />;
      title = "Activity update";
      content = null;
  }
  
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex gap-4">
          {/* Icon */}
          <div className="shrink-0">{icon}</div>
          
          {/* Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <h3 className="font-semibold text-[#09261E]">{title}</h3>
              
              <div className="text-sm text-gray-500 flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>{formattedTime}</span>
              </div>
            </div>
            
            {content}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}