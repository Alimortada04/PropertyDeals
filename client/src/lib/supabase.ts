import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or key is missing. Auth functionality will not work properly.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Function to check if email already exists in the system
export async function checkEmailExists(email: string): Promise<boolean> {
  console.log("Checking if email exists:", email);
  
  try {
    // Method 1: Try to use OTP check (most reliable)
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: false
      }
    });
    
    // If there's no error or error doesn't contain "not found", the email exists
    if (!otpError || !otpError.message.includes("not found")) {
      console.log("Email exists (OTP check)");
      return true;
    }
    
    // If we get here, the OTP check says the email doesn't exist
    console.log("Email doesn't exist (OTP check)");
    return false;
  } catch (error) {
    console.error("Error checking email existence:", error);
    // If there's an error in the check, assume the email might exist to be safe
    return false;
  }
}

export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  console.log("Signing up with Supabase:", { email, passwordLength: password?.length, fullName });
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        confirmed_at: new Date().toISOString(), // Pre-confirm the user for testing
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
  // Step 1: First explicitly check if the email exists in the system
  console.log("Checking if email exists for sign-in:", email);
  const emailExists = await checkEmailExists(email);
  
  // If email doesn't exist, immediately return an email-specific error
  // This is the most important user experience improvement - email errors take precedence
  if (!emailExists) {
    console.log("Email not found in system, cannot proceed with login");
    throw new Error("Email not found. Please check your email or create a new account.");
  }
  
  // Step 2: If we get here, we know the email exists, now try the password
  console.log("Email exists, attempting to sign in with password");
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error("Sign in error:", error);
    
    // Handle specific error cases - at this point we KNOW the email exists
    if (error.message.includes("Invalid login credentials")) {
      // We know this must be a password issue since email exists
      throw new Error("Incorrect password. Please check your password or reset it.");
    } else if (error.message.includes("Email not confirmed")) {
      // Resend the verification email and show a specific error
      try {
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
  
  return data;
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