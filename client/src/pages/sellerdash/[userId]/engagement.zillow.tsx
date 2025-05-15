import React, { useState, useMemo } from "react";
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
  Sparkles,
  ExternalLink,
  Trash,
  Activity,
  TimerReset,
  AlertCircle,
  AlertTriangle,
  Paperclip,
  FileText,
  LinkIcon,
  Repeat,
  User,
  ChevronDown,
  Coins,
  FileCheck,
  Zap,
  ListFilter,
  ChevronRight,
  X,
  Home,
  Percent,
  ChevronUp,
  Lightbulb,
  Layout,
  HelpCircle,
  Sliders,
  CalendarPlus,
  ArrowLeftRight,
  Share2,
  MapPin,
  Calendar,
  RefreshCw,
  LayoutGrid,
  List,
  ArrowRight,
} from "lucide-react";
import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useToast } from "@/hooks/use-toast";

// Mock data
// Property mock data
const mockProperties = [
  {
    id: "prop1",
    title: "Modern Farmhouse",
    address: "123 Main St, Austin, TX 78701",
    status: "For Sale",
    price: 450000,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2940&auto=format&fit=crop",
    beds: 4,
    baths: 3,
    sqft: 2800,
    type: "Single Family",
    yearBuilt: 2020,
    listed: "2025-03-15",
  },
  {
    id: "prop2",
    title: "Downtown Condo",
    address: "456 Urban Ave, Austin, TX 78702",
    status: "For Sale",
    price: 385000,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2874&auto=format&fit=crop",
    beds: 2,
    baths: 2,
    sqft: 1200,
    type: "Condo",
    yearBuilt: 2018,
    listed: "2025-03-22",
  },
  {
    id: "prop3",
    title: "Lakefront Property",
    address: "789 Lake Dr, Austin, TX 78703",
    status: "For Sale",
    price: 750000,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2940&auto=format&fit=crop",
    beds: 5,
    baths: 4,
    sqft: 3500,
    type: "Single Family",
    yearBuilt: 2015,
    listed: "2025-03-10",
  },
];

// Buyer mock data
const mockBuyers = [
  {
    id: "buyer1",
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "555-123-4567",
    avatar: null,
    activity: "High",
    lastActive: "2025-05-13T14:22:00Z",
    interests: ["Investment Property", "Single Family", "Fixer-Upper"],
    tags: ["Investor", "Pre-Approved"],
    viewHistory: ["prop1", "prop2", "prop3"],
    savedProperties: ["prop1", "prop3"],
    location: "Austin, TX",
    priceRange: { min: 300000, max: 600000 },
    preferredBeds: 3,
    preferredBaths: 2,
    notes: "Looking for investment properties with good rental potential.",
  },
  {
    id: "buyer2",
    name: "Sam Taylor",
    email: "sam@example.com",
    phone: "555-987-6543",
    avatar: null,
    activity: "Medium",
    lastActive: "2025-05-12T09:45:00Z",
    interests: ["First-Time Buyer", "Condo", "Move-in Ready"],
    tags: ["First-Time Buyer", "Pre-Qualified"],
    viewHistory: ["prop2"],
    savedProperties: ["prop2"],
    location: "Austin, TX",
    priceRange: { min: 250000, max: 400000 },
    preferredBeds: 2,
    preferredBaths: 2,
    notes: "Prefers locations close to downtown with good amenities.",
  },
  {
    id: "buyer3",
    name: "Jordan Smith",
    email: "jordan@example.com",
    phone: "555-567-8901",
    avatar: null,
    activity: "High",
    lastActive: "2025-05-13T16:10:00Z",
    interests: ["Luxury", "Waterfront", "New Construction"],
    tags: ["Luxury Buyer", "Cash Buyer", "REP Verified"],
    viewHistory: ["prop1", "prop3"],
    savedProperties: ["prop3"],
    location: "Austin, TX",
    priceRange: { min: 600000, max: 1000000 },
    preferredBeds: 4,
    preferredBaths: 3,
    notes: "Looking for high-end properties, prefers lake views or waterfront.",
  },
  {
    id: "buyer4",
    name: "Casey Wong",
    email: "casey@example.com",
    phone: "555-234-5678",
    avatar: null,
    activity: "Low",
    lastActive: "2025-05-10T11:20:00Z",
    interests: ["Investment Property", "Multi-Family"],
    tags: ["Investor"],
    viewHistory: ["prop1"],
    savedProperties: [],
    location: "Austin, TX",
    priceRange: { min: 350000, max: 800000 },
    preferredBeds: 3,
    preferredBaths: 2,
    notes: "Interested in properties with good rental income potential.",
  },
  {
    id: "buyer5",
    name: "Morgan Lee",
    email: "morgan@example.com",
    phone: "555-345-6789",
    avatar: null,
    activity: "Medium",
    lastActive: "2025-05-11T15:30:00Z",
    interests: ["Single Family", "Suburban", "Good Schools"],
    tags: ["Family", "Pre-Approved"],
    viewHistory: ["prop1", "prop3"],
    savedProperties: ["prop1"],
    location: "Austin, TX",
    priceRange: { min: 400000, max: 700000 },
    preferredBeds: 4,
    preferredBaths: 3,
    notes: "Looking for a family home in a good school district.",
  },
];

