import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  Clock,
  X,
  ChevronRight
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
  { id: '2', title: 'Urban Loft', address: '456 City Ave, Midtown', price: 195000, status: 'Live', thumbnail: '/api/placeholder/150/100' },
  { id: '3', title: 'Suburban Ranch', address: '789 Oak Dr, Suburbs', price: 320000, status: 'Live', thumbnail: '/api/placeholder/150/100' }
];

const mockCampaigns = [
  {
    id: '1',
    name: 'Modern Farmhouse - New Deal',
    property: mockProperties[0],
    channels: ['email', 'social'],
    status: 'active',
    sent: 1250,
    opens: 320,
    clicks: 85,
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
  
  // Campaign Manager State - moved to top level to fix hooks error
  const [activeTab, setActiveTab] = useState('active');
  
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
      setSelectedProperty('');
      setCampaignChannel('email');
      setCampaignType('new-deal');
      setUseAITemplate(false);
      setAITemplate('investor-focus');
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

  const generateAIContent = () => {
    const property = mockProperties.find(p => p.id === selectedProperty);
    if (!property) return;

    const templates = {
      'new-deal': {
        subject: `🏡 NEW DEAL ALERT: ${property.title} - ${property.price.toLocaleString()}`,
        email: `Exciting new opportunity just hit the market!\n\n${property.title}\n📍 ${property.address}\n💰 $${property.price.toLocaleString()}\n\nThis won't last long. Schedule your showing today!`,
        social: `🚨 NEW DEAL ALERT! ${property.title} just listed at $${property.price.toLocaleString()}. Prime location, incredible value. DM for details! #NewListing #RealEstate`
      },
      'price-drop': {
        subject: `💥 PRICE DROP: ${property.title} - Now ${property.price.toLocaleString()}`,
        email: `Great news! Price just dropped on this amazing property.\n\n${property.title}\n📍 ${property.address}\n💰 NEW PRICE: $${property.price.toLocaleString()}\n\nDon't miss this opportunity - reduced to sell fast!`,
        social: `💥 PRICE DROP ALERT! ${property.title} just reduced to $${property.price.toLocaleString()}. Seller is motivated! #PriceDrop #Deal`
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-5 pb-2 border-b bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2">
              <p className="text-lg font-['Lato'] text-gray-600">
                Welcome back, <span className="font-semibold text-[#09261E]">Alex</span> 👋
              </p>
              <p className="text-sm text-gray-500 font-['Lato']">
                You currently have <span className="font-medium text-[#135341]">2 active campaigns</span> and <span className="font-medium text-[#135341]">1 JV in progress</span>.
              </p>
            </div>
            <h2 className="text-2xl font-bold font-['League_Spartan'] text-[#09261E]">Marketing Center</h2>
            <p className="text-gray-600 mt-1 font-['Lato']">Launch campaigns, manage marketing, and collaborate with partners</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto px-4 sm:px-6 py-8 flex-1 min-h-0 relative">
        {/* Subtle Background Shape */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-[#135341]/5 via-[#09261E]/3 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="flex flex-col items-center justify-center text-center relative">
          <div className="space-y-6 max-w-4xl w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* New Campaign Card */}
              <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-[#135341] group"
            onClick={() => setCurrentView('new-campaign')}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-[#135341] rounded-xl mx-auto flex items-center justify-center group-hover:bg-[#09261E] transition-colors mb-2">
                <Plus className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-[#09261E] font-['League_Spartan'] mt-1.5">New Campaign</CardTitle>
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
              <div className="w-16 h-16 bg-[#135341] rounded-xl mx-auto flex items-center justify-center group-hover:bg-[#09261E] transition-colors mb-2">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-[#09261E] font-['League_Spartan'] mt-1.5">All Campaigns</CardTitle>
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
              <div className="w-16 h-16 bg-[#135341] rounded-xl mx-auto flex items-center justify-center group-hover:bg-[#09261E] transition-colors mb-2">
                <Users className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-[#09261E] font-['League_Spartan'] mt-1.5">JV Partners</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 text-sm font-['Lato']">Collaborate with other sellers to co-market a deal</p>
            </CardContent>
          </Card>
            </div>
            
            {/* Mini Tips / Stats */}
            <div className="text-sm text-gray-400 mt-8 space-y-2">
              <p className="flex items-center justify-center gap-2">
                <span>💡</span>
                <span>Tip: JV campaigns are shared with both audiences — double your reach.</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <span>📊</span>
                <span>You've launched 3 campaigns this month — keep it going!</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky Call-to-Action Footer */}
      <div className="border-t px-4 sm:px-6 py-4 bg-gray-50/50">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2 font-['Lato']">
            Need help launching your first campaign?
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-[#135341] border-[#135341] hover:bg-[#135341] hover:text-white font-['Lato']"
          >
            View Marketing Guide
          </Button>
        </div>
      </div>
    </div>
  );

  const renderNewCampaignStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium font-['Lato']">Select Property to Market</Label>
        <p className="text-sm text-gray-600 mb-4 font-['Lato']">Choose from your active listings</p>
        <div className="grid gap-3">
          {mockProperties.map((property) => (
            <Card 
              key={property.id} 
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                selectedProperty === property.id ? "ring-2 ring-[#135341] border-[#135341]" : "border-gray-200"
              )}
              onClick={() => setSelectedProperty(property.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={property.thumbnail} 
                    alt={property.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#09261E] font-['League_Spartan']">{property.title}</h4>
                    <p className="text-sm text-gray-600 font-['Lato']">{property.address}</p>
                    <p className="text-lg font-bold text-[#135341] font-['League_Spartan']">${property.price.toLocaleString()}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{property.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNewCampaignStep2 = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium font-['Lato']">Campaign Type</Label>
        <p className="text-sm text-gray-600 mb-4 font-['Lato']">What kind of campaign are you creating?</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: 'new-deal', label: 'New Deal', description: 'Announce a new property listing' },
            { value: 'price-drop', label: 'Price Drop', description: 'Alert about a price reduction' },
            { value: 'final-call', label: 'Final Call', description: 'Last chance urgency campaign' },
            { value: 'under-contract', label: 'Under Contract', description: 'Announce a successful sale' }
          ].map((type) => (
            <Card 
              key={type.value}
              className={cn(
                "cursor-pointer transition-all duration-200",
                campaignType === type.value ? "ring-2 ring-[#135341] border-[#135341]" : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => setCampaignType(type.value as CampaignType)}
            >
              <CardContent className="p-4 text-center">
                <h4 className="font-medium text-[#09261E] font-['League_Spartan']">{type.label}</h4>
                <p className="text-xs text-gray-600 mt-1 font-['Lato']">{type.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium font-['Lato']">Marketing Channels</Label>
        <p className="text-sm text-gray-600 mb-4 font-['Lato']">Where do you want to promote this campaign?</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 'email', label: 'Email Only', icon: Mail },
            { value: 'social', label: 'Social Only', icon: MessageSquare },
            { value: 'both', label: 'Email + Social', icon: Send }
          ].map((channel) => (
            <Card 
              key={channel.value}
              className={cn(
                "cursor-pointer transition-all duration-200",
                campaignChannel === channel.value ? "ring-2 ring-[#135341] border-[#135341]" : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => setCampaignChannel(channel.value as CampaignChannel)}
            >
              <CardContent className="p-4 text-center">
                <channel.icon className="h-8 w-8 mx-auto mb-2 text-[#135341]" />
                <h4 className="font-medium text-[#09261E] font-['League_Spartan']">{channel.label}</h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNewCampaignStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Switch 
          checked={useAITemplate}
          onCheckedChange={setUseAITemplate}
        />
        <div>
          <Label className="text-base font-medium font-['Lato']">Use AI Content Generator</Label>
          <p className="text-sm text-gray-600 font-['Lato']">Let AI create optimized content for your campaign</p>
        </div>
      </div>

      {useAITemplate && (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium font-['Lato']">AI Template Style</Label>
            <Select value={aiTemplate} onValueChange={setAITemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Choose template style" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(aiTemplates).map(([key, template]) => (
                  <SelectItem key={key} value={key}>
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-gray-500">{template.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={generateAIContent}
            disabled={!selectedProperty}
            className="w-full bg-[#135341] hover:bg-[#09261E]"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate AI Content
          </Button>
        </div>
      )}

      <div className="text-center text-sm text-gray-500 font-['Lato']">
        {useAITemplate ? 'AI will generate content on the next step' : 'You can write custom content on the next step'}
      </div>
    </div>
  );

  const renderNewCampaignStep4 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="campaign-name" className="text-base font-medium font-['Lato']">Campaign Name</Label>
        <Input
          id="campaign-name"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          placeholder="Give your campaign a name..."
          className="mt-2"
        />
      </div>

      {(campaignChannel === 'email' || campaignChannel === 'both') && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-['League_Spartan'] text-[#09261E]">Email Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email-subject" className="font-['Lato']">Subject Line</Label>
              <Input
                id="email-subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter email subject..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email-content" className="font-['Lato']">Email Body</Label>
              <Textarea
                id="email-content"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Write your email content..."
                rows={5}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {(campaignChannel === 'social' || campaignChannel === 'both') && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-['League_Spartan'] text-[#09261E]">Social Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="social-caption" className="font-['Lato']">Caption</Label>
              <Textarea
                id="social-caption"
                value={socialCaption}
                onChange={(e) => setSocialCaption(e.target.value)}
                placeholder="Write your social media caption..."
                rows={4}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-['League_Spartan'] text-[#09261E]">Target Audience</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            id="target-audience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="e.g., First-time buyers, Investors, etc."
          />
          <p className="text-sm text-gray-600 mt-2 font-['Lato']">Optional: Specify who this campaign targets</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderNewCampaign = () => (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <header className="border-b bg-white px-4 sm:px-6 pt-5 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => campaignStep === 1 ? setCurrentView('main') : handleBack()}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {campaignStep === 1 ? 'Back to Main' : 'Back'}
            </Button>
            <div>
              <h2 className="text-xl font-semibold font-['League_Spartan'] text-[#09261E]">New Campaign</h2>
              <p className="text-sm text-gray-600 font-['Lato']">Step {campaignStep} of 4: {getStepTitle()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Step indicators */}
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  step <= campaignStep 
                    ? "bg-[#135341] text-white" 
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="overflow-y-auto flex-1 px-4 sm:px-6 py-4 min-h-0">
        {campaignStep === 1 && renderNewCampaignStep1()}
        {campaignStep === 2 && renderNewCampaignStep2()}
        {campaignStep === 3 && renderNewCampaignStep3()}
        {campaignStep === 4 && renderNewCampaignStep4()}
      </main>

      {/* Fixed Footer */}
      <footer className="border-t px-4 sm:px-6 py-4 bg-white">
        <div className="flex justify-between flex-wrap gap-3">
          <div>
            {campaignStep < 4 && (
              <Button variant="outline" onClick={() => setCurrentView('main')} className="hover:bg-gray-100">
                Save Draft
              </Button>
            )}
          </div>
          <div className="flex space-x-3">
            {campaignStep < 4 ? (
              <Button 
                onClick={handleNext}
                disabled={
                  (campaignStep === 1 && !selectedProperty) ||
                  (campaignStep === 2 && (!campaignType || !campaignChannel))
                }
                className="bg-[#135341] hover:bg-[#09261E] text-white"
              >
                Next Step
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <div className="flex space-x-3">
                <Button variant="outline" className="hover:bg-gray-100">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Later
                </Button>
                <Button 
                  className="bg-[#135341] hover:bg-[#09261E] text-white"
                  disabled={!campaignName || (!emailSubject && !socialCaption)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Launch Campaign
                </Button>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );

  const renderAllCampaigns = () => {
    const activeCampaigns = mockCampaigns.filter(c => c.status === 'active');
    const scheduledCampaigns = mockCampaigns.filter(c => c.status === 'scheduled');
    const pastCampaigns = mockCampaigns.filter(c => c.status === 'completed');

    return (
      <div className="flex flex-col h-full">
        {/* Fixed Header */}
        <header className="border-b bg-white px-4 sm:px-6 pt-5 pb-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setCurrentView('main')}
                className="hover:bg-gray-100"
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

          {/* Pill-style Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('active')}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                activeTab === 'active'
                  ? "bg-white text-[#09261E] shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              Active ({activeCampaigns.length})
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                activeTab === 'scheduled'
                  ? "bg-white text-[#09261E] shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              Scheduled ({scheduledCampaigns.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                activeTab === 'past'
                  ? "bg-white text-[#09261E] shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              Past ({pastCampaigns.length})
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="overflow-y-auto flex-1 px-4 sm:px-6 py-4 space-y-4 min-h-0">
          {activeTab === 'active' && activeCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
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
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Sent: {campaign.sent}</span>
                          <span>Opens: {campaign.opens}</span>
                          <span>Clicks: {campaign.clicks}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="hover:bg-gray-100">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="hover:bg-gray-100">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="hover:bg-gray-100">
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {activeTab === 'scheduled' && scheduledCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
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
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                      <Play className="h-4 w-4 mr-1" />
                      Send Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {activeTab === 'past' && pastCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
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
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Sent: {campaign.sent}</span>
                        <span>Opens: {campaign.opens}</span>
                        <span>Clicks: {campaign.clicks}</span>
                        <span className="text-[#135341] font-medium">
                          {Math.round((campaign.clicks! / campaign.sent!) * 100)}% CTR
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-1" />
                      Duplicate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </main>
      </div>
    );
  };

  const renderJVPartners = () => (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <header className="border-b bg-white px-4 sm:px-6 pt-5 pb-2">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setCurrentView('main')}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-xl font-semibold font-['League_Spartan'] text-[#09261E]">JV Partners</h2>
            <p className="text-sm text-gray-600 font-['Lato']">Collaborate with other sellers to co-market deals</p>
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="overflow-y-auto flex-1 px-4 sm:px-6 py-4 space-y-6 min-h-0">
        {/* Invite Partner Card */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="font-['League_Spartan'] text-[#09261E]">Invite JV Partner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <div>
              <Label htmlFor="jv-email" className="font-['Lato']">Partner Email</Label>
              <Input
                id="jv-email"
                type="email"
                value={jvPartnerEmail}
                onChange={(e) => setJvPartnerEmail(e.target.value)}
                placeholder="Enter partner's email address"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="jv-property" className="font-['Lato']">Select Property to Co-Market</Label>
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a property" />
                </SelectTrigger>
                <SelectContent>
                  {mockProperties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.title} - ${property.price.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* JV Notes Card */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="font-['League_Spartan'] text-[#09261E]">JV Notes</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <Textarea
              value={jvNotes}
              onChange={(e) => setJvNotes(e.target.value)}
              placeholder="Add notes about this joint venture partnership..."
              rows={4}
            />
            <p className="text-sm text-gray-600 mt-2 font-['Lato']">Share details about the partnership approach</p>
          </CardContent>
        </Card>

        {/* Partnership Terms Card */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="font-['League_Spartan'] text-[#09261E]">Partnership Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <Textarea
              value={jvTerms}
              onChange={(e) => setJvTerms(e.target.value)}
              placeholder="Outline the terms of your joint venture (commission split, responsibilities, etc.)"
              rows={5}
            />
            
            <div className="flex items-center space-x-3 pt-2">
              <Switch checked={jvApproved} onCheckedChange={setJvApproved} />
              <Label className="font-['Lato'] text-sm">I agree to the partnership terms outlined above</Label>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Fixed Footer */}
      <footer className="border-t px-4 sm:px-6 py-4 bg-white">
        <Button 
          className="w-full bg-[#135341] hover:bg-[#09261E] text-white font-['Lato']"
          disabled={!jvPartnerEmail || !selectedProperty}
        >
          <Send className="h-4 w-4 mr-2" />
          Send JV Campaign Invite
        </Button>
      </footer>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed max-w-[800px] w-full h-[90vh] rounded-2xl shadow-xl bg-white overflow-hidden flex flex-col text-[#09261E] p-0">
        <DialogTitle className="sr-only">Marketing Center</DialogTitle>
        <DialogDescription className="sr-only">Comprehensive marketing tools for your property listings</DialogDescription>
        {currentView === 'main' && renderMainView()}
        {currentView === 'new-campaign' && renderNewCampaign()}
        {currentView === 'all-campaigns' && renderAllCampaigns()}
        {currentView === 'jv-partners' && renderJVPartners()}
      </DialogContent>
    </Dialog>
  );
}