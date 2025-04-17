import { useParams } from "wouter";
import { useState, useEffect } from "react";
import { Property } from "@shared/schema";
import { Rep, reps } from "@/lib/rep-data";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Import all the components for the REP profile page
import ProfileHeader from "@/components/reps/profile/ProfileHeader";
import StickyNav from "@/components/reps/profile/StickyNav";
import ActiveDeals from "@/components/reps/profile/ActiveDeals";
import ClosedDeals from "@/components/reps/profile/ClosedDeals";
import ActivityFeed from "@/components/reps/profile/ActivityFeed";
import ConnectionsList from "@/components/reps/profile/ConnectionsList";
import Reviews from "@/components/reps/profile/Reviews";
import AboutSection from "@/components/reps/profile/AboutSection";
import ContactCard from "@/components/reps/profile/ContactCard";

// Sample data interfaces for the components
interface ClosedDeal extends Property {
  closedDate: string;
  buyer?: string;
  buyerId?: number;
}

interface Activity {
  id: string;
  type: 'post' | 'comment' | 'deal_posted' | 'deal_closed' | 'joined' | 'connection';
  content?: string;
  timestamp: string;
  dealId?: number;
  dealTitle?: string;
  dealPrice?: number;
  threadId?: string;
  threadTitle?: string;
  connectionId?: number;
  connectionName?: string;
}

interface Connection {
  id: number;
  name: string;
  avatar: string;
  title: string;
  type: string;
  connectedDate: string;
  isMutual?: boolean;
}

interface Review {
  id: number;
  reviewerId: number;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  text: string;
  date: string;
  dealId?: number;
  dealTitle?: string;
}

