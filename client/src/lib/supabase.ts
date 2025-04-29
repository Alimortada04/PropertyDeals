import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or key is missing. Auth functionality will not work properly.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function signUpWithEmail(email: string, password: string) {
  console.log("Signing up with Supabase:", { email, passwordLength: password?.length });
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        confirmed_at: new Date().toISOString(), // Pre-confirm the user for testing
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
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
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