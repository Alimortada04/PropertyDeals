import React, { useState } from 'react';
import { useParams } from 'wouter';
import SellerDashboardLayout from '@/components/layout/seller-dashboard-layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  HandHeart, 
  DollarSign, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Eye,
  Filter,
  Search
} from 'lucide-react';

// Mock data for offers
const mockOffers = [
  {
    id: '1',
    propertyTitle: 'Modern Farmhouse in Downtown',
    propertyAddress: '123 Main St, City, ST',
    buyerName: 'John Smith',
    buyerEmail: 'john.smith@email.com',
    buyerPhone: '(555) 123-4567',
    offerAmount: 485000,
    askingPrice: 500000,
    offerDate: new Date('2025-01-15'),
    status: 'pending',
    contingencies: ['Inspection', 'Financing'],
    closingDate: new Date('2025-03-01'),
    earnestMoney: 10000,
    message: 'Very interested in this property. We love the location and modern updates. Flexible on closing date.',
    preApprovalAmount: 550000,
    downPayment: 97000,
    loanType: 'Conventional',
    buyerAgent: 'Sarah Johnson - ABC Realty'
  },
  {
    id: '2',
    propertyTitle: 'Luxury Condo with City Views',
    propertyAddress: '456 High Rise Blvd, Unit 22A',
    buyerName: 'Maria Garcia',
    buyerEmail: 'maria.garcia@email.com',
    buyerPhone: '(555) 987-6543',
    offerAmount: 750000,
    askingPrice: 775000,
    offerDate: new Date('2025-01-12'),
    status: 'accepted',
    contingencies: ['Financing Only'],
    closingDate: new Date('2025-02-28'),
    earnestMoney: 15000,
    message: 'Cash equivalent offer. Quick close possible.',
    preApprovalAmount: 800000,
    downPayment: 150000,
    loanType: 'Jumbo',
    buyerAgent: 'Mike Chen - XYZ Properties'
  },
  {
    id: '3',
    propertyTitle: 'Family Home with Pool',
    propertyAddress: '789 Suburban Dr, Neighborhood',
    buyerName: 'David Wilson',
    buyerEmail: 'david.wilson@email.com',
    buyerPhone: '(555) 456-7890',
    offerAmount: 425000,
    askingPrice: 450000,
    offerDate: new Date('2025-01-10'),
    status: 'countered',
    contingencies: ['Inspection', 'Financing', 'Appraisal'],
    closingDate: new Date('2025-03-15'),
    earnestMoney: 8500,
    message: 'Looking for a family home in great school district. Hope we can work something out.',
    preApprovalAmount: 475000,
    downPayment: 85000,
    loanType: 'FHA',
    buyerAgent: 'Lisa Brown - Hometown Realty'
  },
  {
    id: '4',
    propertyTitle: 'Investment Property Duplex',
    propertyAddress: '321 Investment Ave, Units A&B',
    buyerName: 'Robert Lee',
    buyerEmail: 'robert.lee@email.com',
    buyerPhone: '(555) 321-6547',
    offerAmount: 295000,
    askingPrice: 320000,
    offerDate: new Date('2025-01-08'),
    status: 'rejected',
    contingencies: ['Inspection Only'],
    closingDate: new Date('2025-02-15'),
    earnestMoney: 5000,
    message: 'Investment purchase. Looking to close quickly with minimal contingencies.',
    preApprovalAmount: 350000,
    downPayment: 59000,
    loanType: 'Investment',
    buyerAgent: 'Tom Anderson - Capital Investors'
  }
];

// Status color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
    case 'countered': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <Clock className="h-4 w-4" />;
    case 'accepted': return <CheckCircle className="h-4 w-4" />;
    case 'countered': return <MessageSquare className="h-4 w-4" />;
    case 'rejected': return <XCircle className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

