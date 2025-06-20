import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useSellerProfile } from "@/hooks/useSellerProfile";
import { supabase } from "@/lib/supabase";
import SellerDashboardLayout from "@/components/layout/seller-dashboard-layout";
import SellerApplicationModal from "@/components/seller/seller-application-modal";
import { OffersInboxModal } from "@/components/seller/offers-inbox-modal-streamlined";
import { useMarketingCenterModal } from "@/hooks/use-marketing-center-modal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  LayoutDashboard,
  Home,
  Plus,
  Search,
  Filter,
  Clock,
  Eye,
  Users,
  Calendar,
  ChevronRight,
  BadgeCheck,
  BadgeAlert,
  Clock3,
  HandHeart,
  Megaphone,
  DollarSign,
  Building,
  MoreHorizontal,
  Share2,
  File,
  FileText,
  AlertCircle,
  XCircle,
  Pause,
} from "lucide-react";
import { PropertyCard } from "@/components/property/property-card";
import { usePropertyProfile } from "@/hooks/usePropertyProfile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EnhancedPropertyListingModal } from "@/components/property/enhanced-property-listing-modal";
import { useToast } from "@/hooks/use-toast";

// Property data will be fetched from the backend API

// Sample recent activity data
const RECENT_ACTIVITY = [
  {
    id: "act1",
    propertyId: "prop1",
    propertyTitle: "3-Bed Single Family Home",
    thumbnail: "/images/property1.jpg",
    timeAgo: "2 hours",
    action: "Updated listing details",
  },
  {
    id: "act2",
    propertyId: "prop2",
    propertyTitle: "Duplex Investment Property",
    thumbnail: "/images/property2.jpg",
    timeAgo: "1 day",
    action: "Received new offer",
  },
];

// Status options for multi-select filtering
const STATUS_OPTIONS = [
  { value: "All", label: "All" },
  { value: "Drafts", label: "Drafts" },
  { value: "Live", label: "Live" },
  { value: "Offer Accepted", label: "Offer Accepted" },
  { value: "Pending", label: "Pending" },
  { value: "Closed", label: "Closed" },
  { value: "Dropped", label: "Dropped" },
  { value: "Archived", label: "Archived" },
];

/**
 * SellerDashboardPage - Main dashboard for sellers
 */
