import { supabase } from '@/lib/supabase';

export interface BuyerProfile {
  id?: string;
  user_id: string;
  full_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  is_public?: boolean;
  
  // Business Info
  business_name?: string;
  in_real_estate_since?: number;
  type_of_buyer?: string[];
  
  // Social Media
  website?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  
  // Uploads
  profile_photo_url?: string;
  banner_image_url?: string;
  
  // Investment Criteria
  markets?: string[];
  property_types?: string[];
  property_conditions?: string[];
  ideal_budget_min?: number;
  ideal_budget_max?: number;
  
  // Deal Preferences
  financing_methods?: string[];
  preferred_financing_method?: string;
  closing_timeline?: string;
  number_of_deals_last_12_months?: number;
  goal_deals_next_12_months?: number;
  total_deals_done?: number;
  current_portfolio_count?: number;
  
  // Verification
  proof_of_funds_url?: string;
  proof_of_funds_verified?: boolean;
  
  created_at?: string;
  updated_at?: string;
}

// Get buyer profile for current user
export async function getBuyerProfile(userId: string): Promise<BuyerProfile | null> {
  try {
    const { data, error } = await supabase
      .from('buyer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found, return null
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching buyer profile:', error);
    throw error;
  }
}

// Create or update buyer profile
export async function upsertBuyerProfile(profile: Partial<BuyerProfile>): Promise<BuyerProfile> {
  try {
    const { data, error } = await supabase
      .from('buyer_profiles')
      .upsert(profile, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error upserting buyer profile:', error);
    throw error;
  }
}

// Check if username is available
export async function isUsernameAvailable(username: string, currentUserId?: string): Promise<boolean> {
  try {
    let query = supabase
      .from('buyer_profiles')
      .select('user_id')
      .eq('username', username);

    if (currentUserId) {
      query = query.neq('user_id', currentUserId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data.length === 0;
  } catch (error) {
    console.error('Error checking username availability:', error);
    throw error;
  }
}

// Upload file to Supabase Storage
export async function uploadFile(
  file: File,
  bucket: string,
  path: string
): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Upload profile photo
export async function uploadProfilePhoto(file: File, userId: string): Promise<string> {
  return uploadFile(file, 'public', `profiles/${userId}`);
}

// Upload banner image
export async function uploadBannerImage(file: File, userId: string): Promise<string> {
  return uploadFile(file, 'public', `banners/${userId}`);
}

// Upload proof of funds (private)
export async function uploadProofOfFunds(file: File, userId: string): Promise<string> {
  return uploadFile(file, 'private', `proof_of_funds/${userId}`);
}