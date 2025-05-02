import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Home,
  BriefcaseBusiness,
  Map,
  Bell,
  Lightbulb,
  BarChart3,
  Compass,
  Calendar,
  ArrowRight,
  Check,
  Clock,
  Star,
  Building,
  CircleDollarSign,
  ArrowRightLeft
} from "lucide-react";

interface DiscoverTabProps {
  user: {
    name: string;
    avatar: string;
    profileCompletion: number;
  };
}

export default function DashboardDiscoverTab({ user }: DiscoverTabProps) {
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
              <div>
                <h2 className="text-2xl font-bold text-[#09261E]">Welcome back, {user.name || "Buyer"}</h2>
                <div className="flex items-center mt-1">
                  <div className="w-[180px] mr-3">
                    <Progress value={user.profileCompletion} className="h-2" />
                  </div>
                  <p className="text-sm text-gray-600">Profile {user.profileCompletion}% complete</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Command Center */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-[#09261E] mb-4">Command Center</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:border-[#09261E] hover:shadow-md transition-all duration-200 cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#EAF2EF] flex items-center justify-center mb-3">
                <Search className="h-6 w-6 text-[#09261E]" />
              </div>
              <h4 className="font-semibold text-[#09261E] mb-1">Find Properties</h4>
              <p className="text-sm text-gray-500 mb-3">Browse listings based on your preferences</p>
              <Button size="sm" className="bg-[#09261E] hover:bg-[#135341] mt-auto">
                Browse Properties
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:border-[#09261E] hover:shadow-md transition-all duration-200 cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#EAF2EF] flex items-center justify-center mb-3">
                <BriefcaseBusiness className="h-6 w-6 text-[#09261E]" />
              </div>
              <h4 className="font-semibold text-[#09261E] mb-1">Saved Properties</h4>
              <p className="text-sm text-gray-500 mb-3">View and manage your saved properties</p>
              <Button size="sm" className="bg-[#09261E] hover:bg-[#135341] mt-auto">
                View Saved
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:border-[#09261E] hover:shadow-md transition-all duration-200 cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#EAF2EF] flex items-center justify-center mb-3">
                <Map className="h-6 w-6 text-[#09261E]" />
              </div>
              <h4 className="font-semibold text-[#09261E] mb-1">Market Explorer</h4>
              <p className="text-sm text-gray-500 mb-3">Discover high-potential investment areas</p>
              <Button size="sm" className="bg-[#09261E] hover:bg-[#135341] mt-auto">
                Explore Markets
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#09261E]">Recent Activity</h3>
          <Button variant="ghost" className="text-[#09261E] p-0 h-auto hover:bg-transparent hover:text-[#135341]">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
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
          </CardContent>
        </Card>
      </div>
      
      {/* What's New Section */}
      <div>
        <h3 className="text-lg font-semibold text-[#09261E] mb-4">What's New</h3>
        
        <Tabs defaultValue="market">
          <div className="mb-4">
            <TabsList>
              <TabsTrigger value="market">Market Updates</TabsTrigger>
              <TabsTrigger value="tips">Investment Tips</TabsTrigger>
              <TabsTrigger value="events">Upcoming Events</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="market" className="space-y-4">
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
          
          <TabsContent value="tips" className="space-y-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg text-[#09261E]">Cash Flow vs. Appreciation</h4>
                    <p className="text-gray-600 mt-1">Understanding the balance between cash flow and appreciation is key to building a robust real estate portfolio.</p>
                    <div className="mt-3">
                      <Badge className="bg-purple-500">Investment Strategy</Badge>
                      <Badge className="ml-2 bg-amber-500">Featured</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-4 px-5">
                <Button variant="outline" size="sm" className="text-[#09261E] border-[#09261E] hover:bg-[#09261E] hover:text-white">
                  Read Guide
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <ArrowRightLeft className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg text-[#09261E]">1031 Exchange Strategies</h4>
                    <p className="text-gray-600 mt-1">Leverage 1031 exchanges to defer capital gains taxes and grow your investment portfolio more efficiently.</p>
                    <div className="mt-3">
                      <Badge className="bg-indigo-500">Tax Strategy</Badge>
                      <Badge className="ml-2 bg-green-500">Wealth Building</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-4 px-5">
                <Button variant="outline" size="sm" className="text-[#09261E] border-[#09261E] hover:bg-[#09261E] hover:text-white">
                  Read Guide
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="events" className="space-y-4">
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
        </Tabs>
      </div>
    </div>
  );
}