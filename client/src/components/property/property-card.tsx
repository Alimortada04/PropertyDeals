import React from "react";
import { 
  Card, 
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Users, Clock, MoreHorizontal, FileText, Send } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";
import { Link } from "wouter";

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

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.01] bg-white border border-gray-200">
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
          <Badge variant="outline" className="bg-gray-50 font-normal">
            ARV: {formatCurrency(arv)}
          </Badge>
        </div>
        
        {/* Property price */}
        <div className="flex justify-end mb-2">
          <Badge variant="outline" className="bg-gray-50 font-medium text-green-700">
            {formatCurrency(price)}
          </Badge>
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
      
      <CardFooter className="flex flex-wrap gap-2 pt-2 pb-4 px-6">
        {/* Action buttons */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-0 transition-colors"
            >
              <MoreHorizontal className="h-4 w-4 mr-1" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Send className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              View Pipeline
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Link href={propertyDetailUrl}>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-0 transition-colors"
          >
            Details
          </Button>
        </Link>
        
        <Link href={`${propertyDetailUrl}?tab=offers`}>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-0 transition-colors"
          >
            Offers ({offers})
          </Button>
        </Link>
        
        {/* Show Contract button for Under Contract or Closed properties */}
        {(status === 'Under Contract' || status === 'Closed') && (
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-orange-100 text-orange-700 hover:bg-orange-200 hover:text-orange-800 focus:ring-0 border-orange-200 transition-colors"
          >
            Contract
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}