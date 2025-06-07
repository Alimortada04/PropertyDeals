import { 
  users, type User, type InsertUser, 
  buyerProfiles, type BuyerProfile, type InsertBuyerProfile,
  properties, type Property, type InsertProperty, 
  propertyProfile, type PropertyProfile, type InsertPropertyProfile,
  propertyInquiries, type PropertyInquiry, type InsertPropertyInquiry, 
  reps, type Rep, type InsertRep,
  systemLogs, type SystemLog, type InsertSystemLog,
  userReports, type UserReport, type InsertUserReport
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { db } from "./db";
import { eq, like, desc, and, or, sql } from "drizzle-orm";
// import connectPg from "connect-pg-simple";
import { pool } from "./db";

const MemoryStore = createMemoryStore(session);
// const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Property operations
  getProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  getPropertyBySeller(sellerId: number): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<Property>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Property Profile operations (for draft/live listings)
  getPropertyProfiles(): Promise<PropertyProfile[]>;
  getPropertyProfile(id: number): Promise<PropertyProfile | undefined>;
  getPropertyProfileByUuid(uuid: string): Promise<PropertyProfile | undefined>;
  getPropertyProfilesBySeller(sellerId: string): Promise<PropertyProfile[]>;
  createPropertyProfile(propertyProfile: InsertPropertyProfile): Promise<PropertyProfile>;
  updatePropertyProfile(id: number, propertyProfile: Partial<PropertyProfile>): Promise<PropertyProfile | undefined>;
  deletePropertyProfile(id: number): Promise<boolean>;
  publishPropertyProfile(id: number): Promise<PropertyProfile | undefined>;
  
  // Buyer profile operations
  getBuyerProfile(userId: number): Promise<BuyerProfile | undefined>;
  getBuyerProfileByUuid(uuid: string): Promise<BuyerProfile | undefined>;
  createBuyerProfile(profile: InsertBuyerProfile): Promise<BuyerProfile>;
  createBuyerProfileByUuid(uuid: string, profile: any): Promise<BuyerProfile>;
  updateBuyerProfile(userId: number, profile: Partial<BuyerProfile>): Promise<BuyerProfile | undefined>;
  updateBuyerProfileByUuid(uuid: string, profile: any): Promise<BuyerProfile | undefined>;
  
  // Property inquiry operations
  getPropertyInquiries(propertyId: number): Promise<PropertyInquiry[]>;
  getSellerInquiries(sellerId: number): Promise<PropertyInquiry[]>;
  createPropertyInquiry(inquiry: InsertPropertyInquiry): Promise<PropertyInquiry>;
  
  // Admin operations
  getAllUsers(options?: {
    search?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<{ users: User[]; total: number }>;
  
  getPendingApprovals(): Promise<User[]>;
  approveUserRole(userId: number, role: string): Promise<User | undefined>;
  denyUserRole(userId: number, role: string, notes?: string): Promise<User | undefined>;
  
  // System logging
  createSystemLog(log: InsertSystemLog): Promise<SystemLog>;
  getSystemLogs(options?: {
    userId?: number;
    action?: string;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: SystemLog[]; total: number }>;
  
  // User reports
  createUserReport(report: InsertUserReport): Promise<UserReport>;
  getUserReports(options?: {
    status?: string;
    contentType?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ reports: UserReport[]; total: number }>;
  updateReportStatus(id: number, status: string, adminId: number, notes?: string): Promise<UserReport | undefined>;
  
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

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
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

  // Property Profile operations (for draft/live listings)
  async getPropertyProfiles(): Promise<PropertyProfile[]> {
    return await db.select().from(propertyProfile);
  }

  async getPropertyProfile(id: number): Promise<PropertyProfile | undefined> {
    const [profile] = await db.select().from(propertyProfile).where(eq(propertyProfile.id, id));
    return profile || undefined;
  }

  async getPropertyProfileByUuid(uuid: string): Promise<PropertyProfile | undefined> {
    // Try to parse as integer ID first (property profile uses integer IDs)
    const intId = parseInt(uuid);
    if (!isNaN(intId)) {
      const [profile] = await db.select().from(propertyProfile).where(eq(propertyProfile.id, intId));
      return profile || undefined;
    }
    
    // If it's not a valid integer, could be a future UUID-based system
    try {
      const [profile] = await db.select().from(propertyProfile).where(sql`${propertyProfile.id}::text = ${uuid}`);
      return profile || undefined;
    } catch (error) {
      console.error('Error querying property profile by UUID:', error);
      return undefined;
    }
  }

  async getPropertyProfilesBySeller(sellerId: string): Promise<PropertyProfile[]> {
    // Use raw SQL query due to schema mismatch issues
    const query = `SELECT * FROM property_profile WHERE seller_id = $1`;
    const result = await pool.query(query, [sellerId]);
    return result.rows as PropertyProfile[];
  }

  async createPropertyProfile(profile: InsertPropertyProfile): Promise<PropertyProfile> {
    const [newProfile] = await db
      .insert(propertyProfile)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updatePropertyProfile(id: number, profile: Partial<PropertyProfile>): Promise<PropertyProfile | undefined> {
    const [updatedProfile] = await db
      .update(propertyProfile)
      .set({
        ...profile,
        updatedAt: new Date()
      })
      .where(eq(propertyProfile.id, id))
      .returning();
    return updatedProfile || undefined;
  }

  async deletePropertyProfile(id: number): Promise<boolean> {
    const result = await db.delete(propertyProfile).where(eq(propertyProfile.id, id));
    return !!result;
  }

  async publishPropertyProfile(id: number): Promise<PropertyProfile | undefined> {
    const [publishedProfile] = await db
      .update(propertyProfile)
      .set({
        status: 'live',
        publishedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(propertyProfile.id, id))
      .returning();
    return publishedProfile || undefined;
  }

  // Buyer profile operations
  async getBuyerProfile(userId: number): Promise<BuyerProfile | undefined> {
    const [profile] = await db.select().from(buyerProfiles).where(eq(buyerProfiles.userId, userId));
    return profile || undefined;
  }

  async createBuyerProfile(profile: InsertBuyerProfile): Promise<BuyerProfile> {
    const [newProfile] = await db
      .insert(buyerProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateBuyerProfile(userId: number, profile: Partial<BuyerProfile>): Promise<BuyerProfile | undefined> {
    const [updatedProfile] = await db
      .update(buyerProfiles)
      .set({
        ...profile,
        updatedAt: new Date()
      })
      .where(eq(buyerProfiles.userId, userId))
      .returning();
    return updatedProfile || undefined;
  }

  // UUID-based buyer profile operations for Supabase integration
  async getBuyerProfileByUuid(uuid: string): Promise<BuyerProfile | undefined> {
    // Use the correct table name: buyer_profiles (plural)
    const results = await db.execute(sql`SELECT * FROM buyer_profiles WHERE user_id::text = ${uuid}`);
    return results.rows[0] as BuyerProfile || undefined;
  }

  async createBuyerProfileByUuid(uuid: string, profile: any): Promise<BuyerProfile> {
    // Insert with UUID directly as user_id - use correct table name: buyer_profiles (plural)
    const results = await db.execute(sql`
      INSERT INTO buyer_profiles (user_id, phone, bio, business_name, type_of_buyer, website, instagram, facebook, linkedin, created_at, updated_at)
      VALUES (${uuid}::integer, ${profile.phone}, ${profile.bio}, ${profile.business_name}, ${profile.type_of_buyer}, ${profile.website}, ${profile.instagram}, ${profile.facebook}, ${profile.linkedin}, NOW(), NOW())
      RETURNING *
    `);
    return results.rows[0] as BuyerProfile;
  }

  async updateBuyerProfileByUuid(uuid: string, profile: any): Promise<BuyerProfile | undefined> {
    // Update profile where user_id matches UUID - use correct table name: buyer_profiles (plural)
    const results = await db.execute(sql`
      UPDATE buyer_profiles 
      SET phone = ${profile.phone}, 
          bio = ${profile.bio}, 
          business_name = ${profile.business_name}, 
          type_of_buyer = ${profile.type_of_buyer}, 
          website = ${profile.website}, 
          instagram = ${profile.instagram}, 
          facebook = ${profile.facebook}, 
          linkedin = ${profile.linkedin}, 
          updated_at = NOW()
      WHERE user_id::text = ${uuid}
      RETURNING *
    `);
    return results.rows[0] as BuyerProfile || undefined;
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

  // Admin operations
  async getAllUsers(options?: {
    search?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<{ users: User[]; total: number }> {
    const { search, sortBy = 'id', sortDirection = 'asc', limit = 10, offset = 0 } = options || {};
    
    // Base query
    let query = db.select().from(users);
    
    // Apply search filter if provided
    if (search) {
      query = query.where(
        or(
          like(users.username, `%${search}%`),
          like(users.fullName, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      );
    }
    
    // Count total before pagination
    const [{ count }] = await db
      .select({ count: sql`count(*)`.mapWith(Number) })
      .from(users)
      .where(search ? 
        or(
          like(users.username, `%${search}%`),
          like(users.fullName, `%${search}%`),
          like(users.email, `%${search}%`)
        ) : 
        sql`1=1`
      );
    
    // Apply sorting
    const orderColumn = users[sortBy as keyof typeof users] || users.id;
    query = sortDirection === 'desc' 
      ? query.orderBy(desc(orderColumn)) 
      : query.orderBy(orderColumn);
    
    // Apply pagination
    query = query.limit(limit).offset(offset);
    
    // Execute query
    const resultUsers = await query;
    
    return {
      users: resultUsers,
      total: count
    };
  }
  
  async getPendingApprovals(): Promise<User[]> {
    // This query is a simplification as we'd need to query JSON fields properly
    // In a real implementation, we'd need a more complex query to check role status in the JSON
    // For now, we'll get all users and filter in JS
    const allUsers = await db.select().from(users);
    
    return allUsers.filter(user => {
      const roles = user.roles as any;
      return (
        (roles?.buyer?.status === 'pending') ||
        (roles?.seller?.status === 'pending') ||
        (roles?.rep?.status === 'pending')
      );
    });
  }
  
  async approveUserRole(userId: number, role: string): Promise<User | undefined> {
    // Get the user first
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    // Clone the roles object
    const roles = JSON.parse(JSON.stringify(user.roles));
    
    // Update the specified role
    if (roles[role]) {
      roles[role] = {
        ...roles[role],
        status: 'approved',
        approvedAt: new Date().toISOString()
      };
    }
    
    // Update the user with the new roles
    return this.updateUser(userId, { roles });
  }
  
  async denyUserRole(userId: number, role: string, notes?: string): Promise<User | undefined> {
    // Get the user first
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    // Clone the roles object
    const roles = JSON.parse(JSON.stringify(user.roles));
    
    // Update the specified role
    if (roles[role]) {
      roles[role] = {
        ...roles[role],
        status: 'denied',
        deniedAt: new Date().toISOString(),
        ...(notes ? { notes } : {})
      };
    }
    
    // Update the user with the new roles
    return this.updateUser(userId, { roles });
  }
  
  // System logging
  async createSystemLog(log: InsertSystemLog): Promise<SystemLog> {
    const [newLog] = await db
      .insert(systemLogs)
      .values({
        ...log,
        timestamp: new Date().toISOString()
      })
      .returning();
    return newLog;
  }
  
  async getSystemLogs(options?: {
    userId?: number;
    action?: string;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: SystemLog[]; total: number }> {
    const { userId, action, fromDate, toDate, limit = 20, offset = 0 } = options || {};
    
    // Build conditions array
    const conditions = [];
    if (userId) conditions.push(eq(systemLogs.userId, userId));
    if (action) conditions.push(eq(systemLogs.action, action));
    if (fromDate) conditions.push(sql`${systemLogs.timestamp} >= ${fromDate}`);
    if (toDate) conditions.push(sql`${systemLogs.timestamp} <= ${toDate}`);
    
    // Combine conditions with AND
    const whereClause = conditions.length > 0
      ? and(...conditions)
      : undefined;
    
    // Count total before pagination
    const countQuery = db
      .select({ count: sql`count(*)`.mapWith(Number) })
      .from(systemLogs);
    
    if (whereClause) {
      countQuery.where(whereClause);
    }
    
    const [{ count }] = await countQuery;
    
    // Base query for logs
    let query = db
      .select()
      .from(systemLogs)
      .orderBy(desc(systemLogs.timestamp))
      .limit(limit)
      .offset(offset);
    
    // Apply whereClause if exists
    if (whereClause) {
      query = query.where(whereClause);
    }
    
    const logs = await query;
    
    return {
      logs,
      total: count
    };
  }
  
  // User reports
  async createUserReport(report: InsertUserReport): Promise<UserReport> {
    const [newReport] = await db
      .insert(userReports)
      .values({
        ...report,
        timestamp: new Date().toISOString()
      })
      .returning();
    return newReport;
  }
  
  async getUserReports(options?: {
    status?: string;
    contentType?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ reports: UserReport[]; total: number }> {
    const { status, contentType, limit = 20, offset = 0 } = options || {};
    
    // Build conditions array
    const conditions = [];
    if (status) conditions.push(eq(userReports.status, status));
    if (contentType) conditions.push(eq(userReports.contentType, contentType));
    
    // Combine conditions with AND
    const whereClause = conditions.length > 0
      ? and(...conditions)
      : undefined;
    
    // Count total before pagination
    const countQuery = db
      .select({ count: sql`count(*)`.mapWith(Number) })
      .from(userReports);
    
    if (whereClause) {
      countQuery.where(whereClause);
    }
    
    const [{ count }] = await countQuery;
    
    // Base query for reports
    let query = db
      .select()
      .from(userReports)
      .orderBy(desc(userReports.timestamp))
      .limit(limit)
      .offset(offset);
    
    // Apply whereClause if exists
    if (whereClause) {
      query = query.where(whereClause);
    }
    
    const reports = await query;
    
    return {
      reports,
      total: count
    };
  }
  
  async updateReportStatus(id: number, status: string, adminId: number, notes?: string): Promise<UserReport | undefined> {
    const updateData: any = {
      status,
      resolvedBy: adminId,
      resolvedAt: new Date().toISOString()
    };
    
    if (notes) {
      updateData.adminNotes = notes;
    }
    
    const [updatedReport] = await db
      .update(userReports)
      .set(updateData)
      .where(eq(userReports.id, id))
      .returning();
    
    return updatedReport || undefined;
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
    this.propertyProfiles = new Map();
    this.currentUserId = 1;
    this.currentPropertyId = 1;
    this.currentInquiryId = 1;
    this.currentPropertyProfileId = 1;
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
      isAdmin: false,
      activeRole: "seller",
      roles: {
        buyer: { status: "approved", approvedAt: new Date().toISOString() },
        seller: { status: "approved", approvedAt: new Date().toISOString() },
        rep: { status: "not_applied" }
      }
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
      isAdmin: false,
      activeRole: "seller",
      roles: {
        buyer: { status: "approved", approvedAt: new Date().toISOString() },
        seller: { status: "approved", approvedAt: new Date().toISOString() },
        rep: { status: "pending", appliedAt: new Date().toISOString() }
      }
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
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
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

  // Property Profile operations (for MemStorage)
  private propertyProfiles: Map<number, PropertyProfile> = new Map();
  private currentPropertyProfileId = 1;

  async getPropertyProfiles(): Promise<PropertyProfile[]> {
    return Array.from(this.propertyProfiles.values());
  }

  async getPropertyProfile(id: number): Promise<PropertyProfile | undefined> {
    return this.propertyProfiles.get(id);
  }

  async getPropertyProfileByUuid(uuid: string): Promise<PropertyProfile | undefined> {
    // For MemStorage, try to parse as integer ID
    const intId = parseInt(uuid);
    if (!isNaN(intId)) {
      return this.propertyProfiles.get(intId);
    }
    // If it's not a valid integer, return undefined (no UUID support in memory storage)
    return undefined;
  }

  async getPropertyProfilesBySeller(sellerId: string): Promise<PropertyProfile[]> {
    return Array.from(this.propertyProfiles.values()).filter(profile => profile.seller_id === sellerId);
  }

  async createPropertyProfile(profile: InsertPropertyProfile): Promise<PropertyProfile> {
    const id = this.currentPropertyProfileId++;
    const newProfile: PropertyProfile = { 
      ...profile, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.propertyProfiles.set(id, newProfile);
    return newProfile;
  }

  async updatePropertyProfile(id: number, profile: Partial<PropertyProfile>): Promise<PropertyProfile | undefined> {
    const existing = this.propertyProfiles.get(id);
    if (!existing) return undefined;
    
    const updated: PropertyProfile = { 
      ...existing, 
      ...profile, 
      id, 
      updatedAt: new Date()
    };
    this.propertyProfiles.set(id, updated);
    return updated;
  }

  async deletePropertyProfile(id: number): Promise<boolean> {
    return this.propertyProfiles.delete(id);
  }

  async publishPropertyProfile(id: number): Promise<PropertyProfile | undefined> {
    const profile = this.propertyProfiles.get(id);
    if (!profile) return undefined;
    
    const published: PropertyProfile = { 
      ...profile, 
      status: 'live',
      isPublic: true,
      updatedAt: new Date().toISOString()
    };
    this.propertyProfiles.set(id, published);
    return published;
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
  
  // Admin operations
  private systemLogs: Map<number, SystemLog> = new Map();
  private userReports: Map<number, UserReport> = new Map();
  private currentLogId = 1;
  private currentReportId = 1;
  
  async getAllUsers(options?: {
    search?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<{ users: User[]; total: number }> {
    const { search, sortBy = 'id', sortDirection = 'asc', limit = 10, offset = 0 } = options || {};
    
    let filteredUsers = Array.from(this.users.values());
    
    // Apply search filter if provided
    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.username.toLowerCase().includes(lowerSearch) || 
        (user.fullName && user.fullName.toLowerCase().includes(lowerSearch)) || 
        (user.email && user.email.toLowerCase().includes(lowerSearch))
      );
    }
    
    // Sort users
    filteredUsers.sort((a, b) => {
      const aValue = a[sortBy as keyof User];
      const bValue = b[sortBy as keyof User];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      // Basic comparison that handles strings and numbers
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'desc' 
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }
      
      // For numbers
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'desc' 
          ? bValue - aValue
          : aValue - bValue;
      }
      
      return 0;
    });
    
    const total = filteredUsers.length;
    
    // Apply pagination
    const paginatedUsers = filteredUsers.slice(offset, offset + limit);
    
    return {
      users: paginatedUsers,
      total
    };
  }
  
  async getPendingApprovals(): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => {
      const roles = user.roles as any;
      return (
        (roles?.buyer?.status === 'pending') ||
        (roles?.seller?.status === 'pending') ||
        (roles?.rep?.status === 'pending')
      );
    });
  }
  
  async approveUserRole(userId: number, role: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    // Clone the roles object
    const roles = JSON.parse(JSON.stringify(user.roles));
    
    // Update the specified role
    if (roles[role]) {
      roles[role] = {
        ...roles[role],
        status: 'approved',
        approvedAt: new Date().toISOString()
      };
    }
    
    // Update the user with new roles
    const updatedUser = { ...user, roles };
    this.users.set(userId, updatedUser);
    
    return updatedUser;
  }
  
  async denyUserRole(userId: number, role: string, notes?: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    // Clone the roles object
    const roles = JSON.parse(JSON.stringify(user.roles));
    
    // Update the specified role
    if (roles[role]) {
      roles[role] = {
        ...roles[role],
        status: 'denied',
        deniedAt: new Date().toISOString(),
        ...(notes ? { notes } : {})
      };
    }
    
    // Update the user with new roles
    const updatedUser = { ...user, roles };
    this.users.set(userId, updatedUser);
    
    return updatedUser;
  }
  
  // System logging
  async createSystemLog(log: InsertSystemLog): Promise<SystemLog> {
    const id = this.currentLogId++;
    const newLog: SystemLog = {
      ...log,
      id,
      timestamp: new Date().toISOString()
    };
    this.systemLogs.set(id, newLog);
    return newLog;
  }
  
  async getSystemLogs(options?: {
    userId?: number;
    action?: string;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: SystemLog[]; total: number }> {
    const { userId, action, fromDate, toDate, limit = 20, offset = 0 } = options || {};
    
    let filteredLogs = Array.from(this.systemLogs.values());
    
    // Apply filters
    if (userId) filteredLogs = filteredLogs.filter(log => log.userId === userId);
    if (action) filteredLogs = filteredLogs.filter(log => log.action === action);
    if (fromDate) filteredLogs = filteredLogs.filter(log => log.timestamp >= fromDate);
    if (toDate) filteredLogs = filteredLogs.filter(log => log.timestamp <= toDate);
    
    // Sort by timestamp descending
    filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    const total = filteredLogs.length;
    
    // Apply pagination
    const paginatedLogs = filteredLogs.slice(offset, offset + limit);
    
    return {
      logs: paginatedLogs,
      total
    };
  }
  
  // User reports
  async createUserReport(report: InsertUserReport): Promise<UserReport> {
    const id = this.currentReportId++;
    const newReport: UserReport = {
      ...report,
      id,
      status: 'pending',
      timestamp: new Date().toISOString(),
      adminNotes: null,
      resolvedBy: null,
      resolvedAt: null
    };
    this.userReports.set(id, newReport);
    return newReport;
  }
  
  async getUserReports(options?: {
    status?: string;
    contentType?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ reports: UserReport[]; total: number }> {
    const { status, contentType, limit = 20, offset = 0 } = options || {};
    
    let filteredReports = Array.from(this.userReports.values());
    
    // Apply filters
    if (status) filteredReports = filteredReports.filter(report => report.status === status);
    if (contentType) filteredReports = filteredReports.filter(report => report.contentType === contentType);
    
    // Sort by timestamp descending
    filteredReports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    const total = filteredReports.length;
    
    // Apply pagination
    const paginatedReports = filteredReports.slice(offset, offset + limit);
    
    return {
      reports: paginatedReports,
      total
    };
  }
  
  async updateReportStatus(id: number, status: string, adminId: number, notes?: string): Promise<UserReport | undefined> {
    const report = this.userReports.get(id);
    if (!report) return undefined;
    
    const updatedReport: UserReport = {
      ...report,
      status,
      resolvedBy: adminId,
      resolvedAt: new Date().toISOString(),
      ...(notes ? { adminNotes: notes } : {})
    };
    
    this.userReports.set(id, updatedReport);
    return updatedReport;
  }
}

// Use database storage for persistence to Supabase
export const storage = new DatabaseStorage();
