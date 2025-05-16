import React, { useState, useMemo, useRef } from "react";
import { useParams } from "wouter";
import { 
  MessageCircle, 
  DollarSign, 
  Eye, 
  Bookmark, 
  Clock, 
  Filter, 
  Search, 
  CheckCircle, 
  UserCheck, 
  XCircle, 
  CornerDownRight, 
  Users,
  PanelRight,
  Mail,
  Phone,
  CalendarClock,
  Tag,
  BarChart3,
  Send,
  MailCheck,
  Brain,
  Plus,
  ChevronsUpDown,
  Edit,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Trash,
  Activity,
  TimerReset,
  AlertCircle,
  AlertTriangle,
  Paperclip,
  FileText,
  X,
  ThumbsUp,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  User,
  LinkIcon,
  Repeat,
  ChevronDown,
  Coins,
  FileCheck,
  Zap,
  ListFilter,
  Home,
  Percent,
  ChevronUp,
  Lightbulb,
  Layout,
  Sliders,
  CalendarPlus,
  ArrowLeftRight,
  Share2,
  MapPin,
  Calendar,
  LayoutGrid,
  List,
  Award
} from "lucide-react";
import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DrawerContext } from "@/hooks/use-drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from "@/components/ui/sheet";

// Helper function for timeAgo display
const timeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
};

