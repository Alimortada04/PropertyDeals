import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Book, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

// Comprehensive real estate glossary data from the FTC glossary
const glossaryTerms = [
  {
    id: "1",
    term: "Annual Percentage Rate (APR)",
    definition: "The cost of a loan or other financing as an annual rate. The APR includes the interest rate, points, broker fees and certain other credit charges a borrower is required to pay.",
    category: "Financing"
  },
  {
    id: "2",
    term: "Annuity",
    definition: "An amount paid yearly or at other regular intervals, often at a guaranteed minimum amount. Also, a type of insurance policy in which the policy holder makes payments for a fixed period or until a stated age, and then receives annuity payments from the insurance company.",
    category: "Financing"
  },
  {
    id: "3",
    term: "Application Fee",
    definition: "The fee that a mortgage lender or broker charges to apply for a mortgage to cover processing costs.",
    category: "Financing"
  },
  {
    id: "4",
    term: "Appraisal",
    definition: "A professional analysis used to estimate the value of the property. This includes examples of sales of similar properties.",
    category: "Buying"
  },
  {
    id: "5",
    term: "Appraiser",
    definition: "A professional who conducts an analysis of the property, including examples of sales of similar properties in order to develop an estimate of the value of the property. The analysis is called an 'appraisal.'",
    category: "Buying"
  },
  {
    id: "6",
    term: "Appreciation",
    definition: "An increase in the market value of a home due to changing market conditions and/or home improvements.",
    category: "Market"
  },
  {
    id: "7",
    term: "Arbitration",
    definition: "A process where disputes are settled by referring them to a fair and neutral third party (arbitrator). The disputing parties agree in advance to agree with the decision of the arbitrator. There is a hearing where both parties have an opportunity to be heard, after which the arbitrator makes a decision.",
    category: "Legal"
  },
  {
    id: "8",
    term: "Asbestos",
    definition: "A toxic material that was once used in housing insulation and fireproofing. Because some forms of asbestos have been linked to certain lung diseases, it is no longer used in new homes. However, some older homes may still have asbestos in these materials.",
    category: "General"
  },
  {
    id: "9",
    term: "Assessed Value",
    definition: "Typically the value placed on property for the purpose of taxation.",
    category: "General"
  },
  {
    id: "10",
    term: "Assessor",
    definition: "A public official who establishes the value of a property for taxation purposes.",
    category: "General"
  },
  {
    id: "11",
    term: "Asset",
    definition: "Anything of monetary value that is owned by a person or company. Assets include real property, personal property, stocks, mutual funds, etc.",
    category: "Investing"
  },
  {
    id: "12",
    term: "Assignment of Mortgage",
    definition: "A document evidencing the transfer of ownership of a mortgage from one person to another.",
    category: "Financing"
  },
  {
    id: "13",
    term: "Assumable Mortgage",
    definition: "A mortgage loan that can be taken over (assumed) by the buyer when a home is sold. An assumption of a mortgage is a transaction in which the buyer of real property takes over the seller's existing mortgage; the seller remains liable unless released by the lender from the obligation. If the mortgage contains a due-on-sale clause, the loan may not be assumed without the lender's consent.",
    category: "Financing"
  },
  {
    id: "14",
    term: "Assumption",
    definition: "A homebuyer's agreement to take on the primary responsibility for paying an existing mortgage from a home seller.",
    category: "Financing"
  },
  {
    id: "15",
    term: "Assumption Fee",
    definition: "A fee a lender charges a buyer who will assume the seller's existing mortgage.",
    category: "Financing"
  },
  {
    id: "16",
    term: "Automated Underwriting",
    definition: "An automated process performed by a technology application that streamlines the processing of loan applications and provides a recommendation to the lender to approve the loan or refer it for manual underwriting.",
    category: "Financing"
  },
  {
    id: "17",
    term: "Balance Sheet",
    definition: "A financial statement that shows assets, liabilities, and net worth as of a specific date.",
    category: "Investing"
  },
  {
    id: "18",
    term: "Balloon Mortgage",
    definition: "A mortgage with monthly payments often based on a 30-year amortization schedule, with the unpaid balance due in a lump sum payment at the end of a specific period of time (usually 5 or 7 years). The mortgage may contain an option to 'reset' the interest rate to the current market rate and to extend the due date if certain conditions are met.",
    category: "Financing"
  },
  {
    id: "19",
    term: "Balloon Payment",
    definition: "A final lump sum payment that is due, often at the maturity date of a balloon mortgage.",
    category: "Financing"
  },
  {
    id: "20",
    term: "Bankruptcy",
    definition: "Legally declared unable to pay your debts. Bankruptcy can severely impact your credit and your ability to borrow money.",
    category: "Financing"
  },
  {
    id: "21",
    term: "Before-tax Income",
    definition: "Income before taxes are deducted. Also known as 'gross income'.",
    category: "Financing"
  },
  {
    id: "22",
    term: "Biweekly Payment Mortgage",
    definition: "A mortgage with payments due every two weeks (instead of monthly).",
    category: "Financing"
  },
  {
    id: "23",
    term: "Bona fide",
    definition: "In good faith, without fraud.",
    category: "Legal"
  },
  {
    id: "24",
    term: "Bridge Loan",
    definition: "A short-term loan secured by the borrower's current home (which is usually for sale) that allows the proceeds to be used for building or closing on a new house before the current home is sold. Also known as a 'swing loan'.",
    category: "Financing"
  },
  {
    id: "25",
    term: "Broker",
    definition: "An individual or firm that acts as an agent between providers and users of products or services, such as a mortgage broker or real estate broker.",
    category: "General"
  },
  {
    id: "26",
    term: "Building Code",
    definition: "Local regulations that set forth the standards and requirements for the construction, maintenance and occupancy of buildings. The codes are designed to provide for the safety, health and welfare of the public.",
    category: "General"
  },
  {
    id: "27",
    term: "Buydown",
    definition: "An arrangement whereby the property developer or another third party provides an interest subsidy to reduce the borrower's monthly payments typically in the early years of the loan.",
    category: "Financing"
  },
  {
    id: "28",
    term: "Buydown Account",
    definition: "An account in which funds are held so that they can be applied as part of the monthly mortgage payment as each payment comes due during the period that an interest rate buydown plan is in effect.",
    category: "Financing"
  },
  {
    id: "29",
    term: "Cap",
    definition: "For an adjustable-rate mortgage (ARM), a limitation on the amount the interest rate or mortgage payments may increase or decrease.",
    category: "Financing"
  },
  {
    id: "30",
    term: "Capacity",
    definition: "Your ability to make your mortgage payments on time. This depends on your income and income stability (job history and security), your assets and savings, and the amount of your income each month that is left over after you've paid for your housing costs, debts and other obligations.",
    category: "Financing"
  },
  {
    id: "31",
    term: "Cash-out Refinance",
    definition: "A refinance transaction in which the borrower receives additional funds over and above the amount needed to repay the existing mortgage, closing costs, points, and any subordinate liens.",
    category: "Financing"
  },
  {
    id: "32",
    term: "Certificate of Deposit",
    definition: "A document issued by a bank or other financial institution that is evidence of a deposit, with the issuer's promise to return the deposit plus earnings at a specified interest rate within a specified time period.",
    category: "Financing"
  },
  {
    id: "33",
    term: "Certificate of Eligibility",
    definition: "A document issued by the U.S. Department of Veterans Affairs (VA) certifying a veteran's eligibility for a VA-guaranteed mortgage loan.",
    category: "Financing"
  },
  {
    id: "34",
    term: "Chain of Title",
    definition: "The history of all of the documents that have transferred title to a parcel of real property, starting with the earliest existing document and ending with the most recent.",
    category: "Legal"
  },
  {
    id: "35",
    term: "Change Orders",
    definition: "A change in the original construction plans ordered by the property owner or general contractor.",
    category: "General"
  },
  {
    id: "36",
    term: "Clear Title",
    definition: "Ownership that is free of liens, defects, or other legal encumbrances.",
    category: "Legal"
  },
  {
    id: "37",
    term: "Closing",
    definition: "The process of completing a financial transaction. For mortgage loans, the process of signing mortgage documents, disbursing funds, and, if applicable, transferring ownership of the property.",
    category: "Buying"
  },
  {
    id: "38",
    term: "Closing Agent",
    definition: "The person or entity that coordinates the various closing activities, including the preparation and recordation of closing documents and the disbursement of funds.",
    category: "Buying"
  },
  {
    id: "39",
    term: "Closing Costs",
    definition: "The upfront fees charged in connection with a mortgage loan transaction. Money paid by a buyer (and/or seller or other third party, if applicable) to effect the closing of a mortgage loan.",
    category: "Buying"
  },
  {
    id: "40",
    term: "Closing Date",
    definition: "The date on which the sale of a property is to be finalized and a loan transaction completed.",
    category: "Buying"
  },
  {
    id: "41",
    term: "Co-borrower",
    definition: "Any borrower other than the first borrower whose name appears on the application and mortgage note, even when that person owns the property jointly with the first borrower and shares liability for the note.",
    category: "Financing"
  },
  {
    id: "42",
    term: "Collateral",
    definition: "An asset that is pledged as security for a loan. The borrower risks losing the asset if the loan is not repaid according to the terms of the loan agreement.",
    category: "Financing"
  },
  {
    id: "43",
    term: "Commission",
    definition: "The fee charged for services performed, usually based on a percentage of the price of the items sold (such as the fee a real estate agent earns on the sale of a house).",
    category: "General"
  },
  {
    id: "44",
    term: "Commitment Letter",
    definition: "A binding offer from your lender that includes the amount of the mortgage, the interest rate, and repayment terms.",
    category: "Financing"
  },
  {
    id: "45",
    term: "Common Areas",
    definition: "Those portions of a building, land, or improvements and amenities owned by a planned unit development (PUD) or condominium project's homeowners' association that are used by all of the unit owners.",
    category: "General"
  },
  {
    id: "46",
    term: "Comparables",
    definition: "An abbreviation for 'comparable properties,' which are used as a comparison in determining the current value of a property that is being appraised.",
    category: "Buying"
  },
  {
    id: "47",
    term: "Concession",
    definition: "Something given up or agreed to in negotiating the sale of a house. For example, the sellers may agree to help pay for closing costs.",
    category: "Buying"
  },
  {
    id: "48",
    term: "Condominium",
    definition: "A unit in a multiunit building. The owner of a condominium unit owns the unit itself and has the right, along with other owners, to use the common areas but does not own the common elements such as the exterior walls, floors and ceilings.",
    category: "General"
  },
  {
    id: "49",
    term: "Construction Loan",
    definition: "A loan for financing the cost of construction or improvements to a property; the lender disburses payments to the builder at periodic intervals during construction.",
    category: "Financing"
  },
  {
    id: "50",
    term: "Contingency",
    definition: "A condition that must be met before a contract is legally binding. For example, home purchasers often include a home inspection contingency; the sales contract is not binding unless and until the purchaser has the home inspected.",
    category: "Legal"
  },
  {
    id: "51",
    term: "Conventional Mortgage",
    definition: "A mortgage loan that is not insured or guaranteed by the federal government or one of its agencies, such as the Federal Housing Administration (FHA), the U.S. Department of Veterans Affairs (VA), or the Rural Housing Service (RHS).",
    category: "Financing"
  },
  {
    id: "52",
    term: "Credit Score",
    definition: "A numerical rating that indicates a person's creditworthiness based on their credit history. Higher scores represent better credit history and typically result in more favorable loan terms.",
    category: "Financing"
  },
  {
    id: "53",
    term: "Debt-to-Income Ratio",
    definition: "The percentage of a consumer's monthly gross income that goes toward paying debts. Lenders use this figure to determine lending risk.",
    category: "Financing"
  },
  {
    id: "54",
    term: "Deed",
    definition: "The legal document that transfers ownership of a property from the seller to the buyer.",
    category: "Legal"
  },
  {
    id: "55",
    term: "Down Payment",
    definition: "The amount of money a buyer pays upfront when purchasing a home. It's typically expressed as a percentage of the total home purchase price.",
    category: "Buying"
  },
  {
    id: "56",
    term: "Earnest Money Deposit",
    definition: "A deposit made to a seller indicating the buyer's good faith in an intent to purchase. This money is typically held in escrow until closing.",
    category: "Buying"
  },
  {
    id: "57",
    term: "Escrow",
    definition: "A financial arrangement where a third party holds and regulates payment of funds required for two parties involved in a given transaction.",
    category: "Buying"
  },
  {
    id: "58",
    term: "Fixed-Rate Mortgage",
    definition: "A home loan with an interest rate that remains the same for the entire term of the loan.",
    category: "Financing"
  },
  {
    id: "59",
    term: "Foreclosure",
    definition: "The legal process by which a lender takes possession of a property after the borrower fails to make payments on the mortgage.",
    category: "Legal"
  },
  {
    id: "60",
    term: "Home Inspection",
    definition: "A thorough examination of a home's condition, typically performed before purchase, that assesses structural integrity and major systems.",
    category: "Buying"
  },
  {
    id: "61",
    term: "Underwriting",
    definition: "The process used to determine loan approval. It involves evaluating the property and the borrower's credit and ability to pay the mortgage.",
    category: "Financing"
  },
  {
    id: "62",
    term: "Uniform Residential Loan Application",
    definition: "A standard mortgage application you will have to complete. The form requests your income, assets, liabilities, and a description of the property you plan to buy, among other things.",
    category: "Financing"
  },
  {
    id: "63",
    term: "Unsecured Loan",
    definition: "A loan that is not backed by collateral.",
    category: "Financing"
  },
  {
    id: "64",
    term: "Veterans Affairs (U.S. Department of Veterans Affairs)",
    definition: "A federal government agency that provides benefits to veterans and their dependents, including health care, educational assistance, financial assistance, and guaranteed home loans.",
    category: "Financing"
  },
  {
    id: "65",
    term: "VA Guaranteed Loan",
    definition: "A mortgage loan that is guaranteed by the U.S. Department of Veterans Affairs (VA).",
    category: "Financing"
  },
  {
    id: "66",
    term: "Walk-Through",
    definition: "A common clause in a sales contract that allows the buyer to examine the property being purchased at a specified time immediately before the closing, for example, within the 24 hours before closing.",
    category: "Buying"
  },
  {
    id: "67",
    term: "Warranties",
    definition: "Written guarantees of the quality of a product and the promise to repair or replace defective parts free of charge.",
    category: "General"
  }
];

