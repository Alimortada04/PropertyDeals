import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  StarHalf, 
  ThumbsUp, 
  Calendar, 
  Filter, 
  BadgeCheck 
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface RepReviewsProps {
  reviews: any[];
  repId: number;
  repName: string;
}

export default function RepReviews({ reviews, repId, repName }: RepReviewsProps) {
  const { toast } = useToast();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewSortBy, setReviewSortBy] = useState<"newest" | "highest">("newest");
  const [helpfulReviews, setHelpfulReviews] = useState<number[]>([]);
  
  // Convert to actual array if it's not
  const reviewsArray = Array.isArray(reviews) ? reviews : [];
  
  // Sort reviews based on selected sorting option
  const sortedReviews = [...reviewsArray].sort((a, b) => {
    if (reviewSortBy === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.rating - a.rating;
    }
  });
  
  // Calculate average rating
  const averageRating = 
    reviewsArray.length > 0
      ? reviewsArray.reduce((sum, review) => sum + review.rating, 0) / reviewsArray.length
      : 0;
  
  // Get rating stars (filled, half-filled, or empty)
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }
    
    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }
    
    return stars;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return "Recent";
    }
  };
  
  // Mark review as helpful
  const markAsHelpful = (reviewId: number) => {
    if (helpfulReviews.includes(reviewId)) return;
    
    setHelpfulReviews([...helpfulReviews, reviewId]);
    toast({
      title: "Marked as helpful",
      description: "Thank you for your feedback",
    });
  };
  
  // Handle review submission
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Review submitted",
      description: `Your review for ${repName} has been submitted`,
    });
    setReviewDialogOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Star className="h-5 w-5" />
          Reviews
        </h2>
        
        <div className="flex items-center gap-2">
          <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
            <DialogTrigger asChild>
              <Button>Write a Review</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Review {repName}</DialogTitle>
                <DialogDescription>
                  Share your experience working with this REP
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleReviewSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="text-yellow-400 hover:scale-110 transition-transform"
                      >
                        <Star className="h-8 w-8" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input 
                    id="relationship" 
                    placeholder="e.g., Client, Business Partner, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review">Review</Label>
                  <Textarea 
                    id="review" 
                    placeholder="Share your experience..."
                    className="min-h-[120px]"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Submit Review</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setReviewSortBy(reviewSortBy === "newest" ? "highest" : "newest")}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Sort:</span> {reviewSortBy === "newest" ? "Newest" : "Highest Rated"}
          </Button>
        </div>
      </div>
      
      {/* Summary Section */}
      <div className="bg-muted/40 rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-6 items-center">
        <div className="text-center sm:text-left">
          <div className="text-4xl font-bold mb-1">{averageRating.toFixed(1)}</div>
          <div className="flex items-center justify-center sm:justify-start mb-1">
            {renderRatingStars(averageRating)}
          </div>
          <div className="text-sm text-muted-foreground">
            Based on {reviewsArray.length} {reviewsArray.length === 1 ? "review" : "reviews"}
          </div>
        </div>
        
        <div className="flex-1 w-full">
          {/* Rating distribution bars would go here */}
          <div className="space-y-2 max-w-sm mx-auto sm:mx-0">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviewsArray.filter(r => Math.floor(r.rating) === rating).length;
              const percentage = reviewsArray.length > 0 
                ? (count / reviewsArray.length) * 100 
                : 0;
                
              return (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <div className="flex-shrink-0 w-3">{rating}</div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }} 
                    />
                  </div>
                  <div className="flex-shrink-0 w-6 text-muted-foreground">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Reviews List */}
      {sortedReviews.length > 0 ? (
        <div className="space-y-6">
          {sortedReviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.avatar} alt={review.name} />
                    <AvatarFallback>
                      {review.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{review.name}</h4>
                      {review.verified && (
                        <Badge variant="outline" className="h-5 text-xs bg-green-50 text-green-700 border-green-200">
                          <BadgeCheck className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 mt-1">
                      {renderRatingStars(review.rating)}
                    </div>
                    
                    {review.relationship && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {review.relationship}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {formatDate(review.date)}
                </div>
              </div>
              
              <div className="mt-3 text-sm">
                {review.comment}
              </div>
              
              <div className="mt-3 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs text-muted-foreground"
                  onClick={() => markAsHelpful(review.id)}
                  disabled={helpfulReviews.includes(review.id)}
                >
                  <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
                  Helpful ({review.helpfulCount + (helpfulReviews.includes(review.id) ? 1 : 0)})
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <Star className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-3" />
          <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">
            Be the first to share your experience working with {repName}
          </p>
          <Button 
            onClick={() => setReviewDialogOpen(true)}
            size="sm"
          >
            Write a Review
          </Button>
        </div>
      )}
    </div>
  );
}