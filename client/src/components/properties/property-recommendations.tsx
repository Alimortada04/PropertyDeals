import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Property } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Home } from "lucide-react";

interface PropertyRecommendationsProps {
  location?: string;
  priceRange?: { min: number; max: number };
  propertyType?: string;
  maxResults?: number;
  title?: string;
  showViewAll?: boolean;
}

export default function PropertyRecommendations({
  location,
  priceRange,
  propertyType,
  maxResults = 4,
  title = "Recommended Properties",
  showViewAll = true,
}: PropertyRecommendationsProps) {
  const [_, setLocation] = useLocation();

  // Build the API URL based on props
  const buildQueryUrl = () => {
    if (!location) {
      return `/api/properties/recommendations?maxResults=${maxResults}`;
    }

    let url = `/api/properties/recommendations/location/${encodeURIComponent(location)}?maxResults=${maxResults}`;
    
    if (priceRange) {
      url += `&priceMin=${priceRange.min}&priceMax=${priceRange.max}`;
    }
    
    if (propertyType) {
      url += `&propertyTypes=${propertyType}`;
    }
    
    return url;
  };

  const { data: recommendations, isLoading, error } = useQuery<Property[]>({
    queryKey: [buildQueryUrl()],
  });

  if (error) {
    console.error("Error loading recommendations:", error);
  }

  if (isLoading) {
    return (
      <div className="my-8">
        <h2 className="text-xl font-heading font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(maxResults)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <Skeleton className="w-full h-48" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-heading font-bold">{title}</h2>
        {showViewAll && (
          <Button 
            variant="link" 
            onClick={() => setLocation("/properties")}
            className="text-[#135341] font-medium flex items-center gap-1"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((property) => (
          <div 
            key={property.id}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setLocation(`/p/${property.id}`)}
          >
            <div className="relative">
              <img 
                src={property.imageUrl || "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                alt={property.title || "Property"} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white font-bold text-lg">
                  ${property.price?.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start gap-2 mb-2">
                <MapPin className="h-4 w-4 text-[#135341] mt-1 flex-shrink-0" />
                <h3 className="font-medium text-gray-800 line-clamp-1">
                  {property.address}, {property.city}
                </h3>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <span className="mr-3">{property.bedrooms} bd</span>
                <span className="mr-3">{property.bathrooms} ba</span>
                <span>{property.squareFeet?.toLocaleString()} sqft</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Home className="h-3 w-3 mr-1" />
                <span>{property.propertyType || "Residential"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}