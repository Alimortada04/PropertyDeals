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
  }
];