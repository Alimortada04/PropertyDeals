import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Search,
  Home,
  User,
  MessageSquare,
  Calendar,
  BarChart2,
  Bell,
  ChevronRight,
  ArrowRight,
  Check,
  Clock,
  Star,
  Building,
  CircleDollarSign,
  ArrowRightLeft,
  Settings,
  ExternalLink,
  Calculator,
  UserSearch,
  ActivitySquare,
  Sparkles,
  PlusCircle,
  ChevronDown,
  Info
} from "lucide-react";
import { useLocation } from "wouter";

interface DiscoverTabProps {
  user: {
    name: string;
    avatar: string;
    profileCompletion: number;
  };
}

// Mock property data
const recentProperties = [
  {
    id: 1,
    title: "123 Main Street",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    price: "$450,000",
    beds: 3,
    baths: 2, 
    sqft: 1800,
    type: "Single Family",
    date: "2 days ago"
  },
  {
    id: 2,
    title: "456 Park Avenue",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    price: "$750,000",
    beds: 4,
    baths: 3,
    sqft: 2500,
    type: "Colonial",
    date: "3 days ago"
  },
  {
    id: 3,
    title: "789 Oak Drive",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1175&q=80",
    price: "$550,000",
    beds: 3,
    baths: 2.5,
    sqft: 2100,
    type: "Townhouse",
    date: "5 days ago"
  },
  {
    id: 4,
    title: "101 Riverside Lane",
    image: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1278&q=80",
    price: "$620,000",
    beds: 4,
    baths: 3,
    sqft: 2300,
    type: "Cape Cod",
    date: "1 week ago"
  }
];

const profileTasks = [
  { id: 1, task: "Upload profile photo", completed: true },
  { id: 2, task: "Complete personal information", completed: true },
  { id: 3, task: "Set investment preferences", completed: true },
  { id: 4, task: "Add payment method", completed: false },
  { id: 5, task: "Verify phone number", completed: false },
  { id: 6, task: "Set target investment areas", completed: true },
  { id: 7, task: "Define budget range", completed: true },
  { id: 8, task: "Connect with a REP", completed: false }
];

