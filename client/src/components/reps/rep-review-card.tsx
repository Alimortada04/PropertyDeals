import React from 'react';
import { Link } from 'wouter';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex justify-between mb-3">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={review.author.avatar} alt={review.author.name} />
              <AvatarFallback>{review.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <Link href={`/reps/${review.author.id}`} className="font-medium hover:underline mr-2">
                  {review.author.name}
                </Link>
                <Badge variant="outline" className="text-xs bg-gray-50">
                  {review.author.role}
                </Badge>
              </div>
              <div className="flex mt-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {new Date(review.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric' 
            })}
          </div>
        </div>
        <p className="text-gray-700">{review.text}</p>
      </CardContent>
    </Card>
  );
}