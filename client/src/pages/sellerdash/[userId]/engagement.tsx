import React, { useState } from "react";
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
  LucideIcon,
  Brain,
  Plus
} from "lucide-react";
import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

// Mock data for display purposes
const mockProperties = [
  {
    id: "p1",
    address: "456 Oak St, Madison, WI 53703",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop",
    price: 459000,
  },
  {
    id: "p2",
    address: "123 Main St, Milwaukee, WI 53201",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2670&auto=format&fit=crop",
    price: 425000,
  },
  {
    id: "p3",
    address: "890 Maple Ave, Milwaukee, WI 53211",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2670&auto=format&fit=crop",
    price: 385000,
  },
];

// Mock engagement data
const mockEngagements = [
  {
    id: "e1",
    propertyId: "p1",
    type: "offer",
    buyerId: "b1",
    buyerName: "John Smith",
    buyerImage: "",
    verified: true,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    status: "new",
    offerAmount: 395000,
    message: "I'm interested in this property and would like to make an offer of $395,000. Please let me know if this works for you.",
    aiScore: 0.85,
  },
  {
    id: "e2",
    propertyId: "p2",
    type: "message",
    buyerId: "b2",
    buyerName: "Sarah Johnson",
    buyerImage: "",
    verified: false,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    status: "replied",
    message: "Hi there, I'm curious about the property. Is it still available? Does it have a finished basement?",
    aiScore: 0.72,
  },
  {
    id: "e3",
    propertyId: "p3",
    type: "save",
    buyerId: "b3",
    buyerName: "Mike Williams",
    buyerImage: "",
    verified: false,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: "viewed",
    aiScore: 0.65,
  },
  {
    id: "e4",
    propertyId: "p1",
    type: "view",
    buyerId: "b4",
    buyerName: "Jessica Brown",
    buyerImage: "",
    verified: true,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: "viewed",
    viewCount: 5,
    aiScore: 0.58,
  },
  {
    id: "e5",
    propertyId: "p2",
    type: "offer",
    buyerId: "b5",
    buyerName: "David Lee",
    buyerImage: "",
    verified: true,
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    status: "accepted",
    offerAmount: 420000,
    message: "I'd like to make an offer of $420,000 for this beautiful property. I can close within 30 days.",
    aiScore: 0.92,
  },
];

// Mock CRM leads
const mockLeads = [
  {
    id: "l1",
    name: "Thomas Wilson",
    email: "thomas.wilson@example.com",
    phone: "555-123-4567",
    propertiesOfInterest: ["p1", "p3"],
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "nurturing",
    assignedRep: "rep1",
    tags: ["cash buyer", "investor"],
  },
  {
    id: "l2",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "555-987-6543",
    propertiesOfInterest: ["p2"],
    lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: "contacted",
    assignedRep: "",
    tags: ["first-time buyer"],
  },
  {
    id: "l3",
    name: "Robert Taylor",
    email: "robert.taylor@example.com",
    phone: "555-456-7890",
    propertiesOfInterest: ["p1", "p2", "p3"],
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: "new lead",
    assignedRep: "rep2",
    tags: ["broker", "multiple inquiries"],
  },
  {
    id: "l4",
    name: "Jennifer Martinez",
    email: "jennifer.martinez@example.com",
    phone: "555-789-0123",
    propertiesOfInterest: ["p3"],
    lastActivity: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: "followed up",
    assignedRep: "",
    tags: ["slow responder"],
  },
  {
    id: "l5",
    name: "Michael Anderson",
    email: "michael.anderson@example.com",
    phone: "555-234-5678",
    propertiesOfInterest: ["p2"],
    lastActivity: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    status: "dead",
    assignedRep: "rep1",
    tags: ["out-of-state"],
  },
];

