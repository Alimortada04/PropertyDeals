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
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-start justify-center p-0 overflow-hidden backdrop-blur-sm">
      <div className="w-full h-full flex flex-col items-center">
        <div className="w-full max-w-5xl px-4 pt-[15vh] pb-8" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white/95 rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="p-6 border-b">
              <div className="flex items-center">
                <Search className="w-6 h-6 text-gray-400 mr-3" />
                <input 
                  type="text" 
                  className="flex-1 outline-none text-2xl bg-transparent placeholder-gray-400"
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
            
            <div className="p-2 max-h-[65vh] overflow-y-auto">
              {searchTerm.trim() === '' ? (
                // Show recent searches if no search term
                recentSearches.length > 0 ? (
                  <div className="p-2">
                    <h3 className="text-sm font-semibold text-primary/80 px-3 py-2 uppercase tracking-wide">Recent Searches</h3>
                    <div className="space-y-2">
                      {recentSearches.map((term, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center p-3 rounded-lg hover:bg-gray-100/80 transition-colors cursor-pointer"
                          onClick={() => setSearchTerm(term)}
                        >
                          <Search className="h-5 w-5 text-[#803344] mr-3" />
                          <p className="font-medium">{term}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Default navigation options if no recent searches
                  <div className="p-2">
                    <h3 className="text-sm font-semibold text-primary/80 px-3 py-2 uppercase tracking-wide">Quick Navigation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                      <Link href="/properties" onClick={() => onClose()}>
                        <div className="flex items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 hover:shadow-sm transition-all">
                          <Building className="h-6 w-6 text-[#09261E] mr-4" />
                          <div>
                            <p className="font-medium text-[#09261E]">Properties</p>
                            <p className="text-sm text-gray-500">Browse available properties</p>
                          </div>
                        </div>
                      </Link>
                      <Link href="/reps" onClick={() => onClose()}>
                        <div className="flex items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 hover:shadow-sm transition-all">
                          <User className="h-6 w-6 text-[#803344] mr-4" />
                          <div>
                            <p className="font-medium text-[#09261E]">Professionals</p>
                            <p className="text-sm text-gray-500">Find real estate professionals</p>
                          </div>
                        </div>
                      </Link>
                      <Link href="/playbook" onClick={() => onClose()}>
                        <div className="flex items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 hover:shadow-sm transition-all">
                          <Book className="h-6 w-6 text-[#135341] mr-4" />
                          <div>
                            <p className="font-medium text-[#09261E]">Playbook</p>
                            <p className="text-sm text-gray-500">Educational resources and guides</p>
                          </div>
                        </div>
                      </Link>
                      <Link href="/inbox" onClick={() => onClose()}>
                        <div className="flex items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 hover:shadow-sm transition-all">
                          <MessageCircle className="h-6 w-6 text-[#E59F9F] mr-4" />
                          <div>
                            <p className="font-medium text-[#09261E]">Messages</p>
                            <p className="text-sm text-gray-500">View your conversations</p>
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
                    <h3 className="text-sm font-semibold text-primary/80 px-3 py-2 uppercase tracking-wide flex items-center">
                      {section.title}
                      <Tag className="h-3 w-3 ml-2" />
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {section.results.map((result) => (
                        <Link 
                          key={result.id} 
                          href={result.path}
                          onClick={() => {
                            saveSearch(searchTerm);
                            onClose();
                          }}
                        >
                          <div className="flex items-center p-4 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all">
                            <div className="rounded-full bg-gray-100 p-2 mr-3">
                              {result.icon}
                            </div>
                            <div>
                              <p className="font-medium text-[#09261E]">{result.title}</p>
                              <p className="text-sm text-gray-500">{result.description}</p>
                            </div>
                            <span className="ml-auto text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{result.location}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // No results found
                <div className="py-12 text-center">
                  <div className="bg-gray-50 inline-block p-4 rounded-full mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-lg text-gray-500">No results found for "{searchTerm}"</p>
                  <p className="text-sm text-gray-400 mt-2">Try a different search term or browse the categories</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};