import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface PropertyFiltersProps {
  onFilter: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  priceRange: string;
  beds: string;
  baths: string;
  status: string;
}

export default function PropertyFilters({ onFilter }: PropertyFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: "any",
    beds: "any",
    baths: "any",
    status: "any"
  });

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="relative min-w-[140px]">
        <Select
          value={filters.priceRange}
          onValueChange={(value) => handleFilterChange('priceRange', value)}
        >
          <SelectTrigger className="bg-white border border-[#D8D8D8] rounded-md h-10">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Price</SelectItem>
            <SelectItem value="0-200000">Under $200k</SelectItem>
            <SelectItem value="200000-400000">$200k - $400k</SelectItem>
            <SelectItem value="400000-600000">$400k - $600k</SelectItem>
            <SelectItem value="600000-800000">$600k - $800k</SelectItem>
            <SelectItem value="800000+">$800k+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative min-w-[110px]">
        <Select
          value={filters.beds}
          onValueChange={(value) => handleFilterChange('beds', value)}
        >
          <SelectTrigger className="bg-white border border-[#D8D8D8] rounded-md h-10">
            <SelectValue placeholder="Beds" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="1+">1+ bed</SelectItem>
            <SelectItem value="2+">2+ beds</SelectItem>
            <SelectItem value="3+">3+ beds</SelectItem>
            <SelectItem value="4+">4+ beds</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative min-w-[110px]">
        <Select
          value={filters.baths}
          onValueChange={(value) => handleFilterChange('baths', value)}
        >
          <SelectTrigger className="bg-white border border-[#D8D8D8] rounded-md h-10">
            <SelectValue placeholder="Baths" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="1+">1+ bath</SelectItem>
            <SelectItem value="2+">2+ baths</SelectItem>
            <SelectItem value="3+">3+ baths</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative min-w-[120px]">
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <SelectTrigger className="bg-white border border-[#D8D8D8] rounded-md h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Status</SelectItem>
            <SelectItem value="off-market">Off-Market</SelectItem>
            <SelectItem value="exclusive">Exclusive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        variant="outline"
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 h-10"
        onClick={() => {
          const resetFilters = { priceRange: "any", beds: "any", baths: "any", status: "any" };
          setFilters(resetFilters);
          onFilter(resetFilters);
        }}
      >
        Reset Filters
      </Button>
    </div>
  );
}
