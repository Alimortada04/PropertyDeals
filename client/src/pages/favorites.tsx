import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Empty } from "@/components/common/empty";
import { supabase } from "@/lib/supabase";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Property {
  id: string;
  title: string;
  address: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  imageUrl: string;
  status: string;
  createdAt: string;
}

export default function FavoritesPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch user's favorited properties from Supabase
  const { data: favoriteProperties, isLoading, error } = useQuery({
    queryKey: ['/favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];

      try {
        // Get user's favorites from Supabase
        const { data: favorites, error: favoritesError } = await supabase
          .from('property_favorites')
          .select('property_id')
          .eq('user_id', user.id);

        if (favoritesError) throw favoritesError;
        
        if (!favorites || favorites.length === 0) {
          return [];
        }

        // Get the actual property details
        const propertyIds = favorites.map(fav => fav.property_id);
        
        // Fetch properties details from your API
        const response = await fetch('/api/properties');
        const allProperties = await response.json();
        
        // Filter only the favorited properties
        return allProperties.filter((property: Property) => 
          propertyIds.includes(property.id)
        );
      } catch (error) {
        console.error('Error fetching favorite properties:', error);
        return [];
      }
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-5">
                <Skeleton className="h-5 w-2/3 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>
        <Card className="p-6 text-center">
          <CardTitle className="text-red-500 mb-2">Error Loading Favorites</CardTitle>
          <CardDescription>
            We couldn't load your favorite properties. Please try again later.
          </CardDescription>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  if (!favoriteProperties || favoriteProperties.length === 0) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>
        <Empty 
          title="No favorites yet"
          description="Properties you save will appear here. Start browsing to find properties you love."
          icon="heart"
          action={{
            label: "Browse Properties",
            onClick: () => setLocation("/properties")
          }}
        />
      </div>
    );
  }

  // Helper function to format currency
  const formatCurrency = (price: string | number) => {
    if (typeof price === 'string' && price.includes('$')) return price;
    
    const numericPrice = typeof price === 'string' 
      ? parseInt(price.replace(/[^0-9]/g, '')) 
      : price;
      
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(numericPrice);
  };

  // Helper to get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'for sale':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'sold':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'off market':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteProperties.map((property: Property) => (
          <Link key={property.id} href={`/properties/${property.id}`}>
            <Card className="overflow-hidden hover:shadow-md transition-shadow border cursor-pointer h-full">
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <Badge className={`absolute top-2 left-2 ${getStatusBadgeColor(property.status)}`}>
                  {property.status || 'For Sale'}
                </Badge>
                <img 
                  src={property.imageUrl} 
                  alt={property.title}
                  className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e2e8f0/1e293b?text=Property+Image';
                  }}
                />
              </div>
              <CardContent className="p-5">
                <CardTitle className="text-xl mb-1 line-clamp-1">{property.title}</CardTitle>
                <CardDescription className="mb-3 line-clamp-1">{property.address}</CardDescription>
                <div className="flex justify-between text-sm">
                  <div className="font-semibold">{formatCurrency(property.price)}</div>
                  <div>{property.beds} beds</div>
                  <div>{property.baths} baths</div>
                  <div>{property.sqft.toLocaleString()} sqft</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}