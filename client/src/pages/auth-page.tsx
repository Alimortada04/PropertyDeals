import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { SiGoogle, SiFacebook } from "react-icons/si";
import { Separator } from "@/components/ui/separator";

// Login form schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
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
    loginMutation.mutate(values);
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

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {isLogin ? (
          <>
            <h1 className="text-2xl font-bold text-center mb-2">Welcome back</h1>
            <p className="text-center text-gray-500 mb-6">Please sign in to continue</p>

            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Email" 
                          type="email"
                          className="rounded-md border-gray-300 focus:border-green-700 focus:ring-green-700"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
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
                          className="rounded-md border-gray-300 focus:border-green-700 focus:ring-green-700"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-[#09261E] hover:bg-[#135341] text-white flex items-center justify-center transition-colors"
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

            <div className="my-6 relative">
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
                className="w-1/2 border-gray-300 hover:bg-gray-50"
                onClick={handleGoogleAuth}
                disabled={loginWithGoogleMutation.isPending}
              >
                <SiGoogle className="mr-2 h-4 w-4" />
                <span>Google</span>
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-1/2 border-gray-300 hover:bg-gray-50" 
                onClick={handleFacebookAuth}
                disabled={loginWithFacebookMutation.isPending}
              >
                <SiFacebook className="mr-2 h-4 w-4 text-[#1877F2]" />
                <span>Facebook</span>
              </Button>
            </div>

            <div className="mt-6 text-center text-sm">
              Don't have an account?{' '}
              <a href="/register" className="text-green-700 font-bold">
                Create one
              </a>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center mb-2">Create your account</h1>
            <p className="text-center text-gray-500 mb-6">Start finding your perfect deal</p>

            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Email"
                          className="rounded-md border-gray-300 focus:border-green-700 focus:ring-green-700"
                          {...field} 
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
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Password"
                          className="rounded-md border-gray-300 focus:border-green-700 focus:ring-green-700"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
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
                          className="rounded-md border-gray-300 focus:border-green-700 focus:ring-green-700"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-[#09261E] hover:bg-[#135341] text-white flex items-center justify-center transition-colors"
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

            <div className="my-6 relative">
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
                className="w-1/2 border-gray-300 hover:bg-gray-50"
                onClick={handleGoogleAuth}
                disabled={loginWithGoogleMutation.isPending}
              >
                <SiGoogle className="mr-2 h-4 w-4" />
                <span>Google</span>
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-1/2 border-gray-300 hover:bg-gray-50" 
                onClick={handleFacebookAuth}
                disabled={loginWithFacebookMutation.isPending}
              >
                <SiFacebook className="mr-2 h-4 w-4 text-[#1877F2]" />
                <span>Facebook</span>
              </Button>
            </div>

            <div className="mt-6 text-center text-sm">
              Already have an account?{' '}
              <a href="/auth" className="text-green-700 font-bold">
                Sign In
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
