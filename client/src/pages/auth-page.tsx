import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation, Link } from "wouter";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowRight, KeyRound, UserPlus, Mail, Eye, EyeOff } from "lucide-react";
import { SiGoogle, SiFacebook } from "react-icons/si";
import { Separator } from "@/components/ui/separator";

// Login form schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

// Registration form schema
const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Tie-dye background wash effect with brand colors - higher saturation
const BackgroundOrbs = () => {
  // Mouse parallax effect - add motion on mousemove
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position as percentage of viewport
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <>
      {/* Large forest green blob - bottom right - HIGHLY SATURATED */}
      <div 
        className="absolute w-[800px] h-[800px] bg-[#00D499]/70 rounded-full -bottom-80 -right-40 animate-breathe mix-blend-screen transition-all duration-500 ease-out opacity-90" 
        style={{
          animationDuration: '25s',
          transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`,
          '--blur-amount': '150px'
        } as React.CSSProperties}
      />
      
      {/* Large wine accent blob - bottom left - HIGHLY SATURATED */}
      <div 
        className="absolute w-[700px] h-[700px] bg-[#D14B81]/65 rounded-full -bottom-60 -left-60 animate-breathe mix-blend-screen transition-all duration-500 ease-out opacity-85" 
        style={{
          animationDelay: '3s', 
          animationDuration: '28s',
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * -20}px)`,
          '--blur-amount': '150px'
        } as React.CSSProperties}
      />
      
      {/* Medium forest green blob - top right - HIGHLY SATURATED */}
      <div 
        className="absolute w-[600px] h-[600px] bg-[#00E19F]/60 rounded-full -top-80 right-0 animate-breathe mix-blend-screen transition-all duration-500 ease-out opacity-80" 
        style={{
          animationDelay: '6s', 
          animationDuration: '32s',
          transform: `translate(${mousePosition.x * -25}px, ${mousePosition.y * 25}px)`,
          '--blur-amount': '130px'
        } as React.CSSProperties}
      />
         
      {/* Medium wine accent blob - top left - HIGHLY SATURATED */}
      <div 
        className="absolute w-[500px] h-[500px] bg-[#E56A96]/55 rounded-full -top-60 -left-20 animate-breathe mix-blend-screen transition-all duration-500 ease-out opacity-85" 
        style={{
          animationDelay: '2s', 
          animationDuration: '24s',
          transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`,
          '--blur-amount': '130px'
        } as React.CSSProperties}
      />
      
      {/* Small forest green blob - middle left - HIGHLY SATURATED */}
      <div 
        className="absolute w-[450px] h-[450px] bg-[#00F8B1]/65 rounded-full left-10 top-1/3 animate-breathe mix-blend-screen transition-all duration-500 ease-out opacity-90" 
        style={{
          animationDelay: '5s', 
          animationDuration: '22s',
          transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * -10}px)`,
          '--blur-amount': '120px'
        } as React.CSSProperties}
      />
         
      {/* Small wine accent blob - middle right - HIGHLY SATURATED */}
      <div 
        className="absolute w-[400px] h-[400px] bg-[#F56E9B]/60 rounded-full right-10 top-1/4 animate-breathe mix-blend-screen transition-all duration-500 ease-out opacity-85" 
        style={{
          animationDelay: '8s', 
          animationDuration: '27s',
          transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -25}px)`,
          '--blur-amount': '120px'
        } as React.CSSProperties}
      />
      
      {/* Additional magical accent blob - middle center */}
      <div 
        className="absolute w-[350px] h-[350px] bg-[#C4B0FF]/60 rounded-full left-1/3 top-2/5 animate-breathe mix-blend-screen transition-all duration-500 ease-out opacity-80" 
        style={{
          animationDelay: '10s', 
          animationDuration: '29s',
          transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`,
          '--blur-amount': '110px'
        } as React.CSSProperties}
      />
      
      {/* Extra light blob for subtle highlights */}
      <div 
        className="absolute w-[300px] h-[300px] bg-white/75 rounded-full right-1/4 bottom-1/3 animate-pulse mix-blend-overlay transition-all duration-500 ease-out" 
        style={{
          animationDuration: '15s',
          transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
          filter: 'blur(80px)'
        }}
      />
    </>
  );
};

