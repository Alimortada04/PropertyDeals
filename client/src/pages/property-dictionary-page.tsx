import React, { useState } from "react";
import { Link } from "wouter";
import { Book, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Real estate glossary data
const glossaryTerms = [
  {
    id: "1",
    term: "Adjustable-Rate Mortgage (ARM)",
    definition: "A mortgage with an interest rate that can change periodically based on a specific benchmark. Usually starts with a lower rate than fixed-rate mortgages.",
    category: "Financing"
  },
  {
    id: "2",
    term: "Amortization",
    definition: "The gradual reduction of a loan balance through regular payments of principal and interest over a set period.",
    category: "Financing"
  },
  {
    id: "3",
    term: "Annual Percentage Rate (APR)",
    definition: "The cost of a loan or other financing as an annual rate. The APR includes the interest rate, points, and other fees charged by the lender.",
    category: "Financing"
  },
  {
    id: "4",
    term: "Appraisal",
    definition: "A professional estimation of a property's market value, typically performed by a certified appraiser.",
    category: "Buying"
  },
  {
    id: "5",
    term: "After Repair Value (ARV)",
    definition: "The estimated value of a property after all repairs and renovations are completed. Used extensively in fix-and-flip investments.",
    category: "Investing"
  },
  {
    id: "6",
    term: "Buyer's Market",
    definition: "A market condition where supply exceeds demand, giving buyers an advantage in price negotiations.",
    category: "Market"
  },
  {
    id: "7",
    term: "Capital Expenditures (CapEx)",
    definition: "Funds used to purchase, improve, or extend the life of long-term assets such as roofs, HVAC systems, and major appliances.",
    category: "Investing"
  },
  {
    id: "8",
    term: "Cash-on-Cash Return",
    definition: "A rate of return that calculates the cash income earned on the cash invested in a property, typically expressed as a percentage.",
    category: "Investing"
  },
  {
    id: "9",
    term: "Closing Costs",
    definition: "Fees associated with completing a real estate transaction, such as loan fees, title insurance, appraisal fees, and taxes.",
    category: "Buying"
  },
  {
    id: "10",
    term: "Comparables (Comps)",
    definition: "Similar properties used to determine the fair market value of a subject property through comparative market analysis.",
    category: "Buying"
  },
  {
    id: "11",
    term: "Debt-to-Income Ratio (DTI)",
    definition: "The percentage of gross monthly income that goes toward paying debts. Lenders use DTI to evaluate borrower risk.",
    category: "Financing"
  },
  {
    id: "12",
    term: "Due Diligence",
    definition: "The investigation or exercise of care that a reasonable person would take before entering into an agreement or transaction.",
    category: "General"
  },
  {
    id: "13",
    term: "Earnest Money",
    definition: "A deposit made by a buyer to show good faith when entering into a purchase contract. Usually held in escrow until closing.",
    category: "Buying"
  },
  {
    id: "14",
    term: "Equity",
    definition: "The difference between a property's market value and the outstanding loan balance.",
    category: "Investing"
  },
  {
    id: "15",
    term: "Escrow",
    definition: "A financial arrangement where a third party holds and manages funds or assets for transacting parties.",
    category: "Buying"
  },
  {
    id: "16",
    term: "Foreclosure",
    definition: "The legal process by which a lender takes possession of a property after the borrower fails to make loan payments.",
    category: "Legal"
  },
  {
    id: "17",
    term: "Gross Rent Multiplier (GRM)",
    definition: "A metric used to evaluate investment properties by dividing the property price by its annual gross rental income.",
    category: "Investing"
  },
  {
    id: "18",
    term: "Hard Money Loan",
    definition: "A short-term, high-interest loan secured by real estate, typically used for fix-and-flip investments or when conventional financing isn't available.",
    category: "Financing"
  },
  {
    id: "19",
    term: "HOA (Homeowners Association)",
    definition: "An organization of property owners that administers the rules and maintains the common areas of a planned community.",
    category: "General"
  },
  {
    id: "20",
    term: "Internal Rate of Return (IRR)",
    definition: "A metric used to estimate the profitability of potential investments, taking into account the time value of money.",
    category: "Investing"
  },
  {
    id: "21",
    term: "Lien",
    definition: "A legal claim against a property that must be paid when the property is sold. Common liens include mortgage and tax liens.",
    category: "Legal"
  },
  {
    id: "22",
    term: "Loan-to-Value Ratio (LTV)",
    definition: "The ratio of the loan amount to the appraised value of the property, expressed as a percentage.",
    category: "Financing"
  },
  {
    id: "23",
    term: "Net Operating Income (NOI)",
    definition: "The annual income generated by a property after operating expenses but before mortgage payments, income taxes, and capital expenditures.",
    category: "Investing"
  },
  {
    id: "24",
    term: "Off-Market Property",
    definition: "A property that is not publicly listed for sale but may be available through direct negotiation with the owner.",
    category: "Buying"
  },
  {
    id: "25",
    term: "Private Mortgage Insurance (PMI)",
    definition: "Insurance that protects the lender if a borrower defaults on a conventional loan with a down payment of less than 20%.",
    category: "Financing"
  }
];

// Define Filter Categories
const filterCategories = [
  "All",
  "Buying",
  "Financing",
  "Investing",
  "Legal",
  "Market",
  "General"
];

// Alphabetical letter list for quick navigation
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function PropertyDictionaryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  // Filter terms based on search, category, and letter
  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === "All" || term.category === activeCategory;
    
    const matchesLetter = !activeLetter || term.term.charAt(0).toUpperCase() === activeLetter;
    
    return matchesSearch && matchesCategory && matchesLetter;
  });

  // Group terms by first letter for alphabetical organization
  const groupedTerms = filteredTerms.reduce<{ [key: string]: typeof glossaryTerms }>((groups, term) => {
    const firstLetter = term.term.charAt(0).toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(term);
    return groups;
  }, {});

  // Get unique letters that exist in the filtered terms
  const availableLetters = Object.keys(groupedTerms).sort();

  // Breadcrumb for navigation
  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Playbook", path: "/playbook" },
    { label: "PropertyDictionary", path: "/playbook/property-dictionary" }
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white pb-24">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb navigation */}
        <div className="text-sm text-gray-500 mb-6">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && " > "}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-[#09261E] font-medium">{crumb.label}</span>
              ) : (
                <Link href={crumb.path} className="hover:text-[#09261E]">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Page header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#09261E]">PropertyDictionary</h1>
          <p className="text-gray-600 mt-2 max-w-3xl mx-auto">
            Comprehensive glossary of real estate terms and definitions for investors, buyers, sellers, and professionals.
          </p>
        </div>

        {/* Search and filters area */}
        <div className="space-y-6 mb-10">
          {/* Search */}
          <div className="relative w-full max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search terms and definitions..." 
              className="pl-10 h-12 rounded-md border-gray-300 w-full" 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setActiveLetter(null); // Clear letter filter when searching
              }}
            />
          </div>

          {/* Category filters */}
          <div className="flex justify-center flex-wrap gap-2">
            {filterCategories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                className={cn(
                  "rounded-md px-3 py-1 text-sm",
                  activeCategory === category 
                    ? "bg-[#09261E] text-white hover:bg-[#09261E] hover:text-white" 
                    : "bg-transparent text-gray-700 hover:bg-gray-200"
                )}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Alphabet navigation */}
          <div className="flex justify-center flex-wrap gap-1 border-t border-b py-4">
            {alphabet.map((letter) => {
              const isAvailable = availableLetters.includes(letter);
              return (
                <Button
                  key={letter}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-8 h-8 p-0 font-semibold text-sm",
                    activeLetter === letter 
                      ? "bg-[#09261E] text-white hover:bg-[#09261E] hover:text-white" 
                      : isAvailable 
                        ? "text-[#09261E] hover:bg-gray-200" 
                        : "text-gray-300 hover:bg-transparent cursor-not-allowed"
                  )}
                  disabled={!isAvailable}
                  onClick={() => setActiveLetter(letter === activeLetter ? null : letter)}
                >
                  {letter}
                </Button>
              );
            })}
            {activeLetter && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 text-xs text-gray-600"
                onClick={() => setActiveLetter(null)}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600 mb-6">
          Found {filteredTerms.length} terms 
          {activeCategory !== "All" && ` in ${activeCategory}`}
          {activeLetter && ` starting with "${activeLetter}"`}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>

        {/* Dictionary content */}
        <div className="space-y-8">
          {Object.keys(groupedTerms).sort().map((letter) => (
            <div key={letter} id={`letter-${letter}`} className="scroll-mt-20">
              <h2 className="text-3xl font-bold text-[#09261E] mb-4">{letter}</h2>
              <div className="grid gap-6">
                {groupedTerms[letter].map((term) => (
                  <div key={term.id} className="border-b pb-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-[#09261E]">{term.term}</h3>
                        <div className="inline-flex items-center mt-1">
                          <span className="text-sm bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                            {term.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700 leading-relaxed">{term.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredTerms.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No terms found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button 
                className="mt-6" 
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("All");
                  setActiveLetter(null);
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}