import { useState, useRef } from "react";
import { 
  ShieldCheck, 
  Users, 
  MessageCircle, 
  Zap, 
  Handshake,
  BadgeCheck
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface ValueItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export default function ValueGrid() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  
  const values: ValueItem[] = [
    {
      icon: <ShieldCheck className="h-10 w-10" />,
      title: "Verified Deals Only",
      description: "Every property on PropertyDeals is personally verified to ensure legitimacy, accuracy, and transparency.",
      color: "#09261E"
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Trusted Professionals",
      description: "Work with pre-vetted REPs who have been verified and reviewed by our community.",
      color: "#135341"
    },
    {
      icon: <MessageCircle className="h-10 w-10" />,
      title: "Centralized Communication",
      description: "All your messages, offers, and discussions in one secure platform—no more scattered emails.",
      color: "#E59F9F"
    },
    {
      icon: <Zap className="h-10 w-10" />,
      title: "Smart Matching Tools",
      description: "Our proprietary algorithms connect you with the properties and professionals that match your criteria.",
      color: "#09261E"
    },
    {
      icon: <Handshake className="h-10 w-10" />,
      title: "Community-Supported Success",
      description: "Get advice, strategies, and insights from thousands of successful investors.",
      color: "#135341"
    },
    {
      icon: <BadgeCheck className="h-10 w-10" />,
      title: "Data-Driven Decisions",
      description: "Access comprehensive market analytics and investment calculators for smarter investments.",
      color: "#E59F9F"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div 
          ref={ref as React.RefObject<HTMLDivElement>} 
          className={`mb-16 text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#09261E] mb-4">
            <span className="relative">
              Why PropertyDeals is Different
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#E59F9F]/30 -z-10 mx-auto" style={{ width: "30%" }}></span>
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            PropertyDeals isn't just another real estate platform. We provide a complete ecosystem built on trust, transparency, and real connections.
          </p>
        </div>
        
        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {values.map((item, index) => {
            const isActive = activeCard === index;
            // Staggered animation delay based on grid position
            const delay = (index % 3) * 100 + Math.floor(index / 3) * 200;
            
            return (
              <div 
                key={index}
                className={`bg-white rounded-xl border border-gray-100 p-6 transition-all duration-500 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                } transition-delay-${delay} transform hover:-translate-y-2 hover:shadow-xl shadow-md`}
                style={{ 
                  transitionDelay: `${delay}ms`,
                  borderColor: isActive ? item.color : 'var(--border)'
                }}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                {/* Icon with background */}
                <div 
                  className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300"
                  style={{ 
                    backgroundColor: `${item.color}10`,
                    color: item.color
                  }}
                >
                  {item.icon}
                </div>
                
                {/* Title */}
                <h3 
                  className="text-xl font-heading font-bold mb-3 transition-colors duration-300"
                  style={{ color: isActive ? item.color : '#09261E' }}
                >
                  {item.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600">
                  {item.description}
                </p>
                
                {/* Animated border on hover */}
                <div 
                  className={`absolute bottom-0 left-0 h-1 transition-all duration-500 ease-out ${
                    isActive ? 'w-full' : 'w-0'
                  }`}
                  style={{ backgroundColor: item.color }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}