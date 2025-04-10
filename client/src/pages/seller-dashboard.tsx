import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Property } from "@shared/schema";
import { Redirect } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/properties/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { PlusCircle, Home, MessageSquare, BarChart3, Settings } from "lucide-react";

export default function SellerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("properties");

  const { data: properties, isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/seller/properties"],
    enabled: !!user && user.userType === "seller",
  });

  const { data: inquiries, isLoading: inquiriesLoading } = useQuery({
    queryKey: ["/api/seller/inquiries"],
    enabled: !!user && user.userType === "seller",
  });

  // Redirect if user is not a seller
  if (user && user.userType !== "seller") {
    return <Redirect to="/" />;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#09261E] mb-2">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your properties and inquiries in one place</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="bg-[#09261E] hover:bg-[#135341] text-white">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Property
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#09261E]">{propertiesLoading ? "..." : properties?.length || 0}</div>
            <p className="text-sm text-gray-500 mt-1">Listed properties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">Total Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#09261E]">{inquiriesLoading ? "..." : inquiries?.length || 0}</div>
            <p className="text-sm text-gray-500 mt-1">Potential buyers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#09261E]">1,245</div>
            <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#09261E]">3.2%</div>
            <p className="text-sm text-gray-500 mt-1">Views to inquiries</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="properties" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="properties" className="text-sm">
            <Home className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Properties</span>
          </TabsTrigger>
          <TabsTrigger value="inquiries" className="text-sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Inquiries</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-sm">
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          {propertiesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                  <CardContent className="py-4">
                    <Skeleton className="h-6 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : properties && properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-[#09261E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="h-8 w-8 text-[#09261E]" />
                </div>
                <CardTitle className="mb-2">No properties listed yet</CardTitle>
                <CardDescription className="mb-4">Start adding your properties to find potential buyers</CardDescription>
                <Button className="bg-[#09261E] hover:bg-[#135341] text-white">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Property
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="inquiries">
          {inquiriesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardContent className="py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-72 mb-2" />
                        <Skeleton className="h-4 w-96" />
                      </div>
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : inquiries && inquiries.length > 0 ? (
            <div className="space-y-4">
              {inquiries.map((inquiry: any) => (
                <Card key={inquiry.id}>
                  <CardContent className="py-4">
                    <div className="flex flex-col md:flex-row justify-between md:items-center">
                      <div>
                        <h3 className="font-heading font-bold text-[#09261E]">{inquiry.name}</h3>
                        <p className="text-gray-600">{inquiry.email} • {inquiry.phone || 'No phone'}</p>
                        <p className="text-sm text-gray-500 mt-1">Regarding: Property #{inquiry.propertyId}</p>
                        <p className="mt-2 text-gray-700">{inquiry.message}</p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Button variant="outline" className="mr-2">Reply</Button>
                        <Button className="bg-[#09261E] hover:bg-[#135341] text-white">View Property</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-[#09261E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-[#09261E]" />
                </div>
                <CardTitle className="mb-2">No inquiries yet</CardTitle>
                <CardDescription>Inquiries from potential buyers will appear here</CardDescription>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-bold text-[#09261E] mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-600">Detailed performance metrics for your properties will be available soon.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your seller profile and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <h3 className="font-medium mb-2">Profile Information</h3>
                  <p className="text-sm text-gray-600 mb-1">Name: {user?.fullName || user?.username}</p>
                  <p className="text-sm text-gray-600 mb-1">Email: {user?.email || 'No email provided'}</p>
                  <p className="text-sm text-gray-600">Account Type: Seller</p>
                </div>
                <div className="pt-2">
                  <Button variant="outline">Edit Profile</Button>
                </div>
                <div className="border-t pt-4 mt-2">
                  <h3 className="font-medium mb-2">Notification Preferences</h3>
                  <p className="text-sm text-gray-600 mb-2">Configure how you receive updates and inquiries</p>
                  <Button variant="outline">Manage Notifications</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
