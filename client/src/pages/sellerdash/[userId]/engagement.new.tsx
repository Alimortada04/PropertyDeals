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
} from "lucide-react";
import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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

// Buyer profile component
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

// Property engagement block component
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
  saveToOfferRate,
}: PropertyEngagementBlockProps) {
  const [expanded, setExpanded] = useState(true);
  
  // Group engagements by type
  const views = engagements.filter(e => e.type === "view");
  const saves = engagements.filter(e => e.type === "save");
  const messages = engagements.filter(e => e.type === "message");
  const offers = engagements.filter(e => e.type === "offer");
  
  // Need attention: new messages and offers
  const newMessages = messages.filter(e => e.status === "new");
  const newOffers = offers.filter(e => e.status === "new");
  
  // Check if there are saves without offers
  const saveWithoutOffer = saves.length > offers.length;
  
  // Sort engagements by timestamp (newest first)
  const sortedEngagements = [...engagements].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Get unique buyers
  const uniqueBuyerIds = Array.from(new Set(engagements.map(e => e.buyerId)));
  const uniqueBuyers = uniqueBuyerIds.map(id => getBuyerById(id)).filter(Boolean);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-start gap-3">
            <div className="h-14 w-14 relative rounded-md overflow-hidden">
              <img 
                src={property.image} 
                alt={property.title}
                className="h-full w-full object-cover" 
              />
            </div>
            <div>
              <CardTitle className="text-base">{property.title}</CardTitle>
              <CardDescription className="text-sm">
                {property.address}
              </CardDescription>
              <div className="flex items-center gap-1 mt-1">
                <Badge variant="outline" className="text-xs h-5">
                  ${property.price.toLocaleString()}
                </Badge>
                <Badge variant="outline" className="text-xs h-5 bg-blue-50 text-blue-700 border-blue-200">
                  {property.status}
                </Badge>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="pt-0">
          {/* Engagement stats */}
          <div className="flex flex-wrap gap-3 mt-2">
            <div className="bg-gray-100 rounded-md py-1.5 px-3 flex items-center">
              <Eye className="h-4 w-4 text-gray-600 mr-1.5" />
              <span className="text-sm font-medium">{views.length}</span>
              <span className="text-xs text-gray-500 ml-1">Views</span>
            </div>
            
            <div className="bg-gray-100 rounded-md py-1.5 px-3 flex items-center">
              <Bookmark className="h-4 w-4 text-gray-600 mr-1.5" />
              <span className="text-sm font-medium">{saves.length}</span>
              <span className="text-xs text-gray-500 ml-1">Saves</span>
            </div>
            
            <div className="bg-gray-100 rounded-md py-1.5 px-3 flex items-center">
              <MessageCircle className="h-4 w-4 text-gray-600 mr-1.5" />
              <span className="text-sm font-medium">{messages.length}</span>
              <span className="text-xs text-gray-500 ml-1">Messages</span>
              {newMessages.length > 0 && (
                <Badge className="ml-1.5 h-5 px-1 text-xs">
                  {newMessages.length} new
                </Badge>
              )}
            </div>
            
            <div className="bg-gray-100 rounded-md py-1.5 px-3 flex items-center">
              <DollarSign className="h-4 w-4 text-gray-600 mr-1.5" />
              <span className="text-sm font-medium">{offers.length}</span>
              <span className="text-xs text-gray-500 ml-1">Offers</span>
              {newOffers.length > 0 && (
                <Badge className="ml-1.5 h-5 px-1 text-xs">
                  {newOffers.length} new
                </Badge>
              )}
            </div>
          </div>
          
          <div className="mt-4 space-y-4">
            {/* Save to offer conversion card */}
            <div className="rounded-md border p-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Save to Offer Conversion</h3>
                <Badge variant={saveToOfferRate >= 30 ? "default" : "secondary"} className="text-xs">
                  {saveToOfferRate}%
                </Badge>
              </div>
              
              <div className="mt-2">
                <Progress value={saveToOfferRate} max={100} className="h-2" />
              </div>
              
              {saveWithoutOffer && (
                <Alert variant="outline" className="bg-amber-50 border-amber-200 mt-3">
                  <Zap className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-sm font-medium text-amber-800">Opportunity</AlertTitle>
                  <AlertDescription className="text-xs text-amber-700">
                    {saves.length - offers.length} buyer{saves.length - offers.length > 1 ? 's' : ''} saved this property but haven't made an offer yet.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            {/* Recent engagements section */}
            <div>
              <h3 className="text-sm font-medium mb-3">Recent Activity</h3>
              <div className="space-y-2.5">
                {sortedEngagements.slice(0, 5).map((engagement) => {
                  const buyer = getBuyerById(engagement.buyerId);
                  if (!buyer) return null;
                  
                  return (
                    <div key={engagement.id} className="flex items-start gap-3 pb-2.5 border-b border-gray-100">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                          {buyer.name ? buyer.name.charAt(0) : '?'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium hover:underline cursor-pointer" onClick={() => onViewBuyer(buyer.id)}>
                              {buyer.name}
                            </span>
                            {buyer.tags && buyer.tags.includes("Investor") && (
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-[10px] h-4 px-1">
                                Investor
                              </Badge>
                            )}
                            {buyer.tags && buyer.tags.includes("REP Verified") && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] h-4 px-1">
                                REP Verified
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(engagement.timestamp)}</span>
                        </div>
                        
                        <div className="flex items-center mt-1">
                          {engagement.type === "view" && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Eye className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                              <span>Viewed this property</span>
                              {engagement.data.duration && (
                                <span className="text-xs text-gray-500 ml-1.5">
                                  ({Math.floor(engagement.data.duration / 60)} min)
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
                              {engagement.data.message && (
                                <div className="mt-1.5 pl-5">
                                  <p className="text-sm bg-gray-50 p-2 rounded-md border border-gray-100">
                                    {engagement.data.message.length > 120 
                                      ? engagement.data.message.substring(0, 120) + "..." 
                                      : engagement.data.message
                                    }
                                  </p>
                                  <div className="flex justify-end mt-1.5">
                                    <Button 
                                      variant="outline" 
                                      className="h-7 text-xs gap-1"
                                      onClick={() => onUseAI(engagement.id)}
                                    >
                                      <Sparkles className="h-3 w-3" />
                                      <span>AI Response</span>
                                    </Button>
                                    <Button className="ml-2 h-7 text-xs gap-1 bg-[#135341] hover:bg-[#09261E]">
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
                                <span>Made an offer of {formatCurrency(engagement.data.amount)}</span>
                                {engagement.status === "new" && (
                                  <Badge variant="outline" className="ml-2 text-[10px] h-4 px-1 bg-purple-50 text-purple-700 border-purple-200">
                                    New
                                  </Badge>
                                )}
                              </div>
                              {engagement.data.contingencies && (
                                <div className="mt-1.5 pl-5">
                                  <div className="flex items-center text-xs text-gray-500 gap-1.5">
                                    <span>Contingencies:</span>
                                    <div className="flex flex-wrap gap-1">
                                      {engagement.data.contingencies.map((cont, i) => (
                                        <Badge key={i} variant="outline" className="text-[10px] h-4 px-1">
                                          {cont}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="flex justify-end mt-1.5">
                                    <Button variant="secondary" className="h-7 text-xs">
                                      <XCircle className="h-3 w-3 mr-1" />
                                      <span>Decline</span>
                                    </Button>
                                    <Button className="ml-2 h-7 text-xs bg-[#135341] hover:bg-[#09261E]">
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
                <Button variant="ghost" className="w-full mt-2 text-xs text-gray-500">
                  View All ({sortedEngagements.length}) Activities
                </Button>
              )}
            </div>
            
            {/* Engaged buyers section */}
            {uniqueBuyers.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Engaged Buyers ({uniqueBuyers.length})</h3>
                <div className="flex flex-wrap gap-2 items-center mb-2">
                  <TooltipProvider>
                    {uniqueBuyers.slice(0, 8).map((buyer) => {
                      if (!buyer) return null;
                      
                      return (
                        <Tooltip key={buyer.id}>
                          <TooltipTrigger asChild>
                            <Avatar 
                              className="h-9 w-9 border-2 border-white cursor-pointer hover:ring-2 hover:ring-gray-200 transition-all"
                              onClick={() => onViewBuyer(buyer.id)}
                            >
                              <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                                {buyer.name ? buyer.name.charAt(0) : '?'}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="bg-black/90 text-white border-0 p-3">
                            <div className="space-y-1">
                              <p className="font-medium">{buyer.name}</p>
                              <div className="flex items-center gap-1.5 text-xs">
                                <div className="rounded-full bg-blue-100 p-1">
                                  <Eye className="h-3 w-3 text-blue-600" />
                                </div>
                                <span>{buyer.viewHistory?.length || 0} views</span>
                              </div>
                              {buyer.interests && buyer.interests.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {buyer.interests.slice(0, 2).map((tag, i) => (
                                    <Badge key={i} variant="outline" className="bg-gray-800/90 text-gray-200 border-gray-700 text-[10px] px-1 py-0">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </TooltipProvider>
                  
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
          
          <div className="flex justify-end mt-4">
            <Button variant="outline" className="text-xs gap-1" onClick={() => {}}>
              <PanelRight className="h-3.5 w-3.5" />
              <span>View Property Roadmap</span>
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function EngagementPage() {
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEngagementId, setSelectedEngagementId] = useState<string | null>(null);
  const [selectedBuyerId, setSelectedBuyerId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPropertyId, setFilterPropertyId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedAIEngagementId, setSelectedAIEngagementId] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();
  
  // Get all properties for this seller
  const allProperties = mockProperties;
  
  // Get engagements by property
  const engagementsByProperty: { [key: string]: typeof mockEngagements } = {};
  
  mockProperties.forEach(property => {
    const propertyEngagements = mockEngagements.filter(e => e.propertyId === property.id);
    if (propertyEngagements.length > 0) {
      engagementsByProperty[property.id] = propertyEngagements;
    }
  });
  
  // Track property engagement block expansion
  const [expandedProperties, setExpandedProperties] = useState<string[]>(
    Object.keys(engagementsByProperty)
  );
  
  // Calculate response rate
  const responseRate = calculateResponseRate(mockEngagements);
  
  // Handle selecting a buyer
  const handleViewBuyer = (buyerId: string) => {
    setSelectedBuyerId(buyerId);
  };
  
  // Handle using AI
  const handleUseAI = (engagementId: string) => {
    setSelectedAIEngagementId(engagementId);
  };
  
  // Close buyer profile
  const handleCloseBuyerProfile = () => {
    setSelectedBuyerId(null);
  };
  
  // Close AI assistant
  const handleCloseAIAssistant = () => {
    setSelectedAIEngagementId(null);
  };
  
  // Filter engagements
  const filteredProperties = useMemo(() => {
    let properties = [...allProperties];
    
    // Filter by property
    if (filterPropertyId) {
      properties = properties.filter(p => p.id === filterPropertyId);
    }
    
    return properties;
  }, [allProperties, filterPropertyId]);
  
  // Compute engagement numbers for quick stats
  const totalViews = mockEngagements.filter(e => e.type === "view").length;
  const totalOffers = mockEngagements.filter(e => e.type === "offer").length;
  const totalUnreadMessages = mockEngagements.filter(e => e.type === "message" && e.status === "new").length;
  
  // Get the selected buyer
  const selectedBuyer = selectedBuyerId ? getBuyerById(selectedBuyerId) : null;
  
  // Get the selected engagement
  const selectedAIEngagement = selectedAIEngagementId ? mockEngagements.find(e => e.id === selectedAIEngagementId) : null;
  
  return (
    <SellerDashboardLayout>
      <div className="py-6">
        <div className="flex flex-col space-y-6">
          {/* Page header with title and actions */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Engagements</h1>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Sliders className="h-3.5 w-3.5" />
                    <span>View</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Display Options</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => {}}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    <span>Show Buyer Activity Level</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {}}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    <span>Show Property Images</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button className="bg-[#135341] hover:bg-[#09261E] gap-1.5">
                <CalendarPlus className="h-4 w-4" />
                <span>Schedule Follow-up</span>
              </Button>
            </div>
          </div>
          
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Property Views</p>
                    <h3 className="text-2xl font-bold">{totalViews}</h3>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-xs text-gray-500">
                  <ArrowUpRight className="h-3.5 w-3.5 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">12%</span>
                  <span className="ml-1">from last week</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="bg-amber-100 p-3 rounded-lg mr-4">
                    <DollarSign className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Offers Received</p>
                    <h3 className="text-2xl font-bold">{totalOffers}</h3>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full"
                      style={{ width: `${totalOffers > 0 ? (totalOffers / totalViews) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-gray-500">{totalOffers > 0 ? Math.round((totalOffers / totalViews) * 100) : 0}% conversion</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Unread Messages</p>
                    <h3 className="text-2xl font-bold">{totalUnreadMessages}</h3>
                  </div>
                </div>
                {totalUnreadMessages > 0 && (
                  <div className="mt-4">
                    <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800 py-2">
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-xs">
                        Respond quickly to improve your response rate.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <Percent className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Response Rate</p>
                    <h3 className="text-2xl font-bold">{responseRate}%</h3>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-gray-500">Goal: 90%</span>
                    <span className={responseRate >= 90 ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                      {responseRate >= 90 ? "Excellent" : "Needs Improvement"}
                    </span>
                  </div>
                  <Progress value={responseRate} max={100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Filters */}
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-wrap gap-4">
                <div className="w-full md:w-64">
                  <Label htmlFor="property-filter" className="text-xs font-medium mb-1.5 block">Property</Label>
                  <Select
                    value={filterPropertyId || "all"}
                    onValueChange={(value) => setFilterPropertyId(value === "all" ? null : value)}
                  >
                    <SelectTrigger id="property-filter" className="h-9 text-sm">
                      <SelectValue placeholder="All Properties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Properties</SelectItem>
                      {allProperties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.address.split(',')[0]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-48">
                  <Label htmlFor="type-filter" className="text-xs font-medium mb-1.5 block">Engagement Type</Label>
                  <Select
                    value={filterType || "all"}
                    onValueChange={(value) => setFilterType(value === "all" ? null : value)}
                  >
                    <SelectTrigger id="type-filter" className="h-9 text-sm">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="view">Views</SelectItem>
                      <SelectItem value="save">Saves</SelectItem>
                      <SelectItem value="message">Messages</SelectItem>
                      <SelectItem value="offer">Offers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-48">
                  <Label htmlFor="status-filter" className="text-xs font-medium mb-1.5 block">Status</Label>
                  <Select
                    value={filterStatus || "all"}
                    onValueChange={(value) => setFilterStatus(value === "all" ? null : value)}
                  >
                    <SelectTrigger id="status-filter" className="h-9 text-sm">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-grow flex items-end">
                  <Button variant="outline" className="h-9 gap-1.5 ml-auto" onClick={() => {
                    setFilterPropertyId(null);
                    setFilterStatus(null);
                    setFilterType(null);
                  }}>
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Clear Filters</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Main content - Property Engagement Blocks */}
          <div className="space-y-6">
            {filteredProperties.map((property) => (
              engagementsByProperty[property.id] && (
                <PropertyEngagementBlock 
                  key={property.id}
                  property={property}
                  engagements={engagementsByProperty[property.id]}
                  onViewBuyer={handleViewBuyer}
                  onUseAI={handleUseAI}
                  saveToOfferRate={Math.round(
                    (engagementsByProperty[property.id].filter(e => e.type === "offer").length / 
                     Math.max(1, engagementsByProperty[property.id].filter(e => e.type === "save").length)) * 100
                  )}
                />
              )
            ))}
            
            {filteredProperties.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No matching properties</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Try changing your filters or check back later for new engagement activity.
                  </p>
                </CardContent>
              </Card>
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