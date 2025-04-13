import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { reps } from "@/lib/rep-data";
import RepCard from "@/components/reps/rep-card";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";

export default function RepRoomPreview() {
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Get a mix of different REP types for better diversity
  const featuredReps = reps
    .sort(() => Math.random() - 0.5) // Shuffle to get different REPs each time
    .filter((rep, index, array) => {
      // Make sure we have representation from different types
      const previousTypes = array.slice(0, index).map(r => r.type);
      // First 4 should always be different types if possible
      if (index < 4) {
        return !previousTypes.includes(rep.type);
      }
      return true;
    })
    .slice(0, 6); // Show 6 REPs in the carousel
  
  // Auto-scroll every 5 seconds when not hovering
  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredReps.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [featuredReps.length, isHovering]);

  // Scroll to the current REP
  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollAmount = (currentIndex * scrollContainerRef.current.offsetWidth) / 3; // Assuming 3 cards visible
      scrollContainerRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredReps.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredReps.length);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#F9F9F9]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div className="max-w-xl mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#09261E] mb-4 relative">
              <span className="relative z-10">Trusted REPs. Real Connections.</span>
              <span className="absolute bottom-1 left-0 h-3 w-24 bg-[#E59F9F]/30 -z-0"></span>
            </h2>
            <p className="text-gray-600 text-lg">
              Explore The REP Room to connect with verified real estate professionals who move deals forward.
            </p>
          </div>
          <Link href="/reps">
            <Button className="flex items-center gap-2 bg-[#09261E] hover:bg-[#135341] text-white px-6 py-3 font-medium rounded-full shadow-md hover:shadow-lg transition-all">
              <Users className="h-5 w-5" />
              <span>Meet REPs in your area</span>
            </Button>
          </Link>
        </div>
        
        <div className="relative overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Carousel Navigation */}
          <div className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white border border-gray-200 shadow-md hover:bg-[#09261E] hover:text-white"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white border border-gray-200 shadow-md hover:bg-[#09261E] hover:text-white"
              onClick={handleNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          {/* REP Cards Carousel */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-4 no-scrollbar snap-x snap-mandatory"
          >
            {featuredReps.map((rep, index) => (
              <div 
                key={rep.id} 
                className={`min-w-[300px] md:min-w-[320px] snap-center transition-all duration-300 ${
                  currentIndex === index ? "scale-100 opacity-100" : "scale-95 opacity-80"
                }`}
              >
                <RepCard rep={rep} />
              </div>
            ))}
          </div>
          
          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {featuredReps.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === index ? "w-8 bg-[#09261E]" : "w-2 bg-gray-300"
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-10 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#135341]/10 rounded-full flex items-center justify-center mr-3">
              <span className="font-heading font-bold text-[#135341]">900+</span>
            </div>
            <span>Verified REPs</span>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#135341]/10 rounded-full flex items-center justify-center mr-3">
              <span className="font-heading font-bold text-[#135341]">4.8</span>
            </div>
            <span>Average Rating</span>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#135341]/10 rounded-full flex items-center justify-center mr-3">
              <span className="font-heading font-bold text-[#135341]">24h</span>
            </div>
            <span>Response Time</span>
          </div>
        </div>
      </div>
    </section>
  );
}