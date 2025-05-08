import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Search,
  UserPlus,
  X,
  Briefcase,
  MessageSquare,
  UserMinus,
  MoreVertical,
  AlertTriangle,
  Save,
} from "lucide-react";

interface ConnectionsTabProps {
  // Optional props that could be passed from the profile page
  profileData?: any;
  loading?: boolean;
}

export default function ConnectionsTab({ profileData, loading = false }: ConnectionsTabProps) {
  // State for connections tabs
  const [activeConnectionsTab, setActiveConnectionsTab] = React.useState<'my_connections' | 'find_connections'>('my_connections');
  const [activeProTab, setActiveProTab] = React.useState('sellers');
  const [connectionsSearchQuery, setConnectionsSearchQuery] = React.useState('');
  const [isProfessionalSectionModified, setIsProfessionalSectionModified] = React.useState(false);
  
  // Dummy data for connections
  const myConnections = [
    { id: 1, name: "Jane Smith", type: "Agent", avatar: "", location: "Milwaukee, WI", mutualCount: 3 },
    { id: 2, name: "John Davis", type: "Seller", avatar: "", location: "Madison, WI", mutualCount: 1 },
    { id: 3, name: "Alice Johnson", type: "Contractor", avatar: "", location: "Chicago, IL", mutualCount: 0 },
    { id: 4, name: "Mike Wilson", type: "Buyer", avatar: "", location: "Green Bay, WI", mutualCount: 2 },
    { id: 5, name: "Sarah Brown", type: "Lender", avatar: "", location: "Milwaukee, WI", mutualCount: 5 },
    { id: 6, name: "David Lee", type: "Inspector", avatar: "", location: "Madison, WI", mutualCount: 0 },
  ];
  
  // Professional categories with counts
  const professionalCounts = {
    sellers: profileData?.preferred_sellers?.length || 3,
    agents: profileData?.preferred_agents?.length || 2,
    contractors: profileData?.preferred_contractors?.length || 4,
    lenders: profileData?.preferred_lenders?.length || 1,
    inspectors: profileData?.preferred_inspectors?.length || 2
  };
  
  // Handle form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfessionalSectionModified(false);
    // In a real app, you would save the data here
  };

  return (
    <div className="space-y-6">
      {/* My Network Section */}
      <Card className="border-gray-200 shadow-sm mb-6">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-[#09261E] mr-2" />
              <div>
                <CardTitle className="text-xl">My Network</CardTitle>
                <CardDescription>Manage your connections within PropertyDeals</CardDescription>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1 border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add Connection</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Pill-style Tab Navigation */}
          <div className="flex space-x-2 mb-6 border-b border-gray-200 pb-2">
            <Button
              onClick={() => setActiveConnectionsTab('my_connections')}
              variant={activeConnectionsTab === 'my_connections' ? "default" : "outline"}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                activeConnectionsTab === 'my_connections'
                  ? 'bg-[#09261E] text-white'
                  : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              My Connections ({myConnections.length})
            </Button>
            <Button
              onClick={() => setActiveConnectionsTab('find_connections')}
              variant={activeConnectionsTab === 'find_connections' ? "default" : "outline"}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                activeConnectionsTab === 'find_connections'
                  ? 'bg-[#09261E] text-white'
                  : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Find New Connections
            </Button>
          </div>
          
          {/* Search bar */}
          <div className="relative mb-6">
            <div className="flex items-center border border-gray-300 rounded-md p-2 bg-white">
              <Search className="h-4 w-4 mr-2 text-gray-400" />
              <Input 
                className="border-0 focus:ring-0 p-0 h-8"
                placeholder="Search connections by name, type, or location..."
                value={connectionsSearchQuery}
                onChange={(e) => setConnectionsSearchQuery(e.target.value)}
              />
              {connectionsSearchQuery && (
                <button
                  onClick={() => setConnectionsSearchQuery('')}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
          
          {/* Content based on active tab */}
          {activeConnectionsTab === 'my_connections' ? (
            // My Connections Tab Content
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myConnections
                .filter(connection => 
                  connectionsSearchQuery === '' || 
                  connection.name.toLowerCase().includes(connectionsSearchQuery.toLowerCase()) ||
                  connection.type.toLowerCase().includes(connectionsSearchQuery.toLowerCase()) ||
                  connection.location.toLowerCase().includes(connectionsSearchQuery.toLowerCase())
                )
                .map((connection) => (
                <div key={connection.id} className="border border-gray-200 rounded-md p-4 hover:shadow-sm transition-shadow bg-white flex items-center">
                  <Avatar className="h-12 w-12 mr-3">
                    <AvatarFallback className={`${
                      connection.type === "Seller" ? "bg-[#135341]" : 
                      connection.type === "Agent" ? "bg-[#803344]" : 
                      "bg-[#09261E]"
                    } text-white`}>
                      {connection.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{connection.name}</p>
                    <div className="flex items-center text-xs text-gray-500 truncate">
                      <span className={`inline-block h-2 w-2 rounded-full mr-1 ${
                        connection.type === "Seller" ? "bg-[#135341]" : 
                        connection.type === "Agent" ? "bg-[#803344]" : 
                        "bg-[#09261E]"
                      }`}></span>
                      <span>{connection.type}</span> 
                      <span className="mx-1">•</span>
                      <span>{connection.location}</span>
                    </div>
                    {connection.mutualCount > 0 && (
                      <div className="mt-1 flex items-center">
                        <Badge variant="outline" className="text-xs bg-gray-50 hover:bg-gray-50 text-gray-700 border-gray-200">
                          <Users className="h-3 w-3 mr-1 text-gray-400" />
                          {connection.mutualCount} mutual connection{connection.mutualCount !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <span>Message</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserMinus className="h-4 w-4 mr-2" />
                        <span>Remove Connection</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
              
              {/* Empty state if filtered results are empty */}
              {myConnections.filter(c => 
                connectionsSearchQuery === '' || 
                c.name.toLowerCase().includes(connectionsSearchQuery.toLowerCase()) ||
                c.type.toLowerCase().includes(connectionsSearchQuery.toLowerCase()) ||
                c.location.toLowerCase().includes(connectionsSearchQuery.toLowerCase())
              ).length === 0 && connectionsSearchQuery !== '' && (
                <div className="col-span-full p-6 border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center bg-gray-50">
                  <Search className="h-10 w-10 text-gray-400 mb-2" />
                  <h4 className="text-lg font-medium text-gray-700">No matching connections</h4>
                  <p className="text-sm text-gray-500 text-center max-w-md mt-1">
                    Try adjusting your search terms or clear the filter
                  </p>
                  <Button
                    className="mt-4 bg-[#09261E] hover:bg-[#09261E]/90 text-white"
                    onClick={() => setConnectionsSearchQuery('')}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Search
                  </Button>
                </div>
              )}
              
              {/* Empty state if no connections at all */}
              {myConnections.length === 0 && (
                <div className="col-span-full p-6 border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center bg-gray-50">
                  <Users className="h-10 w-10 text-gray-400 mb-2" />
                  <h4 className="text-lg font-medium text-gray-700">No connections yet</h4>
                  <p className="text-sm text-gray-500 text-center max-w-md mt-1">
                    Connect with other real estate professionals to expand your network
                  </p>
                  <Button
                    className="mt-4 bg-[#09261E] hover:bg-[#09261E]/90 text-white"
                    onClick={() => setActiveConnectionsTab('find_connections')}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Find Connections
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // Find New Connections Tab Content
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Categories Cards */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">Sellers</h3>
                  <p className="text-sm text-gray-500 mb-3">Connect with property sellers in your area</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full hover:bg-gray-100 transition-colors"
                  >
                    <Search className="h-3.5 w-3.5 mr-1.5" />
                    Find Sellers
                  </Button>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">Agents</h3>
                  <p className="text-sm text-gray-500 mb-3">Build relationships with real estate agents</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full hover:bg-gray-100 transition-colors"
                  >
                    <Search className="h-3.5 w-3.5 mr-1.5" />
                    Find Agents
                  </Button>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">Contractors</h3>
                  <p className="text-sm text-gray-500 mb-3">Find reliable contractors for your projects</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full hover:bg-gray-100 transition-colors"
                  >
                    <Search className="h-3.5 w-3.5 mr-1.5" />
                    Find Contractors
                  </Button>
                </div>
              </div>
              
              {/* Suggested Connections */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2">Suggested Connections</h3>
                <p className="text-sm text-gray-500 mb-4">People you might want to connect with based on your profile</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First suggested connection */}
                  <div className="border border-gray-200 rounded-md p-4 bg-white flex items-center">
                    <Avatar className="h-12 w-12 mr-3">
                      <AvatarFallback className="bg-[#803344] text-white">TR</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800">Thomas Rodriguez</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="inline-block h-2 w-2 rounded-full mr-1 bg-[#803344]"></span>
                        <span>Agent</span>
                        <span className="mx-1">•</span>
                        <span>Milwaukee, WI</span>
                      </div>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                          <Users className="h-3 w-3 mr-1 text-gray-400" />
                          4 mutual connections
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="ml-2 whitespace-nowrap hover:bg-gray-100 transition-colors"
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      Connect
                    </Button>
                  </div>
                  
                  {/* Second suggested connection */}
                  <div className="border border-gray-200 rounded-md p-4 bg-white flex items-center">
                    <Avatar className="h-12 w-12 mr-3">
                      <AvatarFallback className="bg-[#135341] text-white">LW</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800">Lisa Wong</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="inline-block h-2 w-2 rounded-full mr-1 bg-[#135341]"></span>
                        <span>Seller</span>
                        <span className="mx-1">•</span>
                        <span>Chicago, IL</span>
                      </div>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                          <Users className="h-3 w-3 mr-1 text-gray-400" />
                          2 mutual connections
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="ml-2 whitespace-nowrap hover:bg-gray-100 transition-colors"
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      Connect
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* My Professionals Section */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center">
            <Briefcase className="h-5 w-5 text-[#09261E] mr-2" />
            <div>
              <CardTitle className="text-xl">My Professionals</CardTitle>
              <CardDescription>Your trusted real estate professionals by category</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Alert message */}
          <div className="mb-6">
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm text-gray-700 flex items-start">
                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  Add your trusted real estate professionals to streamline your investments. You'll be able to quickly connect them to new deals and projects.
                </span>
              </p>
            </div>
          </div>
          
          {/* Professional Categories - Pill-style tabs */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-6">
            {[
              { key: 'sellers', name: 'Sellers', count: professionalCounts.sellers, color: 'bg-[#135341]' },
              { key: 'agents', name: 'Agents', count: professionalCounts.agents, color: 'bg-[#803344]' },
              { key: 'contractors', name: 'Contractors', count: professionalCounts.contractors, color: '' },
              { key: 'lenders', name: 'Lenders', count: professionalCounts.lenders, color: '' },
              { key: 'inspectors', name: 'Inspectors', count: professionalCounts.inspectors, color: '' }
            ].map((category) => (
              <Button
                key={category.key}
                type="button"
                variant={activeProTab === category.key ? "default" : "outline"}
                className={`flex flex-col h-auto py-3 justify-center items-center
                  ${activeProTab === category.key 
                    ? 'bg-[#09261E] text-white' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                onClick={() => setActiveProTab(category.key)}
              >
                <span className="text-sm font-medium">{category.name}</span>
                <Badge className={`mt-1 ${
                  activeProTab === category.key 
                    ? 'bg-white text-[#09261E]' 
                    : category.color || 'bg-gray-200'
                }`}>
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
          
          {/* Search bar for the selected professional category */}
          <div className="relative mb-6">
            <div className="flex items-center border border-gray-300 rounded-md p-2 bg-white">
              <Search className="h-4 w-4 mr-2 text-gray-400" />
              <Input 
                className="border-0 focus:ring-0 p-0 h-8"
                placeholder={`Search for a ${activeProTab.slice(0, -1)} by name...`}
              />
            </div>
          </div>
          
          {/* Empty state for professionals */}
          <div className="p-6 border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center bg-gray-50">
            <Users className="h-10 w-10 text-gray-400 mb-2" />
            <h4 className="text-lg font-medium text-gray-700">No {activeProTab} added yet</h4>
            <p className="text-sm text-gray-500 text-center max-w-md mt-1">
              Add {activeProTab} you've worked with to streamline your future deals
            </p>
            <Button
              type="button"
              className="mt-4 bg-[#09261E] hover:bg-[#09261E]/90 text-white"
              onClick={() => setIsProfessionalSectionModified(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add {activeProTab.slice(0, -1)}
            </Button>
          </div>
          
          {/* Save button */}
          <div className="flex justify-end mt-8">
            <Button
              type="submit"
              className={`${
                loading ? "bg-gray-400" : isProfessionalSectionModified ? "bg-[#09261E] hover:bg-[#09261E]/90" : "bg-gray-200 text-gray-500"
              } text-white`}
              disabled={loading || !isProfessionalSectionModified}
              onClick={handleFormSubmit}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Professionals
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}