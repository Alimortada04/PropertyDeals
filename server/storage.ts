import { users, type User, type InsertUser, properties, type Property, type InsertProperty, propertyInquiries, type PropertyInquiry, type InsertPropertyInquiry } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Property operations
  getProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  getPropertyBySeller(sellerId: number): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<Property>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Property inquiry operations
  getPropertyInquiries(propertyId: number): Promise<PropertyInquiry[]>;
  getSellerInquiries(sellerId: number): Promise<PropertyInquiry[]>;
  createPropertyInquiry(inquiry: InsertPropertyInquiry): Promise<PropertyInquiry>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private propertyInquiries: Map<number, PropertyInquiry>;
  currentUserId: number;
  currentPropertyId: number;
  currentInquiryId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.propertyInquiries = new Map();
    this.currentUserId = 1;
    this.currentPropertyId = 1;
    this.currentInquiryId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Create initial sample properties
    this.initSampleData();
  }

  private initSampleData() {
    // Create a seller user
    const sellerId = this.currentUserId++;
    const seller: User = {
      id: sellerId,
      username: "seller",
      password: "$2b$10$7O7BgKCexvkgIXR.OJNyEOQgwmRNzWw1Z1zXx3Zd2YEZjg1UhGnkK", // "password"
      fullName: "John Seller",
      email: "seller@propertydeals.com",
      userType: "seller"
    };
    this.users.set(sellerId, seller);
    
    // Sample properties data
    const sampleProperties: Omit<Property, 'id'>[] = [
      {
        title: "Modern Farmhouse",
        address: "123 Maple Street",
        city: "Milwaukee",
        state: "WI",
        zipCode: "53202",
        price: 459000,
        description: "Beautiful modern farmhouse with spacious rooms and updated kitchen.",
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2450,
        lotSize: "0.28 Acres",
        yearBuilt: 2018,
        propertyType: "Single Family",
        status: "off-market",
        features: ["Hardwood Floors", "Stainless Steel Appliances", "Quartz Countertops"],
        imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
        sellerId: sellerId,
        createdAt: new Date().toISOString(),
      },
      {
        title: "Colonial Revival",
        address: "456 Oak Avenue",
        city: "Milwaukee",
        state: "WI",
        zipCode: "53202",
        price: 625000,
        description: "Elegant colonial revival with classic architecture and modern amenities.",
        bedrooms: 5,
        bathrooms: 3.5,
        squareFeet: 3200,
        lotSize: "0.35 Acres",
        yearBuilt: 2015,
        propertyType: "Single Family",
        status: "exclusive",
        features: ["Gourmet Kitchen", "Walk-in Closets", "Crown Molding"],
        imageUrl: "https://images.unsplash.com/photo-1592595896616-c37162298647",
        sellerId: sellerId,
        createdAt: new Date().toISOString(),
      },
      {
        title: "Modern Condo",
        address: "789 Pine Court",
        city: "Milwaukee",
        state: "WI",
        zipCode: "53202",
        price: 339900,
        description: "Contemporary condo with urban flair and stunning city views.",
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1850,
        lotSize: "N/A",
        yearBuilt: 2020,
        propertyType: "Condo",
        status: "off-market",
        features: ["Floor-to-Ceiling Windows", "Smart Home Technology", "Rooftop Deck"],
        imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
        sellerId: sellerId,
        createdAt: new Date().toISOString(),
      }
    ];
    
    // Add properties to storage
    sampleProperties.forEach(property => {
      const id = this.currentPropertyId++;
      this.properties.set(id, { ...property, id });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Property operations
  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getPropertyBySeller(sellerId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.sellerId === sellerId,
    );
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const id = this.currentPropertyId++;
    const newProperty: Property = { 
      ...property, 
      id,
      createdAt: new Date().toISOString()
    };
    this.properties.set(id, newProperty);
    return newProperty;
  }

  async updateProperty(id: number, property: Partial<Property>): Promise<Property | undefined> {
    const existingProperty = this.properties.get(id);
    if (!existingProperty) return undefined;

    const updatedProperty = { ...existingProperty, ...property };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }

  // Property inquiry operations
  async getPropertyInquiries(propertyId: number): Promise<PropertyInquiry[]> {
    return Array.from(this.propertyInquiries.values()).filter(
      (inquiry) => inquiry.propertyId === propertyId,
    );
  }

  async getSellerInquiries(sellerId: number): Promise<PropertyInquiry[]> {
    const sellerProperties = await this.getPropertyBySeller(sellerId);
    const propertyIds = sellerProperties.map(property => property.id);
    
    return Array.from(this.propertyInquiries.values()).filter(
      (inquiry) => propertyIds.includes(inquiry.propertyId),
    );
  }

  async createPropertyInquiry(inquiry: InsertPropertyInquiry): Promise<PropertyInquiry> {
    const id = this.currentInquiryId++;
    const newInquiry: PropertyInquiry = { 
      ...inquiry, 
      id,
      createdAt: new Date().toISOString()
    };
    this.propertyInquiries.set(id, newInquiry);
    return newInquiry;
  }
}

export const storage = new MemStorage();
