import React, { useState, useEffect } from "react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  Bath,
  Square,
  Calendar,
  Plus,
  Trash2,
  X,
  Car,
  Youtube,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { QuickActionSelector } from "@/components/seller/quick-action-selector";

// Property form schema matching the EnhancedPropertyListingModal
const propertySchema = z.object({
  // Step 1: Property Overview
  name: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  county: z.string().optional(),
  parcelId: z.string().optional(),
  propertyType: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  sqft: z.string().optional(),
  yearBuilt: z.string().optional(),
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

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
      isActive 
        ? 'bg-green-700 text-white' 
        : 'text-gray-600 hover:bg-gray-100'
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
  const [activeSection, setActiveSection] = useState('overview');

  // State matching EnhancedPropertyListingModal
  const [expenses, setExpenses] = useState<{ name: string; amount: string; frequency: string }[]>([
    { name: "Property Tax", amount: "", frequency: "annually" },
    { name: "Insurance", amount: "", frequency: "annually" },
    { name: "Utilities", amount: "", frequency: "monthly" },
  ]);
  const [repairs, setRepairs] = useState<{ name: string; description: string; cost: string; contractor: string }[]>([]);
  const [units, setUnits] = useState<{ label: string; rent: string; occupied: boolean }[]>([]);
  const [comps, setComps] = useState<string[]>([""]);
  const [partners, setPartners] = useState<string[]>([]);
  const [newPartner, setNewPartner] = useState("");
  const [videoMode, setVideoMode] = useState<'link' | 'upload'>('link');

  // Live calculations
  const calculateAssignmentFee = () => {
    const listing = parseFloat(form.watch('listingPrice')?.replace(/[$,]/g, '') || '0');
    const purchase = parseFloat(form.watch('purchasePrice')?.replace(/[$,]/g, '') || '0');
    const fee = listing - purchase;
    return fee > 0 ? fee.toFixed(0) : '';
  };

  const calculateRepairTotal = () => {
    return repairs.reduce((total, repair) => {
      const cost = parseFloat(repair.cost?.replace(/[$,]/g, '') || '0');
      return total + cost;
    }, 0);
  };

  const calculateExpenseTotal = (frequency: 'monthly' | 'annually') => {
    return expenses.reduce((total, expense) => {
      const amount = parseFloat(expense.amount?.replace(/[$,]/g, '') || '0');
      if (frequency === 'monthly') {
        switch (expense.frequency) {
          case 'monthly': return total + amount;
          case 'quarterly': return total + (amount / 3);
          case 'annually': return total + (amount / 12);
          default: return total;
        }
      } else {
        switch (expense.frequency) {
          case 'monthly': return total + (amount * 12);
          case 'quarterly': return total + (amount * 4);
          case 'annually': return total + amount;
          default: return total;
        }
      }
    }, 0);
  };

  const userId = params?.userId;
  const propertyId = params?.propertyId;

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
        const { data: { user: currentUser } } = await supabase.auth.getUser();
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
          setError("Property not found or you don't have permission to edit it");
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
          zipCode: propertyData.zipCode || "",
          county: propertyData.county || "",
          parcelId: propertyData.parcelId || "",
          propertyType: propertyData.propertyType || "",
          bedrooms: propertyData.bedrooms ? propertyData.bedrooms.toString() : "",
          bathrooms: propertyData.bathrooms ? propertyData.bathrooms.toString() : "",
          sqft: propertyData.sqft ? propertyData.sqft.toString() : "",
          yearBuilt: propertyData.yearBuilt ? propertyData.yearBuilt.toString() : "",
          lotSize: propertyData.lotSize || "",
          parking: propertyData.parking || "",
          arv: propertyData.arv ? propertyData.arv.toString() : "",
          rentTotalMonthly: propertyData.rentTotalMonthly ? propertyData.rentTotalMonthly.toString() : "",
          purchasePrice: propertyData.purchasePrice ? propertyData.purchasePrice.toString() : "",
          listingPrice: propertyData.listingPrice ? propertyData.listingPrice.toString() : "",
          assignmentFee: propertyData.assignmentFee ? propertyData.assignmentFee.toString() : "",
          accessType: propertyData.accessType || "",
          description: propertyData.description || "",
          additionalNotes: propertyData.additionalNotes || "",
          tags: propertyData.tags || [],
          featuredProperty: propertyData.featuredProperty || false,
          // Media fields
          primaryImage: propertyData.primary_image || "",
          galleryImages: propertyData.gallery_images || [],
          videoWalkthrough: propertyData.video_walkthrough || "",
        });

        // Set expenses from property data
        if (propertyData.expense_items && propertyData.expense_items.length > 0) {
          setExpenses(propertyData.expense_items);
        }

        // Set repair projects from property data
        if (propertyData.repair_projects && propertyData.repair_projects.length > 0) {
          setRepairs(propertyData.repair_projects);
        }

        // Set rent units from property data
        if (propertyData.rent_unit && propertyData.rent_unit.length > 0) {
          setUnits(propertyData.rent_unit);
        }

        // Set comparable properties from property data
        if (propertyData.comps && Array.isArray(propertyData.comps) && propertyData.comps.length > 0) {
          setComps(propertyData.comps);
        } else {
          setComps([""]);
        }

        // Set JV partners from property data
        if (propertyData.jv_partners && Array.isArray(propertyData.jv_partners) && propertyData.jv_partners.length > 0) {
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
        zipcode: data.zipCode,            // ✅ FIXED
        county: data.county,
        parcel_id: data.parcelId,
        property_type: data.propertyType,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
        bathrooms: data.bathrooms ? parseFloat(data.bathrooms) : null,
        sqft: data.sqft ? parseInt(data.sqft) : null,
        year_built: data.yearBuilt ? parseInt(data.yearBuilt) : null,
        lot_size: data.lotSize,
        parking: data.parking,
        arv: data.arv ? parseFloat(data.arv.replace(/[$,]/g, "")) : null,
        rent_total_monthly: data.rentTotalMonthly ? parseFloat(data.rentTotalMonthly.replace(/[$,]/g, "")) : null,
        purchase_price: data.purchasePrice ? parseFloat(data.purchasePrice.replace(/[$,]/g, "")) : null,
        listing_price: data.listingPrice ? parseFloat(data.listingPrice.replace(/[$,]/g, "")) : null,
        assignment_fee: calculateAssignmentFee() ? parseFloat(calculateAssignmentFee()) : null,
        access_type: data.accessType,               // ✅ FIXED
        description: data.description,
        additional_notes: data.additionalNotes,     // ✅ FIXED
        tags: data.tags || [],
        featured_property: data.featuredProperty || false,
        expense_items: expenses,
        repairs: repairs,
        rent_unit: units,
        comps: comps,
        jv_partners: partners,
        primary_image: data.primaryImage,
        gallery_images: data.galleryImages || [],
        video_walkthrough: data.videoWalkthrough
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
    window.open(`/property/${propertyId}`, '_blank');
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
    setRepairs([...repairs, { name: "", description: "", cost: "", contractor: "" }]);
  };

  const removeRepair = (index: number) => {
    setRepairs(repairs.filter((_, i) => i !== index));
  };

  const addUnit = () => {
    setUnits([...units, { label: `Unit ${units.length + 1}`, rent: "", occupied: false }]);
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
        console.error('Supabase status update error:', error);
        throw error;
      }

      // Update local property data
      setProperty((prev: any) => prev ? { ...prev, status: newStatus } : prev);
      
      toast({
        title: "Status Updated",
        description: `Property status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update property status",
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
                <Input placeholder="Enter the full property address" {...field} />
              </FormControl>
              <FormDescription>
                Address information will be used to automatically fill property details
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Input placeholder="e.g. Street parking, 2-car garage, driveway" {...field} />
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
          <h3 className="text-lg font-semibold text-gray-900">AI-Generated Description</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
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
              <Button variant="outline" className="whitespace-nowrap hover:bg-[#09261E] hover:text-white hover:border-[#09261E]">
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
                You can edit this description or regenerate with different settings
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Square Feet</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Lot Size (sq ft)</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Year Built</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Occupancy Status</label>
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
          <h3 className="text-lg font-semibold text-gray-900">After Repair Value</h3>
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
                The estimated value of the property after all repairs and improvements
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
              <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-md font-medium">Recommended</span>
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
              <div key={index} className="grid grid-cols-4 gap-4 items-center p-3 bg-white border border-gray-200 rounded-lg">
                <Input
                  placeholder="Unit 1"
                  value={unit.label}
                  onChange={(e) => updateUnit(index, 'label', e.target.value)}
                  className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]"
                />
                <Input
                  placeholder="e.g. $1,000"
                  value={unit.rent}
                  onChange={(e) => updateUnit(index, 'rent', e.target.value)}
                  className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]"
                />
                <div className="flex items-center gap-2">
                  <Switch
                    checked={unit.occupied}
                    onCheckedChange={(checked) => updateUnit(index, 'occupied', checked)}
                  />
                  <span className="text-sm text-gray-600">{unit.occupied ? 'Yes' : 'No'}</span>
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
                onChange={(e) => updateExpense(index, 'name', e.target.value)}
              />
              <Input
                placeholder="e.g. $1,000"
                value={expense.amount}
                onChange={(e) => updateExpense(index, 'amount', e.target.value)}
              />
              <div className="flex gap-2">
                <Select
                  value={expense.frequency}
                  onValueChange={(value) => updateExpense(index, 'frequency', value)}
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
            Monthly Total: <span className="text-lg">${calculateExpenseTotal('monthly').toLocaleString()}</span>
          </div>
          <div className="text-blue-600 font-medium">
            Annual Total: <span className="text-lg">${calculateExpenseTotal('annually').toLocaleString()}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Property Condition & Repairs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-gray-900">Property Condition & Repairs</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Condition</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Good - Minor Repairs Needed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent - Move-in Ready</SelectItem>
                <SelectItem value="good">Good - Minor Repairs Needed</SelectItem>
                <SelectItem value="fair">Fair - Moderate Repairs Needed</SelectItem>
                <SelectItem value="poor">Poor - Major Repairs Needed</SelectItem>
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
                    onChange={(e) => updateRepair(index, 'name', e.target.value)}
                    className="font-medium"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeRepair(index)}
                    className="hover:bg-gray-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <Textarea
                    placeholder="Describe the needed repairs"
                    value={repair.description || ''}
                    onChange={(e) => updateRepair(index, 'description', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cost</label>
                    <Input
                      placeholder="e.g. $5,000"
                      value={repair.cost}
                      onChange={(e) => updateRepair(index, 'cost', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contractor Quote (Optional)</label>
                    <Button variant="outline" className="w-full hover:bg-gray-100">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Quote
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contractor (Optional)</label>
                  <Input
                    placeholder="Search or enter contractor name"
                    value={repair.contractor || ''}
                    onChange={(e) => updateRepair(index, 'contractor', e.target.value)}
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Short Summary</label>
        <Input placeholder='Brief hook headline (e.g., "Turnkey rental in desirable neighborhood")' />
        <p className="text-sm text-gray-500 mt-1">0/100 characters</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
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
        <p className="text-sm text-gray-500 mt-1">Describe the property's features, condition, neighborhood, and investment potential.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
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
          <h3 className="text-lg font-semibold text-gray-900">Primary Image (Thumbnail)</h3>
          <span className="text-red-500 text-sm">*Required</span>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50/50">
          <div className="flex flex-col items-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">Drag & drop your main property image or browse files</p>
            <p className="text-xs text-gray-500">JPEG, PNG, or WebP up to 10MB</p>
          </div>
        </div>
      </div>

      {/* Gallery Images */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-gray-900">Gallery Images</h3>
          <span className="text-red-500 text-sm">*Required</span>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50/50">
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">Drag & drop property photos here or browse files</p>
            <p className="text-xs text-gray-500">Upload multiple images at once (up to 20)</p>
          </div>
        </div>
      </div>

      {/* Video */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Youtube className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-gray-900">Video (Optional)</h3>
        </div>
        
        <div className="flex gap-2 mb-4">
          <Button 
            type="button"
            onClick={() => setVideoMode('link')}
            className={`flex-1 transition-colors ${
              videoMode === 'link' 
                ? 'bg-[#09261E] hover:bg-[#135341] text-white border-[#09261E]' 
                : 'border-gray-300 text-gray-700 hover:bg-[#09261E] hover:text-white hover:border-[#09261E]'
            }`}
            variant={videoMode === 'link' ? 'default' : 'outline'}
          >
            YouTube / Video Link
          </Button>
          <Button 
            type="button"
            onClick={() => setVideoMode('upload')}
            className={`flex-1 transition-colors ${
              videoMode === 'upload' 
                ? 'bg-[#09261E] hover:bg-[#135341] text-white border-[#09261E]' 
                : 'border-gray-300 text-gray-700 hover:bg-[#09261E] hover:text-white hover:border-[#09261E]'
            }`}
            variant={videoMode === 'upload' ? 'default' : 'outline'}
          >
            Upload Video File
          </Button>
        </div>
        
        {videoMode === 'link' ? (
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
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50/50">
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 mb-1 font-medium">Upload a video file or browse files</p>
              <p className="text-xs text-gray-500 mb-4">MP4, MOV, or WebM up to 100MB</p>
              <Button
                type="button"
                variant="outline"
                className="hover:bg-gray-100 border-gray-300"
              >
                Browse Files
              </Button>
            </div>
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
                  Buyers will not see your purchase price - this is used to calculate your assignment fee
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
                    value={calculateAssignmentFee() ? `$${Number(calculateAssignmentFee()).toLocaleString()}` : ''}
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          "w-full pl-3 text-left font-normal border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "MMMM do, yyyy")
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
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString().split('T')[0] || null)}
                      disabled={(date) =>
                        date < new Date("1900-01-01")
                      }
                      initialFocus
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

      {/* Comparable Properties (Comps) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-gray-900">Comparable Properties (Comps)</h3>
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
          Add addresses of similar properties sold recently in the area (optional)
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Agreement</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50/50">
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-1">Drag & drop your agreement or browse files</p>
                <p className="text-xs text-gray-500">PDF, DOC, or DOCX up to 10MB</p>
              </div>
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
          <h3 className="text-lg font-semibold text-gray-900">Partners & Notes</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deal Partners (Optional)</label>
            <div className="space-y-2">
              {partners.map((partner, index) => (
                <div key={index} className="flex gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
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
                    if (e.key === 'Enter') {
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

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return renderPropertyOverview();
      case 'media':
        return renderMedia();
      case 'finances':
        return renderFinances();
      case 'logistics':
        return renderLogistics();
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
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09261E] focus:border-transparent bg-white"
          >
            <option value="overview">Property Details</option>
            <option value="media">Media</option>
            <option value="finances">Finances</option>
            <option value="logistics">Logistics</option>
          </select>
          
          {/* Mobile Top Controls */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Status:</span>
              <Select value={property?.status || "draft"} onValueChange={handleStatusChange}>
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
                      <span>Archive</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dropped" className="text-red-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-600"></div>
                      <span>Drop</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <button
              onClick={() => window.open(`/p/${propertyId}`, '_blank')}
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
                <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
                <p className="text-gray-600 mt-1">{property?.address || "Property Editor"}</p>
              </div>
              
              <div className="space-y-3">
                {/* Status Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 min-w-0">Status:</span>
                  <Select value={property?.status || "draft"} onValueChange={handleStatusChange}>
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
                          <span>Archive</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="dropped" className="text-red-600">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-600"></div>
                          <span>Drop</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Preview Button */}
                <button
                  onClick={() => window.open(`/p/${propertyId}`, '_blank')}
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
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Edit Sections</h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveSection('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === 'overview'
                    ? 'bg-[#09261E] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Property Details</span>
              </button>
              <button
                onClick={() => setActiveSection('media')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === 'media'
                    ? 'bg-[#09261E] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ImageIcon className="h-5 w-5" />
                <span className="font-medium">Media</span>
              </button>
              <button
                onClick={() => setActiveSection('finances')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === 'finances'
                    ? 'bg-[#09261E] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <DollarSign className="h-5 w-5" />
                <span className="font-medium">Finances</span>
              </button>
              <button
                onClick={() => setActiveSection('logistics')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === 'logistics'
                    ? 'bg-[#09261E] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MapPin className="h-5 w-5" />
                <span className="font-medium">Logistics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
              <Card className="shadow-sm border-gray-200">
                <CardContent className="p-6 lg:p-8">
                  {renderActiveSection()}
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </div>
      
      {/* Quick Action Selector */}
      <QuickActionSelector />
    </div>
  );
}