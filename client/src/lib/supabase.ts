import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or key is missing. Auth functionality will not work properly.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Function to check if email already exists in the system
export async function checkEmailExists(email: string, isRegistrationCheck: boolean = false): Promise<boolean> {
  console.log("Checking if email exists:", email, "isRegistrationCheck:", isRegistrationCheck);
  
  try {
    // First check: Query our local database
    try {
      const { data: userFromDb } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (userFromDb) {
        console.log("Email exists in local database");
        return true;
      }
    } catch (dbError) {
      console.error("Error checking local database:", dbError);
    }
    
    // Second check: Try to sign in with OTP (password-less) which will fail with a specific
    // error if the user doesn't exist
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: false
      }
    });
    
    // If there's no error from the OTP request, the email exists
    if (!otpError) {
      console.log("Email exists (no error from OTP check)");
      return true;
    }
    
    // If there's an error message that specifically says "not found",
    // then the email doesn't exist
    if (otpError.message && otpError.message.includes("not found")) {
      console.log("Email doesn't exist (OTP check returned 'not found')");
      return false;
    }
    
    // Third check: Direct check against Supabase Auth (this is more reliable for existing users)
    try {
      // Only do this check for login, not for registration
      if (!isRegistrationCheck) {
        // Reset password will fail with "User not found" if the email doesn't exist
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });
        
        // If no error, the user exists
        if (!resetError) {
          console.log("Email exists (confirmed via password reset)");
          return true;
        }
        
        // If we get a "User not found" error, the email doesn't exist
        if (resetError.message && resetError.message.includes("not found")) {
          console.log("Email doesn't exist (confirmed via password reset)");
          return false;
        }
      }
      
      // For any other error or if we're checking during registration
      console.log("Could not confirm email existence via any method");
    } catch (resetError) {
      console.error("Error checking email via password reset:", resetError);
    }
    
    // For registration - if we've made it this far and nothing confirms the email exists, assume it's new
    if (isRegistrationCheck) {
      console.log("Email appears to be new (during registration check)");
      return false;
    }
    
    // For login - assume the email might exist to avoid false negatives
    console.log("Email existence uncertain, defaulting to assume it exists (for login)");
    return true;
  } catch (error) {
    console.error("Error in comprehensive email check:", error);
    
    // For registration check, default to letting the user try
    if (isRegistrationCheck) {
      return false;
    }
    
    // For login check, assume it might exist
    return true;
  }
}

