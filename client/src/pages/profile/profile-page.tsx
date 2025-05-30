import React, { useState, useRef, useEffect, useMemo } from "react";
import { useLocation, useParams, Link } from "wouter";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { navigateToHelpSection, navigateToProfileTab, getCurrentHelpSection } from "@/lib/navigation";
import styles from "./profile-page.module.css";
import ConnectionsTab from "./connections-tab";
import MobileSettingsMenu from "@/components/profile/mobile-settings-menu";
import MobileSettingsSection from "@/components/profile/mobile-settings-section";
import { 
  getBuyerProfile, 
  upsertBuyerProfile, 
  isUsernameAvailable, 
  uploadProfilePhoto, 
  uploadBannerImage, 
  uploadProofOfFunds,
  type BuyerProfile 
} from "@/lib/buyer-profile";

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
  Search,
  CircleUserRound,
} from "lucide-react";

// Third-party icons - we use these directly for specialized icons
import { Instagram, Linkedin, Facebook as FacebookIcon, Info } from "lucide-react";

// Icon component for social media and other special icons
const Icon = ({ icon, className = "" }: { icon: string; className?: string }) => {
  switch (icon) {
    case "instagram":
      return <Instagram className={className} />;
    case "linkedIn":
      return <Linkedin className={className} />;
    case "facebook":
      return <FacebookIcon className={className} />;
    default:
      return <Globe className={className} />;
  }
};

// Import the Help Center components
import { HelpFAQ, HelpSuggestions, HelpReport } from "@/components/help";

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
  past_properties: string[];
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

