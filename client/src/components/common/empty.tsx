import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Home, Search, AlertCircle } from "lucide-react";

interface EmptyProps {
  title: string;
  description: string;
  icon?: "heart" | "home" | "search" | "alert";
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Empty({ title, description, icon = "alert", action }: EmptyProps) {
  const getIcon = () => {
    switch (icon) {
      case "heart":
        return <Heart className="h-12 w-12 text-gray-300" />;
      case "home":
        return <Home className="h-12 w-12 text-gray-300" />;
      case "search":
        return <Search className="h-12 w-12 text-gray-300" />;
      default:
        return <AlertCircle className="h-12 w-12 text-gray-300" />;
    }
  };

  return (
    <Card className="w-full border border-gray-200">
      <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          {getIcon()}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6 max-w-md">{description}</p>
        {action && (
          <Button 
            onClick={action.onClick}
            className="bg-[#09261E] hover:bg-[#135341] text-white"
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}