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
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
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
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Icons
import { 
  Home, MessageSquare, BarChart3, Settings, 
  ListPlus, Info, XIcon, ArrowLeft, HelpCircle,
  Loader2, Edit, FileCheck, FileWarning, Clock, Ban, Check
} from 'lucide-react';

// Sample data options
const yearsOptions = ['< 1 year', '1-2 years', '3-5 years', '5-10 years', '10+ years'];
const businessTypeOptions = ['Wholesaler', 'Rehabber/Flipper', 'Buy & Hold Investor', 'Agent/Broker', 'Other'];
const marketOptions = ['Milwaukee', 'Chicago', 'Detroit', 'Cleveland', 'Cincinnati', 'Indianapolis', 'Columbus', 'Atlanta', 'Tampa', 'Other'];
const dealTypeOptions = ['Wholesale/Assignment', 'Subject-To', 'Owner Finance', 'Fix & Flip', 'Buy & Hold', 'New Construction', 'Other'];
const dealVolumeOptions = ['1-2 deals/month', '3-5 deals/month', '6-10 deals/month', '10+ deals/month'];

// Styled pill component for market and deal type selections
const SelectablePill = ({ 
  label, 
  selected, 
  onClick,
  tooltipText
}: { 
  label: string, 
  selected: boolean, 
  onClick: () => void,
  tooltipText?: string
}) => {
  const baseClasses = "rounded-full px-4 py-2 text-sm transition border cursor-pointer";
  const selectedClasses = "bg-[#09261E] text-white border-[#09261E]";
  const unselectedClasses = "bg-white text-gray-700 border-gray-300 hover:bg-gray-100";
  
  const pill = (
    <div 
      className={`${baseClasses} ${selected ? selectedClasses : unselectedClasses}`}
      onClick={onClick}
    >
      {label}
    </div>
  );
  
  if (tooltipText) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {pill}
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return pill;
};

// Volume Pill Group component
const VolumePillGroup = ({ 
  options, 
  value, 
  onChange 
}: { 
  options: string[], 
  value: string, 
  onChange: (value: string) => void 
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(option => (
        <SelectablePill
          key={option}
          label={option}
          selected={value === option}
          onClick={() => onChange(option)}
        />
      ))}
    </div>
  );
};

