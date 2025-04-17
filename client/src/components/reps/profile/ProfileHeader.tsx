import { Rep } from "@/lib/rep-data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Star, 
  Award, 
  Share2, 
  Linkedin, 
  Instagram, 
  Facebook, 
  Twitter, 
  Globe,
  Youtube
} from "lucide-react";

interface ProfileHeaderProps {
  rep: Rep;
}

export default function ProfileHeader({ rep }: ProfileHeaderProps) {
  const initials = rep.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const isBusinessAccount = rep.role.toLowerCase().includes('agency') || 
    rep.role.toLowerCase().includes('brokerage') || 
    rep.role.toLowerCase().includes('group') || 
    rep.role.toLowerCase().includes('associates');
    
  const avatarBorderClass = isBusinessAccount 
    ? "rounded-lg border-4" 
    : "rounded-full border-4";
    
  const memberSinceDate = rep.memberSince ? new Date(rep.memberSince) : null;
  const lastActiveDate = rep.lastActive ? new Date(rep.lastActive) : null;
  
  return (
    <div className="w-full">
      {/* Banner Image */}
      <div className="w-full h-60 md:h-72 lg:h-80 overflow-hidden relative">
        <img
          src={rep.bannerUrl || "https://images.pexels.com/photos/7031406/pexels-photo-7031406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
          alt={rep.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4">
        {/* Profile Information Section */}
        <div className="relative -mt-20 pb-5 flex flex-col md:flex-row">
          {/* Avatar & Name */}
          <div className="flex flex-col md:flex-row md:items-end">
            <Avatar className={`h-32 w-32 ${avatarBorderClass} border-white bg-white shadow-md`}>
              <AvatarImage src={rep.avatar} alt={rep.name} />
              <AvatarFallback className={avatarBorderClass.replace('border-4', '')}>
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="mt-4 md:mt-0 md:ml-6 md:mb-1">
              <h1 className="text-3xl md:text-4xl font-bold text-[#09261E]">{rep.name}</h1>
              
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge className="bg-[#803344] hover:bg-[#803344] text-white font-medium px-3 py-1">
                  {rep.role}
                </Badge>
                
                <div className="flex items-center text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500" />
                  <span className="ml-1 text-gray-800 font-medium">{rep.rating}</span>
                  <span className="ml-1 text-gray-600">({rep.reviewCount} reviews)</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Award className="h-4 w-4 mr-1" />
                  <span>{rep.yearsExperience}+ years experience</span>
                </div>
              </div>
              
              <div className="flex items-center mt-2 text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{rep.location.city}, {rep.location.state}</span>
              </div>
            </div>
          </div>
          
          {/* Connect Button - Desktop */}
          <div className="hidden md:flex mt-4 md:mt-0 md:ml-auto md:self-end">
            <Button className="bg-[#09261E] hover:bg-[#135341]">
              <Star className="mr-2 h-4 w-4" />
              <span>Connect</span>
            </Button>
            
            <Button variant="outline" className="ml-2" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Connect Button - Mobile */}
        <div className="md:hidden flex mt-4">
          <Button className="flex-1 bg-[#09261E] hover:bg-[#135341]">
            <Star className="mr-2 h-4 w-4" />
            <span>Connect</span>
          </Button>
          
          <Button variant="outline" className="ml-2" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Additional Info */}
        <div className="mt-6 flex flex-col md:flex-row">
          <div className="md:w-2/3 border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0 md:pr-6">
            {/* Specialties/Expertise */}
            <h3 className="text-lg font-semibold text-[#09261E] mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {(rep.specialties || []).map((specialty, index) => (
                <Badge key={index} variant="secondary" className="bg-gray-100">
                  {specialty}
                </Badge>
              ))}
            </div>
            
            {/* Profile Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Member Since</span>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="font-medium">{
                    memberSinceDate
                      ? memberSinceDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                      : 'N/A'
                  }</span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Last Active</span>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="font-medium">{
                    lastActiveDate
                      ? formatRelativeTime(lastActiveDate)
                      : 'N/A'
                  }</span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Response Time</span>
                <div className="flex items-center mt-1">
                  <span className="font-medium">{rep.responseTime || 'N/A'}</span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Reviews</span>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                  <span className="font-medium">{rep.rating} ({rep.reviewCount})</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Social Links & Contact */}
          <div className="md:w-1/3 pt-6 md:pt-0 md:pl-6">
            {/* Social Links */}
            <h3 className="text-lg font-semibold text-[#09261E] mb-2">Connect</h3>
            <div className="flex flex-wrap gap-3 mb-4">
              {rep.social?.linkedin && (
                <a href={rep.social.linkedin} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </a>
              )}
              
              {rep.social?.instagram && (
                <a href={rep.social.instagram} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                    <Instagram className="h-4 w-4" />
                  </Button>
                </a>
              )}
              
              {rep.social?.facebook && (
                <a href={rep.social.facebook} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                    <Facebook className="h-4 w-4" />
                  </Button>
                </a>
              )}
              
              {rep.social?.twitter && (
                <a href={rep.social.twitter} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </a>
              )}
              
              {rep.social?.youtube && (
                <a href={rep.social.youtube} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                    <Youtube className="h-4 w-4" />
                  </Button>
                </a>
              )}
              
              {rep.website || rep.social?.website && (
                <a href={rep.website || rep.social?.website} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                    <Globe className="h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>
            
            {/* Contact Info */}
            <div className="mt-4">
              {rep.contact?.phone && (
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium">Phone:</span>
                  <a href={`tel:${rep.contact.phone}`} className="ml-2 text-[#09261E] hover:underline">
                    {rep.contact.phone}
                  </a>
                </div>
              )}
              
              {rep.contact?.email && (
                <div className="flex items-center">
                  <span className="text-sm font-medium">Email:</span>
                  <a href={`mailto:${rep.contact.email}`} className="ml-2 text-[#09261E] hover:underline">
                    {rep.contact.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}