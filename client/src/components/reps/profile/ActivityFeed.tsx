import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Home, 
  CalendarCheck, 
  User,
  Clock,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter activities based on the active tab
  const filteredActivities = activities.filter(activity => {
    if (activeTab === "all") return true;
    if (activeTab === "posts" && activity.type === 'post') return true;
    if (activeTab === "deals" && (activity.type === 'deal_posted' || activity.type === 'deal_closed')) return true;
    if (activeTab === "comments" && activity.type === 'comment') return true;
    return false;
  });
  
  // Format relative time (e.g., "2 days ago")
  const getRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return diffMins <= 1 ? 'just now' : `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };
  
  return (
    <section id="activity" className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-heading font-bold text-gray-800 mb-6">
          Activity Feed
        </h2>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-100 p-1 rounded-lg mb-6">
            <TabsTrigger value="all" className="rounded-md">Recent Activity</TabsTrigger>
            <TabsTrigger value="deals" className="rounded-md">Deals</TabsTrigger>
            <TabsTrigger value="posts" className="rounded-md">Posts</TabsTrigger>
            <TabsTrigger value="comments" className="rounded-md">Comments</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            <div className="space-y-4">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity, index) => (
                  <ActivityCard key={index} activity={activity} />
                ))
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <Clock className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <h3 className="text-xl font-medium text-gray-700 mb-1">No Activity Yet</h3>
                  <p className="text-gray-500">
                    Activities will appear here once this REP starts engaging on the platform.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

function ActivityCard({ activity }: { activity: Activity }) {
  // Determine icon based on activity type
  const getIcon = () => {
    switch (activity.type) {
      case 'post':
        return <MessageSquare size={18} className="text-blue-500" />;
      case 'comment':
        return <MessageSquare size={18} className="text-green-500" />;
      case 'deal_posted':
        return <Home size={18} className="text-[#09261E]" />;
      case 'deal_closed':
        return <CalendarCheck size={18} className="text-amber-500" />;
      case 'connection':
        return <User size={18} className="text-indigo-500" />;
      case 'joined':
        return <User size={18} className="text-gray-500" />;
      default:
        return <MessageSquare size={18} className="text-gray-500" />;
    }
  };
  
  // Generate card content based on activity type
  const getContent = () => {
    switch (activity.type) {
      case 'post':
        return (
          <div>
            <p className="text-gray-700">{activity.content}</p>
            {activity.threadId && (
              <a 
                href={`/discussions/thread/${activity.threadId}`} 
                className="mt-2 inline-flex items-center text-sm text-[#09261E] hover:underline"
              >
                View discussion
                <ExternalLink size={12} className="ml-1" />
              </a>
            )}
          </div>
        );
      case 'comment':
        return (
          <div>
            <p className="text-gray-700">{activity.content}</p>
            {activity.threadId && (
              <a 
                href={`/discussions/thread/${activity.threadId}`} 
                className="mt-2 inline-flex items-center text-sm text-[#09261E] hover:underline"
              >
                {activity.threadTitle}
                <ExternalLink size={12} className="ml-1" />
              </a>
            )}
          </div>
        );
      case 'deal_posted':
        return (
          <div>
            <p className="text-gray-700">
              Listed a new property: 
              <a 
                href={`/p/${activity.dealId}`} 
                className="font-medium text-[#09261E] ml-1 hover:underline"
              >
                {activity.dealTitle}
              </a>
            </p>
            {activity.dealPrice && (
              <p className="text-sm text-gray-500 mt-1">
                Listed price: ${activity.dealPrice.toLocaleString()}
              </p>
            )}
          </div>
        );
      case 'deal_closed':
        return (
          <div>
            <p className="text-gray-700">
              Closed a deal: 
              <a 
                href={`/p/${activity.dealId}`} 
                className="font-medium text-[#09261E] ml-1 hover:underline"
              >
                {activity.dealTitle}
              </a>
            </p>
            {activity.dealPrice && (
              <p className="text-sm text-gray-500 mt-1">
                Deal value: ${activity.dealPrice.toLocaleString()}
              </p>
            )}
          </div>
        );
      case 'connection':
        return (
          <div>
            <p className="text-gray-700">
              Connected with 
              <a 
                href={`/reps/${activity.connectionId}`} 
                className="font-medium text-[#09261E] ml-1 hover:underline"
              >
                {activity.connectionName}
              </a>
            </p>
          </div>
        );
      case 'joined':
        return (
          <div>
            <p className="text-gray-700">Joined PropertyDeals</p>
          </div>
        );
      default:
        return <p className="text-gray-700">{activity.content}</p>;
    }
  };
  
  // Generate background color based on activity type
  const getBackgroundColor = () => {
    switch (activity.type) {
      case 'deal_closed':
        return 'bg-amber-50';
      case 'deal_posted':
        return 'bg-emerald-50';
      case 'connection':
        return 'bg-indigo-50';
      case 'joined':
        return 'bg-blue-50';
      default:
        return 'bg-white';
    }
  };
  
  return (
    <div 
      className={cn(
        "rounded-xl border border-gray-100 shadow-sm p-4 transition-all hover:shadow-md",
        getBackgroundColor()
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1">
          {getContent()}
          
          <div className="mt-2 text-xs text-gray-500">
            {(() => {
              // Format relative time (e.g., "2 days ago") - inline implementation
              const date = new Date(activity.timestamp);
              const now = new Date();
              const diffMs = now.getTime() - date.getTime();
              const diffMins = Math.floor(diffMs / 60000);
              const diffHours = Math.floor(diffMins / 60);
              const diffDays = Math.floor(diffHours / 24);
              
              if (diffMins < 60) {
                return diffMins <= 1 ? 'just now' : `${diffMins}m ago`;
              } else if (diffHours < 24) {
                return `${diffHours}h ago`;
              } else if (diffDays < 7) {
                return `${diffDays}d ago`;
              } else {
                return date.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                });
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}