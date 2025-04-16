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
      setLocation(`/rep/${rep.slug}`);
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

  // Create a small PD logo for verified icon
  const PdLogo = () => (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block h-4 w-4">
      <path d="M4 3h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" fill="#803344" />
      <path d="M6 7.5h3.5c1 0 2.5.8 2.5 2.3 0 1.5-1.4 2.2-2.5 2.2H8v2H6V7.5zm3.5 3c.5 0 1-.3 1-.8 0-.4-.5-.7-1-.7H8v1.5h1.5z" fill="white" />
      <path d="M13 7.5h-1V14h1c2 0 3-1.5 3-3.25S15 7.5 13 7.5z" fill="white" />
    </svg>
  );

  return (
    <Card 
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100"
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
                  className={`${isBusiness ? 'w-20 h-20 rounded-lg' : 'w-24 h-24 rounded-full'} object-cover border-2 border-white shadow-md`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://randomuser.me/api/portraits/lego/1.jpg";
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
                
                {rep.dealsCompleted && rep.type === "seller" || rep.type === "agent" && (
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
              setLocation(`/rep/${rep.slug}`);
            }
          }}
        >
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}