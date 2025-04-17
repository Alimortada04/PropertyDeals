import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  Home, 
  CheckSquare,
  UserPlus,
  Activity as ActivityIcon,
  FileText
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
  
  // Filter activities based on active tab
  const filteredActivities = activeTab === "all" 
    ? activities 
    : activities.filter(activity => {
        switch (activeTab) {
          case "posts":
            return activity.type === "post";
          case "deals":
            return activity.type === "deal_posted" || activity.type === "deal_closed";
          case "comments":
            return activity.type === "comment";
          default:
            return true;
        }
      });
  
  return (
    <div id="activity" className="my-8 scroll-mt-24">
      <h2 className="text-2xl font-bold text-[#09261E] mb-4">
        Activity <span className="text-base font-normal text-gray-500">({activities.length})</span>
      </h2>
      
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
              filteredActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
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