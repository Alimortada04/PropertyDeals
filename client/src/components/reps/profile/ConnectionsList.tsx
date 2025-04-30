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
  CirclePlus,
  MapPin
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
  location?: string;
  connectedDate: string;
  isMutual?: boolean;
  mutualConnections?: { id: number; name: string; avatar: string }[];
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
          
          <button
            className="px-5 py-1.5 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200 flex items-center"
            onClick={() => setIsModalOpen(true)}
          >
            View All
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleConnections.map((connection) => (
            <ConnectionCard 
              key={connection.id} 
              connection={connection}
            />
          ))}
        </div>
        
        <button 
          className="w-full mt-4 px-5 py-2 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200 flex items-center justify-center"
          onClick={() => setIsModalOpen(true)}
        >
          <Users size={16} className="mr-2" />
          <span>View all {connections.length} connections</span>
        </button>
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
                  <button 
                    className="mt-1 px-3 py-1 rounded-md text-xs whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="pt-2 border-t">
            <button 
              className="px-5 py-1.5 rounded-md text-sm whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#135341]/20 bg-white/70 text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
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
    <a 
      href={`/reps/${connection.id}`} 
      className="block relative cursor-pointer group"
      onClick={(e) => {
        if (e.target instanceof HTMLButtonElement) {
          e.preventDefault(); // Prevent navigation when clicking the button
        }
      }}
    >
      <div className="flex items-center p-3 rounded-lg border border-gray-200 group-hover:shadow-md group-hover:bg-gray-50 transition-all">
        {/* Connection Status Indicator - Only show checkmark for connections */}
        {connection.isMutual && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-[#09261E] rounded-full flex items-center justify-center text-white shadow-sm">
            <Check size={12} />
          </div>
        )}
        
        <Avatar className={`h-12 w-12 ${avatarBorderClass}`}>
          <AvatarImage src={connection.avatar} alt={connection.name} />
          <AvatarFallback className={avatarBorderClass}>{initials}</AvatarFallback>
        </Avatar>
        
        <div className="ml-3 flex-1">
          <h3 className="font-semibold text-gray-900 line-clamp-1 pr-6 text-sm mb-1.5">{connection.name}</h3>
          
          <div className="flex flex-wrap gap-1 mb-1.5">
            <Badge variant="outline" className="text-xs py-0 px-1.5 border-gray-300">
              {normalizedTitle}
            </Badge>
          </div>
          
          {connection.location && (
            <div className="flex items-center text-xs text-gray-600 mb-1.5">
              <MapPin size={12} className="mr-1 text-gray-500" />
              <span>{connection.location}</span>
            </div>
          )}
          
          {/* Mutual connections avatars */}
          <div className="mt-2 h-5">
            {connection.mutualConnections && connection.mutualConnections.length > 0 ? (
              <div className="flex items-center space-x-1">
                <div className="flex -space-x-2">
                  {connection.mutualConnections.slice(0, 3).map((mutual, index) => (
                    <Avatar key={index} className="h-5 w-5 border border-white rounded-full">
                      <AvatarImage src={mutual.avatar} alt={mutual.name} />
                      <AvatarFallback className="text-[8px]">
                        {mutual.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  
                  {connection.mutualConnections.length > 3 && (
                    <div className="h-5 w-5 rounded-full bg-gray-100 border border-white flex items-center justify-center text-[8px] font-medium text-gray-600">
                      +{connection.mutualConnections.length - 3}
                    </div>
                  )}
                </div>
                
                <span className="text-xs text-gray-500">
                  {connection.mutualConnections.length === 1 
                    ? '1 Mutual' 
                    : `${connection.mutualConnections.length} Mutuals`}
                </span>
              </div>
            ) : (
              <span className="text-[10px] text-gray-400 italic">No mutual connections</span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}