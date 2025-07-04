import { useState, useEffect, useRef } from "react";
import { Search, Filter, ChevronDown, ArrowUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const searchBarRef = useRef<HTMLDivElement>(null);
  const initialPositionRef = useRef<number | null>(null);
  
  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };
  
  // State for the collapsible bottom section
  const [showBottomSection, setShowBottomSection] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Store the initial position of the search bar on first render
  useEffect(() => {
    if (searchBarRef.current && initialPositionRef.current === null) {
      const rect = searchBarRef.current.getBoundingClientRect();
      initialPositionRef.current = rect.top + window.scrollY;
    }
    
    // Initial check on component mount
    const currentScrollY = window.scrollY;
    const position = initialPositionRef.current || 0;
    if (currentScrollY > position) {
      setIsSticky(true);
    }
  }, []);

  // Always sticky behavior
  useEffect(() => {
    // Set as sticky by default, don't wait for scroll
    setIsSticky(true);
    setShowBottomSection(true);
    initialPositionRef.current = 0; // Start at the top
    
    const handleScroll = () => {
      // Always keep sticky and show filters
      setIsSticky(true);
      setShowBottomSection(true);
      setLastScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div 
      ref={searchBarRef}
      className={cn(
        "transition-all duration-300 z-30 w-full",
        isSticky ? 
          "sticky top-0 left-0 right-0 shadow-sm" : 
          "relative"
      )}
    >
      {/* Main search bar - modern full-width design with backdrop blur */}
      <div className={cn(
        "w-full py-3 px-4 border-b border-gray-100",
        isSticky ? "bg-white/90 backdrop-blur-sm" : "bg-white"
      )}>
        <div className="flex flex-row items-center gap-2 max-w-7xl mx-auto">
          {/* Search Input */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              className="pl-10 pr-4 py-2 w-full bg-white border border-gray-300 focus:border-[#135341] focus:ring-1 focus:ring-[#135341]/20 rounded-lg shadow-sm focus:shadow-md transition-all duration-200"
              value={searchTerm}
              onChange={handleSearch}
              aria-label="Search professionals"
            />
          </div>

          {/* Filters Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="h-10 flex items-center gap-1.5 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-[#EAF2EF] hover:border-[#135341]/30 transition-all duration-200"
                aria-label="Open filters menu"
              >
                <Filter className="h-4 w-4" />
                {filterButtonText}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-5 shadow-lg border border-gray-200" align="end">
              {filterContent}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Category Tabs with smooth transitions */}
      {tabs.length > 0 && (
        <div 
          className={cn(
            "w-full overflow-hidden transition-all duration-300 ease-in-out",
            isSticky ? "bg-white/90 backdrop-blur-sm border-b border-gray-200" : "bg-white border-b border-gray-200",
            showBottomSection ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="overflow-x-auto py-3 max-w-7xl mx-auto px-5">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => onTabChange && onTabChange(tab.value)}
                  className={cn(
                    "px-5 py-2 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20",
                    tab.value === defaultTab 
                      ? "bg-[#EAF2EF] text-[#135341] shadow-sm" 
                      : "bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  )}
                  aria-label={`Filter by ${tab.label}`}
                  aria-pressed={tab.value === defaultTab}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Scroll to top button - visible when sticky and scrolled down */}
      {isSticky && !showBottomSection && (
        <button
          onClick={() => {
            setShowBottomSection(true);
            window.scrollTo({ top: initialPositionRef.current || 0, behavior: 'smooth' });
          }}
          className="absolute right-4 -bottom-10 bg-white/90 backdrop-blur-sm h-8 w-8 rounded-full shadow-md flex items-center justify-center border border-gray-200 text-gray-500 hover:text-[#135341] hover:border-[#135341]/30 transition-all duration-200"
          aria-label="Show filters and scroll to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}