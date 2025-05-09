import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { 
  getSellerStatus, 
  getSellerProfile, 
  saveSellerProfile, 
  submitSellerApplication,
  type SellerStatus,
  type SellerOnboardingData,
  supabase
} from '@/lib/supabase';

// UI Components
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from "@/components/ui/card";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import MultiSelectItem from '@/components/ui/multi-select-item';

// Icons
import { 
  Home, MessageSquare, BarChart3, Settings, 
  ListPlus, Info, XIcon, ArrowLeft, HelpCircle,
  Loader2, Edit, FileCheck, FileWarning, Clock, Ban, 
  Check, UserIcon, UserX, Unlock, ArrowRight, BadgeCheck
} from 'lucide-react';

// Sample data options
const businessTypes = [
  { value: 'individual', label: 'Individual Investor' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'llc', label: 'Limited Liability Company (LLC)' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'reit', label: 'Real Estate Investment Trust (REIT)' },
  { value: 'broker', label: 'Real Estate Broker' },
  { value: 'wholesaler', label: 'Wholesaler' }
];

const marketOptions = [
  'Atlanta, GA',
  'Austin, TX',
  'Boston, MA',
  'Charlotte, NC',
  'Chicago, IL',
  'Dallas, TX',
  'Denver, CO',
  'Houston, TX',
  'Las Vegas, NV',
  'Los Angeles, CA',
  'Miami, FL',
  'Nashville, TN',
  'New York, NY',
  'Orlando, FL',
  'Philadelphia, PA',
  'Phoenix, AZ',
  'Portland, OR',
  'San Diego, CA',
  'San Francisco, CA',
  'Seattle, WA',
  'Tampa, FL',
  'Washington, DC'
];

const dealTypes = [
  'Single-Family Residential',
  'Multi-Family Properties',
  'Commercial Properties',
  'Land/Vacant Lots',
  'Foreclosures',
  'REO Properties',
  'Short Sales',
  'Fixer-Uppers/Rehabs',
  'Wholesale Deals',
  'Off-Market Properties',
  'Probate Properties',
  'Tax Liens/Deeds'
];

const dealVolumeOptions = [
  { value: 'up_to_10', label: 'Up to 10 deals per year' },
  { value: '11_to_25', label: '11-25 deals per year' },
  { value: '26_to_50', label: '26-50 deals per year' },
  { value: '51_to_100', label: '51-100 deals per year' },
  { value: '100_plus', label: '100+ deals per year' }
];

/**
 * SellerDash - Handles both public seller landing page and private dashboard
 * 
 * @param {Object} props - Component props
 * @param {string} [props.userId] - Optional userId for private dashboard route
 */