// Engagement mock data
const mockEngagements = [
  // Property 1 engagements
  { id: "eng1", propertyId: "prop1", buyerId: "buyer1", type: "view", timestamp: "2025-05-12T10:30:00Z", status: "new", data: { device: "mobile", duration: 120 } },
  { id: "eng2", propertyId: "prop1", buyerId: "buyer1", type: "save", timestamp: "2025-05-12T10:32:00Z", status: "new", data: { } },
  { id: "eng3", propertyId: "prop1", buyerId: "buyer1", type: "message", timestamp: "2025-05-12T11:15:00Z", status: "new", data: { message: "Is this property still available? I'm interested in scheduling a viewing this weekend." } },
  { id: "eng4", propertyId: "prop1", buyerId: "buyer3", type: "view", timestamp: "2025-05-12T13:45:00Z", status: "new", data: { device: "desktop", duration: 180 } },
  { id: "eng5", propertyId: "prop1", buyerId: "buyer4", type: "view", timestamp: "2025-05-13T09:20:00Z", status: "new", data: { device: "tablet", duration: 90 } },
  { id: "eng6", propertyId: "prop1", buyerId: "buyer5", type: "view", timestamp: "2025-05-13T11:30:00Z", status: "new", data: { device: "mobile", duration: 150 } },
  { id: "eng7", propertyId: "prop1", buyerId: "buyer5", type: "save", timestamp: "2025-05-13T11:35:00Z", status: "new", data: { } },
  
  // Property 2 engagements
  { id: "eng8", propertyId: "prop2", buyerId: "buyer2", type: "view", timestamp: "2025-05-11T15:20:00Z", status: "new", data: { device: "desktop", duration: 210 } },
  { id: "eng9", propertyId: "prop2", buyerId: "buyer2", type: "save", timestamp: "2025-05-11T15:25:00Z", status: "new", data: { } },
  { id: "eng10", propertyId: "prop2", buyerId: "buyer2", type: "message", timestamp: "2025-05-11T16:00:00Z", status: "replied", data: { message: "Hi, I'm interested in this property. Do you have any open house scheduled?" } },
  { id: "eng11", propertyId: "prop2", buyerId: "buyer1", type: "view", timestamp: "2025-05-12T14:10:00Z", status: "new", data: { device: "mobile", duration: 60 } },
  
  // Property 3 engagements
  { id: "eng12", propertyId: "prop3", buyerId: "buyer1", type: "view", timestamp: "2025-05-13T10:00:00Z", status: "new", data: { device: "desktop", duration: 240 } },
  { id: "eng13", propertyId: "prop3", buyerId: "buyer1", type: "save", timestamp: "2025-05-13T10:05:00Z", status: "new", data: { } },
  { id: "eng14", propertyId: "prop3", buyerId: "buyer3", type: "view", timestamp: "2025-05-13T11:30:00Z", status: "new", data: { device: "desktop", duration: 300 } },
  { id: "eng15", propertyId: "prop3", buyerId: "buyer3", type: "save", timestamp: "2025-05-13T11:40:00Z", status: "new", data: { } },
  { id: "eng16", propertyId: "prop3", buyerId: "buyer3", type: "offer", timestamp: "2025-05-13T14:20:00Z", status: "new", data: { amount: 720000, contingencies: ["Inspection", "Financing"], closingDate: "2025-07-15" } },
  { id: "eng17", propertyId: "prop3", buyerId: "buyer5", type: "view", timestamp: "2025-05-12T16:45:00Z", status: "new", data: { device: "mobile", duration: 150 } },
];

// Helper functions
function getBuyerById(id: string) {
  return mockBuyers.find(buyer => buyer.id === id);
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric',
    hour12: true
  }).format(date);
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

function calculateResponseRate(engagements: typeof mockEngagements) {
  const messages = engagements.filter(e => e.type === "message");
  if (messages.length === 0) return 100;
  
  const replied = messages.filter(e => e.status === "replied");
  return Math.round((replied.length / messages.length) * 100);
}

