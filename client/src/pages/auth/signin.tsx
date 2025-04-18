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
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAF8] to-[#E5EAE7] overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 relative">
      {/* Floating feature cards in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left card */}
        <div className="absolute top-20 -left-4 sm:left-16 transform rotate-[-4deg] animate-in fade-in-50 slide-in-from-left-10 duration-700 delay-[200ms]">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md max-w-xs text-sm">
            <div className="flex items-start space-x-3">
              <div className="bg-[#F0F7F2] p-2 rounded-lg">
                <svg className="w-5 h-5 text-[#135341]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-[#09261E]">Direct Connections</h3>
                <p className="text-gray-600 text-sm">Talk directly with sellers and REPs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom right card */}
        <div className="absolute bottom-16 -right-8 sm:right-24 transform rotate-[3deg] animate-in fade-in-50 slide-in-from-right-10 duration-700 delay-[300ms]">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md max-w-xs text-sm">
            <div className="flex items-start space-x-3">
              <div className="bg-[#F0F7F2] p-2 rounded-lg">
                <svg className="w-5 h-5 text-[#135341]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-[#09261E]">Analyze in Seconds</h3>
                <p className="text-gray-600 text-sm">Use built-in deal calculators instantly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle left card */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-16 sm:left-8 transform rotate-[6deg] animate-in fade-in-50 slide-in-from-left-10 duration-700 delay-[400ms]">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md max-w-xs text-sm">
            <div className="flex items-start space-x-3">
              <div className="bg-[#F0F7F2] p-2 rounded-lg">
                <svg className="w-5 h-5 text-[#135341]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-[#09261E]">Hidden Listings</h3>
                <p className="text-gray-600 text-sm">Access off-market deals not found on Zillow.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top right card */}
        <div className="absolute top-28 right-0 sm:right-20 transform rotate-[-5deg] animate-in fade-in-50 slide-in-from-right-10 duration-700 delay-[500ms]">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md max-w-xs text-sm">
            <div className="flex items-start space-x-3">
              <div className="bg-[#F0F7F2] p-2 rounded-lg">
                <svg className="w-5 h-5 text-[#135341]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-[#09261E]">Trusted Network</h3>
                <p className="text-gray-600 text-sm">6,000+ verified RE professionals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Small branding tagline */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 shadow-sm">
          <span className="text-xs text-[#09261E] font-semibold tracking-wide">
            <span className="text-[#135341]">• </span>
            REAL ESTATE REIMAGINED
            <span className="text-[#135341]"> •</span>
          </span>
        </div>
      </div>
      
      {/* Main Sign-In Card */}
      <div className="animate-in fade-in-50 zoom-in-95 duration-500 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 max-w-md w-full p-8 mx-auto relative z-10">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-4">Sign in to your account to continue</p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
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
        <div className="space-y-3 mb-6 max-w-[340px] mx-auto">
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
          <div className="animate-in fade-in-0 slide-in-from-top-5 duration-300 max-w-[340px] mx-auto">
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
                          className="bg-white/90"
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
                        <Link href="/auth/forgot-password" className="text-sm text-[#135341] hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} className="bg-white/90" />
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
                  className="w-full bg-[#09261E] hover:bg-[#135341] text-white flex items-center justify-center gap-2 border border-[#135341]/20"
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
      </div>
    </div>
  );
}