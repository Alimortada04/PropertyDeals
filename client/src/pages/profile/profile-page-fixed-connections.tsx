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
import ConnectionsTab from "./connections-tab";
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
  MoreVertical,
  UserMinus,
  Ban,
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
    past_properties: [],
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
  
  // Handler functions for profile picture and banner uploads
  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setLoading(true);
      
      if (file.size > 5000000) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-profile-${Math.random()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const url = `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile-photos/${fileName}`;
      
      // Save to profile
      setProfileData(prev => ({
        ...prev,
        profile_photo_url: url
      }));
      
      // Update profile in database
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profile_photo_url: url
        })
      });
      
      toast({
        title: "Profile photo updated",
        description: "Your profile photo has been updated successfully",
      });
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your profile photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setLoading(true);
      
      if (file.size > 5000000) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-banner-${Math.random()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('profile-banners')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const url = `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile-banners/${fileName}`;
      
      // Save to profile
      setProfileData(prev => ({
        ...prev,
        profile_banner_url: url
      }));
      
      // Update profile in database
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profile_banner_url: url
        })
      });
      
      toast({
        title: "Profile banner updated",
        description: "Your profile banner has been updated successfully",
      });
    } catch (error) {
      console.error('Error uploading profile banner:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your profile banner. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Form input change handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setIsProfileSectionModified(true);
  };
  
  const handlePropertyPreferencesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setIsPropertySectionModified(true);
  };
  
  // Handle array form fields (checkboxes)
  const handleArrayFieldChange = (field: string, value: string, checked: boolean) => {
    setProfileData(prev => {
      const currentValues = [...(prev[field] || [])];
      
      if (checked && !currentValues.includes(value)) {
        return { ...prev, [field]: [...currentValues, value] };
      } else if (!checked && currentValues.includes(value)) {
        return { ...prev, [field]: currentValues.filter(v => v !== value) };
      }
      
      return prev;
    });
    
    if (['property_types', 'property_conditions', 'financing_methods'].includes(field)) {
      setIsPropertySectionModified(true);
    } else {
      setIsProfileSectionModified(true);
    }
  };
  
  // Handle social profiles
  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setIsProfileSectionModified(true);
  };
  
  // Save profile changes
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      // Validate username - should be at least 3 characters, alphanumeric with _ only
      if (profileData.username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(profileData.username)) {
        toast({
          title: "Invalid username",
          description: "Username must be at least 3 characters and contain only letters, numbers, and underscores.",
          variant: "destructive",
        });
        return;
      }
      
      // Save profile to API
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: profileData.full_name,
          bio: profileData.bio,
          username: profileData.username,
          phone: profileData.phone,
          in_real_estate_since: profileData.in_real_estate_since,
          business_name: profileData.business_name,
          type_of_buyer: profileData.type_of_buyer,
          website: profileData.website,
          instagram: profileData.instagram,
          facebook: profileData.facebook,
          linkedin: profileData.linkedin,
          location: profileData.location,
          showProfile: profileData.showProfile
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save profile");
      }
      
      setIsProfileSectionModified(false);
      
      // Invalidate the profile query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Update failed",
        description: `There was an error updating your profile: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Save property preferences changes
  const handleSavePropertyPreferences = async () => {
    try {
      setLoading(true);
      
      // Validate budget - min should be less than max
      if (profileData.ideal_budget_min && profileData.ideal_budget_max && 
          Number(profileData.ideal_budget_min) >= Number(profileData.ideal_budget_max)) {
        toast({
          title: "Invalid budget range",
          description: "Minimum budget must be less than maximum budget.",
          variant: "destructive",
        });
        return;
      }
      
      // Save property preferences to API
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
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
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save property preferences");
      }
      
      setIsPropertySectionModified(false);
      
      // Invalidate the profile query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      
      toast({
        title: "Preferences updated",
        description: "Your property preferences have been updated successfully",
      });
    } catch (error) {
      console.error("Error saving property preferences:", error);
      toast({
        title: "Update failed",
        description: `There was an error updating your preferences: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate completion percentage
  const calculateCompletionPercentage = (data: ProfileData) => {
    const requiredFields = [
      'full_name', 
      'bio', 
      'username', 
      'email', 
      'phone', 
      'location', 
      'profile_photo_url'
    ];
    
    const optionalFields = [
      'in_real_estate_since',
      'business_name',
      'website',
      'instagram',
      'facebook',
      'linkedin',
      'property_types',
      'markets',
      'financing_methods'
    ];
    
    let score = 0;
    let total = requiredFields.length + optionalFields.length;
    
    // Check required fields (higher weight)
    requiredFields.forEach(field => {
      if (data[field]) score += 1;
    });
    
    // Check optional fields (lower weight)
    optionalFields.forEach(field => {
      if (Array.isArray(data[field])) {
        if (data[field].length > 0) score += 0.5;
      } else if (data[field]) score += 0.5;
    });
    
    return Math.round((score / (requiredFields.length + (optionalFields.length * 0.5))) * 100);
  };
  
  useEffect(() => {
    // Update profile completion score whenever profileData changes
    const completionScore = calculateCompletionPercentage(profileData);
    if (completionScore !== profileData.profile_completion_score) {
      setProfileData(prev => ({
        ...prev,
        profile_completion_score: completionScore
      }));
    }
  }, [profileData.full_name, profileData.bio, profileData.username, profileData.email, 
      profileData.phone, profileData.location, profileData.profile_photo_url,
      profileData.in_real_estate_since, profileData.business_name, profileData.website,
      profileData.instagram, profileData.facebook, profileData.linkedin,
      profileData.property_types, profileData.markets, profileData.financing_methods]);
  
  return (
    <div className={styles.profilePage}>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar with profile summary and navigation */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="sticky top-24">
              <div className="mb-6 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Profile quick view */}
                <div className="p-4 text-center">
                  <div className="relative inline-block mx-auto mb-4">
                    <Avatar className="h-20 w-20 mx-auto">
                      {profileData.profile_photo_url ? (
                        <AvatarImage src={profileData.profile_photo_url} alt={profileData.full_name} />
                      ) : (
                        <AvatarFallback className="bg-[#09261E] text-white">
                          {profileData.full_name?.split(' ').map((n: string) => n[0]).join('') || 'PD'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <button
                      className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-200 shadow-sm text-gray-500 hover:text-[#09261E]"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleProfilePhotoUpload}
                      />
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={bannerInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleBannerUpload}
                  />
                  <h2 className="text-lg font-semibold text-gray-900 mb-0.5">{profileData.full_name || 'Your Name'}</h2>
                  <p className="text-sm text-gray-500 mb-2">
                    {profileData.location ? (
                      <span className="flex items-center justify-center">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        {profileData.location}
                      </span>
                    ) : (
                      <span className="italic text-gray-400">Add your location</span>
                    )}
                  </p>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 mt-2"
                    onClick={() => window.open('/profile/preview', '_blank')}
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    Preview Profile
                  </Button>
                </div>
                
                {/* Profile completion progress */}
                <div className="border-t border-gray-200 px-4 py-3">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-gray-700">Profile Completion</span>
                    <span className="text-xs font-medium text-gray-700">{profileData.profile_completion_score || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-[#09261E] h-1.5 rounded-full" 
                      style={{ width: `${profileData.profile_completion_score || 0}%` }}
                    ></div>
                  </div>
                  {profileData.profile_completion_score < 100 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Complete your profile to increase visibility and build trust with potential partners.
                    </p>
                  )}
                </div>
              </div>
              
              {/* Navigation menu */}
              <nav className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                <div className="p-2">
                  <ProfileMenuItem
                    icon={<UserCircle className="h-5 w-5" />}
                    label="Account"
                    active={activeTab === "account"}
                    onClick={() => handleTabChange("account")}
                  />
                  <ProfileMenuItem
                    icon={<Building className="h-5 w-5" />}
                    label="Property Preferences"
                    active={activeTab === "property_preferences"}
                    onClick={() => handleTabChange("property_preferences")}
                  />
                  <ProfileMenuItem
                    icon={<Users className="h-5 w-5" />}
                    label="Connections"
                    active={activeTab === "connections"}
                    onClick={() => handleTabChange("connections")}
                  />
                  <ProfileMenuItem
                    icon={<Bell className="h-5 w-5" />}
                    label="Notifications"
                    active={activeTab === "notifications"}
                    onClick={() => handleTabChange("notifications")}
                  />
                  <ProfileMenuItem
                    icon={<LinkIcon className="h-5 w-5" />}
                    label="Integrations"
                    active={activeTab === "integrations"}
                    onClick={() => handleTabChange("integrations")}
                  />
                  <ProfileMenuItem
                    icon={<CreditCard className="h-5 w-5" />}
                    label="Memberships"
                    active={activeTab === "memberships"}
                    onClick={() => handleTabChange("memberships")}
                  />
                  <ProfileMenuItem
                    icon={<Shield className="h-5 w-5" />}
                    label="Security"
                    active={activeTab === "security"}
                    onClick={() => handleTabChange("security")}
                  />
                  <ProfileMenuItem
                    icon={<HelpCircle className="h-5 w-5" />}
                    label="Help Center"
                    active={activeTab === "help"}
                    onClick={() => handleTabChange("help")}
                  />
                </div>
                <div className="border-t border-gray-200 p-2">
                  <ProfileMenuItem
                    icon={<LogOut className="h-5 w-5" />}
                    label="Log Out"
                    onClick={() => {
                      if (confirm("Are you sure you want to log out?")) {
                        logoutMutation.mutate();
                      }
                    }}
                    danger
                  />
                </div>
              </nav>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1 min-w-0">
            {/* Account Settings */}
            {activeTab === "account" && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="text-xl font-bold">Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account information, profile, and public visibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                    <div className="space-y-6">
                      {/* Basic information */}
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                              id="full_name"
                              name="full_name"
                              value={profileData.full_name || ''}
                              onChange={handleProfileChange}
                              placeholder="Your full name"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="username">
                              Username
                              {isCheckingUsername && <span className="ml-2 text-xs text-gray-500">(Checking...)</span>}
                            </Label>
                            <Input
                              id="username"
                              name="username"
                              value={profileData.username || ''}
                              onChange={(e) => {
                                handleProfileChange(e);
                                
                                // Username validation logic
                                const username = e.target.value;
                                if (username === user?.username) {
                                  setIsUsernameAvailable(true);
                                  setUsernameMessage("");
                                  return;
                                }
                                
                                if (username.length < 3) {
                                  setIsUsernameAvailable(false);
                                  setUsernameMessage("Username must be at least 3 characters long");
                                  return;
                                }
                                
                                if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                                  setIsUsernameAvailable(false);
                                  setUsernameMessage("Username can only contain letters, numbers, and underscores");
                                  return;
                                }
                                
                                // Check if username is available (using API)
                                // This would be an async operation in a real app
                                setIsCheckingUsername(true);
                                setTimeout(() => {
                                  const isAvailable = true; // Mock check, replace with API call
                                  setIsUsernameAvailable(isAvailable);
                                  setUsernameMessage(isAvailable ? "Username is available" : "Username is already taken");
                                  setIsCheckingUsername(false);
                                }, 500);
                              }}
                              placeholder="username"
                              required
                              className={usernameMessage ? isUsernameAvailable ? "border-green-500 focus:ring-green-500" : "border-red-500 focus:ring-red-500" : ""}
                            />
                            {usernameMessage && (
                              <p className={`text-xs ${isUsernameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                {usernameMessage}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Profile Visibility */}
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 mb-4">Profile Visibility</h3>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="profile-visibility"
                            checked={profileData.showProfile}
                            onCheckedChange={(checked) => {
                              setProfileData(prev => ({
                                ...prev,
                                showProfile: checked
                              }));
                              setIsProfileSectionModified(true);
                            }}
                          />
                          <Label htmlFor="profile-visibility">Make my profile visible to other users</Label>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          When disabled, your profile will be hidden from search results and other users won't be able to view your profile information.
                        </p>
                      </div>
                      
                      {/* Bio */}
                      <div>
                        <Label htmlFor="bio" className="font-medium text-gray-900 mb-2 block">About You</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={profileData.bio || ''}
                          onChange={handleProfileChange}
                          placeholder="Tell others a bit about yourself and your real estate interests..."
                          rows={5}
                          className="resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          This will be displayed on your public profile. Share your experience, interests, and what you're looking for.
                        </p>
                      </div>
                      
                      {/* Contact Information */}
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 mb-4">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              name="email"
                              value={profileData.email || ''}
                              readOnly
                              disabled
                              className="bg-gray-50"
                            />
                            <p className="text-xs text-gray-500">
                              Email can only be changed in security settings
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={profileData.phone || ''}
                              onChange={handleProfileChange}
                              placeholder="(555) 123-4567"
                              type="tel"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              name="location"
                              value={profileData.location || ''}
                              onChange={handleProfileChange}
                              placeholder="City, State"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                              id="website"
                              name="website"
                              value={profileData.website || ''}
                              onChange={handleProfileChange}
                              placeholder="https://yoursite.com"
                              type="url"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Professional Information */}
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 mb-4">Professional Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="in_real_estate_since">In Real Estate Since</Label>
                            <Input
                              id="in_real_estate_since"
                              name="in_real_estate_since"
                              value={profileData.in_real_estate_since || ''}
                              onChange={handleProfileChange}
                              placeholder="2018"
                              type="number"
                              min={1900}
                              max={new Date().getFullYear()}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="business_name">Business Name</Label>
                            <Input
                              id="business_name"
                              name="business_name"
                              value={profileData.business_name || ''}
                              onChange={handleProfileChange}
                              placeholder="Your business name (if applicable)"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Type of Buyer */}
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 mb-4">Type of Buyer</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                          {buyerTypeOptions.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <Checkbox
                                id={`buyer-type-${option}`}
                                checked={profileData.type_of_buyer?.includes(option)}
                                onCheckedChange={(checked) => 
                                  handleArrayFieldChange('type_of_buyer', option, checked as boolean)
                                }
                              />
                              <Label
                                htmlFor={`buyer-type-${option}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Social Media Profiles */}
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 mb-4">Social Media Profiles</h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-center">
                            <div className="w-12 flex-shrink-0">
                              <Instagram className="h-6 w-6 text-[#E1306C]" />
                            </div>
                            <div className="flex-1">
                              <Input
                                id="instagram"
                                name="instagram"
                                value={profileData.instagram || ''}
                                onChange={handleSocialChange}
                                placeholder="instagram_username"
                                className="border-gray-300"
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="w-12 flex-shrink-0">
                              <FacebookIcon className="h-6 w-6 text-[#1877F2]" />
                            </div>
                            <div className="flex-1">
                              <Input
                                id="facebook"
                                name="facebook"
                                value={profileData.facebook || ''}
                                onChange={handleSocialChange}
                                placeholder="facebook_username"
                                className="border-gray-300"
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="w-12 flex-shrink-0">
                              <Linkedin className="h-6 w-6 text-[#0077B5]" />
                            </div>
                            <div className="flex-1">
                              <Input
                                id="linkedin"
                                name="linkedin"
                                value={profileData.linkedin || ''}
                                onChange={handleSocialChange}
                                placeholder="linkedin_username"
                                className="border-gray-300"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Save Button */}
                      <div className="flex justify-end pt-4">
                        <Button 
                          type="submit" 
                          disabled={!isProfileSectionModified || loading || !isUsernameAvailable}
                          className="bg-[#09261E] hover:bg-[#09261E]/90"
                        >
                          {loading ? (
                            <>
                              <span className="animate-spin mr-2">
                                <svg className="h-4 w-4" viewBox="0 0 24 24">
                                  <circle 
                                    className="opacity-25" 
                                    cx="12" 
                                    cy="12" 
                                    r="10" 
                                    stroke="currentColor" 
                                    strokeWidth="4" 
                                    fill="none" 
                                  />
                                  <path 
                                    className="opacity-75" 
                                    fill="currentColor" 
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                                  />
                                </svg>
                              </span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
            
            {/* Property Preferences */}
            {activeTab === "property_preferences" && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="text-xl font-bold">Property Preferences</CardTitle>
                  <CardDescription>
                    Tell us about the properties you're interested in to help us match you with the right opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={(e) => { e.preventDefault(); handleSavePropertyPreferences(); }}>
                    <div className="space-y-6">
                      {/* Markets */}
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 mb-2">Target Markets</h3>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500">
                            Enter the cities, counties, or neighborhoods you're interested in. Separate each with a comma.
                          </p>
                          <Textarea
                            id="markets"
                            name="markets"
                            value={Array.isArray(profileData.markets) ? profileData.markets.join(", ") : ""}
                            onChange={(e) => {
                              const marketsArray = e.target.value.split(",").map(market => market.trim()).filter(Boolean);
                              setProfileData(prev => ({
                                ...prev,
                                markets: marketsArray
                              }));
                              setIsPropertySectionModified(true);
                            }}
                            placeholder="Milwaukee, Madison, Green Bay, etc."
                            className="resize-none"
                          />
                        </div>
                      </div>
                      
                      {/* Property Types */}
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 mb-4">Property Types</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                          {propertyTypeOptions.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <Checkbox
                                id={`property-type-${option}`}
                                checked={profileData.property_types?.includes(option)}
                                onCheckedChange={(checked) => 
                                  handleArrayFieldChange('property_types', option, checked as boolean)
                                }
                              />
                              <Label
                                htmlFor={`property-type-${option}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Property Conditions */}
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 mb-4">Property Conditions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                          {propertyConditionOptions.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <Checkbox
                                id={`property-condition-${option}`}
                                checked={profileData.property_conditions?.includes(option)}
                                onCheckedChange={(checked) => 
                                  handleArrayFieldChange('property_conditions', option, checked as boolean)
                                }
                              />
                              <Label
                                htmlFor={`property-condition-${option}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Budget Range */}
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 mb-4">Budget Range</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="ideal_budget_min">Minimum Budget</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input
                                id="ideal_budget_min"
                                name="ideal_budget_min"
                                value={profileData.ideal_budget_min || ''}
                                onChange={handlePropertyPreferencesChange}
                                placeholder="100,000"
                                type="number"
                                min={0}
                                className="pl-10"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="ideal_budget_max">Maximum Budget</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input
                                id="ideal_budget_max"
                                name="ideal_budget_max"
                                value={profileData.ideal_budget_max || ''}
                                onChange={handlePropertyPreferencesChange}
                                placeholder="500,000"
                                type="number"
                                min={0}
                                className="pl-10"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Financing Methods */}
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 mb-4">Financing Methods</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                          {financingMethodOptions.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <Checkbox
                                id={`financing-method-${option}`}
                                checked={profileData.financing_methods?.includes(option)}
                                onCheckedChange={(checked) => 
                                  handleArrayFieldChange('financing_methods', option, checked as boolean)
                                }
                              />
                              <Label
                                htmlFor={`financing-method-${option}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Preferred Financing Method */}
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 mb-4">Preferred Financing Method</h3>
                        <div className="space-y-2">
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
                            <SelectTrigger className="w-full md:w-1/2">
                              <SelectValue placeholder="Select preferred financing" />
                            </SelectTrigger>
                            <SelectContent>
                              {financingMethodOptions.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-gray-500">
                            Select your preferred financing method from the options above
                          </p>
                        </div>
                      </div>
                      
                      {/* Closing Timeline */}
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 mb-4">Preferred Closing Timeline</h3>
                        <div className="space-y-2">
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
                            <SelectTrigger className="w-full md:w-1/2">
                              <SelectValue placeholder="Select closing timeline" />
                            </SelectTrigger>
                            <SelectContent>
                              {closingTimelineOptions.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {/* Deal Metrics */}
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 mb-4">Your Deal Metrics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="number_of_deals_last_12_months">Deals in the Last 12 Months</Label>
                            <Input
                              id="number_of_deals_last_12_months"
                              name="number_of_deals_last_12_months"
                              value={profileData.number_of_deals_last_12_months || ''}
                              onChange={handlePropertyPreferencesChange}
                              placeholder="0"
                              type="number"
                              min={0}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="goal_deals_next_12_months">Goal for Next 12 Months</Label>
                            <Input
                              id="goal_deals_next_12_months"
                              name="goal_deals_next_12_months"
                              value={profileData.goal_deals_next_12_months || ''}
                              onChange={handlePropertyPreferencesChange}
                              placeholder="0"
                              type="number"
                              min={0}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="total_deals_done">Total Deals Done</Label>
                            <Input
                              id="total_deals_done"
                              name="total_deals_done"
                              value={profileData.total_deals_done || ''}
                              onChange={handlePropertyPreferencesChange}
                              placeholder="0"
                              type="number"
                              min={0}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="current_portfolio_count">Current Portfolio Size</Label>
                            <Input
                              id="current_portfolio_count"
                              name="current_portfolio_count"
                              value={profileData.current_portfolio_count || ''}
                              onChange={handlePropertyPreferencesChange}
                              placeholder="0"
                              type="number"
                              min={0}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Save Button */}
                      <div className="flex justify-end pt-4">
                        <Button 
                          type="submit" 
                          disabled={!isPropertySectionModified || loading}
                          className="bg-[#09261E] hover:bg-[#09261E]/90"
                        >
                          {loading ? (
                            <>
                              <span className="animate-spin mr-2">
                                <svg className="h-4 w-4" viewBox="0 0 24 24">
                                  <circle 
                                    className="opacity-25" 
                                    cx="12" 
                                    cy="12" 
                                    r="10" 
                                    stroke="currentColor" 
                                    strokeWidth="4" 
                                    fill="none" 
                                  />
                                  <path 
                                    className="opacity-75" 
                                    fill="currentColor" 
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                                  />
                                </svg>
                              </span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
            
            {/* Connections Tab */}
            {activeTab === "connections" && (
              <ConnectionsTab profileData={profileData} loading={loading} />
            )}
            
            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="text-xl font-bold">Notification Settings</CardTitle>
                  <CardDescription>
                    Manage how and when you receive notifications from PropertyDeals
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form>
                    <div className="space-y-6">
                      {/* Email Notifications */}
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 mb-4">Email Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <Label className="font-medium text-base">New Messages</Label>
                              <p className="text-sm text-gray-500">
                                Receive an email when someone sends you a message
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex justify-between items-start">
                            <div>
                              <Label className="font-medium text-base">Connection Requests</Label>
                              <p className="text-sm text-gray-500">
                                Receive an email when someone wants to connect with you
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex justify-between items-start">
                            <div>
                              <Label className="font-medium text-base">Property Alerts</Label>
                              <p className="text-sm text-gray-500">
                                Receive an email when new properties match your criteria
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex justify-between items-start">
                            <div>
                              <Label className="font-medium text-base">Deal Updates</Label>
                              <p className="text-sm text-gray-500">
                                Receive an email when there are updates to your deals
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex justify-between items-start">
                            <div>
                              <Label className="font-medium text-base">Marketing Emails</Label>
                              <p className="text-sm text-gray-500">
                                Receive emails about PropertyDeals news, tips, and special offers
                              </p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      </div>
                      
                      {/* In-App Notifications */}
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 mb-4">In-App Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <Label className="font-medium text-base">New Messages</Label>
                              <p className="text-sm text-gray-500">
                                Receive a notification when someone sends you a message
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex justify-between items-start">
                            <div>
                              <Label className="font-medium text-base">Connection Activity</Label>
                              <p className="text-sm text-gray-500">
                                Receive a notification when someone accepts your connection request or connects with you
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex justify-between items-start">
                            <div>
                              <Label className="font-medium text-base">Property Matches</Label>
                              <p className="text-sm text-gray-500">
                                Receive a notification when new properties match your criteria
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex justify-between items-start">
                            <div>
                              <Label className="font-medium text-base">Deal Activity</Label>
                              <p className="text-sm text-gray-500">
                                Receive a notification when there are updates to your deals
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                      
                      {/* Notification Schedule */}
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 mb-4">Email Digest Schedule</h3>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500">
                            Choose how often you would like to receive email digests
                          </p>
                          <RadioGroup defaultValue="daily" className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="real-time" id="real-time" />
                              <Label htmlFor="real-time">Real-time (Immediate)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="daily" id="daily" />
                              <Label htmlFor="daily">Daily Digest</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="weekly" id="weekly" />
                              <Label htmlFor="weekly">Weekly Digest</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                      
                      {/* Save Button */}
                      <div className="flex justify-end pt-4">
                        <Button 
                          className="bg-[#09261E] hover:bg-[#09261E]/90"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Preferences
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
            
            {/* Integrations Tab */}
            {activeTab === "integrations" && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="text-xl font-bold">Connected Accounts & Integrations</CardTitle>
                  <CardDescription>
                    Connect your PropertyDeals account with other services and tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Social Account Connections */}
                    <div>
                      <h3 className="font-medium text-lg text-gray-900 mb-4">Connected Social Accounts</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white mr-4">
                              <FacebookIcon className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-medium">Facebook</h4>
                              <p className="text-sm text-gray-500">Not connected</p>
                            </div>
                          </div>
                          <Button variant="outline">Connect</Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-[#0077B5] flex items-center justify-center text-white mr-4">
                              <Linkedin className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-medium">LinkedIn</h4>
                              <p className="text-sm text-gray-500">Connected as John Smith</p>
                            </div>
                          </div>
                          <Button variant="outline">Disconnect</Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] flex items-center justify-center text-white mr-4">
                              <Instagram className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-medium">Instagram</h4>
                              <p className="text-sm text-gray-500">Not connected</p>
                            </div>
                          </div>
                          <Button variant="outline">Connect</Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tool Integrations */}
                    <div>
                      <h3 className="font-medium text-lg text-gray-900 mb-4">Tool Integrations</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-[#1AB394] flex items-center justify-center text-white mr-4">
                              <FileCheck className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-medium">DocuSign</h4>
                              <p className="text-sm text-gray-500">Sign documents electronically</p>
                            </div>
                          </div>
                          <Button variant="outline">Connect</Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-[#0061D5] flex items-center justify-center text-white mr-4">
                              <FileCheck className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-medium">Box</h4>
                              <p className="text-sm text-gray-500">Cloud storage for documents</p>
                            </div>
                          </div>
                          <Button variant="outline">Connect</Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-[#4285F4] flex items-center justify-center text-white mr-4">
                              <FileCheck className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-medium">Google Calendar</h4>
                              <p className="text-sm text-gray-500">Sync your appointments and meetings</p>
                            </div>
                          </div>
                          <Button variant="outline">Connect</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Memberships Tab */}
            {activeTab === "memberships" && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="text-xl font-bold">Membership & Billing</CardTitle>
                  <CardDescription>
                    Manage your PropertyDeals membership and billing information
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Current Plan */}
                    <div>
                      <h3 className="font-medium text-lg text-gray-900 mb-4">Current Plan</h3>
                      <div className="p-4 border rounded-lg bg-[#09261E]/5">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-[#09261E]">Free Plan</h4>
                            <p className="text-sm text-gray-600">Basic access to PropertyDeals</p>
                          </div>
                          <Badge variant="outline" className="bg-[#09261E]/10 text-[#09261E] border-0">
                            Current Plan
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mt-4">
                          <div className="flex items-center">
                            <Check className="h-4 w-4 text-[#09261E] mr-2" />
                            <span className="text-sm">Browse property listings</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="h-4 w-4 text-[#09261E] mr-2" />
                            <span className="text-sm">Create a basic profile</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="h-4 w-4 text-[#09261E] mr-2" />
                            <span className="text-sm">Connect with up to 5 people per month</span>
                          </div>
                          <div className="flex items-center">
                            <X className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500">Advanced property analysis tools</span>
                          </div>
                          <div className="flex items-center">
                            <X className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500">Priority in search results</span>
                          </div>
                          <div className="flex items-center">
                            <X className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500">Verified buyer/seller badge</span>
                          </div>
                        </div>
                        
                        <Button className="mt-4 bg-[#09261E] hover:bg-[#09261E]/90">Upgrade Now</Button>
                      </div>
                    </div>
                    
                    {/* Available Plans */}
                    <div>
                      <h3 className="font-medium text-lg text-gray-900 mb-4">Available Plans</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium text-lg mb-1">Pro Plan</h4>
                          <p className="text-2xl font-bold mb-2">$29<span className="text-sm font-normal text-gray-500">/month</span></p>
                          <p className="text-sm text-gray-600 mb-4">Enhanced features for serious investors</p>
                          
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">All Free Plan features</span>
                            </div>
                            <div className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">Advanced property analysis tools</span>
                            </div>
                            <div className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">Unlimited connections</span>
                            </div>
                            <div className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">Enhanced profile visibility</span>
                            </div>
                          </div>
                          
                          <Button variant="outline" className="mt-4 w-full">
                            Choose Pro
                          </Button>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium text-lg mb-1">Enterprise Plan</h4>
                          <p className="text-2xl font-bold mb-2">$99<span className="text-sm font-normal text-gray-500">/month</span></p>
                          <p className="text-sm text-gray-600 mb-4">Complete solution for businesses</p>
                          
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">All Pro Plan features</span>
                            </div>
                            <div className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">Team account with multiple seats</span>
                            </div>
                            <div className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">Priority support</span>
                            </div>
                            <div className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">Custom branding options</span>
                            </div>
                          </div>
                          
                          <Button variant="outline" className="mt-4 w-full">
                            Choose Enterprise
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Payment Methods */}
                    <div>
                      <h3 className="font-medium text-lg text-gray-900 mb-4">Payment Methods</h3>
                      <div className="p-6 border rounded-lg text-center">
                        <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No Payment Methods Added</h4>
                        <p className="text-gray-500 mb-4">
                          You don't have any payment methods linked to your account yet.
                        </p>
                        <Button variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Payment Method
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Security Tab */}
            {activeTab === "security" && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="text-xl font-bold">Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and privacy settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Change Password */}
                    <div>
                      <h3 className="font-medium text-lg text-gray-900 mb-4">Password</h3>
                      <form className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                        <Button className="bg-[#09261E] hover:bg-[#09261E]/90">
                          Update Password
                        </Button>
                      </form>
                    </div>
                    
                    {/* Two-Factor Authentication */}
                    <div>
                      <h3 className="font-medium text-lg text-gray-900 mb-4">Two-Factor Authentication</h3>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-700 mb-1">Enable two-factor authentication for enhanced security</p>
                          <p className="text-sm text-gray-500">
                            Add an extra layer of security to your account by requiring both your password and a verification code from your mobile phone.
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                    
                    {/* Login History */}
                    <div>
                      <h3 className="font-medium text-lg text-gray-900 mb-4">Recent Login Activity</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center">
                          <div>
                            <p className="font-medium">Milwaukee, WI, United States</p>
                            <p className="text-sm text-gray-500">Today, 11:32 AM · Chrome on Windows</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Current</Badge>
                        </div>
                        <div className="p-4 border-b flex justify-between items-center">
                          <div>
                            <p className="font-medium">Milwaukee, WI, United States</p>
                            <p className="text-sm text-gray-500">Yesterday, 9:14 PM · Safari on macOS</p>
                          </div>
                        </div>
                        <div className="p-4 border-b flex justify-between items-center">
                          <div>
                            <p className="font-medium">Chicago, IL, United States</p>
                            <p className="text-sm text-gray-500">May 4, 2025, 2:56 PM · Chrome on Android</p>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="mt-4">
                        View Full Login History
                      </Button>
                    </div>
                    
                    {/* Account Deletion */}
                    <div>
                      <h3 className="font-medium text-lg text-gray-900 mb-4">Delete Account</h3>
                      <div className="p-4 border rounded-lg bg-red-50">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-800 mb-1">Permanently Delete Your Account</p>
                            <p className="text-sm text-red-700 mb-4">
                              Once you delete your account, there is no going back. All of your data will be permanently removed.
                            </p>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                  <Trash className="h-4 w-4 mr-2" />
                                  Delete Account
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your account and remove all of your data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                    Delete Account
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Help Tab */}
            {activeTab === "help" && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="text-xl font-bold">Help Center</CardTitle>
                  <CardDescription>
                    Find answers, get help, and share your feedback
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {activeHelpSection === 'main' && (
                    <div className="space-y-6">
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          placeholder="Search for help topics..." 
                          className="pl-10"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="cursor-pointer hover:shadow-md transition" onClick={() => navigateToHelpSection('faq')}>
                          <CardContent className="p-6 text-center">
                            <HelpCircle className="h-10 w-10 mx-auto text-[#09261E] mb-3" />
                            <CardTitle className="text-lg mb-2">FAQs</CardTitle>
                            <p className="text-sm text-gray-500">
                              Browse our frequently asked questions and quick guides
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card className="cursor-pointer hover:shadow-md transition" onClick={() => navigateToHelpSection('report')}>
                          <CardContent className="p-6 text-center">
                            <AlertTriangle className="h-10 w-10 mx-auto text-[#09261E] mb-3" />
                            <CardTitle className="text-lg mb-2">Report an Issue</CardTitle>
                            <p className="text-sm text-gray-500">
                              Report a problem or contact our support team
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card className="cursor-pointer hover:shadow-md transition" onClick={() => navigateToHelpSection('suggestions')}>
                          <CardContent className="p-6 text-center">
                            <MessageSquare className="h-10 w-10 mx-auto text-[#09261E] mb-3" />
                            <CardTitle className="text-lg mb-2">Suggestions</CardTitle>
                            <p className="text-sm text-gray-500">
                              Share your ideas to help us improve PropertyDeals
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 mb-4">Popular Topics</h3>
                        <div className="space-y-2">
                          <Button variant="ghost" className="w-full justify-start" onClick={() => navigateToHelpSection('faq')}>
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Getting started with PropertyDeals
                          </Button>
                          <Button variant="ghost" className="w-full justify-start" onClick={() => navigateToHelpSection('faq')}>
                            <ArrowRight className="h-4 w-4 mr-2" />
                            How to connect with other investors
                          </Button>
                          <Button variant="ghost" className="w-full justify-start" onClick={() => navigateToHelpSection('faq')}>
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Understanding property analysis tools
                          </Button>
                          <Button variant="ghost" className="w-full justify-start" onClick={() => navigateToHelpSection('faq')}>
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Listing your property for sale
                          </Button>
                          <Button variant="ghost" className="w-full justify-start" onClick={() => navigateToHelpSection('faq')}>
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Account settings and security
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeHelpSection === 'faq' && <HelpFAQ onBack={() => setActiveHelpSection('main')} />}
                  {activeHelpSection === 'report' && <HelpReport onBack={() => setActiveHelpSection('main')} />}
                  {activeHelpSection === 'suggestions' && <HelpSuggestions onBack={() => setActiveHelpSection('main')} />}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}