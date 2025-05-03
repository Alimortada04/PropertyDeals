// This file contains sample property data for the dashboard development
// In a real app, this would come from the API

export interface Property {
  id: number;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  description: string;
  status: string;
  tier: string;
  propertyType: string;
  imageUrl: string;
  stage: string;
  priority?: string;
  dateAdded?: string;
}

const propertiesData: Property[] = [
  {
    id: 1,
    title: "Modern Farmhouse",
    address: "123 Main Street",
    city: "Milwaukee",
    state: "WI",
    zipCode: "53202",
    price: 425000,
    bedrooms: 4,
    bathrooms: 2.5,
    squareFeet: 2400,
    description: "Beautiful modern farmhouse in a prime location, perfect for families.",
    status: "active",
    tier: "exclusive",
    propertyType: "Single Family",
    imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    stage: "favorited",
    priority: "high",
    dateAdded: "2025-04-25",
  },
  {
    id: 2,
    title: "Downtown Loft",
    address: "456 Oak Avenue",
    city: "Milwaukee",
    state: "WI",
    zipCode: "53203",
    price: 339900,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1800,
    description: "Stunning loft in the heart of downtown with industrial features and modern amenities.",
    status: "active",
    tier: "general",
    propertyType: "Condo",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    stage: "contacted",
    priority: "medium",
    dateAdded: "2025-04-27",
  },
  {
    id: 3,
    title: "Riverfront Townhouse",
    address: "789 River Drive",
    city: "Madison",
    state: "WI",
    zipCode: "53703",
    price: 625000,
    bedrooms: 3,
    bathrooms: 3.5,
    squareFeet: 2100,
    description: "Luxurious townhouse with stunning river views and private balcony.",
    status: "pending",
    tier: "general",
    propertyType: "Townhouse",
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    stage: "offer_made",
    priority: "high",
    dateAdded: "2025-04-20",
  },
  {
    id: 4,
    title: "Vintage Bungalow",
    address: "321 Elm Street",
    city: "Green Bay",
    state: "WI",
    zipCode: "54301",
    price: 289000,
    bedrooms: 3,
    bathrooms: 1.5,
    squareFeet: 1500,
    description: "Charming vintage bungalow with original woodwork and modern updates.",
    status: "active",
    tier: "exclusive",
    propertyType: "Single Family",
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    stage: "favorited",
    priority: "medium",
    dateAdded: "2025-04-28",
  },
  {
    id: 5,
    title: "Lakefront Cabin",
    address: "555 Lakeview Road",
    city: "Green Bay",
    state: "WI",
    zipCode: "54311",
    price: 459000,
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 1200,
    description: "Cozy lakefront cabin with private dock and breathtaking views.",
    status: "active",
    tier: "general",
    propertyType: "Cabin",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    stage: "contacted",
    priority: "low",
    dateAdded: "2025-04-30",
  },
  {
    id: 6,
    title: "Luxury Condo",
    address: "888 Bayshore Blvd",
    city: "Milwaukee",
    state: "WI",
    zipCode: "53202",
    price: 725000,
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 2200,
    description: "Upscale condo with panoramic lake views and high-end finishes.",
    status: "sold",
    tier: "exclusive",
    propertyType: "Condo",
    imageUrl: "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    stage: "closed",
    priority: "medium",
    dateAdded: "2025-04-10",
  },
  {
    id: 7,
    title: "Investment Duplex",
    address: "444 Investment Ave",
    city: "Madison",
    state: "WI",
    zipCode: "53704",
    price: 315000,
    bedrooms: 4,
    bathrooms: 2,
    squareFeet: 2600,
    description: "Great opportunity for investors with positive cash flow.",
    status: "active",
    tier: "general",
    propertyType: "Duplex",
    imageUrl: "https://images.unsplash.com/photo-1592595896616-c37162298647?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    stage: "close_pending",
    priority: "high",
    dateAdded: "2025-04-15",
  },
  {
    id: 8,
    title: "Colonial Revival",
    address: "123 Heritage Lane",
    city: "Green Bay",
    state: "WI",
    zipCode: "54302",
    price: 389000,
    bedrooms: 4,
    bathrooms: 2.5,
    squareFeet: 2800,
    description: "Stately colonial revival with mature trees and updated kitchen.",
    status: "active",
    tier: "general",
    propertyType: "Single Family",
    imageUrl: "https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    stage: "favorited",
    priority: "low",
    dateAdded: "2025-05-01",
  },
  {
    id: 9,
    title: "Fixer Upper Ranch",
    address: "505 Valley Road",
    city: "Madison",
    state: "WI",
    zipCode: "53705",
    price: 199000,
    bedrooms: 3,
    bathrooms: 1,
    squareFeet: 1350,
    description: "Ranch-style home needing renovation but in a great location.",
    status: "active",
    tier: "general",
    propertyType: "Single Family",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    stage: "dropped",
    priority: "low",
    dateAdded: "2025-04-05",
  },
];

export const properties = propertiesData;

