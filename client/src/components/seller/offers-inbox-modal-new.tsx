import { useState } from "react";
import { format } from "date-fns";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { 
  CheckIcon, XIcon, MessageSquareIcon, 
  ChevronDownIcon, ChevronUpIcon, DollarSignIcon, 
  UserIcon, BadgeCheckIcon, TrendingUpIcon, 
  StarIcon, SendIcon, LoaderIcon, CalendarIcon
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Enhanced mock data with comprehensive buyer credibility info
const mockOffers = [
  {
    id: "1",
    property: { id: "p1", name: "Modern Farmhouse", image: "/assets/property-1.jpg", purchasePrice: 320000 },
    buyer: { 
      id: "b1", 
      name: "John Smith", 
      username: "johnsmith", 
      isRep: true,
      verified: true,
      pdRating: 4.8,
      recentDeals: 12,
      financingMethod: "Cash",
      avgClosingTime: "18 days"
    },
    amount: 350000,
    message: "Looking to close within 30 days. Pre-approved and ready to move quickly. This property fits perfectly with my investment strategy.",
    status: "new",
    timestamp: new Date(2025, 4, 10, 9, 30),
  },
  {
    id: "2",
    property: { id: "p2", name: "Downtown Loft", image: "/assets/property-2.jpg", purchasePrice: 380000 },
    buyer: { 
      id: "b2", 
      name: "Emma Johnson", 
      username: "emmaj", 
      isRep: false,
      verified: true,
      pdRating: 4.2,
      recentDeals: 3,
      financingMethod: "Conventional Loan",
      avgClosingTime: "35 days"
    },
    amount: 425000,
    message: "Would like to see the property again before finalizing. Very interested and have financing pre-approval.",
    status: "viewed",
    timestamp: new Date(2025, 4, 9, 15, 45),
  },
  {
    id: "3",
    property: { id: "p1", name: "Modern Farmhouse", image: "/assets/property-1.jpg", purchasePrice: 320000 },
    buyer: { 
      id: "b3", 
      name: "Michael Davis", 
      username: "mdavis", 
      isRep: true,
      verified: true,
      pdRating: 4.9,
      recentDeals: 25,
      financingMethod: "Cash",
      avgClosingTime: "14 days"
    },
    amount: 355000,
    message: "Cash offer. Can close in 14 days. No contingencies. Serious buyer with track record.",
    status: "countered",
    timestamp: new Date(2025, 4, 8, 11, 20),
  },
  {
    id: "4",
    property: { id: "p3", name: "Suburban Ranch", image: "/assets/property-3.jpg", purchasePrice: 265000 },
    buyer: { 
      id: "b4", 
      name: "Sarah Wilson", 
      username: "sarahw", 
      isRep: false,
      verified: false,
      pdRating: 3.8,
      recentDeals: 1,
      financingMethod: "FHA Loan",
      avgClosingTime: "45 days"
    },
    amount: 289000,
    message: "Flexible on closing date. First-time investor but very motivated.",
    status: "accepted",
    timestamp: new Date(2025, 4, 7, 16, 10),
  },
  {
    id: "5",
    property: { id: "p2", name: "Downtown Loft", image: "/assets/property-2.jpg", purchasePrice: 380000 },
    buyer: { 
      id: "b5", 
      name: "David Miller", 
      username: "davidm", 
      isRep: false,
      verified: true,
      pdRating: 4.1,
      recentDeals: 5,
      financingMethod: "Portfolio Loan",
      avgClosingTime: "28 days"
    },
    amount: 415000,
    message: "Contingent on home inspection. Willing to work with reasonable repair requests.",
    status: "declined",
    timestamp: new Date(2025, 4, 5, 10, 15),
  },
];

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  viewed: "bg-purple-100 text-purple-800 border-purple-200",
  accepted: "bg-green-100 text-green-800 border-green-200",
  declined: "bg-red-100 text-red-800 border-red-200",
  countered: "bg-amber-100 text-amber-800 border-amber-200",
  active: "bg-orange-100 text-orange-800 border-orange-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200",
};

