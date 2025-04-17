import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Search, 
  Users, 
  UserPlus 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Connection {
  id: number;
  name: string;
  avatar: string;
  title: string;
  type: string;
  connectedDate: string;
  isMutual?: boolean;
}

interface ConnectionsListProps {
  connections: Connection[];
}

export default function ConnectionsList({ connections }: ConnectionsListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();
  
  // Number of connections to show in the preview
  const previewCount = isMobile ? 4 : 8;
  
  // Filter connections based on search term
  const filteredConnections = connections.filter(
    connection =>
      connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <section id="connections" className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-heading font-bold text-gray-800">
            Connections
            <span className="ml-2 text-lg text-gray-500">{connections.length}</span>
          </h2>
          
          {connections.length > previewCount && (
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(true)}
              className="text-[#09261E] border-[#09261E] hover:bg-[#09261E]/10"
            >
              View All
            </Button>
          )}
        </div>
        
        {connections.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {connections.slice(0, previewCount).map((connection, index) => (
              <ConnectionPreview key={index} connection={connection} />
            ))}
          </div>
        ) : (
          <Card className="bg-white rounded-xl overflow-hidden shadow-sm">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <Users className="h-16 w-16 text-gray-300 mb-3" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Connections Yet</h3>
              <p className="text-gray-500 max-w-md mb-4">
                Building a network of connections helps establish trust and opens up new opportunities.
              </p>
              <Button className="bg-[#09261E] hover:bg-[#135341] text-white">
                <UserPlus size={16} className="mr-2" />
                Connect
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* All Connections Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-heading">All Connections ({connections.length})</DialogTitle>
            </DialogHeader>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search connections..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
              {filteredConnections.map((connection, index) => (
                <ConnectionCard key={index} connection={connection} />
              ))}
              
              {filteredConnections.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-8 text-center">
                  <Search className="h-12 w-12 text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No Results Found</h3>
                  <p className="text-gray-500">
                    Try different keywords or clear your search
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

// Simple preview component for the main page
function ConnectionPreview({ connection }: { connection: Connection }) {
  return (
    <a
      href={`/reps/${connection.id}`}
      className="flex flex-col items-center text-center group transition-transform hover:scale-105"
    >
      <div className="relative w-16 h-16 mb-2">
        <img
          src={connection.avatar}
          alt={connection.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm group-hover:shadow-md transition-shadow"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://randomuser.me/api/portraits/lego/1.jpg";
          }}
        />
        {connection.isMutual && (
          <div className="absolute -bottom-1 -right-1 bg-[#09261E] text-white rounded-full w-5 h-5 flex items-center justify-center">
            <Users size={10} />
          </div>
        )}
      </div>
      <span className="text-sm font-medium text-gray-800 line-clamp-1">{connection.name}</span>
      <span className="text-xs text-gray-500 line-clamp-1">{connection.title}</span>
    </a>
  );
}

// More detailed card for the modal
function ConnectionCard({ connection }: { connection: Connection }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 hover:translate-y-[-2px]">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <a href={`/reps/${connection.id}`} className="flex-shrink-0">
            <img
              src={connection.avatar}
              alt={connection.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://randomuser.me/api/portraits/lego/1.jpg";
              }}
            />
          </a>
          
          <div className="flex-1 min-w-0">
            <a 
              href={`/reps/${connection.id}`}
              className="font-medium text-gray-800 hover:text-[#09261E] block line-clamp-1"
            >
              {connection.name}
            </a>
            <div className="text-sm text-gray-500 line-clamp-1">{connection.title}</div>
            
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-700">
                {connection.type.charAt(0).toUpperCase() + connection.type.slice(1)}
              </span>
              
              {connection.isMutual && (
                <span className="text-xs px-2 py-0.5 bg-[#09261E]/10 rounded-full text-[#09261E] flex items-center">
                  <Users size={10} className="mr-1" />
                  Mutual
                </span>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost" 
            size="sm"
            className="flex-shrink-0 h-8 w-8 p-0 rounded-full text-gray-500 hover:text-[#09261E] hover:bg-[#09261E]/10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Handle message action
            }}
          >
            <UserPlus size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}