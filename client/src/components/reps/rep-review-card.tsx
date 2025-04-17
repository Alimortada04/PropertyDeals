import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Calendar, ThumbsUp } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

interface Review {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  propertyId?: number;
  propertyAddress?: string;
}

interface RepReviewCardProps {
  review: Review;
}

export default function RepReviewCard({ review }: RepReviewCardProps) {
  // Format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <Card className="border border-gray-100 hover:shadow-sm transition-all">
      <CardContent className="p-4">
        <div className="flex flex-col">
          {/* Review Header */}
          <div className="flex justify-between items-start mb-3">
            {/* User Info */}
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={review.userAvatar} alt={review.userName} />
                <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/user/${review.userId}`} className="font-medium text-gray-900 hover:text-[#135341] hover:underline block">
                  {review.userName}
                </Link>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar size={12} className="mr-1" />
                  {formatDate(review.date)}
                </div>
              </div>
            </div>
            
            {/* Rating */}
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={i < Math.floor(review.rating) ? "text-amber-500 fill-amber-500" : "text-gray-300"} 
                />
              ))}
            </div>
          </div>
          
          {/* Review Content */}
          <p className="text-sm text-gray-600 mb-3">
            {review.comment}
          </p>
          
          {/* Property Referenced (if available) */}
          {review.propertyId && review.propertyAddress && (
            <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 mb-3">
              <span className="block">Review for property:</span>
              <Link href={`/p/${review.propertyId}`} className="text-[#135341] hover:underline">
                {review.propertyAddress}
              </Link>
            </div>
          )}
          
          {/* Helpful Button */}
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-gray-700">
              <ThumbsUp size={14} className="mr-1" />
              Helpful ({review.helpful})
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}