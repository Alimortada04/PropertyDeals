import { useEffect, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  
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
  
  // Set up the autocomplete instance
  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    // Configure autocomplete with optimal options
    const options = {
      componentRestrictions: { country: "us" },
      fields: ["address_components", "geometry", "formatted_address", "place_id"],
      types: ["address"]
    };

    autocompleteRef.current = new google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    autocompleteRef.current.addListener("place_changed", () => {
      // Place selection is handled without access to the raw event
      // We'll apply our custom handling to prevent modal closure
      
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
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onChange, onPlaceSelect]);

  // This effect helps ensure the pac-container is properly positioned
  useEffect(() => {
    if (!isLoaded) return;
    
    // Function to fix positioning and styling of the autocomplete dropdown
    const fixPacContainer = () => {
      const pacContainer = document.querySelector('.pac-container');
      
      if (pacContainer && containerRef.current) {
        // Ensure the pac-container has our desired styles for better positioning
        const pacContainerEl = pacContainer as HTMLElement;
        
        // Set essential positioning styles
        pacContainerEl.style.width = `${containerRef.current.offsetWidth}px`;
        pacContainerEl.style.position = 'fixed';
        pacContainerEl.style.zIndex = '9999';
        
        // Calculate position based on input field
        if (inputRef.current) {
          const rect = inputRef.current.getBoundingClientRect();
          pacContainerEl.style.left = `${rect.left}px`;
          pacContainerEl.style.top = `${rect.bottom + 2}px`;
        }
        
        // Add a data attribute to mark the container as styled
        if (!pacContainerEl.hasAttribute('data-styled')) {
          pacContainerEl.setAttribute('data-styled', 'true');
          
          // Modify all pac-items to stop propagation on click events
          const pacItems = pacContainer.querySelectorAll('.pac-item');
          pacItems.forEach(item => {
            item.addEventListener('click', (e) => {
              e.stopPropagation();
              e.preventDefault();
              
              // Instead of letting the click bubble up, we'll manually trigger the selection
              // by simulating a keypress on the input element (Enter key after a small delay)
              setTimeout(() => {
                if (inputRef.current) {
                  const event = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                  });
                  inputRef.current.dispatchEvent(event);
                }
              }, 50);
            }, true);
          });
        }
      }
    };
    
    // Create observer to detect when pac-container is added to DOM
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const pacContainer = document.querySelector('.pac-container');
          if (pacContainer) {
            fixPacContainer();
            
            // Specifically intercept any potential click handlers on the pac-container
            if (!pacContainer.hasAttribute('data-click-intercepted')) {
              pacContainer.setAttribute('data-click-intercepted', 'true');
              
              pacContainer.addEventListener('mousedown', (e) => {
                e.stopPropagation();
              }, true);
              
              pacContainer.addEventListener('click', (e) => {
                e.stopPropagation();
              }, true);
            }
          }
        }
      }
    });
    
    // Start observing additions to the document body
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Add scroll and resize handlers to update position
    const handlePositionUpdate = () => {
      fixPacContainer();
    };
    
    document.addEventListener('scroll', handlePositionUpdate, true);
    window.addEventListener('resize', handlePositionUpdate);
    
    // Also run on initial load and a short interval to ensure proper positioning during animations
    fixPacContainer();
    const interval = setInterval(fixPacContainer, 100);
    setTimeout(() => clearInterval(interval), 1000);
    
    return () => {
      observer.disconnect();
      document.removeEventListener('scroll', handlePositionUpdate, true);
      window.removeEventListener('resize', handlePositionUpdate);
      clearInterval(interval);
    };
  }, [isLoaded]);
  
  // Fix click handling on dropdown items and prevent modal from closing
  useEffect(() => {
    const handlePacClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if click is on any part of the pac-container or its children
      const isPacElement = target.closest('.pac-container') || 
                          target.classList.contains('pac-item') || 
                          target.parentElement?.classList.contains('pac-item');
      
      if (isPacElement) {
        // Completely stop the event from propagating to prevent modal closing
        e.preventDefault();
        e.stopPropagation();
        
        // The click will still be handled by Google's internal handlers,
        // but won't bubble up to close the modal
      }
    };
    
    // This must use capture phase (true) to intercept events before modal handlers
    document.addEventListener('click', handlePacClick, true);
    document.addEventListener('mousedown', handlePacClick, true);
    document.addEventListener('mouseup', handlePacClick, true);
    
    return () => {
      document.removeEventListener('click', handlePacClick, true);
      document.removeEventListener('mousedown', handlePacClick, true);
      document.removeEventListener('mouseup', handlePacClick, true);
    };
  }, []);

  // Handle input change directly to ensure input is always controlled
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };
  
  // Handle keyboard interactions for improved accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Special case for Enter key with pac-container visible
    if (e.key === 'Enter' && document.querySelector('.pac-container')) {
      // Important: Stop event propagation to prevent modal from closing
      e.stopPropagation();
      e.preventDefault(); // Prevent form submission
      
      // First active item in the dropdown
      const firstItem = document.querySelector('.pac-item');
      if (firstItem) {
        try {
          // Simulate a click on the first item - but with our custom handling 
          // that stops event propagation
          (firstItem as HTMLElement).dispatchEvent(new MouseEvent('mousedown', {
            bubbles: false,
            cancelable: true,
            view: window,
          }));
          
          // Stop any further propagation
          e.nativeEvent.stopImmediatePropagation();
        } catch (err) {
          console.error('Error when selecting address suggestion:', err);
        }
      }
    }
  };

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