export const recentlyViewed = [
  properties[0],
  properties[3],
  properties[5]
];

export const savedProperties = [
  properties[0],
  properties[1],
  properties[3],
  properties[7]
];

export const offersSubmitted = [
  properties[2],
  properties[6]
];

export const propertiesByStage = {
  favorited: properties.filter(p => p.stage === 'favorited'),
  contacted: properties.filter(p => p.stage === 'contacted'),
  offer_made: properties.filter(p => p.stage === 'offer_made'),
  pending: properties.filter(p => p.stage === 'pending'),
  close_pending: properties.filter(p => p.stage === 'close_pending'),
  closed: properties.filter(p => p.stage === 'closed'),
  dropped: properties.filter(p => p.stage === 'dropped')
};

export interface Task {
  id: number;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  date: string;
}

export const propertyTasks: Record<number, Task[]> = {
  1: [
    { id: 1, title: "Schedule viewing", status: "completed", date: "2025-04-29" },
    { id: 2, title: "Get pre-approval letter", status: "in_progress", date: "2025-05-02" },
    { id: 3, title: "Prepare offer", status: "pending", date: "2025-05-05" }
  ],
  2: [
    { id: 1, title: "Schedule viewing", status: "completed", date: "2025-04-26" },
    { id: 2, title: "Get pre-approval letter", status: "completed", date: "2025-04-30" },
    { id: 3, title: "Contact seller's agent", status: "in_progress", date: "2025-05-03" }
  ],
  3: [
    { id: 1, title: "Schedule viewing", status: "completed", date: "2025-04-20" },
    { id: 2, title: "Get pre-approval letter", status: "completed", date: "2025-04-25" },
    { id: 3, title: "Submit offer", status: "completed", date: "2025-05-01" },
    { id: 4, title: "Home inspection", status: "in_progress", date: "2025-05-10" }
  ]
};

export interface ProjectTask {
  id: number;
  title: string;
  completed: boolean;
  status?: string; // 'Not Started', 'In Progress', 'Completed'
  dueDate?: string;
  assignedTo?: string;
}

export interface ProjectUpdate {
  id: number;
  date: string;
  author: string;
  text: string;
  image?: string;
}

export interface Project {
  id: number;
  propertyId: number;
  name: string;
  address: string;
  status: string; // 'active', 'paused', 'completed'
  budget: {
    estimated: number;
    actual: number;
    remaining: number;
  };
  timeline: {
    startDate: string;
    endDate: string;
    currentProgress: number;
  };
  tasks: ProjectTask[];
  updates: ProjectUpdate[];
  team: number[];
}

