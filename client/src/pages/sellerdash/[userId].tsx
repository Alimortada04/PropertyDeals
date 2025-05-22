import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import SellerDashboardLayout from '@/components/layout/seller-dashboard-layout';
import SellerApplicationModal from '@/components/seller/seller-application-modal';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  LayoutDashboard, 
  Home, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Eye, 
  Users, 
  Calendar, 
  ChevronRight,
  BadgeCheck,
  BadgeAlert,
  Clock3,
  DollarSign,
  Building,
  MoreHorizontal,
  Share2,
  File,
  FileText
} from 'lucide-react';
import { PropertyCard } from '@/components/property/property-card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { EnhancedPropertyListingModal } from '@/components/property/enhanced-property-listing-modal';

// Placeholder data for demonstration - in production this would come from your API
const MOCK_PROPERTIES = [
  {
    id: 'prop1',
    title: 'Colonial Revival',
    address: '123 Main St, Milwaukee, WI 53201',
    price: 625000,
    status: 'Live',
    thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop',
    views: 42,
    leads: 8,
    daysListed: 12,
    beds: 5,
    baths: 3.5,
    sqft: 3200,
    arv: 725000,
    offers: 3
  },
  {
    id: 'prop2',
    title: 'Modern Farmhouse',
    address: '456 Oak St, Madison, WI 53703',
    price: 459000,
    status: 'Under Contract',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop',
    views: 68,
    leads: 12,
    daysListed: 5,
    beds: 4,
    baths: 3,
    sqft: 2800,
    arv: 550000,
    offers: 2
  },
  {
    id: 'prop3',
    title: 'Suburban Ranch',
    address: '789 Pine Rd, Green Bay, WI 54301',
    price: 385000,
    status: 'Closed',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop',
    views: 37,
    leads: 3,
    daysListed: 30,
    beds: 3,
    baths: 2,
    sqft: 2200,
    arv: 420000,
    offers: 4
  },
];

// Sample recent activity data
const RECENT_ACTIVITY = [
  {
    id: 'act1',
    propertyId: 'prop1',
    propertyTitle: '3-Bed Single Family Home',
    thumbnail: '/images/property1.jpg',
    timeAgo: '2 hours',
    action: 'Updated listing details'
  },
  {
    id: 'act2',
    propertyId: 'prop2',
    propertyTitle: 'Duplex Investment Property',
    thumbnail: '/images/property2.jpg',
    timeAgo: '1 day',
    action: 'Received new offer'
  }
];

/**
 * SellerDashboardPage - Main dashboard for sellers
 */