// Property card used in the left sidebar list
function PropertyCard({ 
  property, 
  engagements, 
  isSelected, 
  onSelect 
}: { 
  property: typeof mockProperties[0];
  engagements: typeof mockEngagements;
  isSelected: boolean;
  onSelect: () => void;
}) {
  // Get engagement stats
  const views = engagements.filter(e => e.type === "view").length;
  const saves = engagements.filter(e => e.type === "save").length;
  const messages = engagements.filter(e => e.type === "message").length;
  const newMessages = engagements.filter(e => e.type === "message" && e.status === "new").length;
  const offers = engagements.filter(e => e.type === "offer").length;
  const newOffers = engagements.filter(e => e.type === "offer" && e.status === "new").length;
  
  // Check if there is new activity
  const hasNewActivity = newMessages > 0 || newOffers > 0;
  
  return (
    <div 
      className={`border rounded-lg overflow-hidden mb-3 transition-all ${
        isSelected 
          ? 'border-[#135341] ring-1 ring-[#135341] bg-white' 
          : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start p-3">
        <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0 relative">
          <img 
            src={property.image} 
            alt={property.title} 
            className="h-full w-full object-cover"
          />
          {hasNewActivity && (
            <div className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
          )}
        </div>
        
        <div className="ml-3 flex-grow">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="font-medium text-gray-800 line-clamp-1">{property.address.split(',')[0]}</h3>
              <p className="text-xs text-gray-500">
                {property.address.split(',').slice(1).join(',')}
              </p>
            </div>
            <Badge variant="outline" className="ml-2 text-xs">
              {formatCurrency(property.price)}
            </Badge>
          </div>
          
          <div className="flex flex-wrap items-center mt-2 text-xs text-gray-600 gap-2">
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1 text-blue-500" />
              <span>{views}</span>
            </div>
            <div className="flex items-center">
              <Bookmark className="h-3 w-3 mr-1 text-amber-500" />
              <span>{saves}</span>
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-3 w-3 mr-1 text-green-500" />
              <span>{messages}{newMessages > 0 && <span className="text-green-600 font-medium ml-0.5">({newMessages})</span>}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-3 w-3 mr-1 text-purple-500" />
              <span>{offers}{newOffers > 0 && <span className="text-purple-600 font-medium ml-0.5">({newOffers})</span>}</span>
            </div>
          </div>
        </div>
      </div>
      
      {hasNewActivity && (
        <div className="bg-amber-50 px-3 py-1.5 text-xs border-t border-amber-100">
          <span className="font-medium text-amber-800">Needs attention</span>
          {newMessages > 0 && (
            <span className="text-amber-700"> • {newMessages} unread message{newMessages > 1 ? 's' : ''}</span>
          )}
          {newOffers > 0 && (
            <span className="text-amber-700"> • {newOffers} new offer{newOffers > 1 ? 's' : ''}</span>
          )}
        </div>
      )}
    </div>
  );
}

// Buyer profile component for the side panel
function BuyerProfile({ buyer }: { buyer: typeof mockBuyers[0] }) {
  if (!buyer) return null;
  
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center">
        <Avatar className="h-16 w-16 mr-4">
          <AvatarFallback className="bg-blue-100 text-blue-800 text-xl">
            {buyer.name ? buyer.name.charAt(0) : '?'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{buyer.name}</h3>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {buyer.tags?.map((tag, i) => (
              <Badge key={i} variant="outline" className="bg-gray-100 text-gray-800 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Activity Level</p>
          <div className="flex items-center mt-1">
            <Badge variant={buyer.activity === "High" ? "default" : buyer.activity === "Medium" ? "outline" : "secondary"} className="text-xs">
              {buyer.activity}
            </Badge>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Last Active</p>
          <p className="text-sm font-medium mt-1">{formatDate(buyer.lastActive)}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <Mail className="h-4 w-4 text-gray-500 mr-2" />
          <p className="text-sm">{buyer.email}</p>
        </div>
        <div className="flex items-center">
          <Phone className="h-4 w-4 text-gray-500 mr-2" />
          <p className="text-sm">{buyer.phone}</p>
        </div>
        <div className="flex items-center">
          <Home className="h-4 w-4 text-gray-500 mr-2" />
          <p className="text-sm">{buyer.location}</p>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="text-sm font-medium mb-2">Interests</h4>
        <div className="flex flex-wrap gap-1.5">
          {buyer.interests?.map((interest, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {interest}
            </Badge>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Price Range</h4>
        <div className="flex items-center">
          <span className="text-sm font-semibold">{formatCurrency(buyer.priceRange.min)}</span>
          <Separator className="h-px w-6 mx-2" />
          <span className="text-sm font-semibold">{formatCurrency(buyer.priceRange.max)}</span>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Property Preferences</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-xs text-gray-500">Bedrooms</p>
            <p className="text-sm font-medium">{buyer.preferredBeds}+</p>
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-xs text-gray-500">Bathrooms</p>
            <p className="text-sm font-medium">{buyer.preferredBaths}+</p>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Notes</h4>
        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{buyer.notes}</p>
      </div>
      
      <div className="pt-2">
        <Button className="w-full bg-[#135341] hover:bg-[#09261E]">
          <MessageCircle className="h-4 w-4 mr-2" />
          <span>Send Message</span>
        </Button>
      </div>
    </div>
  );
}

// AI message suggestions component
function AIMessageSuggestions({ engagement }: { engagement: typeof mockEngagements[0] }) {
  const buyer = getBuyerById(engagement.buyerId);
  
  const suggestionTemplates = [
    {
      title: "Professional Response",
      content: `Hi ${buyer?.name}, thank you for your interest in the property at ${mockProperties.find(p => p.id === engagement.propertyId)?.address.split(',')[0]}. I'd be happy to provide more information or schedule a viewing at your convenience. When would be a good time for you?`,
    },
    {
      title: "Detailed Information",
      content: `Hello ${buyer?.name}, thank you for your message about ${mockProperties.find(p => p.id === engagement.propertyId)?.title}. This property features ${mockProperties.find(p => p.id === engagement.propertyId)?.beds} bedrooms, ${mockProperties.find(p => p.id === engagement.propertyId)?.baths} bathrooms, and ${mockProperties.find(p => p.id === engagement.propertyId)?.sqft} square feet. Would you like me to send you additional photos or information about the neighborhood?`,
    },
    {
      title: "Schedule a Viewing",
      content: `Hi ${buyer?.name}, thanks for your interest in the ${mockProperties.find(p => p.id === engagement.propertyId)?.title}. I have availability this weekend for private viewings. Would Saturday or Sunday work better for you to see the property in person?`,
    },
  ];
  
  return (
    <div className="p-4 space-y-4">
      <div className="bg-gray-50 p-3 rounded-md">
        <h4 className="text-sm font-medium mb-1">Original Message</h4>
        <p className="text-sm text-gray-700">
          {engagement.type === "message" ? engagement.data.message : "No message content"}
        </p>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-sm font-medium">AI-Generated Responses</h4>
        <p className="text-xs text-gray-500">Select a template to use or customize</p>
        
        {suggestionTemplates.map((template, index) => (
          <div key={index} className="border rounded-md overflow-hidden">
            <div className="bg-white px-3 py-2 border-b">
              <h5 className="text-sm font-medium">{template.title}</h5>
            </div>
            <div className="p-3 bg-white">
              <p className="text-sm text-gray-700 whitespace-pre-line">{template.content}</p>
            </div>
            <div className="bg-gray-50 p-2 flex justify-end gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <Edit className="h-3.5 w-3.5 mr-1" />
                <span>Edit</span>
              </Button>
              <Button size="sm" className="h-8">
                <Send className="h-3.5 w-3.5 mr-1" />
                <span>Use</span>
              </Button>
            </div>
          </div>
        ))}
        
        <div className="pt-2">
          <Button className="w-full bg-[#135341] hover:bg-[#09261E]">
            <Brain className="h-4 w-4 mr-2" />
            <span>Generate Custom Response</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Property Detail View component for the right panel
function PropertyDetailView({ 
  property, 
  engagements, 
  onViewBuyer 
}: { 
  property: typeof mockProperties[0]; 
  engagements: typeof mockEngagements;
  onViewBuyer: (id: string) => void;
}) {
  // Engagement metrics
  const views = engagements.filter(e => e.type === "view").length;
  const saves = engagements.filter(e => e.type === "save").length;
  const messages = engagements.filter(e => e.type === "message").length;
  const offers = engagements.filter(e => e.type === "offer").length;
  const newMessages = engagements.filter(e => e.type === "message" && e.status === "new").length;
  const newOffers = engagements.filter(e => e.type === "offer" && e.status === "new").length;
  
  // Save to offer conversion rate
  const saveToOfferRate = saves > 0 ? Math.round((offers / saves) * 100) : 0;
  
  // Response rate
  const responseRate = calculateResponseRate(engagements);
  
  // Unique buyers
  const uniqueBuyerIds = Array.from(new Set(engagements.map(e => e.buyerId)));
  const uniqueBuyers = uniqueBuyerIds.map(id => getBuyerById(id)).filter(Boolean);
  
  // Sort engagements by timestamp (newest first)
  const sortedEngagements = [...engagements].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return (
    <div className="h-full overflow-y-auto p-4">
      {/* Property header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
          <img 
            src={property.image} 
            alt={property.title} 
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="flex-grow">
          <h2 className="text-xl font-semibold">{property.title}</h2>
          <p className="text-gray-600">{property.address}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-sm">
              {formatCurrency(property.price)}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {property.status}
            </Badge>
          </div>
          
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Share2 className="h-4 w-4" />
              <span>Share Listing</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Edit className="h-4 w-4" />
              <span>Edit Details</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Engagement summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-100 mr-3">
                  <Eye className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Views</p>
                  <p className="text-xl font-bold">{views}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                Last 30 days
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-amber-100 mr-3">
                  <Bookmark className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Saves</p>
                  <p className="text-xl font-bold">{saves}</p>
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                <span>12%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 mr-3">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Messages</p>
                  <p className="text-xl font-bold">{messages}</p>
                </div>
              </div>
              {newMessages > 0 && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  {newMessages} new
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 mr-3">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Offers</p>
                  <p className="text-xl font-bold">{offers}</p>
                </div>
              </div>
              {newOffers > 0 && (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {newOffers} new
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Save to offer conversion */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Save to Offer Conversion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Bookmark className="h-4 w-4 text-gray-400 mr-1.5" />
              <span className="text-sm text-gray-600">{saves} saves</span>
              <ArrowRight className="h-3 w-3 mx-1.5 text-gray-400" />
              <DollarSign className="h-4 w-4 text-gray-400 mr-1.5" />
              <span className="text-sm text-gray-600">{offers} offers</span>
            </div>
            <Badge variant={saveToOfferRate >= 30 ? "default" : "secondary"} className="text-xs">
              {saveToOfferRate}%
            </Badge>
          </div>
          
          <Progress value={saveToOfferRate} max={100} className="h-2" />
          
          {saves > offers && (
            <Alert variant="default" className="bg-amber-50 border-amber-200 mt-3">
              <Zap className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-sm font-medium text-amber-800">Opportunity</AlertTitle>
              <AlertDescription className="text-xs text-amber-700">
                {saves - offers} buyer{saves - offers > 1 ? 's' : ''} saved this property but haven't made an offer yet.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      {/* Engaged buyers */}
      {uniqueBuyers.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Engaged Buyers ({uniqueBuyers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uniqueBuyers.map(buyer => {
                if (!buyer) return null;
                
                // Get buyer's engagements with this property
                const buyerEngagements = engagements.filter(e => e.buyerId === buyer.id)
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                
                const latestEngagement = buyerEngagements[0];
                
                return (
                  <div key={buyer.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <Avatar 
                        className="h-10 w-10 mr-3 cursor-pointer"
                        onClick={() => onViewBuyer(buyer.id)}
                      >
                        <AvatarFallback className="bg-blue-100 text-blue-800">
                          {buyer.name ? buyer.name.charAt(0) : '?'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium text-gray-800 mr-2">{buyer.name}</p>
                          <div className="flex gap-1">
                            {buyer.tags?.map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-[10px] px-1 py-0 h-4">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500 mt-0.5">
                          {latestEngagement.type === "view" && (
                            <>
                              <Eye className="h-3 w-3 text-blue-500 mr-1" />
                              <span>Viewed {formatDate(latestEngagement.timestamp)}</span>
                            </>
                          )}
                          {latestEngagement.type === "save" && (
                            <>
                              <Bookmark className="h-3 w-3 text-amber-500 mr-1" />
                              <span>Saved {formatDate(latestEngagement.timestamp)}</span>
                            </>
                          )}
                          {latestEngagement.type === "message" && (
                            <>
                              <MessageCircle className="h-3 w-3 text-green-500 mr-1" />
                              <span>Messaged {formatDate(latestEngagement.timestamp)}</span>
                            </>
                          )}
                          {latestEngagement.type === "offer" && (
                            <>
                              <DollarSign className="h-3 w-3 text-purple-500 mr-1" />
                              <span>Offered {formatCurrency(latestEngagement.data.amount)} on {formatDate(latestEngagement.timestamp)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => onViewBuyer(buyer.id)}
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>Profile</span>
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Activity Feed */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Activity Timeline</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter By Type</DropdownMenuLabel>
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                <span>Views</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bookmark className="h-4 w-4 mr-2" />
                <span>Saves</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageCircle className="h-4 w-4 mr-2" />
                <span>Messages</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DollarSign className="h-4 w-4 mr-2" />
                <span>Offers</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedEngagements.slice(0, 5).map((engagement) => {
              const buyer = getBuyerById(engagement.buyerId);
              if (!buyer) return null;
              
              return (
                <div key={engagement.id} className="flex gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-gray-100">
                        {buyer.name ? buyer.name.charAt(0) : '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute top-6 left-3.5 h-full w-0.5 bg-gray-100" />
                  </div>
                  
                  <div className="flex-grow pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">{buyer.name}</p>
                        <p className="text-xs text-gray-500">{formatDate(engagement.timestamp)}</p>
                      </div>
                      
                      {engagement.status === "new" && (
                        <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                          New
                        </Badge>
                      )}
                    </div>
                    
                    <div className="mt-1.5">
                      {engagement.type === "view" && (
                        <div className="text-sm text-gray-600 flex items-center">
                          <Eye className="h-3.5 w-3.5 text-blue-500 mr-1.5" />
                          <span>Viewed this property</span>
                          {engagement.data.duration && (
                            <span className="text-xs text-gray-500 ml-1.5">
                              ({Math.floor(engagement.data.duration / 60)} min)
                            </span>
                          )}
                        </div>
                      )}
                      
                      {engagement.type === "save" && (
                        <div className="text-sm text-gray-600 flex items-center">
                          <Bookmark className="h-3.5 w-3.5 text-amber-500 mr-1.5" />
                          <span>Saved this property</span>
                        </div>
                      )}
                      
                      {engagement.type === "message" && (
                        <div>
                          <div className="text-sm text-gray-600 flex items-center">
                            <MessageCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                            <span>Sent a message</span>
                          </div>
                          
                          {engagement.data.message && (
                            <div className="mt-1.5 pl-5">
                              <p className="text-sm bg-gray-50 p-2 rounded-md border border-gray-100">
                                {engagement.data.message.length > 120 
                                  ? engagement.data.message.substring(0, 120) + "..." 
                                  : engagement.data.message
                                }
                              </p>
                              <div className="flex justify-end mt-1.5">
                                <Button variant="outline" size="sm" className="h-7 text-xs mr-2">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  <span>AI Respond</span>
                                </Button>
                                <Button size="sm" className="h-7 text-xs bg-[#135341] hover:bg-[#09261E]">
                                  <CornerDownRight className="h-3 w-3 mr-1" />
                                  <span>Reply</span>
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {engagement.type === "offer" && (
                        <div>
                          <div className="text-sm text-gray-600 flex items-center">
                            <DollarSign className="h-3.5 w-3.5 text-purple-500 mr-1.5" />
                            <span>Made an offer of {formatCurrency(engagement.data.amount)}</span>
                          </div>
                          
                          {engagement.data.contingencies && (
                            <div className="mt-1.5 pl-5">
                              <div className="flex items-center text-xs text-gray-500 gap-1.5">
                                <span>Contingencies:</span>
                                <div className="flex flex-wrap gap-1">
                                  {engagement.data.contingencies.map((cont: string, i: number) => (
                                    <Badge key={i} variant="outline" className="text-[10px] h-4 px-1">
                                      {cont}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-end mt-1.5">
                                <Button variant="secondary" size="sm" className="h-7 text-xs mr-2">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  <span>Decline</span>
                                </Button>
                                <Button size="sm" className="h-7 text-xs bg-[#135341] hover:bg-[#09261E]">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  <span>Accept</span>
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {sortedEngagements.length > 5 && (
            <Button variant="outline" className="w-full mt-2 text-sm" size="sm">
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              <span>Load More Activity</span>
            </Button>
          )}
        </CardContent>
      </Card>
      
      {/* Smart Nudges */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Smart Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {views > 0 && saves === 0 && (
              <Alert variant="default" className="bg-blue-50 border-blue-200">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-sm font-medium text-blue-800">High Views, No Saves</AlertTitle>
                <AlertDescription className="text-xs text-blue-700">
                  This property has {views} views but no saves. Consider updating the listing with better photos or adjusting the price.
                </AlertDescription>
              </Alert>
            )}
            
            {newMessages > 0 && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <MessageCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-sm font-medium text-green-800">Unread Messages</AlertTitle>
                <AlertDescription className="text-xs text-green-700">
                  You have {newMessages} unread message{newMessages > 1 ? 's' : ''}. Fast responses improve your conversion rate.
                </AlertDescription>
              </Alert>
            )}
            
            {newOffers > 0 && (
              <Alert variant="default" className="bg-purple-50 border-purple-200">
                <DollarSign className="h-4 w-4 text-purple-600" />
                <AlertTitle className="text-sm font-medium text-purple-800">New Offers</AlertTitle>
                <AlertDescription className="text-xs text-purple-700">
                  You have {newOffers} new offer{newOffers > 1 ? 's' : ''} to review. Timely responses can help close deals faster.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* AI Assistant CTA */}
      <div className="sticky bottom-6 right-6 flex justify-end">
        <Button className="bg-[#135341] hover:bg-[#09261E] rounded-full h-12 px-4 shadow-lg">
          <Sparkles className="h-5 w-5 mr-2" />
          <span>AI Assistant</span>
        </Button>
      </div>
    </div>
  );
}

// Main component
export default function EngagementZillowPage() {
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedBuyerId, setSelectedBuyerId] = useState<string | null>(null);
  const [selectedAIEngagementId, setSelectedAIEngagementId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filterProperty, setFilterProperty] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();
  
  // Get all properties and engagements
  const allProperties = mockProperties;
  const allEngagements = mockEngagements;
  
  // Get engagements by property
  const engagementsByProperty: { [key: string]: typeof mockEngagements } = {};
  
  mockProperties.forEach(property => {
    const propertyEngagements = mockEngagements.filter(e => e.propertyId === property.id);
    if (propertyEngagements.length > 0) {
      engagementsByProperty[property.id] = propertyEngagements;
    }
  });
  
  // Set initial property selection
  // If none selected, select first property with engagements
  React.useEffect(() => {
    if (!selectedPropertyId && Object.keys(engagementsByProperty).length > 0) {
      setSelectedPropertyId(Object.keys(engagementsByProperty)[0]);
    }
  }, [selectedPropertyId, engagementsByProperty]);
  
  // Handle view buyer profile
  const handleViewBuyer = (buyerId: string) => {
    setSelectedBuyerId(buyerId);
  };
  
  // Handle close buyer profile
  const handleCloseBuyerProfile = () => {
    setSelectedBuyerId(null);
  };
  
  // Handle AI assistant
  const handleUseAI = (engagementId: string) => {
    setSelectedAIEngagementId(engagementId);
  };
  
  // Handle close AI assistant
  const handleCloseAIAssistant = () => {
    setSelectedAIEngagementId(null);
  };
  
  // Compute engagement numbers for quick stats
  const totalViews = allEngagements.filter(e => e.type === "view").length;
  const totalOffers = allEngagements.filter(e => e.type === "offer").length;
  const totalUnreadMessages = allEngagements.filter(e => e.type === "message" && e.status === "new").length;
  const totalSaves = allEngagements.filter(e => e.type === "save").length;
  
  // Calculate response rate
  const responseRate = calculateResponseRate(allEngagements);
  
  // Get selected property and its engagements
  const selectedProperty = selectedPropertyId 
    ? allProperties.find(p => p.id === selectedPropertyId) 
    : null;
  
  const selectedPropertyEngagements = selectedPropertyId 
    ? engagementsByProperty[selectedPropertyId] || [] 
    : [];
  
  // Get the selected buyer
  const selectedBuyer = selectedBuyerId ? getBuyerById(selectedBuyerId) : null;
  
  // Get the selected engagement
  const selectedAIEngagement = selectedAIEngagementId 
    ? allEngagements.find(e => e.id === selectedAIEngagementId) 
    : null;
  
  // Filter properties based on criteria
  const filteredProperties = useMemo(() => {
    let properties = [...allProperties];
    
    // Only show properties with engagements
    properties = properties.filter(p => engagementsByProperty[p.id]);
    
    if (filterProperty) {
      properties = properties.filter(p => p.id === filterProperty);
    }
    
    return properties;
  }, [allProperties, filterProperty]);
  
  return (
    <SellerDashboardLayout>
      <div className="flex flex-col h-[calc(100vh-60px)]">
        {/* Top Bar - Stats and Filters */}
        <div className="border-b p-4 bg-transparent">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Engagements</h1>
            
            <div className="flex items-center gap-2">
              {/* Filter Dropdown */}
              <Select>
                <SelectTrigger className="w-[210px] h-9 bg-[#135341] text-white hover:bg-[#09261E] border-none">
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter Engagement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lifetime">Lifetime Total</SelectItem>
                  <SelectItem value="last7">Past 7 Days</SelectItem>
                  <SelectItem value="last30">Past 30 Days</SelectItem>
                  <SelectItem value="property-avg">Property Averages</SelectItem>
                  <SelectItem value="by-property">By Property</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Stats Cards - 5 animated metric cards with insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {/* Views Card */}
            <Card className="shadow-sm border overflow-hidden group hover:shadow-md transition-all duration-300">
              <CardContent className="p-4 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500">
                  <Eye className="h-7 w-7 text-blue-400 opacity-70" />
                </div>
                
                <div className="relative">
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-500">Views</p>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold">{totalViews}</span>
                      <div className="flex items-center ml-2 text-emerald-600">
                        <ArrowUpRight className="h-4 w-4" />
                        <span className="text-xs">12%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <p>Average 4 views per property</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Saves Card */}
            <Card className="shadow-sm border overflow-hidden group hover:shadow-md transition-all duration-300">
              <CardContent className="p-4 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500">
                  <Bookmark className="h-7 w-7 text-amber-400 opacity-70" />
                </div>
                
                <div className="relative">
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-500">Saves</p>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold">{totalSaves}</span>
                      <div className="flex items-center ml-2 text-emerald-600">
                        <ArrowUpRight className="h-4 w-4" />
                        <span className="text-xs">5%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <p>Average 2 saves per property</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Offers Card */}
            <Card 
              className="shadow-sm border overflow-hidden group hover:shadow-md transition-all duration-300 cursor-pointer"
              onClick={() => {
                // Open offers inbox modal here
                toast({
                  title: "Offers Inbox",
                  description: "This would open the Offers Inbox popup",
                  variant: "default",
                });
              }}
            >
              <CardContent className="p-4 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full flex items-center justify-center transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500">
                  <DollarSign className="h-7 w-7 text-green-400 opacity-70" />
                </div>
                
                <div className="relative">
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-500">Offers</p>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold">{totalOffers}</span>
                      <div className="flex items-center ml-2 text-emerald-600">
                        <ArrowUpRight className="h-4 w-4" />
                        <span className="text-xs">20%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <span className="text-xs text-gray-500">Click to open Offers Inbox</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Unread Messages Card */}
            <Card className="shadow-sm border overflow-hidden group hover:shadow-md transition-all duration-300">
              <CardContent className="p-4 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500">
                  <MessageCircle className="h-7 w-7 text-purple-400 opacity-70" />
                </div>
                
                <div className="relative">
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-500">Unread Messages</p>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold">{totalUnreadMessages}</span>
                      {totalUnreadMessages > 0 && (
                        <Badge className="ml-2 text-[10px] bg-red-500 text-white">New</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <p>Respond to improve conversion</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Response Rate Card */}
            <Card className="shadow-sm border overflow-hidden group hover:shadow-md transition-all duration-300">
              <CardContent className="p-4 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500">
                  <MailCheck className="h-7 w-7 text-indigo-400 opacity-70" />
                </div>
                
                <div className="relative">
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-500">Response Rate</p>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold">{responseRate}%</span>
                      <div className="flex items-center ml-2 text-amber-600">
                        <span className="text-xs">Avg: 2.5h</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pr-2">
                    <div className="relative">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full group-hover:bg-indigo-500 transition-colors duration-300"
                          style={{ width: `${responseRate}%` }}
                        ></div>
                      </div>
                      <div className="text-[10px] text-gray-500 flex justify-between mt-1">
                        <span>Industry avg: 35%</span>
                        <span>Goal: 80%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Filters section removed - will be built separately */}
        </div>
        
        {/* Main Content - Split View */}
        <div className="flex-grow flex overflow-hidden">
          {/* Left Column - Property List */}
          <div className="w-1/3 border-r overflow-y-auto p-4">
            {/* Search and Filter Bar */}
            <div className="mb-4 space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search property address..." 
                  className="w-full h-9 pl-9 pr-3 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#135341] focus:border-transparent"
                />
              </div>
              
              {/* Filters Row */}
              <div className="flex gap-2">
                {/* Status Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1 h-9 text-sm">
                      <Filter className="h-3.5 w-3.5 text-gray-500" />
                      <span>Filter</span>
                      <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-40">
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      New
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      Replied
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                      Unread
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Sort Dropdown */}
                <Select value="recent" onValueChange={() => {}}>
                  <SelectTrigger className="h-9 text-sm flex-grow">
                    <SelectValue placeholder="Sort by: Most Recent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent Activity</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="needs-response">Needs Response</SelectItem>
                    <SelectItem value="price_high">Price (High to Low)</SelectItem>
                    <SelectItem value="price_low">Price (Low to High)</SelectItem>
                    <SelectItem value="views">Most Views</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-medium">Properties ({filteredProperties.length})</h2>
            </div>
            
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                engagements={engagementsByProperty[property.id] || []}
                isSelected={selectedPropertyId === property.id}
                onSelect={() => setSelectedPropertyId(property.id)}
              />
            ))}
            
            {filteredProperties.length === 0 && (
              <div className="border border-dashed rounded-lg p-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">No matching properties</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Try changing your filters or check back later for new engagement activity.
                </p>
              </div>
            )}
          </div>
          
          {/* Right Column - Property Detail */}
          <div className="w-2/3 overflow-y-auto">
            {selectedProperty ? (
              <PropertyDetailView 
                property={selectedProperty} 
                engagements={selectedPropertyEngagements}
                onViewBuyer={handleViewBuyer}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md p-6">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">Select a property</h3>
                  <p className="text-gray-500">
                    Choose a property from the list to view detailed engagement analytics, messages, and buyer activity.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Buyer profile sidebar */}
      <Sheet open={selectedBuyerId !== null} onOpenChange={handleCloseBuyerProfile}>
        <SheetContent className="sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="text-left p-4 border-b">
            <SheetTitle>Buyer Profile</SheetTitle>
          </SheetHeader>
          <div className="flex-grow overflow-auto">
            {selectedBuyer && (
              <BuyerProfile buyer={selectedBuyer} />
            )}
          </div>
        </SheetContent>
      </Sheet>
      
      {/* AI Assistant sidebar */}
      <Sheet open={selectedAIEngagementId !== null} onOpenChange={handleCloseAIAssistant}>
        <SheetContent className="sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="text-left p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <SheetTitle>AI Assistant</SheetTitle>
                <SheetDescription>Smart response suggestions</SheetDescription>
              </div>
            </div>
          </SheetHeader>
          <div className="flex-grow overflow-auto">
            {selectedAIEngagement && (
              <AIMessageSuggestions engagement={selectedAIEngagement} />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </SellerDashboardLayout>
  );
}