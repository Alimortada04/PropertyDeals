import { Property } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Trophy 
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ClosedDeal extends Property {
  closedDate: string;
  buyer?: string;
  buyerId?: number;
}

interface ClosedDealsProps {
  deals: ClosedDeal[];
}

export default function ClosedDeals({ deals }: ClosedDealsProps) {
  const totalVolume = deals.reduce((sum, deal) => sum + (deal.price || 0), 0);
  
  return (
    <section id="closed-deals" className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-heading font-bold text-gray-800">
              Closed Deals
              <span className="ml-2 text-lg text-gray-500">{deals.length}</span>
            </h2>
            <p className="text-gray-600">Total volume: {formatCurrency(totalVolume)}</p>
          </div>
          
          {deals.length > 0 && (
            <div className="mt-2 md:mt-0">
              <Badge className="bg-[#09261E] text-white flex items-center gap-1 text-sm py-1.5 px-3">
                <Trophy size={14} className="text-amber-300" />
                <span>{deals.length} Deals Closed</span>
              </Badge>
            </div>
          )}
        </div>
        
        {/* Timeline of Closed Deals */}
        <div className="relative">
          {/* Vertical Line */}
          {deals.length > 0 && (
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -ml-px"></div>
          )}
          
          <div className="space-y-8">
            {deals.length > 0 ? (
              deals.map((deal, index) => (
                <ClosedDealCard 
                  key={index} 
                  deal={deal} 
                  position={index % 2 === 0 ? 'left' : 'right'}
                  isFirst={index === 0}
                  isLast={index === deals.length - 1}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                <Calendar className="h-16 w-16 text-gray-300 mb-2" />
                <h3 className="text-xl font-medium text-gray-700 mb-1">No Closed Deals Yet</h3>
                <p className="text-gray-500 max-w-md">
                  When this REP closes a deal, it will appear here with details and transaction history.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface ClosedDealCardProps {
  deal: ClosedDeal;
  position: 'left' | 'right';
  isFirst: boolean;
  isLast: boolean;
}

function ClosedDealCard({ deal, position, isFirst, isLast }: ClosedDealCardProps) {
  return (
    <div className={`flex items-center ${position === 'left' ? 'flex-row-reverse md:flex-row' : 'flex-row-reverse'}`}>
      {/* Timeline Dot */}
      <div className="relative flex-shrink-0 w-12 h-12 mx-2 flex items-center justify-center z-10">
        <div className="w-4 h-4 rounded-full bg-[#09261E] border-4 border-white shadow-md"></div>
        
        {/* First & Last Indicators */}
        {isFirst && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 w-max">
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">First Deal</Badge>
          </div>
        )}
        {isLast && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-2 w-max">
            <Badge className="bg-[#09261E]/10 text-[#09261E] border-[#09261E]/20">Most Recent</Badge>
          </div>
        )}
      </div>
      
      {/* Card */}
      <div className={`w-full md:w-5/12 ${position === 'left' ? 'mr-auto' : 'ml-auto'}`}>
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="bg-white p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-800">{deal.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-1">{deal.address}</p>
              </div>
              <span className="font-bold text-lg text-[#09261E]">
                {formatCurrency(deal.price || 0)}
              </span>
            </div>
            
            <div className="flex flex-col space-y-2 mt-3">
              {/* Closed Date */}
              <div className="flex items-center text-sm text-gray-600">
                <Calendar size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                <span>Closed on {new Date(deal.closedDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
              </div>
              
              {/* Buyer/Partner Info */}
              {deal.buyer && (
                <div className="flex items-center text-sm text-gray-600">
                  <User size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                  <span>Buyer: </span>
                  {deal.buyerId ? (
                    <a href={`/reps/${deal.buyerId}`} className="text-[#09261E] hover:underline ml-1">
                      {deal.buyer}
                    </a>
                  ) : (
                    <span className="ml-1">{deal.buyer}</span>
                  )}
                </div>
              )}
            </div>
            
            {/* Success Indicator */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
              <Badge className="bg-green-100 text-green-700 border-green-200">Closed Successfully</Badge>
              
              <a href={`/p/${deal.id}`} className="text-[#09261E] hover:text-[#135341] transition-colors">
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}