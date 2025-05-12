import React from 'react';
import { useParams } from 'wouter';
import SellerDashboardLayout from '@/components/layout/seller-dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Calendar, 
  FileText, 
  Plus, 
  ArrowRight, 
  Home,
  TrendingUp,
  Users,
  MessageSquare,
  Clock,
  Eye
} from 'lucide-react';

export default function SellerDashboardHomePage() {
  const params = useParams();
  const userId = params.userId;
  
  // Mock data for properties
  const properties = [
    {
      id: 1,
      address: "123 Main Street",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      status: "Listed",
      price: "$450,000",
      beds: 3,
      baths: 2,
      sqft: 1800,
      views: 42,
      offers: 2,
      daysListed: 5
    },
    {
      id: 2,
      address: "456 Oak Avenue",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      status: "Offer Made",
      price: "$625,000",
      beds: 4,
      baths: 3,
      sqft: 2400,
      views: 68,
      offers: 3,
      daysListed: 8
    },
    {
      id: 3,
      address: "789 Pine Boulevard",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      status: "Draft",
      price: "$375,000",
      beds: 2,
      baths: 2,
      sqft: 1500,
      views: 0,
      offers: 0,
      daysListed: 0
    }
  ];

  // Mock upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Property Walkthrough",
      address: "123 Main Street",
      date: "May 14, 2025",
      time: "10:00 AM"
    },
    {
      id: 2,
      title: "Offer Review Meeting",
      address: "456 Oak Avenue",
      date: "May 15, 2025",
      time: "2:00 PM"
    }
  ];
  
  return (
    <SellerDashboardLayout userId={userId}>
      {/* Page title and welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#135341]">Seller Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your listings, offers, and seller activity</p>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Listings</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="h-12 w-12 bg-[#135341]/10 rounded-full flex items-center justify-center">
                <Building className="h-6 w-6 text-[#135341]" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Views</p>
                <p className="text-2xl font-bold">110</p>
              </div>
              <div className="h-12 w-12 bg-[#135341]/10 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-[#135341]" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Open Offers</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <div className="h-12 w-12 bg-[#135341]/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[#135341]" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Messages</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="h-12 w-12 bg-[#135341]/10 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-[#135341]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* My Properties Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#135341]">My Properties</h2>
          <Button 
            variant="outline" 
            className="border-[#135341] text-[#135341] hover:bg-[#135341] hover:text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full">
                <img 
                  src={property.image} 
                  alt={property.address}
                  className="h-full w-full object-cover" 
                />
                <Badge 
                  className={`absolute top-3 left-3 ${
                    property.status === 'Listed' 
                      ? 'bg-green-500' 
                      : property.status === 'Offer Made' 
                        ? 'bg-blue-500' 
                        : 'bg-gray-500'
                  }`}
                >
                  {property.status}
                </Badge>
              </div>
              
              <CardContent className="pt-4">
                <h3 className="font-bold text-lg mb-1">{property.address}</h3>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-[#135341]">{property.price}</p>
                  <div className="flex space-x-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{property.beds} beds</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{property.baths} baths</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{property.sqft} sqft</span>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 border-t pt-3 mt-2 justify-between">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{property.views} views</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>{property.offers} offers</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{property.daysListed} days</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0 flex justify-end">
                <Button variant="link" className="text-[#135341]">
                  View Details <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Quick Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Upcoming Walkthroughs Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-[#135341]" />
              Upcoming Walkthroughs
            </CardTitle>
            <CardDescription>Your scheduled property showings</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start p-3 border rounded-lg">
                    <div className="bg-[#135341]/10 p-2 rounded-lg mr-3">
                      <Calendar className="h-5 w-5 text-[#135341]" />
                    </div>
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-gray-500">{event.address}</p>
                      <p className="text-sm text-gray-500">{event.date} at {event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-6 text-center">No upcoming walkthroughs</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-[#135341] text-[#135341] hover:bg-[#135341] hover:text-white">
              View Calendar
            </Button>
          </CardFooter>
        </Card>
        
        {/* Document Hub Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2 text-[#135341]" />
              Document Hub
            </CardTitle>
            <CardDescription>Manage all your property documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-[#135341]/10 p-2 rounded-lg mr-3">
                    <FileText className="h-5 w-5 text-[#135341]" />
                  </div>
                  <div>
                    <h4 className="font-medium">Listing Agreements</h4>
                    <p className="text-sm text-gray-500">3 documents</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-3 border rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-[#135341]/10 p-2 rounded-lg mr-3">
                    <FileText className="h-5 w-5 text-[#135341]" />
                  </div>
                  <div>
                    <h4 className="font-medium">Offer Documents</h4>
                    <p className="text-sm text-gray-500">5 documents</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-3 border rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-[#135341]/10 p-2 rounded-lg mr-3">
                    <FileText className="h-5 w-5 text-[#135341]" />
                  </div>
                  <div>
                    <h4 className="font-medium">Property Disclosures</h4>
                    <p className="text-sm text-gray-500">2 documents</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-[#135341] text-[#135341] hover:bg-[#135341] hover:text-white">
              View Document Hub
            </Button>
          </CardFooter>
        </Card>
      </div>
    </SellerDashboardLayout>
  );
}