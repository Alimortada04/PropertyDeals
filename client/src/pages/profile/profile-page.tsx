import React, { useState, useRef, useEffect, useMemo } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  Wrench,
  Link2 as LinkIcon,
  Plus,
  BellRing,
  MessageSquare,
  ArrowRight,
  Pencil,
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
  className?: string;
}

// Options for form selects
const buyerTypeOptions = ["Flipper", "Rental Investor", "BRRRR", "Wholesaler", "Fix & Hold", "Land Developer", "House Hacker"];
const propertyTypeOptions = ["Single-Family", "Multi-Family", "Condo", "Townhouse", "Land", "Commercial", "Mixed-Use", "Mobile/Manufactured"];
const propertyConditionOptions = ["Move-in Ready", "Minor Repairs", "Major Rehab", "Teardown/Lot Value", "New Construction"];
const financingMethodOptions = ["Cash", "Conventional Loan", "Hard Money", "Private Money", "HELOC", "DSCR Loan", "Owner Financing", "Subject-To", "Partnerships"];
const closingTimelineOptions = ["ASAP (7-14 days)", "15-30 days", "30-60 days", "60-90 days", "Flexible"];

// Component for consistent menu items in the left sidebar
const ProfileMenuItem = ({ icon, label, href, active, onClick, danger, className: customClassName }: ProfileMenuItem) => {
  const baseClasses = "w-full flex items-center px-4 py-3 text-left rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#09261E]/50";
  const activeClasses = "bg-[#09261E]/10 text-[#09261E] font-medium shadow-sm";
  const normalClasses = "text-gray-700 hover:bg-gray-100";
  const dangerClasses = "text-red-600 hover:bg-red-50";
  
  const className = `${baseClasses} ${active ? activeClasses : danger ? dangerClasses : normalClasses} ${customClassName || ''}`;

  if (href) {
    return (
      <a href={href} className={className}>
        <span className="mr-3 text-current">{icon}</span>
        <span className="font-medium text-sm">{label}</span>
      </a>
    );
  }
  
  return (
    <button onClick={onClick} className={className}>
      <span className="mr-3 text-current">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
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
  
  // Determine active tab from URL (either from hash or path segments)
  const initialTab = useMemo(() => {
    const validTabs = ["account", "notifications", "connected", "memberships", "security", "help"];
    
    // Check hash-based routing first (#help, #account, etc.)
    if (location.includes('#')) {
      const hash = location.split('#')[1];
      if (validTabs.includes(hash)) return hash;
    }
    
    // Then check path-based routing (/profile/help, etc.)
    const pathSegments = location.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (validTabs.includes(lastSegment)) return lastSegment;
    
    return "account"; // Default tab
  }, [location]);
  
  // Track active settings tab
  const [activeTab, setActiveTab] = useState(initialTab);
  
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
        showProfile: profileData.showProfile
      };
      
      // Save to database
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
  
  // Handle property preferences submission
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
        closing_timeline: profileData.closing_timeline
      };
      
      // Save to database
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
  
  // Handle professional information submission
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
        preferred_lenders: profileData.preferred_lenders
      };
      
      // Save to database
      const { error } = await supabase
        .from('profiles')
        .update(professionalPayload)
        .eq('id', user?.id);
      
      if (error) throw error;
      
      toast({
        title: "Deal history updated",
        description: "Your deal history and goals have been updated successfully.",
      });
      
      setIsProfessionalSectionModified(false);
    } catch (error) {
      console.error('Error updating deal history:', error);
      toast({
        title: "Error updating deal history",
        description: "There was an error updating your deal history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      // Redirect happens automatically in the logoutMutation
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error logging out",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // If we're still loading the profile, show a loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hidden file inputs for profile and banner image uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProfilePhotoChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={bannerInputRef}
        onChange={handleBannerChange}
        accept="image/*"
        className="hidden"
      />
      
      {/* Main content with sidebar */}
      <div className="flex flex-1">
        {/* Settings Menu Sidebar - reduced width to 220px */}
        <div className="w-[220px] fixed top-0 left-16 bottom-[48px] bg-white border-r flex flex-col shadow-sm">
          {/* User Profile Section - Redesigned to match screenshot */}
          <div className="px-6 pt-8 pb-6 border-b flex flex-col items-center">
            <div className="relative mb-2">
              <Avatar className="h-20 w-20 border-2 border-gray-200">
                {profileData.profile_photo_url ? (
                  <AvatarImage src={profileData.profile_photo_url} />
                ) : (
                  <AvatarFallback className="bg-[#09261E] text-white text-xl font-semibold">
                    PD
                  </AvatarFallback>
                )}
              </Avatar>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full border shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Camera size={16} className="text-gray-600" />
              </button>
            </div>
            
            <p className="text-sm text-gray-500 font-medium mb-4">
              {profileData.username ? `@${profileData.username}` : "@" + (user?.username || "")}
            </p>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-sm font-medium flex items-center justify-center gap-2 
                         transition-all duration-200 bg-white hover:bg-[#09261E]/5 
                         shadow-none hover:shadow-sm active:scale-95 hover:scale-[1.02]
                         group"
              onClick={() => window.open(`/profile/${profileData.username}`, '_blank')}
            >
              <ExternalLink size={16} className="mr-1 group-hover:text-[#09261E] transition-colors" />
              <span className="group-hover:text-[#09261E] transition-colors relative">
                Preview Profile
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#09261E]/50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </span>
            </Button>
          </div>
        
          {/* Menu Items Section */}
          <div className="px-3 pt-4 flex-1 overflow-y-auto">
            <div className="space-y-2">
              <ProfileMenuItem
                icon={<User size={18} />}
                label="Account"
                active={activeTab === "account"}
                href="/profile/account"
              />
              
              <ProfileMenuItem
                icon={<BellRing size={18} />}
                label="Notifications"
                active={activeTab === "notifications"}
                href="/profile/notifications"
              />
              
              <ProfileMenuItem
                icon={<LinkIcon size={18} />}
                label="Integrations"
                active={activeTab === "connected"}
                href="/profile/connected"
              />
              
              <ProfileMenuItem
                icon={<CreditCard size={18} />}
                label="Memberships"
                active={activeTab === "memberships"}
                href="/profile/memberships"
              />
              
              <ProfileMenuItem
                icon={<Shield size={18} />}
                label="Security & Privacy"
                active={activeTab === "security"}
                href="/profile/security"
              />
              
              <ProfileMenuItem
                icon={<HelpCircle size={18} />}
                label="Help Center"
                active={activeTab === "help"}
                href="/profile/help"
              />
            </div>
          </div>
          
          {/* Logout Button - Sticky bottom with red text/icon but no red background */}
          <div className="px-4 py-5 border-t sticky bottom-0 bg-white mt-auto">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50/50 flex items-center justify-start gap-2 px-4 py-3"
                >
                  <LogOut size={18} className="text-red-600 mr-1" />
                  <span className="font-medium text-sm">Log Out</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will need to sign in again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No, take me back</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
                    Yes, I'm sure
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        {/* Main content area - Adjusted margin-left to account for both sidebars */}
        <div className="ml-[236px] flex-1 bg-gray-50/60 p-4 md:p-8 overflow-y-auto pb-20">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Tab Content - We'll conditionally show different content based on the active sidebar menu item */}
            {activeTab === "account" && (
              <>
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
                              placeholder="Your Instagram handle"
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
                              placeholder="Your Facebook profile"
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
                              placeholder="Your LinkedIn profile"
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
                          {loading ? "Saving..." : "Save Profile Changes"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === "notifications" && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="text-xl">Notification Preferences</CardTitle>
                  <CardDescription>Manage how and when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Email Notifications</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            New Property Alerts
                          </label>
                          <p className="text-xs text-gray-500">
                            Receive email notifications when new properties match your search criteria
                          </p>
                        </div>
                        <Switch
                          id="newPropertyAlerts"
                          className="data-[state=checked]:bg-[#09261E]"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Deal Updates
                          </label>
                          <p className="text-xs text-gray-500">
                            Receive email notifications about your deal activity
                          </p>
                        </div>
                        <Switch
                          id="dealUpdates"
                          className="data-[state=checked]:bg-[#09261E]"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Market Reports
                          </label>
                          <p className="text-xs text-gray-500">
                            Receive weekly market reports for your selected areas
                          </p>
                        </div>
                        <Switch
                          id="marketReports"
                          className="data-[state=checked]:bg-[#09261E]"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">In-App Notifications</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Messages
                          </label>
                          <p className="text-xs text-gray-500">
                            Receive notifications when you get new messages
                          </p>
                        </div>
                        <Switch
                          id="messageNotifications"
                          className="data-[state=checked]:bg-[#09261E]"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Property Inquiries
                          </label>
                          <p className="text-xs text-gray-500">
                            Receive notifications when someone inquires about your property
                          </p>
                        </div>
                        <Switch
                          id="inquiryNotifications"
                          className="data-[state=checked]:bg-[#09261E]"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Notification Frequency</h3>
                    
                    <div>
                      <Select defaultValue="daily">
                        <SelectTrigger className="w-full md:w-80 border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instant">Instant</SelectItem>
                          <SelectItem value="daily">Daily Digest</SelectItem>
                          <SelectItem value="weekly">Weekly Digest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="pt-6 flex justify-end border-t">
                    <Button 
                      className="bg-[#09261E] hover:bg-[#09261E]/90 text-white"
                    >
                      Save Notification Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "help" && (
              <>
                <div className="border-b pb-4 mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
                  <p className="text-gray-500 mt-1">Get the support you need with our help resources, submit feedback, or report issues with the platform.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* FAQ Card - Entire card is clickable */}
                  <a 
                    href="/help/faq" 
                    target="_blank" 
                    className="block cursor-pointer group"
                  >
                    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full hover:bg-gray-50/80">
                      <CardContent className="pt-6 px-6 pb-6 flex flex-col items-start h-full">
                        <div className="p-3 rounded-full bg-gray-100 mb-4 group-hover:bg-gray-200 transition-colors">
                          <HelpCircle className="h-6 w-6 text-[#09261E]" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-[#09261E] transition-colors">Frequently Asked Questions</h3>
                        <p className="text-gray-600 text-sm mb-6 flex-grow">
                          Find answers to common questions about buying, selling, and investing in real estate.
                        </p>
                        <div className="mt-auto flex items-center text-sm font-medium text-gray-600 group-hover:text-[#09261E] transition-colors">
                          Visit page <ArrowRight className="h-4 w-4 ml-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </a>

                  {/* Suggestions Card - Entire card is clickable */}
                  <a 
                    href="/help/suggestions" 
                    target="_blank" 
                    className="block cursor-pointer group"
                  >
                    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full hover:bg-gray-50/80">
                      <CardContent className="pt-6 px-6 pb-6 flex flex-col items-start h-full">
                        <div className="p-3 rounded-full bg-gray-100 mb-4 group-hover:bg-gray-200 transition-colors">
                          <MessageSquare className="h-6 w-6 text-[#09261E]" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-[#09261E] transition-colors">Suggestions</h3>
                        <p className="text-gray-600 text-sm mb-6 flex-grow">
                          Submit your ideas for new features or improvements to the PropertyDeals platform.
                        </p>
                        <div className="mt-auto flex items-center text-sm font-medium text-gray-600 group-hover:text-[#09261E] transition-colors">
                          Visit page <ArrowRight className="h-4 w-4 ml-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </a>

                  {/* Report a Problem Card - Entire card is clickable with red hover */}
                  <a 
                    href="/help/report" 
                    target="_blank" 
                    className="block cursor-pointer group"
                  >
                    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full hover:bg-red-50/50">
                      <CardContent className="pt-6 px-6 pb-6 flex flex-col items-start h-full">
                        <div className="p-3 rounded-full bg-gray-100 mb-4 group-hover:bg-red-100/70 transition-colors">
                          <AlertTriangle className="h-6 w-6 text-[#09261E] group-hover:text-red-600 transition-colors" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-red-600 transition-colors">Report a Problem</h3>
                        <p className="text-gray-600 text-sm mb-6 flex-grow">
                          Encountered an issue? Let us know so we can fix it as quickly as possible.
                        </p>
                        <div className="mt-auto flex items-center text-sm font-medium text-gray-600 group-hover:text-red-600 transition-colors">
                          Visit page <ArrowRight className="h-4 w-4 ml-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </div>

                {/* Can't find what you're looking for section - Green hover */}
                <Card className="border border-gray-200 shadow-sm bg-gray-50/80 mb-6 hover:bg-green-50/50 transition-colors">
                  <CardContent className="pt-6 px-6 pb-6">
                    <h3 className="text-lg font-semibold mb-3">Can't find what you're looking for?</h3>
                    <p className="text-gray-600 text-sm mb-6">
                      Our support team is here to help you with any questions or concerns that aren't addressed in our help resources.
                    </p>
                    
                    <div className="bg-white p-5 rounded-md border border-gray-200">
                      <h4 className="font-medium text-sm mb-2">Contact Support</h4>
                      <p className="text-gray-500 text-sm mb-4">Business hours: Monday to Friday, 9 AM - 5 PM ET</p>
                      <div className="flex flex-wrap gap-3">
                        <Button 
                          className="bg-[#09261E] hover:bg-gray-700 text-white font-medium"
                          onClick={() => window.open('/help/contact', '_blank')}
                        >
                          Contact Us
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-gray-300 hover:bg-gray-100 hover:text-gray-800"
                          onClick={() => window.open('mailto:support@propertydeals.com')}
                        >
                          Email Support
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === "connected" && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="text-xl">Connected Accounts</CardTitle>
                  <CardDescription>Manage your connected third-party services and applications</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Authentication Providers</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                        <div className="flex items-center">
                          <div className="bg-[#4285F4] h-10 w-10 rounded flex items-center justify-center">
                            <span className="text-white font-bold">G</span>
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900">Google</h4>
                            <p className="text-xs text-gray-500">Not connected</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Connect
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                        <div className="flex items-center">
                          <div className="bg-[#1877F2] h-10 w-10 rounded flex items-center justify-center">
                            <span className="text-white font-bold">F</span>
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900">Facebook</h4>
                            <p className="text-xs text-gray-500">Not connected</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Connect
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">API Access</h3>
                    
                    <div className="rounded-md border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">API Key</h4>
                          <p className="text-xs text-gray-500">Use this key to access PropertyDeals API</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Generate API Key
                        </Button>
                      </div>
                      
                      <div className="text-sm text-gray-500 italic">
                        No API key generated yet
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "memberships" && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="text-xl">Memberships & Billing</CardTitle>
                  <CardDescription>Manage your subscription and payment information</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Current Plan</h3>
                    
                    <div className="rounded-md border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">Free Plan</h4>
                          <p className="text-sm text-gray-500">Basic access to PropertyDeals</p>
                        </div>
                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Current Plan</Badge>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Includes:</h5>
                        <ul className="space-y-1">
                          <li className="flex items-center text-sm text-gray-600">
                            <Check size={16} className="mr-2 text-green-500" />
                            Browse properties
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <Check size={16} className="mr-2 text-green-500" />
                            Basic calculator tools
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <Check size={16} className="mr-2 text-green-500" />
                            Limited property inquiries
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Available Plans</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-md border border-gray-200 p-4">
                        <h4 className="text-lg font-medium text-gray-900">Pro Investor</h4>
                        <p className="text-sm text-gray-500 mb-1">For serious real estate investors</p>
                        <p className="text-xl font-bold text-[#09261E] mb-4">$29<span className="text-sm font-normal text-gray-500">/month</span></p>
                        
                        <ul className="space-y-1 mb-4">
                          <li className="flex items-center text-sm text-gray-600">
                            <Check size={16} className="mr-2 text-green-500" />
                            Everything in Free
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <Check size={16} className="mr-2 text-green-500" />
                            Advanced calculator tools
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <Check size={16} className="mr-2 text-green-500" />
                            Unlimited property inquiries
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <Check size={16} className="mr-2 text-green-500" />
                            Priority access to new deals
                          </li>
                        </ul>
                        
                        <Button className="w-full bg-[#09261E] hover:bg-[#09261E]/90 text-white">
                          Upgrade to Pro
                        </Button>
                      </div>
                      
                      <div className="rounded-md border border-gray-200 p-4">
                        <h4 className="text-lg font-medium text-gray-900">REP Elite</h4>
                        <p className="text-sm text-gray-500 mb-1">For real estate professionals</p>
                        <p className="text-xl font-bold text-[#803344] mb-4">$49<span className="text-sm font-normal text-gray-500">/month</span></p>
                        
                        <ul className="space-y-1 mb-4">
                          <li className="flex items-center text-sm text-gray-600">
                            <Check size={16} className="mr-2 text-green-500" />
                            Everything in Pro
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <Check size={16} className="mr-2 text-green-500" />
                            Featured REP profile
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <Check size={16} className="mr-2 text-green-500" />
                            Deal collaboration tools
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <Check size={16} className="mr-2 text-green-500" />
                            REP Room access
                          </li>
                        </ul>
                        
                        <Button className="w-full bg-[#803344] hover:bg-[#803344]/90 text-white">
                          Upgrade to Elite
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}