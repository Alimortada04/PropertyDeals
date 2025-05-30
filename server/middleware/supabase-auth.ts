import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { storage } from '../storage';

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
    
    if (error || !user) {
      return next();
    }

    // Find the user in our database
    const dbUser = await storage.getUserByEmail(user.email!);
    
    // Attach user to request (even if not in our DB yet)
    req.user = dbUser || {
      id: parseInt(user.id),
      email: user.email!,
      username: user.user_metadata?.username || user.email!.split('@')[0],
      fullName: user.user_metadata?.full_name || user.email!.split('@')[0],
      role: 'buyer',
      created_at: new Date().toISOString()
    };
    req.isAuthenticated = () => true;

    next();
  } catch (error) {
    console.error('Supabase auth middleware error:', error);
    next();
  }
}