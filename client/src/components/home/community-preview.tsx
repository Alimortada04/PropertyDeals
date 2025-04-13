import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ThumbsUp, MessageSquare, Heart, ExternalLink, Users, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";

export default function CommunityPreview() {
  const [activeTab, setActiveTab] = useState("trending");
  const discussionsRef = useRef<HTMLDivElement>(null);
  
  // Sample discussion posts
  const discussionPosts = [
    {
      id: 1,
      author: "Michael Johnson",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      badge: "Investor",
      time: "2 hours ago",
      content: "Just closed on my first BRRRR property in Cleveland. Happy to share my experience and numbers with anyone interested!",
      likes: 24,
      replies: 7,
      topics: ["BRRRR Strategy", "Cleveland"]
    },
    {
      id: 2,
      author: "Sarah Williams",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      badge: "Agent",
      time: "Yesterday",
      content: "Has anyone used the new FHA 203k loan program for a multi-family? Looking for advice on the process and pitfalls to avoid.",
      likes: 18,
      replies: 12,
      topics: ["FHA Loans", "Multi-Family"]
    },
    {
      id: 3,
      author: "David Chen",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg",
      badge: "Developer",
      time: "2 days ago",
      content: "What are your thoughts on the multi-family market in Phoenix right now? Seeing some interesting opportunities but concerned about the recent price surge.",
      likes: 32,
      replies: 15,
      topics: ["Market Analysis", "Phoenix"]
    },
    {
      id: 4,
      author: "Emma Rodriguez",
      avatar: "https://randomuser.me/api/portraits/women/62.jpg",
      badge: "Lender",
      time: "3 days ago",
      content: "Just published a comprehensive guide on creative financing for off-market deals. Check it out and let me know your thoughts!",
      likes: 47,
      replies: 23,
      topics: ["Creative Financing", "Resources"]
    }
  ];

  // Filter discussions based on active tab
  const filteredPosts = activeTab === "trending" 
    ? discussionPosts.sort((a, b) => (b.likes + b.replies) - (a.likes + a.replies))
    : discussionPosts.sort((a, b) => b.replies - a.replies);

  // Scroll horizontally when tab changes
  const scrollToPost = (index: number) => {
    if (discussionsRef.current) {
      const postWidth = discussionsRef.current.scrollWidth / filteredPosts.length;
      discussionsRef.current.scrollTo({
        left: postWidth * index,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-20 bg-[#F9F9F9]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div className="max-w-xl mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#09261E] mb-4 relative">
              <span className="relative z-10">Discussions That Matter</span>
              <span className="absolute bottom-1 left-0 h-3 w-24 bg-[#E59F9F]/30 -z-0"></span>
            </h2>
            <p className="text-gray-600 text-lg">
              What investors are talking about right now. Get advice, share deals, and discuss strategies.
            </p>
          </div>
          
          {/* Tabs */}
          <div className="bg-white rounded-full p-1 shadow-sm border flex">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'trending' 
                  ? 'bg-[#09261E] text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('trending')}
            >
              <ThumbsUp className="h-4 w-4 inline-block mr-1" />
              Trending
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'active' 
                  ? 'bg-[#09261E] text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('active')}
            >
              <MessageCircle className="h-4 w-4 inline-block mr-1" />
              Most Active
            </button>
          </div>
        </div>

        {/* Scrollable Discussion Cards */}
        <div 
          ref={discussionsRef}
          className="flex overflow-x-auto space-x-6 pb-6 -mx-4 px-4 no-scrollbar snap-x"
        >
          {filteredPosts.map((post, index) => (
            <Card 
              key={post.id} 
              className="bg-white shadow-sm hover:shadow-md transition-all duration-300 min-w-[320px] md:min-w-[400px] max-w-md flex-shrink-0 snap-start overflow-hidden transform hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-[#135341]/20">
                      <AvatarImage src={post.avatar} alt={post.author} />
                      <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1 -right-1 bg-[#135341] text-white text-xs px-1.5 py-0.5 rounded-full">
                      {post.badge}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-[#135341]">{post.author}</h3>
                      <span className="text-xs text-gray-500">{post.time}</span>
                    </div>
                    <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
                    
                    {/* Topics */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.topics.map((topic, i) => (
                        <span key={i} className="bg-[#09261E]/5 text-[#09261E] text-xs px-2 py-1 rounded-full">
                          {topic}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <button className="flex items-center gap-1 hover:text-[#E59F9F] transition-colors">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-[#135341] transition-colors">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.replies}</span>
                        </button>
                      </div>
                      <button className="text-xs text-[#135341] hover:text-[#09261E] flex items-center">
                        View Thread <ArrowRight className="h-3 w-3 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Join card */}
          <Card className="bg-gradient-to-br from-[#09261E] to-[#135341] text-white min-w-[320px] md:min-w-[400px] max-w-md flex-shrink-0 snap-start overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center justify-center h-full">
              <Users className="h-12 w-12 mb-6 opacity-90" />
              <h3 className="text-xl font-heading font-bold mb-3">Join the Conversation</h3>
              <p className="text-center text-white/80 mb-6">
                Connect with 3,200+ active investors sharing insights and opportunities.
              </p>
              <Link href="/discussions">
                <Button className="bg-white text-[#09261E] hover:bg-gray-100 px-6 rounded-full shadow-lg flex items-center gap-2">
                  <span>Join Discussions</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        
        {/* Scroll indicators */}
        <div className="flex justify-center mt-6 gap-2">
          {filteredPosts.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === 0 ? "w-8 bg-[#09261E]" : "w-2 bg-gray-300"
              }`}
              onClick={() => scrollToPost(index)}
              aria-label={`Go to post ${index + 1}`}
            ></button>
          ))}
          <button
            className="h-2 w-2 rounded-full bg-gray-300"
            onClick={() => scrollToPost(filteredPosts.length)}
            aria-label="View join card"
          ></button>
        </div>
      </div>
    </section>
  );
}