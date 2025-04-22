import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Building, Text, Image as ImageIcon, FileText as FileTextIcon, Upload as UploadIcon, Phone, 
  Mail, ArrowRight, Megaphone, Info, Share2, ScreenShare, Plus, 
  Facebook, SendHorizontal, Copy
} from "lucide-react";

// Mock property data for the marketing tab
const MARKETING_PROPERTIES = [
  {
    id: 'prop001',
    title: 'Colonial Revival',
    address: '123 Main St, Chicago, IL 60601',
    price: 625000,
    beds: 5,
    baths: 3.5,
    sqft: 3200,
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'
  },
  {
    id: 'prop002',
    title: 'Modern Farmhouse',
    address: '456 Oak St, Chicago, IL 60607',
    price: 459000,
    beds: 4,
    baths: 3,
    sqft: 2800,
    thumbnail: 'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d'
  }
];

// Social media post templates
const POST_TEMPLATES = [
  {
    id: 'template001',
    title: 'Off-Market Deal Alert',
    content: '🔥 OFF-MARKET DEAL ALERT 🔥\n\nJust secured a great off-market property in [NEIGHBORHOOD]!\n\n🏠 [BEDROOMS] bed, [BATHROOMS] bath, [SQFT] sqft\n💰 Only $[PRICE]\n🚀 Estimated ARV: $[ARV]\n\nThis won\'t last! Serious investors only.\nDM me for details before it\'s gone!\n\n#realestateinvesting #offmarket #wholesaling'
  },
  {
    id: 'template002',
    title: 'Rental Cash Flow',
    content: '💵 CASH FLOW MACHINE 💵\n\nCash-flowing rental in [NEIGHBORHOOD] ready for a new investor!\n\n🏠 [BEDROOMS]BD/[BATHROOMS]BA [PROPERTY_TYPE]\n💰 Purchase: $[PRICE]\n💸 Est. Monthly Rent: $[RENT]\n📊 Cap Rate: [CAP_RATE]%\n\nTenants already in place! This is perfect for investors looking for immediate income.\n\n#rentalinvestment #cashflow #realestate'
  },
  {
    id: 'template003',
    title: 'Rehab Opportunity',
    content: '🔨 REHAB OPPORTUNITY! 🔨\n\nMajor upside potential in [NEIGHBORHOOD]!\n\n🏠 [BEDROOMS]BD/[BATHROOMS]BA, [SQFT] sqft\n💰 Contract Price: $[PRICE]\n💎 Estimated ARV: $[ARV]\n\nNeeds [REHAB_LEVEL] rehab. Perfect for flippers and BRRRR investors.\n\nMessage me for comps and rehab estimates!\n\n#fixandflip #rehabproperty #brrrrmethod'
  }
];

