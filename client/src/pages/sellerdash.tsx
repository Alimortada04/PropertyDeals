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
  FileText
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
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState("profile");
  
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
  
  // Reset modal state when it closes
  useEffect(() => {
    if (!isModalOpen) {
      setCurrentStep(1);
      setActiveTab("profile");
    }
  }, [isModalOpen]);
  
  // Handle next step in application
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      
      // Update the active tab based on current step
      if (currentStep === 1) {
        setActiveTab("business");
      } else if (currentStep === 2) {
        setActiveTab("documents");
      }
    }
  };
  
  // Handle going back in the application
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      
      // Update the active tab based on current step
      if (currentStep === 3) {
        setActiveTab("business");
      } else if (currentStep === 2) {
        setActiveTab("profile");
      }
    }
  };
  
  // Open seller application modal
  const openSellerApplication = () => {
    // If user is not logged in, redirect to auth page
    if (!user) {
      setLocation('/auth');
      return;
    }
    
    setIsModalOpen(true);
  };
  
  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Seller Application</DialogTitle>
            <DialogDescription>
              Complete this application to become a verified PropertyDeals seller.
            </DialogDescription>
          </DialogHeader>
          
          {/* Progress indicator */}
          <div className="pt-1 pb-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Step {currentStep} of 3</span>
              <span>{Math.round((currentStep / 3) * 100)}% Complete</span>
            </div>
            <Progress value={(currentStep / 3) * 100} className="h-2" />
          </div>
          
          <Tabs value={activeTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger 
                value="profile" 
                onClick={() => currentStep >= 1 && setCurrentStep(1)}
                className={currentStep >= 1 ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
              >
                <UserCircle2 className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="business" 
                onClick={() => currentStep >= 2 && setCurrentStep(2)}
                className={currentStep >= 2 ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Business
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                onClick={() => currentStep >= 3 && setCurrentStep(3)}
                className={currentStep >= 3 ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
              >
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <p className="text-sm text-gray-600">
                  We need this information to verify your identity as a real estate professional.
                </p>
                
                {/* Demo content for profile tab - would be replaced with form fields */}
                <div className="border rounded-md p-4 bg-gray-50">
                  <p className="text-center text-sm text-gray-500 italic">
                    Form fields for personal information would go here in a production environment.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="business" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Business Details</h3>
                <p className="text-sm text-gray-600">
                  Tell us about your real estate business and experience.
                </p>
                
                {/* Demo content for business tab */}
                <div className="border rounded-md p-4 bg-gray-50">
                  <p className="text-center text-sm text-gray-500 italic">
                    Form fields for business information would go here in a production environment.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Verification Documents</h3>
                <p className="text-sm text-gray-600">
                  Upload required documentation to complete your seller verification.
                </p>
                
                {/* Demo content for documents tab */}
                <div className="border rounded-md p-4 bg-gray-50">
                  <p className="text-center text-sm text-gray-500 italic">
                    Document upload fields would go here in a production environment.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="flex justify-between mt-6 gap-2">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            )}
            
            {currentStep < 3 ? (
              <Button onClick={handleNextStep} className="bg-[#135341]">
                Continue <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button className="bg-[#135341]">
                Submit Application
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="container mx-auto px-6 py-8 h-screen max-h-screen overflow-hidden flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Become a PropertyDeals Seller</h1>
          <p className="text-gray-600 mt-2">List, market, and sell your off-market properties</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 flex-1 overflow-hidden">
          {/* Left column: Scrolling features with animations */}
          <div 
            ref={scrollContainerRef}
            className="relative h-full overflow-y-auto scroll-smooth scroll-pt-6 pr-6 pb-20"
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
          
          {/* Right column: Sticky CTA Card */}
          <div className="relative flex h-full items-start justify-center">
            <div className="sticky top-16 flex justify-center lg:justify-start">
              <Card className="w-[360px] shadow-xl border border-neutral-200">
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
                    // Not logged in - direct to auth page
                    <Button 
                      size="lg"
                      className="w-full bg-[#135341] hover:bg-[#09261E] text-white py-6 text-lg group transition-all hover:scale-105 duration-300"
                      onClick={() => setLocation('/auth')}
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