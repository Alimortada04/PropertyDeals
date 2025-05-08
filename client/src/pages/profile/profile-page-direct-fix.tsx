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
  
  // Debounce username check while user types
  useEffect(() => {
    const username = profileData.username;
    if (!username) return;
    
    // Don't check if username hasn't changed from original user data
    if (username === user?.username) {
      setIsUsernameAvailable(true);
      setUsernameMessage("");
      return;
    }
    
    // Basic validation
    if (username.length < 3) {
      setIsUsernameAvailable(false);
      setUsernameMessage("Username must be at least 3 characters");
      return;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setIsUsernameAvailable(false);
      setUsernameMessage("Username can only contain letters, numbers, and underscores");
      return;
    }
    
    // Set up debounce for API check
    const timer = setTimeout(async () => {
      setIsCheckingUsername(true);
      try {
        // In a real app, we would call an API to check username availability
        const isAvailable = true; // Simulate API call
        
        setIsUsernameAvailable(isAvailable);
        setUsernameMessage(isAvailable ? "Username is available" : "Username is already taken");
      } catch (error) {
        console.error("Error checking username:", error);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [profileData.username, user?.username]);
  
  // Handle generic input change
  const handleInputChange = (field: string, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    
    // Mark appropriate section as modified
    const accountFields = ["full_name", "username", "email", "bio", "phone", "business_name", "website", "in_real_estate_since", "instagram", "facebook", "linkedin", "location"];
    const propertyFields = ["markets", "property_types", "property_conditions", "ideal_budget_min", "ideal_budget_max", "financing_methods", "preferred_financing_method", "closing_timeline", "type_of_buyer"];
    const professionalFields = ["preferred_inspectors", "preferred_agents", "preferred_contractors", "preferred_lenders"];
    
    if (accountFields.includes(field)) {
      setIsProfileSectionModified(true);
    } else if (propertyFields.includes(field)) {
      setIsPropertySectionModified(true);
    } else if (professionalFields.includes(field)) {
      setIsProfessionalSectionModified(true);
    }
  };
  
  // Handle checkbox array input change (for multi-select options)
  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setProfileData(prev => {
      const currentValues = prev[field] || [];
      const newValues = checked 
        ? [...currentValues, value] 
        : currentValues.filter(v => v !== value);
      
      return { ...prev, [field]: newValues };
    });
    
    // Mark appropriate section as modified
    const propertyFields = ["markets", "property_types", "property_conditions", "financing_methods", "type_of_buyer"];
    
    if (propertyFields.includes(field)) {
      setIsPropertySectionModified(true);
    }
  };
  
  // Handle profile photo upload
  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    try {
      // In a real app, we would upload to Supabase storage
      // const { data, error } = await supabase.storage.from('profiles').upload(`${user.id}/profile.jpg`, file);
      
      // For now, use a URL.createObjectURL to simulate an upload
      const objectUrl = URL.createObjectURL(file);
      
      setProfileData({
        ...profileData,
        profile_photo_url: objectUrl
      });
      
      setIsProfileSectionModified(true);
      
      // Display success message
      toast({
        title: "Profile photo updated",
        description: "Your profile photo has been updated successfully.",
      });
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      toast({
        title: "Error updating profile photo",
        description: "There was an error uploading your profile photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle banner image upload
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    try {
      // In a real app, we would upload to Supabase storage
      // const { data, error } = await supabase.storage.from('profiles').upload(`${user.id}/banner.jpg`, file);
      
      // For now, use a URL.createObjectURL to simulate an upload
      const objectUrl = URL.createObjectURL(file);
      
      setProfileData({
        ...profileData,
        profile_banner_url: objectUrl
      });
      
      setIsProfileSectionModified(true);
      
      // Display success message
      toast({
        title: "Banner updated",
        description: "Your profile banner has been updated successfully.",
      });
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast({
        title: "Error updating banner",
        description: "There was an error uploading your banner image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form submission for account info
  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileSectionModified(false);
    
    // In a real app, update profile via API
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };
  
  // Handle form submission for property preferences
  const handlePropertyPreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPropertySectionModified(false);
    
    // In a real app, update preferences via API
    toast({
      title: "Preferences updated",
      description: "Your property preferences have been saved successfully.",
    });
  };
  
  // Handle professional preferences form submission
  const handleProfessionalPreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfessionalSectionModified(false);
    
    // In a real app, update preferences via API
    toast({
      title: "Professional preferences updated",
      description: "Your professional preferences have been saved successfully.",
    });
  };
  
  // Handle year picker change
  const handleYearChange = (year: number | null) => {
    setProfileData({
      ...profileData,
      in_real_estate_since: year
    });
    setIsProfileSectionModified(true);
  };
  
  // Handle delete account
  const handleDeleteAccount = () => {
    // In a real app, you would call an API to delete the account
    if (confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
      // Perform delete operation
      alert("This is a demo feature and does not actually delete your account.");
    }
  };
  
  return (
    <div className={styles.profilePage}>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar - Profile navigation */}
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
                  <div className="flex items-center">
                    <UserCircle className="h-5 w-5 text-[#09261E] mr-2" />
                    <div>
                      <CardTitle className="text-xl">Account Information</CardTitle>
                      <CardDescription>Your basic profile information</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleAccountSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          placeholder="Your full name"
                          value={profileData.full_name || ''}
                          onChange={(e) => handleInputChange('full_name', e.target.value)}
                          className="border-gray-300"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <div className="relative">
                          <Input
                            id="username"
                            placeholder="Your unique username"
                            value={profileData.username || ''}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            className={`border-gray-300 pr-10 ${!isUsernameAvailable && profileData.username ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : ''}`}
                          />
                          {isCheckingUsername && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="animate-spin h-4 w-4 border-2 border-[#09261E] border-opacity-50 border-t-transparent rounded-full"></div>
                            </div>
                          )}
                          {!isCheckingUsername && profileData.username && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              {isUsernameAvailable ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          )}
                        </div>
                        {usernameMessage && (
                          <p className={`text-xs mt-1 ${isUsernameAvailable ? 'text-green-600' : 'text-red-500'}`}>
                            {usernameMessage}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Your email address"
                          value={profileData.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="border-gray-300"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="Your phone number"
                          value={profileData.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="border-gray-300"
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell others about yourself and your background in real estate (up to 500 characters)"
                          value={profileData.bio || ''}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          className="border-gray-300 resize-none min-h-[100px]"
                          maxLength={500}
                        />
                        <div className="flex justify-end">
                          <span className="text-xs text-gray-500">
                            {(profileData.bio?.length || 0)}/500 characters
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Professional Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          placeholder="Your business or company name"
                          value={profileData.business_name || ''}
                          onChange={(e) => handleInputChange('business_name', e.target.value)}
                          className="border-gray-300"
                        />
                        <p className="text-xs text-gray-500">Leave blank if you're an individual investor</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="realEstateYearStart">In Real Estate Since</Label>
                        <Select
                          value={profileData.in_real_estate_since?.toString() || ''}
                          onValueChange={(value) => handleYearChange(value ? parseInt(value) : null)}
                        >
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Not specified</SelectItem>
                            {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="City, State"
                          value={profileData.location || ''}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="border-gray-300"
                        />
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Web & Social Media</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          placeholder="Your website URL"
                          value={profileData.website || ''}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          className="border-gray-300"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <Instagram className="h-5 w-5" />
                          </span>
                          <Input
                            id="instagram"
                            placeholder="Your Instagram username"
                            value={profileData.instagram || ''}
                            onChange={(e) => handleInputChange('instagram', e.target.value)}
                            className="border-gray-300 pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <Linkedin className="h-5 w-5" />
                          </span>
                          <Input
                            id="linkedin"
                            placeholder="Your LinkedIn username"
                            value={profileData.linkedin || ''}
                            onChange={(e) => handleInputChange('linkedin', e.target.value)}
                            className="border-gray-300 pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook</Label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <FacebookIcon className="h-5 w-5" />
                          </span>
                          <Input
                            id="facebook"
                            placeholder="Your Facebook username"
                            value={profileData.facebook || ''}
                            onChange={(e) => handleInputChange('facebook', e.target.value)}
                            className="border-gray-300 pl-10"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showProfile"
                          checked={profileData.showProfile}
                          onCheckedChange={(checked) => handleInputChange('showProfile', checked)}
                        />
                        <Label htmlFor="showProfile" className="font-medium">Show my profile to other users</Label>
                      </div>
                      <p className="text-sm text-gray-500 ml-7">
                        When enabled, your profile will be visible to other PropertyDeals users. Disable this if you want to temporarily hide your profile.
                      </p>
                    </div>
                    
                    <div className="flex justify-between pt-4 border-t border-gray-200">
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={handleDeleteAccount}
                        className="bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                      
                      <Button
                        type="submit"
                        disabled={!isProfileSectionModified || !isUsernameAvailable || loading}
                        className="bg-[#09261E] hover:bg-[#09261E]/90 text-white"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full mr-2"></div>
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
                  </form>
                </CardContent>
              </Card>
            )}
            
            {/* Property Preferences */}
            {activeTab === "property_preferences" && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b pb-4">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-[#09261E] mr-2" />
                    <div>
                      <CardTitle className="text-xl">Property Preferences</CardTitle>
                      <CardDescription>Your investment criteria and target properties</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handlePropertyPreferencesSubmit}>
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Investor Type</h3>
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                            {buyerTypeOptions.map((type) => (
                              <div key={type} className="flex items-start space-x-2">
                                <Checkbox
                                  id={`type_${type}`}
                                  checked={profileData.type_of_buyer?.includes(type) || false}
                                  onCheckedChange={(checked) => 
                                    handleCheckboxChange('type_of_buyer', type, checked as boolean)
                                  }
                                  className="mt-0.5"
                                />
                                <Label
                                  htmlFor={`type_${type}`}
                                  className="font-normal text-gray-700 leading-tight cursor-pointer"
                                >
                                  {type}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Target Markets</h3>
                        <div className="space-y-1">
                          <Label htmlFor="markets">Markets you're interested in</Label>
                          <Input
                            id="markets"
                            placeholder="Add markets separated by commas (e.g. Milwaukee, Chicago, Madison)"
                            value={profileData.markets?.join(', ') || ''}
                            onChange={(e) => handleInputChange('markets', e.target.value.split(',').map(m => m.trim()).filter(Boolean))}
                            className="border-gray-300"
                          />
                          <p className="text-xs text-gray-500">Enter cities, counties, or neighborhoods where you want to invest</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Property Criteria</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-1">
                            <Label>Property Types</Label>
                            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {propertyTypeOptions.map((type) => (
                                  <div key={type} className="flex items-start space-x-2">
                                    <Checkbox
                                      id={`property_type_${type}`}
                                      checked={profileData.property_types?.includes(type) || false}
                                      onCheckedChange={(checked) => 
                                        handleCheckboxChange('property_types', type, checked as boolean)
                                      }
                                      className="mt-0.5"
                                    />
                                    <Label
                                      htmlFor={`property_type_${type}`}
                                      className="font-normal text-gray-700 leading-tight cursor-pointer"
                                    >
                                      {type}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <Label>Property Conditions</Label>
                            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                              <div className="grid grid-cols-1 gap-3">
                                {propertyConditionOptions.map((condition) => (
                                  <div key={condition} className="flex items-start space-x-2">
                                    <Checkbox
                                      id={`property_condition_${condition}`}
                                      checked={profileData.property_conditions?.includes(condition) || false}
                                      onCheckedChange={(checked) => 
                                        handleCheckboxChange('property_conditions', condition, checked as boolean)
                                      }
                                      className="mt-0.5"
                                    />
                                    <Label
                                      htmlFor={`property_condition_${condition}`}
                                      className="font-normal text-gray-700 leading-tight cursor-pointer"
                                    >
                                      {condition}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Budget & Financing</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-1">
                            <Label htmlFor="budget_min">Minimum Budget</Label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <DollarSign className="h-4 w-4" />
                              </span>
                              <Input
                                id="budget_min"
                                type="number"
                                placeholder="Minimum investment amount"
                                value={profileData.ideal_budget_min || ''}
                                onChange={(e) => handleInputChange('ideal_budget_min', e.target.value ? parseInt(e.target.value) : null)}
                                className="border-gray-300 pl-8"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor="budget_max">Maximum Budget</Label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <DollarSign className="h-4 w-4" />
                              </span>
                              <Input
                                id="budget_max"
                                type="number"
                                placeholder="Maximum investment amount"
                                value={profileData.ideal_budget_max || ''}
                                onChange={(e) => handleInputChange('ideal_budget_max', e.target.value ? parseInt(e.target.value) : null)}
                                className="border-gray-300 pl-8"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-1 md:col-span-2">
                            <Label>Financing Methods</Label>
                            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {financingMethodOptions.map((method) => (
                                  <div key={method} className="flex items-start space-x-2">
                                    <Checkbox
                                      id={`financing_${method}`}
                                      checked={profileData.financing_methods?.includes(method) || false}
                                      onCheckedChange={(checked) => 
                                        handleCheckboxChange('financing_methods', method, checked as boolean)
                                      }
                                      className="mt-0.5"
                                    />
                                    <Label
                                      htmlFor={`financing_${method}`}
                                      className="font-normal text-gray-700 leading-tight cursor-pointer"
                                    >
                                      {method}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor="preferred_financing">Preferred Financing Method</Label>
                            <Select
                              value={profileData.preferred_financing_method || ''}
                              onValueChange={(value) => handleInputChange('preferred_financing_method', value || null)}
                            >
                              <SelectTrigger className="border-gray-300">
                                <SelectValue placeholder="Select preferred method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">No preference</SelectItem>
                                {financingMethodOptions.map((method) => (
                                  <SelectItem key={method} value={method}>{method}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor="timeline">Closing Timeline</Label>
                            <Select
                              value={profileData.closing_timeline || ''}
                              onValueChange={(value) => handleInputChange('closing_timeline', value || null)}
                            >
                              <SelectTrigger className="border-gray-300">
                                <SelectValue placeholder="Select timeline" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">Not specified</SelectItem>
                                {closingTimelineOptions.map((timeline) => (
                                  <SelectItem key={timeline} value={timeline}>{timeline}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                      <Button
                        type="submit"
                        disabled={!isPropertySectionModified || loading}
                        className="bg-[#09261E] hover:bg-[#09261E]/90 text-white"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Preferences
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
            
            {/* Connections Tab - Updated Implementation */}
            {activeTab === "connections" && (
              <ConnectionsTab profileData={profileData} loading={loading} />
            )}
            
            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b pb-4">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 text-[#09261E] mr-2" />
                    <div>
                      <CardTitle className="text-xl">Notification Preferences</CardTitle>
                      <CardDescription>Manage how and when you receive notifications</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                          <div>
                            <p className="text-sm font-medium text-gray-700">New Property Matches</p>
                            <p className="text-xs text-gray-500">Receive notifications for new properties matching your criteria</p>
                          </div>
                          <Switch id="email_new_properties" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Connection Requests</p>
                            <p className="text-xs text-gray-500">Notifications about new connection requests</p>
                          </div>
                          <Switch id="email_connection_requests" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Messages</p>
                            <p className="text-xs text-gray-500">Receive email notifications for new messages</p>
                          </div>
                          <Switch id="email_messages" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Property Updates</p>
                            <p className="text-xs text-gray-500">Get notified about updates to saved properties</p>
                          </div>
                          <Switch id="email_property_updates" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Marketing & Promotions</p>
                            <p className="text-xs text-gray-500">Occasional updates about new features, tips and promotions</p>
                          </div>
                          <Switch id="email_marketing" />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">In-App Notifications</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                          <div>
                            <p className="text-sm font-medium text-gray-700">New Messages</p>
                            <p className="text-xs text-gray-500">Show notifications for new messages</p>
                          </div>
                          <Switch id="app_messages" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Connection Activity</p>
                            <p className="text-xs text-gray-500">Notifications about your connections' activity</p>
                          </div>
                          <Switch id="app_connection_activity" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Property Reminders</p>
                            <p className="text-xs text-gray-500">Get reminders about saved properties and deadlines</p>
                          </div>
                          <Switch id="app_property_reminders" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">System Announcements</p>
                            <p className="text-xs text-gray-500">Important announcements about PropertyDeals</p>
                          </div>
                          <Switch id="app_announcements" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Text Message Notifications</h3>
                      
                      <div>
                        <Label htmlFor="phone_verify">Verified Phone Number</Label>
                        <div className="flex mt-1 mb-3">
                          <Input
                            id="phone_verify"
                            placeholder="Add your phone number for SMS notifications"
                            value={profileData.phone || ''}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="border-gray-300 rounded-r-none"
                            disabled={profileData.phone?.includes('verified')}
                          />
                          <Button 
                            variant="outline" 
                            className="rounded-l-none border border-gray-300 text-gray-700 hover:bg-gray-100"
                          >
                            {profileData.phone?.includes('verified') ? 'Verified ✓' : 'Verify Number'}
                          </Button>
                        </div>
                        
                        <div className="space-y-3 mt-4">
                          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Urgent Messages</p>
                              <p className="text-xs text-gray-500">Receive SMS for urgent messages from connections</p>
                            </div>
                            <Switch id="sms_urgent_messages" disabled={!profileData.phone?.includes('verified')} />
                          </div>
                          
                          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Deal Alerts</p>
                              <p className="text-xs text-gray-500">SMS alerts for time-sensitive deal opportunities</p>
                            </div>
                            <Switch id="sms_deal_alerts" disabled={!profileData.phone?.includes('verified')} />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Security Alerts</p>
                              <p className="text-xs text-gray-500">SMS notifications for account security issues</p>
                            </div>
                            <Switch id="sms_security" disabled={!profileData.phone?.includes('verified')} defaultChecked={profileData.phone?.includes('verified')} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
                    <Button className="bg-[#09261E] hover:bg-[#09261E]/90 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Save Notification Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Other tabs content here... */}
            
          </div>
        </div>
      </div>
    </div>
  );
}