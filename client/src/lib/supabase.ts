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
    // The most reliable way to check if an email exists is to try to sign in with OTP
    // and specifically check for the "not found" error message
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
    
    // For other error messages (rate limiting, etc.), we can't be sure
    // But most likely if we got an error here that's not "not found", the email exists
    console.log("Email existence unknown, got error:", otpError.message);
    console.log("Assuming email doesn't exist to allow registration attempt");
    return false;
  } catch (error) {
    console.error("Error checking email existence:", error);
    // If there's an exception in the check, don't prevent registration
    console.log("Assuming email doesn't exist due to error");
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
  // We'll let the signin page handle email existence checks
  // This is because if we throw an error here, it would skip the password check
  // Instead we want to allow the UI to display appropriate errors
  
  // Just proceed directly with the password attempt
  console.log("Attempting to sign in with password");
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