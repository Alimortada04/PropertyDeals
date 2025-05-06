import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  MapPin, 
  Building, 
  Calendar, 
  Briefcase, 
  DollarSign, 
  Clock,
  Check,
  Instagram,
  Facebook,
  Linkedin,
  Globe,
  GraduationCap,
  Mail,
  MessageSquare
} from "lucide-react";
import AppLayout from "@/components/layout/app-layout";

interface UserProfileData {
  id: string;
  full_name: string;
  bio: string;
  username: string;
  in_real_estate_since: string | null;
  business_name: string | null;
  type_of_buyer: string[] | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  profile_photo_url: string | null;
  created_at: string;
  join_number: number | null;
  profile_completion_score: number | null;
  location: string | null;
  markets: string[] | null;
  property_types: string[] | null;
  property_conditions: string[] | null;
  ideal_budget_min: number | null;
  ideal_budget_max: number | null;
  financing_methods: string[] | null;
  preferred_financing_method: string | null;
  closing_timeline: string | null;
  number_of_deals_last_12_months: number | null;
  goal_deals_next_12_months: number | null;
  total_deals_done: number | null;
  current_portfolio_count: number | null;
  buyer_verification_tag: string | null;
}

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!username) {
          setError("No username provided");
          return;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setProfileData(data as UserProfileData);
        } else {
          setError("User not found");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [username]);
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Format currency
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "N/A";
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Calculate experience years
  const calculateExperienceYears = (dateString: string | null) => {
    if (!dateString) return "N/A";
    
    const startDate = new Date(dateString);
    const now = new Date();
    let years = now.getFullYear() - startDate.getFullYear();
    
    // Adjust if we haven't reached the anniversary month yet
    if (now.getMonth() < startDate.getMonth() || 
        (now.getMonth() === startDate.getMonth() && now.getDate() < startDate.getDate())) {
      years--;
    }
    
    return `${years} year${years !== 1 ? 's' : ''}`;
  };
  
  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto py-10 px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <div className="flex flex-col items-center">
                <Skeleton className="h-32 w-32 rounded-full" />
                <Skeleton className="h-6 w-32 mt-4" />
                <Skeleton className="h-4 w-24 mt-2" />
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-5/6 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  if (error || !profileData) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto py-10 px-4 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-700 mb-6">{error || "Something went wrong"}</p>
          <Button onClick={() => window.history.back()} className="bg-[#09261E] hover:bg-[#09261E]/90">
            Go Back
          </Button>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left sidebar */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-24">
              <div className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4 ring-4 ring-offset-2 ring-[#09261E]/30">
                  <AvatarImage src={profileData.profile_photo_url || ""} alt={profileData.full_name} />
                  <AvatarFallback className="bg-[#09261E] text-white text-3xl font-medium">
                    {profileData.full_name?.charAt(0) || profileData.username?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <h1 className="text-xl font-bold">{profileData.full_name}</h1>
                <p className="text-gray-500 mb-2">@{profileData.username}</p>
                
                {profileData.buyer_verification_tag && (
                  <Badge className="bg-green-600 mb-4">
                    <Check className="h-3 w-3 mr-1" /> {profileData.buyer_verification_tag}
                  </Badge>
                )}
                
                <div className="w-full space-y-3 mt-4">
                  <Button 
                    className="w-full bg-[#09261E] hover:bg-[#09261E]/90"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
                
                {/* Social links */}
                <div className="flex gap-2 mt-6">
                  {profileData.instagram && (
                    <a 
                      href={`https://instagram.com/${profileData.instagram.replace('@', '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Instagram className="h-5 w-5 text-gray-700" />
                    </a>
                  )}
                  
                  {profileData.facebook && (
                    <a 
                      href={`https://facebook.com/${profileData.facebook}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Facebook className="h-5 w-5 text-gray-700" />
                    </a>
                  )}
                  
                  {profileData.linkedin && (
                    <a 
                      href={`https://linkedin.com/in/${profileData.linkedin}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Linkedin className="h-5 w-5 text-gray-700" />
                    </a>
                  )}
                  
                  {profileData.website && (
                    <a 
                      href={profileData.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Globe className="h-5 w-5 text-gray-700" />
                    </a>
                  )}
                </div>
                
                {/* Member info */}
                <div className="w-full mt-6 pt-6 border-t text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Member since</span>
                    <span className="font-medium">{formatDate(profileData.created_at)}</span>
                  </div>
                  {profileData.join_number && (
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Member #</span>
                      <span className="font-medium">{profileData.join_number}</span>
                    </div>
                  )}
                  <div className="mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Profile Completion</span>
                      <span className="font-medium">{profileData.profile_completion_score || 0}%</span>
                    </div>
                    <Progress value={profileData.profile_completion_score || 0} className="h-1.5 mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="w-full md:w-2/3 space-y-6">
            {/* Bio section */}
            <Card className="border border-gray-100 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center text-[#09261E]">
                  <User className="h-5 w-5 mr-2" />
                  About
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {profileData.bio || "No bio provided."}
                </p>
                
                {(profileData.business_name || profileData.in_real_estate_since) && (
                  <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData.business_name && (
                      <div className="flex items-start">
                        <Briefcase className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Business</p>
                          <p className="font-medium">{profileData.business_name}</p>
                        </div>
                      </div>
                    )}
                    
                    {profileData.in_real_estate_since && (
                      <div className="flex items-start">
                        <GraduationCap className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Experience</p>
                          <p className="font-medium">{calculateExperienceYears(profileData.in_real_estate_since)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Location & Investment Criteria */}
            <Card className="border border-gray-100 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center text-[#09261E]">
                  <Building className="h-5 w-5 mr-2" />
                  Investment Criteria
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {profileData.location && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{profileData.location}</p>
                      </div>
                    </div>
                  )}
                  
                  {profileData.markets && profileData.markets.length > 0 && (
                    <div className="flex items-start">
                      <Building className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Target Markets</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profileData.markets.map(market => (
                            <Badge key={market} variant="secondary" className="bg-gray-100 text-gray-700">
                              {market}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {profileData.property_types && profileData.property_types.length > 0 && (
                    <div className="flex items-start">
                      <Building className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Property Types</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profileData.property_types.map(type => (
                            <Badge key={type} variant="secondary" className="bg-gray-100 text-gray-700">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {profileData.property_conditions && profileData.property_conditions.length > 0 && (
                    <div className="flex items-start">
                      <Building className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Property Conditions</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profileData.property_conditions.map(condition => (
                            <Badge key={condition} variant="secondary" className="bg-gray-100 text-gray-700">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {(profileData.ideal_budget_min !== null || profileData.ideal_budget_max !== null) && (
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Budget Range</p>
                        <p className="font-medium">
                          {profileData.ideal_budget_min !== null ? formatCurrency(profileData.ideal_budget_min) : "Any"} 
                          {" - "}
                          {profileData.ideal_budget_max !== null ? formatCurrency(profileData.ideal_budget_max) : "Any"}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {profileData.financing_methods && profileData.financing_methods.length > 0 && (
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Financing Methods</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profileData.financing_methods.map(method => (
                            <Badge 
                              key={method} 
                              variant="secondary" 
                              className={`${method === profileData.preferred_financing_method ? 'bg-[#09261E] text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {profileData.closing_timeline && (
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Closing Timeline</p>
                        <p className="font-medium">{profileData.closing_timeline}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Deal History */}
            {(profileData.total_deals_done !== null || 
              profileData.number_of_deals_last_12_months !== null || 
              profileData.current_portfolio_count !== null) && (
              <Card className="border border-gray-100 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center text-[#09261E]">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Deal Activity
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {profileData.total_deals_done !== null && (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-[#09261E]">{profileData.total_deals_done}</p>
                        <p className="text-sm text-gray-500 mt-1">Total Deals</p>
                      </div>
                    )}
                    
                    {profileData.number_of_deals_last_12_months !== null && (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-[#09261E]">{profileData.number_of_deals_last_12_months}</p>
                        <p className="text-sm text-gray-500 mt-1">Deals Last 12mo</p>
                      </div>
                    )}
                    
                    {profileData.current_portfolio_count !== null && (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-[#09261E]">{profileData.current_portfolio_count}</p>
                        <p className="text-sm text-gray-500 mt-1">Properties Owned</p>
                      </div>
                    )}
                    
                    {profileData.goal_deals_next_12_months !== null && (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-[#09261E]">{profileData.goal_deals_next_12_months}</p>
                        <p className="text-sm text-gray-500 mt-1">Deal Goal (Next 12mo)</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Type of Buyer */}
            {profileData.type_of_buyer && profileData.type_of_buyer.length > 0 && (
              <Card className="border border-gray-100 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center text-[#09261E]">
                    <User className="h-5 w-5 mr-2" />
                    Buyer Type
                  </h2>
                  
                  <div className="flex flex-wrap gap-2">
                    {profileData.type_of_buyer.map(type => (
                      <Badge 
                        key={type} 
                        className="bg-[#09261E] hover:bg-[#09261E]/90 text-white py-1 px-3 text-sm"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}