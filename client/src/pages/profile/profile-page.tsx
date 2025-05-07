import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

// Icons
import {
  UserCircle, Shield, CreditCard, AlertTriangle, 
  LogOut, ExternalLink, Upload, Check, Info, 
  Briefcase, MapPin, Building, Clock, Hash, ChevronRight,
  DollarSign, FileText, User, Calendar, Star, Home,
  FileBadge, Download, Award, Users, Wrench, Heart,
  Wallet, PenTool, BookLock, BookCheck, Landmark, PiggyBank,
  Map, Settings as SettingsIcon, ArrowUpRight, 
  Facebook as FacebookIcon, Instagram, Linkedin, Target, 
  Bell, HelpCircle, MessageSquare, Flag, Globe
} from "lucide-react";

// Profile MenuItem component
const ProfileMenuItem = ({ 
  icon, 
  label, 
  href, 
  active = false,
  danger = false,
  onClick
}: { 
  icon: React.ReactNode; 
  label: string; 
  href?: string; 
  active?: boolean;
  danger?: boolean;
  onClick?: () => void;
}) => {
  return (
    <a 
      href={href}
      onClick={onClick}
      className={`flex items-center px-4 py-2.5 text-sm rounded-md transition-all duration-200 text-${danger ? 'red-500' : 'gray-700'} ${
        active 
          ? `bg-${danger ? 'red-50/70' : '[#09261E]/10'} text-${danger ? 'red-600' : '[#09261E]'} font-medium shadow-sm` 
          : `hover:bg-${danger ? 'red-50/80' : 'gray-100/80'} hover:text-${danger ? 'red-600' : 'gray-900'}`
      } my-0.5 w-full`}
    >
      <span className={`mr-3 text-${danger ? 'red-500/80' : 'gray-500'}`}>{icon}</span>
      <span>{label}</span>
      {active && <ChevronRight size={16} className="ml-auto" />}
    </a>
  );
};

// ProfileData type definition for TypeScript
interface ProfileData {
  id: string;
  full_name: string;
  bio: string | null;
  username: string;
  email: string;
  phone: string | null;
  in_real_estate_since: number | null;
  business_name: string | null;
  type_of_buyer: string[];
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  profile_photo_url: string | null;
  profile_banner_url: string | null; // New field for banner image
  created_at: string;
  join_number: number | null;
  profile_completion_score: number;
  location: string | null;
  markets: string[];
  property_types: string[];
  property_conditions: string[];
  ideal_budget_min: number | null;
  ideal_budget_max: number | null;
  financing_methods: string[];
  preferred_financing_method: string | null;
  closing_timeline: string | null;
  number_of_deals_last_12_months: number | null;
  goal_deals_next_12_months: number | null;
  total_deals_done: number | null;
  current_portfolio_count: number | null;
  buyer_verification_tag: string | null;
  proof_of_funds_url: string | null;
  proof_of_funds_verified: boolean;
  preferred_inspectors: string[];
  preferred_agents: string[];
  preferred_contractors: string[];
  preferred_lenders: string[];
  showProfile: boolean;
  [key: string]: any; // Index signature for dynamic access
}

// Options for various selections
const buyerTypeOptions = [
  "Individual Investor", "Real Estate Agent", "Developer", "Home Buyer", "Wholesaler", "Fix & Flipper", "Corporate Buyer"
];

const marketOptions = [
  "Austin, TX", "Nashville, TN", "Phoenix, AZ", "Tampa, FL", "Indianapolis, IN", 
  "Columbus, OH", "Charlotte, NC", "Denver, CO", "Atlanta, GA", "Dallas, TX"
];

const propertyTypeOptions = [
  "Single Family", "Multi-Family", "Condo/Townhouse", "Commercial", "Industrial",
  "Farm/Agricultural", "Land", "Mobile Home", "Mixed Use"
];

const propertyConditionOptions = [
  "Ready to move in", "Minor repairs needed", "Major renovation needed", "Fixer-upper", "Teardown/Rebuild"
];

const financingMethodOptions = [
  "Cash", "Conventional Loan", "Hard Money", "Private Money", "HELOC", "Subject To", "Creative Financing", "1031 Exchange"
];

const closingTimelineOptions = [
  "Less than 7 days", "7-14 days", "15-30 days", "30-60 days", "Flexible"
];

// Main profile page component
export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Initially use simplified placeholder component
  // until we fix the full implementation
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-white">
      {/* Left sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 border-r border-gray-200 overflow-y-auto h-full">
        <div className="p-4 sticky top-0">
          <h3 className="font-semibold text-lg mb-4">Account Settings</h3>
          
          <div className="flex flex-col space-y-1">
            <ProfileMenuItem 
              icon={<UserCircle size={18} />}
              label="Account Settings"
              href="/profile"
              active={location === '/profile'}
            />
            
            <ProfileMenuItem 
              icon={<Shield size={18} />}
              label="Profile"
              href="/profile/profile"
              active={location === '/profile/profile'}
            />
            
            <ProfileMenuItem 
              icon={<CreditCard size={18} />}
              label="Property Preferences"
              href="/profile/property"
              active={location === '/profile/property'}
            />
            
            <ProfileMenuItem 
              icon={<Bell size={18} />}
              label="Professional Preferences"
              href="/profile/professional"
              active={location === '/profile/professional'}
            />

            <Separator className="my-2" />
            
            <ProfileMenuItem 
              icon={<HelpCircle size={18} />}
              label="Help Center"
              href="/help"
              active={location === '/help'}
            />
            
            <ProfileMenuItem 
              icon={<MessageSquare size={18} />}
              label="Support"
              href="/contact"
              active={location === '/contact'}
            />
            
            <ProfileMenuItem 
              icon={<Flag size={18} />}
              label="Report Issue"
              href="/help/report"
              active={location === '/help/report'}
            />

            <Separator className="my-2" />
            
            <ProfileMenuItem 
              icon={<HelpCircle size={18} />}
              label="Terms & Conditions"
              href="/legal/terms"
              active={location === '/legal/terms'}
            />
            
            <ProfileMenuItem 
              icon={<AlertTriangle size={18} />}
              label="Privacy Policy"
              href="/legal/privacy" 
              active={location === '/legal/privacy'}
            />
            
            <Separator className="my-2" />
            
            <div className="mt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50/80"
                onClick={() => logoutMutation.mutate()}
              >
                <LogOut className="mr-2 h-4 w-4" /> Log Out
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account details and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium mb-1">Full Name</label>
                  <Input
                    id="full_name" 
                    placeholder="Your full name"
                    value={user?.fullName || ""}
                  />
                </div>
                
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
                  <Input
                    id="username" 
                    placeholder="Your username"
                    value={user?.username || ""}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                  <Input
                    id="email" 
                    placeholder="Your email"
                    value={user?.email || ""}
                    disabled
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    id="phone" 
                    placeholder="Your phone number"
                    value=""
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
                <Textarea
                  id="bio" 
                  placeholder="Write something about yourself..."
                  className="min-h-24"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
            <CardDescription>Update your profile picture</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.avatarUrl || ""} alt={user?.fullName || "User"} />
                <AvatarFallback className="text-xl">{user?.fullName?.substring(0, 2) || "U"}</AvatarFallback>
              </Avatar>
              
              <div>
                <Button variant="outline" className="mb-2">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
                <p className="text-xs text-gray-500">
                  Supported formats: JPEG, PNG, GIF, WEBP. Max size 2MB.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}