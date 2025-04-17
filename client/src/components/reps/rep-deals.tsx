import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  Tag, 
  MapPin, 
  Calendar, 
  DollarSign, 
  PackageCheck, 
  PackageOpen,
  Info,
  ArrowUpRight,
  Clock,
  Award
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RepDealsProps {
  listings: any[];
  deals: any[];
  repId: number;
}

export default function RepDeals({ listings, deals, repId }: RepDealsProps) {
  // Convert to actual arrays if they're not
  const listingsArray = Array.isArray(listings) ? listings : [];
  const dealsArray = Array.isArray(deals) ? deals : [];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate how many days ago a date was
  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Recently";
    }
  };

  // Status badge styling
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'off-market':
        return "bg-purple-100 text-purple-800 border-purple-200";
      case 'exclusive':
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 'for sale':
        return "bg-green-100 text-green-800 border-green-200";
      case 'pending':
        return "bg-amber-100 text-amber-800 border-amber-200";
      case 'sold':
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Condition badge styling
  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'turnkey':
        return "bg-green-100 text-green-800 border-green-200";
      case 'light rehab':
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 'medium rehab':
        return "bg-amber-100 text-amber-800 border-amber-200";
      case 'heavy rehab':
        return "bg-orange-100 text-orange-800 border-orange-200";
      case 'major rehab':
        return "bg-red-100 text-red-800 border-red-200";
      case 'historic rehab':
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Render deal card
  const renderDealCard = (deal: any, isDeal = false) => {
    const property = deal.property || deal;
    const listed = property.listedDate || deal.listedDate || property.createdAt || deal.createdAt;
    const addressString = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`;

    return (
      <Card key={property.id} className="overflow-hidden transition-all hover:shadow-md">
        <div className="relative h-48 overflow-hidden bg-muted">
          {property.imageUrl ? (
            <img 
              src={property.imageUrl} 
              alt={property.title} 
              className="h-full w-full object-cover" 
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Home className="h-12 w-12 text-muted-foreground opacity-50" />
            </div>
          )}
          
          {/* Status badge */}
          {property.status && (
            <Badge 
              className={`absolute top-2 left-2 rounded-sm ${getStatusColor(property.status)}`}
              variant="outline"
            >
              {property.status}
            </Badge>
          )}
          
          {isDeal && (
            <Badge 
              className="absolute top-2 right-2 rounded-sm bg-green-100 text-green-800 border-green-200"
              variant="outline"
            >
              <Award className="h-3 w-3 mr-1" />
              Closed Deal
            </Badge>
          )}
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-1">{property.title}</CardTitle>
            <span className="font-bold text-lg whitespace-nowrap">{formatCurrency(property.price)}</span>
          </div>
          <CardDescription className="line-clamp-1 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 inline-block text-muted-foreground" />
            {addressString}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="grid grid-cols-3 gap-2 text-center text-sm my-2">
            <div>
              <span className="block font-medium">{property.bedrooms || 0}</span>
              <span className="text-muted-foreground text-xs">Beds</span>
            </div>
            <div>
              <span className="block font-medium">{property.bathrooms || 0}</span>
              <span className="text-muted-foreground text-xs">Baths</span>
            </div>
            <div>
              <span className="block font-medium">{property.squareFeet?.toLocaleString() || 0}</span>
              <span className="text-muted-foreground text-xs">Sq Ft</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {property.condition && (
              <Badge 
                variant="outline" 
                className={`text-xs ${getConditionColor(property.condition)}`}
              >
                {property.condition}
              </Badge>
            )}
            
            {property.propertyType && (
              <Badge 
                variant="outline" 
                className="text-xs bg-gray-100 text-gray-800 border-gray-200"
              >
                {property.propertyType}
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {getTimeAgo(listed)}
          </div>
          
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            View Details
            <ArrowUpRight className="h-3 w-3 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div>
      <Tabs defaultValue="active">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Home className="h-5 w-5" />
            Properties
          </h2>
          
          <TabsList>
            <TabsTrigger value="active" className="flex items-center gap-1">
              <PackageOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Active</span> 
              <Badge variant="secondary" className="ml-1">{listingsArray.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="previous" className="flex items-center gap-1">
              <PackageCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
              <Badge variant="secondary" className="ml-1">{dealsArray.length}</Badge>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="active">
          {listingsArray.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listingsArray.map((listing) => renderDealCard(listing))}
            </div>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Info className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Active Listings</h3>
                <p className="text-muted-foreground max-w-md">
                  This REP doesn't have any active property listings at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="previous">
          {dealsArray.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dealsArray.map((deal) => renderDealCard(deal, true))}
            </div>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Info className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Previous Deals</h3>
                <p className="text-muted-foreground max-w-md">
                  This REP hasn't closed any deals on the platform yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}