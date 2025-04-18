import { useState, useEffect, useCallback, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link, useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowRight, Check, Building, Users, UserPlus, Phone, Key } from "lucide-react";
import { SiGoogle, SiApple, SiFacebook } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";

// User types
type Role = "buyer" | "seller" | "rep";
type Step = "role" | "email" | "password" | "phone" | "success";

// Role descriptions
const roleDescriptions = {
  buyer: {
    title: "Buyer",
    subtitle: "Buy properties from verified sellers",
    tooltip: "Investors, landlords, flippers"
  },
  seller: {
    title: "Seller",
    subtitle: "Sell properties directly to buyers",
    tooltip: "Homeowners, wholesalers, agents"
  },
  rep: {
    title: "REP",
    subtitle: "List services, post deals, connect",
    tooltip: "Agents, contractors, lenders, appraisers"
  }
};

// Role-specific feature cards to display in background
const roleCards = {
  buyer: [
    {
      title: "Find Off-Market Deals",
      description: "Access exclusive deals not available on the MLS",
      icon: <Building className="h-5 w-5" />,
      position: "top-left"
    },
    {
      title: "Connect with Sellers",
      description: "Message property owners directly",
      icon: <Users className="h-5 w-5" />,
      position: "bottom-right"
    },
    {
      title: "Investment Tools",
      description: "Calculate ROI & financing options",
      icon: <ArrowRight className="h-5 w-5" />,
      position: "middle-left"
    },
    {
      title: "Save Properties",
      description: "Build your wishlist of potential investments",
      icon: <UserPlus className="h-5 w-5" />,
      position: "top-right"
    }
  ],
  seller: [
    {
      title: "List Property Fast",
      description: "Create listings in under 10 minutes",
      icon: <Building className="h-5 w-5" />,
      position: "top-left"
    },
    {
      title: "Reach Real Buyers",
      description: "Connect with pre-verified investors",
      icon: <Users className="h-5 w-5" />,
      position: "bottom-right"
    },
    {
      title: "Flexible Terms",
      description: "Sell on your terms, not the market's",
      icon: <ArrowRight className="h-5 w-5" />,
      position: "middle-left"
    },
    {
      title: "Save on Commissions",
      description: "Keep more equity when you sell direct",
      icon: <UserPlus className="h-5 w-5" />,
      position: "top-right"
    }
  ],
  rep: [
    {
      title: "Build Your Brand",
      description: "Create a professional profile for clients",
      icon: <UserPlus className="h-5 w-5" />,
      position: "top-left"
    },
    {
      title: "Connect With Clients",
      description: "Access both buyers and sellers direct",
      icon: <Users className="h-5 w-5" />,
      position: "bottom-right"
    },
    {
      title: "Close More Deals",
      description: "Streamline your workflow and paperwork",
      icon: <ArrowRight className="h-5 w-5" />,
      position: "middle-left"
    },
    {
      title: "Stand Out",
      description: "Showcase your expertise and services",
      icon: <Building className="h-5 w-5" />,
      position: "top-right"
    }
  ]
};

// Background gradients for different roles - with light washes 
const roleBackgrounds = {
  buyer: "from-[#F5F5F5] to-[#e6f0ec]", // light wash of #09261E
  seller: "from-[#F5F5F5] to-[#e7f1ed]", // light wash of #135341
  rep: "from-[#F5F5F5] to-[#f2e5e8]", // light wash of #803344
  // Multi-role combinations with soft spotlight gradients
  "buyer-seller": "bg-[#F5F5F5] bg-[radial-gradient(at_20%_40%,#09261E10,transparent),radial-gradient(at_80%_60%,#13534110,transparent)]",
  "buyer-rep": "bg-[#F5F5F5] bg-[radial-gradient(at_20%_40%,#09261E10,transparent),radial-gradient(at_80%_60%,#80334410,transparent)]",
  "seller-rep": "bg-[#F5F5F5] bg-[radial-gradient(at_20%_40%,#13534110,transparent),radial-gradient(at_80%_60%,#80334410,transparent)]",
  "buyer-seller-rep": "bg-[#F5F5F5] bg-[radial-gradient(at_20%_40%,#09261E10,transparent),radial-gradient(at_80%_60%,#80334410,transparent),radial-gradient(at_50%_80%,#13534110,transparent)]"
};

