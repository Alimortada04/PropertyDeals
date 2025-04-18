import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Upload, User, MapPin, Link as LinkIcon, Bell, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type OnboardingStep = 
  | "profile"
  | "location"
  | "social"
  | "notifications"
  | "confirmation";

interface StepConfig {
  id: OnboardingStep;
  title: string;
  description: string;
}

export default function OnboardingPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("profile");
  
  // Define step configurations
  const steps: StepConfig[] = [
    {
      id: "profile",
      title: "Profile Information",
      description: "Set up your basic profile information",
    },
    {
      id: "location",
      title: "Location Details",
      description: "Tell us where you're located",
    },
    {
      id: "social",
      title: "Social & Contact",
      description: "Add your social media profiles and contact preferences",
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Configure how you want to be notified",
    },
    {
      id: "confirmation",
      title: "All Set!",
      description: "Your profile is ready to go",
    },
  ];
  
  // Calculate progress percentage
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;
  
  // Handle navigation between steps
  const goToNextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };
  
  const goToPreviousStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };
  
  const handleFinish = () => {
    // Navigate to the dashboard or home page when onboarding is complete
    navigate("/");
  };
  
  // If user is not logged in, redirect to login page
  if (!user) {
    return <Redirect to="/signin" />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-[#09261E]">Complete Your Profile</h1>
          <p className="text-gray-500 mt-2">Help us personalize your experience</p>
        </div>
        
        {/* Progress bar */}
        <div className="mb-8">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>Getting Started</span>
            <span>Complete</span>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{steps.find(step => step.id === currentStep)?.title}</CardTitle>
            <CardDescription>{steps.find(step => step.id === currentStep)?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Profile Information Step */}
            {currentStep === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-200 rounded-full h-24 w-24 flex items-center justify-center overflow-hidden relative">
                    <User className="h-12 w-12 text-gray-500" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <div className="text-white text-xs font-medium p-1">
                        <Upload className="h-4 w-4 mx-auto mb-1" />
                        Upload
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium mb-2">Profile Picture</h3>
                    <p className="text-xs text-gray-500 mb-2">Upload a photo to personalize your profile</p>
                    <Button variant="outline" size="sm">Choose File</Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input 
                    id="displayName" 
                    placeholder="How you want to be called" 
                    defaultValue={user.fullName || ""} 
                    className="mt-1" 
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell us a bit about yourself" 
                    className="mt-1 h-24" 
                  />
                </div>
                
                <div>
                  <Label>Profile Visibility</Label>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <h4 className="text-sm font-medium">Public Profile</h4>
                      <p className="text-xs text-gray-500">Allow others to view your profile</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            )}
            
            {/* Location Details Step */}
            {currentStep === "location" && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Your city" className="mt-1" />
                </div>
                
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="Your state" className="mt-1" />
                </div>
                
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" placeholder="Your ZIP code" className="mt-1" />
                </div>
                
                {user.userType === "buyer" && (
                  <div>
                    <Label htmlFor="preferredAreas">Preferred Investment Areas</Label>
                    <Input id="preferredAreas" placeholder="Areas you're interested in" className="mt-1" />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple areas with commas</p>
                  </div>
                )}
                
                {user.userType === "seller" && (
                  <div>
                    <Label htmlFor="propertyAddress">Property Address</Label>
                    <Input id="propertyAddress" placeholder="Address of your property" className="mt-1" />
                  </div>
                )}
                
                {user.userType === "rep" && (
                  <div>
                    <Label htmlFor="serviceAreas">Service Areas</Label>
                    <Input id="serviceAreas" placeholder="Areas you serve" className="mt-1" />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple areas with commas</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Social & Contact Step */}
            {currentStep === "social" && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Your phone number" className="mt-1" />
                </div>
                
                <div>
                  <Label htmlFor="website">Website</Label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      https://
                    </span>
                    <Input id="website" placeholder="example.com" className="rounded-l-none" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      linkedin.com/in/
                    </span>
                    <Input id="linkedin" placeholder="username" className="rounded-l-none" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      facebook.com/
                    </span>
                    <Input id="facebook" placeholder="username" className="rounded-l-none" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      instagram.com/
                    </span>
                    <Input id="instagram" placeholder="username" className="rounded-l-none" />
                  </div>
                </div>
                
                <div>
                  <Label>Contact Preferences</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Show email on profile</h4>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Show phone on profile</h4>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Notifications Step */}
            {currentStep === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm">New messages</h4>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm">New property alerts</h4>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm">Marketing updates</h4>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">App Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm">New messages</h4>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm">Property updates</h4>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm">New followers</h4>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="frequency">Notification Frequency</Label>
                  <select 
                    id="frequency" 
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                    defaultValue="daily"
                  >
                    <option value="realtime">Real-time</option>
                    <option value="daily">Daily digest</option>
                    <option value="weekly">Weekly digest</option>
                  </select>
                </div>
              </div>
            )}
            
            {/* Confirmation Step */}
            {currentStep === "confirmation" && (
              <div className="space-y-6 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-gray-900">Profile Complete!</h3>
                  <p className="text-gray-500 mt-2">
                    Thanks for setting up your profile. You're all set to start using PropertyDeals.
                  </p>
                </div>
                
                {user.userType === "buyer" && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800">Next Steps for Buyers</h4>
                    <ul className="text-blue-700 text-sm mt-2 text-left list-disc pl-5">
                      <li>Browse available properties in your area</li>
                      <li>Save properties you're interested in</li>
                      <li>Connect with sellers and REPs</li>
                    </ul>
                  </div>
                )}
                
                {user.userType === "seller" && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800">Next Steps for Sellers</h4>
                    <ul className="text-blue-700 text-sm mt-2 text-left list-disc pl-5">
                      <li>List your property</li>
                      <li>Upload property photos</li>
                      <li>Set your property details and price</li>
                    </ul>
                  </div>
                )}
                
                {user.userType === "rep" && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800">Next Steps for REPs</h4>
                    <ul className="text-blue-700 text-sm mt-2 text-left list-disc pl-5">
                      <li>Complete your professional profile</li>
                      <li>Set up your service offerings</li>
                      <li>Connect with potential clients</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              {currentStep !== "profile" ? (
                <Button variant="outline" onClick={goToPreviousStep}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div></div> // Empty div to maintain flex spacing
              )}
              
              {currentStep !== "confirmation" ? (
                <Button onClick={goToNextStep}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleFinish}>
                  Get Started
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Skip link */}
        {currentStep !== "confirmation" && (
          <div className="text-center mt-4">
            <button 
              onClick={handleFinish}
              className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}