export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  console.log("Signing up with Supabase:", { email, passwordLength: password?.length, fullName });
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`,
      data: {
        full_name: fullName || email.split('@')[0], // Use fullName if provided or fallback to part of email
      }
    }
  });
  
  if (error) {
    console.error("Supabase signup error:", error);
    throw error;
  }
  
  console.log("Supabase signup successful:", data);
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  console.log("Attempting to sign in with email and password");
  
  try {
    // Attempt to sign in directly
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Sign in error:", error);
      
      // Parse the error message to provide better user feedback
      if (error.message.includes("Invalid login credentials")) {
        // Check if the email exists
        const emailExists = await checkEmailExists(email);
        
        if (!emailExists) {
          throw new Error("We couldn't find an account with this email. Please check your email or create a new account.");
        } else {
          // If email exists, then it's a password issue
          throw new Error("Incorrect password. Please check your password or reset it.");
        }
      } else if (error.message.includes("Email not confirmed") || error.message.includes("verification required")) {
        // Resend the verification email and show a specific error
        try {
          console.log("User needs to verify email, attempting to resend verification email");
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: email,
          });
          
          if (resendError) {
            console.error("Error resending verification email:", resendError);
          } else {
            console.log("Verification email resent successfully");
          }
        } catch (resendError) {
          console.error("Error resending verification email:", resendError);
        }
        
        throw new Error("Email not confirmed. We've sent a new verification email - please check your inbox and verify your email address before signing in.");
      }
      
      // For any other errors
      throw error;
    }
    
    console.log("Sign in successful");
    return data;
  } catch (error) {
    console.error("Error in signInWithEmail:", error);
    throw error; // Re-throw to be handled by the calling code
  }
}

export async function signInWithGoogle() {
  console.log("Initiating Google OAuth login");
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        prompt: 'select_account'  // Show the account selector even if user is already logged in
      }
    },
  });
  
  if (error) {
    console.error("Google OAuth error:", error);
    throw error;
  }
  
  console.log("Google OAuth initiated:", data);
  return data;
}

export async function signInWithFacebook() {
  console.log("Initiating Facebook OAuth login");
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) {
    console.error("Facebook OAuth error:", error);
    throw error;
  }
  
  console.log("Facebook OAuth initiated:", data);
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

// Set up auth state change listener
export function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
}

// Seller profile functions
export type SellerStatus = 'none' | 'pending' | 'rejected' | 'paused' | 'banned' | 'active';

export interface SellerOnboardingData {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  yearsInRealEstate: string;
  businessType: string;
  
  // Step 2
  targetMarkets: string[];
  dealTypes: string[];
  maxDealVolume: string;
  hasBuyerList: boolean;
  isDirectToSeller: boolean;
  
  // Step 3
  purchaseAgreements: File[] | null;
  assignmentContracts: File[] | null;
  notes: string;
  websiteUrl: string;
  socialFacebook: string;
  socialInstagram: string;
  socialLinkedin: string;
  hasProofOfFunds: boolean;
  usesTitleCompany: boolean;
  
  // Application state
  isDraft: boolean;
  status: SellerStatus;
}

// Function to get seller status for current user
export async function getSellerStatus(): Promise<SellerStatus> {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) return 'none';
    
    const { data: seller, error } = await supabase
      .from('sellers')
      .select('status')
      .eq('userId', authUser.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching seller status:', error);
      return 'none';
    }
    
    return seller?.status as SellerStatus || 'none';
  } catch (error) {
    console.error('Error in getSellerStatus:', error);
    return 'none';
  }
}

// Function to get seller profile data
export async function getSellerProfile(): Promise<SellerOnboardingData | null> {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) return null;
    
    const { data: seller, error } = await supabase
      .from('sellers')
      .select('*')
      .eq('userId', authUser.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching seller profile:', error);
      return null;
    }
    
    if (!seller) return null;
    
    // Convert from database format to application format
    return {
      fullName: seller.fullName,
      email: seller.email,
      phone: seller.phone,
      businessName: seller.businessName || '',
      yearsInRealEstate: seller.yearsInRealEstate,
      businessType: seller.businessType,
      
      targetMarkets: seller.targetMarkets || [],
      dealTypes: seller.dealTypes || [],
      maxDealVolume: seller.maxDealVolume,
      hasBuyerList: seller.hasBuyerList || false,
      isDirectToSeller: seller.isDirectToSeller || false,
      
      purchaseAgreements: null, // Files can't be retrieved this way
      assignmentContracts: null, // Files can't be retrieved this way
      notes: seller.notes || '',
      websiteUrl: seller.websiteUrl || '',
      socialFacebook: seller.socialFacebook || '',
      socialInstagram: seller.socialInstagram || '',
      socialLinkedin: seller.socialLinkedin || '',
      hasProofOfFunds: seller.hasProofOfFunds || false,
      usesTitleCompany: seller.usesTitleCompany || false,
      
      isDraft: seller.isDraft || true,
      status: seller.status as SellerStatus || 'none'
    };
  } catch (error) {
    console.error('Error in getSellerProfile:', error);
    return null;
  }
}

// Function to save seller profile data (create or update)
export async function saveSellerProfile(data: Partial<SellerOnboardingData>, isDraft = true): Promise<boolean> {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) return false;
    
    // Check if seller profile already exists
    const { data: existingSeller } = await supabase
      .from('sellers')
      .select('id')
      .eq('userId', authUser.id)
      .maybeSingle();
    
    // Prepare data for database (omit file objects)
    const dbData = {
      ...data,
      userId: authUser.id,
      isDraft,
      purchaseAgreements: null, // Handle file uploads separately
      assignmentContracts: null // Handle file uploads separately
    };
    
    let result;
    if (existingSeller) {
      // Update existing record
      result = await supabase
        .from('sellers')
        .update(dbData)
        .eq('userId', authUser.id);
    } else {
      // Create new record
      result = await supabase
        .from('sellers')
        .insert({
          ...dbData,
          userId: authUser.id,
          status: 'pending'
        });
    }
    
    if (result.error) {
      console.error('Error saving seller profile:', result.error);
      return false;
    }
    
    // TODO: Handle file uploads for purchase agreements and assignment contracts
    // This would use supabase.storage.from('files').upload()
    
    return true;
  } catch (error) {
    console.error('Error in saveSellerProfile:', error);
    return false;
  }
}

// Function to submit the final application
export async function submitSellerApplication(data: SellerOnboardingData): Promise<boolean> {
  try {
    return saveSellerProfile(data, false);
  } catch (error) {
    console.error('Error in submitSellerApplication:', error);
    return false;
  }
}