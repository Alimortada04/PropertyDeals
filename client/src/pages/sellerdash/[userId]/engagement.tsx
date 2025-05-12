import React, { useState } from 'react';
import { useParams } from 'wouter';
import SellerDashboardLayout from '@/components/layout/seller-dashboard-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Check, 
  X, 
  MessageCircle, 
  Clock, 
  Send, 
  Calendar, 
  BarChart, 
  Users,
  Mail,
  MessageSquare,
  Instagram,
  History
} from 'lucide-react';

// Mock offers/messages data
const MOCK_OFFERS = [
  {
    id: 'offer1',
    property: 'Colonial Revival',
    propertyId: 'prop1',
    buyer: 'John Smith',
    amount: '$605,000',
    status: 'Pending',
    date: '2025-05-08',
    timeAgo: '3 days ago'
  },
  {
    id: 'offer2',
    property: 'Modern Farmhouse',
    propertyId: 'prop2',
    buyer: 'Emily Davis',
    amount: '$445,000',
    status: 'Countered',
    date: '2025-05-09',
    timeAgo: '2 days ago'
  },
  {
    id: 'offer3',
    property: 'Suburban Ranch',
    propertyId: 'prop3',
    buyer: 'Michael Johnson',
    amount: '$390,000',
    status: 'Accepted',
    date: '2025-05-10',
    timeAgo: '1 day ago'
  },
  {
    id: 'offer4',
    property: 'Victorian Charmer',
    propertyId: 'prop4',
    buyer: 'Sarah Williams',
    amount: '$710,000',
    status: 'Declined',
    date: '2025-05-11',
    timeAgo: '12 hours ago'
  },
];

// Mock CRM data
const MOCK_LEADS = [
  {
    id: 'lead1',
    name: 'Robert Chen',
    status: 'Interested',
    property: 'Colonial Revival',
    lastContact: '2025-05-05',
    nextFollowUp: '2025-05-15',
    notes: 'Looking for investment property, prefers 3+ bedroom homes'
  },
  {
    id: 'lead2',
    name: 'Amanda Garcia',
    status: 'Hot Lead',
    property: 'Modern Farmhouse',
    lastContact: '2025-05-10',
    nextFollowUp: '2025-05-12',
    notes: 'Has financing pre-approved, ready to make offer'
  },
  {
    id: 'lead3',
    name: 'David Wilson',
    status: 'Cold',
    property: 'Lake House Retreat',
    lastContact: '2025-04-25',
    nextFollowUp: '2025-05-25',
    notes: 'Interested but waiting for price reduction'
  },
];

// Mock template data
const MOCK_TEMPLATES = [
  {
    id: 'template1',
    name: 'New Listing Announcement',
    type: 'Email',
    lastUsed: '2025-04-30',
    platform: 'Email'
  },
  {
    id: 'template2',
    name: 'Price Reduction Alert',
    type: 'SMS',
    lastUsed: '2025-05-05',
    platform: 'SMS'
  },
  {
    id: 'template3',
    name: 'Open House Invitation',
    type: 'Email',
    lastUsed: '2025-05-08',
    platform: 'Email'
  },
  {
    id: 'template4',
    name: 'Featured Property Post',
    type: 'Social',
    lastUsed: '2025-05-10',
    platform: 'Instagram'
  },
];

