import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  MessageSquare
} from "lucide-react";
import { Link, useLocation } from "wouter";

// Import data
import { propertiesByStage, propertyTasks } from "@/data/properties";

// Property card component for Kanban board
interface KanbanPropertyCardProps {
  property: any;
  onClickProperty: (id: number) => void;
  onClickRoadmap: (id: number) => void;
}

const KanbanPropertyCard = ({ property, onClickProperty, onClickRoadmap }: KanbanPropertyCardProps) => {
  return (
    <Card className="mb-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-32 overflow-hidden">
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-[#09261E]">
          {property.status}
        </Badge>
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
            View Property
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1 h-8 text-xs bg-[#09261E] hover:bg-[#135341]"
            onClick={() => onClickRoadmap(property.id)}
          >
            Roadmap
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Simulate drag and drop (would be replaced with actual drag and drop implementation)
export default function DashboardManageTab() {
  const [, setLocation] = useLocation();
  const [activeProperty, setActiveProperty] = useState<number | null>(null);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  
  // Handle property card clicks
  const handleViewProperty = (propertyId: number) => {
    setLocation(`/properties/${propertyId}`);
  };
  
  const handleViewRoadmap = (propertyId: number) => {
    setActiveProperty(propertyId);
    setIsRoadmapOpen(true);
  };
  
  // Column titles and descriptions
  const columns = [
    {
      id: "favorited",
      title: "Favorited",
      description: "Properties you've saved",
      properties: propertiesByStage.favorited || [],
      color: "bg-blue-500"
    },
    {
      id: "contacted",
      title: "Contacted",
      description: "Initial outreach made",
      properties: propertiesByStage.contacted || [],
      color: "bg-indigo-500"
    },
    {
      id: "offer_made",
      title: "Offer Made",
      description: "Offers submitted",
      properties: propertiesByStage.offer_made || [],
      color: "bg-purple-500"
    },
    {
      id: "close_pending",
      title: "Close Pending",
      description: "Closing in progress",
      properties: propertiesByStage.close_pending || [],
      color: "bg-amber-500"
    },
    {
      id: "management",
      title: "TC → Management",
      description: "Closed deals in management",
      properties: propertiesByStage.closed || [],
      color: "bg-green-500"
    },
    {
      id: "dropped",
      title: "Dropped",
      description: "No longer pursuing",
      properties: propertiesByStage.dropped || [],
      color: "bg-gray-500"
    }
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#09261E] mb-1">Property Pipeline</h2>
        <p className="text-gray-600">Track your properties through each stage of the investment process</p>
      </div>
      
      {/* Kanban board */}
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
            
            <div className="h-[calc(100vh-280px)] overflow-y-auto bg-gray-50 border border-gray-200 rounded-b-lg p-3">
              {column.properties.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-24 border border-dashed border-gray-300 rounded-lg bg-gray-50 p-4 text-center text-gray-500">
                  <p className="text-sm">No properties in this stage</p>
                </div>
              ) : (
                column.properties.map((property) => (
                  <KanbanPropertyCard 
                    key={property.id} 
                    property={property} 
                    onClickProperty={handleViewProperty}
                    onClickRoadmap={handleViewRoadmap}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Property Roadmap Dialog */}
      <Dialog open={isRoadmapOpen} onOpenChange={setIsRoadmapOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#09261E]">
              Property Roadmap
            </DialogTitle>
            <DialogDescription>
              Track your progress and manage tasks for this property
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Tabs defaultValue="progress">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
                <TabsTrigger value="project">Project Management</TabsTrigger>
              </TabsList>
              
              <TabsContent value="progress" className="mt-0">
                <PropertyRoadmapProgress propertyId={activeProperty} />
              </TabsContent>
              
              <TabsContent value="documents" className="mt-0">
                <PropertyRoadmapDocuments />
              </TabsContent>
              
              <TabsContent value="contacts" className="mt-0">
                <PropertyRoadmapContacts />
              </TabsContent>
              
              <TabsContent value="project" className="mt-0">
                <PropertyRoadmapProject />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button 
              variant="outline" 
              className="mr-2"
              onClick={() => setIsRoadmapOpen(false)}
            >
              Close
            </Button>
            <Button 
              className="bg-[#09261E] hover:bg-[#135341]"
              onClick={() => {
                setIsRoadmapOpen(false);
                setLocation(`/properties/${activeProperty}/manage`);
              }}
            >
              Full Property Manager
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Property Roadmap Progress component
interface PropertyRoadmapProgressProps {
  propertyId: number | null;
}

function PropertyRoadmapProgress({ propertyId }: PropertyRoadmapProgressProps) {
  const stages = [
    {
      id: "viewing",
      title: "Viewing Scheduled",
      icon: <Calendar className="h-5 w-5" />,
      tasks: [
        { id: 1, title: "Schedule property viewing", description: "Set up a time to see the property" },
        { id: 2, title: "Prepare viewing checklist", description: "Create list of items to inspect" },
        { id: 3, title: "Contact agent for access", description: "Confirm viewing details with agent" }
      ]
    },
    {
      id: "pre_approval",
      title: "Pre-Approval & Funding",
      icon: <FileText className="h-5 w-5" />,
      tasks: [
        { id: 1, title: "Contact lenders", description: "Reach out to multiple lending options" },
        { id: 2, title: "Submit financial documents", description: "Provide necessary documentation" },
        { id: 3, title: "Secure pre-approval letter", description: "Get official pre-approval" },
        { id: 4, title: "Compare funding options", description: "Review terms from different lenders" }
      ]
    },
    {
      id: "offer",
      title: "Offer Made",
      icon: <FileText className="h-5 w-5" />,
      tasks: [
        { id: 1, title: "Draft offer letter", description: "Prepare initial offer" },
        { id: 2, title: "Review with agent", description: "Get professional feedback" },
        { id: 3, title: "Submit offer", description: "Officially submit to seller" },
        { id: 4, title: "Negotiation", description: "Handle counteroffers" }
      ]
    },
    {
      id: "closing",
      title: "Closing Preparation",
      icon: <CheckSquare className="h-5 w-5" />,
      tasks: [
        { id: 1, title: "Schedule home inspection", description: "Book professional inspector" },
        { id: 2, title: "Review inspection results", description: "Assess property condition" },
        { id: 3, title: "Final walkthrough", description: "Verify property condition" },
        { id: 4, title: "Prepare closing documents", description: "Gather necessary paperwork" },
        { id: 5, title: "Final approval from lender", description: "Confirm financing" }
      ]
    },
    {
      id: "management",
      title: "Project Management",
      icon: <Wrench className="h-5 w-5" />,
      tasks: [
        { id: 1, title: "Create renovation plan", description: "Outline needed improvements" },
        { id: 2, title: "Contact contractors", description: "Get multiple quotes" },
        { id: 3, title: "Schedule work", description: "Set timeline for renovations" },
        { id: 4, title: "Monitor progress", description: "Regular check-ins on work" },
        { id: 5, title: "Final inspection", description: "Verify quality of renovations" }
      ]
    }
  ];
  
  // Use actual task data from our property tasks if available
  const propertyTaskList = propertyId && propertyTasks[propertyId] 
    ? propertyTasks[propertyId] 
    : [];
  
  // Calculate the current stage based on completed tasks
  const completedTasks = propertyTaskList.filter(task => task.status === "completed").length;
  const totalTasks = propertyTaskList.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  return (
    <div>
      {/* Progress Overview */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-[#09261E]">Progress Overview</h3>
            <Badge className="bg-blue-500">{`${completedTasks}/${totalTasks} Tasks Completed`}</Badge>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-[#09261E] h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          {/* Next scheduled event */}
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-[#09261E]" />
            <span>Next: Home inspection scheduled for May 5, 2025</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Stages */}
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <Card key={stage.id} className="overflow-hidden">
            <CardHeader className="py-3 px-4 bg-gray-50 flex flex-row items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#EAF2EF] flex items-center justify-center mr-3">
                  {stage.icon}
                </div>
                <CardTitle className="text-base font-semibold text-[#09261E]">{stage.title}</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                {stage.tasks.map((task) => {
                  // Find matching task from actual property tasks
                  const matchingTask = propertyTaskList.find(t => 
                    t.title.toLowerCase().includes(task.title.toLowerCase())
                  );
                  
                  const status = matchingTask ? matchingTask.status : "pending";
                  const statusIcon = {
                    completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
                    in_progress: <Clock3 className="h-4 w-4 text-amber-500" />,
                    pending: <AlertCircle className="h-4 w-4 text-gray-400" />,
                  };
                  
                  return (
                    <div key={task.id} className="flex items-start space-x-3">
                      <div className="mt-0.5">
                        {statusIcon[status]}
                      </div>
                      <div>
                        <h4 className={`font-medium text-sm ${
                          status === 'completed' ? 'text-gray-500 line-through' : 'text-[#09261E]'
                        }`}>
                          {task.title}
                        </h4>
                        <p className="text-xs text-gray-500">{task.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Property Roadmap Documents component
function PropertyRoadmapDocuments() {
  const documents = [
    { id: 1, name: "Purchase Agreement.pdf", type: "Contract", date: "Apr 28, 2025", status: "Signed" },
    { id: 2, name: "Inspection Report.pdf", type: "Inspection", date: "May 5, 2025", status: "Pending" },
    { id: 3, name: "Pre-Approval Letter.pdf", type: "Financing", date: "Apr 20, 2025", status: "Completed" },
    { id: 4, name: "Property Disclosure.pdf", type: "Disclosure", date: "Apr 25, 2025", status: "Review Needed" }
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-[#09261E]">Property Documents</h3>
        <Button size="sm" className="bg-[#09261E] hover:bg-[#135341]">
          Upload Document
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {documents.map((doc) => (
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
                    doc.status === 'Pending' ? 'bg-amber-500' :
                    'bg-blue-500'
                  }`}>
                    {doc.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Property Roadmap Contacts component
function PropertyRoadmapContacts() {
  const contacts = [
    { 
      id: 1, 
      name: "John Davis", 
      role: "Listing Agent", 
      phone: "555-123-4567", 
      email: "john@example.com",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    { 
      id: 2, 
      name: "Sarah Miller", 
      role: "Buyer's Agent", 
      phone: "555-987-6543", 
      email: "sarah@example.com",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg"
    },
    { 
      id: 3, 
      name: "Mike Johnson", 
      role: "Inspector", 
      phone: "555-567-8901", 
      email: "mike@example.com",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg"
    },
    { 
      id: 4, 
      name: "Jennifer Lee", 
      role: "Lender", 
      phone: "555-234-5678", 
      email: "jennifer@example.com",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg"
    }
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-[#09261E]">Property Contacts</h3>
        <Button size="sm" className="bg-[#09261E] hover:bg-[#135341]">
          Add Contact
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 mr-3 rounded-full overflow-hidden">
                  <img 
                    src={contact.avatar} 
                    alt={contact.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-[#09261E]">{contact.name}</h4>
                  <p className="text-sm text-gray-600">{contact.role}</p>
                </div>
              </div>
              
              <div className="space-y-2 pl-2">
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <a href={`tel:${contact.phone}`} className="text-[#09261E] hover:text-[#803344]">
                    {contact.phone}
                  </a>
                </div>
                <div className="flex items-center text-sm">
                  <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                  <a href={`mailto:${contact.email}`} className="text-[#09261E] hover:text-[#803344]">
                    {contact.email}
                  </a>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-[#09261E] text-[#09261E] hover:bg-[#09261E] hover:text-white"
                >
                  <Phone className="h-4 w-4 mr-1" /> Call
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-[#09261E] text-[#09261E] hover:bg-[#09261E] hover:text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-1" /> Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Property Roadmap Project Management component
function PropertyRoadmapProject() {
  const projects = [
    {
      id: 1,
      title: "Kitchen Renovation",
      contractor: "ABC Renovations",
      status: "In Progress",
      progress: 60,
      startDate: "Apr 15, 2025",
      endDate: "May 20, 2025",
      budget: "$25,000",
      description: "Complete kitchen renovation including new cabinets, countertops, and appliances."
    },
    {
      id: 2,
      title: "Bathroom Remodel",
      contractor: "Luxury Bathrooms",
      status: "Not Started",
      progress: 0,
      startDate: "Jun 1, 2025",
      endDate: "Jun 15, 2025",
      budget: "$12,000",
      description: "Master bathroom remodel with new fixtures, tile, and vanity."
    },
    {
      id: 3,
      title: "Exterior Painting",
      contractor: "Perfect Painters",
      status: "Scheduled",
      progress: 5,
      startDate: "May 25, 2025",
      endDate: "May 30, 2025",
      budget: "$8,500",
      description: "Complete exterior painting with premium weather-resistant paint."
    }
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-[#09261E]">Project Management</h3>
        <Button size="sm" className="bg-[#09261E] hover:bg-[#135341]">
          Add Project
        </Button>
      </div>
      
      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base font-semibold text-[#09261E]">{project.title}</CardTitle>
                <Badge className={`${
                  project.status === 'In Progress' ? 'bg-amber-500' :
                  project.status === 'Completed' ? 'bg-green-500' :
                  project.status === 'Scheduled' ? 'bg-blue-500' :
                  'bg-gray-500'
                }`}>
                  {project.status}
                </Badge>
              </div>
              <CardDescription className="flex items-center">
                <Users className="h-3.5 w-3.5 mr-1 text-gray-500" />
                {project.contractor}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-2">
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      project.status === 'In Progress' ? 'bg-amber-500' :
                      project.status === 'Completed' ? 'bg-green-500' :
                      project.status === 'Scheduled' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-2">{project.description}</div>
              
              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div>
                  <span className="text-gray-500">Start Date:</span>
                  <span className="font-medium text-[#09261E] ml-1">{project.startDate}</span>
                </div>
                <div>
                  <span className="text-gray-500">End Date:</span>
                  <span className="font-medium text-[#09261E] ml-1">{project.endDate}</span>
                </div>
                <div>
                  <span className="text-gray-500">Budget:</span>
                  <span className="font-medium text-[#09261E] ml-1">{project.budget}</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-0 flex justify-end">
              <Button variant="link" className="text-[#09261E] hover:text-[#803344] p-0 h-auto">
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}