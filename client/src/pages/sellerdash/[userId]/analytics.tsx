import React, { useState } from 'react';
import { useParams } from 'wouter';
import SellerDashboardLayout from '@/components/layout/seller-dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  ArrowRight,
  Eye,
  DollarSign,
  TrendingUp,
  Percent,
  Download,
  Share2,
  Info,
  ChevronDown,
  Building
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SellerDashboardAnalyticsPage() {
  const params = useParams();
  const userId = params.userId;
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '12m' | 'all'>('30d');
  const [propertyFilter, setPropertyFilter] = useState<'all' | 'property'>('all');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  
  // Date range options
  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '12m', label: 'Last 12 months' },
    { value: 'all', label: 'All time' }
  ];
  
  // Property options
  const properties = [
    { id: 1, address: "123 Main Street" },
    { id: 2, address: "456 Oak Avenue" },
    { id: 3, address: "789 Pine Boulevard" }
  ];

  // Analytics card data
  const analyticsCards = [
    {
      title: "Total Views",
      value: "1,248",
      change: "+12.5%",
      positive: true,
      icon: <Eye className="h-5 w-5" />
    },
    {
      title: "Offers Received",
      value: "8",
      change: "+33.3%",
      positive: true,
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      title: "Revenue",
      value: "$1.05M",
      change: "-",
      positive: true,
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.8%",
      positive: true,
      icon: <Percent className="h-5 w-5" />
    }
  ];
  
  // Chart placeholder component
  const ChartPlaceholder = ({ type }: { type: 'bar' | 'line' | 'pie' }) => (
    <div className="bg-gray-50 border rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px]">
      {type === 'bar' && <BarChart3 className="h-12 w-12 text-gray-300 mb-4" />}
      {type === 'line' && <LineChart className="h-12 w-12 text-gray-300 mb-4" />}
      {type === 'pie' && <PieChart className="h-12 w-12 text-gray-300 mb-4" />}
      <p className="text-gray-500 text-center">Chart visualization placeholder</p>
      <p className="text-gray-400 text-sm text-center mt-2">
        In a real implementation, this would show a {type === 'bar' ? 'bar' : type === 'line' ? 'line' : 'pie'} chart 
        visualizing your data based on the selected filters.
      </p>
    </div>
  );
  
  // Property performance chart component
  const PropertyPerformanceChart = ({ chartType }: { chartType: 'bar' | 'line' | 'pie' }) => (
    <Card className="col-span-3">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-lg">Property Performance</CardTitle>
            <CardDescription>Compare metrics across your listings</CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={chartType === 'bar' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartType('bar')}
              className={chartType === 'bar' ? 'bg-[#135341] text-white' : ''}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Bar
            </Button>
            <Button 
              variant={chartType === 'line' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartType('line')}
              className={chartType === 'line' ? 'bg-[#135341] text-white' : ''}
            >
              <LineChart className="h-4 w-4 mr-1" />
              Line
            </Button>
            <Button 
              variant={chartType === 'pie' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartType('pie')}
              className={chartType === 'pie' ? 'bg-[#135341] text-white' : ''}
            >
              <PieChart className="h-4 w-4 mr-1" />
              Pie
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ChartPlaceholder type={chartType} />
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        <div>
          <Button variant="outline" size="sm" className="mr-2">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
        
        <Button variant="link" size="sm" className="text-[#135341]">
          View Detailed Report
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
  
  // Analytics filter toolbar
  const AnalyticsToolbar = () => (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div>
        <h2 className="text-xl font-bold text-[#135341] flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Analytics Dashboard
        </h2>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="min-w-[140px] flex justify-between">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{dateRangeOptions.find(opt => opt.value === dateRange)?.label}</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Date Range</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {dateRangeOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  className={dateRange === option.value ? "bg-[#135341]/10 text-[#135341] font-medium" : ""}
                  onClick={() => setDateRange(option.value as any)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="min-w-[140px] flex justify-between">
                <Building className="h-4 w-4 mr-1" />
                <span>{propertyFilter === 'all' ? 'All Properties' : 'Select Property'}</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Property Filter</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={propertyFilter === 'all' ? "bg-[#135341]/10 text-[#135341] font-medium" : ""}
                onClick={() => setPropertyFilter('all')}
              >
                All Properties
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {properties.map((property) => (
                <DropdownMenuItem
                  key={property.id}
                  onClick={() => setPropertyFilter('property')}
                >
                  {property.address}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );

  return (
    <SellerDashboardLayout userId={userId}>
      <AnalyticsToolbar />
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {analyticsCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    {card.title}
                    <button className="ml-1 text-gray-400 hover:text-gray-600">
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                  
                  {card.change !== "-" && (
                    <p className={`text-xs mt-1 flex items-center ${card.positive ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendingUp className={`h-3 w-3 mr-0.5 ${card.positive ? '' : 'transform rotate-180'}`} />
                      {card.change} vs. previous period
                    </p>
                  )}
                </div>
                
                <div className="h-12 w-12 bg-[#135341]/10 rounded-full flex items-center justify-center text-[#135341]">
                  {card.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <PropertyPerformanceChart chartType={chartType} />
      </div>
      
      {/* Additional Data Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Metrics Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Engagement Metrics</CardTitle>
            <CardDescription>Detailed breakdown of user interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 border rounded-lg p-4">
                <p className="text-center text-gray-500">Engagement metrics placeholder</p>
                <p className="text-center text-gray-400 text-sm mt-2">
                  This would show detailed stats about profile views, contact requests,
                  message response times, etc.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Pricing Analysis Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pricing Analysis</CardTitle>
            <CardDescription>Compare your pricing to market conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 border rounded-lg p-4">
                <p className="text-center text-gray-500">Pricing analysis placeholder</p>
                <p className="text-center text-gray-400 text-sm mt-2">
                  This would show comparative analysis of your listing prices versus
                  similar properties in the area.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SellerDashboardLayout>
  );
}