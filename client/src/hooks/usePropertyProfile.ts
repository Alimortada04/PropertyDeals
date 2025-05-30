import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface PropertyProfile {
  id?: number;
  seller_id: string;
  name?: string | null;
  status: 'draft' | 'active' | 'pending' | 'closed' | 'dropped';
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  description?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  squareFootage?: number | null;
  lotSize?: number | null;
  yearBuilt?: number | null;
  propertyType?: string | null;
  condition?: string | null;
  price?: number | null;
  arv?: number | null;
  purchasePrice?: number | null;
  marketValue?: number | null;
  rehab?: number | null;
  images?: any[] | null;
  documents?: any[] | null;
  rentUnit?: any[] | null;
  expenseItems?: any[] | null;
  repairProjects?: any[] | null;
  jvPartners?: any[] | null;
  galleryImages?: any[] | null;
  comps?: any[] | null;
  tags?: any[] | null;
  featuredProperty?: boolean | null;
  accessType?: string | null;
  created_at?: string;
  updated_at?: string;
  published_at?: string | null;
}

export const usePropertyProfile = () => {
  const [properties, setProperties] = useState<PropertyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('property_profile')
        .select('*')
        .eq('seller_id', user.id)
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      const newProperty = {
        seller_id: user.id,
        status: 'draft' as const,
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