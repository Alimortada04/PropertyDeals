import { Rep } from "@/lib/rep-data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  MessageSquare, 
  Mail,
  Share2, 
  UserPlus, 
  ExternalLink,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Globe
} from "lucide-react";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

interface MobileContactCardProps {
  rep: Rep;
}

export default function MobileContactCard({ rep }: MobileContactCardProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [socialsDialogOpen, setSocialsDialogOpen] = useState(false);
  
  // Calculate avatar initials from name
  const initials = rep.name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase();
    
  // Get social media properties safely
  const social = rep.social as Record<string, string> || {};
  // Access contact info safely using type assertion
  const contact = (rep as any).contact || {};
  
  // Handle sharing profile
  const shareProfile = (platform: 'copy' | 'email' | 'sms' | 'whatsapp') => {
    const profileUrl = window.location.href;
    const repName = rep.name;
    
    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(profileUrl);
        alert("Profile link copied to clipboard!");
        break;
      case 'email':
        window.open(`mailto:?subject=Check out ${repName} on PropertyDeals&body=I thought you might be interested in this real estate professional: ${profileUrl}`, '_blank');
        break;
      case 'sms':
        window.open(`sms:?body=Check out ${repName} on PropertyDeals: ${profileUrl}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`Check out ${repName} on PropertyDeals: ${profileUrl}`)}`, '_blank');
        break;
    }
    
    setShareDialogOpen(false);
  };
  
  return (
    <>
      {/* Main sticky card visible on mobile only */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#09261E] to-[#124B39] py-2 px-3 md:hidden z-50">
        <div className="flex items-center justify-between">
          {/* Avatar with pulse animation */}
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-white">
              <AvatarImage src={rep.avatar} alt={rep.name} />
              <AvatarFallback className="bg-[#09261E] text-white">{initials}</AvatarFallback>
            </Avatar>
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-green-500 border border-white">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
            </span>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2">
            {/* Message button */}
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-12 w-12 rounded-full bg-white text-[#09261E] hover:bg-white/90"
              onClick={() => window.open(`mailto:${contact?.email || ''}`)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            
            {/* Call button */}
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-12 w-12 rounded-full bg-white text-[#09261E] hover:bg-white/90"
              onClick={() => window.open(`tel:${contact?.phone || ''}`)}
            >
              <Phone className="h-5 w-5" />
            </Button>
            
            {/* Share button */}
            <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-12 w-12 rounded-full bg-white text-[#09261E] hover:bg-white/90"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] rounded-t-xl rounded-b-none p-4 pt-6 pb-8 fixed bottom-0 top-auto translate-y-0 border-t-2 border-[#09261E]">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl mb-6">Share Profile</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="flex flex-col h-auto py-3 gap-2 border-gray-200"
                    onClick={() => shareProfile('copy')}
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </div>
                    <span className="text-xs">Copy Link</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex flex-col h-auto py-3 gap-2 border-gray-200"
                    onClick={() => shareProfile('email')}
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Mail className="h-5 w-5" />
                    </div>
                    <span className="text-xs">Email</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex flex-col h-auto py-3 gap-2 border-gray-200"
                    onClick={() => shareProfile('sms')}
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </div>
                    <span className="text-xs">Message</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex flex-col h-auto py-3 gap-2 border-gray-200"
                    onClick={() => shareProfile('whatsapp')}
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-[#25D366]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>
                    </div>
                    <span className="text-xs">WhatsApp</span>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Connect Button */}
            <Button 
              size="icon" 
              className="h-12 w-12 rounded-full bg-white text-[#09261E] hover:bg-white/90"
              variant="secondary"
              onClick={() => {}}
            >
              <UserPlus className="h-5 w-5" />
            </Button>
            
            {/* Social Media Button */}
            <Dialog open={socialsDialogOpen} onOpenChange={setSocialsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-12 w-12 rounded-full bg-white text-[#09261E] hover:bg-white/90"
                >
                  <ExternalLink className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] rounded-t-xl rounded-b-none p-4 pt-6 pb-8 fixed bottom-0 top-auto translate-y-0 border-t-2 border-[#09261E]">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl mb-6">Connect with {rep.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  {rep.website && (
                    <a 
                      href={rep.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Globe className="h-5 w-5 text-[#09261E]" />
                      </div>
                      <div>
                        <h5 className="font-medium">Website</h5>
                        <p className="text-xs text-gray-500">{new URL(rep.website).hostname.replace("www.", "")}</p>
                      </div>
                    </a>
                  )}
                  
                  {contact?.email && (
                    <a 
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Mail className="h-5 w-5 text-[#09261E]" />
                      </div>
                      <div>
                        <h5 className="font-medium">Email</h5>
                        <p className="text-xs text-gray-500">{contact.email}</p>
                      </div>
                    </a>
                  )}
                  
                  {contact?.phone && (
                    <a 
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Phone className="h-5 w-5 text-[#09261E]" />
                      </div>
                      <div>
                        <h5 className="font-medium">Phone</h5>
                        <p className="text-xs text-gray-500">{contact.phone}</p>
                      </div>
                    </a>
                  )}
                  
                  {social?.linkedin && (
                    <a 
                      href={social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-[#0077B5]">
                        <Linkedin className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="font-medium">LinkedIn</h5>
                        <p className="text-xs text-gray-500">Connect professionally</p>
                      </div>
                    </a>
                  )}
                  
                  {social?.instagram && (
                    <a 
                      href={social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-[#E1306C]">
                        <Instagram className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="font-medium">Instagram</h5>
                        <p className="text-xs text-gray-500">Follow latest projects</p>
                      </div>
                    </a>
                  )}
                  
                  {social?.facebook && (
                    <a 
                      href={social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-[#1877F2]">
                        <Facebook className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="font-medium">Facebook</h5>
                        <p className="text-xs text-gray-500">Connect and follow</p>
                      </div>
                    </a>
                  )}
                  
                  {social?.twitter && (
                    <a 
                      href={social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-[#1DA1F2]">
                        <Twitter className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="font-medium">Twitter</h5>
                        <p className="text-xs text-gray-500">Latest updates</p>
                      </div>
                    </a>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      {/* Bottom padding to prevent content from being hidden behind the sticky card */}
      <div className="h-20 md:h-0"></div>
    </>
  );
}