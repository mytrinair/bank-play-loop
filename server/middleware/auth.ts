/**
 * Auth0 JWT Validation Middleware for Hono
 * Validates Auth0 JWT tokens and extracts user information
 */

import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
// @ts-ignore - jwks-client doesn't have types
import jwksClient from 'jwks-client';

// Auth0 configuration
const AUTH0_DOMAIN = 'mytrinair.us.auth0.com';
const AUTH0_AUDIENCE = 'https://bankdojo-jr-api'; // Optional for now

// JWKS client to get Auth0 public keys
const client = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  cache: true,
  cacheMaxAge: 24 * 60 * 60 * 1000, // 24 hours
  rateLimit: true,
  requestsPerMinute: 10
});

// Interface for decoded JWT payload
export interface AuthUser {
  sub: string; // Auth0 user ID
  email?: string;
  name?: string;
  picture?: string;
  nickname?: string;
  email_verified?: boolean;
  'https://bankdojo.app/app_metadata'?: {
    role?: 'student' | 'teacher';
    classId?: string;
  };
  'https://bankdojo.app/user_metadata'?: {
    role?: 'student' | 'teacher';
    grade?: number;
    preferences?: Record<string, any>;
  };
  aud: string | string[];
  iss: string;
  iat: number;
  exp: number;
}

// Extend Hono's Context to include authenticated user
declare module 'hono' {
  interface Context {
    user?: AuthUser;
  }
}

/**
 * Get signing key from Auth0 JWKS
 */
const getKey = (header: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    client.getSigningKey(header.kid, (err: any, key: any) => {
      if (err) {
        return reject(err);
      }
      const signingKey = key.publicKey || key.rsaPublicKey;
      resolve(signingKey);
    });
  });
};

/**
 * Verify and decode JWT token
 */
const verifyToken = async (token: string): Promise<AuthUser> => {
  return new Promise((resolve, reject) => {
    // Decode header to get key ID
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded === 'string' || !decoded.header) {
      return reject(new Error('Invalid token format'));
    }

          getKey(decoded.header)
        .then((key) => {
          // More flexible verification - audience is optional
          const verifyOptions: any = {
            issuer: `https://${AUTH0_DOMAIN}/`,
            algorithms: ['RS256']
          };
          
          // Only add audience if it exists in the token
          if (decoded.payload && (decoded.payload as any).aud) {
            verifyOptions.audience = AUTH0_AUDIENCE;
          }

          jwt.verify(token, key, verifyOptions, (err, payload) => {
            if (err) {
              return reject(err);
            }
            resolve(payload as unknown as AuthUser);
          });
        })
        .catch(reject);
  });
};

/**
 * Middleware to validate Auth0 JWT tokens
 * Adds user information to context if valid token is provided
 */
export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided - continue without authentication
    return next();
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const user = await verifyToken(token);
    c.user = user;
  } catch (error) {
    console.error('Token validation failed:', error);
    return c.json({ error: 'Invalid or expired token' }, 401);
  }

  return next();
};

/**
 * Middleware that requires authentication
 * Returns 401 if no valid token is provided
 */
export const requireAuth = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Authorization token required' }, 401);
  }

  const token = authHeader.substring(7);

  try {
    const user = await verifyToken(token);
    c.user = user;
  } catch (error) {
    console.error('Token validation failed:', error);
    return c.json({ error: 'Invalid or expired token' }, 401);
  }

  return next();
};

/**
 * Middleware that requires a specific role
 */
export const requireRole = (requiredRole: 'student' | 'teacher') => {
  return async (c: Context, next: Next) => {
    // First ensure user is authenticated
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const token = authHeader.substring(7);

    try {
      const user = await verifyToken(token);
      c.user = user;

      // Check role from app_metadata or user_metadata
      const appMetadata = user['https://bankdojo.app/app_metadata'];
      const userMetadata = user['https://bankdojo.app/user_metadata'];
      
      const userRole = appMetadata?.role || userMetadata?.role;

      // Default role assignment for demo (can be removed in production)
      let effectiveRole = userRole;
      if (!effectiveRole) {
        effectiveRole = user.email?.includes('teacher') || user.email?.includes('edu') ? 'teacher' : 'student';
      }

      if (effectiveRole !== requiredRole) {
        return c.json({ 
          error: 'Insufficient permissions', 
          required: requiredRole, 
          current: effectiveRole 
        }, 403);
      }

      return next();
    } catch (error) {
      console.error('Token validation failed:', error);
      return c.json({ error: 'Invalid or expired token' }, 401);
    }
  };
};

/**
 * Helper function to get user ID from context
 */
export const getUserId = (c: Context): string => {
  return c.user?.sub || '';
};

/**
 * Helper function to get user role from context
 */
export const getUserRole = (c: Context): 'student' | 'teacher' | null => {
  const user = c.user;
  if (!user) return null;

  const appMetadata = user['https://bankdojo.app/app_metadata'];
  const userMetadata = user['https://bankdojo.app/user_metadata'];
  
  const userRole = appMetadata?.role || userMetadata?.role;

  // Default role assignment for demo
  if (!userRole) {
    return user.email?.includes('teacher') || user.email?.includes('edu') ? 'teacher' : 'student';
  }

  return userRole;
};

/**
 * Helper function to get user's class ID
 */
export const getUserClassId = (c: Context): string | null => {
  const user = c.user;
  if (!user) return null;

  const appMetadata = user['https://bankdojo.app/app_metadata'];
  return appMetadata?.classId || null;
};

/**
 * Helper function to check if user is authenticated
 */
export const isAuthenticated = (c: Context): boolean => {
  return !!c.user;
};