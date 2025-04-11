
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export default function HelpPage() {
  const [suggestions, setSuggestions] = useState([
    { id: 1, title: "Add virtual tours", votes: 5, voted: null },
    { id: 2, title: "Implement chat feature", votes: 3, voted: null }
  ]);

  const handleVote = (id: number, isUpvote: boolean) => {
    setSuggestions(suggestions.map(s => {
      if (s.id === id) {
        const voted = s.voted === (isUpvote ? 'up' : 'down') ? null : (isUpvote ? 'up' : 'down');
        return {
          ...s,
          votes: s.votes + (voted ? (isUpvote ? 1 : -1) : (s.voted ? -2 : 0)),
          voted
        };
      }
      return s;
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#09261E] mb-8">Help Center</h1>
      
      <Tabs defaultValue="faq">
        <TabsList className="mb-8">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="report">Report a Problem</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I contact a property seller?</AccordionTrigger>
              <AccordionContent>
                You can contact sellers directly through their profile page or by using the messaging system on the property listing page.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What are REPs?</AccordionTrigger>
              <AccordionContent>
                REPs (Real Estate Professionals) are verified experts in various real estate fields, including agents, contractors, and lenders.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        
        <TabsContent value="suggestions">
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Submit a Suggestion</h3>
              <form className="space-y-4">
                <Input placeholder="Your suggestion title" />
                <Textarea placeholder="Describe your suggestion in detail" />
                <Button>Submit Suggestion</Button>
              </form>
            </div>
            
            <div className="space-y-4">
              {suggestions.map(suggestion => (
                <div key={suggestion.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <span>{suggestion.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{suggestion.votes} votes</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(suggestion.id, true)}
                      className={suggestion.voted === 'up' ? 'text-green-600' : ''}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(suggestion.id, false)}
                      className={suggestion.voted === 'down' ? 'text-red-600' : ''}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="report">
          <div className="max-w-2xl bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">Report a Problem</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input placeholder="Brief description of the issue" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea placeholder="Detailed description of the problem" className="h-32" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Screenshot (optional)</label>
                <Input type="file" accept="image/*" />
              </div>
              <Button>Submit Report</Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
