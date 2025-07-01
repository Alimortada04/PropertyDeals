import React, { useState, useEffect, useRef } from "react";
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
import { AddressInput } from "@/components/common/address-input";
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
  Image as ImageIcon,
  FileText,
  AlertCircle,
  Check,
  ChevronRight,
  ChevronLeft,
  Save,
  X,
  Plus,
  Trash2,
  Youtube,
  Edit,
  RefreshCw,
  Users,
  Clock,
  Info,
  ArrowUp,
  ArrowDown,
  PlusCircle,
  Link as LinkIcon,
  PieChart,
  Sparkles,
  Search,
  Pencil,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Car,
  TrendingUp,
  Scale,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { usePropertyProfile } from "@/hooks/usePropertyProfile";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";
import { uploadPropertyFileToSupabase } from "@/lib/supabase-upload";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { v4 as uuidv4 } from "uuid";

function parseNumeric(value: string | undefined | null): number | null {
  if (!value) return null;
  const sanitized = value.replace(/[^0-9.]/g, "");
  return sanitized ? parseFloat(sanitized) : null;
}

// Define schemas for each step - only require essential fields
const stepOneSchema = z.object({
  // Step 1: Property Information - only address is required
  name: z.string().optional(),
  address: z.string().min(5, "Property address is required"),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  county: z.string().optional(),
  parcelId: z.string().optional(),
  propertyType: z.string().optional(),
  bedrooms: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "Bedrooms must be a valid number",
    }),
  bathrooms: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "Bathrooms must be a valid number",
    }),
  sqft: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        (!isNaN(Number(val.replace(/[$,]/g, ""))) &&
          Number(val.replace(/[$,]/g, "")) > 0),
      {
        message: "Square footage must be a valid number",
      },
    ),
  lotSize: z.string().optional(),
  yearBuilt: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        (!isNaN(Number(val)) &&
          Number(val) > 1800 &&
          Number(val) <= new Date().getFullYear()),
      {
        message: "Please enter a valid year",
      },
    ),
  parking: z.string().optional(),
});

const stepTwoSchema = z.object({
  // Step 2: Property Media - matching database schema
  primaryImage: z.any().optional(),
  galleryImages: z.array(z.any()).optional(),
  videoLink: z.string().optional(),
  videoFile: z.any().optional(),
});

const stepThreeSchema = z.object({
  // Step 3: Finance - all fields optional
  arv: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val.replace(/[$,]/g, ""))), {
      message: "ARV must be a valid number",
    }),
  rentTotalMonthly: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val.replace(/[$,]/g, ""))), {
      message: "Total monthly rent must be a valid number",
    }),
  rentTotalAnnual: z.string().optional(),
  rentUnit: z
    .array(
      z.object({
        name: z.string(),
        amount: z
          .string()
          .refine((val) => !isNaN(Number(val.replace(/[$,]/g, ""))), {
            message: "Rent must be a valid number",
          }),
        frequency: z.string(),
      }),
    )
    .optional(),
  expensesTotalMonthly: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val.replace(/[$,]/g, ""))), {
      message: "Total monthly expenses must be a valid number",
    }),
  expensesTotalAnnual: z.string().optional(),
  expenseItems: z
    .array(
      z.object({
        name: z.string(),
        amount: z
          .string()
          .refine((val) => !isNaN(Number(val.replace(/[$,]/g, ""))), {
            message: "Amount must be a valid number",
          }),
        frequency: z.string(),
      }),
    )
    .optional(),
});

const stepFourSchema = z.object({
  // Step 4: Logistics - require only closing date and purchase agreement
  accessType: z.string().optional(),
  closingDate: z.date({
    required_error: "Closing date is required",
  }),
  comps: z.array(z.string()).optional(),
  purchaseAgreement: z.any({
    required_error: "Purchase agreement is required",
  }),
  assignmentAgreement: z.any().optional(),
});

const stepFiveSchema = z.object({
  // Step 5: Final Details - matching database schema
  purchasePrice: z
    .string()
    .min(1, "Purchase price is required")
    .refine((val) => !isNaN(Number(val.replace(/[$,]/g, ""))), {
      message: "Purchase price must be a valid number",
    }),
  listingPrice: z
    .string()
    .min(1, "Listing price is required")
    .refine((val) => !isNaN(Number(val.replace(/[$,]/g, ""))), {
      message: "Listing price must be a valid number",
    }),
  assignmentFee: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val.replace(/[$,]/g, ""))), {
      message: "Assignment fee must be a valid number",
    }),
  repairProjects: z
    .array(
      z.object({
        name: z.string(),
        cost: z.string(),
        description: z.string().optional(),
        contractor: z.string().optional(),
        file: z.any().optional(),
      }),
    )
    .optional(),
  repairCostsTotal: z.string().optional(),
  jvPartners: z.array(z.string()).optional(),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters"),
  additionalNotes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featuredProperty: z.boolean().default(false),
});

// Overall form schema
const formSchema = stepOneSchema
  .merge(stepTwoSchema)
  .merge(stepThreeSchema)
  .merge(stepFourSchema)
  .merge(stepFiveSchema)
  .extend({
    id: z.string().optional(), // Add id field to prevent duplicate drafts
  });

type PropertyListingFormValues = z.infer<typeof formSchema>;

interface EnhancedPropertyListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDraftCreated?: (propertyId: string) => void;
}

