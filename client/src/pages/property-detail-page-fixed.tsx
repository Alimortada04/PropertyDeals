import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { supabase } from "@/lib/supabase";
import { NotFoundPage } from "@/components/ui/not-found";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Share2,
  Heart,
  MapPin,
  MapPinned,
  Home,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  ChevronsRight,
  Mail,
  MessageSquare,
  Phone,
  Calculator,
  HelpCircle,
  Info,
  BedDouble,
  Bath,
  SquareIcon,
  Calendar,
  Home as HomeIcon,
  Car,
  Ruler,
  Wind,
  Snowflake,
  Building,
  Construction,
  Hammer,
  Trees,
  Wrench,
  Users,
  PercentSquare,
  DollarSign,
  MoveRight,
  User,
  ClipboardList,
} from "lucide-react";
import {
  Link as LinkIcon,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  PropertyInquiry,
  insertPropertyInquirySchema,
  InsertPropertyInquiry,
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { allProperties, similarProperties } from "@/lib/data";
import { useIsMobile } from "@/hooks/use-mobile";
import MobilePropertyView from "@/components/property/mobile-property-view";

// Sample demographic data
const demographicData = {
  population: 15247,
  medianAge: 34.2,
  medianIncome: 67500,
  homeOwnership: 68.3,
  yearBuilt: [
    { group: "2020 or Later", percentage: 2.1, count: 320 },
    { group: "2010-2019", percentage: 8.4, count: 1280 },
    { group: "2000-2009", percentage: 12.7, count: 1940 },
    { group: "1990-1999", percentage: 15.3, count: 2330 },
    { group: "1980-1989", percentage: 18.2, count: 2770 },
    { group: "1970-1979", percentage: 16.8, count: 2560 },
    { group: "1960-1969", percentage: 13.5, count: 2060 },
    { group: "1950-1959", percentage: 9.7, count: 1480 },
    { group: "1940-1949", percentage: 3.3, count: 500 },
  ],
  ownershipType: [
    { group: "Owned with mortgage", percentage: 49.3 },
    { group: "Owned free and clear", percentage: 16.1 },
    { group: "Renter occupied", percentage: 28.7 },
    { group: "Vacant", percentage: 5.9 },
  ],
  homeValues: [
    { group: "Less than $100K", percentage: 2.1 },
    { group: "$100K-$199K", percentage: 8.3 },
    { group: "$200K-$299K", percentage: 18.5 },
    { group: "$300K-$499K", percentage: 39.2 },
    { group: "$500K-$999K", percentage: 26.7 },
    { group: "$1M or more", percentage: 5.2 },
  ],
  monthlyRent: [
    { type: "Studio", rent: 895 },
    { type: "1 Bedroom", rent: 1095 },
    { type: "2 Bedroom", rent: 1450 },
    { type: "3+ Bedroom", rent: 1850 },
  ],
  householdIncome: [
    { group: "Less than $25K", percentage: 15.3 },
    { group: "$25K-$49K", percentage: 17.6 },
    { group: "$50K-$74K", percentage: 16.1 },
    { group: "$75K-$99K", percentage: 13.8 },
    { group: "$100K-$149K", percentage: 18.4 },
    { group: "$150K or more", percentage: 18.8 },
  ],
};

interface PropertyDetailPageProps {
  id: string;
}

export default function PropertyDetailPage({ id }: PropertyDetailPageProps) {
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
      const headerOffset = customOffset || 100;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

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

  // Create form schema with validation
  const inquirySchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
      message: "Phone number must be at least 10 digits.",
    }),
    message: z.string().min(10, {
      message: "Message must be at least 10 characters.",
    }),
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

  // Handle inquiry submission
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
    onError: (error: Error) => {
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

  // Use mobile view for mobile devices
  if (isMobile) {
    return <MobilePropertyView property={property} />;
  }

  const photos = property.gallery_images ? JSON.parse(property.gallery_images) : [];
  const mainImage = property.primary_image || "/placeholder-property.jpg";

  return (
    <div className="min-h-screen bg-background">
      {/* Property Header */}
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

      {/* Property Images */}
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
                <div
                  className="relative cursor-pointer"
                  onClick={() => setViewingAllPhotos(true)}
                >
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

      {/* Property Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Details */}
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

            {/* Description */}
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

            {/* Financial Details */}
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
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

            {/* Quick Stats */}
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

      {/* Contact Modal */}
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

      {/* Share Modal */}
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