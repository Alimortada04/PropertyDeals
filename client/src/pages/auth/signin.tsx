import React, { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Loader2, ArrowRight, Fingerprint, Key, Mail } from "lucide-react";
import { SiGoogle, SiApple } from "react-icons/si";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(true),
});

export default function SignInPage() {
  const { user, loginMutation } = useAuth();
  const [supportsBiometric, setSupportsBiometric] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus email input when the form appears
  useEffect(() => {
    if (showEmailForm && emailInputRef.current) {
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    }
  }, [showEmailForm]);

  // Check if the browser supports WebAuthn/biometric authentication
  useEffect(() => {
    const checkBiometricSupport = async () => {
      try {
        if (
          window.PublicKeyCredential &&
          typeof window.PublicKeyCredential === "function" &&
          typeof navigator.credentials?.get === "function"
        ) {
          // Check if platform authenticator is available
          if (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) {
            setSupportsBiometric(true);
          }
        }
      } catch (error) {
        console.error("Error checking biometric support:", error);
      }
    };

    checkBiometricSupport();
  }, []);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: true,
    },
  });

  // Handle login submission
  function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    // Note: We'll need to update the backend to handle the rememberMe option
    loginMutation.mutate({
      username: values.username,
      password: values.password,
    });
  }

  // Handle biometric login
  const handleBiometricLogin = async () => {
    try {
      // This is a placeholder - in a real implementation, this would use WebAuthn
      // to authenticate with the server
      alert("Biometric login would be triggered here");
      
      // Actual implementation would look something like this:
      /*
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array([...]), // Server-provided challenge
          rpId: window.location.hostname,
          allowCredentials: [...], // List of previously registered credentials
          userVerification: 'required',
        }
      });
      
      // Then send the credential to your server to verify
      */
    } catch (error) {
      console.error("Biometric authentication failed:", error);
    }
  };

  // Handle social login
  const handleSocialLogin = (provider: string) => {
    // This would handle OAuth flow with the selected provider
    alert(`${provider} login would be triggered here`);
  };

  // If user is already logged in, redirect to home
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left side - logo and tagline */}
      <div className="bg-[#09261E] text-white md:w-1/2 p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-heading font-bold mb-6">PropertyDeals</h1>
          <p className="text-xl mb-10">Find exclusive off-market real estate opportunities and connect with local investors.</p>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4 hover:translate-x-1 transition-transform cursor-pointer">
              <div className="bg-white/10 p-3 rounded-full transition-colors hover:bg-white/20">
                <i className="fas fa-search text-white"></i>
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg">Discover Hidden Gems</h3>
                <p className="text-white/80">Access properties not listed on traditional platforms</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 hover:translate-x-1 transition-transform cursor-pointer">
              <div className="bg-white/10 p-3 rounded-full transition-colors hover:bg-white/20">
                <i className="fas fa-handshake text-white"></i>
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg">Direct Connections</h3>
                <p className="text-white/80">Connect directly with property owners and investors</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 hover:translate-x-1 transition-transform cursor-pointer">
              <div className="bg-white/10 p-3 rounded-full transition-colors hover:bg-white/20">
                <i className="fas fa-chart-line text-white"></i>
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg">Analyze Deals</h3>
                <p className="text-white/80">Get instant insights with our advanced deal calculators</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - login form */}
      <div className="bg-white md:w-1/2 p-8 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-none">
          <CardContent className="pt-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-heading font-bold text-[#09261E]">Welcome back</h2>
              <p className="text-gray-500 mt-3 mb-4">Sign in to your account to continue</p>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="inline-flex items-center text-sm px-3 py-1 rounded-full bg-[#F0F7F2] text-[#135341] font-medium">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  12,300+ deals closed
                </span>
                <span className="inline-flex items-center text-sm px-3 py-1 rounded-full bg-[#F0F7F2] text-[#135341] font-medium">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Trusted by 6,000+ investors
                </span>
              </div>
            </div>
            
            {/* Social login buttons */}
            <div className="space-y-3 mb-6">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50" 
                onClick={() => handleSocialLogin('Google')}
              >
                <SiGoogle className="h-4 w-4" />
                <span>Continue with Google</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50" 
                onClick={() => handleSocialLogin('Apple')}
              >
                <SiApple className="h-4 w-4" />
                <span>Continue with Apple</span>
              </Button>
              
              {supportsBiometric && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50" 
                        onClick={handleBiometricLogin}
                      >
                        <Fingerprint className="h-4 w-4" />
                        <span>Sign in with Face ID / Touch ID</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Available on supported devices</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
                onClick={() => setShowEmailForm(!showEmailForm)}
              >
                {showEmailForm ? (
                  <>
                    <Mail className="h-4 w-4" />
                    <span>Hide Email Form</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    <span>Continue with Email</span>
                  </>
                )}
              </Button>
            </div>
            
            {showEmailForm && (
              <div className="animate-in fade-in-0 slide-in-from-top-5 duration-300">
                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-xs uppercase text-gray-400 font-semibold tracking-wider">
                      <span className="inline-flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Let's sign you in securely
                      </span>
                    </span>
                  </div>
                </div>
                
                {/* Email login form */}
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username or Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your username or email" 
                              {...field} 
                              id="email" 
                              ref={emailInputRef} 
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
                          <div className="flex justify-between items-center">
                            <FormLabel>Password</FormLabel>
                            <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                              Forgot password?
                            </Link>
                          </div>
                          <FormControl>
                            <Input type="password" placeholder="Enter your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0">
                          <div className="flex items-center space-x-4">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">Remember me</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-[#09261E] hover:bg-[#135341] text-white flex items-center justify-center gap-2"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                    
                    <div className="text-center mt-2">
                      <button 
                        type="button"
                        onClick={() => setShowEmailForm(false)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Cancel and use another sign-in method
                      </button>
                    </div>
                  </form>
                </Form>
              </div>
            )}
            
            {/* Register link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Don't have an account? {" "}
                <Link href="/register" className="text-[#135341] font-semibold hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}