import React, { useState, useEffect } from 'react';
import { Property } from '@shared/schema';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Link } from 'wouter';

interface PropertyMapProps {
  properties: Partial<Property>[];
  onPropertyHover?: (propertyId: number | undefined | null) => void;
  hoveredPropertyId?: number | null;
}

interface PropertyPin {
  id: number;
  lat: number;
  lng: number;
  price: number | undefined;
}

export default function PropertyMap({ 
  properties, 
  onPropertyHover,
  hoveredPropertyId 
}: PropertyMapProps) {
  const [selectedPin, setSelectedPin] = useState<number | null>(null);
  const [mapPins, setMapPins] = useState<PropertyPin[]>([]);
  
  // Generate random coordinates for demo purposes
  // In a real app, these would come from the property's lat/lng
  useEffect(() => {
    // Base coordinates (approximately centered on a US map)
    const baseLat = 37.7749;
    const baseLng = -122.4194;
    
    // Generate pins with randomized positions close to the base
    const pins = properties.map(property => ({
      id: property.id || 0,
      lat: baseLat + (Math.random() * 0.1 - 0.05),
      lng: baseLng + (Math.random() * 0.1 - 0.05),
      price: property.price
    }));
    
    setMapPins(pins);
  }, [properties]);

  const handlePinClick = (propertyId: number) => {
    setSelectedPin(propertyId === selectedPin ? null : propertyId);
    if (onPropertyHover) {
      onPropertyHover(propertyId === selectedPin ? null : propertyId);
    }
  };

  const handlePinHover = (propertyId: number | null) => {
    if (onPropertyHover) {
      onPropertyHover(propertyId);
    }
  };

  const selectedProperty = properties.find(p => p.id === selectedPin);
  
  return (
    <div className="relative w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full" style={{ background: 'url(/images/map-placeholder.png) center/cover' }}>
        {/* Pins on the map */}
        {mapPins.map((pin) => (
          <button
            key={pin.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all ${
              hoveredPropertyId === pin.id || selectedPin === pin.id 
                ? 'scale-110 z-20' 
                : ''
            }`}
            style={{ 
              top: `${40 + (pin.lat - 37.7) * 500}%`, 
              left: `${50 + (pin.lng + 122.4) * 100}%`
            }}
            onClick={() => handlePinClick(pin.id)}
            onMouseEnter={() => handlePinHover(pin.id)}
            onMouseLeave={() => handlePinHover(null)}
          >
            <div className={`px-2 py-1 rounded-md text-white text-sm font-medium shadow-md ${
              hoveredPropertyId === pin.id || selectedPin === pin.id
                ? 'bg-[#E59F9F]'
                : 'bg-[#09261E]'
            }`}>
              ${pin.price?.toLocaleString()}
            </div>
          </button>
        ))}
      </div>

      {/* Property preview card when a pin is selected */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg z-30 max-w-md">
          <button 
            onClick={() => setSelectedPin(null)}
            className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <X size={14} />
          </button>
          
          <div className="flex p-3">
            <div className="w-1/3">
              <img 
                src={selectedProperty.imageUrl || "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                alt={selectedProperty.title || "Property"} 
                className="w-full h-24 object-cover rounded"
              />
            </div>
            <div className="w-2/3 pl-3">
              <h4 className="font-bold text-[#135341]">${selectedProperty.price?.toLocaleString()}</h4>
              <p className="text-sm text-gray-700 mb-1 truncate">{selectedProperty.address}</p>
              <div className="flex text-xs text-gray-600 mb-2">
                <span className="mr-2">{selectedProperty.bedrooms} beds</span>
                <span className="mr-2">{selectedProperty.bathrooms} baths</span>
                <span>{selectedProperty.squareFeet?.toLocaleString()} sqft</span>
              </div>
              <Link href={`/p/${selectedProperty.id}`}>
                <Button 
                  size="sm" 
                  className="w-full bg-[#135341] hover:bg-[#09261E] text-white text-xs"
                >
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Map attribution */}
      <div className="absolute bottom-1 right-1 text-xs text-gray-500">
        Map data visualization (Placeholder)
      </div>
    </div>
  );
}