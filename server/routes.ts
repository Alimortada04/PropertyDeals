import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertPropertyInquirySchema, insertPropertySchema } from "@shared/schema";
import { RecommendationEngine } from "./recommendation";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

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
    if (!req.isAuthenticated() || req.user.userType !== "seller") {
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
    if (!req.isAuthenticated() || req.user.userType !== "seller") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const properties = await storage.getPropertyBySeller(req.user.id);
    res.json(properties);
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
    if (!req.isAuthenticated() || req.user.userType !== "seller") {
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

  const httpServer = createServer(app);

  return httpServer;
}
