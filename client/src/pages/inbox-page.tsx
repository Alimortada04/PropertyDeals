import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Bell, Users, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState("messages");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample messages data
  const messages = [
    {
      id: "1",
      sender: {
        name: "John Davis",
        avatar: "",
        role: "Seller"
      },
      preview: "Thanks for your interest in my property.",
      timestamp: "2h",
      read: false,
    },
    {
      id: "2",
      sender: {
        name: "Sarah Miller",
        avatar: "",
        role: "REP"
      },
      preview: "I found a property that matches your requirements...",
      timestamp: "1d",
      read: true,
    },
    {
      id: "3",
      sender: {
        name: "PropertyDeals Support",
        avatar: "",
        role: "Support"
      },
      preview: "Welcome to PropertyDeals! We're here to help...",
      timestamp: "3d",
      read: true,
    },
  ];

  // Sample notifications data
  const notifications = [
    {
      id: "1",
      title: "New Property Match",
      description: "A new property matching your search criteria is now available",
      timestamp: "1h",
      type: "info",
      read: false,
    },
    {
      id: "2",
      title: "Offer Accepted",
      description: "Your offer on 123 Main Street has been accepted",
      timestamp: "5h",
      type: "success",
      read: false,
    },
    {
      id: "3",
      title: "Price Drop Alert",
      description: "A property on your watchlist has decreased in price",
      timestamp: "1d",
      type: "warning",
      read: true,
    },
  ];

  // Sample discussions data
  const discussions = [
    {
      id: "1",
      title: "Best neighborhoods for families in Boston",
      author: {
        name: "Michael Thompson",
        avatar: "",
        role: "Buyer"
      },
      replies: 24,
      lastActivity: "3h",
      tags: ["Boston", "Family-Friendly", "Neighborhoods"],
    },
    {
      id: "2",
      title: "How to calculate ROI on rental properties",
      author: {
        name: "Jennifer Wright",
        avatar: "",
        role: "Investor"
      },
      replies: 47,
      lastActivity: "12h",
      tags: ["Investment", "ROI", "Rental"],
    },
    {
      id: "3",
      title: "Tips for first-time home sellers",
      author: {
        name: "David Rodriguez",
        avatar: "",
        role: "REP"
      },
      replies: 15,
      lastActivity: "1d",
      tags: ["Selling", "Tips", "First-time"],
    },
    {
      id: "4",
      title: "What renovations add the most value?",
      author: {
        name: "Sarah Johnson",
        avatar: "",
        role: "Contractor"
      },
      replies: 31,
      lastActivity: "2d",
      tags: ["Renovations", "Value", "ROI"],
    },
  ];

  // Filter based on search query
  const filteredMessages = messages.filter(message => 
    message.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredNotifications = notifications.filter(notification => 
    notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredDiscussions = discussions.filter(discussion => 
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Selected message for conversations view
  const [selectedMessage, setSelectedMessage] = useState(messages[0]);
  const [conversation, setConversation] = useState([
    {
      id: "1",
      sender: {
        name: "John Davis",
        avatar: "",
        role: "Seller",
        company: "Colonial Revival"
      },
      content: "Hello! Thanks for your interest in my Colonial Revival property. Do you have any specific questions about it?",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      sender: {
        name: "You",
        avatar: "",
        role: "Buyer"
      },
      content: "Hi John, I'm interested in scheduling a viewing. Is the property still available this weekend?",
      timestamp: "10:45 AM",
      own: true,
    },
    {
      id: "3",
      sender: {
        name: "John Davis",
        avatar: "",
        role: "Seller",
        company: "Colonial Revival"
      },
      content: "Yes, it's available! Would Saturday at 2pm work for you? I can give you a tour and answer any questions.",
      timestamp: "11:02 AM",
    },
  ]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 pb-24">
      <div className="container mx-auto py-6 pt-8 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/12">
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="messages" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Messages</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span>Alerts</span>
                  </TabsTrigger>
                  <TabsTrigger value="discussions" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Discussions</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder={`Search ${activeTab}...`}
                className="pl-10 h-12 rounded-md border-gray-300" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {activeTab === "messages" && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Messages</h2>
                </div>
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="divide-y">
                    {filteredMessages.map((message) => (
                      <div 
                        key={message.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedMessage?.id === message.id ? 'bg-gray-50' : ''}`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {message.sender.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{message.sender.name} {message.sender.role ? `(${message.sender.role})` : ''}</p>
                                <p className="text-sm text-gray-600 line-clamp-1">{message.preview}</p>
                              </div>
                              <div className="flex items-center">
                                <span className="text-xs text-gray-500">{message.timestamp}</span>
                                {!message.read && (
                                  <span className="ml-2 h-2 w-2 rounded-full bg-blue-500"></span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredMessages.length === 0 && (
                      <div className="p-6 text-center">
                        <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No messages found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <Button className="w-full flex items-center justify-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>New Message</span>
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Notifications</h2>
                </div>
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="divide-y">
                    {filteredNotifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex gap-3">
                          <div className={`
                            h-10 w-10 rounded-full flex items-center justify-center 
                            ${notification.type === 'info' ? 'bg-blue-100 text-blue-600' : 
                              notification.type === 'success' ? 'bg-green-100 text-green-600' : 
                              'bg-amber-100 text-amber-600'
                            }
                          `}>
                            {notification.type === 'info' ? (
                              <Bell className="h-5 w-5" />
                            ) : notification.type === 'success' ? (
                              <Check className="h-5 w-5" />
                            ) : (
                              <AlertTriangle className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{notification.title}</p>
                                <p className="text-sm text-gray-600">{notification.description}</p>
                              </div>
                              <div className="flex items-center">
                                <span className="text-xs text-gray-500">{notification.timestamp}</span>
                                {!notification.read && (
                                  <span className="ml-2 h-2 w-2 rounded-full bg-blue-500"></span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredNotifications.length === 0 && (
                      <div className="p-6 text-center">
                        <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No notifications found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Check className="h-4 w-4" />
                    <span>Mark All as Read</span>
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "discussions" && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Discussions</h2>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Filter className="h-3 w-3" />
                    <span>Filter</span>
                  </Button>
                </div>
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="divide-y">
                    {filteredDiscussions.map((discussion) => (
                      <div 
                        key={discussion.id}
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {discussion.author.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{discussion.title}</p>
                            <div className="flex justify-between mt-1">
                              <div className="flex items-center text-sm text-gray-500">
                                <span>{discussion.author.name}</span>
                                <span className="mx-2">•</span>
                                <span>{discussion.replies} replies</span>
                              </div>
                              <span className="text-xs text-gray-500">{discussion.lastActivity}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {discussion.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs py-0 px-2 bg-gray-100 text-gray-700">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredDiscussions.length === 0 && (
                      <div className="p-6 text-center">
                        <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No discussions found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <Button className="w-full flex items-center justify-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Start Discussion</span>
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="w-full md:w-9/12">
            {activeTab === "messages" && selectedMessage && (
              <div className="bg-white rounded-lg shadow h-full">
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedMessage.sender.avatar} alt={selectedMessage.sender.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {selectedMessage.sender.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-medium">{selectedMessage.sender.name}</h2>
                      <p className="text-sm text-gray-500">{selectedMessage.sender.role} {conversation[0].sender.company ? `• ${conversation[0].sender.company}` : ''}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <EyeIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <ScrollArea className="h-[calc(100vh-300px)] p-4">
                  <div className="space-y-4">
                    {conversation.map(message => (
                      <div key={message.id} className={`flex ${message.own ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-2xl ${message.own ? 'flex-row-reverse' : ''}`}>
                          {!message.own && (
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {message.sender.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <div className={`px-4 py-3 rounded-lg ${message.own ? 'bg-[#09261E] text-white' : 'bg-gray-100'}`}>
                              <p>{message.content}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 mx-1">{message.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Plus className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Message..."
                      className="rounded-full"
                    />
                    <Button className="rounded-full h-10 w-10 p-0">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 text-center">
                  <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">Your Notification Center</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Select a notification from the sidebar to view details. You'll be notified about property updates, offers, messages and more.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline">Manage Preferences</Button>
                    <Button>View All Notifications</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "discussions" && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-1">Discussion Forums</h1>
                  <p className="text-gray-600 mb-6">
                    Connect with other real estate professionals and enthusiasts
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Buying & Selling</CardTitle>
                        <CardDescription>Tips and advice for buyers and sellers</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-gray-500">
                          <div className="flex justify-between">
                            <span>Topics: 243</span>
                            <span>Posts: 1,532</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">Browse</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Investing</CardTitle>
                        <CardDescription>Investment strategies and opportunities</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-gray-500">
                          <div className="flex justify-between">
                            <span>Topics: 185</span>
                            <span>Posts: 924</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">Browse</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Market Trends</CardTitle>
                        <CardDescription>Analysis and discussions of real estate markets</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-gray-500">
                          <div className="flex justify-between">
                            <span>Topics: 112</span>
                            <span>Posts: 789</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">Browse</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Home Improvement</CardTitle>
                        <CardDescription>Renovation tips and home decor ideas</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-gray-500">
                          <div className="flex justify-between">
                            <span>Topics: 156</span>
                            <span>Posts: 943</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">Browse</Button>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Hot Topics</h2>
                    <div className="space-y-4">
                      {filteredDiscussions.slice(0, 3).map(discussion => (
                        <div key={discussion.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-medium">{discussion.title}</h3>
                            <Badge variant="outline">{discussion.replies} replies</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {discussion.author.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">{discussion.author.name}</span>
                            </div>
                            <span className="text-xs text-gray-500">Last activity: {discussion.lastActivity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 text-center">
                      <Button>Browse All Discussions</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Check, EyeIcon, AlertTriangle, Phone, Video, ChevronRight, Plus } from "lucide-react";