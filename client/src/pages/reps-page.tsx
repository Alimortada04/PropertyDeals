import { useState, useEffect } from "react";
import { reps, getRepsByType, Rep } from "@/lib/rep-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, ChevronDown } from "lucide-react";
import RepCard from "@/components/reps/rep-card";

type RepType = 'seller' | 'contractor' | 'agent' | 'lender' | 'appraiser' | 'inspector' | 'mover' | 'landscaper';

export default function RepsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [repType, setRepType] = useState<RepType | 'all'>("all");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [filteredReps, setFilteredReps] = useState<Rep[]>(reps);
  
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#09261E] mb-2">
          Real Estate Professionals
        </h1>
        <p className="text-gray-600">
          Connect with trusted professionals who can help you navigate the real estate market
        </p>
      </div>
      
      {/* Search and Filter Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search professionals by name, specialty, or keyword..."
              className="pl-10 pr-4 py-2 w-full bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-6" align="end">
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
                  <Button>Apply Filters</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Category Tabs */}
        <Tabs defaultValue="all" onValueChange={(value) => setRepType(value as 'all' | RepType)}>
          <TabsList className="w-full md:w-auto flex overflow-x-auto no-scrollbar border-b border-gray-200 mb-2">
            <TabsTrigger 
              value="all" 
              className="flex-1 md:flex-none px-4 py-2 text-sm font-medium"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="seller" 
              className="flex-1 md:flex-none px-4 py-2 text-sm font-medium"
            >
              Seller
            </TabsTrigger>
            <TabsTrigger 
              value="agent" 
              className="flex-1 md:flex-none px-4 py-2 text-sm font-medium"
            >
              Agent
            </TabsTrigger>
            <TabsTrigger 
              value="contractor" 
              className="flex-1 md:flex-none px-4 py-2 text-sm font-medium"
            >
              Contractor
            </TabsTrigger>
            <TabsTrigger 
              value="lender" 
              className="flex-1 md:flex-none px-4 py-2 text-sm font-medium"
            >
              Lender
            </TabsTrigger>
            <TabsTrigger 
              value="appraiser" 
              className="flex-1 md:flex-none px-4 py-2 text-sm font-medium"
            >
              Appraiser
            </TabsTrigger>
            <TabsTrigger 
              value="inspector" 
              className="flex-1 md:flex-none px-4 py-2 text-sm font-medium"
            >
              Inspector
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
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