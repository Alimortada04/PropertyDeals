import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { 
  Loader2, 
  ArrowRight, 
  Fingerprint, 
  Key, 
  Mail, 
  Home, 
  DollarSign, 
  PercentCircle, 
  Building, 
  Users,
  BadgeCheck, 
  Briefcase, 
  Megaphone, 
  Network 
} from "lucide-react";
import { SiGoogle, SiApple, SiFacebook } from "react-icons/si";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(true),
});

// Define role types and card data
type Role = 'buyer' | 'seller' | 'rep';

// Card data for different roles
const roleCards = {
  buyer: [
    {
      title: "Off-Market Inventory",
      description: "Find deals not on Zillow or Redfin",
      icon: <Home className="w-5 h-5 text-[#135341]" />,
      position: "top-left"
    },
    {
      title: "Talk Directly to Sellers",
      description: "Skip middlemen and get fast responses",
      icon: <Users className="w-5 h-5 text-[#135341]" />,
      position: "bottom-right"
    },
    {
      title: "Run ROI in Seconds",
      description: "Analyze profit before you make offers",
      icon: <PercentCircle className="w-5 h-5 text-[#135341]" />,
      position: "middle-left"
    },
    {
      title: "Trusted Network",
      description: "6,000+ verified RE professionals",
      icon: <BadgeCheck className="w-5 h-5 text-[#135341]" />,
      position: "top-right"
    }
  ],
  seller: [
    {
      title: "Get Cash Offers Fast",
      description: "Receive offers within 24 hours",
      icon: <DollarSign className="w-5 h-5 text-[#135341]" />,
      position: "top-left"
    },
    {
      title: "Skip Repairs",
      description: "Sell As-Is, No Upgrades Needed",
      icon: <Building className="w-5 h-5 text-[#135341]" />,
      position: "bottom-right"
    },
    {
      title: "Verified Buyers Only",
      description: "Your property is safe and private",
      icon: <BadgeCheck className="w-5 h-5 text-[#135341]" />,
      position: "middle-left"
    },
    {
      title: "Direct Communication",
      description: "No agents or middlemen needed",
      icon: <Mail className="w-5 h-5 text-[#135341]" />,
      position: "top-right"
    }
  ],
  rep: [
    {
      title: "Grow Your Network",
      description: "Connect with buyers, sellers, and pros",
      icon: <Network className="w-5 h-5 text-[#803344]" />,
      position: "top-left"
    },
    {
      title: "List Your Services",
      description: "Showcase your skills and get hired",
      icon: <Briefcase className="w-5 h-5 text-[#803344]" />,
      position: "bottom-right"
    },
    {
      title: "Verified Leads, Delivered",
      description: "Real people. Real property. Real potential.",
      icon: <Megaphone className="w-5 h-5 text-[#803344]" />,
      position: "middle-left"
    },
    {
      title: "Trusted Professional Network",
      description: "Join 6,000+ verified RE professionals",
      icon: <BadgeCheck className="w-5 h-5 text-[#803344]" />,
      position: "top-right"
    }
  ]
};

// Background gradients for different roles - more saturated brand-aligned gradient
const roleBackgrounds = {
  buyer: "from-[#F5F5F5] to-[#d6ebe2]",
  seller: "from-[#F5F5F5] to-[#d5f0e0]",
  rep: "from-[#F5F5F5] to-[#f2dfe1]"
};

