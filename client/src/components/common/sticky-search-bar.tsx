import { useState, useEffect } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
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

interface StickySearchBarProps {
  onSearch: (value: string) => void;
  searchPlaceholder?: string;
  tabs?: { value: string; label: string }[];
  onTabChange?: (value: string) => void;
  defaultTab?: string;
  filterContent?: React.ReactNode;
  filterButtonText?: string;
}

export default function StickySearchBar({
  onSearch,
  searchPlaceholder = "Search...",
  tabs = [],
  onTabChange,
  defaultTab = "all",
  filterContent,
  filterButtonText = "Filters",
}: StickySearchBarProps) {
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

  // Make the search bar sticky
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always sticky
      setIsSticky(true);
      
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
    
    // Set initially to sticky
    setIsSticky(true);
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  
  return (
    <div 
      className={cn(
        "bg-white transition-all duration-200 z-50 w-full border-b border-gray-100",
        isSticky ? "sticky top-16 left-0 right-0 lg:top-0 shadow-md" : ""
      )}
    >
      {/* Search bar - modern full-width design */}
      <div className="w-full py-3 px-4 border-y border-gray-200">
        <div className="flex flex-row items-center gap-2 max-w-full mx-auto">
          {/* Search Input */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              className="pl-10 pr-4 py-2 w-full bg-white border border-gray-300 focus:border-gray-400 rounded-full"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Filters Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="h-10 flex items-center gap-1.5 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                {filterButtonText}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-5 shadow-lg" align="end">
              {filterContent}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Category Tabs */}
      {tabs.length > 0 && (
        <div className={cn(
          "w-full px-0 bg-white border-b border-gray-200 overflow-hidden",
          showBottomSection ? "max-h-20 opacity-100" : "max-h-0 opacity-0 border-b-0"
        )}>
          <div className="overflow-x-auto py-3 max-w-full px-4 mx-auto">
            <div className="flex space-x-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => onTabChange && onTabChange(tab.value)}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-sm whitespace-nowrap font-medium transition-colors",
                    tab.value === defaultTab 
                      ? "bg-[#EAF2EF] text-[#09261E]" 
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}