import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import styles from "./profile-page.module.css";

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

// Icons
import {
  UserCircle, Shield, CreditCard, AlertTriangle, 
  LogOut, ExternalLink, Upload, Check, Info, 
  Briefcase, MapPin, Building, Clock, Hash, ChevronRight,
  DollarSign, Smile, FileText, User, Calendar, Star, Home,
  FileBadge, Download, Award, Search, Users, Wrench, Heart,
  Wallet, PenTool, BookLock, BookCheck, Landmark, PiggyBank,
  Map, Settings as SettingsIcon, ArrowUpRight, ChevronsDown, Save, Globe,
  Facebook as FacebookIcon, Instagram, Linkedin, Target, Bell, HelpCircle
} from "lucide-react";

// Profile MenuItem component
const ProfileMenuItem = ({ 
  icon, 
  label, 
  href, 
  active = false,
  danger = false,
  onClick
}: { 
  icon: React.ReactNode; 
  label: string; 
  href?: string; 
  active?: boolean;
  danger?: boolean;
  onClick?: () => void;
}) => {
  return (
    <a 
      href={href}
      onClick={onClick}
      className={`flex items-center px-4 py-2.5 text-sm rounded-md transition-all duration-200 ${
        danger ? 'text-red-500' : 'text-gray-700'
      } ${
        active 
          ? danger 
            ? 'bg-red-50/70 text-red-600 font-medium shadow-sm' 
            : 'bg-[#09261E]/10 text-[#09261E] font-medium shadow-sm' 
          : danger
            ? 'hover:bg-red-50/80 hover:text-red-600'
            : 'hover:bg-gray-100/80 hover:text-gray-900'
      } w-full`}
    >
      <span className={`mr-3 ${danger ? 'text-red-500/80' : 'text-gray-500'}`}>{icon}</span>
      <span>{label}</span>
      {active && <ChevronRight size={16} className="ml-auto" />}
    </a>
  );
};

// ProfileData type definition for TypeScript
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
  [key: string]: any; // Index signature for dynamic access
}

// Options for various selections
const buyerTypeOptions = [
  "Individual Investor", "Real Estate Agent", "Developer", "Home Buyer", "Wholesaler", "Fix & Flipper", "Corporate Buyer"
];

const marketOptions = [
  "Austin, TX", "Nashville, TN", "Phoenix, AZ", "Tampa, FL", "Indianapolis, IN", 
  "Columbus, OH", "Charlotte, NC", "Denver, CO", "Atlanta, GA", "Dallas, TX"
];

const propertyTypeOptions = [
  "Single Family", "Multi-Family", "Condo/Townhouse", "Commercial", "Industrial",
  "Farm/Agricultural", "Land", "Mobile Home", "Mixed Use"
];

const propertyConditionOptions = [
  "Ready to move in", "Minor repairs needed", "Major renovation needed", "Fixer-upper", "Teardown/Rebuild"
];

const financingMethodOptions = [
  "Cash", "Conventional Loan", "Hard Money", "Private Money", "HELOC", "Subject To", "Creative Financing", "1031 Exchange"
];

const closingTimelineOptions = [
  "Less than 7 days", "7-14 days", "15-30 days", "30-60 days", "Flexible"
];

