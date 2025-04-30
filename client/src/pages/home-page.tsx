import React, { useState } from "react";
import { Link } from "wouter";
import { 
  Home,
  Search,
  MessageSquare,
  Bell,
  Bookmark,
  ChevronRight,
  Clock,
  Eye,
  Calendar,
  Users,
  MessageCircle,
  Building,
  Calculator,
  Book,
  User,
  Settings,
  Award,
  TrendingUp,
  FileText,
  MapPin
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>("favorites");
  
  // Mock user data (in real app, this would come from auth context)
  const user = {
    name: "Alex Thompson",
    role: "Buyer",
    avatar: "",
  };
  
  // Mock saved properties
  const savedProperties = [
    {
      id: "1",
      title: "Modern Farmhouse",
      address: "123 Main St, Austin, TX",
      price: "$450,000",
      beds: 3,
      baths: 2,
      sqft: 1800,
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      savedDate: "2 days ago",
      status: "For Sale"
    },
    {
      id: "2",
      title: "Downtown Loft",
      address: "456 Urban Ave, Austin, TX",
      price: "$320,000",
      beds: 1,
      baths: 1,
      sqft: 950,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      savedDate: "1 week ago",
      status: "For Sale"
    },
    {
      id: "3",
      title: "Suburban Ranch",
      address: "789 Country Lane, Austin, TX",
      price: "$389,000",
      beds: 4,
      baths: 2.5,
      sqft: 2200,
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      savedDate: "3 days ago",
      status: "For Sale"
    }
  ];
  
  // Mock recent interactions
  const recentInteractions = [
    {
      id: "1",
      type: "message",
      from: "Sarah Miller",
      avatar: "",
      content: "Hi, I'm interested in your property on Oak Street. Is it still available?",
      time: "2h ago"
    },
    {
      id: "2",
      type: "alert",
      title: "Price Drop",
      content: "The property at 456 Urban Ave has dropped in price by $15,000",
      time: "Yesterday"
    },
    {
      id: "3",
      type: "comment",
      from: "Michael Johnson",
      avatar: "",
      content: "I just toured this house and it's amazing! The backyard is much bigger than it looks in the photos.",
      property: "Modern Farmhouse",
      time: "3d ago"
    }
  ];
  
  // Mock recently viewed properties
  const recentlyViewed = [
    {
      id: "1",
      title: "Modern Farmhouse",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      viewedAt: "2h ago"
    },
    {
      id: "4",
      title: "Lakefront Property",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      viewedAt: "Yesterday"
    },
    {
      id: "5",
      title: "Mountain Retreat",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      viewedAt: "3d ago"
    },
    {
      id: "6",
      title: "Urban Townhouse",
      image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      viewedAt: "5d ago"
    }
  ];
  
  // Mock featured updates
  const featuredUpdates = [
    {
      id: "1",
      type: "discussion",
      title: "Best neighborhoods for families in Austin",
      author: "Sarah Thompson",
      avatar: "",
      replies: 24,
      lastActivity: "3h ago",
      excerpt: "Looking for advice on the best family-friendly neighborhoods in Austin with good schools and parks..."
    },
    {
      id: "2",
      type: "event",
      title: "REP Networking Breakfast",
      date: "May 15, 2025",
      time: "8:00 AM - 10:00 AM",
      location: "Austin Convention Center",
      attendees: 42,
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
    },
    {
      id: "3",
      type: "property",
      title: "Luxury Condo in Downtown",
      price: "$650,000",
      address: "101 Congress Ave, Austin, TX",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      description: "Stunning views from this luxury condo in the heart of downtown."
    }
  ];
  
  // Quick action items
  const quickActions = [
    { 
      icon: <Search className="h-6 w-6 text-[#09261E] group-hover:text-white transition-colors" />, 
      title: "Find Properties", 
      description: "Search listings that match your criteria",
      link: "/properties",
      color: "group-hover:bg-[#09261E]"
    },
    { 
      icon: <MessageSquare className="h-6 w-6 text-[#803344] group-hover:text-white transition-colors" />, 
      title: "Messages", 
      description: "Check your inbox for new messages",
      link: "/inbox",
      color: "group-hover:bg-[#803344]"
    },
    { 
      icon: <Users className="h-6 w-6 text-[#09261E] group-hover:text-white transition-colors" />, 
      title: "REP Room", 
      description: "Connect with real estate professionals",
      link: "/reps",
      color: "group-hover:bg-[#09261E]"
    },
    { 
      icon: <Calculator className="h-6 w-6 text-[#803344] group-hover:text-white transition-colors" />, 
      title: "Investment Tools", 
      description: "Calculate ROI and analyze deals",
      link: "/playbook",
      color: "group-hover:bg-[#803344]"
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 pb-16">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#09261E]">
            Welcome back, {user?.name || "Friend"}
          </h1>
          <p className="text-slate-600 mt-1">
            Here's what's happening today on PropertyDeals
          </p>
        </div>
        
        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.link} className="block h-full">
              <div className={`group h-full bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition-all duration-300 hover:shadow-md ${action.color} hover:border-transparent cursor-pointer`}>
                <div className="flex items-start">
                  <div className="bg-slate-100 group-hover:bg-white/20 rounded-lg p-3 transition-colors">
                    {action.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-slate-800 group-hover:text-white transition-colors">{action.title}</h3>
                    <p className="text-sm text-slate-500 group-hover:text-white/80 transition-colors mt-1">{action.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Your Activity Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-[#09261E]">Your Activity</h2>
          </div>
          <Tabs defaultValue="favorites" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 pt-4">
              <TabsList className="bg-gray-100 p-1 rounded-lg border border-gray-200">
                <TabsTrigger 
                  value="favorites" 
                  className="data-[state=active]:bg-[#EAF2EF] data-[state=active]:text-[#135341] px-4 py-2 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 flex items-center gap-2"
                >
                  <Bookmark className="h-4 w-4" />
                  <span>Your Favorites</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="interactions" 
                  className="data-[state=active]:bg-[#EAF2EF] data-[state=active]:text-[#135341] px-4 py-2 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Recent Interactions</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="viewed" 
                  className="data-[state=active]:bg-[#EAF2EF] data-[state=active]:text-[#135341] px-4 py-2 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>Recently Viewed</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Favorites Content */}
            <TabsContent value="favorites" className="p-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {savedProperties.map(property => (
                  <Card key={property.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="h-full w-full object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-[#09261E]">
                        {property.status}
                      </Badge>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <h3 className="text-white font-bold">{property.title}</h3>
                        <p className="text-white/90 text-sm">{property.address}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg">{property.price}</span>
                        <div className="flex text-sm text-gray-500">
                          <span>{property.beds} bd</span>
                          <span className="mx-2">•</span>
                          <span>{property.baths} ba</span>
                          <span className="mx-2">•</span>
                          <span>{property.sqft} sqft</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> Saved {property.savedDate}
                        </div>
                        <Link href={`/properties/${property.id}`}>
                          <button className="text-[#09261E] text-sm font-medium flex items-center">
                            View Details <ChevronRight className="h-4 w-4 ml-1" />
                          </button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {savedProperties.length === 0 && (
                <div className="text-center py-8">
                  <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500">No saved properties yet</h3>
                  <p className="text-gray-400 mb-4">Properties you save will appear here</p>
                  <Link href="/properties">
                    <button className="px-5 py-2 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-[#EAF2EF] text-[#135341] shadow-sm border border-gray-200 flex items-center justify-center mx-auto">
                      Browse Properties
                    </button>
                  </Link>
                </div>
              )}
              
              {savedProperties.length > 0 && (
                <div className="mt-4 text-center">
                  <Link href="/properties">
                    <button className="px-5 py-2 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200 flex items-center justify-center mx-auto">
                      See All Saved Properties
                    </button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            {/* Recent Interactions Content */}
            <TabsContent value="interactions" className="p-6 pt-4">
              <div className="space-y-4">
                {recentInteractions.map(interaction => (
                  <Card key={interaction.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      {interaction.type === 'message' && (
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={interaction.avatar} />
                            <AvatarFallback className="bg-[#09261E]/10 text-[#09261E]">
                              {interaction.from?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">{interaction.from}</h3>
                              <span className="text-xs text-gray-500 ml-2">{interaction.time}</span>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{interaction.content}</p>
                            <button className="text-[#09261E] text-sm font-medium mt-2">
                              Reply
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {interaction.type === 'alert' && (
                        <div className="flex gap-3">
                          <div className="bg-orange-100 h-10 w-10 rounded-full flex items-center justify-center text-orange-600">
                            <Bell className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">{interaction.title}</h3>
                              <span className="text-xs text-gray-500 ml-2">{interaction.time}</span>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{interaction.content}</p>
                            <button className="text-[#09261E] text-sm font-medium mt-2">
                              View Property
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {interaction.type === 'comment' && (
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={interaction.avatar} />
                            <AvatarFallback className="bg-[#09261E]/10 text-[#09261E]">
                              {interaction.from?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">{interaction.from}</h3>
                              <span className="text-xs text-gray-500 ml-2">commented on {interaction.property}</span>
                              <span className="text-xs text-gray-500 ml-2">{interaction.time}</span>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{interaction.content}</p>
                            <div className="flex gap-2 mt-2">
                              <button className="text-[#09261E] text-sm font-medium">
                                View Property
                              </button>
                              <span className="text-gray-300">|</span>
                              <button className="text-[#09261E] text-sm font-medium">
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {recentInteractions.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500">No recent interactions</h3>
                  <p className="text-gray-400 mb-4">Your recent messages and notifications will appear here</p>
                </div>
              )}
              
              {recentInteractions.length > 0 && (
                <div className="mt-4 text-center">
                  <Link href="/inbox">
                    <button className="px-5 py-2 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200 flex items-center justify-center mx-auto">
                      See All Interactions
                    </button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            {/* Recently Viewed Content */}
            <TabsContent value="viewed" className="p-6 pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {recentlyViewed.map(property => (
                  <Link key={property.id} href={`/properties/${property.id}`}>
                    <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow group">
                      <div className="relative h-32">
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                          <h3 className="text-white text-sm font-medium truncate">{property.title}</h3>
                        </div>
                      </div>
                      <div className="p-2 flex justify-between items-center">
                        <div className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> {property.viewedAt}
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {recentlyViewed.length === 0 && (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500">No recently viewed properties</h3>
                  <p className="text-gray-400 mb-4">Properties you view will appear here</p>
                  <Link href="/properties">
                    <button className="px-5 py-2 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-[#EAF2EF] text-[#135341] shadow-sm border border-gray-200 flex items-center justify-center mx-auto">
                      Browse Properties
                    </button>
                  </Link>
                </div>
              )}
              
              {recentlyViewed.length > 0 && (
                <div className="mt-4 text-center">
                  <Link href="/properties">
                    <button className="px-5 py-2 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200 flex items-center justify-center mx-auto">
                      Browse All Properties
                    </button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Featured Updates Section */}
        <div>
          <h2 className="text-xl font-bold text-[#09261E] mb-4">Featured Updates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredUpdates.map((update, index) => (
              <Card key={index} className="overflow-hidden">
                {update.type === 'discussion' && (
                  <>
                    <CardHeader className="p-5 pb-0">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Discussion
                        </Badge>
                        <span className="text-xs text-gray-500">{update.lastActivity}</span>
                      </div>
                      <CardTitle className="text-lg mt-2">{update.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-3">
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{update.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={update.avatar} />
                            <AvatarFallback className="bg-[#09261E]/10 text-[#09261E] text-xs">
                              {update.author?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs ml-2">{update.author}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {update.replies} replies
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="px-5 py-3 bg-gray-50 border-t">
                      <Link href="/connect" className="w-full">
                        <button className="w-full px-5 py-2 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white text-[#09261E] border border-[#09261E]/20 hover:bg-[#09261E]/5 flex items-center justify-center">
                          Join Discussion
                        </button>
                      </Link>
                    </CardFooter>
                  </>
                )}
                
                {update.type === 'event' && (
                  <>
                    <div className="relative h-40">
                      <img 
                        src={update.image} 
                        alt={update.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-2">
                            Upcoming Event
                          </Badge>
                          <h3 className="text-white font-bold">{update.title}</h3>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-start space-x-3 mb-3">
                        <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">{update.date}</p>
                          <p className="text-xs text-gray-500">{update.time}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 mb-1">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                        <p className="text-sm">{update.location}</p>
                      </div>
                      <div className="flex items-center mt-2">
                        <Users className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-xs text-gray-500">{update.attendees} attending</span>
                      </div>
                    </CardContent>
                    <CardFooter className="px-5 py-3 bg-gray-50 border-t">
                      <Link href="/events" className="w-full">
                        <button className="w-full px-5 py-2 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white text-[#09261E] border border-[#09261E]/20 hover:bg-[#09261E]/5 flex items-center justify-center">
                          View Event
                        </button>
                      </Link>
                    </CardFooter>
                  </>
                )}
                
                {update.type === 'property' && (
                  <>
                    <div className="relative h-40">
                      <img 
                        src={update.image} 
                        alt={update.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 mb-2">
                            Featured Property
                          </Badge>
                          <h3 className="text-white font-bold">{update.title}</h3>
                          <p className="text-white text-sm">{update.price}</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-start space-x-3 mb-3">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                        <p className="text-sm">{update.address}</p>
                      </div>
                      <p className="text-sm text-gray-600">{update.description}</p>
                    </CardContent>
                    <CardFooter className="px-5 py-3 bg-gray-50 border-t">
                      <Link href="/properties" className="w-full">
                        <button className="w-full px-5 py-2 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white text-[#09261E] border border-[#09261E]/20 hover:bg-[#09261E]/5 flex items-center justify-center">
                          View Property
                        </button>
                      </Link>
                    </CardFooter>
                  </>
                )}
              </Card>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}