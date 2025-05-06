import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { Link, useLocation } from "wouter";
import {
  UserCircle,
  Link as LinkIcon,
  Shield,
  CreditCard,
  BarChart,
  ClipboardList,
  AlertTriangle,
  Settings,
  LogOut,
  User,
  Building,
  Users,
  ExternalLink,
  UserCheck,
  Upload,
  Briefcase,
  Calendar,
  Globe,
  Home,
  GraduationCap,
  Hammer,
  DollarSign,
  Clock,
  BedDouble,
  Check,
  AlertCircle,
  FileText,
  Instagram,
  Facebook,
  Linkedin,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";

// Menu item interface
interface ProfileMenuItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  danger?: boolean;
}

// Profile menu item component
const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon,
  label,
  href,
  active,
  onClick,
  className,
  danger = false
}) => {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center px-3 py-2 text-sm transition-colors cursor-pointer my-0.5 rounded-md",
          active
            ? "bg-gray-100 text-[#09261E] font-medium"
            : "text-gray-700 hover:bg-gray-50",
          danger && "text-red-500 hover:text-red-700",
          className
        )}
        onClick={onClick}
      >
        <div className="mr-2.5 text-gray-500">{icon}</div>
        <span>{label}</span>
      </div>
    </Link>
  );
};

// Type definitions for profile data
interface ProfileData {
  id: string;
  full_name: string;
  bio: string;
  username: string;
  email: string;
  phone: string;
  in_real_estate_since: string | null;
  business_name: string | null;
  type_of_buyer: string[] | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  profile_photo_url: string | null;
  created_at: string;
  join_number: number | null;
  profile_completion_score: number | null;
  location: string | null;
  markets: string[] | null;
  property_types: string[] | null;
  property_conditions: string[] | null;
  ideal_budget_min: number | null;
  ideal_budget_max: number | null;
  financing_methods: string[] | null;
  preferred_financing_method: string | null;
  closing_timeline: string | null;
  number_of_deals_last_12_months: number | null;
  goal_deals_next_12_months: number | null;
  total_deals_done: number | null;
  current_portfolio_count: number | null;
  buyer_verification_tag: string | null;
  proof_of_funds_url: string | null;
  proof_of_funds_verified: boolean;
  preferred_inspectors: string[] | null;
  preferred_agents: string[] | null;
  preferred_contractors: string[] | null;
  preferred_lenders: string[] | null;
  showProfile: boolean;
}

// Options for select fields
const typeOfBuyerOptions = [
  "Fix & Flip", "Buy & Hold", "Wholesaler", "Developer", "Land", "Commercial"
];

const propertyTypesOptions = [
  "Single Family", "Multi-Family", "Condo", "Townhouse", "Commercial", "Land", "Mobile Home"
];

const propertyConditionsOptions = [
  "Ready to Move In", "Minor Repairs", "Major Renovation", "Full Rehab", "Teardown"
];

const financingMethodsOptions = [
  "Cash", "Conventional Loan", "Hard Money", "Private Money", "Owner Financing", "HELOC", "401k"
];

const closingTimelineOptions = [
  "Less than 7 days", "7-14 days", "15-30 days", "30-60 days", "Flexible"
];