// Registration schemas for each step
const roleSchema = z.object({
  roles: z.array(z.enum(["buyer", "seller", "rep"])).min(1, "Please select at least one role")
});

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  verificationCode: z.string().optional()
});

const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password is required")
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

const phoneSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number"),
  smsCode: z.string().length(6, "Please enter the 6-digit code").optional()
});

// Step progress mapping
const stepProgress = {
  role: 25,
  email: 50, 
  password: 75,
  phone: 100,
  success: 100
};

export default function RegisterFlowPage() {
  const [, navigate] = useLocation();
  const { user, registerMutation } = useAuth();
  const { toast } = useToast();
  
  // State for multi-step flow
  const [currentStep, setCurrentStep] = useState<Step>("role");
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [primaryRole, setPrimaryRole] = useState<Role>("buyer");
  const [registrationData, setRegistrationData] = useState({
    roles: [] as Role[],
    email: "",
    password: "",
    phone: ""
  });
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  
  // Animation state
  const [animateCards, setAnimateCards] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const intervalRef = useRef<number | null>(null);

  // Form references for each step
  const roleForm = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      roles: []
    }
  });

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
      verificationCode: ""
    }
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
      smsCode: ""
    }
  });

  // Auto-rotate through roles every 5 seconds
  useEffect(() => {
    if (autoRotate && currentStep === "role") {
      intervalRef.current = window.setInterval(() => {
        setPrimaryRole(prev => {
          if (prev === "buyer") return "seller";
          if (prev === "seller") return "rep";
          return "buyer";
        });
        
        // Briefly disable animations when role changes automatically
        setAnimateCards(false);
        setTimeout(() => setAnimateCards(true), 100);
      }, 5000);
    }
    
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [autoRotate, currentStep]);

  // When user selects a role
  const toggleRole = (role: Role) => {
    setSelectedRoles(prev => {
      // Check if role is already selected
      if (prev.includes(role)) {
        // Allow removing all roles
        return prev.filter(r => r !== role);
      } else {
        // Add the role
        return [...prev, role];
      }
    });
    
    // Set as primary role when first selected
    if (!selectedRoles.includes(role)) {
      setPrimaryRole(role);
      // Stop auto rotation
      setAutoRotate(false);
    }
  };
  
  // Get background gradient based on selected roles
  const getBackgroundGradient = () => {
    if (selectedRoles.length === 0) {
      // Default background when no roles selected
      return "from-[#F5F5F5] to-[#e9e9e9]";
    } else if (selectedRoles.length === 1) {
      // Single role background
      return roleBackgrounds[selectedRoles[0]];
    } else {
      // Multiple roles - sort them alphabetically for consistent key lookup
      const sortedRoles = [...selectedRoles].sort().join("-");
      
      // Return mapped gradient or fallback to a default one
      return roleBackgrounds[sortedRoles as keyof typeof roleBackgrounds] || 
             "bg-gradient-to-br from-[#09261E] via-[#135341] to-[#803344]";
    }
  };

  // Handle role selection submit
  const onRoleSubmit = (data: z.infer<typeof roleSchema>) => {
    setRegistrationData(prev => ({
      ...prev,
      roles: selectedRoles
    }));
    setCurrentStep("email");
  };

  // Send email verification code
  const sendVerificationCode = async () => {
    const email = emailForm.getValues("email");
    if (!email || emailForm.formState.errors.email) {
      return;
    }

    // In a real app, you would call an API endpoint to send the verification code
    // For now, we'll simulate it
    toast({
      title: "Verification code sent",
      description: `A verification code has been sent to ${email}`,
    });
    
    setVerificationSent(true);
    
    // Auto-fill for demo purposes
    setTimeout(() => {
      emailForm.setValue("verificationCode", "123456");
    }, 1000);
  };

  // Verify email code
  const verifyEmailCode = () => {
    const code = emailForm.getValues("verificationCode");
    
    // In a real app, you would validate the code against what was sent
    // For now, we'll accept any 6-digit code
    if (code && code.length === 6) {
      setEmailVerified(true);
      toast({
        title: "Email verified",
        description: "Your email has been verified successfully",
      });
    } else {
      toast({
        title: "Invalid code",
        description: "Please enter a valid verification code",
        variant: "destructive"
      });
    }
  };

  // Handle email verification submit
  const onEmailSubmit = (data: z.infer<typeof emailSchema>) => {
    if (!emailVerified && !data.verificationCode) {
      sendVerificationCode();
      return;
    }
    
    if (!emailVerified && data.verificationCode) {
      verifyEmailCode();
      return;
    }
    
    // If verified or using social login, proceed
    setRegistrationData(prev => ({
      ...prev,
      email: data.email
    }));
    setCurrentStep("password");
  };

  // Handle password submission
  const onPasswordSubmit = (data: z.infer<typeof passwordSchema>) => {
    setRegistrationData(prev => ({
      ...prev,
      password: data.password
    }));
    setCurrentStep("phone");
  };

  // Send SMS verification code
  const sendSmsCode = () => {
    const phone = phoneForm.getValues("phone");
    if (!phone || phoneForm.formState.errors.phone) {
      return;
    }

    // In a real app, you would call an API to send the SMS code
    toast({
      title: "SMS code sent",
      description: `A verification code has been sent to ${phone}`,
    });
    
    setSmsSent(true);
    
    // Auto-fill for demo purposes
    setTimeout(() => {
      phoneForm.setValue("smsCode", "123456");
    }, 1000);
  };

  // Verify SMS code
  const verifySmsCode = () => {
    const code = phoneForm.getValues("smsCode");
    
    // In a real app, you would validate the code
    if (code && code.length === 6) {
      setPhoneVerified(true);
      toast({
        title: "Phone verified",
        description: "Your phone number has been verified successfully",
      });
    } else {
      toast({
        title: "Invalid code",
        description: "Please enter a valid SMS code",
        variant: "destructive"
      });
    }
  };

  // Handle phone verification submit
  const onPhoneSubmit = (data: z.infer<typeof phoneSchema>) => {
    if (!smsSent) {
      sendSmsCode();
      return;
    }
    
    if (!phoneVerified && data.smsCode) {
      verifySmsCode();
      return;
    }
    
    if (phoneVerified) {
      // Collect all registration data and register the user
      const completeRegistrationData = {
        username: registrationData.email, // Use email as username
        password: registrationData.password,
        email: registrationData.email,
        fullName: "", // We'll collect this in the onboarding
        userType: primaryRole, // Use the primary role
      };
      
      registerMutation.mutate(completeRegistrationData, {
        onSuccess: () => {
          setCurrentStep("success");
          // Wait a moment before redirecting to onboarding
          setTimeout(() => {
            navigate("/onboarding");
          }, 3000);
        }
      });
    }
  };

  // Handle social registration
  const handleSocialRegistration = (provider: string) => {
    // This would handle OAuth flow with the selected provider
    toast({
      title: `${provider} registration`,
      description: `${provider} registration would be triggered here, for roles: ${selectedRoles.join(", ")}`,
    });
    
    // For demo purposes, we'll just proceed to the next step
    if (currentStep === "role" && selectedRoles.length > 0) {
      setRegistrationData(prev => ({
        ...prev,
        roles: selectedRoles
      }));
      setCurrentStep("email");
      // Skip email verification for social logins
      setEmailVerified(true);
    } else if (currentStep === "email") {
      // For social login, we can skip password step too
      const email = emailForm.getValues("email") || `user@${provider.toLowerCase()}.com`;
      setRegistrationData(prev => ({
        ...prev,
        email: email,
        password: "oauth-passwordless" // Placeholder, would be handled differently in real app
      }));
      setCurrentStep("phone");
    }
  };

  // If user is already logged in, redirect to home
  if (user) {
    return <Redirect to="/" />;
  }

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case "role":
        return (
          <div className="animate-in fade-in-50 zoom-in-95 duration-500 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 max-w-md w-full p-6 sm:p-8 mx-auto relative z-10">
            <div className="mb-6">
              <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-2">Who are you?</h2>
              <p className="text-gray-500 text-sm">Choose the role(s) that describe how you'll use PropertyDeals</p>
            </div>
            
            {/* Role selection cards */}
            <Form {...roleForm}>
              <form onSubmit={roleForm.handleSubmit(onRoleSubmit)} className="space-y-6">
                <div className="space-y-3">
                  {Object.entries(roleDescriptions).map(([role, info]) => (
                    <div
                      key={role}
                      className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedRoles.includes(role as Role)
                          ? `border-2 ${
                              role === 'rep' 
                                ? 'border-[#803344] bg-[#FFF9FA]' 
                                : 'border-[#135341] bg-[#F4FAF7]'
                            }`
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => toggleRole(role as Role)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-2 ${
                          role === 'buyer' ? 'bg-[#F0F7F2]' :
                          role === 'seller' ? 'bg-[#E7F5EE]' :
                          'bg-[#FFF0F3]'
                        }`}>
                          {role === 'buyer' ? <Users className="h-5 w-5 text-[#135341]" /> :
                           role === 'seller' ? <Building className="h-5 w-5 text-[#135341]" /> :
                           <UserPlus className="h-5 w-5 text-[#803344]" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{info.title}</h3>
                          <p className="text-sm text-gray-500">{info.subtitle}</p>
                        </div>
                        <div className={`rounded-full w-5 h-5 flex items-center justify-center ${
                          selectedRoles.includes(role as Role)
                            ? role === 'rep' ? 'bg-[#803344] text-white' : 'bg-[#135341] text-white'
                            : 'border border-gray-300'
                        }`}>
                          {selectedRoles.includes(role as Role) && <Check className="h-3 w-3" />}
                        </div>
                      </div>
                      <div className="mt-1 ml-10">
                        <span className="text-xs text-gray-400">{info.tooltip}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  type="submit" 
                  className={`w-full ${
                    selectedRoles.length === 0 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : primaryRole === 'rep' 
                        ? 'bg-[#803344] hover:bg-[#a34d5e] text-white' 
                        : 'bg-[#09261E] hover:bg-[#0f3e2a] text-white'
                  } flex items-center justify-center gap-2 transition-colors`}
                  disabled={selectedRoles.length === 0}
                >
                  <span>{selectedRoles.length === 0 ? 'Select a Role to Continue' : 'Continue'}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
                {/* Progress bar at bottom of card */}
                <div className="mt-6 pt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-2 px-1">
                    <span>Step 1 of 4</span>
                    <span>25%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        selectedRoles.includes('rep') 
                          ? 'bg-[#803344]' 
                          : (selectedRoles.includes('buyer') || selectedRoles.includes('seller'))
                            ? 'bg-[#135341]'
                            : 'bg-gray-400'
                      }`} 
                      style={{ width: '25%' }}
                    ></div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        );
        
      case "email":
        return (
          <div className="animate-in fade-in-50 zoom-in-95 duration-500 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 max-w-md w-full p-6 sm:p-8 mx-auto relative z-10">
            <div className="mb-6">
              <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-2">Email Verification</h2>
              <p className="text-gray-500 text-sm">We'll use this email to keep your account secure</p>
            </div>
            
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="name@example.com" 
                          {...field} 
                          autoComplete="email"
                          type="email"
                          className="bg-white/90 h-10"
                          disabled={emailVerified}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {verificationSent && !emailVerified && (
                  <FormField
                    control={emailForm.control}
                    name="verificationCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input 
                              placeholder="Enter the 6-digit code" 
                              {...field} 
                              className="bg-white/90 h-10"
                            />
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={verifyEmailCode}
                            >
                              Verify
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-400 mt-1">
                          Didn't receive the code? <button type="button" className="text-[#135341] hover:underline" onClick={sendVerificationCode}>Resend</button>
                        </p>
                      </FormItem>
                    )}
                  />
                )}
                
                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    variant="outline"
                    type="button" 
                    onClick={() => setCurrentStep("role")}
                  >
                    Back
                  </Button>
                  
                  <Button 
                    type="submit" 
                    className={`flex-1 ${
                      primaryRole === 'rep' ? 'bg-[#803344] hover:bg-[#a34d5e]' : 'bg-[#09261E] hover:bg-[#0f3e2a]'
                    } text-white flex items-center justify-center gap-2`}
                    disabled={emailVerified ? false : (!verificationSent || !emailForm.getValues("verificationCode"))}
                  >
                    {
                      emailVerified ? (
                        <>
                          <span>Continue</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      ) : !verificationSent ? (
                        <>
                          <span>Get Verification Code</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <span>Verify & Continue</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )
                    }
                  </Button>
                </div>
                
                {/* Progress bar at bottom of card */}
                <div className="mt-6 pt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-2 px-1">
                    <span>Step 2 of 4</span>
                    <span>50%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        selectedRoles.includes('rep') 
                          ? 'bg-[#803344]' 
                          : 'bg-[#135341]'
                      }`} 
                      style={{ width: '50%' }}
                    ></div>
                  </div>
                </div>
                
                {/* Social registration options */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-xs text-gray-400">
                      OR SIGN UP WITH
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    size="icon"
                    className="w-12 h-12 rounded-full border text-xl flex items-center justify-center hover:bg-gray-50 transition-all"
                    onClick={() => handleSocialRegistration('Google')}
                  >
                    <SiGoogle className="h-5 w-5" />
                    <span className="sr-only">Sign up with Google</span>
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="outline" 
                    size="icon"
                    className="w-12 h-12 rounded-full border text-xl flex items-center justify-center hover:bg-gray-50 transition-all"
                    onClick={() => handleSocialRegistration('Apple')}
                  >
                    <SiApple className="h-5 w-5" />
                    <span className="sr-only">Sign up with Apple</span>
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="outline" 
                    size="icon"
                    className="w-12 h-12 rounded-full border text-xl flex items-center justify-center hover:bg-gray-50 transition-all"
                    onClick={() => handleSocialRegistration('Facebook')}
                  >
                    <SiFacebook className="h-5 w-5 text-[#1877F2]" />
                    <span className="sr-only">Sign up with Facebook</span>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        );
        
      case "password":
        return (
          <div className="animate-in fade-in-50 zoom-in-95 duration-500 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 max-w-md w-full p-6 sm:p-8 mx-auto relative z-10">
            <div className="mb-6">
              <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-2">Create a Password</h2>
              <p className="text-gray-500 text-sm">You're almost there! Set a secure password for your account</p>
            </div>
            
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Create a secure password" 
                          {...field} 
                          className="bg-white/90 h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Confirm your password" 
                          {...field} 
                          className="bg-white/90 h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    variant="outline"
                    type="button" 
                    onClick={() => setCurrentStep("email")}
                  >
                    Back
                  </Button>
                  
                  <Button 
                    type="submit" 
                    className={`flex-1 ${
                      primaryRole === 'rep' ? 'bg-[#803344] hover:bg-[#a34d5e]' : 'bg-[#09261E] hover:bg-[#0f3e2a]'
                    } text-white flex items-center justify-center gap-2`}
                  >
                    <span>Secure My Account</span>
                    <Key className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Progress bar at bottom of card */}
                <div className="mt-6 pt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-2 px-1">
                    <span>Step 3 of 4</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        selectedRoles.includes('rep') 
                          ? 'bg-[#803344]' 
                          : 'bg-[#135341]'
                      }`} 
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        );
        
      case "phone":
        return (
          <div className="animate-in fade-in-50 zoom-in-95 duration-500 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 max-w-md w-full p-6 sm:p-8 mx-auto relative z-10">
            <div className="mb-6">
              <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-2">Phone Verification</h2>
              <p className="text-gray-500 text-sm">We'll text you a code to confirm your number</p>
            </div>
            
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                <FormField
                  control={phoneForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(123) 456-7890" 
                          {...field} 
                          type="tel"
                          className="bg-white/90 h-10"
                          disabled={phoneVerified}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {smsSent && !phoneVerified && (
                  <FormField
                    control={phoneForm.control}
                    name="smsCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input 
                              placeholder="Enter the 6-digit code" 
                              {...field} 
                              className="bg-white/90 h-10"
                            />
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={verifySmsCode}
                            >
                              Verify
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-400 mt-1">
                          Didn't receive the code? <button type="button" className="text-[#135341] hover:underline" onClick={sendSmsCode}>Resend</button>
                        </p>
                      </FormItem>
                    )}
                  />
                )}
                
                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    variant="outline"
                    type="button" 
                    onClick={() => setCurrentStep("password")}
                  >
                    Back
                  </Button>
                  
                  <Button 
                    type="submit" 
                    className={`flex-1 ${
                      primaryRole === 'rep' ? 'bg-[#803344] hover:bg-[#a34d5e]' : 'bg-[#09261E] hover:bg-[#0f3e2a]'
                    } text-white flex items-center justify-center gap-2`}
                    disabled={registerMutation.isPending || (!smsSent && !phoneVerified)}
                  >
                    {
                      registerMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : phoneVerified ? (
                        <>
                          <span>Complete Registration</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      ) : !smsSent ? (
                        <>
                          <span>Send Verification Code</span>
                          <Phone className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <span>Verify & Continue</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )
                    }
                  </Button>
                </div>
                
                {/* Progress bar at bottom of card */}
                <div className="mt-6 pt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-2 px-1">
                    <span>Step 4 of 4</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        selectedRoles.includes('rep') 
                          ? 'bg-[#803344]' 
                          : 'bg-[#135341]'
                      }`} 
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        );
        
      case "success":
        return (
          <div className="animate-in fade-in-50 zoom-in-95 duration-500 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 max-w-md w-full p-6 sm:p-8 mx-auto relative z-10 text-center">
            <div className="flex justify-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                primaryRole === 'rep' ? 'bg-[#803344]/20' : 'bg-[#135341]/20'
              }`}>
                <Check className={`h-8 w-8 ${
                  primaryRole === 'rep' ? 'text-[#803344]' : 'text-[#135341]'
                }`} />
              </div>
            </div>
            
            <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-2">🎉 Welcome to PropertyDeals!</h2>
            <p className="text-gray-500 mb-6">Your account is ready. You're now part of the network.</p>
            
            <div className="space-y-3">
              <Button 
                className={`w-full ${
                  primaryRole === 'rep' ? 'bg-[#803344] hover:bg-[#a34d5e]' : 'bg-[#09261E] hover:bg-[#0f3e2a]'
                } text-white`}
                onClick={() => navigate("/")}
              >
                Start Exploring
              </Button>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate("/onboarding")}
              >
                Build Your Profile
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} relative overflow-hidden flex items-center justify-center py-10 sm:py-16`}>
      {/* Rotating role-specific tagline */}
      <div className="absolute top-8 sm:top-12 left-1/2 transform -translate-x-1/2 z-20">
        <div className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 shadow-sm">
          <span className="text-xs font-semibold tracking-wide animate-in fade-in duration-500">
            <span className={`${
              primaryRole === 'rep' ? 'text-[#803344]' : 'text-[#135341]'  
            }`}>• </span>
            <span className="text-[#09261E]">
              {selectedRoles.length === 0 ? 'CHOOSE YOUR ROLE' :
               selectedRoles.length > 1 ? 'MULTIPLE ROLES SELECTED' :
               primaryRole === 'buyer' ? 'MADE FOR BUYERS' : 
               primaryRole === 'seller' ? 'MADE FOR SELLERS' : 
               'MADE FOR REPS'}
            </span>
            <span className={`${
              primaryRole === 'rep' ? 'text-[#803344]' : 'text-[#135341]'  
            }`}> •</span>
          </span>
        </div>
      </div>
      
      {/* Removed the progress bar from here - it will be at bottom of each card instead */}
      
      {/* Radial glow behind the card */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className={`w-[700px] h-[700px] rounded-full ${
          primaryRole === 'buyer' ? 'bg-gradient-radial from-[#d6ebe2]/80 to-transparent' :
          primaryRole === 'seller' ? 'bg-gradient-radial from-[#d5f0e0]/80 to-transparent' :
          'bg-gradient-radial from-[#f2dfe1]/80 to-transparent'
        } opacity-70 transition-all duration-700`}></div>
      </div>
      
      {/* Background feature cards on larger screens */}
      <div className="hidden sm:block absolute inset-0 overflow-hidden pointer-events-none">
        {/* Show cards based on all selected roles (for desktop/tablet only) */}
        {animateCards && (selectedRoles.length > 0 ? selectedRoles : [primaryRole]).flatMap((role, roleIndex) => {
          // Get cards for this role
          const cards = roleCards[role];
          
          // Calculate offset based on total number of selected roles
          const totalRoles = selectedRoles.length || 1;
          const offsetFactor = roleIndex / Math.max(1, totalRoles - 1); // 0 for first, 1 for last
          
          return cards.map((card, cardIndex) => {
            // Define positions based on card position, number of roles, and role index
            let positionClasses = "";
            let animationClasses = "";
            let animationDelay = 200 + (cardIndex * 100) + (roleIndex * 50); // Staggered animations
            
            // Position cards based on role index and total roles
            if (totalRoles === 1) {
              // Single role - use original positioning
              if (card.position === "top-left") {
                positionClasses = "top-24 left-4 md:top-20 md:-left-4 lg:left-16 rotate-[1.5deg]";
              } else if (card.position === "bottom-right") {
                positionClasses = "bottom-24 right-4 md:bottom-16 md:-right-8 lg:right-20 rotate-[-2deg]";
              } else if (card.position === "middle-left") {
                positionClasses = "top-1/2 -translate-y-1/2 -left-16 md:-left-8 lg:left-4 rotate-[-1.5deg] hidden md:block";
              } else if (card.position === "top-right") {
                positionClasses = "top-32 right-4 md:top-28 md:right-0 lg:right-12 rotate-[2deg]";
              }
            } else {
              // Multiple roles - distribute cards evenly
              // Left to right distribution based on role index
              const horizontalOffset = `${20 + (offsetFactor * 60)}%`; // 20% to 80% of screen width
              
              // Vertical distribution based on card index
              const verticalPositions = ["top-24", "top-1/2 -translate-y-1/2", "bottom-24", "top-40"];
              const rotation = [(1.5 - offsetFactor), (-1.5 + offsetFactor), (1 - offsetFactor), (-1 + offsetFactor)];
            
              positionClasses = `${verticalPositions[cardIndex]} left-[${horizontalOffset}] rotate-[${rotation[cardIndex]}deg]`;
            }
            
            // Animation classes
            animationClasses = `animate-in fade-in-50 duration-700 delay-[${animationDelay}ms]`;
            if (offsetFactor < 0.5) {
              animationClasses += " slide-in-from-left-10";
            } else {
              animationClasses += " slide-in-from-right-10";
            }
            
            // Optionally add blur to some cards for depth effect
            const blurClass = cardIndex % 3 === 1 ? "blur-[1px]" : "";
            
            // Scale down cards on smaller screens
            const sizeClasses = "w-[180px] md:w-[200px] lg:w-[220px]";
            
            return (
              <div 
                key={`${role}-${cardIndex}-desktop`}
                className={`absolute ${positionClasses} transform ${animationClasses} hover:-translate-y-1 hover:shadow-lg transition-all`}
              >
                <div className={`bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-lg shadow-md ${sizeClasses} text-sm border border-gray-100 ${blurClass}`}>
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      role === 'rep' ? 'bg-[#FFF0F3]' : 'bg-[#F0F7F2]'
                    }`}>
                      {card.icon}
                    </div>
                    <div>
                      <h3 className={`font-heading font-bold text-base ${
                        role === 'rep' ? 'text-[#803344]' : 'text-[#09261E]'
                      }`}>
                        {card.title}
                      </h3>
                      <p className="text-gray-600 text-xs md:text-sm">{card.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          });
        })}
      </div>
      
      {/* Current step content */}
      {renderStep()}
      
      {/* Already have an account link */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-sm text-gray-500">
          Already have an account? {" "}
          <Link 
            href="/signin" 
            className={`${
              primaryRole === 'rep' ? 'text-[#803344]' : 'text-[#135341]'
            } font-semibold hover:underline`}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}