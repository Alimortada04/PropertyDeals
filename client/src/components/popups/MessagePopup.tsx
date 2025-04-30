import React from "react";
import { X, Search, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MessagePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MessageItemProps {
  avatar: string;
  name: string;
  message: string;
  time: string;
  isVerified?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ avatar, name, message, time, isVerified }) => {
  return (
    <div className="flex items-start gap-3 py-3 px-3 hover:bg-gray-50 cursor-pointer transition-colors">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatar} />
        <AvatarFallback className="bg-gray-200">
          {name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm flex items-center">
            {name}
            {isVerified && (
              <svg className="ml-1 w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                <path d="M8 12L10.5 14.5L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </h4>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">{message}</p>
      </div>
    </div>
  );
};

export const MessagePopup: React.FC<MessagePopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <>
      {/* Overlay to close when clicking outside */}
      <div 
        className="fixed inset-0 z-[99]" 
        onClick={onClose}
      />
      
      {/* Popup container */}
      <div className="fixed bottom-12 right-16 z-[100] bg-white rounded-lg shadow-lg border w-80 max-h-[70vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Messages</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="unread" className="w-full">
          <TabsList className="w-full grid grid-cols-3 p-1 bg-gray-50">
            <TabsTrigger value="unread" className="text-sm">Unread</TabsTrigger>
            <TabsTrigger value="groups" className="text-sm">Groups</TabsTrigger>
            <TabsTrigger value="requests" className="text-sm">Requests</TabsTrigger>
          </TabsList>
          
          {/* Unread Content */}
          <TabsContent value="unread" className="mt-0 max-h-[55vh] overflow-y-auto">
            <MessageItem 
              avatar="/images/pdLogo.png"
              name="Team Properties"
              message="Welcome to PropertyDeals! We're excited to have you join us."
              time="Mon"
              isVerified={true}
            />
            <MessageItem 
              avatar=""
              name="Sarah Mitchell"
              message="Hey, I'm interested in the downtown loft. Is it still available?"
              time="Sat"
            />
            <MessageItem 
              avatar=""
              name="James Wilson"
              message="Thanks for connecting! I'd like to discuss the property on Oak Street."
              time="Fri"
            />
          </TabsContent>
          
          {/* Groups Content */}
          <TabsContent value="groups" className="mt-0 max-h-[55vh] overflow-y-auto">
            <MessageItem 
              avatar=""
              name="REP Networking"
              message="New topic: How to handle multiple offers in today's market"
              time="2d"
            />
            <MessageItem 
              avatar=""
              name="Investment Properties"
              message="Alex shared a new property: Multi-family unit in Brookside"
              time="3d"
            />
          </TabsContent>
          
          {/* Requests Content */}
          <TabsContent value="requests" className="mt-0 max-h-[55vh] overflow-y-auto">
            <MessageItem 
              avatar=""
              name="Michael Johnson"
              message="Hi, I'm a buyer looking for properties in the downtown area."
              time="1d"
            />
            <MessageItem 
              avatar=""
              name="Emily Parker"
              message="I'd like to connect regarding investment opportunities."
              time="3d"
            />
          </TabsContent>
        </Tabs>
        
        {/* Search and New Message Bar */}
        <div className="mt-auto border-t p-2 flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..."
              className="w-full py-1.5 pl-8 pr-2 text-sm bg-gray-100 rounded-full focus:outline-none focus:bg-gray-200 transition-colors"
            />
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100 hover:bg-gray-200">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};