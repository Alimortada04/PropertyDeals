import { Rep } from "@/lib/rep-data";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RepCardProps {
  rep: Rep;
}

export default function RepCard({ rep }: RepCardProps) {
  const repTypeLabels = {
    'seller': 'Seller',
    'contractor': 'Contractor',
    'agent': 'Agent',
    'lender': 'Lender'
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6 flex flex-col items-center text-center">
        <div className="relative mb-4">
          <img 
            src={rep.avatar} 
            alt={rep.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-[#135341]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://randomuser.me/api/portraits/lego/1.jpg";
            }}
          />
        </div>
        
        <h3 className="font-heading text-xl font-semibold text-[#09261E] mb-1">{rep.name}</h3>
        
        <Badge 
          variant="outline" 
          className="mb-2 bg-[#E59F9F]/10 text-[#803344] border-[#E59F9F] font-medium"
        >
          {repTypeLabels[rep.type]}
        </Badge>
        
        <p className="text-gray-600 text-sm mb-2">{rep.location.city}, {rep.location.state}</p>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-1">{rep.tagline}</p>
        
        <Link href={`/rep/${rep.slug}`}>
          <Button 
            className="w-full bg-[#09261E] hover:bg-[#135341] text-white"
          >
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}