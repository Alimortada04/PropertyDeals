import { Rep } from "@/lib/rep-data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MessageCircle, Calendar, Clock } from "lucide-react";
import { useState } from "react";

interface ContactCardProps {
  rep: Rep;
  className?: string;
}

export default function ContactCard({ rep, className = "" }: ContactCardProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      
      // Reset the sent status after a few seconds
      setTimeout(() => {
        setIsSent(false);
      }, 5000);
    }, 1000);
  };
  
  const isAvailable = rep.availability === "available";
  
  return (
    <div className={`sticky top-24 ${className}`}>
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
            {rep.contact && rep.contact.phone && (
              <Button 
                variant="outline" 
                className="w-full flex justify-center items-center h-9"
                onClick={() => window.open(`tel:${rep.contact.phone}`)}
              >
                <Phone size={15} className="mr-2" />
                <span>Call</span>
              </Button>
            )}
            
            {rep.contact && rep.contact.email && (
              <Button 
                variant="outline" 
                className="w-full flex justify-center items-center h-9"
                onClick={() => window.open(`mailto:${rep.contact.email}`)}
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
              className="w-full flex justify-center items-center h-9"
            >
              <Calendar size={15} className="mr-2" />
              <span>Schedule Meeting</span>
            </Button>
          </div>
          
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="text-sm font-medium text-gray-600">Send a quick message:</p>
              
              <div>
                <Label htmlFor="name" className="sr-only">Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Your name" 
                  required 
                  className="text-sm h-9"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="sr-only">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Your email" 
                  required 
                  className="text-sm h-9"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="sr-only">Phone</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="Your phone (optional)" 
                  className="text-sm h-9"
                />
              </div>
              
              <div>
                <Label htmlFor="message" className="sr-only">Message</Label>
                <Textarea 
                  id="message" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Your message" 
                  required 
                  className="text-sm min-h-[80px] resize-none"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#09261E] hover:bg-[#135341]"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-center">
              <p className="text-green-700 font-medium">Message sent!</p>
              <p className="text-green-600 text-sm mt-1">
                {rep.name} will get back to you soon.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex-col pt-0">
          <p className="text-xs text-gray-500 mt-3 text-center">
            By contacting this real estate professional, you agree to the terms of service and privacy policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}