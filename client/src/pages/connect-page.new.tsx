import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Users, MessageCircle, ChevronRight, X, Plus, ThumbsUp, Send, Globe, User } from "lucide-react";
import Breadcrumbs from "@/components/common/breadcrumbs";
import { useToast } from "@/hooks/use-toast";

export default function ConnectPage() {
  const [activeTab, setActiveTab] = useState("discover");
  const [searchValue, setSearchValue] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();
  
  // Mock data for property discussions
  const allDiscussionGroups = [
    {
      id: 1,
      location: "Milwaukee",
      type: "Off Market Real Estate Deals",
      members: 5100,
      activity: "10 posts a day",
      avatar: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8fDA%3D",
      joined: false,
      friendMembers: ["John Smith", "Sarah Lee"],
      posts: [
        {
          id: 1,
          author: "James Wilson",
          avatar: "JW",
          time: "2 hours ago",
          content: "I'm looking for off-market properties in the Milwaukee downtown area. Anyone have leads?",
          likes: 5,
          replies: 3
        },
        {
          id: 2,
          author: "Emma Rodriguez",
          avatar: "ER",
          time: "5 hours ago",
          content: "Just listed a multi-family unit in Riverwest that hasn't hit the MLS yet. DM if interested.",
          likes: 12,
          replies: 8
        }
      ]
    },
    {
      id: 2,
      location: "Wholesale",
      type: "Real Estate",
      members: 5100,
      activity: "10 posts a day",
      avatar: "https://images.unsplash.com/photo-1592595896616-c37162298647?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D",
      joined: true,
      friendMembers: ["John Smith", "Mike Johnson"],
      posts: [
        {
          id: 1,
          author: "Ryan Chang",
          avatar: "RC",
          time: "Yesterday",
          content: "Has anyone worked with title companies that specialize in wholesale transactions? Looking for recommendations.",
          likes: 3,
          replies: 7
        },
        {
          id: 2,
          author: "David Kim",
          avatar: "DK",
          time: "2 days ago",
          content: "I'm hosting a workshop on wholesaling strategies next month. Limited spots available!",
          likes: 15,
          replies: 22
        },
        {
          id: 3,
          author: "You",
          avatar: "ME",
          time: "4 days ago",
          content: "Just closed on my first wholesale deal! Happy to share my experience with anyone interested.",
          likes: 27,
          replies: 14
        }
      ]
    },
    {
      id: 3,
      location: "SE Wisconsin",
      type: "Off Market Real Estate",
      members: 7700,
      activity: "8 posts a month",
      avatar: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDA%3D",
      joined: false,
      friendMembers: ["Sarah Lee", "Mike Johnson", "Jessica Wong", "Tom Wu", "Alex Chen"],
      posts: []
    },
    {
      id: 4,
      location: "Chicago",
      type: "Investment Properties",
      members: 12300,
      activity: "15 posts a day",
      avatar: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D",
      joined: false,
      friendMembers: [],
      posts: []
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
      unread: 2,
      conversation: [
        {
          id: 1,
          sender: "John Smith",
          avatar: "JS",
          content: "Hey there! I wanted to follow up about that investment property in Milwaukee.",
          time: "Yesterday, 3:45 PM",
          isMine: false
        },
        {
          id: 2,
          sender: "You",
          avatar: "ME",
          content: "Hi John, yes I'm still considering it. What were the projected returns again?",
          time: "Yesterday, 4:30 PM",
          isMine: true
        },
        {
          id: 3,
          sender: "John Smith",
          avatar: "JS",
          content: "The cash-on-cash return is projected at 8.2% with a cap rate of 6.5%. Are you interested in scheduling a viewing?",
          time: "Yesterday, 5:15 PM",
          isMine: false
        },
        {
          id: 4,
          sender: "John Smith",
          avatar: "JS",
          content: "Are you interested in that property we discussed?",
          time: "Today, 9:10 AM",
          isMine: false
        }
      ]
    },
    {
      id: 2,
      name: "Sarah Lee",
      avatar: "SL",
      lastMessage: "I sent you the closing documents for review",
      time: "Yesterday",
      unread: 0,
      conversation: [
        {
          id: 1,
          sender: "Sarah Lee",
          avatar: "SL",
          content: "Hi! I just emailed you the closing documents for the 123 Main St property.",
          time: "Yesterday, 10:22 AM",
          isMine: false
        },
        {
          id: 2,
          sender: "You",
          avatar: "ME",
          content: "Got it, thanks Sarah! I'll review them today and get back to you.",
          time: "Yesterday, 11:05 AM",
          isMine: true
        },
        {
          id: 3,
          sender: "Sarah Lee",
          avatar: "SL",
          content: "I sent you the closing documents for review",
          time: "Yesterday, 4:30 PM",
          isMine: false
        }
      ]
    },
    {
      id: 3,
      name: "Michael Johnson",
      avatar: "MJ",
      lastMessage: "Let's schedule a viewing for next week",
      time: "3d ago",
      unread: 0,
      conversation: [
        {
          id: 1,
          sender: "Michael Johnson",
          avatar: "MJ",
          content: "I have a few properties I think you might be interested in seeing.",
          time: "3 days ago, 2:15 PM",
          isMine: false
        },
        {
          id: 2,
          sender: "You",
          avatar: "ME",
          content: "That sounds great! What areas are they in?",
          time: "3 days ago, 3:22 PM",
          isMine: true
        },
        {
          id: 3,
          sender: "Michael Johnson",
          avatar: "MJ",
          content: "Two in the downtown district and one in the west suburbs. All with great rental potential.",
          time: "3 days ago, 4:05 PM",
          isMine: false
        },
        {
          id: 4,
          sender: "Michael Johnson",
          avatar: "MJ",
          content: "Let's schedule a viewing for next week",
          time: "3 days ago, 4:10 PM",
          isMine: false
        }
      ]
    }
  ];

  const myGroups = allDiscussionGroups.filter(group => group.joined);
  
  const discussionGroups = activeTab === "discover" 
    ? allDiscussionGroups 
    : myGroups;
  
  const filteredGroups = discussionGroups.filter(group => 
    group.location.toLowerCase().includes(searchValue.toLowerCase()) ||
    group.type.toLowerCase().includes(searchValue.toLowerCase())
  );
  
  const filteredMessages = messages.filter(message => 
    message.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const selectedMessage = messages.find(msg => msg.id === selectedMessageId);
  const selectedGroup = allDiscussionGroups.find(group => group.id === selectedGroupId);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    if (activeTab === "messages" && selectedMessageId) {
      toast({
        title: "Message sent",
        description: "Your message has been sent.",
      });
      setNewMessage("");
    } else if ((activeTab === "discover" || activeTab === "my-content") && selectedGroupId) {
      toast({
        title: "Post published",
        description: "Your post has been published to the group.",
      });
      setNewMessage("");
    }
  };

  const toggleJoinGroup = (groupId: number) => {
    // In a real app, we'd make an API call here
    toast({
      title: "Success",
      description: `You've ${selectedGroup?.joined ? "left" : "joined"} the group.`,
    });
  };
  
  const renderDirectMessagesContent = () => {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {/* Conversations sidebar */}
        <div className="md:col-span-1 border rounded-lg overflow-hidden">
          <div className="p-3 border-b bg-[#F7F8FA]">
            <h3 className="text-lg font-semibold text-[#09261E]">Conversations</h3>
          </div>
          <div className="divide-y">
            {filteredMessages.length > 0 ? (
              filteredMessages.map(message => (
                <div 
                  key={message.id} 
                  className={`p-3 flex items-center hover:bg-[#EAF2EF] cursor-pointer ${
                    message.unread > 0 ? 'bg-[#EAF2EF]' : ''
                  } ${selectedMessageId === message.id ? 'bg-[#D0E3DB]' : ''}`}
                  onClick={() => setSelectedMessageId(message.id)}
                >
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
        
        {/* Message content area */}
        <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col h-[600px]">
          {selectedMessage ? (
            <>
              <div className="p-3 border-b bg-[#F7F8FA] flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mr-2 p-0 h-8 w-8 md:hidden"
                  onClick={() => setSelectedMessageId(null)}
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </Button>
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback>{selectedMessage.avatar}</AvatarFallback>
                </Avatar>
                <div className="font-medium">{selectedMessage.name}</div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedMessage.conversation.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex max-w-[75%] ${msg.isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Avatar className={`h-8 w-8 ${msg.isMine ? 'ml-2' : 'mr-2'}`}>
                        <AvatarFallback>{msg.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div 
                          className={`px-3 py-2 rounded-lg ${
                            msg.isMine ? 'bg-[#09261E] text-white' : 'bg-gray-100'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <p className={`text-xs text-gray-500 mt-1 ${msg.isMine ? 'text-right' : ''}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t p-3">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type a message..."
                    className="flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button
                    className="bg-[#09261E] hover:bg-[#135341]"
                    size="sm"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
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
          )}
        </div>
      </div>
    );
  };

  const renderGroupContent = () => {
    if (!selectedGroupId) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Create new group card */}
          {activeTab === "discover" && (
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
          )}
          
          {filteredGroups.map(group => (
            <Card key={group.id} className="overflow-hidden border border-gray-200 hover:border-[#09261E] transition-colors duration-200">
              <CardHeader className="p-0 h-40 relative cursor-pointer" onClick={() => setSelectedGroupId(group.id)}>
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
                  onClick={() => toggleJoinGroup(group.id)}
                >
                  {group.joined ? "Leave Group" : "Join Group"}
                </Button>
              </CardFooter>
            </Card>
          ))}

          {activeTab === "my-content" && filteredGroups.length === 0 && (
            <div className="col-span-3 text-center py-10">
              <div className="w-16 h-16 bg-[#EAF2EF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-[#09261E]" />
              </div>
              <h3 className="text-xl font-semibold text-[#09261E] mb-2">No Groups Joined Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                You haven't joined any property discussion groups yet. Discover and join groups to connect with other professionals.
              </p>
              <Button 
                className="bg-[#09261E] hover:bg-[#135341]"
                onClick={() => setActiveTab("discover")}
              >
                <Globe className="h-4 w-4 mr-2" /> Discover Groups
              </Button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="grid gap-6 md:grid-cols-1">
          <Card className="overflow-hidden border border-gray-200">
            <CardHeader className="p-4 flex flex-row items-center justify-between bg-[#F7F8FA] border-b">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mr-2 p-0 h-8 w-8"
                  onClick={() => setSelectedGroupId(null)}
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </Button>
                <div>
                  <CardTitle className="text-lg">{selectedGroup?.location} {selectedGroup?.type}</CardTitle>
                  <CardDescription>{selectedGroup?.members.toLocaleString()} members</CardDescription>
                </div>
              </div>
              <Button 
                variant={selectedGroup?.joined ? "outline" : "default"}
                className={
                  selectedGroup?.joined 
                    ? "border-[#09261E] text-[#09261E] hover:bg-[#EAF2EF]" 
                    : "bg-[#09261E] hover:bg-[#135341]"
                }
                onClick={() => toggleJoinGroup(selectedGroup!.id)}
              >
                {selectedGroup?.joined ? "Leave Group" : "Join Group"}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-[500px] overflow-y-auto">
                {selectedGroup?.posts && selectedGroup.posts.length > 0 ? (
                  selectedGroup.posts.map(post => (
                    <div key={post.id} className="p-4">
                      <div className="flex items-start">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback>{post.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <div className="font-medium">{post.author}</div>
                            <div className="text-xs text-gray-500">{post.time}</div>
                          </div>
                          <p className="text-gray-700 mb-3">{post.content}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Button variant="ghost" size="sm" className="h-8 flex items-center gap-1 text-gray-500">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </Button>
                            <div className="mx-2">•</div>
                            <Button variant="ghost" size="sm" className="h-8 flex items-center gap-1 text-gray-500">
                              <MessageCircle className="h-4 w-4" />
                              <span>{post.replies} replies</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p className="mb-2">No posts in this group yet</p>
                    <p className="text-sm">Be the first to start a discussion!</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t p-3">
              <div className="flex w-full items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
                <Input
                  placeholder="Write a post..."
                  className="flex-1"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button
                  size="sm"
                  className="bg-[#09261E] hover:bg-[#135341]"
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      );
    }
  };
  
  return (
    <div className="container mx-auto px-4 lg:px-6 py-8">
      <div className="flex flex-col space-y-8">
        <div>
          <Breadcrumbs />
          <h1 className="text-3xl font-bold text-[#09261E] mb-2">Discussions</h1>
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
        
        <Tabs 
          defaultValue="discover" 
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            setSelectedGroupId(null);
            setSelectedMessageId(null);
          }} 
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-[#EAF2EF]">
            <TabsTrigger 
              value="discover" 
              className="flex items-center gap-2 data-[state=active]:bg-[#09261E] data-[state=active]:text-white hover:bg-[#D0E3DB] transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>Discover</span>
            </TabsTrigger>
            <TabsTrigger 
              value="my-content" 
              className="flex items-center gap-2 data-[state=active]:bg-[#09261E] data-[state=active]:text-white hover:bg-[#D0E3DB] transition-colors"
            >
              <User className="h-4 w-4" />
              <span>My Discussions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              className="flex items-center gap-2 data-[state=active]:bg-[#09261E] data-[state=active]:text-white hover:bg-[#D0E3DB] transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Direct Messages</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Discover Tab */}
          <TabsContent value="discover" className="pt-6 px-0">
            {renderGroupContent()}
          </TabsContent>
          
          {/* My Content Tab */}
          <TabsContent value="my-content" className="pt-6 px-0">
            {renderGroupContent()}
          </TabsContent>

          {/* Direct Messages Tab */}
          <TabsContent value="messages" className="pt-6 px-0">
            {renderDirectMessagesContent()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}