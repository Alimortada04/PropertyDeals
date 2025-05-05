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
        
        // Try to sync the user with our database
        try {
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
  const redirectPath = urlParams.get('redirect') || '/home';
  
  // Redirect to the specified path or home after successful authentication
  return <Redirect to={redirectPath} />;
}