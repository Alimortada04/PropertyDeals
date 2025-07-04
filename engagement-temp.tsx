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
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    status: "new",
    message: "Just following up on my offer. I'm very interested in this property and am willing to discuss terms. Would you be open to a slightly shorter closing timeline of 25 days instead of 30?",
    aiScore: 0.88,
    aiSentiment: "Very interested, flexible",
    activityHistory: [
      { action: "Made offer", timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
      { action: "Sent message", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
    ],
    isUnread: true,
    tags: ["Follow-up", "Active negotiation"],
  },
  {
    id: "e7",
    propertyId: "p3",
    type: "request",
    buyerId: "b4",
    buyerName: "Jessica Brown",
    buyerImage: "",
    buyerType: "Agent",
    buyerReputation: "REP Verified",
    verified: true,
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    status: "new",
    requestType: "Showing Request",
    message: "My client is very interested in this property. Would it be possible to schedule a showing for tomorrow afternoon around 3pm?",
    aiScore: 0.90,
    aiSentiment: "Hot lead with client",
    activityHistory: [
      { action: "Viewed property", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { action: "Viewed property", timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) },
      { action: "Requested showing", timestamp: new Date(Date.now() - 30 * 60 * 1000) },
    ],
    isUnread: true,
    tags: ["Showing request", "Agent with client"],
  },
];

