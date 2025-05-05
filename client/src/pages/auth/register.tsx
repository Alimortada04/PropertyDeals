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
import { Loader2, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SiGoogle, SiFacebook } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";

// Enhanced password validation
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "Password must contain at least one number",
  });

// Full registration schema with enhanced validation
const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
    password: passwordSchema,
    confirmPassword: z.string(),
    email: z.string().email("Please enter a valid email address"),
    fullName: z.string().min(2, "Full name is required"),
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
  const { toast } = useToast();

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      fullName: "",
      agreeToTerms: false,
    },
    mode: "onBlur",
  });

  useEffect(() => {
    const checkAuthentication = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    
    checkAuthentication();
  }, []);

  if (user) return <Redirect to="/dashboard" />;

  // Check if email exists when field is blurred
  const checkEmailExists = async (email: string) => {
    if (!email || registerForm.formState.errors.email) return;
    
    try {
      // More efficient approach than listing all users
      const { data, error } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", email)
        .maybeSingle();
        
      if (data) {
        registerForm.setError("email", {
          type: "manual",
          message: "An account with this email already exists. You can sign in instead.",
        });
      }
    } catch (error) {
      console.error("Email check error:", error);
    }
  };

  // Check if username exists when field is blurred
  const checkUsernameExists = async (username: string) => {
    if (!username || registerForm.formState.errors.username) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .maybeSingle();
        
      if (data) {
        registerForm.setError("username", {
          type: "manual",
          message: "Username already taken. Please choose another one.",
        });
      }
    } catch (error) {
      console.error("Username check error:", error);
    }
  };

  // Form submission handler with improved error handling
  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    setFormError(null);
    setFormSuccess(null);
    setLoading(true);

    try {
      // Step 1: Create auth user
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            username: values.username,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error("Failed to create user account");
      }

      // Step 2: Fetch the created user
      const {
        data: { user: confirmedUser },
        error: getUserError,
      } = await supabase.auth.getUser();

      if (getUserError || !confirmedUser) {
        throw new Error(getUserError?.message || "Failed to retrieve user data");
      }

      // Step 3: Create profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: confirmedUser.id,
        full_name: values.fullName,
        username: values.username,
        email: values.email,
        role: "buyer",
        created_at: new Date().toISOString(),
      });

      if (profileError) {
        throw new Error(profileError.message);
      }

      // Success - show message and redirect
      setFormSuccess("Account created successfully!");
      toast({
        title: "Registration successful",
        description: "Your account has been created. Redirecting you to the dashboard...",
        variant: "default",
      });

      // Redirect after short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      console.error("Registration error:", error);
      setFormError(error.message || "An unexpected error occurred during registration");
      toast({
        title: "Registration failed",
        description: error.message || "Please check your information and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Social registration handler
  const handleSocialRegistration = async (provider: "google" | "facebook") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error(`Social registration failed:`, error.message || "Unknown error");
      toast({
        title: "Social login failed",
        description: error.message || "There was a problem with your social login",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#09261E] mb-2">Create Your Account</h1>
          <p className="text-gray-500 text-sm">Join PropertyDeals to discover off-market properties and connect with buyers and sellers</p>
        </div>

        {/* Form Success Message */}
        {formSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2 text-green-700">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <p>{formSuccess}</p>
          </div>
        )}

        {/* Form Error Message */}
        {formError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700">
            <p>{formError}</p>
          </div>
        )}

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            type="button" 
            onClick={() => handleSocialRegistration("google")}
            variant="outline"
            className="w-full h-11 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <SiGoogle className="mr-2 text-[#4285F4]" /> Continue with Google
          </Button>
          <Button
            type="button"
            onClick={() => handleSocialRegistration("facebook")}
            variant="outline"
            className="w-full h-11 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <SiFacebook className="mr-2 text-[#1877F2]" /> Continue with Facebook
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
                      onBlur={async (e) => {
                        field.onBlur();
                        await checkEmailExists(e.target.value);
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

            {/* Username Field */}
            <FormField
              name="username"
              control={registerForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-11"
                      placeholder="yourname"
                      onBlur={async (e) => {
                        field.onBlur();
                        await checkUsernameExists(e.target.value);
                      }}
                      aria-required="true"
                      aria-invalid={!!registerForm.formState.errors.username}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="text-xs text-gray-500">
                    Used for your profile URL. Only letters, numbers, underscores, and hyphens.
                  </FormDescription>
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
                      className="mt-1"
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

        {/* Footer */}
        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/signin" className="text-[#135341] font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
