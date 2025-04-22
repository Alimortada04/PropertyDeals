import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Share2, Copy, Instagram, Facebook, Mail, Phone, Link2, 
  ArrowUpRight, LineChart, Users, Clock, Check, BarChart,
  Calendar, Image, CheckCircle2, ListFilter, Eye, Megaphone,
  MessageCircle, CalendarClock, ChevronDown
} from 'lucide-react';

// Mock property data for demonstration
const PROPERTY_DATA = [
  {
    id: 'prop001',
    title: 'Colonial Revival',
    address: '123 Main St, Chicago, IL 60601',
    price: 625000,
    contractPrice: 595000,
    beds: 5,
    baths: 3.5,
    sqft: 3200,
    status: 'Live',
    views: 42,
    inquiries: 8,
    daysListed: 12,
    offers: 3,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'
  },
  {
    id: 'prop002',
    title: 'Modern Farmhouse',
    address: '456 Oak St, Chicago, IL 60607',
    price: 459000,
    contractPrice: 425000,
    beds: 4,
    baths: 3,
    sqft: 2800,
    status: 'Under Contract',
    views: 68,
    inquiries: 12,
    daysListed: 5,
    offers: 7,
    imageUrl: 'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d'
  },
  {
    id: 'prop003',
    title: 'Modern Condo',
    address: '789 Pine Ave, Chicago, IL 60611',
    price: 339900,
    contractPrice: 321400,
    beds: 2,
    baths: 2,
    sqft: 1200,
    status: 'Assigned',
    views: 55,
    inquiries: 6,
    daysListed: 18,
    offers: 4,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
  }
];

// Marketing template data
const MARKETING_TEMPLATES = [
  {
    id: 'tpl001',
    title: 'Hot New Deal 🔥',
    description: 'Highlight the urgency and attractive aspects of a new listing',
    platforms: ['email', 'sms', 'social'],
    content: '🔥 Just listed: [ADDRESS] - [BEDS]BR, [PRICE], [CONDITION]. Cash buyers only! DM for access!',
  },
  {
    id: 'tpl002',
    title: 'Value Opportunity',
    description: 'Emphasize the investment potential and numbers',
    platforms: ['email', 'social'],
    content: '💰 Investment alert: [ADDRESS] • ARV: [ARV] • Asking: [PRICE] • Potential profit: [PROFIT] • [STATUS]',
  },
  {
    id: 'tpl003',
    title: 'Last Call',
    description: 'Create urgency for deals about to be assigned',
    platforms: ['email', 'sms', 'social'],
    content: '⏰ Closing soon! Final call for [ADDRESS] - [BEDS]BR/[BATHS]BA, [SQFT]sqft. Assignment at [PRICE]. Cash buyers ACT NOW!',
  },
  {
    id: 'tpl004',
    title: 'Bulk Deal Package',
    description: 'Promote multiple properties as a package',
    platforms: ['email'],
    content: '📦 BULK DEAL ALERT: [COUNT] properties available in [AREA]. Total value: [TOTAL_VALUE]. Package price: [PACKAGE_PRICE]. Serious investors only.',
  }
];

// Marketing metrics
const MARKETING_METRICS = {
  lastMonthShares: 34,
  lastMonthClicks: 156,
  conversionRate: 12.8,
  topPlatform: 'email',
  topTemplate: 'Hot New Deal 🔥',
  shareHistory: [
    { date: 'Apr 15', shares: 8, clicks: 42 },
    { date: 'Apr 16', shares: 5, clicks: 23 },
    { date: 'Apr 17', shares: 12, clicks: 68 },
    { date: 'Apr 18', shares: 4, clicks: 19 },
    { date: 'Apr 19', shares: 5, clicks: 4 },
  ]
};

// Buyer list data
const BUYER_LISTS = [
  { id: 'list001', name: 'Cash Buyers', count: 24, tags: ['verified', 'cash'] },
  { id: 'list002', name: 'Rehabbers', count: 18, tags: ['verified', 'rehab'] },
  { id: 'list003', name: 'Rental Investors', count: 32, tags: ['landlord', 'passive'] },
  { id: 'list004', name: 'First-Time Buyers', count: 15, tags: ['financing', 'owner-occupy'] },
];

