import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Redirect, Link, useLocation } from "wouter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowRight, Eye, EyeOff, CheckCircle2, Mail, AlertCircle, Copy, RefreshCw } from "lucide-react";
import { supabase, checkEmailExists } from "@/lib/supabase";
import { SiGoogle, SiFacebook, SiApple } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Enhanced password validation
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine((val) => /[A-Z]/.test(val), { message: "Must include an uppercase letter" })
  .refine((val) => /[a-z]/.test(val), { message: "Must include a lowercase letter" })
  .refine((val) => /\d/.test(val), { message: "Must include a number" });

// Registration schema (username is auto-generated)
const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name is required")
      .regex(/^[a-zA-Z\s'-]+$/, "Full name can only contain letters, spaces, hyphens, and apostrophes"),
    email: z.string().email("Please enter a valid email address"),
    password: passwordSchema,
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and privacy policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [generatedUsername, setGeneratedUsername] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { toast } = useToast();

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
    mode: "onBlur",
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();
  }, []);

  useEffect(() => {
    // Generate username when full name changes
    const fullName = registerForm.watch("fullName");
    if (fullName && fullName.length > 2) {
      setGeneratedUsername(generateUsername(fullName));
    } else {
      setGeneratedUsername(null);
    }
    // Register the watcher for fullName outside of useEffect's dependency array
    const subscription = registerForm.watch((value, { name, type }) => {
      // This will run whenever any form field changes
      // But we'll only process fullName changes
      if (name === "fullName" && value.fullName) {
        // No need to do anything here, the effect above will handle it
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const x = (clientX / width) - 0.5;
      const y = (clientY / height) - 0.5;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Early return AFTER all hooks are declared
  if (user) return <Redirect to="/" />;

  // Generate a username from full name without adding numbers initially
  const generateUsername = (fullName: string) => {
    if (!fullName) return null;
    
    // Remove non-alphanumeric characters and spaces, convert to lowercase
    const base = fullName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 20); // Limit base length but make it longer
      
    // Return just the name without numbers first - numbers only added if username exists
    return base;
  };

  // Check if a username exists in the database
  const checkUsernameAvailability = async (username: string) => {
    if (!username) return false;
    
    // Check against users table which we know exists
    const { data } = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .maybeSingle();
      
    return !data; // Return true if username does not exist (is available)
  };

  // Find an available username by incrementing the suffix if needed
  const findAvailableUsername = async (baseUsername: string): Promise<string> => {
    // First check if the base username is available
    if (await checkUsernameAvailability(baseUsername)) {
      return baseUsername;
    }
    
    // Try with different random suffixes up to 10 times
    for (let i = 0; i < 10; i++) {
      const suffix = Math.floor(100 + Math.random() * 900);
      const candidateUsername = `${baseUsername.replace(/\d+$/, '')}${suffix}`;
      
      if (await checkUsernameAvailability(candidateUsername)) {
        return candidateUsername;
      }
    }
    
    // If all attempts fail, add current timestamp for uniqueness
    return `${baseUsername.replace(/\d+$/, '')}${Date.now() % 10000}`;
  };

  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    // Reset all state before attempting registration
    setFormError(null);
    setFormSuccess(null);
    setVerificationRequired(false);
    setLoading(true);
    
    // Clear any existing email error
    registerForm.clearErrors("email");

    try {
      // Check if the email already exists in the Auth system
      console.log("Checking if email already exists:", values.email);
      
      // Direct check with Supabase Auth Admin API
      const { data: adminAuthCheck, error: adminAuthError } = await supabase
        .from('users')
        .select('email')
        .eq('email', values.email)
        .maybeSingle();
      
      console.log("Admin auth check result:", { adminAuthCheck, adminAuthError });
      
      // If we found a match, the email exists
      if (adminAuthCheck) {
        console.log("Email already exists in users table");
        registerForm.setError("email", {
          type: "manual",
          message: "Email already exists. Try signing in instead.",
        });
        setLoading(false);
        // Show toast
        toast({
          title: "Email already registered",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
        return; // Exit early, don't proceed with registration
      }
      
      // Fall back to our checkEmailExists function as a secondary check
      try {
        // Pass true as the second parameter to indicate this is a registration check
        const emailExists = await checkEmailExists(values.email, true);
        
        if (emailExists) {
          console.log("Email already exists via OTP check");
          registerForm.setError("email", {
            type: "manual",
            message: "Email already exists. Try signing in instead.",
          });
          setLoading(false);
          toast({
            title: "Email already registered",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
          return; // Exit early
        }
        
        console.log("Email is available, proceeding with registration");
      } catch (emailCheckError) {
        // If checks are inconclusive, we'll let Supabase Auth handle duplicates
        console.log("Email check function failed, relying on Auth API check:", emailCheckError);
      }
      
      // 1. Generate a username from the full name
      const baseUsername = generateUsername(values.fullName);
      if (!baseUsername) {
        throw new Error("Could not generate a valid username");
      }
      
      const finalUsername = await findAvailableUsername(baseUsername);
      console.log("Generated username:", finalUsername);
      
      // 2. Call Supabase Auth signup directly
      console.log("Attempting registration with Supabase Auth...");
      console.log("Registration data:", {
        email: values.email,
        passwordLength: values.password?.length,
        fullName: values.fullName,
        username: finalUsername
      });
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            username: finalUsername,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`,
        },
      });

      if (error) {
        console.error("Supabase signup error:", error);
        // Handle specific error cases
        if (error.message.includes("already exists") || 
            error.message.includes("already registered") ||
            error.message.includes("User already registered")) {
          registerForm.setError("email", {
            type: "manual",
            message: "Email already exists. Try signing in instead.",
          });
          setLoading(false);
          toast({
            title: "Email already registered",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
          return; // Exit early and don't throw error, so user stays on same page
        } else {
          throw new Error(error.message);
        }
      }
      
      console.log("Supabase signup successful:", data);
      
      if (!data.user) {
        throw new Error("Failed to create user account");
      }
      
      // Step 2: Create both a user record and profile record
      let localUserError = false;
      
      try {
        // 1. Create user in the users table
        const { error: userError } = await supabase.from("users").insert({
          id: data.user.id, // Use the Supabase auth user ID
          username: finalUsername,
          full_name: values.fullName,
          email: values.email,
          active_role: "buyer",
          is_admin: false
        });
        
        if (userError) {
          console.log("Local user creation failed, but auth account was created:", userError);
          localUserError = true;
        } else {
          console.log("User created successfully in local database");
          
          // 2. Create a matching profile in the profiles table if it exists
          try {
            // Try to insert into profiles table (will only work if table exists)
            const { error: profileError } = await supabase.from("profiles").insert({
              id: data.user.id, // Use Supabase auth ID
              user_id: data.user.id,
              username: finalUsername,
              full_name: values.fullName,
              email: values.email,
              avatar_url: null,
              active_role: "buyer",
              roles: { 
                buyer: { status: "approved" }, 
                seller: { status: "not_applied" }, 
                rep: { status: "not_applied" } 
              },
              created_at: new Date().toISOString(),
            });
            
            if (profileError) {
              // If the error is related to table not existing, just log it
              if (profileError.message?.includes("relation") && profileError.message?.includes("does not exist")) {
                console.log("Profiles table doesn't exist - skipping profile creation");
              } else {
                console.warn("Profile creation failed:", profileError);
              }
            } else {
              console.log("Profile created successfully");
            }
          } catch (profileError) {
            // This might happen if the profiles table doesn't exist
            console.log("Profile creation error:", profileError);
          }
        }
      } catch (localDbError) {
        console.error("Error with local database:", localDbError);
        localUserError = true;
      }
      
      if (localUserError) {
        console.warn("User created in Supabase Auth but failed to sync with local database");
      }

      // Step 3: Check if email confirmation is required
      if (data.user && !data.user.confirmed_at) {
        setVerificationRequired(true);
        setGeneratedUsername(finalUsername);
        setFormSuccess("Account created! Please check your email to verify your account.");
        toast({
          title: "Verification required",
          description: "We've sent a verification link to your email",
        });
      } else {
        // Auto-login on successful registration if verification not required
        setFormSuccess("Account created successfully!");
        toast({
          title: "Registration successful",
          description: "Your account has been created! Redirecting to dashboard...",
        });
        
        // Show a smooth transition animation before redirecting
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-500';
        overlay.innerHTML = `
          <div class="text-center">
            <div class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#09261E] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
            <p class="text-[#09261E] font-medium text-lg">Setting up your account...</p>
          </div>
        `;
        document.body.appendChild(overlay);
        
        // Redirect to home page after a short delay
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle user-friendly error messages
      let errorMessage = error.message || "An unexpected error occurred";
      
      // Only set form error if it's not already captured as a field error
      if (errorMessage.includes("already exists") || errorMessage.includes("already registered")) {
        // Don't set formError for email errors - these are already handled by the form field
        // Just set a toast notification
        toast({
          title: "Email already registered",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
      } else if (errorMessage.includes("sign up")) {
        errorMessage = "Unable to create your account. Please try again later.";
        setFormError(errorMessage);
        toast({
          title: "Registration failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        setFormError(errorMessage);
        toast({
          title: "Registration failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegistration = async (provider: "google" | "facebook") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?type=signup&redirect=/`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Social login failed",
        description: error.message || "Problem with your social login",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-white overflow-hidden">
      {/* Background Blobs - Animated with staggered animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary dark green large blob - top right */}
        <div
          className="absolute w-[700px] h-[700px] bg-[#09261E]/40 rounded-full blur-3xl -top-[10%] -right-[10%] animate-breathe"
          style={{ 
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
            '--blur-amount': '120px'
          } as React.CSSProperties}
        />
        
        {/* Wine accent blob - bottom left */}
        <div
          className="absolute w-[600px] h-[600px] bg-[#803344]/35 rounded-full blur-3xl -bottom-[15%] -left-[10%] animate-float"
          style={{ 
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * -20}px)`,
          }}
        />
        
        {/* Salmon accent blob - mid center */}
        <div
          className="absolute w-[500px] h-[500px] bg-[#E59F9F]/30 rounded-full blur-3xl top-[40%] left-[30%] animate-pulse-slow"
          style={{ 
            transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * 15}px)`,
          }}
        />
        
        {/* Silver blob - top left */}
        <div
          className="absolute w-[400px] h-[400px] bg-[#D8D8D8]/40 rounded-full blur-3xl top-[10%] left-[5%] animate-float-slow"
          style={{ 
            transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * 15}px)`,
          }}
        />
      </div>
      
      <div className="relative bg-white/90 backdrop-blur-lg p-8 rounded-xl shadow-lg border border-gray-100/50 w-full max-w-md z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#09261E] mb-2">Create Your Account</h1>
          <p className="text-gray-500 text-sm">Join PropertyDeals to discover off-market properties</p>
        </div>
        
        {verificationRequired ? (
          /* Email Verification Success View */
          <div className="w-full bg-[#f7f9f7] p-6 rounded-xl border border-gray-100 shadow-sm">
            {/* Success Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-[#f0f5f2] flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-[#09261E]" />
              </div>
            </div>
            
            {/* Headline */}
            <h2 className="text-2xl font-bold text-center text-[#09261E] mb-3">Verify Your Email</h2>
            
            {/* Message */}
            <p className="text-center text-gray-600 mb-7">
              We've sent a verification link to <span className="font-medium text-[#09261E]">{registerForm.getValues("email")}</span>. 
              <br />Please check your inbox to complete your registration.
            </p>
            
            {/* Username Box */}
            {generatedUsername && (
              <div className="bg-white p-5 rounded-lg border border-gray-100 mb-8">
                <p className="text-sm text-gray-700 mb-2">
                  This is your username — you can change it later in your profile settings.
                </p>
                <div className="flex items-center bg-[#f7f9f7] p-3 rounded border border-gray-200">
                  <p className="text-[#135341] flex-grow font-medium">{generatedUsername}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedUsername || "");
                      toast({
                        title: "Username copied",
                        description: "Username copied to clipboard"
                      });
                    }}
                    className="text-gray-500 hover:text-[#09261E] hover:bg-[#09261E]/5"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Email Provider Buttons */}
            <div className="mb-8">
              <p className="text-sm text-center text-gray-600 mb-3">Need help checking your inbox?</p>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                <a 
                  href="https://mail.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm"
                >
                  <SiGoogle className="h-4 w-4 text-[#4285F4]" />
                  <span className="font-medium">Gmail</span>
                </a>
                <a 
                  href="https://outlook.live.com/mail/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm"
                >
                  <Mail className="h-4 w-4 text-[#0078D4]" />
                  <span className="font-medium">Outlook</span>
                </a>
                <a 
                  href="https://mail.yahoo.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm"
                >
                  <Mail className="h-4 w-4 text-[#6001D2]" />
                  <span className="font-medium">Yahoo</span>
                </a>
                <a 
                  href="https://www.icloud.com/mail" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm"
                >
                  <SiApple className="h-4 w-4" />
                  <span className="font-medium">iCloud</span>
                </a>
              </div>
            </div>
            
            {/* Resend Button */}
            <div className="mb-6">
              <Button 
                variant="outline"
                className="w-full border-gray-200 h-11 mb-2 font-medium text-sm gap-2 hover:bg-gray-50"
                onClick={async () => {
                  const email = registerForm.getValues("email");
                  if (!email) return;
                  
                  try {
                    const { error } = await supabase.auth.resend({
                      type: 'signup',
                      email,
                      options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`,
                      }
                    });
                    
                    if (error) throw error;
                    
                    toast({
                      title: "Verification email resent",
                      description: "Please check your inbox for the new verification link.",
                    });
                  } catch (error: any) {
                    console.error("Failed to resend verification:", error);
                    toast({
                      title: "Failed to resend verification",
                      description: error.message || "Please try again or contact support.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <RefreshCw className="h-4 w-4" />
                Resend verification email
              </Button>
              <p className="text-xs text-center text-gray-500">
                Didn't receive the email? Click above to resend it.
              </p>
            </div>
            
            {/* CTA Button */}
            <Button 
              onClick={() => navigate("/signin")}
              className="w-full h-12 bg-[#09261E] hover:bg-[#0c3a2d] text-white font-medium inline-flex items-center justify-center"
            >
              Go to Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            {/* Field-Level Email Error Message */}
            {registerForm.formState.errors.email && registerForm.formState.errors.email.message?.includes("already exists") && (
              <div className="border border-red-300 rounded-md p-3 mb-4 bg-red-50 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-700 text-sm font-medium">Email already registered</p>
                  <p className="text-red-600 text-xs mt-1">
                    An account with this email already exists, please <Link to="/signin" className="underline font-medium">sign in</Link> instead.
                  </p>
                </div>
              </div>
            )}
            
            {/* Success Message (non-verification case) */}
            {formSuccess && !verificationRequired && (
              <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle className="text-green-800 font-medium">Success</AlertTitle>
                <AlertDescription className="text-green-700">{formSuccess}</AlertDescription>
              </Alert>
            )}

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                type="button"
                onClick={() => handleSocialRegistration("google")}
                variant="outline"
                className="w-full h-11 border-gray-200 hover:bg-red-50 hover:border-red-200 transition-all group"
              >
                <SiGoogle className="mr-2 text-[#4285F4] group-hover:scale-110 transition-transform" /> 
                <span className="group-hover:text-gray-800 transition-colors">Continue with Google</span>
              </Button>
              <Button
                type="button"
                onClick={() => handleSocialRegistration("facebook")}
                variant="outline"
                className="w-full h-11 border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all group"
              >
                <SiFacebook className="mr-2 text-[#1877F2] group-hover:scale-110 transition-transform" /> 
                <span className="group-hover:text-gray-800 transition-colors">Continue with Facebook</span>
              </Button>
            </div>

            {/* Separator */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">OR CONTINUE WITH EMAIL</span>
              </div>
            </div>

            {/* Registration Form */}
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                className="space-y-4"
                noValidate
              >
                {/* Full Name Field */}
                <FormField
                  name="fullName"
                  control={registerForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="h-11" 
                          placeholder="John Doe"
                          aria-required="true"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  name="email"
                  control={registerForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className="h-11"
                          placeholder="you@example.com"
                          onChange={(e) => {
                            field.onChange(e);
                            // Clear any manual errors when the user types
                            if (registerForm.formState.errors.email?.type === "manual") {
                              registerForm.clearErrors("email");
                            }
                          }}
                          onBlur={(e) => {
                            field.onBlur();
                            // Don't check for duplicates on every blur - too aggressive
                            // This will now happen only on form submission
                          }}
                          aria-required="true"
                          aria-invalid={!!registerForm.formState.errors.email}
                          aria-describedby={!!registerForm.formState.errors.email ? "email-error" : undefined}
                        />
                      </FormControl>
                      <FormMessage id="email-error" />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  name="password"
                  control={registerForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="h-11 pr-16"
                            placeholder="••••••••"
                            {...field}
                            aria-required="true"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 p-1 rounded"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                      <FormDescription className="text-xs text-gray-500">
                        8+ characters with uppercase, lowercase, and numbers
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  name="confirmPassword"
                  control={registerForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            className="h-11 pr-16"
                            placeholder="••••••••"
                            {...field}
                            aria-required="true"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 p-1 rounded"
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Terms Checkbox */}
                <FormField
                  name="agreeToTerms"
                  control={registerForm.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-gray-50">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5 data-[state=checked]:bg-[#09261E] data-[state=checked]:border-[#09261E] transition-all hover:border-[#09261E]"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          I agree to the <Link to="/legal/terms" className="text-[#135341] hover:underline">Terms of Service</Link> and <Link to="/legal/privacy" className="text-[#135341] hover:underline">Privacy Policy</Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 mt-2 bg-[#09261E] hover:bg-[#0c3a2d] text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" /> 
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Create Account</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>
            
            {/* Username hint message */}
            {!verificationRequired && registerForm.watch("fullName") && registerForm.watch("fullName").length > 2 && (
              <div className="mt-3 border border-gray-200 rounded-md bg-[#f7fff9] p-3 flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                <p className="text-xs text-gray-700">
                  A unique username will be automatically generated from your name when you register
                </p>
              </div>
            )}

            {/* Footer */}
            <p className="text-sm text-center mt-6 text-gray-600">
              Already have an account?{" "}
              <Link to="/signin" className="text-[#135341] font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}