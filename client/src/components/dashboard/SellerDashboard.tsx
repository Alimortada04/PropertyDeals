import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "wouter";
import { 
  CalendarDays, Search, Home, Building, DollarSign, MessageSquare, Plus, 
  Edit, Trash2, Eye, BarChart3, Clock, BellRing, AlertCircle, ChevronRight,
  FileText, CheckCircle, ArrowUpRight, Camera, Upload, MapPin, PlusCircle,
  LayoutDashboard, LineChart, Pencil, Star, List, Briefcase, ChevronLeft,
  Gauge, Settings, SendHorizontal, Filter, PieChart, ClipboardCheck, BookOpen,
  Calculator, Mail, FileUp, BarChart, LayoutList, Users, Sparkles, Phone, Image,
  Bell, Share2, ArrowRight, X, MoreHorizontal, History, Calendar, FileCheck, 
  HelpCircle, ArrowUp, ArrowDown, TrendingUp, ChevronDown, Upload as UploadIcon, 
  Paperclip, Map, AlarmCheck, User, ListChecks, Folders, Text, ChevronUp,
  Zap, PanelLeft, ScreenShare, Info, Megaphone, AlertTriangle
} from 'lucide-react';

// Import custom components
import RoleSwitcher from './RoleSwitcher';
import FloatingActionMenu from './FloatingActionMenu';
import MarketingTab from './MarketingTab';

// Property listing wizard steps
const WIZARD_STEPS = [
  { id: 'address', label: 'Property Address', icon: MapPin },
  { id: 'details', label: 'Property Details', icon: Home },
  { id: 'files', label: 'Upload Files', icon: UploadIcon },
  { id: 'financials', label: 'Financials', icon: DollarSign },
  { id: 'marketing', label: 'Marketing & Controls', icon: Share2 },
  { id: 'review', label: 'Review & Submit', icon: CheckCircle }
];

// Mock properties for the example
const PROPERTY_DATA = [
  {
    id: 'prop001',
    title: 'Colonial Revival',
    address: '123 Main St, Chicago, IL 60601',
    price: 625000,
    contractPrice: 595000,
    assignmentFee: 30000,
    beds: 5,
    baths: 3.5,
    sqft: 3200,
    arv: 725000,
    status: 'Live',
    views: 42,
    inquiries: 8,
    daysListed: 12,
    offers: 3,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'
  },
  {
    id: 'prop002',
    title: 'Modern Farmhouse',
    address: '456 Oak St, Chicago, IL 60607',
    price: 459000,
    contractPrice: 425000,
    assignmentFee: 34000,
    beds: 4,
    baths: 3,
    sqft: 2800,
    arv: 550000,
    status: 'Under Contract',
    views: 68,
    inquiries: 12,
    daysListed: 5,
    offers: 7,
    imageUrl: 'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d'
  },
  {
    id: 'prop003',
    title: 'Modern Condo',
    address: '789 Pine Ave, Chicago, IL 60611',
    price: 339900,
    contractPrice: 321400,
    assignmentFee: 18500,
    beds: 2,
    baths: 2,
    sqft: 1200,
    arv: 375000,
    status: 'Assigned',
    views: 55,
    inquiries: 6,
    daysListed: 18,
    offers: 4,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
  },
  {
    id: 'prop004',
    title: 'Ranch Style Home',
    address: '567 Willow Dr, Chicago, IL 60614',
    price: 385000,
    contractPrice: 365000,
    assignmentFee: 20000,
    beds: 3,
    baths: 2,
    sqft: 1800,
    arv: 420000,
    status: 'Live',
    views: 37,
    inquiries: 4,
    daysListed: 3,
    offers: 1,
    imageUrl: 'https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb'
  }
];

// Offer data
const OFFER_DATA = [
  {
    id: 'offer001',
    propertyId: 'prop001',
    propertyTitle: 'Colonial Revival',
    buyerName: 'Michael Brown',
    buyerVerified: true,
    buyerPOF: true,
    amount: 610000,
    date: '2025-04-20',
    responseTime: '24h avg',
    closingTimeline: '30 days',
    contingencies: ['Inspection', 'Financing'],
    aiScore: 8.5,
    status: 'Pending'
  },
  {
    id: 'offer002',
    propertyId: 'prop001',
    propertyTitle: 'Colonial Revival',
    buyerName: 'Sarah Johnson',
    buyerVerified: true,
    buyerPOF: true,
    amount: 600000,
    date: '2025-04-19',
    responseTime: '12h avg',
    closingTimeline: '45 days',
    contingencies: ['Inspection', 'Appraisal'],
    aiScore: 7.2,
    status: 'Pending'
  },
  {
    id: 'offer003',
    propertyId: 'prop001',
    propertyTitle: 'Colonial Revival',
    buyerName: 'David Wilson',
    buyerVerified: false,
    buyerPOF: false,
    amount: 615000,
    date: '2025-04-18',
    responseTime: '36h avg',
    closingTimeline: '60 days',
    contingencies: ['Inspection', 'Financing', 'Home Sale'],
    aiScore: 6.8,
    status: 'Pending'
  },
  {
    id: 'offer004',
    propertyId: 'prop002',
    propertyTitle: 'Modern Farmhouse',
    buyerName: 'Jennifer Lee',
    buyerVerified: true,
    buyerPOF: true,
    amount: 450000,
    date: '2025-04-17',
    responseTime: '8h avg',
    closingTimeline: '14 days',
    contingencies: ['As-Is'],
    aiScore: 9.3,
    status: 'Accepted'
  }
];

// Message data
const MESSAGE_DATA = [
  {
    id: 'msg001',
    sender: { id: 'user002', name: 'Michael Brown', initials: 'MB', type: 'buyer', avatar: null },
    propertyId: 'prop001',
    propertyTitle: 'Colonial Revival',
    lastMessage: 'I\'d like to submit an offer on the Colonial Revival property.',
    unread: true,
    time: '2h',
    messages: [
      {
        id: 'm1',
        senderId: 'user002',
        text: 'Hi Sarah, I\'m interested in the Colonial Revival property you have listed. I\'d like to submit an offer. What\'s the best way to proceed?',
        time: '10:30 AM'
      },
      {
        id: 'm2',
        senderId: 'user001',
        text: 'Hello Michael! That\'s great to hear. I\'d be happy to help with the offer process. You can submit your offer directly through the platform by clicking on the property and then "Submit Offer," or I can send you our offer form.',
        time: '10:45 AM'
      },
      {
        id: 'm3',
        senderId: 'user002',
        text: 'Thanks for the quick response. Could you please send me the offer form? Also, is there any flexibility on the asking price?',
        time: '11:02 AM'
      }
    ]
  },
  {
    id: 'msg002',
    sender: { id: 'user003', name: 'Jennifer Williams', initials: 'JW', type: 'rep', avatar: null },
    propertyId: 'prop002',
    propertyTitle: 'Modern Farmhouse',
    lastMessage: 'I have a buyer interested in your Modern Farmhouse...',
    unread: false,
    time: '1d',
    messages: []
  },
  {
    id: 'msg003',
    sender: { id: 'user004', name: 'Title Company', initials: 'TC', type: 'title', avatar: null },
    propertyId: 'prop003',
    propertyTitle: 'Modern Condo',
    lastMessage: 'We\'ve completed our title search for the Modern Condo...',
    unread: false,
    time: '3d',
    messages: []
  },
  {
    id: 'msg004',
    sender: { id: 'user005', name: 'Kevin Thompson', initials: 'KT', type: 'buyer', avatar: null },
    propertyId: 'prop003',
    propertyTitle: 'Modern Condo',
    lastMessage: 'Thanks for accepting my offer! When can we schedule...',
    unread: false,
    time: '4d',
    messages: []
  }
];

