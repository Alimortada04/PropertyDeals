import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Loader2, Eye, EyeOff, ArrowRight, Fingerprint } from "lucide-react";
import { SiGoogle, SiFacebook } from "react-icons/si";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast"; 

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(true),
});

export default function SignInPage() {
  const { user, loginMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [supportsBiometric, setSupportsBiometric] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate({
      email: values.email,
      password: values.password,
    }, {
      onSuccess: () => {
        toast({
          title: "Login successful",
          description: "Welcome back! Redirecting...",
        });
        
        // Show a smooth transition animation before redirecting
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-500';
        overlay.innerHTML = `
          <div class="text-center">
            <div class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#09261E] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
            <p class="text-[#09261E] font-medium text-lg">Taking you to your dashboard...</p>
          </div>
        `;
        document.body.appendChild(overlay);
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    });
  }

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  async function handleGoogleLogin() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=/`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("❌ Google login failed:", error.message || "Unknown error");
      toast({
        title: "Login failed",
        description: error.message || "Google login failed. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function handleFacebookLogin() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=/`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("❌ Facebook login failed:", error.message || "Unknown error");
      toast({
        title: "Login failed",
        description: error.message || "Facebook login failed. Please try again.",
        variant: "destructive",
      });
    }
  }


  function handleBiometricLogin() {
    alert("Biometric login triggered (Face ID / Touch ID)");
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const x = (clientX / width) - 0.5;
      const y = (clientY / height) - 0.5;
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const checkBiometricSupport = async () => {
      if (window.PublicKeyCredential && typeof window.PublicKeyCredential === "function") {
        if (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) {
          setSupportsBiometric(true);
        }
      }
    };
    checkBiometricSupport();
  }, []);

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden">
      {/* Background Blobs - Animated with staggered animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary green large blob - top right */}
        <div
          className="absolute w-[700px] h-[700px] bg-[#09261E]/10 rounded-full blur-3xl -top-[10%] -right-[10%] animate-blob-pulse-slow will-change-transform"
          style={{ 
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px) scale(${1 + Math.sin(Date.now() * 0.0005) * 0.05})`,
            opacity: 0.7 + Math.sin(Date.now() * 0.0003) * 0.1
          }}
        />
        
        {/* Secondary green medium blob - mid-right */}
        <div
          className="absolute w-[500px] h-[500px] bg-[#135341]/15 rounded-full blur-3xl top-[30%] -right-[5%] animate-blob-pulse-fast will-change-transform"
          style={{ 
            transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * 25}px) scale(${1 + Math.sin(Date.now() * 0.0007) * 0.08})`,
            opacity: 0.6 + Math.sin(Date.now() * 0.0004) * 0.15
          }}
        />
        
        {/* Wine accent blob - bottom left */}
        <div
          className="absolute w-[600px] h-[600px] bg-[#803344]/10 rounded-full blur-3xl -bottom-[15%] -left-[10%] animate-blob-float will-change-transform"
          style={{ 
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * -20}px) scale(${1 + Math.cos(Date.now() * 0.0004) * 0.07})`,
            opacity: 0.5 + Math.cos(Date.now() * 0.0005) * 0.15
          }}
        />
        
        {/* Small light green blob - top left */}
        <div
          className="absolute w-[300px] h-[300px] bg-[#F2F8F5]/80 rounded-full blur-xl top-[15%] left-[20%] animate-blob-float-slow will-change-transform"
          style={{ 
            transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * 15}px) scale(${1 + Math.sin(Date.now() * 0.0006) * 0.06})`,
            opacity: 0.7 + Math.sin(Date.now() * 0.0006) * 0.1
          }}
        />
        
        {/* Very subtle accent blob - bottom right */}
        <div
          className="absolute w-[400px] h-[400px] bg-[#09261E]/5 rounded-full blur-2xl bottom-[10%] right-[20%] animate-blob-pulse-slow will-change-transform"
          style={{ 
            transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -15}px) scale(${1 + Math.sin(Date.now() * 0.0003) * 0.06})`,
            opacity: 0.6 + Math.cos(Date.now() * 0.0004) * 0.1
          }}
        />
      </div>
      
      {/* Dynamic background styles */}
      <style>{`
        @keyframes blob-pulse-slow {
          0%, 100% { transform: scale(1) translate(0px, 0px); opacity: 0.7; }
          50% { transform: scale(1.05) translate(10px, -10px); opacity: 0.9; }
        }
        
        @keyframes blob-pulse-fast {
          0%, 100% { transform: scale(1) translate(0px, 0px); opacity: 0.6; }
          50% { transform: scale(1.08) translate(-5px, 15px); opacity: 0.8; }
        }
        
        @keyframes blob-float {
          0% { transform: translate(0px, 0px) scale(1); opacity: 0.5; }
          33% { transform: translate(10px, -20px) scale(1.03); opacity: 0.7; }
          66% { transform: translate(-15px, 10px) scale(0.98); opacity: 0.6; }
          100% { transform: translate(0px, 0px) scale(1); opacity: 0.5; }
        }
        
        @keyframes blob-float-slow {
          0% { transform: translate(0px, 0px) scale(1); opacity: 0.6; }
          25% { transform: translate(-10px, 15px) scale(1.05); opacity: 0.8; }
          50% { transform: translate(15px, 5px) scale(1.02); opacity: 0.7; }
          75% { transform: translate(5px, -10px) scale(0.98); opacity: 0.7; }
          100% { transform: translate(0px, 0px) scale(1); opacity: 0.6; }
        }
        
        .animate-blob-pulse-slow {
          animation: blob-pulse-slow 15s ease-in-out infinite;
        }
        
        .animate-blob-pulse-fast {
          animation: blob-pulse-fast 12s ease-in-out infinite;
        }
        
        .animate-blob-float {
          animation: blob-float 20s ease-in-out infinite;
        }
        
        .animate-blob-float-slow {
          animation: blob-float-slow 25s ease-in-out infinite;
        }
      `}</style>

      {/* Main Card */}
      <div className="relative bg-white/90 backdrop-blur-lg shadow-2xl rounded-xl p-8 w-full max-w-md z-10 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#09261E]">Welcome Back</h2>
          <p className="text-gray-600 text-sm mt-2">Please sign in to continue</p>
        </div>

        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="name@example.com" className="h-11" />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="h-11 pr-10"
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={loginForm.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-xs text-gray-500">Stay signed in</FormLabel>
                  </FormItem>
                )}
              />
              <Link href="/forgot-password" className="text-xs text-[#135341] hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#09261E] hover:bg-[#0c3a2d] text-white h-11 flex items-center justify-center gap-2"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-gray-400">Or sign in with</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="icon" onClick={handleGoogleLogin} className="w-12 h-12">
            <SiGoogle className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleFacebookLogin} className="w-12 h-12">
            <SiFacebook className="h-5 w-5 text-[#1877F2]" />
          </Button>
          {supportsBiometric && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleBiometricLogin} className="w-12 h-12">
                    <Fingerprint className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sign in with Face ID / Touch ID</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="text-center mt-6 text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-[#135341] font-semibold hover:underline">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
