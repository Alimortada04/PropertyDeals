import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("fullName"),
  email: text("email"),
  isAdmin: boolean("isAdmin").default(false).notNull(),
  activeRole: text("activeRole").default("buyer"), // Current active role
  roles: jsonb("roles").default({ 
    buyer: { status: "approved" }, 
    seller: { status: "not_applied" }, 
    rep: { status: "not_applied" } 
  }).notNull(), // Roles with statuses
});

// Buyer profile table for extended user account settings
export const buyerProfiles = pgTable("buyer_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  
  // Account Settings
  phone: text("phone"),
  location: text("location"),
  bio: text("bio"),
  inRealEstateSince: text("in_real_estate_since"),
  businessName: text("business_name"),
  typeOfBuyer: text("type_of_buyer"),
  website: text("website"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  linkedin: text("linkedin"),
  profilePhoto: text("profile_photo"),
  bannerImage: text("banner_image"),
  
  // Property Preferences
  markets: jsonb("markets"), // Array of target markets
  propertyTypes: jsonb("property_types"), // Array of property types
  propertyConditions: jsonb("property_conditions"), // Array of conditions
  idealBudgetMin: integer("ideal_budget_min"),
  idealBudgetMax: integer("ideal_budget_max"),
  financingMethods: jsonb("financing_methods"), // Array of financing methods
  preferredFinancingMethod: text("preferred_financing_method"),
  closingTimeline: text("closing_timeline"),
  numberOfDealsLast12Months: integer("number_of_deals_last_12_months"),
  goalDealsNext12Months: integer("goal_deals_next_12_months"),
  totalDealsCompleted: integer("total_deals_done"),
  currentPortfolioCount: integer("current_portfolio_count"),
  proofOfFunds: text("proof_of_funds"), // File URL
  pastProperties: jsonb("past_properties"), // Array of past properties
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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

// Enhanced property profile table for full listing management
export const propertyProfile = pgTable("property_profile", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").notNull(),
  
  // Property Information (Step 1)
  name: text("name"), // Property Name field
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  county: text("county"),
  parcelId: text("parcel_id"),
  propertyType: text("property_type"),
  bedrooms: integer("bedrooms"),
  bathrooms: doublePrecision("bathrooms"),
  sqft: integer("sqft"), // Square Footage
  lotSize: text("lot_size"),
  yearBuilt: integer("year_built"),
  parking: text("parking"), // New parking field
  condition: text("condition"),
  occupancyStatus: text("occupancy_status"),
  
  // Media (Step 2)
  primaryImage: text("primary_image"), // Primary image URL
  galleryImages: jsonb("gallery_images"), // Array of gallery image URLs
  videoWalkthrough: text("video_walkthrough"), // Video file or link
  
  // Finance (Step 3)
  arv: integer("arv"), // ARV field above rent section
  rentTotalMonthly: integer("rent_total_monthly"),
  rentTotalAnnual: integer("rent_total_annual"),
  rentUnit: jsonb("rent_unit"), // JSON: unit name, amount, frequency
  expensesTotalMonthly: integer("expenses_total_monthly"),
  expensesTotalAnnual: integer("expenses_total_annual"),
  expenseItems: jsonb("expense_items"), // JSON: name, amount, frequency
  
  // Logistics (Step 4)
  accessType: text("access_type"),
  closingDate: text("closing_date"),
  comps: jsonb("comps"), // Array of comp addresses
  purchaseAgreement: text("purchase_agreement"), // File URL
  assignmentAgreement: text("assignment_agreement"), // File URL
  
  // Final Details (Step 5)
  purchasePrice: integer("purchase_price"),
  listingPrice: integer("listing_price"),
  assignmentFee: integer("assignment_fee"),
  repairProjects: jsonb("repair_projects"), // JSON: name, cost, description, contractor, file
  repairCostsTotal: integer("repair_costs_total"),
  jvPartners: jsonb("jv_partners"), // UUID array
  description: text("description"),
  additionalNotes: text("additional_notes"),
  tags: jsonb("tags"), // Array of tags
  featuredProperty: boolean("featured_property").default(false).notNull(),
  
  // Status and visibility
  status: text("status").default("draft").notNull(), // draft, active
  createdBy: integer("created_by").notNull(), // User ID of creator
  
  // Engagement stats
  viewCount: integer("view_count").default(0).notNull(),
  saveCount: integer("save_count").default(0).notNull(),
  offerCount: integer("offer_count").default(0).notNull(),
  offerIds: jsonb("offer_ids"), // Array of offer IDs
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
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
  isAdmin: true,
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

export const insertPropertyProfileSchema = createInsertSchema(propertyProfile).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
});

export const insertPropertyInquirySchema = createInsertSchema(propertyInquiries).omit({
  id: true,
  createdAt: true,
});

export const insertRepSchema = createInsertSchema(reps).omit({
  id: true,
});

// Types
export const insertBuyerProfileSchema = createInsertSchema(buyerProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBuyerProfile = z.infer<typeof insertBuyerProfileSchema>;
export type BuyerProfile = typeof buyerProfiles.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertPropertyProfile = z.infer<typeof insertPropertyProfileSchema>;
export type PropertyProfile = typeof propertyProfile.$inferSelect;

export type InsertPropertyInquiry = z.infer<typeof insertPropertyInquirySchema>;
export type PropertyInquiry = typeof propertyInquiries.$inferSelect;

export type InsertRep = z.infer<typeof insertRepSchema>;
export type Rep = typeof reps.$inferSelect;

// System logs for admin activity tracking
// Seller profiles and application data
export const sellers = pgTable("sellers", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().unique(), // Links to auth.users.id
  fullName: text("fullName").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  businessName: text("businessName"),
  yearsInRealEstate: text("yearsInRealEstate").notNull(),
  businessType: text("businessType").notNull(),
  
  // Step 2 data
  targetMarkets: text("targetMarkets").array().notNull(),
  dealTypes: text("dealTypes").array().notNull(),
  maxDealVolume: text("maxDealVolume").notNull(),
  hasBuyerList: boolean("hasBuyerList").default(false).notNull(),
  isDirectToSeller: boolean("isDirectToSeller").default(false).notNull(),
  
  // Step 3 data
  purchaseAgreements: jsonb("purchaseAgreements"), // File metadata
  assignmentContracts: jsonb("assignmentContracts"), // File metadata
  notes: text("notes"),
  websiteUrl: text("websiteUrl"),
  socialFacebook: text("socialFacebook"),
  socialInstagram: text("socialInstagram"),
  socialLinkedin: text("socialLinkedin"),
  hasProofOfFunds: boolean("hasProofOfFunds").default(false).notNull(),
  usesTitleCompany: boolean("usesTitleCompany").default(false).notNull(),
  
  // Application state
  isDraft: boolean("isDraft").default(true).notNull(),
  status: text("status").default("pending").notNull(), // pending, active, paused, banned, rejected
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
  reviewedBy: integer("reviewedBy"), // Admin who reviewed the application
  adminNotes: text("adminNotes"),
});

export const insertSellerSchema = createInsertSchema(sellers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  reviewedAt: true,
  reviewedBy: true,
  adminNotes: true,
});

