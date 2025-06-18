import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import SellerDashboardLayout from '@/components/layout/seller-dashboard-layout';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { usePropertyProfile } from '@/hooks/usePropertyProfile';
import { useAuth } from '@/hooks/use-auth';
import { EnhancedPropertyListingModal } from '@/components/property/enhanced-property-listing-modal';
import { 
  Plus, 
  Search,
  LayoutGrid, 
  ListIcon, 
  KanbanSquare,
  MapPin,
  DollarSign,
  Eye,
  Edit,
  MoreHorizontal,
  Home,
  Calendar,
  Filter,
  Share,
  ExternalLink,
  Copy,
  Send
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

// Status options for multi-select filtering - using exact database enum values
const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' }, // Special filter that includes live, offer_accepted, pending
  { value: 'draft', label: 'Drafts' },
  { value: 'live', label: 'Live' },
  { value: 'offer_accepted', label: 'Offer Accepted' },
  { value: 'pending', label: 'Pending' },
  { value: 'closed', label: 'Closed' },
  { value: 'dropped', label: 'Dropped' }
];

// Default selected statuses - set Active as default
const DEFAULT_STATUS_FILTERS = ['active'];

// Status color mapping as requested by user
const statusColorMap = {
  "draft": "gray",
  "pending": "yellow", 
  "live": "green",
  "offer_accepted": "blue",
  "closed": "green",
  "dropped": "red",
};

