import { Request, Response, NextFunction } from "express";

/**
 * Middleware to check if the user is an admin
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  // First check if the user is authenticated
  if (!req.isAuthenticated()) {
    return res.status(401).json({ 
      message: "Authentication required",
      redirectTo: "/signin"
    });
  }

  // Then check if the user is an admin
  if (!req.user?.isAdmin) {
    return res.status(403).json({ 
      message: "Admin privileges required",
      redirectTo: "/dashboard"
    });
  }

  // User is authenticated and has admin privileges, proceed
  next();
}

/**
 * Log admin actions for audit trail
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export function logAdminAction(action: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Set action in request for later logging
    req.adminAction = action;
    
    // Store original end method
    const originalEnd = res.end;
    
    // Override end method
    res.end = function(chunk?: any, encoding?: any) {
      // Create a log entry if the request was successful (status < 400)
      if (this.statusCode < 400 && req.user) {
        const storage = req.app.get('storage');
        
        // Log the admin action asynchronously (don't wait for it)
        try {
          const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
          storage.createSystemLog({
            userId: req.user.id,
            action: req.adminAction,
            details: {
              method: req.method,
              path: req.path,
              params: req.params,
              query: req.query,
              statusCode: this.statusCode
            },
            ipAddress: typeof ipAddress === 'string' ? ipAddress : Array.isArray(ipAddress) ? ipAddress[0] : undefined
          }).catch(err => console.error('Error logging admin action:', err));
        } catch (error) {
          console.error('Error creating system log:', error);
        }
      }
      
      // Call the original end method
      return originalEnd.call(this, chunk, encoding);
    };
    
    next();
  };
}

// Extend Express Request to include adminAction property
declare global {
  namespace Express {
    interface Request {
      adminAction?: string;
    }
  }
}