import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  UserPlus,
  Search,
  MoreVertical,
  MessageSquare,
  UserMinus,
  Ban,
  User,
  UserCircle,
  Home,
  Building,
  Wrench,
  CreditCard,
  FileCheck,
  Plus,
} from "lucide-react";

interface ProfileData {
  id?: string;
  full_name?: string;
  bio?: string | null;
  username?: string;
  profile_photo_url?: string | null;
  [key: string]: any;
}

interface ConnectionsTabProps {
  profileData?: ProfileData;
  loading?: boolean;
}

const MyConnectionCard = ({ connection }: { connection: any }) => {
  const getAvatarFallback = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getTypeBadgeColor = (type: string) => {
    const typeColors: Record<string, { bg: string, text: string }> = {
      "Seller": { bg: "bg-[#135341]/10", text: "text-[#135341]" },
      "Agent": { bg: "bg-[#803344]/10", text: "text-[#803344]" },
      "Buyer": { bg: "bg-[#09261E]/10", text: "text-[#09261E]" },
      "Lender": { bg: "bg-[#333994]/10", text: "text-[#333994]" },
      "Contractor": { bg: "bg-[#994833]/10", text: "text-[#994833]" },
      "Inspector": { bg: "bg-[#339470]/10", text: "text-[#339470]" },
    };
    
    return typeColors[type] || { bg: "bg-gray-100", text: "text-gray-600" };
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 transition hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-3">
            {connection.avatar ? (
              <AvatarImage src={connection.avatar} alt={connection.name} />
            ) : (
              <AvatarFallback className="bg-[#09261E] text-white">
                {getAvatarFallback(connection.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="font-medium text-gray-900">{connection.name}</h3>
            <div className="flex items-center">
              {connection.type && (
                <Badge variant="outline" className={`${getTypeBadgeColor(connection.type).bg} ${getTypeBadgeColor(connection.type).text} border-0 mr-2 mt-1`}>
                  {connection.type}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer">
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Message</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>View Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600">
              <UserMinus className="mr-2 h-4 w-4" />
              <span>Remove Connection</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-600">
              <Ban className="mr-2 h-4 w-4" />
              <span>Block</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="text-sm text-gray-500">
        <div className="flex items-center mb-1">
          <Home className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
          <span>{connection.location}</span>
        </div>
        {connection.mutualCount > 0 && (
          <div className="flex items-center">
            <Users className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span>{connection.mutualCount} mutual connection{connection.mutualCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const SuggestedConnectionCard = ({ connection }: { connection: any }) => {
  const getAvatarFallback = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getTypeBadgeColor = (type: string) => {
    const typeColors: Record<string, { bg: string, text: string }> = {
      "Seller": { bg: "bg-[#135341]/10", text: "text-[#135341]" },
      "Agent": { bg: "bg-[#803344]/10", text: "text-[#803344]" },
      "Buyer": { bg: "bg-[#09261E]/10", text: "text-[#09261E]" },
      "Lender": { bg: "bg-[#333994]/10", text: "text-[#333994]" },
      "Contractor": { bg: "bg-[#994833]/10", text: "text-[#994833]" },
      "Inspector": { bg: "bg-[#339470]/10", text: "text-[#339470]" },
    };
    
    return typeColors[type] || { bg: "bg-gray-100", text: "text-gray-600" };
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 transition hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-3">
            {connection.avatar ? (
              <AvatarImage src={connection.avatar} alt={connection.name} />
            ) : (
              <AvatarFallback className="bg-[#09261E] text-white">
                {getAvatarFallback(connection.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="font-medium text-gray-900">{connection.name}</h3>
            <div className="flex items-center">
              {connection.type && (
                <Badge variant="outline" className={`${getTypeBadgeColor(connection.type).bg} ${getTypeBadgeColor(connection.type).text} border-0 mr-2 mt-1`}>
                  {connection.type}
                </Badge>
              )}
              <span className="text-sm text-gray-500 mt-1">{connection.location}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-500 mb-3">
        {connection.mutualCount > 0 && (
          <div className="flex items-center">
            <Users className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span>{connection.mutualCount} mutual connection{connection.mutualCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
      <Button variant="outline" size="sm" className="w-full">
        <UserPlus className="h-3.5 w-3.5 mr-1.5" />
        Connect
      </Button>
    </div>
  );
};

const CategoryFindCard = ({ category, icon, count }: { category: string, icon: React.ReactNode, count?: number }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 transition hover:shadow-md text-center">
      <div className="h-12 w-12 rounded-full bg-[#09261E]/10 flex items-center justify-center mx-auto mb-3">
        {icon}
      </div>
      <h3 className="font-medium text-gray-900 mb-1">Find {category}</h3>
      <p className="text-sm text-gray-500 mb-3">
        {count 
          ? `${count} ${category.toLowerCase()} on PropertyDeals` 
          : `Connect with ${category.toLowerCase()} on PropertyDeals`}
      </p>
      <Button variant="outline" size="sm" className="w-full">
        <Search className="h-3.5 w-3.5 mr-1.5" />
        Browse {category}
      </Button>
    </div>
  );
};

const ProfessionalEmptyState = ({ type }: { type: string }) => {
  return (
    <div className="text-center py-8">
      <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        {type === "Seller" && <Building className="h-8 w-8 text-gray-400" />}
        {type === "Agent" && <UserCircle className="h-8 w-8 text-gray-400" />}
        {type === "Contractor" && <Wrench className="h-8 w-8 text-gray-400" />}
        {type === "Lender" && <CreditCard className="h-8 w-8 text-gray-400" />}
        {type === "Inspector" && <FileCheck className="h-8 w-8 text-gray-400" />}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No {type}s Added Yet</h3>
      <p className="text-gray-500 mb-4 max-w-md mx-auto">
        You haven't added any {type.toLowerCase()}s to your preferred professionals list yet.
      </p>
      <Button variant="outline">
        <Plus className="h-4 w-4 mr-2" />
        Add {type}
      </Button>
    </div>
  );
};

export default function ConnectionsTab({ profileData, loading = false }: ConnectionsTabProps) {
  // State for network tab selection
  const [networkTab, setNetworkTab] = useState("my_connections");
  
  // State for professionals tab selection
  const [professionalTab, setProfessionalTab] = useState("Seller");
  
  // State for search queries
  const [connectionSearchQuery, setConnectionSearchQuery] = useState("");
  const [professionalSearchQuery, setProfessionalSearchQuery] = useState("");
  
  // State for displaying the view all connections modal
  const [viewAllModalOpen, setViewAllModalOpen] = useState(false);
  
  // Dummy data for connections - in a real app, this would come from an API
  const myConnections = [
    { id: 1, name: "Jane Smith", type: "Agent", avatar: "", location: "Milwaukee, WI", mutualCount: 3 },
    { id: 2, name: "John Davis", type: "Seller", avatar: "", location: "Madison, WI", mutualCount: 1 },
    { id: 3, name: "Alice Johnson", type: "Contractor", avatar: "", location: "Chicago, IL", mutualCount: 0 },
    { id: 4, name: "Mike Wilson", type: "Buyer", avatar: "", location: "Green Bay, WI", mutualCount: 2 },
    { id: 5, name: "Sarah Brown", type: "Lender", avatar: "", location: "Milwaukee, WI", mutualCount: 5 },
    { id: 6, name: "David Lee", type: "Inspector", avatar: "", location: "Madison, WI", mutualCount: 0 },
  ];
  
  // Dummy data for suggested connections
  const suggestedConnections = [
    { id: 7, name: "Robert Chen", type: "Agent", avatar: "", location: "Madison, WI", mutualCount: 2 },
    { id: 8, name: "Emily Clark", type: "Seller", avatar: "", location: "Chicago, IL", mutualCount: 1 },
    { id: 9, name: "Tom Jackson", type: "Contractor", avatar: "", location: "Milwaukee, WI", mutualCount: 3 },
    { id: 10, name: "Laura Miller", type: "Lender", avatar: "", location: "Green Bay, WI", mutualCount: 0 },
  ];
  
  // Dummy data for professionals counts
  const professionalCounts = {
    "Seller": 3,
    "Agent": 2,
    "Contractor": 1,
    "Lender": 2,
    "Inspector": 0
  };

  // Filter connections based on search query
  const filteredConnections = myConnections.filter(connection => {
    if (!connectionSearchQuery) return true;
    
    const searchLower = connectionSearchQuery.toLowerCase();
    return (
      connection.name.toLowerCase().includes(searchLower) ||
      connection.type.toLowerCase().includes(searchLower) ||
      connection.location.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* My Network Card */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">My Network</CardTitle>
              <CardDescription>Manage your connections within PropertyDeals</CardDescription>
            </div>
            <Button size="sm" className="bg-[#09261E] hover:bg-[#09261E]/90 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Connection
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="my_connections" value={networkTab} onValueChange={setNetworkTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="my_connections" className="data-[state=active]:bg-[#09261E] data-[state=active]:text-white">
                My Connections ({myConnections.length})
              </TabsTrigger>
              <TabsTrigger value="find_connections" className="data-[state=active]:bg-[#09261E] data-[state=active]:text-white">
                Find New Connections
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="my_connections">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search connections by name, type, or location..." 
                    className="pl-10 bg-white"
                    value={connectionSearchQuery}
                    onChange={(e) => setConnectionSearchQuery(e.target.value)}
                  />
                </div>
                
                {filteredConnections.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredConnections.slice(0, 6).map(connection => (
                        <MyConnectionCard key={connection.id} connection={connection} />
                      ))}
                    </div>
                    
                    {filteredConnections.length > 6 && (
                      <div className="text-center mt-4">
                        <Dialog open={viewAllModalOpen} onOpenChange={setViewAllModalOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline">View All Connections</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>All Connections</DialogTitle>
                              <DialogDescription>
                                You have {filteredConnections.length} connections on PropertyDeals
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto p-1">
                              {filteredConnections.map(connection => (
                                <MyConnectionCard key={connection.id} connection={connection} />
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Connections Found</h3>
                    <p className="text-gray-500 mb-4">
                      {connectionSearchQuery 
                        ? "No connections match your search criteria. Try a different search term."
                        : "You haven't connected with anyone yet. Start building your network!"}
                    </p>
                    <Button variant="outline">Find People to Connect With</Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="find_connections">
              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search for people by name, role, or location..."
                    className="pl-10 bg-white"
                  />
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Find People by Category</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <CategoryFindCard 
                      category="Sellers" 
                      icon={<Building className="h-6 w-6 text-[#135341]" />}
                      count={24}
                    />
                    <CategoryFindCard 
                      category="Agents" 
                      icon={<UserCircle className="h-6 w-6 text-[#803344]" />}
                      count={18}
                    />
                    <CategoryFindCard 
                      category="Contractors" 
                      icon={<Wrench className="h-6 w-6 text-[#994833]" />}
                      count={15}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">People you might want to connect with based on your profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suggestedConnections.slice(0, 4).map(connection => (
                      <SuggestedConnectionCard key={connection.id} connection={connection} />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* My Professionals Card */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold">My Professionals</CardTitle>
          <CardDescription>Your trusted real estate professionals by category</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Seller" value={professionalTab} onValueChange={setProfessionalTab} className="w-full">
            <TabsList className="mb-6 bg-transparent border-b border-gray-200 pb-0 justify-start">
              {["Seller", "Agent", "Contractor", "Lender", "Inspector"].map((type) => (
                <TabsTrigger
                  key={type}
                  value={type}
                  className="px-4 py-2 rounded-full mr-2 mb-2 data-[state=active]:bg-[#09261E] data-[state=active]:text-white hover:bg-gray-100 data-[state=active]:hover:bg-[#09261E]/90"
                >
                  {type}s
                  <Badge variant="outline" className="ml-2 bg-white/80 border-0 text-gray-700 text-xs min-w-[20px] h-5">
                    {professionalCounts[type as keyof typeof professionalCounts]}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {["Seller", "Agent", "Contractor", "Lender", "Inspector"].map((type) => (
              <TabsContent key={type} value={type}>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder={`Search for a ${type.toLowerCase()} by name...`}
                      className="pl-10 bg-white"
                      value={professionalSearchQuery}
                      onChange={(e) => setProfessionalSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {professionalCounts[type as keyof typeof professionalCounts] > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {myConnections
                        .filter(connection => connection.type === type)
                        .map(connection => (
                          <MyConnectionCard key={connection.id} connection={connection} />
                        ))}
                    </div>
                  ) : (
                    <ProfessionalEmptyState type={type} />
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}