import { useState, useEffect } from "react";
import { 
  Home, 
  Calendar, 
  Activity, 
  Users, 
  Star 
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [activeSection, setActiveSection] = useState("active-deals");
  const [isSticky, setIsSticky] = useState(false);
  
  // Handle scroll events to detect when sections come into view
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for navbar height
      
      // Check if we should make the nav sticky
      if (scrollPosition > 300) { // Arbitrary threshold
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
      
      // Detect which section is in view
      const sections = [
        { id: "active-deals", element: document.getElementById("active-deals") },
        { id: "closed-deals", element: document.getElementById("closed-deals") },
        { id: "activity", element: document.getElementById("activity") },
        { id: "connections", element: document.getElementById("connections") },
        { id: "reviews", element: document.getElementById("reviews") }
      ];
      
      // Find the section that's currently in view
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const topPosition = section.element.offsetTop;
          if (scrollPosition >= topPosition - 100) { // 100px offset
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -70; // Offset for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };
  
  return (
    <nav 
      className={cn(
        "bg-white w-full py-3 transition-all duration-300 border-b border-t border-gray-200 z-20",
        isSticky && "sticky top-0 shadow-sm"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => scrollToSection("active-deals")}
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 whitespace-nowrap font-medium rounded-lg transition-all",
              activeSection === "active-deals" 
                ? "text-[#09261E] bg-[#09261E]/10" 
                : "hover:bg-gray-100"
            )}
          >
            <Home size={18} className="mr-2" />
            <span>Active Deals</span>
            {activeDealsCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center h-5 w-5 bg-[#09261E] text-white text-xs rounded-full">
                {activeDealsCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => scrollToSection("closed-deals")}
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 whitespace-nowrap font-medium rounded-lg transition-all",
              activeSection === "closed-deals" 
                ? "text-[#09261E] bg-[#09261E]/10" 
                : "hover:bg-gray-100"
            )}
          >
            <Calendar size={18} className="mr-2" />
            <span>Closed Deals</span>
            {closedDealsCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center h-5 w-5 bg-[#09261E] text-white text-xs rounded-full">
                {closedDealsCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => scrollToSection("activity")}
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 whitespace-nowrap font-medium rounded-lg transition-all",
              activeSection === "activity" 
                ? "text-[#09261E] bg-[#09261E]/10" 
                : "hover:bg-gray-100"
            )}
          >
            <Activity size={18} className="mr-2" />
            <span>Activity</span>
          </button>
          
          <button 
            onClick={() => scrollToSection("connections")}
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 whitespace-nowrap font-medium rounded-lg transition-all",
              activeSection === "connections" 
                ? "text-[#09261E] bg-[#09261E]/10" 
                : "hover:bg-gray-100"
            )}
          >
            <Users size={18} className="mr-2" />
            <span>Connections</span>
            {connectionsCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center h-5 w-5 bg-[#09261E] text-white text-xs rounded-full">
                {connectionsCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => scrollToSection("reviews")}
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 whitespace-nowrap font-medium rounded-lg transition-all",
              activeSection === "reviews" 
                ? "text-[#09261E] bg-[#09261E]/10" 
                : "hover:bg-gray-100"
            )}
          >
            <Star size={18} className="mr-2" />
            <span>Reviews</span>
            {reviewsCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center h-5 w-5 bg-[#09261E] text-white text-xs rounded-full">
                {reviewsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}