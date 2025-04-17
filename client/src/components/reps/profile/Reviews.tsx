import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
}

interface ReviewsProps {
  reviews: Review[];
}

export default function Reviews({ reviews }: ReviewsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "highest">("newest");
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);
  
  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  
  // Sort reviews based on selected order
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.rating - a.rating;
    }
  });
  
  return (
    <section id="reviews" className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-heading font-bold text-gray-800">
              Reviews
              <span className="ml-2 text-lg text-gray-500">{reviews.length}</span>
            </h2>
            
            {reviews.length > 0 && (
              <div className="flex items-center mt-1">
                <div className="flex items-center mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      size={18}
                      className={cn(
                        "text-gray-300 fill-gray-300",
                        star <= Math.round(averageRating) && "text-amber-500 fill-amber-500"
                      )}
                    />
                  ))}
                </div>
                <span className="text-gray-700 font-medium">
                  {averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-3">
            <Select
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value as "newest" | "highest")}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="highest">Top Rated</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={() => setWriteReviewOpen(true)}
              className="bg-[#09261E] hover:bg-[#135341]"
            >
              Write a Review
            </Button>
          </div>
        </div>
        
        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedReviews.map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>
        ) : (
          <Card className="bg-white rounded-xl overflow-hidden shadow-sm">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    size={24}
                    className="text-gray-300"
                  />
                ))}
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Reviews Yet</h3>
              <p className="text-gray-500 max-w-md mb-4">
                Be the first to leave a review for this REP and help others in the community.
              </p>
              <Button 
                className="bg-[#09261E] hover:bg-[#135341] text-white"
                onClick={() => setWriteReviewOpen(true)}
              >
                Write First Review
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Write Review Modal */}
        <Dialog open={writeReviewOpen} onOpenChange={setWriteReviewOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-heading">Write a Review</DialogTitle>
              <DialogDescription>
                Share your experience with this REP to help others in the community.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none transition-colors"
                    // onClick when implementing functionality
                  >
                    <StarIcon
                      size={32}
                      className="text-gray-300 hover:text-amber-500 hover:fill-amber-500"
                    />
                  </button>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="review-text">Your Review</Label>
                <Textarea 
                  id="review-text" 
                  placeholder="Share your experience working with this REP..."
                  rows={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Deal Reference (Optional)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a deal you worked on together" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None - General Review</SelectItem>
                    {/* Deal options would be populated here */}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setWriteReviewOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-[#09261E] hover:bg-[#135341]">
                Submit Review
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <a href={`/reps/${review.reviewerId}`} className="flex-shrink-0">
            <img
              src={review.reviewerAvatar}
              alt={review.reviewerName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://randomuser.me/api/portraits/lego/1.jpg";
              }}
            />
          </a>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <a 
                href={`/reps/${review.reviewerId}`}
                className="font-medium text-gray-800 hover:text-[#09261E]"
              >
                {review.reviewerName}
              </a>
              
              <div className="flex items-center mt-1 md:mt-0">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    size={16}
                    className={cn(
                      "text-gray-300 fill-gray-300",
                      star <= review.rating && "text-amber-500 fill-amber-500"
                    )}
                  />
                ))}
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(review.date)}
            </p>
            
            {review.dealId && review.dealTitle && (
              <div className="mt-1 mb-2">
                <a 
                  href={`/p/${review.dealId}`}
                  className="text-xs px-2 py-1 bg-[#09261E]/10 rounded-full text-[#09261E] inline-block"
                >
                  Deal: {review.dealTitle}
                </a>
              </div>
            )}
            
            <p className="text-gray-700 mt-2">
              {review.text}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}