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
      const headerHeight = 400; // Approximate height of the header section
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
    <nav className={`bg-white border-b border-gray-200 w-full z-10 transition-all duration-200 ${
      isSticky ? "sticky top-0 shadow-sm" : ""
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto hide-scrollbar">
          <Button
            variant={activeSection === "active-deals" ? "default" : "ghost"}
            className={`py-5 px-4 rounded-none border-b-2 ${
              activeSection === "active-deals" 
                ? "border-[#09261E] bg-transparent text-[#09261E] hover:bg-gray-50" 
                : "border-transparent text-gray-600 hover:text-[#09261E] hover:bg-gray-50"
            }`}
            onClick={() => scrollToSection("active-deals")}
          >
            <Briefcase size={18} className="mr-2" />
            <span>Active Deals</span>
            {activeDealsCount > 0 && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                {activeDealsCount}
              </span>
            )}
          </Button>
          
          <Button
            variant={activeSection === "closed-deals" ? "default" : "ghost"}
            className={`py-5 px-4 rounded-none border-b-2 ${
              activeSection === "closed-deals" 
                ? "border-[#09261E] bg-transparent text-[#09261E] hover:bg-gray-50" 
                : "border-transparent text-gray-600 hover:text-[#09261E] hover:bg-gray-50"
            }`}
            onClick={() => scrollToSection("closed-deals")}
          >
            <CheckSquare size={18} className="mr-2" />
            <span>Closed Deals</span>
            {closedDealsCount > 0 && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                {closedDealsCount}
              </span>
            )}
          </Button>
          
          <Button
            variant={activeSection === "activity" ? "default" : "ghost"}
            className={`py-5 px-4 rounded-none border-b-2 ${
              activeSection === "activity" 
                ? "border-[#09261E] bg-transparent text-[#09261E] hover:bg-gray-50" 
                : "border-transparent text-gray-600 hover:text-[#09261E] hover:bg-gray-50"
            }`}
            onClick={() => scrollToSection("activity")}
          >
            <Activity size={18} className="mr-2" />
            <span>Activity</span>
          </Button>
          
          <Button
            variant={activeSection === "connections" ? "default" : "ghost"}
            className={`py-5 px-4 rounded-none border-b-2 ${
              activeSection === "connections" 
                ? "border-[#09261E] bg-transparent text-[#09261E] hover:bg-gray-50" 
                : "border-transparent text-gray-600 hover:text-[#09261E] hover:bg-gray-50"
            }`}
            onClick={() => scrollToSection("connections")}
          >
            <Users size={18} className="mr-2" />
            <span>Connections</span>
            {connectionsCount > 0 && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                {connectionsCount}
              </span>
            )}
          </Button>
          
          <Button
            variant={activeSection === "reviews" ? "default" : "ghost"}
            className={`py-5 px-4 rounded-none border-b-2 ${
              activeSection === "reviews" 
                ? "border-[#09261E] bg-transparent text-[#09261E] hover:bg-gray-50" 
                : "border-transparent text-gray-600 hover:text-[#09261E] hover:bg-gray-50"
            }`}
            onClick={() => scrollToSection("reviews")}
          >
            <MessageSquare size={18} className="mr-2" />
            <span>Reviews</span>
            {reviewsCount > 0 && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                {reviewsCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}