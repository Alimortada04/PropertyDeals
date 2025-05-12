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

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    const options = {
      componentRestrictions: { country: "us" },
      fields: ["address_components", "geometry", "formatted_address", "place_id"],
      types: ["address"],
      // Setting a higher z-index to ensure dropdown appears above other elements
      zIndex: 9999,
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

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={libraries}
      onLoad={() => setIsLoaded(true)}
    >
      <div className="relative w-full">
        <Input
          id={id}
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className={className}
          required={required}
          value={inputValue}
          onChange={handleInputChange}
          autoComplete="off" /* Disable browser autocomplete to prevent conflicts */
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoFocus={autoFocus}
          aria-label="Address search"
        />
      </div>
    </LoadScript>
  );
}