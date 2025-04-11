import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Users, MessageCircle, ChevronRight, X, Plus } from "lucide-react";

export default function ConnectPage() {
  const [activeTab, setActiveTab] = useState("discussions");
  const [searchValue, setSearchValue] = useState("");
  
  // Mock data for property discussions
  const discussionGroups = [
    {
      id: 1,
      location: "Milwaukee",
      type: "Off Market Real Estate Deals",
      members: 5100,
      activity: "10 posts a day",
      avatar: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8fDA%3D",
      joined: false,
      friendMembers: ["John Smith", "Sarah Lee"]
    },
    {
      id: 2,
      location: "Wholesale",
      type: "Real Estate",
      members: 5100,
      activity: "10 posts a day",
      avatar: "https://images.unsplash.com/photo-1592595896616-c37162298647?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D",
      joined: true,
      friendMembers: ["John Smith", "Mike Johnson"]
    },
    {
      id: 3,
      location: "SE Wisconsin",
      type: "Off Market Real Estate",
      members: 7700,
      activity: "8 posts a month",
      avatar: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDA%3D",
      joined: false,
      friendMembers: ["Sarah Lee", "Mike Johnson", "Jessica Wong", "Tom Wu", "Alex Chen"]
    },
    {
      id: 4,
      location: "Chicago",
      type: "Investment Properties",
      members: 12300,
      activity: "15 posts a day",
      avatar: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D",
      joined: false,
      friendMembers: []
    }
  ];
  
  // Mock data for direct messages
  const messages = [
    {
      id: 1,
      name: "John Smith",
      avatar: "JS",
      lastMessage: "Are you interested in that property we discussed?",
      time: "2h ago",
      unread: 2
    },
    {
      id: 2,
      name: "Sarah Lee",
      avatar: "SL",
      lastMessage: "I sent you the closing documents for review",
      time: "Yesterday",
      unread: 0
    },
    {
      id: 3,
      name: "Michael Johnson",
      avatar: "MJ",
      lastMessage: "Let's schedule a viewing for next week",
      time: "3d ago",
      unread: 0
    }
  ];
  
  const filteredGroups = discussionGroups.filter(group => 
    group.location.toLowerCase().includes(searchValue.toLowerCase()) ||
    group.type.toLowerCase().includes(searchValue.toLowerCase())
  );
  
  const filteredMessages = messages.filter(message => 
    message.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  
  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#09261E] mb-2">Connect</h1>
          <p className="text-gray-600">
            Join property discussions and connect with other real estate professionals
          </p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search discussions or messages..."
            className="pl-10 py-2 w-full max-w-md"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="discussions" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="discussions" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Property Discussions</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>Direct Messages</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Property Discussions Tab Content */}
          <TabsContent value="discussions" className="pt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Create new group card */}
              <Card className="overflow-hidden border border-[#EAF2EF] hover:border-[#09261E] transition-colors duration-200">
                <CardHeader className="bg-[#EAF2EF] p-4">
                  <CardTitle className="flex items-center justify-center h-32 text-[#09261E]">
                    <div className="flex flex-col items-center">
                      <Plus className="h-12 w-12 mb-2" />
                      <span>Create New Group</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">
                    Start a new discussion group about properties in your area or investment strategies
                  </p>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Button className="w-full bg-[#09261E] hover:bg-[#135341]">
                    Create Group
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Group cards */}
              {filteredGroups.map(group => (
                <Card key={group.id} className="overflow-hidden border border-gray-200 hover:border-[#09261E] transition-colors duration-200">
                  <CardHeader className="p-0 h-40 relative">
                    <img 
                      src={group.avatar} 
                      alt={`${group.location} ${group.type}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-4 text-white">
                        <h3 className="text-xl font-bold">{group.location} {group.type}</h3>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                      <div>{group.members.toLocaleString()} members</div>
                      <div>{group.activity}</div>
                    </div>
                    
                    {group.friendMembers.length > 0 && (
                      <div className="flex items-center mt-3">
                        <div className="flex -space-x-2 mr-2">
                          {group.friendMembers.slice(0, 3).map((friend, index) => (
                            <Avatar key={index} className="border-2 border-white w-6 h-6">
                              <AvatarFallback>{friend.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          {group.friendMembers.length === 1 
                            ? `${group.friendMembers[0]} is a member` 
                            : group.friendMembers.length <= 3 
                              ? `${group.friendMembers.slice(0, -1).join(', ')} and ${group.friendMembers.slice(-1)} are members`
                              : `${group.friendMembers[0]}, ${group.friendMembers[1]} and ${group.friendMembers.length - 2} more are members`
                          }
                        </span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <Button 
                      variant={group.joined ? "outline" : "default"}
                      className={
                        group.joined 
                          ? "w-full border-[#09261E] text-[#09261E] hover:bg-[#EAF2EF]" 
                          : "w-full bg-[#09261E] hover:bg-[#135341]"
                      }
                    >
                      {group.joined ? "Leave Group" : "Join Group"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Direct Messages Tab Content */}
          <TabsContent value="messages" className="pt-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Conversations sidebar */}
              <div className="md:col-span-1 border rounded-lg overflow-hidden">
                <div className="p-3 border-b bg-[#F7F8FA]">
                  <h3 className="text-lg font-semibold text-[#09261E]">Conversations</h3>
                </div>
                <div className="divide-y">
                  {filteredMessages.length > 0 ? (
                    filteredMessages.map(message => (
                      <div key={message.id} className={`p-3 flex items-center hover:bg-gray-50 cursor-pointer ${message.unread > 0 ? 'bg-[#EAF2EF]' : ''}`}>
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback>{message.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium truncate">{message.name}</h4>
                            <span className="text-xs text-gray-500">{message.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{message.lastMessage}</p>
                        </div>
                        {message.unread > 0 && (
                          <Badge className="ml-2 bg-[#09261E]">{message.unread}</Badge>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <p>No matching conversations found</p>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t bg-white">
                  <Button className="w-full bg-[#09261E] hover:bg-[#135341]">
                    <Plus className="h-4 w-4 mr-2" /> New Message
                  </Button>
                </div>
              </div>
              
              {/* Message content area - initially empty state */}
              <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col h-[600px]">
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-[#EAF2EF] rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="h-8 w-8 text-[#09261E]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#09261E] mb-2">Your Messages</h3>
                  <p className="text-gray-600 max-w-md mb-6">
                    Select a conversation or start a new one to begin messaging with other property professionals
                  </p>
                  <Button className="bg-[#09261E] hover:bg-[#135341]">
                    <Plus className="h-4 w-4 mr-2" /> Start New Conversation
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}