// Helper function for timeUntil display
const timeUntil = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
  
  if (diffInSeconds < 0) return "Past due";
  if (diffInSeconds < 60) return `${diffInSeconds} seconds`;
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''}`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''}`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''}`;
};

// Mock data
const mockProperties = [
  {
    id: "prop1",
    title: "Modern Farmhouse",
    address: "123 Main St, Austin, TX 78701",
    price: 550000,
    photo: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFybWhvdXNlfGVufDB8fDB8fHww",
    beds: 4,
    baths: 3,
    sqft: 2800,
    views: 245,
    saves: 32,
    messages: 17,
    offers: 3
  }
];

const mockBuyers = [
  {
    id: "buyer1",
    name: "David Chen",
    email: "david.chen@example.com",
    phone: "(512) 555-1234",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    budget: 600000,
    preApproved: true,
    preApprovalAmount: 650000,
    timeframe: "3-6 months",
    requirements: {
      minBeds: 3,
      minBaths: 2,
      locations: ["Downtown", "East Austin"],
      propertyTypes: ["Single Family Home", "Townhouse"],
      mustHaves: ["Garage", "Updated Kitchen", "Yard"]
    },
    responseRate: 92,
    responseTime: "under 2 hours",
    lastActive: new Date(new Date().setDate(new Date().getDate() - 1)),
    reputation: "excellent",
    verified: true,
    notes: "Very serious buyer looking for a family home. Has financing ready.",
    savedProperties: 8,
    viewedProperties: 35,
    offersSubmitted: 2,
    timezone: "America/Chicago",
    activities: [
      { action: "Viewed property", timestamp: new Date(new Date().setDate(new Date().getDate() - 1)) },
      { action: "Messaged about price", timestamp: new Date(new Date().setDate(new Date().getDate() - 1)) },
      { action: "Scheduled a viewing", timestamp: new Date(new Date().setHours(new Date().getHours() - 12)) },
      { action: "Requested disclosure documents", timestamp: new Date(new Date().setHours(new Date().getHours() - 6)) },
      { action: "Asked about neighborhood", timestamp: new Date(new Date().setHours(new Date().getHours() - 3)) }
    ]
  },
  {
    id: "buyer2",
    name: "Emily Wong",
    email: "emily.wong@example.com",
    phone: "(512) 555-5678",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    budget: 500000,
    preApproved: true,
    preApprovalAmount: 520000,
    timeframe: "1-3 months",
    requirements: {
      minBeds: 2,
      minBaths: 2,
      locations: ["South Austin", "Barton Hills"],
      propertyTypes: ["Condo", "Townhouse"],
      mustHaves: ["Pool", "Gym", "Pet Friendly"]
    },
    responseRate: 85,
    responseTime: "same day",
    lastActive: new Date(new Date().setHours(new Date().getHours() - 4)),
    reputation: "good",
    verified: true,
    notes: "First-time homebuyer with pre-approval letter. Very responsive.",
    savedProperties: 15,
    viewedProperties: 22,
    offersSubmitted: 1,
    timezone: "America/Chicago",
    activities: [
      { action: "Saved property", timestamp: new Date(new Date().setDate(new Date().getDate() - 3)) },
      { action: "Asked about HOA fees", timestamp: new Date(new Date().setDate(new Date().getDate() - 2)) },
      { action: "Requested floor plans", timestamp: new Date(new Date().setHours(new Date().getHours() - 14)) }
    ]
  },
  {
    id: "buyer3",
    name: "Michael Johnson",
    email: "mjohnson@example.com",
    phone: "(512) 555-9876",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    budget: 750000,
    preApproved: false,
    timeframe: "6+ months",
    requirements: {
      minBeds: 4,
      minBaths: 3,
      locations: ["West Lake Hills", "Tarrytown"],
      propertyTypes: ["Single Family Home", "Luxury"],
      mustHaves: ["View", "Large Lot", "High-end Finishes"]
    },
    responseRate: 60,
    responseTime: "1-2 days",
    lastActive: new Date(new Date().setDate(new Date().getDate() - 5)),
    reputation: "average",
    verified: false,
    notes: "Browsing for now, but has significant assets. May need follow-up.",
    savedProperties: 25,
    viewedProperties: 42,
    offersSubmitted: 0,
    timezone: "America/New_York",
    activities: [
      { action: "Viewed property photos", timestamp: new Date(new Date().setDate(new Date().getDate() - 10)) },
      { action: "Asked about property taxes", timestamp: new Date(new Date().setDate(new Date().getDate() - 7)) }
    ]
  }
];

const mockEngagements = [
  {
    id: "eng1",
    propertyId: "prop1",
    buyerId: "buyer1",
    status: "active",
    lastActivity: new Date(new Date().setHours(new Date().getHours() - 2)),
    initialContact: new Date(new Date().setDate(new Date().getDate() - 7)),
    messages: [
      {
        id: "msg1",
        sender: "buyer",
        content: "Hi, I'm very interested in this property. Is it still available?",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 7)),
        read: true
      },
      {
        id: "msg2",
        sender: "seller",
        content: "Yes, it's still available! Would you like to schedule a viewing?",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 7)),
        read: true
      },
      {
        id: "msg3",
        sender: "buyer",
        content: "That would be great. I'm available this weekend, either Saturday or Sunday afternoon.",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 6)),
        read: true
      },
      {
        id: "msg4",
        sender: "seller",
        content: "Perfect, let's do Sunday at 2 PM. I'll send you the address and parking details.",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 6)),
        read: true
      },
      {
        id: "msg5",
        sender: "buyer",
        content: "Thanks for showing me the property yesterday. I really like the layout and the backyard. I'm thinking about making an offer, but first I wanted to ask about the age of the roof and HVAC system?",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 3)),
        read: true
      },
      {
        id: "msg6",
        sender: "seller",
        content: "I'm glad you liked it! The roof was replaced 3 years ago and has a 20-year warranty. The HVAC was installed in 2020 and is still under manufacturer warranty. I can provide the documentation for both.",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 3)),
        read: true
      },
      {
        id: "msg7",
        sender: "buyer",
        content: "That sounds good. One more question - would you be willing to include the washer and dryer in the sale?",
        timestamp: new Date(new Date().setHours(new Date().getHours() - 28)),
        read: true
      },
      {
        id: "msg8",
        sender: "seller",
        content: "Yes, I'd be happy to include the washer and dryer. They're only 2 years old and in excellent condition.",
        timestamp: new Date(new Date().setHours(new Date().getHours() - 26)),
        read: true
      },
      {
        id: "msg9",
        sender: "buyer",
        content: "Great, thank you! I'm working with my agent to prepare an offer. We should have it to you within the next day or two.",
        timestamp: new Date(new Date().setHours(new Date().getHours() - 2)),
        read: false
      }
    ],
    tasks: [
      {
        id: "task1",
        title: "Schedule property viewing",
        description: "Set up a time for David to view the farmhouse",
        status: "completed",
        dueDate: new Date(new Date().setDate(new Date().getDate() - 5)),
        assignedTo: "owner",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 7))
      },
      {
        id: "task2",
        title: "Send floor plans",
        description: "Email the detailed floor plans to David",
        status: "completed",
        dueDate: new Date(new Date().setDate(new Date().getDate() - 4)),
        assignedTo: "owner",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 6))
      },
      {
        id: "task3",
        title: "Follow up after viewing",
        description: "Check in with David about his thoughts on the property",
        status: "completed",
        dueDate: new Date(new Date().setDate(new Date().getDate() - 2)),
        assignedTo: "owner",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 5))
      },
      {
        id: "task4",
        title: "Send roof and HVAC documentation",
        description: "Share warranty information for roof and HVAC",
        status: "pending",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        assignedTo: "owner",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 2))
      },
      {
        id: "task5",
        title: "Review offer",
        description: "Review David's offer when received",
        status: "not_started",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
        assignedTo: "owner",
        createdAt: new Date(new Date().setHours(new Date().getHours() - 12))
      }
    ],
    offers: [],
    viewings: [
      {
        id: "viewing1",
        date: new Date(new Date().setDate(new Date().getDate() - 4)),
        status: "completed",
        feedback: "Prospect loved the updated kitchen and backyard. Had questions about the age of the roof and HVAC."
      }
    ],
    notes: [
      {
        id: "note1",
        content: "David mentioned he is pre-approved for $650K and is very interested in the school district.",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 5)),
        author: "owner"
      },
      {
        id: "note2",
        content: "He is working with agent Sarah Miller from Austin Homes Realty. She will be handling the paperwork.",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 3)),
        author: "owner"
      }
    ],
    savedDate: new Date(new Date().setDate(new Date().getDate() - 8)),
    milestones: {
      initialContact: new Date(new Date().setDate(new Date().getDate() - 7)),
      firstViewing: new Date(new Date().setDate(new Date().getDate() - 4)),
      offerReceived: null,
      offerAccepted: null,
      inspectionPeriod: null,
      closingScheduled: null,
      closed: null
    }
  },
  {
    id: "eng2",
    propertyId: "prop1",
    buyerId: "buyer2",
    status: "active",
    lastActivity: new Date(new Date().setHours(new Date().getHours() - 18)),
    initialContact: new Date(new Date().setDate(new Date().getDate() - 5)),
    messages: [
      {
        id: "msg1",
        sender: "buyer",
        content: "Hello, I noticed your property listing and I'm interested. What are the HOA fees for this property?",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 5)),
        read: true
      },
      {
        id: "msg2",
        sender: "seller",
        content: "Hi Emily, thanks for your interest! There is no HOA for this property, which means no monthly fees and more freedom for customization.",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 5)),
        read: true
      },
      {
        id: "msg3",
        sender: "buyer",
        content: "That's great to hear! I'm also curious about the utility costs - do you have an estimate of the monthly electric and water bills?",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 4)),
        read: true
      },
      {
        id: "msg4",
        sender: "seller",
        content: "The average electric bill runs about $150-200 per month, with it being higher in summer months due to AC. Water is typically around $60-80 monthly. The house has new energy-efficient windows which helps keep costs down.",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 4)),
        read: true
      },
      {
        id: "msg5",
        sender: "buyer",
        content: "Thanks for the information. I'd like to schedule a viewing. Are you available this coming Tuesday or Wednesday evening?",
        timestamp: new Date(new Date().setHours(new Date().getHours() - 18)),
        read: false
      }
    ],
    tasks: [
      {
        id: "task1",
        title: "Respond about utilities",
        description: "Send Emily information about average utility costs",
        status: "completed",
        dueDate: new Date(new Date().setDate(new Date().getDate() - 3)),
        assignedTo: "owner",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 4))
      },
      {
        id: "task2",
        title: "Schedule viewing with Emily",
        description: "Arrange a time for Emily to see the property next week",
        status: "not_started",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        assignedTo: "owner",
        createdAt: new Date(new Date().setHours(new Date().getHours() - 12))
      }
    ],
    offers: [],
    viewings: [],
    notes: [
      {
        id: "note1",
        content: "Emily is especially interested in energy efficiency and ongoing costs. Highlight the new windows and updated insulation.",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 3)),
        author: "owner"
      }
    ],
    savedDate: new Date(new Date().setDate(new Date().getDate() - 6)),
    milestones: {
      initialContact: new Date(new Date().setDate(new Date().getDate() - 5)),
      firstViewing: null,
      offerReceived: null,
      offerAccepted: null,
      inspectionPeriod: null,
      closingScheduled: null,
      closed: null
    }
  },
  {
    id: "eng3",
    propertyId: "prop1",
    buyerId: "buyer3",
    status: "inactive",
    lastActivity: new Date(new Date().setDate(new Date().getDate() - 7)),
    initialContact: new Date(new Date().setDate(new Date().getDate() - 21)),
    messages: [
      {
        id: "msg1",
        sender: "buyer",
        content: "Hi there, I'm interested in learning more about this property. What year was it built and has it had any major renovations?",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 21)),
        read: true
      },
      {
        id: "msg2",
        sender: "seller",
        content: "Hello Michael, the house was built in 1995 and had a major renovation in 2018 that included a new kitchen, updated bathrooms, and a finished basement. The electrical system was also completely updated at that time.",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 21)),
        read: true
      },
      {
        id: "msg3",
        sender: "buyer",
        content: "Thanks for the info. The lot size mentioned is 0.5 acres - how much of that is usable yard space versus wooded area?",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 14)),
        read: true
      },
      {
        id: "msg4",
        sender: "seller",
        content: "About 0.3 acres is usable yard space with professional landscaping. The remaining 0.2 acres is a wooded area at the back of the property that provides nice privacy and a natural view.",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 14)),
        read: true
      },
      {
        id: "msg5",
        sender: "buyer",
        content: "I appreciate the information. I'm still in the early stages of my home search, but I'll keep this property in mind. If I'm still interested in a month or so, I'll reach back out.",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 7)),
        read: true
      }
    ],
    tasks: [],
    offers: [],
    viewings: [],
    notes: [
      {
        id: "note1",
        content: "Michael seems to be in the research phase and not ready to make a move yet. Set a reminder to follow up in 30 days.",
        timestamp: new Date(new Date().setDate(new Date().getDate() - 7)),
        author: "owner"
      }
    ],
    savedDate: new Date(new Date().setDate(new Date().getDate() - 22)),
    milestones: {
      initialContact: new Date(new Date().setDate(new Date().getDate() - 21)),
      firstViewing: null,
      offerReceived: null,
      offerAccepted: null,
      inspectionPeriod: null,
      closingScheduled: null,
      closed: null
    }
  }
];

// Component for Buyer Badge
interface BuyerBadgeProps {
  type: string;
  reputation: string;
  verified: boolean;
}

function BuyerBadge({ type, reputation, verified }: BuyerBadgeProps) {
  let icon, color;
  
  if (type === "reputation") {
    if (reputation === "excellent") {
      icon = <Award className="h-3 w-3 mr-1" />;
      color = "bg-green-100 text-green-800 hover:bg-green-200";
    } else if (reputation === "good") {
      icon = <ThumbsUp className="h-3 w-3 mr-1" />;
      color = "bg-blue-100 text-blue-800 hover:bg-blue-200";
    } else {
      icon = <User className="h-3 w-3 mr-1" />;
      color = "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  } else if (type === "verified") {
    icon = <CheckCircle className="h-3 w-3 mr-1" />;
    color = verified ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : "bg-gray-100 text-gray-800 hover:bg-gray-200";
  } else if (type === "financing") {
    icon = <Coins className="h-3 w-3 mr-1" />;
    color = "bg-purple-100 text-purple-800 hover:bg-purple-200";
  } else if (type === "timeline") {
    icon = <Calendar className="h-3 w-3 mr-1" />;
    color = "bg-amber-100 text-amber-800 hover:bg-amber-200";
  }
  
  return (
    <Badge variant="outline" className={`text-xs py-0 h-5 ${color} border-none flex items-center gap-0.5`}>
      {icon}
      <span className="text-[10px]">
        {type === "reputation" && reputation.charAt(0).toUpperCase() + reputation.slice(1)}
        {type === "verified" && (verified ? "Verified ID" : "Unverified")}
        {type === "financing" && "Pre-Approved"}
        {type === "timeline" && "Ready to Move"}
      </span>
    </Badge>
  );
}

// Activity timeline component
interface ActivityTimelineProps {
  activities: Array<{ action: string; timestamp: Date }>;
  limit?: number;
}

function ActivityTimeline({ activities, limit }: ActivityTimelineProps) {
  const sortedActivities = [...activities].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );
  
  const displayActivities = limit 
    ? sortedActivities.slice(0, limit) 
    : sortedActivities;
  
  return (
    <div className="space-y-3">
      {displayActivities.map((activity, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="mt-1 bg-gray-100 p-1 rounded-full">
            <Activity className="h-3 w-3 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{activity.action}</p>
            <p className="text-xs text-gray-500">{timeAgo(activity.timestamp)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Buyer activity stats component
interface BuyerActivityStatsProps {
  buyer: any;
}

function BuyerActivityStats({ buyer }: BuyerActivityStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 pt-2">
      <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-2">
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-purple-500" />
          <span className="text-sm font-semibold">{buyer.viewedProperties}</span>
        </div>
        <span className="text-xs text-gray-500">Views</span>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-2">
        <div className="flex items-center gap-1">
          <Bookmark className="h-3 w-3 text-amber-500" />
          <span className="text-sm font-semibold">{buyer.savedProperties}</span>
        </div>
        <span className="text-xs text-gray-500">Saves</span>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-2">
        <div className="flex items-center gap-1">
          <DollarSign className="h-3 w-3 text-green-500" />
          <span className="text-sm font-semibold">{buyer.offersSubmitted}</span>
        </div>
        <span className="text-xs text-gray-500">Offers</span>
      </div>
    </div>
  );
}

// AI message suggestions component
interface AIMessageSuggestionsProps {
  engagement: any;
}

function AIMessageSuggestions({ engagement }: AIMessageSuggestionsProps) {
  const templates = [
    {
      id: "template1",
      title: "Send Follow-Up",
      content: `Hi ${mockBuyers.find(b => b.id === engagement.buyerId)?.name.split(' ')[0]}, I noticed you were interested in my property at ${mockProperties.find(p => p.id === engagement.propertyId)?.address}. Would you like to schedule a viewing or do you have any questions I can answer?`,
      icon: <MessageCircle className="h-4 w-4" />
    },
    {
      id: "template2",
      title: "Request Proof of Funds",
      content: `Hi ${mockBuyers.find(b => b.id === engagement.buyerId)?.name.split(' ')[0]}, to help me better assist you with your interest in my property, would you be able to provide a pre-approval letter or proof of funds? This will help us move quickly if you decide to make an offer.`,
      icon: <FileCheck className="h-4 w-4" />
    },
    {
      id: "template3",
      title: "Ask About Timeline",
      content: `Hi ${mockBuyers.find(b => b.id === engagement.buyerId)?.name.split(' ')[0]}, I'm curious about your timeline for purchasing. Are you looking to move within a specific timeframe? This would help me understand if my property aligns with your needs.`,
      icon: <CalendarClock className="h-4 w-4" />
    }
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">AI-Suggested Responses</h4>
      </div>
      <div className="space-y-3">
        {templates.map(template => (
          <div 
            key={template.id}
            className="cursor-pointer rounded-md border bg-white p-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-slate-100 p-1.5 rounded-full">
                {template.icon}
              </div>
              <h5 className="font-medium text-sm">{template.title}</h5>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">{template.content}</p>
            <div className="flex justify-end mt-2">
              <Button 
                variant="default" 
                size="sm"
                className="text-xs h-7"
              >
                Use Template <Send className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Quick response form component
interface QuickResponseFormProps {
  engagement: any;
  onCancel: () => void;
  onSend: (text: string) => void;
}

function QuickResponseForm({ engagement, onCancel, onSend }: QuickResponseFormProps) {
  const [messageText, setMessageText] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSend(messageText);
      setMessageText("");
    }
  };
  
  return (
    <div className="bg-white border rounded-md p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium">Quick Response</h4>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <Textarea 
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message here..."
            className="resize-none h-24"
          />
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={!messageText.trim()}>
            Send <Send className="ml-2 h-3 w-3" />
          </Button>
        </div>
      </form>
    </div>
  );
}

// Engagement card component
interface EngagementCardProps {
  engagement: any;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

function EngagementCard({ engagement, isSelected, onSelect }: EngagementCardProps) {
  const buyer = mockBuyers.find(b => b.id === engagement.buyerId);
  const property = mockProperties.find(p => p.id === engagement.propertyId);
  
  if (!buyer || !property) return null;
  
  const hasUnreadMessages = engagement.messages.some((msg: any) => msg.sender === 'buyer' && !msg.read);
  
  const lastMessage = engagement.messages[engagement.messages.length - 1];
  
  return (
    <div 
      className={`border rounded-md p-3 cursor-pointer transition-all ${
        isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50'
      } ${hasUnreadMessages ? 'border-l-4 border-l-blue-500' : ''}`}
      onClick={() => onSelect && onSelect(engagement.id)}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={buyer.avatar} alt={buyer.name} />
          <AvatarFallback>{buyer.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-sm">{buyer.name}</h4>
              <p className="text-xs text-gray-500">
                Last activity: {timeAgo(engagement.lastActivity)}
              </p>
            </div>
            {hasUnreadMessages && (
              <Badge className="bg-blue-500">New</Badge>
            )}
          </div>
          
          <div className="mt-2">
            <p className="text-xs text-gray-700 line-clamp-2">
              <span className="font-medium">{lastMessage.sender === 'buyer' ? buyer.name.split(' ')[0] : 'You'}: </span>
              {lastMessage.content}
            </p>
          </div>
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {buyer.preApproved && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-none text-[10px] py-0 h-5">
                  <Coins className="h-3 w-3 mr-1" />
                  Pre-Approved
                </Badge>
              )}
              {engagement.status === 'active' ? (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-none text-[10px] py-0 h-5">
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-100 text-gray-800 border-none text-[10px] py-0 h-5">
                  Inactive
                </Badge>
              )}
            </div>
            
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Lead card component
interface LeadCardProps {
  lead: any;
}

function LeadCard({ lead }: LeadCardProps) {
  const buyer = mockBuyers.find(b => b.id === lead.id);
  
  if (!buyer) return null;
  
  return (
    <div className="border rounded-md p-3 bg-white hover:bg-gray-50 cursor-pointer transition-all">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={buyer.avatar} alt={buyer.name} />
          <AvatarFallback>{buyer.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-sm">{buyer.name}</h4>
              <p className="text-xs text-gray-500">
                Last active: {timeAgo(buyer.lastActive)}
              </p>
            </div>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-1">
            <BuyerBadge type="reputation" reputation={buyer.reputation} verified={false} />
            <BuyerBadge type="verified" reputation="" verified={buyer.verified} />
            {buyer.preApproved && <BuyerBadge type="financing" reputation="" verified={false} />}
          </div>
          
          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs text-gray-600">
              <span className="font-medium">Budget:</span> ${buyer.budget.toLocaleString()}
            </span>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Contact <MessageCircle className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Template message card
interface TemplateCardProps {
  template: any;
}

function TemplateCard({ template }: TemplateCardProps) {
  return (
    <div className="border rounded-md p-3 bg-white hover:bg-gray-50 cursor-pointer transition-all">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-slate-100 p-1.5 rounded-full">
          {template.icon}
        </div>
        <h5 className="font-medium text-sm">{template.title}</h5>
      </div>
      <p className="text-xs text-gray-600 line-clamp-2">{template.content}</p>
      <div className="flex justify-end mt-2">
        <Button 
          variant="default" 
          size="sm"
          className="text-xs h-7"
        >
          Use <Send className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

// Helper function to get a descriptive badge for an offer's status
function getOfferStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0">Pending</Badge>;
    case 'accepted':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">Accepted</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-0">Rejected</Badge>;
    case 'countered':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0">Countered</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-0">{status}</Badge>;
  }
}

// Helper function to calculate response rate
function calculateResponseRate(engagements: typeof mockEngagements): number {
  const totalMessages = engagements.reduce((acc, engagement) => {
    const buyerMessages = engagement.messages.filter(msg => msg.sender === 'buyer');
    const sellerReplies = engagement.messages.filter(msg => msg.sender === 'seller');
    return acc + buyerMessages.length;
  }, 0);
  
  const totalReplies = engagements.reduce((acc, engagement) => {
    let repliedCount = 0;
    const buyerMessages = engagement.messages
      .filter(msg => msg.sender === 'buyer')
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      
    buyerMessages.forEach((buyerMsg, i) => {
      const subsequentSellerReplies = engagement.messages.filter(
        msg => msg.sender === 'seller' && msg.timestamp > buyerMsg.timestamp
      );
      if (subsequentSellerReplies.length > 0) repliedCount++;
    });
    
    return acc + repliedCount;
  }, 0);
  
  return totalMessages > 0 ? (totalReplies / totalMessages) * 100 : 100;
}

// Buyer Profile Component
interface BuyerProfileProps {
  buyer?: typeof mockBuyers[0];
}

function BuyerProfile({ buyer }: BuyerProfileProps) {
  if (!buyer) return null;
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={buyer.avatar} alt={buyer.name} />
              <AvatarFallback>{buyer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{buyer.name}</CardTitle>
              <div className="flex gap-1 mt-1">
                <BuyerBadge type="reputation" reputation={buyer.reputation} verified={false} />
                <BuyerBadge type="verified" reputation="" verified={buyer.verified} />
                {buyer.preApproved && <BuyerBadge type="financing" reputation="" verified={false} />}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Mail className="mr-1 h-3 w-3" />
              Message
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Phone className="mr-1 h-3 w-3" />
              Call
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-xs">Contact Info</p>
            <div className="mt-1 space-y-1">
              <p className="flex items-center gap-1">
                <Mail className="h-3 w-3 text-gray-400" />
                <a href={`mailto:${buyer.email}`} className="text-blue-600 hover:underline">{buyer.email}</a>
              </p>
              <p className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-gray-400" />
                <a href={`tel:${buyer.phone}`} className="text-blue-600 hover:underline">{buyer.phone}</a>
              </p>
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Buying Details</p>
            <div className="mt-1 space-y-1">
              <p className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-gray-400" />
                  <span>Budget</span>
                </span>
                <span className="font-medium">${buyer.budget.toLocaleString()}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span>Timeframe</span>
                </span>
                <span className="font-medium">{buyer.timeframe}</span>
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <p className="text-gray-500 text-xs mb-1">Property Requirements</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <p className="flex items-center justify-between">
              <span>Min. Bedrooms</span>
              <span className="font-medium">{buyer.requirements.minBeds}</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Min. Bathrooms</span>
              <span className="font-medium">{buyer.requirements.minBaths}</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Locations</span>
              <span className="font-medium">{buyer.requirements.locations.length}</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Property Types</span>
              <span className="font-medium">{buyer.requirements.propertyTypes.length}</span>
            </p>
          </div>
        </div>
        
        <div>
          <p className="text-gray-500 text-xs mb-1">Engagement Stats</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-2">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3 text-purple-500" />
                <span className="text-sm font-semibold">{buyer.viewedProperties}</span>
              </div>
              <span className="text-xs text-gray-500">Views</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-2">
              <div className="flex items-center gap-1">
                <Bookmark className="h-3 w-3 text-amber-500" />
                <span className="text-sm font-semibold">{buyer.savedProperties}</span>
              </div>
              <span className="text-xs text-gray-500">Saves</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-2">
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3 text-blue-500" />
                <span className="text-sm font-semibold">{buyer.activities.length}</span>
              </div>
              <span className="text-xs text-gray-500">Activities</span>
            </div>
          </div>
        </div>
        
        <div>
          <p className="text-gray-500 text-xs mb-2">Recent Activity</p>
          <ActivityTimeline activities={buyer.activities} limit={3} />
        </div>
      </CardContent>
    </Card>
  );
}

// AI Buyer Insights Component
interface AIBuyerInsightsProps {
  buyerId: string;
}

function AIBuyerInsights({ buyerId }: AIBuyerInsightsProps) {
  const buyer = mockBuyers.find(b => b.id === buyerId);
  
  if (!buyer) return null;
  
  return (
    <Card className="border-dashed border-blue-200 bg-blue-50">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
          <CardTitle className="text-sm font-medium">AI Buyer Insights</CardTitle>
        </div>
        <CardDescription className="text-xs">
          AI-generated analysis based on buyer behavior and communications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="bg-white rounded-md p-3 border border-blue-100">
          <h4 className="text-xs font-medium flex items-center mb-1">
            <Zap className="h-3.5 w-3.5 text-amber-500 mr-1" />
            Buyer Motivation
          </h4>
          <p className="text-xs text-gray-600">
            {buyer.name.split(' ')[0]} is actively looking for a family home and has shown consistent interest in properties with updated kitchens and outdoor space. They appear to be a serious buyer based on their engagement pattern.
          </p>
        </div>
        
        <div className="bg-white rounded-md p-3 border border-blue-100">
          <h4 className="text-xs font-medium flex items-center mb-1">
            <ChevronUp className="h-3.5 w-3.5 text-green-500 mr-1" />
            Key Engagement Points
          </h4>
          <p className="text-xs text-gray-600">
            Questions about the roof and HVAC systems suggest they're detail-oriented and looking for a well-maintained home. Mentioning the warranties was effective in moving the conversation forward.
          </p>
        </div>
        
        <div className="bg-white rounded-md p-3 border border-blue-100">
          <h4 className="text-xs font-medium flex items-center mb-1">
            <Brain className="h-3.5 w-3.5 text-purple-500 mr-1" />
            Recommended Next Steps
          </h4>
          <p className="text-xs text-gray-600">
            Follow up about their interest in making an offer. Suggest providing additional documentation about home maintenance and improvements to address their due diligence concerns.
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="default" size="sm" className="w-full text-xs">
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh Insights
        </Button>
      </CardFooter>
    </Card>
  );
}

// Property Engagement Block Component
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
  
  const activeEngagements = engagements.filter(eng => eng.status === 'active');
  const responseRate = calculateResponseRate(engagements);
  
  const stats = {
    views: property.views,
    saves: property.saves,
    messages: property.messages,
    offers: property.offers
  };
  
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg overflow-hidden">
                <img src={property.photo} alt={property.title} className="h-full w-full object-cover" />
              </div>
              <div>
                <CardTitle className="text-base font-medium">{property.title}</CardTitle>
                <CardDescription className="text-xs">{property.address}</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              View Property
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-3">
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-gray-50 rounded-md p-2 text-center">
              <div className="flex items-center justify-center gap-1 text-purple-600">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-bold">{stats.views}</span>
              </div>
              <p className="text-xs text-gray-600">Views</p>
            </div>
            <div className="bg-gray-50 rounded-md p-2 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-600">
                <Bookmark className="h-4 w-4" />
                <span className="text-sm font-bold">{stats.saves}</span>
              </div>
              <p className="text-xs text-gray-600">Saves</p>
            </div>
            <div className="bg-gray-50 rounded-md p-2 text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-bold">{stats.messages}</span>
              </div>
              <p className="text-xs text-gray-600">Messages</p>
            </div>
            <div className="bg-gray-50 rounded-md p-2 text-center">
              <div className="flex items-center justify-center gap-1 text-green-600">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm font-bold">{stats.offers}</span>
              </div>
              <p className="text-xs text-gray-600">Offers</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-medium">Response Rate</h4>
                <span className="text-xs font-medium">{responseRate.toFixed(0)}%</span>
              </div>
              <Progress value={responseRate} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-medium">Save to Offer Conversion</h4>
                <span className="text-xs font-medium">{saveToOfferRate.toFixed(0)}%</span>
              </div>
              <Progress value={saveToOfferRate} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
          
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Activity Timeline</CardTitle>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="h-8 w-[120px] text-xs border-gray-200 hover:bg-gray-100 focus:ring-gray-300">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">All Activities</SelectItem>
                  <SelectItem value="messages" className="text-xs">Messages</SelectItem>
                  <SelectItem value="saves" className="text-xs">Saves</SelectItem>
                  <SelectItem value="views" className="text-xs">Views</SelectItem>
                  <SelectItem value="offers" className="text-xs">Offers</SelectItem>
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2 border-gray-200 hover:bg-gray-100 focus:ring-gray-300">
                    <ListFilter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel className="text-xs">Filter Activity</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox id="filter-today" />
                        <Label htmlFor="filter-today" className="ml-2 text-xs">Today</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="filter-week" checked />
                        <Label htmlFor="filter-week" className="ml-2 text-xs">Past Week</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="filter-month" checked />
                        <Label htmlFor="filter-month" className="ml-2 text-xs">Past Month</Label>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-0">
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-4">
              {engagements.slice(0, 3).flatMap((eng) => {
                const buyer = mockBuyers.find(b => b.id === eng.buyerId);
                if (!buyer) return [];
                
                // Extract key activities from this engagement
                const activities = [
                  ...eng.messages.map(msg => ({
                    type: 'message',
                    buyer,
                    timestamp: msg.timestamp,
                    content: msg.content,
                    sender: msg.sender,
                    engagementId: eng.id
                  })),
                  ...(eng.viewings || []).map(viewing => ({
                    type: 'viewing',
                    buyer,
                    timestamp: viewing.date,
                    status: viewing.status,
                    engagementId: eng.id
                  })),
                  ...(eng.offers || []).map(offer => ({
                    type: 'offer',
                    buyer,
                    timestamp: offer.date,
                    amount: offer.amount,
                    status: offer.status,
                    engagementId: eng.id
                  }))
                ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
                
                return activities.slice(0, 2);
              }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.buyer.avatar} alt={activity.buyer.name} />
                    <AvatarFallback>{activity.buyer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium">{activity.buyer.name}</p>
                      {activity.type === 'message' && activity.sender === 'buyer' && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-none text-[10px] py-0 h-5">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Message
                        </Badge>
                      )}
                      {activity.type === 'viewing' && (
                        <Badge variant="outline" className="bg-purple-100 text-purple-800 border-none text-[10px] py-0 h-5">
                          <Eye className="h-3 w-3 mr-1" />
                          Viewing
                        </Badge>
                      )}
                      {activity.type === 'offer' && (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-none text-[10px] py-0 h-5">
                          <DollarSign className="h-3 w-3 mr-1" />
                          Offer
                        </Badge>
                      )}
                      <span className="text-[10px] text-gray-500">
                        {timeAgo(activity.timestamp)}
                      </span>
                    </div>
                    
                    {activity.type === 'message' && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {activity.sender === 'buyer' ? 
                          <span>{activity.content}</span> : 
                          <span className="italic text-gray-500">You: {activity.content}</span>
                        }
                      </p>
                    )}
                    
                    {activity.type === 'viewing' && (
                      <p className="text-xs text-gray-600 mt-1">
                        {activity.status === 'completed' ? 
                          'Completed a property viewing' : 
                          'Scheduled a property viewing'
                        }
                      </p>
                    )}
                    
                    {activity.type === 'offer' && (
                      <p className="text-xs text-gray-600 mt-1 flex items-center">
                        Made an offer of <span className="font-medium mx-1">${activity.amount.toLocaleString()}</span>
                        {getOfferStatusBadge(activity.status)}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs px-2 hover:bg-gray-100"
                        onClick={() => onViewBuyer(activity.buyer.id)}
                      >
                        <User className="h-3 w-3 mr-1" />
                        View Buyer
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs px-2 hover:bg-gray-100"
                        onClick={() => onUseAI(activity.engagementId)}
                      >
                        <Brain className="h-3 w-3 mr-1" />
                        AI Respond
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Engaged Buyers</CardTitle>
            <Tabs defaultValue="active" className="w-[200px]">
              <TabsList className="h-8 px-1 bg-gray-100">
                <TabsTrigger 
                  value="active" 
                  className="text-xs h-6 data-[state=active]:bg-white"
                >
                  Active <Badge className="ml-1 text-[10px] h-4 py-0">{activeEngagements.length}</Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="all" 
                  className="text-xs h-6 data-[state=active]:bg-white"
                >
                  All <Badge className="ml-1 text-[10px] h-4 py-0">{engagements.length}</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="py-0">
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {engagements.filter(eng => eng.status === 'active').map(engagement => (
                <EngagementCard 
                  key={engagement.id} 
                  engagement={engagement}
                  onSelect={() => {}}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="pt-3 pb-3">
          <Button variant="outline" size="sm" className="w-full text-xs">
            <Plus className="h-3 w-3 mr-1" />
            New Message
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function EngagementPage() {
  const { userId } = useParams();
  const [showAIDrawer, setShowAIDrawer] = useState(false);
  const [activeBuyerId, setActiveBuyerId] = useState<string | null>(null);
  const [currentEngagementId, setCurrentEngagementId] = useState<string | null>(null);
  
  const handleViewBuyer = (buyerId: string) => {
    setActiveBuyerId(buyerId);
  };
  
  const handleUseAI = (engagementId: string) => {
    setCurrentEngagementId(engagementId);
    setShowAIDrawer(true);
  };
  
  const currentEngagement = useMemo(() => {
    if (!currentEngagementId) return null;
    return mockEngagements.find(eng => eng.id === currentEngagementId);
  }, [currentEngagementId]);
  
  const activeBuyer = useMemo(() => {
    if (!activeBuyerId) return mockBuyers[0]; // Default to first buyer
    return mockBuyers.find(b => b.id === activeBuyerId);
  }, [activeBuyerId]);
  
  return (
    <SellerDashboardLayout>
      <div className="container py-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Buyer Engagement</h1>
            <p className="text-gray-500 text-sm">Manage and track all your buyer interactions</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="default" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PropertyEngagementBlock 
              property={mockProperties[0]}
              engagements={mockEngagements}
              onViewBuyer={handleViewBuyer}
              onUseAI={handleUseAI}
              saveToOfferRate={12}
            />
          </div>
          
          <div className="space-y-5">
            <BuyerProfile buyer={activeBuyer} />
            <AIBuyerInsights buyerId={activeBuyer?.id || ""} />
          </div>
        </div>
      </div>
      
      <Sheet open={showAIDrawer} onOpenChange={setShowAIDrawer}>
        <SheetContent className="w-[400px] sm:w-[540px] p-0">
          <SheetHeader className="p-6 pb-2">
            <SheetTitle className="flex items-center">
              <Brain className="h-5 w-5 text-blue-500 mr-2" />
              AI Engagement Assistant
            </SheetTitle>
            <SheetDescription>
              AI-powered responses and insights for engaging with this buyer
            </SheetDescription>
          </SheetHeader>
          <div className="p-6 pt-0">
            {currentEngagement && (
              <AIMessageSuggestions engagement={currentEngagement} />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </SellerDashboardLayout>
  );
}

// Helper component for more horizontal icon
function MoreHorizontal({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}