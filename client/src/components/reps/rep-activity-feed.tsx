import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Home, 
  MessageCircle, 
  TrendingUp, 
  PartyPopper, 
  MoreVertical, 
  CheckCircle,
  ThumbsUp,
  Hand
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RepActivityFeedProps {
  activities: any[];
  repId: number;
}

export default function RepActivityFeed({ activities, repId }: RepActivityFeedProps) {
  // Convert to actual array if it's not
  const activitiesArray = Array.isArray(activities) ? activities : [];

  // Sort activities by date (newest first)
  const sortedActivities = [...activitiesArray].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Get activity icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'listing':
        return <Home className="h-4 w-4 text-blue-500" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-purple-500" />;
      case 'market_update':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'deal':
        return <PartyPopper className="h-4 w-4 text-amber-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-primary" />;
    }
  };

  // Generate random engagement counts - normally these would come from the activity data
  const getRandomCount = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Format timestamp to relative time
  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return "Recently";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activity
        </CardTitle>
        <CardDescription>Recent actions and updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
        {sortedActivities.length > 0 ? (
          sortedActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="pb-4 border-b last:border-b-0 last:pb-0"
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{activity.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(activity.timestamp)}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {activity.imageUrl && (
                    <div className="mt-2 rounded-md overflow-hidden bg-muted">
                      <img 
                        src={activity.imageUrl} 
                        alt="Activity" 
                        className="w-full h-auto object-cover" 
                      />
                    </div>
                  )}
                  
                  <div className="flex gap-4 mt-3">
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground text-xs">
                      <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
                      {getRandomCount(0, 12)}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground text-xs">
                      <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                      {getRandomCount(0, 5)}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground text-xs">
                      <Hand className="h-3.5 w-3.5 mr-1.5" />
                      {getRandomCount(0, 20)}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <Activity className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-30" />
            <h3 className="text-sm font-medium mb-1">No Recent Activity</h3>
            <p className="text-xs text-muted-foreground mb-4">
              This REP hasn't posted any activities recently
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}