import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";
import { 
  Calendar, 
  UserPlus, 
  Check, 
  ChevronRight, 
  X,
  Search,
  Users,
  Mail,
  CirclePlus
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>(connections);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect if mobile view for responsive display
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);
  
  // Filter connections when search query changes
  useEffect(() => {
    const filtered = connections.filter(connection => 
      connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredConnections(filtered);
  }, [searchQuery, connections]);
  
  if (!connections || connections.length === 0) {
    return (
      <div id="connections" className="my-8 scroll-mt-24">
        <h2 className="text-2xl font-bold text-[#09261E] mb-4">
          Connections <span className="text-base font-normal text-gray-500">(0)</span>
        </h2>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No connections yet</h3>
          <p className="text-gray-500 mt-1">This REP hasn't made any connections on our platform yet.</p>
        </div>
      </div>
    );
  }
  
  // Limit displayed connections based on screen size
  const visibleConnections = isMobile ? connections.slice(0, 3) : connections.slice(0, 6);
  const hasMoreConnections = connections.length > visibleConnections.length;
  
  return (
    <>
      <div id="connections" className="my-8 scroll-mt-24">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#09261E]">
            Connections <span className="text-base font-normal text-gray-500">({connections.length})</span>
          </h2>
          
          <Button 
            variant="link" 
            className="text-[#09261E] font-medium"
            onClick={() => setIsModalOpen(true)}
          >
            View All
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleConnections.map((connection) => (
            <ConnectionCard 
              key={connection.id} 
              connection={connection}
            />
          ))}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 border-dashed border-gray-300 text-gray-500 hover:text-[#09261E] hover:border-[#09261E]"
          onClick={() => setIsModalOpen(true)}
        >
          <Users size={16} className="mr-2" />
          <span>View all {connections.length} connections</span>
        </Button>
      </div>
      
      {/* All Connections Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-2xl">All Connections</DialogTitle>
            <DialogDescription className="text-base text-gray-500">
              Browse all {connections.length} connections
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative my-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by name, title or type..." 
              className="pl-9 border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="overflow-y-auto flex-1 pr-2 -mr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
              {filteredConnections.map((connection) => (
                <ConnectionCard 
                  key={connection.id} 
                  connection={connection}
                />
              ))}
              
              {filteredConnections.length === 0 && (
                <div className="col-span-2 py-8 text-center text-gray-500">
                  <Users size={40} className="mx-auto mb-2 opacity-30" />
                  <p>No connections found matching "{searchQuery}"</p>
                  <Button 
                    variant="link" 
                    className="mt-1 text-[#09261E]"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="pt-2 border-t">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface ConnectionCardProps {
  connection: Connection;
}

function ConnectionCard({ connection }: ConnectionCardProps) {
  const [connectionSent, setConnectionSent] = useState(false);
  
  // Normalize title: change "Real Estate Agent" to "Agent" and "Real Estate Agency" to "Agency"
  const normalizedTitle = connection.title
    .replace("Real Estate Agent", "Agent")
    .replace("Real Estate Agency", "Agency");
  
  const initials = connection.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
  
  const isBusinessAccount = connection.name.includes('&') || 
    connection.name.includes('Group') || 
    connection.name.includes('Properties') || 
    connection.name.includes('Associates') ||
    connection.name.includes('Agency') ||
    connection.name.includes('Realty');
  
  const avatarBorderClass = isBusinessAccount 
    ? "rounded-lg" 
    : "rounded-full";
  
  const handleConnectionRequest = () => {
    setConnectionSent(true);
    // In a real app, this would send the connection request to the server
    setTimeout(() => {
      // After 3 seconds, revert back to the original state - for demo purposes only
      // In a real app, this would stay in the "sent" state
      setConnectionSent(false);
    }, 3000);
  };
  
  return (
    <div className="relative flex items-start p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      {/* Mutual Connection Status Indicator - Top Right */}
      {connection.isMutual ? (
        <div className="absolute top-4 right-4 w-6 h-6 bg-[#09261E] rounded-full flex items-center justify-center text-white shadow-sm">
          <Check size={14} />
        </div>
      ) : (
        <Button 
          size="sm" 
          variant="outline"
          className="absolute top-4 right-4 w-6 h-6 p-0 rounded-full border-gray-300 hover:bg-[#09261E]/10 hover:border-[#09261E]"
          title="Send connection request"
          onClick={handleConnectionRequest}
          disabled={connectionSent}
        >
          {connectionSent ? (
            <Mail size={12} className="text-[#09261E] animate-pulse" />
          ) : (
            <UserPlus size={12} />
          )}
        </Button>
      )}
      
      <Avatar className={`h-12 w-12 ${avatarBorderClass}`}>
        <AvatarImage src={connection.avatar} alt={connection.name} />
        <AvatarFallback className={avatarBorderClass}>{initials}</AvatarFallback>
      </Avatar>
      
      <div className="ml-3 flex-1">
        <h3 className="font-semibold text-gray-900 line-clamp-1 pr-6">{connection.name}</h3>
        
        <div className="mt-0.5">
          <Badge variant="outline" className="text-xs py-0 px-1.5 border-gray-300">
            {normalizedTitle}
          </Badge>
        </div>
        
        <div className="mt-2">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-7 px-2 text-xs text-[#09261E] hover:bg-[#09261E]/10"
          >
            <span>View Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
}