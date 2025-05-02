import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  AlertCircle, 
  Search, 
  UserPlus, 
  MessageSquare, 
  Activity, 
  Calculator, 
  Bell,
  Heart,
  Eye,
  ArrowRight,
  ChevronRight,
  Home,
  Flag
} from "lucide-react";
import { Link, useLocation } from "wouter";
import PropertyCard from "@/components/properties/property-card";

// Import data
import { properties, recentlyViewed, savedProperties } from "@/data/properties";

interface DiscoverTabProps {
  user: {
    name: string;
    avatar: string;
    profileCompletion: number;
  };
}

export default function DashboardDiscoverTab({ user }: DiscoverTabProps) {
  const [, setLocation] = useLocation();
  
  // Get current date and time for welcome message
  const currentHour = new Date().getHours();
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else if (currentHour >= 18) {
    greeting = "Good evening";
  }
  
  const recommendedProperties = properties.slice(0, 3);
  
  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-[#EAF2EF]">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-[#09261E]">{greeting}, {user.name.split(' ')[0]}</h2>
              <p className="text-gray-600">Welcome to your dashboard</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="border-[#09261E] text-[#09261E] hover:bg-[#09261E] hover:text-white transition-colors"
            onClick={() => setLocation('/profile')}
          >
            View Profile
          </Button>
        </div>
        
        {/* Profile Completion Alert - Only show if profile is incomplete */}
        {user.profileCompletion < 100 && (
          <div className="mt-4">
            <Alert className="border-amber-500 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-800 font-medium">Complete your profile</AlertTitle>
              <AlertDescription className="text-amber-700">
                Your profile is {user.profileCompletion}% complete. Finish setting up your profile to get better property matches.
                <div className="mt-2">
                  <Progress value={user.profileCompletion} className="h-2 bg-amber-200" />
                </div>
                <Button 
                  variant="link" 
                  className="text-amber-700 hover:text-amber-900 p-0 h-auto mt-1"
                  onClick={() => setLocation('/profile/edit')}
                >
                  Complete Profile
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
      
      {/* Command Center */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-[#09261E] mb-4">Command Center</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* First Row - Primary Actions (Larger Cards) */}
          <Card className="col-span-1 sm:col-span-2 lg:col-span-3 hover:shadow-md transition-shadow cursor-pointer bg-[#EAF2EF] border-[#09261E]/10" onClick={() => setLocation('/properties')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#09261E] mb-2">Find a Deal</h3>
                  <p className="text-gray-700">Browse our exclusive off-market properties</p>
                </div>
                <div className="bg-[#09261E] rounded-full p-3">
                  <Search className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1 sm:col-span-2 lg:col-span-3 hover:shadow-md transition-shadow cursor-pointer bg-[#F5F5F5] border-[#09261E]/10" onClick={() => setLocation('/reps')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#09261E] mb-2">Connect with a Professional</h3>
                  <p className="text-gray-700">Find agents, contractors, and other experts</p>
                </div>
                <div className="bg-[#09261E] rounded-full p-3">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Second Row - Secondary Actions (Smaller Cards) */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200" onClick={() => setLocation('/messages')}>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-[100px]">
              <MessageSquare className="h-6 w-6 text-[#09261E] mb-2" />
              <h3 className="font-medium text-[#09261E]">Check Messages</h3>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200" onClick={() => setLocation('/my-activity')}>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-[100px]">
              <Activity className="h-6 w-6 text-[#09261E] mb-2" />
              <h3 className="font-medium text-[#09261E]">Manage My Activity</h3>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200" onClick={() => setLocation('/tools')}>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-[100px]">
              <Calculator className="h-6 w-6 text-[#09261E] mb-2" />
              <h3 className="font-medium text-[#09261E]">Run Numbers</h3>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200" onClick={() => setLocation('/updates')}>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-[100px]">
              <Bell className="h-6 w-6 text-[#09261E] mb-2" />
              <h3 className="font-medium text-[#09261E]">New Updates</h3>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200" onClick={() => setLocation('/saved')}>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-[100px]">
              <Heart className="h-6 w-6 text-[#09261E] mb-2" />
              <h3 className="font-medium text-[#09261E]">Saved Properties</h3>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200" onClick={() => setLocation('/recent')}>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-[100px]">
              <Eye className="h-6 w-6 text-[#09261E] mb-2" />
              <h3 className="font-medium text-[#09261E]">Recently Viewed</h3>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Recent Activity: "Jump Back In" Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#09261E]">Jump Back In</h2>
          <Button 
            variant="link" 
            className="text-[#09261E] hover:text-[#803344]"
            onClick={() => setLocation('/recent')}
          >
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex space-x-4">
            {/* Recently Viewed Properties */}
            {recentlyViewed.map((property) => (
              <div key={`recent-${property.id}`} className="w-[300px] inline-block">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <div className="relative h-36 overflow-hidden">
                    <img 
                      src={property.imageUrl} 
                      alt={property.title} 
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-[#09261E]">
                      {property.status}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-[#09261E] truncate">{property.title}</h3>
                    <p className="text-gray-600 text-sm truncate">{property.address}, {property.city}</p>
                    <p className="text-[#09261E] font-bold mt-1">${property.price.toLocaleString()}</p>
                    <div className="flex mt-2 text-xs text-gray-500">
                      <div className="flex items-center mr-3">
                        <Eye className="h-3 w-3 mr-1" />
                        <span>Recently Viewed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
            
            {/* Other Recent Activities - e.g., Messages */}
            <div className="w-[300px] inline-block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-blue-500">New Message</Badge>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="https://randomuser.me/api/portraits/men/2.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-[#09261E]">John Davis</h3>
                      <p className="text-xs text-gray-600">Property Agent</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm flex-grow">
                    I found a great property that matches your requirements. Would you like to...
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-3 w-full text-[#09261E] border-[#09261E] hover:bg-[#09261E] hover:text-white"
                    onClick={() => setLocation('/messages')}
                  >
                    Reply
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Discussion/Thread Reply */}
            <div className="w-[300px] inline-block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-purple-500">Discussion</Badge>
                    <span className="text-xs text-gray-500">Yesterday</span>
                  </div>
                  <h3 className="font-semibold text-[#09261E] mb-2">Thread: Best Areas in Milwaukee</h3>
                  <p className="text-gray-600 text-sm flex-grow">
                    @sarah.johnson You might also want to check out the Bayview neighborhood for investments...
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-3 w-full text-[#09261E] border-[#09261E] hover:bg-[#09261E] hover:text-white"
                    onClick={() => setLocation('/community')}
                  >
                    View Thread
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
      
      {/* What's New Section */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-[#09261E] mb-4">What's New</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8">
            <Card className="overflow-hidden">
              <CardHeader className="bg-[#EAF2EF] pb-2">
                <CardTitle className="text-[#09261E]">Recommended Properties</CardTitle>
                <CardDescription>Based on your preferences and recent activity</CardDescription>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {recommendedProperties.map((property) => (
                    <Card 
                      key={`recommend-${property.id}`}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setLocation(`/properties/${property.id}`)}
                    >
                      <div className="relative h-36 overflow-hidden">
                        <img 
                          src={property.imageUrl} 
                          alt={property.title} 
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-[#09261E]">
                          {property.status}
                        </Badge>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-[#09261E] truncate text-sm">{property.title}</h3>
                        <p className="text-gray-600 text-xs truncate">{property.address}</p>
                        <p className="text-[#09261E] font-bold mt-1 text-sm">${property.price.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <Button 
                    className="bg-[#09261E] hover:bg-[#803344] text-white"
                    onClick={() => setLocation('/properties')}
                  >
                    Browse All Properties
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-4 flex flex-col gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-[#09261E]">Community Updates</CardTitle>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
                    <Badge className="bg-[#09261E] mt-1">New</Badge>
                    <div>
                      <h4 className="font-medium text-[#09261E]">5 new agents just joined</h4>
                      <p className="text-sm text-gray-600">Find professionals in your target areas</p>
                      <Button 
                        variant="link" 
                        className="text-[#09261E] hover:text-[#803344] p-0 h-auto mt-1"
                        onClick={() => setLocation('/reps')}
                      >
                        View Professionals
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
                    <Badge className="bg-green-600 mt-1">Event</Badge>
                    <div>
                      <h4 className="font-medium text-[#09261E]">Upcoming Webinar: Market Trends</h4>
                      <p className="text-sm text-gray-600">May 5th, 2025 • 6:00 PM</p>
                      <Button 
                        variant="link" 
                        className="text-[#09261E] hover:text-[#803344] p-0 h-auto mt-1"
                        onClick={() => setLocation('/events')}
                      >
                        Register Now
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-amber-500 mt-1">Hot</Badge>
                    <div>
                      <h4 className="font-medium text-[#09261E]">10 new off-market properties added</h4>
                      <p className="text-sm text-gray-600">Exclusive to PropertyDeals members</p>
                      <Button 
                        variant="link" 
                        className="text-[#09261E] hover:text-[#803344] p-0 h-auto mt-1"
                        onClick={() => setLocation('/properties?filter=exclusive')}
                      >
                        View Listings
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Priority CTA */}
            <Card className="bg-[#09261E] text-white border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Ready to make your next move?</CardTitle>
              </CardHeader>
              
              <CardContent className="p-4">
                <p className="mb-4">Schedule a free 30-minute consultation with a PropertyDeals advisor to get personalized help with your next investment.</p>
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-white text-[#09261E] hover:bg-gray-100"
                    onClick={() => setLocation('/schedule-consultation')}
                  >
                    Schedule Consultation
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-white text-white hover:bg-white/10"
                    onClick={() => setLocation('/learn-more')}
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}