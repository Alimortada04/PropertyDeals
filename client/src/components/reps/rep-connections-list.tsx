import React from 'react';
import { Link } from 'wouter';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Connection {
  id: number;
  name: string;
  role: string;
  avatar: string;
  relationship?: string;
}

interface RepConnectionsListProps {
  connections: Connection[];
}

export default function RepConnectionsList({ connections }: RepConnectionsListProps) {
  return (
    <div className="space-y-4">
      {connections.map((connection) => (
        <Link href={`/reps/${connection.id}`} key={connection.id}>
          <div className="flex items-center p-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={connection.avatar} alt={connection.name} />
              <AvatarFallback>{connection.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900 truncate">{connection.name}</p>
                <Badge variant="outline" className="text-xs bg-gray-50 whitespace-nowrap">
                  {connection.role}
                </Badge>
              </div>
              {connection.relationship && (
                <p className="text-xs text-gray-500 truncate">{connection.relationship}</p>
              )}
            </div>
          </div>
        </Link>
      ))}
      
      {connections.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No connections yet.</p>
        </div>
      )}
    </div>
  );
}