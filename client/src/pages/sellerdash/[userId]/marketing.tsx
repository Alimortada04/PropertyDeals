import React, { useState } from "react";
import { useParams } from "wouter";
import { 
  Mail,
  Calendar,
  User,
  Users,
  MessageCircle,
  BellRing,
  Settings,
  Sparkles,
  Megaphone,
  BarChart3,
  FileText,
  FileEdit,
  CircleSlash,
  XCircle,
  CheckCircle,
  AlertTriangle,
  ListFilter,
  PlusCircle,
  Paintbrush,
  Clock,
  Calendar as CalendarIcon,
  ChevronDown,
  Phone,
  ThumbsUp,
  Rocket,
  Lightbulb,
  Send,
  LineChart,
  PieChart,
  ArrowUpRight,
  Clock8,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Copy,
  Download,
  FileClock,
  Tag,
  Unlink,
  Zap,
  UploadCloud,
  Image,
  Link2,
  Pencil,
  Plus
} from "lucide-react";
import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from 'date-fns';

// Mock campaigns data
const mockCampaigns = [
  {
    id: "c1",
    name: "May Off-Market Special",
    type: "email",
    status: "active",
    properties: ["p1", "p3"],
    recipients: 125,
    sent: 125,
    opened: 82,
    clicked: 34,
    responded: 12,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    scheduledFor: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    completedAt: null,
    stats: {
      openRate: 65.6,
      clickRate: 27.2,
      responseRate: 9.6,
      bestPerformingSubject: "Exclusive Off-Market Deal: $25k Under ARV",
      bestTimeToSend: "Tuesday, 10am",
    }
  },
  {
    id: "c2",
    name: "Price Drop Alert - Main St Property",
    type: "email",
    status: "completed",
    properties: ["p2"],
    recipients: 87,
    sent: 87,
    opened: 65,
    clicked: 41,
    responded: 18,
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    scheduledFor: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000),
    stats: {
      openRate: 74.7,
      clickRate: 47.1,
      responseRate: 20.7,
      bestPerformingSubject: "PRICE DROP: Downtown Loft Now $25k Less",
      bestTimeToSend: "Thursday, 7pm",
    }
  },
  {
    id: "c3",
    name: "New Lakefront Property Alert",
    type: "sms",
    status: "draft",
    properties: ["p4"],
    recipients: 0,
    sent: 0,
    opened: 0,
    clicked: 0,
    responded: 0,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    scheduledFor: null,
    completedAt: null,
    stats: null
  },
  {
    id: "c4",
    name: "Memorial Day Investment Opportunity",
    type: "social",
    status: "scheduled",
    properties: ["p1", "p3", "p4"],
    recipients: 450,
    sent: 0,
    opened: 0,
    clicked: 0,
    responded: 0,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    scheduledFor: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    completedAt: null,
    stats: null
  },
];

// Mock templates data
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
    usage: 16,
    openRate: 0.71,
    responseRate: 0.29,
    lastUsed: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    tags: ["price drop", "update"],
  },
  {
    id: "t3",
    name: "Final Call Before Going Active on MLS",
    category: "Final Call",
    subject: "Last Chance: {Property Address} Going on MLS This Friday",
    body: "Hi {Buyer Name},\n\nThis is a final notice that our off-market property at {Property Address} will be listed on the MLS this Friday.\n\nCurrently, you can still get it at the wholesale price of {Assignment Price}, but after Friday, the price will increase to {MLS Price}.\n\nProperty Highlights:\n- {Property Feature 1}\n- {Property Feature 2}\n- {Property Feature 3}\n\nIf you're interested, please let me know before Friday at 12pm.\n\nBest regards,\n{Seller Name}",
    usage: 12,
    openRate: 0.82,
    responseRate: 0.35,
    lastUsed: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    tags: ["urgency", "final call", "MLS"],
  },
  {
    id: "t4",
    name: "Under Contract Notification",
    category: "Under Contract",
    subject: "{Property Address} is Now Under Contract",
    body: "Hi {Buyer Name},\n\nI wanted to let you know that the property at {Property Address} is now under contract.\n\nBut don't worry! I have several similar properties coming up. Based on your interest in this property, I think you might also like:\n\n1. {Similar Property 1} - {Brief Description}\n2. {Similar Property 2} - {Brief Description}\n\nWould you like me to send you the details on either of these?\n\nBest regards,\n{Seller Name}",
    usage: 20,
    openRate: 0.68,
    responseRate: 0.15,
    lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    tags: ["update", "under contract", "alternative options"],
  },
];

