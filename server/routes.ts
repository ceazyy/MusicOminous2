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
      console.error("Error fetching albums:", error);
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
      console.error("Error fetching album:", error);
      res.status(500).json({ error: "Failed to fetch album" });
    }
  });

  // Purchase endpoint (placeholder for CashFree integration)
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
      
      // TODO: Implement CashFree payment flow
      res.json({ 
        success: true, 
        message: "Payment system upgrade in progress",
        album: {
          id: album.id,
          title: album.title,
          price: album.price,
          coverImage: album.coverImage
        }
      });
    } catch (error) {
      console.error("Error processing purchase:", error);
      res.status(500).json({ error: "Purchase failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
