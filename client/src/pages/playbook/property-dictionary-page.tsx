import React, { useState } from "react";
import { Link } from "wouter";
import { Search, Book, ArrowLeft, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";

// Alphabet for letter navigation
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Sample real estate dictionary terms
const glossaryTerms = [
  {
    letter: "A",
    terms: [
      {
        term: "Adjustable-Rate Mortgage (ARM)",
        definition: "A mortgage with an interest rate that changes periodically based on an index. ARMs typically offer a lower initial interest rate than fixed-rate loans."
      },
      {
        term: "Amortization",
        definition: "The gradual reduction of a debt through regular payments of principal and interest over a set period."
      },
      {
        term: "Appraisal",
        definition: "A professional assessment of a property's market value, typically required by lenders before approving a mortgage loan."
      },
      {
        term: "As-Is Condition",
        definition: "The purchase or sale of a property in its current state, with no repairs or improvements to be made by the seller."
      }
    ]
  },
  {
    letter: "B",
    terms: [
      {
        term: "Balloon Mortgage",
        definition: "A mortgage with monthly payments based on a 30-year amortization but requires full payoff after a shorter term, typically 5-7 years."
      },
      {
        term: "Bridge Loan",
        definition: "Short-term financing that allows a buyer to purchase a new property before selling their existing home."
      },
      {
        term: "BRRRR",
        definition: "An investment strategy (Buy, Rehab, Rent, Refinance, Repeat) for building a real estate portfolio."
      }
    ]
  },
  {
    letter: "C",
    terms: [
      {
        term: "Cap Rate",
        definition: "Capitalization Rate - The ratio between the net operating income of a property and its current market value or acquisition cost."
      },
      {
        term: "Cash-on-Cash Return",
        definition: "The ratio of annual cash flow to the total cash invested, expressed as a percentage."
      },
      {
        term: "Closing Costs",
        definition: "Fees and expenses beyond the property's price paid by both buyer and seller to complete a real estate transaction."
      },
      {
        term: "Comparative Market Analysis (CMA)",
        definition: "An evaluation of similar, recently sold properties to help determine a home's fair market value."
      }
    ]
  },
  {
    letter: "D",
    terms: [
      {
        term: "Due Diligence",
        definition: "The investigation or exercise of care that a reasonable business or person is expected to take before entering into an agreement or contract."
      },
      {
        term: "Debt-to-Income Ratio",
        definition: "The percentage of a consumer's monthly gross income that goes toward paying debts."
      },
      {
        term: "Deed",
        definition: "A legal document that transfers property ownership from one party to another."
      }
    ]
  },
  {
    letter: "E",
    terms: [
      {
        term: "Earnest Money",
        definition: "A deposit made by a buyer to show their good faith and intention to complete the purchase of a property."
      },
      {
        term: "Equity",
        definition: "The difference between a property's market value and the outstanding balance of all liens on the property."
      },
      {
        term: "Escrow",
        definition: "A legal arrangement where a third party temporarily holds money or property until specific conditions are met."
      }
    ]
  },
  {
    letter: "F",
    terms: [
      {
        term: "FHA Loan",
        definition: "A mortgage insured by the Federal Housing Administration that typically requires a lower down payment than conventional loans."
      },
      {
        term: "Foreclosure",
        definition: "The legal process where a lender attempts to recover the balance of a loan from a borrower who has stopped making payments by forcing the sale of the asset used as collateral."
      },
      {
        term: "Fair Market Value",
        definition: "The price a property would sell for on the open market under normal conditions."
      }
    ]
  },
  {
    letter: "H",
    terms: [
      {
        term: "Hard Money Loan",
        definition: "A short-term, high-interest loan primarily based on property value rather than borrower creditworthiness."
      },
      {
        term: "HOA (Homeowners Association)",
        definition: "An organization that creates and enforces rules for properties and common areas within a subdivision, planned community, or condominium."
      }
    ]
  },
  {
    letter: "L",
    terms: [
      {
        term: "Lien",
        definition: "A legal claim against a property that must be paid when the property is sold."
      },
      {
        term: "Loan-to-Value Ratio (LTV)",
        definition: "The ratio of a loan amount to the value of the property securing the loan, expressed as a percentage."
      }
    ]
  },
  {
    letter: "M",
    terms: [
      {
        term: "MLS (Multiple Listing Service)",
        definition: "A database established by cooperating real estate brokers to provide data about properties for sale."
      },
      {
        term: "Mortgage",
        definition: "A loan used to purchase or maintain a home, land, or other types of real estate with property serving as collateral."
      }
    ]
  },
  {
    letter: "P",
    terms: [
      {
        term: "PITI",
        definition: "Principal, Interest, Taxes, and Insurance - the four components of a mortgage payment."
      },
      {
        term: "Private Mortgage Insurance (PMI)",
        definition: "Insurance that protects the lender if the borrower defaults. Usually required for loans with less than 20% down payment."
      }
    ]
  },
  {
    letter: "R",
    terms: [
      {
        term: "REO (Real Estate Owned)",
        definition: "Property owned by a lender, typically a bank, after an unsuccessful foreclosure sale."
      },
      {
        term: "Refinance",
        definition: "The process of replacing an existing mortgage with a new loan, typically to secure better terms or access equity."
      }
    ]
  },
  {
    letter: "S",
    terms: [
      {
        term: "Short Sale",
        definition: "The sale of a property for less than the amount the owner owes on the mortgage, requiring lender approval."
      },
      {
        term: "Seller Financing",
        definition: "An arrangement where the seller acts as the lender, providing a loan to the buyer to purchase their property."
      }
    ]
  },
  {
    letter: "U",
    terms: [
      {
        term: "Under Contract",
        definition: "A property that has an accepted offer but hasn't closed yet."
      },
      {
        term: "Underwriting",
        definition: "The process a lender uses to determine if the risk of lending to a particular borrower is acceptable."
      }
    ]
  },
  {
    letter: "Z",
    terms: [
      {
        term: "Zoning",
        definition: "Local laws that determine how property in specific geographic zones can be used."
      }
    ]
  }
];

export default function PropertyDictionaryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("dictionary");
  const [activeLetter, setActiveLetter] = useState("A");
  
  // Filter terms based on search query
  const filteredTerms = glossaryTerms.flatMap(letterGroup => 
    letterGroup.terms.filter(term => 
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
      term.definition.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(term => ({ ...term, letter: letterGroup.letter }))
  );
  
  // Group filtered terms by letter for rendering
  const groupedFilteredTerms = filteredTerms.reduce((acc, term) => {
    const letter = term.letter;
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(term);
    return acc;
  }, {} as Record<string, typeof filteredTerms>);

  // Get visible letters based on filter
  const visibleLetters = Object.keys(groupedFilteredTerms).sort();
  
  // Determine which letter section to show if active letter is filtered out
  const effectiveActiveLetter = visibleLetters.includes(activeLetter) 
    ? activeLetter 
    : (visibleLetters.length > 0 ? visibleLetters[0] : "A");

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white pb-24">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb navigation */}
        <div className="text-sm text-gray-500 mb-6 flex items-center">
          <Link href="/" className="hover:text-[#09261E]">
            Home
          </Link>
          {' > '}
          <Link href="/playbook" className="hover:text-[#09261E]">
            Playbook
          </Link>
          {' > '}
          <span className="text-[#09261E] font-medium">Property Dictionary</span>
        </div>
        
        <div className="flex flex-col space-y-6">
          {/* Back button */}
          <div>
            <Link href="/playbook">
              <Button variant="ghost" className="pl-0 text-gray-500 hover:text-[#09261E] hover:bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Playbook
              </Button>
            </Link>
          </div>
          
          {/* Header */}
          <div className="text-center mb-2">
            <h1 className="text-4xl font-bold text-[#09261E]">PropertyDictionary</h1>
            <p className="text-gray-600 mt-2 max-w-3xl mx-auto">
              A comprehensive glossary of real estate terms and definitions for investors and professionals.
            </p>
          </div>
          
          {/* Search Box - Centered */}
          <div className="relative w-full max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search terms..." 
              className="pl-10 h-12 rounded-md border-gray-300" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="dictionary" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
              <TabsTrigger 
                value="dictionary" 
                className={`data-[state=active]:bg-[#09261E] data-[state=active]:text-white data-[state=active]:hover:bg-[#09261E] font-medium`}
              >
                <Book className="h-4 w-4 mr-2" />
                Dictionary
              </TabsTrigger>
              <TabsTrigger 
                value="acronyms" 
                className={`data-[state=active]:bg-[#09261E] data-[state=active]:text-white data-[state=active]:hover:bg-[#09261E] font-medium`}
              >
                <Globe className="h-4 w-4 mr-2" />
                Acronyms
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dictionary" className="mt-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Alphabet Navigation */}
                <div className="md:w-24 flex md:flex-col flex-wrap justify-center gap-2 md:gap-0">
                  {alphabet.map(letter => {
                    const hasTerms = glossaryTerms.some(group => group.letter === letter && group.terms.length > 0);
                    const isFilteredVisible = visibleLetters.includes(letter);
                    const isActive = effectiveActiveLetter === letter;
                    
                    return (
                      <Button
                        key={letter}
                        variant="ghost"
                        className={`w-8 h-8 p-0 rounded-full font-medium text-sm ${
                          !hasTerms ? "text-gray-300 cursor-not-allowed" :
                          isActive ? "bg-[#09261E] text-white hover:bg-[#09261E]" :
                          !isFilteredVisible && searchQuery ? "text-gray-300 cursor-not-allowed" :
                          "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => hasTerms && isFilteredVisible && setActiveLetter(letter)}
                        disabled={!hasTerms || (!isFilteredVisible && searchQuery)}
                      >
                        {letter}
                      </Button>
                    );
                  })}
                </div>
                
                {/* Dictionary Content */}
                <div className="flex-1">
                  <ScrollArea className="h-[calc(100vh-320px)] pr-4">
                    {searchQuery ? (
                      // Show search results
                      filteredTerms.length > 0 ? (
                        <div className="space-y-8">
                          {Object.entries(groupedFilteredTerms)
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([letter, terms]) => (
                              <div key={letter} id={`letter-${letter}`} className="mb-6">
                                <h3 className="text-xl font-bold text-[#09261E] border-b border-gray-200 pb-2 mb-4">
                                  {letter}
                                </h3>
                                <div className="space-y-4">
                                  {terms.map((term, idx) => (
                                    <div key={idx} className="pb-4">
                                      <h4 className="text-lg font-semibold text-gray-800">{term.term}</h4>
                                      <p className="text-gray-600 mt-1">{term.definition}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-gray-500">No terms found matching "{searchQuery}"</p>
                        </div>
                      )
                    ) : (
                      // Show regular alphabetical listing
                      <div>
                        {glossaryTerms
                          .filter(group => group.letter === effectiveActiveLetter)
                          .map(group => (
                            <div key={group.letter} id={`letter-${group.letter}`}>
                              <h3 className="text-xl font-bold text-[#09261E] border-b border-gray-200 pb-2 mb-4">
                                {group.letter}
                              </h3>
                              <div className="space-y-4">
                                {group.terms.map((term, idx) => (
                                  <div key={idx} className="pb-4">
                                    <h4 className="text-lg font-semibold text-gray-800">{term.term}</h4>
                                    <p className="text-gray-600 mt-1">{term.definition}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="acronyms" className="mt-8">
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Acronyms section coming soon</p>
                <p className="text-gray-600">
                  We're currently compiling a comprehensive list of real estate acronyms.
                  Please check back soon!
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}