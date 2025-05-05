import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Redirect, Link, useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SiGoogle, SiFacebook } from "react-icons/si";

const baseRegisterSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  fullName: z.string().min(2, "Full name is required"),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms"
  }),
});

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const registerForm = useForm({
    resolver: zodResolver(baseRegisterSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      fullName: "",
      agreeToTerms: false,
    },
    mode: "onChange"
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  if (user) return <Redirect to="/dashboard" />;

  const onRegisterSubmit = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      registerForm.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.fullName,
          username: values.username,
        },
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const userId = data.user?.id;
    if (userId) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        full_name: values.fullName,
        username: values.username,
        role: "buyer",
      });

      if (profileError) {
        if (profileError.code === "23505") {
          alert("Username already taken. Please choose another.");
        } else {
          alert("Profile creation failed");
          console.error(profileError);
        }
        setLoading(false);
        return;
      }
    }

    navigate("/onboarding");
  };

  const handleSocialRegistration = async (provider: "google" | "facebook") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error(`❌ ${provider} registration failed:`, error.message || "Unknown error");
      alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} registration failed. Check console for details.`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">Create Your Account</h1>

        <div className="space-y-3 mb-6">
          <Button onClick={() => handleSocialRegistration("google")} variant="outline" className="w-full">
            <SiGoogle className="mr-2" /> Continue with Google
          </Button>
          <Button onClick={() => handleSocialRegistration("facebook")} variant="outline" className="w-full">
            <SiFacebook className="mr-2 text-blue-600" /> Continue with Facebook
          </Button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-gray-500">OR</span>
          </div>
        </div>

        <Form {...registerForm}>
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
            <FormField name="fullName" control={registerForm.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input {...field} onChange={field.onChange} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="email" control={registerForm.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="username" control={registerForm.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="password" control={registerForm.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl><Input type="password" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="confirmPassword" control={registerForm.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl><Input type="password" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="agreeToTerms" control={registerForm.control} render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel>I agree to the Terms and Privacy Policy</FormLabel>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="animate-spin mr-2" /> Creating...</> : <>Create Account <ArrowRight className="ml-2" /></>}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-center mt-4">
          Already have an account? <Link to="/signin" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
