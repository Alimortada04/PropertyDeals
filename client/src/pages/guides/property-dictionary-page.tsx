import { useState, useMemo } from "react";
import { Link } from "wouter";
import { dictionaryTerms } from "@/lib/dictionary-data";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowLeft, Search, BookOpen } from "lucide-react";

export default function PropertyDictionaryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(dictionaryTerms.map(term => term.category || "Uncategorized"));
    return ["all", ...Array.from(cats)].sort();
  }, []);

  // Filter terms based on search and category
  const filteredTerms = useMemo(() => {
    return dictionaryTerms.filter(term => {
      // Search filter
      const searchMatch = 
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const categoryMatch = selectedCategory === "all" || term.category === selectedCategory;
      
      return searchMatch && categoryMatch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/guides" className="inline-flex items-center text-[#135341] hover:text-[#09261E]">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Guides
        </Link>
      </div>
      
      <div className="flex items-center justify-center mb-8">
        <div className="p-3 rounded-full bg-[#09261E]/10 text-[#09261E] mr-4">
          <BookOpen size={32} strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#09261E]">
          Property Dictionary
        </h1>
      </div>
      
      <div className="max-w-4xl mx-auto mb-10">
        <p className="text-lg text-gray-600 text-center">
          A comprehensive glossary of real estate terms and definitions to help you navigate the complex terminology of property transactions and investments.
        </p>
      </div>
      
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Search Real Estate Terms</CardTitle>
          <CardDescription>
            Enter any keyword to find related terms or filter by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search terms or definitions..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Term</TableHead>
              <TableHead className="w-1/6">Category</TableHead>
              <TableHead>Definition</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTerms.length > 0 ? (
              filteredTerms.map((term, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{term.term}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-[#09261E]/10 text-[#09261E]">
                      {term.category || "Uncategorized"}
                    </span>
                  </TableCell>
                  <TableCell>{term.definition}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No terms found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Source: The Real Estate Marketplace Glossary, Federal Trade Commission</p>
      </div>
    </div>
  );
}