// Main profile page component
export default function ProfilePage() {
  const { user, supabaseUser, logoutMutation } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [usernameMessage, setUsernameMessage] = useState("");
  
  // To set the active tab from URL hash if present
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['account', 'profile', 'property', 'professional'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  // Update the URL hash when tab changes
  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  // Refs for the file input and preview
  const fileInputRef = useRef<HTMLInputElement>(null);
  const proofFileInputRef = useRef<HTMLInputElement>(null);
  
  // Profile state with all required fields
  const [profileData, setProfileData] = useState<ProfileData>({
    id: "",
    full_name: user?.fullName || "",
    bio: "",
    username: user?.username || "",
    email: user?.email || "",
    phone: "",
    in_real_estate_since: null,
    business_name: null,
    type_of_buyer: [],
    website: null,
    instagram: null,
    facebook: null,
    linkedin: null,
    profile_photo_url: null,
    created_at: new Date().toISOString(),
    join_number: null,
    profile_completion_score: 0,
    location: null,
    markets: [],
    property_types: [],
    property_conditions: [],
    ideal_budget_min: null,
    ideal_budget_max: null,
    financing_methods: [],
    preferred_financing_method: null,
    closing_timeline: null,
    number_of_deals_last_12_months: null,
    goal_deals_next_12_months: null,
    total_deals_done: null,
    current_portfolio_count: null,
    buyer_verification_tag: null,
    proof_of_funds_url: null,
    proof_of_funds_verified: false,
    preferred_inspectors: [],
    preferred_agents: [],
    preferred_contractors: [],
    preferred_lenders: [],
    showProfile: true
  });

  // Track if each form section has been modified
  const [isAccountModified, setIsAccountModified] = useState(false);
  const [isProfileModified, setIsProfileModified] = useState(false);
  const [isPropertyModified, setIsPropertyModified] = useState(false);
  const [isProfessionalModified, setIsProfessionalModified] = useState(false);
  
  // Fetch profile data on component mount
  useEffect(() => {
    if (supabaseUser) {
      fetchProfileData();
    }
  }, [supabaseUser]);

  // Fetch profile data from Supabase
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Fill in the form with the profile data
        setProfileData({
          ...profileData,
          ...data,
          // Ensure arrays are initialized properly
          type_of_buyer: data.type_of_buyer || [],
          markets: data.markets || [],
          property_types: data.property_types || [],
          property_conditions: data.property_conditions || [],
          financing_methods: data.financing_methods || [],
          preferred_inspectors: data.preferred_inspectors || [],
          preferred_agents: data.preferred_agents || [],
          preferred_contractors: data.preferred_contractors || [],
          preferred_lenders: data.preferred_lenders || [],
          showProfile: true // Default visibility setting
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Check username availability with debounce
  const checkUsernameAvailability = async (username: string) => {
    if (!username) return;
    
    setIsCheckingUsername(true);
    setUsernameMessage("");
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', supabaseUser.id) // Exclude the current user
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setIsUsernameAvailable(false);
        setUsernameMessage("This username is already taken");
      } else {
        setIsUsernameAvailable(true);
        setUsernameMessage("Username is available");
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameMessage("Error checking username availability");
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // Debounce for username check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (profileData.username && profileData.username !== user?.username) {
        checkUsernameAvailability(profileData.username);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [profileData.username]);

  // Handle profile photo upload
  const handleProfilePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${supabaseUser.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    try {
      setLoading(true);
      
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage.from('public').getPublicUrl(filePath);
      
      // Update profile data with new avatar URL
      setProfileData({
        ...profileData,
        profile_photo_url: data.publicUrl
      });
      
      setIsProfileModified(true);
      
      toast({
        title: "Success",
        description: "Profile photo uploaded successfully"
      });
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      toast({
        title: "Error",
        description: "Failed to upload profile photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle proof of funds upload
  const handleProofOfFundsChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    if (file.type !== 'application/pdf') {
      toast({
        title: "Error",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
      return;
    }
    
    const fileName = `${supabaseUser.id}-proof-${Math.random().toString(36).substring(2)}.pdf`;
    const filePath = `proof_of_funds/${fileName}`;
    
    try {
      setLoading(true);
      
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage.from('public').getPublicUrl(filePath);
      
      // Update profile data with new proof URL
      setProfileData({
        ...profileData,
        proof_of_funds_url: data.publicUrl,
        // Set to false since it needs to be verified
        proof_of_funds_verified: false
      });
      
      setIsPropertyModified(true);
      
      toast({
        title: "Success",
        description: "Proof of funds uploaded successfully. It will be reviewed by our team."
      });
    } catch (error) {
      console.error("Error uploading proof of funds:", error);
      toast({
        title: "Error",
        description: "Failed to upload proof of funds. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setProfileData({
      ...profileData,
      [name]: value
    });
    
    // Set the appropriate modification flag based on the active tab
    if (activeTab === 'account') setIsAccountModified(true);
    if (activeTab === 'profile') setIsProfileModified(true);
    if (activeTab === 'property') setIsPropertyModified(true);
    if (activeTab === 'professional') setIsProfessionalModified(true);
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: any) => {
    setProfileData({
      ...profileData,
      [name]: value
    });
    
    // Set the appropriate modification flag based on the active tab
    if (activeTab === 'account') setIsAccountModified(true);
    if (activeTab === 'profile') setIsProfileModified(true);
    if (activeTab === 'property') setIsPropertyModified(true);
    if (activeTab === 'professional') setIsProfessionalModified(true);
  };

  // Handle multi-select changes (add or remove value)
  const handleMultiSelectChange = (name: string, value: string) => {
    const currentValues = profileData[name as keyof ProfileData] as string[] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    setProfileData({
      ...profileData,
      [name]: newValues
    });
    
    // Set the appropriate modification flag based on the active tab
    if (activeTab === 'account') setIsAccountModified(true);
    if (activeTab === 'profile') setIsProfileModified(true);
    if (activeTab === 'property') setIsPropertyModified(true);
    if (activeTab === 'professional') setIsProfessionalModified(true);
  };

  // Handle switch changes like profile visibility
  const handleSwitchChange = (checked: boolean) => {
    setProfileData({
      ...profileData,
      showProfile: checked
    });
    setIsAccountModified(true);
  };

  // Handle account form submission
  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isUsernameAvailable && profileData.username !== user?.username) {
      toast({
        title: "Error",
        description: "Please choose a different username",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          bio: profileData.bio,
          username: profileData.username,
          phone: profileData.phone
        })
        .eq('id', supabaseUser.id);
      
      if (error) throw error;
      
      setIsAccountModified(false);
      toast({
        title: "Success",
        description: "Account information updated successfully"
      });
    } catch (error) {
      console.error("Error updating account:", error);
      toast({
        title: "Error",
        description: "Failed to update account information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          in_real_estate_since: profileData.in_real_estate_since,
          business_name: profileData.business_name,
          type_of_buyer: profileData.type_of_buyer,
          website: profileData.website,
          instagram: profileData.instagram,
          facebook: profileData.facebook,
          linkedin: profileData.linkedin,
          profile_photo_url: profileData.profile_photo_url
        })
        .eq('id', supabaseUser.id);
      
      if (error) throw error;
      
      setIsProfileModified(false);
      toast({
        title: "Success",
        description: "Profile information updated successfully"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle property preferences form submission
  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          location: profileData.location,
          markets: profileData.markets,
          property_types: profileData.property_types,
          property_conditions: profileData.property_conditions,
          ideal_budget_min: profileData.ideal_budget_min,
          ideal_budget_max: profileData.ideal_budget_max,
          financing_methods: profileData.financing_methods,
          preferred_financing_method: profileData.preferred_financing_method,
          closing_timeline: profileData.closing_timeline,
          number_of_deals_last_12_months: profileData.number_of_deals_last_12_months,
          goal_deals_next_12_months: profileData.goal_deals_next_12_months,
          total_deals_done: profileData.total_deals_done,
          current_portfolio_count: profileData.current_portfolio_count,
          proof_of_funds_url: profileData.proof_of_funds_url
          // Note: we don't update proof_of_funds_verified as that requires admin approval
        })
        .eq('id', supabaseUser.id);
      
      if (error) throw error;
      
      setIsPropertyModified(false);
      toast({
        title: "Success",
        description: "Property preferences updated successfully"
      });
    } catch (error) {
      console.error("Error updating property preferences:", error);
      toast({
        title: "Error",
        description: "Failed to update property preferences",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle professional preferences form submission
  const handleProfessionalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          preferred_inspectors: profileData.preferred_inspectors,
          preferred_agents: profileData.preferred_agents,
          preferred_contractors: profileData.preferred_contractors,
          preferred_lenders: profileData.preferred_lenders
        })
        .eq('id', supabaseUser.id);
      
      if (error) throw error;
      
      setIsProfessionalModified(false);
      toast({
        title: "Success",
        description: "Professional preferences updated successfully"
      });
    } catch (error) {
      console.error("Error updating professional preferences:", error);
      toast({
        title: "Error",
        description: "Failed to update professional preferences",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex bg-white">
      {/* Left sidebar */}
      <div className="w-[230px] border-r h-screen sticky top-0 flex flex-col bg-white shadow-sm overflow-y-auto">
        {/* Profile info */}
        <div className="px-6 py-6 mb-4 border-b flex flex-col items-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={profileData.profile_photo_url || ""} alt={profileData.full_name || "User"} />
            <AvatarFallback className="bg-gray-200 text-gray-700 text-xl font-medium">
              {profileData.full_name?.charAt(0) || profileData.username?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <h2 className="font-bold text-lg">{profileData.full_name || profileData.username}</h2>
          <p className="text-gray-500 text-sm">@{profileData.username}</p>
        </div>
        
        {/* Menu */}
        <div className="px-3 flex-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab("account")}
            className={cn(
              "w-full flex items-center px-3 py-2 text-left rounded-md transition-colors my-0.5",
              activeTab === "account"
                ? "bg-gray-100 text-[#09261E] font-medium"
                : "text-gray-700 hover:bg-gray-50"
            )}
          >
            <UserCircle size={18} className="mr-2.5 text-gray-500" />
            <span>Account Settings</span>
          </button>
          
          <button
            onClick={() => setActiveTab("profile")}
            className={cn(
              "w-full flex items-center px-3 py-2 text-left rounded-md transition-colors my-0.5",
              activeTab === "profile"
                ? "bg-gray-100 text-[#09261E] font-medium"
                : "text-gray-700 hover:bg-gray-50"
            )}
          >
            <User size={18} className="mr-2.5 text-gray-500" />
            <span>Profile</span>
          </button>
          
          <button
            onClick={() => setActiveTab("property")}
            className={cn(
              "w-full flex items-center px-3 py-2 text-left rounded-md transition-colors my-0.5",
              activeTab === "property"
                ? "bg-gray-100 text-[#09261E] font-medium"
                : "text-gray-700 hover:bg-gray-50"
            )}
          >
            <Building size={18} className="mr-2.5 text-gray-500" />
            <span>Property Preferences</span>
          </button>
          
          <button
            onClick={() => setActiveTab("professional")}
            className={cn(
              "w-full flex items-center px-3 py-2 text-left rounded-md transition-colors my-0.5",
              activeTab === "professional"
                ? "bg-gray-100 text-[#09261E] font-medium"
                : "text-gray-700 hover:bg-gray-50"
            )}
          >
            <Users size={18} className="mr-2.5 text-gray-500" />
            <span>Professional Preferences</span>
          </button>
          
          <div className="mt-6 pt-6 border-t">
            <ProfileMenuItem
              icon={<LinkIcon size={18} />}
              label="Connected accounts"
              href="/profile/connected-accounts"
              active={location === "/profile/connected-accounts"}
            />
            <ProfileMenuItem
              icon={<Shield size={18} />}
              label="Security & Privacy"
              href="/profile/security"
              active={location === "/profile/security"}
            />
            <ProfileMenuItem
              icon={<CreditCard size={18} />}
              label="Payment methods"
              href="/profile/payment"
              active={location === "/profile/payment"}
            />
            <ProfileMenuItem
              icon={<BarChart size={18} />}
              label="Balance"
              href="/profile/balance"
              active={location === "/profile/balance"}
            />
            <ProfileMenuItem
              icon={<ClipboardList size={18} />}
              label="Billing history"
              href="/profile/billing"
              active={location === "/profile/billing"}
            />
            <ProfileMenuItem
              icon={<Settings size={18} />}
              label="Memberships"
              href="/profile/memberships"
              active={location === "/profile/memberships"}
            />
            <ProfileMenuItem
              icon={<Settings size={18} />}
              label="Resolution center"
              href="/profile/resolution"
              active={location === "/profile/resolution"}
            />
            <ProfileMenuItem
              icon={<AlertTriangle size={18} />}
              label="Danger zone"
              href="/profile/danger"
              active={location === "/profile/danger"}
            />
          </div>
        </div>
        
        {/* Logout */}
        <div className="mt-auto px-3 pb-5">
          <button
            className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-red-500 hover:bg-gray-50 hover:text-red-700 w-full"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-2.5 text-red-500/70" />
            <span>Log out</span>
          </button>
        </div>
      </div>
      
      {/* Right content area */}
      <div className="flex-1 bg-gray-50/60 p-6 md:p-10">
        {/* Account Settings Tab */}
        {activeTab === "account" && (
          <div className="max-w-3xl bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <div className="border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-[#09261E]">Account Settings</h2>
              <p className="text-gray-600 mt-1">Update your personal information and account details</p>
            </div>
            
            <form onSubmit={handleAccountSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="full_name">Full Name</label>
                  <Input 
                    id="full_name"
                    name="full_name"
                    value={profileData.full_name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="max-w-md border border-gray-300 focus-visible:ring-[#09261E]/30"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="bio">Bio</label>
                  <Textarea 
                    id="bio"
                    name="bio"
                    value={profileData.bio || ""}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself"
                    className="max-w-md resize-none min-h-[100px] border border-gray-300 focus-visible:ring-[#09261E]/30"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="username">Username</label>
                  <Input 
                    id="username"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    placeholder="Your username"
                    className={`max-w-md border border-gray-300 focus-visible:ring-[#09261E]/30 ${!isUsernameAvailable && profileData.username !== user?.username ? 'border-red-400' : ''}`}
                  />
                  {isCheckingUsername && (
                    <p className="text-sm text-gray-500 mt-1">Checking username availability...</p>
                  )}
                  {!isCheckingUsername && usernameMessage && (
                    <p className={`text-sm mt-1 ${isUsernameAvailable ? 'text-green-600' : 'text-red-500'}`}>
                      {usernameMessage}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="email">Email</label>
                  <Input 
                    id="email"
                    value={profileData.email || supabaseUser?.email || ""}
                    disabled
                    className="max-w-md bg-gray-50 border border-gray-300"
                  />
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed at this time</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="phone">Phone Number</label>
                  <div className="flex max-w-md items-center">
                    <div className="flex flex-1 items-center border border-gray-300 rounded-md overflow-hidden">
                      <div className="flex items-center px-3 py-2 bg-gray-50 border-r border-gray-300">
                        <span className="text-sm mr-1">🇺🇸</span>
                        <span className="text-xs text-gray-500">+1</span>
                      </div>
                      <Input 
                        id="phone"
                        name="phone"
                        value={profileData.phone || ""}
                        onChange={handleInputChange}
                        placeholder="Your phone number"
                        className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="ml-2 text-xs opacity-50 cursor-not-allowed"
                      disabled
                    >
                      Verify
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 mt-2 border-t">
                <h3 className="font-medium mb-2 text-gray-800">What can people see in your profile?</h3>
                <p className="text-sm text-gray-500 mb-4">Anything you hide here won't be visible to others—and you won't see it on their profiles either.</p>
                
                <div className="flex items-center justify-between py-2">
                  <div className="text-sm text-gray-700">Joined PropertyDeals</div>
                  <Switch
                    checked={profileData.showProfile}
                    onCheckedChange={handleSwitchChange}
                    className="data-[state=checked]:bg-[#09261E]"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="bg-[#09261E] hover:bg-[#09261E]/90 text-white"
                  disabled={!isAccountModified || loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        )}
        
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="max-w-3xl bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <div className="border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-[#09261E]">Profile</h2>
              <p className="text-gray-600 mt-1">Manage your professional experience, identity, and social media links</p>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Experience Section */}
              <div className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#09261E] mb-4 flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Experience
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="in_real_estate_since">In Real Estate Since</label>
                      <Input 
                        id="in_real_estate_since"
                        name="in_real_estate_since"
                        type="date"
                        value={profileData.in_real_estate_since || ""}
                        onChange={handleInputChange}
                        className="border border-gray-300 focus-visible:ring-[#09261E]/30"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="business_name">Business Name</label>
                      <Input 
                        id="business_name"
                        name="business_name"
                        value={profileData.business_name || ""}
                        onChange={handleInputChange}
                        placeholder="Your business name"
                        className="border border-gray-300 focus-visible:ring-[#09261E]/30"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Buyer Identity Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#09261E] mb-4 flex items-center">
                    <UserCheck className="mr-2 h-5 w-5" />
                    Buyer Identity
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="type_of_buyer">Type of Buyer</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {typeOfBuyerOptions.map(option => (
                        <Badge
                          key={option}
                          variant={profileData.type_of_buyer?.includes(option) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            profileData.type_of_buyer?.includes(option) 
                              ? 'bg-[#09261E] hover:bg-[#09261E]/80' 
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => handleMultiSelectChange('type_of_buyer', option)}
                        >
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Socials Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#09261E] mb-4 flex items-center">
                    <LinkIcon className="mr-2 h-5 w-5" />
                    Socials
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center text-sm font-medium mb-2 text-gray-700" htmlFor="website">
                        <Globe className="mr-2 h-4 w-4" />
                        Website
                      </label>
                      <Input 
                        id="website"
                        name="website"
                        value={profileData.website || ""}
                        onChange={handleInputChange}
                        placeholder="https://yourwebsite.com"
                        className="border border-gray-300 focus-visible:ring-[#09261E]/30"
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center text-sm font-medium mb-2 text-gray-700" htmlFor="instagram">
                        <Instagram className="mr-2 h-4 w-4" />
                        Instagram
                      </label>
                      <Input 
                        id="instagram"
                        name="instagram"
                        value={profileData.instagram || ""}
                        onChange={handleInputChange}
                        placeholder="@yourusername"
                        className="border border-gray-300 focus-visible:ring-[#09261E]/30"
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center text-sm font-medium mb-2 text-gray-700" htmlFor="facebook">
                        <Facebook className="mr-2 h-4 w-4" />
                        Facebook
                      </label>
                      <Input 
                        id="facebook"
                        name="facebook"
                        value={profileData.facebook || ""}
                        onChange={handleInputChange}
                        placeholder="facebook.com/yourusername"
                        className="border border-gray-300 focus-visible:ring-[#09261E]/30"
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center text-sm font-medium mb-2 text-gray-700" htmlFor="linkedin">
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                      </label>
                      <Input 
                        id="linkedin"
                        name="linkedin"
                        value={profileData.linkedin || ""}
                        onChange={handleInputChange}
                        placeholder="linkedin.com/in/yourusername"
                        className="border border-gray-300 focus-visible:ring-[#09261E]/30"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Profile Photo Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#09261E] mb-4 flex items-center">
                    <Upload className="mr-2 h-5 w-5" />
                    Profile Photo
                  </h3>
                  
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profileData.profile_photo_url || ""} />
                      <AvatarFallback className="bg-[#09261E] text-white text-2xl">
                        {profileData.full_name?.charAt(0) || profileData.username?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className="border border-gray-300"
                      >
                        Upload Image
                      </Button>
                      <input 
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePhotoChange}
                      />
                      <p className="text-sm text-gray-500 mt-1">Recommended size: 300x300px</p>
                    </div>
                  </div>
                </div>
                
                {/* Profile Info Section */}
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-[#09261E] mb-4">Profile Info</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since</span>
                      <span className="font-medium">
                        {profileData.created_at
                          ? format(new Date(profileData.created_at), 'MMM d, yyyy')
                          : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">User #</span>
                      <span className="font-medium">{profileData.join_number || 'N/A'}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Profile Completion</span>
                        <span className="font-medium">{profileData.profile_completion_score || 0}%</span>
                      </div>
                      <Progress value={profileData.profile_completion_score || 0} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="bg-[#09261E] hover:bg-[#09261E]/90 text-white"
                  disabled={!isProfileModified || loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        )}
        
        {/* Property Preferences Tab */}
        {activeTab === "property" && (
          <div className="max-w-3xl bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <div className="border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-[#09261E]">Property Preferences</h2>
              <p className="text-gray-600 mt-1">Set your property preferences and investment criteria</p>
            </div>
            
            <form onSubmit={handlePropertySubmit} className="space-y-6">
              {/* Property Preferences Section */}
              <div className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#09261E] mb-4 flex items-center">
                    <Home className="mr-2 h-5 w-5" />
                    Property Preferences
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="location">Location</label>
                      <Input 
                        id="location"
                        name="location"
                        value={profileData.location || ""}
                        onChange={handleInputChange}
                        placeholder="Primary city/region"
                        className="border border-gray-300 focus-visible:ring-[#09261E]/30"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="markets">Markets</label>
                      <div className="mt-1 p-2 border rounded-md min-h-[42px] flex flex-wrap gap-1 border-gray-300">
                        {profileData.markets?.map(market => (
                          <Badge
                            key={market}
                            variant="secondary"
                            className="bg-[#09261E]/10 hover:bg-[#09261E]/20 cursor-pointer"
                            onClick={() => handleMultiSelectChange('markets', market)}
                          >
                            {market}
                            <X className="ml-1 h-3 w-3" />
                          </Badge>
                        ))}
                        <Input 
                          placeholder="Type and press Enter"
                          className="flex-grow min-w-[100px] border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              if (input.value.trim()) {
                                handleMultiSelectChange('markets', input.value.trim());
                                input.value = '';
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="property_types">Property Types</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {propertyTypesOptions.map(option => (
                        <Badge
                          key={option}
                          variant={profileData.property_types?.includes(option) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            profileData.property_types?.includes(option) 
                              ? 'bg-[#09261E] hover:bg-[#09261E]/80' 
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => handleMultiSelectChange('property_types', option)}
                        >
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="property_conditions">Property Conditions</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {propertyConditionsOptions.map(option => (
                        <Badge
                          key={option}
                          variant={profileData.property_conditions?.includes(option) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            profileData.property_conditions?.includes(option) 
                              ? 'bg-[#09261E] hover:bg-[#09261E]/80' 
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => handleMultiSelectChange('property_conditions', option)}
                        >
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="ideal_budget_min">Budget Min ($)</label>
                      <Input 
                        id="ideal_budget_min"
                        name="ideal_budget_min"
                        type="number"
                        value={profileData.ideal_budget_min || ""}
                        onChange={handleInputChange}
                        placeholder="Min budget"
                        className="border border-gray-300 focus-visible:ring-[#09261E]/30"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="ideal_budget_max">Budget Max ($)</label>
                      <Input 
                        id="ideal_budget_max"
                        name="ideal_budget_max"
                        type="number"
                        value={profileData.ideal_budget_max || ""}
                        onChange={handleInputChange}
                        placeholder="Max budget"
                        className="border border-gray-300 focus-visible:ring-[#09261E]/30"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="financing_methods">Financing Methods</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {financingMethodsOptions.map(option => (
                        <Badge
                          key={option}
                          variant={profileData.financing_methods?.includes(option) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            profileData.financing_methods?.includes(option) 
                              ? 'bg-[#09261E] hover:bg-[#09261E]/80' 
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => handleMultiSelectChange('financing_methods', option)}
                        >
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="preferred_financing_method">Preferred Financing Method</label>
                      <Select
                        value={profileData.preferred_financing_method || ""}
                        onValueChange={(value) => handleSelectChange('preferred_financing_method', value)}
                      >
                        <SelectTrigger className="border border-gray-300">
                          <SelectValue placeholder="Select financing method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {financingMethodsOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="closing_timeline">Closing Timeline</label>
                      <Select
                        value={profileData.closing_timeline || ""}
                        onValueChange={(value) => handleSelectChange('closing_timeline', value)}
                      >
                        <SelectTrigger className="border border-gray-300">
                          <SelectValue placeholder="Select closing timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {closingTimelineOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Deal Info Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#09261E] mb-4 flex items-center">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Deal Info
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="number_of_deals_last_12_months">Deals Last 12 Months</label>
                      <Input 
                        id="number_of_deals_last_12_months"
                        name="number_of_deals_last_12_months"
                        type="number"
                        value={profileData.number_of_deals_last_12_months || ""}
                        onChange={handleInputChange}
                        placeholder="Number of deals"
                        className="border border-gray-300 focus-visible:ring-[#09261E]/30"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="goal_deals_next_12_months">Goal Deals Next 12 Months</label>
                      <Input 
                        id="goal_deals_next_12_months"
                        name="goal_deals_next_12_months"
                        type="number"
                        value={profileData.goal_deals_next_12_months || ""}
                        onChange={handleInputChange}
                        placeholder="Number of deals"
                        className="border border-gray-300 focus-visible:ring-[#09261E]/30"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="total_deals_done">Total Deals Done</label>
                      <Input 
                        id="total_deals_done"
                        name="total_deals_done"
                        type="number"
                        value={profileData.total_deals_done || ""}
                        onChange={handleInputChange}
                        placeholder="Number of deals"
                        className="border border-gray-300 focus-visible:ring-[#09261E]/30"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="current_portfolio_count">Properties Currently Owned</label>
                      <Input 
                        id="current_portfolio_count"
                        name="current_portfolio_count"
                        type="number"
                        value={profileData.current_portfolio_count || ""}
                        onChange={handleInputChange}
                        placeholder="Number of properties"
                        className="border border-gray-300 focus-visible:ring-[#09261E]/30"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700">Buyer Verification Tag</label>
                      <Badge 
                        variant="outline"
                        className={profileData.buyer_verification_tag ? 'bg-green-50 text-green-600 border-green-200' : 'bg-yellow-50 text-yellow-600 border-yellow-200'}
                      >
                        {profileData.buyer_verification_tag || 'Not Verified'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      This tag is assigned by our team during the verification process.
                    </div>
                  </div>
                  
                  {/* Proof of Funds Upload */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2 text-gray-700">Proof of Funds</label>
                    <Card className="mt-1 p-4 border border-gray-200">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="flex items-center">
                            <FileText className="h-10 w-10 text-gray-400 mr-3" />
                            <div>
                              <p className="font-medium">
                                {profileData.proof_of_funds_url ? 'Proof of Funds Document' : 'No document uploaded'}
                              </p>
                              <Badge 
                                variant={profileData.proof_of_funds_verified ? 'default' : 'outline'}
                                className={profileData.proof_of_funds_verified 
                                  ? 'bg-green-500 hover:bg-green-500 mt-1' 
                                  : 'bg-yellow-50 text-yellow-600 border-yellow-200 mt-1'}
                              >
                                {profileData.proof_of_funds_verified ? 
                                  <><Check className="h-3 w-3 mr-1" /> Verified</> : 
                                  <><AlertCircle className="h-3 w-3 mr-1" /> Pending</>}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="w-full sm:w-auto flex gap-2">
                            {profileData.proof_of_funds_url && (
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  const url = profileData.proof_of_funds_url;
                                  if (url && typeof url === 'string') {
                                    window.open(url, '_blank');
                                  }
                                }}
                                className="border border-gray-300"
                              >
                                View
                              </Button>
                            )}
                            <Button 
                              type="button" 
                              size="sm"
                              onClick={() => proofFileInputRef.current?.click()}
                              disabled={loading}
                              className="bg-[#09261E] hover:bg-[#09261E]/90 text-white"
                            >
                              {profileData.proof_of_funds_url ? 'Replace' : 'Upload PDF'}
                            </Button>
                            <input 
                              ref={proofFileInputRef}
                              type="file"
                              accept="application/pdf"
                              className="hidden"
                              onChange={handleProofOfFundsChange}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="bg-[#09261E] hover:bg-[#09261E]/90 text-white"
                  disabled={!isPropertyModified || loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        )}
        
        {/* Professional Preferences Tab */}
        {activeTab === "professional" && (
          <div className="max-w-3xl bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <div className="border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-[#09261E]">Professional Preferences</h2>
              <p className="text-gray-600 mt-1">Set preferences for working with various professionals</p>
            </div>
            
            <form onSubmit={handleProfessionalSubmit} className="space-y-6">
              <div className="space-y-6">
                {/* Note: In a real implementation, these would be populated from the users table with proper search */}
                
                <div>
                  <label className="flex items-center text-lg font-medium mb-2" htmlFor="preferred_inspectors">
                    <UserCheck className="mr-2 h-5 w-5" />
                    Preferred Inspectors
                  </label>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500 mb-2">
                      This feature is not yet available. You'll be able to select preferred inspectors from our database soon.
                    </p>
                    <Button type="button" variant="outline" className="text-sm border border-gray-300" disabled>
                      Add Inspector
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center text-lg font-medium mb-2" htmlFor="preferred_agents">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Preferred Agents
                  </label>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500 mb-2">
                      This feature is not yet available. You'll be able to select preferred agents from our database soon.
                    </p>
                    <Button type="button" variant="outline" className="text-sm border border-gray-300" disabled>
                      Add Agent
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center text-lg font-medium mb-2" htmlFor="preferred_contractors">
                    <Hammer className="mr-2 h-5 w-5" />
                    Preferred Contractors
                  </label>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500 mb-2">
                      This feature is not yet available. You'll be able to select preferred contractors from our database soon.
                    </p>
                    <Button type="button" variant="outline" className="text-sm border border-gray-300" disabled>
                      Add Contractor
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center text-lg font-medium mb-2" htmlFor="preferred_lenders">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Preferred Lenders
                  </label>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500 mb-2">
                      This feature is not yet available. You'll be able to select preferred lenders from our database soon.
                    </p>
                    <Button type="button" variant="outline" className="text-sm border border-gray-300" disabled>
                      Add Lender
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="bg-[#09261E] hover:bg-[#09261E]/90 text-white"
                  disabled={!isProfessionalModified || loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}