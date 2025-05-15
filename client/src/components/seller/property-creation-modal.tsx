import { useState } from "react";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HomeIcon } from "lucide-react";

interface PropertyCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyCreationModal({ isOpen, onClose }: PropertyCreationModalProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b bg-white">
          <DialogTitle className="text-xl font-semibold">Add New Property</DialogTitle>
          <DialogDescription className="text-gray-600">
            List your property on PropertyDeals in just a few steps
          </DialogDescription>
          
          {/* Progress indicator */}
          <div className="flex justify-between text-sm text-gray-500 mt-4 mb-1">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#135341] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Property Information</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Start with the basic details of your property
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title</Label>
                  <Input id="title" placeholder="e.g., Modern Farmhouse, Downtown Loft" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Full property address" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" type="number" placeholder="350000" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="property-type">Property Type</Label>
                    <Select>
                      <SelectTrigger id="property-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single-family">Single Family</SelectItem>
                        <SelectItem value="multi-family">Multi Family</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Property Details</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Add specifics about your property
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input id="bedrooms" type="number" placeholder="3" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input id="bathrooms" type="number" placeholder="2" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="square-feet">Square Feet</Label>
                    <Input id="square-feet" type="number" placeholder="2000" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your property in detail" 
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="features">Key Features</Label>
                  <Textarea 
                    id="features" 
                    placeholder="List key features, one per line (e.g., Renovated Kitchen, Pool, Garage)" 
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Photos & Media</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Upload photos of your property
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <HomeIcon className="h-6 w-6 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Drag and drop photos here, or click to browse
                  </p>
                  <Button variant="outline" className="mt-4">
                    Upload Photos
                  </Button>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {/* Placeholder for uploaded photos */}
                  <div className="aspect-square bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    1
                  </div>
                  <div className="aspect-square bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    2
                  </div>
                  <div className="aspect-square bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    3
                  </div>
                  <div className="aspect-square bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    4
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Deal Terms</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Specify your deal terms and preferences
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deal-type">Deal Type</Label>
                  <Select>
                    <SelectTrigger id="deal-type">
                      <SelectValue placeholder="Select deal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wholesale">Wholesale</SelectItem>
                      <SelectItem value="fix-and-flip">Fix and Flip</SelectItem>
                      <SelectItem value="buy-and-hold">Buy and Hold</SelectItem>
                      <SelectItem value="subject-to">Subject To</SelectItem>
                      <SelectItem value="owner-financing">Owner Financing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline</Label>
                  <Select>
                    <SelectTrigger id="timeline">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate (0-15 days)</SelectItem>
                      <SelectItem value="quick">Quick (15-30 days)</SelectItem>
                      <SelectItem value="standard">Standard (30-60 days)</SelectItem>
                      <SelectItem value="flexible">Flexible (60+ days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="terms">Additional Terms</Label>
                  <Textarea 
                    id="terms" 
                    placeholder="Enter any additional terms or conditions for this property" 
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t bg-white p-6 flex flex-col sm:flex-row justify-between gap-4">
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
          ) : (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          
          {step < totalSteps ? (
            <Button 
              onClick={nextStep}
              className="bg-[#135341] hover:bg-[#09261E] text-white"
            >
              Continue
            </Button>
          ) : (
            <Button 
              onClick={() => {
                // Submit property logic here
                onClose();
              }}
              className="bg-[#135341] hover:bg-[#09261E] text-white"
            >
              Submit Property
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}