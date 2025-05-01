import React, { useState } from "react";
import { Link } from "wouter";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Share2, 
  Plus, 
  Search, 
  ChevronRight,
  Tag, 
  Sun, 
  Sunset, 
  Moon,
  Globe,
  Coffee,
  BellPlus,
  Laptop,
  SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define the Event interface
interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  startTime: string;
  endTime: string;
  date: string;
  host: {
    name: string;
    imageUrl?: string;
  };
  attendees: number;
  location: string;
  type: "online" | "in-person" | "hybrid";
  category: string;
  tags: string[];
}

// Mock data for events
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Morning Coffee & Real Estate Networking",
    slug: "morning-coffee-real-estate-networking",
    description: "Start your day with property professionals over coffee. Connect with local agents, investors, and contractors in a casual setting before your workday begins.",
    shortDescription: "Start your day networking with local real estate professionals.",
    imageUrl: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80",
    startTime: "8:00 AM",
    endTime: "9:30 AM",
    date: "May 15, 2025",
    host: {
      name: "Seattle Real Estate Network",
      imageUrl: "https://images.unsplash.com/photo-1560250097-67d73290d5e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
    },
    attendees: 48,
    location: "Uptown Coffee, Seattle",
    type: "in-person",
    category: "morning",
    tags: ["Networking", "Residential", "Coffee"],
  },
  {
    id: "2",
    title: "Commercial Real Estate Masterclass",
    slug: "commercial-real-estate-masterclass",
    description: "Join industry experts for an in-depth look at commercial real estate investing strategies, market analysis, and deal structuring for 2025.",
    shortDescription: "Learn commercial real estate strategies from industry leaders.",
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2301&q=80",
    startTime: "1:00 PM",
    endTime: "4:00 PM",
    date: "May 18, 2025",
    host: {
      name: "Commercial Property Investors Alliance",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
    },
    attendees: 112,
    location: "Online",
    type: "online",
    category: "afternoon",
    tags: ["Commercial", "Education", "Investing"],
  },
  {
    id: "3",
    title: "Property Tech Happy Hour",
    slug: "property-tech-happy-hour",
    description: "Network with proptech founders, investors, and real estate professionals. Discover the latest innovations changing the industry over drinks and appetizers.",
    shortDescription: "Network with proptech innovators over drinks and appetizers.",
    imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80",
    startTime: "6:30 PM",
    endTime: "9:00 PM",
    date: "May 20, 2025",
    host: {
      name: "PropTech Innovators",
      imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    },
    attendees: 87,
    location: "Tech Hub Downtown, Seattle",
    type: "in-person",
    category: "evening",
    tags: ["PropTech", "Networking", "Innovation"],
  },
  {
    id: "4",
    title: "First-Time Home Buyer Workshop",
    slug: "first-time-home-buyer-workshop",
    description: "Everything you need to know about purchasing your first home in today's market. Expert advice on financing, the buying process, and what to look for during viewings.",
    shortDescription: "Learn the essentials of buying your first home in today's market.",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    date: "May 22, 2025",
    host: {
      name: "HomeOwnership Coalition",
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80",
    },
    attendees: 65,
    location: "Community Center, Bellevue",
    type: "hybrid",
    category: "morning",
    tags: ["Education", "Residential", "First-Time Buyers"],
  },
  {
    id: "5",
    title: "Investment Property Deal Analysis",
    slug: "investment-property-deal-analysis",
    description: "Learn how to properly analyze rental properties, fix-and-flips, and commercial deals. Live case studies and spreadsheet templates included.",
    shortDescription: "Master investment property analysis with live case studies.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2015&q=80",
    startTime: "2:00 PM",
    endTime: "5:00 PM",
    date: "May 24, 2025",
    host: {
      name: "REI Analysis Group",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    },
    attendees: 93,
    location: "Online",
    type: "online",
    category: "afternoon",
    tags: ["Investing", "Analysis", "Education"],
  },
  {
    id: "6",
    title: "Luxury Property Showcase",
    slug: "luxury-property-showcase",
    description: "Exclusive evening of luxury property viewings, networking with high-net-worth investors, and discussions on the premium market trends.",
    shortDescription: "Exclusive networking with luxury property professionals.",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2075&q=80",
    startTime: "7:00 PM",
    endTime: "10:00 PM",
    date: "May 26, 2025",
    host: {
      name: "Pinnacle Properties",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
    },
    attendees: 36,
    location: "The Grand Hotel, Downtown",
    type: "in-person",
    category: "evening",
    tags: ["Luxury", "Networking", "High-End"],
  },
];

