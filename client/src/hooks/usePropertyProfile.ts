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

  // Direct field mapping from frontend form to Supabase property_profile table
  const createPropertyPayload = (formData: any, sellerId: string) => {
    console.log("Raw form data:", formData);
    
    // Helper function to sanitize values (replace undefined with null)
    const sanitize = (value: any) => value === undefined ? null : value;
    
    // Helper function to parse numbers and remove currency formatting
    const parseNumber = (value: any) => {
      if (!value) return null;
      const cleaned = String(value).replace(/[$,]/g, '');
      const parsed = Number(cleaned);
      return isNaN(parsed) ? null : parsed;
    };
    
    // Helper function to format date
    const formatDate = (date: any) => {
      if (!date) return null;
      if (date instanceof Date) return date.toISOString().split('T')[0];
      return String(date);
    };
    
    // Direct field mapping to match exact database schema
    const payload = {
      // Required fields
      seller_id: sellerId,
      status: 'draft',
      featured_property: false,
      
      // Basic property information - exact column names from schema
      name: sanitize(formData.name) || 'Untitled Property',
      title: sanitize(formData.name) || 'Untitled Property', // DB has both name and title
      address: sanitize(formData.address),
      city: sanitize(formData.city),
      state: sanitize(formData.state),
      zip_code: sanitize(formData.zipCode),
      county: sanitize(formData.county),
      parcel_id: sanitize(formData.parcelId),
      property_type: sanitize(formData.propertyType),
      bedrooms: parseNumber(formData.bedrooms),
      bathrooms: parseNumber(formData.bathrooms),
      sqft: parseNumber(formData.sqft),
      square_feet: parseNumber(formData.sqft), // DB has both sqft and square_feet
      lot_size: sanitize(formData.lotSize),
      year_built: parseNumber(formData.yearBuilt),
      parking: sanitize(formData.parking),
      condition: sanitize(formData.condition), // Schema shows 'condition', not 'property_condition'
      
      // Media files
      primary_image: sanitize(formData.primaryImage),
      gallery_images: Array.isArray(formData.galleryImages) ? formData.galleryImages : [],
      images: Array.isArray(formData.galleryImages) ? formData.galleryImages : [], // DB has both
      video_walkthrough: sanitize(formData.videoWalkthrough),
      video_url: sanitize(formData.videoWalkthrough), // DB has both
      
      // Financial information
      arv: parseNumber(formData.arv),
      listing_price: parseNumber(formData.listingPrice),
      purchase_price: parseNumber(formData.purchasePrice),
      assignment_fee: parseNumber(formData.assignmentFee),
      estimated_repairs: parseNumber(formData.repairCostsTotal),
      monthly_rent: parseNumber(formData.rentTotalMonthly),
      rent_total_monthly: parseNumber(formData.rentTotalMonthly), // DB has both
      rent_total_annual: parseNumber(formData.rentTotalAnnual),
      expenses_total_monthly: parseNumber(formData.expensesTotalMonthly),
      expenses_total_annual: parseNumber(formData.expensesTotalAnnual),
      
      // Structured data (JSONB)
      rental_units: Array.isArray(formData.rentUnit) ? formData.rentUnit : [],
      rent_unit: Array.isArray(formData.rentUnit) ? formData.rentUnit : [], // DB has both
      expenses: Array.isArray(formData.expenseItems) ? formData.expenseItems : [],
      expense_items: Array.isArray(formData.expenseItems) ? formData.expenseItems : [], // DB has both
      repairs: Array.isArray(formData.repairProjects) ? formData.repairProjects : [],
      repair_projects: Array.isArray(formData.repairProjects) ? formData.repairProjects : [], // DB has both
      repair_costs_total: parseNumber(formData.repairCostsTotal),
      
      // Additional details
      access_instructions: sanitize(formData.accessType),
      access_type: sanitize(formData.accessType), // DB has both
      closing_date: formatDate(formData.closingDate),
      purchase_agreement: sanitize(formData.purchaseAgreement),
      assignment_agreement: sanitize(formData.assignmentAgreement),
      comps: Array.isArray(formData.comps) ? formData.comps : [],
      partners: Array.isArray(formData.jvPartners) ? formData.jvPartners : [],
      jv_partners: Array.isArray(formData.jvPartners) ? formData.jvPartners : [], // DB has both
      notes: sanitize(formData.additionalNotes),
      additional_notes: sanitize(formData.additionalNotes), // DB has both
      description: sanitize(formData.description),
      tags: Array.isArray(formData.tags) ? formData.tags : [],
      
      // Stats and metadata
      offer_ids: Array.isArray(formData.offerIds) ? formData.offerIds : [],
      view_count: 0,
      save_count: 0,
      offer_count: 0,
      created_by: null
    };
    
    console.log("Sanitized payload for Supabase:", payload);
    return payload;
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
      
      console.log('Final payload for Supabase insert:', payload);
      
      // Insert into Supabase with detailed error handling
      const { data, error } = await supabase
        .from('property_profile')
        .insert([payload])
        .select();

      if (error) {
        console.error('❌ Supabase insert error:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        toast({
          title: "Error",
          description: `Failed to create property listing: ${error.message}`,
          variant: "destructive",
        });
        return null;
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ No data returned from insert');
        toast({
          title: "Warning", 
          description: "Property was created but no data was returned.",
          variant: "destructive",
        });
        return null;
      }

      const createdProperty = data[0];
      console.log('✅ Property created successfully:', createdProperty);

      toast({
        title: "Success",
        description: "Property listing created successfully!",
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