export interface Rep {
  id: number;
  name: string;
  role: string;
  location: {
    city: string;
    state: string;
  };
  avatar: string;
  yearsExperience: number;
  rating: number;
  reviewCount: number;
  specialties: string[];
  bio: string;
  isFeatured?: boolean;
  // Additional properties for enhanced profile
  memberSince?: string;
  lastActive?: string;
  responseTime?: string;
  contact?: {
    phone?: string;
    email?: string;
  };
  bannerUrl?: string;
  website?: string;
  social?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
  availability?: string;
  availabilitySchedule?: Array<{ day: string; hours: string }>;
  expertise?: string[];
  propertyTypes?: string[];
  locationsServed?: string[];
  credentials?: string[];
  additionalInfo?: string;
}

// Sample REP data
// Helper function to get a REP by ID
export function getRepById(id: number): Rep | undefined {
  return reps.find(rep => rep.id === id);
}

// Helper function to get a REP by slug (name-based URL)
export function getRepBySlug(slug: string): Rep | undefined {
  // Convert slug to a standard format, assuming slug is name-based
  const normalizedSlug = slug.toLowerCase().replace(/\s+/g, '-');
  
  return reps.find(rep => {
    const repSlug = rep.name.toLowerCase().replace(/\s+/g, '-');
    return repSlug === normalizedSlug;
  });
}