// Featured event (the first one for now)
const featuredEvent = mockEvents[0];

// Event category components with their respective icons
interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  isActive?: boolean;
  onClick: () => void;
}

const CategoryCard = ({ title, description, icon, count, isActive, onClick }: CategoryCardProps) => (
  <Card 
    className={cn(
      "cursor-pointer transition-all hover:shadow-md",
      isActive ? "border-2 border-[#09261E]" : "border"
    )}
    onClick={onClick}
  >
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {icon}
            <h3 className="font-bold text-lg">{title}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          <span className="text-xs font-medium text-[#09261E]">{count} events</span>
        </div>
        <ChevronRight className="text-gray-400" />
      </div>
    </CardContent>
  </Card>
);

// Event card component
interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => (
  <Link href={`/community/${event.slug}`}>
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer h-full flex flex-col">
      <div className="relative h-48">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge 
            variant="outline" 
            className={cn(
              "font-medium text-xs bg-white/90 backdrop-blur-sm", 
              event.type === "online" ? "text-blue-600" : 
              event.type === "hybrid" ? "text-purple-600" : "text-green-600"
            )}
          >
            {event.type === "online" ? (
              <><Globe className="h-3 w-3 mr-1" /> Online</>
            ) : event.type === "hybrid" ? (
              <><Laptop className="h-3 w-3 mr-1" /> Hybrid</>
            ) : (
              <><MapPin className="h-3 w-3 mr-1" /> In-Person</>
            )}
          </Badge>
          
          {event.category === "morning" && (
            <Badge variant="outline" className="font-medium text-xs bg-white/90 backdrop-blur-sm text-amber-600">
              <Sun className="h-3 w-3 mr-1" /> Morning
            </Badge>
          )}
          
          {event.category === "afternoon" && (
            <Badge variant="outline" className="font-medium text-xs bg-white/90 backdrop-blur-sm text-orange-600">
              <Sunset className="h-3 w-3 mr-1" /> Afternoon
            </Badge>
          )}
          
          {event.category === "evening" && (
            <Badge variant="outline" className="font-medium text-xs bg-white/90 backdrop-blur-sm text-indigo-600">
              <Moon className="h-3 w-3 mr-1" /> Evening
            </Badge>
          )}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2 flex items-center">
          <Calendar className="h-4 w-4 text-gray-500 mr-1.5" />
          <span className="text-sm text-gray-600">{event.date}</span>
          <span className="mx-2 text-gray-300">•</span>
          <Clock className="h-4 w-4 text-gray-500 mr-1.5" />
          <span className="text-sm text-gray-600">{event.startTime}</span>
        </div>
        
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{event.title}</h3>
        
        <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-2">{event.shortDescription}</p>
        
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <span className="text-sm font-medium">Hosted by {event.host.name}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-1" />
            <span>{event.attendees}</span>
          </div>
        </div>
        
        <div className="flex gap-2 mb-4 flex-wrap">
          {event.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <Button className="w-full bg-[#09261E] text-white hover:bg-[#09261E]/90">
          Register
        </Button>
      </div>
    </div>
  </Link>
);

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("discover");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Filter events based on active category
  const filteredEvents = activeCategory 
    ? mockEvents.filter(event => event.category === activeCategory)
    : mockEvents;
  
  // Group events by purpose for the discover feed
  const networkingEvents = mockEvents.filter(event => 
    event.tags.some(tag => ['Networking', 'Connection', 'Social'].includes(tag))
  );
  
  const educationalEvents = mockEvents.filter(event => 
    event.tags.some(tag => ['Education', 'Learning', 'Workshop', 'Masterclass'].includes(tag))
  );
  
  const investmentEvents = mockEvents.filter(event => 
    event.tags.some(tag => ['Investing', 'Investment', 'Analysis'].includes(tag))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Tabs */}
      <div className="mb-8 flex justify-center">
        <div className="flex items-center bg-gray-200 p-1 rounded-full shadow-sm relative h-10 w-[240px]">
          <div 
            className={`absolute inset-y-1 w-[118px] ${
              activeTab === 'my-events' ? 'right-1 translate-x-0' : 'left-1 translate-x-0'
            } bg-white rounded-full shadow transition-all duration-300 ease-in-out`}
          ></div>
          <button
            className={`relative z-10 flex items-center justify-center px-4 py-1.5 rounded-full transition-all duration-200 w-[118px] ${
              activeTab === 'discover' 
                ? 'text-[#09261E] font-medium' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab("discover")}
          >
            <span className="text-sm">Discover</span>
          </button>
          
          <button
            className={`relative z-10 flex items-center justify-center px-4 py-1.5 rounded-full transition-all duration-200 w-[118px] ${
              activeTab === 'my-events' 
                ? 'text-[#09261E] font-medium' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab("my-events")}
          >
            <span className="text-sm">My Events</span>
          </button>
        </div>
      </div>
      
      {activeTab === "discover" ? (
        <>
          {/* Hero/Featured Event */}
          <div className="relative rounded-xl overflow-hidden mb-12 group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10"></div>
            <img 
              src={featuredEvent.imageUrl} 
              alt={featuredEvent.title} 
              className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{featuredEvent.date} • {featuredEvent.startTime}</span>
              </div>
              <h2 className="text-3xl font-bold mb-3">{featuredEvent.title}</h2>
              <p className="text-white/90 mb-6 max-w-3xl">{featuredEvent.shortDescription}</p>
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-[#09261E] hover:bg-white/90"
                >
                  Register Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Add to Calendar
                </Button>
              </div>
            </div>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Search events, topics, or hosts..." 
                className="pl-10 py-6 border-gray-300"
              />
            </div>
            <Button 
              variant="outline" 
              className="px-4 py-2 border-gray-300"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button
              className="bg-[#09261E] hover:bg-[#09261E]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
          
          {/* Event Categories */}
          <h2 className="text-2xl font-bold mb-4">Event Categories</h2>
          <ScrollArea className="mb-12 whitespace-nowrap pb-4">
            <div className="flex gap-4 w-full">
              <CategoryCard 
                title="Morning Networking" 
                description="Start your day connecting with real estate professionals"
                icon={<Sun className="h-5 w-5 text-amber-500" />}
                count={mockEvents.filter(e => e.category === "morning").length}
                isActive={activeCategory === "morning"}
                onClick={() => setActiveCategory(activeCategory === "morning" ? null : "morning")}
              />
              <CategoryCard 
                title="Afternoon Learning" 
                description="Midday workshops and educational sessions"
                icon={<Sunset className="h-5 w-5 text-orange-500" />}
                count={mockEvents.filter(e => e.category === "afternoon").length}
                isActive={activeCategory === "afternoon"}
                onClick={() => setActiveCategory(activeCategory === "afternoon" ? null : "afternoon")}
              />
              <CategoryCard 
                title="Evening Connections" 
                description="After-hours mixers and premium networking"
                icon={<Moon className="h-5 w-5 text-indigo-500" />}
                count={mockEvents.filter(e => e.category === "evening").length}
                isActive={activeCategory === "evening"}
                onClick={() => setActiveCategory(activeCategory === "evening" ? null : "evening")}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          
          {/* Event Feeds */}
          {activeCategory ? (
            <>
              <h2 className="text-2xl font-bold mb-6">
                {activeCategory === "morning" ? "Morning Networking Events" : 
                 activeCategory === "afternoon" ? "Afternoon Learning Events" : 
                 "Evening Connection Events"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Networking Events */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Make Connections in Real Estate Events</h2>
                  <Button variant="link" className="text-[#09261E]">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {networkingEvents.slice(0, 3).map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
              
              {/* Educational Events */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Learn from Experts in Real Estate Strategy</h2>
                  <Button variant="link" className="text-[#09261E]">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {educationalEvents.slice(0, 3).map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
              
              {/* Investment Events */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Explore Local or Online Investment Meetups</h2>
                  <Button variant="link" className="text-[#09261E]">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {investmentEvents.slice(0, 3).map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        // My Events Tab
        <div>
          <Tabs defaultValue="upcoming" className="w-full mb-8">
            <TabsList className="grid max-w-md grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="hosting">Hosting</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="pt-6">
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No upcoming events</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  You don't have any upcoming events. Discover and register for events to see them here.
                </p>
                <Button
                  className="bg-[#09261E] hover:bg-[#09261E]/90"
                  onClick={() => setActiveTab("discover")}
                >
                  Discover Events
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="past" className="pt-6">
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full">
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No past events</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Your event history will appear here after you've attended events.
                </p>
                <Button
                  className="bg-[#09261E] hover:bg-[#09261E]/90"
                  onClick={() => setActiveTab("discover")}
                >
                  Browse Events
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="hosting" className="pt-6">
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Not hosting any events</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Create and host your own events to connect with the PropertyDeals community.
                </p>
                <Button
                  className="bg-[#09261E] hover:bg-[#09261E]/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create an Event
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

