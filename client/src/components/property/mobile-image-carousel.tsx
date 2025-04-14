import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Heart, Share2, X } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

interface MobileImageCarouselProps {
  images: string[];
  address: string;
  onBack?: () => void;
}

const MobileImageCarousel: React.FC<MobileImageCarouselProps> = ({ 
  images, 
  address,
  onBack 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [startX, setStartX] = useState(0);
  const [favorited, setFavorited] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const itemWidth = scrollRef.current.clientWidth;
      const index = Math.round(scrollPosition / itemWidth);
      if (index !== currentIndex) {
        setCurrentIndex(index);
      }
    }
  };

  const scrollToImage = (index: number) => {
    if (scrollRef.current) {
      const newPosition = index * scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsScrolling(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isScrolling || !scrollRef.current) return;
    
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    
    if (Math.abs(diff) > 10) { // Minimum threshold to consider a swipe
      const direction = diff > 0 ? 1 : -1;
      const newIndex = Math.max(0, Math.min(currentIndex + direction, images.length - 1));
      
      if (newIndex !== currentIndex) {
        scrollToImage(newIndex);
      }
      
      setIsScrolling(false);
    }
  };

  const handleTouchEnd = () => {
    setIsScrolling(false);
  };

  return (
    <div className="relative w-full h-[50vh] bg-black">
      {/* Navigation buttons */}
      <button 
        onClick={onBack || (() => window.history.back())}
        className="absolute top-4 left-4 z-10 bg-black/40 rounded-full p-2 text-white"
      >
        <ArrowLeft size={20} />
      </button>
      
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <button className="bg-black/40 rounded-full p-2 text-white">
          <Share2 size={20} />
        </button>
        <button 
          className={`rounded-full p-2 ${favorited ? 'bg-[#803344] text-white' : 'bg-black/40 text-white'}`}
          onClick={() => setFavorited(!favorited)}
        >
          <Heart size={20} fill={favorited ? 'white' : 'none'} />
        </button>
      </div>
      
      {/* Image counter */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 rounded-full px-3 py-1 text-white text-xs">
        {currentIndex + 1}/{images.length}
      </div>
      
      {/* Image carousel */}
      <div 
        ref={scrollRef} 
        className="flex h-full w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((img, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 w-full h-full snap-center"
          >
            <img 
              src={img} 
              alt={`${address} photo ${index + 1}`} 
              className="w-full h-full object-cover" 
            />
          </div>
        ))}
      </div>
      
      {/* Image thumbnail navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-1">
        {images.map((_, index) => (
          <button 
            key={index} 
            onClick={() => scrollToImage(index)}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileImageCarousel;