import { Rep } from "@/lib/rep-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Home, 
  Building, 
  Calendar,
  Briefcase,
  User
} from "lucide-react";

interface AboutSectionProps {
  rep: Rep;
}

export default function AboutSection({ rep }: AboutSectionProps) {
  return (
    <section id="about" className="py-10 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl font-heading font-bold text-gray-800 mb-6">
          About
        </h2>
        
        <Card className="overflow-hidden shadow-sm">
          <CardContent className="p-6">
            {/* Description/Bio */}
            {rep.bio && (
              <div className="prose prose-gray max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed">{rep.bio}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Areas of Expertise */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  <Briefcase size={18} className="mr-2 text-gray-500" />
                  Areas of Expertise
                </h3>
                
                {rep.expertise && rep.expertise.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {rep.expertise.map((skill, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="bg-white"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No specific expertise listed</p>
                )}
              </div>
              
              {/* Locations Served */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  <MapPin size={18} className="mr-2 text-gray-500" />
                  Locations Served
                </h3>
                
                {rep.locationsServed && rep.locationsServed.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {rep.locationsServed.map((location, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="bg-white"
                      >
                        {location}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">{rep.location.city}, {rep.location.state} area</p>
                )}
              </div>
              
              {/* Property Types */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  <Home size={18} className="mr-2 text-gray-500" />
                  Property Types
                </h3>
                
                {rep.propertyTypes && rep.propertyTypes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {rep.propertyTypes.map((type, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="bg-white"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">All property types</p>
                )}
              </div>
              
              {/* Experience & Credentials */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  <User size={18} className="mr-2 text-gray-500" />
                  Experience & Credentials
                </h3>
                
                <ul className="space-y-2 text-sm text-gray-700">
                  {rep.yearsExperience && (
                    <li className="flex items-start">
                      <span className="text-gray-500 mr-2">•</span>
                      <span>{rep.yearsExperience}+ years in real estate</span>
                    </li>
                  )}
                  
                  {rep.credentials && rep.credentials.map((credential, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-500 mr-2">•</span>
                      <span>{credential}</span>
                    </li>
                  ))}
                  
                  {(!rep.yearsExperience && (!rep.credentials || rep.credentials.length === 0)) && (
                    <p className="text-gray-500 text-sm">No specific credentials listed</p>
                  )}
                </ul>
              </div>
            </div>
            
            {/* Additional Information */}
            {rep.additionalInfo && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Additional Information
                </h3>
                <p className="text-gray-700">{rep.additionalInfo}</p>
              </div>
            )}
            
            {/* Business Information (if applicable) */}
            {rep.businessName && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  <Building size={18} className="mr-2 text-gray-500" />
                  Business Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Business Name</p>
                    <p className="text-gray-600">{rep.businessName}</p>
                  </div>
                  
                  {rep.foundedYear && (
                    <div>
                      <p className="font-medium text-gray-700">Established</p>
                      <p className="text-gray-600">{rep.foundedYear}</p>
                    </div>
                  )}
                  
                  {rep.businessAddress && (
                    <div className="col-span-1 sm:col-span-2">
                      <p className="font-medium text-gray-700">Business Address</p>
                      <p className="text-gray-600">{rep.businessAddress}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Member Since */}
            <div className="mt-8 pt-4 border-t border-gray-100 text-sm text-gray-500 flex items-center justify-center">
              <Calendar size={14} className="mr-1.5" />
              <span>
                Member since {new Date(rep.memberSince || Date.now()).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}