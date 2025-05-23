import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  ChevronDownIcon, CheckIcon, XIcon, MessageSquareIcon,
  UserIcon, BadgeCheckIcon, TrendingUpIcon, 
  StarIcon, SendIcon, LoaderIcon, SearchIcon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

// Enhanced mock data with property addresses
const mockOffers = [
  {
    id: "1",
    property: {
      id: "prop-1",
      name: "Modern Downtown Condo",
      address: "1234 Main St, Downtown",
      image: "/api/placeholder/150/100",
      purchasePrice: 285000,
    },
    buyer: {
      id: "buyer-1",
      name: "Michael Chen",
      username: "mchen_investor",
      isRep: true,
      verified: true,
      pdRating: 4.8,
      recentDeals: 12,
      financingMethod: "Cash",
      avgClosingTime: "18 days",
    },
    amount: 320000,
    message: "I'm very interested in this property and can close within 2 weeks. Cash purchase, no financing contingencies. Happy to provide proof of funds immediately.",
    status: "new",
    timestamp: new Date(2024, 11, 15),
  },
  {
    id: "2", 
    property: {
      id: "prop-2",
      name: "Suburban Family Home",
      address: "5678 Oak Avenue, Suburbs",
      image: "/api/placeholder/150/100",
      purchasePrice: 195000,
    },
    buyer: {
      id: "buyer-2",
      name: "Sarah Johnson",
      username: "sarah_realestate",
      isRep: false,
      verified: true,
      pdRating: 4.2,
      recentDeals: 3,
      financingMethod: "Conventional",
      avgClosingTime: "35 days",
    },
    amount: 215000,
    message: "Great property! I'd like to schedule a viewing and can provide pre-approval letter.",
    status: "viewed",
    timestamp: new Date(2024, 11, 12),
  },
  {
    id: "3",
    property: {
      id: "prop-1",
      name: "Modern Downtown Condo", 
      address: "1234 Main St, Downtown",
      image: "/api/placeholder/150/100",
      purchasePrice: 285000,
    },
    buyer: {
      id: "buyer-3",
      name: "David Rodriguez",
      username: "drodriguez_invest",
      isRep: true,
      verified: false,
      pdRating: 3.9,
      recentDeals: 8,
      financingMethod: "Cash",
      avgClosingTime: "22 days",
    },
    amount: 305000,
    message: "Competitive offer with quick closing timeline.",
    status: "countered",
    timestamp: new Date(2024, 11, 10),
  },
];

const statusOptions = [
  { value: "new", label: "New" },
  { value: "viewed", label: "Viewed" },
  { value: "active", label: "Active" },
  { value: "countered", label: "Countered" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
];

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  viewed: "bg-gray-100 text-gray-800", 
  active: "bg-green-100 text-green-800",
  countered: "bg-yellow-100 text-yellow-800",
  accepted: "bg-emerald-100 text-emerald-800",
  declined: "bg-red-100 text-red-800",
};

const statusNames = {
  new: "New",
  viewed: "Viewed",
  active: "Active", 
  countered: "Countered",
  accepted: "Accepted",
  declined: "Declined",
};

interface OffersInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedPropertyId?: string;
}

