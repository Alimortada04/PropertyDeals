import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  MessageSquare,
  UserMinus,
  MoreVertical,
  Briefcase,
  AlertTriangle,
} from "lucide-react";

interface Connection {
  id: number;
  name: string;
  type: string;
  avatar: string;
  location: string;
  mutualCount: number;
}

interface ConnectionsTabContentProps {
  // These will come from the parent component (ProfilePage)
  profileData: any;
  isProfessionalSectionModified: boolean;
  setIsProfessionalSectionModified: (value: boolean) => void;
  loading: boolean;
  handleProfileSectionSubmit: (e: React.FormEvent) => void;
  handleMultiSelectChange: (field: string, value: string, section: string) => void;
}

const ConnectionsTabContent: React.FC<ConnectionsTabContentProps> = ({
  profileData,
  isProfessionalSectionModified,
  setIsProfessionalSectionModified,
  loading,
  handleProfileSectionSubmit,
  handleMultiSelectChange,
}) => {
  // Local state for connections tab
  const [activeConnectionsTab, setActiveConnectionsTab] = useState<'my_connections' | 'find_connections'>('my_connections');
  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = useState(false);
  const [connectionsSearchQuery, setConnectionsSearchQuery] = useState('');
  
  // Dummy data for connections - in a real app, this would come from an API
  const [myConnections, setMyConnections] = useState<Connection[]>([
    { id: 1, name: "Jane Smith", type: "Agent", avatar: "", location: "Milwaukee, WI", mutualCount: 3 },
    { id: 2, name: "John Davis", type: "Seller", avatar: "", location: "Madison, WI", mutualCount: 1 },
    { id: 3, name: "Alice Johnson", type: "Contractor", avatar: "", location: "Chicago, IL", mutualCount: 0 },
    { id: 4, name: "Mike Wilson", type: "Buyer", avatar: "", location: "Green Bay, WI", mutualCount: 2 },
    { id: 5, name: "Sarah Brown", type: "Lender", avatar: "", location: "Milwaukee, WI", mutualCount: 5 },
    { id: 6, name: "David Lee", type: "Inspector", avatar: "", location: "Madison, WI", mutualCount: 0 },
  ]);
  
  // Professional categories and their counts
  const professionalCounts = {
    sellers: profileData.preferred_sellers?.length || 0,
    agents: profileData.preferred_agents?.length || 0,
    contractors: profileData.preferred_contractors?.length || 0,
    lenders: profileData.preferred_lenders?.length || 0,
    inspectors: profileData.preferred_inspectors?.length || 0
  };
  
  return (
    <>
      {/* Connections Section - NEW */}
      <Card className="border-gray-200 shadow-sm mb-6">
        <CardHeader className="border-b pb-4 bg-gradient-to-r from-gray-50/80 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2 p-1.5 rounded-md bg-green-50">
                <Users className="h-5 w-5 text-[#09261E]" />
              </div>
              <div>
                <CardTitle className="text-xl">My Network</CardTitle>
                <CardDescription>Manage your connections within PropertyDeals</CardDescription>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-1 border-[#09261E] text-[#09261E] hover:bg-[#09261E] hover:text-white"
              onClick={() => setIsConnectionsModalOpen(true)}
            >
              <UserPlus className="h-4 w-4" />
              <span>Add Connection</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveConnectionsTab('my_connections')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeConnectionsTab === 'my_connections'
                    ? 'bg-[#09261E] text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                My Connections ({myConnections.length})
              </button>
              <button
                onClick={() => setActiveConnectionsTab('find_connections')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeConnectionsTab === 'find_connections'
                    ? 'bg-[#09261E] text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Find New Connections
              </button>
            </div>
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
          
          {/* My Connections Tab Content */}
          {activeConnectionsTab === 'my_connections' && (
            <>
              {myConnections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myConnections.map((connection) => (
                    <div key={connection.id} className="border border-gray-200 rounded-md p-4 hover:shadow-sm transition-shadow bg-white flex items-center">
                      <Avatar className="h-12 w-12 mr-3">
                        {connection.avatar ? (
                          <AvatarImage src={connection.avatar} alt={connection.name} />
                        ) : (
                          <AvatarFallback className={`${
                            connection.type === "Seller" ? "bg-[#135341]" : 
                            connection.type === "Agent" ? "bg-[#803344]" : 
                            "bg-[#09261E]"
                          } text-white`}>
                            {connection.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        )}
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
                </div>
              ) : (
                <div className="p-6 border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center bg-gray-50">
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
            </>
          )}
          
          {/* Find New Connections Tab Content */}
          {activeConnectionsTab === 'find_connections' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">Sellers</h3>
                  <p className="text-sm text-gray-500 mb-3">Connect with property sellers in your area</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Search className="h-3.5 w-3.5 mr-1.5" />
                    Find Sellers
                  </Button>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">Agents</h3>
                  <p className="text-sm text-gray-500 mb-3">Build relationships with real estate agents</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Search className="h-3.5 w-3.5 mr-1.5" />
                    Find Agents
                  </Button>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">Contractors</h3>
                  <p className="text-sm text-gray-500 mb-3">Find reliable contractors for your projects</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Search className="h-3.5 w-3.5 mr-1.5" />
                    Find Contractors
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
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
                    <Button size="sm" variant="outline" className="ml-2 whitespace-nowrap">
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
                    <Button size="sm" variant="outline" className="ml-2 whitespace-nowrap">
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
      
      {/* Professionals Section */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b pb-4 bg-gradient-to-r from-gray-50/80 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2 p-1.5 rounded-md bg-green-50">
                <Briefcase className="h-5 w-5 text-[#09261E]" />
              </div>
              <div>
                <CardTitle className="text-xl">My Professionals</CardTitle>
                <CardDescription>Your trusted real estate professionals by category</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          <form onSubmit={handleProfileSectionSubmit}>
            {/* Introduction */}
            <div className="mb-6">
              <div className="p-4 bg-gray-50/80 rounded-md border border-gray-200">
                <p className="text-sm text-gray-700 flex items-start">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    Add your trusted real estate professionals to streamline your investments. You'll be able to quickly connect them to new deals and projects.
                  </span>
                </p>
              </div>
            </div>
            
            {/* Professionals Categories */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <Button
                type="button"
                variant="outline"
                className={`flex flex-col h-auto py-3 justify-center items-center hover:border-[#09261E] hover:text-[#09261E]`}
                onClick={() => document.getElementById('sellers-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="text-sm font-medium">Sellers</span>
                <Badge className="mt-1 bg-[#135341]">{professionalCounts.sellers}</Badge>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className={`flex flex-col h-auto py-3 justify-center items-center hover:border-[#09261E] hover:text-[#09261E]`}
                onClick={() => document.getElementById('agents-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="text-sm font-medium">Agents</span>
                <Badge className="mt-1 bg-[#803344]">{professionalCounts.agents}</Badge>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className={`flex flex-col h-auto py-3 justify-center items-center hover:border-[#09261E] hover:text-[#09261E]`}
                onClick={() => document.getElementById('contractors-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="text-sm font-medium">Contractors</span>
                <Badge className="mt-1">{professionalCounts.contractors}</Badge>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className={`flex flex-col h-auto py-3 justify-center items-center hover:border-[#09261E] hover:text-[#09261E]`}
                onClick={() => document.getElementById('lenders-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="text-sm font-medium">Lenders</span>
                <Badge className="mt-1">{professionalCounts.lenders}</Badge>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className={`flex flex-col h-auto py-3 justify-center items-center hover:border-[#09261E] hover:text-[#09261E]`}
                onClick={() => document.getElementById('inspectors-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="text-sm font-medium">Inspectors</span>
                <Badge className="mt-1">{professionalCounts.inspectors}</Badge>
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
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <div className="mr-2 h-4 w-4" />
                    Save Professionals
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default ConnectionsTabContent;