export default function AuthPage() {
  const [location] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Custom input style with enhanced hover effects
  const inputStyles = "h-12 rounded-md border-gray-200 bg-white/70 hover:border-gray-300 focus:border-[#09261E] focus:ring-[#09261E] shadow-sm hover:shadow transition-all";
  
  // Custom social button styles
  const socialButtonStyles = "w-1/2 h-12 border-gray-200 hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow";
  
  const { 
    user, 
    supabaseUser, 
    loginMutation, 
    registerMutation, 
    loginWithGoogleMutation,
    loginWithFacebookMutation 
  } = useAuth();

  // Toggle between login and register based on URL
  useEffect(() => {
    // Check if path is /register or contains register in it
    const isRegisterPage = location === "/register" || location.includes("register");
    setIsLogin(!isRegisterPage);
  }, [location]);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
  });

  // Handle login submission
  function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate({
      email: values.email,
      password: values.password,
    });
  }

  // Handle registration submission
  function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    registerMutation.mutate({
      email: values.email,
      password: values.password,
      fullName: values.fullName,
    });
  }
  
  // Handle social login/signup
  function handleGoogleAuth() {
    loginWithGoogleMutation.mutate();
  }
  
  function handleFacebookAuth() {
    loginWithFacebookMutation.mutate();
  }

  // If user is already logged in, redirect to dashboard
  if (user || supabaseUser) {
    return <Redirect to="/dashboard" />;
  }

  // Empty component - feature cards removed per user request
  const FeatureCards = () => null;

  return (
    <div className="relative min-h-screen flex justify-center items-center overflow-hidden">
      {/* Animated Background Elements with enhanced styling */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#e9f2ee] to-[#fce9ed] animate-gradient-slow">
        <BackgroundOrbs />
      </div>
      
      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-md px-4 my-8">
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-md border border-white/40 transition-all hover:shadow-lg animate-fade-in-up">
          {isLogin ? (
            <>
              <h1 className="text-2xl font-bold text-center text-[#09261E] mb-2">Welcome back</h1>
              <p className="text-center text-gray-500 mb-8">Please sign in to continue</p>

              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-3">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="Email" 
                            type="email"
                            className={inputStyles}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-[#803344]" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              className="h-12 rounded-md border-gray-200 bg-white/70 focus:border-[#09261E] focus:ring-[#09261E] transition-all pr-10"
                              {...field} 
                            />
                            <button 
                              type="button" 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                              onClick={() => setShowPassword(!showPassword)}
                              tabIndex={-1}
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[#803344]" />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-between items-center">
                    <FormField
                      control={loginForm.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-[#09261E] data-[state=checked]:border-[#09261E]"
                            />
                          </FormControl>
                          <div className="text-sm font-medium leading-none text-gray-600">
                            Stay signed in
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Link href="/forgot-password" className="text-sm text-[#09261E] hover:text-[#135341] transition-colors">
                      Forgot password?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-[#09261E] hover:bg-[#0c3a2d] text-white flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow focus:ring-2 focus:ring-[#09261E]/30"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="my-8 relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-1/2 h-12 border-gray-200 hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  onClick={handleGoogleAuth}
                  disabled={loginWithGoogleMutation.isPending}
                >
                  <SiGoogle className="mr-2 h-4 w-4" />
                  <span>Google</span>
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-1/2 h-12 border-gray-200 hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                  onClick={handleFacebookAuth}
                  disabled={loginWithFacebookMutation.isPending}
                >
                  <SiFacebook className="mr-2 h-4 w-4 text-[#1877F2]" />
                  <span>Facebook</span>
                </Button>
              </div>

              <div className="mt-8 text-center text-sm">
                Don't have an account?{' '}
                <Link href="/register" className="text-[#09261E] font-semibold hover:text-[#135341] transition-colors">
                  Create one
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-center text-[#09261E] mb-2">Welcome to PropertyDeals</h1>
              <p className="text-center text-gray-500 mb-8">Create your account</p>

              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-3">
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Email"
                            className={inputStyles}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-[#803344]" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="Full Name"
                            className={inputStyles}
                            onChange={field.onChange}
                            value={field.value || ""}
                            name={field.name}
                            onBlur={field.onBlur}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage className="text-[#803344]" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              className="h-12 rounded-md border-gray-200 bg-white/70 focus:border-[#09261E] focus:ring-[#09261E] transition-all pr-10"
                              {...field} 
                            />
                            <button 
                              type="button" 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                              onClick={() => setShowPassword(!showPassword)}
                              tabIndex={-1}
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
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm Password"
                              className="h-12 rounded-md border-gray-200 bg-white/70 focus:border-[#09261E] focus:ring-[#09261E] transition-all pr-10"
                              {...field} 
                            />
                            <button 
                              type="button" 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              tabIndex={-1}
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
                    className="w-full h-12 bg-[#09261E] hover:bg-[#0c3a2d] text-white flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow focus:ring-2 focus:ring-[#09261E]/30"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign Up</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="my-8 relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-400">Or sign up with</span>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-1/2 h-12 border-gray-200 hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  onClick={handleGoogleAuth}
                  disabled={loginWithGoogleMutation.isPending}
                >
                  <SiGoogle className="mr-2 h-4 w-4" />
                  <span>Google</span>
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-1/2 h-12 border-gray-200 hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                  onClick={handleFacebookAuth}
                  disabled={loginWithFacebookMutation.isPending}
                >
                  <SiFacebook className="mr-2 h-4 w-4 text-[#1877F2]" />
                  <span>Facebook</span>
                </Button>
              </div>

              <div className="mt-8 text-center text-sm">
                Already have an account?{' '}
                <Link href="/signin" className="text-[#09261E] font-semibold hover:text-[#135341] transition-colors">
                  Sign In
                </Link>
              </div>
            </>
          )}
        </div>
        
        {/* Feature Cards - only visible on desktop */}
        <FeatureCards />
      </div>
    </div>
  );
}
