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
      
      // For any other error, we assume the user might exist
      console.log("Could not confirm email existence via password reset:", resetError.message);
    } catch (resetError) {
      console.error("Error checking email via password reset:", resetError);
    }
    
    // If we can't determine for sure, assume the email exists to be safe
    // for login checks (better to fail on password than to say user doesn't exist)
    console.log("Email existence uncertain, defaulting to assume it exists");
    return true;
  } catch (error) {
    console.error("Error in comprehensive email check:", error);
    // If there's an exception in the entire check process, assume it might exist
    // This prevents false negatives during login
    return true;
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