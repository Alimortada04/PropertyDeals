import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface PropertyProfile {
  id?: number;
  seller_id: number;
  title?: string | null;
  name?: string | null;
  status: 'draft' | 'active' | 'pending' | 'closed' | 'dropped';
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  county?: string | null;
  parcel_id?: string | null;
  description?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  square_feet?: number | null;
  sqft?: number | null;
  lot_size?: string | null;
  year_built?: number | null;
  property_type?: string | null;
  condition?: string | null;
  listing_price?: number | null;
  purchase_price?: number | null;
  arv?: number | null;
  estimated_repairs?: number | null;
  monthly_rent?: number | null;
  images?: any[] | null;
  gallery_images?: any[] | null;
  rental_units?: any[] | null;
  rent_unit?: any[] | null;
  expenses?: any[] | null;
  expense_items?: any[] | null;
  repairs?: any[] | null;
  repair_projects?: any[] | null;
  partners?: any[] | null;
  jv_partners?: any[] | null;
  comps?: any[] | null;
  tags?: any[] | null;
  featured_property?: boolean | null;
  access_type?: string | null;
  access_instructions?: string | null;
  closing_date?: string | null;
  purchase_agreement?: string | null;
  assignment_fee?: number | null;
  notes?: string | null;
  additional_notes?: string | null;
  is_public?: boolean | null;
  created_at?: string;
  updated_at?: string;
  published_at?: string | null;
  created_by?: number | null;
  primary_image?: string | null;
  video_walkthrough?: string | null;
  video_url?: string | null;
  parking?: string | null;
}

export const usePropertyProfile = () => {
  const [properties, setProperties] = useState<PropertyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      // For now, using seller_id = 1 to match existing data structure
      // This should be updated when user authentication is properly integrated
      const { data, error } = await supabase
        .from('property_profile')
        .select('*')
        .eq('seller_id', 1)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProperties(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const createProperty = async (propertyData: Partial<PropertyProfile>) => {
    try {
      const newProperty = {
        seller_id: 1, // Using integer seller_id to match current schema
        status: 'draft' as const,
        is_public: false,
        featured_property: false,
        ...propertyData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('property_profile')
        .insert(newProperty)
        .select()
        .single();

      if (error) throw error;

      setProperties(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateProperty = async (id: number, updates: Partial<PropertyProfile>) => {
    try {
      const { data, error } = await supabase
        .from('property_profile')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProperties(prev => 
        prev.map(prop => prop.id === id ? data : prop)
      );
      return data;
    } catch (err) {
      throw err;
    }
  };

  const publishProperty = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('property_profile')
        .update({ 
          status: 'active',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProperties(prev => 
        prev.map(prop => prop.id === id ? data : prop)
      );
      return data;
    } catch (err) {
      throw err;
    }
  };

  const deleteProperty = async (id: number) => {
    try {
      const { error } = await supabase
        .from('property_profile')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProperties(prev => prev.filter(prop => prop.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    properties,
    loading,
    error,
    createProperty,
    updateProperty,
    publishProperty,
    deleteProperty,
    refetch: fetchProperties
  };
};