import React, { useState } from "react";
import { Link } from "wouter";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Share2,
  CalendarPlus,
  ExternalLink,
  User,
  MessageSquare,
  Globe,
  Check,
  ChevronDown,
  ChevronUp,
  Heart,
  Bookmark,
  Mail,
  Tag,
  Link as LinkIcon,
  Laptop
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

export interface EventDetailProps {
  slug: string;
}

export default function EventDetailPage({ slug }: EventDetailProps) {
  const { toast } = useToast();
  const [isRegistered, setIsRegistered] = useState(false);

  // For a real implementation, we would fetch the event data based on the slug
  // For now, we'll use a mock event
  const event = {
    id: "1",
    title: "Morning Coffee & Real Estate Networking",
    slug: "morning-coffee-real-estate-networking",
    description: `Start your day with property professionals over coffee. Connect with local agents, investors, and contractors in a casual setting before your workday begins.

This is the perfect opportunity to:
- Meet local real estate professionals in a relaxed environment
- Share ideas and discuss current market trends
- Build your network of contacts for future collaborations
- Get insights from experienced professionals

Coffee and light breakfast will be provided. Bring plenty of business cards!`,
    shortDescription: "Start your day networking with local real estate professionals.",
    imageUrl: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80",
    startTime: "8:00 AM",
    endTime: "9:30 AM",
    date: "May 15, 2025",
    host: {
      name: "Seattle Real Estate Network",
      imageUrl: "https://images.unsplash.com/photo-1560250097-67d73290d5e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
      bio: "Seattle's premier real estate networking group for professionals of all experience levels.",
    },
    attendees: 48,
    attendeesList: [
      { name: "John Smith", role: "Agent", imageUrl: "https://i.pravatar.cc/150?img=1" },
      { name: "Emily Johnson", role: "Investor", imageUrl: "https://i.pravatar.cc/150?img=5" },
      { name: "Michael Davis", role: "Broker", imageUrl: "https://i.pravatar.cc/150?img=3" },
    ],
    location: "Uptown Coffee, Seattle",
    address: "123 Main Street, Seattle, WA 98101",
    type: "in-person",
    category: "morning",
    tags: ["Networking", "Residential", "Coffee"],
    agenda: [
      { time: "8:00 AM - 8:15 AM", title: "Check-in & Coffee" },
      { time: "8:15 AM - 8:30 AM", title: "Welcome & Introductions" },
      { time: "8:30 AM - 9:15 AM", title: "Structured Networking" },
      { time: "9:15 AM - 9:30 AM", title: "Final Remarks & Next Steps" }
    ],
    group: {
      name: "Seattle Real Estate Network",
      memberCount: 364,
      description: "A community of real estate professionals in the Seattle area focused on networking, education, and deal-making."
    }
  };

  const handleRegister = () => {
    setIsRegistered(!isRegistered);
    
    if (!isRegistered) {
      toast({
        title: "Registration Successful!",
        description: "You're now registered for this event. We've added it to your calendar.",
      });
    } else {
      toast({
        title: "Registration Cancelled",
        description: "You've cancelled your registration for this event.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    // In a real implementation, this would open a share dialog
    toast({
      title: "Share Link Copied!",
      description: "Event link has been copied to your clipboard.",
    });
  };

  const handleAddToCalendar = () => {
    // In a real implementation, this would create a calendar event
    toast({
      title: "Added to Calendar",
      description: "Event has been added to your calendar.",
    });
  };

  const handleJoinGroup = () => {
    toast({
      title: "Joined Group",
      description: `You've joined ${event.group.name}. You'll receive updates about future events.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/community">
        <Button variant="ghost" className="mb-6 -ml-3">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Event Image */}
          <div className="rounded-xl overflow-hidden mb-6">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-[300px] md:h-[400px] object-cover"
            />
          </div>

          {/* Event Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-[#09261E] hover:bg-[#09261E]/90">
                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
              </Badge>
              
              <Badge variant="outline" className="font-medium">
                {event.type === "online" ? (
                  <><Globe className="h-3 w-3 mr-1" /> Online</>
                ) : event.type === "hybrid" ? (
                  <><Laptop className="h-3 w-3 mr-1" /> Hybrid</>
                ) : (
                  <><MapPin className="h-3 w-3 mr-1" /> In-Person</>
                )}
              </Badge>
              
              {event.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-[#803344] mr-2" />
                <span className="font-medium">{event.date}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-[#803344] mr-2" />
                <span>{event.startTime} - {event.endTime}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-[#803344] mr-2" />
                <span>{event.location}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={event.host.imageUrl} alt={event.host.name} />
                <AvatarFallback>{event.host.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-gray-500">Hosted by</p>
                <p className="font-medium">{event.host.name}</p>
              </div>
            </div>
          </div>

          {/* Event Description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">About this event</h2>
            <div className="prose max-w-none prose-p:my-2 prose-ul:my-2">
              {event.description.split('\n\n').map((paragraph, idx) => {
                if (paragraph.includes('- ')) {
                  const [title, ...listItems] = paragraph.split('\n');
                  return (
                    <div key={idx}>
                      <p>{title}</p>
                      <ul>
                        {listItems.map((item, i) => (
                          <li key={i}>{item.replace('- ', '')}</li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                return <p key={idx}>{paragraph}</p>;
              })}
            </div>
          </div>

          {/* Event Agenda */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Event Agenda</h2>
            <div className="space-y-3">
              {event.agenda.map((item, index) => (
                <div key={index} className="flex border-l-2 border-[#803344] pl-4 py-2">
                  <div className="mr-4">
                    <div className="w-2 h-2 rounded-full bg-[#803344] -ml-5"></div>
                    <p className="text-sm font-medium text-gray-500">{item.time}</p>
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          {event.type !== "online" && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Location</h2>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-2">{event.location}</h3>
                      <p className="text-gray-600 mb-4">{event.address}</p>
                      <Button variant="outline" className="w-full sm:w-auto">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                    <div className="flex-1 h-48 bg-gray-200 rounded-md">
                      {/* Placeholder for a map */}
                      <div className="h-full flex items-center justify-center text-gray-400">
                        Map would be displayed here
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Attendees */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Who's Coming</h2>
              <span className="text-gray-500">{event.attendees} attending</span>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              {event.attendeesList.map((attendee, index) => (
                <Avatar key={index} className="h-10 w-10 border-2 border-white -ml-2 first:ml-0">
                  <AvatarImage src={attendee.imageUrl} alt={attendee.name} />
                  <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {event.attendees > event.attendeesList.length && (
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white -ml-2">
                  <span className="text-sm text-gray-500 font-medium">+{event.attendees - event.attendeesList.length}</span>
                </div>
              )}
            </div>
            
            <Accordion type="single" collapsible>
              <AccordionItem value="attendees">
                <AccordionTrigger className="text-[#09261E]">
                  See all attendees
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                    {event.attendeesList.map((attendee, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={attendee.imageUrl} alt={attendee.name} />
                          <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{attendee.name}</p>
                          <p className="text-xs text-gray-500">{attendee.role}</p>
                        </div>
                      </div>
                    ))}
                    {/* Placeholder for additional attendees */}
                    {event.attendees > event.attendeesList.length && (
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">More Attendees</p>
                          <p className="text-xs text-gray-500">Register to see all</p>
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Host Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">About the Host</h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={event.host.imageUrl} alt={event.host.name} />
                    <AvatarFallback>{event.host.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{event.host.name}</h3>
                    <p className="text-gray-600 mb-4">{event.host.bio}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Group */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Join the Community</h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={event.host.imageUrl} alt={event.group.name} />
                    <AvatarFallback>{event.group.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{event.group.name}</h3>
                        <p className="text-gray-600 mb-1">{event.group.memberCount} members</p>
                      </div>
                      <Button 
                        className="bg-[#09261E] hover:bg-[#09261E]/90"
                        onClick={handleJoinGroup}
                      >
                        Join Group
                      </Button>
                    </div>
                    <p className="text-gray-600 mt-3">{event.group.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">Register for this Event</h3>
                  <p className="text-gray-600 mb-1">
                    <Clock className="inline-block h-4 w-4 mr-2" />
                    {event.date}, {event.startTime} - {event.endTime}
                  </p>
                  <p className="text-gray-600 mb-4">
                    <MapPin className="inline-block h-4 w-4 mr-2" />
                    {event.location}
                  </p>
                  <Button 
                    className={`w-full mb-3 ${
                      isRegistered 
                        ? "bg-white text-[#09261E] border border-[#09261E]"
                        : "bg-[#09261E] hover:bg-[#09261E]/90"
                    }`}
                    onClick={handleRegister}
                  >
                    {isRegistered ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Registered
                      </>
                    ) : "Register Now"}
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleAddToCalendar}
                    >
                      <CalendarPlus className="h-4 w-4 mr-2" />
                      Add to Calendar
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Attendees</span>
                    <span>{event.attendees}</span>
                  </div>
                  
                  <div className="flex -space-x-2 mb-4">
                    {event.attendeesList.map((attendee, index) => (
                      <Avatar key={index} className="h-8 w-8 border-2 border-white">
                        <AvatarImage src={attendee.imageUrl} alt={attendee.name} />
                        <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {event.attendees > event.attendeesList.length && (
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white">
                        <span className="text-xs text-gray-500 font-medium">+{event.attendees - event.attendeesList.length}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button variant="ghost" className="w-full text-[#09261E] border hover:bg-[#09261E]/5">
                    <Mail className="h-4 w-4 mr-2" />
                    Invite Others
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Save for Later</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2 text-red-500" />
                    Like
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bookmark className="h-4 w-4 mr-2 text-[#803344]" />
                    Save
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <LinkIcon className="h-4 w-4 mr-2 text-blue-500" />
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}