// Mock message history
const MOCK_HISTORY = [
  {
    id: 'msg1',
    recipient: 'John Smith',
    recipientType: 'Buyer',
    template: 'Custom Message',
    type: 'Email',
    subject: 'Regarding Your Offer',
    sentOn: '2025-05-08',
    timeAgo: '3 days ago',
    status: 'Opened'
  },
  {
    id: 'msg2',
    recipient: 'All Leads',
    recipientType: 'Bulk',
    template: 'New Listing Announcement',
    type: 'Email',
    subject: 'Just Listed: Colonial Revival',
    sentOn: '2025-05-05',
    timeAgo: '6 days ago',
    status: 'Delivered'
  },
  {
    id: 'msg3',
    recipient: 'Amanda Garcia',
    recipientType: 'Lead',
    template: 'Custom Message',
    type: 'SMS',
    subject: 'Showing Confirmation',
    sentOn: '2025-05-10',
    timeAgo: '1 day ago',
    status: 'Delivered'
  },
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let color = 'bg-gray-100 text-gray-800';
  
  switch (status.toLowerCase()) {
    case 'pending':
      color = 'bg-yellow-100 text-yellow-800';
      break;
    case 'accepted':
      color = 'bg-green-100 text-green-800';
      break;
    case 'countered':
      color = 'bg-blue-100 text-blue-800';
      break;
    case 'declined':
      color = 'bg-red-100 text-red-800';
      break;
    case 'hot lead':
      color = 'bg-red-100 text-red-800';
      break;
    case 'interested':
      color = 'bg-blue-100 text-blue-800';
      break;
    case 'cold':
      color = 'bg-gray-100 text-gray-800';
      break;
    case 'opened':
      color = 'bg-green-100 text-green-800';
      break;
    case 'delivered':
      color = 'bg-blue-100 text-blue-800';
      break;
  }
  
  return (
    <Badge className={`${color} font-medium`}>
      {status}
    </Badge>
  );
};

