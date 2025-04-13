import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { reps } from "@/lib/rep-data";
import RepCard from "@/components/reps/rep-card";

export default function RepRoomPreview() {
  const [location, setLocation] = useLocation();
  
  // Get a mix of different REP types (limit to 4)
  const featuredReps = reps
    .filter((rep, index) => index < 4)
    .filter((rep, index, filtered) => {
      // Ensure we don't have more than 2 of the same type
      const sameTypeCount = filtered.slice(0, index).filter(r => r.type === rep.type).length;
      return sameTypeCount < 2;
    });

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-4">
            Trusted REPs. Real Connections.
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore The REP Room to connect with real estate professionals who move deals forward.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {featuredReps.map(rep => (
            <RepCard key={rep.id} rep={rep} />
          ))}
        </div>
        
        <div className="flex justify-center">
          <Link href="/reps">
            <Button className="bg-[#09261E] hover:bg-[#135341] text-white px-6 py-3 font-medium">
              Browse REPs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}