import React from 'react';
import { useLocation } from 'wouter';
import { Property } from '@shared/schema';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Tag, 
  Clock, 
  Home,
  Calendar
} from 'lucide-react';
// Format currency utility function
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

interface RepPropertyCardProps {
  property: Property;
  isListing?: boolean; // is this an active listing or a closed deal
  status?: 'active' | 'pending' | 'sold' | 'expired';
  date?: string; // date listed or date closed
  price?: number; // price or sold price
  role?: 'listing_agent' | 'buyers_agent' | 'seller' | 'buyer';
}

export default function RepPropertyCard({ 
  property, 
  isListing = true,
  status = 'active',
  date,
  price,
  role
}: RepPropertyCardProps) {
  const [, setLocation] = useLocation();
  
  // Format date if available
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    }).format(date);
  };
  
  // Status colors
  const statusColors = {
    active: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    sold: "bg-blue-100 text-blue-800 border-blue-200",
    expired: "bg-gray-100 text-gray-800 border-gray-200"
  };
  
  // Role colors
  const roleColors = {
    listing_agent: "bg-indigo-100 text-indigo-800 border-indigo-200",
    buyers_agent: "bg-purple-100 text-purple-800 border-purple-200",
    seller: "bg-rose-100 text-rose-800 border-rose-200",
    buyer: "bg-cyan-100 text-cyan-800 border-cyan-200"
  };
  
  // Format role text
  const roleText = {
    listing_agent: "Listing Agent",
    buyers_agent: "Buyer's Agent",
    seller: "Seller",
    buyer: "Buyer"
  };
  
  return (
    <Card 
      className="bg-white border border-gray-100 hover:shadow-md overflow-hidden transition-all cursor-pointer"
      onClick={() => setLocation(`/p/${property.id}`)}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Property Image */}
        <div className="w-full sm:w-40 h-32 sm:h-auto relative overflow-hidden">
          <img 
            src={property.imageUrl || '/images/property-placeholder.jpg'} 
            alt={property.title} 
            className="w-full h-full object-cover"
          />
          {/* Status badge */}
          {status && (
            <div className="absolute top-2 left-2">
              <Badge className={`${statusColors[status]} border`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </div>
          )}
        </div>
        
        {/* Property Details */}
        <CardContent className="p-4 flex-1">
          <div className="flex flex-col h-full">
          
            {/* Property Title */}
            <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
              {property.title}
            </h3>
            
            {/* Address */}
            <div className="flex items-center text-gray-500 text-sm mb-2">
              <MapPin size={14} className="mr-1 text-gray-400" />
              <span className="truncate">
                {property.address}, {property.city}, {property.state} {property.zipCode}
              </span>
            </div>
            
            {/* Property Specs */}
            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
              {property.bedrooms && (
                <div className="flex items-center">
                  <Bed size={14} className="mr-1 text-gray-500" />
                  <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                </div>
              )}
              
              {property.bathrooms && (
                <div className="flex items-center">
                  <Bath size={14} className="mr-1 text-gray-500" />
                  <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                </div>
              )}
              
              {property.squareFeet && (
                <div className="flex items-center">
                  <Square size={14} className="mr-1 text-gray-500" />
                  <span>{property.squareFeet.toLocaleString()} sqft</span>
                </div>
              )}
              
              {property.propertyType && (
                <div className="flex items-center">
                  <Home size={14} className="mr-1 text-gray-500" />
                  <span>{property.propertyType}</span>
                </div>
              )}
            </div>
            
            {/* Bottom Section with Price and Date */}
            <div className="mt-auto pt-2 flex justify-between items-center text-sm">
              {/* Price */}
              <div className="flex items-center font-medium text-gray-900">
                <Tag size={14} className="mr-1 text-gray-500" />
                {price ? formatCurrency(price) : formatCurrency(property.price)}
              </div>
              
              {/* Date & Role */}
              <div className="flex flex-col items-end">
                {date && (
                  <div className="flex items-center text-gray-500 text-xs">
                    <Clock size={12} className="mr-1" />
                    <span>
                      {isListing ? 'Listed' : 'Closed'}: {formatDate(date)}
                    </span>
                  </div>
                )}
                
                {role && (
                  <Badge variant="outline" className={`mt-1 text-xs ${roleColors[role]}`}>
                    {roleText[role]}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}