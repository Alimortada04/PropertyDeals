import { Link } from "wouter";
import { Property } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  property: Partial<Property>;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const {
    id,
    title,
    address,
    city,
    state,
    price,
    bedrooms,
    bathrooms,
    squareFeet,
    status,
    imageUrl
  } = property;

  return (
    <Card className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 property-card">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-0 right-0 ${status === 'exclusive' ? 'bg-[#803344]' : 'bg-[#09261E]'} text-white px-3 py-1 m-3 text-sm font-medium rounded`}>
          {status === 'exclusive' ? 'Exclusive' : 'Off-Market'}
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="text-xl font-heading font-bold text-[#135341] mb-2">
          ${price?.toLocaleString()}
        </h3>
        <p className="text-gray-700 mb-3">{address}, {city}, {state}</p>
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span><i className="fas fa-bed mr-1"></i> {bedrooms} beds</span>
          <span><i className="fas fa-bath mr-1"></i> {bathrooms} baths</span>
          <span><i className="fas fa-ruler-combined mr-1"></i> {squareFeet?.toLocaleString()} sqft</span>
        </div>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0">
        <Link href={`/p/${id}`} className="w-full">
          <Button 
            className="w-full bg-[#135341] hover:bg-[#09261E] text-white" 
            variant="default"
          >
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
