import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import PropertyCard from "@/components/properties/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StickySearchFilter from "@/components/common/sticky-search-filter";
import { allProperties } from "@/lib/data";
import { MapPin, List, LayoutGrid, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FilterOptions {
  priceRange: string;
  beds: string;
  baths: string;
  status: string;
  tier?: string;
  investmentType?: string;
  propertyType?: string;
}

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: "",
    beds: "",
    baths: "",
    status: "",
    tier: "",
    investmentType: "",
    propertyType: ""
  });
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "map" | "list">("grid");
  const propertiesPerPage = 6;

  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  // Fallback data if API fails
  const displayProperties = properties || allProperties;

  // Filter and sort properties
  const filteredProperties = displayProperties.filter(property => {
    // Search filter
    const searchMatch = !searchTerm || 
      property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.zipCode?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price range filter
    let priceMatch = true;
    if (filters.priceRange) {
      if (filters.priceRange === "800000+") {
        priceMatch = (property.price ?? 0) >= 800000;
      } else {
        const [min, max] = filters.priceRange.split('-').map(Number);
        priceMatch = (property.price ?? 0) >= min && (property.price ?? 0) <= (max || Infinity);
      }
    }
    
    // Beds filter
    let bedsMatch = true;
    if (filters.beds) {
      const minBeds = parseInt(filters.beds.replace('+', ''));
      bedsMatch = (property.bedrooms ?? 0) >= minBeds;
    }
    
    // Baths filter
    let bathsMatch = true;
    if (filters.baths) {
      const minBaths = parseInt(filters.baths.replace('+', ''));
      bathsMatch = (property.bathrooms ?? 0) >= minBaths;
    }
    
    // Status filter
    const statusMatch = !filters.status || property.status === filters.status;
    
    return searchMatch && priceMatch && bedsMatch && bathsMatch && statusMatch;
  });
  
  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
    } else if (sortBy === "price-low") {
      return (a.price || 0) - (b.price || 0);
    } else if (sortBy === "price-high") {
      return (b.price || 0) - (a.price || 0);
    }
    return 0;
  });
  
  // Pagination
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = sortedProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy]);

  // We no longer need property tabs since we're using dropdowns
  const propertyTabs: { value: string; label: string; }[] = [];
  
  // Define quick filter dropdowns
  const filterContent = (
    <div className="flex flex-wrap gap-4 justify-start w-full">
      {/* Tier Dropdown */}
      <div className="w-44">
        <Select 
          value={filters.tier || "any"}
          onValueChange={(value) => setFilters({...filters, tier: value === "any" ? "" : value})}
        >
          <SelectTrigger className="border h-9 bg-white">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Tier</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="exclusive">Exclusive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Investment Type Dropdown */}
      <div className="w-44">
        <Select 
          value={filters.investmentType || "any"}
          onValueChange={(value) => setFilters({...filters, investmentType: value === "any" ? "" : value})}
        >
          <SelectTrigger className="border h-9 bg-white">
            <SelectValue placeholder="Investment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Investment</SelectItem>
            <SelectItem value="flip">Flip</SelectItem>
            <SelectItem value="buy-hold">Buy & Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Property Type Dropdown */}
      <div className="w-44">
        <Select 
          value={filters.propertyType || "any"}
          onValueChange={(value) => setFilters({...filters, propertyType: value === "any" ? "" : value})}
        >
          <SelectTrigger className="border h-9 bg-white">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Property</SelectItem>
            <SelectItem value="single-family">Single Family</SelectItem>
            <SelectItem value="multi-family">Multi Family</SelectItem>
            <SelectItem value="condo">Condo</SelectItem>
            <SelectItem value="townhouse">Townhouse</SelectItem>
            <SelectItem value="land">Land</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range Dropdown/Slider */}
      <div className="w-44">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="border h-9 bg-white w-full flex justify-between">
              <span className="text-sm text-gray-500">Price Range</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[320px] p-5">
            <div className="space-y-5">
              <h3 className="font-medium text-sm">Price Range</h3>
              <Slider
                defaultValue={[0, 1000000]}
                min={0}
                max={10000000}
                step={100000}
                onValueChange={(values) => {
                  setFilters({
                    ...filters, 
                    priceRange: `${values[0]}-${values[1]}`
                  });
                }}
              />
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs mb-1 text-gray-500">Min</p>
                  <Input
                    type="text"
                    value={`$${new Intl.NumberFormat().format(parseInt(filters.priceRange?.split('-')?.[0] || "0"))}`}
                    className="h-8"
                    onChange={(e) => {
                      // Parse input if needed
                      const value = e.target.value.replace(/[\$,]/g, '');
                      const min = parseInt(value) || 0;
                      const max = parseInt(filters.priceRange?.split('-')?.[1] || "10000000");
                      setFilters({
                        ...filters,
                        priceRange: `${min}-${max}`
                      });
                    }}
                  />
                </div>
                <div className="pt-5">—</div>
                <div>
                  <p className="text-xs mb-1 text-gray-500">Max</p>
                  <Input
                    type="text"
                    value={`$${new Intl.NumberFormat().format(parseInt(filters.priceRange?.split('-')?.[1] || "10000000"))}`}
                    className="h-8"
                    onChange={(e) => {
                      // Parse input if needed
                      const value = e.target.value.replace(/[\$,]/g, '');
                      const max = parseInt(value) || 10000000;
                      const min = parseInt(filters.priceRange?.split('-')?.[0] || "0");
                      setFilters({
                        ...filters,
                        priceRange: `${min}-${max}`
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
  
  return (
    <div className="container mx-auto px-4 pb-8">
      {/* Page Title - Before sticky search */}
      <div className="pt-4 mb-6">
        <h1 className="text-3xl font-heading font-bold text-[#09261E] mb-2">
          Browse Properties
        </h1>
        <p className="text-gray-600">
          Discover your perfect investment opportunity
        </p>
      </div>
      
      {/* Sticky Search and Filter Section */}
      <StickySearchFilter
        onSearch={setSearchTerm}
        searchPlaceholder="Search by address, city, or zip code..."
        filterContent={
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2 text-sm text-gray-700">LOCATION</h4>
              <Input placeholder="City, State, or Zip" />
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-sm text-gray-700">PRICE RANGE</h4>
              <div className="space-y-4">
                <Slider defaultValue={[0, 1000000]} max={10000000} step={50000} />
                <div className="flex gap-4">
                  <Input placeholder="Min" type="number" />
                  <Input placeholder="Max" type="number" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-sm text-gray-700">FILTERS</h4>
              <div className="grid grid-cols-2 gap-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Investment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flip">Flip</SelectItem>
                    <SelectItem value="rental">Rental</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Family</SelectItem>
                    <SelectItem value="multi">Multi Family</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Beds" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Baths" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        }
        filterButtonText="Filters"
      />
      
      {/* View Toggle and Sort Options */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="text-sm text-gray-600 mb-2 sm:mb-0">
          <span className="font-medium">{filteredProperties.length}</span> properties found
        </div>
        
        <div className="flex items-center gap-4">
          {/* View Toggle - Redfin Style */}
          <div className="border rounded-md overflow-hidden">
            <Button 
              variant="ghost" 
              className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-[#EAF2EF] text-[#09261E]' : 'bg-white text-gray-600'}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button 
              variant="ghost" 
              className={`px-4 py-2 ${viewMode === 'map' ? 'bg-[#EAF2EF] text-[#09261E]' : 'bg-white text-gray-600'}`}
              onClick={() => setViewMode('map')}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Map
            </Button>
          </div>
          
          {/* Sort Dropdown */}
          <div className="flex items-center">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-white border w-40 h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Property Display - Grid or Map View */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
              <Skeleton className="w-full h-48" />
              <div className="p-5">
                <Skeleton className="h-7 w-1/2 mb-2" />
                <Skeleton className="h-5 w-3/4 mb-3" />
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500 mb-2">Error loading properties</p>
          <p className="text-gray-600">Please try again later</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No properties match your search criteria</p>
        </div>
      ) : viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        // Map View - Redfin Style Split Screen
        <div className="flex flex-col md:flex-row h-[calc(100vh-250px)] min-h-[600px] border rounded-md overflow-hidden">
          {/* Left side - scrollable property listings */}
          <div className="w-full md:w-1/2 overflow-y-auto border-r">
            <div className="divide-y">
              {currentProperties.map((property) => (
                <div key={property.id} className="p-4 hover:bg-gray-50">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Right side - map */}
          <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-[#09261E]" />
              <h3 className="text-lg font-medium mb-2">Interactive Map View</h3>
              <p className="text-gray-600">Map integration will display property locations here</p>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(index + 1);
                    }}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}