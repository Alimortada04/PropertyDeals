import { useState, useEffect } from "react";
import { reps, getRepsByType, Rep } from "@/lib/rep-data";
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

type RepType = 'seller' | 'contractor' | 'agent' | 'lender' | 'appraiser' | 'inspector' | 'mover' | 'landscaper';

export default function RepsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [repType, setRepType] = useState<RepType | 'all'>("all");
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
  
  // Filter reps based on search term, type, and location
  useEffect(() => {
    let results = [...reps];
    
    // Filter by type
    if (repType !== 'all') {
      results = results.filter(rep => rep.type === repType);
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
  }, [searchTerm, repType, location, sortBy]);
  
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
    <div className="container mx-auto px-4 pb-8">
      {/* Page Title - Before sticky search */}
      <div className="pt-4 mb-6">
        <h1 className="text-3xl font-heading font-bold text-[#09261E] mb-2">
          Real Estate Professionals
        </h1>
        <p className="text-gray-600">
          Connect with trusted professionals who can help you navigate the real estate market
        </p>
      </div>
      
      {/* Sticky Search and Filter Section */}
      <StickySearchFilter
        onSearch={setSearchTerm}
        searchPlaceholder="Search professionals by name, specialty, or keyword..."
        tabs={repTabs}
        onTabChange={(value) => setRepType(value as 'all' | RepType)}
        defaultTab="all"
        filterContent={filterContent}
        filterButtonText="Filters"
      />
      
      {/* Results Count */}
      <div className="text-sm text-gray-600 mb-6">
        Found {filteredReps.length} professionals
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
  );
}