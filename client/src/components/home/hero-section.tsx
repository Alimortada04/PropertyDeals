import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { featuredProperties, similarProperties, allProperties } from "@/lib/data";
import { 
  Search, 
  ArrowRight, 
  HandshakeIcon as Handshake,
  KeyRound as Key,
  Users,
  ChevronDown,
  MapPin,
  Shield,
  LightbulbIcon,
} from "lucide-react";
import PropertyCarousel from "./property-carousel";
import BackgroundElements from "./background-elements";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  // Initialize with zero position since we don't want mouse movement parallax
  const { relativePosition } = { relativePosition: { x: 0, y: 0 } };
  // Track current featured property (rotating among featured properties)
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const featuredProperty = featuredProperties[currentFeaturedIndex];
  
  // Combine all properties for the carousel
  const carouselProperties = [...featuredProperties, ...similarProperties.slice(0, 2)];
  
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
  
  // Rotate through featured properties
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) => 
        prev >= featuredProperties.length - 1 ? 0 : prev + 1
      );
    }, 8000); // Change property every 8 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={heroRef} 
      className="relative bg-gradient-to-br from-[#f8f8f8] via-white to-[#f2f8f5] overflow-hidden min-h-[100vh] top-0 mt-0"
      style={{ marginTop: "-1px" }}
    >
      {/* New background elements */}
      <BackgroundElements scrollY={scrollY} />
      
      {/* Main hero content - Split layout */}
      <div className="relative z-10 container mx-auto px-4 min-h-[100vh] flex items-center py-6 md:py-10 lg:py-0">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left content column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Trust Badge */}
            <div className={`mb-6 px-4 py-1.5 rounded-full text-sm inline-flex items-center self-start bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}>
              <span className="bg-green-500 w-2 h-2 rounded-full mr-2"></span>
              <span className="text-[#09261E] font-medium tracking-wide">REAL ESTATE REIMAGINED</span>
            </div>
            
            {/* Main headline */}
            <h1 
              className={`text-4xl sm:text-5xl md:text-6xl font-heading font-semibold text-[#09261E] mb-6 tracking-tight transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <span className="block mb-2">Built on Trust.</span>
              <span className="block relative">
                <span className="relative inline-block">
                  Powered by Real Estate.
                  <span className="absolute -bottom-2 left-0 right-0 h-3 bg-[#E59F9F]/40 -z-10"></span>
                </span>
              </span>
            </h1>
            
            {/* Subheadline */}
            <p 
              className={`text-lg md:text-xl text-gray-700 max-w-xl mb-8 transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              Discover off-market opportunities, connect with trusted professionals, and grow your real estate network.
            </p>
            
            {/* CTA buttons */}
            <div 
              className={`flex flex-col sm:flex-row items-start gap-4 mb-12 transition-all duration-1000 delay-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <Link href="/properties">
                <Button className="relative overflow-hidden group bg-[#09261E] hover:bg-[#135341] text-white rounded-full flex items-center gap-2 px-8 py-6 text-lg font-medium shadow-xl hover:shadow-2xl transition-all">
                  {/* Button background animation */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#09261E] via-[#135341] to-[#09261E] opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-size-200 animate-gradient-x"></span>
                  
                  <Search className="h-5 w-5 relative z-10" />
                  <span className="relative z-10">Explore Deals</span>
                  <ArrowRight className="h-5 w-5 relative z-10 opacity-70 group-hover:translate-x-1 transition-transform ml-1" />
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="outline" className="bg-white/80 backdrop-blur-sm border-[#135341] text-[#135341] hover:bg-[#135341] hover:text-white rounded-full flex items-center gap-2 px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all">
                  <Users className="h-5 w-5" />
                  <span>Join our Community</span>
                </Button>
              </Link>
            </div>
            
            {/* Target audience pills */}
            <div 
              className={`flex flex-wrap gap-4 mt-2 transition-all duration-1000 delay-900 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {[
                { 
                  icon: <Search className="h-4 w-4" />, 
                  text: "For Investors & Buyers", 
                  color: "#09261E",
                  href: "/buyers-dash",
                  avatars: [
                    { initials: "JL", bg: "#09261E30" },
                    { initials: "MR", bg: "#09261E20" },
                    { initials: "AT", bg: "#09261E25" }
                  ]
                },
                { 
                  icon: <Handshake className="h-4 w-4" />, 
                  text: "For REPs", 
                  color: "#135341",
                  href: "/rep-dash",
                  avatars: [
                    { initials: "RH", bg: "#13534130" },
                    { initials: "LS", bg: "#13534120" },
                    { initials: "BK", bg: "#13534125" }
                  ]
                },
                { 
                  icon: <Key className="h-4 w-4" />, 
                  text: "For Sellers", 
                  color: "#803344",
                  href: "/seller-dash",
                  avatars: [
                    { initials: "PL", bg: "#80334430" },
                    { initials: "DJ", bg: "#80334420" },
                    { initials: "EM", bg: "#80334425" }
                  ]
                }
              ].map((target, idx) => (
                <Link 
                  key={idx} 
                  href={target.href}
                  onClick={(e) => {
                    // If user is not authenticated, show login modal
                    const isAuthenticated = false; // Replace with actual auth check
                    if (!isAuthenticated) {
                      e.preventDefault();
                      // Redirect to auth page with returnUrl
                      window.location.href = `/auth?returnUrl=${target.href}`;
                    }
                  }}
                >
                  <div className="relative">
                    {/* Avatar stack positioned above the pill and aligned to the right */}
                    <div className="flex -space-x-2 absolute -right-1 -top-4 transform -translate-x-[15%]">
                      {target.avatars.map((avatar, avatarIdx) => (
                        <div 
                          key={avatarIdx}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white will-change-transform transition-all"
                          style={{ 
                            background: avatar.bg,
                            color: target.color,
                            transform: `translateY(${relativePosition.y * 2}px)`,
                            zIndex: 1 - avatarIdx
                          }}
                        >
                          {avatar.initials}
                        </div>
                      ))}
                    </div>
                    
                    {/* Pill */}
                    <div 
                      className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-full px-4 py-2.5 flex items-center gap-3 shadow-sm group cursor-pointer relative transition-all duration-300 z-10 overflow-hidden mt-2"
                      style={{ color: target.color }}
                    >
                      <div className="flex items-center gap-2 relative z-10">
                        {target.icon}
                        <span className="text-sm font-medium">{target.text}</span>
                      </div>
                      
                      {/* Modern hover animation - subtle gradient overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r"
                           style={{ 
                             backgroundImage: `linear-gradient(to right, ${target.color}15, ${target.color}05)`,
                           }} 
                      />
                      
                      {/* Enhanced hover animation - border highlight */}
                      <div className="absolute inset-0 opacity-0 rounded-full group-hover:opacity-100 transition-all duration-300 border-2"
                           style={{ borderColor: `${target.color}` }} 
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right property carousel column */}
          <div 
            className={`lg:col-span-5 relative transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
            }`}
          >
            <div className="relative min-h-[500px] w-full">
              {/* Property Cards Carousel */}
              <PropertyCarousel properties={carouselProperties} scrollY={scrollY} />
              
              {/* REP card */}
              <div 
                className="absolute -bottom-4 right-[8%] w-[55%] rounded-xl shadow-xl bg-white p-4 z-30 will-change-transform md:block hidden"
                style={{
                  transform: `translate3d(0, ${scrollY * 0.03}px, 0) rotate(3deg)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#135341]/10 flex items-center justify-center text-[#135341]">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#09261E]">REP Network</h4>
                    <p className="text-xs text-gray-500">900+ Verified Professionals</p>
                  </div>
                </div>
              </div>
              

            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div 
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center transition-all duration-1000 delay-1200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{
            opacity: Math.max(0, 1 - scrollY * 0.005),
          }}
        >
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <p className="text-sm text-gray-600 font-medium">Scroll to discover more</p>
            <ChevronDown className="h-6 w-6 text-[#09261E]" />
          </div>
        </div>
      </div>
    </div>
  );
}