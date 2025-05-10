import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import AuthModal from '@/components/auth/auth-modal';
import SellerApplicationModal from '@/components/seller/seller-application-modal';
import { getSellerStatus, SellerStatus } from '@/lib/supabase';
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  UserIcon, 
  BadgeCheck, 
  Check,
  ListPlus,
  BarChart3,
  Settings,
  ChevronUp,
  ArrowRight,
  ChevronRight,
  Building2,
  UserCircle2,
  FileText,
  Loader2
} from 'lucide-react';

/**
 * SellerDash - Public seller landing page
 */
export default function SellerDash() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState("profile");
  const [sellerStatus, setSellerStatus] = useState<SellerStatus>('none');
  const [isLoading, setIsLoading] = useState(false);
  
  // Track window scroll position to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Reset modal state when it closes
  useEffect(() => {
    if (!isModalOpen) {
      setCurrentStep(1);
      setActiveTab("profile");
    }
  }, [isModalOpen]);
  
  // Check seller status when component mounts or user changes
  useEffect(() => {
    if (user) {
      getSellerStatus().then(status => {
        setSellerStatus(status);
      });
    } else {
      setSellerStatus('none');
    }
  }, [user]);
  
  // Handle next step in application
  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // Handle going back in the application
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Simplified: Always open the seller application modal
  const openSellerApplication = () => {
    setIsModalOpen(true);
  };
  
  // Simple handler to close auth modal
  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
  };
  
  return (
    <>
      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={handleAuthModalClose}
        title="Sign In to Continue"
        description="Please sign in or create an account to apply as a PropertyDeals seller."
      />
      
      {/* Seller Application Modal */}
      <SellerApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Become a PropertyDeals Seller</h1>
          <p className="text-gray-600 mt-2">List, market, and sell your off-market properties</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Left column: Main content - 8 columns on large screens */}
          <div 
            ref={scrollContainerRef}
            className="lg:col-span-8 pr-6 pb-20"
          >
            {/* Back to top button */}
            {showScrollTop && (
              <button 
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 z-20 bg-[#135341] hover:bg-[#09261E] text-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 opacity-90 hover:opacity-100 flex items-center justify-center"
                aria-label="Back to top"
              >
                <ChevronUp className="h-6 w-6" />
              </button>
            )}
            
            <div className="space-y-20 pt-4">
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
          
          {/* Right column: Sticky CTA Card - 4 columns on large screens */}
          <div className="lg:col-span-4">
            <div className="sticky top-16 flex justify-center lg:justify-start">
              <Card className="w-full max-w-sm shadow-xl border border-neutral-200">
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
                      <p className="text-gray-600">Get More Eyes on Your Deals</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">Track Deal Analytics & Performance</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">Faster, Smarter Buyer Outreach</p>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-center px-8 pb-8">
                  {!user ? (
                    // Not logged in - direct to auth page
                    <Button 
                      size="lg"
                      className="w-full bg-[#135341] hover:bg-[#09261E] text-white py-6 text-lg group transition-all hover:scale-105 duration-300"
                      onClick={openSellerApplication}
                    >
                      Become a Seller
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 ml-1">→</span>
                    </Button>
                  ) : (
                    // Logged in user - open application modal
                    <Button 
                      size="lg"
                      className="w-full bg-[#135341] hover:bg-[#09261E] text-white py-6 text-lg group transition-all hover:scale-105 duration-300"
                      onClick={openSellerApplication}
                    >
                      Apply Now
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