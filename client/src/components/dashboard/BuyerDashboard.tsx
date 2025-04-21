import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Search, Heart, Calculator, Settings } from 'lucide-react';

export default function BuyerDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Properties you've bookmarked
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Searches</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Your saved search filters
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viewings</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Upcoming property viewings
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recommended Properties</CardTitle>
            <CardDescription>
              Properties that match your preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded bg-gray-200"></div>
                <div>
                  <p className="text-sm font-medium">Modern Townhouse</p>
                  <p className="text-xs text-muted-foreground">3 bed • 2 bath • Chicago</p>
                </div>
                <div className="ml-auto font-medium">$350,000</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded bg-gray-200"></div>
                <div>
                  <p className="text-sm font-medium">Riverfront Condo</p>
                  <p className="text-xs text-muted-foreground">2 bed • 2 bath • Detroit</p>
                </div>
                <div className="ml-auto font-medium">$225,000</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded bg-gray-200"></div>
                <div>
                  <p className="text-sm font-medium">Ranch Home</p>
                  <p className="text-xs text-muted-foreground">4 bed • 3 bath • Milwaukee</p>
                </div>
                <div className="ml-auto font-medium">$410,000</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Tools</CardTitle>
            <CardDescription>
              Calculate and plan your property purchase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Calculator className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Mortgage Calculator</p>
                  <p className="text-xs text-muted-foreground">Estimate your monthly payments</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Calculator className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Flip Calculator</p>
                  <p className="text-xs text-muted-foreground">Analyze potential flip profits</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Preferences</p>
                  <p className="text-xs text-muted-foreground">Update your property criteria</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}