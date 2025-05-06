import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Book, Calculator, Search, Briefcase, Home, Users, Filter, FileText, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function PlaybookPage() {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState<"resources" | "tools">("tools");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("General");
  const [activeToolCategory, setActiveToolCategory] = useState("All Tools");
  
  // Check URL hash to set active tab
  useEffect(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#tools') {
      setActiveTab('tools');
    } else if (hash === '#resources') {
      setActiveTab('resources');
    }
  }, [location]);

  // Resource categories
  const resourceCategories = [
    { id: "general", label: "General", icon: <FileText className="h-4 w-4" /> },
    { id: "buyers", label: "Buyers", icon: <Users className="h-4 w-4" /> },
    { id: "sellers", label: "Sellers", icon: <Home className="h-4 w-4" /> },
    { id: "agents", label: "Agents", icon: <Briefcase className="h-4 w-4" /> },
    { id: "contractors", label: "Contractors", icon: <Briefcase className="h-4 w-4" /> },
  ];

  // Tool categories
  const toolCategories = [
    { id: "all", label: "All Tools", icon: <Layers className="h-4 w-4" /> },
    { id: "flips", label: "Flips", icon: <Home className="h-4 w-4" /> },
    { id: "buy_hold", label: "Buy & Hold", icon: <Briefcase className="h-4 w-4" /> },
    { id: "creative_finance", label: "Creative Finance", icon: <Calculator className="h-4 w-4" /> },
    { id: "wholesale", label: "Wholesale", icon: <Users className="h-4 w-4" /> },
    { id: "str", label: "STR", icon: <Home className="h-4 w-4" /> },
  ];
  
  // Sample resource data - PropertyPlaybook resources
  const resources = [
    {
      id: "1",
      title: "PropertyDictionary",
      description: "Comprehensive glossary of real estate terms and definitions for investors and professionals.",
      coverImage: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Glossary", "Reference"],
      category: "General",
      status: "Published",
      badge: "Trending"
    },
    {
      id: "2",
      title: "Due Diligence Checklist",
      description: "Complete step-by-step checklist for thorough property research and evaluation.",
      coverImage: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Checklist", "Due Diligence"],
      category: "Buyers",
      status: "Coming Soon",
      badge: "Coming Soon"
    },
    {
      id: "3",
      title: "Investment Strategies",
      description: "Overview of popular real estate investment strategies with pros and cons.",
      coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Investment", "Strategy"],
      category: "General",
      status: "Coming Soon",
      badge: "Coming Soon"
    },
    {
      id: "4",
      title: "Video Tutorials",
      description: "Watch step-by-step video tutorials on various aspects of real estate investing.",
      coverImage: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Video", "Tutorials"],
      category: "General",
      status: "Coming Soon",
      badge: "Coming Soon"
    },
  ];

  // Sample tools data
  const tools = [
    {
      id: "1",
      title: "Flip Calculator",
      description: "Estimate profit potential for fix-and-flips with detailed cost breakdown.",
      coverImage: "https://images.unsplash.com/photo-1582059566105-c55de4da6127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Flips"],
      categories: ["Flips"],
      type: "Calculator",
      status: "Coming Soon",
      badge: "Coming Soon"
    },
    {
      id: "2",
      title: "Repair Cost Estimator",
      description: "Estimate repair costs by item with regional benchmarks and totals.",
      coverImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Flips", "Wholesale"],
      categories: ["Flips", "Wholesale"],
      type: "Estimator",
      status: "Coming Soon",
      badge: "Coming Soon"
    },
    {
      id: "3",
      title: "Offer Price Calculator",
      description: "MAO calculator based on ARV, repairs, profit, and wholesale fee.",
      coverImage: "https://images.unsplash.com/photo-1582137825635-a2b2cc3a2faa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Wholesale", "Flips"],
      categories: ["Wholesale", "Flips"],
      type: "Calculator",
      status: "Coming Soon",
      badge: "Coming Soon"
    },
    {
      id: "4",
      title: "BRRRR Deal Analyzer",
      description: "Analyze Buy, Rehab, Rent, Refinance, Repeat strategy with cash-out options.",
      coverImage: "https://images.unsplash.com/photo-1592928302636-c83cf1e1c887?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Buy & Hold", "Flips"],
      categories: ["Buy & Hold", "Flips"],
      type: "Analyzer",
      status: "Coming Soon",
      badge: "Coming Soon"
    },
  ];

  // Filter resources based on category and search query
  const filteredResources = resources.filter(resource =>
    (activeCategory === "General" || resource.category === activeCategory) &&
    (resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
     resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );
  
  // Filter tools based on category and search query
  const filteredTools = tools.filter(tool =>
    (activeToolCategory === "All Tools" || tool.categories.includes(activeToolCategory)) &&
    (tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
     tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Breadcrumb navigation
  const getBreadcrumbs = () => {
    return (
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#09261E]">
          Home
        </Link>
        {' > '}
        {activeTab === "resources" ? (
          <span className="text-[#09261E] font-medium">Playbook</span>
        ) : (
          <>
            <Link href="/playbook" className="hover:text-[#09261E]">
              Playbook
            </Link>
            {' > '}
            <span className="text-[#09261E] font-medium">Tools</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white pb-24">
      {/* Toggle between Resources and Tools */}
      <div className="container mx-auto max-w-7xl px-4 pt-8">
        {getBreadcrumbs()}
        
        <div className="flex flex-col space-y-6">
          {/* Toggle between Resources and Tools - Centered toggle */}
          <div className="flex justify-center">
            <div className="flex items-center bg-gray-200 p-1 rounded-full shadow-sm relative h-10 w-[240px]">
              <div 
                className={`absolute inset-y-1 w-[118px] ${
                  activeTab === 'tools' ? 'right-1 translate-x-0' : 'left-1 translate-x-0'
                } bg-white rounded-full shadow transition-all duration-300 ease-in-out`}
              ></div>
              <button
                className={`relative z-10 flex items-center justify-center px-4 py-1.5 rounded-full transition-all duration-200 w-[118px] ${
                  activeTab === 'resources' 
                    ? 'text-[#09261E] font-medium' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab("resources")}
              >
                <Book size={14} className="mr-1.5" />
                <span className="text-sm">Resources</span>
              </button>
              
              <button
                className={`relative z-10 flex items-center justify-center px-4 py-1.5 rounded-full transition-all duration-200 w-[118px] ${
                  activeTab === 'tools' 
                    ? 'text-[#09261E] font-medium' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab("tools")}
              >
                <Calculator size={14} className="mr-1.5" />
                <span className="text-sm">Tools</span>
              </button>
            </div>
          </div>

          {activeTab === "resources" && (
            <>
              <div className="text-center">
                <h1 className="text-4xl font-bold text-[#09261E]">PropertyPlaybook: Real Estate Resources</h1>
                <p className="text-gray-600 mt-2">Educational resources to help you navigate the real estate market with confidence.</p>
              </div>
              
              <div className="relative w-full max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search resources..." 
                  className="pl-10 h-12 rounded-md border-gray-300 w-full" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex justify-center mb-6">
                <div className="inline-flex gap-2">
                  {resourceCategories.map(category => (
                    <button
                      key={category.id}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 flex items-center gap-2 border border-gray-200",
                        activeCategory === category.label
                          ? "bg-[#09261E] text-white shadow-sm"
                          : "bg-white text-gray-600 hover:bg-gray-100 hover:text-[#09261E]"
                      )}
                      onClick={() => setActiveCategory(category.label)}
                    >
                      {category.icon}
                      <span>{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                {filteredResources.map((resource) => (
                  <Card key={resource.id} className="overflow-hidden flex flex-col h-full rounded-lg shadow-sm border">
                    <div className="relative">
                      <div 
                        className="h-44 bg-cover bg-center rounded-t-lg" 
                        style={{ backgroundImage: `url(${resource.coverImage})` }}
                      />
                      {resource.badge && (
                        <Badge 
                          className={cn(
                            "absolute top-3 left-3 px-2 py-1 text-xs font-medium text-white",
                            resource.badge === "Trending" ? "bg-red-500" : "bg-orange-500"
                          )}
                        >
                          {resource.badge}
                        </Badge>
                      )}
                      <div className="absolute bottom-3 right-3 bg-white rounded-md p-1">
                        <FileText className="h-5 w-5 text-[#09261E]" />
                      </div>
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg font-semibold">{resource.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 pb-3 flex-1">
                      <p className="text-sm text-gray-600 line-clamp-2">{resource.description}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      {resource.status === "Published" ? (
                        <Link href={resource.id === "1" ? "/playbook/property-dictionary" : "#"} className="w-full">
                          <button className="w-full px-5 py-2 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-[#EAF2EF] text-[#135341] shadow-sm border border-gray-200 flex items-center justify-center">
                            View Resource
                          </button>
                        </Link>
                      ) : (
                        <button className="w-full px-5 py-2 rounded-md text-sm whitespace-nowrap font-medium bg-white/70 text-gray-400 border border-gray-200 cursor-not-allowed" disabled>
                          Coming Soon
                        </button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}

          {activeTab === "tools" && (
            <>
              <div className="text-center">
                <h1 className="text-4xl font-bold text-[#09261E]">Real Estate Investment Tools</h1>
                <p className="text-gray-600 mt-2">Free calculators and analysis tools to help you make data-driven real estate investment decisions.</p>
              </div>
              
              <div className="relative w-full max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search tools..." 
                  className="pl-10 h-12 rounded-md border-gray-300 w-full" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex justify-center mb-6">
                <div className="inline-flex gap-2">
                  {toolCategories.map(category => (
                    <button
                      key={category.id}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 flex items-center gap-2 border border-gray-200",
                        activeToolCategory === category.label
                          ? "bg-[#09261E] text-white shadow-sm"
                          : "bg-white text-gray-600 hover:bg-gray-100 hover:text-[#09261E]"
                      )}
                      onClick={() => setActiveToolCategory(category.label)}
                    >
                      {category.icon}
                      <span>{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                {filteredTools.map((tool) => (
                  <Card key={tool.id} className="overflow-hidden flex flex-col h-full rounded-lg shadow-sm border">
                    <div className="relative">
                      <div 
                        className="h-44 bg-cover bg-center rounded-t-lg" 
                        style={{ backgroundImage: `url(${tool.coverImage})` }}
                      />
                      {tool.badge && (
                        <Badge 
                          className={cn(
                            "absolute top-3 left-3 px-2 py-1 text-xs font-medium text-white",
                            tool.badge === "Popular" ? "bg-red-500" : 
                            tool.badge === "New" ? "bg-blue-500" : "bg-orange-500"
                          )}
                        >
                          {tool.badge}
                        </Badge>
                      )}
                      <div className="absolute bottom-3 right-3 bg-white rounded-md p-1">
                        <Calculator className="h-5 w-5 text-[#09261E]" />
                      </div>
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg font-semibold">{tool.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 pb-3 flex-1">
                      <p className="text-sm text-gray-600 line-clamp-2">{tool.description}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <div className="w-full flex flex-wrap gap-2">
                        {tool.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="bg-gray-50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardFooter>
                    <CardFooter className="p-4 pt-0">
                      {tool.status === "Published" && tool.badge !== "Coming Soon" ? (
                        <button className="w-full px-5 py-2 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-[#EAF2EF] text-[#135341] shadow-sm border border-gray-200 flex items-center justify-center">
                          Open {tool.type}
                        </button>
                      ) : (
                        <button className="w-full px-5 py-2 rounded-md text-sm whitespace-nowrap font-medium bg-white/70 text-gray-400 border border-gray-200 cursor-not-allowed" disabled>
                          Coming Soon
                        </button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}