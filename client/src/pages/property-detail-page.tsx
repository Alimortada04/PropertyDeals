import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Share2, Heart, MapPin, Home, ChevronRight, ChevronLeft, X, ChevronsRight, Mail, MessageSquare, Phone } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { insertPropertyInquirySchema, InsertPropertyInquiry } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import PropertyRecommendations from "@/components/property-recommendations";
import { allProperties, similarProperties } from "@/lib/data";

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
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // Get property data
  const { data: property, isLoading, error } = useQuery({
    queryKey: [`/api/properties/${propertyId}`],
    queryFn: async () => {
      const response = await fetch(`/api/properties/${propertyId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch property');
      }
      return response.json();
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
        propertyId,
        sellerId: property?.sellerId || 1,
        status: 'new',
        createdAt: new Date().toISOString() 
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
  
  return (
    <>
      {/* Property Hero Section with Photo Gallery */}
      <section className="relative bg-white">
        <div className="container mx-auto px-4 pt-12 pb-8">
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
              
              {/* Property Status Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {property.propertyType && (
                  <Badge variant="outline" className="bg-[#09261E]/10 text-[#09261E] border-0">
                    {property.propertyType}
                  </Badge>
                )}
                {/* Condition Badge - Would come from property data in real implementation */}
                <Badge variant="outline" className="bg-[#135341]/10 text-[#135341] border-0">
                  Light Rehab
                </Badge>
                <Badge variant="outline" className="bg-gray-100 text-gray-700 border-0">
                  {daysOnMarket} {daysOnMarket === 1 ? 'day' : 'days'} on PropertyDeals
                </Badge>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col items-end">
              <div className="text-3xl md:text-4xl font-bold text-[#09261E]">${property.price.toLocaleString()}</div>
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
            <div className="col-span-1 row-span-1 relative cursor-pointer" onClick={() => setViewingMap(true)}>
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
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="border-[#09261E] text-[#09261E] hover:bg-[#09261E] hover:text-white"
              onClick={() => setContactModalOpen(true)}
            >
              Contact Seller
            </Button>
            <Button
              variant="outline"
              className="border-[#09261E] text-[#09261E] hover:bg-[#09261E] hover:text-white"
              onClick={() => setOfferModalOpen(true)}
            >
              Make an Offer
            </Button>
            <Button
              variant="outline"
              className={isInWatchlist ? "border-[#803344] text-[#803344] hover:bg-[#803344] hover:text-white" : "border-[#09261E] text-[#09261E] hover:bg-[#09261E] hover:text-white"}
              onClick={handleWatchlistToggle}
            >
              <Heart className={`h-4 w-4 mr-2 ${isInWatchlist ? 'fill-[#803344]' : ''}`} />
              {isInWatchlist ? 'Saved' : 'Save'}
            </Button>

            <Button
              variant="outline"
              className="border-[#09261E] text-[#09261E] hover:bg-[#09261E] hover:text-white"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </section>

      {/* Main Property Details Section */}
      <section className="py-6 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row">
            {/* Left Column with Main Sections */}
            <div className="w-full lg:w-2/3 xl:w-3/4 lg:pr-8 space-y-12">
              
              {/* The Numbers Section */}
              <div>
                <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-6">The Numbers</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="numbers" className="border-b border-gray-200">
                    <AccordionTrigger className="w-full py-4 hover:no-underline hover:bg-[#135341]/5 transition-colors">
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">🧮</span>
                        <span className="font-heading font-semibold text-[#09261E]">View Financial Details</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Estimated Rent</h4>
                            <p className="text-lg font-semibold text-[#09261E]">${(property.price * 0.008).toFixed(0)}/month</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Estimated Expenses</h4>
                            <p className="text-lg font-semibold text-[#09261E]">${(property.price * 0.003).toFixed(0)}/month</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Property Tax</h4>
                            <p className="text-lg font-semibold text-[#09261E]">${(property.price * 0.018).toFixed(0)}/year</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Estimated Repair Costs</h4>
                            <p className="text-lg font-semibold text-[#09261E]">${(property.price * 0.05).toFixed(0)}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">After Repair Value (ARV)</h4>
                            <p className="text-lg font-semibold text-[#09261E]">${(property.price * 1.2).toFixed(0)}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Price per Sqft</h4>
                            <p className="text-lg font-semibold text-[#09261E]">${property.squareFeet ? (property.price / property.squareFeet).toFixed(2) : "N/A"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-4 pb-2">
                        <Button variant="outline" className="w-full border-[#09261E] text-[#09261E] hover:bg-[#09261E] hover:text-white">
                          <i className="fas fa-tools mr-2"></i> I'm a contractor — Submit a Quote
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              {/* Relevant Calculators Section */}
              <div>
                <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-6">Relevant Calculators</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="calculators" className="border-b border-gray-200">
                    <AccordionTrigger className="w-full py-4 hover:no-underline hover:bg-[#135341]/5 transition-colors">
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">📈</span>
                        <span className="font-heading font-semibold text-[#09261E]">View Property Calculators</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pt-4">
                      <div className="space-y-4">
                        <div className="bg-[#09261E]/5 p-4 rounded-lg">
                          <h4 className="font-medium text-lg text-[#09261E] mb-2">Flip Calculator</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500 block mb-1">Purchase Price</label>
                              <Input type="text" defaultValue={`$${property.price.toLocaleString()}`} className="bg-white" />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500 block mb-1">Repair Costs</label>
                              <Input type="text" defaultValue={`$${(property.price * 0.05).toFixed(0)}`} className="bg-white" />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500 block mb-1">ARV</label>
                              <Input type="text" defaultValue={`$${(property.price * 1.2).toFixed(0)}`} className="bg-white" />
                            </div>
                          </div>
                          <Button className="w-full bg-[#09261E] hover:bg-[#135341] text-white">Calculate Potential Profit</Button>
                        </div>
                        
                        <div className="bg-[#09261E]/5 p-4 rounded-lg">
                          <h4 className="font-medium text-lg text-[#09261E] mb-2">Rental Calculator</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500 block mb-1">Purchase Price</label>
                              <Input type="text" defaultValue={`$${property.price.toLocaleString()}`} className="bg-white" />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500 block mb-1">Monthly Rent</label>
                              <Input type="text" defaultValue={`$${(property.price * 0.008).toFixed(0)}`} className="bg-white" />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500 block mb-1">Monthly Expenses</label>
                              <Input type="text" defaultValue={`$${(property.price * 0.003).toFixed(0)}`} className="bg-white" />
                            </div>
                          </div>
                          <Button className="w-full bg-[#09261E] hover:bg-[#135341] text-white">Calculate Cash Flow & ROI</Button>
                        </div>
                      </div>
                      <div className="text-center py-4">
                        <Link to="/tools" className="text-[#09261E] hover:underline font-medium inline-flex items-center">
                          View All Property Calculators <i className="fas fa-arrow-right ml-2"></i>
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              {/* Find a REP Section */}
              <div>
                <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-6">Find a REP</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="reps" className="border-b border-gray-200">
                    <AccordionTrigger className="w-full py-4 hover:no-underline hover:bg-[#135341]/5 transition-colors">
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">🧑‍🔧</span>
                        <span className="font-heading font-semibold text-[#09261E]">View Local Professionals</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pt-4">
                      <p className="text-gray-600 mb-4">Connect with local professionals who can help with this property:</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                        <Link to="/reps?type=agent&location=Milwaukee" className="bg-white border border-[#09261E]/20 rounded-md p-3 hover:bg-[#09261E]/5 transition-colors">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-[#09261E]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                              <i className="fas fa-user-tie text-[#09261E]"></i>
                            </div>
                            <h3 className="font-medium text-[#09261E]">Agent</h3>
                          </div>
                        </Link>
                        <Link to="/reps?type=contractor&location=Milwaukee" className="bg-white border border-[#09261E]/20 rounded-md p-3 hover:bg-[#09261E]/5 transition-colors">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-[#09261E]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                              <i className="fas fa-hammer text-[#09261E]"></i>
                            </div>
                            <h3 className="font-medium text-[#09261E]">Contractor</h3>
                          </div>
                        </Link>
                        <Link to="/reps?type=lender&location=Milwaukee" className="bg-white border border-[#09261E]/20 rounded-md p-3 hover:bg-[#09261E]/5 transition-colors">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-[#09261E]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                              <i className="fas fa-hand-holding-usd text-[#09261E]"></i>
                            </div>
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
              </div>
              
              {/* Property History Section */}
              <div>
                <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-6">Property History</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="history" className="border-b border-gray-200">
                    <AccordionTrigger className="w-full py-4 hover:no-underline hover:bg-[#135341]/5 transition-colors">
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">🏛</span>
                        <span className="font-heading font-semibold text-[#09261E]">View Transaction History</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pt-4">
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
              </div>
              
              {/* Comparable Properties Section */}
              <div>
                <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-6">Comparable Properties</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="comps" className="border-b border-gray-200">
                    <AccordionTrigger className="w-full py-4 hover:no-underline hover:bg-[#135341]/5 transition-colors">
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">🏘️</span>
                        <span className="font-heading font-semibold text-[#09261E]">View Similar Properties</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {similarProperties.slice(0, 4).map((comp, index) => (
                          <div key={index} className="flex bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <div className="w-1/3">
                              <img src={comp.imageUrl || 'https://source.unsplash.com/random/300x200/?house'} 
                                  alt={comp.title} className="h-full w-full object-cover" />
                            </div>
                            <div className="w-2/3 p-3">
                              <h3 className="font-medium text-[#09261E] text-sm line-clamp-1">{comp.address}</h3>
                              <p className="font-bold text-[#09261E]">${comp.price?.toLocaleString()}</p>
                              <div className="text-xs text-gray-600 mt-1">
                                <span>{comp.bedrooms} beds</span> • <span>{comp.bathrooms} baths</span> • <span>{comp.squareFeet?.toLocaleString()} sqft</span>
                              </div>
                              <div className="mt-2 text-xs">
                                <span className="bg-[#09261E]/10 text-[#09261E] px-2 py-1 rounded-full">0.8 miles</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-center pb-2">
                        <Link to="/properties?location=Milwaukee" className="text-[#09261E] hover:underline font-medium inline-flex items-center">
                          View All Comparable Properties <i className="fas fa-arrow-right ml-2"></i>
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
            
            {/* Right Sidebar - Contact Interested Card */}
            <div className="w-full lg:w-1/3 xl:w-1/4 mt-8 lg:mt-0">
              {/* Contact Card - Desktop Version */}
              <div className="hidden lg:block sticky top-24">
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white max-w-[380px]">
                  <div className="p-4 border-b border-gray-200 bg-[#09261E]/5">
                    <h3 className="font-bold text-xl text-[#09261E]">Interested in this property?</h3>
                    <p className="text-gray-600 text-sm">Contact the seller or schedule a viewing</p>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
                      <img 
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                        alt="Property Seller" 
                        className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-[#09261E]" 
                      />
                      <div>
                        <h4 className="font-heading font-bold text-[#09261E]">Michael Johnson</h4>
                        <p className="text-gray-600 text-sm">Seller • Responds in 24hrs</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Button className="w-full bg-[#09261E] hover:bg-[#135341]" onClick={() => setContactModalOpen(true)}>
                        Contact Seller
                      </Button>
                      <Button variant="outline" className="w-full border-[#09261E] text-[#09261E] hover:bg-[#09261E] hover:text-white" onClick={() => setOfferModalOpen(true)}>
                        Make an Offer
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => setViewingMap(true)}>
                        <MapPin className="h-4 w-4 mr-2" />
                        View Map
                      </Button>
                      <div className="text-xs text-center text-gray-500 mt-2">
                        <span className="inline-flex items-center">
                          <i className="fas fa-eye mr-1"></i> 142 people viewed this property
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-[#09261E]/5 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      <p className="mb-2">
                        <span className="font-medium">Property ID:</span> {propertyId}
                      </p>
                      <p>
                        <span className="font-medium">Listed:</span> {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Card - Mobile Version */}
              <div className="lg:hidden sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-[#09261E]">${property.price.toLocaleString()}</h3>
                    <p className="text-gray-600 text-xs">Interested in this property?</p>
                  </div>
                  <Button 
                    className="bg-[#09261E] hover:bg-[#135341]"
                    size="sm"
                    onClick={() => setContactModalOpen(true)}
                  >
                    Contact Seller
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Smart Property Recommendations */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-8">Similar Properties</h2>
          
          {/* Location-based recommendations using recommendation engine */}
          {property && (
            <PropertyRecommendations 
              location={property.city || ''}
              propertyType={property.propertyType || ''}
              priceRange={property.price ? { 
                min: property.price * 0.8, 
                max: property.price * 1.2 
              } : undefined}
              title=""
              showViewAll={true}
              maxResults={4}
            />
          )}
        </div>
      </section>
      
      {/* Photo Gallery Modal */}
      {viewingAllPhotos && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingAllPhotos(false)} // Close when clicking outside
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className="p-4 flex justify-between items-center border-b sticky top-0 bg-white z-10">
              <h3 className="text-xl font-heading font-bold text-[#09261E]">{property.address} - All Photos</h3>
              <button 
                onClick={() => setViewingAllPhotos(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Gallery introduction */}
            <div className="p-4 text-center border-b">
              <p className="text-gray-600 mb-2">Scroll to view all images of this property</p>
              <div className="w-8 h-8 mx-auto animate-bounce text-gray-400">
                <i className="fas fa-chevron-down"></i>
              </div>
            </div>
            
            {/* All photos - vertical scrolling */}
            <div className="p-4 space-y-8">
              {propertyImages.map((img, index) => (
                <div key={index} className="border-b pb-8 last:border-b-0">
                  <div className="mb-2">
                    <img 
                      src={img} 
                      alt={`${property.address} - Photo ${index + 1}`} 
                      className="w-full rounded-lg"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700 font-medium">
                      {index === 0 && 'Exterior'} 
                      {index === 1 && 'Living Room'}
                      {index === 2 && 'Kitchen'}
                      {index === 3 && 'Primary Bedroom'}
                      {index === 4 && 'Bathroom'}
                      {index > 4 && `Photo ${index + 1}`}
                    </p>
                    <span className="text-sm text-gray-500">
                      {index + 1} / {propertyImages.length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t sticky bottom-0 bg-white">
              <Button 
                onClick={() => setViewingAllPhotos(false)}
                className="w-full bg-[#09261E] hover:bg-[#135341] text-white"
              >
                Close Gallery
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Map Modal */}
      {viewingMap && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingMap(false)} // Close when clicking outside
        >
          <div 
            className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-xl font-heading font-bold text-[#09261E]">{property.address}</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setViewingMap(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-grow h-[70vh] bg-[#09261E]/5 flex items-center justify-center p-4">
              {/* In a real app, this would be a Google Map API integration */}
              <div className="text-center">
                <MapPin className="h-12 w-12 text-[#09261E] mx-auto mb-4" />
                <p className="text-lg font-medium text-[#09261E] mb-2">Map View</p>
                <p className="text-gray-600 mb-6">{formattedAddress}</p>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  In a real application, this would display an interactive Google Map
                  with the property location pinned. The user would be able to zoom,
                  pan, and view nearby amenities.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact REP Modal */}
      {contactModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setContactModalOpen(false)} // Close when clicking outside
        >
          <div 
            className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className="p-4 flex justify-between items-center border-b sticky top-0 bg-white z-10">
              <h3 className="text-xl font-heading font-bold text-[#09261E]">Contact Seller</h3>
              <button 
                onClick={() => setContactModalOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Seller Profile Preview */}
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <Avatar className="h-16 w-16 border-2 border-[#09261E]">
                    <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" />
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <h3 className="font-medium text-[#09261E] text-lg">Michael Johnson</h3>
                    <p className="text-sm text-gray-500">Property Owner • Joined 2023</p>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="outline" className="bg-[#09261E]/10 text-[#09261E] border-0">
                      Verified Owner
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  I'm a real estate investor with over 10 years of experience in the Milwaukee area. I specialize in residential properties and off-market deals.
                </p>
              </div>
              
              {/* Contact Options Description */}
              <p className="text-gray-600 mb-5 text-center">
                Choose how you'd like to connect with the seller about this property:
              </p>
              
              {/* Contact Options */}
              <div className="grid grid-cols-3 gap-4">
                <Button 
                  variant="outline"
                  className="flex-col h-auto py-6 border-[#09261E] text-[#09261E] hover:bg-[#09261E] hover:text-white"
                  onClick={() => {
                    toast({
                      title: "Email Sent",
                      description: "Your email client has been opened with the seller's address.",
                    });
                    window.location.href = `mailto:seller@propertydeals.com?subject=Inquiry about ${property.address}&body=I'm interested in your property at ${property.address}.`;
                  }}
                >
                  <Mail className="h-6 w-6 mb-2" />
                  <span>Email</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="flex-col h-auto py-6 border-[#09261E] text-[#09261E] hover:bg-[#09261E] hover:text-white"
                  onClick={() => {
                    toast({
                      title: "Message Started",
                      description: "Your message has been started. The seller will be notified.",
                    });
                    setContactModalOpen(false);
                  }}
                >
                  <MessageSquare className="h-6 w-6 mb-2" />
                  <span>Message</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="flex-col h-auto py-6 border-[#09261E] text-[#09261E] hover:bg-[#09261E] hover:text-white"
                  onClick={() => {
                    toast({
                      title: "Phone Call",
                      description: "Connecting you with the seller's phone number.",
                    });
                    window.location.href = "tel:555-123-4567";
                  }}
                >
                  <Phone className="h-6 w-6 mb-2" />
                  <span>Call</span>
                </Button>
              </div>
              
              {/* Additional Action */}
              <div className="mt-6 pt-6 border-t text-center">
                <Button variant="ghost" className="text-[#09261E] hover:bg-[#09261E]/10" onClick={() => setContactModalOpen(false)}>
                  Back to Property Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Make an Offer Modal */}
      {offerModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setOfferModalOpen(false)} // Close when clicking outside
        >
          <div 
            className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className="p-4 flex justify-between items-center border-b sticky top-0 bg-white z-10">
              <h3 className="text-xl font-heading font-bold text-[#09261E]">Make an Offer</h3>
              <button 
                onClick={() => setOfferModalOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6 pb-4 border-b">
                <div className="flex-shrink-0">
                  <img 
                    src={propertyImages[0]} 
                    alt={property.address} 
                    className="w-16 h-16 object-cover rounded-md" 
                  />
                </div>
                <div>
                  <h4 className="font-heading font-medium text-[#09261E]">{property.address}</h4>
                  <p className="text-sm text-gray-600">{property.city}, {property.state}</p>
                  <p className="text-[#135341] font-bold">${property.price?.toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-[#803344]/10 border border-[#803344]/20 rounded-md p-4 mb-4">
                  <h4 className="font-heading text-[#803344] font-bold mb-2">Sign up or login required</h4>
                  <p className="text-gray-700 text-sm mb-3">
                    To make an offer on this property, you need to create an account or login.
                  </p>
                  <div className="flex gap-3">
                    <Link to="/auth" className="w-full">
                      <Button variant="default" className="w-full bg-[#09261E] hover:bg-[#135341]">Login / Sign up</Button>
                    </Link>
                  </div>
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
                className="w-full mt-4"
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}