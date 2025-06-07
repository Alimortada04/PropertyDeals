import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { supabase } from "@/lib/supabase";
import { NotFoundPage } from "@/components/ui/not-found";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Share2,
  Heart,
  MapPin,
  BedDouble,
  Bath,
  SquareIcon,
  Home as HomeIcon,
  MessageSquare,
  Phone,
  Calculator,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { InsertPropertyInquiry } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useIsMobile } from "@/hooks/use-mobile";

interface PropertyDetailPageProps {
  id: string;
}

export default function PropertyDetailPage({ id }: PropertyDetailPageProps) {
  const { toast } = useToast();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const isMobile = useIsMobile();

  const [match] = useRoute("/p/:propertyId");
  const propertyId = match?.params.propertyId || id;
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) return;

      const { data, error } = await supabase
        .from("property_profile")
        .select("*")
        .eq("id", propertyId)
        .eq("status", "live")
        .single();

      if (error || !data) {
        setError(true);
      } else {
        setProperty(data);
      }

      setIsLoading(false);
    };

    fetchProperty();
  }, [propertyId]);

  const inquirySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    phone: z.string().min(10, "Phone number must be at least 10 digits."),
    message: z.string().min(10, "Message must be at least 10 characters."),
  });

  const form = useForm<z.infer<typeof inquirySchema>>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const inquiryMutation = useMutation({
    mutationFn: async (values: z.infer<typeof inquirySchema>) => {
      const inquiryData: InsertPropertyInquiry = {
        ...values,
        propertyId: parseInt(propertyId),
        createdAt: new Date().toISOString(),
      };

      return apiRequest("/api/property-inquiries", {
        method: "POST",
        body: JSON.stringify(inquiryData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Inquiry sent!",
        description: "Your message has been sent to the property owner.",
      });
      setContactModalOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInquirySubmit = (values: z.infer<typeof inquirySchema>) => {
    inquiryMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return <NotFoundPage />;
  }

  const photos = property.gallery_images ? JSON.parse(property.gallery_images) : [];
  const mainImage = property.primary_image || "/placeholder-property.jpg";

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {property.name || property.address || "Property Details"}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  {property.address}, {property.city}, {property.state} {property.zip_code}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {property.status}
                </Badge>
                <span className="text-2xl font-bold text-primary">
                  ${property.listing_price?.toLocaleString() || "Price TBD"}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsInWatchlist(!isInWatchlist)}
              >
                <Heart
                  className={cn(
                    "h-4 w-4 mr-2",
                    isInWatchlist && "fill-red-500 text-red-500"
                  )}
                />
                {isInWatchlist ? "Saved" : "Save"}
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => setShareModalOpen(true)}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <Button onClick={() => setContactModalOpen(true)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Owner
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-2 h-96">
            <div className="col-span-2 relative">
              <img
                src={mainImage}
                alt="Property main view"
                className="w-full h-full object-cover rounded-l-lg"
              />
            </div>
            <div className="grid grid-rows-2 gap-2">
              {photos.slice(0, 2).map((photo: string, index: number) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Property view ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              ))}
            </div>
            <div className="grid grid-rows-2 gap-2">
              {photos.slice(2, 4).map((photo: string, index: number) => (
                <img
                  key={index + 2}
                  src={photo}
                  alt={`Property view ${index + 4}`}
                  className="w-full h-full object-cover"
                />
              ))}
              {photos.length > 4 && (
                <div className="relative">
                  <img
                    src={photos[4]}
                    alt="More photos"
                    className="w-full h-full object-cover rounded-br-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-br-lg">
                    <span className="text-white font-semibold">
                      +{photos.length - 4} more
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <BedDouble className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                    <div className="font-semibold">{property.bedrooms || "N/A"}</div>
                    <div className="text-sm text-gray-500">Bedrooms</div>
                  </div>
                  <div className="text-center">
                    <Bath className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                    <div className="font-semibold">{property.bathrooms || "N/A"}</div>
                    <div className="text-sm text-gray-500">Bathrooms</div>
                  </div>
                  <div className="text-center">
                    <SquareIcon className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                    <div className="font-semibold">{property.sqft?.toLocaleString() || "N/A"}</div>
                    <div className="text-sm text-gray-500">Sq Ft</div>
                  </div>
                  <div className="text-center">
                    <HomeIcon className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                    <div className="font-semibold">{property.year_built || "N/A"}</div>
                    <div className="text-sm text-gray-500">Year Built</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {property.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Investment Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Purchase Price</div>
                    <div className="text-xl font-semibold">
                      ${property.purchase_price?.toLocaleString() || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">ARV</div>
                    <div className="text-xl font-semibold">
                      ${property.arv?.toLocaleString() || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Monthly Rent</div>
                    <div className="text-xl font-semibold">
                      ${property.rent_total_monthly?.toLocaleString() || "N/A"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Interested in this property?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => setContactModalOpen(true)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Owner
                </Button>
                <Button variant="outline" className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Make Offer
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium">{property.property_type || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition</span>
                  <span className="font-medium">{property.condition || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lot Size</span>
                  <span className="font-medium">{property.lot_size || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Parking</span>
                  <span className="font-medium">{property.parking || "N/A"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Property Owner</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleInquirySubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
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
                      <Input placeholder="(555) 123-4567" {...field} />
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
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setContactModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={inquiryMutation.isPending}
                  className="flex-1"
                >
                  {inquiryMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this property</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                value={window.location.href}
                readOnly
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopySuccess(true);
                  setTimeout(() => setCopySuccess(false), 2000);
                }}
              >
                {copySuccess ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="sm">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}