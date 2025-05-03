import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { 
  Home, 
  Phone, 
  FileText, 
  Calendar, 
  CheckSquare, 
  Clock, 
  Users, 
  Wrench,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  Clock3,
  XCircle,
  MessageSquare,
  PlusCircle,
  Trash2,
  MoreHorizontal,
  Edit2,
  Eye,
  Table,
  LayoutGrid,
  Filter,
  ArrowUpDown,
  DollarSign,
  Building,
  BriefcaseBusiness,
  ClipboardCheck,
  Download
} from "lucide-react";
import { Link, useLocation } from "wouter";

// Import data
import { 
  properties, 
  propertiesByStage, 
  propertyTasks, 
  projects, 
  Property,
  Project
} from "@/data/properties";

// Property card component for Kanban board
interface KanbanPropertyCardProps {
  property: Property;
  onClickProperty: (id: number) => void;
  onClickManage: (id: number) => void;
  onRemove: (id: number) => void;
}

const KanbanPropertyCard = ({ property, onClickProperty, onClickManage, onRemove }: KanbanPropertyCardProps) => {
  // Priority badge color mapping
  const getPriorityColor = (priority: string = 'medium') => {
    switch(priority.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <Card className="mb-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 left-2 z-10 bg-white/80 hover:bg-white/90 h-6 w-6 rounded-full"
            >
              <Trash2 className="h-3.5 w-3.5 text-gray-600" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove <span className="font-semibold">{property.address}</span> from your pipeline.
                You can always add it back later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onRemove(property.id)}>
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <div className="h-32 overflow-hidden">
          <img 
            src={property.imageUrl} 
            alt={property.title} 
            className="w-full h-full object-cover"
          />
          <Badge className={`absolute top-2 right-2 ${getPriorityColor(property.priority)}`}>
            {property.priority === 'Medium' ? 'Med' : property.priority || 'Med'}
          </Badge>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold text-[#09261E] truncate text-sm">{property.title}</h3>
        <p className="text-gray-600 text-xs truncate">{property.address}</p>
        <p className="text-[#09261E] font-bold mt-1 text-sm">${property.price.toLocaleString()}</p>
        
        <div className="flex gap-2 mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 text-xs border-[#09261E] text-[#09261E] hover:bg-[#09261E] hover:text-white"
            onClick={() => onClickProperty(property.id)}
          >
            <Eye className="h-3.5 w-3.5 mr-1" /> View
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1 h-8 text-xs bg-[#09261E] hover:bg-[#135341]"
            onClick={() => onClickManage(property.id)}
          >
            <ClipboardCheck className="h-3.5 w-3.5 mr-1" /> Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Property Grid component
interface PropertyGridProps {
  properties: Property[];
  onClickProperty: (id: number) => void;
  onClickManage: (id: number) => void;
  onRemove: (id: number) => void;
}

const PropertyGrid = ({ properties, onClickProperty, onClickManage, onRemove }: PropertyGridProps) => {
  const [sortField, setSortField] = useState<string>('dateAdded');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [stageFilter, setStageFilter] = useState<string>('all');
  
  // Priority badge color mapping
  const getPriorityColor = (priority: string = 'medium') => {
    switch(priority.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Sort properties
  const sortedProperties = [...properties].sort((a, b) => {
    if (sortField === 'price') {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    }
    if (sortField === 'dateAdded') {
      const dateA = a.dateAdded || '';
      const dateB = b.dateAdded || '';
      return sortOrder === 'asc' 
        ? dateA.localeCompare(dateB) 
        : dateB.localeCompare(dateA);
    }
    if (sortField === 'priority') {
      const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
      const priorityA = priorityOrder[(a.priority || 'medium').toLowerCase()] || 0;
      const priorityB = priorityOrder[(b.priority || 'medium').toLowerCase()] || 0;
      return sortOrder === 'asc' ? priorityA - priorityB : priorityB - priorityA;
    }
    return 0;
  });
  
  // Filter properties by stage
  const filteredProperties = stageFilter === 'all' 
    ? sortedProperties 
    : sortedProperties.filter(p => p.stage === stageFilter);
  
  // Stage display names
  const stageNames: Record<string, string> = {
    favorited: 'Favorited',
    contacted: 'Contacted',
    offer_made: 'Offer Made',
    pending: 'Pending',
    close_pending: 'Closing Soon',
    closed: 'Closed',
    dropped: 'Dropped'
  };
  
  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <div className="flex gap-2 items-center">
          <Label htmlFor="stage-filter" className="text-sm whitespace-nowrap">Filter:</Label>
          <Select
            value={stageFilter}
            onValueChange={setStageFilter}
          >
            <SelectTrigger id="stage-filter" className="w-[180px] h-9">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="favorited">Favorited</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="offer_made">Offer Made</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="close_pending">Closing Soon</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="dropped">Dropped</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 items-center ml-4">
          <Label htmlFor="sort-by" className="text-sm whitespace-nowrap">Sort by:</Label>
          <Select
            value={sortField}
            onValueChange={setSortField}
          >
            <SelectTrigger id="sort-by" className="w-[150px] h-9">
              <SelectValue placeholder="Date Added" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dateAdded">Date Added</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-2"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            <ArrowUpDown className="h-4 w-4 mr-1" />
            {sortOrder === 'asc' ? 'Asc' : 'Desc'}
          </Button>
        </div>
      </div>
      
      {/* Grid */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="py-3 px-4 text-left font-medium text-gray-600">Property</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Address</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Stage</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Price</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Priority</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Date Added</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-500">
                  No properties found
                </td>
              </tr>
            ) : (
              filteredProperties.map((property) => (
                <tr key={property.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                        <img
                          src={property.imageUrl}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-[#09261E]">{property.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {property.address}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="font-normal">
                      {stageNames[property.stage] || property.stage}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-medium">
                    ${property.price.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={`${getPriorityColor(property.priority)}`}>
                      {property.priority === 'Medium' ? 'Med' : property.priority || 'Med'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {property.dateAdded || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={() => onClickProperty(property.id)}
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={() => onClickManage(property.id)}
                      >
                        <ClipboardCheck className="h-4 w-4 text-gray-600" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove <span className="font-semibold">{property.address}</span> from your pipeline.
                              You can always add it back later.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onRemove(property.id)}>
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Project Card component for Project Management section
interface ProjectCardProps {
  project: Project;
  onClick: (id: number) => void;
}

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const completedTasks = project.tasks.filter(t => t.completed).length;
  const totalTasks = project.tasks.length;
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
  
  // Calculate days remaining
  const today = new Date();
  const endDate = new Date(project.timeline.endDate);
  const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onClick(project.id)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[#09261E]">{project.name}</h3>
            <p className="text-sm text-gray-600">{project.address}</p>
          </div>
          <Badge 
            className={`${daysRemaining <= 7 ? 'bg-red-500' : 'bg-blue-500'}`}
          >
            {daysRemaining} days remaining
          </Badge>
        </div>
        
        <div className="flex flex-col space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-xs text-gray-600">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <span className="text-xs text-gray-600 block mb-1">Budget</span>
              <div className="flex items-baseline">
                <span className="text-lg font-bold text-green-600">${project.budget.remaining.toLocaleString()}</span>
                <span className="text-xs text-gray-600 ml-1">remaining</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ${project.budget.actual.toLocaleString()} of ${project.budget.estimated.toLocaleString()} used
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <span className="text-xs text-gray-600 block mb-1">Tasks</span>
              <div className="flex items-baseline">
                <span className="text-lg font-bold text-blue-600">{completedTasks}/{totalTasks}</span>
                <span className="text-xs text-gray-600 ml-1">completed</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {completedTasks < totalTasks ? `${totalTasks - completedTasks} tasks remaining` : 'All tasks completed'}
              </div>
            </div>
          </div>
          
          <div className="mt-2">
            <span className="text-xs text-gray-600 block mb-1">Latest Update</span>
            {project.updates.length > 0 ? (
              <div className="bg-gray-50 p-2 rounded text-sm">
                <p className="text-gray-800">{project.updates[project.updates.length - 1].text}</p>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>{project.updates[project.updates.length - 1].author}</span>
                  <span>{project.updates[project.updates.length - 1].date}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No updates yet</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Manage Tab component implementation
export default function DashboardManageTab() {
  const [, setLocation] = useLocation();
  const [activeView, setActiveView] = useState<string>("pipeline");
  const [pipelineView, setPipelineView] = useState<"kanban" | "grid">("kanban");
  const [propertyDetailOpen, setPropertyDetailOpen] = useState<boolean>(false);
  const [addPropertyOpen, setAddPropertyOpen] = useState<boolean>(false);
  const [projectDetailOpen, setProjectDetailOpen] = useState<boolean>(false);
  const [addProjectOpen, setAddProjectOpen] = useState<boolean>(false);
  const [activeProperty, setActiveProperty] = useState<number | null>(null);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [localProperties, setLocalProperties] = useState(properties);
  
  // Handle property card clicks
  const handleViewProperty = (propertyId: number) => {
    setLocation(`/properties/${propertyId}`);
  };
  
  const handleManageProperty = (propertyId: number) => {
    setActiveProperty(propertyId);
    setPropertyDetailOpen(true);
  };
  
  const handleRemoveProperty = (propertyId: number) => {
    // In a real app, this would call an API to update the database
    setLocalProperties(localProperties.filter(p => p.id !== propertyId));
  };
  
  const handleViewProject = (projectId: number) => {
    setActiveProject(projectId);
    setProjectDetailOpen(true);
  };
  
  // Handle drag and drop
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;
    
    // In a real app, this would call an API to update the database
    const propertyId = parseInt(draggableId);
    const updatedProperties = localProperties.map(p => {
      if (p.id === propertyId) {
        return { ...p, stage: destination.droppableId };
      }
      return p;
    });
    
    setLocalProperties(updatedProperties);
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
  
  // Column titles and descriptions
  const columns = [
    {
      id: "favorited",
      title: "Favorited",
      description: "Properties you're interested in",
      properties: propertiesByStageLocal.favorited || [],
      color: "bg-blue-500"
    },
    {
      id: "contacted",
      title: "Contacted",
      description: "Seller contacted",
      properties: propertiesByStageLocal.contacted || [],
      color: "bg-indigo-500"
    },
    {
      id: "offer_made",
      title: "Offer Made",
      description: "Offer sent to seller",
      properties: propertiesByStageLocal.offer_made || [],
      color: "bg-purple-500"
    },
    {
      id: "pending",
      title: "Pending",
      description: "In negotiation",
      properties: propertiesByStageLocal.pending || [],
      color: "bg-orange-500"
    },
    {
      id: "close_pending",
      title: "Closing Soon",
      description: "In process of closing",
      properties: propertiesByStageLocal.close_pending || [],
      color: "bg-amber-500"
    },
    {
      id: "closed",
      title: "Closed",
      description: "Deal completed",
      properties: propertiesByStageLocal.closed || [],
      color: "bg-green-500"
    },
    {
      id: "dropped",
      title: "Dropped",
      description: "No longer pursuing",
      properties: propertiesByStageLocal.dropped || [],
      color: "bg-gray-500"
    }
  ];
  
  return (
    <div>
      {/* View toggle */}
      <div className="flex flex-col space-y-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-gray-100 shadow-sm rounded-full overflow-hidden p-1">
              <div className="flex">
                <button 
                  className={`px-6 py-2.5 text-sm rounded-full flex items-center transition-colors ${activeView === "pipeline" ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  onClick={() => setActiveView("pipeline")}
                >
                  <Building className="h-4 w-4 mr-2" />
                  Property Pipeline
                </button>
                <button 
                  className={`px-6 py-2.5 text-sm rounded-full flex items-center transition-colors ${activeView === "projects" ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  onClick={() => setActiveView("projects")}
                >
                  <BriefcaseBusiness className="h-4 w-4 mr-2" />
                  Project Management
                </button>
              </div>
            </div>
          </div>
          
          {activeView === "pipeline" && (
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 shadow-sm rounded-full overflow-hidden p-1 mr-2">
                <div className="flex">
                  <button 
                    className={`px-4 py-1.5 text-xs rounded-full flex items-center transition-colors ${pipelineView === "kanban" ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    onClick={() => setPipelineView("kanban")}
                  >
                    <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
                    Kanban
                  </button>
                  <button 
                    className={`px-4 py-1.5 text-xs rounded-full flex items-center transition-colors ${pipelineView === "grid" ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    onClick={() => setPipelineView("grid")}
                  >
                    <Table className="h-3.5 w-3.5 mr-1.5" />
                    Sheet
                  </button>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddPropertyOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add Property
              </Button>
            </div>
          )}
          
          {activeView === "projects" && (
            <Button
              variant="outline"
              size="sm"
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
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
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
                    
                    <Droppable droppableId={column.id}>
                      {(provided) => (
                        <div 
                          className="h-[calc(100vh-280px)] overflow-y-auto bg-gray-50 border border-gray-200 rounded-b-lg p-3"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {column.properties.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-24 border border-dashed border-gray-300 rounded-lg bg-gray-50 p-4 text-center text-gray-500">
                              <p className="text-sm">No properties in this stage</p>
                            </div>
                          ) : (
                            column.properties.map((property, index) => (
                              <Draggable 
                                key={property.id.toString()} 
                                draggableId={property.id.toString()} 
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <KanbanPropertyCard 
                                      property={property} 
                                      onClickProperty={handleViewProperty}
                                      onClickManage={handleManageProperty}
                                      onRemove={handleRemoveProperty}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          ) : (
            /* Grid view */
            <PropertyGrid 
              properties={localProperties} 
              onClickProperty={handleViewProperty}
              onClickManage={handleManageProperty}
              onRemove={handleRemoveProperty}
            />
          )}
        </div>
      )}
      
      {/* Project Management View */}
      {activeView === "projects" && (
        <div>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onClick={handleViewProject} 
              />
            ))}
          </div>
          
          {projects.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 border border-dashed border-gray-300 rounded-lg bg-gray-50 p-4 text-center text-gray-500">
              <p>No renovation projects yet</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setAddProjectOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add Your First Project
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Property Detail Modal */}
      <Dialog open={propertyDetailOpen} onOpenChange={setPropertyDetailOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto min-h-[500px]">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl text-[#09261E]">
              Property Roadmap
            </DialogTitle>
            <DialogDescription className="pb-0">
              {activeProperty && localProperties.find(p => p.id === activeProperty)?.address}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-2">
            <Tabs defaultValue="progress" className="w-full">
              <TabsList className="w-full bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="progress" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Progress</TabsTrigger>
                <TabsTrigger value="documents" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Documents</TabsTrigger>
                <TabsTrigger value="contacts" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Contacts</TabsTrigger>
                <TabsTrigger value="outreach" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Outreach</TabsTrigger>
                <TabsTrigger value="notes" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="progress" className="mt-4">
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Pipeline Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Overall Progress</span>
                            <span className="text-sm">65%</span>
                          </div>
                          <Progress value={65} className="h-2 bg-green-500 bg-opacity-30" />
                        </div>
                        
                        <div className="grid gap-2">
                          {/* Pipeline stages with accordion-style checkable tasks */}
                          {[
                            { stage: 'Favorited', tasks: ['Save property details', 'Research neighborhood', 'Calculate initial numbers'], expanded: false },
                            { stage: 'Contacted', tasks: ['Schedule first call', 'Request property details', 'Prepare questions'], expanded: false },
                            { stage: 'Offer Made', tasks: ['Draft offer', 'Submit paperwork', 'Follow up with agent'], expanded: false },
                            { stage: 'Pending', tasks: ['Schedule inspection', 'Review disclosures', 'Secure financing'], expanded: true },
                            { stage: 'Closing', tasks: ['Final walkthrough', 'Verify wire details', 'Sign closing documents'], expanded: false }
                          ].map((stage, stageIndex) => {
                            const [isExpanded, setIsExpanded] = useState(stage.expanded);
                            return (
                              <div key={stage.stage} className="mt-2 border border-gray-100 rounded-md overflow-hidden">
                                <button 
                                  className="flex items-center justify-between w-full p-3 text-left font-medium hover:bg-gray-50"
                                  onClick={() => setIsExpanded(!isExpanded)}
                                >
                                  <div className="flex items-center">
                                    <Badge 
                                      className={`mr-3 ${stageIndex < 3 ? 'bg-green-500' : stageIndex === 3 ? 'bg-green-500' : 'bg-gray-400'}`}
                                    >
                                      {stageIndex < 3 ? 'Completed' : stageIndex === 3 ? 'In Progress' : 'Upcoming'}
                                    </Badge>
                                    <span className="font-medium">{stage.stage}</span>
                                  </div>
                                  <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'transform rotate-90' : ''}`} />
                                </button>
                                
                                {isExpanded && (
                                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                                    {stage.tasks.map((task, taskIndex) => (
                                      <div key={task} className="flex items-center my-1.5">
                                        <Checkbox 
                                          id={`task-${stageIndex}-${taskIndex}`} 
                                          className="mr-2"
                                          defaultChecked={stageIndex < 3 || (stageIndex === 3 && taskIndex < 2)}
                                        />
                                        <label 
                                          htmlFor={`task-${stageIndex}-${taskIndex}`}
                                          className={`text-sm ${(stageIndex < 3 || (stageIndex === 3 && taskIndex < 2)) ? 'line-through text-gray-500' : ''}`}
                                        >
                                          {task}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Upcoming Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Sample events */}
                        {[
                          { title: 'Final walkthrough', date: '2025-05-10', time: '10:00 AM', location: 'Property Address' },
                          { title: 'Closing appointment', date: '2025-05-15', time: '2:00 PM', location: 'Title Company Office' },
                          { title: 'Key handover', date: '2025-05-15', time: '4:30 PM', location: 'Property Address' }
                        ].map(event => (
                          <div key={event.title} className="flex items-center justify-between p-3 border border-gray-100 rounded-md hover:bg-gray-50">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-[#EAF2EF] flex items-center justify-center mr-3">
                                <Calendar className="h-4 w-4 text-[#09261E]" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{event.title}</p>
                                <p className="text-xs text-gray-500">{event.date} • {event.time}</p>
                                <p className="text-xs text-gray-500">{event.location}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="h-8 hover:bg-gray-100 hover:text-[#09261E] data-[state=active]:bg-[#09261E] data-[state=active]:text-white">
                              <Calendar className="h-3.5 w-3.5 mr-1.5" />
                              Add to Calendar
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-[#09261E]">Property Documents</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-[#09261E] hover:bg-[#135341]">
                        Upload Document
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Upload Document</DialogTitle>
                        <DialogDescription>
                          Upload your property-related documents here. Supported formats: PDF, DOCX, JPG, PNG.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50">
                          <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-1">Drag and drop your file here, or click to browse</p>
                          <p className="text-xs text-gray-500">Maximum file size: 25MB</p>
                        </div>
                        <div className="space-y-3">
                          {(() => {
                            const [docType, setDocType] = useState("");
                            return (
                              <>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="col-span-4 sm:col-span-2">
                                    <Label htmlFor="document-type">Document Type</Label>
                                    <Select onValueChange={setDocType}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="purchase">Purchase Agreement</SelectItem>
                                        <SelectItem value="offer">Offer to Purchase</SelectItem>
                                        <SelectItem value="assignment">Assignment Agreement</SelectItem>
                                        <SelectItem value="inspection">Inspection Report</SelectItem>
                                        <SelectItem value="loan">Loan Documents</SelectItem>
                                        <SelectItem value="title">Title Documents</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="col-span-4 sm:col-span-2">
                                    <Label htmlFor="document-date">Document Date</Label>
                                    <Input type="date" id="document-date" />
                                  </div>
                                </div>
                                
                                {docType === "other" && (
                                  <div>
                                    <Label htmlFor="document-type-custom">Custom Document Type</Label>
                                    <Input id="document-type-custom" placeholder="Enter document type" />
                                  </div>
                                )}
                                
                                <div>
                                  <Label htmlFor="document-description">Description (Optional)</Label>
                                  <Textarea id="document-description" rows={3} placeholder="Add notes about this document" />
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button>Upload Document</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                      {/* Sample documents */}
                      {[
                        { id: 1, name: 'Purchase Agreement', type: 'PDF', date: '2025-04-15', status: 'Signed' },
                        { id: 2, name: 'Property Inspection Report', type: 'PDF', date: '2025-04-22', status: 'Completed' },
                        { id: 3, name: 'Loan Approval Letter', type: 'PDF', date: '2025-04-25', status: 'Pending' },
                        { id: 4, name: 'Closing Disclosure', type: 'PDF', date: '2025-05-02', status: 'Review' },
                      ].map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-3 text-[#09261E]" />
                            <div>
                              <h4 className="font-medium text-[#09261E] text-sm">{doc.name}</h4>
                              <p className="text-xs text-gray-500">{doc.type} • {doc.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Badge className={`mr-3 ${
                              doc.status === 'Signed' || doc.status === 'Completed' ? 'bg-green-500' :
                              doc.status === 'Pending' ? 'bg-gray-400' :
                              'bg-blue-500'
                            }`}>
                              {doc.status}
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                              <Download className="h-4 w-4 text-gray-600" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="contacts" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-[#09261E]">Property Contacts</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-[#09261E] hover:bg-[#135341]">
                        Add Contact
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Add Property Contact</DialogTitle>
                        <DialogDescription>
                          Add professionals involved in this property transaction.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2 sm:col-span-1">
                            <Label htmlFor="contact-name">Full Name</Label>
                            <Input id="contact-name" placeholder="John Smith" />
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <Label htmlFor="contact-role">Role</Label>
                            <Select>
                              <SelectTrigger id="contact-role">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="agent">Seller Agent</SelectItem>
                                <SelectItem value="buyer-agent">Buyer Agent</SelectItem>
                                <SelectItem value="loan">Loan Officer</SelectItem>
                                <SelectItem value="inspector">Inspector</SelectItem>
                                <SelectItem value="title">Title Company</SelectItem>
                                <SelectItem value="attorney">Attorney</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <Label htmlFor="contact-phone">Phone</Label>
                            <Input id="contact-phone" placeholder="(555) 123-4567" />
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <Label htmlFor="contact-email">Email</Label>
                            <Input id="contact-email" placeholder="john@example.com" />
                          </div>
                          <div className="col-span-2">
                            <Label htmlFor="contact-notes">Notes (Optional)</Label>
                            <Textarea id="contact-notes" rows={3} placeholder="Add notes about this contact" />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button>Add Contact</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                      {/* Sample contacts */}
                      {[
                        { id: 1, name: 'Sarah Johnson', role: 'Seller Agent', phone: '(555) 123-4567', email: 'sarah@example.com' },
                        { id: 2, name: 'Michael Chen', role: 'Loan Officer', phone: '(555) 987-6543', email: 'michael@example.com' },
                        { id: 3, name: 'Thomas Wilson', role: 'Home Inspector', phone: '(555) 456-7890', email: 'thomas@example.com' },
                        { id: 4, name: 'Jennifer Lee', role: 'Title Company', phone: '(555) 234-5678', email: 'jennifer@example.com' },
                      ].map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#09261E]/10 flex items-center justify-center mr-3">
                              <span className="text-[#09261E] font-bold">{contact.name.charAt(0)}</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-[#09261E] text-sm">{contact.name}</h4>
                              <p className="text-xs text-gray-500">{contact.role}</p>
                              <p className="text-xs text-gray-500">{contact.email}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-gray-600">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-gray-600">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="outreach" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-[#09261E]">Professional Outreach</h3>
                  <Button size="sm" className="bg-[#09261E] hover:bg-[#135341]">
                    Find REP
                  </Button>
                </div>
                
                <Card className="mb-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Send Property-Specific Outreach</CardTitle>
                    <CardDescription>
                      Connect with real estate professionals about this specific property
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Label htmlFor="outreach-message" className="text-sm mb-2 block">Message</Label>
                      <Textarea 
                        id="outreach-message" 
                        className="min-h-[120px]" 
                        placeholder="Hi, I'm interested in this property at 123 Main St and wanted to connect about the inspection details..." 
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button size="sm">Send Message</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <h3 className="text-sm font-medium text-gray-600 mb-2">Recent Outreach</h3>
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                      {/* Sample outreach */}
                      {[
                        { 
                          id: 1, 
                          rep: 'James Wilson', 
                          role: 'Property Inspector', 
                          status: 'Sent', 
                          date: '2025-05-01', 
                          message: 'I would like to schedule an inspection for the property at 123 Main St. Are you available next week?' 
                        },
                        { 
                          id: 2, 
                          rep: 'Emily Rodriguez', 
                          role: 'Mortgage Specialist', 
                          status: 'Replied', 
                          date: '2025-04-28', 
                          message: 'Hello! Interested in learning more about financing options for this property.' 
                        },
                        { 
                          id: 3, 
                          rep: 'David Chang', 
                          role: 'Buyer Agent', 
                          status: 'Follow up', 
                          date: '2025-04-25', 
                          message: 'Looking at making an offer on 123 Main St and would like you to represent me as a buyer agent.' 
                        },
                      ].map((outreach) => (
                        <div key={outreach.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-[#09261E]/10 flex items-center justify-center mr-2">
                                <span className="text-[#09261E] font-bold text-xs">{outreach.rep.charAt(0)}</span>
                              </div>
                              <div>
                                <h4 className="font-medium text-[#09261E] text-sm">{outreach.rep}</h4>
                                <p className="text-xs text-gray-500">{outreach.role}</p>
                              </div>
                            </div>
                            <Badge className={
                              outreach.status === 'Replied' ? 'bg-green-500' :
                              outreach.status === 'Follow up' ? 'bg-amber-500' :
                              'bg-gray-400'
                            }>
                              {outreach.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2 line-clamp-2">{outreach.message}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">{outreach.date}</span>
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              {outreach.status === 'Replied' ? 'View Conversation' : 
                               outreach.status === 'Follow up' ? 'Send Reminder' : 
                               'Check Status'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notes" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-[#09261E]">Property Notes</h3>
                </div>
                
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <Textarea 
                      placeholder="Add your notes about this property..."
                      className="mb-4 min-h-20"
                    />
                    
                    <div className="flex justify-end">
                      <Button className="bg-[#09261E] hover:bg-[#135341]">
                        Add Note
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="space-y-3">
                  {/* Sample notes */}
                  {[
                    { 
                      id: 1, 
                      text: 'Seller indicated they might be flexible on the closing timeline if we can guarantee a solid offer.', 
                      date: '2025-05-01 09:30 AM', 
                      author: 'You'
                    },
                    { 
                      id: 2, 
                      text: 'The property has a newly replaced roof (2024) and HVAC system (2023). This should reduce maintenance costs for the first few years.', 
                      date: '2025-04-28 03:15 PM', 
                      author: 'You'
                    },
                    { 
                      id: 3, 
                      text: 'Neighborhood has 3 comparable sales in the last 6 months, averaging $285/sqft. This property is listed at $275/sqft which seems reasonable.', 
                      date: '2025-04-25 11:45 AM', 
                      author: 'You'
                    },
                  ].map((note) => (
                    <Card key={note.id}>
                      <CardContent className="p-4">
                        <p className="text-sm mb-3">{note.text}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{note.author}</span>
                          <span>{note.date}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Project Detail Modal */}
      <Dialog open={projectDetailOpen} onOpenChange={setProjectDetailOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#09261E]">
              {activeProject && projects.find(p => p.id === activeProject)?.name}
            </DialogTitle>
            <DialogDescription>
              {activeProject && projects.find(p => p.id === activeProject)?.address}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Tabs defaultValue="overview">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-0">
                {activeProject && (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Project Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Overall Progress</span>
                              <span className="text-sm">
                                {projects.find(p => p.id === activeProject)?.timeline.currentProgress}%
                              </span>
                            </div>
                            <Progress 
                              value={projects.find(p => p.id === activeProject)?.timeline.currentProgress} 
                              className="h-2" 
                            />
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <div>
                              <p className="text-gray-500">Start Date</p>
                              <p className="font-medium">
                                {projects.find(p => p.id === activeProject)?.timeline.startDate}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">End Date</p>
                              <p className="font-medium">
                                {projects.find(p => p.id === activeProject)?.timeline.endDate}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Budget Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Estimated Budget</span>
                              <span className="font-medium">
                                ${projects.find(p => p.id === activeProject)?.budget.estimated.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Actual Spend</span>
                              <span className="font-medium">
                                ${projects.find(p => p.id === activeProject)?.budget.actual.toLocaleString()}
                              </span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Remaining</span>
                              <span className="font-medium text-green-600">
                                ${projects.find(p => p.id === activeProject)?.budget.remaining.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Task Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {projects.find(p => p.id === activeProject)?.tasks.map(task => (
                              <div key={task.id} className="flex items-center">
                                <div className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center mr-3">
                                  {task.completed && <CheckSquare className="h-4 w-4 text-green-600" />}
                                </div>
                                <span className={task.completed ? 'line-through text-gray-500' : ''}>
                                  {task.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="tasks" className="mt-0">
                {/* Task management content */}
              </TabsContent>
              
              <TabsContent value="budget" className="mt-0">
                {/* Budget management content */}
              </TabsContent>
              
              <TabsContent value="updates" className="mt-0">
                {/* Updates log content */}
              </TabsContent>
              
              <TabsContent value="team" className="mt-0">
                {/* Team management content */}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
