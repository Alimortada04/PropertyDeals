export interface Rep {
  id: number;
  name: string;
  slug: string;
  type: 'seller' | 'contractor' | 'agent' | 'lender' | 'appraiser' | 'inspector' | 'mover' | 'landscaper';
  entityType?: 'person' | 'business';
  location: {
    city: string;
    state: string;
  };
  tagline: string;
  avatar: string;
  bannerUrl?: string;
  contact: {
    phone: string;
    email: string;
  };
  phone?: string;
  email?: string;
  bio: string;
  // Professional metrics
  yearsExperience?: number;
  dealsCompleted?: number;
  specialties?: string[];
  expertise?: string[];
  propertyTypes?: string[];
  locationsServed?: string[];
  credentials?: string[];
  rating?: {
    score: number;
    reviewCount: number;
  };
  isVerified?: boolean;
  lastActive?: string; // ISO date string
  responseTime?: string; // e.g., "within 2 hours"
  memberSince?: string; // ISO date string
  social?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
  availability?: 'available' | 'limited' | 'unavailable';
  availabilitySchedule?: {
    day: string;
    hours: string;
  }[];
  // Additional fields depending on REP type
  properties?: {
    current?: number[];
    past?: number[];
  };
  projects?: {
    active?: {
      title: string;
      location: string;
      completion: string;
    }[];
    past?: {
      title: string;
      location: string;
      completed: string;
    }[];
  };
  clients?: {
    total: number;
    testimonials: {
      name: string;
      comment: string;
    }[];
  };
  additionalInfo?: string;
  businessName?: string;
  businessAddress?: string;
  // Business-specific fields
  foundedYear?: number;
  employees?: number;
  services?: string[];
  businessLicense?: string;
  website?: string;
  logoUrl?: string;
  isFeatured?: boolean;
}

