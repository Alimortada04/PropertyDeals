import React, { useState, useEffect, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Save,
  Eye,
  ExternalLink,
  Home,
  Building,
  DollarSign,
  FileText,
  Image as ImageIcon,
  MapPin,
  Upload,
  Bed,
  ArrowUp,
  ArrowDown,
  Trash2,
  Bath,
  Square,
  Calendar,
  Plus,
  X,
  Car,
  Star,
  TrendingUp,
  Bookmark,
  Tag,
  Clock,
  Zap,
  Megaphone,
  Handshake,
  Users,
  Youtube,
  Sparkles,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { QuickActionSelector } from "@/components/seller/quick-action-selector";
import { EnhancedPropertyListingModal } from "@/components/property/enhanced-property-listing-modal";
import { MarketingCenterModal } from "@/components/seller/marketing-center-modal";
import {
  EnhancedDatePicker,
  ClosingDateField,
} from "@/components/ui/enhanced-date-picker";

const resolvePublicUrl = (path: string | null): string | null => {
  if (!path || typeof path !== "string") return null;
  return supabase.storage.from("properties").getPublicUrl(path).data.publicUrl;
};

// Property form schema matching the EnhancedPropertyListingModal
const propertySchema = z.object({
  // Step 1: Property Overview
  name: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
  county: z.string().optional(),
  parcel_id: z.string().optional(),
  property_type: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  sqft: z.string().optional(),
  year_built: z.string().optional(),
  lotSize: z.string().optional(),
  parking: z.string().optional(),

  // Step 2: Media
  primaryImage: z.any().optional(),
  galleryImages: z.array(z.any()).optional(),
  videoWalkthrough: z.string().optional(),

  // Step 3: Financial Snapshot
  arv: z.string().optional(),
  rentTotalMonthly: z.string().optional(),
  purchasePrice: z.string().optional(),
  listingPrice: z.string().optional(),
  assignmentFee: z.string().optional(),

  // Step 4: Access & Logistics
  accessType: z.string().optional(),
  closingDate: z.any().optional(),
  purchaseAgreement: z.any().optional(),

  // Step 5: Descriptions
  description: z.string().optional(),
  additionalNotes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featuredProperty: z.boolean().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
      isActive ? "bg-green-700 text-white" : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export default function PropertyEditor() {
  const [, params] = useRoute("/sellerdash/:userId/property/:propertyId");
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [property, setProperty] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // State matching EnhancedPropertyListingModal
  const [expenses, setExpenses] = useState<
    { name: string; amount: string; frequency: string }[]
  >([
    { name: "Property Tax", amount: "", frequency: "annually" },
    { name: "Insurance", amount: "", frequency: "annually" },
    { name: "Utilities", amount: "", frequency: "monthly" },
  ]);
  const [repairs, setRepairs] = useState<
    { name: string; description: string; cost: string; contractor: string }[]
  >([]);
  const [units, setUnits] = useState<
    { label: string; rent: string; occupied: boolean }[]
  >([]);
  const [comps, setComps] = useState<string[]>([""]);
  const [partners, setPartners] = useState<string[]>([]);
  const [newPartner, setNewPartner] = useState("");
  const [newTag, setNewTag] = useState("");
  const [videoMode, setVideoMode] = useState<"link" | "upload">("link");

  // Modal states
  const [showListingModal, setShowListingModal] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<{
    primaryImage: File | null;
    galleryImages: File[];
    videoFile: File | null;
    purchaseAgreement: File | null;
    contractorQuotes: File[];
  }>({
    primaryImage: null,
    galleryImages: [],
    videoFile: null,
    purchaseAgreement: null,
    contractorQuotes: [],
  });

  // File upload handlers
  const handleFileUpload = (
    files: FileList | null,
    type:
      | "primaryImage"
      | "galleryImages"
      | "videoFile"
      | "purchaseAgreement"
      | "contractorQuotes",
  ) => {
    if (!files) return;

    const fileArray = Array.from(files);

    if (type === "primaryImage" && fileArray.length > 0) {
      setUploadedFiles((prev) => ({ ...prev, primaryImage: fileArray[0] }));
    } else if (type === "galleryImages") {
      setUploadedFiles((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...fileArray],
      }));
    } else if (type === "videoFile" && fileArray.length > 0) {
      setUploadedFiles((prev) => ({ ...prev, videoFile: fileArray[0] }));
    } else if (type === "purchaseAgreement" && fileArray.length > 0) {
      setUploadedFiles((prev) => ({
        ...prev,
        purchaseAgreement: fileArray[0],
      }));
    } else if (type === "contractorQuotes") {
      setUploadedFiles((prev) => ({
        ...prev,
        contractorQuotes: [...prev.contractorQuotes, ...fileArray],
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (
    e: React.DragEvent,
    type:
      | "primaryImage"
      | "galleryImages"
      | "videoFile"
      | "purchaseAgreement"
      | "contractorQuotes",
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    handleFileUpload(files, type);
  };

  const removeFile = (
    type:
      | "primaryImage"
      | "galleryImages"
      | "videoFile"
      | "purchaseAgreement"
      | "contractorQuotes",
    index?: number,
  ) => {
    if (type === "primaryImage") {
      setUploadedFiles((prev) => ({ ...prev, primaryImage: null }));
    } else if (type === "galleryImages" && typeof index === "number") {
      setUploadedFiles((prev) => ({
        ...prev,
        galleryImages: prev.galleryImages.filter((_, i) => i !== index),
      }));
    } else if (type === "videoFile") {
      setUploadedFiles((prev) => ({ ...prev, videoFile: null }));
    } else if (type === "purchaseAgreement") {
      setUploadedFiles((prev) => ({ ...prev, purchaseAgreement: null }));
    } else if (type === "contractorQuotes" && typeof index === "number") {
      setUploadedFiles((prev) => ({
        ...prev,
        contractorQuotes: prev.contractorQuotes.filter((_, i) => i !== index),
      }));
    }
  };

  // Live calculations
  const calculateAssignmentFee = () => {
    const listing = parseFloat(
      form.watch("listingPrice")?.replace(/[$,]/g, "") || "0",
    );
    const purchase = parseFloat(
      form.watch("purchasePrice")?.replace(/[$,]/g, "") || "0",
    );
    const fee = listing - purchase;
    return fee > 0 ? fee.toFixed(0) : "";
  };

  const calculateRepairTotal = () => {
    return repairs.reduce((total, repair) => {
      const cost = parseFloat(repair.cost?.replace(/[$,]/g, "") || "0");
      return total + cost;
    }, 0);
  };

  const calculateExpenseTotal = (frequency: "monthly" | "annually") => {
    return expenses.reduce((total, expense) => {
      const amount = parseFloat(expense.amount?.replace(/[$,]/g, "") || "0");
      if (frequency === "monthly") {
        switch (expense.frequency) {
          case "monthly":
            return total + amount;
          case "quarterly":
            return total + amount / 3;
          case "annually":
            return total + amount / 12;
          default:
            return total;
        }
      } else {
        switch (expense.frequency) {
          case "monthly":
            return total + amount * 12;
          case "quarterly":
            return total + amount * 4;
          case "annually":
            return total + amount;
          default:
            return total;
        }
      }
    }, 0);
  };

  const userId = params?.userId;
  const propertyId = params?.propertyId;

  // Resolve gallery images from database storage paths to public URLs
  const resolvedGalleryImages = useMemo(() => {
    return Array.isArray(property?.gallery_images)
      ? property.gallery_images
          .map((path) => resolvePublicUrl(path))
          .filter((url) => url)
      : [];
  }, [property?.gallery_images]);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      county: "",
      parcelId: "",
      propertyType: "",
      bedrooms: "",
      bathrooms: "",
      sqft: "",
      yearBuilt: "",
      lotSize: "",
      parking: "",
      arv: "",
      rentTotalMonthly: "",
      purchasePrice: "",
      listingPrice: "",
      assignmentFee: "",
      accessType: "",
      description: "",
      additionalNotes: "",
      tags: [],
      featuredProperty: false,
    },
  });

  useEffect(() => {
    const fetchUserAndProperty = async () => {
      try {
        setLoading(true);

        // Get current user
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();
        setUser(currentUser);

        if (!currentUser) {
          setError("Please log in to edit properties");
          setLoading(false);
          return;
        }

        // Fetch property data
        const { data: propertyData, error: propertyError } = await supabase
          .from("property_profile")
          .select("*")
          .eq("id", propertyId)
          .eq("seller_id", currentUser.id)
          .single();

        if (propertyError || !propertyData) {
          setError(
            "Property not found or you don't have permission to edit it",
          );
          setLoading(false);
          return;
        }

        setProperty(propertyData);

        // Populate form with property data using correct field names from database
        form.reset({
          name: propertyData.name || "",
          address: propertyData.address || "",
          city: propertyData.city || "",
          state: propertyData.state || "",
          zipCode: propertyData.zipcode || "",
          county: propertyData.county || "",
          parcelId: propertyData.parcel_id || "",
          propertyType: propertyData.property_type || "",
          bedrooms: propertyData.bedrooms
            ? propertyData.bedrooms.toString()
            : "",
          bathrooms: propertyData.bathrooms
            ? propertyData.bathrooms.toString()
            : "",
          sqft: propertyData.sqft ? propertyData.sqft.toString() : "",
          yearBuilt: propertyData.year_built
            ? propertyData.year_built.toString()
            : "",
          lotSize: propertyData.lot_size || "",
          parking: propertyData.parking || "",
          arv: propertyData.arv ? propertyData.arv.toString() : "",
          rentTotalMonthly: propertyData.rent_total_monthly
            ? propertyData.rent_total_monthly.toString()
            : "",
          purchasePrice: propertyData.purchase_price
            ? propertyData.purchase_price.toString()
            : "",
          listingPrice: propertyData.listing_price
            ? propertyData.listing_price.toString()
            : "",
          assignmentFee: propertyData.assignment_fee
            ? propertyData.assignment_fee.toString()
            : "",
          accessType: propertyData.access_type || "",
          description: propertyData.description || "",
          additionalNotes: propertyData.additional_notes || "",
          tags: Array.isArray(propertyData.tags) ? propertyData.tags : [],
          featuredProperty: propertyData.featured_property || false,
          // Media fields
          primaryImage: propertyData.primary_image || "",
          galleryImages: propertyData.gallery_images || [],
          videoWalkthrough: propertyData.video_walkthrough || "",
        });

        // Set expenses from property data
        if (
          propertyData.expense_items &&
          propertyData.expense_items.length > 0
        ) {
          setExpenses(propertyData.expense_items);
        }

        // Set repair projects from property data
        if (propertyData.repairs && propertyData.repairs.length > 0) {
          setRepairs(propertyData.repair_projects);
        }

        // Set rent units from property data
        if (propertyData.rent_unit && propertyData.rent_unit.length > 0) {
          setUnits(propertyData.rent_unit);
        }

        // Set comparable properties from property data
        if (
          propertyData.comps &&
          Array.isArray(propertyData.comps) &&
          propertyData.comps.length > 0
        ) {
          setComps(propertyData.comps);
        } else {
          setComps([""]);
        }

        // Set JV partners from property data
        if (
          propertyData.jv_partners &&
          Array.isArray(propertyData.jv_partners) &&
          propertyData.jv_partners.length > 0
        ) {
          setPartners(propertyData.jv_partners);
        } else {
          setPartners([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching property:", error);
        setError("Failed to load property data");
        setLoading(false);
      }
    };

    if (propertyId && userId) {
      fetchUserAndProperty();
    }
  }, [propertyId, userId, form]);

  const handleSave = async (data: PropertyFormData) => {
    if (!user || !property) return;

    try {
      setSaving(true);

      const updateData = {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        zipcode: data.zipcode, // ✅ FIXED
        county: data.county,
        parcel_id: data.parcel_id,
        property_type: data.property_type,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
        bathrooms: data.bathrooms ? parseFloat(data.bathrooms) : null,
        sqft: data.sqft ? parseInt(data.sqft) : null,
        year_built: data.year_built ? parseInt(data.year_built) : null,
        lot_size: data.lot_size,
        parking: data.parking,
        arv: data.arv ? parseFloat(data.arv.replace(/[$,]/g, "")) : null,
        rent_total_monthly: data.rent_total_monthly
          ? parseFloat(data.rent_total_monthly.replace(/[$,]/g, ""))
          : null,
        purchase_price: data.purchase_price
          ? parseFloat(data.purchase_price.replace(/[$,]/g, ""))
          : null,
        listing_price: data.listing_price
          ? parseFloat(data.listing_price.replace(/[$,]/g, ""))
          : null,
        assignment_fee: calculateAssignmentFee()
          ? parseFloat(calculateAssignmentFee())
          : null,
        access_type: data.access_type, // ✅ FIXED
        description: data.description,
        additional_notes: data.additional_notes, // ✅ FIXED
        tags: data.tags || [],
        featured_property: data.featured_property || false,
        expense_items: expenses,
        repairs: repairs,
        rent_unit: units,
        comps: comps,
        jv_partners: partners,
        primary_image: data.primary_image,
        gallery_images: data.gallery_images || [],
        video_walkthrough: data.video_walkthrough,
      };

      const { error } = await supabase
        .from("property_profile")
        .update(updateData)
        .eq("id", propertyId)
        .eq("seller_id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property updated successfully",
      });

      setSaving(false);
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        title: "Error",
        description: "Failed to save property changes",
        variant: "destructive",
      });
      setSaving(false);
    }
  };

  const handlePreview = () => {
    window.open(`/property/${propertyId}`, "_blank");
  };

  const handleBackToDashboard = () => {
    navigate(`/sellerdash/${userId}`);
  };

  // Helper functions for managing dynamic arrays
  const addExpense = () => {
    setExpenses([...expenses, { name: "", amount: "", frequency: "monthly" }]);
  };

  const removeExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const updateExpense = (index: number, field: string, value: string) => {
    const updated = [...expenses];
    updated[index] = { ...updated[index], [field]: value };
    setExpenses(updated);
  };

  const addRepair = () => {
    setRepairs([
      ...repairs,
      { name: "", description: "", cost: "", contractor: "" },
    ]);
  };

  const removeRepair = (index: number) => {
    setRepairs(repairs.filter((_, i) => i !== index));
  };

  const addUnit = () => {
    setUnits([
      ...units,
      { label: `Unit ${units.length + 1}`, rent: "", occupied: false },
    ]);
  };

  const updateUnit = (index: number, field: string, value: any) => {
    const updated = [...units];
    updated[index] = { ...updated[index], [field]: value };
    setUnits(updated);
  };

  const removeUnit = (index: number) => {
    setUnits(units.filter((_, i) => i !== index));
  };

  const addComp = () => {
    setComps([...comps, ""]);
  };

  const updateComp = (index: number, value: string) => {
    const updated = [...comps];
    updated[index] = value;
    setComps(updated);
  };

  const removeComp = (index: number) => {
    setComps(comps.filter((_, i) => i !== index));
  };

  // Gallery image management functions
  const handleReorderGalleryImages = (fromIndex: number, toIndex: number) => {
    if (!property?.gallery_images) return;

    const newGalleryImages = [...property.gallery_images];
    const [movedImage] = newGalleryImages.splice(fromIndex, 1);
    newGalleryImages.splice(toIndex, 0, movedImage);

    // Update local state immediately (optimistic update)
    setProperty({ ...property, gallery_images: newGalleryImages });

    // Debounce database save to avoid too many calls
    debouncedSaveGalleryOrder(newGalleryImages);
  };

  // Debounced function to save gallery order to database
  const debouncedSaveGalleryOrder = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (galleryImages: string[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        if (!propertyId || !user) return;

        try {
          const { error } = await supabase
            .from("property_profile")
            .update({ gallery_images: galleryImages })
            .eq("id", propertyId)
            .eq("seller_id", user.id);

          if (error) throw error;
        } catch (error) {
          console.error("Error saving gallery order:", error);
          toast({
            title: "Error",
            description: "Failed to save image order",
            variant: "destructive",
          });
        }
      }, 1000); // Save after 1 second of no changes
    };
  }, [propertyId, user]);

  const handleDeleteGalleryImage = async (index: number) => {
    if (!property?.gallery_images || !propertyId || !user) return;

    try {
      const newGalleryImages = property.gallery_images.filter(
        (_, i) => i !== index,
      );

      // Update in database
      const { error } = await supabase
        .from("property_profile")
        .update({ gallery_images: newGalleryImages })
        .eq("id", propertyId)
        .eq("seller_id", user.id);

      if (error) throw error;

      // Update local state
      setProperty({ ...property, gallery_images: newGalleryImages });

      toast({
        title: "Image Deleted",
        description: "Gallery image has been removed successfully",
      });
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  const addPartner = () => {
    if (newPartner.trim()) {
      setPartners([...partners, newPartner.trim()]);
      setNewPartner("");
    }
  };

  const removePartner = (index: number) => {
    setPartners(partners.filter((_, i) => i !== index));
  };

  const updateRepair = (index: number, field: string, value: string) => {
    const updated = [...repairs];
    updated[index] = { ...updated[index], [field]: value };
    setRepairs(updated);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!propertyId || !user) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from("property_profile")
        .update({ status: newStatus })
        .eq("id", propertyId)
        .eq("seller_id", user.id);

      if (error) {
        console.error("Supabase status update error:", error);
        throw error;
      }

      // Update local property data
      setProperty((prev: any) =>
        prev ? { ...prev, status: newStatus } : prev,
      );

      toast({
        title: "Status Updated",
        description: `Property status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update property status",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!propertyId || !user) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from("property_profile")
        .update({ deleted: true })
        .eq("id", propertyId)
        .eq("seller_id", user.id);

      if (error) {
        console.error("Supabase soft delete error:", error);
        throw error;
      }

      toast({
        title: "Property Deleted",
        description: "Property has been deleted",
      });

      // Redirect back to dashboard
      navigate(`/sellerdash/${userId}`);
    } catch (error) {
      console.error("Error soft deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading property...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const renderPropertyOverview = () => (
    <div className="space-y-6 py-4">
      {/* Section 1: Details - Matching Modal Layout */}
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
                <Input
                  placeholder="Enter the full property address"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Address information will be used to automatically fill property
                details
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  <Input placeholder="e.g. Colonial Single Family" {...field} />
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
                    <SelectItem value="single-family">Single Family</SelectItem>
                    <SelectItem value="multi-family">Multi-Family</SelectItem>
                    <SelectItem value="duplex">Duplex</SelectItem>
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
                  <Input placeholder="e.g. 3" {...field} />
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
                  <Input placeholder="e.g. 2.5" {...field} />
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
                  <Input placeholder="e.g. 1990" {...field} />
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
                  <Input placeholder="e.g. 2500" {...field} />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <Separator />

      {/* Section 2: Description */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            AI-Generated Description
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tone
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="motivated">Motivated</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="investor">Investor</SelectItem>
                  <SelectItem value="endbuyer">End Buyer</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="whitespace-nowrap hover:bg-[#09261E] hover:text-white hover:border-[#09261E]"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="AI-generated description will appear here"
                  className="min-h-[200px]"
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

        <FormField
          control={form.control}
          name="additionalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Special conditions, instructions for buyers, or other important details..."
                  className="min-h-[100px]"
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

  const renderCoreDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bedrooms
          </label>
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="4" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bathrooms
          </label>
          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Square Feet
          </label>
          <FormField
            control={form.control}
            name="sqft"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="2450" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lot Size (sq ft)
          </label>
          <FormField
            control={form.control}
            name="lotSize"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Optional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year Built
          </label>
          <FormField
            control={form.control}
            name="yearBuilt"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="2018" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="needs-work">Needs Work</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Occupancy Status
        </label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Vacant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vacant">Vacant</SelectItem>
            <SelectItem value="owner-occupied">Owner Occupied</SelectItem>
            <SelectItem value="tenant-occupied">Tenant Occupied</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderFinances = () => (
    <div className="space-y-6 py-4">
      {/* After Repair Value */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-gray-900">
            After Repair Value
          </h3>
        </div>

        <FormField
          control={form.control}
          name="arv"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <span className="text-sm text-gray-600">📈</span>
                After Repair Value (ARV) (optional)
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g. 450000" {...field} />
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

      <Separator />

      {/* Rental Income */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-gray-900">Rental Income</h3>
        </div>

        <FormField
          control={form.control}
          name="rentTotalMonthly"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Monthly Rent</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 2500" {...field} />
              </FormControl>
              <FormDescription>
                Enter the total monthly rental income for this property
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h4 className="font-medium text-gray-900">Unit Breakdown</h4>
              <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-md font-medium">
                Recommended
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addUnit}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-[#09261E] hover:text-white hover:border-[#09261E] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Unit
            </Button>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700 bg-gray-50 p-3 rounded-lg">
              <div>Unit Label</div>
              <div>Monthly Rent</div>
              <div>Occupied</div>
              <div></div>
            </div>

            {units.map((unit, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 items-center p-3 bg-white border border-gray-200 rounded-lg"
              >
                <Input
                  placeholder="Unit 1"
                  value={unit.label}
                  onChange={(e) => updateUnit(index, "label", e.target.value)}
                  className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]"
                />
                <Input
                  placeholder="e.g. $1,000"
                  value={unit.rent}
                  onChange={(e) => updateUnit(index, "rent", e.target.value)}
                  className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]"
                />
                <div className="flex items-center gap-2">
                  <Switch
                    checked={unit.occupied}
                    onCheckedChange={(checked) =>
                      updateUnit(index, "occupied", checked)
                    }
                  />
                  <span className="text-sm text-gray-600">
                    {unit.occupied ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeUnit(index)}
                    className="p-2 hover:bg-gray-100 border-gray-300"
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      {/* Expenses */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-gray-900">Expenses</h3>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-700">
            <div>Expense Name</div>
            <div>Amount</div>
            <div>Frequency</div>
          </div>

          {expenses.map((expense, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 items-center">
              <Input
                placeholder="Property Tax"
                value={expense.name}
                onChange={(e) => updateExpense(index, "name", e.target.value)}
              />
              <Input
                placeholder="e.g. $1,000"
                value={expense.amount}
                onChange={(e) => updateExpense(index, "amount", e.target.value)}
              />
              <div className="flex gap-2">
                <Select
                  value={expense.frequency}
                  onValueChange={(value) =>
                    updateExpense(index, "frequency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Annually" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeExpense(index)}
                  className="hover:bg-gray-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addExpense}
            className="w-full flex items-center gap-2 hover:bg-[#09261E] hover:text-white hover:border-[#09261E]"
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-blue-600 font-medium">
            Monthly Total:{" "}
            <span className="text-lg">
              ${calculateExpenseTotal("monthly").toLocaleString()}
            </span>
          </div>
          <div className="text-blue-600 font-medium">
            Annual Total:{" "}
            <span className="text-lg">
              ${calculateExpenseTotal("annually").toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Property Condition & Repairs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-gray-900">
            Property Condition & Repairs
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Condition
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Good - Minor Repairs Needed" />
              </SelectTrigger>
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
                  Poor - Major Repairs Needed
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Accurately describe the condition to set buyer expectations
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Repairs & Renovations</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRepair}
                className="flex items-center gap-1 hover:bg-[#09261E] hover:text-white hover:border-[#09261E]"
              >
                <Plus className="h-4 w-4" />
                Add Repair
              </Button>
            </div>

            {repairs.map((repair, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Input
                    placeholder="e.g. Roof Replacement"
                    value={repair.name}
                    onChange={(e) =>
                      updateRepair(index, "name", e.target.value)
                    }
                    className="font-medium mr-3"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeRepair(index)}
                    className="hover:bg-gray-100 flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Textarea
                    placeholder="Describe the needed repairs"
                    value={repair.description || ""}
                    onChange={(e) =>
                      updateRepair(index, "description", e.target.value)
                    }
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Cost
                    </label>
                    <Input
                      placeholder="e.g. $5,000"
                      value={repair.cost}
                      onChange={(e) =>
                        updateRepair(index, "cost", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contractor Quote (Optional)
                    </label>
                    <Button
                      variant="outline"
                      className="w-full hover:bg-gray-100"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Quote
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contractor (Optional)
                  </label>
                  <Input
                    placeholder="Search or enter contractor name"
                    value={repair.contractor || ""}
                    onChange={(e) =>
                      updateRepair(index, "contractor", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-right">
            <div className="text-red-600 font-medium text-lg">
              Total Repair Costs: ${calculateRepairTotal().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDescriptions = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Short Summary
        </label>
        <Input placeholder='Brief hook headline (e.g., "Turnkey rental in desirable neighborhood")' />
        <p className="text-sm text-gray-500 mt-1">0/100 characters</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Description
        </label>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Beautiful modern farmhouse with spacious rooms and updated kitchen."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-sm text-gray-500 mt-1">
          Describe the property's features, condition, neighborhood, and
          investment potential.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes
        </label>
        <FormField
          control={form.control}
          name="additionalNotes"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Any additional information about the property..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  const renderMedia = () => (
    <div className="space-y-6 py-4">
      {/* Primary Image */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-gray-900">
            Primary Image (Thumbnail)
          </h3>
          <span className="text-red-500 text-sm">*Required</span>
        </div>

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100/50 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDrop={(e) => handleDrop(e, "primaryImage")}
          onClick={() =>
            document.getElementById("primary-image-input")?.click()
          }
        >
          <input
            id="primary-image-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files, "primaryImage")}
          />
          {uploadedFiles.primaryImage ? (
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={URL.createObjectURL(uploadedFiles.primaryImage)}
                  alt="Primary preview"
                  className="w-full max-w-xs h-auto object-contain rounded-lg mb-2"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile("primaryImage");
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="text-sm text-gray-600">
                {uploadedFiles.primaryImage.name}
              </p>
            </div>
          ) : form.getValues("primaryImage") ? (
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={
                    form.getValues("primaryImage").startsWith("http")
                      ? form.getValues("primaryImage")
                      : resolvePublicUrl(form.getValues("primaryImage"))
                  }
                  alt="Primary image from storage"
                  className="h-32 w-32 object-cover rounded-lg mb-2"
                />
              </div>
              <p className="text-sm text-gray-600">Previously uploaded</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Drag & drop your main property image or browse files
              </p>
              <p className="text-xs text-gray-500">
                JPEG, PNG, or WebP up to 10MB
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-3 hover:bg-gray-100 border-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById("primary-image-input")?.click();
                }}
              >
                Browse Files
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Images */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-gray-900">
            Gallery Images
          </h3>
          <span className="text-red-500 text-sm">*Required</span>
        </div>

        {/* Display existing gallery images from database */}
        {resolvedGalleryImages.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Current Gallery Images
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {resolvedGalleryImages.map((img, i) => (
                <div
                  key={`${img}-${i}`}
                  className="relative group border rounded-md cursor-move"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", i.toString());
                    e.dataTransfer.effectAllowed = "move";
                    e.currentTarget.style.opacity = "0.5";
                  }}
                  onDragEnd={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const dragIndex = parseInt(
                      e.dataTransfer.getData("text/plain"),
                    );
                    const hoverIndex = i;
                    if (dragIndex !== hoverIndex) {
                      handleReorderGalleryImages(dragIndex, hoverIndex);
                    }
                  }}
                >
                  <img
                    src={img}
                    alt={`Gallery image ${i + 1}`}
                    className="w-full h-24 object-cover rounded-t-md"
                    draggable={false}
                  />

                  {/* Hover overlay with controls - matches listing modal exactly */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {i > 0 && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white text-gray-700 hover:bg-green-100 hover:text-[#135341] hover:border-green-300"
                        onClick={() => handleReorderGalleryImages(i, i - 1)}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleDeleteGalleryImage(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {i < resolvedGalleryImages.length - 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white text-gray-700 hover:bg-green-100 hover:text-[#135341] hover:border-green-300"
                        onClick={() => handleReorderGalleryImages(i, i + 1)}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="px-2 py-1 text-xs text-gray-500 bg-gray-50 rounded-b-md">
                    Image {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100/50 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDrop={(e) => handleDrop(e, "galleryImages")}
          onClick={() =>
            document.getElementById("gallery-images-input")?.click()
          }
        >
          <input
            id="gallery-images-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files, "galleryImages")}
          />
          {uploadedFiles.galleryImages.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedFiles.galleryImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Gallery preview ${index + 1}`}
                      className="h-24 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile("galleryImages", index);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Add more images</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                {resolvedGalleryImages.length > 0
                  ? "Add more property photos here or browse files"
                  : "Drag & drop property photos here or browse files"}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Upload multiple images at once (up to 20)
              </p>
              <Button
                type="button"
                variant="outline"
                className="hover:bg-gray-100 border-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById("gallery-images-input")?.click();
                }}
              >
                Browse Files
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Video */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Youtube className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-gray-900">
            Video (Optional)
          </h3>
        </div>

        <div className="flex gap-2 mb-4">
          <Button
            type="button"
            onClick={() => setVideoMode("link")}
            className={`flex-1 transition-colors ${
              videoMode === "link"
                ? "bg-[#09261E] hover:bg-[#135341] text-white border-[#09261E]"
                : "border-gray-300 text-gray-700 hover:bg-[#09261E] hover:text-white hover:border-[#09261E]"
            }`}
            variant={videoMode === "link" ? "default" : "outline"}
          >
            YouTube / Video Link
          </Button>
          <Button
            type="button"
            onClick={() => setVideoMode("upload")}
            className={`flex-1 transition-colors ${
              videoMode === "upload"
                ? "bg-[#09261E] hover:bg-[#135341] text-white border-[#09261E]"
                : "border-gray-300 text-gray-700 hover:bg-[#09261E] hover:text-white hover:border-[#09261E]"
            }`}
            variant={videoMode === "upload" ? "default" : "outline"}
          >
            Upload Video File
          </Button>
        </div>

        {videoMode === "link" ? (
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="videoWalkthrough"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Paste YouTube, Vimeo, or Google Drive link"
                      className="w-full border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <div className="flex items-center justify-center w-4 h-4 bg-gray-300 rounded-full text-center text-xs leading-4 mt-0.5 flex-shrink-0">
                ?
              </div>
              <span>Add a virtual tour or walkthrough video link</span>
            </div>
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100/50 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDrop={(e) => handleDrop(e, "videoFile")}
            onClick={() => document.getElementById("video-file-input")?.click()}
          >
            <input
              id="video-file-input"
              type="file"
              accept="video/mp4,video/mov,video/webm"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files, "videoFile")}
            />
            {uploadedFiles.videoFile ? (
              <div className="flex flex-col items-center">
                <div className="relative bg-gray-100 rounded-lg p-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Upload className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {uploadedFiles.videoFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(uploadedFiles.videoFile.size / (1024 * 1024)).toFixed(
                          1,
                        )}{" "}
                        MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile("videoFile");
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <p className="text-xs text-gray-500">Click to replace video</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-1 font-medium">
                  Upload a video file or browse files
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  MP4, MOV, or WebM up to 100MB
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="hover:bg-gray-100 border-gray-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById("video-file-input")?.click();
                  }}
                >
                  Browse Files
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderLogistics = () => (
    <div className="space-y-6 py-4">
      {/* Deal Terms */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-gray-900">Deal Terms</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Price</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 200000" {...field} />
                </FormControl>
                <FormDescription>
                  Buyers will not see your purchase price - this is used to
                  calculate your assignment fee
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
                  <Input placeholder="e.g. 225000" {...field} />
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
                    value={
                      calculateAssignmentFee()
                        ? `$${Number(calculateAssignmentFee()).toLocaleString()}`
                        : ""
                    }
                    disabled
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
                    <SelectItem value="key">Key</SelectItem>
                    <SelectItem value="lockbox">Lockbox</SelectItem>
                    <SelectItem value="owner-present">Owner Present</SelectItem>
                    <SelectItem value="agent-only">Agent Only</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Enhanced Closing Date Field with Custom Styling */}
          <ClosingDateField form={form} />
        </div>
      </div>

      <Separator />

      {/* Comparable Properties (Comps) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-gray-900">
            Comparable Properties (Comps)
          </h3>
        </div>

        <div className="space-y-3">
          {comps.map((comp, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Add address of similar property sold recently"
                value={comp}
                onChange={(e) => updateComp(index, e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeComp(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addComp}
            className="w-full flex items-center gap-2 hover:bg-gray-100 border-gray-300"
          >
            <Plus className="h-4 w-4" />
            Add Comparable Property
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          Add addresses of similar properties sold recently in the area
          (optional)
        </p>
      </div>

      <Separator />

      {/* Documentation */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-gray-900">Documentation</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purchase Agreement
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100/50 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDrop={(e) => handleDrop(e, "purchaseAgreement")}
              onClick={() =>
                document.getElementById("purchase-agreement-input")?.click()
              }
            >
              <input
                id="purchase-agreement-input"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) =>
                  handleFileUpload(e.target.files, "purchaseAgreement")
                }
              />
              {uploadedFiles.purchaseAgreement ? (
                <div className="flex flex-col items-center">
                  <div className="relative bg-gray-100 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 rounded-full p-2">
                        <FileText className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {uploadedFiles.purchaseAgreement.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(
                            uploadedFiles.purchaseAgreement.size /
                            (1024 * 1024)
                          ).toFixed(1)}{" "}
                          MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile("purchaseAgreement");
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Click to replace document
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Drag & drop your agreement or browse files
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    PDF, DOC, or DOCX up to 10MB
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="hover:bg-gray-100 border-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      document
                        .getElementById("purchase-agreement-input")
                        ?.click();
                    }}
                  >
                    Browse Files
                  </Button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              You can upload this later, but it's required before publishing.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Partners & Notes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-gray-900">
            Partners & Notes
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deal Partners (Optional)
            </label>
            <div className="space-y-2">
              {partners.map((partner, index) => (
                <div key={index} className="flex gap-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {partner}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removePartner(index)}
                    />
                  </Badge>
                </div>
              ))}

              <div className="flex gap-2">
                <Input
                  placeholder="Enter partner name"
                  value={newPartner}
                  onChange={(e) => setNewPartner(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPartner();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPartner}
                  disabled={!newPartner.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Add JV partners or other stakeholders in this deal
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccessClosingTab = () => (
    <div className="space-y-6">
      {/* Deal Terms */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-gray-900">Deal Terms</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Price</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 200000" {...field} />
                </FormControl>
                <FormDescription>
                  Buyers will not see your purchase price - this is used to
                  calculate your assignment fee
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
                  <Input placeholder="e.g. 225000" {...field} />
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
                    value={
                      calculateAssignmentFee()
                        ? `$${Number(calculateAssignmentFee()).toLocaleString()}`
                        : ""
                    }
                    disabled
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
                    <SelectItem value="key">Key</SelectItem>
                    <SelectItem value="lockbox">Lockbox</SelectItem>
                    <SelectItem value="owner-present">Owner Present</SelectItem>
                    <SelectItem value="agent-only">Agent Only</SelectItem>
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
              <FormItem>
                <FormLabel>Closing Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal border-gray-300 hover:bg-gray-100 focus:border-[#09261E] focus:ring-[#09261E]",
                          field.value
                            ? "bg-[#09261E] text-white hover:bg-[#135341] border-[#09261E]"
                            : "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          (() => {
                            try {
                              const date = new Date(field.value + "T00:00:00");
                              return isNaN(date.getTime())
                                ? "Select date"
                                : format(date, "MMMM do, yyyy");
                            } catch (e) {
                              return "Select date";
                            }
                          })()
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
                      selected={
                        field.value
                          ? new Date(field.value + "T00:00:00")
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          // Format date as YYYY-MM-DD to avoid timezone issues
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            "0",
                          );
                          const day = String(date.getDate()).padStart(2, "0");
                          field.onChange(`${year}-${month}-${day}`);
                        } else {
                          field.onChange(null);
                        }
                      }}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                      className="rounded-md border"
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
    </div>
  );

  const renderAnalytics = () => {
    const calculateTimeUntilClosing = () => {
      const closingDate = form.getValues("closingDate");
      if (!closingDate) return null;

      try {
        const closing = new Date(closingDate);
        const now = new Date();
        const timeDiff = closing.getTime() - now.getTime();

        if (timeDiff <= 0) return "Closing date has passed";

        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (days === 1) return "1 day remaining";
        if (days < 30) return `${days} days remaining`;

        const months = Math.floor(days / 30);
        const remainingDays = days % 30;
        if (months === 1) {
          return remainingDays > 0
            ? `1 month, ${remainingDays} days remaining`
            : "1 month remaining";
        }
        return remainingDays > 0
          ? `${months} months, ${remainingDays} days remaining`
          : `${months} months remaining`;
      } catch (e) {
        return null;
      }
    };

    return (
      <div className="space-y-6">
        {/* Featured Property Toggle */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-gray-900">
              Property Visibility
            </h3>
          </div>

          <FormField
            control={form.control}
            name="featuredProperty"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Featured Property</FormLabel>
                  <FormDescription>
                    Make this property stand out in search results and get more
                    visibility
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

        <Separator />

        {/* Performance Stats */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-gray-900">
              Performance Stats
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Views</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {property?.viewCount || 0}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900">Saves</p>
                  <p className="text-2xl font-bold text-green-600">
                    {property?.saveCount || 0}
                  </p>
                </div>
                <Bookmark className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-900">Offers</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {property?.offerCount || 0}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Tags Input */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-gray-900">
              Property Tags
            </h3>
          </div>

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (up to 3)</FormLabel>
                <div className="space-y-3">
                  {/* Current Tags */}
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(field.value) &&
                      field.value.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => {
                              const newTags = Array.isArray(field.value)
                                ? [...field.value]
                                : [];
                              newTags.splice(index, 1);
                              field.onChange(newTags);
                            }}
                          />
                        </Badge>
                      ))}
                  </div>

                  {/* Tag Suggestions */}
                  {(!Array.isArray(field.value) || field.value.length < 3) && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Popular tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "BRRRR",
                          "Fix & Flip",
                          "Turnkey",
                          "Cash Cow",
                          "Vacant",
                          "High Equity",
                          "Subject-To",
                          "Seller Financing",
                          "Short Sale",
                        ].map((suggestedTag) => (
                          <Button
                            key={suggestedTag}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const currentTags = Array.isArray(field.value)
                                ? field.value
                                : [];
                              if (
                                !currentTags.includes(suggestedTag) &&
                                currentTags.length < 3
                              ) {
                                field.onChange([...currentTags, suggestedTag]);
                              }
                            }}
                            disabled={
                              Array.isArray(field.value)
                                ? field.value.includes(suggestedTag) ||
                                  field.value.length >= 3
                                : false
                            }
                            className={`text-xs transition-colors ${
                              Array.isArray(field.value) &&
                              field.value.includes(suggestedTag)
                                ? "bg-[#09261E] text-white border-[#09261E] hover:bg-[#135341]"
                                : "hover:bg-gray-100 hover:border-gray-400"
                            }`}
                          >
                            + {suggestedTag}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Tag Input */}
                  {(!Array.isArray(field.value) || field.value.length < 3) && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add custom tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (
                              newTag.trim() &&
                              (!field.value || field.value.length < 3) &&
                              !field.value?.includes(newTag.trim())
                            ) {
                              field.onChange([
                                ...(field.value || []),
                                newTag.trim(),
                              ]);
                              setNewTag("");
                            }
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (
                            newTag.trim() &&
                            (!field.value || field.value.length < 3) &&
                            !field.value?.includes(newTag.trim())
                          ) {
                            field.onChange([
                              ...(field.value || []),
                              newTag.trim(),
                            ]);
                            setNewTag("");
                          }
                        }}
                        disabled={
                          !newTag.trim() ||
                          (field.value || []).length >= 3 ||
                          (field.value || []).includes(newTag.trim())
                        }
                        className="border-[#09261E] text-[#09261E] hover:bg-[#09261E] hover:text-white"
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </div>
                <FormDescription>
                  Tags help buyers find your property. Maximum 3 tags allowed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Closing Countdown */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-gray-900">
              Closing Countdown
            </h3>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            {calculateTimeUntilClosing() ? (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Time until closing:
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  {calculateTimeUntilClosing()}
                </p>
              </div>
            ) : (
              <div>
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  Set a closing date to enable countdown
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator />
      </div>
    );
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "overview":
        return renderPropertyOverview();
      case "media":
        return renderMedia();
      case "finances":
        return renderFinances();
      case "logistics":
        return renderLogistics();
      case "analytics":
        return renderAnalytics();
      default:
        return renderPropertyOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-4">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          {/* Mobile Tab Selector */}
          <Select value={activeSection} onValueChange={setActiveSection}>
            <SelectTrigger className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09261E] focus:border-[#09261E] bg-white h-auto">
              <div className="flex items-center gap-3 w-full">
                {activeSection === "overview" && (
                  <Home className="h-5 w-5 text-gray-600" />
                )}
                {activeSection === "media" && (
                  <ImageIcon className="h-5 w-5 text-gray-600" />
                )}
                {activeSection === "finances" && (
                  <DollarSign className="h-5 w-5 text-gray-600" />
                )}
                {activeSection === "logistics" && (
                  <MapPin className="h-5 w-5 text-gray-600" />
                )}
                {activeSection === "analytics" && (
                  <TrendingUp className="h-5 w-5 text-gray-600" />
                )}
                <SelectValue className="flex-1 text-left" />
                <ChevronDown className="h-4 w-4 opacity-50 ml-auto" />
              </div>
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="overview">Property Details</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="finances">Finances</SelectItem>
              <SelectItem value="logistics">Logistics</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile Top Controls */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Status:
              </span>
              <Select
                value={property?.status || "draft"}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="flex-1 h-8 text-sm border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span>Draft</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="live">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span>Live</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="offer_accepted">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>Offer Accepted</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pending">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span>Pending</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="closed">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-800"></div>
                      <span>Closed</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="archived">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                      <span>Archived</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dropped" className="text-red-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-600"></div>
                      <span>Dropped</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <button
              onClick={() => window.open(`/p/${propertyId}`, "_blank")}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </button>
            <button
              onClick={form.handleSubmit(handleSave)}
              disabled={saving}
              className="inline-flex items-center px-3 py-2 bg-[#09261E] border border-transparent rounded text-sm font-medium text-white hover:bg-[#135341] disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>
          </div>
        </div>
      </div>
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 bg-white shadow-sm sticky top-0 h-screen overflow-y-auto">
          {/* Desktop Header */}
          <div className="p-6 border-b border-gray-200">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>

            {/* Desktop Top Controls */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Edit Property
                </h1>
                <p className="text-gray-600 mt-1">
                  {property?.address || "Property Editor"}
                </p>
              </div>

              <div className="space-y-3">
                {/* Status Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 min-w-0">
                    Status:
                  </span>
                  <Select
                    value={property?.status || "draft"}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="flex-1 h-10 border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <span>Draft</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="live">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                          <span>Live</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="offer_accepted">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span>Offer Accepted</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="pending">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          <span>Pending</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="closed">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-800"></div>
                          <span>Closed</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="archived">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                          <span>Archived</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="dropped" className="text-red-600">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-600"></div>
                          <span>Dropped</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Preview Button */}
                <button
                  onClick={() => window.open(`/p/${propertyId}`, "_blank")}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#09261E] focus:ring-offset-2"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Public Listing
                </button>

                {/* Save Button */}
                <button
                  onClick={form.handleSubmit(handleSave)}
                  disabled={saving}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-[#09261E] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#135341] focus:outline-none focus:ring-2 focus:ring-[#09261E] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>

                {/* Delete from My View Button */}
                <button
                  onClick={() => setShowDeleteConfirmation(true)}
                  disabled={saving}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-[#803344] mt-[5px] mb-[5px]"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Edit Sections
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveSection("overview")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === "overview"
                    ? "bg-[#09261E] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Property Details</span>
              </button>
              <button
                onClick={() => setActiveSection("media")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === "media"
                    ? "bg-[#09261E] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ImageIcon className="h-5 w-5" />
                <span className="font-medium">Media</span>
              </button>
              <button
                onClick={() => setActiveSection("finances")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === "finances"
                    ? "bg-[#09261E] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <DollarSign className="h-5 w-5" />
                <span className="font-medium">Finances</span>
              </button>
              <button
                onClick={() => setActiveSection("logistics")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === "logistics"
                    ? "bg-[#09261E] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <MapPin className="h-5 w-5" />
                <span className="font-medium">Logistics</span>
              </button>
              <button
                onClick={() => setActiveSection("analytics")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === "analytics"
                    ? "bg-[#09261E] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">Analytics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSave)}
              className="space-y-8"
            >
              <Card className="shadow-sm border-gray-200">
                <CardContent className="p-6 lg:p-8">
                  {renderActiveSection()}
                </CardContent>
              </Card>
            </form>
          </Form>

          {/* Mobile Delete Button */}
          <div className="lg:hidden mt-8 px-4 pb-8">
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              disabled={saving}
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Quick Action Selector */}
      <QuickActionSelector />
      {/* Modals */}
      <EnhancedPropertyListingModal
        isOpen={showListingModal}
        onClose={() => setShowListingModal(false)}
      />
      <MarketingCenterModal
        isOpen={showCampaignModal}
        onClose={() => setShowCampaignModal(false)}
        propertyId={propertyId}
      />

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Delete Property
                </h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this property? This action will remove it from your listings but won't permanently delete the data. You can restore it later if needed.
              </p>
              {property?.name && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-900">
                    {property.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {property.address}
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirmation(false)}
                className="flex-1"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  handleSoftDelete();
                }}
                className="flex-1"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
