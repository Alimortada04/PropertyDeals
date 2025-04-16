import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"; // If you use clsx or a similar util

export default function StickySearchBar() {
  const [isSticky, setIsSticky] = useState(false);
  const [hideBottom, setHideBottom] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const searchTop = searchRef.current?.offsetTop || 0;

      setIsSticky(scrollY > searchTop);
      setHideBottom(scrollY > lastScrollY && scrollY > searchTop);

      setLastScrollY(scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div ref={searchRef} className="relative z-50">
      <div
        className={cn(
          "bg-white/90 backdrop-blur-sm shadow-sm border-b transition-all duration-300",
          isSticky ? "fixed top-0 w-full" : "static"
        )}
      >
        {/* Top Half */}
        <div className="flex items-center justify-between gap-2 px-4 py-3 max-w-6xl mx-auto">
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xl text-gray-500">
              <i className="fas fa-search" />
            </span>
            <Input
              placeholder="Search professionals by name, specialty, or keyword..."
              className="flex-1 text-base"
            />
          </div>
          <Button
            variant="outline"
            className="rounded-md border text-sm font-medium text-gray-800"
          >
            <i className="fas fa-sliders-h mr-2" /> Filters
          </Button>
        </div>

        {/* Bottom Half */}
        <div
          className={cn(
            "transition-all duration-300 overflow-x-auto scrollbar-hide",
            hideBottom ? "h-0 opacity-0" : "h-auto opacity-100"
          )}
        >
          <div className="flex gap-4 px-4 pb-3 max-w-6xl mx-auto text-sm text-gray-700">
            {[
              "All",
              "Seller",
              "Agent",
              "Contractor",
              "Lender",
              "Appraiser",
              "Inspector",
              "Mover",
              "Landscaper",
            ].map((role) => (
              <button
                key={role}
                className="px-3 py-1 rounded-full hover:bg-gray-100 transition whitespace-nowrap text-sm font-medium"
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