// Analytics data mock
const ANALYTICS_DATA = {
  dealsPosted: 14,
  dealsAssigned: 6,
  dealsClosed: 4,
  avgTimeOnMarket: 11, // days
  avgAssignmentFee: 28500,
  viewsThisMonth: 312,
  offersThisMonth: 21,
  conversionRate: 22.4, // percentage of deals assigned
  performingZips: [
    { zip: '60601', deals: 3, avgFee: 32000 },
    { zip: '60607', deals: 2, avgFee: 24500 },
    { zip: '60614', deals: 2, avgFee: 19800 },
    { zip: '60611', deals: 1, avgFee: 18500 }
  ],
  monthlyRevenue: [
    { month: 'Jan', amount: 42000 },
    { month: 'Feb', amount: 38000 },
    { month: 'Mar', amount: 56000 },
    { month: 'Apr', amount: 71000 }
  ]
};

// Tools data
const TOOLS_DATA = [
  {
    id: 'tool001',
    title: 'AI Offer Predictor',
    description: 'Get an AI-powered estimate of what your deal will likely assign for',
    icon: Zap,
    color: 'bg-purple-500'
  },
  {
    id: 'tool002',
    title: 'Seller Net Sheet',
    description: 'Create a professional seller net sheet to show expected proceeds',
    icon: Calculator,
    color: 'bg-blue-500'
  },
  {
    id: 'tool003',
    title: 'Assignment Contract Generator',
    description: 'Generate customized assignment contracts in seconds',
    icon: FileText,
    color: 'bg-green-500'
  },
  {
    id: 'tool004',
    title: 'Property Packet Builder',
    description: 'Create beautiful property packets for buyers with all details',
    icon: Folders,
    color: 'bg-orange-500'
  },
  {
    id: 'tool005',
    title: 'Title Checklist Generator',
    description: 'Generate a comprehensive title checklist for smooth closings',
    icon: ListChecks,
    color: 'bg-red-500'
  },
  {
    id: 'tool006',
    title: 'Cash Buyer List Organizer',
    description: 'Import and manage your cash buyer list with property preferences',
    icon: Users,
    color: 'bg-yellow-500'
  }
];

// Resource cards data
const RESOURCE_DATA = [
  {
    id: 'res001',
    title: 'How to Structure a JV',
    description: 'Learn the best practices for structuring joint ventures in wholesaling',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2',
    readTime: '8 min'
  },
  {
    id: 'res002',
    title: 'Property Photos That Sell',
    description: 'Techniques for capturing photos that get more views and offers',
    category: 'Marketing',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
    readTime: '6 min'
  },
  {
    id: 'res003',
    title: 'Assignment Best Practices',
    description: 'The legal ins and outs of proper assignment contracts',
    category: 'Legal',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f',
    readTime: '12 min'
  },
  {
    id: 'res004',
    title: 'Working With Title Companies',
    description: 'How to build relationships with title companies for faster closings',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
    readTime: '9 min'
  },
  {
    id: 'res005',
    title: 'PropertyDeals Platform Guide',
    description: 'How to use all features of PropertyDeals to maximize your success',
    category: 'Guide',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    readTime: '15 min'
  }
];

// Pipeline stages
const PIPELINE_STAGES = ['Submitted', 'Live', 'Offers', 'Under Contract', 'Assigned', 'Closed'];

