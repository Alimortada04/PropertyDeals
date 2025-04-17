import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Users, 
  ExternalLink, 
  CalendarDays, 
  ArrowRight, 
  BadgeCheck
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";

interface RepConnectionsListProps {
  connections: any[];
  repId: number;
}

export default function RepConnectionsList({ connections, repId }: RepConnectionsListProps) {
  const [viewAll, setViewAll] = useState(false);
  const [selectedRepId, setSelectedRepId] = useState<number | null>(null);
  
  // Convert to actual array if it's not
  const connectionsArray = Array.isArray(connections) ? connections : [];
  
  // Fetch connected REP data for each connection
  const { data: connectedReps } = useQuery({
    queryKey: ["/api/reps/connections", repId],
    queryFn: async () => {
      const connectedRepsData = await Promise.all(
        connectionsArray.map(async (connection) => {
          try {
            const res = await fetch(`/api/reps/${connection.connectedRepId}`);
            if (!res.ok) return null;
            
            const repData = await res.json();
            return { ...repData, relationshipType: connection.relationshipType };
          } catch (error) {
            console.error("Failed to fetch connected REP:", error);
            return null;
          }
        })
      );
      
      return connectedRepsData.filter(Boolean);
    },
    enabled: connectionsArray.length > 0,
  });
  
  // Get the selected REP details
  const selectedRep = connectedReps?.find((rep) => rep.id === selectedRepId);
  
  // Get relationship label from type
  const getRelationshipLabel = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'colleague':
        return 'Colleague';
      case 'mentor':
        return 'Mentor';
      case 'partner':
        return 'Business Partner';
      case 'team member':
        return 'Team Member';
      default:
        return 'Connection';
    }
  };

  // Function to display initials for avatar fallback
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Connections
          </CardTitle>
          <CardDescription>Professional network and colleagues</CardDescription>
        </CardHeader>
        <CardContent>
          {connectedReps && connectedReps.length > 0 ? (
            <>
              <div className="flex flex-wrap -mx-1 mb-2">
                <TooltipProvider>
                  {connectedReps.slice(0, 5).map((rep) => (
                    <Tooltip key={rep.id}>
                      <TooltipTrigger asChild>
                        <button 
                          className="relative m-1 transition-transform hover:scale-110 focus:outline-none"
                          onClick={() => setSelectedRepId(rep.id)}
                        >
                          <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                            <AvatarImage src={rep.avatar} alt={rep.name} />
                            <AvatarFallback>{getInitials(rep.name)}</AvatarFallback>
                          </Avatar>
                          {rep.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                              <BadgeCheck className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="p-2">
                        <p className="font-medium text-sm">{rep.name}</p>
                        <p className="text-xs text-muted-foreground">{rep.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  
                  {connectedReps.length > 5 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          className="flex items-center justify-center h-10 w-10 rounded-full bg-muted text-muted-foreground text-xs font-medium m-1"
                          onClick={() => setViewAll(true)}
                        >
                          +{connectedReps.length - 5}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>See all connections</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TooltipProvider>
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => setViewAll(true)}
                >
                  View All Connections
                  <ArrowRight className="h-3.5 w-3.5 ml-2" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-30" />
              <h3 className="text-sm font-medium mb-1">No Connections Yet</h3>
              <p className="text-xs text-muted-foreground">
                This REP hasn't connected with others yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* View All Connections Dialog */}
      <Dialog open={viewAll} onOpenChange={setViewAll}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>All Connections</DialogTitle>
            <DialogDescription>
              Professional connections and colleagues
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
            {connectedReps?.map((rep) => (
              <div 
                key={rep.id} 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setSelectedRepId(rep.id)}
              >
                <Avatar className="h-12 w-12 border-2 border-background">
                  <AvatarImage src={rep.avatar} alt={rep.name} />
                  <AvatarFallback>{getInitials(rep.name)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm truncate">{rep.name}</h4>
                    {rep.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{rep.title}</p>
                  
                  <Badge variant="outline" className="mt-1 text-xs">
                    {getRelationshipLabel(rep.relationshipType)}
                  </Badge>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-shrink-0"
                  asChild
                >
                  <a href={`/reps/${rep.id}`}>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Connected REP Details Dialog */}
      <Dialog 
        open={selectedRepId !== null && selectedRep !== undefined} 
        onOpenChange={(open) => !open && setSelectedRepId(null)}
      >
        {selectedRep && (
          <DialogContent className="max-w-md">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-background">
                <AvatarImage src={selectedRep.avatar} alt={selectedRep.name} />
                <AvatarFallback>{getInitials(selectedRep.name)}</AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="text-lg font-semibold">{selectedRep.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedRep.title}</p>
                
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {getRelationshipLabel(selectedRep.relationshipType)}
                  </Badge>
                  
                  {selectedRep.verified && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium text-xs">
                      <BadgeCheck className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4 mt-4">
              {selectedRep.bio && (
                <p className="text-sm">
                  {selectedRep.bio.length > 150 
                    ? `${selectedRep.bio.substring(0, 150)}...` 
                    : selectedRep.bio}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>
                  Member since {' '}
                  {selectedRep.memberSince 
                    ? new Date(selectedRep.memberSince).getFullYear() 
                    : 'N/A'
                  }
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-3 border-t border-b">
                <div className="text-center">
                  <div className="text-xl font-bold">
                    {selectedRep.stats ? 
                      (typeof selectedRep.stats === 'string' 
                        ? JSON.parse(selectedRep.stats).dealsClosed || 0
                        : selectedRep.stats.dealsClosed || 0) 
                      : 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Deals Closed</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <span className="text-xl font-bold mr-1">
                      {selectedRep.stats ? 
                        (typeof selectedRep.stats === 'string' 
                          ? parseFloat(JSON.parse(selectedRep.stats).rating || 0).toFixed(1)
                          : parseFloat(selectedRep.stats.rating || 0).toFixed(1)) 
                        : "0.0"}
                    </span>
                    <span className="text-yellow-500">★</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedRep.stats ? 
                      (typeof selectedRep.stats === 'string' 
                        ? JSON.parse(selectedRep.stats).reviewCount || 0
                        : selectedRep.stats.reviewCount || 0) 
                      : 0}{' '}
                    Reviews
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between gap-4 mt-2">
              <Button variant="outline" asChild className="flex-1">
                <a href={`/reps/${selectedRep.id}`}>
                  View Profile
                </a>
              </Button>
              <Button className="flex-1">
                Message
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}