import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all albums
  app.get("/api/albums", async (req, res) => {
    try {
      const albums = await storage.getAllAlbums();
      res.json(albums);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch albums" });
    }
  });

  // Get single album
  app.get("/api/albums/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const album = await storage.getAlbum(id);
      
      if (!album) {
        res.status(404).json({ error: "Album not found" });
        return;
      }
      
      res.json(album);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch album" });
    }
  });

  // Purchase album endpoint
  app.post("/api/purchase/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const album = await storage.getAlbum(id);
      
      if (!album) {
        res.status(404).json({ error: "Album not found" });
        return;
      }
      
      if (!album.isReleased) {
        res.status(400).json({ error: "Album not yet released" });
        return;
      }
      
      // Simulate purchase process
      res.json({ 
        success: true, 
        message: "Purchase successful",
        downloadUrl: `/download/${album.id}`
      });
    } catch (error) {
      res.status(500).json({ error: "Purchase failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