export default function SellerDash({ userId }: { userId?: string }) {
  const [setLocation] = useLocation();
  const { user, supabaseUser, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  
  // State for seller status
  const [sellerStatus, setSellerStatus] = useState<SellerStatus>('none');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [certifyAccuracy, setCertifyAccuracy] = useState(false);
  
  // Form data
  const [onboardingData, setOnboardingData] = useState<SellerOnboardingData>({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    yearsInRealEstate: '',
    businessType: '',
    
    targetMarkets: [],
    dealTypes: [],
    maxDealVolume: '',
    hasBuyerList: false,
    isDirectToSeller: false,
    
    purchaseAgreements: null,
    assignmentContracts: null,
    notes: '',
    websiteUrl: '',
    socialFacebook: '',
    socialInstagram: '',
    socialLinkedin: '',
    hasProofOfFunds: false,
    usesTitleCompany: false,
    
    isDraft: true,
    status: 'none'
  });
  
  // Flag to determine if we need to redirect from private route
  const [shouldRedirectToPublic, setShouldRedirectToPublic] = useState(false);
  
  // Load seller status and profile data
  useEffect(() => {
    const loadSellerData = async () => {
      try {
        setIsLoading(true);
        
        // Get current auth user
        if (!supabaseUser && !user) {
          console.log("No authenticated user available");
          setIsLoading(false);
          
          // If we're on the private route, we need to redirect
          if (userId) {
            setShouldRedirectToPublic(true);
          }
          
          return;
        }
        
        const authUserId = supabaseUser?.id || user?.id;
        console.log("Authenticated user detected:", authUserId);
        
        // For private route, check if userId matches authenticated user
        if (userId && authUserId !== userId) {
          console.log("UserId mismatch - redirecting to public page");
          setShouldRedirectToPublic(true);
          setIsLoading(false);
          return;
        }
        
        // Fetch seller profile
        const { data: sellerData, error: sellerError } = await supabase
          .from('sellers')
          .select('*')
          .eq('id', authUserId)
          .maybeSingle();
        
        if (sellerError) {
          console.error('Error fetching seller data:', sellerError);
          toast({
            title: "Database Error",
            description: "Could not fetch your seller profile. " + sellerError.message,
            variant: "destructive"
          });
          // Set default state
          setSellerStatus('none');
          
          // If we're on the private route, we need to redirect
          if (userId) {
            setShouldRedirectToPublic(true);
          }
        } else if (sellerData) {
          // Existing seller record found
          console.log("Seller data found:", sellerData);
          const status = sellerData.status as SellerStatus;
          setSellerStatus(status);
          
          // If we're on the private route and not an active seller, redirect
          if (userId && status !== 'active') {
            console.log("User is not an active seller - redirecting to public page");
            setShouldRedirectToPublic(true);
          }
          
          // Convert from database format to application format
          setOnboardingData({
            fullName: sellerData.fullName || '',
            email: sellerData.email || '',
            phone: sellerData.phone || '',
            businessName: sellerData.businessName || '',
            yearsInRealEstate: sellerData.yearsInRealEstate || '',
            businessType: sellerData.businessType || '',
            
            targetMarkets: sellerData.targetMarkets || [],
            dealTypes: sellerData.dealTypes || [],
            maxDealVolume: sellerData.maxDealVolume || '',
            hasBuyerList: sellerData.hasBuyerList || false,
            isDirectToSeller: sellerData.isDirectToSeller || false,
            
            purchaseAgreements: null, // Files can't be retrieved this way
            assignmentContracts: null, // Files can't be retrieved this way
            notes: sellerData.notes || '',
            websiteUrl: sellerData.websiteUrl || '',
            socialFacebook: sellerData.socialFacebook || '',
            socialInstagram: sellerData.socialInstagram || '',
            socialLinkedin: sellerData.socialLinkedin || '',
            hasProofOfFunds: sellerData.hasProofOfFunds || false,
            usesTitleCompany: sellerData.usesTitleCompany || false,
            
            isDraft: sellerData.isDraft || true,
            status: status
          });
          
          // Show application modal for rejected applications on the public route
          if (!userId && status === 'rejected') {
            setIsModalOpen(true);
          }
        } else {
          // No seller record found
          console.log("No seller profile found");
          setSellerStatus('none');
          
          // If we're on the private route, we need to redirect
          if (userId) {
            setShouldRedirectToPublic(true);
          } else if (supabaseUser || user) {
            // Pre-populate with user data
            setOnboardingData(prev => ({
              ...prev,
              fullName: user?.fullName || supabaseUser?.user_metadata?.full_name || '',
              email: user?.email || supabaseUser?.email || ''
            }));
          }
        }
      } catch (error) {
        console.error('Unexpected error loading seller data:', error);
        toast({
          title: "Error",
          description: "Something went wrong while loading your profile. Please try again.",
          variant: "destructive"
        });
        // Set fallback state to prevent UI from getting stuck
        setSellerStatus('none');
        
        // If we're on the private route, we need to redirect
        if (userId) {
          setShouldRedirectToPublic(true);
        }
      } finally {
        // Always exit loading state, even on error
        setIsLoading(false);
      }
    };
    
    // Start loading immediately
    loadSellerData();
  }, [user, supabaseUser, userId, toast]);
  
  // Handle redirect from private to public route
  useEffect(() => {
    if (shouldRedirectToPublic && userId) {
      console.log("Redirecting to /sellerdash public route");
      setLocation('/sellerdash');
    }
  }, [shouldRedirectToPublic, userId, setLocation]);
  
  // Loading state UI
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-2">Loading{userId ? ' your dashboard' : ''}...</p>
        </div>
        
        <Card className="max-w-xl mx-auto">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center py-8 text-center">
              <Loader2 className="h-16 w-16 text-[#135341] animate-spin mb-4" />
              <h3 className="text-xl font-medium mb-2">Checking seller status</h3>
              <p className="text-gray-600 max-w-md mb-8">
                We're verifying your seller profile. This will only take a moment.
              </p>
              
              {/* Show an escape option if it takes too long */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setIsLoading(false); 
                  setSellerStatus('none');
                  setShouldRedirectToPublic(userId ? true : false);
                }}
              >
                Continue without waiting
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // If we're on the private route but need to redirect, show a minimal loading state
  if (userId && shouldRedirectToPublic) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#135341] mb-4" />
        <p className="text-gray-600">Redirecting...</p>
      </div>
    );
  }
  
  // PRIVATE ROUTE: Active seller dashboard
  if (userId && sellerStatus === 'active') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-medium">
                <BadgeCheck className="h-3.5 w-3.5 mr-1" />
                Verified Seller
              </Badge>
            </div>
            <p className="text-gray-600">Manage your property listings and seller profile</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              className="bg-[#135341] hover:bg-[#09261E]"
              size="lg"
              onClick={() => setLocation('/properties/create')}
            >
              List New Property
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-sm text-gray-500">Properties currently listed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-sm text-gray-500">Offers pending your response</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Closed Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-sm text-gray-500">Successfully closed transactions</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Listings</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center py-12 text-center">
                <img 
                  src="/images/empty-state.svg" 
                  alt="No listings" 
                  className="h-48 w-48 mb-6 text-gray-300" 
                  onError={(e) => {
                    e.currentTarget.src = "/images/pdLogo.png";
                    e.currentTarget.className = "h-32 w-32 mb-6 rounded-full bg-gray-100 p-4 object-contain";
                  }}
                />
                <h3 className="text-xl font-medium mb-2">No Properties Listed Yet</h3>
                <p className="text-gray-600 max-w-lg mb-6">
                  You haven't listed any properties yet. Create your first listing to connect
                  with potential buyers and investors on PropertyDeals.
                </p>
                <Button 
                  onClick={() => setLocation('/properties/create')}
                  className="bg-[#135341] hover:bg-[#09261E]"
                >
                  Create Your First Listing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // PUBLIC ROUTE: Render application and status modals
  return (
    <>
      {renderStatusModal()}
      {renderOnboardingModal()}
      
      {/* PUBLIC ROUTE MAIN CONTENT */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Become a PropertyDeals Seller</h1>
          <p className="text-gray-600 mt-2">List, market, and sell your off-market properties</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left column: Seller benefits */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Why Sell on PropertyDeals?</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-[#135341]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Reach Active Buyers</h3>
                  <p className="text-gray-600">
                    Connect with our network of verified investors, wholesalers, and property professionals
                    actively seeking off-market deals.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BadgeCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Verified Seller Status</h3>
                  <p className="text-gray-600">
                    Build trust with our verification badge that shows buyers you're a legitimate
                    and reliable property source.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Unlock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Exclusive Deal Promotion</h3>
                  <p className="text-gray-600">
                    Get your properties featured in our newsletters, property alerts, and
                    promoted to matched buyers in your target markets.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
              <h3 className="text-lg font-medium mb-3">How Seller Verification Works</h3>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <Badge className="h-6 bg-[#135341] text-white">1</Badge>
                  <div>
                    <p className="font-medium">Complete the Application</p>
                    <p className="text-gray-600 text-sm">Fill out the 4-step seller application with your information.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Badge className="h-6 bg-[#135341] text-white">2</Badge>
                  <div>
                    <p className="font-medium">Verification Review</p>
                    <p className="text-gray-600 text-sm">Our team reviews your application (1-2 business days).</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Badge className="h-6 bg-[#135341] text-white">3</Badge>
                  <div>
                    <p className="font-medium">Start Listing Properties</p>
                    <p className="text-gray-600 text-sm">Once approved, immediately list your properties and connect with buyers.</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
          
          {/* Right column: Application CTA and status cards */}
          <div>
            {/* Specific state cards based on auth + seller status */}
            {!user && !supabaseUser && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Access PropertyDeals Seller Tools</CardTitle>
                  <CardDescription>
                    You need to sign in or create an account to access seller features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center py-6 text-center">
                    <UserX className="h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-3">Authentication Required</h3>
                    <p className="text-gray-600 max-w-md mb-6">
                      To list properties, apply for seller verification, or browse buyer requests,
                      you'll need to sign in to your PropertyDeals account.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        variant="outline"
                        onClick={() => setLocation('/register')}
                        className="w-full sm:w-auto"
                      >
                        Create Account
                      </Button>
                      <Button
                        onClick={() => setLocation('/signin')}
                        className="w-full sm:w-auto"
                      >
                        Sign In
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {(user || supabaseUser) && sellerStatus === 'none' && !isModalOpen && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Become a Verified Seller</CardTitle>
                  <CardDescription>List, market, and sell your properties on PropertyDeals</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex flex-col items-center py-8 text-center">
                    <img 
                      src="/images/seller-badge.svg" 
                      alt="Seller Badge" 
                      className="h-32 w-32 mb-6" 
                      onError={(e) => {
                        e.currentTarget.src = "/images/pdLogo.png";
                        e.currentTarget.className = "h-24 w-24 mb-6 rounded-full bg-gray-100 p-4 object-contain";
                      }}
                    />
                    <h3 className="text-xl font-medium mb-2">Ready to List Properties?</h3>
                    <p className="text-gray-600 max-w-md mb-6">
                      Complete our seller application to become a verified seller and gain
                      access to our network of motivated buyers and investors.
                    </p>
                    <Button 
                      onClick={() => setIsModalOpen(true)}
                      className="bg-[#135341] hover:bg-[#09261E] min-w-[200px]"
                      size="lg"
                    >
                      Start Seller Application
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {(user || supabaseUser) && sellerStatus === 'pending' && !isModalOpen && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Application Under Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center py-6 text-center">
                    <div className="relative mb-6">
                      <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
                        <Clock className="h-12 w-12 text-blue-500" />
                      </div>
                      <div className="absolute bottom-0 right-0 h-8 w-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-sm font-bold">!</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-medium mb-3">We're Reviewing Your Application</h3>
                    <p className="text-gray-600 max-w-md mb-6">
                      Your seller account application is currently under review. We strive to 
                      process applications within 1-2 business days. You'll receive an email 
                      notification once your application has been reviewed.
                    </p>
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setLocation('/')}
                      >
                        Return to Homepage
                      </Button>
                      <Button
                        onClick={() => setLocation('/support')}
                      >
                        Contact Support
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {(user || supabaseUser) && sellerStatus === 'rejected' && !isModalOpen && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-500">
                    <FileWarning className="h-5 w-5" />
                    Application Requires Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center py-6 text-center">
                    <div className="relative mb-6">
                      <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
                        <FileWarning className="h-12 w-12 text-red-500" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-medium mb-3">Your Application Needs Updates</h3>
                    <p className="text-gray-600 max-w-md mb-6">
                      We've reviewed your seller application and found some issues that need to be 
                      addressed before you can be approved. Please review and update your application.
                    </p>
                    
                    <Button 
                      onClick={() => setIsModalOpen(true)}
                      className="bg-[#135341] hover:bg-[#09261E] min-w-[200px] mb-4"
                      size="lg"
                    >
                      Update Application
                    </Button>
                    
                    <Button
                      variant="link"
                      onClick={() => setLocation('/support')}
                    >
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {(user || supabaseUser) && sellerStatus === 'active' && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-green-500" />
                    Verified Seller Account
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center py-6 text-center">
                    <div className="relative mb-6">
                      <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                        <BadgeCheck className="h-12 w-12 text-green-500" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-medium mb-3">Your Seller Account is Active</h3>
                    <p className="text-gray-600 max-w-md mb-6">
                      Congratulations! Your seller account has been verified and approved. You can now
                      access your seller dashboard to list properties and manage your listings.
                    </p>
                    
                    <Button 
                      onClick={() => setLocation(`/sellerdash/${supabaseUser?.id || user?.id}`)}
                      className="bg-[#135341] hover:bg-[#09261E] min-w-[200px]"
                      size="lg"
                    >
                      Go to Seller Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Featured testimonial */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-600 overflow-hidden">
                  <img 
                    src="/images/testimonial-avatar.jpg"
                    alt="Seller"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Safer error handling that doesn't manipulate innerHTML
                      e.currentTarget.style.display = "none";
                      // Create and add fallback content
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = document.createElement("div");
                        fallback.textContent = "JD";
                        fallback.className = "flex items-center justify-center w-full h-full bg-[#09261E] text-white";
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
                <div>
                  <p className="italic text-gray-600 mb-3">
                    "PropertyDeals seller verification has completely transformed my wholesale business.
                    I'm connecting with serious buyers faster and closing more deals than ever before."
                  </p>
                  <div>
                    <p className="font-medium">John Donovan</p>
                    <p className="text-sm text-gray-500">Verified Seller since 2024</p>
                  </div>
                </div>
              </div>
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
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#135341]" />
                    <span>Unlimited property listings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#135341]" />
                    <span>Photo galleries & virtual tours</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#135341]" />
                    <span>Custom deal terms</span>
                  </li>
                </ul>
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
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#135341]" />
                    <span>Intelligent buyer matching</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#135341]" />
                    <span>Direct message notifications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#135341]" />
                    <span>Buyer interest alerts</span>
                  </li>
                </ul>
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
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#135341]" />
                    <span>Offer tracking & management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#135341]" />
                    <span>Secure messaging system</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#135341]" />
                    <span>Document sharing & storage</span>
                  </li>
                </ul>
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
          
          {!user && !supabaseUser ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-[#09261E]"
                onClick={() => setLocation('/register')}
              >
                Create Account
              </Button>
              <Button 
                className="bg-white text-[#09261E] hover:bg-gray-100"
                onClick={() => setLocation('/signin')}
              >
                Sign In
              </Button>
            </div>
          ) : sellerStatus === 'active' ? (
            <Button 
              className="bg-white text-[#09261E] hover:bg-gray-100"
              size="lg"
              onClick={() => setLocation(`/sellerdash/${supabaseUser?.id || user?.id}`)}
            >
              Go to Seller Dashboard
            </Button>
          ) : sellerStatus === 'none' ? (
            <Button 
              className="bg-white text-[#09261E] hover:bg-gray-100"
              size="lg"
              onClick={() => setIsModalOpen(true)}
            >
              Apply to Become a Seller
            </Button>
          ) : (
            <Button 
              className="bg-white text-[#09261E] hover:bg-gray-100"
              size="lg"
              onClick={() => setLocation('/')}
            >
              Explore PropertyDeals
            </Button>
          )}
        </div>
      </div>
    </>
  );
  
  // Render the application modal
  function renderOnboardingModal() {
    if (!isModalOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-semibold">Seller Application</h2>
              <p className="text-gray-500 text-sm">Step {currentStep} of 4</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsModalOpen(false)}
            >
              <XIcon className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
          
          <div className="p-1">
            <Progress value={currentStep * 25} className="h-1" />
          </div>
          
          <div className="overflow-y-auto p-6 flex-grow">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>
          
          <div className="p-6 border-t flex justify-between items-center">
            <Button 
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 1 || isSubmitting}
            >
              Previous
            </Button>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={saveCurrentStep}
                disabled={isSubmitting || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : 'Save Draft'}
              </Button>
              
              {currentStep < 4 ? (
                <Button 
                  onClick={handleNextStep}
                  disabled={!isCurrentStepValid() || isSubmitting}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmitApplication}
                  disabled={!isCurrentStepValid() || isSubmitting}
                  className="bg-[#135341] hover:bg-[#09261E]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : 'Submit Application'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Status-specific modals (paused, banned)
  function renderStatusModal() {
    if (isModalOpen) return null;
    
    switch (sellerStatus) {
      case 'paused':
        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Account Paused</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setLocation('/')}
                >
                  <XIcon className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
              <div className="py-8 text-center">
                <Info className="h-16 w-16 mx-auto text-amber-500 mb-4" />
                <h3 className="text-xl font-medium mb-2">Your Account is Paused</h3>
                <p className="text-gray-600 mb-6">
                  Your seller account has been temporarily paused. 
                  Please contact support for more information.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setLocation('/')}
                  >
                    Return to Homepage
                  </Button>
                  <Button
                    onClick={() => setLocation('/support')}
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'banned':
        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Account Suspended</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setLocation('/')}
                >
                  <XIcon className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
              <div className="py-8 text-center">
                <FileWarning className="h-16 w-16 mx-auto text-red-500 mb-4" />
                <h3 className="text-xl font-medium mb-2">Account Access Restricted</h3>
                <p className="text-gray-600 mb-6">
                  Your seller account has been suspended due to policy violations.
                  Please contact support for more information.
                </p>
                <div className="flex justify-center">
                  <Button
                    onClick={() => setLocation('/support')}
                    variant="destructive"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  }
  
  // Step 1: Basic Information
  function renderStep1() {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-1">Basic Information</h3>
          <p className="text-gray-500 text-sm mb-4">Tell us about you and your business</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName"
              value={onboardingData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Your full name"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email"
              type="email"
              value={onboardingData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Your email address"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone"
              value={onboardingData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Your phone number"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="businessName">Business Name (if applicable)</Label>
            <Input 
              id="businessName"
              value={onboardingData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              placeholder="Your business name"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="yearsInRealEstate">Years in Real Estate</Label>
            <Input 
              id="yearsInRealEstate"
              value={onboardingData.yearsInRealEstate}
              onChange={(e) => handleInputChange('yearsInRealEstate', e.target.value)}
              placeholder="How many years of experience"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="businessType">Business Entity Type</Label>
            <Select 
              value={onboardingData.businessType} 
              onValueChange={(value) => handleInputChange('businessType', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  }
  
  // Step 2: Seller Activity
  function renderStep2() {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-1">Seller Activity</h3>
          <p className="text-gray-500 text-sm mb-4">Tell us about your real estate focus</p>
        </div>
        
        <div className="space-y-5">
          <div>
            <Label className="block mb-2">Target Markets</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {marketOptions.map((market) => (
                <MultiSelectItem
                  key={market}
                  selected={onboardingData.targetMarkets.includes(market)}
                  onClick={() => handleMultiSelect('targetMarkets', market)}
                >
                  {market}
                </MultiSelectItem>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="block mb-2">Deal Types</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {dealTypes.map((dealType) => (
                <MultiSelectItem
                  key={dealType}
                  selected={onboardingData.dealTypes.includes(dealType)}
                  onClick={() => handleMultiSelect('dealTypes', dealType)}
                >
                  {dealType}
                </MultiSelectItem>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="maxDealVolume">Maximum Deal Volume</Label>
            <Select 
              value={onboardingData.maxDealVolume} 
              onValueChange={(value) => handleInputChange('maxDealVolume', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select deal volume" />
              </SelectTrigger>
              <SelectContent>
                {dealVolumeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="hasBuyerList" 
              checked={onboardingData.hasBuyerList}
              onCheckedChange={(checked) => handleInputChange('hasBuyerList', checked)}
            />
            <div>
              <Label 
                htmlFor="hasBuyerList" 
                className="block font-medium cursor-pointer"
              >
                I have an active buyer list
              </Label>
              <p className="text-gray-500 text-sm">
                Check if you maintain a network of active property buyers
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="isDirectToSeller" 
              checked={onboardingData.isDirectToSeller}
              onCheckedChange={(checked) => handleInputChange('isDirectToSeller', checked)}
            />
            <div>
              <Label 
                htmlFor="isDirectToSeller" 
                className="block font-medium cursor-pointer"
              >
                I directly work with property owners
              </Label>
              <p className="text-gray-500 text-sm">
                Check if you work directly with homeowners/property owners
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Step 3: Trust & Verification
  function renderStep3() {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-1">Trust & Credibility</h3>
          <p className="text-gray-500 text-sm mb-4">Help us verify your real estate business</p>
        </div>
        
        <div className="space-y-5">
          <div>
            <Label htmlFor="websiteUrl">Website URL (if available)</Label>
            <Input 
              id="websiteUrl"
              value={onboardingData.websiteUrl}
              onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
              placeholder="https://your-business-website.com"
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="socialFacebook">Facebook Profile</Label>
              <Input 
                id="socialFacebook"
                value={onboardingData.socialFacebook}
                onChange={(e) => handleInputChange('socialFacebook', e.target.value)}
                placeholder="Username or URL"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="socialInstagram">Instagram Profile</Label>
              <Input 
                id="socialInstagram"
                value={onboardingData.socialInstagram}
                onChange={(e) => handleInputChange('socialInstagram', e.target.value)}
                placeholder="Username or URL"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="socialLinkedin">LinkedIn Profile</Label>
              <Input 
                id="socialLinkedin"
                value={onboardingData.socialLinkedin}
                onChange={(e) => handleInputChange('socialLinkedin', e.target.value)}
                placeholder="Username or URL"
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="purchaseAgreements">Upload Sample Purchase Agreement</Label>
            <Input 
              id="purchaseAgreements"
              type="file"
              onChange={(e) => handleFileChange('purchaseAgreements', e.target.files)}
              className="mt-1"
              accept=".pdf,.doc,.docx"
            />
            <p className="text-gray-500 text-xs mt-1">
              Upload a blank/redacted version of your purchase agreement template (PDF, DOC)
            </p>
          </div>
          
          <div>
            <Label htmlFor="assignmentContracts">Upload Sample Assignment Contract</Label>
            <Input 
              id="assignmentContracts"
              type="file"
              onChange={(e) => handleFileChange('assignmentContracts', e.target.files)}
              className="mt-1"
              accept=".pdf,.doc,.docx"
            />
            <p className="text-gray-500 text-xs mt-1">
              If you use assignment contracts, upload a redacted sample (PDF, DOC)
            </p>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="hasProofOfFunds" 
              checked={onboardingData.hasProofOfFunds}
              onCheckedChange={(checked) => handleInputChange('hasProofOfFunds', checked)}
            />
            <div>
              <Label 
                htmlFor="hasProofOfFunds" 
                className="block font-medium cursor-pointer"
              >
                I can provide proof of funds when required
              </Label>
              <p className="text-gray-500 text-sm">
                Check if you can provide proof of funds for cash transactions
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="usesTitleCompany" 
              checked={onboardingData.usesTitleCompany}
              onCheckedChange={(checked) => handleInputChange('usesTitleCompany', checked)}
            />
            <div>
              <Label 
                htmlFor="usesTitleCompany" 
                className="block font-medium cursor-pointer"
              >
                I work with title companies or closing attorneys
              </Label>
              <p className="text-gray-500 text-sm">
                Check if you regularly work with professional closing services
              </p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Additional Information</Label>
            <Textarea 
              id="notes"
              value={onboardingData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional information about your business that might help with verification"
              className="mt-1 min-h-[100px]"
            />
          </div>
        </div>
      </div>
    );
  }
  
  // Step 4: Review & Submit
  function renderStep4() {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-1">Review & Submit</h3>
          <p className="text-gray-500 text-sm mb-4">Review your application before submitting</p>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Full Name:</dt>
                  <dd className="font-medium text-right">{onboardingData.fullName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Email:</dt>
                  <dd className="font-medium text-right">{onboardingData.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Phone:</dt>
                  <dd className="font-medium text-right">{onboardingData.phone}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Business Name:</dt>
                  <dd className="font-medium text-right">{onboardingData.businessName || 'N/A'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Years in Real Estate:</dt>
                  <dd className="font-medium text-right">{onboardingData.yearsInRealEstate}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Business Type:</dt>
                  <dd className="font-medium text-right">
                    {businessTypes.find(t => t.value === onboardingData.businessType)?.label || 'N/A'}
                  </dd>
                </div>
              </dl>
              <div className="mt-2 flex justify-end">
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => handleJumpToStep(1)}
                  className="h-auto p-0"
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Seller Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div>
                  <dt className="text-gray-500 mb-1">Target Markets:</dt>
                  <dd>
                    <div className="flex flex-wrap gap-1">
                      {onboardingData.targetMarkets.length > 0 ? (
                        onboardingData.targetMarkets.map(market => (
                          <Badge key={market} variant="secondary" className="font-normal">
                            {market}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500 italic">None selected</span>
                      )}
                    </div>
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500 mb-1">Deal Types:</dt>
                  <dd>
                    <div className="flex flex-wrap gap-1">
                      {onboardingData.dealTypes.length > 0 ? (
                        onboardingData.dealTypes.map(type => (
                          <Badge key={type} variant="secondary" className="font-normal">
                            {type}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500 italic">None selected</span>
                      )}
                    </div>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Maximum Deal Volume:</dt>
                  <dd className="font-medium text-right">
                    {dealVolumeOptions.find(v => v.value === onboardingData.maxDealVolume)?.label || 'N/A'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Has Buyer List:</dt>
                  <dd className="font-medium text-right">{onboardingData.hasBuyerList ? 'Yes' : 'No'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Works Directly with Owners:</dt>
                  <dd className="font-medium text-right">{onboardingData.isDirectToSeller ? 'Yes' : 'No'}</dd>
                </div>
              </dl>
              <div className="mt-2 flex justify-end">
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => handleJumpToStep(2)}
                  className="h-auto p-0"
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Trust & Credibility</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Website:</dt>
                  <dd className="font-medium text-right">{onboardingData.websiteUrl || 'N/A'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Facebook:</dt>
                  <dd className="font-medium text-right">{onboardingData.socialFacebook || 'N/A'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Instagram:</dt>
                  <dd className="font-medium text-right">{onboardingData.socialInstagram || 'N/A'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">LinkedIn:</dt>
                  <dd className="font-medium text-right">{onboardingData.socialLinkedin || 'N/A'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Purchase Agreement:</dt>
                  <dd className="font-medium text-right">
                    {onboardingData.purchaseAgreements?.length 
                      ? onboardingData.purchaseAgreements[0].name 
                      : 'Not uploaded'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Assignment Contract:</dt>
                  <dd className="font-medium text-right">
                    {onboardingData.assignmentContracts?.length 
                      ? onboardingData.assignmentContracts[0].name 
                      : 'Not uploaded'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Can Provide Proof of Funds:</dt>
                  <dd className="font-medium text-right">{onboardingData.hasProofOfFunds ? 'Yes' : 'No'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Uses Title Companies:</dt>
                  <dd className="font-medium text-right">{onboardingData.usesTitleCompany ? 'Yes' : 'No'}</dd>
                </div>
              </dl>
              <div className="mt-2 flex justify-end">
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => handleJumpToStep(3)}
                  className="h-auto p-0"
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="certifyAccuracy" 
                checked={certifyAccuracy}
                onCheckedChange={(checked) => setCertifyAccuracy(!!checked)}
              />
              <div>
                <Label 
                  htmlFor="certifyAccuracy" 
                  className="block font-medium cursor-pointer"
                >
                  I certify that all information provided is accurate
                </Label>
                <p className="text-gray-500 text-sm">
                  By checking this box, you confirm that all information provided in this application is
                  true and accurate to the best of your knowledge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Handle form data change
  const handleInputChange = (field: keyof SellerOnboardingData, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle multi-select items
  const handleMultiSelect = (field: 'targetMarkets' | 'dealTypes', value: string) => {
    setOnboardingData(prev => {
      const currentValues = prev[field];
      const exists = currentValues.includes(value);
      
      const updatedValues = exists
        ? currentValues.filter(v => v !== value) // Remove if exists
        : [...currentValues, value]; // Add if doesn't exist
      
      return {
        ...prev,
        [field]: updatedValues
      };
    });
  };
  
  // Handle file uploads 
  const handleFileChange = (field: 'purchaseAgreements' | 'assignmentContracts', files: FileList | null) => {
    if (!files) return;
    
    setOnboardingData(prev => ({
      ...prev,
      [field]: Array.from(files)
    }));
  };
  
  // Navigation helpers
  const handleNextStep = async () => {
    if (currentStep < 4) {
      // Save draft before continuing
      await saveCurrentStep();
      setCurrentStep(prevStep => prevStep + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };
  
  // Jump to specific step (for edit buttons)
  const handleJumpToStep = (step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  };
  
  // Save current step as draft
  const saveCurrentStep = async () => {
    try {
      setIsSaving(true);
      const success = await saveSellerProfile(onboardingData, true);
      
      if (success) {
        toast({
          title: "Progress saved",
          description: "Your application has been saved as a draft.",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: "Failed to save your progress. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error saving step:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  // Validation
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          !!onboardingData.fullName && 
          !!onboardingData.email && 
          !!onboardingData.phone &&
          !!onboardingData.yearsInRealEstate &&
          !!onboardingData.businessType
        );
      case 2:
        return (
          onboardingData.targetMarkets.length > 0 &&
          onboardingData.dealTypes.length > 0 &&
          !!onboardingData.maxDealVolume
        );
      case 3:
        return true; // All fields optional in step 3
      case 4:
        return certifyAccuracy; // Must certify accuracy
      default:
        return true;
    }
  };
  
  // Form submission
  const handleSubmitApplication = async () => {
    if (!certifyAccuracy) {
      toast({
        title: "Certification required",
        description: "Please certify that the information provided is accurate and complete.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await submitSellerApplication(onboardingData);
      
      if (success) {
        setSellerStatus('pending');
        setIsModalOpen(false);
        
        toast({
          title: "Application Submitted",
          description: "Your seller application has been submitted successfully. We'll review it shortly.",
        });
      } else {
        toast({
          title: "Submission failed",
          description: "There was an error submitting your application. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
}