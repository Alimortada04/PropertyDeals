import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MessageSquare, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";

export default function InboxPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("messages");
  
  // Placeholder data for messages
  const messages = [
    {
      id: 1,
      sender: "John Smith",
      senderAvatar: "",
      content: "I'm interested in the farmhouse property. Is it still available?",
      time: "Today, 2:30 PM",
      unread: true,
    },
    {
      id: 2,
      sender: "Sarah Johnson",
      senderAvatar: "",
      content: "Thanks for the tour yesterday. I'd like to make an offer.",
      time: "Yesterday, 4:15 PM",
      unread: false,
    },
    {
      id: 3,
      sender: "Mike Davidson",
      senderAvatar: "",
      content: "Can we schedule a second viewing for the downtown loft?",
      time: "Aug 24, 2025",
      unread: false,
    },
  ];
  
  // Placeholder data for notifications
  const notifications = [
    {
      id: 1,
      type: "property-view",
      content: "Your listing 'Modern Farmhouse' has 5 new views",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      type: "offer",
      content: "You received a new offer on 'Luxury Condo'",
      time: "Yesterday",
      unread: true,
    },
    {
      id: 3,
      type: "property-update",
      content: "Price reduced on a property you saved: 'Downtown Loft'",
      time: "2 days ago",
      unread: false,
    },
  ];
  
  // Placeholder data for discussions
  const discussions = [
    {
      id: 1,
      title: "Investment Property Tax Tips",
      author: "Tax Pro Jane",
      authorAvatar: "",
      content: "What are your best tips for reducing taxes on investment properties?",
      replies: 24,
      time: "2 hours ago",
      tags: ["Taxes", "Investment"],
    },
    {
      id: 2,
      title: "Best Areas for Short-Term Rentals",
      author: "STR Investor",
      authorAvatar: "",
      content: "I'm looking to purchase my first short-term rental property. Which areas have the best ROI currently?",
      replies: 18,
      time: "Yesterday",
      tags: ["STR", "Investment"],
    },
    {
      id: 3,
      title: "Contractor Recommendations in Boston",
      author: "First Timer",
      authorAvatar: "",
      content: "Looking for reliable contractors in the Boston area for a full home renovation.",
      replies: 7,
      time: "3 days ago",
      tags: ["Renovation", "Contractors"],
    },
  ];

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Inbox</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search inbox..." className="pl-8" />
        </div>
      </div>

      <Tabs defaultValue="messages" onValueChange={setActiveTab} value={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Messages</span>
            {messages.some(m => m.unread) && (
              <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {messages.filter(m => m.unread).length}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
            {notifications.some(n => n.unread) && (
              <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {notifications.filter(n => n.unread).length}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Discussions</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Direct Messages</CardTitle>
              <CardDescription>
                Private conversations with other PropertyDeals users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-0 divide-y">
                {messages.map((message) => (
                  <div key={message.id} className={`py-4 px-2 ${message.unread ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={message.senderAvatar} alt={message.sender} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {message.sender.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{message.sender}</h3>
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{message.content}</p>
                      </div>
                      {message.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Your Notifications</CardTitle>
              <CardDescription>
                Stay updated on activity related to your properties and account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-0 divide-y">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`py-4 px-2 ${notification.unread ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center 
                        ${notification.type === 'property-view' ? 'bg-blue-100 text-blue-500' : 
                          notification.type === 'offer' ? 'bg-green-100 text-green-500' : 
                          'bg-purple-100 text-purple-500'}`}>
                        {notification.type === 'property-view' ? (
                          <i className="fas fa-eye"></i>
                        ) : notification.type === 'offer' ? (
                          <i className="fas fa-dollar-sign"></i>
                        ) : (
                          <i className="fas fa-home"></i>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold capitalize">{notification.type.replace('-', ' ')}</h3>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{notification.content}</p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="discussions" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Community Discussions</CardTitle>
              <CardDescription>
                Participate in conversations with the PropertyDeals community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <div key={discussion.id} className="border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={discussion.authorAvatar} alt={discussion.author} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {discussion.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h3 className="font-semibold text-base">{discussion.title}</h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{discussion.time}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground my-1">
                          <span className="font-medium">{discussion.author}</span>
                          <span>•</span>
                          <span>{discussion.replies} replies</span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mt-1 line-clamp-2">{discussion.content}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {discussion.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}