const statusNames: Record<string, string> = {
  new: "New",
  viewed: "Viewed", 
  accepted: "Accepted",
  declined: "Declined",
  countered: "Countered",
  active: "Active",
  closed: "Closed",
};

interface OffersInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OffersInboxModal({ isOpen, onClose }: OffersInboxModalProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [expandedOffers, setExpandedOffers] = useState<Set<string>>(new Set());
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedBuyer, setSelectedBuyer] = useState("all");
  const [dateRange, setDateRange] = useState<{from?: Date; to?: Date}>({});
  const [counterAmount, setCounterAmount] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Get unique properties and buyers for filters
  const uniqueProperties = Array.from(new Set(mockOffers.map(o => o.property.id)))
    .map(id => mockOffers.find(o => o.property.id === id)!.property);
  
  const uniqueBuyers = Array.from(new Set(mockOffers.map(o => o.buyer.id)))
    .map(id => mockOffers.find(o => o.buyer.id === id)!.buyer);

  // Filter offers based on current settings
  const filteredOffers = mockOffers.filter(offer => {
    // Tab filtering
    if (activeTab === "new" && offer.status !== "new") return false;
    if (activeTab === "active" && !["viewed", "countered"].includes(offer.status)) return false;
    if (activeTab === "closed" && !["accepted", "declined"].includes(offer.status)) return false;
    
    // Multi-property filter
    if (selectedProperties.length > 0 && !selectedProperties.includes(offer.property.id)) return false;
    
    // Status filter
    if (selectedStatus !== "all" && offer.status !== selectedStatus) return false;
    
    // Buyer filter
    if (selectedBuyer !== "all" && offer.buyer.id !== selectedBuyer) return false;
    
    // Date range filter
    if (dateRange.from && offer.timestamp < dateRange.from) return false;
    if (dateRange.to && offer.timestamp > dateRange.to) return false;
    
    return true;
  });

  // Count new offers
  const newOffersCount = mockOffers.filter(o => o.status === "new").length;

  const toggleOfferExpansion = (offerId: string) => {
    const newExpanded = new Set(expandedOffers);
    if (newExpanded.has(offerId)) {
      newExpanded.delete(offerId);
    } else {
      newExpanded.add(offerId);
      // Mark as viewed when expanded
      if (mockOffers.find(o => o.id === offerId)?.status === "new") {
        // In real app, update status via API
        console.log(`Marking offer ${offerId} as viewed`);
      }
    }
    setExpandedOffers(newExpanded);
  };

  const handlePropertyFilterChange = (propertyId: string, checked: boolean) => {
    if (checked) {
      setSelectedProperties([...selectedProperties, propertyId]);
    } else {
      setSelectedProperties(selectedProperties.filter(id => id !== propertyId));
    }
  };

  const handleOfferAction = async (offerId: string, action: "accept" | "decline" | "counter", data?: any) => {
    setIsLoading(offerId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`${action} offer ${offerId}`, data);
    setIsLoading(null);
    setCounterAmount("");
    setResponseMessage("");
  };

  const calculateAssignmentFee = (offerAmount: number, purchasePrice: number) => {
    return offerAmount - purchasePrice;
  };

  const renderPDRating = (rating: number) => {
    const stars = Array.from({ length: 5 }, (_, i) => (
      <StarIcon 
        key={i} 
        className={cn(
          "h-3 w-3",
          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        )} 
      />
    ));
    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-xs text-gray-600 ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1100px] max-h-[90vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                Offers Inbox
                {newOffersCount > 0 && (
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    {newOffersCount} new
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Manage all your property offers in one place
              </DialogDescription>
            </div>
          </div>

          {/* Always visible filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-4 border-t">
            {/* Multi-select Property filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Properties</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uniqueProperties.map(property => (
                  <div key={property.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`property-${property.id}`}
                      checked={selectedProperties.includes(property.id)}
                      onCheckedChange={(checked) => 
                        handlePropertyFilterChange(property.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`property-${property.id}`} 
                      className="text-sm cursor-pointer"
                    >
                      {property.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Status filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-[#135341] focus:border-transparent"
              >
                <option value="all">All statuses</option>
                {Object.entries(statusNames).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            
            {/* Buyer filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Buyer</Label>
              <select 
                value={selectedBuyer}
                onChange={(e) => setSelectedBuyer(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-[#135341] focus:border-transparent"
              >
                <option value="all">All buyers</option>
                {uniqueBuyers.map(buyer => (
                  <option key={buyer.id} value={buyer.id}>{buyer.name}</option>
                ))}
              </select>
            </div>
            
            {/* Date range filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-10"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd")} -{" "}
                          {format(dateRange.to, "LLL dd")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd")
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
                      from: dateRange.from,
                      to: dateRange.to,
                    }}
                    onSelect={(range) => 
                      setDateRange({ 
                        from: range?.from, 
                        to: range?.to 
                      })
                    }
                    initialFocus
                    className="[&_.rdp-day_selected]:bg-[#135341] [&_.rdp-day_selected]:text-white [&_.rdp-day_today]:bg-gray-100"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </DialogHeader>

        {/* Pill-style tabs */}
        <div className="px-6 pt-4">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { key: "all", label: "All Offers", count: filteredOffers.length },
              { key: "new", label: "New", count: mockOffers.filter(o => o.status === "new").length },
              { key: "active", label: "Active", count: mockOffers.filter(o => ["viewed", "countered"].includes(o.status)).length },
              { key: "closed", label: "Closed", count: mockOffers.filter(o => ["accepted", "declined"].includes(o.status)).length },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  activeTab === tab.key
                    ? "bg-white text-[#135341] shadow-sm"
                    : "text-gray-600 hover:text-[#135341] hover:bg-white/50"
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {filteredOffers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageSquareIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No offers match your filters</p>
                <p className="text-sm">Try adjusting your filter criteria</p>
              </div>
            ) : (
              filteredOffers.map((offer) => {
                const isExpanded = expandedOffers.has(offer.id);
                const assignmentFee = calculateAssignmentFee(offer.amount, offer.property.purchasePrice);
                
                return (
                  <div key={offer.id} className="border rounded-lg overflow-hidden">
                    {/* Offer row (clickable) */}
                    <div 
                      className={cn(
                        "p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                        offer.status === "new" && "bg-blue-50"
                      )}
                      onClick={() => toggleOfferExpansion(offer.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          {/* Property */}
                          <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                              <div className="h-full w-full flex items-center justify-center text-gray-400">
                                <UserIcon size={20} />
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{offer.property.name}</p>
                            </div>
                          </div>
                          
                          {/* Buyer */}
                          <div className="flex items-center space-x-2 min-w-0">
                            <a 
                              href={`/profile/${offer.buyer.username}`}
                              className="font-medium text-sm text-[#135341] hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {offer.buyer.name}
                            </a>
                            {offer.buyer.isRep && (
                              <Badge className="bg-[#803344] text-white text-xs">REP</Badge>
                            )}
                            {offer.buyer.verified && (
                              <BadgeCheckIcon className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          
                          {/* Amount */}
                          <div className="text-right min-w-0">
                            <p className="font-semibold text-lg">${offer.amount.toLocaleString()}</p>
                          </div>
                          
                          {/* Date */}
                          <div className="text-right min-w-0">
                            <p className="text-sm text-gray-500">
                              {format(offer.timestamp, "MMM d, yyyy")}
                            </p>
                          </div>
                          
                          {/* Status */}
                          <Badge className={cn("text-xs", statusColors[offer.status])}>
                            {statusNames[offer.status]}
                          </Badge>
                          
                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            {!["accepted", "declined"].includes(offer.status) && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0 text-green-600 border-green-200 hover:bg-green-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOfferAction(offer.id, "accept");
                                  }}
                                  disabled={isLoading === offer.id}
                                >
                                  {isLoading === offer.id ? (
                                    <LoaderIcon className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckIcon className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOfferAction(offer.id, "decline");
                                  }}
                                  disabled={isLoading === offer.id}
                                >
                                  <XIcon className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            
                            <ChevronDownIcon 
                              className={cn(
                                "h-4 w-4 text-gray-400 transition-transform",
                                isExpanded && "rotate-180"
                              )} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="border-t bg-gray-50 p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Left column */}
                          <div className="space-y-4">
                            {/* Offer message */}
                            <div>
                              <h4 className="font-medium text-sm text-gray-700 mb-2">💬 Offer Message</h4>
                              <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                                {offer.message}
                              </p>
                            </div>

                            {/* Buyer credibility */}
                            <div>
                              <h4 className="font-medium text-sm text-gray-700 mb-3">✅ Buyer Credibility</h4>
                              <div className="bg-white p-4 rounded border space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">PD Rating</span>
                                  <div className="flex items-center gap-2">
                                    {renderPDRating(offer.buyer.pdRating)}
                                  </div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Recent Deals</span>
                                  <span className="text-sm font-medium">{offer.buyer.recentDeals}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Financing</span>
                                  <span className="text-sm font-medium">{offer.buyer.financingMethod}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Avg Closing Time</span>
                                  <span className="text-sm font-medium">{offer.buyer.avgClosingTime}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right column */}
                          <div className="space-y-4">
                            {/* Assignment fee preview */}
                            <div>
                              <h4 className="font-medium text-sm text-gray-700 mb-3">💰 Assignment Fee Preview</h4>
                              <div className="bg-white p-4 rounded border">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-gray-600">Offer Price</span>
                                  <span className="text-sm font-medium">${offer.amount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-gray-600">Purchase Price</span>
                                  <span className="text-sm font-medium">-${offer.property.purchasePrice.toLocaleString()}</span>
                                </div>
                                <div className="border-t pt-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Assignment Fee</span>
                                    <span className={cn(
                                      "text-lg font-bold",
                                      assignmentFee > 0 ? "text-green-600" : assignmentFee < 0 ? "text-red-600" : "text-gray-600"
                                    )}>
                                      ${assignmentFee.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Response controls */}
                            {!["accepted", "declined"].includes(offer.status) && (
                              <div>
                                <h4 className="font-medium text-sm text-gray-700 mb-3">✉️ Response Controls</h4>
                                <div className="space-y-3">
                                  {/* Counter offer */}
                                  <div className="flex gap-2">
                                    <Input
                                      placeholder="Counter amount"
                                      value={counterAmount}
                                      onChange={(e) => setCounterAmount(e.target.value)}
                                      className="flex-1"
                                    />
                                    <Button
                                      onClick={() => handleOfferAction(offer.id, "counter", { amount: counterAmount })}
                                      disabled={!counterAmount || isLoading === offer.id}
                                      className="bg-amber-600 hover:bg-amber-700"
                                    >
                                      Counter
                                    </Button>
                                  </div>

                                  {/* Message input */}
                                  <div className="space-y-2">
                                    <Textarea
                                      placeholder="Write a response message..."
                                      value={responseMessage}
                                      onChange={(e) => setResponseMessage(e.target.value)}
                                      className="min-h-[80px]"
                                    />
                                    <div className="flex gap-2">
                                      <Button
                                        onClick={() => handleOfferAction(offer.id, "accept", { message: responseMessage })}
                                        disabled={isLoading === offer.id}
                                        className="bg-green-600 hover:bg-green-700 flex-1"
                                      >
                                        Accept Offer
                                      </Button>
                                      <Button
                                        onClick={() => handleOfferAction(offer.id, "decline", { message: responseMessage })}
                                        disabled={isLoading === offer.id}
                                        variant="outline"
                                        className="border-red-200 text-red-600 hover:bg-red-50 flex-1"
                                      >
                                        Decline
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}