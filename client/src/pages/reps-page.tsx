import { useState, useEffect } from "react";
import { reps, getRepsByType, getRepsByEntityType, Rep } from "@/lib/rep-data";
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
import StickySearchFilter from "@/components/common/sticky-search-filter";
import Breadcrumbs from "@/components/common/breadcrumbs";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { UserRound, Building2 } from "lucide-react";

type RepType = 'seller' | 'contractor' | 'agent' | 'lender' | 'appraiser' | 'inspector' | 'mover' | 'landscaper';
type EntityType = 'person' | 'business' | 'all';

export default function RepsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [repType, setRepType] = useState<RepType | 'all'>("all");
  const [entityType, setEntityType] = useState<EntityType>("all");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [filteredReps, setFilteredReps] = useState<Rep[]>(reps);
  
  // Define the tab options for the REPs categories
  const repTabs = [
    { value: "all", label: "All" },
    { value: "seller", label: "Seller" },
    { value: "agent", label: "Agent" },
    { value: "contractor", label: "Contractor" },
    { value: "lender", label: "Lender" },
    { value: "appraiser", label: "Appraiser" },
    { value: "inspector", label: "Inspector" },
    { value: "mover", label: "Mover" },
    { value: "landscaper", label: "Landscaper" }
  ];
  
  // Filter reps based on search term, type, entity type, and location
  useEffect(() => {
    let results = [...reps];
    
    // Filter by professional type
    if (repType !== 'all') {
      results = results.filter(rep => rep.type === repType);
    }
    
    // Filter by entity type (person or business)
    if (entityType !== 'all') {
      results = results.filter(rep => rep.entityType === entityType);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(rep => 
        rep.name.toLowerCase().includes(term) || 
        rep.tagline.toLowerCase().includes(term) ||
        rep.bio.toLowerCase().includes(term)
      );
    }
    
    // Filter by location
    if (location) {
      const loc = location.toLowerCase();
      results = results.filter(rep => 
        rep.location.city.toLowerCase().includes(loc) || 
        rep.location.state.toLowerCase().includes(loc)
      );
    }
    
    // Sort results
    switch (sortBy) {
      case "popularity":
        // For demo purposes, we'll just randomize
        results.sort(() => 0.5 - Math.random());
        break;
      case "name":
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "distance":
        // In a real app, this would use geolocation
        results.sort(() => 0.5 - Math.random());
        break;
    }
    
    setFilteredReps(results);
  }, [searchTerm, repType, entityType, location, sortBy]);
  
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
            { id: 'seller', label: 'Seller' },
            { id: 'agent', label: 'Agent' },
            { id: 'contractor', label: 'Contractor' },
            { id: 'lender', label: 'Lender' },
            { id: 'appraiser', label: 'Appraiser' },
            { id: 'inspector', label: 'Inspector' }
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
          setEntityType('all');
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
    <div className="flex flex-col min-h-screen pb-12 bg-gray-50">
      {/* Breadcrumb and Header Section - White background */}
      <div className="w-full bg-white">
        <div className="container mx-auto px-4 pt-6 pb-6">
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
      
      {/* Sticky Search and Filter Section */}
      <div className="sticky top-0 lg:top-0 md:top-16 z-30 bg-white pb-0 px-0 w-full left-0 right-0">
        <div className="w-full">
          <StickySearchFilter
            onSearch={setSearchTerm}
            searchPlaceholder="Search professionals by name, specialty, or keyword..."
            tabs={repTabs}
            onTabChange={(value) => setRepType(value as 'all' | RepType)}
            defaultTab="all"
            filterContent={filterContent}
            filterButtonText="Filters"
          />
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-grow mt-6">
        <div className="container mx-auto px-4">
          {/* People/Businesses View Toggle and Result Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="text-sm text-gray-600">
              Found {filteredReps.length} professionals
            </div>
            
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <ToggleGroup 
                type="single" 
                value={entityType !== 'business' ? 'people' : 'businesses'}
                onValueChange={(value) => {
                  if (value === 'people') setEntityType('person');
                  else if (value === 'businesses') setEntityType('business');
                  else setEntityType('all');
                }}
                className="bg-white"
              >
                <ToggleGroupItem value="all" aria-label="All" onClick={() => setEntityType('all')}
                  className={`px-3 py-2 ${entityType === 'all' ? 'bg-[#09261E] text-white' : ''}`}
                >
                  All
                </ToggleGroupItem>
                <ToggleGroupItem value="people" aria-label="People"
                  className={`px-3 py-2 ${entityType === 'person' ? 'bg-[#09261E] text-white' : ''}`}
                >
                  <UserRound size={18} className="mr-1" />
                  People
                </ToggleGroupItem>
                <ToggleGroupItem value="businesses" aria-label="Businesses"
                  className={`px-3 py-2 ${entityType === 'business' ? 'bg-[#09261E] text-white' : ''}`}
                >
                  <Building2 size={18} className="mr-1" />
                  Businesses
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
          
          {/* Results Grid */}
          {filteredReps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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