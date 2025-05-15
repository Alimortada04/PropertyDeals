import React, { useState, useRef, useMemo } from "react";
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
    address: "123 Main St, Austin, TX 78701",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop",
    price: 450000,
    beds: 4,
    baths: 3,
    sqft: 2750,
    status: "For Sale",
    daysListed: 8,
    viewCount: 4,
    viewTrend: {
      percentage: "+15%",
      direction: "up",
      fromLastWeek: true
    },
    saveCount: 5,
    saveTrend: {
      percentage: "+8%",
      direction: "up",
      fromLastWeek: true
    },
    offerCount: 0,
    offerTrend: {
      text: "No offers yet",
      isNew: false
    },
    messageCount: 1,
    unreadMessages: 1,
    messageTrend: {
      text: "+1 today",
      isNew: true
    },
    lastResponseTime: 8, // hours
    hasUnreadMessages: true,
    hasNewOffers: false,
    needsAttention: true,
    milestones: [
      { type: "listed", date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
      { type: "1st-view", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    ],
    conversionStats: {
      saveToOffer: {
        saves: 5,
        offers: 0,
        rate: 0
      }
    }
  },
  {
    id: "p2",
    address: "456 Urban Ave, Austin, TX 78702",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2670&auto=format&fit=crop",
    price: 385000,
    beds: 3,
    baths: 2.5,
    sqft: 2150,
    status: "For Sale",
    daysListed: 14,
    viewCount: 4,
    viewTrend: {
      percentage: "+5%",
      direction: "up",
      fromLastWeek: true
    },
    saveCount: 2,
    saveTrend: {
      percentage: "0%",
      direction: "neutral",
      fromLastWeek: true
    },
    offerCount: 0,
    offerTrend: {
      text: "None new",
      isNew: false
    },
    messageCount: 1,
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
      { type: "1st-view", date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) }
    ],
    conversionStats: {
      saveToOffer: {
        saves: 2,
        offers: 0,
        rate: 0
      }
    }
  },
  {
    id: "p3",
    address: "789 Lake Dr, Austin, TX 78703",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2670&auto=format&fit=crop",
    price: 750000,
    beds: 3,
    baths: 2,
    sqft: 1850,
    status: "For Sale",
    daysListed: 5,
    viewCount: 1,
    viewTrend: {
      percentage: "+22%",
      direction: "up",
      fromLastWeek: true
    },
    saveCount: 0,
    saveTrend: {
      percentage: "0%",
      direction: "neutral",
      fromLastWeek: true
    },
    offerCount: 0,
    offerTrend: {
      text: "None yet",
      isNew: false
    },
    messageCount: 1,
    unreadMessages: 1,
    messageTrend: {
      text: "+1 new",
      isNew: true
    },
    lastResponseTime: 5, // hours
    hasUnreadMessages: true,
    hasNewOffers: false,
    needsAttention: true,
    milestones: [
      { type: "listed", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { type: "1st-view", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
    ],
    conversionStats: {
      saveToOffer: {
        saves: 0,
        offers: 0,
        rate: 0
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
    message: "I'm interested in this property and would like to schedule a viewing. Is it possible to see it this weekend?",
    isNew: true
  },
  {
    id: "e3",
    propertyId: "p2",
    type: "message",
    buyerName: "Mike Williams",
    buyerType: "Investor",
    buyerVerified: false,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: "replied",
    message: "Can you tell me more about the neighborhood and schools in this area?",
    isNew: false
  },
  {
    id: "e4",
    propertyId: "p2",
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
    message: "I have a client who is very interested in this property. We'd like to schedule a showing tomorrow afternoon if possible.",
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
    tags: ["Investor"],
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
    // Total counts
    const totalViews = mockProperties.reduce((sum, p) => sum + p.viewCount, 0);
    const totalSaves = mockProperties.reduce((sum, p) => sum + p.saveCount, 0);
    const totalOffers = mockProperties.reduce((sum, p) => sum + p.offerCount, 0);
    const totalMessages = mockProperties.reduce((sum, p) => sum + p.messageCount, 0);
    const totalUnreadMessages = mockProperties.reduce((sum, p) => sum + (p.unreadMessages || 0), 0);
    
    const activeProperties = mockProperties.filter(p => p.status === "For Sale").length;
    const avgViewsPerProperty = Math.round(totalViews / (activeProperties || 1));
    const avgSavesPerProperty = Math.round(totalSaves / (activeProperties || 1));
    const avgOffersPerProperty = (totalOffers / (activeProperties || 1)).toFixed(1);
    
    // Count unread messages and new offers
    const unreadMessages = totalUnreadMessages;
    const newOffers = mockProperties.filter(p => p.hasNewOffers).length;
    
    // Calculate response rate
    const totalResponses = mockTimeline.filter(e => e.type === "message" && e.status === "replied").length;
    const totalMessagesReceived = mockTimeline.filter(e => e.type === "message").length;
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
      responseRate: 50, // Hardcoded for now based on your screenshot
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
              property.status === "For Sale" ? "border-green-200 text-green-700 bg-green-50" : 
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
      <div>
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
      <div>
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
            
            {/* First View Milestone (if applicable) */}
            {property.milestones.find(m => m.type === "1st-view") && (
              <div className="absolute left-1/3 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-blue-400 z-10" />
                <div className="text-xs text-gray-500 mt-1 whitespace-nowrap text-center">
                  First View<br />
                  {format(property.milestones.find(m => m.type === "1st-view")?.date || new Date(), 'MMM d')}
                </div>
              </div>
            )}
            
            {/* Target close date */}
            <div className="absolute right-0 flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-gray-400 z-10" />
              <div className="text-xs text-gray-500 mt-1 whitespace-nowrap text-center">
                Target Close<br />
                {format(new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), 'MMM d')}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <SellerDashboardLayout>
      <div className="py-6">
        <div className="flex flex-col space-y-6">
          {/* Page header - "Engagements" title */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Engagements</h1>
          </div>
          
          {/* Top summary section - 5 Insight-driven metric cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Views metric card */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-lg shadow-sm border overflow-hidden bg-white hover:shadow-md transition-all"
            >
              <CardContent className="p-5">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">👁️</div>
                      <HoverCard openDelay={200}>
                        <HoverCardTrigger asChild>
                          <h3 className="font-medium text-gray-700 text-sm flex items-center">
                            Views
                            <Info className="h-3 w-3 text-gray-400 ml-1" />
                          </h3>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 text-sm">
                          Total views of all your properties. Average is calculated based on active listings only.
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{metrics.totalViews}</span>
                    <span className="text-sm text-gray-500">Avg {metrics.avgViewsPerProperty} per property</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">+15% from last week</span>
                  </div>
                </div>
              </CardContent>
            </motion.div>
            
            {/* Saves metric card */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-lg shadow-sm border overflow-hidden bg-white hover:shadow-md transition-all"
            >
              <CardContent className="p-5">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">📌</div>
                      <HoverCard openDelay={200}>
                        <HoverCardTrigger asChild>
                          <h3 className="font-medium text-gray-700 text-sm flex items-center">
                            Saves
                            <Info className="h-3 w-3 text-gray-400 ml-1" />
                          </h3>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 text-sm">
                          Number of times buyers saved your properties to their favorites.
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{metrics.totalSaves}</span>
                    <span className="text-sm text-gray-500">Avg {metrics.avgSavesPerProperty} per property</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">+8% from last week</span>
                  </div>
                </div>
              </CardContent>
            </motion.div>
            
            {/* Offers metric card */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-lg shadow-sm border overflow-hidden bg-white hover:shadow-md transition-all"
            >
              <CardContent className="p-5">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">💰</div>
                      <HoverCard openDelay={200}>
                        <HoverCardTrigger asChild>
                          <h3 className="font-medium text-gray-700 text-sm flex items-center">
                            Offers
                            <Info className="h-3 w-3 text-gray-400 ml-1" />
                          </h3>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 text-sm">
                          Offers received on your properties. Average is calculated from active listings only.
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    {metrics.newOffers > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-medium"
                      >
                        New
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{metrics.totalOffers}</span>
                    <span className="text-sm text-gray-500">Avg {metrics.avgOffersPerProperty} per property</span>
                  </div>
                  
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-xs text-blue-600 justify-start hover:text-blue-800"
                    onClick={handleShowOffersInbox}
                  >
                    View new offers
                    <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </motion.div>
            
            {/* Unread Messages metric card */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={cn(
                "rounded-lg shadow-sm border overflow-hidden bg-white hover:shadow-md transition-all",
                metrics.unreadMessages > 0 ? "border-[#803344]" : "border-gray-200"
              )}
            >
              <CardContent className="p-5">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">💬</div>
                      <HoverCard openDelay={200}>
                        <HoverCardTrigger asChild>
                          <h3 className="font-medium text-gray-700 text-sm flex items-center">
                            Unread Messages
                            <Info className="h-3 w-3 text-gray-400 ml-1" />
                          </h3>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 text-sm">
                          Unread messages from potential buyers. Responding quickly improves your conversion rate.
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    
                    {metrics.unreadMessages > 0 && (
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
                    <span className="text-2xl font-bold">{metrics.unreadMessages > 0 ? metrics.unreadMessages : "0"}</span>
                    <span className="text-sm text-gray-500">{metrics.unreadMessages > 0 ? `of ${metrics.totalMessages} total` : "All read"}</span>
                  </div>
                  
                  {metrics.unreadMessages > 0 ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-amber-600">Respond to improve conversion</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">All caught up</span>
                    </div>
                  )}
                  
                  {metrics.unreadMessages > 0 && (
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-xs text-blue-600 justify-start hover:text-blue-800"
                      onClick={handleMessageInbox}
                    >
                      View messages
                      <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </motion.div>
            
            {/* Response Rate metric card */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-lg shadow-sm border overflow-hidden bg-white hover:shadow-md transition-all"
            >
              <CardContent className="p-5">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">📈</div>
                      <HoverCard openDelay={200}>
                        <HoverCardTrigger asChild>
                          <h3 className="font-medium text-gray-700 text-sm flex items-center">
                            Response Rate
                            <Info className="h-3 w-3 text-gray-400 ml-1" />
                          </h3>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 text-sm">
                          Your response rate affects property ranking. Aim for at least 90%.
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{metrics.responseRate}%</span>
                    <span className="text-sm text-gray-500">Avg {metrics.avgResponseTime.toFixed(1)}h response</span>
                  </div>
                  
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-1000 ease-in-out",
                        metrics.responseRate >= 90 ? "bg-green-500" : 
                        metrics.responseRate >= 75 ? "bg-amber-500" : "bg-red-500"
                      )}
                      style={{ width: `${metrics.responseRate}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {metrics.responseRate < 90 ? (
                      <span className="text-xs text-amber-600">Needs Improvement (Goal: 90%+)</span>
                    ) : (
                      <div className="flex items-center">
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                        <span className="text-xs text-green-600">+12% from last month</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </motion.div>
          </div>
          
          {/* Filters bar - sticky */}
          <div className="sticky top-0 z-10 bg-white rounded-lg border shadow-sm p-4">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center">
                {/* Property Multi-select Dropdown */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1 border-gray-300">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <span>Property</span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search properties..." />
                      <CommandList>
                        <CommandEmpty>No properties found.</CommandEmpty>
                        <CommandGroup>
                          {mockProperties.map((property) => (
                            <CommandItem
                              key={property.id}
                              onSelect={() => handleToggleProperty(property.id)}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                checked={selectedProperties.includes(property.id)}
                                className="h-4 w-4"
                              />
                              <span>{property.address.split(',')[0]}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                
                {/* Engagement Type Dropdown */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1 border-gray-300">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <span>Engagement Type</span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          <CommandItem onSelect={() => handleToggleEngagementType("view")}>
                            <Checkbox
                              checked={selectedEngagementTypes.includes("view")}
                              className="h-4 w-4 mr-2"
                            />
                            <Eye className="h-4 w-4 mr-2 text-blue-500" />
                            <span>Views</span>
                          </CommandItem>
                          <CommandItem onSelect={() => handleToggleEngagementType("save")}>
                            <Checkbox
                              checked={selectedEngagementTypes.includes("save")}
                              className="h-4 w-4 mr-2"
                            />
                            <Bookmark className="h-4 w-4 mr-2 text-amber-500" />
                            <span>Saves</span>
                          </CommandItem>
                          <CommandItem onSelect={() => handleToggleEngagementType("message")}>
                            <Checkbox
                              checked={selectedEngagementTypes.includes("message")}
                              className="h-4 w-4 mr-2"
                            />
                            <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
                            <span>Messages</span>
                          </CommandItem>
                          <CommandItem onSelect={() => handleToggleEngagementType("offer")}>
                            <Checkbox
                              checked={selectedEngagementTypes.includes("offer")}
                              className="h-4 w-4 mr-2"
                            />
                            <DollarSign className="h-4 w-4 mr-2 text-purple-500" />
                            <span>Offers</span>
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                
                {/* Status Dropdown */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1 border-gray-300">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Status</span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          <CommandItem onSelect={() => handleToggleStatus("new")}>
                            <Checkbox
                              checked={selectedStatus.includes("new")}
                              className="h-4 w-4 mr-2"
                            />
                            <span>New</span>
                          </CommandItem>
                          <CommandItem onSelect={() => handleToggleStatus("replied")}>
                            <Checkbox
                              checked={selectedStatus.includes("replied")}
                              className="h-4 w-4 mr-2"
                            />
                            <span>Replied</span>
                          </CommandItem>
                          <CommandItem onSelect={() => handleToggleStatus("viewed")}>
                            <Checkbox
                              checked={selectedStatus.includes("viewed")}
                              className="h-4 w-4 mr-2"
                            />
                            <span>Viewed</span>
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Clear filters button */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-9 text-xs hover:bg-gray-100"
                  onClick={handleClearFilters}
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Clear Filters
                </Button>
              </div>
              
              {/* Schedule Follow-up button */}
              <Button className="h-9 bg-[#09261E] hover:bg-[#09261E]/90">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Follow-Up
              </Button>
            </div>
          </div>
          
          {/* Main content - Zillow-style split view */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Property list (scrollable) */}
            <div className="lg:col-span-1">
              <div className={cn(
                "space-y-4",
                !isMobile && "max-h-[calc(100vh-300px)] overflow-y-auto pr-2"
              )}>
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
            
            {/* Right: Property engagement panel (sticky & scrollable) */}
            <div className="lg:col-span-2">
              {selectedPropertyId && selectedProperty ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border rounded-lg bg-white shadow-sm overflow-hidden"
                >
                  {/* Header section - Sticky */}
                  <div className="p-4 border-b bg-gray-50 sticky top-0 z-10">
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
                                selectedProperty.status === "For Sale" ? "border-green-200 text-green-700 bg-green-50" : 
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
                          <span>Edit Details</span>
                        </Button>
                        <Button variant="outline" size="sm" className="hover:bg-gray-100 hover:text-gray-900">
                          <Share className="h-3.5 w-3.5 mr-1.5" />
                          <span>Share Listing</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Property-specific metrics */}
                  <div className="p-4 border-b">
                    <div className="text-sm font-medium text-gray-500 mb-3">Last 30 Days</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Views metric */}
                      <div className="p-3 border rounded-md bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 text-blue-500 mr-2" />
                            <span className="text-sm font-medium">Views</span>
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-xs text-green-600">{selectedProperty.viewTrend.percentage}</span>
                          </div>
                        </div>
                        <p className="text-2xl font-bold mt-1">{selectedProperty.viewCount}</p>
                      </div>
                      
                      {/* Saves metric */}
                      <div className="p-3 border rounded-md bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Bookmark className="h-4 w-4 text-amber-500 mr-2" />
                            <span className="text-sm font-medium">Saves</span>
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-xs text-green-600">{selectedProperty.saveTrend.percentage}</span>
                          </div>
                        </div>
                        <p className="text-2xl font-bold mt-1">{selectedProperty.saveCount}</p>
                      </div>
                      
                      {/* Messages metric */}
                      <div className="p-3 border rounded-md bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm font-medium">Messages</span>
                          </div>
                          <div className="flex items-center">
                            {selectedProperty.messageTrend.text.includes("+") ? (
                              <>
                                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                                <span className="text-xs text-green-600">{selectedProperty.messageTrend.text}</span>
                              </>
                            ) : (
                              <span className="text-xs text-gray-500">{selectedProperty.messageTrend.text}</span>
                            )}
                          </div>
                        </div>
                        <p className="text-2xl font-bold mt-1">{selectedProperty.messageCount}</p>
                      </div>
                      
                      {/* Offers metric */}
                      <div className="p-3 border rounded-md bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-purple-500 mr-2" />
                            <span className="text-sm font-medium">Offers</span>
                          </div>
                          {selectedProperty.offerTrend.isNew ? (
                            <div className="flex items-center">
                              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                              <span className="text-xs text-green-600">{selectedProperty.offerTrend.text}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">{selectedProperty.offerTrend.text}</span>
                          )}
                        </div>
                        <p className="text-2xl font-bold mt-1">{selectedProperty.offerCount}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content sections in Smart Layout order */}
                  <div className="divide-y">
                    {/* 1. Activity Timeline */}
                    <div className="p-4" ref={activityTimelineRef}>
                      <h3 className="font-medium text-gray-900 mb-4">Activity Timeline</h3>
                      <ScrollArea className="h-[280px] pr-4">
                        <div className="space-y-1">
                          {propertyTimeline.length > 0 ? (
                            propertyTimeline.map((entry) => (
                              <TimelineItem key={entry.id} entry={entry} />
                            ))
                          ) : (
                            <div className="text-center p-4 border rounded-lg bg-gray-50">
                              <p className="text-gray-500">No activity matches your filters</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                      
                      {propertyTimeline.length > 5 && (
                        <Button variant="outline" className="w-full mt-4 text-sm">
                          Load More Activity
                        </Button>
                      )}
                    </div>
                    
                    {/* 2. Engaged Buyers */}
                    <div className="p-4" ref={messagesRef}>
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
                    
                    {/* 3. Save-to-Offer Conversion */}
                    {selectedProperty.saveCount > 0 && (
                      <div className="p-4" ref={offersRef}>
                        <SaveToOfferConversion property={selectedProperty} />
                      </div>
                    )}
                    
                    {/* 4. Property Timeline */}
                    <div className="p-4">
                      <PropertyTimelineComponent property={selectedProperty} />
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