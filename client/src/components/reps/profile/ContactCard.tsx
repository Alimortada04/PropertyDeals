import { Rep } from "@/lib/rep-data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MessageCircle, UserPlus, Clock, Calendar } from "lucide-react";
import { useState } from "react";

interface ContactCardProps {
  rep: Rep;
  className?: string;
}

export default function ContactCard({ rep, className = "" }: ContactCardProps) {
  // No state variables needed for simplified contact card
  
  const isAvailable = rep.availability === "available";
  
  return (
    <div className={`sticky top-24 hidden md:block ${className}`}>
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-[#09261E]">Contact {rep.name}</CardTitle>
          
          {rep.responseTime && (
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Clock size={14} className="mr-1.5" />
              <span>Typically responds {rep.responseTime}</span>
            </div>
          )}
          
          <div className="flex items-center mt-2">
            <Badge variant={isAvailable ? "default" : "outline"} className={isAvailable ? "bg-green-600 hover:bg-green-700" : "text-red-500 border-red-500"}>
              {isAvailable ? "Available Now" : "Away"}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-3">
          {isAvailable && rep.availabilitySchedule && (
            <div className="mb-4 text-sm">
              <p className="text-gray-500 font-medium mb-1">Available Hours:</p>
              {rep.availabilitySchedule.map((item, index) => (
                <div key={index} className="flex justify-between mb-0.5">
                  <span className="text-gray-700 font-medium">{item.day}:</span>
                  <span className="text-gray-600">{item.hours}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="space-y-3 mb-4">
            {rep.contact?.phone && (
              <Button 
                variant="outline" 
                className="w-full flex justify-center items-center h-9"
                onClick={() => window.open(`tel:${rep.contact?.phone}`)}
              >
                <Phone size={15} className="mr-2" />
                <span>Call</span>
              </Button>
            )}
            
            {rep.contact?.email && (
              <Button 
                variant="outline" 
                className="w-full flex justify-center items-center h-9"
                onClick={() => window.open(`mailto:${rep.contact?.email}`)}
              >
                <Mail size={15} className="mr-2" />
                <span>Email</span>
              </Button>
            )}
            
            <Button 
              className="w-full flex justify-center items-center h-9 bg-[#803344] hover:bg-[#6a2a38]"
            >
              <MessageCircle size={15} className="mr-2" />
              <span>Message</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full flex justify-center items-center h-9 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300"
              onClick={() => {
                // Create a vCard for the contact
                if (rep.contact) {
                  const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${rep.name}
ORG:PropertyDeals
TITLE:${rep.role}
${rep.contact?.phone ? `TEL;TYPE=WORK,VOICE:${rep.contact.phone}` : ''}
${rep.contact?.email ? `EMAIL;TYPE=WORK:${rep.contact.email}` : ''}
${rep.website ? `URL:${rep.website}` : ''}
END:VCARD`;
                  
                  const blob = new Blob([vCardData], { type: 'text/vcard' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `${rep.name.replace(/\s+/g, '-')}-PropertyDeals.vcf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Add to Contacts</span>
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex-col pt-0">
          <p className="text-xs text-gray-500 mt-2 mb-1 text-center">
            By contacting this real estate professional, you agree to the terms of service and privacy policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}