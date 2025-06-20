import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileImageCarouselProps {
  images: string[];
  address: string;
  onBack?: () => void;
}

const MobileImageCarousel: React.FC<MobileImageCarouselProps> = ({
  images,
  address,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const touchStartRef = useRef<number | null>(null);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
    scrollToImage(index);
  };

  const scrollToImage = (index: number) => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: index * containerWidth,
        behavior: "smooth",
      });
    }
  };

  // Handle scroll event to update current index
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      if (isScrolling) return;

      const containerWidth = scrollContainer.offsetWidth;
      const scrollPosition = scrollContainer.scrollLeft;
      const newIndex = Math.round(scrollPosition / containerWidth);

      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [currentIndex, isScrolling]);

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
    setIsScrolling(true);
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    setIsScrolling(false);
  };

  return (
    <div className="relative w-full bg-black">
      {/* Image carousel */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar h-[40vh] md:h-[50vh]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.filter(image => image && image.trim() !== '').map((image, index) => (
          <div
            key={index}
            className="min-w-full h-full snap-center relative bg-white"
          >
            <img
              src={image}
              alt={`${address} - image ${index + 1}`}
              className="w-full max-h-[40vh] object-contain bg-white"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>

      {/* Image counter */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Image dots */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center">
        <div className="flex space-x-1.5 px-2 py-1">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-white/40"
              }`}
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileImageCarousel;
