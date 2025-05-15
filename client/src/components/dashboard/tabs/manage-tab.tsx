import React, { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  LayoutGrid, 
  ListFilter,
  ListIcon, 
  KanbanSquare, 
  Plus, 
  PlusCircle, 
  ClipboardList, 
  Settings, 
  Check, 
  Users, 
  Calendar, 
  Home, 
  DollarSign, 
  FileText, 
  Clock, 
  MoreHorizontal, 
  X, 
  Edit,
  Eye,
  MessageSquare,
  Trash2,
  SendHorizontal,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  BarChart2,
  Filter,
  ArrowUpDown,
  ArrowDown,
  Building,
  CreditCard,
  Upload,
  FileUp,
  Paperclip,
  UserPlus,
  Pencil,
  ArrowRight,
  Globe,
  MapPin,
  Share,
  Phone,
  Mail,
  Inbox,
  User,
  Loader2
} from 'lucide-react';

import { properties, Property, projects, Project } from '@/data/properties';

// KanbanPropertyCard component for the kanban view
interface KanbanPropertyCardProps {
  property: Property;
  onClickProperty: (id: number) => void;
  onClickManage: (id: number) => void;
  onRemove: (id: number) => void;
}

const KanbanPropertyCard = ({ property, onClickProperty, onClickManage, onRemove }: KanbanPropertyCardProps) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Get status badge class
  const getStatusBadgeClass = (stage: string) => {
    switch (stage) {
      case 'favorited':
        return 'bg-[#803344] text-white';
      case 'contacted':
        return 'bg-yellow-500 text-white';
      case 'offer_made':
        return 'bg-blue-500 text-white';
      case 'pending':
        return 'bg-purple-500 text-white';
      case 'close_pending':
        return 'bg-orange-500 text-white';
      case 'closed':
        return 'bg-green-700 text-white';
      case 'dropped':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card className="shadow-sm hover:shadow transition-shadow border border-gray-200 bg-white overflow-hidden property-card">
      {/* Property image */}
      <div className="relative">
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="h-32 w-full object-cover"
          onClick={() => onClickProperty(property.id)}
        />
        
        {/* Status badge */}
        <div className="absolute top-2 left-2">
          <Badge className={`${getStatusBadgeClass(property.stage)}`}>
            {property.stage === 'favorited' ? 'Favorited' :
             property.stage === 'contacted' ? 'Contacted' :
             property.stage === 'offer_made' ? 'Offer Made' :
             property.stage === 'pending' ? 'Pending' :
             property.stage === 'close_pending' ? 'Closing Soon' :
             property.stage === 'closed' ? 'Closed' : 'Dropped'}
          </Badge>
          <Badge variant="outline" className="font-normal text-xs">
            {property.propertyType || 'Residential'}
          </Badge>
        </div>
      </div>
      
      <CardContent className="pt-3 px-3 pb-0">
        <div className="space-y-1">
          <h3 
            className="font-semibold text-md cursor-pointer hover:text-[#09261E] line-clamp-1"
            onClick={() => onClickProperty(property.id)}
          >
            {property.title}
          </h3>
          <p className="text-xs text-gray-500 flex items-center">
            <MapPin className="h-3 w-3 mr-1 inline" />
            {property.address}
          </p>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="font-semibold">{formatCurrency(property.price)}</span>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <span>{property.bedrooms} bd</span>
              <span>•</span>
              <span>{property.bathrooms} ba</span>
              <span>•</span>
              <span>{property.squareFeet.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-2 pt-3 flex justify-end space-x-1 border-t mt-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-8 h-8 p-0" 
          onClick={() => onClickProperty(property.id)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-8 h-8 p-0"
          onClick={() => onClickManage(property.id)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-8 h-8 p-0"
          onClick={() => onRemove(property.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Property grid component for the grid view
interface PropertyGridProps {
  properties: Property[];
  onClickProperty: (id: number) => void;
  onClickManage: (id: number) => void;
  onRemove: (id: number) => void;
}

const PropertyGrid = ({ properties, onClickProperty, onClickManage, onRemove }: PropertyGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {properties.map((property) => (
        <KanbanPropertyCard 
          key={property.id} 
          property={property} 
          onClickProperty={onClickProperty}
          onClickManage={onClickManage}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

// Project card component for project view
interface ProjectCardProps {
  project: Project;
  onClick: (id: number) => void;
}

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  // Get badge based on status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-500 text-white">Paused</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500 text-white">Completed</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>;
    }
  };
  
  // Calculate dates difference in days
  const dateDiff = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Calculate timeline percentage
  const calculateTimelinePercentage = () => {
    const { startDate, endDate, currentProgress } = project.timeline;
    return currentProgress;
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onClick(project.id)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {project.address}
            </CardDescription>
          </div>
          {getStatusBadge(project.status)}
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="space-y-4">
          {/* Timeline progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Timeline Progress</span>
              <span className="font-medium">{project.timeline.currentProgress}%</span>
            </div>
            <Progress value={calculateTimelinePercentage()} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{new Date(project.timeline.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span>
                {dateDiff(project.timeline.startDate, project.timeline.endDate)} days
              </span>
              <span>{new Date(project.timeline.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
          
          {/* Budget summary */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-green-50 rounded">
              <p className="text-xs text-gray-600">Budget</p>
              <p className="font-semibold">{formatCurrency(project.budget.estimated)}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded">
              <p className="text-xs text-gray-600">Spent</p>
              <p className="font-semibold">{formatCurrency(project.budget.actual)}</p>
            </div>
            <div className="p-2 bg-yellow-50 rounded">
              <p className="text-xs text-gray-600">Remaining</p>
              <p className={`font-semibold ${project.budget.remaining < 0 ? 'text-red-600' : ''}`}>
                {formatCurrency(project.budget.remaining)}
              </p>
            </div>
          </div>
          
          {/* Task Summary */}
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-xs text-gray-500">Tasks: </span>
              <span className="font-medium">
                {project.tasks.filter(t => t.completed).length}/{project.tasks.length} completed
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500">Team: </span>
              <span className="font-medium">
                {project.team.length} members
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function DashboardManageTab() {
  const { toast } = useToast();
  const params = useParams();
  const [, setLocation] = useLocation();
  const userId = params.userId || '';

  // View states
  const [activeView, setActiveView] = useState<'pipeline' | 'sheet' | 'projects'>('pipeline');
  const [pipelineView, setPipelineView] = useState<'kanban' | 'grid'>('kanban');
  
  // Detail modals
  const [propertyDetailOpen, setPropertyDetailOpen] = useState(false);
  const [activeProperty, setActiveProperty] = useState<number | null>(null);
  const [projectDetailOpen, setProjectDetailOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [projectStatusFilter, setProjectStatusFilter] = useState<string>('all');
  
  // Task states
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<number>>(new Set());
  
  // Local state for properties
  const [localProperties, setLocalProperties] = useState(properties);
  
  // State for direct HTML drag and drop
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPropertyId, setDraggedPropertyId] = useState<number | null>(null);
  const [draggedPropertyStage, setDraggedPropertyStage] = useState<string | null>(null);
  
  // Handle property drag start
  const handlePropertyDragStart = (e: React.DragEvent, propertyId: number, currentStage: string) => {
    setIsDragging(true);
    setDraggedPropertyId(propertyId);
    setDraggedPropertyStage(currentStage);
    
    // Use the actual card as the drag image for better visual feedback
    const propertyCard = e.currentTarget as HTMLElement;
    const rect = propertyCard.getBoundingClientRect();
    
    e.dataTransfer.setDragImage(propertyCard, rect.width / 2, 10);
    
    // Set data transfer
    e.dataTransfer.setData('property-id', propertyId.toString());
    e.dataTransfer.setData('drag-type', 'property');
    e.dataTransfer.effectAllowed = 'move';
    
    // Add opacity to the card being dragged
    setTimeout(() => {
      propertyCard.style.opacity = '0.6';
    }, 0);
  };
  
  // Handle drag over
  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Add visual feedback for the drop zone
    const column = e.currentTarget as HTMLElement;
    
    // Highlight the column when dragging over it
    if (isDragging && draggedPropertyId) {
      // Add a highlight class to the column
      column.classList.add('bg-green-50');
      column.classList.add('border-green-300');
      
      // Remove the highlight class when leaving the column
      const handleDragLeave = () => {
        column.classList.remove('bg-green-50');
        column.classList.remove('border-green-300');
        column.removeEventListener('dragleave', handleDragLeave);
      };
      
      column.addEventListener('dragleave', handleDragLeave);
    }
  };
  
  // Handle property drop
  const handlePropertyDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    
    const dragType = e.dataTransfer.getData('drag-type');
    
    if (dragType === 'property') {
      const propertyId = parseInt(e.dataTransfer.getData('property-id'));
      
      if (draggedPropertyId && draggedPropertyStage && draggedPropertyStage !== columnId) {
        // Get column details for toast message
        const sourceColumn = columns.find(col => col.id === draggedPropertyStage);
        const destColumn = columns.find(col => col.id === columnId);
        
        if (sourceColumn && destColumn) {
          const toastMessage = `Property moved from "${sourceColumn.title}" to "${destColumn.title}"`;
          toast({
            title: "Stage Updated",
            description: toastMessage,
            variant: "default",
          });
          
          // Update property stage
          const updatedProperties = localProperties.map(p => {
            if (p.id === propertyId) {
              return { ...p, stage: columnId };
            }
            return p;
          });
          
          setLocalProperties(updatedProperties);
        }
      }
    }
    
    // Reset drag state
    handleDragEnd();
  };
  
  // Handle drag end to clean up
  const handleDragEnd = () => {
    // Reset opacity of all property cards
    document.querySelectorAll('.property-card').forEach(card => {
      (card as HTMLElement).style.opacity = '1';
    });
    
    // Remove active drop zone styling from all columns
    document.querySelectorAll('.drop-zone-active').forEach(dropZone => {
      dropZone.classList.remove('drop-zone-active');
    });
    
    // Reset highlight classes
    document.querySelectorAll('.bg-green-50').forEach(element => {
      element.classList.remove('bg-green-50');
    });
    
    document.querySelectorAll('.border-green-300').forEach(element => {
      element.classList.remove('border-green-300');
    });
    
    // Reset drag state
    setIsDragging(false);
    setDraggedPropertyId(null);
    setDraggedPropertyStage(null);
  };
  
  // Generate propertiesByStage based on localProperties
  const propertiesByStageLocal = {
    favorited: localProperties.filter(p => p.stage === 'favorited'),
    contacted: localProperties.filter(p => p.stage === 'contacted'),
    offer_made: localProperties.filter(p => p.stage === 'offer_made'),
    pending: localProperties.filter(p => p.stage === 'pending'),
    close_pending: localProperties.filter(p => p.stage === 'close_pending'),
    closed: localProperties.filter(p => p.stage === 'closed'),
    dropped: localProperties.filter(p => p.stage === 'dropped')
  };
  
  // Column titles and descriptions - with updated color scheme
  const columns = [
    {
      id: "favorited",
      title: "Favorited",
      description: "Properties you're interested in",
      properties: propertiesByStageLocal.favorited || [],
      color: "bg-[#803344]" // Wine
    },
    {
      id: "contacted",
      title: "Contacted",
      description: "Seller contacted",
      properties: propertiesByStageLocal.contacted || [],
      color: "bg-yellow-400" // Yellow
    },
    {
      id: "offer_made",
      title: "Offer Made",
      description: "Offers submitted",
      properties: propertiesByStageLocal.offer_made || [],
      color: "bg-blue-500" // Blue
    },
    {
      id: "pending",
      title: "Pending",
      description: "In negotiation",
      properties: propertiesByStageLocal.pending || [],
      color: "bg-purple-500" // Purple
    },
    {
      id: "close_pending",
      title: "Closing Soon",
      description: "Closing process started",
      properties: propertiesByStageLocal.close_pending || [],
      color: "bg-orange-500" // Orange
    },
    {
      id: "closed",
      title: "Closed",
      description: "Deal completed",
      properties: propertiesByStageLocal.closed || [],
      color: "bg-green-700" // Green
    },
    {
      id: "dropped",
      title: "Dropped",
      description: "No longer pursuing",
      properties: propertiesByStageLocal.dropped || [],
      color: "bg-gray-500" // Gray
    }
  ];
  
  // Get date in a readable format
  const getFormattedDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Toggle task expanded state
  const toggleTaskExpanded = (taskId: number) => {
    const newSet = new Set(expandedTaskIds);
    if (newSet.has(taskId)) {
      newSet.delete(taskId);
    } else {
      newSet.add(taskId);
    }
    setExpandedTaskIds(newSet);
  };
  
  // Handle view property
  const handleViewProperty = (propertyId: number) => {
    setActiveProperty(propertyId);
    setPropertyDetailOpen(true);
  };
  
  // Handle manage property
  const handleManageProperty = (propertyId: number) => {
    setLocation(`/sellerdash/${userId}/property/${propertyId}`);
  };
  
  // Handle remove property
  const handleRemoveProperty = (propertyId: number) => {
    toast({
      title: "Property Removed",
      description: "Property has been removed from your dashboard.",
      variant: "default",
    });
    
    setLocalProperties(localProperties.filter(p => p.id !== propertyId));
  };
  
  // Handle view project
  const handleViewProject = (projectId: number) => {
    setActiveProject(projectId);
    setProjectDetailOpen(true);
  };
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Property Pipeline</h1>
          <p className="text-gray-500 text-sm">Manage your property deals and projects</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* View selector */}
          <div className="bg-white border rounded-lg p-1 shadow-sm flex">
            <button
              onClick={() => setActiveView('pipeline')}
              className={`px-3 py-1 rounded flex items-center text-sm ${
                activeView === 'pipeline' 
                  ? 'bg-[#09261E] text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ListFilter className="h-4 w-4 mr-1" />
              Pipeline
            </button>
            <button
              onClick={() => setActiveView('sheet')}
              className={`px-3 py-1 rounded flex items-center text-sm ${
                activeView === 'sheet' 
                  ? 'bg-[#09261E] text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              All
            </button>
            <button
              onClick={() => setActiveView('projects')}
              className={`px-3 py-1 rounded flex items-center text-sm ${
                activeView === 'projects' 
                  ? 'bg-[#09261E] text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ClipboardList className="h-4 w-4 mr-1" />
              Projects
            </button>
          </div>
          
          {/* Pipeline view mode - only show in pipeline view */}
          {activeView === "pipeline" && (
            <div className="bg-white border rounded-lg p-1 shadow-sm flex">
              <button
                onClick={() => setPipelineView('kanban')}
                className={`px-3 py-1 rounded flex items-center text-sm ${
                  pipelineView === 'kanban' 
                    ? 'bg-[#09261E] text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <KanbanSquare className="h-4 w-4 mr-1" />
                Kanban
              </button>
              <button
                onClick={() => setPipelineView('grid')}
                className={`px-3 py-1 rounded flex items-center text-sm ${
                  pipelineView === 'grid' 
                    ? 'bg-[#09261E] text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                Grid
              </button>
            </div>
          )}
          
          {activeView === "projects" && (
            <Button
              variant="outline"
              size="sm"
              className="border-[#09261E] text-[#09261E] hover:bg-gray-100 data-[state=open]:bg-[#09261E] data-[state=open]:text-white"
              onClick={() => setAddProjectOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add Project
            </Button>
          )}
        </div>
      </div>
      
      {/* Property Pipeline View */}
      {activeView === "pipeline" && (
        <div>
          {pipelineView === "kanban" ? (
            /* Kanban board with drag and drop */
            <div className="flex gap-4 overflow-x-auto pb-1 hide-scrollbar">
              {columns.map((column) => (
                <div key={column.id} className="flex-shrink-0 w-[280px]">
                  <div className="bg-white rounded-t-lg border border-gray-200 p-3 mb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-[#09261E] flex items-center">
                          <div className={`w-3 h-3 rounded-full ${column.color} mr-2`}></div>
                          {column.title}
                          <Badge className="ml-2 bg-gray-200 text-gray-700 font-normal text-xs">
                            {column.properties.length}
                          </Badge>
                        </h3>
                        <p className="text-xs text-gray-500">{column.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="h-[calc(100vh-320px)] overflow-y-auto border border-gray-200 rounded-b-lg p-3 transition-colors duration-200 bg-gray-50"
                    onDragOver={(e) => handleDragOver(e, column.id)}
                    onDrop={(e) => handlePropertyDrop(e, column.id)}
                  >
                    {column.properties.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-24 border border-dashed border-gray-300 rounded-lg bg-gray-50 p-4 text-center text-gray-500">
                        <p className="text-sm">No properties in this stage</p>
                      </div>
                    ) : (
                      column.properties.map((property, index) => (
                        <div
                          key={property.id.toString()}
                          className="property-card transition-shadow mb-3"
                          draggable="true"
                          onDragStart={(e) => handlePropertyDragStart(e, property.id, column.id)}
                          onDragEnd={handleDragEnd}
                        >
                          <KanbanPropertyCard 
                            property={property} 
                            onClickProperty={handleViewProperty}
                            onClickManage={handleManageProperty}
                            onRemove={handleRemoveProperty}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : pipelineView === "grid" ? (
            /* Sheet view */
            <PropertyGrid 
              properties={localProperties} 
              onClickProperty={handleViewProperty}
              onClickManage={handleManageProperty}
              onRemove={handleRemoveProperty}
            />
          ) : null}
        </div>
      )}
      
      {/* Projects View */}
      {activeView === "projects" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Label>Filter:</Label>
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setProjectStatusFilter('all')}
                  className={`px-3 py-1 text-sm ${
                    projectStatusFilter === 'all' 
                      ? 'bg-[#09261E] text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setProjectStatusFilter('active')}
                  className={`px-3 py-1 text-sm ${
                    projectStatusFilter === 'active' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setProjectStatusFilter('paused')}
                  className={`px-3 py-1 text-sm ${
                    projectStatusFilter === 'paused' 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Paused
                </button>
                <button
                  onClick={() => setProjectStatusFilter('completed')}
                  className={`px-3 py-1 text-sm ${
                    projectStatusFilter === 'completed' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddProjectOpen(true)}
              className="text-[#09261E]"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Project
            </Button>
          </div>
          
          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects
              .filter(p => projectStatusFilter === 'all' || p.status.toLowerCase() === projectStatusFilter)
              .map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  onClick={handleViewProject}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}