import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { CheckCircle2, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface PropertyFiltersProps {
  onFilter: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  priceRange: string;
  beds: string;
  baths: string;
  status: string;
  propertyType?: string;
  investmentType?: string;
  tier?: string;
  squareFootage?: string;
  seller?: string;
  location?: string;
}

export default function PropertyFilters({ onFilter }: PropertyFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: "any",
    beds: "any",
    baths: "any",
    status: "any",
    propertyType: "",
    investmentType: "",
    tier: "",
    squareFootage: "",
    seller: "",
    location: ""
  });

  const [priceRange, setPriceRange] = useState([0, 10000000]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };
  
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price}`;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="filters" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="filters" className="flex-1">Filters</TabsTrigger>
          <TabsTrigger value="saved" className="flex-1">Saved Searches</TabsTrigger>
        </TabsList>
        
        <TabsContent value="filters" className="space-y-6">
          {/* Price Range Slider */}
          <div>
            <h3 className="text-sm font-semibold mb-4">PRICE RANGE</h3>
            <div className="space-y-6">
              <Slider
                value={priceRange}
                min={0}
                max={10000000}
                step={100000}
                onValueChange={(values) => {
                  setPriceRange(values);
                  handleFilterChange('priceRange', `${values[0]}-${values[1]}`);
                }}
                className="mt-6"
              />
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs mb-1 text-gray-500">Min Price</p>
                  <Input
                    type="text"
                    value={formatPrice(priceRange[0])}
                    className="h-9"
                    onChange={(e) => {
                      // Handle manual input
                    }}
                  />
                </div>
                <div className="pt-5">—</div>
                <div>
                  <p className="text-xs mb-1 text-gray-500">Max Price</p>
                  <Input 
                    type="text"
                    value={formatPrice(priceRange[1])}
                    className="h-9"
                    onChange={(e) => {
                      // Handle manual input
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Beds & Baths */}
          <div className="flex flex-col space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3">BEDS & BATHS</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs mb-1 text-gray-500">Beds</p>
                  <Select
                    value={filters.beds}
                    onValueChange={(value) => handleFilterChange('beds', value)}
                  >
                    <SelectTrigger className="bg-white border border-[#D8D8D8] rounded-md h-9">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1+">1+</SelectItem>
                      <SelectItem value="2+">2+</SelectItem>
                      <SelectItem value="3+">3+</SelectItem>
                      <SelectItem value="4+">4+</SelectItem>
                      <SelectItem value="5+">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs mb-1 text-gray-500">Baths</p>
                  <Select
                    value={filters.baths}
                    onValueChange={(value) => handleFilterChange('baths', value)}
                  >
                    <SelectTrigger className="bg-white border border-[#D8D8D8] rounded-md h-9">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1+">1+</SelectItem>
                      <SelectItem value="1.5+">1.5+</SelectItem>
                      <SelectItem value="2+">2+</SelectItem>
                      <SelectItem value="3+">3+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Property Type */}
          <div>
            <h3 className="text-sm font-semibold mb-3">PROPERTY TYPE</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'single-family', label: 'Single Family' },
                { id: 'multi-family', label: 'Multi Family' },
                { id: 'condo', label: 'Condo' },
                { id: 'townhouse', label: 'Townhouse' },
                { id: 'land', label: 'Land' }
              ].map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`prop-${type.id}`} 
                    checked={filters.propertyType === type.id}
                    onCheckedChange={() => 
                      handleFilterChange('propertyType', filters.propertyType === type.id ? '' : type.id)
                    }
                  />
                  <label
                    htmlFor={`prop-${type.id}`}
                    className="text-sm leading-none cursor-pointer"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Investment Type */}
          <div>
            <h3 className="text-sm font-semibold mb-3">INVESTMENT TYPE</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'flip', label: 'Flip' },
                { id: 'buy-hold', label: 'Buy & Hold' }
              ].map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`inv-${type.id}`} 
                    checked={filters.investmentType === type.id}
                    onCheckedChange={() => 
                      handleFilterChange('investmentType', filters.investmentType === type.id ? '' : type.id)
                    }
                  />
                  <label
                    htmlFor={`inv-${type.id}`}
                    className="text-sm leading-none cursor-pointer"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Tier */}
          <div>
            <h3 className="text-sm font-semibold mb-3">TIER</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'general', label: 'General' },
                { id: 'exclusive', label: 'Exclusive' }
              ].map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`tier-${type.id}`} 
                    checked={filters.tier === type.id}
                    onCheckedChange={() => 
                      handleFilterChange('tier', filters.tier === type.id ? '' : type.id)
                    }
                  />
                  <label
                    htmlFor={`tier-${type.id}`}
                    className="text-sm leading-none cursor-pointer"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Location */}
          <div>
            <h3 className="text-sm font-semibold mb-3">LOCATION</h3>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="City, State, or ZIP"
                className="h-9"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
          </div>
          
          <Separator />
          
          {/* Buttons */}
          <div className="flex justify-between pt-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => {
                const resetFilters = { 
                  priceRange: "any", 
                  beds: "any", 
                  baths: "any", 
                  status: "any",
                  propertyType: "",
                  investmentType: ""
                };
                setFilters(resetFilters);
                setPriceRange([0, 1000000]);
                onFilter(resetFilters);
              }}
              className="text-sm"
            >
              <X className="h-4 w-4 mr-1" /> Clear All
            </Button>
            <Button 
              className="bg-[#09261E] hover:bg-[#135341] text-sm"
              size="sm"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" /> Apply Filters
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="saved" className="h-[400px] flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p>You don't have any saved searches yet</p>
            <p className="text-sm mt-2">Your saved searches will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
