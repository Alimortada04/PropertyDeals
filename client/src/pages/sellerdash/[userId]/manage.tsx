import React, { useState } from 'react';
import { useParams } from 'wouter';
import SellerDashboardLayout from '@/components/layout/seller-dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  LayoutGrid, 
  List, 
  FileText, 
  Calendar,
  PlusCircle,
  File,
  ArrowRight
} from 'lucide-react';

// Mock property data for visualization
const MOCK_PROPERTIES = [
  {
    id: 'prop1',
    title: 'Colonial Revival',
    address: '123 Main St, Milwaukee, WI 53201',
    price: '$625,000',
    status: 'Listed',
    thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop'
  },
  {
    id: 'prop2',
    title: 'Modern Farmhouse',
    address: '456 Oak St, Madison, WI 53703',
    price: '$459,000',
    status: 'Offer Made',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop'
  },
  {
    id: 'prop3',
    title: 'Suburban Ranch',
    address: '789 Pine Rd, Green Bay, WI 54301',
    price: '$385,000',
    status: 'Offer Accepted',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop'
  },
  {
    id: 'prop4',
    title: 'Victorian Charmer',
    address: '234 Elm St, Appleton, WI 54911',
    price: '$725,000',
    status: 'Close Pending',
    thumbnail: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2670&auto=format&fit=crop'
  },
  {
    id: 'prop5',
    title: 'Lake House Retreat',
    address: '567 Shore Dr, Lake Geneva, WI 53147',
    price: '$899,000',
    status: 'Closed',
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop'
  },
  {
    id: 'prop6',
    title: 'Craftsman Bungalow',
    address: '890 Maple Ave, Milwaukee, WI 53211',
    price: '$425,000',
    status: 'Drafts',
    thumbnail: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2670&auto=format&fit=crop'
  },
  {
    id: 'prop7',
    title: 'Contemporary Condo',
    address: '123 River St, Milwaukee, WI 53202',
    price: '$349,000',
    status: 'Dropped',
    thumbnail: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?q=80&w=2671&auto=format&fit=crop'
  }
];

// Kanban columns definition
const COLUMNS = [
  { id: 'drafts', label: 'Drafts', color: 'bg-gray-100' },
  { id: 'listed', label: 'Listed', color: 'bg-green-100' },
  { id: 'offerMade', label: 'Offer Made', color: 'bg-blue-100' },
  { id: 'offerAccepted', label: 'Offer Accepted', color: 'bg-purple-100' },
  { id: 'closePending', label: 'Close Pending', color: 'bg-yellow-100' },
  { id: 'closed', label: 'Closed', color: 'bg-gray-100' },
  { id: 'dropped', label: 'Dropped', color: 'bg-red-100' }
];

// Property card component for Kanban view
const PropertyCard = ({ property }: { property: any }) => (
  <Card className="mb-3 overflow-hidden hover:shadow-md transition-shadow duration-200">
    <div className="relative h-32">
      <img 
        src={property.thumbnail} 
        alt={property.title}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback if image fails to load
          (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e2e8f0/1e293b?text=Property+Image';
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-2 py-1">
        <div className="text-sm font-medium truncate">{property.title}</div>
      </div>
    </div>
    <div className="p-3">
      <p className="text-sm text-gray-600 mb-2 truncate">{property.address}</p>
      <div className="flex justify-between items-center">
        <span className="font-semibold">{property.price}</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Details">
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Manage Property">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </Card>
);

// Add Property Card for "Listed" column
const AddPropertyCard = () => (
  <Card className="mb-3 border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-colors duration-200">
    <div className="p-8 flex flex-col items-center justify-center text-center">
      <PlusCircle className="h-10 w-10 text-gray-400 mb-2" />
      <h3 className="font-medium text-gray-900">Add New Property</h3>
      <p className="text-sm text-gray-500 mb-3">Get started with your new listing</p>
      <Button variant="outline" className="mt-2">
        <Plus className="h-4 w-4 mr-2" />
        Create Listing
      </Button>
    </div>
  </Card>
);

export default function ManagePage() {
  const params = useParams();
  const userId = params.userId || '';
  const [viewMode, setViewMode] = useState<'kanban' | 'grid' | 'table'>('kanban');
  
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
  
  return (
    <SellerDashboardLayout userId={userId}>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Properties</h1>
          
          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="bg-gray-100 p-1 rounded-md flex">
              <Button 
                variant={viewMode === 'kanban' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="rounded-md"
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                Kanban
              </Button>
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-md"
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                Grid
              </Button>
              <Button 
                variant={viewMode === 'table' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-md"
              >
                <List className="h-4 w-4 mr-1" />
                Table
              </Button>
            </div>
            
            {/* Quick action buttons */}
            <Button variant="outline" className="gap-1">
              <File className="h-4 w-4" />
              View Documents
            </Button>
            <Button variant="outline" className="gap-1">
              <Calendar className="h-4 w-4" />
              View Calendar
            </Button>
          </div>
        </div>
        
        {/* Kanban board view */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 overflow-x-auto pb-4">
            {COLUMNS.map(column => (
              <div key={column.id} className={`min-w-[250px] rounded-lg ${column.color} p-3`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-800">{column.label}</h3>
                  <Badge variant="outline" className="bg-white">
                    {propertiesByStatus[column.id]?.length || 0}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {/* If this is the "Listed" column, show the Add Property card first */}
                  {column.id === 'listed' && <AddPropertyCard />}
                  
                  {/* Show properties in this column */}
                  {propertiesByStatus[column.id]?.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Grid view (placeholder) */}
        {viewMode === 'grid' && (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Grid View Coming Soon</h3>
            <p className="text-gray-600">This view is currently in development.</p>
          </div>
        )}
        
        {/* Table view (placeholder) */}
        {viewMode === 'table' && (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Table View Coming Soon</h3>
            <p className="text-gray-600">This view is currently in development.</p>
          </div>
        )}
      </div>
    </SellerDashboardLayout>
  );
}