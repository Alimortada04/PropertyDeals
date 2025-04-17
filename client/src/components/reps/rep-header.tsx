import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  MapPin, 
  Building, 
  ExternalLink, 
  CheckCircle, 
  Award, 
  Clock,
  Globe,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Twitter
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RepHeaderProps {
  rep: any;
  stats: any;
  socialLinks: any;
}

export default function RepHeader({ rep, stats, socialLinks }: RepHeaderProps) {
  // Calculate membership duration for badge display
  const memberSinceDate = rep.memberSince ? new Date(rep.memberSince) : null;
  const membershipDuration = memberSinceDate 
    ? formatDistanceToNow(memberSinceDate, { addSuffix: false }) 
    : null;
  
  // Default banner if not provided
  const defaultBanner = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80";
  
  // Default avatar if not provided
  const defaultAvatar = "https://via.placeholder.com/150?text=REP";
  
  // Social media icons mapping
  const socialMediaIcons = {
    website: <Globe className="h-5 w-5" />,
    linkedin: <Linkedin className="h-5 w-5" />,
    instagram: <Instagram className="h-5 w-5" />,
    facebook: <Facebook className="h-5 w-5" />,
    youtube: <Youtube className="h-5 w-5" />,
    twitter: <Twitter className="h-5 w-5" />
  };

  return (
    <div className="w-full">
      {/* Banner */}
      <div 
        className="w-full h-60 md:h-80 rounded-lg bg-cover bg-center mb-16 md:mb-20 relative"
        style={{ 
          backgroundImage: `url(${rep.banner || defaultBanner})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        {/* Avatar (overlapping the banner) */}
        <div className="absolute -bottom-16 md:-bottom-20 left-8 md:left-12">
          <div className="relative">
            <img 
              src={rep.avatar || defaultAvatar} 
              alt={rep.name} 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-background shadow-lg"
            />
            {rep.verified && (
              <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1">
                <CheckCircle className="h-6 w-6" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile information */}
      <div className="pl-2 md:pl-4 mt-20 flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          {/* Name and role */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{rep.name}</h1>
            <span className="text-lg text-muted-foreground">{rep.title}</span>
          </div>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {rep.pdCertified && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                PD Certified
              </Badge>
            )}
            
            {rep.topRep && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-medium">
                <Award className="h-3.5 w-3.5 mr-1.5" />
                Top REP
              </Badge>
            )}
            
            {membershipDuration && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                Member for {membershipDuration}
              </Badge>
            )}
          </div>
          
          {/* Location and company */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 text-muted-foreground mb-4">
            {rep.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{rep.location}</span>
              </div>
            )}
            
            {rep.company && (
              <div className="flex items-center gap-1.5">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{rep.company}</span>
                {rep.companyUrl && (
                  <a 
                    href={rep.companyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    <ExternalLink className="h-3.5 w-3.5 ml-1" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Social links */}
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <TooltipProvider>
            {Object.entries(socialLinks || {}).map(([platform, url]) => {
              if (!url || typeof url !== 'string') return null;
              
              const icon = socialMediaIcons[platform.toLowerCase()] || <Globe className="h-5 w-5" />;
              
              return (
                <Tooltip key={platform}>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full"
                      asChild
                    >
                      <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`${platform}`}>
                        {icon}
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{platform.charAt(0).toUpperCase() + platform.slice(1)}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </div>
      
      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-4 bg-muted rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold">{stats?.dealsClosed || 0}</div>
          <div className="text-muted-foreground text-sm">Deals Closed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{stats?.activeListings || 0}</div>
          <div className="text-muted-foreground text-sm">Active Listings</div>
        </div>
        <div className="text-center">
          <div className="flex justify-center items-center gap-1">
            <span className="text-2xl font-bold">{parseFloat(stats?.rating || "0").toFixed(1)}</span>
            <span className="text-yellow-500">★</span>
          </div>
          <div className="text-muted-foreground text-sm">{stats?.reviewCount || 0} Reviews</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{stats?.responseRate || 0}%</div>
          <div className="text-muted-foreground text-sm">Response Rate</div>
        </div>
      </div>
    </div>
  );
}