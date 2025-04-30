import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Search, Sliders, List, LayoutGrid, Map as MapIcon, ChevronDown } from "lucide-react";
import "./property-search-bar.css";

interface PropertySearchBarProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: any) => void;
  onViewModeChange?: (mode: "list" | "grid" | "map") => void;
  viewMode?: "list" | "grid" | "map";
}

export default function PropertySearchBar({
  onSearch,
  onFilterChange,
  onViewModeChange,
  viewMode = "grid"
}: PropertySearchBarProps) {
  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [showBottomSection, setShowBottomSection] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  
  // Filter states
  const [sortBy, setSortBy] = useState("newest");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  
  // References
  const searchBarRef = useRef<HTMLDivElement>(null);
  const initialPositionRef = useRef<number | null>(null);
  
  // Store initial position on first render
  useEffect(() => {
    if (searchBarRef.current && initialPositionRef.current === null) {
      const rect = searchBarRef.current.getBoundingClientRect();
      initialPositionRef.current = rect.top + window.scrollY;
    }
  }, []);
  
  // Always sticky behavior with visible bottom section
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always make sticky
      setIsSticky(true);
      
      // Always show bottom section
      setShowBottomSection(true);
      
      // Save current scroll position for future use if needed
      setLastScrollY(currentScrollY);
    };
    
    // Set initially to sticky
    setIsSticky(true);
    setShowBottomSection(true);
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Handle search input change with address suggestions
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Mock address suggestions
    if (value.length > 2) {
      // These would come from an API in a real implementation
      setAddresses([
        `${value} Main St, Milwaukee, WI`,
        `${value} Oak Ave, Madison, WI`,
        `${value} Pine Rd, Green Bay, WI`
      ]);
      setShowAddressSuggestions(true);
    } else {
      setShowAddressSuggestions(false);
    }
  };
  
  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    setShowAddressSuggestions(false);
  };
  
  // Handle address selection
  const handleAddressSelect = (address: string) => {
    setSearchQuery(address);
    if (onSearch) onSearch(address);
    setShowAddressSuggestions(false);
  };
  
  // Filter popover content
  const filterContent = (
    <div className="w-80 md:w-96 p-5">
      <h3 className="text-lg font-semibold mb-4">Property Filters</h3>
      
      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <h4 className="font-medium mb-2">Price Range</h4>
          <div className="mb-2">
            <Slider 
              defaultValue={[0, 1000000]} 
              max={2000000}
              step={50000}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="my-5 custom-range-slider"
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">${priceRange[0].toLocaleString()}</span>
            <span className="font-medium">${priceRange[1].toLocaleString()}</span>
          </div>
        </div>
        
        {/* Investment Type */}
        <div>
          <h4 className="font-medium mb-2">Investment Type</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="flip" />
              <Label htmlFor="flip">Flip</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="buyhold" />
              <Label htmlFor="buyhold">Buy & Hold</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="rental" />
              <Label htmlFor="rental">Rental</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="development" />
              <Label htmlFor="development">Development</Label>
            </div>
          </div>
        </div>
        
        {/* Property Tier */}
        <div>
          <h4 className="font-medium mb-2">Property Tier</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="general" />
              <Label htmlFor="general">General</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="exclusive" />
              <Label htmlFor="exclusive">Exclusive</Label>
            </div>
          </div>
        </div>
        
        {/* Apply Button */}
        <Button 
          className="w-full bg-[#09261E] hover:bg-[#135341]"
          onClick={() => {
            if (onFilterChange) {
              onFilterChange({
                priceRange,
                sortBy,
                location,
                propertyType
              });
            }
          }}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
  
  return (
    <div 
      ref={searchBarRef}
      className={cn(
        "transition-all duration-300 z-50 w-full",
        isSticky ? 
          "sticky top-0 left-0 right-0 shadow-sm border-b border-gray-100" : 
          "relative"
      )}
    >
      {/* Top Section - Main Search */}
      <div className={cn(
        "w-full py-3 px-4 md:px-6",
        isSticky ? "bg-white/90 backdrop-blur-sm" : "bg-white"
      )}>
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            {/* Search Input with Dropdown */}
            <div className="relative flex-grow">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search properties by location, type, or keyword..."
                  className="pl-10 py-2 w-full bg-white border border-gray-300 focus:border-[#135341] focus:ring-1 focus:ring-[#135341]/20 rounded-md shadow-sm focus:shadow-md transition-all duration-200"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              
              {/* Address Suggestions Dropdown */}
              {showAddressSuggestions && addresses.length > 0 && (
                <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <ul className="py-1">
                    {addresses.map((address, index) => (
                      <li 
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleAddressSelect(address)}
                      >
                        {address}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Filters Button with Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-10 flex items-center gap-1.5 border border-gray-300 rounded-md bg-white shadow-sm hover:bg-[#EAF2EF] hover:border-[#135341]/30 transition-all duration-200"
                >
                  <Sliders className="h-4 w-4 mr-1" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 md:w-96 p-0">
                {filterContent}
              </PopoverContent>
            </Popover>
          </form>
        </div>
      </div>
      
      {/* Bottom Section - Quick Filters & View Toggle */}
      <div 
        className={cn(
          "w-full border-t border-gray-100 transition-all duration-300 overflow-hidden bg-white",
          isSticky ? 
            (showBottomSection ? "max-h-20" : "max-h-0") : 
            "max-h-20"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
          <div className="flex justify-between items-center">
            {/* Left Side - Quick Filters */}
            <div className="flex items-center gap-3 overflow-x-auto px-1 py-2 flex-1">
              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[110px] h-9 text-sm bg-white border border-gray-300 shadow-sm hover:border-[#135341]/30">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price_asc">Price: Low-High</SelectItem>
                  <SelectItem value="price_desc">Price: High-Low</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Location Dropdown */}
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-[110px] h-9 text-sm bg-white border border-gray-300 shadow-sm hover:border-[#135341]/30">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="milwaukee">Milwaukee</SelectItem>
                  <SelectItem value="madison">Madison</SelectItem>
                  <SelectItem value="green_bay">Green Bay</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Property Type Dropdown */}
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="w-[110px] h-9 text-sm bg-white border border-gray-300 shadow-sm hover:border-[#135341]/30">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single_family">Single Family</SelectItem>
                  <SelectItem value="multi_family">Multi Family</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Price Dropdown */}
              <Select defaultValue="">
                <SelectTrigger className="w-[110px] h-9 text-sm bg-white border border-gray-300 shadow-sm hover:border-[#135341]/30">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-250k">Under $250K</SelectItem>
                  <SelectItem value="250k-500k">$250K-$500K</SelectItem>
                  <SelectItem value="500k-750k">$500K-$750K</SelectItem>
                  <SelectItem value="750k-1m">$750K-$1M</SelectItem>
                  <SelectItem value="over-1m">Over $1M</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Right Side - View Toggle Buttons */}
            <div className="flex items-center border border-gray-200 rounded-md divide-x">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "px-3 py-1 rounded-none rounded-l-md",
                  viewMode === "list" ? "bg-gray-100" : "bg-white"
                )}
                onClick={() => onViewModeChange && onViewModeChange("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "px-3 py-1 rounded-none",
                  viewMode === "grid" ? "bg-gray-100" : "bg-white"
                )}
                onClick={() => onViewModeChange && onViewModeChange("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "px-3 py-1 rounded-none rounded-r-md",
                  viewMode === "map" ? "bg-gray-100" : "bg-white"
                )}
                onClick={() => onViewModeChange && onViewModeChange("map")}
              >
                <MapIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}