// Enhanced CRM leads
const mockLeads = [
  {
    id: "l1",
    name: "Thomas Wilson",
    email: "thomas.wilson@example.com",
    phone: "555-123-4567",
    image: "",
    type: "Investor",
    propertiesOfInterest: ["p1", "p3"],
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "nurturing",
    assignedRep: "rep1",
    tags: ["cash buyer", "investor", "multifamily"],
    engagementLevel: "High",
    communicationPreference: "Email",
    budget: "$400k-600k",
    leadSource: "Website Form",
    notes: "Looking for multifamily properties with value-add opportunities. Has financing already secured.",
    activityHistory: [
      { action: "Added to CRM", timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { action: "Sent intro email", timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) },
      { action: "Viewed property p1", timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { action: "Viewed property p3", timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { action: "Replied to follow-up", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    ],
    nextFollowUp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "l2",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "555-987-6543",
    image: "",
    type: "First-time Buyer",
    propertiesOfInterest: ["p2"],
    lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: "contacted",
    assignedRep: "",
    tags: ["first-time buyer", "financing needed"],
    engagementLevel: "Medium",
    communicationPreference: "Phone",
    budget: "$350k-425k",
    leadSource: "Referral",
    notes: "Looking for move-in ready properties. Needs to connect with a lender for pre-approval.",
    activityHistory: [
      { action: "Added to CRM", timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
      { action: "Initial phone call", timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) },
      { action: "Sent lender recommendations", timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { action: "Viewed property p2", timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    ],
    nextFollowUp: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "l3",
    name: "Robert Taylor",
    email: "robert.taylor@example.com",
    phone: "555-456-7890",
    image: "",
    type: "Broker",
    propertiesOfInterest: ["p1", "p2", "p3"],
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: "new lead",
    assignedRep: "rep2",
    tags: ["broker", "multiple inquiries", "buyer's agent"],
    engagementLevel: "Very High",
    communicationPreference: "Email and Phone",
    budget: "Varies by client",
    leadSource: "Industry Contact",
    notes: "Broker representing several investors. Has clients looking for both residential and multifamily properties.",
    activityHistory: [
      { action: "Added to CRM", timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { action: "Initial phone call", timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
      { action: "Sent portfolio information", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { action: "Client viewed property p1", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { action: "Client viewed property p3", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    ],
    nextFollowUp: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "l4",
    name: "Jennifer Martinez",
    email: "jennifer.martinez@example.com",
    phone: "555-789-0123",
    image: "",
    type: "Investor",
    propertiesOfInterest: ["p3"],
    lastActivity: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: "followed up",
    assignedRep: "",
    tags: ["slow responder", "investor", "fix and flip"],
    engagementLevel: "Low",
    communicationPreference: "Email only",
    budget: "$350k-500k",
    leadSource: "Social Media",
    notes: "Interested in fix and flip properties. Long decision-making process and inconsistent communication.",
    activityHistory: [
      { action: "Added to CRM", timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) },
      { action: "Sent welcome email", timestamp: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000) },
      { action: "Viewed property p3", timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
      { action: "Follow-up email", timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
      { action: "Second follow-up", timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    ],
    nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "l5",
    name: "Michael Anderson",
    email: "michael.anderson@example.com",
    phone: "555-234-5678",
    image: "",
    type: "Investor",
    propertiesOfInterest: ["p2"],
    lastActivity: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    status: "dead",
    assignedRep: "rep1",
    tags: ["out-of-state", "investor"],
    engagementLevel: "None",
    communicationPreference: "Email",
    budget: "$500k-750k",
    leadSource: "Property Listing",
    notes: "Initially interested but stopped responding. May have found a property elsewhere.",
    activityHistory: [
      { action: "Added to CRM", timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      { action: "Initial inquiry", timestamp: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000) },
      { action: "Viewed property p2", timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) },
      { action: "Follow-up email", timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { action: "Final attempt", timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
    ],
    nextFollowUp: null,
  },
  {
    id: "l6",
    name: "Amanda Wilson",
    email: "amanda.wilson@example.com",
    phone: "555-345-6789",
    image: "",
    type: "Agent",
    propertiesOfInterest: ["p1", "p4"],
    lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: "nurturing",
    assignedRep: "rep2",
    tags: ["agent", "represents buyers", "luxury"],
    engagementLevel: "Very High",
    communicationPreference: "Text and Email",
    budget: "Varies by client",
    leadSource: "Networking Event",
    notes: "Top producing agent with high-end clients. Quick response time and professional communication.",
    activityHistory: [
      { action: "Added to CRM", timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
      { action: "Initial meeting", timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000) },
      { action: "Client viewed property p4", timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { action: "Client viewed property p1", timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { action: "Follow-up call", timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) },
    ],
    nextFollowUp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
];

// Enhanced Email Templates
const mockTemplates = [
  {
    id: "t1",
    name: "New Listing Announcement",
    category: "New Listing",
    subject: "New Off-Market Property Just Listed!",
    body: "Hi {Buyer Name},\n\nI wanted to let you know about a new property we just listed in {City}. It's a great investment opportunity with an ARV of {ARV} and an assignment price of only {Assignment Price}.\n\nProperty Details:\n- {Beds} beds / {Baths} baths\n- {Sqft} square feet\n- Built in {Year Built}\n- Estimated repairs: {Repair Estimate}\n\nCheck it out here: {Link}\n\nLet me know if you're interested in discussing further or scheduling a showing.\n\nBest regards,\n{Seller Name}",
    usage: 28,
    openRate: 0.65,
    responseRate: 0.22,
    lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    tags: ["new listing", "initial contact"],
  },
  {
    id: "t2",
    name: "Price Drop Alert",
    category: "Price Drop",
    subject: "Price Reduced on {Property Name}",
    body: "Hi {Buyer Name},\n\nGreat news! We've just reduced the price on {Property Name} in {City}. This property now has an even better ROI with the new assignment fee of {Assignment Price}.\n\nKey Numbers:\n- New Price: {Assignment Price}\n- ARV: {ARV}\n- Potential Profit: {Profit Potential}\n\nView the updated details: {Link}\n\nDon't miss this opportunity - price reductions tend to generate a lot of interest!\n\nBest regards,\n{Seller Name}",
    usage: 15,
    openRate: 0.72,
    responseRate: 0.31,
    lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    tags: ["price change", "urgency"],
  },
  {
    id: "t3",
    name: "Under Contract Notice",
    category: "Under Contract",
    subject: "Property Going Under Contract Soon - Last Chance",
    body: "Hi {Buyer Name},\n\nJust a heads up that {Property Name} in {City} is about to go under contract. If you're still interested, now is the time to act.\n\nWe currently have an offer of {Highest Offer} but wanted to give you one final opportunity before we move forward.\n\nView the property: {Link}\n\nWe're expecting to finalize the deal within 48 hours, so please let me know your decision as soon as possible.\n\nBest regards,\n{Seller Name}",
    usage: 12,
    openRate: 0.81,
    responseRate: 0.28,
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    tags: ["urgency", "last chance"],
  },
  {
    id: "t4",
    name: "Final Call Reminder",
    category: "Final Call",
    subject: "FINAL CALL: Decision needed on {Property Name}",
    body: "Hi {Buyer Name},\n\nThis is the final call for {Property Name} in {City}. We have multiple offers and will be making a decision by the end of day.\n\nIf you'd like to secure this property, please let me know immediately.\n\nProperty details: {Link}\n\nThank you for your interest.\n\nBest regards,\n{Seller Name}",
    usage: 9,
    openRate: 0.85,
    responseRate: 0.20,
    lastUsed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    tags: ["urgency", "final notice"],
  },
  {
    id: "t5",
    name: "Follow-Up After Viewing",
    category: "Follow Up",
    subject: "Follow-up on your recent viewing of {Property Name}",
    body: "Hi {Buyer Name},\n\nI wanted to follow up on your recent viewing of {Property Name} in {City}. I hope you found the property interesting and that it meets your investment criteria.\n\nDo you have any questions I can answer about the property, neighborhood, or potential returns?\n\nI'd be happy to provide more information or schedule another showing if needed.\n\nBest regards,\n{Seller Name}",
    usage: 34,
    openRate: 0.58,
    responseRate: 0.42,
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    tags: ["follow-up", "post-viewing"],
  },
  {
    id: "t6",
    name: "Financing Options",
    category: "Information",
    subject: "Financing Options for {Property Name}",
    body: "Hi {Buyer Name},\n\nI wanted to share some financing options that might work well for {Property Name} in {City}.\n\nBased on the property's condition and potential, here are some options to consider:\n\n1. Conventional financing with 20% down\n2. Hard money loan for the purchase and renovations\n3. BRRRR strategy with refinance after renovations\n\nI've also attached a list of lenders who have worked with our investors in the past.\n\nLet me know if you'd like an introduction to any of these financing partners.\n\nBest regards,\n{Seller Name}",
    usage: 18,
    openRate: 0.63,
    responseRate: 0.35,
    lastUsed: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    tags: ["information", "financing"],
  },
  {
    id: "t7",
    name: "RE: Your Offer on {Property Name}",
    category: "Negotiation",
    subject: "RE: Your Offer on {Property Name}",
    body: "Hi {Buyer Name},\n\nThank you for your offer of {Offer Amount} on {Property Name}.\n\nAfter careful consideration, we'd like to counter with {Counter Offer}. This reflects the property's true market value and potential, while still providing you with an excellent opportunity for returns.\n\nThe key points:\n- Purchase price: {Counter Offer}\n- All other terms remain as proposed\n- We can still accommodate your requested closing timeline\n\nPlease let me know your thoughts on this counter offer at your earliest convenience.\n\nBest regards,\n{Seller Name}",
    usage: 22,
    openRate: 0.94,
    responseRate: 0.65,
    lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    tags: ["negotiation", "counter offer"],
  },
];

// ===================================
// UTILITY FUNCTIONS AND HELPERS
// ===================================

// Utility function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

// Format number with commas
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

// Utility function to get property by ID
const getPropertyById = (id: string) => {
  return mockProperties.find(property => property.id === id);
};

// Utility function to get buyer by ID
const getBuyerById = (id: string) => {
  return mockBuyers.find(buyer => buyer.id === id);
};

// Calculate time since a date in human-readable format
const timeAgo = (date: Date) => {
  return formatDistanceToNow(date, { addSuffix: true });
};

// Calculate time until a date in human-readable format
const timeUntil = (date: Date) => {
  return formatDistanceToNow(date, { addSuffix: true });
};

// Helper function to calculate property completion percentage
const calculatePropertyCompletionPercent = (property: any) => {
  const { status } = property;
  switch (status) {
    case "New Lead": return 5;
    case "Initial Contact": return 10;
    case "Negotiating": return 40;
    case "Under Contract": return 70;
    case "Closed": return 100;
    default: return 25;
  }
};

// Function to get a buyer's activity level color
const getBuyerActivityColor = (level: string) => {
  switch (level) {
    case "Very Active": return "bg-green-500";
    case "Active": return "bg-emerald-400";
    case "Moderate": return "bg-amber-400";
    case "Low": return "bg-orange-400";
    case "Inactive": return "bg-gray-400";
    default: return "bg-gray-300";
  }
};

// Function to get AI confidence level color
const getAIConfidenceColor = (score: number) => {
  if (score >= 0.85) return "text-green-600";
  if (score >= 0.7) return "text-emerald-600";
  if (score >= 0.5) return "text-amber-600";
  return "text-gray-600";
};

// Function to get sentiment indicator based on AI sentiment
const getSentimentIndicator = (sentiment: string) => {
  if (sentiment.includes("increase offer") || 
      sentiment.includes("motivated") || 
      sentiment.includes("hot lead") ||
      sentiment.includes("very interested")) {
    return { color: "bg-green-500", icon: Zap, text: "Likely to Convert" };
  }
  
  if (sentiment.includes("genuine interest") || 
      sentiment.includes("flexible") || 
      sentiment.includes("research phase")) {
    return { color: "bg-amber-400", icon: User, text: "Active Interest" };
  }
  
  if (sentiment.includes("casual interest") || 
      sentiment.includes("representing client")) {
    return { color: "bg-blue-400", icon: Eye, text: "Evaluating" };
  }
  
  return { color: "bg-gray-400", icon: Clock, text: "Monitoring" };
};

// Badge variants for different engagement types
const getEngagementBadge = (type: string) => {
  switch (type) {
    case "offer":
      return { icon: DollarSign, color: "bg-green-100 text-green-800 border border-green-200", label: "Offer" };
    case "message":
      return { icon: MessageCircle, color: "bg-blue-100 text-blue-800 border border-blue-200", label: "Message" };
    case "save":
      return { icon: Bookmark, color: "bg-purple-100 text-purple-800 border border-purple-200", label: "Saved" };
    case "view":
      return { icon: Eye, color: "bg-gray-100 text-gray-800 border border-gray-200", label: "Viewed" };
    case "request":
      return { icon: FileCheck, color: "bg-amber-100 text-amber-800 border border-amber-200", label: "Request" };
    default:
      return { icon: Clock, color: "bg-gray-100 text-gray-800 border border-gray-200", label: type };
  }
};

// Badge variants for different statuses
const getStatusBadge = (status: string) => {
  switch (status) {
    case "new":
      return { text: "New", color: "bg-green-600 text-white border border-green-700" };
    case "replied":
      return { text: "Replied", color: "bg-blue-600 text-white border border-blue-700" };
    case "viewed":
      return { text: "Viewed", color: "bg-gray-600 text-white border border-gray-700" };
    case "accepted":
      return { text: "Accepted", color: "bg-teal-600 text-white border border-teal-700" };
    case "declined":
      return { text: "Declined", color: "bg-red-600 text-white border border-red-700" };
    default:
      return { text: status, color: "bg-gray-600 text-white border border-gray-700" };
  }
};

// Badge variants for lead statuses
const getLeadStatusBadge = (status: string) => {
  switch (status) {
    case "new lead":
      return { text: "New Lead", color: "bg-green-600 text-white border border-green-700" };
    case "contacted":
      return { text: "Contacted", color: "bg-blue-600 text-white border border-blue-700" };
    case "nurturing":
      return { text: "Nurturing", color: "bg-purple-600 text-white border border-purple-700" };
    case "followed up":
      return { text: "Followed Up", color: "bg-yellow-600 text-white border border-yellow-700" };
    case "dead":
      return { text: "Dead", color: "bg-gray-600 text-white border border-gray-700" };
    default:
      return { text: status, color: "bg-gray-600 text-white border border-gray-700" };
  }
};

// Badge variants for template categories
const getTemplateCategoryBadge = (category: string) => {
  switch (category) {
    case "New Listing":
      return { text: category, color: "bg-green-100 text-green-800 border border-green-200" };
    case "Price Drop":
      return { text: category, color: "bg-blue-100 text-blue-800 border border-blue-200" };
    case "Under Contract":
      return { text: category, color: "bg-yellow-100 text-yellow-800 border border-yellow-200" };
    case "Final Call":
      return { text: category, color: "bg-red-100 text-red-800 border border-red-200" };
    case "Follow Up":
      return { text: category, color: "bg-purple-100 text-purple-800 border border-purple-200" };
    case "Information":
      return { text: category, color: "bg-sky-100 text-sky-800 border border-sky-200" };
    case "Negotiation":
      return { text: category, color: "bg-amber-100 text-amber-800 border border-amber-200" };
    default:
      return { text: category, color: "bg-gray-100 text-gray-800 border border-gray-200" };
  }
};

// Badge variants for buyer reputation
const getBuyerReputationBadge = (reputation: string) => {
  switch (reputation) {
    case "REP Verified":
      return { text: "REP Verified", color: "bg-[#803344] text-white border border-[#63263B]" };
    case "Premium":
      return { text: "Premium", color: "bg-violet-600 text-white border border-violet-700" };
    case "Standard":
      return { text: "Standard", color: "bg-blue-500 text-white border border-blue-600" };
    case "New User":
      return { text: "New User", color: "bg-gray-500 text-white border border-gray-600" };
    default:
      return { text: reputation, color: "bg-gray-500 text-white border border-gray-600" };
  }
};

// Badge variants for buyer types
const getBuyerTypeBadge = (type: string) => {
  switch (type) {
    case "Investor":
      return { text: type, color: "bg-emerald-100 text-emerald-800 border border-emerald-200", icon: Coins };
    case "Agent":
      return { text: type, color: "bg-blue-100 text-blue-800 border border-blue-200", icon: Users };
    case "Home Buyer":
      return { text: type, color: "bg-amber-100 text-amber-800 border border-amber-200", icon: User };
    case "Broker":
      return { text: type, color: "bg-violet-100 text-violet-800 border border-violet-200", icon: Users };
    case "First-time Buyer":
      return { text: type, color: "bg-pink-100 text-pink-800 border border-pink-200", icon: User };
    default:
      return { text: type, color: "bg-gray-100 text-gray-800 border border-gray-200", icon: User };
  }
};

// We've replaced getActivityIcon with inline code in the components

// ======================================
// REUSABLE COMPONENTS
// ======================================

// Badge component for buyer type/reputation
interface BuyerBadgeProps {
  type: string;
  reputation: string;
  verified: boolean;
}

const BuyerBadge: React.FC<BuyerBadgeProps> = ({ type, reputation, verified }) => {
  const { text, color, icon } = getBuyerTypeBadge(type);
  const { text: repText, color: repColor } = getBuyerReputationBadge(reputation);
  
  // Create a component dynamically
  let IconComponent;
  if (icon === User) {
    IconComponent = <User className="h-3 w-3" />;
  } else if (icon === Users) {
    IconComponent = <Users className="h-3 w-3" />;
  } else if (icon === Coins) {
    IconComponent = <Coins className="h-3 w-3" />;
  } else {
    IconComponent = <User className="h-3 w-3" />;
  }
  
  return (
    <div className="flex items-center gap-1.5">
      <Badge variant="outline" className={color + " text-xs flex items-center gap-1 whitespace-nowrap"}>
        {IconComponent}
        <span>{text}</span>
      </Badge>
      
      {verified && (
        <Badge variant="outline" className={repColor + " text-xs whitespace-nowrap"}>
          {repText}
        </Badge>
      )}
    </div>
  );
};

// Activity Timeline component
interface ActivityTimelineProps {
  activities: Array<{ action: string; timestamp: Date }>;
  limit?: number;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities, limit = 3 }) => {
  const sortedActivities = [...activities].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  const displayActivities = limit ? sortedActivities.slice(0, limit) : sortedActivities;
  
  return (
    <div className="space-y-1 text-xs">
      {displayActivities.map((activity, index) => (
        <div key={index} className="flex items-center gap-1.5 text-gray-600">
          <div className="rounded-full p-0.5 bg-gray-100 text-gray-600 flex items-center justify-center">
            {/* Use the component icon safely */}
            {(() => {
              if (activity.action.includes("View")) return <Eye className="h-3.5 w-3.5" />;
              if (activity.action.includes("Save")) return <Bookmark className="h-3.5 w-3.5" />;
              if (activity.action.includes("Download")) return <FileText className="h-3.5 w-3.5" />;
              if (activity.action.includes("message") || activity.action.includes("Message")) return <MessageCircle className="h-3.5 w-3.5" />;
              if (activity.action.includes("offer") || activity.action.includes("Offer")) return <DollarSign className="h-3.5 w-3.5" />;
              if (activity.action.includes("CRM") || activity.action.includes("Added")) return <Plus className="h-3.5 w-3.5" />;
              if (activity.action.includes("call") || activity.action.includes("Call")) return <Phone className="h-3.5 w-3.5" />;
              if (activity.action.includes("email") || activity.action.includes("Email")) return <Mail className="h-3.5 w-3.5" />;
              if (activity.action.includes("Follow")) return <CornerDownRight className="h-3.5 w-3.5" />;
              return <Clock className="h-3.5 w-3.5" />;
            })()}
          </div>
          <span className="flex-1 truncate">{activity.action}</span>
          <span className="text-gray-400">{timeAgo(activity.timestamp)}</span>
        </div>
      ))}
      
      {activities.length > limit && (
        <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-gray-500 w-full justify-start">
          Show {activities.length - limit} more activities...
        </Button>
      )}
    </div>
  );
};

// Buyer Activity Stats component
interface BuyerActivityStatsProps {
  buyer: any;
}

const BuyerActivityStats: React.FC<BuyerActivityStatsProps> = ({ buyer }) => {
  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{buyer.name}</h3>
        <Badge variant="outline" className={getBuyerActivityColor(buyer.activityLevel) + " text-white text-xs px-2"}>
          {buyer.activityLevel}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Engagement Score</span>
          <span className="font-medium">{buyer.engagementScore}/100</span>
        </div>
        
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="h-1.5 rounded-full bg-green-500" 
                style={{ width: `${buyer.engagementScore}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Activity Trend</span>
          <Sparkline
            data={buyer.engagementHistory}
            height={20}
            width={60}
            color="#22c55e"
            strokeWidth={2}
            fillOpacity={0.1}
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Previous Deals</span>
          <span className="font-medium">{buyer.previousDeals}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Budget</span>
          <span className="font-medium">{formatCurrency(buyer.fundsAvailable)}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Interests</span>
          <div className="flex flex-wrap justify-end gap-1 max-w-[180px]">
            {buyer.interests.map((interest: string, i: number) => (
              <Badge key={i} variant="outline" className="text-xs px-1 py-0">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-1">
        <p className="text-xs font-medium">Notes</p>
        <p className="text-xs text-gray-600">{buyer.notes}</p>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" className="h-7 text-xs">Full Profile</Button>
      </div>
    </div>
  );
};

// AI-assisted message suggestion component
interface AIMessageSuggestionsProps {
  engagement: any;
}

const AIMessageSuggestions: React.FC<AIMessageSuggestionsProps> = ({ engagement }) => {
  const suggestions = [
    "Send polite response",
    "Request more details",
    "Share property information",
    "Schedule a showing"
  ];
  
  if (engagement.type === "offer") {
    suggestions.push("Counter offer");
    suggestions.push("Accept offer");
    suggestions.push("Request proof of funds");
  }
  
  return (
    <div className="space-y-2 p-3">
      <div className="flex items-center text-sm font-medium">
        <Sparkles className="h-4 w-4 mr-1.5 text-purple-500" />
        <span>AI Suggested Responses</span>
      </div>
      
      <div className="space-y-1.5">
        {suggestions.map((suggestion, index) => (
          <Button 
            key={index} 
            variant="outline" 
            size="sm"
            className="w-full justify-start text-sm h-8 px-3"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

// Enhanced quick response form
interface QuickResponseFormProps {
  engagement: any;
  onCancel: () => void;
  onSend: (text: string) => void;
}

const QuickResponseForm: React.FC<QuickResponseFormProps> = ({ engagement, onCancel, onSend }) => {
  const [text, setText] = useState("");
  
  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };
  
  return (
    <div className="border rounded-md p-3 space-y-3 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Quick Reply</h3>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onCancel}>
          <XCircle className="h-4 w-4" />
        </Button>
      </div>
      
      <Textarea 
        placeholder="Type your response..." 
        className="min-h-[100px] text-sm"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Sparkles className="h-4 w-4 text-purple-500" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="h-8 bg-[#135341] hover:bg-[#09261E]"
            onClick={handleSend}
            disabled={!text.trim()}
          >
            <Send className="h-3.5 w-3.5 mr-1.5" />
            <span>Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Active Engagement Card component
interface EngagementCardProps {
  engagement: any;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const EngagementCard: React.FC<EngagementCardProps> = ({ 
  engagement, 
  isSelected = false,
  onSelect
}) => {
  const [responding, setResponding] = useState(false);
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const property = getPropertyById(engagement.propertyId);
  const buyer = getBuyerById(engagement.buyerId);
  
  const { icon: EngagementIcon, color: engagementColor, label: engagementLabel } = getEngagementBadge(engagement.type);
  const { text: statusText, color: statusColor } = getStatusBadge(engagement.status);
  const sentimentInfo = getSentimentIndicator(engagement.aiSentiment);
  const SentimentIcon = sentimentInfo.icon;
  
  // Handle actions
  const handleViewProperty = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocation(`/sellerdash/seller123/property/${engagement.propertyId}`);
  };
  
  const handleViewBuyer = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Viewing Buyer Profile",
      description: `Opening profile for ${engagement.buyerName}`,
    });
  };
  
  const handleViewConversation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocation(`/sellerdash/seller123/property/${engagement.propertyId}?tab=messages&conversation=${engagement.buyerId}`);
  };
  
  const handleRespond = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResponding(true);
  };
  
  const handleSendResponse = (text: string) => {
    toast({
      title: "Message Sent",
      description: `Your response has been sent to ${engagement.buyerName}`,
    });
    setResponding(false);
  };
  
  const handleAcceptOffer = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Offer Accepted",
      description: `You've accepted the offer of ${formatCurrency(engagement.offerAmount)}`,
    });
  };
  
  const handleCounterOffer = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Counter Offer",
      description: "Preparing counter offer response...",
    });
  };
  
  const handleDeclineOffer = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Offer Declined",
      description: "The offer has been declined.",
    });
  };
  
  const handleGenerateAIResponse = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "AI Response Generated",
      description: "A response has been generated based on the conversation history.",
    });
  };
  
  const handleSelectCard = () => {
    if (onSelect) {
      onSelect(engagement.id);
    }
  };
  
  return (
    <Card 
      className={cn(
        "mb-3 border transition-all",
        isSelected ? "border-[#135341] shadow-md ring-1 ring-[#135341]" : "hover:shadow-md hover:border-gray-300",
        engagement.isUnread ? "bg-blue-50/30" : "bg-white"
      )}
      onClick={handleSelectCard}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Left: Property thumbnail */}
          <div 
            className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 cursor-pointer relative"
            onClick={handleViewProperty}
          >
            <img 
              src={property?.image} 
              alt={property?.address} 
              className="w-full h-full object-cover"
            />
            {engagement.isUnread && (
              <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full ring-2 ring-white" />
            )}
          </div>
          
          {/* Middle: Engagement details */}
          <div className="flex-1 min-w-0">
            {/* Property and tag row */}
            <div className="flex items-center flex-wrap gap-1.5 mb-1.5">
              <div 
                className="text-sm font-medium text-gray-800 cursor-pointer hover:text-[#135341] hover:underline"
                onClick={handleViewProperty}
              >
                {property?.title || property?.address}
              </div>
              
              <div className="flex gap-1.5">
                <Badge className={engagementColor + " px-2 py-0.5 text-xs"}>
                  <EngagementIcon className="h-3 w-3 mr-1" />
                  <span>{engagementLabel}</span>
                </Badge>
                
                <Badge className={statusColor + " px-2 py-0.5 text-xs"}>
                  {statusText}
                </Badge>
              </div>
            </div>
            
            {/* Buyer row */}
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <div 
                className="flex items-center gap-1.5 cursor-pointer hover:underline"
                onClick={handleViewBuyer}
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-gray-200">{engagement.buyerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{engagement.buyerName}</span>
              </div>
              
              <BuyerBadge 
                type={engagement.buyerType} 
                reputation={engagement.buyerReputation} 
                verified={engagement.verified} 
              />
            </div>
            
            {/* Content section */}
            {engagement.message && (
              <div className="relative">
                <p className="text-sm text-gray-600 line-clamp-2 mb-2.5">{engagement.message}</p>
              </div>
            )}
            
            {/* Show offer details if it's an offer */}
            {engagement.type === 'offer' && (
              <div className="mb-2.5 flex items-center gap-3">
                <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center">
                  <DollarSign className="h-3.5 w-3.5 mr-1" />
                  <span>{formatCurrency(engagement.offerAmount)}</span>
                </Badge>
                
                {engagement.offerTerms && (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2 text-gray-500"
                      >
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        <span>Offer Terms</span>
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-3">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Offer Terms</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-gray-500">Closing Timeframe:</div>
                          <div className="font-medium">{engagement.offerTerms.closingTimeframe}</div>
                          
                          <div className="text-gray-500">Earnest Money:</div>
                          <div className="font-medium">{formatCurrency(engagement.offerTerms.earnestMoney)}</div>
                          
                          <div className="text-gray-500">Contingencies:</div>
                          <div className="font-medium">{engagement.offerTerms.contingencies.join(", ")}</div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </div>
            )}
            
            {/* Bottom stats row */}
            <div className="flex items-center flex-wrap gap-3 text-xs text-gray-500">
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>{timeAgo(engagement.timestamp)}</span>
              </div>
              
              {engagement.aiScore && (
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center cursor-help">
                        <Brain className={cn("h-3.5 w-3.5 mr-1", getAIConfidenceColor(engagement.aiScore))} />
                        <span className={cn("font-medium", getAIConfidenceColor(engagement.aiScore))}>
                          {Math.round(engagement.aiScore * 100)}%
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="p-3 bg-black/90 text-white border-0">
                      <div className="space-y-1">
                        <div className="font-medium">AI Confidence Score</div>
                        <p className="text-xs text-gray-300">
                          {engagement.aiSentiment} ({Math.round(engagement.aiScore * 100)}% confidence)
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {engagement.aiSentiment && (
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn(
                        "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-white text-xs cursor-help",
                        sentimentInfo.color
                      )}>
                        <SentimentIcon className="h-3 w-3" />
                        <span>{sentimentInfo.text}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="p-3 bg-black/90 text-white border-0">
                      <div className="space-y-1">
                        <div className="font-medium">AI Sentiment Analysis</div>
                        <p className="text-xs text-gray-300">{engagement.aiSentiment}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {engagement.tags && engagement.tags.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" />
                  <div className="flex gap-1">
                    {engagement.tags.slice(0, 2).map((tag: string, i: number) => (
                      <Badge key={i} variant="outline" className="px-1 py-0 text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {engagement.tags.length > 2 && (
                      <Badge variant="outline" className="px-1 py-0 text-xs">
                        +{engagement.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right: Actions */}
          <div className="flex flex-col gap-2">
            {/* Direct action buttons based on engagement type */}
            {engagement.type === 'message' && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-blue-700 border-blue-200 hover:bg-blue-50"
                onClick={handleRespond}
              >
                <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                <span>Respond</span>
              </Button>
            )}
            
            {engagement.type === 'offer' && engagement.status === 'new' && (
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 text-green-700 border-green-200 hover:bg-green-50"
                  onClick={handleAcceptOffer}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 text-blue-700 border-blue-200 hover:bg-blue-50"
                  onClick={handleCounterOffer}
                >
                  <CornerDownRight className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 text-red-700 border-red-200 hover:bg-red-50"
                  onClick={handleDeclineOffer}
                >
                  <XCircle className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
            
            {/* Show quick access to AI responses */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-purple-600"
              onClick={handleGenerateAIResponse}
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              <span>AI Respond</span>
            </Button>
            
            {/* View details button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={handleViewConversation}
            >
              <PanelRight className="h-3.5 w-3.5 mr-1.5" />
              <span>View Details</span>
            </Button>
          </div>
        </div>
        
        {/* Expandable activity history */}
        <Collapsible className="mt-3">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full text-xs h-7 hover:bg-gray-50 border-t -mx-4 px-4 rounded-none">
              <ChevronDown className="h-3.5 w-3.5 mr-1.5" />
              <span>Show Activity History</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <ActivityTimeline activities={engagement.activityHistory} limit={Infinity} />
          </CollapsibleContent>
        </Collapsible>
        
        {/* Quick response form */}
        {responding && (
          <div className="mt-3 border-t pt-3">
            <QuickResponseForm 
              engagement={engagement}
              onCancel={() => setResponding(false)}
              onSend={handleSendResponse}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Lead Card Component for CRM table
interface LeadCardProps {
  lead: any;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const { text: statusText, color: statusColor } = getLeadStatusBadge(lead.status);
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  
  const handleViewLead = () => {
    toast({
      title: "Viewing Lead",
      description: `Opening detailed profile for ${lead.name}`,
    });
  };
  
  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Calling Lead",
      description: `Initiating call to ${lead.phone}`,
    });
  };
  
  const handleEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Emailing Lead",
      description: `Creating new email to ${lead.email}`,
    });
  };
  
  const handleAnalytics = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Lead Analytics",
      description: `Viewing detailed analytics for ${lead.name}`,
    });
  };
  
  return (
    <TableRow 
      className="hover:bg-gray-50 cursor-pointer" 
      onClick={handleViewLead}
    >
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gray-200">{lead.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{lead.name}</p>
            <p className="text-xs text-gray-500">{lead.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <p>{lead.phone}</p>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {lead.propertiesOfInterest.map((propId: string) => {
            const property = getPropertyById(propId);
            return (
              <Badge 
                key={propId} 
                variant="outline" 
                className="text-xs cursor-pointer hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setLocation(`/sellerdash/seller123/property/${propId}`);
                }}
              >
                {property?.address.split(',')[0]}
              </Badge>
            );
          })}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-gray-600">
          {timeAgo(lead.lastActivity)}
        </div>
      </TableCell>
      <TableCell>
        <Badge className={statusColor + " px-2 py-0.5 text-xs"}>
          {statusText}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {lead.tags.map((tag: string, index: number) => (
            <Badge key={index} variant="outline" className="bg-gray-100 text-gray-700 text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={handleEmail}
                >
                  <Mail className="h-4 w-4 text-blue-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black/90 text-white border-0">
                Email
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={handleCall}
                >
                  <Phone className="h-4 w-4 text-green-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black/90 text-white border-0">
                Call
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={handleAnalytics}
                >
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black/90 text-white border-0">
                Analytics
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
};

// Template Card component with enhanced features
interface TemplateCardProps {
  template: any;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const { text: categoryText, color: categoryColor } = getTemplateCategoryBadge(template.category);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditTemplate = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUseTemplate = () => {
    toast({
      title: "Template Applied",
      description: "Template content has been copied to the editor.",
    });
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{template.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={categoryColor + " px-2 py-0.5"}>
              {categoryText}
            </Badge>
            {template.usage > 0 && (
              <Badge variant="outline" className="bg-gray-100 text-gray-700 text-xs px-2">
                Used {template.usage}x
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="text-sm text-gray-600 font-medium">{template.subject}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="bg-gray-50 rounded-md p-3 mb-3">
          <p className="text-sm text-gray-700 whitespace-pre-line line-clamp-3">{template.body}</p>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Mail className="h-3.5 w-3.5 mr-1" />
              <span>{Math.round(template.openRate * 100)}% open rate</span>
            </div>
            <div className="flex items-center">
              <CornerDownRight className="h-3.5 w-3.5 mr-1" />
              <span>{Math.round(template.responseRate * 100)}% response rate</span>
            </div>
          </div>
          <div>Last used: {timeAgo(template.lastUsed)}</div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        {isEditing ? (
          <>
            <Button variant="outline" size="sm" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button variant="default" size="sm" className="bg-[#135341] hover:bg-[#09261E]">
              <Edit className="h-4 w-4 mr-1.5" />
              <span>Save Changes</span>
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={handleEditTemplate}>
              <Edit className="h-4 w-4 mr-1.5" />
              <span>Edit</span>
            </Button>
            <Button variant="default" size="sm" className="bg-[#135341] hover:bg-[#09261E]" onClick={handleUseTemplate}>
              <Send className="h-4 w-4 mr-1.5" />
              <span>Use Template</span>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

// This function is already defined above - removed duplicate

// Helper function for offer status badge
function getOfferStatusBadge(status: string) {
  switch (status) {
    case "new": return { label: "New", className: "bg-green-100 text-green-800 border-green-200" };
    case "accepted": return { label: "Accepted", className: "bg-blue-100 text-blue-800 border-blue-200" };
    case "declined": return { label: "Declined", className: "bg-red-100 text-red-800 border-red-200" };
    case "replied": return { label: "Replied", className: "bg-purple-100 text-purple-800 border-purple-200" };
    case "viewed": return { label: "Viewed", className: "bg-gray-100 text-gray-800 border-gray-200" };
    default: return { label: status, className: "bg-gray-100 text-gray-800 border-gray-200" };
  }
}

// Calculate response rate from engagements
function calculateResponseRate(engagements: typeof mockEngagements): number {
  const messages = engagements.filter(e => e.type === "message");
  const responded = messages.filter(e => e.status === "replied" || e.status === "accepted" || e.status === "declined");
  
  if (messages.length === 0) return 0;
  return Math.round((responded.length / messages.length) * 100);
}

// BuyerProfile component
interface BuyerProfileProps {
  buyer?: typeof mockBuyers[0];
}

function BuyerProfile({ buyer }: BuyerProfileProps) {
  if (!buyer) return null;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
          <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold">
            {buyer.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-base">{buyer.name}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-xs text-blue-700">Verified Buyer</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 pt-2">
        <div className="bg-gray-50 rounded-md p-2">
          <p className="text-xs text-gray-500">Engagement</p>
          <p className="font-medium">{buyer.engagementScore || 'N/A'}</p>
        </div>
        <div className="bg-gray-50 rounded-md p-2">
          <p className="text-xs text-gray-500">Last Active</p>
          <p className="font-medium">{timeAgo(buyer.lastActive)}</p>
        </div>
        <div className="bg-gray-50 rounded-md p-2">
          <p className="text-xs text-gray-500">Budget Range</p>
          <p className="font-medium">${formatNumber(buyer.fundsAvailable / 2)} - ${formatNumber(buyer.fundsAvailable)}</p>
        </div>
        <div className="bg-gray-50 rounded-md p-2">
          <p className="text-xs text-gray-500">Response Rate</p>
          <p className="font-medium">85%</p>
        </div>
      </div>
      
      <div className="pt-2">
        <h4 className="text-sm font-medium mb-2">Buyer Tags</h4>
        <div className="flex flex-wrap gap-1.5">
          {buyer.interests?.map((tag, i) => (
            <Badge 
              key={i} 
              variant="outline" 
              className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-2 py-0.5"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="pt-2">
        <h4 className="text-sm font-medium mb-2">Properties Interested In</h4>
        <div className="space-y-2">
          {buyer.viewHistory?.map((view) => {
            const property = getPropertyById(view.propertyId);
            if (!property) return null;
            
            return (
              <div key={view.propertyId} className="flex items-center justify-between gap-2 p-2 rounded-md border">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={property.image} 
                      alt={property.title} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{property.address.split(',')[0]}</p>
                    <p className="text-xs text-gray-500">${formatNumber(property.price)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs">{view.count} views</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="pt-3 flex justify-between border-t mt-4">
        <Button variant="outline" size="sm" className="gap-1.5">
          <Mail className="h-3.5 w-3.5" />
          <span>Email</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Phone className="h-3.5 w-3.5" />
          <span>Call</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          <span>Notes</span>
        </Button>
      </div>
    </div>
  );
}

// AI Buyer Insights Component
interface AIBuyerInsightsProps {
  buyerId: string;
}

function AIBuyerInsights({ buyerId }: AIBuyerInsightsProps) {
  const buyer = mockBuyers.find(b => b.id === buyerId);
  if (!buyer) return null;
  
  // Get AI-generated insights based on buyer behavior
  const getInsights = () => {
    return [
      {
        type: "preference",
        icon: <Home className="h-4 w-4 text-blue-600" />,
        title: "Property Preferences",
        content: "Shows strong interest in properties with rental potential. Tends to engage more with properties in urban locations and under $450,000."
      },
      {
        type: "behavior",
        icon: <BarChart3 className="h-4 w-4 text-purple-600" />,
        title: "Engagement Pattern",
        content: "Typically views properties multiple times before saving or making an offer. Most active during evenings and weekends."
      },
      {
        type: "opportunities",
        icon: <Zap className="h-4 w-4 text-amber-600" />,
        title: "Opportunity Signals",
        content: "Has viewed '123 Main St' multiple times but hasn't made an offer. Consider sending additional information or a personalized message."
      },
      {
        type: "communication",
        icon: <MessageCircle className="h-4 w-4 text-green-600" />,
        title: "Communication Style",
        content: "Responds well to direct, concise messages focusing on ROI and investment potential rather than aesthetic features."
      }
    ];
  };
  
  const insights = getInsights();
  
  return (
    <div className="space-y-4">
      {insights.map((insight, i) => (
        <div key={i} className="mb-3 pb-3 border-b last:border-0 last:mb-0 last:pb-0">
          <div className="flex items-center gap-2 mb-1.5">
            {insight.icon}
            <h4 className="text-sm font-medium">{insight.title}</h4>
          </div>
          <p className="text-sm text-gray-600 pl-6">{insight.content}</p>
        </div>
      ))}
      
      <Button className="w-full bg-[#135341] hover:bg-[#09261E] gap-1.5">
        <Sparkles className="h-4 w-4" />
        <span>Generate Action Plan</span>
      </Button>
    </div>
  );
}

// PropertyEngagementBlock Component
interface PropertyEngagementBlockProps {
  property: typeof mockProperties[0];
  engagements: typeof mockEngagements;
  onViewBuyer: (buyerId: string) => void;
  onUseAI: (engagementId: string) => void;
  saveToOfferRate: number;
}

function PropertyEngagementBlock({ 
  property, 
  engagements,
  onViewBuyer,
  onUseAI,
  saveToOfferRate
}: PropertyEngagementBlockProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Group engagements by type
  const offers = engagements.filter(e => e.type === "offer");
  const messages = engagements.filter(e => e.type === "message");
  const views = engagements.filter(e => e.type === "view");
  const saves = engagements.filter(e => e.type === "save");
  
  // Get stats
  const viewCount = views.length;
  const saveCount = saves.length;
  const messageCount = messages.length;
  const offerCount = offers.length;
  
  // Get unique buyers
  const uniqueBuyerIds = new Set();
  engagements.forEach(e => uniqueBuyerIds.add(e.buyerId));
  
  // Get buyer objects and ensure they're valid
  const uniqueBuyers = Array.from(uniqueBuyerIds)
    .map(id => getBuyerById(id as string))
    .filter(buyer => buyer !== null && buyer !== undefined);
  
  // Check for recent activity
  const hasRecentActivity = engagements.some(e => {
    const activityTime = new Date(e.timestamp);
    const hoursDiff = Math.floor((new Date().getTime() - activityTime.getTime()) / (1000 * 60 * 60));
    return hoursDiff < 24;
  });
  
  // Check for save without offer
  const saveWithoutOffer = saves.some(save => 
    !offers.some(offer => offer.buyerId === save.buyerId)
  );
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200",
      hasRecentActivity && "border-l-4 border-l-blue-500"
    )}>
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex justify-between items-start">
          {/* Property info */}
          <div className="flex items-center gap-3">
            <div className="h-16 w-20 bg-gray-100 rounded-md overflow-hidden">
              <img 
                src={property.image} 
                alt={property.title} 
                className="h-full w-full object-cover"
              />
            </div>
            
            <div>
              <CardTitle className="text-lg flex items-center">
                {property.address.split(',')[0]}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge className={getStatusBadge(property.status).color}>
                  {property.status}
                </Badge>
                <span className="text-sm text-gray-600">${formatNumber(property.price)}</span>
                <span className="text-xs text-gray-500">
                  {property.beds} bed • {property.baths} bath • {property.sqft} sqft
                </span>
              </div>
            </div>
          </div>
          
          {/* Toggle expand/collapse */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <>
          <CardContent className="px-4 pb-3 pt-0">
            <div className="space-y-4">
              {/* Engagement snapshot */}
              <div className="flex flex-wrap gap-3">
                <div className="bg-purple-50 rounded-lg p-2 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                    <Eye className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-600">Views</p>
                    <p className="font-medium">{viewCount}</p>
                  </div>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-2 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                    <Bookmark className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-amber-600">Saves</p>
                    <p className="font-medium">{saveCount}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-2 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600">Messages</p>
                    <p className="font-medium">{messageCount}</p>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-2 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-green-600">Offers</p>
                    <p className="font-medium">{offerCount}</p>
                  </div>
                </div>
                
                {saveToOfferRate > 0 && (
                  <div className="bg-indigo-50 rounded-lg p-2 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                      <Percent className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-indigo-600">Save to Offer</p>
                      <p className="font-medium">{saveToOfferRate.toFixed(0)}%</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Opportunity indicator */}
              {saveWithoutOffer && (
                <Alert variant="outline" className="bg-amber-50 border-amber-200">
                  <Zap className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-sm font-medium text-amber-800">Opportunity</AlertTitle>
                  <AlertDescription className="text-xs text-amber-700">
                    {saves.length - offers.length} buyer{saves.length - offers.length > 1 ? 's' : ''} saved this property but haven't made an offer yet.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Engagement sections */}
              <div className="space-y-4">
                {/* Latest offers */}
                {offers.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Latest Offers</h3>
                    <div className="space-y-2">
                      {offers.slice(0, 3).map((offer) => (
                        <div 
                          key={offer.id} 
                          className={cn(
                            "border rounded-lg p-3 hover:bg-gray-50 transition-colors",
                            offer.status === "new" && "border-l-4 border-l-green-500"
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback>{offer.buyerName[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{offer.buyerName}</p>
                                <p className="text-xs text-gray-500">{timeAgo(offer.timestamp)}</p>
                              </div>
                            </div>
                            <Badge className={getStatusBadge(offer.status).color}>
                              {offer.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-base font-semibold text-green-700">${formatNumber(offer.offerAmount || 0)}</p>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0"
                                onClick={() => onViewBuyer(offer.buyerId)}
                              >
                                <User className="h-4 w-4 text-gray-600" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0"
                              >
                                <MessageCircle className="h-4 w-4 text-gray-600" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4 text-gray-600" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {offers.length > 3 && (
                        <Button variant="ghost" size="sm" className="w-full text-xs">
                          View {offers.length - 3} more offers
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Latest messages */}
                {messages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Latest Messages</h3>
                    <div className="space-y-2">
                      {messages.slice(0, 3).map((message) => (
                        <div 
                          key={message.id} 
                          className={cn(
                            "border rounded-lg p-3 hover:bg-gray-50 transition-colors",
                            message.status === "new" && "border-l-4 border-l-blue-500"
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback>{message.buyerName[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{message.buyerName}</p>
                                <p className="text-xs text-gray-500">{timeAgo(message.timestamp)}</p>
                              </div>
                            </div>
                            {message.status === "new" ? (
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">New</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100 text-gray-800">Replied</Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-2">{message.message}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {message.aiSentiment && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className={cn(
                                        "rounded-full p-1",
                                        message.aiSentiment === "positive" && "bg-green-100",
                                        message.aiSentiment === "neutral" && "bg-gray-100",
                                        message.aiSentiment === "negative" && "bg-red-100"
                                      )}>
                                        {getSentimentIndicator(message.aiSentiment).icon}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" className="bg-black/90 text-white border-0">
                                      {getSentimentIndicator(message.aiSentiment).text}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 gap-1 text-xs text-blue-600"
                                onClick={() => onUseAI(message.id)}
                              >
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>AI Respond</span>
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0"
                                onClick={() => onViewBuyer(message.buyerId)}
                              >
                                <User className="h-4 w-4 text-gray-600" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0"
                              >
                                <ArrowUpRight className="h-4 w-4 text-gray-600" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4 text-gray-600" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {messages.length > 3 && (
                        <Button variant="ghost" size="sm" className="w-full text-xs">
                          View {messages.length - 3} more messages
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Buyers */}
                {uniqueBuyers.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Engaged Buyers ({uniqueBuyers.length})</h3>
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      {/* Temporarily simplify this part to locate the error */}
                      {uniqueBuyers.slice(0, 8).map((buyer) => {
                        if (!buyer) return null;
                        
                        return (
                          <Avatar 
                            key={buyer.id}
                            className="h-9 w-9 border-2 border-white cursor-pointer hover:ring-2 hover:ring-gray-200 transition-all"
                            onClick={() => onViewBuyer(buyer.id)}
                          >
                            <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                              {buyer.name ? buyer.name.charAt(0) : '?'}
                            </AvatarFallback>
                          </Avatar>
                        );
                      })}
                      
                      {uniqueBuyers.length > 8 && (
                        <Avatar className="h-9 w-9 border-2 border-white cursor-pointer hover:scale-105 transition-all" onClick={() => {}}>
                          <AvatarFallback className="bg-gray-100 text-gray-800 text-xs">
                            +{uniqueBuyers.length - 8}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="px-4 py-3 flex justify-between border-t">
            <Button variant="outline" size="sm" onClick={() => {}}>
              <Eye className="h-4 w-4 mr-1.5" />
              <span>View Activity</span>
            </Button>
            
            <div className="flex items-center gap-2">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <span>AI Assist</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-black/90 text-white border-0">
                    Get AI insights and response suggestions
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button className="bg-[#135341] hover:bg-[#09261E]" size="sm">
                <MessageCircle className="h-4 w-4 mr-1.5" />
                <span>Respond</span>
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}

// Main Engagement Page Component
export default function EngagementPage() {
  const { userId } = useParams();
  const [location, setLocation] = useLocation();
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [selectedEngagementTypes, setSelectedEngagementTypes] = useState<string[]>([]);
  const [selectedBuyerTags, setSelectedBuyerTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showBuyerStats, setShowBuyerStats] = useState<string | null>(null);
  const [showAIAssist, setShowAIAssist] = useState(false);
  const { toast } = useToast();
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  
  // Filter engagements based on filters
  const filteredEngagements = mockEngagements.filter(engagement => {
    // Filter by properties if any selected
    if (selectedProperties.length > 0 && !selectedProperties.includes(engagement.propertyId)) return false;
    
    // Filter by engagement types if any selected
    if (selectedEngagementTypes.length > 0 && !selectedEngagementTypes.includes(engagement.type)) return false;
    
    // Filter by buyer tags if any selected
    const buyer = getBuyerById(engagement.buyerId);
    if (selectedBuyerTags.length > 0 && !selectedBuyerTags.some(tag => buyer?.tags?.includes(tag))) return false;
    
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
    return Object.keys(engagementsByProperty).map(propId => 
      getPropertyById(propId)
    ).filter(Boolean);
  }, [engagementsByProperty]);
  
  // Calculate stats
  const activeProperties = mockProperties.filter(p => p.status === "Live").length;
  const totalViews = mockEngagements.filter(e => e.type === "view").length;
  const totalSaves = mockEngagements.filter(e => e.type === "save").length;
  const totalMessages = mockEngagements.filter(e => e.type === "message").length;
  const totalOffers = mockEngagements.filter(e => e.type === "offer").length;
  
  // Average per property
  const avgViewsPerProperty = activeProperties ? Math.round(totalViews / activeProperties) : 0;
  const avgSavesPerProperty = activeProperties ? Math.round(totalSaves / activeProperties) : 0;
  const avgMessagesPerProperty = activeProperties ? Math.round(totalMessages / activeProperties) : 0;
  const avgOffersPerProperty = activeProperties ? Math.round(totalOffers / activeProperties) : 0;
  
  // Time-based improvements (calculate increases over previous period)
  const viewsLastMonth = mockEngagements.filter(e => {
    const isView = e.type === "view";
    const isLastMonth = isWithinInterval(new Date(e.timestamp), {
      start: subMonths(startOfMonth(new Date()), 1),
      end: subMonths(endOfMonth(new Date()), 1)
    });
    return isView && isLastMonth;
