import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog,
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
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

// Get sorted properties for leaderboard
const getSortedProperties = (metric) => {
  return [...portfolioProperties].sort((a, b) => {
    if (metric === 'cashflow') return b.monthlyRent - a.monthlyRent;
    if (metric === 'appreciation') return b.appreciation - a.appreciation;
    if (metric === 'equity') return b.equity - a.equity;
    if (metric === 'capRate') return b.capRate - a.capRate;
    return 0;
  });
};

// COLORS
const COLORS = ['#135341', '#09261E', '#803344', '#E59F9F', '#D8D8D8'];

export default function AnalyticsTab() {
  const [timeFilter, setTimeFilter] = useState("all");
  const [performanceMetric, setPerformanceMetric] = useState("value");
  const [portfolioBreakdownMetric, setPortfolioBreakdownMetric] = useState("value");
  const [leaderboardMetric, setLeaderboardMetric] = useState("cashflow");
  const [propertyMetricView, setPropertyMetricView] = useState("aggregate");
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showAllProperties, setShowAllProperties] = useState(false);

  // Sort properties by selected metrics for leaderboard
  const sortedProperties = getSortedProperties(leaderboardMetric);

  return (
    <div className="space-y-6">
      {/* Header Metrics */}
      <div className="bg-white pt-3 pb-4 rounded-lg mb-6">
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
            
            <Button variant="outline" size="sm" className="flex items-center gap-1 hover:bg-gray-100 hover:text-[#09261E]">
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
        <TabsList className="w-full bg-[#F8F9FA] p-1 rounded-lg">
          <TabsTrigger value="performance" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm hover:bg-gray-200">
            Performance
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm hover:bg-gray-200">
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="metrics" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm hover:bg-gray-200">
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
                <div className="h-80 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Legend wrapperStyle={{ paddingTop: 15 }} />
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
                <div className="h-72 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
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
                        labelLine={true}
                      >
                        {portfolioByTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: 20 }} />
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
                <div className="space-y-4">
                  <h4 className="font-medium text-[#09261E] mb-2">Top Properties by {leaderboardMetric === 'cashflow' ? 'Monthly Cashflow' : 
                    leaderboardMetric === 'appreciation' ? 'Appreciation Rate' : 
                    leaderboardMetric === 'equity' ? 'Equity' : 'Cap Rate'}</h4>
                  
                  <div className="space-y-2">
                    {sortedProperties.slice(0, 6).map((property, index) => (
                      <div key={property.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className={index < 3 ? "bg-[#09261E] hover:bg-[#09261E]" : "bg-gray-400 hover:bg-gray-400"}>
                              {index + 1}
                            </Badge>
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
                          <Button 
                            variant="outline"
                            size="sm"
                            className="mt-1 text-xs px-2 h-7 hover:bg-gray-100 hover:text-[#09261E]"
                            onClick={() => setSelectedProperty(property)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {sortedProperties.length > 6 && (
                    <div className="flex justify-center mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="hover:bg-gray-100 hover:text-[#09261E]"
                        onClick={() => setShowAllProperties(true)}
                      >
                        View All Properties
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
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
                    <div className="h-64 p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={cashflowData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                    <div className="h-64 p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={appreciationData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
          <Dialog open={showAllProperties} onOpenChange={setShowAllProperties}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="hover:bg-gray-100 hover:text-[#09261E]">View All Properties</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>All Properties</DialogTitle>
                <DialogDescription>Complete portfolio breakdown</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {portfolioProperties.map(property => (
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-1 hover:bg-gray-100 hover:text-[#09261E]"
                        onClick={() => {
                          setSelectedProperty(property);
                          setShowAllProperties(false);
                        }}
                      >
                        View Details
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
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
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2 hover:bg-gray-100 hover:text-[#09261E]"
                      onClick={() => setSelectedProperty(property)}
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                      <DialogTitle>{property.nickname}</DialogTitle>
                      <DialogDescription>{property.address}</DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Financial Summary</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b">
                              <span className="text-sm">Purchase Price</span>
                              <span className="font-bold">${property.purchasePrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b">
                              <span className="text-sm">Current Value</span>
                              <span className="font-bold">${property.currentValue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b">
                              <span className="text-sm">Total Equity</span>
                              <span className="font-bold">${property.equity.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b">
                              <span className="text-sm">Monthly Cashflow</span>
                              <span className="font-bold">${property.monthlyRent.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Appreciation Rate</span>
                              <span className="font-bold">{property.appreciation}%</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Value History</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-[200px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={property.history}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                                  <XAxis dataKey="month" />
                                  <YAxis />
                                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                                  <Line 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#09261E" 
                                    strokeWidth={2}
                                    dot={true}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                      <div className="space-y-3">
                        <Card className="bg-[#F8F9FA]">
                          <CardContent className="p-4">
                            <div className="flex gap-3">
                              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">Refinancing Opportunity</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  Based on current market rates, refinancing could save approximately $340/month.
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-[#F8F9FA]">
                          <CardContent className="p-4">
                            <div className="flex gap-3">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <Home className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">Maintenance Alert</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  HVAC system is due for maintenance in the next 30 days. Schedule service to avoid future costs.
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-[#F8F9FA]">
                          <CardContent className="p-4">
                            <div className="flex gap-3">
                              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <DollarSign className="h-4 w-4 text-amber-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">Rental Price Analysis</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  Current rent is 8% below market rate for similar properties. Consider adjusting at next lease renewal.
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <DialogFooter className="mt-6">
                      <Button variant="outline" className="hover:bg-gray-100 hover:text-[#09261E]">Schedule Maintenance</Button>
                      <Button className="bg-[#09261E] hover:bg-[#135341]">View Full Report</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}