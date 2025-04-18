import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Calculator, 
  Cog,
  DollarSign,
  BarChart3,
  FileText,
  TrendingUp,
  ArrowRightLeft
} from "lucide-react";

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
  inputs?: string[];
  outputs?: string[];
  functionType?: "calculator" | "analyzer" | "estimator" | "split";
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
    coverImage,
    inputs = [],
    outputs = [],
    functionType = "calculator"
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

  // Get function type icon
  const getFunctionTypeIcon = () => {
    switch (functionType) {
      case "calculator":
        return <Calculator size={18} />;
      case "analyzer":
        return <BarChart3 size={18} />;
      case "estimator":
        return <FileText size={18} />;
      case "split":
        return <ArrowRightLeft size={18} />;
      default:
        return <Calculator size={18} />;
    }
  };

  // Function type label
  const getFunctionTypeLabel = () => {
    return functionType.charAt(0).toUpperCase() + functionType.slice(1);
  };

  const cardUrl = !isComingSoon && path ? path : undefined;
  
  return (
    <div 
      className={cn(
        "relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:scale-105 transition-all flex flex-col border-2 border-[#E5E7EB] h-[350px]",
        cardUrl ? "cursor-pointer" : "cursor-default",
        !isComingSoon && "hover:border-[#09261E]"
      )}
      onClick={() => cardUrl && (window.location.href = cardUrl)}
    >
      {/* Cover Image with Gradient Overlay */}
      <div className="relative w-full h-48">
        {/* Tool Type Badge */}
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-[#135341]/90 text-white border-none px-2 py-1 flex items-center gap-1.5">
            {getFunctionTypeIcon()}
            <span>{getFunctionTypeLabel()}</span>
          </Badge>
        </div>
        
        {/* Gradient Utility Strip */}
        <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-r from-[#E1F5EE] to-[#F0F9FF] z-0"></div>
        
        <img 
          src={coverImage || getDefaultCoverImage()}
          alt={title}
          className="w-full h-full object-cover z-0"
        />
        
        {/* Status Badges */}
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
        
        {/* Tool Icon */}
        <div className="absolute bottom-0 right-0 p-2 bg-[#09261E]/90 text-white rounded-tl-xl">
          {icon}
        </div>
      </div>
      
      {/* Utility Icon Strip */}
      <div className="flex items-center justify-center gap-2 bg-[#F9FAFB] py-2 border-y border-[#E5E7EB]">
        <Cog size={14} className="text-gray-500" />
        <Calculator size={14} className="text-gray-500" />
        <DollarSign size={14} className="text-gray-500" />
        <TrendingUp size={14} className="text-gray-500" />
      </div>
      
      {/* Card Content */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-semibold text-[#09261E] mb-2">{title}</h3>
        
        {/* Description text */}
        <p className="text-xs text-gray-600 mb-auto">
          {description}
        </p>
        
        {/* Tags at bottom */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-[#E5E7EB]">
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
      </div>
      
      {/* Hover Preview - Only visible on hover */}
      {!isComingSoon && (
        <div className="absolute inset-0 bg-black/75 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 p-4">
          <div className="bg-white rounded-lg p-3 max-w-[90%]">
            <h4 className="font-semibold text-sm mb-2 text-[#09261E]">Quick Preview</h4>
            <p className="text-xs text-gray-700 mb-2">
              Example: Input ARV $300k, Repairs $50k → Output: Max Offer $165k
            </p>
            <Button 
              className="w-full bg-[#09261E] hover:bg-[#135341] text-white px-4 py-1 text-xs font-medium"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = path;
              }}
            >
              Try It Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}