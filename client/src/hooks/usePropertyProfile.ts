import { useState, useEffect } from "react";
import { useAuth } from "./use-auth";
import { supabase } from "@/lib/supabase";
import { useToast } from "./use-toast";

export interface PropertyProfile {
  id?: number;
  seller_id: string;

  // Basic Property Info
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  county?: string;
  parcel_id?: string;
  property_type?: string;

  // Property Details
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  lot_size?: string;
  year_built?: number;
  parking?: string;
  condition?: string;
  occupancy_status?: string;

  // Media
  primary_image?: string;
  gallery_images?: string[] | null;
  video_walkthrough?: string;

  // Financial Data
  arv?: number;
  purchase_price?: number;
  listing_price?: number;
  assignment_fee?: number;

  // Rental Income
  rent_total_monthly?: number;
  rent_total_annual?: number;
  rent_unit?: any[] | null;

  // Expenses
  expenses_total_monthly?: number;
  expenses_total_annual?: number;
  expense_items?: any[] | null;

  // Repairs & Improvements
  repair_costs_total?: number;
  repair_projects?: any[] | null;

  // Partnership & Legal
  jv_partners?: string[] | null;
  purchase_agreement?: string;
  assignment_agreement?: string;

  // Access & Logistics
  access_type?: string;
  closing_date?: string;

  // Marketing & Description
  description?: string;
  additional_notes?: string;
  tags?: string[] | null;
  comps?: string;

  // Visibility Settings
  featured_property?: boolean;

  // Status
  status:
    | "draft"
    | "live"
    | "offer_accepted"
    | "pending"
    | "closed"
    | "dropped";

  // Engagement stats
  view_count?: number;
  save_count?: number;
  offer_count?: number;
  offer_ids?: string[] | null;

  // Timestamps
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}

// File upload utility function
const uploadFileToSupabase = async (
  file: File,
  bucket: string,
  folder: string,
): Promise<string | null> => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      console.error("File upload error:", error);
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("File upload failed:", error);
    return null;
  }
};

