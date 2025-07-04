import React, { useState } from "react";
import { Property } from "@shared/schema";
import MobileImageCarousel from "./mobile-image-carousel";
import MobileFloatingCTA from "./mobile-floating-cta";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MapPin,
  Calendar,
  Ruler,
  Home,
  Building,
  Users,
  FileText,
  BarChart,
  DollarSign,
  MapPinned,
  Bookmark,
  Star,
  Heart,
  Share,
  Bath,
  Square as SquareIcon,
  Link as LinkIcon,
  Mail,
  Check as CheckIcon,
  Copy as CopyIcon,
  ChevronRight,
  Calculator,
  PercentSquare,
  Car,
  ArrowRight,
  ChevronDown,
  Wrench,
  BedDouble,
  HelpCircle,
  MoveRight,
  Info,
  MessageSquare,
  ChevronLeft,
  Share2,
  Download,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { SiPinterest } from "react-icons/si";
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
import { useMemo } from "react";
import { resolvePublicUrl } from "@/lib/supabase-upload";

interface MobilePropertyViewProps {
  property: Property;
  onBack?: () => void;
  onContactSeller: () => void;
  onMakeOffer?: () => void;
}

const MobilePropertyView: React.FC<MobilePropertyViewProps> = ({
  property,
  onBack,
  onContactSeller,
  onMakeOffer,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const propertyImages = useMemo(() => {
    const images: string[] = [];

    if (property.primary_image) {
      const url = resolvePublicUrl(property.primary_image);
      if (url) images.push(url);
    }

    if (Array.isArray(property.gallery_images)) {
      for (const img of property.gallery_images) {
        const url = resolvePublicUrl(img);
        if (url) images.push(url);
      }
    }

    return images;
  }, [property.primary_image, property.gallery_images]);

  // Format address for display
  const formattedAddress = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`;

  // Sample features for this demo
  const features = [
    { name: "Central Air", present: true },
    { name: "Garage", present: true },
    { name: "Pool", present: false },
    { name: "Fireplace", present: true },
    { name: "Deck/Patio", present: true },
    { name: "Basement", present: true },
    { name: "Hardwood Floors", present: true },
    { name: "Security System", present: false },
  ];

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleContactClick = () => {
    setContactModalOpen(true);
  };

  const handleOfferClick = () => {
    setOfferModalOpen(true);
  };

  const handleImageClick = () => {
    setIsGalleryOpen(true);
  };

  // Generate a shareable property report URL
  const generateShareableUrl = () => {
    const baseUrl = window.location.origin;
    const shareableUrl = `${baseUrl}/properties/${property.id}/report`;
    setShareUrl(shareableUrl);
    return shareableUrl;
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Handle email share
  const handleEmailShare = () => {
    const subject = `Property Report: ${property.address}`;
    const body = `Check out this property at ${property.address}, ${property.city}, ${property.state} ${property.zipCode}.\n\nPrice: $${property.price?.toLocaleString()}\nBedrooms: ${property.bedrooms}\nBathrooms: ${property.bathrooms}\nSquare Feet: ${property.squareFeet?.toLocaleString() || "N/A"}\n\nView the full property report here: ${shareUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Generate PDF report
  const generatePdfReport = () => {
    // In a real implementation, this would generate and download a PDF
    const link = document.createElement("a");
    link.href = "/api/properties/" + property.id + "/pdf";
    link.download = `PropertyReport_${property.address.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fetch zip code demographic data
  const fetchZipCodeData = async (zipCode: string) => {
    try {
      // In a real implementation, this would make a fetch to the unitedstateszipcodes.org API
      // For now, we'll return mock data based on the provided requirements
      return {
        demographics: {
          population: 32451,
          ageDistribution: [
            { group: "Under 18", percentage: 21.5 },
            { group: "18-24", percentage: 9.7 },
            { group: "25-34", percentage: 15.3 },
            { group: "35-54", percentage: 26.8 },
            { group: "55-64", percentage: 12.1 },
            { group: "65+", percentage: 14.6 },
          ],
          raceDistribution: [
            { group: "White", percentage: 68.2 },
            { group: "Black", percentage: 12.4 },
            { group: "Hispanic", percentage: 10.8 },
            { group: "Asian", percentage: 5.7 },
            { group: "Other", percentage: 2.9 },
          ],
          genderDistribution: [
            { group: "Male", percentage: 48.3 },
            { group: "Female", percentage: 51.7 },
          ],
          housingStatus: [
            { group: "Owner Occupied", percentage: 65.4 },
            { group: "Renter Occupied", percentage: 28.7 },
            { group: "Vacant", percentage: 5.9 },
          ],
        },
      };
    } catch (error) {
      console.error("Error fetching zip code data:", error);
      return null;
    }
  };

  // Sample seller properties
  const sellerProperties = [
    {
      id: 1,
      title: "Victorian Charm",
      address: "789 Victorian Lane, Milwaukee, WI",
      price: 425000,
      bedrooms: 3,
      bathrooms: 2.5,
      imageUrl:
        "https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?q=80&w=300&h=200&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Lakeside Retreat",
      address: "421 Lake View Drive, Milwaukee, WI",
      price: 589000,
      bedrooms: 4,
      bathrooms: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?q=80&w=300&h=200&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Downtown Loft",
      address: "50 Urban Street #302, Milwaukee, WI",
      price: 349000,
      bedrooms: 2,
      bathrooms: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?q=80&w=300&h=200&auto=format&fit=crop",
    },
  ];

  // Sample demographic data from unitedstateszipcodes.org
  const demographicData = {
    population: 36327,
    ageDistribution: [
      { group: "Under 18", percentage: 21.5 },
      { group: "18-24", percentage: 9.7 },
      { group: "25-34", percentage: 15.3 },
      { group: "35-54", percentage: 26.8 },
      { group: "55-64", percentage: 12.1 },
      { group: "65+", percentage: 14.6 },
    ],
    raceDistribution: [
      { group: "White", percentage: 68.2 },
      { group: "Black", percentage: 12.4 },
      { group: "Hispanic", percentage: 10.8 },
      { group: "Asian", percentage: 5.7 },
      { group: "Other", percentage: 2.9 },
    ],
    genderDistribution: [
      { group: "Male", percentage: 48.3 },
      { group: "Female", percentage: 51.7 },
    ],
    housingStatus: [
      { group: "Owner Occupied", percentage: 65.4 },
      { group: "Renter Occupied", percentage: 28.7 },
      { group: "Vacant", percentage: 5.9 },
    ],
    housingTypes: [
      { group: "In Occupied Housing Units", percentage: 91.5 },
      { group: "Nursing Facilities", percentage: 0.7 },
      { group: "College Student Housing", percentage: 7.5 },
      { group: "Other Noninstitutional", percentage: 0.4 },
    ],
    yearBuilt: [
      { group: "2014 or later", percentage: 4.2 },
      { group: "2010-2013", percentage: 3.6 },
      { group: "2000-2009", percentage: 8.1 },
      { group: "1990-1999", percentage: 7.3 },
      { group: "1980-1989", percentage: 6.9 },
      { group: "1970-1979", percentage: 10.2 },
      { group: "1960-1969", percentage: 11.7 },
      { group: "1950-1959", percentage: 15.4 },
      { group: "Before 1950", percentage: 32.6 },
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

  return (
    <div className="min-h-screen bg-white relative lg:hidden">
      {/* Sticky Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-9 w-9 p-0 rounded-full bg-gray-200/80 backdrop-blur-sm shadow-sm hover:bg-gray-300/80"
          >
            <ArrowRight className="h-5 w-5 text-gray-700 rotate-180" />
          </Button>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFavorite}
              className={`h-9 w-9 p-0 rounded-full backdrop-blur-sm shadow-sm ${
                isFavorite
                  ? "bg-[#803344] hover:bg-[#803344]/90"
                  : "bg-gray-200/80 hover:bg-gray-300/80"
              }`}
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? "fill-white text-white" : "text-gray-700"}`}
              />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShareModalOpen(true)}
              className="h-9 w-9 p-0 rounded-full bg-gray-200/80 backdrop-blur-sm shadow-sm hover:bg-gray-300/80"
            >
              <Share className="h-5 w-5 text-gray-700" />
            </Button>
          </div>
        </div>
      </div>
      {/* Image Carousel positioned right under sticky header */}
      <div className="pt-16">
        {propertyImages.length > 0 ? (
          <MobileImageCarousel
            images={propertyImages}
            address={property.address}
            onBack={onBack}
            onImageClick={handleImageClick}
          />
        ) : (
          <div className="h-[40vh] flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-2">
                No images available
              </div>
              <div className="text-xs text-gray-300">
                Primary: {property.primary_image || "None"}
                <br />
                Gallery: {property.gallery_images?.length || 0} images
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Property Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <h1 className="text-2xl font-bold text-[#09261E]">
                ${property.listing_price?.toLocaleString() || "0"}
              </h1>
              <span className="text-xs text-gray-500">
                $
                {property.sqft
                  ? Math.round((property.price || 0) / property.squareFeet)
                  : "N/A"}
                /sqft
              </span>
            </div>

            <div className="flex flex-wrap gap-2 my-2">
              <Badge
                variant="secondary"
                className="bg-[#09261E]/10 hover:bg-[#09261E]/20 text-[#09261E]"
              >
                {property.property_type || "Single Family"}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-[#09261E]/10 hover:bg-[#09261E]/20 text-[#09261E]"
              >
                Light Rehab
              </Badge>
              <Badge
                variant="secondary"
                className="bg-[#09261E]/10 hover:bg-[#09261E]/20 text-[#09261E]"
              >
                5 days on PropertyDeals
              </Badge>
            </div>

            <div className="text-sm text-gray-500 mt-1">
              {property.address}, {property.city}, {property.state}{" "}
              {property.zipCode}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-3">
          <Button
            variant={isFavorite ? "default" : "outline"}
            size="sm"
            className={`${
              isFavorite
                ? "bg-[#803344] text-white hover:bg-[#803344]/90"
                : "border-gray-200 text-gray-700 bg-[#f3f4f6] hover:bg-[#803344] hover:text-white hover:border-[#803344]"
            } flex-1 mr-2`}
            onClick={toggleFavorite}
          >
            <Heart
              className={`h-4 w-4 mr-1.5 ${isFavorite ? "fill-white text-white" : ""}`}
            />
            {isFavorite ? "Saved" : "Save"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-200 text-gray-700 flex-1 mr-2 bg-[#f3f4f6] hover:bg-[#135341] hover:text-white hover:border-[#135341]"
            onClick={() => {
              generateShareableUrl();
              setShareModalOpen(true);
            }}
          >
            <Share2 className="h-4 w-4 mr-1.5" />
            Share
          </Button>
          <Button
            size="sm"
            className="bg-[#09261E] hover:bg-[#135341] text-white flex-1"
            onClick={handleContactClick}
          >
            Contact
          </Button>
        </div>
      </div>
      {/* Main Content */}
      <div className="pb-24">
        {" "}
        {/* Padding bottom for floating CTA */}
        {/* Property Stats - Quick Info (just icon and value on one line) */}
        <div className="px-4 py-4 border-b border-gray-200 grid grid-cols-4 gap-3">
          <div className="flex items-center justify-center">
            <BedDouble className="text-[#09261E] w-4 h-4 mr-1.5" />
            <span className="font-medium text-sm">{property.bedrooms}</span>
          </div>

          <div className="flex items-center justify-center">
            <Bath className="text-[#09261E] w-4 h-4 mr-1.5" />
            <span className="font-medium text-sm">{property.bathrooms}</span>
          </div>

          <div className="flex items-center justify-center">
            <SquareIcon className="text-[#09261E] w-4 h-4 mr-1.5" />
            <span className="font-medium text-sm whitespace-nowrap">
              {property.squareFeet?.toLocaleString() || "3,500"}
            </span>
          </div>

          <div className="flex items-center justify-center">
            <Calendar className="text-[#09261E] w-4 h-4 mr-1.5" />
            <span className="font-medium text-sm">
              {property.yearBuilt || "1886"}
            </span>
          </div>
        </div>
        {/* New Responsive accordions for mobile view based on the screenshots */}
        <div className="border-t border-gray-100">
          {/* Property Details Section */}
          <Accordion
            type="single"
            defaultValue="details"
            collapsible
            className="w-full"
          >
            <AccordionItem value="details" className="border-b border-gray-200">
              <AccordionTrigger className="w-full py-4 px-4 text-xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                <div className="flex items-center">
                  <Home className="mr-3 h-5 w-5 text-[#09261E]" />
                  <span>Property Details</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4">
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
                      <div className="font-semibold">
                        {property.squareFeet?.toLocaleString() || "3,500"} sq ft
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Ruler className="text-[#09261E] w-5 h-5 mr-2 mt-0.5" />
                    <div>
                      <div className="text-gray-600 text-xs">Lot Size</div>
                      <div className="font-semibold">
                        {property.lotSize || "0.25 acres"}
                      </div>
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
                    <Home className="text-[#09261E] w-5 h-5 mr-2 mt-0.5" />
                    <div>
                      <div className="text-gray-600 text-xs">Property Type</div>
                      <div className="font-semibold">
                        {property.propertyType || "Single-family"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <DollarSign className="text-[#09261E] w-5 h-5 mr-2 mt-0.5" />
                    <div>
                      <div className="text-gray-600 text-xs">
                        Price per sqft
                      </div>
                      <div className="font-semibold">
                        $
                        {property.squareFeet
                          ? Math.round(
                              (property.price || 0) / property.squareFeet,
                            )
                          : "98"}
                        /sqft
                      </div>
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
                  <h3 className="font-medium text-[#09261E] mb-3 text-lg">
                    Property Description
                  </h3>
                  <p className="text-gray-700 mb-3">
                    This charming {property.propertyType || "single-family"}{" "}
                    home is nestled in a highly sought-after neighborhood in{" "}
                    {property.city}, {property.state}. With {property.bedrooms}{" "}
                    spacious bedrooms and {property.bathrooms} modern bathrooms,
                    this {property.squareFeet?.toLocaleString() || ""} square
                    foot residence offers comfort and style.
                  </p>
                  <p className="text-gray-700 mb-3">
                    The property features a well-maintained yard, perfect for
                    outdoor entertaining. Recent upgrades include new
                    energy-efficient appliances and updated fixtures throughout.
                    The location provides easy access to local schools, shopping
                    centers, and major highways.
                  </p>
                  <p className="text-gray-700">
                    This property presents an excellent opportunity for both
                    homeowners and investors looking for a solid return on
                    investment in a stable market. Don't miss the chance to add
                    this gem to your portfolio!
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* The Numbers section */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="numbers" className="border-b border-gray-200">
              <AccordionTrigger className="w-full py-4 px-4 text-xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                <div className="flex items-center">
                  <Calculator className="mr-3 h-5 w-5 text-[#09261E]" />
                  <span>The Numbers</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4">
                <div className="grid grid-cols-1 gap-5 mb-6">
                  {/* Rent with Dropdown for Multiple Units */}
                  <Collapsible className="border-b border-gray-100 pb-3">
                    <CollapsibleTrigger className="w-full">
                      <div className="flex justify-between items-center cursor-pointer hover:text-[#803344] group">
                        <span className="text-gray-600 font-medium group-hover:text-[#803344]">
                          Rent
                        </span>
                        <div className="flex items-center">
                          <span className="font-semibold text-[#09261E] mr-2 group-hover:text-[#803344]">
                            ${(property.price * 0.008).toFixed(0)}/month
                          </span>
                          <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-[#803344]" />
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3 pl-6 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Main Unit</span>
                        <span className="text-gray-700">
                          ${(property.price * 0.008).toFixed(0)}/mo
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Basement Apartment
                        </span>
                        <span className="text-gray-700">
                          ${(property.price * 0.003).toFixed(0)}/mo
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Market Analysis</span>
                        <span className="text-gray-700">
                          ${(property.price * 0.008 * 1.1).toFixed(0)}/mo
                          (potential)
                        </span>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Estimated Repair Costs with Clickable Contractor Avatar */}
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <span className="text-gray-600 font-medium">
                      Estimated Repair Costs
                    </span>
                    <div className="flex items-center">
                      <span className="font-semibold text-[#09261E] mr-2">
                        ${(property.price * 0.05).toFixed(0)}
                      </span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Avatar className="h-6 w-6 cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-[#09261E]/50 transition-all">
                            <AvatarImage
                              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=120&h=120&auto=format&fit=crop"
                              alt="Contractor"
                            />
                            <AvatarFallback className="text-xs bg-gray-200">
                              MJ
                            </AvatarFallback>
                          </Avatar>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-heading">
                              Contractor Quote
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                              Details from Mike Johnson, certified contractor
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-2 space-y-4">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage
                                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=120&h=120&auto=format&fit=crop"
                                  alt="Contractor"
                                />
                                <AvatarFallback className="bg-gray-200">
                                  MJ
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium text-[#09261E]">
                                  Mike Johnson
                                </h4>
                                <p className="text-sm text-gray-500">
                                  Elite Contractors, LLC
                                </p>
                                <div className="flex items-center mt-1">
                                  <span className="text-yellow-500">★★★★★</span>
                                  <span className="text-sm text-gray-500 ml-1">
                                    (28 reviews)
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-b py-3">
                              <h5 className="font-medium mb-2">
                                Quote Details
                              </h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Materials
                                  </span>
                                  <span className="font-medium">
                                    ${(property.price * 0.025).toFixed(0)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Labor</span>
                                  <span className="font-medium">
                                    ${(property.price * 0.02).toFixed(0)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Permits & Fees
                                  </span>
                                  <span className="font-medium">
                                    ${(property.price * 0.005).toFixed(0)}
                                  </span>
                                </div>
                                <div className="flex justify-between font-medium pt-2 border-t">
                                  <span>Total</span>
                                  <span>
                                    ${(property.price * 0.05).toFixed(0)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h5 className="font-medium mb-2">Work Summary</h5>
                              <p className="text-sm text-gray-600">
                                Complete interior and exterior renovation
                                including new kitchen, bathrooms, flooring, and
                                roof repair. Timeline: 6-8 weeks.
                              </p>
                            </div>

                            <div className="flex space-x-2">
                              <Button
                                className="flex-1"
                                onClick={() =>
                                  (window.location.href = "/reps/mike-johnson")
                                }
                              >
                                <Info className="mr-2 h-4 w-4" />
                                View Profile
                              </Button>
                              <Button variant="outline" className="flex-1">
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
                        <span className="text-gray-600 font-medium group-hover:text-[#803344]">
                          Estimated Monthly Expenses
                        </span>
                        <div className="flex items-center">
                          <span className="font-semibold text-[#09261E] mr-2 group-hover:text-[#803344]">
                            ${(property.price * 0.003).toFixed(0)}/month
                          </span>
                          <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-[#803344]" />
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3 pl-6 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Property Tax</span>
                        <span className="text-gray-700">
                          $
                          {Math.round(
                            (property.price * 0.01) / 12,
                          ).toLocaleString()}
                          /mo
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Insurance</span>
                        <span className="text-gray-700">
                          $
                          {Math.round(
                            (property.price * 0.005) / 12,
                          ).toLocaleString()}
                          /mo
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">HOA</span>
                        <span className="text-gray-700">$150/mo</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Maintenance</span>
                        <span className="text-gray-700">
                          $
                          {Math.round(
                            (property.price * 0.001) / 12,
                          ).toLocaleString()}
                          /mo
                        </span>
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
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 ml-1 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="bg-white p-2 rounded shadow-lg border z-50"
                          >
                            <p className="text-sm font-medium">
                              After Repair Value
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="font-semibold text-[#09261E]">
                      ${(property.price * 1.2).toFixed(0)}
                    </span>
                  </div>

                  {/* Investment metrics in a grid with Monthly Rent % */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <div className="flex items-center">
                        <PercentSquare className="h-4 w-4 mr-1 text-[#09261E]" />
                        <h4 className="text-sm font-medium text-gray-500">
                          Cap Rate
                        </h4>
                      </div>
                      <p className="text-lg font-semibold text-[#09261E]">
                        5.2%
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <MoveRight className="h-4 w-4 mr-1 text-[#09261E]" />
                        <h4 className="text-sm font-medium text-gray-500">
                          Cash-on-Cash Return
                        </h4>
                      </div>
                      <p className="text-lg font-semibold text-[#09261E]">
                        7.8%
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-[#09261E]" />
                        <h4 className="text-sm font-medium text-gray-500">
                          Monthly Rent %
                        </h4>
                      </div>
                      <p className="text-lg font-semibold text-[#09261E]">
                        {(
                          ((property.price * 0.008) /
                            (property.price + property.price * 0.05)) *
                          100
                        ).toFixed(2)}
                        %
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 pb-2 text-center">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleOfferClick}
                  >
                    I'm a contractor — Submit a Quote
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Calculators section */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="calculators"
              className="border-b border-gray-200"
            >
              <AccordionTrigger className="w-full py-4 px-4 text-xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                <div className="flex items-center">
                  <PercentSquare className="mr-3 h-5 w-5 text-[#09261E]" />
                  <span>Calculators</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4">
                <div className="grid grid-cols-1 gap-6">
                  {/* Flip Calculator */}
                  <div className="p-5 bg-gray-50 rounded-md border border-gray-200">
                    <h3 className="text-xl font-bold mb-4 text-[#09261E]">
                      Flip Calculator
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Purchase Price (Automatic)
                        </div>
                        <div className="flex border rounded-md bg-white">
                          <div className="py-2 px-3 flex-1">$459,000</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Repair Costs (Automatic)
                        </div>
                        <div className="flex border rounded-md bg-white">
                          <div className="py-2 px-3 flex-1">$22,950</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          ARV{" "}
                          <span className="inline-flex items-center justify-center w-4 h-4 ml-1 text-xs rounded-full border border-gray-300 text-gray-500">
                            ?
                          </span>
                        </div>
                        <div className="flex border rounded-md bg-white">
                          <div className="py-2 px-3 flex-1">$550,800</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Holding Costs
                        </div>
                        <div className="flex border rounded-md bg-white">
                          <div className="py-2 px-3 flex-1">$9,180</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Selling Costs
                        </div>
                        <div className="flex border rounded-md bg-white">
                          <div className="py-2 px-3 flex-1">$27,540</div>
                        </div>
                      </div>

                      <Button className="w-full bg-[#09261E] hover:bg-[#135341]">
                        Calculate Profit
                      </Button>

                      <div className="flex justify-between items-center pt-2">
                        <span>Potential Profit:</span>
                        <span className="font-bold">--</span>
                      </div>
                    </div>
                  </div>

                  {/* Rental Calculator */}
                  <div className="p-5 bg-gray-50 rounded-md border border-gray-200">
                    <h3 className="text-xl font-bold mb-4 text-[#09261E]">
                      Rental Calculator
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Purchase Price (Automatic)
                        </div>
                        <div className="flex border rounded-md bg-white">
                          <div className="py-2 px-3 flex-1">$459,000</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Monthly Rent
                        </div>
                        <div className="flex border rounded-md bg-white">
                          <div className="py-2 px-3 flex-1">$3,672</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Monthly Expenses
                        </div>
                        <div className="flex border rounded-md bg-white">
                          <div className="py-2 px-3 flex-1">$1,377</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Down Payment Percentage
                        </div>
                        <div className="flex border rounded-md bg-white">
                          <div className="py-2 px-3 flex-1">20%</div>
                        </div>
                      </div>

                      <Button className="w-full bg-[#09261E] hover:bg-[#135341]">
                        Calculate Returns
                      </Button>

                      <div className="grid grid-cols-1 gap-2 pt-2">
                        <div className="flex justify-between items-center">
                          <span>Rent %:</span>
                          <span className="font-bold">--</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Cap Rate %:</span>
                          <span className="font-bold">--</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Cash on Cash Return:</span>
                          <span className="font-bold">--</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <Button variant="link" className="text-[#09261E]">
                    View All Property Calculators{" "}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Location section */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="location"
              className="border-b border-gray-200"
            >
              <AccordionTrigger className="w-full py-4 px-4 text-xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                <div className="flex items-center">
                  <MapPin className="mr-3 h-5 w-5 text-[#09261E]" />
                  <span>Location</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4">
                {/* Demographics dropdown */}
                <Accordion type="single" collapsible className="w-full mb-4">
                  <AccordionItem
                    value="demographics"
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-[#09261E]">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="font-medium">Demographics</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4">
                      {/* Population section */}
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <h5 className="font-medium mb-2">Population</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600 text-sm">
                                Total Population
                              </span>
                              <span className="font-medium">124,356</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 text-sm">
                                Median Age
                              </span>
                              <span className="font-medium">37.2</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 text-sm">
                                Households
                              </span>
                              <span className="font-medium">48,903</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2">Household Income</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600 text-sm">
                                Median Income
                              </span>
                              <span className="font-medium">$56,842</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 text-sm">
                                Average Income
                              </span>
                              <span className="font-medium">$68,125</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 text-sm">
                                Per Capita Income
                              </span>
                              <span className="font-medium">$32,590</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Age Distribution (now inside Demographics) */}
                      <div className="mt-6 mb-4">
                        <h4 className="font-medium text-lg mb-3">
                          Age Distribution
                        </h4>
                        <div className="h-8 w-full flex rounded-md overflow-hidden">
                          <div className="h-full bg-[#09261E] w-[18%]"></div>
                          <div className="h-full bg-[#135341] w-[26%]"></div>
                          <div className="h-full bg-[#2A7D6B] w-[22%]"></div>
                          <div className="h-full bg-[#803344] w-[19%]"></div>
                          <div className="h-full bg-[#A04054] w-[15%]"></div>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                          <div className="flex items-center text-xs">
                            <div className="w-3 h-3 rounded-full mr-1 bg-[#09261E]"></div>
                            <span>Under 18: 18%</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <div className="w-3 h-3 rounded-full mr-1 bg-[#135341]"></div>
                            <span>18-34: 26%</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <div className="w-3 h-3 rounded-full mr-1 bg-[#2A7D6B]"></div>
                            <span>35-54: 22%</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <div className="w-3 h-3 rounded-full mr-1 bg-[#803344]"></div>
                            <span>55-74: 19%</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <div className="w-3 h-3 rounded-full mr-1 bg-[#A04054]"></div>
                            <span>75+: 15%</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 italic mt-6 text-right">
                        Data sourced from unitedstateszipcodes.org
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Map placeholder */}
                <div className="mt-6">
                  <h5 className="font-medium mb-2">Map</h5>
                  <div className="bg-gray-200 h-40 rounded-md flex items-center justify-center">
                    <Button size="sm" variant="outline" className="bg-white">
                      View on Map
                    </Button>
                  </div>
                </div>

                {/* Home Values */}
                <div className="mt-6">
                  <h5 className="font-medium mb-2">Home Values</h5>
                  <div className="h-6 w-full flex rounded-md overflow-hidden">
                    <div className="h-full bg-[#09261E] w-[2.1%]"></div>
                    <div className="h-full bg-[#135341] w-[8.3%]"></div>
                    <div className="h-full bg-[#2A7D6B] w-[18.5%]"></div>
                    <div className="h-full bg-[#803344] w-[39.2%]"></div>
                    <div className="h-full bg-[#A04054] w-[26.7%]"></div>
                    <div className="h-full bg-[#C04D64] w-[5.2%]"></div>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-2 mt-2">
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 rounded-full mr-1 bg-[#09261E]"></div>
                      <span>Less than $100K: 2.1%</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 rounded-full mr-1 bg-[#135341]"></div>
                      <span>$100K-$199K: 8.3%</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 rounded-full mr-1 bg-[#2A7D6B]"></div>
                      <span>$200K-$299K: 18.5%</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 rounded-full mr-1 bg-[#803344]"></div>
                      <span>$300K-$499K: 39.2%</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 rounded-full mr-1 bg-[#A04054]"></div>
                      <span>$500K-$999K: 26.7%</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 rounded-full mr-1 bg-[#C04D64]"></div>
                      <span>$1M or more: 5.2%</span>
                    </div>
                  </div>
                </div>

                {/* Housing Ownership */}
                <div className="mt-6">
                  <h5 className="font-medium mb-2">Housing Ownership</h5>
                  <div className="h-6 w-full flex rounded-md overflow-hidden">
                    <div className="h-full bg-[#09261E] w-[49.3%]"></div>
                    <div className="h-full bg-[#135341] w-[16.1%]"></div>
                    <div className="h-full bg-[#803344] w-[28.7%]"></div>
                    <div className="h-full bg-[#DDC0C7] w-[5.9%]"></div>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-2 mt-2">
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 rounded-full mr-1 bg-[#09261E]"></div>
                      <span>Owned with mortgage: 49.3%</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 rounded-full mr-1 bg-[#135341]"></div>
                      <span>Owned free and clear: 16.1%</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 rounded-full mr-1 bg-[#803344]"></div>
                      <span>Renter occupied: 28.7%</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 rounded-full mr-1 bg-[#DDC0C7]"></div>
                      <span>Vacant: 5.9%</span>
                    </div>
                  </div>
                </div>

                {/* Monthly Rent Costs */}
                <div className="mt-6">
                  <h5 className="font-medium mb-3">Monthly Rent Costs</h5>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 border border-gray-200 rounded-md text-center">
                      <div className="text-sm text-gray-500">Studio</div>
                      <div className="font-bold mt-1">$895/mo</div>
                    </div>
                    <div className="p-3 border border-gray-200 rounded-md text-center">
                      <div className="text-sm text-gray-500">1 Bedroom</div>
                      <div className="font-bold mt-1">$1095/mo</div>
                    </div>
                    <div className="p-3 border border-gray-200 rounded-md text-center">
                      <div className="text-sm text-gray-500">2 Bedroom</div>
                      <div className="font-bold mt-1">$1450/mo</div>
                    </div>
                    <div className="p-3 border border-gray-200 rounded-md text-center">
                      <div className="text-sm text-gray-500">3+ Bedroom</div>
                      <div className="font-bold mt-1">$1850/mo</div>
                    </div>
                  </div>
                </div>

                {/* Year Housing Was Built */}
                <div className="mt-6">
                  <div className="flex justify-between items-baseline">
                    <h5 className="font-medium">Year Housing Was Built</h5>
                    <span className="text-sm text-gray-500">
                      Average age: 56 years
                    </span>
                  </div>
                  <div className="mt-2 flex h-12 space-x-1">
                    <div className="bg-[#09261E] w-[10%] rounded-sm"></div>
                    <div className="bg-[#135341] w-[12%] rounded-sm"></div>
                    <div className="bg-[#2A7D6B] w-[15%] rounded-sm"></div>
                    <div className="bg-[#3A988A] w-[12%] rounded-sm"></div>
                    <div className="bg-[#803344] w-[10%] rounded-sm"></div>
                    <div className="bg-[#964257] w-[10%] rounded-sm"></div>
                    <div className="bg-[#A04054] w-[10%] rounded-sm"></div>
                    <div className="bg-[#B1546A] w-[8%] rounded-sm"></div>
                    <div className="bg-[#C04D64] w-[13%] rounded-sm"></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>2020+</span>
                    <span>2000-19</span>
                    <span>1980-99</span>
                    <span>1960-79</span>
                    <span>1940-59</span>
                    <span>&lt;1940</span>
                  </div>
                  <div className="text-center mt-2 text-xs text-gray-500">
                    Most common housing age: Before 1950 (32.6%)
                  </div>
                </div>

                <div className="text-xs text-gray-500 italic mt-6 text-right">
                  Data sourced from unitedstateszipcodes.org
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Find a REP section */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="reps" className="border-b border-gray-200">
              <AccordionTrigger className="w-full py-4 px-4 text-xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                <div className="flex items-center">
                  <Wrench className="mr-3 h-5 w-5 text-[#09261E]" />
                  <span>Find a REP</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4">
                <p className="mb-4">
                  Connect with local professionals who can help with this
                  property:
                </p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full overflow-hidden mb-2">
                      <img
                        src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=120&h=120&auto=format&fit=crop"
                        alt="Agent"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="font-medium">Agent</div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full overflow-hidden mb-2">
                      <img
                        src="https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?q=80&w=120&h=120&auto=format&fit=crop"
                        alt="Contractor"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="font-medium">Contractor</div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full overflow-hidden mb-2">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&h=120&auto=format&fit=crop"
                        alt="Lender"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="font-medium">Lender</div>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <Button variant="link" className="text-[#09261E]">
                    View All REPs <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Property History */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="history" className="border-b border-gray-200">
              <AccordionTrigger className="w-full py-4 px-4 text-xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                <div className="flex items-center">
                  <FileText className="mr-3 h-5 w-5 text-[#09261E]" />
                  <span>Property History</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          DATE
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          EVENT
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          PRICE
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          SOURCE
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          12/15/2024
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Listed
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          $459,000
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          PropertyDeals
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          06/30/2024
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Assessed
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          $390,150
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          County Records
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          01/22/2019
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Sold
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          $367,200
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          MLS
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 italic mt-4">
                  Property history data is for demonstration purposes. In a
                  production app, this would be pulled from public records.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Comparable Properties */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="comparables"
              className="border-b border-gray-200"
            >
              <AccordionTrigger className="w-full py-4 px-4 text-xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                <div className="flex items-center">
                  <Calculator className="mr-3 h-5 w-5 text-[#09261E]" />
                  <span>Comparable Properties</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* Property card 1 */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden flex">
                    <div className="w-1/3 bg-gray-200">
                      <img
                        src="https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d"
                        alt="Property"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-3">
                      <h3 className="font-medium">456 Elm Street</h3>
                      <p className="text-sm text-gray-500">Milwaukee, WI</p>
                      <div className="flex justify-between items-end mt-2">
                        <div className="font-bold text-lg">$439,000</div>
                        <div className="text-sm text-gray-500">3bd, 2ba</div>
                      </div>
                    </div>
                  </div>

                  {/* Property card 2 */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden flex">
                    <div className="w-1/3 bg-gray-200">
                      <img
                        src="https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb"
                        alt="Property"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-3">
                      <h3 className="font-medium">789 Oak Road</h3>
                      <p className="text-sm text-gray-500">Milwaukee, WI</p>
                      <div className="flex justify-between items-end mt-2">
                        <div className="font-bold text-lg">$475,000</div>
                        <div className="text-sm text-gray-500">4bd, 3ba</div>
                      </div>
                    </div>
                  </div>

                  {/* Property card 3 */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden flex">
                    <div className="w-1/3 bg-gray-200">
                      <img
                        src="https://images.unsplash.com/photo-1567496898669-ee935f5f647a"
                        alt="Property"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-3">
                      <h3 className="font-medium">101 Pine Lane</h3>
                      <p className="text-sm text-gray-500">Milwaukee, WI</p>
                      <div className="flex justify-between items-end mt-2">
                        <div className="font-bold text-lg">$495,000</div>
                        <div className="text-sm text-gray-500">4bd, 2.5ba</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <Button variant="link" className="text-[#09261E]">
                    View All Comparable Properties{" "}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        {/* More Deals by Michael */}
        <div className="py-6 border-t border-gray-200 pl-[16px] pr-[16px]">
          <h3 className="text-lg font-heading font-bold text-[#09261E] mb-4 px-4">
            More Deals by Michael
          </h3>
          <div className="flex overflow-x-auto gap-4 px-4 pb-2 snap-x snap-mandatory hide-scrollbar">
            {sellerProperties.map((prop) => (
              <div
                key={prop.id}
                className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow snap-start"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={prop.imageUrl}
                    alt={prop.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
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
                  {prop.id === 3 && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-[#803344] hover:bg-[#803344]">
                        Off-Market
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="font-bold text-[#09261E] mb-1">
                    ${prop.price.toLocaleString()}
                  </div>
                  <div className="text-gray-700 mb-2 truncate">
                    {prop.address}
                  </div>
                  <div className="flex text-sm text-gray-600 mb-3">
                    <div className="mr-3">{prop.bedrooms} bd</div>
                    <div className="mr-3">{prop.bathrooms} ba</div>
                    <div>{prop.address.split(",")[0].length}00 sqft</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Similar Deals You Might Like */}
        <div className="py-6 border-t border-gray-200 pl-[16px] pr-[16px]">
          <h3 className="text-lg font-heading font-bold text-[#09261E] mb-4 px-4">
            Similar Deals You Might Like
          </h3>
          <div className="flex overflow-x-auto gap-4 px-4 pb-2 snap-x snap-mandatory hide-scrollbar">
            {sellerProperties
              .slice()
              .reverse()
              .map((prop) => (
                <div
                  key={`similar-${prop.id}`}
                  className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow snap-start"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={prop.imageUrl}
                      alt={prop.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
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
                    {prop.id === 2 && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-[#135341] hover:bg-[#135341]">
                          New Listing
                        </Badge>
                      </div>
                    )}
                    {prop.id === 1 && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-orange-500 hover:bg-orange-500">
                          Price Drop
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-bold text-[#09261E] mb-1">
                      ${prop.price.toLocaleString()}
                    </div>
                    <div className="text-gray-700 mb-2 truncate">
                      {prop.address}
                    </div>
                    <div className="flex text-sm text-gray-600 mb-3">
                      <div className="mr-3">{prop.bedrooms} bd</div>
                      <div className="mr-3">{prop.bathrooms} ba</div>
                      <div>{prop.address.split(",")[0].length}00 sqft</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="text-center mt-4 px-4">
            <Button
              variant="outline"
              className="border-[#09261E] text-[#09261E] hover:bg-[#09261E]/10 w-full"
            >
              View All Similar Properties
            </Button>
          </div>
        </div>
      </div>
      {/* Floating CTA Bar */}
      <MobileFloatingCTA
        onClick={handleContactClick}
        onContactClick={handleContactClick}
        onOfferClick={onMakeOffer}
        sellerName="Michael Johnson"
        sellerPosition="Real Estate Agent"
        sellerImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&h=120&auto=format&fit=crop"
      />
      {/* Contact Seller Modal */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="w-[90%] max-w-[425px] p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-heading">
              Contact Seller
            </DialogTitle>
            <DialogDescription>
              Send a message to the property seller. They will respond to your
              inquiry as soon as possible.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="font-medium text-sm">
                Name
              </label>
              <Input id="name" placeholder="Your full name" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="font-medium text-sm">
                Email
              </label>
              <Input
                id="email"
                placeholder="your.email@example.com"
                type="email"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phone" className="font-medium text-sm">
                Phone (optional)
              </label>
              <Input id="phone" placeholder="(555) 123-4567" type="tel" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="font-medium text-sm">
                Message
              </label>
              <Textarea
                id="message"
                rows={4}
                defaultValue="Hi, I'm interested. Please contact me for more information."
              />
            </div>

            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-[#09261E] hover:bg-[#135341] text-white"
              >
                Send Message
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Get Contractor Quote Modal */}
      <Dialog open={offerModalOpen} onOpenChange={setOfferModalOpen}>
        <DialogContent className="w-[90%] max-w-[425px] p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-heading">
              Get Contractor Quotes
            </DialogTitle>
            <DialogDescription>
              Request quotes from our network of verified contractors for
              renovations on this property.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="quote-name" className="font-medium text-sm">
                Name
              </label>
              <Input id="quote-name" placeholder="Your full name" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="quote-email" className="font-medium text-sm">
                Email
              </label>
              <Input
                id="quote-email"
                placeholder="your.email@example.com"
                type="email"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="quote-phone" className="font-medium text-sm">
                Phone
              </label>
              <Input id="quote-phone" placeholder="(555) 123-4567" type="tel" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="workType" className="font-medium text-sm">
                Work Type
              </label>
              <Input
                id="workType"
                placeholder="Kitchen remodel, bathroom update, etc."
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="details" className="font-medium text-sm">
                Details
              </label>
              <Textarea
                id="details"
                rows={4}
                placeholder="Please provide details about the work needed..."
              />
            </div>

            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-[#09261E] hover:bg-[#135341] text-white"
              >
                Request Quotes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Share Property Report Dialog */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[550px] pt-[16px] pb-[16px] pl-[16px] pr-[16px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading">
              Share Property Report
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Choose how you'd like to share this property report with others.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 pt-[0px] pb-[0px]">
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
                    <p className="text-xs text-gray-500">
                      Copy shareable property report link
                    </p>
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
                    <p className="text-xs text-gray-500">
                      Share via email with detailed info
                    </p>
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
                    <p className="text-xs text-gray-500">
                      Download a detailed PDF report
                    </p>
                  </div>
                </div>
                <Download className="w-5 h-5 text-gray-400" />
              </div>

              {/* Social Media Options */}
              <div className="border-t pt-3 mt-3">
                <h4 className="text-sm font-medium mb-2 text-gray-600">
                  Share on Social Media
                </h4>
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
            <Button
              className="bg-[#09261E] hover:bg-[#09261E]/90"
              onClick={() => setShareModalOpen(false)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full Screen Image Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="p-0 max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-2xl font-bold text-[#09261E]">
              Property Photos
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="space-y-6">
              {propertyImages.map((img, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`Property photo ${i + 1} of ${propertyImages.length}`}
                    className="w-full object-contain max-h-[60vh]"
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MobilePropertyView;
