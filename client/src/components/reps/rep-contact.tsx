import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Globe, 
  Share2, 
  QrCode, 
  Copy, 
  Bookmark,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RepContactProps {
  rep: any;
  contactInfo: any;
}

export default function RepContact({ rep, contactInfo }: RepContactProps) {
  const { toast } = useToast();
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${rep.name}`,
    });
    setMessageDialogOpen(false);
  };

  const copyProfileLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({
      title: "Link copied",
      description: "Profile link copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
    toast({
      title: bookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: bookmarked 
        ? `${rep.name} has been removed from your bookmarks` 
        : `${rep.name} has been added to your bookmarks`,
    });
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Contact
        </CardTitle>
        <CardDescription>Get in touch with {rep.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Contact Button */}
        <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" size="lg">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message REP
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Message {rep.name}</DialogTitle>
              <DialogDescription>
                Send a direct message to start a conversation
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleMessageSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="e.g., Question about property investing" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Type your message here..." 
                  className="min-h-[120px]"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Send Message</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Additional Contact Methods */}
        <div className="space-y-3 py-3">
          {contactInfo.phone && (
            <a 
              href={`tel:${contactInfo.phone}`}
              className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{contactInfo.phone}</span>
            </a>
          )}
          
          {contactInfo.email && (
            <a 
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{contactInfo.email}</span>
            </a>
          )}
          
          {contactInfo.website && (
            <a 
              href={contactInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
            >
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>{new URL(contactInfo.website).hostname}</span>
            </a>
          )}
        </div>

        <Separator />

        {/* Additional Actions */}
        <div className="flex flex-wrap justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => setShowQrCode(!showQrCode)}
          >
            <QrCode className="mr-2 h-4 w-4" />
            {showQrCode ? "Hide QR" : "Show QR"}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={copyProfileLink}
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
          
          <Button 
            variant={bookmarked ? "default" : "outline"} 
            size="sm" 
            className="flex-1"
            onClick={toggleBookmark}
          >
            <Bookmark className="mr-2 h-4 w-4" />
            {bookmarked ? "Saved" : "Save REP"}
          </Button>
        </div>

        {/* QR Code (simplified version) */}
        {showQrCode && (
          <div className="pt-4 flex justify-center">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="w-32 h-32 bg-gray-100 flex items-center justify-center">
                <QrCode className="h-16 w-16 text-muted-foreground" />
              </div>
              <p className="text-center text-xs mt-2 text-muted-foreground">
                Scan to view profile
              </p>
            </div>
          </div>
        )}

        <Separator />

        {/* Availability Status */}
        <div className="text-sm text-center text-muted-foreground">
          {rep.available ? (
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span>Available Now • Fast Response</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              <span>Available Within 24h</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}