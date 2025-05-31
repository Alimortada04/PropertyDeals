import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type SellerStatus = 'none' | 'pending' | 'rejected' | 'paused' | 'banned' | 'active';

export interface SellerProfileData {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  businessName?: string;
  yearsInRealEstate: string;
  businessType: string;
  
  // Step 2 data
  targetMarkets: string[];
  dealTypes: string[];
  maxDealVolume: string;
  hasBuyerList: boolean;
  isDirectToSeller: boolean;
  
  // Step 3 data
  notes?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  hasProofOfFunds: boolean;
  usesTitleCompany: boolean;
  
  // Application state
  status: SellerStatus;
  createdAt?: string;
}

export const useSellerProfile = () => {
  const [profile, setProfile] = useState<SellerProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSellerProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('seller_profile')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          id: data.id,
          fullName: data.full_name,
          email: data.email,
          phone: data.phone_number,
          businessName: data.business_name,
          yearsInRealEstate: data.years_in_real_estate,
          businessType: data.business_type,
          targetMarkets: data.target_markets || [],
          dealTypes: data.deal_types || [],
          maxDealVolume: data.max_deal_volume,
          hasBuyerList: data.has_buyer_list,
          isDirectToSeller: data.is_direct_to_seller,
          notes: data.notes,
          website: data.website,
          socialLinks: data.social_links,
          hasProofOfFunds: data.has_proof_of_funds,
          usesTitleCompany: data.uses_title_company,
          status: data.status as SellerStatus,
          createdAt: data.created_at
        });
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('Error fetching seller profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch seller profile');
    } finally {
      setLoading(false);
    }
  };

  const createSellerProfile = async (profileData: Omit<SellerProfileData, 'id' | 'status' | 'createdAt'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      const newProfile = {
        id: user.id,
        full_name: profileData.fullName,
        email: profileData.email,
        phone_number: profileData.phone,
        business_name: profileData.businessName || null,
        years_in_real_estate: profileData.yearsInRealEstate,
        business_type: profileData.businessType,
        target_markets: profileData.targetMarkets,
        deal_types: profileData.dealTypes,
        max_deal_volume: profileData.maxDealVolume,
        has_buyer_list: profileData.hasBuyerList,
        is_direct_to_seller: profileData.isDirectToSeller,
        notes: profileData.notes || null,
        website: profileData.website || null,
        social_links: profileData.socialLinks || null,
        has_proof_of_funds: profileData.hasProofOfFunds,
        uses_title_company: profileData.usesTitleCompany,
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('seller_profile')
        .insert(newProfile)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setProfile({
        ...profileData,
        id: data.id,
        status: 'pending',
        createdAt: data.created_at
      });

      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateSellerProfile = async (profileData: Partial<SellerProfileData>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      const updates: any = {};
      
      if (profileData.fullName) updates.full_name = profileData.fullName;
      if (profileData.email) updates.email = profileData.email;
      if (profileData.phone) updates.phone_number = profileData.phone;
      if (profileData.businessName !== undefined) updates.business_name = profileData.businessName;
      if (profileData.yearsInRealEstate) updates.years_in_real_estate = profileData.yearsInRealEstate;
      if (profileData.businessType) updates.business_type = profileData.businessType;
      if (profileData.targetMarkets) updates.target_markets = profileData.targetMarkets;
      if (profileData.dealTypes) updates.deal_types = profileData.dealTypes;
      if (profileData.maxDealVolume) updates.max_deal_volume = profileData.maxDealVolume;
      if (profileData.hasBuyerList !== undefined) updates.has_buyer_list = profileData.hasBuyerList;
      if (profileData.isDirectToSeller !== undefined) updates.is_direct_to_seller = profileData.isDirectToSeller;
      if (profileData.notes !== undefined) updates.notes = profileData.notes;
      if (profileData.website !== undefined) updates.website = profileData.website;
      if (profileData.socialLinks !== undefined) updates.social_links = profileData.socialLinks;
      if (profileData.hasProofOfFunds !== undefined) updates.has_proof_of_funds = profileData.hasProofOfFunds;
      if (profileData.usesTitleCompany !== undefined) updates.uses_title_company = profileData.usesTitleCompany;

      const { data, error } = await supabase
        .from('seller_profile')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          ...profileData
        });
      }

      return data;
    } catch (err) {
      throw err;
    }
  };

  const getSellerStatus = async (): Promise<SellerStatus> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return 'none';
      }

      const { data, error } = await supabase
        .from('seller_profile')
        .select('status')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data?.status as SellerStatus || 'none';
    } catch (err) {
      console.error('Error getting seller status:', err);
      return 'none';
    }
  };

  useEffect(() => {
    fetchSellerProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    createSellerProfile,
    updateSellerProfile,
    getSellerStatus,
    refetch: fetchSellerProfile
  };
};