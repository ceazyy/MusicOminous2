import express from "express";
import { registerRoutes } from "../server/routes.js";
import { storage } from "../server/storage.js";

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
    stack: err.stack
  });
  
  res.status(status).json({ 
    error: message,
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize routes and storage
let routesInitialized = false;
let routesPromise = null;

async function ensureInitialized() {
  if (!routesInitialized) {
    if (!routesPromise) {
      console.log("Initializing routes and storage...");
      routesPromise = Promise.all([
        registerRoutes(app),
        storage.getAllAlbums().catch(error => {
          console.error("Storage initialization error:", error);
          throw error;
        })
      ]).catch(error => {
        console.error("Failed to initialize:", error);
        throw error;
      });
    }
    await routesPromise;
    routesInitialized = true;
    console.log("Routes and storage initialized successfully");
  }
}

// Export the Express app as a Vercel serverless function
export default async function handler(req, res) {
  try {
    console.log(`Handling ${req.method} ${req.path}`);
    await ensureInitialized();
    return app(req, res);
  } catch (error) {
    console.error("Serverless function error:", {
      error,
      stack: error.stack,
      path: req.path,
      method: req.method
    });
    res.status(500).json({ 
      error: "Internal Server Error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 