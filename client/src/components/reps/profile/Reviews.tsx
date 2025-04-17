import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Calendar, Home } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

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
  if (!reviews || reviews.length === 0) {
    return null;
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
  
  return (
    <div id="reviews" className="my-8 scroll-mt-24">
      <h2 className="text-2xl font-bold text-[#09261E] mb-4">
        Reviews <span className="text-base font-normal text-gray-500">({reviews.length})</span>
      </h2>
      
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
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}