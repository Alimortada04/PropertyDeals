import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  BarChart, 
  Bar 
} from "recharts";
import { 
  ArrowRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Calendar, 
  BarChart3, 
  DollarSign, 
  Home, 
  TrendingUp,
  PieChart as PieChartIcon
} from "lucide-react";

// Mock data for portfolio properties
const portfolioProperties = [
  {
    id: 1,
    address: "123 Main St",
    nickname: "Downtown Condo",
    type: "Residential",
    purchasePrice: 350000,
    currentValue: 425000,
    equity: 125000,
    monthlyRent: 2200,
    appreciation: 21.4,
    capRate: 7.5,
    occupancy: 100,
    history: [
      { month: "Jan", value: 400000 },
      { month: "Feb", value: 405000 },
      { month: "Mar", value: 410000 },
      { month: "Apr", value: 415000 },
      { month: "May", value: 420000 },
      { month: "Jun", value: 425000 },
    ]
  },
  {
    id: 2,
    address: "456 Oak Ave",
    nickname: "Suburban Duplex",
    type: "Residential",
    purchasePrice: 420000,
    currentValue: 485000,
    equity: 95000,
    monthlyRent: 3400,
    appreciation: 15.5,
    capRate: 9.7,
    occupancy: 100,
    history: [
      { month: "Jan", value: 460000 },
      { month: "Feb", value: 465000 },
      { month: "Mar", value: 470000 },
      { month: "Apr", value: 475000 },
      { month: "May", value: 480000 },
      { month: "Jun", value: 485000 },
    ]
  },
  {
    id: 3,
    address: "789 Pine Blvd",
    nickname: "Retail Space",
    type: "Commercial",
    purchasePrice: 780000,
    currentValue: 850000,
    equity: 120000,
    monthlyRent: 7800,
    appreciation: 9.0,
    capRate: 11.0,
    occupancy: 85,
    history: [
      { month: "Jan", value: 820000 },
      { month: "Feb", value: 825000 },
      { month: "Mar", value: 830000 },
      { month: "Apr", value: 835000 },
      { month: "May", value: 845000 },
      { month: "Jun", value: 850000 },
    ]
  },
  {
    id: 4,
    address: "555 Elm St",
    nickname: "City Apartment",
    type: "Residential",
    purchasePrice: 290000,
    currentValue: 310000,
    equity: 45000,
    monthlyRent: 1950,
    appreciation: 6.9,
    capRate: 7.5,
    occupancy: 100,
    history: [
      { month: "Jan", value: 298000 },
      { month: "Feb", value: 300000 },
      { month: "Mar", value: 302000 },
      { month: "Apr", value: 305000 },
      { month: "May", value: 308000 },
      { month: "Jun", value: 310000 },
    ]
  },
  {
    id: 5,
    address: "222 Office Park",
    nickname: "Office Building",
    type: "Commercial",
    purchasePrice: 850000,
    currentValue: 905000,
    equity: 155000,
    monthlyRent: 9500,
    appreciation: 6.5,
    capRate: 12.6,
    occupancy: 90,
    history: [
      { month: "Jan", value: 880000 },
      { month: "Feb", value: 885000 },
      { month: "Mar", value: 890000 },
      { month: "Apr", value: 895000 },
      { month: "May", value: 900000 },
      { month: "Jun", value: 905000 },
    ]
  }
];

// Calculate portfolio metrics
const portfolioMetrics = {
  totalValue: portfolioProperties.reduce((sum, property) => sum + property.currentValue, 0),
  totalEquity: portfolioProperties.reduce((sum, property) => sum + property.equity, 0),
  monthlyCashflow: portfolioProperties.reduce((sum, property) => sum + property.monthlyRent, 0),
  propertyCount: portfolioProperties.length,
  valueGrowthYoY: 11.2, // Example percentage
  cashflowGrowthMoM: 3.8, // Example percentage
  propertiesAddedThisYear: 2,
};

// Prepare Chart Data
const lineChartData = portfolioProperties.reduce((data, property) => {
  property.history.forEach((historyItem, index) => {
    if (!data[index]) {
      data[index] = { month: historyItem.month };
    }
    data[index][property.nickname] = historyItem.value;
    if (!data[index].totalValue) {
      data[index].totalValue = 0;
    }
    data[index].totalValue += historyItem.value;
  });
  return data;
}, []);

// Portfolio breakdown by type
const portfolioByTypeData = [
  { name: 'Residential', value: portfolioProperties.filter(p => p.type === 'Residential').reduce((sum, p) => sum + p.currentValue, 0) },
  { name: 'Commercial', value: portfolioProperties.filter(p => p.type === 'Commercial').reduce((sum, p) => sum + p.currentValue, 0) },
  { name: 'Land', value: portfolioProperties.filter(p => p.type === 'Land').reduce((sum, p) => sum + p.currentValue, 0) }
];