export default function DashboardDiscoverTab({ user }: DiscoverTabProps) {
  const [, setLocation] = useLocation();
  
  return (
    <div>
      {/* Welcome section */}
      <div className="mb-8">
        <Card className="bg-gradient-to-br from-[#EAF2EF] to-white border-0 shadow-sm">
          <CardContent className="pt-6 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 shadow-sm">
                <img 
                  src={user.avatar || "https://ui-avatars.com/api/?name=J+Doe&background=09261E&color=fff"} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#09261E]">Welcome back, {user.name || "Buyer"}</h2>
                <div className="flex items-center mt-1">
                  <div className="w-[180px] mr-3">
                    <Progress value={user.profileCompletion} className="h-2 bg-gray-200">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${user.profileCompletion}%` }} />
                    </Progress>
                  </div>
                  <p className="text-sm text-gray-600">Profile {user.profileCompletion}% complete</p>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                        <Info className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0">
                      <div className="p-4 border-b">
                        <h3 className="font-medium text-[#09261E]">Complete Your Profile</h3>
                        <p className="text-sm text-gray-500">Finish these items to reach 100%</p>
                      </div>
                      <div className="p-2">
                        {profileTasks.map((task) => (
                          <div key={task.id} className="flex items-center p-2">
                            <div className="w-5 h-5 mr-3 flex-shrink-0">
                              {task.completed ? (
                                <Check className="h-5 w-5 text-green-500" />
                              ) : (
                                <PlusCircle className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-[#09261E]'}`}>
                              {task.task}
                            </span>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-[#09261E] border-[#09261E]"
                  onClick={() => setLocation("/profile")}
                >
                  <ExternalLink className="h-4 w-4 mr-1" /> View Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-[#09261E] border-[#09261E]"
                  onClick={() => setLocation("/profile/settings")}
                >
                  <Settings className="h-4 w-4 mr-1" /> Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Primary and Secondary Actions */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Primary action card - Find a Deal */}
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer bg-gradient-to-br from-[#09261E] to-[#135341] text-white">
            <CardContent className="p-6 flex items-center">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mr-4 flex-shrink-0">
                <Search className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-xl text-white mb-1">Find a Deal</h4>
                <p className="text-white/80 text-sm mb-3">Browse our exclusive off-market properties</p>
                <Button size="sm" className="bg-white text-[#09261E] hover:bg-gray-100">
                  Browse Properties
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Primary action card - Connect with Professional */}
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
            <CardContent className="p-6 flex items-center">
              <div className="w-14 h-14 rounded-full bg-[#EAF2EF] flex items-center justify-center mr-4 flex-shrink-0">
                <UserSearch className="h-8 w-8 text-[#09261E]" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-xl text-[#09261E] mb-1">Connect with a Professional</h4>
                <p className="text-gray-600 text-sm mb-3">Find real estate pros that match your needs</p>
                <Button size="sm" className="bg-[#09261E] hover:bg-[#135341]">
                  Browse REPs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Secondary action cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="hover:border-[#09261E] hover:shadow-sm transition-all duration-200 cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-[#EAF2EF] flex items-center justify-center mb-2">
                <MessageSquare className="h-5 w-5 text-[#09261E]" />
              </div>
              <h4 className="font-medium text-sm text-[#09261E]">Check Messages</h4>
              <Badge className="mt-2 bg-red-500">3 New</Badge>
            </CardContent>
          </Card>
          
          <Card className="hover:border-[#09261E] hover:shadow-sm transition-all duration-200 cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-[#EAF2EF] flex items-center justify-center mb-2">
                <ActivitySquare className="h-5 w-5 text-[#09261E]" />
              </div>
              <h4 className="font-medium text-sm text-[#09261E]">Manage My Activity</h4>
            </CardContent>
          </Card>
          
          <Card className="hover:border-[#09261E] hover:shadow-sm transition-all duration-200 cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-[#EAF2EF] flex items-center justify-center mb-2">
                <Calculator className="h-5 w-5 text-[#09261E]" />
              </div>
              <h4 className="font-medium text-sm text-[#09261E]">Run Numbers</h4>
            </CardContent>
          </Card>
          
          <Card className="hover:border-[#09261E] hover:shadow-sm transition-all duration-200 cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-[#EAF2EF] flex items-center justify-center mb-2">
                <Sparkles className="h-5 w-5 text-[#09261E]" />
              </div>
              <h4 className="font-medium text-sm text-[#09261E]">New Updates</h4>
              <Badge className="mt-2 bg-green-500">2 New</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#09261E]">Recent Activity</h3>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-[#09261E] p-0 h-auto hover:bg-transparent hover:text-[#135341]">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Recent Activity</DialogTitle>
              </DialogHeader>
              <div className="divide-y divide-gray-100">
                <div className="p-4 flex items-start">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-[#09261E]">Property viewing scheduled</p>
                    <p className="text-sm text-gray-600">123 Main Street scheduled for May 5, 2025</p>
                    <p className="text-xs text-gray-400 mt-1">Today at 10:34 AM</p>
                  </div>
                </div>
                
                <div className="p-4 flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-[#09261E]">New property match</p>
                    <p className="text-sm text-gray-600">New listing matches your saved search criteria</p>
                    <p className="text-xs text-gray-400 mt-1">Yesterday at 4:15 PM</p>
                  </div>
                </div>
                
                <div className="p-4 flex items-start">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-[#09261E]">Added property to favorites</p>
                    <p className="text-sm text-gray-600">456 Oak Drive added to your favorites</p>
                    <p className="text-xs text-gray-400 mt-1">April 28, 2025</p>
                  </div>
                </div>
                
                <div className="p-4 flex items-start">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-[#09261E]">Reminder created</p>
                    <p className="text-sm text-gray-600">Follow-up with agent about financing options</p>
                    <p className="text-xs text-gray-400 mt-1">April 26, 2025</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex space-x-4">
            <Card className="w-72 flex-shrink-0 hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-[#09261E] text-sm">Property viewing scheduled</p>
                    <p className="text-xs text-gray-600">123 Main Street for May 5</p>
                    <p className="text-xs text-gray-400 mt-1">Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="w-72 flex-shrink-0 hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-[#09261E] text-sm">New property match</p>
                    <p className="text-xs text-gray-600">Matches your search criteria</p>
                    <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="w-72 flex-shrink-0 hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-[#09261E] text-sm">Added to favorites</p>
                    <p className="text-xs text-gray-600">456 Oak Drive</p>
                    <p className="text-xs text-gray-400 mt-1">April 28</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="w-72 flex-shrink-0 hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-[#09261E] text-sm">Reminder created</p>
                    <p className="text-xs text-gray-600">Follow-up with agent</p>
                    <p className="text-xs text-gray-400 mt-1">April 26</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* What's New Section */}
      <div>
        <h3 className="text-lg font-semibold text-[#09261E] mb-4">What's New</h3>
        
        <Tabs defaultValue="deals" className="w-full">
          <TabsList className="w-full bg-white rounded-lg h-auto p-1 mb-4">
            <TabsTrigger 
              value="deals" 
              className="data-[state=active]:bg-[#09261E] data-[state=active]:text-white flex-1 rounded-md py-2"
            >
              New Deals For You
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="data-[state=active]:bg-[#09261E] data-[state=active]:text-white flex-1 rounded-md py-2"
            >
              Upcoming Events
            </TabsTrigger>
            <TabsTrigger 
              value="updates" 
              className="data-[state=active]:bg-[#09261E] data-[state=active]:text-white flex-1 rounded-md py-2"
            >
              Platform Updates
            </TabsTrigger>
            <TabsTrigger 
              value="market" 
              className="data-[state=active]:bg-[#09261E] data-[state=active]:text-white flex-1 rounded-md py-2"
            >
              Market Updates
            </TabsTrigger>
          </TabsList>
          
          {/* New Deals Tab */}
          <TabsContent value="deals" className="mt-0">
            <div className="overflow-x-auto pb-4 hide-scrollbar">
              <div className="flex space-x-4">
                {recentProperties.map((property) => (
                  <Card key={property.id} className="w-72 flex-shrink-0 hover:shadow-md transition-all duration-200">
                    <div className="h-36 relative">
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-2 right-2 bg-[#09261E]">New</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-medium text-[#09261E]">{property.title}</h4>
                      <p className="text-lg font-bold text-[#09261E]">{property.price}</p>
                      <div className="flex text-sm text-gray-500 mt-1">
                        <span className="mr-2">{property.beds} bd</span>
                        <span className="mr-2">{property.baths} ba</span>
                        <span>{property.sqft} sqft</span>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <Badge variant="outline" className="bg-gray-50 text-gray-600 font-normal">
                          {property.type}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-8 text-[#09261E]">
                          View <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4 mt-0">
            <Card>
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg text-[#09261E]">Investment Property Workshop</h4>
                    <p className="text-gray-600 mt-1">Join us for a comprehensive workshop on evaluating and acquiring investment properties. Virtual and in-person options available.</p>
                    <div className="mt-2">
                      <p className="text-sm text-amber-600 font-medium">May 15, 2025 • 6:00 PM - 8:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-4 px-5">
                <Button variant="outline" size="sm" className="text-[#09261E] border-[#09261E] hover:bg-[#09261E] hover:text-white mr-2">
                  Register
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500">
                  Add to Calendar
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Home className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg text-[#09261E]">Multi-Family Property Tour</h4>
                    <p className="text-gray-600 mt-1">Exclusive tour of newly listed multi-family properties in high-demand neighborhoods. Limited spots available.</p>
                    <div className="mt-2">
                      <p className="text-sm text-red-600 font-medium">May 20, 2025 • 10:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-4 px-5">
                <Button variant="outline" size="sm" className="text-[#09261E] border-[#09261E] hover:bg-[#09261E] hover:text-white mr-2">
                  RSVP
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500">
                  Add to Calendar
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Platform Updates Tab */}
          <TabsContent value="updates" className="space-y-4 mt-0">
            <Card>
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg text-[#09261E]">New Buyer Dashboard</h4>
                    <p className="text-gray-600 mt-1">We've launched a brand new dashboard experience designed specifically for buyers, with improved deal tracking and property matching.</p>
                    <div className="mt-3">
                      <Badge className="bg-blue-500">New Feature</Badge>
                      <Badge className="ml-2 bg-green-500">Buyer Tools</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-4 px-5">
                <Button variant="outline" size="sm" className="text-[#09261E] border-[#09261E] hover:bg-[#09261E] hover:text-white">
                  Learn More
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Calculator className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg text-[#09261E]">Enhanced Analysis Tools</h4>
                    <p className="text-gray-600 mt-1">Our investment calculators now include advanced features for better cash flow analysis and ROI projections.</p>
                    <div className="mt-3">
                      <Badge className="bg-indigo-500">Tools Update</Badge>
                      <Badge className="ml-2 bg-amber-500">Featured</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-4 px-5">
                <Button variant="outline" size="sm" className="text-[#09261E] border-[#09261E] hover:bg-[#09261E] hover:text-white">
                  Try It Now
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Market Updates Tab */}
          <TabsContent value="market" className="space-y-4 mt-0">
            <Card>
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg text-[#09261E]">Market Trend: Downtown Properties</h4>
                    <p className="text-gray-600 mt-1">Downtown properties have seen a 12% increase in value over the past quarter, making it a hot market for investors looking for appreciation.</p>
                    <div className="mt-3">
                      <Badge className="bg-blue-500">Market Trend</Badge>
                      <Badge className="ml-2 bg-green-500">Appreciation</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-4 px-5">
                <Button variant="outline" size="sm" className="text-[#09261E] border-[#09261E] hover:bg-[#09261E] hover:text-white">
                  Read More
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CircleDollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg text-[#09261E]">Interest Rate Update</h4>
                    <p className="text-gray-600 mt-1">Federal Reserve signals potential rate cut in the coming months. This could positively impact investment property financing.</p>
                    <div className="mt-3">
                      <Badge className="bg-green-500">Interest Rates</Badge>
                      <Badge className="ml-2 bg-blue-500">Financing</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-4 px-5">
                <Button variant="outline" size="sm" className="text-[#09261E] border-[#09261E] hover:bg-[#09261E] hover:text-white">
                  Read More
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}