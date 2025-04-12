import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import PropertyCard from "@/components/properties/property-card";
import PropertyMap from "@/components/properties/property-map";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StickySearchFilter from "@/components/common/sticky-search-filter";
import Breadcrumbs from "@/components/common/breadcrumbs";
import { allProperties } from "@/lib/data";
import { MapPin, List, LayoutGrid, ChevronDown, Grid, Save, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useLocation, Link } from 'wouter';

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
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "map" | "list">("grid");
  const [location, setLocation] = useLocation();
  const [hoveredPropertyId, setHoveredPropertyId] = useState<number | null>(null);
  const propertiesPerPage = viewMode === 'map' ? 12 : 6;
  
  // State for controlling collapsible view controls section
  const [showViewControls, setShowViewControls] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Update URL when view mode changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', viewMode);
    window.history.replaceState({}, '', url.toString());
  }, [viewMode]);

  // Check URL for view mode on initial load
  useEffect(() => {
    const url = new URL(window.location.href);
    const viewParam = url.searchParams.get('view');
    if (viewParam && (viewParam === 'grid' || viewParam === 'map' || viewParam === 'list')) {
      setViewMode(viewParam as "grid" | "map" | "list");
    }
  }, []);
  
  // Handle scroll events to collapse/expand view controls
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide view controls when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY + 5) {
        // Scrolling down
        setShowViewControls(false);
      } else if (currentScrollY < lastScrollY - 5) {
        // Scrolling up
        setShowViewControls(true);
      }
      
      // Save current scroll position
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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
  
  // Update the activeFilters state when filters change
  useEffect(() => {
    const newActiveFilters: string[] = [];
    
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (max) {
        newActiveFilters.push(`$${min.toLocaleString()} - $${max.toLocaleString()}`);
      } else {
        newActiveFilters.push(`$${min.toLocaleString()}+`);
      }
    }
    
    if (filters.beds) {
      newActiveFilters.push(`${filters.beds} beds`);
    }
    
    if (filters.baths) {
      newActiveFilters.push(`${filters.baths} baths`);
    }
    
    if (filters.status) {
      newActiveFilters.push(filters.status.charAt(0).toUpperCase() + filters.status.slice(1));
    }
    
    if (filters.tier) {
      newActiveFilters.push(filters.tier.charAt(0).toUpperCase() + filters.tier.slice(1));
    }
    
    if (filters.investmentType) {
      newActiveFilters.push(filters.investmentType.charAt(0).toUpperCase() + filters.investmentType.slice(1));
    }
    
    if (filters.propertyType) {
      newActiveFilters.push(filters.propertyType.charAt(0).toUpperCase() + filters.propertyType.slice(1));
    }
    
    setActiveFilters(newActiveFilters);
    
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy]);

  // Handle filter clearing
  const clearFilter = (filter: string) => {
    // Find which filter to clear based on the displayed text
    if (filter.includes('$')) {
      setFilters({ ...filters, priceRange: '' });
    } else if (filter.includes('beds')) {
      setFilters({ ...filters, beds: '' });
    } else if (filter.includes('baths')) {
      setFilters({ ...filters, baths: '' });
    } else if (filter === 'General' || filter === 'Exclusive') {
      setFilters({ ...filters, tier: '' });
    } else if (filter === 'Flip' || filter === 'Buy & Hold') {
      setFilters({ ...filters, investmentType: '' });
    } else if (['Single Family', 'Multi Family', 'Condo', 'Townhouse', 'Land'].includes(filter)) {
      setFilters({ ...filters, propertyType: '' });
    } else {
      setFilters({ ...filters, status: '' });
    }
  };

  // Save search handler
  const handleSaveSearch = () => {
    alert('Search saved! You will receive notifications for new matching properties.');
  };
  
  // Safe property hover handler
  const handlePropertyHover = (id: number | undefined | null) => {
    if (id !== undefined && id !== null) {
      setHoveredPropertyId(id);
    } else {
      setHoveredPropertyId(null);
    }
  };
  
  // Define filter content for the advanced filters popover
  const advancedFilterContent = (
    <div className="space-y-5">
      <div>
        <h3 className="font-medium text-sm mb-3">Price Range</h3>
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
        <div className="flex items-center gap-4 mt-4">
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

      <div className="space-y-3">
        <h3 className="font-medium text-sm">Investment Type</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="flip" 
              checked={filters.investmentType === 'flip'} 
              onCheckedChange={(checked) => {
                setFilters({
                  ...filters, 
                  investmentType: checked ? 'flip' : ''
                });
              }}
            />
            <label htmlFor="flip" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Flip
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="buy-hold" 
              checked={filters.investmentType === 'buy-hold'} 
              onCheckedChange={(checked) => {
                setFilters({
                  ...filters, 
                  investmentType: checked ? 'buy-hold' : ''
                });
              }}
            />
            <label htmlFor="buy-hold" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Buy & Hold
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-sm">Property Tier</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="general" 
              checked={filters.tier === 'general'} 
              onCheckedChange={(checked) => {
                setFilters({
                  ...filters, 
                  tier: checked ? 'general' : ''
                });
              }}
            />
            <label htmlFor="general" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              General
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="exclusive" 
              checked={filters.tier === 'exclusive'} 
              onCheckedChange={(checked) => {
                setFilters({
                  ...filters, 
                  tier: checked ? 'exclusive' : ''
                });
              }}
            />
            <label htmlFor="exclusive" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Exclusive
            </label>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="flex flex-col min-h-screen pb-12">
      {/* Breadcrumb and Header Section */}
      <div className="container mx-auto px-4 mt-6 mb-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/" className="hover:text-[#135341]">Home</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-gray-700 font-medium">Properties</span>
        </div>
        
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#09261E] mb-2">
            Property Listings
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Browse our curated collection of investment properties. Filter by price range, property type, 
            and investment strategy to find your next real estate opportunity.
          </p>
        </div>
      </div>
      
      {/* Sticky full-width search bar at the top of the page */}
      <div className="sticky top-0 z-40 bg-white pb-0 px-0">
        <div className="w-full">
          <StickySearchFilter
            onSearch={setSearchTerm}
            searchPlaceholder="City, Address, ZIP, or MLS #"
            filterContent={advancedFilterContent}
            filterButtonText="All Filters"
            showSaveSearch={true}
            onSaveSearch={handleSaveSearch}
            selectedFilters={activeFilters}
            onClearFilter={clearFilter}
          />
        </div>
      
        {/* View controls below search bar but still in sticky section - collapses on scroll down */}
        <div className={cn(
          "w-full px-4 overflow-hidden transition-all duration-300 -mt-1",
          showViewControls ? "max-h-20 opacity-100 py-2" : "max-h-0 opacity-0 py-0"
        )}>
          <div className="container mx-auto flex flex-wrap justify-between items-center">
            {/* Property Count */}
            <div className="text-sm text-gray-700 mb-2 sm:mb-0">
              <span className="font-medium">{filteredProperties.length}</span> homes for sale
            </div>
            
            {/* View Mode and Sort Controls */}
            <div className="flex items-center gap-4">
              {/* View Toggles */}
              <div className="border border-gray-200 rounded-md overflow-hidden flex">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`h-10 w-20 rounded-none ${viewMode === 'list' ? 'bg-[#EAF2EF] text-[#09261E]' : 'bg-white text-gray-600'}`}
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
                <Button 
                  variant="ghost"
                  size="sm" 
                  className={`h-10 w-20 rounded-none ${viewMode === 'map' ? 'bg-[#EAF2EF] text-[#09261E]' : 'bg-white text-gray-600'}`}
                  onClick={() => setViewMode('map')}
                >
                  Map
                </Button>
                <Button 
                  variant="ghost"
                  size="sm" 
                  className={`h-10 w-20 rounded-none ${viewMode === 'grid' ? 'bg-[#EAF2EF] text-[#09261E]' : 'bg-white text-gray-600'}`}
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
              </div>
              
              {/* Sort Control */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white border border-gray-200 rounded-md hover:border-gray-300 h-10 w-48 px-4">
                  <span className="text-sm font-medium mr-1">Sort:</span>
                  <SelectValue placeholder="Recommended" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow mt-6">
        {isLoading ? (
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          </div>
        ) : error ? (
          <div className="container mx-auto px-4 text-center py-10">
            <p className="text-red-500 mb-2">Error loading properties</p>
            <p className="text-gray-600">Please try again later</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="container mx-auto px-4 text-center py-10">
            <p className="text-gray-600">No properties match your search criteria</p>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View - Traditional Card Grid
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentProperties.map((property) => (
                <div 
                  key={property.id}
                  onMouseEnter={() => handlePropertyHover(property.id)}
                  onMouseLeave={() => setHoveredPropertyId(null)}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
            
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
                    
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                      let pageNumber = currentPage - 2 + index;
                      if (pageNumber <= 0) pageNumber = index + 1;
                      if (pageNumber > totalPages) pageNumber = totalPages - (4 - index);
                      return (
                        <PaginationItem key={index}>
                          <PaginationLink 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(pageNumber);
                            }}
                            isActive={currentPage === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
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
        ) : viewMode === 'list' ? (
          // List View - Horizontal Cards
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-4">
              {currentProperties.map((property) => (
                <div 
                  key={property.id} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  onMouseEnter={() => handlePropertyHover(property.id)}
                  onMouseLeave={() => setHoveredPropertyId(null)}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 lg:w-1/4">
                      <img 
                        src={property.imageUrl || "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                        alt={property.title || "Property"} 
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="p-5 md:w-2/3 lg:w-3/4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-heading font-bold text-[#135341] mb-2">
                            ${property.price?.toLocaleString()}
                          </h3>
                          <p className="text-gray-700 mb-3">{property.address}, {property.city}, {property.state}</p>
                          <div className="flex text-sm text-gray-600 mb-4 gap-4">
                            <span>{property.bedrooms} beds</span>
                            <span>{property.bathrooms} baths</span>
                            <span>{property.squareFeet?.toLocaleString()} sqft</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {property.description || "Beautiful property in a prime location, perfect for your next investment."}
                          </p>
                        </div>
                        <Button 
                          className="bg-[#135341] hover:bg-[#09261E] text-white"
                          onClick={() => setLocation(`/p/${property.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
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
                    
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                      let pageNumber = currentPage - 2 + index;
                      if (pageNumber <= 0) pageNumber = index + 1;
                      if (pageNumber > totalPages) pageNumber = totalPages - (4 - index);
                      return (
                        <PaginationItem key={index}>
                          <PaginationLink 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(pageNumber);
                            }}
                            isActive={currentPage === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
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
        ) : (
          // Map View - Split Screen Layout
          <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] md:min-h-[600px]">
            {/* Left Column - Scrollable Property List */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-y-auto border-r border-gray-200">
              <div className="h-full">
                {/* Property Count and Page Navigation */}
                <div className="sticky top-0 z-10 bg-white px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <div className="text-sm font-medium">
                    {filteredProperties.length} homes · Page {currentPage} of {totalPages}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      >
                        Previous
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Property List */}
                <div className="divide-y divide-gray-200">
                  {currentProperties.map((property) => (
                    <div 
                      key={property.id} 
                      className={cn(
                        "p-4 hover:bg-gray-50 transition-colors",
                        hoveredPropertyId === property.id ? "bg-[#EAF2EF]" : ""
                      )}
                      onMouseEnter={() => handlePropertyHover(property.id)}
                      onMouseLeave={() => setHoveredPropertyId(null)}
                    >
                      <div className="flex gap-4">
                        <div className="w-1/3">
                          <img 
                            src={property.imageUrl || "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                            alt={property.title || "Property"} 
                            className="w-full h-24 object-cover rounded"
                          />
                        </div>
                        <div className="w-2/3">
                          <h3 className="font-bold text-[#135341]">${property.price?.toLocaleString()}</h3>
                          <p className="text-sm text-gray-700 mb-1 truncate">{property.address}</p>
                          <div className="flex text-xs text-gray-600 mb-2">
                            <span className="mr-2">{property.bedrooms} beds</span>
                            <span className="mr-2">{property.bathrooms} baths</span>
                            <span>{property.squareFeet?.toLocaleString()} sqft</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full bg-[#135341] hover:bg-[#09261E] text-white text-xs"
                            onClick={() => setLocation(`/p/${property.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Map */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full">
              <PropertyMap 
                properties={filteredProperties} 
                onPropertyHover={handlePropertyHover}
                hoveredPropertyId={hoveredPropertyId}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}