// Mock email templates
const mockTemplates = [
  {
    id: "t1",
    name: "New Listing Announcement",
    category: "New Listing",
    subject: "New Off-Market Property Just Listed!",
    body: "Hi {Buyer Name},\n\nI wanted to let you know about a new property we just listed in {City}. It's a great investment opportunity with an ARV of {ARV} and an assignment price of only {Assignment Price}.\n\nCheck it out here: {Link}\n\nLet me know if you're interested in discussing further.\n\nBest regards,\n{Seller Name}",
  },
  {
    id: "t2",
    name: "Price Drop Alert",
    category: "Price Drop",
    subject: "Price Reduced on {Property Name}",
    body: "Hi {Buyer Name},\n\nGreat news! We've just reduced the price on {Property Name} in {City}. This property now has an even better ROI with the new assignment fee of {Assignment Price}.\n\nView the updated details: {Link}\n\nDon't miss this opportunity - price reductions tend to generate a lot of interest!\n\nBest regards,\n{Seller Name}",
  },
  {
    id: "t3",
    name: "Under Contract Notice",
    category: "Under Contract",
    subject: "Property Going Under Contract Soon - Last Chance",
    body: "Hi {Buyer Name},\n\nJust a heads up that {Property Name} in {City} is about to go under contract. If you're still interested, now is the time to act.\n\nView the property: {Link}\n\nWe're expecting to finalize the deal within 48 hours, so please let me know your decision as soon as possible.\n\nBest regards,\n{Seller Name}",
  },
  {
    id: "t4",
    name: "Final Call Reminder",
    category: "Final Call",
    subject: "FINAL CALL: Decision needed on {Property Name}",
    body: "Hi {Buyer Name},\n\nThis is the final call for {Property Name} in {City}. We have multiple offers and will be making a decision by the end of day.\n\nIf you'd like to secure this property, please let me know immediately.\n\nProperty details: {Link}\n\nThank you for your interest.\n\nBest regards,\n{Seller Name}",
  },
];

// Utility function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

// Utility function to get property by ID
const getPropertyById = (id: string) => {
  return mockProperties.find(property => property.id === id);
};

// Badge variants for different engagement types
const getEngagementBadge = (type: string) => {
  switch (type) {
    case "offer":
      return { icon: DollarSign, color: "bg-green-100 text-green-800" };
    case "message":
      return { icon: MessageCircle, color: "bg-blue-100 text-blue-800" };
    case "save":
      return { icon: Bookmark, color: "bg-purple-100 text-purple-800" };
    case "view":
      return { icon: Eye, color: "bg-gray-100 text-gray-800" };
    default:
      return { icon: Clock, color: "bg-gray-100 text-gray-800" };
  }
};

// Badge variants for different statuses
const getStatusBadge = (status: string) => {
  switch (status) {
    case "new":
      return { text: "New", color: "bg-green-600 text-white" };
    case "replied":
      return { text: "Replied", color: "bg-blue-600 text-white" };
    case "viewed":
      return { text: "Viewed", color: "bg-gray-600 text-white" };
    case "accepted":
      return { text: "Accepted", color: "bg-teal-600 text-white" };
    case "declined":
      return { text: "Declined", color: "bg-red-600 text-white" };
    default:
      return { text: status, color: "bg-gray-600 text-white" };
  }
};

// Badge variants for lead statuses
const getLeadStatusBadge = (status: string) => {
  switch (status) {
    case "new lead":
      return { text: "New Lead", color: "bg-green-600 text-white" };
    case "contacted":
      return { text: "Contacted", color: "bg-blue-600 text-white" };
    case "nurturing":
      return { text: "Nurturing", color: "bg-purple-600 text-white" };
    case "followed up":
      return { text: "Followed Up", color: "bg-yellow-600 text-white" };
    case "dead":
      return { text: "Dead", color: "bg-gray-600 text-white" };
    default:
      return { text: status, color: "bg-gray-600 text-white" };
  }
};

// Badge variants for template categories
const getTemplateCategoryBadge = (category: string) => {
  switch (category) {
    case "New Listing":
      return { text: category, color: "bg-green-100 text-green-800" };
    case "Price Drop":
      return { text: category, color: "bg-blue-100 text-blue-800" };
    case "Under Contract":
      return { text: category, color: "bg-yellow-100 text-yellow-800" };
    case "Final Call":
      return { text: category, color: "bg-red-100 text-red-800" };
    default:
      return { text: category, color: "bg-gray-100 text-gray-800" };
  }
};

// Active Engagement Card component
interface EngagementCardProps {
  engagement: any;
}

