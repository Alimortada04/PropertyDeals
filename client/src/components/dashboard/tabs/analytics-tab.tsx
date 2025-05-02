import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart2, 
  PieChart, 
  LineChart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Home, 
  Calendar, 
  ArrowRight,
  Download,
  Share2
} from "lucide-react";
import { BarChart, LineChart as LineChartComponent, AreaChart, PieChartComponent } from "@/components/charts/mock-charts";

// Demo data
const performanceData = [
  { name: "Jan", value: 30 },
  { name: "Feb", value: 45 },
  { name: "Mar", value: 38 },
  { name: "Apr", value: 55 },
  { name: "May", value: 65 },
];

const portfolioComposition = [
  { name: "Residential", value: 60, color: "#09261E" },
  { name: "Commercial", value: 25, color: "#135341" },
  { name: "Land", value: 15, color: "#803344" },
];

const propertyMetrics = [
  { name: "Cashflow", value: 45 },
  { name: "Appreciation", value: 30 },
  { name: "Equity", value: 25 },
];

export default function DashboardAnalyticsTab() {
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#09261E] mb-1">Investment Analytics</h2>
          <p className="text-gray-600">Track your investment performance and portfolio metrics</p>
        </div>
        <div className="flex items-center space-x-2 mt-3 md:mt-0">
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="year">Last 12 Months</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
        </div>
      </div>
      
      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Portfolio Value</p>
              <h3 className="text-xl font-bold text-[#09261E]">$2.4M</h3>
              <p className="text-green-600 text-xs flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> 12.5% from last year
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Monthly Cashflow</p>
              <h3 className="text-xl font-bold text-[#09261E]">$8,540</h3>
              <p className="text-green-600 text-xs flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> 3.2% from last month
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
              <Home className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Properties Owned</p>
              <h3 className="text-xl font-bold text-[#09261E]">12</h3>
              <div className="flex">
                <Badge className="bg-green-500 text-xs mr-1">+2</Badge>
                <p className="text-gray-500 text-xs">this year</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="mb-8">
        <Tabs defaultValue="performance">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="performance" className="text-sm">Performance</TabsTrigger>
              <TabsTrigger value="portfolio" className="text-sm">Portfolio</TabsTrigger>
              <TabsTrigger value="metrics" className="text-sm">Metrics</TabsTrigger>
            </TabsList>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-500 text-xs">
                <Share2 className="h-3.5 w-3.5 mr-1" /> Share
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-5">
              <TabsContent value="performance" className="mt-0">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[#09261E]">Investment Performance</h3>
                  <p className="text-sm text-gray-500">Track your portfolio's value over time</p>
                </div>
                <div className="h-[300px]">
                  <AreaChart data={performanceData} height={300} />
                </div>
              </TabsContent>
              
              <TabsContent value="portfolio" className="mt-0">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[#09261E]">Portfolio Composition</h3>
                  <p className="text-sm text-gray-500">Breakdown of your investment by property type</p>
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-center">
                  <div className="w-[200px] h-[200px]">
                    <PieChartComponent data={portfolioComposition} height={200} />
                  </div>
                  <div className="flex flex-col space-y-4 mt-4 lg:mt-0 lg:ml-8">
                    {portfolioComposition.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: item.color }}></div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.value}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="metrics" className="mt-0">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[#09261E]">Key Property Metrics</h3>
                  <p className="text-sm text-gray-500">Analysis of your property investment metrics</p>
                </div>
                <div className="h-[300px]">
                  <BarChart data={propertyMetrics} height={300} />
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
      
      {/* Individual Property Analytics */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#09261E]">Property Analytics</h3>
          <Button variant="ghost" size="sm" className="text-[#09261E] font-medium text-sm">
            View All Properties <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <Badge className="mb-2 bg-green-500">Residential</Badge>
                  <CardTitle className="text-base">123 Main Street</CardTitle>
                  <CardDescription>Single Family Home, 3bd/2ba</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-[#09261E] border-[#09261E] hover:bg-[#09261E] hover:text-white">
                  Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Purchase Price</p>
                    <p className="font-semibold text-[#09261E]">$450,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Value</p>
                    <p className="font-semibold text-[#09261E]">$512,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Equity</p>
                    <p className="font-semibold text-[#09261E]">$92,000</p>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-gray-500 mb-1">Value Appreciation</p>
                  <div className="h-[80px]">
                    <LineChartComponent data={[
                      {name: "2023", value: 450},
                      {name: "2024", value: 475},
                      {name: "2025", value: 512}
                    ]} height={80} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <Badge className="mb-2 bg-blue-500">Commercial</Badge>
                  <CardTitle className="text-base">456 Business Ave</CardTitle>
                  <CardDescription>Office Space, 2,500 sqft</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-[#09261E] border-[#09261E] hover:bg-[#09261E] hover:text-white">
                  Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Purchase Price</p>
                    <p className="font-semibold text-[#09261E]">$780,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Value</p>
                    <p className="font-semibold text-[#09261E]">$805,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cash Flow</p>
                    <p className="font-semibold text-[#09261E]">$4,200/mo</p>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-gray-500 mb-1">Occupancy Rate</p>
                  <div className="h-[80px]">
                    <BarChart data={[
                      {name: "Q1", value: 90},
                      {name: "Q2", value: 100},
                      {name: "Q3", value: 95},
                      {name: "Q4", value: 100}
                    ]} height={80} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}