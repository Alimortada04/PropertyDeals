import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "wouter";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Check, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Forgot password form schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Tie-dye background wash effect with brand colors - higher saturation
const BackgroundOrbs = () => (
  <>
    {/* Large forest green blob - bottom right */}
    <div className="absolute w-[800px] h-[800px] bg-[#0D3C2F]/35 rounded-full blur-[120px] -bottom-80 -right-40 animate-pulse" 
         style={{animationDuration: '15s'}}></div>
    
    {/* Large wine accent blob - bottom left */}
    <div className="absolute w-[700px] h-[700px] bg-[#803344]/35 rounded-full blur-[120px] -bottom-60 -left-60 animate-pulse" 
         style={{animationDelay: '2s', animationDuration: '17s'}}></div>
    
    {/* Medium forest green blob - top right */}
    <div className="absolute w-[600px] h-[600px] bg-[#0D3C2F]/30 rounded-full blur-[100px] -top-80 right-0 animate-pulse" 
         style={{animationDelay: '4s', animationDuration: '19s'}}></div>
         
    {/* Medium wine accent blob - top left */}
    <div className="absolute w-[500px] h-[500px] bg-[#963D52]/30 rounded-full blur-[100px] -top-60 -left-20 animate-pulse" 
         style={{animationDelay: '1s', animationDuration: '14s'}}></div>
    
    {/* Small forest green blob - middle left */}
    <div className="absolute w-[400px] h-[400px] bg-[#0D3C2F]/30 rounded-full blur-[80px] left-20 top-1/3 animate-pulse" 
         style={{animationDelay: '3s', animationDuration: '13s'}}></div>
         
    {/* Small wine accent blob - middle right */}
    <div className="absolute w-[350px] h-[350px] bg-[#963D52]/30 rounded-full blur-[80px] right-10 top-1/4 animate-pulse" 
         style={{animationDelay: '5s', animationDuration: '16s'}}></div>
  </>
);

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Forgot password form
  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  
  // Handle form submission
  function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsSubmitting(true);
    
    // This would be replaced with an actual API call in production
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast({
        title: "Reset link sent",
        description: `We've sent a password reset link to ${values.email}`,
      });
    }, 1500);
  }
  
  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gradient-to-br from-white to-[#d0e8dd] overflow-hidden">
      {/* Animated Background Elements */}
      <BackgroundOrbs />
      
      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/30">
          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <div className="mx-auto w-12 h-12 bg-[#09261E]/10 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-[#09261E]" />
                </div>
                <h2 className="text-2xl font-bold text-[#09261E] mb-2">Reset your password</h2>
                <p className="text-gray-500">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </div>
              
              <Form {...forgotPasswordForm}>
                <form onSubmit={forgotPasswordForm.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={forgotPasswordForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="Email address" 
                            type="email"
                            className="h-12 rounded-md border-gray-200 bg-white/70 focus:border-[#09261E] focus:ring-[#09261E] transition-all"
                            {...field} 
                          />
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
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-8 text-center">
                <Link href="/signin" className="text-[#09261E] font-semibold hover:text-[#135341] transition-colors inline-flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to sign in
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-[#09261E] mb-4">Check your email</h2>
              <p className="text-gray-600 mb-4">
                We've sent a password reset link to your email address.
              </p>
              <p className="text-gray-500 text-sm mb-6">
                If you don't see it in your inbox, please check your spam folder.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 transition-all hover:scale-[1.02] active:scale-[0.98] border-gray-200 hover:bg-gray-50"
                  onClick={() => setSubmitted(false)}
                >
                  Try another email
                </Button>
                
                <Button 
                  asChild
                  className="flex-1 h-12 bg-[#09261E] hover:bg-[#0c3a2d] text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Link href="/signin">
                    Return to sign in
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}