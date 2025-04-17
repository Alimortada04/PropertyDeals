import { Rep } from "@/lib/rep-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { Link } from "wouter";

interface RepCardProps {
  rep: Rep;
  similarityReason?: string; // Why this REP is recommended (optional)
}

export default function RepCard({ rep, similarityReason }: RepCardProps) {
  // Calculate avatar initials from name
  const initials = rep.name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase();

  // Format location for display
  const location = `${rep.location.city}, ${rep.location.state}`;

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200 border-gray-200">
      <CardContent className="pt-6 pb-2 flex-grow">
        <div className="flex flex-col items-center mb-3">
          <Avatar className="h-16 w-16 mb-3">
            <AvatarImage src={rep.avatar} alt={rep.name} />
            <AvatarFallback className="text-lg font-bold">{initials}</AvatarFallback>
          </Avatar>
          
          <h3 className="font-medium text-center text-base">{rep.name}</h3>
          
          <div className="flex items-center gap-1 mt-1">
            {rep.isFeatured && (
              <Badge className="bg-[#09261E] text-[10px] h-4 px-1 gap-0.5">
                <BadgeCheck className="h-2.5 w-2.5" />
                <span>Verified</span>
              </Badge>
            )}
            
            <Badge variant="outline" className="text-xs h-4 px-1.5 border-[#803344]/30 text-[#803344]">
              {rep.role}
            </Badge>
          </div>
          
          <div className="flex items-center text-gray-600 text-xs mt-2">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{location}</span>
          </div>
          
          <div className="flex items-center mt-1.5">
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            <span className="ml-1 text-xs text-amber-500 font-medium">{rep.rating.toFixed(1)}</span>
            <span className="ml-1 text-[10px] text-gray-500">({rep.reviewCount})</span>
          </div>
        </div>
        
        {similarityReason && (
          <div className="text-xs text-gray-500 text-center mt-2 px-2">
            {similarityReason}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 pb-4">
        <Link href={`/reps/${rep.id}`}>
          <Button 
            variant="outline" 
            className="w-full text-sm h-8 border-[#09261E] text-[#09261E] hover:bg-[#09261E]/5"
          >
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}