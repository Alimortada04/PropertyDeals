import { useState, useEffect } from "react";
import HeroSection from "@/components/home/hero-section";
import PropertyGrid from "@/components/properties/property-grid";
import HowItWorks from "@/components/home/how-it-works";
import RepRoomPreview from "@/components/home/rep-room-preview";
import ToolsTeaser from "@/components/home/tools-teaser";
import CommunityPreview from "@/components/home/community-preview";
import CTASection from "@/components/home/cta-section";
import Footer from "@/components/layout/footer";
import StickySearchBar from "@/components/home/sticky-search-bar";
import BackToTop from "@/components/layout/back-to-top";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { featuredProperties } from "@/lib/data";

export default function HomePage() {
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Handle scroll event to add animations
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 100);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  // Fallback to featured properties if API fails or is loading
  const displayProperties = properties?.slice(0, 6) || featuredProperties;

  const renderPropertyGrid = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
      {/* Hero Section */}
      <HeroSection />
      
      {/* Sticky Search Bar */}
      <StickySearchBar />
      
      {/* Featured Properties Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-xl mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#09261E] mb-4 relative">
                <span className="relative z-10">Featured Properties</span>
                <span className="absolute bottom-1 left-0 h-3 w-24 bg-[#E59F9F]/30 -z-0"></span>
              </h2>
              <p className="text-gray-600 text-lg">
                Discover our handpicked selection of exclusive off-market real estate opportunities.
              </p>
            </div>
            <Link href="/properties" 
              className="text-[#135341] hover:text-[#09261E] flex items-center font-medium transition-colors group"
            >
              View All Listings
              <ArrowRight className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {/* Property Cards with animation */}
          <div className={`transition-all duration-700 ${hasScrolled ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-90'}`}>
            {renderPropertyGrid()}
          </div>
        </div>
      </section>
      
      {/* REP Room Preview */}
      <RepRoomPreview />
      
      {/* Tools Teaser */}
      <ToolsTeaser />
      
      {/* Community Preview */}
      <CommunityPreview />
      
      {/* How PropertyDeals Works */}
      <HowItWorks />
      
      {/* Final Call to Action */}
      <CTASection />
      
      {/* Footer */}
      <Footer />
      
      {/* Back to Top Button */}
      <BackToTop />
    </>
  );
}
