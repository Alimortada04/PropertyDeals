import { useEffect, useState } from "react";
import { Rep, reps } from "@/lib/rep-data";
import { Button } from "@/components/ui/button";
import { ChevronRight, Users } from "lucide-react";
import RepCard from "./RepCard";

interface SimilarRepsProps {
  currentRep: Rep;
  maxReps?: number;
}

export default function SimilarReps({ currentRep, maxReps = 6 }: SimilarRepsProps) {
  const [similarReps, setSimilarReps] = useState<(Rep & { similarityReason?: string })[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect if mobile view for responsive display
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);
  
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
  
  // Limit displayed REPs based on screen size
  const visibleReps = isMobile ? similarReps.slice(0, 3) : similarReps.slice(0, 6);
  const hasMoreReps = similarReps.length > visibleReps.length;
  
  return (
    <section className="mb-8 mt-10" id="similar-reps">
      {/* Section header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[#09261E]" />
          <h2 className="text-xl font-semibold text-[#09261E]">Other Similar REPs</h2>
        </div>
        
        <Button 
          variant="link" 
          className="text-[#09261E] font-medium"
          onClick={() => window.location.href = '/reps'}
        >
          View All
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
      
      {/* Grid layout for REP cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleReps.map(rep => (
          <RepCard key={rep.id} rep={rep} similarityReason={rep.similarityReason} />
        ))}
      </div>
      
      {/* Link to view all REPs */}
      <Button 
        variant="outline" 
        className="w-full mt-4 border-dashed border-gray-300 text-gray-500 hover:text-[#09261E] hover:border-[#09261E]"
        onClick={() => window.location.href = '/reps'}
      >
        <Users size={16} className="mr-2" />
        <span>Explore all REPs</span>
      </Button>
    </section>
  );
}