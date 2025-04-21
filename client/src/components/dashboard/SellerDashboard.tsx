import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, BarChart, Building, DollarSign, MessageSquare } from 'lucide-react';

export default function SellerDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6 text-[#135341]">Welcome to your Seller Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-[#135341]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listed Properties</CardTitle>
            <Building className="h-4 w-4 text-[#135341]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Active property listings
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#135341]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-[#135341]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Pending inquiries from buyers
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#135341]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Views</CardTitle>
            <BarChart className="h-4 w-4 text-[#135341]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Daily property views
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-1 shadow-md">
          <CardHeader className="bg-[#135341]/5">
            <CardTitle className="text-[#135341]">Your Properties</CardTitle>
            <CardDescription>
              Manage your current listings
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md transition-colors">
                <div className="w-12 h-12 rounded bg-gray-200"></div>
                <div>
                  <p className="text-sm font-medium">Colonial Revival</p>
                  <p className="text-xs text-muted-foreground">5 bed • 3.5 bath • Listed 45 days ago</p>
                </div>
                <div className="ml-auto font-medium">$625,000</div>
              </div>
              <div className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md transition-colors">
                <div className="w-12 h-12 rounded bg-gray-200"></div>
                <div>
                  <p className="text-sm font-medium">Modern Condo</p>
                  <p className="text-xs text-muted-foreground">2 bed • 2 bath • Listed 12 days ago</p>
                </div>
                <div className="ml-auto font-medium">$339,900</div>
              </div>
              <div className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md transition-colors">
                <div className="w-12 h-12 rounded bg-gray-200"></div>
                <div>
                  <p className="text-sm font-medium">Modern Farmhouse</p>
                  <p className="text-xs text-muted-foreground">4 bed • 3 bath • Listed 60 days ago</p>
                </div>
                <div className="ml-auto font-medium">$459,000</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1 shadow-md">
          <CardHeader className="bg-[#135341]/5">
            <CardTitle className="text-[#135341]">Upcoming Appointments</CardTitle>
            <CardDescription>
              Scheduled property viewings
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
                <CalendarDays className="h-5 w-5 text-[#135341]" />
                <div>
                  <p className="text-sm font-medium">Modern Condo Viewing</p>
                  <p className="text-xs text-muted-foreground">Apr 22, 2025 • 10:00 AM</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
                <CalendarDays className="h-5 w-5 text-[#135341]" />
                <div>
                  <p className="text-sm font-medium">Colonial Revival Viewing</p>
                  <p className="text-xs text-muted-foreground">Apr 23, 2025 • 2:00 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
                <DollarSign className="h-5 w-5 text-[#135341]" />
                <div>
                  <p className="text-sm font-medium">Offer Discussion</p>
                  <p className="text-xs text-muted-foreground">Apr 25, 2025 • 11:30 AM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}