// Offer detail modal component
function OfferDetailModal({ offer, isOpen, onClose }: { offer: any, isOpen: boolean, onClose: () => void }) {
  const [response, setResponse] = useState('');
  const [counterOffer, setCounterOffer] = useState(offer.offerAmount.toString());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Offer Details</DialogTitle>
          <DialogDescription>
            Review and respond to this offer for {offer.propertyTitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Property & Offer Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{offer.propertyTitle}</p>
                    <p className="text-sm text-gray-600">{offer.propertyAddress}</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Asking Price:</span>
                  <span className="font-medium">${offer.askingPrice.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Offer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Offer Amount:</span>
                  <span className="text-xl font-bold text-green-600">${offer.offerAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Earnest Money:</span>
                  <span className="font-medium">${offer.earnestMoney.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Down Payment:</span>
                  <span className="font-medium">${offer.downPayment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Loan Type:</span>
                  <span className="font-medium">{offer.loanType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Closing Date:</span>
                  <span className="font-medium">{offer.closingDate.toLocaleDateString()}</span>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-gray-600">Contingencies:</span>
                  <div className="flex flex-wrap gap-1">
                    {offer.contingencies.map((contingency: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {contingency}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Buyer Info & Response */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Buyer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{offer.buyerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{offer.buyerEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{offer.buyerPhone}</span>
                </div>
                <div className="pt-2">
                  <span className="text-sm text-gray-600">Pre-approval Amount:</span>
                  <p className="font-medium">${offer.preApprovalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Buyer's Agent:</span>
                  <p className="font-medium">{offer.buyerAgent}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Buyer's Message</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{offer.message}</p>
              </CardContent>
            </Card>

            {/* Response Actions */}
            {offer.status === 'pending' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Respond to Offer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <Button className="bg-green-600 hover:bg-green-700">Accept</Button>
                    <Button variant="outline">Counter</Button>
                    <Button variant="destructive">Reject</Button>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Counter Offer Amount:</label>
                    <Input 
                      type="number" 
                      value={counterOffer}
                      onChange={(e) => setCounterOffer(e.target.value)}
                      placeholder="Enter counter offer amount"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Response Message:</label>
                    <Textarea 
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Add a message to your response..."
                      rows={3}
                    />
                  </div>
                  
                  <Button className="w-full">Send Response</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main offers page component
export default function OffersPage() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter offers based on active tab and search
  const filteredOffers = mockOffers.filter(offer => {
    const matchesTab = activeTab === 'all' || offer.status === activeTab;
    const matchesSearch = searchTerm === '' || 
      offer.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  // Calculate offer statistics
  const stats = {
    total: mockOffers.length,
    pending: mockOffers.filter(offer => offer.status === 'pending').length,
    accepted: mockOffers.filter(offer => offer.status === 'accepted').length,
    avgOffer: Math.round(mockOffers.reduce((sum, offer) => sum + offer.offerAmount, 0) / mockOffers.length),
  };

  return (
    <SellerDashboardLayout>
      <div className="py-6">
        <div className="flex flex-col space-y-6">
          {/* Page header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Offers Inbox</h1>
              <p className="text-gray-600 mt-1">Manage and respond to property offers</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search offers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Offers</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <HandHeart className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Accepted</p>
                    <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Offer</p>
                    <p className="text-2xl font-bold">${stats.avgOffer.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Offers tabs and list */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="accepted">Accepted ({stats.accepted})</TabsTrigger>
              <TabsTrigger value="countered">Countered</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-4">
                {filteredOffers.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <HandHeart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
                      <p className="text-gray-600">
                        {searchTerm ? 'Try adjusting your search terms.' : 'You don\'t have any offers in this category yet.'}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredOffers.map((offer) => (
                    <Card key={offer.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedOffer(offer)}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{offer.propertyTitle}</h3>
                              <Badge className={`${getStatusColor(offer.status)} flex items-center gap-1`}>
                                {getStatusIcon(offer.status)}
                                {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MapPin className="h-4 w-4" />
                                  <span>{offer.propertyAddress}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <User className="h-4 w-4" />
                                  <span>{offer.buyerName}</span>
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-green-600" />
                                  <span className="font-semibold text-green-600">${offer.offerAmount.toLocaleString()}</span>
                                  <span className="text-gray-500">({((offer.offerAmount / offer.askingPrice) * 100).toFixed(1)}% of asking)</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>Received {offer.offerDate.toLocaleDateString()}</span>
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="text-gray-600">
                                  <span className="font-medium">Closing:</span> {offer.closingDate.toLocaleDateString()}
                                </div>
                                <div className="text-gray-600">
                                  <span className="font-medium">Earnest:</span> ${offer.earnestMoney.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="ml-4 flex items-center">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Offer detail modal */}
      {selectedOffer && (
        <OfferDetailModal 
          offer={selectedOffer} 
          isOpen={!!selectedOffer} 
          onClose={() => setSelectedOffer(null)} 
        />
      )}
    </SellerDashboardLayout>
  );
}