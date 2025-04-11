import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, MessageCircle, Clock, TrendingUp, MapPin, Filter, 
  ThumbsUp, Send, Globe, Users, User, Paperclip, Image as ImageIcon, Link, 
  Share2, MenuSquare, ThumbsDown, Bookmark, Flag, BarChart3, 
  FileText, HelpCircle, PanelLeft, Home, Flame, LightbulbIcon, PlusCircleIcon
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Breadcrumbs from "@/components/common/breadcrumbs";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define post types
interface PostAttachment {
  type: 'image' | 'link' | 'property';
  url: string;
  preview?: {
    title?: string;
    image?: string;
    domain?: string;
    price?: string;
    address?: string;
    description?: string;
  }
}

interface Post {
  id: number;
  type: 'discussion' | 'property' | 'resource' | 'question';
  author: {
    id: number;
    name: string;
    avatar: string;
    role?: string;
    location?: string;
  };
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  category: string;
  tags?: string[];
  location?: string;
  attachments?: PostAttachment[];
  metrics?: {
    views: number;
    shares: number;
  };
  reactions?: {
    '👍': number;
    '🔥': number;
    '💡': number;
    '❤️': number;
  };
}

interface Reply {
  id: number;
  postId: number;
  author: {
    id: number;
    name: string;
    avatar: string;
    role?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  attachments?: PostAttachment[];
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description?: string;
}

const CATEGORIES: Category[] = [
  { id: 'all', name: 'All Topics', icon: <MenuSquare className="h-5 w-5" /> },
  { id: 'market-talk', name: 'Market Talk', icon: <BarChart3 className="h-5 w-5" /> },
  { id: 'investment-strategy', name: 'Investment Strategy', icon: <TrendingUp className="h-5 w-5" /> },
  { id: 'creative-financing', name: 'Creative Financing', icon: <FileText className="h-5 w-5" /> },
  { id: 'local-deals', name: 'Local Deals', icon: <MapPin className="h-5 w-5" /> },
  { id: 'lending-help', name: 'Lending Help', icon: <Users className="h-5 w-5" /> },
  { id: 'contractor-advice', name: 'Contractor Advice', icon: <HelpCircle className="h-5 w-5" /> }
];

// Define sort options
const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'trending', label: 'Trending' },
  { value: 'controversial', label: 'Most Discussed' }
];

