import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CalendarDays, Search, Heart, Calculator, Settings, 
  Star, ArrowRight, Plus, LineChart, PlusCircle, MessageSquare
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function BuyerDashboard() {
  return (
    <div className="p-8 md:p-12 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#09261E]/10 to-transparent p-6 rounded-lg mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-[#09261E]">Welcome back, Ali</h1>
        <p className="text-gray-600 mb-4">Ready to find your next deal?</p>
        <div className="flex items-center text-sm text-[#09261E]">
          <p>You've saved 5 properties. Want us to recommend more like them?</p>
          <Button variant="link" className="text-[#09261E] p-0 ml-2 font-medium">
            View recommendations <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-[#09261E] hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
            <Heart className="h-4 w-4 text-[#09261E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Properties you've bookmarked
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-[#09261E] hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Searches</CardTitle>
            <Search className="h-4 w-4 text-[#09261E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="mt-2">
              <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700 mr-2 mb-2">
                Milwaukee, 3+ beds, &lt;$300K
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-[#09261E] hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viewings</CardTitle>
            <CalendarDays className="h-4 w-4 text-[#09261E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Upcoming property viewings
            </p>
            <Button variant="outline" size="sm" className="mt-3 text-xs">
              <Plus className="mr-1 h-3 w-3" /> Add Viewing
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recommended Properties */}
        <Card className="md:col-span-1 shadow-md">
          <CardHeader className="bg-[#09261E]/5">
            <CardTitle className="text-[#09261E] flex items-center">
              <Star className="mr-2 h-5 w-5 text-[#09261E]" /> Recommended Properties
            </CardTitle>
            <CardDescription>
              Properties that match your preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-md transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                <div className="w-16 h-16 rounded bg-gray-200 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium">Modern Townhouse</p>
                  <p className="text-xs text-muted-foreground">3 bed • 2 bath • Chicago</p>
                  <p className="text-xs text-[#09261E] mt-1">Matches 85% of your criteria</p>
                </div>
                <div className="ml-auto font-medium">$350,000</div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-md transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                <div className="w-16 h-16 rounded bg-gray-200 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium">Riverfront Condo</p>
                  <p className="text-xs text-muted-foreground">2 bed • 2 bath • Detroit</p>
                  <p className="text-xs text-[#09261E] mt-1">New this week</p>
                </div>
                <div className="ml-auto font-medium">$225,000</div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-md transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                <div className="w-16 h-16 rounded bg-gray-200 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium">Ranch Home</p>
                  <p className="text-xs text-muted-foreground">4 bed • 3 bath • Milwaukee</p>
                  <p className="text-xs text-[#09261E] mt-1">Price reduced by $15,000</p>
                </div>
                <div className="ml-auto font-medium">$410,000</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Right Column Cards */}
        <div className="space-y-6">
          {/* Tools */}
          <Card className="shadow-md">
            <CardHeader className="bg-[#09261E]/5">
              <CardTitle className="text-[#09261E]">Tools</CardTitle>
              <CardDescription>
                Calculate and plan your property purchase
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-2">
              <div className="space-y-3">
                <div className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                  <Calculator className="h-5 w-5 text-[#09261E]" />
                  <div>
                    <p className="text-sm font-medium">Mortgage Calculator</p>
                    <p className="text-xs text-muted-foreground">Estimate your monthly payments</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                  <LineChart className="h-5 w-5 text-[#09261E]" />
                  <div>
                    <p className="text-sm font-medium">Flip Calculator</p>
                    <p className="text-xs text-muted-foreground">Analyze potential flip profits</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                  <Settings className="h-5 w-5 text-[#09261E]" />
                  <div>
                    <p className="text-sm font-medium">Preferences</p>
                    <p className="text-xs text-muted-foreground">Update your property criteria</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Buyer Journey Tracker */}
          <Card className="shadow-md">
            <CardHeader className="bg-[#09261E]/5">
              <CardTitle className="text-[#09261E]">Buyer Journey</CardTitle>
              <CardDescription>
                You're 3 steps away from your first offer
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-2">
              <div className="space-y-3">
                <div className="flex items-center p-2">
                  <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                    <span className="text-xs">✓</span>
                  </div>
                  <p className="text-sm">Schedule viewing</p>
                </div>
                <div className="flex items-center p-2">
                  <div className="h-6 w-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mr-3">
                    <span className="text-xs">2</span>
                  </div>
                  <p className="text-sm">Get pre-approved</p>
                </div>
                <div className="flex items-center p-2">
                  <div className="h-6 w-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mr-3">
                    <span className="text-xs">3</span>
                  </div>
                  <p className="text-sm">Submit offer</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Button size="sm" className="bg-[#09261E] hover:bg-[#09261E]/90">
                  Continue Journey
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Inbox Row */}
      <Card className="shadow-md">
        <CardHeader className="bg-[#09261E]/5">
          <CardTitle className="text-[#09261E] flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" /> Messages
          </CardTitle>
          <CardDescription>
            Your recent communications
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-2">
          <div className="space-y-3">
            <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-md transition-colors cursor-pointer border border-transparent hover:border-gray-200">
              <div className="h-10 w-10 rounded-full bg-[#09261E]/20 flex items-center justify-center text-[#09261E] font-medium">JD</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium">John Davis (Seller)</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <p className="text-xs text-gray-600 truncate">Thanks for your interest in my property. I'm available...</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-md transition-colors cursor-pointer border border-transparent hover:border-gray-200">
              <div className="h-10 w-10 rounded-full bg-[#803344]/20 flex items-center justify-center text-[#803344] font-medium">SM</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium">Sarah Miller (REP)</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
                <p className="text-xs text-gray-600 truncate">I found a property that matches your requirements, would you like to...</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Button variant="outline" size="sm" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> New Message
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Priority Buyer CTA */}
      <Card className="bg-gradient-to-r from-[#09261E] to-[#135341] text-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">Want early access to deals?</h3>
              <p className="text-sm text-white/80">Apply for Priority Buyer status and get first dibs on new properties.</p>
            </div>
            <Button className="bg-white text-[#09261E] hover:bg-white/90 hover:text-[#09261E]">
              Apply Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}