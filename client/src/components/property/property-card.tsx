import React from "react";
import { 
  Card, 
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOffersInboxModal } from "@/hooks/use-offers-inbox-modal";
import { useMarketingCenterModal } from "@/hooks/use-marketing-center-modal";
import { Eye, Users, Clock, MoreHorizontal, FileText, Send, Edit, ExternalLink, Globe, Megaphone } from "lucide-react";
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

// Define property status types - matching valid database values
type PropertyStatus = 'draft' | 'live' | 'offer_accepted' | 'pending' | 'closed' | 'dropped';

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
  
  // For opening offers inbox modal
  const offersInboxModal = useOffersInboxModal();
  const marketingCenterModal = useMarketingCenterModal();
  
  // Define status badge color function with exact color specifications
  const getStatusBadgeClass = (status: PropertyStatus) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
      case 'live':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      case 'offer_accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200';
      case 'closed':
        return 'bg-green-800 text-white border-green-800 hover:bg-green-900';
      case 'dropped':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200';
    }
  };

  // Function to capitalize and format status labels
  const formatStatusLabel = (status: PropertyStatus): string => {
    const statusMap: Record<PropertyStatus, string> = {
      'draft': 'Draft',
      'live': 'Live',
      'offer_accepted': 'Offer Accepted',
      'pending': 'Pending',
      'closed': 'Closed',
      'dropped': 'Dropped'
    };
    
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
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
          <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(status)}`}>
            {formatStatusLabel(status)}
          </span>
        </div>
        
        <div className="absolute top-3 right-3">
          <Badge className="bg-gray-800/70 text-white hover:bg-gray-800/80 px-2 py-1">
            Views: {views}
          </Badge>
        </div>
      </div>
      <CardContent className="pt-3 pb-2">
        {/* Property title and address */}
        <div className="mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{title}</h3>
          <p className="text-sm text-gray-600 line-clamp-1">{address}</p>
        </div>
        
        {/* Property specs - hide bed/bath/sqft on mobile */}
        <div className="flex flex-wrap gap-2 mb-2">
          <div className="hidden md:flex gap-2">
            <Badge variant="outline" className="bg-gray-50 font-normal">
              {beds} bed
            </Badge>
            <Badge variant="outline" className="bg-gray-50 font-normal">
              {baths} bath
            </Badge>
            <Badge variant="outline" className="bg-gray-50 font-normal">
              {formatNumber(sqft)} sqft
            </Badge>
          </div>
          
          {/* Listing Price and Deal Value (Assignment Fee) on the same line */}
          <div className="flex gap-2 w-full">
            <TooltipProvider delayDuration={0}>
              <Tooltip defaultOpen={false}>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="bg-gray-50 font-medium text-gray-900 cursor-help relative">
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
            
            <TooltipProvider delayDuration={0}>
              <Tooltip defaultOpen={false}>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="bg-gray-50 font-medium text-green-700 cursor-help relative">
                    +{formatCurrency(arv - price)}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  sideOffset={10}
                  align="center"
                  className="z-[100] shadow-md bg-black/90 text-white border-0 backdrop-blur-md"
                >
                  <div className="p-3 min-w-[220px]">
                    <p className="font-medium text-white">Deal Value</p>
                    <p className="text-sm text-gray-200">Assignment fee / profit potential</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
      {/* Stats footer */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-center items-center text-sm pt-[12px] pb-[12px] pl-[12px] pr-[12px]">
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
      <CardFooter className="p-6 flex items-center justify-between gap-2 px-6 pl-[10px] pr-[10px] pt-[5px] pb-[5px]">
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
                  <MoreHorizontal className="h-4 w-4 md:mr-1 text-gray-700 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="text-gray-700 hidden md:inline">Actions</span>
                </div>
                <span className="absolute inset-0 bg-gray-100 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 z-10"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[180px]">
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  setLocation(`/sellerdash/${userId}/property/${id}`);
                }}
                className="hover:bg-gray-100 focus:bg-gray-100 focus:text-[#135341] text-gray-700 cursor-pointer transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`/p/${id}`, '_blank');
                }}
                className="hover:bg-gray-100 focus:bg-gray-100 focus:text-[#135341] text-gray-700 cursor-pointer transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  const propertyUrl = `${window.location.origin}/p/${id}`;
                  navigator.clipboard.writeText(propertyUrl);
                  // You can add a toast notification here if desired
                }}
                className="hover:bg-gray-100 focus:bg-gray-100 focus:text-[#135341] text-gray-700 cursor-pointer transition-colors"
              >
                <Send className="h-4 w-4 mr-2" />
                Share
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
              marketingCenterModal.onOpen();
            }}
          >
            <Megaphone className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Market</span>
          </Button>
          
          {/* Primary button: Offers with people icon */}
          <Button 
            variant="default" 
            size="sm" 
            className="w-full bg-[#135341] hover:bg-[#09261E] text-white"
            onClick={(e) => {
              e.stopPropagation();
              offersInboxModal.onOpen(id);
            }}
          >
            <Users className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Offers ({offers})</span>
            <span className="md:hidden">{offers}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}