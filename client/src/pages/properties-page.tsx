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
import { MapPin, List, LayoutGrid } from "lucide-react";

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

  // Define property category tabs
  const propertyTabs = [
    { value: "all", label: "All" },
    { value: "single-family", label: "Single Family" },
    { value: "multi-family", label: "Multi Family" },
    { value: "condo", label: "Condo" },
    { value: "townhouse", label: "Townhouse" },
    { value: "land", label: "Land" }
  ];
  
  // Define Filter Modal Content
  const filterContent = (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2 text-sm text-gray-700">TIER</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'general', label: 'General' },
            { id: 'exclusive', label: 'Exclusive' }
          ].map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`tier-${type.id}`} 
                checked={filters.tier === type.id}
                onCheckedChange={() => setFilters({
                  ...filters,
                  tier: filters.tier === type.id ? '' : type.id
                })}
              />
              <label
                htmlFor={`tier-${type.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2 text-sm text-gray-700">INVESTMENT TYPE</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'flip', label: 'Flip' },
            { id: 'buy-hold', label: 'Buy and Hold' }
          ].map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`investment-${type.id}`} 
                checked={filters.investmentType === type.id}
                onCheckedChange={() => setFilters({
                  ...filters,
                  investmentType: filters.investmentType === type.id ? '' : type.id
                })}
              />
              <label
                htmlFor={`investment-${type.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2 text-sm text-gray-700">PROPERTY TYPE</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'single-family', label: 'Single Family' },
            { id: 'multi-family', label: 'Multi Family' },
            { id: 'condo', label: 'Condo' },
            { id: 'townhouse', label: 'Townhouse' },
            { id: 'land', label: 'Land' }
          ].map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`prop-${type.id}`} 
                checked={filters.propertyType === type.id}
                onCheckedChange={() => setFilters({
                  ...filters,
                  propertyType: filters.propertyType === type.id ? '' : type.id
                })}
              />
              <label
                htmlFor={`prop-${type.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2 text-sm text-gray-700">PRICE RANGE</h4>
        <div className="space-y-4">
          <div className="pt-4">
            <Slider 
              defaultValue={[0, 1000000]} 
              max={10000000} 
              step={50000} 
              onValueChange={(values) => {
                setFilters({
                  ...filters,
                  priceRange: `${values[0]}-${values[1]}`
                });
              }}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Min"
                className="w-full"
                onChange={(e) => {
                  const min = e.target.value ? parseInt(e.target.value) : 0;
                  const [, max] = filters.priceRange.split('-').map(Number);
                  setFilters({
                    ...filters,
                    priceRange: `${min}-${max || 10000000}`
                  });
                }}
              />
            </div>
            <span className="text-gray-500">—</span>
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Max"
                className="w-full"
                onChange={(e) => {
                  const max = e.target.value ? parseInt(e.target.value) : 10000000;
                  const [min] = filters.priceRange.split('-').map(Number);
                  setFilters({
                    ...filters,
                    priceRange: `${min || 0}-${max}`
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => {
          setFilters({
            priceRange: "",
            beds: "",
            baths: "",
            status: "",
            tier: "",
            investmentType: "",
            propertyType: ""
          });
        }}>
          Clear All
        </Button>
        <Button className="bg-[#09261E] hover:bg-[#135341]">Apply Filters</Button>
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
        tabs={propertyTabs}
        onTabChange={(value) => setFilters({...filters, propertyType: value === 'all' ? '' : value})}
        defaultTab="all"
        filterContent={filterContent}
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