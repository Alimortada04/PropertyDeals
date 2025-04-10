import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertPropertyInquirySchema, insertPropertySchema } from "@shared/schema";

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

  const httpServer = createServer(app);

  return httpServer;
}
