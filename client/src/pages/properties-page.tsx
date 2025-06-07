import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import PropertyCard from "@/components/properties/property-card";
import PropertyMap from "@/components/properties/property-map";
import PropertyRecommendations from "@/components/properties/property-recommendations";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropertySearchBar from "@/components/properties/property-search-bar";
import Breadcrumbs from "@/components/common/breadcrumbs";
import { allProperties } from "@/lib/data";
import {
  MapPin,
  List,
  LayoutGrid,
  ChevronDown,
  Grid,
  Save,
  ChevronRight,
  BedDouble,
  Bath,
  Square as SquareFootIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "wouter";

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
    propertyType: "",
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid"); // Only grid and map views now
  const [location, setLocation] = useLocation();
  const [hoveredPropertyId, setHoveredPropertyId] = useState<number | null>(
    null,
  );
  const propertiesPerPage = 48;

  // State for controlling collapsible view controls section
  const [showViewControls, setShowViewControls] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Update URL when view mode changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("view", viewMode);
    window.history.replaceState({}, "", url.toString());
  }, [viewMode]);

  // Check URL for view mode on initial load
  useEffect(() => {
    const url = new URL(window.location.href);
    const viewParam = url.searchParams.get("view");
    if (viewParam && (viewParam === "grid" || viewParam === "map")) {
      setViewMode(viewParam as "grid" | "map");
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

  const {
    data: properties,
    isLoading,
    error,
  } = useQuery<Property[]>({
    queryKey: ["properties", "live"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_profile")
        .select("*")
        .in("status", ["live", "offer_accepted", "pending"]); // You can customize the status filter here

      if (error) throw error;
      return data || [];
    },
  });

  // Default property image for fallback
  const defaultPropertyImage =
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

  const displayProperties = properties?.filter(p => p) ?? [];

  // Filter and sort properties
  const filteredProperties = displayProperties.filter((property) => {
    // Search filter
    const searchMatch =
      !searchTerm ||
      property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.zipcode?.toLowerCase().includes(searchTerm.toLowerCase());

    // Price range filter
    let priceMatch = true;
    if (filters.priceRange) {
      if (filters.priceRange === "800000+") {
        priceMatch = (property.listing_price ?? 0) >= 800000;
      } else {
        const [min, max] = filters.priceRange.split("-").map(Number);
        priceMatch =
          (property.listing_price ?? 0) >= min &&
          (property.listing_price ?? 0) <= (max || Infinity);
      }
    }

    // Beds filter
    let bedsMatch = true;
    if (filters.beds) {
      const minBeds = parseInt(filters.beds.replace("+", ""));
      bedsMatch = (property.bedrooms ?? 0) >= minBeds;
    }

    // Baths filter
    let bathsMatch = true;
    if (filters.baths) {
      const minBaths = parseInt(filters.baths.replace("+", ""));
      bathsMatch = (property.bathrooms ?? 0) >= minBaths;
    }

    // Status filter
    const statusMatch = !filters.status || property.status === filters.status;

    return searchMatch && priceMatch && bedsMatch && bathsMatch && statusMatch;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === "newest") {
      return (
        new Date(b.created_at || "").getTime() -
        new Date(a.created_at || "").getTime()
      );
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
  const currentProperties = sortedProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty,
  );
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  // Update the activeFilters state when filters change
  useEffect(() => {
    const newActiveFilters: string[] = [];

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      if (max) {
        newActiveFilters.push(
          `$${min.toLocaleString()} - $${max.toLocaleString()}`,
        );
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
      newActiveFilters.push(
        filters.status.charAt(0).toUpperCase() + filters.status.slice(1),
      );
    }

    if (filters.tier) {
      newActiveFilters.push(
        filters.tier.charAt(0).toUpperCase() + filters.tier.slice(1),
      );
    }

    if (filters.investmentType) {
      newActiveFilters.push(
        filters.investmentType.charAt(0).toUpperCase() +
          filters.investmentType.slice(1),
      );
    }

    if (filters.propertyType) {
      newActiveFilters.push(
        filters.propertyType.charAt(0).toUpperCase() +
          filters.propertyType.slice(1),
      );
    }

    setActiveFilters(newActiveFilters);

    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy]);

  // Handle filter clearing
  const clearFilter = (filter: string) => {
    // Find which filter to clear based on the displayed text
    if (filter.includes("$")) {
      setFilters({ ...filters, priceRange: "" });
    } else if (filter.includes("beds")) {
      setFilters({ ...filters, beds: "" });
    } else if (filter.includes("baths")) {
      setFilters({ ...filters, baths: "" });
    } else if (filter === "General" || filter === "Exclusive") {
      setFilters({ ...filters, tier: "" });
    } else if (filter === "Flip" || filter === "Buy & Hold") {
      setFilters({ ...filters, investmentType: "" });
    } else if (
      ["Single Family", "Multi Family", "Condo", "Townhouse", "Land"].includes(
        filter,
      )
    ) {
      setFilters({ ...filters, propertyType: "" });
    } else {
      setFilters({ ...filters, status: "" });
    }
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
              priceRange: `${values[0]}-${values[1]}`,
            });
          }}
        />
        <div className="flex items-center gap-4 mt-4">
          <div>
            <p className="text-xs mb-1 text-gray-500">Min</p>
            <Input
              type="text"
              value={`$${new Intl.NumberFormat().format(parseInt(filters.priceRange?.split("-")?.[0] || "0"))}`}
              className="h-8"
              onChange={(e) => {
                // Parse input if needed
                const value = e.target.value.replace(/[\$,]/g, "");
                const min = parseInt(value) || 0;
                const max = parseInt(
                  filters.priceRange?.split("-")?.[1] || "10000000",
                );
                setFilters({
                  ...filters,
                  priceRange: `${min}-${max}`,
                });
              }}
            />
          </div>
          <div className="pt-5">—</div>
          <div>
            <p className="text-xs mb-1 text-gray-500">Max</p>
            <Input
              type="text"
              value={`$${new Intl.NumberFormat().format(parseInt(filters.priceRange?.split("-")?.[1] || "10000000"))}`}
              className="h-8"
              onChange={(e) => {
                // Parse input if needed
                const value = e.target.value.replace(/[\$,]/g, "");
                const max = parseInt(value) || 10000000;
                const min = parseInt(
                  filters.priceRange?.split("-")?.[0] || "0",
                );
                setFilters({
                  ...filters,
                  priceRange: `${min}-${max}`,
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
              checked={filters.investmentType === "flip"}
              onCheckedChange={(checked) => {
                setFilters({
                  ...filters,
                  investmentType: checked ? "flip" : "",
                });
              }}
            />
            <label
              htmlFor="flip"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Flip
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="buy-hold"
              checked={filters.investmentType === "buy-hold"}
              onCheckedChange={(checked) => {
                setFilters({
                  ...filters,
                  investmentType: checked ? "buy-hold" : "",
                });
              }}
            />
            <label
              htmlFor="buy-hold"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
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
              checked={filters.tier === "general"}
              onCheckedChange={(checked) => {
                setFilters({
                  ...filters,
                  tier: checked ? "general" : "",
                });
              }}
            />
            <label
              htmlFor="general"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              General
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="exclusive"
              checked={filters.tier === "exclusive"}
              onCheckedChange={(checked) => {
                setFilters({
                  ...filters,
                  tier: checked ? "exclusive" : "",
                });
              }}
            />
            <label
              htmlFor="exclusive"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Exclusive
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white md:pt-4 pt-[0px] pb-[0px]">
      {/* Breadcrumb and Header Section - White background */}
      <div className="w-full bg-white">
        <div className="bg-white container mx-auto px-4 pt-8 pb-6">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Link href="/" className="hover:text-[#135341]">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-gray-700 font-medium">Properties</span>
          </div>

          {/* Page Title */}
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#09261E] mb-2">
              Property Listings
            </h1>
            <p className="text-gray-600 max-w-3xl">
              Browse our curated collection of investment properties. Filter by
              price range, property type, and investment strategy to find your
              next real estate opportunity.
            </p>
          </div>
        </div>
      </div>
      {/* Property Search Bar */}
      <div className="sticky top-0 z-30 bg-white pb-0 px-0 w-full left-0 right-0">
        <PropertySearchBar
          onSearch={setSearchTerm}
          onFilterChange={(filters) => {
            // Handle filter changes
            const newActiveFilters = [];

            if (filters.priceRange && filters.priceRange[0] > 0) {
              newActiveFilters.push(
                `$${filters.priceRange[0].toLocaleString()} - $${filters.priceRange[1].toLocaleString()}`,
              );
              setFilters((prevFilters) => ({
                ...prevFilters,
                priceRange: `${filters.priceRange[0]}-${filters.priceRange[1]}`,
              }));
            }

            if (filters.location) {
              newActiveFilters.push(
                filters.location.charAt(0).toUpperCase() +
                  filters.location.slice(1),
              );
            }

            if (filters.propertyType) {
              const formattedType = filters.propertyType
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l: string) => l.toUpperCase());
              newActiveFilters.push(formattedType);
              setFilters((prevFilters) => ({
                ...prevFilters,
                propertyType: formattedType.toLowerCase(),
              }));
            }

            setActiveFilters(newActiveFilters);

            if (filters.sortBy) {
              setSortBy(filters.sortBy);
            }
          }}
          onViewModeChange={setViewMode}
          viewMode={viewMode}
        />
      </div>
      {/* Main Content Area */}
      <div className="flex-grow mt-6">
        {/* Location-based Property Recommendations */}
        {searchTerm && searchTerm.length > 2 && (
          <div className="container mx-auto px-4 mb-10">
            <PropertyRecommendations
              location={searchTerm}
              title={`Properties in ${searchTerm}`}
              maxResults={4}
              showViewAll={false}
            />
          </div>
        )}

        {isLoading ? (
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg overflow-hidden shadow-md"
                >
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
            <p className="text-gray-600">
              No properties match your search criteria
            </p>
          </div>
        ) : viewMode === "grid" ? (
          // Grid View - Traditional Card Grid
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(totalPages, 5) }).map(
                      (_, index) => {
                        let pageNumber = currentPage - 2 + index;
                        if (pageNumber <= 0) pageNumber = index + 1;
                        if (pageNumber > totalPages)
                          pageNumber = totalPages - (4 - index);
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
                      },
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            setCurrentPage(currentPage + 1);
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        ) : (
          // Map View - Properties grid + Map side by side
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Left Column - Properties in Grid Format */}
              <div className="w-full md:w-1/2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {currentProperties.map((property) => (
                    <div
                      key={property.id}
                      onMouseEnter={() => handlePropertyHover(property.id)}
                      onMouseLeave={() => handlePropertyHover(null)}
                      className={cn(
                        hoveredPropertyId === property.id
                          ? "ring-2 ring-[#135341] rounded-lg"
                          : "",
                      )}
                    >
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1)
                                setCurrentPage(currentPage - 1);
                            }}
                            className={cn(
                              currentPage === 1 &&
                                "pointer-events-none opacity-50",
                            )}
                          />
                        </PaginationItem>

                        {[...Array(totalPages)].map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(i + 1);
                              }}
                              isActive={currentPage === i + 1}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages)
                                setCurrentPage(currentPage + 1);
                            }}
                            className={cn(
                              currentPage === totalPages &&
                                "pointer-events-none opacity-50",
                            )}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>

              {/* Right Column - Map */}
              <div className="w-full md:w-1/2 h-[500px] md:h-[600px] rounded-lg overflow-hidden border border-gray-200 sticky top-24">
                <PropertyMap
                  properties={filteredProperties}
                  onPropertyHover={handlePropertyHover}
                  hoveredPropertyId={hoveredPropertyId}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
