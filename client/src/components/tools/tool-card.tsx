import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  tags: string[];
  isComingSoon?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  coverImage?: string;
}

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const { 
    title, 
    description, 
    icon, 
    path, 
    tags, 
    isComingSoon, 
    isPopular, 
    isNew,
    coverImage
  } = tool;

  // Default cover image URLs based on category
  const getDefaultCoverImage = () => {
    if (tags.includes("Flips")) {
      return "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60";
    } else if (tags.includes("Buy & Hold")) {
      return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60";
    } else if (tags.includes("Creative Finance")) {
      return "https://images.unsplash.com/photo-1607863680198-23d4b2565df0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3JlYXRpdmUlMjBmaW5hbmNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60";
    } else if (tags.includes("Wholesale")) {
      return "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlYWwlMjBlc3RhdGUlMjBpbnZlc3RtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60";
    } else if (tags.includes("STR")) {
      return "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWlyYm5ifGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60";
    } else {
      return "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60";
    }
  };

  const cardUrl = !isComingSoon && path ? path : undefined;
  
  return (
    <div 
      className={cn(
        "bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:scale-105 transition-all h-full flex flex-col",
        cardUrl ? "cursor-pointer" : "cursor-default"
      )}
      onClick={() => cardUrl && (window.location.href = cardUrl)}
    >
      {/* Cover Image */}
      <div className="relative w-full aspect-[16/9]">
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
          {isPopular && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white border-none">
              🔥 Popular
            </Badge>
          )}
          {isNew && (
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none">
              New
            </Badge>
          )}
        </div>
        
        {/* Tool Icon - Absolute positioned on image */}
        <div className="absolute bottom-0 right-0 p-2 bg-[#09261E]/80 text-white rounded-tl-xl">
          {icon}
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-semibold text-[#09261E] mb-2">{title}</h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map(tag => (
              <Badge 
                key={tag} 
                variant="outline"
                className="text-xs bg-[#E9F5F0] text-[#09261E] border-[#09261E]/20"
              >
                {tag}
              </Badge>
            ))}
          </div>
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
                  Open Tool
                </Button>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}