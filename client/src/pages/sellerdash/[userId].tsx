import React, { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
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
  Share2
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Placeholder data for demonstration - in production this would come from your API
const MOCK_PROPERTIES = [
  {
    id: 'prop1',
    title: '3-Bed Single Family Home',
    address: '123 Main St, Milwaukee, WI',
    price: '$235,000',
    status: 'Listed',
    thumbnail: '/images/property1.jpg',
    views: 24,
    leads: 3,
    daysListed: 7,
  },
  {
    id: 'prop2',
    title: 'Duplex Investment Property',
    address: '456 Oak Ave, Madison, WI',
    price: '$320,000',
    status: 'Under Contract',
    thumbnail: '/images/property2.jpg',
    views: 42,
    leads: 5,
    daysListed: 14,
  },
  {
    id: 'prop3',
    title: 'Vacant Land for Development',
    address: '789 Pine Rd, Green Bay, WI',
    price: '$150,000',
    status: 'Closed',
    thumbnail: '/images/property3.jpg',
    views: 31,
    leads: 2,
    daysListed: 30,
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
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  
  // In real implementation, check if the current user matches the userId param
  // If not, redirect to their own dashboard or show an authorization error
  const userId = params.userId || '';
  
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main container with padding */}
      <div className="container py-8 px-4 mx-auto max-w-7xl">
        {/* Top welcome & status bar */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.fullName?.split(' ')[0] || 'Seller'} 👋</h1>
            <p className="text-gray-600 mt-1">
              Here's how your real estate business is performing today.
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center gap-2">
              {getSellerStatusIcon(user?.sellerStatus || 'pending')}
              <Badge className={`px-3 py-1 text-sm ${getStatusBadgeClass(user?.sellerStatus || 'pending')}`}>
                {user?.sellerStatus === 'active' ? 'Active Seller' : 
                 user?.sellerStatus === 'pending' ? 'Pending Approval' : 
                 user?.sellerStatus === 'rejected' ? 'Approval Rejected' : 'Pending Approval'}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Quick Stats 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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
            <h2 className="text-xl font-semibold">Your Properties</h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button 
                className="bg-[#135341] hover:bg-[#09261E] text-white"
                onClick={() => setIsAddPropertyModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Property
              </Button>
              
              <div className="flex gap-2 flex-1">
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
                <Card key={property.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="relative h-48 bg-gray-200">
                    <img 
                      src={property.thumbnail} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e2e8f0/1e293b?text=Property+Image';
                      }}
                    />
                    <Badge className={`absolute top-3 right-3 ${getStatusBadgeClass(property.status)}`}>
                      {property.status}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{property.address}</p>
                    <p className="font-bold text-[#09261E] text-xl mb-3">{property.price}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{property.views} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{property.leads} leads</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{property.daysListed} days</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <MoreHorizontal className="h-4 w-4 mr-2" />
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            Preview public page
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            View in Pipeline
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Edit Listing
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <Button 
                        className="flex-1 bg-[#135341] hover:bg-[#09261E] text-white"
                        onClick={() => setLocation(`/sellerdash/${userId}/property/${property.id}`)}
                      >
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
      </div>
      
      {/* Floating Quick List Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button 
          size="lg"
          className="h-14 w-14 rounded-full bg-[#803344] hover:bg-[#6a2a38] text-white shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => setIsAddPropertyModalOpen(true)}
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Quick List Property</span>
        </Button>
      </div>
    </div>
  );
}