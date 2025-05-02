import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart4,
  PieChart,
  TrendingUp,
  Target,
  DollarSign,
  Home,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Heart,
  Clock,
  Briefcase,
  FileText,
  ChevronRight
} from "lucide-react";
import { Link, useLocation } from "wouter";

// Import mock visualization components
// In a real app, you'd use a chart library like recharts
import {
  BarChart,
  LineChart,
  AreaChart,
  PieChartComponent
} from "@/components/charts/mock-charts";

// Import data
import { properties, savedProperties, offersSubmitted } from "@/data/properties";

export default function DashboardAnalyticsTab() {
  const [, setLocation] = useLocation();
  const [timeframe, setTimeframe] = useState("1m");
  
  // Mock analytics data
  const analyticsData = {
    totalViewed: 47,
    totalFavorites: 15,
    totalOffers: 3,
    avgTimeToOffer: "6.5 days",
    totalDeals: 2,
    viewsChange: 12,
    favoritesChange: 5,
    offersChange: -1,
    dealsChange: 1,
    averageROI: "18.4%",
    investmentGoals: {
      target: 5,
      current: 2
    },
    marketFocus: [
      { area: "Milwaukee", percentage: 60 },
      { area: "Madison", percentage: 25 },
      { area: "Green Bay", percentage: 15 }
    ],
    propertyTypes: [
      { type: "Single Family", percentage: 50 },
      { type: "Multi-Family", percentage: 30 },
      { type: "Condo", percentage: 20 }
    ],
    priceRanges: [
      { range: "$100k-$300k", percentage: 35 },
      { range: "$300k-$500k", percentage: 45 },
      { range: "$500k+", percentage: 20 }
    ],
    monthlyViews: [
      { month: "Jan", count: 15 },
      { month: "Feb", count: 20 },
      { month: "Mar", count: 18 },
      { month: "Apr", count: 35 },
      { month: "May", count: 47 }
    ],
    monthlyOffers: [
      { month: "Jan", count: 0 },
      { month: "Feb", count: 1 },
      { month: "Mar", count: 0 },
      { month: "Apr", count: 3 },
      { month: "May", count: 2 }
    ]
  };
  
  // Mock trending properties data
  const trendingProperties = [
    {
      id: 1,
      title: properties[0].title,
      address: properties[0].address,
      image: properties[0].imageUrl,
      price: properties[0].price,
      views: 124,
      favorites: 18,
      viewsChange: 24,
      favoritesChange: 6
    },
    {
      id: 2,
      title: properties[3].title,
      address: properties[3].address,
      image: properties[3].imageUrl,
      price: properties[3].price,
      views: 98,
      favorites: 12,
      viewsChange: 15,
      favoritesChange: 4
    },
    {
      id: 3,
      title: properties[1].title,
      address: properties[1].address,
      image: properties[1].imageUrl,
      price: properties[1].price,
      views: 87,
      favorites: 8,
      viewsChange: 10,
      favoritesChange: 3
    }
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#09261E] mb-1">Analytics & Insights</h2>
        <p className="text-gray-600">Track your investment performance and market activity</p>
      </div>
      
      {/* Time Range Selector */}
      <div className="flex justify-end mb-6">
        <Tabs defaultValue="1m" value={timeframe} onValueChange={setTimeframe}>
          <TabsList>
            <TabsTrigger value="7d">7D</TabsTrigger>
            <TabsTrigger value="1m">1M</TabsTrigger>
            <TabsTrigger value="3m">3M</TabsTrigger>
            <TabsTrigger value="1y">1Y</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Listings Viewed</p>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold text-[#09261E] mr-2">{analyticsData.totalViewed}</h3>
                  <div className={`flex items-center text-xs font-medium ${
                    analyticsData.viewsChange >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {analyticsData.viewsChange >= 0
                      ? <ArrowUpRight className="h-3 w-3 mr-1" />
                      : <ArrowDownRight className="h-3 w-3 mr-1" />
                    }
                    {Math.abs(analyticsData.viewsChange)}%
                  </div>
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-md">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Saved Properties</p>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold text-[#09261E] mr-2">{analyticsData.totalFavorites}</h3>
                  <div className={`flex items-center text-xs font-medium ${
                    analyticsData.favoritesChange >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {analyticsData.favoritesChange >= 0
                      ? <ArrowUpRight className="h-3 w-3 mr-1" />
                      : <ArrowDownRight className="h-3 w-3 mr-1" />
                    }
                    {Math.abs(analyticsData.favoritesChange)}%
                  </div>
                </div>
              </div>
              <div className="p-2 bg-red-100 rounded-md">
                <Heart className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Offers Submitted</p>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold text-[#09261E] mr-2">{analyticsData.totalOffers}</h3>
                  <div className={`flex items-center text-xs font-medium ${
                    analyticsData.offersChange >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {analyticsData.offersChange >= 0
                      ? <ArrowUpRight className="h-3 w-3 mr-1" />
                      : <ArrowDownRight className="h-3 w-3 mr-1" />
                    }
                    {Math.abs(analyticsData.offersChange)}
                  </div>
                </div>
              </div>
              <div className="p-2 bg-purple-100 rounded-md">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Deals Closed</p>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold text-[#09261E] mr-2">{analyticsData.totalDeals}</h3>
                  <div className={`flex items-center text-xs font-medium ${
                    analyticsData.dealsChange >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {analyticsData.dealsChange >= 0
                      ? <ArrowUpRight className="h-3 w-3 mr-1" />
                      : <ArrowDownRight className="h-3 w-3 mr-1" />
                    }
                    {Math.abs(analyticsData.dealsChange)}
                  </div>
                </div>
              </div>
              <div className="p-2 bg-green-100 rounded-md">
                <Briefcase className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-8">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-[#09261E]">Activity Over Time</CardTitle>
                  <CardDescription>Track your engagement with properties</CardDescription>
                </div>
                <Tabs defaultValue="views" className="w-[200px]">
                  <TabsList className="w-full">
                    <TabsTrigger value="views" className="flex-1">Views</TabsTrigger>
                    <TabsTrigger value="favorites" className="flex-1">Saved</TabsTrigger>
                    <TabsTrigger value="offers" className="flex-1">Offers</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[300px] w-full">
                <AreaChart 
                  data={analyticsData.monthlyViews.map(m => ({ name: m.month, value: m.count }))} 
                  height={300}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-[#09261E]">Investment Goals</CardTitle>
              <CardDescription>Progress towards your targets</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-[#09261E]">Properties Acquired</h4>
                    <span className="text-sm text-gray-500">{analyticsData.investmentGoals.current}/{analyticsData.investmentGoals.target}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#09261E] rounded-full" 
                      style={{ width: `${(analyticsData.investmentGoals.current / analyticsData.investmentGoals.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-[#09261E] mb-2">Average ROI Target</h4>
                  <div className="flex items-center">
                    <div className="w-16 h-16 mr-4">
                      <PieChartComponent 
                        data={[
                          { name: 'Achieved', value: 18.4, color: '#09261E' },
                          { name: 'Target', value: 1.6, color: '#EAF2EF' }
                        ]}
                        height={64}
                      />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#09261E]">{analyticsData.averageROI}</div>
                      <div className="text-xs text-gray-500">vs 20% target</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-[#09261E] mb-2">Avg Days to Offer</h4>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-[#09261E] mr-3" />
                    <div>
                      <div className="text-lg font-semibold text-[#09261E]">{analyticsData.avgTimeToOffer}</div>
                      <div className="text-xs text-gray-500">vs 8.2 days platform avg</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Portfolio Mix & Property Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-[#09261E]">Portfolio Mix</CardTitle>
            <CardDescription>Breakdown of your investment strategy</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-[#09261E] mb-3">Property Types</h4>
                <div className="h-[150px]">
                  <PieChartComponent 
                    data={analyticsData.propertyTypes.map(item => ({
                      name: item.type,
                      value: item.percentage,
                      color: item.type === 'Single Family' ? '#09261E' :
                             item.type === 'Multi-Family' ? '#135341' : '#803344'
                    }))}
                    height={150}
                  />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#09261E] mb-3">Price Ranges</h4>
                <div className="h-[150px]">
                  <BarChart 
                    data={analyticsData.priceRanges.map(item => ({
                      name: item.range,
                      value: item.percentage
                    }))} 
                    height={150}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-[#09261E] mb-3">Market Focus</h4>
              <div className="space-y-3">
                {analyticsData.marketFocus.map((area, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">{area.area}</span>
                      <span className="text-sm text-gray-500">{area.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#09261E] rounded-full" 
                        style={{ width: `${area.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg text-[#09261E]">Trending Properties</CardTitle>
                <CardDescription>Most viewed and favorited listings</CardDescription>
              </div>
              <Button 
                variant="link" 
                className="text-[#09261E] hover:text-[#803344]"
                onClick={() => setLocation('/analytics/properties')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4 pb-2">
            <div className="space-y-4">
              {trendingProperties.map((property) => (
                <div 
                  key={property.id}
                  className="flex space-x-3 pb-4 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 rounded-md p-2 transition-colors"
                  onClick={() => setLocation(`/properties/${property.id}`)}
                >
                  <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={property.image} 
                      alt={property.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-[#09261E] text-sm truncate">{property.title}</h4>
                    <p className="text-xs text-gray-500 truncate mb-1">{property.address}</p>
                    <p className="text-[#09261E] font-semibold text-sm mb-1">${property.price.toLocaleString()}</p>
                    
                    <div className="flex text-xs text-gray-500 space-x-3">
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        <span>{property.views}</span>
                        <span className={`ml-1 text-xs ${
                          property.viewsChange > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {property.viewsChange > 0 ? '+' : ''}{property.viewsChange}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        <span>{property.favorites}</span>
                        <span className={`ml-1 text-xs ${
                          property.favoritesChange > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {property.favoritesChange > 0 ? '+' : ''}{property.favoritesChange}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Comparative Analysis */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-[#09261E]">You vs Platform Average</CardTitle>
          <CardDescription>How your activity compares to other buyers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Properties Viewed / Month</h4>
              <div className="flex items-end gap-2">
                <div className="bg-[#09261E] w-8 rounded-t-sm h-[80px]"></div>
                <div className="bg-gray-200 w-8 rounded-t-sm h-[60px]"></div>
                <div className="text-xs text-gray-500 pb-1">
                  <div className="font-medium text-base text-[#09261E]">23.5</div>
                  vs 17.8
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Saved Rate</h4>
              <div className="flex items-end gap-2">
                <div className="bg-[#09261E] w-8 rounded-t-sm h-[60px]"></div>
                <div className="bg-gray-200 w-8 rounded-t-sm h-[70px]"></div>
                <div className="text-xs text-gray-500 pb-1">
                  <div className="font-medium text-base text-[#09261E]">32%</div>
                  vs 38%
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Time to Offer</h4>
              <div className="flex items-end gap-2">
                <div className="bg-[#09261E] w-8 rounded-t-sm h-[50px]"></div>
                <div className="bg-gray-200 w-8 rounded-t-sm h-[70px]"></div>
                <div className="text-xs text-gray-500 pb-1">
                  <div className="font-medium text-base text-[#09261E]">6.5 days</div>
                  vs 8.2 days
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Offer Success Rate</h4>
              <div className="flex items-end gap-2">
                <div className="bg-[#09261E] w-8 rounded-t-sm h-[90px]"></div>
                <div className="bg-gray-200 w-8 rounded-t-sm h-[60px]"></div>
                <div className="text-xs text-gray-500 pb-1">
                  <div className="font-medium text-base text-[#09261E]">67%</div>
                  vs 48%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Premium Insights Teaser */}
      <Card className="bg-gradient-to-r from-[#09261E] to-[#135341] text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Unlock Premium Insights</h3>
              <p className="text-gray-100 max-w-lg">
                Get advanced analytics including local market forecasts, investment opportunity scores, 
                and personalized recommendations based on your portfolio.
              </p>
              <Button 
                className="mt-4 bg-white text-[#09261E] hover:bg-gray-100"
                onClick={() => setLocation('/upgrade')}
              >
                Upgrade to Premium
              </Button>
            </div>
            <div className="hidden lg:block">
              <BarChart4 className="h-24 w-24 text-white/30" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}