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
  SquareIcon,
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

interface PropertyListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyListingModal({ isOpen, onClose }: PropertyListingModalProps) {
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
                    <SquareIcon className="h-4 w-4 text-muted-foreground" />
                    Square Footage
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. 2500" 
                      {...field} 
                      onChange={(e) => {
                        // Format with commas
                        const value = e.target.value.replace(/[^0-9.]/g, "");
                        field.onChange(value ? parseInt(value).toLocaleString() : "");
                      }}
                    />
                  </FormControl>
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
                    <FormLabel className="flex items-center gap-2">
                      <SquareFootage className="h-4 w-4 text-muted-foreground" />
                      Lot Size (optional)
                    </FormLabel>
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
                      Year Built (optional)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. 1990" 
                        type="number"
                        min="1800"
                        max={new Date().getFullYear()}
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
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    Property Condition
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="turnkey">Turnkey - Move-in Ready</SelectItem>
                      <SelectItem value="cosmetic">Needs Cosmetic Repairs</SelectItem>
                      <SelectItem value="moderate">Moderate Rehab</SelectItem>
                      <SelectItem value="full-rehab">Full Rehab Required</SelectItem>
                      <SelectItem value="teardown">Teardown/Rebuild</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Accurately describe the condition to set expectations
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-2 mt-6">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-green-800 mb-1">
                  <Check className="h-4 w-4" />
                  Market Insight
                </div>
                <p className="text-xs text-green-700">
                  Properties with accurate specs tend to get 40% more views and 65% more serious offers.
                </p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-800 mb-1">
                  <Check className="h-4 w-4" />
                  Seller Tip
                </div>
                <p className="text-xs text-blue-700">
                  Be transparent about condition - it builds trust and attracts the right buyers.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5 text-[#135341]" />
                <h3 className="text-lg font-medium">Property Images</h3>
              </div>
              
              <Card className="border-dashed border-2 hover:border-[#135341] transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="h-10 w-10 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Drag & drop images here or{" "}
                      <Label
                        htmlFor="image-upload"
                        className="text-[#135341] hover:underline cursor-pointer"
                      >
                        browse files
                      </Label>
                    </p>
                    <p className="text-xs text-gray-500">
                      JPEG, PNG, or WebP up to 10MB each
                    </p>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {filePreview.images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Uploaded Images ({filePreview.images.length})</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filePreview.images.map((src, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={src}
                          alt={`Preview ${index}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#135341]" />
                <h3 className="text-lg font-medium">Property Documents (Optional)</h3>
              </div>
              
              <Card className="border-dashed border-2 hover:border-[#135341] transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Upload purchase agreements, inspections, etc.
                    </p>
                    <Label
                      htmlFor="document-upload"
                      className="text-[#135341] hover:underline cursor-pointer text-sm"
                    >
                      Select documents
                    </Label>
                    <Input
                      id="document-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      multiple
                      className="hidden"
                      onChange={handleDocumentUpload}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {filePreview.documents.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Uploaded Documents ({filePreview.documents.length})</h4>
                  <div className="space-y-2">
                    {filePreview.documents.map((name, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <span className="text-sm truncate max-w-xs">{name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        placeholder="e.g. 250000" 
                        {...field} 
                        onChange={(e) => {
                          // Format number as currency
                          const value = e.target.value.replace(/[^0-9.]/g, "");
                          field.onChange(value ? `$${parseInt(value).toLocaleString()}` : "");
                        }} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="assignmentFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      Assignment Fee (optional)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. 5000" 
                        {...field} 
                        onChange={(e) => {
                          // Format number as currency
                          const value = e.target.value.replace(/[^0-9.]/g, "");
                          field.onChange(value ? `$${parseInt(value).toLocaleString()}` : "");
                        }} 
                      />
                    </FormControl>
                    <FormDescription>
                      If this is a wholesale deal, what's your fee?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <FormField
                control={form.control}
                name="accessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Access Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="How can buyers access?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lockbox">Lockbox</SelectItem>
                        <SelectItem value="appointment">By Appointment</SelectItem>
                        <SelectItem value="drive-by">Drive By Only</SelectItem>
                        <SelectItem value="call">Call for Access</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="jvAvailable"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Joint Venture Available</FormLabel>
                      <FormDescription>
                        Are you open to JV partnerships on this deal?
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
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Additional Notes
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Anything else buyers should know about this property?"
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Details about rehab needed, zoning, seller financing, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center mt-6">
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Switch
                    checked={saveAsDraft}
                    onCheckedChange={setSaveAsDraft}
                  />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel>Save as Draft</FormLabel>
                  <FormDescription>
                    Listings saved as drafts won't be visible to buyers until published.
                  </FormDescription>
                </div>
              </FormItem>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  // Progress indicator for steps
  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < step) return "complete";
    if (stepNumber === step) return "current";
    return "upcoming";
  };
  
  const getStepIcon = (stepNumber: number) => {
    const status = getStepStatus(stepNumber);
    
    if (status === "complete") {
      return <div className="rounded-full bg-[#135341] p-1.5"><Check className="h-3 w-3 text-white" /></div>;
    }
    
    if (status === "current") {
      return <div className="rounded-full bg-[#135341] text-white h-5 w-5 flex items-center justify-center text-xs font-medium">{stepNumber}</div>;
    }
    
    return <div className="rounded-full bg-gray-200 text-gray-500 h-5 w-5 flex items-center justify-center text-xs font-medium">{stepNumber}</div>;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#135341]">
            {step === 1 && "Add New Property Listing"}
            {step === 2 && "Property Specifications"}
            {step === 3 && "Upload Photos & Documents"}
            {step === 4 && "Pricing & Deal Terms"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Enter the basic information about your property"}
            {step === 2 && "Provide detailed specifications about your property"}
            {step === 3 && "Upload photos and relevant documents"}
            {step === 4 && "Set your price and specify deal terms"}
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress steps */}
        <div className="mb-6 px-1">
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              {getStepIcon(1)}
              <span className={`text-xs ${getStepStatus(1) === "current" ? "text-[#135341] font-medium" : "text-gray-500"}`}>
                Basic Info
              </span>
            </div>
            <div className="h-0.5 bg-gray-200 w-12 mt-2.5"></div>
            <div className="flex items-center space-x-2">
              {getStepIcon(2)}
              <span className={`text-xs ${getStepStatus(2) === "current" ? "text-[#135341] font-medium" : "text-gray-500"}`}>
                Specs
              </span>
            </div>
            <div className="h-0.5 bg-gray-200 w-12 mt-2.5"></div>
            <div className="flex items-center space-x-2">
              {getStepIcon(3)}
              <span className={`text-xs ${getStepStatus(3) === "current" ? "text-[#135341] font-medium" : "text-gray-500"}`}>
                Photos
              </span>
            </div>
            <div className="h-0.5 bg-gray-200 w-12 mt-2.5"></div>
            <div className="flex items-center space-x-2">
              {getStepIcon(4)}
              <span className={`text-xs ${getStepStatus(4) === "current" ? "text-[#135341] font-medium" : "text-gray-500"}`}>
                Price
              </span>
            </div>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {renderStepContent()}
            
            <DialogFooter className="flex justify-between items-center mt-6">
              <div>
                {step > 1 ? (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                )}
              </div>
              <div>
                {step < 4 ? (
                  <Button 
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="bg-[#135341] hover:bg-[#09261E]"
                  >
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    className={saveAsDraft 
                      ? "bg-[#135341] hover:bg-[#09261E]" 
                      : "bg-[#135341] hover:bg-[#09261E]"
                    }
                    disabled={!isStepValid()}
                  >
                    {saveAsDraft ? "Save Draft" : "List Property"}
                    <Save className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}