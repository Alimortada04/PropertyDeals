import React, { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import SellerDashboardLayout from '@/components/layout/seller-dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Plus, 
  LayoutGrid, 
  ListIcon, 
  KanbanSquare,
  Calendar,
  PlusCircle,
  ExternalLink,
  Edit,
  Share,
  MoreHorizontal, 
  Clock,
  FileText,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Mock property data for visualization
const MOCK_PROPERTIES = [
  {
    id: 'prop1',
    title: 'Colonial Revival',
    address: '123 Main St, Milwaukee, WI 53201',
    price: '$625,000',
    status: 'Listed',
    thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop',
    daysSinceActivity: 1,
    hasOffers: true,
    hasDocuments: true,
    progress: 20, // progress percentage: 0-100
    dealValue: 625000,
    urgency: 'High'
  },
  {
    id: 'prop2',
    title: 'Modern Farmhouse',
    address: '456 Oak St, Madison, WI 53703',
    price: '$459,000',
    status: 'Offer Made',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop',
    daysSinceActivity: 3,
    hasOffers: true,
    hasDocuments: false,
    progress: 40,
    dealValue: 459000,
    urgency: 'Medium'
  },
  {
    id: 'prop3',
    title: 'Suburban Ranch',
    address: '789 Pine Rd, Green Bay, WI 54301',
    price: '$385,000',
    status: 'Offer Accepted',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop',
    daysSinceActivity: 2,
    hasOffers: true,
    hasDocuments: true,
    progress: 60,
    dealValue: 385000,
    urgency: 'Low'
  },
  {
    id: 'prop4',
    title: 'Victorian Charmer',
    address: '234 Elm St, Appleton, WI 54911',
    price: '$725,000',
    status: 'Close Pending',
    thumbnail: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2670&auto=format&fit=crop',
    daysSinceActivity: 4,
    hasOffers: true,
    hasDocuments: true,
    progress: 80,
    dealValue: 725000,
    urgency: 'Medium'
  },
  {
    id: 'prop5',
    title: 'Lake House Retreat',
    address: '567 Shore Dr, Lake Geneva, WI 53147',
    price: '$899,000',
    status: 'Closed',
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop',
    daysSinceActivity: 30,
    hasOffers: false,
    hasDocuments: true,
    progress: 100,
    dealValue: 899000
  },
  {
    id: 'prop6',
    title: 'Craftsman Bungalow',
    address: '890 Maple Ave, Milwaukee, WI 53211',
    price: '$425,000',
    status: 'Drafts',
    thumbnail: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2670&auto=format&fit=crop',
    daysSinceActivity: 12,
    hasOffers: false,
    hasDocuments: false,
    progress: 10,
    dealValue: 425000,
    urgency: 'Low'
  },
  {
    id: 'prop7',
    title: 'Contemporary Condo',
    address: '123 River St, Milwaukee, WI 53202',
    price: '$349,000',
    status: 'Dropped',
    thumbnail: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?q=80&w=2671&auto=format&fit=crop',
    daysSinceActivity: 60,
    hasOffers: false,
    hasDocuments: true,
    progress: 0,
    dealValue: 349000
  }
];

// Kanban columns definition with descriptions
const COLUMNS = [
  { 
    id: 'drafts', 
    label: 'Drafts', 
    color: 'bg-gray-100', 
    description: 'Incomplete listings' 
  },
  { 
    id: 'listed', 
    label: 'Listed', 
    color: 'bg-green-100', 
    description: 'Active on market' 
  },
  { 
    id: 'offerMade', 
    label: 'Offer Made', 
    color: 'bg-blue-100', 
    description: 'In negotiation' 
  },
  { 
    id: 'offerAccepted', 
    label: 'Offer Accepted', 
    color: 'bg-purple-100', 
    description: 'Moving to closing' 
  },
  { 
    id: 'closePending', 
    label: 'Close Pending', 
    color: 'bg-yellow-100', 
    description: 'Final paperwork' 
  },
  { 
    id: 'closed', 
    label: 'Closed', 
    color: 'bg-gray-100', 
    description: 'Deal completed' 
  },
  { 
    id: 'dropped', 
    label: 'Dropped', 
    color: 'bg-red-100', 
    description: 'No longer active' 
  }
];

// Enhanced Property card component with animations and indicators
const PropertyCard = ({ property }: { property: any }) => {
  const [, setLocation] = useLocation();
  const params = useParams();
  const userId = params.userId || '';
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Get badge class based on urgency
  const getUrgencyBadgeClass = (urgency?: string) => {
    if (!urgency) return "bg-gray-100 text-gray-800";
    
    switch (urgency.toLowerCase()) {
      case 'high':
        return "bg-red-100 text-red-800";
      case 'medium':
        return "bg-orange-100 text-orange-800";
      case 'low':
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Get progress indicator steps (5 steps)
  const getProgressSteps = () => {
    const steps = [
      { position: 0, label: 'Draft' },
      { position: 25, label: 'Listed' },
      { position: 50, label: 'Offer' },
      { position: 75, label: 'Contract' },
      { position: 100, label: 'Closed' }
    ];
    
    return steps.map((step, index) => {
      const isCompleted = property.progress >= step.position;
      const isActive = 
        property.progress >= step.position && 
        (index === steps.length - 1 || property.progress < steps[index + 1].position);
      
      return (
        <div 
          key={index} 
          className="relative"
          title={step.label}
        >
          <div 
            className={`h-2 w-2 rounded-full ${
              isActive ? 'bg-[#135341] ring-2 ring-[#135341]/30 animate-pulse' : 
              isCompleted ? 'bg-[#135341]' : 'bg-gray-300'
            }`}
          />
          {index < steps.length - 1 && (
            <div 
              className={`absolute top-1/2 left-2 h-0.5 w-8 -translate-y-1/2 ${
                isCompleted ? 'bg-[#135341]' : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      );
    });
  };
  
  return (
    <Card 
      className="mb-3 overflow-hidden group hover:shadow-md transition-all duration-200 hover:translate-y-[-2px] border border-gray-200"
      data-property-id={property.id}
      data-status={property.status}
    >
      <div className="relative">
        {/* Property thumbnail */}
        <div className="relative h-40">
          <img 
            src={property.thumbnail} 
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e2e8f0/1e293b?text=Property+Image';
            }}
          />
          
          {/* Urgency tag on image if exists */}
          {property.urgency && (
            <div className="absolute top-2 right-2">
              <Badge 
                className={`font-medium ${getUrgencyBadgeClass(property.urgency)}`}
              >
                {property.urgency}
              </Badge>
            </div>
          )}
          
          {/* Activity warning if inactive for 7+ days */}
          {property.daysSinceActivity >= 7 && (
            <div className="absolute top-2 left-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-white/80 rounded-full p-1">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>No activity for {property.daysSinceActivity} days</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          
          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-4 px-3 pb-2">
            <h3 className="text-white font-semibold truncate">{property.title}</h3>
          </div>
        </div>
        
        {/* Deal stage progress indicator (micro timeline) */}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-1 bg-white/90 flex justify-between items-center">
          {getProgressSteps()}
        </div>
      </div>
      
      <CardContent className="p-3">
        {/* Address */}
        <p className="text-sm text-gray-600 mb-2 truncate">{property.address}</p>
        
        {/* Price and action bar */}
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-[#135341]">{property.price}</span>
          
          {/* Indicators */}
          <div className="flex gap-1">
            {property.hasOffers && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-blue-500">
                      <FileText className="h-4 w-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Offer received</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {property.hasDocuments && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-purple-500">
                      <FileText className="h-4 w-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Documents uploaded</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-gray-400">
                    <Clock className="h-4 w-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{property.daysSinceActivity} days since last activity</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 rounded-full border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            onClick={() => setLocation(`/sellerdash/${userId}/property/${property.id}`)}
          >
            View
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 rounded-full border-gray-300 hover:bg-[#135341]/10 hover:text-[#135341] hover:border-[#135341]/30 transition-colors"
            onClick={() => setLocation(`/sellerdash/${userId}/property/${property.id}/manage`)}
          >
            Manage
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="px-2 rounded-full border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Public Page
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="h-4 w-4 mr-2" />
                Edit Listing
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

// Empty column placeholder
const EmptyColumnPlaceholder = () => (
  <Card className="mb-3 border-dashed border-2 hover:border-gray-300 transition-colors duration-200">
    <div className="p-6 flex flex-col items-center justify-center text-center">
      <div className="rounded-full bg-gray-100 p-3 mb-3">
        <CheckCircle className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="font-medium text-gray-700 mb-1">No properties</h3>
      <p className="text-sm text-gray-500">No properties in this stage</p>
    </div>
  </Card>
);

// Add Property Card for empty state
const AddPropertyCard = ({ onClick }: { onClick: () => void }) => (
  <Card className="mb-3 border-dashed border-2 hover:border-[#135341] hover:bg-[#135341]/5 transition-colors duration-200 cursor-pointer" onClick={onClick}>
    <div className="p-8 flex flex-col items-center justify-center text-center">
      <div className="rounded-full bg-[#135341]/10 p-3 mb-3">
        <PlusCircle className="h-6 w-6 text-[#135341]" />
      </div>
      <h3 className="font-medium text-gray-900 mb-1">Start your first deal</h3>
      <p className="text-sm text-gray-500 mb-3">List a property to get started</p>
      <Button className="mt-2 rounded-full bg-[#135341] hover:bg-[#09261E] text-white">
        <Plus className="h-4 w-4 mr-2" />
        Create Listing
      </Button>
    </div>
  </Card>
);

export default function ManagePage() {
  const params = useParams();
  const userId = params.userId || '';
  const [viewMode, setViewMode] = useState<'kanban' | 'grid' | 'sheet'>('kanban');
  const [, setLocation] = useLocation();
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  
  // Group properties by status for Kanban view
  const propertiesByStatus = MOCK_PROPERTIES.reduce((acc, property) => {
    const status = property.status.replace(' ', '') || 'Drafts';
    const column = COLUMNS.find(col => 
      col.label.toLowerCase() === status.toLowerCase()
    )?.id || 'drafts';
    
    if (!acc[column]) {
      acc[column] = [];
    }
    acc[column].push(property);
    return acc;
  }, {} as Record<string, typeof MOCK_PROPERTIES>);
  
  // Calculate column stats
  const getColumnStats = (columnId: string) => {
    const properties = propertiesByStatus[columnId] || [];
    const totalValue = properties.reduce((sum, prop) => sum + prop.dealValue, 0);
    const totalValueFormatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(totalValue);
    
    return {
      count: properties.length,
      totalValue: totalValueFormatted
    };
  };
  
  return (
    <SellerDashboardLayout userId={userId}>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-[#135341]">Manage Properties</h1>
          
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* View mode toggle */}
            <div className="bg-white p-1 rounded-full border shadow-sm flex">
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('kanban')}
                className={`rounded-full px-3 ${viewMode === 'kanban' ? 'bg-[#135341] text-white' : 'hover:bg-gray-100'}`}
              >
                <KanbanSquare className="h-4 w-4 mr-1.5" />
                Kanban
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`rounded-full px-3 ${viewMode === 'grid' ? 'bg-[#135341] text-white' : 'hover:bg-gray-100'}`}
              >
                <LayoutGrid className="h-4 w-4 mr-1.5" />
                Grid
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('sheet')}
                className={`rounded-full px-3 ${viewMode === 'sheet' ? 'bg-[#135341] text-white' : 'hover:bg-gray-100'}`}
              >
                <ListIcon className="h-4 w-4 mr-1.5" />
                Sheet
              </Button>
            </div>
            
            {/* Add Property button */}
            <Button 
              className="rounded-full bg-[#135341] hover:bg-[#09261E] text-white"
              onClick={() => setIsAddPropertyModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Property
            </Button>
          </div>
        </div>
        
        {/* Kanban board view */}
        {viewMode === 'kanban' && (
          <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-4">
            {COLUMNS.map(column => {
              const stats = getColumnStats(column.id);
              
              return (
                <div 
                  key={column.id} 
                  className={`min-w-[280px] rounded-xl ${column.color} p-4 flex-none`}
                  data-column-id={column.id}
                >
                  <div className="mb-3">
                    {/* Column header */}
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-semibold text-gray-800">{column.label}</h3>
                      <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
                        {stats.count}
                      </Badge>
                    </div>
                    
                    {/* Column description and stats */}
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-xs text-gray-600">{column.description}</p>
                      {stats.count > 0 && (
                        <p className="text-xs font-medium text-gray-700">
                          {stats.count} {stats.count === 1 ? 'Deal' : 'Deals'} • {stats.totalValue}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {/* If column is empty */}
                    {(!propertiesByStatus[column.id] || propertiesByStatus[column.id].length === 0) && (
                      column.id === 'listed' 
                        ? <AddPropertyCard onClick={() => setIsAddPropertyModalOpen(true)} />
                        : <EmptyColumnPlaceholder />
                    )}
                    
                    {/* Show properties in this column */}
                    {propertiesByStatus[column.id]?.map(property => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Grid view (placeholder) */}
        {viewMode === 'grid' && (
          <div className="bg-white/50 p-8 rounded-xl text-center border shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Grid View Coming Soon</h3>
            <p className="text-gray-600">This view is currently in development.</p>
          </div>
        )}
        
        {/* Sheet view (placeholder) */}
        {viewMode === 'sheet' && (
          <div className="bg-white/50 p-8 rounded-xl text-center border shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Sheet View Coming Soon</h3>
            <p className="text-gray-600">This view is currently in development.</p>
          </div>
        )}
      </div>
      
      {/* Floating Add Property Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button 
          size="lg"
          className="h-14 w-14 rounded-full bg-[#135341] hover:bg-[#09261E] text-white shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => setIsAddPropertyModalOpen(true)}
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add Property</span>
        </Button>
      </div>
      
      {/* Property add/edit modal would be included here */}
      {/* For now, we're just using the state to track when it should be open */}
    </SellerDashboardLayout>
  );
}