export default function MarketingTab() {
  const [selectedProperty, setSelectedProperty] = React.useState(MARKETING_PROPERTIES[0]);
  const [selectedTemplate, setSelectedTemplate] = React.useState<any>(null);
  const [socialPost, setSocialPost] = React.useState('');

  // Replace template placeholders with property data
  const applyTemplate = (template: any) => {
    if (!selectedProperty) return;
    
    setSelectedTemplate(template);
    
    let postContent = template.content;
    postContent = postContent.replace('[NEIGHBORHOOD]', selectedProperty.address.split(',')[1].trim());
    postContent = postContent.replace('[BEDROOMS]', selectedProperty.beds);
    postContent = postContent.replace('[BATHROOMS]', selectedProperty.baths);
    postContent = postContent.replace('[SQFT]', selectedProperty.sqft.toLocaleString());
    postContent = postContent.replace('[PRICE]', Math.round(selectedProperty.price/1000) + 'K');
    postContent = postContent.replace('[ARV]', Math.round(selectedProperty.price * 1.2/1000) + 'K');
    postContent = postContent.replace('[PROPERTY_TYPE]', 'Single-Family Home');
    postContent = postContent.replace('[RENT]', Math.round(selectedProperty.price * 0.008).toLocaleString());
    postContent = postContent.replace('[CAP_RATE]', '7.5');
    postContent = postContent.replace('[REHAB_LEVEL]', 'medium');
    
    setSocialPost(postContent);
  };

  // Generate a formatted email
  const generateEmail = () => {
    if (!selectedProperty) return '';
    
    return `Subject: Off-Market Deal in ${selectedProperty.address.split(',')[1].trim()} - ${selectedProperty.beds}BD/${selectedProperty.baths}BA

Hi [Buyer Name],

I have an exclusive off-market property that might be perfect for your investment criteria. This is a ${selectedProperty.beds} bedroom, ${selectedProperty.baths} bathroom property located in ${selectedProperty.address.split(',')[1].trim()}.

Property Details:
• Address: ${selectedProperty.address}
• Price: $${selectedProperty.price.toLocaleString()}
• Square Footage: ${selectedProperty.sqft.toLocaleString()}
• Configuration: ${selectedProperty.beds}BD/${selectedProperty.baths}BA

I have all the property details, photos, and inspection reports ready to share with serious buyers. This property won't last long at this price point.

Are you interested in learning more? I can send over the complete property packet or set up a time to walk through the property.

Best,
[Your Name]
[Your Phone]
[Your Email]
`;
  };

  // Handle property selection
  const handlePropertySelect = (property: any) => {
    setSelectedProperty(property);
    if (selectedTemplate) {
      applyTemplate(selectedTemplate);
    }
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="social" className="w-full">
        <div className="mb-4 border-b">
          <TabsList className="w-full p-0">
            <TabsTrigger 
              value="social" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#135341] data-[state=active]:text-[#135341] rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 py-2 font-medium"
            >
              Social Media
            </TabsTrigger>
            <TabsTrigger 
              value="email" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#135341] data-[state=active]:text-[#135341] rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 py-2 font-medium"
            >
              Email Templates
            </TabsTrigger>
            <TabsTrigger 
              value="sms" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#135341] data-[state=active]:text-[#135341] rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 py-2 font-medium"
            >
              SMS Campaigns
            </TabsTrigger>
            <TabsTrigger 
              value="crm" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#135341] data-[state=active]:text-[#135341] rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 py-2 font-medium"
            >
              CRM Export
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="social" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">Select Property</Label>
                <div className="space-y-2">
                  {MARKETING_PROPERTIES.map(property => (
                    <Card 
                      key={property.id} 
                      className={`cursor-pointer hover:border-[#135341] transition-colors ${selectedProperty?.id === property.id ? 'border-[#135341] bg-[#135341]/5' : ''}`}
                      onClick={() => handlePropertySelect(property)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 rounded-md overflow-hidden flex-shrink-0">
                            <img src={property.thumbnail} alt={property.title} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{property.title}</h4>
                            <p className="text-xs text-gray-500 truncate">{property.address}</p>
                            <p className="text-xs font-medium">${property.price.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-semibold mb-2 block">Post Templates</Label>
                <div className="space-y-2">
                  {POST_TEMPLATES.map(template => (
                    <Card 
                      key={template.id} 
                      className={`cursor-pointer hover:border-[#135341] transition-colors ${selectedTemplate?.id === template.id ? 'border-[#135341] bg-[#135341]/5' : ''}`}
                      onClick={() => applyTemplate(template)}
                    >
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm">{template.title}</h4>
                        <p className="text-xs text-gray-500 truncate mt-1">{template.content.substring(0, 60)}...</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Megaphone className="h-5 w-5 mr-2 text-[#135341]" /> Social Media Post
                  </CardTitle>
                  <CardDescription>Customize your post and share to social platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 border-b pb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-[#135341] text-white">SW</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-sm">Sarah Wholesaler</h4>
                        <p className="text-xs text-gray-500">Real Estate Investor • Chicago, IL</p>
                      </div>
                    </div>
                    
                    <Textarea 
                      className="min-h-[200px]" 
                      placeholder="Write your post or select a template..." 
                      value={socialPost}
                      onChange={(e) => setSocialPost(e.target.value)}
                    />
                    
                    {selectedProperty && (
                      <div className="border rounded-md overflow-hidden">
                        <img src={selectedProperty.thumbnail} alt={selectedProperty.title} className="w-full h-48 object-cover" />
                        <div className="p-3 border-t">
                          <h4 className="font-medium">{selectedProperty.title}</h4>
                          <p className="text-sm text-gray-500">{selectedProperty.address}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-sm">
                              <span className="font-medium">${selectedProperty.price.toLocaleString()}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {selectedProperty.beds} BD | {selectedProperty.baths} BA | {selectedProperty.sqft.toLocaleString()} sqft
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex-col space-y-3">
                  <div className="flex items-center space-x-2 w-full">
                    <Button className="flex-1 bg-[#1877F2] hover:bg-[#1877F2]/90">
                      <Facebook className="h-4 w-4 mr-2" /> Post to Facebook
                    </Button>
                    <Button className="flex-1 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90">
                      Twitter <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button className="bg-[#0A66C2] hover:bg-[#0A66C2]/90">
                      LinkedIn
                    </Button>
                  </div>
                  <div className="flex w-full space-x-2">
                    <Button variant="outline" className="flex-1">
                      <Copy className="h-4 w-4 mr-2" /> Copy to Clipboard
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" /> Share Link
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="email" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">Select Property</Label>
                <div className="space-y-2">
                  {MARKETING_PROPERTIES.map(property => (
                    <Card 
                      key={property.id} 
                      className={`cursor-pointer hover:border-[#135341] transition-colors ${selectedProperty?.id === property.id ? 'border-[#135341] bg-[#135341]/5' : ''}`}
                      onClick={() => handlePropertySelect(property)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 rounded-md overflow-hidden flex-shrink-0">
                            <img src={property.thumbnail} alt={property.title} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{property.title}</h4>
                            <p className="text-xs text-gray-500 truncate">{property.address}</p>
                            <p className="text-xs font-medium">${property.price.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-semibold mb-2 block">Email Templates</Label>
                <div className="space-y-2">
                  <Card 
                    className="cursor-pointer hover:border-[#135341] transition-colors border-[#135341] bg-[#135341]/5"
                  >
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm">Property Announcement</h4>
                      <p className="text-xs text-gray-500 truncate mt-1">For notifying your buyer list about a new off-market property</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:border-[#135341] transition-colors">
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm">Investor Pitch Email</h4>
                      <p className="text-xs text-gray-500 truncate mt-1">Detailed pitch with ROI and market analysis</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:border-[#135341] transition-colors">
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm">Viewing Schedule</h4>
                      <p className="text-xs text-gray-500 truncate mt-1">To organize property viewings with multiple buyers</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-[#135341]" /> Email Template
                  </CardTitle>
                  <CardDescription>Edit this template to email your buyers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="email-to">To</Label>
                          <Input id="email-to" placeholder="Recipient or List Name" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="email-subject">Subject</Label>
                          <Input id="email-subject" value={selectedProperty ? `Off-Market Deal in ${selectedProperty.address.split(',')[1].trim()} - ${selectedProperty.beds}BD/${selectedProperty.baths}BA` : ''} />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="email-body">Email Body</Label>
                        <Textarea 
                          id="email-body" 
                          className="min-h-[300px] font-mono text-sm" 
                          value={generateEmail()}
                        />
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">Attachments</h4>
                        <Button variant="ghost" size="sm" className="h-8">
                          <Plus className="h-4 w-4 mr-1" /> Add File
                        </Button>
                      </div>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center">
                            <FileTextIcon className="h-4 w-4 text-blue-500 mr-2" />
                            <span className="text-sm">Property_Details.pdf</span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">×</Button>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center">
                            <ImageIcon className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm">PropertyPhotos.zip</span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">×</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex space-x-2">
                  <Button className="bg-[#135341] hover:bg-[#135341]/90 flex-1">
                    <SendHorizontal className="h-4 w-4 mr-2" /> Send Email
                  </Button>
                  <Button variant="outline">Save Template</Button>
                  <Button variant="outline">Schedule</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sms" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-[#135341]" /> SMS Campaign Builder
                </CardTitle>
                <CardDescription>Create text message campaigns for your buyer list</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Campaign Name</Label>
                    <Input placeholder="April 2025 Deals Announcement" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Select Properties</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {MARKETING_PROPERTIES.map(property => (
                        <div key={property.id} className="flex items-center space-x-2 border rounded p-2">
                          <input type="checkbox" id={`sms-${property.id}`} className="rounded" />
                          <Label htmlFor={`sms-${property.id}`} className="text-sm leading-none">
                            {property.title}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>SMS Text (160 char per message)</Label>
                    <Textarea placeholder="New off-market deal available! 3BD/2BA house in Chicago for $375K. 15% below market! Reply DETAILS for info packet or call me at 555-123-4567." className="h-24" />
                    <p className="text-xs text-gray-500">Characters: 139/160</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Recipients</Label>
                    <Select defaultValue="cash-buyers">
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient list" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash-buyers">Cash Buyers (42)</SelectItem>
                        <SelectItem value="rehabbers">Rehabbers (28)</SelectItem>
                        <SelectItem value="rental">Rental Investors (35)</SelectItem>
                        <SelectItem value="all">All Contacts (105)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Save Draft</Button>
                <Button className="bg-[#135341]">Send Campaign</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Building className="h-5 w-5 mr-2 text-[#135341]" /> SMS Templates
                </CardTitle>
                <CardDescription>Quick access to your saved templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Card className="cursor-pointer hover:bg-gray-50">
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm">New Deal Alert</h4>
                      <p className="text-xs text-gray-500 mt-1">New off-market deal available! [BEDS]BD/[BATHS]BA house in [AREA] for $[PRICE]K. [DISCOUNT]% below market! Reply DETAILS for info or call [PHONE].</p>
                      <div className="flex justify-end mt-2">
                        <Button variant="ghost" size="sm" className="h-8">Use Template</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:bg-gray-50">
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm">Price Drop</h4>
                      <p className="text-xs text-gray-500 mt-1">PRICE DROP! [ADDRESS] now only $[PRICE]K. Great investment opportunity at [CAP]% cap rate. First come, first served! Call me at [PHONE].</p>
                      <div className="flex justify-end mt-2">
                        <Button variant="ghost" size="sm" className="h-8">Use Template</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:bg-gray-50">
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm">Open House</h4>
                      <p className="text-xs text-gray-500 mt-1">INVESTOR OPEN HOUSE: This Sat [DATE], [TIME] at [ADDRESS]. Off-market [BEDS]BD/[BATHS]BA with [FEATURES]. $[PRICE]K - won't last! RSVP required.</p>
                      <div className="flex justify-end mt-2">
                        <Button variant="ghost" size="sm" className="h-8">Use Template</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <CardFooter>
                <Card className="bg-gray-50 border p-4 w-full">
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
                        <UploadIcon className="h-4 w-4 mr-1" /> Import Contacts
                      </Button>
                    </div>
                  </div>
                </Card>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="crm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Building className="h-5 w-5 mr-2 text-[#135341]" /> CRM Integration
              </CardTitle>
              <CardDescription>Export deal information to your CRM system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col justify-center items-center p-6">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <img src="https://cdn.worldvectorlogo.com/logos/podio.svg" alt="Podio" className="h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-center">Podio</h3>
                  <p className="text-sm text-gray-500 text-center mt-2">Connect your Podio CRM</p>
                  <Button variant="outline" className="mt-4">Connect</Button>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col justify-center items-center p-6">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <img src="https://logos-world.net/wp-content/uploads/2021/02/Salesforce-Logo-700x394.png" alt="Salesforce" className="h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-center">Salesforce</h3>
                  <p className="text-sm text-gray-500 text-center mt-2">Connect your Salesforce account</p>
                  <Button variant="outline" className="mt-4">Connect</Button>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col justify-center items-center p-6">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Zoho_Corporation_logo.svg/2560px-Zoho_Corporation_logo.svg.png" alt="Zoho" className="h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-center">Zoho CRM</h3>
                  <p className="text-sm text-gray-500 text-center mt-2">Connect your Zoho CRM system</p>
                  <Button variant="outline" className="mt-4">Connect</Button>
                </Card>
              </div>
              
              <div className="mt-6 border-t pt-6">
                <h3 className="font-semibold mb-4">Export Properties</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center border p-3 rounded-md">
                    <input type="checkbox" id="property1" className="mr-3" />
                    <Label htmlFor="property1" className="flex-1 cursor-pointer flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded overflow-hidden">
                          <img src={MARKETING_PROPERTIES[0].thumbnail} alt={MARKETING_PROPERTIES[0].title} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium">{MARKETING_PROPERTIES[0].title}</h4>
                          <p className="text-xs text-gray-500">{MARKETING_PROPERTIES[0].address}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">${MARKETING_PROPERTIES[0].price.toLocaleString()}</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center border p-3 rounded-md">
                    <input type="checkbox" id="property2" className="mr-3" />
                    <Label htmlFor="property2" className="flex-1 cursor-pointer flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded overflow-hidden">
                          <img src={MARKETING_PROPERTIES[1].thumbnail} alt={MARKETING_PROPERTIES[1].title} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium">{MARKETING_PROPERTIES[1].title}</h4>
                          <p className="text-xs text-gray-500">{MARKETING_PROPERTIES[1].address}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">${MARKETING_PROPERTIES[1].price.toLocaleString()}</span>
                    </Label>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">Select All</Button>
                    <Button variant="outline" size="sm">Select None</Button>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline">Download CSV</Button>
                    <Button className="bg-[#135341]">Export to CRM</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}