const EngagementCard: React.FC<EngagementCardProps> = ({ engagement }) => {
  const property = getPropertyById(engagement.propertyId);
  const { icon: EngagementIcon, color: engagementColor } = getEngagementBadge(engagement.type);
  const { text: statusText, color: statusColor } = getStatusBadge(engagement.status);
  const { toast } = useToast();
  
  // Handle actions
  const handleViewConversation = () => {
    // Implementation would navigate to conversation view
    console.log("View conversation for engagement:", engagement.id);
  };
  
  const handleAcceptOffer = () => {
    toast({
      title: "Offer Accepted",
      description: `You've accepted the offer of ${formatCurrency(engagement.offerAmount)}`,
    });
  };
  
  const handleCounterOffer = () => {
    // Implementation would open counter offer dialog
    console.log("Counter offer for engagement:", engagement.id);
  };
  
  const handleDeclineOffer = () => {
    toast({
      title: "Offer Declined",
      description: "The offer has been declined.",
    });
  };
  
  return (
    <Card className="mb-3 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Left: Property thumbnail */}
          <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
            <img 
              src={property?.image} 
              alt={property?.address} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Middle: Engagement details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-gray-800 truncate">{property?.address}</p>
              <Badge className={engagementColor + " px-2 py-0.5 text-xs"}>
                <EngagementIcon className="h-3 w-3 mr-1" />
                <span>{engagement.type.charAt(0).toUpperCase() + engagement.type.slice(1)}</span>
              </Badge>
              <Badge className={statusColor + " px-2 py-0.5 text-xs"}>
                {statusText}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs bg-gray-200">{engagement.buyerName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-700">{engagement.buyerName}</span>
              {engagement.verified && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs px-1 py-0">
                  <UserCheck className="h-3 w-3 mr-1" />
                  <span>Verified</span>
                </Badge>
              )}
            </div>
            
            {engagement.message && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{engagement.message}</p>
            )}
            
            {engagement.offerAmount && (
              <div className="mb-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <DollarSign className="h-3.5 w-3.5 mr-1" />
                  <span>{formatCurrency(engagement.offerAmount)}</span>
                </Badge>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDistanceToNow(engagement.timestamp, { addSuffix: true })}</span>
              
              {engagement.aiScore && (
                <div className="flex items-center ml-3">
                  <Brain className="h-3.5 w-3.5 mr-1 text-purple-600" />
                  <span className="text-purple-700 font-medium">{Math.round(engagement.aiScore * 100)}% Confidence</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Right: Actions */}
          <div className="flex flex-col gap-2">
            {engagement.type === 'message' && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-blue-700 border-blue-200 hover:bg-blue-50"
                onClick={handleViewConversation}
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
      </CardContent>
    </Card>
  );
};

// Lead Card Component
interface LeadCardProps {
  lead: any;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const { text: statusText, color: statusColor } = getLeadStatusBadge(lead.status);
  
  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
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
              <Badge key={propId} variant="outline" className="text-xs">
                {property?.address.split(',')[0]}
              </Badge>
            );
          })}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-gray-600">
          {formatDistanceToNow(lead.lastActivity, { addSuffix: true })}
        </div>
      </TableCell>
      <TableCell>
        <Badge className={statusColor + " px-2 py-0.5 text-xs"}>
          {statusText}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {lead.tags.map((tag: string) => (
            <Badge key={tag} variant="outline" className="bg-gray-100 text-gray-700 text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Mail className="h-4 w-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Phone className="h-4 w-4 text-green-600" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

// Template Card component
interface TemplateCardProps {
  template: any;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const { text: categoryText, color: categoryColor } = getTemplateCategoryBadge(template.category);
  const { toast } = useToast();

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
          <Badge className={categoryColor + " px-2 py-0.5"}>
            {categoryText}
          </Badge>
        </div>
        <CardDescription className="text-sm text-gray-600">{template.subject}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="bg-gray-50 rounded-md p-3 mb-3">
          <p className="text-sm text-gray-700 whitespace-pre-line line-clamp-3">{template.body}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button variant="ghost" size="sm">
          <PanelRight className="h-4 w-4 mr-1.5" />
          <span>Edit</span>
        </Button>
        <Button variant="default" size="sm" className="bg-[#135341] hover:bg-[#09261E]" onClick={handleUseTemplate}>
          <Send className="h-4 w-4 mr-1.5" />
          <span>Use Template</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main Engagement Page Component
export default function EngagementPage() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState<"active" | "proactive">("active");
  const [selectedProperty, setSelectedProperty] = useState<string | "all">("all");
  const [engagementType, setEngagementType] = useState<string | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter engagements based on filters
  const filteredEngagements = mockEngagements.filter(engagement => {
    // Filter by property
    if (selectedProperty !== "all" && engagement.propertyId !== selectedProperty) return false;
    
    // Filter by engagement type
    if (engagementType !== "all" && engagement.type !== engagementType) return false;
    
    // Search by buyer name or message content
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const matchesBuyer = engagement.buyerName.toLowerCase().includes(lowerQuery);
      const matchesMessage = engagement.message?.toLowerCase().includes(lowerQuery) || false;
      if (!matchesBuyer && !matchesMessage) return false;
    }
    
    return true;
  });
  
  // Count stats
  const unreadOffers = mockEngagements.filter(e => e.type === "offer" && e.status === "new").length;
  const newMessages = mockEngagements.filter(e => e.type === "message" && e.status === "new").length;
  
  return (
    <SellerDashboardLayout>
      <div className="py-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Engagement</h1>
            
            {/* Summary bar */}
            <div className="flex items-center space-x-2">
              {unreadOffers > 0 && (
                <Badge className="bg-green-600 text-white px-2.5 py-1">
                  <DollarSign className="h-3.5 w-3.5 mr-1" />
                  <span>{unreadOffers} unread {unreadOffers === 1 ? 'offer' : 'offers'}</span>
                </Badge>
              )}
              
              {newMessages > 0 && (
                <Badge className="bg-blue-600 text-white px-2.5 py-1">
                  <MessageCircle className="h-3.5 w-3.5 mr-1" />
                  <span>{newMessages} new {newMessages === 1 ? 'message' : 'messages'}</span>
                </Badge>
              )}
              
              <Button variant="outline" className="ml-2">
                <Filter className="h-4 w-4 mr-1.5" />
                <span>Activity Log</span>
              </Button>
            </div>
          </div>
          
          {/* Tabs navigation */}
          <Tabs 
            defaultValue="active" 
            value={activeTab} 
            onValueChange={(value: string) => setActiveTab(value as "active" | "proactive")}
            className="w-full"
          >
            <TabsList className="grid w-[400px] grid-cols-2 mb-6">
              <TabsTrigger value="active" className="rounded-full">
                <MessageCircle className="h-4 w-4 mr-1.5" />
                <span>Active Engagement</span>
              </TabsTrigger>
              <TabsTrigger value="proactive" className="rounded-full">
                <MailCheck className="h-4 w-4 mr-1.5" />
                <span>Proactive Outreach</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Filter bar */}
            <div className="flex items-center space-x-3 mb-4">
              <Select
                value={selectedProperty}
                onValueChange={setSelectedProperty}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {mockProperties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.address.split(',')[0]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {activeTab === "active" && (
                <Select
                  value={engagementType}
                  onValueChange={setEngagementType}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Engagement Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="offer">Offers</SelectItem>
                    <SelectItem value="message">Messages</SelectItem>
                    <SelectItem value="save">Saved</SelectItem>
                    <SelectItem value="view">Views</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder={activeTab === "active" ? "Search buyers or messages..." : "Search leads..."}
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Tab content */}
            <TabsContent value="active" className="mt-0">
              {/* Active engagement tab content */}
              <div className="space-y-3">
                {filteredEngagements.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                      <MessageCircle className="h-6 w-6 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No engagements found</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      There are no engagements matching your current filters. Try adjusting your search or filters.
                    </p>
                  </div>
                ) : (
                  filteredEngagements.map((engagement) => (
                    <EngagementCard key={engagement.id} engagement={engagement} />
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="proactive" className="mt-0">
              <Tabs defaultValue="crm">
                <TabsList className="mb-4">
                  <TabsTrigger value="crm">
                    <Users className="h-4 w-4 mr-1.5" />
                    <span>Lead Management</span>
                  </TabsTrigger>
                  <TabsTrigger value="templates">
                    <Mail className="h-4 w-4 mr-1.5" />
                    <span>Email Templates</span>
                  </TabsTrigger>
                  <TabsTrigger value="scheduling">
                    <CalendarClock className="h-4 w-4 mr-1.5" />
                    <span>Follow-up Scheduling</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="crm" className="mt-0">
                  {/* CRM Table */}
                  <div className="bg-white rounded-lg border overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                      <h3 className="font-medium">Lead Management</h3>
                      <Button size="sm" className="bg-[#135341] hover:bg-[#09261E]">
                        <Plus className="h-4 w-4 mr-1.5" />
                        <span>Add Lead</span>
                      </Button>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Contact</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Properties</TableHead>
                            <TableHead>Last Activity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockLeads.map((lead) => (
                            <LeadCard key={lead.id} lead={lead} />
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="templates" className="mt-0">
                  {/* Email Templates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockTemplates.map((template) => (
                      <TemplateCard key={template.id} template={template} />
                    ))}
                    
                    {/* Add new template card */}
                    <Card className="mb-4 border-dashed border-2 hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer">
                      <CardContent className="flex flex-col items-center justify-center py-8">
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                          <Plus className="h-6 w-6 text-gray-500" />
                        </div>
                        <p className="font-medium text-gray-600">Create New Template</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="scheduling" className="mt-0">
                  {/* Follow-up Scheduling (placeholder) */}
                  <div className="bg-white rounded-lg border p-8 text-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                      <CalendarClock className="h-6 w-6 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Follow-up Scheduling</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      Schedule automated follow-ups and reminders for your leads and properties.
                    </p>
                    <Button className="bg-[#135341] hover:bg-[#09261E]">
                      <CalendarClock className="h-4 w-4 mr-1.5" />
                      <span>Coming Soon</span>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SellerDashboardLayout>
  );
}