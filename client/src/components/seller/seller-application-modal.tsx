import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { createUser } from '@/lib/supabase';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ChevronRight, 
  Loader2, 
  Info, 
  Upload,
  X,
  FileIcon,
  CheckIcon,
  AlertCircle,
  CheckCircle,
  XCircle,
  Globe,
  Facebook,
  Instagram,
  Linkedin
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SellerApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SellerApplicationModal({ isOpen, onClose }: SellerApplicationModalProps) {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic Information (Step 1)
    fullName: user?.fullName || '',
    username: user?.username || '',
    email: user?.email || '',
    phoneNumber: '',
    realEstateSince: '',
    businessTypes: [] as string[],
    
    // Activity & Preferences (Step 2)
    targetMarkets: [] as string[], // Empty by default as requested
    dealTypes: [] as string[],
    maxDealVolume: '',
    hasBuyerList: false,
    isDirectToSeller: false,
    
    // Trust & Credibility (Step 3)
    purchaseAgreements: [] as File[],
    assignmentContracts: [] as File[],
    notes: '',
    websiteUrl: '',
    facebookProfile: '',
    instagramProfile: '',
    linkedinProfile: '',
    titleCompanies: [] as string[],
    hasProofOfFunds: false,
    usesTitleCompany: false
  });
  
  // Custom input states
  const [newBusinessType, setNewBusinessType] = useState('');
  const [newTargetMarket, setNewTargetMarket] = useState('');
  const [newTitleCompany, setNewTitleCompany] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  
  // Error state
  const [errors, setErrors] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    realEstateSince: '',
    businessTypes: '',
    targetMarkets: '',
    dealTypes: '',
    maxDealVolume: '',
    purchaseAgreements: '',
    assignmentContracts: '',
    titleCompanies: '',
    terms: ''
  });
  
  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setAcceptedTerms(false);
      
      // Prepopulate with user data if available
      if (user) {
        setFormData(prev => ({
          ...prev,
          fullName: user.fullName || '',
          username: user.username || '',
          email: user.email || ''
        }));
      }
    }
  }, [isOpen, user]);
  
  // Get business type description for tooltips
  const getBusinessTypeDescription = (type: string): string => {
    const descriptions: Record<string, string> = {
      'Wholesaler': 'Finds deals and assigns contracts to other investors without taking ownership',
      'Flipper': 'Buys properties, renovates them, and sells for profit',
      'Buy & Hold': 'Purchases properties for long-term rental income and appreciation',
      'Agent': 'Licensed real estate professional representing buyers or sellers',
      'Contractor': 'Renovates and repairs properties for investors',
      'Lender': 'Provides financing for real estate transactions',
      'Property Manager': 'Manages rental properties for property owners'
    };
    
    return descriptions[type] || `${type} real estate professional`;
  };
  
  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if any
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  
  // Check username availability
  useEffect(() => {
    // Skip empty usernames or if currently checking
    if (!formData.username.trim() || checkingUsername) return;
    
    // Debounce to avoid too many API calls
    const timeoutId = setTimeout(async () => {
      if (formData.username.trim().length < 3) {
        setUsernameAvailable(null);
        return;
      }
      
      setCheckingUsername(true);
      
      try {
        // Here you would check against the actual API
        // Simulating API call for now
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Determine if username is available (mock logic for demo)
        const isAvailable = !['admin', 'test', 'user'].includes(formData.username.toLowerCase());
        setUsernameAvailable(isAvailable);
      } catch (error) {
        console.error('Error checking username availability:', error);
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [formData.username]);
  
  // Validate current step
  const validateStep = (step: number): boolean => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (step === 1) {
      // Validate Step 1: Basic Information
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
        isValid = false;
      }
      
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
        isValid = false;
      } else if (formData.username.trim().length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
        isValid = false;
      } else if (usernameAvailable === false) {
        newErrors.username = 'Username is already taken';
        isValid = false;
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
        isValid = false;
      }
      
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
        isValid = false;
      }
      
      if (!formData.realEstateSince) {
        newErrors.realEstateSince = 'Please indicate when you started in real estate';
        isValid = false;
      } else {
        const year = parseInt(formData.realEstateSince);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < (currentYear - 100) || year > currentYear) {
          newErrors.realEstateSince = `Please enter a valid year (${currentYear-100}-${currentYear})`;
          isValid = false;
        }
      }
      
      if (formData.businessTypes.length === 0) {
        newErrors.businessTypes = 'Please select at least one business type';
        isValid = false;
      }
    } 
    else if (step === 2) {
      // Validate Step 2: Activity & Preferences
      if (formData.targetMarkets.length === 0) {
        newErrors.targetMarkets = 'At least one target market is required';
        isValid = false;
      }
      
      if (formData.dealTypes.length === 0) {
        newErrors.dealTypes = 'At least one deal type is required';
        isValid = false;
      }
      
      if (!formData.maxDealVolume) {
        newErrors.maxDealVolume = 'Please select your monthly deal volume';
        isValid = false;
      }
    }
    else if (step === 3) {
      // Validate Step 3: Trust & Credibility
      if (formData.purchaseAgreements.length === 0) {
        newErrors.purchaseAgreements = 'Please upload at least one purchase agreement';
        isValid = false;
      }
      
      if (formData.assignmentContracts.length === 0) {
        newErrors.assignmentContracts = 'Please upload at least one assignment contract';
        isValid = false;
      }
      
      if (formData.titleCompanies.length === 0) {
        newErrors.titleCompanies = 'Please add at least one title company or enter "None"';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep < 4) {
      // Validate current step before proceeding
      if (validateStep(currentStep)) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Handle save and finish later
  const handleSaveDraft = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      // Here we would save the form data with isDraft = true
      console.log('Saving application as draft', formData);
      setIsSaving(false);
      onClose();
    }, 1000);
  };
  
  // Handle submit application
  const handleSubmitApplication = async () => {
    if (!acceptedTerms) {
      setErrors(prev => ({
        ...prev,
        terms: 'You must certify that the information is accurate'
      }));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare seller application data
      const sellerApplicationData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        realEstateSince: formData.realEstateSince,
        businessTypes: formData.businessTypes,
        isDraft: false,
        status: 'pending',
        // Include other necessary fields from steps 2 and 3
        targetMarkets: formData.targetMarkets,
        dealTypes: formData.dealTypes,
        maxDealVolume: formData.maxDealVolume,
        hasBuyerList: formData.hasBuyerList,
        isDirectToSeller: formData.isDirectToSeller,
        notes: formData.notes,
        titleCompanies: formData.titleCompanies,
        websiteUrl: formData.websiteUrl,
        facebookProfile: formData.facebookProfile,
        instagramProfile: formData.instagramProfile,
        linkedinProfile: formData.linkedinProfile
        // Would include user_id from supabase auth
      };
      
      // In a real implementation, we would upload the files and save their URLs
      if (formData.purchaseAgreements.length > 0) {
        console.log(`Would upload ${formData.purchaseAgreements.length} purchase agreements`);
        formData.purchaseAgreements.forEach((file, index) => {
          console.log(`Purchase agreement ${index + 1}:`, file.name, `(${(file.size / 1024).toFixed(2)} KB)`);
        });
      }
      
      if (formData.assignmentContracts.length > 0) {
        console.log(`Would upload ${formData.assignmentContracts.length} assignment contracts`);
        formData.assignmentContracts.forEach((file, index) => {
          console.log(`Assignment contract ${index + 1}:`, file.name, `(${(file.size / 1024).toFixed(2)} KB)`);
        });
      }
      
      // Simulate API call to save the seller application
      console.log('Submitting seller application', sellerApplicationData);
      
      // Display success message and close modal
      setIsSubmitting(false);
      onClose();
      
      // Redirect to seller dashboard
      setTimeout(() => {
        setLocation('/sellerdash');
      }, 500);
      
    } catch (error) {
      console.error('Error submitting application:', error);
      setIsSubmitting(false);
      // Would set appropriate error message here
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Seller Application</DialogTitle>
          <DialogDescription>
            Complete this application to become a verified PropertyDeals seller.
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress indicator */}
        <div className="pt-1 pb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Step {currentStep} of 4</span>
            <span>{Math.round((currentStep / 4) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>
        
        {/* Step labels */}
        <div className="grid grid-cols-4 mb-6 text-xs text-center">
          <div className={`transition-colors ${currentStep >= 1 ? "text-[#135341] font-medium" : "text-gray-500"}`}>
            Basic Info
          </div>
          <div className={`transition-colors ${currentStep >= 2 ? "text-[#135341] font-medium" : "text-gray-500"}`}>
            Activity
          </div>
          <div className={`transition-colors ${currentStep >= 3 ? "text-[#135341] font-medium" : "text-gray-500"}`}>
            Trust
          </div>
          <div className={`transition-colors ${currentStep >= 4 ? "text-[#135341] font-medium" : "text-gray-500"}`}>
            Review
          </div>
        </div>
        
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Basic Information</h3>
              <p className="text-sm text-gray-600 mt-1">
                Tell us about yourself and your business
              </p>
            </div>
            
            <div className="space-y-4">
              {/* Row 1: Full Name and Username */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                  <Input 
                    id="fullName" 
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="John Smith"
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.fullName}
                    </p>
                  )}
                </div>
                
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input 
                      id="username" 
                      value={formData.username}
                      onChange={(e) => handleChange('username', e.target.value)}
                      placeholder="johnsmith"
                      className={`${errors.username ? "border-red-500" : ""} ${
                        usernameAvailable === true ? "border-green-500 pr-10" : 
                        usernameAvailable === false ? "border-red-500 pr-10" : ""
                      }`}
                    />
                    {checkingUsername && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                    {usernameAvailable === true && !checkingUsername && formData.username.trim() && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    )}
                    {usernameAvailable === false && !checkingUsername && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <XCircle className="h-4 w-4 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.username && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.username}
                    </p>
                  )}
                  {usernameAvailable === false && !errors.username && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Username already taken
                    </p>
                  )}
                  {usernameAvailable === true && !errors.username && formData.username.trim().length >= 3 && (
                    <p className="text-xs text-green-500 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Username available
                    </p>
                  )}
                </div>
              </div>
              
              {/* Row 2: Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="email@example.com"
                    className={errors.email ? "border-red-500" : ""}
                    disabled={!!user?.email}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
                
                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number <span className="text-red-500">*</span></Label>
                  <Input 
                    id="phoneNumber" 
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    placeholder="(123) 456-7890"
                    className={errors.phoneNumber ? "border-red-500" : ""}
                  />

                  {errors.phoneNumber && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Row 3: Year and Business Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* In Real Estate Since */}
                <div className="space-y-2">
                  <Label htmlFor="realEstateSince">In Real Estate Since <span className="text-red-500">*</span></Label>
                  <Input 
                    id="realEstateSince" 
                    value={formData.realEstateSince}
                    onChange={(e) => handleChange('realEstateSince', e.target.value)}
                    placeholder={new Date().getFullYear().toString()}
                    className={errors.realEstateSince ? "border-red-500" : ""}
                    type="number"
                    min={new Date().getFullYear() - 50}
                    max={new Date().getFullYear()}
                  />
                  {errors.realEstateSince && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.realEstateSince}
                    </p>
                  )}
                </div>
                
                {/* Business Types */}
                <div className="space-y-2">
                  <Label htmlFor="businessTypes">Business Type <span className="text-red-500">*</span></Label>
                  
                  {/* Display selected business types as chips */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {formData.businessTypes.map((type) => (
                      <div 
                        key={type} 
                        className="bg-[#135341] text-white text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        <span>{type}</span>
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer hover:text-gray-200" 
                          onClick={() => handleChange(
                            'businessTypes', 
                            formData.businessTypes.filter(t => t !== type)
                          )}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input 
                      value={newBusinessType}
                      onChange={(e) => setNewBusinessType(e.target.value)}
                      placeholder="Add business type..."
                      className={errors.businessTypes ? "border-red-500" : ""}
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      className="hover:bg-gray-100"
                      onClick={() => {
                        if (newBusinessType.trim()) {
                          if (!formData.businessTypes.includes(newBusinessType.trim())) {
                            handleChange('businessTypes', [...formData.businessTypes, newBusinessType.trim()]);
                          }
                          setNewBusinessType('');
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {/* Quick select common business types */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {['Wholesaler', 'Agent', 'Flipper', 'Developer', 'Investor'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        className="text-xs px-2 py-1 border border-gray-200 rounded-full hover:bg-gray-50"
                        onClick={() => {
                          if (!formData.businessTypes.includes(type)) {
                            handleChange('businessTypes', [...formData.businessTypes, type]);
                          }
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  
                  {errors.businessTypes && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.businessTypes}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Note: Password fields have been removed as requested */}
            </div>
          </div>
        )}
        
        {/* Step 2: Seller Activity & Preferences */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Seller Activity & Preferences</h3>
              <p className="text-sm text-gray-600 mt-1">
                Tell us about your markets and deal preferences
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Target Markets */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="targetMarkets">Target Markets <span className="text-red-500">*</span></Label>
                  <div className="text-xs text-gray-500">Select all that apply</div>
                </div>
                
                {errors.targetMarkets && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.targetMarkets}
                  </p>
                )}
                
                {/* Selected market chips */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.targetMarkets.map((market) => (
                    <Badge
                      key={market}
                      variant="secondary"
                      className="px-3 py-1 bg-[#135341] text-white hover:bg-[#0d3c2e] gap-1"
                    >
                      {market}
                      <X 
                        className="h-3 w-3 cursor-pointer ml-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChange('targetMarkets', formData.targetMarkets.filter(m => m !== market));
                        }}
                      />
                    </Badge>
                  ))}
                  {formData.targetMarkets.length === 0 && (
                    <div className="text-sm text-gray-500">No markets selected yet</div>
                  )}
                </div>
                
                {/* Default target markets */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Default markets:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['Milwaukee WI', 'Madison WI', 'Green Bay WI'].map((market) => (
                      <div 
                        key={market}
                        onClick={() => {
                          if (!formData.targetMarkets.includes(market)) {
                            handleChange('targetMarkets', [...formData.targetMarkets, market]);
                          }
                        }}
                        className={cn(
                          "flex items-center justify-center px-3 py-2 rounded-md text-sm border cursor-pointer transition-colors",
                          formData.targetMarkets.includes(market) 
                            ? "bg-[#135341] text-white border-[#135341]" 
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        {market}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Market search input */}
                <div className="flex gap-2 items-center">
                  <Input
                    value={newTargetMarket}
                    onChange={(e) => setNewTargetMarket(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTargetMarket.trim()) {
                        e.preventDefault();
                        if (!formData.targetMarkets.includes(newTargetMarket.trim())) {
                          handleChange('targetMarkets', [...formData.targetMarkets, newTargetMarket.trim()]);
                        }
                        setNewTargetMarket('');
                      }
                    }}
                    placeholder="Add another market..."
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      if (newTargetMarket.trim() && !formData.targetMarkets.includes(newTargetMarket.trim())) {
                        handleChange('targetMarkets', [...formData.targetMarkets, newTargetMarket.trim()]);
                        setNewTargetMarket('');
                      }
                    }}
                    disabled={!newTargetMarket.trim() || formData.targetMarkets.includes(newTargetMarket.trim())}
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              {/* Deal Types */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="dealTypes">Deal Types <span className="text-red-500">*</span></Label>
                  <div className="text-xs text-gray-500">Select all that apply</div>
                </div>
                
                {errors.dealTypes && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.dealTypes}
                  </p>
                )}
                
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'assignments', label: 'Assignments', tooltip: 'Transfer of purchase contract rights to another buyer' },
                    { id: 'subto', label: 'Sub-to', tooltip: 'Purchase subject to existing financing' },
                    { id: 'flip', label: 'Flip', tooltip: 'Buy, renovate, and sell for profit' },
                    { id: 'buyhold', label: 'Buy & Hold', tooltip: 'Long-term rental property investment' },
                    { id: 'new', label: 'New Construction', tooltip: 'Building new properties' },
                    { id: 'other', label: 'Other', tooltip: 'Other deal types not listed' }
                  ].map((dealType) => (
                    <div 
                      key={dealType.id}
                      className="relative"
                    >
                      <div
                        onClick={() => {
                          const isSelected = formData.dealTypes.includes(dealType.id);
                          const newTypes = isSelected 
                            ? formData.dealTypes.filter(t => t !== dealType.id)
                            : [...formData.dealTypes, dealType.id];
                          handleChange('dealTypes', newTypes);
                        }}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-md text-sm border cursor-pointer transition-colors",
                          formData.dealTypes.includes(dealType.id) 
                            ? "bg-[#135341] text-white border-[#135341]" 
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        <span>{dealType.label}</span>
                        <TooltipProvider delayDuration={150}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-[200px] text-xs">
                              {dealType.tooltip}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Max Deal Volume */}
              <div className="space-y-3">
                <Label htmlFor="maxDealVolume">Max Deal Volume (per month) <span className="text-red-500">*</span></Label>
                {errors.maxDealVolume && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.maxDealVolume}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {['1-2', '3-5', '6-10', '10+'].map((volume) => (
                    <button
                      key={volume}
                      type="button"
                      onClick={() => handleChange('maxDealVolume', volume)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm transition-colors focus:outline-none",
                        formData.maxDealVolume === volume 
                          ? "bg-[#135341] text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {volume}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Additional Checkboxes */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasBuyerList" 
                    checked={formData.hasBuyerList}
                    onCheckedChange={(checked) => handleChange('hasBuyerList', Boolean(checked))}
                  />
                  <Label htmlFor="hasBuyerList" className="text-sm font-normal">
                    I have my own buyer list
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isDirectToSeller" 
                    checked={formData.isDirectToSeller}
                    onCheckedChange={(checked) => handleChange('isDirectToSeller', Boolean(checked))}
                  />
                  <Label htmlFor="isDirectToSeller" className="text-sm font-normal">
                    I work directly with property owners/sellers
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Trust & Credibility */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Trust & Credibility</h3>
              <p className="text-sm text-gray-600 mt-1">
                Upload documents and provide additional verification information
              </p>
            </div>
            
            <div className="space-y-5">
              {/* Upload Purchase Agreements */}
              <div className="space-y-3">
                <Label htmlFor="purchaseAgreements">Upload Purchase Agreements <span className="text-red-500">*</span></Label>
                <p className="text-xs text-gray-600 mb-2">(Please upload the purchase agreement for any recently closed properties.)</p>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
                  {formData.purchaseAgreements.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Uploaded documents ({formData.purchaseAgreements.length})</h4>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            document.getElementById('purchaseAgreementsInput')?.click();
                          }}
                          className="h-7 px-2 text-xs"
                        >
                          Add More
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Array.from(formData.purchaseAgreements).map((file: any, index: number) => (
                          <div key={index} className="flex items-start p-2 border rounded bg-gray-50 gap-2">
                            <FileIcon className="h-10 w-10 flex-shrink-0 text-blue-600" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{file.name}</div>
                              <div className="text-xs text-gray-500">
                                {Math.round(file.size / 1024)} KB
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                const newFiles = Array.from(formData.purchaseAgreements);
                                newFiles.splice(index, 1);
                                handleChange('purchaseAgreements', newFiles);
                              }}
                              className="h-6 w-6 p-0 rounded-full"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 text-center"
                      onClick={() => document.getElementById('purchaseAgreementsInput')?.click()}
                    >
                      <Upload className="h-10 w-10 text-gray-400" />
                      <div className="text-sm font-medium">Click to upload or drag & drop</div>
                      <div className="text-xs text-gray-500">PDF, DOC, DOCX (Max. 10MB each)</div>
                      
                      <input 
                        id="purchaseAgreementsInput"
                        type="file" 
                        multiple
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const newFiles = [...Array.from(formData.purchaseAgreements)];
                            Array.from(e.target.files).forEach(file => {
                              newFiles.push(file);
                            });
                            handleChange('purchaseAgreements', newFiles);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Upload Assignment Contracts */}
              <div className="space-y-3">
                <Label htmlFor="assignmentContracts">Upload Assignment Contracts <span className="text-red-500">*</span></Label>
                {errors.assignmentContracts && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.assignmentContracts}
                  </p>
                )}
                <div className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center",
                  errors.assignmentContracts ? "border-red-300" : "border-gray-200"
                )}>
                  {formData.assignmentContracts ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileIcon className="h-10 w-10 text-blue-600" />
                      <div className="text-sm font-medium">{formData.assignmentContracts.name}</div>
                      <div className="text-xs text-gray-500">
                        {Math.round(formData.assignmentContracts.size / 1024)} KB
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleChange('assignmentContracts', null)}
                        className="mt-2 text-xs h-7 px-2"
                      >
                        <X className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80"
                      onClick={() => document.getElementById('assignmentContractsInput')?.click()}
                    >
                      <Upload className="h-10 w-10 text-gray-400" />
                      <div className="text-sm font-medium">Click to upload or drag & drop</div>
                      <div className="text-xs text-gray-500">PDF (Max. 5MB)</div>
                      
                      <input 
                        id="assignmentContractsInput"
                        type="file" 
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleChange('assignmentContracts', e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes <span className="text-gray-500 text-xs">(Optional)</span></Label>
                <Textarea 
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Add any additional context about your business or deals..."
                  className="min-h-[100px]"
                />
              </div>
              
              {/* Title Companies */}
              <div className="space-y-3">
                <Label htmlFor="titleCompanies">Title Companies You Work With <span className="text-red-500">*</span></Label>
                <p className="text-xs text-gray-600 mb-2">(Add "None" if you don't work with any title companies)</p>
                
                {/* Existing title companies */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.titleCompanies.map((company, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 bg-gray-100 text-gray-800 hover:bg-gray-200 gap-1"
                    >
                      {company}
                      <X 
                        className="h-3 w-3 cursor-pointer ml-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newCompanies = [...formData.titleCompanies];
                          newCompanies.splice(index, 1);
                          handleChange('titleCompanies', newCompanies);
                        }}
                      />
                    </Badge>
                  ))}
                </div>
                
                {/* Add new title company */}
                <div className="flex gap-2 items-center">
                  <Input
                    value={newTitleCompany}
                    onChange={(e) => setNewTitleCompany(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTitleCompany.trim()) {
                        e.preventDefault();
                        if (!formData.titleCompanies.includes(newTitleCompany.trim())) {
                          handleChange('titleCompanies', [...formData.titleCompanies, newTitleCompany.trim()]);
                        }
                        setNewTitleCompany('');
                      }
                    }}
                    placeholder="Add title company you work with..."
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      if (newTitleCompany.trim() && !formData.titleCompanies.includes(newTitleCompany.trim())) {
                        handleChange('titleCompanies', [...formData.titleCompanies, newTitleCompany.trim()]);
                        setNewTitleCompany('');
                      }
                    }}
                    disabled={!newTitleCompany.trim() || formData.titleCompanies.includes(newTitleCompany.trim())}
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              {/* Social Media & Web Presence */}
              <div className="space-y-3">
                <Label className="text-base">Social Media & Web Presence <span className="text-gray-500 text-xs">(Optional)</span></Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Website URL */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="websiteUrl" className="text-sm font-normal">Website</Label>
                    </div>
                    <Input 
                      id="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={(e) => handleChange('websiteUrl', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  
                  {/* Facebook Profile */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Facebook className="h-4 w-4 text-blue-600" />
                      <Label htmlFor="facebookProfile" className="text-sm font-normal">Facebook</Label>
                    </div>
                    <Input 
                      id="facebookProfile"
                      value={formData.facebookProfile}
                      onChange={(e) => handleChange('facebookProfile', e.target.value)}
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                  
                  {/* Instagram Profile */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-pink-600" />
                      <Label htmlFor="instagramProfile" className="text-sm font-normal">Instagram</Label>
                    </div>
                    <Input 
                      id="instagramProfile"
                      value={formData.instagramProfile}
                      onChange={(e) => handleChange('instagramProfile', e.target.value)}
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  
                  {/* LinkedIn Profile */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-blue-700" />
                      <Label htmlFor="linkedinProfile" className="text-sm font-normal">LinkedIn</Label>
                    </div>
                    <Input 
                      id="linkedinProfile"
                      value={formData.linkedinProfile}
                      onChange={(e) => handleChange('linkedinProfile', e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>
              
              {/* Additional Checkboxes */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasProofOfFunds" 
                    checked={formData.hasProofOfFunds}
                    onCheckedChange={(checked) => handleChange('hasProofOfFunds', Boolean(checked))}
                  />
                  <Label htmlFor="hasProofOfFunds" className="text-sm font-normal">
                    I have proof of funds access
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="usesTitleCompany" 
                    checked={formData.usesTitleCompany}
                    onCheckedChange={(checked) => handleChange('usesTitleCompany', Boolean(checked))}
                  />
                  <Label htmlFor="usesTitleCompany" className="text-sm font-normal">
                    I use a title company for my transactions
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Review & Submit</h3>
              <p className="text-sm text-gray-600 mt-1">
                Review your information before submitting your application
              </p>
            </div>
            
            <div className="space-y-4">
              {/* Basic Information Summary */}
              <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Basic Information</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-xs hover:bg-gray-200" 
                    onClick={() => setCurrentStep(1)}
                  >
                    Edit
                  </Button>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-gray-500">Full Name:</div>
                    <div>{formData.fullName}</div>
                    
                    <div className="text-gray-500">Username:</div>
                    <div>{formData.username}</div>
                    
                    <div className="text-gray-500">Email:</div>
                    <div>{formData.email}</div>
                    
                    <div className="text-gray-500">Phone:</div>
                    <div>{formData.phoneNumber}</div>
                    
                    <div className="text-gray-500">Started in Real Estate:</div>
                    <div>{formData.realEstateSince}</div>
                    
                    <div className="text-gray-500">Business Types:</div>
                    <div>
                      {formData.businessTypes.length > 0 
                        ? formData.businessTypes.join(', ') 
                        : 'Not specified'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Activity & Preferences Summary */}
              <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Activity & Preferences</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-xs hover:bg-gray-200" 
                    onClick={() => setCurrentStep(2)}
                  >
                    Edit
                  </Button>
                </div>
                <div className="text-sm text-gray-600 space-y-3">
                  <div>
                    <div className="text-gray-500 mb-1">Target Markets:</div>
                    <div className="flex flex-wrap gap-1">
                      {formData.targetMarkets.length > 0 ? (
                        formData.targetMarkets.map(market => (
                          <span key={market} className="bg-gray-100 text-xs px-2 py-1 rounded">
                            {market}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">None selected</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-gray-500 mb-1">Deal Types:</div>
                    <div className="flex flex-wrap gap-1">
                      {formData.dealTypes.length > 0 ? (
                        formData.dealTypes.map(type => (
                          <span key={type} className="bg-gray-100 text-xs px-2 py-1 rounded">
                            {type}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">None selected</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-gray-500">Max Deal Volume:</div>
                    <div>{formData.maxDealVolume} per month</div>
                    
                    <div className="text-gray-500">Has Buyer List:</div>
                    <div>{formData.hasBuyerList ? 'Yes' : 'No'}</div>
                    
                    <div className="text-gray-500">Direct to Seller:</div>
                    <div>{formData.isDirectToSeller ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>
              
              {/* Trust & Credibility Summary */}
              <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Trust & Credibility</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-xs hover:bg-gray-200" 
                    onClick={() => setCurrentStep(3)}
                  >
                    Edit
                  </Button>
                </div>
                <div className="text-sm text-gray-600 space-y-3">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-gray-500">Purchase Agreements:</div>
                    <div>{formData.purchaseAgreements ? 'Uploaded' : 'Not provided'}</div>
                    
                    <div className="text-gray-500">Assignment Contracts:</div>
                    <div>{formData.assignmentContracts ? 'Uploaded' : 'Not provided'}</div>
                    
                    <div className="text-gray-500">Website:</div>
                    <div>{formData.websiteUrl || 'Not provided'}</div>
                    
                    <div className="text-gray-500">Facebook:</div>
                    <div>{formData.facebookProfile || 'Not provided'}</div>
                    
                    <div className="text-gray-500">Proof of Funds:</div>
                    <div>{formData.hasProofOfFunds ? 'Yes' : 'No'}</div>
                    
                    <div className="text-gray-500">Uses Title Company:</div>
                    <div>{formData.usesTitleCompany ? 'Yes' : 'No'}</div>
                  </div>
                  
                  {formData.notes && (
                    <div>
                      <div className="text-gray-500 mb-1">Notes:</div>
                      <div className="bg-white p-2 rounded border border-gray-200 text-xs">
                        {formData.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Certification */}
              <div className="flex items-start gap-2 mt-4">
                <Checkbox 
                  id="certify" 
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(Boolean(checked))}
                />
                <Label htmlFor="certify" className="text-sm font-normal">
                  I certify that the information provided is accurate and complete
                </Label>
              </div>
              {errors.terms && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.terms}
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <DialogFooter className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
          <div>
            {currentStep > 1 ? (
              <Button 
                variant="outline" 
                onClick={handlePrevStep}
                className="hover:bg-gray-100"
              >
                Back
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={onClose}
                className="hover:bg-gray-100"
              >
                Cancel
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              className="hover:bg-gray-100"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save & Finish Later"
              )}
            </Button>
            
            {currentStep < 4 ? (
              <Button 
                onClick={handleNextStep} 
                className="bg-[#135341] hover:bg-[#09261E]"
              >
                Continue <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmitApplication} 
                className="bg-[#135341] hover:bg-[#09261E]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
        
        {/* Small text prompt for active sellers */}
        <p className="text-xs text-gray-500 mt-6 text-center">
          Already a seller? <a href={`/sellerdash/${user?.id}`} className="text-green-700 font-medium underline">Log in to your dashboard here</a>
        </p>
      </DialogContent>
    </Dialog>
  );
}