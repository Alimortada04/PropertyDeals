import { useState } from "react";
import { format } from "date-fns";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { 
  CheckIcon, XIcon, MessageSquareIcon, 
  RefreshCcwIcon, BotIcon, 
  ChevronDownIcon, SearchIcon, FilterIcon,
  CalendarIcon, ExternalLinkIcon, HomeIcon
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

// Mock data for demo
const mockOffers = [
  {
    id: "1",
    property: { id: "p1", name: "Modern Farmhouse", image: "/assets/property-1.jpg" },
    buyer: { id: "b1", name: "John Smith", isRep: true },
    amount: 350000,
    notes: "Looking to close within 30 days. Pre-approved.",
    status: "new",
    timestamp: new Date(2025, 4, 10, 9, 30),
  },
  {
    id: "2",
    property: { id: "p2", name: "Downtown Loft", image: "/assets/property-2.jpg" },
    buyer: { id: "b2", name: "Emma Johnson", isRep: false },
    amount: 425000,
    notes: "Would like to see the property again before finalizing.",
    status: "viewed",
    timestamp: new Date(2025, 4, 9, 15, 45),
  },
  {
    id: "3",
    property: { id: "p1", name: "Modern Farmhouse", image: "/assets/property-1.jpg" },
    buyer: { id: "b3", name: "Michael Davis", isRep: true },
    amount: 355000,
    notes: "Cash offer. Can close in 14 days.",
    status: "countered",
    timestamp: new Date(2025, 4, 8, 11, 20),
  },
  {
    id: "4",
    property: { id: "p3", name: "Suburban Ranch", image: "/assets/property-3.jpg" },
    buyer: { id: "b4", name: "Sarah Wilson", isRep: false },
    amount: 289000,
    notes: "Flexible on closing date.",
    status: "accepted",
    timestamp: new Date(2025, 4, 7, 16, 10),
  },
  {
    id: "5",
    property: { id: "p2", name: "Downtown Loft", image: "/assets/property-2.jpg" },
    buyer: { id: "b5", name: "David Miller", isRep: false },
    amount: 415000,
    notes: "Contingent on home inspection.",
    status: "declined",
    timestamp: new Date(2025, 4, 5, 10, 15),
  },
];

// Status color mapping
const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  viewed: "bg-purple-100 text-purple-800",
  accepted: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
  countered: "bg-amber-100 text-amber-800",
};

// Status display names
const statusNames: Record<string, string> = {
  new: "New",
  viewed: "Viewed",
  accepted: "Accepted",
  declined: "Declined",
  countered: "Countered",
};

interface OffersInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OffersInboxModal({ isOpen, onClose }: OffersInboxModalProps) {
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [counterOffer, setCounterOffer] = useState<string>("");
  const [filters, setFilters] = useState({
    property: "all",
    status: "all",
    buyer: "all",
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
  });
  const [showFilters, setShowFilters] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  // Filter offers based on current filter settings
  const filteredOffers = mockOffers.filter(offer => {
    if (filters.property !== "all" && offer.property.id !== filters.property) return false;
    if (filters.status !== "all" && offer.status !== filters.status) return false;
    if (filters.buyer !== "all" && offer.buyer.id !== filters.buyer) return false;
    if (filters.dateRange.from && offer.timestamp < filters.dateRange.from) return false;
    if (filters.dateRange.to && offer.timestamp > filters.dateRange.to) return false;
    return true;
  });

  // Get unique properties, buyers for filter options
  const properties = Array.from(new Set(mockOffers.map(o => o.property.id)))
    .map(id => {
      const offer = mockOffers.find(o => o.property.id === id);
      return { id, name: offer?.property.name };
    });
  
  const buyers = Array.from(new Set(mockOffers.map(o => o.buyer.id)))
    .map(id => {
      const offer = mockOffers.find(o => o.buyer.id === id);
      return { id, name: offer?.buyer.name };
    });

  // Handle status change
  const handleStatusChange = (offerId: string, newStatus: string) => {
    // In a real app, this would update the offer in the database
    console.log(`Changing offer ${offerId} status to ${newStatus}`);
    
    // Reset selected offer if changing status
    setSelectedOffer(null);
  };

