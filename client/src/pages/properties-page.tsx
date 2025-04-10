import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import PropertySearch from "@/components/properties/property-search";
import PropertyFilters, { FilterOptions } from "@/components/properties/property-filters";
import PropertyCard from "@/components/properties/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allProperties } from "@/lib/data";

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: "",
    beds: "",
    baths: "",
    status: ""
  });
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
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

  return (
    <>
      {/* Search and Filter Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-[#09261E] mb-6">Browse Properties</h1>
          
          <PropertySearch onSearch={setSearchTerm} />
          <PropertyFilters onFilter={setFilters} />
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-gray-600">
                <span className="font-medium">{filteredProperties.length}</span> properties found
              </p>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-gray-600">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white border border-[#D8D8D8] rounded-md h-10 w-40">
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

          {/* Property Grid */}
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
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
      </section>
    </>
  );
}