export default function RepProfilePage() {
  const params = useParams<{ id: string }>();
  const repId = parseInt(params.id, 10);
  
  // Find the REP by ID from the local data
  // In a real app, this would be a database query
  const rep = reps.find(r => r.id === repId);
  
  // Fetch properties for this REP
  const { data: properties, isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
    enabled: !!rep,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Generate sample data for demo purposes
  // In a real app, this would be fetched from the API
  const [activeDeals, setActiveDeals] = useState<Property[]>([]);
  const [closedDeals, setClosedDeals] = useState<ClosedDeal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  useEffect(() => {
    if (properties && rep) {
      // Filter properties to display as active deals
      const activeProperties = properties.slice(0, 3);
      setActiveDeals(activeProperties);
      
      // Create sample closed deals
      const sampleClosedDeals: ClosedDeal[] = properties.slice(3, 6).map((property, index) => ({
        ...property,
        closedDate: new Date(Date.now() - (index + 1) * 30 * 24 * 60 * 60 * 1000).toISOString(), // 1-3 months ago
        buyer: ['John Smith', 'Maria Rodriguez', 'Alex Chen'][index],
        buyerId: [4, 5, 6][index]
      }));
      setClosedDeals(sampleClosedDeals);
      
      // Create sample activities
      const sampleActivities: Activity[] = [
        {
          id: '1',
          type: 'deal_posted',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          dealId: activeProperties[0]?.id,
          dealTitle: activeProperties[0]?.title,
          dealPrice: activeProperties[0]?.price
        },
        {
          id: '2',
          type: 'post',
          content: 'Just closed on a beautiful property in downtown! Looking forward to helping the new owners settle in.',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          threadId: '123'
        },
        {
          id: '3',
          type: 'deal_closed',
          timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          dealId: sampleClosedDeals[0]?.id,
          dealTitle: sampleClosedDeals[0]?.title,
          dealPrice: sampleClosedDeals[0]?.price
        },
        {
          id: '4',
          type: 'comment',
          content: 'Great insights on the current market trends! I've been seeing similar patterns in my area as well.',
          timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          threadId: '456',
          threadTitle: 'Market Trends Discussion'
        },
        {
          id: '5',
          type: 'connection',
          timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          connectionId: 2,
          connectionName: 'Sarah Chen'
        },
        {
          id: '6',
          type: 'joined',
          timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setActivities(sampleActivities);
      
      // Create sample connections
      const sampleConnections: Connection[] = [
        {
          id: 2,
          name: 'Sarah Chen',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          title: 'Real Estate Agent',
          type: 'agent',
          connectedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          isMutual: true
        },
        {
          id: 3,
          name: 'Marcus Johnson',
          avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
          title: 'Contractor',
          type: 'contractor',
          connectedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 6,
          name: 'Elena Rodriguez',
          avatar: 'https://randomuser.me/api/portraits/women/62.jpg',
          title: 'Real Estate Agent',
          type: 'agent',
          connectedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          isMutual: true
        },
        {
          id: 7,
          name: 'Robert Chang',
          avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
          title: 'Contractor',
          type: 'contractor',
          connectedDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 13,
          name: 'David Park',
          avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
          title: 'Real Estate Agent',
          type: 'agent',
          connectedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 9,
          name: 'Summit Realty Group',
          avatar: 'https://logo.clearbit.com/summitrealty.net',
          title: 'Real Estate Agency',
          type: 'agent',
          connectedDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setConnections(sampleConnections);
      
      // Create sample reviews
      const sampleReviews: Review[] = [
        {
          id: 1,
          reviewerId: 2,
          reviewerName: 'Sarah Chen',
          reviewerAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          rating: 5,
          text: 'Working with them was an absolute pleasure. They were professional, responsive, and truly understood our needs.',
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          dealId: sampleClosedDeals[0]?.id,
          dealTitle: sampleClosedDeals[0]?.title
        },
        {
          id: 2,
          reviewerId: 6,
          reviewerName: 'Elena Rodriguez',
          reviewerAvatar: 'https://randomuser.me/api/portraits/women/62.jpg',
          rating: 4,
          text: 'Great experience overall. Very knowledgeable about the local market and provided valuable insights throughout the process.',
          date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          reviewerId: 7,
          reviewerName: 'Robert Chang',
          reviewerAvatar: 'https://randomuser.me/api/portraits/men/42.jpg',
          rating: 5,
          text: 'Exceptional service from start to finish. They went above and beyond to ensure everything went smoothly with our transaction.',
          date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          dealId: sampleClosedDeals[1]?.id,
          dealTitle: sampleClosedDeals[1]?.title
        }
      ];
      setReviews(sampleReviews);
    }
  }, [properties, rep]);
  
  // Enhance the rep object with additional props we need for our components
  const enhancedRep = rep ? {
    ...rep,
    // Fill in missing profile info if needed
    memberSince: rep.memberSince || new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    lastActive: rep.lastActive || new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    responseTime: rep.responseTime || "within 24 hours",
    phone: rep.contact?.phone || "",
    email: rep.contact?.email || "",
    // Sample banner
    bannerUrl: rep.bannerUrl || "https://images.pexels.com/photos/7031406/pexels-photo-7031406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    // Sample social links
    social: rep.social || {
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
      website: rep.website || "https://example.com"
    },
    // Sample availability
    availability: rep.availability || "available",
    availabilitySchedule: rep.availabilitySchedule || [
      { day: "Monday-Friday", hours: "9:00 AM - 5:00 PM" },
      { day: "Saturday", hours: "10:00 AM - 2:00 PM" },
      { day: "Sunday", hours: "Closed" }
    ],
    // Sample expertise
    expertise: rep.expertise || rep.specialties || ["Real Estate Transactions", "Market Analysis", "Property Marketing"],
    propertyTypes: rep.propertyTypes || ["Single Family", "Multi-Family", "Luxury Homes"],
    locationsServed: rep.locationsServed || [`${rep.location.city} Area`, "Surrounding Suburbs"],
    credentials: rep.credentials || ["Licensed Real Estate Professional", `${rep.yearsExperience}+ Years Experience`],
    additionalInfo: rep.additionalInfo || null
  } : null;
  
  if (!enhancedRep) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-6"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
          
          <h1 className="text-4xl font-heading font-bold text-[#09261E] mb-6">REP Not Found</h1>
          <p className="text-lg text-gray-600">
            The REP profile you're looking for doesn't exist or has been removed.
          </p>
          
          <Button 
            className="mt-6 bg-[#09261E] hover:bg-[#135341]"
            onClick={() => window.location.href = '/reps'}
          >
            Browse All REPs
          </Button>
        </div>
      </div>
    );
  }
  
  if (propertiesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full mb-8" />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <Skeleton className="h-12 w-48 mb-4" />
            <Skeleton className="h-64 w-full mb-8" />
            <Skeleton className="h-12 w-48 mb-4" />
            <Skeleton className="h-64 w-full mb-8" />
          </div>
          <div className="md:w-1/3">
            <Skeleton className="h-80 w-full mb-8" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-[#09261E]"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span>Back to REPs</span>
        </Button>
      </div>
      
      {/* Profile Header */}
      <ProfileHeader rep={enhancedRep} />
      
      {/* Sticky Navigation */}
      <StickyNav 
        activeDealsCount={activeDeals.length} 
        closedDealsCount={closedDeals.length}
        reviewsCount={reviews.length}
        connectionsCount={connections.length}
      />
      
      <div className="flex flex-col md:flex-row md:gap-8 container mx-auto px-4">
        {/* Main Content */}
        <div className="md:w-2/3">
          {/* Active Deals Section */}
          <ActiveDeals properties={activeDeals} />
          
          {/* Closed Deals Section */}
          <ClosedDeals deals={closedDeals} />
          
          {/* Activity Feed Section */}
          <ActivityFeed activities={activities} />
          
          {/* Connections Section */}
          <ConnectionsList connections={connections} />
          
          {/* Reviews Section */}
          <Reviews reviews={reviews} />
          
          {/* About Section */}
          <AboutSection rep={enhancedRep} />
        </div>
        
        {/* Sidebar */}
        <div className="md:w-1/3 mt-10 md:mt-0">
          <ContactCard rep={enhancedRep} className="mt-10" />
        </div>
      </div>
    </div>
  );
}