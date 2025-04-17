import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rep } from "@/lib/rep-data";
import { 
  CheckCircle2, 
  MapPin, 
  Trophy, 
  Clock, 
  Phone, 
  Mail, 
  MessageCircle,
  Linkedin, 
  Instagram, 
  Globe, 
  Youtube,
  Bookmark,
  Share2
} from "lucide-react";

interface ProfileHeaderProps {
  rep: Rep;
}

export default function ProfileHeader({ rep }: ProfileHeaderProps) {
  // Calculate membership duration
  const getMembershipDuration = () => {
    if (!rep.memberSince) return "New Member";
    
    const memberSince = new Date(rep.memberSince);
    const now = new Date();
    const diffMonths = (now.getFullYear() - memberSince.getFullYear()) * 12 + 
                      now.getMonth() - memberSince.getMonth();
    
    if (diffMonths < 1) return "New Member";
    if (diffMonths < 12) return `Member for ${diffMonths} month${diffMonths !== 1 ? 's' : ''}`;
    
    const years = Math.floor(diffMonths / 12);
    return `Member for ${years} year${years !== 1 ? 's' : ''}`;
  };
  
  // Last active text
  const getLastActiveText = () => {
    if (!rep.lastActive) return null;
    
    const lastActive = new Date(rep.lastActive);
    const now = new Date();
    const diffMs = now.getTime() - lastActive.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return diffMins <= 5 ? 'Active now' : `Last active ${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `Last active ${diffHours}h ago`;
    } else {
      return `Last active ${diffDays}d ago`;
    }
  };

  return (
    <div className="relative">
      {/* Banner Image */}
      <div 
        className="w-full h-48 md:h-64 bg-gradient-to-r from-[#09261E]/90 to-[#803344]/80 relative overflow-hidden"
        style={{
          backgroundImage: rep.bannerUrl ? `url(${rep.bannerUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
      </div>
      
      {/* Profile Section (overlapping the banner) */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-20 pb-6 flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar Image (circular, overlapping banner) */}
          <div className="z-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
              <img 
                src={rep.avatar} 
                alt={rep.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://randomuser.me/api/portraits/lego/1.jpg";
                }}
              />
            </div>
          </div>
          
          {/* Identity Information */}
          <div className="flex-1 pt-4 md:pt-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                {/* Name, Title, Badges, etc. */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-800">
                    {rep.name}
                  </h1>
                  
                  <Badge variant="outline" className="bg-[#E59F9F]/10 text-[#803344] border-[#E59F9F] font-medium">
                    {rep.type.charAt(0).toUpperCase() + rep.type.slice(1)}
                  </Badge>
                  
                  {rep.isVerified && (
                    <Badge className="bg-[#803344] text-white border-0 ml-1 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      PD Certified
                    </Badge>
                  )}
                  
                  {rep.isFeatured && (
                    <Badge className="bg-amber-500 text-white border-0 ml-1 flex items-center gap-1">
                      <Trophy size={12} />
                      Top REP
                    </Badge>
                  )}
                </div>
                
                {/* Metadata Row */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1 text-gray-400" />
                    <span>{rep.location.city}, {rep.location.state}</span>
                  </div>
                  
                  {rep.memberSince && (
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1 text-gray-400" />
                      <span>{getMembershipDuration()}</span>
                    </div>
                  )}
                  
                  {rep.lastActive && (
                    <div className="flex items-center text-[#09261E] font-medium">
                      <span>{getLastActiveText()}</span>
                    </div>
                  )}
                </div>
                
                {/* Business name if available */}
                {rep.businessName && (
                  <div className="text-gray-700 font-medium mb-3">
                    Business: <a href="#" className="text-[#09261E] hover:underline">{rep.businessName}</a>
                  </div>
                )}
                
                {/* Social Links */}
                <div className="flex gap-2 mb-4">
                  {rep.social?.linkedin && (
                    <a href={rep.social.linkedin} target="_blank" rel="noopener noreferrer" 
                       className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-[#0077B5] hover:text-white transition-colors">
                      <Linkedin size={16} />
                    </a>
                  )}
                  {rep.social?.instagram && (
                    <a href={rep.social.instagram} target="_blank" rel="noopener noreferrer"
                       className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gradient-to-tr from-[#f79334] via-[#bc2a8d] to-[#4c68d7] hover:text-white transition-colors">
                      <Instagram size={16} />
                    </a>
                  )}
                  {rep.social?.website && (
                    <a href={rep.social.website} target="_blank" rel="noopener noreferrer"
                       className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-800 hover:text-white transition-colors">
                      <Globe size={16} />
                    </a>
                  )}
                  {rep.social?.youtube && (
                    <a href={rep.social.youtube} target="_blank" rel="noopener noreferrer"
                       className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-red-600 hover:text-white transition-colors">
                      <Youtube size={16} />
                    </a>
                  )}
                </div>
                
                {/* Tagline */}
                <p className="text-gray-600 max-w-2xl">
                  {rep.tagline}
                </p>
              </div>
              
              {/* Contact Actions - Right Side */}
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <Button 
                  size="lg" 
                  className="bg-[#09261E] hover:bg-[#135341] w-full md:w-auto transition-all duration-300 flex items-center gap-2"
                >
                  <MessageCircle size={18} />
                  Message
                </Button>
                
                <div className="flex gap-2 w-full">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 text-[#09261E] border-[#09261E] hover:bg-[#09261E]/10 transition-colors flex items-center gap-1"
                  >
                    <Phone size={16} />
                    {rep.phone ? 'Call' : 'No Phone'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 text-[#09261E] border-[#09261E] hover:bg-[#09261E]/10 transition-colors flex items-center gap-1"
                  >
                    <Mail size={16} />
                    Email
                  </Button>
                </div>
                
                <div className="flex gap-2 w-full">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex-1 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <Bookmark size={16} className="text-gray-500" />
                    <span className="text-xs">Save</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex-1 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <Share2 size={16} className="text-gray-500" />
                    <span className="text-xs">Share</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}