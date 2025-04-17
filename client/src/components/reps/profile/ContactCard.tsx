import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Rep } from "@/lib/rep-data";
import {
  Phone,
  Mail,
  MessageCircle,
  Download,
  QrCode,
  ArrowUpRight,
  PhoneIcon,
  Clock
} from "lucide-react";

interface ContactCardProps {
  rep: Rep;
  className?: string;
}

export default function ContactCard({ rep, className }: ContactCardProps) {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  
  const isAvailable = rep.availability !== "unavailable";
  
  return (
    <>
      <Card className={`overflow-hidden shadow-md sticky top-[calc(70px+1rem)] ${className}`}>
        <CardContent className="p-5">
          <h3 className="font-heading font-semibold text-lg text-gray-800 mb-4">
            Contact {rep.name.split(' ')[0]}
          </h3>
          
          {!isAvailable && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-center text-sm text-amber-800">
              <Clock size={18} className="mr-2 text-amber-600" />
              <div>
                <p className="font-medium">Currently Not Available</p>
                <p className="text-xs mt-0.5">This REP is not accepting new projects at this time.</p>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <Button 
              size="lg"
              className={`w-full bg-[#09261E] hover:bg-[#135341] ${!isAvailable && 'opacity-70 cursor-not-allowed'}`}
              disabled={!isAvailable}
            >
              <MessageCircle size={18} className="mr-2" />
              Message
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                className={`text-[#09261E] border-[#09261E] hover:bg-[#09261E]/10 ${!rep.phone && 'opacity-70 cursor-not-allowed'} ${!isAvailable && 'opacity-70 cursor-not-allowed'}`}
                disabled={!rep.phone || !isAvailable}
              >
                <Phone size={16} className="mr-2" />
                Call
              </Button>
              
              <Button 
                variant="outline"
                className={`text-[#09261E] border-[#09261E] hover:bg-[#09261E]/10 ${!isAvailable && 'opacity-70 cursor-not-allowed'}`}
                disabled={!isAvailable}
              >
                <Mail size={16} className="mr-2" />
                Email
              </Button>
            </div>
            
            {/* Availability Schedule */}
            {rep.availabilitySchedule && (
              <div className="border-t border-gray-100 pt-3 mt-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock size={14} className="mr-1 text-gray-500" />
                  Availability
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  {rep.availabilitySchedule.map((schedule, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{schedule.day}</span>
                      <span className="font-medium">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Contact Actions */}
            <div className="border-t border-gray-100 pt-3 mt-3 grid grid-cols-2 gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-[#09261E] hover:bg-[#09261E]/10"
                onClick={() => setQrModalOpen(true)}
              >
                <QrCode size={14} className="mr-1.5" />
                QR Code
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-[#09261E] hover:bg-[#09261E]/10"
              >
                <Download size={14} className="mr-1.5" />
                Save Contact
              </Button>
            </div>
            
            {/* Social Links */}
            {rep.social && Object.keys(rep.social).length > 0 && (
              <div className="border-t border-gray-100 pt-3 mt-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Social & Business
                </h4>
                <div className="flex flex-wrap gap-2">
                  {rep.social.website && (
                    <a 
                      href={rep.social.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 border border-gray-200 rounded-full text-gray-700 hover:border-[#09261E]/30 hover:bg-[#09261E]/5 transition-colors flex items-center"
                    >
                      Website
                      <ArrowUpRight size={12} className="ml-1" />
                    </a>
                  )}
                  {rep.social.linkedin && (
                    <a 
                      href={rep.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 border border-gray-200 rounded-full text-gray-700 hover:border-[#0077B5]/30 hover:bg-[#0077B5]/5 transition-colors flex items-center"
                    >
                      LinkedIn
                      <ArrowUpRight size={12} className="ml-1" />
                    </a>
                  )}
                  {rep.social.instagram && (
                    <a 
                      href={rep.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 border border-gray-200 rounded-full text-gray-700 hover:border-[#E1306C]/30 hover:bg-[#E1306C]/5 transition-colors flex items-center"
                    >
                      Instagram
                      <ArrowUpRight size={12} className="ml-1" />
                    </a>
                  )}
                </div>
              </div>
            )}
            
            {/* Response Time */}
            {rep.responseTime && (
              <div className="mt-3 text-xs text-gray-500 flex items-center justify-center">
                <Clock size={12} className="mr-1 text-gray-400" />
                <span>Typically responds in {rep.responseTime}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* QR Code Modal */}
      <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact {rep.name}</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center p-4">
            <div className="w-48 h-48 bg-white p-2 rounded-lg border border-gray-200 mb-4 flex items-center justify-center">
              {/* QR Code would be generated here */}
              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-gray-400">
                QR Code
              </div>
            </div>
            
            <p className="text-sm text-gray-600 text-center mb-3">
              Scan this code to save contact information for {rep.name}
            </p>
            
            <div className="grid grid-cols-1 gap-3 w-full max-w-xs">
              {rep.phone && (
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <PhoneIcon size={16} />
                  <span>{rep.phone}</span>
                </Button>
              )}
              
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <Mail size={16} />
                <span>{rep.email || 'Contact via PropertyDeals'}</span>
              </Button>
              
              <Button className="bg-[#09261E] hover:bg-[#135341]">
                <Download size={16} className="mr-2" />
                Download vCard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}