export const reps: Rep[] = [
  {
    id: 1,
    name: "Alex Morgan",
    slug: "alex-morgan",
    type: "seller",
    entityType: "person",
    location: {
      city: "Milwaukee",
      state: "WI"
    },
    tagline: "Helping families find their dream homes for over 10 years",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    contact: {
      phone: "(414) 555-1234",
      email: "alex.morgan@propertydeals.com"
    },
    bio: "With over a decade of experience in the Milwaukee real estate market, I specialize in luxury and family homes. My approach focuses on understanding my clients' needs and finding properties that exceed their expectations. I believe in building relationships, not just closing deals.",
    properties: {
      current: [1, 3, 5],
      past: [2, 4, 6]
    },
    isVerified: true,
    yearsExperience: 10,
    dealsCompleted: 143,
    rating: {
      score: 4.8,
      reviewCount: 87
    },
    specialties: ["Luxury Homes", "Family Properties", "Waterfront"]
  },
  // BUSINESSES - Seller Agencies
  {
    id: 11,
    name: "Lakefront Properties LLC",
    slug: "lakefront-properties",
    type: "seller",
    entityType: "business",
    location: {
      city: "Milwaukee",
      state: "WI"
    },
    tagline: "Specializing in premier waterfront real estate since 2008",
    avatar: "https://logo.clearbit.com/meyerhomes.com",
    logoUrl: "https://logo.clearbit.com/meyerhomes.com",
    contact: {
      phone: "(414) 555-8200",
      email: "info@lakefrontproperties.com"
    },
    bio: "Lakefront Properties is Wisconsin's leading specialist in luxury waterfront homes and properties. With over 15 years in the market, we've developed unparalleled expertise in lakefront, riverside, and harbor properties throughout the state. Our team includes certified waterfront specialists who understand the unique aspects of waterfront living.",
    foundedYear: 2008,
    employees: 17,
    website: "https://lakefrontproperties.example.com",
    businessLicense: "WI-RE-67543",
    services: ["Luxury Waterfront Sales", "Private Island Listings", "Vacation Properties", "Investment Consulting"],
    properties: {
      current: [15, 22, 28, 35],
      past: [12, 18, 24, 30]
    },
    isVerified: true,
    isFeatured: true
  },
  {
    id: 12,
    name: "Urban Core Realty",
    slug: "urban-core-realty",
    type: "seller",
    entityType: "business",
    location: {
      city: "Madison",
      state: "WI"
    },
    tagline: "Connecting urbanites with their perfect downtown space",
    avatar: "https://logo.clearbit.com/urbanhomes.com",
    logoUrl: "https://logo.clearbit.com/urbanhomes.com",
    contact: {
      phone: "(608) 555-9320",
      email: "contact@urbancorerealty.com"
    },
    bio: "Urban Core Realty focuses exclusively on downtown Madison properties, from historic lofts to modern high-rises. Our agents live and work in the neighborhoods they serve, providing authentic insights into urban living. We understand the unique considerations of city properties, from parking to amenities to neighborhood character.",
    foundedYear: 2012,
    employees: 12,
    website: "https://urbancorerealty.example.com",
    businessLicense: "WI-RE-54329",
    services: ["Downtown Condos", "Historic Properties", "Mixed-Use Developments", "Urban Rental Management"],
    properties: {
      current: [42, 44, 46, 48],
      past: [41, 43, 45, 47]
    }
  },
  // AGENTS
  {
    id: 2,
    name: "Sarah Chen",
    slug: "sarah-chen",
    type: "agent",
    entityType: "person",
    location: {
      city: "Madison",
      state: "WI"
    },
    tagline: "Your trusted guide through the home buying process",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    contact: {
      phone: "(608) 555-6789",
      email: "sarah.chen@propertydeals.com"
    },
    bio: "As a lifelong resident of Madison, I know every neighborhood inside and out. My background in finance helps me secure the best possible deals for my clients. Whether you're a first-time buyer or looking to upgrade, I'll be with you every step of the way.",
    clients: {
      total: 78,
      testimonials: [
        {
          name: "The Johnson Family",
          comment: "Sarah made our first home purchase so smooth and stress-free!"
        },
        {
          name: "David Miller",
          comment: "Her knowledge of the local market saved us thousands."
        }
      ]
    },
    isVerified: true,
    yearsExperience: 9,
    dealsCompleted: 84,
    rating: {
      score: 4.9,
      reviewCount: 62
    },
    specialties: ["First-time Homebuyers", "Suburban Properties", "Negotiations"]
  },
  {
    id: 6,
    name: "Elena Rodriguez",
    slug: "elena-rodriguez",
    type: "agent",
    entityType: "person",
    location: {
      city: "Milwaukee",
      state: "WI"
    },
    tagline: "Turning houses into homes with personalized service",
    avatar: "https://randomuser.me/api/portraits/women/62.jpg",
    contact: {
      phone: "(414) 555-7890",
      email: "elena.rodriguez@propertydeals.com"
    },
    bio: "I believe that finding the right home is about connecting with a space on a personal level. My approach is to truly understand what my clients are looking for, beyond just the number of bedrooms and bathrooms. I've been helping families find their perfect match in Milwaukee for 8 years.",
    clients: {
      total: 94,
      testimonials: [
        {
          name: "The Smith Family",
          comment: "Elena knew exactly what we needed, even when we weren't sure ourselves."
        },
        {
          name: "Jennifer Brown",
          comment: "Working with Elena made house hunting fun instead of stressful."
        }
      ]
    },
    yearsExperience: 8,
    dealsCompleted: 110,
    rating: {
      score: 4.7,
      reviewCount: 53
    }
  },
  {
    id: 13,
    name: "David Park",
    slug: "david-park",
    type: "agent",
    entityType: "person",
    location: {
      city: "Green Bay",
      state: "WI"
    },
    tagline: "Helping you navigate Green Bay's competitive market",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    contact: {
      phone: "(920) 555-3344",
      email: "david.park@propertydeals.com"
    },
    bio: "With 11 years of experience as a real estate agent in Green Bay, I've developed strategies to help my clients succeed in both competitive and slow markets. I pride myself on constant communication, keeping clients informed throughout the entire process. My specialty is helping relocating families find their perfect neighborhood.",
    clients: {
      total: 117,
      testimonials: [
        {
          name: "The Williams Family",
          comment: "David's knowledge of local schools was invaluable in our search."
        },
        {
          name: "Rachel Kim",
          comment: "He found us the perfect home when we relocated from out of state."
        }
      ]
    },
    yearsExperience: 11,
    dealsCompleted: 156,
    rating: {
      score: 4.6,
      reviewCount: 78
    },
    specialties: ["Relocation Services", "Family Homes", "School Districts"]
  },
  // AGENT BUSINESSES
  {
    id: 9,
    name: "Summit Realty Group",
    slug: "summit-realty-group",
    type: "agent",
    entityType: "business",
    location: {
      city: "Milwaukee",
      state: "WI"
    },
    tagline: "Your trusted partner in Wisconsin real estate since 2010",
    avatar: "https://logo.clearbit.com/summitrealty.net",
    logoUrl: "https://logo.clearbit.com/summitrealty.net",
    contact: {
      phone: "(414) 555-9876",
      email: "info@summitrealty.com"
    },
    bio: "Summit Realty Group is a full-service real estate agency specializing in residential and commercial properties throughout Wisconsin. Our team of experienced agents combines local market knowledge with innovative marketing strategies to deliver exceptional results for our clients.",
    foundedYear: 2010,
    employees: 24,
    website: "https://summitrealty.example.com",
    businessLicense: "WI-RE-12345",
    services: ["Residential Sales", "Commercial Properties", "Property Management", "Investment Consulting"],
    clients: {
      total: 1250,
      testimonials: [
        {
          name: "Milwaukee Business Journal",
          comment: "Named one of the top 10 real estate firms in Wisconsin for customer satisfaction."
        },
        {
          name: "John & Mary Thompson",
          comment: "Summit Realty found us the perfect commercial location for our restaurant."
        }
      ]
    },
    isVerified: true,
    isFeatured: true
  },
  {
    id: 14,
    name: "Northwoods Property Advisors",
    slug: "northwoods-property-advisors",
    type: "agent",
    entityType: "business",
    location: {
      city: "Wausau",
      state: "WI"
    },
    tagline: "Northern Wisconsin's premier real estate team",
    avatar: "https://randomuser.me/api/portraits/lego/3.jpg",
    logoUrl: "https://randomuser.me/api/portraits/lego/3.jpg",
    contact: {
      phone: "(715) 555-8765",
      email: "info@northwoodsproperties.com"
    },
    bio: "Northwoods Property Advisors specializes in vacation homes, cabins, and recreational properties throughout northern Wisconsin. Our team has unparalleled knowledge of lakefront, hunting, and wilderness properties. We help city dwellers find their perfect weekend retreat or retirement haven in Wisconsin's beautiful northwoods.",
    foundedYear: 2011,
    employees: 15,
    website: "https://northwoodsproperties.example.com",
    businessLicense: "WI-RE-23456",
    services: ["Vacation Homes", "Hunting Land", "Lakefront Properties", "Investment Properties"],
    clients: {
      total: 870,
      testimonials: [
        {
          name: "Chicago Tribune",
          comment: "The go-to agency for Chicagoans seeking Wisconsin vacation properties."
        },
        {
          name: "Robert & Susan Allen",
          comment: "They found us the perfect cabin when other agencies couldn't deliver."
        }
      ]
    }
  },
  // CONTRACTORS
  {
    id: 3,
    name: "Marcus Johnson",
    slug: "marcus-johnson",
    type: "contractor",
    entityType: "person",
    location: {
      city: "Green Bay",
      state: "WI"
    },
    tagline: "Quality renovations that add value to your property",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    contact: {
      phone: "(920) 555-8765",
      email: "marcus.johnson@propertydeals.com"
    },
    bio: "With my team of skilled craftsmen, we transform houses into beautiful, functional homes. My 15 years in construction have taught me that attention to detail makes all the difference. We specialize in kitchen and bathroom remodels, additions, and whole-home renovations.",
    projects: {
      active: [
        {
          title: "Victorian Home Restoration",
          location: "Downtown Green Bay",
          completion: "August 2025"
        },
        {
          title: "Modern Kitchen Remodel",
          location: "Allouez",
          completion: "June 2025"
        }
      ],
      past: [
        {
          title: "Luxury Bathroom Renovation",
          location: "De Pere",
          completed: "January 2025"
        },
        {
          title: "Basement Conversion",
          location: "Ashwaubenon",
          completed: "November 2024"
        }
      ]
    },
    yearsExperience: 15,
    rating: {
      score: 4.8,
      reviewCount: 42
    },
    specialties: ["Historic Renovations", "Kitchen Remodels", "Bathroom Renovations"]
  },
  {
    id: 7,
    name: "Robert Chang",
    slug: "robert-chang",
    type: "contractor",
    entityType: "person",
    location: {
      city: "Madison",
      state: "WI"
    },
    tagline: "Sustainable renovations for the modern homeowner",
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    contact: {
      phone: "(608) 555-2345",
      email: "robert.chang@propertydeals.com"
    },
    bio: "My construction company specializes in eco-friendly home renovations that reduce energy costs while creating beautiful living spaces. From solar installations to full green home conversions, we help homeowners reduce their environmental footprint without sacrificing style or comfort.",
    projects: {
      active: [
        {
          title: "Net-Zero Energy Home Conversion",
          location: "Fitchburg",
          completion: "September 2025"
        },
        {
          title: "Solar Panel Installation",
          location: "Middleton",
          completion: "May 2025"
        }
      ],
      past: [
        {
          title: "Passive House Renovation",
          location: "Shorewood Hills",
          completed: "February 2025"
        },
        {
          title: "Energy-Efficient Kitchen Remodel",
          location: "Verona",
          completed: "December 2024"
        }
      ]
    },
    isVerified: true,
    yearsExperience: 12,
    rating: {
      score: 4.9,
      reviewCount: 37
    },
    specialties: ["Green Building", "Solar Installation", "Energy Efficiency"]
  },
  // CONTRACTOR BUSINESSES
  {
    id: 10,
    name: "Green Home Contractors",
    slug: "green-home-contractors",
    type: "contractor",
    entityType: "business",
    location: {
      city: "Madison",
      state: "WI"
    },
    tagline: "Sustainable building solutions for environmentally conscious homeowners",
    avatar: "https://randomuser.me/api/portraits/lego/2.jpg",
    logoUrl: "https://randomuser.me/api/portraits/lego/2.jpg",
    contact: {
      phone: "(608) 555-7777",
      email: "info@greenhomecontractors.com"
    },
    bio: "Green Home Contractors is a certified eco-friendly construction company specializing in sustainable building practices. From energy-efficient renovations to new green home construction, we help our clients reduce their environmental footprint while creating beautiful, functional living spaces.",
    foundedYear: 2015,
    employees: 35,
    website: "https://greenhomecontractors.example.com",
    businessLicense: "WI-GC-54321",
    services: ["Green Home Construction", "Solar Panel Installation", "Energy Audits", "Eco-Friendly Renovations"],
    projects: {
      active: [
        {
          title: "Net-Zero Community Development",
          location: "Verona",
          completion: "December 2025"
        },
        {
          title: "Solar Neighborhood Initiative",
          location: "Sun Prairie",
          completion: "August 2025"
        }
      ],
      past: [
        {
          title: "LEED Platinum Office Building",
          location: "Downtown Madison",
          completed: "March 2024"
        },
        {
          title: "Sustainable Apartment Complex",
          location: "Middleton",
          completed: "September 2023"
        }
      ]
    },
    isVerified: true,
    isFeatured: true
  },
  {
    id: 15,
    name: "Precision Home Builders",
    slug: "precision-home-builders",
    type: "contractor",
    entityType: "business",
    location: {
      city: "Milwaukee",
      state: "WI"
    },
    tagline: "Craftsmanship and innovation for luxury home construction",
    avatar: "https://randomuser.me/api/portraits/lego/8.jpg",
    logoUrl: "https://randomuser.me/api/portraits/lego/8.jpg",
    contact: {
      phone: "(414) 555-2929",
      email: "info@precisionbuilders.com"
    },
    bio: "Since 2005, Precision Home Builders has set the standard for luxury home construction in southeastern Wisconsin. Our award-winning team combines old-world craftsmanship with modern technology to create homes of exceptional quality and beauty. From custom new builds to historic renovations, we deliver excellence in every project.",
    foundedYear: 2005,
    employees: 45,
    website: "https://precisionbuilders.example.com",
    businessLicense: "WI-GC-12121",
    services: ["Custom Home Construction", "Historic Renovations", "Room Additions", "Outdoor Living Spaces"],
    projects: {
      active: [
        {
          title: "Lakefront Estate Construction",
          location: "Whitefish Bay",
          completion: "January 2026"
        },
        {
          title: "Historic Mansion Renovation",
          location: "Wauwatosa",
          completion: "July 2025"
        }
      ],
      past: [
        {
          title: "Modern Smart Home",
          location: "Shorewood",
          completed: "December 2024"
        },
        {
          title: "European-Inspired Villa",
          location: "Mequon",
          completed: "May 2024"
        }
      ]
    }
  },
  // LENDERS
  {
    id: 4,
    name: "Lisa Washington",
    slug: "lisa-washington",
    type: "lender",
    entityType: "person",
    location: {
      city: "Milwaukee",
      state: "WI"
    },
    tagline: "Competitive rates and personalized mortgage solutions",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    contact: {
      phone: "(414) 555-4321",
      email: "lisa.washington@propertydeals.com"
    },
    bio: "With 12 years in mortgage lending, I've helped hundreds of families secure financing for their dream homes. My specialty is finding creative solutions for challenging situations. I work with first-time buyers, investors, and those with complex financial backgrounds.",
    clients: {
      total: 212,
      testimonials: [
        {
          name: "The Garcia Family",
          comment: "Lisa found us a great rate when other lenders couldn't help."
        },
        {
          name: "Michael Thompson",
          comment: "The pre-approval process was quick and painless."
        }
      ]
    },
    yearsExperience: 12,
    rating: {
      score: 4.7,
      reviewCount: 156
    },
    specialties: ["First-time Homebuyer Loans", "Investment Property Financing", "Complex Credit Solutions"]
  },
  {
    id: 8,
    name: "Olivia Banks",
    slug: "olivia-banks",
    type: "lender",
    entityType: "person",
    location: {
      city: "Green Bay",
      state: "WI"
    },
    tagline: "Simplifying mortgages with technology and personal touch",
    avatar: "https://randomuser.me/api/portraits/women/18.jpg",
    contact: {
      phone: "(920) 555-6543",
      email: "olivia.banks@propertydeals.com"
    },
    bio: "I combine cutting-edge digital mortgage tools with old-fashioned personal service to make financing your home as smooth as possible. My approach focuses on education so you understand every step of the process. Whether you're a first-time buyer or experienced investor, I'm here to help.",
    clients: {
      total: 156,
      testimonials: [
        {
          name: "The Anderson Family",
          comment: "Olivia's online tools made the application process incredibly efficient."
        },
        {
          name: "Thomas Wilson",
          comment: "She explained complex financing terms in a way that was easy to understand."
        }
      ]
    },
    isVerified: true,
    yearsExperience: 9,
    rating: {
      score: 4.8,
      reviewCount: 103
    },
    specialties: ["Digital Mortgage Services", "VA Loans", "FHA Financing"]
  },
  // LENDER BUSINESSES
  {
    id: 16,
    name: "Badger State Mortgage",
    slug: "badger-state-mortgage",
    type: "lender",
    entityType: "business",
    location: {
      city: "Madison",
      state: "WI"
    },
    tagline: "Local mortgage solutions with national strength",
    avatar: "https://randomuser.me/api/portraits/lego/4.jpg",
    logoUrl: "https://randomuser.me/api/portraits/lego/4.jpg",
    contact: {
      phone: "(608) 555-3030",
      email: "info@badgermortgage.com"
    },
    bio: "Badger State Mortgage combines the personal service of a local lender with the resources and rates of a national financial institution. Our team of mortgage professionals offers a complete range of home loan products with some of the most competitive rates in Wisconsin. We've helped thousands of Wisconsin families achieve their homeownership dreams.",
    foundedYear: 2009,
    employees: 22,
    website: "https://badgermortgage.example.com",
    businessLicense: "NMLS-54321",
    services: ["Conventional Mortgages", "FHA Loans", "VA Loans", "Construction Loans", "USDA Rural Development Loans"],
    clients: {
      total: 3250,
      testimonials: [
        {
          name: "Madison Chamber of Commerce",
          comment: "Small Business Lender of the Year, 2024"
        },
        {
          name: "James & Emily Martinez",
          comment: "Badger State secured our construction loan when other lenders turned us away."
        }
      ]
    },
    isVerified: true
  },
  {
    id: 17,
    name: "Wisconsin Home Financing",
    slug: "wisconsin-home-financing",
    type: "lender",
    entityType: "business",
    location: {
      city: "Milwaukee",
      state: "WI"
    },
    tagline: "Creative mortgage solutions for every homebuyer",
    avatar: "https://randomuser.me/api/portraits/lego/7.jpg",
    logoUrl: "https://randomuser.me/api/portraits/lego/7.jpg",
    contact: {
      phone: "(414) 555-8989",
      email: "loans@wisfinancing.com"
    },
    bio: "Wisconsin Home Financing specializes in finding creative mortgage solutions for homebuyers with unique circumstances. Our team focuses on underserved markets, including self-employed professionals, real estate investors, and those rebuilding their credit. We believe everyone deserves a chance at homeownership, and we work tirelessly to make that happen.",
    foundedYear: 2014,
    employees: 18,
    website: "https://wisfinancing.example.com",
    businessLicense: "NMLS-98765",
    services: ["Self-employed Mortgages", "Investment Property Loans", "Credit Rebuilding Programs", "Down Payment Assistance"],
    clients: {
      total: 1875,
      testimonials: [
        {
          name: "Milwaukee Business Times",
          comment: "Rising Star in Alternative Mortgage Solutions, 2024"
        },
        {
          name: "Carlos Mendez",
          comment: "They found me a mortgage after being self-employed for just one year."
        }
      ]
    },
    isFeatured: true
  },
  // APPRAISERS
  {
    id: 18,
    name: "Jennifer Patel",
    slug: "jennifer-patel",
    type: "appraiser",
    entityType: "person",
    location: {
      city: "Milwaukee",
      state: "WI"
    },
    tagline: "Accurate, thorough property valuations you can trust",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    contact: {
      phone: "(414) 555-7171",
      email: "jennifer.patel@propertydeals.com"
    },
    bio: "With 14 years of experience as a certified residential appraiser, I provide honest, accurate property valuations across southeastern Wisconsin. My background in both real estate and finance gives me a comprehensive perspective on property values. I pride myself on thorough research and detailed reports that stand up to scrutiny.",
    isVerified: true,
    yearsExperience: 14,
    clients: {
      total: 1280,
      testimonials: [
        {
          name: "First Wisconsin Bank",
          comment: "Our go-to appraiser for complex residential properties."
        },
        {
          name: "Mark Johnson",
          comment: "Her accurate appraisal helped us price our home correctly for a quick sale."
        }
      ]
    },
    rating: {
      score: 4.9,
      reviewCount: 67
    },
    specialties: ["Residential Appraisals", "Historic Property Valuation", "Investment Property Analysis"]
  },
  {
    id: 19,
    name: "Precision Property Appraisals",
    slug: "precision-property-appraisals",
    type: "appraiser",
    entityType: "business",
    location: {
      city: "Madison",
      state: "WI"
    },
    tagline: "Setting the standard for property appraisal excellence",
    avatar: "https://randomuser.me/api/portraits/lego/0.jpg",
    logoUrl: "https://randomuser.me/api/portraits/lego/0.jpg",
    contact: {
      phone: "(608) 555-4242",
      email: "info@precisionappraisals.com"
    },
    bio: "Precision Property Appraisals is a team of certified appraisers serving all of south-central Wisconsin. We provide comprehensive valuation services for residential, commercial, and agricultural properties. Our appraisers undergo continuous education to stay current with market trends and valuation methodologies, ensuring accurate and defensible appraisals every time.",
    foundedYear: 2010,
    employees: 12,
    website: "https://precisionappraisals.example.com",
    businessLicense: "WI-APP-34567",
    services: ["Residential Appraisals", "Commercial Valuations", "Agricultural Property Assessment", "Expert Witness Services"],
    clients: {
      total: 5600,
      testimonials: [
        {
          name: "Capital City Credit Union",
          comment: "Their detailed reports and quick turnaround time are invaluable to our lending process."
        },
        {
          name: "Wisconsin Real Estate Investors Association",
          comment: "The most trusted name in commercial property valuation in the region."
        }
      ]
    },
    isVerified: true,
    isFeatured: true
  },
  // INSPECTORS
  {
    id: 20,
    name: "Michael Reynolds",
    slug: "michael-reynolds",
    type: "inspector",
    entityType: "person",
    location: {
      city: "Milwaukee",
      state: "WI"
    },
    tagline: "Thorough inspections that protect your investment",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
    contact: {
      phone: "(414) 555-2525",
      email: "michael.reynolds@propertydeals.com"
    },
    bio: "As a former contractor with 18 years of experience, I bring a builder's eye to every home inspection. I'm certified in general home inspection, radon testing, and mold assessment. My reports include detailed photos and clear explanations of any issues found, along with recommended solutions. I believe in educating buyers about their potential new home.",
    isVerified: true,
    yearsExperience: 18,
    clients: {
      total: 2150,
      testimonials: [
        {
          name: "The Peterson Family",
          comment: "Michael found issues our realtor missed that saved us thousands in potential repairs."
        },
        {
          name: "Sandra Wilson",
          comment: "His detailed report helped us negotiate a better price on our dream home."
        }
      ]
    },
    rating: {
      score: 4.9,
      reviewCount: 187
    },
    specialties: ["Residential Inspections", "Radon Testing", "Mold Assessment", "New Construction Verification"]
  },
  {
    id: 21,
    name: "Wisconsin Home Inspectors",
    slug: "wisconsin-home-inspectors",
    type: "inspector",
    entityType: "business",
    location: {
      city: "Green Bay",
      state: "WI"
    },
    tagline: "The most comprehensive home inspections in Wisconsin",
    avatar: "https://randomuser.me/api/portraits/lego/9.jpg",
    logoUrl: "https://randomuser.me/api/portraits/lego/9.jpg",
    contact: {
      phone: "(920) 555-1212",
      email: "schedule@wihomeinspectors.com"
    },
    bio: "Wisconsin Home Inspectors provides thorough, unbiased property inspections throughout northeastern Wisconsin. Our team of certified inspectors uses advanced technology like thermal imaging and drone roof inspections to identify issues that others miss. We're committed to giving buyers and sellers the information they need to make informed decisions.",
    foundedYear: 2008,
    employees: 8,
    website: "https://wihomeinspectors.example.com",
    businessLicense: "WI-HI-76543",
    services: ["Complete Home Inspections", "Commercial Building Inspections", "Radon Testing", "Thermal Imaging", "Drone Roof Inspections"],
    clients: {
      total: 9200,
      testimonials: [
        {
          name: "Green Bay Realtors Association",
          comment: "Their attention to detail and clear reporting are unmatched in the industry."
        },
        {
          name: "William & Emma Davis",
          comment: "The thermal imaging identified hidden water damage that would have cost thousands to repair."
        }
      ]
    },
    isVerified: true,
    isFeatured: true
  },
  // MOVERS
  {
    id: 22,
    name: "Amanda Torres",
    slug: "amanda-torres",
    type: "mover",
    entityType: "person",
    location: {
      city: "Milwaukee",
      state: "WI"
    },
    tagline: "Personalized moving coordination for stress-free relocation",
    avatar: "https://randomuser.me/api/portraits/women/56.jpg",
    contact: {
      phone: "(414) 555-6060",
      email: "amanda.torres@propertydeals.com"
    },
    bio: "As an independent moving coordinator, I work with top-rated moving companies to arrange seamless relocations tailored to your specific needs. I handle everything from obtaining quotes to scheduling, packing strategies, and move-day oversight. Whether you're moving locally or across the country, my personalized approach ensures a smooth transition to your new home.",
    yearsExperience: 7,
    clients: {
      total: 315,
      testimonials: [
        {
          name: "The Rodriguez Family",
          comment: "Amanda saved us so much time and stress during our interstate move."
        },
        {
          name: "Jason Miller",
          comment: "She negotiated better rates than I could have gotten on my own."
        }
      ]
    },
    rating: {
      score: 4.8,
      reviewCount: 73
    },
    specialties: ["Local Moves", "Long-distance Relocation", "Senior Moving Services", "Office Relocations"]
  },
  {
    id: 23,
    name: "Badger State Moving & Storage",
    slug: "badger-state-moving",
    type: "mover",
    entityType: "business",
    location: {
      city: "Madison",
      state: "WI"
    },
    tagline: "Wisconsin's premier moving service since 2001",
    avatar: "https://randomuser.me/api/portraits/lego/0.jpg",
    logoUrl: "https://randomuser.me/api/portraits/lego/0.jpg",
    contact: {
      phone: "(608) 555-7575",
      email: "scheduling@badgermoving.com"
    },
    bio: "Badger State Moving & Storage has been helping Wisconsin families and businesses relocate for over 20 years. Our full-service approach handles everything from packing and loading to transportation and unpacking. With our own fleet of modern trucks and professionally trained staff, we ensure that your possessions arrive safely at your new location.",
    foundedYear: 2001,
    employees: 35,
    website: "https://badgermoving.example.com",
    businessLicense: "USDOT-765432",
    services: ["Local Moving", "Long-distance Moving", "Packing Services", "Storage Solutions", "Commercial Relocation"],
    clients: {
      total: 12500,
      testimonials: [
        {
          name: "Madison Magazine",
          comment: "Voted Best Moving Company five years running."
        },
        {
          name: "Richard & Karen Jensen",
          comment: "Their team handled our antiques with incredible care during our cross-country move."
        }
      ]
    },
    isVerified: true,
    isFeatured: true
  },
  // LANDSCAPERS
  {
    id: 24,
    name: "Carlos Mendez",
    slug: "carlos-mendez",
    type: "landscaper",
    entityType: "person",
    location: {
      city: "Milwaukee",
      state: "WI"
    },
    tagline: "Creating beautiful outdoor spaces that enhance property value",
    avatar: "https://randomuser.me/api/portraits/men/74.jpg",
    contact: {
      phone: "(414) 555-8181",
      email: "carlos.mendez@propertydeals.com"
    },
    bio: "With a background in landscape architecture and horticulture, I create outdoor spaces that balance beauty, functionality, and sustainability. I specialize in designing landscapes that add significant value to properties while reducing maintenance and water requirements. From simple garden makeovers to complete outdoor transformations, I bring your vision to life.",
    isVerified: true,
    yearsExperience: 13,
    clients: {
      total: 245,
      testimonials: [
        {
          name: "The Wilson Family",
          comment: "Carlos's landscape design increased our home's value by at least $20,000."
        },
        {
          name: "Elizabeth Chen",
          comment: "He transformed our bland yard into a stunning outdoor entertainment space."
        }
      ]
    },
    rating: {
      score: 4.9,
      reviewCount: 58
    },
    specialties: ["Landscape Design", "Hardscaping", "Native Plantings", "Outdoor Living Spaces"]
  },
  {
    id: 25,
    name: "Green Horizons Landscaping",
    slug: "green-horizons-landscaping",
    type: "landscaper",
    entityType: "business",
    location: {
      city: "Madison",
      state: "WI"
    },
    tagline: "Transforming properties through exceptional landscape design",
    avatar: "https://randomuser.me/api/portraits/lego/2.jpg",
    logoUrl: "https://randomuser.me/api/portraits/lego/2.jpg",
    contact: {
      phone: "(608) 555-9449",
      email: "info@greenhorizons.com"
    },
    bio: "Green Horizons Landscaping is a full-service landscape design and installation company serving southern Wisconsin. Our team includes certified landscape architects, horticulturists, and skilled craftsmen who work together to create stunning outdoor environments. We focus on sustainable practices that create beautiful, low-maintenance landscapes that thrive in Wisconsin's climate.",
    foundedYear: 2007,
    employees: 22,
    website: "https://greenhorizons.example.com",
    businessLicense: "WI-LS-87654",
    services: ["Landscape Design", "Hardscaping", "Water Features", "Outdoor Lighting", "Maintenance Services"],
    projects: {
      active: [
        {
          title: "Lakefront Estate Landscaping",
          location: "Monona",
          completion: "June 2025"
        },
        {
          title: "Commercial Plaza Renovation",
          location: "Downtown Madison",
          completion: "August 2025"
        }
      ],
      past: [
        {
          title: "Japanese-Inspired Garden",
          location: "Middleton",
          completed: "September 2024"
        },
        {
          title: "Native Prairie Installation",
          location: "Fitchburg",
          completed: "May 2024"
        }
      ]
    },
    clients: {
      total: 1750,
      testimonials: [
        {
          name: "Wisconsin Gardener Magazine",
          comment: "Their sustainable designs set the standard for eco-friendly landscaping."
        },
        {
          name: "University of Wisconsin",
          comment: "Green Horizons transformed our campus courtyard into a stunning outdoor classroom."
        }
      ]
    },
    isVerified: true,
    isFeatured: true
  },
  // ADDITIONAL SELLER
  {
    id: 5,
    name: "James Wilson",
    slug: "james-wilson",
    type: "seller",
    entityType: "person",
    location: {
      city: "Kenosha",
      state: "WI"
    },
    tagline: "Specializing in waterfront and luxury properties",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    contact: {
      phone: "(262) 555-3456",
      email: "james.wilson@propertydeals.com"
    },
    bio: "As a certified luxury home specialist, I bring a unique approach to marketing high-end properties. My background in architecture gives me insight into the special features that make each property unique. I work with a limited number of clients to provide personalized service.",
    properties: {
      current: [7, 8],
      past: [9, 10, 11]
    },
    isVerified: true,
    yearsExperience: 16,
    dealsCompleted: 87,
    rating: {
      score: 4.7,
      reviewCount: 42
    },
    specialties: ["Luxury Homes", "Waterfront Properties", "Architectural Gems"]
  }
];

export function getRepsByType(type: Rep['type']) {
  return reps.filter(rep => rep.type === type);
}

export function getRepsByEntityType(entityType: 'person' | 'business' | 'all' = 'all') {
  if (entityType === 'all') {
    return reps;
  }
  return reps.filter(rep => rep.entityType === entityType);
}

export function getRepBySlug(slug: string) {
  return reps.find(rep => rep.slug === slug);
}

export function getAllRepSlugs() {
  return reps.map(rep => rep.slug);
}