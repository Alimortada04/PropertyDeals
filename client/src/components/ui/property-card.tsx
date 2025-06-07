import React from "react";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, Bed, Bath, Square } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    address: string;
    price: number;
    imageUrl: string;
    status: string;
    viewCount: number;
    saveCount: number;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    tags: string[];
    propertyType?: string;
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  // Format numbers with thousands separators
  const formatNumber = (num: number | null | undefined) => {
    if (!num && num !== 0) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Define status badge color function
  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'live':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'under contract':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-white border border-gray-200 cursor-pointer">
      <div className="relative">
        {/* Property image */}
        <img 
          src={property.imageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop'} 
          alt={property.title}
          className="w-full h-48 object-cover" 
        />
        
        {/* Status badge - top right */}
        <div className="absolute top-3 right-3">
          <Badge className={`px-3 py-1 font-medium transition-transform duration-200 hover:scale-105 ${getStatusBadgeClass(property.status)}`}>
            {property.status}
          </Badge>
        </div>
      </div>
      
      <CardContent className="pt-4 pb-3">
        {/* Property title and address */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{property.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-1">{property.address}</p>
        </div>
        
        {/* Price */}
        <div className="mb-3">
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(property.price)}
          </p>
        </div>
        
        {/* Property specs - bedrooms, bathrooms, sqft */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
            </div>
          )}
          {property.squareFeet > 0 && (
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{formatNumber(property.squareFeet)} sqft</span>
            </div>
          )}
        </div>
        
        {/* Property tags */}
        {Array.isArray(property.tags) && property.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {property.tags.slice(0, 3).map((tag, index) => {
              // Clean the tag text by removing quotes and brackets
              const cleanTag = String(tag).replace(/["\[\]]/g, '').trim();
              return cleanTag ? (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-gray-50 text-gray-700 border-gray-200"
                >
                  {cleanTag}
                </Badge>
              ) : null;
            })}
            {property.tags.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs bg-gray-50 text-gray-700 border-gray-200"
              >
                +{property.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        {/* View count and favorites */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {property.viewCount > 0 && (
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{formatNumber(property.viewCount)} views</span>
            </div>
          )}
          {property.saveCount > 0 && (
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{formatNumber(property.saveCount)} saved</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}