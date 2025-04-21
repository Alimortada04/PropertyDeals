import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("fullName"),
  email: text("email"),
  activeRole: text("activeRole").default("buyer"), // Current active role
  roles: jsonb("roles").default({ 
    buyer: { status: "approved" }, 
    seller: { status: "not_applied" }, 
    rep: { status: "not_applied" } 
  }).notNull(), // Roles with statuses
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zipCode").notNull(),
  price: integer("price").notNull(),
  description: text("description"),
  bedrooms: integer("bedrooms"),
  bathrooms: doublePrecision("bathrooms"),
  squareFeet: integer("squareFeet"),
  lotSize: text("lotSize"),
  yearBuilt: integer("yearBuilt"),
  propertyType: text("propertyType"),
  status: text("status").default("off-market"), // off-market, exclusive, etc.
  condition: text("condition"), // turnkey, light rehab, full gut, BRRRR, etc.
  features: text("features").array(),
  imageUrl: text("imageUrl"),
  sellerId: integer("sellerId").notNull(),
  createdAt: text("createdAt").notNull(),
});

export const propertyInquiries = pgTable("propertyInquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  propertyId: integer("propertyId").notNull(),
  userId: integer("userId"),
  createdAt: text("createdAt").notNull(),
});

export const reps = pgTable("reps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  locationCity: text("locationCity").notNull(),
  locationState: text("locationState").notNull(),
  avatar: text("avatar").notNull(),
  yearsExperience: integer("yearsExperience").notNull(),
  rating: doublePrecision("rating").notNull(),
  reviewCount: integer("reviewCount").notNull(),
  specialties: text("specialties").array(),
  bio: text("bio").notNull(),
  slug: text("slug"),
  isFeatured: boolean("isFeatured").default(false),
  entityType: text("entityType").default("individual"), // individual or business
  isVerified: boolean("isVerified").default(false),
  
  // Additional properties for enhanced profile
  memberSince: timestamp("memberSince"),
  lastActive: timestamp("lastActive"),
  responseTime: text("responseTime"),
  contactPhone: text("contactPhone"),
  contactEmail: text("contactEmail"),
  bannerUrl: text("bannerUrl"),
  website: text("website"),
  social: jsonb("social"), // LinkedIn, Instagram, etc.
  availability: text("availability"),
  availabilitySchedule: jsonb("availabilitySchedule"),
  expertise: text("expertise").array(),
  propertyTypes: text("propertyTypes").array(),
  locationsServed: text("locationsServed").array(),
  credentials: text("credentials").array(),
  additionalInfo: text("additionalInfo"),
  
  // Business-specific fields
  businessName: text("businessName"),
  foundedYear: integer("foundedYear"),
  logoUrl: text("logoUrl"),
  businessAddress: text("businessAddress"),
  tagline: text("tagline"),
  dealsCompleted: integer("dealsCompleted"),
  teamSize: integer("teamSize")
});

// Define role types
export type RoleStatus = "approved" | "pending" | "denied" | "not_applied";
export type UserRole = "buyer" | "seller" | "rep";

export interface RoleData {
  status: RoleStatus;
  appliedAt?: string;
  approvedAt?: string;
  deniedAt?: string;
  notes?: string;
}

export interface UserRoles {
  buyer: RoleData;
  seller: RoleData;
  rep: RoleData;
}

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  activeRole: true,
  roles: true,
}).omit({ roles: true }).extend({
  roles: z.object({
    buyer: z.object({
      status: z.enum(["approved", "pending", "denied", "not_applied"]),
      appliedAt: z.string().optional(),
      approvedAt: z.string().optional(),
      deniedAt: z.string().optional(),
      notes: z.string().optional(),
    }),
    seller: z.object({
      status: z.enum(["approved", "pending", "denied", "not_applied"]),
      appliedAt: z.string().optional(),
      approvedAt: z.string().optional(),
      deniedAt: z.string().optional(),
      notes: z.string().optional(),
    }),
    rep: z.object({
      status: z.enum(["approved", "pending", "denied", "not_applied"]),
      appliedAt: z.string().optional(),
      approvedAt: z.string().optional(),
      deniedAt: z.string().optional(),
      notes: z.string().optional(),
    }),
  }).optional(),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
});

export const insertPropertyInquirySchema = createInsertSchema(propertyInquiries).omit({
  id: true,
  createdAt: true,
});

export const insertRepSchema = createInsertSchema(reps).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertPropertyInquiry = z.infer<typeof insertPropertyInquirySchema>;
export type PropertyInquiry = typeof propertyInquiries.$inferSelect;

export type InsertRep = z.infer<typeof insertRepSchema>;
export type Rep = typeof reps.$inferSelect;
