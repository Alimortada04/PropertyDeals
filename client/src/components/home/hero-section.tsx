import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Users, BarChart3, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  
  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background with parallax effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-[#09261E]/95 to-[#09261E]/85"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
      </div>
      
      <div className="container mx-auto px-4 py-24 md:py-32 lg:py-36 relative z-10">
        <div 
          className="max-w-3xl text-white"
          style={{ 
            transform: `translateY(${scrollY * -0.08}px)`,
            opacity: Math.max(1 - scrollY * 0.002, 0.5)
          }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6 animate-fadeIn">
            Find hidden deals.<br/>
            Connect directly.<br/>
            <span className="text-[#E59F9F]">No middleman.</span>
          </h1>
          <p className="text-xl text-white/90 mb-10 max-w-2xl animate-slideUp">
            Discover exclusive off-market properties and build relationships with verified real estate professionals.
          </p>
          
          {/* Value Proposition Icons */}
          <div className="flex flex-wrap gap-6 mb-10 animate-slideUp">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                <BadgeCheck className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-medium">Off-Market Only</span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-medium">Verified REPs</span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-medium">Deal-Ready Tools</span>
            </div>
          </div>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slideUp">
            <Link href="/properties">
              <Button size="lg" className="bg-white hover:bg-gray-100 text-[#09261E] px-8 py-4 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all">
                Browse Properties
              </Button>
            </Link>
            <Link href="/reps">
              <Button variant="outline" size="lg" className="bg-transparent hover:bg-white/10 text-white border-2 border-white px-8 py-4 text-lg font-medium rounded-full transition-colors">
                Connect with REPs
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute right-0 bottom-0 w-1/3 h-1/2 bg-[#E59F9F]/20 hidden lg:block transform rotate-45 translate-x-1/3 translate-y-1/3 rounded-full"></div>
      <div className="absolute left-0 top-0 w-1/4 h-1/4 bg-white/5 hidden lg:block transform -rotate-45 -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:flex flex-col items-center">
        <span className="text-white/70 text-sm mb-2">Scroll to explore</span>
        <ChevronDown className="h-6 w-6 text-white/70" />
      </div>
      
      {/* Community Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#09261E]/80 backdrop-blur-sm py-4 hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-8 text-white/90 text-sm">
            <div className="flex items-center">
              <span className="mr-2 font-medium">3,200+</span> active members
            </div>
            <div className="flex items-center">
              <span className="mr-2 font-medium">2,100+</span> off-market properties
            </div>
            <div className="flex items-center">
              <span className="mr-2 font-medium">900+</span> verified REPs
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
