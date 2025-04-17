import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Property } from '@shared/schema';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Building, 
  Calendar, 
  Clock, 
  MessageCircle, 
  Star, 
  Award, 
  Briefcase, 
  Home, 
  ChevronRight, 
  Share2, 
  Flag, 
  CheckCircle2,
  Check,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  User
} from 'lucide-react';

import RepActivityFeed from '@/components/reps/rep-activity-feed';
import RepConnectionsList from '@/components/reps/rep-connections-list';
import RepPropertyCard from '@/components/reps/rep-property-card';
import RepReviewCard from '@/components/reps/rep-review-card';

// Types for REP Profile Data
interface RepStats {
  dealsClosed: number;
  activeListings: number;
  rating: number;
  reviewCount: number;
  responseRate: number;
}

interface ContactInfo {
  phone?: string;
  email?: string;
}

interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

interface RepData {
  id: number;
  name: string;
  role: string;
  avatar: string;
  banner?: string;
  verified: boolean;
  topRep: boolean;
  location: string;
  companyId?: number;
  company?: string;
  memberSince: string;
  stats: RepStats;
  contactInfo?: ContactInfo;
  socialLinks?: SocialLinks;
  bio: string;
  specialties?: string[];
  areas?: string[];
}

interface Deal {
  id: number;
  property: Property;
  closedDate: string;
  soldPrice: number;
  role: 'listing_agent' | 'buyers_agent' | 'seller' | 'buyer';
}

interface Listing extends Property {
  listedDate: string;
}