export default function DiscussionsPage() {
  const [activeTab, setActiveTab] = useState("feed");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("recent");
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostType, setNewPostType] = useState<Post['type']>("discussion");
  const [newPostCategory, setNewPostCategory] = useState("market-talk");
  const [newReplyContent, setNewReplyContent] = useState("");
  const [postReplies, setPostReplies] = useState<Reply[]>([]);
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Sample data
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      type: 'discussion',
      author: {
        id: 1,
        name: 'Michael Chen',
        avatar: 'MC',
        role: 'Real Estate Investor',
        location: 'San Francisco, CA'
      },
      title: 'Current interest rate trends affecting investment property ROI',
      content: 'I've been tracking interest rates closely over the last quarter, and I'm seeing significant impacts on potential ROI for multi-family investments. Anyone else finding creative ways to offset these higher costs?',
      timestamp: '2 hours ago',
      likes: 24,
      replies: 8,
      category: 'market-talk',
      tags: ['interest-rates', 'multi-family', 'ROI'],
      reactions: {
        '👍': 18,
        '🔥': 5,
        '💡': 8,
        '❤️': 3
      },
      metrics: {
        views: 142,
        shares: 5
      }
    },
    {
      id: 2,
      type: 'property',
      author: {
        id: 2,
        name: 'Sarah Johnson',
        avatar: 'SJ',
        role: 'Property Manager'
      },
      title: 'Off-market duplex opportunity in Austin's East Side',
      content: 'I have a client looking to sell their fully renovated duplex off-market. Both units are 2bed/1bath with separate utilities and long-term tenants in place. Cash flow positive from day one.',
      timestamp: '4 hours ago',
      likes: 37,
      replies: 12,
      category: 'local-deals',
      location: 'Austin, TX',
      attachments: [
        {
          type: 'property',
          url: '/properties/austin-duplex',
          preview: {
            title: 'East Austin Duplex',
            image: 'https://placehold.co/600x400',
            price: '$625,000',
            address: '1234 East 6th St, Austin, TX',
            description: '2 units | 4 bed | 2 bath | 1,800 sqft'
          }
        }
      ]
    },
    {
      id: 3,
      type: 'resource',
      author: {
        id: 3,
        name: 'Robert Garcia',
        avatar: 'RG',
        role: 'Real Estate Attorney'
      },
      title: 'Free template: BRRRR strategy deal analyzer spreadsheet',
      content: 'After helping dozens of investors analyze BRRRR deals, I've created this comprehensive spreadsheet to help evaluate potential opportunities. Feel free to make a copy and use it for your next deal!',
      timestamp: '1 day ago',
      likes: 98,
      replies: 21,
      category: 'investment-strategy',
      attachments: [
        {
          type: 'link',
          url: 'https://docs.google.com/spreadsheets/d/example',
          preview: {
            title: 'BRRRR Deal Analyzer (Google Sheets)',
            domain: 'docs.google.com'
          }
        }
      ]
    },
    {
      id: 4,
      type: 'question',
      author: {
        id: 4,
        name: 'Jessica Williams',
        avatar: 'JW',
        role: 'First-time Investor'
      },
      title: 'Best practices for screening contractors for a major renovation?',
      content: 'I'm about to purchase my first flip property and need to find reliable contractors. What questions should I ask? Red flags to watch for? And how do you structure payment to protect yourself?',
      timestamp: '2 days ago',
      likes: 45,
      replies: 17,
      category: 'contractor-advice',
      tags: ['renovation', 'contractors', 'flip'],
      reactions: {
        '👍': 10,
        '🔥': 0,
        '💡': 15,
        '❤️': 2
      }
    },
    {
      id: 5,
      type: 'discussion',
      author: {
        id: 5,
        name: 'David Kim',
        avatar: 'DK',
        role: 'Commercial Investor'
      },
      title: 'Creative financing strategies for commercial properties in today's market',
      content: 'With traditional lenders tightening requirements, I've been exploring seller financing and private money options for commercial acquisitions. Here are 3 structures that have worked well recently...',
      timestamp: '3 days ago',
      likes: 63,
      replies: 14,
      category: 'creative-financing',
      tags: ['commercial', 'seller-financing', 'private-money'],
      reactions: {
        '👍': 40,
        '🔥': 12,
        '💡': 25,
        '❤️': 8
      }
    }
  ]);
  
  // Sample replies
  const sampleReplies: Record<number, Reply[]> = {
    1: [
      {
        id: 101,
        postId: 1,
        author: {
          id: 10,
          name: 'Alex Rodriguez',
          avatar: 'AR',
          role: 'Commercial Lender'
        },
        content: 'Great observation. We're seeing clients restructure with interest-only periods for the first 2-3 years to maintain cash flow while waiting for rates to potentially come down.',
        timestamp: '1 hour ago',
        likes: 8,
        isLiked: false
      },
      {
        id: 102,
        postId: 1,
        author: {
          id: 11,
          name: 'Lisa Patel',
          avatar: 'LP',
          role: 'Property Manager'
        },
        content: 'In our market, we're focusing more on value-add opportunities where the improved NOI can offset the higher interest costs. Specifically targeting properties with below-market rents or operational inefficiencies.',
        timestamp: '45 minutes ago',
        likes: 12,
        isLiked: true
      }
    ],
    2: [
      {
        id: 201,
        postId: 2,
        author: {
          id: 12,
          name: 'James Wilson',
          avatar: 'JW',
          role: 'Real Estate Investor'
        },
        content: 'Very interested in this. Is owner willing to provide any financing? Can you share current rent roll and expenses?',
        timestamp: '3 hours ago',
        likes: 3,
        isLiked: false
      }
    ]
  };
  
  // Load replies when a post is selected
  useEffect(() => {
    if (selectedPostId) {
      // In a real app, this would be an API call
      setPostReplies(sampleReplies[selectedPostId] || []);
      
      // Find the selected post
      const post = posts.find(p => p.id === selectedPostId);
      setSelectedPost(post || null);
    }
  }, [selectedPostId]);
  
  // Filter posts based on category, search, and sort
  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !locationFilter || post.location === locationFilter;
    
    return matchesCategory && matchesSearch && matchesLocation;
  }).sort((a, b) => {
    if (sortOption === 'recent') {
      // Simple sort by timestamp (in real app would use actual dates)
      return a.id < b.id ? 1 : -1;
    } else if (sortOption === 'popular') {
      return b.likes - a.likes;
    } else if (sortOption === 'trending') {
      return (b.likes + b.replies) - (a.likes + a.replies);
    } else {
      return b.replies - a.replies; // controversial = most discussed
    }
  });
  
  const handleLikePost = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.isLiked;
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !isLiked
        };
      }
      return post;
    }));
  };
  
  const handleBookmarkPost = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isBookmarked: !post.isBookmarked
        };
      }
      return post;
    }));
    
    toast({
      title: "Post Bookmarked",
      description: "You can find this post in your bookmarks",
    });
  };
  
  const handleLikeReply = (replyId: number) => {
    setPostReplies(postReplies.map(reply => {
      if (reply.id === replyId) {
        const isLiked = reply.isLiked;
        return {
          ...reply,
          likes: isLiked ? reply.likes - 1 : reply.likes + 1,
          isLiked: !isLiked
        };
      }
      return reply;
    }));
  };
  
  const handleReplySubmit = () => {
    if (!newReplyContent.trim() || !selectedPostId) return;
    
    const newReply: Reply = {
      id: Date.now(),
      postId: selectedPostId,
      author: {
        id: 999, // Current user
        name: 'Current User', // Would come from auth context
        avatar: 'CU',
        role: 'Investor'
      },
      content: newReplyContent,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false
    };
    
    setPostReplies([...postReplies, newReply]);
    setNewReplyContent('');
    
    // Update the post's reply count
    setPosts(posts.map(post => {
      if (post.id === selectedPostId) {
        return {
          ...post,
          replies: post.replies + 1
        };
      }
      return post;
    }));
  };
  
  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    
    const newPost: Post = {
      id: Date.now(),
      type: newPostType,
      author: {
        id: 999, // Current user
        name: 'Current User', // Would come from auth context
        avatar: 'CU',
        role: 'Investor'
      },
      title: newPostTitle,
      content: newPostContent,
      timestamp: 'Just now',
      likes: 0,
      replies: 0,
      category: newPostCategory,
      reactions: {
        '👍': 0,
        '🔥': 0,
        '💡': 0,
        '❤️': 0
      }
    };
    
    setPosts([newPost, ...posts]);
    setShowNewPostDialog(false);
    setNewPostTitle('');
    setNewPostContent('');
    
    toast({
      title: "Post Created",
      description: "Your post has been published successfully",
    });
  };
  
  const getPostIcon = (type: Post['type']) => {
    switch (type) {
      case 'discussion':
        return <MessageCircle className="h-4 w-4" />;
      case 'property':
        return <Home className="h-4 w-4" />;
      case 'resource':
        return <FileText className="h-4 w-4" />;
      case 'question':
        return <HelpCircle className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };
  
  const getPostTypeLabel = (type: Post['type']) => {
    switch (type) {
      case 'discussion':
        return 'Discussion';
      case 'property':
        return 'Property';
      case 'resource':
        return 'Resource';
      case 'question':
        return 'Question';
      default:
        return 'Post';
    }
  };
  
  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'market-talk':
        return 'bg-blue-100 text-blue-800';
      case 'investment-strategy':
        return 'bg-green-100 text-green-800';
      case 'creative-financing':
        return 'bg-purple-100 text-purple-800';
      case 'local-deals':
        return 'bg-yellow-100 text-yellow-800';
      case 'lending-help':
        return 'bg-orange-100 text-orange-800';
      case 'contractor-advice':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getCategoryIcon = (categoryId: string) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    return category ? category.icon : <MenuSquare className="h-5 w-5" />;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Breadcrumbs />
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#09261E] mb-2">Discussions</h1>
            <p className="text-gray-600 max-w-2xl">
              Join conversations with fellow real estate investors, share insights, ask questions, 
              and discover valuable resources from the community.
            </p>
          </div>
          
          <Button 
            onClick={() => setShowNewPostDialog(true)}
            className="bg-[#09261E] hover:bg-[#124035] text-white"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Create Post
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Sidebar - Hidden on mobile */}
        {showSidebar && (
          <div className="hidden lg:block">
            <Card className="sticky top-20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MenuSquare className="h-5 w-5" /> 
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-1">
                  {CATEGORIES.map(category => (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? "default" : "ghost"}
                      className={`w-full justify-start font-normal text-base ${
                        activeCategory === category.id 
                          ? 'bg-[#09261E] text-white hover:bg-[#09261E]' 
                          : 'hover:bg-[#EAF2EF]'
                      }`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <div className="mr-2">{category.icon}</div>
                      <span>{category.name}</span>
                      {activeCategory !== category.id && (
                        <span className="ml-auto text-xs text-gray-500">
                          {Math.floor(Math.random() * 20) + 1}
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
              <Separator />
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" /> 
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Location
                    </label>
                    <Select
                      value={locationFilter || ""}
                      onValueChange={(value) => setLocationFilter(value || null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Locations</SelectItem>
                        <SelectItem value="San Francisco, CA">San Francisco, CA</SelectItem>
                        <SelectItem value="Austin, TX">Austin, TX</SelectItem>
                        <SelectItem value="New York, NY">New York, NY</SelectItem>
                        <SelectItem value="Miami, FL">Miami, FL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Mobile Categories/Filters (Visible only on mobile) */}
        <div className="lg:hidden col-span-1 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              value={activeCategory}
              onValueChange={setActiveCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center">
                      <span className="mr-2">{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={locationFilter || ""}
              onValueChange={(value) => setLocationFilter(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations</SelectItem>
                <SelectItem value="San Francisco, CA">San Francisco, CA</SelectItem>
                <SelectItem value="Austin, TX">Austin, TX</SelectItem>
                <SelectItem value="New York, NY">New York, NY</SelectItem>
                <SelectItem value="Miami, FL">Miami, FL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Main Feed */}
        <div className={`col-span-1 ${showSidebar ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap gap-4 justify-between">
                {/* Search Input */}
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search discussions..."
                    className="pl-10 py-2 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Sort Option */}
                <div>
                  <Select
                    value={sortOption}
                    onValueChange={setSortOption}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.value === 'recent' && <Clock className="h-4 w-4 mr-2 inline" />}
                          {option.value === 'popular' && <ThumbsUp className="h-4 w-4 mr-2 inline" />}
                          {option.value === 'trending' && <TrendingUp className="h-4 w-4 mr-2 inline" />}
                          {option.value === 'controversial' && <MessageCircle className="h-4 w-4 mr-2 inline" />}
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Toggle Sidebar (Desktop Only) */}
                <Button
                  variant="outline"
                  size="icon"
                  className="hidden lg:flex"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  <PanelLeft className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No discussions found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery 
                      ? `No results match "${searchQuery}"` 
                      : "Be the first to start a discussion in this category!"}
                  </p>
                  <Button 
                    onClick={() => setShowNewPostDialog(true)}
                    className="bg-[#09261E] hover:bg-[#124035] text-white"
                  >
                    Create New Post
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex">
                        <Avatar className="h-10 w-10 mt-1 mr-4">
                          <AvatarFallback>{post.author.avatar}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          {/* Post Header */}
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                            <span className="font-medium">{post.author.name}</span>
                            {post.author.role && (
                              <span className="text-gray-500 text-sm">• {post.author.role}</span>
                            )}
                            <span className="text-gray-500 text-sm">• {post.timestamp}</span>
                            
                            {/* Post Type Badge */}
                            <Badge variant="outline" className="ml-auto">
                              <span className="flex items-center">
                                {getPostIcon(post.type)}
                                <span className="ml-1">{getPostTypeLabel(post.type)}</span>
                              </span>
                            </Badge>
                          </div>
                          
                          {/* Post Title */}
                          <h3 
                            className="text-lg font-medium text-[#09261E] mb-2 cursor-pointer hover:underline"
                            onClick={() => setSelectedPostId(post.id)}
                          >
                            {post.title}
                          </h3>
                          
                          {/* Post Content */}
                          <p className="text-gray-700 mb-3 line-clamp-2">{post.content}</p>
                          
                          {/* Post Attachments */}
                          {post.attachments && post.attachments.length > 0 && (
                            <div className="mb-3">
                              {post.attachments.map((attachment, index) => (
                                <div 
                                  key={index} 
                                  className="border rounded-md overflow-hidden"
                                  onClick={() => setSelectedPostId(post.id)}
                                >
                                  {attachment.type === 'property' && attachment.preview && (
                                    <div className="flex cursor-pointer hover:opacity-90">
                                      {attachment.preview.image && (
                                        <div className="w-24 h-24 flex-shrink-0">
                                          <img 
                                            src={attachment.preview.image}
                                            alt={attachment.preview.title || "Property"} 
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      )}
                                      <div className="p-3">
                                        <div className="font-medium mb-1">{attachment.preview.title}</div>
                                        {attachment.preview.address && (
                                          <div className="text-xs text-gray-500 mb-1">{attachment.preview.address}</div>
                                        )}
                                        {attachment.preview.price && (
                                          <div className="text-sm font-bold">{attachment.preview.price}</div>
                                        )}
                                        {attachment.preview.description && (
                                          <div className="text-xs text-gray-500">{attachment.preview.description}</div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {attachment.type === 'link' && attachment.preview && (
                                    <div className="p-3 cursor-pointer hover:bg-gray-50">
                                      <div className="font-medium mb-1">{attachment.preview.title}</div>
                                      {attachment.preview.domain && (
                                        <div className="text-xs text-gray-500 flex items-center">
                                          <ExternalLink className="h-3 w-3 mr-1" />
                                          {attachment.preview.domain}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Tags and Categories */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className={getCategoryBadgeColor(post.category)}>
                              <span className="flex items-center">
                                {getCategoryIcon(post.category)}
                                <span className="ml-1">{CATEGORIES.find(c => c.id === post.category)?.name || post.category}</span>
                              </span>
                            </Badge>
                            
                            {post.location && (
                              <Badge variant="outline" className="text-gray-700">
                                <MapPin className="h-3 w-3 mr-1" />
                                {post.location}
                              </Badge>
                            )}
                            
                            {post.tags && post.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          
                          {/* Post Actions */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            {/* Reactions */}
                            {post.reactions ? (
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className={`px-2 h-8 ${post.isLiked ? 'text-blue-600' : ''}`}
                                  onClick={() => handleLikePost(post.id)}
                                >
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  <span>{post.reactions['👍']}</span>
                                </Button>
                                
                                <Button variant="ghost" size="sm" className="px-2 h-8">
                                  <Flame className="h-4 w-4 mr-1" />
                                  <span>{post.reactions['🔥']}</span>
                                </Button>
                                
                                <Button variant="ghost" size="sm" className="px-2 h-8">
                                  <LightbulbIcon className="h-4 w-4 mr-1" />
                                  <span>{post.reactions['💡']}</span>
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className={`px-2 h-8 ${post.isLiked ? 'text-blue-600' : ''}`}
                                onClick={() => handleLikePost(post.id)}
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                <span>{post.likes}</span>
                              </Button>
                            )}
                            
                            {/* Comments Button */}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="px-2 h-8"
                              onClick={() => setSelectedPostId(post.id)}
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              <span>{post.replies} {post.replies === 1 ? 'reply' : 'replies'}</span>
                            </Button>
                            
                            {/* Bookmark */}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={`px-2 h-8 ${post.isBookmarked ? 'text-blue-600' : ''}`}
                              onClick={() => handleBookmarkPost(post.id)}
                            >
                              <Bookmark className="h-4 w-4" />
                            </Button>
                            
                            {/* Share */}
                            <Button variant="ghost" size="sm" className="px-2 h-8">
                              <Share2 className="h-4 w-4" />
                            </Button>
                            
                            {/* Post Metrics (optional) */}
                            {post.metrics && (
                              <div className="ml-auto text-xs text-gray-400">
                                {post.metrics.views} views
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Post Detail Dialog */}
      {selectedPost && (
        <Dialog 
          open={selectedPostId !== null} 
          onOpenChange={(open) => !open && setSelectedPostId(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 mt-1">
                  <AvatarFallback>{selectedPost.author.avatar}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                    <span className="font-medium">{selectedPost.author.name}</span>
                    {selectedPost.author.role && (
                      <span className="text-gray-500 text-sm">• {selectedPost.author.role}</span>
                    )}
                    <span className="text-gray-500 text-sm">• {selectedPost.timestamp}</span>
                  </div>
                  
                  <DialogTitle className="text-left mt-1 mb-3">{selectedPost.title}</DialogTitle>
                  <p className="text-gray-700 mb-4 whitespace-pre-wrap">{selectedPost.content}</p>
                  
                  {/* Post Attachments */}
                  {selectedPost.attachments && selectedPost.attachments.length > 0 && (
                    <div className="mb-4">
                      {selectedPost.attachments.map((attachment, index) => (
                        <div 
                          key={index} 
                          className="border rounded-md overflow-hidden"
                        >
                          {attachment.type === 'property' && attachment.preview && (
                            <div className="flex cursor-pointer hover:opacity-90">
                              {attachment.preview.image && (
                                <div className="w-32 h-32 flex-shrink-0">
                                  <img 
                                    src={attachment.preview.image}
                                    alt={attachment.preview.title || "Property"} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="p-3">
                                <div className="font-medium mb-1">{attachment.preview.title}</div>
                                {attachment.preview.address && (
                                  <div className="text-sm text-gray-500 mb-1">{attachment.preview.address}</div>
                                )}
                                {attachment.preview.price && (
                                  <div className="text-lg font-bold">{attachment.preview.price}</div>
                                )}
                                {attachment.preview.description && (
                                  <div className="text-sm text-gray-500 mt-1">{attachment.preview.description}</div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {attachment.type === 'link' && attachment.preview && (
                            <a 
                              href={attachment.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block p-3 hover:bg-gray-50"
                            >
                              <div className="font-medium mb-1">{attachment.preview.title}</div>
                              {attachment.preview.domain && (
                                <div className="text-sm text-gray-500 flex items-center">
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  {attachment.preview.domain}
                                </div>
                              )}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Tags and Categories */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={getCategoryBadgeColor(selectedPost.category)}>
                      <span className="flex items-center">
                        {getCategoryIcon(selectedPost.category)}
                        <span className="ml-1">
                          {CATEGORIES.find(c => c.id === selectedPost.category)?.name || selectedPost.category}
                        </span>
                      </span>
                    </Badge>
                    
                    {selectedPost.location && (
                      <Badge variant="outline" className="text-gray-700">
                        <MapPin className="h-3 w-3 mr-1" />
                        {selectedPost.location}
                      </Badge>
                    )}
                    
                    {selectedPost.tags && selectedPost.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Post Actions */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    {/* Reactions */}
                    {selectedPost.reactions ? (
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`px-3 h-8 ${selectedPost.isLiked ? 'text-blue-600' : ''}`}
                          onClick={() => handleLikePost(selectedPost.id)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>{selectedPost.reactions['👍']}</span>
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="px-3 h-8">
                          <Flame className="h-4 w-4 mr-1" />
                          <span>{selectedPost.reactions['🔥']}</span>
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="px-3 h-8">
                          <LightbulbIcon className="h-4 w-4 mr-1" />
                          <span>{selectedPost.reactions['💡']}</span>
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`px-3 h-8 ${selectedPost.isLiked ? 'text-blue-600' : ''}`}
                        onClick={() => handleLikePost(selectedPost.id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>{selectedPost.likes}</span>
                      </Button>
                    )}
                    
                    {/* Bookmark */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`px-3 h-8 ${selectedPost.isBookmarked ? 'text-blue-600' : ''}`}
                      onClick={() => handleBookmarkPost(selectedPost.id)}
                    >
                      <Bookmark className="h-4 w-4 mr-1" />
                      <span>Save</span>
                    </Button>
                    
                    {/* Share */}
                    <Button variant="ghost" size="sm" className="px-3 h-8">
                      <Share2 className="h-4 w-4 mr-1" />
                      <span>Share</span>
                    </Button>
                    
                    {/* Flag */}
                    <Button variant="ghost" size="sm" className="px-3 h-8 ml-auto">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </DialogHeader>
            
            {/* Reply Count */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900">
                {postReplies.length} {postReplies.length === 1 ? 'Reply' : 'Replies'}
              </h4>
              <Separator className="mt-2" />
            </div>
            
            {/* Replies */}
            <div className="space-y-6 mb-6">
              {postReplies.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  Be the first to reply to this post!
                </div>
              ) : (
                postReplies.map(reply => (
                  <div key={reply.id} className="flex items-start gap-4">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback>{reply.author.avatar}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="font-medium text-sm">{reply.author.name}</span>
                        {reply.author.role && (
                          <span className="text-gray-500 text-xs ml-2">
                            {reply.author.role}
                          </span>
                        )}
                        <span className="text-gray-500 text-xs ml-2">
                          • {reply.timestamp}
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg mb-2">
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{reply.content}</p>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`px-2 h-6 ${reply.isLiked ? 'text-blue-600' : ''}`}
                          onClick={() => handleLikeReply(reply.id)}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span>{reply.likes}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Reply Input */}
            <div className="mt-auto pt-2 border-t">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback>CU</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <Textarea
                    placeholder="Write a reply..."
                    className="min-h-[100px] resize-none border-gray-300 focus:border-[#09261E] mb-3"
                    value={newReplyContent}
                    onChange={(e) => setNewReplyContent(e.target.value)}
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-8 px-2">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 px-2">
                        <Link className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button 
                      className="bg-[#09261E] hover:bg-[#124035] text-white"
                      onClick={handleReplySubmit}
                      disabled={!newReplyContent.trim()}
                    >
                      Post Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Create New Post Dialog */}
      <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              Share your thoughts, questions, or resources with the community
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Post Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Post Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  type="button"
                  variant={newPostType === 'discussion' ? 'default' : 'outline'}
                  className={newPostType === 'discussion' ? 'bg-[#09261E] text-white' : ''}
                  onClick={() => setNewPostType('discussion')}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Discussion
                </Button>
                <Button
                  type="button"
                  variant={newPostType === 'question' ? 'default' : 'outline'}
                  className={newPostType === 'question' ? 'bg-[#09261E] text-white' : ''}
                  onClick={() => setNewPostType('question')}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Question
                </Button>
                <Button
                  type="button"
                  variant={newPostType === 'property' ? 'default' : 'outline'}
                  className={newPostType === 'property' ? 'bg-[#09261E] text-white' : ''}
                  onClick={() => setNewPostType('property')}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Property
                </Button>
                <Button
                  type="button"
                  variant={newPostType === 'resource' ? 'default' : 'outline'}
                  className={newPostType === 'resource' ? 'bg-[#09261E] text-white' : ''}
                  onClick={() => setNewPostType('resource')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Resource
                </Button>
              </div>
            </div>
            
            {/* Category */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={newPostCategory}
                onValueChange={setNewPostCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.slice(1).map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center">
                        <span className="mr-2">{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Title */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="Add a descriptive title"
              />
            </div>
            
            {/* Content */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your thoughts, ask a question, or provide details..."
                className="min-h-[120px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewPostDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePost}
              className="bg-[#09261E] hover:bg-[#124035] text-white"
              disabled={!newPostTitle.trim() || !newPostContent.trim()}
            >
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}