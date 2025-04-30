import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GlobalSearchInput } from "@/components/search/global-search";

// Create a context for managing search state
type SearchContextType = {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Hook for accessing the search context
export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

// Provider component for search functionality
export function SearchProvider({ children }: { children: ReactNode }) {
  const [showSearch, setShowSearch] = useState(false);

  // Handle keyboard shortcut for search (Command+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Command+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(!showSearch);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  return (
    <SearchContext.Provider value={{ showSearch, setShowSearch }}>
      {children}
      {/* Render search overlay globally */}
      {showSearch && <GlobalSearchInput onClose={() => setShowSearch(false)} />}
    </SearchContext.Provider>
  );
}