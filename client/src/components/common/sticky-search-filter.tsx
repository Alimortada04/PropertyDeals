import { useState, useEffect, ReactNode } from "react";
import { Search, Filter, ChevronDown, Sliders, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface StickySearchFilterProps {
  onSearch: (value: string) => void;
  searchPlaceholder?: string;
  tabs?: { value: string; label: string }[];
  onTabChange?: (value: string) => void;
  defaultTab?: string;
  filterContent?: ReactNode;
  filterButtonText?: string;
  onSaveSearch?: () => void;
  showSaveSearch?: boolean;
  selectedFilters?: string[];
  onClearFilter?: (filter: string) => void;
}

export default function StickySearchFilter({
  onSearch,
  searchPlaceholder = "Search...",
  tabs = [],
  onTabChange,
  defaultTab = "all",
  filterContent,
  filterButtonText = "Filters",
  onSaveSearch,
  showSaveSearch = false,
  selectedFilters = [],
  onClearFilter
}: StickySearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const isMobile = useIsMobile();
  
  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };
  
  // Make the search/filter bar sticky on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Always sticky after scrolling a bit
      setIsSticky(window.scrollY > 10); 
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div 
      className={cn(
        "bg-white transition-all duration-200 z-40 w-full border-b border-gray-200",
        isSticky ? "sticky top-0 left-0 right-0 shadow-md" : ""
      )}
    >
      {/* Main search bar - full-width, Redfin-inspired layout */}
      <div className="w-full px-0 py-3">
        <div className="flex flex-col md:flex-row gap-3 max-w-full mx-auto">
          {/* Location Search */}
          <div className="relative flex-grow max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              className="pl-10 pr-4 py-2 w-full bg-white border border-gray-300 hover:border-gray-400"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Quick Filters Row - Redfin style dropdowns */}
          <div className="flex gap-2 flex-wrap">
            {/* Price Range */}
            <Select defaultValue="any">
              <SelectTrigger className="w-32 h-10 bg-white border border-gray-300">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Price</SelectItem>
                <SelectItem value="0-300000">Under $300k</SelectItem>
                <SelectItem value="300000-500000">$300k-$500k</SelectItem>
                <SelectItem value="500000-750000">$500k-$750k</SelectItem>
                <SelectItem value="750000-1000000">$750k-$1M</SelectItem>
                <SelectItem value="1000000+">$1M+</SelectItem>
              </SelectContent>
            </Select>

            {/* Beds/Baths */}
            <Select defaultValue="any">
              <SelectTrigger className="w-32 h-10 bg-white border border-gray-300">
                <SelectValue placeholder="Beds/Baths" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1+">1+ Beds</SelectItem>
                <SelectItem value="2+">2+ Beds</SelectItem>
                <SelectItem value="3+">3+ Beds</SelectItem>
                <SelectItem value="4+">4+ Beds</SelectItem>
                <SelectItem value="5+">5+ Beds</SelectItem>
              </SelectContent>
            </Select>

            {/* Property Type */}
            <Select defaultValue="any">
              <SelectTrigger className="w-32 h-10 bg-white border border-gray-300">
                <SelectValue placeholder="Home Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="multi-family">Multi-Family</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>

            {/* More Filters Button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-10 flex items-center gap-2 border border-gray-300"
                >
                  <Sliders className="h-4 w-4" />
                  {filterButtonText}
                  <span className="text-xs bg-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                    +1
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[350px] p-5 shadow-lg" align="end">
                {filterContent}
              </PopoverContent>
            </Popover>

            {/* Save Search Button */}
            {showSaveSearch && (
              <Button 
                variant="default" 
                className="h-10 bg-[#09261E] text-white hover:bg-[#124035]"
                onClick={onSaveSearch}
              >
                Save Search
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Applied Filters Chips */}
      {selectedFilters.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="w-full px-4 py-2">
            <div className="flex flex-wrap gap-2 items-center max-w-7xl mx-auto">
              <span className="text-sm text-gray-500 pr-2">Active filters:</span>
              {selectedFilters.map((filter) => (
                <div 
                  key={filter}
                  className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                >
                  <span>{filter}</span>
                  <button 
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={() => onClearFilter && onClearFilter(filter)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Category Tabs - styled similarly to Redfin */}
      {tabs.length > 0 && (
        <div className="w-full px-4 bg-white border-b border-gray-200">
          <div className="overflow-x-auto py-2 max-w-7xl mx-auto">
            <Tabs 
              defaultValue={defaultTab} 
              onValueChange={onTabChange}
              className="w-full"
            >
              <TabsList className="h-10 bg-transparent w-full flex items-center justify-start overflow-x-auto">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex-shrink-0 h-9 px-4 rounded-md mr-2 border border-transparent
                    data-[state=active]:bg-[#EAF2EF] data-[state=active]:text-[#09261E]
                    data-[state=active]:shadow-none hover:bg-gray-100 group relative"
                  >
                    {tab.label}
                    {tab.value !== 'all' && (
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 
                        data-[state=active]:block hidden data-[state=active]:group-hover:opacity-100">
                        <X size={14} className="text-gray-500" />
                      </div>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}