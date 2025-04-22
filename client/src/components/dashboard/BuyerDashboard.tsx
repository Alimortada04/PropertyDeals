import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CalendarDays, Search, Heart, Calculator, Settings, 
  Star, ArrowRight, Plus, LineChart, PlusCircle, MessageSquare,
  Bell, ChevronRight, AlertCircle, Clock, BellRing, BarChart3, DollarSign,
  PieChart, Target, CheckCircle, X, Eye, Home, Briefcase, TrendingUp, Award,
  Users, Calendar, BadgePercent, LucideIcon, Trophy, Building2, BarChart, CircleDollarSign,
  Sliders, Building, FileText, MapPin, ClipboardCheck
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function BuyerDashboard() {
  // State for notifications dropdown
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  return (
    <div className="pt-20 sm:pt-24 md:pt-20 p-4 sm:p-6 md:p-12 space-y-8">
      {/* Main tabs design with green active state and grey hover - mobile responsive with sticky positioning */}
      <Tabs defaultValue="deals" className="mb-6">
        <div className="mb-6 md:mb-8 sticky top-0 z-30 bg-white/95 backdrop-blur-sm pt-2 pb-3 -mt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-12 md:px-12">
          <div className="overflow-x-auto pb-1">
            <TabsList className="bg-white rounded-xl p-1.5 flex w-full md:w-full border border-gray-200 shadow-sm min-w-max">
              <TabsTrigger 
                value="deals" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#09261E] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[100px]"
              >
                My Deals
              </TabsTrigger>
              <TabsTrigger 
                value="explore" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#09261E] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[100px]"
              >
                Explore
              </TabsTrigger>
              <TabsTrigger 
                value="messages" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#09261E] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[100px]"
              >
                Messages
              </TabsTrigger>
              <TabsTrigger 
                value="tools" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#09261E] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[100px]"
              >
                Tools
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#09261E] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[100px]"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="priority" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#09261E] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[110px]"
              >
                Priority Buyer
              </TabsTrigger>
            </TabsList>
          </div>
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
                      <div className="flex items-center">
                        <span className="text-sm text-gray-700 font-medium">Account Setup Completion</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 ml-1">
                              <AlertCircle className="h-4 w-4 text-[#09261E]" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-80">
                            <div className="p-3">
                              <h3 className="font-medium mb-2">Next steps to complete your profile:</h3>
                              <ul className="space-y-2 text-sm">
                                <li className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  <span className="text-gray-500">Complete basic information</span>
                                </li>
                                <li className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  <span className="text-gray-500">Set investment preferences</span>
                                </li>
                                <li className="flex items-center">
                                  <div className="h-4 w-4 border border-gray-300 rounded-full mr-2 flex items-center justify-center">
                                    <span className="text-[9px] font-medium">3</span>
                                  </div>
                                  <span>Connect with your lender</span>
                                </li>
                                <li className="flex items-center">
                                  <div className="h-4 w-4 border border-gray-300 rounded-full mr-2 flex items-center justify-center">
                                    <span className="text-[9px] font-medium">4</span>
                                  </div>
                                  <span>Set your annual investment goals</span>
                                </li>
                                <li className="flex items-center">
                                  <div className="h-4 w-4 border border-gray-300 rounded-full mr-2 flex items-center justify-center">
                                    <span className="text-[9px] font-medium">5</span>
                                  </div>
                                  <span>Upload verification documents</span>
                                </li>
                              </ul>
                              <div className="mt-3">
                                <Button size="sm" className="w-full bg-[#09261E]">Complete Setup</Button>
                              </div>
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <span className="text-sm font-medium">40%</span>
                    </div>
                    <Progress value={40} className="h-2 bg-gray-100" indicatorColor="bg-[#09261E]" />
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
                <Card className="w-72 flex-shrink-0 overflow-hidden hover:shadow-md transition-all group relative">
                  <div className="relative">
                    <div className="w-full h-40 bg-gray-200 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                        <Button size="sm" variant="outline" className="bg-white/90 hover:bg-white">
                          <Eye className="mr-1 h-3 w-3" /> Quick View
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-white/90 hover:bg-white rounded-full">
                          <Heart className="h-4 w-4 text-[#09261E]" />
                        </Button>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                      <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs font-medium shadow-sm">
                        ⭐ Top Match
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium shadow-sm">
                        💰 Cash Flow
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Modern Townhouse</h3>
                      <p className="font-bold">$350,000</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">3 bed • 2 bath • Chicago</p>
                    <div className="flex items-center mb-3">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-xs font-medium ml-2 min-w-[40px] text-right">85% Match</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Est. ROI: 7.3%</span>
                      <Button size="sm" className="bg-[#09261E] hover:bg-[#09261E]/90">View Details</Button>
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
          {/* Tab navigation for explore section - green active tabs style - mobile responsive */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-100">
            <Tabs defaultValue="recommended" className="w-full">
              <div className="mb-6">
                <div className="overflow-x-auto pb-1 -mx-2 px-2">
                  <TabsList className="bg-white rounded-xl p-1.5 flex w-full sm:w-auto overflow-hidden border border-gray-200 shadow-sm min-w-max">
                    <TabsTrigger 
                      value="recommended" 
                      className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#09261E] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[140px]"
                    >
                      Recommended
                    </TabsTrigger>
                    <TabsTrigger 
                      value="saved-searches" 
                      className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#09261E] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[140px]"
                    >
                      Saved Searches
                    </TabsTrigger>
                    <TabsTrigger 
                      value="deal-alerts" 
                      className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#09261E] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[140px]"
                    >
                      Deal Alerts
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
              
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
          {/* Messaging Interface - Mobile Optimized (iMessage/Facebook style) */}
          <div className="bg-white rounded-lg shadow-md border overflow-hidden">
            <div className="md:flex h-[600px]">
              {/* Left sidebar with conversations - full width on mobile, hidden when viewing a conversation */}
              <div id="conversationList" className="w-full md:w-1/3 md:border-r overflow-y-auto h-full block md:block">
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
              
              {/* Main chat area - hidden on mobile by default until a conversation is selected */}
              <div id="conversationDetail" className="hidden md:flex w-full md:w-2/3 flex-col h-full">
                <div className="p-3 border-b flex items-center justify-between sticky top-0 bg-white z-20">
                  <div className="flex items-center">
                    <button id="backButton" className="h-8 w-8 flex items-center justify-center mr-2 text-gray-600 md:hidden">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="h-10 w-10 rounded-full bg-[#09261E]/20 flex items-center justify-center text-[#09261E] font-medium mr-2">
                      JD
                    </div>
                    <div>
                      <p className="font-medium">John Davis</p>
                      <p className="text-xs text-gray-500">Seller • Colonial Revival</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hidden sm:flex">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-gray-50">
                  {/* Conversation date divider */}
                  <div className="flex justify-center">
                    <div className="bg-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full">
                      Today
                    </div>
                  </div>
                  
                  <div className="flex justify-start mb-3">
                    <div className="flex items-end gap-1">
                      <div className="h-8 w-8 rounded-full bg-[#09261E]/20 flex-shrink-0 flex items-center justify-center text-[#09261E] font-medium mr-1 mb-1 hidden sm:flex">
                        JD
                      </div>
                      <div>
                        <div className="bg-white rounded-2xl rounded-bl-sm p-3 shadow-sm max-w-[85%] sm:max-w-[80%]">
                          <p className="text-sm">Hello! Thanks for your interest in my Colonial Revival property. Do you have any specific questions about it?</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-1">10:30 AM</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mb-3">
                    <div>
                      <div className="bg-[#09261E] text-white rounded-2xl rounded-br-sm p-3 shadow-sm max-w-[85%] sm:max-w-[80%]">
                        <p className="text-sm">Hi John, I'm interested in scheduling a viewing. Is the property still available this weekend?</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 mr-1 text-right">10:45 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="flex items-end gap-1">
                      <div className="h-8 w-8 rounded-full bg-[#09261E]/20 flex-shrink-0 flex items-center justify-center text-[#09261E] font-medium mr-1 mb-1 hidden sm:flex">
                        JD
                      </div>
                      <div>
                        <div className="bg-white rounded-2xl rounded-bl-sm p-3 shadow-sm max-w-[85%] sm:max-w-[80%]">
                          <p className="text-sm">Yes, it's available! Would Saturday at 2pm work for you? I can give you a tour and answer any questions.</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-1">11:02 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-2 sm:p-3 border-t sticky bottom-0 bg-white">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9 p-0 rounded-full flex-shrink-0">
                      <Plus className="h-5 w-5 text-gray-500" />
                    </Button>
                    <input 
                      type="text" 
                      placeholder="Message..." 
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#09261E]/30 text-sm"
                    />
                    <Button size="icon" className="h-9 w-9 p-0 bg-[#09261E] rounded-full flex-shrink-0">
                      <SendHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tools" className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#09261E]">Investment Tools</h3>
                <p className="text-sm text-gray-500">Interactive calculators and tools to strengthen your investment strategy</p>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" /> Reorder Tools
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="overflow-hidden hover:shadow-md transition-shadow group">
                <div className="bg-gradient-to-br from-[#09261E]/20 to-[#09261E]/5 h-2 w-full"></div>
                <CardContent className="pt-6">
                  <div className="flex items-start mb-4">
                    <div className="h-12 w-12 rounded-lg bg-[#09261E]/10 flex items-center justify-center text-[#09261E] mr-4">
                      <Calculator className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Mortgage Calculator</h3>
                      <p className="text-sm text-gray-500">Estimate monthly payments</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Loan Amount</span>
                      <span className="font-medium">$350,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Interest Rate</span>
                      <span className="font-medium">5.25%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Loan Term</span>
                      <span className="font-medium">30 years</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span>Est. Monthly Payment</span>
                      <span>$1,932</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-[#09261E] hover:bg-[#09261E]/90 group-hover:shadow-md transition-shadow">
                    Open Calculator
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden hover:shadow-md transition-shadow group">
                <div className="bg-gradient-to-br from-[#09261E]/20 to-[#09261E]/5 h-2 w-full"></div>
                <CardContent className="pt-6">
                  <div className="flex items-start mb-4">
                    <div className="h-12 w-12 rounded-lg bg-[#09261E]/10 flex items-center justify-center text-[#09261E] mr-4">
                      <LineChart className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">ROI Calculator</h3>
                      <p className="text-sm text-gray-500">Analyze investment returns</p>
                    </div>
                  </div>
                  
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-16 w-16 rounded-lg bg-[#09261E]/10 flex items-center justify-center">
                        <span className="text-xl font-bold text-[#09261E]">8.2%</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Avg. ROI</span>
                        <p className="text-xs text-gray-500">Rental Property</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-16 w-16 rounded-lg bg-[#09261E]/10 flex items-center justify-center">
                        <span className="text-xl font-bold text-[#09261E]">12%</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Avg. ROI</span>
                        <p className="text-xs text-gray-500">Fix & Flip</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-[#09261E] hover:bg-[#09261E]/90 group-hover:shadow-md transition-shadow">
                    Open Calculator
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden hover:shadow-md transition-shadow group">
                <div className="bg-gradient-to-br from-[#09261E]/20 to-[#09261E]/5 h-2 w-full"></div>
                <CardContent className="pt-6">
                  <div className="flex items-start mb-4">
                    <div className="h-12 w-12 rounded-lg bg-[#09261E]/10 flex items-center justify-center text-[#09261E] mr-4">
                      <Building className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Property Comparison</h3>
                      <p className="text-sm text-gray-500">Compare multiple properties</p>
                    </div>
                  </div>
                  
                  <div className="h-16 bg-[#09261E]/5 rounded-lg flex items-center justify-center mb-4">
                    <p className="text-sm text-[#09261E]">Compare up to 5 properties at once</p>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <Avatar className="h-6 w-6 border-2 border-white">
                      <AvatarFallback className="bg-[#09261E] text-white text-xs">P1</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-6 w-6 border-2 border-white -ml-2">
                      <AvatarFallback className="bg-[#09261E]/70 text-white text-xs">P2</AvatarFallback>
                    </Avatar>
                    <span className="ml-2 text-xs text-gray-500">2 properties queued for comparison</span>
                  </div>
                  
                  <Button className="w-full bg-[#09261E] hover:bg-[#09261E]/90 group-hover:shadow-md transition-shadow">
                    Open Comparison
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden hover:shadow-md transition-shadow group">
                <div className="bg-gradient-to-br from-[#09261E]/20 to-[#09261E]/5 h-2 w-full"></div>
                <CardContent className="pt-6">
                  <div className="flex items-start mb-4">
                    <div className="h-12 w-12 rounded-lg bg-[#09261E]/10 flex items-center justify-center text-[#09261E] mr-4">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Budget Planner</h3>
                      <p className="text-sm text-gray-500">Plan your investment budget</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Purchase Budget</span>
                        <span>$1.2M / $2M</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Rehab Budget</span>
                        <span>$120K / $300K</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Reserve Funds</span>
                        <span>$50K / $100K</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-[#09261E] hover:bg-[#09261E]/90 group-hover:shadow-md transition-shadow">
                    Open Budget Planner
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden hover:shadow-md transition-shadow group">
                <div className="bg-gradient-to-br from-[#09261E]/20 to-[#09261E]/5 h-2 w-full"></div>
                <CardContent className="pt-6">
                  <div className="flex items-start mb-4">
                    <div className="h-12 w-12 rounded-lg bg-[#09261E]/10 flex items-center justify-center text-[#09261E] mr-4">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">ROI Target Tracker</h3>
                      <p className="text-sm text-gray-500">Track investment goals</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-center relative mb-2">
                      <div className="h-24 w-24 rounded-full border-4 border-[#09261E]/10 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-[#09261E]/10 flex items-center justify-center">
                          <span className="text-2xl font-bold text-[#09261E]">7.5%</span>
                        </div>
                      </div>
                      <div className="absolute -right-2 -top-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        On Target
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-500">
                      Current ROI vs Annual Target (7%)
                    </p>
                  </div>
                  
                  <Button className="w-full bg-[#09261E] hover:bg-[#09261E]/90 group-hover:shadow-md transition-shadow">
                    View Targets
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden hover:shadow-md transition-shadow group">
                <div className="bg-gradient-to-br from-[#09261E]/20 to-[#09261E]/5 h-2 w-full"></div>
                <CardContent className="pt-6">
                  <div className="flex items-start mb-4">
                    <div className="h-12 w-12 rounded-lg bg-[#09261E]/10 flex items-center justify-center text-[#09261E] mr-4">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Deal Flow Timeline</h3>
                      <p className="text-sm text-gray-500">Track property timelines</p>
                    </div>
                  </div>
                  
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-xs text-gray-600 flex-1">Viewing scheduled for Modern Townhouse</span>
                      <span className="text-xs">Apr 25</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                      <span className="text-xs text-gray-600 flex-1">Offer deadline for Victorian House</span>
                      <span className="text-xs">Apr 24</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-xs text-gray-600 flex-1">Pre-approval expiration</span>
                      <span className="text-xs">May 15</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-[#09261E] mr-2"></div>
                      <span className="text-xs text-gray-600 flex-1">Property tax due for Ranch Home</span>
                      <span className="text-xs">Jun 01</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-[#09261E] hover:bg-[#09261E]/90 group-hover:shadow-md transition-shadow">
                    View Timeline
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6 text-center">
              <Button variant="outline" className="bg-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Custom Tool
              </Button>
            </div>
          </div>
          
          {/* Property Roadmap */}
          <Card className="shadow-md">
            <CardHeader className="bg-[#09261E]/5">
              <div className="flex justify-between items-center">
                <CardTitle className="text-[#09261E] flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" /> Property Roadmap
                </CardTitle>
                <select className="text-sm border border-gray-200 rounded-md px-3 py-1 bg-white">
                  <option>Modern Townhouse</option>
                  <option>Ranch Home</option>
                  <option>+ Add New Property</option>
                </select>
              </div>
              <CardDescription>
                Track your progress with Modern Townhouse
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-2">
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-green-50 rounded-md cursor-pointer hover:bg-green-100 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-sm font-medium">Viewing Scheduled</p>
                      <p className="text-xs text-green-600 ml-2">(Completed Apr 18)</p>
                    </div>
                    <p className="text-xs text-gray-600">You've scheduled a viewing with John Davis</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-[#09261E]">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center p-3 bg-amber-50 rounded-md cursor-pointer hover:bg-amber-100 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-3">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-sm font-medium">Pre-approval Status</p>
                      <p className="text-xs text-amber-600 ml-2">(In Progress)</p>
                    </div>
                    <p className="text-xs text-gray-600">Lender is reviewing your application</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-[#09261E]">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 border border-dashed border-gray-200 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mr-3">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-sm font-medium">Offer Flow</p>
                      <p className="text-xs text-gray-500 ml-2">(Not Started)</p>
                    </div>
                    <p className="text-xs text-gray-600">Prepare and submit offer documents</p>
                  </div>
                  <Button size="sm" variant="outline">Start</Button>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 border border-dashed border-gray-200 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mr-3">
                    <Search className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-sm font-medium">Due Diligence</p>
                      <p className="text-xs text-gray-500 ml-2">(Not Started)</p>
                    </div>
                    <p className="text-xs text-gray-600">Inspections, title review, and final evaluations</p>
                  </div>
                  <Button size="sm" variant="outline" disabled>Locked</Button>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 border border-dashed border-gray-200 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mr-3">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-sm font-medium">Closing Preparation</p>
                      <p className="text-xs text-gray-500 ml-2">(Not Started)</p>
                    </div>
                    <p className="text-xs text-gray-600">Final walkthrough and closing documents</p>
                  </div>
                  <Button size="sm" variant="outline" disabled>Locked</Button>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" /> Contact Owner
                </Button>
                <Button className="w-full bg-[#09261E] hover:bg-[#09261E]/90">
                  <ArrowRight className="mr-2 h-4 w-4" /> Continue Process
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          {/* Buyer Goals Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-[#09261E]">Your Investment Goals</h3>
                <p className="text-sm text-gray-500">Track your progress towards your real estate portfolio</p>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" /> Update Goals
              </Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <Card className="border-t-4 border-t-[#09261E]">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 text-[#09261E] mr-2" />
                      <h3 className="font-medium">Annual Goal</h3>
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">In Progress</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">1 / 4 Properties</h2>
                  <p className="text-sm text-gray-500 mb-3">Acquired in 2025</p>
                  <Progress value={25} className="h-2 bg-gray-100" indicatorColor="bg-[#09261E]" />
                  <p className="text-xs text-gray-500 mt-2">25% completed • You're behind pace by 1 property</p>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-t-[#09261E]">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 text-[#09261E] mr-2" />
                      <h3 className="font-medium">Market Focus</h3>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">75% Milwaukee</h2>
                  <p className="text-sm text-gray-500 mb-3">15% Chicago • 10% Other</p>
                  <div className="flex gap-1 items-center h-2 mb-3">
                    <div className="h-full bg-[#09261E] rounded-l-full w-[75%]"></div>
                    <div className="h-full bg-[#09261E]/60 w-[15%]"></div>
                    <div className="h-full bg-gray-300 rounded-r-full w-[10%]"></div>
                  </div>
                  <p className="text-xs text-gray-500">Most saved properties are in Milwaukee</p>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-t-[#09261E]">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <PieChart className="h-5 w-5 text-[#09261E] mr-2" />
                      <h3 className="font-medium">Investment Type</h3>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#09261E] text-white text-lg font-semibold">60%</div>
                      <p className="text-xs mt-1">Fix & Flip</p>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#09261E]/30 text-[#09261E] text-lg font-semibold">40%</div>
                      <p className="text-xs mt-1">Buy & Hold</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">Based on properties viewed and saved</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <Button className="bg-[#09261E]">
                <Search className="mr-2 h-4 w-4" /> Source More Deals
              </Button>
            </div>
          </div>
          
          {/* ROI Analytics Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#09261E]">Deal Performance</h3>
                <p className="text-sm text-gray-500">Tracking your real estate portfolio metrics</p>
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm" className="bg-[#09261E]/5 border-[#09261E]">
                  Last 12 Months
                </Button>
                <Button variant="outline" size="sm">
                  All Time
                </Button>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-4 mb-6">
              <Card>
                <CardContent className="pt-6 text-center">
                  <CircleDollarSign className="h-8 w-8 mx-auto mb-2 text-[#09261E]" />
                  <h3 className="text-2xl font-bold">$410,000</h3>
                  <p className="text-sm text-gray-500">Avg. Purchase Price</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 text-center">
                  <BarChart className="h-8 w-8 mx-auto mb-2 text-[#09261E]" />
                  <h3 className="text-2xl font-bold">8.3%</h3>
                  <p className="text-sm text-gray-500">Avg. Annual ROI</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-[#09261E]" />
                  <h3 className="text-2xl font-bold">68 days</h3>
                  <p className="text-sm text-gray-500">Avg. Time to Close</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-[#09261E]" />
                  <h3 className="text-2xl font-bold">4</h3>
                  <p className="text-sm text-gray-500">Team Members Used</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h4 className="font-medium mb-3 flex items-center text-[#09261E]">
                <TrendingUp className="h-4 w-4 mr-2" /> Performance Breakdown
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm">Colonial Revival</p>
                    <p className="text-sm font-medium">9.7% ROI</p>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '97%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm">Duplex Unit</p>
                    <p className="text-sm font-medium">8.2% ROI</p>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm">Townhouse Flip</p>
                    <p className="text-sm font-medium">7.1% ROI</p>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '71%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  View Full Performance Report
                </Button>
              </div>
            </div>
          </div>
          
          {/* AI Insights Placeholder */}
          <Card className="bg-gradient-to-r from-[#09261E]/10 to-transparent overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-[#09261E]/10 p-3 rounded-full">
                  <BadgePercent className="h-6 w-6 text-[#09261E]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">Powered by PD AI (Coming Soon)</h3>
                  <p className="text-sm text-gray-600 mb-3">Advanced insights to help you make smarter investment decisions</p>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> "Show me cash-flowing duplexes in my price range"
                    </p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> "Estimate holding costs if I buy this property"
                    </p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> "Predict top-performing zip codes based on my criteria"
                    </p>
                  </div>
                </div>
                <Button className="bg-[#09261E]">Join Waitlist</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="priority" className="space-y-6">
          {/* Priority Buyer Application */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-[#09261E] to-[#135341] p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Priority Buyer Program</h2>
              <p className="text-white/80">Get exclusive early access to off-market deals and premium features</p>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold mb-4">Membership Benefits</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Early Access to Listings</p>
                        <p className="text-sm text-gray-500">Get 24-hour exclusive access to new deals before they go public</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Priority Badge</p>
                        <p className="text-sm text-gray-500">Stand out to sellers and REPs with a verified buyer badge</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Off-Market Deal Network</p>
                        <p className="text-sm text-gray-500">Access to exclusive deals not available to the general public</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Premium Analytics</p>
                        <p className="text-sm text-gray-500">Advanced ROI calculations and market insights</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Dedicated REP Matching</p>
                        <p className="text-sm text-gray-500">Get matched with top-performing real estate pros in your target areas</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-4">Apply for Priority Status</h3>
                  <p className="text-sm text-gray-500 mb-4">Complete a simple qualification process to gain access to our most exclusive deals and features.</p>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm font-medium mb-1">What's your investment budget?</p>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Investment budget" 
                          className="w-full pl-10 pr-4 py-2 border rounded-md" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">How many properties do you plan to buy this year?</p>
                      <select className="w-full p-2 border rounded-md">
                        <option>1-2 properties</option>
                        <option>3-5 properties</option>
                        <option>6+ properties</option>
                      </select>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Do you have financing pre-approval?</p>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input type="radio" name="financing" className="mr-2" />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="financing" className="mr-2" />
                          <span>No</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="financing" className="mr-2" />
                          <span>Cash buyer</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-[#09261E]">
                    Submit Application
                  </Button>
                  
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Applications are typically reviewed within 24-48 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Priority Listings Preview */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#09261E] mb-4">Preview: Priority-Only Listings</h3>
            <p className="text-sm text-gray-500 mb-6">These deals are currently only available to Priority Buyers</p>
            
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="overflow-hidden hover:shadow-md transition-shadow opacity-70 hover:opacity-100">
                <div className="relative">
                  <div className="w-full h-40 bg-gray-200"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center">
                    <div className="bg-white/90 px-3 py-2 rounded-md">
                      <span className="text-[#09261E] font-semibold">Priority Access Only</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">Off-Market Duplex</h3>
                    <p className="font-bold">$385,000</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">4 bed • 2 bath • Milwaukee</p>
                  <p className="text-xs text-green-700 mb-1">Pre-market opportunity • 12% Est. ROI</p>
                  <Button size="sm" className="w-full bg-gray-300" disabled>Join Priority to View</Button>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden hover:shadow-md transition-shadow opacity-70 hover:opacity-100">
                <div className="relative">
                  <div className="w-full h-40 bg-gray-200"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center">
                    <div className="bg-white/90 px-3 py-2 rounded-md">
                      <span className="text-[#09261E] font-semibold">Priority Access Only</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">Pocket Listing - Ranch</h3>
                    <p className="font-bold">$295,000</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">3 bed • 2 bath • Chicago</p>
                  <p className="text-xs text-green-700 mb-1">Exclusive • Motivated seller</p>
                  <Button size="sm" className="w-full bg-gray-300" disabled>Join Priority to View</Button>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden hover:shadow-md transition-shadow opacity-70 hover:opacity-100">
                <div className="relative">
                  <div className="w-full h-40 bg-gray-200"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center">
                    <div className="bg-white/90 px-3 py-2 rounded-md">
                      <span className="text-[#09261E] font-semibold">Priority Access Only</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">Multi-Unit Pre-Market</h3>
                    <p className="font-bold">$522,000</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">6 units • Detroit</p>
                  <p className="text-xs text-green-700 mb-1">Cash flow positive • 10.5% cap rate</p>
                  <Button size="sm" className="w-full bg-gray-300" disabled>Join Priority to View</Button>
                </CardContent>
              </Card>
            </div>
          </div>
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