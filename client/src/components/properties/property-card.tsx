import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Property } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Move, Heart, Eye, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const propertyTypeColors: Record<string, string> = {
  "Single Family": "bg-blue-500",
  "Duplex": "bg-indigo-500",
  "Triplex": "bg-purple-500",
  "Multi Family": "bg-pink-500",
  "Condo": "bg-yellow-500",
  "Townhouse": "bg-orange-500",
  "Land": "bg-green-500",
  "exclusive": "bg-[#803344]",
  "off-market": "bg-[#09261E]",
};

const getPropertyTypeTag = (type?: string, status?: string | null) => {
  if (!type) {
    return status === 'exclusive' ? 'Exclusive' : 'Off-Market';
  }
  return type;
};

const getPropertyTypeColor = (type?: string, status?: string | null) => {
  if (!type) {
    return status === 'exclusive' ? propertyTypeColors.exclusive : propertyTypeColors["off-market"];
  }
  return propertyTypeColors[type] || "bg-[#09261E]";
};

interface PropertyCardProps {
  property: Partial<Property>;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [, setLocation] = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activeAvatarIndex, setActiveAvatarIndex] = useState(-1);

  const {
    id,
    title,
    address,
    city,
    state,
    listing_price,
    bedrooms,
    bathrooms,
    sqft,
    status,
    primary_image,
    gallery_images,
    property_type,
    view_count,
    save_count,
    seller_profile,
    tags,
    year_built,
    seller_id,
  } = property as any;
  
  // Use actual Supabase data
  const propertyType = property_type || 'Single Family';
  
  // Parse tags properly - handle both JSON array and regular array
  let propertyTags = [];
  if (tags) {
    if (Array.isArray(tags)) {
      propertyTags = tags;
    } else if (typeof tags === 'string') {
      try {
        propertyTags = JSON.parse(tags);
      } catch (e) {
        propertyTags = [tags];
      }
    }
  }
  const displayTags = propertyTags.slice(0, 3);

  // Parse gallery_images if it exists and is valid JSON
  let galleryImages = [];
  if (gallery_images) {
    if (Array.isArray(gallery_images)) {
      galleryImages = gallery_images;
    } else if (typeof gallery_images === 'string') {
      try {
        galleryImages = JSON.parse(gallery_images);
      } catch (e) {
        galleryImages = [];
      }
    }
  }

  // Create propertyImages array: always start with primary_image, then add gallery_images if they exist
  const hasValidPrimaryImage = primary_image && primary_image.trim() !== '';
  const validGalleryImages = Array.isArray(galleryImages) ? galleryImages.filter(img => img && img.trim() !== '' && img !== primary_image) : [];
  
  const propertyImages = [];
  if (hasValidPrimaryImage) {
    propertyImages.push(primary_image);
  }
  propertyImages.push(...validGalleryImages);
  
  const viewCount = view_count || 0;
  const favoriteCount = save_count || 0;
  
  const handleImageNavigation = (e: React.MouseEvent, direction: 'prev' | 'next') => {
    e.stopPropagation();
    if (direction === 'prev') {
      setCurrentImageIndex(prev => (prev === 0 ? propertyImages.length - 1 : prev - 1));
    } else {
      setCurrentImageIndex(prev => (prev === propertyImages.length - 1 ? 0 : prev + 1));
    }
  };

  const handleCardClick = () => {
    setLocation(`/p/${id}`);
  };

  const handleAvatarClick = (e: React.MouseEvent, repId: number) => {
    e.stopPropagation();
    setLocation(`/rep/${repId}`);
  };
  
  // Reset to primary image (index 0) when not hovered
  useEffect(() => {
    if (!isHovered) {
      setCurrentImageIndex(0);
    }
  }, [isHovered]);

  return (
    <Card 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 property-card cursor-pointer h-full flex flex-col"
      onMouseEnter={() => {
        if (validGalleryImages.length > 0) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
        setActiveAvatarIndex(-1);
      }}
      onClick={handleCardClick}
    >
      <div className="relative">
        <div className="w-full h-48 overflow-hidden relative rounded-t-lg">
          {propertyImages.length > 0 ? (
            propertyImages.map((imgSrc, index) => (
              <img 
                key={index}
                src={imgSrc}
                alt={`${title || "Property"} - View ${index + 1}`}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
                  currentImageIndex === index ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">No Image</p>
              </div>
            </div>
          )}

          {/* Image navigation arrows (only shown on hover and when gallery_images exist) */}
          {isHovered && validGalleryImages.length > 0 && (
            <>
              <button 
                onClick={(e) => handleImageNavigation(e, 'prev')}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow-md z-10 hover:bg-opacity-90 transition-all"
              >
                <ChevronLeft size={20} className="text-gray-800" />
              </button>
              <button 
                onClick={(e) => handleImageNavigation(e, 'next')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow-md z-10 hover:bg-opacity-90 transition-all"
              >
                <ChevronRight size={20} className="text-gray-800" />
              </button>
            </>
          )}

          {/* Image count indicator (only when gallery images exist) */}
          {validGalleryImages.length > 0 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 rounded-full px-2 py-1 text-xs text-white">
              {currentImageIndex + 1}/{propertyImages.length}
            </div>
          )}
        </div>

        {/* Property status badge - pulls from status field */}
        <Badge className="absolute top-2 right-2 bg-[#135341] text-white shadow-sm hover:scale-105 transition-transform duration-200">
          {status || "Available"}
        </Badge>
        
        {/* Property type tag - pulls from property_type field */}
        <Badge className="absolute top-2 left-2 bg-gray-800 text-white shadow-sm hover:scale-105 transition-transform duration-200">
          {property_type || "Property"}
        </Badge>
      </div>

      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="text-xl font-heading font-bold text-[#135341] mb-1">
          ${listing_price?.toLocaleString()}
        </h3>
        <p className="text-gray-700 mb-2 text-sm">{address}, {city}, {state}</p>
        
        {/* Property stats with icons - left-aligned */}
        <div className="flex justify-start text-sm text-gray-600 mb-3 gap-3 flex-wrap">
          {bedrooms && (
            <div className="flex items-center gap-1.5">
              <Bed size={16} />
              <span>{bedrooms}</span>
            </div>
          )}
          {bathrooms && (
            <div className="flex items-center gap-1.5">
              <Bath size={16} />
              <span>{bathrooms}</span>
            </div>
          )}
          {sqft && (
            <div className="flex items-center gap-1.5">
              <Move size={16} />
              <span>{sqft.toLocaleString()}</span>
            </div>
          )}
          {year_built && (
            <div className="flex items-center gap-1.5">
              <Calendar size={16} />
              <span>{year_built}</span>
            </div>
          )}
        </div>
        
        {/* Property tags */}
        {displayTags.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-3">
            {displayTags.map((tag: string, index: number) => (
              <Badge key={index} variant="outline" className="font-normal border-[#135341] text-[#135341] text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Engagement metrics - all left-aligned to make room for avatars */}
        <div className="flex items-center justify-start text-xs text-gray-500 mb-3 gap-3">
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>{viewCount} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart size={14} />
            <span>{favoriteCount} favorites</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0 flex items-center relative">
        {/* Single Seller Avatar with tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute right-8 -top-5">
                <Avatar 
                  className="border-2 border-white h-8 w-8 cursor-pointer hover:scale-110 transition-transform duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (seller_id) {
                      setLocation(`/rep/${seller_id}`);
                    }
                  }}
                >
                  <AvatarImage 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(seller_profile?.full_name || "Seller")}&background=135341&color=ffffff`} 
                    alt={seller_profile?.full_name || "Seller"} 
                  />
                  <AvatarFallback className="bg-[#135341] text-white">
                    {seller_profile?.full_name ? seller_profile.full_name.substring(0, 2).toUpperCase() : "S"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{seller_profile?.full_name || "Property Seller"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button 
          className="bg-[#135341] hover:bg-[#09261E] text-white w-full" 
          variant="default"
          onClick={(e) => {
            e.stopPropagation();
            setLocation(`/p/${id}`);
          }}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
