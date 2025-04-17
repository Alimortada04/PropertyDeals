import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bookmark } from 'lucide-react';

// Define the property type
interface Property {
  id: number;
  title: string;
  price: number;
  address: string;
  city: string;
  state: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  imageUrl: string;
  dealType?: string;
  tier?: string;
}

interface RepPropertyCardProps {
  property: Property;
}

export default function RepPropertyCard({ property }: RepPropertyCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
      {/* Property Image with Tags */}
      <div className="relative h-48">
        <img 
          src={property.imageUrl || "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
        
        {/* Tier Badge */}
        {property.tier && (
          <Badge 
            className={`absolute top-2 right-2 ${
              property.tier === 'Exclusive' 
                ? 'bg-[#803344] hover:bg-[#6a2a38]' 
                : 'bg-[#135341] hover:bg-[#09261E]'
            }`}
          >
            {property.tier}
          </Badge>
        )}
        
        {/* Deal Type Tag */}
        {property.dealType && (
          <Badge variant="outline" className="absolute top-2 left-2 bg-white/90 border-white">
            {property.dealType}
          </Badge>
        )}
      </div>
      
      {/* Property Details */}
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-[#135341] line-clamp-1">${property.price.toLocaleString()}</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bookmark className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
        
        <h4 className="font-medium text-gray-800 mb-1 line-clamp-1">{property.title}</h4>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{property.address}, {property.city}, {property.state}</span>
        </div>
        
        {/* Property Features */}
        {(property.bedrooms || property.bathrooms || property.squareFeet) && (
          <div className="flex text-sm text-gray-600 justify-between">
            {property.bedrooms && (
              <div>
                <span className="font-medium">{property.bedrooms}</span> bed{property.bedrooms !== 1 && 's'}
              </div>
            )}
            {property.bathrooms && (
              <div>
                <span className="font-medium">{property.bathrooms}</span> bath{property.bathrooms !== 1 && 's'}
              </div>
            )}
            {property.squareFeet && (
              <div>
                <span className="font-medium">{property.squareFeet.toLocaleString()}</span> sqft
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-[#135341] hover:bg-[#09261E]"
          onClick={() => window.location.href = `/p/${property.id}`}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}