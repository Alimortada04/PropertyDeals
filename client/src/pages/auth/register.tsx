import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link, useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowRight, UserPlus, Building, Users } from "lucide-react";
import { SiGoogle, SiApple } from "react-icons/si";

// User types
type UserRole = "buyer" | "seller" | "rep";

interface RoleCardProps {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

// Role selection card component
function RoleCard({ role, title, description, icon, isSelected, onClick }: RoleCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected
          ? "border-[#09261E] bg-[#09261E]/5 shadow-sm"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-full ${
            isSelected ? "bg-[#09261E] text-white" : "bg-gray-100 text-gray-500"
          }`}
        >
          {icon}
        </div>
        <div>
          <h3 className={`font-medium ${isSelected ? "text-[#09261E]" : "text-gray-900"}`}>
            {title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

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
  const [selectedRole, setSelectedRole] = useState<UserRole>("buyer");
  
  // Get the appropriate schema based on the selected role
  const getSchemaForRole = () => {
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
  };

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
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-[#09261E]">Create Your Account</h1>
            <p className="text-gray-500 mt-2">Join PropertyDeals to find exclusive real estate opportunities</p>
          </div>

          {/* Role selection cards */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Select your role</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <RoleCard
                role="buyer"
                title="Buyer"
                description="Buy properties from trusted local sellers"
                icon={<UserPlus className="h-5 w-5" />}
                isSelected={selectedRole === "buyer"}
                onClick={() => handleRoleChange("buyer")}
              />
              <RoleCard
                role="seller"
                title="Seller"
                description="Sell your property to verified investors"
                icon={<Building className="h-5 w-5" />}
                isSelected={selectedRole === "seller"}
                onClick={() => handleRoleChange("seller")}
              />
              <RoleCard
                role="rep"
                title="REP"
                description="List, market, and close deals faster"
                icon={<Users className="h-5 w-5" />}
                isSelected={selectedRole === "rep"}
                onClick={() => handleRoleChange("rep")}
              />
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
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
              </div>
              
              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500">OR REGISTER WITH EMAIL</span>
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
                              <Input placeholder="Cash, Finance, Lease Option, etc." {...field} />
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
                                <Input placeholder="Your company name" {...field} />
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
                                <Input placeholder="How long in the business?" {...field} />
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
                  <Link href="/signin" className="text-primary font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}