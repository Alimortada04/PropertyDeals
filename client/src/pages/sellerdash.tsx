import React, { useState, useEffect } from 'react';
import { useLocation, Redirect } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Home, ListPlus, MessageSquare, BarChart3, Settings, AlertTriangle, XCircle, Info, ArrowLeft, XIcon, HelpCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

type SellerStatus = 'none' | 'pending' | 'rejected' | 'paused' | 'banned' | 'active';

interface SellerOnboardingData {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  yearsInRealEstate: string;
  businessType: string;
  
  // Step 2
  targetMarkets: string[];
  dealTypes: string[];
  maxDealVolume: string;
  hasBuyerList: boolean;
  isDirectToSeller: boolean;
  
  // Step 3
  purchaseAgreements: File[] | null;
  assignmentContracts: File[] | null;
  notes: string;
  websiteUrl: string;
  socialProfiles: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
  hasProofOfFunds: boolean;
  usesTitleCompany: boolean;
}

export default function SellerDash() {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Seller status and modal state
  const [sellerStatus, setSellerStatus] = useState<SellerStatus>('none');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Onboarding wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<SellerOnboardingData>({
    fullName: user?.fullName || '',
    email: user?.email || '',
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
    socialProfiles: {
      facebook: '',
      instagram: '',
      linkedin: ''
    },
    hasProofOfFunds: false,
    usesTitleCompany: false
  });
  
  // Options for select inputs
  const yearsOptions = ["Less than 1", "1-2", "3-5", "6-10", "More than 10"];
  const businessTypeOptions = ["Wholesaler", "Agent", "Flipper", "Buy & Hold Investor", "Developer", "Other"];
  const marketOptions = ["Milwaukee", "Madison", "Green Bay", "Chicago", "Minneapolis", "Other"];
  const dealTypeOptions = ["Assignments", "Fix & Flip", "Subject-To", "Buy & Hold", "Land Development", "Other"];
  const dealVolumeOptions = ["1-2 per month", "3-5 per month", "6-10 per month", "More than 10 per month"];
  
  // Fetch seller status on component mount
  useEffect(() => {
    const fetchSellerStatus = async () => {
      if (!user) return;
      
      try {
        // Check if user has an existing seller profile
        const { data, error } = await supabase
          .from('seller_profiles')
          .select('status')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            // No records found - user has no seller profile
            setSellerStatus('none');
          } else {
            console.error('Error fetching seller status:', error);
            toast({
              title: 'Error fetching seller status',
              description: error.message,
              variant: 'destructive'
            });
          }
        } else if (data) {
          setSellerStatus(data.status as SellerStatus);
        }
      } catch (error) {
        console.error('Error in fetchSellerStatus:', error);
      }
    };
    
    fetchSellerStatus();
  }, [user, toast]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Allow access even without auth for testing
  // if (!user) {
  //   return <Redirect to="/signin" />;
  // }
  
  // Handle updating onboarding data
  const handleInputChange = (field: keyof SellerOnboardingData, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle social profile updates
  const handleSocialChange = (platform: keyof SellerOnboardingData['socialProfiles'], value: string) => {
    setOnboardingData(prev => ({
      ...prev,
      socialProfiles: {
        ...prev.socialProfiles,
        [platform]: value
      }
    }));
  };
  
  // Handle file uploads
  const handleFileChange = (field: 'purchaseAgreements' | 'assignmentContracts', files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    setOnboardingData(prev => ({
      ...prev,
      [field]: fileArray
    }));
  };
  
  // Check if current step is valid before allowing next
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          onboardingData.fullName.trim() !== '' && 
          onboardingData.email.trim() !== '' && 
          onboardingData.phone.trim() !== ''
        );
      case 2:
        return (
          onboardingData.targetMarkets.length > 0 &&
          onboardingData.dealTypes.length > 0 &&
          onboardingData.maxDealVolume !== ''
        );
      case 3:
        // Files are optional, but if they're going to provide them, they should upload at least one
        return true;
      case 4:
        // Review step - all checks have been done in previous steps
        return true;
      default:
        return false;
    }
  };
  
  // Handle going to next step
  const handleNextStep = () => {
    if (isCurrentStepValid()) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast({
        title: 'Please complete required fields',
        description: 'All required fields must be filled in before proceeding.',
        variant: 'destructive'
      });
    }
  };
  
  // Handle going to previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };
  
  // Handle multiple select (checkboxes)
  const handleMultiSelect = (field: 'targetMarkets' | 'dealTypes', value: string) => {
    setOnboardingData(prev => {
      const currentValues = prev[field];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [field]: updatedValues
      };
    });
  };
  
  // Handle form submission
  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    
    try {
      // 1. Upload files to storage if present
      let purchaseAgreementUrls: string[] = [];
      let assignmentContractUrls: string[] = [];
      
      if (onboardingData.purchaseAgreements && onboardingData.purchaseAgreements.length > 0) {
        for (const file of onboardingData.purchaseAgreements) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}-purchase-agreement.${fileExt}`;
          
          const { data, error } = await supabase.storage
            .from('seller_documents')
            .upload(fileName, file);
          
          if (error) throw error;
          
          const { data: urlData } = supabase.storage.from('seller_documents').getPublicUrl(fileName);
          purchaseAgreementUrls.push(urlData.publicUrl);
        }
      }
      
      if (onboardingData.assignmentContracts && onboardingData.assignmentContracts.length > 0) {
        for (const file of onboardingData.assignmentContracts) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}-assignment-contract.${fileExt}`;
          
          const { data, error } = await supabase.storage
            .from('seller_documents')
            .upload(fileName, file);
          
          if (error) throw error;
          
          const { data: urlData } = supabase.storage.from('seller_documents').getPublicUrl(fileName);
          assignmentContractUrls.push(urlData.publicUrl);
        }
      }
      
      // 2. Create seller profile record
      const { data, error } = await supabase.from('seller_profiles').insert({
        user_id: user.id,
        full_name: onboardingData.fullName,
        email: onboardingData.email,
        phone: onboardingData.phone,
        business_name: onboardingData.businessName,
        years_in_real_estate: onboardingData.yearsInRealEstate,
        business_type: onboardingData.businessType,
        target_markets: onboardingData.targetMarkets,
        deal_types: onboardingData.dealTypes,
        max_deal_volume: onboardingData.maxDealVolume,
        has_buyer_list: onboardingData.hasBuyerList,
        is_direct_to_seller: onboardingData.isDirectToSeller,
        purchase_agreement_urls: purchaseAgreementUrls,
        assignment_contract_urls: assignmentContractUrls,
        notes: onboardingData.notes,
        website_url: onboardingData.websiteUrl,
        social_profiles: onboardingData.socialProfiles,
        has_proof_of_funds: onboardingData.hasProofOfFunds,
        uses_title_company: onboardingData.usesTitleCompany,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      if (error) throw error;
      
      // 3. Update user's roles if needed
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('roles')
        .eq('id', user.id)
        .single();
      
      if (!userError && userData) {
        const currentRoles = userData.roles || {};
        const updatedRoles = {
          ...currentRoles,
          seller: { status: 'pending' }
        };
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ roles: updatedRoles })
          .eq('id', user.id);
        
        if (updateError) {
          console.error('Error updating user roles:', updateError);
        }
      }
      
      // 4. Success!
      setSellerStatus('pending');
      toast({
        title: 'Application Submitted',
        description: 'Your seller application has been submitted for review.',
      });
      
    } catch (error: any) {
      toast({
        title: 'Error submitting application',
        description: error.message || 'There was an error submitting your application.',
        variant: 'destructive'
      });
      console.error('Error submitting seller application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render status modal based on seller status
  const renderStatusModal = () => {
    if (!isModalOpen) return null;
    
    let title = '';
    let message = '';
    let icon = null;
    let actions = null;
    
    switch (sellerStatus) {
      case 'none':
        return renderOnboardingModal();
      
      case 'pending':
        title = 'Application Under Review';
        message = 'Your seller account application is currently under review. We strive to process applications within 1-2 business days. You will be notified by email once your application has been processed.';
        icon = <Info className="h-16 w-16 text-blue-500 mb-4" />;
        actions = (
          <div className="flex flex-col space-y-2 w-full mt-4">
            <Button
              onClick={() => setLocation('/')}
              variant="default"
            >
              Return to Home
            </Button>
            <Button
              onClick={() => setIsModalOpen(false)}
              variant="outline"
            >
              Close
            </Button>
          </div>
        );
        break;
      
      case 'rejected':
        title = 'Application Not Approved';
        message = 'We regret to inform you that your seller application was not approved at this time. This could be due to incomplete information or not meeting our current criteria. Please contact support for more details.';
        icon = <XCircle className="h-16 w-16 text-red-500 mb-4" />;
        actions = (
          <div className="flex flex-col space-y-2 w-full mt-4">
            <Button
              onClick={() => setLocation('/help')}
              variant="default"
            >
              Contact Support
            </Button>
            <Button
              onClick={() => setLocation('/')}
              variant="outline"
            >
              Return to Home
            </Button>
          </div>
        );
        break;
      
      case 'paused':
        title = 'Account Paused';
        message = 'Your seller account is currently paused. This may be due to a temporary restriction or at your request. Please contact support if you believe this is in error or if you would like to reactivate your account.';
        icon = <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />;
        actions = (
          <div className="flex flex-col space-y-2 w-full mt-4">
            <Button
              onClick={() => setLocation('/help')}
              variant="default"
            >
              Contact Support
            </Button>
            <Button
              onClick={() => setLocation('/')}
              variant="outline"
            >
              Return to Home
            </Button>
          </div>
        );
        break;
      
      case 'banned':
        title = 'Access Restricted';
        message = 'Your account has been restricted from accessing the seller dashboard. This may be due to a violation of our terms of service or community guidelines. Please contact support for more information.';
        icon = <AlertTriangle className="h-16 w-16 text-red-600 mb-4" />;
        actions = (
          <div className="flex flex-col space-y-2 w-full mt-4">
            <Button
              onClick={() => setLocation('/help')}
              variant="default"
            >
              Contact Support
            </Button>
            <Button
              onClick={() => setLocation('/')}
              variant="outline"
            >
              Return to Home
            </Button>
          </div>
        );
        break;
      
      case 'active':
        // No modal for active sellers
        setIsModalOpen(false);
        return null;
      
      default:
        return null;
    }
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 flex flex-col items-center">
          {icon}
          <h2 className="text-xl font-semibold text-center mb-2">{title}</h2>
          <p className="text-gray-600 text-center mb-4">{message}</p>
          {actions}
        </div>
      </div>
    );
  };
  
  // Render multi-step onboarding modal
  const renderOnboardingModal = () => {
    if (!isModalOpen) return null;
    
    const progressPercent = currentStep * 25;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6">
          <div className="flex justify-between items-center mb-4">
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
          
          <div className="mb-6">
            <Progress value={progressPercent} className="h-2" />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Basic Info</span>
              <span>Activity</span>
              <span>Trust</span>
              <span>Review</span>
            </div>
          </div>
          
          <div className="py-4">
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 1: Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                  <Input 
                    id="fullName"
                    value={onboardingData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    required
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
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                  <Input 
                    id="phone"
                    value={onboardingData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name (Optional)</Label>
                  <Input 
                    id="businessName"
                    value={onboardingData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="Enter your business name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="yearsInRealEstate">How many years in real estate? <span className="text-red-500">*</span></Label>
                  <Select 
                    value={onboardingData.yearsInRealEstate}
                    onValueChange={(value) => handleInputChange('yearsInRealEstate', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select years of experience" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearsOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessType">What best describes your business? <span className="text-red-500">*</span></Label>
                  <Select 
                    value={onboardingData.businessType}
                    onValueChange={(value) => handleInputChange('businessType', value)}
                  >
                    <SelectTrigger>
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
            )}
            
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 2: Seller Activity & Preferences</h3>
                
                <div className="space-y-2">
                  <Label>Target markets <span className="text-red-500">*</span></Label>
                  <div className="grid grid-cols-2 gap-2">
                    {marketOptions.map((market) => (
                      <div key={market} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`market-${market}`}
                          checked={onboardingData.targetMarkets.includes(market)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleMultiSelect('targetMarkets', market);
                            } else {
                              handleMultiSelect('targetMarkets', market);
                            }
                          }}
                        />
                        <Label htmlFor={`market-${market}`} className="font-normal">{market}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Typical deal types <span className="text-red-500">*</span></Label>
                  <div className="grid grid-cols-2 gap-2">
                    {dealTypeOptions.map((dealType) => (
                      <div key={dealType} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`dealType-${dealType}`}
                          checked={onboardingData.dealTypes.includes(dealType)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleMultiSelect('dealTypes', dealType);
                            } else {
                              handleMultiSelect('dealTypes', dealType);
                            }
                          }}
                        />
                        <Label htmlFor={`dealType-${dealType}`} className="font-normal">{dealType}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxDealVolume">Max deal volume <span className="text-red-500">*</span></Label>
                  <Select 
                    value={onboardingData.maxDealVolume}
                    onValueChange={(value) => handleInputChange('maxDealVolume', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select max deal volume" />
                    </SelectTrigger>
                    <SelectContent>
                      {dealVolumeOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasBuyerList"
                    checked={onboardingData.hasBuyerList}
                    onCheckedChange={(checked) => {
                      handleInputChange('hasBuyerList', !!checked);
                    }}
                  />
                  <Label htmlFor="hasBuyerList" className="font-normal">Do you have a buyer list?</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isDirectToSeller"
                    checked={onboardingData.isDirectToSeller}
                    onCheckedChange={(checked) => {
                      handleInputChange('isDirectToSeller', !!checked);
                    }}
                  />
                  <Label htmlFor="isDirectToSeller" className="font-normal">Are you direct to seller on most deals?</Label>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 3: Trust & Credibility</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="purchaseAgreements">Upload past purchase agreements (PDF)</Label>
                  <Input 
                    id="purchaseAgreements"
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={(e) => handleFileChange('purchaseAgreements', e.target.files)}
                  />
                  <p className="text-xs text-gray-500">Upload examples of past purchase agreements (optional but recommended)</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assignmentContracts">Upload past assignment contracts (PDF)</Label>
                  <Input 
                    id="assignmentContracts"
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={(e) => handleFileChange('assignmentContracts', e.target.files)}
                  />
                  <p className="text-xs text-gray-500">Upload examples of past assignment contracts (optional but recommended)</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Optional notes</Label>
                  <Textarea 
                    id="notes"
                    value={onboardingData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Add any additional context about your deals or business"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Input 
                    id="websiteUrl"
                    value={onboardingData.websiteUrl}
                    onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="socialFacebook">Facebook profile</Label>
                  <Input 
                    id="socialFacebook"
                    value={onboardingData.socialProfiles.facebook}
                    onChange={(e) => handleSocialChange('facebook', e.target.value)}
                    placeholder="facebook.com/yourprofile"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="socialInstagram">Instagram profile</Label>
                  <Input 
                    id="socialInstagram"
                    value={onboardingData.socialProfiles.instagram}
                    onChange={(e) => handleSocialChange('instagram', e.target.value)}
                    placeholder="instagram.com/yourprofile"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="socialLinkedin">LinkedIn profile</Label>
                  <Input 
                    id="socialLinkedin"
                    value={onboardingData.socialProfiles.linkedin}
                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                    placeholder="linkedin.com/in/yourprofile"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasProofOfFunds"
                    checked={onboardingData.hasProofOfFunds}
                    onCheckedChange={(checked) => {
                      handleInputChange('hasProofOfFunds', !!checked);
                    }}
                  />
                  <Label htmlFor="hasProofOfFunds" className="font-normal">I have proof of funds access</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="usesTitleCompany"
                    checked={onboardingData.usesTitleCompany}
                    onCheckedChange={(checked) => {
                      handleInputChange('usesTitleCompany', !!checked);
                    }}
                  />
                  <Label htmlFor="usesTitleCompany" className="font-normal">I use a title company for my transactions</Label>
                </div>
              </div>
            )}
            
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 4: Review & Submit</h3>
                
                <div className="border rounded-md p-4 space-y-3">
                  <div>
                    <h4 className="font-medium">Basic Information</h4>
                    <p className="text-sm text-gray-600">Name: {onboardingData.fullName}</p>
                    <p className="text-sm text-gray-600">Email: {onboardingData.email}</p>
                    <p className="text-sm text-gray-600">Phone: {onboardingData.phone}</p>
                    <p className="text-sm text-gray-600">Business: {onboardingData.businessName || 'Not provided'}</p>
                    <p className="text-sm text-gray-600">Years in RE: {onboardingData.yearsInRealEstate}</p>
                    <p className="text-sm text-gray-600">Business Type: {onboardingData.businessType}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Activity & Preferences</h4>
                    <p className="text-sm text-gray-600">Markets: {onboardingData.targetMarkets.join(', ')}</p>
                    <p className="text-sm text-gray-600">Deal Types: {onboardingData.dealTypes.join(', ')}</p>
                    <p className="text-sm text-gray-600">Max Volume: {onboardingData.maxDealVolume}</p>
                    <p className="text-sm text-gray-600">Buyer List: {onboardingData.hasBuyerList ? 'Yes' : 'No'}</p>
                    <p className="text-sm text-gray-600">Direct to Seller: {onboardingData.isDirectToSeller ? 'Yes' : 'No'}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Trust & Credibility</h4>
                    <p className="text-sm text-gray-600">Purchase Agreements: {onboardingData.purchaseAgreements?.length || 0} files</p>
                    <p className="text-sm text-gray-600">Assignment Contracts: {onboardingData.assignmentContracts?.length || 0} files</p>
                    <p className="text-sm text-gray-600">Website: {onboardingData.websiteUrl || 'Not provided'}</p>
                    <p className="text-sm text-gray-600">Proof of Funds: {onboardingData.hasProofOfFunds ? 'Yes' : 'No'}</p>
                    <p className="text-sm text-gray-600">Uses Title Company: {onboardingData.usesTitleCompany ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="certifyAccuracy"
                    required
                  />
                  <Label htmlFor="certifyAccuracy" className="font-normal">
                    I certify that the information provided is accurate and complete
                  </Label>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                  <p>
                    By submitting this application, you are requesting to become a verified seller on PropertyDeals.
                    Your application will be reviewed by our team, and you will be notified once a decision has been made.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between pt-4 border-t">
            {currentStep > 1 ? (
              <Button 
                onClick={handlePrevStep}
                variant="outline"
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            ) : (
              <Button
                onClick={() => setLocation('/')}
                variant="outline"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            
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
                disabled={isSubmitting}
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
    );
  };
  
  // Main dashboard content (only shown if seller is active)
  const renderDashboardContent = () => {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
          <Button>
            <ListPlus className="h-4 w-4 mr-2" />
            List New Property
          </Button>
        </div>
        
        <Tabs defaultValue="properties" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="properties" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Properties</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
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
                <p className="text-gray-500">You don't have any properties listed yet. Click "List New Property" to get started.</p>
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
                <p className="text-gray-500">No messages yet. They will appear here when you receive inquiries about your properties.</p>
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
                <p className="text-gray-500">Listing analytics will be available once you have active property listings.</p>
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
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Seller Profile</h3>
                    <p className="text-sm text-gray-600 mb-2">Update your seller profile information</p>
                    <Button variant="outline">Edit Profile</Button>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Notification Preferences</h3>
                    <p className="text-sm text-gray-600 mb-2">Configure how you receive updates and inquiries</p>
                    <Button variant="outline">Manage Notifications</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };
  
  return (
    <>
      {renderStatusModal()}
      {sellerStatus === 'active' ? (
        renderDashboardContent()
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Seller Dashboard</h1>
            <p className="text-gray-600 mt-2">Complete your seller application to access the dashboard</p>
          </div>
          
          {!isModalOpen && sellerStatus === 'none' && (
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#135341] hover:bg-[#09261E]"
                  >
                    Start Seller Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {!isModalOpen && sellerStatus === 'pending' && (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Application Under Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-4">
                  <Info className="h-12 w-12 text-blue-500 mb-4" />
                  <p className="text-center max-w-md mb-4">
                    Your seller account application is currently under review. We strive to process applications within 1-2 business days.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </>
  );
}