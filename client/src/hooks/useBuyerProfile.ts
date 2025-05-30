import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface BuyerProfile {
  id: string;
  phone?: string | null;
  location?: string | null;
  bio?: string | null;
  business_name?: string | null;
  type_of_buyer?: string | null;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  profile_photo?: string | null;
  banner_image?: string | null;
  markets?: any[];
  property_types?: any[];
  property_conditions?: any[];
  ideal_budget_min?: number | null;
  ideal_budget_max?: number | null;
  financing_methods?: any[];
  preferred_financing_method?: string | null;
  closing_timeline?: string | null;
  number_of_deals_last_12_months?: number | null;
  goal_deals_next_12_months?: number | null;
  total_deals_done?: number | null;
  current_portfolio_count?: number | null;
  proof_of_funds?: string | null;
  past_properties?: any[];
  created_at?: string;
  updated_at?: string;
}

export const useBuyerProfile = () => {
  const [profile, setProfile] = useState<BuyerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('buyer_profile')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<BuyerProfile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (profile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('buyer_profile')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', user.id)
          .select()
          .single();

        if (error) throw error;
        setProfile(data);
        return data;
      } else {
        // Create new profile
        const profileData = {
          id: user.id,
          ...updates,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('buyer_profile')
          .insert(profileData)
          .select()
          .single();

        if (error) throw error;
        setProfile(data);
        return data;
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile
  };
};