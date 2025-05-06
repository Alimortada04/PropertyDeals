import { useEffect, useState } from "react";
import { Redirect } from "wouter";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Parse any OAuth redirected hash fragments
        if (window.location.hash) {
          console.log("Hash fragment detected, processing OAuth callback");
        }
        
        // Get the current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!data.session) {
          throw new Error("No valid session found");
        }
        
        console.log("Auth callback successful:", data);
        
        // Try to sync the user with our database and create a profile if needed
        try {
          // First, check if we already have the user in our database
          const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("email", data.session.user.email)
            .maybeSingle();
            
          if (!existingUser) {
            console.log("User doesn't exist in our database, creating one now");
            
            // Generate a username from the email or user metadata
            const email = data.session.user.email || '';
            const fullName = data.session.user.user_metadata?.full_name || 
                             data.session.user.user_metadata?.name || 
                             email.split('@')[0];
            
            // Generate a unique username
            let username = fullName.toLowerCase().replace(/[^a-z0-9]/g, '') + 
                         Math.floor(100 + Math.random() * 900);
            
            // Create user in the users table
            const { error: userError } = await supabase.from("users").insert({
              username: username,
              fullName: fullName,
              email: email,
              userType: "buyer", // Default role
              isAdmin: false
            });
            
            if (userError) {
              console.warn("Failed to create user record:", userError);
            } else {
              console.log("User created successfully in database");
              
              // Try to create a profile as well if the table exists
              try {
                const { error: profileError } = await supabase.from("profiles").insert({
                  id: data.session.user.id,
                  user_id: data.session.user.id,
                  username: username,
                  full_name: fullName,
                  email: email,
                  avatar_url: data.session.user.user_metadata?.avatar_url || null,
                  active_role: "buyer",
                  roles: {
                    buyer: { status: "approved" },
                    seller: { status: "not_applied" },
                    rep: { status: "not_applied" }
                  },
                  created_at: new Date().toISOString(),
                });
                
                if (profileError) {
                  // If the profiles table doesn't exist, just log it
                  if (profileError.message?.includes("relation") && 
                      profileError.message?.includes("does not exist")) {
                    console.log("Profiles table doesn't exist - skipping profile creation");
                  } else {
                    console.warn("Profile creation failed:", profileError);
                  }
                } else {
                  console.log("Profile created successfully");
                }
              } catch (err) {
                console.warn("Error creating profile:", err);
              }
            }
          } else {
            console.log("User already exists in database");
          }
          
          // Verify user session with backend
          const response = await fetch('/api/user');
          if (!response.ok) {
            console.warn("Could not verify user session with backend:", response.statusText);
          }
        } catch (err) {
          console.warn("Backend sync error:", err);
        }
        
        setIsLoading(false);
      } catch (error: unknown) {
        console.error("Auth callback error:", error);
        let errorMessage = "Authentication failed";
        
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, []);

  if (error) {
    // If there was an error, display it and provide a link to the auth page
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-center text-[#803344] mb-4">Authentication Error</h1>
          <p className="text-center text-gray-700 mb-6">{error}</p>
          <a 
            href="/auth" 
            className="block w-full text-center py-3 bg-[#09261E] text-white rounded-md font-medium hover:bg-[#0c3a2d] transition-colors"
          >
            Return to Sign In
          </a>
        </div>
      </div>
    );
  }

  if (isLoading) {
    // Show a loading spinner while processing
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#09261E]" />
        <p className="mt-4 text-gray-700">Completing authentication...</p>
      </div>
    );
  }

  // Check if there's a specific redirect path in the URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const redirectPath = urlParams.get('redirect') || '/';
  const type = urlParams.get('type');
  
  // If this is a recovery (password reset) callback, redirect to reset-password page
  if (type === 'recovery') {
    // Include any tokens in the redirect
    const token = urlParams.get('token') || urlParams.get('access_token');
    if (token) {
      return <Redirect to={`/auth/reset-password?token=${token}&type=recovery`} />;
    }
    return <Redirect to="/auth/reset-password" />;
  } 
  // If this is a signup email verification callback, go directly to home
  else if (type === 'signup') {
    console.log("Email verification for signup completed, redirecting to home");
    return <Redirect to="/" />;
  }
  
  // For other authentication flows, redirect to the specified path or home
  return <Redirect to={redirectPath} />;
}