import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth-updated";
import { Redirect, useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { SiGoogle, SiFacebook } from "react-icons/si";
import { Separator } from "@/components/ui/separator";

// Login form schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Registration form schema
const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function AuthPage() {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    return location === "/register" ? "register" : "login";
  });
  
  const { 
    user, 
    supabaseUser, 
    loginMutation, 
    registerMutation, 
    loginWithGoogleMutation,
    loginWithFacebookMutation 
  } = useAuth();

  // Update tab if the URL changes
  useEffect(() => {
    setActiveTab(location === "/register" ? "register" : "login");
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
      fullName: "",
      email: "",
      password: "",
    },
  });

  // Handle login submission
  function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate(values);
  }

  // Handle registration submission
  function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    registerMutation.mutate(values);
  }
  
  // Handle social login
  function handleGoogleLogin() {
    loginWithGoogleMutation.mutate();
  }
  
  function handleFacebookLogin() {
    loginWithFacebookMutation.mutate();
  }

  // If user is already logged in, redirect to dashboard
  if (user || supabaseUser) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center">
      <div className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          <div>
            <Card className="bg-white/80 backdrop-blur-lg shadow-lg border border-gray-100">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-heading text-[#09261E]">
                  {activeTab === "login" ? "Sign In to PropertyDeals" : "Create Your Account"}
                </CardTitle>
                <CardDescription>
                  {activeTab === "login" 
                    ? "Access your account to manage properties and deals" 
                    : "Join our community of property buyers, sellers, and REPs"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs 
                  value={activeTab} 
                  onValueChange={setActiveTab} 
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter your email" {...field} />
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
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full bg-[#09261E] hover:bg-[#135341] text-white"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Signing In...
                            </>
                          ) : (
                            "Sign In"
                          )}
                        </Button>
                        
                        <div className="relative my-4">
                          <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">or continue with</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="w-1/2"
                            onClick={handleGoogleLogin}
                            disabled={loginWithGoogleMutation.isPending}
                          >
                            <SiGoogle className="mr-2 h-4 w-4" />
                            Google
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="w-1/2" 
                            onClick={handleFacebookLogin}
                            disabled={loginWithFacebookMutation.isPending}
                          >
                            <SiFacebook className="mr-2 h-4 w-4 text-[#1877F2]" />
                            Facebook
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </TabsContent>

                  <TabsContent value="register">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
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
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter your email" {...field} />
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
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Create a password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full bg-[#09261E] hover:bg-[#135341] text-white"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating Account...
                            </>
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                        
                        <div className="relative my-4">
                          <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">or continue with</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="w-1/2"
                            onClick={handleGoogleLogin}
                            disabled={loginWithGoogleMutation.isPending}
                          >
                            <SiGoogle className="mr-2 h-4 w-4" />
                            Google
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="w-1/2" 
                            onClick={handleFacebookLogin}
                            disabled={loginWithFacebookMutation.isPending}
                          >
                            <SiFacebook className="mr-2 h-4 w-4 text-[#1877F2]" />
                            Facebook
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="hidden lg:block">
            <div className="bg-[#09261E] text-white p-10 rounded-lg">
              <h2 className="text-3xl font-heading font-bold mb-6">Find Your Perfect Property Deal</h2>
              <p className="mb-6 text-white/90">
                PropertyDeals connects you with exclusive off-market real estate opportunities you won't find anywhere else.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="bg-white/10 p-2 rounded-full mr-4">
                    <i className="fas fa-search text-[#E59F9F]"></i>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg mb-1">Discover Off-Market Properties</h3>
                    <p className="text-white/80 text-sm">Access exclusive listings not available on traditional platforms</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-white/10 p-2 rounded-full mr-4">
                    <i className="fas fa-dollar-sign text-[#E59F9F]"></i>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg mb-1">Save on Transaction Costs</h3>
                    <p className="text-white/80 text-sm">Connect directly with property owners and save on fees</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-white/10 p-2 rounded-full mr-4">
                    <i className="fas fa-home text-[#E59F9F]"></i>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg mb-1">Sell Your Property Faster</h3>
                    <p className="text-white/80 text-sm">List your property and reach motivated buyers directly</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-6 p-4 bg-white/5 rounded-lg">
                <div className="flex -space-x-2 mr-4">
                  <img src="https://randomuser.me/api/portraits/women/79.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-[#09261E]" />
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-[#09261E]" />
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-[#09261E]" />
                </div>
                <div>
                  <p className="text-sm text-white/90">Join over 10,000 satisfied users finding and selling properties with ease.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}