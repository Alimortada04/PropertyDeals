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
  Network as CustomNetworkIcon,
} from "lucide-react";
import PropertyCarousel from "./property-carousel";
import BackgroundElements from "./background-elements";
import PropertyCalculator from "./property-calculator";

// LiveCounterDisplay component to show animated counter
function LiveCounterDisplay({ baseNumber }: { baseNumber: number }) {
  const [count, setCount] = useState(baseNumber);
  
  useEffect(() => {
    // Randomly add users on an interval
    const interval = setInterval(() => {
      // 70% chance to add a user every 5 seconds
      if (Math.random() < 0.7) {
        setCount(prev => prev + 1);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // When a user is added, animate the digit
  useEffect(() => {
    const elem = document.getElementById('user-counter');
    if (elem) {
      elem.classList.add('animate-pulse', 'text-[#135341]');
      setTimeout(() => {
        elem.classList.remove('animate-pulse', 'text-[#135341]');
      }, 700);
    }
  }, [count]);
  
  return (
    <span id="user-counter" className="text-xs font-bold transition-colors duration-700">
      {count}+
    </span>
  );
}

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
    }, 5000); // Change property every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={heroRef} 
      className="relative bg-gradient-to-br from-[#f8f8f8] via-white to-[#f2f8f5] overflow-hidden min-h-[100vh] top-0 mt-0 pt-0"
      style={{ marginTop: "0", padding: "0" }}
    >
      {/* New background elements */}
      <BackgroundElements scrollY={scrollY} />
      
      {/* Main hero content - Split layout */}
      <div className="relative z-10 container mx-auto px-4 min-h-[100vh] flex items-center py-0">
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
                  icon: "🏠", 
                  text: "For Buyers", 
                  color: "#09261E",
                  href: "/buyers-dash",
                  avatars: [
                    { imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
                    { imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
                    { imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
                  ]
                },
                { 
                  icon: "🤝", 
                  text: "For REPs", 
                  color: "#135341",
                  href: "/rep-dash",
                  avatars: [
                    { imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
                    { imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
                    { imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
                  ]
                },
                { 
                  icon: "🔑", 
                  text: "For Sellers", 
                  color: "#803344",
                  href: "/seller-dash",
                  avatars: [
                    { imageUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
                    { imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
                    { imageUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
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
                    {/* Pill with avatars in front */}
                    <div 
                      className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-full px-4 py-2 flex items-center gap-3 shadow-sm group cursor-pointer relative transition-all duration-300 overflow-hidden pl-12"
                      style={{ color: target.color }}
                    >
                      {/* Avatar stack positioned to the left of text, inside pill */}
                      <div className="flex -space-x-1 absolute left-2">
                        {target.avatars.slice(0, 3).map((avatar, avatarIdx) => (
                          <div 
                            key={avatarIdx}
                            className={`
                              w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white will-change-transform overflow-hidden
                              ${avatarIdx === 2 ? 'hidden sm:flex' : ''} 
                              ${avatarIdx === 1 ? 'hidden xs:flex' : ''}
                            `}
                            style={{ 
                              zIndex: 30 + (3 - avatarIdx)
                            }}
                          >
                            <img 
                              src={avatar.imageUrl} 
                              alt="User avatar" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2 relative z-10">
                        <span className="md:inline hidden">{target.icon}</span>
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
          
          {/* Right property card column */}
          <div 
            className={`lg:col-span-5 relative transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
            }`}
          >
            <div className="relative min-h-[500px] w-full">
              {/* Featured property card with 3D hover effect */}
              {/* Investment Calculator */}
              <PropertyCalculator 
                property={featuredProperty} 
                scrollY={scrollY} 
                isVisible={isVisible}
              />
              
              <Link 
                href={`/p/${featuredProperty.id}`}
                className="absolute top-[15%] left-[5%] w-[65%] h-[60%] rounded-2xl shadow-2xl bg-white overflow-hidden z-20 border-4 border-white will-change-transform group cursor-pointer transform-gpu"
                style={{
                  transform: `translate3d(0, ${-scrollY * 0.05}px, 0) rotate(-2deg)`,
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease-out, opacity 0.5s ease',
                  transformStyle: 'preserve-3d',
                  boxShadow: '0 10px 30px -5px rgba(9, 38, 30, 0.15)'
                }}
                onMouseMove={(e) => {
                  const card = e.currentTarget;
                  const rect = card.getBoundingClientRect();
                  const x = e.clientX - rect.left; // x position within element
                  const y = e.clientY - rect.top; // y position within element
                  
                  // Calculate rotation angles based on mouse position
                  // Use smaller values for subtler effect (0.08)
                  const rotateY = ((x / rect.width) - 0.5) * 8; // -4 to 4 degrees
                  const rotateX = ((y / rect.height) - 0.5) * -8; // 4 to -4 degrees
                  
                  // Apply transformation - subtle 3D effect
                  card.style.transform = `translate3d(0, ${-scrollY * 0.05}px, 0) rotate(-2deg) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale3d(1.02, 1.02, 1.02)`;
                  card.style.boxShadow = '0 20px 40px -10px rgba(9, 38, 30, 0.25)';
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget;
                  // Reset to original transform
                  card.style.transform = `translate3d(0, ${-scrollY * 0.05}px, 0) rotate(-2deg)`;
                  card.style.boxShadow = '0 10px 30px -5px rgba(9, 38, 30, 0.15)';
                }}
              >
                {/* Property image with zoom effect */}
                <div className="h-[60%] bg-[#09261E]/5 overflow-hidden relative">
                  <div 
                    className="absolute inset-0 bg-center bg-cover transition-all duration-700 group-hover:scale-110 will-change-transform"
                    style={{ 
                      backgroundImage: `url(${featuredProperty.imageUrl})` 
                    }}
                  />
                  
                  {/* Property tags */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {featuredProperty.offMarketDeal && (
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-[#E59F9F] shadow-sm inline-flex items-center gap-1">
                        <span className="md:inline hidden">⭐</span> Off-Market Deal
                      </div>
                    )}
                    {featuredProperty.newListing && (
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-[#135341] shadow-sm inline-flex items-center gap-1">
                        <span className="md:inline hidden">🆕</span> New Listing
                      </div>
                    )}
                    {featuredProperty.priceDrop && (
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-[#803344] shadow-sm inline-flex items-center gap-1">
                        <span className="md:inline hidden">📉</span> Price Drop
                      </div>
                    )}
                  </div>
                  
                  {/* Network badge removed */}
                  
                  {/* Price tag */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm z-10">
                    <p className="font-heading font-bold text-lg text-[#09261E]">
                      ${featuredProperty.price?.toLocaleString()}
                    </p>
                  </div>
                  
                  {/* REP Avatar stack removed */}
                </div>
                
                {/* Property details */}
                <div className="p-4">
                  <h3 className="font-heading font-bold text-lg text-[#09261E] truncate">
                    {featuredProperty.title}
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="truncate">{featuredProperty.city}, {featuredProperty.state}</span>
                  </div>
                  
                  {/* Property specs */}
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <span className="md:inline hidden">🛏️</span> {featuredProperty.bedrooms} bed
                    </div>
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <span className="md:inline hidden">🚿</span> {featuredProperty.bathrooms} bath
                    </div>
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <span className="md:inline hidden">📏</span> {featuredProperty.squareFeet?.toLocaleString()} sqft
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* REP card - positioned differently based on screen size */}
              <div 
                className="absolute md:top-[-10%] md:right-[15%] top-[-20%] right-[0%] md:w-[50%] w-[70%] rounded-xl shadow-xl bg-white p-4 z-30 will-change-transform"
                style={{
                  transform: `translate3d(0, ${Math.min(40, scrollY * 0.02)}px, 0) rotate(2deg)`,
                  transition: 'transform 0.2s ease-out'
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#135341]/10 flex items-center justify-center text-[#135341]">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#09261E]">REP Network</h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      <LiveCounterDisplay baseNumber={900} />
                      <span className="text-xs text-gray-500">Verified Professionals</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Connection lines - simplified and reduced */}
              <svg 
                className="absolute inset-0 w-full h-full z-15 pointer-events-none opacity-30"
              >
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#09261E" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#E59F9F" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <line x1="30%" y1="40%" x2="70%" y2="80%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="20%" y1="60%" x2="80%" y2="30%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" />
              </svg>
              
              {/* Removed floating UI bubbles as requested */}
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