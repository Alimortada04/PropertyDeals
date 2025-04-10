import { useQuery } from "@tanstack/react-query";
import { Rep, getRepBySlug } from "@/lib/rep-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin } from "lucide-react";
import { allProperties } from "@/lib/data";
import PropertyCard from "@/components/properties/property-card";
import { Property } from "@shared/schema";

interface RepDetailPageProps {
  slug: string;
}

export default function RepDetailPage({ slug }: RepDetailPageProps) {
  // In a real app, this would fetch from API
  const rep = getRepBySlug(slug);
  
  if (!rep) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-heading font-bold text-[#09261E] mb-4">
          Professional Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The professional you're looking for doesn't exist or may have been removed.
        </p>
        <Button
          className="bg-[#09261E] hover:bg-[#135341] text-white"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  // Get properties associated with this REP (for sellers)
  const currentProperties = rep.properties?.current?.map(
    id => allProperties.find(p => p.id === id)
  ).filter(Boolean) as Partial<Property>[];
  
  const pastProperties = rep.properties?.past?.map(
    id => allProperties.find(p => p.id === id)
  ).filter(Boolean) as Partial<Property>[];

  const repTypeLabels = {
    'seller': 'Seller',
    'contractor': 'Contractor',
    'agent': 'Agent',
    'lender': 'Lender'
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#F5F5F5] py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <img
              src={rep.avatar}
              alt={rep.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-md border-4 border-white mb-6"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://randomuser.me/api/portraits/lego/1.jpg";
              }}
            />
            
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#09261E] mb-2">
              {rep.name}
            </h1>
            
            <Badge 
              variant="outline" 
              className="mb-4 px-4 py-1 text-base bg-[#E59F9F]/10 text-[#803344] border-[#E59F9F]"
            >
              {repTypeLabels[rep.type]}
            </Badge>
            
            <p className="text-xl text-gray-700 max-w-2xl mb-8">
              {rep.tagline}
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <div className="flex items-center text-gray-700">
                <Phone className="w-5 h-5 text-[#135341] mr-2" />
                <span>{rep.contact.phone}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Mail className="w-5 h-5 text-[#135341] mr-2" />
                <span>{rep.contact.email}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 text-[#135341] mr-2" />
                <span>{rep.location.city}, {rep.location.state}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-6">
              About Me
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>{rep.bio}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Dynamic Section Based on REP Type */}
      {rep.type === 'seller' && rep.properties && (
        <>
          {/* Current Properties */}
          {currentProperties && currentProperties.length > 0 && (
            <section className="py-12 bg-[#F5F5F5]">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-8">
                  Current Listings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            </section>
          )}
          
          {/* Past Properties */}
          {pastProperties && pastProperties.length > 0 && (
            <section className="py-12 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-8">
                  Past Sales
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pastProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
      
      {/* Contractor Projects */}
      {rep.type === 'contractor' && rep.projects && (
        <section className="py-12 bg-[#F5F5F5]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Active Projects */}
              {rep.projects.active && rep.projects.active.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-6">
                    Active Projects
                  </h2>
                  <div className="space-y-4">
                    {rep.projects.active.map((project, index) => (
                      <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-heading text-xl font-semibold text-[#09261E] mb-2">
                          {project.title}
                        </h3>
                        <div className="flex flex-col md:flex-row md:justify-between text-gray-600">
                          <p className="mb-2 md:mb-0">
                            <span className="font-medium">Location:</span> {project.location}
                          </p>
                          <p>
                            <span className="font-medium">Expected Completion:</span> {project.completion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Past Projects */}
              {rep.projects.past && rep.projects.past.length > 0 && (
                <div>
                  <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-6">
                    Completed Projects
                  </h2>
                  <div className="space-y-4">
                    {rep.projects.past.map((project, index) => (
                      <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-heading text-xl font-semibold text-[#09261E] mb-2">
                          {project.title}
                        </h3>
                        <div className="flex flex-col md:flex-row md:justify-between text-gray-600">
                          <p className="mb-2 md:mb-0">
                            <span className="font-medium">Location:</span> {project.location}
                          </p>
                          <p>
                            <span className="font-medium">Completed:</span> {project.completed}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      
      {/* Agent or Lender */}
      {(rep.type === 'agent' || rep.type === 'lender') && rep.clients && (
        <section className="py-12 bg-[#F5F5F5]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h2 className="text-3xl font-heading font-bold text-[#09261E]">
                  Client Testimonials
                </h2>
                <p className="text-lg font-medium text-[#09261E]">
                  {rep.clients.total}+ Satisfied Clients
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rep.clients.testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-gray-700 italic mb-4">"{testimonial.comment}"</p>
                    <p className="font-semibold text-[#09261E]">- {testimonial.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Contact Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-4">
            Ready to Work With {rep.name.split(' ')[0]}?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Get in touch today to discuss your real estate needs and how we can help you achieve your goals.
          </p>
          <Button className="bg-[#09261E] hover:bg-[#135341] text-white px-8 py-6 text-lg">
            Contact Now
          </Button>
        </div>
      </section>
    </>
  );
}