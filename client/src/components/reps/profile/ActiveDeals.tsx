import { useState } from "react";
import { Property } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  ChevronDown 
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ActiveDealsProps {
  properties: Property[];
}

export default function ActiveDeals({ properties }: ActiveDealsProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState({
    priceRange: [0, 5000000],
    propertyType: 'all'
  });
  
  // Apply filters
  const filteredProperties = properties.filter(property => {
    const price = property.price || 0;
    const type = property.propertyType || '';
    
    const matchesPrice = price >= filter.priceRange[0] && price <= filter.priceRange[1];
    const matchesType = filter.propertyType === 'all' || type === filter.propertyType;
    
    return matchesPrice && matchesType;
  });
  
  return (
    <section id="active-deals" className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-heading font-bold text-gray-800">
            Active Deals
            <span className="ml-2 text-lg text-gray-500">{filteredProperties.length}</span>
          </h2>
          
          <Button 
            variant="ghost" 
            onClick={() => setFilterOpen(!filterOpen)}
            className="text-gray-600 hover:bg-gray-100"
          >
            Filter
            <ChevronDown size={16} className={`ml-1 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        {/* Filters */}
        {filterOpen && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200 transition-all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Price Range</label>
                <div className="flex gap-2 items-center">
                  <select 
                    className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                    value={filter.priceRange[0]}
                    onChange={(e) => setFilter({
                      ...filter,
                      priceRange: [parseInt(e.target.value), filter.priceRange[1]]
                    })}
                  >
                    <option value={0}>$0</option>
                    <option value={100000}>$100,000</option>
                    <option value={250000}>$250,000</option>
                    <option value={500000}>$500,000</option>
                    <option value={750000}>$750,000</option>
                    <option value={1000000}>$1,000,000</option>
                  </select>
                  <span className="text-gray-500">to</span>
                  <select 
                    className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                    value={filter.priceRange[1]}
                    onChange={(e) => setFilter({
                      ...filter,
                      priceRange: [filter.priceRange[0], parseInt(e.target.value)]
                    })}
                  >
                    <option value={250000}>$250,000</option>
                    <option value={500000}>$500,000</option>
                    <option value={750000}>$750,000</option>
                    <option value={1000000}>$1,000,000</option>
                    <option value={2000000}>$2,000,000</option>
                    <option value={5000000}>$5,000,000+</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Property Type</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  value={filter.propertyType}
                  onChange={(e) => setFilter({
                    ...filter,
                    propertyType: e.target.value
                  })}
                >
                  <option value="all">All Property Types</option>
                  <option value="single-family">Single Family</option>
                  <option value="multi-family">Multi-Family</option>
                  <option value="condo">Condo</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Grid of Properties */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property, index) => (
              <PropertyCard key={index} property={property} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-8 text-center">
              <Home className="h-16 w-16 text-gray-300 mb-2" />
              <h3 className="text-xl font-medium text-gray-700 mb-1">No Active Deals</h3>
              <p className="text-gray-500 max-w-md">
                There are no active deals matching your filters. Try adjusting your filters or check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={property.imageUrl || 'https://placehold.co/400x250/e6e6e6/09261E?text=Property'}
          alt={property.title}
          className="h-48 w-full object-cover"
        />
        
        {/* Property Tags */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {property.isOffMarket && (
            <Badge className="bg-amber-500 text-white border-0 px-2 py-1 text-xs">
              Off Market
            </Badge>
          )}
          {property.isNewListing && (
            <Badge className="bg-green-500 text-white border-0 px-2 py-1 text-xs">
              New Listing
            </Badge>
          )}
          {property.hasPriceDrop && (
            <Badge className="bg-blue-500 text-white border-0 px-2 py-1 text-xs">
              Price Drop
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-gray-800 line-clamp-1">{property.title}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={14} className="mr-1 text-gray-400" />
              <span className="line-clamp-1">{property.address}</span>
            </div>
          </div>
          <span className="font-bold text-lg text-[#09261E]">
            {formatCurrency(property.price || 0)}
          </span>
        </div>
        
        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-gray-100 my-2 text-sm">
          {property.bedrooms && (
            <div className="text-center">
              <div className="font-semibold text-gray-800">{property.bedrooms}</div>
              <div className="text-gray-500 text-xs">Beds</div>
            </div>
          )}
          {property.bathrooms && (
            <div className="text-center">
              <div className="font-semibold text-gray-800">{property.bathrooms}</div>
              <div className="text-gray-500 text-xs">Baths</div>
            </div>
          )}
          {property.squareFeet && (
            <div className="text-center">
              <div className="font-semibold text-gray-800">{property.squareFeet.toLocaleString()}</div>
              <div className="text-gray-500 text-xs">Sq Ft</div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center mt-2">
          {property.listedDate && (
            <div className="flex items-center text-xs text-gray-500">
              <Calendar size={14} className="mr-1" />
              <span>Listed {new Date(property.listedDate).toLocaleDateString()}</span>
            </div>
          )}
          
          <Button variant="ghost" size="sm" className="text-[#09261E] hover:bg-[#09261E]/10 p-0 h-8 w-8">
            <ArrowRight size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}