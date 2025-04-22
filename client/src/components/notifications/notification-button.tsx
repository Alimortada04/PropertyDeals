import React, { useState } from 'react';
import { Bell, MessageCircle, Eye, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  type: 'message' | 'property' | 'system' | 'alert';
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: string;
}

export function NotificationButton() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  
  // Sample notifications (in a real app, these would come from an API)
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'message',
      title: 'New message from John Davis',
      description: 'Thanks for your interest in my property.',
      time: '2h ago',
      read: false,
      link: '/dashboard?tab=messages'
    },
    {
      id: '2',
      type: 'property',
      title: 'Price reduced: Ranch Home',
      description: 'Price reduced by $25,000',
      time: '5h ago',
      read: false,
      link: '/properties/123'
    },
    {
      id: '3',
      type: 'alert',
      title: 'Viewing reminder: Modern Townhouse',
      description: 'Tomorrow at 10:00 AM',
      time: '1d ago',
      read: false,
      link: '/dashboard?tab=deals'
    }
  ];
  
  const markAllAsRead = () => {
    setUnreadCount(0);
  };
  
  const getIconForNotificationType = (type: string) => {
    switch(type) {
      case 'message':
        return <MessageCircle className="h-5 w-5 text-[#09261E] mt-0.5 flex-shrink-0" />;
      case 'property':
        return <Eye className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />;
      default:
        return <Bell className="h-5 w-5 text-[#09261E] mt-0.5 flex-shrink-0" />;
    }
  };
  
  return (
    <div className="fixed bottom-4 left-4 z-40">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="h-12 w-12 rounded-full shadow-lg bg-[#09261E] hover:bg-[#09261E]/90 relative">
            <Bell className="h-5 w-5 text-white" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-medium">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-80 max-h-[70vh] overflow-auto">
          <div className="flex items-center justify-between p-3 sticky top-0 bg-white z-10 border-b">
            <span className="text-sm font-semibold">Notifications</span>
            <span 
              className="text-xs text-[#09261E] cursor-pointer hover:underline"
              onClick={markAllAsRead}
            >
              Mark all as read
            </span>
          </div>
          <DropdownMenuGroup>
            {notifications.map(notification => (
              <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                <Link href={notification.link || '#'} className="flex items-start gap-2 w-full">
                  {getIconForNotificationType(notification.type)}
                  <div>
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-gray-500">{notification.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <div className="p-2 text-center">
            <Link href="/notifications">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                View all notifications
              </Button>
            </Link>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}