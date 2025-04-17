import React, { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Home, 
  CheckCircle, 
  Activity, 
  Users, 
  Star, 
  Phone, 
  Mail, 
  MessageCircle, 
  TrendingUp,
  ActivityIcon,
  ArrowDown
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Rep components
import RepHeader from "@/components/reps/rep-header";
import RepAbout from "@/components/reps/rep-about";
import RepActivityFeed from "@/components/reps/rep-activity-feed";
import RepConnectionsList from "@/components/reps/rep-connections-list";
import RepDeals from "@/components/reps/rep-deals";
import RepReviews from "@/components/reps/rep-reviews";
import RepContact from "@/components/reps/rep-contact";

export default function RepProfilePage() {
  // Get the rep ID from the URL params
  const params = useParams();
  const repId = params.id ? parseInt(params.id) : null;

  // Fetch rep data
  const { data: rep, isLoading: isLoadingRep, error: repError } = useQuery({
    queryKey: ["/api/reps", repId],
    queryFn: async () => {
      if (!repId) return undefined;
      const res = await fetch(`/api/reps/${repId}`);
      if (!res.ok) throw new Error("Failed to fetch REP data");
      return res.json();
    },
    enabled: !!repId,
  });

  // Fetch rep reviews
  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["/api/reps", repId, "reviews"],
    queryFn: async () => {
      if (!repId) return [];
      const res = await fetch(`/api/reps/${repId}/reviews`);
      if (!res.ok) throw new Error("Failed to fetch REP reviews");
      return res.json();
    },
    enabled: !!repId,
  });

  // Fetch rep activities
  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ["/api/reps", repId, "activity"],
    queryFn: async () => {
      if (!repId) return [];
      const res = await fetch(`/api/reps/${repId}/activity`);
      if (!res.ok) throw new Error("Failed to fetch REP activities");
      return res.json();
    },
    enabled: !!repId,
  });

  // Fetch rep connections
  const { data: connections, isLoading: isLoadingConnections } = useQuery({
    queryKey: ["/api/reps", repId, "connections"],
    queryFn: async () => {
      if (!repId) return [];
      const res = await fetch(`/api/reps/${repId}/connections`);
      if (!res.ok) throw new Error("Failed to fetch REP connections");
      return res.json();
    },
    enabled: !!repId,
  });

  // Fetch rep listings
  const { data: listings, isLoading: isLoadingListings } = useQuery({
    queryKey: ["/api/reps", repId, "listings"],
    queryFn: async () => {
      if (!repId) return [];
      const res = await fetch(`/api/reps/${repId}/listings`);
      if (!res.ok) throw new Error("Failed to fetch REP listings");
      return res.json();
    },
    enabled: !!repId,
  });

  // Fetch rep deals
  const { data: deals, isLoading: isLoadingDeals } = useQuery({
    queryKey: ["/api/reps", repId, "deals"],
    queryFn: async () => {
      if (!repId) return [];
      const res = await fetch(`/api/reps/${repId}/deals`);
      if (!res.ok) throw new Error("Failed to fetch REP deals");
      return res.json();
    },
    enabled: !!repId,
  });

  // Handle loading states
  const isLoading = isLoadingRep || 
    isLoadingReviews || 
    isLoadingActivities || 
    isLoadingConnections || 
    isLoadingListings || 
    isLoadingDeals;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="w-full h-60 rounded-lg bg-muted mb-16 relative">
          <div className="absolute -bottom-16 left-8">
            <Skeleton className="w-32 h-32 rounded-full border-4 border-background" />
          </div>
        </div>
        <div className="mt-20">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-32 w-full mb-8" />
              
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
              
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="space-y-4 mb-8">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
            
            <div>
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-64 w-full mb-8" />
              
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (repError || !rep) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {repError ? (repError as Error).message : "REP not found"}
          </AlertDescription>
        </Alert>
        <p className="text-center py-8">
          Unable to load REP profile. Please try again later or check if the REP exists.
        </p>
      </div>
    );
  }

  // Parse string stats if needed
  let stats = {};
  try {
    if (rep.stats && typeof rep.stats === 'string') {
      stats = JSON.parse(rep.stats);
    } else if (rep.stats && typeof rep.stats === 'object') {
      stats = rep.stats;
    }
  } catch (e) {
    console.error("Failed to parse REP stats:", e);
  }

  // Parse contact info if needed
  let contactInfo = {};
  try {
    if (rep.contactInfo && typeof rep.contactInfo === 'string') {
      contactInfo = JSON.parse(rep.contactInfo);
    } else if (rep.contactInfo && typeof rep.contactInfo === 'object') {
      contactInfo = rep.contactInfo;
    }
  } catch (e) {
    console.error("Failed to parse REP contact info:", e);
  }

  // Parse social links if needed
  let socialLinks = {};
  try {
    if (rep.socialLinks && typeof rep.socialLinks === 'string') {
      socialLinks = JSON.parse(rep.socialLinks);
    } else if (rep.socialLinks && typeof rep.socialLinks === 'object') {
      socialLinks = rep.socialLinks;
    }
  } catch (e) {
    console.error("Failed to parse REP social links:", e);
  }

  // Create a navigation menu with section scrolling
  const [activeSection, setActiveSection] = useState<string>("about");
  const sectionRefs = {
    about: React.useRef<HTMLDivElement>(null),
    activeDeals: React.useRef<HTMLDivElement>(null),
    closedDeals: React.useRef<HTMLDivElement>(null),
    activity: React.useRef<HTMLDivElement>(null),
    connections: React.useRef<HTMLDivElement>(null),
    reviews: React.useRef<HTMLDivElement>(null)
  };

  // Handle scrolling to sections
  const scrollToSection = (sectionName: string) => {
    setActiveSection(sectionName);
    const sectionRef = sectionRefs[sectionName as keyof typeof sectionRefs];
    if (sectionRef && sectionRef.current) {
      const yOffset = -100; // Offset for the sticky header
      const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Observe sections for intersection to update active nav item
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveSection(id);
        }
      });
    }, { rootMargin: '-100px 0px -80% 0px' }); // Adjust rootMargin as needed

    // Observe all section elements
    Object.values(sectionRefs).forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [rep.id]);

  return (
    <div className="relative bg-background">
      {/* Header Section */}
      <RepHeader 
        rep={rep} 
        stats={stats} 
        socialLinks={socialLinks}
      />

      {/* Sticky Navigation Menu */}
      <div className="sticky top-0 z-20 bg-background border-b shadow-sm">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-2 px-4">
            <nav className="flex space-x-1 sm:space-x-2">
              <button
                onClick={() => scrollToSection('about')}
                className={`px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors ${
                  activeSection === 'about' 
                    ? 'text-primary font-medium bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('activeDeals')}
                className={`px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors ${
                  activeSection === 'activeDeals' 
                    ? 'text-primary font-medium bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Active Deals
              </button>
              <button
                onClick={() => scrollToSection('closedDeals')}
                className={`px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors ${
                  activeSection === 'closedDeals' 
                    ? 'text-primary font-medium bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Closed Deals
              </button>
              <button
                onClick={() => scrollToSection('activity')}
                className={`px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors ${
                  activeSection === 'activity' 
                    ? 'text-primary font-medium bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Activity
              </button>
              <button
                onClick={() => scrollToSection('connections')}
                className={`px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors ${
                  activeSection === 'connections' 
                    ? 'text-primary font-medium bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Connections
              </button>
              <button
                onClick={() => scrollToSection('reviews')}
                className={`px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors ${
                  activeSection === 'reviews' 
                    ? 'text-primary font-medium bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                Reviews
              </button>
            </nav>

            {/* Contact buttons for desktop */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  <span className="hidden lg:inline">Call</span>
                </a>
              </Button>
              <Button variant="default" size="sm" asChild>
                <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="hidden lg:inline">Message</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content - 3 cols */}
          <div className="lg:col-span-3 space-y-12">
            {/* About Section */}
            <section id="about" ref={sectionRefs.about} className="scroll-mt-20">
              <RepAbout 
                rep={rep} 
                stats={stats}
              />
            </section>
            
            {/* Active Deals Section */}
            <section id="activeDeals" ref={sectionRefs.activeDeals} className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Home className="h-6 w-6" />
                <span>Active Deals</span>
                <Badge variant="secondary" className="ml-2">
                  {
                    Array.isArray(listings) 
                      ? listings.length 
                      : (stats?.activeListings || 0)
                  }
                </Badge>
              </h2>
              <RepDeals 
                listings={listings || []} 
                deals={[]} 
                repId={rep.id}
                mode="active"
              />
            </section>
            
            {/* Closed Deals Section */}
            <section id="closedDeals" ref={sectionRefs.closedDeals} className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                <span>Closed Deals</span>
                <Badge variant="secondary" className="ml-2">
                  {
                    Array.isArray(deals) 
                      ? deals.length 
                      : (stats?.dealsClosed || 0)
                  }
                </Badge>
              </h2>
              <RepDeals 
                listings={[]} 
                deals={deals || []} 
                repId={rep.id}
                mode="closed"
              />
            </section>
            
            {/* Activity Feed Section */}
            <section id="activity" ref={sectionRefs.activity} className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Activity className="h-6 w-6" />
                <span>Activity</span>
              </h2>
              <RepActivityFeed 
                activities={activities || []} 
                repId={rep.id}
              />
            </section>
            
            {/* Connections Section */}
            <section id="connections" ref={sectionRefs.connections} className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Users className="h-6 w-6" />
                <span>Connections</span>
                <Badge variant="secondary" className="ml-2">
                  {
                    Array.isArray(connections) 
                      ? connections.length 
                      : 0
                  }
                </Badge>
              </h2>
              <RepConnectionsList 
                connections={connections || []} 
                repId={rep.id}
              />
            </section>
            
            {/* Reviews Section */}
            <section id="reviews" ref={sectionRefs.reviews} className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Star className="h-6 w-6" />
                <span>Reviews</span>
                <Badge variant="secondary" className="ml-2">
                  {
                    Array.isArray(reviews) 
                      ? reviews.length 
                      : (stats?.reviewCount || 0)
                  }
                </Badge>
              </h2>
              <RepReviews 
                reviews={reviews || []} 
                repId={rep.id} 
                repName={rep.name} 
              />
            </section>
          </div>
          
          {/* Sidebar - 1 col */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Section */}
              <RepContact 
                rep={rep} 
                contactInfo={contactInfo}
              />
              
              {/* Quick stats snippet */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">REP Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold">{stats?.dealsClosed || 0}</span>
                      <span className="text-xs text-muted-foreground">Deals Closed</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold">{stats?.activeListings || 0}</span>
                      <span className="text-xs text-muted-foreground">Active Listings</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold mr-1">{parseFloat(stats?.rating || "0").toFixed(1)}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{stats?.reviewCount || 0} Reviews</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold">{stats?.responseRate || 0}%</span>
                      <span className="text-xs text-muted-foreground">Response Rate</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Limited recent activity */}
              {activities && activities.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[300px] overflow-y-auto">
                    <div className="space-y-3">
                      {activities.slice(0, 3).map((activity, index) => (
                        <div key={index} className="flex items-start gap-2 pb-3 border-b last:border-0 last:pb-0">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center bg-primary/10">
                            {activity.type === 'listing' && <Home className="h-3.5 w-3.5 text-primary" />}
                            {activity.type === 'deal' && <CheckCircle className="h-3.5 w-3.5 text-primary" />}
                            {activity.type === 'comment' && <MessageCircle className="h-3.5 w-3.5 text-primary" />}
                            {activity.type === 'market_update' && <TrendingUp className="h-3.5 w-3.5 text-primary" />}
                            {!['listing', 'deal', 'comment', 'market_update'].includes(activity.type) && 
                              <ActivityIcon className="h-3.5 w-3.5 text-primary" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-foreground line-clamp-2">{activity.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full mt-3 text-xs"
                      onClick={() => scrollToSection('activity')}
                    >
                      View All Activity
                      <ArrowDown className="h-3.5 w-3.5 ml-1.5" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Fixed CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-3 flex items-center justify-between z-30">
        <Button variant="outline" className="flex-1 mr-2" asChild>
          <a href={`tel:${contactInfo.phone}`} className="flex items-center justify-center gap-1.5">
            <Phone className="h-4 w-4" />
            <span>Call</span>
          </a>
        </Button>
        <Button className="flex-1" asChild>
          <a href={`mailto:${contactInfo.email}`} className="flex items-center justify-center gap-1.5">
            <Mail className="h-4 w-4" />
            <span>Message</span>
          </a>
        </Button>
      </div>
    </div>
  );
}