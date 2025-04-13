import { useState } from "react";
import { useLocation } from "wouter";
import { Rep } from "@/lib/rep-data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, PhoneCall, User } from "lucide-react";

interface RepCardProps {
  rep: Rep;
}

export default function RepCard({ rep }: RepCardProps) {
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  
  const repTypeLabels = {
    'seller': 'Seller',
    'contractor': 'Contractor',
    'agent': 'Agent',
    'lender': 'Lender'
  };
  
  const isBusiness = rep.entityType === "business";
  
  const handleCardClick = () => {
    if (isBusiness) {
      setLocation(`/business/${rep.slug}`);
    } else {
      setLocation(`/rep/${rep.slug}`);
    }
  };

  return (
    <Card 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <CardContent className="p-5 flex flex-col items-center text-center">
        <div 
          className={`relative mb-4 transition-transform duration-300 ${
            isHovered ? 'transform scale-105' : ''
          }`}
        >
          <img 
            src={isBusiness ? (rep.logoUrl || rep.avatar) : rep.avatar} 
            alt={rep.name}
            className={`${isBusiness ? 'w-20 h-20 rounded-md' : 'w-24 h-24 rounded-full'} object-cover border-2 border-[#135341] transition-all duration-300`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://randomuser.me/api/portraits/lego/1.jpg";
            }}
          />
          
          {isBusiness && (
            <Badge className="absolute -top-2 -right-2 bg-[#09261E] text-white px-2 py-1">
              <Building2 size={12} className="mr-1" />
              Business
            </Badge>
          )}
        </div>
        
        <h3 className="font-heading text-xl font-semibold text-[#135341] mb-1 line-clamp-1">{rep.name}</h3>
        
        <Badge 
          variant="outline" 
          className="mb-2 bg-[#E59F9F]/10 text-[#803344] border-[#E59F9F] font-medium"
        >
          {repTypeLabels[rep.type]}
        </Badge>
        
        <div className="flex items-center justify-center text-gray-600 text-sm mb-2">
          <MapPin size={14} className="mr-1" />
          <span>{rep.location.city}, {rep.location.state}</span>
        </div>
        
        <p className="text-gray-700 text-sm mb-3 line-clamp-2 transition-all duration-300">
          {rep.tagline}
        </p>
        
        {isBusiness && rep.foundedYear && (
          <div className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Founded:</span> {rep.foundedYear}
          </div>
        )}
        
        {/* Additional details that show on hover */}
        <div className={`overflow-hidden transition-all duration-300 ${
          isHovered ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
            <PhoneCall size={14} className="mr-1" />
            <span>{rep.contact.phone}</span>
          </div>
          
          {isBusiness && rep.employees && (
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Team size:</span> {rep.employees} employees
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0">
        <Button 
          className={`w-full transition-colors duration-300 ${
            isHovered 
              ? 'bg-[#09261E] hover:bg-[#09261E]/90 text-white' 
              : 'bg-[#135341] hover:bg-[#09261E] text-white'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (isBusiness) {
              setLocation(`/business/${rep.slug}`);
            } else {
              setLocation(`/rep/${rep.slug}`);
            }
          }}
        >
          View {isBusiness ? 'Business' : 'Profile'}
        </Button>
      </CardFooter>
    </Card>
  );
}