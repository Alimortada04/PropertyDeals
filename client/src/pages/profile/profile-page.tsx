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
  preferred_sellers: string[];
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

  // Default profile data and query
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
    preferred_sellers: [],
    showProfile: true,
  });

  // Fetch profile data
  const { data: fetchedProfile, error: profileError, isLoading: isProfileLoading } = useQuery({
    queryKey: ['/api/profile'],
    onSuccess: (data) => {
      if (data) {
        // If we have data from the API, use it
        setProfileData(prev => ({
          ...prev,
          ...data,
        }));
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle profile update on form submit for Account section
  const handleProfileSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isProfileSectionModified) return;
    
    setLoading(true);
    
    try {
      // Mock API request for demo
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be an API request to update the profile
      // For this demo, we just simulate success
      
      toast({
        title: "Profile updated",
        description: "Your profile changes have been saved.",
      });
      
      setIsProfileSectionModified(false);
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form changes to track what's been modified
  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    setIsProfileSectionModified(true);
  };

  // Handle multi-select fields (checkboxes, arrays)
  const handleMultiSelectChange = (fieldName: string, value: string, section = 'property') => {
    setProfileData(prev => {
      // Clone the current array or create a new one if it doesn't exist
      const currentValues = [...(prev[fieldName] || [])];
      
      // Check if the item is already in the array
      const index = currentValues.indexOf(value);
      
      if (index !== -1) {
        // Remove it if it exists
        currentValues.splice(index, 1);
      } else {
        // Add it if it doesn't
        currentValues.push(value);
      }
      
      return {
        ...prev,
        [fieldName]: currentValues,
      };
    });
    
    // Update the relevant modification flag
    if (section === 'property') {
      setIsPropertySectionModified(true);
    } else if (section === 'professionals') {
      setIsProfessionalSectionModified(true);
    } else {
      setIsProfileSectionModified(true);
    }
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (fieldName: string, checked: boolean) => {
    setProfileData(prev => ({
      ...prev,
      [fieldName]: checked,
    }));
    
    setIsProfileSectionModified(true);
  };
  
  // Handle user logout
  const handleLogout = () => {
    if (logoutMutation.isPending) return;
    
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        // Redirect to login page
        window.location.href = "/auth";
      },
      onError: (error: Error) => {
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Handle username check (to verify it's available/valid)
  const checkUsername = async (username: string) => {
    if (!username.trim()) {
      setUsernameMessage("");
      return;
    }
    
    setIsCheckingUsername(true);
    
    // In a real app, this would check with the API
    // For this demo, we simulate a request
    
    // Simulate API call to check username
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Allow the current user's username (in case they didn't change it)
    if (username === user?.username) {
      setUsernameMessage("");
      setIsUsernameAvailable(true);
      setIsCheckingUsername(false);
      return;
    }
    
    // Arbitrary rules for demo
    const isValid = /^[a-zA-Z0-9_]{3,20}$/.test(username);
    const isTaken = ["admin", "support", "test", "user"].includes(username.toLowerCase());
    
    if (!isValid) {
      setUsernameMessage("Username must be 3-20 characters (letters, numbers, underscores)");
      setIsUsernameAvailable(false);
    } else if (isTaken) {
      setUsernameMessage("This username is already taken");
      setIsUsernameAvailable(false);
    } else {
      setUsernameMessage("Username is available");
      setIsUsernameAvailable(true);
    }
    
    setIsCheckingUsername(false);
  };
  
  // Handle delayed username check to avoid too many requests
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    
    setProfileData(prev => ({
      ...prev,
      username,
    }));
    
    setIsProfileSectionModified(true);
    
    // Use debounce to avoid too many API calls
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      checkUsername(username);
    }, 500);
  };
  
  // For tracking timing of username check
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // For numeric fields like budget
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const { value } = e.target;
    
    // Allow empty value or valid numbers
    if (value === '' || /^\d+$/.test(value)) {
      setProfileData(prev => ({
        ...prev,
        [fieldName]: value === '' ? null : parseInt(value, 10),
      }));
      
      if (fieldName.includes('budget')) {
        setIsPropertySectionModified(true);
      } else {
        setIsProfileSectionModified(true);
      }
    }
  };
  
  // For select fields
  const handleSelectChange = (value: string, fieldName: string, section = 'property') => {
    setProfileData(prev => ({
      ...prev,
      [fieldName]: value === 'none' ? null : value,
    }));
    
    // Update the relevant modification flag
    if (section === 'property') {
      setIsPropertySectionModified(true);
    } else {
      setIsProfileSectionModified(true);
    }
  };

  // Handle profile photo upload button click
  const handleProfilePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle banner photo upload button click
  const handleBannerPhotoClick = () => {
    if (bannerInputRef.current) {
      bannerInputRef.current.click();
    }
  };
  
  // Handle file upload for profile photo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 3MB)
    if (file.size > 3 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "The image must be less than 3MB",
        variant: "destructive",
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would upload to a storage service like S3
    // For this demo, we use a data URL
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      
      if (type === 'profile') {
        setProfileData(prev => ({
          ...prev,
          profile_photo_url: dataUrl,
        }));
      } else {
        setProfileData(prev => ({
          ...prev,
          profile_banner_url: dataUrl,
        }));
      }
      
      setIsProfileSectionModified(true);
    };
    
    reader.readAsDataURL(file);
  };
  
  // Compute the profile completion percentage
  const calculateProfileCompletionScore = () => {
    const requiredFields = [
      'full_name', 'username', 'email', 'phone', 'bio', 'location',
      'in_real_estate_since', 'business_name', 'type_of_buyer', 'profile_photo_url',
      'markets', 'property_types', 'property_conditions', 'ideal_budget_min',
      'ideal_budget_max', 'financing_methods', 'closing_timeline'
    ];
    
    const arrayFields = ['type_of_buyer', 'markets', 'property_types', 'property_conditions', 'financing_methods'];
    
    let completedFields = 0;
    
    requiredFields.forEach(field => {
      const value = profileData[field];
      
      if (arrayFields.includes(field)) {
        // For array fields, check if the array has at least one item
        if (Array.isArray(value) && value.length > 0) {
          completedFields += 1;
        }
      } else {
        // For other fields, check if they have a value
        if (value !== null && value !== undefined && value !== '') {
          completedFields += 1;
        }
      }
    });
    
    return Math.round((completedFields / requiredFields.length) * 100);
  };
  
  // Calculate profile completion score
  useEffect(() => {
    const score = calculateProfileCompletionScore();
    
    setProfileData(prev => ({
      ...prev,
      profile_completion_score: score,
    }));
  }, [profileData.full_name, profileData.username, profileData.email, profileData.phone,
      profileData.bio, profileData.location, profileData.in_real_estate_since,
      profileData.business_name, profileData.type_of_buyer, profileData.profile_photo_url,
      profileData.markets, profileData.property_types, profileData.property_conditions,
      profileData.ideal_budget_min, profileData.ideal_budget_max, profileData.financing_methods,
      profileData.closing_timeline]);
  
  return (
    <div className="flex-1 pt-10 pb-20 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar (profile navigation) */}
          <div className="hidden lg:flex flex-col w-64 sticky top-20 h-[calc(100vh-140px)]">
            <div className="flex flex-col h-full space-y-1.5 bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
              {/* Profile menu header (hidden on mobile - shown in main content) */}
              <div className="px-4 py-3 border-b">
                <h2 className="font-semibold text-lg text-gray-900">Profile Settings</h2>
                <p className="text-sm text-gray-500">Manage your account details and preferences</p>
              </div>
              
              {/* Menu items */}
              <div className="flex flex-col flex-1 overflow-y-auto p-3 space-y-1">
                <ProfileMenuItem
                  icon={<User className="h-5 w-5" />}
                  label="Account"
                  active={activeTab === 'account'}
                  onClick={() => handleTabChange('account')}
                />
                
                <ProfileMenuItem
                  icon={<Building className="h-5 w-5" />}
                  label="Property Preferences"
                  active={activeTab === 'property_preferences'}
                  onClick={() => handleTabChange('property_preferences')}
                />
                
                <ProfileMenuItem
                  icon={<Users className="h-5 w-5" />}
                  label="Connections"
                  active={activeTab === 'connections'}
                  onClick={() => handleTabChange('connections')}
                />
                
                <ProfileMenuItem
                  icon={<Bell className="h-5 w-5" />}
                  label="Notifications"
                  active={activeTab === 'notifications'}
                  onClick={() => handleTabChange('notifications')}
                />
                
                <ProfileMenuItem
                  icon={<LinkIcon className="h-5 w-5" />}
                  label="Integrations"
                  active={activeTab === 'integrations'}
                  onClick={() => handleTabChange('integrations')}
                />
                
                <ProfileMenuItem
                  icon={<CreditCard className="h-5 w-5" />}
                  label="Memberships"
                  active={activeTab === 'memberships'}
                  onClick={() => handleTabChange('memberships')}
                />
                
                <ProfileMenuItem
                  icon={<Shield className="h-5 w-5" />}
                  label="Security"
                  active={activeTab === 'security'}
                  onClick={() => handleTabChange('security')}
                />
                
                <ProfileMenuItem
                  icon={<HelpCircle className="h-5 w-5" />}
                  label="Help Center"
                  active={activeTab === 'help'}
                  onClick={() => handleTabChange('help')}
                />
              </div>
              
              {/* Bottom section with logout */}
              <div className="px-3 py-3 mt-auto border-t">
                <ProfileMenuItem
                  icon={<LogOut className="h-5 w-5" />}
                  label="Log Out"
                  onClick={handleLogout}
                  danger={true}
                />
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1 space-y-6">
            {/* Connected accounts */}
            {activeTab === "connections" && (
              <ConnectionsTab profileData={profileData} loading={loading} />
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
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
