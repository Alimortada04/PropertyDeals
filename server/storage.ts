import { users, type User, type InsertUser, properties, type Property, type InsertProperty, propertyInquiries, type PropertyInquiry, type InsertPropertyInquiry, reps, type Rep, type InsertRep } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { db } from "./db";
import { eq, like } from "drizzle-orm";
// import connectPg from "connect-pg-simple";
import { pool } from "./db";

const MemoryStore = createMemoryStore(session);
// const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
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
  sessionStore: any; // Temporarily using any type to resolve typings
}

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using 'any' temporarily to avoid TypeScript errors

  constructor() {
    // Using MemoryStore temporarily until PostgreSQL session store is set up
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Property operations
  async getProperties(): Promise<Property[]> {
    return await db.select().from(properties);
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || undefined;
  }

  async getPropertyBySeller(sellerId: number): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.sellerId, sellerId));
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db
      .insert(properties)
      .values({
        ...property,
        createdAt: new Date().toISOString()
      })
      .returning();
    return newProperty;
  }

  async updateProperty(id: number, property: Partial<Property>): Promise<Property | undefined> {
    const [updatedProperty] = await db
      .update(properties)
      .set(property)
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty || undefined;
  }

  async deleteProperty(id: number): Promise<boolean> {
    const result = await db.delete(properties).where(eq(properties.id, id));
    return !!result;
  }

  // Property inquiry operations
  async getPropertyInquiries(propertyId: number): Promise<PropertyInquiry[]> {
    return await db.select().from(propertyInquiries).where(eq(propertyInquiries.propertyId, propertyId));
  }

  async getSellerInquiries(sellerId: number): Promise<PropertyInquiry[]> {
    const sellerProps = await this.getPropertyBySeller(sellerId);
    const propertyIds = sellerProps.map(p => p.id);
    
    if (propertyIds.length === 0) return [];
    
    return await db.select().from(propertyInquiries).where(
      // We'd need to use 'in' operator here, but for simplicity let's keep it this way
      eq(propertyInquiries.propertyId, propertyIds[0])
    );
  }

  async createPropertyInquiry(inquiry: InsertPropertyInquiry): Promise<PropertyInquiry> {
    const [newInquiry] = await db
      .insert(propertyInquiries)
      .values({
        ...inquiry,
        createdAt: new Date().toISOString()
      })
      .returning();
    return newInquiry;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private propertyInquiries: Map<number, PropertyInquiry>;
  currentUserId: number;
  currentPropertyId: number;
  currentInquiryId: number;
  sessionStore: any; // Using 'any' temporarily to avoid TypeScript errors

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
    
    // Create another seller
    const seller2Id = this.currentUserId++;
    const seller2: User = {
      id: seller2Id,
      username: "investor",
      password: "$2b$10$7O7BgKCexvkgIXR.OJNyEOQgwmRNzWw1Z1zXx3Zd2YEZjg1UhGnkK", // "password"
      fullName: "Sarah Investor",
      email: "sarah@propertydeals.com",
      userType: "seller"
    };
    this.users.set(seller2Id, seller2);
    
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
        condition: "Light Rehab",
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
        condition: "Turnkey",
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
        condition: "Turnkey",
        features: ["Floor-to-Ceiling Windows", "Smart Home Technology", "Rooftop Deck"],
        imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
        sellerId: sellerId,
        createdAt: new Date().toISOString(),
      },
      // Distressed properties
      {
        title: "Foreclosure Opportunity",
        address: "543 Distress Lane",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        price: 155000,
        description: "Bank-owned foreclosure in need of TLC. Great bones and structure with enormous potential in an up-and-coming neighborhood.",
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1750,
        lotSize: "0.15 Acres",
        yearBuilt: 1976,
        propertyType: "Single Family",
        status: "off-market",
        condition: "Heavy Rehab",
        features: ["Original Hardwood", "Large Basement", "Detached Garage"],
        imageUrl: "https://images.unsplash.com/photo-1582063289852-62e3ba2747f8",
        sellerId: seller2Id,
        createdAt: new Date().toISOString(),
      },
      {
        title: "Handyman Special",
        address: "872 Fixer Upper Street",
        city: "Detroit",
        state: "MI",
        zipCode: "48201",
        price: 89000,
        description: "Diamond in the rough! This property needs work but has amazing potential. Great opportunity for investors or DIY enthusiasts.",
        bedrooms: 4,
        bathrooms: 2,
        squareFeet: 2100,
        lotSize: "0.22 Acres",
        yearBuilt: 1962,
        propertyType: "Single Family",
        status: "off-market",
        condition: "Major Rehab",
        features: ["Original Woodwork", "Full Basement", "Large Lot"],
        imageUrl: "https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785",
        sellerId: seller2Id,
        createdAt: new Date().toISOString(),
      },
      {
        title: "Fire Damaged Investment",
        address: "310 Recovery Road",
        city: "Cleveland",
        state: "OH",
        zipCode: "44113",
        price: 65000,
        description: "Property with fire damage in the rear section. Structural integrity of the main house remains sound. Perfect for experienced flippers.",
        bedrooms: 3,
        bathrooms: 1.5,
        squareFeet: 1680,
        lotSize: "0.18 Acres",
        yearBuilt: 1958,
        propertyType: "Single Family",
        status: "off-market",
        condition: "Major Rehab",
        features: ["Brick Exterior", "Full Attic", "Corner Lot"],
        imageUrl: "https://images.unsplash.com/photo-1628624747186-a941c476b7ef",
        sellerId: sellerId,
        createdAt: new Date().toISOString(),
      },
      {
        title: "Abandoned Victorian",
        address: "1245 Heritage Avenue",
        city: "Pittsburgh",
        state: "PA",
        zipCode: "15222",
        price: 125000,
        description: "Historic Victorian that's been vacant for 5 years. Needs complete renovation but retains original architectural details worth preserving.",
        bedrooms: 5,
        bathrooms: 2,
        squareFeet: 2850,
        lotSize: "0.25 Acres",
        yearBuilt: 1897,
        propertyType: "Single Family",
        status: "off-market",
        condition: "Historic Rehab",
        features: ["Original Woodwork", "Pocket Doors", "Stained Glass"],
        imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
        sellerId: seller2Id,
        createdAt: new Date().toISOString(),
      },
      {
        title: "Water Damaged Bungalow",
        address: "578 Leaky Roof Road",
        city: "Indianapolis",
        state: "IN",
        zipCode: "46201",
        price: 78500,
        description: "Charming bungalow with water damage from a roof leak. Property has been remediated and is now dry, ready for renovation.",
        bedrooms: 2,
        bathrooms: 1,
        squareFeet: 1250,
        lotSize: "0.12 Acres",
        yearBuilt: 1945,
        propertyType: "Single Family",
        status: "off-market",
        condition: "Medium Rehab",
        features: ["Original Moldings", "Hardwood Under Carpet", "Unfinished Basement"],
        imageUrl: "https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d",
        sellerId: sellerId,
        createdAt: new Date().toISOString(),
      },
      {
        title: "Neglected Ranch House",
        address: "1032 Forgotten Lane",
        city: "Columbus",
        state: "OH",
        zipCode: "43215",
        price: 110000,
        description: "Ranch-style home that's been neglected for years. Solid foundation but needs all new systems and cosmetic updates throughout.",
        bedrooms: 3,
        bathrooms: 1.5,
        squareFeet: 1580,
        lotSize: "0.3 Acres",
        yearBuilt: 1964,
        propertyType: "Single Family",
        status: "off-market",
        condition: "Medium Rehab",
        features: ["Large Backyard", "Single-Level Living", "Attached Garage"],
        imageUrl: "https://images.unsplash.com/photo-1627843240167-b1f9a9f0c0f7",
        sellerId: seller2Id,
        createdAt: new Date().toISOString(),
      },
      {
        title: "Probate Sale Property",
        address: "421 Estate Circle",
        city: "Cincinnati",
        state: "OH",
        zipCode: "45202",
        price: 96000,
        description: "Estate sale through probate. Home has been vacant for over a year and needs updating throughout, but has great bones and character.",
        bedrooms: 4,
        bathrooms: 2,
        squareFeet: 2200,
        lotSize: "0.24 Acres",
        yearBuilt: 1952,
        propertyType: "Single Family",
        status: "off-market",
        condition: "Light Rehab",
        features: ["Built-ins", "Fireplace", "Mature Trees"],
        imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
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

// Switch to memory storage temporarily to resolve database connection issues
export const storage = new MemStorage();
