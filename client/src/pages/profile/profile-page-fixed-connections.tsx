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
  UserPlus,
  MoreVertical,
  Ban,
  Home
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
    preferred_sellers: [],
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

  // Add functions here for profile handling
  const handleProfilePhotoUpload = () => {
    // Implementation
  };

  const handleBannerUpload = () => {
    // Implementation
  };

  const handleProfileSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation
  };

  const handleMultiSelectChange = (field: string, value: any, section?: string) => {
    // Implementation
  };

  // Main render
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
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account details and profile information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Account content here</p>
                </CardContent>
              </Card>
            )}
            
            {/* Property Preferences */}
            {activeTab === "property_preferences" && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Property Preferences</CardTitle>
                  <CardDescription>Set your property investment preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Property preferences content here</p>
                </CardContent>
              </Card>
            )}
            
            {/* Connections Tab - Replaced with our new component */}
            {activeTab === "connections" && (
              <ConnectionsTab profileData={profileData} loading={loading} />
            )}
            
            {/* Notifications Tab */}
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Integrations Tab */}
            {activeTab === "integrations" && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>Connect with third-party services</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Integrations content here</p>
                </CardContent>
              </Card>
            )}
            
            {/* Memberships Tab */}
            {activeTab === "memberships" && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Memberships</CardTitle>
                  <CardDescription>Manage your subscription plans</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Memberships content here</p>
                </CardContent>
              </Card>
            )}
            
            {/* Security Tab */}
            {activeTab === "security" && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your account security settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Security content here</p>
                </CardContent>
              </Card>
            )}
            
            {/* Help Center Tab */}
            {activeTab === "help" && (
              <>
                <div className="border-b pb-4 mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
                  <p className="text-gray-500 mt-1">Get the support you need with our help resources, submit feedback, or report issues with the platform.</p>
                </div>
                
                {/* Help content here */}
                <p>Help Center content</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}