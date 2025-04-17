import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("fullName"),
  email: text("email"),
  userType: text("userType").default("buyer"), // buyer or seller
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

// Real Estate Professional (REP) tables
export const reps = pgTable("reps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(), // e.g., "Real Estate Agent", "Broker"
  avatar: text("avatar").notNull(),
  banner: text("banner"),
  verified: boolean("verified").default(false).notNull(),
  topRep: boolean("topRep").default(false).notNull(),
  pdCertified: boolean("pdCertified").default(false).notNull(),
  location: text("location").notNull(), // City, State
  company: text("company"),
  companyUrl: text("companyUrl"),
  memberSince: timestamp("memberSince").defaultNow().notNull(),
  bio: text("bio"),
  available: boolean("available").default(true).notNull(),
  contactInfo: text("contactInfo").notNull(), // JSON {email, phone, website}
  specialties: text("specialties").array(),
  areas: text("areas").array(), // Service areas
  socialLinks: text("socialLinks"), // JSON {facebook, instagram, twitter, linkedin}
  stats: text("stats"), // JSON {dealsClosed, activeListings, rating, reviewCount, responseRate}
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const repReviews = pgTable("repReviews", {
  id: serial("id").primaryKey(),
  repId: integer("repId").notNull().references(() => reps.id),
  userId: integer("userId"),
  name: text("name").notNull(),
  avatar: text("avatar"),
  rating: real("rating").notNull(),
  comment: text("comment").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  verified: boolean("verified").default(false).notNull(),
  helpfulCount: integer("helpfulCount").default(0).notNull(),
  relationship: text("relationship"), // "Client", "Colleague", etc.
});

export const repListings = pgTable("repListings", {
  id: serial("id").primaryKey(),
  repId: integer("repId").notNull().references(() => reps.id),
  propertyId: integer("propertyId").notNull().references(() => properties.id),
  listedDate: timestamp("listedDate").defaultNow().notNull(),
});

export const repDeals = pgTable("repDeals", {
  id: serial("id").primaryKey(),
  repId: integer("repId").notNull().references(() => reps.id),
  propertyId: integer("propertyId").notNull().references(() => properties.id),
  closedDate: timestamp("closedDate").notNull(),
  soldPrice: integer("soldPrice").notNull(),
  role: text("role").notNull(), // "Buyer's Agent", "Listing Agent", etc.
});

export const repActivity = pgTable("repActivity", {
  id: serial("id").primaryKey(),
  repId: integer("repId").notNull().references(() => reps.id),
  type: text("type").notNull(), // 'post', 'listing', 'deal', 'comment', etc.
  content: text("content"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  relatedId: integer("relatedId"), // ID of related post, property, etc.
  imageUrl: text("imageUrl"),
});

export const repConnections = pgTable("repConnections", {
  id: serial("id").primaryKey(),
  repId: integer("repId").notNull().references(() => reps.id),
  connectedRepId: integer("connectedRepId").notNull().references(() => reps.id),
  established: timestamp("established").defaultNow().notNull(),
  relationshipType: text("relationshipType"), // 'colleague', 'mentor', 'partner', etc.
});

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  userType: true,
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
  createdAt: true,
  updatedAt: true,
});

export const insertRepReviewSchema = createInsertSchema(repReviews).omit({
  id: true,
  date: true,
});

export const insertRepListingSchema = createInsertSchema(repListings).omit({
  id: true,
  listedDate: true,
});

export const insertRepDealSchema = createInsertSchema(repDeals).omit({
  id: true,
});

export const insertRepActivitySchema = createInsertSchema(repActivity).omit({
  id: true,
  timestamp: true,
});

export const insertRepConnectionSchema = createInsertSchema(repConnections).omit({
  id: true,
  established: true,
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

export type InsertRepReview = z.infer<typeof insertRepReviewSchema>;
export type RepReview = typeof repReviews.$inferSelect;

export type InsertRepListing = z.infer<typeof insertRepListingSchema>;
export type RepListing = typeof repListings.$inferSelect;

export type InsertRepDeal = z.infer<typeof insertRepDealSchema>;
export type RepDeal = typeof repDeals.$inferSelect;

export type InsertRepActivity = z.infer<typeof insertRepActivitySchema>;
export type RepActivity = typeof repActivity.$inferSelect;

export type InsertRepConnection = z.infer<typeof insertRepConnectionSchema>;
export type RepConnection = typeof repConnections.$inferSelect;
