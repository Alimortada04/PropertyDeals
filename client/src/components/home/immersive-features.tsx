import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation, useParallaxEffect } from "@/hooks/use-scroll-animation";
import { 
  Search, 
  Users, 
  MessageCircle, 
  ArrowRight, 
  Briefcase,
  Home,
  BarChart3,
  MapPin,
  ScrollText,
  Handshake,
  Eye,
  UserCheck,
  CheckCircle,
  Repeat,
  DollarSign
} from "lucide-react";
import { Link } from "wouter";

export default function ImmersiveFeatures() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const { relativePosition } = useParallaxEffect();

  // References to each section
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  
  // Scroll animation hooks for sections
  const section1Animation = useScrollAnimation({ threshold: 0.3 });
  const section2Animation = useScrollAnimation({ threshold: 0.3 });
  const section3Animation = useScrollAnimation({ threshold: 0.3 });
  
  // Track scroll position for animation effects
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const containerTop = scrollContainerRef.current.offsetTop;
      const containerHeight = scrollContainerRef.current.scrollHeight;
      const scrollPosition = window.scrollY - containerTop;
      
      // Calculate scroll progress percentage
      const progress = Math.max(0, Math.min(1, scrollPosition / containerHeight));
      setScrollProgress(progress * 100);
      
      // Determine active section based on scroll position
      if (progress < 0.33) {
        setActiveSection(0);
      } else if (progress < 0.66) {
        setActiveSection(1);
      } else {
        setActiveSection(2);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Feature sections data for the "What's PropertyDeals?" section
  const sections = [
    {
      ref: section1Ref,
      animation: section1Animation,
      title: "See the Deal.",
      subtitle: "Step 1",
      description: "Find off-market properties and exclusive opportunities that match your investment criteria. Our platform gives you access to deals you won't find anywhere else.",
      color: "#09261E",
      icon: <Eye className="h-16 w-16 text-white/90" />,
      stats: [
        { label: "Off-market deals", value: "3,500+" },
        { label: "New listings daily", value: "40+" },
        { label: "Cities covered", value: "250+" }
      ],
      cta: {
        label: "Browse Properties",
        link: "/properties",
        icon: <Search className="h-4 w-4" />
      },
      illustration: (
        <div className="relative w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <Home className="h-32 w-32 text-white/20" />
          </div>
          <div className="absolute top-1/4 left-1/4 animate-float delay-300">
            <MapPin className="h-8 w-8 text-white/60" />
          </div>
          <div className="absolute bottom-1/4 right-1/3 animate-float delay-500">
            <BarChart3 className="h-10 w-10 text-white/70" />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-float">
            <Home className="h-10 w-10 text-white/60" />
          </div>
        </div>
      )
    },
    {
      ref: section2Ref,
      animation: section2Animation,
      title: "Meet the REP.",
      subtitle: "Step 2",
      description: "Connect directly with verified real estate professionals. Every REP on our platform has been vetted and reviewed by our community for quality and reliability.",
      color: "#135341",
      icon: <UserCheck className="h-16 w-16 text-white/90" />,
      stats: [
        { label: "Verified REPs", value: "900+" },
        { label: "Average rating", value: "4.8/5" },
        { label: "Response time", value: "< 24h" }
      ],
      cta: {
        label: "Meet REPs",
        link: "/reps",
        icon: <Users className="h-4 w-4" />
      },
      illustration: (
        <div className="relative w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <Users className="h-32 w-32 text-white/20" />
          </div>
          <div className="absolute top-1/3 left-1/4 animate-float delay-200">
            <Briefcase className="h-8 w-8 text-white/60" />
          </div>
          <div className="absolute bottom-1/3 right-1/4 animate-float delay-400">
            <MessageCircle className="h-10 w-10 text-white/70" />
          </div>
          <div className="absolute top-1/4 right-1/3 animate-float delay-300">
            <Handshake className="h-10 w-10 text-white/60" />
          </div>
        </div>
      )
    },
    {
      ref: section3Ref,
      animation: section3Animation,
      title: "Close and Repeat.",
      subtitle: "Step 3",
      description: "Execute deals seamlessly through our platform and build your network. Property by property, connection by connection, watch your real estate portfolio grow.",
      color: "#E59F9F",
      icon: <Repeat className="h-16 w-16 text-white/90" />,
      stats: [
        { label: "Deals closed", value: "15,000+" },
        { label: "Community members", value: "12,500+" },
        { label: "Average ROI", value: "18-22%" }
      ],
      cta: {
        label: "Start Investing",
        link: "/auth",
        icon: <CheckCircle className="h-4 w-4" />
      },
      illustration: (
        <div className="relative w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <CheckCircle className="h-32 w-32 text-white/20" />
          </div>
          <div className="absolute top-1/4 right-1/4 animate-float delay-300">
            <ScrollText className="h-8 w-8 text-white/60" />
          </div>
          <div className="absolute bottom-1/3 left-1/3 animate-float delay-100">
            <DollarSign className="h-10 w-10 text-white/70" />
          </div>
          <div className="absolute top-1/3 left-1/4 animate-float delay-500">
            <Repeat className="h-10 w-10 text-white/60" />
          </div>
        </div>
      )
    }
  ];

  return (
    <div 
      ref={scrollContainerRef}
      className="relative bg-white overflow-hidden py-20"
    >
      {/* Section title */}
      <div className="container mx-auto px-4 mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#09261E] mb-3">
          <span className="relative">
            What's PropertyDeals?
            <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#E59F9F]/30 -z-10 mx-auto" style={{ width: "60%" }}></span>
          </span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A complete ecosystem that takes you from finding deals to closing them, with everything you need in between.
        </p>
      </div>
      
      {/* Progress indicator */}
      <div className="fixed z-30 left-6 top-1/2 transform -translate-y-1/2 hidden lg:block">
        <div className="flex flex-col items-center space-y-8">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              className="group relative flex items-center"
              onClick={() => {
                const targetSection = [section1Ref, section2Ref, section3Ref][index].current;
                if (targetSection) {
                  window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                  });
                }
              }}
            >
              <div className="w-10 h-[2px] bg-gray-300 group-hover:bg-gray-400 transition-colors mr-3"></div>
              <div 
                className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                  activeSection === index ? 'bg-[#09261E] scale-125' : 'bg-gray-300 group-hover:bg-gray-400'
                }`}
              >
                {activeSection === index && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </div>
              <span 
                className={`absolute left-16 whitespace-nowrap text-sm transition-all ${
                  activeSection === index ? 'opacity-100 text-[#09261E] font-medium' : 'opacity-0 group-hover:opacity-70'
                }`}
              >
                {["Find Deals", "Meet REPs", "Join Community"][index]}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Feature sections */}
      <div className="space-y-32 md:space-y-64 py-10">
        {sections.map((section, index) => (
          <div 
            key={index}
            ref={section.ref}
            className={`container mx-auto px-4 min-h-screen flex flex-col justify-center items-center py-20 `}
          >
            <div 
              ref={section.animation.ref as React.RefObject<HTMLDivElement>}
              className={`relative w-full ${
                index % 2 === 0
                  ? 'lg:ml-[10%]'
                  : 'lg:mr-[10%]'
              }`}
            >
              {/* Content grid */}
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                index % 2 === 0 ? 'lg:pr-[10%]' : 'lg:pl-[10%]'
              }`}>
                {/* Image / visual (changes order based on index) */}
                <div className={`order-2 ${
                  index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'
                } flex justify-center relative`}>
                  {/* Placeholder for SVG/image - you can replace with actual images */}
                  <div className={`w-full aspect-square max-w-lg rounded-xl bg-${section.color.replace('#', '')}/5 flex items-center justify-center relative overflow-hidden group transition-all hover:shadow-lg`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      {index === 0 && (
                        <div className="grid grid-cols-4 gap-4 p-8">
                          {Array(16).fill(0).map((_, i) => (
                            <div key={i} className="aspect-square rounded-md bg-current opacity-20"></div>
                          ))}
                        </div>
                      )}
                      
                      {index === 1 && (
                        <div className="flex flex-wrap gap-4 p-8">
                          {Array(8).fill(0).map((_, i) => (
                            <div key={i} className="w-16 h-16 rounded-full bg-current opacity-20"></div>
                          ))}
                        </div>
                      )}
                      
                      {index === 2 && (
                        <div className="flex flex-col space-y-4 p-8">
                          {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-8 rounded-md bg-current opacity-20"></div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Center icon */}
                    <div className="relative z-10 transform transition-transform group-hover:scale-110 duration-500">
                      {section.icon}
                    </div>
                    
                    {/* Floating icons */}
                    {index === 0 && (
                      <>
                        <MapPin className="absolute top-1/4 left-1/4 h-6 w-6 text-[#E59F9F] animate-float delay-100" />
                        <Home className="absolute bottom-1/4 right-1/4 h-8 w-8 text-[#135341]/70 animate-float delay-300" />
                        <BarChart3 className="absolute top-1/3 right-1/3 h-5 w-5 text-[#09261E]/60 animate-float delay-500" />
                      </>
                    )}
                    
                    {index === 1 && (
                      <>
                        <Users className="absolute top-1/4 right-1/4 h-8 w-8 text-[#135341]/70 animate-float delay-200" />
                        <Briefcase className="absolute bottom-1/3 left-1/3 h-6 w-6 text-[#09261E]/60 animate-float delay-400" />
                        <Handshake className="absolute top-1/3 left-1/4 h-7 w-7 text-[#E59F9F] animate-float delay-100" />
                      </>
                    )}
                    
                    {index === 2 && (
                      <>
                        <MessageCircle className="absolute top-1/4 left-1/4 h-6 w-6 text-[#E59F9F] animate-float delay-300" />
                        <Users className="absolute bottom-1/4 right-1/4 h-7 w-7 text-[#135341]/70 animate-float delay-100" />
                        <ScrollText className="absolute top-1/3 right-1/3 h-5 w-5 text-[#09261E]/60 animate-float delay-500" />
                      </>
                    )}
                  </div>
                </div>
                
                {/* Text content */}
                <div className={`order-1 ${
                  index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'
                }`}>
                  {/* Eyebrow text */}
                  <p 
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-${section.color.replace('#', '')}/10 text-${section.color.replace('#', '')} mb-6`}
                    style={{ color: section.color }}
                  >
                    {`0${index + 1}`}
                  </p>
                  
                  {/* Subtitle */}
                  <p className="text-xl text-gray-500 mb-3 font-heading">{section.subtitle}</p>
                  
                  {/* Title */}
                  <h3 
                    className="text-3xl md:text-4xl font-heading font-bold mb-6"
                    style={{ color: section.color }}
                  >
                    {section.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-lg text-gray-700 mb-8">{section.description}</p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {section.stats.map((stat, i) => (
                      <div key={i} className="text-center">
                        <p 
                          className="text-2xl font-heading font-bold"
                          style={{ color: section.color }}
                        >
                          {stat.value}
                        </p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* CTA */}
                  <Link href={section.cta.link}>
                    <Button 
                      className="group px-6 py-3 flex items-center gap-2 text-white rounded-full"
                      style={{ backgroundColor: section.color }}
                    >
                      {section.cta.icon}
                      <span>{section.cta.label}</span>
                      <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Background accent */}
              <div 
                className={`absolute -z-10 rounded-full opacity-20 blur-3xl transition-all duration-1000 ${
                  section.animation.isVisible ? 'opacity-20' : 'opacity-0'
                }`}
                style={{ 
                  backgroundColor: section.color,
                  width: '500px',
                  height: '500px',
                  top: '-250px',
                  [index % 2 === 0 ? 'right' : 'left']: '-150px',
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}