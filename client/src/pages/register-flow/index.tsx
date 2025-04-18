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
import { Loader2, ArrowRight, Check, Building, Users, UserPlus, Phone, Key, Eye, EyeOff } from "lucide-react";
import { SiGoogle, SiApple, SiFacebook, SiGmail } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { OTPInput, SlotProps } from "input-otp";

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

// Role-specific colors with tie-dye washes for combinations
const roleColors = {
  buyer: {
    color: "#09261E", // dark green
    bgColor: "#09261E30", // dark green with transparency
    position: "at 20% 40%"
  },
  seller: {
    color: "#135341", // light green
    bgColor: "#13534130", // light green with transparency
    position: "at 80% 60%"
  },
  rep: {
    color: "#803344", // wine red
    bgColor: "#80334430", // wine red with transparency
    position: "at 50% 80%"
  }
};

// Background gradients for different roles - with more saturated washes 
const roleBackgrounds = {
  buyer: "from-[#F5F5F5] to-[#09261E40]", // dark green wash - more saturated
  seller: "from-[#F5F5F5] to-[#13534140]", // light green wash - more saturated
  rep: "from-[#F5F5F5] to-[#80334440]", // wine red wash - more saturated
  
  // Tie-dye effect with multiple color gradients that blend - more saturated
  "buyer-seller": "bg-gradient-to-br from-[#09261E50] via-[#F0F7F2] to-[#13534150]",
  "buyer-rep": "bg-gradient-to-br from-[#09261E50] via-[#F0F7F2] to-[#80334450]",
  "seller-rep": "bg-gradient-to-br from-[#13534150] via-[#F0F7F2] to-[#80334450]",
  "buyer-seller-rep": "bg-gradient-to-br from-[#09261E50] via-[#13534150] to-[#80334450]"
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
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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
  
  // Get background gradient based on selected roles - using tie-dye effect for multiple roles
  const getBackgroundGradient = () => {
    if (selectedRoles.length === 0) {
      // Default background when no roles selected
      return "from-[#F5F5F5] to-[#e9e9e9]";
    } else if (selectedRoles.length === 1) {
      // Single role background
      return roleBackgrounds[selectedRoles[0]];
    } else {
      // Multi-role selection - always create a tie-dye with all selected roles
      // Even if just 2 are selected, always add green and red tones per request
      
      if (selectedRoles.includes('buyer') && selectedRoles.includes('seller') && selectedRoles.includes('rep')) {
        // All three roles selected - use gradient blending all three colors
        return "bg-gradient-to-tr from-[#09261E60] via-[#13534160] to-[#80334460]";
      } else if (selectedRoles.includes('buyer') && selectedRoles.includes('seller')) {
        // Buyer and seller - blend dark green and light green
        return "bg-gradient-to-br from-[#09261E60] to-[#13534160]";
      } else if (selectedRoles.includes('buyer') && selectedRoles.includes('rep')) {
        // Buyer and rep - blend dark green and wine red
        return "bg-gradient-to-br from-[#09261E60] to-[#80334460]";
      } else if (selectedRoles.includes('seller') && selectedRoles.includes('rep')) {
        // Seller and rep - blend light green and wine red
        return "bg-gradient-to-br from-[#13534160] to-[#80334460]";
      }
      
      // Fallback to multiple radial gradients if we somehow have an unhandled combination
      const gradients = selectedRoles.map(role => {
        const { position, bgColor } = roleColors[role];
        return `radial-gradient(${position}, ${bgColor}, transparent 70%)`;
      });
      
      return `bg-[${gradients.join(',')}]`;
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

  // State for loading states
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  
  // Send email verification code
  const sendVerificationCode = async () => {
    const email = emailForm.getValues("email");
    if (!email || emailForm.formState.errors.email) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    // Show loading state
    setIsSendingCode(true);
    
    try {
      // In a real app, you would call an API endpoint to send the verification code
      // For now, we'll simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Verification code sent",
        description: `A verification code has been sent to ${email}`,
      });
      
      setVerificationSent(true);
      
      // Auto-fill for demo purposes
      setTimeout(() => {
        emailForm.setValue("verificationCode", "123456");
      }, 1000);
    } catch (error) {
      toast({
        title: "Failed to send code",
        description: "Please check your email address and try again",
        variant: "destructive"
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  // Verify email code
  const verifyEmailCode = async () => {
    const code = emailForm.getValues("verificationCode");
    
    if (!code) {
      toast({
        title: "Missing verification code",
        description: "Please enter the 6-digit code sent to your email",
        variant: "destructive"
      });
      return;
    }
    
    setIsVerifyingCode(true);
    
    try {
      // In a real app, you would validate the code against what was sent
      // Simulate a network request with a timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (code.length === 6) {
        setEmailVerified(true);
        toast({
          title: "Email verified",
          description: "Your email has been verified successfully",
        });
        
        // Auto proceed to next step after successful verification
        setTimeout(() => {
          setRegistrationData(prev => ({
            ...prev,
            email: emailForm.getValues("email")
          }));
          setCurrentStep("password");
        }, 1200);
      } else {
        toast({
          title: "Invalid code",
          description: "Please enter a valid 6-digit verification code",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Please try again or request a new code",
        variant: "destructive"
      });
    } finally {
      setIsVerifyingCode(false);
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

  // State for SMS loading
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [isVerifyingSms, setIsVerifyingSms] = useState(false);

  // Send SMS verification code
  const sendSmsCode = async () => {
    const phone = phoneForm.getValues("phone");
    if (!phone || phoneForm.formState.errors.phone) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }

    setIsSendingSms(true);
    
    try {
      // In a real app, you would call an API to send the SMS code
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "SMS code sent",
        description: `A verification code has been sent to ${phone}`,
      });
      
      setSmsSent(true);
      
      // Auto-fill for demo purposes
      setTimeout(() => {
        phoneForm.setValue("smsCode", "123456");
      }, 1000);
    } catch (error) {
      toast({
        title: "Failed to send code",
        description: "Please check your phone number and try again",
        variant: "destructive"
      });
    } finally {
      setIsSendingSms(false);
    }
  };

  // Verify SMS code
  const verifySmsCode = async () => {
    const code = phoneForm.getValues("smsCode");
    
    if (!code) {
      toast({
        title: "Missing verification code",
        description: "Please enter the 6-digit code sent to your phone",
        variant: "destructive"
      });
      return;
    }
    
    setIsVerifyingSms(true);
    
    try {
      // In a real app, you would validate the code
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (code.length === 6) {
        setPhoneVerified(true);
        toast({
          title: "Phone verified",
          description: "Your phone number has been verified successfully",
        });
      } else {
        toast({
          title: "Invalid code",
          description: "Please enter a valid 6-digit SMS code",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Please try again or request a new code",
        variant: "destructive"
      });
    } finally {
      setIsVerifyingSms(false);
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
                  type="button" 
                  className={`w-full ${
                    selectedRoles.length === 0 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : primaryRole === 'rep' 
                        ? 'bg-[#803344] hover:bg-[#a34d5e] text-white' 
                        : 'bg-[#09261E] hover:bg-[#0f3e2a] text-white'
                  } flex items-center justify-center gap-2 transition-colors`}
                  disabled={selectedRoles.length === 0}
                  onClick={() => {
                    if (selectedRoles.length > 0) {
                      // Handle role selection and move to next step
                      setRegistrationData(prev => ({
                        ...prev,
                        roles: selectedRoles
                      }));
                      setCurrentStep("email");
                    }
                  }}
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
                          <div className="space-y-4">
                            <div className="mb-3">
                              <p className="text-sm text-gray-600 mb-4 text-center">
                                Please enter the verification code sent to your email address
                                <span className="font-semibold block mt-1">{emailForm.getValues("email")}</span>
                              </p>
                              
                              <div className="flex items-center gap-2">
                                <OTPInput
                                  maxLength={6}
                                  containerClassName="flex items-center gap-1"
                                  value={field.value || ""}
                                  onChange={(value) => {
                                    field.onChange(value);
                                    // Auto-verify when all 6 digits are entered
                                    if (value.length === 6) {
                                      setTimeout(() => verifyEmailCode(), 300);
                                    }
                                  }}
                                  render={({ slots }) => (
                                    <>
                                      {slots.map((slot, idx) => (
                                        <div key={idx} className="relative">
                                          <input
                                            {...slot}
                                            className="w-10 h-12 text-center text-lg font-semibold rounded-md border border-gray-300 focus:ring-1 focus:ring-[#135341] focus:border-[#135341] focus:outline-none transition-all bg-white/90 disabled:opacity-50"
                                            disabled={isVerifyingCode}
                                            autoComplete={idx === 0 ? "one-time-code" : "off"}
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                          />
                                        </div>
                                      ))}
                                    </>
                                  )}
                                />
                                
                                <Button 
                                  type="button" 
                                  variant="outline"
                                  onClick={verifyEmailCode}
                                  disabled={isVerifyingCode || !field.value || field.value.length < 6}
                                  className="h-12 px-3"
                                >
                                  {isVerifyingCode ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    'Verify'
                                  )}
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex flex-col space-y-4">
                              <div className="flex items-center">
                                <p className="text-xs text-gray-500">
                                  Can't find the email? {" "}
                                  <button 
                                    type="button" 
                                    className="text-[#135341] hover:underline" 
                                    onClick={() => {
                                      // Clear the OTP fields on resend
                                      field.onChange("");
                                      sendVerificationCode();
                                    }}
                                    disabled={isSendingCode}
                                  >
                                    {isSendingCode ? 'Sending...' : 'Resend'}
                                  </button>
                                </p>
                              </div>
                              
                              {/* Gmail and Outlook quick links */}
                              <div className="flex justify-center gap-4 pt-2 pb-2">
                                <a 
                                  href="https://mail.google.com" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-gray-100 rounded-md flex items-center gap-2 text-sm font-medium hover:bg-gray-200 transition-colors text-gray-700"
                                >
                                  <SiGmail className="h-5 w-5 text-[#EA4335]" />
                                  Open Gmail
                                </a>
                                <a 
                                  href="https://outlook.live.com/mail" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-gray-100 rounded-md flex items-center gap-2 text-sm font-medium hover:bg-gray-200 transition-colors text-gray-700"
                                >
                                  <svg className="h-5 w-5 text-[#0078D4]" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.8 8.6c0-1-.9-1.9-1.9-1.9H15v7.6h6c1 0 1.9-.9 1.9-1.9V8.6zm-8.4 5.7c0 .3-.3.6-.6.6H3c-.3 0-.6-.3-.6-.6V7.6c0-.3.3-.6.6-.6h10.7c.3 0 .6.3.6.6v6.7z" />
                                  </svg>
                                  Open Outlook
                                </a>
                              </div>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
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
                    disabled={
                      emailVerified ? false : 
                      isSendingCode ? true :
                      (verificationSent && !emailForm.getValues("verificationCode"))
                    }
                  >
                    {
                      emailVerified ? (
                        <>
                          <span>Continue</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      ) : isSendingCode ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : !verificationSent ? (
                        <>
                          <span>Get Verification Code</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      ) : isVerifyingCode ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          <span>Verifying...</span>
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
                <div className="mt-8 mb-2">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full bg-gray-200" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-[#F5F5F5] px-4 text-sm text-gray-500 font-medium">
                        Or sign up with
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-6 mt-6">
                    <Button 
                      type="button"
                      variant="outline" 
                      size="icon"
                      className="w-12 h-12 rounded-full border border-gray-200 text-xl flex items-center justify-center hover:bg-gray-50 transition-all"
                      onClick={() => handleSocialRegistration('Google')}
                    >
                      <SiGoogle className="h-5 w-5" />
                      <span className="sr-only">Sign up with Google</span>
                    </Button>
                    
                    <Button 
                      type="button"
                      variant="outline" 
                      size="icon"
                      className="w-12 h-12 rounded-full border border-gray-200 text-xl flex items-center justify-center hover:bg-gray-50 transition-all"
                      onClick={() => handleSocialRegistration('Apple')}
                    >
                      <SiApple className="h-5 w-5" />
                      <span className="sr-only">Sign up with Apple</span>
                    </Button>
                    
                    <Button 
                      type="button"
                      variant="outline" 
                      size="icon"
                      className="w-12 h-12 rounded-full border border-gray-200 text-xl flex items-center justify-center hover:bg-gray-50 transition-all"
                      onClick={() => handleSocialRegistration('Facebook')}
                    >
                      <SiFacebook className="h-5 w-5 text-[#1877F2]" />
                      <span className="sr-only">Sign up with Facebook</span>
                    </Button>
                  </div>
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
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="" 
                            {...field} 
                            className="bg-white/90 h-10 pr-10"
                          />
                          <button 
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
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
                        <div className="relative">
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="" 
                            {...field} 
                            className="bg-white/90 h-10 pr-10"
                          />
                          <button 
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Show Password Checkbox */}
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="show-password"
                    className="rounded border-gray-300 text-[#135341] focus:ring-[#135341] h-4 w-4"
                    checked={showPassword && showConfirmPassword}
                    onChange={(e) => {
                      setShowPassword(e.target.checked);
                      setShowConfirmPassword(e.target.checked);
                    }}
                  />
                  <label htmlFor="show-password" className="ml-2 text-sm text-gray-600">
                    Show password
                  </label>
                </div>
                
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
                          <div className="space-y-4">
                            <div className="mb-3">
                              <p className="text-sm text-gray-600 mb-4 text-center">
                                Please enter the verification code sent to your phone number
                                <span className="font-semibold block mt-1">{phoneForm.getValues("phone")}</span>
                              </p>
                              
                              <div className="flex items-center gap-2">
                                <OTPInput
                                  maxLength={6}
                                  containerClassName="flex items-center gap-1"
                                  value={field.value || ""}
                                  onChange={(value) => {
                                    field.onChange(value);
                                    // Auto-verify when all 6 digits are entered
                                    if (value.length === 6) {
                                      setTimeout(() => verifySmsCode(), 300);
                                    }
                                  }}
                                  render={({ slots }) => (
                                    <>
                                      {slots.map((slot, idx) => (
                                        <div key={idx} className="relative">
                                          <input
                                            {...slot}
                                            className="w-10 h-12 text-center text-lg font-semibold rounded-md border border-gray-300 focus:ring-1 focus:ring-[#135341] focus:border-[#135341] focus:outline-none transition-all bg-white/90 disabled:opacity-50"
                                            disabled={isVerifyingSms}
                                            autoComplete={idx === 0 ? "one-time-code" : "off"}
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                          />
                                        </div>
                                      ))}
                                    </>
                                  )}
                                />
                                
                                <Button 
                                  type="button" 
                                  variant="outline"
                                  onClick={verifySmsCode}
                                  disabled={isVerifyingSms || !field.value || field.value.length < 6}
                                  className="h-12 px-3"
                                >
                                  {isVerifyingSms ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    'Verify'
                                  )}
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <p className="text-xs text-gray-500">
                                Didn't receive the code? {" "}
                                <button 
                                  type="button" 
                                  className="text-[#135341] hover:underline" 
                                  onClick={() => {
                                    // Clear the OTP fields on resend
                                    field.onChange("");
                                    sendSmsCode();
                                  }}
                                  disabled={isSendingSms}
                                >
                                  {isSendingSms ? 'Sending...' : 'Resend'}
                                </button>
                              </p>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
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
      
      {/* Radial glow behind the card - tie-dye effect for multiple roles */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* For single role selection */}
        {selectedRoles.length <= 1 && (
          <div className={`w-[700px] h-[700px] rounded-full ${
            primaryRole === 'buyer' ? 'bg-gradient-radial from-[#09261E]/60 to-transparent' :
            primaryRole === 'seller' ? 'bg-gradient-radial from-[#135341]/60 to-transparent' :
            'bg-gradient-radial from-[#803344]/60 to-transparent'
          } opacity-80 transition-all duration-700`}></div>
        )}
        
        {/* Tie-dye effect with multiple gradients for multiple roles */}
        {selectedRoles.length > 1 && (
          <div className="relative w-[700px] h-[700px]">
            {/* Always include all colors in tie-dye effect for multiple selections */}
            {/* Layer for buyer */}
            {selectedRoles.includes('buyer') && (
              <div className="absolute inset-0 bg-gradient-radial from-[#09261E]/60 to-transparent opacity-80 rounded-full transform translate-x-[-5%] translate-y-[-5%] transition-all duration-700"></div>
            )}
            
            {/* Layer for seller */}
            {selectedRoles.includes('seller') && (
              <div className="absolute inset-0 bg-gradient-radial from-[#135341]/60 to-transparent opacity-80 rounded-full transform translate-x-[5%] translate-y-[5%] transition-all duration-700"></div>
            )}
            
            {/* Layer for rep */}
            {selectedRoles.includes('rep') && (
              <div className="absolute inset-0 bg-gradient-radial from-[#803344]/60 to-transparent opacity-80 rounded-full transition-all duration-700"></div>
            )}
          </div>
        )}
      </div>
      
      {/* Background feature cards - positioned exactly like /signin */}
      <div className="hidden sm:block absolute inset-0 overflow-hidden pointer-events-none">
        {animateCards && (
          <>
            {/* Buyer cards - top row */}
            <div className="hidden md:block absolute top-[120px] left-[100px] rotate-[1deg] shadow-md bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-lg border border-transparent hover:border-[#09261E]/30 w-[180px] md:w-[200px] lg:w-[220px] animate-in fade-in-50 duration-700 hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg shrink-0 bg-[#F0F7F2]">
                  {roleCards.buyer[0].icon}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#09261E]">
                    {roleCards.buyer[0].title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm">{roleCards.buyer[0].description}</p>
                </div>
              </div>
            </div>

            <div className="hidden md:block absolute top-[120px] right-[100px] rotate-[-1deg] shadow-md bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-lg border border-transparent hover:border-[#09261E]/30 w-[180px] md:w-[200px] lg:w-[220px] animate-in fade-in-50 duration-700 hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg shrink-0 bg-[#F0F7F2]">
                  {roleCards.buyer[1].icon}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#09261E]">
                    {roleCards.buyer[1].title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm">{roleCards.buyer[1].description}</p>
                </div>
              </div>
            </div>

            {/* Seller cards - bottom row */}
            <div className="hidden md:block absolute bottom-[140px] left-[100px] rotate-[-1.5deg] shadow-md bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-lg border border-transparent hover:border-[#135341]/30 w-[180px] md:w-[200px] lg:w-[220px] animate-in fade-in-50 duration-700 hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg shrink-0 bg-[#F0F7F2]">
                  {roleCards.seller[0].icon}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#09261E]">
                    {roleCards.seller[0].title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm">{roleCards.seller[0].description}</p>
                </div>
              </div>
            </div>

            <div className="hidden md:block absolute bottom-[140px] right-[100px] rotate-[0.5deg] shadow-md bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-lg border border-transparent hover:border-[#135341]/30 w-[180px] md:w-[200px] lg:w-[220px] animate-in fade-in-50 duration-700 hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg shrink-0 bg-[#F0F7F2]">
                  {roleCards.seller[1].icon}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#09261E]">
                    {roleCards.seller[1].title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm">{roleCards.seller[1].description}</p>
                </div>
              </div>
            </div>

            {/* REP cards - middle row, only visible on large screens */}
            <div className="hidden lg:block absolute top-[50%] left-[50px] -translate-y-1/2 rotate-[2deg] shadow-md bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-lg border border-transparent hover:border-[#803344]/30 w-[180px] md:w-[200px] lg:w-[220px] animate-in fade-in-50 duration-700 hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg shrink-0 bg-[#FFF0F3]">
                  {roleCards.rep[0].icon}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#803344]">
                    {roleCards.rep[0].title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm">{roleCards.rep[0].description}</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block absolute top-[50%] right-[50px] -translate-y-1/2 rotate-[-2deg] shadow-md bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-lg border border-transparent hover:border-[#803344]/30 w-[180px] md:w-[200px] lg:w-[220px] animate-in fade-in-50 duration-700 hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg shrink-0 bg-[#FFF0F3]">
                  {roleCards.rep[1].icon}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#803344]">
                    {roleCards.rep[1].title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm">{roleCards.rep[1].description}</p>
                </div>
              </div>
            </div>
          </>
        )}
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