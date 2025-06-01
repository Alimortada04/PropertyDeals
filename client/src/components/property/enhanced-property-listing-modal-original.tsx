import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Home,
  Building,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square,
  Calendar,
  Upload,
  Image,
  FileText,
  AlertCircle,
  Check,
  ChevronRight,
  Save,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

// Define schemas for each step
const stepOneSchema = z.object({
  propertyTitle: z.string().min(3, "Title must be at least 3 characters"),
  propertyType: z.string().min(1, "Property type is required"),
  address: z.string().min(5, "Address is required"),
  market: z.string().min(2, "Market is required"),
  arv: z.string().min(1, "ARV is required")
    .refine((val) => !isNaN(Number(val.replace(/[$,]/g, ""))), {
      message: "ARV must be a valid number"
    })
});

const stepTwoSchema = z.object({
  bedrooms: z.string().min(1, "Bedrooms are required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Bedrooms must be a valid number"
    }),
  bathrooms: z.string().min(1, "Bathrooms are required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Bathrooms must be a valid number"
    }),
  squareFootage: z.string().min(1, "Square footage is required")
    .refine((val) => !isNaN(Number(val.replace(/[$,]/g, ""))) && Number(val.replace(/[$,]/g, "")) > 0, {
      message: "Square footage must be a valid number"
    }),
  lotSize: z.string().optional(),
  yearBuilt: z.string().optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 1800 && Number(val) <= new Date().getFullYear()), {
      message: "Please enter a valid year"
    }),
  condition: z.string().min(1, "Condition is required")
});

const stepThreeSchema = z.object({
  images: z.array(z.any()).optional(),
  documents: z.array(z.any()).optional()
});

const stepFourSchema = z.object({
  listingPrice: z.string().min(1, "Listing price is required")
    .refine((val) => !isNaN(Number(val.replace(/[$,]/g, ""))), {
      message: "Listing price must be a valid number"
    }),
  assignmentFee: z.string().optional(),
  jvAvailable: z.boolean().optional(),
  accessType: z.string().min(1, "Access type is required"),
  notes: z.string().optional()
});

// Overall form schema
const formSchema = stepOneSchema.merge(stepTwoSchema).merge(stepThreeSchema).merge(stepFourSchema);

type PropertyListingFormValues = z.infer<typeof formSchema>;

interface EnhancedPropertyListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EnhancedPropertyListingModal({ isOpen, onClose, onSuccess }: EnhancedPropertyListingModalProps) {
  const [step, setStep] = useState(1);
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [filePreview, setFilePreview] = useState<{images: string[], documents: string[]}>({
    images: [], 
    documents: []
  });
  
  // Default form values
  const defaultValues: Partial<PropertyListingFormValues> = {
    propertyType: "",
    condition: "",
    accessType: "",
    jvAvailable: false,
    images: [],
    documents: []
  };
  
  // Setup form with react-hook-form
  const form = useForm<PropertyListingFormValues>({
    resolver: zodResolver(getValidationSchema(step)),
    defaultValues,
    mode: "onChange"
  });
  
  // Watch form values for validation
  const formValues = form.watch();
  
  // Get the appropriate validation schema based on current step
  function getValidationSchema(step: number) {
    switch(step) {
      case 1: return stepOneSchema;
      case 2: return stepTwoSchema;
      case 3: return stepThreeSchema;
      case 4: return stepFourSchema;
      default: return stepOneSchema;
    }
  }
  
