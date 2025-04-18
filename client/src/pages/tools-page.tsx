import React, { useState, useEffect } from "react";
import { 
  Calculator, 
  Wrench, 
  CalendarRange, 
  CircleDollarSign, 
  Building, 
  Wallet, 
  BarChart3, 
  DollarSign, 
  Percent, 
  FileSpreadsheet,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Breadcrumbs from "@/components/common/breadcrumbs";
import ToolCard, { Tool } from "@/components/tools/tool-card";
import CategoryFilter from "@/components/tools/category-filter";

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);

  // All tools with their metadata
  const tools: Tool[] = [
    {
      id: "flip",
      title: "Flip Calculator",
      description: "Estimate profit potential for fix-and-flips with detailed cost breakdown.",
      icon: <Calculator size={18} strokeWidth={1.5} />,
      path: "/tools/flip",
      tags: ["Flips"],
      isPopular: true,
      coverImage: "https://images.unsplash.com/photo-1524813686514-a57563d77965?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zml4JTIwYW5kJTIwZmxpcHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      inputs: ["Purchase Price", "Repair Costs", "ARV"],
      outputs: ["Profit", "ROI", "Total Costs"],
      functionType: "calculator"
    },
    {
      id: "investment",
      title: "Investment Calculator",
      description: "Analyze ROI, cash flow, and cap rate for rental properties.",
      icon: <BarChart3 size={18} strokeWidth={1.5} />,
      path: "/tools/investment",
      tags: ["Buy & Hold"],
      coverImage: "https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVhbCUyMGVzdGF0ZSUyMGludmVzdG1lbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      inputs: ["Purchase Price", "Monthly Rent", "Expenses"],
      outputs: ["Cash Flow", "Cap Rate", "ROI"],
      functionType: "calculator"
    },
    {
      id: "subto",
      title: "Sub-to Calculator",
      description: "Run payment schedules for subject-to deals with detailed amortization.",
      icon: <FileSpreadsheet size={18} strokeWidth={1.5} />,
      path: "/tools/subto",
      tags: ["Creative Finance"],
      coverImage: "https://images.unsplash.com/photo-1552960562-daf630e9278b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBheW1lbnQlMjBzY2hlZHVsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      inputs: ["Loan Balance", "Interest Rate", "Term"],
      outputs: ["Payment Schedule", "Total Interest"],
      functionType: "calculator"
    },
    {
      id: "seller-finance",
      title: "Seller Finance Calculator",
      description: "Amortization schedule + balloon payment breakdown for seller financing.",
      icon: <DollarSign size={18} strokeWidth={1.5} />,
      path: "/tools/seller-finance",
      tags: ["Creative Finance"],
      coverImage: "https://images.unsplash.com/photo-1633158829875-e5316a358c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW9ydGdhZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      inputs: ["Sale Price", "Down Payment", "Interest Rate"],
      outputs: ["Monthly Payment", "Balloon Amount"],
      functionType: "calculator"
    },
    {
      id: "repair-cost",
      title: "Repair Cost Estimator",
      description: "Estimate repair costs by item with regional benchmarks and totals.",
      icon: <Wrench size={18} strokeWidth={1.5} />,
      path: "/tools/repair-cost",
      tags: ["Flips", "Wholesale"],
      isNew: true,
      coverImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9tZSUyMHJlcGFpcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      inputs: ["Square Footage", "Repair Items", "Quality Grade"],
      outputs: ["Total Cost", "Itemized Breakdown"],
      functionType: "estimator"
    },
    {
      id: "offer-price",
      title: "Offer Price Calculator",
      description: "MAO calculator based on ARV, repairs, profit, and wholesale fee.",
      icon: <CircleDollarSign size={18} strokeWidth={1.5} />,
      path: "/tools/offer-price",
      tags: ["Wholesale", "Flips"],
      coverImage: "https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJpY2UlMjBjYWxjdWxhdG9yfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      inputs: ["ARV", "Repair Costs", "Min Profit"],
      outputs: ["Maximum Offer Price"],
      functionType: "calculator"
    },
    {
      id: "split",
      title: "Dispo / Assignment Split Calc",
      description: "JV profit breakdown by percentage or flat fee with customizable splits.",
      icon: <Percent size={18} strokeWidth={1.5} />,
      path: "/tools/split",
      tags: ["Wholesale", "REPs"],
      coverImage: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZml0JTIwc3BsaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      inputs: ["Deal Amount", "Partners", "Split Type"],
      outputs: ["Partner Distributions"],
      functionType: "split"
    },
    {
      id: "str-analyzer",
      title: "Short-Term Rental Analyzer",
      description: "Airbnb/STR analyzer for nightly rate, occupancy, cash flow, and seasonality.",
      icon: <Building size={18} strokeWidth={1.5} />,
      path: "/tools/str-analyzer",
      tags: ["STR", "Buy & Hold"],
      isPopular: true,
      coverImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWlyYm5ifGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      inputs: ["Nightly Rate", "Occupancy", "Expenses"],
      outputs: ["Monthly Revenue", "Annual Profit"],
      functionType: "analyzer"
    },
    // Coming Soon Tools
    {
      id: "brrrr",
      title: "BRRRR Deal Analyzer",
      description: "Analyze Buy, Rehab, Rent, Refinance, Repeat strategy with cash-out options.",
      icon: <BarChart3 size={18} strokeWidth={1.5} />,
      path: "/tools/brrrr",
      tags: ["Buy & Hold", "Flips"],
      isComingSoon: true,
      coverImage: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVhbCUyMGVzdGF0ZSUyMGludmVzdG1lbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      inputs: ["Purchase Price", "Rehab Budget", "ARV"],
      outputs: ["Cash Out Amount", "Cash-on-Cash ROI"],
      functionType: "analyzer"
    },
    {
      id: "land-flip",
      title: "Land Flip Calculator",
      description: "Calculate acquisition, improvement, and sale values for land investments.",
      icon: <CircleDollarSign size={18} strokeWidth={1.5} />,
      path: "/tools/land-flip",
      tags: ["Flips"],
      isComingSoon: true,
      coverImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFuZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      inputs: ["Purchase Price", "Improvements", "Sell Price"],
      outputs: ["Net Profit", "ROI"],
      functionType: "calculator"
    },
    {
      id: "loan-costs",
      title: "Loan Cost Breakdown Tool",
      description: "Analyze and compare different loan options with true cost analysis.",
      icon: <Wallet size={18} strokeWidth={1.5} />,
      path: "/tools/loan-costs",
      tags: ["Creative Finance", "Buy & Hold"],
      isComingSoon: true,
      coverImage: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bG9hbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      inputs: ["Loan Amount", "Interest Rate", "Points/Fees"],
      outputs: ["True APR", "Lifetime Cost"],
      functionType: "analyzer"
    }
  ];

  // Filter tools based on active category and search term
  useEffect(() => {
    let results = [...tools];
    
    // Filter by category
    if (activeCategory !== "all") {
      const categoryMapping: { [key: string]: string } = {
        'flips': 'Flips',
        'buyhold': 'Buy & Hold',
        'creative': 'Creative Finance',
        'wholesale': 'Wholesale',
        'str': 'STR'
      };
      
      const categoryTag = categoryMapping[activeCategory];
      if (categoryTag) {
        results = results.filter(tool => 
          tool.tags.includes(categoryTag)
        );
      }
    }
    
    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      results = results.filter(tool => 
        tool.title.toLowerCase().includes(term) || 
        tool.description.toLowerCase().includes(term) ||
        tool.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredTools(results);
  }, [activeCategory, searchTerm]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Initialize when component loads
  useEffect(() => {
    setFilteredTools(tools);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 pt-20">
      {/* Breadcrumbs */}
      <div className="mb-4">
        <Breadcrumbs />
      </div>
      
      {/* Page Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#09261E] mb-4">
          Real Estate Investment Tools
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Free calculators and analysis tools to help you make data-driven real estate investment decisions.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search tools..."
            className="pl-10 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Category Filter */}
      <CategoryFilter 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange} 
      />
      
      {/* Tool Cards Grid with Animations */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
          {filteredTools.map((tool, index) => (
            <div 
              key={tool.id} 
              className={`animate-fadeInUp w-full max-w-sm`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No tools found matching your criteria. Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}