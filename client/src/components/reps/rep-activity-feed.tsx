import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from 'wouter';
import { 
  Home, 
  Star, 
  MessageCircle, 
  UserPlus, 
  Award,
  Clock
} from 'lucide-react';

interface Activity {
  id: number;
  type: 'listing' | 'deal' | 'review' | 'connection' | 'award' | 'other';
  date: string;
  content: string;
  user?: {
    id: number;
    name: string;
    avatar: string;
  };
  entityId?: number; // ID of the property, review, etc.
  link?: string;
}

interface RepActivityFeedProps {
  activities: Activity[];
}

export default function RepActivityFeed({ activities }: RepActivityFeedProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <MessageCircle size={40} className="mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-700 mb-1">No Activity Yet</h3>
        <p className="text-gray-500 text-sm">There hasn't been any activity recorded yet.</p>
      </div>
    );
  }
  
  // Format date to relative time (e.g., 2 days ago)
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  };
  
  // Get icon for activity type
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'listing':
        return <Home className="text-indigo-500" />;
      case 'deal':
        return <Award className="text-green-500" />;
      case 'review':
        return <Star className="text-amber-500" />;
      case 'connection':
        return <UserPlus className="text-blue-500" />;
      case 'award':
        return <Award className="text-purple-500" />;
      default:
        return <MessageCircle className="text-gray-500" />;
    }
  };
  
  // Get activity type label
  const getActivityTypeLabel = (type: Activity['type']) => {
    switch (type) {
      case 'listing':
        return 'New Listing';
      case 'deal':
        return 'Closed Deal';
      case 'review':
        return 'New Review';
      case 'connection':
        return 'New Connection';
      case 'award':
        return 'Achievement';
      default:
        return 'Activity';
    }
  };
  
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="border border-gray-100 hover:shadow-sm transition-all">
          <CardContent className="p-4">
            <div className="flex gap-3">
              {/* Activity Icon */}
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-50">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                  {/* Activity Type Badge */}
                  <Badge variant="outline" className="font-normal text-xs">
                    {getActivityTypeLabel(activity.type)}
                  </Badge>
                  
                  {/* Time */}
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    {formatRelativeTime(activity.date)}
                  </div>
                </div>
                
                {/* Content */}
                <p className="text-sm text-gray-700 mb-2">
                  {activity.content}
                </p>
                
                {/* User Info (if available) */}
                {activity.user && (
                  <div className="flex items-center mt-2">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                      <AvatarFallback>{activity.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <Link href={`/reps/${activity.user.id}`} className="text-xs text-gray-600 hover:text-[#135341] hover:underline">
                      {activity.user.name}
                    </Link>
                  </div>
                )}
                
                {/* Link to entity (if available) */}
                {activity.link && (
                  <div className="mt-2">
                    <Link href={activity.link} className="text-xs text-[#135341] hover:underline">
                      View Details
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}