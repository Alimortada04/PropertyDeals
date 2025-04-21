import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CalendarDays, Search, Heart, Calculator, Settings, 
  Star, ArrowRight, Plus, LineChart, PlusCircle, MessageSquare,
  Bell, ChevronRight, AlertCircle, Clock, BellRing, BarChart3, DollarSign,
  PieChart, Target, CheckCircle, X, Eye, Home, Briefcase, TrendingUp, Award,
  Users, Calendar, BadgePercent, LucideIcon, Trophy, Building2, BarChart, CircleDollarSign
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BuyerDashboard() {
  // State for notifications dropdown
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  return (
    <div className="p-8 md:p-12 space-y-8">
      {/* Custom styled dashboard tabs */}
      <Tabs defaultValue="deals" className="mb-6">
        <div className="mb-6">
          <TabsList className="p-1 bg-gray-100 rounded-lg flex space-x-1 w-full">
            <TabsTrigger 
              value="deals" 
              className="rounded-md px-6 py-3 flex-1 font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all hover:bg-white/50 font-display"
            >
              My Deals
            </TabsTrigger>
            <TabsTrigger 
              value="explore" 
              className="rounded-md px-6 py-3 flex-1 font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all hover:bg-white/50 font-display"
            >
              Explore
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              className="rounded-md px-6 py-3 flex-1 font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all hover:bg-white/50 font-display"
            >
              Messages
            </TabsTrigger>
            <TabsTrigger 
              value="tools" 
              className="rounded-md px-6 py-3 flex-1 font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all hover:bg-white/50 font-display"
            >
              Tools
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="rounded-md px-6 py-3 flex-1 font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all hover:bg-white/50 font-display"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="priority" 
              className="rounded-md px-6 py-3 flex-1 font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all hover:bg-white/50 font-display"
            >
              Priority Buyer
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="deals" className="mt-6">
          {/* Command Center Header */}
          <div className="bg-white shadow-md rounded-lg mb-8 overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-[#09261E]/10 to-transparent p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-3 text-[#09261E]">Welcome back, Ali</h1>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">You're 60% of the way to closing your first deal</span>
                      <span className="text-sm font-medium">60%</span>
                    </div>
                    <Progress value={60} className="h-2 bg-gray-100" indicatorColor="bg-[#09261E]" />
                  </div>
                </div>
                
                {/* Notifications Center */}
                <div className="flex items-center space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500"></span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <div className="flex items-center justify-between p-2">
                        <span className="text-sm font-medium">Notifications</span>
                        <span className="text-xs text-[#09261E] cursor-pointer hover:underline">Mark all as read</span>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem className="p-3 cursor-pointer">
                          <div className="flex items-start gap-2">
                            <BellRing className="h-5 w-5 text-[#09261E] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium">New message from Sarah Miller</p>
                              <p className="text-xs text-gray-500">5 minutes ago</p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="p-3 cursor-pointer">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium">Price reduced: Ranch Home</p>
                              <p className="text-xs text-gray-500">2 hours ago</p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="p-3 cursor-pointer">
                          <div className="flex items-start gap-2">
                            <Clock className="h-5 w-5 text-[#09261E] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium">Viewing reminder: Modern Townhouse</p>
                              <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <div className="p-2 text-center">
                        <Button variant="ghost" size="sm" className="w-full text-xs">View all notifications</Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            
            {/* Deal Alerts Banner */}
            <div className="bg-amber-50 p-4 flex items-center justify-between border-t border-amber-100">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                <p className="text-sm font-medium text-amber-800">5 New Off-Market Listings Match Your Preferences</p>
              </div>
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                View Now
              </Button>
            </div>
          </div>
          
          {/* Saved Properties (Preview Cards) */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#09261E] flex items-center">
                <Heart className="mr-2 h-5 w-5 text-[#09261E]" /> Saved Properties
              </h2>
              <Button variant="ghost" size="sm" className="text-[#09261E]">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex">
                  <div className="w-1/3 bg-gray-200 h-32"></div>
                  <div className="w-2/3 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Modern Townhouse</h3>
                        <p className="text-sm text-gray-500">3 bed • 2 bath • Chicago</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            🔥 Hot
                          </span>
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            📍 Chicago
                          </span>
                        </div>
                      </div>
                      <p className="font-bold">$350,000</p>
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button size="sm" variant="outline" className="mr-2">
                        <Eye className="mr-1 h-3 w-3" /> View
                      </Button>
                      <Button size="sm" className="bg-[#09261E]">Make Offer</Button>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex">
                  <div className="w-1/3 bg-gray-200 h-32"></div>
                  <div className="w-2/3 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Ranch Home</h3>
                        <p className="text-sm text-gray-500">4 bed • 3 bath • Milwaukee</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            💬 Offer Made
                          </span>
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            📍 Milwaukee
                          </span>
                        </div>
                      </div>
                      <p className="font-bold">$410,000</p>
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button size="sm" variant="outline" className="mr-2">
                        <Eye className="mr-1 h-3 w-3" /> View
                      </Button>
                      <Button size="sm" variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200" disabled>
                        Offer Pending
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          {/* Recommended Properties */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#09261E] flex items-center">
                <Star className="mr-2 h-5 w-5 text-[#09261E]" /> Recommended For You
              </h2>
              <Button variant="ghost" size="sm" className="text-[#09261E]">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="overflow-x-auto pb-2">
              <div className="flex space-x-4 min-w-max">
                <Card className="w-72 flex-shrink-0 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <div className="w-full h-40 bg-gray-200"></div>
                    <span className="absolute top-2 right-2 bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">
                      ⭐ Top Match
                    </span>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Modern Townhouse</h3>
                      <p className="font-bold">$350,000</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">3 bed • 2 bath • Chicago</p>
                    <div className="bg-[#09261E]/10 px-2 py-1 rounded-full text-xs text-[#09261E] inline-block mb-3">
                      Matches 85% of your criteria
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline">Quick View</Button>
                      <Button size="sm" className="bg-[#09261E] hover:bg-[#09261E]/90">Details</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="w-72 flex-shrink-0 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <div className="w-full h-40 bg-gray-200"></div>
                    <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      🆕 New Listing
                    </span>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Riverfront Condo</h3>
                      <p className="font-bold">$225,000</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">2 bed • 2 bath • Detroit</p>
                    <div className="bg-[#09261E]/10 px-2 py-1 rounded-full text-xs text-[#09261E] inline-block mb-3">
                      Matches 70% of your criteria
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline">Quick View</Button>
                      <Button size="sm" className="bg-[#09261E] hover:bg-[#09261E]/90">Details</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="w-72 flex-shrink-0 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <div className="w-full h-40 bg-gray-200"></div>
                    <span className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      💰 Price Reduced
                    </span>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Ranch Home</h3>
                      <p className="font-bold">$395,000</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">4 bed • 3 bath • Milwaukee</p>
                    <div className="text-xs text-green-700 mb-3">
                      <span className="line-through">$410,000</span> (-$15,000)
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline">Quick View</Button>
                      <Button size="sm" className="bg-[#09261E] hover:bg-[#09261E]/90">Details</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="w-72 flex-shrink-0 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <div className="w-full h-40 bg-gray-200"></div>
                    <span className="absolute top-2 right-2 bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                      ⏰ Offer Deadline
                    </span>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Victorian House</h3>
                      <p className="font-bold">$475,000</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">5 bed • 3 bath • Chicago</p>
                    <div className="text-xs text-red-700 mb-3">
                      Deadline: Apr 24, 2025 (3 days)
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline">Quick View</Button>
                      <Button size="sm" className="bg-[#09261E] hover:bg-[#09261E]/90">Details</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="explore" className="space-y-6">
          {/* Tab navigation for explore section */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <Tabs defaultValue="recommended" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="recommended" className="font-display">Recommended</TabsTrigger>
                <TabsTrigger value="saved-searches" className="font-display">Saved Searches</TabsTrigger>
                <TabsTrigger value="deal-alerts" className="font-display">Deal Alerts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recommended" className="pt-2">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Recommended property cards */}
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <div className="w-full h-40 bg-gray-200"></div>
                      <span className="absolute top-2 right-2 bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">
                        ⭐ Top Match
                      </span>
                      <Button size="sm" variant="ghost" className="absolute top-2 left-2 bg-white/80 rounded-full w-8 h-8 p-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Lakefront Cottage</h3>
                        <p className="font-bold">$275,000</p>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">2 bed • 1 bath • Madison</p>
                      <div className="bg-[#09261E]/10 px-2 py-1 rounded-full text-xs text-[#09261E] inline-block mb-3">
                        Matches 92% of your criteria
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-amber-600">Exclusive Off-Market Deal</span>
                        <Button size="sm" className="bg-[#09261E] hover:bg-[#09261E]/90">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <div className="w-full h-40 bg-gray-200"></div>
                      <span className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                        💰 Cash Flowing
                      </span>
                      <Button size="sm" variant="ghost" className="absolute top-2 left-2 bg-white/80 rounded-full w-8 h-8 p-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Duplex Unit</h3>
                        <p className="font-bold">$320,000</p>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">4 bed • 2 bath • Milwaukee</p>
                      <div className="bg-[#09261E]/10 px-2 py-1 rounded-full text-xs text-[#09261E] inline-block mb-3">
                        Est. ROI: 9.2% annually
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Listed 2 days ago</span>
                        <Button size="sm" className="bg-[#09261E] hover:bg-[#09261E]/90">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <div className="w-full h-40 bg-gray-200"></div>
                      <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        🔨 Flip Potential
                      </span>
                      <Button size="sm" variant="ghost" className="absolute top-2 left-2 bg-white/80 rounded-full w-8 h-8 p-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Fixer Upper</h3>
                        <p className="font-bold">$175,000</p>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">3 bed • 2 bath • Chicago</p>
                      <div className="bg-[#09261E]/10 px-2 py-1 rounded-full text-xs text-[#09261E] inline-block mb-3">
                        Est. ARV: $265,000
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Great neighborhood</span>
                        <Button size="sm" className="bg-[#09261E] hover:bg-[#09261E]/90">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6 text-center">
                  <Button className="bg-[#09261E] hover:bg-[#09261E]/90">
                    <Search className="mr-2 h-4 w-4" /> Find More Properties
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="saved-searches" className="pt-2">
                <div className="grid gap-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium flex items-center">
                          <Search className="mr-2 h-4 w-4 text-[#09261E]" />
                          Milwaukee Duplexes
                        </h3>
                        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                          5 new matches
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Milwaukee</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Duplex</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">$200k-$400k</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Multi-family</span>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button size="sm" variant="outline" className="mr-2">Edit</Button>
                        <Button size="sm" className="bg-[#09261E]">View Results</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium flex items-center">
                          <Search className="mr-2 h-4 w-4 text-[#09261E]" />
                          Chicago Condos
                        </h3>
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                          Last updated 2 days ago
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Chicago</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Condo</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">$150k-$300k</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">2+ beds</span>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button size="sm" variant="outline" className="mr-2">Edit</Button>
                        <Button size="sm" className="bg-[#09261E]">View Results</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="deal-alerts" className="pt-2">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center p-6">
                      <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Deal Alerts</h3>
                      <p className="text-gray-500 mb-6">Get notified when properties that match your criteria hit the market or have price reductions.</p>
                      <Button className="bg-[#09261E]">Set Up Deal Alerts</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        
        <TabsContent value="messages" className="space-y-4">
          {/* Messaging Interface */}
          <div className="bg-white rounded-lg shadow-md border overflow-hidden">
            <div className="flex h-[600px]">
              {/* Left sidebar with conversations */}
              <div className="w-1/3 border-r overflow-y-auto">
                <div className="p-3 border-b">
                  <h3 className="font-medium">Messages</h3>
                </div>
                
                <div className="divide-y">
                  <div className="p-3 hover:bg-gray-50 cursor-pointer bg-[#09261E]/5">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-[#09261E]/20 flex items-center justify-center text-[#09261E] font-medium">
                        JD
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium truncate">John Davis (Seller)</p>
                          <p className="text-xs text-gray-500">2h</p>
                        </div>
                        <p className="text-xs text-gray-600 truncate">Thanks for your interest in my property.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-[#803344]/20 flex items-center justify-center text-[#803344] font-medium">
                        SM
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium truncate">Sarah Miller (REP)</p>
                          <p className="text-xs text-gray-500">1d</p>
                        </div>
                        <p className="text-xs text-gray-600 truncate">I found a property that matches your requirements</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 font-medium">
                        PD
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium truncate">PropertyDeals Support</p>
                          <p className="text-xs text-gray-500">3d</p>
                        </div>
                        <p className="text-xs text-gray-600 truncate">Welcome to PropertyDeals! We're here to help...</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3">
                  <Button variant="outline" size="sm" className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" /> New Message
                  </Button>
                </div>
              </div>
              
              {/* Main chat area */}
              <div className="w-2/3 flex flex-col">
                <div className="p-3 border-b flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-[#09261E]/20 flex items-center justify-center text-[#09261E] font-medium mr-2">
                      JD
                    </div>
                    <div>
                      <p className="font-medium">John Davis</p>
                      <p className="text-xs text-gray-500">Seller • Colonial Revival</p>
                    </div>
                  </div>
                  <div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" /> View Property
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  <div className="flex justify-start">
                    <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
                      <p className="text-sm">Hello! Thanks for your interest in my Colonial Revival property. Do you have any specific questions about it?</p>
                      <p className="text-xs text-gray-500 mt-1">10:30 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-[#09261E] text-white rounded-lg p-3 shadow-sm max-w-[80%]">
                      <p className="text-sm">Hi John, I'm interested in scheduling a viewing. Is the property still available this weekend?</p>
                      <p className="text-xs text-white/70 mt-1">10:45 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
                      <p className="text-sm">Yes, it's available! Would Saturday at 2pm work for you? I can give you a tour and answer any questions.</p>
                      <p className="text-xs text-gray-500 mt-1">11:02 AM</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border-t">
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#09261E]/30"
                    />
                    <Button className="bg-[#09261E]">Send</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tools" className="space-y-6">
          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-[#09261E]/10 flex items-center justify-center group-hover:bg-[#09261E]/20 transition-colors">
                    <Calculator className="h-6 w-6 text-[#09261E]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Mortgage Calculator</h3>
                    <p className="text-sm text-gray-500">Estimate monthly payments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-[#09261E]/10 flex items-center justify-center group-hover:bg-[#09261E]/20 transition-colors">
                    <LineChart className="h-6 w-6 text-[#09261E]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Flip/ROI Calculator</h3>
                    <p className="text-sm text-gray-500">Analyze potential profits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-[#09261E]/10 flex items-center justify-center group-hover:bg-[#09261E]/20 transition-colors">
                    <DollarSign className="h-6 w-6 text-[#09261E]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Budget Planner</h3>
                    <p className="text-sm text-gray-500">Track expenses & financing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-[#09261E]/10 flex items-center justify-center group-hover:bg-[#09261E]/20 transition-colors">
                    <Target className="h-6 w-6 text-[#09261E]" />
                  </div>
                  <div>
                    <h3 className="font-medium">ROI Target Tracker</h3>
                    <p className="text-sm text-gray-500">Set & monitor investment goals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-[#09261E]/10 flex items-center justify-center group-hover:bg-[#09261E]/20 transition-colors">
                    <Settings className="h-6 w-6 text-[#09261E]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Update Preferences</h3>
                    <p className="text-sm text-gray-500">Refine your search criteria</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-[#09261E]/10 flex items-center justify-center group-hover:bg-[#09261E]/20 transition-colors">
                    <Home className="h-6 w-6 text-[#09261E]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Deal Flow Timeline</h3>
                    <p className="text-sm text-gray-500">Track your buyer journey</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Ownership Tracker */}
          <Card className="shadow-md">
            <CardHeader className="bg-[#09261E]/5">
              <CardTitle className="text-[#09261E] flex items-center">
                <Briefcase className="mr-2 h-5 w-5" /> Your Buying Roadmap
              </CardTitle>
              <CardDescription>
                You're 3 steps away from your first offer
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-2">
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-green-50 rounded-md">
                  <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-sm font-medium">Step 1: Schedule Viewing</p>
                      <p className="text-xs text-green-600 ml-2">(Done Apr 18)</p>
                    </div>
                    <p className="text-xs text-gray-600">You've scheduled a viewing for Modern Townhouse</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <div className="h-8 w-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mr-3">
                    <span className="text-sm">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Step 2: Get Pre-approved</p>
                    <p className="text-xs text-gray-600">Connect with a lender to secure financing</p>
                  </div>
                  <Button size="sm" variant="outline">Connect with Lender</Button>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <div className="h-8 w-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mr-3">
                    <span className="text-sm">3</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Step 3: Submit Offer</p>
                    <p className="text-xs text-gray-600">Select a property to begin the offer process</p>
                  </div>
                  <Button size="sm" variant="outline" disabled>Select Property</Button>
                </div>
              </div>
              
              <div className="mt-6">
                <Button className="w-full bg-[#09261E] hover:bg-[#09261E]/90">
                  Continue Your Journey
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Priority Buyer CTA */}
      <Card className="bg-gradient-to-r from-[#09261E] to-[#135341] text-white shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-4">
            <div className="p-6 md:col-span-3">
              <h3 className="text-xl font-bold mb-4">Get Priority Access to Deals</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Badge on profile</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Early listing visibility</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Exclusive deals</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">AI-matched properties</p>
                </div>
              </div>
              <p className="text-sm text-white/80">Apply now to unlock these benefits and more.</p>
            </div>
            <div className="flex items-center justify-center p-6 bg-black/10">
              <Button className="bg-white text-[#09261E] hover:bg-white/90 hover:text-[#09261E] font-bold px-10">
                Get Priority Access
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}