function ProfilePage() {
  // Get the current route for active menu tracking
  const [location] = useLocation();
  const { toast } = useToast();
  const { user, logoutMutation, isLoading: authLoading } = useAuth();
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
    const validTabs = ["account", "property_preferences", "connections", "notifications", "integrations", "connected", "memberships", "security", "help"];
    
    // Check hash-based routing first (#help, #account, etc.)
    if (location.includes('#')) {
      const hash = location.split('#')[1];
      if (validTabs.includes(hash)) return hash;
    }
    
    // Then check path-based routing (/profile/help, etc.)
    const pathSegments = location.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (validTabs.includes(lastSegment)) return lastSegment;
    
    // Map legacy tab names to new ones
    if (lastSegment === 'connected') return 'integrations';
    
    return "account"; // Default tab
  }, [location]);
  
  // Track active settings tab and help section
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeHelpSection, setActiveHelpSection] = useState<string>('main');
  
  // For the Connections tab
  const [activeConnectionsTab, setActiveConnectionsTab] = useState<'my_connections' | 'find_connections'>('my_connections');
  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = useState(false);
  const [connectionsSearchQuery, setConnectionsSearchQuery] = useState('');
  
  // Dummy data for connections - in a real app, this would come from an API
  const [myConnections, setMyConnections] = useState([
    { id: 1, name: "Jane Smith", type: "Agent", avatar: "", location: "Milwaukee, WI", mutualCount: 3 },
    { id: 2, name: "John Davis", type: "Seller", avatar: "", location: "Madison, WI", mutualCount: 1 },
    { id: 3, name: "Alice Johnson", type: "Contractor", avatar: "", location: "Chicago, IL", mutualCount: 0 },
    { id: 4, name: "Mike Wilson", type: "Buyer", avatar: "", location: "Green Bay, WI", mutualCount: 2 },
    { id: 5, name: "Sarah Brown", type: "Lender", avatar: "", location: "Milwaukee, WI", mutualCount: 5 },
    { id: 6, name: "David Lee", type: "Inspector", avatar: "", location: "Madison, WI", mutualCount: 0 },
  ]);
  
  // Handle tab change without full page reload
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Use our navigation utility to update URL without page reload
    navigateToProfileTab(tab);
    
    // Reset help section when switching tabs
    if (tab === 'help') {
      setActiveHelpSection('main');
    }
  };
  
  // Listen for path changes and update UI accordingly
  useEffect(() => {
    const handlePathChanged = () => {
      // Update active tab based on current URL
      const path = window.location.pathname;
      const pathSegments = path.split('/');
      const lastSegment = pathSegments[pathSegments.length - 1];
      const validTabs = ["account", "property_preferences", "connections", "notifications", "integrations", "memberships", "security", "help"];
      
      if (validTabs.includes(lastSegment)) {
        setActiveTab(lastSegment);
      }
    };
    
    // Handle custom navigation events
    const handleProfileTabChanged = (e: CustomEvent) => {
      const { tab } = (e as any).detail;
      setActiveTab(tab);
    };
    
    const handleHelpSectionChanged = (e: CustomEvent) => {
      const { section } = (e as any).detail;
      setActiveHelpSection(section);
      
      // Make sure we're on the help tab
      if (activeTab !== 'help') {
        setActiveTab('help');
      }
    };
    
    // Register event listeners
    window.addEventListener('pathChanged', handlePathChanged);
    window.addEventListener('profileTabChanged', handleProfileTabChanged as EventListener);
    window.addEventListener('helpSectionChanged', handleHelpSectionChanged as EventListener);
    
    return () => {
      window.removeEventListener('pathChanged', handlePathChanged);
      window.removeEventListener('profileTabChanged', handleProfileTabChanged as EventListener);
      window.removeEventListener('helpSectionChanged', handleHelpSectionChanged as EventListener);
    };
  }, [activeTab]);
  
  // Initialize profile data with user information
  const [profileData, setProfileData] = useState<ProfileData>({
    id: "",
    full_name: "",
    bio: null,
    username: "",
    email: "",
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
    past_properties: [],
    preferred_inspectors: [],
    preferred_agents: [],
    preferred_contractors: [],
    preferred_lenders: [],
    showProfile: true
  });

  // Fetch buyer profile data from backend
  const { data: buyerProfile, isLoading, error } = useQuery({
    queryKey: ['buyer-profile'],
    queryFn: async () => {
      const response = await fetch('/api/buyer-profile', {
        credentials: 'include'
      });
      if (!response.ok) {
        if (response.status === 404) {
          return null; // No profile exists yet
        }
        throw new Error('Failed to fetch buyer profile');
      }
      return response.json();
    },
    enabled: !!user,
    retry: 1
  });

  // Create mutation for updating buyer profile
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/buyer-profile', {
        method: buyerProfile ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer-profile'] });
    },
  });

  // Load user data from auth system
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        id: user.id?.toString() || "",
        full_name: user.fullName || "",
        username: user.username || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  // Handle buyer profile data when fetched
  useEffect(() => {
    if (buyerProfile) {
      setProfileData(prev => ({
        ...prev,
        phone: buyerProfile.phone || null,
        location: buyerProfile.location || null,
        bio: buyerProfile.bio || null,
        business_name: buyerProfile.business_name,
        in_real_estate_since: buyerProfile.in_real_estate_since,
        type_of_buyer: buyerProfile.type_of_buyer || [],
        website: buyerProfile.website,
        instagram: buyerProfile.instagram,
        facebook: buyerProfile.facebook,
        linkedin: buyerProfile.linkedin,
        profile_photo_url: buyerProfile.profile_photo,
        profile_banner_url: buyerProfile.banner_image,
        markets: buyerProfile.markets || [],
        property_types: buyerProfile.property_types || [],
        property_conditions: buyerProfile.property_conditions || [],
        ideal_budget_min: buyerProfile.ideal_budget_min,
        ideal_budget_max: buyerProfile.ideal_budget_max,
        financing_methods: buyerProfile.financing_methods || [],
        preferred_financing_method: buyerProfile.preferred_financing_method,
        closing_timeline: buyerProfile.closing_timeline,
        number_of_deals_last_12_months: buyerProfile.number_of_deals_last_12_months,
        goal_deals_next_12_months: buyerProfile.goal_deals_next_12_months,
        total_deals_done: buyerProfile.total_deals_done,
        current_portfolio_count: buyerProfile.current_portfolio_count,
        proof_of_funds_url: buyerProfile.proof_of_funds,
        past_properties: buyerProfile.past_properties || []
      }));
    }
  }, [buyerProfile]);

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
        // Check if username exists in buyer_profiles
        const available = await isUsernameAvailable(username, user?.id);
        
        if (available) {
          setIsUsernameAvailable(true);
          setUsernameMessage("Username available");
        } else {
          setIsUsernameAvailable(false);
          setUsernameMessage("Username already taken");
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
  
  // Save mutations for buyer profile
  const saveProfileMutation = useMutation({
    mutationFn: async (data: Partial<BuyerProfile>) => {
      if (!user?.id) throw new Error('User not authenticated');
      return await upsertBuyerProfile({
        ...data,
        user_id: user.id
      });
    },
    onSuccess: () => {
      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['buyer-profile', user?.id] });
    },
    onError: (error) => {
      console.error('Error saving profile:', error);
      toast({
        title: "Error saving profile",
        description: "There was an error saving your profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle profile photo change
  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    
    setLoading(true);
    
    try {
      const photoUrl = await uploadProfilePhoto(file, user.id);
      
      // Update profile data locally
      setProfileData(prev => ({
        ...prev,
        profile_photo_url: photoUrl
      }));
      
      // Save to database
      await saveProfileMutation.mutateAsync({
        profile_photo_url: photoUrl
      });
      
      setIsProfileSectionModified(false);
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
  
  // Handle remove profile photo
  const handleRemoveProfilePhoto = async () => {
    try {
      setLoading(true);
      
      // Update profile data locally first for immediate UI feedback
      setProfileData(prev => ({
        ...prev,
        profile_photo_url: null
      }));
      
      // Update profile in database
      await supabase
        .from('profiles')
        .update({ profile_photo_url: null })
        .eq('id', user?.id);
      
      toast({
        title: "Profile photo removed",
        description: "Your profile photo has been removed successfully.",
      });
      
    } catch (error) {
      console.error('Error removing profile photo:', error);
      toast({
        title: "Error removing profile photo",
        description: "There was an error removing your profile photo. Please try again.",
        variant: "destructive",
      });
      
      // Refetch profile data to ensure UI is in sync with DB
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle banner image change
  const handleBannerImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    
    setLoading(true);
    
    try {
      const bannerUrl = await uploadBannerImage(file, user.id);
      
      // Update profile data locally
      setProfileData(prev => ({
        ...prev,
        profile_banner_url: bannerUrl
      }));
      
      // Save to database
      await saveProfileMutation.mutateAsync({
        banner_image_url: bannerUrl
      });
      
      setIsProfileSectionModified(false);
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
  
  // Handle remove banner image
  const handleRemoveBannerImage = async () => {
    try {
      setLoading(true);
      
      // Update profile data locally first for immediate UI feedback
      setProfileData(prev => ({
        ...prev,
        profile_banner_url: null
      }));
      
      // Update profile in database
      await supabase
        .from('profiles')
        .update({ profile_banner_url: null })
        .eq('id', user?.id);
      
      toast({
        title: "Banner image removed",
        description: "Your banner image has been removed successfully.",
      });
      
    } catch (error) {
      console.error('Error removing banner image:', error);
      toast({
        title: "Error removing banner image",
        description: "There was an error removing your banner image. Please try again.",
        variant: "destructive",
      });
      
      // Refetch profile data to ensure UI is in sync with DB
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
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
        phone: profileData.phone,
        bio: profileData.bio,
        in_real_estate_since: profileData.in_real_estate_since,
        business_name: profileData.business_name,
        type_of_buyer: profileData.type_of_buyer,
        website: profileData.website,
        instagram: profileData.instagram,
        facebook: profileData.facebook,
        linkedin: profileData.linkedin
      };
      
      // Save to database using backend API
      await updateProfileMutation.mutateAsync(profilePayload);
      
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
        closing_timeline: profileData.closing_timeline,
        number_of_deals_last_12_months: profileData.number_of_deals_last_12_months,
        goal_deals_next_12_months: profileData.goal_deals_next_12_months,
        total_deals_done: profileData.total_deals_done,
        current_portfolio_count: profileData.current_portfolio_count
      };
      
      // Save to database using backend API
      await updateProfileMutation.mutateAsync(propertyPayload);
      
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
        onChange={handleBannerImageChange}
        accept="image/*"
        className="hidden"
      />
      {/* Main content with sidebar */}
      <div className="flex flex-1">
        {/* Settings Menu Sidebar - hidden on mobile, fixed on desktop */}
        <div className="hidden md:block w-[220px] fixed top-0 left-16 bottom-[48px] bg-white border-r flex flex-col shadow-sm">
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
                onClick={() => handleTabChange("account")}
              />
              
              <ProfileMenuItem
                icon={<Building size={18} />}
                label="Property Preferences"
                active={activeTab === "property_preferences"}
                onClick={() => handleTabChange("property_preferences")}
              />
              
              <ProfileMenuItem
                icon={<Users size={18} />}
                label="Connections"
                active={activeTab === "connections"}
                onClick={() => handleTabChange("connections")}
              />
              
              <ProfileMenuItem
                icon={<BellRing size={18} />}
                label="Notifications"
                active={activeTab === "notifications"}
                onClick={() => handleTabChange("notifications")}
              />
              
              <ProfileMenuItem
                icon={<LinkIcon size={18} />}
                label="Integrations"
                active={activeTab === "integrations"}
                onClick={() => handleTabChange("integrations")}
              />
              
              <ProfileMenuItem
                icon={<CreditCard size={18} />}
                label="Memberships"
                active={activeTab === "memberships"}
                onClick={() => handleTabChange("memberships")}
              />
              
              <ProfileMenuItem
                icon={<HelpCircle size={18} />}
                label="Help Center"
                active={activeTab === "help"}
                onClick={() => handleTabChange("help")}
              />
            </div>
          </div>
          
          {/* Logout Button - Sticky bottom with red text/icon but no red background */}
          <div className="px-4 py-2 border-t sticky bottom-0 bg-white mt-auto">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50/50 flex items-center justify-start gap-2 px-4 py-2"
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
        
        {/* Main content area - Responsive margin for mobile/desktop */}
        <div className="md:ml-[236px] flex-1 bg-gray-50/60 p-4 md:p-8 overflow-y-auto pb-20 pl-[0px] pr-[0px]">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Tab Content - We'll conditionally show different content based on the active sidebar menu item */}
            {activeTab === "account" && (
              <>
                {/* Member Information Card */}
                <Card className="border-gray-200 shadow-sm bg-white mb-6">
                  <CardHeader className="border-b pb-4 bg-gradient-to-r from-gray-50/80 to-white">
                    <div className="flex items-center">
                      <div className="mr-2 p-1.5 rounded-md bg-green-50">
                        <CircleUserRound className="h-5 w-5 text-[#09261E]" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Member Information</CardTitle>
                        <CardDescription>Your account details and membership status</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-sm text-gray-500 mb-1">Member Since</h3>
                        <p className="text-lg font-medium">May 7, 2025</p>
                      </div>
                      <div>
                        <h3 className="text-sm text-gray-500 mb-1">User #</h3>
                        <p className="text-lg font-medium">N/A</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium">Profile Completion</h3>
                          <p className="text-sm text-gray-500">Complete your profile to increase visibility</p>
                        </div>
                        <div className="bg-gray-50 px-3 py-1 rounded-full">
                          <span className="font-semibold">{profileData.profile_completion_score}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            profileData.profile_completion_score < 40 
                              ? 'bg-red-500' 
                              : profileData.profile_completion_score < 70 
                                ? 'bg-amber-500' 
                                : 'bg-green-600'
                          }`}
                          style={{ width: `${profileData.profile_completion_score}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-md border border-green-100 flex items-start">
                      <div className="p-1 rounded-full bg-green-100 mr-3 mt-0.5">
                        <Shield className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-green-800 text-sm">
                        PropertyDeals maintains the highest standards of data privacy and security
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Profile Card */}
                <Card className="border-gray-200 shadow-sm bg-white">
                  <CardHeader className="border-b pb-4 bg-gradient-to-r from-gray-50/80 to-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-2 p-1.5 rounded-md bg-green-50">
                          <User className="h-5 w-5 text-[#09261E]" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">Profile</CardTitle>
                          <CardDescription>Your personal and business information</CardDescription>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-2">
                        <span className="text-sm text-gray-500">Completion:</span>
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              profileData.profile_completion_score < 40 
                                ? 'bg-red-500' 
                                : profileData.profile_completion_score < 70 
                                  ? 'bg-amber-500' 
                                  : 'bg-green-600'
                            }`}
                            style={{ width: `${profileData.profile_completion_score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{profileData.profile_completion_score}%</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleProfileSectionSubmit}>
                      <div className="space-y-8">
                        {/* General Information Section */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider flex items-center">
                              <span>General Information</span>
                              {!profileData.full_name || !profileData.username ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[#803344] text-white rounded-full cursor-help">
                                        Needs attention
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-sm">Complete your basic profile info to improve visibility</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[#135341] text-white rounded-full">
                                  Complete
                                </span>
                              )}
                            </h3>
                        
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
                                  {isCheckingUsername && (
                                    <span className="ml-2 inline-flex items-center text-xs text-gray-400">
                                      <span className="h-3 w-3 mr-1 rounded-full border-2 border-t-transparent border-gray-400 animate-spin"></span>
                                      Checking...
                                    </span>
                                  )}
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
                                <div className="relative">
                                  <Input 
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={profileData.email}
                                    className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50 pr-10"
                                    placeholder="Your email address"
                                    disabled 
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Check className="h-4 w-4 text-green-500" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="text-sm">Email verified</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </span>
                                </div>
                                <p className="text-xs mt-1 text-gray-500">
                                  Email changes are managed through security settings
                                </p>
                              </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-2 text-gray-700" htmlFor="phone">
                              Phone Number
                            </label>
                            <div className="relative">
                              <Input 
                                id="phone"
                                name="phone"
                                type="tel"
                                value={profileData.phone || ""}
                                onChange={(e) => handleInputChange(e, 'profile')}
                                className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                                placeholder="Your phone number (123-456-7890)"
                              />
                              {profileData.phone && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge className="bg-[#803344] text-white hover:bg-[#803344]/90 h-5 px-1.5 cursor-help">
                                          Verify
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-sm">Verify your phone to receive notifications</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </span>
                              )}
                            </div>
                            <p className="text-xs mt-1 text-gray-500">
                              Adding a phone number enables text notifications
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 text-gray-700" htmlFor="location">
                            Location Based In
                          </label>
                          <Input 
                            id="location"
                            name="location"
                            value={profileData.location || ""}
                            onChange={(e) => handleInputChange(e, 'profile')}
                            className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                            placeholder="City, State (e.g. Austin, TX)"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 flex items-center text-gray-700" htmlFor="bio">
                            Bio
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="ml-1 h-3.5 w-3.5 text-gray-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm">A brief description about yourself and your real estate experience</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </label>
                          <Textarea 
                            id="bio"
                            name="bio"
                            value={profileData.bio || ""}
                            onChange={(e) => handleInputChange(e, 'profile')}
                            className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50 min-h-[100px]"
                            placeholder="Tell us about yourself and your real estate journey..."
                          />
                          <p className="text-xs mt-1 text-gray-500 flex items-center">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
                            Your bio will be visible on your public profile
                          </p>
                        </div>
                        

                      </div>
                      
                      {/* Business Information Section */}
                      <div className="space-y-4 pt-8 border-t">
                        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider flex items-center">
                          <span>Business Information</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[#803344]/10 text-[#803344] rounded-full cursor-help flex items-center">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Needs Attention
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm">Share your business details to help connect with partners</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </h3>
                        
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
                          <div className="flex flex-wrap gap-2 mt-2">
                            {buyerTypeOptions.map((option) => {
                              const isSelected = profileData.type_of_buyer?.includes(option);
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => handleMultiSelectChange('type_of_buyer', option, 'profile')}
                                  className={`
                                    px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                                    flex items-center group hover:shadow-sm
                                    ${isSelected 
                                      ? 'bg-[#09261E] text-white border border-[#09261E]' 
                                      : 'bg-white text-gray-700 border border-gray-300 hover:border-[#09261E]/30 hover:bg-[#09261E]/5'
                                    }
                                  `}
                                >
                                  {option}
                                  {isSelected && (
                                    <Check className="ml-1 h-3.5 w-3.5 text-white" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Social Media Section */}
                      <div className="space-y-4 pt-8 border-t">
                        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider flex items-center">
                          <span>Social Media</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[#803344]/10 text-[#803344] rounded-full cursor-help flex items-center">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Needs Attention
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm">Add your social profiles to expand your network</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </h3>
                        
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
                          className={`flex items-center transition-all duration-200 ${
                            loading ? "bg-gray-400" : isProfileSectionModified ? "bg-[#09261E] hover:bg-[#09261E]/90" : "bg-gray-200 text-gray-500"
                          } text-white`}
                          disabled={loading || !isProfileSectionModified}
                        >
                          {loading ? (
                            <>
                              <span className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Profile Changes
                            </>
                          )}
                        </Button>
                      </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Profile Uploads Card */}
                <Card className="border-gray-200 shadow-sm bg-white mt-6">
                  <CardHeader className="border-b pb-4 bg-gradient-to-r from-gray-50/80 to-white">
                    <div className="flex items-center">
                      <div className="mr-2 p-1.5 rounded-md bg-green-50">
                        <Camera className="h-5 w-5 text-[#09261E]" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Profile Uploads</CardTitle>
                        <CardDescription>Your profile photo and banner image</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Profile Photo Upload */}
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider flex items-center mb-4">
                          <span>Profile Photo</span>
                          {!profileData.profile_photo_url ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[#803344] text-white rounded-full cursor-help">
                                    Recommended
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm">Add a profile photo to improve your visibility</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[#135341] text-white rounded-full">
                              Complete
                            </span>
                          )}
                        </h3>
                        
                        <div className="flex flex-col items-center">
                          <div 
                            className="relative mb-4 w-32 h-32 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center overflow-hidden"
                          >
                            {profileData.profile_photo_url ? (
                              <img 
                                src={profileData.profile_photo_url} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <UserCircle className="w-20 h-20 text-gray-400" />
                            )}
                          </div>
                          
                          <div className="space-y-2 w-full max-w-[200px]">
                            <Button 
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full bg-white hover:bg-gray-100 transition-colors"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Photo
                            </Button>
                            
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleProfilePhotoChange}
                              className="hidden"
                              accept="image/*"
                            />
                            
                            {profileData.profile_photo_url && (
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={handleRemoveProfilePhoto}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Remove Photo
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Banner Image Upload */}
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider flex items-center mb-4">
                          <span>Banner Image</span>
                          {!profileData.profile_banner_url ? (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[#803344] text-white rounded-full cursor-help">
                              Recommended
                            </span>
                          ) : (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[#135341] text-white rounded-full">
                              Completed
                            </span>
                          )}
                        </h3>
                        
                        <div className="flex flex-col items-center">
                          <div 
                            className="relative mb-4 w-full h-36 rounded-md bg-gray-100 border-2 border-gray-200 flex items-center justify-center overflow-hidden"
                          >
                            {profileData.profile_banner_url ? (
                              <img 
                                src={profileData.profile_banner_url} 
                                alt="Banner" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-400 text-sm">No banner image</span>
                            )}
                          </div>
                          
                          <div className="space-y-2 w-full max-w-[200px]">
                            <Button 
                              type="button"
                              variant="outline"
                              onClick={() => bannerInputRef.current?.click()}
                              className="w-full bg-white hover:bg-gray-100 transition-colors"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Banner
                            </Button>
                            
                            <input
                              type="file"
                              ref={bannerInputRef}
                              onChange={handleBannerImageChange}
                              className="hidden"
                              accept="image/*"
                            />
                            
                            {profileData.profile_banner_url && (
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={handleRemoveBannerImage}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Remove Banner
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </>
            )}
            
            {activeTab === "connections" && (
              <>
                {/* Professionals Section */}
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="border-b pb-4 bg-gradient-to-r from-gray-50/80 to-white">
                    <div className="flex items-center">
                      <div className="mr-2 p-1.5 rounded-md bg-green-50">
                        <Users className="h-5 w-5 text-[#09261E]" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Professionals</CardTitle>
                        <CardDescription>Your trusted real estate professionals</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-8">
                    <form onSubmit={handleProfileSectionSubmit}>

                      {/* Introduction */}
                      <div className="mb-6">
                        <div className="p-4 bg-gray-50/80 rounded-md border border-gray-200">
                          <p className="text-sm text-gray-700 flex items-start">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>
                              Add your trusted real estate professionals to streamline your investments. You'll be able to quickly connect them to new deals and projects.
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      {/* Preferred Sellers */}
                      <div className="space-y-4 mb-8">
                        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider flex items-center">
                          <span>Preferred Sellers</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full cursor-help">
                                  Build Your Network
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm">Add sellers you've worked with previously to build your network</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </h3>
                        
                        <div className="relative">
                          <div className="flex items-center border border-gray-300 rounded-md p-2 mb-3 bg-white">
                            <Search className="h-4 w-4 mr-2 text-gray-400" />
                            <Input 
                              id="search_sellers"
                              className="border-0 focus:ring-0 p-0 h-8"
                              placeholder="Search for a seller by name or username..."
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {profileData.preferred_sellers?.length > 0 ? (
                              profileData.preferred_sellers.map((seller, index) => (
                                <div key={index} className="border border-gray-200 rounded-md p-3 flex items-start hover:shadow-sm transition-shadow bg-white">
                                  <Avatar className="h-10 w-10 mr-3">
                                    <AvatarFallback className="bg-[#135341] text-white">{seller.substring(0, 2).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 truncate">{seller}</p>
                                    <p className="text-xs text-gray-500 truncate">Seller • PropertyDeals</p>
                                  </div>
                                  <button 
                                    type="button" 
                                    className="text-gray-400 hover:text-red-500 p-1 rounded-full"
                                    onClick={() => handleMultiSelectChange('preferred_sellers', seller, 'professionals')}
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <div className="col-span-full p-6 border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center bg-gray-50">
                                <Users className="h-10 w-10 text-gray-400 mb-2" />
                                <h4 className="text-lg font-medium text-gray-700">No preferred sellers yet</h4>
                                <p className="text-sm text-gray-500 text-center max-w-md mt-1">
                                  Add sellers you've worked with to streamline communication on future deals
                                </p>
                                <Button
                                  type="button"
                                  className="mt-4 bg-[#135341] hover:bg-[#135341]/90 text-white"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Seller
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Preferred Agents */}
                      <div className="space-y-4 mb-8 pt-6 border-t">
                        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider flex items-center">
                          <span>Preferred Agents</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full cursor-help">
                                  Build Your Network
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm">Add agents you've worked with to streamline your investments</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </h3>
                        
                        <div className="relative">
                          <div className="flex items-center border border-gray-300 rounded-md p-2 mb-3 bg-white">
                            <Search className="h-4 w-4 mr-2 text-gray-400" />
                            <Input 
                              id="search_agents"
                              className="border-0 focus:ring-0 p-0 h-8"
                              placeholder="Search for an agent by name or username..."
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {profileData.preferred_agents?.length > 0 ? (
                              profileData.preferred_agents.map((agent, index) => (
                                <div key={index} className="border border-gray-200 rounded-md p-3 flex items-start hover:shadow-sm transition-shadow bg-white">
                                  <Avatar className="h-10 w-10 mr-3">
                                    <AvatarFallback className="bg-[#803344] text-white">{agent.substring(0, 2).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 truncate">{agent}</p>
                                    <p className="text-xs text-gray-500 truncate">Agent • REP</p>
                                  </div>
                                  <button 
                                    type="button" 
                                    className="text-gray-400 hover:text-red-500 p-1 rounded-full"
                                    onClick={() => handleMultiSelectChange('preferred_agents', agent, 'professionals')}
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <div className="col-span-full p-6 border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center bg-gray-50">
                                <Users className="h-10 w-10 text-gray-400 mb-2" />
                                <h4 className="text-lg font-medium text-gray-700">No preferred agents yet</h4>
                                <p className="text-sm text-gray-500 text-center max-w-md mt-1">
                                  Add agents you trust to help with your real estate transactions
                                </p>
                                <Button
                                  type="button"
                                  className="mt-4 bg-[#803344] hover:bg-[#803344]/90 text-white"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Agent
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Other Professionals Tabs */}
                      <div className="space-y-4 pt-6 border-t">
                        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Other Professionals</h3>
                        
                        <Tabs defaultValue="contractors" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="contractors">Contractors</TabsTrigger>
                            <TabsTrigger value="lenders">Lenders</TabsTrigger>
                            <TabsTrigger value="inspectors">Inspectors</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="contractors" className="mt-6">
                            <div className="relative">
                              <div className="flex items-center border border-gray-300 rounded-md p-2 mb-3 bg-white">
                                <Search className="h-4 w-4 mr-2 text-gray-400" />
                                <Input 
                                  id="search_contractors"
                                  className="border-0 focus:ring-0 p-0 h-8"
                                  placeholder="Search for a contractor..."
                                />
                              </div>
                              
                              {profileData.preferred_contractors?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                  {profileData.preferred_contractors.map((contractor, index) => (
                                    <div key={index} className="border border-gray-200 rounded-md p-3 flex items-start hover:shadow-sm transition-shadow bg-white">
                                      <Avatar className="h-10 w-10 mr-3">
                                        <AvatarFallback className="bg-[#803344] text-white">{contractor.substring(0, 2).toUpperCase()}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 truncate">{contractor}</p>
                                        <p className="text-xs text-gray-500 truncate">Contractor • REP</p>
                                      </div>
                                      <button 
                                        type="button" 
                                        className="text-gray-400 hover:text-red-500 p-1 rounded-full"
                                        onClick={() => handleMultiSelectChange('preferred_contractors', contractor, 'professionals')}
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-6 border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center bg-gray-50">
                                  <Wrench className="h-10 w-10 text-gray-400 mb-2" />
                                  <h4 className="text-lg font-medium text-gray-700">No contractors yet</h4>
                                  <p className="text-sm text-gray-500 text-center max-w-md mt-1">
                                    Add contractors you've worked with for renovations and repairs
                                  </p>
                                  <Button
                                    type="button"
                                    className="mt-4 bg-[#803344] hover:bg-[#803344]/90 text-white"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Contractor
                                  </Button>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="lenders" className="mt-6">
                            <div className="relative">
                              <div className="flex items-center border border-gray-300 rounded-md p-2 mb-3 bg-white">
                                <Search className="h-4 w-4 mr-2 text-gray-400" />
                                <Input 
                                  id="search_lenders"
                                  className="border-0 focus:ring-0 p-0 h-8"
                                  placeholder="Search for a lender..."
                                />
                              </div>
                              
                              {profileData.preferred_lenders?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                  {profileData.preferred_lenders.map((lender, index) => (
                                    <div key={index} className="border border-gray-200 rounded-md p-3 flex items-start hover:shadow-sm transition-shadow bg-white">
                                      <Avatar className="h-10 w-10 mr-3">
                                        <AvatarFallback className="bg-[#803344] text-white">{lender.substring(0, 2).toUpperCase()}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 truncate">{lender}</p>
                                        <p className="text-xs text-gray-500 truncate">Lender • REP</p>
                                      </div>
                                      <button 
                                        type="button" 
                                        className="text-gray-400 hover:text-red-500 p-1 rounded-full"
                                        onClick={() => handleMultiSelectChange('preferred_lenders', lender, 'professionals')}
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-6 border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center bg-gray-50">
                                  <DollarSign className="h-10 w-10 text-gray-400 mb-2" />
                                  <h4 className="text-lg font-medium text-gray-700">No lenders yet</h4>
                                  <p className="text-sm text-gray-500 text-center max-w-md mt-1">
                                    Add lenders who can help finance your investment properties
                                  </p>
                                  <Button
                                    type="button"
                                    className="mt-4 bg-[#803344] hover:bg-[#803344]/90 text-white"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Lender
                                  </Button>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="inspectors" className="mt-6">
                            <div className="relative">
                              <div className="flex items-center border border-gray-300 rounded-md p-2 mb-3 bg-white">
                                <Search className="h-4 w-4 mr-2 text-gray-400" />
                                <Input 
                                  id="search_inspectors"
                                  className="border-0 focus:ring-0 p-0 h-8"
                                  placeholder="Search for an inspector..."
                                />
                              </div>
                              
                              {profileData.preferred_inspectors?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                  {profileData.preferred_inspectors.map((inspector, index) => (
                                    <div key={index} className="border border-gray-200 rounded-md p-3 flex items-start hover:shadow-sm transition-shadow bg-white">
                                      <Avatar className="h-10 w-10 mr-3">
                                        <AvatarFallback className="bg-[#803344] text-white">{inspector.substring(0, 2).toUpperCase()}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 truncate">{inspector}</p>
                                        <p className="text-xs text-gray-500 truncate">Inspector • REP</p>
                                      </div>
                                      <button 
                                        type="button" 
                                        className="text-gray-400 hover:text-red-500 p-1 rounded-full"
                                        onClick={() => handleMultiSelectChange('preferred_inspectors', inspector, 'professionals')}
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-6 border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center bg-gray-50">
                                  <FileCheck className="h-10 w-10 text-gray-400 mb-2" />
                                  <h4 className="text-lg font-medium text-gray-700">No inspectors yet</h4>
                                  <p className="text-sm text-gray-500 text-center max-w-md mt-1">
                                    Add property inspectors you trust to evaluate potential investments
                                  </p>
                                  <Button
                                    type="button"
                                    className="mt-4 bg-[#803344] hover:bg-[#803344]/90 text-white"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Inspector
                                  </Button>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                      
                      <div className="pt-6 flex justify-end border-t mt-8">
                        <Button 
                          type="submit" 
                          className={`flex items-center transition-all duration-200 ${
                            loading ? "bg-gray-400" : isProfessionalSectionModified ? "bg-[#09261E] hover:bg-[#09261E]/90" : "bg-gray-200 text-gray-500"
                          } text-white`}
                          disabled={loading || !isProfessionalSectionModified}
                        >
                          {loading ? (
                            <>
                              <span className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Professionals
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === "property_preferences" && (
              <>
                {/* Property Preferences Section */}
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="border-b pb-4 bg-gradient-to-r from-gray-50/80 to-white">
                    <div className="flex items-center">
                      <div className="mr-2 p-1.5 rounded-md bg-green-50">
                        <Building className="h-5 w-5 text-[#09261E]" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Property Preferences</CardTitle>
                        <CardDescription>Your investment criteria and deal preferences</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-8">
                    <form onSubmit={handlePropertySectionSubmit}>
                      {/* Investment Criteria */}
                      <div className="space-y-4 mb-8">
                        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider flex items-center">
                          <span>Investment Criteria</span>
                          {!profileData.markets?.length || !profileData.property_types?.length ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[#803344] text-white rounded-full cursor-help">
                                    Needs attention
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm">Define your investment criteria to get better matches</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[#135341] text-white rounded-full">
                              Complete
                            </span>
                          )}
                        </h3>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 flex items-center text-gray-700" htmlFor="markets">
                            Target Markets
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="ml-1 h-3.5 w-3.5 text-gray-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm">Select markets where you're actively looking to invest</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </label>
                          <div className="relative">
                            <Input
                              id="markets"
                              name="markets"
                              className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50 mb-2"
                              placeholder="Add markets separated by commas (e.g. Milwaukee WI, Madison WI)"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ',') {
                                  e.preventDefault();
                                  const input = e.currentTarget;
                                  const value = input.value.trim();
                                  if (value) {
                                    const markets = value.split(',').map(m => m.trim()).filter(Boolean);
                                    markets.forEach(market => {
                                      if (!profileData.markets.includes(market)) {
                                        handleMultiSelectChange('markets', market, 'property');
                                      }
                                    });
                                    input.value = '';
                                  }
                                }
                              }}
                              data-incomplete={!profileData.markets?.length ? "true" : "false"}
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                              {profileData.markets?.map((market) => (
                                <Badge 
                                  key={market} 
                                  className="rounded-full border px-4 py-2 text-sm transition bg-[#09261E] text-white hover:bg-[#09261E]/90"
                                >
                                  <MapPin className="h-3 w-3 mr-1 inline" />
                                  {market}
                                  <button
                                    type="button"
                                    className="ml-2 rounded-full hover:bg-[#09261E]/80 p-0.5"
                                    onClick={() => handleMultiSelectChange('markets', market, 'property')}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs mt-2 text-gray-500">
                              Press Enter or comma to add multiple markets
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 block text-gray-700">
                            Property Types
                          </label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {propertyTypeOptions.map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => handleMultiSelectChange('property_types', option, 'property')}
                                className={`rounded-full border px-4 py-2 text-sm transition ${
                                  profileData.property_types?.includes(option)
                                    ? 'bg-[#09261E] text-white hover:bg-[#09261E]/90'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 block text-gray-700">
                            Property Conditions
                          </label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {propertyConditionOptions.map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => handleMultiSelectChange('property_conditions', option, 'property')}
                                className={`rounded-full border px-4 py-2 text-sm transition ${
                                  profileData.property_conditions?.includes(option)
                                    ? 'bg-[#09261E] text-white hover:bg-[#09261E]/90'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 flex items-center text-gray-700" htmlFor="ideal_budget_min">
                              Budget Range (Min)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="ml-1 h-3.5 w-3.5 text-gray-400 cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-sm">Your minimum investment budget</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </label>
                            <div className="relative">
                              <Input 
                                id="ideal_budget_min"
                                name="ideal_budget_min"
                                type="number"
                                min="0"
                                step="1000"
                                value={profileData.ideal_budget_min || ""}
                                onChange={(e) => handleInputChange(e, 'property')}
                                className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50 pl-8"
                                placeholder="Minimum budget"
                              />
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span className="text-gray-500">$</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-2 flex items-center text-gray-700" htmlFor="ideal_budget_max">
                              Budget Range (Max)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="ml-1 h-3.5 w-3.5 text-gray-400 cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-sm">Your maximum investment budget</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </label>
                            <div className="relative">
                              <Input 
                                id="ideal_budget_max"
                                name="ideal_budget_max"
                                type="number"
                                min={profileData.ideal_budget_min || 0}
                                step="1000"
                                value={profileData.ideal_budget_max || ""}
                                onChange={(e) => handleInputChange(e, 'property')}
                                className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50 pl-8"
                                placeholder="Maximum budget"
                              />
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span className="text-gray-500">$</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Deal Preferences */}
                      <div className="space-y-4 mb-8 pt-6 border-t">
                        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider flex items-center">
                          <span>Deal Preferences</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full cursor-help">
                                  Helps Matching
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm">Providing these details improves deal matching and seller trust</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </h3>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 block text-gray-700">
                            Financing Methods
                          </label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {financingMethodOptions.map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => handleMultiSelectChange('financing_methods', option, 'property')}
                                className={`rounded-full border px-4 py-2 text-sm transition ${
                                  profileData.financing_methods?.includes(option)
                                    ? 'bg-[#09261E] text-white hover:bg-[#09261E]/90'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 text-gray-700" htmlFor="preferred_financing_method">
                              Preferred Financing Method
                            </label>
                            <Select
                              value={profileData.preferred_financing_method || ""}
                              onValueChange={(value) => {
                                setProfileData(prev => ({
                                  ...prev,
                                  preferred_financing_method: value
                                }));
                                setIsPropertySectionModified(true);
                              }}
                            >
                              <SelectTrigger className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50">
                                <SelectValue placeholder="Select preferred method" />
                              </SelectTrigger>
                              <SelectContent>
                                {financingMethodOptions.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-2 text-gray-700" htmlFor="closing_timeline">
                              Closing Timeline
                            </label>
                            <Select
                              value={profileData.closing_timeline || ""}
                              onValueChange={(value) => {
                                setProfileData(prev => ({
                                  ...prev,
                                  closing_timeline: value
                                }));
                                setIsPropertySectionModified(true);
                              }}
                            >
                              <SelectTrigger className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50">
                                <SelectValue placeholder="Select timeline" />
                              </SelectTrigger>
                              <SelectContent>
                                {closingTimelineOptions.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
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
                              onChange={(e) => handleInputChange(e, 'property')}
                              className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                              placeholder="Number of deals closed"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-2 text-gray-700" htmlFor="goal_deals_next_12_months">
                              Deal Goal for Next 12 Months
                            </label>
                            <Input 
                              id="goal_deals_next_12_months"
                              name="goal_deals_next_12_months"
                              type="number"
                              min="0"
                              value={profileData.goal_deals_next_12_months || ""}
                              onChange={(e) => handleInputChange(e, 'property')}
                              className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                              placeholder="Number of deals targeted"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 text-gray-700" htmlFor="total_deals_done">
                              Total Deals Completed
                            </label>
                            <Input 
                              id="total_deals_done"
                              name="total_deals_done"
                              type="number"
                              min="0"
                              value={profileData.total_deals_done || ""}
                              onChange={(e) => handleInputChange(e, 'property')}
                              className="border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                              placeholder="Lifetime deals closed"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-2 text-gray-700" htmlFor="current_portfolio_count">
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
                              placeholder="Number of properties"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Verification Section */}
                      <div className="space-y-6 mb-8 pt-6 border-t">
                        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider flex items-center">
                          <span>Verification</span>
                          {!profileData.proof_of_funds_url ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[#803344] text-white rounded-full cursor-help">
                                    Needs Attention
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm">Verified buyers get 4x more responses from sellers</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : profileData.proof_of_funds_verified ? (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[#135341] text-white rounded-full">
                              ✓ Verified
                            </span>
                          ) : (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[#803344] text-white rounded-full">
                              ⏳ Pending Verification
                            </span>
                          )}
                        </h3>
                        
                        {/* Section 1: Proof of Funds Upload */}
                        <div className="bg-gray-50/80 p-4 rounded-md border border-gray-200">
                          <h4 className="font-medium text-gray-800 text-base mb-3 flex items-center">
                            <FileCheck className="mr-2 h-5 w-5 text-[#09261E]" />
                            Proof of Funds Upload
                          </h4>
                          
                          <div className="mb-4">
                            <p className="text-sm text-gray-700 mb-2">
                              Uploading proof of funds increases your credibility with sellers and can help you win more deals.
                            </p>
                            <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                              <li>Acceptable documents: Bank statements, line of credit letter, or investment account statement</li>
                              <li>Must be dated within the last 60 days</li>
                              <li>Must show your name and available funds</li>
                              <li>All sensitive information will be kept confidential</li>
                            </ul>
                          </div>
                          
                          <div className="flex items-center">
                            {profileData.proof_of_funds_url ? (
                              <>
                                <div className="flex-1">
                                  <div className="flex items-center text-sm">
                                    <FileCheck className="mr-2 h-5 w-5 text-green-600" />
                                    <span className="font-semibold">Proof of Funds Document Uploaded</span>
                                  </div>
                                  {profileData.proof_of_funds_verified ? (
                                    <span className="text-green-600 text-xs flex items-center mt-1">
                                      <Check className="h-3.5 w-3.5 mr-1" />
                                      Verified by PropertyDeals Team
                                    </span>
                                  ) : (
                                    <span className="text-amber-600 text-xs flex items-center mt-1">
                                      <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                                      Pending Verification (1-2 business days)
                                    </span>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <Button 
                                    type="button"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50/50 border-red-200"
                                    onClick={() => {
                                      if (window.confirm("Are you sure you want to remove your proof of funds document?")) {
                                        setProfileData(prev => ({
                                          ...prev,
                                          proof_of_funds_url: null,
                                          proof_of_funds_verified: false
                                        }));
                                        setIsPropertySectionModified(true);
                                      }
                                    }}
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Remove
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <Button
                                type="button"
                                onClick={() => {/* Handle proof of funds upload */}}
                                className="w-full py-4 flex flex-col items-center justify-center bg-white hover:bg-gray-50 border-2 border-dashed border-gray-300 rounded-md transition-colors duration-200 hover:border-gray-400 pt-[50px] pb-[50px]"
                              >
                                <Upload className="h-5 w-5 text-gray-400 mb-1" />
                                <span className="font-medium text-gray-700 text-sm">Upload Proof of Funds</span>
                                <span className="text-xs text-gray-500">PDF, JPG, or PNG (Max 5MB)</span>
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {/* Section 2: Portfolio */}
                        <div className="bg-gray-50/80 p-4 rounded-md border border-gray-200">
                          <h4 className="font-medium text-gray-800 text-base mb-3 flex items-center">
                            <Building className="mr-2 h-5 w-5 text-[#09261E]" />
                            Portfolio
                          </h4>
                          
                          <p className="text-sm text-gray-700 mb-3">
                            List up to 5 current or past properties you've purchased under your name or business entity. These will be reviewed for verification purposes.
                          </p>
                          
                          <div className="space-y-3">
                            {profileData.past_properties.map((property, index) => (
                              <div key={index} className="flex items-center">
                                <Input
                                  value={property}
                                  className="flex-1 border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/50"
                                  placeholder="Property address"
                                  onChange={(e) => {
                                    const updatedProperties = [...profileData.past_properties];
                                    updatedProperties[index] = e.target.value;
                                    setProfileData(prev => ({
                                      ...prev,
                                      past_properties: updatedProperties
                                    }));
                                    setIsPropertySectionModified(true);
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="ml-2 text-gray-500 hover:text-red-600"
                                  onClick={() => {
                                    const updatedProperties = [...profileData.past_properties];
                                    updatedProperties.splice(index, 1);
                                    setProfileData(prev => ({
                                      ...prev,
                                      past_properties: updatedProperties
                                    }));
                                    setIsPropertySectionModified(true);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            
                            {profileData.past_properties.length < 5 && (
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full py-2 text-[#09261E] border-dashed border-gray-300 hover:border-[#09261E] hover:bg-[#09261E]/5"
                                onClick={() => {
                                  setProfileData(prev => ({
                                    ...prev,
                                    past_properties: [...prev.past_properties, ""]
                                  }));
                                  setIsPropertySectionModified(true);
                                }}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Property
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {/* Section 3: Verified Badge Status */}
                        <div className="bg-gray-50/80 p-4 rounded-md border border-gray-200">
                          <h4 className="font-medium text-gray-800 text-base mb-3 flex items-center">
                            <Shield className="mr-2 h-5 w-5 text-[#09261E]" />
                            Verification Status
                          </h4>
                          
                          {!profileData.buyer_verification_tag || profileData.buyer_verification_tag === "Not Verified Yet" ? (
                            <div className="flex items-center p-3 bg-gray-100 rounded-md">
                              <div className="mr-3 p-1.5 rounded-full bg-gray-200">
                                <Shield className="h-5 w-5 text-gray-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Not Verified Yet</p>
                                <p className="text-xs text-gray-500">Please complete all profile and verification fields.</p>
                              </div>
                            </div>
                          ) : profileData.buyer_verification_tag === "Verification Pending" ? (
                            <div className="flex items-center p-3 bg-amber-50 rounded-md">
                              <div className="mr-3 p-1.5 rounded-full bg-amber-100">
                                <Clock className="h-5 w-5 text-amber-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-amber-800">Verification Pending</p>
                                <p className="text-xs text-amber-700">Our team is reviewing your details.</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center p-3 bg-green-50 rounded-md">
                              <div className="mr-3 p-1.5 rounded-full bg-green-100">
                                <Check className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-green-800">Verified Buyer</p>
                                <p className="text-xs text-green-700">Your buyer verification has been approved.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="pt-6 flex justify-end border-t">
                        <Button 
                          type="submit" 
                          className={`flex items-center transition-all duration-200 ${
                            loading ? "bg-gray-400" : isPropertySectionModified ? "bg-[#09261E] hover:bg-[#09261E]/90" : "bg-gray-200 text-gray-500"
                          } text-white`}
                          disabled={loading || !isPropertySectionModified}
                        >
                          {loading ? (
                            <>
                              <span className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Property Preferences
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </>
            )}
            
            {activeTab === "connections" && (
              <>
                {/* Professionals Section */}
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="border-b pb-4 bg-gradient-to-r from-gray-50/80 to-white">
                    <div className="flex items-center">
                      <div className="mr-2 p-1.5 rounded-md bg-green-50">
                        <Users className="h-5 w-5 text-[#09261E]" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Professionals</CardTitle>
                        <CardDescription>Your trusted real estate professionals</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-8">
                    <form onSubmit={handleProfileSectionSubmit}>

                      {/* Introduction */}
                      <div className="mb-6">
                        <div className="p-4 bg-gray-50/80 rounded-md border border-gray-200">
                          <p className="text-sm text-gray-700 flex items-start">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>
                              Add your trusted real estate professionals to streamline your investments. You'll be able to quickly connect them to new deals and projects.
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      {/* Preferred Sellers */}
                      <div className="space-y-4 mb-8">
                        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider flex items-center">
                          <span>Preferred Sellers</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full cursor-help">
                                  Build Your Network
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm">Add sellers you've worked with previously to build your network</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </h3>
                        
                        <div className="relative">
                          <div className="flex items-center border border-gray-300 rounded-md p-2 mb-3 bg-white">
                            <Search className="h-4 w-4 mr-2 text-gray-400" />
                            <Input 
                              id="search_sellers"
                              className="border-0 focus:ring-0 p-0 h-8"
                              placeholder="Search for a seller by name or username..."
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {profileData.preferred_sellers?.length > 0 ? (
                              profileData.preferred_sellers.map((seller, index) => (
                                <div key={index} className="border border-gray-200 rounded-md p-3 flex items-start hover:shadow-sm transition-shadow bg-white">
                                  <Avatar className="h-10 w-10 mr-3">
                                    <AvatarFallback className="bg-[#135341] text-white">{seller.substring(0, 2).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 truncate">{seller}</p>
                                    <p className="text-xs text-gray-500 truncate">Seller • PropertyDeals</p>
                                  </div>
                                  <button 
                                    type="button" 
                                    className="text-gray-400 hover:text-red-500 p-1 rounded-full"
                                    onClick={() => handleMultiSelectChange('preferred_sellers', seller, 'professionals')}
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <div className="col-span-full p-6 border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center bg-gray-50">
                                <Users className="h-10 w-10 text-gray-400 mb-2" />
                                <h4 className="text-lg font-medium text-gray-700">No preferred sellers yet</h4>
                                <p className="text-sm text-gray-500 text-center max-w-md mt-1">
                                  Add sellers you've worked with to streamline communication on future deals
                                </p>
                                <Button
                                  type="button"
                                  className="mt-4 bg-[#135341] hover:bg-[#135341]/90 text-white"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Seller
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Preferred Agents */}
                      <div className="space-y-4 mb-8 pt-6 border-t">
                        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider flex items-center">
                          <span>Preferred Agents</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full cursor-help">
                                  Build Your Network
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm">Add agents you've worked with to streamline your investments</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </h3>
                        
                        <div className="relative">
                          <div className="flex items-center border border-gray-300 rounded-md p-2 mb-3 bg-white">
                            <Search className="h-4 w-4 mr-2 text-gray-400" />
                            <Input 
                              id="search_agents"
                              className="border-0 focus:ring-0 p-0 h-8"
                              placeholder="Search for an agent by name or username..."
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {profileData.preferred_agents?.length > 0 ? (
                              profileData.preferred_agents.map((agent, index) => (
                                <div key={index} className="border border-gray-200 rounded-md p-3 flex items-start hover:shadow-sm transition-shadow bg-white">
                                  <Avatar className="h-10 w-10 mr-3">
                                    <AvatarFallback className="bg-[#803344] text-white">{agent.substring(0, 2).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 truncate">{agent}</p>
                                    <p className="text-xs text-gray-500 truncate">Agent • REP</p>
                                  </div>
                                  <button 
                                    type="button" 
                                    className="text-gray-400 hover:text-red-500 p-1 rounded-full"
                                    onClick={() => handleMultiSelectChange('preferred_agents', agent, 'professionals')}
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <div className="col-span-full p-6 border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center bg-gray-50">
                                <Users className="h-10 w-10 text-gray-400 mb-2" />
                                <h4 className="text-lg font-medium text-gray-700">No preferred agents yet</h4>
                                <p className="text-sm text-gray-500 text-center max-w-md mt-1">
                                  Add agents you trust to help with your real estate transactions
                                </p>
                                <Button
                                  type="button"
                                  className="mt-4 bg-[#803344] hover:bg-[#803344]/90 text-white"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Agent
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Other Professionals Tabs */}
                      <div className="space-y-4 pt-6 border-t">
                        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Other Professionals</h3>
                        
                        <Tabs defaultValue="contractors" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="contractors">Contractors</TabsTrigger>
                            <TabsTrigger value="lenders">Lenders</TabsTrigger>
                            <TabsTrigger value="inspectors">Inspectors</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="contractors" className="mt-6">
                            <div className="relative">
                              <div className="flex items-center border border-gray-300 rounded-md p-2 mb-3 bg-white">
                                <Search className="h-4 w-4 mr-2 text-gray-400" />
                                <Input 
                                  id="search_contractors"
                                  className="border-0 focus:ring-0 p-0 h-8"
                                  placeholder="Search for a contractor..."
                                />
                              </div>
                              
                              {profileData.preferred_contractors?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                  {profileData.preferred_contractors.map((contractor, index) => (
                                    <div key={index} className="border border-gray-200 rounded-md p-3 flex items-start hover:shadow-sm transition-shadow bg-white">
                                      <Avatar className="h-10 w-10 mr-3">
                                        <AvatarFallback className="bg-[#803344] text-white">{contractor.substring(0, 2).toUpperCase()}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 truncate">{contractor}</p>
                                        <p className="text-xs text-gray-500 truncate">Contractor • REP</p>
                                      </div>
                                      <button 
                                        type="button" 
                                        className="text-gray-400 hover:text-red-500 p-1 rounded-full"
                                        onClick={() => handleMultiSelectChange('preferred_contractors', contractor, 'professionals')}
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-6 border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center bg-gray-50">
                                  <Wrench className="h-10 w-10 text-gray-400 mb-2" />
                                  <h4 className="text-lg font-medium text-gray-700">No contractors yet</h4>
                                  <p className="text-sm text-gray-500 text-center max-w-md mt-1">
                                    Add contractors you've worked with for renovations and repairs
                                  </p>
                                  <Button
                                    type="button"
                                    className="mt-4 bg-[#803344] hover:bg-[#803344]/90 text-white"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Contractor
                                  </Button>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="lenders" className="mt-6">
                            <div className="relative">
                              <div className="flex items-center border border-gray-300 rounded-md p-2 mb-3 bg-white">
                                <Search className="h-4 w-4 mr-2 text-gray-400" />
                                <Input 
                                  id="search_lenders"
                                  className="border-0 focus:ring-0 p-0 h-8"
                                  placeholder="Search for a lender..."
                                />
                              </div>
                              
                              {profileData.preferred_lenders?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                  {profileData.preferred_lenders.map((lender, index) => (
                                    <div key={index} className="border border-gray-200 rounded-md p-3 flex items-start hover:shadow-sm transition-shadow bg-white">
                                      <Avatar className="h-10 w-10 mr-3">
                                        <AvatarFallback className="bg-[#803344] text-white">{lender.substring(0, 2).toUpperCase()}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 truncate">{lender}</p>
                                        <p className="text-xs text-gray-500 truncate">Lender • REP</p>
                                      </div>
                                      <button 
                                        type="button" 
                                        className="text-gray-400 hover:text-red-500 p-1 rounded-full"
                                        onClick={() => handleMultiSelectChange('preferred_lenders', lender, 'professionals')}
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-6 border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center bg-gray-50">
                                  <DollarSign className="h-10 w-10 text-gray-400 mb-2" />
                                  <h4 className="text-lg font-medium text-gray-700">No lenders yet</h4>
                                  <p className="text-sm text-gray-500 text-center max-w-md mt-1">
                                    Add lenders who can help finance your investment properties
                                  </p>
                                  <Button
                                    type="button"
                                    className="mt-4 bg-[#803344] hover:bg-[#803344]/90 text-white"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Lender
                                  </Button>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="inspectors" className="mt-6">
                            <div className="relative">
                              <div className="flex items-center border border-gray-300 rounded-md p-2 mb-3 bg-white">
                                <Search className="h-4 w-4 mr-2 text-gray-400" />
                                <Input 
                                  id="search_inspectors"
                                  className="border-0 focus:ring-0 p-0 h-8"
                                  placeholder="Search for an inspector..."
                                />
                              </div>
                              
                              {profileData.preferred_inspectors?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                  {profileData.preferred_inspectors.map((inspector, index) => (
                                    <div key={index} className="border border-gray-200 rounded-md p-3 flex items-start hover:shadow-sm transition-shadow bg-white">
                                      <Avatar className="h-10 w-10 mr-3">
                                        <AvatarFallback className="bg-[#803344] text-white">{inspector.substring(0, 2).toUpperCase()}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 truncate">{inspector}</p>
                                        <p className="text-xs text-gray-500 truncate">Inspector • REP</p>
                                      </div>
                                      <button 
                                        type="button" 
                                        className="text-gray-400 hover:text-red-500 p-1 rounded-full"
                                        onClick={() => handleMultiSelectChange('preferred_inspectors', inspector, 'professionals')}
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-6 border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center bg-gray-50">
                                  <FileCheck className="h-10 w-10 text-gray-400 mb-2" />
                                  <h4 className="text-lg font-medium text-gray-700">No inspectors yet</h4>
                                  <p className="text-sm text-gray-500 text-center max-w-md mt-1">
                                    Add property inspectors you trust to evaluate potential investments
                                  </p>
                                  <Button
                                    type="button"
                                    className="mt-4 bg-[#803344] hover:bg-[#803344]/90 text-white"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Inspector
                                  </Button>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                      
                      <div className="pt-6 flex justify-end border-t mt-8">
                        <Button 
                          type="submit" 
                          className={`flex items-center transition-all duration-200 ${
                            loading ? "bg-gray-400" : isProfessionalSectionModified ? "bg-[#09261E] hover:bg-[#09261E]/90" : "bg-gray-200 text-gray-500"
                          } text-white`}
                          disabled={loading || !isProfessionalSectionModified}
                        >
                          {loading ? (
                            <>
                              <span className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Professionals
                            </>
                          )}
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
                
                {/* Main Help Section (default view) */}
                {activeHelpSection === 'main' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* FAQ Card - Entire card is clickable */}
                      <div
                        onClick={() => navigateToHelpSection("faq")} 
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
                      </div>

                      {/* Suggestions Card - Entire card is clickable */}
                      <div
                        onClick={() => navigateToHelpSection("suggestions")} 
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
                      </div>

                      {/* Report a Problem Card - Entire card is clickable with red hover */}
                      <div
                        onClick={() => navigateToHelpSection("report")} 
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
                      </div>
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
                              onClick={() => window.open('mailto:support@propertydeals.com')}
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
                
                {/* FAQ Section */}
                {activeHelpSection === 'faq' && (
                  <>
                    <div className="mb-8">
                      <HelpFAQ />
                    </div>
                    <div className="flex justify-start mt-8">
                      <Button
                        variant="outline"
                        onClick={() => navigateToHelpSection('main')}
                        className="flex items-center"
                      >
                        <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                        Back to Help Center
                      </Button>
                    </div>
                  </>
                )}
                
                {/* Suggestions Section */}
                {activeHelpSection === 'suggestions' && (
                  <>
                    <div className="mb-8">
                      <HelpSuggestions />
                    </div>
                    <div className="flex justify-start mt-8">
                      <Button
                        variant="outline"
                        onClick={() => navigateToHelpSection('main')}
                        className="flex items-center"
                      >
                        <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                        Back to Help Center
                      </Button>
                    </div>
                  </>
                )}
                
                {/* Report a Problem Section */}
                {activeHelpSection === 'report' && (
                  <>
                    <div className="mb-8">
                      <HelpReport />
                    </div>
                    <div className="flex justify-start mt-8">
                      <Button
                        variant="outline"
                        onClick={() => navigateToHelpSection('main')}
                        className="flex items-center"
                      >
                        <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                        Back to Help Center
                      </Button>
                    </div>
                  </>
                )}
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

// Export the profile page with mobile routing integration
export default function ProfilePageWithMobileRouting() {
  const [location] = useLocation();
  
  // Section detection from URL
  const urlParts = location.split('/profile/');
  const currentSection = urlParts[1] || '';
  
  // Mobile settings menu titles
  const getSectionTitle = (section: string) => {
    const titles = {
      'account': 'Account',
      'property_preferences': 'Property Preferences', 
      'connections': 'Connections',
      'notifications': 'Notifications',
      'integrations': 'Integrations',
      'memberships': 'Memberships',
      'help': 'Help Center'
    };
    return titles[section as keyof typeof titles] || 'Settings';
  };

  // If we're on a specific section route, show mobile back navigation on mobile
  if (currentSection && currentSection !== 'profile') {
    return (
      <>
        {/* Mobile: Show section with back navigation */}
        <div className="md:hidden">
          <MobileSettingsSection 
            section={currentSection}
            title={getSectionTitle(currentSection)}
          >
            <div className="space-y-6">
              <ProfilePage />
            </div>
          </MobileSettingsSection>
        </div>
        
        {/* Desktop: Show normal profile page */}
        <div className="hidden md:block">
          <ProfilePage />
        </div>
      </>
    );
  }

  // If we're on /profile, show mobile menu on mobile and desktop layout on desktop
  return (
    <>
      {/* Mobile: Show settings menu */}
      <div className="md:hidden">
        <MobileSettingsMenu />
      </div>
      
      {/* Desktop: Show normal profile page */}
      <div className="hidden md:block">
        <ProfilePage />
      </div>
    </>
  );
}