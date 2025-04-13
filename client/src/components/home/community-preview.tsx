import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ThumbsUp } from "lucide-react";

export default function CommunityPreview() {
  // Sample discussion posts
  const discussionPosts = [
    {
      id: 1,
      author: "Michael Johnson",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      time: "2 hours ago",
      content: "Just closed on my first BRRRR property in Cleveland. Happy to share my experience and numbers with anyone interested!",
      likes: 24,
      replies: 7
    },
    {
      id: 2,
      author: "Sarah Williams",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      time: "Yesterday",
      content: "Has anyone used the new FHA 203k loan program for a multi-family? Looking for advice on the process and pitfalls to avoid.",
      likes: 18,
      replies: 12
    },
    {
      id: 3,
      author: "David Chen",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg",
      time: "2 days ago",
      content: "What are your thoughts on the multi-family market in Phoenix right now? Seeing some interesting opportunities but concerned about the recent price surge.",
      likes: 32,
      replies: 15
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-4">
            Discussions That Matter
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get advice, share deals, and discuss strategies with investors like you.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6 mb-10">
          {discussionPosts.map(post => (
            <Card key={post.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 border-2 border-[#135341]/20">
                    <AvatarImage src={post.avatar} alt={post.author} />
                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-[#135341]">{post.author}</h3>
                      <span className="text-sm text-gray-500">{post.time}</span>
                    </div>
                    <p className="text-gray-700 mb-4">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.replies} replies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Link href="/discussions">
            <Button className="bg-[#09261E] hover:bg-[#135341] text-white px-6 py-3 font-medium">
              Join the Conversation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}