export default function SellerDashboard() {
  // State for active tabs and modal controls
  const [showConversationDetail, setShowConversationDetail] = useState(false);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [activeMessage, setActiveMessage] = useState(MESSAGE_DATA[0]);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [showDetailView, setShowDetailView] = useState(false);
  const [activePropertyDetail, setActivePropertyDetail] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeRole, setActiveRole] = useState<'buyer' | 'seller' | 'rep'>('seller');
  
  // Handle conversation click
  const handleOpenConversation = (messageId: string) => {
    setActiveConversation(messageId);
    const message = MESSAGE_DATA.find(m => m.id === messageId);
    if (message) {
      setActiveMessage(message);
    }
    setShowConversationDetail(true);
  };

  // Handle property card click
  const handlePropertyDetailView = (propertyId: string) => {
    setActivePropertyDetail(propertyId);
    setShowDetailView(true);
  };
  
  // Function to get avatar background based on user type
  const getAvatarBackground = (type: string) => {
    switch (type) {
      case 'buyer': return 'bg-blue-600/20 text-blue-700';
      case 'rep': return 'bg-[#803344]/20 text-[#803344]';
      case 'title': return 'bg-gray-200 text-gray-800';
      default: return 'bg-green-600/20 text-green-700';
    }
  };
  
  // Function to get badge background based on property status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Live': return 'bg-green-500 hover:bg-green-600';
      case 'Under Contract': return 'bg-amber-500 hover:bg-amber-600';
      case 'Assigned': return 'bg-blue-500 hover:bg-blue-600';
      case 'Closed': return 'bg-purple-500 hover:bg-purple-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  // Handle wizard navigation
  const nextWizardStep = () => {
    if (wizardStep < WIZARD_STEPS.length - 1) {
      setWizardStep(wizardStep + 1);
    }
  };
  
  const prevWizardStep = () => {
    if (wizardStep > 0) {
      setWizardStep(wizardStep - 1);
    }
  };
  
  // Get status text for the pipeline view
  const getPipelineStatus = (status: string) => {
    switch (status) {
      case 'Live': return 'Live';
      case 'Under Contract': return 'Offers';
      case 'Assigned': return 'Assigned';
      default: return 'Submitted';
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Render the wizard steps
  const renderWizardStep = () => {
    const step = WIZARD_STEPS[wizardStep];
    
    switch (step.id) {
      case 'address':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="property-address">Property Address</Label>
              <div className="relative">
                <Input id="property-address" placeholder="Enter property address" className="pr-10" />
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500">Start typing to search via Google Maps</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="City" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" placeholder="State" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zip">Zip Code</Label>
                <Input id="zip" placeholder="Zip code" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="county">County</Label>
                <Input id="county" placeholder="County" />
              </div>
            </div>
          </div>
        );
        
      case 'details':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="beds">Bedrooms</Label>
                <Input id="beds" type="number" placeholder="# of bedrooms" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="baths">Bathrooms</Label>
                <Input id="baths" type="number" placeholder="# of bathrooms" step="0.5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sqft">Square Footage</Label>
                <Input id="sqft" type="number" placeholder="Sqft" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year-built">Year Built</Label>
                <Input id="year-built" type="number" placeholder="Year built" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lot-size">Lot Size</Label>
                <Input id="lot-size" placeholder="Lot size (acres)" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Property Condition</Label>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="cursor-pointer hover:bg-[#135341]/10 hover:border-[#135341] px-3 py-1">
                  Turnkey
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-[#135341]/10 hover:border-[#135341] px-3 py-1 bg-[#135341]/10 border-[#135341]">
                  Light Rehab
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-[#135341]/10 hover:border-[#135341] px-3 py-1">
                  Medium Rehab
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-[#135341]/10 hover:border-[#135341] px-3 py-1">
                  Full Gut
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-[#135341]/10 hover:border-[#135341] px-3 py-1">
                  Teardown
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="property-description">Property Description</Label>
              <Textarea id="property-description" placeholder="Describe the property, including condition, features, and any special considerations" className="min-h-[100px]" />
            </div>
          </div>
        );
        
      case 'files':
        return (
          <div className="space-y-5">
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <Label className="font-medium flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-[#135341]" />
                  Purchase Contract <span className="text-red-500 ml-1">*</span>
                </Label>
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Required</Badge>
              </div>
              <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50">
                <UploadIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Drag and drop your purchase contract, or click to browse</p>
                <Button size="sm" variant="outline" className="mx-auto">
                  <UploadIcon className="h-4 w-4 mr-2" /> Upload Contract
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <Label className="font-medium flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[#135341]" />
                  Assignment Contract
                </Label>
                <Badge className="text-white border-none bg-[#803344] flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Needs Attention
                </Badge>
              </div>
              <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50">
                <UploadIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload your assignment contract template if available</p>
                <Button size="sm" variant="outline" className="mx-auto">
                  <UploadIcon className="h-4 w-4 mr-2" /> Upload Document
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <Label className="font-medium flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-[#135341]" />
                  Property Photos / Video
                </Label>
                <Badge className="text-white border-none bg-[#803344] flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Needs Attention
                </Badge>
              </div>
              <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50">
                <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload property photos or video walkthrough</p>
                <div className="flex justify-center gap-2">
                  <Button size="sm" variant="outline">
                    <Image className="h-4 w-4 mr-2" /> Upload Photos
                  </Button>
                  <Button size="sm" variant="outline">
                    <ScreenShare className="h-4 w-4 mr-2" /> Add Video Link
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'financials':
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contract-price">Contract Price <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input id="contract-price" className="pl-8" placeholder="Your purchase price" />
                </div>
                <p className="text-xs text-gray-500">The price you're under contract for</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="asking-price">Asking Price <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input id="asking-price" className="pl-8" placeholder="Your selling price" />
                </div>
                <p className="text-xs text-gray-500">The price you want to sell for</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="arv">After Repair Value (ARV)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input id="arv" className="pl-8" placeholder="Estimated ARV" />
                </div>
                <p className="text-xs text-gray-500">Estimated value after repairs</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="repair-cost">Estimated Repair Cost</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input id="repair-cost" className="pl-8" placeholder="Repair costs" />
                </div>
                <p className="text-xs text-gray-500">Approximate cost of needed repairs</p>
              </div>
            </div>
            
            {/* Potential profit calculator */}
            <Card className="bg-[#135341]/5 border-none">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-[#135341]">Potential Assignment Fee</h4>
                    <p className="text-sm text-gray-600">Based on your numbers</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#135341]">$30,000</span>
                    <p className="text-xs text-gray-500">Asking Price - Contract Price</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* AI suggestion */}
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 flex gap-3 items-start">
                <Sparkles className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-800">AI Assignment Value Prediction</h4>
                  <p className="text-sm text-purple-700">Based on similar deals in this area, this property could potentially assign for <span className="font-semibold">$25,000 - $35,000</span>.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'marketing':
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="property-title">Property Title/Name</Label>
              <Input id="property-title" placeholder="E.g., 'Colonial Revival in Lincoln Park'" />
              <p className="text-xs text-gray-500">A catchy title helps your listing stand out</p>
            </div>
            
            <div className="space-y-2">
              <Label>REP Access Control</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 p-2 rounded-md border hover:bg-gray-50">
                  <input type="radio" id="public-access" name="access-control" className="h-4 w-4 text-[#135341]" checked />
                  <Label htmlFor="public-access" className="flex-1 cursor-pointer">
                    <div className="font-medium">Public</div>
                    <p className="text-xs text-gray-500">Any REP can view and refer buyers to this property</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-md border hover:bg-gray-50">
                  <input type="radio" id="private-access" name="access-control" className="h-4 w-4 text-[#135341]" />
                  <Label htmlFor="private-access" className="flex-1 cursor-pointer">
                    <div className="font-medium">Private</div>
                    <p className="text-xs text-gray-500">Only REPs you invite can see this property</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-md border hover:bg-gray-50">
                  <input type="radio" id="invite-only" name="access-control" className="h-4 w-4 text-[#135341]" />
                  <Label htmlFor="invite-only" className="flex-1 cursor-pointer">
                    <div className="font-medium">Invite-Only</div>
                    <p className="text-xs text-gray-500">Only specific REPs you invite can access this property</p>
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Property Tags</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-[#135341]/10 hover:border-[#135341] px-3 py-1">
                  Tenant Occupied
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-[#135341]/10 hover:border-[#135341] px-3 py-1 bg-[#135341]/10 border-[#135341]">
                  Off-Market
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-[#135341]/10 hover:border-[#135341] px-3 py-1">
                  Fire Damage
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-[#135341]/10 hover:border-[#135341] px-3 py-1">
                  Probate
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-[#135341]/10 hover:border-[#135341] px-3 py-1">
                  Cash Only
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-[#135341]/10 hover:border-[#135341] px-3 py-1">
                  <Plus className="h-3 w-3 mr-1" /> Add Custom
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expected-close">Expected Close Date</Label>
              <Input id="expected-close" type="date" />
              <p className="text-xs text-gray-500">When do you expect to close this deal?</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="internal-notes">Internal Notes</Label>
              <Textarea id="internal-notes" placeholder="Notes only visible to you (not shown to buyers or REPs)" className="min-h-[80px]" />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch id="show-in-catalog" />
              <Label htmlFor="show-in-catalog" className="text-sm">
                Show in Public Catalog
              </Label>
            </div>
          </div>
        );
        
      case 'review':
        return (
          <div className="space-y-6">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-[#135341]/5 p-4 border-b">
                <h3 className="font-medium">Property Summary</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium">123 Main St, Chicago, IL 60601</span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-gray-600">Property Details:</span>
                  <span className="font-medium">3 beds • 2 baths • 1,800 sqft</span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-gray-600">Condition:</span>
                  <span className="font-medium">Light Rehab</span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-gray-600">Contract Price:</span>
                  <span className="font-medium">$395,000</span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-gray-600">Asking Price:</span>
                  <span className="font-medium">$425,000</span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-gray-600">Potential Assignment Fee:</span>
                  <span className="font-medium text-[#135341]">$30,000</span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-gray-600">Files Uploaded:</span>
                  <span className="font-medium">Purchase Contract, 4 Photos</span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-gray-600">Access Control:</span>
                  <span className="font-medium">Public</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="terms-agree" className="h-4 w-4 text-[#135341] rounded" />
                <Label htmlFor="terms-agree" className="text-sm">
                  I confirm that I have the legal right to market this property
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="accurate-info" className="h-4 w-4 text-[#135341] rounded" />
                <Label htmlFor="accurate-info" className="text-sm">
                  I confirm that all information provided is accurate
                </Label>
              </div>
            </div>
            
            {/* AI suggestion */}
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4 flex gap-3 items-start">
                <HelpCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Recommendation</h4>
                  <p className="text-sm text-amber-700 mb-2">Want to generate a professional Property Packet with all details? This can be shared with potential buyers.</p>
                  <Button size="sm" variant="outline" className="border-amber-300 bg-white text-amber-700 hover:bg-amber-100">
                    <FileText className="h-4 w-4 mr-2" /> Generate Property Packet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Function to render property card
  const renderPropertyCard = (property: any) => {
    return (
      <Card key={property.id} className="overflow-hidden hover:shadow-md transition-shadow border group">
        <div className="relative h-44 bg-gray-200 overflow-hidden">
          <Badge className={`absolute top-2 left-2 ${getStatusBadgeColor(property.status)}`}>
            {property.status}
          </Badge>
          <Badge className="absolute top-2 right-2 bg-[#135341] hover:bg-[#135341]/90">
            Views: {property.views}
          </Badge>
          <img 
            src={property.imageUrl} 
            alt={property.title} 
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg text-[#135341]">{property.title}</h3>
              <p className="text-sm text-gray-500">{property.address}</p>
            </div>
            <Badge variant="outline" className="bg-[#135341]/10 text-[#135341] border-[#135341]/30">
              {formatCurrency(property.price)}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {property.beds} bed
            </Badge>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {property.baths} bath
            </Badge>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {property.sqft.toLocaleString()} sqft
            </Badge>
            <Badge variant="outline" className="text-xs">
              ARV: {formatCurrency(property.arv)}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" /> {property.views}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" /> {property.inquiries}
            </span>
            <span className="flex items-center gap-1">
              {property.status === 'Assigned' ? (
                <CheckCircle className="h-4 w-4 text-blue-500" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
              {property.status === 'Assigned' 
                ? `Fee: $${property.assignmentFee.toLocaleString()}` 
                : `${property.daysListed} days`}
            </span>
          </div>
          
          <div className="flex justify-between items-center space-x-2 mt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <MoreHorizontal className="h-4 w-4 mr-1" /> Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem className="cursor-pointer">
                  <Edit className="h-4 w-4 mr-2" /> Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => handlePropertyDetailView(property.id)}>
                  <Eye className="h-4 w-4 mr-2" /> View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Share2 className="h-4 w-4 mr-2" /> Share Listing
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <LayoutDashboard className="h-4 w-4 mr-2" /> Pipeline View
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" /> Remove Listing
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => handlePropertyDetailView(property.id)}
            >
              <Eye className="h-4 w-4 mr-1" /> Details
            </Button>
            
            <Button 
              size="sm" 
              className={`flex-1 ${
                property.status === 'Under Contract' 
                  ? 'bg-amber-500 hover:bg-amber-600' 
                  : property.status === 'Assigned' 
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-[#135341] hover:bg-[#135341]/90'
              }`}
            >
              {property.status === 'Under Contract' ? (
                <>
                  <FileText className="h-4 w-4 mr-1" /> Contract
                </>
              ) : property.status === 'Assigned' ? (
                <>
                  <FileCheck className="h-4 w-4 mr-1" /> Close Out
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-1" /> Offers ({property.offers})
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Event handlers for FloatingActionMenu
  const handleAddDeal = () => {
    setWizardOpen(true);
  };
  
  const handleShareProperty = () => {
    // Open share dialog or navigate to marketing tab
    const marketingTab = document.querySelector('[value="marketing"]') as HTMLElement;
    if (marketingTab) {
      marketingTab.click();
    }
  };
  
  const handleOpenMessages = () => {
    // Navigate to messages tab
    const messagesTab = document.querySelector('[value="messages"]') as HTMLElement;
    if (messagesTab) {
      messagesTab.click();
    }
  };
  
  const handleOpenResources = () => {
    // Navigate to resources tab
    const resourcesTab = document.querySelector('[value="resources"]') as HTMLElement;
    if (resourcesTab) {
      resourcesTab.click();
    }
  };
  
  // Handle role change
  const handleRoleChange = (role: 'buyer' | 'seller' | 'rep') => {
    setActiveRole(role);
    // In a real app, this would likely trigger navigation to a different dashboard
    console.log(`Switched to ${role} role`);
  };

  return (
    <div className="pt-20 sm:pt-24 md:pt-20 p-4 sm:p-6 md:p-12 space-y-8">
      {/* Role Switcher */}
      <RoleSwitcher currentRole={activeRole} onRoleChange={handleRoleChange} />
      
      {/* Floating Action Menu - Mobile Optimized */}
      <FloatingActionMenu 
        onAddDeal={handleAddDeal}
        onShare={handleShareProperty}
        onMessages={handleOpenMessages}
        onResources={handleOpenResources}
      />
      
      {/* Floating toolbar for quick actions */}
      <div className="fixed top-[80px] md:top-[70px] right-4 z-20 hidden md:flex items-center gap-2 bg-white px-2 py-1 rounded-full shadow-md border">
        <Button variant="ghost" size="sm" className="h-8 rounded-full" onClick={() => setWizardOpen(true)}>
          <Plus className="h-4 w-4 mr-1 text-[#135341]" /> Add Deal
        </Button>
        <Button variant="ghost" size="sm" className="h-8 rounded-full">
          <FileText className="h-4 w-4 mr-1 text-[#135341]" /> Property Packet
        </Button>
        <Button variant="ghost" size="sm" className="h-8 rounded-full">
          <Users className="h-4 w-4 mr-1 text-[#135341]" /> REP Connect
        </Button>
        <Button variant="ghost" size="sm" className="h-8 rounded-full">
          <Share2 className="h-4 w-4 mr-1 text-[#135341]" /> Quick Share
        </Button>
      </div>
  
      {/* Main tabs design with green active state and grey hover - mobile responsive with sticky positioning */}
      <Tabs defaultValue="mydeals" className="mb-6">
        <div className="mb-6 md:mb-8 sticky top-0 z-30 bg-white/95 backdrop-blur-sm pt-2 pb-3 -mt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-12 md:px-12">
          <div className="overflow-x-auto pb-1">
            <TabsList className="bg-white rounded-xl p-1.5 flex w-full md:w-full border border-gray-200 shadow-sm min-w-max">
              <TabsTrigger 
                value="mydeals" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#135341] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[100px]"
              >
                My Deals
              </TabsTrigger>
              <TabsTrigger 
                value="pipeline" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#135341] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[100px]"
              >
                Pipeline
              </TabsTrigger>
              <TabsTrigger 
                value="messages" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#135341] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[100px]"
              >
                Messages
              </TabsTrigger>
              <TabsTrigger 
                value="offers" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#135341] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[100px]"
              >
                Offers
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#135341] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[100px]"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#135341] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[100px]"
              >
                Resources
              </TabsTrigger>
              <TabsTrigger 
                value="marketing" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#135341] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[100px]"
              >
                Marketing
              </TabsTrigger>
              <TabsTrigger 
                value="tools" 
                className="px-3 py-2 sm:px-5 sm:py-2.5 flex-none md:flex-1 whitespace-nowrap font-display font-semibold text-gray-600 hover:bg-gray-100 data-[state=active]:bg-[#135341] data-[state=active]:text-white data-[state=active]:font-bold transition-all rounded-lg min-w-[100px]"
              >
                Tools
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        {/* My Deals Tab Content */}
        <TabsContent value="mydeals" className="mt-6">
          {/* Command Center Header */}
          <div className="bg-white shadow-md rounded-lg mb-8 overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-[#135341]/10 to-transparent p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold tracking-tight text-[#135341]">Welcome back, Sarah</h1>
                  
                  <div className="w-full md:max-w-md">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-700 font-medium">Wholesaler Profile Completion</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 ml-1">
                              <AlertCircle className="h-4 w-4 text-[#135341]" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-80">
                            <div className="p-3">
                              <h3 className="font-medium mb-2">Next steps to maximize your success:</h3>
                              <ul className="space-y-2 text-sm">
                                <li className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  <span className="text-gray-500">Complete basic profile</span>
                                </li>
                                <li className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  <span className="text-gray-500">Add first property</span>
                                </li>
                                <li className="flex items-center">
                                  <div className="h-4 w-4 border border-gray-300 rounded-full mr-2 flex items-center justify-center">
                                    <span className="text-[9px] font-medium">3</span>
                                  </div>
                                  <span>Connect preferred title company</span>
                                </li>
                                <li className="flex items-center">
                                  <div className="h-4 w-4 border border-gray-300 rounded-full mr-2 flex items-center justify-center">
                                    <span className="text-[9px] font-medium">4</span>
                                  </div>
                                  <span>Upload assignment contract template</span>
                                </li>
                                <li className="flex items-center">
                                  <div className="h-4 w-4 border border-gray-300 rounded-full mr-2 flex items-center justify-center">
                                    <span className="text-[9px] font-medium">5</span>
                                  </div>
                                  <span>Add cash buyer list</span>
                                </li>
                              </ul>
                              <div className="mt-3">
                                <Button size="sm" className="w-full bg-[#135341]">Complete Setup</Button>
                              </div>
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <span className="text-sm font-medium">40%</span>
                    </div>
                    <Progress value={40} className="h-2 bg-gray-100" indicatorColor="bg-[#135341]" />
                  </div>
                </div>
                
                {/* Smart Stats Card */}
                <div className="bg-white px-4 py-3 rounded-lg shadow-sm border w-full md:max-w-xs flex-shrink-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1 text-[#135341]" /> Deal Performance
                    </h3>
                    <Badge variant="outline" className="text-xs text-[#135341] border-[#135341]/30">This Month</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 border-b pb-2 mb-2">
                    <span>Assignment Average</span>
                    <span className="font-medium text-black">${ANALYTICS_DATA.avgAssignmentFee.toLocaleString()}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <ArrowUp className="h-3 w-3 text-green-500 mr-1" /> 
                        Fastest Assignment
                      </span>
                      <span className="font-medium">3 days</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Cash Buyer Conversion</span>
                      <span className="font-medium">{ANALYTICS_DATA.conversionRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Properties Viewed</span>
                      <span className="font-medium">{ANALYTICS_DATA.viewsThisMonth}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Key Stats for Seller */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 border-t">
              <div className="p-4 text-center">
                <p className="text-sm font-medium text-gray-500">Active Listings</p>
                <p className="text-xl font-bold text-[#135341]">{PROPERTY_DATA.filter(p => p.status === 'Live').length}</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-medium text-gray-500">Avg. Days Listed</p>
                <p className="text-xl font-bold text-[#135341]">{ANALYTICS_DATA.avgTimeOnMarket}</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-medium text-gray-500">Pending Offers</p>
                <p className="text-xl font-bold text-[#135341]">{OFFER_DATA.filter(o => o.status === 'Pending').length}</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-medium text-gray-500">Assignment Revenue</p>
                <p className="text-xl font-bold text-[#135341]">${ANALYTICS_DATA.avgAssignmentFee * ANALYTICS_DATA.dealsAssigned}</p>
              </div>
            </div>
          </div>
          
          {/* Property Cards Grid - with Add New CTA */}
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-800">Your Properties</h2>
              <p className="text-sm text-gray-500">Manage all your active and past property listings</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search properties..." className="pl-9 pr-4 h-9 w-full md:w-[200px]" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="contract">Under Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Add New Property Card */}
            <Card 
              className="overflow-hidden hover:shadow-md transition-shadow border border-dashed border-gray-300 bg-gray-50 flex flex-col justify-center items-center p-8 h-full min-h-[320px] group cursor-pointer"
              onClick={() => setWizardOpen(true)}
            >
              <div className="h-16 w-16 rounded-full bg-[#135341]/10 flex items-center justify-center mb-4 group-hover:bg-[#135341]/20 transition-colors">
                <Plus className="h-8 w-8 text-[#135341]" />
              </div>
              <h3 className="text-lg font-bold text-[#135341] mb-2">Add New Property</h3>
              <p className="text-sm text-gray-500 text-center mb-6">Quickly list a new property and get it in front of qualified buyers</p>
              <Button className="bg-[#135341] hover:bg-[#135341]/90">Add Property</Button>
            </Card>
            
            {/* Map through property data to render cards */}
            {PROPERTY_DATA.map(property => renderPropertyCard(property))}
          </div>
          
          {/* Smart Prompts Section */}
          <Card className="border border-amber-200 bg-amber-50 mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-800 flex items-center text-lg">
                <Sparkles className="h-5 w-5 mr-2 text-amber-600" /> Smart Prompts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-2 bg-white rounded-md border border-amber-100">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-900">Inspection period ending tomorrow for Modern Farmhouse</p>
                    <p className="text-xs text-amber-700 mt-1">Schedule a walkthrough with the buyer to ensure all is on track for closing.</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-amber-400 text-amber-700 hover:bg-amber-100">
                    Schedule Now
                  </Button>
                </div>
                
                <div className="flex items-start gap-3 p-2 bg-white rounded-md border border-amber-100">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Eye className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-900">Colonial Revival has 6 new views in the last 24 hours</p>
                    <p className="text-xs text-amber-700 mt-1">Consider following up with interested parties to encourage offers.</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-amber-400 text-amber-700 hover:bg-amber-100">
                    Send Message
                  </Button>
                </div>
                
                <div className="flex items-start gap-3 p-2 bg-white rounded-md border border-amber-100">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-900">Your average time to assign is 9 days</p>
                    <p className="text-xs text-purple-700 mt-1">Ranch Style Home has been listed for 3 days. Take action now to beat your average!</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-purple-400 text-purple-700 hover:bg-purple-100">
                    View Tips
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Messages Tab Content */}
        <TabsContent value="messages" className="space-y-4">
          {/* Messaging Interface - Mobile Optimized (iMessage/Facebook style) */}
          <div className="bg-white rounded-lg shadow-md border overflow-hidden">
            <div className="md:flex h-[650px]">
              {/* Left sidebar with conversations - full width on mobile, hidden when viewing a conversation */}
              <div 
                className={`w-full md:w-1/3 md:border-r overflow-y-auto h-full ${showConversationDetail ? 'hidden' : 'block'} md:block`}
              >
                <div className="p-3 border-b sticky top-0 bg-white z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Messages</h3>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Filter className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Search className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex mt-2 border rounded-md overflow-hidden">
                    <Button variant="ghost" className="flex-1 rounded-none py-1 px-2 text-xs bg-[#135341] text-white hover:bg-[#135341]/90">All</Button>
                    <Button variant="ghost" className="flex-1 rounded-none py-1 px-2 text-xs hover:bg-gray-100">Unread</Button>
                    <Button variant="ghost" className="flex-1 rounded-none py-1 px-2 text-xs hover:bg-gray-100">Offers</Button>
                    <Button variant="ghost" className="flex-1 rounded-none py-1 px-2 text-xs hover:bg-gray-100">Internal</Button>
                  </div>
                </div>
                
                <div className="divide-y">
                  {MESSAGE_DATA.map(message => (
                    <div 
                      key={message.id}
                      className={`p-3 hover:bg-gray-50 cursor-pointer ${message.id === activeConversation ? 'bg-[#135341]/5' : ''}`}
                      onClick={() => handleOpenConversation(message.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`h-10 w-10 rounded-full ${getAvatarBackground(message.sender.type)} flex items-center justify-center font-medium`}>
                          {message.sender.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium truncate">{message.sender.name}</p>
                            <p className="text-xs text-gray-500">{message.time}</p>
                          </div>
                          <div className="flex items-center">
                            {message.unread && (
                              <Badge className="h-2 w-2 rounded-full bg-[#135341] mr-1.5 p-0" variant="default" />
                            )}
                            <p className="text-xs text-gray-600 truncate">{message.lastMessage}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3">
                  <Button variant="outline" size="sm" className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" /> New Message
                  </Button>
                </div>
              </div>
              
              {/* Main chat area - conditionally shown/hidden based on mobile state */}
              <div className={`${showConversationDetail ? 'flex' : 'hidden'} md:flex w-full md:w-2/3 flex-col h-full`}>
                <div className="p-3 border-b flex items-center justify-between sticky top-0 bg-white z-20">
                  <div className="flex items-center">
                    <button 
                      className="h-8 w-8 flex items-center justify-center mr-2 text-gray-600 md:hidden"
                      onClick={() => setShowConversationDetail(false)}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className={`h-10 w-10 rounded-full ${getAvatarBackground(activeMessage.sender.type)} flex items-center justify-center font-medium mr-2`}>
                      {activeMessage.sender.initials}
                    </div>
                    <div>
                      <p className="font-medium">{activeMessage.sender.name}</p>
                      <p className="text-xs text-gray-500">{activeMessage.sender.type === 'buyer' ? 'Buyer' : activeMessage.sender.type === 'rep' ? 'REP' : 'Title Company'} • {activeMessage.propertyTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Property</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Unread</DropdownMenuItem>
                        <DropdownMenuItem>Mute Conversation</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Block</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-gray-50">
                  {/* Conversation date divider */}
                  <div className="flex justify-center">
                    <div className="bg-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full">
                      Today
                    </div>
                  </div>
                  
                  {/* Show messages if available */}
                  {activeMessage.messages.map(msg => (
                    <div key={msg.id} className={`flex justify-${msg.senderId === 'user001' ? 'end' : 'start'} mb-3`}>
                      {msg.senderId !== 'user001' && (
                        <div className="flex items-end gap-1">
                          <div className={`h-8 w-8 rounded-full ${getAvatarBackground(activeMessage.sender.type)} flex-shrink-0 flex items-center justify-center font-medium mr-1 mb-1 hidden sm:flex`}>
                            {activeMessage.sender.initials}
                          </div>
                          <div>
                            <div className="bg-white rounded-2xl rounded-bl-sm p-3 shadow-sm max-w-[85%] sm:max-w-[80%]">
                              <p className="text-sm">{msg.text}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 ml-1">{msg.time}</p>
                          </div>
                        </div>
                      )}
                      
                      {msg.senderId === 'user001' && (
                        <div>
                          <div className="bg-[#135341] text-white rounded-2xl rounded-br-sm p-3 shadow-sm max-w-[85%] sm:max-w-[80%]">
                            <p className="text-sm">{msg.text}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 mr-1 text-right">{msg.time}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* If no messages available */}
                  {activeMessage.messages.length === 0 && (
                    <div className="flex justify-center items-center h-40">
                      <div className="text-center text-gray-500">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>No messages in this conversation yet.</p>
                        <p className="text-sm">Start the conversation by sending a message below.</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Message templates dropdown */}
                <div className="px-3 pt-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full text-sm">
                        <Text className="h-4 w-4 mr-2" /> Quick Templates
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80">
                      <DropdownMenuItem className="cursor-pointer" onClick={() => console.log("Template selected")}>
                        Yes, the property is still available. Would you like to schedule a viewing?
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => console.log("Template selected")}>
                        I've attached the contract. Please review and let me know if you have questions.
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => console.log("Template selected")}>
                        Great news! I'm planning to assign the contract today. Can you confirm your closing timeline?
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => console.log("Template selected")}>
                        Thanks for your offer. I'm reviewing all offers tonight and will get back to you tomorrow.
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        <Plus className="h-4 w-4 mr-2" /> Create new template
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="p-2 sm:p-3 border-t sticky bottom-0 bg-white">
                  <div className="flex items-center space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 p-0 rounded-full flex-shrink-0">
                          <Plus className="h-5 w-5 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem className="cursor-pointer">
                          <Paperclip className="h-4 w-4 mr-2" /> Attach File
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Image className="h-4 w-4 mr-2" /> Send Image
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <FileText className="h-4 w-4 mr-2" /> Send Contract
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <input 
                      type="text" 
                      placeholder="Message..." 
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#135341]/30 text-sm"
                    />
                    <Button size="icon" className="h-9 w-9 p-0 bg-[#135341] rounded-full flex-shrink-0">
                      <SendHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Pipeline Tab Content */}
        <TabsContent value="pipeline" className="space-y-6">
          {/* Pipeline View - Kanban board */}
          <div className="bg-white rounded-lg shadow-md border overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Deal Pipeline</h2>
                <p className="text-sm text-gray-500">Track the progress of all your deals through each stage</p>
              </div>
              <Select defaultValue="active">
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="all">All Deals</SelectItem>
                  <SelectItem value="closed">Closed Deals</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Kanban board - horizotally scrollable */}
            <div className="p-4 overflow-x-auto">
              <div className="flex gap-4 min-w-max pb-2">
                {PIPELINE_STAGES.map(stage => (
                  <div key={stage} className="w-[280px] flex-shrink-0">
                    <div className="bg-gray-100 p-2 rounded-lg mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm">{stage}</h3>
                        <Badge variant="outline" className="text-xs bg-white">
                          {PROPERTY_DATA.filter(p => getPipelineStatus(p.status) === stage).length}
                        </Badge>
                      </div>
                      {stage === 'Submitted' && (
                        <Button variant="ghost" size="sm" className="w-full flex items-center justify-center text-xs h-7 gap-1">
                          <Plus className="h-3 w-3" /> Add New Deal
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {PROPERTY_DATA
                        .filter(p => getPipelineStatus(p.status) === stage)
                        .map(property => (
                          <Card key={property.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm text-[#135341]">{property.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {formatCurrency(property.price)}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 mb-2 truncate">{property.address}</p>
                            <div className="flex text-xs text-gray-500 justify-between">
                              <span>{property.beds}b/{property.baths}ba</span>
                              <span>{property.daysListed}d</span>
                              <span className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" /> {property.views}
                              </span>
                            </div>
                            <Progress 
                              value={(PIPELINE_STAGES.indexOf(getPipelineStatus(property.status)) + 1) * (100 / PIPELINE_STAGES.length)} 
                              className="h-1 mt-2 bg-gray-100" 
                              indicatorColor="bg-[#135341]" 
                            />
                          </Card>
                        ))}
                      
                      {PROPERTY_DATA.filter(p => getPipelineStatus(p.status) === stage).length === 0 && (
                        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg h-32 flex items-center justify-center">
                          <p className="text-xs text-gray-400">No properties in this stage</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Deal Detail View - conditionally shown */}
          {showDetailView && (
            <Card className="shadow-md border">
              <CardHeader className="bg-[#135341]/5 flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mb-2"
                    onClick={() => setShowDetailView(false)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back to Pipeline
                  </Button>
                  <CardTitle className="text-lg text-[#135341]">
                    Colonial Revival
                  </CardTitle>
                  <CardDescription>
                    123 Main St, Chicago, IL 60601
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-[#135341]/10 text-[#135341] border-[#135341]/30">$625,000</Badge>
                  <Badge className="bg-green-500 hover:bg-green-600">Live</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border-b">
                  <Tabs defaultValue="overview">
                    <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto">
                      <TabsTrigger 
                        value="overview" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#135341] data-[state=active]:bg-transparent data-[state=active]:text-[#135341] text-sm"
                      >
                        Overview
                      </TabsTrigger>
                      <TabsTrigger 
                        value="details" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#135341] data-[state=active]:bg-transparent data-[state=active]:text-[#135341] text-sm"
                      >
                        Listing Info
                      </TabsTrigger>
                      <TabsTrigger 
                        value="offers" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#135341] data-[state=active]:bg-transparent data-[state=active]:text-[#135341] text-sm"
                      >
                        Offers
                      </TabsTrigger>
                      <TabsTrigger 
                        value="schedule" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#135341] data-[state=active]:bg-transparent data-[state=active]:text-[#135341] text-sm"
                      >
                        Walkthroughs
                      </TabsTrigger>
                      <TabsTrigger 
                        value="checklist" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#135341] data-[state=active]:bg-transparent data-[state=active]:text-[#135341] text-sm"
                      >
                        TC Checklist
                      </TabsTrigger>
                      <TabsTrigger 
                        value="notes" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#135341] data-[state=active]:bg-transparent data-[state=active]:text-[#135341] text-sm"
                      >
                        Notes
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="p-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">Timeline Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">Contract Signed</p>
                                    <p className="text-xs text-gray-500">Apr 10, 2025</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded-full bg-[#135341]/10 flex items-center justify-center text-xs font-medium">
                                    2
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">Find Buyer</p>
                                    <p className="text-xs text-gray-500">In progress - 3 offers received</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                                    3
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">Inspection Period</p>
                                    <p className="text-xs text-gray-500">Not started</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                                    4
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">Title Cleared</p>
                                    <p className="text-xs text-gray-500">Not started</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                                    5
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">Assigned</p>
                                    <p className="text-xs text-gray-500">Expected May 15, 2025</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-2">
                                <Button size="sm" className="bg-[#135341]">
                                  <MessageSquare className="h-4 w-4 mr-1" /> Message Buyers
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Share2 className="h-4 w-4 mr-1" /> Share Listing
                                </Button>
                                <Button size="sm" variant="outline">
                                  <FileText className="h-4 w-4 mr-1" /> View Contract
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Calendar className="h-4 w-4 mr-1" /> Schedule Showing
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4 mr-1" /> Edit Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="space-y-6">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">Activity Stats</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-xs text-gray-500">Total Views</p>
                                  <p className="text-xl font-bold text-[#135341]">42</p>
                                  <div className="flex items-center mt-1 text-xs text-green-600">
                                    <ArrowUp className="h-3 w-3 mr-1" /> +12 this week
                                  </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-xs text-gray-500">Offers Received</p>
                                  <p className="text-xl font-bold text-[#135341]">3</p>
                                  <div className="flex items-center mt-1 text-xs text-green-600">
                                    <ArrowUp className="h-3 w-3 mr-1" /> New offer today
                                  </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-xs text-gray-500">Days Listed</p>
                                  <p className="text-xl font-bold text-[#135341]">12</p>
                                  <div className="flex items-center mt-1 text-xs text-gray-500">
                                    Avg: {ANALYTICS_DATA.avgTimeOnMarket} days
                                  </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-xs text-gray-500">REP Shares</p>
                                  <p className="text-xl font-bold text-[#135341]">7</p>
                                  <div className="flex items-center mt-1 text-xs text-amber-600">
                                    <Clock className="h-3 w-3 mr-1" /> 2 recent shares
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">Top Offer</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-700 font-medium">
                                  DB
                                </div>
                                <div>
                                  <p className="font-medium">David Wilson</p>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <DollarSign className="h-3 w-3 mr-1" /> Offering: {formatCurrency(615000)} 
                                    <span className="mx-1">•</span>
                                    <Badge className="h-2 w-2 rounded-full bg-red-500 mr-1.5 p-0" variant="default" />
                                    <span>Pending Response</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center border-t pt-3">
                                <div>
                                  <p className="text-xs text-gray-500">AI Offer Score</p>
                                  <div className="flex items-center">
                                    <p className="font-bold text-lg text-[#135341]">6.8</p>
                                    <span className="text-xs text-gray-500 ml-1">/10</span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">Decline</Button>
                                  <Button size="sm" variant="outline">Counter</Button>
                                  <Button size="sm" className="bg-[#135341]">Accept</Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Offers Tab Content */}
        <TabsContent value="offers" className="space-y-6">
          <Card className="shadow-md border">
            <CardHeader className="bg-[#135341]/5 pb-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle className="text-xl text-[#135341]">Offer Management</CardTitle>
                  <CardDescription>Review and manage offers across all your properties</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search offers..." className="pl-9 pr-4 h-9 w-full md:w-[200px]" />
                  </div>
                  <Select defaultValue="pending">
                    <SelectTrigger className="w-[130px] h-9">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Offers</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Property</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="hidden md:table-cell">Timeline</TableHead>
                    <TableHead className="hidden md:table-cell">AI Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {OFFER_DATA.map(offer => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">{offer.propertyTitle}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0">{offer.buyerName}</div>
                          <div className="flex">
                            {offer.buyerVerified && (
                              <Badge variant="outline" className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border-green-200 mr-1">
                                <CheckCircle className="h-3 w-3" /> Verified
                              </Badge>
                            )}
                            {offer.buyerPOF && (
                              <Badge variant="outline" className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border-blue-200">
                                <FileCheck className="h-3 w-3" /> POF
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(offer.amount)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {offer.closingTimeline}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <span className={`font-bold ${
                            offer.aiScore >= 8 ? 'text-green-600' : 
                            offer.aiScore >= 6 ? 'text-amber-600' : 
                            'text-gray-600'
                          }`}>
                            {offer.aiScore}
                          </span>
                          <span className="text-gray-400 ml-1">/10</span>
                          <Badge 
                            className={`ml-2 ${
                              offer.aiScore >= 8 ? 'bg-green-100 text-green-700' : 
                              offer.aiScore >= 6 ? 'bg-amber-100 text-amber-700' : 
                              'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {offer.aiScore >= 8 ? 'Strong' : 
                             offer.aiScore >= 6 ? 'Good' : 
                             'Fair'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Counter Offer</DropdownMenuItem>
                            <DropdownMenuItem>Accept Offer</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Decline Offer</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Smart offer recommendation */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 flex gap-3 items-start">
              <Sparkles className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Offer Recommendation</h4>
                <p className="text-sm text-amber-700 mb-3">
                  You've received a strong offer from Jennifer Lee on your Modern Farmhouse property. 
                  This buyer has a history of closing quickly with minimal contingencies.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-amber-300 bg-white text-amber-700 hover:bg-amber-100">
                    View Offer Details
                  </Button>
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                    Accept Offer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab Content */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-3 shadow-md border">
              <CardHeader className="bg-[#135341]/5 pb-4">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl text-[#135341]">Performance Dashboard</CardTitle>
                    <CardDescription>Track your wholesaling metrics and deal performance</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="3m">
                      <SelectTrigger className="w-[130px] h-9">
                        <SelectValue placeholder="Date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1m">Last Month</SelectItem>
                        <SelectItem value="3m">Last 3 Months</SelectItem>
                        <SelectItem value="1y">Last Year</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="h-9">
                      <FileUp className="h-4 w-4 mr-1" /> Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <Card className="border-l-4 border-l-[#135341]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Deals Posted</CardTitle>
                      <Building className="h-4 w-4 text-[#135341]" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{ANALYTICS_DATA.dealsPosted}</div>
                      <p className="text-xs text-muted-foreground">
                        Properties listed
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-[#135341]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Deals Assigned</CardTitle>
                      <CheckCircle className="h-4 w-4 text-[#135341]" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{ANALYTICS_DATA.dealsAssigned}</div>
                      <p className="text-xs text-muted-foreground">
                        Properties assigned
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-[#135341]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg. Assignment</CardTitle>
                      <DollarSign className="h-4 w-4 text-[#135341]" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${ANALYTICS_DATA.avgAssignmentFee.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        Average fee per deal
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-[#135341]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                      <BarChart3 className="h-4 w-4 text-[#135341]" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{ANALYTICS_DATA.conversionRate}%</div>
                      <p className="text-xs text-muted-foreground">
                        Listings to assignments
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">Monthly Revenue</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <BarChart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <p>Revenue chart showing month-by-month growth</p>
                        <p className="text-sm">Chart visualization would appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">Top Performing Areas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <Map className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                          <p>Heatmap of most profitable zip codes</p>
                          <p className="text-sm">Map visualization would appear here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Detailed Metrics</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Zip Code</TableHead>
                        <TableHead>Deals Closed</TableHead>
                        <TableHead>Avg. Assignment Fee</TableHead>
                        <TableHead>Avg. Days to Close</TableHead>
                        <TableHead className="text-right">Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ANALYTICS_DATA.performingZips.map(zip => (
                        <TableRow key={zip.zip}>
                          <TableCell className="font-medium">{zip.zip}</TableCell>
                          <TableCell>{zip.deals}</TableCell>
                          <TableCell>${zip.avgFee.toLocaleString()}</TableCell>
                          <TableCell>{Math.round(ANALYTICS_DATA.avgTimeOnMarket * 0.7)}-{Math.round(ANALYTICS_DATA.avgTimeOnMarket * 1.3)} days</TableCell>
                          <TableCell className="text-right">
                            <Badge className={zip.avgFee > 25000 ? "bg-green-500" : zip.avgFee > 20000 ? "bg-amber-500" : "bg-blue-500"}>
                              {zip.avgFee > 25000 ? "High" : zip.avgFee > 20000 ? "Medium" : "Average"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Resources Tab Content */}
        <TabsContent value="resources" className="space-y-6">
          <div className="bg-white rounded-lg shadow-md border overflow-hidden">
            <div className="p-4 border-b">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800">Wholesaler Resources</h2>
                <p className="text-sm text-gray-500">Educational content and guides to help grow your business</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant="outline" 
                  className={`cursor-pointer px-3 py-1.5 ${activeCategory === 'all' ? 'bg-[#135341] text-white border-[#135341]' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveCategory('all')}
                >
                  All Resources
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`cursor-pointer px-3 py-1.5 ${activeCategory === 'business' ? 'bg-[#135341] text-white border-[#135341]' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveCategory('business')}
                >
                  Business
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`cursor-pointer px-3 py-1.5 ${activeCategory === 'marketing' ? 'bg-[#135341] text-white border-[#135341]' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveCategory('marketing')}
                >
                  Marketing
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`cursor-pointer px-3 py-1.5 ${activeCategory === 'legal' ? 'bg-[#135341] text-white border-[#135341]' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveCategory('legal')}
                >
                  Legal
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`cursor-pointer px-3 py-1.5 ${activeCategory === 'guide' ? 'bg-[#135341] text-white border-[#135341]' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveCategory('guide')}
                >
                  Platform Guides
                </Badge>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {RESOURCE_DATA
                  .filter(resource => activeCategory === 'all' || resource.category.toLowerCase() === activeCategory)
                  .map(resource => (
                    <Card key={resource.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="relative h-40 bg-gray-200 overflow-hidden">
                        <img 
                          src={resource.image} 
                          alt={resource.title} 
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        <Badge className="absolute top-2 right-2 bg-white/80 text-gray-800">
                          {resource.readTime}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="outline" className="mb-2 text-xs">
                          {resource.category}
                        </Badge>
                        <h3 className="font-bold text-lg mb-2 text-[#135341] group-hover:text-[#135341]/80 transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                          {resource.description}
                        </p>
                        <Button variant="ghost" size="sm" className="text-[#135341] pl-0 flex items-center">
                          Read Article <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Marketing Tab Content */}
        <TabsContent value="marketing" className="space-y-6">
          <div className="bg-white rounded-lg shadow-md border overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-1">Marketing Center</h2>
              <p className="text-gray-500 mb-4">Promote your off-market deals across multiple channels</p>
              <MarketingTab />
            </div>
          </div>
        </TabsContent>
        
        {/* Tools Tab Content */}
        <TabsContent value="tools" className="space-y-6">
          <div className="bg-white rounded-lg shadow-md border overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Wholesaler Tools</h2>
                  <p className="text-sm text-gray-500">Specialized tools to streamline your business</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search tools..." className="pl-9 pr-4 h-9 w-full md:w-[250px]" />
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOOLS_DATA.map(tool => (
                  <Card key={tool.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className={`h-12 w-12 rounded-lg ${tool.color} flex items-center justify-center mb-4`}>
                        <tool.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{tool.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {tool.description}
                      </p>
                      <Button className="w-full bg-[#135341]">
                        Launch Tool
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Property Listing Wizard Dialog */}
      <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#135341]">Add New Property</DialogTitle>
            <DialogDescription>
              Follow the steps to add a new property to your listings
            </DialogDescription>
          </DialogHeader>
          
          {/* Wizard Steps Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {WIZARD_STEPS.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div 
                    className={`h-8 w-8 rounded-full flex items-center justify-center font-medium ${
                      index < wizardStep ? 'bg-green-100 text-green-700' : 
                      index === wizardStep ? 'bg-[#135341] text-white' : 
                      'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {index < wizardStep ? <CheckCircle className="h-5 w-5 text-green-600" /> : index + 1}
                  </div>
                  <span className="text-xs mt-1 text-center hidden sm:block">{step.label}</span>
                </div>
              ))}
            </div>
            <div className="relative h-1 bg-gray-100 rounded-full">
              <div 
                className="absolute top-0 left-0 h-1 bg-[#135341] rounded-full transition-all duration-300"
                style={{ width: `${(wizardStep / (WIZARD_STEPS.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Current Step Content */}
          <div className="py-2">
            <div className="space-y-1 mb-4">
              <h3 className="font-bold text-lg flex items-center">
                {(() => {
                  const StepIcon = WIZARD_STEPS[wizardStep].icon;
                  return <StepIcon className="mr-2 h-5 w-5 text-[#135341]" />;
                })()}
                {WIZARD_STEPS[wizardStep].label}
              </h3>
              <p className="text-sm text-gray-500">
                {wizardStep === 0 && "Enter the property's address to get started"}
                {wizardStep === 1 && "Provide the key details about the property"}
                {wizardStep === 2 && "Upload the necessary documents and photos"}
                {wizardStep === 3 && "Add pricing information and financial details"}
                {wizardStep === 4 && "Set marketing preferences and access controls"}
                {wizardStep === 5 && "Review all information before submitting"}
              </p>
            </div>
            
            {renderWizardStep()}
          </div>
          
          <DialogFooter className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="text-sm text-gray-500">
              Step {wizardStep + 1} of {WIZARD_STEPS.length}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setWizardOpen(false)}
                className="w-24"
              >
                Cancel
              </Button>
              {wizardStep > 0 && (
                <Button
                  variant="outline"
                  onClick={prevWizardStep}
                  className="w-24"
                >
                  Previous
                </Button>
              )}
              {wizardStep < WIZARD_STEPS.length - 1 ? (
                <Button 
                  onClick={nextWizardStep}
                  className="w-24 bg-[#135341]"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={() => setWizardOpen(false)}
                  className="w-24 bg-[#135341]"
                >
                  Submit
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}