export function OffersInboxModal({ isOpen, onClose, preSelectedPropertyId }: OffersInboxModalProps) {
  // State management - streamlined without tabs
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["new", "active"]);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [expandedOffers, setExpandedOffers] = useState<Set<string>>(new Set());
  const [counterAmount, setCounterAmount] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Initialize with pre-selected property when modal opens
  useEffect(() => {
    if (isOpen && preSelectedPropertyId) {
      setSelectedProperties([preSelectedPropertyId]);
    } else if (isOpen && !preSelectedPropertyId) {
      setSelectedProperties([]);
    }
  }, [isOpen, preSelectedPropertyId]);
  
  // Search state for dropdowns
  const [statusSearch, setStatusSearch] = useState("");
  const [propertySearch, setPropertySearch] = useState("");

  // Get unique properties for filter
  const uniqueProperties = Array.from(new Set(mockOffers.map(o => o.property.id)))
    .map(id => mockOffers.find(o => o.property.id === id)!.property);

  // Filtered options for search
  const filteredStatusOptions = statusOptions.filter(status =>
    status.label.toLowerCase().includes(statusSearch.toLowerCase())
  );
  
  const filteredPropertyOptions = uniqueProperties.filter(property =>
    property.address.toLowerCase().includes(propertySearch.toLowerCase())
  );

  // Updated filter logic
  const filteredOffers = mockOffers.filter(offer => {
    // Status filtering (multi-select)
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(offer.status)) return false;
    
    // Property filtering (multi-select) 
    if (selectedProperties.length > 0 && !selectedProperties.includes(offer.property.id)) return false;
    
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
        console.log(`Marking offer ${offerId} as viewed`);
      }
    }
    setExpandedOffers(newExpanded);
  };

  const handleStatusFilterChange = (status: string, checked: boolean) => {
    if (checked) {
      setSelectedStatuses([...selectedStatuses, status]);
    } else {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    }
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
        <div className="flex">{stars}</div>
        <span className="text-xs text-gray-600 ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1100px] h-[90vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                Offers Inbox
                {newOffersCount > 0 && (
                  <Badge className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                    {newOffersCount} new
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">
                Manage incoming offers on your properties
              </DialogDescription>
            </div>
          </div>

          {/* Streamlined filters - no tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t">
            {/* Status filter - multi-select with search */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between text-left font-normal h-10 hover:bg-gray-50"
                  >
                    <span className="truncate">
                      {selectedStatuses.length === 0
                        ? "All statuses"
                        : selectedStatuses.length === 1
                        ? statusNames[selectedStatuses[0] as keyof typeof statusNames]
                        : `${selectedStatuses.length} selected`}
                    </span>
                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 p-0" onCloseAutoFocus={(e) => e.preventDefault()}>
                  <div className="p-2 border-b">
                    <div className="relative">
                      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search statuses..."
                        value={statusSearch}
                        onChange={(e) => setStatusSearch(e.target.value)}
                        className="pl-8 h-8 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredStatusOptions.map(status => (
                      <DropdownMenuCheckboxItem
                        key={status.value}
                        checked={selectedStatuses.includes(status.value)}
                        onCheckedChange={(checked) => 
                          handleStatusFilterChange(status.value, checked as boolean)
                        }
                        className="hover:bg-gray-50 hover:!bg-gray-50 data-[highlighted]:bg-gray-50"
                        onSelect={(e) => e.preventDefault()}
                      >
                        {status.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Property filter - multi-select with search */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Properties</Label>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between text-left font-normal h-10 hover:bg-gray-50"
                  >
                    <span className="truncate">
                      {selectedProperties.length === 0
                        ? "All properties"
                        : selectedProperties.length === 1
                        ? uniqueProperties.find(p => p.id === selectedProperties[0])?.address
                        : `${selectedProperties.length} selected`}
                    </span>
                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-0" onCloseAutoFocus={(e) => e.preventDefault()}>
                  <div className="p-2 border-b">
                    <div className="relative">
                      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search properties..."
                        value={propertySearch}
                        onChange={(e) => setPropertySearch(e.target.value)}
                        className="pl-8 h-8 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredPropertyOptions.map(property => (
                      <DropdownMenuCheckboxItem
                        key={property.id}
                        checked={selectedProperties.includes(property.id)}
                        onCheckedChange={(checked) => 
                          handlePropertyFilterChange(property.id, checked as boolean)
                        }
                        className="hover:bg-gray-50 hover:!bg-gray-50 data-[highlighted]:bg-gray-50"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <span className="truncate">{property.address}</span>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            

          </div>
        </DialogHeader>

        {/* Main content - fixed height with scroll */}
        <div className="flex-1 overflow-y-auto p-6" style={{scrollbarWidth: 'thin'}}>
          <div className="space-y-2">
            {filteredOffers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageSquareIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No offers found</p>
                <p className="text-sm">Try adjusting your filters</p>
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
                        "p-4 cursor-pointer hover:bg-gray-50 hover:shadow-sm transition-all duration-200",
                        offer.status === "new" && "bg-blue-50"
                      )}
                      onClick={() => toggleOfferExpansion(offer.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          {/* Property */}
                          <div className="flex items-center space-x-3">
                            <img 
                              src={offer.property.image} 
                              alt={offer.property.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div>
                              <p className="font-medium text-sm">{offer.property.address}</p>
                            </div>
                          </div>
                          
                          {/* Buyer */}
                          <div className="flex items-center space-x-2 min-w-0">
                            <UserIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <a 
                              href={`/profile/${offer.buyer.username}`}
                              className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline truncate"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {offer.buyer.name}
                            </a>
                            {offer.buyer.isRep && (
                              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                                REP
                              </Badge>
                            )}
                            {offer.buyer.verified && (
                              <BadgeCheckIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                          
                          {/* Amount */}
                          <div className="text-right">
                            <p className="font-semibold text-lg">${offer.amount.toLocaleString()}</p>
                          </div>
                          
                          {/* Date */}
                          <div className="text-right text-sm text-gray-600">
                            <p className="font-medium">
                              {format(offer.timestamp, "MMM d, yyyy")}
                            </p>
                          </div>
                          
                          {/* Status */}
                          <Badge className={cn("text-xs", statusColors[offer.status])}>
                            {statusNames[offer.status]}
                          </Badge>
                          
                          {/* Expand indicator only */}
                          <div className="flex items-center">
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
                      <div className="border-t bg-gray-50 p-4 sm:p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 max-w-full">
                          {/* Left column */}
                          <div className="space-y-4">
                            {/* Offer message */}
                            <div>
                              <h4 className="font-medium text-sm text-gray-700 mb-2">💬 Offer Message</h4>
                              <div className="text-sm text-gray-600 bg-white p-3 rounded border max-h-32 overflow-y-auto break-words">
                                {offer.message}
                              </div>
                            </div>

                            {/* Buyer credibility */}
                            <div>
                              <h4 className="font-medium text-sm text-gray-700 mb-3">✅ Buyer Credibility</h4>
                              <div className="bg-white p-4 rounded border space-y-3 max-h-40 overflow-y-auto">
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
                                  <span className="text-sm text-gray-600">Avg. Closing</span>
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
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Offer Amount:</span>
                                    <span className="font-medium">${offer.amount.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Purchase Price:</span>
                                    <span className="font-medium">-${offer.property.purchasePrice.toLocaleString()}</span>
                                  </div>
                                  <hr />
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Assignment Fee:</span>
                                    <span className={cn(
                                      "font-semibold text-lg",
                                      assignmentFee >= 0 ? "text-green-600" : "text-red-600"
                                    )}>
                                      {assignmentFee >= 0 ? '+' : ''}${assignmentFee.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Response controls */}
                            {!["accepted", "declined"].includes(offer.status) && (
                              <div>
                                <h4 className="font-medium text-sm text-gray-700 mb-3">⚡ Response Controls</h4>
                                <div className="space-y-3">
                                  <div className="flex gap-2">
                                    <Button
                                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                      onClick={() => handleOfferAction(offer.id, "accept")}
                                      disabled={isLoading === offer.id}
                                    >
                                      {isLoading === offer.id ? (
                                        <LoaderIcon className="h-4 w-4 animate-spin mr-2" />
                                      ) : (
                                        <CheckIcon className="h-4 w-4 mr-2" />
                                      )}
                                      Accept Offer
                                    </Button>
                                    <Button
                                      variant="outline"
                                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                      onClick={() => handleOfferAction(offer.id, "decline")}
                                      disabled={isLoading === offer.id}
                                    >
                                      <XIcon className="h-4 w-4 mr-2" />
                                      Decline
                                    </Button>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Input
                                      placeholder="Counter offer amount"
                                      value={counterAmount}
                                      onChange={(e) => setCounterAmount(e.target.value)}
                                    />
                                    <Textarea
                                      placeholder="Optional message to buyer..."
                                      value={responseMessage}
                                      onChange={(e) => setResponseMessage(e.target.value)}
                                      rows={2}
                                    />
                                    <Button
                                      variant="outline"
                                      className="w-full"
                                      onClick={() => handleOfferAction(offer.id, "counter", {
                                        amount: counterAmount,
                                        message: responseMessage
                                      })}
                                      disabled={!counterAmount || isLoading === offer.id}
                                    >
                                      <SendIcon className="h-4 w-4 mr-2" />
                                      Send Counter Offer
                                    </Button>
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