import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';

export interface PropertyProfile {
  id?: number;
  seller_id: string;
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  county?: string;
  parcel_id?: string;
  property_type?: string;
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
  gallery_images?: string[];
  video_walkthrough?: string;
  
  // Finance
  arv?: number;
  rent_total_monthly?: number;
  rent_total_annual?: number;
  rent_unit?: any;
  expenses_total_monthly?: number;
  expenses_total_annual?: number;
  expense_items?: any;
  
  // Logistics
  access_type?: string;
  closing_date?: string;
  comps?: string[];
  purchase_agreement?: string;
  assignment_agreement?: string;
  
  // Final Details
  purchase_price?: number;
  listing_price?: number;
  assignment_fee?: number;
  repair_projects?: any;
  repair_costs_total?: number;
  jv_partners?: string[];
  description?: string;
  additional_notes?: string;
  tags?: string[];
  featured_property?: boolean;
  
  // Status and visibility
  status: 'draft' | 'live' | 'under contract' | 'closed' | 'dropped' | 'archived';
  is_public?: boolean;
  created_by?: number;
  
  // Engagement stats
  view_count?: number;
  save_count?: number;
  offer_count?: number;
  offer_ids?: string[];
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}

// File upload utility function
const uploadFileToSupabase = async (file: File, bucket: string, folder: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      console.error('File upload error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('File upload failed:', error);
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
      // Use user's UUID from auth - query by created_by field
      let query = supabase
        .from('property_profile')
        .select('*')
        .eq('created_by', supabaseUser.id);

      // Apply status filtering if provided
      if (statusFilters && statusFilters.length > 0) {
        query = query.in('status', statusFilters);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching property profiles:', error);
        toast({
          title: "Error",
          description: "Failed to load your properties.",
          variant: "destructive",
        });
        return;
      }

      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching property profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load your properties.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a single property by ID
  const fetchPropertyById = async (propertyId: number): Promise<PropertyProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('property_profile')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (error) {
        console.error('Error fetching property:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching property:', error);
      return null;
    }
  };

  // Clean property data to match Supabase schema exactly
  const cleanPropertyPayload = (data: any, userId: string) => {
    return {
      // Required fields
      created_by: userId,
      status: 'draft',
      is_public: false,
      featured_property: data.featuredProperty || false,
      
      // Basic property info - exact field mapping per your requirements
      name: data.name || null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      zipcode: data.zipCode || null, // zipCode → zipcode
      county: data.county || null,
      parcel_id: data.parcelId || null, // parcelId → parcel_id
      property_type: data.propertyType || null, // propertyType → property_type
      bedrooms: data.bedrooms ? Number(data.bedrooms) : null,
      bathrooms: data.bathrooms ? Number(data.bathrooms) : null,
      sqft: data.sqft ? Number(data.sqft) : null, // Square Footage → sqft
      lot_size: data.lotSize || null, // lotSize → lot_size
      year_built: data.yearBuilt ? Number(data.yearBuilt) : null, // yearBuilt → year_built
      parking: data.parking || null,
      property_condition: data.condition || null, // condition → property_condition
      
      // Media fields - upload files first, store URLs
      primary_image: data.primaryImage || null, // Upload file → store URL
      gallery_images: Array.isArray(data.galleryImages) ? data.galleryImages : [], // Upload files → store URL array
      video_walkthrough: data.videoWalkthrough || null, // Upload file or link → store URL
      
      // Financial details
      arv: data.arv ? Number(String(data.arv).replace(/[^0-9.]/g, '')) : null, // After Repair Value → arv
      rent_total_monthly: data.rentTotalMonthly ? Number(String(data.rentTotalMonthly).replace(/[^0-9.]/g, '')) : null, // Total Monthly Rent → rent_total_monthly
      rent_units: Array.isArray(data.rentUnit) ? data.rentUnit : [], // Unit Rent Breakdown → rent_units
      expense_items: Array.isArray(data.expenseItems) ? data.expenseItems : [], // Expenses → expense_items
      
      // Deal information
      purchase_price: data.purchasePrice ? Number(String(data.purchasePrice).replace(/[^0-9.]/g, '')) : null, // Purchase Price → purchase_price
      listing_price: data.listingPrice ? Number(String(data.listingPrice).replace(/[^0-9.]/g, '')) : null, // Listing Price → listing_price
      assignment_fee: data.assignmentFee ? Number(String(data.assignmentFee).replace(/[^0-9.]/g, '')) : null, // Assignment Fee → assignment_fee
      closing_date: data.closingDate ? (data.closingDate instanceof Date ? data.closingDate.toISOString().split('T')[0] : data.closingDate) : null, // Closing Date → closing_date
      access_type: data.accessType || null, // Access Type → access_type
      
      // Structured data fields
      repair_projects: Array.isArray(data.repairProjects) ? data.repairProjects.map((project: any) => ({
        project_name: project.project_name || project.name || '',
        description: project.description || '',
        estimated_cost: project.estimated_cost ? Number(project.estimated_cost) : 0,
        supporting_file_url: project.supporting_file_url || project.fileUrl || ''
      })) : [], // Repairs & Renovations → repair_projects (structured array)
      
      comps: Array.isArray(data.comps) ? data.comps : [], // Comparable Properties → comps
      additional_notes: data.additionalNotes || data.notes || null, // Additional Notes → additional_notes
      description: data.description || null, // Property Description → description
      tags: Array.isArray(data.tags) ? data.tags : [],
      
      // File uploads - store URLs after upload
      purchase_agreement: data.purchaseAgreement || null, // Upload file → store URL
      assignment_agreement: data.assignmentAgreement || null, // Upload file → store URL
      
      // UUID arrays
      jv_partners: Array.isArray(data.jvPartners) ? data.jvPartners.filter((id: any) => id && typeof id === 'string') : [], // Deal Partners → jv_partners (uuid[])
      offer_ids: Array.isArray(data.offerIds) ? data.offerIds.filter((id: any) => id && typeof id === 'string') : [], // offer_ids (uuid[])
      
      // Stats (initialize to 0)
      view_count: 0,
      save_count: 0,
      offer_count: 0,
    };
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
      // Clean the data to match Supabase schema
      const cleanPayload = cleanPropertyPayload(initialData, supabaseUser.id);
      
      console.log('Creating property with payload:', cleanPayload);

      const { data, error } = await supabase
        .from('property_profile')
        .insert([cleanPayload])
        .select();

      if (error) {
        console.error('❌ Property insert failed:', error);
        toast({
          title: "Error",
          description: `Failed to create property draft: ${error.message}`,
          variant: "destructive",
        });
        return null;
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ Insert response had no data:', data);
        toast({
          title: "Error",
          description: "Something went wrong. Draft not saved.",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Draft Created!",
        description: "Your property draft has been saved.",
      });

      // Refresh the properties list
      await fetchSellerProperties();
      
      return data[0];
    } catch (error) {
      console.error('Error creating property draft:', error);
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
  const updateProperty = async (propertyId: number, updates: Partial<PropertyProfile>) => {
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
        .from('property_profile')
        .update(updateData)
        .eq('id', propertyId)
        .eq('created_by', supabaseUser.id) // Ensure user owns the property
        .select()
        .single();

      if (error) {
        console.error('Error updating property:', error);
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
      console.error('Error updating property:', error);
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
        .from('property_profile')
        .update({
          status: 'active',
          is_public: true,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', propertyId)
        .eq('created_by', supabaseUser.id) // Ensure user owns the property
        .select()
        .single();

      if (error) {
        console.error('Error publishing property:', error);
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
      console.error('Error publishing property:', error);
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
        .from('property_profile')
        .delete()
        .eq('id', propertyId)
        .eq('created_by', supabaseUser.id); // Ensure user owns the property

      if (error) {
        console.error('Error deleting property:', error);
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
      console.error('Error deleting property:', error);
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
      fetchSellerProperties(['draft', 'live', 'under contract']);
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
    draftProperties: properties.filter(p => p.status === 'draft'),
    liveProperties: properties.filter(p => p.status === 'live'),
    underContractProperties: properties.filter(p => p.status === 'under contract'),
    closedProperties: properties.filter(p => p.status === 'closed'),
    droppedProperties: properties.filter(p => p.status === 'dropped'),
    archivedProperties: properties.filter(p => p.status === 'archived'),
    totalProperties: properties.length,
  };
}