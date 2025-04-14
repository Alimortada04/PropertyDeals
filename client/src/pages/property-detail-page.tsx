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
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageText, setMessageText] = useState("");
  
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
            <div className="w-full lg:w-2/3 xl:w-3/4 lg:pr-8 space-y-6">
              
              {/* Property Details Section */}
              <Accordion type="single" defaultValue="details" collapsible className="w-full">
                <AccordionItem value="details" className="border-b border-gray-200">
                  <AccordionTrigger className="w-full py-4 text-2xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                    <div className="flex items-center">
                      <span className="mr-3 text-2xl">🏠</span>
                      <span>Property Details</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                      <div>
                        <h3 className="font-medium text-[#09261E] mb-3 text-lg">Property Features</h3>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <div className="w-40 text-gray-500 flex-shrink-0">Property Type</div>
                            <div className="font-medium">{property.propertyType || 'Single Family'}</div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-40 text-gray-500 flex-shrink-0">Year Built</div>
                            <div className="font-medium">1998</div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-40 text-gray-500 flex-shrink-0">Square Feet</div>
                            <div className="font-medium">{property.squareFeet?.toLocaleString() || 'N/A'}</div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-40 text-gray-500 flex-shrink-0">Lot Size</div>
                            <div className="font-medium">{property.lotSize || '0.25 acres'}</div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-40 text-gray-500 flex-shrink-0">Bedrooms</div>
                            <div className="font-medium">{property.bedrooms}</div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-40 text-gray-500 flex-shrink-0">Bathrooms</div>
                            <div className="font-medium">{property.bathrooms}</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-[#09261E] mb-3 text-lg">Additional Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <div className="w-40 text-gray-500 flex-shrink-0">Heating</div>
                            <div className="font-medium">Forced air, Natural gas</div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-40 text-gray-500 flex-shrink-0">Cooling</div>
                            <div className="font-medium">Central air</div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-40 text-gray-500 flex-shrink-0">Parking</div>
                            <div className="font-medium">2 car garage, Attached</div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-40 text-gray-500 flex-shrink-0">Basement</div>
                            <div className="font-medium">Full, Partially finished</div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-40 text-gray-500 flex-shrink-0">Construction</div>
                            <div className="font-medium">Wood frame, Vinyl siding</div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-40 text-gray-500 flex-shrink-0">Roof</div>
                            <div className="font-medium">Asphalt shingle</div>
                          </div>
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
              <Accordion type="single" defaultValue="numbers" collapsible className="w-full">
                <AccordionItem value="numbers" className="border-b border-gray-200">
                  <AccordionTrigger className="w-full py-4 text-2xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                    <div className="flex items-center">
                      <span className="mr-3 text-2xl">🧮</span>
                      <span>The Numbers</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4">
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
              
              {/* Relevant Calculators Section */}
              <Accordion type="single" defaultValue="calculators" collapsible className="w-full">
                <AccordionItem value="calculators" className="border-b border-gray-200">
                  <AccordionTrigger className="w-full py-4 text-2xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                    <div className="flex items-center">
                      <span className="mr-3 text-2xl">📈</span>
                      <span>Relevant Calculators</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4">
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
              
              {/* Find a REP Section */}
              <Accordion type="single" defaultValue="reps" collapsible className="w-full">
                <AccordionItem value="reps" className="border-b border-gray-200">
                  <AccordionTrigger className="w-full py-4 text-2xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                    <div className="flex items-center">
                      <span className="mr-3 text-2xl">🧑‍🔧</span>
                      <span>Find a REP</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4">
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
              
              {/* Property History Section */}
              <Accordion type="single" defaultValue="history" collapsible className="w-full">
                <AccordionItem value="history" className="border-b border-gray-200">
                  <AccordionTrigger className="w-full py-4 text-2xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                    <div className="flex items-center">
                      <span className="mr-3 text-2xl">🏛</span>
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
              <Accordion type="single" defaultValue="comparable" collapsible className="w-full">
                <AccordionItem value="comparable" className="border-b border-gray-200">
                  <AccordionTrigger className="w-full py-4 text-2xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                    <div className="flex items-center">
                      <span className="mr-3 text-2xl">🏘️</span>
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
                              <div className="font-bold text-[#09261E]">${comp.price.toLocaleString()}</div>
                              <div className="text-sm text-gray-500">{comp.bedrooms}bd, {comp.bathrooms}ba</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center pb-2">
                      <Link to="/properties" className="text-[#09261E] hover:underline font-medium inline-flex items-center">
                        View All Comparable Properties <i className="fas fa-arrow-right ml-2"></i>
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            {/* Right Sidebar - Contact Interested Card */}
            <div className="w-full lg:w-1/3 xl:w-1/4 mt-8 lg:mt-0">
              <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-md lg:sticky lg:top-6">
                <div className="p-4">
                  <h3 className="text-2xl font-bold text-[#09261E]">Interested in this property?</h3>
                  <p className="text-gray-600">Contact the seller or schedule a viewing</p>
                </div>
                
                <div className="bg-white p-4 border-y border-gray-200">
                  <div className="flex items-center mb-4 pb-3 border-b border-gray-100">
                    <Link to="/sellers/michael-johnson" className="flex items-center group">
                      <div className="h-16 w-16 rounded-full overflow-hidden border border-gray-200 relative">
                        <img src="https://source.unsplash.com/random/100x100/?portrait" alt="Seller" className="w-full h-full object-cover" />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-xl text-[#09261E] group-hover:underline">Michael Johnson</div>
                        <div className="text-gray-500 text-sm flex items-center">
                          Seller <span className="mx-1">•</span> Responds in 24hrs
                        </div>
                      </div>
                    </Link>
                  </div>
                  
                  <Button 
                    className="w-full bg-[#09261E] hover:bg-[#09261E] mb-3 py-6 rounded-md text-base font-medium" 
                    onClick={() => setContactModalOpen(true)}
                  >
                    Contact Seller
                  </Button>
                  
                  <Button 
                    className="w-full bg-gray-50 text-gray-800 hover:bg-gray-50 mb-3 py-6 rounded-md text-base font-medium border border-gray-300" 
                    variant="outline"
                    onClick={() => setOfferModalOpen(true)}
                  >
                    Make an Offer
                  </Button>
                  
                  <Button 
                    className="w-full bg-gray-50 text-gray-800 hover:bg-gray-50 mb-3 py-6 rounded-md text-base font-medium border border-gray-300 flex items-center justify-center"
                    variant="outline"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    View Map
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
                      <div className="font-bold text-[#09261E] mb-1">${prop.price.toLocaleString()}</div>
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
      
      {/* Photo Gallery Modal */}
      {viewingAllPhotos && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingAllPhotos(false)}
        >
          <div 
            className="relative max-w-5xl w-full bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/80 transition-colors z-10"
              onClick={() => setViewingAllPhotos(false)}
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="relative h-[70vh]">
              <img 
                src={propertyImages[currentPhotoIndex]} 
                alt={property.address} 
                className="w-full h-full object-contain" 
              />
              
              {/* Navigation Arrows */}
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <button 
                  className="bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-colors"
                  onClick={() => setCurrentPhotoIndex(prev => (prev === 0 ? propertyImages.length - 1 : prev - 1))}
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button 
                  className="bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-colors"
                  onClick={() => setCurrentPhotoIndex(prev => (prev === propertyImages.length - 1 ? 0 : prev + 1))}
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </div>
            </div>
            
            {/* Thumbnails */}
            <div className="bg-black p-4 overflow-x-auto">
              <div className="flex space-x-2">
                {propertyImages.map((img, i) => (
                  <div 
                    key={i}
                    className={`w-24 h-16 flex-shrink-0 cursor-pointer ${i === currentPhotoIndex ? 'ring-2 ring-white' : ''}`}
                    onClick={() => setCurrentPhotoIndex(i)}
                  >
                    <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
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
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
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
                    <AvatarImage src="https://source.unsplash.com/random/100x100/?portrait" alt="Seller" />
                    <AvatarFallback>MJ</AvatarFallback>
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
                    <Button type="submit" className="w-full bg-[#09261E] hover:bg-[#135341] py-6">
                      {inquiryMutation.isPending ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending...
                        </div>
                      ) : "Send Message"}
                    </Button>
                    
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
              <div className="bg-[#803344]/10 border border-[#803344]/20 rounded-md p-4 mb-4">
                <h4 className="font-heading text-[#803344] font-bold mb-2">Sign up or login required</h4>
                <p className="text-gray-700 text-sm mb-3">
                  To submit an offer, you'll need to create an account or login to your existing account.
                </p>
                <Link to="/auth" className="bg-[#803344] text-white rounded-md py-2 px-4 text-sm font-medium inline-block hover:bg-[#803344]/90 transition-colors">
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
              className="w-full mt-4"
              variant="outline"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}