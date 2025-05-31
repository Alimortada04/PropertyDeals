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
  status: 'draft' | 'active' | 'pending' | 'sold';
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
  const fetchSellerProperties = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_profile')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

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
      const propertyData = {
        seller_id: user.id,
        status: 'draft' as const,
        is_public: false,
        created_by: 1, // Temporary - will be updated with proper user system
        view_count: 0,
        save_count: 0,
        offer_count: 0,
        featured_property: false,
        ...initialData,
      };

      const { data, error } = await supabase
        .from('property_profile')
        .insert([propertyData])
        .select()
        .single();

      if (error) {
        console.error('Error creating property draft:', error);
        toast({
          title: "Error",
          description: "Failed to create property draft.",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Draft Created",
        description: "Your property draft has been saved.",
      });

      // Refresh the properties list
      await fetchSellerProperties();
      
      return data;
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
        .eq('seller_id', user.id) // Ensure user owns the property
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
        .eq('seller_id', user.id) // Ensure user owns the property
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

  // Load properties when user changes
  useEffect(() => {
    if (user?.id) {
      fetchSellerProperties();
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
    activeProperties: properties.filter(p => p.status === 'active'),
    totalProperties: properties.length,
  };
}