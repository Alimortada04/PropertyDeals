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
        });

        // Set expenses from property data
        if (propertyData.expenseItems && propertyData.expenseItems.length > 0) {
          setExpenses(propertyData.expenseItems);
        }

        // Set repair projects from property data
        if (propertyData.repairProjects && propertyData.repairProjects.length > 0) {
          setRepairs(propertyData.repairProjects);
        }

        // Set rent units from property data
        if (propertyData.rentUnit && propertyData.rentUnit.length > 0) {
          setUnits(propertyData.rentUnit);
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
        zipCode: data.zipCode,
        county: data.county,
        parcelId: data.parcelId,
        propertyType: data.propertyType,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
        bathrooms: data.bathrooms ? parseFloat(data.bathrooms) : null,
        sqft: data.sqft ? parseInt(data.sqft) : null,
        yearBuilt: data.yearBuilt ? parseInt(data.yearBuilt) : null,
        lotSize: data.lotSize,
        parking: data.parking,
        arv: data.arv ? parseFloat(data.arv.replace(/[$,]/g, "")) : null,
        rentTotalMonthly: data.rentTotalMonthly ? parseFloat(data.rentTotalMonthly.replace(/[$,]/g, "")) : null,
        purchasePrice: data.purchasePrice ? parseFloat(data.purchasePrice.replace(/[$,]/g, "")) : null,
        listingPrice: data.listingPrice ? parseFloat(data.listingPrice.replace(/[$,]/g, "")) : null,
        assignmentFee: data.assignmentFee ? parseFloat(data.assignmentFee.replace(/[$,]/g, "")) : null,
        accessType: data.accessType,
        description: data.description,
        additionalNotes: data.additionalNotes,
        tags: data.tags || [],
        featuredProperty: data.featuredProperty || false,
        expenseItems: expenses,
        repairProjects: repairs,
        rentUnit: units,
        updatedAt: new Date().toISOString(),
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

  const updateRepair = (index: number, field: string, value: string) => {
    const updated = [...repairs];
    updated[index] = { ...updated[index], [field]: value };
    setRepairs(updated);
  };

  const addUnit = () => {
    setUnits([...units, { label: "", rent: "", occupied: false }]);
  };

  const removeUnit = (index: number) => {
    setUnits(units.filter((_, i) => i !== index));
  };

  const updateUnit = (index: number, field: string, value: string | boolean) => {
    const updated = [...units];
    updated[index] = { ...updated[index], [field]: value };
    setUnits(updated);
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
              <Button variant="outline" className="whitespace-nowrap">
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

  const renderFinancialSnapshot = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Asking Price</label>
          <FormField
            control={form.control}
            name="listingPrice"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="459000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ARV (After Repair Value)</label>
          <FormField
            control={form.control}
            name="arv"
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Repairs</label>
          <div className="space-y-3">
            {repairs.map((repair, index) => (
              <div key={index} className="flex gap-2">
                <Input 
                  placeholder="Repair item"
                  value={repair.name}
                  onChange={(e) => updateRepair(index, 'name', e.target.value)}
                  className="flex-1"
                />
                <Input 
                  placeholder="Cost"
                  value={repair.cost}
                  onChange={(e) => updateRepair(index, 'cost', e.target.value)}
                  className="w-24"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeRepair(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addRepair}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Repair Item
            </Button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent</label>
          <FormField
            control={form.control}
            name="rentTotalMonthly"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Actual or projected" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Operating Expenses</h3>
        <div className="space-y-3">
          {expenses.map((expense, index) => (
            <div key={index} className="grid grid-cols-3 gap-2">
              <Input 
                placeholder="Expense name"
                value={expense.name}
                onChange={(e) => updateExpense(index, 'name', e.target.value)}
              />
              <Input 
                placeholder="Amount"
                value={expense.amount}
                onChange={(e) => updateExpense(index, 'amount', e.target.value)}
              />
              <div className="flex gap-2">
                <Select 
                  value={expense.frequency} 
                  onValueChange={(value) => updateExpense(index, 'frequency', value)}
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeExpense(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addExpense}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
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
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Property Images</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">Drag and drop images or click to upload</p>
            <Button variant="outline">Choose Files</Button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Video Walkthrough URL</label>
        <FormField
          control={form.control}
          name="videoWalkthrough"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="YouTube, Vimeo, or cloud storage link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-sm text-gray-500 mt-1">Optional: Add a video tour or walkthrough</p>
      </div>
    </div>
  );

  const renderAccessLogistics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lockbox Code</label>
          <Input placeholder="Optional" />
        </div>
        <div className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm text-gray-700">Tenant is aware of sale</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Access Instructions</label>
        <Textarea 
          placeholder="How to access the property for showings..."
          className="min-h-[100px]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Showing Availability Notes</label>
        <Textarea 
          placeholder="Best times for showings, special requirements, etc."
          className="min-h-[100px]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Access Type</label>
        <FormField
          control={form.control}
          name="accessType"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select access type" />
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
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return renderPropertyOverview();
      case 'details':
        return renderCoreDetails();
      case 'financial':
        return renderFinancialSnapshot();
      case 'descriptions':
        return renderDescriptions();
      case 'media':
        return renderMedia();
      case 'access':
        return renderAccessLogistics();
      default:
        return renderPropertyOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Property</h1>
                <p className="text-gray-600">{property?.address || "123 Maple Street"}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  Preview Public Listing
                  <ExternalLink className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  onClick={form.handleSubmit(handleSave)}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Edit Sections</h3>
            <div className="space-y-1">
              <SidebarItem
                icon={<Home className="h-5 w-5" />}
                label="Property Details"
                isActive={activeSection === 'overview'}
                onClick={() => setActiveSection('overview')}
              />
              <SidebarItem
                icon={<Building className="h-5 w-5" />}
                label="Core Details"
                isActive={activeSection === 'details'}
                onClick={() => setActiveSection('details')}
              />
              <SidebarItem
                icon={<DollarSign className="h-5 w-5" />}
                label="Financial Snapshot"
                isActive={activeSection === 'financial'}
                onClick={() => setActiveSection('financial')}
              />
              <SidebarItem
                icon={<FileText className="h-5 w-5" />}
                label="Descriptions"
                isActive={activeSection === 'descriptions'}
                onClick={() => setActiveSection('descriptions')}
              />
              <SidebarItem
                icon={<ImageIcon className="h-5 w-5" />}
                label="Media"
                isActive={activeSection === 'media'}
                onClick={() => setActiveSection('media')}
              />
              <SidebarItem
                icon={<MapPin className="h-5 w-5" />}
                label="Access & Logistics"
                isActive={activeSection === 'access'}
                onClick={() => setActiveSection('access')}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
              <Card>
                <CardContent className="p-6">
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