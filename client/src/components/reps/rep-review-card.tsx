import React from 'react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from 'lucide-react';

interface Author {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

interface Review {
  id: number;
  rating: number;
  text: string;
  date: string;
  author: Author;
}

interface RepReviewCardProps {
  review: Review;
}

export default function RepReviewCard({ review }: RepReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star 
        key={index} 
        size={16} 
        className={index < rating 
          ? "text-amber-500 fill-amber-500" 
          : "text-gray-300"
        }
      />
    ));
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Author Avatar */}
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.author.avatar} alt={review.author.name} />
            <AvatarFallback>{review.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          
          {/* Review Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
              {/* Author Info */}
              <div>
                <h4 className="font-medium text-gray-900">{review.author.name}</h4>
                <p className="text-xs text-gray-500">{review.author.role}</p>
              </div>
              
              {/* Date */}
              <div className="text-sm text-gray-500 mt-1 sm:mt-0">
                {formatDate(review.date)}
              </div>
            </div>
            
            {/* Rating Stars */}
            <div className="flex items-center my-2">
              {renderStars(review.rating)}
            </div>
            
            {/* Review Text */}
            <p className="text-gray-700 mt-2 text-sm">
              {review.text}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}