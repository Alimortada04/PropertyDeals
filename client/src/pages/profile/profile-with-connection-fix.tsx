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
} from "lucide-react";

// Third-party icons - we use these directly for specialized icons
import { Instagram, Linkedin, Facebook as FacebookIcon, Info } from "lucide-react";

// Same as the original profile-page.tsx - duplicate the content here
// ...

export default function ProfilePage() {
  // Your existing state and hooks
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
  
  // Determine active tab from URL
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
  
  // Other useEffect hooks and state from the original file...
  
  // Default profile data
  const [profileData, setProfileData] = useState<any>({
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
    created_at: "",
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
  
  // Your existing functions (fetch profile, handle changes, etc.)
  
  // Fetch profile data from API
  const { data: profileQueryData, isLoading: profileIsLoading } = useQuery({
    queryKey: ['/api/profile'],
    queryFn: async () => {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) throw new Error("Failed to fetch profile");
        return await response.json();
      } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
    },
    enabled: !!user, 
  });
  
  // Update local state when profile data is fetched
  useEffect(() => {
    if (profileQueryData) {
      setProfileData(prev => ({
        ...prev,
        ...profileQueryData,
      }));
    }
  }, [profileQueryData]);

  // Your other handlers and UI functions
  
  return (
    <div className={styles.profilePage}>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar - Your existing sidebar */}
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
              // your account tab content
              <p>Account content here</p>
            )}
            
            {/* Property Preferences */}
            {activeTab === "property_preferences" && (
              // your property preferences tab content
              <p>Property preferences content here</p>
            )}
            
            {/* Connections Tab - HERE IS OUR CHANGE */}
            {activeTab === "connections" && (
              <ConnectionsTab profileData={profileData} loading={loading} />
            )}
            
            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              // your notifications tab content
              <p>Notifications content here</p>
            )}
            
            {/* Other tabs */}
            {/* ... */}
          </div>
        </div>
      </div>
    </div>
  );
}