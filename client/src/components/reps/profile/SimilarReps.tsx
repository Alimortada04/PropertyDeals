import { useEffect, useState, useRef } from "react";
import { Rep, reps } from "@/lib/rep-data";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import RepCard from "./RepCard";

interface SimilarRepsProps {
  currentRep: Rep;
  maxReps?: number;
}

export default function SimilarReps({ currentRep, maxReps = 6 }: SimilarRepsProps) {
  const [similarReps, setSimilarReps] = useState<(Rep & { similarityReason?: string })[]>([]);
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
        let similarityReason = "";
        
        // Same location 
        if (rep.location.city === currentRep.location.city) {
          score += 40;
          similarityReason = `Also based in ${rep.location.city}`;
        } else if (rep.location.state === currentRep.location.state) {
          score += 20;
          similarityReason = `Also serves ${rep.location.state}`;
        }
        
        // Same role/specialty
        if (rep.role === currentRep.role) {
          score += 30;
          if (!similarityReason) {
            similarityReason = `Also a ${rep.role}`;
          }
        }
        
        // Shared specialties
        if (rep.specialties && currentRep.specialties) {
          const sharedSpecialties = rep.specialties.filter(spec => 
            currentRep.specialties.includes(spec)
          );
          
          if (sharedSpecialties.length > 0) {
            score += sharedSpecialties.length * 10;
            if (!similarityReason) {
              similarityReason = `Specializes in ${sharedSpecialties[0]}`;
            }
          }
        }
        
        // Highly rated REPs get a small boost
        if (rep.rating >= 4.7) {
          score += 10;
          // Don't set similarity reason for this
        }
        
        // Featured REPs get a small boost
        if (rep.isFeatured) {
          score += 5;
          // Don't set similarity reason for this
        }
        
        return {
          ...rep,
          similarityScore: score,
          similarityReason
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
          .slice(0, maxReps - sortedReps.length)
          .map(rep => ({
            ...rep,
            similarityReason: "Recently joined PropertyDeals"
          }));
        
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[#09261E]" />
          <h2 className="text-xl font-semibold text-[#09261E]">Other Similar REPs</h2>
        </div>
        
        {/* Desktop navigation arrows */}
        <div className="hidden md:flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full border-gray-300"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full border-gray-300"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Scrollable REP cards container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {similarReps.map(rep => (
          <div 
            key={rep.id} 
            className="min-w-[220px] w-[220px] snap-start"
          >
            <RepCard rep={rep} similarityReason={rep.similarityReason} />
          </div>
        ))}
      </div>
      
      {/* Link to view all REPs */}
      <div className="flex justify-center mt-4">
        <Button 
          variant="outline" 
          className="border-[#09261E] text-[#09261E] hover:bg-[#09261E]/5"
          onClick={() => window.location.href = '/reps'}
        >
          Explore All REPs
        </Button>
      </div>
      
      {/* We're using inline styles and Tailwind classes to hide scrollbars */}
    </section>
  );
}