export default function EngagementPage() {
  const params = useParams();
  const userId = params.userId || '';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [proactiveTab, setProactiveTab] = useState('crm');
  
  // Filter offers based on search
  const filteredOffers = MOCK_OFFERS.filter(offer => 
    offer.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offer.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offer.amount.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <SellerDashboardLayout userId={userId}>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Engagement</h1>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
        
        {/* Main tabs */}
        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="proactive">Proactive</TabsTrigger>
          </TabsList>
          
          {/* Active Tab Content */}
          <TabsContent value="active" className="mt-6">
            <div className="bg-white rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Offer Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffers.map(offer => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">{offer.property}</TableCell>
                      <TableCell>{offer.buyer}</TableCell>
                      <TableCell>{offer.amount}</TableCell>
                      <TableCell>
                        <StatusBadge status={offer.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{new Date(offer.date).toLocaleDateString()}</span>
                          <span className="text-xs text-gray-500">{offer.timeAgo}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Details">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Counter Offer">
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-600" title="Accept">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600" title="Decline">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredOffers.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-gray-500">No offers or messages found matching your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Proactive Tab Content */}
          <TabsContent value="proactive" className="mt-6">
            <div className="mb-4">
              <Tabs defaultValue="crm" value={proactiveTab} onValueChange={setProactiveTab}>
                <TabsList>
                  <TabsTrigger value="crm">CRM Tracker</TabsTrigger>
                  <TabsTrigger value="templates">Outreach Templates</TabsTrigger>
                  <TabsTrigger value="history">Sent History</TabsTrigger>
                </TabsList>
                
                {/* CRM Tracker */}
                <TabsContent value="crm" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-green-50 border-green-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Hot Leads</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-700">
                          {MOCK_LEADS.filter(lead => lead.status === 'Hot Lead').length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Interested</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-700">
                          {MOCK_LEADS.filter(lead => lead.status === 'Interested').length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-50 border-gray-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Cold</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-gray-700">
                          {MOCK_LEADS.filter(lead => lead.status === 'Cold').length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-yellow-50 border-yellow-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Follow-Ups Due</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-yellow-700">
                          {MOCK_LEADS.filter(lead => new Date(lead.nextFollowUp) <= new Date()).length}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="bg-white rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Property</TableHead>
                          <TableHead>Last Contact</TableHead>
                          <TableHead>Next Follow-Up</TableHead>
                          <TableHead>Notes</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {MOCK_LEADS.map(lead => (
                          <TableRow key={lead.id}>
                            <TableCell className="font-medium">{lead.name}</TableCell>
                            <TableCell>
                              <StatusBadge status={lead.status} />
                            </TableCell>
                            <TableCell>{lead.property}</TableCell>
                            <TableCell>{new Date(lead.lastContact).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(lead.nextFollowUp).toLocaleDateString()}</TableCell>
                            <TableCell className="max-w-xs truncate">{lead.notes}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Send Message">
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Schedule Follow-Up">
                                  <Calendar className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                {/* Outreach Templates */}
                <TabsContent value="templates" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-indigo-50 border-indigo-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Email Templates</CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-indigo-600" />
                        <div className="text-2xl font-bold text-indigo-700">
                          {MOCK_TEMPLATES.filter(t => t.platform === 'Email').length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-teal-50 border-teal-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">SMS Templates</CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-teal-600" />
                        <div className="text-2xl font-bold text-teal-700">
                          {MOCK_TEMPLATES.filter(t => t.platform === 'SMS').length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 border-purple-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Social Templates</CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center gap-2">
                        <Instagram className="h-5 w-5 text-purple-600" />
                        <div className="text-2xl font-bold text-purple-700">
                          {MOCK_TEMPLATES.filter(t => t.platform === 'Instagram').length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Create New</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          New Template
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="bg-white rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Template Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Last Used</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {MOCK_TEMPLATES.map(template => (
                          <TableRow key={template.id}>
                            <TableCell className="font-medium">{template.name}</TableCell>
                            <TableCell>
                              {template.type === 'Email' && <Mail className="h-4 w-4 inline mr-1" />}
                              {template.type === 'SMS' && <MessageSquare className="h-4 w-4 inline mr-1" />}
                              {template.type === 'Social' && <Instagram className="h-4 w-4 inline mr-1" />}
                              {template.type}
                            </TableCell>
                            <TableCell>{new Date(template.lastUsed).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" title="Edit Template">
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm" className="gap-1">
                                  <Send className="h-4 w-4" />
                                  Use
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                {/* Sent History */}
                <TabsContent value="history" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Mail className="h-5 w-5 text-indigo-600" />
                          Email History
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {MOCK_HISTORY.filter(msg => msg.type === 'Email').length}
                        </div>
                        <p className="text-sm text-gray-500">messages sent</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-teal-600" />
                          SMS History
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {MOCK_HISTORY.filter(msg => msg.type === 'SMS').length}
                        </div>
                        <p className="text-sm text-gray-500">messages sent</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BarChart className="h-5 w-5 text-blue-600" />
                          Open Rate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {Math.round((MOCK_HISTORY.filter(msg => msg.status === 'Opened').length / MOCK_HISTORY.length) * 100)}%
                        </div>
                        <p className="text-sm text-gray-500">average open rate</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="bg-white rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Recipient</TableHead>
                          <TableHead>Template</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Sent Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {MOCK_HISTORY.map(message => (
                          <TableRow key={message.id}>
                            <TableCell>
                              <div>
                                {message.recipient}
                                <div className="text-xs text-gray-500">{message.recipientType}</div>
                              </div>
                            </TableCell>
                            <TableCell>{message.template}</TableCell>
                            <TableCell>
                              {message.type === 'Email' && <Mail className="h-4 w-4 inline mr-1" />}
                              {message.type === 'SMS' && <MessageSquare className="h-4 w-4 inline mr-1" />}
                              {message.type}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{message.subject}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{new Date(message.sentOn).toLocaleDateString()}</span>
                                <span className="text-xs text-gray-500">{message.timeAgo}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={message.status} />
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Message">
                                  <History className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Resend">
                                  <Send className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* CTA Button */}
            <div className="mt-6 flex justify-end">
              <Button className="gap-2 bg-[#135341] hover:bg-[#09261E]">
                <Send className="h-4 w-4" />
                Send Update
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SellerDashboardLayout>
  );
}