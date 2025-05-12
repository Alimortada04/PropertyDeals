import { useEffect, useRef, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { LoadScript, Libraries } from "@react-google-maps/api";
import "./google-places-custom-styles.css";

// The libraries array should be defined outside the component and memoized
// to prevent unnecessary re-renders
const libraries: Libraries = ["places"];

export interface PlaceData {
  address: string;
  latitude: number;
  longitude: number;
  placeId: string;
  city?: string;
  state?: string;
  zipCode?: string;
  county?: string;
  neighborhood?: string;
  streetNumber?: string;
  streetName?: string;
}

interface GooglePlacesAutocompleteProps {
  id?: string;
  apiKey: string;
  value?: string;
  onChange: (address: string) => void;
  onPlaceSelect: (placeData: PlaceData) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  autoFocus?: boolean;
}

export default function GooglePlacesAutocomplete({
  id,
  apiKey,
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Enter an address",
  className = "",
  required = false,
  autoFocus = false,
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  
  // Track whether dropdown is open
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Update internal value when external value changes
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  // Focus the input when component mounts if autoFocus is true
  useEffect(() => {
    if (inputRef.current && autoFocus) {
      // Small delay to ensure modal has rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);
  

  
  // Fix click handling on dropdown - this ensures that dropdown clicks are properly captured
  useEffect(() => {
    // Handle click events on the dropdown to ensure proper interaction
    const handlePacContainerClick = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // Check if click is on a PAC item
      if (target && (
        target.className.includes('pac-item') || 
        target.parentElement?.className.includes('pac-item'))
      ) {
        // Prevent default behavior to avoid closing prematurely
        e.stopPropagation();
        
        // Small delay to allow Google's internal handler to process the selection
        setTimeout(() => {
          if (inputRef.current) {
            // This forces the autocomplete to process the selected item
            const event = new Event('change', { bubbles: true });
            inputRef.current.dispatchEvent(event);
          }
        }, 100);
      }
    };
    
    // When component mounts, listen for pac-container in the DOM
    const observer = new MutationObserver((mutations) => {
      const pacContainer = document.querySelector('.pac-container');
      if (pacContainer && !pacContainer.hasAttribute('data-event-attached')) {
        pacContainer.setAttribute('data-event-attached', 'true');
        // Add event listener with correct type
        pacContainer.addEventListener('click', handlePacContainerClick as EventListener, true);
        setDropdownOpen(true);
      } else if (!pacContainer && dropdownOpen) {
        setDropdownOpen(false);
      }
    });
    
    // Start observing the document body for pac-container
    observer.observe(document.body, { 
      childList: true,
      subtree: true
    });
    
    return () => {
      // Cleanup
      observer.disconnect();
      const pacContainer = document.querySelector('.pac-container');
      if (pacContainer) {
        pacContainer.removeEventListener('click', handlePacContainerClick as EventListener, true);
      }
    };
  }, [dropdownOpen]);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || !containerRef.current) return;

    // Configure autocomplete with optimal options for visibility and positioning
    const options = {
      componentRestrictions: { country: "us" },
      fields: ["address_components", "geometry", "formatted_address", "place_id"],
      types: ["address"],
      // Attach to our container instead of document.body
      container: containerRef.current
    };

    autocompleteRef.current = new google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    autocompleteRef.current.addListener("place_changed", () => {
      if (!autocompleteRef.current) return;
      
      const place = autocompleteRef.current.getPlace();
      
      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a place that was not suggested and
        // pressed the Enter key, or the Place Details request failed
        return;
      }

      // Get detailed address components
      let city = "";
      let state = "";
      let zipCode = "";
      let county = "";
      let neighborhood = "";
      let streetNumber = "";
      let streetName = "";
      
      place.address_components?.forEach((component) => {
        const types = component.types;
        
        if (types.includes("locality")) {
          city = component.long_name;
        } else if (types.includes("administrative_area_level_1")) {
          state = component.short_name;
        } else if (types.includes("postal_code")) {
          zipCode = component.long_name;
        } else if (types.includes("administrative_area_level_2")) {
          county = component.long_name;
        } else if (types.includes("neighborhood")) {
          neighborhood = component.long_name;
        } else if (types.includes("street_number")) {
          streetNumber = component.long_name;
        } else if (types.includes("route")) {
          streetName = component.long_name;
        }
      });

      const placeData: PlaceData = {
        address: place.formatted_address || "",
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        placeId: place.place_id || "",
        city,
        state,
        zipCode,
        county,
        neighborhood,
        streetNumber,
        streetName
      };

      setInputValue(placeData.address);
      onChange(placeData.address);
      onPlaceSelect(placeData);
    });

    return () => {
      if (autocompleteRef.current) {
        // Clean up listener (though Google doesn't provide a clear way to do this)
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onChange, onPlaceSelect]);

  // Handle input change directly to ensure input is always controlled
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };
  
  // Handle keyboard interactions for improved accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Special case for Enter key with dropdown visible
    if (e.key === 'Enter' && dropdownOpen) {
      e.preventDefault(); // Prevent form submission
      
      // First active item in the dropdown
      const firstItem = document.querySelector('.pac-item');
      if (firstItem) {
        // Simulate a click on the first item
        (firstItem as HTMLElement).click();
      }
    }
  };

  // Create a memoized reference to our positioning container
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={libraries}
      onLoad={() => setIsLoaded(true)}
    >
      {/* This wrapper establishes the positioning context for the dropdown */}
      <div 
        ref={containerRef}
        className="places-autocomplete-wrapper" 
        style={{ 
          position: 'relative',
          width: '100%',
          zIndex: 50
        }}
      >
        <Input
          id={id}
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className={`${className} google-places-input`}
          required={required}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoComplete="off" /* Disable browser autocomplete to prevent conflicts */
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoFocus={autoFocus}
          aria-label="Address search"
          data-address-input="true"
        />
      </div>
    </LoadScript>
  );
}