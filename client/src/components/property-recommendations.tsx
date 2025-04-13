import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@shared/schema";
import { allProperties } from "@/lib/data";

interface PropertyRecommendationsProps {
  location?: string;
  propertyType?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  title?: string;
  showViewAll?: boolean;
  maxResults?: number;
}

// Extended property type to handle UI tags like "off market"
interface ExtendedProperty extends Property {
  offMarket?: boolean;
  newListing?: boolean;
  priceDrop?: boolean;
}

export default function PropertyRecommendations({
  location,
  propertyType,
  priceRange,
  title = "Recommended Properties",
  showViewAll = false,
  maxResults = 3
}: PropertyRecommendationsProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  // Fetch recommendations from the API
  const { data: recommendations, isLoading } = useQuery({
    queryKey: [`/api/properties/recommendations/location/${location || ''}`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/properties/recommendations/location/${location || ''}`);
        if (!response.ok) {
          throw new Error('Failed to fetch recommended properties');
        }
        // Process API data to add UI properties
        const properties = await response.json();
        return properties.map((prop: Property) => {
          const random = Math.random();
          // Add UI properties
          return {
            ...prop,
            offMarket: random > 0.7,
            newListing: random < 0.3,
            priceDrop: random > 0.4 && random < 0.5
          } as ExtendedProperty;
        });
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        // Fallback to sample data if API fails
        return allProperties.slice(0, 8).map(prop => ({
          ...prop,
          offMarket: Math.random() > 0.7,
          newListing: Math.random() < 0.3,
          priceDrop: Math.random() > 0.4 && Math.random() < 0.5
        }));
      }
    },
    enabled: !!location
  });

  // Filter recommendations by property type and price range
  const filteredRecommendations = recommendations?.filter((property: ExtendedProperty) => {
    let matches = true;
    
    if (propertyType && property.propertyType !== propertyType) {
      matches = false;
    }
    
    if (priceRange && property.price) {
      if (property.price < priceRange.min || property.price > priceRange.max) {
        matches = false;
      }
    }
    
    return matches;
  }).slice(0, maxResults) || [];

  const totalPages = Math.ceil(filteredRecommendations.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const displayedRecommendations = filteredRecommendations.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-gray-100 animate-pulse rounded-lg h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!filteredRecommendations.length) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-600 mb-2">No matching properties found</h3>
        <p className="text-gray-500">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-heading font-bold text-[#09261E]">{title}</h3>
          {showViewAll && location && (
            <Link to={`/properties?location=${encodeURIComponent(location)}`}>
              <Button variant="link" className="text-[#09261E] font-medium">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayedRecommendations.map((property: ExtendedProperty) => (
          <Link key={property.id} to={`/p/${property.id}`}>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
              <div className="relative h-48">
                <img 
                  src={property.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'} 
                  alt={property.title} 
                  className="h-full w-full object-cover" 
                />
                {property.offMarket && (
                  <div className="absolute top-2 left-2 bg-[#803344] text-white text-xs px-2 py-1 rounded-full">
                    Off Market
                  </div>
                )}
                {property.newListing && (
                  <div className="absolute top-2 left-2 bg-[#135341] text-white text-xs px-2 py-1 rounded-full">
                    New Listing
                  </div>
                )}
                {property.priceDrop && (
                  <div className="absolute top-2 left-2 bg-[#09261E] text-white text-xs px-2 py-1 rounded-full">
                    Price Drop
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-medium text-[#09261E] truncate">{property.title}</h3>
                <p className="text-gray-600 text-sm truncate">{property.address}</p>
                <div className="mt-2 text-xl font-bold text-[#09261E]">${property.price?.toLocaleString()}</div>
                <div className="flex mt-2 text-sm text-gray-500">
                  <span className="mr-3">{property.bedrooms} beds</span>
                  <span className="mr-3">{property.bathrooms} baths</span>
                  <span>{property.squareFeet?.toLocaleString()} sqft</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <Button 
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              variant="outline"
              size="sm"
              className="w-9 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center text-sm text-gray-500">
              {currentPage + 1} / {totalPages}
            </div>
            <Button 
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              variant="outline"
              size="sm"
              className="w-9 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}