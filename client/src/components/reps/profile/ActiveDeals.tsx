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
  MapPin 
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ActiveDealsProps {
  properties: Property[];
}

export default function ActiveDeals({ properties }: ActiveDealsProps) {
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
      <h2 className="text-2xl font-bold text-[#09261E] mb-4">
        Active Deals <span className="text-base font-normal text-gray-500">({properties.length})</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
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
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {/* Property Image */}
      <div className="h-48 w-full relative">
        <img
          src={property.imageUrl || `https://source.unsplash.com/featured/?house,property&sig=${property.id}`}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <h3 className="text-white font-semibold truncate">{property.title}</h3>
          <p className="text-white/90 text-sm truncate">{property.address}</p>
        </div>
        
        <Badge className="absolute top-2 right-2 bg-[#09261E] hover:bg-[#09261E]">
          ACTIVE
        </Badge>
        
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
          <Badge variant="outline" className="text-xs">
            {property.propertyType || "Residential"}
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
              <span>{property.propertyType}</span>
            </div>
          )}
        </div>
        
        {/* Action Button */}
        <Button 
          className="w-full mt-1 bg-[#09261E] hover:bg-[#135341] h-9 text-sm"
          onClick={() => window.location.href = `/properties/${property.id}`}
        >
          <span>View Property</span>
          <ArrowRight size={14} className="ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}