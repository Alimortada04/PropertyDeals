import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Search, BookOpen } from "lucide-react";
import { dictionaryTerms, DictionaryTerm } from "@/lib/dictionary-data";

export default function PropertyDictionaryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [letterFilter, setLetterFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredTerms, setFilteredTerms] = useState<DictionaryTerm[]>([]);
  
  const itemsPerPage = 25;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  
  // Get unique categories from the dictionary terms
  const categoryMap: Record<string, boolean> = { "all": true };
  dictionaryTerms.forEach(term => {
    const category = term.category || "Uncategorized";
    categoryMap[category] = true;
  });
  const categories = Object.keys(categoryMap).sort();
  
  // Filter terms based on search, category, and letter filters
  useEffect(() => {
    let results = [...dictionaryTerms];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        item => 
          item.term.toLowerCase().includes(term) ||
          item.definition.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      results = results.filter(item => item.category === categoryFilter);
    }
    
    // Apply letter filter
    if (letterFilter !== "all") {
      results = results.filter(item => item.term.charAt(0).toUpperCase() === letterFilter);
    }
    
    // Sort alphabetically
    results = results.sort((a, b) => a.term.localeCompare(b.term));
    
    setFilteredTerms(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, categoryFilter, letterFilter]);
  
  // Calculate pagination values
  const totalPages = Math.ceil(filteredTerms.length / itemsPerPage);
  const currentTerms = filteredTerms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Build pagination display
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-2">
          <BookOpen className="mr-2 h-6 w-6 text-[#09261E]" />
          <h1 className="text-3xl font-bold text-[#09261E]">
            Real Estate Terminology Dictionary
          </h1>
        </div>
        <p className="text-gray-600 mb-8">
          Browse our comprehensive collection of real estate terms and definitions to help you navigate the property market with confidence.
        </p>

        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search terms and definitions..."
              className="pl-10 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category Filter */}
            <div className="sm:w-1/2">
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Category
              </label>
              <select
                id="category-filter"
                className="w-full px-3 py-2 border rounded-md"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.filter(c => c !== "all").map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Letter Filter Dropdown (Mobile) */}
            <div className="sm:hidden w-full">
              <label htmlFor="letter-filter-mobile" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Letter
              </label>
              <select
                id="letter-filter-mobile"
                className="w-full px-3 py-2 border rounded-md"
                value={letterFilter}
                onChange={(e) => setLetterFilter(e.target.value)}
              >
                <option value="all">All Letters</option>
                {alphabet.map((letter) => (
                  <option key={letter} value={letter}>
                    {letter}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Letter Filter Pills (Desktop) */}
          <div className="hidden sm:flex flex-wrap gap-1 mt-2">
            <Button
              variant={letterFilter === "all" ? "default" : "outline"}
              size="sm"
              className={letterFilter === "all" ? "bg-[#09261E]" : ""}
              onClick={() => setLetterFilter("all")}
            >
              All
            </Button>
            {alphabet.map((letter) => (
              <Button
                key={letter}
                variant={letterFilter === letter ? "default" : "outline"}
                size="sm"
                className={letterFilter === letter ? "bg-[#09261E]" : ""}
                onClick={() => setLetterFilter(letter)}
              >
                {letter}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Stats */}
        <div className="text-sm text-gray-500 mb-4">
          Showing {currentTerms.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
          {Math.min(currentPage * itemsPerPage, filteredTerms.length)} of {filteredTerms.length} terms
        </div>

        {/* Dictionary Terms */}
        {currentTerms.length > 0 ? (
          <div className="space-y-8 mb-8">
            {currentTerms.map((term, index) => (
              <div key={index} className="pb-6 border-b border-gray-200 last:border-0">
                <h2 className="text-xl font-bold text-[#09261E] mb-1">{term.term}</h2>
                {term.category && (
                  <div className="mb-2">
                    <span className="inline-block bg-[#EAF2EF] text-[#09261E] px-2 py-0.5 rounded text-xs font-medium">
                      {term.category}
                    </span>
                  </div>
                )}
                <p className="text-gray-700">{term.definition}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">No terms found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setLetterFilter("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {getPaginationItems()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}