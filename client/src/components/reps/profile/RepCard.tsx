import { Rep } from "@/lib/rep-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, MapPin } from "lucide-react";
import { Link } from "wouter";

interface RepCardProps {
  rep: Rep;
  similarityReason?: string; // Why this REP is recommended (optional)
}

export default function RepCard({ rep, similarityReason }: RepCardProps) {
  // Calculate avatar initials from name
  const initials = rep.name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase();

  // Format location for display
  const location = `${rep.location.city}, ${rep.location.state}`;
  
  // Normalize title: simplify to one word from full role
  const normalizedTitle = rep.role
    .replace("Real Estate Agent", "Agent")
    .replace("Real Estate Agency", "Agency")
    .replace("Real Estate Advisor", "Advisor")
    .replace("Real Estate Brokerage", "Brokerage")
    .replace("Commercial Property Specialist", "Commercial")
    .replace("Residential Real Estate", "Residential")
    .replace("Investment Property Expert", "Investor")
    .replace("New Construction Specialist", "Construction")
    .replace("Rural & Farm Property Expert", "Rural")
    .replace("First-time Homebuyer Specialist", "Homebuyer")
    .replace("Historic Property Specialists", "Historic");
    
  // Check if it's a business account
  const isBusinessAccount = rep.name.includes('&') || 
    rep.name.includes('Group') || 
    rep.name.includes('Properties') || 
    rep.name.includes('Associates') ||
    rep.name.includes('Agency') ||
    rep.name.includes('Realty');
  
  const avatarBorderClass = isBusinessAccount 
    ? "rounded-lg" 
    : "rounded-full";

  return (
    <Link href={`/reps/${rep.id}`}>
      <div className="p-3 rounded-lg border border-gray-200 hover:shadow-md hover:bg-gray-50 transition-all h-full flex flex-col items-center text-center">
        {/* Featured indicator */}
        {rep.isFeatured && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-[#09261E] rounded-full flex items-center justify-center text-white shadow-sm">
            <BadgeCheck size={12} />
          </div>
        )}
        
        <Avatar className={`h-16 w-16 mb-3 ${avatarBorderClass}`}>
          <AvatarImage src={rep.avatar} alt={rep.name} />
          <AvatarFallback className={avatarBorderClass}>{initials}</AvatarFallback>
        </Avatar>
        
        <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm mb-2">{rep.name}</h3>
        
        <Badge variant="outline" className="text-xs py-0 px-1.5 border-gray-300 mb-2">
          {normalizedTitle}
        </Badge>
        
        <div className="flex items-center text-xs text-gray-600 mb-2">
          <MapPin size={12} className="mr-1 text-gray-500" />
          <span>{location}</span>
        </div>
      </div>
    </Link>
  );
}