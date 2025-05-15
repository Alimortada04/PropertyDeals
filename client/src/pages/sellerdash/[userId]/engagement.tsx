import React, { useState, useMemo, useRef } from "react";
import { useParams } from "wouter";
import { 
  Eye, 
  Bookmark, 
  MessageCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  Filter,
  Search,
  ChevronDown,
  Building2,
  X,
  Edit,
  Share,
  Clock,
  Info,
  CornerDownRight,
  Sparkles,
  Phone,
  Mail,
  Award,
  Users,
  ArrowUpRight,
  ArrowRight,
  CheckCircle,
  XCircle
} from "lucide-react";
import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from '@/hooks/use-media-query';

// Mock property data
const mockProperties = [
  {
    id: "p1",
    address: "456 Oak St, Madison, WI 53703",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop",
    price: 459000,
    beds: 4,
    baths: 3,
    sqft: 2750,
    status: "Live",
    daysListed: 8,
    viewCount: 236,
    viewTrend: {
      percentage: "+15%",
      direction: "up",
      fromLastWeek: true
    },
    saveCount: 42,
    saveTrend: {
      percentage: "+8%",
      direction: "up",
      fromLastWeek: true
    },
    offerCount: 3,
    offerTrend: {
      text: "New today",
      isNew: true
    },
    messageCount: 14,
    unreadMessages: 4,
    messageTrend: {
      text: "+3 today",
      isNew: true
    },
    lastResponseTime: 8, // hours
    hasUnreadMessages: true,
    hasNewOffers: true,
    needsAttention: true,
    milestones: [
      { type: "listed", date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
      { type: "100-views", date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
      { type: "1st-offer", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
    ],
    conversionStats: {
      saveToOffer: {
        saves: 42,
        offers: 3,
        rate: 7.1
      }
    }
  },
  {
    id: "p2",
    address: "123 Main St, Milwaukee, WI 53201",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2670&auto=format&fit=crop",
    price: 425000,
    beds: 3,
    baths: 2.5,
    sqft: 2150,
    status: "Under Contract",
    daysListed: 14,
    viewCount: 178,
    viewTrend: {
      percentage: "+5%",
      direction: "up",
      fromLastWeek: true
    },
    saveCount: 28,
    saveTrend: {
      percentage: "0%",
      direction: "neutral",
      fromLastWeek: true
    },
    offerCount: 2,
    offerTrend: {
      text: "None new",
      isNew: false
    },
    messageCount: 8,
    unreadMessages: 0,
    messageTrend: {
      text: "None new",
      isNew: false
    },
    lastResponseTime: 2, // hours
    hasUnreadMessages: false,
    hasNewOffers: false,
    needsAttention: false,
    milestones: [
      { type: "listed", date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
      { type: "100-views", date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
      { type: "1st-offer", date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
      { type: "offer-accepted", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
    ],
    conversionStats: {
      saveToOffer: {
        saves: 28,
        offers: 2,
        rate: 7.1
      }
    }
  },
  {
    id: "p3",
    address: "890 Maple Ave, Milwaukee, WI 53211",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2670&auto=format&fit=crop",
    price: 385000,
    beds: 3,
    baths: 2,
    sqft: 1850,
    status: "Live",
    daysListed: 5,
    viewCount: 143,
    viewTrend: {
      percentage: "+22%",
      direction: "up",
      fromLastWeek: true
    },
    saveCount: 19,
    saveTrend: {
      percentage: "+12%",
      direction: "up",
      fromLastWeek: true
    },
    offerCount: 0,
    offerTrend: {
      text: "None yet",
      isNew: false
    },
    messageCount: 6,
    unreadMessages: 2,
    messageTrend: {
      text: "+2 today",
      isNew: true
    },
    lastResponseTime: 5, // hours
    hasUnreadMessages: true,
    hasNewOffers: false,
    needsAttention: true,
    milestones: [
      { type: "listed", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { type: "100-views", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
    ],
    conversionStats: {
      saveToOffer: {
        saves: 19,
        offers: 0,
        rate: 0
      }
    }
  },
  {
    id: "p4",
    address: "742 Lakeside Dr, Madison, WI 53704",
    image: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?q=80&w=2670&auto=format&fit=crop",
    price: 1250000,
    beds: 5,
    baths: 4.5,
    sqft: 4850,
    status: "Live",
    daysListed: 32,
    viewCount: 87,
    viewTrend: {
      percentage: "+3%",
      direction: "up",
      fromLastWeek: true
    },
    saveCount: 15,
    saveTrend: {
      percentage: "+1%",
      direction: "up",
      fromLastWeek: true
    },
    offerCount: 1,
    offerTrend: {
      text: "1 week ago",
      isNew: false
    },
    messageCount: 4,
    unreadMessages: 0,
    messageTrend: {
      text: "None new",
      isNew: false
    },
    lastResponseTime: 1, // hours
    hasUnreadMessages: false,
    hasNewOffers: false,
    needsAttention: false,
    milestones: [
      { type: "listed", date: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000) },
      { type: "1st-offer", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    ],
    conversionStats: {
      saveToOffer: {
        saves: 15,
        offers: 1,
        rate: 6.7
      }
    }
  }
];

// Mock engagement timeline data
const mockTimeline = [
  {
    id: "e1",
    propertyId: "p1",
    type: "view",
    buyerName: "Jessica Brown",
    buyerType: "Agent",
    buyerVerified: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: "viewed",
    count: 5,
    isNew: true
  },
  {
    id: "e2",
    propertyId: "p1",
    type: "message",
    buyerName: "John Smith",
    buyerType: "Investor",
    buyerVerified: true,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: "new",
    message: "Following up on my previous message. I'm still very interested in this property and would appreciate any additional information you can provide. I've already secured financing and am ready to proceed quickly.",
    isNew: true
  },
  {
    id: "e3",
    propertyId: "p1",
    type: "offer",
    buyerName: "John Smith",
    buyerType: "Investor",
    buyerVerified: true,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    status: "new",
    offerAmount: 395000,
    offerTerms: {
      closingTimeframe: "30 days",
      contingencies: ["Inspection", "Financing"],
      earnestMoney: 10000
    },
    message: "I'm interested in this property and would like to make an offer of $395,000. I can close within 30 days and have proof of funds ready.",
    isNew: true
  },
  {
    id: "e4",
    propertyId: "p1",
    type: "save",
    buyerName: "Mike Williams",
    buyerType: "Investor",
    buyerVerified: false,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: "viewed",
    isNew: false
  },
  {
    id: "e5",
    propertyId: "p3",
    type: "message",
    buyerName: "Jessica Brown",
    buyerType: "Agent",
    buyerVerified: true,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    status: "new",
    message: "I have a client who is very interested in this property. We'd like to schedule a showing tomorrow afternoon if possible. Please let me know the available time slots. My client is pre-approved and can make a decision quickly.",
    isNew: true
  }
];

// Mock engaged buyers data
const mockBuyers = [
  {
    id: "b1",
    name: "John Smith",
    type: "Investor",
    verified: true,
    tags: ["Hot lead", "Pre-approved", "Cash buyer"],
    lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000)
  },
  {
    id: "b2",
    name: "Jessica Brown",
    type: "Agent",
    verified: true,
    tags: ["Agent", "Repeat visitor", "High budget"],
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: "b3",
    name: "Mike Williams",
    type: "Investor",
    verified: false,
    tags: ["Vacation property buyer", "Investor"],
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

// Animation variants for elements that fade in up
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// Animation variants for elements that fade in
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } }
};

export default function EngagementPage() {
  const { userId } = useParams();
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [selectedEngagementTypes, setSelectedEngagementTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<string>("most-recent");
  const { toast } = useToast();
  
  // References for scrolling to sections
  const activityTimelineRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const offersRef = useRef<HTMLDivElement>(null);
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  
  // Filter properties based on selected filters
  const filteredProperties = useMemo(() => {
    return mockProperties.filter(property => {
      // Filter by property ID if any selected
      if (selectedProperties.length > 0 && !selectedProperties.includes(property.id)) return false;
      
      // Search by property address
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        const matchesAddress = property.address.toLowerCase().includes(lowerQuery);
        if (!matchesAddress) return false;
      }
      
      return true;
    });
  }, [selectedProperties, searchQuery]);
  
  // Sort properties based on selected sort option
  const sortedProperties = useMemo(() => {
    const properties = [...filteredProperties];
    
    if (sorting === "most-recent") {
      return properties.sort((a, b) => a.daysListed - b.daysListed);
    } else if (sorting === "highest-offers") {
      return properties.sort((a, b) => b.offerCount - a.offerCount);
    } else if (sorting === "most-views") {
      return properties.sort((a, b) => b.viewCount - a.viewCount);
    }
    
    return properties;
  }, [filteredProperties, sorting]);
  
  // Filter timeline entries based on selected property and engagement types
  const filteredTimeline = useMemo(() => {
    return mockTimeline.filter(entry => {
      // Filter by property ID
      if (selectedPropertyId && entry.propertyId !== selectedPropertyId) return false;
      
      // Filter by engagement type
      if (selectedEngagementTypes.length > 0 && !selectedEngagementTypes.includes(entry.type)) return false;
      
      // Filter by status
      if (selectedStatus.length > 0 && !selectedStatus.includes(entry.status)) return false;
      
      return true;
    });
  }, [selectedPropertyId, selectedEngagementTypes, selectedStatus]);
  
  // Calculate aggregate metrics
  const metrics = useMemo(() => {
    const totalViews = mockProperties.reduce((sum, p) => sum + p.viewCount, 0);
    const totalSaves = mockProperties.reduce((sum, p) => sum + p.saveCount, 0);
    const totalOffers = mockProperties.reduce((sum, p) => sum + p.offerCount, 0);
    const totalMessages = mockProperties.reduce((sum, p) => sum + p.messageCount, 0);
    const totalUnreadMessages = mockProperties.reduce((sum, p) => sum + (p.unreadMessages || 0), 0);
    
    const activeProperties = mockProperties.filter(p => p.status === "Live").length;
    const avgViewsPerProperty = Math.round(totalViews / (activeProperties || 1));
    const avgSavesPerProperty = Math.round(totalSaves / (activeProperties || 1));
    const avgOffersPerProperty = (totalOffers / (activeProperties || 1)).toFixed(1);
    
    // Count unread messages and new offers
    const unreadMessages = totalUnreadMessages;
    const newOffers = mockProperties.filter(p => p.hasNewOffers).length;
    
    // Calculate response rate
    const totalResponses = mockEngagements.filter(e => e.type === "message" && e.status === "replied").length;
    const totalMessagesReceived = mockEngagements.filter(e => e.type === "message").length;
    const responseRate = Math.round((totalResponses / (totalMessagesReceived || 1)) * 100);
    
    // Calculate average response time
    const avgResponseTime = mockProperties.reduce((sum, p) => sum + p.lastResponseTime, 0) / activeProperties;
    
    // Overall save-to-offer conversion rate
    const saveToOfferRate = ((totalOffers / (totalSaves || 1)) * 100).toFixed(1);
    
    return {
      totalViews,
      totalSaves,
      totalOffers,
      totalMessages,
      unreadMessages,
      newOffers,
      avgViewsPerProperty,
      avgSavesPerProperty,
      avgOffersPerProperty,
      responseRate,
      avgResponseTime,
      saveToOfferRate
    };
  }, []);
  
  // Get property details
  const selectedProperty = useMemo(() => {
    if (!selectedPropertyId) return null;
    return mockProperties.find(p => p.id === selectedPropertyId) || null;
  }, [selectedPropertyId]);
  
  // Get engaged buyers for selected property
  const engagedBuyers = useMemo(() => {
    if (!selectedPropertyId) return [];
    return mockBuyers;
  }, [selectedPropertyId]);
  
  // Get property's timeline events
  const propertyTimeline = useMemo(() => {
    if (!selectedPropertyId) return [];
    return filteredTimeline.filter(entry => entry.propertyId === selectedPropertyId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [selectedPropertyId, filteredTimeline]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Handler functions
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
  
  const handleUseAI = () => {
    toast({
      title: "AI response generated",
      description: "A personalized response has been created based on this message.",
    });
  };
  
  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleShowOffersInbox = () => {
    toast({
      title: "Offers Inbox",
      description: "Opening offers inbox...",
    });
  };
  
  const handleMessageInbox = () => {
    if (selectedPropertyId) {
      scrollToSection(messagesRef);
    } else {
      toast({
        title: "Message Inbox",
        description: "Select a property to view messages.",
      });
    }
  };

  // Insight-driven metric cards
  const InsightMetricCard = ({ 
    emoji,
    icon: Icon, 
    title, 
    primaryValue, 
    secondaryValue, 
    trend,
    trendDirection,
    actionText,
    actionFn,
    highlight,
    tooltip
  }: { 
    emoji?: string;
    icon: React.ElementType;
    title: string;
    primaryValue: string | number;
    secondaryValue?: string;
    trend?: string;
    trendDirection?: 'up' | 'down' | 'neutral';
    actionText?: string;
    actionFn?: () => void;
    highlight?: boolean;
    tooltip?: string;
  }) => (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "rounded-lg shadow-sm border overflow-hidden bg-white hover:shadow-md transition-all",
        highlight ? "border-[#803344]" : "border-gray-200"
      )}
    >
      <CardContent className="p-5">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {emoji ? (
                <div className="text-2xl">{emoji}</div>
              ) : (
                <div className="p-2 rounded-full bg-gray-100">
                  <Icon className="h-5 w-5 text-gray-700" />
                </div>
              )}
              
              <div>
                <HoverCard openDelay={200}>
                  <HoverCardTrigger asChild>
                    <h3 className="font-medium text-gray-700 text-sm flex items-center">
                      {title}
                      {tooltip && <Info className="h-3 w-3 text-gray-400 ml-1" />}
                    </h3>
                  </HoverCardTrigger>
                  {tooltip && (
                    <HoverCardContent className="w-80 text-sm">
                      {tooltip}
                    </HoverCardContent>
                  )}
                </HoverCard>
              </div>
            </div>
            
            {highlight && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-2 py-0.5 rounded-full bg-[#803344] text-white text-xs font-medium"
              >
                New
              </motion.div>
            )}
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{primaryValue}</span>
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
          
          {actionText && actionFn && (
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs text-blue-600 justify-start hover:text-blue-800"
              onClick={actionFn}
            >
              {actionText}
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </motion.div>
  );

  // Response Rate Card Component
  const ResponseRateCard = ({
    responseRate,
    avgResponseTime,
    isGood
  }: {
    responseRate: number;
    avgResponseTime: number;
    isGood: boolean;
  }) => (
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
                  ({isGood ? "Good" : "Needs Improvement"})
                </span>
              </div>
              <div className="border-l pl-6">
                <span className="text-sm font-medium">Avg Response Time:</span>
                <span className="ml-2 text-sm">{avgResponseTime.toFixed(1)}h avg</span>
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
          <AlertTitle className="text-amber-800">Respond to improve your conversion rate</AlertTitle>
          <AlertDescription className="text-amber-700">
            Respond to inquiries within 4 hours to significantly improve your save-to-offer ratio.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
  
  // Property Card Component
  const PropertyCard = ({ property }: { property: typeof mockProperties[0] }) => (
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
          alt={property.address} 
          className="w-full h-40 object-cover"
        />
        {property.needsAttention && (
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
          <div 
            className="p-2 bg-gray-50 rounded text-center cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectProperty(property.id);
              if (activityTimelineRef.current) {
                setTimeout(() => scrollToSection(activityTimelineRef), 100);
              }
            }}
          >
            <p className="text-sm font-medium text-gray-900">{property.viewCount}</p>
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <Eye className="h-3 w-3 mr-1 text-blue-500" />
              <span>Views</span>
            </p>
          </div>
          <div 
            className="p-2 bg-gray-50 rounded text-center cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectProperty(property.id);
              if (activityTimelineRef.current) {
                setTimeout(() => scrollToSection(activityTimelineRef), 100);
              }
            }}
          >
            <p className="text-sm font-medium text-gray-900">{property.saveCount}</p>
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <Bookmark className="h-3 w-3 mr-1 text-amber-500" />
              <span>Saves</span>
            </p>
          </div>
          <div 
            className={cn(
              "p-2 rounded text-center cursor-pointer hover:bg-gray-100 transition-colors",
              property.hasNewOffers ? "bg-green-50" : "bg-gray-50"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectProperty(property.id);
              if (offersRef.current) {
                setTimeout(() => scrollToSection(offersRef), 100);
              }
            }}
          >
            <p className={cn(
              "text-sm font-medium flex items-center justify-center", 
              property.hasNewOffers ? "text-green-700" : "text-gray-900"
            )}>
              {property.offerCount}
              {property.hasNewOffers && <Badge className="ml-1.5 h-4 px-1 bg-green-100 text-green-800 border-green-300" variant="outline">New</Badge>}
            </p>
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <DollarSign className="h-3 w-3 mr-1 text-purple-500" />
              <span>Offers</span>
            </p>
          </div>
          <div 
            className={cn(
              "p-2 rounded text-center cursor-pointer hover:bg-gray-100 transition-colors",
              property.hasUnreadMessages ? "bg-blue-50" : "bg-gray-50"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectProperty(property.id);
              if (messagesRef.current) {
                setTimeout(() => scrollToSection(messagesRef), 100);
              }
            }}
          >
            <p className={cn(
              "text-sm font-medium flex items-center justify-center", 
              property.hasUnreadMessages ? "text-blue-700" : "text-gray-900"
            )}>
              {property.messageCount}
              {property.hasUnreadMessages && 
                <Badge className="ml-1.5 h-4 px-1 bg-blue-100 text-blue-800 border-blue-300" variant="outline">
                  {property.unreadMessages}
                </Badge>
              }
            </p>
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <MessageCircle className="h-3 w-3 mr-1 text-blue-500" />
              <span>Messages</span>
            </p>
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

  // Timeline Item Component
  const TimelineItem = ({ entry }: { entry: typeof mockTimeline[0] }) => (
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
                {entry.buyerName.split(' ').map(name => name[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-gray-900">{entry.buyerName}</span>
          </div>
          <span className="text-xs text-gray-500">{formatDistanceToNow(entry.timestamp, { addSuffix: true })}</span>
        </div>
        
        <div className="flex items-center mt-1">
          {entry.type === "view" && (
            <div className="flex items-center text-sm text-gray-600">
              <Eye className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
              <span>Viewed this property</span>
              {entry.count && (
                <span className="text-xs text-gray-500 ml-1.5">
                  ({entry.count} times)
                </span>
              )}
            </div>
          )}
          
          {entry.type === "save" && (
            <div className="flex items-center text-sm text-gray-600">
              <Bookmark className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
              <span>Saved this property</span>
            </div>
          )}
          
          {entry.type === "message" && (
            <div className="w-full">
              <div className="flex items-center text-sm text-gray-600">
                <MessageCircle className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                <span>Sent a message</span>
                {entry.status === "new" && (
                  <Badge variant="outline" className="ml-2 text-[10px] h-4 px-1 bg-green-50 text-green-700 border-green-200">
                    New
                  </Badge>
                )}
              </div>
              {entry.message && (
                <div className="mt-1.5 pl-5">
                  <p className="text-sm bg-gray-50 p-2 rounded-md border border-gray-100">
                    {entry.message.length > 120 
                      ? entry.message.substring(0, 120) + "..." 
                      : entry.message
                    }
                  </p>
                  <div className="flex justify-end mt-1.5">
                    <Button 
                      variant="outline" 
                      className="h-7 text-xs gap-1 mr-2 hover:bg-gray-200"
                      onClick={handleUseAI}
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
          
          {entry.type === "offer" && (
            <div className="w-full">
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
                <span>Made an offer</span>
                {entry.status === "new" && (
                  <Badge variant="outline" className="ml-2 text-[10px] h-4 px-1 bg-purple-50 text-purple-700 border-purple-200">
                    New
                  </Badge>
                )}
              </div>
              <div className="mt-1.5 pl-5">
                <div className="flex items-center text-sm font-medium">
                  <span>Offer Amount: {formatCurrency(entry.offerAmount)}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  <Badge variant="outline" className="text-[10px]">
                    {entry.offerTerms.closingTimeframe} close
                  </Badge>
                  {entry.offerTerms.contingencies.map((contingency, i) => (
                    <Badge key={i} variant="outline" className="text-[10px]">
                      {contingency}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="text-[10px]">
                    ${entry.offerTerms.earnestMoney} earnest
                  </Badge>
                </div>
                {entry.message && (
                  <p className="text-sm bg-gray-50 p-2 rounded-md border border-gray-100 mt-2">
                    {entry.message.length > 100 
                      ? entry.message.substring(0, 100) + "..." 
                      : entry.message
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

  // Engaged Buyer Component
  const EngagedBuyerItem = ({ buyer }: { buyer: typeof mockBuyers[0] }) => (
    <div className="p-3 border rounded-md hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback>
              {buyer.name.split(' ').map(name => name[0]).join('')}
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
              <span className="ml-2">Last activity: {formatDistanceToNow(buyer.lastActivity, { addSuffix: true })}</span>
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
        {buyer.tags.map((tag, i) => (
          <Badge key={i} variant="secondary" className="px-2 py-0.5 text-[10px] bg-gray-100 text-gray-700">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
  
  // Save to Offer Conversion Component
  const SaveToOfferConversion = ({ property }: { property: typeof mockProperties[0] }) => {
    const { saves, offers, rate } = property.conversionStats.saveToOffer;
    
    return (
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
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${Math.min(100, rate)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>{rate}%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="text-sm mt-3">
          <span className="font-medium">{saves} saves</span>
          <span className="mx-2">→</span>
          <span className="font-medium">{offers} offers</span>
        </div>
        
        {(saves > offers) && (
          <div className="mt-2 text-sm text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200">
            <span className="font-medium">{saves - offers} buyers</span> saved this property but didn't offer — follow up!
          </div>
        )}
      </div>
    );
  };
  
  // Property Timeline Component
  const PropertyTimelineComponent = ({ property }: { property: typeof mockProperties[0] }) => {
    return (
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-4">Property Timeline</h3>
        <div className="relative pt-2 pb-10">
          <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 rounded-full" />
          
          <div className="relative">
            {/* Listing Date */}
            <div className="absolute -left-2 flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-green-500 z-10" />
              <div className="text-xs text-gray-500 mt-1 whitespace-nowrap max-w-[80px] text-center">
                Listed<br />{format(property.milestones.find(m => m.type === "listed")?.date || new Date(), 'MMM d')}
              </div>
            </div>
            
            {/* 100+ Views Milestone (if applicable) */}
            {property.milestones.find(m => m.type === "100-views") && (
              <div className="absolute left-1/3 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-blue-400 z-10" />
                <div className="text-xs text-gray-500 mt-1 whitespace-nowrap text-center">
                  100+ Views<br />
                  {format(property.milestones.find(m => m.type === "100-views")?.date || new Date(), 'MMM d')}
                </div>
              </div>
            )}
            
            {/* First Offer (if applicable) */}
            {property.milestones.find(m => m.type === "1st-offer") && (
              <div className="absolute left-2/3 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-purple-500 z-10" />
                <div className="text-xs text-gray-500 mt-1 whitespace-nowrap text-center">
                  First Offer<br />
                  {format(property.milestones.find(m => m.type === "1st-offer")?.date || new Date(), 'MMM d')}
                </div>
              </div>
            )}
            
            {/* Offer Accepted (if applicable) */}
            {property.milestones.find(m => m.type === "offer-accepted") && (
              <div className="absolute left-5/6 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-green-600 z-10" />
                <div className="text-xs text-gray-500 mt-1 whitespace-nowrap text-center">
                  Offer Accepted<br />
                  {format(property.milestones.find(m => m.type === "offer-accepted")?.date || new Date(), 'MMM d')}
                </div>
              </div>
            )}
            
            {/* Target Close Date (if no offer accepted) */}
            {!property.milestones.find(m => m.type === "offer-accepted") && (
              <div className="absolute right-0 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-gray-400 z-10" />
                <div className="text-xs text-gray-500 mt-1 whitespace-nowrap text-center">
                  Target Close<br />
                  {format(new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), 'MMM d')}
                </div>
              </div>
            )}
          </div>
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
          
          {/* Top summary section - Insight-driven metric cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InsightMetricCard 
              icon={Eye}
              emoji="👁️"
              title="Total Views" 
              primaryValue={metrics.totalViews}
              secondaryValue={`Avg ${metrics.avgViewsPerProperty} per property`}
              trend="+15% from last week"
              trendDirection="up"
              tooltip="Total views of all your properties. Average is calculated based on active listings only."
            />
            
            <MetricCard 
              icon={Bookmark} 
              title="Saves" 
              value={metrics.totalSaves}
              secondaryValue={`Avg ${metrics.avgSavesPerProperty} per property`}
              trend="+8% from last week"
              trendDirection="up"
            />
            
            <MetricCard 
              icon={DollarSign} 
              title="Offers" 
              value={metrics.totalOffers}
              secondaryValue={`Avg ${metrics.avgOffersPerProperty.toFixed(1)} per deal`}
              trend={metrics.newOffers > 0 ? "New offer today" : "None new"}
              trendDirection={metrics.newOffers > 0 ? "up" : "neutral"}
              highlight={metrics.newOffers > 0}
            />
            
            <MetricCard 
              icon={MessageCircle} 
              title="Messages" 
              value={metrics.totalMessages}
              secondaryValue={metrics.unreadMessages > 0 ? `${metrics.unreadMessages} unread` : "All read"}
              trend="+3 today"
              trendDirection="up"
              highlight={metrics.unreadMessages > 0}
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
                      <span className="text-2xl font-bold">50%</span>
                      <span className="ml-2 text-sm text-gray-500">
                        (Needs Improvement)
                      </span>
                    </div>
                    <div className="border-l pl-6">
                      <span className="text-sm font-medium">Avg Response Time:</span>
                      <span className="ml-2 text-sm">8 hours</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="text-sm text-gray-500 mb-1">Goal: 90%+ response rate</div>
                <div className="w-full max-w-xs h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: '50%' }}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-800">Respond to improve your conversion rate</AlertTitle>
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
                      className="absolute right-1 top-1 h-7 w-7 rounded-full hover:bg-gray-200"
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
                {sortedProperties.length === 0 ? (
                  <div className="text-center p-6 border rounded-lg bg-gray-50">
                    <p className="text-gray-500">No properties match your filters</p>
                  </div>
                ) : (
                  sortedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))
                )}
              </div>
            </div>
            
            {/* Right: Property engagement panel */}
            <div className="lg:col-span-2">
              {selectedPropertyId && selectedProperty ? (
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
                            src={selectedProperty.image} 
                            alt={selectedProperty.address} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h2 className="font-bold text-gray-900">
                            {selectedProperty.address}
                          </h2>
                          <p className="text-gray-500 mt-0.5">
                            {formatCurrency(selectedProperty.price)} · {selectedProperty.beds} bd · {selectedProperty.baths} ba · {selectedProperty.sqft} sqft
                          </p>
                          <div className="flex items-center mt-1.5">
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs",
                                selectedProperty.status === "Live" ? "border-green-200 text-green-700 bg-green-50" : 
                                selectedProperty.status === "Under Contract" ? "border-blue-200 text-blue-700 bg-blue-50" : 
                                "border-gray-200 text-gray-700 bg-gray-50"
                              )}
                            >
                              {selectedProperty.status}
                            </Badge>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-xs text-gray-500">
                              {selectedProperty.daysListed} {selectedProperty.daysListed === 1 ? 'day' : 'days'} listed
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
                            <span className="text-xs text-green-600">{selectedProperty.viewTrend}</span>
                          </div>
                        </div>
                        <p className="text-2xl font-bold mt-1">{selectedProperty.viewCount}</p>
                      </div>
                      
                      <div className="p-3 border rounded-md bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Bookmark className="h-4 w-4 text-amber-500 mr-2" />
                            <span className="text-sm font-medium">Saves</span>
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-xs text-green-600">{selectedProperty.saveTrend}</span>
                          </div>
                        </div>
                        <p className="text-2xl font-bold mt-1">{selectedProperty.saveCount}</p>
                      </div>
                      
                      <div className="p-3 border rounded-md bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm font-medium">Messages</span>
                          </div>
                          <div className="flex items-center">
                            {selectedProperty.messageTrend.includes("+") ? (
                              <>
                                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                                <span className="text-xs text-green-600">{selectedProperty.messageTrend}</span>
                              </>
                            ) : (
                              <span className="text-xs text-gray-500">{selectedProperty.messageTrend}</span>
                            )}
                          </div>
                        </div>
                        <p className="text-2xl font-bold mt-1">{selectedProperty.messageCount}</p>
                      </div>
                      
                      <div className="p-3 border rounded-md bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-purple-500 mr-2" />
                            <span className="text-sm font-medium">Offers</span>
                          </div>
                          {selectedProperty.offerTrend.includes("New") ? (
                            <div className="flex items-center">
                              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                              <span className="text-xs text-green-600">{selectedProperty.offerTrend}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">{selectedProperty.offerTrend}</span>
                          )}
                        </div>
                        <p className="text-2xl font-bold mt-1">{selectedProperty.offerCount}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content sections */}
                  <div className="divide-y">
                    {/* Activity timeline */}
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-4">Activity Timeline</h3>
                      <ScrollArea className="h-[280px] pr-4">
                        <div className="space-y-1">
                          {filteredTimeline.length > 0 ? (
                            filteredTimeline.map((entry) => (
                              <TimelineItem key={entry.id} entry={entry} />
                            ))
                          ) : (
                            <div className="text-center p-4 border rounded-lg bg-gray-50">
                              <p className="text-gray-500">No activity matches your filters</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                      
                      {filteredTimeline.length > 5 && (
                        <Button variant="outline" className="w-full mt-4 text-sm">
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
                          engagedBuyers.map((buyer) => (
                            <EngagedBuyerItem key={buyer.id} buyer={buyer} />
                          ))
                        )}
                      </div>
                    </div>
                    
                    {/* Save-to-offer conversion */}
                    {selectedProperty.saveCount > 0 && (
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
                              className="h-full rounded-full bg-blue-500"
                              style={{ width: `${Math.min(100, (selectedProperty.offerCount / selectedProperty.saveCount) * 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0%</span>
                            <span>{Math.round((selectedProperty.offerCount / selectedProperty.saveCount) * 100)}%</span>
                            <span>100%</span>
                          </div>
                        </div>
                        
                        <div className="text-sm mt-3">
                          <span className="font-medium">{selectedProperty.saveCount} saves</span>
                          <span className="mx-2">→</span>
                          <span className="font-medium">{selectedProperty.offerCount} offers</span>
                        </div>
                        
                        {(selectedProperty.saveCount > selectedProperty.offerCount) && (
                          <div className="mt-2 text-sm text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200">
                            <span className="font-medium">{selectedProperty.saveCount - selectedProperty.offerCount} buyers</span> saved this property but didn't offer — follow up!
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
                              Listed<br />{format(new Date(Date.now() - selectedProperty.daysListed * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}
                            </div>
                          </div>
                          
                          {/* View milestones */}
                          {selectedProperty.viewCount >= 100 && (
                            <div className="absolute left-1/3 flex flex-col items-center">
                              <div className="w-4 h-4 rounded-full bg-blue-400 z-10" />
                              <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                                100+ Views
                              </div>
                            </div>
                          )}
                          
                          {/* Offer milestone */}
                          {selectedProperty.offerCount > 0 && (
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
                              Target Close<br />{format(new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
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