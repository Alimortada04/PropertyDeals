import { Rep } from "@/lib/rep-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { useState } from "react";

interface AboutSectionProps {
  rep: Rep;
}

export default function AboutSection({ rep }: AboutSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const truncatedBio = rep.bio.length > 300 && !isExpanded
    ? rep.bio.substring(0, 300) + "..."
    : rep.bio;
  
  const toggleBio = () => {
    setIsExpanded(prev => !prev);
  };

  const isBusinessAccount = rep.role.toLowerCase().includes('agency') || 
    rep.role.toLowerCase().includes('brokerage') || 
    rep.role.toLowerCase().includes('group') || 
    rep.role.toLowerCase().includes('associates');
  
  return (
    <div id="about" className="my-8 scroll-mt-24">
      <h2 className="text-2xl font-bold text-[#09261E] mb-4">About</h2>
      
      <Card>
        <CardContent className="p-5">
          {/* Bio */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bio</h3>
            <p className="text-gray-700">{truncatedBio}</p>
            {rep.bio.length > 300 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleBio} 
                className="mt-2 h-8 px-2 text-[#09261E]"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp size={16} className="mr-1" />
                    <span>Show Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} className="mr-1" />
                    <span>Read More</span>
                  </>
                )}
              </Button>
            )}
          </div>
          
          {/* Location */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
            <div className="flex items-center text-gray-700">
              <MapPin size={16} className="mr-2 text-gray-500" />
              <span>
                {rep.location.city}, {rep.location.state}
                {rep.locationsServed && rep.locationsServed.length > 0 && (
                  <span className="text-gray-500 ml-2">
                    (Serves: {rep.locationsServed.join(", ")})
                  </span>
                )}
              </span>
            </div>
          </div>
          
          {/* Expertise */}
          {rep.expertise && rep.expertise.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {rep.expertise.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Credentials */}
          {rep.credentials && rep.credentials.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Credentials</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {rep.credentials.map((credential, index) => (
                  <li key={index}>{credential}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Additional Info */}
          {rep.additionalInfo && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Information</h3>
              <p className="text-gray-700">{rep.additionalInfo}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}