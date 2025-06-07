import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  Share2, Heart, MapPin, Home, 
  MessageSquare, Phone, 
  BedDouble, Bath, SquareIcon
} from "lucide-react";
import {
  Check as CheckIcon, Copy as CopyIcon,
  Facebook, Twitter, Linkedin, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { insertPropertyInquirySchema, InsertPropertyInquiry } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useIsMobile } from "@/hooks/use-mobile";

interface PropertyDetailPageProps {
  id: string;
}

export default function PropertyDetailPage({ id }: PropertyDetailPageProps) {
  const propertyId = parseInt(id);
  
  // All state hooks first
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  
  // All custom hooks
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Data fetching
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

  // Form schema
  const inquirySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    phone: z.string().min(10, "Please enter a valid phone number."),
    message: z.string().min(10, "Message must be at least 10 characters.")
  });

  // Form setup
  const form = useForm<z.infer<typeof inquirySchema>>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: ""
    },
  });

  // Mutation
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
      form.reset();
    }
  });

  // Effects
  useEffect(() => {
    if (property?.address) {
      form.setValue("message", `Hi, I'm interested in ${property.address}. Please contact me for more information.`);
    }
  }, [property?.address, form]);

  useEffect(() => {
    if (property) {
      document.title = `${property.address} - ${property.city}, ${property.state} | PropertyDeals`;
      return () => {
        document.title = 'PropertyDeals';
      };
    }
  }, [property]);

  // Event handlers
  const onSubmit = (data: z.infer<typeof inquirySchema>) => {
    inquiryMutation.mutate(data);
  };

  const handleWatchlistToggle = () => {
    setIsInWatchlist(!isInWatchlist);
    toast({
      title: isInWatchlist ? "Removed from Watchlist" : "Added to Watchlist",
      description: isInWatchlist 
        ? "This property has been removed from your watchlist" 
        : "This property has been added to your watchlist",
    });
  };

  const handleContactSeller = () => {
    setContactModalOpen(true);
  };

  const generateShareableUrl = () => {
    const baseUrl = window.location.origin;
    const shareableUrl = `${baseUrl}/properties/${propertyId}`;
    setShareUrl(shareableUrl);
    return shareableUrl;
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
    toast({
      title: "Link Copied!",
      description: "Property link has been copied to your clipboard.",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#09261E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error state
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

  // Main render
  const propertyImages = property.imageUrl 
    ? [property.imageUrl]
    : ['/api/placeholder/800/600'];
  
  const formattedAddress = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`;
  const daysOnMarket = Math.floor((Date.now() - new Date(property.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Basic Property Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{formattedAddress}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{daysOnMarket} days on market</span>
                <span>ID: {property.id}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-3xl font-bold text-[#09261E] mb-2">
                ${property.price.toLocaleString()}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleWatchlistToggle} variant="outline" size="sm">
                  <Heart className={`h-4 w-4 mr-2 ${isInWatchlist ? 'fill-red-500 text-red-500' : ''}`} />
                  {isInWatchlist ? 'Saved' : 'Save'}
                </Button>
                <Button onClick={() => setShareModalOpen(true)} variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={propertyImages[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <BedDouble className="h-6 w-6 mx-auto mb-2 text-[#09261E]" />
                  <div className="font-semibold">{property.bedrooms || 0}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bath className="h-6 w-6 mx-auto mb-2 text-[#09261E]" />
                  <div className="font-semibold">{property.bathrooms || 0}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <SquareIcon className="h-6 w-6 mx-auto mb-2 text-[#09261E]" />
                  <div className="font-semibold">{property.squareFeet?.toLocaleString() || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Sq Ft</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Home className="h-6 w-6 mx-auto mb-2 text-[#09261E]" />
                  <div className="font-semibold">{property.yearBuilt || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Year Built</div>
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>
            )}
          </div>

          {/* Right Column - Contact */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Seller</h3>
              <div className="space-y-3">
                <Button onClick={handleContactSeller} className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Seller
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Seller</DialogTitle>
            <DialogDescription>
              Send a message about this property to the seller.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" type="email" {...field} />
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
                      <Input placeholder="(555) 123-4567" type="tel" {...field} />
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
                        placeholder="I'm interested in this property..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setContactModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={inquiryMutation.isPending} className="flex-1">
                  {inquiryMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Property</DialogTitle>
            <DialogDescription>
              Share this property with others.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input 
                value={shareUrl || generateShareableUrl()} 
                readOnly 
                className="flex-1"
              />
              <Button onClick={handleCopyToClipboard} size="sm">
                {copySuccess ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Button variant="outline" size="sm">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}