export interface Rep {
  id: number;
  name: string;
  slug: string;
  type: 'seller' | 'contractor' | 'agent' | 'lender';
  location: {
    city: string;
    state: string;
  };
  tagline: string;
  avatar: string;
  contact: {
    phone: string;
    email: string;
  };
  bio: string;
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
}

export const reps: Rep[] = [
  {
    id: 1,
    name: "Alex Morgan",
    slug: "alex-morgan",
    type: "seller",
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
    }
  },
  {
    id: 2,
    name: "Sarah Chen",
    slug: "sarah-chen",
    type: "agent",
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
    }
  },
  {
    id: 3,
    name: "Marcus Johnson",
    slug: "marcus-johnson",
    type: "contractor",
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
    }
  },
  {
    id: 4,
    name: "Lisa Washington",
    slug: "lisa-washington",
    type: "lender",
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
    }
  },
  {
    id: 5,
    name: "James Wilson",
    slug: "james-wilson",
    type: "seller",
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
    }
  },
  {
    id: 6,
    name: "Elena Rodriguez",
    slug: "elena-rodriguez",
    type: "agent",
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
    }
  },
  {
    id: 7,
    name: "Robert Chang",
    slug: "robert-chang",
    type: "contractor",
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
    }
  },
  {
    id: 8,
    name: "Olivia Banks",
    slug: "olivia-banks",
    type: "lender",
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
    }
  }
];

export function getRepsByType(type: Rep['type']) {
  return reps.filter(rep => rep.type === type);
}

export function getRepBySlug(slug: string) {
  return reps.find(rep => rep.slug === slug);
}

export function getAllRepSlugs() {
  return reps.map(rep => rep.slug);
}