import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Loader2, 
  Heart, 
  Search, 
  Home, 
  Filter, 
  ArrowUpDown, 
  ChevronDown,
  X,
  Grid,
  List
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Property {
  id: string;
  title: string;
  address: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  imageUrl: string;
  thumbnail: string;
  status: string;
  createdAt: string;
  propertyType?: string;
  yearBuilt?: number;
}

// Empty state component
const Empty = ({ 
  title, 
  description, 
  icon = "heart", 
  action 
}: { 
  title: string; 
  description: string; 
  icon?: "heart" | "home" | "search"; 
  action?: { label: string; onClick: () => void } 
}) => {
  const getIcon = () => {
    switch (icon) {
      case "heart":
        return <Heart className="h-12 w-12 text-gray-300" />;
      case "home":
        return <Home className="h-12 w-12 text-gray-300" />;
      case "search":
        return <Search className="h-12 w-12 text-gray-300" />;
      default:
        return <Heart className="h-12 w-12 text-gray-300" />;
    }
  };

  return (
    <Card className="w-full border border-gray-200">
      <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          {getIcon()}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6 max-w-md">{description}</p>
        {action && (
          <Button 
            onClick={action.onClick}
            className="bg-[#09261E] hover:bg-[#135341] text-white"
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default function FavoritesPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("recently-added");
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Example properties when user has no favorites
  const exampleProperties = [
    {
      id: "example-1",
      title: "Modern Downtown Condo",
      address: "123 Main Street, Downtown",
      price: "$485,000",
      beds: 2,
      baths: 2,
      sqft: "1,250",
      status: "For Sale",
      thumbnail: "/api/placeholder/400/300",
      createdAt: new Date().toISOString()
    },
    {
      id: "example-2", 
      title: "Suburban Family Home",
      address: "456 Oak Avenue, Riverside",
      price: "$675,000",
      beds: 4,
      baths: 3,
      sqft: "2,100",
      status: "For Sale",
      thumbnail: "/api/placeholder/400/300",
      createdAt: new Date().toISOString()
    },
    {
      id: "example-3",
      title: "Investment Duplex",
      address: "789 Pine Street, Westside", 
      price: "$395,000",
      beds: 3,
      baths: 2,
      sqft: "1,800",
      status: "For Sale",
      thumbnail: "/api/placeholder/400/300",
      createdAt: new Date().toISOString()
    }
  ];

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

  // Use example properties if user has no favorites
  const displayProperties = favoriteProperties && favoriteProperties.length > 0 
    ? favoriteProperties 
    : exampleProperties;

  // Apply client-side filtering and sorting
  const filteredProperties = React.useMemo(() => {
    if (!displayProperties) return [];
    
    let result = [...displayProperties];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        property => 
          property.title.toLowerCase().includes(query) || 
          property.address.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (filterStatus.length > 0) {
      result = result.filter(
        property => filterStatus.some(status => 
          property.status?.toLowerCase() === status.toLowerCase()
        )
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-high-low':
        result.sort((a, b) => {
          const priceA = typeof a.price === 'string' ? parseInt(a.price.replace(/[^0-9]/g, '')) : a.price;
          const priceB = typeof b.price === 'string' ? parseInt(b.price.replace(/[^0-9]/g, '')) : b.price;
          return priceB - priceA;
        });
        break;
      case 'price-low-high':
        result.sort((a, b) => {
          const priceA = typeof a.price === 'string' ? parseInt(a.price.replace(/[^0-9]/g, '')) : a.price;
          const priceB = typeof b.price === 'string' ? parseInt(b.price.replace(/[^0-9]/g, '')) : b.price;
          return priceA - priceB;
        });
        break;
      case 'beds-high-low':
        result.sort((a, b) => b.beds - a.beds);
        break;
      case 'sqft-high-low':
        result.sort((a, b) => b.sqft - a.sqft);
        break;
      case 'recently-added':
      default:
        // Sort by createdAt (newest first)
        result.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
    }
    
    return result;
  }, [displayProperties, searchQuery, filterStatus, sortBy]);

  // Add a filter to the active filters
  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  // Remove a filter from active filters
  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters([]);
    setFilterStatus('all');
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <div className="container py-8 pl-20">
        <div className="max-w-screen-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
          <p className="text-gray-500 mb-6">Loading your favorite properties...</p>
          
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 pl-20">
        <div className="max-w-screen-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
          <p className="text-gray-500 mb-6">We encountered an error while loading your favorite properties.</p>
          
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

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get user name
  const userName = user?.fullName || user?.username || "there";

  return (
    <div className="container py-8 pl-20">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header with greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{getGreeting()}, {userName}</h1>
          <p className="text-gray-500">
            You have {filteredProperties.length} favorite {filteredProperties.length === 1 ? 'property' : 'properties'} saved.
          </p>
        </div>
        
        {/* Filters and sorting */}
        <div className="bg-white rounded-lg border mb-8 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4 mt-[0px] mb-[0px]">
            {/* Search */}
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by title or address"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem 
                    onClick={() => setFilterStatus("all")}
                    className={`hover:bg-gray-100 focus:bg-gray-100 ${filterStatus === "all" ? "bg-[#135341] text-white hover:bg-[#135341] focus:bg-[#135341]" : ""}`}
                  >
                    All Properties
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilterStatus("for sale")}
                    className={`hover:bg-gray-100 focus:bg-gray-100 ${filterStatus === "for sale" ? "bg-[#135341] text-white hover:bg-[#135341] focus:bg-[#135341]" : ""}`}
                  >
                    For Sale
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilterStatus("pending")}
                    className={`hover:bg-gray-100 focus:bg-gray-100 ${filterStatus === "pending" ? "bg-[#135341] text-white hover:bg-[#135341] focus:bg-[#135341]" : ""}`}
                  >
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilterStatus("sold")}
                    className={`hover:bg-gray-100 focus:bg-gray-100 ${filterStatus === "sold" ? "bg-[#135341] text-white hover:bg-[#135341] focus:bg-[#135341]" : ""}`}
                  >
                    Sold
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilterStatus("off market")}
                    className={`hover:bg-gray-100 focus:bg-gray-100 ${filterStatus === "off market" ? "bg-[#135341] text-white hover:bg-[#135341] focus:bg-[#135341]" : ""}`}
                  >
                    Off Market
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem 
                    onClick={() => setSortBy("recently-added")}
                    className={`hover:bg-gray-100 focus:bg-gray-100 ${sortBy === "recently-added" ? "bg-[#135341] text-white hover:bg-[#135341] focus:bg-[#135341]" : ""}`}
                  >
                    Recently Added
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setSortBy("price-high-low")}
                    className={`hover:bg-gray-100 focus:bg-gray-100 ${sortBy === "price-high-low" ? "bg-[#135341] text-white hover:bg-[#135341] focus:bg-[#135341]" : ""}`}
                  >
                    Price (High to Low)
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy("price-low-high")}
                    className={`hover:bg-gray-100 focus:bg-gray-100 ${sortBy === "price-low-high" ? "bg-[#135341] text-white hover:bg-[#135341] focus:bg-[#135341]" : ""}`}
                  >
                    Price (Low to High)
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setSortBy("beds-high-low")}
                    className={`hover:bg-gray-100 focus:bg-gray-100 ${sortBy === "beds-high-low" ? "bg-[#135341] text-white hover:bg-[#135341] focus:bg-[#135341]" : ""}`}
                  >
                    Beds (Most first)
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy("sqft-high-low")}
                    className={`hover:bg-gray-100 focus:bg-gray-100 ${sortBy === "sqft-high-low" ? "bg-[#135341] text-white hover:bg-[#135341] focus:bg-[#135341]" : ""}`}
                  >
                    Square Feet (Largest first)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* View toggle */}
              <div className="flex bg-gray-100 rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center justify-center h-8 w-8 rounded-md transition-all duration-200 ${viewMode === "grid" ? "bg-[#09261E] text-white" : "bg-transparent text-gray-500 hover:bg-gray-200"}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center justify-center h-8 w-8 rounded-md transition-all duration-200 ${viewMode === "list" ? "bg-[#09261E] text-white" : "bg-transparent text-gray-500 hover:bg-gray-200"}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Active filters */}
          {(searchQuery || filterStatus !== 'all' || activeFilters.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-gray-500">Active filters:</span>
              
              {searchQuery && (
                <Badge variant="outline" className="flex items-center gap-1 rounded-full px-3 py-1">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery('')} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {filterStatus !== 'all' && (
                <Badge variant="outline" className="flex items-center gap-1 rounded-full px-3 py-1">
                  Status: {filterStatus}
                  <button onClick={() => setFilterStatus('all')} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {activeFilters.map(filter => (
                <Badge key={filter} variant="outline" className="flex items-center gap-1 rounded-full px-3 py-1">
                  {filter}
                  <button onClick={() => removeFilter(filter)} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              {(searchQuery || filterStatus !== 'all' || activeFilters.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
                  onClick={clearFilters}
                >
                  Clear all
                </Button>
              )}
            </div>
          )}
        </div>
        
        {filteredProperties.length === 0 ? (
          <Empty 
            title="No properties match your filters"
            description="Try adjusting your search criteria to find more properties."
            icon="search"
            action={{
              label: "Clear Filters",
              onClick: clearFilters
            }}
          />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property: Property) => (
              <Link key={property.id} href={`/properties/${property.id}`}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow border cursor-pointer h-full">
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <Badge className={`absolute top-2 left-2 ${getStatusBadgeColor(property.status)}`}>
                      {property.status || 'For Sale'}
                    </Badge>
                    <img 
                      src={property.thumbnail} 
                      alt={property.title}
                      className="h-full w-full object-cover transform transition-transform duration-500 hover:scale-105"
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
        ) : (
          <div className="space-y-6">
            {filteredProperties.map((property: Property) => (
              <Link key={property.id} href={`/properties/${property.id}`}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow border cursor-pointer">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-1/3 h-48 bg-gray-200 overflow-hidden">
                      <Badge className={`absolute top-2 left-2 ${getStatusBadgeColor(property.status)}`}>
                        {property.status || 'For Sale'}
                      </Badge>
                      <img 
                        src={property.thumbnail} 
                        alt={property.title}
                        className="h-full w-full object-cover transform transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e2e8f0/1e293b?text=Property+Image';
                        }}
                      />
                    </div>
                    <div className="p-5 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-1">{property.title}</CardTitle>
                          <CardDescription className="mb-3">{property.address}</CardDescription>
                        </div>
                        <div className="text-xl font-bold text-[#09261E]">
                          {formatCurrency(property.price)}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        <div>
                          <div className="text-sm text-gray-500">Beds</div>
                          <div className="font-medium">{property.beds}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Baths</div>
                          <div className="font-medium">{property.baths}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Sq Ft</div>
                          <div className="font-medium">{property.sqft.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Type</div>
                          <div className="font-medium">{property.propertyType || "Residential"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}