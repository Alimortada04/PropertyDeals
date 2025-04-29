import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Calculator, Search, Tag, Filter } from "lucide-react";
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
      category: "Financing"
    },
    {
      id: "2",
      title: "Rental Yield Calculator",
      description: "Calculate the return on investment for rental properties.",
      coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Investment", "Calculator", "Rental"],
      category: "Investment"
    },
    {
      id: "3",
      title: "Flip Property Analyzer",
      description: "Analyze potential flip properties to estimate costs, timeline, and profit.",
      coverImage: "https://images.unsplash.com/photo-1608303588026-884930af2559?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Flips", "Calculator", "Investment"],
      category: "Investment"
    },
    {
      id: "4",
      title: "Closing Cost Estimator",
      description: "Estimate all the closing costs for your property purchase.",
      coverImage: "https://images.unsplash.com/photo-1568234928966-359c35dd8aba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Closing", "Calculator", "Buying"],
      category: "Buying"
    },
    {
      id: "5",
      title: "STR Revenue Calculator",
      description: "Project your short-term rental income based on location, seasonality, and property type.",
      coverImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["STR", "Calculator", "Revenue"],
      category: "Investment"
    },
    {
      id: "6",
      title: "Rehab Cost Estimator",
      description: "Get an accurate estimate of renovation costs for your project.",
      coverImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      tags: ["Renovation", "Calculator", "Costs"],
      category: "Renovation"
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
    tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get unique tool categories
  const categories = [...new Set(tools.map(tool => tool.category))];

  return (
    <div className="container max-w-7xl py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">PropertyDeals Playbook</h1>
          <p className="text-muted-foreground mt-1">Resources and tools to help you succeed in real estate</p>
        </div>
        
        <div className="relative min-w-[280px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search resources and tools..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="resources" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-8">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span>Resources</span>
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span>Tools</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline-block">Filter</span>
            </Button>
          </div>
        </div>
        
        <TabsContent value="resources" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden flex flex-col h-full">
                  <div 
                    className="h-48 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${resource.coverImage})` }}
                  />
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <span>{resource.timeToRead}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2 flex-1">
                    <p className="text-muted-foreground text-sm line-clamp-3">{resource.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {resource.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 pb-4 mt-auto">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={resource.authorAvatar} alt={resource.authorName} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {resource.authorName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{resource.authorName}</p>
                        <p className="text-xs text-muted-foreground">{resource.authorTitle}</p>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center py-12">
                <div className="text-center">
                  <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No resources found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="tools" className="mt-0">
          <ScrollArea className="w-full whitespace-nowrap mb-6 py-1">
            <div className="flex items-center space-x-2 w-max">
              <Button variant="ghost" size="sm" className={!searchQuery ? "bg-muted" : ""} onClick={() => setSearchQuery("")}>All Tools</Button>
              {categories.map(category => (
                <Button 
                  key={category} 
                  variant="ghost" 
                  size="sm" 
                  className={searchQuery === category ? "bg-muted" : ""}
                  onClick={() => setSearchQuery(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </ScrollArea>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool) => (
                <Card key={tool.id} className="overflow-hidden flex flex-col h-full cursor-pointer hover:border-primary/50 transition-colors">
                  <div 
                    className="h-48 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${tool.coverImage})` }}
                  />
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2">{tool.title}</CardTitle>
                    <Badge variant="outline" className="w-fit mt-1">
                      {tool.category}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pb-2 flex-1">
                    <p className="text-muted-foreground text-sm line-clamp-3">{tool.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {tool.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 pb-4">
                    <Button className="w-full">
                      Open Calculator
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center py-12">
                <div className="text-center">
                  <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No tools found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}