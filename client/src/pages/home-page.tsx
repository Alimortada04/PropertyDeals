import { useState, useEffect, useRef } from "react";
import HeroSection from "@/components/home/hero-section";
import PropertyGrid from "@/components/properties/property-grid";
import RepRoomPreview from "@/components/home/rep-room-preview";
import ToolsTeaser from "@/components/home/tools-teaser";
import CommunityPreview from "@/components/home/community-preview";
import CTASection from "@/components/home/cta-section";
import Footer from "@/components/layout/footer";
import StickySearchBar from "@/components/home/sticky-search-bar";
import BackToTop from "@/components/layout/back-to-top";
import ImmersiveFeatures from "@/components/home/immersive-features";
import HorizontalPropertyShowcase from "@/components/home/horizontal-property-showcase";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { featuredProperties } from "@/lib/data";

// Helper function for scroll animations
function ScrollAnimationSection({ 
  children, 
  className = "", 
  threshold = 0.2 
}: { 
  children: React.ReactNode, 
  className?: string, 
  threshold?: number 
}) {
  const { ref, isVisible } = useScrollAnimation({ threshold });
  
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>} 
      className={`${className} transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const homePageRef = useRef<HTMLDivElement>(null);
  
  // Handle scroll and mouse events for animations
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 100);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (homePageRef.current) {
        setMousePosition({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight
        });
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
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
    <div ref={homePageRef} className="relative overflow-hidden">
      {/* Hero Section - Full height splash with animated components */}
      <HeroSection />
      
      {/* Sticky Search Bar - Appears on scroll */}
      <StickySearchBar />
      
      {/* Immersive Features Section - Story-based scrolling experience */}
      <ScrollAnimationSection>
        <ImmersiveFeatures />
      </ScrollAnimationSection>
      
      {/* Featured Properties Preview - Horizontal scrolling cards */}
      <div className="py-12 bg-white relative">
        <HorizontalPropertyShowcase properties={displayProperties} />
      </div>
      
      {/* REP Room Preview - Interactive carousel */}
      <ScrollAnimationSection className="w-full">
        <RepRoomPreview />
      </ScrollAnimationSection>
      
      {/* Tools Teaser - Interactive calculator previews */}
      <ScrollAnimationSection className="w-full" threshold={0.1}>
        <ToolsTeaser />
      </ScrollAnimationSection>
      
      {/* Community Preview - Discussion highlights */}
      <ScrollAnimationSection className="w-full" threshold={0.1}>
        <CommunityPreview />
      </ScrollAnimationSection>
      
      {/* Final Call to Action - Bold statement and signup */}
      <ScrollAnimationSection className="w-full bg-gradient-to-b from-white to-[#F9F9F9] py-24" threshold={0.3}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#09261E] mb-6 max-w-4xl mx-auto leading-tight">
            PropertyDeals isn't a platform.
            <span className="block relative mt-2">
              <span className="relative inline-block z-10">
                It's your competitive edge.
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-[#E59F9F]/40 -z-10"></span>
              </span>
            </span>
          </h2>
          
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-10">
            Join thousands of investors who are finding better deals, connecting with trusted professionals, and closing faster.
          </p>
          
          <Link href="/auth">
            <button className="bg-[#09261E] hover:bg-[#135341] text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all">
              Sign Up Free
            </button>
          </Link>
        </div>
      </ScrollAnimationSection>
      
      {/* Footer */}
      <Footer />
      
      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}
