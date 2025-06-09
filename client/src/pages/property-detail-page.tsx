import { useRoute } from "wouter";
import { useState } from "react";
import {
  Share2,
  Heart,
  MapPin,
  BedDouble,
  Bath,
  SquareIcon,
  Home as HomeIcon,
  ChevronDown,
  ChevronUp,
  Calculator,
  TrendingUp,
  MapIcon,
  Users,
  Clock,
  Building,
  DollarSign,
  Info,
  Eye,
  Star,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface PropertyDetailPageProps {
  id: string;
}

// Mock data that matches the reference design
const mockProperty = {
  id: 1,
  title: "123 Oak Street",
  address: "Austin, TX 78701",
  price: 450000,
  pdRating: "1/10",
  pricePerSqft: 250,
  daysOnMarket: 5,
  bedrooms: 3,
  bathrooms: 2,
  sqft: 1800,
  lotSize: "N/A",
  yearBuilt: 1986,
  propertyType: "Single Family",
  basement: "Full, finished",
  parking: "2-car garage",
  description: "This charming Single Family home is nestled in a highly sought-after neighborhood in Austin, TX. With 3 spacious bedrooms and 2 modern bathrooms, this 1,800 square foot residence offers comfort and style.\n\nThe property features a well-maintained yard, perfect for outdoor entertaining. Recent upgrades include new energy-efficient appliances and updated fixtures throughout. The location provides easy access to local schools, shopping centers, and major highways.\n\nThis property presents an excellent opportunity for both homeowners and investors looking for a solid return on investment in a stable market. Don't miss the chance to add this gem to your portfolio!",
  mainImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
  galleryImages: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&h=300&fit=crop",
  ],
  seller: {
    name: "Michael Johnson",
    title: "Seller",
    responseTime: "24hrs",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  views: 142,
  listingDate: "4/13/2025",
  rentEstimate: 3600,
  monthlyExpenses: 1350,
  arv: 540000,
  capRate: 5.2,
  cashOnCashReturn: 7.8,
  monthlyRentPercent: 0.76,
  repairCosts: 22500,
  contractorQuote: "Mike Johnson",
};

const mockComps = [
  {
    id: 1,
    address: "456 Elm Street",
    city: "Milwaukee, WI",
    price: 439000,
    beds: 3,
    baths: 2,
    sqft: 2200,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=150&fit=crop",
  },
  {
    id: 2,
    address: "789 Oak Road",
    city: "Milwaukee, WI",
    price: 475000,
    beds: 4,
    baths: 3,
    sqft: 2600,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200&h=150&fit=crop",
  },
  {
    id: 3,
    address: "101 Pine Lane",
    city: "Milwaukee, WI",
    price: 495000,
    beds: 4,
    baths: 2.5,
    sqft: 2800,
    image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=200&h=150&fit=crop",
  },
];

const mockReps = [
  {
    type: "Agent",
    name: "Sarah Wilson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
  },
  {
    type: "Contractor",
    name: "Mike Thompson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    type: "Lender",
    name: "David Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
];

const mockHistory = [
  { date: "12/15/2024", event: "Listed", price: 450000, source: "PropertyDeals" },
  { date: "06/30/2024", event: "Assessed", price: 382500, source: "County Records" },
  { date: "01/22/2019", event: "Sold", price: 360000, source: "MLS" },
];

const mockRentCosts = [
  { type: "Studio", price: 895 },
  { type: "1 Bedroom", price: 1095 },
  { type: "2 Bedroom", price: 1450 },
  { type: "3+ Bedroom", price: 1850 },
];

export default function PropertyDetailPage({ id }: PropertyDetailPageProps) {
  const [, params] = useRoute("/p/:id");
  const propertyId = params?.id || id;

  const [savedProperty, setSavedProperty] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    details: true,
    numbers: false,
    calculators: false,
    location: false,
    reps: false,
    history: false,
    comps: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const AccordionSection = ({ 
    id, 
    title, 
    icon: Icon, 
    children 
  }: { 
    id: string; 
    title: string; 
    icon: any; 
    children: React.ReactNode;
  }) => (
    <Card className="mb-6">
      <CardHeader 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => toggleAccordion(id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-gray-600" />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {openAccordions[id] ? 
            <ChevronUp className="h-5 w-5 text-gray-400" /> : 
            <ChevronDown className="h-5 w-5 text-gray-400" />
          }
        </div>
      </CardHeader>
      {openAccordions[id] && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Home</span>
            <span>&gt;</span>
            <span>Properties</span>
            <span>&gt;</span>
            <span className="text-gray-900">{mockProperty.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {mockProperty.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="h-4 w-4" />
                <span>{mockProperty.address}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                ${mockProperty.price.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                PD Rating: {mockProperty.pdRating} • ${mockProperty.pricePerSqft}/sqft
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact Seller
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Make an Offer
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setSavedProperty(!savedProperty)}
            >
              <Heart className={cn("h-4 w-4", savedProperty && "fill-red-500 text-red-500")} />
              Save
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {mockProperty.daysOnMarket} days on market
            </Badge>
          </div>

          {/* Photo Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <div className="lg:col-span-2">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <img
                  src={mockProperty.mainImage}
                  alt="Property main view"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {mockProperty.galleryImages.map((image, index) => (
                <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`Property view ${index + 2}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                  {index === mockProperty.galleryImages.length - 1 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-medium">View Map</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Property Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Bedrooms</div>
              <div className="text-2xl font-bold">{mockProperty.bedrooms}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Bathrooms</div>
              <div className="text-2xl font-bold">{mockProperty.bathrooms}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Square Feet</div>
              <div className="text-2xl font-bold">{mockProperty.sqft.toLocaleString()}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Lot Size</div>
              <div className="text-2xl font-bold">{mockProperty.lotSize}</div>
            </div>
          </div>

          {/* Property Type Badges */}
          <div className="flex gap-2 mb-8">
            <Badge variant="outline" className="flex items-center gap-1">
              <HomeIcon className="h-3 w-3" />
              Single Family
            </Badge>
            <Badge variant="outline">Light Rehab</Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg border">
              <div className="flex border-b">
                <button className="px-6 py-3 text-sm font-medium text-gray-900 border-b-2 border-gray-900">
                  <Building className="inline-block h-4 w-4 mr-2" />
                  Numbers
                </button>
                <button className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
                  <Calculator className="inline-block h-4 w-4 mr-2" />
                  Calculators
                </button>
                <button className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
                  <MapIcon className="inline-block h-4 w-4 mr-2" />
                  Location
                </button>
                <button className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
                  <Users className="inline-block h-4 w-4 mr-2" />
                  REPs
                </button>
                <button className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
                  <Clock className="inline-block h-4 w-4 mr-2" />
                  History
                </button>
              </div>
            </div>

            {/* Property Details */}
            <AccordionSection id="details" title="Property Details" icon={Building}>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <BedDouble className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                    <div className="font-semibold">{mockProperty.bedrooms}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bath className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                    <div className="font-semibold">{mockProperty.bathrooms}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <SquareIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Square Feet</div>
                    <div className="font-semibold">{mockProperty.sqft} sq ft</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <HomeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Lot Size</div>
                    <div className="font-semibold">0.25 acres</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Year Built</div>
                    <div className="font-semibold">{mockProperty.yearBuilt}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Price per sqft</div>
                    <div className="font-semibold">${mockProperty.pricePerSqft}/sq ft</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <HomeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Property Type</div>
                    <div className="font-semibold">{mockProperty.propertyType}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Parking</div>
                    <div className="font-semibold">{mockProperty.parking}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <HomeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Basement</div>
                    <div className="font-semibold">{mockProperty.basement}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Property Description</h3>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {mockProperty.description}
                </div>
              </div>
            </AccordionSection>

            {/* The Numbers */}
            <AccordionSection id="numbers" title="The Numbers" icon={TrendingUp}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rent</span>
                  <div className="text-right">
                    <div className="font-semibold">${mockProperty.rentEstimate}/month</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estimated Repair Costs</span>
                  <div className="text-right">
                    <div className="font-semibold text-2xl">${mockProperty.repairCosts.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">
                      Real Job Quote by {mockProperty.contractorQuote}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estimated Monthly Expenses</span>
                  <div className="text-right">
                    <div className="font-semibold">${mockProperty.monthlyExpenses}/month</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ARV</span>
                  <div className="font-semibold">${mockProperty.arv.toLocaleString()}</div>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Cap Rate</div>
                    <div className="text-lg font-bold">{mockProperty.capRate}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Cash-on-Cash Return</div>
                    <div className="text-lg font-bold">{mockProperty.cashOnCashReturn}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Monthly Rent %</div>
                    <div className="text-lg font-bold">{mockProperty.monthlyRentPercent}%</div>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-600 border-t pt-4">
                  I'm a contractor — Submit a Quote
                </div>
              </div>
            </AccordionSection>

            {/* Calculators */}
            <AccordionSection id="calculators" title="Calculators" icon={Calculator}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold">Flip Calculator</h3>
                    <Badge variant="secondary" className="text-xs">House Flip</Badge>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purchase Price</span>
                      <span className="text-gray-500">(Auto-filled)</span>
                    </div>
                    <div className="text-lg font-semibold">$ 450,000</div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Repair Costs</span>
                      <span className="text-gray-500">(Estimated)</span>
                    </div>
                    <div className="text-lg font-semibold">$ 22500</div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">After Repair Value (ARV)</span>
                      <Info className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="text-lg font-semibold">$ 540000</div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-gray-600 text-xs">Holding Costs</div>
                        <div className="font-semibold">$ 9000</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Selling Costs</div>
                        <div className="font-semibold">$ 27000</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total Investment</span>
                        <span>$481,500</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total Profit</span>
                        <span>$31,500</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>ROI</span>
                        <span>6.5%</span>
                      </div>
                    </div>

                    <Button className="w-full mt-4" size="sm">Recalculate</Button>
                    <Button variant="outline" className="w-full" size="sm">View Full Analysis</Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <HomeIcon className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold">Rental Calculator</h3>
                    <Badge variant="secondary" className="text-xs">Rental Property</Badge>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purchase Price</span>
                      <span className="text-gray-500">(Auto-filled)</span>
                    </div>
                    <div className="text-lg font-semibold">$ 450,000</div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Rent</span>
                      <span className="text-gray-600">Monthly Expenses</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-lg font-semibold">$ 3600</div>
                      <div className="text-lg font-semibold">$ 1350</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-gray-600 text-xs">Down Payment</div>
                        <div className="font-semibold">20% $</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Interest Rate</div>
                        <div className="font-semibold">4.5% %</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly NOI</span>
                        <span className="font-semibold">$2,250</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cap Rate</span>
                        <span className="font-semibold">6.00%</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Cash on Cash Return</span>
                        <span>10.43%</span>
                      </div>
                    </div>

                    <Button className="w-full mt-4" size="sm">Recalculate</Button>
                    <Button variant="outline" className="w-full" size="sm">View Full Analysis</Button>
                  </div>
                </div>
              </div>
            </AccordionSection>

            {/* Location */}
            <AccordionSection id="location" title="Location" icon={MapIcon}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Demographics</h3>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <MapIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <Button variant="outline" size="sm">View on Map</Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Home Values</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Less than $100K: 2.1%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span>$100K-$199K: 8.3%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span>$200K-$299K: 18.5%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span>$300K-$499K: 39.2%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span>$500K-$999K: 26.7%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span>$1M or more: 5.2%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Housing Ownership</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                          <span>Owned with mortgage: 49.3%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          <span>Owned free and clear: 16.1%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                          <span>Renter occupied: 28.7%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                          <span>Vacant: 5.9%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Monthly Rent Costs</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {mockRentCosts.map((rent, index) => (
                      <div key={index} className="text-center p-3 border rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">{rent.type}</div>
                        <div className="font-semibold">${rent.price}/mo</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionSection>

            {/* Find a REP */}
            <AccordionSection id="reps" title="Find a REP" icon={Users}>
              <div className="space-y-4">
                <p className="text-gray-600">Connect with local professionals who can help with this property:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockReps.map((rep, index) => (
                    <div key={index} className="text-center p-4 border rounded-lg">
                      <img 
                        src={rep.avatar} 
                        alt={rep.name}
                        className="w-16 h-16 rounded-full mx-auto mb-3"
                      />
                      <div className="font-medium">{rep.type}</div>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <Button variant="link" className="text-blue-600">
                    View All REPs →
                  </Button>
                </div>
              </div>
            </AccordionSection>

            {/* Property History */}
            <AccordionSection id="history" title="Property History" icon={Clock}>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-sm font-medium text-gray-600">DATE</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-600">EVENT</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-600">PRICE</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-600">SOURCE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockHistory.map((entry, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 text-sm">{entry.date}</td>
                          <td className="py-3 text-sm">{entry.event}</td>
                          <td className="py-3 text-sm">${entry.price.toLocaleString()}</td>
                          <td className="py-3 text-sm text-gray-600">{entry.source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 italic">
                  Property history data is for demonstration purposes. In a production app, this would be pulled from public records.
                </p>
              </div>
            </AccordionSection>

            {/* Comparable Properties */}
            <AccordionSection id="comps" title="Comparable Properties" icon={Building}>
              <div className="space-y-4">
                {mockComps.map((comp, index) => (
                  <div key={comp.id} className="flex gap-4 p-4 border rounded-lg">
                    <img 
                      src={comp.image} 
                      alt={comp.address}
                      className="w-24 h-18 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{comp.address}</h4>
                      <p className="text-sm text-gray-600">{comp.city}</p>
                      <p className="font-semibold">${comp.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div>{comp.beds}bd, {comp.baths}ba</div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionSection>

            {/* Similar Deals Section */}
            <Card>
              <CardHeader>
                <CardTitle>More Deals by Michael</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockComps.map((property, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative">
                        <img 
                          src={property.image} 
                          alt={property.address}
                          className="w-full h-48 object-cover"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <div className="font-semibold text-lg mb-1">
                          ${property.price.toLocaleString()}
                        </div>
                        <div className="text-sm font-medium mb-2">{property.address}</div>
                        <div className="text-sm text-gray-600 mb-2">
                          {property.beds} bd • {property.baths} ba • {property.sqft.toLocaleString()} sqft
                        </div>
                        <div className="text-sm text-gray-600">{property.city}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Similar Deals You Might Like */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Deals You Might Like</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockComps.map((property, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative">
                        <img 
                          src={property.image} 
                          alt={property.address}
                          className="w-full h-48 object-cover"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <div className="font-semibold text-lg mb-1">
                          ${property.price.toLocaleString()}
                        </div>
                        <div className="text-sm font-medium mb-2">{property.address}</div>
                        <div className="text-sm text-gray-600 mb-2">
                          {property.beds} bd • {property.baths} ba • {property.sqft.toLocaleString()} sqft
                        </div>
                        <div className="text-sm text-gray-600">{property.city}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interested in this property?</CardTitle>
                <p className="text-sm text-gray-600">Contact the seller or schedule a viewing</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={mockProperty.seller.avatar} 
                    alt={mockProperty.seller.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{mockProperty.seller.name}</div>
                    <div className="text-sm text-gray-600">
                      {mockProperty.seller.title} • Responds in {mockProperty.seller.responseTime}
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">Contact Seller</Button>
                <Button variant="outline" className="w-full">Make an Offer</Button>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t">
                  <Eye className="h-4 w-4" />
                  <span>{mockProperty.views} people viewed this property</span>
                </div>
              </CardContent>
            </Card>

            {/* Property Info Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property ID:</span>
                    <span>{mockProperty.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Listed:</span>
                    <span>{mockProperty.listingDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}