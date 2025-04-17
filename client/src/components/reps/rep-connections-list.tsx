import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';
import { MapPin, Building, Star, MessageCircle, User } from 'lucide-react';

interface Connection {
  id: number;
  userId: number;
  name: string;
  role: string;
  avatar: string;
  company?: string;
  location?: string;
  rating?: number;
  connectionDate: string;
  isVerified?: boolean;
}

interface RepConnectionsListProps {
  connections: Connection[];
}

export default function RepConnectionsList({ connections }: RepConnectionsListProps) {
  if (!connections || connections.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <User size={40} className="mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-700 mb-1">No Connections Yet</h3>
        <p className="text-gray-500 text-sm">This rep hasn't connected with anyone yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {connections.map((connection) => (
        <Card key={connection.id} className="border border-gray-100 hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <Avatar className="h-12 w-12">
                <AvatarImage src={connection.avatar} alt={connection.name} />
                <AvatarFallback>{connection.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col">
                  {/* Name and Role */}
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Link href={`/reps/${connection.userId}`} className="font-medium text-gray-900 hover:text-[#135341] hover:underline truncate">
                      {connection.name}
                    </Link>
                    
                    <Badge variant="outline" className="font-normal text-xs">
                      {connection.role}
                    </Badge>
                  </div>
                  
                  {/* Location & Company */}
                  <div className="flex flex-col xs:flex-row xs:items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                    {connection.location && (
                      <div className="flex items-center">
                        <MapPin size={12} className="mr-1 text-gray-400" />
                        <span className="truncate">{connection.location}</span>
                      </div>
                    )}
                    
                    {connection.company && (
                      <div className="flex items-center">
                        <Building size={12} className="mr-1 text-gray-400" />
                        <span className="truncate">{connection.company}</span>
                      </div>
                    )}
                    
                    {connection.rating && (
                      <div className="flex items-center">
                        <Star size={12} className="mr-1 text-amber-500 fill-amber-500" />
                        <span>{connection.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action Button */}
              <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                <MessageCircle size={16} className="text-gray-500" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}