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
  UserMinus,
  MoreVertical,
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
  
  // Profile photo upload handler
  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileSize = file.size / 1024 / 1024; // Convert to MB
    
    if (fileSize > 5) {
      toast({
        title: "File too large",
        description: "Profile photo must be less than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Display loading state
    setLoading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `profile-${Date.now()}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;
      
      // Upload to Supabase Storage
      const { error } = await supabase.storage.from('user-content').upload(filePath, file);
      
      if (error) throw error;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage.from('user-content').getPublicUrl(filePath);
      
      if (!publicUrlData || !publicUrlData.publicUrl) throw new Error("Failed to get public URL");
      
      // Update profile data in local state
      setProfileData(prev => ({
        ...prev,
        profile_photo_url: publicUrlData.publicUrl
      }));
      
      setIsProfileSectionModified(true);
      
      toast({
        title: "Photo uploaded",
        description: "Your profile photo has been updated",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Banner upload handler
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileSize = file.size / 1024 / 1024; // Convert to MB
    
    if (fileSize > 10) {
      toast({
        title: "File too large",
        description: "Banner image must be less than 10MB",
        variant: "destructive",
      });
      return;
    }
    
    // Display loading state
    setLoading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `banner-${Date.now()}.${fileExt}`;
      const filePath = `profile-banners/${fileName}`;
      
      // Upload to Supabase Storage
      const { error } = await supabase.storage.from('user-content').upload(filePath, file);
      
      if (error) throw error;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage.from('user-content').getPublicUrl(filePath);
      
      if (!publicUrlData || !publicUrlData.publicUrl) throw new Error("Failed to get public URL");
      
      // Update profile data in local state
      setProfileData(prev => ({
        ...prev,
        profile_banner_url: publicUrlData.publicUrl
      }));
      
      setIsProfileSectionModified(true);
      
      toast({
        title: "Banner uploaded",
        description: "Your profile banner has been updated",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your banner. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle field changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsProfileSectionModified(true);
  };

  // Handle checkbox or multi-select changes
  const handleArrayFieldChange = (field: string, value: string, checked: boolean) => {
    setProfileData(prev => {
      const currentValues = prev[field] || [];
      let newValues;
      
      if (checked) {
        newValues = [...currentValues, value];
      } else {
        newValues = currentValues.filter(v => v !== value);
      }
      
      return {
        ...prev,
        [field]: newValues
      };
    });
    
    // Set the appropriate modified flag
    if (field === 'markets' || field === 'property_types' || field === 'property_conditions' || field === 'financing_methods') {
      setIsPropertySectionModified(true);
    } else {
      setIsProfileSectionModified(true);
    }
  };

  // Handle checkbox single value
  const handleCheckboxChange = (field: string, checked: boolean) => {
    setProfileData(prev => ({
      ...prev,
      [field]: checked
    }));
    setIsProfileSectionModified(true);
  };

  // Save profile changes
  const saveProfileMutation = useMutation({
    mutationFn: async (data: Partial<ProfileData>) => {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      setIsProfileSectionModified(false);
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: `There was an error updating your profile: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Handle save profile section
  const handleSaveProfile = () => {
    // Extract only the fields for the account section to update
    const {
      full_name,
      username,
      bio,
      phone,
      in_real_estate_since,
      location,
      business_name,
      website,
      instagram,
      facebook,
      linkedin,
      profile_photo_url,
      profile_banner_url,
      showProfile,
    } = profileData;
    
    saveProfileMutation.mutate({
      full_name,
      username,
      bio,
      phone,
      in_real_estate_since,
      location,
      business_name,
      website,
      instagram,
      facebook,
      linkedin,
      profile_photo_url,
      profile_banner_url,
      showProfile,
    });
  };

  // Handle save property preferences
  const handleSavePropertyPreferences = () => {
    // Extract only the property preferences fields
    const {
      type_of_buyer,
      markets,
      property_types,
      property_conditions,
      ideal_budget_min,
      ideal_budget_max,
      financing_methods,
      preferred_financing_method,
      closing_timeline,
    } = profileData;
    
    saveProfileMutation.mutate({
      type_of_buyer,
      markets,
      property_types,
      property_conditions,
      ideal_budget_min,
      ideal_budget_max,
      financing_methods,
      preferred_financing_method,
      closing_timeline,
    });
    
    setIsPropertySectionModified(false);
  };

  // Handle save professional details
  const handleSaveProfessionalDetails = () => {
    // Extract only the professional fields
    const {
      number_of_deals_last_12_months,
      goal_deals_next_12_months,
      total_deals_done,
      current_portfolio_count,
      preferred_inspectors,
      preferred_agents,
      preferred_contractors,
      preferred_lenders,
    } = profileData;
    
    saveProfileMutation.mutate({
      number_of_deals_last_12_months,
      goal_deals_next_12_months,
      total_deals_done,
      current_portfolio_count,
      preferred_inspectors,
      preferred_agents,
      preferred_contractors,
      preferred_lenders,
    });
    
    setIsProfessionalSectionModified(false);
  };

  // Check username availability with debounce
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username === user?.username) return;
    
    setIsCheckingUsername(true);
    
    try {
      const response = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      
      setIsUsernameAvailable(data.available);
      setUsernameMessage(data.available ? "Username is available" : "Username is already taken");
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameMessage("Error checking username availability");
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // Debounce username check
  useEffect(() => {
    const username = profileData.username;
    if (!username) return;
    
    // Don't check if username hasn't changed from original user data
    if (username === user?.username) {
      setIsUsernameAvailable(true);
      setUsernameMessage("");
      return;
    }
    
    const timeoutId = setTimeout(() => {
      checkUsernameAvailability(username);
    }, 600);
    
    return () => clearTimeout(timeoutId);
  }, [profileData.username, user?.username]);

  return (
    <div className={styles.profilePage}>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar */}
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
              <>
                <Card className="border-gray-200 shadow-sm mb-6">
                  <CardHeader className="border-b pb-4">
                    <CardTitle className="text-xl font-bold">Account Settings</CardTitle>
                    <CardDescription>Manage your personal information and account settings</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <Label htmlFor="full_name" className="mb-1.5 block">Full Name</Label>
                          <Input
                            id="full_name"
                            name="full_name"
                            value={profileData.full_name || ''}
                            onChange={handleProfileChange}
                            placeholder="Your full name"
                            className="mb-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="username" className="mb-1.5 block">Username</Label>
                          <div className="relative">
                            <Input
                              id="username"
                              name="username"
                              value={profileData.username || ''}
                              onChange={handleProfileChange}
                              placeholder="Choose a username"
                              className={`mb-1 ${!isUsernameAvailable && "border-red-300 focus:ring-red-300 focus:border-red-300"}`}
                            />
                            {isCheckingUsername && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <span className="animate-spin h-4 w-4 block border-2 border-gray-200 border-t-blue-500 rounded-full"></span>
                              </div>
                            )}
                          </div>
                          {usernameMessage && (
                            <p className={`text-xs ${isUsernameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                              {usernameMessage}
                            </p>
                          )}
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label htmlFor="bio" className="mb-1.5 block">Bio</Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            value={profileData.bio || ''}
                            onChange={handleProfileChange}
                            placeholder="Tell others a little about yourself"
                            className="mb-1 resize-none"
                            rows={3}
                          />
                          <p className="text-xs text-gray-500">
                            Brief description for your profile that will be visible to other members
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <Label htmlFor="email" className="mb-1.5 block">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email || ''}
                            disabled
                            className="mb-1 bg-gray-50"
                          />
                          <p className="text-xs text-gray-500">
                            Your email address is associated with your account and cannot be changed here
                          </p>
                        </div>
                        
                        <div>
                          <Label htmlFor="phone" className="mb-1.5 block">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={profileData.phone || ''}
                            onChange={handleProfileChange}
                            placeholder="(123) 456-7890"
                            className="mb-1"
                          />
                          <p className="text-xs text-gray-500">
                            Your phone number will not be visible to other members
                          </p>
                        </div>
                        
                        <div>
                          <Label htmlFor="location" className="mb-1.5 block">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            value={profileData.location || ''}
                            onChange={handleProfileChange}
                            placeholder="City, State"
                            className="mb-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="in_real_estate_since" className="mb-1.5 block">In Real Estate Since</Label>
                          <Input
                            id="in_real_estate_since"
                            name="in_real_estate_since"
                            type="number"
                            min="1950"
                            max={new Date().getFullYear()}
                            value={profileData.in_real_estate_since || ''}
                            onChange={handleProfileChange}
                            placeholder={new Date().getFullYear().toString()}
                            className="mb-1"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <Label htmlFor="business_name" className="mb-1.5 block">Business Name <span className="text-gray-400">(Optional)</span></Label>
                          <Input
                            id="business_name"
                            name="business_name"
                            value={profileData.business_name || ''}
                            onChange={handleProfileChange}
                            placeholder="Your business name"
                            className="mb-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="website" className="mb-1.5 block">Website <span className="text-gray-400">(Optional)</span></Label>
                          <Input
                            id="website"
                            name="website"
                            value={profileData.website || ''}
                            onChange={handleProfileChange}
                            placeholder="https://"
                            className="mb-1"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Links</h3>
                      <div className="grid grid-cols-1 gap-5">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-[#405DE6]/10">
                            <Instagram className="h-5 w-5 text-[#405DE6]" />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="instagram" className="mb-1.5 block">Instagram</Label>
                            <Input
                              id="instagram"
                              name="instagram"
                              value={profileData.instagram || ''}
                              onChange={handleProfileChange}
                              placeholder="username (without @)"
                              className="mb-1"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-[#1877F2]/10">
                            <FacebookIcon className="h-5 w-5 text-[#1877F2]" />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="facebook" className="mb-1.5 block">Facebook</Label>
                            <Input
                              id="facebook"
                              name="facebook"
                              value={profileData.facebook || ''}
                              onChange={handleProfileChange}
                              placeholder="username or page name"
                              className="mb-1"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-[#0077B5]/10">
                            <Linkedin className="h-5 w-5 text-[#0077B5]" />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="linkedin" className="mb-1.5 block">LinkedIn</Label>
                            <Input
                              id="linkedin"
                              name="linkedin"
                              value={profileData.linkedin || ''}
                              onChange={handleProfileChange}
                              placeholder="username or custom URL"
                              className="mb-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="profile_visibility" className="font-medium">Profile Visibility</Label>
                            <p className="text-sm text-gray-500">Allow your profile to be discoverable by others</p>
                          </div>
                          <Switch
                            id="profile_visibility"
                            checked={profileData.showProfile}
                            onCheckedChange={(checked) => handleCheckboxChange('showProfile', checked)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={!isProfileSectionModified || saveProfileMutation.isPending || !isUsernameAvailable}
                        className="bg-[#09261E] hover:bg-[#09261E]/90 text-white"
                      >
                        {saveProfileMutation.isPending ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            
            {/* Property Preferences */}
            {activeTab === "property_preferences" && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="text-xl font-bold">Property Preferences</CardTitle>
                  <CardDescription>Customize your property preferences to improve matches and opportunities</CardDescription>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Buyer Profile</h3>
                      <div className="space-y-5">
                        <div>
                          <Label className="mb-2 block">Type of Buyer</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {buyerTypeOptions.map((type) => (
                              <div key={type} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`buyer-type-${type}`}
                                  checked={profileData.type_of_buyer?.includes(type)}
                                  onCheckedChange={(checked) => 
                                    handleArrayFieldChange('type_of_buyer', type, checked as boolean)
                                  }
                                />
                                <Label
                                  htmlFor={`buyer-type-${type}`}
                                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {type}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Target Markets</h3>
                      <div className="space-y-5">
                        <div>
                          <Label className="mb-2 block">Markets of Interest</Label>
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2 mb-3">
                              {profileData.markets.map((market) => (
                                <Badge key={market} variant="outline" className="bg-green-50 text-green-800 hover:bg-green-100">
                                  {market}
                                  <button
                                    className="ml-1 rounded-full hover:bg-green-200/50 p-0.5"
                                    onClick={() => handleArrayFieldChange('markets', market, false)}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex space-x-2">
                              <Input
                                placeholder="Add market (e.g., Milwaukee, Wisconsin)"
                                className="flex-1"
                                id="new-market"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  const input = document.getElementById('new-market') as HTMLInputElement;
                                  if (input.value.trim()) {
                                    handleArrayFieldChange('markets', input.value.trim(), true);
                                    input.value = '';
                                  }
                                }}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Add specific cities, counties, or regions where you're looking to invest
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Property Criteria</h3>
                      <div className="space-y-6">
                        <div>
                          <Label className="mb-2 block">Property Types</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {propertyTypeOptions.map((type) => (
                              <div key={type} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`property-type-${type}`}
                                  checked={profileData.property_types?.includes(type)}
                                  onCheckedChange={(checked) => 
                                    handleArrayFieldChange('property_types', type, checked as boolean)
                                  }
                                />
                                <Label
                                  htmlFor={`property-type-${type}`}
                                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {type}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="mb-2 block">Property Conditions</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {propertyConditionOptions.map((condition) => (
                              <div key={condition} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`property-condition-${condition}`}
                                  checked={profileData.property_conditions?.includes(condition)}
                                  onCheckedChange={(checked) => 
                                    handleArrayFieldChange('property_conditions', condition, checked as boolean)
                                  }
                                />
                                <Label
                                  htmlFor={`property-condition-${condition}`}
                                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {condition}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="mb-2 block">Budget Range</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="ideal_budget_min" className="text-sm text-gray-500 mb-1.5 block">Minimum ($)</Label>
                              <Input
                                id="ideal_budget_min"
                                name="ideal_budget_min"
                                type="number"
                                min="0"
                                step="1000"
                                value={profileData.ideal_budget_min || ''}
                                onChange={handleProfileChange}
                                placeholder="0"
                                className="mb-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="ideal_budget_max" className="text-sm text-gray-500 mb-1.5 block">Maximum ($)</Label>
                              <Input
                                id="ideal_budget_max"
                                name="ideal_budget_max"
                                type="number"
                                min="0"
                                step="1000"
                                value={profileData.ideal_budget_max || ''}
                                onChange={handleProfileChange}
                                placeholder="1,000,000"
                                className="mb-1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Financing & Timeline</h3>
                      <div className="space-y-6">
                        <div>
                          <Label className="mb-2 block">Financing Methods</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {financingMethodOptions.map((method) => (
                              <div key={method} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`financing-${method}`}
                                  checked={profileData.financing_methods?.includes(method)}
                                  onCheckedChange={(checked) => 
                                    handleArrayFieldChange('financing_methods', method, checked as boolean)
                                  }
                                />
                                <Label
                                  htmlFor={`financing-${method}`}
                                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {method}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="preferred_financing_method" className="mb-2 block">Preferred Financing Method</Label>
                          <Select 
                            value={profileData.preferred_financing_method || ''} 
                            onValueChange={(value) => {
                              setProfileData(prev => ({
                                ...prev,
                                preferred_financing_method: value
                              }));
                              setIsPropertySectionModified(true);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a preferred method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">No preference</SelectItem>
                              {financingMethodOptions.map((method) => (
                                <SelectItem key={method} value={method}>{method}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="closing_timeline" className="mb-2 block">Preferred Closing Timeline</Label>
                          <Select 
                            value={profileData.closing_timeline || ''} 
                            onValueChange={(value) => {
                              setProfileData(prev => ({
                                ...prev,
                                closing_timeline: value
                              }));
                              setIsPropertySectionModified(true);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select closing timeline" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">No preference</SelectItem>
                              {closingTimelineOptions.map((timeline) => (
                                <SelectItem key={timeline} value={timeline}>{timeline}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-2">
                            Your typical preferred timeline from contract to closing
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSavePropertyPreferences}
                        disabled={!isPropertySectionModified || saveProfileMutation.isPending}
                        className="bg-[#09261E] hover:bg-[#09261E]/90 text-white"
                      >
                        {saveProfileMutation.isPending ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
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
                  <CardDescription>Manage how and when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">New Property Matches</p>
                            <p className="text-sm text-gray-500">Receive email when new properties match your criteria</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">New Messages</p>
                            <p className="text-sm text-gray-500">Receive email notifications for new messages</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Connection Requests</p>
                            <p className="text-sm text-gray-500">Receive email when someone wants to connect with you</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Deal Updates</p>
                            <p className="text-sm text-gray-500">Receive email about updates to your ongoing deals</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">In-App Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Activity on Your Posts</p>
                            <p className="text-sm text-gray-500">Notify when someone comments on your posts</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">New Property Alerts</p>
                            <p className="text-sm text-gray-500">Notify for new properties matching your preferences</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">REP Mentions</p>
                            <p className="text-sm text-gray-500">Notify when you're mentioned in the REP Room</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Email Frequency</h3>
                      <RadioGroup defaultValue="immediate">
                        <div className="flex items-center space-x-2 mb-3">
                          <RadioGroupItem value="immediate" id="immediate" />
                          <Label htmlFor="immediate">Immediate (send as events occur)</Label>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <RadioGroupItem value="daily" id="daily" />
                          <Label htmlFor="daily">Daily Digest (once per day)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="weekly" id="weekly" />
                          <Label htmlFor="weekly">Weekly Summary (once per week)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button className="bg-[#09261E] hover:bg-[#09261E]/90 text-white">
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Integrations Tab */}
            {activeTab === "integrations" && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="text-xl font-bold">Integrations & Connected Services</CardTitle>
                  <CardDescription>Connect PropertyDeals with other tools and services</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-gray-200">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="mr-3 h-10 w-10 rounded-md bg-blue-50 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="h-6 w-6 text-blue-600" fill="currentColor">
                                  <path d="M18.7 8.16l-8-4.9c-.4-.2-.7-.2-1.2 0l-8 4.9c-.5.3-.7.6-.7 1.1 0 .5.2.8.7 1.1l8 4.9c.2.1.3.1.5.1s.4 0 .5-.1l8-4.9c.5-.3.7-.6.7-1.1.1-.5-.1-.8-.5-1.1m-9.2 12.2l-7.2-4.4c-.3-.2-.3-.5 0-.7.1-.1.3-.2.4-.2.1 0 .2 0 .3.1l6.5 4 6.5-4c.3-.2.5-.1.7.2.2.3.1.5-.2.7l-7 4.3c-.1.1-.3.1-.5.1s-.4 0-.5-.1"></path>
                                </svg>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">Google Drive</h3>
                                <p className="text-sm text-gray-500">Share and manage documents</p>
                              </div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </CardHeader>
                        <CardContent className="pb-4 pt-0">
                          <p className="text-sm text-gray-500 mb-2">Connected as john.smith@gmail.com</p>
                          <Button variant="outline" size="sm">Configure</Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-gray-200">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="mr-3 h-10 w-10 rounded-md bg-blue-50 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="h-6 w-6 text-blue-500" fill="currentColor">
                                  <path d="M22.7 1.2C21.9.4 20.82 0 19.6 0H4.4C3.18 0 2.1.4 1.3 1.2.5 2 0 3.1 0 4.3v15.4c0 1.2.5 2.3 1.3 3.1.8.8 1.9 1.2 3.1 1.2h15.2c1.2 0 2.3-.4 3.1-1.2.8-.8 1.3-1.9 1.3-3.1V4.3c0-1.2-.5-2.3-1.3-3.1zM8 19H5V8h3v11zM6.5 6.7c-1 0-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8 1.8.8 1.8 1.8-.8 1.8-1.8 1.8zM19 19h-3v-5.3c0-1.6-1.2-2.8-2.8-2.8-.4 0-.9.1-1.2.3v7.8H9V8h3v1.4c.7-.9 1.8-1.4 3-1.4 2.8 0 4 1.9 4 4.2V19z"></path>
                                </svg>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">LinkedIn</h3>
                                <p className="text-sm text-gray-500">Connect with your professional network</p>
                              </div>
                            </div>
                            <Switch />
                          </div>
                        </CardHeader>
                        <CardContent className="pb-4 pt-0">
                          <p className="text-sm text-gray-500 mb-2">Not connected</p>
                          <Button variant="outline" size="sm">Connect</Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-gray-200">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="mr-3 h-10 w-10 rounded-md bg-green-50 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="h-6 w-6 text-green-600" fill="currentColor">
                                  <path d="M1.7 0.2L0.54 1.35C0.2 1.7 0 2.14 0 2.63v18.74c0 0.5 0.2 0.94 0.54 1.28l0.16 0.15c0.39 0.38 0.91 0.57 1.43 0.57 0.51 0 1.03-0.19 1.42-0.57l11.62-11.62 -3.67-3.67L1.7 0.2zM24 11.7L21.07 9.9l-3.19 3.18 3.22 3.22 2.9-1.67c0.46-0.28 0.74-0.78 0.74-1.32C24.74 12.47 24.46 11.97 24 11.7z"></path>
                                  <path d="M17.54 13.4l-5.66 5.66 -7.17-7.16L9.13 7.5l5.66-5.66 -0.71-0.71 -0.71-0.71L7.4 6.38c-0.14 0.14-0.28 0.31-0.37 0.51L17.54 17.4C17.87 17.07 17.87 13.73 17.54 13.4z"></path>
                                </svg>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">DocuSign</h3>
                                <p className="text-sm text-gray-500">eSignatures for documents</p>
                              </div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </CardHeader>
                        <CardContent className="pb-4 pt-0">
                          <p className="text-sm text-gray-500 mb-2">Connected</p>
                          <Button variant="outline" size="sm">Configure</Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-gray-200">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="mr-3 h-10 w-10 rounded-md bg-purple-50 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="h-6 w-6 text-purple-600" fill="currentColor">
                                  <path d="M12 0C5.38 0 0 5.38 0 12c0 6.62 5.38 12 12 12 6.62 0 12-5.38 12-12C24 5.38 18.62 0 12 0zM3.5 12c0-4.69 3.81-8.5 8.5-8.5 1.88 0 3.63.61 5.03 1.64L5.14 17.03C4.11 15.63 3.5 13.88 3.5 12zm8.5 8.5c-1.88 0-3.63-.61-5.03-1.64L18.86 6.97c1.03 1.4 1.64 3.14 1.64 5.03 0 4.69-3.81 8.5-8.5 8.5z"></path>
                                </svg>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">Zillow</h3>
                                <p className="text-sm text-gray-500">Property data</p>
                              </div>
                            </div>
                            <Switch />
                          </div>
                        </CardHeader>
                        <CardContent className="pb-4 pt-0">
                          <p className="text-sm text-gray-500 mb-2">Not connected</p>
                          <Button variant="outline" size="sm">Connect</Button>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Calendar Sync</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Connect your calendars to schedule showings and appointments directly from PropertyDeals
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-3 h-8 w-8 rounded-md bg-blue-50 flex items-center justify-center">
                              <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-600" fill="currentColor">
                                <path d="M17,3V1H7V3H1V21H23V3H17M17,11H15V13H17V15H15V17H13V15H11V17H9V15H7V13H9V11H7V9H9V7H11V9H13V7H15V9H17V11M13,13H11V11H13V13Z"></path>
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">Google Calendar</h3>
                              <p className="text-sm text-gray-500">Sync appointments with your Google Calendar</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Connect</Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-3 h-8 w-8 rounded-md bg-blue-50 flex items-center justify-center">
                              <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-600" fill="currentColor">
                                <path d="M21.75 4.5v15c0 1.2-.95 2.25-2.25 2.25H4.5c-1.2 0-2.25-.95-2.25-2.25v-15C2.25 3.3 3.3 2.25 4.5 2.25h15c1.2 0 2.25 1.05 2.25 2.25zm-18 3h16.5v-3c0-.45-.3-.75-.75-.75H4.5c-.45 0-.75.3-.75.75v3zm0 6v6c0 .45.3.75.75.75h15c.45 0 .75-.3.75-.75v-6l-5.25 3.3c-.9.6-1.95.9-3 .9s-2.1-.3-3-1.05L3.75 13.5z"></path>
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">Microsoft Outlook</h3>
                              <p className="text-sm text-gray-500">Sync appointments with Outlook Calendar</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Connect</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Developer API Access</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Generate API keys to access PropertyDeals data programmatically
                      </p>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline">Generate API Key</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Generate New API Key</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will create a new API key for developer access. You'll only see the key once, so make sure to copy it.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <Input placeholder="API Key Name" className="my-4" />
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>Generate Key</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      
                      <div className="mt-4">
                        <p className="text-xs text-gray-500">
                          <Info className="inline-block h-3 w-3 mr-1" />
                          API usage is subject to rate limits and our <a href="#" className="text-blue-600 hover:underline">Developer Terms</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Memberships Tab */}
            {activeTab === "memberships" && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b pb-4 bg-gradient-to-r from-[#09261E]/5 to-white">
                  <CardTitle className="text-xl font-bold">Membership & Billing</CardTitle>
                  <CardDescription>Manage your subscription and payment information</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    <div className="bg-[#09261E]/5 rounded-lg p-5 border border-[#09261E]/10">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-[#09261E]">Pro Investor</h3>
                          <p className="text-sm text-gray-600 mb-1">Your current plan</p>
                          <Badge variant="outline" className="bg-[#09261E]/10 text-[#09261E] border-[#09261E]/20">
                            Active
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#09261E]">$29<span className="text-sm font-normal text-gray-500">/month</span></p>
                          <p className="text-xs text-gray-500">Next billing on May 15, 2023</p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex flex-wrap gap-2 items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">Change Plan</Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                            Cancel Subscription
                          </Button>
                        </div>
                        <div>
                          <Button variant="outline" size="sm">Billing History</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Plan Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">Unlimited Property Searches</p>
                            <p className="text-sm text-gray-500">Search for properties without limitations</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">Advanced Property Analytics</p>
                            <p className="text-sm text-gray-500">Access detailed market and property insights</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">Direct Messaging</p>
                            <p className="text-sm text-gray-500">Unlimited messages to sellers and agents</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">Priority Listings</p>
                            <p className="text-sm text-gray-500">Your listings appear higher in search results</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">REP Room Access</p>
                            <p className="text-sm text-gray-500">Full access to the REP community</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">Property Deal Flow Tools</p>
                            <p className="text-sm text-gray-500">Track and manage all of your deals</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-3 h-8 w-12 bg-blue-50 rounded flex items-center justify-center">
                              <svg viewBox="0 0 24 16" className="h-4" fill="#1434CB">
                                <path d="M21.6 0H2.4C1.08 0 0 1.08 0 2.4v11.2C0 14.92 1.08 16 2.4 16h19.2c1.32 0 2.4-1.08 2.4-2.4V2.4C24 1.08 22.92 0 21.6 0zM3.6 8.8c0-.88.72-1.6 1.6-1.6h2.4c.88 0 1.6.72 1.6 1.6v.8c0 .88-.72 1.6-1.6 1.6H5.2c-.88 0-1.6-.72-1.6-1.6v-.8zm9.6 3.2c-.88 0-1.6-.72-1.6-1.6V5.6c0-.88.72-1.6 1.6-1.6h1.6c.88 0 1.6.72 1.6 1.6v4.8c0 .88-.72 1.6-1.6 1.6h-1.6z"></path>
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">Visa ending in 4242</p>
                              <p className="text-sm text-gray-500">Expires 12/2025</p>
                            </div>
                          </div>
                          <div>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline">Add Payment Method</Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <Label htmlFor="billing_name" className="mb-1.5 block">Name</Label>
                          <Input
                            id="billing_name"
                            defaultValue="John Smith"
                            className="mb-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="billing_email" className="mb-1.5 block">Email</Label>
                          <Input
                            id="billing_email"
                            type="email"
                            defaultValue="john.smith@example.com"
                            className="mb-1"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label htmlFor="billing_address" className="mb-1.5 block">Address</Label>
                          <Input
                            id="billing_address"
                            defaultValue="123 Main St"
                            className="mb-3"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="billing_city" className="mb-1.5 block">City</Label>
                          <Input
                            id="billing_city"
                            defaultValue="Milwaukee"
                            className="mb-1"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="billing_state" className="mb-1.5 block">State</Label>
                            <Input
                              id="billing_state"
                              defaultValue="WI"
                              className="mb-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="billing_zip" className="mb-1.5 block">ZIP</Label>
                            <Input
                              id="billing_zip"
                              defaultValue="53202"
                              className="mb-1"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Button className="bg-[#09261E] hover:bg-[#09261E]/90 text-white">
                          <Save className="mr-2 h-4 w-4" />
                          Save Billing Info
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
                  <CardDescription>Manage your account security and authentication</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Password</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="current_password" className="mb-1.5 block">Current Password</Label>
                          <Input
                            id="current_password"
                            type="password"
                            placeholder="••••••••"
                            className="mb-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="new_password" className="mb-1.5 block">New Password</Label>
                          <Input
                            id="new_password"
                            type="password"
                            placeholder="••••••••"
                            className="mb-1"
                          />
                          <p className="text-xs text-gray-500">
                            Password must be at least 8 characters and include a number and special character
                          </p>
                        </div>
                        
                        <div>
                          <Label htmlFor="confirm_password" className="mb-1.5 block">Confirm New Password</Label>
                          <Input
                            id="confirm_password"
                            type="password"
                            placeholder="••••••••"
                            className="mb-1"
                          />
                        </div>
                        
                        <div>
                          <Button className="bg-[#09261E] hover:bg-[#09261E]/90 text-white">Update Password</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <Switch />
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        When two-factor authentication is enabled, you'll be required to enter a code from your 
                        authentication app in addition to your password when signing in.
                      </p>
                      <Button variant="outline" disabled>Enable 2FA</Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Login Sessions</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        These are the devices that are currently logged in to your account. 
                        If you don't recognize a session, sign out of it.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex justify-between">
                            <div>
                              <div className="flex items-center mb-1">
                                <Badge variant="outline" className="bg-green-50 text-green-700 mr-2">Current</Badge>
                                <p className="font-medium">Chrome on Windows</p>
                              </div>
                              <p className="text-sm text-gray-500">Milwaukee, WI, USA</p>
                              <p className="text-xs text-gray-400 mt-1">May 8, 2023 at 10:42 AM</p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-gray-500">Sign Out</Button>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium mb-1">Mobile App on iPhone</p>
                              <p className="text-sm text-gray-500">Chicago, IL, USA</p>
                              <p className="text-xs text-gray-400 mt-1">May 7, 2023 at 3:15 PM</p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-gray-500">Sign Out</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                          Sign Out All Devices
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Account Data</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div>
                            <p className="font-medium">Download Your Data</p>
                            <p className="text-sm text-gray-500 mb-2">Get a copy of your personal data in a machine-readable format</p>
                            <Button variant="outline" size="sm">Request Data Export</Button>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-start">
                          <div>
                            <p className="font-medium text-red-600">Delete Account</p>
                            <p className="text-sm text-gray-500 mb-2">Permanently delete your account and all of your data</p>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                                  Delete Account
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove all of your data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700">
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
            
            {/* Help Center */}
            {activeTab === "help" && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="text-xl font-bold">Help Center</CardTitle>
                  <CardDescription>Get help and support for PropertyDeals</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {activeHelpSection === 'main' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-gray-200 cursor-pointer hover:shadow-md transition"
                        onClick={() => navigateToHelpSection('faq')}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center">
                            <div className="mr-3 h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                              <HelpCircle className="h-4 w-4 text-blue-600" />
                            </div>
                            <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-500 text-sm">
                            Find answers to the most common questions about PropertyDeals
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-gray-200 cursor-pointer hover:shadow-md transition"
                        onClick={() => navigateToHelpSection('suggestions')}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center">
                            <div className="mr-3 h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center">
                              <TrendingUp className="h-4 w-4 text-purple-600" />
                            </div>
                            <CardTitle className="text-lg">Feature Suggestions</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-500 text-sm">
                            Submit ideas for new features or improvements
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-gray-200 cursor-pointer hover:shadow-md transition" 
                        onClick={() => navigateToHelpSection('report')}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center">
                            <div className="mr-3 h-8 w-8 rounded-full bg-red-50 flex items-center justify-center">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            </div>
                            <CardTitle className="text-lg">Report an Issue</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-500 text-sm">
                            Let us know if you're experiencing any problems
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-gray-200 cursor-pointer hover:shadow-md transition"
                        onClick={() => window.open('mailto:support@propertydeals.com')}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center">
                            <div className="mr-3 h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                              <MessageSquare className="h-4 w-4 text-green-600" />
                            </div>
                            <CardTitle className="text-lg">Contact Support</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-500 text-sm">
                            Get in touch with our support team directly
                          </p>
                          <p className="text-xs mt-2 text-gray-400">support@propertydeals.com</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  {activeHelpSection === 'faq' && <HelpFAQ />}
                  {activeHelpSection === 'suggestions' && <HelpSuggestions />}
                  {activeHelpSection === 'report' && <HelpReport />}
                  
                  {activeHelpSection !== 'main' && (
                    <div className="mt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => navigateToHelpSection('main')}
                        className="flex items-center"
                      >
                        <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                        Back to Help Center
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}