// Prepare property metrics for bar charts
const cashflowData = portfolioProperties.map(property => ({
  name: property.nickname,
  value: property.monthlyRent
})).sort((a, b) => b.value - a.value);

const appreciationData = portfolioProperties.map(property => ({
  name: property.nickname,
  value: property.appreciation
})).sort((a, b) => b.value - a.value);

// Get top and bottom performers
const getTopPerformers = (metric) => {
  const sortedProperties = [...portfolioProperties].sort((a, b) => {
    if (metric === 'cashflow') return b.monthlyRent - a.monthlyRent;
    if (metric === 'appreciation') return b.appreciation - a.appreciation;
    if (metric === 'equity') return b.equity - a.equity;
    if (metric === 'capRate') return b.capRate - a.capRate;
    return 0;
  });
  
  return {
    top: sortedProperties.slice(0, 3),
    bottom: sortedProperties.slice(-3).reverse()
  };
};

// COLORS
const COLORS = ['#135341', '#09261E', '#803344', '#E59F9F', '#D8D8D8'];

export default function AnalyticsTab() {
  const [timeFilter, setTimeFilter] = useState("all");
  const [performanceMetric, setPerformanceMetric] = useState("value");
  const [portfolioBreakdownMetric, setPortfolioBreakdownMetric] = useState("value");
  const [leaderboardMetric, setLeaderboardMetric] = useState("cashflow");
  const [propertyMetricView, setPropertyMetricView] = useState("aggregate");

  // Sort properties by selected metrics for leaderboard
  const performers = getTopPerformers(leaderboardMetric);

  return (
    <div className="space-y-6">
      {/* Sticky Header Metrics */}
      <div className="sticky top-0 z-10 bg-white pt-2 pb-4 border-b shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#09261E] mb-2 md:mb-0">Portfolio Analytics</h3>
          
          <div className="flex flex-wrap items-center gap-2">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="ytd">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Portfolio Value */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Portfolio Value</p>
                  <h3 className="text-2xl font-bold">${(portfolioMetrics.totalValue / 1000000).toFixed(1)}M</h3>
                  <div className="flex items-center mt-1">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs mr-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {portfolioMetrics.valueGrowthYoY}%
                    </Badge>
                    <span className="text-xs text-gray-500">Year over Year</span>
                  </div>
                </div>
                <div className="h-10 w-10 bg-[#09261E]/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-[#09261E]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Monthly Cashflow */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Monthly Cashflow</p>
                  <h3 className="text-2xl font-bold">${portfolioMetrics.monthlyCashflow.toLocaleString()}</h3>
                  <div className="flex items-center mt-1">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs mr-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {portfolioMetrics.cashflowGrowthMoM}%
                    </Badge>
                    <span className="text-xs text-gray-500">Month over Month</span>
                  </div>
                </div>
                <div className="h-10 w-10 bg-[#09261E]/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-[#09261E]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Properties Owned */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Properties Owned</p>
                  <h3 className="text-2xl font-bold">{portfolioMetrics.propertyCount}</h3>
                  <div className="flex items-center mt-1">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs mr-1">
                      +{portfolioMetrics.propertiesAddedThisYear}
                    </Badge>
                    <span className="text-xs text-gray-500">This Year</span>
                  </div>
                </div>
                <div className="h-10 w-10 bg-[#09261E]/10 rounded-full flex items-center justify-center">
                  <Home className="h-5 w-5 text-[#09261E]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Tabs System */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="w-full bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="performance" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Performance
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="metrics" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Metrics
          </TabsTrigger>
        </TabsList>
        
        {/* Performance Tab Content */}
        <TabsContent value="performance" className="mt-4">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Portfolio Value Over Time</CardTitle>
                  <Select value={performanceMetric} onValueChange={setPerformanceMetric}>
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="value">Value</SelectItem>
                      <SelectItem value="cashflow">Cashflow</SelectItem>
                      <SelectItem value="equity">Equity</SelectItem>
                      <SelectItem value="occupancy">Occupancy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="totalValue" 
                        stroke="#09261E" 
                        strokeWidth={2} 
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Forecasts</CardTitle>
                <CardDescription>Projected metrics based on current trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-1">Projected Year-End Value</h4>
                    <p className="text-xl font-bold text-[#09261E]">$2.8M</p>
                    <p className="text-xs text-gray-500 mt-1">+14.5% from current</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-1">Est. Next Month Cashflow</h4>
                    <p className="text-xl font-bold text-[#09261E]">$9,120</p>
                    <p className="text-xs text-gray-500 mt-1">+6.8% from current</p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-1">Alerts</h4>
                    <p className="text-sm font-medium text-orange-700">1 unit expected to go vacant next month</p>
                    <p className="text-xs text-orange-600 mt-1">Commercial tenant contract expiring</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Portfolio Tab Content */}
        <TabsContent value="portfolio" className="mt-4">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Portfolio Breakdown</CardTitle>
                    <CardDescription>Distribution by property type</CardDescription>
                  </div>
                  <Select value={portfolioBreakdownMetric} onValueChange={setPortfolioBreakdownMetric}>
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="value">Value %</SelectItem>
                      <SelectItem value="units">Units</SelectItem>
                      <SelectItem value="properties">Property Count</SelectItem>
                      <SelectItem value="cashflow">Cashflow %</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={portfolioByTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {portfolioByTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Legend verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Property Leaderboard</CardTitle>
                    <CardDescription>Top and bottom performers</CardDescription>
                  </div>
                  <Select value={leaderboardMetric} onValueChange={setLeaderboardMetric}>
                    <SelectTrigger className="w-[160px] h-8">
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cashflow">Monthly Cashflow</SelectItem>
                      <SelectItem value="appreciation">Appreciation</SelectItem>
                      <SelectItem value="equity">Equity</SelectItem>
                      <SelectItem value="capRate">Cap Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-[#09261E] mb-2">Top 3 Properties</h4>
                    <div className="space-y-2">
                      {performers.top.map((property, index) => (
                        <div key={property.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-[#09261E] hover:bg-[#09261E]">{index + 1}</Badge>
                              <h5 className="font-medium">{property.nickname}</h5>
                            </div>
                            <p className="text-xs text-gray-500">{property.address}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {leaderboardMetric === 'cashflow' && `$${property.monthlyRent.toLocaleString()}`}
                              {leaderboardMetric === 'appreciation' && `${property.appreciation}%`}
                              {leaderboardMetric === 'equity' && `$${property.equity.toLocaleString()}`}
                              {leaderboardMetric === 'capRate' && `${property.capRate}%`}
                            </p>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                              Top Performer
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-[#09261E] mb-2">Bottom 3 Properties</h4>
                    <div className="space-y-2">
                      {performers.bottom.map((property, index) => (
                        <div key={property.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-gray-400 hover:bg-gray-400">{performers.top.length + index + 1}</Badge>
                              <h5 className="font-medium">{property.nickname}</h5>
                            </div>
                            <p className="text-xs text-gray-500">{property.address}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {leaderboardMetric === 'cashflow' && `$${property.monthlyRent.toLocaleString()}`}
                              {leaderboardMetric === 'appreciation' && `${property.appreciation}%`}
                              {leaderboardMetric === 'equity' && `$${property.equity.toLocaleString()}`}
                              {leaderboardMetric === 'capRate' && `${property.capRate}%`}
                            </p>
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs">
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                              Needs Attention
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Metrics Tab Content */}
        <TabsContent value="metrics" className="mt-4">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Property Metrics</CardTitle>
                    <CardDescription>Key performance indicators by property</CardDescription>
                  </div>
                  <Select value={propertyMetricView} onValueChange={setPropertyMetricView}>
                    <SelectTrigger className="w-[160px] h-8">
                      <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aggregate">Aggregate View</SelectItem>
                      <SelectItem value="breakdown">Property Breakdown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-[#09261E] mb-2">Monthly Cashflow</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={cashflowData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                          <Bar dataKey="value" fill="#09261E" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-[#09261E] mb-2">Appreciation (%)</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={appreciationData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                          <Bar dataKey="value" fill="#135341" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Property Analytics Cards */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#09261E]">Property Analytics</h3>
          <Button variant="outline" size="sm">View All Properties</Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolioProperties.slice(0, 3).map(property => (
            <Card key={property.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{property.nickname}</CardTitle>
                    <p className="text-xs text-gray-500">{property.address}</p>
                  </div>
                  <Badge 
                    className={`${
                      property.type === 'Residential' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : 
                      property.type === 'Commercial' ? 'bg-purple-100 text-purple-800 hover:bg-purple-100' : 
                      'bg-green-100 text-green-800 hover:bg-green-100'
                    }`}
                  >
                    {property.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Purchase</p>
                    <p className="font-bold">${(property.purchasePrice / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Current</p>
                    <p className="font-bold">${(property.currentValue / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Equity</p>
                    <p className="font-bold">${(property.equity / 1000).toFixed(0)}K</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {property.type === 'Residential' ? (
                    <>
                      <div>
                        <p className="text-xs text-gray-500">Apprec.</p>
                        <p className="font-bold">{property.appreciation}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Rent</p>
                        <p className="font-bold">${property.monthlyRent}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Cap Rate</p>
                        <p className="font-bold">{property.capRate}%</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-xs text-gray-500">Occupancy</p>
                        <p className="font-bold">{property.occupancy}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">NOI</p>
                        <p className="font-bold">${property.monthlyRent * 12 * 0.7}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Cap Rate</p>
                        <p className="font-bold">{property.capRate}%</p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={property.history}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#09261E" 
                        strokeWidth={2}
                        dot={false}
                      />
                      <XAxis dataKey="month" hide={true} />
                      <YAxis domain={['dataMin - 10000', 'dataMax + 10000']} hide={true} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View Details
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}