export const reps: Rep[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Real Estate Agent",
    location: {
      city: "Austin",
      state: "TX"
    },
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    yearsExperience: 8,
    rating: 4.9,
    reviewCount: 124,
    specialties: ["Luxury Homes", "First-time Buyers", "Investments"],
    bio: "With over 8 years of experience in the Austin market, I specialize in helping clients find their dream homes in this vibrant city. My expertise includes luxury properties, assisting first-time buyers, and identifying solid investment opportunities.",
    isFeatured: true,
    memberSince: "2017-03-15T00:00:00.000Z",
    contact: {
      phone: "512-555-1234",
      email: "sarah.johnson@example.com"
    },
    bannerUrl: "https://images.pexels.com/photos/7031406/pexels-photo-7031406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    website: "https://sarahjohnsonrealty.example.com",
    social: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      instagram: "https://instagram.com/sarahjohnsonrealty",
      facebook: "https://facebook.com/sarahjohnsonrealty",
      twitter: "https://twitter.com/sarahjrealty"
    }
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Commercial Property Specialist",
    location: {
      city: "San Francisco",
      state: "CA"
    },
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    yearsExperience: 12,
    rating: 4.8,
    reviewCount: 98,
    specialties: ["Commercial Real Estate", "Office Space", "Retail Properties"],
    bio: "As a commercial property specialist with over a decade of experience in the San Francisco Bay Area, I help businesses find the perfect spaces to thrive. My extensive network and market knowledge ensure my clients always get the best deals."
  },
  {
    id: 3,
    name: "Jennifer Lopez",
    role: "Residential Real Estate Advisor",
    location: {
      city: "Miami",
      state: "FL"
    },
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    yearsExperience: 6,
    rating: 4.7,
    reviewCount: 75,
    specialties: ["Luxury Condos", "Waterfront Properties", "International Clients"],
    bio: "Based in vibrant Miami, I specialize in helping clients find their perfect home or investment opportunity. With particular expertise in luxury condos and waterfront properties, I pride myself on providing personalized service to domestic and international clients alike.",
    isFeatured: true
  },
  {
    id: 4,
    name: "David Williams",
    role: "Investment Property Expert",
    location: {
      city: "Chicago",
      state: "IL"
    },
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    yearsExperience: 15,
    rating: 4.9,
    reviewCount: 142,
    specialties: ["Investment Properties", "Multi-family Units", "Property Portfolio Management"],
    bio: "With 15 years in Chicago's dynamic real estate market, I help investors build and manage profitable property portfolios. My analytical approach and deep market knowledge are why my clients trust me with their investment strategies."
  },
  {
    id: 5,
    name: "Rodriguez & Associates",
    role: "Real Estate Agency",
    location: {
      city: "Los Angeles",
      state: "CA"
    },
    avatar: "https://logo.clearbit.com/rodriguezassociates.com",
    yearsExperience: 20,
    rating: 4.8,
    reviewCount: 215,
    specialties: ["Luxury Estates", "Celebrity Homes", "Commercial Properties"],
    bio: "As a premier real estate agency in Los Angeles for over 20 years, Rodriguez & Associates has built a reputation for exceptional service and discretion. We specialize in luxury estates, celebrity homes, and high-value commercial properties throughout Southern California."
  },
  {
    id: 6,
    name: "Emma Thompson",
    role: "New Construction Specialist",
    location: {
      city: "Seattle",
      state: "WA"
    },
    avatar: "https://randomuser.me/api/portraits/women/29.jpg",
    yearsExperience: 9,
    rating: 4.6,
    reviewCount: 83,
    specialties: ["New Developments", "Pre-construction Sales", "Urban Living"],
    bio: "I specialize in helping clients navigate the exciting but complex world of new construction and pre-construction properties in the greater Seattle area. My background in urban planning gives my clients an edge in understanding future neighborhood development."
  },
  {
    id: 7,
    name: "James Wilson",
    role: "Rural & Farm Property Expert",
    location: {
      city: "Nashville",
      state: "TN"
    },
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    yearsExperience: 18,
    rating: 4.9,
    reviewCount: 112,
    specialties: ["Farm Properties", "Ranch Land", "Recreational Land"],
    bio: "With deep roots in Tennessee's agricultural community, I specialize in farm, ranch, and rural property transactions. My extensive knowledge of land use regulations and agricultural operations helps my clients make informed decisions about their rural property investments."
  },
  {
    id: 8,
    name: "Mountain View Properties",
    role: "Real Estate Brokerage",
    location: {
      city: "Denver",
      state: "CO"
    },
    avatar: "https://logo.clearbit.com/mountainviewproperties.com",
    yearsExperience: 25,
    rating: 4.7,
    reviewCount: 187,
    specialties: ["Mountain Retreats", "Ski Properties", "Luxury Homes"],
    bio: "For 25 years, Mountain View Properties has been the premier brokerage for Colorado's most desirable mountain homes and retreats. Our team of seasoned professionals has unparalleled knowledge of the Rocky Mountain real estate market from Aspen to Vail and beyond."
  },
  {
    id: 9,
    name: "Sophia Martinez",
    role: "First-time Homebuyer Specialist",
    location: {
      city: "Phoenix",
      state: "AZ"
    },
    avatar: "https://randomuser.me/api/portraits/women/58.jpg",
    yearsExperience: 7,
    rating: 4.8,
    reviewCount: 91,
    specialties: ["First-time Buyers", "Affordable Housing", "FHA Loans"],
    bio: "I'm passionate about helping first-time homebuyers navigate the complex process of purchasing their first property. My knowledge of financing options, including FHA and other first-time buyer programs, helps my clients achieve their homeownership dreams."
  },
  {
    id: 10,
    name: "Heritage Realty Group",
    role: "Historic Property Specialists",
    location: {
      city: "Charleston",
      state: "SC"
    },
    avatar: "https://logo.clearbit.com/heritagerealty.com",
    yearsExperience: 30,
    rating: 4.9,
    reviewCount: 156,
    specialties: ["Historic Homes", "Architectural Preservation", "Downtown Properties"],
    bio: "Heritage Realty Group has been the trusted name in Charleston's historic property market for three decades. Our specialists have unmatched expertise in historic architectural styles, preservation requirements, and the unique considerations of owning and maintaining a piece of history."
  },
  {
    id: 11,
    name: "Alexander Rivera",
    role: "Property Inspector",
    location: {
      city: "Tampa",
      state: "FL"
    },
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    yearsExperience: 14,
    rating: 4.9,
    reviewCount: 182,
    specialties: ["Residential Inspections", "Commercial Inspections", "Foundation Analysis"],
    bio: "With over 14 years of experience and 1,000+ inspections completed, I provide thorough and detailed property inspections throughout the Tampa Bay area. My background in structural engineering allows me to identify issues that others might miss."
  },
  {
    id: 12,
    name: "Natalie Wong",
    role: "Property Appraiser",
    location: {
      city: "Portland",
      state: "OR"
    },
    avatar: "https://randomuser.me/api/portraits/women/38.jpg",
    yearsExperience: 11,
    rating: 4.7,
    reviewCount: 93,
    specialties: ["Residential Appraisals", "Investment Properties", "Refinancing"],
    bio: "As a certified residential appraiser with 11 years of experience in the Portland metro area, I provide accurate and objective property valuations. My reports are detailed, timely, and comply with all industry standards and regulations."
  },
  {
    id: 13,
    name: "Platinum Lending Solutions",
    role: "Mortgage Lender",
    location: {
      city: "Boston",
      state: "MA"
    },
    avatar: "https://logo.clearbit.com/platinumlending.com",
    yearsExperience: 18,
    rating: 4.8,
    reviewCount: 215,
    specialties: ["Conventional Loans", "Jumbo Loans", "First-time Buyer Programs"],
    bio: "Platinum Lending Solutions has been helping Boston area residents secure the best mortgage rates for nearly two decades. Our team of experienced loan officers specializes in finding the perfect financing solution for every client's unique situation."
  },
  {
    id: 14,
    name: "Jason Thomas",
    role: "General Contractor",
    location: {
      city: "Atlanta",
      state: "GA"
    },
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    yearsExperience: 20,
    rating: 4.9,
    reviewCount: 178,
    specialties: ["Home Renovations", "Additions", "Kitchen & Bath Remodels"],
    bio: "With 20 years of experience in residential construction and renovation, I lead a team of skilled craftsmen who take pride in quality workmanship. From full home renovations to targeted upgrades, we deliver projects on time and on budget."
  },
  {
    id: 15,
    name: "Green Thumb Landscaping",
    role: "Landscaper",
    location: {
      city: "San Diego",
      state: "CA"
    },
    avatar: "https://logo.clearbit.com/greenthumblandscaping.com",
    yearsExperience: 15,
    rating: 4.8,
    reviewCount: 123,
    specialties: ["Drought-Resistant Design", "Outdoor Living Spaces", "Property Enhancement"],
    bio: "Green Thumb Landscaping specializes in creating beautiful, sustainable outdoor spaces throughout San Diego County. Our designs not only enhance your property's curb appeal but also increase its value while being environmentally conscious."
  },
  {
    id: 16,
    name: "Elite Moving Solutions",
    role: "Mover",
    location: {
      city: "Dallas",
      state: "TX"
    },
    avatar: "https://logo.clearbit.com/elitemoving.com",
    yearsExperience: 12,
    rating: 4.7,
    reviewCount: 256,
    specialties: ["Residential Moves", "Commercial Relocations", "Packing Services"],
    bio: "Elite Moving Solutions provides stress-free moving experiences for residential and commercial clients throughout the Dallas-Fort Worth metroplex. Our professional team handles every aspect of your move with care and efficiency."
  },
  {
    id: 17,
    name: "Rachel Kim",
    role: "Real Estate Attorney",
    location: {
      city: "New York",
      state: "NY"
    },
    avatar: "https://randomuser.me/api/portraits/women/42.jpg",
    yearsExperience: 16,
    rating: 4.9,
    reviewCount: 87,
    specialties: ["Residential Closings", "Commercial Transactions", "Lease Agreements"],
    bio: "As a real estate attorney with 16 years of experience in New York's complex property market, I help clients navigate legal aspects of buying, selling, and leasing with confidence. My thorough approach ensures your interests are protected."
  },
  {
    id: 18,
    name: "Marcus Johnson",
    role: "Property Manager",
    location: {
      city: "Chicago",
      state: "IL"
    },
    avatar: "https://randomuser.me/api/portraits/men/86.jpg",
    yearsExperience: 10,
    rating: 4.6,
    reviewCount: 143,
    specialties: ["Residential Properties", "Tenant Screening", "Maintenance Coordination"],
    bio: "I provide comprehensive property management services for investors and property owners throughout Chicago. My team handles everything from tenant screening and rent collection to maintenance coordination and financial reporting."
  },
  {
    id: 19,
    name: "Priscilla Nguyen",
    role: "Interior Designer",
    location: {
      city: "Houston",
      state: "TX"
    },
    avatar: "https://randomuser.me/api/portraits/women/62.jpg",
    yearsExperience: 13,
    rating: 4.8,
    reviewCount: 176,
    specialties: ["Residential Design", "Staging for Sale", "Space Optimization"],
    bio: "With an eye for detail and a passion for creating beautiful, functional spaces, I help homeowners and sellers transform their properties. Whether preparing a home for sale or designing your dream space, I create environments that inspire."
  },
  {
    id: 20,
    name: "Cornerstone Home Inspection",
    role: "Inspection Company",
    location: {
      city: "Minneapolis",
      state: "MN"
    },
    avatar: "https://logo.clearbit.com/cornerstoneinspection.com",
    yearsExperience: 22,
    rating: 4.9,
    reviewCount: 304,
    specialties: ["Buyer Inspections", "Seller Pre-Listing Inspections", "New Construction"],
    bio: "Cornerstone Home Inspection has been providing Twin Cities residents with thorough, reliable property inspections for over two decades. Our team of certified inspectors delivers detailed reports with clear recommendations so you can make informed decisions."
  },
  {
    id: 21,
    name: "Robert Patel",
    role: "Mortgage Broker",
    location: {
      city: "Philadelphia",
      state: "PA"
    },
    avatar: "https://randomuser.me/api/portraits/men/63.jpg",
    yearsExperience: 17,
    rating: 4.8,
    reviewCount: 211,
    specialties: ["FHA Loans", "VA Loans", "Refinancing"],
    bio: "As a mortgage broker with access to multiple lenders, I help my clients secure the most favorable loan terms possible. My knowledge of various loan programs allows me to match each client with the perfect financing option for their situation."
  },
  {
    id: 22,
    name: "Sunshine Title & Escrow",
    role: "Title Company",
    location: {
      city: "Orlando",
      state: "FL"
    },
    avatar: "https://logo.clearbit.com/sunshinetitle.com",
    yearsExperience: 25,
    rating: 4.7,
    reviewCount: 189,
    specialties: ["Title Insurance", "Closing Services", "Document Preparation"],
    bio: "Sunshine Title & Escrow provides comprehensive title services throughout Central Florida. Our experienced team ensures smooth, secure closings by addressing potential title issues before they become problems for your transaction."
  },
  {
    id: 23,
    name: "Patricia Scott",
    role: "Luxury Property Specialist",
    location: {
      city: "Scottsdale",
      state: "AZ"
    },
    avatar: "https://randomuser.me/api/portraits/women/24.jpg",
    yearsExperience: 19,
    rating: 4.9,
    reviewCount: 135,
    specialties: ["Luxury Estates", "Golf Properties", "Desert Retreats"],
    bio: "Specializing in Scottsdale's most prestigious neighborhoods, I provide white-glove service to clients seeking exceptional properties. My exclusive network and marketing expertise ensure that your luxury property receives the attention it deserves."
  },
  {
    id: 24,
    name: "Daniel Taylor",
    role: "Commercial Leasing Agent",
    location: {
      city: "Seattle",
      state: "WA"
    },
    avatar: "https://randomuser.me/api/portraits/men/82.jpg",
    yearsExperience: 14,
    rating: 4.7,
    reviewCount: 104,
    specialties: ["Office Space", "Retail Leasing", "Industrial Properties"],
    bio: "I help businesses find the perfect commercial space to support their growth and operations. With extensive knowledge of Seattle's commercial real estate market, I negotiate favorable lease terms that protect my clients' interests and support their business goals."
  },
  {
    id: 25,
    name: "Alexandra Wilson",
    role: "Home Stager",
    location: {
      city: "Nashville",
      state: "TN"
    },
    avatar: "https://randomuser.me/api/portraits/women/16.jpg",
    yearsExperience: 8,
    rating: 4.8,
    reviewCount: 167,
    specialties: ["Vacant Home Staging", "Occupied Home Staging", "Virtual Staging"],
    bio: "I transform properties to highlight their full potential and appeal to the broadest range of buyers. My staging designs create emotional connections that help homes sell faster and for higher prices in Nashville's competitive market."
  }
];