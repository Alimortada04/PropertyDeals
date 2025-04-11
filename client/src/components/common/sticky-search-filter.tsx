import { useState, useEffect, ReactNode } from "react";
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
import { X } from "lucide-react";

interface StickySearchFilterProps {
  onSearch: (value: string) => void;
  searchPlaceholder?: string;
  tabs?: { value: string; label: string }[];
  onTabChange?: (value: string) => void;
  defaultTab?: string;
  filterContent?: ReactNode;
  filterButtonText?: string;
}

export default function StickySearchFilter({
  onSearch,
  searchPlaceholder = "Search...",
  tabs = [],
  onTabChange,
  defaultTab = "all",
  filterContent,
  filterButtonText = "Filters"
}: StickySearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [hideSearch, setHideSearch] = useState(false);
  const isMobile = useIsMobile();
  
  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };
  
  // Make the search/filter bar sticky on scroll and hide search on scroll down
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const offset = isMobile ? 60 : 80; // Allow for the top navbar
      setIsSticky(window.scrollY > offset);
      
      // Only hide search when scrolling down beyond the threshold
      if (window.scrollY > offset + 50) {
        setHideSearch(window.scrollY > lastScrollY);
      } else {
        setHideSearch(false);
      }
      
      lastScrollY = window.scrollY;
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);
  
  return (
    <div 
      className={cn(
        "bg-white transition-all duration-200 z-30 py-0 mt-0",
        isSticky ? "sticky top-0 lg:top-14 left-0 right-0 shadow-md" : ""
      )}
    >
      <div className="container mx-auto px-4 py-4">
        {/* Search and Filter Row - hides on scroll down */}
        <div className={cn(
          "flex flex-col md:flex-row gap-4 items-center mb-4 transition-all duration-300",
          hideSearch && isSticky ? "max-h-0 opacity-0 overflow-hidden mb-0" : "max-h-20 opacity-100"
        )}>
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              className="pl-10 pr-4 py-2 w-full bg-white hover:border-gray-400"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          {/* Filter Button */}
          {filterContent && (
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex-shrink-0 flex items-center gap-2 hover:bg-[#EAF2EF] hover:border-[#09261E]"
                >
                  <Filter className="h-4 w-4" />
                  {filterButtonText}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[350px] p-5 shadow-lg" align="end">
                {filterContent}
              </PopoverContent>
            </Popover>
          )}
        </div>
        
        {/* Category Tabs - styled as rounded rectangles */}
        {tabs.length > 0 && (
          <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
            <Tabs 
              defaultValue={defaultTab} 
              onValueChange={onTabChange}
              className="w-full"
            >
              <TabsList className="h-10 bg-transparent w-full flex items-center justify-start overflow-x-auto no-scrollbar border-b border-gray-200">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex-shrink-0 h-9 px-4 rounded-md mr-2 border border-transparent
                    data-[state=active]:bg-white data-[state=active]:text-[#09261E] data-[state=active]:border-[#09261E]
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
        )}
      </div>
    </div>
  );
}