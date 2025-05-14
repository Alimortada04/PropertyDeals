import React from "react";
import { 
  Card, 
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Users, Clock, MoreHorizontal, FileText, Send, Edit, ExternalLink, Globe } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/utils";
import { Link, useLocation } from "wouter";

// Define property status types
type PropertyStatus = 'Live' | 'Under Contract' | 'Closed' | 'Assigned';

// Define property card props
interface PropertyCardProps {
  id: string;
  userId: string;
  title: string;
  address: string;
  status: PropertyStatus;
  image: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  arv: number;
  views: number;
  leads: number;
  daysOnMarket: number;
  offers: number;
}

export function PropertyCard({
  id,
  userId,
  title,
  address,
  status,
  image,
  price,
  beds,
  baths,
  sqft,
  arv,
  views,
  leads,
  daysOnMarket,
  offers
}: PropertyCardProps) {
  // For navigation
  const [, setLocation] = useLocation();
  
  // Define status badge color function
  const getStatusBadgeClass = (status: PropertyStatus) => {
    switch (status) {
      case 'Live':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Under Contract':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'Assigned':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Format numbers with thousands separators
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Define link to property detail page
  const propertyDetailUrl = `/sellerdash/${userId}/property/${id}`;
  
  // Handle card click to navigate to property detail page
  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if the click wasn't on a button or dropdown
    if (
      !(e.target as HTMLElement).closest('button') && 
      !(e.target as HTMLElement).closest('[role="menu"]')
    ) {
      setLocation(propertyDetailUrl);
    }
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.01] bg-white border border-gray-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        {/* Property image */}
        <img 
          src={image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop'} 
          alt={title}
          className="w-full h-48 object-cover" 
        />
        
        {/* Top badges */}
        <div className="absolute top-3 left-3">
          <Badge className={`px-3 py-1 font-medium ${getStatusBadgeClass(status)}`}>
            {status}
          </Badge>
        </div>
        
        <div className="absolute top-3 right-3">
          <Badge className="bg-gray-800/70 text-white hover:bg-gray-800/80 px-2 py-1">
            Views: {views}
          </Badge>
        </div>
      </div>
      
      <CardContent className="pt-4">
        {/* Property title and address */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{title}</h3>
          <p className="text-sm text-gray-600 line-clamp-1">{address}</p>
        </div>
        
        {/* Property specs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-gray-50 font-normal">
            {beds} bed
          </Badge>
          <Badge variant="outline" className="bg-gray-50 font-normal">
            {baths} bath
          </Badge>
          <Badge variant="outline" className="bg-gray-50 font-normal">
            {formatNumber(sqft)} sqft
          </Badge>
          <TooltipProvider delayDuration={0}>
            <Tooltip defaultOpen={false}>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-gray-50 font-normal cursor-help relative">
                  ARV: {formatCurrency(arv)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                sideOffset={10}
                align="center"
                className="z-[100] shadow-md bg-black/90 text-white border-0 backdrop-blur-md"
              >
                <div className="p-3 min-w-[220px]">
                  <p className="font-medium text-white">After Repair Value</p>
                  <p className="text-sm text-gray-200">Estimated value of the property after renovations</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Property price */}
        <div className="flex justify-end mb-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip defaultOpen={false}>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-gray-50 font-medium text-green-700 cursor-help relative">
                  {formatCurrency(price)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                sideOffset={10}
                align="center"
                className="z-[100] shadow-md bg-black/90 text-white border-0 backdrop-blur-md"
              >
                <div className="p-3 min-w-[220px]">
                  <p className="font-medium text-white">Listing Price</p>
                  <p className="text-sm text-gray-200">Current asking price for this property</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
      
      {/* Stats footer */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-600">
            <Eye className="h-4 w-4" />
            <span>{views}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Users className="h-4 w-4" />
            <span>{leads}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{daysOnMarket} days</span>
          </div>
        </div>
      </div>
      
      <CardFooter className="flex items-center justify-between gap-2 pt-2 pb-4 px-6">
        {/* Action buttons - now full width with 3 buttons */}
        <div className="grid grid-cols-3 gap-2 w-full">
          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-gray-700 hover:bg-gray-100 focus:ring-0 transition-all group relative overflow-hidden"
              >
                <div className="flex items-center relative z-20">
                  <MoreHorizontal className="h-4 w-4 mr-1 text-gray-700 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="text-gray-700">Actions</span>
                </div>
                <span className="absolute inset-0 bg-gray-100 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 z-10"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[180px]">
              <DropdownMenuItem 
                onClick={(e) => e.stopPropagation()}
                className="hover:bg-gray-100 focus:bg-gray-100 focus:text-[#135341] text-gray-700 cursor-pointer transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => e.stopPropagation()}
                className="hover:bg-gray-100 focus:bg-gray-100 focus:text-[#135341] text-gray-700 cursor-pointer transition-colors"
              >
                <Send className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => e.stopPropagation()}
                className="hover:bg-gray-100 focus:bg-gray-100 focus:text-[#135341] text-gray-700 cursor-pointer transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Pipeline
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => e.stopPropagation()}
                className="hover:bg-gray-100 focus:bg-gray-100 focus:text-[#135341] text-gray-700 cursor-pointer transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => e.stopPropagation()}
                className="hover:bg-gray-100 focus:bg-gray-100 focus:text-[#135341] text-gray-700 cursor-pointer transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Wine-colored Market button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-[#803344] border-[#803344] bg-white hover:bg-[#803344] hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setLocation(`${propertyDetailUrl}?tab=marketing`);
            }}
          >
            <Globe className="h-4 w-4 mr-1" />
            Market
          </Button>
          
          {/* Primary button: Offers */}
          <Button 
            variant="default" 
            size="sm" 
            className="w-full bg-[#135341] hover:bg-[#09261E] text-white"
            onClick={(e) => {
              e.stopPropagation();
              setLocation(`${propertyDetailUrl}?tab=offers`);
            }}
          >
            Offers ({offers})
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}