export type InsertSeller = z.infer<typeof insertSellerSchema>;
export type Seller = typeof sellers.$inferSelect;

export const systemLogs = pgTable("systemLogs", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  action: text("action").notNull(), // login, create_user, update_property, etc.
  details: jsonb("details"), // additional contextual information
  ipAddress: text("ipAddress"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertSystemLogSchema = createInsertSchema(systemLogs).omit({
  id: true,
  timestamp: true,
});

export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;
export type SystemLog = typeof systemLogs.$inferSelect;

// User reports for handling flagged content
export const userReports = pgTable("userReports", {
  id: serial("id").primaryKey(),
  reporterId: integer("reporterId").notNull(), // User who made the report
  contentType: text("contentType").notNull(), // property, user, message, etc.
  contentId: integer("contentId").notNull(), // ID of the reported content
  reason: text("reason").notNull(), // spam, inappropriate, fraud, etc.
  details: text("details"), // Additional description from reporter
  status: text("status").default("pending").notNull(), // pending, reviewed, resolved, dismissed
  adminNotes: text("adminNotes"), // Notes from admin review
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  resolvedBy: integer("resolvedBy"), // Admin who resolved the report
  resolvedAt: timestamp("resolvedAt"),
});

export const insertUserReportSchema = createInsertSchema(userReports).omit({
  id: true,
  timestamp: true,
  status: true,
  adminNotes: true,
  resolvedBy: true,
  resolvedAt: true,
});

export type InsertUserReport = z.infer<typeof insertUserReportSchema>;
export type UserReport = typeof userReports.$inferSelect;
