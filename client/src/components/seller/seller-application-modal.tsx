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
import { ChevronRight, Loader2 } from 'lucide-react';

interface SellerApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SellerApplicationModal({ isOpen, onClose }: SellerApplicationModalProps) {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
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
    // Here we would save the form data with isDraft = true
    console.log('Saving application as draft');
    onClose();
  };
  
  // Handle submit application
  const handleSubmitApplication = () => {
    // Here we would save the form data with isDraft = false and status = 'pending'
    console.log('Submitting application');
    onClose();
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
              {/* Form fields will go here */}
              <div className="p-4 border border-gray-200 rounded-md bg-gray-50 h-40 flex items-center justify-center">
                <p className="text-sm text-gray-500">
                  Basic information form fields
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-md bg-gray-50 h-40 flex items-center justify-center">
                <p className="text-sm text-gray-500">
                  Additional fields
                </p>
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
            
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50 h-40 flex items-center justify-center">
              <p className="text-sm text-gray-500">
                Activity & preferences form fields
              </p>
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
            
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50 h-40 flex items-center justify-center">
              <p className="text-sm text-gray-500">
                Trust & credibility form fields
              </p>
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
              <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Basic Information</h4>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => setCurrentStep(1)}>
                    Edit
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  Summary of basic information
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Activity & Preferences</h4>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => setCurrentStep(2)}>
                    Edit
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  Summary of activity & preferences
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Trust & Credibility</h4>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => setCurrentStep(3)}>
                    Edit
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  Summary of trust & credibility information
                </div>
              </div>
              
              <div className="flex items-start gap-2 mt-4">
                <input type="checkbox" id="certify" className="mt-1" />
                <label htmlFor="certify" className="text-sm">
                  I certify that the information provided is accurate and complete
                </label>
              </div>
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <DialogFooter className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
          <div>
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
            ) : (
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              Save & Finish Later
            </Button>
            
            {currentStep < 4 ? (
              <Button onClick={handleNextStep} className="bg-[#135341]">
                Continue <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmitApplication} className="bg-[#135341]">
                Submit Application
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