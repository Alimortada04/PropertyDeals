import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";
import { Calendar, UserPlus, Check } from "lucide-react";

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
  if (!connections || connections.length === 0) {
    return null;
  }
  
  return (
    <div id="connections" className="my-8 scroll-mt-24">
      <h2 className="text-2xl font-bold text-[#09261E] mb-4">
        Connections <span className="text-base font-normal text-gray-500">({connections.length})</span>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {connections.map((connection) => (
          <ConnectionCard 
            key={connection.id} 
            connection={connection}
          />
        ))}
      </div>
    </div>
  );
}

interface ConnectionCardProps {
  connection: Connection;
}

function ConnectionCard({ connection }: ConnectionCardProps) {
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
    ? "rounded-md" 
    : "rounded-full";
  
  return (
    <div className="flex items-start p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      <Avatar className={`h-14 w-14 ${avatarBorderClass}`}>
        <AvatarImage src={connection.avatar} alt={connection.name} />
        <AvatarFallback className={avatarBorderClass}>{initials}</AvatarFallback>
      </Avatar>
      
      <div className="ml-3 flex-1">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{connection.name}</h3>
        
        <div className="flex items-center gap-2 mt-0.5 mb-1">
          <Badge variant="outline" className="text-xs py-0 px-1.5 border-gray-300">
            {connection.title}
          </Badge>
          
          {connection.isMutual && (
            <Badge variant="outline" className="text-xs py-0 px-1.5 border-[#09261E] text-[#09261E]">
              <Check size={10} className="mr-1" />
              <span>Mutual</span>
            </Badge>
          )}
        </div>
        
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <Calendar size={12} className="mr-1" />
          <span>Connected {formatRelativeTime(connection.connectedDate)}</span>
        </div>
        
        <Button 
          size="sm" 
          variant="ghost" 
          className="mt-2 h-7 px-2 text-sm text-[#09261E] hover:bg-[#09261E]/10"
        >
          <UserPlus size={14} className="mr-1.5" />
          <span>View Profile</span>
        </Button>
      </div>
    </div>
  );
}