export default function SellerDashboardPage() {
  const params = useParams();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  // Property modal is now handled through the global Quick Action Selector
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  
  // In real implementation, check if the current user matches the userId param
  // If not, redirect to their own dashboard or show an authorization error
  const userId = params.userId || '';

  // Check seller status for current user
  const { data: sellerStatus, isLoading: isCheckingStatus } = useQuery({
    queryKey: ['seller-status', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('sellers')
        .select('status, businessName')
        .eq('userId', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching seller status:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Determine if we should show the seller application modal
  const shouldShowSellerModal = !isCheckingStatus && (!sellerStatus || sellerStatus.status !== 'active');

  useEffect(() => {
    if (shouldShowSellerModal) {
      setIsSellerModalOpen(true);
    }
  }, [shouldShowSellerModal]);
  
  // Get seller stats for the top cards
  const stats = {
    activeListings: 2,
    offersPending: 3,
    assignmentRevenue: '$12,500',
    avgDaysOnMarket: 15
  };
  
  // Filter properties based on search and status
  const filteredProperties = MOCK_PROPERTIES.filter(property => {
    const matchesSearch = 
      !searchQuery || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || property.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get status badge style based on status
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'Listed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Under Contract':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  // Function to get seller status icon
  const getSellerStatusIcon = (status: string) => {
    switch(status) {
      case 'active':
        return <BadgeCheck className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock3 className="h-5 w-5 text-yellow-600" />;
      case 'rejected':
        return <BadgeAlert className="h-5 w-5 text-red-600" />;
      default:
        return <Clock3 className="h-5 w-5 text-gray-400" />;
    }
  };
  
  // For development/testing without auth, we'll use mock data if user is missing
  const mockUser = {
    fullName: 'Demo Seller',
    sellerStatus: 'active'
  };
  
  return (
    <SellerDashboardLayout userId={userId}>
      {/* Main content container */}
      <div className="-mt-6 -mx-4 p-4 rounded-lg">
        {/* Top welcome & status bar */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {(user || mockUser)?.fullName?.split(' ')[0] || 'Seller'} 👋</h1>
            <p className="text-gray-600 mt-1">
              Here's how your real estate business is performing today.
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center gap-2">
              {getSellerStatusIcon((user || mockUser)?.sellerStatus || 'active')}
              <Badge className={`px-3 py-1 text-sm ${getStatusBadgeClass((user || mockUser)?.sellerStatus || 'active')}`}>
                {(user || mockUser)?.sellerStatus === 'active' ? 'Active Seller' : 
                 (user || mockUser)?.sellerStatus === 'pending' ? 'Pending Approval' : 
                 (user || mockUser)?.sellerStatus === 'rejected' ? 'Approval Rejected' : 'Active Seller'}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Quick Stats grid with List a Property CTA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          
          {/* List a Property CTA Card */}
          <div 
            onClick={() => setIsAddPropertyModalOpen(true)}
            className="group relative overflow-hidden rounded-lg border hover:shadow-md transition-all duration-300 cursor-pointer h-full flex flex-col"
          >
            {/* Background with gradient and animation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#09261E] to-[#135341] group-hover:from-[#803344] group-hover:to-[#803344]/90 transition-colors duration-500 ease-in-out"></div>
            
            {/* Animated decoration elements */}
            <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="absolute -left-8 -bottom-8 h-16 w-16 rounded-full bg-white opacity-10 group-hover:scale-125 transition-transform duration-700 delay-100"></div>
            
            {/* Content with vertical centering */}
            <div className="relative h-full flex flex-col items-center justify-center text-center p-4 z-10">
              {/* Icon with animation */}
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <Plus className="h-6 w-6 text-white" />
              </div>
              
              <h3 className="text-lg font-medium text-white group-hover:scale-105 transition-transform duration-300">
                List a Property
              </h3>
              
              <div className="mt-2 text-sm text-white/80 group-hover:text-white transition-colors duration-300 flex items-center">
                <span>Get Started</span>
                <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
          
          {/* Active Listings */}
          <Card className="border-l-4 border-l-[#135341] hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Building className="h-7 w-7 text-[#135341]" />
                <span className="text-3xl font-bold">{stats.activeListings}</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-base font-medium text-gray-600">Active Listings</CardTitle>
            </CardContent>
          </Card>
          
          {/* Offers Pending */}
          <Card className="border-l-4 border-l-[#803344] hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Users className="h-7 w-7 text-[#803344]" />
                <span className="text-3xl font-bold">{stats.offersPending}</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-base font-medium text-gray-600">Offers Pending</CardTitle>
            </CardContent>
          </Card>
          
          {/* Assignment Revenue */}
          <Card className="border-l-4 border-l-green-600 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <DollarSign className="h-7 w-7 text-green-600" />
                <span className="text-3xl font-bold">{stats.assignmentRevenue}</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-base font-medium text-gray-600">Assignment Revenue</CardTitle>
            </CardContent>
          </Card>
          
          {/* Avg Days on Market */}
          <Card className="border-l-4 border-l-blue-600 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Calendar className="h-7 w-7 text-blue-600" />
                <span className="text-3xl font-bold">{stats.avgDaysOnMarket}</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-base font-medium text-gray-600">Avg. Days on Market</CardTitle>
            </CardContent>
          </Card>
        </div>
        
        {/* Recently Touched Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Recently Touched</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RECENT_ACTIVITY.length > 0 ? (
              RECENT_ACTIVITY.map(activity => (
                <Card key={activity.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="relative h-32 bg-gray-200">
                    <img 
                      src={activity.thumbnail} 
                      alt={activity.propertyTitle}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e2e8f0/1e293b?text=Property+Image';
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <h3 className="font-semibold text-gray-900 mb-1">{activity.propertyTitle}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> 
                        Last touched {activity.timeAgo} ago - {activity.action}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full bg-white hover:bg-gray-50 border-gray-200"
                      onClick={() => setLocation(`/sellerdash/${userId}/property/${activity.propertyId}`)}
                    >
                      Resume
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 py-8 text-center bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No recent activity found</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Your Properties Section */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <h2 className="text-xl font-semibold">My Properties</h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Removed "Add New Property" button as requested */}
              <div className="flex gap-2 flex-1">
                {/* List a Property CTA Card */}
                <Button 
                  className="flex items-center gap-2 bg-[#135341] hover:bg-[#09261E] text-white"
                  onClick={() => setIsAddPropertyModalOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  <span>List a Property</span>
                </Button>
                
                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Status: {statusFilter}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setStatusFilter('All')}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('Listed')}>
                      Listed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('Under Contract')}>
                      Under Contract
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('Closed')}>
                      Closed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          
          {/* Properties Grid */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map(property => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  userId={userId}
                  title={property.title}
                  address={property.address}
                  status={property.status as any}
                  image={property.thumbnail}
                  price={typeof property.price === 'string' ? 
                    parseInt(property.price.replace(/[^0-9]/g, '')) : 
                    property.price}
                  beds={property.beds || 3}
                  baths={property.baths || 2}
                  sqft={property.sqft || 2000}
                  arv={property.arv || (typeof property.price === 'string' ? 
                    parseInt(property.price.replace(/[^0-9]/g, '')) * 1.2 : 
                    property.price * 1.2)}
                  views={property.views}
                  leads={property.leads}
                  daysOnMarket={property.daysListed}
                  offers={property.offers || 0}
                />
              ))}
            </div>
          ) : (
            // Empty state
            <div className="py-16 text-center bg-white rounded-lg border border-dashed border-gray-300">
              <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">You haven't listed any properties yet.</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first deal.</p>
              <Button 
                className="bg-[#135341] hover:bg-[#09261E] text-white"
                onClick={() => setIsAddPropertyModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Property
              </Button>
            </div>
          )}
        </div>
        
        {/* Additional Resources Section */}
        <div className="mb-10 mt-10">
          <h2 className="text-xl font-semibold mb-4">Resources & Upcoming</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upcoming Walkthroughs Card */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
              <CardHeader className="bg-blue-50 border-b pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Upcoming Walkthroughs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-dashed">
                    <div>
                      <p className="font-medium">Colonial Revival</p>
                      <p className="text-sm text-gray-500">May 15, 2025 • 2:00 PM</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-50">Confirmed</Badge>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-dashed">
                    <div>
                      <p className="font-medium">Modern Farmhouse</p>
                      <p className="text-sm text-gray-500">May 18, 2025 • 10:30 AM</p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50">Pending</Badge>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
                  onClick={() => setLocation(`/sellerdash/${userId}/calendar`)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View Full Calendar
                </Button>
              </CardContent>
            </Card>
            
            {/* Document Hub Card */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
              <CardHeader className="bg-purple-50 border-b pb-3">
                <CardTitle className="flex items-center text-lg">
                  <File className="h-5 w-5 mr-2 text-purple-600" />
                  Document Hub
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-dashed">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <p>Property Disclosures</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50">10 Files</Badge>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-dashed">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <p>Offer Documents</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50">5 Files</Badge>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 transition-colors"
                  onClick={() => setLocation(`/sellerdash/${userId}/documents`)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add or View Documents
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Floating Quick List Button removed - now using global QuickActionSelector */}
      
      {/* Enhanced Property Listing Modal */}
      <EnhancedPropertyListingModal
        isOpen={isAddPropertyModalOpen}
        onClose={() => setIsAddPropertyModalOpen(false)}
      />
    </SellerDashboardLayout>
  );
}