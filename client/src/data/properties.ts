// This file contains sample property data for the dashboard development
// In a real app, this would come from the API

export const properties = [
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
  }
];

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
  close_pending: properties.filter(p => p.stage === 'close_pending'),
  closed: properties.filter(p => p.stage === 'closed'),
  dropped: []
};

export const propertyTasks = {
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