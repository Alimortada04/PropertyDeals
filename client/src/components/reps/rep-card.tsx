import { useState } from "react";
import { useLocation } from "wouter";
import { Rep } from "@/lib/rep-data";
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
  Briefcase
} from "lucide-react";

interface RepCardProps {
  rep: Rep;
}

export default function RepCard({ rep }: RepCardProps) {
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  
  const repTypeLabels = {
    'seller': 'Seller',
    'contractor': 'Contractor',
    'agent': 'Agent',
    'lender': 'Lender',
    'appraiser': 'Appraiser',
    'inspector': 'Inspector',
    'mover': 'Mover',
    'landscaper': 'Landscaper'
  };
  
  const isBusiness = rep.entityType === "business";
  
  const handleCardClick = () => {
    if (isBusiness) {
      setLocation(`/business/${rep.slug}`);
    } else {
      // Temporarily redirect to reps page until new profile page is implemented
      setLocation('/reps');
      // TODO: Implement new REP profile page and restore this:
      // setLocation(`/rep/${rep.slug}`);
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
      {/* Top Section */}
      <div className="relative">
        {/* Featured badge */}
        {rep.isFeatured && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-[#09261E] text-white border-0 px-2 py-1 text-xs flex items-center gap-1">
              <Award size={12} />
              Featured
            </Badge>
          </div>
        )}
        
        {/* Verified badge */}
        {rep.isVerified && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-[#803344] text-white border-0 px-2 py-1 text-xs flex items-center gap-1">
              <CheckCircle2 size={12} />
              Verified
            </Badge>
          </div>
        )}
        
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            {/* Profile Image / Logo */}
            <div className="relative mb-4">
              <div>
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
            </div>
            
            {/* Name and Profession */}
            <div className="text-center mb-4">
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
                {repTypeLabels[rep.type]}
              </Badge>
            </div>
            
            {/* Quick Info Block */}
            <div className="grid grid-cols-2 gap-3 w-full mb-3 text-sm">
              <div className="flex items-center text-gray-600">
                <MapPin size={14} className="mr-1 text-gray-400 flex-shrink-0" />
                <span className="truncate">{rep.location.city}, {rep.location.state}</span>
              </div>
              
              {rep.responseTime && (
                <div className="flex items-center text-gray-600 justify-end">
                  <Clock size={14} className="mr-1 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{rep.responseTime}</span>
                </div>
              )}
              
              {isBusiness ? (
                <div className="flex items-center text-gray-600">
                  <Building2 size={14} className="mr-1 text-gray-400 flex-shrink-0" />
                  <span className="truncate">Since {rep.foundedYear}</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-600">
                  <Briefcase size={14} className="mr-1 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{rep.yearsExperience || '5'}+ Years</span>
                </div>
              )}
              
              <div className="flex items-center justify-between col-span-2">
                {rep.rating && (
                  <div className="flex items-center text-gray-700">
                    <Star size={16} className="mr-1 text-amber-500 flex-shrink-0 fill-amber-500" />
                    <span className="truncate font-medium">{rep.rating.score} ({rep.rating.reviewCount})</span>
                  </div>
                )}
                
                {rep.dealsCompleted && (rep.type === "seller" || rep.type === "agent") && (
                  <div className="flex items-center text-gray-700">
                    <Home size={14} className="mr-1 text-gray-500 flex-shrink-0" />
                    <span className="truncate font-medium">{rep.dealsCompleted}+ Deals</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Tagline */}
            <p className="text-gray-600 text-sm mb-2 line-clamp-2 text-center">
              {rep.tagline}
            </p>
          </div>
          
          {/* Last Active */}
          {rep.lastActive && (
            <div className="text-xs text-gray-500 text-center mt-1">
              {getLastActiveText()}
            </div>
          )}
        </CardContent>
      </div>

      {/* Bottom CTA Section */}
      <CardFooter className="px-4 pb-4 pt-0 flex gap-2">
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
              // Temporarily redirect to reps page until new profile page is implemented
              setLocation('/reps');
              // TODO: Implement new REP profile page and restore this:
              // setLocation(`/rep/${rep.slug}`);
            }
          }}
        >
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}