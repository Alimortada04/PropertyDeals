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
                <span>Location & Neighborhood</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4">
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