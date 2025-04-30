import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Cog, Mail, MapPin, Calendar, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user, supabaseUser } = useAuth();

  // Get the current user role
  const currentRole = user?.activeRole || "buyer";

  // Map roles to colors
  const roleColors: Record<string, { bg: string, text: string }> = {
    buyer: { bg: "bg-[#09261E]/10", text: "text-[#09261E]" },
    seller: { bg: "bg-[#135341]/10", text: "text-[#135341]" },
    rep: { bg: "bg-[#803344]/10", text: "text-[#803344]" },
  };

  const roleColor = roleColors[currentRole] || roleColors.buyer;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        <Link href="/profile/settings">
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <Cog className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-28 w-28 mb-4">
                <AvatarImage src="" alt={user?.fullName || "User"} />
                <AvatarFallback className="bg-[#09261E] text-white text-2xl">
                  {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              
              <h1 className="text-2xl font-bold mb-1">
                {user?.fullName || "User Name"}
              </h1>
              
              <p className="text-gray-500 mb-3">@{user?.username || "username"}</p>
              
              <Badge className={`${roleColor.bg} ${roleColor.text} mb-4`}>
                {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
              </Badge>
              
              <div className="w-full border-t border-gray-100 pt-4 mt-2">
                <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email || supabaseUser?.email || "email@example.com"}</span>
                </div>
                
                <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>Location not specified</span>
                </div>
                
                <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                
                <div className="flex items-center justify-center gap-1 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Last active today</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio and Details Section */}
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">About Me</h2>
            <p className="text-gray-600 mb-6">
              No bio provided yet. 
              <Link href="/profile/settings">
                <Button variant="link" className="p-0 h-auto text-[#09261E]">Add one now</Button>
              </Link>
            </p>

            <h2 className="text-xl font-bold mb-4">Activity</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-500">No recent activity to show</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Properties of Interest / Listed Properties (based on role) */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">
          {currentRole === 'buyer' ? 'Properties of Interest' : 
           currentRole === 'seller' ? 'My Listed Properties' : 
           'Managed Properties'}
        </h2>
        
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">No properties to display</p>
          <Link href="/properties">
            <Button className="bg-[#09261E] hover:bg-[#09261E]/90">
              {currentRole === 'buyer' ? 'Browse Properties' : 
               currentRole === 'seller' ? 'List a Property' : 
               'Add Property'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}