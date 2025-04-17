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
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:translate-y-[-4px] group"
      onClick={handleCardClick}
    >
      <div className="relative">
        {/* Desktop Verified badge */}
        {rep.isVerified && (
          <div className="absolute top-2 left-2 z-10 hidden sm:block">
            <Badge className="bg-[#803344] text-white border-0 px-2 py-1 text-xs flex items-center gap-1">
              <CheckCircle2 size={12} />
              Verified
            </Badge>
          </div>
        )}
        
        {/* Desktop Featured badge */}
        {rep.isFeatured && (
          <div className="absolute top-2 right-2 z-10 hidden sm:block">
            <Badge className="bg-[#09261E] text-white border-0 px-2 py-1 text-xs flex items-center gap-1">
              <Award size={12} />
              Featured
            </Badge>
          </div>
        )}
      </div>
        
      <CardContent className="p-4 sm:p-6">
        {/* Desktop layout - vertical */}
        <div className="hidden sm:flex flex-col items-center">
          {/* Profile Image - centered on desktop */}
          <div className="mb-3">
            <img 
              src={isBusiness ? (rep.logoUrl || rep.avatar) : rep.avatar} 
              alt={rep.name}
              className={`${isBusiness ? 'w-20 h-20 rounded-lg' : 'w-24 h-24 rounded-full'} object-cover border-2 border-white shadow-md transition-all duration-300 group-hover:scale-[1.05] group-hover:shadow-lg`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = isBusiness 
                  ? "https://placehold.co/200x200/e6e6e6/803344?text=Business"
                  : "https://randomuser.me/api/portraits/lego/1.jpg";
              }}
            />
          </div>
          
          {/* Desktop: Content area - centered */}
          <div className="text-center">
            <h3 className="font-heading text-xl font-semibold text-gray-800 mb-1 line-clamp-1">
              {rep.name}
              {rep.isVerified && (
                <span className="inline-block ml-1 text-[#803344]">
                  <PdLogo />
                </span>
              )}
            </h3>
            
            <Badge 
              variant="outline" 
              className="mb-2 bg-[#E59F9F]/10 text-[#803344] border-[#E59F9F] font-medium"
            >
              {rep.role}
            </Badge>
          
            {/* Desktop: Rating and info section */}
            <div className="flex flex-col w-full mb-3 text-sm">
              <div className="flex items-center justify-center text-gray-700 w-full mb-2">
                <Star size={16} className="mr-1 text-amber-500 flex-shrink-0 fill-amber-500" />
                <span className="truncate font-medium">{rep.rating} ({rep.reviewCount})</span>
                
                {rep.dealsCompleted && (
                  <div className="flex items-center text-gray-700 ml-2">
                    <Home size={14} className="mr-1 text-gray-500 flex-shrink-0" />
                    <span className="truncate font-medium">{rep.dealsCompleted}+ Deals</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-center text-gray-600 w-full mb-2">
                <MapPin size={14} className="mr-1 text-gray-400 flex-shrink-0" />
                <span className="truncate">{rep.locationCity}, {rep.locationState}</span>
              </div>
              
              {rep.responseTime && (
                <div className="flex items-center justify-center text-gray-600 w-full mb-2">
                  <Clock size={14} className="mr-1 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{rep.responseTime}</span>
                </div>
              )}
              
              {isBusiness ? (
                <div className="flex items-center justify-center text-gray-600 w-full">
                  <Building2 size={14} className="mr-1 text-gray-400 flex-shrink-0" />
                  <span className="truncate">Since {rep.foundedYear || 'N/A'}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center text-gray-600 w-full">
                  <Briefcase size={14} className="mr-1 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{rep.yearsExperience || '0'}+ Years</span>
                </div>
              )}
            </div>
            
            {/* Bio */}
            <p className="text-gray-600 text-sm mb-2 line-clamp-2 text-center">
              {rep.bio?.substring(0, 100)}...
            </p>
          </div>
        </div>
        
        {/* Mobile layout - horizontal (similar to connections) */}
        <div className="sm:hidden">
          {/* Status icons at top */}
          <div className="flex items-center gap-2 mb-3 mt-2">
            {rep.isVerified && (
              <CheckCircle2 size={16} className="text-[#803344]" />
            )}
            
            {rep.isFeatured && (
              <Award size={16} className="text-[#09261E]" />
            )}
          </div>
          
          {/* Main content row */}
          <div className="flex items-center space-x-3 relative py-4">
            {/* Profile Image - Left on mobile, vertically centered */}
            <div className="flex-shrink-0 my-auto flex items-center justify-center">
              <img 
                src={isBusiness ? (rep.logoUrl || rep.avatar) : rep.avatar} 
                alt={rep.name}
                className={`${isBusiness ? 'w-14 h-14 rounded-lg' : 'w-14 h-14 rounded-full'} object-cover border-2 border-white shadow-md`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = isBusiness 
                    ? "https://placehold.co/200x200/e6e6e6/803344?text=Business"
                    : "https://randomuser.me/api/portraits/lego/1.jpg";
                }}
              />
            </div>
            
            {/* Middle: Name, job tag, and location */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="font-heading text-base font-semibold text-gray-800 mb-1 line-clamp-1">
                {rep.name}
              </h3>
              
              <Badge 
                variant="outline" 
                className="mb-1.5 bg-[#E59F9F]/10 text-[#803344] border-[#E59F9F] font-medium text-xs w-fit"
              >
                {rep.role}
              </Badge>
              
              <div className="flex items-center text-gray-600 text-xs">
                <MapPin size={12} className="mr-1 text-gray-400 flex-shrink-0" />
                <span className="truncate">{rep.locationCity}, {rep.locationState}</span>
              </div>
            </div>
            
            {/* Top right: Rating - positioned at very top */}
            <div className="absolute top-[-2px] right-0">
              <div className="flex items-center text-gray-700 text-xs">
                <Star size={12} className="mr-1 text-amber-500 flex-shrink-0 fill-amber-500" />
                <span className="font-medium">{rep.rating}</span>
              </div>
            </div>
            
            {/* Center right: Chevron */}
            <div className="flex items-center justify-center h-full">
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
          
          {/* Bottom section with mutual connections */}
          <div className="flex items-center pt-1 pb-3">
            <div className="flex -space-x-2">
              {/* Display mutual connections avatars - we'll show 3 sample ones here */}
              <Avatar className="h-6 w-6 border-2 border-white">
                <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" />
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <Avatar className="h-6 w-6 border-2 border-white">
                <AvatarImage src="https://randomuser.me/api/portraits/women/2.jpg" />
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <Avatar className="h-6 w-6 border-2 border-white">
                <AvatarImage src="https://randomuser.me/api/portraits/men/3.jpg" />
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              
              {/* More indicator if needed */}
              <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                +2
              </div>
            </div>
            <span className="text-xs text-gray-500 ml-2">5 mutuals</span>
          </div>
        </div>
        
        {/* Last Active - Desktop only */}
        {rep.lastActive && (
          <div className="hidden sm:block text-xs text-gray-500 text-center mt-1">
            {getLastActiveText()}
          </div>
        )}
      </CardContent>

      {/* Bottom CTA Section - Desktop only */}
      <CardFooter className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0 hidden sm:flex gap-2">
        {/* Message button */}
        <Button 
          variant="outline"
          size="sm"
          className="flex-1 text-[#09261E] border-[#09261E] hover:bg-[#09261E] hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Open message dialog
          }}
        >
          <MessageCircle size={16} className="mr-1" />
          Message
        </Button>
        
        <Button 
          size="sm"
          className="flex-1 bg-[#09261E] hover:bg-[#135341] text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            if (isBusiness) {
              setLocation(`/business/${rep.slug}`);
            } else {
              // Navigate to the individual REP profile page
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