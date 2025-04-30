import { useEffect, useState, useRef } from "react";
import { Rep, reps } from "@/lib/rep-data";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import RepCard from "./RepCard";

interface SimilarRepsProps {
  currentRep: Rep;
  maxReps?: number;
}

export default function SimilarReps({ currentRep, maxReps = 10 }: SimilarRepsProps) {
  const [similarReps, setSimilarReps] = useState<Rep[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Handle scrolling the carousel
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    // Find REPs that match the current REP's characteristics
    const findSimilarReps = () => {
      if (!currentRep) return [];
      
      // Exclude current REP from possible matches
      const otherReps = reps.filter(rep => rep.id !== currentRep.id);
      
      // First pass - score all REPs based on similarity
      const scoredReps = otherReps.map(rep => {
        let score = 0;
        
        // Same location 
        if (rep.location.city === currentRep.location.city) {
          score += 40;
        } else if (rep.location.state === currentRep.location.state) {
          score += 20;
        }
        
        // Same role/specialty
        if (rep.role === currentRep.role) {
          score += 30;
        }
        
        // Shared specialties
        if (rep.specialties && currentRep.specialties) {
          const sharedSpecialties = rep.specialties.filter(spec => 
            currentRep.specialties.includes(spec)
          );
          
          if (sharedSpecialties.length > 0) {
            score += sharedSpecialties.length * 10;
          }
        }
        
        // Highly rated REPs get a small boost
        if (rep.rating >= 4.7) {
          score += 10;
        }
        
        // Featured REPs get a small boost
        if (rep.isFeatured) {
          score += 5;
        }
        
        return {
          ...rep,
          similarityScore: score
        };
      });
      
      // Sort by score and take top results
      const sortedReps = scoredReps
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, maxReps);
      
      // Add 1-2 random REPs for variety if we don't have enough matches
      if (sortedReps.length < maxReps) {
        const remainingReps = scoredReps
          .filter(rep => !sortedReps.some(r => r.id === rep.id))
          .sort(() => 0.5 - Math.random())
          .slice(0, maxReps - sortedReps.length);
        
        sortedReps.push(...remainingReps);
      }
      
      return sortedReps;
    };
    
    setSimilarReps(findSimilarReps());
  }, [currentRep, maxReps]);
  
  if (similarReps.length === 0) {
    return null;
  }
  
  return (
    <section className="mb-8 mt-10" id="similar-reps">
      {/* Section header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[#09261E]" />
          <h2 className="text-xl font-semibold text-[#09261E]">Other Similar REPs</h2>
        </div>
        
        {/* Desktop navigation arrows */}
        <div className="flex items-center gap-2">
          <button 
            className="flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button 
            className="flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Scrollable carousel for REP cards */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {similarReps.map(rep => (
          <div 
            key={rep.id} 
            className="min-w-[150px] w-[150px] flex-shrink-0 snap-start"
          >
            <RepCard rep={rep} />
          </div>
        ))}
      </div>
      
      {/* Link to view all REPs */}
      <button 
        className="w-full mt-4 px-5 py-2 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200 flex items-center justify-center"
        onClick={() => window.location.href = '/reps'}
      >
        <Users size={16} className="mr-2" />
        <span>Explore all REPs</span>
      </button>
      
      {/* Custom styles applied with inline style and class */}
    </section>
  );
}