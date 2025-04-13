import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Search, 
  Users, 
  MapPin, 
  Home, 
  Building, 
  DollarSign, 
  MessageCircle, 
  Landmark, 
  ArrowDownCircle 
} from "lucide-react";
import { useCursorGlow, useParallaxEffect } from "@/hooks/use-scroll-animation";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activePanel, setActivePanel] = useState(0);
  const { relativePosition } = useParallaxEffect();
  
  // Use cursor glow effect
  useCursorGlow(cursorRef);
  
  // Track scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Update active panel based on scroll position
      const scrollPercent = window.scrollY / window.innerHeight;
      if (scrollPercent < 0.3) setActivePanel(0);
      else if (scrollPercent < 0.6) setActivePanel(1);
      else setActivePanel(2);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Trigger entrance animations
  useEffect(() => {
    setIsVisible(true);
    
    // Auto rotate panels
    const interval = setInterval(() => {
      if (scrollY < 100) { // Only auto-rotate when near top of page
        setActivePanel(prev => (prev + 1) % 3);
      }
    }, 4000);
    
    return () => clearInterval(interval);
  }, [scrollY]);

  // Panel content
  const panels = [
    {
      badge: "OFF-MARKET PROPERTIES",
      heading: "Deals. Connections.",
      headingHighlight: "Revolution.",
      description: "Discover exclusive real estate opportunities and connect with verified professionals you won't find on any other platform.",
      icon: <Building className="h-24 w-24 opacity-10" />
    },
    {
      badge: "VERIFIED PROFESSIONALS",
      heading: "Expert REPs.",
      headingHighlight: "Real Results.",
      description: "Work with 900+ verified real estate professionals who have been vetted and reviewed by our community.",
      icon: <Users className="h-24 w-24 opacity-10" />
    },
    {
      badge: "INVESTOR COMMUNITY",
      heading: "Community. Tools.",
      headingHighlight: "Success.",
      description: "Access powerful investor tools and join a thriving community sharing insights, strategies, and opportunities.",
      icon: <Landmark className="h-24 w-24 opacity-10" />
    }
  ];

  return (
    <div 
      ref={heroRef} 
      className="relative bg-white overflow-hidden"
    >
      {/* Cursor glow effect container */}
      <div 
        ref={cursorRef}
        className="absolute inset-0 cursor-glow transition-opacity duration-1000"
        style={{ opacity: isVisible ? 1 : 0 }}
      ></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Right orb */}
        <div 
          className="absolute -right-20 bottom-10 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#09261E]/5 to-[#09261E]/20 blur-2xl will-change-transform"
          style={{
            transform: `translate3d(${scrollY * 0.05 + relativePosition.x * 20}px, ${scrollY * -0.05 + relativePosition.y * 20}px, 0)`,
          }}
        />
        
        {/* Left orb */}
        <div 
          className="absolute -left-20 -bottom-40 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#E59F9F]/10 to-[#E59F9F]/20 blur-2xl will-change-transform"
          style={{
            transform: `translate3d(${scrollY * -0.03 + relativePosition.x * -20}px, ${scrollY * -0.03 + relativePosition.y * -15}px, 0)`,
          }}
        />
        
        {/* Top orb */}
        <div 
          className="absolute right-[10%] top-[10%] w-[200px] h-[200px] rounded-full bg-gradient-to-br from-[#135341]/10 to-[#135341]/20 blur-xl will-change-transform"
          style={{
            transform: `translate3d(${scrollY * 0.02 + relativePosition.x * 10}px, ${scrollY * 0.06 + relativePosition.y * 10}px, 0)`,
          }}
        />
        
        {/* Accent elements */}
        <div className="absolute inset-0">
          {/* Dotted grid pattern */}
          <div 
            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMiAwaDF2NGgtMXYtNHptLTcgM2g0djFoLTR2LTF6bTAtMmgxdjRoLTF2LTR6bTIgMGgxdjRoLTF2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]"
            style={{
              opacity: 0.8 - scrollY * 0.001,
              transform: `translate3d(0, ${scrollY * 0.1}px, 0)`,
            }}
          />
          
          {/* Abstract shapes */}
          <div 
            className="absolute left-[5%] top-[25%] w-16 h-16 rounded-md bg-[#E59F9F]/10 rotate-12 will-change-transform animate-float"
            style={{
              transform: `rotate(12deg) translate3d(${relativePosition.x * -15}px, ${relativePosition.y * -15 + scrollY * 0.03}px, 0)`,
            }}
          />
          
          <div 
            className="absolute right-[15%] top-[60%] w-20 h-20 rounded-full border-4 border-[#09261E]/5 will-change-transform animate-pulse-slow"
            style={{
              transform: `translate3d(${relativePosition.x * 25}px, ${relativePosition.y * 25 + scrollY * -0.05}px, 0)`,
            }}
          />
          
          <div 
            className="absolute left-[20%] bottom-[20%] w-24 h-3 bg-[#135341]/10 rounded-full will-change-transform animate-breathe"
            style={{
              transform: `translate3d(${relativePosition.x * -20}px, ${relativePosition.y * -10 + scrollY * 0.02}px, 0) rotate(-5deg)`,
            }}
          />
        </div>
      </div>
      
      {/* Main hero content */}
      <div className="relative z-10 container mx-auto px-4 min-h-[100vh] flex flex-col justify-center items-center text-center py-20 md:py-24 lg:py-32">
        {/* Content container with slide transition between panels */}
        <div className="relative w-full max-w-5xl mx-auto overflow-hidden" style={{ height: "320px" }}>
          {panels.map((panel, index) => (
            <div 
              key={index}
              className="absolute inset-0 transition-all duration-1000 flex flex-col items-center justify-center"
              style={{
                opacity: activePanel === index ? 1 : 0,
                transform: `translateY(${activePanel === index ? 0 : (activePanel > index ? -40 : 40)}px)`,
                zIndex: activePanel === index ? 10 : 0,
              }}
            >
              {/* Top floating badge */}
              <div 
                className={`mb-6 px-4 py-1.5 rounded-full text-sm inline-flex items-center bg-gradient-to-r from-[#09261E]/10 via-[#135341]/20 to-[#09261E]/10 backdrop-blur-sm`}
              >
                <span className="bg-green-500 w-2 h-2 rounded-full mr-2"></span>
                <span className="text-[#09261E] font-medium tracking-wider">{panel.badge}</span>
              </div>
              
              {/* Main headline */}
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-[#09261E] mb-6 leading-none tracking-tight max-w-2xl mx-auto">
                <span className="block mb-2">{panel.heading}</span>
                <span className="block relative">
                  <span className="relative inline-block">
                    {panel.headingHighlight}
                    <span className="absolute -bottom-2 left-0 right-0 h-3 bg-[#E59F9F]/40"></span>
                  </span>
                </span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10">
                {panel.description}
              </p>
              
              {/* Background icon */}
              <div 
                className="absolute right-0 bottom-0 opacity-20 transform translate-y-1/4 translate-x-1/4"
                style={{
                  transform: `translate(25%, 25%) rotate(${scrollY * 0.01}deg)`,
                }}
              >
                {panel.icon}
              </div>
            </div>
          ))}
          
          {/* Panel indicators */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {panels.map((_, index) => (
              <button 
                key={index}
                className={`w-${activePanel === index ? '12' : '2'} h-2 rounded-full transition-all duration-300 ${
                  activePanel === index ? 'bg-[#09261E]' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => setActivePanel(index)}
                aria-label={`View panel ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* CTA buttons */}
        <div 
          className={`mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
        >
          <Link href="/properties">
            <Button className="relative overflow-hidden group bg-[#09261E] hover:bg-[#135341] text-white rounded-full flex items-center gap-2 px-8 py-7 text-lg font-medium shadow-xl hover:shadow-2xl transition-all">
              {/* Button background animation */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#09261E] via-[#135341] to-[#09261E] opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-size-200 animate-gradient-x"></span>
              
              <Search className="h-5 w-5 relative z-10" />
              <span className="relative z-10">Start Exploring</span>
              <ArrowRight className="h-5 w-5 relative z-10 opacity-70 group-hover:translate-x-1 transition-transform ml-1" />
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" className="bg-white/70 backdrop-blur-sm border-[#135341] text-[#135341] hover:bg-[#135341] hover:text-white rounded-full flex items-center gap-2 px-8 py-7 text-lg font-medium shadow-lg hover:shadow-xl transition-all">
              <MessageCircle className="h-5 w-5" />
              <span>See How It Works</span>
            </Button>
          </Link>
        </div>
        
        {/* Trusted by logos */}
        <div 
          className={`mt-auto transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <p className="text-gray-500 text-sm font-medium tracking-wider mb-6">TRUSTED BY INVESTORS NATIONWIDE</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="h-8 text-gray-400 font-heading font-bold border-b-2 border-transparent hover:border-[#E59F9F]/40 hover:text-gray-600 transition-all duration-300">REALTY GROUP</div>
            <div className="h-8 text-gray-400 font-heading font-bold border-b-2 border-transparent hover:border-[#E59F9F]/40 hover:text-gray-600 transition-all duration-300">INVESTMENT PROS</div>
            <div className="h-8 text-gray-400 font-heading font-bold border-b-2 border-transparent hover:border-[#E59F9F]/40 hover:text-gray-600 transition-all duration-300">CAPITAL VENTURES</div>
            <div className="h-8 text-gray-400 font-heading font-bold border-b-2 border-transparent hover:border-[#E59F9F]/40 hover:text-gray-600 transition-all duration-300">HOME PARTNERS</div>
          </div>
        </div>
        
        {/* Stats row */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: <Home className="h-6 w-6 text-[#135341]" />, value: "3,500+", label: "Off-Market Properties" },
            { icon: <Users className="h-6 w-6 text-[#135341]" />, value: "900+", label: "Verified REPs" },
            { icon: <DollarSign className="h-6 w-6 text-[#135341]" />, value: "$1.2B+", label: "Transaction Volume" },
          ].map((stat, index) => (
            <div 
              key={index}
              className={`bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm flex flex-col items-center justify-center transition-all duration-1000 delay-${index * 200} transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="bg-[#135341]/10 rounded-full p-3 mb-3">
                {stat.icon}
              </div>
              <p className="text-2xl font-heading font-bold text-[#09261E]">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          style={{
            opacity: 1 - scrollY * 0.005,
          }}
        >
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <p className="text-sm text-gray-600 font-medium">Scroll to explore</p>
            <ArrowDownCircle className="h-6 w-6 text-[#09261E]" />
          </div>
        </div>
      </div>
      
      {/* Floating pins/map element */}
      <div className="absolute bottom-0 inset-x-0 h-[300px] pointer-events-none overflow-hidden">
        {[
          { x: '15%', y: '30%', label: 'New York', count: '429 deals' },
          { x: '25%', y: '60%', label: 'Miami', count: '215 deals' },
          { x: '50%', y: '20%', label: 'Chicago', count: '176 deals' },
          { x: '75%', y: '40%', label: 'Los Angeles', count: '312 deals' },
          { x: '85%', y: '70%', label: 'Dallas', count: '184 deals' },
        ].map((pin, i) => (
          <div 
            key={i}
            className="absolute"
            style={{ 
              left: pin.x, 
              top: pin.y,
              transform: `translate3d(${scrollY * (i % 2 === 0 ? 0.02 : -0.02) + relativePosition.x * (i % 2 === 0 ? 5 : -5)}px, ${scrollY * (i % 3 === 0 ? -0.03 : 0.02) + relativePosition.y * (i % 3 === 0 ? -5 : 5)}px, 0)`,
            }}
          >
            <div className="relative group cursor-pointer">
              <MapPin className="text-[#E59F9F] h-6 w-6 z-10 relative" />
              <span className="absolute top-0 left-0 h-6 w-6 bg-[#E59F9F]/20 rounded-full animate-ping"></span>
              
              {/* Info tooltip on hover */}
              <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-2 w-32 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <p className="font-medium text-[#09261E] text-sm">{pin.label}</p>
                <p className="text-xs text-gray-600">{pin.count}</p>
              </div>
              
              {/* Always visible label */}
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium text-gray-600">
                {pin.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}