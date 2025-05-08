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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  UserPlus,
  X,
  Briefcase,
} from "lucide-react";

export default function ConnectionsTab() {
  // State for connections tabs
  const [activeConnectionsTab, setActiveConnectionsTab] = React.useState<'my_connections' | 'find_connections'>('my_connections');
  const [connectionsSearchQuery, setConnectionsSearchQuery] = React.useState('');
  
  // Dummy data for connections
  const myConnections = [
    { id: 1, name: "Jane Smith", type: "Agent", avatar: "", location: "Milwaukee, WI", mutualCount: 3 },
    { id: 2, name: "John Davis", type: "Seller", avatar: "", location: "Madison, WI", mutualCount: 1 },
    { id: 3, name: "Alice Johnson", type: "Contractor", avatar: "", location: "Chicago, IL", mutualCount: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Connections Section */}
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
          
          {/* Connection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myConnections.map((connection) => (
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
              </div>
            ))}
          </div>
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
        <CardContent className="pt-6">
          {/* Professional Categories */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {['Sellers', 'Agents', 'Contractors', 'Lenders', 'Inspectors'].map((category, index) => (
              <Button
                key={category}
                type="button"
                variant="outline"
                className="flex flex-col h-auto py-3 justify-center items-center hover:border-[#09261E] hover:text-[#09261E]"
              >
                <span className="text-sm font-medium">{category}</span>
                <Badge className={`mt-1 ${
                  category === 'Sellers' ? 'bg-[#135341]' : 
                  category === 'Agents' ? 'bg-[#803344]' : 
                  ''
                }`}>{index}</Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}