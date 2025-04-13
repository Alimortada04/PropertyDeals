import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Users, MapPin } from "lucide-react";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Track scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Trigger entrance animations
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div ref={heroRef} className="relative bg-white overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -right-20 bottom-10 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#09261E]/5 to-[#09261E]/20 blur-xl"
          style={{
            transform: `translate3d(${scrollY * 0.05}px, ${scrollY * -0.05}px, 0)`,
          }}
        />
        <div 
          className="absolute -left-20 -bottom-40 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#E59F9F]/10 to-[#E59F9F]/20 blur-xl"
          style={{
            transform: `translate3d(${scrollY * -0.03}px, ${scrollY * -0.03}px, 0)`,
          }}
        />
        <div 
          className="absolute right-[10%] top-[10%] w-[200px] h-[200px] rounded-full bg-gradient-to-br from-[#135341]/10 to-[#135341]/20 blur-xl"
          style={{
            transform: `translate3d(${scrollY * 0.02}px, ${scrollY * 0.06}px, 0)`,
          }}
        />
      </div>
      
      {/* Hero content */}
      <div className="relative z-10 container mx-auto px-4 min-h-[95vh] flex flex-col justify-center items-center text-center py-20 md:py-24 lg:py-32">
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMiAwaDF2NGgtMXYtNHptLTcgM2g0djFoLTR2LTF6bTAtMmgxdjRoLTF2LTR6bTIgMGgxdjRoLTF2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]"
          style={{
            opacity: 0.8 - scrollY * 0.001,
            transform: `translate3d(0, ${scrollY * 0.1}px, 0)`,
          }}
        />

        {/* Top floating badges */}
        <div 
          className={`mb-8 flex gap-3 transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="bg-[#09261E]/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm flex items-center">
            <span className="bg-green-500 w-2 h-2 rounded-full mr-2"></span>
            <span className="text-[#09261E] font-medium">3,500+ Off-Market Deals</span>
          </div>
          <div className="bg-[#09261E]/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm flex items-center">
            <span className="bg-blue-500 w-2 h-2 rounded-full mr-2"></span>
            <span className="text-[#09261E] font-medium">900+ Verified REPs</span>
          </div>
        </div>
        
        {/* Main headline */}
        <h1 
          className={`text-5xl md:text-7xl font-heading font-bold text-[#09261E] mb-6 leading-tight transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
          style={{
            transform: `translateY(${scrollY * -0.1}px)`,
          }}
        >
          <span className="block">Off-Market Deals.</span>
          <span className="block">
            <span className="relative">
              Real
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-[#E59F9F]/40"></span>
            </span> Connections.
          </span>
        </h1>
        
        {/* Subheadline */}
        <p 
          className={`text-xl md:text-2xl text-gray-700 max-w-3xl mb-10 transition-all duration-1000 delay-100 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
          style={{
            transform: `translateY(${scrollY * -0.05}px)`,
          }}
        >
          PropertyDeals connects you with exclusive real estate opportunities and trusted professionals that you won't find anywhere else.
        </p>

        {/* CTA buttons */}
        <div 
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-1000 delay-200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
        >
          <Link href="/properties">
            <Button className="bg-[#09261E] hover:bg-[#135341] text-white rounded-full flex items-center gap-2 px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all">
              <Search className="h-5 w-5" />
              Browse Properties
              <ArrowRight className="h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform ml-1" />
            </Button>
          </Link>
          <Link href="/reps">
            <Button variant="outline" className="bg-white border-[#135341] text-[#135341] hover:bg-[#135341] hover:text-white rounded-full flex items-center gap-2 px-8 py-6 text-lg font-medium shadow-md hover:shadow-lg transition-all">
              <Users className="h-5 w-5" />
              Explore REPs
            </Button>
          </Link>
        </div>
        
        {/* Trusted by section */}
        <div 
          className={`mt-auto transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <p className="text-gray-500 text-sm mb-4">TRUSTED BY INVESTORS NATIONWIDE</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="h-6 text-gray-400 font-heading font-bold">REALTY GROUP</div>
            <div className="h-6 text-gray-400 font-heading font-bold">INVESTMENT PROS</div>
            <div className="h-6 text-gray-400 font-heading font-bold">CAPITAL VENTURES</div>
            <div className="h-6 text-gray-400 font-heading font-bold">HOME PARTNERS</div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce"
          style={{
            opacity: 1 - scrollY * 0.005,
          }}
        >
          <p className="text-sm text-gray-500 mb-2">Scroll to explore</p>
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Stats & location pins (map-like background element) */}
      <div className="absolute bottom-0 inset-x-0 h-[300px] pointer-events-none overflow-hidden">
        {[
          { x: '15%', y: '30%', label: 'New York' },
          { x: '25%', y: '60%', label: 'Miami' },
          { x: '50%', y: '20%', label: 'Chicago' },
          { x: '75%', y: '40%', label: 'Los Angeles' },
          { x: '85%', y: '70%', label: 'Dallas' },
        ].map((pin, i) => (
          <div 
            key={i}
            className="absolute"
            style={{ 
              left: pin.x, 
              top: pin.y,
              transform: `translate3d(${scrollY * (i % 2 === 0 ? 0.02 : -0.02)}px, ${scrollY * (i % 3 === 0 ? -0.03 : 0.02)}px, 0)`,
            }}
          >
            <div className="relative">
              <MapPin className="text-[#E59F9F] h-5 w-5" />
              <span className="absolute top-0 left-0 h-5 w-5 bg-[#E59F9F]/20 rounded-full animate-ping"></span>
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium text-gray-600">{pin.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}