import React, { useState, useEffect } from 'react';
import { Search, Tag, Map, Building, User, Book, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'wouter';

type SearchResult = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  location: string;
  type: 'property' | 'rep' | 'page' | 'post' | 'article';
};

type SearchSection = {
  title: string;
  results: SearchResult[];
};

// Mock data for demonstration - in production this would come from a backend search API
const mockSearchData: SearchResult[] = [
  {
    id: '1',
    title: 'Modern Farmhouse',
    description: '4bd • 3ba • 2,450sqft',
    icon: <Building className="h-5 w-5 text-gray-500" />,
    path: '/properties/modern-farmhouse',
    location: 'Properties',
    type: 'property'
  },
  {
    id: '2',
    title: 'Downtown Loft',
    description: '2bd • 2ba • 1,200sqft',
    icon: <Building className="h-5 w-5 text-gray-500" />,
    path: '/properties/downtown-loft',
    location: 'Properties',
    type: 'property'
  },
  {
    id: '3',
    title: 'Alexander Rivera',
    description: 'Real Estate Agent • 4.9 ⭐',
    icon: <User className="h-5 w-5 text-gray-500" />,
    path: '/reps/alexander-rivera',
    location: 'REPs',
    type: 'rep'
  },
  {
    id: '4',
    title: 'Emily Johnson',
    description: 'Property Manager • 4.8 ⭐',
    icon: <User className="h-5 w-5 text-gray-500" />,
    path: '/reps/emily-johnson',
    location: 'REPs',
    type: 'rep'
  },
  {
    id: '5',
    title: 'Fix and Flip Calculator',
    description: 'Calculate potential profits for fix and flip projects',
    icon: <FileText className="h-5 w-5 text-gray-500" />,
    path: '/playbook/tools/fix-and-flip',
    location: 'Playbook',
    type: 'page'
  },
  {
    id: '6',
    title: 'Real Estate Terms',
    description: 'Comprehensive glossary of real estate terminology',
    icon: <Book className="h-5 w-5 text-gray-500" />,
    path: '/playbook/property-dictionary',
    location: 'Playbook',
    type: 'page'
  },
  {
    id: '7',
    title: 'Seattle Market Trends',
    description: 'Latest insights on the Seattle real estate market',
    icon: <Map className="h-5 w-5 text-gray-500" />,
    path: '/market-reports/seattle',
    location: 'Market Reports',
    type: 'article'
  },
  {
    id: '8',
    title: 'First-Time Homebuyer Guide',
    description: 'Complete guide for first-time homebuyers',
    icon: <Book className="h-5 w-5 text-gray-500" />,
    path: '/playbook/guides/first-time-homebuyer',
    location: 'Playbook',
    type: 'article'
  }
];

interface GlobalSearchInputProps {
  onClose: () => void;
}

export const GlobalSearchInput = ({ onClose }: GlobalSearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchSection[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    }
  }, []);

  // Save search term to recent searches
  const saveSearch = (term: string) => {
    if (term.trim() === '') return;
    
    const newRecentSearches = [
      term, 
      ...recentSearches.filter(s => s !== term)
    ].slice(0, 5); // Keep only the 5 most recent searches
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
  };

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setResults([]);
      return;
    }

    // Filter mock data based on search term
    const filteredResults = mockSearchData.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group results by type
    const sections: Record<string, SearchResult[]> = {};
    
    filteredResults.forEach(result => {
      if (!sections[result.location]) {
        sections[result.location] = [];
      }
      sections[result.location].push(result);
    });

    // Convert to array format
    const sectionArray = Object.entries(sections).map(([title, results]) => ({
      title,
      results
    }));

    setResults(sectionArray);
  }, [searchTerm]);

  // Handle keyboard events (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-start justify-center p-0 overflow-hidden">
      <div className="w-full h-full flex flex-col items-center">
        <div className="w-full max-w-4xl px-6 pt-[15vh] pb-8" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input 
                  type="text" 
                  className="flex-1 outline-none text-xl bg-transparent"
                  placeholder="Search across PropertyDeals..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                <kbd className="ml-2 pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-slate-100 px-2 font-mono text-[12px] font-medium">
                  ESC
                </kbd>
              </div>
            </div>
            
            <div className="p-1 max-h-[60vh] overflow-y-auto">
              {searchTerm.trim() === '' ? (
                // Show recent searches if no search term
                recentSearches.length > 0 ? (
                  <div className="p-2">
                    <h3 className="text-sm font-semibold text-gray-500 px-3 py-2 uppercase tracking-wide">Recent Searches</h3>
                    <div className="space-y-1">
                      {recentSearches.map((term, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => setSearchTerm(term)}
                        >
                          <Search className="h-5 w-5 text-gray-500 mr-3" />
                          <p className="font-medium">{term}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Default navigation options if no recent searches
                  <div className="p-2">
                    <h3 className="text-sm font-semibold text-gray-500 px-3 py-2 uppercase tracking-wide">Quick Navigation</h3>
                    <div className="space-y-1">
                      <Link href="/properties" onClick={() => onClose()}>
                        <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
                          <Building className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="font-medium">Properties</p>
                            <p className="text-xs text-gray-500">Browse available properties</p>
                          </div>
                          <span className="ml-auto text-xs text-gray-400">⌘1</span>
                        </div>
                      </Link>
                      <Link href="/reps" onClick={() => onClose()}>
                        <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
                          <User className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="font-medium">Professionals</p>
                            <p className="text-xs text-gray-500">Find real estate professionals</p>
                          </div>
                        </div>
                      </Link>
                      <Link href="/playbook" onClick={() => onClose()}>
                        <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
                          <Book className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="font-medium">Playbook</p>
                            <p className="text-xs text-gray-500">Educational resources and guides</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )
              ) : results.length > 0 ? (
                // Show search results
                results.map((section, idx) => (
                  <div key={idx} className="p-2">
                    <h3 className="text-sm font-semibold text-gray-500 px-3 py-2 uppercase tracking-wide flex items-center">
                      {section.title}
                      <Tag className="h-3 w-3 ml-2" />
                    </h3>
                    <div className="space-y-1">
                      {section.results.map((result) => (
                        <Link 
                          key={result.id} 
                          href={result.path}
                          onClick={() => {
                            saveSearch(searchTerm);
                            onClose();
                          }}
                        >
                          <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
                            {result.icon}
                            <div className="ml-3">
                              <p className="font-medium">{result.title}</p>
                              <p className="text-xs text-gray-500">{result.description}</p>
                            </div>
                            <span className="ml-auto text-xs text-gray-400">{result.location}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // No results found
                <div className="p-8 text-center">
                  <p className="text-gray-500">No results found for "{searchTerm}"</p>
                  <p className="text-sm text-gray-400 mt-1">Try a different search term or browse the categories below</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};