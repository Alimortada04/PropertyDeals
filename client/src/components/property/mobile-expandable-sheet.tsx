import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Property } from '@shared/schema';

interface MobileExpandableSheetProps {
  property: Property;
  className?: string;
  children: React.ReactNode;
}

const MobileExpandableSheet: React.FC<MobileExpandableSheetProps> = ({ 
  property,
  className = '',
  children
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [initialHeight, setInitialHeight] = useState(200); // Initial peek height
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<number | null>(null);
  const currentPositionRef = useRef<number>(0);

  // Set up the initial state on mount
  useEffect(() => {
    const handleResize = () => {
      if (sheetRef.current && contentRef.current) {
        setInitialHeight(Math.min(200, window.innerHeight * 0.25));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate max height based on content
  const getMaxHeight = () => {
    return window.innerHeight * 0.9; // 90% of viewport height
  };

  // Handle drag interactions
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = clientY;
    document.body.style.overflow = 'hidden'; // Prevent page scrolling during drag
  };

  const handleDrag = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartRef.current === null || !sheetRef.current) return;
    
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const delta = dragStartRef.current - clientY;
    const newPosition = Math.max(
      initialHeight,
      Math.min(getMaxHeight(), currentPositionRef.current + delta)
    );
    
    sheetRef.current.style.height = `${newPosition}px`;
  };

  const handleDragEnd = () => {
    dragStartRef.current = null;
    document.body.style.overflow = '';
    
    if (sheetRef.current) {
      const currentHeight = parseInt(sheetRef.current.style.height || initialHeight.toString());
      currentPositionRef.current = currentHeight;
      
      // Determine if we should snap to expanded or collapsed
      const threshold = (getMaxHeight() - initialHeight) / 2 + initialHeight;
      
      if (currentHeight > threshold) {
        expandSheet();
      } else {
        collapseSheet();
      }
    }
  };

  // Expand the sheet to full content
  const expandSheet = () => {
    if (sheetRef.current) {
      const maxHeight = getMaxHeight();
      sheetRef.current.style.height = `${maxHeight}px`;
      currentPositionRef.current = maxHeight;
      setIsExpanded(true);
    }
  };

  // Collapse the sheet to initial height
  const collapseSheet = () => {
    if (sheetRef.current) {
      sheetRef.current.style.height = `${initialHeight}px`;
      currentPositionRef.current = initialHeight;
      setIsExpanded(false);
    }
  };

  // Toggle the sheet expansion
  const toggleSheet = () => {
    if (isExpanded) {
      collapseSheet();
    } else {
      expandSheet();
    }
  };

  return (
    <div
      ref={sheetRef}
      className={`fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-lg transition-height overflow-y-auto z-20 ${className}`}
      style={{ 
        height: initialHeight,
        transitionDuration: '300ms',
        transitionTimingFunction: 'cubic-bezier(0.33, 1, 0.68, 1)'
      }}
    >
      {/* Drag handle */}
      <div 
        className="absolute left-0 right-0 top-0 h-10 flex justify-center items-center cursor-pointer"
        onTouchStart={handleDragStart}
        onTouchMove={handleDrag}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleDragStart}
        onMouseMove={dragStartRef.current !== null ? handleDrag : undefined}
        onMouseUp={handleDragEnd}
        onMouseLeave={dragStartRef.current !== null ? handleDragEnd : undefined}
        onClick={toggleSheet}
      >
        <div className="w-10 h-1 rounded-full bg-gray-300 my-2"></div>
        {isExpanded ? (
          <ChevronDown className="absolute right-4 text-gray-400" size={20} />
        ) : (
          <ChevronUp className="absolute right-4 text-gray-400" size={20} />
        )}
      </div>

      {/* Property summary section - always visible */}
      <div className="px-4 pt-10 pb-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#09261E]">${property.price?.toLocaleString()}</h1>
            <div className="flex text-sm space-x-4 mt-1 text-gray-600">
              <div>{property.bedrooms} bd</div>
              <div>{property.bathrooms} ba</div>
              <div>{property.squareFeet?.toLocaleString() || 'N/A'} sq ft</div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {property.address}, {property.city}, {property.state}
            </div>
          </div>
          <div className="bg-[#09261E]/10 text-[#09261E] text-xs font-semibold px-2 py-1 rounded">
            FOR SALE
          </div>
        </div>
      </div>

      {/* Content area */}
      <div
        ref={contentRef}
        className="px-4 pt-4 pb-24" // Extra padding at bottom for floating CTA
      >
        {children}
      </div>
    </div>
  );
};

export default MobileExpandableSheet;