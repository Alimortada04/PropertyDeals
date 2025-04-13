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
  ArrowDownCircle,
  ChevronDown,
  Clock,
  Shield,
  Network,
  Lock
} from "lucide-react";
import { useCursorGlow, useParallaxEffect } from "@/hooks/use-scroll-animation";

// Custom Network icon since it's not available in lucide-react
function NetworkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="5" r="3" />
      <circle cx="5" cy="19" r="3" />
      <circle cx="19" cy="19" r="3" />
      <line x1="12" y1="8" x2="5" y2="16" />
      <line x1="12" y1="8" x2="19" y2="16" />
    </svg>
  );
}

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { relativePosition } = useParallaxEffect();
  
  // Use cursor glow effect
  useCursorGlow(cursorRef);
  
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
    <div 
      ref={heroRef} 
      className="relative bg-white overflow-hidden min-h-screen"
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
          className="absolute -right-[10%] top-[30%] w-[45vw] h-[45vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-br from-[#09261E]/10 to-[#09261E]/20 blur-3xl will-change-transform"
          style={{
            transform: `translate3d(${scrollY * 0.05 + relativePosition.x * 20}px, ${scrollY * -0.05 + relativePosition.y * 20}px, 0)`,
          }}
        />
        
        {/* Left orb */}
        <div 
          className="absolute -left-[5%] bottom-[10%] w-[35vw] h-[35vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-br from-[#E59F9F]/10 to-[#E59F9F]/20 blur-3xl will-change-transform"
          style={{
            transform: `translate3d(${scrollY * -0.03 + relativePosition.x * -20}px, ${scrollY * -0.03 + relativePosition.y * -15}px, 0)`,
          }}
        />
        
        {/* Top orb */}
        <div 
          className="absolute right-[20%] top-[10%] w-[20vw] h-[20vw] max-w-[300px] max-h-[300px] rounded-full bg-gradient-to-br from-[#135341]/10 to-[#135341]/20 blur-xl will-change-transform"
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
      <div className="relative z-10 container mx-auto px-4 min-h-[100vh] flex flex-col justify-center items-center py-20 md:py-0">
        {/* Content container with slide transition */}
        <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center">
          {/* Trust Badge */}
          <div className={`mb-8 px-4 py-1.5 rounded-full text-sm inline-flex items-center bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}>
            <span className="bg-green-500 w-2 h-2 rounded-full mr-2"></span>
            <span className="text-[#09261E] font-medium tracking-wide">REAL ESTATE REIMAGINED</span>
          </div>
          
          {/* Main headline */}
          <h1 
            className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-[#09261E] mb-6 md:mb-8 tracking-tight text-center transition-all duration-1000 ${
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
            className={`text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 text-center transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Discover deals, meet your crew, and make moves — all in one platform.
          </p>
          
          {/* Value Pills */}
          <div 
            className={`flex flex-wrap justify-center gap-3 mb-12 max-w-2xl mx-auto transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {[
              { icon: <Shield className="h-4 w-4" />, text: "Verified Professionals" },
              { icon: <Home className="h-4 w-4" />, text: "Off-Market Deals" },
              { icon: <NetworkIcon className="h-4 w-4" />, text: "Real Connections" },
              { icon: <Lock className="h-4 w-4" />, text: "Secure Transactions" }
            ].map((pill, idx) => (
              <div 
                key={idx} 
                className="bg-white/70 backdrop-blur-sm border border-gray-100 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm"
              >
                <div className="text-[#135341]">{pill.icon}</div>
                <span className="text-sm font-medium text-gray-800">{pill.text}</span>
              </div>
            ))}
          </div>
          
          {/* CTA buttons */}
          <div 
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-1000 delay-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <Link href="/properties">
              <Button className="relative overflow-hidden group bg-[#09261E] hover:bg-[#135341] text-white rounded-full flex items-center gap-2 px-8 py-6 text-lg font-medium shadow-xl hover:shadow-2xl transition-all">
                {/* Button background animation */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#09261E] via-[#135341] to-[#09261E] opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-size-200 animate-gradient-x"></span>
                
                <Search className="h-5 w-5 relative z-10" />
                <span className="relative z-10">Start Exploring</span>
                <ArrowRight className="h-5 w-5 relative z-10 opacity-70 group-hover:translate-x-1 transition-transform ml-1" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="bg-white/80 backdrop-blur-sm border-[#135341] text-[#135341] hover:bg-[#135341] hover:text-white rounded-full flex items-center gap-2 px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all">
                <MessageCircle className="h-5 w-5" />
                <span>See How It Works</span>
              </Button>
            </Link>
          </div>
          
          {/* Stats row */}
          <div 
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12 transition-all duration-1000 delay-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {[
              { icon: <Home className="h-6 w-6 text-[#135341]" />, value: "3,500+", label: "Off-Market Properties" },
              { icon: <Users className="h-6 w-6 text-[#135341]" />, value: "900+", label: "Verified REPs" },
              { icon: <DollarSign className="h-6 w-6 text-[#135341]" />, value: "$1.2B+", label: "Transaction Volume" },
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm flex flex-col items-center justify-center border border-gray-100/50"
              >
                <div className="bg-[#135341]/10 rounded-full p-3 mb-3">
                  {stat.icon}
                </div>
                <p className="text-2xl font-heading font-bold text-[#09261E]">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
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
            <p className="text-sm text-gray-600 font-medium">Scroll to unlock value</p>
            <ChevronDown className="h-6 w-6 text-[#09261E]" />
          </div>
        </div>
        
        {/* 3D Layered elements */}
        <div className="absolute bottom-0 left-0 right-0 h-[40vh] pointer-events-none overflow-hidden">
          {/* Building silhouettes layer */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[15vh] bg-[#09261E]/5 backdrop-blur-[2px]"
            style={{
              transform: `translate3d(0, ${scrollY * 0.1}px, 0)`,
              clipPath: 'polygon(0% 100%, 5% 90%, 10% 95%, 20% 80%, 25% 85%, 30% 75%, 40% 60%, 50% 70%, 60% 55%, 70% 65%, 75% 60%, 80% 40%, 90% 50%, 95% 45%, 100% 55%, 100% 100%)'
            }}
          ></div>
          
          {/* Map pin markers layer */}
          <div className="absolute inset-0">
            {[
              { x: '10%', y: '70%', size: 6 },
              { x: '20%', y: '50%', size: 8 },
              { x: '35%', y: '65%', size: 5 },
              { x: '55%', y: '40%', size: 7 },
              { x: '70%', y: '60%', size: 9 },
              { x: '85%', y: '35%', size: 6 },
            ].map((pin, i) => (
              <div 
                key={i}
                className="absolute"
                style={{ 
                  left: pin.x, 
                  top: pin.y,
                  transform: `translate3d(${scrollY * ((i % 3) * 0.01)}px, ${scrollY * ((i % 2) * -0.01)}px, 0)`,
                }}
              >
                <div className="relative">
                  <MapPin className="text-[#E59F9F] h-5 w-5" />
                  <span className={`absolute top-0 left-0 h-5 w-5 bg-[#E59F9F]/20 rounded-full animate-ping-slow opacity-${pin.size * 10}`}></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}