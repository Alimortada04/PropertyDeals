import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Calculator, Search, Briefcase, Home, Users, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PlaybookPage() {
  const [activeTab, setActiveTab] = useState("resources");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample resource data
  const resources = [
    {
      id: "1",
      title: "First-Time Home Buyer's Guide",
      description: "Everything you need to know as a first-time buyer in today's market.",
      coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Buying", "Financing", "First-Time"],
      timeToRead: "15 min read",
      authorName: "Jessica Miller",
      authorTitle: "Senior Real Estate Agent",
      authorAvatar: ""
    },
    {
      id: "2",
      title: "Real Estate Investment Strategies for 2025",
      description: "Learn the top investment strategies that will maximize your returns in the current market.",
      coverImage: "https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Investment", "Strategy", "Market Analysis"],
      timeToRead: "20 min read",
      authorName: "Robert Chen",
      authorTitle: "Investment Specialist",
      authorAvatar: ""
    },
    {
      id: "3",
      title: "The Ultimate Guide to Home Renovation",
      description: "Step-by-step process to renovate your home for maximum value and comfort.",
      coverImage: "https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Renovation", "Home Improvement", "DIY"],
      timeToRead: "25 min read",
      authorName: "Sarah Johnson",
      authorTitle: "Interior Designer",
      authorAvatar: ""
    },
    {
      id: "4",
      title: "How to Negotiate in Real Estate Deals",
      description: "Master the art of negotiation to get the best deals on properties.",
      coverImage: "https://images.unsplash.com/photo-1553524913-efba3f0b533e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Negotiation", "Sales", "Strategy"],
      timeToRead: "12 min read",
      authorName: "Michael Brown",
      authorTitle: "Real Estate Broker",
      authorAvatar: ""
    },
  ];

  // Sample tools data
  const tools = [
    {
      id: "1",
      title: "Mortgage Calculator",
      description: "Calculate your monthly mortgage payments based on loan amount, interest rate, and term.",
      coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Financing", "Calculator"],
      category: "Financing",
      icon: <Home className="h-10 w-10 text-green-600" />
    },
    {
      id: "2",
      title: "Rental Yield Calculator",
      description: "Calculate the return on investment for rental properties.",
      coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Investment", "Calculator", "Rental"],
      category: "Investment",
      icon: <Calculator className="h-10 w-10 text-blue-600" />
    },
    {
      id: "3",
      title: "Flip Property Analyzer",
      description: "Analyze potential flip properties to estimate costs, timeline, and profit.",
      coverImage: "https://images.unsplash.com/photo-1608303588026-884930af2559?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Flips", "Calculator", "Investment"],
      category: "Investment",
      icon: <Briefcase className="h-10 w-10 text-purple-600" />
    },
    {
      id: "4",
      title: "Closing Cost Estimator",
      description: "Estimate all the closing costs for your property purchase.",
      coverImage: "https://images.unsplash.com/photo-1568234928966-359c35dd8aba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Closing", "Calculator", "Buying"],
      category: "Buying",
      icon: <Users className="h-10 w-10 text-orange-600" />
    },
    {
      id: "5",
      title: "STR Revenue Calculator",
      description: "Project your short-term rental income based on location, seasonality, and property type.",
      coverImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["STR", "Calculator", "Revenue"],
      category: "Investment",
      icon: <Calculator className="h-10 w-10 text-teal-600" />
    },
    {
      id: "6",
      title: "Rehab Cost Estimator",
      description: "Get an accurate estimate of renovation costs for your project.",
      coverImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Renovation", "Calculator", "Costs"],
      category: "Renovation",
      icon: <Home className="h-10 w-10 text-red-600" />
    },
  ];

  // Filter resources based on search query
  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Filter tools based on search query
  const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get unique tool categories
  const categoriesSet = new Set(tools.map(tool => tool.category));
  const categories = Array.from(categoriesSet);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 pb-24">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="fixed left-16 top-0 h-16 w-[250px] rounded-none border-r bg-background z-10">
          <TabsTrigger 
            value="resources" 
            className={`flex-1 rounded-none data-[state=active]:bg-transparent ${activeTab === "resources" ? "border-b-2 border-primary" : ""}`}
          >
            <div className="flex items-center">
              <Book className="h-4 w-4 mr-2" />
              <span>Resources</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="tools" 
            className={`flex-1 rounded-none data-[state=active]:bg-transparent ${activeTab === "tools" ? "border-b-2 border-primary" : ""}`}
          >
            <div className="flex items-center">
              <Calculator className="h-4 w-4 mr-2" />
              <span>Tools</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="container py-8 pt-20 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-bold font-heading text-[#09261E]">PropertyDeals Playbook</h1>
              <p className="text-gray-600 mt-2">Educational resources to help you succeed in real estate</p>
            </div>
            
            <div className="relative min-w-[280px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search resources..." 
                className="pl-10 h-12 rounded-md border-gray-300" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden flex flex-col h-full shadow-md hover:shadow-lg transition-shadow">
                  <div 
                    className="h-48 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${resource.coverImage})` }}
                  />
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2 text-[#09261E]">{resource.title}</CardTitle>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span>{resource.timeToRead}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2 flex-1">
                    <p className="text-gray-600 text-sm line-clamp-3">{resource.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {resource.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="font-normal bg-gray-100 text-gray-700 hover:bg-gray-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 pb-4 mt-auto">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={resource.authorAvatar} alt={resource.authorName} />
                        <AvatarFallback className="bg-[#09261E]/10 text-[#09261E]">
                          {resource.authorName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{resource.authorName}</p>
                        <p className="text-xs text-gray-500">{resource.authorTitle}</p>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center py-12">
                <div className="text-center">
                  <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No resources found</h3>
                  <p className="text-gray-500">Try adjusting your search</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="tools" className="container py-8 pt-20 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-bold font-heading text-[#09261E]">Property Investment Tools</h1>
              <p className="text-gray-600 mt-2">Interactive calculators and tools to help with your real estate decisions</p>
            </div>
            
            <div className="relative min-w-[280px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search tools..." 
                className="pl-10 h-12 rounded-md border-gray-300" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Filter by Category</h2>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={!searchQuery ? "default" : "outline"} 
                size="sm"
                onClick={() => setSearchQuery("")}
                className="rounded-full"
              >
                All Tools
              </Button>
              {categories.map(category => (
                <Button 
                  key={category} 
                  variant={searchQuery === category ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSearchQuery(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool) => (
                <Card key={tool.id} className="overflow-hidden border border-gray-200 rounded-xl shadow hover:shadow-md transition-all">
                  <div className="flex items-start p-6">
                    <div className="mr-4 mt-1">
                      {tool.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2 text-[#09261E]">{tool.title}</CardTitle>
                      <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2 mb-4">
                        {tool.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="bg-gray-50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full">Open Calculator</Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center py-12">
                <div className="text-center">
                  <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No tools found</h3>
                  <p className="text-gray-500">Try adjusting your search</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}