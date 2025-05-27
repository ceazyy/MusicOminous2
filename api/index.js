import express from "express";
import { registerRoutes } from "../server/routes.js";
import { storage } from "../server/storage.js";

// Create a single Express app instance that will be reused
const app = express();

// Configure Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  console.error("API Error:", {
    status,
    message,
    error: err,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
  
  // In development, include more error details
  const errorResponse = {
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      details: err.message,
      stack: err.stack
    })
  };
  
  res.status(status).json(errorResponse);
});

// Initialize routes and storage
let routesInitialized = false;
let routesPromise = null;

async function ensureInitialized() {
  if (!routesInitialized) {
    if (!routesPromise) {
      console.log("Initializing routes and storage...", {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        memory: process.memoryUsage()
      });
      
      try {
        // Initialize storage first
        const albums = await storage.getAllAlbums();
        console.log("Storage initialized successfully with albums:", albums.map(a => a.title));
        
        // Then initialize routes
        await registerRoutes(app);
        console.log("Routes initialized successfully");
        
        routesInitialized = true;
      } catch (error) {
        console.error("Initialization failed:", {
          error,
          stack: error.stack,
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'production',
          memory: process.memoryUsage()
        });
        throw error;
      }
    } else {
      await routesPromise;
    }
  }
}

// Export the Express app as a Vercel serverless function
export default async function handler(req, res) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    console.log(`[${requestId}] Handling ${req.method} ${req.path}`, {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      memory: process.memoryUsage()
    });
    
    await ensureInitialized();
    return app(req, res);
  } catch (error) {
    console.error(`[${requestId}] Serverless function error:`, {
      error,
      stack: error.stack,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      memory: process.memoryUsage()
    });
    
    res.status(500).json({ 
      error: "Internal Server Error",
      requestId,
      ...(process.env.NODE_ENV === 'development' && {
        details: error.message,
        stack: error.stack
      })
    });
  }
} 