export function EnhancedPropertyListingModal({
  isOpen,
  onClose,
  onDraftCreated,
}: EnhancedPropertyListingModalProps) {
  const [step, setStep] = useState(1);
  const [saveAsDraft, setSaveAsDraft] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [, setLocation] = useLocation();
  const { createPropertyDraft, updateProperty } = usePropertyProfile();
  const [user, setUser] = useState<any>(null);
  const [isUserClosing, setIsUserClosing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const lastSaveRef = useRef<Date | null>(null);

  // Get authenticated user on component mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);
  const [filePreview, setFilePreview] = useState<{
    primaryImage: string | null;
    galleryImages: string[];
    purchaseAgreement: string | null;
    repairQuotes: Record<number, string>;
  }>({
    primaryImage: null,
    galleryImages: [],
    purchaseAgreement: null,
    repairQuotes: {},
  });
  const [units, setUnits] = useState<
    { label: string; rent: string; occupied: boolean }[]
  >([]);
  const [expenses, setExpenses] = useState<
    { name: string; amount: string; frequency: string }[]
  >([
    { name: "Property Tax", amount: "", frequency: "annually" },
    { name: "Insurance", amount: "", frequency: "annually" },
    { name: "Utilities", amount: "", frequency: "monthly" },
  ]);
  const [repairs, setRepairs] = useState<
    {
      name: string;
      description: string;
      cost: string;
      quote: File | null;
      contractor: string;
    }[]
  >([]);
  const [partners, setPartners] = useState<string[]>([]);
  const [isAddressAutofilled, setIsAddressAutofilled] = useState(false);
  const [isDescriptionGenerated, setIsDescriptionGenerated] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  // Refs for managing scrolling
  const contentAreaRef = useRef<HTMLDivElement>(null);

  // Helper function to set step and ensure we're scrolled to the top
  const setStepAndScrollToTop = (newStep: number) => {
    setStep(newStep);

    // Ensure we scroll to the top
    setTimeout(() => {
      if (contentAreaRef.current) {
        contentAreaRef.current.scrollTop = 0;
      }
    }, 0);

    // Store last viewed step for potential recovery
    try {
      localStorage.setItem("propertyListingLastStep", String(newStep));
    } catch (error) {
      console.error("Failed to save step to localStorage:", error);
    }
  };

  // Default form values - matching database schema
  const defaultValues: Partial<PropertyListingFormValues> = {
    id: "", // Add id to default values
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    propertyType: "",
    accessType: "",
    rentUnit: [],
    expenseItems: [],
    repairProjects: [],
    jvPartners: [],
    galleryImages: [],
    comps: [],
    tags: [],
    featuredProperty: false,
    description: "",
  };

  // Setup form with react-hook-form
  const form = useForm<PropertyListingFormValues>({
    resolver: zodResolver(getValidationSchema(step)),
    defaultValues,
    mode: "onChange",
  });

  // Watch form values for validation and calculations
  const formValues = form.watch();

  // Calculate total monthly expenses
  const calculateMonthlyExpenses = () => {
    if (!expenses.length) return 0;

    return expenses.reduce((total, expense) => {
      const amount = parseFloat(expense.amount.replace(/[$,]/g, "")) || 0;

      if (expense.frequency === "monthly") {
        return total + amount;
      } else if (expense.frequency === "quarterly") {
        return total + amount / 3;
      } else if (expense.frequency === "annually") {
        return total + amount / 12;
      }

      return total;
    }, 0);
  };

  // Calculate total annual expenses
  const calculateAnnualExpenses = () => {
    if (!expenses.length) return 0;

    return expenses.reduce((total, expense) => {
      const amount = parseFloat(expense.amount.replace(/[$,]/g, "")) || 0;

      if (expense.frequency === "monthly") {
        return total + amount * 12;
      } else if (expense.frequency === "quarterly") {
        return total + amount * 4;
      } else if (expense.frequency === "annually") {
        return total + amount;
      }

      return total;
    }, 0);
  };

  // Calculate total repair costs
  const calculateTotalRepairs = () => {
    if (!repairs.length) return 0;

    return repairs.reduce((total, repair) => {
      const cost = parseFloat(repair.cost.replace(/[$,]/g, "")) || 0;
      return total + cost;
    }, 0);
  };

  // Calculate assignment fee
  const calculateAssignmentFee = () => {
    const purchasePrice = parseFloat(
      formValues.purchasePrice?.replace(/[$,]/g, "") || "0",
    );
    const listingPrice = parseFloat(
      formValues.listingPrice?.replace(/[$,]/g, "") || "0",
    );

    if (isNaN(purchasePrice) || isNaN(listingPrice)) {
      return "";
    }

    const fee = listingPrice - purchasePrice;
    return fee > 0 ? `$${fee.toLocaleString()}` : "$0";
  };

  // Auto update assignment fee when purchase or listing price changes
  useEffect(() => {
    if (formValues.purchasePrice && formValues.listingPrice) {
      const calculatedFee = calculateAssignmentFee();
      form.setValue("assignmentFee", calculatedFee);
    }
  }, [formValues.purchasePrice, formValues.listingPrice]);

  // Get the appropriate validation schema based on current step
  function getValidationSchema(step: number) {
    switch (step) {
      case 1:
        return stepOneSchema;
      case 2:
        return stepTwoSchema;
      case 3:
        return stepThreeSchema;
      case 4:
        return stepFourSchema;
      case 5:
        return stepFiveSchema;
      default:
        return stepOneSchema;
    }
  }

  // Check if entire form is valid across all steps
  const isFormComplete = () => {
    try {
      // Check step 1
      const step1Schema = getValidationSchema(1);
      const step1Values = {
        name: formValues.name,
        address: formValues.address,
        propertyType: formValues.propertyType,
        city: formValues.city,
        state: formValues.state,
        zipCode: formValues.zipCode,
        sqft: formValues.sqft,
        lotSize: formValues.lotSize,
        bedrooms: formValues.bedrooms,
        bathrooms: formValues.bathrooms,
        yearBuilt: formValues.yearBuilt,
        county: formValues.county,
        parcelId: formValues.parcelId,
        parking: formValues.parking,
      };
      step1Schema.parse(step1Values);

      // Check step 3
      const step3Schema = getValidationSchema(3);
      const step3Values = {
        arv: formValues.arv,
        rentTotalMonthly: formValues.rentTotalMonthly,
        rentTotalAnnual: formValues.rentTotalAnnual,
        rentUnit: formValues.rentUnit,
        expensesTotalMonthly: formValues.expensesTotalMonthly,
        expenseItems: formValues.expenseItems,
      };
      step3Schema.parse(step3Values);

      // Check step 4
      const step4Schema = getValidationSchema(4);
      const step4Values = {
        accessType: formValues.accessType,
        closingDate: formValues.closingDate,
        comps: formValues.comps,
        purchaseAgreement: formValues.purchaseAgreement,
        assignmentAgreement: formValues.assignmentAgreement,
      };
      step4Schema.parse(step4Values);

      // Check step 5
      const step5Schema = getValidationSchema(5);
      const step5Values = {
        purchasePrice: formValues.purchasePrice,
        listingPrice: formValues.listingPrice,
        assignmentFee: formValues.assignmentFee,
        repairProjects: formValues.repairProjects,
        repairCostsTotal: formValues.repairCostsTotal,
        jvPartners: formValues.jvPartners,
        description: formValues.description,
        additionalNotes: formValues.additionalNotes,
        tags: formValues.tags,
        featuredProperty: formValues.featuredProperty,
      };
      step5Schema.parse(step5Values);

      // Check for required media uploads
      if (!filePreview.primaryImage || filePreview.galleryImages.length === 0) {
        return false;
      }

      // Check for required purchase agreement
      if (!filePreview.purchaseAgreement) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  // Check if current step is valid
  const isStepValid = () => {
    const schema = getValidationSchema(step);
    let currentFormValues: any = {};

    if (step === 1) {
      currentFormValues = {
        name: formValues.name,
        address: formValues.address,
        propertyType: formValues.propertyType,
        city: formValues.city,
        state: formValues.state,
        zipCode: formValues.zipCode,
        sqft: formValues.sqft,
        lotSize: formValues.lotSize,
        bedrooms: formValues.bedrooms,
        bathrooms: formValues.bathrooms,
        yearBuilt: formValues.yearBuilt,
        county: formValues.county,
        parcelId: formValues.parcelId,
        parking: formValues.parking,
      };
    } else if (step === 2) {
      // Media step is always valid to proceed
      return true;
    } else if (step === 3) {
      currentFormValues = {
        arv: formValues.arv,
        rentTotalMonthly: formValues.rentTotalMonthly,
        rentTotalAnnual: formValues.rentTotalAnnual,
        rentUnit: formValues.rentUnit,
        expensesTotalMonthly: formValues.expensesTotalMonthly,
        expenseItems: formValues.expenseItems,
      };
    } else if (step === 4) {
      currentFormValues = {
        accessType: formValues.accessType,
        closingDate: formValues.closingDate,
        comps: formValues.comps,
        purchaseAgreement: formValues.purchaseAgreement,
        assignmentAgreement: formValues.assignmentAgreement,
      };

      // Draft can proceed without purchase agreement
      if (saveAsDraft) {
        return true;
      }
    } else if (step === 5) {
      currentFormValues = {
        purchasePrice: formValues.purchasePrice,
        listingPrice: formValues.listingPrice,
        assignmentFee: formValues.assignmentFee,
        repairProjects: formValues.repairProjects,
        repairCostsTotal: formValues.repairCostsTotal,
        jvPartners: formValues.jvPartners,
        description: formValues.description,
        additionalNotes: formValues.additionalNotes,
        tags: formValues.tags,
        featuredProperty: formValues.featuredProperty,
      };
    }

    try {
      schema.parse(currentFormValues);
      return true;
    } catch (error) {
      return saveAsDraft; // Allow proceeding if saving as draft
    }
  };

  // Handle address input changes
  const handleAddressChange = (address: string) => {
    if (address && address.length > 10) {
      setIsAddressAutofilled(true);

      // Set a basic property name if none exists
      if (!form.getValues("name")) {
        const firstPart = address.split(",")[0];
        form.setValue("name", `Property at ${firstPart}`);
      }
    } else {
      setIsAddressAutofilled(false);
    }
  };

  // Legacy address autofill function (kept for backward compatibility)
  const handleAddressAutofill = () => {
    const address = form.getValues("address");

    if (!address || address.length < 5) {
      toast({
        title: "Please enter a valid address",
        description: "We need a complete address to fetch property details",
        variant: "destructive",
      });
      return;
    }
  };

  // Generate AI description based on property details
  const generateAIDescription = () => {
    setIsGeneratingDescription(true);

    // Simulate API call delay
    setTimeout(() => {
      const tone = form.getValues("descriptionTone");
      const type = form.getValues("descriptionType");
      const beds = form.getValues("bedrooms");
      const baths = form.getValues("bathrooms");
      const sqft = form.getValues("squareFootage");
      const propertyType = form.getValues("propertyType");
      const condition = form.getValues("condition");

      // Construct a description based on gathered property details
      let description = "";

      if (tone === "professional") {
        description += "This exceptional ";
      } else if (tone === "friendly") {
        description += "Welcome to this charming ";
      } else if (tone === "motivated") {
        description += "PRICED TO SELL! This amazing ";
      } else {
        description += "URGENT: Must-see ";
      }

      description += `${beds} bedroom, ${baths} bathroom ${propertyType} offers ${sqft} square feet of `;

      if (condition === "excellent") {
        description += "meticulously maintained living space. ";
      } else if (condition === "good") {
        description += "well-kept living space. ";
      } else if (condition === "fair") {
        description += "living space with lots of potential. ";
      } else {
        description += "living space perfect for your renovation vision. ";
      }

      if (type === "investor") {
        description += `With an estimated monthly rent of $${formValues.rentTotalMonthly?.replace(/[$,]/g, "")} and strong market appreciation potential, this property presents an excellent investment opportunity with solid cash flow prospects.`;
      } else if (type === "endbuyer") {
        description +=
          "The perfect home for a family seeking comfort, convenience, and quality in a desirable neighborhood with excellent amenities nearby.";
      } else if (type === "minimalist") {
        description += `${beds}BR/${baths}BA. ${condition} condition. Great location. Excellent opportunity.`;
      } else {
        description +=
          "This property offers the perfect blend of comfort, convenience, and value in today's competitive real estate market.";
      }

      form.setValue("description", description);
      setIsDescriptionGenerated(true);
      setIsGeneratingDescription(false);
    }, 2000);
  };

  // Next step handler
  const handleNext = () => {
    if (step < 5) {
      // Auto-generate description when reaching final step
      if (step === 4 && !isDescriptionGenerated) {
        generateAIDescription();
      }

      // Use our dedicated function to set step and scroll to top
      setStepAndScrollToTop(step + 1);
    }
  };

  // Back step handler
  const handleBack = () => {
    if (step > 1) {
      // Use our dedicated function to set step and scroll to top
      setStepAndScrollToTop(step - 1);
    }
  };

  // Add unit handler
  const handleAddUnit = () => {
    setUnits([
      ...units,
      { label: `Unit ${units.length + 1}`, rent: "", occupied: false },
    ]);
  };

  // Update unit handler
  const handleUpdateUnit = (
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    const updatedUnits = [...units];
    (updatedUnits[index] as any)[field] = value;
    setUnits(updatedUnits);
    form.setValue("units", updatedUnits);
  };

  // Remove unit handler
  const handleRemoveUnit = (index: number) => {
    const updatedUnits = units.filter((_, i) => i !== index);
    setUnits(updatedUnits);
    form.setValue("units", updatedUnits);
  };

  // Add expense handler
  const handleAddExpense = () => {
    setExpenses([...expenses, { name: "", amount: "", frequency: "monthly" }]);
  };

  // Update expense handler
  const handleUpdateExpense = (index: number, field: string, value: string) => {
    const updatedExpenses = [...expenses];
    (updatedExpenses[index] as any)[field] = value;
    setExpenses(updatedExpenses);
    form.setValue("expenses", updatedExpenses);
  };

  // Remove expense handler
  const handleRemoveExpense = (index: number) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
    form.setValue("expenses", updatedExpenses);
  };

  // Add repair handler
  const handleAddRepair = () => {
    setRepairs([
      ...repairs,
      {
        name: "",
        description: "",
        cost: "",
        quote: null,
        contractor: "",
      },
    ]);
  };

  // Update repair handler
  const handleUpdateRepair = (
    index: number,
    field: string,
    value: string | File | null,
  ) => {
    const updatedRepairs = [...repairs];
    (updatedRepairs[index] as any)[field] = value;
    setRepairs(updatedRepairs);
    form.setValue("repairs", updatedRepairs);

    if (field === "quote" && value) {
      // Save the file name for preview
      const file = value as File;
      setFilePreview((prev) => ({
        ...prev,
        repairQuotes: {
          ...prev.repairQuotes,
          [index]: file.name,
        },
      }));
    }
  };

  // Remove repair handler
  const handleRemoveRepair = (index: number) => {
    const updatedRepairs = repairs.filter((_, i) => i !== index);
    setRepairs(updatedRepairs);
    form.setValue("repairs", updatedRepairs);

    // Remove quote preview
    const updatedQuotes = { ...filePreview.repairQuotes };
    delete updatedQuotes[index];
    setFilePreview((prev) => ({
      ...prev,
      repairQuotes: updatedQuotes,
    }));
  };

  // Add partner handler
  const handleAddPartner = (partner: string) => {
    if (partner && !partners.includes(partner)) {
      const updatedPartners = [...partners, partner];
      setPartners(updatedPartners);
      form.setValue("partners", updatedPartners);
    }
  };

  // Remove partner handler
  const handleRemovePartner = (index: number) => {
    const updatedPartners = partners.filter((_, i) => i !== index);
    setPartners(updatedPartners);
    form.setValue("partners", updatedPartners);
  };

  // Handle primary image upload
  const handlePrimaryImageUpload = (
    e: React.ChangeEvent<HTMLInputElement> | { dataTransfer?: DataTransfer },
  ) => {
    // Handle both file input changes and drag & drop
    let file: File | null = null;

    if ("dataTransfer" in e && e.dataTransfer) {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        file = files[0];
      }
    } else if ("target" in e && e.target) {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        file = files[0];
      }
    }

    if (!file) return;

    // Validate file is an image
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Unsupported file",
        description: "Only image files are allowed for the primary image.",
        variant: "destructive",
      });
      return;
    }

    form.setValue("primaryImage", file);

    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setFilePreview((prev) => ({
          ...prev,
          primaryImage: reader.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle gallery images upload
  const handleGalleryImagesUpload = (
    e: React.ChangeEvent<HTMLInputElement> | { dataTransfer?: DataTransfer },
  ) => {
    // Handle both file input changes and drag & drop
    let files: FileList | null = null;

    if ("dataTransfer" in e && e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if ("target" in e && e.target) {
      files = (e.target as HTMLInputElement).files;
    }

    if (!files?.length) return;

    const filesArray = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (!filesArray.length) {
      toast({
        title: "Unsupported files",
        description: "Only image files are allowed for gallery uploads.",
        variant: "destructive",
      });
      return;
    }

    form.setValue("galleryImages", [
      ...(formValues.galleryImages || []),
      ...filesArray,
    ]);

    // Generate previews
    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFilePreview((prev) => ({
            ...prev,
            galleryImages: [...prev.galleryImages, reader.result as string],
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    // If no primary image is set, use the first gallery image
    if (!filePreview.primaryImage && filesArray.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFilePreview((prev) => ({
            ...prev,
            primaryImage: reader.result as string,
          }));
          form.setValue("primaryImage", filesArray[0]);

          toast({
            title: "Primary image auto-set",
            description:
              "The first uploaded image has been set as your primary image.",
            variant: "default",
          });
        }
      };
      reader.readAsDataURL(filesArray[0]);
    }
  };

  // Handle purchase agreement upload
  const handlePurchaseAgreementUpload = (
    e: React.ChangeEvent<HTMLInputElement> | { dataTransfer?: DataTransfer },
  ) => {
    // Handle both file input changes and drag & drop
    let file: File | null = null;

    if ("dataTransfer" in e && e.dataTransfer) {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        file = files[0];
      }
    } else if ("target" in e && e.target) {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        file = files[0];
      }
    }

    if (!file) return;

    // Validate file type
    if (
      file.type !== "application/pdf" &&
      !file.type.includes("word") &&
      file.type !== "application/rtf"
    ) {
      toast({
        title: "Unsupported file format",
        description: "Please upload a PDF, Word document, or RTF file",
        variant: "destructive",
      });
      return;
    }

    form.setValue("purchaseAgreement", file);

    // Store file name for preview
    setFilePreview((prev) => ({
      ...prev,
      purchaseAgreement: file.name,
    }));
  };

  // Remove gallery image
  const removeGalleryImage = (index: number) => {
    const updatedImages = filePreview.galleryImages.filter(
      (_, i) => i !== index,
    );
    setFilePreview((prev) => ({
      ...prev,
      galleryImages: updatedImages,
    }));

    const currentImages = formValues.galleryImages || [];
    const updatedImageFiles = currentImages.filter((_, i) => i !== index);
    form.setValue("galleryImages", updatedImageFiles);
  };

  // Reorder gallery images
  const moveGalleryImage = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === filePreview.galleryImages.length - 1)
    ) {
      return; // Can't move further
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;

    // Update preview images order
    const updatedPreviews = [...filePreview.galleryImages];
    [updatedPreviews[index], updatedPreviews[newIndex]] = [
      updatedPreviews[newIndex],
      updatedPreviews[index],
    ];

    // Update actual files order
    const updatedFiles = [...(formValues.galleryImages || [])];
    [updatedFiles[index], updatedFiles[newIndex]] = [
      updatedFiles[newIndex],
      updatedFiles[index],
    ];

    setFilePreview((prev) => ({
      ...prev,
      galleryImages: updatedPreviews,
    }));

    form.setValue("galleryImages", updatedFiles);
  };

  // Handle save as draft toggle
  const handleSaveAsDraftToggle = (checked: boolean) => {
    setSaveAsDraft(checked);

    // Update last saved time if checked
    if (checked) {
      setLastSaved(new Date());
    }
  };

  // Check form completion status and update draft toggle accordingly
  useEffect(() => {
    // Only auto-switch if we're on the final review page
    if (step === 5) {
      const isComplete = isFormComplete();

      // If form is complete, automatically set saveAsDraft to false (publish)
      // Only do this if it's currently true to avoid toggling back and forth
      if (isComplete && saveAsDraft) {
        setSaveAsDraft(false);
      }
      // If form is incomplete, force draft mode
      else if (!isComplete && !saveAsDraft) {
        setSaveAsDraft(true);

        toast({
          title: "Saving as draft",
          description:
            "Some required information is missing. Your listing will be saved as a draft.",
          variant: "default",
        });
      }
    }
  }, [step, formValues, filePreview, units, expenses, repairs, partners]);

  // Auto-save draft functionality with throttling
  const saveDraft = async (formData: any = null) => {
    if (!saveAsDraft) return;

    // Check if user is authenticated
    if (!user?.id) {
      console.log("User not authenticated, skipping draft save");
      return;
    }

    setIsSaving(true);

    try {
      const data = formData || form.getValues();

      // Transform form data to match backend schema with proper snake_case field names
      const draftData = {
        name: data.name || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        zipcode: data.zipCode || "", // snake_case
        county: data.county || "",
        parcel_id: data.parcelId || "", // snake_case
        property_type: data.propertyType || "", // snake_case
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
        bathrooms: data.bathrooms ? parseFloat(data.bathrooms) : null,
        sqft: data.sqft ? parseInt(data.sqft.replace(/[^0-9]/g, "")) : null,
        lot_size: data.lotSize || "", // snake_case
        year_built: data.yearBuilt ? parseInt(data.yearBuilt) : null, // snake_case
        parking: data.parking || "",

        // Media with snake_case
        primary_image: data.primaryImage
          ? (data.primaryImage as File).name
          : null,
        gallery_images: data.galleryImages
          ? (data.galleryImages as File[]).map((f) => f.name)
          : [],
        video_walkthrough: data.videoLink || null, // snake_case

        // Finance with snake_case
        arv: data.arv ? parseInt(data.arv.replace(/[^0-9]/g, "")) : null,
        rent_total_monthly: data.rentTotalMonthly
          ? parseInt(data.rentTotalMonthly.replace(/[^0-9]/g, ""))
          : null,
        rent_unit: units || [],
        expense_items: expenses || [], // snake_case

        // Logistics with snake_case
        access_type: data.accessType || "", // snake_case
        closing_date: data.closingDate
          ? new Date(data.closingDate).toISOString().split("T")[0]
          : null,
        comps: data.comps || [],
        purchase_agreement: data.purchaseAgreement
          ? (data.purchaseAgreement as File).name
          : null,

        // Final Details with snake_case
        purchase_price: data.purchasePrice
          ? parseInt(data.purchasePrice.replace(/[^0-9]/g, ""))
          : null,
        listing_price: data.listingPrice
          ? parseInt(data.listingPrice.replace(/[^0-9]/g, ""))
          : null,
        assignment_fee: data.assignmentFee
          ? parseInt(data.assignmentFee.replace(/[^0-9]/g, ""))
          : null,
        repairs: repairs || [],
        jv_partners: partners || [], // snake_case
        description: data.description || "",
        additional_notes: data.notes || "", // snake_case
        tags: data.tags || [],
        featured_property: data.featuredProperty || false, // snake_case

        // Always save as draft
        status: "draft",
        seller_id: user.id,
      };

      // Check if formValues.id exists to determine create vs update
      if (formValues.id) {
        // Update existing property
        const result = await updateProperty(formValues.id, draftData);
        if (result) {
          setLastSaved(new Date());
        }
      } else {
        // Create new property draft
        const newId = uuidv4();
        const result = await createPropertyDraft({ ...draftData, id: newId });
        if (result && result.id) {
          form.setValue("id", result.id.toString());
          setLastSaved(new Date());
        }
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      // Still update lastSaved for UI purposes even if save failed
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!isOpen || !saveAsDraft) return;

    const intervalId = setInterval(() => {
      if (saveAsDraft) {
        console.log("Auto-saving draft...", form.getValues());
        saveDraft();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [isOpen, saveAsDraft, form, units, expenses, repairs, partners]);

  // Form submission - prevent duplicate drafts
  const onSubmit = async (data: PropertyListingFormValues) => {
    setIsPublishing(true);
    
    try {
      // Use existing ID from form if available
      let propertyId = formValues.id;

      // Upload primary image
      const uploadedPrimaryImage = formValues.primaryImage
        ? await uploadPropertyFileToSupabase(
            formValues.primaryImage,
            "primary",
            user.id,
            propertyId,
          )
        : null;

      // Upload gallery images
      const galleryFilesOnly = Array.isArray(formValues.galleryImages)
        ? formValues.galleryImages.filter((f) => f instanceof File)
        : [];

      const uploadedGalleryImages = galleryFilesOnly.length
        ? await Promise.all(
            galleryFilesOnly.map((file, index) =>
              uploadPropertyFileToSupabase(
                file,
                "gallery",
                user.id,
                propertyId,
                index,
              ),
            ),
          )
        : [];

      // Upload video file (if exists)
      const uploadedVideoUrl = formValues.videoFile
        ? await uploadPropertyFileToSupabase(
            formValues.videoFile,
            "video",
            user.id,
            propertyId,
          )
        : null;

      // Upload purchase agreement
      const uploadedPurchaseAgreement = formValues.purchaseAgreement
        ? await uploadPropertyFileToSupabase(
            formValues.purchaseAgreement,
            "agreements",
            user.id,
            propertyId,
          )
        : null;

      // Upload assignment agreement (if any)
      const uploadedAssignmentAgreement = formValues.assignmentAgreement
        ? await uploadPropertyFileToSupabase(
            formValues.assignmentAgreement,
            "agreements",
            user.id,
            propertyId,
          )
        : null;

      // Upload repair quotes
      const uploadedRepairs = await Promise.all(
        repairs.map(async (repair, index) => ({
          name: repair.name,
          description: repair.description,
          cost: repair.cost,
          contractor: repair.contractor,
          quote: repair.quote
            ? await uploadPropertyFileToSupabase(
                repair.quote,
                "repair-quotes",
                user.id,
                propertyId,
                index,
              )
            : null,
        })),
      );

      // Collect form data with proper snake_case field names for Supabase
      const rawFormData = {
        name: formValues.name,
        address: formValues.address,
        city: formValues.city,
        state: formValues.state,
        zipcode: formValues.zipCode, // Use zipCode from form, store as zipcode
        county: formValues.county,
        parcel_id: formValues.parcelId, // snake_case
        property_type: formValues.propertyType, // snake_case
        bedrooms: formValues.bedrooms,
        bathrooms: formValues.bathrooms,
        sqft: parseNumeric(formValues.sqft),
        lot_size: formValues.lotSize, // snake_case
        year_built: formValues.yearBuilt, // snake_case
        parking: formValues.parking,
        property_condition: formValues.condition, // snake_case
        primary_image: uploadedPrimaryImage,
        gallery_images: uploadedGalleryImages,
        video_walkthrough: uploadedVideoUrl || formValues.videoLink || null,
        id: propertyId,
        arv: parseNumeric(formValues.arv),
        rent_total_monthly: parseNumeric(formValues.rentTotalMonthly), // snake_case
        access_type: formValues.accessType, // snake_case
        closing_date: formValues.closingDate ? new Date(formValues.closingDate).toISOString().split('T')[0] : null, // Format as YYYY-MM-DD
        comps: formValues.comps,
        purchase_agreement: uploadedPurchaseAgreement,
        assignment_agreement: uploadedAssignmentAgreement,
        purchase_price: parseNumeric(formValues.purchasePrice), // snake_case
        listing_price: parseNumeric(formValues.listingPrice), // snake_case
        assignment_fee: parseNumeric(formValues.assignmentFee), // snake_case
        description: formValues.description,
        additional_notes: formValues.additionalNotes, // snake_case
        status: saveAsDraft ? "draft" : "live",

        // Dynamic arrays from modal state with snake_case
        rent_unit: units,
        expense_items: expenses, // snake_case
        repairs: uploadedRepairs,
        jv_partners: partners, // snake_case

        // Calculated fields with snake_case
        expenses_total_monthly: calculateMonthlyExpenses(), // snake_case
        repair_costs_total: calculateTotalRepairs(), // snake_case
        
        // Ensure seller_id is included
        seller_id: user.id,
      };

      console.log("Raw form data collected:", rawFormData);

      // Update existing property or create new one
      const result = formValues.id 
        ? await updateProperty(parseInt(formValues.id), rawFormData)
        : await createPropertyDraft(rawFormData);

      if (!result) {
        toast({
          title: "Error",
          description: "Failed to save property listing. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Show success toast
      toast({
        title: saveAsDraft ? "Draft Created!" : "Property Listed Successfully!",
        description: saveAsDraft
          ? "Your property draft has been saved. You can continue editing it anytime."
          : "Your property is now live and visible to buyers.",
      });

      // Close modal and return to dashboard
      onClose();

      // Reset form
      form.reset();
      setStep(1);
      setSaveAsDraft(true);
      setUnits([]);
      setExpenses([
        { name: "Property Tax", amount: "", frequency: "annually" },
        { name: "Insurance", amount: "", frequency: "annually" },
        { name: "Utilities", amount: "", frequency: "monthly" },
      ]);
      setRepairs([]);
      setPartners([]);

      // Call onDraftCreated callback if provided
      if (saveAsDraft && result.id && onDraftCreated) {
        onDraftCreated(result.id.toString());
      }

      return;

      // Show legacy success toast if not redirecting
      toast({
        title: saveAsDraft ? "Draft Saved!" : "Property Listed Successfully!",
        description: saveAsDraft
          ? "Your listing has been saved as a draft."
          : "Your property is now live and will appear in search results.",
        variant: "default",
      });

      // Reset form and close modal
      form.reset();
      setStep(1);
      setFilePreview({
        primaryImage: null,
        galleryImages: [],
        purchaseAgreement: null,
        repairQuotes: {},
      });
      setUnits([]);
      setExpenses([
        { name: "Property Tax", amount: "", frequency: "annually" },
        { name: "Insurance", amount: "", frequency: "annually" },
        { name: "Utilities", amount: "", frequency: "monthly" },
      ]);
      setRepairs([]);
      setPartners([]);
      setIsAddressAutofilled(false);
      setIsDescriptionGenerated(false);
      setSaveAsDraft(false);
      setLastSaved(null);
      onClose();
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        title: "Error saving property",
        description:
          "There was an error saving your property listing. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Log API key when component mounts (for debugging)
  useEffect(() => {
    console.log(
      "Google Places API Key:",
      import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
    );
  }, []);

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        // Only reset if not saving as draft
        if (!saveAsDraft) {
          form.reset();
          setStep(1);
          setFilePreview({
            primaryImage: null,
            galleryImages: [],
            purchaseAgreement: null,
            repairQuotes: {},
          });
          setUnits([]);
          setExpenses([
            { name: "Property Tax", amount: "", frequency: "annually" },
            { name: "Insurance", amount: "", frequency: "annually" },
            { name: "Utilities", amount: "", frequency: "monthly" },
          ]);
          setRepairs([]);
          setPartners([]);
          setIsAddressAutofilled(false);
          setIsDescriptionGenerated(false);
          setSaveAsDraft(false);
          setLastSaved(null);
        }
      }, 300);
    }
  }, [isOpen, saveAsDraft, form]);

  // Progress indicator for steps
  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < step) return "complete";
    if (stepNumber === step) return "current";
    return "upcoming";
  };

  const getStepIcon = (stepNumber: number) => {
    const status = getStepStatus(stepNumber);

    if (status === "complete") {
      return (
        <div className="rounded-full bg-[#135341] p-1.5">
          <Check className="h-3 w-3 text-white" />
        </div>
      );
    }

    if (status === "current") {
      return (
        <div className="rounded-full bg-[#135341] text-white h-5 w-5 flex items-center justify-center text-xs font-medium">
          {stepNumber}
        </div>
      );
    }

    return (
      <div className="rounded-full bg-gray-200 text-gray-500 h-5 w-5 flex items-center justify-center text-xs font-medium">
        {stepNumber}
      </div>
    );
  };

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 py-4">
            <div className="space-y-4">
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
                      <AddressInput
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          handleAddressChange(value);
                        }}
                        placeholder="Enter the full property address"
                        className="w-full"
                        required
                        autoFocus={true}
                      />
                    </FormControl>
                    <FormDescription>
                      Address information will be used to automatically fill
                      property details
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isAddressAutofilled && (
                <div className="rounded-md bg-blue-50 p-3 border border-blue-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Address Found
                      </h3>
                      <div className="mt-1 text-sm text-blue-700">
                        <p>
                          Property details have been auto-filled from public
                          records. Feel free to modify any information that
                          needs correction.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      Property Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Colonial Single Family"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A descriptive title helps buyers identify your property
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
                        <SelectItem value="single-family">
                          Single Family
                        </SelectItem>
                        <SelectItem value="multi-family">
                          Multi-Family
                        </SelectItem>
                        <SelectItem value="duplex">Duplex</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                        <SelectItem value="land">Vacant Land</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Chicago" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. IL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 60601" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        placeholder="e.g. 3"
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
                        placeholder="e.g. 2.5"
                        {...field}
                      />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sqft"
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
                          // Format with commas
                          const value = e.target.value.replace(/[^0-9.]/g, "");
                          field.onChange(
                            value ? parseInt(value).toLocaleString() : "",
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lotSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Square className="h-4 w-4 text-muted-foreground" />
                      Lot Size
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 0.25 acres" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Parking Field */}
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="parking"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      Parking (optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Street parking, 2-car garage, driveway"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <FormField
                control={form.control}
                name="county"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>County (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Cook County" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parcelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcel ID / APN (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 14-21-106-017-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-[#135341]" />
                <h3 className="text-lg font-medium">
                  Primary Image (Thumbnail)
                </h3>
                <span className="text-red-500 font-medium text-sm">
                  *Required
                </span>
              </div>

              <div
                className={`relative ${filePreview.primaryImage ? "" : "primary-image-upload"}`}
                onDragOver={(e) => {
                  if (!filePreview.primaryImage) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget
                      .querySelector(".upload-dropzone")
                      ?.classList.add(
                        "ring-2",
                        "ring-[#135341]",
                        "bg-[#135341]/5",
                      );
                  }
                }}
                onDragLeave={(e) => {
                  if (!filePreview.primaryImage) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget
                      .querySelector(".upload-dropzone")
                      ?.classList.remove(
                        "ring-2",
                        "ring-[#135341]",
                        "bg-[#135341]/5",
                      );
                  }
                }}
                onDrop={(e) => {
                  if (!filePreview.primaryImage) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget
                      .querySelector(".upload-dropzone")
                      ?.classList.remove(
                        "ring-2",
                        "ring-[#135341]",
                        "bg-[#135341]/5",
                      );
                    handlePrimaryImageUpload({ dataTransfer: e.dataTransfer });
                  }
                }}
              >
                <Card
                  className={`border-dashed border-2 ${filePreview.primaryImage ? "" : "hover:border-[#135341] transition-colors upload-dropzone"}`}
                >
                  {filePreview.primaryImage ? (
                    <div className="relative group">
                      <img
                        src={filePreview.primaryImage}
                        alt="Primary"
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full bg-white/80 hover:bg-gray-200 transition-colors"
                          onClick={() => {
                            setFilePreview((prev) => ({
                              ...prev,
                              primaryImage: null,
                            }));
                            form.setValue("primaryImage", null);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <CardContent className="p-6 text-center">
                      <Label
                        htmlFor="primary-image-upload"
                        className="flex flex-col items-center justify-center gap-2 cursor-pointer w-full h-full"
                      >
                        <ImageIcon className="h-10 w-10 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Drag & drop your main property image or browse files
                        </p>
                        <p className="text-xs text-gray-500">
                          JPEG, PNG, or WebP up to 10MB
                        </p>
                        <Input
                          id="primary-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePrimaryImageUpload}
                        />
                      </Label>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-[#135341]" />
                <h3 className="text-lg font-medium">Gallery Images</h3>
                <span className="text-red-500 font-medium text-sm">
                  *Required
                </span>
              </div>

              <div
                className="relative"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget
                    .querySelector(".upload-dropzone")
                    ?.classList.add(
                      "ring-2",
                      "ring-[#135341]",
                      "bg-[#135341]/5",
                    );
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget
                    .querySelector(".upload-dropzone")
                    ?.classList.remove(
                      "ring-2",
                      "ring-[#135341]",
                      "bg-[#135341]/5",
                    );
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget
                    .querySelector(".upload-dropzone")
                    ?.classList.remove(
                      "ring-2",
                      "ring-[#135341]",
                      "bg-[#135341]/5",
                    );

                  // Use the enhanced handler that supports drag & drop
                  handleGalleryImagesUpload({ dataTransfer: e.dataTransfer });
                }}
              >
                <Card className="border-dashed border-2 hover:border-[#135341] transition-colors upload-dropzone focus-within:ring-2 focus-within:ring-[#135341]">
                  <CardContent className="p-6 text-center">
                    <Label
                      htmlFor="gallery-upload"
                      className="flex flex-col items-center justify-center gap-2 cursor-pointer w-full h-full"
                    >
                      <Upload className="h-10 w-10 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Drag & drop property photos here or browse files
                      </p>
                      <p className="text-xs text-gray-500">
                        Upload multiple images at once (up to 20)
                      </p>
                      <Input
                        id="gallery-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleGalleryImagesUpload}
                      />
                    </Label>
                  </CardContent>
                </Card>
              </div>

              {filePreview.galleryImages.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">
                    Uploaded Images ({filePreview.galleryImages.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filePreview.galleryImages.map((src, index) => (
                      <div
                        key={index}
                        className="relative group border rounded-md"
                      >
                        <img
                          src={src}
                          alt={`Preview ${index}`}
                          className="w-full h-24 object-cover rounded-t-md"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {index > 0 && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-white text-gray-700 hover:bg-green-100 hover:text-[#135341] hover:border-green-300"
                              onClick={() => moveGalleryImage(index, "up")}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => removeGalleryImage(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {index < filePreview.galleryImages.length - 1 && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-white text-gray-700 hover:bg-green-100 hover:text-[#135341] hover:border-green-300"
                              onClick={() => moveGalleryImage(index, "down")}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {!filePreview.primaryImage && index === 0 && (
                          <Badge className="absolute top-2 left-2 bg-[#135341]">
                            Primary
                          </Badge>
                        )}
                        <div className="px-2 py-1 text-xs text-gray-500 bg-gray-50 rounded-b-md">
                          Image {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-[#135341]" />
                <h3 className="text-lg font-medium">Video (Optional)</h3>
              </div>

              <Tabs defaultValue="link" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-lg p-1 bg-gray-100">
                  <TabsTrigger
                    value="link"
                    className="rounded-md data-[state=active]:bg-[#135341] data-[state=active]:text-white hover:bg-gray-200 data-[state=active]:hover:bg-[#135341]"
                  >
                    YouTube / Video Link
                  </TabsTrigger>
                  <TabsTrigger
                    value="file"
                    className="rounded-md data-[state=active]:bg-[#135341] data-[state=active]:text-white hover:bg-gray-200 data-[state=active]:hover:bg-[#135341]"
                  >
                    Upload Video File
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="link" className="mt-4">
                  <FormField
                    control={form.control}
                    name="videoLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Paste YouTube, Vimeo, or Google Drive link"
                              {...field}
                            />
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  type="button"
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="font-medium text-sm">
                                    Video Link Tips
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    For Google Drive links, make sure the
                                    file/folder is set to "Anyone with the link
                                    can view".
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    YouTube and Vimeo links will automatically
                                    embed on your listing page.
                                  </p>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Add a virtual tour or walkthrough video link
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="file" className="mt-4">
                  <Card className="border-dashed border-2 hover:border-[#135341] transition-colors">
                    <CardContent className="p-6 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Upload a video file or{" "}
                          <Label
                            htmlFor="video-upload"
                            className="text-[#135341] hover:underline cursor-pointer"
                          >
                            browse files
                          </Label>
                        </p>
                        <p className="text-xs text-gray-500">
                          MP4, MOV, or WebM up to 100MB
                        </p>
                        <Input
                          id="video-upload"
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              form.setValue("videoFile", file);
                            }
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  {formValues.videoFile && (
                    <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <Youtube className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-sm truncate max-w-xs">
                          {(formValues.videoFile as File).name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => form.setValue("videoFile", null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 py-4">
            {/* ARV Field */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#135341]" />
                <h3 className="text-lg font-medium">After Repair Value</h3>
              </div>

              <FormField
                control={form.control}
                name="arv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      After Repair Value (ARV) (optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 450000"
                        {...field}
                        onChange={(e) => {
                          // Format as currency
                          const value = e.target.value.replace(/[^0-9.]/g, "");
                          field.onChange(
                            value ? `$${parseInt(value).toLocaleString()}` : "",
                          );
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      The estimated value of the property after all repairs and
                      improvements
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#135341]" />
                <h3 className="text-lg font-medium">Rental Income</h3>
              </div>

              <FormField
                control={form.control}
                name="rentTotalMonthly"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Monthly Rent</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 2500"
                        {...field}
                        onChange={(e) => {
                          // Format as currency
                          const value = e.target.value.replace(/[^0-9.]/g, "");
                          field.onChange(
                            value ? `$${parseInt(value).toLocaleString()}` : "",
                          );
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the total monthly rental income for this property
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Unit Breakdown (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <h4 className="text-sm font-medium">Unit Breakdown</h4>
                    <Badge
                      variant="outline"
                      className="text-xs font-normal bg-green-50 text-green-700 border-green-200"
                    >
                      Recommended
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddUnit}
                    className="text-[#135341] border-gray-300 hover:bg-gray-100 hover:text-[#135341] transition-colors"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Unit
                  </Button>
                </div>

                {units.length > 0 ? (
                  <div className="space-y-3 mt-3">
                    {units.map((unit, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Label
                            className="text-xs"
                            htmlFor={`unit-label-${index}`}
                          >
                            Unit Label
                          </Label>
                          <Input
                            id={`unit-label-${index}`}
                            value={unit.label}
                            onChange={(e) =>
                              handleUpdateUnit(index, "label", e.target.value)
                            }
                            placeholder="e.g. Unit 1A"
                          />
                        </div>
                        <div className="flex-1">
                          <Label
                            className="text-xs"
                            htmlFor={`unit-rent-${index}`}
                          >
                            Monthly Rent
                          </Label>
                          <Input
                            id={`unit-rent-${index}`}
                            value={unit.rent}
                            onChange={(e) => {
                              // Format as currency
                              const value = e.target.value.replace(
                                /[^0-9.]/g,
                                "",
                              );
                              handleUpdateUnit(
                                index,
                                "rent",
                                value
                                  ? `$${parseInt(value).toLocaleString()}`
                                  : "",
                              );
                            }}
                            placeholder="e.g. $1,000"
                          />
                        </div>
                        <div className="w-32">
                          <Label
                            className="text-xs block"
                            htmlFor={`unit-occupied-${index}`}
                          >
                            Occupied
                          </Label>
                          <div className="flex items-center h-10 space-x-2">
                            <Switch
                              id={`unit-occupied-${index}`}
                              checked={unit.occupied}
                              onCheckedChange={(checked) =>
                                handleUpdateUnit(index, "occupied", checked)
                              }
                            />
                            <span className="text-sm text-gray-700">
                              {unit.occupied ? "Yes" : "No"}
                            </span>
                          </div>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveUnit(index)}
                                className="h-10 w-10 rounded-full hover:bg-gray-200 hover:text-gray-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Remove this item</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-md border border-dashed">
                    <p className="text-sm text-gray-500">
                      No units added yet. Add units for multi-family, duplexes,
                      or properties with multiple rental units.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-[#135341]" />
                <h3 className="text-lg font-medium">Expenses</h3>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Expense Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={expense.name}
                          onChange={(e) =>
                            handleUpdateExpense(index, "name", e.target.value)
                          }
                          placeholder="e.g. Property Tax"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={expense.amount}
                          onChange={(e) => {
                            // Format as currency
                            const value = e.target.value.replace(
                              /[^0-9.]/g,
                              "",
                            );
                            handleUpdateExpense(
                              index,
                              "amount",
                              value
                                ? `$${parseInt(value).toLocaleString()}`
                                : "",
                            );
                          }}
                          placeholder="e.g. $1,000"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={expense.frequency}
                          onValueChange={(value) =>
                            handleUpdateExpense(index, "frequency", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annually">Annually</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveExpense(index)}
                                className="h-8 w-8 rounded-full hover:bg-gray-200 hover:text-gray-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Remove this item</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddExpense}
                className="mt-2 hover:bg-gray-100 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Expense
              </Button>

              <div className="bg-blue-50 p-4 mt-4 rounded-md shadow-sm border border-blue-100">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-blue-800">
                      Monthly Total:
                    </h4>
                    <p className="text-blue-700 font-bold text-lg">
                      $
                      {calculateMonthlyExpenses().toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-blue-800">
                      Annual Total:
                    </h4>
                    <p className="text-blue-700 font-bold text-lg">
                      $
                      {calculateAnnualExpenses().toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-5 w-5 text-[#135341]" />
                <h3 className="text-lg font-medium">
                  Property Condition & Repairs
                </h3>
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
                          <SelectValue placeholder="Select property condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="excellent">
                          Excellent - Move-in Ready
                        </SelectItem>
                        <SelectItem value="good">
                          Good - Minor Repairs Needed
                        </SelectItem>
                        <SelectItem value="fair">
                          Fair - Moderate Repairs Needed
                        </SelectItem>
                        <SelectItem value="poor">
                          Poor - Major Renovation Required
                        </SelectItem>
                        <SelectItem value="teardown">
                          Teardown/Rebuild
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Accurately describe the condition to set buyer
                      expectations
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Repairs & Renovations</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddRepair}
                    className="text-[#135341] border-gray-300 hover:bg-gray-100 hover:text-[#135341] transition-colors"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Repair
                  </Button>
                </div>

                {repairs.length > 0 ? (
                  <div className="space-y-6 mt-4">
                    {repairs.map((repair, index) => (
                      <Card key={index} className="border-gray-200">
                        <CardContent className="p-4 space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <Label
                                className="text-xs"
                                htmlFor={`repair-name-${index}`}
                              >
                                Task Name
                              </Label>
                              <Input
                                id={`repair-name-${index}`}
                                value={repair.name}
                                onChange={(e) =>
                                  handleUpdateRepair(
                                    index,
                                    "name",
                                    e.target.value,
                                  )
                                }
                                placeholder="e.g. Roof Replacement"
                              />
                            </div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveRepair(index)}
                                    className="h-8 w-8 rounded-full hover:bg-gray-200 hover:text-gray-700 mt-6"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Remove this item</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>

                          <div>
                            <Label
                              className="text-xs"
                              htmlFor={`repair-description-${index}`}
                            >
                              Description
                            </Label>
                            <Textarea
                              id={`repair-description-${index}`}
                              value={repair.description}
                              onChange={(e) =>
                                handleUpdateRepair(
                                  index,
                                  "description",
                                  e.target.value,
                                )
                              }
                              placeholder="Describe the needed repairs"
                              rows={2}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label
                                className="text-xs"
                                htmlFor={`repair-cost-${index}`}
                              >
                                Estimated Cost
                              </Label>
                              <Input
                                id={`repair-cost-${index}`}
                                value={repair.cost}
                                onChange={(e) => {
                                  // Format as currency
                                  const value = e.target.value.replace(
                                    /[^0-9.]/g,
                                    "",
                                  );
                                  handleUpdateRepair(
                                    index,
                                    "cost",
                                    value
                                      ? `$${parseInt(value).toLocaleString()}`
                                      : "",
                                  );
                                }}
                                placeholder="e.g. $5,000"
                              />
                            </div>

                            <div>
                              <Label className="text-xs">
                                Contractor Quote (Optional)
                              </Label>
                              {filePreview.repairQuotes[index] ? (
                                <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md h-10 mt-[2px]">
                                  <div className="flex items-center">
                                    <FileText className="h-4 w-4 text-blue-500 mr-2" />
                                    <span className="text-sm truncate max-w-[150px]">
                                      {filePreview.repairQuotes[index]}
                                    </span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      handleUpdateRepair(index, "quote", null);
                                      const updatedQuotes = {
                                        ...filePreview.repairQuotes,
                                      };
                                      delete updatedQuotes[index];
                                      setFilePreview((prev) => ({
                                        ...prev,
                                        repairQuotes: updatedQuotes,
                                      }));
                                    }}
                                    className="h-6 w-6"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="relative h-10 mt-[2px]">
                                  <Input
                                    id={`repair-quote-${index}`}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleUpdateRepair(
                                          index,
                                          "quote",
                                          file,
                                        );
                                      }
                                    }}
                                  />
                                  <div className="h-full flex items-center justify-center border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition-colors text-sm text-gray-700">
                                    <Upload className="h-4 w-4 mr-2 text-gray-600" />
                                    Upload Quote
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <Label
                              className="text-xs"
                              htmlFor={`repair-contractor-${index}`}
                            >
                              Contractor (Optional)
                            </Label>
                            <Input
                              id={`repair-contractor-${index}`}
                              value={repair.contractor}
                              onChange={(e) =>
                                handleUpdateRepair(
                                  index,
                                  "contractor",
                                  e.target.value,
                                )
                              }
                              placeholder="Search or enter contractor name"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <div className="bg-red-50 p-4 rounded-md shadow-sm border border-red-100">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-semibold text-red-800">
                          Total Repair Costs:
                        </h4>
                        <p className="text-red-700 font-bold text-lg">
                          $
                          {calculateTotalRepairs().toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-md border border-dashed">
                    <p className="text-sm text-gray-500">
                      No repairs added yet. Add repairs to help buyers
                      understand renovation costs.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#135341]" />
                <h3 className="text-lg font-medium">Deal Terms</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="purchasePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 200000"
                          {...field}
                          onChange={(e) => {
                            // Format as currency
                            const value = e.target.value.replace(
                              /[^0-9.]/g,
                              "",
                            );
                            field.onChange(
                              value
                                ? `$${parseInt(value).toLocaleString()}`
                                : "",
                            );
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Buyers will not see your purchase price - this is used
                        to calculate your assignment fee
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="listingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Listing Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 225000"
                          {...field}
                          onChange={(e) => {
                            // Format as currency
                            const value = e.target.value.replace(
                              /[^0-9.]/g,
                              "",
                            );
                            field.onChange(
                              value
                                ? `$${parseInt(value).toLocaleString()}`
                                : "",
                            );
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
                      <FormLabel>Assignment Fee (Auto-calculated)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Calculated"
                          {...field}
                          readOnly
                          className="bg-gray-50"
                        />
                      </FormControl>
                      <FormDescription>
                        Listing Price - Purchase Price
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="accessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="How can buyers access the property?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="lockbox">
                            Lockbox (Code Provided)
                          </SelectItem>
                          <SelectItem value="appointment">
                            By Appointment Only
                          </SelectItem>
                          <SelectItem value="drive-by">
                            Drive By Only
                          </SelectItem>
                          <SelectItem value="occupied">
                            Occupied (24h Notice)
                          </SelectItem>
                          <SelectItem value="contact">
                            Contact for Details
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="closingDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Closing Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`w-full pl-3 text-left font-normal hover:bg-gray-200 hover:text-gray-800 ${!field.value ? "text-muted-foreground" : ""} ${field.value ? "bg-[#135341]/10 border-[#135341]/30 text-[#135341]" : ""}`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="rounded-md border"
                            classNames={{
                              day_selected:
                                "bg-[#135341] text-white hover:bg-[#135341] focus:bg-[#135341] rounded-full h-9 w-9 p-0 flex items-center justify-center !bg-[#135341]",
                              day_today: "bg-gray-100 text-gray-900",
                              day_range_middle: "bg-gray-100 text-gray-900",
                              day_range_end:
                                "bg-[#135341] text-white rounded-full h-9 w-9 p-0 flex items-center justify-center",
                              day_range_start:
                                "bg-[#135341] text-white rounded-full h-9 w-9 p-0 flex items-center justify-center",
                              day: "hover:bg-gray-200 hover:text-gray-800 rounded-full transition-colors h-9 w-9 p-0 mx-0.5 flex items-center justify-center",
                              cell: "[&:has([aria-selected])]:bg-transparent",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Expected closing date (if known)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator />
            {/* Comparable Properties Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-[#135341]" />
                <h3 className="text-lg font-medium">
                  Comparable Properties (Comps)
                </h3>
              </div>

              <div className="space-y-3">
                {(formValues.comps || []).map((comp: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`comps.${index}` as any}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="e.g. 123 Main St, Milwaukee, WI"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const currentComps = form.getValues("comps") || [];
                        const newComps = currentComps.filter(
                          (_: any, i: number) => i !== index,
                        );
                        form.setValue("comps", newComps);
                      }}
                      className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 hover:scale-110 bg-[#f5f5f5]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const currentComps = form.getValues("comps") || [];
                    form.setValue("comps", [...currentComps, ""]);
                  }}
                  className="w-full border-dashed hover:bg-gray-100 hover:text-gray-800 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Comparable Property
                </Button>

                <FormDescription>
                  Add addresses of similar properties sold recently in the area
                  (optional)
                </FormDescription>
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#135341]" />
                <h3 className="text-lg font-medium">Documentation</h3>
              </div>

              <FormField
                control={form.control}
                name="purchaseAgreement"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>
                      Purchase Agreement{" "}
                      {!saveAsDraft && <span className="text-red-500">*</span>}
                    </FormLabel>
                    {filePreview.purchaseAgreement ? (
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-500 mr-2" />
                          <span className="font-medium text-sm">
                            {filePreview.purchaseAgreement}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFilePreview((prev) => ({
                              ...prev,
                              purchaseAgreement: null,
                            }));
                            onChange(null);
                          }}
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <FormControl>
                        <div
                          className="relative"
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget
                              .querySelector(".upload-dropzone")
                              ?.classList.add(
                                "ring-2",
                                "ring-[#135341]",
                                "bg-[#135341]/5",
                              );
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget
                              .querySelector(".upload-dropzone")
                              ?.classList.remove(
                                "ring-2",
                                "ring-[#135341]",
                                "bg-[#135341]/5",
                              );
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget
                              .querySelector(".upload-dropzone")
                              ?.classList.remove(
                                "ring-2",
                                "ring-[#135341]",
                                "bg-[#135341]/5",
                              );
                            handlePurchaseAgreementUpload({
                              dataTransfer: e.dataTransfer,
                            });
                          }}
                        >
                          <Card className="border-dashed border-2 hover:border-[#135341] transition-colors upload-dropzone focus-within:ring-2 focus-within:ring-[#135341]">
                            <CardContent className="p-6 text-center">
                              <Label
                                htmlFor="purchase-agreement-upload"
                                className="flex flex-col items-center justify-center gap-2 cursor-pointer w-full h-full"
                              >
                                <Upload className="h-8 w-8 text-gray-400" />
                                <p className="text-sm text-gray-600">
                                  Drag & drop your agreement or browse files
                                </p>
                                <p className="text-xs text-gray-500">
                                  PDF, DOC, or DOCX up to 10MB
                                </p>
                                <Input
                                  id="purchase-agreement-upload"
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  className="hidden"
                                  onChange={handlePurchaseAgreementUpload}
                                  {...field}
                                />
                              </Label>
                            </CardContent>
                          </Card>
                        </div>
                      </FormControl>
                    )}
                    <FormDescription>
                      {saveAsDraft
                        ? "You can upload this later, but it's required before publishing."
                        : "Required for all published listings"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#135341]" />
                <h3 className="text-lg font-medium">Partners & Notes</h3>
              </div>

              <div>
                <Label>Deal Partners (Optional)</Label>
                <div className="flex flex-wrap gap-2 mt-1 mb-2">
                  {partners.map((partner, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {partner}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePartner(index)}
                        className="h-4 w-4 ml-1 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  {partners.length === 0 && (
                    <span className="text-sm text-gray-500">
                      No partners added yet
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter partner name"
                    id="partner-input"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const input = e.currentTarget;
                        handleAddPartner(input.value);
                        input.value = "";
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="hover:bg-gray-200 hover:text-gray-800 transition-colors border-gray-300"
                    onClick={() => {
                      const input = document.getElementById(
                        "partner-input",
                      ) as HTMLInputElement;
                      if (input.value) {
                        handleAddPartner(input.value);
                        input.value = "";
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Add JV partners or other stakeholders in this deal
                </p>
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Special conditions, instructions for buyers, or other important details..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This information will be shown to potential buyers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#135341]" />
                <h3 className="text-lg font-medium">
                  AI-Generated Description
                </h3>
              </div>

              <div className="flex gap-4 items-center justify-between">
                <div className="space-y-2 flex-1">
                  <Label>Tone</Label>
                  <Select
                    value={formValues.descriptionTone}
                    onValueChange={(value) => {
                      form.setValue("descriptionTone", value);
                      // Regenerate if description already exists
                      if (isDescriptionGenerated) {
                        generateAIDescription();
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="motivated">
                        Motivated Seller
                      </SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 flex-1">
                  <Label>Type</Label>
                  <Select
                    value={formValues.descriptionType}
                    onValueChange={(value) => {
                      form.setValue("descriptionType", value);
                      // Regenerate if description already exists
                      if (isDescriptionGenerated) {
                        generateAIDescription();
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Listing</SelectItem>
                      <SelectItem value="investor">Investor Focused</SelectItem>
                      <SelectItem value="endbuyer">
                        End Buyer Friendly
                      </SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="mt-6 rounded-md hover:bg-gray-200 hover:text-gray-800 transition-colors border-gray-300"
                  onClick={generateAIDescription}
                  disabled={isGeneratingDescription}
                >
                  {isGeneratingDescription ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </>
                  )}
                </Button>
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[200px] font-medium"
                        placeholder={
                          isGeneratingDescription
                            ? "Generating description..."
                            : "AI-generated description will appear here"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      You can edit this description or regenerate with different
                      settings
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#135341]" />
                <h3 className="text-lg font-medium">Property Summary</h3>
              </div>

              {/* Property Details Section */}
              <div className="border rounded-lg p-3 bg-white shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-semibold flex items-center text-[#135341]">
                    <Home className="h-4 w-4 mr-1" />
                    Property Details
                  </h4>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-full hover:bg-gray-200 hover:text-gray-800"
                    onClick={() => setStepAndScrollToTop(1)}
                  >
                    <Pencil className="h-4 w-4 text-gray-500" />
                    <span className="sr-only">Edit property details</span>
                  </Button>
                </div>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Property Type:</span>
                    <span className="font-medium">
                      {formValues.propertyType === "single-family"
                        ? "Single Family"
                        : formValues.propertyType === "multi-family"
                          ? "Multi-Family"
                          : formValues.propertyType === "duplex"
                            ? "Duplex"
                            : formValues.propertyType === "townhouse"
                              ? "Townhouse"
                              : formValues.propertyType === "condo"
                                ? "Condo"
                                : formValues.propertyType === "land"
                                  ? "Vacant Land"
                                  : formValues.propertyType === "commercial"
                                    ? "Commercial"
                                    : formValues.propertyType ||
                                      "Not specified"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium">{formValues.address}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">City, State:</span>
                    <span className="font-medium">
                      {formValues.city}, {formValues.state} {formValues.zipCode}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Bedrooms:</span>
                    <span className="font-medium">{formValues.bedrooms}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Bathrooms:</span>
                    <span className="font-medium">{formValues.bathrooms}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Square Footage:</span>
                    <span className="font-medium">{formValues.sqft}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Year Built:</span>
                    <span className="font-medium">
                      {formValues.yearBuilt || "Not specified"}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Financial Details Section */}
              <div className="border rounded-lg p-3 bg-white shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-semibold flex items-center text-[#135341]">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Financial Details
                  </h4>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-full hover:bg-gray-200 hover:text-gray-800"
                    onClick={() => setStepAndScrollToTop(3)}
                  >
                    <Pencil className="h-4 w-4 text-gray-500" />
                    <span className="sr-only">Edit financial details</span>
                  </Button>
                </div>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Purchase Price:</span>
                    <span className="font-medium">
                      {formValues.purchasePrice || "Not specified"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Listing Price:</span>
                    <span className="font-medium">
                      {formValues.listingPrice || "Not specified"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Assignment Fee:</span>
                    <span className="font-medium">
                      {formValues.assignmentFee || "Not calculated"}
                    </span>
                  </li>
                  {formValues.rentTotalMonthly && (
                    <li className="flex justify-between">
                      <span className="text-gray-600">Monthly Rent:</span>
                      <span className="font-medium">
                        {formValues.rentTotalMonthly}
                      </span>
                    </li>
                  )}
                  {calculateMonthlyExpenses() > 0 && (
                    <li className="flex justify-between">
                      <span className="text-gray-600">Monthly Expenses:</span>
                      <span className="font-medium">
                        ${calculateMonthlyExpenses().toLocaleString()}
                      </span>
                    </li>
                  )}
                  {calculateTotalRepairs() > 0 && (
                    <li className="flex justify-between">
                      <span className="text-gray-600">Est. Repair Costs:</span>
                      <span className="font-medium">
                        ${calculateTotalRepairs().toLocaleString()}
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Deal Information Section */}
              <div className="border rounded-lg p-3 bg-white shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-semibold flex items-center text-[#135341]">
                    <PieChart className="h-4 w-4 mr-1" />
                    Deal Information
                  </h4>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-full hover:bg-gray-200 hover:text-gray-800"
                    onClick={() => setStepAndScrollToTop(4)}
                  >
                    <Pencil className="h-4 w-4 text-gray-500" />
                    <span className="sr-only">Edit deal information</span>
                  </Button>
                </div>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Property Condition:</span>
                    <span className="font-medium">
                      {formValues.condition === "excellent"
                        ? "Excellent"
                        : formValues.condition === "good"
                          ? "Good"
                          : formValues.condition === "fair"
                            ? "Fair"
                            : formValues.condition === "poor"
                              ? "Poor"
                              : formValues.condition === "teardown"
                                ? "Teardown"
                                : formValues.condition || "Not specified"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Access Type:</span>
                    <span className="font-medium">
                      {formValues.accessType === "lockbox"
                        ? "Lockbox (Code Provided)"
                        : formValues.accessType === "appointment"
                          ? "By Appointment Only"
                          : formValues.accessType === "drive-by"
                            ? "Drive By Only"
                            : formValues.accessType === "occupied"
                              ? "Occupied (24h Notice)"
                              : formValues.accessType === "contact"
                                ? "Contact for Details"
                                : formValues.accessType || "Not specified"}
                    </span>
                  </li>
                  {formValues.closingDate && (
                    <li className="flex justify-between">
                      <span className="text-gray-600">Closing Date:</span>
                      <span className="font-medium">
                        {format(formValues.closingDate, "PP")}
                      </span>
                    </li>
                  )}
                  {filePreview.purchaseAgreement && (
                    <li className="flex justify-between">
                      <span className="text-gray-600">Purchase Agreement:</span>
                      <span className="font-medium text-blue-600">
                        Uploaded
                      </span>
                    </li>
                  )}
                  {partners.length > 0 && (
                    <li className="flex justify-between">
                      <span className="text-gray-600">Partners:</span>
                      <span className="font-medium">
                        {partners.length} added
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Media Uploads Section */}
              <div className="border rounded-lg p-3 bg-white shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-semibold flex items-center text-[#135341]">
                    <ImageIcon className="h-4 w-4 mr-1" />
                    Media Uploads
                  </h4>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-full hover:bg-gray-200 hover:text-gray-800"
                    onClick={() => setStepAndScrollToTop(2)}
                  >
                    <Pencil className="h-4 w-4 text-gray-500" />
                    <span className="sr-only">Edit media uploads</span>
                  </Button>
                </div>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Primary Image:</span>
                    <span className="font-medium">
                      {filePreview.primaryImage ? "Uploaded" : "None"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Gallery Images:</span>
                    <span className="font-medium">
                      {filePreview.galleryImages.length} uploaded
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Video:</span>
                    <span className="font-medium">
                      {formValues.videoLink
                        ? "Link added"
                        : formValues.videoFile
                          ? "Added"
                          : "None"}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Purchase Agreement Warning */}
              {!saveAsDraft && !filePreview.purchaseAgreement && (
                <div className="bg-amber-50 p-4 rounded-md border border-amber-200 shadow-sm">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-amber-800">
                        Purchase Agreement Required
                      </h3>
                      <div className="mt-1 text-sm text-amber-700">
                        <p>
                          You must upload a purchase agreement before publishing
                          this listing.
                        </p>
                      </div>
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setStepAndScrollToTop(4)}
                          className="border-amber-300 bg-amber-100/50 text-amber-800 hover:bg-amber-100"
                        >
                          Upload Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Create a ref to monitor Google Places Autocomplete interactions
  const dialogContentRef = useRef<HTMLDivElement>(null);

  // Set up global event handlers to prevent Google Places Autocomplete selections from closing modal
  useEffect(() => {
    // Function to prevent modal close when clicking on Google Places Autocomplete elements
    const handlePacContainerEvents = (event: MouseEvent) => {
      // Check if the click is from Google Places dropdown or within it
      const pacContainer = document.querySelector(".pac-container");
      if (
        pacContainer &&
        (pacContainer.contains(event.target as Node) ||
          (event.target as HTMLElement).closest(".pac-container") ||
          (event.target as HTMLElement).classList.contains("pac-item"))
      ) {
        // Stop propagation to prevent the modal from closing
        event.stopPropagation();

        // Cancel any default behavior
        event.preventDefault();

        // Prevent event from reaching dialog close handlers
        event.stopImmediatePropagation();
        return false;
      }
    };

    // Add capturing phase event listeners to catch events before they bubble
    document.addEventListener("mousedown", handlePacContainerEvents, true);
    document.addEventListener("click", handlePacContainerEvents, true);
    document.addEventListener("mouseup", handlePacContainerEvents, true);

    return () => {
      document.removeEventListener("mousedown", handlePacContainerEvents, true);
      document.removeEventListener("click", handlePacContainerEvents, true);
      document.removeEventListener("mouseup", handlePacContainerEvents, true);
    };
  }, []);

  // Custom handler for dialog open state to prevent auto-closing
  const handleDialogChange = (open: boolean) => {
    // Prevent auto-closing unless user explicitly closes
    if (!open && !isUserClosing) return;

    // If trying to close and currently interacting with autocomplete, prevent closing
    if (!open && document.querySelector(".pac-container")) {
      const pacContainer = document.querySelector(".pac-container");
      if (
        pacContainer &&
        window.getComputedStyle(pacContainer).display !== "none"
      ) {
        // Don't close the modal if autocomplete is active
        return;
      }
    }

    // Check for data attribute that indicates autocomplete is active
    if (!open && document.documentElement.hasAttribute("data-places-active")) {
      // Don't close if we're interacting with the autocomplete
      return;
    }

    // Otherwise proceed with normal close behavior
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent
        className="sm:max-w-[700px] max-w-[90vw] max-h-[85vh] sm:max-h-[90vh] p-0 bg-[#f5f5f5] flex flex-col gap-0"
        ref={dialogContentRef}
      >
        {/* Fixed header with progress steps */}
        <div className="sticky top-0 bg-[#f5f5f5] z-20 border-b shadow-sm pt-[0px] pb-[0px]">
          <div className="px-6 pt-[10px] pb-[10px] pl-[12px] pr-[12px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-[#135341]">
                {step === 1 && "Step 1: Property Information"}
                {step === 2 && "Step 2: Property Media"}
                {step === 3 && "Step 3: Property Financials"}
                {step === 4 && "Step 4: Listing Logistics"}
                {step === 5 && "Step 5: Description & Final Review"}
              </DialogTitle>
            </DialogHeader>

            {/* Progress steps - clickable */}
            <div className="mt-4 px-1">
              <div className="relative">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#135341]"
                    style={{ width: `${(step / 5) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
                  <div
                    className="flex flex-col items-center cursor-pointer hover:text-[#135341] transition-colors"
                    onClick={() => setStepAndScrollToTop(1)}
                  >
                    {getStepIcon(1)}
                    <span className="mt-1">Info</span>
                  </div>
                  <div
                    className="flex flex-col items-center cursor-pointer hover:text-[#135341] transition-colors"
                    onClick={() => setStepAndScrollToTop(2)}
                  >
                    {getStepIcon(2)}
                    <span className="mt-1">Media</span>
                  </div>
                  <div
                    className="flex flex-col items-center cursor-pointer hover:text-[#135341] transition-colors"
                    onClick={() => setStepAndScrollToTop(3)}
                  >
                    {getStepIcon(3)}
                    <span className="mt-1">Finance</span>
                  </div>
                  <div
                    className="flex flex-col items-center cursor-pointer hover:text-[#135341] transition-colors"
                    onClick={() => setStepAndScrollToTop(4)}
                  >
                    {getStepIcon(4)}
                    <span className="mt-1">Logistics</span>
                  </div>
                  <div
                    className="flex flex-col items-center cursor-pointer hover:text-[#135341] transition-colors"
                    onClick={() => setStepAndScrollToTop(5)}
                  >
                    {getStepIcon(5)}
                    <span className="mt-1">Review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable content area - takes up all available space */}
        <div
          className="overflow-y-auto flex-1 px-6 py-4 modal-content-area"
          ref={contentAreaRef}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {renderStepContent()}
            </form>
          </Form>
        </div>

        {/* Fixed footer with alert and navigation buttons */}
        <div className="mt-auto border-t bg-[#f5f5f5] shadow-[0_-2px_4px_rgba(0,0,0,0.05)] z-20">
          {/* Condensed alert for missing fields */}
          {!isStepValid() && !saveAsDraft && (
            <div className="px-6 pt-[4px] pb-[4px]">
              <div className="flex items-center justify-between px-3 py-2 bg-amber-50 border border-amber-200 rounded-md text-sm">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mr-2" />
                  <p className="font-medium text-amber-800">
                    Some required fields are missing. This listing will be saved
                    as a draft.
                  </p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help">
                        <HelpCircle className="h-4 w-4 text-amber-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">
                        To publish, required fields must be completed. You can
                        finish later.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}

          <div className="px-6 py-4 pt-[10px] pb-[10px] pl-[24px] pr-[24px]">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={saveAsDraft}
                  onCheckedChange={handleSaveAsDraftToggle}
                  id="draft-mode"
                />
                <div className="space-y-0.5">
                  <Label htmlFor="draft-mode" className="cursor-pointer">
                    Save as Draft
                  </Label>
                  {isSaving && (
                    <p className="text-xs text-blue-600 flex items-center">
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Saving...
                    </p>
                  )}
                  {lastSaved && !isSaving && (
                    <p className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Last saved {format(lastSaved, "h:mm a")}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="hover:bg-gray-200 hover:text-gray-800 transition-colors border-gray-300"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setIsUserClosing(true); onClose(); }}
                    className="hover:bg-gray-200 hover:text-gray-800 transition-colors border-gray-300"
                  >
                    Cancel
                  </Button>
                )}

                {step < 5 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-[#135341] hover:bg-[#09261E]"
                  >
                    Continue
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isPublishing}
                    className="bg-[#135341] hover:bg-[#09261E] disabled:opacity-50"
                  >
                    {isPublishing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        {saveAsDraft ? "Saving..." : "Publishing..."}
                      </>
                    ) : (
                      <>
                        {saveAsDraft ? "Save Draft" : "Publish Listing"}
                        <Save className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