  // Check if current step is valid
  const isStepValid = () => {
    const schema = getValidationSchema(step);
    let currentFormValues: any = {};
    
    if (step === 1) {
      currentFormValues = {
        propertyTitle: formValues.propertyTitle,
        propertyType: formValues.propertyType,
        address: formValues.address,
        market: formValues.market,
        arv: formValues.arv
      };
    } else if (step === 2) {
      currentFormValues = {
        bedrooms: formValues.bedrooms,
        bathrooms: formValues.bathrooms,
        squareFootage: formValues.squareFootage,
        lotSize: formValues.lotSize,
        yearBuilt: formValues.yearBuilt,
        condition: formValues.condition
      };
    } else if (step === 3) {
      currentFormValues = {
        images: formValues.images,
        documents: formValues.documents
      };
      // Step 3 can be valid even if no uploads
      return true;
    } else if (step === 4) {
      currentFormValues = {
        listingPrice: formValues.listingPrice,
        assignmentFee: formValues.assignmentFee,
        jvAvailable: formValues.jvAvailable,
        accessType: formValues.accessType,
        notes: formValues.notes
      };
    }
    
    try {
      schema.parse(currentFormValues);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // Next step handler
  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };
  
  // Back step handler
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Handle image uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const imageArray = Array.from(files);
    form.setValue("images", [...(formValues.images || []), ...imageArray]);
    
    // Generate previews
    const newPreviews: string[] = [];
    imageArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          newPreviews.push(reader.result);
          setFilePreview(prev => ({
            ...prev,
            images: [...prev.images, reader.result as string]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };
  
  // Handle document uploads
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const docArray = Array.from(files);
    form.setValue("documents", [...(formValues.documents || []), ...docArray]);
    
    // Add filenames to previews
    const newDocs = docArray.map(file => file.name);
    setFilePreview(prev => ({
      ...prev,
      documents: [...prev.documents, ...newDocs]
    }));
  };
  
  // Remove image preview
  const removeImage = (index: number) => {
    const updatedImages = filePreview.images.filter((_, i) => i !== index);
    setFilePreview(prev => ({...prev, images: updatedImages}));
    
    const currentImages = formValues.images || [];
    const updatedImageFiles = currentImages.filter((_, i) => i !== index);
    form.setValue("images", updatedImageFiles);
  };
  
  // Remove document
  const removeDocument = (index: number) => {
    const updatedDocs = filePreview.documents.filter((_, i) => i !== index);
    setFilePreview(prev => ({...prev, documents: updatedDocs}));
    
    const currentDocs = formValues.documents || [];
    const updatedDocFiles = currentDocs.filter((_, i) => i !== index);
    form.setValue("documents", updatedDocFiles);
  };
  
  // Form submission
  const onSubmit = (data: PropertyListingFormValues) => {
    // In a real application, you would send this data to your API
    console.log("Form submitted with data: ", data);
    
    // Show success toast
    toast({
      title: "Property Listed Successfully!",
      description: saveAsDraft 
        ? "Your listing has been saved as a draft."
        : "Your property is now live and will appear in search results.",
      variant: "default",
    });
    
    // Reset form and close modal
    form.reset();
    setStep(1);
    setFilePreview({images: [], documents: []});
    onSuccess?.();
    onClose();
  };
  
  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        form.reset();
        setStep(1);
        setFilePreview({images: [], documents: []});
        setSaveAsDraft(false);
      }, 300);
    }
  }, [isOpen, form]);
  
  // Render step content
  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="propertyTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    Property Title
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Colonial Revival Single Family" {...field} />
                  </FormControl>
                  <FormDescription>
                    A descriptive title helps buyers identify your property quickly
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    Property Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="single-family">Single Family</SelectItem>
                      <SelectItem value="multi-family">Multi-Family</SelectItem>
                      <SelectItem value="duplex">Duplex</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="land">Vacant Land</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Categorizes your listing for better visibility
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Property Address
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Full street address" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the complete address including zip code
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="market"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Market (City, State)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Milwaukee, WI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="arv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    After Repair Value (ARV)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. 250000" 
                      {...field} 
                      onChange={(e) => {
                        // Format number as currency
                        const value = e.target.value.replace(/[^0-9.]/g, "");
                        field.onChange(value ? `$${parseInt(value).toLocaleString()}` : "");
                      }} 
                    />
                  </FormControl>
                  <FormDescription>
                    Estimated value after repairs are complete
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Bed className="h-4 w-4 text-muted-foreground" />
                      Bedrooms
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Bath className="h-4 w-4 text-muted-foreground" />
                      Bathrooms
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        step="0.5"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="squareFootage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Square className="h-4 w-4 text-muted-foreground" />
                    Square Footage
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. 2500" 
                      {...field} 
                      onChange={(e) => {
                        // Format number with commas
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        field.onChange(value ? parseInt(value).toLocaleString() : "");
                      }} 
                    />
                  </FormControl>
                  <FormDescription>
                    Total livable space in square feet
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lotSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lot Size</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 0.25 acres" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="yearBuilt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Year Built
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 1985" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Condition</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent - Move-in Ready</SelectItem>
                      <SelectItem value="good">Good - Minor Updates Needed</SelectItem>
                      <SelectItem value="fair">Fair - Some Repairs Required</SelectItem>
                      <SelectItem value="needs-work">Needs Work - Major Repairs</SelectItem>
                      <SelectItem value="fixer-upper">Fixer Upper - Extensive Renovation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Be honest about the property's current state
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6 py-4">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Image className="h-5 w-5 text-muted-foreground" />
                <Label className="text-base font-semibold">Property Images</Label>
                <Badge variant="secondary" className="text-xs">Optional</Badge>
              </div>
              
              <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Upload className="h-8 w-8 text-gray-400 mb-4" />
                  <div className="text-center">
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <span className="text-sm font-medium text-gray-700 hover:text-gray-900">
                        Click to upload images
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB each
                      </p>
                    </Label>
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Image Previews */}
              {filePreview.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filePreview.images.map((src, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Separator />
            
            {/* Document Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <Label className="text-base font-semibold">Documents</Label>
                <Badge variant="secondary" className="text-xs">Optional</Badge>
              </div>
              
              <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <Upload className="h-6 w-6 text-gray-400 mb-3" />
                  <div className="text-center">
                    <Label htmlFor="document-upload" className="cursor-pointer">
                      <span className="text-sm font-medium text-gray-700 hover:text-gray-900">
                        Upload property documents
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX up to 25MB each
                      </p>
                    </Label>
                    <input
                      id="document-upload"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={handleDocumentUpload}
                      className="hidden"
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Document List */}
              {filePreview.documents.length > 0 && (
                <div className="space-y-2">
                  {filePreview.documents.map((name, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm truncate">{name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeDocument(index)}
                        className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="listingPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Listing Price
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. 199000" 
                      {...field} 
                      onChange={(e) => {
                        // Format number as currency
                        const value = e.target.value.replace(/[^0-9.]/g, "");
                        field.onChange(value ? `$${parseInt(value).toLocaleString()}` : "");
                      }} 
                    />
                  </FormControl>
                  <FormDescription>
                    Your asking price for this property
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="assignmentFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignment Fee (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. 15000" 
                      {...field} 
                      onChange={(e) => {
                        // Format number as currency
                        const value = e.target.value.replace(/[^0-9.]/g, "");
                        field.onChange(value ? `$${parseInt(value).toLocaleString()}` : "");
                      }} 
                    />
                  </FormControl>
                  <FormDescription>
                    Fee for assigning the contract (if applicable)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="jvAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Joint Venture Available
                    </FormLabel>
                    <FormDescription>
                      Open to partnering with other investors
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="accessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Access</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select access type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate Access Available</SelectItem>
                      <SelectItem value="appointment">By Appointment Only</SelectItem>
                      <SelectItem value="occupied">Occupied - Limited Access</SelectItem>
                      <SelectItem value="restricted">Restricted Access</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How buyers can view the property
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional information about the property, terms, or requirements..."
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Include any special terms, conditions, or important details
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  // Step indicator component
  const StepIndicator = ({ stepNumber, isActive, isCompleted }: { stepNumber: number, isActive: boolean, isCompleted: boolean }) => (
    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium transition-colors ${
      isCompleted ? 'bg-green-100 border-green-500 text-green-700' :
      isActive ? 'bg-blue-100 border-blue-500 text-blue-700' :
      'bg-gray-100 border-gray-300 text-gray-500'
    }`}>
      {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
    </div>
  );

  const stepTitles = [
    "Property Info",
    "Details", 
    "Media",
    "Pricing"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-center">
            List Your Property
          </DialogTitle>
          <DialogDescription className="text-center">
            Complete all steps to create your property listing
          </DialogDescription>
          
          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            {[1, 2, 3, 4].map((stepNumber, index) => (
              <React.Fragment key={stepNumber}>
                <div className="flex flex-col items-center space-y-2">
                  <StepIndicator 
                    stepNumber={stepNumber} 
                    isActive={step === stepNumber}
                    isCompleted={step > stepNumber}
                  />
                  <span className={`text-xs font-medium ${
                    step === stepNumber ? 'text-blue-700' :
                    step > stepNumber ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    {stepTitles[index]}
                  </span>
                </div>
                {index < 3 && (
                  <div className={`h-0.5 w-12 transition-colors ${
                    step > stepNumber ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStepContent()}
            </form>
          </Form>
        </div>
        
        <DialogFooter className="flex-shrink-0 flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                Back
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {step === 4 && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="save-as-draft"
                  checked={saveAsDraft}
                  onCheckedChange={setSaveAsDraft}
                />
                <Label htmlFor="save-as-draft" className="text-sm">
                  Save as Draft
                </Label>
              </div>
            )}
            
            {step < 4 ? (
              <Button 
                type="button" 
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center gap-2"
              >
                Next Step
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={!isStepValid()}
                className="flex items-center gap-2"
              >
                {saveAsDraft ? <Save className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                {saveAsDraft ? "Save Draft" : "Publish Listing"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}