export function usePropertyProfile() {
  const { user, supabaseUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<PropertyProfile[]>([]);

  // Fetch all properties for the current seller
  const fetchSellerProperties = async (statusFilters?: string[]) => {
    if (!supabaseUser?.id) return;

    setIsLoading(true);
    try {
      // Use user's UUID from auth - query by seller_id field (text field for UUIDs)
      let query = supabase
        .from("property_profile")
        .select("*")
        .eq("seller_id", supabaseUser.id)
        .eq("deleted", false);
      // Apply status filtering if provided
      if (statusFilters && statusFilters.length > 0) {
        query = query.in("status", statusFilters);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        console.error("Error fetching property profiles:", error);
        return;
      }

      setProperties(data || []);
    } catch (error) {
      console.error("Error fetching property profiles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a single property by ID
  const fetchPropertyById = async (
    propertyId: number,
  ): Promise<PropertyProfile | null> => {
    try {
      const { data, error } = await supabase
        .from("property_profile")
        .select("*")
        .eq("id", propertyId)
        .single();

      if (error) {
        console.error("Error fetching property:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error fetching property:", error);
      return null;
    }
  };

  // Rebuild property payload with exact field mapping to verified Supabase schema
  const createPropertyPayload = (formData: any, userId: string) => {
    console.log("Raw form data for property creation:", formData);

    // Helper to safely handle null/undefined values
    const safe = (value: any) =>
      value === undefined || value === "" ? null : value;

    // Helper to parse numbers
    const parseNum = (value: any) => {
      if (!value || value === "") return null;
      const cleaned = String(value).replace(/[$,]/g, "");
      const parsed = Number(cleaned);
      return isNaN(parsed) ? null : parsed;
    };

    // Helper to format dates
    const formatDate = (date: any) => {
      if (!date) return null;
      if (date instanceof Date) return date.toISOString().split("T")[0];
      return String(date);
    };

    // Sanitize payload to only include valid database fields
    const sanitizePayload = (payload: any) => {
      const allowedKeys = new Set([
        "id",
        "created_at",
        "status",
        "name",
        "address",
        "property_type",
        "city",
        "state",
        "zipcode",
        "bedrooms",
        "bathrooms",
        "year_built",
        "sqft",
        "lot_size",
        "parking",
        "county",
        "parcel_id",
        "primary_image",
        "gallery_images",
        "video_walkthrough",
        "rent_total_monthly",
        "rent_total_annual",
        "rent_unit",
        "expenses_total_monthly",
        "expenses_total_annual",
        "expense_items",
        "repair_costs_total",
        "repairs",
        "purchase_price",
        "listing_price",
        "assignment_fee",
        "arv",
        "access_type",
        "closing_date",
        "comps",
        "purchase_agreement",
        "assignment_agreement",
        "jv_partners",
        "description",
        "additional_notes",
        "view_count",
        "save_count",
        "offer_count",
        "offer_ids",
        "seller_id",
      ]);

      const cleanPayload: any = {};

      for (const key in payload) {
        if (allowedKeys.has(key)) {
          cleanPayload[key] = payload[key] ?? null;
        }
      }

      return cleanPayload;
    };

    // Create payload with ALL database fields (matching exact column names)
    const rawPayload = {
      // Required System Fields
      seller_id: userId,
      status: formData.status || "draft",
      deleted: false,

      // Property Info
      name: safe(formData.name),
      address: safe(formData.address),
      city: safe(formData.city),
      state: safe(formData.state),
      zipcode: safe(formData.zipCode),
      county: safe(formData.county),
      parcel_id: safe(formData.parcelId),
      property_type: safe(formData.propertyType),

      // Property Details
      bedrooms: safe(formData.bedrooms),
      bathrooms: safe(formData.bathrooms),
      sqft: safe(formData.sqft),
      lot_size: safe(formData.lotSize),
      year_built: safe(formData.yearBuilt),
      parking: safe(formData.parking),

      // Media
      primary_image: safe(formData.primary_image),
      gallery_images:
        Array.isArray(formData.gallery_images) &&
        formData.gallery_images.length > 0
          ? formData.gallery_images
          : null,
      video_walkthrough: safe(formData.video_walkthrough),

      // Financials
      arv: parseNum(formData.arv),
      purchase_price: parseNum(formData.purchasePrice),
      listing_price: parseNum(formData.listingPrice),
      assignment_fee: parseNum(formData.assignmentFee),

      // Rental Info (JSON & Calculated)
      rent_total_monthly: parseNum(formData.rentTotalMonthly),
      rent_total_annual: parseNum(formData.rentTotalMonthly)
        ? parseNum(formData.rentTotalMonthly)! * 12
        : null,
      rent_unit: Array.isArray(formData.rentUnit) ? formData.rentUnit : null,

      // Expenses (JSON & Calculated)
      expense_items: Array.isArray(formData.expenseItems)
        ? formData.expenseItems
        : null,
      expenses_total_monthly: parseNum(formData.expensesTotalMonthly),
      expenses_total_annual: parseNum(formData.expensesTotalMonthly)
        ? parseNum(formData.expensesTotalMonthly)! * 12
        : null,

      // Repairs (JSON & Calculated)
      repairs: Array.isArray(formData.repairProjects)
        ? formData.repairProjects.map((repair: any) => ({
            name: repair.name,
            description: repair.description,
            cost: parseNum(repair.cost),
            contractor: repair.contractor,
            quote: repair.quote ? repair.quote.name : null,
          }))
        : null,
      repair_costs_total: parseNum(formData.repairCostsTotal),

      // Legal Docs & JV
      purchase_agreement: safe(formData.purchaseAgreement),
      assignment_agreement: safe(formData.assignmentAgreement),
      jv_partners: Array.isArray(formData.jvPartners)
        ? formData.jvPartners
        : null,

      // Logistics
      access_type: safe(formData.accessType),
      closing_date: formatDate(formData.closingDate),

      // Description & Comps
      description: safe(formData.description),
      additional_notes: safe(formData.additionalNotes),
      comps: Array.isArray(formData.comps) ? formData.comps.join(", ") : null,

      // Engagement Defaults
      view_count: 0,
      save_count: 0,
      offer_count: 0,
      offer_ids: null,
    };

    // Apply sanitization to remove invalid fields
    const sanitizedPayload = sanitizePayload(rawPayload);

    console.log("Raw payload before sanitization:", rawPayload);
    console.log("Sanitized payload for Supabase insert:", sanitizedPayload);
    return sanitizedPayload;
  };

  // Create a new property draft
  const createPropertyDraft = async (initialData: Partial<PropertyProfile>) => {
    if (!supabaseUser?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a property listing.",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    try {
      // Create clean payload using direct field mapping
      const payload = createPropertyPayload(initialData, supabaseUser.id);

      console.log("Final payload for Supabase insert:", payload);

      // Insert into Supabase with detailed error handling
      const { data, error } = await supabase
        .from("property_profile")
        .insert([payload])
        .select();

      if (error) {
        console.error("❌ Supabase insert error:", error);
        console.error("Error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });

        toast({
          title: "Error",
          description: `Failed to create property listing: ${error.message}`,
          variant: "destructive",
        });
        return null;
      }

      if (!data || data.length === 0) {
        console.warn("⚠️ No data returned from insert");
        toast({
          title: "Warning",
          description: "Property was created but no data was returned.",
          variant: "destructive",
        });
        return null;
      }

      const createdProperty = data[0];
      console.log("✅ Property created successfully:", createdProperty);

      toast({
        title: "Success",
        description: "Property listing created successfully!",
      });

      // Refresh the properties list
      await fetchSellerProperties();

      return data[0];
    } catch (error) {
      console.error("Error creating property draft:", error);
      toast({
        title: "Error",
        description: "Failed to create property draft.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing property
  const updateProperty = async (
    propertyId: number,
    updates: Partial<PropertyProfile>,
  ) => {
    if (!supabaseUser?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to update properties.",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("property_profile")
        .update(updateData)
        .eq("id", propertyId)
        .eq("seller_id", supabaseUser.id)
        .eq("deleted", false) // Ensure user owns the property
        .select()
        .single();

      if (error) {
        console.error("Error updating property:", error);
        toast({
          title: "Error",
          description: "Failed to update property.",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Property Updated",
        description: "Your changes have been saved.",
      });

      // Refresh the properties list
      await fetchSellerProperties();

      return data;
    } catch (error) {
      console.error("Error updating property:", error);
      toast({
        title: "Error",
        description: "Failed to update property.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Publish a property (make it active and public)
  const publishProperty = async (propertyId: number) => {
    if (!supabaseUser?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to publish properties.",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("property_profile")
        .update({
          status: "active",
          is_public: true,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", propertyId)
        .eq("seller_id", supabaseUser.id)
        .eq("deleted", false) // Ensure user owns the property
        .select()
        .single();

      if (error) {
        console.error("Error publishing property:", error);
        toast({
          title: "Error",
          description: "Failed to publish property.",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Property Published",
        description: "Your property is now live and visible to buyers.",
      });

      // Refresh the properties list
      await fetchSellerProperties();

      return data;
    } catch (error) {
      console.error("Error publishing property:", error);
      toast({
        title: "Error",
        description: "Failed to publish property.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a property
  const deleteProperty = async (propertyId: number) => {
    if (!supabaseUser?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to delete properties.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("property_profile")
        .update({ deleted: true, updated_at: new Date().toISOString() })
        .eq("id", propertyId)
        .eq("seller_id", supabaseUser.id)
        .eq("deleted", false); // Ensure user owns the property

      if (error) {
        console.error("Error deleting property:", error);
        toast({
          title: "Error",
          description: "Failed to delete property.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Property Deleted",
        description: "The property has been removed.",
      });

      // Refresh the properties list
      await fetchSellerProperties();

      return true;
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load properties when user changes - use default status filters
  useEffect(() => {
    if (supabaseUser?.id) {
      fetchSellerProperties(["draft", "live", "offer_accepted"]);
    } else {
      setProperties([]);
    }
  }, [supabaseUser?.id]);

  return {
    properties,
    isLoading,
    fetchSellerProperties,
    fetchPropertyById,
    createPropertyDraft,
    updateProperty,
    publishProperty,
    deleteProperty,

    // Computed values
    draftProperties: properties.filter((p) => p.status === "draft"),
    liveProperties: properties.filter((p) => p.status === "live"),
    offerAcceptedProperties: properties.filter(
      (p) => p.status === "offer_accepted",
    ),
    pendingProperties: properties.filter((p) => p.status === "pending"),
    closedProperties: properties.filter((p) => p.status === "closed"),
    droppedProperties: properties.filter((p) => p.status === "dropped"),
    totalProperties: properties.length,
  };
}
