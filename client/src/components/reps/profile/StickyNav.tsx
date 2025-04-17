import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  CheckSquare, 
  Activity, 
  Users, 
  MessageSquare 
} from "lucide-react";

interface StickyNavProps {
  activeDealsCount: number;
  closedDealsCount: number;
  reviewsCount: number;
  connectionsCount: number;
}

export default function StickyNav({ 
  activeDealsCount, 
  closedDealsCount, 
  reviewsCount, 
  connectionsCount 
}: StickyNavProps) {
  const [activeSection, setActiveSection] = useState<string>("active-deals");
  const [isSticky, setIsSticky] = useState<boolean>(false);
  
  // Detect scroll position to make the navbar sticky
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const headerHeight = 250; // Reduced height to account for new LinkedIn-style header
      setIsSticky(offset > headerHeight);
      
      // Determine active section based on scroll position
      const sections = [
        { id: "active-deals", offset: document.getElementById("active-deals")?.offsetTop || 0 },
        { id: "closed-deals", offset: document.getElementById("closed-deals")?.offsetTop || 0 },
        { id: "activity", offset: document.getElementById("activity")?.offsetTop || 0 },
        { id: "connections", offset: document.getElementById("connections")?.offsetTop || 0 },
        { id: "reviews", offset: document.getElementById("reviews")?.offsetTop || 0 }
      ];
      
      // Adjust for navbar height and add some buffer for better UX
      const adjustedScrollPosition = offset + 100;
      
      // Find the current section
      const currentSection = sections
        .filter(section => section.offset > 0)
        .reduce((prev, current) => {
          return (adjustedScrollPosition >= current.offset && current.offset > prev.offset) 
            ? current 
            : prev;
        }, { id: "active-deals", offset: 0 });
      
      setActiveSection(currentSection.id);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Scroll with offset for the sticky nav
      const yOffset = -90;
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };
  
  return (
    <nav className={`bg-white w-full z-10 transition-all duration-200 ${
      isSticky ? "sticky top-0 shadow-sm" : ""
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center h-14 overflow-x-auto hide-scrollbar">
          <div className="flex items-center relative gap-x-1.5">
            <Button
              variant="ghost"
              className={`rounded-md h-9 border ${
                activeSection === "active-deals" 
                  ? "text-[#09261E] font-medium border-[#09261E]" 
                  : "bg-transparent text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
              onClick={() => scrollToSection("active-deals")}
            >
              <Briefcase size={16} className="mr-1.5" />
              <span>Active Deals</span>
              {activeDealsCount > 0 && (
                <span className={`ml-1.5 rounded-full ${
                  activeSection === "active-deals" 
                    ? "bg-white text-[#09261E]" 
                    : "bg-gray-100 text-gray-700"
                } px-1.5 py-0.5 text-xs font-medium`}>
                  {activeDealsCount}
                </span>
              )}
            </Button>
            
            <Button
              variant="ghost"
              className={`rounded-md h-9 border ${
                activeSection === "closed-deals" 
                  ? "text-[#09261E] font-medium border-[#09261E]" 
                  : "bg-transparent text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
              onClick={() => scrollToSection("closed-deals")}
            >
              <CheckSquare size={16} className="mr-1.5" />
              <span>Closed Deals</span>
              {closedDealsCount > 0 && (
                <span className={`ml-1.5 rounded-full ${
                  activeSection === "closed-deals" 
                    ? "bg-white text-[#09261E]" 
                    : "bg-gray-100 text-gray-700"
                } px-1.5 py-0.5 text-xs font-medium`}>
                  {closedDealsCount}
                </span>
              )}
            </Button>
            
            <Button
              variant="ghost"
              className={`rounded-md h-9 border ${
                activeSection === "activity" 
                  ? "text-[#09261E] font-medium border-[#09261E]" 
                  : "bg-transparent text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
              onClick={() => scrollToSection("activity")}
            >
              <Activity size={16} className="mr-1.5" />
              <span>Activity</span>
            </Button>
            
            <Button
              variant="ghost"
              className={`rounded-md h-9 border ${
                activeSection === "connections" 
                  ? "text-[#09261E] font-medium border-[#09261E]" 
                  : "bg-transparent text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
              onClick={() => scrollToSection("connections")}
            >
              <Users size={16} className="mr-1.5" />
              <span>Connections</span>
              {connectionsCount > 0 && (
                <span className={`ml-1.5 rounded-full ${
                  activeSection === "connections" 
                    ? "bg-white text-[#09261E]" 
                    : "bg-gray-100 text-gray-700"
                } px-1.5 py-0.5 text-xs font-medium`}>
                  {connectionsCount}
                </span>
              )}
            </Button>
            
            <Button
              variant="ghost"
              className={`rounded-md h-9 border ${
                activeSection === "reviews" 
                  ? "text-[#09261E] font-medium border-[#09261E]" 
                  : "bg-transparent text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
              onClick={() => scrollToSection("reviews")}
            >
              <MessageSquare size={16} className="mr-1.5" />
              <span>Reviews</span>
              {reviewsCount > 0 && (
                <span className={`ml-1.5 rounded-full ${
                  activeSection === "reviews" 
                    ? "bg-white text-[#09261E]" 
                    : "bg-gray-100 text-gray-700"
                } px-1.5 py-0.5 text-xs font-medium`}>
                  {reviewsCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}