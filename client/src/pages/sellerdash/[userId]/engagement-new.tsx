import React, { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { 
  MessageCircle, 
  DollarSign, 
  Eye, 
  Bookmark, 
  AlertTriangle,
  Calendar,
  Filter,
  Search, 
  CornerDownRight, 
  Users,
  Mail,
  Phone,
  Edit,
  Share2,
  ArrowUpRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Building2,
  Timer,
  X,
  Share,
  BarChart4,
  TrendingUp,
  TrendingDown,
  Info,
  Clock
} from "lucide-react";
import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { format, formatDistanceToNow, subDays } from 'date-fns';
import { motion, AnimatePresence } from "framer-motion";
import { Sparkline } from '@/components/ui/sparkline';
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from '@/hooks/use-media-query';

// Mock data with enhanced details
const mockProperties = [
  {
    id: "p1",
    title: "Modern Farmhouse Renovation Opportunity",
    address: "456 Oak St, Madison, WI 53703",
    neighborhood: "Shorewood Hills",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop",
    price: 459000,
    arv: 625000,
    repairCost: 75000,
    beds: 4,
    baths: 3,
    sqft: 2750,
    yearBuilt: 1962,
    lotSize: 0.42,
    propertyType: "Single Family",
    status: "Live",
    daysListed: 8,
    viewCount: 236,
    saveCount: 42,
    offerCount: 3,
    messageCount: 14,
    dealStage: "Active",
    activityTrend: [4, 12, 8, 15, 18, 23, 28], // Weekly activity trend
  },
  {
    id: "p2",
    title: "Downtown Loft with River Views",
    address: "123 Main St, Milwaukee, WI 53201",
    neighborhood: "Historic Third Ward",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2670&auto=format&fit=crop",
    price: 425000,
    arv: 485000,
    repairCost: 35000,
    beds: 3,
    baths: 2.5,
    sqft: 2150,
    yearBuilt: 1997,
    lotSize: 0.18,
    propertyType: "Condo",
    status: "Under Contract",
    daysListed: 14,
    viewCount: 178,
    saveCount: 28,
    offerCount: 2,
    messageCount: 8,
    dealStage: "Under Contract",
    activityTrend: [8, 14, 22, 18, 12, 10, 4], // Trending down as it's under contract
  },
  {
    id: "p3",
    title: "Craftsman Bungalow Near Lake",
    address: "890 Maple Ave, Milwaukee, WI 53211",
    neighborhood: "Shorewood",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2670&auto=format&fit=crop",
    price: 385000,
    arv: 515000,
    repairCost: 85000,
    beds: 3,
    baths: 2,
    sqft: 1850,
    yearBuilt: 1928,
    lotSize: 0.24,
    propertyType: "Single Family",
    status: "Live",
    daysListed: 5,
    viewCount: 143,
    saveCount: 19,
    offerCount: 0,
    messageCount: 6,
    dealStage: "Active",
    activityTrend: [3, 8, 12, 16, 22, 24, 29], // Trending up as it's new
  },
  {
    id: "p4",
    title: "Luxury Lakefront Estate",
    address: "742 Lakeside Dr, Madison, WI 53704",
    neighborhood: "Maple Bluff",
    image: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?q=80&w=2670&auto=format&fit=crop",
    price: 1250000,
    arv: 1450000,
    repairCost: 120000,
    beds: 5,
    baths: 4.5,
    sqft: 4850,
    yearBuilt: 2005,
    lotSize: 1.2,
    propertyType: "Luxury",
    status: "Live",
    daysListed: 32,
    viewCount: 87,
    saveCount: 15,
    offerCount: 1,
    messageCount: 4,
    dealStage: "Active",
    activityTrend: [7, 5, 8, 4, 6, 5, 3], // Lower but consistent activity
  },
];

// Mock buyer profiles
const mockBuyers = [
  {
    id: "b1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-111-2222",
    image: "",
    verified: true,
    type: "Investor",
    reputation: "REP Verified",
    previousDeals: 3,
    interests: ["Multifamily", "Fix and Flip"],
    fundsAvailable: 750000,
    preferredLocations: ["Madison", "Milwaukee"],
    activityLevel: "Very Active", // Last active today
    viewHistory: [
      { propertyId: "p1", count: 7, lastView: new Date(Date.now() - 4 * 60 * 60 * 1000) },
      { propertyId: "p3", count: 3, lastView: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    ],
    engagementScore: 87,
    engagementHistory: [12, 8, 14, 18, 22, 24, 28],
    notes: "Serious cash buyer. Tends to make quick decisions and prefers off-market deals.",
    tags: ["Hot lead", "Pre-approved", "Cash buyer"],
  },
  {
    id: "b2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "555-333-4444",
    image: "",
    verified: false,
    type: "Home Buyer",
    reputation: "New User",
    previousDeals: 0,
    interests: ["Single Family", "Ready to Move In"],
    fundsAvailable: 450000,
    preferredLocations: ["Milwaukee"],
    activityLevel: "Active", // Last active today
    viewHistory: [
      { propertyId: "p2", count: 5, lastView: new Date(Date.now() - 12 * 60 * 60 * 1000) },
    ],
    engagementScore: 64,
    engagementHistory: [4, 8, 10, 15, 12, 14, 16],
    notes: "First-time homebuyer. Has pre-approval letter from XYZ Bank.",
    tags: ["First-time buyer", "Needs info", "Pre-approved"],
  },
  {
    id: "b3",
    name: "Mike Williams",
    email: "mike.williams@example.com",
    phone: "555-555-6666",
    image: "",
    verified: false,
    type: "Investor",
    reputation: "Standard",
    previousDeals: 1,
    interests: ["Short Term Rental", "Vacation Properties"],
    fundsAvailable: 600000,
    preferredLocations: ["Madison", "Lake Areas"],
    activityLevel: "Moderate", // Last active yesterday
    viewHistory: [
      { propertyId: "p3", count: 2, lastView: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { propertyId: "p4", count: 1, lastView: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    ],
    engagementScore: 48,
    engagementHistory: [5, 8, 12, 9, 7, 8, 10],
    notes: "Looking for vacation rental opportunities. Prefers lakefront properties.",
    tags: ["Vacation property buyer", "Investor"],
  },
  {
    id: "b4",
    name: "Jessica Brown",
    email: "jessica.brown@example.com",
    phone: "555-777-8888",
    image: "",
    verified: true,
    type: "Agent",
    reputation: "REP Verified",
    previousDeals: 12,
    interests: ["All Property Types", "Investment Opportunities"],
    fundsAvailable: 2000000,
    preferredLocations: ["Madison", "Milwaukee", "Green Bay"],
    activityLevel: "Very Active", // Last active today
    viewHistory: [
      { propertyId: "p1", count: 5, lastView: new Date(Date.now() - 2 * 60 * 60 * 1000) },
      { propertyId: "p2", count: 3, lastView: new Date(Date.now() - 6 * 60 * 60 * 1000) },
      { propertyId: "p3", count: 2, lastView: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { propertyId: "p4", count: 4, lastView: new Date(Date.now() - 8 * 60 * 60 * 1000) },
    ],
    engagementScore: 92,
    engagementHistory: [14, 18, 22, 24, 26, 28, 30],
    notes: "Buyer's agent representing multiple investors. Very responsive and professional.",
    tags: ["Agent", "Repeat visitor", "High budget"],
  },
  {
    id: "b5",
    name: "David Lee",
    email: "david.lee@example.com",
    phone: "555-999-0000",
    image: "",
    verified: true,
    type: "Investor",
    reputation: "Premium",
    previousDeals: 8,
    interests: ["Fix and Flip", "Multifamily"],
    fundsAvailable: 1200000,
    preferredLocations: ["Milwaukee", "Waukesha"],
    activityLevel: "Active", // Last active today
    viewHistory: [
      { propertyId: "p2", count: 8, lastView: new Date(Date.now() - 5 * 60 * 60 * 1000) },
      { propertyId: "p3", count: 1, lastView: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    ],
    engagementScore: 83,
    engagementHistory: [10, 15, 18, 22, 25, 24, 26],
    notes: "Experienced flipper with quick closing capability. May waive contingencies for the right deal.",
    tags: ["Fast closer", "Experienced investor", "Cash buyer"],
  },
];

// Enhanced mock engagement data
const mockEngagements = [
  {
    id: "e1",
    propertyId: "p1",
    type: "offer",
    buyerId: "b1",
    buyerName: "John Smith",
    buyerImage: "",
    buyerType: "Investor",
    buyerReputation: "REP Verified",
    verified: true,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    status: "new",
    offerAmount: 395000,
    offerTerms: {
      closingTimeframe: "30 days",
      contingencies: ["Inspection", "Financing"],
      earnestMoney: 10000,
    },
    message: "I'm interested in this property and would like to make an offer of $395,000. I can close within 30 days and have proof of funds ready. Please let me know if this works for you.",
    aiScore: 0.85,
    aiSentiment: "Likely to increase offer",
    activityHistory: [
      { action: "Viewed property", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { action: "Saved property", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { action: "Viewed property", timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) },
      { action: "Downloaded disclosures", timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) },
      { action: "Made offer", timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
    ],
    isUnread: true,
    tags: ["Hot lead", "Pre-approved"],
  },
  {
    id: "e2",
    propertyId: "p2",
    type: "message",
    buyerId: "b2",
    buyerName: "Sarah Johnson",
    buyerImage: "",
    buyerType: "Home Buyer",
    buyerReputation: "New User",
    verified: false,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    status: "replied",
    message: "Hi there, I'm curious about the property. Is it still available? Does it have a finished basement? I'd also like to know more about the neighborhood and schools in the area.",
    aiScore: 0.72,
    aiSentiment: "Genuine interest, research phase",
    activityHistory: [
      { action: "Viewed property", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { action: "Viewed property", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { action: "Saved property", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { action: "Sent message", timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) },
    ],
    isUnread: false,
    tags: ["First-time buyer", "Needs info"],
  },
  {
    id: "e3",
    propertyId: "p3",
    type: "save",
    buyerId: "b3",
    buyerName: "Mike Williams",
    buyerImage: "",
    buyerType: "Investor",
    buyerReputation: "Standard",
    verified: false,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: "viewed",
    aiScore: 0.65,
    aiSentiment: "Casual interest",
    activityHistory: [
      { action: "Viewed property", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { action: "Saved property", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    ],
    isUnread: false,
    tags: ["Vacation property buyer"],
  },
  {
    id: "e4",
    propertyId: "p1",
    type: "view",
    buyerId: "b4",
    buyerName: "Jessica Brown",
    buyerImage: "",
    buyerType: "Agent",
    buyerReputation: "REP Verified",
    verified: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: "viewed",
    viewCount: 5,
    aiScore: 0.78,
    aiSentiment: "Likely representing client",
    activityHistory: [
      { action: "Viewed property", timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { action: "Saved property", timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
      { action: "Viewed property", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { action: "Viewed property", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { action: "Viewed property", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { action: "Viewed floor plan", timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) },
      { action: "Viewed property", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    ],
    isUnread: true,
    tags: ["Agent", "Repeat visitor"],
  },
  {
    id: "e5",
    propertyId: "p2",
    type: "offer",
    buyerId: "b5",
    buyerName: "David Lee",
    buyerImage: "",
    buyerType: "Investor",
    buyerReputation: "Premium",
    verified: true,
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    status: "accepted",
    offerAmount: 420000,
    offerTerms: {
      closingTimeframe: "21 days",
      contingencies: ["Inspection"],
      earnestMoney: 15000,
    },
    message: "I'd like to make an offer of $420,000 for this beautiful property. I can close within 21 days and only need an inspection contingency. Earnest money deposit of $15,000 will be provided within 24 hours of acceptance.",
    aiScore: 0.92,
    aiSentiment: "Highly motivated buyer",
    activityHistory: [
      { action: "Viewed property", timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { action: "Saved property", timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
      { action: "Requested info", timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { action: "Viewed property", timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
      { action: "Downloaded disclosures", timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { action: "Made offer", timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
    ],
    isUnread: false,
    tags: ["Cash buyer", "Fast closer"],
  },
  {
    id: "e6",
    propertyId: "p1",
    type: "message",
    buyerId: "b1",
    buyerName: "John Smith",
    buyerImage: "",
    buyerType: "Investor",
    buyerReputation: "REP Verified",
    verified: true,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: "new",
    message: "Following up on my previous message. I'm still very interested in this property and would appreciate any additional information you can provide. I've already secured financing and am ready to proceed quickly.",
    aiScore: 0.88,
    aiSentiment: "Highly interested, ready to proceed",
    activityHistory: [
      { action: "Viewed property", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { action: "Saved property", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { action: "Sent message", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { action: "Viewed property", timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000) },
      { action: "Sent message", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    ],
    isUnread: true,
    tags: ["Hot lead", "Pre-approved"],
  },
  {
    id: "e7",
    propertyId: "p3",
    type: "message",
    buyerId: "b4",
    buyerName: "Jessica Brown",
    buyerImage: "",
    buyerType: "Agent",
    buyerReputation: "REP Verified",
    verified: true,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    status: "new",
    message: "I have a client who is very interested in this property. We'd like to schedule a showing tomorrow afternoon if possible. Please let me know the available time slots. My client is pre-approved and can make a decision quickly.",
    aiScore: 0.95,
    aiSentiment: "Very high intent, qualified buyer",
    activityHistory: [
      { action: "Viewed property", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { action: "Viewed property", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { action: "Saved property", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { action: "Viewed property", timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) },
      { action: "Sent message", timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) },
    ],
    isUnread: true,
    tags: ["Agent", "Hot lead"],
  },
];

// Animation variants for animated elements
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
};

export default function EngagementPage() {
  const { userId } = useParams();
  const [location, setLocation] = useLocation();
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [selectedEngagementTypes, setSelectedEngagementTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<string>("most-recent");
  const { toast } = useToast();
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  
  // Filter engagements based on filters
  const filteredEngagements = useMemo(() => {
    return mockEngagements.filter(engagement => {
      // Filter by properties if any selected
      if (selectedProperties.length > 0 && !selectedProperties.includes(engagement.propertyId)) return false;
      
      // Filter by engagement types if any selected
      if (selectedEngagementTypes.length > 0 && !selectedEngagementTypes.includes(engagement.type)) return false;
      
      // Filter by status if any selected
      if (selectedStatus.length > 0 && !selectedStatus.includes(engagement.status)) return false;
      
      // Search by buyer name, message content, or property address
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        const matchesBuyer = engagement.buyerName.toLowerCase().includes(lowerQuery);
        const matchesMessage = engagement.message?.toLowerCase().includes(lowerQuery) || false;
        const matchesProperty = getPropertyById(engagement.propertyId)?.address.toLowerCase().includes(lowerQuery) || false;
        if (!matchesBuyer && !matchesMessage && !matchesProperty) return false;
      }
      
      return true;
    });
  }, [selectedProperties, selectedEngagementTypes, selectedStatus, searchQuery]);
  
  // Group engagements by property
  const engagementsByProperty = useMemo(() => {
    const groupedEngagements: Record<string, typeof mockEngagements> = {};
    
    // First, group all engagements by property ID
    filteredEngagements.forEach(engagement => {
      if (!groupedEngagements[engagement.propertyId]) {
        groupedEngagements[engagement.propertyId] = [];
      }
      groupedEngagements[engagement.propertyId].push(engagement);
    });
    
    return groupedEngagements;
  }, [filteredEngagements]);
  
  // Get properties with engagements
  const propertiesWithEngagements = useMemo(() => {
    let properties = Object.keys(engagementsByProperty).map(propId => 
      getPropertyById(propId)
    ).filter(Boolean) as typeof mockProperties;
    
    // Apply sorting
    if (sorting === "most-recent") {
      properties.sort((a, b) => b.daysListed - a.daysListed);
    } else if (sorting === "highest-offers") {
      properties.sort((a, b) => b.offerCount - a.offerCount);
    } else if (sorting === "most-views") {
      properties.sort((a, b) => b.viewCount - a.viewCount);
    }
    
    return properties;
  }, [engagementsByProperty, sorting]);
  
  // Calculate metrics for dashboard
  const activeProperties = mockProperties.filter(p => p.status === "Live").length;
  const totalViews = mockProperties.reduce((sum, p) => sum + p.viewCount, 0);
  const avgViewsPerProperty = totalViews / (activeProperties || 1);
  
  const totalSaves = mockProperties.reduce((sum, p) => sum + p.saveCount, 0);
  const avgSavesPerProperty = totalSaves / (activeProperties || 1);
  
  const totalOffers = mockProperties.reduce((sum, p) => sum + p.offerCount, 0);
  const avgOffersPerProperty = totalOffers / (activeProperties || 1);
  
  const totalMessages = mockProperties.reduce((sum, p) => sum + p.messageCount, 0);
  const unreadMessages = mockEngagements.filter(e => e.type === "message" && e.status === "new").length;
  
  // Mock response rate and time
  const responseRate = 78;
  const avgResponseTime = 6; // hours
  
  // Helper functions
  const getPropertyById = (propertyId: string) => {
    return mockProperties.find(p => p.id === propertyId);
  };
  
  const getBuyerById = (buyerId: string) => {
    return mockBuyers.find(b => b.id === buyerId);
  };
  
  const getPropertyEngagements = (propertyId: string) => {
    return mockEngagements.filter(e => e.propertyId === propertyId);
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return format(date, 'MMM d, yyyy');
  };
  
  // Calculate save-to-offer conversion rate for a specific property
  const calcSaveToOfferConversion = (propertyId: string) => {
    const property = getPropertyById(propertyId);
    if (!property) return 0;
    const saveCount = property.saveCount;
    if (saveCount === 0) return 0;
    
    return (property.offerCount / saveCount) * 100;
  };
  
  // Filter handlers
  const handleToggleProperty = (propertyId: string) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };
  
  const handleToggleEngagementType = (type: string) => {
    setSelectedEngagementTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  
  const handleToggleStatus = (status: string) => {
    setSelectedStatus(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };
  
  const handleClearFilters = () => {
    setSelectedProperties([]);
    setSelectedEngagementTypes([]);
    setSelectedStatus([]);
    setSearchQuery("");
  };
  
  const handleSelectProperty = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
  };
  
  // AI response generation
  const handleUseAI = (engagementId: string) => {
    toast({
      title: "AI response generated",
      description: "A personalized response has been created based on this message.",
    });
  };
  
  // Get latest activity data for timeline
  const getPropertyActivityTimeline = (propertyId: string) => {
    const relevantEngagements = mockEngagements.filter(e => e.propertyId === propertyId);
    return relevantEngagements.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };
  
  // Get all engaged buyers for a property
  const getEngagedBuyers = (propertyId: string) => {
    const relevantEngagements = mockEngagements.filter(e => e.propertyId === propertyId);
    const buyerIds = [...new Set(relevantEngagements.map(e => e.buyerId))];
    return buyerIds.map(id => {
      const buyer = getBuyerById(id);
      if (!buyer) return null;
      
      // Get latest engagement
      const buyerEngagements = relevantEngagements.filter(e => e.buyerId === id);
      const latestEngagement = buyerEngagements.sort((a, b) => 
        b.timestamp.getTime() - a.timestamp.getTime()
      )[0];
      
      return {
        ...buyer,
        latestEngagement
      };
    }).filter(Boolean);
  };

  // Render dashboard metric card
  const MetricCard = ({ 
    icon: Icon, 
    title, 
    value, 
    secondaryValue, 
    trend, 
    trendDirection, 
    highlight 
  }: { 
    icon: React.ElementType, 
    title: string, 
    value: string | number, 
    secondaryValue?: string, 
    trend?: string, 
    trendDirection?: 'up' | 'down' | 'neutral',
    highlight?: boolean 
  }) => (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className={cn(
        "rounded-lg shadow-sm border overflow-hidden",
        highlight ? "bg-gradient-to-br from-[#803344]/5 to-[#803344]/10 border-[#803344]/30" : "bg-white"
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-gray-100">
                <Icon className="h-5 w-5 text-gray-700" />
              </div>
              <h3 className="font-medium text-gray-500 text-sm">{title}</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{value}</span>
              {secondaryValue && (
                <span className="text-sm text-gray-500">{secondaryValue}</span>
              )}
            </div>
            {trend && (
              <div className="flex items-center gap-1.5">
                {trendDirection === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                {trendDirection === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                <span className={cn(
                  "text-xs",
                  trendDirection === 'up' ? "text-green-600" : 
                  trendDirection === 'down' ? "text-red-600" : "text-gray-500"
                )}>
                  {trend}
                </span>
              </div>
            )}
          </div>
          
          <AnimatePresence>
            {highlight && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-2 py-1 rounded-full bg-[#803344] text-white text-xs"
              >
                New
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </motion.div>
  );

  // Render property card
  const PropertyCard = ({ property }: { property: (typeof mockProperties)[0] }) => {
    const hasUnreadMessages = mockEngagements
      .filter(e => e.propertyId === property.id && e.type === "message" && e.status === "new")
      .length > 0;
      
    const hasNewOffers = mockEngagements
      .filter(e => e.propertyId === property.id && e.type === "offer" && e.status === "new")
      .length > 0;
      
    const needsAttention = hasUnreadMessages || hasNewOffers;
    
    return (
      <motion.div 
        variants={fadeIn}
        initial="initial"
        animate="animate"
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className={cn(
          "rounded-lg border shadow-sm overflow-hidden transition-all cursor-pointer",
          selectedPropertyId === property.id ? "border-[#135341] ring-1 ring-[#135341]" : "border-gray-200 hover:border-gray-300",
        )}
        onClick={() => handleSelectProperty(property.id)}
      >
        <div className="relative">
          <img 
            src={property.image} 
            alt={property.title} 
            className="w-full h-40 object-cover"
          />
          {needsAttention && (
            <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-[#803344] text-white text-xs flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3" />
              <span>Needs Attention</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="mb-3">
            <h3 className="font-bold text-gray-900 truncate">{property.address}</h3>
            <p className="text-gray-500 text-sm">{formatCurrency(property.price)}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-2 bg-gray-50 rounded text-center">
              <p className="text-sm font-medium text-gray-900">{property.viewCount}</p>
              <p className="text-xs text-gray-500">Views</p>
            </div>
            <div className="p-2 bg-gray-50 rounded text-center">
              <p className="text-sm font-medium text-gray-900">{property.saveCount}</p>
              <p className="text-xs text-gray-500">Saves</p>
            </div>
            <div className={cn(
              "p-2 rounded text-center",
              hasNewOffers ? "bg-green-50" : "bg-gray-50"
            )}>
              <p className={cn(
                "text-sm font-medium", 
                hasNewOffers ? "text-green-700" : "text-gray-900"
              )}>
                {property.offerCount}
              </p>
              <p className="text-xs text-gray-500">Offers</p>
            </div>
            <div className={cn(
              "p-2 rounded text-center",
              hasUnreadMessages ? "bg-blue-50" : "bg-gray-50"
            )}>
              <p className={cn(
                "text-sm font-medium", 
                hasUnreadMessages ? "text-blue-700" : "text-gray-900"
              )}>
                {property.messageCount}
              </p>
              <p className="text-xs text-gray-500">Messages</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                property.status === "Live" ? "border-green-200 text-green-700 bg-green-50" : 
                property.status === "Under Contract" ? "border-blue-200 text-blue-700 bg-blue-50" : 
                "border-gray-200 text-gray-700 bg-gray-50"
              )}
            >
              {property.status}
            </Badge>
            <span className="text-xs text-gray-500">
              {property.daysListed} {property.daysListed === 1 ? 'day' : 'days'} listed
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  // Render engagement timeline item
  const EngagementTimelineItem = ({ engagement }: { engagement: (typeof mockEngagements)[0] }) => {
    return (
      <div className="flex group">
        <div className="mr-3 flex flex-col items-center">
          <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-[#135341]" />
          <div className="w-0.5 h-full bg-gray-200 group-hover:bg-gray-300" />
        </div>
        <div className="pb-6 w-full">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback className="text-xs">
                  {engagement.buyerName.split(' ').map(name => name[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-gray-900">{engagement.buyerName}</span>
            </div>
            <span className="text-xs text-gray-500">{formatDistanceToNow(engagement.timestamp, { addSuffix: true })}</span>
          </div>
          
          <div className="flex items-center mt-1">
            {engagement.type === "view" && (
              <div className="flex items-center text-sm text-gray-600">
                <Eye className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                <span>Viewed this property</span>
                {engagement.viewCount && (
                  <span className="text-xs text-gray-500 ml-1.5">
                    ({engagement.viewCount} times)
                  </span>
                )}
              </div>
            )}
            {engagement.type === "save" && (
              <div className="flex items-center text-sm text-gray-600">
                <Bookmark className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                <span>Saved this property</span>
              </div>
            )}
            {engagement.type === "message" && (
              <div className="w-full">
                <div className="flex items-center text-sm text-gray-600">
                  <MessageCircle className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  <span>Sent a message</span>
                  {engagement.status === "new" && (
                    <Badge variant="outline" className="ml-2 text-[10px] h-4 px-1 bg-green-50 text-green-700 border-green-200">
                      New
                    </Badge>
                  )}
                </div>
                {engagement.message && (
                  <div className="mt-1.5 pl-5">
                    <p className="text-sm bg-gray-50 p-2 rounded-md border border-gray-100">
                      {engagement.message.length > 120 
                        ? engagement.message.substring(0, 120) + "..." 
                        : engagement.message
                      }
                    </p>
                    <div className="flex justify-end mt-1.5">
                      <Button 
                        variant="outline" 
                        className="h-7 text-xs gap-1 mr-2 hover:bg-gray-200"
                        onClick={() => handleUseAI(engagement.id)}
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>AI Respond</span>
                      </Button>
                      <Button 
                        className="h-7 text-xs gap-1 bg-[#135341] hover:bg-[#09261E]"
                      >
                        <CornerDownRight className="h-3 w-3" />
                        <span>Reply</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {engagement.type === "offer" && (
              <div className="w-full">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
                  <span>Made an offer</span>
                  {engagement.status === "new" && (
                    <Badge variant="outline" className="ml-2 text-[10px] h-4 px-1 bg-purple-50 text-purple-700 border-purple-200">
                      New
                    </Badge>
                  )}
                  {engagement.status === "accepted" && (
                    <Badge variant="outline" className="ml-2 text-[10px] h-4 px-1 bg-green-50 text-green-700 border-green-200">
                      Accepted
                    </Badge>
                  )}
                </div>
                <div className="mt-1.5 pl-5">
                  <div className="flex items-center text-sm font-medium">
                    <span>Offer Amount: {formatCurrency(engagement.offerAmount)}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    <Badge variant="outline" className="text-[10px]">
                      {engagement.offerTerms.closingTimeframe} close
                    </Badge>
                    {engagement.offerTerms.contingencies.map((contingency, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]">
                        {contingency}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="text-[10px]">
                      ${engagement.offerTerms.earnestMoney} earnest
                    </Badge>
                  </div>
                  {engagement.message && (
                    <p className="text-sm bg-gray-50 p-2 rounded-md border border-gray-100 mt-2">
                      {engagement.message.length > 100 
                        ? engagement.message.substring(0, 100) + "..." 
                        : engagement.message
                      }
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render engaged buyer item
  const EngagedBuyerItem = ({ buyer }: { buyer: any }) => {
    return (
      <div className="p-3 border rounded-md hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarFallback>
                {buyer.name.split(' ').map((name: string) => name[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <span className="font-medium">{buyer.name}</span>
                {buyer.verified && (
                  <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200" variant="outline">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-xs text-gray-500 mt-0.5">
                <span className="mr-2">{buyer.type}</span>
                <span>•</span>
                <span className="ml-2">Last activity: {formatDistanceToNow(buyer.latestEngagement.timestamp, { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-gray-200">
              <Mail className="h-3.5 w-3.5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-gray-200">
              <Phone className="h-3.5 w-3.5 text-gray-500" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5 mt-2">
          {buyer.tags?.map((tag: string, i: number) => (
            <Badge key={i} variant="secondary" className="px-2 py-0.5 text-[10px] bg-gray-100 text-gray-700">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <SellerDashboardLayout>
      <div className="py-6">
        <div className="flex flex-col space-y-6">
          {/* Page header with title */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Engagement</h1>
          </div>
          
          {/* Top summary section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              icon={Eye} 
              title="Total Views" 
              value={totalViews}
              secondaryValue={`Avg ${Math.round(avgViewsPerProperty)} per property`}
              trend="+15% from last week"
              trendDirection="up"
            />
            
            <MetricCard 
              icon={Bookmark} 
              title="Saves" 
              value={totalSaves}
              secondaryValue={`Avg ${Math.round(avgSavesPerProperty)} per property`}
              trend="+8% from last week"
              trendDirection="up"
            />
            
            <MetricCard 
              icon={DollarSign} 
              title="Offers" 
              value={totalOffers}
              secondaryValue={`Avg ${avgOffersPerProperty.toFixed(1)} per deal`}
              trend="New offer today"
              trendDirection="up"
              highlight={mockEngagements.some(e => e.type === "offer" && e.status === "new")}
            />
            
            <MetricCard 
              icon={MessageCircle} 
              title="Messages" 
              value={totalMessages}
              secondaryValue={unreadMessages > 0 ? `${unreadMessages} unread` : "All read"}
              trend="+3 today"
              trendDirection="up"
              highlight={unreadMessages > 0}
            />
          </div>
          
          {/* Response rate banner */}
          <div className="p-4 border rounded-lg bg-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-50">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Response Rate</h3>
                    <HoverCard>
                      <HoverCardTrigger>
                        <Info className="h-4 w-4 text-gray-400" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium">Response Rate Metrics</h4>
                          <p className="text-sm text-gray-500">
                            Your response rate affects your property ranking and buyer experience. 
                            Aim for at least 90% response rate and an average response time of less than 4 hours.
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <div className="flex items-center gap-6 mt-1">
                    <div>
                      <span className="text-2xl font-bold">{responseRate}%</span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({responseRate >= 75 ? "Good" : "Needs Improvement"})
                      </span>
                    </div>
                    <div className="border-l pl-6">
                      <span className="text-sm font-medium">Avg Response Time:</span>
                      <span className="ml-2 text-sm">{avgResponseTime} hours</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="text-sm text-gray-500 mb-1">Goal: 90%+ response rate</div>
                <div className="w-full max-w-xs h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      responseRate >= 90 ? "bg-green-500" : 
                      responseRate >= 75 ? "bg-amber-500" : "bg-red-500"
                    )}
                    style={{ width: `${responseRate}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-800">Improve your conversion rate</AlertTitle>
                <AlertDescription className="text-amber-700">
                  Respond to inquiries within 4 hours to significantly improve your save-to-offer ratio.
                </AlertDescription>
              </Alert>
            </div>
          </div>
          
          {/* Filters and actions bar */}
          <div className="sticky top-0 z-10 bg-white rounded-lg border shadow-sm p-4">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center">
                {/* Property filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-9 border-dashed">
                      <Building2 className="mr-2 h-4 w-4" />
                      Property
                      {selectedProperties.length > 0 && 
                        <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200" variant="outline">
                          {selectedProperties.length}
                        </Badge>
                      }
                      <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[220px] p-0">
                    <Command>
                      <CommandInput placeholder="Search properties..." />
                      <CommandList>
                        <CommandEmpty>No properties found</CommandEmpty>
                        <CommandGroup>
                          {mockProperties.map((property) => (
                            <CommandItem
                              key={property.id}
                              onSelect={() => handleToggleProperty(property.id)}
                              className="flex items-center"
                            >
                              <Checkbox 
                                checked={selectedProperties.includes(property.id)} 
                                className="mr-2"
                                onCheckedChange={() => handleToggleProperty(property.id)}
                              />
                              <span>{property.address.split(',')[0]}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Engagement type filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-9 border-dashed">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Engagement Type
                      {selectedEngagementTypes.length > 0 && 
                        <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200" variant="outline">
                          {selectedEngagementTypes.length}
                        </Badge>
                      }
                      <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[220px] p-0">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          <CommandItem onSelect={() => handleToggleEngagementType("view")}>
                            <Checkbox 
                              checked={selectedEngagementTypes.includes("view")} 
                              className="mr-2"
                              onCheckedChange={() => handleToggleEngagementType("view")}
                            />
                            <Eye className="mr-2 h-4 w-4 text-blue-500" />
                            <span>Views</span>
                          </CommandItem>
                          <CommandItem onSelect={() => handleToggleEngagementType("save")}>
                            <Checkbox 
                              checked={selectedEngagementTypes.includes("save")} 
                              className="mr-2"
                              onCheckedChange={() => handleToggleEngagementType("save")}
                            />
                            <Bookmark className="mr-2 h-4 w-4 text-amber-500" />
                            <span>Saves</span>
                          </CommandItem>
                          <CommandItem onSelect={() => handleToggleEngagementType("message")}>
                            <Checkbox 
                              checked={selectedEngagementTypes.includes("message")} 
                              className="mr-2"
                              onCheckedChange={() => handleToggleEngagementType("message")}
                            />
                            <MessageCircle className="mr-2 h-4 w-4 text-green-500" />
                            <span>Messages</span>
                          </CommandItem>
                          <CommandItem onSelect={() => handleToggleEngagementType("offer")}>
                            <Checkbox 
                              checked={selectedEngagementTypes.includes("offer")} 
                              className="mr-2"
                              onCheckedChange={() => handleToggleEngagementType("offer")}
                            />
                            <DollarSign className="mr-2 h-4 w-4 text-purple-500" />
                            <span>Offers</span>
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Status filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-9 border-dashed">
                      <Filter className="mr-2 h-4 w-4" />
                      Status
                      {selectedStatus.length > 0 && 
                        <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200" variant="outline">
                          {selectedStatus.length}
                        </Badge>
                      }
                      <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[220px] p-0">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          <CommandItem onSelect={() => handleToggleStatus("new")}>
                            <Checkbox 
                              checked={selectedStatus.includes("new")} 
                              className="mr-2"
                              onCheckedChange={() => handleToggleStatus("new")}
                            />
                            <span>New</span>
                          </CommandItem>
                          <CommandItem onSelect={() => handleToggleStatus("viewed")}>
                            <Checkbox 
                              checked={selectedStatus.includes("viewed")} 
                              className="mr-2"
                              onCheckedChange={() => handleToggleStatus("viewed")}
                            />
                            <span>Viewed</span>
                          </CommandItem>
                          <CommandItem onSelect={() => handleToggleStatus("replied")}>
                            <Checkbox 
                              checked={selectedStatus.includes("replied")} 
                              className="mr-2"
                              onCheckedChange={() => handleToggleStatus("replied")}
                            />
                            <span>Replied</span>
                          </CommandItem>
                          <CommandItem onSelect={() => handleToggleStatus("accepted")}>
                            <Checkbox 
                              checked={selectedStatus.includes("accepted")} 
                              className="mr-2"
                              onCheckedChange={() => handleToggleStatus("accepted")}
                            />
                            <span>Accepted</span>
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Search input */}
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search by buyer or property..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 w-full md:w-[240px]"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-7 w-7 rounded-full"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Clear filters button */}
                {(selectedProperties.length > 0 || selectedEngagementTypes.length > 0 || selectedStatus.length > 0 || searchQuery) && (
                  <Button 
                    variant="ghost" 
                    className="h-9 text-sm hover:bg-gray-100"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
              
              <div className="flex gap-3 mt-3 md:mt-0">
                {/* Schedule button */}
                <Button className="h-9 bg-[#09261E] hover:bg-[#09261E]/90">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Follow-Up
                </Button>
                
                {/* Sort dropdown */}
                <Select value={sorting} onValueChange={setSorting}>
                  <SelectTrigger className="h-9 w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="most-recent">Most Recent</SelectItem>
                    <SelectItem value="highest-offers">Highest Offers</SelectItem>
                    <SelectItem value="most-views">Most Views</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Main content - split view */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Property list */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {propertiesWithEngagements.length === 0 ? (
                  <div className="text-center p-6 border rounded-lg bg-gray-50">
                    <p className="text-gray-500">No properties match your filters</p>
                  </div>
                ) : (
                  propertiesWithEngagements.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))
                )}
              </div>
            </div>
            
            {/* Right: Property engagement panel */}
            <div className="lg:col-span-2">
              {selectedPropertyId ? (
                <div>
                  {(() => {
                    const property = getPropertyById(selectedPropertyId);
                    if (!property) return null;
                    
                    const timeline = getPropertyActivityTimeline(selectedPropertyId);
                    const engagedBuyers = getEngagedBuyers(selectedPropertyId);
                    const saveToOfferRate = calcSaveToOfferConversion(selectedPropertyId);
                    
                    return (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border rounded-lg bg-white shadow-sm overflow-hidden"
                      >
                        {/* Header section */}
                        <div className="p-4 border-b bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex">
                              <div className="w-20 h-20 rounded-md overflow-hidden mr-4">
                                <img 
                                  src={property.image} 
                                  alt={property.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h2 className="font-bold text-gray-900">
                                  {property.address}
                                </h2>
                                <p className="text-gray-500 mt-0.5">
                                  {formatCurrency(property.price)} · {property.beds} bd · {property.baths} ba · {property.sqft} sqft
                                </p>
                                <div className="flex items-center mt-1.5">
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      "text-xs",
                                      property.status === "Live" ? "border-green-200 text-green-700 bg-green-50" : 
                                      property.status === "Under Contract" ? "border-blue-200 text-blue-700 bg-blue-50" : 
                                      "border-gray-200 text-gray-700 bg-gray-50"
                                    )}
                                  >
                                    {property.status}
                                  </Badge>
                                  <span className="mx-2 text-gray-300">•</span>
                                  <span className="text-xs text-gray-500">
                                    {property.daysListed} {property.daysListed === 1 ? 'day' : 'days'} listed
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="hover:bg-gray-100 hover:text-gray-900">
                                <Edit className="h-3.5 w-3.5 mr-1.5" />
                                <span>Edit</span>
                              </Button>
                              <Button variant="outline" size="sm" className="hover:bg-gray-100 hover:text-gray-900">
                                <Share className="h-3.5 w-3.5 mr-1.5" />
                                <span>Share</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Stat cards */}
                        <div className="p-4 border-b">
                          <div className="text-sm font-medium text-gray-500 mb-3">Last 30 Days</div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-3 border rounded-md bg-gray-50">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Eye className="h-4 w-4 text-blue-500 mr-2" />
                                  <span className="text-sm font-medium">Views</span>
                                </div>
                                <div className="flex items-center">
                                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                                  <span className="text-xs text-green-600">+12%</span>
                                </div>
                              </div>
                              <p className="text-2xl font-bold mt-1">{property.viewCount}</p>
                            </div>
                            
                            <div className="p-3 border rounded-md bg-gray-50">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Bookmark className="h-4 w-4 text-amber-500 mr-2" />
                                  <span className="text-sm font-medium">Saves</span>
                                </div>
                                <div className="flex items-center">
                                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                                  <span className="text-xs text-green-600">+8%</span>
                                </div>
                              </div>
                              <p className="text-2xl font-bold mt-1">{property.saveCount}</p>
                            </div>
                            
                            <div className="p-3 border rounded-md bg-gray-50">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <MessageCircle className="h-4 w-4 text-green-500 mr-2" />
                                  <span className="text-sm font-medium">Messages</span>
                                </div>
                                <div className="flex items-center">
                                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                                  <span className="text-xs text-green-600">+15%</span>
                                </div>
                              </div>
                              <p className="text-2xl font-bold mt-1">{property.messageCount}</p>
                            </div>
                            
                            <div className="p-3 border rounded-md bg-gray-50">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <DollarSign className="h-4 w-4 text-purple-500 mr-2" />
                                  <span className="text-sm font-medium">Offers</span>
                                </div>
                                {property.offerCount > 0 ? (
                                  <div className="flex items-center">
                                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                                    <span className="text-xs text-green-600">New</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <span className="text-xs text-gray-500">None yet</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-2xl font-bold mt-1">{property.offerCount}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Content sections */}
                        <div className="divide-y">
                          {/* Activity timeline */}
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 mb-4">Activity Timeline</h3>
                            <div className="space-y-1">
                              {timeline.slice(0, 5).map((engagement) => (
                                <EngagementTimelineItem 
                                  key={engagement.id} 
                                  engagement={engagement} 
                                />
                              ))}
                            </div>
                            
                            {timeline.length > 5 && (
                              <Button 
                                variant="outline" 
                                className="w-full mt-2 text-sm"
                              >
                                Load More Activity
                              </Button>
                            )}
                          </div>
                          
                          {/* Engaged buyers */}
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 mb-4">Engaged Buyers</h3>
                            <div className="space-y-3">
                              {engagedBuyers.length === 0 ? (
                                <div className="text-center p-4 border rounded-lg bg-gray-50">
                                  <p className="text-gray-500">No buyer engagement yet</p>
                                </div>
                              ) : (
                                engagedBuyers.map((buyer: any) => (
                                  <EngagedBuyerItem key={buyer.id} buyer={buyer} />
                                ))
                              )}
                            </div>
                          </div>
                          
                          {/* Save-to-offer conversion */}
                          {property.saveCount > 0 && (
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-gray-900">Save-to-Offer Conversion</h3>
                                <HoverCard>
                                  <HoverCardTrigger>
                                    <Info className="h-4 w-4 text-gray-400" />
                                  </HoverCardTrigger>
                                  <HoverCardContent className="w-80">
                                    <div className="space-y-2">
                                      <h4 className="font-medium">Conversion Rate</h4>
                                      <p className="text-sm text-gray-500">
                                        This shows what percentage of buyers who saved this property
                                        ended up making an offer. A higher rate indicates strong buyer intent.
                                      </p>
                                    </div>
                                  </HoverCardContent>
                                </HoverCard>
                              </div>
                              
                              <div className="mb-2">
                                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className={cn(
                                      "h-full rounded-full bg-blue-500"
                                    )}
                                    style={{ width: `${Math.min(100, saveToOfferRate)}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>0%</span>
                                  <span>{Math.round(saveToOfferRate)}%</span>
                                  <span>100%</span>
                                </div>
                              </div>
                              
                              <div className="text-sm mt-3">
                                <span className="font-medium">{property.saveCount} saves</span>
                                <span className="mx-2">→</span>
                                <span className="font-medium">{property.offerCount} offers</span>
                              </div>
                              
                              {(property.saveCount > property.offerCount) && (
                                <div className="mt-2 text-sm text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200">
                                  <span className="font-medium">{property.saveCount - property.offerCount} buyers</span> saved this property but didn't offer — consider following up!
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Property timeline */}
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 mb-4">Property Timeline</h3>
                            <div className="relative pt-2 pb-4">
                              <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 rounded-full" />
                              
                              {/* Listing marker */}
                              <div className="relative">
                                <div className="absolute -left-2 flex flex-col items-center">
                                  <div className="w-5 h-5 rounded-full bg-green-500 z-10" />
                                  <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                                    Listed<br />{formatDate(new Date(Date.now() - property.daysListed * 24 * 60 * 60 * 1000))}
                                  </div>
                                </div>
                                
                                {/* View milestones */}
                                {property.viewCount >= 100 && (
                                  <div className="absolute left-1/3 flex flex-col items-center">
                                    <div className="w-4 h-4 rounded-full bg-blue-400 z-10" />
                                    <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                                      100+ Views
                                    </div>
                                  </div>
                                )}
                                
                                {/* Offer milestone */}
                                {property.offerCount > 0 && (
                                  <div className="absolute left-2/3 flex flex-col items-center">
                                    <div className="w-4 h-4 rounded-full bg-purple-500 z-10" />
                                    <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                                      First Offer
                                    </div>
                                  </div>
                                )}
                                
                                {/* Target close date */}
                                <div className="absolute right-0 flex flex-col items-center">
                                  <div className="w-4 h-4 rounded-full bg-gray-400 z-10" />
                                  <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                                    Target Close<br />{formatDate(new Date(Date.now() + 45 * 24 * 60 * 60 * 1000))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full border rounded-lg bg-gray-50 p-8">
                  <div className="text-center max-w-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a property</h3>
                    <p className="text-gray-500">
                      Choose a property from the list to view detailed engagement metrics and activities.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SellerDashboardLayout>
  );
}