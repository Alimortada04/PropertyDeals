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
  
  // State for the collapsible bottom section
  const [showBottomSection, setShowBottomSection] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Make the search/filter bar sticky on scroll and handle bottom section visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always sticky after scrolling a bit
      setIsSticky(currentScrollY > 10);
      
      // Hide bottom section when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY + 5) {
        // Scrolling down
        setShowBottomSection(false);
      } else if (currentScrollY < lastScrollY - 5) {
        // Scrolling up
        setShowBottomSection(true);
      }
      
      // Save current scroll position
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  
  return (
    <div 
      className={cn(
        "bg-white transition-all duration-200 z-40 w-screen border-b border-gray-100",
        isSticky ? "sticky top-0 left-0 right-0" : ""
      )}
    >
      {/* Main search bar - full-width, Redfin-inspired layout */}
      <div className="w-full px-0 py-4 shadow-sm">
        <div className="flex flex-row items-center gap-3 max-w-full px-4 md:px-16 mx-auto">
          {/* Location Search */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              className="pl-10 pr-4 py-2 w-full bg-white border border-gray-200 hover:border-gray-300 rounded-md"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* More Filters Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="h-10 flex items-center gap-2 border border-gray-200 rounded-md hover:border-gray-300"
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
        </div>
      </div>

      {/* Applied Filters Chips */}
      {selectedFilters.length > 0 && (
        <div className="bg-white border-b border-gray-100">
          <div className="w-full px-0 py-2">
            <div className="flex flex-wrap gap-2 items-center max-w-full px-4 md:px-16 mx-auto">
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
      
      {/* Category Tabs - styled similarly to Redfin - collapses on scroll down */}
      {tabs.length > 0 && (
        <div className={cn(
          "w-full px-0 bg-white border-b border-gray-100 overflow-hidden transition-all duration-300",
          showBottomSection ? "max-h-20 opacity-100" : "max-h-0 opacity-0 border-b-0"
        )}>
          <div className="overflow-x-auto py-2 max-w-full px-4 md:px-16 mx-auto">
            <Tabs 
              defaultValue={defaultTab} 
              onValueChange={onTabChange}
              className="w-full"
            >
              <TabsList className="h-10 bg-transparent w-full flex items-center justify-center overflow-x-auto">
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