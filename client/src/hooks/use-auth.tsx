import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser, UserRole } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  signInWithEmail, 
  signInWithGoogle, 
  signInWithFacebook, 
  signUpWithEmail, 
  signOut as supabaseSignOut,
  getCurrentUser,
  onAuthStateChange
} from "@/lib/supabase";

type AuthContextType = {
  user: SelectUser | null;
  supabaseUser: any;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<any, Error, LoginData>;
  loginWithGoogleMutation: UseMutationResult<any, Error, void>;
  loginWithFacebookMutation: UseMutationResult<any, Error, void>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<any, Error, RegisterData>;
  switchRoleMutation: UseMutationResult<SelectUser, Error, { role: string }>;
  applyForRoleMutation: UseMutationResult<SelectUser, Error, { role: string, applicationData?: Record<string, any> }>;
};

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  password: string;
  fullName: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  
  // Load initial Supabase user on mount
  useEffect(() => {
    const loadUser = async () => {
      const initialUser = await getCurrentUser();
      setSupabaseUser(initialUser);
    };
    
    loadUser();
    
    // Subscribe to auth state changes
    const { data: authListener } = onAuthStateChange((user) => {
      setSupabaseUser(user);
    });
    
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);
  
  // Get additional user data from our backend when supabaseUser changes
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!supabaseUser,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      return await signInWithEmail(credentials.email, credentials.password);
    },
    onSuccess: (data) => {
      setSupabaseUser(data.user);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const loginWithGoogleMutation = useMutation({
    mutationFn: async () => {
      return await signInWithGoogle();
    },
    onError: (error: Error) => {
      toast({
        title: "Google login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const loginWithFacebookMutation = useMutation({
    mutationFn: async () => {
      return await signInWithFacebook();
    },
    onError: (error: Error) => {
      toast({
        title: "Facebook login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      console.log("Registering with data:", data);  // Debug logging
      
      // Validate fullName is not empty
      if (!data.fullName || data.fullName.trim() === '') {
        throw new Error("Full name is required");
      }
      
      try {
        const authData = await signUpWithEmail(data.email, data.password);
        console.log("Supabase auth response:", authData);  // Debug logging
        
        if (!authData.user) {
          throw new Error("Failed to create account in authentication service");
        }
        
        // If we successfully create the user in Supabase, also create a user in our database
        // Create a user in our database with default roles
        const userData: InsertUser = {
          username: data.email, // Use email as username
          password: "", // We don't store the password, it's managed by Supabase
          fullName: data.fullName.trim(), // Use trimmed fullName to avoid whitespace issues
          email: data.email,
          activeRole: "buyer",
          roles: {
            buyer: { status: "approved" },
            seller: { status: "not_applied" },
            rep: { status: "not_applied" }
          }
        };
        
        try {
          const res = await apiRequest("POST", "/api/register", userData);
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to register user in database");
          }
          const dbUser = await res.json();
          console.log("DB user created:", dbUser);  // Debug logging
          return { supabaseUser: authData.user, dbUser };
        } catch (error) {
          console.error("Error creating user in database:", error);
          // Still return the Supabase user to ensure login works
          return { supabaseUser: authData.user };
        }
      } catch (error) {
        console.error("Registration error:", error);
        throw error; // Re-throw to trigger onError handler
      }
    },
    onSuccess: (data: any) => {
      if (data && typeof data === 'object') {
        if (data.supabaseUser) {
          setSupabaseUser(data.supabaseUser);
        }
        if (data.dbUser) {
          queryClient.setQueryData(["/api/user"], data.dbUser);
        }
      }
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await supabaseSignOut();
      // Also logout from our backend
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      setSupabaseUser(null);
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logout successful",
        description: "You have been logged out.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const switchRoleMutation = useMutation({
    mutationFn: async ({ role }: { role: string }) => {
      const res = await apiRequest("POST", "/api/user/active-role", { role });
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Role switched",
        description: `You are now in ${user.activeRole} mode.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Role switch failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const applyForRoleMutation = useMutation({
    mutationFn: async ({ role, applicationData }: { role: string, applicationData?: Record<string, any> }) => {
      const res = await apiRequest("POST", "/api/user/apply-role", { role, applicationData });
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Application submitted",
        description: "Your role application has been submitted for review.",
      });
    },
    onError: (error: any) => {
      let description = error.message;
      // Handle specific error responses from the server
      if (error.response && error.response.status === 400) {
        description = "You've already applied for this role.";
      }
      
      toast({
        title: "Application failed",
        description,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        supabaseUser,
        isLoading,
        error,
        loginMutation,
        loginWithGoogleMutation,
        loginWithFacebookMutation,
        logoutMutation,
        registerMutation,
        switchRoleMutation,
        applyForRoleMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
