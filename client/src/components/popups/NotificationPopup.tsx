import React from "react";
import { X, Bell, Check, AlertCircle, Home, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

type NotificationType = "update" | "alert" | "message" | "request" | "property";

interface NotificationItemProps {
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  isNew?: boolean;
  onClick?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  type, 
  title, 
  description, 
  time,
  isNew = false,
  onClick
}) => {
  const getIcon = () => {
    switch (type) {
      case "update":
        return <Check className="h-5 w-5 text-green-500" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "message":
        return <Bell className="h-5 w-5 text-blue-500" />;
      case "request":
        return <User className="h-5 w-5 text-purple-500" />;
      case "property":
        return <Building className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div 
      className={cn(
        "flex gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors",
        isNew && "bg-blue-50/50"
      )}
      onClick={onClick}
    >
      <div className="mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-sm">{title}</h4>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{time}</span>
        </div>
        <p className="text-sm text-gray-600 mt-0.5">{description}</p>
      </div>
    </div>
  );
};

export const NotificationPopup: React.FC<NotificationPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <>
      {/* Overlay to close when clicking outside */}
      <div 
        className="fixed inset-0 z-[99]" 
        onClick={onClose}
      />
      
      {/* Popup container */}
      <div className="fixed bottom-12 right-4 z-[100] bg-white rounded-lg shadow-lg border w-80 max-h-[70vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Notification List */}
        <div className="overflow-y-auto max-h-[60vh] divide-y divide-gray-100">
          <NotificationItem
            type="property"
            title="Property Status Change"
            description="124 Maple Street has been marked as 'Under Contract'"
            time="Just now"
            isNew={true}
          />
          <NotificationItem
            type="request"
            title="New Connection Request"
            description="James Wilson wants to connect with you"
            time="2h ago"
            isNew={true}
          />
          <NotificationItem
            type="update"
            title="Document Approved"
            description="Your listing agreement for 789 Oak Avenue was approved"
            time="Yesterday"
          />
          <NotificationItem
            type="message"
            title="New Message"
            description="Sarah Mitchell sent you a message about 456 Pine Road"
            time="2d ago"
          />
          <NotificationItem
            type="alert"
            title="Price Drop Alert"
            description="A property you're watching dropped price by 5%"
            time="3d ago"
          />
        </div>
        
        {/* Footer */}
        <div className="mt-auto border-t py-2 px-4">
          <Button variant="ghost" className="w-full text-sm h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            Mark all as read
          </Button>
        </div>
      </div>
    </>
  );
};