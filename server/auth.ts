import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "propertydeals-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, password, fullName, email } = req.body;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Create user with proper data structure
      const userData = {
        username,
        password: await hashPassword(password),
        fullName: fullName || '',
        email: email || '',
        activeRole: 'buyer',
        isAdmin: false,
        roles: {
          buyer: { status: "approved" },
          seller: { status: "not_applied" },
          rep: { status: "not_applied" }
        }
      };

      const user = await storage.createUser(userData);

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Database error saving new user" });
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
  
  // Update active role
  app.post("/api/user/active-role", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const { role } = req.body;
    if (!role || !["buyer", "seller", "rep"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    
    const userRoles = req.user.roles || {
      buyer: { status: "approved" },
      seller: { status: "not_applied" },
      rep: { status: "not_applied" }
    };
    
    // Check if the role is approved
    if (userRoles[role].status !== "approved") {
      return res.status(403).json({ 
        error: "Role not approved",
        status: userRoles[role].status 
      });
    }
    
    // Update the user's active role
    const updatedUser = await storage.updateUser(req.user.id, { 
      activeRole: role
    });
    
    if (!updatedUser) {
      return res.status(500).json({ error: "Failed to update user" });
    }
    
    // Update the user in the session
    req.login(updatedUser, (err) => {
      if (err) return res.status(500).json({ error: "Session update error" });
      res.status(200).json(updatedUser);
    });
  });
  
  // Apply for a new role
  app.post("/api/user/apply-role", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const { role, applicationData } = req.body;
    if (!role || !["buyer", "seller", "rep"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    
    const userRoles = req.user.roles || {
      buyer: { status: "approved" },
      seller: { status: "not_applied" },
      rep: { status: "not_applied" }
    };
    
    // Check if already approved or pending for this role
    if (["approved", "pending"].includes(userRoles[role].status)) {
      return res.status(400).json({ 
        error: "Already applied or approved for this role",
        status: userRoles[role].status
      });
    }
    
    // Update the role status to pending
    const updatedRoles = {
      ...userRoles,
      [role]: {
        status: "pending",
        appliedAt: new Date().toISOString(),
        ...applicationData
      }
    };
    
    // Update the user's roles
    const updatedUser = await storage.updateUser(req.user.id, { 
      roles: updatedRoles
    });
    
    if (!updatedUser) {
      return res.status(500).json({ error: "Failed to update user" });
    }
    
    // Update the user in the session
    req.login(updatedUser, (err) => {
      if (err) return res.status(500).json({ error: "Session update error" });
      res.status(200).json(updatedUser);
    });
  });
}
