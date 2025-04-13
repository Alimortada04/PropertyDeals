import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Property, InsertPropertyInquiry } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import PropertyGrid from "@/components/properties/property-grid";
import PropertyCard from "@/components/properties/property-card";
import PropertyRecommendations from "@/components/properties/property-recommendations";
import { similarProperties } from "@/lib/data";
import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin, ChevronLeft, ChevronRight, X } from "lucide-react";

interface PropertyDetailPageProps {
  id: string;
}

export default function PropertyDetailPage({ id }: PropertyDetailPageProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [viewingAllPhotos, setViewingAllPhotos] = useState(false);
  const [viewingMap, setViewingMap] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  
  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: [`/api/properties/${id}`],
  });
  
  // Set document title when property data is available
  useEffect(() => {
    if (property) {
      document.title = `${property.address} | PropertyDeals`;
    }
  }, [property]);

  // Form schema for property inquiry
  const inquirySchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().optional(),
    message: z.string().min(10, "Message should be at least 10 characters"),
  });

  type InquiryFormValues = z.infer<typeof inquirySchema>;

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: user?.fullName || "",
      email: user?.email || "",
      phone: "",
      message: `I'm interested in this property...`,
    },
  });

  const inquiryMutation = useMutation({
    mutationFn: async (data: InquiryFormValues) => {
      const inquiryData: Partial<InsertPropertyInquiry> = {
        ...data,
        propertyId: parseInt(id),
        userId: user?.id,
      };
      
      const res = await apiRequest(
        "POST", 
        `/api/properties/${id}/inquiries`, 
        inquiryData
      );
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Sent!",
        description: "The seller will contact you soon.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send inquiry",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InquiryFormValues) => {
    inquiryMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6">
          <Skeleton className="h-6 w-40 mb-2" />
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start mb-6">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-10 w-32 mt-4 lg:mt-0" />
        </div>
        <Skeleton className="w-full h-[500px] mb-8" />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <Skeleton className="w-full h-[400px] mb-8" />
            <Skeleton className="w-full h-[300px] mb-8" />
            <Skeleton className="w-full h-[250px]" />
          </div>
          <Skeleton className="w-full lg:w-1/3 h-[600px]" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-heading text-[#09261E] mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-8">We couldn't find the property you're looking for.</p>
          <Link href="/properties">
            <Button className="bg-[#09261E] hover:bg-[#135341] text-white">
              Browse Properties
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Format address
  const formattedAddress = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`;

  // Sample property images - in a real app these would come from the API
  const propertyImages = [
    property.imageUrl || "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  ];
  
  // Navigate to previous image in the gallery
  const prevImage = () => {
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? propertyImages.length - 1 : prev - 1
    );
  };
  
  // Navigate to next image in the gallery
  const nextImage = () => {
    setCurrentPhotoIndex((prev) => 
      prev === propertyImages.length - 1 ? 0 : prev + 1
    );
  };
  
  return (
    <>
      {/* Property Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex text-gray-500 text-sm">
              <Link href="/" className="hover:text-[#09261E]">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/properties" className="hover:text-[#09261E]">Properties</Link>
              <span className="mx-2">/</span>
              <span className="text-[#135341]">{property.address}</span>
            </nav>
          </div>

          {/* Property Title & Quick Info */}
          <div className="flex flex-col lg:flex-row justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-[#09261E] mb-2">{property.address}</h1>
              <p className="text-gray-600 text-lg mb-2">{`${property.city}, ${property.state} ${property.zipCode}`}</p>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-block bg-[#09261E] text-white text-sm px-3 py-1 rounded-md">
                  {property.propertyType || 'Single Family'}
                </span>
                <span className="inline-block bg-[#803344] text-white text-sm px-3 py-1 rounded-md">
                  {property.condition || 'Light Rehab'}
                </span>
              </div>
            </div>
            <div className="text-right mt-4 lg:mt-0">
              <h2 className="text-3xl font-heading font-bold text-[#135341]">${property.price?.toLocaleString()}</h2>
              <p className="text-gray-600">${Math.round((property.price || 0) / (property.squareFeet || 1))} / sq ft</p>
            </div>
          </div>

          {/* Property Gallery */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[500px]">
              {/* Main large image (2/3 width) */}
              <div 
                className="md:col-span-2 overflow-hidden rounded-lg relative group cursor-pointer"
                onClick={() => setViewingAllPhotos(true)}
              >
                <img 
                  src={propertyImages[currentPhotoIndex]} 
                  alt={`${property.address} - Photo ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300"
                />
                {/* Navigation arrows */}
                <button 
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#09261E] p-2 rounded-full z-10"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening the gallery
                    prevImage();
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#09261E] p-2 rounded-full z-10"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening the gallery
                    nextImage();
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                {/* Overlay to view all photos */}
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    className="bg-white text-[#09261E] px-4 py-2 rounded-md font-medium"
                    onClick={(e) => {
                      e.stopPropagation(); // Redundant but clearer
                      setViewingAllPhotos(true);
                    }}
                  >
                    View All Photos
                  </button>
                </div>
              </div>
              
              {/* Right column images (1/3 width) */}
              <div className="md:col-span-1 grid grid-rows-2 gap-4 h-full">
                {/* Top image */}
                <div className="overflow-hidden rounded-lg cursor-pointer">
                  <img 
                    src={propertyImages.length > 1 ? propertyImages[1] : propertyImages[0]} 
                    alt={`${property.address} - Interior`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                    onClick={() => {
                      if (propertyImages.length > 1) setCurrentPhotoIndex(1);
                      setViewingAllPhotos(true);
                    }}
                  />
                </div>
                
                {/* Bottom map */}
                <div className="overflow-hidden rounded-lg relative">
                  {/* Map placeholder - in a real app, this would be a Google Map */}
                  <div className="w-full h-full bg-[#09261E]/10 flex items-center justify-center cursor-pointer"
                       onClick={() => setViewingMap(true)}>
                    <div className="text-center">
                      <MapPin className="h-8 w-8 text-[#09261E] mx-auto mb-2" />
                      <p className="text-gray-600 text-sm">Map View</p>
                      <p className="text-xs text-gray-500">{formattedAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Details Section - Completely restructured for proper sticky behavior */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row">
            {/* Main Content Column - 2/3 of the width */}
            <div className="w-full lg:w-2/3 xl:w-3/4 lg:pr-8">
              {/* Key Features */}
              <div className="bg-white mb-8">
                <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-6">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#09261E]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <i className="fas fa-bed text-[#09261E]"></i>
                    </div>
                    <h3 className="font-heading font-bold text-[#135341]">{property.bedrooms} Beds</h3>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#09261E]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <i className="fas fa-bath text-[#09261E]"></i>
                    </div>
                    <h3 className="font-heading font-bold text-[#135341]">{property.bathrooms} Baths</h3>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#09261E]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <i className="fas fa-ruler-combined text-[#09261E]"></i>
                    </div>
                    <h3 className="font-heading font-bold text-[#135341]">{property.squareFeet?.toLocaleString()} sqft</h3>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#09261E]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <i className="fas fa-calendar-alt text-[#09261E]"></i>
                    </div>
                    <h3 className="font-heading font-bold text-[#135341]">Built {property.yearBuilt}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 text-gray-700 mb-6">
                  <div className="flex justify-between border-b border-[#D8D8D8] py-2">
                    <span>Property Type</span>
                    <span className="font-medium">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#D8D8D8] py-2">
                    <span>Year Built</span>
                    <span className="font-medium">{property.yearBuilt}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#D8D8D8] py-2">
                    <span>Lot Size</span>
                    <span className="font-medium">{property.lotSize}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#D8D8D8] py-2">
                    <span>Heating</span>
                    <span className="font-medium">Forced Air, Gas</span>
                  </div>
                  <div className="flex justify-between border-b border-[#D8D8D8] py-2">
                    <span>Cooling</span>
                    <span className="font-medium">Central Air</span>
                  </div>
                  <div className="flex justify-between border-b border-[#D8D8D8] py-2">
                    <span>Parking</span>
                    <span className="font-medium">2 Car Garage</span>
                  </div>
                  <div className="flex justify-between border-b border-[#D8D8D8] py-2">
                    <span>Basement</span>
                    <span className="font-medium">Finished</span>
                  </div>
                  <div className="flex justify-between border-b border-[#D8D8D8] py-2">
                    <span>School District</span>
                    <span className="font-medium">Milwaukee Public</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct implementation of the interested card */}
            <div className="hidden lg:block lg:w-1/3 xl:w-1/4 lg:mt-0">
              <div className="sticky top-20 bg-white p-6 rounded-lg border border-[#09261E]/10 shadow-lg w-[320px]">
                <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-4">Interested?</h2>
                <Link to="/rep/michael-johnson" className="flex items-center mb-6 border-b pb-4 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                    alt="Property Seller" 
                    className="w-20 h-20 rounded-full object-cover mr-4 border-2 border-[#09261E]" 
                  />
                  <div>
                    <h3 className="font-heading font-bold text-[#135341] text-xl">Michael Johnson</h3>
                    <p className="text-gray-600 font-medium mb-1 flex items-center">
                      <span className="bg-[#09261E]/10 text-[#09261E] px-2 py-1 text-sm rounded-md mr-2">
                        Seller
                      </span>
                      <span className="inline-flex items-center text-sm mr-3">
                        <span className="mr-1">👀</span> 142
                      </span>
                      <span className="inline-flex items-center text-sm">
                        <span className="mr-1">❤️</span> 23
                      </span>
                    </p>
                  </div>
                </Link>
                
                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <Button 
                    className="w-full bg-[#09261E] hover:bg-[#135341] text-white py-6 font-medium text-lg"
                    onClick={() => setContactModalOpen(true)}
                  >
                    <i className="fas fa-user-plus mr-2"></i> Contact REP
                  </Button>
                  <Button 
                    className="w-full border-2 border-[#803344] text-[#803344] hover:bg-[#803344] hover:text-white py-6 font-medium text-lg bg-white"
                    onClick={() => setOfferModalOpen(true)}
                  >
                    <i className="fas fa-file-invoice-dollar mr-2"></i> Make an Offer
                  </Button>
                </div>
                
                {/* Contact Preferences */}
                <div className="flex justify-between items-center">
                  <div className="grid grid-cols-5 w-full gap-2">
                    <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#09261E]/10 hover:bg-[#09261E]/20 text-[#09261E]" title="Share">
                      <i className="fas fa-share-alt"></i>
                    </button>
                    <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#09261E]/10 hover:bg-[#09261E]/20 text-[#09261E]" title="Like">
                      <i className="fas fa-heart"></i>
                    </button>
                    <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#09261E]/10 hover:bg-[#09261E]/20 text-[#09261E]" title="Email">
                      <i className="fas fa-envelope"></i>
                    </button>
                    <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#09261E]/10 hover:bg-[#09261E]/20 text-[#09261E]" title="Message">
                      <i className="fas fa-comment"></i>
                    </button>
                    <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#09261E]/10 hover:bg-[#09261E]/20 text-[#09261E]" title="Call">
                      <i className="fas fa-phone-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Contact Card */}
      <section className="py-6 bg-white block lg:hidden border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="bg-white p-6 rounded-lg border border-[#09261E]/10 shadow-lg">
            <h2 className="text-xl font-heading font-bold text-[#09261E] mb-4">Interested?</h2>
            <Link to="/rep/michael-johnson" className="flex items-center mb-6 border-b pb-4 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                alt="Property Seller" 
                className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-[#09261E]" 
              />
              <div>
                <h3 className="font-heading font-bold text-[#135341] text-lg">Michael Johnson</h3>
                <p className="text-gray-600 font-medium mb-1 flex items-center flex-wrap">
                  <span className="bg-[#09261E]/10 text-[#09261E] px-2 py-1 text-sm rounded-md mr-2 mb-1">
                    Seller
                  </span>
                  <span className="inline-flex items-center text-sm mr-3">
                    <span className="mr-1">👀</span> 142
                  </span>
                  <span className="inline-flex items-center text-sm">
                    <span className="mr-1">❤️</span> 23
                  </span>
                </p>
              </div>
            </Link>
            
            <div className="space-y-3 mb-5">
              <Button 
                className="w-full bg-[#09261E] hover:bg-[#135341] text-white py-4 font-medium text-base"
                onClick={() => setContactModalOpen(true)}
              >
                <i className="fas fa-user-plus mr-2"></i> Contact REP
              </Button>
              <Button 
                className="w-full border-2 border-[#803344] text-[#803344] hover:bg-[#803344] hover:text-white py-4 font-medium text-base bg-white"
                onClick={() => setOfferModalOpen(true)}
              >
                <i className="fas fa-file-invoice-dollar mr-2"></i> Make an Offer
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="grid grid-cols-5 w-full gap-2">
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#09261E]/10 hover:bg-[#09261E]/20 text-[#09261E]" title="Share">
                  <i className="fas fa-share-alt"></i>
                </button>
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#09261E]/10 hover:bg-[#09261E]/20 text-[#09261E]" title="Like">
                  <i className="fas fa-heart"></i>
                </button>
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#09261E]/10 hover:bg-[#09261E]/20 text-[#09261E]" title="Email">
                  <i className="fas fa-envelope"></i>
                </button>
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#09261E]/10 hover:bg-[#09261E]/20 text-[#09261E]" title="Message">
                  <i className="fas fa-comment"></i>
                </button>
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#09261E]/10 hover:bg-[#09261E]/20 text-[#09261E]" title="Call">
                  <i className="fas fa-phone-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Detail Accordions - Redesigned with clean horizontal dividers */}
      <section className="py-6 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-4">Property Insights</h2>
          
          <Accordion type="multiple" className="bg-white">
            {/* The Numbers Accordion */}
            <AccordionItem value="numbers" className="border-b border-gray-200">
              <AccordionTrigger className="w-full py-4 hover:no-underline hover:bg-[#135341]/5 transition-colors">
                <div className="flex items-center">
                  <span className="mr-3 text-lg">🧮</span>
                  <span className="font-heading font-semibold text-[#09261E]">The Numbers</span>
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
            
            {/* Relevant Calculators */}
            <AccordionItem value="calculators" className="border-b border-gray-200">
              <AccordionTrigger className="w-full py-4 hover:no-underline hover:bg-[#135341]/5 transition-colors">
                <div className="flex items-center">
                  <span className="mr-3 text-lg">📈</span>
                  <span className="font-heading font-semibold text-[#09261E]">Relevant Calculators</span>
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
            
            {/* Find a REP */}
            <AccordionItem value="reps" className="border-b border-gray-200">
              <AccordionTrigger className="w-full py-4 hover:no-underline hover:bg-[#135341]/5 transition-colors">
                <div className="flex items-center">
                  <span className="mr-3 text-lg">🧑‍🔧</span>
                  <span className="font-heading font-semibold text-[#09261E]">Find a REP</span>
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
            
            {/* Property History */}
            <AccordionItem value="history" className="border-b border-gray-200">
              <AccordionTrigger className="w-full py-4 hover:no-underline hover:bg-[#135341]/5 transition-colors">
                <div className="flex items-center">
                  <span className="mr-3 text-lg">🏛</span>
                  <span className="font-heading font-semibold text-[#09261E]">Property History</span>
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
            
            {/* Comparable Properties */}
            <AccordionItem value="comps" className="border-b border-gray-200">
              <AccordionTrigger className="w-full py-4 hover:no-underline hover:bg-[#135341]/5 transition-colors">
                <div className="flex items-center">
                  <span className="mr-3 text-lg">🏘️</span>
                  <span className="font-heading font-semibold text-[#09261E]">Comparable Properties</span>
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
              <h3 className="text-xl font-heading font-bold text-[#09261E]">Contact REP</h3>
              <button 
                onClick={() => setContactModalOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <Link to="/rep/michael-johnson" className="flex items-center mb-6 border-b pb-4 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                  alt="Property Seller" 
                  className="w-20 h-20 rounded-full object-cover mr-4 border-2 border-[#09261E]" 
                />
                <div>
                  <h3 className="font-heading font-bold text-[#135341] text-xl">Michael Johnson</h3>
                  <p className="text-gray-600 font-medium mb-1 flex items-center">
                    <span className="bg-[#09261E]/10 text-[#09261E] px-2 py-1 text-sm rounded-md mr-2">
                      Seller
                    </span>
                    <span className="inline-flex items-center text-sm mr-3">
                      <span className="mr-1">👀</span> 142
                    </span>
                    <span className="inline-flex items-center text-sm">
                      <span className="mr-1">❤️</span> 23
                    </span>
                  </p>
                </div>
              </Link>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
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
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={4} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-700 mb-3">Contact Methods</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <Button 
                        type="button"
                        variant="outline"
                        className="bg-[#09261E]/10 border-0 hover:bg-[#09261E] hover:text-white"
                      >
                        <i className="fas fa-phone-alt mr-2"></i> Call
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        className="bg-[#09261E]/10 border-0 hover:bg-[#09261E] hover:text-white"
                      >
                        <i className="fas fa-comment mr-2"></i> Text
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        className="bg-[#09261E] text-white border-0 hover:bg-[#135341]"
                      >
                        <i className="fas fa-envelope mr-2"></i> Email
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full mt-6 bg-[#09261E] hover:bg-[#135341] text-white py-3 font-medium"
                    disabled={inquiryMutation.isPending}
                  >
                    {inquiryMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
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
                    To make an offer on this property, you'll need to create an account or login to your existing account.
                  </p>
                  
                  <div className="flex space-x-3">
                    <Button 
                      className="bg-[#803344] hover:bg-[#803344]/80 text-white"
                      onClick={() => {
                        setOfferModalOpen(false);
                        // In a real app, redirect to register page or open register modal
                      }}
                    >
                      Register
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-[#803344] text-[#803344] hover:bg-[#803344]/10"
                      onClick={() => {
                        setOfferModalOpen(false);
                        // In a real app, redirect to login page or open login modal
                      }}
                    >
                      Login
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-md">
                  <h4 className="font-medium text-gray-700 mb-3">Offer Steps:</h4>
                  <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                    <li>Register or login to your account</li>
                    <li>Verify your identity and contact information</li>
                    <li>Submit your offer price and terms</li>
                    <li>Upload proof of funds or pre-approval letter</li>
                    <li>Receive confirmation from the seller</li>
                  </ol>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>By making an offer, you agree to PropertyDeals' terms of service.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