// Mock JV partners data
const mockJVPartners = [
  {
    id: "jv1",
    name: "Sarah Williams",
    company: "Williams Wholesaling",
    email: "sarah@williamswholesaling.com",
    phone: "555-123-4567",
    avatarUrl: "",
    properties: ["p1", "p3"],
    campaignsSent: 3,
    leadsGenerated: 18,
    offersReceived: 2,
    deals: 1,
    status: "active",
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "jv2",
    name: "Michael Johnson",
    company: "MJ Investments",
    email: "mike@mjinvestments.com",
    phone: "555-987-6543",
    avatarUrl: "",
    properties: ["p2", "p4"],
    campaignsSent: 1,
    leadsGenerated: 7,
    offersReceived: 0,
    deals: 0,
    status: "pending",
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

// Get campaign status badge
function getCampaignStatusBadge(status: string) {
  switch (status) {
    case "active":
      return { label: "Active", className: "bg-green-100 text-green-800 border-green-200" };
    case "scheduled":
      return { label: "Scheduled", className: "bg-blue-100 text-blue-800 border-blue-200" };
    case "draft":
      return { label: "Draft", className: "bg-gray-100 text-gray-800 border-gray-200" };
    case "completed":
      return { label: "Completed", className: "bg-purple-100 text-purple-800 border-purple-200" };
    default:
      return { label: status, className: "bg-gray-100 text-gray-800 border-gray-200" };
  }
}

// Get campaign type icon
function getCampaignTypeIcon(type: string) {
  switch (type) {
    case "email":
      return <Mail className="h-4 w-4 text-blue-600" />;
    case "sms":
      return <MessageCircle className="h-4 w-4 text-green-600" />;
    case "social":
      return <Megaphone className="h-4 w-4 text-purple-600" />;
    default:
      return <Mail className="h-4 w-4 text-blue-600" />;
  }
}

// Get template category badge
function getTemplateCategoryBadge(category: string) {
  switch (category) {
    case "New Listing":
      return { color: "bg-blue-100 text-blue-800 hover:bg-blue-200" };
    case "Price Drop":
      return { color: "bg-green-100 text-green-800 hover:bg-green-200" };
    case "Final Call":
      return { color: "bg-amber-100 text-amber-800 hover:bg-amber-200" };
    case "Under Contract":
      return { color: "bg-purple-100 text-purple-800 hover:bg-purple-200" };
    default:
      return { color: "bg-gray-100 text-gray-800 hover:bg-gray-200" };
  }
}

// Format number with commas
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Campaign Card Component
interface CampaignCardProps {
  campaign: typeof mockCampaigns[0];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function CampaignCard({ campaign, onView, onEdit, onDuplicate, onDelete }: CampaignCardProps) {
  const statusBadge = getCampaignStatusBadge(campaign.status);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {getCampaignTypeIcon(campaign.type)}
              <span>{campaign.name}</span>
            </CardTitle>
            <CardDescription className="mt-1">
              Created {format(campaign.createdAt, 'MMM d, yyyy')}
            </CardDescription>
          </div>
          <Badge className={statusBadge.className}>
            {statusBadge.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div>
            <span className="text-gray-500">Recipients:</span>
            <span className="ml-2 font-medium">{campaign.recipients}</span>
          </div>
          <div>
            <span className="text-gray-500">Properties:</span>
            <span className="ml-2 font-medium">{campaign.properties.length}</span>
          </div>
          {campaign.status !== "draft" && (
            <>
              <div>
                <span className="text-gray-500">Open rate:</span>
                <span className="ml-2 font-medium">
                  {campaign.opened > 0 ? Math.round((campaign.opened / campaign.sent) * 100) : 0}%
                </span>
              </div>
              <div>
                <span className="text-gray-500">Response rate:</span>
                <span className="ml-2 font-medium">
                  {campaign.responded > 0 ? Math.round((campaign.responded / campaign.sent) * 100) : 0}%
                </span>
              </div>
            </>
          )}
        </div>
        {campaign.status === "active" && campaign.stats && (
          <div className="mt-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span className="text-gray-500">Progress</span>
                <span className="font-medium">{Math.round((campaign.opened / campaign.recipients) * 100)}%</span>
              </div>
              <Progress value={(campaign.opened / campaign.recipients) * 100} className="h-1.5" />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 pt-3 pb-3 flex justify-between">
        <Button variant="ghost" size="sm" onClick={() => onView?.(campaign.id)}>
          <BarChart3 className="h-4 w-4 mr-1.5" />
          View Results
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <span>Actions</span>
              <ChevronDown className="ml-1 h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(campaign.id)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit Campaign</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate?.(campaign.id)}>
              <Copy className="mr-2 h-4 w-4" />
              <span>Duplicate</span>
            </DropdownMenuItem>
            {campaign.status === "active" && (
              <DropdownMenuItem>
                <CircleSlash className="mr-2 h-4 w-4" />
                <span>Pause Campaign</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600" 
              onClick={() => onDelete?.(campaign.id)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}

// Template Card Component
interface TemplateCardProps {
  template: typeof mockTemplates[0];
  onUse?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

function TemplateCard({ template, onUse, onEdit, onDuplicate }: TemplateCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{template.name}</CardTitle>
          <Badge className={getTemplateCategoryBadge(template.category).color}>
            {template.category}
          </Badge>
        </div>
        <CardDescription className="mt-1 text-sm">
          Used {template.usage} times
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="mb-3">
          <p className="text-sm font-medium">{template.subject}</p>
        </div>
        <div className="text-sm text-gray-600 line-clamp-3">
          {template.body.split("\n\n")[0]}...
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {template.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-gray-100 hover:bg-gray-200 text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 pt-3 pb-3 flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-sm text-gray-500">
                <span>{template.openRate * 100}% open</span>
                <span className="mx-1.5">•</span>
                <span>{template.responseRate * 100}% response</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-black/90 text-white border-0">
              Last used {format(template.lastUsed, 'MMM d, yyyy')}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button variant="outline" size="sm" onClick={() => onUse?.(template.id)}>
          <FileEdit className="h-4 w-4 mr-1.5" />
          <span>Use Template</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

// JV Partner Card Component
interface JVPartnerCardProps {
  partner: typeof mockJVPartners[0];
  onView?: (id: string) => void;
  onCollaborate?: (id: string) => void;
}

function JVPartnerCard({ partner, onView, onCollaborate }: JVPartnerCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gray-200">{partner.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{partner.name}</CardTitle>
            <CardDescription>{partner.company}</CardDescription>
          </div>
          {partner.status === "active" ? (
            <Badge className="ml-auto bg-green-100 text-green-800">Active</Badge>
          ) : (
            <Badge className="ml-auto bg-amber-100 text-amber-800">Pending</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <span className="text-gray-500">Properties:</span>
            <span className="ml-2 font-medium">{partner.properties.length}</span>
          </div>
          <div>
            <span className="text-gray-500">Campaigns:</span>
            <span className="ml-2 font-medium">{partner.campaignsSent}</span>
          </div>
          <div>
            <span className="text-gray-500">Leads Generated:</span>
            <span className="ml-2 font-medium">{partner.leadsGenerated}</span>
          </div>
          <div>
            <span className="text-gray-500">Deals Closed:</span>
            <span className="ml-2 font-medium">{partner.deals}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 pt-3 pb-3 flex justify-between">
        <Button variant="ghost" size="sm" onClick={() => onView?.(partner.id)}>
          <User className="h-4 w-4 mr-1.5" />
          <span>View Profile</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1.5"
          onClick={() => onCollaborate?.(partner.id)}
        >
          <Zap className="h-4 w-4" />
          <span>Collaborate</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Marketing Dashboard Page Component
export default function MarketingPage() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("campaigns");
  const [campaignSubTab, setCampaignSubTab] = useState("active");
  const [showNewCampaignDialog, setShowNewCampaignDialog] = useState(false);
  const [campaignType, setCampaignType] = useState<string | null>(null);
  
  const handleCreateCampaign = () => {
    setShowNewCampaignDialog(true);
  };
  
  const handleSelectCampaignType = (type: string) => {
    setCampaignType(type);
    setShowNewCampaignDialog(false);
    // Here you would navigate to campaign builder or open another dialog
  };
  
  // Filter campaigns based on sub-tab
  const filteredCampaigns = mockCampaigns.filter(campaign => {
    if (campaignSubTab === "active") return campaign.status === "active";
    if (campaignSubTab === "scheduled") return campaign.status === "scheduled";
    if (campaignSubTab === "draft") return campaign.status === "draft";
    if (campaignSubTab === "completed") return campaign.status === "completed";
    return true;
  });
  
  return (
    <SellerDashboardLayout>
      <div className="py-6">
        <div className="flex flex-col space-y-6">
          {/* Page header with title and actions */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Marketing</h1>
            
            <div className="flex items-center gap-2">
              <Dialog open={showNewCampaignDialog} onOpenChange={setShowNewCampaignDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-[#135341] hover:bg-[#09261E]">
                    <Plus className="h-4 w-4 mr-1.5" />
                    <span>New Campaign</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Campaign</DialogTitle>
                    <DialogDescription>
                      Choose the type of campaign you want to create
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                    <Button 
                      variant="outline" 
                      className="h-auto flex-col px-4 py-6 border-dashed gap-3 hover:bg-blue-50 hover:border-blue-200"
                      onClick={() => handleSelectCampaignType("email")}
                    >
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Email Campaign</p>
                        <p className="text-xs text-gray-500 mt-1">Craft an email to send to your buyer list</p>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto flex-col px-4 py-6 border-dashed gap-3 hover:bg-green-50 hover:border-green-200"
                      onClick={() => handleSelectCampaignType("sms")}
                    >
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-1">
                        <MessageCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">SMS Campaign</p>
                        <p className="text-xs text-gray-500 mt-1">Send text messages to your contacts</p>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto flex-col px-4 py-6 border-dashed gap-3 hover:bg-purple-50 hover:border-purple-200"
                      onClick={() => handleSelectCampaignType("social")}
                    >
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-1">
                        <Megaphone className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Social Campaign</p>
                        <p className="text-xs text-gray-500 mt-1">Create posts for social media channels</p>
                      </div>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Dashboard summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
                    <h3 className="text-2xl font-bold mt-1">{mockCampaigns.filter(c => c.status === "active").length}</h3>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Megaphone className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-500">Last campaign sent 2 days ago</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Responses</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {mockCampaigns.reduce((sum, campaign) => sum + campaign.responded, 0)}
                    </h3>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowUpRight className="h-3.5 w-3.5 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">8%</span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Avg. Open Rate</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {Math.round(
                        (mockCampaigns.reduce((sum, campaign) => sum + campaign.opened, 0) / 
                        mockCampaigns.reduce((sum, campaign) => sum + campaign.sent, 0)) * 100
                      )}%
                    </h3>
                  </div>
                  <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-500">Industry avg: 21%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">JV Partners</p>
                    <h3 className="text-2xl font-bold mt-1">{mockJVPartners.length}</h3>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                    1 pending invitation
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main tabs navigation */}
          <Tabs defaultValue="campaigns" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
              <TabsTrigger value="campaigns" className="rounded-lg">
                <Mail className="h-4 w-4 mr-1.5" />
                <span>Campaigns</span>
              </TabsTrigger>
              <TabsTrigger value="templates" className="rounded-lg">
                <FileText className="h-4 w-4 mr-1.5" />
                <span>Templates</span>
              </TabsTrigger>
              <TabsTrigger value="jv-partners" className="rounded-lg">
                <Users className="h-4 w-4 mr-1.5" />
                <span>JV Partners</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="space-y-6">
              {/* Campaigns sub-tabs */}
              <div className="flex justify-between items-center">
                <Tabs defaultValue="active" value={campaignSubTab} onValueChange={setCampaignSubTab} className="w-auto">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                    <TabsTrigger value="draft">Drafts</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="flex items-center gap-2">
                  <Select defaultValue="date-desc">
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Newest First</SelectItem>
                      <SelectItem value="date-asc">Oldest First</SelectItem>
                      <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                      <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                      <SelectItem value="performance">Best Performing</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" className="gap-1">
                    <ListFilter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </div>
              </div>
              
              {/* Campaigns grid */}
              {filteredCampaigns.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                    <Mail className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No campaigns found</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    You don't have any {campaignSubTab} campaigns yet. Start creating your first campaign to reach out to your buyers.
                  </p>
                  <Button onClick={handleCreateCampaign} className="bg-[#135341] hover:bg-[#09261E]">
                    <Plus className="h-4 w-4 mr-1.5" />
                    <span>New Campaign</span>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCampaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onView={(id) => console.log("View campaign", id)}
                      onEdit={(id) => console.log("Edit campaign", id)}
                      onDuplicate={(id) => console.log("Duplicate campaign", id)}
                      onDelete={(id) => console.log("Delete campaign", id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              <div className="flex justify-between items-center">
                <Tabs defaultValue="all" className="w-auto">
                  <TabsList>
                    <TabsTrigger value="all">All Templates</TabsTrigger>
                    <TabsTrigger value="new-listing">New Listing</TabsTrigger>
                    <TabsTrigger value="price-drop">Price Drop</TabsTrigger>
                    <TabsTrigger value="final-call">Final Call</TabsTrigger>
                    <TabsTrigger value="under-contract">Under Contract</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <Button className="bg-[#135341] hover:bg-[#09261E]">
                  <Plus className="h-4 w-4 mr-1.5" />
                  <span>Create Template</span>
                </Button>
              </div>
              
              {/* Templates grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onUse={(id) => console.log("Use template", id)}
                    onEdit={(id) => console.log("Edit template", id)}
                    onDuplicate={(id) => console.log("Duplicate template", id)}
                  />
                ))}
                
                {/* Add new template card */}
                <Card className="border-dashed border-2 hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <Plus className="h-6 w-6 text-gray-500" />
                    </div>
                    <p className="font-medium text-gray-600">Create New Template</p>
                    <p className="text-xs text-gray-500 mt-1">Start from scratch or import</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* JV Partners Tab */}
            <TabsContent value="jv-partners" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Your JV Partners</h3>
                <Button className="bg-[#135341] hover:bg-[#09261E]">
                  <Plus className="h-4 w-4 mr-1.5" />
                  <span>Invite Partner</span>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockJVPartners.map((partner) => (
                  <JVPartnerCard
                    key={partner.id}
                    partner={partner}
                    onView={(id) => console.log("View partner", id)}
                    onCollaborate={(id) => console.log("Collaborate with partner", id)}
                  />
                ))}
                
                {/* Add new partner card */}
                <Card className="border-dashed border-2 hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <Users className="h-6 w-6 text-gray-500" />
                    </div>
                    <p className="font-medium text-gray-600">Find JV Partners</p>
                    <p className="text-xs text-gray-500 mt-1">Collaborate with other sellers</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* JV Partners info section */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    <span>What are JV partnerships?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-800">
                    JV partnerships allow you to share your properties with other sellers and vice versa, expanding your reach. Partners can market your deals to their buyers list, and you'll both benefit when a deal closes.
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="link" className="text-blue-700 p-0">
                    Learn more about JV partnerships
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SellerDashboardLayout>
  );
}