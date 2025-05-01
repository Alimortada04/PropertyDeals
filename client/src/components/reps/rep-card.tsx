import { useState } from "react";
import { useLocation } from "wouter";
import { Rep as MockRep } from "@/lib/rep-data";
import { Rep } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  MessageCircle, 
  Star, 
  Clock, 
  Award, 
  CheckCircle2,
  Home, 
  Briefcase,
  ChevronRight
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RepCardProps {
  rep: Rep;
}

export default function RepCard({ rep }: RepCardProps) {
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  
  // Use the role field from the database
  const isBusiness = rep.entityType === "business";
  
  // Role labels
  const repTypeLabels: Record<string, string> = {
    'seller': 'Seller',
    'contractor': 'Contractor',
    'agent': 'Agent',
    'lender': 'Lender',
    'appraiser': 'Appraiser',
    'inspector': 'Inspector',
    'mover': 'Mover',
    'landscaper': 'Landscaper'
  };
  
  const handleCardClick = () => {
    if (isBusiness) {
      setLocation(`/business/${rep.slug}`);
    } else {
      // Navigate to the individual REP profile page
      setLocation(`/reps/${rep.id}`);
    }
  };

  // Calculate time since last active
  const getLastActiveText = () => {
    if (!rep.lastActive) return null;
    
    const lastActive = new Date(rep.lastActive);
    const now = new Date();
    const diffMs = now.getTime() - lastActive.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return diffMins <= 5 ? 'Active now' : `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  // Mini PD Logo component for verified badge
  const PdLogo = () => (
    <img 
      src="/images/pdlogo.png" 
      alt="PropertyDeals" 
      className="inline-block h-5 w-5 object-contain ml-1"
    />
  );

  return (
    <Card 
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:translate-y-[-4px] group h-full"
      onClick={handleCardClick}
    >
      {/* No badges at top, moved to inside card */}
        
      <CardContent className="p-3 flex flex-col">
        {/* Unified layout for all screen sizes */}
        <div className="flex flex-col items-center flex-grow">
          {/* Profile Image - centered */}
          <div className="mb-2">
            <img 
              src={isBusiness ? (rep.logoUrl || rep.avatar) : rep.avatar} 
              alt={rep.name}
              className={`${isBusiness ? 'w-16 h-16 rounded-lg' : 'w-16 h-16 rounded-full'} object-cover border-2 border-white shadow-md transition-all duration-300 group-hover:scale-[1.05] group-hover:shadow-lg`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = isBusiness 
                  ? "https://placehold.co/200x200/e6e6e6/803344?text=Business"
                  : "https://randomuser.me/api/portraits/lego/1.jpg";
              }}
            />
          </div>
          
          {/* Content area - centered */}
          <div className="text-center flex-grow flex flex-col">
            <h3 className="font-heading text-lg font-semibold text-gray-800 mb-1 line-clamp-2 flex items-center justify-center">
              <span className="text-center">{rep.name}</span>
              {rep.isVerified && (
                <CheckCircle2 size={16} className="ml-1 mt-1 text-[#803344] flex-shrink-0" />
              )}
            </h3>
            
            <Badge 
              variant="outline" 
              className="mb-1 bg-[#E59F9F]/10 text-[#803344] border-[#E59F9F] font-medium text-xs"
            >
              {rep.role}
            </Badge>
          
            {/* Location section only - simplified */}
            <div className="flex flex-col w-full mb-2 text-xs">              
              <div className="flex items-center justify-center text-gray-600 w-full">
                <MapPin size={12} className="mr-1 text-gray-400 flex-shrink-0" />
                <span className="truncate">{rep.locationCity}, {rep.locationState}</span>
              </div>
              
              {rep.responseTime && (
                <div className="flex items-center justify-center text-gray-600 w-full mt-1">
                  <Clock size={12} className="mr-1 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{rep.responseTime}</span>
                </div>
              )}
            </div>
            
            {/* Simplified Mutual connections - just show the count */}
            <div className="flex items-center justify-center text-xs text-gray-500 pt-0.5 pb-1 mt-auto">
              <div className="flex -space-x-2 mr-1">
                <Avatar className="h-5 w-5 border-2 border-white">
                  <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" />
                  <AvatarFallback>M</AvatarFallback>
                </Avatar>
                <Avatar className="h-5 w-5 border-2 border-white">
                  <AvatarImage src="https://randomuser.me/api/portraits/women/2.jpg" />
                  <AvatarFallback>M</AvatarFallback>
                </Avatar>
              </div>
              <span>5 mutuals</span>
            </div>
          </div>
        </div>
        
        {/* Last Active */}
        {rep.lastActive && (
          <div className="text-xs text-gray-500 text-center mt-1">
            {getLastActiveText()}
          </div>
        )}
      </CardContent>

      {/* Bottom CTA Section - View Profile button */}
      <CardFooter className="px-2 pb-2 pt-0 flex justify-center mt-auto">
        {/* View Profile button */}
        <Button 
          size="sm"
          className="w-full bg-[#09261E] hover:bg-[#135341] text-white transition-colors text-xs py-1.5"
          onClick={(e) => {
            e.stopPropagation();
            // Navigate to profile
            if (isBusiness) {
              setLocation(`/business/${rep.slug}`);
            } else {
              setLocation(`/reps/${rep.id}`);
            }
          }}
        >
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}