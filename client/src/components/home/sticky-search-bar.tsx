import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  MapPin, 
  Home, 
  DollarSign, 
  Filter, 
  ArrowUp, 
  X, 
  Calendar,
  GraduationCap
} from "lucide-react";

export default function StickySearchBar() {
  const [isSticky, setIsSticky] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [dealType, setDealType] = useState("");
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  // Handle scroll event to make search bar sticky
  useEffect(() => {
    const handleScroll = () => {
      // Make sticky after hero section
      const heroHeight = window.innerHeight * 0.85;
      const isScrolledPastHero = window.scrollY > heroHeight;
      
      setIsSticky(isScrolledPastHero);
      
      // Collapse expanded view when scrolling down
      if (isScrolledPastHero && isExpanded && window.scrollY > heroHeight + 200) {
        setIsExpanded(false);
        setShowAdvanced(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isExpanded]);
  
  // Close expanded search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current && 
        !searchBarRef.current.contains(event.target as Node) && 
        isExpanded
      ) {
        setIsExpanded(false);
        setShowAdvanced(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query params
    let queryParams = new URLSearchParams();
    if (location) queryParams.append("location", location);
    if (propertyType) queryParams.append("type", propertyType);
    if (priceRange) queryParams.append("price", priceRange);
    if (timePeriod) queryParams.append("period", timePeriod);
    if (dealType) queryParams.append("deal", dealType);
    
    const queryString = queryParams.toString();
    navigate(`/properties${queryString ? `?${queryString}` : ""}`);
    
    // Reset expanded state
    setIsExpanded(false);
    setShowAdvanced(false);
  };
  
  const clearAllFilters = () => {
    setLocation("");
    setPropertyType("");
    setPriceRange("");
    setTimePeriod("");
    setDealType("");
    setActiveFilter(null);
  };
  
  const toggleAdvancedSearch = () => {
    setShowAdvanced(prev => !prev);
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  return (
    <div
      ref={searchBarRef}
      className={`w-full bg-white transition-all duration-500 z-30 overflow-hidden
        ${isSticky ? "fixed top-0 shadow-md" : "relative border-b border-gray-200"}
        ${isExpanded ? "lg:pb-8" : ""}
      `}
      style={{
        height: isExpanded && showAdvanced ? 'auto' : undefined,
        boxShadow: isSticky ? '0 4px 20px rgba(0, 0, 0, 0.08)' : undefined
      }}
    >
      <div className="container mx-auto px-4 py-4">
        {/* Main search bar */}
        <form onSubmit={handleSearch} className="relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            {/* Location input */}
            <div 
              className={`flex items-center flex-grow min-w-[250px] border rounded-full px-3 py-2 bg-white 
                transition-all duration-300 ${isExpanded ? 'ring-2 ring-[#135341]/30' : ''}
                ${activeFilter === 'location' ? 'ring-2 ring-[#135341]' : 'focus-within:ring-1 focus-within:ring-[#135341] focus-within:border-[#135341]'}
              `}
              onClick={() => {
                setActiveFilter('location');
                setIsExpanded(true);
              }}
            >
              <MapPin className={`h-5 w-5 transition-colors duration-300 ${activeFilter === 'location' ? 'text-[#135341]' : 'text-gray-400'} mr-2`} />
              <Input 
                placeholder="Location (city, state, or zip)"
                className="border-none shadow-none focus-visible:outline-none focus-visible:ring-0 p-0 text-base placeholder:text-gray-400"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              {location && (
                <button 
                  type="button" 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocation("");
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Property Type select */}
            <div 
              className={`flex items-center w-full sm:w-auto min-w-[200px] border rounded-full px-3 py-2 bg-white
                transition-all duration-300 ${isExpanded ? 'ring-2 ring-[#135341]/30' : ''}
                ${activeFilter === 'propertyType' ? 'ring-2 ring-[#135341]' : 'focus-within:ring-1 focus-within:ring-[#135341] focus-within:border-[#135341]'}
              `}
              onClick={() => {
                setActiveFilter('propertyType');
                setIsExpanded(true);
              }}
            >
              <Home className={`h-5 w-5 transition-colors duration-300 ${activeFilter === 'propertyType' ? 'text-[#135341]' : 'text-gray-400'} mr-2`} />
              <Select 
                value={propertyType} 
                onValueChange={(value) => {
                  setPropertyType(value);
                  setActiveFilter(null);
                }}
              >
                <SelectTrigger className="border-0 shadow-none focus:ring-0 p-0 h-9 w-full">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-family">Single Family</SelectItem>
                  <SelectItem value="multi-family">Multi-Family</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
              {propertyType && (
                <button 
                  type="button" 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPropertyType("");
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Price Range select */}
            <div 
              className={`flex items-center w-full sm:w-auto min-w-[200px] border rounded-full px-3 py-2 bg-white
                transition-all duration-300 ${isExpanded ? 'ring-2 ring-[#135341]/30' : ''}
                ${activeFilter === 'priceRange' ? 'ring-2 ring-[#135341]' : 'focus-within:ring-1 focus-within:ring-[#135341] focus-within:border-[#135341]'}
              `}
              onClick={() => {
                setActiveFilter('priceRange');
                setIsExpanded(true);
              }}
            >
              <DollarSign className={`h-5 w-5 transition-colors duration-300 ${activeFilter === 'priceRange' ? 'text-[#135341]' : 'text-gray-400'} mr-2`} />
              <Select 
                value={priceRange} 
                onValueChange={(value) => {
                  setPriceRange(value);
                  setActiveFilter(null);
                }}
              >
                <SelectTrigger className="border-0 shadow-none focus:ring-0 p-0 h-9 w-full">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-200000">$0 - $200k</SelectItem>
                  <SelectItem value="200000-500000">$200k - $500k</SelectItem>
                  <SelectItem value="500000-1000000">$500k - $1M</SelectItem>
                  <SelectItem value="1000000-9999999">$1M+</SelectItem>
                </SelectContent>
              </Select>
              {priceRange && (
                <button 
                  type="button" 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPriceRange("");
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Search button */}
            <div className={`flex items-center transition-all duration-300 ${isExpanded ? 'mt-2 ml-auto lg:mt-0' : ''}`}>
              <Button 
                type="submit" 
                className="bg-[#09261E] hover:bg-[#135341] text-white px-6 h-10 rounded-full min-w-[120px] flex items-center justify-center shadow-md hover:shadow-lg transition-all"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              
              {/* Advanced filter toggle */}
              <Button 
                type="button" 
                variant="outline" 
                className={`ml-2 border-[#135341] text-[#135341] hover:bg-[#135341] hover:text-white px-3 rounded-full h-10 transition-all ${showAdvanced ? 'bg-[#135341]/10' : ''}`}
                onClick={toggleAdvancedSearch}
              >
                {showAdvanced ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <Filter className="h-4 w-4" />
                )}
              </Button>
              
              {/* Clear all filters button - only show if any filter is active */}
              {(location || propertyType || priceRange || timePeriod || dealType) && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="ml-2 text-gray-500 hover:text-gray-700 h-10 text-sm px-3"
                  onClick={clearAllFilters}
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
          
          {/* Advanced search options - only visible when expanded */}
          {isExpanded && showAdvanced && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100 animate-fadeInUp">
              {/* Time Period */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#135341]" />
                  Time Period
                </label>
                <Select value={timePeriod} onValueChange={setTimePeriod}>
                  <SelectTrigger className="w-full rounded-md border-gray-200">
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-24h">Last 24 hours</SelectItem>
                    <SelectItem value="last-week">Last 7 days</SelectItem>
                    <SelectItem value="last-month">Last 30 days</SelectItem>
                    <SelectItem value="last-quarter">Last 3 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Deal Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-[#135341]" />
                  Deal Type
                </label>
                <Select value={dealType} onValueChange={setDealType}>
                  <SelectTrigger className="w-full rounded-md border-gray-200">
                    <SelectValue placeholder="Any deal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fix-flip">Fix & Flip</SelectItem>
                    <SelectItem value="brrrr">BRRRR</SelectItem>
                    <SelectItem value="subject-to">Subject-To</SelectItem>
                    <SelectItem value="wholesale">Wholesale</SelectItem>
                    <SelectItem value="turnkey">Turnkey</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Popular searches */}
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Popular Searches</label>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full text-xs bg-[#09261E]/5 border-none hover:bg-[#09261E]/10 text-[#09261E]"
                    onClick={() => {
                      setLocation("Miami");
                      setPropertyType("multi-family");
                    }}
                  >
                    Miami Multi-Family
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full text-xs bg-[#09261E]/5 border-none hover:bg-[#09261E]/10 text-[#09261E]"
                    onClick={() => {
                      setLocation("Chicago");
                      setDealType("fix-flip");
                    }}
                  >
                    Chicago Fix & Flip
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full text-xs bg-[#09261E]/5 border-none hover:bg-[#09261E]/10 text-[#09261E]"
                    onClick={() => {
                      setLocation("Dallas");
                      setPriceRange("200000-500000");
                    }}
                  >
                    Dallas $200k-$500k
                  </Button>
                </div>
              </div>
            </div>
          )}
        </form>
        
        {/* Selected filters summary - show when any filter is applied */}
        {(location || propertyType || priceRange || timePeriod || dealType) && !isExpanded && (
          <div className="flex flex-wrap items-center gap-2 mt-4 text-sm">
            <span className="text-gray-500">Filters:</span>
            {location && (
              <div className="flex items-center bg-[#09261E]/5 rounded-full px-3 py-1 text-[#09261E]">
                <span>{location}</span>
                <button onClick={() => setLocation("")} className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {propertyType && (
              <div className="flex items-center bg-[#09261E]/5 rounded-full px-3 py-1 text-[#09261E]">
                <span>{propertyType.replace("-", " ")}</span>
                <button onClick={() => setPropertyType("")} className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {priceRange && (
              <div className="flex items-center bg-[#09261E]/5 rounded-full px-3 py-1 text-[#09261E]">
                <span>
                  {priceRange === "0-200000" ? "$0-$200k" : 
                   priceRange === "200000-500000" ? "$200k-$500k" : 
                   priceRange === "500000-1000000" ? "$500k-$1M" : "$1M+"}
                </span>
                <button onClick={() => setPriceRange("")} className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {timePeriod && (
              <div className="flex items-center bg-[#09261E]/5 rounded-full px-3 py-1 text-[#09261E]">
                <span>
                  {timePeriod === "last-24h" ? "Last 24 hours" : 
                   timePeriod === "last-week" ? "Last 7 days" : 
                   timePeriod === "last-month" ? "Last 30 days" : "Last 3 months"}
                </span>
                <button onClick={() => setTimePeriod("")} className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {dealType && (
              <div className="flex items-center bg-[#09261E]/5 rounded-full px-3 py-1 text-[#09261E]">
                <span>{dealType.replace("-", " ")}</span>
                <button onClick={() => setDealType("")} className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}