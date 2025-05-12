import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { LoadScript, Libraries } from "@react-google-maps/api";
import "./google-places-custom-styles.css";

// The libraries array should be defined outside the component and memoized
// to prevent unnecessary re-renders
const libraries: Libraries = ["places"];

// Global state to track if places autocomplete is active
// Used to prevent modal closing when interacting with places dropdown
export const placesAutocompleteState = {
  isActive: false,
  setActive: (active: boolean) => {
    placesAutocompleteState.isActive = active;
    // Set a data attribute on document for DOM-based detection
    if (active) {
      document.documentElement.setAttribute('data-places-active', 'true');
    } else {
      document.documentElement.removeAttribute('data-places-active');
    }
  }
};

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

    // Set up a global mutation observer to detect when the pac-container is added to DOM
    const observer = new MutationObserver((mutations) => {
      // Check if any mutation added the pac-container
      let pacContainerAdded = false;
      
      for (let i = 0; i < mutations.length; i++) {
        const mutation = mutations[i];
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          for (let j = 0; j < mutation.addedNodes.length; j++) {
            const node = mutation.addedNodes[j] as HTMLElement;
            if (node.classList && node.classList.contains('pac-container')) {
              pacContainerAdded = true;
              break;
            }
          }
        }
        if (pacContainerAdded) break;
      }
      
      // If the pac-container was added, set active state
      if (pacContainerAdded) {
        placesAutocompleteState.setActive(true);
      }
    });
    
    // Start observing the document body for added/removed nodes
    observer.observe(document.body, { childList: true, subtree: false });

    autocompleteRef.current.addListener("place_changed", () => {
      console.log("Place changed event triggered");
      // Log for debugging
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] place_changed event triggered`);
      
      // Set active state to false when place is selected
      placesAutocompleteState.setActive(false);
      
      if (!autocompleteRef.current) {
        console.warn("Autocomplete ref is not available");
        return;
      }
      
      try {
        const place = autocompleteRef.current.getPlace();
        console.log("Place object received:", place);
        
        // Check if we got a valid place with geometry 
        if (!place || !place.geometry || !place.geometry.location) {
          console.warn("Missing geometry in selected place, attempting to recover...");
          
          // Try to recover by searching for the current input value
          const searchValue = inputRef.current?.value || '';
          if (searchValue.length > 3) {
            console.log(`Attempting geocode lookup for: "${searchValue}"`);
            
            // Set up a geocoder to try to get the place data
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: searchValue }, (results, status) => {
              console.log(`Geocode result status: ${status}`, results);
              
              if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
                const result = results[0];
                console.log("Recovered place from geocoder:", result);
                
                // Extract place data manually
                let extractedData: PlaceData = {
                  address: result.formatted_address,
                  latitude: result.geometry.location.lat(),
                  longitude: result.geometry.location.lng(),
                  placeId: result.place_id,
                  city: '',
                  state: '',
                  zipCode: '',
                  county: '',
                  neighborhood: '',
                  streetNumber: '',
                  streetName: '',
                };
                
                // Extract address components
                for (const component of result.address_components) {
                  const types = component.types;
                  
                  if (types.includes('street_number')) {
                    extractedData.streetNumber = component.long_name;
                  } else if (types.includes('route')) {
                    extractedData.streetName = component.long_name;
                  } else if (types.includes('locality')) {
                    extractedData.city = component.long_name;
                  } else if (types.includes('administrative_area_level_1')) {
                    extractedData.state = component.short_name;
                  } else if (types.includes('postal_code')) {
                    extractedData.zipCode = component.long_name;
                  } else if (types.includes('administrative_area_level_2')) {
                    extractedData.county = component.long_name;
                  } else if (types.includes('neighborhood')) {
                    extractedData.neighborhood = component.long_name;
                  }
                }
                
                console.log("Calling onPlaceSelect with geocoded data:", extractedData);
                setInputValue(extractedData.address);
                onChange(extractedData.address);
                onPlaceSelect(extractedData);
                
                // Also update the input value to match the formatted address
                if (inputRef.current) {
                  inputRef.current.value = result.formatted_address;
                  // Update the internal value state
                  setInputValue(result.formatted_address);
                }
              } else {
                console.error(`Geocode failed with status: ${status}`);
              }
            });
          } else {
            console.warn(`Input value too short for geocoding: "${searchValue}"`);
          }
          return;
        }
        
        // If we get here, we have a valid place with geometry
        console.log("Valid place object with geometry received", place);
        
        // Process the valid place data
        // Get detailed address components
        let city = "";
        let state = "";
        let zipCode = "";
        let county = "";
        let neighborhood = "";
        let streetNumber = "";
        let streetName = "";
        
        // Type-safe processing of address components
        if (place.address_components) {
          place.address_components.forEach((component: any) => {
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
        }

        // Construct the place data object with all components
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
        
        console.log("Constructed place data:", placeData);
        setInputValue(placeData.address);
        onChange(placeData.address);
        onPlaceSelect(placeData);
      } catch (error) {
        console.error("Error in place_changed event handler:", error);
      }
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
  
  // Fix click handling on dropdown items and ensure consistent behavior between mouse and keyboard
  useEffect(() => {
    // Direct handler for clicks on pac-items to trigger place selection
    const handleItemClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const pacItem = target.closest('.pac-item') as HTMLElement;
      
      if (pacItem) {
        console.log('Direct click on pac-item detected');
        
        // Prevent default Google handling which may not work consistently
        e.preventDefault();
        e.stopPropagation();
        
        // Get the main text content from the item
        // We need to be very careful about extracting the text correctly
        let mainText = '';
        const mainSpan = pacItem.querySelector('.pac-item-query');
        
        if (mainSpan) {
          mainText = mainSpan.textContent || '';
          const matchedSpans = mainSpan.querySelectorAll('.pac-matched');
          // Add any matched spans content
          if (matchedSpans.length > 0) {
            mainText = '';
            for (let i = 0; i < mainSpan.childNodes.length; i++) {
              const node = mainSpan.childNodes[i];
              if (node.nodeType === Node.TEXT_NODE) {
                mainText += node.textContent || '';
              } else if (node.nodeType === Node.ELEMENT_NODE) {
                mainText += node.textContent || '';
              }
            }
          }
        }
        
        // Get the secondary text (typically state/country)
        const secondaryText = Array.from(pacItem.childNodes)
          .filter(node => 
            node.nodeType === Node.TEXT_NODE || 
            (node.nodeType === Node.ELEMENT_NODE && 
             !(node as HTMLElement).classList.contains('pac-item-query') && 
             !(node as HTMLElement).classList.contains('pac-icon'))
          )
          .map(node => node.textContent || '')
          .join('');
        
        // Combine for full address
        const fullAddress = `${mainText} ${secondaryText}`.trim();
        console.log('Extracted address text:', fullAddress);
        
        // Set input value and maintain focus
        if (inputRef.current && fullAddress) {
          // Set value first
          inputRef.current.value = fullAddress;
          inputRef.current.focus();
          
          // Dispatch input event to notify Google's autocomplete
          inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
          
          // Set the active state
          placesAutocompleteState.setActive(true);
          
          // Force enter key event after a short delay
          setTimeout(() => {
            if (document.activeElement === inputRef.current) {
              // Explicitly trigger enter key
              const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                bubbles: true,
                cancelable: true
              });
              
              inputRef.current?.dispatchEvent(enterEvent);
              console.log('Simulated Enter key press');
            }
          }, 50);
        }
      }
    };
    
    // General handler for all events in the pac-container
    const handlePacClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if click is on any part of the pac-container or its children
      const isPacContainer = target.closest('.pac-container');
      const isPacItem = target.classList.contains('pac-item') || target.closest('.pac-item');
      
      if (isPacContainer) {
        // Completely stop the event from propagating to prevent modal closing
        e.stopPropagation();
        
        // Apply our special handling only for pac items
        if (isPacItem) {
          // Let our specialized handler do the work
          handleItemClick(e);
        }
      }
    };
    
    // Handle mouseover to apply the same visual styling as keyboard navigation
    const handlePacMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const pacItem = target.classList.contains('pac-item') ? target : target.closest('.pac-item');
      
      if (pacItem) {
        // Remove selected class from any previously selected items
        const selectedItems = document.querySelectorAll('.pac-item-selected');
        selectedItems.forEach(item => {
          if (item !== pacItem) {
            item.classList.remove('pac-item-selected');
          }
        });
        
        // Add selected class to the hovered item
        pacItem.classList.add('pac-item-selected');
      }
    };
    
    // Handle mouseout to remove selected class when not hovering
    const handlePacMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const pacItem = target.classList.contains('pac-item') ? target : target.closest('.pac-item');
      
      if (pacItem) {
        // Only remove if we're leaving this specific item
        // and not just moving to a child element
        if (!pacItem.contains(e.relatedTarget as Node)) {
          pacItem.classList.remove('pac-item-selected');
        }
      }
    };
    
    // This must use capture phase (true) to intercept events before modal handlers
    document.addEventListener('click', handlePacClick, true);
    document.addEventListener('mousedown', handlePacClick, true);
    document.addEventListener('mouseup', handlePacClick, true);
    document.addEventListener('mouseover', handlePacMouseOver, true);
    document.addEventListener('mouseout', handlePacMouseOut, true);
    
    // We now handle the item-selected event with dedicated handler below
    
    // Special direct handler for pac-item clicks
    const setupPacItemClickHandlers = () => {
      console.log("Setting up direct pac-item click handlers");
      const pacItems = document.querySelectorAll('.pac-item');
      
      pacItems.forEach(item => {
        // Fix TypeScript error by creating a type-compatible event handler
        const typedHandler = (evt: Event) => {
          // Cast the event to any for compatibility
          handleItemClick(evt as unknown as MouseEvent);
        };
        
        // Create a mousedown handler - this seems to be more reliable than click
        const mouseDownHandler = (evt: Event) => {
          console.log('Custom mousedown on pac-item');
          evt.stopPropagation();
          evt.preventDefault();
          
          // Force focus back to input field
          setTimeout(() => {
            inputRef.current?.focus();
          }, 10);
          
          // Simulate a click
          setTimeout(() => {
            handleItemClick(evt as unknown as MouseEvent);
          }, 50);
        };
        
        // Remove any existing handlers first
        item.removeEventListener('click', typedHandler, true);
        item.removeEventListener('mousedown', mouseDownHandler as EventListener, true);
        
        // Add handlers directly to the item
        item.addEventListener('click', typedHandler, true);
        item.addEventListener('mousedown', mouseDownHandler as EventListener, true);
        
        // Also add a data attribute to track that we've added a handler
        (item as HTMLElement).setAttribute('data-has-custom-click', 'true');
        console.log("Added click and mousedown handlers to pac-item");
      });
    };
    
    // Set up a MutationObserver to watch for when pac-container is added
    const pacObserver = new MutationObserver(() => {
      const pacContainer = document.querySelector('.pac-container');
      if (pacContainer) {
        // When pac-container appears, set up handlers for its items
        setupPacItemClickHandlers();
        
        // Also set up handlers whenever pac-container content changes
        const itemsObserver = new MutationObserver(setupPacItemClickHandlers);
        itemsObserver.observe(pacContainer, { childList: true, subtree: true });
      }
    });
    
    // Start observing document for pac-container
    pacObserver.observe(document.body, { childList: true, subtree: false });
    
    // Handler for the custom item-selected event
    const handleItemSelected = (e: Event) => {
      if (e instanceof CustomEvent && e.detail && e.detail.element) {
        console.log('Custom item-selected event received');
        handleItemClick({
          target: e.detail.element,
          preventDefault: () => {},
          stopPropagation: () => {}
        } as unknown as MouseEvent);
      }
    };
    
    // Add the listener
    document.addEventListener('item-selected', handleItemSelected);
    
    return () => {
      document.removeEventListener('click', handlePacClick, true);
      document.removeEventListener('mousedown', handlePacClick, true);
      document.removeEventListener('mouseup', handlePacClick, true);
      document.removeEventListener('mouseover', handlePacMouseOver, true);
      document.removeEventListener('mouseout', handlePacMouseOut, true);
      document.removeEventListener('item-selected', handleItemSelected);
      pacObserver.disconnect();
      
      // Remove any direct handlers we added
      const pacItems = document.querySelectorAll('.pac-item[data-has-custom-click="true"]');
      pacItems.forEach(item => {
        // We can't reference the original handler, but we can remove listeners by type
        // This is a bit of a sledgehammer approach but works for cleanup
        const clone = item.cloneNode(true);
        item.parentNode?.replaceChild(clone, item);
      });
    };
  }, []);

  // Handle input change directly to ensure input is always controlled
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    
    // Mark as active when typing to prevent modal closing
    if (newValue.length > 1) {
      placesAutocompleteState.setActive(true);
    }
  };
  
  // Handle focus event
  const handleInputFocus = () => {
    // Mark as active when focused to prevent modal closing
    placesAutocompleteState.setActive(true);
  };
  
  // Handle blur with delay to allow click events to process
  const handleInputBlur = () => {
    // Delay setting inactive state to allow dropdown selection to process first
    setTimeout(() => {
      const pacContainer = document.querySelector('.pac-container');
      // Only set inactive if dropdown isn't visible
      if (!pacContainer || window.getComputedStyle(pacContainer).display === 'none') {
        placesAutocompleteState.setActive(false);
      }
    }, 300);
  };
  
  // Handle keyboard interactions for improved accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Special case for Enter key with pac-container visible
    if (e.key === 'Enter' && document.querySelector('.pac-container')) {
      // Important: Stop event propagation to prevent modal from closing
      e.stopPropagation();
      e.preventDefault(); // Prevent form submission
      
      // Get the currently selected item or the first item in the dropdown
      const selectedItem = document.querySelector('.pac-item-selected') || document.querySelector('.pac-item');
      
      if (selectedItem) {
        try {
          console.log('Enter key pressed with pac suggestion visible');
          
          // Instead of simulating a mousedown, use our custom handler directly
          // for consistency between keyboard and mouse interactions
          if (selectedItem instanceof HTMLElement) {
            const customEvent = new CustomEvent('item-selected', {
              bubbles: true,
              cancelable: true,
              detail: { element: selectedItem }
            });
            
            // Dispatch our custom event that our handler will pick up
            document.dispatchEvent(customEvent);
            
            // Focus the input after a brief delay
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }, 50);
          }
          
          // Stop any further propagation
          e.nativeEvent.stopImmediatePropagation();
        } catch (err) {
          console.error('Error when selecting address suggestion:', err);
        }
      }
    }
  };
  
  // Helper function to extract place data from geocoder result
  const extractPlaceDataFromGeocoder = (result: google.maps.GeocoderResult): PlaceData => {
    let streetNumber = '';
    let streetName = '';
    let city = '';
    let state = '';
    let zipCode = '';
    let county = '';
    let neighborhood = '';
    
    // Extract address components
    for (const component of result.address_components) {
      const types = component.types;
      
      if (types.includes('street_number')) {
        streetNumber = component.long_name;
      } else if (types.includes('route')) {
        streetName = component.long_name;
      } else if (types.includes('locality')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.short_name;
      } else if (types.includes('postal_code')) {
        zipCode = component.long_name;
      } else if (types.includes('administrative_area_level_2')) {
        county = component.long_name;
      } else if (types.includes('neighborhood')) {
        neighborhood = component.long_name;
      }
    }
    
    return {
      address: result.formatted_address,
      latitude: result.geometry.location.lat(),
      longitude: result.geometry.location.lng(),
      placeId: result.place_id,
      city,
      state,
      zipCode,
      county,
      neighborhood,
      streetNumber,
      streetName,
    };
  };
  
  // Function to manually trigger place selection from a pac-item
  // This ensures both mouse and keyboard trigger the same behavior
  const triggerPlaceSelection = (item: HTMLElement) => {
    // First make sure this item is visually selected
    const allItems = document.querySelectorAll('.pac-item');
    allItems.forEach(el => el.classList.remove('pac-item-selected'));
    item.classList.add('pac-item-selected');
    
    // We need to extract the place description from the item
    // and set it as the input value to trigger Google's internal selection
    const description = item.textContent || '';
    
    if (inputRef.current) {
      // Set the input value to trigger Google's internal place selection
      inputRef.current.value = description;
      const event = new Event('input', { bubbles: true });
      inputRef.current.dispatchEvent(event);
      
      // Force focus on the input to ensure the place_changed event fires
      inputRef.current.focus();
      
      // Programmatically trigger the selection after a brief delay
      setTimeout(() => {
        // Trigger Enter key press to select the currently highlighted suggestion
        const enterKeyEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true
        });
        inputRef.current?.dispatchEvent(enterKeyEvent);
      }, 100);
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
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
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