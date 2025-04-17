import { useState, useEffect } from "react";
import { 
  MapPin, 
  Star, 
  Award, 
  Calendar, 
  Globe, 
  Home, 
  Users,
  Linkedin, 
  Instagram, 
  Facebook, 
  Twitter, 
  Share2,
  Check,
  Copy,
  CreditCard,
  BadgeCheck,
  UserPlus,
  PenSquare,
  ArrowLeft
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { formatRelativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Rep } from "@/lib/rep-data";

interface ProfileHeaderProps {
  rep: Rep;
}

export default function ProfileHeader({ rep }: ProfileHeaderProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bannerHeight, setBannerHeight] = useState("250px");
  
  // Calculate avatar initials from name
  const initials = rep.name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase();
  
  // Extract domain name from website URL
  const websiteDomain = rep.website ? 
    new URL(rep.website).hostname.replace("www.", "") : 
    "";
    
  // Function to handle copying profile link
  const copyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  
  // Responsive banner height
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        // Keep same height as desktop for mobile
        setBannerHeight("250px");
      } else if (window.innerWidth < 1024) {
        setBannerHeight("200px");
      } else {
        setBannerHeight("250px");
      }
    };
    
    handleResize(); // Call on initial render
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get social media properties safely
  const social = rep.social as Record<string, string> || {};
  
  return (
    <div className="relative mb-6">
      {/* Banner Image with Gradient Overlay */}
      <div className="relative">
        <div 
          className="w-full relative" 
          style={{ 
            height: bannerHeight, 
            backgroundImage: `url(${rep.bannerUrl || 'https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Back arrow bubble */}
          <a href="/reps" className="absolute left-4 top-4 z-10 bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full shadow-md transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </a>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/40"></div>
        </div>
        
        {/* Profile Avatar - Overlaid on banner */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-16">
            <Avatar className="h-32 w-32 border-4 border-white absolute left-4 sm:left-6 lg:left-8">
              <AvatarImage src={rep.avatar} alt={rep.name} />
              <AvatarFallback className="text-4xl font-bold">{initials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      
      {/* Profile Content - Below banner and avatar */}
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-md mt-28 pt-2">
          <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-1 md:pb-1 pb-0">
            {/* Profile info section */}
            <div className="flex flex-col md:flex-row justify-between items-start">
              {/* Left-aligned content in 4 distinct rows */}
              <div className="flex-1">
                {/* Row 1: Name - clear standalone row */}
                <h1 className="text-2xl font-bold text-[#09261E] text-left mb-2">{rep.name}</h1>
                
                {/* Row 2: Tags in single row - PD Certified, REP tag, Rating */}
                <div className="flex flex-wrap items-center gap-3 mb-2 text-left">
                  {((rep as any).isVerified || rep.isFeatured) && (
                    <Badge className="bg-[#09261E]">
                      <BadgeCheck className="h-3.5 w-3.5 mr-1" />
                      <span>PD Certified</span>
                    </Badge>
                  )}
                  
                  <Badge variant="outline" className="px-2 py-1 border-[#803344]/30 text-[#803344]">
                    {rep.role}
                  </Badge>
                  
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="ml-1 text-amber-500 font-medium">{rep.rating.toFixed(1)}</span>
                    <span className="ml-1 text-gray-600">({rep.reviewCount})</span>
                  </div>
                </div>
                
                {/* Row 3: Location and Experience - compact */}
                <div className="flex flex-wrap items-center gap-3 mb-2 text-left">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Miami Lakes, {(rep as any).locationCity || rep.location?.city}, {(rep as any).locationState || rep.location?.state}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Award className="h-4 w-4 mr-1" />
                    <span>{rep.yearsExperience}+ years experience</span>
                  </div>
                </div>
                
                {/* Row 4: Website/Link - clear standalone row */}
                {rep.website && (
                  <div className="flex items-center mt-0 mb-1 text-left">
                    <a 
                      href={rep.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      <span>{websiteDomain}</span>
                    </a>
                  </div>
                )}
              </div>
              
              {/* Right column: Social links and buttons - Desktop */}
              <div className="hidden md:flex md:flex-col md:items-end md:pt-0 md:ml-4">
                <div className="flex gap-2">
                  {social?.linkedin && (
                    <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="h-9 w-9 p-0 text-[#0077B5] hover:text-[#0077B5] hover:bg-[#0077B5]/10 border-[#0077B5]/30">
                        <Linkedin className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                  
                  {social?.instagram && (
                    <a href={social.instagram} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="h-9 w-9 p-0 text-[#E1306C] hover:text-[#E1306C] hover:bg-[#E1306C]/10 border-[#E1306C]/30">
                        <Instagram className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                  
                  {social?.facebook && (
                    <a href={social.facebook} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="h-9 w-9 p-0 text-[#1877F2] hover:text-[#1877F2] hover:bg-[#1877F2]/10 border-[#1877F2]/30">
                        <Facebook className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                  
                  {social?.twitter && (
                    <a href={social.twitter} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="h-9 w-9 p-0 text-[#1DA1F2] hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 border-[#1DA1F2]/30">
                        <Twitter className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                </div>
                
                {/* Connect & Share Buttons */}
                <div className="flex mt-3 gap-2">
                  <Button className="bg-[#09261E] hover:bg-[#135341]">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Connect</span>
                  </Button>
                  
                  <Popover open={shareOpen} onOpenChange={setShareOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon" className="h-10 w-10">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="end" side="bottom" sideOffset={5}>
                      <div className="p-4">
                        <h3 className="text-xl font-semibold">Share Profile</h3>
                        <p className="text-sm text-gray-500 mt-1">Choose how you'd like to share this profile with others.</p>
                      </div>
                      
                      {/* REP Info */}
                      <div className="p-4 border-y bg-gray-50/80">
                        <div className="flex gap-3">
                          <Avatar className="h-14 w-14 rounded-md border border-gray-200">
                            <AvatarImage src={rep.avatar} alt={rep.name} />
                            <AvatarFallback className="rounded-md">{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-lg">{rep.name}</h4>
                            <p className="text-gray-500 text-sm">{(rep as any).locationCity || rep.location?.city}, {(rep as any).locationState || rep.location?.state}</p>
                            <div className="flex items-center mt-1">
                              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                              <span className="ml-1 text-amber-500 text-xs font-medium">{rep.rating.toFixed(1)}</span>
                              <span className="ml-1 text-xs text-gray-600">({rep.reviewCount} reviews)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Share Options */}
                      <div className="p-4">
                        <h4 className="font-medium mb-3">Share Options</h4>
                        
                        <div className="space-y-3">
                          <div className="flex items-center p-3 rounded-lg border hover:bg-gray-50 cursor-pointer" onClick={copyProfileLink}>
                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                              <Copy className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium">Copy Link</h5>
                              <p className="text-xs text-gray-500">Copy shareable profile link</p>
                            </div>
                            {copied ? <Check className="h-5 w-5 text-green-600" /> : null}
                          </div>
                          
                          <div className="flex items-center p-3 rounded-lg border hover:bg-gray-50 cursor-pointer" onClick={() => {
                            window.open(`mailto:?subject=Check out ${rep.name} on PropertyDeals&body=I thought you might be interested in this real estate professional: ${window.location.href}`, '_blank');
                            setShareOpen(false);
                          }}>
                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                              <div className="text-gray-600">📧</div>
                            </div>
                            <div>
                              <h5 className="font-medium">Email</h5>
                              <p className="text-xs text-gray-500">Share via email with detailed info</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Social Media */}
                      <div className="p-4 border-t">
                        <h4 className="font-medium mb-2">Share on Social Media</h4>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="flex-1 rounded-full h-10 w-10 p-0 text-[#1877F2] hover:text-[#1877F2] hover:bg-[#1877F2]/10 border-[#1877F2]/20"
                            onClick={() => {
                              window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                              setShareOpen(false);
                            }}
                          >
                            <Facebook className="h-5 w-5" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="flex-1 rounded-full h-10 w-10 p-0 text-[#1DA1F2] hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 border-[#1DA1F2]/20"
                            onClick={() => {
                              window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check out ${rep.name} on PropertyDeals`, '_blank');
                              setShareOpen(false);
                            }}
                          >
                            <Twitter className="h-5 w-5" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="flex-1 rounded-full h-10 w-10 p-0 text-[#0077B5] hover:text-[#0077B5] hover:bg-[#0077B5]/10 border-[#0077B5]/20"
                            onClick={() => {
                              window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                              setShareOpen(false);
                            }}
                          >
                            <Linkedin className="h-5 w-5" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="flex-1 rounded-full h-10 w-10 p-0 text-[#25D366] hover:text-[#25D366] hover:bg-[#25D366]/10 border-[#25D366]/20"
                            onClick={() => {
                              window.open(`https://wa.me/?text=${encodeURIComponent(`Check out ${rep.name} on PropertyDeals: ${window.location.href}`)}`, '_blank');
                              setShareOpen(false);
                            }}
                          >
                            <div className="text-[#25D366]">📱</div>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4 border-t flex justify-end">
                        <Button 
                          variant="outline" 
                          onClick={() => setShareOpen(false)}
                          className="w-20"
                        >
                          Done
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile social links removed - now using MobileContactCard */}
    </div>
  );
}