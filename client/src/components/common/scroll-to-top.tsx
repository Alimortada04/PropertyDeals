import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

interface ScrollToTopProps {
  behavior?: ScrollBehavior;
  onlyPathChange?: boolean;
}

/**
 * Component that scrolls the window to the top when the route changes
 * @param behavior - The scrolling behavior ('auto', 'smooth', or undefined)
 * @param onlyPathChange - If true, only scroll when the path changes, not when hash or search params change
 */
export function ScrollToTop({ 
  behavior = 'auto', 
  onlyPathChange = false 
}: ScrollToTopProps = {}) {
  const [location] = useLocation();
  const prevPathRef = useRef<string>(location);

  useEffect(() => {
    // If onlyPathChange is true, check if the actual path has changed
    // (ignoring hash and search params)
    if (onlyPathChange) {
      const currentPath = location.split('?')[0].split('#')[0];
      const prevPath = prevPathRef.current.split('?')[0].split('#')[0];
      
      if (currentPath !== prevPath) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior
        });
        prevPathRef.current = location;
      }
    } else {
      // Always scroll to top on any location change
      window.scrollTo({
        top: 0,
        left: 0,
        behavior
      });
      prevPathRef.current = location;
    }
  }, [location, behavior, onlyPathChange]);

  return null;
}