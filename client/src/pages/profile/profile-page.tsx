import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import styles from "./profile-page.module.css";

// Import icons
import {
  User,
  UserCircle,
  Upload,
  Calendar,
  MapPin,
  Building,
  DollarSign,
  Clock,
  FileCheck,
  Shield,
  Users,
  TrendingUp,
  Briefcase,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  Save,
  Check,
  X,
  Globe,
  Trash,
  ExternalLink,
  Camera,
  AlertTriangle,
  Wrench
} from "lucide-react";

// Third-party icons - we use these directly for specialized icons
import { Instagram, Linkedin, Facebook as FacebookIcon } from "lucide-react";

interface ProfileData {
  id: string;
  full_name: string;
  bio: string | null;
  username: string;
  email: string;
  phone: string | null;
  in_real_estate_since: number | null;
  business_name: string | null;
  type_of_buyer: string[];
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  profile_photo_url: string | null;
  profile_banner_url: string | null;
  created_at: string;
  join_number: number | null;
  profile_completion_score: number;
  location: string | null;
  markets: string[];
  property_types: string[];
  property_conditions: string[];
  ideal_budget_min: number | null;
  ideal_budget_max: number | null;
  financing_methods: string[];
  preferred_financing_method: string | null;
  closing_timeline: string | null;
  number_of_deals_last_12_months: number | null;
  goal_deals_next_12_months: number | null;
  total_deals_done: number | null;
  current_portfolio_count: number | null;
  buyer_verification_tag: string | null;
  proof_of_funds_url: string | null;
  proof_of_funds_verified: boolean;
  preferred_inspectors: string[];
  preferred_agents: string[];
  preferred_contractors: string[];
  preferred_lenders: string[];
  showProfile: boolean;
  [key: string]: any; // Index signature for dynamic access - allows for string or other types
}

interface ProfileMenuItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  danger?: boolean;
}

// Options for form selects
const buyerTypeOptions = ["Flipper", "Rental Investor", "BRRRR", "Wholesaler", "Fix & Hold", "Land Developer", "House Hacker"];
const propertyTypeOptions = ["Single-Family", "Multi-Family", "Condo", "Townhouse", "Land", "Commercial", "Mixed-Use", "Mobile/Manufactured"];
const propertyConditionOptions = ["Move-in Ready", "Minor Repairs", "Major Rehab", "Teardown/Lot Value", "New Construction"];
const financingMethodOptions = ["Cash", "Conventional Loan", "Hard Money", "Private Money", "HELOC", "DSCR Loan", "Owner Financing", "Subject-To", "Partnerships"];
const closingTimelineOptions = ["ASAP (7-14 days)", "15-30 days", "30-60 days", "60-90 days", "Flexible"];

