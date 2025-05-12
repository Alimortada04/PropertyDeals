import React, { useState } from 'react';
import { useParams } from 'wouter';
import SellerDashboardLayout from '@/components/layout/seller-dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  List,
  LayoutGrid,
  Plus,
  Calendar,
  FileText,
  ArrowRight,
  Eye,
  TrendingUp,
  Clock,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define property type
interface Property {
  id: number;
  address: string;
  image: string;
  status: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  views: number;
  offers: number;
  daysListed: number;
}

export default function SellerDashboardManagePage() {
  const params = useParams();
  const userId = params.userId;
  const [viewMode, setViewMode] = useState<'kanban' | 'grid' | 'table'>('kanban');
  
  // Mock property data by status
  const propertiesByStatus: Record<string, Property[]> = {
    'Drafts': [
      {
        id: 1,
        address: "789 Pine Boulevard",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        status: "Draft",
        price: "$375,000",
        beds: 2,
        baths: 2,
        sqft: 1500,
        views: 0,
        offers: 0,
        daysListed: 0
      }
    ],
    'Listed': [
      {
        id: 2,
        address: "123 Main Street",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        status: "Listed",
        price: "$450,000",
        beds: 3,
        baths: 2,
        sqft: 1800,
        views: 42,
        offers: 2,
        daysListed: 5
      }
    ],
    'Offer Made': [
      {
        id: 3,
        address: "456 Oak Avenue",
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        status: "Offer Made",
        price: "$625,000",
        beds: 4,
        baths: 3,
        sqft: 2400,
        views: 68,
        offers: 3,
        daysListed: 8
      }
    ],
    'Offer Accepted': [],
    'Close Pending': [],
    'Closed': [
      {
        id: 4,
        address: "345 Elm Road",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        status: "Closed",
        price: "$525,000",
        beds: 3,
        baths: 2.5,
        sqft: 2000,
        views: 120,
        offers: 4,
        daysListed: 22
      }
    ],
    'Dropped': []
  };

  // Column status colors
  const statusColors: Record<string, string> = {
    'Drafts': 'bg-gray-500',
    'Listed': 'bg-green-500',
    'Offer Made': 'bg-blue-500',
    'Offer Accepted': 'bg-purple-500',
    'Close Pending': 'bg-orange-500',
    'Closed': 'bg-slate-700',
    'Dropped': 'bg-red-500'
  };

  // Property Card Component
  const PropertyCard = ({ property }: { property: Property }) => (
    <Card className="mb-3 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-32 w-full">
        <img 
          src={property.image} 
          alt={property.address}
          className="h-full w-full object-cover" 
        />
        <Badge 
          className={`absolute top-2 left-2 ${
            property.status === 'Listed' 
              ? 'bg-green-500' 
              : property.status === 'Offer Made' 
                ? 'bg-blue-500' 
                : property.status === 'Closed'
                  ? 'bg-slate-700'
                  : 'bg-gray-500'
          }`}
        >
          {property.status}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Property</DropdownMenuItem>
            <DropdownMenuItem>Edit Listing</DropdownMenuItem>
            <DropdownMenuItem>View Offers</DropdownMenuItem>
            <DropdownMenuItem>Share Listing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">Remove Listing</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <CardContent className="pt-3 pb-2">
        <h3 className="font-bold text-md mb-1 truncate">{property.address}</h3>
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold text-[#135341]">{property.price}</p>
          <div className="flex space-x-1">
            <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{property.beds}b</span>
            <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{property.baths}ba</span>
            <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{property.sqft}sf</span>
          </div>
        </div>
        
        <div className="flex items-center text-xs text-gray-500 pt-2 mt-1 border-t justify-between">
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            <span>{property.views}</span>
          </div>
          <div className="flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>{property.offers}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{property.daysListed}d</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-3 flex justify-end">
        <Button variant="link" size="sm" className="text-[#135341] px-0 h-auto">
          Manage <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );

  // View Toolbar
  const ViewToolbar = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <h2 className="text-xl font-bold text-[#135341] flex items-center">
          <Briefcase className="h-5 w-5 mr-2" />
          Manage Properties
        </h2>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button 
          variant="outline" 
          className="mr-4 border-[#135341] text-[#135341] hover:bg-[#135341] hover:text-white"
        >
          <Calendar className="mr-2 h-4 w-4" />
          View Calendar
        </Button>
        
        <Button 
          variant="outline" 
          className="mr-4 border-[#135341] text-[#135341] hover:bg-[#135341] hover:text-white"
        >
          <FileText className="mr-2 h-4 w-4" />
          View Documents
        </Button>
        
        <div className="border rounded-md flex">
          <Button 
            variant={viewMode === 'kanban' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setViewMode('kanban')}
            className={viewMode === 'kanban' ? 'bg-[#135341] text-white' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-[#135341] text-white' : ''}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Render the kanban view
  const renderKanbanView = () => (
    <div className="overflow-x-auto pb-6">
      <div className="min-w-max flex space-x-4">
        {Object.keys(propertiesByStatus).map((status) => (
          <div key={status} className="w-64 shrink-0">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${statusColors[status]}`}></div>
                <h3 className="font-medium text-sm">{status}</h3>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {propertiesByStatus[status].length}
              </span>
            </div>
            
            <div className="space-y-3">
              {propertiesByStatus[status].map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
              
              {/* Add property card for Listed column */}
              {status === 'Listed' && (
                <Card className="border-dashed border-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center p-4 h-32">
                  <div className="text-center">
                    <div className="mx-auto bg-[#135341]/10 h-10 w-10 rounded-full flex items-center justify-center mb-2">
                      <Plus className="h-5 w-5 text-[#135341]" />
                    </div>
                    <p className="text-sm font-medium text-[#135341]">Add Property</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render the grid view (placeholder)
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Object.values(propertiesByStatus).flat().map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
      
      {/* Add property card for grid view */}
      <Card className="border-dashed border-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center p-6 h-[220px]">
        <div className="text-center">
          <div className="mx-auto bg-[#135341]/10 h-12 w-12 rounded-full flex items-center justify-center mb-3">
            <Plus className="h-6 w-6 text-[#135341]" />
          </div>
          <p className="font-medium text-[#135341]">Add Property</p>
        </div>
      </Card>
    </div>
  );

  // Render the table view (placeholder)
  const renderTableView = () => (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 p-4">
        <p className="text-center text-gray-500">Table view coming soon</p>
      </div>
    </div>
  );

  return (
    <SellerDashboardLayout userId={userId}>
      <ViewToolbar />

      {viewMode === 'kanban' && renderKanbanView()}
      {viewMode === 'grid' && renderGridView()}
      {viewMode === 'table' && renderTableView()}
    </SellerDashboardLayout>
  );
}