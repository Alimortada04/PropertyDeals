import { Rep } from "@/lib/rep-data";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Phone,
  Mail,
  MessageCircle,
  UserPlus,
  Share2,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Globe
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

interface MobileContactCardProps {
  rep: Rep;
}

export default function MobileContactCard({ rep }: MobileContactCardProps) {
  const [socialPopoverOpen, setSocialPopoverOpen] = useState(false);
  
  // Calculate avatar initials from name
  const initials = rep.name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase();
  
  // Get social media properties safely
  const social = rep.social as Record<string, string> || {};
  
  const hasSocialLinks = social?.linkedin || social?.instagram || social?.facebook || social?.twitter || social?.website;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center px-2 py-2 relative">
        {/* Avatar with pulse animation */}
        <div className="relative">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src={rep.avatar} alt={rep.name} />
            <AvatarFallback className="text-base font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full z-10 animate-pulse">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>
        
        {/* Contact Buttons */}
        <div className="flex-1 flex justify-evenly items-center ml-2">
          {/* Message Button */}
          <Button variant="ghost" size="sm" className="flex flex-col items-center text-xs h-auto py-1 text-[#09261E]">
            <MessageCircle className="h-5 w-5 mb-1" />
            <span>Message</span>
          </Button>
          
          {/* Call Button */}
          {rep.contact?.phone && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex flex-col items-center text-xs h-auto py-1 text-[#09261E]"
              onClick={() => window.open(`tel:${rep.contact?.phone}`)}
            >
              <Phone className="h-5 w-5 mb-1" />
              <span>Call</span>
            </Button>
          )}
          
          {/* Connect Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center text-xs h-auto py-1 text-[#09261E]"
          >
            <UserPlus className="h-5 w-5 mb-1" />
            <span>Connect</span>
          </Button>
          
          {/* Socials Button */}
          {hasSocialLinks && (
            <Popover open={socialPopoverOpen} onOpenChange={setSocialPopoverOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex flex-col items-center text-xs h-auto py-1 text-[#09261E]"
                >
                  <Globe className="h-5 w-5 mb-1" />
                  <span>Socials</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-3" align="end" side="top" sideOffset={16}>
                <h3 className="text-base font-semibold mb-2">Connect with {rep.name}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {social?.linkedin && (
                    <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button variant="outline" size="sm" className="w-full justify-start text-[#0077B5]">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                    </a>
                  )}
                  
                  {social?.instagram && (
                    <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button variant="outline" size="sm" className="w-full justify-start text-[#E1306C]">
                        <Instagram className="h-4 w-4 mr-2" />
                        Instagram
                      </Button>
                    </a>
                  )}
                  
                  {social?.facebook && (
                    <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button variant="outline" size="sm" className="w-full justify-start text-[#1877F2]">
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                      </Button>
                    </a>
                  )}
                  
                  {social?.twitter && (
                    <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button variant="outline" size="sm" className="w-full justify-start text-[#1DA1F2]">
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </Button>
                    </a>
                  )}
                  
                  {social?.website && (
                    <a href={social.website} target="_blank" rel="noopener noreferrer" className="w-full col-span-2">
                      <Button variant="outline" size="sm" className="w-full justify-start text-blue-600">
                        <Globe className="h-4 w-4 mr-2" />
                        Website
                      </Button>
                    </a>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}
          
          {/* Share Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center text-xs h-auto py-1 text-[#09261E]"
            onClick={() => window.navigator.share?.({
              title: `${rep.name} - PropertyDeals`,
              text: `Check out ${rep.name} on PropertyDeals`,
              url: window.location.href,
            }).catch(err => console.log('Error sharing', err))}
          >
            <Share2 className="h-5 w-5 mb-1" />
            <span>Share</span>
          </Button>
        </div>
      </div>
    </div>
  );
}