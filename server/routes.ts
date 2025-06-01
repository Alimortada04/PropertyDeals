import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertPropertyInquirySchema, insertPropertySchema, insertPropertyProfileSchema, insertRepSchema, insertSystemLogSchema, insertUserReportSchema, insertBuyerProfileSchema } from "@shared/schema";
import { RecommendationEngine } from "./recommendation";
import { db } from "./db";
import { reps } from "@shared/schema";
import { eq, like } from "drizzle-orm";
import { requireAdmin, logAdminAction } from "./middleware/adminAuth";
import { supabaseAuthMiddleware } from "./middleware/supabase-auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Add Supabase authentication middleware globally
  app.use(supabaseAuthMiddleware);

  // Properties endpoints
  app.get("/api/properties", async (_req, res) => {
    const properties = await storage.getProperties();
    res.json(properties);
  });

  app.get("/api/properties/:id", async (req, res) => {
    const property = await storage.getProperty(parseInt(req.params.id));
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  });

  app.post("/api/properties", async (req, res) => {
    if (!req.isAuthenticated() || req.user.activeRole !== "seller") {
      return res.status(403).json({ message: "Not authorized to create properties" });
    }

    try {
      const propertyData = insertPropertySchema.parse({
        ...req.body,
        sellerId: req.user.id,
      });
      const property = await storage.createProperty(propertyData);
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ message: "Invalid property data", error });
    }
  });

  app.put("/api/properties/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const propertyId = parseInt(req.params.id);
    const property = await storage.getProperty(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.sellerId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this property" });
    }

    try {
      const updatedProperty = await storage.updateProperty(propertyId, req.body);
      res.json(updatedProperty);
    } catch (error) {
      res.status(400).json({ message: "Invalid property data", error });
    }
  });

  app.delete("/api/properties/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const propertyId = parseInt(req.params.id);
    const property = await storage.getProperty(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.sellerId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this property" });
    }

    const success = await storage.deleteProperty(propertyId);
    if (success) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: "Failed to delete property" });
    }
  });

  // Seller properties
  app.get("/api/seller/properties", async (req, res) => {
    if (!req.isAuthenticated() || req.user.activeRole !== "seller") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const properties = await storage.getPropertyBySeller(req.user.id);
    res.json(properties);
  });

  // Property Profile endpoints (for draft/live listings)
  app.get("/api/property-profiles", async (req, res) => {
    // Temporary bypass for development - remove in production
    const developmentMode = process.env.NODE_ENV !== 'production';
    
    if (!developmentMode && !req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      // In development, use a default seller ID or fetch all profiles
      const sellerId = req.isAuthenticated() ? req.user.id : 1;
      const profiles = await storage.getPropertyProfilesBySeller(sellerId);
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property profiles" });
    }
  });

  app.get("/api/property-profiles/:id", async (req, res) => {
    const profileId = parseInt(req.params.id);
    const profile = await storage.getPropertyProfile(profileId);

    if (!profile) {
      return res.status(404).json({ message: "Property profile not found" });
    }

    // Check if user owns this profile or if it's public
    // Temporarily allow access for development - in production, proper auth should be enforced
    if (req.isAuthenticated() && profile.sellerId !== req.user.id && profile.status !== 'live') {
      return res.status(403).json({ message: "Not authorized to view this property" });
    }

    res.json(profile);
  });

  app.post("/api/property-profiles", async (req, res) => {
    // For development, we'll use the seller_id from the request body (Supabase auth UUID)
    // In production, proper authentication should be enforced
    const developmentMode = process.env.NODE_ENV !== 'production';
    
    // Allow creation with proper seller_id even without backend authentication
    if (!developmentMode && (!req.isAuthenticated() || req.user.activeRole !== "seller")) {
      return res.status(403).json({ message: "Not authorized to create property profiles" });
    }

    try {
      console.log("Incoming request body:", JSON.stringify(req.body, null, 2));
      
      // Transform the payload to match database schema
      const transformedData = {
        ...req.body,
        // Always use the seller_id from the request body (Supabase auth UUID from frontend)
        seller_id: req.body.seller_id, // This comes from frontend with authenticated user's UUID
        created_by: req.isAuthenticated() ? req.user.id : 1, // Keep created_by as integer for backend compatibility
        status: req.body.status || "draft"
      };
      
      console.log("Transformed data for validation:", JSON.stringify(transformedData, null, 2));
      
      const profileData = insertPropertyProfileSchema.parse(transformedData);
      
      console.log("Parsed profile data:", JSON.stringify(profileData, null, 2));
      
      const profile = await storage.createPropertyProfile(profileData);
      console.log("Created profile:", JSON.stringify(profile, null, 2));
      res.status(201).json(profile);
    } catch (error) {
      console.error("Property profile creation error:", error);
      if (error && typeof error === 'object' && 'issues' in error) {
        console.error("Validation issues:", JSON.stringify(error.issues, null, 2));
      }
      res.status(400).json({ message: "Invalid property profile data", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.patch("/api/property-profiles/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const profileId = parseInt(req.params.id);
    const profile = await storage.getPropertyProfile(profileId);

    if (!profile) {
      return res.status(404).json({ message: "Property profile not found" });
    }

    if (profile.sellerId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this property" });
    }

    try {
      const updatedProfile = await storage.updatePropertyProfile(profileId, req.body);
      res.json(updatedProfile);
    } catch (error) {
      res.status(400).json({ message: "Invalid property profile data", error });
    }
  });

  app.post("/api/property-profiles/:id/publish", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const profileId = parseInt(req.params.id);
    const profile = await storage.getPropertyProfile(profileId);

    if (!profile) {
      return res.status(404).json({ message: "Property profile not found" });
    }

    if (profile.sellerId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to publish this property" });
    }

    try {
      const publishedProfile = await storage.publishPropertyProfile(profileId);
      res.json(publishedProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to publish property profile" });
    }
  });

  app.delete("/api/property-profiles/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const profileId = parseInt(req.params.id);
    const profile = await storage.getPropertyProfile(profileId);

    if (!profile) {
      return res.status(404).json({ message: "Property profile not found" });
    }

    if (profile.sellerId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this property" });
    }

    const success = await storage.deletePropertyProfile(profileId);
    if (success) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: "Failed to delete property profile" });
    }
  });

  // Buyer profile endpoints
  app.get("/api/buyer-profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const profile = await storage.getBuyerProfile(req.user.id);
    res.json(profile);
  });

  // Get buyer profile by UUID (Supabase user ID)
  app.get("/api/buyer-profile/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const profile = await storage.getBuyerProfileByUuid(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error('Error fetching buyer profile by UUID:', error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/buyer-profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const profileData = insertBuyerProfileSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      const profile = await storage.createBuyerProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data", error });
    }
  });

  // Create or update buyer profile by UUID
  app.post("/api/buyer-profile/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const profileData = {
        ...req.body,
        id: userId, // Use Supabase UUID as primary key
      };
      
      const profile = await storage.createBuyerProfileByUuid(userId, profileData);
      res.status(201).json(profile);
    } catch (error) {
      console.error('Error creating buyer profile by UUID:', error);
      res.status(400).json({ message: "Invalid profile data", error });
    }
  });

  // Update buyer profile by UUID
  app.put("/api/buyer-profile/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const profile = await storage.updateBuyerProfileByUuid(userId, req.body);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error('Error updating buyer profile by UUID:', error);
      res.status(400).json({ message: "Invalid profile data", error });
    }
  });

  app.put("/api/buyer-profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const profileData = insertBuyerProfileSchema.partial().parse(req.body);
      const profile = await storage.updateBuyerProfile(req.user.id, profileData);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data", error });
    }
  });

  // Property inquiries
  app.post("/api/properties/:id/inquiries", async (req, res) => {
    const propertyId = parseInt(req.params.id);
    const property = await storage.getProperty(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    try {
      const inquiryData = insertPropertyInquirySchema.parse({
        ...req.body,
        propertyId,
        userId: req.isAuthenticated() ? req.user.id : undefined,
      });
      
      const inquiry = await storage.createPropertyInquiry(inquiryData);
      res.status(201).json(inquiry);
    } catch (error) {
      res.status(400).json({ message: "Invalid inquiry data", error });
    }
  });

  app.get("/api/seller/inquiries", async (req, res) => {
    if (!req.isAuthenticated() || req.user.activeRole !== "seller") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const inquiries = await storage.getSellerInquiries(req.user.id);
    res.json(inquiries);
  });

  // Property recommendations
  app.get("/api/properties/recommendations/location/:location", async (req, res) => {
    try {
      const location = req.params.location;
      const priceMin = req.query.priceMin ? parseInt(req.query.priceMin as string) : 0;
      const priceMax = req.query.priceMax ? parseInt(req.query.priceMax as string) : 10000000;
      const propertyTypes = req.query.propertyTypes ? (req.query.propertyTypes as string).split(',') : undefined;
      const features = req.query.features ? (req.query.features as string).split(',') : undefined;
      const maxResults = req.query.maxResults ? parseInt(req.query.maxResults as string) : 5;

      const properties = await storage.getProperties();
      const recommendationEngine = new RecommendationEngine(properties);
      
      const recommendations = recommendationEngine.getRecommendations({
        location,
        priceRange: { min: priceMin, max: priceMax },
        propertyTypes,
        preferredFeatures: features,
        maxResults
      });

      res.json(recommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  // Random property recommendations
  app.get("/api/properties/recommendations", async (req, res) => {
    try {
      const maxResults = req.query.maxResults ? parseInt(req.query.maxResults as string) : 5;

      const properties = await storage.getProperties();
      const recommendationEngine = new RecommendationEngine(properties);
      
      const recommendations = recommendationEngine.getRecommendations({
        maxResults
      });

      res.json(recommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  // REPs endpoints
  app.get("/api/reps", async (_req, res) => {
    try {
      const repsList = await db.select().from(reps);
      res.json(repsList);
    } catch (error) {
      console.error('Error fetching REPs:', error);
      res.status(500).json({ message: "Failed to fetch REPs" });
    }
  });

  app.get("/api/reps/:id", async (req, res) => {
    try {
      const repId = parseInt(req.params.id);
      const [rep] = await db.select().from(reps).where(eq(reps.id, repId));
      
      if (!rep) {
        return res.status(404).json({ message: "REP not found" });
      }
      
      res.json(rep);
    } catch (error) {
      console.error('Error fetching REP:', error);
      res.status(500).json({ message: "Failed to fetch REP" });
    }
  });

  app.get("/api/reps/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const [rep] = await db.select().from(reps).where(eq(reps.slug, slug));
      
      if (!rep) {
        return res.status(404).json({ message: "REP not found" });
      }
      
      res.json(rep);
    } catch (error) {
      console.error('Error fetching REP by slug:', error);
      res.status(500).json({ message: "Failed to fetch REP" });
    }
  });

  app.post("/api/reps", async (req, res) => {
    try {
      const repData = insertRepSchema.parse(req.body);
      const [newRep] = await db.insert(reps).values(repData).returning();
      res.status(201).json(newRep);
    } catch (error) {
      console.error('Error creating REP:', error);
      res.status(400).json({ message: "Invalid REP data", error });
    }
  });

  app.put("/api/reps/:id", async (req, res) => {
    try {
      const repId = parseInt(req.params.id);
      const repData = req.body;
      
      const [rep] = await db.select().from(reps).where(eq(reps.id, repId));
      if (!rep) {
        return res.status(404).json({ message: "REP not found" });
      }
      
      const [updatedRep] = await db
        .update(reps)
        .set(repData)
        .where(eq(reps.id, repId))
        .returning();
      
      res.json(updatedRep);
    } catch (error) {
      console.error('Error updating REP:', error);
      res.status(400).json({ message: "Invalid REP data", error });
    }
  });

  app.delete("/api/reps/:id", async (req, res) => {
    try {
      const repId = parseInt(req.params.id);
      
      const [rep] = await db.select().from(reps).where(eq(reps.id, repId));
      if (!rep) {
        return res.status(404).json({ message: "REP not found" });
      }
      
      await db.delete(reps).where(eq(reps.id, repId));
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting REP:', error);
      res.status(500).json({ message: "Failed to delete REP" });
    }
  });

  // Admin routes - all protected by requireAdmin middleware
  // User Management
  app.get("/api/admin/users", requireAdmin, logAdminAction("view_users"), async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const sortBy = req.query.sortBy as string | undefined;
      const sortDirection = req.query.sortDirection as 'asc' | 'desc' | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      
      const result = await storage.getAllUsers({
        search,
        sortBy,
        sortDirection,
        limit,
        offset
      });
      
      res.json(result);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  app.get("/api/admin/users/:id", requireAdmin, logAdminAction("view_user_details"), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  app.put("/api/admin/users/:id", requireAdmin, logAdminAction("update_user"), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const userData = req.body;
      
      // Prevent changing own admin status for security
      if (req.user && userId === req.user.id && userData.isAdmin === false) {
        return res.status(403).json({ message: "Cannot remove your own admin privileges" });
      }
      
      const updatedUser = await storage.updateUser(userId, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(400).json({ message: "Invalid user data", error });
    }
  });
  
  // Role Approvals
  app.get("/api/admin/approvals", requireAdmin, logAdminAction("view_pending_approvals"), async (_req, res) => {
    try {
      const pendingUsers = await storage.getPendingApprovals();
      res.json(pendingUsers);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      res.status(500).json({ message: "Failed to fetch pending approvals" });
    }
  });
  
  app.post("/api/admin/approvals/:userId/approve/:role", requireAdmin, logAdminAction("approve_role"), async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const role = req.params.role;
      
      if (!['buyer', 'seller', 'rep'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      
      const updatedUser = await storage.approveUserRole(userId, role);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error('Error approving role:', error);
      res.status(500).json({ message: "Failed to approve role" });
    }
  });
  
  app.post("/api/admin/approvals/:userId/deny/:role", requireAdmin, logAdminAction("deny_role"), async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const role = req.params.role;
      const { notes } = req.body;
      
      if (!['buyer', 'seller', 'rep'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      
      const updatedUser = await storage.denyUserRole(userId, role, notes);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error('Error denying role:', error);
      res.status(500).json({ message: "Failed to deny role" });
    }
  });
  
  // System Logs
  app.get("/api/admin/logs", requireAdmin, logAdminAction("view_system_logs"), async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const action = req.query.action as string | undefined;
      const fromDate = req.query.fromDate as string | undefined;
      const toDate = req.query.toDate as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      
      const result = await storage.getSystemLogs({
        userId,
        action,
        fromDate,
        toDate,
        limit,
        offset
      });
      
      res.json(result);
    } catch (error) {
      console.error('Error fetching system logs:', error);
      res.status(500).json({ message: "Failed to fetch system logs" });
    }
  });
  
  // User Reports
  app.get("/api/admin/reports", requireAdmin, logAdminAction("view_user_reports"), async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const contentType = req.query.contentType as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      
      const result = await storage.getUserReports({
        status,
        contentType,
        limit,
        offset
      });
      
      res.json(result);
    } catch (error) {
      console.error('Error fetching user reports:', error);
      res.status(500).json({ message: "Failed to fetch user reports" });
    }
  });
  
  app.post("/api/reports", async (req, res) => {
    try {
      const reporterId = req.isAuthenticated() ? req.user.id : null;
      
      if (!reporterId) {
        return res.status(401).json({ message: "Authentication required to submit a report" });
      }
      
      const reportData = insertUserReportSchema.parse({
        ...req.body,
        reporterId
      });
      
      const report = await storage.createUserReport(reportData);
      res.status(201).json(report);
    } catch (error) {
      console.error('Error creating report:', error);
      res.status(400).json({ message: "Invalid report data", error });
    }
  });
  
  app.put("/api/admin/reports/:id", requireAdmin, logAdminAction("update_report_status"), async (req, res) => {
    try {
      const reportId = parseInt(req.params.id);
      const { status, notes } = req.body;
      
      if (!['pending', 'reviewed', 'resolved', 'dismissed'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const updatedReport = await storage.updateReportStatus(reportId, status, req.user.id, notes);
      
      if (!updatedReport) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      res.json(updatedReport);
    } catch (error) {
      console.error('Error updating report:', error);
      res.status(500).json({ message: "Failed to update report" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
