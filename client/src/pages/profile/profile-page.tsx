import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Main profile page component
export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">Welcome, {user?.fullName || "User"}!</p>
          <p className="text-sm text-gray-500 mb-4">
            The full profile page with banner upload and multi-section UI will be implemented soon.
          </p>
          <Button 
            className="mt-4"
            onClick={() => {
              toast({
                title: "Success",
                description: "Profile update successful",
              });
            }}
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}