import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  FileText, 
  Users, 
  Mail, 
  MessageSquare, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  Calendar,
  Send,
  Eye,
  Edit,
  Copy,
  Trash2,
  ExternalLink,
  Check,
  AlertTriangle,
  Play,
  Pause,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface MarketingCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MarketingView = 'main' | 'new-campaign' | 'all-campaigns' | 'jv-partners';
type CampaignStep = 1 | 2 | 3 | 4;
type CampaignType = 'new-deal' | 'price-drop' | 'final-call' | 'under-contract';
type CampaignChannel = 'email' | 'social' | 'both';

// Mock data for demonstration
const mockProperties = [
  { id: '1', title: 'Modern Farmhouse', address: '123 Main St, Downtown', price: 285000, status: 'Live', thumbnail: '/api/placeholder/150/100' },
  { id: '2', title: 'Urban Loft', address: '456 Oak Ave, Midtown', price: 195000, status: 'Live', thumbnail: '/api/placeholder/150/100' },
  { id: '3', title: 'Suburban Ranch', address: '789 Pine Dr, Suburbs', price: 320000, status: 'Draft', thumbnail: '/api/placeholder/150/100' },
];

const mockCampaigns = [
  {
    id: '1',
    name: 'Modern Farmhouse - New Deal',
    property: mockProperties[0],
    channels: ['email', 'social'],
    status: 'active',
    sent: 1250,
    opens: 380,
    clicks: 95,
    sentDate: new Date('2024-01-15'),
    type: 'new-deal'
  },
  {
    id: '2', 
    name: 'Urban Loft - Price Drop',
    property: mockProperties[1],
    channels: ['email'],
    status: 'scheduled',
    scheduledDate: new Date('2024-01-25'),
    type: 'price-drop'
  },
  {
    id: '3',
    name: 'Suburban Ranch - Final Call',
    property: mockProperties[2],
    channels: ['social'],
    status: 'completed',
    sent: 890,
    opens: 245,
    clicks: 67,
    sentDate: new Date('2024-01-10'),
    type: 'final-call'
  }
];

const aiTemplates = {
  'urgent-alert': { name: 'Urgent Alert', description: 'Creates urgency and scarcity' },
  'investor-focus': { name: 'Investor Focus', description: 'Targets serious investors' },
  'luxury-highlight': { name: 'Luxury Highlight', description: 'Emphasizes premium features' },
  'value-opportunity': { name: 'Value Opportunity', description: 'Focuses on ROI potential' }
};

