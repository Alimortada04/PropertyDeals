import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Link } from 'wouter';
import { ExtendedProperty } from '@/lib/data';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyCardProps {
  property: ExtendedProperty;
  isActive: boolean;
}

const PropertyCard = ({ property, isActive }: PropertyCardProps) => {
  return (
    <Link 
      href={`/p/${property.id}`}
      className={`relative flex-[0_0_85%] sm:flex-[0_0_70%] md:flex-[0_0_45%] lg:flex-[0_0_35%] mx-3 h-[450px] rounded-2xl bg-white overflow-hidden border-4 border-white shadow-xl will-change-transform group cursor-pointer transform-gpu transition-all duration-500 ease-out ${
        isActive 
          ? 'scale-100 opacity-100 shadow-2xl' 
          : 'scale-[0.85] opacity-90 shadow-lg'
      }`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Property image with zoom effect */}
      <div className="h-[60%] bg-[#09261E]/5 overflow-hidden relative">
        <div 
          className="absolute inset-0 bg-center bg-cover transition-all duration-700 group-hover:scale-110 will-change-transform"
          style={{ 
            backgroundImage: `url(${property.imageUrl})` 
          }}
        />
        
        {/* Property tags */}
        {property.offMarketDeal && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-[#E59F9F] shadow-sm z-10">
            Off-Market Deal
          </div>
        )}
        {property.newListing && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-[#135341] shadow-sm z-10">
            New Listing
          </div>
        )}
        {property.priceDrop && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-[#803344] shadow-sm z-10">
            Price Drop
          </div>
        )}
        
        {/* Price tag */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm z-10">
          <p className="font-heading font-bold text-lg text-[#09261E]">
            ${property.price?.toLocaleString()}
          </p>
        </div>
        
        {/* Avatar stack positioned above and right */}
        <div className="absolute -right-1 -top-2 transform -translate-x-[15%] z-20">
          <div className="flex -space-x-2">
            {[0, 1, 2].map((idx) => (
              <div 
                key={idx}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white will-change-transform transition-all"
                style={{ 
                  background: idx === 0 ? '#13534130' : idx === 1 ? '#13534120' : '#13534125',
                  color: '#135341',
                  zIndex: 3 - idx
                }}
              >
                {idx === 0 ? 'JD' : idx === 1 ? 'TS' : 'RB'}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Property details */}
      <div className="p-4 h-[40%] flex flex-col justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg text-[#09261E] truncate">
            {property.title}
          </h3>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="truncate">{property.city}, {property.state}</span>
          </div>
        </div>
        
        {/* Property specs */}
        <div className="flex justify-between items-center mt-3">
          <div className="text-xs text-gray-600">{property.bedrooms} bed</div>
          <div className="text-xs text-gray-600">{property.bathrooms} bath</div>
          <div className="text-xs text-gray-600">{property.squareFeet?.toLocaleString()} sqft</div>
        </div>
      </div>
    </Link>
  );
};

interface PropertyCarouselProps {
  properties: ExtendedProperty[];
  scrollY: number;
}

export default function PropertyCarousel({ properties, scrollY }: PropertyCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
  });
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);
  
  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    
    // Autoplay functionality
    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0); // Restart from beginning
      }
    }, 5000); // Change slide every 5 seconds
    
    return () => {
      clearInterval(interval);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);
  
  return (
    <div 
      className="relative w-full h-full max-w-[1200px] mx-auto"
      style={{
        transform: `translateY(${-scrollY * 0.05}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {properties.map((property, index) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              isActive={index === activeIndex} 
            />
          ))}
        </div>
      </div>
      
      {/* Navigation arrows */}
      <Button 
        onClick={scrollPrev} 
        className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 rounded-full size-12 p-0 bg-white/90 backdrop-blur-sm text-[#09261E] hover:bg-white hover:text-[#135341] border border-gray-200 shadow-lg z-30"
        variant="outline"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button 
        onClick={scrollNext} 
        className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 rounded-full size-12 p-0 bg-white/90 backdrop-blur-sm text-[#09261E] hover:bg-white hover:text-[#135341] border border-gray-200 shadow-lg z-30"
        variant="outline"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      
      {/* Dots indicator */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-2 mb-4">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`size-2 rounded-full transition-all ${
              index === activeIndex 
                ? 'bg-[#135341] w-4' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}