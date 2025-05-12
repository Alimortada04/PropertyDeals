import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { LoadScript } from "@react-google-maps/api";

const libraries: ("places")[] = ["places"];

export interface PlaceData {
  address: string;
  latitude: number;
  longitude: number;
  placeId: string;
  city?: string;
  state?: string;
  zipCode?: string;
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
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    const options = {
      componentRestrictions: { country: "us" },
      fields: ["address_components", "geometry", "formatted_address", "place_id"],
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

      // Get address components
      let city = "";
      let state = "";
      let zipCode = "";
      
      place.address_components?.forEach((component) => {
        const types = component.types;
        
        if (types.includes("locality")) {
          city = component.long_name;
        } else if (types.includes("administrative_area_level_1")) {
          state = component.short_name;
        } else if (types.includes("postal_code")) {
          zipCode = component.long_name;
        }
      });

      const placeData: PlaceData = {
        address: place.formatted_address || "",
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        placeId: place.place_id || "",
        city,
        state,
        zipCode
      };

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

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={libraries}
      onLoad={() => setIsLoaded(true)}
    >
      <Input
        id={id}
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className={className}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </LoadScript>
  );
}