export default function SellerDashboardPage() {
  const params = useParams();
  const { user } = useAuth();
  const { profile: sellerProfile, loading: isLoadingProfile } =
    useSellerProfile();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["All"]);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const marketingCenterModal = useMarketingCenterModal();
  const [isOffersInboxOpen, setIsOffersInboxOpen] = useState(false);
  const { toast } = useToast();

  const userId = params.userId || "";

  // Check if current user can access this dashboard
  useEffect(() => {
    if (user && userId !== user.id) {
      // Redirect to user's own dashboard
      setLocation(`/sellerdash/${user.id}`);
    }
  }, [user, userId, setLocation]);

  // Status-based access control
  const getSellerAccessStatus = () => {
    if (isLoadingProfile) return "loading";
    if (!sellerProfile) return "no_profile";
    return sellerProfile.status;
  };

  const sellerStatus = getSellerAccessStatus();
  const hasSellerAccess = sellerStatus === "active";

  // Fetch property profiles directly from Supabase
  const { data: properties, isLoading: isLoadingProperties } = useQuery({
    queryKey: ["seller-property-profiles", userId],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Authentication required");
      }

      const { data, error } = await supabase
        .from("property_profile")
        .select("*")
        .eq("seller_id", user.id); // Using seller_id for ownership

      if (error) {
        console.error("Error fetching property profiles:", error);
        throw new Error("Failed to fetch property profiles");
      }

      return data || [];
    },
    enabled: !!userId && hasSellerAccess,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Initialize the property profile hook
  const { createPropertyDraft } = usePropertyProfile();

  // Handler to create a new draft property and redirect to editor
  const handleCreateListing = async () => {
    try {
      if (!user?.id) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create a property listing.",
          variant: "destructive",
        });
        return;
      }

      // Create minimal draft using the sanitized pathway
      const minimalDraftData = {
        name: "New Property Draft",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        propertyType: "",
        status: "draft",
      };

      const draftResponse = await createPropertyDraft(minimalDraftData);

      if (draftResponse && draftResponse.id) {
        toast({
          title: "Draft Created",
          description:
            "Your property draft has been saved. You can now fill in the details.",
        });
        // Redirect to the property editor page
        setLocation(`/sellerdash/${userId}/property/${draftResponse.id}`);
      } else {
        throw new Error("Failed to create draft");
      }
    } catch (error) {
      console.error("Error creating draft:", error);
      toast({
        title: "Error",
        description: "Failed to create property draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show status modal for non-active sellers
  useEffect(() => {
    if (!isLoadingProfile && !hasSellerAccess) {
      setIsSellerModalOpen(true);
    }
  }, [isLoadingProfile, hasSellerAccess]);

  // Calculate stats from real property data
  const stats = {
    activeListings:
      properties?.filter((p) => p.status === "active" || p.status === "live")
        .length || 0,
    offersPending: 3, // TODO: Calculate from offers data when available
    assignmentRevenue: "$12,500", // TODO: Calculate from closed deals
    avgDaysOnMarket: 15, // TODO: Calculate from property data
  };

  // Transform property data for display
  const resolvePublicUrl = (path: string | null): string | null => {
    if (!path) return null;
    return supabase.storage.from("properties").getPublicUrl(path).data
      .publicUrl;
  };

  const transformPropertyForDisplay = (property: any) => {
    const fullAddress = [
      property.address,
      property.city,
      property.state,
      property.zipCode,
    ]
      .filter(Boolean)
      .join(", ");

    const getDaysLeft = (closingDate: string | null) => {
      if (!closingDate) return "N/A";
      const today = new Date();
      const closing = new Date(closingDate);
      const diffTime = closing.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? `${diffDays} days left` : "Overdue";
    };

    const getStatusDisplayName = (status: string) => {
      switch (status?.toLowerCase()) {
        case "draft":
          return "Draft";
        case "active":
          return "Live";
        case "live":
          return "Live";
        case "offer_accepted":
          return "Offer Accepted";
        case "closed":
          return "Closed";
        case "pending":
          return "Pending";
        default:
          return status || "Unknown";
      }
    };

    return {
      id: property.id,
      title: property.name || "Unnamed Property",
      address: fullAddress || "No Address",
      price: property.listingPrice || property.purchasePrice || 0,
      status: getStatusDisplayName(property.status),
      thumbnail:
        resolvePublicUrl(property.primaryImage) || "/api/placeholder/400/300",
      views: property.viewCount || 0,
      leads: 0, // TODO: Calculate from inquiries when available
      daysListed: getDaysLeft(property.closingDate),
      beds: property.bedrooms || 0,
      baths: property.bathrooms || 0,
      sqft: property.sqft || 0,
      arv: property.arv || 0,
      offers: 0, // TODO: Calculate from offers when available
      assignmentFee:
        property.assignmentFee ||
        (property.listingPrice && property.purchasePrice
          ? property.listingPrice - property.purchasePrice
          : 0),
    };
  };

  // Filter and transform properties based on search and status
  const filteredProperties = (properties || [])
    .map(transformPropertyForDisplay)
    .filter((property) => {
      const matchesSearch =
        !searchQuery ||
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatuses.includes("All") ||
        selectedStatuses.includes(property.status);

      return matchesSearch && matchesStatus;
    })
    .slice(0, 20); // Limit to 20 properties initially

  // Get status badge style based on status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Listed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Under Contract":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Closed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Function to get seller status icon
  const getSellerStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <BadgeCheck className="h-5 w-5 text-green-600" />;
      case "pending":
        return <Clock3 className="h-5 w-5 text-yellow-600" />;
      case "rejected":
        return <BadgeAlert className="h-5 w-5 text-red-600" />;
      default:
        return <Clock3 className="h-5 w-5 text-gray-400" />;
    }
  };

  // Render status-based modal with proper branding and functionality
  const renderStatusModal = () => {
    if (sellerStatus === "active" || sellerStatus === "loading") return null;

    const handleStatusAction = () => {
      switch (sellerStatus) {
        case "no_profile":
          // Open seller application modal
          setIsSellerModalOpen(false);
          // Will trigger application modal from useEffect
          break;
        case "pending":
          // Navigate to help
          setLocation("/help");
          break;
        case "rejected":
          // Open seller application modal for reapplication
          setIsSellerModalOpen(false);
          // Will trigger application modal from useEffect
          break;
        case "paused":
          // TODO: Implement reactivation request
          setLocation("/help");
          break;
      }
    };

    const statusConfig = {
      no_profile: {
        icon: "❗",
        title: "Seller Application Required",
        message:
          "To access the seller dashboard and list properties, you need to complete the seller application process.",
        action: "Apply as Seller",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        iconColor: "text-orange-500",
        buttonColor: "bg-orange-600 hover:bg-orange-700",
      },
      pending: {
        icon: "⏳",
        title: "Application Pending",
        message:
          "Your seller application is being reviewed. We'll notify you once approved.",
        action: "Contact Support",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        iconColor: "text-yellow-600",
        buttonColor: "bg-yellow-600 hover:bg-yellow-700",
      },
      rejected: {
        icon: "🛑",
        title: "Application Rejected",
        message:
          sellerProfile?.notes ||
          "Your seller application was not approved. You can reapply or contact support for more information.",
        action: "Reapply",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        iconColor: "text-red-600",
        buttonColor: "bg-[#803344] hover:bg-[#6d2938]",
      },
      paused: {
        icon: "🔒",
        title: "Account Paused",
        message:
          "Your seller account has been paused. Contact support to reactivate your account.",
        action: "Reactivate Account",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        iconColor: "text-blue-600",
        buttonColor: "bg-blue-600 hover:bg-blue-700",
      },
    };

    const config = statusConfig[sellerStatus as keyof typeof statusConfig];
    if (!config) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center p-4">
        <div
          className={`bg-white rounded-lg shadow-xl border-2 ${config.borderColor} max-w-md w-full mx-auto`}
        >
          <div
            className={`${config.bgColor} p-6 rounded-t-lg border-b ${config.borderColor}`}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{config.icon}</div>
              <h2 className={`text-xl font-semibold ${config.iconColor}`}>
                {config.title}
              </h2>
            </div>
          </div>

          <div className="p-6 text-center space-y-6">
            <p className="text-gray-700 leading-relaxed">{config.message}</p>

            <div className="space-y-3">
              <Button
                className={`w-full text-white ${config.buttonColor} transition-all duration-200 hover:scale-105 active:scale-95`}
                onClick={handleStatusAction}
              >
                {config.action}
              </Button>

              {sellerStatus !== "no_profile" && (
                <Button
                  variant="ghost"
                  className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
                  onClick={() => setLocation("/help")}
                >
                  Need Help?
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Show loading state
  if (isLoadingProfile) {
    return (
      <SellerDashboardLayout userId={userId}>
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </SellerDashboardLayout>
    );
  }

  return (
    <SellerDashboardLayout userId={userId}>
      {/* Main content container with conditional blur */}
      <div
        className={`-mt-6 -mx-4 p-4 rounded-lg ${!hasSellerAccess ? "blur-sm pointer-events-none" : ""}`}
      >
        {/* Top welcome & status bar */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.fullName?.split(" ")[0] || "Seller"} 👋
            </h1>
            <p className="text-gray-600 mt-1">
              {hasSellerAccess
                ? "Here's how your real estate business is performing today."
                : "Complete your seller application to unlock your PropertyDeals dashboard."}
            </p>
          </div>

          <div className="mt-4 sm:mt-0">
            <div className="flex items-center gap-2">
              {getSellerStatusIcon(sellerProfile?.status || "pending")}
              <Badge
                className={`px-3 py-1 text-sm ${getStatusBadgeClass(sellerProfile?.status || "pending")}`}
              >
                {sellerProfile?.status === "active"
                  ? "Active Seller"
                  : sellerProfile?.status === "pending"
                    ? "Pending Approval"
                    : sellerProfile?.status === "rejected"
                      ? "Approval Rejected"
                      : sellerProfile?.status === "paused"
                        ? "Account Paused"
                        : "Pending Application"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats grid with CTA Cards - 6 column grid on mobile/tablet: top row 2 spaces each, bottom row 3 spaces each. 5 column grid on desktop: all cards in 1 row */}
        <div className="grid grid-cols-6 xl:grid-cols-5 gap-2 lg:gap-4 mb-10">
          {/* List a Property CTA Card - spans 2 columns on mobile/tablet, 1 column on desktop */}
          <div
            onClick={() => setIsAddPropertyModalOpen(true)}
            className="col-span-2 xl:col-span-1 group relative overflow-hidden rounded-lg border hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col"
          >
            {/* Wine background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#803344] to-[#803344]"></div>

            {/* Animated decoration elements on hover only */}
            <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white opacity-10 group-hover:animate-pulse group-hover:scale-150 transition-transform duration-500"></div>
            <div className="absolute -left-8 -bottom-8 h-16 w-16 rounded-full bg-white opacity-10 group-hover:animate-bounce group-hover:scale-125 transition-transform duration-700 delay-100"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full bg-white opacity-5 group-hover:animate-ping"></div>

            {/* Content with vertical centering */}
            <div className="relative h-full flex flex-col items-center justify-center text-center p-2 lg:p-4 z-10">
              {/* Icon with animation */}
              <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-full bg-white/20 flex items-center justify-center mb-1 lg:mb-3 group-hover:scale-110 transition-transform duration-300">
                <Plus className="h-3 w-3 lg:h-6 lg:w-6 text-white" />
              </div>

              <h3 className="text-xs lg:text-lg font-medium text-white group-hover:scale-105 transition-transform duration-300">
                List a Property
              </h3>

              <div className="mt-1 lg:mt-2 text-xs lg:text-sm text-white/80 flex items-center">
                <span className="hidden lg:inline">Get Started</span>
                <ChevronRight className="h-2 w-2 lg:h-3 lg:w-3 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* Review Offers CTA Card - spans 2 columns on mobile/tablet, 1 column on desktop */}
          <div
            onClick={() => setIsOffersInboxOpen(true)}
            className="col-span-2 xl:col-span-1 group relative overflow-hidden rounded-lg border hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col"
          >
            {/* Lighter green background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#135341] to-[#135341]"></div>

            {/* Animated decoration elements on hover only */}
            <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white opacity-10 group-hover:animate-pulse group-hover:scale-150 transition-transform duration-500"></div>
            <div className="absolute -left-8 -bottom-8 h-16 w-16 rounded-full bg-white opacity-10 group-hover:animate-bounce group-hover:scale-125 transition-transform duration-700 delay-100"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full bg-white opacity-5 group-hover:animate-ping"></div>

            {/* Content with vertical centering */}
            <div className="relative h-full flex flex-col items-center justify-center text-center p-2 lg:p-4 z-10 pt-[30px] pb-[30px]">
              {/* Icon with animation */}
              <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-full bg-white/20 flex items-center justify-center mb-1 lg:mb-3 group-hover:scale-110 transition-transform duration-300">
                <HandHeart className="h-3 w-3 lg:h-6 lg:w-6 text-white" />
              </div>

              <h3 className="text-xs lg:text-lg font-medium text-white group-hover:scale-105 transition-transform duration-300">
                Review Offers
              </h3>

              <div className="mt-1 lg:mt-2 text-xs lg:text-sm text-white/80 flex items-center">
                <span className="hidden lg:inline">
                  {stats.offersPending} pending
                </span>
                <ChevronRight className="h-2 w-2 lg:h-3 lg:w-3 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* Market a Deal CTA Card - spans 2 columns on mobile/tablet, 1 column on desktop */}
          <div
            onClick={() => marketingCenterModal.onOpen()}
            className="col-span-2 xl:col-span-1 group relative overflow-hidden rounded-lg border hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col"
          >
            {/* Dark green background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#09261E] to-[#09261E]"></div>

            {/* Animated decoration elements on hover only */}
            <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white opacity-10 group-hover:animate-pulse group-hover:scale-150 transition-transform duration-500"></div>
            <div className="absolute -left-8 -bottom-8 h-16 w-16 rounded-full bg-white opacity-10 group-hover:animate-bounce group-hover:scale-125 transition-transform duration-700 delay-100"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full bg-white opacity-5 group-hover:animate-ping"></div>

            {/* Content with vertical centering */}
            <div className="relative h-full flex flex-col items-center justify-center text-center p-2 lg:p-4 z-10">
              {/* Icon with animation */}
              <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-full bg-white/20 flex items-center justify-center mb-1 lg:mb-3 group-hover:scale-110 transition-transform duration-300">
                <Megaphone className="h-3 w-3 lg:h-6 lg:w-6 text-white" />
              </div>

              <h3 className="text-xs lg:text-lg font-medium text-white group-hover:scale-105 transition-transform duration-300">
                Market a Deal
              </h3>

              <div className="mt-1 lg:mt-2 text-xs lg:text-sm text-white/80 flex items-center">
                <span className="hidden lg:inline">Start Campaign</span>
                <ChevronRight className="h-2 w-2 lg:h-3 lg:w-3 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* Active Listings - spans 3 columns on mobile/tablet, 1 column on desktop */}
          <Card className="col-span-3 xl:col-span-1 border-l-4 border-l-[#135341] hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Building className="h-7 w-7 text-[#135341]" />
                <span className="text-3xl font-bold">
                  {stats.activeListings}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-base font-medium text-gray-600">
                Active Listings
              </CardTitle>
            </CardContent>
          </Card>

          {/* Assignment Revenue - spans 3 columns on mobile/tablet, 1 column on desktop */}
          <Card className="col-span-3 xl:col-span-1 border-l-4 border-l-green-600 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <DollarSign className="h-7 w-7 text-green-600" />
                <span className="text-3xl font-bold">
                  {stats.assignmentRevenue}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-base font-medium text-gray-600">
                Assignment Revenue
              </CardTitle>
            </CardContent>
          </Card>
        </div>

        {/* Your Properties Section */}
        <div className="mt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <h2 className="text-xl font-semibold">My Properties</h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Removed "Add New Property" button as requested */}
              <div className="flex gap-2 flex-1">
                {/* List a Property CTA Card */}
                <Button
                  className="flex items-center gap-2 bg-[#135341] hover:bg-[#09261E] text-white"
                  onClick={() => setIsAddPropertyModalOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  <span>List a Property</span>
                </Button>

                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="w-48">
                  <MultiSelect
                    options={STATUS_OPTIONS}
                    selected={selectedStatuses}
                    onSelectionChange={setSelectedStatuses}
                    placeholder="Filter by status..."
                    className="min-w-[200px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          {isLoadingProperties ? (
            // Loading state with skeleton cards
            <div className="grid grid-cols-1 min-[600px]:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 min-[600px]:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  userId={userId}
                  title={property.title}
                  address={property.address}
                  status={property.status as any}
                  image={property.thumbnail}
                  price={
                    typeof property.price === "string"
                      ? parseInt(property.price.replace(/[^0-9]/g, ""))
                      : property.price
                  }
                  beds={property.beds || 3}
                  baths={property.baths || 2}
                  sqft={property.sqft || 2000}
                  arv={
                    property.arv ||
                    (typeof property.price === "string"
                      ? parseInt(property.price.replace(/[^0-9]/g, "")) * 1.2
                      : property.price * 1.2)
                  }
                  views={property.views}
                  leads={property.leads}
                  daysOnMarket={property.daysListed}
                  offers={property.offers || 0}
                />
              ))}
            </div>
          ) : (
            // Empty state
            <div className="py-16 text-center bg-white rounded-lg border border-dashed border-gray-300">
              <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                You haven't listed any properties yet.
              </h3>
              <p className="text-gray-500 mb-6">
                Get started by adding your first deal.
              </p>
              <Button
                className="bg-[#135341] hover:bg-[#09261E] text-white"
                onClick={() => setIsAddPropertyModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Property
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Floating Quick List Button removed - now using global QuickActionSelector */}
      {/* Enhanced Property Listing Modal */}
      <EnhancedPropertyListingModal
        isOpen={isAddPropertyModalOpen}
        onClose={() => setIsAddPropertyModalOpen(false)}
      />
      {/* Offers Inbox Modal */}
      <OffersInboxModal
        isOpen={isOffersInboxOpen}
        onClose={() => setIsOffersInboxOpen(false)}
      />

      {/* Status-based Modal Overlay */}
      {renderStatusModal()}

      {/* Seller Application Modal - Shows for no_profile and rejected statuses when modal is dismissed */}
      <SellerApplicationModal
        isOpen={
          (sellerStatus === "no_profile" || sellerStatus === "rejected") &&
          !isSellerModalOpen
        }
        onClose={() => {
          // For no_profile, don't allow closing - they must complete application
          if (sellerStatus === "no_profile") return;
          // For rejected, they can close and see the modal again
          setIsSellerModalOpen(true);
        }}
      />
    </SellerDashboardLayout>
  );
}
