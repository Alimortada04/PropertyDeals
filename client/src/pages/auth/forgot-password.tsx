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
import { supabase } from "@/lib/supabase";

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
  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsSubmitting(true);
    
    try {
      // Always use the auth/reset-password route for consistency
      const resetUrl = `${window.location.origin}/auth/reset-password`;
      
      console.log("Sending password reset email with redirect URL:", resetUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: resetUrl,
      });
      
      if (error) {
        throw error;
      }
      
      setIsSubmitting(false);
      setSubmitted(true);
      toast({
        title: "Reset link sent",
        description: `We've sent a password reset link to ${values.email}`,
      });
    } catch (error: any) {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: error.message || "Failed to send reset link. Please try again.",
        variant: "destructive",
      });
    }
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
              
              {/* Email Provider Buttons */}
              <div className="mb-6">
                <p className="text-sm text-center text-gray-600 mb-3">Need help checking your inbox?</p>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  <a 
                    href="https://mail.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm"
                  >
                    <svg className="h-4 w-4 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="font-medium">Gmail</span>
                  </a>
                  <a 
                    href="https://outlook.live.com/mail/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Mail className="h-4 w-4 text-[#0078D4]" />
                    <span className="font-medium">Outlook</span>
                  </a>
                  <a 
                    href="https://mail.yahoo.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Mail className="h-4 w-4 text-[#6001D2]" />
                    <span className="font-medium">Yahoo</span>
                  </a>
                  <a 
                    href="https://www.icloud.com/mail" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                    </svg>
                    <span className="font-medium">iCloud</span>
                  </a>
                </div>
              </div>
              
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