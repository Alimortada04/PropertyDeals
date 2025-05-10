import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

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
  AlertCircle
} from 'lucide-react';
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
    businessName: '',
    yearsInRealEstate: '',
    businessType: '',
    
    // Activity & Preferences (Step 2)
    targetMarkets: [] as string[],
    dealTypes: [] as string[],
    maxDealVolume: '',
    hasBuyerList: false,
    isDirectToSeller: false,
    
    // Trust & Credibility (Step 3)
    purchaseAgreements: null as File | null,
    assignmentContracts: null as File | null,
    notes: '',
    websiteUrl: '',
    facebookProfile: '',
    hasProofOfFunds: false,
    usesTitleCompany: false
  });
  
  // Error state
  const [errors, setErrors] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    businessType: '',
    yearsInRealEstate: '',
    targetMarkets: '',
    dealTypes: '',
    maxDealVolume: '',
    assignmentContracts: '',
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
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
        isValid = false;
      }
      
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
        isValid = false;
      }
      
      if (!formData.businessType) {
        newErrors.businessType = 'Business type is required';
        isValid = false;
      }
      
      if (!formData.yearsInRealEstate) {
        newErrors.yearsInRealEstate = 'Experience level is required';
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
      if (!formData.assignmentContracts) {
        newErrors.assignmentContracts = 'Assignment contract is required';
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
  const handleSubmitApplication = () => {
    if (!acceptedTerms) {
      setErrors(prev => ({
        ...prev,
        terms: 'You must certify that the information is accurate'
      }));
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Here we would save the form data with isDraft = false and status = 'pending'
      console.log('Submitting application', formData);
      setIsSubmitting(false);
      onClose();
    }, 1500);
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left column */}
              <div className="space-y-4">
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
                  <Input 
                    id="username" 
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    placeholder="johnsmith"
                    className={errors.username ? "border-red-500" : ""}
                  />
                  {errors.username && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.username}
                    </p>
                  )}
                </div>
                
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
                  <p className="text-xs text-gray-500">Format: (123) 456-7890</p>
                  {errors.phoneNumber && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Right column */}
              <div className="space-y-4">
                {/* Business Name */}
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name <span className="text-gray-500 text-xs">(Optional)</span></Label>
                  <Input 
                    id="businessName" 
                    value={formData.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    placeholder="ABC Properties LLC"
                  />
                </div>
                
                {/* Years in Real Estate */}
                <div className="space-y-2">
                  <Label htmlFor="yearsInRealEstate">Years in Real Estate <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.yearsInRealEstate}
                    onValueChange={(value) => handleChange('yearsInRealEstate', value)}
                  >
                    <SelectTrigger 
                      id="yearsInRealEstate"
                      className={errors.yearsInRealEstate ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="2-5">2-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.yearsInRealEstate && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.yearsInRealEstate}
                    </p>
                  )}
                </div>
                
                {/* Business Type */}
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => handleChange('businessType', value)}
                  >
                    <SelectTrigger 
                      id="businessType"
                      className={errors.businessType ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wholesaler">Wholesaler</SelectItem>
                      <SelectItem value="agent">Real Estate Agent</SelectItem>
                      <SelectItem value="flipper">Flipper</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.businessType && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.businessType}
                    </p>
                  )}
                </div>
              </div>
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
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Florida', 'Texas', 'California', 'New York', 'Georgia', 'North Carolina'].map((market) => (
                    <div 
                      key={market}
                      onClick={() => {
                        const isSelected = formData.targetMarkets.includes(market);
                        const newMarkets = isSelected 
                          ? formData.targetMarkets.filter(m => m !== market)
                          : [...formData.targetMarkets, market];
                        handleChange('targetMarkets', newMarkets);
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
                  <div className="col-span-2 sm:col-span-3 mt-1">
                    <Input 
                      placeholder="Add other markets..."
                      className="text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          e.preventDefault();
                          const newMarket = e.currentTarget.value.trim();
                          if (!formData.targetMarkets.includes(newMarket)) {
                            handleChange('targetMarkets', [...formData.targetMarkets, newMarket]);
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                    />
                  </div>
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
                        <span title={dealType.tooltip}>
                          <Info 
                            className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" 
                          />
                        </span>
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
                <Label htmlFor="purchaseAgreements">Upload Purchase Agreements <span className="text-gray-500 text-xs">(Optional, but recommended)</span></Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  {formData.purchaseAgreements ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileIcon className="h-10 w-10 text-blue-600" />
                      <div className="text-sm font-medium">{formData.purchaseAgreements.name}</div>
                      <div className="text-xs text-gray-500">
                        {Math.round(formData.purchaseAgreements.size / 1024)} KB
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleChange('purchaseAgreements', null)}
                        className="mt-2 text-xs h-7 px-2"
                      >
                        <X className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80"
                      onClick={() => document.getElementById('purchaseAgreementsInput')?.click()}
                    >
                      <Upload className="h-10 w-10 text-gray-400" />
                      <div className="text-sm font-medium">Click to upload or drag & drop</div>
                      <div className="text-xs text-gray-500">PDF (Max. 5MB)</div>
                      
                      <input 
                        id="purchaseAgreementsInput"
                        type="file" 
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleChange('purchaseAgreements', e.target.files[0]);
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
              
              {/* URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL <span className="text-gray-500 text-xs">(Optional)</span></Label>
                  <Input 
                    id="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={(e) => handleChange('websiteUrl', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="facebookProfile">Facebook Profile <span className="text-gray-500 text-xs">(Optional)</span></Label>
                  <Input 
                    id="facebookProfile"
                    value={formData.facebookProfile}
                    onChange={(e) => handleChange('facebookProfile', e.target.value)}
                    placeholder="https://facebook.com/username"
                  />
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
                    
                    <div className="text-gray-500">Business:</div>
                    <div>{formData.businessName || 'N/A'}</div>
                    
                    <div className="text-gray-500">Experience:</div>
                    <div>{formData.yearsInRealEstate} years</div>
                    
                    <div className="text-gray-500">Business Type:</div>
                    <div>{formData.businessType}</div>
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