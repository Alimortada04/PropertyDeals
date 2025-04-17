import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  CheckCircle, 
  Award, 
  Clock, 
  ExternalLink, 
  MessageSquare, 
  Phone, 
  Mail, 
  ChevronRight, 
  Share, 
  Flag, 
  Bookmark,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Globe,
  Users,
  Calendar
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import RepPropertyCard from "@/components/reps/rep-property-card";
import RepReviewCard from "@/components/reps/rep-review-card";
import RepActivityFeed from "@/components/reps/rep-activity-feed";
import RepConnectionsList from "@/components/reps/rep-connections-list";
import Breadcrumbs from "@/components/common/breadcrumbs";

export default function RepProfilePage() {
  const params = useParams();
  const repId = params.id;
  
  // Fetch REP data
  const { data: rep, isLoading: isLoadingRep } = useQuery({
    queryKey: [`/api/reps/${repId}`],
    enabled: !!repId,
  });
  
  // Fetch REP's active listings
  const { data: activeListings, isLoading: isLoadingListings } = useQuery({
    queryKey: [`/api/reps/${repId}/listings`],
    enabled: !!repId,
  });
  
  // Fetch REP's past deals
  const { data: pastDeals, isLoading: isLoadingDeals } = useQuery({
    queryKey: [`/api/reps/${repId}/deals`],
    enabled: !!repId,
  });
  
  // Fetch REP's reviews
  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: [`/api/reps/${repId}/reviews`],
    enabled: !!repId,
  });
  
  // Fetch REP's connections
  const { data: connections, isLoading: isLoadingConnections } = useQuery({
    queryKey: [`/api/reps/${repId}/connections`],
    enabled: !!repId,
  });
  
  // Fetch REP's activity
  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: [`/api/reps/${repId}/activity`],
    enabled: !!repId,
  });
  
  // Mock data for development (to be replaced with actual API data)
  const mockRep = {
    id: 1,
    name: "Michael Johnson",
    username: "michael_j",
    role: "Seller",
    verified: true,
    topRep: true,
    memberSince: "2020-05-15",
    location: "Milwaukee, WI",
    company: "Elite Properties",
    companyId: 12,
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    banner: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    bio: "I specialize in finding value-add multifamily properties throughout the Midwest. With over 15 years of real estate experience, I've closed more than 200 deals valued at over $50M. My team and I focus on off-market opportunities with strong cash flow potential.",
    specialties: ["Multifamily", "Value-Add", "Off-Market", "Distressed"],
    areas: ["Milwaukee", "Madison", "Chicago", "Minneapolis"],
    socialLinks: {
      website: "https://eliteproperties.com",
      facebook: "https://facebook.com/eliteproperties",
      linkedin: "https://linkedin.com/in/michael-johnson",
      instagram: "https://instagram.com/michael_realestate"
    },
    contactInfo: {
      email: "michael@eliteproperties.com",
      phone: "(414) 555-7890"
    },
    stats: {
      dealsClosed: 78,
      avgResponseTime: "2 hours",
      avgRating: 4.7
    }
  };
  
  const mockListings = [
    {
      id: 101,
      title: "7-Unit Apartment Building",
      price: 750000,
      address: "2340 N Water St",
      city: "Milwaukee", 
      state: "WI",
      bedrooms: 14,
      bathrooms: 7,
      squareFeet: 7500,
      imageUrl: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      dealType: "Off-Market",
      tier: "Exclusive"
    },
    {
      id: 102,
      title: "Mixed-Use Building",
      price: 1200000,
      address: "450 E Kilbourn Ave",
      city: "Milwaukee", 
      state: "WI",
      bedrooms: 4,
      bathrooms: 4,
      squareFeet: 12000,
      imageUrl: "https://images.unsplash.com/photo-1577415124269-fc1140a69e91?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      dealType: "Value-Add",
      tier: "General"
    },
    {
      id: 103,
      title: "Multifamily Package",
      price: 2500000,
      address: "Various Locations",
      city: "Chicago", 
      state: "IL",
      bedrooms: 26,
      bathrooms: 16,
      squareFeet: 24000,
      imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      dealType: "Portfolio",
      tier: "Exclusive"
    },
    {
      id: 104,
      title: "Duplex with Renovation Potential",
      price: 225000,
      address: "843 N 15th St",
      city: "Milwaukee", 
      state: "WI",
      bedrooms: 4,
      bathrooms: 2,
      squareFeet: 2200,
      imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      dealType: "Flip",
      tier: "General"
    }
  ];
  
  const mockDeals = [
    {
      id: 201,
      title: "14-Unit Apartment Building",
      price: 1250000,
      address: "1234 N Prospect Ave",
      city: "Milwaukee", 
      state: "WI",
      imageUrl: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      closedDate: "2023-10-15",
      partner: {
        id: 5,
        name: "Olivia Banks",
        role: "Buyer",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      }
    },
    {
      id: 202,
      title: "Commercial Office Space",
      price: 850000,
      address: "789 E Wisconsin Ave",
      city: "Milwaukee", 
      state: "WI",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      closedDate: "2023-08-22",
      partner: {
        id: 8,
        name: "William Carter",
        role: "Buyer",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      }
    },
    {
      id: 203,
      title: "Retail Strip Mall",
      price: 1750000,
      address: "5678 W Capitol Dr",
      city: "Milwaukee", 
      state: "WI",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      closedDate: "2023-06-10",
      partner: {
        id: 12,
        name: "Sophia Rodriguez",
        role: "Buyer",
        avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      }
    }
  ];
  
  const mockReviews = [
    {
      id: 301,
      rating: 5,
      text: "Michael was incredible to work with. He found us an off-market property that perfectly matched our investment criteria. His market knowledge and connections are unmatched.",
      date: "2023-11-10",
      author: {
        id: 5,
        name: "Olivia Banks",
        role: "Buyer",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      }
    },
    {
      id: 302,
      rating: 4,
      text: "Professional and knowledgeable. Michael helped me acquire a 12-unit apartment building that has been performing very well. Communication was sometimes delayed but overall a good experience.",
      date: "2023-09-05",
      author: {
        id: 8,
        name: "William Carter",
        role: "Buyer",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      }
    },
    {
      id: 303,
      rating: 5,
      text: "Working with Michael was a game-changer for our investment strategy. He found us a retail property with significant upside potential that we wouldn't have found otherwise.",
      date: "2023-07-22",
      author: {
        id: 12,
        name: "Sophia Rodriguez",
        role: "Buyer",
        avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      }
    }
  ];
  
  const mockConnections = [
    {
      id: 5,
      name: "Olivia Banks",
      role: "Buyer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      relationship: "Deal Partner"
    },
    {
      id: 8,
      name: "William Carter",
      role: "Buyer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      relationship: "Deal Partner"
    },
    {
      id: 12,
      name: "Sophia Rodriguez",
      role: "Buyer",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      relationship: "Deal Partner"
    },
    {
      id: 15,
      name: "James Thompson",
      role: "Lender",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      relationship: "Frequent Collaborator"
    },
    {
      id: 18,
      name: "Emma Wilson",
      role: "Agent",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      relationship: "Team Member"
    }
  ];
  
  const mockActivity = [
    {
      id: 401,
      type: "new_listing",
      title: "Listed a new property",
      description: "7-Unit Apartment Building in Milwaukee",
      date: "2023-12-01",
      propertyId: 101
    },
    {
      id: 402,
      type: "deal_closed",
      title: "Closed a deal",
      description: "14-Unit Apartment Building with Olivia Banks",
      date: "2023-10-15",
      partnerId: 5,
      propertyId: 201
    },
    {
      id: 403,
      type: "comment",
      title: "Replied to a discussion",
      description: "In 'Best Neighborhoods for Multifamily in Milwaukee'",
      date: "2023-11-20",
      threadId: 25
    },
    {
      id: 404,
      type: "deal_closed",
      title: "Closed a deal",
      description: "Commercial Office Space with William Carter",
      date: "2023-08-22",
      partnerId: 8,
      propertyId: 202
    }
  ];
  
  // Use mock data for development
  const repData = rep || mockRep;
  const listings = activeListings || mockListings;
  const deals = pastDeals || mockDeals;
  const repReviews = reviews || mockReviews;
  const repConnections = connections || mockConnections;
  const repActivity = activity || mockActivity;
  
  // Calculate membership duration
  const getMembershipDuration = (dateString) => {
    const joinDate = new Date(dateString);
    const now = new Date();
    const yearDiff = now.getFullYear() - joinDate.getFullYear();
    
    if (yearDiff > 0) {
      return `${yearDiff}+ ${yearDiff === 1 ? 'year' : 'years'} on PropertyDeals`;
    } else {
      // Calculate months
      const monthDiff = now.getMonth() - joinDate.getMonth() + 
        (now.getFullYear() - joinDate.getFullYear()) * 12;
      return `${monthDiff} ${monthDiff === 1 ? 'month' : 'months'} on PropertyDeals`;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white pt-4 border-b">
        <div className="container mx-auto px-4 md:px-6 pb-2">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <Link href="/" className="hover:text-[#135341]">Home</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link href="/reps" className="hover:text-[#135341]">REPs</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-gray-700 font-medium">{repData.name}</span>
          </div>
        </div>
      </div>
      
      {/* Header Section */}
      <div className="bg-white border-b">
        {/* Banner Image */}
        <div className="h-48 md:h-64 w-full relative overflow-hidden">
          <img 
            src={repData.banner} 
            alt={`${repData.name}'s banner`} 
            className="w-full h-full object-cover"
          />
          
          {/* Avatar overlapping the banner */}
          <div className="absolute -bottom-16 left-6 md:left-8">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                <AvatarImage src={repData.avatar} alt={repData.name} />
                <AvatarFallback>{repData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              {/* Verification Badge */}
              {repData.verified && (
                <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 border-2 border-white">
                  <CheckCircle className="h-6 w-6 text-[#803344] fill-white" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Profile Header Content */}
        <div className="container mx-auto px-4 md:px-6 pt-20 pb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            {/* Left Side - Profile Info */}
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{repData.name}</h1>
                <Badge variant="outline" className="bg-[#f8f0f2] text-[#803344] border-[#803344] font-medium">
                  {repData.role}
                </Badge>
                {repData.topRep && (
                  <Badge variant="outline" className="bg-[#f0f7f4] text-[#135341] border-[#135341] font-medium">
                    <Award className="mr-1 h-3.5 w-3.5" />
                    Top REP
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {repData.location}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <Link href={`/company/${repData.companyId}`} className="text-[#135341] hover:underline">
                    {repData.company}
                  </Link>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {getMembershipDuration(repData.memberSince)}
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex gap-4 mb-4 flex-wrap">
                <div className="bg-gray-50 px-3 py-2 rounded-md">
                  <p className="text-sm text-gray-500">Deals Closed</p>
                  <p className="text-lg font-bold text-[#135341]">{repData.stats.dealsClosed}</p>
                </div>
                <div className="bg-gray-50 px-3 py-2 rounded-md">
                  <p className="text-sm text-gray-500">Response Time</p>
                  <p className="text-lg font-bold text-[#135341]">{repData.stats.avgResponseTime}</p>
                </div>
                <div className="bg-gray-50 px-3 py-2 rounded-md">
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="flex items-center">
                    <p className="text-lg font-bold text-[#135341] mr-1">{repData.stats.avgRating}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < Math.round(repData.stats.avgRating) ? 'text-yellow-500' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Action Buttons */}
            <div className="flex flex-col gap-2 mt-2 md:mt-0">
              <Button className="bg-[#135341] hover:bg-[#09261E] text-white">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
              <div className="flex gap-2">
                {repData.contactInfo.phone && (
                  <Button variant="outline" className="flex-1">
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
                )}
                {repData.contactInfo.email && (
                  <Button variant="outline" className="flex-1">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                )}
              </div>
              
              {/* Social Links */}
              <div className="flex gap-2 mt-2 items-center">
                {repData.socialLinks.website && (
                  <a 
                    href={repData.socialLinks.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <Globe className="h-5 w-5 text-gray-600" />
                  </a>
                )}
                {repData.socialLinks.facebook && (
                  <a 
                    href={repData.socialLinks.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <Facebook className="h-5 w-5 text-gray-600" />
                  </a>
                )}
                {repData.socialLinks.linkedin && (
                  <a 
                    href={repData.socialLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <Linkedin className="h-5 w-5 text-gray-600" />
                  </a>
                )}
                {repData.socialLinks.instagram && (
                  <a 
                    href={repData.socialLinks.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <Instagram className="h-5 w-5 text-gray-600" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - About, Connections */}
          <div className="space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-gray-700 mb-6">{repData.bio}</p>
              
              {/* Specialties */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {repData.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-100">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Areas Served */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Areas Served</h3>
                <div className="flex flex-wrap gap-2">
                  {repData.areas.map((area, index) => (
                    <Badge key={index} variant="outline" className="border-gray-200">
                      <MapPin className="mr-1 h-3 w-3" />
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Connections Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Connections</h2>
                <Button variant="ghost" size="sm" className="text-[#135341]">See All</Button>
              </div>
              
              <RepConnectionsList connections={repConnections.slice(0, 4)} />
            </div>
            
            {/* Activity Feed (Mobile Only) */}
            <div className="lg:hidden bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <RepActivityFeed activities={repActivity.slice(0, 3)} />
            </div>
          </div>
          
          {/* Middle/Right Column - Tabs (Active Deals, Past Deals, Reviews) */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="active" className="flex-1">Active Listings</TabsTrigger>
                <TabsTrigger value="past" className="flex-1">Past Deals</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
                <TabsTrigger value="activity" className="flex-1 hidden lg:flex">Activity</TabsTrigger>
              </TabsList>
              
              {/* Active Listings Tab */}
              <TabsContent value="active" className="space-y-6">
                {listings.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {listings.map((listing) => (
                        <RepPropertyCard key={listing.id} property={listing} />
                      ))}
                    </div>
                    {listings.length > 4 && (
                      <div className="text-center mt-4">
                        <Button variant="outline">
                          View All Listings
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No active listings at this time.</p>
                  </div>
                )}
              </TabsContent>
              
              {/* Past Deals Tab */}
              <TabsContent value="past" className="space-y-6">
                {deals.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {deals.map((deal) => (
                        <div key={deal.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3">
                              <img 
                                src={deal.imageUrl} 
                                alt={deal.title} 
                                className="w-full h-48 md:h-full object-cover"
                              />
                            </div>
                            <div className="p-4 md:p-6 flex-1">
                              <div className="flex justify-between mb-2">
                                <h3 className="font-bold text-lg text-[#135341]">{deal.title}</h3>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                                  <span className="text-sm text-gray-500">
                                    {new Date(deal.closedDate).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      year: 'numeric' 
                                    })}
                                  </span>
                                </div>
                              </div>
                              <p className="text-gray-600 mb-3">${deal.price.toLocaleString()} • {deal.address}, {deal.city}, {deal.state}</p>
                              
                              {/* Partner */}
                              {deal.partner && (
                                <div className="flex items-center mt-4">
                                  <div className="text-sm text-gray-500 mr-2">Closed with:</div>
                                  <div className="flex items-center">
                                    <Avatar className="h-6 w-6 mr-2">
                                      <AvatarImage src={deal.partner.avatar} alt={deal.partner.name} />
                                      <AvatarFallback>{deal.partner.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <Link href={`/reps/${deal.partner.id}`} className="text-sm font-medium hover:underline">
                                      {deal.partner.name}
                                    </Link>
                                    <Badge variant="outline" className="ml-2 bg-gray-50 text-xs">
                                      {deal.partner.role}
                                    </Badge>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {deals.length > 3 && (
                      <div className="text-center mt-4">
                        <Button variant="outline">
                          View All Past Deals
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No past deals to display.</p>
                  </div>
                )}
              </TabsContent>
              
              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold mb-1">Reviews from deal partners</h3>
                      <div className="flex items-center">
                        <div className="flex mr-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-lg ${i < Math.round(repData.stats.avgRating) ? 'text-yellow-500' : 'text-gray-300'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="font-bold">{repData.stats.avgRating}</span>
                        <span className="mx-1">•</span>
                        <span className="text-gray-500">{repReviews.length} reviews</span>
                      </div>
                    </div>
                    <Button className="mt-4 md:mt-0 bg-[#135341] hover:bg-[#09261E]">
                      Write a Review
                    </Button>
                  </div>
                  
                  {/* Reviews List */}
                  {repReviews.length > 0 ? (
                    <div className="space-y-6">
                      {repReviews.map((review) => (
                        <div key={review.id} className="border-t border-gray-100 pt-5">
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={review.author.avatar} alt={review.author.name} />
                                <AvatarFallback>{review.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center">
                                  <Link href={`/reps/${review.author.id}`} className="font-medium hover:underline mr-2">
                                    {review.author.name}
                                  </Link>
                                  <Badge variant="outline" className="text-xs bg-gray-50">
                                    {review.author.role}
                                  </Badge>
                                </div>
                                <div className="flex mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(review.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric' 
                              })}
                            </div>
                          </div>
                          <p className="text-gray-700 mt-2">{review.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No reviews yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Activity Tab (Desktop Only) */}
              <TabsContent value="activity" className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                  <RepActivityFeed activities={repActivity} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="bg-white border-t mt-6 py-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="text-gray-500">
                <Share className="mr-2 h-4 w-4" />
                Share Profile
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500">
                <Bookmark className="mr-2 h-4 w-4" />
                Save Contact
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-500">
              <Flag className="mr-2 h-4 w-4" />
              Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}