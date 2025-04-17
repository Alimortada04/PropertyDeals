import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Star, 
  Calendar, 
  Home, 
  ThumbsUp, 
  ThumbsDown, 
  ChevronRight,
  Search,
  MessageSquare,
  Info,
  Lock
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: number;
  reviewerId: number;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  text: string;
  date: string;
  dealId?: number;
  dealTitle?: string;
  // Added fields for like/dislike feature
  likes?: number;
  dislikes?: number;
  userReaction?: 'like' | 'dislike' | null;
}

interface ReviewsProps {
  reviews: Review[];
}

// Review form schema
const reviewFormSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  reviewText: z.string().min(10, "Review must be at least 10 characters").max(1000, "Review must be less than 1000 characters"),
  dealTitle: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export default function Reviews({ reviews: initialReviews }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // For demo purposes, assume user is logged in
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { toast } = useToast();
  
  // Initialize form with react-hook-form
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      reviewText: "",
      dealTitle: "",
    },
  });
  
  // Initialize reviews with like/dislike data if not present
  useEffect(() => {
    const enhancedReviews = initialReviews.map(review => ({
      ...review,
      likes: review.likes || Math.floor(Math.random() * 5),
      dislikes: review.dislikes || 0,
      userReaction: review.userReaction || null
    }));
    
    // Sort reviews by likes (highest first)
    const sortedReviews = [...enhancedReviews].sort((a, b) => 
      (b.likes || 0) - (a.likes || 0)
    );
    
    setReviews(sortedReviews);
  }, [initialReviews]);
  
  // Detect if mobile view for responsive display
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);
  
  // Filter reviews when search query changes
  useEffect(() => {
    const filtered = reviews.filter(review => 
      review.reviewerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (review.dealTitle && review.dealTitle.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredReviews(filtered);
  }, [searchQuery, reviews]);
  
  if (!reviews || reviews.length === 0) {
    return (
      <div id="reviews" className="my-8 scroll-mt-24">
        <h2 className="text-2xl font-bold text-[#09261E] mb-4">
          Reviews <span className="text-base font-normal text-gray-500">(0)</span>
        </h2>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No reviews yet</h3>
          <p className="text-gray-500 mt-1">This REP hasn't received any reviews yet. Check back soon!</p>
        </div>
      </div>
    );
  }
  
  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  // Count ratings by stars (5★, 4★, etc.)
  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };
  
  // Handle like/dislike actions
  const handleReaction = (reviewId: number, reaction: 'like' | 'dislike') => {
    setReviews(prevReviews => {
      return prevReviews.map(review => {
        if (review.id === reviewId) {
          // If user already reacted the same way, remove the reaction
          if (review.userReaction === reaction) {
            return {
              ...review,
              [reaction === 'like' ? 'likes' : 'dislikes']: (review[reaction === 'like' ? 'likes' : 'dislikes'] || 0) - 1,
              userReaction: null
            };
          }
          
          // If user already reacted differently, switch the reaction
          if (review.userReaction) {
            return {
              ...review,
              likes: reaction === 'like' ? (review.likes || 0) + 1 : (review.likes || 0) - (review.userReaction === 'like' ? 1 : 0),
              dislikes: reaction === 'dislike' ? (review.dislikes || 0) + 1 : (review.dislikes || 0) - (review.userReaction === 'dislike' ? 1 : 0),
              userReaction: reaction
            };
          }
          
          // New reaction
          return {
            ...review,
            [reaction === 'like' ? 'likes' : 'dislikes']: (review[reaction === 'like' ? 'likes' : 'dislikes'] || 0) + 1,
            userReaction: reaction
          };
        }
        return review;
      });
    });
  };
  
  // Limit displayed reviews 
  const visibleReviews = isMobile ? reviews.slice(0, 3) : reviews.slice(0, 4);
  const hasMoreReviews = reviews.length > visibleReviews.length;
  
  // Handle form submission
  const onSubmit = (data: ReviewFormValues) => {
    // Create a new review with current date
    const newReview: Review = {
      id: Date.now(), // Use timestamp as id for demo
      reviewerId: 101, // Demo user ID
      reviewerName: "John Smith", // Current user name
      reviewerAvatar: "", // Could be a default avatar
      rating: data.rating,
      text: data.reviewText,
      date: new Date().toISOString(),
      dealTitle: data.dealTitle || undefined,
      likes: 0,
      dislikes: 0,
      userReaction: null
    };
    
    // Add the new review to the list and sort again
    const updatedReviews = [...reviews, newReview].sort((a, b) => 
      (b.likes || 0) - (a.likes || 0)
    );
    
    setReviews(updatedReviews);
    setIsReviewFormOpen(false);
    
    // Reset form
    form.reset({
      rating: 0,
      reviewText: "",
      dealTitle: "",
    });
    
    // Show success toast
    toast({
      title: "Review submitted",
      description: "Thank you for sharing your experience!",
    });
  };
  
  // Handle star rating interaction
  const handleStarClick = (rating: number) => {
    setCurrentRating(rating);
    form.setValue("rating", rating);
  };
  
  // Handle review button click
  const handleReviewClick = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
    } else {
      setIsReviewFormOpen(true);
    }
  };

  return (
    <>
      <div id="reviews" className="my-8 scroll-mt-24">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#09261E]">
            Reviews <span className="text-base font-normal text-gray-500">({reviews.length})</span>
          </h2>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              className="text-[#09261E] border-[#09261E] hover:bg-[#09261E] hover:text-white h-9"
              onClick={handleReviewClick}
            >
              <MessageSquare size={15} className="mr-1.5" />
              Leave a Review
            </Button>
            
            <Button 
              variant="link" 
              className="text-[#09261E] font-medium"
              onClick={() => setIsModalOpen(true)}
            >
              View All
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
        
        {/* Review summary */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Average rating */}
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-[#09261E]">{averageRating.toFixed(1)}</div>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={`${
                        star <= Math.round(averageRating)
                          ? "text-amber-500 fill-amber-500"
                          : "text-gray-300 fill-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500 mt-1">{reviews.length} reviews</div>
              </div>
              
              {/* Rating breakdown */}
              <div className="flex-1 w-full">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center mb-1.5">
                    <div className="w-12 text-sm text-gray-600 font-medium">{stars} stars</div>
                    <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{
                          width: `${(ratingCounts[stars as keyof typeof ratingCounts] / reviews.length) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="w-8 text-xs text-gray-500">
                      {ratingCounts[stars as keyof typeof ratingCounts]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Individual reviews */}
        <div className="space-y-4">
          {visibleReviews.map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              onReact={handleReaction}
            />
          ))}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 border-dashed border-gray-300 text-gray-500 hover:text-[#09261E] hover:border-[#09261E]"
          onClick={() => setIsModalOpen(true)}
        >
          <MessageSquare size={16} className="mr-2" />
          <span>See all {reviews.length} reviews</span>
        </Button>
      </div>
      
      {/* All Reviews Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-2xl">All Reviews</DialogTitle>
            <DialogDescription className="text-base text-gray-500">
              Browse all {reviews.length} reviews
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative my-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search reviews by name or content..." 
              className="pl-9 border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="overflow-y-auto flex-1 pr-2 -mr-2">
            <div className="space-y-4 py-2">
              {filteredReviews.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  onReact={handleReaction}
                />
              ))}
              
              {filteredReviews.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  <MessageSquare size={40} className="mx-auto mb-2 opacity-30" />
                  <p>No reviews found matching "{searchQuery}"</p>
                  <Button 
                    variant="link" 
                    className="mt-1 text-[#09261E]"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="pt-2 border-t">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Review submission dialog */}
      <Dialog open={isReviewFormOpen} onOpenChange={setIsReviewFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Leave a Review</DialogTitle>
            <DialogDescription>
              Share your experience with this real estate professional.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-3">
              {/* Star Rating */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`h-8 w-8 flex items-center justify-center rounded-md hover:bg-amber-50 transition-colors`}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        size={24}
                        className={`${
                          star <= (hoverRating || currentRating)
                            ? "text-amber-500 fill-amber-500"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {form.formState.errors.rating && (
                  <p className="text-sm font-medium text-red-500 mt-1">
                    {form.formState.errors.rating.message}
                  </p>
                )}
              </div>
              
              {/* Deal Title (Optional) */}
              <FormField
                control={form.control}
                name="dealTitle"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Related Property (Optional)</FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="e.g. 123 Main St, Miami" {...field} />
                    </FormControl>
                    <FormDescription>
                      If your review is about a specific property transaction
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Review Text */}
              <FormField
                control={form.control}
                name="reviewText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Review</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your experience with this real estate professional..."
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between items-center pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsReviewFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-[#09261E] hover:bg-[#135341]"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <span className="mr-2">Submitting</span>
                      <span className="animate-spin">↻</span>
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Login required modal */}
      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-amber-500" />
              <span>Account Required</span>
            </DialogTitle>
            <DialogDescription>
              You need to be logged in to leave a review.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <p className="text-sm text-gray-600 flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>
                Reviews help other users find trustworthy real estate professionals.
                Please sign in or create an account to share your experience.
              </span>
            </p>
            
            <div className="flex justify-between gap-3 mt-2">
              <Button 
                className="flex-1" 
                variant="outline"
                onClick={() => {
                  setLoginModalOpen(false);
                  // For demo purposes, we'll simulate logging in
                  setIsLoggedIn(true);
                  setIsReviewFormOpen(true);
                }}
              >
                Sign In
              </Button>
              <Button 
                className="flex-1 bg-[#09261E] hover:bg-[#135341]"
                onClick={() => {
                  setLoginModalOpen(false);
                  // For demo purposes, we'll simulate logging in
                  setIsLoggedIn(true);
                  setIsReviewFormOpen(true);
                }}
              >
                Create Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface ReviewCardProps {
  review: Review;
  onReact: (reviewId: number, reaction: 'like' | 'dislike') => void;
}

function ReviewCard({ review, onReact }: ReviewCardProps) {
  const initials = review.reviewerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <h3 className="font-semibold">{review.reviewerName}</h3>
              
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={`${
                      star <= review.rating
                        ? "text-amber-500 fill-amber-500"
                        : "text-gray-300 fill-gray-300"
                    }`}
                  />
                ))}
              </div>
              
              <div className="text-sm text-gray-500 flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>{formatRelativeTime(review.date)}</span>
              </div>
            </div>
            
            {review.dealTitle && (
              <div className="flex items-center text-sm text-gray-600 mt-1 mb-2">
                <Home size={14} className="mr-1" />
                <span>For: {review.dealTitle}</span>
              </div>
            )}
            
            <p className="text-gray-700 mt-2">{review.text}</p>
            
            {/* Like/Dislike actions */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-8 gap-1.5 text-xs font-medium ${
                  review.userReaction === 'like' 
                    ? 'text-green-600 bg-green-50 hover:bg-green-100 hover:text-green-700' 
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
                onClick={() => onReact(review.id, 'like')}
              >
                <ThumbsUp size={14} className={review.userReaction === 'like' ? 'fill-green-600' : ''} />
                <span>Helpful</span>
                {(review.likes && review.likes > 0) && (
                  <span className="ml-0.5">({review.likes})</span>
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-8 gap-1.5 text-xs font-medium ${
                  review.userReaction === 'dislike' 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700' 
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
                onClick={() => onReact(review.id, 'dislike')}
              >
                <ThumbsDown size={14} className={review.userReaction === 'dislike' ? 'fill-red-600' : ''} />
                <span>Not Helpful</span>
                {(review.dislikes && review.dislikes > 0) && (
                  <span className="ml-0.5">({review.dislikes})</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}