export default function SignInPage() {
  const { user, loginMutation } = useAuth();
  const [supportsBiometric, setSupportsBiometric] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [selectedRole, setSelectedRole] = useState<Role>('buyer');
  const [animateCards, setAnimateCards] = useState(true);
  const autoCycleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [progress, setProgress] = useState(100);
  
  // Animation frame handler for countdown animation
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const startTimeRef = useRef<number>();
  
  // Countdown animation constants
  const CYCLE_DURATION = 5000; // 5 seconds
  
  // Auto-focus email input when the form appears
  useEffect(() => {
    if (showEmailForm && emailInputRef.current) {
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    }
  }, [showEmailForm]);
  
  // Progress animation
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time;
      startTimeRef.current = time;
    }
    
    const elapsed = time - startTimeRef.current!;
    const remaining = Math.max(0, CYCLE_DURATION - elapsed);
    const newProgress = (remaining / CYCLE_DURATION) * 100;
    
    setProgress(newProgress);
    
    if (elapsed < CYCLE_DURATION) {
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    } else {
      // Time to auto-cycle to next role
      setSelectedRole(prevRole => {
        if (prevRole === 'buyer') return 'seller';
        if (prevRole === 'seller') return 'rep';
        return 'buyer';
      });
      
      // Briefly disable animations when switching roles automatically
      setAnimateCards(false);
      setTimeout(() => setAnimateCards(true), 50);
      
      // Reset animation
      startTimeRef.current = time;
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    }
  }, []);
  
  // Start countdown animation
  useEffect(() => {
    startTimeRef.current = undefined;
    previousTimeRef.current = undefined;
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
  
  // Handle role selection
  const handleRoleSelect = useCallback((role: Role) => {
    // Only switch if it's a different role
    if (role === selectedRole) return;
    
    setSelectedRole(role);
    
    // Briefly disable animations when switching roles manually
    setAnimateCards(false);
    setTimeout(() => setAnimateCards(true), 50);
    
    // Reset animation countdown
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    startTimeRef.current = undefined;
    previousTimeRef.current = undefined;
    requestRef.current = requestAnimationFrame(animate);
  }, [selectedRole, animate]);

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
    <div 
      className={`min-h-screen bg-gradient-to-br ${roleBackgrounds[selectedRole]} overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 relative transition-colors duration-700`}
    >
      {/* Enhanced radial glow behind the main card */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className={`w-[700px] h-[700px] rounded-full ${
          selectedRole === 'buyer' ? 'bg-gradient-radial from-[#d6ebe2]/80 to-transparent' :
          selectedRole === 'seller' ? 'bg-gradient-radial from-[#d5f0e0]/80 to-transparent' :
          'bg-gradient-radial from-[#f2dfe1]/80 to-transparent'
        } opacity-70 transition-all duration-700`}></div>
      </div>

      {/* Rotating role-specific tagline */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 shadow-sm">
          <span className="text-xs font-semibold tracking-wide animate-in fade-in duration-500">
            <span className={`${
              selectedRole === 'rep' ? 'text-[#803344]' : 'text-[#135341]'  
            }`}>• </span>
            <span className="text-[#09261E]">
              {selectedRole === 'buyer' ? 'MADE FOR BUYERS' : 
               selectedRole === 'seller' ? 'MADE FOR SELLERS' : 
               'MADE FOR REPS'}
            </span>
            <span className={`${
              selectedRole === 'rep' ? 'text-[#803344]' : 'text-[#135341]'  
            }`}> •</span>
          </span>
        </div>
      </div>
      
      {/* Role toggle buttons - Moved to inside the login form below */}

      {/* Floating feature cards in background - Dynamic based on role */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Generate cards based on selected role */}
        {animateCards && roleCards[selectedRole].map((card, index) => {
          // Define positions based on card.position and screen size
          let positionClasses = "";
          let animationClasses = "";
          
          // Responsive positioning for different screen sizes
          if (card.position === "top-left") {
            positionClasses = "top-24 left-4 md:top-20 md:-left-4 lg:left-16 rotate-[1.5deg] hidden sm:block";
            animationClasses = "animate-in fade-in-50 slide-in-from-left-10 duration-700 delay-[200ms]";
          } else if (card.position === "bottom-right") {
            positionClasses = "bottom-24 right-4 md:bottom-16 md:-right-8 lg:right-20 rotate-[-2deg] hidden sm:block";
            animationClasses = "animate-in fade-in-50 slide-in-from-right-10 duration-700 delay-[300ms]";
          } else if (card.position === "middle-left") {
            positionClasses = "top-1/2 -translate-y-1/2 -left-16 md:-left-8 lg:left-4 rotate-[-1.5deg] hidden md:block";
            animationClasses = "animate-in fade-in-50 slide-in-from-left-10 duration-700 delay-[400ms]";
          } else if (card.position === "top-right") {
            positionClasses = "top-32 right-4 md:top-28 md:right-0 lg:right-12 rotate-[2deg] hidden sm:block";
            animationClasses = "animate-in fade-in-50 slide-in-from-right-10 duration-700 delay-[500ms]";
          }
          
          // Optionally add blur to one card for depth effect
          const blurClass = card.position === "middle-left" ? "blur-[1px]" : "";
          
          // Scale down cards on smaller screens
          const sizeClasses = "w-[200px] md:w-[215px] lg:w-[230px]";
          
          return (
            <div 
              key={`${selectedRole}-${index}`}
              className={`absolute ${positionClasses} transform ${animationClasses} hover:-translate-y-1 hover:shadow-lg transition-all`}
            >
              <div className={`bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-lg shadow-md ${sizeClasses} text-sm border border-gray-100 ${blurClass}`}>
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    selectedRole === 'rep' ? 'bg-[#FFF0F3]' : 'bg-[#F0F7F2]'
                  }`}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 className={`font-heading font-bold text-base ${
                      selectedRole === 'rep' ? 'text-[#803344]' : 'text-[#09261E]'
                    }`}>
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">{card.description}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Main Sign-In Card - Zoom Style */}
      <div className="animate-in fade-in-50 zoom-in-95 duration-500 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 max-w-md w-full p-6 sm:p-8 mx-auto relative z-10 space-y-4">
        {/* Card Header */}
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-2">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-6">Please sign in to continue</p>
        </div>
        
        {/* Email login form - Showing by default */}
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
            <FormField
              control={loginForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="name@example.com" 
                      {...field} 
                      id="email" 
                      ref={emailInputRef}
                      autoComplete="email"
                      className="bg-white/90 h-10"
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
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="password" 
                        placeholder="Password" 
                        {...field} 
                        className="bg-white/90 h-10 pr-10" 
                        autoComplete="current-password"
                      />
                      <button 
                        type="button" 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => console.log('Toggle password visibility')}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={loginForm.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-xs font-normal">Stay signed in</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <Link 
                href="/auth/forgot-password" 
                className={`text-xs ${
                  selectedRole === 'rep' ? 'text-[#803344]' : 'text-[#135341]'
                } hover:underline`}
              >
                Forgot password?
              </Link>
            </div>
            
            <Button 
              type="submit" 
              className={`w-full ${
                selectedRole === 'buyer' ? 'bg-[#09261E] hover:bg-[#0f3e2a]' :
                selectedRole === 'seller' ? 'bg-[#135341] hover:bg-[#1e6d52]' :
                'bg-[#803344] hover:bg-[#a34d5e]'
              } text-white flex items-center justify-center gap-2 border border-white/20 h-10`}
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
          </form>
        </Form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-xs text-gray-400">
              Or sign in with
            </span>
          </div>
        </div>

        {/* Social Auth - Icon buttons */}
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            className="w-12 h-12 rounded-full border text-xl flex items-center justify-center hover:bg-gray-50 transition-all"
            onClick={() => handleSocialLogin('Google')}
          >
            <SiGoogle className="h-5 w-5" />
            <span className="sr-only">Sign in with Google</span>
          </Button>

          <Button 
            variant="outline" 
            size="icon"
            className="w-12 h-12 rounded-full border text-xl flex items-center justify-center hover:bg-gray-50 transition-all"
            onClick={() => handleSocialLogin('Apple')}
          >
            <SiApple className="h-5 w-5" />
            <span className="sr-only">Sign in with Apple</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            className="w-12 h-12 rounded-full border text-xl flex items-center justify-center hover:bg-gray-50 transition-all"
            onClick={() => handleSocialLogin('Facebook')}
          >
            <SiFacebook className="h-5 w-5 text-[#1877F2]" />
            <span className="sr-only">Sign in with Facebook</span>
          </Button>
          
          {supportsBiometric && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="w-12 h-12 rounded-full border text-xl flex items-center justify-center hover:bg-gray-50 transition-all"
                    onClick={handleBiometricLogin}
                  >
                    <Fingerprint className="h-5 w-5" />
                    <span className="sr-only">Sign in with Face ID / Touch ID</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Available on supported devices</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {/* Register link */}
        <div className="text-center mt-6 space-y-4">
          <p className="text-sm text-gray-500">
            Don't have an account? {" "}
            <Link 
              href="/register" 
              className={`${
                selectedRole === 'rep' ? 'text-[#803344]' : 'text-[#135341]'
              } font-semibold hover:underline`}
            >
              Create one
            </Link>
          </p>
          
          {/* Legal text */}
          <p className="text-xs text-gray-400 mt-3">
            By signing in, you agree to PropertyDeals' {" "}
            <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link> and {" "}
            <Link href="/terms" className="underline hover:text-gray-600">Terms of Use</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}