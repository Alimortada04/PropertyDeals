import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Redirect, Link } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

// Reset password form schema with password confirmation
const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [redirectToSignIn, setRedirectToSignIn] = useState(false);

  // Reset password form
  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: values.password 
      });
      
      if (error) {
        throw error;
      }
      
      setIsSubmitting(false);
      setIsComplete(true);
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully reset.",
      });
      
      // Redirect to sign in page after 3 seconds
      setTimeout(() => {
        setRedirectToSignIn(true);
      }, 3000);
      
    } catch (error: any) {
      setIsSubmitting(false);
      
      toast({
        title: "Error resetting password",
        description: error.message || "An error occurred while resetting your password. Please try again.",
        variant: "destructive",
      });
    }
  }

  // Function to toggle password visibility
  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  // Function to toggle confirm password visibility
  function toggleConfirmPasswordVisibility() {
    setShowConfirmPassword(!showConfirmPassword);
  }

  // If the reset is complete and ready to redirect
  if (redirectToSignIn) {
    return <Redirect to="/signin" />;
  }

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gradient-to-br from-white to-[#d0e8dd]">
      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/30">
          {!isComplete ? (
            <>
              <div className="text-center mb-8">
                <div className="mx-auto w-12 h-12 bg-[#09261E]/10 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-[#09261E]" />
                </div>
                <h2 className="text-2xl font-bold text-[#09261E] mb-2">Create new password</h2>
                <p className="text-gray-500">
                  Your new password must be different from previously used passwords
                </p>
              </div>
              
              <Form {...resetPasswordForm}>
                <form onSubmit={resetPasswordForm.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={resetPasswordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="Enter your new password" 
                              type={showPassword ? "text" : "password"}
                              className="h-12 pr-10 rounded-md border-gray-200 bg-white/70 focus:border-[#09261E] focus:ring-[#09261E] transition-all"
                              {...field} 
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[#803344]" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={resetPasswordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="Confirm your new password" 
                              type={showConfirmPassword ? "text" : "password"}
                              className="h-12 pr-10 rounded-md border-gray-200 bg-white/70 focus:border-[#09261E] focus:ring-[#09261E] transition-all"
                              {...field} 
                            />
                            <button
                              type="button"
                              onClick={toggleConfirmPasswordVisibility}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[#803344]" />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-[#09261E] hover:bg-[#0c3a2d] text-white flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-[#09261E] mb-4">Password Reset Complete</h2>
              <p className="text-gray-600 mb-6">
                Your password has been successfully reset. You will be redirected to sign in shortly.
              </p>
              
              <Button 
                asChild
                className="w-full h-12 bg-[#09261E] hover:bg-[#0c3a2d] text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link href="/signin">
                  Sign In
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}