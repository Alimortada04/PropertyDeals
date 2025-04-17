import React from 'react';
import { Link } from 'wouter';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Home, MessageSquare, Award } from 'lucide-react';

interface Activity {
  id: number;
  type: 'new_listing' | 'deal_closed' | 'comment' | 'joined' | 'certification';
  title: string;
  description: string;
  date: string;
  partnerId?: number;
  propertyId?: number;
  threadId?: number;
}

interface RepActivityFeedProps {
  activities: Activity[];
}

export default function RepActivityFeed({ activities }: RepActivityFeedProps) {
  // Function to calculate time ago
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Time intervals in seconds
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    if (seconds < 60) {
      return "just now";
    }
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    
    return "just now";
  };
  
  // Function to render activity icon based on type
  const renderActivityIcon = (type: string) => {
    switch (type) {
      case 'new_listing':
        return <Home className="h-6 w-6 text-blue-500" />;
      case 'deal_closed':
        return <Award className="h-6 w-6 text-green-500" />;
      case 'comment':
        return <MessageSquare className="h-6 w-6 text-indigo-500" />;
      default:
        return <div className="h-6 w-6 bg-gray-200 rounded-full" />;
    }
  };
  
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-3">
          {/* Activity Icon */}
          <div className="mt-0.5">
            {renderActivityIcon(activity.type)}
          </div>
          
          {/* Activity Content */}
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <h4 className="font-medium text-gray-900">{activity.title}</h4>
              <span className="text-sm text-gray-500">{getTimeAgo(activity.date)}</span>
            </div>
            <p className="text-gray-600 text-sm mb-1">{activity.description}</p>
            
            {/* Action links based on activity type */}
            <div className="mt-2 text-sm">
              {activity.type === 'new_listing' && activity.propertyId && (
                <Link href={`/p/${activity.propertyId}`} className="text-[#135341] hover:underline">
                  View Property →
                </Link>
              )}
              
              {activity.type === 'deal_closed' && activity.partnerId && (
                <div className="flex items-center text-sm">
                  <span className="text-green-500 mr-1">🎉</span>
                  <Link href={`/reps/${activity.partnerId}`} className="text-[#135341] hover:underline">
                    View Partner Profile →
                  </Link>
                </div>
              )}
              
              {activity.type === 'comment' && activity.threadId && (
                <Link href={`/discussions/thread/${activity.threadId}`} className="text-[#135341] hover:underline">
                  Join Discussion →
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}