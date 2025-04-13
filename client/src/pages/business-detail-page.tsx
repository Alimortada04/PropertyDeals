import { useQuery } from "@tanstack/react-query";
import { Rep, getRepBySlug } from "@/lib/rep-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Building2, Users, Link as LinkIcon, FileCheck, CalendarClock } from "lucide-react";
import { allProperties } from "@/lib/data";
import PropertyCard from "@/components/properties/property-card";
import { Property } from "@shared/schema";
import { Separator } from "@/components/ui/separator";

interface BusinessDetailPageProps {
  slug: string;
}

export default function BusinessDetailPage({ slug }: BusinessDetailPageProps) {
  // In a real app, this would fetch from API
  const business = getRepBySlug(slug);
  
  if (!business || business.entityType !== 'business') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-heading font-bold text-[#09261E] mb-4">
          Business Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The business you're looking for doesn't exist or may have been removed.
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

  // Get properties associated with this business (for businesses that are sellers)
  const currentProperties = business.properties?.current?.map(
    id => allProperties.find(p => p.id === id)
  ).filter(Boolean) as Partial<Property>[];
  
  const pastProperties = business.properties?.past?.map(
    id => allProperties.find(p => p.id === id)
  ).filter(Boolean) as Partial<Property>[];

  const repTypeLabels = {
    'seller': 'Seller',
    'contractor': 'Contractor',
    'agent': 'Agency',
    'lender': 'Lender'
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#F5F5F5] py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <img
                src={business.logoUrl || business.avatar}
                alt={business.name}
                className="w-40 h-40 rounded-lg object-cover shadow-md border-4 border-white"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://randomuser.me/api/portraits/lego/1.jpg";
                }}
              />
              <Badge 
                className="absolute -top-4 -right-4 bg-[#09261E] text-white px-3 py-1.5"
              >
                <Building2 size={16} className="mr-2" />
                Business
              </Badge>
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#09261E] mb-2">
              {business.name}
            </h1>
            
            <Badge 
              variant="outline" 
              className="mb-4 px-4 py-1 text-base bg-[#E59F9F]/10 text-[#803344] border-[#E59F9F]"
            >
              {repTypeLabels[business.type]}
            </Badge>
            
            <p className="text-xl text-gray-700 max-w-2xl mb-8">
              {business.tagline}
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-4">
              <div className="flex items-center text-gray-700">
                <Phone className="w-5 h-5 text-[#135341] mr-2" />
                <span>{business.contact.phone}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Mail className="w-5 h-5 text-[#135341] mr-2" />
                <span>{business.contact.email}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 text-[#135341] mr-2" />
                <span>{business.location.city}, {business.location.state}</span>
              </div>
            </div>

            {business.website && (
              <a href={business.website} target="_blank" rel="noopener noreferrer" 
                className="text-[#135341] hover:text-[#09261E] flex items-center mt-2">
                <LinkIcon className="w-4 h-4 mr-2" />
                {business.website.replace(/(^\w+:|^)\/\//, '')}
              </a>
            )}
          </div>
        </div>
      </section>
      
      {/* Business Information Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-6">
              About {business.name}
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 mb-10">
              <p>{business.bio}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {business.foundedYear && (
                <div className="flex items-start">
                  <CalendarClock className="w-6 h-6 text-[#135341] mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#09261E] text-lg">Founded</h3>
                    <p className="text-gray-700">Est. {business.foundedYear}</p>
                  </div>
                </div>
              )}
              
              {business.employees && (
                <div className="flex items-start">
                  <Users className="w-6 h-6 text-[#135341] mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#09261E] text-lg">Team Size</h3>
                    <p className="text-gray-700">{business.employees} employees</p>
                  </div>
                </div>
              )}
              
              {business.businessLicense && (
                <div className="flex items-start">
                  <FileCheck className="w-6 h-6 text-[#135341] mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#09261E] text-lg">License</h3>
                    <p className="text-gray-700">{business.businessLicense}</p>
                  </div>
                </div>
              )}
            </div>
            
            {business.services && business.services.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-[#09261E] text-xl mb-4">Our Services</h3>
                <div className="flex flex-wrap gap-2">
                  {business.services.map((service, index) => (
                    <Badge key={index} variant="outline" className="bg-[#135341]/10 border-[#135341] text-[#135341]">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Dynamic Section Based on Business Type */}
      {business.type === 'seller' && business.properties && (
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
      {business.type === 'contractor' && business.projects && (
        <section className="py-12 bg-[#F5F5F5]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Active Projects */}
              {business.projects.active && business.projects.active.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-6">
                    Current Projects
                  </h2>
                  <div className="space-y-4">
                    {business.projects.active.map((project, index) => (
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
              {business.projects.past && business.projects.past.length > 0 && (
                <div>
                  <h2 className="text-3xl font-heading font-bold text-[#09261E] mb-6">
                    Featured Projects
                  </h2>
                  <div className="space-y-4">
                    {business.projects.past.map((project, index) => (
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
      {(business.type === 'agent' || business.type === 'lender') && business.clients && (
        <section className="py-12 bg-[#F5F5F5]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h2 className="text-3xl font-heading font-bold text-[#09261E]">
                  Client Testimonials
                </h2>
                <p className="text-lg font-medium text-[#09261E]">
                  {business.clients.total}+ Satisfied Clients
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {business.clients.testimonials.map((testimonial, index) => (
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
            Work With {business.name}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Get in touch today to discuss your real estate needs and how our team can help you achieve your goals.
          </p>
          <Button className="bg-[#09261E] hover:bg-[#135341] text-white px-8 py-6 text-lg">
            Contact Now
          </Button>
        </div>
      </section>
    </>
  );
}