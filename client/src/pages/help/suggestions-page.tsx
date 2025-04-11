import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { ThumbsUp, ThumbsDown, User, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Suggestion {
  id: number;
  title: string;
  description: string;
  author: string;
  date: string;
  votes: number;
  status: "pending" | "under-review" | "implemented" | "declined";
}

// Sample suggestions data
const sampleSuggestions: Suggestion[] = [
  {
    id: 1,
    title: "Add neighborhood crime statistics",
    description: "It would be helpful to see crime statistics for the neighborhoods where properties are located to better assess safety.",
    author: "Michael T.",
    date: "2025-03-15",
    votes: 24,
    status: "under-review"
  },
  {
    id: 2,
    title: "Include school ratings in property details",
    description: "Please add school district information and ratings to property listings for families with children.",
    author: "Sarah J.",
    date: "2025-03-10",
    votes: 42,
    status: "implemented"
  },
  {
    id: 3,
    title: "Filter properties by commute time",
    description: "Add ability to filter properties based on commute time to work or specific locations.",
    author: "David R.",
    date: "2025-03-05",
    votes: 18,
    status: "pending"
  },
  {
    id: 4,
    title: "Noise level indicators for properties",
    description: "Would love to see information about noise levels around properties (e.g., proximity to highways, airports, etc.)",
    author: "Lisa M.",
    date: "2025-02-25",
    votes: 15,
    status: "pending"
  },
  {
    id: 5,
    title: "Dark mode for the website",
    description: "Please add a dark mode option for easier browsing at night.",
    author: "James K.",
    date: "2025-02-20",
    votes: 37,
    status: "declined"
  }
];

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(sampleSuggestions);
  const [newSuggestion, setNewSuggestion] = useState({ title: "", description: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Handle voting
  const handleVote = (id: number, voteType: "up" | "down") => {
    setSuggestions(suggestions.map(suggestion => 
      suggestion.id === id 
        ? { 
            ...suggestion, 
            votes: voteType === "up" 
              ? suggestion.votes + 1 
              : suggestion.votes - 1 
          } 
        : suggestion
    ));

    toast({
      title: voteType === "up" ? "Upvoted!" : "Downvoted!",
      description: "Thank you for your feedback.",
      duration: 3000,
    });
  };

  // Handle suggestion submission
  const handleSubmit = () => {
    if (!newSuggestion.title || !newSuggestion.description) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and description for your suggestion.",
        variant: "destructive",
      });
      return;
    }

    const newId = suggestions.length > 0 
      ? Math.max(...suggestions.map(s => s.id)) + 1 
      : 1;

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    const newSuggestionItem: Suggestion = {
      id: newId,
      title: newSuggestion.title,
      description: newSuggestion.description,
      author: "You",
      date: formattedDate,
      votes: 1, // Start with 1 vote (self-vote)
      status: "pending"
    };

    setSuggestions([newSuggestionItem, ...suggestions]);
    setNewSuggestion({ title: "", description: "" });
    setIsDialogOpen(false);

    toast({
      title: "Suggestion submitted!",
      description: "Thank you for your feedback. Your suggestion has been submitted for review.",
    });
  };

  // Filter suggestions
  const filteredSuggestions = suggestions.filter(suggestion => {
    const matchesSearch = 
      suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suggestion.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && suggestion.status === filter;
  });

  // Sort suggestions by votes (descending)
  const sortedSuggestions = [...filteredSuggestions].sort((a, b) => b.votes - a.votes);

  // Status label and color mapping
  const statusConfig = {
    "pending": { label: "Pending Review", color: "bg-gray-100 text-gray-700" },
    "under-review": { label: "Under Review", color: "bg-blue-100 text-blue-700" },
    "implemented": { label: "Implemented", color: "bg-green-100 text-green-700" },
    "declined": { label: "Declined", color: "bg-red-100 text-red-700" }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#09261E] mb-2">Suggestions</h1>
        <p className="text-gray-600 mb-8">
          Help us improve PropertyDeals by sharing your ideas or voting on existing suggestions.
        </p>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search suggestions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-4 py-2 border rounded-md bg-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under-review">Under Review</option>
              <option value="implemented">Implemented</option>
              <option value="declined">Declined</option>
            </select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#09261E] hover:bg-[#135341]">
                  New Suggestion
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit a Suggestion</DialogTitle>
                  <DialogDescription>
                    Share your idea for improving PropertyDeals. Be specific and concise.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">Title</label>
                    <Input
                      id="title"
                      placeholder="Brief title for your suggestion"
                      value={newSuggestion.title}
                      onChange={(e) => setNewSuggestion({...newSuggestion, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <Textarea
                      id="description"
                      placeholder="Describe your suggestion in detail"
                      rows={5}
                      value={newSuggestion.description}
                      onChange={(e) => setNewSuggestion({...newSuggestion, description: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-[#09261E] hover:bg-[#135341]" 
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Suggestions List */}
        {sortedSuggestions.length > 0 ? (
          <div className="space-y-6">
            {sortedSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{suggestion.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <User size={14} />
                        <span>{suggestion.author}</span>
                        <span className="mx-1">•</span>
                        <span>{new Date(suggestion.date).toLocaleDateString()}</span>
                      </CardDescription>
                    </div>
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusConfig[suggestion.status].color}`}>
                      {statusConfig[suggestion.status].label}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{suggestion.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center bg-gray-50 pt-3 pb-3">
                  <div className="flex items-center gap-1">
                    <MessageSquare size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">0 comments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="px-2 py-0 h-8"
                      onClick={() => handleVote(suggestion.id, "up")}
                    >
                      <ThumbsUp size={16} className="mr-1 text-gray-600" />
                      <span>{suggestion.votes}</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="px-2 py-0 h-8"
                      onClick={() => handleVote(suggestion.id, "down")}
                    >
                      <ThumbsDown size={16} className="text-gray-600" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">No suggestions found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? "We couldn't find any suggestions matching your search." 
                : "No suggestions available. Be the first to suggest an improvement!"}
            </p>
            <Button 
              className="bg-[#09261E] hover:bg-[#135341]"
              onClick={() => setIsDialogOpen(true)}
            >
              Submit a Suggestion
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}