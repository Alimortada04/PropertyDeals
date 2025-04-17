import { Property } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarCheck,
  ArrowRight,
  Home,
  BedDouble,
  Bath,
  SquareCode,
  User
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Extend the Property type with closed deal specific fields
interface ClosedDeal extends Property {
  closedDate: string;
  buyer?: string;
  buyerId?: number;
}

interface ClosedDealsProps {
  deals: ClosedDeal[];
}

export default function ClosedDeals({ deals }: ClosedDealsProps) {
  if (!deals || deals.length === 0) {
    return (
      <div id="closed-deals" className="my-8 scroll-mt-24">
        <h2 className="text-2xl font-bold text-[#09261E] mb-4">Closed Deals <span className="text-base font-normal text-gray-500">(0)</span></h2>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
          <CalendarCheck className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No closed deals yet</h3>
          <p className="text-gray-500 mt-1">This REP hasn't closed any deals on our platform yet. Check back soon!</p>
        </div>
      </div>
    );
  }
  
  return (
    <div id="closed-deals" className="my-8 scroll-mt-24">
      <h2 className="text-2xl font-bold text-[#09261E] mb-4">Closed Deals <span className="text-base font-normal text-gray-500">({deals.length})</span></h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}

function DealCard({ deal }: { deal: ClosedDeal }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {/* Property Image */}
      <div className="h-48 w-full relative">
        <img
          src={deal.imageUrl || `https://source.unsplash.com/featured/?house,property&sig=${deal.id}`}
          alt={deal.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <h3 className="text-white font-semibold truncate">{deal.title}</h3>
          <p className="text-white/90 text-sm truncate">{deal.address}</p>
        </div>
        
        <Badge className="absolute top-2 right-2 bg-[#803344] hover:bg-[#803344]">
          SOLD
        </Badge>
      </div>
      
      <CardContent className="p-4">
        {/* Price */}
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold text-[#09261E]">
            {formatCurrency(deal.price)}
          </div>
          <Badge variant="outline" className="text-xs">
            {deal.propertyType || "Residential"}
          </Badge>
        </div>
        
        {/* Location */}
        <p className="text-gray-500 text-sm mb-3">
          {deal.city}, {deal.state} {deal.zipCode}
        </p>
        
        {/* Features */}
        <div className="flex flex-wrap gap-3 mb-3">
          {deal.bedrooms && (
            <div className="flex items-center text-xs text-gray-700">
              <BedDouble size={14} className="mr-1" />
              <span>{deal.bedrooms} {deal.bedrooms === 1 ? "Bed" : "Beds"}</span>
            </div>
          )}
          
          {deal.bathrooms && (
            <div className="flex items-center text-xs text-gray-700">
              <Bath size={14} className="mr-1" />
              <span>{deal.bathrooms} {deal.bathrooms === 1 ? "Bath" : "Baths"}</span>
            </div>
          )}
          
          {deal.squareFeet && (
            <div className="flex items-center text-xs text-gray-700">
              <SquareCode size={14} className="mr-1" />
              <span>{deal.squareFeet.toLocaleString()} sq ft</span>
            </div>
          )}
          
          {deal.propertyType && (
            <div className="flex items-center text-xs text-gray-700">
              <Home size={14} className="mr-1" />
              <span>{deal.propertyType}</span>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center text-xs text-gray-500">
            <CalendarCheck size={14} className="mr-1" />
            <span>Closed {new Date(deal.closedDate).toLocaleDateString()}</span>
          </div>
          
          {deal.buyer && (
            <div className="flex items-center text-xs text-gray-500">
              <User size={14} className="mr-1" />
              <span>Buyer: {deal.buyer}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}