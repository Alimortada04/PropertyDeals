import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  CalendarDays, Search, Home, Building, DollarSign, MessageSquare, Plus, 
  Edit, Trash2, Eye, BarChart3, Clock, BellRing, AlertCircle, ChevronRight,
  FileText, CheckCircle, ArrowUpRight, Camera, Upload, MapPin, PlusCircle,
  LayoutDashboard, LineChart, Pencil, Star, List, Briefcase, ChevronLeft,
  Gauge, Settings, SendHorizontal, Filter, PieChart, ClipboardCheck, BookOpen,
  Calculator, Mail, FileUp, BarChart, LayoutList, Users, Sparkles, Phone, Image,
  Bell
} from 'lucide-react';

export default function SellerDashboard() {
  // State for conversation view and notifications
  const [showConversationDetail, setShowConversationDetail] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  return (
    <div className="pt-20 sm:pt-24 md:pt-20 p-4 sm:p-6 md:p-12 space-y-8">
      {/* Main tabs design with green active state and grey hover - mobile responsive with sticky positioning */}
      <Tabs defaultValue="mydeals" className="mb-6">
        <div className="mb-6 md:mb-8 sticky top-0 z-30 bg-white/95 backdrop-blur-sm pt-2 pb-3 -mt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-12 md:px-12">
          <div className="overflow-x-auto pb-1">
            <TabsList className="bg-white rounded-xl p-1.5 flex w-full md:w-full border border-gray-200 shadow-sm min-w-max">
              <TabsTrigger 
                value="mydeals" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#135341] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[100px]"
              >
                My Deals
              </TabsTrigger>
              <TabsTrigger 
                value="pipeline" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#135341] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[100px]"
              >
                Pipeline
              </TabsTrigger>
              <TabsTrigger 
                value="messages" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#135341] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[100px]"
              >
                Messages
              </TabsTrigger>
              <TabsTrigger 
                value="offers" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#135341] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[100px]"
              >
                Offers
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#135341] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[100px]"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#135341] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[100px]"
              >
                Resources
              </TabsTrigger>
              <TabsTrigger 
                value="tools" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#135341] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[100px]"
              >
                Tools
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        {/* My Deals Tab Content */}
        <TabsContent value="mydeals" className="mt-6">
          {/* Command Center Header */}
          <div className="bg-white shadow-md rounded-lg mb-8 overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-[#135341]/10 to-transparent p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-3 text-[#135341]">Welcome back, Sarah</h1>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-700 font-medium">Seller Profile Completion</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 ml-1">
                              <AlertCircle className="h-4 w-4 text-[#135341]" />
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
                                  <span className="text-gray-500">Add first property</span>
                                </li>
                                <li className="flex items-center">
                                  <div className="h-4 w-4 border border-gray-300 rounded-full mr-2 flex items-center justify-center">
                                    <span className="text-[9px] font-medium">3</span>
                                  </div>
                                  <span>Connect to title company</span>
                                </li>
                                <li className="flex items-center">
                                  <div className="h-4 w-4 border border-gray-300 rounded-full mr-2 flex items-center justify-center">
                                    <span className="text-[9px] font-medium">4</span>
                                  </div>
                                  <span>Upload assignment contract template</span>
                                </li>
                                <li className="flex items-center">
                                  <div className="h-4 w-4 border border-gray-300 rounded-full mr-2 flex items-center justify-center">
                                    <span className="text-[9px] font-medium">5</span>
                                  </div>
                                  <span>Add cash buyer list</span>
                                </li>
                              </ul>
                              <div className="mt-3">
                                <Button size="sm" className="w-full bg-[#135341]">Complete Setup</Button>
                              </div>
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <span className="text-sm font-medium">40%</span>
                    </div>
                    <Progress value={40} className="h-2 bg-gray-100" indicatorColor="bg-[#135341]" />
                  </div>
                </div>
                
                {/* Notifications and Actions */}
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
                        <span className="text-xs text-[#135341] cursor-pointer hover:underline">Mark all as read</span>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem className="p-3 cursor-pointer">
                          <div className="flex items-start gap-2">
                            <BellRing className="h-5 w-5 text-[#135341] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium">New offer on Colonial Revival</p>
                              <p className="text-xs text-gray-500">Just now</p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="p-3 cursor-pointer">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium">Inspection period ending soon</p>
                              <p className="text-xs text-gray-500">2 hours ago</p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="p-3 cursor-pointer">
                          <div className="flex items-start gap-2">
                            <Clock className="h-5 w-5 text-[#135341] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium">Viewing request: Modern Farmhouse</p>
                              <p className="text-xs text-gray-500">Yesterday, 4:00 PM</p>
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
            
            {/* Key Stats for Seller */}
            <div className="grid grid-cols-4 divide-x border-t">
              <div className="p-4 text-center">
                <p className="text-sm font-medium text-gray-500">Active Listings</p>
                <p className="text-xl font-bold text-[#135341]">3</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-medium text-gray-500">Avg. Days Listed</p>
                <p className="text-xl font-bold text-[#135341]">12</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-medium text-gray-500">Pending Offers</p>
                <p className="text-xl font-bold text-[#135341]">5</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-medium text-gray-500">Assignment Revenue</p>
                <p className="text-xl font-bold text-[#135341]">$42,500</p>
              </div>
            </div>
          </div>
          
          {/* Property Cards Grid - with Add New CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Add New Property Card */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow border border-dashed border-gray-300 bg-gray-50 flex flex-col justify-center items-center p-8 h-full min-h-[300px] group cursor-pointer">
              <div className="h-16 w-16 rounded-full bg-[#135341]/10 flex items-center justify-center mb-4 group-hover:bg-[#135341]/20 transition-colors">
                <Plus className="h-8 w-8 text-[#135341]" />
              </div>
              <h3 className="text-lg font-bold text-[#135341] mb-2">Add New Property</h3>
              <p className="text-sm text-gray-500 text-center mb-6">Quickly list a new property and get it in front of buyers</p>
              <Button className="bg-[#135341] hover:bg-[#135341]/90">Add Property</Button>
            </Card>
            
            {/* Colonial Revival Card */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow border group">
              <div className="relative h-40 bg-gray-200 overflow-hidden">
                <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">Live</Badge>
                <Badge className="absolute top-2 right-2 bg-[#135341] hover:bg-[#135341]/90">Views: 42</Badge>
                <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9" alt="Colonial Revival" className="h-full w-full object-cover" />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-[#135341]">Colonial Revival</h3>
                    <p className="text-sm text-gray-500">123 Main St, Chicago, IL 60601</p>
                  </div>
                  <Badge variant="outline" className="bg-[#135341]/10 text-[#135341] border-[#135341]/30">$625,000</Badge>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">5 bed</Badge>
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">3.5 bath</Badge>
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">3,200 sqft</Badge>
                  <Badge variant="outline" className="text-xs">ARV: $725k</Badge>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" /> 42 views
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" /> 8 inquiries
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> Listed 12 days ago
                  </span>
                </div>
                
                <div className="flex justify-between items-center space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" /> Details
                  </Button>
                  <Button size="sm" className="flex-1 bg-[#135341]">
                    <DollarSign className="h-4 w-4 mr-1" /> Offers (3)
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Modern Farmhouse Card */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow border group">
              <div className="relative h-40 bg-gray-200 overflow-hidden">
                <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">Under Contract</Badge>
                <Badge className="absolute top-2 right-2 bg-[#135341] hover:bg-[#135341]/90">Views: 68</Badge>
                <img src="https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d" alt="Modern Farmhouse" className="h-full w-full object-cover" />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-[#135341]">Modern Farmhouse</h3>
                    <p className="text-sm text-gray-500">456 Oak St, Chicago, IL 60607</p>
                  </div>
                  <Badge variant="outline" className="bg-[#135341]/10 text-[#135341] border-[#135341]/30">$459,000</Badge>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">4 bed</Badge>
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">3 bath</Badge>
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">2,800 sqft</Badge>
                  <Badge variant="outline" className="text-xs">ARV: $550k</Badge>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" /> 68 views
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" /> 12 inquiries
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> Listed 5 days ago
                  </span>
                </div>
                
                <div className="flex justify-between items-center space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" /> Details
                  </Button>
                  <Button size="sm" className="flex-1 bg-amber-500">
                    <FileText className="h-4 w-4 mr-1" /> Contract
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Modern Condo Card */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow border group">
              <div className="relative h-40 bg-gray-200 overflow-hidden">
                <Badge className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600">Assigned</Badge>
                <Badge className="absolute top-2 right-2 bg-[#135341] hover:bg-[#135341]/90">Views: 55</Badge>
                <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267" alt="Modern Condo" className="h-full w-full object-cover" />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-[#135341]">Modern Condo</h3>
                    <p className="text-sm text-gray-500">789 Pine Ave, Chicago, IL 60611</p>
                  </div>
                  <Badge variant="outline" className="bg-[#135341]/10 text-[#135341] border-[#135341]/30">$339,900</Badge>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">2 bed</Badge>
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">2 bath</Badge>
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">1,200 sqft</Badge>
                  <Badge variant="outline" className="text-xs">ARV: $375k</Badge>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" /> 55 views
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" /> 6 inquiries
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-blue-500" /> Assigned $18,500
                  </span>
                </div>
                
                <div className="flex justify-between items-center space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" disabled>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" /> Details
                  </Button>
                  <Button size="sm" className="flex-1 bg-blue-500">
                    <FileText className="h-4 w-4 mr-1" /> Close Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Smart Prompts Section */}
          <Card className="border border-amber-200 bg-amber-50 mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-800 flex items-center text-lg">
                <Sparkles className="h-5 w-5 mr-2 text-amber-600" /> Smart Prompts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-2 bg-white rounded-md border border-amber-100">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-900">Inspection period ending tomorrow for Modern Farmhouse</p>
                    <p className="text-xs text-amber-700 mt-1">Schedule a walkthrough with the buyer to ensure all is on track for closing.</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-amber-400 text-amber-700 hover:bg-amber-100">
                    Schedule Now
                  </Button>
                </div>
                
                <div className="flex items-start gap-3 p-2 bg-white rounded-md border border-amber-100">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Eye className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-900">Colonial Revival has 6 new views in the last 24 hours</p>
                    <p className="text-xs text-amber-700 mt-1">Consider following up with interested parties to encourage offers.</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-amber-400 text-amber-700 hover:bg-amber-100">
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Messages Tab Content */}
        <TabsContent value="messages" className="space-y-4">
          {/* Messaging Interface - Mobile Optimized (iMessage/Facebook style) */}
          <div className="bg-white rounded-lg shadow-md border overflow-hidden">
            <div className="md:flex h-[600px]">
              {/* Left sidebar with conversations - full width on mobile, hidden when viewing a conversation */}
              <div 
                className={`w-full md:w-1/3 md:border-r overflow-y-auto h-full ${showConversationDetail ? 'hidden' : 'block'} md:block`}
              >
                <div className="p-3 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Messages</h3>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Filter className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Search className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex mt-2 border rounded-md overflow-hidden">
                    <Button variant="ghost" className="flex-1 rounded-none py-1 px-2 text-xs bg-[#135341] text-white hover:bg-[#135341]/90">All</Button>
                    <Button variant="ghost" className="flex-1 rounded-none py-1 px-2 text-xs hover:bg-gray-100">Unread</Button>
                    <Button variant="ghost" className="flex-1 rounded-none py-1 px-2 text-xs hover:bg-gray-100">Offers</Button>
                  </div>
                </div>
                
                <div className="divide-y">
                  <div 
                    className="p-3 hover:bg-gray-50 cursor-pointer bg-[#135341]/5"
                    onClick={() => setShowConversationDetail(true)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-700 font-medium">
                        MB
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium truncate">Michael Brown (Buyer)</p>
                          <p className="text-xs text-gray-500">2h</p>
                        </div>
                        <div className="flex items-center">
                          <Badge className="h-2 w-2 rounded-full bg-[#135341] mr-1.5 p-0" variant="default" />
                          <p className="text-xs text-gray-600 truncate">I'd like to submit an offer on the Colonial Revival property.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-[#803344]/20 flex items-center justify-center text-[#803344] font-medium">
                        JW
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium truncate">Jennifer Williams (REP)</p>
                          <p className="text-xs text-gray-500">1d</p>
                        </div>
                        <p className="text-xs text-gray-600 truncate">I have a buyer interested in your Modern Farmhouse...</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 font-medium">
                        TC
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium truncate">Title Company</p>
                          <p className="text-xs text-gray-500">3d</p>
                        </div>
                        <p className="text-xs text-gray-600 truncate">We've completed our title search for the Modern Condo...</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-green-600/20 flex items-center justify-center text-green-700 font-medium">
                        KT
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium truncate">Kevin Thompson (Buyer)</p>
                          <p className="text-xs text-gray-500">4d</p>
                        </div>
                        <p className="text-xs text-gray-600 truncate">Thanks for accepting my offer! When can we schedule...</p>
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
              
              {/* Main chat area - conditionally shown/hidden based on mobile state */}
              <div className={`${showConversationDetail ? 'flex' : 'hidden'} md:flex w-full md:w-2/3 flex-col h-full`}>
                <div className="p-3 border-b flex items-center justify-between sticky top-0 bg-white z-20">
                  <div className="flex items-center">
                    <button 
                      className="h-8 w-8 flex items-center justify-center mr-2 text-gray-600 md:hidden"
                      onClick={() => setShowConversationDetail(false)}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="h-10 w-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-700 font-medium mr-2">
                      MB
                    </div>
                    <div>
                      <p className="font-medium">Michael Brown</p>
                      <p className="text-xs text-gray-500">Buyer • Colonial Revival</p>
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
                      <div className="h-8 w-8 rounded-full bg-blue-600/20 flex-shrink-0 flex items-center justify-center text-blue-700 font-medium mr-1 mb-1 hidden sm:flex">
                        MB
                      </div>
                      <div>
                        <div className="bg-white rounded-2xl rounded-bl-sm p-3 shadow-sm max-w-[85%] sm:max-w-[80%]">
                          <p className="text-sm">Hi Sarah, I'm interested in the Colonial Revival property you have listed. I'd like to submit an offer. What's the best way to proceed?</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-1">10:30 AM</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mb-3">
                    <div>
                      <div className="bg-[#135341] text-white rounded-2xl rounded-br-sm p-3 shadow-sm max-w-[85%] sm:max-w-[80%]">
                        <p className="text-sm">Hello Michael! That's great to hear. I'd be happy to help with the offer process. You can submit your offer directly through the platform by clicking on the property and then "Submit Offer," or I can send you our offer form.</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 mr-1 text-right">10:45 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="flex items-end gap-1">
                      <div className="h-8 w-8 rounded-full bg-blue-600/20 flex-shrink-0 flex items-center justify-center text-blue-700 font-medium mr-1 mb-1 hidden sm:flex">
                        MB
                      </div>
                      <div>
                        <div className="bg-white rounded-2xl rounded-bl-sm p-3 shadow-sm max-w-[85%] sm:max-w-[80%]">
                          <p className="text-sm">Thanks for the quick response. Could you please send me the offer form? Also, is there any flexibility on the asking price?</p>
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
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#135341]/30 text-sm"
                    />
                    <Button size="icon" className="h-9 w-9 p-0 bg-[#135341] rounded-full flex-shrink-0">
                      <SendHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Pipeline Tab - placeholder for now */}
        <TabsContent value="pipeline" className="space-y-6">
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="bg-[#135341]/5">
              <CardTitle className="text-lg font-bold text-[#135341]">Deal Pipeline</CardTitle>
              <CardDescription>Track your active deals through each stage of the process</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <p className="text-gray-500">Pipeline view coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Offers Tab - placeholder for now */}
        <TabsContent value="offers" className="space-y-6">
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="bg-[#135341]/5">
              <CardTitle className="text-lg font-bold text-[#135341]">Offers Management</CardTitle>
              <CardDescription>Review, compare and manage all received offers</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <p className="text-gray-500">Offers management panel coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab - placeholder for now */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="bg-[#135341]/5">
              <CardTitle className="text-lg font-bold text-[#135341]">Performance Analytics</CardTitle>
              <CardDescription>Review your listing performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <p className="text-gray-500">Analytics dashboard coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Resources Tab - placeholder for now */}
        <TabsContent value="resources" className="space-y-6">
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="bg-[#135341]/5">
              <CardTitle className="text-lg font-bold text-[#135341]">Wholesaler Resources</CardTitle>
              <CardDescription>Educational resources to help grow your business</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <p className="text-gray-500">Resource library coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tools Tab - placeholder for now */}
        <TabsContent value="tools" className="space-y-6">
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="bg-[#135341]/5">
              <CardTitle className="text-lg font-bold text-[#135341]">Wholesaler Tools</CardTitle>
              <CardDescription>Specialized tools to streamline your business</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <p className="text-gray-500">Tools section coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}