// Status indicator component
const StatusIndicator = ({ status }: { status: SellerStatus }) => {
  let color = "";
  let icon = null;
  let label = "";
  
  switch (status) {
    case 'active':
      color = "bg-green-100 text-green-800 border-green-200";
      icon = <Check className="w-4 h-4" />;
      label = "Active";
      break;
    case 'pending':
      color = "bg-blue-100 text-blue-800 border-blue-200";
      icon = <Clock className="w-4 h-4" />;
      label = "Pending Review";
      break;
    case 'rejected':
      color = "bg-red-100 text-red-800 border-red-200";
      icon = <FileWarning className="w-4 h-4" />;
      label = "Rejected";
      break;
    case 'paused':
      color = "bg-amber-100 text-amber-800 border-amber-200";
      icon = <FileCheck className="w-4 h-4" />;
      label = "Paused";
      break;
    case 'banned':
      color = "bg-red-100 text-red-800 border-red-200";
      icon = <Ban className="w-4 h-4" />;
      label = "Restricted";
      break;
    default:
      color = "bg-gray-100 text-gray-800 border-gray-200";
      icon = <Info className="w-4 h-4" />;
      label = "Not Applied";
  }
  
  return (
    <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 ${color}`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

// Review summary component for step 4
const ReviewSummary = ({ 
  data, 
  onEdit 
}: { 
  data: SellerOnboardingData, 
  onEdit: (step: number) => void 
}) => {
  return (
    <div className="space-y-6">
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b">
          <h4 className="font-medium text-gray-700">Basic Information</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(1)}
            className="h-8 px-2"
          >
            <Edit className="h-4 w-4 mr-1" />
            <span>Edit</span>
          </Button>
        </div>
        <div className="p-4 space-y-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="text-sm font-medium">{data.fullName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium">{data.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm font-medium">{data.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Business Name</p>
              <p className="text-sm font-medium">{data.businessName || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Years in Real Estate</p>
              <p className="text-sm font-medium">{data.yearsInRealEstate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Business Type</p>
              <p className="text-sm font-medium">{data.businessType}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b">
          <h4 className="font-medium text-gray-700">Activity & Preferences</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(2)}
            className="h-8 px-2"
          >
            <Edit className="h-4 w-4 mr-1" />
            <span>Edit</span>
          </Button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Target Markets</p>
            <div className="flex flex-wrap gap-1.5">
              {data.targetMarkets.map(market => (
                <span key={market} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {market}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Deal Types</p>
            <div className="flex flex-wrap gap-1.5">
              {data.dealTypes.map(type => (
                <span key={type} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {type}
                </span>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            <div>
              <p className="text-xs text-gray-500">Max Deal Volume</p>
              <p className="text-sm font-medium">{data.maxDealVolume}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Buyer List</p>
              <p className="text-sm font-medium">{data.hasBuyerList ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Direct to Seller</p>
              <p className="text-sm font-medium">{data.isDirectToSeller ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b">
          <h4 className="font-medium text-gray-700">Trust & Credibility</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(3)}
            className="h-8 px-2"
          >
            <Edit className="h-4 w-4 mr-1" />
            <span>Edit</span>
          </Button>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <p className="text-xs text-gray-500">Purchase Agreements</p>
              <p className="text-sm font-medium">
                {data.purchaseAgreements?.length 
                  ? `${data.purchaseAgreements.length} file(s) uploaded` 
                  : 'None uploaded'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Assignment Contracts</p>
              <p className="text-sm font-medium">
                {data.assignmentContracts?.length 
                  ? `${data.assignmentContracts.length} file(s) uploaded` 
                  : 'None uploaded'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Website</p>
              <p className="text-sm font-medium">{data.websiteUrl || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Facebook</p>
              <p className="text-sm font-medium">{data.socialFacebook || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Instagram</p>
              <p className="text-sm font-medium">{data.socialInstagram || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">LinkedIn</p>
              <p className="text-sm font-medium">{data.socialLinkedin || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Proof of Funds Available</p>
              <p className="text-sm font-medium">{data.hasProofOfFunds ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Uses Title Companies</p>
              <p className="text-sm font-medium">{data.usesTitleCompany ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          {data.notes && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Additional Notes</p>
              <p className="text-sm bg-gray-50 p-2 rounded">{data.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Upload area component with drag and drop
const FileUploadArea = ({
  id,
  label,
  accept,
  onChange,
  files,
  helpText
}: {
  id: string;
  label: string;
  accept: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  files: File[] | null;
  helpText?: string;
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer">
        <input
          id={id}
          type="file"
          className="hidden"
          multiple
          accept={accept}
          onChange={onChange}
        />
        <label htmlFor={id} className="cursor-pointer">
          <div className="flex flex-col items-center">
            <FileCheck className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700">
              Drag files here or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {accept.split(',').join(', ')} files accepted
            </p>
          </div>
        </label>
      </div>
      
      {files && files.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-700 mb-1">Selected files:</p>
          <ul className="space-y-1">
            {Array.from(files).map((file, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center">
                <FileCheck className="h-4 w-4 text-green-500 mr-1" />
                {file.name} ({Math.round(file.size / 1024)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
    </div>
  );
};

export default function SellerDash() {
  const [location, setLocation] = useLocation();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  
  // Application state
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sellerStatus, setSellerStatus] = useState<SellerStatus>('none');
  const [certifyAccuracy, setCertifyAccuracy] = useState(false);
  
  // Initialize with empty form
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
  
  // Load seller status and profile data with improved error handling
  useEffect(() => {
    const loadSellerData = async () => {
      try {
        setIsLoading(true);
        console.log("Starting to load seller data");
        
        // Direct query to check if we're authenticated first
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          console.log("User not authenticated:", userError?.message || "No user found");
          // Set a default state for unauthenticated users
          setSellerStatus('none');
          setIsLoading(false);
          setIsModalOpen(true); // Show modal for unauthenticated users too
          return;
        }

        console.log("Authenticated user:", userData.user.id);
        
        // Direct Supabase query to get seller status
        const { data: sellerData, error: sellerError } = await supabase
          .from('sellers')
          .select('*')
          .eq('userId', userData.user.id)
          .maybeSingle();
        
        if (sellerError) {
          console.error('Error fetching seller data:', sellerError);
          toast({
            title: "Database Error",
            description: "Could not fetch your seller profile. " + sellerError.message,
            variant: "destructive"
          });
          // Don't get stuck - set a default state
          setSellerStatus('none');
          setIsModalOpen(true);
        } else if (sellerData) {
          // We have a seller record
          console.log("Seller data found:", sellerData);
          const status = sellerData.status as SellerStatus;
          setSellerStatus(status);
          
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
          
          // Display appropriate UI based on status
          if (status === 'rejected') {
            setIsModalOpen(true);
          }
        } else {
          // No seller record found - new user
          console.log("No seller data found - new user");
          setSellerStatus('none');
          
          // Pre-populate with user data if available
          if (user) {
            setOnboardingData(prev => ({
              ...prev,
              fullName: user.fullName || '',
              email: user.email || ''
            }));
          }
          
          // Show the modal for new users
          setIsModalOpen(true);
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
        setIsModalOpen(true);
      } finally {
        // Always exit loading state, even on error
        setIsLoading(false);
      }
    };
    
    // Start loading immediately, but handle case if user is not available
    loadSellerData();
  }, [user, toast]);
  
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
  
  // Render status-specific modals
  const renderStatusModal = () => {
    if (isModalOpen) return null;
    
    switch (sellerStatus) {
      case 'pending':
        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Application Status</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setLocation('/')}
                >
                  <XIcon className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
              <div className="py-8 text-center">
                <Info className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                <h3 className="text-xl font-medium mb-2">Application Under Review</h3>
                <p className="text-gray-600 mb-6">
                  Your seller application is currently being reviewed by our team. 
                  This process typically takes 1-2 business days.
                </p>
                <Button
                  onClick={() => setLocation('/')}
                >
                  Return to Homepage
                </Button>
              </div>
            </div>
          </div>
        );
        
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
                <h2 className="text-2xl font-semibold">Access Restricted</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setLocation('/')}
                >
                  <XIcon className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
              <div className="py-8 text-center">
                <Info className="h-16 w-16 mx-auto text-red-500 mb-4" />
                <h3 className="text-xl font-medium mb-2">Access Denied</h3>
                <p className="text-gray-600 mb-6">
                  Your seller privileges have been restricted. 
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
        
      default:
        return null;
    }
  };
  
  // Render multi-step onboarding modal
  const renderOnboardingModal = () => {
    if (!isModalOpen) return null;
    
    const progressPercent = currentStep * 25;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-hidden">
        <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-semibold">Seller Application</h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setLocation('/help')}
              >
                <HelpCircle className="h-5 w-5 text-gray-500" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setLocation('/')}
              >
                <XIcon className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>
          
          <div className="px-6 pt-4 pb-2">
            <Progress value={progressPercent} className="h-2.5 bg-gray-200">
              <div className="h-full bg-[#09261E] rounded-full transition-all duration-300 ease-in-out"></div>
            </Progress>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span className={currentStep >= 1 ? "text-[#09261E] font-medium" : ""}>Basic Info</span>
              <span className={currentStep >= 2 ? "text-[#09261E] font-medium" : ""}>Activity</span>
              <span className={currentStep >= 3 ? "text-[#09261E] font-medium" : ""}>Trust</span>
              <span className={currentStep >= 4 ? "text-[#09261E] font-medium" : ""}>Review</span>
            </div>
          </div>
          
          <div className="py-6 px-6 flex-1 overflow-y-auto">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Basic Information</h3>
                  <p className="text-gray-600">Start by telling us about yourself and your business.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="fullName"
                      value={onboardingData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="border-gray-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                    <Input 
                      id="email"
                      type="email"
                      value={onboardingData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="border-gray-300"
                      disabled={!!user?.email}
                    />
                    {user?.email && (
                      <p className="text-xs text-gray-500">Email is linked to your account and cannot be changed</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                    <Input 
                      id="phone"
                      value={onboardingData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      required
                      className="border-gray-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name (Optional)</Label>
                    <Input 
                      id="businessName"
                      value={onboardingData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="Your company name"
                      className="border-gray-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="yearsInRealEstate">Years in Real Estate <span className="text-red-500">*</span></Label>
                    <Select 
                      value={onboardingData.yearsInRealEstate}
                      onValueChange={(value) => handleInputChange('yearsInRealEstate', value)}
                    >
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select your experience" />
                      </SelectTrigger>
                      <SelectContent>
                        {yearsOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type <span className="text-red-500">*</span></Label>
                    <Select 
                      value={onboardingData.businessType}
                      onValueChange={(value) => handleInputChange('businessType', value)}
                    >
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypeOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Activity & Preferences</h3>
                  <p className="text-gray-600">Tell us about your property deals and preferences.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Target Markets <span className="text-red-500">*</span></Label>
                    <div className="flex flex-wrap gap-2">
                      {marketOptions.map((market) => (
                        <SelectablePill
                          key={market}
                          label={market}
                          selected={onboardingData.targetMarkets.includes(market)}
                          onClick={() => handleMultiSelect('targetMarkets', market)}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Select all markets where you're looking for deals</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Deal Types <span className="text-red-500">*</span></Label>
                    <div className="flex flex-wrap gap-2">
                      {dealTypeOptions.map((dealType) => {
                        let tooltipText = '';
                        if (dealType === 'Subject-To') {
                          tooltipText = 'Buying a property subject to the existing mortgage';
                        } else if (dealType === 'Owner Finance') {
                          tooltipText = 'Seller provides financing for the buyer';
                        }
                        
                        return (
                          <SelectablePill
                            key={dealType}
                            label={dealType}
                            selected={onboardingData.dealTypes.includes(dealType)}
                            onClick={() => handleMultiSelect('dealTypes', dealType)}
                            tooltipText={tooltipText}
                          />
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Select all deal types you typically work with</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxDealVolume">Monthly Deal Volume <span className="text-red-500">*</span></Label>
                    <VolumePillGroup
                      options={dealVolumeOptions}
                      value={onboardingData.maxDealVolume}
                      onChange={(value) => handleInputChange('maxDealVolume', value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">How many deals do you typically handle per month?</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="hasBuyerList"
                          checked={onboardingData.hasBuyerList}
                          onCheckedChange={(checked) => {
                            handleInputChange('hasBuyerList', !!checked);
                          }}
                        />
                        <Label htmlFor="hasBuyerList" className="font-medium text-gray-700">
                          I have an active buyer list
                        </Label>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 ml-6">
                        Check this if you maintain a list of active buyers for your deals
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="isDirectToSeller"
                          checked={onboardingData.isDirectToSeller}
                          onCheckedChange={(checked) => {
                            handleInputChange('isDirectToSeller', !!checked);
                          }}
                        />
                        <Label htmlFor="isDirectToSeller" className="font-medium text-gray-700">
                          I work directly with sellers
                        </Label>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 ml-6">
                        Check this if you primarily source properties directly from homeowners
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Trust & Credibility</h3>
                  <p className="text-gray-600">Build trust with documentation and professional information.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <FileUploadArea
                      id="purchaseAgreements"
                      label="Purchase Agreements (Optional)"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange('purchaseAgreements', e.target.files)}
                      files={onboardingData.purchaseAgreements}
                      helpText="Upload examples of past purchase agreements (redacted if necessary)"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <FileUploadArea
                      id="assignmentContracts"
                      label="Assignment Contracts (Optional)"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange('assignmentContracts', e.target.files)}
                      files={onboardingData.assignmentContracts}
                      helpText="Upload examples of assignment contracts you've used (redacted if necessary)"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input 
                      id="websiteUrl"
                      value={onboardingData.websiteUrl}
                      onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="border-gray-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="socialFacebook">Facebook Profile</Label>
                    <Input 
                      id="socialFacebook"
                      value={onboardingData.socialFacebook}
                      onChange={(e) => handleInputChange('socialFacebook', e.target.value)}
                      placeholder="https://facebook.com/yourprofile"
                      className="border-gray-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="socialInstagram">Instagram Profile</Label>
                    <Input 
                      id="socialInstagram"
                      value={onboardingData.socialInstagram}
                      onChange={(e) => handleInputChange('socialInstagram', e.target.value)}
                      placeholder="https://instagram.com/yourprofile"
                      className="border-gray-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="socialLinkedin">LinkedIn Profile</Label>
                    <Input 
                      id="socialLinkedin"
                      value={onboardingData.socialLinkedin}
                      onChange={(e) => handleInputChange('socialLinkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="border-gray-300"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea 
                      id="notes"
                      value={onboardingData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Add any additional information about your business, experience, or deal preferences"
                      rows={3}
                      className="border-gray-300 w-full mt-1"
                    />
                  </div>
                  
                  <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="hasProofOfFunds"
                        checked={onboardingData.hasProofOfFunds}
                        onCheckedChange={(checked) => {
                          handleInputChange('hasProofOfFunds', !!checked);
                        }}
                      />
                      <Label htmlFor="hasProofOfFunds" className="font-medium text-gray-700">
                        I can provide proof of funds
                      </Label>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 ml-6">
                      For serious deals, I can provide proof of funds when requested
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="usesTitleCompany"
                        checked={onboardingData.usesTitleCompany}
                        onCheckedChange={(checked) => {
                          handleInputChange('usesTitleCompany', !!checked);
                        }}
                      />
                      <Label htmlFor="usesTitleCompany" className="font-medium text-gray-700">
                        I use verified title companies
                      </Label>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 ml-6">
                      I work with reputable title companies for clean closings
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Review & Submit</h3>
                  <p className="text-gray-600">Review your information before submitting your application.</p>
                </div>
                
                <ReviewSummary 
                  data={onboardingData} 
                  onEdit={handleJumpToStep} 
                />
                
                <div className="p-4 rounded-md border border-gray-200 bg-gray-50 mt-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="certifyAccuracy"
                      checked={certifyAccuracy}
                      onCheckedChange={(checked) => {
                        setCertifyAccuracy(!!checked);
                      }}
                      required
                    />
                    <Label htmlFor="certifyAccuracy" className="font-medium text-gray-700">
                      I certify that the information provided is accurate and complete
                    </Label>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700 border border-blue-100">
                  <p className="flex items-start">
                    <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      By submitting this application, you are requesting to become a verified seller on PropertyDeals.
                      Your application will be reviewed by our team, and you will be notified once a decision has been made.
                      This typically takes 1-2 business days.
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between p-4 border-t bg-gray-50 rounded-b-xl mt-auto">
            {currentStep > 1 ? (
              <Button 
                onClick={handlePrevStep}
                variant="outline"
                disabled={isSubmitting || isSaving}
                className="min-w-[100px]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            ) : (
              <Button
                onClick={() => setLocation('/')}
                variant="outline"
                disabled={isSubmitting || isSaving}
                className="min-w-[100px]"
              >
                Cancel
              </Button>
            )}
            
            <div className="flex gap-3">
              {currentStep < 4 && (
                <Button
                  variant="outline"
                  onClick={saveCurrentStep}
                  disabled={!isCurrentStepValid() || isSubmitting || isSaving}
                  className="min-w-[140px]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save & Exit'
                  )}
                </Button>
              )}
              
              {currentStep < 4 ? (
                <Button 
                  onClick={handleNextStep}
                  disabled={!isCurrentStepValid() || isSubmitting || isSaving}
                  className="min-w-[100px] bg-[#09261E] hover:bg-[#135341]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Next'
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmitApplication}
                  disabled={!isCurrentStepValid() || isSubmitting}
                  className="min-w-[160px] bg-[#803344] hover:bg-[#692a38]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Main dashboard content (only shown if seller is active)
  const renderDashboardContent = () => {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
              <StatusIndicator status={sellerStatus} />
            </div>
            <p className="text-gray-600">Manage your properties, deals, and seller profile</p>
          </div>
          <Button className="bg-[#135341] hover:bg-[#09261E]">
            <ListPlus className="h-4 w-4 mr-2" />
            List New Property
          </Button>
        </div>
        
        <Tabs defaultValue="properties" className="mb-6">
          <TabsList className="mb-4 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="properties" className="flex items-center gap-1 data-[state=active]:bg-white">
              <Home className="h-4 w-4" />
              <span>Properties</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-1 data-[state=active]:bg-white">
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1 data-[state=active]:bg-white">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 data-[state=active]:bg-white">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <CardTitle>My Properties</CardTitle>
                <CardDescription>Manage your property listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ListPlus className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Properties Listed Yet</h3>
                  <p className="text-gray-500 max-w-md mb-6">
                    You haven't listed any properties yet. Click the button below to get started
                    with your first property listing.
                  </p>
                  <Button>
                    <ListPlus className="h-4 w-4 mr-2" />
                    List New Property
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Communicate with potential buyers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Messages Yet</h3>
                  <p className="text-gray-500 max-w-md">
                    Messages will appear here when you receive inquiries about your properties.
                    List a property to start receiving messages.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Track performance of your listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BarChart3 className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Analytics Available</h3>
                  <p className="text-gray-500 max-w-md">
                    Listing analytics will be available once you have active property listings.
                    You'll be able to track views, inquiries, and engagement.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your seller account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">Seller Profile</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Update your profile information, preferences, and documents
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsModalOpen(true);
                          setCurrentStep(1);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">Notification Preferences</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Configure how you receive updates and inquiries
                        </p>
                      </div>
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Manage Notifications
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">Listing Preferences</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Set default values for your property listings
                        </p>
                      </div>
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure Defaults
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };
  
  // Handle both auth loading and seller profile loading states
  if (isAuthLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center text-center">
          <Loader2 className="h-12 w-12 text-[#135341] animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {isAuthLoading ? "Checking Authentication..." : "Loading Seller Dashboard"}
          </h2>
          <p className="text-gray-600 max-w-md mb-8">
            {isAuthLoading 
              ? "Please wait while we verify your account."
              : "We're checking your seller account status..."}
          </p>
          {/* Show an escape option if it takes too long */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setIsLoading(false); 
              setSellerStatus('none');
              setIsModalOpen(true);
            }}
          >
            Continue without waiting
          </Button>
        </div>
      </div>
    );
  }
  
  // Check if we're not authenticated
  if (!user && !isAuthLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center text-center max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-8">
            You need to sign in or create an account to access the seller dashboard.
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setLocation('/')}
            >
              Return Home
            </Button>
            <Button
              onClick={() => setLocation('/auth')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {renderStatusModal()}
      {renderOnboardingModal()}
      {sellerStatus === 'active' ? (
        renderDashboardContent()
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-600 mt-2">Complete your seller application to access the dashboard</p>
          </div>
          
          {!isModalOpen && sellerStatus === 'none' && (
            <Card className="max-w-xl mx-auto">
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
                  <h3 className="text-xl font-medium mb-2">Ready to Sell Properties?</h3>
                  <p className="text-gray-600 max-w-md mb-6">
                    Complete a quick application to become a verified seller and gain
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
          
          {!isModalOpen && sellerStatus === 'pending' && (
            <Card className="max-w-xl mx-auto">
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
          
          {!isModalOpen && sellerStatus === 'rejected' && (
            <Card className="max-w-xl mx-auto">
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
        </div>
      )}
    </>
  );
}