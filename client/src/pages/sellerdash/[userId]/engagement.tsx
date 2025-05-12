import React, { useState } from 'react';
import { useParams } from 'wouter';
import SellerDashboardLayout from '@/components/layout/seller-dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  MessageSquare,
  Mail,
  Send,
  Phone,
  Clock,
  ArrowRight,
  Check,
  X,
  User,
  Building,
  Calendar,
  Instagram,
  FileText,
  BellRing
} from 'lucide-react';

// Mock offer/message data
const activeItems = [
  {
    id: 1,
    property: "123 Main Street",
    buyer: "John Smith",
    amount: "$430,000",
    status: "New",
    date: "May 12, 2025",
    type: "offer"
  },
  {
    id: 2,
    property: "456 Oak Avenue",
    buyer: "Sarah Johnson",
    amount: "$610,000",
    status: "Countered",
    date: "May 11, 2025",
    type: "offer"
  },
  {
    id: 3,
    property: "123 Main Street",
    buyer: "Michael Brown",
    message: "Is this property still available? I'd like to schedule a viewing for tomorrow afternoon if possible.",
    date: "May 10, 2025",
    type: "message"
  },
  {
    id: 4,
    property: "789 Pine Boulevard",
    buyer: "Lisa Davis",
    message: "What's the earliest date this property would be available for move-in?",
    date: "May 9, 2025",
    type: "message"
  }
];

// Mock lead data
const leads = [
  {
    id: 1,
    name: "Emma Wilson",
    status: "New Lead",
    property: "123 Main Street",
    source: "Website",
    lastContact: "May 8, 2025",
    email: "emma.wilson@example.com",
    phone: "555-123-4567"
  },
  {
    id: 2,
    name: "David Martinez",
    status: "Contacted",
    property: "456 Oak Avenue",
    source: "Referral",
    lastContact: "May 5, 2025",
    email: "d.martinez@example.com",
    phone: "555-234-5678"
  },
  {
    id: 3,
    name: "Jessica Taylor",
    status: "Qualified",
    property: "123 Main Street",
    source: "Open House",
    lastContact: "May 1, 2025",
    email: "j.taylor@example.com",
    phone: "555-345-6789"
  }
];

// Mock template data
const templates = [
  {
    id: 1,
    name: "New Listing Announcement",
    type: "Email",
    lastUsed: "May 3, 2025"
  },
  {
    id: 2,
    name: "Open House Invitation",
    type: "Email",
    lastUsed: "Apr 28, 2025"
  },
  {
    id: 3,
    name: "Price Reduction Alert",
    type: "SMS",
    lastUsed: "Apr 20, 2025"
  },
  {
    id: 4,
    name: "Property Highlights Post",
    type: "Instagram",
    lastUsed: "May 5, 2025"
  }
];

// Mock history data
const history = [
  {
    id: 1,
    type: "Email",
    recipient: "15 contacts",
    subject: "New Listing: 123 Main Street",
    date: "May 7, 2025",
    time: "10:35 AM",
    status: "Delivered"
  },
  {
    id: 2,
    type: "SMS",
    recipient: "David Martinez",
    subject: "Showing Confirmation",
    date: "May 5, 2025",
    time: "3:22 PM",
    status: "Delivered"
  },
  {
    id: 3,
    type: "Instagram",
    recipient: "Followers",
    subject: "Virtual Tour Post",
    date: "May 4, 2025",
    time: "2:15 PM",
    status: "Posted"
  }
];

