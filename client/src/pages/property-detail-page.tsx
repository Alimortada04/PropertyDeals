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
import { similarProperties } from "@/lib/data";
import { useState } from "react";

interface PropertyDetailPageProps {
  id: string;
}

export default function PropertyDetailPage({ id }: PropertyDetailPageProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [viewingAllPhotos, setViewingAllPhotos] = useState(false);
  
  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: [`/api/properties/${id}`],
  });

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
              <span className="text-[#135341]">{property.title}</span>
            </nav>
          </div>

          {/* Property Title & Quick Info */}
          <div className="flex flex-col lg:flex-row justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-[#09261E] mb-2">{property.title}</h1>
              <p className="text-gray-600 text-lg mb-2">{formattedAddress}</p>
              <div className="flex items-center">
                <span className={`inline-block ${property.status === 'exclusive' ? 'bg-[#803344]' : 'bg-[#09261E]'} text-white text-sm px-3 py-1 rounded-md mr-3`}>
                  {property.status === 'exclusive' ? 'Exclusive' : 'Off-Market'}
                </span>
                <span className="text-gray-500">Listed {new Date(property.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="text-right mt-4 lg:mt-0">
              <h2 className="text-3xl font-heading font-bold text-[#135341]">${property.price?.toLocaleString()}</h2>
              <p className="text-gray-600">${Math.round((property.price || 0) / (property.squareFeet || 1))} / sq ft</p>
            </div>
          </div>

          {/* Property Gallery */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[500px]">
              <div className="md:col-span-2 md:row-span-2 overflow-hidden rounded-lg">
                <img 
                  src={property.imageUrl || "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"} 
                  alt={property.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="overflow-hidden rounded-lg">
                <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Living Room" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="overflow-hidden rounded-lg">
                <img src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Kitchen" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="overflow-hidden rounded-lg">
                <img src="https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Bedroom" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="overflow-hidden rounded-lg relative group">
                <img src="https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Bathroom" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    className="bg-white text-[#09261E] px-4 py-2 rounded-md font-medium"
                    onClick={() => setViewingAllPhotos(true)}
                  >
                    View All Photos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Details Section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content Column */}
            <div className="w-full lg:w-2/3">
              {/* Key Features */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-gray-700">
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

              {/* Description */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-4">Description</h2>
                <div className="text-gray-700 space-y-4">
                  {property.description ? (
                    <p>{property.description}</p>
                  ) : (
                    <>
                      <p>
                        This beautiful {property.propertyType?.toLowerCase()} is nestled in the heart of {property.city}'s most desirable neighborhood. The {property.bedrooms}-bedroom, {property.bathrooms}-bathroom home spans {property.squareFeet?.toLocaleString()} square feet and sits on a spacious {property.lotSize} lot.
                      </p>
                      <p>
                        The open-concept main floor features a gourmet kitchen with high-end stainless steel appliances, quartz countertops, and a large island perfect for entertaining. The kitchen opens to a bright dining area and comfortable living room with a cozy gas fireplace.
                      </p>
                      <p>
                        This off-market property won't last long - schedule a viewing today!
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Features & Amenities */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-gray-700">
                  {property.features && property.features.length > 0 ? (
                    property.features.map((feature, index) => (
                      <div key={index} className="flex items-center py-2">
                        <i className="fas fa-check text-[#135341] mr-3"></i>
                        <span>{feature}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center py-2">
                        <i className="fas fa-check text-[#135341] mr-3"></i>
                        <span>Hardwood Floors</span>
                      </div>
                      <div className="flex items-center py-2">
                        <i className="fas fa-check text-[#135341] mr-3"></i>
                        <span>Stainless Steel Appliances</span>
                      </div>
                      <div className="flex items-center py-2">
                        <i className="fas fa-check text-[#135341] mr-3"></i>
                        <span>Quartz Countertops</span>
                      </div>
                      <div className="flex items-center py-2">
                        <i className="fas fa-check text-[#135341] mr-3"></i>
                        <span>Gas Fireplace</span>
                      </div>
                      <div className="flex items-center py-2">
                        <i className="fas fa-check text-[#135341] mr-3"></i>
                        <span>High Ceilings</span>
                      </div>
                      <div className="flex items-center py-2">
                        <i className="fas fa-check text-[#135341] mr-3"></i>
                        <span>Walk-in Closets</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Location & Map */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-4">Location</h2>
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  {/* Map placeholder */}
                  <div className="h-full w-full flex items-center justify-center bg-[#09261E]/5">
                    <div className="text-center">
                      <i className="fas fa-map-marker-alt text-[#135341] text-4xl mb-3"></i>
                      <p className="text-gray-600">{formattedAddress}</p>
                      <Button className="mt-4 bg-[#09261E] hover:bg-[#135341] text-white">
                        View on Map
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
                  <div>
                    <h3 className="font-medium text-lg mb-2 text-[#135341]">Walkability</h3>
                    <div className="flex items-center">
                      <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-[#09261E] h-full w-[85%]"></div>
                      </div>
                      <span className="ml-2">85/100</span>
                    </div>
                    <p className="text-sm mt-1">Very walkable neighborhood</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2 text-[#135341]">Transit</h3>
                    <div className="flex items-center">
                      <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-[#09261E] h-full w-[72%]"></div>
                      </div>
                      <span className="ml-2">72/100</span>
                    </div>
                    <p className="text-sm mt-1">Good transit options</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2 text-[#135341]">Schools</h3>
                    <div className="flex items-center">
                      <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-[#09261E] h-full w-[90%]"></div>
                      </div>
                      <span className="ml-2">90/100</span>
                    </div>
                    <p className="text-sm mt-1">Excellent school district</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              {/* Contact Agent */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8 sticky top-[80px]">
                <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-4">Interested in this property?</h2>
                <div className="flex items-center mb-6">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="Agent" className="w-16 h-16 rounded-full object-cover mr-4" />
                  <div>
                    <h3 className="font-heading font-bold text-[#135341]">Michael Johnson</h3>
                    <p className="text-gray-600">Off-Market Specialist</p>
                    <div className="flex items-center mt-1">
                      <i className="fas fa-star text-yellow-500"></i>
                      <i className="fas fa-star text-yellow-500"></i>
                      <i className="fas fa-star text-yellow-500"></i>
                      <i className="fas fa-star text-yellow-500"></i>
                      <i className="fas fa-star-half-alt text-yellow-500"></i>
                      <span className="ml-1 text-sm text-gray-600">(48 reviews)</span>
                    </div>
                  </div>
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
                    <Button 
                      type="submit" 
                      className="w-full bg-[#09261E] hover:bg-[#135341] text-white py-3 font-medium"
                      disabled={inquiryMutation.isPending}
                    >
                      {inquiryMutation.isPending ? "Sending..." : "Contact Agent"}
                    </Button>
                  </form>
                </Form>
                <div className="mt-4 flex justify-center space-x-4">
                  <a href="#" className="text-[#135341] hover:text-[#09261E]">
                    <i className="fas fa-phone-alt mr-1"></i> Call
                  </a>
                  <a href="#" className="text-[#135341] hover:text-[#09261E]">
                    <i className="fas fa-comment mr-1"></i> Text
                  </a>
                  <a href="#" className="text-[#135341] hover:text-[#09261E]">
                    <i className="fas fa-heart mr-1"></i> Save
                  </a>
                  <a href="#" className="text-[#135341] hover:text-[#09261E]">
                    <i className="fas fa-share-alt mr-1"></i> Share
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-8">Similar Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Photo Gallery Modal */}
      {viewingAllPhotos && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="text-xl font-heading font-bold">{property.title} - All Photos</h3>
              <button 
                onClick={() => setViewingAllPhotos(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <img 
                src={property.imageUrl || "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"} 
                alt={property.title} 
                className="w-full rounded-lg"
              />
              <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f" alt="Living Room" className="w-full rounded-lg" />
              <img src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77" alt="Kitchen" className="w-full rounded-lg" />
              <img src="https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db" alt="Bedroom" className="w-full rounded-lg" />
              <img src="https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83" alt="Bathroom" className="w-full rounded-lg" />
              <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6" alt="Exterior" className="w-full rounded-lg" />
              <img src="https://images.unsplash.com/photo-1484154218962-a197022b5858" alt="Kitchen 2" className="w-full rounded-lg" />
              <img src="https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9" alt="Backyard" className="w-full rounded-lg" />
            </div>
            <div className="p-4 border-t">
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
    </>
  );
}
