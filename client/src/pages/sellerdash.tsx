import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  UserIcon, 
  BadgeCheck, 
  Check,
  ListPlus,
  BarChart3,
  Settings
} from 'lucide-react';

/**
 * SellerDash - Public seller landing page
 */
export default function SellerDash() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Become a PropertyDeals Seller</h1>
        <p className="text-gray-600 mt-2">List, market, and sell your off-market properties</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column: Scrolling features with animations */}
        <div className="relative h-[calc(100vh-200px)] overflow-y-auto scroll-smooth snap-y snap-mandatory pr-4">
          <div className="space-y-20 pb-20">
            {/* Feature 1 - List Deals That Get Seen */}
            <div className="snap-start snap-always py-10 transition-all duration-500 transform translate-y-0 opacity-100">
              <div className="relative">
                <div className="absolute -z-10 top-0 left-0 w-16 h-16 bg-green-50 rounded-full opacity-70"></div>
                <ListPlus className="h-12 w-12 text-[#135341] mb-4" />
                <h2 className="text-2xl font-semibold mb-3">List Deals That Get Seen</h2>
                <p className="text-sm text-gray-600 max-w-lg">
                  Showcase your deals to our network of motivated buyers and investors. 
                  Our platform prioritizes off-market properties and connects you with 
                  serious buyers who are ready to move quickly.
                </p>
              </div>
            </div>
            
            {/* Feature 2 - Smarter Buyer Outreach */}
            <div className="snap-start snap-always py-10 transition-all duration-500 transform translate-y-0 opacity-100">
              <div className="relative">
                <div className="absolute -z-10 top-0 left-0 w-16 h-16 bg-blue-50 rounded-full opacity-70"></div>
                <UserIcon className="h-12 w-12 text-blue-600 mb-4" />
                <h2 className="text-2xl font-semibold mb-3">Smarter Buyer Outreach</h2>
                <p className="text-sm text-gray-600 max-w-lg">
                  Our system helps you connect faster with more aligned buyers. 
                  The matching algorithm identifies buyers looking specifically for 
                  your property type, location, and deal structure.
                </p>
              </div>
            </div>
            
            {/* Feature 3 - Track Analytics & Engagement */}
            <div className="snap-start snap-always py-10 transition-all duration-500 transform translate-y-0 opacity-100">
              <div className="relative">
                <div className="absolute -z-10 top-0 left-0 w-16 h-16 bg-purple-50 rounded-full opacity-70"></div>
                <BarChart3 className="h-12 w-12 text-purple-600 mb-4" />
                <h2 className="text-2xl font-semibold mb-3">Track Analytics & Engagement</h2>
                <p className="text-sm text-gray-600 max-w-lg">
                  Get real-time insights on deal views, clicks, and interest. 
                  Understand which properties are gaining traction and how buyers 
                  interact with your listings through comprehensive analytics.
                </p>
              </div>
            </div>
            
            {/* Feature 4 - Stay Organized Effortlessly */}
            <div className="snap-start snap-always py-10 transition-all duration-500 transform translate-y-0 opacity-100">
              <div className="relative">
                <div className="absolute -z-10 top-0 left-0 w-16 h-16 bg-orange-50 rounded-full opacity-70"></div>
                <Settings className="h-12 w-12 text-orange-600 mb-4" />
                <h2 className="text-2xl font-semibold mb-3">Stay Organized Effortlessly</h2>
                <p className="text-sm text-gray-600 max-w-lg">
                  Track leads, offers, and progress through a streamlined dashboard.
                  All your deal activity is organized in one place with status tracking
                  and important notifications so nothing falls through the cracks.
                </p>
              </div>
            </div>
            
            {/* Testimonials */}
            <div className="snap-start snap-always py-10 transition-all duration-500 transform translate-y-0 opacity-100">
              <h3 className="text-xl font-semibold mb-6">What Our Sellers Say</h3>
              <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/images/testimonial1.jpg" alt="Sarah L." />
                    <AvatarFallback>SL</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Sarah L.</div>
                    <div className="text-sm text-gray-500 mb-2">Real Estate Investor</div>
                    <p className="text-gray-600 text-sm italic">
                      "I've done 5 deals through PropertyDeals in just three months. The buyer network is
                      incredible - I get quality offers much faster than anywhere else."
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="snap-start snap-always py-10 transition-all duration-500 transform translate-y-0 opacity-100">
              <h3 className="text-xl font-semibold mb-6">Platform Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm">
                  <div className="text-3xl font-bold text-[#135341]">35%</div>
                  <p className="text-sm text-gray-600">Faster deal closings</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm">
                  <div className="text-3xl font-bold text-[#135341]">2,400+</div>
                  <p className="text-sm text-gray-600">Active buyers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column: Sticky CTA Card */}
        <div className="relative">
          <div className="sticky top-1/4">
            <Card className="max-w-md mx-auto lg:mx-0 shadow-xl border-gray-100">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 mx-auto mb-2 bg-[#09261E] rounded-full flex items-center justify-center">
                  <BadgeCheck className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-semibold">Become a Verified Seller</CardTitle>
                <CardDescription className="text-base mt-2">
                  Access powerful tools, visibility, and a trusted platform to move more deals.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-4 pb-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">Verified seller badge increases buyer trust and response rates</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">Premium placement in property search results</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">Deal analytics and performance tracking dashboard</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">Direct messaging with active buyers</p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-center pt-2 pb-6">
                {!user ? (
                  // Not logged in - will redirect to auth
                  <Button 
                    size="lg"
                    className="w-full bg-[#135341] hover:bg-[#09261E] text-white py-6 text-lg"
                    onClick={() => setLocation('/auth')}
                  >
                    Become a Seller
                  </Button>
                ) : (
                  // Logged in user - could be enhanced with seller status checks
                  <Button 
                    size="lg"
                    className="w-full bg-[#135341] hover:bg-[#09261E] text-white py-6 text-lg"
                    onClick={() => setLocation('/dashboard')}
                  >
                    View Dashboard
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Seller Features Section */}
      <div className="my-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">Seller Tools & Benefits</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform gives you everything you need to effectively list, market,
            and sell properties to our network of active buyers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Create detailed property listings with images, virtual tours, and all the 
                information buyers need to make decisions.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Buyer Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Our system automatically matches your properties with active buyers 
                looking in your target markets and property types.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Deal Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Track offers, manage buyer communications, and close deals all 
                through your seller dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-[#09261E] text-white rounded-lg p-8 text-center my-12">
        <h2 className="text-2xl font-bold mb-3">Ready to start selling properties?</h2>
        <p className="max-w-2xl mx-auto mb-6">
          Join our network of verified sellers and connect with active buyers looking for 
          properties just like yours.
        </p>
        
        <Button 
          className="bg-white text-[#09261E] hover:bg-gray-100"
          size="lg"
          onClick={() => setLocation('/auth')}
        >
          Become a Seller Today
        </Button>
      </div>
    </div>
  );
}