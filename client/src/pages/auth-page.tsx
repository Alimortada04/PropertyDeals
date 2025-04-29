import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation, Link } from "wouter";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowRight, KeyRound, UserPlus, Mail } from "lucide-react";
import { SiGoogle, SiFacebook } from "react-icons/si";
import { Separator } from "@/components/ui/separator";

// Login form schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

// Registration form schema
const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Tie-dye background wash effect with brand colors - higher saturation
const BackgroundOrbs = () => (
  <>
    {/* Large forest green blob - bottom right */}
    <div className="absolute w-[800px] h-[800px] bg-[#0D3C2F]/35 rounded-full blur-[120px] -bottom-80 -right-40 animate-pulse" 
         style={{animationDuration: '15s'}}></div>
    
    {/* Large wine accent blob - bottom left */}
    <div className="absolute w-[700px] h-[700px] bg-[#803344]/35 rounded-full blur-[120px] -bottom-60 -left-60 animate-pulse" 
         style={{animationDelay: '2s', animationDuration: '17s'}}></div>
    
    {/* Medium forest green blob - top right */}
    <div className="absolute w-[600px] h-[600px] bg-[#0D3C2F]/30 rounded-full blur-[100px] -top-80 right-0 animate-pulse" 
         style={{animationDelay: '4s', animationDuration: '19s'}}></div>
         
    {/* Medium wine accent blob - top left */}
    <div className="absolute w-[500px] h-[500px] bg-[#963D52]/30 rounded-full blur-[100px] -top-60 -left-20 animate-pulse" 
         style={{animationDelay: '1s', animationDuration: '14s'}}></div>
    
    {/* Small forest green blob - middle left */}
    <div className="absolute w-[400px] h-[400px] bg-[#0D3C2F]/30 rounded-full blur-[80px] left-20 top-1/3 animate-pulse" 
         style={{animationDelay: '3s', animationDuration: '13s'}}></div>
         
    {/* Small wine accent blob - middle right */}
    <div className="absolute w-[350px] h-[350px] bg-[#963D52]/30 rounded-full blur-[80px] right-10 top-1/4 animate-pulse" 
         style={{animationDelay: '5s', animationDuration: '16s'}}></div>
  </>
);

export default function AuthPage() {
  const [location] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  
  const { 
    user, 
    supabaseUser, 
    loginMutation, 
    registerMutation, 
    loginWithGoogleMutation,
    loginWithFacebookMutation 
  } = useAuth();

  // Toggle between login and register based on URL
  useEffect(() => {
    setIsLogin(location !== "/register");
  }, [location]);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login submission
  function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate({
      email: values.email,
      password: values.password,
    });
  }

  // Handle registration submission
  function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    registerMutation.mutate({
      email: values.email,
      password: values.password,
      fullName: "", // This can be collected later in the onboarding process
    });
  }
  
  // Handle social login/signup
  function handleGoogleAuth() {
    loginWithGoogleMutation.mutate();
  }
  
  function handleFacebookAuth() {
    loginWithFacebookMutation.mutate();
  }

  // If user is already logged in, redirect to dashboard
  if (user || supabaseUser) {
    return <Redirect to="/dashboard" />;
  }

  // Empty component - feature cards removed per user request
  const FeatureCards = () => null;

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gradient-to-br from-white to-[#d0e8dd] overflow-hidden">
      {/* Animated Background Elements */}
      <BackgroundOrbs />
      
      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/30">
          {isLogin ? (
            <>
              <h1 className="text-2xl font-bold text-center text-[#09261E] mb-2">Welcome back</h1>
              <p className="text-center text-gray-500 mb-8">Please sign in to continue</p>

              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="Email" 
                            type="email"
                            className="h-12 rounded-md border-gray-200 bg-white/70 focus:border-[#09261E] focus:ring-[#09261E] transition-all"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-[#803344]" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Password"
                            className="h-12 rounded-md border-gray-200 bg-white/70 focus:border-[#09261E] focus:ring-[#09261E] transition-all"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-[#803344]" />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-between items-center">
                    <FormField
                      control={loginForm.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-[#09261E] data-[state=checked]:border-[#09261E]"
                            />
                          </FormControl>
                          <div className="text-sm font-medium leading-none text-gray-600">
                            Stay signed in
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Link href="/forgot-password" className="text-sm text-[#09261E] hover:text-[#135341] transition-colors">
                      Forgot password?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-[#09261E] hover:bg-[#0c3a2d] text-white flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98]"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="my-8 relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-1/2 h-12 border-gray-200 hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  onClick={handleGoogleAuth}
                  disabled={loginWithGoogleMutation.isPending}
                >
                  <SiGoogle className="mr-2 h-4 w-4" />
                  <span>Google</span>
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-1/2 h-12 border-gray-200 hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                  onClick={handleFacebookAuth}
                  disabled={loginWithFacebookMutation.isPending}
                >
                  <SiFacebook className="mr-2 h-4 w-4 text-[#1877F2]" />
                  <span>Facebook</span>
                </Button>
              </div>

              <div className="mt-8 text-center text-sm">
                Don't have an account?{' '}
                <Link href="/register" className="text-[#09261E] font-semibold hover:text-[#135341] transition-colors">
                  Create one
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-center text-[#09261E] mb-2">Create your account</h1>
              <p className="text-center text-gray-500 mb-8">Start finding your perfect deal</p>

              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Email"
                            className="h-12 rounded-md border-gray-200 bg-white/70 focus:border-[#09261E] focus:ring-[#09261E] transition-all"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-[#803344]" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Password"
                            className="h-12 rounded-md border-gray-200 bg-white/70 focus:border-[#09261E] focus:ring-[#09261E] transition-all"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-[#803344]" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Confirm Password"
                            className="h-12 rounded-md border-gray-200 bg-white/70 focus:border-[#09261E] focus:ring-[#09261E] transition-all"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-[#803344]" />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-[#09261E] hover:bg-[#0c3a2d] text-white flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98]"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign Up</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="my-8 relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-400">Or sign up with</span>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-1/2 h-12 border-gray-200 hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  onClick={handleGoogleAuth}
                  disabled={loginWithGoogleMutation.isPending}
                >
                  <SiGoogle className="mr-2 h-4 w-4" />
                  <span>Google</span>
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-1/2 h-12 border-gray-200 hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                  onClick={handleFacebookAuth}
                  disabled={loginWithFacebookMutation.isPending}
                >
                  <SiFacebook className="mr-2 h-4 w-4 text-[#1877F2]" />
                  <span>Facebook</span>
                </Button>
              </div>

              <div className="mt-8 text-center text-sm">
                Already have an account?{' '}
                <Link href="/auth" className="text-[#09261E] font-semibold hover:text-[#135341] transition-colors">
                  Sign In
                </Link>
              </div>
            </>
          )}
        </div>
        
        {/* Feature Cards - only visible on desktop */}
        <FeatureCards />
      </div>
    </div>
  );
}
