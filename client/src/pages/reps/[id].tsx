import React from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <RepHeader 
        rep={rep} 
        stats={stats} 
        socialLinks={socialLinks}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2">
          {/* About Section */}
          <RepAbout 
            rep={rep} 
            stats={stats}
          />
          <Separator className="my-8" />
          
          {/* Active & Previous Deals Section */}
          <RepDeals 
            listings={listings || []} 
            deals={deals || []} 
            repId={rep.id}
          />
          <Separator className="my-8" />
          
          {/* Reviews Section */}
          <RepReviews 
            reviews={reviews || []} 
            repId={rep.id} 
            repName={rep.name} 
          />
        </div>
        
        <div>
          {/* Contact Section */}
          <RepContact 
            rep={rep} 
            contactInfo={contactInfo}
          />
          <Separator className="my-8" />
          
          {/* Activity Feed Section */}
          <RepActivityFeed 
            activities={activities || []} 
            repId={rep.id}
          />
          <Separator className="my-8" />
          
          {/* Connections Section */}
          <RepConnectionsList 
            connections={connections || []} 
            repId={rep.id}
          />
        </div>
      </div>
    </div>
  );
}