import React, { useState } from 'react';
import { Property } from '@shared/schema';
import MobileImageCarousel from './mobile-image-carousel';
import MobileFloatingCTA from './mobile-floating-cta';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  MapPin, Calendar, Ruler, Home, Building, Users, FileText, 
  BarChart, DollarSign, MapPinned, Bookmark, Star, Heart, Share,
  Bath, Square as SquareIcon, Link as LinkIcon, Mail, Check as CheckIcon,
  Copy as CopyIcon, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface MobilePropertyViewProps {
  property: Property;
  onBack?: () => void;
  onContactSeller: () => void;
}

const MobilePropertyView: React.FC<MobilePropertyViewProps> = ({
  property,
  onBack,
  onContactSeller
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Property images - using actual images that match the property
  const propertyImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=800&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=800&h=600&auto=format&fit=crop',
  ];
  
  // Format address for display
  const formattedAddress = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`;
  
  // Sample features for this demo
  const features = [
    { name: 'Central Air', present: true },
    { name: 'Garage', present: true },
    { name: 'Pool', present: false },
    { name: 'Fireplace', present: true },
    { name: 'Deck/Patio', present: true },
    { name: 'Basement', present: true },
    { name: 'Hardwood Floors', present: true },
    { name: 'Security System', present: false },
  ];

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const handleContactClick = () => {
    setContactModalOpen(true);
  };
  
  const handleOfferClick = () => {
    setOfferModalOpen(true);
  };
  
  // Share functionality
  const handleCopyToClipboard = () => {
    const propertyUrl = `https://propertydeals.com/properties/${property.id}`;
    navigator.clipboard.writeText(propertyUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
  
  const handleEmailShare = () => {
    const subject = `Check out this property: ${property.address}`;
    const body = `I found this interesting property on PropertyDeals!\n\n${property.address}, ${property.city}, ${property.state}\nPrice: $${property.price?.toLocaleString()}\n\nSee more details here: https://propertydeals.com/properties/${property.id}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  
  const generatePdfReport = () => {
    alert("PDF report will be generated and downloaded.");
    // In a real implementation, this would call a backend API to generate a PDF
  };

  // Fetch zip code demographic data
  const fetchZipCodeData = async (zipCode: string) => {
    try {
      // In a real implementation, this would make a fetch to the unitedstateszipcodes.org API
      // For now, we'll return mock data based on the provided requirements
      return {
        demographics: {
          population: 32451,
          ageDistribution: [
            { group: 'Under 18', percentage: 21.5 },
            { group: '18-24', percentage: 9.7 },
            { group: '25-34', percentage: 15.3 },
            { group: '35-54', percentage: 26.8 },
            { group: '55-64', percentage: 12.1 },
            { group: '65+', percentage: 14.6 },
          ],
          raceDistribution: [
            { group: 'White', percentage: 68.2 },
            { group: 'Black', percentage: 12.4 },
            { group: 'Hispanic', percentage: 10.8 },
            { group: 'Asian', percentage: 5.7 },
            { group: 'Other', percentage: 2.9 },
          ],
          genderDistribution: [
            { group: 'Male', percentage: 48.3 },
            { group: 'Female', percentage: 51.7 },
          ],
          housingStatus: [
            { group: 'Owner Occupied', percentage: 65.4 },
            { group: 'Renter Occupied', percentage: 28.7 },
            { group: 'Vacant', percentage: 5.9 },
          ],
        }
      };
    } catch (error) {
      console.error('Error fetching zip code data:', error);
      return null;
    }
  };

  // Sample seller properties
  const sellerProperties = [
    {
      id: 1,
      title: "Victorian Charm",
      address: "789 Victorian Lane, Milwaukee, WI",
      price: 425000,
      bedrooms: 3,
      bathrooms: 2.5,
      imageUrl: "https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?q=80&w=300&h=200&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Lakeside Retreat",
      address: "421 Lake View Drive, Milwaukee, WI",
      price: 589000,
      bedrooms: 4,
      bathrooms: 3,
      imageUrl: "https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?q=80&w=300&h=200&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Downtown Loft",
      address: "50 Urban Street #302, Milwaukee, WI",
      price: 349000,
      bedrooms: 2,
      bathrooms: 2,
      imageUrl: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?q=80&w=300&h=200&auto=format&fit=crop",
    }
  ];
  
  // Sample demographic data from unitedstateszipcodes.org
  const demographicData = {
    population: 36327,
    ageDistribution: [
      { group: 'Under 18', percentage: 21.5 },
      { group: '18-24', percentage: 9.7 },
      { group: '25-34', percentage: 15.3 },
      { group: '35-54', percentage: 26.8 },
      { group: '55-64', percentage: 12.1 },
      { group: '65+', percentage: 14.6 },
    ],
    raceDistribution: [
      { group: 'White', percentage: 68.2 },
      { group: 'Black', percentage: 12.4 },
      { group: 'Hispanic', percentage: 10.8 },
      { group: 'Asian', percentage: 5.7 },
      { group: 'Other', percentage: 2.9 },
    ],
    genderDistribution: [
      { group: 'Male', percentage: 48.3 },
      { group: 'Female', percentage: 51.7 },
    ],
    housingStatus: [
      { group: 'Owner Occupied', percentage: 65.4 },
      { group: 'Renter Occupied', percentage: 28.7 },
      { group: 'Vacant', percentage: 5.9 },
    ],
    housingTypes: [
      { group: 'In Occupied Housing Units', percentage: 91.5 },
      { group: 'Nursing Facilities', percentage: 0.7 },
      { group: 'College Student Housing', percentage: 7.5 },
      { group: 'Other Noninstitutional', percentage: 0.4 },
    ],
    yearBuilt: [
      { group: '2014 or later', percentage: 4.2 },
      { group: '2010-2013', percentage: 3.6 },
      { group: '2000-2009', percentage: 8.1 },
      { group: '1990-1999', percentage: 7.3 },
      { group: '1980-1989', percentage: 6.9 },
      { group: '1970-1979', percentage: 10.2 },
      { group: '1960-1969', percentage: 11.7 },
      { group: '1950-1959', percentage: 15.4 },
      { group: 'Before 1950', percentage: 32.6 },
    ],
    ownershipType: [
      { group: 'Owned with mortgage', percentage: 49.3 },
      { group: 'Owned free and clear', percentage: 16.1 },
      { group: 'Renter occupied', percentage: 28.7 },
      { group: 'Vacant', percentage: 5.9 },
    ],
    homeValues: [
      { group: 'Less than $100K', percentage: 2.1 },
      { group: '$100K-$199K', percentage: 8.3 },
      { group: '$200K-$299K', percentage: 18.5 },
      { group: '$300K-$499K', percentage: 39.2 },
      { group: '$500K-$999K', percentage: 26.7 },
      { group: '$1M or more', percentage: 5.2 },
    ],
    monthlyRent: [
      { type: 'Studio', rent: 895 },
      { type: '1 Bedroom', rent: 1095 },
      { type: '2 Bedroom', rent: 1450 },
      { type: '3+ Bedroom', rent: 1850 },
    ],
    householdIncome: [
      { group: 'Less than $25K', percentage: 15.3 },
      { group: '$25K-$49K', percentage: 17.6 },
      { group: '$50K-$74K', percentage: 16.1 },
      { group: '$75K-$99K', percentage: 13.8 },
      { group: '$100K-$149K', percentage: 18.4 },
      { group: '$150K or more', percentage: 18.8 },
    ],
  };

  return (
    <div className="min-h-screen bg-white relative lg:hidden">
      {/* Image Carousel */}
      <MobileImageCarousel 
        images={propertyImages} 
        address={property.address}
        onBack={onBack}
      />
      
      {/* Property Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <h1 className="text-2xl font-bold text-[#09261E]">${property.price?.toLocaleString()}</h1>
              <span className="text-xs text-gray-500">
                ${property.squareFeet ? Math.round((property.price || 0) / property.squareFeet).toLocaleString() : 'N/A'}/sqft
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 my-2">
              <Badge variant="secondary" className="bg-[#09261E]/10 hover:bg-[#09261E]/20 text-[#09261E]">
                {property.propertyType || 'Single Family'}
              </Badge>
              <Badge variant="secondary" className="bg-[#09261E]/10 hover:bg-[#09261E]/20 text-[#09261E]">
                Light Rehab
              </Badge>
              <Badge variant="secondary" className="bg-[#09261E]/10 hover:bg-[#09261E]/20 text-[#09261E]">
                5 days on PropertyDeals
              </Badge>
            </div>
            
            <div className="text-sm text-gray-500 mt-1">
              {property.address}, {property.city}, {property.state} {property.zipCode}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between mt-3">
          <Button 
            variant={isFavorite ? "default" : "outline"} 
            size="sm" 
            className={`${isFavorite 
              ? "bg-[#803344] text-white hover:bg-[#803344]/90" 
              : "border-[#803344] text-[#803344] hover:bg-[#803344]/10"} flex-1 mr-2`}
            onClick={toggleFavorite}
          >
            <Heart 
              className={`h-4 w-4 mr-1.5 ${isFavorite ? 'fill-white' : ''}`} 
            />
            {isFavorite ? 'Saved' : 'Save'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-gray-200 text-gray-700 flex-1 mr-2"
            onClick={() => setShareModalOpen(true)}
          >
            <Share className="h-4 w-4 mr-1.5" />
            Share
          </Button>
          <Button 
            size="sm" 
            className="bg-[#09261E] hover:bg-[#135341] text-white flex-1"
            onClick={handleContactClick}
          >
            Contact
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="pb-24"> {/* Padding bottom for floating CTA */}
        {/* Property Stats - Key Details */}
        <div className="px-4 py-4 border-b border-gray-200 grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Building className="text-[#09261E] w-5 h-5 mr-3" />
            <div>
              <div className="text-gray-600 text-sm">Bedrooms</div>
              <div className="font-medium">{property.bedrooms}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Bath className="text-[#09261E] w-5 h-5 mr-3" />
            <div>
              <div className="text-gray-600 text-sm">Bathrooms</div>
              <div className="font-medium">{property.bathrooms}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <SquareIcon className="text-[#09261E] w-5 h-5 mr-3" />
            <div>
              <div className="text-gray-600 text-sm">Square Feet</div>
              <div className="font-medium">{property.squareFeet?.toLocaleString() || 'N/A'}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Ruler className="text-[#09261E] w-5 h-5 mr-3" />
            <div>
              <div className="text-gray-600 text-sm">Lot Size</div>
              <div className="font-medium">{property.lotSize || '0.25 acres'}</div>
            </div>
          </div>
        </div>
        
        {/* Mobile view just shows the basic info - nothing else below the bedrooms/bathrooms section */}
      </div>
      
      {/* Floating CTA Bar */}
      <MobileFloatingCTA
        onClick={handleContactClick}
        sellerName="Michael Johnson"
        sellerImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&h=120&auto=format&fit=crop"
      />
      
      {/* Contact Seller Modal */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contact Seller</DialogTitle>
            <DialogDescription>
              Send a message to the property seller. They will respond to your inquiry as soon as possible.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="name" className="text-right">
                Name
              </FormLabel>
              <Input id="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="email" className="text-right">
                Email
              </FormLabel>
              <Input id="email" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="phone" className="text-right">
                Phone
              </FormLabel>
              <Input id="phone" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="message" className="text-right">
                Message
              </FormLabel>
              <Textarea id="message" className="col-span-3" placeholder="I'm interested in this property and would like to schedule a viewing." />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" className="bg-[#09261E] hover:bg-[#135341]">Send Message</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Get Contractor Quote Modal */}
      <Dialog open={offerModalOpen} onOpenChange={setOfferModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Get Contractor Quotes</DialogTitle>
            <DialogDescription>
              Request quotes from our network of verified contractors for renovations on this property.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="name" className="text-right">
                Name
              </FormLabel>
              <Input id="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="email" className="text-right">
                Email
              </FormLabel>
              <Input id="email" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="phone" className="text-right">
                Phone
              </FormLabel>
              <Input id="phone" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="workType" className="text-right">
                Work Type
              </FormLabel>
              <Input id="workType" className="col-span-3" placeholder="Kitchen remodel, bathroom update, etc." />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="details" className="text-right">
                Details
              </FormLabel>
              <Textarea id="details" className="col-span-3" placeholder="Please provide details about the work needed..." />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" className="bg-[#09261E] hover:bg-[#135341]">Request Quotes</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Share Dialog */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#09261E]">Share this Property</DialogTitle>
            <DialogDescription>
              Share this property with others via link, email, or social media.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            <div className="border rounded-lg overflow-hidden">
              {/* Copy Link Option */}
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <LinkIcon className="w-5 h-5 text-[#09261E] mr-3" />
                    <div className="font-medium">Copy Link</div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className={`${copySuccess ? 'bg-green-50 text-green-600 border-green-200' : 'border-gray-200'}`}
                    onClick={handleCopyToClipboard}
                  >
                    {copySuccess ? (
                      <><CheckIcon className="h-4 w-4 mr-1" /> Copied</>
                    ) : (
                      <><CopyIcon className="h-4 w-4 mr-1" /> Copy</>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Email Option */}
              <div className="border-b p-4">
                <div 
                  className="flex items-center justify-between cursor-pointer" 
                  onClick={handleEmailShare}
                >
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-[#09261E] mr-3" />
                    <div className="font-medium">Email</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              {/* PDF Report Option */}
              <div className="p-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={generatePdfReport}
                >
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-[#09261E] mr-3" />
                    <div className="font-medium">PDF Report</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500 mt-4">
              This property link will be active until the property is sold or removed by the seller.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MobilePropertyView;