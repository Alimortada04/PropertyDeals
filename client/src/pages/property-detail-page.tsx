import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { 
  Share2, Heart, MapPin, MapPinned, Home, ChevronRight, ChevronLeft, ChevronDown, X, 
  ChevronsRight, Mail, MessageSquare, Phone, Calculator, HelpCircle, Info, 
  BedDouble, Bath, SquareIcon, Calendar, Home as HomeIcon, Car, Ruler, 
  Wind, Snowflake, Building, Construction, Hammer, Trees, Wrench, Users,
  PercentSquare, DollarSign, MoveRight, User, ClipboardList
} from "lucide-react";
import {
  Link as LinkIcon, Check as CheckIcon, Copy as CopyIcon, Download,
  FileText, Facebook, Twitter, Linkedin, MessageCircle
} from "lucide-react";
import { SiPinterest } from "react-icons/si";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { insertPropertyInquirySchema, InsertPropertyInquiry } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { allProperties, similarProperties } from "@/lib/data";
import { useIsMobile } from "@/hooks/use-mobile";
import MobilePropertyView from "@/components/property/mobile-property-view";

// Sample demographic data from unitedstateszipcodes.org
const demographicData = {
  population: 36327,
  ageDistribution: [
    { group: 'Under 18', percentage: 21.5 },
    { group: '18-24', percentage: 9.7 },
    { group: '25-34', percentage: 15.3 },
    { group: '35-54', percentage: 26.8 },
    { group: '55-64', percentage: 12.1 },
    { group: '65+', percentage: 14.6 },
  ],
  raceDistribution: [
    { group: 'White', percentage: 68.2 },
    { group: 'Black', percentage: 12.4 },
    { group: 'Hispanic', percentage: 10.8 },
    { group: 'Asian', percentage: 5.7 },
    { group: 'Other', percentage: 2.9 },
  ],
  educationalAttainment: [
    { group: 'Less than High School', percentage: 8.5 },
    { group: 'High School Grad', percentage: 25.2 },
    { group: 'Some College', percentage: 28.6 },
    { group: 'Bachelor\'s Degree', percentage: 24.9 },
    { group: 'Graduate Degree', percentage: 12.8 },
  ],
  genderDistribution: [
    { group: 'Male', percentage: 48.3 },
    { group: 'Female', percentage: 51.7 },
  ],
  housingStatus: [
    { group: 'Owner Occupied', percentage: 65.4 },
    { group: 'Renter Occupied', percentage: 28.7 },
    { group: 'Vacant', percentage: 5.9 },
  ],
  housingTypes: [
    { group: 'In Occupied Housing Units', percentage: 91.5 },
    { group: 'Nursing Facilities', percentage: 0.7 },
    { group: 'College Student Housing', percentage: 7.5 },
    { group: 'Other Noninstitutional', percentage: 0.4 },
  ],
  yearBuilt: [
    { group: '1939 or Earlier', percentage: 32.6, count: 9335 },
    { group: '1940s', percentage: 15.4, count: 1250 },
    { group: '1950s', percentage: 11.7, count: 1650 },
    { group: '1960s', percentage: 10.2, count: 1050 },
    { group: '1970s', percentage: 8.1, count: 1250 },
    { group: '1980s', percentage: 7.3, count: 650 },
    { group: '1990s', percentage: 6.9, count: 450 },
    { group: '2000s', percentage: 4.2, count: 450 },
    { group: '2010 or Later', percentage: 3.6, count: 400 },
  ],
  ownershipType: [
    { group: 'Owned with mortgage', percentage: 49.3 },
    { group: 'Owned free and clear', percentage: 16.1 },
    { group: 'Renter occupied', percentage: 28.7 },
    { group: 'Vacant', percentage: 5.9 },
  ],
  homeValues: [
    { group: 'Less than $100K', percentage: 2.1 },
    { group: '$100K-$199K', percentage: 8.3 },
    { group: '$200K-$299K', percentage: 18.5 },
    { group: '$300K-$499K', percentage: 39.2 },
    { group: '$500K-$999K', percentage: 26.7 },
    { group: '$1M or more', percentage: 5.2 },
  ],
  monthlyRent: [
    { type: 'Studio', rent: 895 },
    { type: '1 Bedroom', rent: 1095 },
    { type: '2 Bedroom', rent: 1450 },
    { type: '3+ Bedroom', rent: 1850 },
  ],
  householdIncome: [
    { group: 'Less than $25K', percentage: 15.3 },
    { group: '$25K-$49K', percentage: 17.6 },
    { group: '$50K-$74K', percentage: 16.1 },
    { group: '$75K-$99K', percentage: 13.8 },
    { group: '$100K-$149K', percentage: 18.4 },
    { group: '$150K or more', percentage: 18.8 },
  ],
};

interface PropertyDetailPageProps {
  id: string;
}

