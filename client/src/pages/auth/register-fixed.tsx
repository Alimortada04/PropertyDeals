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
import { useToast } from "@/hooks/use-toast";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms of service",
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
    // Watch for fullName changes and generate username
    const subscription = registerForm.watch((value, { name, type }) => {
      if (name === "fullName" && value.fullName && value.fullName.length > 2) {
        setGeneratedUsername(generateUsername(value.fullName));
      } else if (name === "fullName") {
        setGeneratedUsername(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [registerForm]);

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

  // Early return after all hooks have been declared
  if (user) return <Redirect to="/" />;

  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    setFormError(null);
    setFormSuccess(null);
    setVerificationRequired(false);
    setLoading(true);
    registerForm.clearErrors("email");

    try {
      // 1. Generate a username from the full name
      const baseUsername = generateUsername(values.fullName);
      if (!baseUsername) {
        throw new Error("Could not generate a valid username");
      }
      
      const finalUsername = await findAvailableUsername(baseUsername);
      console.log("Generated username:", finalUsername);
      
      // 2. Use local database registration
      console.log("Using local database registration...");
      
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: finalUsername,
          password: values.password,
          fullName: values.fullName,
          email: values.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const userData = await response.json();
      console.log("Local registration successful:", userData);
      
      // Registration successful - show success message and redirect
      setFormSuccess("Account created successfully! You can now sign in.");
      setVerificationRequired(false);
      setGeneratedUsername(finalUsername);
      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now sign in.",
        variant: "default",
      });
      
      // Redirect to sign in page after a short delay
      setTimeout(() => {
        navigate("/signin");
      }, 2000);

    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle specific error cases
      if (error.message.includes("already exists") || 
          error.message.includes("already registered") ||
          error.message.includes("User already registered")) {
        registerForm.setError("email", {
          type: "manual",
          message: "Email already exists. Try signing in instead.",
        });
        toast({
          title: "Email already registered",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
      } else {
        setFormError(error.message || "Registration failed. Please try again.");
        toast({
          title: "Registration failed",
          description: error.message || "An error occurred during registration.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const copyUsername = () => {
    if (generatedUsername) {
      navigator.clipboard.writeText(generatedUsername);
      toast({
        title: "Username copied",
        description: "Your generated username has been copied to clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join PropertyDeals today</p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <Button variant="outline" className="w-full h-12 text-sm font-medium">
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <Button variant="outline" className="w-full h-12 text-sm font-medium">
              <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with email</span>
            </div>
          </div>

          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              <FormField
                control={registerForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Vinci"
                        className="h-12 text-base"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="thevincimarketing@gmail.com"
                        className="h-12 text-base"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="h-12 text-base pr-12"
                          disabled={loading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      8+ characters with uppercase, lowercase, and numbers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="h-12 text-base pr-12"
                          disabled={loading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={loading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={loading}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm text-gray-700">
                        I agree to the{" "}
                        <Link href="/terms" className="text-green-600 hover:text-green-700 underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-green-600 hover:text-green-700 underline">
                          Privacy Policy
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium text-base"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              {generatedUsername && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-green-700">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      A unique username will be automatically generated from your name when you register
                    </div>
                  </div>
                </div>
              )}

              {formError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                </div>
              )}

              {formSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-sm text-green-700">
                    <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{formSuccess}</span>
                  </div>
                </div>
              )}
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/signin" className="text-green-600 hover:text-green-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}