import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface PlaybookResource {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  path?: string;
  audience: string[];
  isComingSoon?: boolean;
  updatedAt?: string;
  isTrending?: boolean;
  // New field for image URL
  coverImage?: string;
}

interface PlaybookCardProps {
  resource: PlaybookResource;
}

export default function PlaybookCard({ resource }: PlaybookCardProps) {
  const {
    icon,
    title,
    description,
    path,
    isComingSoon,
    updatedAt,
    isTrending,
    audience,
    coverImage
  } = resource;

  // Default cover image URLs based on audience
  const getDefaultCoverImage = () => {
    if (audience.includes("buyers")) {
      return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60";
    } else if (audience.includes("sellers")) {
      return "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60";
    } else if (audience.includes("reps")) {
      return "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60";
    } else {
      return "https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60";
    }
  };

  const cardUrl = !isComingSoon && path ? path : undefined;

  // Determine audience tags to display
  const audienceTags = audience.filter(tag => tag !== "general");

  return (
    <div 
      className={cn(
        "bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] max-w-sm h-full flex flex-col",
        cardUrl ? "cursor-pointer" : "cursor-default"
      )}
      onClick={() => cardUrl && (window.location.href = cardUrl)}
    >
      {/* Cover Image (Top 40%) */}
      <div className="relative w-full h-32 lg:h-40">
        <img 
          src={coverImage || getDefaultCoverImage()}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-0 left-0 p-2 flex flex-col gap-2">
          {isComingSoon && (
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none">
              Coming Soon
            </Badge>
          )}
          {isTrending && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white border-none">
              🔥 Trending
            </Badge>
          )}
        </div>
        
        {/* Resource Type Icon - Absolute positioned on image */}
        <div className="absolute bottom-0 right-0 p-2 bg-[#09261E]/80 text-white rounded-tl-xl">
          {icon}
        </div>
      </div>
      
      {/* Card Content (Bottom 60%) */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-semibold text-[#09261E] mb-2">{title}</h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        
        {/* Tags */}
        {audienceTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {audienceTags.map(tag => (
              <Badge 
                key={tag} 
                variant="outline"
                className="text-xs bg-[#E9F5F0] text-[#09261E] border-[#09261E]/20"
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Updated date if available */}
        {updatedAt && (
          <p className="text-xs text-gray-400 mt-auto mb-3">
            Updated {updatedAt}
          </p>
        )}
        
        {/* CTA Button */}
        <div className="mt-auto">
          {isComingSoon ? (
            <Button 
              className="w-full bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-not-allowed"
              disabled
            >
              Coming Soon
            </Button>
          ) : (
            path && (
              <Link href={path}>
                <Button 
                  className="w-full bg-[#09261E] hover:bg-[#135341] text-white px-4 py-2 text-sm"
                  onClick={(e) => e.stopPropagation()} // Prevent event bubbling
                >
                  View Resource
                </Button>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}