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
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface PropertyDetailPageProps {
  id: string;
}

export default function PropertyDetailPage({ id }: PropertyDetailPageProps) {
  const [match, params] = useRoute("/p/:id");
  const propertyId = params?.id || id;
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [saved, setSaved] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("property_profile")
          .select("*")
          .eq("id", propertyId)
          .single();

        if (error) throw error;
        setProperty(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const inquirySchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(1, "Phone is required"),
    message: z.string().min(1, "Message is required"),
    inquiryType: z.string().min(1, "Please select an inquiry type"),
  });

  type InquiryForm = z.infer<typeof inquirySchema>;

  const form = useForm<InquiryForm>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      inquiryType: "",
    },
  });

  const inquiryMutation = useMutation({
    mutationFn: async (data: InquiryForm) => {
      // Simulate API call for now
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 1000);
      });
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Submitted",
        description: "Your inquiry has been sent successfully.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = property?.name || "Check out this property";
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "Property link copied to clipboard",
      });
    } else {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return <NotFoundPage />;
  }

  const photos = [];
  const mainImage = property.primary_image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Images */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={mainImage}
                  alt={property.name || "Property"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">
                    {property.status || "Available"}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="sm"
                    variant={saved ? "default" : "outline"}
                    onClick={() => setSaved(!saved)}
                    className="bg-white/90 hover:bg-white"
                  >
                    <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
                  </Button>
                  <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="bg-white/90 hover:bg-white">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Share Property</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handleShare('facebook')}
                            className="flex-1"
                          >
                            <Facebook className="h-4 w-4 mr-2" />
                            Facebook
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleShare('twitter')}
                            className="flex-1"
                          >
                            <Twitter className="h-4 w-4 mr-2" />
                            Twitter
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => handleShare('linkedin')}
                          className="w-full"
                        >
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </Button>
                        <Button
                          variant="default"
                          onClick={() => handleShare('copy')}
                          className="w-full"
                        >
                          Copy Link
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      {property.name || property.address || "Property Details"}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{property.address || "Address not available"}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      ${(property.listing_price || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {property.bedrooms && (
                    <div className="flex items-center gap-2">
                      <BedDouble className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{property.bedrooms}</span>
                      <span className="text-gray-600">Beds</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{property.bathrooms}</span>
                      <span className="text-gray-600">Baths</span>
                    </div>
                  )}
                  {property.square_feet && (
                    <div className="flex items-center gap-2">
                      <SquareIcon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{property.square_feet.toLocaleString()}</span>
                      <span className="text-gray-600">Sq Ft</span>
                    </div>
                  )}
                  {property.property_type && (
                    <div className="flex items-center gap-2">
                      <HomeIcon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{property.property_type}</span>
                    </div>
                  )}
                </div>

                {property.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{property.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact and Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Get More Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Seller
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Contact About This Property</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit((data) => inquiryMutation.mutate(data))} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
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
                              <FormLabel>Email</FormLabel>
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
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="inquiryType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Inquiry Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select inquiry type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="general">General Information</SelectItem>
                                  <SelectItem value="viewing">Schedule Viewing</SelectItem>
                                  <SelectItem value="offer">Make an Offer</SelectItem>
                                  <SelectItem value="financing">Financing Options</SelectItem>
                                </SelectContent>
                              </Select>
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
                                <Textarea {...field} rows={4} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={inquiryMutation.isPending}>
                          {inquiryMutation.isPending ? "Sending..." : "Send Inquiry"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" className="w-full" size="lg">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Mortgage
                </Button>
              </CardContent>
            </Card>

            {/* Property Details Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium">{property.property_type || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built</span>
                  <span className="font-medium">{property.year_built || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lot Size</span>
                  <span className="font-medium">{property.lot_size ? `${property.lot_size} sq ft` : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge variant="outline">{property.status || "Available"}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}