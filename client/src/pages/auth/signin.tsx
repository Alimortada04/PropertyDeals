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
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("❌ Google login failed:", error.message || "Unknown error");
      alert("Google login failed. Check console for details.");
    }
  }

  async function handleFacebookLogin() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("❌ Facebook login failed:", error.message || "Unknown error");
      alert("Facebook login failed. Check console for details.");
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
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] bg-[#09261E]/15 rounded-full blur-3xl top-[-150px] right-[-150px]"
          style={{ transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)` }}
        />
        <div
          className="absolute w-[500px] h-[500px] bg-[#803344]/15 rounded-full blur-3xl bottom-[-150px] left-[-150px]"
          style={{ transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)` }}
        />
      </div>

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
