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

export function usePropertyProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<PropertyProfile[]>([]);

  // Fetch all properties for the current seller
  const fetchSellerProperties = async (statusFilters?: string[]) => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      // Use user's UUID from auth - query by created_by field
      let query = supabase
        .from('property_profile')
        .select('*')
        .eq('created_by', user.id);

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

  // Clean property data to match actual database schema (snake_case)
  const cleanPropertyPayload = (data: any, userId: string) => {
    return {
      // Required fields - match actual database schema
      seller_id: userId,
      created_by: 1, // database uses created_by
      status: 'draft',
      is_public: false,
      featured_property: false,
      
      // Basic property info - match actual database field names (snake_case)
      name: data.name || null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      zip_code: data.zipCode || null, // database uses zip_code
      county: data.county || null,
      parcel_id: data.parcelId || null, // database uses parcel_id
      property_type: data.propertyType || null, // database uses property_type
      bedrooms: data.bedrooms ? Number(data.bedrooms) : null,
      bathrooms: data.bathrooms ? Number(data.bathrooms) : null,
      sqft: data.sqft ? Number(data.sqft) : null,
      square_feet: data.sqft ? Number(data.sqft) : null, // database has both sqft and square_feet
      lot_size: data.lotSize || null, // database uses lot_size
      year_built: data.yearBuilt ? Number(data.yearBuilt) : null, // database uses year_built
      parking: data.parking || null,
      condition: data.condition || null,
      occupancy_status: data.occupancyStatus || null, // database uses occupancy_status
      
      // Media - match actual database field names
      primary_image: data.primaryImage || null, // database uses primary_image
      gallery_images: data.galleryImages || [], // database uses gallery_images
      images: data.galleryImages || [], // database also has images field
      video_walkthrough: data.videoWalkthrough || null, // database uses video_walkthrough
      video_url: data.videoWalkthrough || null, // database also has video_url
      
      // Financial details - match actual database field names
      arv: data.arv ? Number(data.arv) : null,
      rent_total_monthly: data.rentTotalMonthly ? Number(data.rentTotalMonthly) : null, // database uses rent_total_monthly
      monthly_rent: data.rentTotalMonthly ? Number(data.rentTotalMonthly) : null, // database also has monthly_rent
      rent_total_annual: data.rentTotalAnnual ? Number(data.rentTotalAnnual) : null, // database uses rent_total_annual
      rent_unit: data.rentUnit || [], // database uses rent_unit
      rental_units: data.rentUnit || [], // database also has rental_units
      expenses_total_monthly: data.expensesTotalMonthly ? Number(data.expensesTotalMonthly) : null, // database uses expenses_total_monthly
      expenses_total_annual: data.expensesTotalAnnual ? Number(data.expensesTotalAnnual) : null, // database uses expenses_total_annual
      expense_items: data.expenseItems || [], // database uses expense_items
      expenses: data.expenseItems || [], // database also has expenses
      
      // Deal information - match actual database field names
      access_type: data.accessType || null, // database uses access_type
      access_instructions: data.accessType || null, // database also has access_instructions
      closing_date: data.closingDate ? data.closingDate.toISOString().split('T')[0] : null, // database stores as text date
      comps: data.comps || [],
      purchase_agreement: data.purchaseAgreement || null, // database uses purchase_agreement
      assignment_agreement: data.assignmentAgreement || null, // database uses assignment_agreement
      
      // Pricing - match actual database field names
      purchase_price: data.purchasePrice ? Number(String(data.purchasePrice).replace(/[^0-9]/g, '')) : null, // database uses purchase_price
      listing_price: data.listingPrice ? Number(String(data.listingPrice).replace(/[^0-9]/g, '')) : null, // database uses listing_price
      assignment_fee: data.assignmentFee ? Number(String(data.assignmentFee).replace(/[^0-9]/g, '')) : null, // database uses assignment_fee
      
      // Additional details - match actual database field names
      repair_projects: data.repairProjects || [], // database uses repair_projects
      repairs: data.repairProjects || [], // database also has repairs
      repair_costs_total: data.repairCostsTotal ? Number(data.repairCostsTotal) : null, // database uses repair_costs_total
      estimated_repairs: data.repairCostsTotal ? Number(data.repairCostsTotal) : null, // database also has estimated_repairs
      jv_partners: data.jvPartners || [], // database uses jv_partners
      partners: data.jvPartners || [], // database also has partners
      description: data.description || null,
      additional_notes: data.additionalNotes || null, // database uses additional_notes
      notes: data.additionalNotes || null, // database also has notes
      tags: data.tags || [],
      
      // Visibility and stats - match actual database field names
      view_count: 0, // database uses view_count
      save_count: 0, // database uses save_count
      offer_count: 0, // database uses offer_count
      offer_ids: [], // database uses offer_ids
    };
  };

  // Create a new property draft
  const createPropertyDraft = async (initialData: Partial<PropertyProfile>) => {
    if (!user?.id) {
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
      const cleanPayload = cleanPropertyPayload(initialData, String(user.id));
      
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
    if (!user?.id) {
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
        .eq('created_by', user.id) // Ensure user owns the property
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
    if (!user?.id) {
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
        .eq('created_by', user.id) // Ensure user owns the property
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
    if (!user?.id) {
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
        .eq('seller_id', user.id); // Ensure user owns the property

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
    if (user?.id) {
      fetchSellerProperties(['draft', 'live', 'under contract']);
    } else {
      setProperties([]);
    }
  }, [user?.id]);

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