export default function MarketingTab() {
  const [selectedProperty, setSelectedProperty] = useState(PROPERTY_DATA[0]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(MARKETING_TEMPLATES[0].id);
  const [customContent, setCustomContent] = useState('');
  const [selectedSharedMethod, setSelectedSharedMethod] = useState('social');
  const [editMode, setEditMode] = useState(false);
  
  // Find selected template
  const selectedTemplate = MARKETING_TEMPLATES.find(t => t.id === selectedTemplateId) || MARKETING_TEMPLATES[0];
  
  // Generate content based on selected property and template
  const generateContent = () => {
    let content = selectedTemplate.content;
    
    // Replace tokens with property data
    content = content
      .replace('[ADDRESS]', selectedProperty.address)
      .replace('[BEDS]', selectedProperty.beds.toString())
      .replace('[BATHS]', selectedProperty.baths.toString())
      .replace('[SQFT]', selectedProperty.sqft.toString())
      .replace('[PRICE]', formatCurrency(selectedProperty.price))
      .replace('[PROFIT]', formatCurrency(selectedProperty.price - selectedProperty.contractPrice))
      .replace('[STATUS]', selectedProperty.status)
      .replace('[CONDITION]', selectedProperty.status === 'Live' ? 'Ready for offers' : 'Under contract');
    
    return content;
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getCurrentContent = () => {
    return editMode ? customContent : generateContent();
  };
  
  const handlePropertyChange = (propertyId: string) => {
    const property = PROPERTY_DATA.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      // Reset custom content when property changes
      setCustomContent(generateContent());
    }
  };
  
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setCustomContent('');
    setEditMode(false);
  };
  
  const handleEditToggle = () => {
    if (!editMode) {
      // When switching to edit mode, set custom content to current generated content
      setCustomContent(generateContent());
    }
    setEditMode(!editMode);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCurrentContent());
    // Would add toast notification here in a real implementation
  };
  
  const renderSharePreview = () => {
    switch (selectedSharedMethod) {
      case 'social':
        return (
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-[#135341]/10 flex items-center justify-center">
                <Building className="h-5 w-5 text-[#135341]" />
              </div>
              <div>
                <p className="font-medium">Sarah's Real Estate Deals</p>
                <p className="text-xs text-gray-500">Just now</p>
              </div>
            </div>
            
            <p className="text-sm">{getCurrentContent()}</p>
            
            <div className="relative h-48 rounded-lg overflow-hidden">
              <img 
                src={selectedProperty.imageUrl} 
                alt={selectedProperty.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white font-bold">{selectedProperty.title}</p>
                <p className="text-white text-sm">{formatCurrency(selectedProperty.price)}</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" /> Contact
              </Button>
              <Button size="sm" className="flex-1 bg-[#135341]">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>
          </div>
        );
        
      case 'email':
        return (
          <div className="border rounded-lg p-4 space-y-4">
            <div className="border-b pb-3">
              <p className="text-sm font-medium">From: Sarah's Real Estate &lt;sarah@propertydeals.com&gt;</p>
              <p className="text-sm">To: Cash Buyers List (24 recipients)</p>
              <p className="text-sm font-medium mt-2">Subject: New Off-Market Deal - {selectedProperty.address}</p>
            </div>
            
            <div className="py-2">
              <p className="text-sm mb-4">Hello Cash Buyers,</p>
              <p className="text-sm mb-4">{getCurrentContent()}</p>
              <p className="text-sm mb-4">Check out the details below and contact me ASAP if interested.</p>
              
              <div className="border rounded-lg overflow-hidden mb-4">
                <div className="relative h-48">
                  <img 
                    src={selectedProperty.imageUrl} 
                    alt={selectedProperty.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 bg-gray-50">
                  <h3 className="font-bold">{selectedProperty.title}</h3>
                  <p className="text-sm text-gray-600">{selectedProperty.address}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="text-sm">Price: {formatCurrency(selectedProperty.price)}</p>
                      <p className="text-sm">{selectedProperty.beds} bed • {selectedProperty.baths} bath • {selectedProperty.sqft.toLocaleString()} sqft</p>
                    </div>
                    <Button size="sm" className="bg-[#135341]">View Deal</Button>
                  </div>
                </div>
              </div>
              
              <p className="text-sm">Best regards,</p>
              <p className="text-sm font-medium">Sarah</p>
              <p className="text-sm">PropertyDeals Wholesaler</p>
            </div>
          </div>
        );
        
      case 'sms':
        return (
          <div className="border rounded-lg p-4">
            <div className="bg-gray-100 rounded-lg p-3 max-w-[260px] mx-auto">
              <div className="bg-[#135341] text-white rounded-lg rounded-bl-none p-3 mb-2">
                {getCurrentContent()}
              </div>
              <div className="bg-[#135341] text-white rounded-lg rounded-bl-none p-3 mb-2">
                Click here to view: https://prpdls.co/p123
              </div>
              <p className="text-xs text-gray-500 text-right">Delivered • 12:45 PM</p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="shadow-md border">
        <CardHeader className="bg-[#135341]/5">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold text-[#135341]">Marketing Center</CardTitle>
              <CardDescription>Create and share marketing content for your properties</CardDescription>
            </div>
            <Button className="bg-[#135341]">
              <Share2 className="h-4 w-4 mr-2" /> Share Deal
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-6">
              <TabsTrigger value="create" className="data-[state=active]:bg-[#135341] data-[state=active]:text-white">
                Create & Share
              </TabsTrigger>
              <TabsTrigger value="metrics" className="data-[state=active]:bg-[#135341] data-[state=active]:text-white">
                Performance Metrics
              </TabsTrigger>
              <TabsTrigger value="lists" className="data-[state=active]:bg-[#135341] data-[state=active]:text-white">
                Buyer Lists
              </TabsTrigger>
            </TabsList>
            
            {/* Create & Share Tab */}
            <TabsContent value="create" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Property</Label>
                    <Select 
                      value={selectedProperty.id} 
                      onValueChange={handlePropertyChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a property" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPERTY_DATA.map((property) => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.title} - {property.address}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Message Template</Label>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleEditToggle}
                        className="h-7 text-xs"
                      >
                        {editMode ? 'Use Template' : 'Custom Edit'}
                      </Button>
                    </div>
                    
                    {!editMode ? (
                      <div className="space-y-2">
                        <Select 
                          value={selectedTemplateId} 
                          onValueChange={handleTemplateChange}
                          disabled={editMode}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a template" />
                          </SelectTrigger>
                          <SelectContent>
                            {MARKETING_TEMPLATES.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <p className="text-xs text-gray-500">
                          {selectedTemplate.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          {selectedTemplate.platforms.map(platform => {
                            const getColorForPlatform = (platform: string) => {
                              switch (platform) {
                                case 'email': return 'bg-blue-100 text-blue-700';
                                case 'social': return 'bg-purple-100 text-purple-700';
                                case 'sms': return 'bg-green-100 text-green-700';
                                default: return 'bg-gray-100 text-gray-700';
                              }
                            };
                            
                            return (
                              <Badge key={platform} variant="outline" className={`${getColorForPlatform(platform)} border-none`}>
                                {platform === 'social' ? 'Social Media' : 
                                 platform === 'email' ? 'Email' : 'SMS'}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <Textarea
                        value={customContent}
                        onChange={(e) => setCustomContent(e.target.value)}
                        className="min-h-[100px]"
                        placeholder="Write your custom marketing message here..."
                      />
                    )}
                  </div>
                  
                  <div className="p-3 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-sm font-medium">Preview Message</Label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={copyToClipboard}
                        className="h-7"
                      >
                        <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                      </Button>
                    </div>
                    <p className="text-sm p-2 bg-white border rounded-md">
                      {getCurrentContent()}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Share Via</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant={selectedSharedMethod === 'social' ? 'default' : 'outline'} 
                        className={selectedSharedMethod === 'social' ? 'bg-[#135341]' : ''} 
                        size="sm"
                        onClick={() => setSelectedSharedMethod('social')}
                      >
                        <Instagram className="h-4 w-4 mr-1" /> Social Media
                      </Button>
                      <Button 
                        variant={selectedSharedMethod === 'email' ? 'default' : 'outline'} 
                        className={selectedSharedMethod === 'email' ? 'bg-[#135341]' : ''} 
                        size="sm"
                        onClick={() => setSelectedSharedMethod('email')}
                      >
                        <Mail className="h-4 w-4 mr-1" /> Email
                      </Button>
                      <Button 
                        variant={selectedSharedMethod === 'sms' ? 'default' : 'outline'} 
                        className={selectedSharedMethod === 'sms' ? 'bg-[#135341]' : ''} 
                        size="sm"
                        onClick={() => setSelectedSharedMethod('sms')}
                      >
                        <Phone className="h-4 w-4 mr-1" /> SMS
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-2 border-t pt-3">
                    <div className="flex items-center space-x-2">
                      <Switch id="attach-image" />
                      <Label htmlFor="attach-image">Attach property image</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="include-financials" />
                      <Label htmlFor="include-financials">Include financials (ARV, profit potential)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="track-clicks" defaultChecked />
                      <Label htmlFor="track-clicks">Track clicks with shortened URL</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <Button className="w-full bg-[#135341]">
                      <Share2 className="h-4 w-4 mr-2" /> Share Now
                    </Button>
                    <Button variant="outline" className="w-full">
                      <CalendarClock className="h-4 w-4 mr-2" /> Schedule Send
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Preview</Label>
                      <Badge variant="outline" className="font-normal">
                        {selectedSharedMethod === 'social' ? 'Social Media Post' :
                         selectedSharedMethod === 'email' ? 'Email Template' : 'SMS Message'}
                      </Badge>
                    </div>
                    {renderSharePreview()}
                  </div>
                  
                  <div className="p-3 border rounded-lg bg-gray-50">
                    <h3 className="text-sm font-medium mb-2">Distribution</h3>
                    <div className="space-y-2">
                      <Select defaultValue="cash-buyers">
                        <SelectTrigger>
                          <SelectValue placeholder="Select recipient list" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash-buyers">Cash Buyers (24)</SelectItem>
                          <SelectItem value="rehabbers">Rehabbers (18)</SelectItem>
                          <SelectItem value="rental">Rental Investors (32)</SelectItem>
                          <SelectItem value="all">All Buyers (89)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        This message will be sent to all buyers in the selected list.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Performance Metrics Tab */}
            <TabsContent value="metrics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="border-l-4 border-l-[#135341]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
                    <Share2 className="h-4 w-4 text-[#135341]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{MARKETING_METRICS.lastMonthShares}</div>
                    <p className="text-xs text-muted-foreground">
                      Last 30 days
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-[#135341]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                    <ArrowUpRight className="h-4 w-4 text-[#135341]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{MARKETING_METRICS.lastMonthClicks}</div>
                    <p className="text-xs text-muted-foreground">
                      Last 30 days
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-[#135341]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <LineChart className="h-4 w-4 text-[#135341]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{MARKETING_METRICS.conversionRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      Clicks to offers
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-[#135341]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top Channel</CardTitle>
                    <Megaphone className="h-4 w-4 text-[#135341]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold capitalize">{MARKETING_METRICS.topPlatform}</div>
                    <p className="text-xs text-muted-foreground">
                      Best performing
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="text-lg">Performance History</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <div className="text-center text-gray-500 w-full">
                      <BarChart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <p>Click metrics visualization would appear here</p>
                      <p className="text-sm">Showing daily performance data for the last 30 days</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Top Performing Content</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Best Template</h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {MARKETING_METRICS.topTemplate}
                            </Badge>
                            <span className="text-sm font-medium text-green-600">+24% CTR</span>
                          </div>
                          <p className="text-xs text-gray-500 italic mb-2">
                            "🔥 Just listed: 123 Main St - 5BR, $625,000, Ready for offers. Cash buyers only! DM for access!"
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>12 shares</span>
                            <span>67 clicks</span>
                            <span>5.6 clicks/share</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Best Performing Property</h4>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border">
                          <div className="h-14 w-14 rounded-md overflow-hidden flex-shrink-0">
                            <img
                              src="https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d"
                              alt="Modern Farmhouse"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">Modern Farmhouse</p>
                            <p className="text-xs text-gray-500 truncate">456 Oak St, Chicago, IL 60607</p>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline" className="mr-1 text-xs">68 views</Badge>
                              <Badge variant="outline" className="mr-1 text-xs">7 offers</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button variant="outline" className="w-full">
                          <FileText className="h-4 w-4 mr-2" /> Export Full Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Buyer Lists Tab */}
            <TabsContent value="lists" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Buyer Lists</h3>
                  <p className="text-sm text-gray-500">Manage your buyer distribution lists</p>
                </div>
                <Button className="bg-[#135341]">
                  <Users className="h-4 w-4 mr-2" /> Create New List
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {BUYER_LISTS.map(list => (
                  <Card key={list.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{list.name}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit List</DropdownMenuItem>
                            <DropdownMenuItem>Export Contacts</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Delete List</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription>{list.count} buyers</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {list.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="bg-gray-100 text-gray-700">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="h-1 w-full bg-gray-100 mb-2">
                        <div 
                          className="h-1 bg-[#135341]" 
                          style={{ width: `${Math.round((list.count / 35) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Activity: Medium</span>
                        <span>Open Rate: 52%</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="w-full flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button size="sm" className="flex-1 bg-[#135341]">
                          <Megaphone className="h-4 w-4 mr-1" /> Blast
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
                
                {/* Add New List Card */}
                <Card className="hover:shadow-md transition-shadow border border-dashed border-gray-300 flex flex-col justify-center items-center p-6 h-full cursor-pointer">
                  <div className="h-12 w-12 rounded-full bg-[#135341]/10 flex items-center justify-center mb-3">
                    <Plus className="h-6 w-6 text-[#135341]" />
                  </div>
                  <p className="font-medium text-lg text-[#135341] mb-1">Add New List</p>
                  <p className="text-sm text-gray-500 text-center mb-3">Create a custom list of buyers</p>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-1" /> Create List
                  </Button>
                </Card>
              </div>
              
              <Card className="bg-gray-50 border p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Import Your Existing Buyers</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      You can import your existing buyer contacts from CSV, Excel, or directly from your CRM.
                    </p>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-1" /> Import Contacts
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Import the Info and Building components that were missing
import { Info, Building } from 'lucide-react';