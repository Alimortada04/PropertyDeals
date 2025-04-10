import HeroSection from "@/components/home/hero-section";
import PropertyGrid from "@/components/properties/property-grid";
import HowItWorks from "@/components/home/how-it-works";
import CTASection from "@/components/home/cta-section";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { featuredProperties } from "@/lib/data";

export default function HomePage() {
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  // Fallback to featured properties if API fails or is loading
  const displayProperties = properties?.slice(0, 3) || featuredProperties;

  const renderPropertyGrid = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
              <Skeleton className="w-full h-48" />
              <div className="p-5">
                <Skeleton className="h-7 w-1/2 mb-2" />
                <Skeleton className="h-5 w-3/4 mb-3" />
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10">
          <p className="text-red-500 mb-2">Error loading properties</p>
          <p className="text-gray-600">Using fallback data</p>
        </div>
      );
    }

    return <PropertyGrid properties={displayProperties} viewAllLink="/properties" />;
  };

  return (
    <>
      <HeroSection />
      
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-heading font-bold text-[#09261E]">Featured Properties</h2>
            <a href="/properties" className="text-[#135341] hover:text-[#09261E] flex items-center">
              View All
              <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
          
          {renderPropertyGrid()}
        </div>
      </div>
      
      <HowItWorks />
      <CTASection />
    </>
  );
}
