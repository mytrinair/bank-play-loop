/**
 * BankDojo Jr. Backend Server
 * Built with Hono - fast, lightweight, perfect for hackathons!
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { authMiddleware } from './middleware/auth';
import studentRoutes from './routes/students';
import teacherRoutes from './routes/teachers';
import questRoutes from './routes/quests';
import classRoutes from './routes/classes';
import storeRoutes from './routes/store';
import cycleRoutes from './routes/cycles';
import transactionRoutes from './routes/transactions';
import geminiRoutes from './routes/gemini';
import { initDatabase } from './db';

// Initialize the in-memory database with sample data
initDatabase();

// Create the main Hono app instance
const app = new Hono();

// Middleware: Add logging for all requests (helps with debugging)
app.use('*', logger());

// Middleware: Enable CORS so frontend can make requests
app.use('*', cors({
  origin: [
    'http://localhost:8080',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:5173',
  ],
  credentials: true,
}));

// Middleware: Format JSON responses nicely (development only)
app.use('*', prettyJSON());

// Middleware: Add Auth0 JWT validation to all API routes except gemini (public helper)
app.use('/api/*', async (c, next) => {
  if (c.req.path.startsWith('/api/gemini')) {
    return next();
  }
  return authMiddleware(c, next);
});

// Health check endpoint - useful for monitoring and testing
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'BankDojo Jr. API',
  });
});

// API routes - organized by resource (RESTful design)
app.route('/api/students', studentRoutes);
app.route('/api/teachers', teacherRoutes);
app.route('/api/quests', questRoutes);
app.route('/api/classes', classRoutes);
app.route('/api/store', storeRoutes);
app.route('/api/cycles', cycleRoutes);
app.route('/api/transactions', transactionRoutes);
app.route('/api/gemini', geminiRoutes);

// 404 handler for undefined routes
app.notFound((c) => {
  return c.json({ error: 'Not Found', path: c.req.path }, 404);
});

// Error handler - catches any unhandled errors
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({ 
    error: 'Internal Server Error', 
    message: err.message,
  }, 500);
});

// Export the app for use with different adapters (Node.js, Bun, etc.)
export default app;

// Server startup - works with both Bun and Node.js
const port = parseInt(process.env.PORT || '3001'); // Default to 3001 to avoid conflicts with common port 3000

// If running with Bun, start the server directly
// @ts-ignore - Bun is a global in Bun runtime
if (typeof Bun !== 'undefined') {
  try {
    // @ts-ignore - Bun is a global in Bun runtime
    const server = Bun.serve({
      fetch: app.fetch,
      port: port,
    });
    console.log(`🚀 BankDojo Jr. API Server running on http://localhost:${server.port}`);
  } catch (error: any) {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use. Please:`);
      console.error(`   1. Stop the process using port ${port}`);
      console.error(`   2. Or set a different port: PORT=3002 bun run dev:server`);
      process.exit(1);
    } else {
      throw error;
    }
  }
} else {
  // For Node.js, you would use @hono/node-server
  // Example: import { serve } from '@hono/node-server'
  // serve({ fetch: app.fetch, port })
  console.log('⚠️  Running with Bun is recommended. For Node.js, install @hono/node-server');
  console.log(`   Server would run on http://localhost:${port}`);
}

