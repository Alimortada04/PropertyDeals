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

  // Sanitize payload utility function
  const sanitizePayload = (payload: any) => {
    const sanitize = (val: any) => (val === undefined ? null : val);

    return {
      name: sanitize(payload.name),
      address: sanitize(payload.address),
      city: sanitize(payload.city),
      state: sanitize(payload.state),
      zipcode: sanitize(payload.zipcode),
      county: sanitize(payload.county),
      parcel_id: sanitize(payload.parcel_id),
      property_type: sanitize(payload.property_type),
      bedrooms: sanitize(payload.bedrooms),
      bathrooms: sanitize(payload.bathrooms),
      sqft: sanitize(payload.sqft),
      lot_size: sanitize(payload.lot_size),
      year_built: sanitize(payload.year_built),
      parking: sanitize(payload.parking),
      primary_image: sanitize(payload.primary_image),
      gallery_images: Array.isArray(payload.gallery_images) ? payload.gallery_images : [],
      video_walkthrough: sanitize(payload.video_walkthrough),
      arv: sanitize(payload.arv),
      rent_total_monthly: sanitize(payload.rent_total_monthly),
      rent_total_annual: sanitize(payload.rent_total_annual),
      rent_units: Array.isArray(payload.rent_units) ? payload.rent_units : [],
      expense_items: Array.isArray(payload.expense_items) ? payload.expense_items : [],
      repair_projects: Array.isArray(payload.repair_projects) ? payload.repair_projects : [],
      property_condition: sanitize(payload.property_condition),
      access_type: sanitize(payload.access_type),
      closing_date: sanitize(payload.closing_date),
      purchase_price: sanitize(payload.purchase_price),
      listing_price: sanitize(payload.listing_price),
      assignment_fee: sanitize(payload.assignment_fee),
      purchase_agreement: sanitize(payload.purchase_agreement),
      assignment_agreement: sanitize(payload.assignment_agreement),
      offer_ids: Array.isArray(payload.offer_ids) ? payload.offer_ids : [],
      jv_partners: Array.isArray(payload.jv_partners) ? payload.jv_partners.map(String) : [],
      additional_notes: sanitize(payload.additional_notes),
      description: sanitize(payload.description),
      created_by: sanitize(payload.created_by),
      status: sanitize(payload.status) || 'draft',
      seller_id: sanitize(payload.seller_id),
      // Required boolean fields with defaults
      featured_property: payload.featured_property === true ? true : false
    };
  };

  // Clean property data to match actual Supabase schema
  const cleanPropertyPayload = (data: any, userId: string) => {
    // Utility function to safely handle undefined values
    const safe = (val: any) => val === undefined ? null : val;
    
    console.log("Input data for cleaning:", data);
    
    return {
      // Required fields - match actual database schema
      seller_id: userId, // seller_id is text field in DB (UUID)
      // Note: created_by is integer field - leaving it null for now
      status: 'draft',
      featured_property: safe(data.featuredProperty) || false,
      
      // Basic property info - exact field mapping as requested
      name: safe(data.name) || 'Untitled Property', // Property Title → name
      title: safe(data.name) || 'Untitled Property', // DB has both name and title
      address: safe(data.address), // Address → address
      city: safe(data.city), // City → city
      state: safe(data.state), // State → state
      zip_code: safe(data.zipCode), // Zip Code → zipcode (DB field is zip_code)
      county: safe(data.county), // County → county
      parcel_id: safe(data.parcelId), // Parcel ID → parcel_id
      property_type: safe(data.propertyType), // Property Type → property_type
      bedrooms: data.bedrooms ? Number(data.bedrooms) : null, // Bedrooms → bedrooms
      bathrooms: data.bathrooms ? Number(data.bathrooms) : null, // Bathrooms → bathrooms
      sqft: data.sqft ? Number(data.sqft) : null, // Square Footage → sqft
      square_feet: data.sqft ? Number(data.sqft) : null, // DB has both fields
      lot_size: safe(data.lotSize), // Lot Size → lot_size
      year_built: data.yearBuilt ? Number(data.yearBuilt) : null, // Year Built → year_built
      parking: safe(data.parking), // Parking → parking
      condition: safe(data.condition), // Property Condition → condition (not property_condition)
      
      // Media fields - file URLs after upload processing
      primary_image: safe(data.primaryImage), // Primary Image → primary_image
      gallery_images: Array.isArray(data.galleryImages) ? data.galleryImages : [], // Gallery Images → gallery_images
      images: Array.isArray(data.galleryImages) ? data.galleryImages : [], // DB has images field too
      video_walkthrough: safe(data.videoWalkthrough), // Video Walkthrough → video_walkthrough
      video_url: safe(data.videoWalkthrough), // DB has video_url field too
      
      // Financial details - convert strings to numbers and clean currency formatting
      arv: data.arv ? Number(String(data.arv).replace(/[$,]/g, '')) : null, // After Repair Value → arv
      listing_price: data.listingPrice ? Number(String(data.listingPrice).replace(/[$,]/g, '')) : null, // Listing Price → listing_price
      purchase_price: data.purchasePrice ? Number(String(data.purchasePrice).replace(/[$,]/g, '')) : null, // Purchase Price → purchase_price
      assignment_fee: data.assignmentFee ? Number(String(data.assignmentFee).replace(/[$,]/g, '')) : null, // Assignment Fee → assignment_fee
      estimated_repairs: data.repairCostsTotal ? Number(String(data.repairCostsTotal).replace(/[$,]/g, '')) : null,
      monthly_rent: data.rentTotalMonthly ? Number(String(data.rentTotalMonthly).replace(/[$,]/g, '')) : null, // Monthly Rent → monthly_rent
      rent_total_monthly: data.rentTotalMonthly ? Number(String(data.rentTotalMonthly).replace(/[$,]/g, '')) : null, // Monthly Rent → rent_total_monthly
      rent_total_annual: data.rentTotalAnnual ? Number(String(data.rentTotalAnnual).replace(/[$,]/g, '')) : null,
      expenses_total_monthly: data.expensesTotalMonthly ? Number(String(data.expensesTotalMonthly).replace(/[$,]/g, '')) : null,
      expenses_total_annual: data.expensesTotalAnnual ? Number(String(data.expensesTotalAnnual).replace(/[$,]/g, '')) : null,
      
      // JSONB fields - structured arrays
      rental_units: Array.isArray(data.rentUnit) ? data.rentUnit : [], // Unit Rent Breakdown → rental_units
      rent_unit: Array.isArray(data.rentUnit) ? data.rentUnit : [], // Unit Rent Breakdown → rent_unit  
      expenses: Array.isArray(data.expenseItems) ? data.expenseItems : [], // Expense Items → expenses
      expense_items: Array.isArray(data.expenseItems) ? data.expenseItems : [], // Expense Items → expense_items
      repairs: Array.isArray(data.repairProjects) ? data.repairProjects.map((project: any) => ({
        project_name: project.project_name || project.name || '',
        description: project.description || '',
        estimated_cost: project.estimated_cost ? Number(project.estimated_cost) : 0,
        supporting_file_url: project.supporting_file_url || project.fileUrl || ''
      })) : [], // Repair Projects → repairs
      repair_projects: Array.isArray(data.repairProjects) ? data.repairProjects.map((project: any) => ({
        project_name: project.project_name || project.name || '',
        description: project.description || '',
        estimated_cost: project.estimated_cost ? Number(project.estimated_cost) : 0,
        supporting_file_url: project.supporting_file_url || project.fileUrl || ''
      })) : [], // Repair Projects → repair_projects
      repair_costs_total: data.repairCostsTotal ? Number(String(data.repairCostsTotal).replace(/[$,]/g, '')) : null,
      
      // Deal and access details
      access_instructions: safe(data.accessType), // Access Type → access_instructions
      access_type: safe(data.accessType), // Access Type → access_type
      closing_date: data.closingDate ? (data.closingDate instanceof Date ? data.closingDate.toISOString().split('T')[0] : data.closingDate) : null, // Closing Date → closing_date
      comps: Array.isArray(data.comps) ? data.comps : [], // Comparable Properties → comps
      purchase_agreement: safe(data.purchaseAgreement), // Purchase Agreement → purchase_agreement (file URL)
      assignment_agreement: safe(data.assignmentAgreement), // Assignment Agreement → assignment_agreement (file URL)
      
      // Partners and notes
      partners: Array.isArray(data.jvPartners) ? data.jvPartners : [], // JV Partners → partners
      jv_partners: Array.isArray(data.jvPartners) ? data.jvPartners : [], // JV Partners → jv_partners
      notes: safe(data.additionalNotes) || safe(data.notes), // Additional Notes → notes
      additional_notes: safe(data.additionalNotes) || safe(data.notes), // Additional Notes → additional_notes
      description: safe(data.description), // Property Description → description
      tags: Array.isArray(data.tags) ? data.tags : [],
      
      // Stats and IDs
      view_count: 0,
      save_count: 0,
      offer_count: 0,
      offer_ids: Array.isArray(data.offerIds) ? data.offerIds : [] // Offer IDs → offer_ids
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
      const rawPayload = cleanPropertyPayload(initialData, supabaseUser.id);
      
      // Use sanitizePayload to ensure no undefined values
      const cleanPayload = sanitizePayload(rawPayload);
      
      console.log('Raw payload from cleanPropertyPayload:', rawPayload);
      console.log('Sanitized payload for Supabase:', cleanPayload);
      console.log('Critical field verification:', {
        seller_id: cleanPayload.seller_id,
        name: cleanPayload.name,
        address: cleanPayload.address,
        city: cleanPayload.city,
        state: cleanPayload.state,
        zipcode: cleanPayload.zipcode,
        property_type: cleanPayload.property_type,
        bedrooms: cleanPayload.bedrooms,
        bathrooms: cleanPayload.bathrooms,
        purchase_price: cleanPayload.purchase_price,
        listing_price: cleanPayload.listing_price,
        status: cleanPayload.status,
        closing_date: cleanPayload.closing_date,
        jv_partners: cleanPayload.jv_partners
      });

      let data, error;
      try {
        const result = await supabase
          .from('property_profile')
          .insert([cleanPayload])
          .select();
        
        data = result.data;
        error = result.error;
        
        console.log('Supabase insert result:', { data, error });
      } catch (insertError) {
        console.error('❌ Supabase insert threw exception:', insertError);
        toast({
          title: "Error",
          description: `Insert failed with exception: ${insertError}`,
          variant: "destructive",
        });
        return null;
      }

      if (error) {
        console.error('❌ Property insert failed with Supabase error:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
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