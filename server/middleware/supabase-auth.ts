import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { storage } from '../storage';

interface AuthenticatedRequest extends Request {
  user?: any;
  isAuthenticated(): boolean;
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found, authentication will not work properly');
}

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export async function supabaseAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  // Skip if already authenticated via Express session
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  if (!supabase) {
    console.log('Supabase client not available, skipping auth middleware');
    return next();
  }

  // Check for Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substring(7);

  try {
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.log('Supabase auth error:', error.message);
      return next();
    }
    
    if (!user) {
      console.log('No user found from token');
      return next();
    }

    // Find the user in our database
    let dbUser = await storage.getUserByEmail(user.email!);
    
    // If user doesn't exist in our database, create them
    if (!dbUser) {
      try {
        const newUser = await storage.createUser({
          id: user.id,
          username: user.user_metadata?.username || user.email!.split('@')[0],
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.email!.split('@')[0],
          active_role: 'buyer',
          is_admin: false
        });
        dbUser = newUser;
      } catch (error) {
        console.error('Error creating user in database:', error);
        // Continue with a temporary user object
        dbUser = {
          id: user.id,
          username: user.user_metadata?.username || user.email!.split('@')[0],
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.email!.split('@')[0],
          active_role: 'buyer',
          is_admin: false,
          roles: { buyer: { status: "approved" }, seller: { status: "not_applied" }, rep: { status: "not_applied" } },
          created_at: new Date()
        };
      }
    }
    
    // Attach user to request
    req.user = dbUser;
    req.isAuthenticated = function(this: any): this is AuthenticatedRequest { return true; };

    next();
  } catch (error) {
    console.error('Supabase auth middleware error:', error);
    next();
  }
}