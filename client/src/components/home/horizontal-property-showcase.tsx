import { useState, useRef, useEffect } from "react";
import { Property } from "@shared/schema";
import { ExtendedProperty } from "@/lib/data";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { useScrollAnimation, useParallaxEffect } from "@/hooks/use-scroll-animation";

// Using ExtendedProperty type from data.ts

interface HorizontalPropertyShowcaseProps {
  properties: ExtendedProperty[];
}

export default function HorizontalPropertyShowcase({ properties }: HorizontalPropertyShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { relativePosition } = useParallaxEffect();
  const { ref: animationRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  
  const totalProperties = properties.length;
  
  // Auto scroll when not interacting
  useEffect(() => {
    if (isDragging) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalProperties);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isDragging, totalProperties]);
  
  // Scroll to active property
  useEffect(() => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    const slideWidth = container.clientWidth / 1.5; // Approximate card width
    const newScrollPosition = slideWidth * activeIndex;
    
    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
  }, [activeIndex]);
  
  // Mouse drag to scroll functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    
    // Snap to nearest card
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.clientWidth / 1.5; // Approximate card width
      const index = Math.round(scrollRef.current.scrollLeft / slideWidth);
      setActiveIndex(Math.min(Math.max(0, index), totalProperties - 1));
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  
  const handleScrollNav = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setActiveIndex((prev) => (prev === 0 ? totalProperties - 1 : prev - 1));
    } else {
      setActiveIndex((prev) => (prev + 1) % totalProperties);
    }
  };
  
  const getStatusTag = (property: ExtendedProperty) => {
    // Determine status based on property data
    if (property.offMarketDeal) return { text: "Off-Market", color: "#E59F9F" };
    if (property.newListing) return { text: "New Listing", color: "#09261E" };
    if (property.priceDrop) return { text: "Price Drop", color: "#803344" };
    return { text: "Featured", color: "#135341" };
  };

  return (
    <div 
      ref={containerRef}
      className="relative py-10 w-full overflow-hidden"
    >
      <div ref={animationRef as React.RefObject<HTMLDivElement>} className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        {/* Heading */}
        <div className="container mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#09261E] mb-4">
                <span className="relative">
                  Featured Properties
                  <span className="absolute bottom-1 left-0 h-3 w-24 bg-[#E59F9F]/30 -z-10"></span>
                </span>
              </h2>
              <p className="text-gray-600 max-w-xl">
                Browse our exclusive selection of off-market opportunities not available on traditional listing sites.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full hover:bg-[#09261E] hover:text-white"
                onClick={() => handleScrollNav('prev')}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span className="text-sm text-gray-500 min-w-[60px] text-center">
                {activeIndex + 1} / {totalProperties}
              </span>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full hover:bg-[#09261E] hover:text-white"
                onClick={() => handleScrollNav('next')}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Properties horizontal scroll */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar pb-8 snap-x snap-mandatory max-w-full"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {/* Left padding */}
          <div className="w-[10vw] shrink-0 md:w-[20vw]"></div>
          
          {/* Property cards */}
          {properties.map((property, index) => {
            const status = getStatusTag(property);
            const isActive = index === activeIndex;
            
            return (
              <div 
                key={index} 
                className={`min-w-[85vw] sm:min-w-[70vw] md:min-w-[45vw] lg:min-w-[30vw] xl:min-w-[26vw] px-4 snap-center transition-all duration-300 ${
                  isActive ? 'scale-100' : 'scale-95 opacity-80'
                }`}
              >
                <div 
                  className={`relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-500 ${
                    isActive ? 'shadow-xl ring-2 ring-[#09261E]/10' : 'hover:shadow-xl'
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  {/* Property image */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={property.imageUrl || "https://placehold.co/600x400/e2e8f0/1e293b?text=Property+Image"}
                      alt={property.title}
                      className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                    />
                    
                    {/* Status tag */}
                    <div 
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-white text-center"
                      style={{ color: status.color }}
                    >
                      {status.text}
                    </div>
                    
                    {/* Price */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                      <p className="font-heading font-bold text-lg text-[#09261E]">
                        ${property.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Property details */}
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-xl text-[#09261E] mb-2 line-clamp-1">
                      {property.title}
                    </h3>
                    
                    {/* Address */}
                    <div className="flex items-center text-gray-500 mb-4 text-sm">
                      <MapPin className="h-4 w-4 mr-1 shrink-0" />
                      <span className="truncate">{property.address}</span>
                    </div>
                    
                    {/* Property specs */}
                    <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{property.bedrooms} bed</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{property.bathrooms} bath</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Square className="h-4 w-4 mr-1" />
                        <span>{property.squareFeet?.toLocaleString()} sqft</span>
                      </div>
                    </div>
                    
                    {/* View details button - only fully visible when active */}
                    <div className={`mt-4 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                      <Link href={`/properties/${property.id}`}>
                        <Button className="w-full bg-[#09261E] hover:bg-[#135341] text-white flex items-center justify-center gap-2">
                          <span>View Details</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* View all card */}
          <div className="min-w-[85vw] sm:min-w-[70vw] md:min-w-[45vw] lg:min-w-[30vw] xl:min-w-[26vw] px-4 snap-center">
            <div className="h-full bg-gradient-to-br from-[#09261E] to-[#135341] rounded-xl flex flex-col items-center justify-center p-8 text-white">
              <Home className="h-12 w-12 mb-4 opacity-60" />
              <h3 className="font-heading font-bold text-2xl mb-3">Discover More</h3>
              <p className="text-center text-white/80 mb-6">
                Browse our complete catalog of exclusive off-market properties.
              </p>
              <Link href="/properties">
                <Button className="bg-white text-[#09261E] hover:bg-gray-100 rounded-full px-6">
                  View All Properties
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Right padding */}
          <div className="w-[10vw] shrink-0 md:w-[20vw]"></div>
        </div>
        
        {/* Mobile view all link */}
        <div className="container mx-auto px-4 md:hidden text-center mt-4">
          <Link href="/properties" className="text-[#135341] font-medium inline-flex items-center">
            View All Properties
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
      
      {/* Parallax decorative elements */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div 
          className="absolute top-[15%] right-[10%] w-[25vw] h-[25vw] max-w-[400px] max-h-[400px] rounded-full bg-gradient-to-br from-[#09261E]/5 to-[#09261E]/10 blur-3xl opacity-70"
          style={{
            transform: `translate3d(${relativePosition.x * 20}px, ${relativePosition.y * 20}px, 0)`
          }}
        ></div>
        <div 
          className="absolute bottom-[20%] left-[5%] w-[15vw] h-[15vw] max-w-[300px] max-h-[300px] rounded-full bg-gradient-to-tr from-[#E59F9F]/10 to-[#E59F9F]/5 blur-3xl opacity-60"
          style={{
            transform: `translate3d(${relativePosition.x * -15}px, ${relativePosition.y * -15}px, 0)`
          }}
        ></div>
      </div>
    </div>
  );
}