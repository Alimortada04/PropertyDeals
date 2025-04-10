import { Property } from "@shared/schema";
import PropertyCard from "./property-card";

interface PropertyGridProps {
  properties: Partial<Property>[];
  title?: string;
  viewAllLink?: string;
}

export default function PropertyGrid({ properties, title, viewAllLink }: PropertyGridProps) {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {title && (
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-heading font-bold text-[#09261E]">{title}</h2>
            {viewAllLink && (
              <a href={viewAllLink} className="text-[#135341] hover:text-[#09261E] flex items-center">
                View All
                <i className="fas fa-arrow-right ml-2"></i>
              </a>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
}