// Component for consistent menu items in the left sidebar
const ProfileMenuItem = ({ icon, label, href, active, onClick, danger }: ProfileMenuItem) => {
  const baseClasses = "w-full flex items-center px-4 py-2.5 text-left rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#09261E]/50";
  const activeClasses = "bg-[#09261E]/10 text-[#09261E] font-medium shadow-sm";
  const normalClasses = "text-gray-700 hover:bg-gray-100";
  const dangerClasses = "text-red-600 hover:bg-red-50";
  
  const className = `${baseClasses} ${active ? activeClasses : danger ? dangerClasses : normalClasses}`;

  if (href) {
    return (
      <a href={href} className={className}>
        <span className="mr-3 text-current">{icon}</span>
        <span>{label}</span>
      </a>
    );
  }
  
  return (
    <button onClick={onClick} className={className}>
      <span className="mr-3 text-current">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export default function ProfilePage() {
  // Get the current route for active menu tracking
  const [location] = useLocation();
  const { toast } = useToast();
  const { user, logoutMutation } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  
  // Track which sections have been modified for enabling save buttons
  const [isProfileSectionModified, setIsProfileSectionModified] = useState(false);
  const [isPropertySectionModified, setIsPropertySectionModified] = useState(false);
  const [isProfessionalSectionModified, setIsProfessionalSectionModified] = useState(false);
  
  // Default profile data
  const [profileData, setProfileData] = useState<ProfileData>({
    id: user?.id?.toString() || "",
    full_name: user?.fullName || "",
    bio: null,
    username: user?.username || "",
    email: user?.email || "",
    phone: null,
    in_real_estate_since: null,
    business_name: null,
    type_of_buyer: [],
    website: null,
    instagram: null,
    facebook: null,
    linkedin: null,
    profile_photo_url: null,
    profile_banner_url: null,
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

  // Fetch profile data on component mount
  const { data: fetchedProfile, isLoading } = useQuery({
    queryKey: ['/api/profile']
  });

  // Handle profile data when fetched
  useEffect(() => {
    if (fetchedProfile) {
      setProfileData(prev => ({
        ...prev,
        ...fetchedProfile
      }));
    }
  }, [fetchedProfile]);

  // Debounce username check while user types
  useEffect(() => {
    const username = profileData.username;
    if (!username) return;
    
    // Don't check if username hasn't changed from original user data
    if (username === user?.username) {
      setIsCheckingUsername(false);
      setUsernameMessage("");
      return;
    }
    
    setIsCheckingUsername(true);
    setUsernameMessage("");
    
    const timer = setTimeout(async () => {
      try {
        // Check if username exists
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .neq('id', user?.id)
          .maybeSingle();
        
        if (error) {
          console.error("Username check error:", error);
          setIsCheckingUsername(false);
          return;
        }
        
        // If data exists, username is taken
        if (data) {
          setIsUsernameAvailable(false);
          setUsernameMessage("Username already taken");
        } else {
          setIsUsernameAvailable(true);
          setUsernameMessage("Username available");
        }
        
        setIsCheckingUsername(false);
      } catch (err) {
        console.error("Username check error:", err);
        setIsCheckingUsername(false);
        return;
      }
    }, 500); // Debounce for 500ms
    
    return () => clearTimeout(timer);
  }, [profileData.username, user?.id, user?.username]);
  
  // Handle input changes for text fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: string) => {
    const { name, value } = e.target;
    
    // Update the state
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Mark the appropriate section as modified
    if (section === 'profile') {
      setIsProfileSectionModified(true);
    } else if (section === 'property') {
      setIsPropertySectionModified(true);
    } else if (section === 'professional') {
      setIsProfessionalSectionModified(true);
    }
  };
  
  // Handle select changes
  const handleSelectChange = (value: string, field: keyof ProfileData, section: string) => {
    // Update the state
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Mark the appropriate section as modified
    if (section === 'profile') {
      setIsProfileSectionModified(true);
    } else if (section === 'property') {
      setIsPropertySectionModified(true);
    } else if (section === 'professional') {
      setIsProfessionalSectionModified(true);
    }
  };
  
  // Handle multi-select changes (for arrays)
  const handleMultiSelectChange = (field: keyof ProfileData, value: string, section: string) => {
    // Get the current array
    const currentArray = profileData[field] as string[];
    // Check if the value is already in the array
    const index = currentArray.indexOf(value);
    
    // Create a new array with the value toggled
    let newArray;
    if (index === -1) {
      // Add the value
      newArray = [...currentArray, value];
    } else {
      // Remove the value
      newArray = [...currentArray];
      newArray.splice(index, 1);
    }
    
    // Update the state
    setProfileData(prev => ({
      ...prev,
      [field]: newArray
    }));
    
    // Mark the appropriate section as modified
    if (section === 'profile') {
      setIsProfileSectionModified(true);
    } else if (section === 'property') {
      setIsPropertySectionModified(true);
    } else if (section === 'professional') {
      setIsProfessionalSectionModified(true);
    }
  };
  
  // Handle checkbox changes (for showProfile)
  const handleCheckboxChange = (checked: boolean | string, field: keyof ProfileData, section: string) => {
    // Update the state with properly typed value
    const boolValue: boolean = typeof checked === 'boolean' ? checked : checked === 'true';
    setProfileData(prev => ({
      ...prev,
      [field]: boolValue
    }));
    
    // Mark the appropriate section as modified
    if (section === 'profile') {
      setIsProfileSectionModified(true);
    } else if (section === 'property') {
      setIsPropertySectionModified(true);
    } else if (section === 'professional') {
      setIsProfessionalSectionModified(true);
    }
  };
  
  // Handle profile photo change
  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    
    try {
      // Upload to Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      // Update profile data
      setProfileData(prev => ({
        ...prev,
        profile_photo_url: publicUrlData.publicUrl
      }));
      
      // Update profile in database immediately
      await supabase
        .from('profiles')
        .update({ profile_photo_url: publicUrlData.publicUrl })
        .eq('id', user?.id);
      
      toast({
        title: "Profile photo updated",
        description: "Your profile photo has been updated successfully.",
      });
      
      setIsProfileSectionModified(true);
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error updating profile photo",
        description: "There was an error uploading your profile photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle banner image change
  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    
    try {
      // Upload to Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-banner-${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      // Update profile data
      setProfileData(prev => ({
        ...prev,
        profile_banner_url: publicUrlData.publicUrl
      }));
      
      // Update profile in database immediately
      await supabase
        .from('profiles')
        .update({ profile_banner_url: publicUrlData.publicUrl })
        .eq('id', user?.id);
      
      toast({
        title: "Banner image updated",
        description: "Your banner image has been updated successfully.",
      });
      
      setIsProfileSectionModified(true);
    } catch (error) {
      console.error('Error uploading banner:', error);
      toast({
        title: "Error updating banner image",
        description: "There was an error uploading your banner image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Update profile data - handle form submissions
  const handleProfileSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isProfileSectionModified) return;
    
    try {
      setLoading(true);
      
      const profilePayload = {
        full_name: profileData.full_name,
        username: profileData.username,
        bio: profileData.bio,
        phone: profileData.phone,
        in_real_estate_since: profileData.in_real_estate_since,
        business_name: profileData.business_name,
        type_of_buyer: profileData.type_of_buyer,
        website: profileData.website,
        instagram: profileData.instagram,
        facebook: profileData.facebook,
        linkedin: profileData.linkedin,
        profile_photo_url: profileData.profile_photo_url,
        profile_banner_url: profileData.profile_banner_url,
        showProfile: profileData.showProfile,
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(profilePayload)
        .eq('id', user?.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      
      setIsProfileSectionModified(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle property preferences form submission
  const handlePropertySectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPropertySectionModified) return;
    
    try {
      setLoading(true);
      
      const propertyPayload = {
        location: profileData.location,
        markets: profileData.markets,
        property_types: profileData.property_types,
        property_conditions: profileData.property_conditions,
        ideal_budget_min: profileData.ideal_budget_min,
        ideal_budget_max: profileData.ideal_budget_max,
        financing_methods: profileData.financing_methods,
        preferred_financing_method: profileData.preferred_financing_method,
        closing_timeline: profileData.closing_timeline,
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(propertyPayload)
        .eq('id', user?.id);
      
      if (error) throw error;
      
      toast({
        title: "Property preferences updated",
        description: "Your property preferences have been updated successfully.",
      });
      
      setIsPropertySectionModified(false);
    } catch (error) {
      console.error('Error updating property preferences:', error);
      toast({
        title: "Error updating property preferences",
        description: "There was an error updating your property preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle professional information form submission
  const handleProfessionalSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isProfessionalSectionModified) return;
    
    try {
      setLoading(true);
      
      const professionalPayload = {
        number_of_deals_last_12_months: profileData.number_of_deals_last_12_months,
        goal_deals_next_12_months: profileData.goal_deals_next_12_months,
        total_deals_done: profileData.total_deals_done,
        current_portfolio_count: profileData.current_portfolio_count,
        preferred_inspectors: profileData.preferred_inspectors,
        preferred_agents: profileData.preferred_agents,
        preferred_contractors: profileData.preferred_contractors,
        preferred_lenders: profileData.preferred_lenders,
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(professionalPayload)
        .eq('id', user?.id);
      
      if (error) throw error;
      
      toast({
        title: "Deal history updated",
        description: "Your deal history and professional information has been updated successfully.",
      });
      
      setIsProfessionalSectionModified(false);
    } catch (error) {
      console.error('Error updating professional information:', error);
      toast({
        title: "Error updating professional information",
        description: "There was an error updating your professional information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };
  
  // Calculate profile completion score
  const calculateProfileCompletionScore = () => {
    // Basic profile: 40 points max
    let basicScore = 0;
    if (profileData.full_name) basicScore += 5;
    if (profileData.username) basicScore += 5;
    if (profileData.bio) basicScore += 5;
    if (profileData.phone) basicScore += 5;
    if (profileData.profile_photo_url) basicScore += 8;
    if (profileData.profile_banner_url) basicScore += 7;
    if (profileData.in_real_estate_since) basicScore += 5;
    
    // Property preferences: 30 points max
    let propertyScore = 0;
    if (profileData.location) propertyScore += 6;
    if (profileData.property_types.length > 0) propertyScore += 6;
    if (profileData.property_conditions.length > 0) propertyScore += 6;
    if (profileData.financing_methods.length > 0) propertyScore += 6;
    if (profileData.closing_timeline) propertyScore += 6;
    
    // Deal history: 30 points max
    let dealScore = 0;
    if (profileData.number_of_deals_last_12_months !== null) dealScore += 7;
    if (profileData.goal_deals_next_12_months !== null) dealScore += 7;
    if (profileData.total_deals_done !== null) dealScore += 8;
    if (profileData.current_portfolio_count !== null) dealScore += 8;
    
    return Math.round(basicScore + propertyScore + dealScore);
  };
  
  // Update profile completion score whenever relevant fields change
  useEffect(() => {
    // Only update after initial load to avoid unnecessary updates
    const timer = setTimeout(() => {
      const score = calculateProfileCompletionScore();
      
      // Only update if score changed
      if (score !== profileData.profile_completion_score) {
        setProfileData(prev => ({
          ...prev,
          profile_completion_score: score
        }));
        
        // Silently update the score in the database
        supabase
          .from('profiles')
          .update({ profile_completion_score: score })
          .eq('id', user?.id)
          .then(({ error }) => {
            if (error) console.error('Error updating profile score:', error);
          });
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [
      profileData.full_name, profileData.username, profileData.bio, profileData.phone, 
      profileData.profile_photo_url, profileData.profile_banner_url, profileData.in_real_estate_since,
      profileData.location, profileData.property_types, profileData.property_conditions,
      profileData.financing_methods, profileData.closing_timeline,
      profileData.ideal_budget_min, profileData.ideal_budget_max,
      profileData.number_of_deals_last_12_months, profileData.goal_deals_next_12_months,
      profileData.total_deals_done, profileData.current_portfolio_count]);

  return (
    <div className="flex flex-row">
      {/* Settings sidebar - Positioned exactly flush against main sidebar */}
      <div className="w-[250px] border-r fixed left-16 top-0 bottom-0 flex flex-col bg-white shadow-sm h-screen z-10">
        {/* Profile info - Sticky top */}
        <div className="px-6 py-6 mb-2 border-b flex flex-col items-center sticky top-0 bg-white z-10">
          <div className="relative group">
            <Avatar className="h-20 w-20 mb-2 ring-2 ring-offset-2 ring-[#09261E]/50 group-hover:ring-[#09261E]">
              <AvatarImage src={profileData.profile_photo_url || ""} alt={profileData.full_name || "User"} />
              <AvatarFallback className="bg-[#09261E] text-white text-xl font-medium">
                {profileData.full_name?.charAt(0) || profileData.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Upload className="h-5 w-5 text-white" />
            </div>
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePhotoChange}
            />
          </div>
          
          <h2 className="font-bold text-lg">{profileData.full_name || profileData.username}</h2>
          <p className="text-gray-500 text-sm mb-3">@{profileData.username}</p>
          
          <Button 
            type="button" 
            variant="outline"
            size="sm"
            className="text-xs border border-gray-300 transition-colors hover:bg-gray-50 w-full"
            onClick={() => window.open(`/user/${profileData.username}`, '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Preview Public Profile
          </Button>
        </div>
        
        {/* Scrollable Menu Section */}
        <div className="px-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pb-20">
          {/* Menu Items */}
          <div className="py-2 space-y-1">
            <button
              className="w-full flex items-center px-4 py-2.5 text-left rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#09261E]/50 bg-[#09261E]/10 text-[#09261E] font-medium shadow-sm"
              onClick={() => {
                // Client-side refresh of current page content
                queryClient.invalidateQueries({queryKey: ['/api/profile']});
                toast({
                  title: "Account settings refreshed",
                  description: "Your account settings have been refreshed.",
                });
              }}
            >
              <UserCircle size={18} className="mr-3 text-[#09261E]" />
              <span>Account</span>
            </button>
            
            <ProfileMenuItem
              icon={<Shield size={18} />}
              label="Security & Privacy"
              onClick={() => {
                // Client-side navigation would happen here
                // Just for now, we'll show a toast
                toast({
                  title: "Coming Soon",
                  description: "Security & Privacy settings will be available soon.",
                });
              }}
              active={false}
            />
            
            <ProfileMenuItem
              icon={<CreditCard size={18} />}
              label="Payment Methods" 
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Payment Methods settings will be available soon.",
                });
              }}
              active={false}
            />
            
            <ProfileMenuItem
              icon={<Bell size={18} />}
              label="Notifications"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Notification settings will be available soon.",
                });
              }}
              active={false}
            />
            
            <ProfileMenuItem
              icon={<HelpCircle size={18} />}
              label="Help Center"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Help Center will be available soon.",
                });
              }}
              active={false}
            />
          </div>
        </div>
        
        {/* Logout Button - Sticky bottom */}
        <div className="px-3 py-3 border-t sticky bottom-0 bg-white mt-auto">
          <Button 
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </Button>
        </div>
      </div>
      
      {/* Main content area - Adjusted margin-left to account for both sidebars */}
      <div className="ml-[266px] flex-1 bg-gray-50/60 p-4 md:p-8 overflow-y-auto pb-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="border-b pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-500 mt-1">Manage your profile information and preferences</p>
          </div>
          
          {/* Profile Section */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-xl">Profile</CardTitle>
              <CardDescription>Your personal and business information</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <form onSubmit={handleProfileSectionSubmit}>
                {/* Basic Info Section */}
                <div className="space-y-4 mb-8">
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 text-gray-700" htmlFor="full_name">
                        Full Name
                      </label>
                      <Input 
                        id="full_name"
                        name="full_name"
                        value={profileData.full_name}
                        onChange={(e) => handleInputChange(e, 'profile')}
                        className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 flex items-center text-gray-700" htmlFor="username">
                        Username
                        {isCheckingUsername && <span className="ml-2 text-xs text-gray-400">Checking availability...</span>}
                        {!isCheckingUsername && usernameMessage && (
                          <span className={`ml-2 text-xs ${isUsernameAvailable ? 'text-green-500' : 'text-red-500'}`}>
                            {usernameMessage}
                          </span>
                        )}
                      </label>
                      <Input 
                        id="username"
                        name="username"
                        value={profileData.username}
                        onChange={(e) => handleInputChange(e, 'profile')}
                        className={`border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50 ${
                          usernameMessage && !isUsernameAvailable ? 'border-red-300' : ''
                        }`}
                        placeholder="Choose a username"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 text-gray-700" htmlFor="email">
                        Email
                      </label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                        placeholder="Your email address"
                        disabled // Email is managed by Supabase auth and can't be changed here
                      />
                      <p className="text-xs mt-1 text-gray-500">
                        Email changes are managed through security settings.
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 text-gray-700" htmlFor="phone">
                        Phone Number
                      </label>
                      <Input 
                        id="phone"
                        name="phone"
                        type="tel"
                        value={profileData.phone || ""}
                        onChange={(e) => handleInputChange(e, 'profile')}
                        className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 text-gray-700" htmlFor="bio">
                      Bio
                    </label>
                    <Textarea 
                      id="bio"
                      name="bio"
                      value={profileData.bio || ""}
                      onChange={(e) => handleInputChange(e, 'profile')}
                      className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50 min-h-[100px]"
                      placeholder="Tell us about yourself and your real estate journey..."
                    />
                  </div>
                </div>
                
                {/* Profile Visibility */}
                <div className="space-y-4 mb-8 pt-6 border-t">
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Profile Visibility</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1" htmlFor="showProfile">
                        Show Public Profile
                      </label>
                      <p className="text-xs text-gray-500">
                        When enabled, your profile will be visible to other users.
                      </p>
                    </div>
                    <Switch
                      id="showProfile"
                      checked={profileData.showProfile}
                      onCheckedChange={(checked) => handleCheckboxChange(checked, 'showProfile', 'profile')}
                      className="data-[state=checked]:bg-[#09261E]"
                    />
                  </div>
                </div>
                
                <div className="pt-6 flex justify-end border-t">
                  <Button 
                    type="submit" 
                    className="bg-[#09261E] hover:bg-[#09261E]/90 text-white"
                    disabled={loading || !isProfileSectionModified}
                  >
                    {loading ? "Saving..." : "Save Profile Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Professional Information Section */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-xl">Professional Information</CardTitle>
              <CardDescription>Your business details and professional background</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <form onSubmit={handleProfileSectionSubmit}>
                {/* Professional Info */}
                <div className="space-y-4 mb-8">
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Business Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 text-gray-700" htmlFor="in_real_estate_since">
                        In Real Estate Since
                      </label>
                      <Input 
                        id="in_real_estate_since"
                        name="in_real_estate_since"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={profileData.in_real_estate_since || ""}
                        onChange={(e) => handleInputChange(e, 'profile')}
                        className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                        placeholder="Year"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 text-gray-700" htmlFor="business_name">
                        Business Name
                      </label>
                      <Input 
                        id="business_name"
                        name="business_name"
                        value={profileData.business_name || ""}
                        onChange={(e) => handleInputChange(e, 'profile')}
                        className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                        placeholder="Your business name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700">
                      Type of Buyer
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {buyerTypeOptions.map((option) => (
                        <div key={option} className="flex items-center">
                          <Checkbox 
                            id={`type_${option}`}
                            checked={profileData.type_of_buyer?.includes(option)}
                            onCheckedChange={(checked) => {
                              if (checked === true) {
                                handleMultiSelectChange('type_of_buyer', option, 'profile');
                              } else {
                                handleMultiSelectChange('type_of_buyer', option, 'profile');
                              }
                            }}
                            className="data-[state=checked]:bg-[#09261E] data-[state=checked]:border-[#09261E]"
                          />
                          <label 
                            htmlFor={`type_${option}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Social Media */}
                <div className="space-y-4 mb-8 pt-6 border-t">
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Social Media</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center text-sm font-medium mb-2 text-gray-700" htmlFor="website">
                        <Globe className="mr-2 h-4 w-4" />
                        Website
                      </label>
                      <Input 
                        id="website"
                        name="website"
                        value={profileData.website || ""}
                        onChange={(e) => handleInputChange(e, 'profile')}
                        className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                        placeholder="https://yourwebsite.com"
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
                        onChange={(e) => handleInputChange(e, 'profile')}
                        className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                        placeholder="@yourusername"
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center text-sm font-medium mb-2 text-gray-700" htmlFor="facebook">
                        <FacebookIcon className="mr-2 h-4 w-4" />
                        Facebook
                      </label>
                      <Input 
                        id="facebook"
                        name="facebook"
                        value={profileData.facebook || ""}
                        onChange={(e) => handleInputChange(e, 'profile')}
                        className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                        placeholder="facebook.com/yourprofile"
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
                        onChange={(e) => handleInputChange(e, 'profile')}
                        className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                        placeholder="linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 flex justify-end border-t">
                  <Button 
                    type="submit" 
                    className="bg-[#09261E] hover:bg-[#09261E]/90 text-white"
                    disabled={loading || !isProfileSectionModified}
                  >
                    {loading ? "Saving..." : "Save Professional Information"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Property Preferences Section */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-xl">Property Preferences</CardTitle>
              <CardDescription>Tell us what kind of properties you're looking for</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <form onSubmit={handlePropertySectionSubmit}>
                {/* Location */}
                <div className="space-y-4 mb-8">
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Location</h3>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700" htmlFor="location">
                      Primary Location
                    </label>
                    <Input 
                      id="location"
                      name="location"
                      value={profileData.location || ""}
                      onChange={(e) => handleInputChange(e, 'property')}
                      className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                      placeholder="City, State or Region"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700">
                      Property Types
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {propertyTypeOptions.map((option) => (
                        <div key={option} className="flex items-center">
                          <Checkbox 
                            id={`property_type_${option}`}
                            checked={profileData.property_types?.includes(option)}
                            onCheckedChange={(checked) => {
                              if (checked === true) {
                                handleMultiSelectChange('property_types', option, 'property');
                              } else {
                                handleMultiSelectChange('property_types', option, 'property');
                              }
                            }}
                            className="data-[state=checked]:bg-[#09261E] data-[state=checked]:border-[#09261E]"
                          />
                          <label 
                            htmlFor={`property_type_${option}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700">
                      Property Conditions
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {propertyConditionOptions.map((option) => (
                        <div key={option} className="flex items-center">
                          <Checkbox 
                            id={`property_condition_${option}`}
                            checked={profileData.property_conditions?.includes(option)}
                            onCheckedChange={(checked) => {
                              if (checked === true) {
                                handleMultiSelectChange('property_conditions', option, 'property');
                              } else {
                                handleMultiSelectChange('property_conditions', option, 'property');
                              }
                            }}
                            className="data-[state=checked]:bg-[#09261E] data-[state=checked]:border-[#09261E]"
                          />
                          <label 
                            htmlFor={`property_condition_${option}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Budget & Financing */}
                <div className="space-y-4 mb-8 pt-6 border-t">
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Budget & Financing</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 text-gray-700" htmlFor="ideal_budget_min">
                        Minimum Budget
                      </label>
                      <Input 
                        id="ideal_budget_min"
                        name="ideal_budget_min"
                        type="number"
                        value={profileData.ideal_budget_min || ""}
                        onChange={(e) => handleInputChange(e, 'property')}
                        className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                        placeholder="$"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 text-gray-700" htmlFor="ideal_budget_max">
                        Maximum Budget
                      </label>
                      <Input 
                        id="ideal_budget_max"
                        name="ideal_budget_max"
                        type="number"
                        value={profileData.ideal_budget_max || ""}
                        onChange={(e) => handleInputChange(e, 'property')}
                        className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                        placeholder="$"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700">
                      Financing Methods
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {financingMethodOptions.map((option) => (
                        <div key={option} className="flex items-center">
                          <Checkbox 
                            id={`financing_method_${option}`}
                            checked={profileData.financing_methods?.includes(option)}
                            onCheckedChange={(checked) => {
                              if (checked === true) {
                                handleMultiSelectChange('financing_methods', option, 'property');
                              } else {
                                handleMultiSelectChange('financing_methods', option, 'property');
                              }
                            }}
                            className="data-[state=checked]:bg-[#09261E] data-[state=checked]:border-[#09261E]"
                          />
                          <label 
                            htmlFor={`financing_method_${option}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700" htmlFor="closing_timeline">
                      Closing Timeline
                    </label>
                    <Select 
                      value={profileData.closing_timeline || ""} 
                      onValueChange={(value) => handleSelectChange(value, 'closing_timeline', 'property')}
                    >
                      <SelectTrigger className="w-full border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50">
                        <SelectValue placeholder="Select your preferred closing timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        {closingTimelineOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="pt-6 flex justify-end border-t">
                  <Button 
                    type="submit" 
                    className="bg-[#09261E] hover:bg-[#09261E]/90 text-white"
                    disabled={loading || !isPropertySectionModified}
                  >
                    {loading ? "Saving..." : "Save Property Preferences"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Deal History Section */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-xl">Deal History & Goals</CardTitle>
              <CardDescription>Share your real estate track record and future goals</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <form onSubmit={handleProfessionalSectionSubmit}>
                <div className="space-y-4 mb-8">
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Deal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 text-gray-700" htmlFor="number_of_deals_last_12_months">
                        Deals in Last 12 Months
                      </label>
                      <Input 
                        id="number_of_deals_last_12_months"
                        name="number_of_deals_last_12_months"
                        type="number"
                        min="0"
                        value={profileData.number_of_deals_last_12_months || ""}
                        onChange={(e) => handleInputChange(e, 'professional')}
                        className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                        placeholder="Number of deals"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 text-gray-700" htmlFor="goal_deals_next_12_months">
                        Target Deals Next 12 Months
                      </label>
                      <Input 
                        id="goal_deals_next_12_months"
                        name="goal_deals_next_12_months"
                        type="number"
                        min="0"
                        value={profileData.goal_deals_next_12_months || ""}
                        onChange={(e) => handleInputChange(e, 'professional')}
                        className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                        placeholder="Number of deals"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 text-gray-700" htmlFor="total_deals_done">
                        Total Deals Done
                      </label>
                      <Input 
                        id="total_deals_done"
                        name="total_deals_done"
                        type="number"
                        min="0"
                        value={profileData.total_deals_done || ""}
                        onChange={(e) => handleInputChange(e, 'professional')}
                        className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                        placeholder="Number of deals"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 text-gray-700" htmlFor="current_portfolio_count">
                        Current Portfolio Size
                      </label>
                      <Input 
                        id="current_portfolio_count"
                        name="current_portfolio_count"
                        type="number"
                        min="0"
                        value={profileData.current_portfolio_count || ""}
                        onChange={(e) => handleInputChange(e, 'professional')}
                        className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                        placeholder="Number of properties"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 flex justify-end border-t">
                  <Button 
                    type="submit" 
                    className="bg-[#09261E] hover:bg-[#09261E]/90 text-white"
                    disabled={loading || !isProfessionalSectionModified}
                  >
                    {loading ? "Saving..." : "Save Deal History"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}