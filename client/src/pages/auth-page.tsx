import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  userType: z.enum(["buyer", "seller"], {
    required_error: "Please select an account type",
  }),
});

export default function AuthPage() {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    return location === "/register" ? "register" : "login";
  });
  const { user, loginMutation, registerMutation } = useAuth();

  // Update tab if the URL changes
  useEffect(() => {
    setActiveTab(location === "/register" ? "register" : "login");
  }, [location]);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      email: "",
      userType: "buyer",
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

  // If user is already logged in, redirect to home
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
        <div>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-heading text-[#09261E]">
                {activeTab === "login" ? "Sign In to PropertyDeals" : "Create Your Account"}
              </CardTitle>
              <CardDescription>
                {activeTab === "login" 
                  ? "Access your account to manage properties and inquiries" 
                  : "Join our community of property buyers and sellers"}
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
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your username" {...field} />
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
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Choose a username" {...field} />
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
                      <FormField
                        control={registerForm.control}
                        name="userType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select account type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="buyer">Buyer</SelectItem>
                                <SelectItem value="seller">Seller</SelectItem>
                              </SelectContent>
                            </Select>
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
  );
}