// Main profile page component
export default function ProfilePage() {
  const { user, supabaseUser, logoutMutation } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();
  
  // Keep track of which section is being edited
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [usernameMessage, setUsernameMessage] = useState("");

  // Refs for the file inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const proofFileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  
  // Track if each form section has been modified
  const [isProfileSectionModified, setIsProfileSectionModified] = useState(false);
  const [isPropertySectionModified, setIsPropertySectionModified] = useState(false);
  const [isProfessionalSectionModified, setIsProfessionalSectionModified] = useState(false);
  
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
    
    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      toast({
        title: "Invalid file",
        description: "Please upload a valid image file (JPEG, PNG, GIF, or WEBP)",
        variant: "destructive"
      });
      return;
    }
    
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${supabaseUser.id}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    try {
      setLoading(true);
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage.from('public').getPublicUrl(filePath);
      
      if (!data.publicUrl) {
        throw new Error("Failed to get public URL for uploaded image");
      }
      
      // Update profile data with new avatar URL
      setProfileData({
        ...profileData,
        profile_photo_url: data.publicUrl
      });
      
      // Also update database immediately
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_photo_url: data.publicUrl })
        .eq('id', supabaseUser.id);
      
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "Success",
        description: "Profile photo updated successfully",
        variant: "default"
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

  // Handle banner image upload
  const handleBannerImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    
    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      toast({
        title: "Invalid file",
        description: "Please upload a valid image file (JPEG, PNG, GIF, or WEBP)",
        variant: "destructive"
      });
      return;
    }
    
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${supabaseUser.id}-banner-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `banners/${fileName}`;
    
    try {
      setLoading(true);
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage.from('public').getPublicUrl(filePath);
      
      if (!data.publicUrl) {
        throw new Error("Failed to get public URL for uploaded image");
      }
      
      // Update profile data with new banner URL
      setProfileData({
        ...profileData,
        profile_banner_url: data.publicUrl
      });
      
      // Also update database immediately
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_banner_url: data.publicUrl })
        .eq('id', supabaseUser.id);
      
      if (updateError) {
        throw updateError;
      }
      
      setIsProfileSectionModified(true);
      
      toast({
        title: "Success",
        description: "Banner image updated successfully",
        variant: "default"
      });
    } catch (error) {
      console.error("Error uploading banner image:", error);
      toast({
        title: "Error",
        description: "Failed to upload banner image. Please try again.",
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
        title: "Invalid file",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
      return;
    }
    
    // Create a unique filename
    const fileName = `${supabaseUser.id}-proof-${Date.now()}-${Math.random().toString(36).substring(2)}.pdf`;
    const filePath = `proof_of_funds/${fileName}`;
    
    try {
      setLoading(true);
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'application/pdf'
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage.from('public').getPublicUrl(filePath);
      
      if (!data.publicUrl) {
        throw new Error("Failed to get public URL for uploaded document");
      }
      
      // Update profile data with new proof URL
      setProfileData({
        ...profileData,
        proof_of_funds_url: data.publicUrl,
        // Set to false since it needs to be verified
        proof_of_funds_verified: false
      });
      
      // Also update database immediately
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          proof_of_funds_url: data.publicUrl,
          proof_of_funds_verified: false
        })
        .eq('id', supabaseUser.id);
      
      if (updateError) {
        throw updateError;
      }
      
      setIsPropertySectionModified(true);
      
      toast({
        title: "Success",
        description: "Proof of funds uploaded successfully. It will be reviewed by our team.",
        variant: "default"
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: 'profile' | 'property' | 'professional'): void => {
    const { name, value } = e.target;
    
    setProfileData({
      ...profileData,
      [name]: value
    });
    
    // Set the appropriate modification flag based on the section
    if (section === 'profile') setIsProfileSectionModified(true);
    if (section === 'property') setIsPropertySectionModified(true);
    if (section === 'professional') setIsProfessionalSectionModified(true);
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string, section: 'profile' | 'property' | 'professional'): void => {
    setProfileData({
      ...profileData,
      [name]: value
    });
    
    // Set the appropriate modification flag based on the section
    if (section === 'profile') setIsProfileSectionModified(true);
    if (section === 'property') setIsPropertySectionModified(true);
    if (section === 'professional') setIsProfessionalSectionModified(true);
  };

  // Handle multi-select changes (add or remove value)
  const handleMultiSelectChange = (name: string, value: string, section: 'profile' | 'property' | 'professional'): void => {
    const currentValues = profileData[name as keyof ProfileData] as string[] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    setProfileData({
      ...profileData,
      [name]: newValues
    });
    
    // Set the appropriate modification flag based on the section
    if (section === 'profile') setIsProfileSectionModified(true);
    if (section === 'property') setIsPropertySectionModified(true);
    if (section === 'professional') setIsProfessionalSectionModified(true);
  };

  // Handle profile section form submission
  const handleProfileSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isProfileSectionModified) return;
    
    // Validate username
    if (!isUsernameAvailable && profileData.username !== user?.username) {
      toast({
        title: "Error",
        description: "Username is already taken. Please choose another one.",
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
          username: profileData.username,
          phone: profileData.phone,
          bio: profileData.bio,
          in_real_estate_since: profileData.in_real_estate_since,
          business_name: profileData.business_name,
          type_of_buyer: profileData.type_of_buyer,
          website: profileData.website,
          instagram: profileData.instagram,
          facebook: profileData.facebook,
          linkedin: profileData.linkedin,
        })
        .eq('id', supabaseUser.id);
      
      if (error) {
        throw error;
      }
      
      setIsProfileSectionModified(false);
      
      toast({
        title: "Success",
        description: "Profile information updated successfully",
        variant: "default"
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
  const handlePropertySectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPropertySectionModified) return;
    
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
          current_portfolio_count: profileData.current_portfolio_count
        })
        .eq('id', supabaseUser.id);
      
      if (error) {
        throw error;
      }
      
      setIsPropertySectionModified(false);
      
      toast({
        title: "Success",
        description: "Property preferences updated successfully",
        variant: "default"
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
  const handleProfessionalSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isProfessionalSectionModified) return;
    
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
      
      if (error) {
        throw error;
      }
      
      setIsProfessionalSectionModified(false);
      
      toast({
        title: "Success",
        description: "Professional preferences updated successfully",
        variant: "default"
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

  // Format date string to readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    // Basic fields (weight: 40%)
    const basicFields = [
      profileData.full_name, 
      profileData.username, 
      profileData.email,
      profileData.profile_photo_url,
      profileData.bio
    ];
    
    const basicFieldsCompleted = basicFields.filter(Boolean).length;
    const basicScore = (basicFieldsCompleted / basicFields.length) * 40;
    
    // Property preferences (weight: 30%)
    const propertyFields = [
      profileData.location,
      profileData.markets.length > 0,
      profileData.property_types.length > 0,
      profileData.ideal_budget_min,
      profileData.ideal_budget_max,
      profileData.financing_methods.length > 0
    ];
    
    const propertyFieldsCompleted = propertyFields.filter(Boolean).length;
    const propertyScore = (propertyFieldsCompleted / propertyFields.length) * 30;
    
    // Deal history (weight: 30%)
    const dealFields = [
      profileData.number_of_deals_last_12_months,
      profileData.goal_deals_next_12_months,
      profileData.total_deals_done,
      profileData.current_portfolio_count
    ];
    
    const dealFieldsCompleted = dealFields.filter(Boolean).length;
    const dealScore = (dealFieldsCompleted / dealFields.length) * 30;
    
    // Total score (0-100)
    return Math.round(basicScore + propertyScore + dealScore);
  };
  
  // Effect to update profile completion score
  useEffect(() => {
    const score = calculateProfileCompletion();
    
    // Update local state
    setProfileData(prev => ({
      ...prev,
      profile_completion_score: score
    }));
    
    // Only update in database periodically to avoid too many requests
    const timer = setTimeout(async () => {
      if (supabaseUser?.id) {
        await supabase
          .from('profiles')
          .update({ profile_completion_score: score })
          .eq('id', supabaseUser.id);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [profileData.full_name, profileData.username, profileData.email, 
      profileData.bio, profileData.profile_photo_url, profileData.location,
      profileData.markets, profileData.property_types, profileData.financing_methods,
      profileData.ideal_budget_min, profileData.ideal_budget_max,
      profileData.number_of_deals_last_12_months, profileData.goal_deals_next_12_months,
      profileData.total_deals_done, profileData.current_portfolio_count]);

  return (
    <div className={`flex bg-white min-h-screen ${styles.profile_page_container}`}>
      {/* Main app sidebar - Fixed */}
      <div className="w-[70px] border-r fixed left-0 top-0 bottom-0 flex flex-col bg-white shadow-sm h-screen z-20">
        {/* Main app logo */}
        <div className="flex justify-center py-5">
          <div className="w-10 h-10 flex items-center justify-center">
            <span className="text-[#09261E] font-bold text-xl">PD</span>
          </div>
        </div>
        
        {/* Main navigation icons */}
        <div className="flex-1 flex flex-col items-center py-0 space-y-8">
          <div className="flex flex-col space-y-6 pt-6">
            <a href="/dashboard" className="text-gray-500 hover:text-[#09261E] transition-colors flex justify-center">
              <Home className="w-6 h-6" />
            </a>
            <a href="/properties" className="text-gray-500 hover:text-[#09261E] transition-colors flex justify-center">
              <Building className="w-6 h-6" />
            </a>
            <a href="/messages" className="text-gray-500 hover:text-[#09261E] transition-colors flex justify-center">
              <FacebookIcon className="w-6 h-6" /> {/* Using as message icon temporarily */}
            </a>
            <a href="/calendar" className="text-gray-500 hover:text-[#09261E] transition-colors flex justify-center">
              <Calendar className="w-6 h-6" />
            </a>
            <a href="/tools" className="text-gray-500 hover:text-[#09261E] transition-colors flex justify-center">
              <Wrench className="w-6 h-6" />
            </a>
          </div>
        </div>
        
        {/* Bottom user avatar */}
        <div className="pb-6 flex justify-center">
          <a href="/profile">
            <Avatar className="h-9 w-9 ring-2 ring-offset-2 ring-[#09261E]/50 hover:ring-[#09261E] transition-all">
              <AvatarImage src={profileData.profile_photo_url || ""} alt={profileData.full_name || "User"} />
              <AvatarFallback className="bg-[#09261E] text-white text-sm">
                {profileData.full_name?.charAt(0) || profileData.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </a>
        </div>
      </div>
      
      {/* Settings sidebar - Positioned next to main sidebar */}
      <div className="w-[250px] border-r fixed left-[70px] top-0 bottom-0 flex flex-col bg-white shadow-sm h-screen z-10">
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
        <div className="px-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {/* Menu Items */}
          <div className="py-2 space-y-1">
            <button
              className="w-full flex items-center px-4 py-2.5 text-left rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#09261E]/50 bg-[#09261E]/10 text-[#09261E] font-medium shadow-sm"
            >
              <UserCircle size={18} className="mr-3 text-[#09261E]" />
              <span>Account</span>
            </button>
            
            <ProfileMenuItem
              icon={<Shield size={18} />}
              label="Security & Privacy"
              href="/profile/security"
              active={location === "/profile/security"}
            />
            
            <ProfileMenuItem
              icon={<CreditCard size={18} />}
              label="Payment Methods"
              href="/profile/payment"
              active={location === "/profile/payment"}
            />
            
            <ProfileMenuItem
              icon={<Bell size={18} />}
              label="Notifications"
              href="/profile/notifications"
              active={location === "/profile/notifications"}
            />
            
            <ProfileMenuItem
              icon={<HelpCircle size={18} />}
              label="Help Center"
              href="/profile/help"
              active={location === "/profile/help"}
            />
          </div>
        </div>
        
        {/* User info and Logout - Sticky bottom */}
        <div className="px-3 py-3 border-t sticky bottom-0 bg-white mt-auto">
          <div className="flex items-center px-4 py-2 mb-2">
            <Avatar className="h-8 w-8 mr-3">
              <AvatarImage src={profileData.profile_photo_url || ""} alt={profileData.full_name || "User"} />
              <AvatarFallback className="bg-[#09261E] text-white text-sm font-medium">
                {profileData.full_name?.charAt(0) || profileData.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium truncate">{profileData.full_name || profileData.username}</p>
              <p className="text-xs text-gray-500 truncate">@{profileData.username}</p>
            </div>
          </div>
          
          <ProfileMenuItem
            icon={<LogOut size={18} />}
            label="Log out"
            danger={true}
            onClick={handleLogout}
          />
        </div>
      </div>
      
      {/* Right content area - No margin-left */}
      <div className="flex-1 bg-gray-50/60 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
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
                
                {/* Professional Info */}
                <div className="space-y-4 mb-8 pt-6 border-t">
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Professional Information</h3>
                  
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
                            checked={profileData.type_of_buyer.includes(option)}
                            onCheckedChange={(checked) => {
                              if (checked) {
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
                
                {/* Profile Uploads Section */}
                <div className="space-y-4 mb-8 pt-6 border-t">
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Profile Uploads</h3>
                  
                  {/* Profile Picture */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-gray-700">Profile Picture</h4>
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-24 w-24 rounded-md ring-2 ring-offset-2 ring-[#09261E]/20">
                          <AvatarImage src={profileData.profile_photo_url || ""} alt={profileData.full_name} />
                          <AvatarFallback className="bg-[#09261E] text-white text-lg font-medium">
                            {profileData.full_name?.charAt(0) || profileData.username?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500">Upload a square image for your profile picture. This will be visible on your profile and across the platform.</p>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            className="text-xs"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            {profileData.profile_photo_url ? 'Replace Photo' : 'Upload Photo'}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Banner Image */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-gray-700">Banner Image</h4>
                      <div className="space-y-3">
                        {profileData.profile_banner_url ? (
                          <div className="relative rounded-md overflow-hidden h-24 bg-gray-100">
                            <img 
                              src={profileData.profile_banner_url} 
                              alt="Profile Banner" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button 
                                type="button" 
                                variant="secondary" 
                                size="sm"
                                className="text-xs"
                                onClick={() => bannerInputRef.current?.click()}
                              >
                                <Upload className="h-3 w-3 mr-1" />
                                Replace Banner
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-md h-24 flex items-center justify-center bg-gray-50">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              className="text-xs"
                              onClick={() => bannerInputRef.current?.click()}
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              Upload Banner Image
                            </Button>
                          </div>
                        )}
                        <p className="text-xs text-gray-500">Recommended dimensions: 1200x300px. This banner will appear at the top of your public profile page.</p>
                      </div>
                      
                      <input 
                        ref={bannerInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBannerImageChange}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Profile Stats */}
                <div className="pt-6 border-t">
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider mb-4">Profile Stats</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Member Since</p>
                      <p className="font-medium">{formatDate(profileData.created_at)}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">User #</p>
                      <p className="font-medium">{profileData.join_number || "N/A"}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Profile Completion</p>
                      <div className="flex items-center mt-1">
                        <div className="h-2 bg-gray-200 rounded-full w-full mr-2">
                          <div 
                            className="h-2 bg-[#09261E] rounded-full"
                            style={{ width: `${profileData.profile_completion_score}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{profileData.profile_completion_score}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-[#09261E] hover:bg-[#09261E]/90 text-white"
                    disabled={loading || !isProfileSectionModified}
                  >
                    {loading ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Property Preferences */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-xl">Property Preferences</CardTitle>
              <CardDescription>Let us know what kind of properties you're looking for</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <form onSubmit={handlePropertySectionSubmit}>
                {/* Location Section */}
                <div className="space-y-4 mb-8">
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Location</h3>
                  
                  <div>
                    <label className="flex items-center text-sm font-medium mb-2 text-gray-700" htmlFor="location">
                      <MapPin className="mr-2 h-4 w-4" />
                      Primary Location
                    </label>
                    <Input 
                      id="location"
                      name="location"
                      value={profileData.location || ""}
                      onChange={(e) => handleInputChange(e, 'property')}
                      className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                      placeholder="City, State"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-sm font-medium mb-2 text-gray-700">
                      <Map className="mr-2 h-4 w-4" />
                      Target Markets
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {marketOptions.map((market) => (
                        <button
                          key={market}
                          type="button"
                          onClick={() => handleMultiSelectChange('markets', market, 'property')}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            profileData.markets.includes(market)
                              ? 'bg-[#09261E] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {market}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Property Types Section */}
                <div className="space-y-4 mb-8 pt-6 border-t">
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Property Types & Conditions</h3>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700">
                      Property Types
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {propertyTypeOptions.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleMultiSelectChange('property_types', type, 'property')}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            profileData.property_types.includes(type)
                              ? 'bg-[#09261E] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700">
                      Property Conditions
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {propertyConditionOptions.map((condition) => (
                        <button
                          key={condition}
                          type="button"
                          onClick={() => handleMultiSelectChange('property_conditions', condition, 'property')}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            profileData.property_conditions.includes(condition)
                              ? 'bg-[#09261E] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {condition}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Budget & Financing Section */}
                <div className="space-y-4 mb-8 pt-6 border-t">
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Budget & Financing</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center text-sm font-medium mb-2 text-gray-700" htmlFor="ideal_budget_min">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Budget Minimum
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
                      <label className="flex items-center text-sm font-medium mb-2 text-gray-700" htmlFor="ideal_budget_max">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Budget Maximum
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
                    <div className="flex flex-wrap gap-2 mt-1">
                      {financingMethodOptions.map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => handleMultiSelectChange('financing_methods', method, 'property')}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            profileData.financing_methods.includes(method)
                              ? 'bg-[#09261E] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center text-sm font-medium mb-2 text-gray-700" htmlFor="preferred_financing_method">
                        <Wallet className="mr-2 h-4 w-4" />
                        Preferred Financing Method
                      </label>
                      <Select
                        value={profileData.preferred_financing_method || ""}
                        onValueChange={(value) => handleSelectChange('preferred_financing_method', value, 'property')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your preferred method" />
                        </SelectTrigger>
                        <SelectContent>
                          {financingMethodOptions.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="flex items-center text-sm font-medium mb-2 text-gray-700" htmlFor="closing_timeline">
                        <Clock className="mr-2 h-4 w-4" />
                        Closing Timeline
                      </label>
                      <Select
                        value={profileData.closing_timeline || ""}
                        onValueChange={(value) => handleSelectChange('closing_timeline', value, 'property')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          {closingTimelineOptions.map((timeline) => (
                            <SelectItem key={timeline} value={timeline}>
                              {timeline}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Deal History Section */}
                <div className="space-y-4 mb-8 pt-6 border-t">
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Deal History</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center text-sm font-medium mb-2 text-gray-700" htmlFor="number_of_deals_last_12_months">
                        <Hash className="mr-2 h-4 w-4" />
                        Deals in Last 12 Months
                      </label>
                      <Input 
                        id="number_of_deals_last_12_months"
                        name="number_of_deals_last_12_months"
                        type="number"
                        min="0"
                        value={profileData.number_of_deals_last_12_months || ""}
                        onChange={(e) => handleInputChange(e, 'property')}
                        className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                        placeholder="#"
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center text-sm font-medium mb-2 text-gray-700" htmlFor="goal_deals_next_12_months">
                        <Target className="mr-2 h-4 w-4" />
                        Goal for Next 12 Months
                      </label>
                      <Input 
                        id="goal_deals_next_12_months"
                        name="goal_deals_next_12_months"
                        type="number"
                        min="0"
                        value={profileData.goal_deals_next_12_months || ""}
                        onChange={(e) => handleInputChange(e, 'property')}
                        className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                        placeholder="#"
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center text-sm font-medium mb-2 text-gray-700" htmlFor="total_deals_done">
                        <FileText className="mr-2 h-4 w-4" />
                        Total Deals Done
                      </label>
                      <Input 
                        id="total_deals_done"
                        name="total_deals_done"
                        type="number"
                        min="0"
                        value={profileData.total_deals_done || ""}
                        onChange={(e) => handleInputChange(e, 'property')}
                        className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                        placeholder="#"
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center text-sm font-medium mb-2 text-gray-700" htmlFor="current_portfolio_count">
                        <Home className="mr-2 h-4 w-4" />
                        Properties Currently Owned
                      </label>
                      <Input 
                        id="current_portfolio_count"
                        name="current_portfolio_count"
                        type="number"
                        min="0"
                        value={profileData.current_portfolio_count || ""}
                        onChange={(e) => handleInputChange(e, 'property')}
                        className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                        placeholder="#"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Verification Section */}
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Verification</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start mb-4">
                      <div className="flex-shrink-0 mt-0.5">
                        <FileBadge className="h-5 w-5 text-[#09261E]" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">Buyer Verification Tag</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Your verification status helps sellers trust your offers
                        </p>
                        <div className="mt-2">
                          {profileData.buyer_verification_tag ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-2 py-0.5 text-xs">
                              {profileData.buyer_verification_tag}
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 px-2 py-0.5 text-xs">
                              Not Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <FileText className="h-5 w-5 text-[#09261E]" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">Proof of Funds</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Upload a PDF document showing your proof of funds
                        </p>
                        <div className="mt-2 flex items-center">
                          {profileData.proof_of_funds_url ? (
                            <>
                              <a 
                                href={profileData.proof_of_funds_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-[#09261E] font-medium mr-3 flex items-center hover:underline"
                              >
                                <Download size={14} className="mr-1" />
                                View Document
                              </a>
                              {profileData.proof_of_funds_verified ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-2 py-0.5 text-xs">
                                  Verified
                                </Badge>
                              ) : (
                                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 px-2 py-0.5 text-xs">
                                  Pending Verification
                                </Badge>
                              )}
                            </>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => proofFileInputRef.current?.click()}
                            >
                              <Upload size={14} className="mr-1" />
                              Upload PDF
                            </Button>
                          )}
                          <input 
                            ref={proofFileInputRef}
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={handleProofOfFundsChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 flex justify-end">
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
          
          {/* Professionals Section */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-xl">Professionals</CardTitle>
              <CardDescription>Manage your preferred professionals for real estate transactions</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <form onSubmit={handleProfessionalSectionSubmit}>
                {/* Preferred Inspectors */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Preferred Inspectors</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={16} className="text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-xs">Add your preferred inspectors. These will be suggested when making offers.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-500 text-sm text-center py-4">
                      Coming soon! You'll be able to add your preferred inspectors here.
                    </p>
                  </div>
                </div>
                
                {/* Preferred Agents */}
                <div className="space-y-4 mb-8 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Preferred Agents</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={16} className="text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-xs">Add agents you've worked with before and trust.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-500 text-sm text-center py-4">
                      Coming soon! You'll be able to add your preferred agents here.
                    </p>
                  </div>
                </div>
                
                {/* Preferred Contractors */}
                <div className="space-y-4 mb-8 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Preferred Contractors</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={16} className="text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-xs">Add contractors you've worked with on renovations or repairs.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-500 text-sm text-center py-4">
                      Coming soon! You'll be able to add your preferred contractors here.
                    </p>
                  </div>
                </div>
                
                {/* Preferred Lenders */}
                <div className="space-y-4 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Preferred Lenders</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={16} className="text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-xs">Add lenders you work with for financing your deals.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-500 text-sm text-center py-4">
                      Coming soon! You'll be able to add your preferred lenders here.
                    </p>
                  </div>
                </div>
                
                <div className="pt-6 flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-[#09261E] hover:bg-[#09261E]/90 text-white"
                    disabled={loading || !isProfessionalSectionModified}
                  >
                    {loading ? "Saving..." : "Save Professional Preferences"}
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