export default function SellerManagePage() {
  const params = useParams();
  const { user } = useAuth();
  const userId = params.userId || '';
  
  // Property management state
  const { 
    properties, 
    isLoading, 
    fetchSellerProperties,
    totalProperties 
  } = usePropertyProfile();
  
  // UI state
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState<string[]>(DEFAULT_STATUS_FILTERS);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // Convert status filters to actual database statuses
  const getActualStatusFilters = (filters: string[]) => {
    const actualFilters: string[] = [];
    
    filters.forEach(filter => {
      if (filter === 'active') {
        // Active includes live, offer_accepted, and pending
        actualFilters.push('live', 'offer_accepted', 'pending');
      } else {
        actualFilters.push(filter);
      }
    });
    
    // Remove duplicates
    return [...new Set(actualFilters)];
  };

  // Load properties with current filters
  useEffect(() => {
    if (user?.id) {
      const actualFilters = getActualStatusFilters(statusFilters);
      fetchSellerProperties(actualFilters);
    }
  }, [user?.id, statusFilters]);

  // Filter and sort properties based on search query and status priority
  const filteredProperties = properties.filter(property => {
    const matchesSearch = !searchQuery || 
      property.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  }).sort((a, b) => {
    // Define status priority order: live, offer_accepted, pending, draft, closed, dropped
    const statusPriority: Record<string, number> = {
      'live': 1,
      'offer_accepted': 2,
      'pending': 3,
      'draft': 4,
      'closed': 5,
      'dropped': 6
    };
    
    // First sort by status priority
    const statusComparison = (statusPriority[a.status] || 999) - (statusPriority[b.status] || 999);
    if (statusComparison !== 0) return statusComparison;
    
    // Then sort by newest (createdAt) within the same status
    const dateA = new Date(a.createdAt || a.created_at || 0);
    const dateB = new Date(b.createdAt || b.created_at || 0);
    return dateB.getTime() - dateA.getTime(); // Newest first
  });

  // Handle status filter changes
  const handleStatusFilterChange = (newFilters: string[]) => {
    setStatusFilters(newFilters);
  };

  // Handle property actions
  const handleEditProperty = (property: any) => {
    window.location.href = `/sellerdash/${userId}/property/${property.id}`;
  };

  const handlePreviewProperty = (property: any) => {
    window.open(`/p/${property.id}`, '_blank');
  };

  const handleShareProperty = (property: any) => {
    setSelectedProperty(property);
    setShareModalOpen(true);
  };

  const handleCopyLink = () => {
    if (selectedProperty) {
      const shareUrl = `${window.location.origin}/p/${selectedProperty.id}`;
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Property link copied to clipboard",
      });
    }
  };

  // Get status badge styling with exact color requirements
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': { label: 'Draft', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'live': { label: 'Live', className: 'bg-green-100 text-green-800 border-green-200' },
      'offer_accepted': { label: 'Offer Accepted', className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'pending': { label: 'Pending', className: 'bg-orange-100 text-orange-800 border-orange-200' },
      'closed': { label: 'Closed', className: 'bg-green-800 text-white border-green-800' },
      'dropped': { label: 'Dropped', className: 'bg-red-100 text-red-800 border-red-200' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
        {config.label}
      </span>
    );
  };

  // Format currency
  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Property Card Component
  const PropertyCard = ({ property }: { property: any }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        {property.primary_image ? (
          <img 
            src={property.primary_image} 
            alt={property.name || 'Property'}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <Home className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          {getStatusBadge(property.status)}
        </div>
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditProperty(property)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePreviewProperty(property)}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShareProperty(property)}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <h3 className="font-semibold text-lg text-gray-900 truncate">
          {property.name || 'Untitled Property'}
        </h3>
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="truncate">
            {property.address || 'No address provided'}
            {property.city && `, ${property.city}`}
            {property.state && `, ${property.state}`}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Purchase Price</span>
            <p className="font-semibold text-gray-900">
              {formatCurrency(property.purchase_price)}
            </p>
          </div>
          <div>
            <span className="text-gray-500">List Price</span>
            <p className="font-semibold text-gray-900">
              {formatCurrency(property.listing_price)}
            </p>
          </div>
          {property.assignment_fee && (
            <>
              <div>
                <span className="text-gray-500">Assignment Fee</span>
                <p className="font-semibold text-green-600">
                  {formatCurrency(property.assignment_fee)}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Profit Margin</span>
                <p className="font-semibold text-green-600">
                  {property.listing_price && property.purchase_price && property.assignment_fee
                    ? `${(((property.assignment_fee) / property.purchase_price) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </p>
              </div>
            </>
          )}
        </div>
        
        {property.bedrooms || property.bathrooms || property.sqft ? (
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            {property.bedrooms && <span>{property.bedrooms} bed</span>}
            {property.bathrooms && <span>{property.bathrooms} bath</span>}
            {property.sqft && <span>{property.sqft.toLocaleString()} sqft</span>}
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {property.created_at 
                ? new Date(property.created_at).toLocaleDateString()
                : 'No date'
              }
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{property.view_count || 0}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <SellerDashboardLayout userId={userId}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Properties</h1>
            <p className="text-gray-600 mt-1">
              {totalProperties} {totalProperties === 1 ? 'property' : 'properties'} total
            </p>
          </div>
          <Button onClick={() => setIsAddPropertyModalOpen(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            List a Property
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-lg border">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search properties by name, address, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Status:</span>
            </div>
            <div className="min-w-[200px]">
              <MultiSelect
                options={STATUS_OPTIONS}
                selected={statusFilters}
                onSelectionChange={handleStatusFilterChange}
                placeholder="Select status..."
              />
            </div>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-3"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-3"
            >
              <ListIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
              className="px-3"
            >
              <KanbanSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">
              {properties.length === 0 
                ? "Get started by listing your first property."
                : "Try adjusting your search or status filters."
              }
            </p>
            <Button onClick={() => setIsAddPropertyModalOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              List a Property
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>

      {/* Property Listing Modal */}
      <EnhancedPropertyListingModal
        isOpen={isAddPropertyModalOpen}
        onClose={() => setIsAddPropertyModalOpen(false)}
      />

      {/* Share Property Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Property</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedProperty && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">{selectedProperty.name || 'Property'}</h4>
                <p className="text-sm text-gray-600">
                  {selectedProperty.address}
                  {selectedProperty.city && `, ${selectedProperty.city}`}
                  {selectedProperty.state && `, ${selectedProperty.state}`}
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <Button 
                onClick={handleCopyLink}
                className="w-full justify-start"
                variant="outline"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              
              <Button 
                onClick={() => {
                  if (selectedProperty) {
                    const shareUrl = `${window.location.origin}/p/${selectedProperty.id}`;
                    const message = `Check out this property: ${selectedProperty.name || 'Property'} - ${shareUrl}`;
                    window.open(`mailto:?subject=Property Listing&body=${encodeURIComponent(message)}`, '_blank');
                  }
                }}
                className="w-full justify-start"
                variant="outline"
              >
                <Send className="h-4 w-4 mr-2" />
                Share via Email
              </Button>
              
              <Button 
                onClick={() => {
                  if (selectedProperty) {
                    const shareUrl = `${window.location.origin}/p/${selectedProperty.id}`;
                    const message = `Check out this property: ${selectedProperty.name || 'Property'} ${shareUrl}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                  }
                }}
                className="w-full justify-start"
                variant="outline"
              >
                <Send className="h-4 w-4 mr-2" />
                Share via WhatsApp
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SellerDashboardLayout>
  );
}