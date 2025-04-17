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
      <div className="fixed bottom-0 left-0 right-0 bg-white py-3 md:hidden z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] border-t border-gray-100">
        <div className="flex items-center justify-center">
          {/* Action buttons - reordered with larger tap areas */}
          <div className="flex justify-center items-center gap-x-8 w-full">
            {/* Share button - uses native share API */}
            <button 
              className="flex flex-col items-center justify-center rounded-lg w-12 h-12 bg-white border-2 border-gray-300 text-[#09261E] hover:border-gray-400 hover:scale-105 transform transition-all duration-200"
              aria-label="Share REP profile"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${rep.name} - PropertyDeals`,
                    text: `Check out ${rep.name} on PropertyDeals`,
                    url: window.location.href,
                  }).catch((error) => console.log('Error sharing', error));
                } else {
                  // Fallback for browsers that don't support share API
                  setShareDialogOpen(true);
                }
              }}
            >
              <Share2 className="h-5 w-5" />
            </button>
            
            {/* Profile/Connect Button */}
            <Dialog open={socialsDialogOpen} onOpenChange={setSocialsDialogOpen}>
              <DialogTrigger asChild>
                <button 
                  className="flex flex-col items-center justify-center rounded-lg w-12 h-12 bg-[#09261E] text-white hover:bg-[#135341] hover:scale-105 transform transition-all duration-200"
                  aria-label="Connect with REP"
                >
                  <UserPlus className="h-6 w-6" />
                </button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] sm:max-w-md rounded-t-xl rounded-b-none p-4 pt-5 pb-4 fixed bottom-0 top-auto translate-y-0 border-t-2 border-[#09261E]">
                <DialogHeader>
                  <DialogTitle className="text-center text-2xl font-semibold">Connect with {rep.name}</DialogTitle>
                </DialogHeader>
                
                {/* Social media icons row */}
                <div className="flex justify-center items-center gap-3 mt-3">
                  {social?.linkedin && (
                    <a 
                      href={social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Connect on LinkedIn"
                      className="p-2 rounded-md bg-[#0077B5]/10 border border-[#0077B5]/30 text-[#0077B5] hover:bg-[#0077B5]/20 transition-colors duration-200"
                    >
                      <Linkedin className="h-7 w-7" />
                    </a>
                  )}
                  
                  {social?.instagram && (
                    <a 
                      href={social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow on Instagram"
                      className="p-2 rounded-md bg-[#E1306C]/10 border border-[#E1306C]/30 text-[#E1306C] hover:bg-[#E1306C]/20 transition-colors duration-200"
                    >
                      <Instagram className="h-7 w-7" />
                    </a>
                  )}
                  
                  {social?.facebook && (
                    <a 
                      href={social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow on Facebook"
                      className="p-2 rounded-md bg-[#1877F2]/10 border border-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors duration-200"
                    >
                      <Facebook className="h-7 w-7" />
                    </a>
                  )}
                  
                  {social?.twitter && (
                    <a 
                      href={social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow on Twitter"
                      className="p-2 rounded-md bg-[#1DA1F2]/10 border border-[#1DA1F2]/30 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors duration-200"
                    >
                      <Twitter className="h-7 w-7" />
                    </a>
                  )}
                </div>
                
                <div className="space-y-3">
                  {/* Connect on PropertyDeals option */}
                  <div 
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      // Connect functionality would go here
                      setSocialsDialogOpen(false);
                    }}
                  >
                    <div className="h-10 w-10 bg-[#09261E] rounded-md flex items-center justify-center text-white">
                      <UserPlus className="h-5 w-5" />
                    </div>
                    <div>
                      <h5 className="font-medium">Connect on PropertyDeals</h5>
                      <p className="text-xs text-gray-500">Add to your professional network</p>
                    </div>
                  </div>
                  
                  {contact?.phone && (
                    <a 
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <div className="h-10 w-10 bg-[#09261E]/10 border border-[#09261E]/20 rounded-md flex items-center justify-center">
                        <Phone className="h-5 w-5 text-[#09261E]" />
                      </div>
                      <div>
                        <h5 className="font-medium">Phone</h5>
                        <p className="text-xs text-gray-500">{contact.phone}</p>
                      </div>
                    </a>
                  )}
                  
                  {contact?.email && (
                    <a 
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <div className="h-10 w-10 bg-[#09261E]/10 border border-[#09261E]/20 rounded-md flex items-center justify-center">
                        <Mail className="h-5 w-5 text-[#09261E]" />
                      </div>
                      <div>
                        <h5 className="font-medium">Email</h5>
                        <p className="text-xs text-gray-500">{contact.email}</p>
                      </div>
                    </a>
                  )}
                  
                  {/* Add to Contacts button */}
                  {(contact?.phone || contact?.email) && (
                    <div 
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        // In a real app, this would trigger native contact APIs or download a vCard
                        const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${rep.name}
ORG:PropertyDeals
TITLE:${rep.role}
${contact?.phone ? `TEL;TYPE=WORK,VOICE:${contact.phone}` : ''}
${contact?.email ? `EMAIL;TYPE=WORK:${contact.email}` : ''}
${rep.website ? `URL:${rep.website}` : ''}
END:VCARD`;
                        
                        const blob = new Blob([vCardData], { type: 'text/vcard' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `${rep.name.replace(/\s+/g, '-')}-PropertyDeals.vcf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      <div className="h-10 w-10 bg-[#803344]/10 border border-[#803344]/30 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#803344" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                      </div>
                      <div>
                        <h5 className="font-medium">Add to Contacts</h5>
                        <p className="text-xs text-gray-500">Save contact details to your device</p>
                      </div>
                    </div>
                  )}
                  

                </div>
              </DialogContent>
            </Dialog>
            
            {/* Message button */}
            <button 
              className="flex flex-col items-center justify-center rounded-lg w-12 h-12 bg-white border-2 border-gray-300 text-[#09261E] hover:border-gray-400 hover:scale-105 transform transition-all duration-200"
              aria-label="Message this REP"
              onClick={() => window.open(`mailto:${contact?.email || ''}`)}
            >
              <MessageSquare className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Share dialog - fallback for browsers without native share API */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md rounded-t-xl rounded-b-none p-4 pt-5 pb-4 fixed bottom-0 top-auto translate-y-0 border-t-2 border-[#09261E]">
          <div className="absolute right-4 top-4">
            <button 
              className="rounded-full h-8 w-8 inline-flex items-center justify-center border border-gray-300 text-gray-500 hover:bg-gray-100"
              onClick={() => setShareDialogOpen(false)}
              aria-label="Close dialog"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-semibold">Share Profile</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-4 mt-3">
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
      
      {/* Bottom padding to prevent content from being hidden behind the sticky card */}
      <div className="h-20 md:h-0"></div>
    </>
  );
}