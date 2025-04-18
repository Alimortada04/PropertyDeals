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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowRight, UserPlus, Building, Users } from "lucide-react";
import { SiGoogle, SiApple, SiFacebook } from "react-icons/si";

// User types
type Role = "buyer" | "seller" | "rep";

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

// Background gradients for different roles - more saturated brand-aligned gradient
const roleBackgrounds = {
  buyer: "from-[#F5F5F5] to-[#d6ebe2]",
  seller: "from-[#F5F5F5] to-[#d5f0e0]",
  rep: "from-[#F5F5F5] to-[#f2dfe1]"
};

// Base registration schema
const baseRegisterSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  email: z.string().email("Please enter a valid email address"),
  fullName: z.string().min(2, "Full name is required"),
  enableBiometric: z.boolean().default(false),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  }),
});

// Role-specific schemas
const buyerSchema = baseRegisterSchema.extend({
  city: z.string().optional(),
  investmentGoals: z.string().optional(),
});

const sellerSchema = baseRegisterSchema.extend({
  propertyLocation: z.string().min(2, "Property location is required"),
  preferredSaleMethod: z.string().optional(),
});

const repSchema = baseRegisterSchema.extend({
  repType: z.string().min(2, "REP type is required"),
  company: z.string().optional(),
  yearsExperience: z.string().optional(),
});

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const { user, registerMutation } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role>("buyer");
  const [animateCards, setAnimateCards] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const intervalRef = useRef<number | null>(null);
  
  // Role taglines
  const roleTags = {
    buyer: "MADE FOR BUYERS",
    seller: "MADE FOR SELLERS",
    rep: "MADE FOR REPS"
  };
  
  // Auto-rotate through roles every 6 seconds
  useEffect(() => {
    if (autoRotate) {
      intervalRef.current = window.setInterval(() => {
        setSelectedRole(prev => {
          if (prev === "buyer") return "seller";
          if (prev === "seller") return "rep";
          return "buyer";
        });
        
        // Briefly disable animations when role changes automatically
        setAnimateCards(false);
        setTimeout(() => setAnimateCards(true), 100);
      }, 6000);
    }
    
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [autoRotate]);
  
  // Get the appropriate schema based on the selected role
  const getSchemaForRole = useCallback(() => {
    switch (selectedRole) {
      case "buyer":
        return buyerSchema;
      case "seller":
        return sellerSchema;
      case "rep":
        return repSchema;
      default:
        return baseRegisterSchema;
    }
  }, [selectedRole]);

  // Register form
  const registerForm = useForm<z.infer<typeof buyerSchema> | z.infer<typeof sellerSchema> | z.infer<typeof repSchema>>({
    resolver: zodResolver(getSchemaForRole()),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      fullName: "",
      enableBiometric: false,
      agreeToTerms: false,
      // Role-specific defaults
      ...(selectedRole === "buyer" ? { city: "", investmentGoals: "" } : {}),
      ...(selectedRole === "seller" ? { propertyLocation: "", preferredSaleMethod: "" } : {}),
      ...(selectedRole === "rep" ? { repType: "", company: "", yearsExperience: "" } : {}),
    },
  });

  // When role changes, reset the form with new defaults
  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    // Stop auto rotation when user manually selects a role
    setAutoRotate(false);
    
    registerForm.reset({
      username: registerForm.getValues("username"),
      password: registerForm.getValues("password"),
      confirmPassword: registerForm.getValues("confirmPassword"),
      email: registerForm.getValues("email"),
      fullName: registerForm.getValues("fullName"),
      enableBiometric: registerForm.getValues("enableBiometric"),
      agreeToTerms: registerForm.getValues("agreeToTerms"),
      // Role-specific defaults
      ...(role === "buyer" ? { city: "", investmentGoals: "" } : {}),
      ...(role === "seller" ? { propertyLocation: "", preferredSaleMethod: "" } : {}),
      ...(role === "rep" ? { repType: "", company: "", yearsExperience: "" } : {}),
    });
    
    // Briefly disable animations when manually changing roles
    setAnimateCards(false);
    setTimeout(() => setAnimateCards(true), 100);
  };

  // Handle registration submission
  function onRegisterSubmit(values: any) {
    // Check if passwords match
    if (values.password !== values.confirmPassword) {
      registerForm.setError("confirmPassword", { 
        type: "manual", 
        message: "Passwords do not match" 
      });
      return;
    }

    // Prepare the registration data
    const registrationData = {
      username: values.username,
      password: values.password,
      email: values.email,
      fullName: values.fullName,
      userType: selectedRole,
      // Add additional fields based on role
      // Note: The backend will need to be updated to handle these additional fields
    };

    registerMutation.mutate(registrationData, {
      onSuccess: () => {
        // Redirect to onboarding page after successful registration
        navigate("/onboarding");
      }
    });
  }

  // Handle social registration
  const handleSocialRegistration = (provider: string) => {
    // This would handle OAuth flow with the selected provider
    alert(`${provider} registration would be triggered here, for role: ${selectedRole}`);
  };

  // If user is already logged in, redirect to home
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${roleBackgrounds[selectedRole]} relative overflow-hidden flex items-center justify-center py-10 sm:py-16`}>
      {/* Radial glow behind the card */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute ${
          selectedRole === 'buyer' ? 'bg-green-100/60' :
          selectedRole === 'seller' ? 'bg-green-50/60' :
          'bg-rose-50/60'
        } w-[40rem] h-[40rem] rounded-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 filter blur-3xl opacity-70`} />
      </div>
      
      {/* Background feature cards (larger screens only) */}
      <div className="hidden sm:block absolute inset-0 overflow-hidden">
        {animateCards && roleCards[selectedRole].map((card, index) => (
          <div 
            key={`${selectedRole}-${index}-bg`}
            className={`
              absolute animate-in fade-in duration-500 delay-200
              bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-gray-100
              ${index % 4 === 0 ? 'top-[20%] left-[15%] max-w-[18rem]' : ''}
              ${index % 4 === 1 ? 'bottom-[20%] right-[15%] max-w-[18rem]' : ''}
              ${index % 4 === 2 ? 'top-[50%] left-[10%] max-w-[16rem]' : ''}
              ${index % 4 === 3 ? 'top-[25%] right-[10%] max-w-[16rem]' : ''}
            `}
          >
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
                <p className="text-gray-600 text-sm">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="container px-4 z-10">
        <div className="max-w-2xl mx-auto">
          {/* Main auth card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl p-8 sm:p-10 mx-auto space-y-4 relative overflow-hidden">
            {/* Role tag badge */}
            <div className="absolute -rotate-45 -left-20 top-8">
              <div className={`py-1 px-8 text-xs font-bold text-white shadow-md ${
                selectedRole === 'rep' ? 'bg-[#803344]' : 'bg-[#09261E]'
              }`}>
                {roleTags[selectedRole]}
              </div>
            </div>
            
            <div className="text-center mb-6 mt-2">
              <h1 className="text-2xl font-heading font-bold text-[#09261E]">Create Your Account</h1>
              <p className="text-gray-500 text-sm mt-1">Join PropertyDeals to find exclusive real estate opportunities</p>
            </div>
            
            {/* Role selection pills */}
            <div className="flex justify-center items-center gap-2 mb-6">
              <Button
                variant="ghost"
                className={`rounded-full px-4 py-1 text-sm ${
                  selectedRole === 'buyer'
                    ? 'bg-[#09261E] text-white'
                    : 'bg-white/60 text-[#09261E] border border-gray-300'
                }`}
                onClick={() => handleRoleChange('buyer')}
              >
                Buyer
              </Button>
              <Button
                variant="ghost"
                className={`rounded-full px-4 py-1 text-sm ${
                  selectedRole === 'seller'
                    ? 'bg-[#09261E] text-white'
                    : 'bg-white/60 text-[#09261E] border border-gray-300'
                }`}
                onClick={() => handleRoleChange('seller')}
              >
                Seller
              </Button>
              <Button
                variant="ghost"
                className={`rounded-full px-4 py-1 text-sm ${
                  selectedRole === 'rep'
                    ? 'bg-[#09261E] text-white'
                    : 'bg-white/60 text-[#09261E] border border-gray-300'
                }`}
                onClick={() => handleRoleChange('rep')}
              >
                REP
              </Button>
            </div>
            
            {/* Social registration buttons */}
            <div className="space-y-3 mb-6">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50" 
                onClick={() => handleSocialRegistration('Google')}
              >
                <SiGoogle className="h-4 w-4" />
                <span>Continue with Google</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50" 
                onClick={() => handleSocialRegistration('Apple')}
              >
                <SiApple className="h-4 w-4" />
                <span>Continue with Apple</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50" 
                onClick={() => handleSocialRegistration('Facebook')}
              >
                <SiFacebook className="h-4 w-4 text-[#1877F2]" />
                <span>Continue with Facebook</span>
              </Button>
            </div>
            
            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white/80 px-2 text-gray-500">OR REGISTER WITH EMAIL</span>
              </div>
            </div>
            
            {/* Registration form */}
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
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
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
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
                  
                  {/* Role-specific fields */}
                  {selectedRole === "buyer" && (
                    <FormField
                      control={registerForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Your city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {selectedRole === "seller" && (
                    <FormField
                      control={registerForm.control}
                      name="propertyLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Location</FormLabel>
                          <FormControl>
                            <Input placeholder="City, State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {selectedRole === "rep" && (
                    <FormField
                      control={registerForm.control}
                      name="repType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>REP Type</FormLabel>
                          <FormControl>
                            <Input placeholder="Agent, Contractor, Lender, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
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
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Additional role-specific fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedRole === "buyer" && (
                    <FormField
                      control={registerForm.control}
                      name="investmentGoals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Investment Goals (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="What are you looking for?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {selectedRole === "seller" && (
                    <FormField
                      control={registerForm.control}
                      name="preferredSaleMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Sale Method (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Cash, Owner Financing, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {selectedRole === "rep" && (
                    <>
                      <FormField
                        control={registerForm.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Your brokerage or business" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="yearsExperience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Years Experience (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
                
                {/* Biometric login option */}
                <FormField
                  control={registerForm.control}
                  name="enableBiometric"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Enable biometric login for this device (if supported)</FormLabel>
                        <p className="text-sm text-gray-500">Use Face ID, Touch ID, or Windows Hello for faster login</p>
                      </div>
                    </FormItem>
                  )}
                />
                
                {/* Terms and conditions */}
                <FormField
                  control={registerForm.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I agree to the Terms of Service and Privacy Policy</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#09261E] hover:bg-[#135341] text-white flex items-center justify-center gap-2"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
            
            {/* Sign in link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Already have an account? {" "}
                <Link to="/signin" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}