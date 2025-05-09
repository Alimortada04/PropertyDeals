import React, { useState, useEffect, useRef } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  UserIcon, 
  BadgeCheck, 
  Check,
  ListPlus,
  BarChart3,
  Settings,
  ChevronUp
} from 'lucide-react';

/**
 * SellerDash - Public seller landing page
 */
export default function SellerDash() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Track scroll position to show/hide back to top button
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    
    const handleScroll = () => {
      setShowScrollTop(scrollContainer.scrollTop > 300);
    };
    
    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to top function
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  
  // Open seller application modal
  const openSellerApplication = () => {
    setIsModalOpen(true);
  };
  
  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Apply to become a seller</DialogTitle>
            <DialogDescription>
              Fill out this form to apply for seller verification. Once approved, you'll have access
              to all PropertyDeals selling tools.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              Our seller verification process ensures that all properties on our platform are listed
              by trusted professionals. We'll review your application within 2 business days.
            </p>
            
            <div className="space-y-3">
              <Button className="w-full bg-[#135341]" onClick={() => setLocation('/auth')}>
                Login to continue
              </Button>
              
              <Button variant="outline" className="w-full" onClick={() => setIsModalOpen(false)}>
                Come back later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="container mx-auto px-4 py-6 min-h-[calc(100vh-100px)] overflow-hidden">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Become a PropertyDeals Seller</h1>
          <p className="text-gray-600 mt-2">List, market, and sell your off-market properties</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-[calc(100vh-180px)]">
          {/* Left column: Scrolling features with animations */}
          <div 
            ref={scrollContainerRef}
            className="relative h-full overflow-y-auto scroll-smooth scroll-pt-6 pr-6 pb-20"
          >
            {/* Back to top button */}
            {showScrollTop && (
              <button 
                onClick={scrollToTop}
                className="sticky top-6 left-full ml-4 z-10 bg-[#135341] hover:bg-[#09261E] text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 opacity-90 hover:opacity-100 flex items-center justify-center"
                aria-label="Back to top"
              >
                <ChevronUp className="h-5 w-5" />
              </button>
            )}
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Why Sell on PropertyDeals?</h2>
              <p className="text-gray-600 mt-1">Powerful tools and real results, built for modern dealmakers.</p>
            </div>
            
            <div className="space-y-24">
              {/* Feature 1 - List Deals That Get Seen */}
              <div className="transform transition duration-700 ease-in-out hover:-translate-y-1">
                <div className="relative">
                  <div className="absolute -z-10 top-0 left-0 w-20 h-20 bg-green-50 rounded-full opacity-70"></div>
                  <ListPlus className="h-14 w-14 text-[#135341] mb-5" />
                  <h2 className="text-2xl font-semibold mb-3">List Deals That Get Seen</h2>
                  <p className="text-gray-600 max-w-lg leading-relaxed">
                    Showcase your deals to our network of motivated buyers and investors. 
                    Our platform prioritizes off-market properties and connects you with 
                    serious buyers who are ready to move quickly.
                  </p>
                </div>
              </div>
              
              {/* Feature 2 - Smarter Buyer Outreach */}
              <div className="transform transition duration-700 ease-in-out hover:-translate-y-1">
                <div className="relative">
                  <div className="absolute -z-10 top-0 left-0 w-20 h-20 bg-blue-50 rounded-full opacity-70"></div>
                  <UserIcon className="h-14 w-14 text-blue-600 mb-5" />
                  <h2 className="text-2xl font-semibold mb-3">Smarter Buyer Outreach</h2>
                  <p className="text-gray-600 max-w-lg leading-relaxed">
                    Our system helps you connect faster with more aligned buyers. 
                    The matching algorithm identifies buyers looking specifically for 
                    your property type, location, and deal structure.
                  </p>
                </div>
              </div>
              
              {/* Feature 3 - Track Analytics & Engagement */}
              <div className="transform transition duration-700 ease-in-out hover:-translate-y-1">
                <div className="relative">
                  <div className="absolute -z-10 top-0 left-0 w-20 h-20 bg-purple-50 rounded-full opacity-70"></div>
                  <BarChart3 className="h-14 w-14 text-purple-600 mb-5" />
                  <h2 className="text-2xl font-semibold mb-3">Track Analytics & Engagement</h2>
                  <p className="text-gray-600 max-w-lg leading-relaxed">
                    Get real-time insights on deal views, clicks, and interest. 
                    Understand which properties are gaining traction and how buyers 
                    interact with your listings through comprehensive analytics.
                  </p>
                </div>
              </div>
              
              {/* Feature 4 - Stay Organized Effortlessly */}
              <div className="transform transition duration-700 ease-in-out hover:-translate-y-1">
                <div className="relative">
                  <div className="absolute -z-10 top-0 left-0 w-20 h-20 bg-orange-50 rounded-full opacity-70"></div>
                  <Settings className="h-14 w-14 text-orange-600 mb-5" />
                  <h2 className="text-2xl font-semibold mb-3">Stay Organized Effortlessly</h2>
                  <p className="text-gray-600 max-w-lg leading-relaxed">
                    Track leads, offers, and progress through a streamlined dashboard.
                    All your deal activity is organized in one place with status tracking
                    and important notifications so nothing falls through the cracks.
                  </p>
                </div>
              </div>
              
              {/* Testimonials */}
              <div className="relative mt-12">
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-md">
                  <div className="absolute -top-6 left-6 text-5xl text-[#135341] opacity-30">"</div>
                  <div className="flex items-start gap-5">
                    <Avatar className="h-14 w-14 border-2 border-[#135341]">
                      <AvatarImage src="/images/testimonial1.jpg" alt="Sarah L." />
                      <AvatarFallback className="bg-[#135341] text-white">SL</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-gray-700 italic leading-relaxed mb-4">
                        "I've done 5 deals through PropertyDeals in just three months. The buyer network is
                        incredible - I get quality offers much faster than anywhere else."
                      </p>
                      <div className="font-medium">Sarah L.</div>
                      <div className="text-sm text-gray-500">Real Estate Investor, Chicago</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-6">Platform Statistics</h3>
                <div className="grid grid-cols-2 gap-5">
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="text-3xl font-bold text-[#135341]">35%</div>
                    <p className="text-gray-600">Faster deal closings</p>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="text-3xl font-bold text-[#135341]">2,400+</div>
                    <p className="text-gray-600">Active buyers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column: Sticky CTA Card */}
          <div className="relative flex h-full items-center justify-center">
            <div className="sticky top-1/4 mx-auto">
              <Card className="w-[360px] max-w-sm shadow-xl border border-neutral-200">
                <CardHeader className="text-center p-8 space-y-3">
                  <div className="w-16 h-16 mx-auto mb-2 bg-[#09261E] rounded-full flex items-center justify-center">
                    <BadgeCheck className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Become a Verified Seller</CardTitle>
                  <CardDescription className="text-base">
                    Access powerful tools, visibility, and a trusted platform to move more deals.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="px-8 pb-6 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">Verified seller badge increases buyer trust and response rates</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">Premium placement in property search results</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">Deal analytics and performance tracking dashboard</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">Direct messaging with active buyers</p>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-center px-8 pb-8">
                  {!user ? (
                    // Not logged in - open seller application modal
                    <Button 
                      size="lg"
                      className="w-full bg-[#135341] hover:bg-[#09261E] text-white py-6 text-lg group transition-all hover:scale-105 duration-300"
                      onClick={openSellerApplication}
                    >
                      Become a Seller 
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 ml-1">→</span>
                    </Button>
                  ) : (
                    // Logged in user - could be enhanced with seller status checks
                    <Button 
                      size="lg"
                      className="w-full bg-[#135341] hover:bg-[#09261E] text-white py-6 text-lg group transition-all hover:scale-105 duration-300"
                      onClick={() => setLocation('/dashboard')}
                    >
                      View Dashboard
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 ml-1">→</span>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}