export function MarketingCenterModal({ isOpen, onClose }: MarketingCenterModalProps) {
  const [currentView, setCurrentView] = useState<MarketingView>('main');
  const [campaignStep, setCampaignStep] = useState<CampaignStep>(1);
  
  // New Campaign State
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [campaignChannel, setCampaignChannel] = useState<CampaignChannel>('email');
  const [campaignType, setCampaignType] = useState<CampaignType>('new-deal');
  const [useAITemplate, setUseAITemplate] = useState(false);
  const [aiTemplate, setAITemplate] = useState('investor-focus');
  const [campaignName, setCampaignName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [socialCaption, setSocialCaption] = useState('');

  // JV Partners State
  const [jvPartnerEmail, setJvPartnerEmail] = useState('');
  const [jvNotes, setJvNotes] = useState('');
  const [jvTerms, setJvTerms] = useState('');
  const [jvApproved, setJvApproved] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentView('main');
      setCampaignStep(1);
      // Reset form data
      setSelectedProperty('');
      setCampaignChannel('email');
      setCampaignType('new-deal');
      setUseAITemplate(false);
      setCampaignName('');
      setTargetAudience('');
      setEmailSubject('');
      setEmailContent('');
      setSocialCaption('');
      setJvPartnerEmail('');
      setJvNotes('');
      setJvTerms('');
      setJvApproved(false);
    }
  }, [isOpen]);

  // Auto-generate campaign name
  useEffect(() => {
    if (selectedProperty && campaignType) {
      const property = mockProperties.find(p => p.id === selectedProperty);
      if (property) {
        const typeLabel = campaignType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        const date = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        setCampaignName(`${property.title} - ${typeLabel} ${date}`);
      }
    }
  }, [selectedProperty, campaignType]);

  // AI Template generation
  const generateAITemplate = () => {
    const property = mockProperties.find(p => p.id === selectedProperty);
    if (!property) return;

    const templates = {
      'new-deal': {
        subject: `🏠 NEW DEAL ALERT: ${property.title} - ${property.address}`,
        email: `Exciting new investment opportunity just hit the market!\n\n${property.title}\n📍 ${property.address}\n💰 ${property.price.toLocaleString()}\n\nThis property won't last long. Serious inquiries only.\n\nReady to move fast? Reply now!`,
        social: `🚨 NEW DEAL: ${property.title} just dropped! ${property.address} - $${property.price.toLocaleString()}. DM for details! #RealEstate #Investment #NewDeal`
      },
      'price-drop': {
        subject: `💥 PRICE DROP: ${property.title} - Now $${property.price.toLocaleString()}`,
        email: `Major price reduction on this incredible property!\n\n${property.title}\n📍 ${property.address}\n💰 NOW: $${property.price.toLocaleString()}\n\nDon't miss this opportunity - motivated seller!`,
        social: `💥 PRICE DROP ALERT! ${property.title} just got more affordable. New price: $${property.price.toLocaleString()}. This won't last! #PriceDrop #Investment`
      },
      'final-call': {
        subject: `⏰ FINAL CALL: ${property.title} - Last Chance!`,
        email: `This is your final opportunity to secure this deal!\n\n${property.title}\n📍 ${property.address}\n💰 ${property.price.toLocaleString()}\n\nOffers needed by end of week. Don't let this one slip away!`,
        social: `⏰ FINAL CALL! ${property.title} - last chance before it's gone. $${property.price.toLocaleString()}. Act now! #FinalCall #LastChance`
      },
      'under-contract': {
        subject: `✅ UNDER CONTRACT: ${property.title} - But we have more!`,
        email: `This one's under contract, but don't worry!\n\n${property.title} - SOLD\n📍 ${property.address}\n💰 ${property.price.toLocaleString()}\n\nWe have similar properties available. Reply to see what's next!`,
        social: `✅ ANOTHER ONE SOLD! ${property.title} is under contract. Want to see what else we have? DM us! #Sold #MoreDealsAvailable`
      }
    };

    const template = templates[campaignType];
    setEmailSubject(template.subject);
    setEmailContent(template.email);
    setSocialCaption(template.social);
  };

  const handleNext = () => {
    if (campaignStep < 4) {
      setCampaignStep((prev) => (prev + 1) as CampaignStep);
    }
  };

  const handleBack = () => {
    if (campaignStep > 1) {
      setCampaignStep((prev) => (prev - 1) as CampaignStep);
    }
  };

  const getStepTitle = () => {
    switch (campaignStep) {
      case 1: return 'Select Property';
      case 2: return 'Campaign Type & Channels';
      case 3: return 'AI Template (Optional)';
      case 4: return 'Final Details';
      default: return '';
    }
  };

  const renderMainView = () => (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-[#09261E] font-['League_Spartan']">Marketing Center</h2>
        <p className="text-gray-600 font-['Lato']">Launch campaigns, manage marketing, and collaborate with partners</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* New Campaign Card */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-[#135341] group"
          onClick={() => setCurrentView('new-campaign')}
        >
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-[#135341] rounded-xl mx-auto flex items-center justify-center group-hover:bg-[#09261E] transition-colors">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-[#09261E] font-['League_Spartan']">New Campaign</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 text-sm font-['Lato']">Launch a new marketing campaign</p>
          </CardContent>
        </Card>

        {/* All Campaigns Card */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-[#135341] group"
          onClick={() => setCurrentView('all-campaigns')}
        >
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-[#135341] rounded-xl mx-auto flex items-center justify-center group-hover:bg-[#09261E] transition-colors">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-[#09261E] font-['League_Spartan']">All Campaigns</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 text-sm font-['Lato']">View, edit, and manage your campaigns</p>
          </CardContent>
        </Card>

        {/* JV Partners Card */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-[#135341] group"
          onClick={() => setCurrentView('jv-partners')}
        >
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-[#135341] rounded-xl mx-auto flex items-center justify-center group-hover:bg-[#09261E] transition-colors">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-[#09261E] font-['League_Spartan']">JV Partners</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 text-sm font-['Lato']">Collaborate with other sellers to co-market a deal</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderNewCampaignStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium font-['Lato']">Select Property to Market</Label>
        <p className="text-sm text-gray-600 mb-4 font-['Lato']">Choose from your live or draft properties</p>
      </div>

      <div className="grid grid-cols-1 gap-4 max-h-80 overflow-y-auto">
        {mockProperties.filter(p => p.status === 'Live' || p.status === 'Draft').map((property) => (
          <Card 
            key={property.id}
            className={cn(
              "cursor-pointer transition-all duration-200 border-2",
              selectedProperty === property.id 
                ? "border-[#135341] bg-[#135341]/5" 
                : "border-gray-200 hover:border-[#135341]/50"
            )}
            onClick={() => setSelectedProperty(property.id)}
          >
            <CardContent className="flex items-center space-x-4 p-4">
              <img 
                src={property.thumbnail} 
                alt={property.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold font-['League_Spartan'] text-[#09261E]">{property.title}</h3>
                <p className="text-gray-600 text-sm font-['Lato']">{property.address}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold text-[#09261E] font-['Lato']">${property.price.toLocaleString()}</span>
                  <Badge variant={property.status === 'Live' ? 'default' : 'secondary'} className="text-xs">
                    {property.status}
                  </Badge>
                </div>
              </div>
              {selectedProperty === property.id && (
                <Check className="h-6 w-6 text-[#135341]" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderNewCampaignStep2 = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium font-['Lato']">Campaign Type</Label>
        <p className="text-sm text-gray-600 mb-4 font-['Lato']">Select the type of campaign you want to create</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { value: 'new-deal', label: 'New Deal', icon: Plus },
          { value: 'price-drop', label: 'Price Drop', icon: ArrowRight },
          { value: 'final-call', label: 'Final Call', icon: AlertTriangle },
          { value: 'under-contract', label: 'Under Contract', icon: Check }
        ].map(({ value, label, icon: Icon }) => (
          <Card
            key={value}
            className={cn(
              "cursor-pointer transition-all duration-200 border-2",
              campaignType === value 
                ? "border-[#135341] bg-[#135341]/5" 
                : "border-gray-200 hover:border-[#135341]/50"
            )}
            onClick={() => setCampaignType(value as CampaignType)}
          >
            <CardContent className="flex items-center space-x-3 p-4">
              <Icon className="h-5 w-5 text-[#135341]" />
              <span className="font-medium font-['Lato']">{label}</span>
              {campaignType === value && <Check className="h-4 w-4 text-[#135341] ml-auto" />}
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      <div>
        <Label className="text-base font-medium font-['Lato']">Marketing Channels</Label>
        <p className="text-sm text-gray-600 mb-4 font-['Lato']">Choose how you want to reach your audience</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {[
          { value: 'email', label: 'Email Only', icon: Mail, desc: 'Send to your email list' },
          { value: 'social', label: 'Social Media Only', icon: MessageSquare, desc: 'Post on social platforms' },
          { value: 'both', label: 'Email + Social', icon: Send, desc: 'Maximum reach across channels' }
        ].map(({ value, label, icon: Icon, desc }) => (
          <Card
            key={value}
            className={cn(
              "cursor-pointer transition-all duration-200 border-2",
              campaignChannel === value 
                ? "border-[#135341] bg-[#135341]/5" 
                : "border-gray-200 hover:border-[#135341]/50"
            )}
            onClick={() => setCampaignChannel(value as CampaignChannel)}
          >
            <CardContent className="flex items-center space-x-3 p-4">
              <Icon className="h-5 w-5 text-[#135341]" />
              <div className="flex-1">
                <div className="font-medium font-['Lato']">{label}</div>
                <div className="text-sm text-gray-600 font-['Lato']">{desc}</div>
              </div>
              {campaignChannel === value && <Check className="h-4 w-4 text-[#135341]" />}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderNewCampaignStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Sparkles className="h-12 w-12 text-[#135341] mx-auto" />
        <h3 className="text-xl font-semibold font-['League_Spartan'] text-[#09261E]">AI Template Assistant</h3>
        <p className="text-gray-600 font-['Lato']">Let AI create compelling campaign content for you</p>
      </div>

      <Card className="border-2 border-[#135341]/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-medium font-['Lato']">Use AI Template</Label>
            <Switch 
              checked={useAITemplate} 
              onCheckedChange={setUseAITemplate}
            />
          </div>

          {useAITemplate && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium font-['Lato']">Template Style</Label>
                <Select value={aiTemplate} onValueChange={setAITemplate}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(aiTemplates).map(([key, template]) => (
                      <SelectItem key={key} value={key}>
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs text-gray-600">{template.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={generateAITemplate}
                className="w-full bg-[#135341] hover:bg-[#09261E] text-white"
                disabled={!selectedProperty}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Content
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {!useAITemplate && (
        <div className="text-center p-8 text-gray-500">
          <p className="font-['Lato']">Skip AI generation and create your content manually in the next step.</p>
        </div>
      )}
    </div>
  );

  const renderNewCampaignStep4 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="campaign-name" className="font-['Lato']">Campaign Name</Label>
          <Input 
            id="campaign-name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="target-audience" className="font-['Lato']">Target Audience</Label>
          <Select value={targetAudience} onValueChange={setTargetAudience}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select your audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-buyers">All Buyers (1,200+)</SelectItem>
              <SelectItem value="active-investors">Active Investors (340)</SelectItem>
              <SelectItem value="previous-inquiries">Previous Inquiries (89)</SelectItem>
              <SelectItem value="local-buyers">Local Buyers (156)</SelectItem>
              <SelectItem value="custom-list">Custom List</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(campaignChannel === 'email' || campaignChannel === 'both') && (
          <>
            <div>
              <Label htmlFor="email-subject" className="font-['Lato']">Email Subject Line</Label>
              <Input 
                id="email-subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter compelling subject line"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email-content" className="font-['Lato']">Email Content</Label>
              <Textarea 
                id="email-content"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Write your email content here..."
                className="mt-2 min-h-[150px]"
              />
            </div>
          </>
        )}

        {(campaignChannel === 'social' || campaignChannel === 'both') && (
          <div>
            <Label htmlFor="social-caption" className="font-['Lato']">Social Media Caption</Label>
            <Textarea 
              id="social-caption"
              value={socialCaption}
              onChange={(e) => setSocialCaption(e.target.value)}
              placeholder="Write your social media post..."
              className="mt-2 min-h-[100px]"
            />
          </div>
        )}
      </div>

      <Card className="bg-[#135341]/5 border-[#135341]/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Send className="h-4 w-4 text-[#135341]" />
            <span className="font-medium text-[#135341] font-['Lato']">Campaign Preview</span>
          </div>
          <p className="text-sm text-gray-600 font-['Lato']">
            This campaign will reach approximately{' '}
            <span className="font-semibold text-[#09261E]">
              {targetAudience === 'all-buyers' ? '1,200+' : targetAudience === 'active-investors' ? '340' : '250'}
            </span>{' '}
            potential buyers via {campaignChannel === 'both' ? 'email and social media' : campaignChannel}.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderNewCampaign = () => (
    <div className="space-y-6">
      {/* Header with back button and progress */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              if (campaignStep === 1) {
                setCurrentView('main');
              } else {
                handleBack();
              }
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-xl font-semibold font-['League_Spartan'] text-[#09261E]">{getStepTitle()}</h2>
            <p className="text-sm text-gray-600 font-['Lato']">Step {campaignStep} of 4</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={cn(
                "w-8 h-2 rounded-full",
                step <= campaignStep ? "bg-[#135341]" : "bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {campaignStep === 1 && renderNewCampaignStep1()}
        {campaignStep === 2 && renderNewCampaignStep2()}
        {campaignStep === 3 && renderNewCampaignStep3()}
        {campaignStep === 4 && renderNewCampaignStep4()}
      </div>

      {/* Footer with navigation */}
      <div className="flex justify-between border-t pt-4">
        <Button 
          variant="outline" 
          onClick={handleBack}
          disabled={campaignStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {campaignStep < 4 ? (
          <Button 
            onClick={handleNext}
            className="bg-[#135341] hover:bg-[#09261E] text-white"
            disabled={
              (campaignStep === 1 && !selectedProperty) ||
              (campaignStep === 2 && (!campaignType || !campaignChannel))
            }
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline">
              Save Draft
            </Button>
            <Button 
              className="bg-[#135341] hover:bg-[#09261E] text-white"
              disabled={!campaignName || !targetAudience}
            >
              <Send className="h-4 w-4 mr-2" />
              Launch Campaign
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderAllCampaigns = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setCurrentView('main')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-xl font-semibold font-['League_Spartan'] text-[#09261E]">Campaign Manager</h2>
        </div>
        <Button 
          onClick={() => setCurrentView('new-campaign')}
          className="bg-[#135341] hover:bg-[#09261E] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {mockCampaigns.filter(c => c.status === 'active').map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex space-x-4">
                    <img 
                      src={campaign.property.thumbnail} 
                      alt={campaign.property.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="space-y-2">
                      <h3 className="font-semibold font-['League_Spartan'] text-[#09261E]">{campaign.name}</h3>
                      <p className="text-sm text-gray-600 font-['Lato']">{campaign.property.address}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          {campaign.channels.includes('email') && <Mail className="h-4 w-4 text-[#135341]" />}
                          {campaign.channels.includes('social') && <MessageSquare className="h-4 w-4 text-[#135341]" />}
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      {campaign.sent && (
                        <div className="flex space-x-4 text-sm text-gray-600">
                          <span>Sent: {campaign.sent}</span>
                          <span>Opens: {campaign.opens}</span>
                          <span>Clicks: {campaign.clicks}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Pause className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          {mockCampaigns.filter(c => c.status === 'scheduled').map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex space-x-4">
                    <img 
                      src={campaign.property.thumbnail} 
                      alt={campaign.property.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="space-y-2">
                      <h3 className="font-semibold font-['League_Spartan'] text-[#09261E]">{campaign.name}</h3>
                      <p className="text-sm text-gray-600 font-['Lato']">{campaign.property.address}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          {campaign.channels.includes('email') && <Mail className="h-4 w-4 text-[#135341]" />}
                          {campaign.channels.includes('social') && <MessageSquare className="h-4 w-4 text-[#135341]" />}
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                        <span className="text-sm text-gray-600 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {campaign.scheduledDate?.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {mockCampaigns.filter(c => c.status === 'completed').map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex space-x-4">
                    <img 
                      src={campaign.property.thumbnail} 
                      alt={campaign.property.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="space-y-2">
                      <h3 className="font-semibold font-['League_Spartan'] text-[#09261E]">{campaign.name}</h3>
                      <p className="text-sm text-gray-600 font-['Lato']">{campaign.property.address}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          {campaign.channels.includes('email') && <Mail className="h-4 w-4 text-[#135341]" />}
                          {campaign.channels.includes('social') && <MessageSquare className="h-4 w-4 text-[#135341]" />}
                        </div>
                        <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
                        <span className="text-sm text-gray-600">
                          {campaign.sentDate?.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex space-x-4 text-sm text-gray-600">
                        <span>Sent: {campaign.sent}</span>
                        <span>Opens: {campaign.opens} ({Math.round((campaign.opens! / campaign.sent!) * 100)}%)</span>
                        <span>Clicks: {campaign.clicks} ({Math.round((campaign.clicks! / campaign.sent!) * 100)}%)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderJVPartners = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setCurrentView('main')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-semibold font-['League_Spartan'] text-[#09261E]">JV Partnership</h2>
          <p className="text-sm text-gray-600 font-['Lato']">Collaborate with other sellers to co-market deals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Partner & Property Selection */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-['League_Spartan'] text-[#09261E]">Invite Partner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="partner-email" className="font-['Lato']">Partner Email or Username</Label>
                <Input 
                  id="partner-email"
                  value={jvPartnerEmail}
                  onChange={(e) => setJvPartnerEmail(e.target.value)}
                  placeholder="partner@example.com or @username"
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-['League_Spartan'] text-[#09261E]">Select Property</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockProperties.slice(0, 2).map((property) => (
                  <Card 
                    key={property.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 border-2",
                      selectedProperty === property.id 
                        ? "border-[#135341] bg-[#135341]/5" 
                        : "border-gray-200 hover:border-[#135341]/50"
                    )}
                    onClick={() => setSelectedProperty(property.id)}
                  >
                    <CardContent className="flex items-center space-x-3 p-3">
                      <img 
                        src={property.thumbnail} 
                        alt={property.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium font-['Lato'] text-[#09261E]">{property.title}</h4>
                        <p className="text-sm text-gray-600 font-['Lato']">${property.price.toLocaleString()}</p>
                      </div>
                      {selectedProperty === property.id && (
                        <Check className="h-5 w-5 text-[#135341]" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Campaign Details & Terms */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-['League_Spartan'] text-[#09261E]">JV Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={jvNotes}
                onChange={(e) => setJvNotes(e.target.value)}
                placeholder="Add notes about this partnership, campaign goals, or any special instructions..."
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-['League_Spartan'] text-[#09261E]">Partnership Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="jv-terms" className="font-['Lato']">Terms & Profit Share (Optional)</Label>
                <Textarea 
                  id="jv-terms"
                  value={jvTerms}
                  onChange={(e) => setJvTerms(e.target.value)}
                  placeholder="e.g., 50/50 split on assignment fee, partner handles social media..."
                  className="mt-2"
                />
              </div>

              <div className="space-y-3">
                <h4 className="font-medium font-['Lato'] text-[#09261E]">Permissions</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-['Lato']">Partner can edit campaign content</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-['Lato']">Partner can launch campaigns</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-['Lato']">Partner can view analytics</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-4 bg-[#135341]/5 rounded-lg">
                <input 
                  type="checkbox" 
                  id="jv-approval"
                  checked={jvApproved}
                  onChange={(e) => setJvApproved(e.target.checked)}
                  className="rounded border-[#135341]"
                />
                <Label htmlFor="jv-approval" className="text-sm font-['Lato']">
                  Both partners must approve before campaign launch
                </Label>
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full bg-[#135341] hover:bg-[#09261E] text-white"
            disabled={!jvPartnerEmail || !selectedProperty}
          >
            <Send className="h-4 w-4 mr-2" />
            Send JV Campaign Invite
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-[50%] top-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-0 border bg-[#F5F5F5] shadow-xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl max-h-[90vh] overflow-hidden text-[#09261E]">
        <div className="flex flex-col max-h-[90vh]">
          <div className="flex-1 overflow-y-auto">
            {currentView === 'main' && renderMainView()}
            {currentView === 'new-campaign' && renderNewCampaign()}
            {currentView === 'all-campaigns' && renderAllCampaigns()}
            {currentView === 'jv-partners' && renderJVPartners()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}