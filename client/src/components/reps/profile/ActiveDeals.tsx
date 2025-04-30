import { useState } from "react";
import { Property } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  ArrowRight, 
  Home, 
  BedDouble, 
  Bath, 
  SquareCode, 
  MapPin,
  Building,
  Eye
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ActiveDealsProps {
  properties: Property[];
}

export default function ActiveDeals({ properties }: ActiveDealsProps) {
  const [showAllPropertiesDialog, setShowAllPropertiesDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter properties based on search query when viewing all
  const filteredProperties = properties?.filter(property => 
    !searchQuery || 
    property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.zipCode?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Show only the first 3 properties in the main view
  const displayedProperties = properties?.slice(0, 3) || [];
  
  if (!properties || properties.length === 0) {
    return (
      <div id="active-deals" className="my-8 scroll-mt-24">
        <h2 className="text-2xl font-bold text-[#09261E] mb-4">
          Active Deals <span className="text-base font-normal text-gray-500">(0)</span>
        </h2>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
          <Home className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No active deals yet</h3>
          <p className="text-gray-500 mt-1">This REP doesn't have any active deals at the moment. Check back soon!</p>
        </div>
      </div>
    );
  }
  
  return (
    <div id="active-deals" className="my-8 scroll-mt-24">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#09261E]">
          Active Deals <span className="text-base font-normal text-gray-500">({properties.length})</span>
        </h2>
        
        {properties.length > 3 && (
          <button 
            className="px-5 py-1.5 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200 flex items-center"
            onClick={() => setShowAllPropertiesDialog(true)}
          >
            View All <ArrowRight size={14} className="ml-1.5" />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayedProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      
      {/* All Properties Dialog */}
      <Dialog open={showAllPropertiesDialog} onOpenChange={setShowAllPropertiesDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Active Properties</DialogTitle>
            <DialogDescription>
              Browse all properties that this REP is currently representing.
            </DialogDescription>
          </DialogHeader>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by address, city, or property name"
              className="pl-9 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          
          {filteredProperties.length === 0 && (
            <div className="text-center py-8">
              <Building className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium">No properties found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
          
          <DialogFooter className="mt-4">
            <button 
              className="px-5 py-1.5 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200"
              onClick={() => setShowAllPropertiesDialog(false)}
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  // Generate a listing date between 1-30 days ago
  const daysSincePosted = Math.floor(Math.random() * 29) + 1;
  const postedDate = new Date();
  postedDate.setDate(postedDate.getDate() - daysSincePosted);
  
  // Format listing time as "X days ago"
  const getTimeAgo = () => {
    if (daysSincePosted === 1) return "1 day ago";
    return `${daysSincePosted} days ago`;
  };
  
  // Generate random view count between 25-150
  const viewCount = Math.floor(Math.random() * 125) + 25;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {/* Property Image */}
      <div className="h-48 w-full relative">
        <img
          src={property.imageUrl || `https://source.unsplash.com/featured/?house,property&sig=${property.id}`}
          alt={property.address}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <h3 className="text-white font-semibold truncate">{property.address}</h3>
        </div>
        
        <div className="absolute top-2 left-2 flex items-center bg-black/60 text-white text-xs py-1 px-2 rounded-full">
          <Clock size={12} className="mr-1" />
          <span>Listed {getTimeAgo()}</span>
        </div>
      </div>
      
      <CardContent className="p-4">
        {/* Price */}
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold text-[#09261E]">
            {formatCurrency(property.price)}
          </div>
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <Eye size={12} className="mr-0.5" />
            <span>{viewCount}</span>
          </Badge>
        </div>
        
        {/* Location */}
        <p className="text-gray-500 text-sm flex items-center mt-1 mb-3">
          <MapPin size={14} className="mr-1" />
          <span>{property.city}, {property.state} {property.zipCode}</span>
        </p>
        
        {/* Features */}
        <div className="flex flex-wrap gap-3 mb-4">
          {property.bedrooms && (
            <div className="flex items-center text-xs text-gray-700">
              <BedDouble size={14} className="mr-1" />
              <span>{property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}</span>
            </div>
          )}
          
          {property.bathrooms && (
            <div className="flex items-center text-xs text-gray-700">
              <Bath size={14} className="mr-1" />
              <span>{property.bathrooms} {property.bathrooms === 1 ? "Bath" : "Baths"}</span>
            </div>
          )}
          
          {property.squareFeet && (
            <div className="flex items-center text-xs text-gray-700">
              <SquareCode size={14} className="mr-1" />
              <span>{property.squareFeet.toLocaleString()} sq ft</span>
            </div>
          )}
          
          {property.propertyType && (
            <div className="flex items-center text-xs text-gray-700">
              <Home size={14} className="mr-1" />
              <span>{property.propertyType === "Single Family" ? "SFH" : property.propertyType}</span>
            </div>
          )}
        </div>
        
        {/* Action Button */}
        <button 
          className="w-full mt-1 px-5 py-1.5 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-[#EAF2EF] text-[#135341] shadow-sm border border-gray-200 flex items-center justify-center"
          onClick={() => window.location.href = `/properties/${property.id}`}
        >
          <span>View Property</span>
          <ArrowRight size={14} className="ml-2" />
        </button>
      </CardContent>
    </Card>
  );
}