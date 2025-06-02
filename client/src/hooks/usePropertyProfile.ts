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
      // Use user's UUID from auth - query by seller_id field (text field for UUIDs)
      let query = supabase
        .from('property_profile')
        .select('*')
        .eq('seller_id', supabaseUser.id);

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

  // Clean property data to match actual Supabase schema
  const cleanPropertyPayload = (data: any, userId: string) => {
    return {
      // Required fields - match actual database schema
      seller_id: userId, // seller_id is text field in DB (UUID)
      // Note: created_by is integer field - leaving it null for now
      status: 'draft',
      is_public: false,
      featured_property: data.featuredProperty || false,
      
      // Basic property info - match actual DB field names
      name: data.name || null,
      title: data.name || null, // DB has both name and title
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      zip_code: data.zipCode || null, // DB uses zip_code
      county: data.county || null,
      parcel_id: data.parcelId || null, // DB uses parcel_id
      property_type: data.propertyType || null, // DB uses property_type
      bedrooms: data.bedrooms ? Number(data.bedrooms) : null,
      bathrooms: data.bathrooms ? Number(data.bathrooms) : null,
      sqft: data.sqft ? Number(data.sqft) : null,
      square_feet: data.sqft ? Number(data.sqft) : null, // DB has both sqft and square_feet
      lot_size: data.lotSize || null, // DB uses lot_size
      year_built: data.yearBuilt ? Number(data.yearBuilt) : null, // DB uses year_built
      parking: data.parking || null,
      condition: data.condition || null, // DB uses condition
      occupancy_status: data.occupancyStatus || null, // DB uses occupancy_status
      
      // Media fields - match actual DB schema
      primary_image: data.primaryImage || null,
      gallery_images: Array.isArray(data.galleryImages) ? data.galleryImages : [],
      images: Array.isArray(data.galleryImages) ? data.galleryImages : [], // DB has images field
      video_walkthrough: data.videoWalkthrough || null,
      video_url: data.videoWalkthrough || null, // DB has video_url field
      
      // Financial details - match actual DB schema
      arv: data.arv ? Number(String(data.arv).replace(/[^0-9.]/g, '')) : null,
      listing_price: data.listingPrice ? Number(String(data.listingPrice).replace(/[^0-9.]/g, '')) : null,
      purchase_price: data.purchasePrice ? Number(String(data.purchasePrice).replace(/[^0-9.]/g, '')) : null,
      assignment_fee: data.assignmentFee ? Number(String(data.assignmentFee).replace(/[^0-9.]/g, '')) : null,
      estimated_repairs: data.repairCostsTotal ? Number(String(data.repairCostsTotal).replace(/[^0-9.]/g, '')) : null,
      monthly_rent: data.rentTotalMonthly ? Number(String(data.rentTotalMonthly).replace(/[^0-9.]/g, '')) : null,
      rent_total_monthly: data.rentTotalMonthly ? Number(String(data.rentTotalMonthly).replace(/[^0-9.]/g, '')) : null,
      rent_total_annual: data.rentTotalAnnual ? Number(String(data.rentTotalAnnual).replace(/[^0-9.]/g, '')) : null,
      expenses_total_monthly: data.expensesTotalMonthly ? Number(String(data.expensesTotalMonthly).replace(/[^0-9.]/g, '')) : null,
      expenses_total_annual: data.expensesTotalAnnual ? Number(String(data.expensesTotalAnnual).replace(/[^0-9.]/g, '')) : null,
      
      // JSONB fields - match actual DB schema
      rental_units: Array.isArray(data.rentUnit) ? data.rentUnit : [],
      rent_unit: Array.isArray(data.rentUnit) ? data.rentUnit : [],
      expenses: Array.isArray(data.expenseItems) ? data.expenseItems : [],
      expense_items: Array.isArray(data.expenseItems) ? data.expenseItems : [],
      repairs: Array.isArray(data.repairProjects) ? data.repairProjects.map((project: any) => ({
        project_name: project.project_name || project.name || '',
        description: project.description || '',
        estimated_cost: project.estimated_cost ? Number(project.estimated_cost) : 0,
        supporting_file_url: project.supporting_file_url || project.fileUrl || ''
      })) : [],
      repair_projects: Array.isArray(data.repairProjects) ? data.repairProjects.map((project: any) => ({
        project_name: project.project_name || project.name || '',
        description: project.description || '',
        estimated_cost: project.estimated_cost ? Number(project.estimated_cost) : 0,
        supporting_file_url: project.supporting_file_url || project.fileUrl || ''
      })) : [],
      repair_costs_total: data.repairCostsTotal ? Number(String(data.repairCostsTotal).replace(/[^0-9.]/g, '')) : null,
      
      // Deal details
      access_instructions: data.accessType || null,
      access_type: data.accessType || null,
      closing_date: data.closingDate ? (data.closingDate instanceof Date ? data.closingDate.toISOString().split('T')[0] : data.closingDate) : null,
      comps: Array.isArray(data.comps) ? data.comps : [],
      purchase_agreement: data.purchaseAgreement || null,
      assignment_agreement: data.assignmentAgreement || null,
      
      // Partners and additional data
      partners: Array.isArray(data.jvPartners) ? data.jvPartners : [],
      jv_partners: Array.isArray(data.jvPartners) ? data.jvPartners : [],
      notes: data.additionalNotes || data.notes || null,
      additional_notes: data.additionalNotes || data.notes || null,
      description: data.description || null,
      tags: Array.isArray(data.tags) ? data.tags : [],
      
      // Stats - match actual DB schema
      view_count: 0,
      save_count: 0,
      offer_count: 0,
      offer_ids: Array.isArray(data.offerIds) ? data.offerIds : [],
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
        .eq('seller_id', supabaseUser.id); // Ensure user owns the property

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