export const projects: Project[] = [
  {
    id: 1,
    propertyId: 6,
    name: "Luxury Condo Renovation",
    address: "888 Bayshore Blvd",
    status: "active",
    budget: {
      estimated: 45000,
      actual: 42300,
      remaining: 2700
    },
    timeline: {
      startDate: "2025-04-15",
      endDate: "2025-06-15",
      currentProgress: 35
    },
    tasks: [
      { 
        id: 1, 
        title: "Demo existing kitchen", 
        completed: true, 
        status: "Completed", 
        dueDate: "2025-04-20", 
        assignedTo: "John Smith" 
      },
      { 
        id: 2, 
        title: "Install new cabinets", 
        completed: true, 
        status: "Completed", 
        dueDate: "2025-04-25", 
        assignedTo: "Maria Rodriguez" 
      },
      { 
        id: 3, 
        title: "Install countertops", 
        completed: false, 
        status: "In Progress", 
        dueDate: "2025-05-10", 
        assignedTo: "Maria Rodriguez" 
      },
      { 
        id: 4, 
        title: "Replace flooring", 
        completed: false, 
        status: "Not Started", 
        dueDate: "2025-05-20" 
      },
      { 
        id: 5, 
        title: "Paint interior walls", 
        completed: false, 
        status: "Not Started", 
        dueDate: "2025-05-30" 
      }
    ],
    updates: [
      { id: 1, date: "2025-04-20", author: "John Smith", text: "Kitchen demo completed ahead of schedule." },
      { id: 2, date: "2025-04-27", author: "Maria Rodriguez", text: "Cabinets installed, waiting on countertop delivery." }
    ],
    team: [1, 3, 5] // User IDs
  },
  {
    id: 2,
    propertyId: 7,
    name: "Duplex Conversion",
    address: "444 Investment Ave",
    status: "active",
    budget: {
      estimated: 85000,
      actual: 51200,
      remaining: 33800
    },
    timeline: {
      startDate: "2025-04-10",
      endDate: "2025-07-15",
      currentProgress: 40
    },
    tasks: [
      { 
        id: 1, 
        title: "Create architectural plans", 
        completed: true, 
        status: "Completed", 
        dueDate: "2025-04-15", 
        assignedTo: "Emily Johnson" 
      },
      { 
        id: 2, 
        title: "Obtain building permits", 
        completed: true, 
        status: "Completed", 
        dueDate: "2025-04-20", 
        assignedTo: "David Wilson" 
      },
      { 
        id: 3, 
        title: "Framing for new unit division", 
        completed: true, 
        status: "Completed", 
        dueDate: "2025-04-30", 
        assignedTo: "Thomas Brown" 
      },
      { 
        id: 4, 
        title: "Electrical work", 
        completed: false, 
        status: "In Progress", 
        dueDate: "2025-05-15", 
        assignedTo: "Sarah Carter" 
      },
      { 
        id: 5, 
        title: "Plumbing installation", 
        completed: false, 
        status: "Not Started", 
        dueDate: "2025-05-30"
      },
      { 
        id: 6, 
        title: "Drywall and finishing", 
        completed: false, 
        status: "Not Started", 
        dueDate: "2025-06-15"
      }
    ],
    updates: [
      { id: 1, date: "2025-04-12", author: "Emily Johnson", text: "Permits approved after minor revisions." },
      { id: 2, date: "2025-04-25", author: "David Wilson", text: "Framing completed for unit separation." },
      { id: 3, date: "2025-05-01", author: "Emily Johnson", text: "Electrical inspection scheduled for next week." }
    ],
    team: [2, 4, 6] // User IDs
  },
  {
    id: 3,
    propertyId: 8,
    name: "Backyard Remodel",
    address: "123 Sunset Drive",
    status: "paused",
    budget: {
      estimated: 25000,
      actual: 12500,
      remaining: 12500
    },
    timeline: {
      startDate: "2025-03-20",
      endDate: "2025-05-20",
      currentProgress: 25
    },
    tasks: [
      { 
        id: 1, 
        title: "Design landscape plan", 
        completed: true, 
        status: "Completed", 
        dueDate: "2025-03-25", 
        assignedTo: "Laura Chen" 
      },
      { 
        id: 2, 
        title: "Demolish existing structures", 
        completed: true, 
        status: "Completed", 
        dueDate: "2025-04-05", 
        assignedTo: "Robert Garcia" 
      },
      { 
        id: 3, 
        title: "Install irrigation system", 
        completed: false, 
        status: "In Progress", 
        dueDate: "2025-04-20", 
        assignedTo: "Robert Garcia" 
      },
      { 
        id: 4, 
        title: "Build deck/patio", 
        completed: false, 
        status: "Not Started", 
        dueDate: "2025-05-05"
      },
      { 
        id: 5, 
        title: "Plant trees and garden", 
        completed: false, 
        status: "Not Started", 
        dueDate: "2025-05-15" 
      }
    ],
    updates: [
      { id: 1, date: "2025-03-22", author: "Laura Chen", text: "Landscape design finalized and approved by client." },
      { id: 2, date: "2025-04-10", author: "Robert Garcia", text: "Demolition completed, but irrigation installation delayed due to rain." },
      { id: 3, date: "2025-04-18", author: "Laura Chen", text: "Project temporarily paused due to unexpected soil issues." }
    ],
    team: [3, 5, 7]
  },
  {
    id: 4,
    propertyId: 9,
    name: "Victorian Home Restoration",
    address: "555 Heritage Lane",
    status: "completed",
    budget: {
      estimated: 120000,
      actual: 127500,
      remaining: -7500
    },
    timeline: {
      startDate: "2025-01-10",
      endDate: "2025-04-15",
      currentProgress: 100
    },
    tasks: [
      { 
        id: 1, 
        title: "Structural assessment", 
        completed: true, 
        status: "Completed", 
        dueDate: "2025-01-15", 
        assignedTo: "James Wilson" 
      },
      { 
        id: 2, 
        title: "Replace damaged woodwork", 
        completed: true, 
        status: "Completed", 
        dueDate: "2025-02-10", 
        assignedTo: "Catherine Moore" 
      },
      { 
        id: 3, 
        title: "Restore original stained glass", 
        completed: true, 
        status: "Completed", 
        dueDate: "2025-03-01", 
        assignedTo: "Michael Peters" 
      },
      { 
        id: 4, 
        title: "Update plumbing and electrical", 
        completed: true, 
        status: "Completed", 
        dueDate: "2025-03-25", 
        assignedTo: "James Wilson" 
      },
      { 
        id: 5, 
        title: "Final restorative painting", 
        completed: true, 
        status: "Completed", 
        dueDate: "2025-04-10", 
        assignedTo: "Catherine Moore" 
      }
    ],
    updates: [
      { id: 1, date: "2025-01-20", author: "James Wilson", text: "Hidden water damage discovered during assessment, may impact budget." },
      { id: 2, date: "2025-02-15", author: "Catherine Moore", text: "Woodwork restoration taking longer than expected due to intricate details." },
      { id: 3, date: "2025-03-10", author: "Michael Peters", text: "Stained glass restoration completed with period-accurate materials." },
      { id: 4, date: "2025-04-12", author: "James Wilson", text: "Project completed. Final walkthrough scheduled with client." }
    ],
    team: [1, 4, 8, 9]
  }
];
