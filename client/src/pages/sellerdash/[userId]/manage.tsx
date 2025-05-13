import React, { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import SellerDashboardLayout from '@/components/layout/seller-dashboard-layout';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Plus, 
  LayoutGrid, 
  ListIcon, 
  KanbanSquare,
  Clock,
  PlusCircle,
  ExternalLink,
  Edit,
  Share,
  MoreHorizontal, 
  FileText,
  AlertCircle,
  CheckCircle,
  Eye,
  Globe,
  Users,
  Database,
  DollarSign,
  Paperclip,
  MessageCircle,
  MailCheck,
  Loader2,
  GripVertical,
  ArrowUpDown,
  X,
  Pencil
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Toast, ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Mock property data for visualization
const MOCK_PROPERTIES = [
  {
    id: 'prop1',
    title: 'Colonial Revival',
    address: '123 Main St, Milwaukee, WI 53201',
    listPrice: 625000,
    purchasePrice: 589000,
    assignmentProfit: 36000,
    status: 'Listed',
    thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop',
    daysSinceActivity: 1,
    hasOffers: true,
    newOffer: true,
    hasDocuments: true,
    hasPADocument: true,
    beds: 5,
    baths: 3.5,
    sqft: 3200,
    arv: 725000,
    views: 42,
    leads: 8,
    daysOnMarket: 12,
    offers: 3,
    priority: 'High',
    hasNewMessage: true
  },
  {
    id: 'prop2',
    title: 'Modern Farmhouse',
    address: '456 Oak St, Madison, WI 53703',
    listPrice: 459000,
    purchasePrice: 425000,
    assignmentProfit: 34000,
    status: 'Offer Made',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop',
    daysSinceActivity: 3,
    hasOffers: true,
    newOffer: false,
    hasDocuments: false,
    hasPADocument: false,
    beds: 4,
    baths: 3,
    sqft: 2800,
    arv: 550000,
    views: 68,
    leads: 12,
    daysOnMarket: 5,
    offers: 2,
    priority: 'Medium'
  },
  {
    id: 'prop3',
    title: 'Suburban Ranch',
    address: '789 Pine Rd, Green Bay, WI 54301',
    listPrice: 385000,
    purchasePrice: 360000,
    assignmentProfit: 25000,
    status: 'Offer Accepted',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop',
    daysSinceActivity: 2,
    hasOffers: true,
    newOffer: false,
    hasDocuments: true,
    hasPADocument: true,
    beds: 3,
    baths: 2,
    sqft: 2200,
    arv: 420000,
    views: 37,
    leads: 4,
    daysOnMarket: 30,
    offers: 4,
    priority: 'Low',
    hasNewMessage: true
  },
  {
    id: 'prop4',
    title: 'Victorian Charmer',
    address: '234 Elm St, Appleton, WI 54911',
    listPrice: 725000,
    purchasePrice: 685000,
    assignmentProfit: 40000,
    status: 'Close Pending',
    thumbnail: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2670&auto=format&fit=crop',
    daysSinceActivity: 4,
    hasOffers: true,
    newOffer: false,
    hasDocuments: true,
    hasPADocument: true,
    beds: 6,
    baths: 4.5,
    sqft: 4100,
    arv: 850000,
    views: 92,
    leads: 15,
    daysOnMarket: 45,
    offers: 5,
    priority: 'Medium'
  },
  {
    id: 'prop5',
    title: 'Lake House Retreat',
    address: '567 Shore Dr, Lake Geneva, WI 53147',
    listPrice: 899000,
    purchasePrice: 845000,
    assignmentProfit: 54000,
    status: 'Closed',
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop',
    daysSinceActivity: 30,
    hasOffers: false,
    newOffer: false,
    hasDocuments: true,
    hasPADocument: true,
    beds: 5,
    baths: 4,
    sqft: 3900,
    arv: 950000,
    views: 128,
    leads: 22,
    daysOnMarket: 90,
    offers: 3,
    priority: 'Low'
  },
  {
    id: 'prop6',
    title: 'Craftsman Bungalow',
    address: '890 Maple Ave, Milwaukee, WI 53211',
    listPrice: 425000,
    purchasePrice: 399000,
    assignmentProfit: 26000,
    status: 'Drafts',
    thumbnail: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2670&auto=format&fit=crop',
    daysSinceActivity: 12,
    hasOffers: false,
    newOffer: false,
    hasDocuments: false,
    hasPADocument: false,
    beds: 3,
    baths: 2,
    sqft: 1800,
    arv: 475000,
    views: 0,
    leads: 0,
    daysOnMarket: 0,
    offers: 0,
    priority: 'Low'
  },
  {
    id: 'prop7',
    title: 'Contemporary Condo',
    address: '123 River St, Milwaukee, WI 53202',
    listPrice: 349000,
    purchasePrice: 329000,
    assignmentProfit: 20000,
    status: 'Dropped',
    thumbnail: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?q=80&w=2671&auto=format&fit=crop',
    daysSinceActivity: 60,
    hasOffers: false,
    newOffer: false,
    hasDocuments: true,
    hasPADocument: false,
    beds: 2,
    baths: 2,
    sqft: 1200,
    arv: 375000,
    views: 45,
    leads: 6,
    daysOnMarket: 60,
    offers: 1,
    priority: 'Low'
  }
];

// Kanban columns definition with descriptions
const INITIAL_COLUMNS = [
  { 
    id: 'drafts', 
    label: 'Drafts', 
    description: 'Incomplete listings',
    color: 'border-l-gray-300',
    canRename: false,
    canDelete: false,
    canReorder: true
  },
  { 
    id: 'listed', 
    label: 'Listed', 
    description: 'Active on market',
    color: 'border-l-green-500',
    canRename: false,
    canDelete: false,
    canReorder: true
  },
  { 
    id: 'offerMade', 
    label: 'Offer Made', 
    description: 'In negotiation',
    color: 'border-l-blue-500',
    canRename: false,
    canDelete: false,
    canReorder: true
  },
  { 
    id: 'offerAccepted', 
    label: 'Offer Accepted', 
    description: 'Moving to closing',
    color: 'border-l-purple-500',
    canRename: false,
    canDelete: false,
    canReorder: true
  },
  { 
    id: 'closePending', 
    label: 'Close Pending', 
    description: 'Final paperwork',
    color: 'border-l-orange-500',
    canRename: false,
    canDelete: false,
    canReorder: true
  },
  { 
    id: 'closed', 
    label: 'Closed', 
    description: 'Deal completed',
    color: 'border-l-gray-500',
    canRename: false,
    canDelete: false,
    canReorder: true
  },
  { 
    id: 'dropped', 
    label: 'Dropped', 
    description: 'No longer active',
    color: 'border-l-red-500',
    canRename: false,
    canDelete: false,
    canReorder: true
  }
];

// Format currency for display
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

// Enhanced Property card component with the same style as Discover view
const PropertyCard = ({ property, onDragStart, onDrop }: { 
  property: any; 
  onDragStart: (e: React.DragEvent, propertyId: string, currentStatus: string) => void;
  onDrop: (propertyId: string, newStatus: string) => void;
}) => {
  const [, setLocation] = useLocation();
  const params = useParams();
  const userId = params.userId || '';
  
  // Get badge class based on priority
  const getPriorityBadgeClass = (priority?: string) => {
    if (!priority) return "bg-gray-100 text-gray-800";
    
    switch (priority.toLowerCase()) {
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
  
  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'listed':
        return 'bg-green-100 text-green-800';
      case 'offer made':
        return 'bg-blue-100 text-blue-800';
      case 'offer accepted':
        return 'bg-purple-100 text-purple-800';
      case 'close pending':
        return 'bg-orange-100 text-orange-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'drafts':
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'dropped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle card click to navigate to property detail page
  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if the click wasn't on a button or dropdown
    if (
      !(e.target as HTMLElement).closest('button') && 
      !(e.target as HTMLElement).closest('[role="menu"]')
    ) {
      setLocation(`/sellerdash/${userId}/property/${property.id}`);
    }
  };
  
  // Format number with thousands separators
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  return (
    <Card 
      className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.01] bg-white border border-gray-200 cursor-pointer mb-3"
      onClick={handleCardClick}
      draggable={true}
      onDragStart={(e) => onDragStart(e, property.id, property.status)}
      data-property-id={property.id}
      data-status={property.status}
    >
      <div className="relative">
        {/* Property image */}
        <img 
          src={property.thumbnail} 
          alt={property.title}
          className="w-full h-48 object-cover" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e2e8f0/1e293b?text=Property+Image';
          }}
        />
        
        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className={`px-3 py-1 font-medium ${getStatusBadgeClass(property.status)}`}>
            {property.status}
          </Badge>
          
          {property.newOffer && (
            <Badge className="bg-blue-500 text-white px-3 py-1 font-medium">
              New Offer
            </Badge>
          )}
        </div>
        
        <div className="absolute top-3 right-3">
          {property.priority && (
            <Badge className={`px-3 py-1 font-medium ${getPriorityBadgeClass(property.priority)}`}>
              {property.priority}
            </Badge>
          )}
        </div>
        
        {/* Document indicator */}
        {property.hasPADocument && (
          <div className="absolute bottom-3 right-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-white rounded-full p-1.5 shadow-md">
                    <Paperclip className="h-4 w-4 text-purple-600" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Purchase Agreement uploaded</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        
        {/* New message indicator */}
        {property.hasNewMessage && (
          <div className="absolute bottom-3 left-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-blue-500 rounded-full p-1.5 shadow-md">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>New message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      
      <CardContent className="pt-4">
        {/* Property title and address */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{property.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-1">{property.address}</p>
        </div>
        
        {/* Property specs */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="bg-gray-50 font-normal">
            {property.beds} bed
          </Badge>
          <Badge variant="outline" className="bg-gray-50 font-normal">
            {property.baths} bath
          </Badge>
          <Badge variant="outline" className="bg-gray-50 font-normal">
            {formatNumber(property.sqft)} sqft
          </Badge>
        </div>
        
        {/* Financial info */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
          <div>
            <div className="text-gray-500">List Price</div>
            <div className="font-semibold">{formatCurrency(property.listPrice)}</div>
          </div>
          <div>
            <div className="text-gray-500">Purchase</div>
            <div className="font-semibold">{formatCurrency(property.purchasePrice)}</div>
          </div>
          <div>
            <div className="text-gray-500">Profit</div>
            <div className="font-semibold text-green-600">{formatCurrency(property.assignmentProfit)}</div>
          </div>
        </div>
      </CardContent>
      
      {/* Stats footer */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-600">
            <Eye className="h-4 w-4" />
            <span>{property.views}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Users className="h-4 w-4" />
            <span>{property.leads}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{property.daysOnMarket} days</span>
          </div>
        </div>
      </div>
      
      <CardFooter className="flex items-center justify-between gap-2 pt-2 pb-4 px-6">
        {/* Action buttons - now full width with 3 buttons */}
        <div className="grid grid-cols-3 gap-2 w-full">
          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-gray-700 hover:bg-gray-100 focus:ring-0 transition-all group relative overflow-hidden"
              >
                <div className="flex items-center relative z-20">
                  <MoreHorizontal className="h-4 w-4 mr-1 text-gray-700 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="text-gray-700">Actions</span>
                </div>
                <span className="absolute inset-0 bg-gray-100 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 z-10"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[180px]">
              <DropdownMenuItem 
                onClick={(e) => e.stopPropagation()}
                className="hover:bg-gray-100 focus:bg-gray-100 focus:text-[#135341] text-gray-700 cursor-pointer transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => e.stopPropagation()}
                className="hover:bg-gray-100 focus:bg-gray-100 focus:text-[#135341] text-gray-700 cursor-pointer transition-colors"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => e.stopPropagation()}
                className="hover:bg-gray-100 focus:bg-gray-100 focus:text-[#135341] text-gray-700 cursor-pointer transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Pipeline
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => e.stopPropagation()}
                className="hover:bg-gray-100 focus:bg-gray-100 focus:text-[#135341] text-gray-700 cursor-pointer transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => e.stopPropagation()}
                className="hover:bg-gray-100 focus:bg-gray-100 focus:text-[#135341] text-gray-700 cursor-pointer transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Wine-colored Market button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-[#803344] border-[#803344] bg-white hover:bg-[#803344] hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setLocation(`/sellerdash/${userId}/property/${property.id}?tab=marketing`);
            }}
          >
            <Globe className="h-4 w-4 mr-1" />
            Market
          </Button>
          
          {/* Primary button: Offers */}
          <Button 
            variant="default" 
            size="sm" 
            className="w-full bg-[#135341] hover:bg-[#09261E] text-white"
            onClick={(e) => {
              e.stopPropagation();
              setLocation(`/sellerdash/${userId}/property/${property.id}?tab=offers`);
            }}
          >
            Offers ({property.offers})
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Empty column placeholder
const EmptyColumnPlaceholder = () => (
  <Card className="mb-3 border-dashed border-2 hover:border-gray-300 transition-colors duration-200 bg-white">
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
  <Card className="mb-3 border-dashed border-2 hover:border-[#135341] hover:bg-[#135341]/5 transition-colors duration-200 cursor-pointer bg-white" onClick={onClick}>
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
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [editColumnId, setEditColumnId] = useState<string | null>(null);
  const [editColumnName, setEditColumnName] = useState('');
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingColumn, setIsDraggingColumn] = useState(false);
  const [draggedPropertyId, setDraggedPropertyId] = useState<string | null>(null);
  const [draggedPropertyStatus, setDraggedPropertyStatus] = useState<string | null>(null);
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  
  // Data state
  const [properties, setProperties] = useState(MOCK_PROPERTIES);
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  
  // Tooltips
  const [tooltipsEnabled, setTooltipsEnabled] = useState(true);
  
  // Page ref for constraint measurements
  const pageRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  
  // Toast
  const { toast } = useToast();
  
  // Adjust the container height for vertical scrolling
  useEffect(() => {
    const adjustHeight = () => {
      if (pageRef.current && columnsRef.current) {
        const viewportHeight = window.innerHeight;
        const pageTop = pageRef.current.getBoundingClientRect().top;
        // Allow space for bottom margin and floating button
        const bottomSpace = 100;
        
        // Set the height for the columns container
        const availableHeight = viewportHeight - pageTop - bottomSpace;
        columnsRef.current.style.height = `${availableHeight}px`;
      }
    };
    
    adjustHeight();
    window.addEventListener('resize', adjustHeight);
    
    return () => {
      window.removeEventListener('resize', adjustHeight);
    };
  }, []);
  
  // Group properties by status for Kanban view
  const propertiesByStatus = properties.reduce((acc, property) => {
    const status = property.status.replace(/\s+/g, '') || 'Drafts';
    const column = columns.find(col => 
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
    const totalValue = properties.reduce((sum, prop) => sum + prop.listPrice, 0);
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
  
  // Handle drag start for properties
  const handleDragStart = (e: React.DragEvent, propertyId: string, currentStatus: string) => {
    setIsDragging(true);
    setDraggedPropertyId(propertyId);
    setDraggedPropertyStatus(currentStatus);
    
    // Make the drag image transparent
    const dragImage = document.createElement('div');
    dragImage.style.width = '1px';
    dragImage.style.height = '1px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Set data transfer
    e.dataTransfer.setData('property-id', propertyId);
    e.dataTransfer.setData('drag-type', 'property');
    e.dataTransfer.effectAllowed = 'move';
  };
  
  // Handle drag start for columns
  const handleColumnDragStart = (e: React.DragEvent, columnId: string) => {
    setIsDraggingColumn(true);
    setDraggedColumnId(columnId);
    
    // Make the drag image transparent
    const dragImage = document.createElement('div');
    dragImage.style.width = '1px';
    dragImage.style.height = '1px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Set data transfer
    e.dataTransfer.setData('column-id', columnId);
    e.dataTransfer.setData('drag-type', 'column');
    e.dataTransfer.effectAllowed = 'move';
  };
  
  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  // Handle column drop for reordering
  const handleColumnDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const dragType = e.dataTransfer.getData('drag-type');
    
    if (dragType === 'column' && draggedColumnId && draggedColumnId !== targetColumnId) {
      // Reorder columns
      const columnToMove = columns.find(col => col.id === draggedColumnId);
      const targetIndex = columns.findIndex(col => col.id === targetColumnId);
      
      if (columnToMove && targetIndex !== -1) {
        const newColumns = [...columns.filter(col => col.id !== draggedColumnId)];
        newColumns.splice(targetIndex, 0, columnToMove);
        setColumns(newColumns);
        
        toast({
          title: 'Column Reordered',
          description: `Moved ${columnToMove.label} column to a new position`,
        });
      }
    }
    
    setIsDraggingColumn(false);
    setDraggedColumnId(null);
  };
  
  // Handle property drop
  const handlePropertyDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    
    const dragType = e.dataTransfer.getData('drag-type');
    
    if (dragType === 'property') {
      const propertyId = e.dataTransfer.getData('property-id');
      
      if (draggedPropertyId && draggedPropertyStatus) {
        // Convert columnId to status label
        const newStatusColumn = columns.find(col => col.id === columnId);
        if (newStatusColumn) {
          handlePropertyMove(propertyId, newStatusColumn.label);
        }
      }
    }
    
    setIsDragging(false);
    setDraggedPropertyId(null);
    setDraggedPropertyStatus(null);
  };
  
  // Handle property move
  const handlePropertyMove = (propertyId: string, newStatus: string) => {
    // Get the property
    const property = properties.find(p => p.id === propertyId);
    if (!property || property.status === newStatus) return;
    
    // Update the property status
    const updatedProperties = properties.map(p => {
      if (p.id === propertyId) {
        return { ...p, status: newStatus };
      }
      return p;
    });
    
    // Update state
    setProperties(updatedProperties);
    
    // Show toast notification
    toast({
      title: 'Property Status Updated',
      description: `Moved ${property.title} to ${newStatus}`,
      action: (
        <ToastAction altText="Undo" onClick={() => handleUndoMove(propertyId, property.status)}>
          Undo
        </ToastAction>
      ),
    });
  };
  
  // Handle undo move
  const handleUndoMove = (propertyId: string, originalStatus: string) => {
    // Revert the property status
    const updatedProperties = properties.map(p => {
      if (p.id === propertyId) {
        return { ...p, status: originalStatus };
      }
      return p;
    });
    
    // Update state
    setProperties(updatedProperties);
    
    toast({
      title: 'Change Reverted',
      description: 'Property status has been reset',
    });
  };
  
  // Add new column
  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;
    
    // Create column ID from name
    const columnId = newColumnName.toLowerCase().replace(/\s+/g, '');
    
    // Check if column with this ID already exists
    if (columns.some(col => col.id === columnId)) {
      toast({
        title: 'Error',
        description: 'A column with this name already exists',
        variant: 'destructive',
      });
      return;
    }
    
    // Add new column
    const newColumn = {
      id: columnId,
      label: newColumnName,
      description: 'Custom stage',
      color: 'border-l-gray-500', // Default color
      canRename: true,
      canDelete: true,
      canReorder: true
    };
    
    setColumns([...columns, newColumn]);
    setNewColumnName('');
    setIsAddColumnOpen(false);
    
    toast({
      title: 'Column Added',
      description: `Added new ${newColumnName} column`,
    });
  };
  
  // Edit column name
  const handleEditColumn = () => {
    if (!editColumnId || !editColumnName.trim()) return;
    
    // Update column name
    const updatedColumns = columns.map(col => {
      if (col.id === editColumnId) {
        return { ...col, label: editColumnName };
      }
      return col;
    });
    
    setColumns(updatedColumns);
    setEditColumnId(null);
    setEditColumnName('');
    
    toast({
      title: 'Column Updated',
      description: 'Column name has been updated',
    });
  };
  
  // Delete column
  const handleDeleteColumn = (columnId: string) => {
    // Check if column can be deleted
    const column = columns.find(col => col.id === columnId);
    if (!column || !column.canDelete) return;
    
    // Check if column has properties
    const hasProperties = propertiesByStatus[columnId]?.length > 0;
    if (hasProperties) {
      toast({
        title: 'Cannot Delete',
        description: 'Move all properties out of this column first',
        variant: 'destructive',
      });
      return;
    }
    
    // Remove column
    setColumns(columns.filter(col => col.id !== columnId));
    
    toast({
      title: 'Column Deleted',
      description: `Deleted ${column.label} column`,
    });
  };
  
  return (
    <SellerDashboardLayout userId={userId}>
      <div className="space-y-6" ref={pageRef}>
        {/* Page header with pill tabs like buyer dashboard */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-[#135341]">Manage Properties</h1>
          
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* View mode toggle - match buyer dashboard exactly */}
            <div className="bg-white p-1.5 rounded-full border border-gray-200 shadow-sm flex">
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('kanban')}
                className={`rounded-full px-3 ${
                  viewMode === 'kanban' 
                    ? 'bg-[#135341] text-white font-bold' 
                    : 'text-gray-600 hover:bg-gray-100'
                } transition-all duration-200`}
              >
                <KanbanSquare className={`h-4 w-4 mr-1.5 ${viewMode === 'kanban' ? 'text-white' : 'text-gray-500'}`} />
                Kanban
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`rounded-full px-3 ${
                  viewMode === 'grid' 
                    ? 'bg-[#135341] text-white font-bold' 
                    : 'text-gray-600 hover:bg-gray-100'
                } transition-all duration-200`}
              >
                <LayoutGrid className={`h-4 w-4 mr-1.5 ${viewMode === 'grid' ? 'text-white' : 'text-gray-500'}`} />
                Grid
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('sheet')}
                className={`rounded-full px-3 ${
                  viewMode === 'sheet' 
                    ? 'bg-[#135341] text-white font-bold' 
                    : 'text-gray-600 hover:bg-gray-100'
                } transition-all duration-200`}
              >
                <ListIcon className={`h-4 w-4 mr-1.5 ${viewMode === 'sheet' ? 'text-white' : 'text-gray-500'}`} />
                Sheet
              </Button>
            </div>
            
            {/* Add Property button */}
            <Button 
              className="bg-[#135341] hover:bg-[#09261E] text-white font-medium px-4"
              onClick={() => setIsAddPropertyModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Property
            </Button>
          </div>
        </div>
        
        {/* Kanban board view */}
        {viewMode === 'kanban' && (
          <div 
            className="flex space-x-4 overflow-x-auto pb-6 -mx-6 px-6" 
            ref={columnsRef}
          >
            {columns.map((column, columnIndex) => {
              const stats = getColumnStats(column.id);
              
              return (
                <div 
                  key={column.id} 
                  className={`flex-none w-[320px] bg-white rounded-xl border ${column.color} border-l-4 shadow-sm overflow-visible`}
                  data-column-id={column.id}
                  draggable={column.canReorder}
                  onDragStart={(e) => handleColumnDragStart(e, column.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleColumnDrop(e, column.id)}
                >
                  {/* Column header - sticky */}
                  <div className="sticky top-0 bg-white z-20 p-3 border-b border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1.5">
                        {column.canReorder && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="cursor-grab p-0.5 hover:bg-gray-100 rounded">
                                  <GripVertical className="h-4 w-4 text-gray-400" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" sideOffset={5} className="z-[100]">
                                <p>Drag to reorder column</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        
                        {/* Column title with inline edit */}
                        {editColumnId === column.id ? (
                          <div className="flex items-center">
                            <Input
                              value={editColumnName}
                              onChange={(e) => setEditColumnName(e.target.value)}
                              className="h-7 py-0 text-sm font-medium w-[140px]"
                              autoFocus
                              onBlur={handleEditColumn}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleEditColumn();
                                if (e.key === 'Escape') {
                                  setEditColumnId(null);
                                  setEditColumnName('');
                                }
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 ml-1"
                              onClick={handleEditColumn}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => {
                                setEditColumnId(null);
                                setEditColumnName('');
                              }}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <h3 className="font-semibold text-gray-800">{column.label}</h3>
                            {column.canRename && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  setEditColumnId(column.id);
                                  setEditColumnName(column.label);
                                }}
                              >
                                <Pencil className="h-3 w-3 text-gray-500" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="bg-white/90 backdrop-blur-sm font-medium">
                          {stats.count}
                        </Badge>
                        
                        {column.canDelete && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 rounded-full hover:bg-red-50 hover:text-red-600"
                                  onClick={() => handleDeleteColumn(column.id)}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top" sideOffset={5} className="z-[100]">
                                <p>Delete column</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                    
                    {/* Column description and stats */}
                    <div className="flex justify-between items-center mb-2 text-sm">
                      <p className="text-xs text-gray-600">{column.description}</p>
                      {stats.count > 0 && (
                        <p className="text-xs font-medium text-gray-700">
                          {stats.count} {stats.count === 1 ? 'Deal' : 'Deals'} • {stats.totalValue}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Column content area - scrollable */}
                  <div 
                    className="p-3 overflow-y-auto"
                    style={{ maxHeight: 'calc(100% - 80px)' }}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handlePropertyDrop(e, column.id)}
                  >
                    <div className="space-y-4 min-h-[50px]">
                      {/* If column is empty */}
                      {(!propertiesByStatus[column.id] || propertiesByStatus[column.id].length === 0) && (
                        column.id === 'listed' 
                          ? <AddPropertyCard onClick={() => setIsAddPropertyModalOpen(true)} />
                          : <EmptyColumnPlaceholder />
                      )}
                      
                      {/* Show properties in this column */}
                      {propertiesByStatus[column.id]?.map(property => (
                        <PropertyCard 
                          key={property.id} 
                          property={property} 
                          onDragStart={handleDragStart}
                          onDrop={handlePropertyMove}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Add Column button */}
            <div className="flex-none w-[100px] flex items-start pt-3">
              {isAddColumnOpen ? (
                <Card className="w-[320px] border-dashed border-2 p-3">
                  <div className="space-y-3">
                    <Label htmlFor="new-column-name">Column Name</Label>
                    <Input
                      id="new-column-name"
                      value={newColumnName}
                      onChange={(e) => setNewColumnName(e.target.value)}
                      placeholder="Enter column name"
                      className="h-9"
                      autoFocus
                    />
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setIsAddColumnOpen(false);
                          setNewColumnName('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleAddColumn}
                        disabled={!newColumnName.trim()}
                      >
                        Add Column
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Button
                  variant="outline"
                  className="border-dashed border-2 h-10 px-3 bg-white hover:bg-gray-50"
                  onClick={() => setIsAddColumnOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Column
                </Button>
              )}
            </div>
          </div>
        )}
        
        {/* Grid view (placeholder) */}
        {viewMode === 'grid' && (
          <div className="bg-white p-8 rounded-xl text-center border shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Grid View Coming Soon</h3>
            <p className="text-gray-600">This view is currently in development.</p>
          </div>
        )}
        
        {/* Sheet view (placeholder) */}
        {viewMode === 'sheet' && (
          <div className="bg-white p-8 rounded-xl text-center border shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Sheet View Coming Soon</h3>
            <p className="text-gray-600">This view is currently in development.</p>
          </div>
        )}
      </div>
      
      {/* Floating Actions Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="lg"
              className="h-14 w-14 rounded-full bg-[#135341] hover:bg-[#09261E] text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-6 w-6" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60 p-1" align="end" sideOffset={5}>
            <DropdownMenuItem 
              className="cursor-pointer py-2.5 pl-3 rounded-md focus:bg-[#135341]/10 focus:text-[#135341]"
              onClick={() => setIsAddPropertyModalOpen(true)}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              <span>Add Deal</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer py-2.5 pl-3 rounded-md focus:bg-[#135341]/10 focus:text-[#135341]"
            >
              <MailCheck className="h-4 w-4 mr-2" />
              <span>Launch Campaign</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer py-2.5 pl-3 rounded-md focus:bg-[#135341]/10 focus:text-[#135341]"
            >
              <Database className="h-4 w-4 mr-2" />
              <span>Run Deal Analysis</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Drag indicators */}
      {isDragging && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none bg-[#135341]/90 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse flex items-center">
          <Loader2 className="animate-spin h-4 w-4 mr-2" />
          Moving property...
        </div>
      )}
      
      {isDraggingColumn && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none bg-[#135341]/90 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse flex items-center">
          <Loader2 className="animate-spin h-4 w-4 mr-2" />
          Reordering columns...
        </div>
      )}
      
      {/* Add Column Sheet */}
      <Sheet open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add New Column</SheetTitle>
            <SheetDescription>
              Create a new column for your custom deal stage.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="column-name">Column Name</Label>
              <Input 
                id="column-name" 
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                placeholder="e.g., Due Diligence"
                className="col-span-3" 
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button 
              onClick={handleAddColumn}
              disabled={!newColumnName.trim()}
            >
              Add Column
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Property add/edit modal would be included here */}
      {/* For now, we're just using the state to track when it should be open */}
    </SellerDashboardLayout>
  );
}