import React, { useState } from 'react';
import { Property } from '@shared/schema';
import MobileImageCarousel from './mobile-image-carousel';
import MobileFloatingCTA from './mobile-floating-cta';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  MapPin, Calendar, Ruler, Home, Building, Users, FileText, 
  BarChart, DollarSign, MapPinned, Bookmark, Star, Heart, Share
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
          <div>
            <h1 className="text-2xl font-bold text-[#09261E]">${property.price?.toLocaleString()}</h1>
            <div className="flex text-sm space-x-4 mt-1 text-gray-600">
              <div>{property.bedrooms} bd</div>
              <div>{property.bathrooms} ba</div>
              <div>{property.squareFeet?.toLocaleString() || 'N/A'} sq ft</div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {property.address}, {property.city}, {property.state}
            </div>
          </div>
          <div className="bg-[#09261E]/10 text-[#09261E] text-xs font-semibold px-2 py-1 rounded">
            FOR SALE
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-gray-200 text-gray-700 flex-1 mr-2"
            onClick={toggleFavorite}
          >
            <Heart 
              className={`h-4 w-4 mr-1.5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
            />
            {isFavorite ? 'Saved' : 'Save'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-gray-200 text-gray-700 flex-1 mr-2"
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
        {/* Property Overview */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="text-sm text-gray-500 mb-2 flex items-center">
            <MapPin size={14} className="mr-1" />
            Listed by HelloRealty LLC
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="bg-[#09261E]/10 hover:bg-[#09261E]/20 text-[#09261E]">
              {property.propertyType}
            </Badge>
            <Badge variant="secondary" className="bg-[#09261E]/10 hover:bg-[#09261E]/20 text-[#09261E]">
              Built in 2015
            </Badge>
            {property.status?.toLowerCase().includes('off-market') && (
              <Badge className="bg-[#803344] hover:bg-[#803344]">Off-Market Deal</Badge>
            )}
          </div>
          
          <p className="text-gray-700 leading-relaxed">
            {property.description || 
              "This beautiful property offers modern features and a convenient location. Recently updated with high-end finishes and spacious rooms perfect for entertaining. The neighborhood provides easy access to schools, parks, and shopping."}
          </p>
        </div>
        
        {/* Property Stats Summary */}
        <div className="px-4 py-4 grid grid-cols-2 gap-y-3 border-b border-gray-200">
          <div>
            <div className="text-xs text-gray-500">PROPERTY TYPE</div>
            <div className="font-medium">{property.propertyType}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">YEAR BUILT</div>
            <div className="font-medium">2015</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">PRICE/SQ FT</div>
            <div className="font-medium">
              ${property.squareFeet 
                ? Math.round((property.price || 0) / property.squareFeet).toLocaleString() 
                : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">LOT SIZE</div>
            <div className="font-medium">{property.lotSize || '0.25 acres'}</div>
          </div>
        </div>
        
        {/* Property Details Accordion - Open by default */}
        <Accordion type="single" defaultValue="details" collapsible className="w-full">
          <AccordionItem value="details" className="border-b border-gray-200">
            <AccordionTrigger className="w-full py-4 px-4 text-xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
              <div className="flex items-center">
                <span className="mr-3 text-lg">🏠</span>
                <span>Property Details</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Building className="w-5 h-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Type</p>
                    <p className="text-gray-700">{property.propertyType}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Ruler className="w-5 h-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Size</p>
                    <p className="text-gray-700">{property.squareFeet?.toLocaleString() || 'N/A'} sq ft</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Home className="w-5 h-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Bedrooms</p>
                    <p className="text-gray-700">{property.bedrooms}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Bathrooms</p>
                    <p className="text-gray-700">{property.bathrooms}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Year Built</p>
                    <p className="text-gray-700">2015</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">MLS #</p>
                    <p className="text-gray-700">MLS12345</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Features & Amenities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-4 h-4 mr-2 rounded-full flex items-center justify-center ${feature.present ? 'bg-[#09261E]' : 'bg-gray-200'}`}>
                        {feature.present && (
                          <span className="text-white text-[8px]">✓</span>
                        )}
                      </div>
                      <span className={feature.present ? 'text-gray-800' : 'text-gray-400 line-through'}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* The Numbers section */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="numbers" className="border-b border-gray-200">
            <AccordionTrigger className="w-full py-4 px-4 text-xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
              <div className="flex items-center">
                <span className="mr-3 text-lg">🔢</span>
                <span>The Numbers</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Rent</div>
                  <div className="font-semibold text-[#09261E] flex items-center">
                    $3,672<span className="text-sm text-gray-500 ml-1">/month</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="font-medium">Estimated Repair Costs</div>
                  <div className="font-semibold text-[#09261E] flex items-center">
                    $22,950
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="font-medium">Estimated Monthly Expenses</div>
                  <div className="font-semibold text-[#09261E] flex items-center">
                    $1,377<span className="text-sm text-gray-500 ml-1">/month</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="font-medium">ARV</div>
                  <div className="font-semibold text-[#09261E]">$550,800</div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-3 gap-y-4 gap-x-2">
                    <div>
                      <div className="text-sm text-gray-500">Cap Rate</div>
                      <div className="font-semibold">5.2%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Cash-on-Cash Return</div>
                      <div className="font-semibold">7.8%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Monthly Rent %</div>
                      <div className="font-semibold">0.76%</div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleOfferClick}
                  >
                    I'm a contractor — Submit a Quote
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="location" className="border-b border-gray-200">
            <AccordionTrigger className="w-full py-4 px-4 text-xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
              <div className="flex items-center">
                <span className="mr-3 text-lg">📍</span>
                <span>Location & Demographics</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4">
              <div className="rounded-lg overflow-hidden bg-gray-100 h-[200px] mb-4 flex items-center justify-center">
                <div className="text-center">
                  <MapPinned className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <Button variant="outline" className="bg-white">View on Map</Button>
                </div>
              </div>
              
              <div className="space-y-5">
                <div>
                  <h4 className="font-medium mb-2">Population</h4>
                  <p className="text-gray-700">{demographicData.population.toLocaleString()}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Demographics</h4>
                  <div className="rounded-lg bg-gray-50 p-4">
                    
                    {/* Home Values - Now first per your request */}
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-2">Home Values</div>
                      <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden">
                        {demographicData.homeValues.map((item, index) => (
                          <div 
                            key={index}
                            className="h-full float-left" 
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: [
                                'rgba(19, 83, 65, 0.95)', // dark green (primary)
                                'rgba(19, 83, 65, 0.8)',  // medium green
                                'rgba(19, 83, 65, 0.65)', // light green
                                'rgba(128, 51, 68, 0.65)', // light wine
                                'rgba(128, 51, 68, 0.8)',  // medium wine
                                'rgba(128, 51, 68, 0.95)'  // dark wine (secondary)
                              ][index % 6]
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-2 mt-2">
                        {demographicData.homeValues.map((item, index) => (
                          <div key={index} className="flex items-center text-xs">
                            <div 
                              className="w-3 h-3 rounded-full mr-1"
                              style={{
                                backgroundColor: [
                                  'rgba(19, 83, 65, 0.95)', // dark green (primary)
                                  'rgba(19, 83, 65, 0.8)',  // medium green
                                  'rgba(19, 83, 65, 0.65)', // light green
                                  'rgba(128, 51, 68, 0.65)', // light wine
                                  'rgba(128, 51, 68, 0.8)',  // medium wine
                                  'rgba(128, 51, 68, 0.95)'  // dark wine (secondary)
                                ][index % 6]
                              }}
                            />
                            <span>{item.group}: {item.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Housing Ownership - Now second per your request */}
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-2">Housing Ownership</div>
                      <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden">
                        {demographicData.ownershipType.map((item, index) => (
                          <div 
                            key={index}
                            className="h-full float-left" 
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: [
                                'rgba(19, 83, 65, 0.95)', // dark green
                                'rgba(19, 83, 65, 0.75)', // medium green
                                'rgba(128, 51, 68, 0.75)', // medium wine
                                'rgba(229, 159, 159, 0.8)'  // salmon
                              ][index]
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-2 mt-2">
                        {demographicData.ownershipType.map((item, index) => (
                          <div key={index} className="flex items-center text-xs">
                            <div 
                              className="w-3 h-3 rounded-full mr-1"
                              style={{
                                backgroundColor: [
                                  'rgba(19, 83, 65, 0.95)', // dark green
                                  'rgba(19, 83, 65, 0.75)', // medium green
                                  'rgba(128, 51, 68, 0.75)', // medium wine
                                  'rgba(229, 159, 159, 0.8)'  // salmon
                                ][index]
                              }}
                            />
                            <span>{item.group}: {item.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Monthly Rent Costs - Kept in same position */}
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-2">Monthly Rent Costs</div>
                      <div className="grid grid-cols-2 gap-3">
                        {demographicData.monthlyRent.map((item, index) => (
                          <div key={index} className="border rounded-md bg-white p-3">
                            <div className="text-xs text-gray-500 mb-1">{item.type}</div>
                            <div className="font-semibold">${item.rent}/mo</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Household Income with single bar */}
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-2">Household Income</div>
                      <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden">
                        {demographicData.householdIncome.map((item, index) => (
                          <div 
                            key={index}
                            className="h-full float-left" 
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: [
                                'rgba(19, 83, 65, 0.95)', // dark green
                                'rgba(19, 83, 65, 0.85)', 
                                'rgba(19, 83, 65, 0.75)', 
                                'rgba(19, 83, 65, 0.65)', 
                                'rgba(19, 83, 65, 0.55)'
                              ][index % 5]
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-2 mt-2">
                        {demographicData.householdIncome.map((item, index) => (
                          <div key={index} className="flex items-center text-xs">
                            <div 
                              className="w-3 h-3 rounded-full mr-1"
                              style={{
                                backgroundColor: [
                                  'rgba(19, 83, 65, 0.95)', // dark green
                                  'rgba(19, 83, 65, 0.85)', 
                                  'rgba(19, 83, 65, 0.75)', 
                                  'rgba(19, 83, 65, 0.65)', 
                                  'rgba(19, 83, 65, 0.55)'
                                ][index % 5]
                              }}
                            />
                            <span>{item.group}: {item.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Year Housing Was Built and Age Distribution - Side by Side */}
                    <div className="mb-4">
                      <div className="grid grid-cols-1 gap-6">
                        {/* Year Housing Built - Bar Chart */}
                        <div>
                          <div className="text-sm font-medium mb-2">Year Housing Was Built</div>
                          <div className="space-y-2">
                            {demographicData.yearBuilt.map((item, index) => (
                              <div key={index} className="w-full">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>{item.group}</span>
                                  <span>{item.percentage}%</span>
                                </div>
                                <div className="h-5 w-full bg-gray-100 rounded-sm overflow-hidden">
                                  <div 
                                    className="h-full"
                                    style={{ 
                                      width: `${item.percentage}%`,
                                      backgroundColor: [
                                        'rgba(19, 83, 65, 0.95)', // darkest
                                        'rgba(19, 83, 65, 0.85)', 
                                        'rgba(19, 83, 65, 0.75)', 
                                        'rgba(19, 83, 65, 0.65)', 
                                        'rgba(19, 83, 65, 0.55)'
                                      ][index % 5]
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Age Distribution - Pie Chart */}
                        <div>
                          <div className="text-sm font-medium mb-2 mt-4">Age Distribution</div>
                          <div className="relative w-full aspect-square max-w-[180px] mx-auto">
                            {/* Create pie chart using conic-gradient */}
                            <div 
                              className="w-full h-full rounded-full"
                              style={{ 
                                background: `conic-gradient(
                                  rgba(128, 51, 68, 0.95) 0% ${demographicData.ageDistribution[0].percentage}%, 
                                  rgba(128, 51, 68, 0.85) ${demographicData.ageDistribution[0].percentage}% ${demographicData.ageDistribution[0].percentage + demographicData.ageDistribution[1].percentage}%, 
                                  rgba(128, 51, 68, 0.75) ${demographicData.ageDistribution[0].percentage + demographicData.ageDistribution[1].percentage}% ${demographicData.ageDistribution[0].percentage + demographicData.ageDistribution[1].percentage + demographicData.ageDistribution[2].percentage}%, 
                                  rgba(128, 51, 68, 0.65) ${demographicData.ageDistribution[0].percentage + demographicData.ageDistribution[1].percentage + demographicData.ageDistribution[2].percentage}% ${demographicData.ageDistribution[0].percentage + demographicData.ageDistribution[1].percentage + demographicData.ageDistribution[2].percentage + demographicData.ageDistribution[3].percentage}%,
                                  rgba(128, 51, 68, 0.55) ${demographicData.ageDistribution[0].percentage + demographicData.ageDistribution[1].percentage + demographicData.ageDistribution[2].percentage + demographicData.ageDistribution[3].percentage}% ${demographicData.ageDistribution[0].percentage + demographicData.ageDistribution[1].percentage + demographicData.ageDistribution[2].percentage + demographicData.ageDistribution[3].percentage + demographicData.ageDistribution[4].percentage}%,
                                  rgba(128, 51, 68, 0.45) ${demographicData.ageDistribution[0].percentage + demographicData.ageDistribution[1].percentage + demographicData.ageDistribution[2].percentage + demographicData.ageDistribution[3].percentage + demographicData.ageDistribution[4].percentage}% 100%
                                )`
                              }}
                            />
                            {/* Center hole to create donut */}
                            <div className="absolute top-1/2 left-1/2 w-[40%] h-[40%] bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                          </div>
                          <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 mt-3">
                            {demographicData.ageDistribution.map((item, index) => (
                              <div key={index} className="flex items-center text-xs">
                                <div 
                                  className="w-3 h-3 rounded-full mr-1"
                                  style={{
                                    backgroundColor: [
                                      'rgba(128, 51, 68, 0.95)', 
                                      'rgba(128, 51, 68, 0.85)', 
                                      'rgba(128, 51, 68, 0.75)', 
                                      'rgba(128, 51, 68, 0.65)', 
                                      'rgba(128, 51, 68, 0.55)', 
                                      'rgba(128, 51, 68, 0.45)'
                                    ][index % 6]
                                  }}
                                />
                                <span>{item.group}: {item.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Gender Distribution - Moved to bottom per your request */}
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-2">Gender Distribution</div>
                      <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden">
                        {demographicData.genderDistribution.map((item, index) => (
                          <div 
                            key={index}
                            className="h-full float-left" 
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: index === 0 ? 'rgba(19, 83, 65, 0.9)' : 'rgba(128, 51, 68, 0.9)'
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-2 mt-2">
                        {demographicData.genderDistribution.map((item, index) => (
                          <div key={index} className="flex items-center text-xs">
                            <div 
                              className="w-3 h-3 rounded-full mr-1"
                              style={{
                                backgroundColor: index === 0 ? 'rgba(19, 83, 65, 0.9)' : 'rgba(128, 51, 68, 0.9)'
                              }}
                            />
                            <span>{item.group}: {item.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-center text-xs text-gray-500">
                      Data sourced from unitedstateszipcodes.org
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="calculators" className="border-b border-gray-200">
            <AccordionTrigger className="w-full py-4 px-4 text-xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
              <div className="flex items-center">
                <span className="mr-3 text-lg">🧮</span>
                <span>Calculators</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4">
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="text-lg font-bold mb-3">Flip Calculator</div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Purchase Price (Automatic)</div>
                      <div className="flex border rounded-md bg-white">
                        <div className="py-2 px-3 text-gray-700 border-r bg-gray-50">$</div>
                        <div className="py-2 px-3 flex-1">459,000</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Repair Costs (Automatic)</div>
                      <div className="flex border rounded-md bg-white">
                        <div className="py-2 px-3 text-gray-700 border-r bg-gray-50">$</div>
                        <div className="py-2 px-3 flex-1">22,950</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 mb-1">ARV</div>
                      <div className="flex border rounded-md bg-white">
                        <div className="py-2 px-3 text-gray-700 border-r bg-gray-50">$</div>
                        <div className="py-2 px-3 flex-1">550,800</div>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-[#09261E] hover:bg-[#135341]">
                      Calculate Profit
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="text-lg font-bold mb-3">Rental Calculator</div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Purchase Price (Automatic)</div>
                      <div className="flex border rounded-md bg-white">
                        <div className="py-2 px-3 text-gray-700 border-r bg-gray-50">$</div>
                        <div className="py-2 px-3 flex-1">459,000</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Monthly Rent</div>
                      <div className="flex border rounded-md bg-white">
                        <div className="py-2 px-3 text-gray-700 border-r bg-gray-50">$</div>
                        <div className="py-2 px-3 flex-1">3,672</div>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-[#09261E] hover:bg-[#135341]">
                      Calculate Returns
                    </Button>
                  </div>
                </div>
                
                <div className="text-center">
                  <a href="#" className="text-[#09261E] inline-flex items-center text-sm hover:underline">
                    View All Property Calculators
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="findRep" className="border-b border-gray-200">
            <AccordionTrigger className="w-full py-4 px-4 text-xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
              <div className="flex items-center">
                <span className="mr-3 text-lg">👥</span>
                <span>Find a REP</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4">
              <div className="space-y-4">
                <p className="text-gray-700">Connect with local professionals who can help with this property:</p>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="border rounded-md p-4 flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium">Agent</div>
                  </div>
                  
                  <div className="border rounded-md p-4 flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium">Contractor</div>
                  </div>
                  
                  <div className="border rounded-md p-4 flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium">Lender</div>
                  </div>
                </div>
                
                <div className="text-center pt-2">
                  <a href="#" className="text-[#09261E] inline-flex items-center text-sm hover:underline">
                    View All REPs
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="propertyHistory" className="border-b border-gray-200">
            <AccordionTrigger className="w-full py-4 px-4 text-xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
              <div className="flex items-center">
                <span className="mr-3 text-lg">🏛️</span>
                <span>Property History</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b text-left text-xs text-gray-500">
                      <th className="pb-2 font-medium">DATE</th>
                      <th className="pb-2 font-medium">EVENT</th>
                      <th className="pb-2 font-medium">PRICE</th>
                      <th className="pb-2 font-medium">SOURCE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">12/15/2024</td>
                      <td className="py-3 pr-4">Listed</td>
                      <td className="py-3 pr-4">$459,000</td>
                      <td className="py-3 pr-4">PropertyDeals</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">06/30/2024</td>
                      <td className="py-3 pr-4">Assessed</td>
                      <td className="py-3 pr-4">$390,150</td>
                      <td className="py-3 pr-4">County Records</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">01/22/2019</td>
                      <td className="py-3 pr-4">Sold</td>
                      <td className="py-3 pr-4">$367,200</td>
                      <td className="py-3 pr-4">MLS</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Property history data is for demonstration purposes. In a production app, this would be pulled from public records.
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="comparableProperties" className="border-b border-gray-200">
            <AccordionTrigger className="w-full py-4 px-4 text-xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
              <div className="flex items-center">
                <span className="mr-3 text-lg">🏘️</span>
                <span>Comparable Properties</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4">
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="flex flex-col space-y-4">
                    <div className="border rounded-md overflow-hidden">
                      <div className="flex">
                        <div className="w-1/3">
                          <img 
                            src="https://images.unsplash.com/photo-1598228723793-52759bba239c?q=80&w=300&h=200&auto=format&fit=crop" 
                            alt="456 Elm Street"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="w-2/3 p-3">
                          <h4 className="font-medium">456 Elm Street</h4>
                          <p className="text-sm text-gray-500">Milwaukee, WI</p>
                          <div className="mt-2 flex justify-between">
                            <div className="font-bold">$439,000</div>
                            <div className="text-sm text-gray-500">3bd, 2ba</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md overflow-hidden">
                      <div className="flex">
                        <div className="w-1/3">
                          <img 
                            src="https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=300&h=200&auto=format&fit=crop" 
                            alt="789 Oak Road"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="w-2/3 p-3">
                          <h4 className="font-medium">789 Oak Road</h4>
                          <p className="text-sm text-gray-500">Milwaukee, WI</p>
                          <div className="mt-2 flex justify-between">
                            <div className="font-bold">$475,000</div>
                            <div className="text-sm text-gray-500">4bd, 3ba</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md overflow-hidden">
                      <div className="flex">
                        <div className="w-1/3">
                          <img 
                            src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=300&h=200&auto=format&fit=crop" 
                            alt="101 Pine Lane"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="w-2/3 p-3">
                          <h4 className="font-medium">101 Pine Lane</h4>
                          <p className="text-sm text-gray-500">Milwaukee, WI</p>
                          <div className="mt-2 flex justify-between">
                            <div className="font-bold">$495,000</div>
                            <div className="text-sm text-gray-500">4bd, 2.5ba</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center pt-2">
                  <a href="#" className="text-[#09261E] inline-flex items-center text-sm hover:underline">
                    View All Comparable Properties
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Other properties by same seller */}
        <div className="px-4 py-6">
          <h2 className="text-xl font-bold mb-4">Other Properties by Michael Johnson</h2>
          <div className="space-y-4">
            {sellerProperties.map((property) => (
              <div key={property.id} className="border rounded-md overflow-hidden">
                <div className="flex">
                  <div className="w-1/3">
                    <img 
                      src={property.imageUrl} 
                      alt={property.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="w-2/3 p-3">
                    <h4 className="font-medium">{property.title}</h4>
                    <p className="text-sm text-gray-500">{property.address}</p>
                    <div className="mt-2 flex justify-between">
                      <div className="font-bold">${property.price.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{property.bedrooms}bd, {property.bathrooms}ba</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center pt-2">
              <a href="#" className="text-[#09261E] inline-flex items-center text-sm hover:underline">
                View All Properties by Michael Johnson
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
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
    </div>
  );
};

export default MobilePropertyView;