// Filter categories
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
  const [currentPage, setCurrentPage] = useState(1);
  const termsPerPage = 15; // Number of terms to display per page

  // Filter terms based on search, category, and letter
  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === "All" || term.category === activeCategory;
    
    const matchesLetter = !activeLetter || term.term.charAt(0).toUpperCase() === activeLetter;
    
    return matchesSearch && matchesCategory && matchesLetter;
  });

  // Get paginated terms
  const indexOfLastTerm = currentPage * termsPerPage;
  const indexOfFirstTerm = indexOfLastTerm - termsPerPage;
  const currentTerms = filteredTerms.slice(indexOfFirstTerm, indexOfLastTerm);

  // Total pages calculation
  const totalPages = Math.ceil(filteredTerms.length / termsPerPage);

  // Group terms by first letter for alphabetical organization
  const groupedTerms = currentTerms.reduce<{ [key: string]: typeof glossaryTerms }>((groups, term) => {
    const firstLetter = term.term.charAt(0).toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(term);
    return groups;
  }, {});

  // Get unique letters that exist in the filtered terms
  const availableLetters = Array.from(new Set(filteredTerms.map(term => term.term.charAt(0).toUpperCase()))).sort();

  // Handle pagination
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory, activeLetter]);

  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={currentPage === i} 
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink 
            isActive={currentPage === 1} 
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // If current page is more than 3, show ellipsis after first page
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Calculate range of pages to show around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at edges
      if (currentPage === 1 || currentPage === 2) {
        endPage = Math.min(4, totalPages - 1);
      } else if (currentPage === totalPages || currentPage === totalPages - 1) {
        startPage = Math.max(totalPages - 3, 2);
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={currentPage === i} 
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      // If current page is less than totalPages - 2, show ellipsis before last page
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            isActive={currentPage === totalPages} 
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

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
            <span key={crumb.path} className="inline-block">
              {index > 0 && <span className="mx-2">/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-gray-800">{crumb.label}</span>
              ) : (
                <Link to={crumb.path} className="hover:text-[#09261E]">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </div>
        
        {/* Page header */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Book className="h-6 w-6 text-[#09261E]" />
            <h1 className="text-3xl font-bold text-[#09261E]">Property Dictionary</h1>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            A comprehensive glossary of real estate terms to help you navigate the property market with confidence. Browse by category or search for specific terms.
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
                        : "text-gray-400 cursor-not-allowed"
                  )}
                  disabled={!isAvailable}
                  onClick={() => setActiveLetter(letter)}
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
          {filteredTerms.length > termsPerPage && ` (showing page ${currentPage} of ${totalPages})`}
        </div>

        {/* Dictionary content */}
        <div className="space-y-8">
          {Object.keys(groupedTerms).sort().map((letter) => (
            <div key={letter} id={`letter-${letter}`} className="scroll-mt-20">
              <h2 className="text-3xl font-bold text-[#09261E] mb-4 text-center">{letter}</h2>
              <div className="grid gap-6">
                {groupedTerms[letter].map((term) => (
                  <div key={term.id} className="border-b pb-6 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <h3 className="text-xl font-semibold text-[#09261E]">{term.term}</h3>
                      <div className="inline-flex items-center mt-1">
                        <span className="text-sm bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                          {term.category}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700 leading-relaxed mx-auto max-w-3xl">{term.definition}</p>
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

          {/* Pagination */}
          {filteredTerms.length > termsPerPage && (
            <div className="mt-10 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {getPaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}