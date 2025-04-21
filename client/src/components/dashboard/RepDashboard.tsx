import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Award, Star, DollarSign, BarChart3 } from 'lucide-react';

export default function RepDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6 text-[#803344]">Welcome to your REP Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-[#803344]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-[#803344]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Clients currently working with you
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#803344]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <Briefcase className="h-4 w-4 text-[#803344]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Successfully closed transactions
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#803344]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reputation</CardTitle>
            <Star className="h-4 w-4 text-[#803344]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5</div>
            <p className="text-xs text-muted-foreground">
              Based on 36 client reviews
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-1 shadow-md">
          <CardHeader className="bg-[#803344]/5">
            <CardTitle className="text-[#803344]">Client Pipeline</CardTitle>
            <CardDescription>
              Track your active client relationships
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md transition-colors">
                <div className="w-2 h-10 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">James & Emily Wilson</p>
                  <p className="text-xs text-muted-foreground">Searching • $350-450k • 3+ bedrooms</p>
                </div>
                <div className="ml-auto font-medium text-green-500">Active</div>
              </div>
              <div className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md transition-colors">
                <div className="w-2 h-10 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Michael Thompson</p>
                  <p className="text-xs text-muted-foreground">Under Contract • $275k • Closing 5/15</p>
                </div>
                <div className="ml-auto font-medium text-yellow-500">Pending</div>
              </div>
              <div className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md transition-colors">
                <div className="w-2 h-10 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Sophia & David Chen</p>
                  <p className="text-xs text-muted-foreground">Initial Contact • $500-650k • 4+ bedrooms</p>
                </div>
                <div className="ml-auto font-medium text-blue-500">New</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1 shadow-md">
          <CardHeader className="bg-[#803344]/5">
            <CardTitle className="text-[#803344]">Performance Metrics</CardTitle>
            <CardDescription>
              Your sales and business analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
                <DollarSign className="h-5 w-5 text-[#803344]" />
                <div>
                  <p className="text-sm font-medium">Revenue YTD</p>
                  <p className="text-xs text-muted-foreground">$178,500 (Commission)</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
                <Award className="h-5 w-5 text-[#803344]" />
                <div>
                  <p className="text-sm font-medium">Sales Rank</p>
                  <p className="text-xs text-muted-foreground">#3 in Chicago Region</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
                <BarChart3 className="h-5 w-5 text-[#803344]" />
                <div>
                  <p className="text-sm font-medium">Conversion Rate</p>
                  <p className="text-xs text-muted-foreground">64% (Leads to Closed Deals)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}