export default function PropertyDetailPage({ id }: PropertyDetailPageProps) {
  const propertyId = parseInt(id);
  const { toast } = useToast();
  const [viewingAllPhotos, setViewingAllPhotos] = useState(false);
  const [viewingMap, setViewingMap] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const isMobile = useIsMobile();
  
  // Helper function for smooth scrolling with offset
  const scrollToSection = (elementId: string, customOffset?: number) => {
    const element = document.getElementById(elementId);
    if (element) {
      const headerOffset = customOffset || 100; // Default offset: 100px (sticky header + padding)
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  // Get property data from Supabase
  const { data: property, isLoading, error } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_profile")
        .select(`
          *,
          seller_profile:seller_id(
            full_name,
            profile_image_url,
            bio,
            phone,
            email
          )
        `)
        .eq("id", id)
        .single();
        
      if (error) {
        console.error("Error fetching property:", error);
        throw new Error(error.message);
      }
      
      return data;
    }
  });
  
  // Create form schema with validation
  const inquirySchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
      message: "Please enter a valid phone number.",
    }),
    message: z.string().min(10, {
      message: "Message must be at least 10 characters.",
    })
  });
  
  // Create form
  const form = useForm<z.infer<typeof inquirySchema>>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: `Hi, I'm interested in ${property?.address}. Please contact me for more information.`
    },
  });
  
  // Create inquiry mutation
  const inquiryMutation = useMutation({
    mutationFn: async (data: z.infer<typeof inquirySchema>) => {
      const inquiryData: InsertPropertyInquiry = {
        ...data,
        propertyId
      };
      
      const res = await apiRequest("POST", "/api/inquiries", inquiryData);
      return await res.json();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send inquiry",
      });
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Sent",
        description: "Your inquiry has been sent to the property seller.",
      });
      setContactModalOpen(false);
    }
  });
  
  const onSubmit = (data: z.infer<typeof inquirySchema>) => {
    inquiryMutation.mutate(data);
  };
  
  // Handle property not found or still loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#09261E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <Home className="h-16 w-16 text-[#09261E] mb-4" />
        <h1 className="text-3xl font-heading font-bold text-[#09261E] mb-2">Property Not Found</h1>
        <p className="text-gray-600 mb-6 max-w-lg">We couldn't find the property you're looking for. It may have been removed or the ID is incorrect.</p>
        <Link to="/properties">
          <Button>Browse Properties</Button>
        </Link>
      </div>
    );
  }
  
  // Sample property photos for demo
  const propertyImages = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  ];
  
  const formattedAddress = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`;
  
  // Calculate days since listed - in a real app this would come from the database
  const daysOnMarket: number = 5;
  
  const handleWatchlistToggle = () => {
    setIsInWatchlist(!isInWatchlist);
    toast({
      title: isInWatchlist ? "Removed from Watchlist" : "Added to Watchlist",
      description: isInWatchlist 
        ? "This property has been removed from your watchlist" 
        : "This property has been added to your watchlist",
    });
  };

  // Handle contact seller action
  const handleContactSeller = () => {
    setContactModalOpen(true);
  };
  
  // Generate a shareable property report URL
  const generateShareableUrl = () => {
    // Create a unique shareable URL with property details encoded
    const baseUrl = window.location.origin;
    const shareableUrl = `${baseUrl}/properties/${propertyId}/report`;
    setShareUrl(shareableUrl);
    return shareableUrl;
  };
  
  // Handle copy to clipboard
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
    toast({
      title: "Link Copied!",
      description: "Property report link has been copied to your clipboard.",
    });
  };
  
  // Handle email share
  const handleEmailShare = () => {
    const subject = `Property Report: ${property.address}`;
    const body = `Check out this property at ${property.address}, ${property.city}, ${property.state} ${property.zipCode}.\n\nPrice: $${property.price.toLocaleString()}\nBedrooms: ${property.bedrooms}\nBathrooms: ${property.bathrooms}\nSquare Feet: ${property.squareFeet?.toLocaleString() || 'N/A'}\n\nView the full property report here: ${shareUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  
  // Generate PDF report (in a real implementation, this would create a PDF)
  const generatePdfReport = () => {
    toast({
      title: "Generating PDF Report",
      description: "Your property report is being generated and will download shortly.",
    });
    // In a real implementation, this would trigger a backend API call to generate a PDF
    setTimeout(() => {
      toast({
        title: "PDF Report Ready",
        description: "Your property report has been generated and downloaded.",
      });
    }, 1500);
  };
  
  // Render the appropriate view based on device
  return isMobile ? (
    <>
      <MobilePropertyView 
        property={property}
        onBack={() => window.history.back()}
        onContactSeller={handleContactSeller}
        onMakeOffer={() => setOfferModalOpen(true)}
      />
      
      {/* Make an Offer Modal - Mobile */}
      {offerModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setOfferModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-[#09261E] mb-4">Make an Offer</h2>
              
            <div className="mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
                <h4 className="font-heading text-[#09261E] font-bold mb-2">Sign up or login required</h4>
                <p className="text-gray-700 text-sm mb-3">
                  To submit an offer, you'll need to create an account or login to your existing account.
                </p>
                <Link to="/auth" className="bg-[#09261E] text-white rounded-md py-2 px-4 text-sm font-medium inline-block hover:bg-[#135341] transition-colors">
                  Sign up or Login
                </Link>
              </div>
                
              <div className="text-gray-600 text-sm">
                <p className="mb-2">Making an offer through PropertyDeals gives you:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Faster response times from sellers</li>
                  <li>Secure document handling and signatures</li>
                  <li>Access to recommended inspectors and lenders</li>
                  <li>Step-by-step guidance through the entire process</li>
                </ul>
              </div>
            </div>
              
            <Button 
              onClick={() => setOfferModalOpen(false)}
              className="w-full mt-4 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300"
              variant="outline"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  ) : (
    <TooltipProvider>
      {/* Property Hero Section with Photo Gallery */}
      <section className="relative bg-white pt-6">
        <div className="container mx-auto px-4 pt-2 pb-4">
          {/* Breadcrumb Navigation */}
          <nav className="flex text-sm text-gray-500 mb-4 items-center">
            <Link to="/" className="hover:text-[#09261E]">Home</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link to="/properties" className="hover:text-[#09261E]">Properties</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-[#09261E] font-medium truncate">{property.address}</span>
          </nav>
        
          {/* Property Title and Key Details */}
          <div className="md:flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#09261E] mb-2">{property.address}</h1>
              <div className="flex items-center text-lg text-gray-700 mb-1">
                <span>{property.city}, {property.state} {property.zipCode}</span>
              </div>
              
              {/* Action Buttons (Relocated from below) */}
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  className="px-4 py-1.5 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200 flex items-center"
                  onClick={() => setContactModalOpen(true)}
                >
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                  Contact Seller
                </button>
                <button
                  className="px-4 py-1.5 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200 flex items-center"
                  onClick={() => setOfferModalOpen(true)}
                >
                  <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                  Make an Offer
                </button>
                <button
                  className={`px-4 py-1.5 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 border border-gray-200 flex items-center ${
                    isInWatchlist 
                      ? "bg-[#EAF2EF] text-[#135341] shadow-sm" 
                      : "bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                  onClick={handleWatchlistToggle}
                >
                  <Heart className={`h-3.5 w-3.5 mr-1.5 ${isInWatchlist ? 'fill-[#135341]' : ''}`} />
                  {isInWatchlist ? 'Saved' : 'Save'}
                </button>
                <button
                  className="px-4 py-1.5 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200 flex items-center"
                  onClick={() => {
                    generateShareableUrl();
                    setShareModalOpen(true);
                  }}
                >
                  <Share2 className="h-3.5 w-3.5 mr-1.5" />
                  Share
                </button>
                
                {/* Property Info Badge */}
                <Badge variant="outline" className="bg-gray-100 text-gray-700 border-0 ml-auto flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {daysOnMarket} {daysOnMarket === 1 ? 'day' : 'days'} on market
                </Badge>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col items-end">
              <div className="text-3xl md:text-4xl font-bold text-[#09261E]">${property.price.toLocaleString()}</div>
              {/* PD Rating - Color coded by rating value with tooltip */}
              <div className={`font-medium flex items-center ${
                // Color coding based on rating value
                propertyId % 10 <= 3 ? 'text-[#803344]' : 
                propertyId % 10 <= 6 ? 'text-gray-600' : 
                'text-[#135341]'
              }`}>
                PD Rating: {propertyId % 10}/10
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="inline-flex items-center justify-center h-4 w-4 ml-1 text-xs font-bold bg-gray-200 text-gray-600 rounded-full focus:outline-none hover:bg-gray-300">i</button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-4 space-y-2 bg-white shadow-lg border z-50">
                      <h4 className="font-bold text-[#09261E]">PD Rating Explanation</h4>
                      <p>This score is based on repair costs, location, pricing vs comps, and projected rental income.</p>
                      <div className="mt-3 space-y-2">
                        <h5 className="text-sm font-medium text-[#09261E]">Rating Breakdown:</h5>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                          <div className="flex items-center">
                            <span className="h-2.5 w-2.5 bg-green-500 rounded-full mr-1.5"></span>
                            <span className="text-gray-600">Repair Costs:</span>
                          </div>
                          <div className="text-right font-medium">{Math.min(3, propertyId % 3 + 1)}/3</div>
                          
                          <div className="flex items-center">
                            <span className="h-2.5 w-2.5 bg-blue-500 rounded-full mr-1.5"></span>
                            <span className="text-gray-600">Location:</span>
                          </div>
                          <div className="text-right font-medium">{Math.min(2, (propertyId % 5) % 2 + 1)}/2</div>
                          
                          <div className="flex items-center">
                            <span className="h-2.5 w-2.5 bg-purple-500 rounded-full mr-1.5"></span>
                            <span className="text-gray-600">Price vs Comps:</span>
                          </div>
                          <div className="text-right font-medium">{Math.min(3, (propertyId % 7) % 3 + 1)}/3</div>
                          
                          <div className="flex items-center">
                            <span className="h-2.5 w-2.5 bg-amber-500 rounded-full mr-1.5"></span>
                            <span className="text-gray-600">Rental Income:</span>
                          </div>
                          <div className="text-right font-medium">{Math.min(2, (propertyId % 4) % 2 + 1)}/2</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Our proprietary scoring system evaluates properties based on value, market conditions, and investment potential. A higher score indicates a better investment opportunity.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-gray-600">
                ${property.squareFeet ? Math.round(property.price / property.squareFeet) : '0'}/sqft
              </div>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-3 grid-rows-2 gap-2 h-[400px] md:h-[500px] mb-4">
            {/* Main Large Photo - 2/3 width and full height */}
            <div className="col-span-2 row-span-2 relative group cursor-pointer" onClick={() => setViewingAllPhotos(true)}>
              <img 
                src={propertyImages[currentPhotoIndex]} 
                alt={property.address} 
                className="w-full h-full object-cover rounded-l-lg" 
              />
              {/* Photo Navigation Arrows */}
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  className="bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPhotoIndex(prev => (prev === 0 ? propertyImages.length - 1 : prev - 1));
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                  className="bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPhotoIndex(prev => (prev === propertyImages.length - 1 ? 0 : prev + 1));
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
              {/* View All Photos Text (appears on hover) */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="font-medium flex items-center justify-center">
                  View All Photos <ChevronRight className="h-4 w-4 ml-1" />
                </span>
              </div>
            </div>
            
            {/* Secondary Photo - Top Right */}
            <div className="col-span-1 row-span-1 cursor-pointer" onClick={() => setViewingAllPhotos(true)}>
              <img 
                src={propertyImages[currentPhotoIndex + 1 >= propertyImages.length ? 0 : currentPhotoIndex + 1]} 
                alt={property.address} 
                className="w-full h-full object-cover rounded-tr-lg" 
              />
            </div>
            
            {/* Map Preview - Bottom Right */}
            <div className="col-span-1 row-span-1 relative cursor-pointer" 
              onClick={() => setViewingMap(true)}
            >
              <div className="bg-[#09261E]/10 w-full h-full rounded-br-lg flex items-center justify-center">
                <MapPin className="h-10 w-10 text-[#09261E]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-black/50 text-white text-sm px-3 py-1 rounded-full">View Map</span>
              </div>
            </div>
          </div>
          
          {/* Property Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#09261E]/5 p-3 rounded-lg text-center">
              <div className="text-gray-600 text-sm mb-1">Bedrooms</div>
              <div className="font-bold text-xl text-[#09261E]">{property.bedrooms}</div>
            </div>
            <div className="bg-[#09261E]/5 p-3 rounded-lg text-center">
              <div className="text-gray-600 text-sm mb-1">Bathrooms</div>
              <div className="font-bold text-xl text-[#09261E]">{property.bathrooms}</div>
            </div>
            <div className="bg-[#09261E]/5 p-3 rounded-lg text-center">
              <div className="text-gray-600 text-sm mb-1">Square Feet</div>
              <div className="font-bold text-xl text-[#09261E]">{property.squareFeet?.toLocaleString() || 'N/A'}</div>
            </div>
            <div className="bg-[#09261E]/5 p-3 rounded-lg text-center">
              <div className="text-gray-600 text-sm mb-1">Lot Size</div>
              <div className="font-bold text-xl text-[#09261E]">{property.lotSize || 'N/A'}</div>
            </div>
          </div>
          
          {/* Property Type & Status Badges */}
          <div className="flex flex-wrap gap-3">
            {property.propertyType && (
              <Badge variant="outline" className="px-4 py-1.5 bg-[#09261E]/10 text-[#09261E] border-0 flex items-center">
                <HomeIcon className="h-3.5 w-3.5 mr-1.5" />
                {property.propertyType}
              </Badge>
            )}
            {/* Condition Badge - Would come from property data in real implementation */}
            <Badge variant="outline" className="px-4 py-1.5 bg-[#135341]/10 text-[#135341] border-0 flex items-center">
              <Hammer className="h-3.5 w-3.5 mr-1.5" />
              Light Rehab
            </Badge>
          </div>
        </div>
      </section>

      {/* Sticky Navigation Menu */}
      <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200" style={{ position: "sticky" }}>
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center h-14 overflow-x-auto hide-scrollbar gap-x-1.5">
            <button
              onClick={() => scrollToSection('numbers')}
              className="px-4 py-1.5 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200 flex items-center"
            >
              <Calculator className="h-4 w-4 mr-1.5" />
              Numbers
            </button>
            <button
              onClick={() => scrollToSection('calculators')}
              className="px-4 py-1.5 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200 flex items-center"
            >
              <PercentSquare className="h-4 w-4 mr-1.5" />
              Calculators
            </button>
            <button
              onClick={() => scrollToSection('location')}
              className="px-4 py-1.5 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200 flex items-center"
            >
              <MapPin className="h-4 w-4 mr-1.5" />
              Location
            </button>
            <button
              onClick={() => scrollToSection('reps')}
              className="px-4 py-1.5 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200 flex items-center"
            >
              <Wrench className="h-4 w-4 mr-1.5" />
              REPs
            </button>
            <button
              onClick={() => scrollToSection('history')}
              className="px-4 py-1.5 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200 flex items-center"
            >
              <FileText className="h-4 w-4 mr-1.5" />
              History
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Property Details Section */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row">
            {/* Left Column with Main Sections */}
            <div className="w-full lg:w-2/3 xl:w-3/4 lg:pr-8 space-y-6">
            
              {/* Property Details Section */}
              <Accordion id="details" type="single" defaultValue="details" collapsible className="w-full">
                <AccordionItem value="details" className="border-b border-gray-200">
                  <AccordionTrigger className="w-full py-4 text-2xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                    <div className="flex items-center">
                      <Home className="mr-3 h-6 w-6 text-[#09261E]" />
                      <span>Property Details</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4">
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-start">
                        <BedDouble className="text-[#09261E] w-5 h-5 mr-2 mt-0.5" />
                        <div>
                          <div className="text-gray-600 text-xs">Bedrooms</div>
                          <div className="font-semibold">{property.bedrooms}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Bath className="text-[#09261E] w-5 h-5 mr-2 mt-0.5" />
                        <div>
                          <div className="text-gray-600 text-xs">Bathrooms</div>
                          <div className="font-semibold">{property.bathrooms}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <SquareIcon className="text-[#09261E] w-5 h-5 mr-2 mt-0.5" />
                        <div>
                          <div className="text-gray-600 text-xs">Square Feet</div>
                          <div className="font-semibold">{property.squareFeet?.toLocaleString() || '3,500'} sq ft</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Ruler className="text-[#09261E] w-5 h-5 mr-2 mt-0.5" />
                        <div>
                          <div className="text-gray-600 text-xs">Lot Size</div>
                          <div className="font-semibold">{property.lotSize || '0.25 acres'}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Calendar className="text-[#09261E] w-5 h-5 mr-2 mt-0.5" />
                        <div>
                          <div className="text-gray-600 text-xs">Year Built</div>
                          <div className="font-semibold">1886</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <HomeIcon className="text-[#09261E] w-5 h-5 mr-2 mt-0.5" />
                        <div>
                          <div className="text-gray-600 text-xs">Property Type</div>
                          <div className="font-semibold">{property.propertyType || 'Single-family'}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <DollarSign className="text-[#09261E] w-5 h-5 mr-2 mt-0.5" />
                        <div>
                          <div className="text-gray-600 text-xs">Price per sqft</div>
                          <div className="font-semibold">${property.squareFeet ? Math.round(property.price / property.squareFeet) : '98'}/sq ft</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Car className="text-[#09261E] w-5 h-5 mr-2 mt-0.5" />
                        <div>
                          <div className="text-gray-600 text-xs">Parking</div>
                          <div className="font-semibold">2-car garage</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Building className="text-[#09261E] w-5 h-5 mr-2 mt-0.5" />
                        <div>
                          <div className="text-gray-600 text-xs">Basement</div>
                          <div className="font-semibold">Full, finished</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mt-6">
                      <h3 className="font-medium text-[#09261E] mb-3 text-lg">Property Description</h3>
                      <p className="text-gray-700 mb-3">
                        This charming {property.propertyType || 'single-family'} home is nestled in a highly sought-after neighborhood in {property.city}, {property.state}. With {property.bedrooms} spacious bedrooms and {property.bathrooms} modern bathrooms, this {property.squareFeet?.toLocaleString() || ''} square foot residence offers comfort and style.
                      </p>
                      <p className="text-gray-700 mb-3">
                        The property features a well-maintained yard, perfect for outdoor entertaining. Recent upgrades include new energy-efficient appliances and updated fixtures throughout. The location provides easy access to local schools, shopping centers, and major highways.
                      </p>
                      <p className="text-gray-700">
                        This property presents an excellent opportunity for both homeowners and investors looking for a solid return on investment in a stable market. Don't miss the chance to add this gem to your portfolio!
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* The Numbers Section */}
              <Accordion id="numbers" type="single" defaultValue="numbers" collapsible className="w-full">
                <AccordionItem value="numbers" className="border-b border-gray-200">
                  <AccordionTrigger className="w-full py-4 text-2xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                    <div className="flex items-center">
                      <Calculator className="mr-3 h-6 w-6 text-[#09261E]" />
                      <span>The Numbers</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4">
                    <div className="grid grid-cols-1 gap-5 mb-6">
                      {/* Rent with Dropdown for Multiple Units */}
                      <Collapsible className="border-b border-gray-100 pb-3">
                        <CollapsibleTrigger className="w-full">
                          <div className="flex justify-between items-center cursor-pointer hover:text-[#803344] group">
                            <span className="text-gray-600 font-medium group-hover:text-[#803344]">Rent</span>
                            <div className="flex items-center">
                              <span className="font-semibold text-[#09261E] mr-2 group-hover:text-[#803344]">${(property.price * 0.008).toFixed(0)}/month</span>
                              <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-[#803344]" />
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 pl-6 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Main Unit</span>
                            <span className="text-gray-700">${(property.price * 0.008).toFixed(0)}/mo</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Basement Apartment</span>
                            <span className="text-gray-700">${(property.price * 0.003).toFixed(0)}/mo</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Market Analysis</span>
                            <span className="text-gray-700">${(property.price * 0.008 * 1.1).toFixed(0)}/mo (potential)</span>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                      
                      {/* Estimated Repair Costs with Clickable Contractor Avatar */}
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <span className="text-gray-600 font-medium">Estimated Repair Costs</span>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="font-semibold text-[#09261E] mr-2">${(property.price * 0.05).toFixed(0)}</span>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className="flex items-center mt-1 cursor-pointer group">
                                <Avatar className="h-6 w-6 mr-2 hover:ring-2 hover:ring-offset-1 hover:ring-[#09261E]/50 transition-all">
                                  <AvatarImage src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=120&h=120&auto=format&fit=crop" alt="Contractor" />
                                  <AvatarFallback className="text-xs bg-gray-200">MJ</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="text-xs font-medium text-[#803344] group-hover:underline">Real Job Quote</span>
                                  <span className="text-xs text-gray-500">by Mike Johnson</span>
                                </div>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-heading">Contractor Quote</DialogTitle>
                                <DialogDescription className="text-gray-600">
                                  Details from Mike Johnson, certified contractor
                                </DialogDescription>
                              </DialogHeader>
                              <div className="mt-2 space-y-4">
                                <div className="flex items-center space-x-4">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=120&h=120&auto=format&fit=crop" alt="Contractor" />
                                    <AvatarFallback className="bg-gray-200">MJ</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-medium text-[#09261E]">Mike Johnson</h4>
                                    <p className="text-sm text-gray-500">Elite Contractors, LLC</p>
                                    <div className="flex items-center mt-1">
                                      <span className="text-yellow-500">★★★★★</span>
                                      <span className="text-sm text-gray-500 ml-1">(28 reviews)</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="border-t border-b py-3">
                                  <h5 className="font-medium mb-2">Quote Details</h5>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Materials</span>
                                      <span className="font-medium">${(property.price * 0.025).toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Labor</span>
                                      <span className="font-medium">${(property.price * 0.02).toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Permits & Fees</span>
                                      <span className="font-medium">${(property.price * 0.005).toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between font-medium pt-2 border-t">
                                      <span>Total</span>
                                      <span>${(property.price * 0.05).toFixed(0)}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h5 className="font-medium mb-2">Work Summary</h5>
                                  <p className="text-sm text-gray-600">Complete interior and exterior renovation including new kitchen, bathrooms, flooring, and roof repair. Timeline: 6-8 weeks.</p>
                                </div>
                                
                                <div className="flex space-x-2">
                                  <Button className="flex-1" onClick={() => window.location.href = "/reps/mike-johnson"}>
                                    <Info className="mr-2 h-4 w-4" />
                                    View Profile
                                  </Button>
                                  <Button variant="outline" className="flex-1 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300">
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Message
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      
                      {/* Monthly Expenses with Dropdown */}
                      <Collapsible className="border-b border-gray-100 pb-3">
                        <CollapsibleTrigger className="w-full">
                          <div className="flex justify-between items-center cursor-pointer hover:text-[#803344] group">
                            <span className="text-gray-600 font-medium group-hover:text-[#803344]">Estimated Monthly Expenses</span>
                            <div className="flex items-center">
                              <span className="font-semibold text-[#09261E] mr-2 group-hover:text-[#803344]">${(property.price * 0.003).toFixed(0)}/month</span>
                              <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-[#803344]" />
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 pl-6 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Property Tax</span>
                            <span className="text-gray-700">${Math.round(property.price * 0.01 / 12).toLocaleString()}/mo</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Insurance</span>
                            <span className="text-gray-700">${Math.round(property.price * 0.005 / 12).toLocaleString()}/mo</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">HOA</span>
                            <span className="text-gray-700">$150/mo</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Maintenance</span>
                            <span className="text-gray-700">${Math.round(property.price * 0.001 / 12).toLocaleString()}/mo</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Utilities</span>
                            <span className="text-gray-700">$75/mo (est.)</span>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                      
                      {/* ARV with Tooltip */}
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <div className="flex items-center">
                          <span className="text-gray-600 font-medium">ARV</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button type="button" className="inline-flex items-center justify-center h-4 w-4 ml-1 text-xs font-bold bg-gray-200 text-gray-600 rounded-full focus:outline-none hover:bg-gray-300">i</button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="bg-white p-2 rounded shadow-lg border z-50">
                                <p className="text-sm font-medium">After Repair Value</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <span className="font-semibold text-[#09261E]">${(property.price * 1.2).toFixed(0)}</span>
                      </div>
                      
                      {/* Investment metrics in a grid with Monthly Rent % */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <div>
                          <div className="flex items-center">
                            <PercentSquare className="h-4 w-4 mr-1 text-[#09261E]" />
                            <h4 className="text-sm font-medium text-gray-500">Cap Rate</h4>
                          </div>
                          <p className="text-lg font-semibold text-[#09261E]">5.2%</p>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <MoveRight className="h-4 w-4 mr-1 text-[#09261E]" />
                            <h4 className="text-sm font-medium text-gray-500">Cash-on-Cash Return</h4>
                          </div>
                          <p className="text-lg font-semibold text-[#09261E]">7.8%</p>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-[#09261E]" />
                            <h4 className="text-sm font-medium text-gray-500">Monthly Rent %</h4>
                          </div>
                          <p className="text-lg font-semibold text-[#09261E]">
                            {((property.price * 0.008) / (property.price + property.price * 0.05) * 100).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4 pb-2 text-center">
                      <Link 
                        to="/contractor-quote" 
                        className="text-[#09261E] inline-block hover:underline text-sm"
                      >
                        I'm a contractor — Submit a Quote
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Calculators Section */}
              <Accordion id="calculators" type="single" defaultValue="calculators" collapsible className="w-full">
                <AccordionItem value="calculators" className="border-b border-gray-200">
                  <AccordionTrigger className="w-full py-4 text-2xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                    <div className="flex items-center">
                      <PercentSquare className="mr-3 h-6 w-6 text-[#09261E]" />
                      <span>Calculators</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Flip Calculator - Redesigned */}
                      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-lg text-[#09261E] flex items-center">
                            <PercentSquare className="h-5 w-5 mr-2 text-[#135341]" />
                            Flip Calculator
                          </h4>
                          <Badge variant="outline" className="bg-[#135341]/10 text-[#135341] border-0">
                            House Flip
                          </Badge>
                        </div>
                        <div className="space-y-4 mb-5">
                          <div>
                            <label className="text-sm font-medium text-gray-600 block mb-1.5 flex items-center">
                              Purchase Price
                              <span className="ml-1.5 text-xs text-gray-400">(Auto-filled)</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                              <Input 
                                type="text" 
                                defaultValue={property.price.toLocaleString()} 
                                className="bg-white pl-7 border-gray-300 focus:border-[#135341] focus:ring-[#135341]/20" 
                                id="purchase-price-input"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-600 block mb-1.5 flex items-center">
                              Repair Costs
                              <span className="ml-1.5 text-xs text-gray-400">(Estimated)</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                              <Input 
                                type="text" 
                                defaultValue={(property.price * 0.05).toFixed(0)} 
                                className="bg-white pl-7 border-gray-300 focus:border-[#135341] focus:ring-[#135341]/20" 
                                id="repair-costs-input"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-600 block mb-1.5 flex items-center">
                              After Repair Value (ARV)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-3.5 w-3.5 ml-1.5 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Estimated value of the property after all repairs and renovations are completed</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                              <Input 
                                type="text" 
                                defaultValue={(property.price * 1.2).toFixed(0)} 
                                className="bg-white pl-7 border-gray-300 focus:border-[#135341] focus:ring-[#135341]/20" 
                                id="arv-input"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600 block mb-1.5">
                                Holding Costs
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                <Input 
                                  type="text" 
                                  defaultValue={(property.price * 0.02).toFixed(0)} 
                                  className="bg-white pl-7 border-gray-300 focus:border-[#135341] focus:ring-[#135341]/20" 
                                  id="holding-costs-input"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600 block mb-1.5">
                                Selling Costs
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                <Input 
                                  type="text" 
                                  defaultValue={(property.price * 0.06).toFixed(0)} 
                                  className="bg-white pl-7 border-gray-300 focus:border-[#135341] focus:ring-[#135341]/20" 
                                  id="selling-costs-input"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#EAF2EF] p-4 rounded-lg mb-5 border border-[#135341]/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Total Investment</span>
                            <span className="text-[#09261E] font-semibold">
                              ${(property.price + (property.price * 0.05) + (property.price * 0.02)).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Total Profit</span>
                            <span id="flip-result" className="text-[#135341] font-bold text-lg">
                              ${((property.price * 1.2) - property.price - (property.price * 0.05) - (property.price * 0.02) - (property.price * 0.06)).toLocaleString(undefined, {maximumFractionDigits: 0})}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">ROI</span>
                            <span className="text-[#09261E] font-bold">
                              {(((property.price * 1.2) - property.price - (property.price * 0.05) - (property.price * 0.02) - (property.price * 0.06)) / (property.price + (property.price * 0.05) + (property.price * 0.02)) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            className="bg-[#09261E] hover:bg-[#09261E]/90 text-white"
                            onClick={() => {
                              // Parse inputs
                              const purchasePriceStr = (document.getElementById('purchase-price-input') as HTMLInputElement).value.replace(/[$,]/g, '');
                              const repairCostsStr = (document.getElementById('repair-costs-input') as HTMLInputElement).value.replace(/[$,]/g, '');
                              const arvStr = (document.getElementById('arv-input') as HTMLInputElement).value.replace(/[$,]/g, '');
                              const holdingCostsStr = (document.getElementById('holding-costs-input') as HTMLInputElement).value.replace(/[$,]/g, '');
                              const sellingCostsStr = (document.getElementById('selling-costs-input') as HTMLInputElement).value.replace(/[$,]/g, '');
                              
                              const purchasePrice = parseFloat(purchasePriceStr) || property.price;
                              const repairCosts = parseFloat(repairCostsStr) || property.price * 0.05;
                              const arv = parseFloat(arvStr) || property.price * 1.2;
                              const holdingCosts = parseFloat(holdingCostsStr) || property.price * 0.02;
                              const sellingCosts = parseFloat(sellingCostsStr) || property.price * 0.06;
                              
                              // Calculate profit
                              const profit = arv - (purchasePrice + repairCosts + holdingCosts + sellingCosts);
                              
                              // Update result
                              const resultElement = document.getElementById('flip-result');
                              if (resultElement) {
                                resultElement.textContent = `$${profit.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
                              }
                            }}
                          >
                            Recalculate
                          </Button>
                          <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                            View Full Analysis
                          </Button>
                        </div>
                      </div>
                      
                      {/* Rental Calculator - Redesigned */}
                      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-lg text-[#09261E] flex items-center">
                            <Home className="h-5 w-5 mr-2 text-[#135341]" />
                            Rental Calculator
                          </h4>
                          <Badge variant="outline" className="bg-[#09261E]/10 text-[#09261E] border-0">
                            Rental Property
                          </Badge>
                        </div>
                        <div className="space-y-4 mb-5">
                          <div>
                            <label className="text-sm font-medium text-gray-600 block mb-1.5 flex items-center">
                              Purchase Price
                              <span className="ml-1.5 text-xs text-gray-400">(Auto-filled)</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                              <Input 
                                type="text" 
                                defaultValue={property.price.toLocaleString()} 
                                className="bg-white pl-7 border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/20" 
                                id="rental-purchase-price-input"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600 block mb-1.5">
                                Monthly Rent
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                <Input 
                                  type="text" 
                                  defaultValue={(property.price * 0.008).toFixed(0)} 
                                  className="bg-white pl-7 border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/20"
                                  id="monthly-rent-input"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600 block mb-1.5">
                                Monthly Expenses
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                <Input 
                                  type="text" 
                                  defaultValue={(property.price * 0.003).toFixed(0)} 
                                  className="bg-white pl-7 border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/20"
                                  id="monthly-expenses-input"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600 block mb-1.5 flex items-center">
                                Down Payment
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-3.5 w-3.5 ml-1.5 text-gray-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">Percentage of the purchase price paid upfront</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </label>
                              <div className="relative">
                                <Input 
                                  type="text" 
                                  defaultValue="20%" 
                                  className="bg-white pr-6 border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/20"
                                  id="down-payment-input"
                                />
                                <span className="absolute right-3 top-2.5 text-gray-500">%</span>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600 block mb-1.5">
                                Interest Rate
                              </label>
                              <div className="relative">
                                <Input 
                                  type="text" 
                                  defaultValue="4.5%" 
                                  className="bg-white pr-6 border-gray-300 focus:border-[#09261E] focus:ring-[#09261E]/20"
                                  id="interest-rate-input"
                                />
                                <span className="absolute right-3 top-2.5 text-gray-500">%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#09261E]/5 p-4 rounded-lg mb-5 border border-[#09261E]/10">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Monthly NOI</span>
                            <span className="text-[#09261E] font-semibold">
                              ${((property.price * 0.008) - (property.price * 0.003)).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700 flex items-center">
                              Cap Rate
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-3.5 w-3.5 ml-1.5 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Net Operating Income divided by Property Value</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </span>
                            <span id="cap-rate-result" className="text-[#09261E] font-bold">
                              {((((property.price * 0.008) - (property.price * 0.003)) * 12) / property.price * 100).toFixed(2)}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Cash on Cash Return</span>
                            <span id="cash-on-cash-result" className="text-[#09261E] font-bold text-lg">
                              {(((((property.price * 0.008) - (property.price * 0.003)) * 12) - ((property.price * 0.8) * 0.045)) / ((property.price * 0.2) + (property.price * 0.03)) * 100).toFixed(2)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            className="bg-[#09261E] hover:bg-[#09261E]/90 text-white"
                            onClick={() => {
                              // Parse inputs
                              const purchasePriceStr = (document.getElementById('rental-purchase-price-input') as HTMLInputElement).value.replace(/[$,]/g, '');
                              const rentStr = (document.getElementById('monthly-rent-input') as HTMLInputElement).value.replace(/[$,]/g, '');
                              const expensesStr = (document.getElementById('monthly-expenses-input') as HTMLInputElement).value.replace(/[$,]/g, '');
                              const downPaymentStr = (document.getElementById('down-payment-input') as HTMLInputElement).value.replace(/[%,]/g, '');
                              const interestRateStr = (document.getElementById('interest-rate-input') as HTMLInputElement).value.replace(/[%,]/g, '');
                              
                              const purchasePrice = parseFloat(purchasePriceStr) || property.price;
                              const monthlyRent = parseFloat(rentStr) || property.price * 0.008;
                              const monthlyExpenses = parseFloat(expensesStr) || property.price * 0.003;
                              const downPaymentPercent = parseFloat(downPaymentStr) || 20;
                              const interestRatePercent = parseFloat(interestRateStr) || 4.5;
                              
                              // Calculate metrics
                              const annualRent = monthlyRent * 12;
                              const annualExpenses = monthlyExpenses * 12;
                              const netOperatingIncome = annualRent - annualExpenses;
                              const rentPercentage = (monthlyRent / purchasePrice) * 100;
                              const capRate = (netOperatingIncome / purchasePrice) * 100;
                              
                              // Cash on Cash calculation
                              const downPayment = (purchasePrice * downPaymentPercent) / 100;
                              const loanAmount = purchasePrice - downPayment;
                              const closingCosts = purchasePrice * 0.03;
                              const totalInvestment = downPayment + closingCosts;
                              
                              // Annual mortgage payment (simple calculation)
                              const annualMortgagePayment = loanAmount * (interestRatePercent / 100);
                              
                              const cashOnCash = (netOperatingIncome - annualMortgagePayment) / totalInvestment * 100;
                              
                              // Update results
                              document.getElementById('cap-rate-result')!.textContent = `${capRate.toFixed(2)}%`;
                              document.getElementById('cash-on-cash-result')!.textContent = `${cashOnCash.toFixed(2)}%`;
                            }}
                          >
                            Recalculate
                          </Button>
                          <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                            View Full Analysis
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="text-center py-4">
                      <Link to="/playbook#tools" className="text-[#09261E] hover:underline font-medium inline-flex items-center">
                        View All Property Calculators <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Location Section */}
              <Accordion id="location" type="single" defaultValue="location" collapsible className="w-full">
                <AccordionItem value="location" className="border-b border-gray-200">
                  <AccordionTrigger className="w-full py-4 text-2xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                    <div className="flex items-center">
                      <MapPin className="mr-3 h-6 w-6 text-[#09261E]" />
                      <span>Location</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4">
                    {/* Nested Accordion for Demographics */}
                    <Accordion type="single" collapsible className="w-full mb-6 border border-gray-200 rounded-lg overflow-hidden">
                      <AccordionItem value="demographics" className="border-none">
                        <AccordionTrigger className="px-4 py-3 bg-gray-50 text-lg font-heading font-semibold text-[#09261E] hover:no-underline hover:bg-gray-100 transition-colors">
                          <div className="flex items-center">
                            <User className="mr-2 h-5 w-5 text-[#09261E]" />
                            <span>Demographics</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="bg-white px-4 py-6 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Population */}
                            <div className="space-y-4">
                              <h4 className="font-medium text-[#09261E]">Population</h4>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Total Population</span>
                                <span className="font-bold text-[#09261E]">124,356</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Median Age</span>
                                <span className="font-bold text-[#09261E]">37.2</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Households</span>
                                <span className="font-bold text-[#09261E]">48,903</span>
                              </div>
                            </div>
                            
                            {/* Household Income */}
                            <div className="space-y-4">
                              <h4 className="font-medium text-[#09261E]">Household Income</h4>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Median Income</span>
                                <span className="font-bold text-[#09261E]">$56,842</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Average Income</span>
                                <span className="font-bold text-[#09261E]">$68,125</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Per Capita Income</span>
                                <span className="font-bold text-[#09261E]">$32,590</span>
                              </div>
                            </div>
                            
                            {/* Age Distribution */}
                            <div className="space-y-4 md:col-span-2">
                              <h4 className="font-medium text-[#09261E]">Age Distribution</h4>
                              <div className="h-8 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full float-left bg-[#09261E]/90" style={{ width: '18%' }}></div>
                                <div className="h-full float-left bg-[#09261E]/75" style={{ width: '26%' }}></div>
                                <div className="h-full float-left bg-[#09261E]/60" style={{ width: '22%' }}></div>
                                <div className="h-full float-left bg-[#803344]/60" style={{ width: '19%' }}></div>
                                <div className="h-full float-left bg-[#803344]/75" style={{ width: '15%' }}></div>
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-2">
                                <div className="flex items-center text-xs">
                                  <div className="w-3 h-3 rounded-full mr-1 bg-[#09261E]/90"></div>
                                  <span>Under 18: 18%</span>
                                </div>
                                <div className="flex items-center text-xs">
                                  <div className="w-3 h-3 rounded-full mr-1 bg-[#09261E]/75"></div>
                                  <span>18-34: 26%</span>
                                </div>
                                <div className="flex items-center text-xs">
                                  <div className="w-3 h-3 rounded-full mr-1 bg-[#09261E]/60"></div>
                                  <span>35-54: 22%</span>
                                </div>
                                <div className="flex items-center text-xs">
                                  <div className="w-3 h-3 rounded-full mr-1 bg-[#803344]/60"></div>
                                  <span>55-74: 19%</span>
                                </div>
                                <div className="flex items-center text-xs">
                                  <div className="w-3 h-3 rounded-full mr-1 bg-[#803344]/75"></div>
                                  <span>75+: 15%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    {/* 2x4 Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Row 1-2, Column 1: Map - spans 1 column and 2 rows */}
                      <div className="row-span-2">
                        <h4 className="font-medium mb-3 text-[#09261E]">Map</h4>
                        <div className="rounded-lg overflow-hidden bg-gray-100 h-[300px] flex items-center justify-center">
                          <div className="text-center">
                            <MapPinned className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <Button variant="outline" className="bg-white hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300">View on Map</Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Row 1-2, Column 2: Home Values & Housing Ownership - spans 1 column and 2 rows */}
                      <div className="row-span-2 space-y-4">
                        {/* Home Values */}
                        <div className="rounded-lg bg-gray-50 p-4">
                          <h4 className="font-medium mb-3 text-[#09261E]">Home Values</h4>
                          <div className="h-7 w-full bg-gray-200 rounded-full overflow-hidden">
                            {demographicData.homeValues.map((item, index) => (
                              <div 
                                key={index}
                                className="h-full float-left" 
                                style={{
                                  width: `${item.percentage}%`,
                                  backgroundColor: [
                                    'rgba(19, 83, 65, 0.95)', // dark green (primary)
                                    'rgba(19, 83, 65, 0.8)',  // medium green
                                    'rgba(19, 83, 65, 0.65)', // light green
                                    'rgba(128, 51, 68, 0.65)', // light wine
                                    'rgba(128, 51, 68, 0.8)',  // medium wine
                                    'rgba(128, 51, 68, 0.95)'  // dark wine (secondary)
                                  ][index % 6]
                                }}
                              />
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                            {demographicData.homeValues.map((item, index) => (
                              <div key={index} className="flex items-center text-xs">
                                <div 
                                  className="w-3 h-3 rounded-full mr-1"
                                  style={{
                                    backgroundColor: [
                                      'rgba(19, 83, 65, 0.95)', // dark green (primary)
                                      'rgba(19, 83, 65, 0.8)',  // medium green
                                      'rgba(19, 83, 65, 0.65)', // light green
                                      'rgba(128, 51, 68, 0.65)', // light wine
                                      'rgba(128, 51, 68, 0.8)',  // medium wine
                                      'rgba(128, 51, 68, 0.95)'  // dark wine (secondary)
                                    ][index % 6]
                                  }}
                                />
                                <span>{item.group}: {item.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Housing Ownership */}
                        <div className="rounded-lg bg-gray-50 p-4 mt-4">
                          <h4 className="font-medium mb-3 text-[#09261E]">Housing Ownership</h4>
                          <div className="h-7 w-full bg-gray-200 rounded-full overflow-hidden">
                            {demographicData.ownershipType.map((item, index) => (
                              <div 
                                key={index}
                                className="h-full float-left" 
                                style={{
                                  width: `${item.percentage}%`,
                                  backgroundColor: [
                                    'rgba(19, 83, 65, 0.95)', // dark green
                                    'rgba(19, 83, 65, 0.75)', // medium green
                                    'rgba(128, 51, 68, 0.75)', // medium wine
                                    'rgba(229, 159, 159, 0.8)'  // salmon
                                  ][index]
                                }}
                              />
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                            {demographicData.ownershipType.map((item, index) => (
                              <div key={index} className="flex items-center text-xs">
                                <div 
                                  className="w-3 h-3 rounded-full mr-1"
                                  style={{
                                    backgroundColor: [
                                      'rgba(19, 83, 65, 0.95)', // dark green
                                      'rgba(19, 83, 65, 0.75)', // medium green
                                      'rgba(128, 51, 68, 0.75)', // medium wine
                                      'rgba(229, 159, 159, 0.8)'  // salmon
                                    ][index]
                                  }}
                                />
                                <span>{item.group}: {item.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                      {/* Row 3, Columns 1-2: Monthly Rent Costs - spans 2 columns and 1 row */}
                      <div className="col-span-2 mt-10">
                        <h4 className="font-medium mb-3 text-[#09261E]">Monthly Rent Costs</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {demographicData.monthlyRent.map((item, index) => (
                            <div key={index} className="border rounded-md bg-white p-4">
                              <div className="text-sm text-gray-500 mb-1">{item.type}</div>
                              <div className="font-semibold text-lg">${item.rent}/mo</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Row 4, Columns 1-2: Year Housing Built - compact horizontal bar chart */}
                      <div className="col-span-2 mt-6 bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-[#09261E] text-base">Year Housing Was Built</h4>
                          <div className="text-xs text-gray-500">Average age: 56 years</div>
                        </div>
                        
                        <div className="flex items-center space-x-1 mb-2">
                          {demographicData.yearBuilt.map((item, index) => (
                            <div 
                              key={index} 
                              className="relative group flex-1"
                              title={`${item.group}: ${item.percentage}%`}
                            >
                              <div 
                                className="h-8 rounded-sm" 
                                style={{ 
                                  backgroundColor: index < 4 
                                    ? `rgba(19, 83, 65, ${0.95 - index * 0.1})` // greens for newer homes
                                    : `rgba(128, 51, 68, ${0.55 + (index-4) * 0.1})`, // wine colors for older homes
                                  height: `${Math.max(30, item.percentage * 1.5)}px`
                                }}
                              />
                              <div className="absolute bottom-full left-0 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                {item.group}: {item.percentage}%
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>2020+</span>
                          <span>2000-19</span>
                          <span>1980-99</span>
                          <span>1960-79</span>
                          <span>1940-59</span>
                          <span>&lt;1940</span>
                        </div>
                        
                        <div className="text-xs text-center text-gray-500 mt-2">
                          Most common housing age: Before 1950 ({demographicData.yearBuilt[8].percentage}%)
                        </div>
                      </div>
                    
                    <div className="text-center text-xs text-gray-500 mt-6">
                      Data sourced from unitedstateszipcodes.org
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Find a REP Section */}
              <Accordion id="reps" type="single" defaultValue="reps" collapsible className="w-full">
                <AccordionItem value="reps" className="border-b border-gray-200">
                  <AccordionTrigger className="w-full py-4 text-2xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                    <div className="flex items-center">
                      <Wrench className="mr-3 h-6 w-6 text-[#09261E]" />
                      <span>Find a REP</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4">
                    <p className="text-gray-600 mb-4">Connect with local professionals who can help with this property:</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                      <Link to="/reps?type=agent&location=Milwaukee" className="bg-white border border-[#09261E]/20 rounded-md p-3 hover:bg-[#09261E]/5 transition-colors">
                        <div className="text-center">
                          <Avatar className="w-14 h-14 mx-auto mb-2 border-2 border-[#09261E]/20">
                            <AvatarImage src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=150&h=150&auto=format&fit=crop" alt="Real Estate Agent" />
                            <AvatarFallback className="bg-[#09261E]/10">
                              <User className="h-6 w-6 text-[#09261E]" />
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="font-medium text-[#09261E]">Agent</h3>
                        </div>
                      </Link>
                      <Link to="/reps?type=contractor&location=Milwaukee" className="bg-white border border-[#09261E]/20 rounded-md p-3 hover:bg-[#09261E]/5 transition-colors">
                        <div className="text-center">
                          <Avatar className="w-14 h-14 mx-auto mb-2 border-2 border-[#09261E]/20">
                            <AvatarImage src="https://images.unsplash.com/photo-1541647376583-8934aaf3448a?q=80&w=150&h=150&auto=format&fit=crop" alt="Contractor" />
                            <AvatarFallback className="bg-[#09261E]/10">
                              <Hammer className="h-6 w-6 text-[#09261E]" />
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="font-medium text-[#09261E]">Contractor</h3>
                        </div>
                      </Link>
                      <Link to="/reps?type=lender&location=Milwaukee" className="bg-white border border-[#09261E]/20 rounded-md p-3 hover:bg-[#09261E]/5 transition-colors">
                        <div className="text-center">
                          <Avatar className="w-14 h-14 mx-auto mb-2 border-2 border-[#09261E]/20">
                            <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&h=150&auto=format&fit=crop" alt="Lender" />
                            <AvatarFallback className="bg-[#09261E]/10">
                              <DollarSign className="h-6 w-6 text-[#09261E]" />
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="font-medium text-[#09261E]">Lender</h3>
                        </div>
                      </Link>
                    </div>
                    
                    <div className="text-center pb-2">
                      <Link to="/reps" className="text-[#09261E] hover:underline font-medium inline-flex items-center">
                        View All REPs <i className="fas fa-arrow-right ml-2"></i>
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Property History Section */}
              <Accordion id="history" type="single" defaultValue="history" collapsible className="w-full">
                <AccordionItem value="history" className="border-b border-gray-200">
                  <AccordionTrigger className="w-full py-4 text-2xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                    <div className="flex items-center">
                      <FileText className="mr-3 h-6 w-6 text-[#09261E]" />
                      <span>Property History</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">12/15/2024</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Listed</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">${property.price.toLocaleString()}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">PropertyDeals</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">06/30/2024</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Assessed</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">${(property.price * 0.85).toLocaleString()}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">County Records</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">01/22/2019</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sold</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">${(property.price * 0.8).toLocaleString()}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">MLS</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="text-xs text-gray-500 pt-4 pb-2 italic">
                      Property history data is for demonstration purposes. In a production app, this would be pulled from public records.
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Comparable Properties Section */}
              <Accordion id="comparable" type="single" defaultValue="comparable" collapsible className="w-full">
                <AccordionItem value="comparable" className="border-b border-gray-200">
                  <AccordionTrigger className="w-full py-4 text-2xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                    <div className="flex items-center">
                      <Building className="mr-3 h-6 w-6 text-[#09261E]" />
                      <span>Comparable Properties</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {similarProperties.slice(0, 4).map((comp, index) => (
                        <div key={index} className="flex bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <div className="w-1/3">
                            <img src={comp.imageUrl || 'https://source.unsplash.com/random/300x200/?house'} 
                                alt={comp.address} 
                                className="w-full h-full object-cover" />
                          </div>
                          <div className="w-2/3 p-3">
                            <div className="font-medium text-[#09261E] mb-1 truncate">{comp.address}</div>
                            <div className="text-gray-600 text-sm mb-2">{comp.city}, {comp.state}</div>
                            <div className="flex justify-between">
                              <div className="font-bold text-[#09261E]">${comp.price?.toLocaleString() || 'Price unavailable'}</div>
                              <div className="text-sm text-gray-500">{comp.bedrooms}bd, {comp.bathrooms}ba</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            {/* Right Sidebar - Contact Interested Card */}
            <div className="w-full lg:w-1/3 xl:w-1/4 mt-8 lg:mt-0">
              <div className="sticky top-24 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-md" style={{ zIndex: 40 }}>
                <div className="p-4">
                  <h3 className="text-2xl font-bold text-[#09261E]">Interested in this property?</h3>
                  <p className="text-gray-600">Contact the seller or schedule a viewing</p>
                </div>
                
                <div className="bg-white p-4 border-y border-gray-200">
                  <div className="flex items-center mb-4 pb-3 border-b border-gray-100">
                    <Link to="/sellers/michael-johnson" className="flex items-center group">
                      <Avatar className="h-16 w-16 border border-gray-200">
                        <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&h=120&auto=format&fit=crop" alt="Seller" />
                        <AvatarFallback className="bg-[#09261E]/10 text-[#09261E] text-lg font-semibold">MJ</AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <div className="font-medium text-xl text-[#09261E] group-hover:underline">Michael Johnson</div>
                        <div className="text-gray-500 text-sm flex items-center">
                          Seller <span className="mx-1">•</span> Responds in 24hrs
                        </div>
                      </div>
                    </Link>
                  </div>
                  
                  <Button 
                    className="w-full bg-[#09261E] hover:bg-[#135341] mb-3 py-6 rounded-md text-base font-medium transition-all transform hover:scale-[1.02]" 
                    onClick={() => setContactModalOpen(true)}
                  >
                    Contact Seller
                  </Button>
                  
                  <Button 
                    className="w-full bg-gray-50 text-gray-800 hover:bg-gray-100 hover:border-gray-400 transition-all mb-3 py-6 rounded-md text-base font-medium border border-gray-300 transform hover:scale-[1.02]" 
                    variant="outline"
                    onClick={() => setOfferModalOpen(true)}
                  >
                    Make an Offer
                  </Button>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center text-gray-500 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    142 people viewed this property
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 text-gray-600 text-sm space-y-1">
                  <div>Property ID: 1</div>
                  <div>Listed: 4/13/2025</div>
                </div>
              </div>
              
              {/* Contact Card - Mobile Version */}
              <div className="lg:hidden sticky bottom-0 left-0 right-0 bg-white p-4 shadow-md" style={{ zIndex: 100 }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#09261E] text-lg">${property.price.toLocaleString()}</h3>
                    <p className="text-gray-600 text-xs">Interested in this property?</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      className="bg-white hover:bg-gray-50 text-[#09261E] h-10 w-10 rounded-full p-0 flex items-center justify-center border border-gray-200"
                      variant="outline"
                      size="icon"
                      onClick={() => window.location.href = "tel:+15555555555"}
                    >
                      <Phone className="h-5 w-5 text-[#09261E]" />
                    </Button>
                    <Button
                      className="bg-white hover:bg-gray-50 text-[#09261E] px-5 border border-gray-200"
                      variant="outline"
                      size="default"
                      onClick={() => setContactModalOpen(true)}
                    >
                      Contact Seller
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Smart Property Recommendations */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-6">More Deals by Michael</h2>
          
          {/* Location-based recommendations using recommendation engine */}
          {property && (
            <div>
              {/* This is a placeholder for the PropertyRecommendations component which needs to be imported */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {similarProperties.slice(0, 4).map((prop, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img 
                        src={prop.imageUrl || 'https://source.unsplash.com/random/400x300/?house'} 
                        alt={prop.address} 
                        className="w-full h-48 object-cover" 
                      />
                      <div className="absolute top-2 right-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="bg-white/80 hover:bg-white h-7 w-7 rounded-full"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      {prop.offMarketDeal && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-[#803344] hover:bg-[#803344]">Off-Market</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="font-bold text-[#09261E] mb-1">${prop.price?.toLocaleString() || 'Price unavailable'}</div>
                      <div className="text-gray-700 mb-2 truncate">{prop.address}</div>
                      <div className="flex text-sm text-gray-600 mb-3">
                        <div className="mr-3">{prop.bedrooms} bd</div>
                        <div className="mr-3">{prop.bathrooms} ba</div>
                        <div>{prop.squareFeet?.toLocaleString() || 'N/A'} sqft</div>
                      </div>
                      <div className="text-xs text-gray-500">{prop.city}, {prop.state}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Similar Deals Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-6">Similar Deals You Might Like</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarProperties.slice(0, 4).map((prop, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img 
                    src={prop.imageUrl || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=400&h=300&auto=format&fit=crop'} 
                    alt={prop.address} 
                    className="w-full h-48 object-cover" 
                  />
                  <div className="absolute top-2 right-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="bg-white/80 hover:bg-white h-7 w-7 rounded-full"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  {prop.offMarketDeal && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-[#803344] hover:bg-[#803344]">Off-Market</Badge>
                    </div>
                  )}
                  {prop.newListing && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-[#135341] hover:bg-[#135341]">New Listing</Badge>
                    </div>
                  )}
                  {prop.priceDrop && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-orange-500 hover:bg-orange-500">Price Drop</Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="font-bold text-[#09261E] mb-1">${prop.price?.toLocaleString() || 'Price unavailable'}</div>
                  <div className="text-gray-700 mb-2 truncate">{prop.address}</div>
                  <div className="flex text-sm text-gray-600 mb-3">
                    <div className="mr-3">{prop.bedrooms} bd</div>
                    <div className="mr-3">{prop.bathrooms} ba</div>
                    <div>{prop.squareFeet?.toLocaleString() || 'N/A'} sqft</div>
                  </div>
                  <div className="text-xs text-gray-500">{prop.city}, {prop.state}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Removed "View All Similar Properties" button */}
        </div>
      </section>
      
      {/* Email Signup CTA */}
      <section className="py-10 bg-white border-t border-gray-100 text-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3 text-[#09261E]">Don't Miss Out on New Deals</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Get notified about new properties in this area and receive personalized recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="border-gray-200 focus-visible:ring-[#09261E]/20"
              />
              <Button className="bg-[#09261E] hover:bg-[#135341] whitespace-nowrap">
                Sign Up Now
              </Button>
            </div>
            
            <p className="mt-3 text-sm text-gray-500">
              We respect your privacy and won't share your information.
            </p>
          </div>
        </div>
      </section>
      
      {/* Photo Gallery Modal */}
      {viewingAllPhotos && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingAllPhotos(false)}
        >
          <div 
            className="relative max-w-5xl w-full h-[90vh] bg-white rounded-lg overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-gray-700 bg-white/90 p-2 rounded-full hover:bg-gray-200 transition-colors z-10"
              onClick={() => setViewingAllPhotos(false)}
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="p-6 h-full overflow-y-auto">
              <h2 className="text-2xl font-bold text-[#09261E] mb-4">Property Photos</h2>
              <div className="space-y-6">
                {propertyImages.map((img, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={img} 
                      alt={`Photo ${i+1} of ${property.address}`} 
                      className="w-full object-contain" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Contact Modal */}
      {contactModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
          onClick={() => setContactModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#09261E]/5 p-5">
              <h2 className="text-2xl font-bold text-[#09261E]">Contact About This Property</h2>
              <p className="text-gray-600 mt-1">{property.address}, {property.city}</p>
            </div>
            
            <div className="p-5">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <Link to="/sellers/michael-johnson" className="flex items-center group">
                  <Avatar className="h-14 w-14 border border-gray-200">
                    <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&h=120&auto=format&fit=crop" alt="Seller" />
                    <AvatarFallback className="bg-[#09261E]/10 text-[#09261E] text-lg font-semibold">MJ</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <div className="font-medium text-lg text-[#09261E] group-hover:underline">Michael Johnson</div>
                    <div className="text-gray-500 flex items-center text-sm">
                      Seller <span className="mx-2">•</span> Responds in 24hrs
                    </div>
                  </div>
                </Link>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="(123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="I'm interested in this property and would like to schedule a viewing." 
                            {...field} 
                            rows={4} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-6">
                    <div className="flex gap-3">
                      <Button 
                        type="button" 
                        className="bg-white border-gray-200 text-[#09261E] hover:bg-gray-50 py-6 flex-shrink-0"
                        variant="outline"
                        onClick={() => window.location.href = "tel:+15555555555"}
                      >
                        <Phone className="h-5 w-5 mr-1 text-[#09261E]" />
                        Call
                      </Button>
                      <Button type="submit" className="w-full bg-[#09261E] hover:bg-[#135341] py-6">
                        {inquiryMutation.isPending ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Sending...
                          </div>
                        ) : "Send Message"}
                      </Button>
                    </div>
                    
                    <div className="mt-4 text-center text-sm text-gray-500">
                      By submitting, you agree to our <Link to="/terms" className="text-[#09261E] hover:underline">Terms of Service</Link>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      )}
      
      {/* Make an Offer Modal */}
      {offerModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setOfferModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-[#09261E] mb-4">Make an Offer</h2>
              
            <div className="mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
                <h4 className="font-heading text-[#09261E] font-bold mb-2">Sign up or login required</h4>
                <p className="text-gray-700 text-sm mb-3">
                  To submit an offer, you'll need to create an account or login to your existing account.
                </p>
                <Link to="/auth" className="bg-[#09261E] text-white rounded-md py-2 px-4 text-sm font-medium inline-block hover:bg-[#135341] transition-colors">
                  Sign up or Login
                </Link>
              </div>
                
              <div className="text-gray-600 text-sm">
                <p className="mb-2">Making an offer through PropertyDeals gives you:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Faster response times from sellers</li>
                  <li>Secure document handling and signatures</li>
                  <li>Access to recommended inspectors and lenders</li>
                  <li>Step-by-step guidance through the entire process</li>
                </ul>
              </div>
            </div>
              
            <Button 
              onClick={() => setOfferModalOpen(false)}
              className="w-full mt-4 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300"
              variant="outline"
            >
              Close
            </Button>
          </div>
        </div>
      )}
      
      {/* Google Maps Modal */}
      {viewingMap && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingMap(false)}
        >
          <div 
            className="bg-white rounded-lg p-4 max-w-3xl w-full h-[60vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#09261E]">{property.address}, {property.city}, {property.state}</h2>
              <Button 
                variant="ghost" 
                className="p-1 h-auto hover:bg-gray-100 hover:text-gray-800" 
                onClick={() => setViewingMap(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="h-[calc(100%-60px)] w-full overflow-hidden rounded-md">
              <iframe 
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDemn0EXWU_G9tQpYF8t-EPcHOgmijlEbM&q=${encodeURIComponent(formattedAddress)}`}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline"
                className="border-[#09261E] text-[#09261E] hover:bg-[#09261E] hover:text-white mr-3"
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formattedAddress)}`, '_blank')}
              >
                Open in Google Maps
              </Button>
              <Button 
                variant="default"
                className="bg-[#09261E] hover:bg-[#09261E]/90"
                onClick={() => setViewingMap(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Property Report Dialog */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading">Share Property Report</DialogTitle>
            <DialogDescription className="text-gray-600">
              Choose how you'd like to share this property report with others.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="rounded-lg border p-5">
              <h3 className="font-medium mb-2 text-[#09261E]">Property</h3>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                  <img 
                    src={propertyImages[0]} 
                    alt={property.address} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <p className="font-medium">{property.address}</p>
                  <p className="text-sm text-gray-500">{property.city}, {property.state} {property.zipCode}</p>
                  <p className="text-sm font-medium mt-1">${property.price.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium text-[#09261E]">Share Options</h3>
              
              {/* Copy Link Option */}
              <div 
                className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:border-[#09261E] hover:bg-[#09261E]/5 transition-colors"
                onClick={handleCopyToClipboard}
              >
                <div className="flex items-center">
                  <div className="bg-[#09261E]/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <LinkIcon className="w-5 h-5 text-[#09261E]" />
                  </div>
                  <div>
                    <p className="font-medium">Copy Link</p>
                    <p className="text-xs text-gray-500">Copy shareable property report link</p>
                  </div>
                </div>
                <div>
                  {copySuccess ? (
                    <CheckIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <CopyIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {/* Email Option */}
              <div 
                className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:border-[#09261E] hover:bg-[#09261E]/5 transition-colors"
                onClick={handleEmailShare}
              >
                <div className="flex items-center">
                  <div className="bg-[#09261E]/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <Mail className="w-5 h-5 text-[#09261E]" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-xs text-gray-500">Share via email with detailed info</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              
              {/* PDF Report Option */}
              <div 
                className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:border-[#09261E] hover:bg-[#09261E]/5 transition-colors"
                onClick={generatePdfReport}
              >
                <div className="flex items-center">
                  <div className="bg-[#09261E]/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5 text-[#09261E]" />
                  </div>
                  <div>
                    <p className="font-medium">PDF Report</p>
                    <p className="text-xs text-gray-500">Download a detailed PDF report</p>
                  </div>
                </div>
                <Download className="w-5 h-5 text-gray-400" />
              </div>
              
              {/* Social Media Options */}
              <div className="border-t pt-3 mt-3">
                <h4 className="text-sm font-medium mb-2 text-gray-600">Share on Social Media</h4>
                <div className="flex gap-3">
                  <button className="bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] p-2 rounded-full">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] p-2 rounded-full">
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button className="bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] p-2 rounded-full">
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button className="bg-[#E60023]/10 hover:bg-[#E60023]/20 text-[#E60023] p-2 rounded-full">
                    <SiPinterest className="w-5 h-5" />
                  </button>
                  <button className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] p-2 rounded-full">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button className="bg-[#09261E] hover:bg-[#09261E]/90" onClick={() => setShareModalOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}