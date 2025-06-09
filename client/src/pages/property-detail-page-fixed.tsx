import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { supabase } from "@/lib/supabase";
import { MobileFloatingCTA } from "@/components/property/mobile-floating-cta";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import {
  Share2,
  Heart,
  MapPin,
  Home as HomeIcon,
  ChevronRight,
  MessageSquare,
  Calculator,
  BedDouble,
  Bath,
  Hammer,
} from "lucide-react";

interface PropertyDetailPageProps {
  id: string;
}

export default function PropertyDetailPage({ id }: PropertyDetailPageProps) {
  const { toast } = useToast();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [savedProperties, setSavedProperties] = useState<number[]>([]);

  const handleSaveProperty = () => {
    if (property) {
      if (savedProperties.includes(property.id)) {
        setSavedProperties(prev => prev.filter(id => id !== property.id));
        toast({ title: "Property removed from saved list" });
      } else {
        setSavedProperties(prev => [...prev, property.id]);
        toast({ title: "Property saved successfully" });
      }
    }
  };

  // Get property data from Supabase
  const {
    data: property,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_profile")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#09261E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Link href="/properties">
            <Button className="bg-[#09261E] hover:bg-[#09261E]/90">
              Browse Properties
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Property Hero Section */}
      <section className="relative bg-white pt-6">
        <div className="container mx-auto px-4 pt-2 pb-4">
          {/* Breadcrumb Navigation */}
          <nav className="flex text-sm text-gray-500 mb-4 items-center">
            <Link href="/" className="hover:text-[#09261E]">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link href="/properties" className="hover:text-[#09261E]">
              Properties
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-[#09261E] font-medium truncate">
              {property.address}
            </span>
          </nav>

          {/* Property Title and Key Details */}
          <div className="md:flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#09261E] mb-2">
                {property.address}
              </h1>
              <div className="flex items-center text-lg text-gray-700 mb-1">
                <span>
                  {property.city}, {property.state?.toUpperCase()} {property.zipcode}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setContactModalOpen(true)}
                >
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                  Contact Seller
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveProperty}
                  className={savedProperties.includes(property.id) ? "text-red-500" : ""}
                >
                  <Heart className={`h-3.5 w-3.5 mr-1.5 ${savedProperties.includes(property.id) ? "fill-current" : ""}`} />
                  {savedProperties.includes(property.id) ? "Saved" : "Save"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShareModalOpen(true)}
                >
                  <Share2 className="h-3.5 w-3.5 mr-1.5" />
                  Share
                </Button>
              </div>
            </div>

            {/* Price and Key Stats */}
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-3xl md:text-4xl font-bold text-[#09261E]">
                ${property.price?.toLocaleString()}
              </div>
              <div className="text-gray-600 text-sm mt-1">
                Listed Price
              </div>
            </div>
          </div>

          {/* Property Image Placeholder */}
          <div className="w-full h-96 bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
            <HomeIcon className="h-20 w-20 text-gray-400" />
          </div>

          {/* Property Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#09261E]/5 p-3 rounded-lg text-center">
              <div className="text-gray-600 text-sm mb-1">Bedrooms</div>
              <div className="font-bold text-xl text-[#09261E]">
                {property.bedrooms || "N/A"}
              </div>
            </div>
            <div className="bg-[#09261E]/5 p-3 rounded-lg text-center">
              <div className="text-gray-600 text-sm mb-1">Bathrooms</div>
              <div className="font-bold text-xl text-[#09261E]">
                {property.bathrooms || "N/A"}
              </div>
            </div>
            <div className="bg-[#09261E]/5 p-3 rounded-lg text-center">
              <div className="text-gray-600 text-sm mb-1">Square Feet</div>
              <div className="font-bold text-xl text-[#09261E]">
                {property.sqft?.toLocaleString() || "N/A"}
              </div>
            </div>
            <div className="bg-[#09261E]/5 p-3 rounded-lg text-center">
              <div className="text-gray-600 text-sm mb-1">Lot Size</div>
              <div className="font-bold text-xl text-[#09261E]">
                {property.lot_size?.toLocaleString() || "N/A"}
              </div>
            </div>
          </div>

          {/* Property Type & Status Badges */}
          <div className="flex flex-wrap gap-3">
            {property.propertyType && (
              <Badge
                variant="outline"
                className="px-4 py-1.5 bg-[#09261E]/10 text-[#09261E] border-0 flex items-center"
              >
                <HomeIcon className="h-3.5 w-3.5 mr-1.5" />
                {property.propertyType}
              </Badge>
            )}
            <Badge
              variant="outline"
              className="px-4 py-1.5 bg-[#135341]/10 text-[#135341] border-0 flex items-center"
            >
              <Hammer className="h-3.5 w-3.5 mr-1.5" />
              Investment Property
            </Badge>
          </div>
        </div>
      </section>

      {/* Property Details Section */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-heading font-bold text-[#09261E] mb-6">
              Property Details
            </h2>
            
            {/* Basic Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type:</span>
                    <span className="font-medium">{property.propertyType || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built:</span>
                    <span className="font-medium">{property.year_built || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lot Size:</span>
                    <span className="font-medium">{property.lot_size?.toLocaleString() || "N/A"} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parking:</span>
                    <span className="font-medium">{property.parking_spaces || "0"} spaces</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Listed Price:</span>
                    <span className="font-medium">${property.price?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Tax:</span>
                    <span className="font-medium">${property.property_tax?.toLocaleString() || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">HOA Fees:</span>
                    <span className="font-medium">${property.hoa_fees?.toLocaleString() || "0"}/month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>
            )}

            {/* Investment Calculator */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Investment Calculator
              </h3>
              <p className="text-gray-600 mb-4">
                Get detailed investment analysis for this property including cash flow projections, 
                ROI calculations, and financing scenarios.
              </p>
              <Button className="bg-[#09261E] hover:bg-[#09261E]/90">
                Calculate Returns
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Floating CTA */}
      <MobileFloatingCTA 
        property={property}
        onContact={() => setContactModalOpen(true)}
        onSaveProperty={handleSaveProperty}
        onShare={() => setShareModalOpen(true)}
        isSaved={savedProperties.includes(property.id)}
      />
    </div>
  );
}