export default function SellerDashboardEngagementPage() {
  const params = useParams();
  const userId = params.userId;
  const [innerTab, setInnerTab] = useState<'active' | 'proactive'>('active');
  const [proactiveTab, setProactiveTab] = useState<'leads' | 'templates' | 'history'>('leads');
  
  // Function to render active tab content
  const renderActiveTabContent = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#135341] flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Active Communications
        </h2>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="border-[#135341] text-[#135341] hover:bg-[#135341] hover:text-white"
          >
            <Mail className="mr-2 h-4 w-4" />
            Send Update
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Offers & Messages</CardTitle>
            <Badge className="bg-[#135341]">4 New</Badge>
          </div>
          <CardDescription>Recent communications requiring your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeItems.map((item) => (
              <Card key={item.id} className="overflow-hidden border">
                <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b">
                  <div className="flex items-center">
                    <Badge 
                      className={
                        item.type === 'offer' 
                          ? 'bg-blue-500 mr-3' 
                          : 'bg-green-500 mr-3'
                      }
                    >
                      {item.type === 'offer' ? 'Offer' : 'Message'}
                    </Badge>
                    <span className="font-medium">{item.property}</span>
                  </div>
                  <span className="text-sm text-gray-500">{item.date}</span>
                </div>
                
                <CardContent className="py-4">
                  {item.type === 'offer' ? (
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <User className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm font-medium">{item.buyer}</span>
                        </div>
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm">{item.property}</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-xl text-[#135341]">{item.amount}</p>
                        <Badge className={
                          item.status === 'New' 
                            ? 'bg-blue-500 mt-1' 
                            : 'bg-orange-500 mt-1'
                        }>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center mb-2">
                        <User className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-sm font-medium">{item.buyer}</span>
                      </div>
                      <p className="text-sm text-gray-700">{item.message}</p>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="bg-gray-50 border-t py-3 flex justify-end gap-2">
                  {item.type === 'offer' ? (
                    <>
                      <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                        <X className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                      <Button size="sm" variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                        Counter
                      </Button>
                      <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" className="bg-[#135341] hover:bg-[#135341]/90 text-white">
                      <Send className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  // Function to render proactive tab content
  const renderProactiveTabContent = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#135341] flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Proactive Engagement
        </h2>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="border-[#135341] text-[#135341] hover:bg-[#135341] hover:text-white"
          >
            <Send className="mr-2 h-4 w-4" />
            Promote Property
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <Tabs 
          value={proactiveTab} 
          onValueChange={(value) => setProactiveTab(value as 'leads' | 'templates' | 'history')}
          className="w-full"
        >
          <TabsList className="bg-white border-b w-full justify-start rounded-none h-auto ps-0 mb-6">
            <TabsTrigger 
              value="leads" 
              className="rounded-md px-4 py-2 data-[state=active]:bg-[#135341]/10 data-[state=active]:text-[#135341] data-[state=active]:font-medium"
            >
              CRM Tracker
            </TabsTrigger>
            <TabsTrigger 
              value="templates" 
              className="rounded-md px-4 py-2 data-[state=active]:bg-[#135341]/10 data-[state=active]:text-[#135341] data-[state=active]:font-medium"
            >
              Outreach Templates
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="rounded-md px-4 py-2 data-[state=active]:bg-[#135341]/10 data-[state=active]:text-[#135341] data-[state=active]:font-medium"
            >
              Sent History
            </TabsTrigger>
          </TabsList>
          
          {/* CRM Tracker Content */}
          {proactiveTab === 'leads' && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Lead Management</CardTitle>
                <CardDescription>Track and manage your potential buyers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-3 text-sm font-medium text-gray-500">Name</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-500">Property</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-500">Last Contact</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr key={lead.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-3">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-[#135341]/10 flex items-center justify-center text-[#135341] font-medium mr-2">
                                {lead.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium">{lead.name}</p>
                                <div className="flex text-xs text-gray-500 mt-0.5">
                                  <span className="flex items-center mr-2">
                                    <Mail className="h-3 w-3 mr-0.5" />
                                    {lead.email.slice(0, 10)}...
                                  </span>
                                  <span className="flex items-center">
                                    <Phone className="h-3 w-3 mr-0.5" />
                                    {lead.phone}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge className={
                              lead.status === 'New Lead' 
                                ? 'bg-blue-500' 
                                : lead.status === 'Contacted'
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                            }>
                              {lead.status}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <span>{lead.property}</span>
                            <div className="text-xs text-gray-500 mt-0.5">
                              via {lead.source}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1 text-gray-500" />
                              <span>{lead.lastContact}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="h-8 px-2">
                                <Mail className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 px-2">
                                <Phone className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 px-2">
                                <Calendar className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Lead
                </Button>
                <Button variant="outline" size="sm" className="text-[#135341]">
                  View All Leads
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Outreach Templates Content */}
          {proactiveTab === 'templates' && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Communication Templates</CardTitle>
                <CardDescription>Manage your outreach templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between border-b p-4">
                        <div className="flex items-center">
                          {template.type === 'Email' && (
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                              <Mail className="h-4 w-4" />
                            </div>
                          )}
                          {template.type === 'SMS' && (
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                              <MessageSquare className="h-4 w-4" />
                            </div>
                          )}
                          {template.type === 'Instagram' && (
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                              <Instagram className="h-4 w-4" />
                            </div>
                          )}
                          <h3 className="font-medium text-md">{template.name}</h3>
                        </div>
                        <Badge className={
                          template.type === 'Email' 
                            ? 'bg-blue-500' 
                            : template.type === 'SMS'
                              ? 'bg-green-500'
                              : 'bg-purple-500'
                        }>
                          {template.type}
                        </Badge>
                      </div>
                      
                      <CardContent className="py-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Last used: {template.lastUsed}</span>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-0 pb-3 flex justify-end">
                        <Button variant="outline" size="sm" className="mr-2">
                          Edit
                        </Button>
                        <Button size="sm" className="bg-[#135341]">
                          Use
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  <Card className="border-dashed border-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center p-4 h-[130px]">
                    <div className="text-center">
                      <div className="mx-auto bg-[#135341]/10 h-10 w-10 rounded-full flex items-center justify-center mb-2">
                        <Plus className="h-5 w-5 text-[#135341]" />
                      </div>
                      <p className="text-sm font-medium text-[#135341]">Create New Template</p>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Sent History Content */}
          {proactiveTab === 'history' && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Sent Communications</CardTitle>
                <CardDescription>Track your outreach history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="flex items-start border rounded-lg p-4">
                      <div className="mr-4">
                        {item.type === 'Email' && (
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Mail className="h-5 w-5" />
                          </div>
                        )}
                        {item.type === 'SMS' && (
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <MessageSquare className="h-5 w-5" />
                          </div>
                        )}
                        {item.type === 'Instagram' && (
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <Instagram className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.subject}</h3>
                          <Badge className={
                            item.status === 'Delivered' 
                              ? 'bg-green-500' 
                              : 'bg-blue-500'
                          }>
                            {item.status}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 mt-1">
                          <p>To: {item.recipient}</p>
                          <div className="flex items-center mt-1 text-gray-500">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>{item.date}</span>
                            <span className="mx-1">•</span>
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>{item.time}</span>
                          </div>
                        </div>
                        
                        <div className="flex mt-3">
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            <FileText className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs h-7 ml-2">
                            <BellRing className="h-3 w-3 mr-1" />
                            Follow Up
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex justify-end">
                <Button variant="outline" size="sm" className="text-[#135341]">
                  View Full History
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
        </Tabs>
      </div>
    </div>
  );

  return (
    <SellerDashboardLayout userId={userId}>
      <div className="mb-6">
        <Tabs 
          value={innerTab} 
          onValueChange={(value) => setInnerTab(value as 'active' | 'proactive')}
          className="w-full"
        >
          <TabsList className="bg-white border rounded-lg shadow-sm p-1 mb-6 w-full md:w-auto">
            <TabsTrigger 
              value="active" 
              className="rounded-md data-[state=active]:bg-[#135341] data-[state=active]:text-white"
            >
              Active
            </TabsTrigger>
            <TabsTrigger 
              value="proactive" 
              className="rounded-md data-[state=active]:bg-[#135341] data-[state=active]:text-white"
            >
              Proactive
            </TabsTrigger>
          </TabsList>
          
          {innerTab === 'active' ? renderActiveTabContent() : renderProactiveTabContent()}
        </Tabs>
      </div>
    </SellerDashboardLayout>
  );
}