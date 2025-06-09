import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share2 } from "lucide-react";

interface MobileFloatingCTAProps {
  property: any;
  onContact: () => void;
  onSaveProperty: () => void;
  onShare: () => void;
  isSaved: boolean;
}

export function MobileFloatingCTA({
  property,
  onContact,
  onSaveProperty,
  onShare,
  isSaved
}: MobileFloatingCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="text-lg font-bold text-[#09261E]">
            ${property.price?.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            {property.bedrooms}bd • {property.bathrooms}ba
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveProperty}
            className={isSaved ? "text-red-500 border-red-200" : "text-gray-600"}
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="text-gray-600"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={onContact}
            className="bg-[#09261E] hover:bg-[#09261E]/90 text-white"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact
          </Button>
        </div>
      </div>
    </div>
  );
}