export default function RepProfilePage() {
  const params = useParams<{ id: string }>();
  const repId = params.id ? parseInt(params.id) : 0;
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('about');
  
  // Fetch rep data
  const { data: rep = {} as RepData, isLoading: isLoadingRep } = useQuery<RepData>({
    queryKey: [`/api/reps/${repId}`],
    enabled: !isNaN(repId),
  });
  
  // Fetch active listings
  const { data: listings = [] as Listing[], isLoading: isLoadingListings } = useQuery<Listing[]>({
    queryKey: [`/api/reps/${repId}/listings`],
    enabled: !isNaN(repId),
  });
  
  // Fetch closed deals
  const { data: deals = [] as Deal[], isLoading: isLoadingDeals } = useQuery<Deal[]>({
    queryKey: [`/api/reps/${repId}/deals`],
    enabled: !isNaN(repId),
  });
  
  // Fetch reviews
  const { data: reviews = [] as any[], isLoading: isLoadingReviews } = useQuery<any[]>({
    queryKey: [`/api/reps/${repId}/reviews`],
    enabled: !isNaN(repId),
  });
  
  // Fetch connections
  const { data: connections = [] as any[], isLoading: isLoadingConnections } = useQuery<any[]>({
    queryKey: [`/api/reps/${repId}/connections`],
    enabled: !isNaN(repId),
  });
  
  // Fetch activity
  const { data: activities = [] as any[], isLoading: isLoadingActivity } = useQuery<any[]>({
    queryKey: [`/api/reps/${repId}/activity`],
    enabled: !isNaN(repId),
  });
  
  // Loading state
  const isLoading = isLoadingRep || isLoadingListings || isLoadingDeals || 
                     isLoadingReviews || isLoadingConnections || isLoadingActivity;
                     
  // Function to format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { 
        month: 'long', 
        year: 'numeric' 
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };
  
  // Placeholder if there's no data yet
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse mb-4"></div>
          <div className="h-8 w-48 bg-gray-200 animate-pulse mb-2"></div>
          <div className="h-4 w-32 bg-gray-200 animate-pulse"></div>
          <div className="mt-8 w-full max-w-2xl">
            <div className="h-4 bg-gray-200 animate-pulse mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 animate-pulse mb-2 w-5/6"></div>
            <div className="h-4 bg-gray-200 animate-pulse w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 pb-12">
      {/* Header Section */}
      <div className="relative mb-6">
        {/* Banner Image */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-[#135341]/80 to-[#803344]/80 rounded-b-lg overflow-hidden relative">
          {rep.banner && (
            <img 
              src={rep.banner} 
              alt={`${rep.name}'s cover`}
              className="w-full h-full object-cover opacity-20"
            />
          )}
        </div>
        
        {/* Profile Info Overlay */}
        <div className="absolute -bottom-16 left-0 w-full px-4">
          <div className="flex flex-col md:flex-row items-center md:items-end">
            {/* Profile Picture */}
            <Avatar className="w-28 h-28 border-4 border-white rounded-full shadow-md">
              <AvatarImage src={rep.avatar} alt={rep.name} />
              <AvatarFallback>{rep.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            {/* Verification badge */}
            {rep.verified && (
              <Badge className="absolute top-0 left-20 bg-[#803344] text-white border-0">
                <CheckCircle2 size={12} className="mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      {/* Content Container (adjusted for profile picture overlap) */}
      <div className="mt-16 md:mt-12 md:ml-32 md:relative">
        {/* Basic Information */}
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-bold text-gray-900 mb-1">
            {rep.name}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-[#E59F9F]/10 text-[#803344] border-[#E59F9F] font-medium inline-flex items-center">
              {rep.role}
            </Badge>
            
            {rep.topRep && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 inline-flex items-center">
                <Award size={12} className="mr-1" />
                Top Performer
              </Badge>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-gray-600 text-sm">
            {/* Location */}
            <div className="flex items-center">
              <MapPin size={14} className="mr-1 text-gray-400" />
              <span>{rep.location}</span>
            </div>
            
            {/* Company */}
            {rep.companyId && (
              <div className="flex items-center">
                <Building size={14} className="mr-1 text-gray-400" />
                <Link href={`/business/${rep.companyId}`} className="hover:text-[#135341] hover:underline">
                  {rep.company}
                </Link>
              </div>
            )}
            
            {/* Member Since */}
            <div className="flex items-center">
              <Calendar size={14} className="mr-1 text-gray-400" />
              <span>Member since {formatDate(rep.memberSince)}</span>
            </div>
          </div>
          
          {/* Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 bg-gray-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="font-bold text-2xl text-gray-900">{rep.stats.dealsClosed}</div>
              <div className="text-sm text-gray-500">Deals Closed</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-gray-900">{rep.stats.activeListings}</div>
              <div className="text-sm text-gray-500">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center items-center">
                <span className="font-bold text-2xl text-gray-900 mr-1">{rep.stats.rating}</span>
                <Star size={16} className="text-amber-500 fill-amber-500" />
              </div>
              <div className="text-sm text-gray-500">Rating</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-gray-900">{rep.stats.responseRate}%</div>
              <div className="text-sm text-gray-500">Response Rate</div>
            </div>
          </div>
          
          {/* Contact Actions */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Button className="bg-[#09261E] hover:bg-[#135341] text-white" size="sm">
              <MessageCircle size={16} className="mr-2" />
              Message
            </Button>
            
            {rep.contactInfo && rep.contactInfo.phone && (
              <Button variant="outline" size="sm" className="border-[#09261E] text-[#09261E] hover:bg-[#09261E]/10">
                <PhoneCall size={16} className="mr-2" />
                Call
              </Button>
            )}
            
            {rep.contactInfo && rep.contactInfo.email && (
              <Button variant="outline" size="sm" className="border-[#09261E] text-[#09261E] hover:bg-[#09261E]/10">
                <Mail size={16} className="mr-2" />
                Email
              </Button>
            )}
            
            {/* Social Links */}
            <div className="flex ml-auto gap-1">
              {rep.socialLinks && rep.socialLinks.facebook && (
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" asChild>
                  <a href={rep.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook size={18} />
                  </a>
                </Button>
              )}
              
              {rep.socialLinks && rep.socialLinks.instagram && (
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" asChild>
                  <a href={rep.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram size={18} />
                  </a>
                </Button>
              )}
              
              {rep.socialLinks && rep.socialLinks.twitter && (
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" asChild>
                  <a href={rep.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter size={18} />
                  </a>
                </Button>
              )}
              
              {rep.socialLinks && rep.socialLinks.linkedin && (
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" asChild>
                  <a href={rep.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin size={18} />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <Tabs defaultValue="about" onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
            <TabsTrigger value="listings" className="flex-1">Listings</TabsTrigger>
            <TabsTrigger value="deals" className="flex-1">Deals</TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
            <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
          </TabsList>
          
          {/* About Tab Content */}
          <TabsContent value="about" className="space-y-8">
            {/* Bio Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
              <p className="text-gray-600">
                {rep.bio}
              </p>
            </div>
            
            {/* Specialties */}
            {rep.specialties && rep.specialties.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Specialties</h2>
                <div className="flex flex-wrap gap-2">
                  {rep.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Service Areas */}
            {rep.areas && rep.areas.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Service Areas</h2>
                <div className="flex flex-wrap gap-2">
                  {rep.areas.map((area, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50">
                      <MapPin size={12} className="mr-1" />
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Connections */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-gray-900">Connections</h2>
                <Button variant="ghost" size="sm" className="text-[#135341]" onClick={() => setActiveTab('activity')}>
                  View All <ChevronRight size={16} />
                </Button>
              </div>
              <RepConnectionsList connections={connections.slice(0, 3)} />
            </div>
            
            {/* Recent Activity */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <Button variant="ghost" size="sm" className="text-[#135341]" onClick={() => setActiveTab('activity')}>
                  View All <ChevronRight size={16} />
                </Button>
              </div>
              <RepActivityFeed activities={activities.slice(0, 3)} />
            </div>
          </TabsContent>
          
          {/* Listings Tab Content */}
          <TabsContent value="listings">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Active Listings ({listings.length})</h2>
            </div>
            
            {listings.length > 0 ? (
              <div className="space-y-4">
                {listings.map(listing => (
                  <RepPropertyCard 
                    key={listing.id} 
                    property={listing} 
                    isListing={true}
                    status="active"
                    date={listing.listedDate}
                    role="listing_agent"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Home size={40} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-700 mb-1">No Active Listings</h3>
                <p className="text-gray-500 text-sm">This rep doesn't have any active listings at the moment.</p>
              </div>
            )}
          </TabsContent>
          
          {/* Deals Tab Content */}
          <TabsContent value="deals">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Closed Deals ({deals.length})</h2>
            </div>
            
            {deals.length > 0 ? (
              <div className="space-y-4">
                {deals.map(deal => (
                  <RepPropertyCard 
                    key={deal.id} 
                    property={deal.property} 
                    isListing={false}
                    status="sold"
                    date={deal.closedDate}
                    price={deal.soldPrice}
                    role={deal.role}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Award size={40} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-700 mb-1">No Closed Deals Yet</h3>
                <p className="text-gray-500 text-sm">This rep hasn't closed any deals on our platform yet.</p>
              </div>
            )}
          </TabsContent>
          
          {/* Reviews Tab Content */}
          <TabsContent value="reviews">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-gray-900">Reviews ({reviews.length})</h2>
                <div className="flex items-center text-gray-700">
                  <span className="font-bold mr-1">{rep.stats.rating}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < Math.floor(rep.stats.rating) ? "text-amber-500 fill-amber-500" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-sm text-gray-500">({rep.stats.reviewCount})</span>
                </div>
              </div>
              
              {/* Rating Distribution */}
              <div className="flex gap-8 mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Rating Distribution</div>
                  <div className="space-y-1">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviews.filter(r => Math.floor(r.rating) === rating).length;
                      const percentage = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                      
                      return (
                        <div key={rating} className="flex items-center gap-2">
                          <div className="flex items-center w-12">
                            <span className="mr-1">{rating}</span>
                            <Star size={12} className="text-gray-400" />
                          </div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="w-8 text-right text-xs text-gray-500">{percentage}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Review List */}
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <RepReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <User size={40} className="mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No Reviews Yet</h3>
                  <p className="text-gray-500 text-sm">This rep hasn't received any reviews yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Activity Tab Content */}
          <TabsContent value="activity">
            <div className="flex justify-between flex-wrap md:flex-nowrap gap-6">
              <div className="w-full md:w-2/3">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Feed</h2>
                <RepActivityFeed activities={activities} />
              </div>
              
              <div className="w-full md:w-1/3">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Connections</h2>
                <RepConnectionsList connections={connections} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 w-full md:relative md:mt-8 p-4 bg-white border-t md:border md:rounded-lg md:p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-gray-500">
            <Share2 size={16} className="mr-1" />
            Share
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-500">
            <Flag size={16} className="mr-1" />
            Report
          </Button>
        </div>
        
        <Button className="bg-[#09261E] hover:bg-[#135341] text-white">
          <MessageCircle size={16} className="mr-2" />
          Contact Now
        </Button>
      </div>
    </div>
  );
}