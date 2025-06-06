import React, { useState } from 'react';
import { useParams } from 'wouter';
import SellerDashboardLayout from '@/components/layout/seller-dashboard-layout';
import { useMarketingCenterModal } from '@/hooks/use-marketing-center-modal';
import { MarketingCenterModal } from '@/components/seller/marketing-center-modal';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  LineChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Eye, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  HelpCircle, 
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Megaphone,
  Handshake,
  Zap
} from 'lucide-react';

// Mock data for analytics
const PERFORMANCE_DATA = [
  { month: 'Jan', views: 120, offers: 5, revenue: 0 },
  { month: 'Feb', views: 180, offers: 8, revenue: 12500 },
  { month: 'Mar', views: 250, offers: 12, revenue: 25000 },
  { month: 'Apr', views: 310, offers: 15, revenue: 45000 },
  { month: 'May', views: 420, offers: 18, revenue: 60000 },
];

const PROPERTY_PERFORMANCE = [
  { 
    id: 'prop1',
    name: 'Colonial Revival',
    totalViews: 1250,
    totalOffers: 8,
    revenue: 32500,
    avgTimeToOffer: 14,
    conversionRate: 0.64,
    monthlyData: [
      { month: 'Jan', views: 180, offers: 2 },
      { month: 'Feb', views: 220, offers: 1 },
      { month: 'Mar', views: 280, offers: 2 },
      { month: 'Apr', views: 320, offers: 1 },
      { month: 'May', views: 250, offers: 2 },
    ]
  },
  { 
    id: 'prop2',
    name: 'Modern Farmhouse',
    totalViews: 980,
    totalOffers: 6,
    revenue: 27500,
    avgTimeToOffer: 18,
    conversionRate: 0.61,
    monthlyData: [
      { month: 'Jan', views: 120, offers: 1 },
      { month: 'Feb', views: 190, offers: 1 },
      { month: 'Mar', views: 210, offers: 2 },
      { month: 'Apr', views: 240, offers: 1 },
      { month: 'May', views: 220, offers: 1 },
    ]
  },
  { 
    id: 'prop3',
    name: 'Suburban Ranch',
    totalViews: 870,
    totalOffers: 4,
    revenue: 0,
    avgTimeToOffer: 22,
    conversionRate: 0.46,
    monthlyData: [
      { month: 'Jan', views: 90, offers: 0 },
      { month: 'Feb', views: 150, offers: 1 },
      { month: 'Mar', views: 180, offers: 1 },
      { month: 'Apr', views: 210, offers: 1 },
      { month: 'May', views: 240, offers: 1 },
    ]
  },
];

// Tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-md">
        <p className="font-medium text-gray-700">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.name === 'Revenue' ? `$${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const params = useParams();
  const userId = params.userId || '';
  const [dateRange, setDateRange] = useState('last6Months');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState(PROPERTY_PERFORMANCE[0]);
  const marketingModal = useMarketingCenterModal();
  
  // Calculate summary metrics
  const totalViews = PROPERTY_PERFORMANCE.reduce((sum, prop) => sum + prop.totalViews, 0);
  const totalOffers = PROPERTY_PERFORMANCE.reduce((sum, prop) => sum + prop.totalOffers, 0);
  const totalRevenue = PROPERTY_PERFORMANCE.reduce((sum, prop) => sum + prop.revenue, 0);
  const averageConversion = PROPERTY_PERFORMANCE.reduce((sum, prop) => sum + prop.conversionRate, 0) / 
    PROPERTY_PERFORMANCE.length;
  
  // Percent change calculations (mock data)
  const viewsChange = 12.5; // 12.5% increase
  const offersChange = 8.3; // 8.3% increase
  const revenueChange = 15.2; // 15.2% increase
  const conversionChange = -2.1; // 2.1% decrease
  
  return (
    <SellerDashboardLayout userId={userId}>
      <div className="space-y-6">
        {/* Page header with filters */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="last3Months">Last 3 Months</SelectItem>
                <SelectItem value="last6Months">Last 6 Months</SelectItem>
                <SelectItem value="lastYear">Last Year</SelectItem>
                <SelectItem value="allTime">All Time</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={propertyFilter} onValueChange={setPropertyFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {PROPERTY_PERFORMANCE.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Views Card */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <div className="flex items-center pt-1 text-xs">
                <span className={`flex items-center ${viewsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {viewsChange >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {Math.abs(viewsChange)}%
                </span>
                <span className="text-gray-500 ml-2">vs. previous period</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Total Offers Card */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOffers}</div>
              <div className="flex items-center pt-1 text-xs">
                <span className={`flex items-center ${offersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {offersChange >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {Math.abs(offersChange)}%
                </span>
                <span className="text-gray-500 ml-2">vs. previous period</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Revenue Card */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <div className="flex items-center pt-1 text-xs">
                <span className={`flex items-center ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {revenueChange >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {Math.abs(revenueChange)}%
                </span>
                <span className="text-gray-500 ml-2">vs. previous period</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Conversion Rate Card */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(averageConversion * 100).toFixed(1)}%</div>
              <div className="flex items-center pt-1 text-xs">
                <span className={`flex items-center ${conversionChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {conversionChange >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {Math.abs(conversionChange)}%
                </span>
                <span className="text-gray-500 ml-2">vs. previous period</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Performance Charts */}
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex justify-between items-center mb-4">
              <CardTitle>Overall Performance</CardTitle>
              <div className="flex items-center gap-1">
                <HelpCircle className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Hover for details</span>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={PERFORMANCE_DATA}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ marginTop: 10 }} />
                  <Bar yAxisId="left" dataKey="views" name="Views" fill="#8884d8" />
                  <Bar yAxisId="left" dataKey="offers" name="Offers" fill="#4CAF50" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue" stroke="#ff7300" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Property-specific analytics */}
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="performance">Property Performance</TabsTrigger>
              <TabsTrigger value="comparison">Property Comparison</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Property Details</h3>
                <Select 
                  value={selectedProperty.id} 
                  onValueChange={(value) => setSelectedProperty(
                    PROPERTY_PERFORMANCE.find(p => p.id === value) || PROPERTY_PERFORMANCE[0]
                  )}
                >
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_PERFORMANCE.map(property => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedProperty.totalViews.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedProperty.totalOffers}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Time to Offer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedProperty.avgTimeToOffer} days</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{(selectedProperty.conversionRate * 100).toFixed(1)}%</div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="p-5">
                <CardTitle className="mb-5">Monthly Performance</CardTitle>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={selectedProperty.monthlyData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ marginTop: 10 }} />
                      <Line type="monotone" dataKey="views" name="Views" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="offers" name="Offers" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="comparison" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Property Comparison</h3>
                <Button variant="outline" className="gap-1">
                  <Info className="h-4 w-4" />
                  How to interpret
                </Button>
              </div>
              
              <Card className="p-5">
                <CardTitle className="mb-5">Views by Property</CardTitle>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={PROPERTY_PERFORMANCE}
                      margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ marginTop: 10 }} />
                      <Bar dataKey="totalViews" name="Total Views" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-5">
                <CardTitle className="mb-5">Conversion Rate by Property</CardTitle>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={PROPERTY_PERFORMANCE}
                      margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                      <Tooltip 
                        formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Conversion Rate']}
                        labelFormatter={(label) => `Property: ${label}`}
                      />
                      <Legend wrapperStyle={{ marginTop: 10 }} />
                      <Bar dataKey="conversionRate" name="Conversion Rate" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              {/* Quick Actions Section */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-[#09261E]" />
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    className="w-full bg-[#09261E] hover:bg-[#135341] text-white h-12"
                    onClick={() => {
                      marketingModal.onOpen();
                    }}
                  >
                    <Megaphone className="h-4 w-4 mr-2" />
                    Launch Campaign
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full border-[#09261E] text-[#09261E] hover:bg-[#09261E] hover:text-white h-12"
                    onClick={() => {
                      marketingModal.onOpen();
                    }}
                  >
                    <Handshake className="h-4 w-4 mr-2" />
                    JV this Deal
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <MarketingCenterModal 
        isOpen={marketingModal.isOpen} 
        onClose={marketingModal.onClose} 
      />
    </SellerDashboardLayout>
  );
}