  // Handle counter offer
  const handleCounterOffer = (offerId: string) => {
    if (!counterOffer) return;
    
    // In a real app, this would send the counter offer to the database
    console.log(`Sending counter offer of $${counterOffer} for offer ${offerId}`);
    
    setCounterOffer("");
    setSelectedOffer(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-xl font-semibold">Offers Inbox</DialogTitle>
              <DialogDescription className="text-gray-600">
                Manage all your property offers in one place
              </DialogDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <FilterIcon size={16} />
              Filters
              <ChevronDownIcon size={16} className={cn("transition-transform", showFilters ? "rotate-180" : "")} />
            </Button>
          </div>

          {/* Filters section */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t">
              {/* Property filter */}
              <div className="space-y-2">
                <Label htmlFor="property-filter">Property</Label>
                <Select 
                  value={filters.property} 
                  onValueChange={(val) => setFilters({...filters, property: val})}
                >
                  <SelectTrigger id="property-filter">
                    <SelectValue placeholder="All properties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All properties</SelectItem>
                    {properties.map(property => (
                      <SelectItem key={property.id} value={property.id}>{property.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Status filter */}
              <div className="space-y-2">
                <Label htmlFor="status-filter">Status</Label>
                <Select 
                  value={filters.status} 
                  onValueChange={(val) => setFilters({...filters, status: val})}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {Object.entries(statusNames).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Buyer filter */}
              <div className="space-y-2">
                <Label htmlFor="buyer-filter">Buyer</Label>
                <Select 
                  value={filters.buyer} 
                  onValueChange={(val) => setFilters({...filters, buyer: val})}
                >
                  <SelectTrigger id="buyer-filter">
                    <SelectValue placeholder="All buyers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All buyers</SelectItem>
                    {buyers.map(buyer => (
                      <SelectItem key={buyer.id} value={buyer.id}>{buyer.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Date range filter */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-10"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.from ? (
                        filters.dateRange.to ? (
                          <>
                            {format(filters.dateRange.from, "LLL dd")} -{" "}
                            {format(filters.dateRange.to, "LLL dd")}
                          </>
                        ) : (
                          format(filters.dateRange.from, "LLL dd")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{
                        from: filters.dateRange.from,
                        to: filters.dateRange.to,
                      }}
                      onSelect={(range) => 
                        setFilters({
                          ...filters, 
                          dateRange: { 
                            from: range?.from, 
                            to: range?.to 
                          }
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </DialogHeader>

        {/* Main content */}
        <div className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Offers</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOffers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No offers match your filter criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOffers.map((offer) => (
                        <TableRow key={offer.id} className={cn(
                          offer.status === "new" && "bg-blue-50 font-medium"
                        )}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded bg-gray-200 overflow-hidden">
                                {offer.property.image ? (
                                  <img 
                                    src={offer.property.image} 
                                    alt={offer.property.name} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                                    <HomeIcon size={16} />
                                  </div>
                                )}
                              </div>
                              {offer.property.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {offer.buyer.name}
                              {offer.buyer.isRep && (
                                <Badge variant="outline" className="bg-[#803344] text-white text-xs">
                                  REP
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            ${offer.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("capitalize", statusColors[offer.status])}>
                              {statusNames[offer.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(offer.timestamp, "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="text-right">
                            {selectedOffer === offer.id ? (
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedOffer(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleStatusChange(offer.id, "accepted")}
                                >
                                  Confirm
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => setSelectedOffer(offer.id)}
                                >
                                  <MessageSquareIcon size={16} />
                                  <span className="sr-only">View Details</span>
                                </Button>
                                {offer.status !== "accepted" && offer.status !== "declined" && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-green-600 border-green-200 hover:bg-green-50"
                                      onClick={() => handleStatusChange(offer.id, "accepted")}
                                    >
                                      <CheckIcon size={16} />
                                      <span className="sr-only">Accept</span>
                                    </Button>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8 w-8 p-0 text-amber-600 border-amber-200 hover:bg-amber-50"
                                        >
                                          <RefreshCcwIcon size={16} />
                                          <span className="sr-only">Counter</span>
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-80" align="end">
                                        <div className="space-y-4">
                                          <h4 className="font-medium">Counter Offer</h4>
                                          <div className="space-y-2">
                                            <Label htmlFor="counter-amount">Amount</Label>
                                            <div className="flex gap-2 items-center">
                                              <div className="relative">
                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                                <Input
                                                  id="counter-amount"
                                                  type="text"
                                                  value={counterOffer}
                                                  onChange={(e) => setCounterOffer(e.target.value)}
                                                  className="pl-8"
                                                  placeholder="350,000"
                                                />
                                              </div>
                                              <Button
                                                onClick={() => handleCounterOffer(offer.id)}
                                                disabled={!counterOffer}
                                              >
                                                Send
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50"
                                      onClick={() => handleStatusChange(offer.id, "declined")}
                                    >
                                      <XIcon size={16} />
                                      <span className="sr-only">Decline</span>
                                    </Button>
                                  </>
                                )}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="new" className="mt-0">
              {/* Content for new offers tab */}
              <div className="rounded-md border p-6 text-center text-gray-500">
                Similar table view filtered to show only new offers
              </div>
            </TabsContent>
            
            <TabsContent value="active" className="mt-0">
              {/* Content for active offers tab */}
              <div className="rounded-md border p-6 text-center text-gray-500">
                Similar table view filtered to show only active offers (viewed, countered)
              </div>
            </TabsContent>
            
            <TabsContent value="closed" className="mt-0">
              {/* Content for closed offers tab */}
              <div className="rounded-md border p-6 text-center text-gray-500">
                Similar table view filtered to show only closed offers (accepted, declined)
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Selected offer details drawer */}
        {selectedOffer && (
          <div className="border-t p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium">Offer Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedOffer(null)}>
                <XIcon size={16} />
              </Button>
            </div>
            
            {(() => {
              const offer = mockOffers.find(o => o.id === selectedOffer);
              if (!offer) return null;
              
              return (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{offer.property.name}</h4>
                      <p className="text-sm text-gray-500">
                        Offer from {offer.buyer.name} • {format(offer.timestamp, "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    <Badge className={cn("capitalize", statusColors[offer.status])}>
                      {statusNames[offer.status]}
                    </Badge>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-500">Offer Amount</div>
                        <div className="text-2xl font-semibold">${offer.amount.toLocaleString()}</div>
                      </div>
                      <Button variant="outline" size="sm" className="flex gap-1 items-center">
                        <ExternalLinkIcon size={14} />
                        View in Property
                      </Button>
                    </div>
                  </div>
                  
                  {offer.notes && (
                    <div>
                      <h4 className="font-medium mb-2">Notes</h4>
                      <p className="text-gray-700">{offer.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-3 justify-end pt-4 border-t">
                    <Button 
                      variant="outline"
                      className="gap-2"
                      onClick={() => setAiDrawerOpen(true)}
                    >
                      <BotIcon size={16} />
                      Generate AI Response
                    </Button>
                    <Button 
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleStatusChange(offer.id, "declined")}
                    >
                      Decline
                    </Button>
                    <Button 
                      className="bg-[#135341] hover:bg-[#0d3f30] text-white"
                      onClick={() => handleStatusChange(offer.id, "accepted")}
                    >
                      Accept Offer
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}