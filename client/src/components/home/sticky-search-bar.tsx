import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Home, DollarSign, Filter } from "lucide-react";

export default function StickySearchBar() {
  const [isSticky, setIsSticky] = useState(false);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [, navigate] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Make sticky after hero section (adjust value based on hero height)
      const heroHeight = window.innerHeight * 0.85;
      setIsSticky(window.scrollY > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query params
    let queryParams = new URLSearchParams();
    if (location) queryParams.append("location", location);
    if (propertyType) queryParams.append("type", propertyType);
    if (priceRange) queryParams.append("price", priceRange);
    
    const queryString = queryParams.toString();
    navigate(`/properties${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div
      className={`w-full bg-white transition-all duration-300 z-30 border-b border-gray-200 ${
        isSticky ? "fixed top-0 shadow-md" : "relative"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3">
          <div className="flex items-center flex-grow min-w-[250px] border rounded-full px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-[#135341] focus-within:border-[#135341]">
            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
            <Input 
              placeholder="Location"
              className="border-none shadow-none focus-visible:outline-none focus-visible:ring-0 p-0 text-base placeholder:text-gray-400"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <div className="flex items-center w-full sm:w-auto min-w-[200px] border rounded-full px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-[#135341] focus-within:border-[#135341]">
            <Home className="h-5 w-5 text-gray-400 mr-2" />
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="border-0 shadow-none focus:ring-0 p-0 h-9 w-full">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-family">Single Family</SelectItem>
                <SelectItem value="multi-family">Multi-Family</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center w-full sm:w-auto min-w-[200px] border rounded-full px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-[#135341] focus-within:border-[#135341]">
            <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="border-0 shadow-none focus:ring-0 p-0 h-9 w-full">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-200000">$0 - $200k</SelectItem>
                <SelectItem value="200000-500000">$200k - $500k</SelectItem>
                <SelectItem value="500000-1000000">$500k - $1M</SelectItem>
                <SelectItem value="1000000-9999999">$1M+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="bg-[#09261E] hover:bg-[#135341] text-white px-6 py-2 h-10 rounded-full min-w-[120px] flex items-center justify-center"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            className="border-[#135341] text-[#135341] hover:bg-[#135341] hover:text-white px-4 rounded-full h-10"
            onClick={() => navigate("/properties?filter=all")}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </form>
      </div>
    </div>
  );
}