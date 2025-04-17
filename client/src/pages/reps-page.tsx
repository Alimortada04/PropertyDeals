import { useState, useEffect } from "react";
import { Rep as MockRep } from "@/lib/rep-data";
import { Rep } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import RepCard from "@/components/reps/rep-card";
import StickySearchBar from "@/components/common/sticky-search-bar";
import Breadcrumbs from "@/components/common/breadcrumbs";
import { 
  ToggleGroup,

  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { UserRound, Building2, Loader2 } from "lucide-react";

type RepType = 'seller' | 'contractor' | 'agent' | 'lender' | 'appraiser' | 'inspector' | 'mover' | 'landscaper';
type EntityType = 'individual' | 'business' | 'all';

export default function RepsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [repType, setRepType] = useState<RepType | 'all'>("all");
  const [entityType, setEntityType] = useState<EntityType>("individual");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [filteredReps, setFilteredReps] = useState<Rep[]>([]);
  
  // Fetch reps from API
  const { data: reps, isLoading, isError } = useQuery<Rep[]>({
    queryKey: ['/api/reps'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Define the tab options for the REPs categories
  const repTabs = [
    { value: "all", label: "All" },
    { value: "seller", label: "Sellers" },
    { value: "agent", label: "Agents" },
    { value: "contractor", label: "Contractors" },
    { value: "lender", label: "Lenders" },
    { value: "appraiser", label: "Appraisers" },
    { value: "inspector", label: "Inspectors" },
    { value: "mover", label: "Movers" },
    { value: "landscaper", label: "Landscapers" }
  ];
  
  // Filter reps based on search term, type, entity type, and location
  useEffect(() => {
    if (!reps) return;
    
    let results = [...reps];
    
    // Filter by entity type (person or business)
    if (entityType !== 'all') {
      results = results.filter(rep => rep.entityType === entityType);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(rep => 
        rep.name.toLowerCase().includes(term) || 
        (rep.bio && rep.bio.toLowerCase().includes(term))
      );
    }
    
    // Filter by location
    if (location) {
      const loc = location.toLowerCase();
      results = results.filter(rep => 
        (rep.locationCity && rep.locationCity.toLowerCase().includes(loc)) || 
        (rep.locationState && rep.locationState.toLowerCase().includes(loc))
      );
    }
    
    // Sort results
    switch (sortBy) {
      case "popularity":
        // Sort by rating (highest first)
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name":
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "distance":
        // In a real app, this would use geolocation
        // For now, just randomize
        results.sort(() => 0.5 - Math.random());
        break;
    }
    
    setFilteredReps(results);
  }, [reps, searchTerm, repType, entityType, location, sortBy]);
  
  // Filter modal content
  const filterContent = (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2 text-sm text-gray-700">LOCATION</h4>
        <Input
          placeholder="City, State, or Zip"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      
      <div>
        <h4 className="font-medium mb-2 text-sm text-gray-700">REP TYPE</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'seller', label: 'Sellers' },
            { id: 'agent', label: 'Agents' },
            { id: 'contractor', label: 'Contractors' },
            { id: 'lender', label: 'Lenders' },
            { id: 'appraiser', label: 'Appraisers' },
            { id: 'inspector', label: 'Inspectors' }
          ].map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox 
                id={type.id} 
                checked={repType === type.id}
                onCheckedChange={() => setRepType(repType === type.id ? 'all' : type.id as RepType)}
              />
              <label
                htmlFor={type.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2 text-sm text-gray-700">SORT BY</h4>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Popularity</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="distance">Distance</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => {
          setRepType('all');
          setEntityType('individual');
          setLocation('');
          setSortBy('popularity');
        }}>
          Clear
        </Button>
        <Button className="bg-[#09261E] hover:bg-[#135341]">Apply Filters</Button>
      </div>
    </div>
  );
  
  return (
    <div className="flex flex-col min-h-screen pb-12 bg-white">
      {/* Breadcrumb and Header Section - White background */}
      <div className="w-full bg-white">
        <div className="container mx-auto px-4 pt-16 pb-6 md:pt-6">
          {/* Breadcrumbs */}
          <div className="mb-3">
            <Breadcrumbs />
          </div>
          
          {/* Page Title */}
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#09261E] mb-2">
              The REP Room
            </h1>
            <p className="text-gray-600">
              Connect with trusted Real Estate Professionals (REPs)
            </p>
          </div>
        </div>
      </div>
      
      {/* Enhanced Search and Filter Section */}
      <div className="w-full">
        <StickySearchBar
          onSearch={setSearchTerm}
          searchPlaceholder="Search professionals by name, specialty, or keyword..."
          tabs={repTabs}
          onTabChange={(value: string) => setRepType(value as 'all' | RepType)}
          defaultTab={repType}
          filterContent={filterContent}
          filterButtonText="Filters"
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-grow mt-6">
        <div className="container mx-auto px-4">
          {/* People/Businesses View Toggle and Result Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="text-sm text-gray-600">
              Found {filteredReps.length} professionals
            </div>
            
            <div className="flex items-center bg-gray-200 p-1 rounded-full shadow-sm relative h-10 w-[240px]">
              <div 
                className={`absolute inset-y-1 w-[118px] ${
                  entityType === 'business' ? 'right-1 translate-x-0' : 'left-1 translate-x-0'
                } bg-white rounded-full shadow transition-all duration-300 ease-in-out`}
              ></div>
              <button
                className={`relative z-10 flex items-center justify-center px-4 py-1.5 rounded-full transition-all duration-200 w-[118px] ${
                  entityType === 'individual' 
                    ? 'text-[#09261E] font-medium' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setEntityType('individual')}
              >
                <UserRound size={14} className="mr-1.5" />
                <span className="text-sm">People</span>
              </button>
              
              <button
                className={`relative z-10 flex items-center justify-center px-4 py-1.5 rounded-full transition-all duration-200 w-[118px] ${
                  entityType === 'business' 
                    ? 'text-[#09261E] font-medium' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setEntityType('business')}
              >
                <Building2 size={14} className="mr-1.5" />
                <span className="text-sm">Businesses</span>
              </button>
            </div>
          </div>
          
          {/* Results Grid - Grid on all devices, even smallest mobile */}
          {filteredReps.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {filteredReps.map((rep) => (
                <RepCard key={rep.id} rep={rep} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria to find more professionals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}