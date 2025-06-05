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
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Trash2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp,
  Home,
  Building,
  DollarSign,
  FileText,
  Image,
  MapPin,
  Upload,
  ExternalLink
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// Property form schema based on database structure
const propertySchema = z.object({
  name: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  county: z.string().optional(),
  propertyType: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  sqft: z.string().optional(),
  yearBuilt: z.string().optional(),
  description: z.string().optional(),
  purchasePrice: z.string().optional(),
  listingPrice: z.string().optional(),
  arv: z.string().optional(),
  estimatedRepairs: z.string().optional(),
  monthlyRent: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          {icon}
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="border-t border-gray-200 bg-white">
          <div className="p-4 space-y-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default function PropertyEditor() {
  const [, params] = useRoute("/sellerdash/:userId/property/:propertyId");
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [property, setProperty] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Section states
  const [openSections, setOpenSections] = useState({
    overview: false,
    details: false,
    financial: true, // Default open like in screenshots
    description: false,
    media: false,
    access: false,
  });

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
      propertyType: "",
      bedrooms: "",
      bathrooms: "",
      sqft: "",
      yearBuilt: "",
      description: "",
      purchasePrice: "",
      listingPrice: "",
      arv: "",
      estimatedRepairs: "",
      monthlyRent: "",
    },
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
          .from("property_profiles")
          .select("*")
          .eq("id", propertyId)
          .eq("user_id", currentUser.id)
          .single();

        if (propertyError || !propertyData) {
          setError("Property not found or you don't have permission to edit it");
          setLoading(false);
          return;
        }

        setProperty(propertyData);

        // Populate form with property data
        form.reset({
          name: propertyData.name || "",
          address: propertyData.address || "",
          city: propertyData.city || "",
          state: propertyData.state || "",
          zipCode: propertyData.zip_code || "",
          county: propertyData.county || "",
          propertyType: propertyData.property_type || "",
          bedrooms: propertyData.bedrooms?.toString() || "",
          bathrooms: propertyData.bathrooms?.toString() || "",
          sqft: propertyData.sqft?.toString() || "",
          yearBuilt: propertyData.year_built?.toString() || "",
          description: propertyData.description || "",
          purchasePrice: propertyData.purchase_price?.toString() || "",
          listingPrice: propertyData.listing_price?.toString() || "",
          arv: propertyData.arv?.toString() || "",
          estimatedRepairs: propertyData.estimated_repairs?.toString() || "",
          monthlyRent: propertyData.monthly_rent?.toString() || "",
        });

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
        zip_code: data.zipCode,
        county: data.county,
        property_type: data.propertyType,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
        bathrooms: data.bathrooms ? parseFloat(data.bathrooms) : null,
        sqft: data.sqft ? parseInt(data.sqft) : null,
        year_built: data.yearBuilt ? parseInt(data.yearBuilt) : null,
        description: data.description,
        purchase_price: data.purchasePrice ? parseFloat(data.purchasePrice) : null,
        listing_price: data.listingPrice ? parseFloat(data.listingPrice) : null,
        arv: data.arv ? parseFloat(data.arv) : null,
        estimated_repairs: data.estimatedRepairs ? parseFloat(data.estimatedRepairs) : null,
        monthly_rent: data.monthlyRent ? parseFloat(data.monthlyRent) : null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("property_profiles")
        .update(updateData)
        .eq("id", propertyId)
        .eq("user_id", user.id);

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
    // Navigate to property detail page for preview
    window.open(`/property/${propertyId}`, '_blank');
  };

  const handleDelete = async () => {
    if (!user || !property || !confirm("Are you sure you want to delete this property?")) return;

    try {
      const { error } = await supabase
        .from("property_profiles")
        .delete()
        .eq("id", propertyId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property deleted successfully",
      });

      navigate(`/sellerdash/${userId}`);
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#135341] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Property</h1>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {error || "We couldn't load this property. It may not exist or you may not have permission to edit it."}
                </p>
              </div>
              
              <Button 
                onClick={() => navigate(`/sellerdash/${userId}`)}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/sellerdash/${userId}`)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreview}
            className="text-gray-600 hover:text-gray-900"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Public Listing
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Property</h1>
          <p className="text-gray-600">{property.address || "Property Editor"}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            
            {/* Property Overview Section */}
            <CollapsibleSection
              title="Property Overview"
              icon={<Home className="w-5 h-5 text-gray-600" />}
              isOpen={openSections.overview}
              onToggle={() => toggleSection('overview')}
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Modern Farmhouse" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Single Family" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single-family">Single Family</SelectItem>
                          <SelectItem value="multi-family">Multi Family</SelectItem>
                          <SelectItem value="condo">Condo</SelectItem>
                          <SelectItem value="townhouse">Townhouse</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />
                <div className="font-medium text-gray-900">Address</div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Maple Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Milwaukee" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="WI" {...field} />
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
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="53202" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Core Details Section */}
            <CollapsibleSection
              title="Core Details"
              icon={<Building className="w-5 h-5 text-gray-600" />}
              isOpen={openSections.details}
              onToggle={() => toggleSection('details')}
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="3" {...field} />
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
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.5" placeholder="2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sqft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Square Feet</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="2000" {...field} />
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
                      <FormLabel>Year Built</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1990" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CollapsibleSection>

            {/* Financial Snapshot Section */}
            <CollapsibleSection
              title="Financial Snapshot"
              icon={<DollarSign className="w-5 h-5 text-gray-600" />}
              isOpen={openSections.financial}
              onToggle={() => toggleSection('financial')}
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="listingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asking Price</FormLabel>
                      <FormControl>
                        <Input placeholder="459000" {...field} />
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
                      <FormLabel>ARV (After Repair Value)</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedRepairs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Repairs</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthlyRent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Rent</FormLabel>
                      <FormControl>
                        <Input placeholder="Actual or projected" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CollapsibleSection>

            {/* Description Section */}
            <CollapsibleSection
              title="Descriptions"
              icon={<FileText className="w-5 h-5 text-gray-600" />}
              isOpen={openSections.description}
              onToggle={() => toggleSection('description')}
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the property features, condition, and highlights..."
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CollapsibleSection>

            {/* Media Section */}
            <CollapsibleSection
              title="Media"
              icon={<Image className="w-5 h-5 text-gray-600" />}
              isOpen={openSections.media}
              onToggle={() => toggleSection('media')}
            >
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Media upload functionality coming soon</p>
              </div>
            </CollapsibleSection>

            {/* Access & Logistics Section */}
            <CollapsibleSection
              title="Access & Logistics"
              icon={<MapPin className="w-5 h-5 text-gray-600" />}
              isOpen={openSections.access}
              onToggle={() => toggleSection('access')}
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="county"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>County</FormLabel>
                      <FormControl>
                        <Input placeholder="Milwaukee County" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="text-gray-600 text-sm">
                  Additional access and logistics fields can be added here.
                </div>
              </div>
            </CollapsibleSection>

            {/* Action Buttons */}
            <div className="pt-6 space-y-3">
              <Button 
                type="submit" 
                className="w-full bg-[#135341] hover:bg-[#135341]/90 text-white"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>

              <Button 
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Property
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}