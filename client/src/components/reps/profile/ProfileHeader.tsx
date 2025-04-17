import { Rep } from "@/lib/rep-data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  ArrowLeft,
  Star, 
  Award, 
  Share2, 
  Linkedin, 
  Instagram, 
  Facebook, 
  Twitter, 
  Globe,
  Youtube,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check
} from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ProfileHeaderProps {
  rep: Rep;
}

export default function ProfileHeader({ rep }: ProfileHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  
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
    
  // Extract domain from website for display
  const websiteDomain = rep.website ? 
    new URL(rep.website).hostname.replace('www.', '') : 
    (rep.social?.website ? new URL(rep.social.website).hostname.replace('www.', '') : '');
    
  const copyProfileLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="w-full">
      {/* Back Button - Mobile only, absolute positioned */}
      <Button 
        variant="ghost" 
        onClick={() => window.history.back()}
        className="absolute top-4 left-4 z-10 md:hidden bg-white/80 hover:bg-white/90 rounded-full h-10 w-10 p-0"
        size="icon"
      >
        <ArrowLeft size={20} />
      </Button>
      
      {/* Back Button - Desktop only */}
      <div className="hidden md:block absolute top-4 left-12 z-10">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="bg-white/80 hover:bg-white/90 text-gray-800"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to REPs
        </Button>
      </div>
      
      {/* Banner Image - Flush with top of page and thicker */}
      <div className="w-full h-60 overflow-hidden relative">
        <img
          src={rep.bannerUrl || "https://images.pexels.com/photos/7031406/pexels-photo-7031406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
          alt={rep.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-4">
        {/* Profile Information Section - Using LinkedIn style */}
        <div className="relative -mt-16 pb-4">
          {/* Avatar & Name */}
          <div className="flex flex-col items-start">
            <Avatar className={`h-32 w-32 ${avatarBorderClass} border-white bg-white shadow-md`}>
              <AvatarImage src={rep.avatar} alt={rep.name} />
              <AvatarFallback className={avatarBorderClass.replace('border-4', '')}>
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="mt-4 w-full">
              <div className="flex justify-between items-start">
                <div>
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
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 mt-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{rep.location.city}, {rep.location.state}</span>
                    </div>
                    
                    {(rep.website || rep.social?.website) && (
                      <a href={rep.website || rep.social?.website} target="_blank" rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline flex items-center">
                        <Globe className="h-4 w-4 mr-1" />
                        <span>{websiteDomain}</span>
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center mt-2 text-gray-600">
                    <Award className="h-4 w-4 mr-1" />
                    <span>{rep.yearsExperience}+ years experience</span>
                  </div>
                </div>
                
                {/* Social Links and Action Buttons - Colored by brand */}
                <div className="hidden md:block">
                  <div className="flex gap-2 mt-1">
                    {rep.social?.linkedin && (
                      <a href={rep.social.linkedin} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0 text-[#0077B5] hover:text-[#0077B5] hover:bg-[#0077B5]/10 border-[#0077B5]/30">
                          <Linkedin className="h-5 w-5" />
                        </Button>
                      </a>
                    )}
                    
                    {rep.social?.instagram && (
                      <a href={rep.social.instagram} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0 text-[#E1306C] hover:text-[#E1306C] hover:bg-[#E1306C]/10 border-[#E1306C]/30">
                          <Instagram className="h-5 w-5" />
                        </Button>
                      </a>
                    )}
                    
                    {rep.social?.facebook && (
                      <a href={rep.social.facebook} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0 text-[#1877F2] hover:text-[#1877F2] hover:bg-[#1877F2]/10 border-[#1877F2]/30">
                          <Facebook className="h-5 w-5" />
                        </Button>
                      </a>
                    )}
                    
                    {rep.social?.twitter && (
                      <a href={rep.social.twitter} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0 text-[#1DA1F2] hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 border-[#1DA1F2]/30">
                          <Twitter className="h-5 w-5" />
                        </Button>
                      </a>
                    )}
                  </div>
                  
                  {/* Connect & Share Buttons */}
                  <div className="flex mt-3 gap-2">
                    <Button className="bg-[#09261E] hover:bg-[#135341]">
                      <Star className="mr-2 h-4 w-4" />
                      <span>Connect</span>
                    </Button>
                    
                    <Popover open={shareOpen} onOpenChange={setShareOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="h-10 w-10">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="end">
                        <div className="p-4 border-b">
                          <h3 className="font-medium">Share this profile</h3>
                          <p className="text-sm text-gray-500 mt-1">Copy the link or share to social media</p>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 text-[#0077B5] hover:text-[#0077B5] hover:bg-[#0077B5]/10"
                              onClick={() => {
                                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                                setShareOpen(false);
                              }}
                            >
                              <Linkedin className="h-4 w-4 mr-2" />
                              LinkedIn
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 text-[#1DA1F2] hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10"
                              onClick={() => {
                                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check out ${rep.name} on PropertyDeals`, '_blank');
                                setShareOpen(false);
                              }}
                            >
                              <Twitter className="h-4 w-4 mr-2" />
                              Twitter
                            </Button>
                          </div>
                          <div className="flex border rounded-md overflow-hidden">
                            <div className="bg-gray-50 p-2 flex-1 text-gray-500 text-sm truncate">
                              {window.location.href}
                            </div>
                            <Button 
                              variant="ghost" 
                              className="rounded-none h-10" 
                              onClick={copyProfileLink}
                            >
                              {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Social Links and Buttons */}
          <div className="flex flex-col md:hidden gap-2 mt-4 border-t pt-4">
            <div className="flex gap-2">
              {rep.social?.linkedin && (
                <a href={rep.social.linkedin} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-[#0077B5] hover:text-[#0077B5] hover:bg-[#0077B5]/10 border-[#0077B5]/30">
                    <Linkedin className="h-4 w-4 mr-1.5" />
                    LinkedIn
                  </Button>
                </a>
              )}
              
              {rep.social?.instagram && (
                <a href={rep.social.instagram} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-[#E1306C] hover:text-[#E1306C] hover:bg-[#E1306C]/10 border-[#E1306C]/30">
                    <Instagram className="h-4 w-4 mr-1.5" />
                    Instagram
                  </Button>
                </a>
              )}
              
              {rep.social?.facebook && (
                <a href={rep.social.facebook} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-[#1877F2] hover:text-[#1877F2] hover:bg-[#1877F2]/10 border-[#1877F2]/30">
                    <Facebook className="h-4 w-4 mr-1.5" />
                    Facebook
                  </Button>
                </a>
              )}
            </div>
            
            {/* Connect & Share Buttons for Mobile */}
            <div className="flex mt-3 gap-2">
              <Button className="flex-1 bg-[#09261E] hover:bg-[#135341]">
                <Star className="mr-2 h-4 w-4" />
                <span>Connect</span>
              </Button>
              
              <Popover open={shareOpen} onOpenChange={setShareOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="mr-2 h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b">
                    <h3 className="font-medium">Share this profile</h3>
                    <p className="text-sm text-gray-500 mt-1">Copy the link or share to social media</p>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-[#0077B5] hover:text-[#0077B5] hover:bg-[#0077B5]/10"
                        onClick={() => {
                          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                          setShareOpen(false);
                        }}
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-[#1DA1F2] hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10"
                        onClick={() => {
                          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check out ${rep.name} on PropertyDeals`, '_blank');
                          setShareOpen(false);
                        }}
                      >
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </Button>
                    </div>
                    <div className="flex border rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-2 flex-1 text-gray-500 text-sm truncate">
                        {window.location.href}
                      </div>
                      <Button 
                        variant="ghost" 
                        className="rounded-none h-10" 
                        onClick={copyProfileLink}
                      >
                        {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}