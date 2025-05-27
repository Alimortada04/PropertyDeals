import { useState } from "react";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  MegaphoneIcon, 
  MailIcon, 
  UsersIcon, 
  GlobeIcon 
} from "lucide-react";

interface CampaignCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CampaignCreationModal({ isOpen, onClose }: CampaignCreationModalProps) {
  const [campaignType, setCampaignType] = useState("email");
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[600px] max-h-[85vh] p-0 flex flex-col overflow-hidden text-[#09261E]">
        <DialogHeader className="p-6 pb-4 border-b bg-white">
          <DialogTitle className="text-xl font-semibold">Start New Campaign</DialogTitle>
          <DialogDescription className="text-gray-600">
            Create a marketing campaign to promote your properties
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs 
            defaultValue="email" 
            value={campaignType} 
            onValueChange={setCampaignType}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <MailIcon size={16} />
                Email
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <UsersIcon size={16} />
                Social
              </TabsTrigger>
              <TabsTrigger value="web" className="flex items-center gap-2">
                <GlobeIcon size={16} />
                Web
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input id="campaign-name" placeholder="e.g., May Property Showcase" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="target-audience">Target Audience</Label>
                  <Select>
                    <SelectTrigger id="target-audience">
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-buyers">All Buyers</SelectItem>
                      <SelectItem value="previous-inquiries">Previous Inquiries</SelectItem>
                      <SelectItem value="active-buyers">Active Buyers</SelectItem>
                      <SelectItem value="custom-list">Custom List</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="properties">Featured Properties</Label>
                  <Select>
                    <SelectTrigger id="properties">
                      <SelectValue placeholder="Select properties to feature" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Properties</SelectItem>
                      <SelectItem value="property-1">Modern Farmhouse</SelectItem>
                      <SelectItem value="property-2">Downtown Loft</SelectItem>
                      <SelectItem value="property-3">Suburban Ranch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-subject">Email Subject</Label>
                  <Input id="email-subject" placeholder="Compelling subject line for your email" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-content">Email Content</Label>
                  <Textarea 
                    id="email-content" 
                    placeholder="Write your email content here or select a template" 
                    className="min-h-[200px]"
                  />
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MegaphoneIcon size={16} />
                    <span className="font-medium">Campaign Analytics</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    This campaign will reach approximately 250 potential buyers based on your audience selection.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="social" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="social-campaign-name">Campaign Name</Label>
                  <Input id="social-campaign-name" placeholder="e.g., Instagram Property Showcase" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="social-platform">Platform</Label>
                  <Select>
                    <SelectTrigger id="social-platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="social-properties">Featured Properties</Label>
                  <Select>
                    <SelectTrigger id="social-properties">
                      <SelectValue placeholder="Select properties to feature" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Properties</SelectItem>
                      <SelectItem value="property-1">Modern Farmhouse</SelectItem>
                      <SelectItem value="property-2">Downtown Loft</SelectItem>
                      <SelectItem value="property-3">Suburban Ranch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="social-content">Post Content</Label>
                  <Textarea 
                    id="social-content" 
                    placeholder="Write your social media post content here" 
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Upload images or media for your social campaign
                  </p>
                  <Button variant="outline">
                    Upload Media
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="web" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="web-campaign-name">Campaign Name</Label>
                  <Input id="web-campaign-name" placeholder="e.g., Google Ads Property Campaign" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="web-platform">Platform</Label>
                  <Select>
                    <SelectTrigger id="web-platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Ads</SelectItem>
                      <SelectItem value="facebook-ads">Facebook Ads</SelectItem>
                      <SelectItem value="landing-page">Custom Landing Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input id="budget" className="pl-8" placeholder="500" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Campaign Duration (Days)</Label>
                  <Input id="duration" type="number" placeholder="30" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targeting">Targeting Keywords</Label>
                  <Textarea 
                    id="targeting" 
                    placeholder="Enter targeting keywords, separated by commas" 
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MegaphoneIcon size={16} />
                    <span className="font-medium">Campaign Estimate</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Based on your settings, you can expect approximately 500-750 impressions and 20-30 clicks.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="border-t bg-white p-6 flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              // Launch campaign logic here
              onClose();
            }}
            className="bg-[#135341] hover:bg-[#09261E] text-white"
          >
            Launch Campaign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}