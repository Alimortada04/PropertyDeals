import React, { useState } from 'react';
import { Property } from '@shared/schema';
import MobileImageCarousel from './mobile-image-carousel';
import MobileExpandableSheet from './mobile-expandable-sheet';
import MobileFloatingCTA from './mobile-floating-cta';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  MapPin, Calendar, Ruler, Home, Building, Users, FileText, 
  BarChart, DollarSign, MapPinned, Bookmark, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  
  // Sample property images
  const propertyImages = [
    property.imageUrl || 'https://source.unsplash.com/random/800x600/?house',
    'https://source.unsplash.com/random/800x600/?kitchen',
    'https://source.unsplash.com/random/800x600/?bathroom',
    'https://source.unsplash.com/random/800x600/?bedroom',
    'https://source.unsplash.com/random/800x600/?garden',
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

  return (
    <div className="min-h-screen bg-gray-100 relative lg:hidden">
      {/* Image Carousel */}
      <MobileImageCarousel 
        images={propertyImages} 
        address={property.address}
        onBack={onBack}
      />
      
      {/* Floating CTA Bar */}
      <MobileFloatingCTA
        onClick={onContactSeller}
        sellerName="Michael Johnson"
        sellerImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&h=120&auto=format&fit=crop"
      />
      
      {/* Call-to-action button that floats above the sheet */}
      <div className="fixed bottom-[70px] left-0 right-0 z-30 flex justify-center px-4">
        <Button 
          className="w-full bg-[#09261E] hover:bg-[#135341] py-6 text-base rounded-md shadow-md"
          onClick={onContactSeller}
        >
          Contact Seller
        </Button>
      </div>
      
      {/* Expandable Details Sheet */}
      <MobileExpandableSheet property={property} className={isLoaded ? 'translate-y-0' : 'translate-y-full'}>
        {/* Main Content Sections */}
        <div className="space-y-6">
          {/* Property Overview */}
          <div>
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
              {property.isOffMarket && (
                <Badge className="bg-[#803344] hover:bg-[#803344]">Off-Market Deal</Badge>
              )}
            </div>
            
            <p className="text-gray-700 leading-relaxed">
              {property.description || 
                "This beautiful property offers modern features and a convenient location. Recently updated with high-end finishes and spacious rooms perfect for entertaining. The neighborhood provides easy access to schools, parks, and shopping."}
            </p>
          </div>
          
          {/* Property Details Accordion - Open by default */}
          <Accordion type="single" defaultValue="details" collapsible className="w-full">
            <AccordionItem value="details" className="border-b border-gray-200">
              <AccordionTrigger className="w-full py-4 text-xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                <div className="flex items-center">
                  <span className="mr-3 text-lg">🏠</span>
                  <span>Property Details</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2 py-4">
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
          
          {/* Other accordions - Closed by default */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="pricing" className="border-b border-gray-200">
              <AccordionTrigger className="w-full py-4 text-xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                <div className="flex items-center">
                  <span className="mr-3 text-lg">💰</span>
                  <span>Pricing & Financials</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2 py-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <div className="font-medium">Asking Price</div>
                    <div className="font-bold text-[#09261E]">${property.price?.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <div className="font-medium">Price per sq ft</div>
                    <div>
                      ${property.squareFeet 
                        ? Math.round((property.price || 0) / property.squareFeet).toLocaleString() 
                        : 'N/A'}
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <div className="font-medium">Est. Monthly Payment</div>
                    <div>$1,750/mo</div>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="font-medium mb-2">Payment Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          <span>Principal & Interest</span>
                        </div>
                        <div>$1,250</div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span>Property Tax</span>
                        </div>
                        <div>$250</div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                          <span>Insurance</span>
                        </div>
                        <div>$120</div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                          <span>HOA Fees</span>
                        </div>
                        <div>$130</div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="location" className="border-b border-gray-200">
              <AccordionTrigger className="w-full py-4 text-xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                <div className="flex items-center">
                  <span className="mr-3 text-lg">📍</span>
                  <span>Location & Neighborhood</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2 py-4">
                <div className="rounded-lg overflow-hidden bg-gray-100 h-[200px] mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <MapPinned className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                    <Button variant="outline" className="bg-white">View on Map</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Address</h4>
                    <p className="text-gray-700">{formattedAddress}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Nearby Amenities</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Schools</span>
                        <div className="flex">
                          {[1, 2, 3, 4].map((i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                          ))}
                          <Star className="h-4 w-4 text-gray-300" />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Shopping</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Parks</span>
                        <div className="flex">
                          {[1, 2, 3].map((i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                          ))}
                          {[1, 2].map((i) => (
                            <Star key={i} className="h-4 w-4 text-gray-300" />
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Transportation</span>
                        <div className="flex">
                          {[1, 2, 3, 4].map((i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                          ))}
                          <Star className="h-4 w-4 text-gray-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="investment" className="border-b border-gray-200">
              <AccordionTrigger className="w-full py-4 text-xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                <div className="flex items-center">
                  <span className="mr-3 text-lg">📈</span>
                  <span>Investment Potential</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2 py-4">
                <div className="space-y-4">
                  <div className="p-3 bg-[#09261E]/5 rounded-lg">
                    <div className="font-medium text-[#09261E] mb-1">Cap Rate</div>
                    <div className="text-2xl font-bold text-[#09261E]">5.7%</div>
                    <div className="text-xs text-gray-500 mt-1">Estimated based on rental data</div>
                  </div>
                  
                  <div className="p-3 bg-[#09261E]/5 rounded-lg">
                    <div className="font-medium text-[#09261E] mb-1">Cash on Cash Return</div>
                    <div className="text-2xl font-bold text-[#09261E]">7.2%</div>
                    <div className="text-xs text-gray-500 mt-1">Based on 20% down payment</div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-700 mb-1">Appreciation Forecast</div>
                    <div className="text-2xl font-bold text-blue-700">15.3%</div>
                    <div className="text-xs text-gray-500 mt-1">Projected 5-year appreciation</div>
                  </div>
                  
                  <Button className="w-full bg-[#09261E] hover:bg-[#135341]">
                    Run Custom Investment Analysis
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="comparables" className="border-b border-gray-200">
              <AccordionTrigger className="w-full py-4 text-xl font-heading font-bold text-[#09261E] hover:no-underline hover:text-[#803344] transition-colors justify-between">
                <div className="flex items-center">
                  <span className="mr-3 text-lg">🏘️</span>
                  <span>Comparable Properties</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2 py-4">
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
                      <div className="w-2/5">
                        <img src={`https://source.unsplash.com/random/300x200/?house&sig=${item}`} 
                            alt="Comparable property" 
                            className="w-full h-full object-cover" />
                      </div>
                      <div className="w-3/5 p-3">
                        <div className="font-medium text-[#09261E] mb-1 text-sm truncate">123 Nearby St, {property.city}</div>
                        <div className="text-gray-600 text-xs mb-1">2 mi away • Similar sq ft</div>
                        <div className="flex justify-between">
                          <div className="font-bold text-[#09261E]">${(property.price || 0) - 20000 + (item * 15000)}</div>
                          <div className="text-xs text-gray-500">{property.bedrooms}bd, {property.bathrooms}ba</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    View All Comparable Properties
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          {/* Extra spacing at the bottom to account for floating elements */}
          <div className="h-32"></div>
        </div>
      </MobileExpandableSheet>
    </div>
  );
};

export default MobilePropertyView;