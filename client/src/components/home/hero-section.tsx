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
  Shield,
  Lock,
  ChevronDown,
  Handshake,
  Key,
  LightbulbIcon
} from "lucide-react";
import { useCursorGlow, useParallaxEffect } from "@/hooks/use-scroll-animation";

// Custom Network icon
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
      className="relative bg-gradient-to-br from-[#f8f8f8] via-white to-[#f2f8f5] overflow-hidden min-h-[100vh]"
    >
      {/* Cursor glow effect container */}
      <div 
        ref={cursorRef}
        className="absolute inset-0 cursor-glow transition-opacity duration-1000"
        style={{ opacity: isVisible ? 1 : 0 }}
      ></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient orb */}
        <div 
          className="absolute -right-[10%] -top-[5%] w-[70vw] h-[70vw] max-w-[1100px] max-h-[1100px] rounded-full bg-gradient-to-bl from-[#09261E]/20 to-[#135341]/30 blur-3xl will-change-transform"
          style={{
            transform: `translate3d(${scrollY * 0.05 + relativePosition.x * 20}px, ${scrollY * -0.05 + relativePosition.y * 20}px, 0)`,
          }}
        />
        
        {/* Secondary orb */}
        <div 
          className="absolute -left-[10%] bottom-[5%] w-[55vw] h-[55vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-tr from-[#E59F9F]/15 to-[#803344]/15 blur-3xl will-change-transform"
          style={{
            transform: `translate3d(${scrollY * -0.03 + relativePosition.x * -20}px, ${scrollY * -0.03 + relativePosition.y * -15}px, 0)`,
          }}
        />
        
        {/* Additional colorful background elements */}
        <div 
          className="absolute left-[25%] top-[15%] w-[40vw] h-[40vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-r from-[#135341]/10 to-[#298668]/10 blur-3xl will-change-transform animate-pulse-slow"
          style={{
            transform: `translate3d(${scrollY * 0.02 + relativePosition.x * 5}px, ${scrollY * 0.02 + relativePosition.y * 5}px, 0)`,
          }}
        />
        
        <div 
          className="absolute right-[20%] bottom-[20%] w-[25vw] h-[25vw] max-w-[400px] max-h-[400px] rounded-full bg-gradient-to-b from-[#E5D89F]/10 to-[#F8F8F8]/5 blur-3xl will-change-transform animate-float-slow"
          style={{
            transform: `translate3d(${scrollY * -0.01 + relativePosition.x * -8}px, ${scrollY * 0.04 + relativePosition.y * -8}px, 0)`,
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
            className="absolute left-[10%] top-[20%] w-20 h-20 rounded-md bg-[#E59F9F]/10 rotate-12 will-change-transform animate-float"
            style={{
              transform: `rotate(12deg) translate3d(${relativePosition.x * -15}px, ${relativePosition.y * -15 + scrollY * 0.03}px, 0)`,
            }}
          />
          
          <div 
            className="absolute right-[12%] top-[60%] w-24 h-24 rounded-full border-4 border-[#09261E]/5 will-change-transform animate-pulse-slow"
            style={{
              transform: `translate3d(${relativePosition.x * 25}px, ${relativePosition.y * 25 + scrollY * -0.05}px, 0)`,
            }}
          />
          
          <div 
            className="absolute left-[15%] bottom-[30%] w-32 h-4 bg-[#135341]/10 rounded-full will-change-transform animate-breathe"
            style={{
              transform: `translate3d(${relativePosition.x * -20}px, ${relativePosition.y * -10 + scrollY * 0.02}px, 0) rotate(-5deg)`,
            }}
          />
        </div>
      </div>
      
      {/* Main hero content - Split layout */}
      <div className="relative z-10 container mx-auto px-4 min-h-[100vh] flex items-center py-12 md:py-0">
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
                  <div 
                    className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-full px-4 py-2.5 flex items-center gap-3 shadow-sm hover:shadow-md transition-all group cursor-pointer pr-10 relative"
                    style={{ color: target.color }}
                  >
                    <div className="flex items-center gap-2">
                      {target.icon}
                      <span className="text-sm font-medium">{target.text}</span>
                    </div>
                    
                    {/* Avatar stack */}
                    <div className="flex -space-x-3 absolute right-3">
                      {target.avatars.map((avatar, avatarIdx) => (
                        <div 
                          key={avatarIdx}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border border-white will-change-transform transition-all"
                          style={{ 
                            background: avatar.bg,
                            color: target.color,
                            transform: `translateY(${relativePosition.y * 5}px)`,
                            zIndex: 10 - avatarIdx
                          }}
                        >
                          {avatar.initials}
                        </div>
                      ))}
                    </div>
                    
                    {/* Hover indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 w-0 bg-current transition-all duration-300 opacity-0 group-hover:w-full group-hover:opacity-100"/>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right illustration column */}
          <div 
            className={`lg:col-span-5 relative transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
            }`}
          >
            {/* 3D layered property illustration */}
            <div className="relative h-[500px] w-full max-w-[500px] mx-auto">
              {/* Background city silhouette */}
              <div 
                className="absolute inset-0 z-10"
                style={{
                  transform: `translate3d(${relativePosition.x * -10}px, ${relativePosition.y * -10}px, 0)`,
                }}
              >
                <div className="absolute bottom-0 left-0 right-0 h-[35%] opacity-20"
                  style={{
                    clipPath: 'polygon(0% 100%, 5% 90%, 10% 95%, 20% 80%, 25% 85%, 30% 75%, 40% 60%, 50% 70%, 60% 55%, 70% 65%, 75% 60%, 80% 40%, 90% 50%, 95% 45%, 100% 55%, 100% 100%)',
                    background: 'linear-gradient(to top, #09261E, transparent)'
                  }}
                ></div>
              </div>
              
              {/* Featured property card */}
              <div 
                className="absolute top-[5%] left-[10%] w-[80%] h-[60%] rounded-2xl shadow-2xl bg-white overflow-hidden z-20 border-4 border-white will-change-transform"
                style={{
                  transform: `translate3d(${relativePosition.x * 15}px, ${relativePosition.y * 15 - scrollY * 0.05}px, 0) rotate(-2deg)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                {/* Property image */}
                <div className="h-[60%] bg-[#09261E]/5 overflow-hidden relative">
                  {/* Using a generic placeholder - you should replace with actual image */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-[#E59F9F] shadow-sm">
                    Off-Market Deal
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                    <p className="font-heading font-bold text-lg text-[#09261E]">$825,000</p>
                  </div>
                </div>
                
                {/* Property details */}
                <div className="p-4">
                  <h3 className="font-heading font-bold text-lg text-[#09261E] truncate">Modern Farmhouse</h3>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="truncate">Nashville, TN</span>
                  </div>
                  
                  {/* Property specs */}
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-xs text-gray-600">4 bed</div>
                    <div className="text-xs text-gray-600">3 bath</div>
                    <div className="text-xs text-gray-600">2,800 sqft</div>
                  </div>
                </div>
              </div>
              
              {/* REP card */}
              <div 
                className="absolute bottom-[10%] right-[5%] w-[60%] rounded-xl shadow-xl bg-white p-4 z-30 will-change-transform"
                style={{
                  transform: `translate3d(${relativePosition.x * 20}px, ${relativePosition.y * 20 + scrollY * 0.03}px, 0) rotate(3deg)`,
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
              
              {/* Connection lines - animated */}
              <svg 
                className="absolute inset-0 w-full h-full z-15 pointer-events-none opacity-30"
                style={{
                  transform: `translate3d(${relativePosition.x * 5}px, ${relativePosition.y * 5}px, 0)`,
                }}
              >
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#09261E" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#E59F9F" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <line x1="30%" y1="40%" x2="70%" y2="80%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5">
                  <animate attributeName="stroke-dashoffset" from="0" to="20" dur="3s" repeatCount="indefinite" />
                </line>
                <line x1="20%" y1="60%" x2="80%" y2="30%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5">
                  <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="4s" repeatCount="indefinite" />
                </line>
              </svg>
              
              {/* Floating UI elements */}
              <div 
                className="absolute top-[25%] right-[0%] bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg z-40 will-change-transform"
                style={{
                  transform: `translate3d(${relativePosition.x * -10 - scrollY * 0.02}px, ${relativePosition.y * -10 - scrollY * 0.01}px, 0)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="text-[#E59F9F]">
                    <LightbulbIcon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-[#09261E]">Off-market opportunities</span>
                </div>
              </div>
              
              <div 
                className="absolute bottom-[40%] left-[5%] bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg z-40 will-change-transform"
                style={{
                  transform: `translate3d(${relativePosition.x * 10 - scrollY * 0.01}px, ${relativePosition.y * 10 + scrollY * 0.025}px, 0)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="text-[#135341]">
                    <Shield className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-[#09261E]">Trusted network</span>
                </div>
              </div>
              
              {/* New floating element */}
              <div 
                className="absolute top-[55%] right-[15%] bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg z-40 will-change-transform"
                style={{
                  transform: `translate3d(${relativePosition.x * 15 + scrollY * 0.015}px, ${relativePosition.y * 15 - scrollY * 0.02}px, 0)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="text-[#09261E]">
                    <NetworkIcon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-[#09261E]">Connect with experts</span>
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